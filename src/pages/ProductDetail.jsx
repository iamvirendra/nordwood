import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { products } from '../data/products';
import { getCategoryLabel, getProductFamilies, getProductFamilyById, getVariantSizeLabel } from '../data/catalog';
import ProductCard from '../components/ProductCard';
import './ProductDetail.css';

const formatPrice = price => '₹' + price.toLocaleString('en-IN');

export default function ProductDetail({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const family = getProductFamilyById(id);
  const baseProduct = family?.variants.find(product => product.id === Number(id));
  const [selection, setSelection] = useState({ routeId: null, variantId: null });
  const [gallery, setGallery] = useState({ familyKey: null, index: 0 });
  const [quantity, setQuantity] = useState('1');
  const [added, setAdded] = useState(null);

  if (!family || !baseProduct) return <div className="product-detail-error"><p className="eyebrow">NordWood collection</p><h1>This piece couldn’t be found.</h1><p>Explore the collection to find your woodwork.</p><Link to="/shop">Back to the collection ↗</Link></div>;

  const selected = (selection.routeId === id && family.variants.find(product => product.id === selection.variantId)) || baseProduct;
  const images = selected.images || [{ src: selected.image, alt: family.name, label: 'Product view' }];
  const imageIndex = gallery.familyKey === family.key ? Math.min(gallery.index, images.length-1) : 0;
  const activeImage = images[imageIndex];
  const changeImage = index => setGallery({ familyKey: family.key, index: (index+images.length)%images.length });
  const chooseVariant = variant => { setSelection({ routeId: id, variantId: variant.id }); setAdded(null); };
  const isDoor = selected.category === 'Door';
  const heights = [...new Set(family.variants.map(product => product.height).filter(Boolean))];
  const widthVariants = family.variants.filter(product => product.height === selected.height);
  const related = getProductFamilies(products).filter(product => product.category === selected.category && product.key !== family.key).slice(0,3);
  const amount = Number(quantity);
  const validQuantity = Number.isInteger(amount) && amount >= 1 && amount <= 99;
  const switchDesign = (woodType, doorType) => {
    const matching = products.filter(product => product.category === 'Door' && product.woodType === woodType && product.doorType === doorType);
    const match = matching.find(product => product.height === selected.height && product.width === selected.width) || matching[0];
    if (match) { setAdded(null); navigate(`/product/${match.id}`); }
  };
  const addToBag = () => {
    if (!validQuantity) return;
    onAddToCart(selected, amount);
    setAdded({ id: selected.id, quantity: amount });
  };

  return <div className="product-detail">
    <nav className="pd-breadcrumb" data-page-enter aria-label="Breadcrumb"><Link to="/shop">Collection</Link><span aria-hidden="true">/</span><Link to={`/shop?category=${selected.category}`}>{getCategoryLabel(selected.category)}</Link><span aria-hidden="true">/</span><span>{family.name}</span></nav>
    <div className="pd-layout">
      <div className="pd-gallery-section">
        <div className="pd-gallery" data-page-enter role="region" aria-label="Product photographs" tabIndex={0} aria-keyshortcuts="ArrowLeft ArrowRight" onKeyDown={event => { if (event.key==='ArrowRight' || event.key==='ArrowLeft') { event.preventDefault(); changeImage(imageIndex+(event.key==='ArrowRight'?1:-1)); } }}>
          <div className="pd-main-image"><img key={activeImage.src} src={activeImage.src} alt={activeImage.alt} width="600" height="800" fetchPriority="high" /><span className="pd-image-badge">{selected.illustrativeImages ? 'Illustrative photo' : activeImage.label}</span><div className="pd-image-controls"><span aria-live="polite">{String(imageIndex+1).padStart(2,'0')} / {String(images.length).padStart(2,'0')}</span><button type="button" onClick={()=>changeImage(imageIndex-1)} aria-label="Previous photograph">←</button><button type="button" onClick={()=>changeImage(imageIndex+1)} aria-label="Next photograph">→</button></div></div>
          <div className="pd-thumbnails">{images.map((image,index)=><button key={`${image.src}-${index}`} type="button" className={imageIndex===index?'is-selected':''} aria-label={`Show photograph ${index+1}: ${image.label}`} aria-pressed={imageIndex===index} onClick={()=>changeImage(index)}><img src={image.src} alt="" width="100" height="110" loading="lazy" /><span>{image.label}</span></button>)}</div>
        </div>
        {selected.illustrativeImages && <p className="pd-photo-note">Illustrative photos for reference. Final wood grain and finish may vary.</p>}
      </div>
      <section className="pd-information" data-page-enter aria-labelledby="product-title">
        <p className="eyebrow">{selected.woodType} / {selected.doorType || getCategoryLabel(selected.category)}</p><h1 id="product-title">{family.name}</h1><p className="pd-description">{selected.description}</p>
        <div className="pd-price-block"><div><span className="pd-price" key={selected.price}>{formatPrice(selected.price)}</span><span className="pd-per-item">per {selected.doorType==='Double Door'?'double-door set':'item'}</span></div><ul><li>GST extra</li></ul></div>
        {isDoor && <div className="pd-design-options"><label htmlFor="pd-wood">Wood type<select id="pd-wood" value={selected.woodType} onChange={event=>switchDesign(event.target.value,selected.doorType)}>{['Plantation Teak','Forest Teak','Imported Teak'].map(wood=><option key={wood}>{wood}</option>)}</select></label><label htmlFor="pd-style">Door style<select id="pd-style" value={selected.doorType} onChange={event=>switchDesign(selected.woodType,event.target.value)}><option>Single Door</option><option>Double Door</option></select></label></div>}
        <div className="pd-size-section"><div className="pd-section-label"><h2>Choose your size</h2><span>{family.variants.length} standard option{family.variants.length!==1?'s':''}</span></div>
          {isDoor ? <><fieldset><legend>Door height</legend><div className="pd-size-buttons">{heights.map(height=><button type="button" key={height} aria-pressed={selected.height===height} className={selected.height===height?'is-selected':''} onClick={()=>chooseVariant(family.variants.find(product=>product.height===height && product.width===selected.width) || family.variants.find(product=>product.height===height))}>{height}</button>)}</div></fieldset><fieldset><legend>Door width</legend><div className="pd-size-buttons">{widthVariants.map(variant=><button type="button" key={variant.id} aria-pressed={selected.id===variant.id} className={selected.id===variant.id?'is-selected':''} onClick={()=>chooseVariant(variant)}>{variant.width}</button>)}</div></fieldset></> : <div className="pd-size-buttons">{family.variants.map(variant=><button type="button" key={variant.id} aria-pressed={selected.id===variant.id} className={selected.id===variant.id?'is-selected':''} onClick={()=>chooseVariant(variant)}>{getVariantSizeLabel(variant) || variant.name}</button>)}</div>}
          <div className="pd-selection-summary" aria-live="polite"><span>{selected.height && selected.width ? `${selected.height} high × ${selected.width} wide` : selected.size || getVariantSizeLabel(selected)}</span>{selected.woodCFT && <strong>{selected.woodCFT} CFT of wood</strong>}</div>
          <p className="pd-size-help">Need a different dimension? <Link to="/contact">Discuss a custom size ↗</Link></p>
        </div>
        <div className="pd-purchase"><div className="pd-quantity"><label htmlFor="pd-quantity">Quantity</label><div><button type="button" disabled={!validQuantity || amount<=1} onClick={()=>setQuantity(String(amount-1))} aria-label="Decrease quantity">−</button><input id="pd-quantity" type="number" min="1" max="99" step="1" inputMode="numeric" value={quantity} onChange={event=>setQuantity(event.target.value)} /><button type="button" disabled={!validQuantity || amount>=99} onClick={()=>setQuantity(String(amount+1))} aria-label="Increase quantity">+</button></div></div><button type="button" className="pd-add-button" onClick={addToBag} disabled={!validQuantity}>Add to bag <span aria-hidden="true">↗</span></button></div>
        {!validQuantity && <p className="pd-validation" role="alert">Enter a quantity from 1 to 99.</p>}
        {added?.id===selected.id && <p className="pd-added" role="status">{added.quantity} item{added.quantity!==1?'s':''} added to your bag. <Link to="/cart">View bag ↗</Link></p>}
        <div className="pd-specifications" data-motion="rise"><h2>The details</h2><dl><div><dt>Wood type</dt><dd>{selected.woodType}</dd></div>{selected.doorType && <div><dt>Door style</dt><dd>{selected.doorType}</dd></div>}{selected.height && <div><dt>Door height</dt><dd>{selected.height}</dd></div>}{selected.width && <div><dt>Door width</dt><dd>{selected.width}</dd></div>}{selected.woodCFT && <div><dt>Wood volume</dt><dd>{selected.woodCFT} CFT (cubic feet)</dd></div>}{selected.size && <div><dt>Dimensions</dt><dd>{selected.size}</dd></div>}{selected.rebateType && <div><dt>Rebate</dt><dd>{selected.rebateType}</dd></div>}<div><dt>Price basis</dt><dd>Selected standard size · GST extra</dd></div></dl></div>
      </section>
    </div>
    {related.length>0 && <section className="pd-related"><div className="pd-related-heading" data-motion="rise"><div><p className="eyebrow">More to consider</p><h2>Find your natural fit.</h2></div><Link to={`/shop?category=${selected.category}`}>View the collection ↗</Link></div><div className="pd-related-grid">{related.map((product,index)=><ProductCard index={index} key={product.key} product={product} onAddToCart={onAddToCart} />)}</div></section>}
  </div>;
}
