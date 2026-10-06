import { useEffect, useId, useState } from 'react';
import { api } from '../lib/api';
import { ORDER_STATUSES, STATUS_TRANSITIONS, formatOrderPrice, formatOrderDate } from './orderUtils';

export function AccountIcon({ name = 'box', size = 20, ...props }) {
  const icons = {
    box: <><path d="m12 3 9 5v9l-9 5-9-5V8l9-5Z" /><path d="m3 8 9 5 9-5M12 13v9M7.5 5.5l9 5" /></>,
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    chevron: <path d="m7 10 5 5 5-5" />,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></>,
    logout: <><path d="M10 4H4v16h6M10 12h11m-4-4 4 4-4 4" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    refresh: <><path d="M20 7V3m0 4h-4M4 17v4m0-4h4M4.7 8a8 8 0 0 1 13-3l2.3 2M4 17l2.3 2a8 8 0 0 0 13-3" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{icons[name] || icons.box}</svg>;
}

export function OrderStatus({ status }) {
  return <span className={`nw-order-status nw-order-status--${status}`}><span aria-hidden="true" />{ORDER_STATUSES.find(item => item.value === status)?.label || status}</span>;
}

export function OrderLoading() {
  return <div className="nw-order-loading" role="status"><span className="nw-account-spinner" aria-hidden="true" />Loading your orders…</div>;
}

function OrderDetails({ order, admin }) {
  const shipping = order.shipping || {};
  const items = order.items || [];
  return <div className="nw-order-details">
    {order.status !== 'cancelled' && <ol className="nw-order-progress" aria-label="Order progress">{ORDER_STATUSES.slice(0, -1).map((step, index) => {
      const current = ORDER_STATUSES.findIndex(item => item.value === order.status);
      return <li key={step.value} className={index <= current ? 'is-reached' : ''} aria-current={index === current ? 'step' : undefined}><span aria-hidden="true">{index < current ? <AccountIcon name="check" size={12} /> : index + 1}</span><span>{step.label}</span></li>;
    })}</ol>}
    <div className="nw-order-items" aria-label="Ordered items">{items.map((item, index) => <div className="nw-order-item" key={`${item.productId}-${index}`}>
      <div className="nw-order-item-image">{item.image ? <img src={item.image} alt="" loading="lazy" width="64" height="86" /> : <AccountIcon name="box" size={26} />}</div>
      <div className="nw-order-item-copy"><span>{item.woodType}</span><h3>{item.name}</h3><p>{item.size || 'Size to be confirmed'}</p><p>Qty {item.quantity} <span aria-hidden="true">·</span> {formatOrderPrice(item.unitPrice)} each</p></div>
      <strong>{formatOrderPrice(item.lineTotal)}</strong>
    </div>)}</div>
    <div className="nw-order-information">
      <div><h3>Delivery details</h3><address><strong>{shipping.name || order.customer?.name}</strong>{shipping.address && <span>{shipping.address}</span>}<span>{[shipping.city, shipping.postalCode].filter(Boolean).join(' · ')}</span>{shipping.phone && <a href={`tel:${shipping.phone.replace(/[^\d+]/g, '')}`}>{shipping.phone}</a>}</address>{admin && order.customer?.email && <a className="nw-order-email" href={`mailto:${order.customer.email}`}>{order.customer.email}</a>}</div>
      <div className="nw-order-totals"><div><span>Product subtotal</span><strong>{formatOrderPrice(order.subtotal)}</strong></div><p>GST and delivery are extra. Our team will confirm the final amount and delivery arrangements.</p></div>
    </div>
    {order.notes && <div className="nw-order-note"><h3>Order notes</h3><p>{order.notes}</p></div>}
  </div>;
}

export function OrderCard({ order, admin = false, onStatusUpdated, initiallyOpen = false }) {
  const regionId = useId();
  const [open, setOpen] = useState(initiallyOpen);
  const [detail, setDetail] = useState(order.items ? order : null);
  const [loading, setLoading] = useState(initiallyOpen && !order.items);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  const [statusSelection, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saved, setSaved] = useState('');
  const allowedStatuses = STATUS_TRANSITIONS[order.status] || [];
  const status = allowedStatuses.includes(statusSelection) ? statusSelection : order.status;
  const displayedOrder = order.items ? order : detail ? { ...detail, status: order.status } : null;

  useEffect(() => {
    if (!open || order.items) return undefined;
    let current = true;
    api(`/orders/${encodeURIComponent(order.id)}`).then(result => {
      if (current) setDetail(result.order);
    }).catch(reason => {
      if (current) setError(reason.message || 'We could not load this order. Please try again.');
    }).finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [open, order.id, order.items, reload]);

  const updateStatus = async event => {
    event.preventDefault();
    setSaving(true);
    setSaveError('');
    setSaved('');
    try {
      const result = await api(`/admin/orders/${encodeURIComponent(order.id)}`, { method: 'PATCH', body: { status } });
      setDetail(result.order);
      setStatus(null);
      setSaved('Order status updated.');
      onStatusUpdated?.(result.order);
    } catch (reason) {
      setSaveError(reason.message || 'The status could not be updated. Please try again.');
    } finally { setSaving(false); }
  };

  return <article className={`nw-order-card ${open ? 'is-open' : ''}`}>
    <button type="button" className="nw-order-summary" aria-expanded={open} aria-controls={regionId} onClick={() => { if (!open && !order.items) { setLoading(true); setError(''); } setOpen(value => !value); }}>
      <span className="nw-order-symbol"><AccountIcon name="box" size={23} /></span>
      <span className="nw-order-identification"><strong>{order.orderNumber}</strong><span>{formatOrderDate(order.createdAt)}{admin && order.customer?.name ? ` · ${order.customer.name}` : ''}</span></span>
      <OrderStatus status={order.status} />
      <span className="nw-order-summary-price">{formatOrderPrice(order.subtotal)}<span>Product subtotal</span></span>
      <span className="nw-order-expand"><span>{open ? 'Close details' : 'View details'}</span><AccountIcon name="chevron" size={18} /></span>
    </button>
    {open && <div id={regionId} className="nw-order-body">
      {loading ? <OrderLoading /> : error ? <div className="nw-account-error" role="alert"><p>{error}</p><button type="button" className="nw-account-text-button" onClick={() => { setLoading(true); setError(''); setReload(value => value + 1); }}>Try again <AccountIcon name="refresh" size={15} /></button></div> : displayedOrder ? <OrderDetails order={displayedOrder} admin={admin} /> : null}
      {admin && allowedStatuses.length > 0 && <form className="nw-order-status-form" onSubmit={updateStatus}>
        <div><label htmlFor={`${regionId}-status`}>Update order status</label><p>Changes are also visible in the customer’s account.</p></div>
        <div className="nw-order-status-controls"><select id={`${regionId}-status`} value={status} onChange={event => { setStatus(event.target.value); setSaved(''); }} disabled={saving}>{ORDER_STATUSES.filter(item => item.value === order.status || allowedStatuses.includes(item.value)).map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select><button type="submit" className="nw-account-button" disabled={saving || status === order.status}>{saving ? 'Saving…' : 'Save status'}<AccountIcon name="check" size={16} /></button></div>
        {saveError && <p className="nw-account-inline-error" role="alert">{saveError}</p>}{saved && <p className="nw-account-inline-success" role="status">{saved}</p>}
      </form>}
      {admin && allowedStatuses.length === 0 && <p className="nw-order-final-note">This order is {order.status}. Its status is final.</p>}
    </div>}
  </article>;
}
