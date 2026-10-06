import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { AccountIcon, OrderCard, OrderLoading } from '../components/OrderDetails';
import { ORDER_STATUSES } from '../components/orderUtils';
import './Account.css';

export default function Admin() {
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null);
  const [loadedQuery, setLoadedQuery] = useState(null);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [notice, setNotice] = useState('');
  const requestKey = JSON.stringify([page, appliedSearch, status, refresh]);
  const loading = requestKey !== loadedQuery;

  useEffect(() => {
    let current = true;
    const query = new URLSearchParams({ page: String(page), search: appliedSearch, status });
    api(`/admin/orders?${query}`).then(data => {
      if (!current) return;
      const lastPage = Math.max(1, Math.ceil(data.total / (data.pageSize || 20)));
      if (page > lastPage) { setPage(lastPage); return; }
      setResult(data);
      setError('');
      setLoadedQuery(requestKey);
    }).catch(reason => {
      if (current) { setError(reason.message || 'We could not load orders. Please try again.'); setLoadedQuery(requestKey); }
    });
    return () => { current = false; };
  }, [page, appliedSearch, status, requestKey]);

  const searchOrders = event => { event.preventDefault(); setAppliedSearch(search.trim()); setPage(1); setNotice(''); };
  const resetFilters = () => { setSearch(''); setAppliedSearch(''); setStatus(''); setPage(1); };
  const updateOrder = updated => {
    setNotice(`${updated.orderNumber} has been updated.`);
    setResult(current => {
      if (!current) return current;
      const previous = current.orders.find(order => order.id === updated.id);
      const stats = { ...current.stats };
      if (previous && previous.status !== updated.status) {
        const active = ['confirmed', 'in_production', 'ready'];
        if (previous.status === 'pending') stats.pending -= 1;
        if (updated.status === 'pending') stats.pending += 1;
        if (active.includes(previous.status)) stats.active -= 1;
        if (active.includes(updated.status)) stats.active += 1;
        if (previous.status === 'completed') stats.completed -= 1;
        if (updated.status === 'completed') stats.completed += 1;
      }
      return { ...current, stats, orders: current.orders.map(order => order.id === updated.id ? updated : order) };
    });
    if (status && updated.status !== status) setRefresh(value => value + 1);
  };
  const pageSize = result?.pageSize || 20;
  const total = result?.total || 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const stats = result?.stats;
  const hasFilter = Boolean(appliedSearch || status);

  return <div className="nw-account-page nw-admin-page">
    <header className="nw-account-heading"><div><p className="eyebrow">NordWood / Administration</p><h1>Every order.<br /><em>Every detail.</em></h1><p>A considered view of the work taking shape.</p></div><Link className="nw-account-text-button" to="/account">My account<AccountIcon name="arrow" /></Link></header>
    <section className="nw-admin-overview" aria-label="Order overview">
      <div className="nw-admin-stat nw-admin-stat--featured"><div><span>All orders</span><AccountIcon name="box" /></div><strong>{stats ? stats.total : '—'}</strong><p>Every project starts here.</p></div>
      <div className="nw-admin-stat"><div><span>Awaiting confirmation</span><AccountIcon name="clock" /></div><strong>{stats ? stats.pending : '—'}</strong><p>Ready for your attention</p></div>
      <div className="nw-admin-stat"><div><span>In progress</span><AccountIcon name="refresh" /></div><strong>{stats ? stats.active : '—'}</strong><p>Confirmed, in production or ready</p></div>
      <div className="nw-admin-stat"><div><span>Completed</span><AccountIcon name="check" /></div><strong>{stats ? stats.completed : '—'}</strong><p>Orders marked complete</p></div>
    </section>
    <section className="nw-admin-orders" aria-labelledby="admin-orders-title">
      {notice && <p className="nw-account-notice" role="status"><AccountIcon name="check" size={18} />{notice}</p>}
      <div className="nw-account-section-heading"><div><p className="eyebrow">The order book</p><h2 id="admin-orders-title">Manage orders</h2></div><button className="nw-account-text-button" type="button" disabled={loading} onClick={() => setRefresh(value => value + 1)}><AccountIcon name="refresh" size={17} />Refresh</button></div>
      <div className="nw-admin-toolbar"><form className="nw-admin-search" onSubmit={searchOrders}><label className="nw-account-sr-only" htmlFor="admin-order-search">Search by order number, customer name or email</label><AccountIcon name="search" /><input id="admin-order-search" type="search" placeholder="Search orders, names or email…" value={search} onChange={event => setSearch(event.target.value)} maxLength={200} /><button type="submit">Search<AccountIcon name="arrow" size={15} /></button></form><div className="nw-admin-status-filter"><label htmlFor="admin-status-filter">Status</label><select id="admin-status-filter" value={status} onChange={event => { setStatus(event.target.value); setPage(1); }}><option value="">All statuses</option>{ORDER_STATUSES.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div></div>
      <div className="nw-admin-list-meta"><p aria-live="polite">{loading ? 'Loading orders…' : error ? 'Orders unavailable' : `${total} ${total === 1 ? 'order' : 'orders'}${hasFilter ? ' matching your filters' : ' in the order book'}`}{appliedSearch && <span> for “{appliedSearch}”</span>}</p>{hasFilter && <button type="button" onClick={resetFilters}>Clear filters <span aria-hidden="true">×</span></button>}</div>
      {loading ? <OrderLoading /> : error ? <div className="nw-account-error" role="alert"><AccountIcon name="box" size={30} /><h3>The order book couldn’t be loaded.</h3><p>{error}</p><button className="nw-account-text-button" type="button" onClick={() => setRefresh(value => value + 1)}>Try again<AccountIcon name="refresh" size={16} /></button></div> : result?.orders.length ? <div className="nw-order-list nw-order-list--admin">{result.orders.map(order => <OrderCard key={order.id} order={order} admin onStatusUpdated={updateOrder} />)}</div> : <div className="nw-account-empty nw-admin-empty"><span className="nw-account-empty-icon"><AccountIcon name="box" size={34} /></span><h3>{hasFilter ? 'No orders found.' : 'A fresh page.'}</h3><p>{hasFilter ? 'Try another name, order number or status to find the order you need.' : 'When customers place their first orders, all the details will be waiting here.'}</p>{hasFilter && <button className="nw-account-button" type="button" onClick={resetFilters}>Show all orders<AccountIcon name="arrow" size={18} /></button>}</div>}
      {!loading && !error && total > 0 && <nav className="nw-admin-pagination" aria-label="Order pages"><p>Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}</p><div><button type="button" onClick={() => setPage(value => Math.max(1, value - 1))} disabled={page <= 1} aria-label="Previous page"><span aria-hidden="true">←</span></button><span>Page {page} of {pageCount}</span><button type="button" onClick={() => setPage(value => value + 1)} disabled={page >= pageCount} aria-label="Next page"><span aria-hidden="true">→</span></button></div></nav>}
    </section>
    <footer className="nw-admin-footnote"><span>NordWood / A material point of view</span><p>Order amounts are product subtotals. GST and delivery are confirmed separately.</p></footer>
  </div>;
}
