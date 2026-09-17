import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMotion } from '../motion/MotionContext';
import './HeroCarousel.css';

const slides = [
  { src: '/images/hero-carved-entry.jpg', width: 1792, height: 2400, label: 'A beautiful first impression', alt: 'Open wooden double doors with carved floral frames, panelled leaves and brass handles' },
  { src: '/images/hero-wood-signature.jpg', width: 2752, height: 1536, label: 'Character in every grain', alt: 'The NordWood monogram carved into a light wooden panel, showing the natural grain' },
  { src: '/images/hero-door-designs.jpg', width: 2752, height: 1536, label: 'Details that make it yours', alt: 'Three wooden door designs in a bright room, with brass grille, carved floral and oval panel details' },
  { src: '/images/hero-door-collection.jpg', width: 1376, height: 768, label: 'An opening for every home', alt: 'A collection of six wooden door designs in different tones and architectural settings' },
];

function HeroArrow({ previous = false, diagonal = false }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M5 19 19 5M5 5h14v14' : previous ? 'M20 12H4m6-6-6 6 6 6' : 'M4 12h16m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function HeroCarousel() {
  const { enabled } = useMotion();
  const sectionRef = useRef(null);
  const pointerStart = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectionVersion, setSelectionVersion] = useState(0);
  const [visible, setVisible] = useState(() => !('IntersectionObserver' in window));
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const [loaded, setLoaded] = useState(() => slides.map(() => false));
  const [announcement, setAnnouncement] = useState('');
  const nextIndex = (activeIndex + 1) % slides.length;
  const rotating = enabled && visible && pageVisible && loaded[activeIndex] && loaded[nextIndex];

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  useEffect(() => {
    if (!rotating) return;
    const timer = window.setTimeout(() => setActiveIndex(nextIndex), 5000);
    return () => window.clearTimeout(timer);
  }, [rotating, nextIndex, selectionVersion]);

  const selectSlide = index => {
    const next = (index + slides.length) % slides.length;
    setActiveIndex(next);
    setSelectionVersion(version => version + 1);
    setAnnouncement(`Image ${next + 1} of ${slides.length}: ${slides[next].label}`);
  };
  const handleKeyDown = event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest('a')) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); selectSlide(activeIndex - 1); }
    else if (event.key === 'ArrowRight') { event.preventDefault(); selectSlide(activeIndex + 1); }
    else if (event.key === 'Home') { event.preventDefault(); selectSlide(0); }
    else if (event.key === 'End') { event.preventDefault(); selectSlide(slides.length - 1); }
  };
  const handlePointerDown = event => {
    if (!event.isPrimary || event.pointerType !== 'touch' || event.target.closest('button, a')) return;
    pointerStart.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handlePointerUp = event => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) selectSlide(activeIndex + (dx < 0 ? 1 : -1));
  };

  return (
    <section ref={sectionRef} className="home-hero" aria-labelledby="home-title" aria-roledescription="carousel" onKeyDown={handleKeyDown} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerCancel={() => { pointerStart.current = null; }} onLostPointerCapture={() => { pointerStart.current = null; }}>
      <p id="hero-carousel-help" className="hero-sr-only">Images change automatically every five seconds. Use the left and right arrow keys, the image buttons, or swipe to explore all four images.</p>
      <div id="hero-slides" className="hero-carousel__stage" role="group" tabIndex={0} aria-label="Explore the gallery" aria-describedby="hero-carousel-help" aria-keyshortcuts="ArrowLeft ArrowRight Home End">
        {slides.map((slide, index) => <div key={slide.src} className={`hero-carousel__slide hero-carousel__slide--${index + 1}${index === activeIndex ? ' is-active' : ''}`} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${slides.length}: ${slide.label}`} aria-hidden={index !== activeIndex}>
          <img src={slide.src} alt={slide.alt} width={slide.width} height={slide.height} fetchPriority={index === 0 ? 'high' : 'low'} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" draggable={false} onLoad={() => setLoaded(current => current[index] ? current : current.map((value, i) => i === index || value))} />
        </div>)}
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-topline"><span>Natural material. Exceptional possibility.</span><span>Lucknow, India <span className="hero-coordinate">26.85° N / 80.95° E</span></span></div>
      <div className="hero-copy">
        <p className="hero-kicker"><span /> The art of architectural woodwork</p>
        <h1 id="home-title">A warmer way<br />to <em>come home.</em></h1>
        <p className="hero-lede">Beautiful doors, frames, and windows.<br />Rooted in nature. Refined for your space.</p>
        <Link to="/shop" className="hero-btn">Explore the collection <HeroArrow diagonal /></Link>
      </div>
      <div className="hero-bottom">
        <a href="#collections" className="hero-scroll" aria-label="Explore the NordWood collections"><span className="scroll-indicator"><HeroArrow /></span><span>A closer look <strong>Scroll to discover</strong></span></a>
        <div className="hero-carousel__caption"><p>{slides[activeIndex].label}</p><span aria-hidden="true">{String(activeIndex + 1).padStart(2, '0')} <i>/ 04</i></span></div>
        <div className="hero-carousel__controls">
          <button type="button" className="hero-carousel__arrow" aria-label="Previous hero image" aria-controls="hero-slides" onClick={() => selectSlide(activeIndex - 1)}><HeroArrow previous /></button>
          <div className="hero-carousel__selectors" role="group" aria-label="Choose a hero image">{slides.map((slide, index) => <button key={slide.src} type="button" className={index === activeIndex ? 'is-active' : ''} aria-label={`Show image ${index + 1}: ${slide.label}`} aria-pressed={index === activeIndex} aria-controls="hero-slides" onClick={() => selectSlide(index)}><span /></button>)}</div>
          <button type="button" className="hero-carousel__arrow" aria-label="Next hero image" aria-controls="hero-slides" onClick={() => selectSlide(activeIndex + 1)}><HeroArrow /></button>
        </div>
      </div>
      <p className="hero-sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
    </section>
  );
}
