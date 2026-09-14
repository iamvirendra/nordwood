import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { products } from '../data/products';
import { getProductFamilies } from '../data/catalog';
import ProductCard from '../components/ProductCard';
import WoodcutIntro from '../components/WoodcutIntro';
import TimberCraft from '../components/TimberCraft';
import { useMotion } from '../motion/MotionContext';
import useHeroParallax from '../motion/useHeroParallax';
import './Home.css';

let hasPlayedIntro = false;
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
  const { enabled } = useMotion();
  const homeRef = useRef(null);
  useHeroParallax(homeRef);
  const replayRef = useRef(null);
  const scrolledHashRef = useRef(null);
  const [introOpen, setIntroOpen] = useState(() => location.pathname === '/' && !hasPlayedIntro && enabled);
  const [replayCount, setReplayCount] = useState(0);
  const finishIntro = useCallback(() => setIntroOpen(false), []);

  useEffect(() => {
    if (introOpen) hasPlayedIntro = true;
  }, [introOpen]);

  useEffect(() => {
    if (introOpen || !['#approach', '#collections'].includes(location.hash)) return;
    const navigation = `${location.key}:${location.hash}`;
    if (scrolledHashRef.current === navigation) return;
    const frame = window.requestAnimationFrame(() => {
      scrolledHashRef.current = navigation;
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [introOpen, location.hash, location.key]);

  const replayIntro = () => {
    if (!enabled) return;
    setReplayCount(count => count + 1);
    setIntroOpen(true);
  };

  return (
    <div ref={homeRef} className={`home ${introOpen ? 'home--intro' : 'home--ready'}`}>
      {introOpen && <WoodcutIntro onComplete={finishIntro} restoreFocusRef={replayCount > 0 ? replayRef : undefined} />}
      <section className="home-hero" aria-labelledby="home-title">
        <picture className="hero-picture">
          <source media="(max-width: 600px)" srcSet="/images/nordwood-teak-entry-small.jpg" />
          <img src="/images/nordwood-teak-entry.jpg" alt="Architectural inspiration: a tall teak entrance with a brass handle, warm stone and afternoon light" width="1536" height="1024" fetchPriority="high" />
        </picture>
        <div className="hero-shade" />
        <div className="hero-topline"><span>Natural material. Exceptional possibility.</span><span>Lucknow, India <span className="hero-coordinate">26.85° N / 80.95° E</span></span></div>
        <div className="hero-copy">
          <p className="hero-kicker"><span /> The art of architectural woodwork</p>
          <h1 id="home-title">A warmer way<br />to <em>come home.</em></h1>
          <p className="hero-lede">Beautiful doors, frames, and windows.<br />Rooted in nature. Refined for your space.</p>
          <div className="hero-actions">
            <Link to="/shop" className="hero-btn">Explore the collection <Arrow diagonal /></Link>
          </div>
        </div>
        <div className="hero-bottom">
          <a href="#approach" className="hero-scroll" aria-label="Explore the NordWood approach"><span className="scroll-indicator"><Arrow /></span><span>A closer look<br /><strong>Scroll to discover</strong></span></a>
          <button ref={replayRef} type="button" className="hero-film" onClick={replayIntro}><span className="film-play" aria-hidden="true">▷</span><span>From timber to timeless<small>Watch the craft · 3 seconds</small></span></button>
          <div className="hero-material"><span className="material-line" /><div><span>A study in natural warmth</span><strong>Timber. Light. Texture.</strong></div><span className="material-index">01 — NW</span></div>
        </div>
      </section>
      <div className="home-material-strip" aria-label="Our approach to woodwork"><span>Beautiful by nature</span><i aria-hidden="true">✳</i><span>Solid timber</span><i aria-hidden="true">✳</i><span>Made to your measure</span><i aria-hidden="true">✳</i><span>Crafted in Lucknow</span><i aria-hidden="true">✳</i><span>Considered in every detail</span></div>
      <section className="studio-note" id="approach" aria-labelledby="approach-title">
        <div className="studio-intro" data-reveal><p className="eyebrow">01 / The NordWood philosophy</p><span className="studio-marker" aria-hidden="true">N<span>W</span></span><p className="studio-caption">Nature provides the character.<br />We bring it into your home.</p></div>
        <div className="studio-content" data-reveal>
          <h2 id="approach-title">Some things are made.<br /><em>Others are considered.</em></h2>
          <div className="studio-body"><p>The quiet confidence of solid wood. The way a grain catches the light. The satisfying fit of a well-made door. We believe it’s these small details that make a space feel like home.</p><p>From the timber you choose to the dimensions your space needs, we bring material, proportion, and purpose together.</p></div>
        </div>
      </section>
      <TimberCraft />
      <section className="categories" id="collections" aria-labelledby="collections-title">
        <div className="section-heading-row" data-reveal><div><p className="eyebrow">02 / The collections</p><h2 id="collections-title">An opening to <em>something beautiful.</em></h2></div></div>
        <div className="collection-layout">
          <div className="collection-image" data-motion="image"><img src="/images/nordwood-teak-entry-small.jpg" width="800" height="533" alt="Inspiration for warm timber entrances and carefully framed openings" loading="lazy" /><span className="collection-image-label">A material point of view <span>NordWood</span></span></div>
          <div className="category-list">
            {categoryItems.map(category => <Link key={category.value} to={`/shop?category=${category.value}`} className="category-row" data-reveal><span className="category-number">{category.number}</span><div className="category-copy"><p>{category.eyebrow}</p><h3>{category.label}</h3><span>{category.description}</span></div><span className="category-arrow"><Arrow diagonal /></span></Link>)}
          </div>
        </div>
      </section>
      <section className="featured-products" aria-labelledby="selected-title">
        <div className="section-heading-row" data-reveal><div><p className="eyebrow">03 / A considered selection</p><h2 id="selected-title">Natural character.<br /><em>Lasting presence.</em></h2></div><p className="section-heading-note">Discover the materials and proportions that make an opening your own.</p></div>
        <div className="home-products-grid">{featuredProducts.map((product, index) => <div key={product.id} data-reveal style={{ '--reveal-delay': `${index * 65}ms` }}><ProductCard index={index} product={product} onAddToCart={onAddToCart} /></div>)}</div>
        <Link to="/shop" className="section-link">Explore every piece <Arrow diagonal /></Link>
      </section>
      <section className="home-cta" aria-labelledby="project-title">
        <div className="cta-copy" data-reveal><p className="eyebrow">04 / Your space. Our craft.</p><h2 id="project-title">Every beautiful home<br />begins with <em>an opening.</em></h2></div>
        <div className="cta-aside" data-reveal><p>A new home, a thoughtful renovation, or a detail you’ve been imagining. Let’s find the right woodwork for it.</p><Link to="/contact" className="cta-btn">Let’s talk about your project <Arrow diagonal /></Link><span className="cta-location">Made with care in Lucknow, India.</span></div>
      </section>
    </div>
  );
}
