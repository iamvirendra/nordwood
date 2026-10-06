import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/context';
import { api } from '../lib/api';
import { AccountIcon, OrderCard, OrderLoading } from '../components/OrderDetails';
import './Account.css';

function PasswordSettings() {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [values, setValues] = useState({ currentPassword: '', password: '', confirm: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const update = event => {
    setValues(current => ({ ...current, [event.target.name]: event.target.value }));
    setError('');
    setSuccess('');
  };
  const submit = async event => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (values.password !== values.confirm) { setError('Your new passwords do not match. Please check them.'); return; }
    if (values.password.length < 8 || values.password.length > 128) { setError('Choose a password with 8 to 128 characters.'); return; }
    setBusy(true);
    try {
      await api('/auth/change-password', { method: 'POST', body: { currentPassword: values.currentPassword, password: values.password } });
      setValues({ currentPassword: '', password: '', confirm: '' });
      setVisible(false);
      setSuccess('Your password has been updated.');
    } catch (reason) { setError(reason.message || 'Your password could not be updated. Please try again.'); }
    finally { setBusy(false); }
  };

  return <section className="nw-account-security">
    <button className="nw-account-security-toggle" type="button" aria-expanded={expanded} aria-controls="account-password-settings" onClick={() => setExpanded(value => !value)}><AccountIcon name="lock" /><span><strong>Account security</strong><span>Manage your password</span></span><AccountIcon name="chevron" /></button>
    {expanded && <form id="account-password-settings" className="nw-account-password-form" onSubmit={submit}>
      <p>A little peace of mind. Choose a unique password with at least 8 characters.</p>
      <label htmlFor="account-current-password">Current password<input id="account-current-password" name="currentPassword" type={visible ? 'text' : 'password'} autoComplete="current-password" value={values.currentPassword} onChange={update} required maxLength={128} disabled={busy} /></label>
      <label htmlFor="account-new-password">New password<input id="account-new-password" name="password" type={visible ? 'text' : 'password'} autoComplete="new-password" value={values.password} onChange={update} required minLength={8} maxLength={128} disabled={busy} /></label>
      <label htmlFor="account-confirm-password">Confirm new password<input id="account-confirm-password" name="confirm" type={visible ? 'text' : 'password'} autoComplete="new-password" value={values.confirm} onChange={update} required minLength={8} maxLength={128} disabled={busy} /></label>
      <label className="nw-account-show-password"><input type="checkbox" checked={visible} onChange={event => setVisible(event.target.checked)} />Show passwords</label>
      {error && <p className="nw-account-inline-error" role="alert">{error}</p>}{success && <p className="nw-account-inline-success" role="status"><AccountIcon name="check" size={16} />{success}</p>}
      <button className="nw-account-button" disabled={busy} type="submit">{busy ? 'Updating…' : 'Update password'}<AccountIcon name="arrow" size={17} /></button>
    </form>}
  </section>;
}

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [signingOut, setSigningOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const firstName = user?.name?.trim().split(/\s+/)[0] || 'there';
  const initials = user?.name?.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'N';
  const reloadOrders = () => { setLoading(true); setError(''); setRefresh(value => value + 1); };

  useEffect(() => {
    let current = true;
    api('/orders').then(result => { if (current) setOrders(result.orders); }).catch(reason => {
      if (current) setError(reason.message || 'We could not load your orders. Please try again.');
    }).finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [refresh]);

  const signOut = async () => {
    setSigningOut(true);
    setLogoutError('');
    try { await logout(); navigate('/', { replace: true }); }
    catch (reason) { setLogoutError(reason.message || 'We could not sign you out. Please try again.'); setSigningOut(false); }
  };

  return <div className="nw-account-page">
    <header className="nw-account-heading"><div><p className="eyebrow">Your NordWood</p><h1>A place for <em>your plans.</em></h1><p>Your selections, your orders, and the details that make them yours.</p></div><Link className="nw-account-text-button" to="/shop">Explore the collection<AccountIcon name="arrow" /></Link></header>
    <div className="nw-account-welcome"><div className="nw-account-welcome-copy"><span className="nw-account-welcome-mark" aria-hidden="true">{initials}</span><div><p>Good to see you again</p><h2>Welcome, {firstName}.</h2></div></div><span className="nw-account-welcome-note">Thoughtfully made.<br /><em>Personally yours.</em></span><div className="nw-account-grain" aria-hidden="true" /></div>
    <div className="nw-account-layout">
      <section className="nw-account-orders" aria-labelledby="account-orders-title">
        <div className="nw-account-section-heading"><div><p className="eyebrow">From our workshop to your home</p><h2 id="account-orders-title">Your orders<span>{loading || error ? '—' : String(orders.length).padStart(2, '0')}</span></h2></div><button className="nw-account-icon-button" onClick={reloadOrders} type="button" disabled={loading} aria-label="Refresh orders"><AccountIcon name="refresh" /></button></div>
        {location.state?.orderPlaced && <p className="nw-account-notice" role="status"><AccountIcon name="check" />Your order is in. Our team will be in touch to confirm the details.</p>}
        {loading ? <OrderLoading /> : error ? <div className="nw-account-error" role="alert"><AccountIcon name="box" size={28} /><h3>Your orders couldn’t be loaded.</h3><p>{error}</p><button className="nw-account-text-button" type="button" onClick={reloadOrders}>Try again<AccountIcon name="refresh" size={16} /></button></div> : orders.length ? <div className="nw-order-list">{orders.map(order => <OrderCard key={order.id} order={order} initiallyOpen={location.state?.orderId === order.id} />)}</div> : <div className="nw-account-empty"><span className="nw-account-empty-icon"><AccountIcon name="box" size={36} /></span><p className="eyebrow">Every home has a beginning</p><h3>Make room for<br /><em>something beautiful.</em></h3><p>Your order story starts with a piece you love. Explore our woodwork and find what feels like home.</p><Link to="/shop" className="nw-account-button">Find your first piece<AccountIcon name="arrow" size={18} /></Link></div>}
        <div className="nw-account-help"><AccountIcon name="box" size={22} /><p>Questions about an order?<br /><Link to="/contact">Our team is here to help <span aria-hidden="true">↗</span></Link></p><span className="nw-account-help-note">A conversation.<br />A considered answer.</span></div>
      </section>
      <aside className="nw-account-sidebar">
        <section className="nw-account-profile"><p className="eyebrow">The personal details</p><h2>Your account</h2><div className="nw-account-profile-detail"><span>Name</span><strong>{user?.name}</strong></div><div className="nw-account-profile-detail"><span>Email address</span><strong>{user?.email}</strong></div><div className="nw-account-profile-role"><AccountIcon name="user" size={15} />{user?.role === 'admin' ? 'Administrator' : 'NordWood customer'}</div>{user?.role === 'admin' && <Link className="nw-account-button nw-account-button--light" to="/admin">Open admin panel<AccountIcon name="arrow" size={17} /></Link>}<button className="nw-account-signout" type="button" onClick={signOut} disabled={signingOut}><AccountIcon name="logout" size={17} />{signingOut ? 'Signing out…' : 'Sign out'}</button>{logoutError && <p role="alert" className="nw-account-logout-error">{logoutError}</p>}</section>
        <PasswordSettings />
        <div className="nw-account-sidebar-note"><span aria-hidden="true">N.</span><p>Natural materials.<br />Lasting connections.</p></div>
      </aside>
    </div>
  </div>;
}
