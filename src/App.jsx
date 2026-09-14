import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Cart from './pages/Cart';
import { products } from './data/products';
import MotionProvider from './motion/MotionProvider';
import MotionEffects from './motion/MotionEffects';
import './styles/global.css';
import './App.css';

function RouteScroll() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cartItems') || '[]');
      if (!Array.isArray(saved)) return [];
      return saved.flatMap(item => {
        const product = products.find(candidate => candidate.id === item?.id);
        if (!product || !Number.isInteger(item.quantity) || item.quantity < 1) return [];
        return [{ ...product, quantity: Math.min(item.quantity, 99) }];
      });
    } catch { return []; }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems.map(({ id, quantity }) => ({ id, quantity }))));
    } catch { /* The bag remains usable when browser storage is unavailable. */ }
  }, [cartItems]);

  const handleAddToCart = (product, quantity = 1) => {
    const currentProduct = products.find(item => item.id === product.id);
    if (!currentProduct || !Number.isInteger(quantity) || quantity < 1) return;
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...currentProduct, quantity: Math.min(99, item.quantity + quantity) }
            : item
        );
      }
      return [...prevItems, { ...currentProduct, quantity: Math.min(99, quantity) }];
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(prevItems =>
      prevItems.filter(item => item.id !== productId)
    );
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (!Number.isInteger(newQuantity) || newQuantity > 99) return;
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <MotionProvider><Router>
      <RouteScroll />
      <div className="app">
        <Header cartCount={cartCount} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
            <Route path="/shop" element={<Shop onAddToCart={handleAddToCart} />} />
            <Route path="/product/:id" element={<ProductDetail onAddToCart={handleAddToCart} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route 
              path="/cart" 
              element={
                <Cart 
                  cartItems={cartItems}
                  onRemoveFromCart={handleRemoveFromCart}
                  onUpdateQuantity={handleUpdateQuantity}
                  onClearCart={handleClearCart}
                />
              } 
            />
            <Route path="/about" element={<Home onAddToCart={handleAddToCart} />} />
          </Routes>
        </main>
        <Footer />
        <MotionEffects />
      </div>
    </Router></MotionProvider>
  );
}
