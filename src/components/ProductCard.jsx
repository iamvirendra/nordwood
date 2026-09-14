import { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

export default function ProductCard({ product, onAddToCart, imageSrc, imageAlt, imageLabel, index = 0 }) {
  const [added, setAdded] = useState(false);
  const variants = product.variants || [product];
  const variantCount = variants.length;
  const formatPrice = price => '₹' + price.toLocaleString('en-IN');
  const heights = [...new Set(variants.map(variant => variant.height).filter(Boolean))];
  const productUrl = `/product/${product.id}`;
  return (
    <article className="product-card" data-motion="rise" style={{ '--card-delay': `${Math.min(index % 3, 2) * 90}ms` }}>
      <Link to={productUrl} className="product-image-container" aria-label={`View ${product.name}`}>
        <img src={imageSrc || product.image} alt={imageAlt || product.images?.[0]?.alt || product.name} className="product-image" loading="lazy" width="600" height="900" />
        {(imageLabel || product.illustrativeImages) && <span className="product-image-label">{imageLabel || 'Illustrative photo'}</span>}
      </Link>
      <div className="product-info">
        <div className="product-category"><span className="category-badge">{product.doorType || product.category.replace(/([a-z])([A-Z])/g, '$1 $2')}</span><span className="wood-badge">{product.woodType}</span></div>
        <h3 className="product-name"><Link to={productUrl}>{product.name}</Link></h3>
        <p className="product-description">{product.description}</p>
        <div className="product-specs">
          {variantCount > 1 ? <><span>{variantCount} standard sizes</span>{heights.length > 0 && <span>{heights.join(' / ')} heights</span>}</> : <><span>{product.height && product.width ? `${product.height} × ${product.width}` : product.size}</span>{product.woodCFT && <span>{product.woodCFT} CFT</span>}</>}
        </div>
        <div className="product-footer">
          <div className="price-section"><span className="product-price">{variantCount > 1 && <small>From </small>}{formatPrice(product.price)}</span><ul className="product-tax-note"><li>GST extra</li></ul></div>
          {variantCount > 1 ? <Link to={productUrl} className="add-to-cart-btn">Choose size <span aria-hidden="true">↗</span></Link> : <button type="button" className="add-to-cart-btn" onClick={() => { onAddToCart(product); setAdded(true); }}>{added ? 'Add another' : 'Add to bag'} <span aria-hidden="true">+</span></button>}
        </div>
        {added && <p className="card-added-message" role="status">Added to your bag. <Link to="/cart">View bag</Link></p>}
      </div>
    </article>
  );
}
