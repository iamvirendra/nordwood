import { Link } from 'react-router-dom';
import CartOrderEnquiry from '../components/CartOrderEnquiry';
import { createCartEnquiry, formatCartPrice } from '../components/cartEnquiryUtils';
import './Cart.css';

export default function Cart({ cartItems, onRemoveFromCart, onUpdateQuantity, onClearCart }) {
  const formatPrice = formatCartPrice;
  const enquiry = createCartEnquiry(cartItems);
  const subtotal = enquiry?.subtotal || 0;
  const itemCount = enquiry?.itemCount || 0;

  if (!cartItems.length) return <section className="cart cart-empty" data-page-enter><p className="eyebrow">Your selection</p><h1>A little room<br /><em>for something beautiful.</em></h1><p>Your bag is empty. Explore our woodwork and choose a size that fits your space.</p><Link to="/shop" className="continue-shopping-btn">Explore the collection <span aria-hidden="true">↗</span></Link></section>;

  return <div className="cart">
    <div className="cart-header" data-page-enter><div><p className="eyebrow">Thoughtfully chosen</p><h1>Your bag.</h1><p>{itemCount} item{itemCount !== 1 ? 's' : ''} for your space</p></div><Link to="/shop" className="continue-shopping">Continue shopping <span aria-hidden="true">↗</span></Link></div>
    <div className={`cart-container${cartItems.length === 1 ? ' cart-container--single' : ''}`}>
      <section className="cart-items-section" aria-label="Items in your bag">
        {cartItems.map(item => <article key={item.id} className="cart-line" data-motion="rise">
          <Link to={`/product/${item.id}`} className="cart-line-image"><img src={item.image} alt={item.images?.[0]?.alt || item.name} width="100" height="150" /></Link>
          <div className="cart-line-info"><span className="cart-wood">{item.woodType}</span><h2><Link to={`/product/${item.id}`}>{item.name}</Link></h2><p>{item.height && item.width ? `${item.height} height × ${item.width} width` : item.size}{item.woodCFT ? ` · ${item.woodCFT} CFT` : ''}</p><span className="cart-unit-price">{formatPrice(item.price)} each</span><button type="button" className="remove-btn" onClick={() => onRemoveFromCart(item.id)} aria-label={`Remove ${item.name}`}>Remove</button></div>
          <div className="cart-line-order"><div className="quantity-control"><button type="button" disabled={item.quantity === 1} onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} aria-label={`Decrease quantity of ${item.name}`}>−</button><span aria-label={`Quantity ${item.quantity}`}>{item.quantity}</span><button type="button" disabled={item.quantity >= 99} onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} aria-label={`Increase quantity of ${item.name}`}>+</button></div><strong>{formatPrice(item.price * item.quantity)}</strong></div>
        </article>)}
        <div className="cart-actions"><ul className="cart-tax-note"><li>GST extra</li></ul><button type="button" className="clear-cart" onClick={onClearCart}>Clear bag</button></div>
      </section>
      <aside className="cart-summary" data-motion="rise"><p className="eyebrow">The details</p><h2>Order summary</h2><div className="summary-item"><span>{itemCount} item{itemCount !== 1 ? 's' : ''}</span><span>{formatPrice(subtotal)}</span></div><div className="summary-item"><span>GST</span><span>Extra</span></div><div className="summary-item"><span>Delivery</span><span>Confirmed with your order</span></div><div className="summary-total"><span>Subtotal</span><strong key={subtotal}>{formatPrice(subtotal)}</strong></div><p className="summary-note">Excludes GST and delivery. Our team will confirm the final amount and arrangements for your order.</p><Link to="/contact" className="cart-contact">Need help choosing a size?</Link></aside>
    </div>
    <CartOrderEnquiry key={enquiry.body} enquiry={enquiry} />
  </div>;
}
