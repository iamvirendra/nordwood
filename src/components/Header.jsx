import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import DeliveryCartLink from './DeliveryCartLink';
import BrandWordmark from './BrandWordmark';
import { brandLogo } from '../data/brand';
import { useAuth } from '../auth/context';
import { useMotion } from '../motion/MotionContext';
import './Header.css';

export default function Header({ cartCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const menuButtonRef = useRef(null);
  const reflectionFrame = useRef(null);
  const { enabled: motionEnabled } = useMotion();
  const { pathname } = useLocation();
  const isHomepage = pathname === '/' || pathname === '/about';
  const { user } = useAuth();

  useEffect(() => {
    const header = headerRef.current;
    return () => {
      window.cancelAnimationFrame(reflectionFrame.current);
      header?.style.removeProperty('--header-glow-x');
    };
  }, [motionEnabled]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOutside = event => {
      if (!headerRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const closeOnEscape = event => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    const desktop = window.matchMedia('(min-width: 901px)');
    const closeOnDesktop = event => { if (event.matches) setMenuOpen(false); };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeOnEscape);
    desktop.addEventListener('change', closeOnDesktop);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeOnEscape);
      desktop.removeEventListener('change', closeOnDesktop);
    };
  }, [menuOpen]);

  const moveReflection = event => {
    if (!motionEnabled || event.pointerType !== 'mouse') return;
    const header = event.currentTarget;
    const bounds = header.getBoundingClientRect();
    const position = `${((event.clientX - bounds.left) / bounds.width) * 100}%`;
    window.cancelAnimationFrame(reflectionFrame.current);
    reflectionFrame.current = window.requestAnimationFrame(() => header.style.setProperty('--header-glow-x', position));
  };
  const clearReflection = () => {
    window.cancelAnimationFrame(reflectionFrame.current);
    headerRef.current?.style.removeProperty('--header-glow-x');
  };

  return (
    <header ref={headerRef} className="header header--home" onPointerMove={moveReflection} onPointerLeave={clearReflection} onClick={event => { if (event.target.closest('a')) setMenuOpen(false); }}>
      <span className="header-sheen" aria-hidden="true" />
      <div className="header-container">
        <Link to="/" className="logo" aria-label="NordWood home">
          <img src={brandLogo.src} width={brandLogo.width} height={brandLogo.height} alt="" className="logo-image" />
          <span className="logo-copy">
            <BrandWordmark className="logo-name" decorative loading="eager" />
            <span className="logo-tagline">A material point of view</span>
          </span>
        </Link>

        <button 
          ref={menuButtonRef}
          type="button"
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav id="main-navigation" aria-label="Main navigation" className={`nav ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" end className="nav-link" onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/shop" className="nav-link" onClick={() => setMenuOpen(false)}>
            Collection
          </NavLink>
          {isHomepage ? <a href="#approach" className="nav-link" onClick={() => setMenuOpen(false)}>Our craft</a> : <Link to="/#approach" className="nav-link" onClick={() => setMenuOpen(false)}>Our craft</Link>}
          <NavLink to="/blog" className="nav-link" onClick={() => setMenuOpen(false)}>
            Blog
          </NavLink>
          <NavLink to="/contact" className="nav-link" onClick={() => setMenuOpen(false)}>
            Contact
          </NavLink>
          <NavLink to={user ? '/account' : '/login'} className="nav-link nav-account-mobile" onClick={() => setMenuOpen(false)}>{user ? 'My account' : 'Sign in'}</NavLink>
          {user?.role === 'admin' && <NavLink to="/admin" className="nav-link nav-account-mobile" onClick={() => setMenuOpen(false)}>Order management</NavLink>}
        </nav>

        <div className="header-actions">
          <NavLink to={user ? '/account' : '/login'} className="header-account" aria-label={user ? 'My account' : 'Sign in'}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.35" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" stroke="currentColor" strokeWidth="1.35" /></svg>
            <span>{user ? 'My account' : 'Sign in'}</span>
          </NavLink>
          <DeliveryCartLink count={cartCount} />
        </div>
      </div>
    </header>
  );
}
