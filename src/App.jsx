import React, { useState, useEffect } from 'react';
import productsData from './products.json';
import { Skull, ArrowRight, ShoppingBag, ArrowLeft, Filter, Bug, Ghost, Plus, Minus, X, Menu, ExternalLink, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// Remove duplicate products
const products = productsData.filter((proc, pos, arr) => {
  return arr.map(mapObj => mapObj.title).indexOf(proc.title) === pos;
});

const CATEGORIES = [
  { id: '12ft-skelly', name: '12FT Skelly', keywords: ['12ft skelly', '12 ft skelly', '12 ft home depot skelly', 'home depot skeleton', 'skeleton'] },
  { id: 'jack-skellington', name: '13FT Jack Skellington', keywords: ['jack skellington'] },
  { id: 'predator', name: 'Predator of the Night', keywords: ['predator of the night'] },
  { id: 'inferno', name: 'Inferno & Deadwood', keywords: ['inferno', 'deadwood'] },
  { id: 'werewolf', name: '9FT Werewolf', keywords: ['werewolf'] },
  { id: 'other', name: 'Misc / Show Upgrades', keywords: [] }
];

function getCategoryForProduct(title) {
  const lowerTitle = title.toLowerCase();
  for (const cat of CATEGORIES) {
    if (cat.id !== 'other' && cat.keywords.some(kw => lowerTitle.includes(kw))) {
      return cat.id;
    }
  }
  return 'other';
}

const categoriesWithImages = CATEGORIES.map(cat => {
  const product = products.find(p => getCategoryForProduct(p.title) === cat.id);
  const defaultImg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='400' height='400' fill='%23111'/></svg>";
  return {
    ...cat,
    image: product ? product.image_url : defaultImg
  };
}).filter(c => c.image && c.id !== 'other');

// Cart helpers
function loadCart() {
  try {
    const saved = localStorage.getItem('mellos-cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('mellos-cart', JSON.stringify(cart));
}

function parsePrice(priceStr) {
  return parseFloat(priceStr.replace('$', ''));
}

const CreepyCrawlies = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <motion.div
        animate={{ x: ['-10vw', '110vw'], y: ['20vh', '80vh'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', opacity: 0.8 }}
      >
        <Bug size={64} color="var(--accent)" style={{ transform: 'rotate(45deg)' }} />
      </motion.div>
      <motion.div
        animate={{ x: ['110vw', '-10vw'], y: ['60vh', '10vh'] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear', delay: 2 }}
        style={{ position: 'absolute', opacity: 0.8 }}
      >
        <Bug size={48} color="white" style={{ transform: 'rotate(-135deg)' }} />
      </motion.div>
      <motion.div
        animate={{ x: ['30vw', '70vw', '30vw'], y: ['110vh', '-10vh', '110vh'] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', opacity: 0.4 }}
      >
        <Ghost size={120} color="var(--accent)" />
      </motion.div>
      <motion.div
        animate={{ x: ['80vw', '20vw', '80vw'], y: ['-10vh', '110vh', '-10vh'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        style={{ position: 'absolute', opacity: 0.3 }}
      >
        <Ghost size={80} color="white" />
      </motion.div>
      <div style={{ position: 'absolute', top: '15%', left: '10%', fontFamily: 'Syncopate', fontSize: '6vw', color: 'rgba(255,51,51,0.3)', transform: 'rotate(-5deg)', whiteSpace: 'nowrap', fontWeight: 'bold' }}>
        YOU CAN'T HIDE
      </div>
      <div style={{ position: 'absolute', top: '70%', right: '10%', fontFamily: 'Syncopate', fontSize: '4vw', color: 'rgba(255,255,255,0.2)', transform: 'rotate(5deg)', fontWeight: 'bold' }}>
        DEFY THE ELEMENTS
      </div>
    </div>
  );
};

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState(loadCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [lanternActive, setLanternActive] = useState(false);

  // Persist cart
  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  // Check for success redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setCurrentView('success');
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    let animationFrameId;
    let targetX = 0;
    let targetY = 0;

    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setLanternActive(true);
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const updateMousePos = () => {
      setMousePos(prev => {
        const dx = targetX - prev.x;
        const dy = targetY - prev.y;
        return {
          x: prev.x + dx * 0.1,
          y: prev.y + dy * 0.1
        };
      });
      animationFrameId = requestAnimationFrame(updateMousePos);
    };

    updateMousePos();

    const handleMouseMove = (e) => {
      if (!lanternActive) setLanternActive(true);
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const handleOrientation = (e) => {
      if (!lanternActive) setLanternActive(true);
      if (e.gamma === null || e.beta === null) return;
      targetX = window.innerWidth / 2 + (e.gamma / 45) * (window.innerWidth / 2);
      let tiltY = e.beta;
      if (tiltY < 0) tiltY = 0;
      if (tiltY > 90) tiltY = 90;
      targetY = (tiltY / 90) * window.innerHeight;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('deviceorientation', handleOrientation, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleOrientation);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Cart operations
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.title === product.title);
      if (existing) {
        return prev.map(item =>
          item.product.title === product.title
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (title) => {
    setCart(prev => prev.filter(item => item.product.title !== title));
  };

  const updateQuantity = (title, delta) => {
    setCart(prev => prev.map(item => {
      if (item.product.title !== title) return item;
      const newQty = item.quantity + delta;
      return newQty > 0 ? { ...item, quantity: newQty } : item;
    }).filter(item => item.quantity > 0));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + parsePrice(item.product.price) * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({
            title: item.product.title,
            price: item.product.price,
            quantity: item.quantity,
            image_url: item.product.image_url,
          }))
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const goToProducts = (categoryId = 'all') => {
    setActiveCategory(categoryId);
    setCurrentView('products');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const goToProductDetail = (product) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => getCategoryForProduct(p.title) === activeCategory);

  const maskImage = `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`;

  return (
    <div className="app-container">
      {/* Hidden Lantern Revealed World */}
      <div
        className="hidden-lantern-world"
        style={{
          WebkitMaskImage: lanternActive ? maskImage : 'none',
          maskImage: lanternActive ? maskImage : 'none',
          opacity: lanternActive ? 1 : 0,
          transition: 'opacity 0.5s ease'
        }}
      >
        <CreepyCrawlies />
      </div>

      <div className="bg-grid"></div>

      {/* HEADER */}
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container header-content">
          <div
            className="logo"
            style={{ cursor: 'pointer' }}
            onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }}
          >
            <Skull size={24} color="var(--accent)" />
            MELLO'S.D
          </div>

          <nav className="nav-links">
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); goToProducts('all'); }}>All Upgrades</a>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <Menu size={24} />
          </button>

          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <div
              style={{ position: 'relative', cursor: 'pointer' }}
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag size={24} style={{ color: 'white' }} />
              <span style={{
                position: 'absolute', top: -5, right: -5,
                background: 'var(--accent)', fontSize: '0.65rem',
                borderRadius: '50%', width: 16, height: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', border: '2px solid var(--bg-primary)'
              }}>{cartCount}</span>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <a href="#" className="mobile-menu-link" onClick={(e) => { e.preventDefault(); goToProducts('all'); }}>All Upgrades</a>
              {CATEGORIES.filter(c => c.id !== 'other').map(cat => (
                <a key={cat.id} href="#" className="mobile-menu-link" onClick={(e) => { e.preventDefault(); goToProducts(cat.id); }}>{cat.name}</a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* CART DRAWER */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              className="cart-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              className="cart-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div className="cart-header">
                <h3 style={{ fontFamily: 'Syncopate', fontSize: '1.1rem' }}>YOUR CART</h3>
                <button className="cart-close" onClick={() => setCartOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="cart-empty">
                  <ShoppingBag size={48} style={{ opacity: 0.3 }} />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map(item => (
                      <div key={item.product.title} className="cart-item">
                        <img src={item.product.image_url} alt={item.product.title} className="cart-item-img" />
                        <div className="cart-item-info">
                          <p className="cart-item-title">{item.product.title}</p>
                          <p className="cart-item-price">{item.product.price}</p>
                          <div className="cart-item-qty">
                            <button onClick={() => updateQuantity(item.product.title, -1)}><Minus size={14} /></button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.title, 1)}><Plus size={14} /></button>
                            <button className="cart-item-remove" onClick={() => removeFromCart(item.product.title)}>
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="cart-footer">
                    <div className="cart-total">
                      <span>Total</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <button
                      className="btn-checkout"
                      onClick={handleCheckout}
                      disabled={checkoutLoading}
                    >
                      {checkoutLoading ? 'Processing...' : 'Checkout'}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      {currentView === 'home' ? (
        <main>
          {/* HERO SECTION */}
          <section className="hero container">
            <div className="hero-split">
              <div className="hero-visuals">
                {products.slice(0, 2).map((product, idx) => (
                  <motion.div
                    key={idx}
                    className={`glass-card hero-product hero-product-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * idx }}
                    onClick={() => goToProductDetail(product)}
                  >
                    <div className="product-image-wrapper">
                      <img src={product.image_url} alt={product.title} className="product-image" loading="lazy" />
                    </div>
                    <div className="product-content" style={{ padding: '1.5rem', marginTop: '-40px' }}>
                      <div style={{ minHeight: '40px' }}>
                        <h3 className="product-title" style={{ fontSize: '0.9rem' }} title={product.title}>
                          {product.title}
                        </h3>
                      </div>
                      <div className="product-footer">
                        <span className="product-price" style={{ fontSize: '1rem' }}>{product.price}</span>
                        <button
                          className="icon-btn add-to-cart-btn"
                          style={{ width: '30px', height: '30px' }}
                          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                          title="Add to cart"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="hero-text">
                <motion.div
                  className="hero-badge"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <span /> Engineered for Extreme Conditions
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  Defy <br /> The Elements.
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                >
                  Premium 3D-printed reinforcement kits and upgrades meant for your grandest Halloween props.
                  Built with ultra-durable ASA carbon fiber to withstand aggressive weather.
                </motion.p>

                <motion.div
                  className="hero-ctas"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                >
                  <button className="btn-primary" onClick={() => goToProducts('all')}>
                    View Products Archive
                    <div className="arrow-circle">
                      <ArrowRight size={16} />
                    </div>
                  </button>
                </motion.div>
              </div>
            </div>
          </section>

          {/* MARQUEE */}
          <div className="marquee-container">
            <motion.div
              animate={{ x: [0, -1000] }}
              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              style={{ display: 'flex', willChange: 'transform' }}
            >
              {[...Array(6)].map((_, i) => (
                <div key={i} className="marquee-text">
                  <Skull /> 12FT SKELETON APPROVED <Skull /> ASA CARBON FIBER <Skull /> INFERNO COMPATIBLE
                </div>
              ))}
            </motion.div>
          </div>

          {/* PROP SELECTOR */}
          <section className="container" style={{ padding: '100px 0' }}>
            <motion.div
              className="section-title"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.5 }}
            >
              <h2 style={{ fontSize: '2.5rem' }}>Select Your Prop</h2>
              <span></span>
            </motion.div>

            <div className="category-grid">
              {categoriesWithImages.map((cat, idx) => (
                <motion.div
                  key={cat.id}
                  className="category-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  onClick={() => goToProducts(cat.id)}
                >
                  <img src={cat.image} className="category-bg" alt={cat.name} loading="lazy" />
                  <h3 className="category-title">{cat.name}</h3>
                </motion.div>
              ))}
            </div>
          </section>

          {/* FEATURED PRODUCTS */}
          <section className="products-section container" style={{ paddingTop: '50px' }}>
            <motion.div
              className="section-title"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.5 }}
            >
              <h2>Latest Arsenal</h2>
              <span></span>
            </motion.div>

            <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
              {products.slice(0, 3).map((product, idx) => (
                <motion.div
                  key={idx}
                  className="glass-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  onClick={() => goToProductDetail(product)}
                >
                  <div className="product-image-wrapper">
                    <img src={product.image_url} alt={product.title} className="product-image" loading="lazy" />
                  </div>
                  <div className="product-content">
                    <div style={{ minHeight: '60px' }}>
                      <h3 className="product-title" title={product.title}>
                        {product.title}
                      </h3>
                    </div>
                    <div className="product-footer">
                      <span className="product-price">{product.price}</span>
                      <button
                        className="icon-btn add-to-cart-btn"
                        onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                        title="Add to cart"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
              <button className="btn-secondary" onClick={() => goToProducts('all')} style={{ padding: '1rem 3rem', borderRadius: '100px', cursor: 'pointer', background: 'transparent', border: '1px solid var(--glass-border)', color: 'white', fontFamily: 'Syncopate', fontWeight: 'bold' }}>
                BROWSE FULL CATALOG
              </button>
            </div>
          </section>
        </main>

      ) : currentView === 'product-detail' && selectedProduct ? (
        /* PRODUCT DETAIL VIEW */
        <main className="page-container container" style={{ paddingBottom: '100px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
            <button
              onClick={() => setCurrentView('products')}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Syncopate' }}
            >
              <ArrowLeft size={20} /> BACK
            </button>
          </div>

          <div className="product-detail">
            <div className="product-detail-image">
              <img src={selectedProduct.image_url} alt={selectedProduct.title} />
            </div>
            <div className="product-detail-info">
              <h1 className="product-detail-title">{selectedProduct.title}</h1>
              <p className="product-detail-price">{selectedProduct.price}</p>
              <p className="product-detail-desc">
                Premium 3D-printed upgrade made with ultra-durable ASA carbon fiber.
                Engineered to withstand extreme weather conditions and keep your Halloween display standing strong.
              </p>
              <div className="product-detail-actions">
                <button className="btn-primary" onClick={() => { addToCart(selectedProduct); setCartOpen(true); }}>
                  <ShoppingBag size={18} />
                  Add to Cart
                </button>
                <a
                  href={selectedProduct.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-etsy"
                >
                  <ExternalLink size={16} />
                  View on Etsy
                </a>
              </div>
            </div>
          </div>
        </main>

      ) : currentView === 'success' ? (
        /* SUCCESS VIEW */
        <main className="page-container container" style={{ paddingBottom: '100px' }}>
          <div className="success-page">
            <CheckCircle size={64} color="var(--accent)" />
            <h1>Order Confirmed!</h1>
            <p>Thank you for your purchase. We'll get your prop upgrades shipped out soon.</p>
            <button className="btn-primary" onClick={() => { setCart([]); setCurrentView('home'); }}>
              Continue Shopping
              <div className="arrow-circle">
                <ArrowRight size={16} />
              </div>
            </button>
          </div>
        </main>

      ) : (
        /* PRODUCTS ARCHIVE VIEW */
        <main className="page-container container" style={{ paddingBottom: '100px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
            <button
              onClick={() => setCurrentView('home')}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Syncopate' }}
            >
              <ArrowLeft size={20} /> BACK
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '3rem' }}>Prop Upgrades</h1>
            <p style={{ color: 'var(--text-muted)' }}>Showing {filteredProducts.length} components.</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
              <button
                onClick={() => setActiveCategory('all')}
                className={`filter-pill ${activeCategory === 'all' ? 'active' : ''}`}
              >
                All
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`filter-pill ${activeCategory === cat.id ? 'active' : ''}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="product-grid">
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={idx}
                className="glass-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min((idx % 8) * 0.05, 0.4) }}
                onClick={() => goToProductDetail(product)}
              >
                <div className="product-image-wrapper">
                  <img src={product.image_url} alt={product.title} className="product-image" loading="lazy" />
                </div>
                <div className="product-content">
                  <div style={{ minHeight: '60px' }}>
                    <h3 className="product-title" title={product.title}>
                      {product.title}
                    </h3>
                  </div>
                  <div className="product-footer">
                    <span className="product-price">{product.price}</span>
                    <button
                      className="icon-btn add-to-cart-btn"
                      onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                      title="Add to cart"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredProducts.length === 0 && (
              <div style={{ padding: '4rem 0', color: 'var(--text-muted)' }}>
                No upgrades found for this category currently.
              </div>
            )}
          </div>
        </main>
      )}

      {/* FOOTER */}
      <footer className="footer container">
        <div className="footer-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white' }}>
            <Skull size={20} />
            <span style={{ fontFamily: 'Syncopate', fontWeight: 700, letterSpacing: '1px' }}>MELLO'S.D</span>
          </div>
          <div style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
            &copy; {new Date().getFullYear()} Mello's Designs.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
