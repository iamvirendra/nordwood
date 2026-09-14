import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import MotionToggle from '../motion/MotionToggle';
import './Header.css';

export default function Header({ cartCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const isHomepage = pathname === '/' || pathname === '/about';

  return (
    <header className="header header--home">
      <div className="header-utility">
        <div className="header-utility-inner">
          <span>Architectural woodworks / Lucknow</span>
          <span>Made-to-size · Appointments by request</span>
          <MotionToggle />
        </div>
      </div>
      <div className="header-container">
        <Link to="/" className="logo">
          <img src="/1000687991.svg" alt="NordWood" className="logo-image" />
          <span className="logo-copy">
            <span className="logo-name">NordWood</span>
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
        </nav>

        <div className="header-actions">
          <Link to="/cart" className="cart-icon">
            <span className="cart-label">Bag</span>
            <span key={cartCount} className="cart-count">{cartCount}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
