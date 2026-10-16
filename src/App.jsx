import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Stars } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, CircleHelp,
  Heart, Menu, Minus, Plus, Search, ShoppingBag, SlidersHorizontal,
  Sparkles, X, Zap, Rotate3D, Trash2, MoveRight, Instagram, Play
} from 'lucide-react';

const PRODUCTS = [
  { id: 1, name: 'VOID Oversized Hoodie', category: 'Outerwear', price: 2499, oldPrice: 3299, rating: '4.9', tag: 'BESTSELLER', color: 'Obsidian', colorHex: '#252a30', sizes: ['S','M','L','XL'], image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85', bg: 'violet', number: '01' },
  { id: 2, name: 'CORE Heavyweight Tee', category: 'Essentials', price: 1299, oldPrice: null, rating: '4.8', tag: 'NEW DROP', color: 'Bone White', colorHex: '#e7e3da', sizes: ['S','M','L','XL'], image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85', bg: 'silver', number: '02' },
  { id: 3, name: 'AFTERHOURS Denim', category: 'Outerwear', price: 3999, oldPrice: null, rating: '4.9', tag: 'LIMITED', color: 'Washed Blue', colorHex: '#526c85', sizes: ['S','M','L','XL'], image: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=85', bg: 'blue', number: '03' },
  { id: 4, name: 'UTILITY Cargo 2.0', category: 'Bottoms', price: 2799, oldPrice: 3499, rating: '4.7', tag: '−20%', color: 'Cyber Khaki', colorHex: '#8a8b70', sizes: ['S','M','L','XL'], image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85', bg: 'lime', number: '04' },
  { id: 5, name: 'PHANTOM Moto Jacket', category: 'Outerwear', price: 5999, oldPrice: null, rating: '5.0', tag: 'EDITOR PICK', color: 'Deep Black', colorHex: '#17191d', sizes: ['S','M','L','XL'], image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85', bg: 'red', number: '05' },
  { id: 6, name: 'SOFT SIGNAL Knit', category: 'Essentials', price: 2299, oldPrice: null, rating: '4.8', tag: 'LOW STOCK', color: 'Stone Grey', colorHex: '#aaa9a1', sizes: ['S','M','L','XL'], image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=85', bg: 'silver', number: '06' },
  { id: 7, name: 'NIGHTSHIFT Bomber', category: 'Outerwear', price: 4499, oldPrice: null, rating: '4.9', tag: 'NEW DROP', color: 'Midnight', colorHex: '#303342', sizes: ['S','M','L','XL'], image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=85', bg: 'blue', number: '07' },
  { id: 8, name: 'FUTUREFORM Wide Denim', category: 'Bottoms', price: 2999, oldPrice: null, rating: '4.8', tag: 'TRENDING', color: 'Ink Blue', colorHex: '#334458', sizes: ['S','M','L','XL'], image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85', bg: 'violet', number: '08' },
];

const formatPrice = (price) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

function OrbitalScene() {
  const group = useRef();
  const ring = useRef();
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.13;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.17) * 0.12;
    }
    if (ring.current) ring.current.rotation.z -= delta * 0.09;
  });
  return (
    <group ref={group} position={[0.6, 0.1, -1.5]}>
      <Float speed={1.3} rotationIntensity={0.16} floatIntensity={0.22}>
        <mesh>
          <icosahedronGeometry args={[1.5, 2]} />
          <meshStandardMaterial color="#10151b" wireframe emissive="#a7ff37" emissiveIntensity={1.05} roughness={0.3} />
        </mesh>
      </Float>
      <mesh ref={ring} rotation={[1.05, 0.3, 0.3]}>
        <torusGeometry args={[2, 0.009, 8, 180]} />
        <meshBasicMaterial color="#a7ff37" transparent opacity={0.8} />
      </mesh>
      <mesh rotation={[0.5, -0.6, 0.2]}>
        <torusGeometry args={[2.25, 0.006, 8, 180]} />
        <meshBasicMaterial color="#7c5cff" transparent opacity={0.8} />
      </mesh>
      <mesh position={[-1.9, 0.5, 0.2]}>
        <sphereGeometry args={[0.07, 20, 20]} />
        <meshBasicMaterial color="#a7ff37" />
      </mesh>
      <mesh position={[1.65, -0.8, 0.4]}>
        <sphereGeometry args={[0.045, 20, 20]} />
        <meshBasicMaterial color="#64d8ff" />
      </mesh>
    </group>
  );
}

function HeroCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 6.5], fov: 42 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={1.1} />
      <pointLight position={[3, 2, 4]} color="#a7ff37" intensity={14} />
      <pointLight position={[-3, -2, 2]} color="#7c5cff" intensity={9} />
      <Suspense fallback={null}>
        <Stars radius={12} depth={4} count={120} factor={1.5} saturation={0} fade speed={0.3} />
        <OrbitalScene />
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </Canvas>
  );
}

function BrandMark() {
  return <span className="brand-mark"><span className="brand-symbol">A</span><span>AURA<span className="brand-light">WEAR</span></span></span>;
}

function ProductCard({ product, index, onQuickView, onAdd, wished, onWish }) {
  const [rotate, setRotate] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');
  const [added, setAdded] = useState(false);
  const cardRef = useRef(null);
  const handleMove = (e) => {
    if (window.matchMedia('(hover: none)').matches || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    cardRef.current.style.setProperty('--rx', `${(0.5 - y) * 7}deg`);
    cardRef.current.style.setProperty('--ry', `${(x - 0.5) * 9}deg`);
  };
  const resetTilt = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--rx', '0deg');
    cardRef.current.style.setProperty('--ry', '0deg');
  };
  const add = () => {
    onAdd(product, selectedSize);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1100);
  };
  return (
    <motion.article
      ref={cardRef}
      className={`product-card ${product.bg}`}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.48, delay: (index % 4) * 0.055 }}
      onMouseMove={handleMove}
      onMouseLeave={resetTilt}
      style={{ '--index': index }}
    >
      <div className="product-visual" onDoubleClick={() => setRotate(v => !v)}>
        <div className="product-image-aura" />
        <img className={`product-image ${rotate ? 'product-spin' : ''}`} src={product.image} alt={product.name} loading="lazy" />
        <span className="product-number">/ {product.number}</span>
        <span className="product-tag">{product.tag}</span>
        <button className={`icon-button wish-button ${wished ? 'is-wished' : ''}`} aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'} onClick={() => onWish(product.id)}><Heart size={17} fill={wished ? 'currentColor' : 'none'} /></button>
        <button className="quickview-button" onClick={() => onQuickView(product)}><Rotate3D size={15} /> QUICK VIEW <ArrowUpRight size={14} /></button>
      </div>
      <div className="product-info">
        <div className="product-heading"><div><p className="product-category">{product.category} <span>·</span> {product.color}</p><h3>{product.name}</h3></div><span className="product-rating">★ {product.rating}</span></div>
        <div className="product-bottom"><div className="price-stack"><span className="current-price">{formatPrice(product.price)}</span>{product.oldPrice && <span className="old-price">{formatPrice(product.oldPrice)}</span>}</div><button className={`add-button ${added ? 'added' : ''}`} aria-label={`Add ${product.name} to cart`} onClick={add}>{added ? <Check size={18} /> : <Plus size={18} />}</button></div>
        <div className="card-size-row"><span>SELECT SIZE</span><div className="size-options">{product.sizes.map(size => <button key={size} className={selectedSize === size ? 'active' : ''} onClick={() => setSelectedSize(size)} aria-label={`Select size ${size}`}>{size}</button>)}</div></div>
      </div>
    </motion.article>
  );
}

function CartDrawer({ open, items, onClose, onQty, onRemove, onCheckout }) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return (
    <AnimatePresence>
      {open && <>
        <motion.div className="drawer-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
        <motion.aside className="cart-drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 280 }} aria-label="Shopping cart">
          <div className="drawer-header"><div><p className="eyebrow">YOUR SELECTION</p><h2>Shopping bag <span>({items.reduce((n, i) => n + i.qty, 0)})</span></h2></div><button className="icon-button" onClick={onClose} aria-label="Close cart"><X /></button></div>
          <div className="cart-items">{items.length === 0 ? <div className="empty-cart"><div className="empty-icon"><ShoppingBag size={28} /></div><h3>Your bag is waiting.</h3><p>Great style starts with one good choice.</p><button className="button button-primary" onClick={onClose}>Explore the drop <ArrowRight size={16} /></button></div> : items.map(item => <div className="cart-item" key={`${item.id}-${item.size}`}><img src={item.image} alt={item.name} /><div className="cart-item-details"><span className="eyebrow">{item.category} / SIZE {item.size}</span><h3>{item.name}</h3><strong>{formatPrice(item.price)}</strong><div className="cart-qty"><button onClick={() => onQty(item.id, item.size, -1)} aria-label="Decrease quantity"><Minus size={13}/></button><span>{item.qty}</span><button onClick={() => onQty(item.id, item.size, 1)} aria-label="Increase quantity"><Plus size={13}/></button></div></div><button className="remove-item" onClick={() => onRemove(item.id, item.size)} aria-label="Remove item"><Trash2 size={16}/></button></div>)}</div>
          {items.length > 0 && <div className="cart-footer"><div className="shipping-note"><Zap size={15}/><span>{subtotal >= 3000 ? 'You unlocked free shipping.' : `Add ${formatPrice(3000 - subtotal)} more for free shipping.`}</span></div><div className="subtotal-row"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div><p className="tax-note">Taxes and shipping calculated at checkout.</p><button className="button button-primary checkout-button" onClick={onCheckout}>Continue to checkout <ArrowRight size={17}/></button><button className="continue-shopping" onClick={onClose}>Continue exploring</button></div>}
        </motion.aside>
      </>}
    </AnimatePresence>
  );
}

function QuickViewModal({ product, onClose, onAdd }) {
  const [size, setSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  return <AnimatePresence>{product && <>
    <motion.div className="modal-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}/>
    <motion.div className="quick-modal" role="dialog" aria-modal="true" aria-label={`${product.name} product details`} initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15, scale: 0.98 }} transition={{ duration: 0.22 }}>
      <button className="icon-button modal-close" onClick={onClose} aria-label="Close product preview"><X /></button>
      <div className={`modal-visual ${product.bg}`}><span className="modal-index">AURA / OBJECT {product.number}</span><img src={product.image} alt={product.name}/><span className="modal-visual-label">FORM FOLLOWS FEELING.</span></div>
      <div className="modal-details"><p className="eyebrow">{product.category} — {product.tag}</p><h2>{product.name}</h2><div className="modal-price">{formatPrice(product.price)} {product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}</div><p className="modal-description">Designed for movement. Built with considered details, elevated everyday materials and a silhouette made to stand apart.</p><div className="modal-color"><span>COLOR</span><strong><i style={{ background: product.colorHex }} />{product.color}</strong></div><div className="modal-size"><div className="size-label"><span>SELECT SIZE</span><button onClick={() => alert('Size guide: S (chest 36–38 in), M (38–40 in), L (40–42 in), XL (42–44 in). For an oversized fit, choose your usual size.')}>Size guide <ArrowUpRight size={12}/></button></div><div className="modal-sizes">{product.sizes.map(s => <button key={s} onClick={() => setSize(s)} className={size === s ? 'active' : ''}>{s}</button>)}</div></div><div className="modal-actions"><div className="quantity-select"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity"><Minus size={15}/></button><span>{quantity}</span><button onClick={() => setQuantity(Math.min(10, quantity + 1))} aria-label="Increase quantity"><Plus size={15}/></button></div><button className="button button-primary modal-add" onClick={() => { for(let i=0; i<quantity; i++) onAdd(product, size); setAdded(true); }}><ShoppingBag size={16}/>{added ? 'ADDED TO BAG' : 'ADD TO BAG'} <ArrowRight size={16}/></button></div><div className="modal-perks"><span><Check size={13}/> Secure checkout</span><span><Check size={13}/> Easy returns</span></div></div>
    </motion.div>
  </>}</AnimatePresence>;
}

function SearchOverlay({ open, onClose, query, setQuery, products, onQuickView }) {
  const results = products.filter(p => `${p.name} ${p.category} ${p.color}`.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
  return <AnimatePresence>{open && <>
    <motion.div className="search-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}/>
    <motion.div className="search-overlay" initial={{ y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -15, opacity: 0 }}>
      <div className="search-input-wrap"><Search size={20}/><input value={query} onChange={e => setQuery(e.target.value)} autoFocus placeholder="Search your next favourite…" aria-label="Search products"/><button className="icon-button" onClick={onClose} aria-label="Close search"><X/></button></div>
      <div className="search-results"><span className="eyebrow">{query ? `${results.length} MATCHES` : 'TRENDING SEARCHES'}</span>{query ? results.length ? results.map(p => <button className="search-result" key={p.id} onClick={() => { onQuickView(p); onClose(); }}><img src={p.image} alt=""/><span><strong>{p.name}</strong><small>{p.category} · {p.color}</small></span><b>{formatPrice(p.price)}</b><ArrowUpRight size={16}/></button>) : <p className="no-results">No pieces found. Try “hoodie” or “denim”.</p> : <div className="trending-terms">{['Oversized hoodie', 'Denim', 'Outerwear', 'Essentials'].map(term => <button key={term} onClick={() => setQuery(term)}>{term}<ArrowUpRight size={13}/></button>)}</div>}</div>
    </motion.div>
  </>}</AnimatePresence>;
}

export default function App() {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('aura-wear-cart') || '[]'); } catch { return []; }
  });
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('aura-wear-wishlist') || '[]'); } catch { return []; }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [quickProduct, setQuickProduct] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All pieces');
  const [sort, setSort] = useState('featured');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState('');
  const productSection = useRef(null);

  useEffect(() => {
    try { localStorage.setItem('aura-wear-cart', JSON.stringify(cart)); } catch { /* storage may be unavailable */ }
  }, [cart]);
  useEffect(() => {
    try { localStorage.setItem('aura-wear-wishlist', JSON.stringify(wishlist)); } catch { /* storage may be unavailable */ }
  }, [wishlist]);

  const displayedProducts = useMemo(() => {
    let list = PRODUCTS.filter(p => filter === 'All pieces' || p.category === filter);
    if (sort === 'price-low') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-high') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'rating') list = [...list].sort((a, b) => Number(b.rating) - Number(a.rating));
    return list;
  }, [filter, sort]);

  const addToCart = (product, size = 'M') => {
    setCart(current => {
      const existing = current.find(item => item.id === product.id && item.size === size);
      if (existing) return current.map(item => item.id === product.id && item.size === size ? { ...item, qty: item.qty + 1 } : item);
      return [...current, { ...product, size, qty: 1 }];
    });
    setToast(`${product.name} added to your bag`);
    window.setTimeout(() => setToast(''), 2400);
  };
  const changeQty = (id, size, amount) => setCart(items => items.map(item => item.id === id && item.size === size ? { ...item, qty: item.qty + amount } : item).filter(item => item.qty > 0));
  const removeItem = (id, size) => setCart(items => items.filter(item => !(item.id === id && item.size === size)));
  const toggleWish = id => setWishlist(items => items.includes(id) ? items.filter(item => item !== id) : [...items, id]);
  const scrollToProducts = () => productSection.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const checkout = () => { setCartOpen(false); setToast('Checkout demo — connect your payment gateway to accept payments.'); window.setTimeout(() => setToast(''), 3600); };

  return (
    <div className="app-shell">
      <div className="top-strip"><span><span className="status-dot"/> DROP 004 IS LIVE</span><span>FREE SHIPPING ON ORDERS OVER ₹3,000 <ArrowRight size={12}/></span><span className="top-right">ENGINEERED FOR THE UNORDINARY <span className="strip-spark">✳</span></span></div>
      <header className="site-header">
        <button className="mobile-menu-button icon-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu">{mobileMenu ? <X/> : <Menu/>}</button>
        <a className="brand-link" href="#home" aria-label="Aura Wear home"><BrandMark/><span className="brand-subtitle">EST. IN THE FUTURE</span></a>
        <nav className={`main-nav ${mobileMenu ? 'mobile-open' : ''}`}>
          <a href="#shop" onClick={() => setMobileMenu(false)}>SHOP ALL</a><a href="#shop" onClick={() => { setFilter('Outerwear'); setMobileMenu(false); }}>OUTERWEAR</a><a href="#shop" onClick={() => { setFilter('Essentials'); setMobileMenu(false); }}>ESSENTIALS</a><a href="#manifesto" onClick={() => setMobileMenu(false)}>OUR SIGNAL</a>
        </nav>
        <div className="header-actions"><button className="header-icon" onClick={() => setSearchOpen(true)} aria-label="Search"><Search size={19}/><span>SEARCH</span></button><button className="header-icon bag-trigger" onClick={() => setCartOpen(true)} aria-label="Open shopping bag"><ShoppingBag size={19}/><span>BAG</span><i>{cart.reduce((n, i) => n + i.qty, 0)}</i></button></div>
      </header>

      <main>
        <section className="hero-section" id="home">
          <div className="hero-gridlines"/><div className="hero-topline"><span>INDEPENDENT BY DESIGN.</span><span>28° 36' N — 77° 12' E</span></div>
          <div className="hero-copy">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="hero-kicker"><Sparkles size={13}/> A NEW UNIFORM FOR WHAT'S NEXT</motion.div>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.08 }}>FUTURE<br/><span>LOOKS</span> <em>GOOD.</em></motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: 0.6 }}>Streetwear from the edge of tomorrow.<br/>Built different. Worn your way.</motion.p>
            <motion.div className="hero-ctas" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}><button className="button button-primary" onClick={scrollToProducts}>EXPLORE THE DROP <ArrowRight size={17}/></button><button className="text-link" onClick={() => document.getElementById('manifesto')?.scrollIntoView({ behavior: 'smooth' })}><span className="play-icon"><Play size={11} fill="currentColor"/></span> OUR PHILOSOPHY</button></motion.div>
            <div className="hero-micro-stats"><div><strong>004</strong><span>COLLECTION DROP</span></div><div><strong>08</strong><span>CONSIDERED PIECES</span></div><div><strong>∞</strong><span>WAYS TO BE YOU</span></div></div>
          </div>
          <div className="hero-art" aria-label="Futuristic fashion campaign artwork">
            <div className="art-glow glow-green"/><div className="art-glow glow-purple"/>
            <div className="canvas-layer"><HeroCanvas/></div>
            <div className="hero-model-frame"><img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=90" alt="Editorial streetwear fashion campaign model"/></div>
            <div className="hero-art-scanlines"/><div className="hero-corner hero-corner-tl"/><div className="hero-corner hero-corner-br"/>
            <div className="art-label art-label-top"><span className="status-dot"/> AURA / SYSTEM 004</div><div className="art-label art-label-side">FORM / ENERGY / IDENTITY</div><div className="art-caption"><span>FIG. 004 — HUMAN AFTER DARK</span><strong>NO FUTURE<br/>WITHOUT FORM.</strong></div><div className="art-index">AW—04<span>2026</span></div>
          </div>
          <div className="hero-bottom-note"><span>SCROLL TO ENTER THE NEXT ERA <ArrowDown size={13}/></span><span className="note-line"/><span>DESIGNED IN INDIA / MADE FOR EVERYWHERE</span></div>
        </section>

        <section className="ticker-band" aria-label="Brand highlights"><div className="ticker-track">{Array.from({ length: 4 }).map((_, i) => <React.Fragment key={i}><span>NOT MADE TO BLEND IN</span><span className="ticker-symbol">✳</span><span>THE FUTURE IS A FIT</span><span className="ticker-symbol">✳</span><span>OWN YOUR FREQUENCY</span><span className="ticker-symbol">✳</span></React.Fragment>)}</div></section>

        <section className="shop-section section-wrap" id="shop" ref={productSection}>
          <div className="section-kicker"><span className="section-number">01 / THE DROP</span><span className="section-side-note">OBJECTS FOR THE EVERYDAY OUTLIER</span></div>
          <div className="shop-heading-row"><div><p className="eyebrow green-eyebrow">COLLECTION 004 — NOW LIVE</p><h2>THE NEXT<br/><span>ESSENTIALS.</span></h2></div><div className="shop-intro"><p>Less noise. More signal. Every piece is a study in form, function and future-facing expression.</p><button className="link-arrow" onClick={() => { setFilter('All pieces'); scrollToProducts(); }}>VIEW ALL PIECES <ArrowRight size={16}/></button></div></div>
          <div className="shop-toolbar"><div className="filter-pills" role="group" aria-label="Filter products">{['All pieces','Outerwear','Essentials','Bottoms'].map(cat => <button key={cat} className={filter === cat ? 'active' : ''} onClick={() => setFilter(cat)}>{cat}<span>{cat === 'All pieces' ? '08' : String(PRODUCTS.filter(p => p.category === cat).length).padStart(2,'0')}</span></button>)}</div><label className="sort-select"><SlidersHorizontal size={14}/><span>SORT BY</span><select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort products"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="rating">Top rated</option></select><ChevronDown size={13}/></label></div>
          <div className="products-grid">{displayedProducts.map((product, i) => <ProductCard key={product.id} product={product} index={i} onQuickView={setQuickProduct} onAdd={addToCart} wished={wishlist.includes(product.id)} onWish={toggleWish}/>)}</div>
          <div className="below-grid-note"><span><span className="status-dot"/> YOU'RE ALL CAUGHT UP</span><span>8 OBJECTS / ONE POINT OF VIEW</span></div>
        </section>

        <section className="campaign-section">
          <div className="campaign-bg-grid"/><div className="campaign-image"><img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1100&q=90" alt="Fashion campaign editorial" loading="lazy"/><div className="campaign-image-stamp">A / W<br/>004</div></div>
          <div className="campaign-copy"><p className="eyebrow green-eyebrow"><Zap size={13}/> FREQUENCY SHIFT / 001</p><h2>DON'T<br/>FOLLOW<br/><span>THE SIGNAL.</span><br/><em>BE IT.</em></h2><p className="campaign-description">Clothes are more than what you put on. They're the energy you put out. Tune into your own frequency.</p><button className="button button-outline" onClick={() => { setFilter('All pieces'); scrollToProducts(); }}>FIND YOUR FREQUENCY <ArrowRight size={16}/></button><div className="campaign-footer"><span>CREATIVE TRANSMISSION — 001</span><span>PLAY YOUR OWN RULES ↗</span></div></div>
        </section>

        <section className="manifesto-section section-wrap" id="manifesto"><div className="section-kicker"><span className="section-number">02 / THE MANIFESTO</span><span className="section-side-note">DESIGNED TO FEEL DIFFERENT</span></div><div className="manifesto-grid"><div className="manifesto-title"><p className="eyebrow">THIS IS AURA WEAR</p><h2>WEAR YOUR<br/><span>OWN</span><br/>FREQUENCY<span className="period">.</span></h2></div><div className="manifesto-body"><div className="manifesto-mark">✳</div><p className="manifesto-lead">For the ones who were never wired to fit the mould.</p><p>We make considered streetwear for a world that moves too fast and talks too loud. Intentional silhouettes. Unexpected details. No borrowed identities.</p><p>Every drop is a new signal. Every piece is permission to show up as the version of you that hasn't been named yet.</p><div className="manifesto-signature"><span className="signature-line"/><span>STAY UNCOMMON.</span></div></div></div></section>

        <section className="newsletter-section"><div className="newsletter-shape shape-one"/><div className="newsletter-shape shape-two"/><div className="newsletter-content"><p className="eyebrow"><span className="status-dot"/> TRANSMISSION INCOMING</p><h2>GET THE<br/><span>EARLY SIGNAL.</span></h2><p>First access to new drops, private releases and things that don't make it to the feed.</p><NewsletterForm setToast={setToast}/><span className="newsletter-privacy">NO SPAM. NO STATIC. UNSUBSCRIBE WHENEVER.</span></div><div className="newsletter-side-code">AURA<br/>TRANSMISSION<br/><span>AW//004.26</span></div></section>
      </main>

      <footer className="site-footer"><div className="footer-top"><div className="footer-brand-col"><a href="#home" className="brand-link"><BrandMark/><span className="brand-subtitle">EST. IN THE FUTURE</span></a><p>Streetwear from the edge of tomorrow.<br/>Built different. Worn your way.</p><a className="social-link" href="https://instagram.com" target="_blank" rel="noreferrer"><Instagram size={15}/> FOLLOW THE SIGNAL <ArrowUpRight size={14}/></a></div><div className="footer-links"><div><span className="eyebrow">EXPLORE</span><a href="#shop">Shop all</a><a href="#shop" onClick={() => setFilter('Outerwear')}>Outerwear</a><a href="#shop" onClick={() => setFilter('Essentials')}>Essentials</a><a href="#manifesto">Our signal</a></div><div><span className="eyebrow">THE DETAILS</span><a href="#footer">Shipping & returns</a><a href="#footer">Size guide</a><a href="#footer">Care instructions</a><a href="#footer">Contact us</a></div><div><span className="eyebrow">THE FINE PRINT</span><a href="#footer">Privacy policy</a><a href="#footer">Terms of service</a><a href="#footer">Cookie settings</a></div></div></div><div className="footer-bottom" id="footer"><span>© 2026 AURA WEAR STUDIO. ALL SIGNALS RESERVED.</span><span><span className="status-dot"/> SYSTEM ONLINE</span><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>BACK TO TOP ↑</button></div></footer>

      <CartDrawer open={cartOpen} items={cart} onClose={() => setCartOpen(false)} onQty={changeQty} onRemove={removeItem} onCheckout={checkout}/>
      <QuickViewModal product={quickProduct} onClose={() => setQuickProduct(null)} onAdd={addToCart}/>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} query={searchQuery} setQuery={setSearchQuery} products={PRODUCTS} onQuickView={setQuickProduct}/>
      <AnimatePresence>{toast && <motion.div className="toast-message" initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10 }}><Check size={16}/>{toast}<button onClick={() => setToast('')} aria-label="Dismiss notification"><X size={14}/></button></motion.div>}</AnimatePresence>
    </div>
  );
}

function NewsletterForm({ setToast }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const submit = e => { e.preventDefault(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setToast('Enter a valid email address to join the list.'); window.setTimeout(() => setToast(''), 2600); return; } setSubscribed(true); setToast('You’re on the list. Watch your inbox for the next signal.'); window.setTimeout(() => setToast(''), 3200); };
  return <form className="newsletter-form" onSubmit={submit}><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="YOUR EMAIL ADDRESS" required disabled={subscribed}/><button type="submit" aria-label="Subscribe to newsletter" disabled={subscribed}>{subscribed ? <Check size={18}/> : <ArrowRight size={18}/>}</button></form>;
}
