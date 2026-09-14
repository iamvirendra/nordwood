import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return <footer className="footer">
    <div className="footer-container">
      <div className="footer-section" data-motion="rise"><Link to="/" className="footer-wordmark">NordWood</Link><p>Natural timber. Considered details. Doors, frames, and windows for spaces that feel like home.</p><span className="footer-origin">Architectural woodworks · Lucknow</span></div>
      <div className="footer-section" data-motion="rise"><h3>Shop the collection</h3><ul><li><Link to="/shop?category=Door&doorType=Single+Door">Single doors</Link></li><li><Link to="/shop?category=Door&doorType=Double+Door">Double doors</Link></li><li><Link to="/shop?category=DoorFrame">Door frames</Link></li><li><Link to="/shop?category=Window">Windows</Link></li><li><Link to="/shop?category=WindowFrame">Window frames</Link></li></ul></div>
      <div className="footer-section" data-motion="rise"><h3>Choose your timber</h3><ul><li><Link to="/shop?category=Door&wood=Plantation+Teak">Plantation teak</Link></li><li><Link to="/shop?category=Door&wood=Forest+Teak">Forest teak</Link></li><li><Link to="/shop?category=Door&wood=Imported+Teak">Imported teak</Link></li></ul></div>
      <div className="footer-section" data-motion="rise"><h3>Let’s make an opening</h3><p><a href="mailto:info.nordwood2026@gmail.com">info.nordwood2026@gmail.com</a></p><p><a href="tel:+919451308440">+91 94513 08440</a></p><p><a href="tel:+916393198180">+91 63931 98180</a></p><p className="footer-address">500/143, Kutubpur,<br />Daliganj, Lucknow</p></div>
    </div>
    <div className="footer-bottom"><p>© 2026 NordWood. All rights reserved.</p><p>Prices exclude GST. Product photos are illustrative.</p></div>
  </footer>;
}
