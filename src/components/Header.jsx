import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import DeliveryCartLink from './DeliveryCartLink';
import BrandWordmark from './BrandWordmark';
import { brandLogo } from '../data/brand';
import { useAuth } from '../auth/context';
import './Header.css';

export default function Header({ cartCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const isHomepage = pathname === '/' || pathname === '/about';
  const { user } = useAuth();

  return (
    <header className="header header--home">
      <div className="header-container">
        <Link to="/" className="logo" aria-label="NordWood home">
          <img src={brandLogo.src} width={brandLogo.width} height={brandLogo.height} alt="" className="logo-image" />
          <span className="logo-copy">
            <BrandWordmark className="logo-name" decorative loading="eager" />
            <span className="logo-tagline">A material point of view</span>
          </span>
        </Link>

        <button 
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
