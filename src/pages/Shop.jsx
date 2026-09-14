import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../data/products';
import { categoryConfig, getProductFamilies, getCategoryLabel } from '../data/catalog';
import ProductCard from '../components/ProductCard';
import './Shop.css';

export default function Shop({ onAddToCart }) {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const category = params.has('category') ? (params.get('category') === 'all' ? '' : params.get('category')) : 'Door';
  const wood = params.get('wood') || '';
  const doorType = params.get('doorType') || '';
  const height = params.get('height') || '';
  const width = params.get('width') || '';
  const price = params.get('price') || '';
  const query = params.get('q') || '';
  const sort = params.get('sort') || 'price-low';
  const categoryProducts = products.filter(product => !category || product.category === category);
  const woods = [...new Set(categoryProducts.map(product => product.woodType))];
  const heights = [...new Set(categoryProducts.map(product => product.height).filter(Boolean))].sort((a,b) => parseFloat(a)-parseFloat(b));
  const widths = [...new Set(categoryProducts.map(product => product.width).filter(Boolean))].sort((a,b) => parseFloat(a)-parseFloat(b));
  const activeFilterCount = [wood,doorType,height,width,price,query].filter(Boolean).length;
  const updateFilter = (key, value) => {
    const next = new URLSearchParams(params);
    if (!next.has('category')) next.set('category', category || 'all');
    if (value) next.set(key, value); else next.delete(key);
    if (key === 'category') ['wood','doorType','height','width','price'].forEach(name => next.delete(name));
    setParams(next, { replace: true });
  };
  const clearFilters = () => setParams({ category: category || 'all' }, { replace: true });
  const families = useMemo(() => {
    const matching = products.filter(product => {
      if (category && product.category !== category) return false;
      if (wood && product.woodType !== wood) return false;
      if (doorType && product.doorType !== doorType) return false;
      if (height && product.height !== height) return false;
      if (width && product.width !== width) return false;
      if (price === 'under20000' && product.price >= 20000) return false;
      if (price === '20000-30000' && (product.price < 20000 || product.price > 30000)) return false;
      if (price === 'over30000' && product.price <= 30000) return false;
      return !query || `${product.name} ${product.woodType} ${product.doorType || ''} ${getCategoryLabel(product.category)}`.toLowerCase().includes(query.toLowerCase().trim());
    });
    return getProductFamilies(matching).sort((a,b) => sort === 'price-low' ? a.price-b.price : sort === 'price-high' ? b.price-a.price : a.name.localeCompare(b.name));
  }, [category,wood,doorType,height,width,price,query,sort]);

  return <div className="shop">
    <header className="shop-heading" data-page-enter><div><p className="eyebrow">The NordWood collection</p><h1>Made for <em>your home.</em></h1><p>Explore natural timber, choose your standard size, and find the right fit.</p></div><div className="shop-heading-note"><span>Plantation · Forest · Imported teak</span><strong>Single & double doors</strong><ul><li>GST extra</li></ul></div></header>
    <div className="shop-surface"><nav className="shop-category-nav" aria-label="Product categories"><button type="button" className={!category ? 'is-active' : ''} onClick={() => updateFilter('category','all')}>All woodwork</button>{categoryConfig.map(item => <button type="button" key={item.value} className={category === item.value ? 'is-active' : ''} onClick={() => updateFilter('category',item.value)}>{item.label}</button>)}</nav>
    <div className="shop-layout">
      <aside className="shop-filter-panel" data-page-enter aria-label="Collection filters">
        <button type="button" className="shop-filter-toggle" aria-expanded={filtersOpen} aria-controls="shop-filter-controls" onClick={() => setFiltersOpen(open => !open)}>Filter the collection {activeFilterCount > 0 && `(${activeFilterCount})`} <span aria-hidden="true">{filtersOpen ? '−' : '+'}</span></button>
        <div id="shop-filter-controls" className={`shop-filter-controls${filtersOpen ? ' is-open' : ''}`}>
          <div className="filter-heading"><h2>Refine your selection</h2>{activeFilterCount > 0 && <button type="button" onClick={clearFilters}>Clear</button>}</div>
          <fieldset className="shop-filter-group"><legend>Wood type</legend><label><input type="radio" name="wood" checked={!wood} onChange={() => updateFilter('wood','')} />All woods</label>{woods.map(name => <label key={name}><input type="radio" name="wood" checked={wood===name} onChange={() => updateFilter('wood',name)} />{name}</label>)}</fieldset>
          {(!category || category==='Door') && <fieldset className="shop-filter-group"><legend>Door style</legend>{[['','All styles'],['Single Door','Single door'],['Double Door','Double door']].map(([value,label]) => <label key={value}><input type="radio" name="door-type" checked={doorType===value} onChange={() => updateFilter('doorType',value)} />{label}</label>)}</fieldset>}
          {heights.length > 0 && <div className="shop-filter-group"><label htmlFor="height-filter">Height</label><select id="height-filter" value={height} onChange={event=>updateFilter('height',event.target.value)}><option value="">All heights</option>{heights.map(value=><option key={value}>{value}</option>)}</select></div>}
          {widths.length > 0 && <div className="shop-filter-group"><label htmlFor="width-filter">Width</label><select id="width-filter" value={width} onChange={event=>updateFilter('width',event.target.value)}><option value="">All widths</option>{widths.map(value=><option key={value}>{value}</option>)}</select></div>}
          <div className="shop-filter-group"><label htmlFor="price-filter">Price per item</label><select id="price-filter" value={price} onChange={event=>updateFilter('price',event.target.value)}><option value="">All prices</option><option value="under20000">Under ₹20,000</option><option value="20000-30000">₹20,000 – ₹30,000</option><option value="over30000">Above ₹30,000</option></select><small>Prices exclude GST.</small></div>
        </div>
      </aside>
      <section className="shop-results" aria-label="Products">
        <div className="shop-toolbar" data-page-enter><label className="shop-search"><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={event=>updateFilter('q',event.target.value)} placeholder="Search woodwork" aria-label="Search products" /></label><label className="shop-sort">Sort by <select value={sort} onChange={event=>updateFilter('sort',event.target.value)}><option value="name">Name</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label></div>
        <div className="shop-results-heading"><p role="status">{families.length} design{families.length!==1?'s':''}{category ? ` · ${getCategoryLabel(category)}` : ''}</p><span>Choose a design, then your size</span></div>
        {families.length ? <div className="products-grid">{families.map((product, index) => <ProductCard index={index} key={product.key} product={product} onAddToCart={onAddToCart} />)}</div> : <div className="no-products"><h2>No matching woodwork.</h2><p>Try a different wood, size, or price range.</p><button type="button" onClick={clearFilters}>Clear filters</button></div>}
      </section>
    </div></div>
  </div>;
}
