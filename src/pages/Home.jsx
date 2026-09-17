import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { products } from '../data/products';
import { getProductFamilies } from '../data/catalog';
import { getProductImages } from '../data/productImages';
import { woodGuides } from '../data/woodGuides';
import { blogImages } from '../data/blogImages';
import ProductCard from '../components/ProductCard';
import TimberCraft from '../components/TimberCraft';
import Testimonials from '../components/Testimonials';
import Heritage from '../components/Heritage';
import HeroCarousel from '../components/HeroCarousel';
import './Home.css';

const categoryItems = [
  { value: 'Door', number: '01', label: 'Doors', eyebrow: 'A beautiful first impression', description: 'Solid timber. Distinctive character. A welcome that feels like you.' },
  { value: 'DoorFrame', number: '02', label: 'Door frames', eyebrow: 'Beautiful from the beginning', description: 'Considered proportions and a precise foundation for every door.' },
  { value: 'Window', number: '03', label: 'Windows', eyebrow: 'Let the outside in', description: 'Invite the light in, framed by the natural warmth of wood.' },
  { value: 'WindowFrame', number: '04', label: 'Window frames', eyebrow: 'Every detail belongs', description: 'The finishing touch that brings the whole opening together.' },
];
const families = getProductFamilies(products);
const featuredProducts = categoryItems.map(category => families.find(product => product.category === category.value)).filter(Boolean);


function Arrow({ diagonal = false, className = '' }) {
  return <svg className={`home-arrow ${className}`} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h16m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function Home({ onAddToCart }) {
  const location = useLocation();
  const scrolledHashRef = useRef(null);

  useEffect(() => {
    if (!['#approach', '#collections', '#wood-types', '#heritage', '#testimonials'].includes(location.hash)) return;
    const navigation = `${location.key}:${location.hash}`;
    if (scrolledHashRef.current === navigation) return;
    const frame = window.requestAnimationFrame(() => {
      scrolledHashRef.current = navigation;
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.hash, location.key]);

  return (
    <div className="home">
      <HeroCarousel />
      <div className="home-material-strip" aria-label="Our approach to woodwork"><span>Beautiful by nature</span><i aria-hidden="true">✳</i><span>Solid timber</span><i aria-hidden="true">✳</i><span>Made to your measure</span><i aria-hidden="true">✳</i><span>Crafted in Lucknow</span><i aria-hidden="true">✳</i><span>Considered in every detail</span></div>
      <section className="categories" id="collections" aria-labelledby="collections-title">
        <div className="section-heading-row" data-reveal><div><p className="eyebrow">01 / The collections</p><h2 id="collections-title">An opening to <em>something beautiful.</em></h2></div></div>
        <div className="collections-grid">
          {categoryItems.map(category => {
            const image = getProductImages(category.label, category.value)[0];
            return <Link key={category.value} to={`/shop?category=${category.value}`} className="collection-card" data-reveal>
              <div className="collection-card-image"><img src={image.src} alt={image.alt} width="600" height="900" loading="lazy" /><span className="category-number">{category.number}</span></div>
              <div className="category-copy"><p>{category.eyebrow}</p><h3>{category.label}</h3><span>{category.description}</span></div>
              <span className="category-arrow"><Arrow diagonal /></span>
            </Link>;
          })}
        </div>
      </section>
      <section className="home-woods" id="wood-types" aria-labelledby="wood-types-title">
        <div className="section-heading-row" data-reveal>
          <div><p className="eyebrow">02 / Know your material</p><h2 id="wood-types-title">Type of <em>Wood</em></h2></div>
          <p className="section-heading-note">Get to know the grain, the possibilities, and the care behind each wood.</p>
        </div>
        <div className="wood-guides-grid">
          {woodGuides.map((guide, index) => {
            const cover = blogImages[guide.imageKeys[0]];
            return <Link key={guide.id} to={`/blog/${guide.id}`} className="wood-guide-card" aria-labelledby={`${guide.id}-label`} data-reveal>
              <div className="wood-guide-image"><img src={cover.src} alt={cover.alt} width="1200" height="800" loading="lazy" decoding="async" /><span>{String(index + 1).padStart(2, '0')}</span></div>
              <div className="wood-guide-copy"><h3 id={`${guide.id}-label`}>{guide.woodType}</h3><p>{guide.summary}</p><span className="wood-guide-link">Explore the wood <Arrow diagonal /></span></div>
            </Link>;
          })}
        </div>
        <p className="wood-guide-photo-note">Illustrative wood studies. Natural grain and colour vary from board to board.</p>
      </section>
      <Heritage />
      <TimberCraft />
      <section className="featured-products" aria-labelledby="selected-title">
        <div className="section-heading-row" data-reveal><div><p className="eyebrow">04 / A considered selection</p><h2 id="selected-title">Natural character.<br /><em>Lasting presence.</em></h2></div><p className="section-heading-note">Discover the materials and proportions that make an opening your own.</p></div>
        <div className="home-products-grid">{featuredProducts.map((product, index) => <div key={product.id} data-reveal style={{ '--reveal-delay': `${index * 65}ms` }}><ProductCard index={index} product={product} onAddToCart={onAddToCart} /></div>)}</div>
        <Link to="/shop" className="section-link">Explore every piece <Arrow diagonal /></Link>
      </section>
      <Testimonials />
      <section className="home-cta" aria-labelledby="project-title">
        <div className="cta-copy" data-reveal><p className="eyebrow">06 / Your space. Our craft.</p><h2 id="project-title">Every beautiful home<br />begins with <em>an opening.</em></h2></div>
        <div className="cta-aside" data-reveal><p>A new home, a thoughtful renovation, or a detail you’ve been imagining. Let’s find the right woodwork for it.</p><Link to="/contact" className="cta-btn">Let’s talk about your project <Arrow diagonal /></Link><span className="cta-location">Made with care in Lucknow, India.</span></div>
      </section>
    </div>
  );
}
