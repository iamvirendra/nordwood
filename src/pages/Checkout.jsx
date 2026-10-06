import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/context';
import { api } from '../lib/api';
import { formatCartPrice } from '../components/cartEnquiryUtils';
import './Checkout.css';

export default function Checkout({ cartItems, onClearCart }) {
  const { user } = useAuth();
  const requestId = useRef(crypto.randomUUID());
  const [shipping, setShipping] = useState({ name: user.name, phone: '', address: '', city: '', postalCode: '' });
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);
  const subtotal = cartItems.reduce((total, item) => total + Math.round(item.price * 100) * item.quantity, 0) / 100;

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const data = await api('/orders', { method: 'POST', body: { items: cartItems.map(item => ({ productId: item.id, quantity: item.quantity })), shipping, notes, requestId: requestId.current } });
      setOrder(data.order);
      onClearCart();
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (failure) {
      setError(failure.message);
    } finally { setBusy(false); }
  }

  if (order) return <section className="checkout checkout-success" aria-labelledby="order-success-title"><span className="checkout-success__mark" aria-hidden="true">✓</span><p className="eyebrow">Your next chapter, in wood</p><h1 id="order-success-title" tabIndex="-1" ref={element => element?.focus()}>Every detail.<br /><em>In good hands.</em></h1><p role="status">Your order request <strong>{order.orderNumber}</strong> is saved. Our team will review your selection and confirm availability, GST, delivery, and the final quote.</p><div className="checkout-success__receipt"><span>Request subtotal</span><strong>{formatCartPrice(order.subtotal)}</strong></div><p className="checkout-fineprint">No payment has been collected. Follow updates in your account.</p><Link to="/account" className="checkout-button">View my orders <span aria-hidden="true">↗</span></Link><Link to="/shop" className="checkout-back">Back to the collection</Link></section>;

  if (!cartItems.length) return <section className="checkout checkout-success"><p className="eyebrow">A fresh beginning</p><h1>Your selection<br /><em>starts here.</em></h1><p>Add woodwork to your bag before requesting an order.</p><Link to="/shop" className="checkout-button">Explore the collection ↗</Link></section>;

  const field = (name, label, options = {}) => <label className={`checkout-field ${options.wide ? 'checkout-field--wide' : ''}`} htmlFor={`checkout-${name}`}><span>{label}</span><input id={`checkout-${name}`} name={name} value={shipping[name]} onChange={event => setShipping(current => ({ ...current, [name]: event.target.value }))} required disabled={busy} type={options.type || 'text'} autoComplete={options.autoComplete} maxLength={options.maxLength || 100} minLength={options.minLength || 2} pattern={options.pattern} inputMode={options.inputMode} placeholder={options.placeholder} title={options.title} /></label>;

  return <section className="checkout"><Link to="/cart" className="checkout-back">← Back to your bag</Link><header className="checkout-heading"><p className="eyebrow">Made for your space</p><h1>A little closer<br /><em>to home.</em></h1><p>Leave the details with us. We’ll be in touch to bring your selection to life.</p></header><div className="checkout-layout"><form onSubmit={submit} className="checkout-form"><div className="checkout-section-title"><span>01</span><div><h2>Where your story begins</h2><p>Your contact and delivery details</p></div></div><div className="checkout-fields">{field('name', 'Full name', { autoComplete: 'name' })}{field('phone', 'Phone number', { type: 'tel', autoComplete: 'tel', maxLength: 20, minLength: 7, placeholder: '+91', pattern: '[+0-9 ()-]{7,20}', title: 'Enter a phone number with 7–20 digits and optional +, spaces, brackets or dashes.' })}{field('address', 'Delivery address', { autoComplete: 'street-address', wide: true, maxLength: 500, minLength: 5, placeholder: 'House, street, and neighbourhood' })}{field('city', 'City', { autoComplete: 'address-level2' })}{field('postalCode', 'PIN / postal code', { autoComplete: 'postal-code', maxLength: 12, minLength: 3 })}<label className="checkout-field checkout-field--wide" htmlFor="checkout-notes"><span>A note for our team <small>Optional</small></span><textarea id="checkout-notes" name="notes" rows="3" maxLength="2000" value={notes} disabled={busy} onChange={event => setNotes(event.target.value)} placeholder="Access instructions, preferred timing, or a detail we should know…" /></label></div><div className="checkout-contact-note"><span aria-hidden="true">✉</span><p>Updates are linked to <strong>{user.email}</strong>. You can follow your request in your account.</p></div>{error && <p className="checkout-error" role="alert">{error}</p>}<button type="submit" className="checkout-button" disabled={busy} aria-busy={busy}>{busy ? 'Saving your request…' : 'Submit order request'}<span aria-hidden="true">↗</span></button><p className="checkout-fineprint">This is an order request. Availability, GST, and delivery will be confirmed by our team. No payment is required here.</p></form><aside className="checkout-summary"><p className="eyebrow">Thoughtfully chosen</p><h2>Your selection</h2><div className="checkout-products">{cartItems.map(item => <article key={item.id} className="checkout-product"><img src={item.image} alt="" width="60" height="76" /><div><p>{item.name}</p><span>Qty {item.quantity} · {item.woodType}</span><strong>{formatCartPrice(item.price * item.quantity)}</strong></div></article>)}</div><div className="checkout-total"><span>Subtotal</span><strong>{formatCartPrice(subtotal)}</strong></div><p className="checkout-fineprint">GST and delivery extra.<br />Final quote confirmed personally.</p><div className="checkout-summary-seal"><svg viewBox="0 0 40 48" width="30" height="38" fill="none" aria-hidden="true"><path d="M5 45V3h30v42M10 45V8h20v37M14 12h12v15H14zM14 32h12v10H14zM2 45h36" stroke="currentColor" /><circle cx="27" cy="30" r="1" fill="currentColor" /></svg><span>Natural materials.<br />Personal attention.</span></div></aside></div></section>;
}
