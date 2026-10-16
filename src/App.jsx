import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import {
  ShoppingBag,
  Heart,
  Search,
  User,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Box,
  RotateCcw,
  Eye,
  Star,
  Check,
  Plus,
  Minus,
  Trash2,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Layers,
  Maximize2,
  Compass,
  Sun,
  Grid,
  Award,
  Globe,
  RefreshCw,
  ArrowUpRight,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Lock,
  CreditCard,
  Truck,
  Wand2,
  Camera,
  Loader2,
  MessageSquare,
  Send,
  Upload,
  Ruler,
  ZoomIn,
  ZoomOut,
  Smartphone
} from 'lucide-react';

// ============================================================================
// GEMINI API HELPER WITH RETRIES & SMART ARCHIVAL CURATION FALLBACK
// ============================================================================
const apiKey = import.meta.env?.VITE_GEMINI_API_KEY || "";
const GEMINI_MODEL = "gemini-1.5-flash";

async function callGeminiAPI(payload, maxRetries = 3) {
  if (!apiKey) {
    throw new Error('API_KEY_NOT_CONFIGURED');
  }
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  let delay = 900;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Empty response from Gemini');
      return text;
    } catch (err) {
      if (attempt === maxRetries - 1) throw err;
      await new Promise((res) => setTimeout(res, delay));
      delay *= 1.8;
    }
  }
}

// ============================================================================
// PRODUCT CATALOG (8 SIGNATURE 3D READY PIECES)
// ============================================================================
const PRODUCTS = [
  {
    id: 'aura-01',
    name: 'Oversized Black Hoodie',
    price: 2499,
    originalPrice: 3299,
    rating: 4.9,
    reviewsCount: 142,
    category: 'Streetwear',
    gender: 'Men',
    badge: 'BESTSELLER',
    isNew: true,
    isOnSale: true,
    garmentType: 'hoodie',
    description:
      'Engineered from 520GSM heavyweight organic loop-back French terry. Features an architectural drop-shoulder silhouette, double-lined sculptural hood, and invisible seam pockets.',
    fabricSpecs: ['520 GSM Heavy Cotton', '3D Structured Hood', 'Water-Repellent Coating', 'Zero-Torque Ribbing'],
    colors: [
      { name: 'Obsidian Black', hex: '#141416', roughness: 0.75, metalness: 0.1 },
      { name: 'Titanium Grey', hex: '#6e7075', roughness: 0.7, metalness: 0.15 },
      { name: 'Alabaster Bone', hex: '#e6e3dc', roughness: 0.8, metalness: 0.05 }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 'aura-02',
    name: 'Premium White T-Shirt',
    price: 1299,
    originalPrice: null,
    rating: 4.8,
    reviewsCount: 218,
    category: 'Essentials',
    gender: 'Women',
    badge: 'ESSENTIAL',
    isNew: false,
    isOnSale: false,
    garmentType: 'tshirt',
    description:
      'Spun from long-staple Supima cotton with a Mercerized silk-touch finish. Tailored for a relaxed boxy drape with a high-density mock neck collar that never loses structure.',
    fabricSpecs: ['280 GSM Supima Cotton', 'Mercerized Lustre', 'Anti-Pilling Micro-Weave', 'Bio-Enzyme Washed'],
    colors: [
      { name: 'Pure Ivory', hex: '#f5f4f0', roughness: 0.65, metalness: 0.05 },
      { name: 'Silver Mist', hex: '#c8ccd0', roughness: 0.6, metalness: 0.12 },
      { name: 'Carbon Ink', hex: '#1c1d1f', roughness: 0.7, metalness: 0.08 }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 'aura-03',
    name: 'Relaxed Fit Denim Jacket',
    price: 3999,
    originalPrice: 4799,
    rating: 4.9,
    reviewsCount: 89,
    category: 'Men',
    gender: 'Men',
    badge: 'LIMITED',
    isNew: true,
    isOnSale: true,
    garmentType: 'denim_jacket',
    description:
      'Japanese 14oz selvedge denim reimagined with futuristic articulated sleeves, brushed palladium hardware, and laser-etched tonal seam detailing.',
    fabricSpecs: ['14oz Okayama Selvedge', 'Palladium Hardware', 'Articulated Elbows', 'Raw Indigo Dye'],
    colors: [
      { name: 'Slate Indigo', hex: '#2b3a4a', roughness: 0.8, metalness: 0.15 },
      { name: 'Washed Pewter', hex: '#596068', roughness: 0.75, metalness: 0.2 },
      { name: 'Ecru Raw', hex: '#dfd9ce', roughness: 0.85, metalness: 0.05 }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 'aura-04',
    name: 'Beige Cargo Pants',
    price: 2799,
    originalPrice: null,
    rating: 4.7,
    reviewsCount: 114,
    category: 'Streetwear',
    gender: 'Men',
    badge: 'TRENDING',
    isNew: true,
    isOnSale: false,
    garmentType: 'cargo',
    description:
      'Technical utilitarian trousers with 3D gusseted origami bellows pockets, magnetic Fidlock-inspired ankle cinch tabs, and breathable stretch ripstop weave.',
    fabricSpecs: ['Technical Micro-Ripstop', '6-Pocket Origami Layout', 'Adjustable Hem Toggles', '4-Way Mechanical Stretch'],
    colors: [
      { name: 'Dune Beige', hex: '#cbbba0', roughness: 0.65, metalness: 0.1 },
      { name: 'Olive Basalt', hex: '#4a5244', roughness: 0.7, metalness: 0.12 },
      { name: 'Onyx Stealth', hex: '#1b1b1d', roughness: 0.6, metalness: 0.18 }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 'aura-05',
    name: 'Classic Leather Jacket',
    price: 5999,
    originalPrice: 6999,
    rating: 5.0,
    reviewsCount: 76,
    category: 'Women',
    gender: 'Women',
    badge: 'ATELIER',
    isNew: false,
    isOnSale: true,
    garmentType: 'leather_jacket',
    description:
      'Crafted from supple full-grain cactus & Italian vegan-nappa hybrid leather with a satin cupro lining, asymmetric chrome zippers, and sculpted shoulder pads.',
    fabricSpecs: ['Full-Grain Bio-Nappa', 'Chrome Riri Zippers', 'Bemberg Cupro Lining', 'Hand-Burnished Edges'],
    colors: [
      { name: 'Noir Gloss', hex: '#121214', roughness: 0.28, metalness: 0.45 },
      { name: 'Espresso Bronze', hex: '#3d2b24', roughness: 0.32, metalness: 0.4 },
      { name: 'Liquid Chrome', hex: '#9ea3a8', roughness: 0.2, metalness: 0.7 }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 'aura-06',
    name: 'Minimalist Knit Sweater',
    price: 2299,
    originalPrice: null,
    rating: 4.8,
    reviewsCount: 95,
    category: 'Essentials',
    gender: 'Women',
    badge: 'EDITORIAL',
    isNew: true,
    isOnSale: false,
    garmentType: 'sweater',
    description:
      'Seamless 3D whole-garment rib knit crafted from extra-fine Merino wool and recycled cashmere blend. Designed with architectural bell cuffs and zero waste.',
    fabricSpecs: ['Whole-Garment 3D Knit', '80% Merino / 20% Cashmere', 'Thermoregulating Weave', 'Zero-Seam Comfort'],
    colors: [
      { name: 'Warm Oat', hex: '#dcd2c4', roughness: 0.9, metalness: 0.02 },
      { name: 'Charcoal Marl', hex: '#3a3b3e', roughness: 0.88, metalness: 0.04 },
      { name: 'Sage Mist', hex: '#9aa69b', roughness: 0.9, metalness: 0.02 }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 'aura-07',
    name: 'Urban Bomber Jacket',
    price: 4499,
    originalPrice: 5299,
    rating: 4.9,
    reviewsCount: 128,
    category: 'Streetwear',
    gender: 'Men',
    badge: '3D EDITION',
    isNew: true,
    isOnSale: true,
    garmentType: 'bomber',
    description:
      'High-sheen ballistic nylon MA-1 silhouette insulated with PrimaLoft aerogel fill. Complete with ruched utility sleeve pockets and iridescent inner lining.',
    fabricSpecs: ['Ballistic Satin Nylon', 'Aerogel Thermal Fill', 'Storm-Flap Closure', 'Waterproof DWR 10K'],
    colors: [
      { name: 'Cyber Olive', hex: '#3d4435', roughness: 0.35, metalness: 0.35 },
      { name: 'Phantom Black', hex: '#16171a', roughness: 0.32, metalness: 0.4 },
      { name: 'Champagne Silver', hex: '#c7c2b8', roughness: 0.25, metalness: 0.55 }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1000&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 'aura-08',
    name: 'Premium Wide-Leg Jeans',
    price: 2999,
    originalPrice: null,
    rating: 4.8,
    reviewsCount: 164,
    category: 'Women',
    gender: 'Women',
    badge: 'RUNWAY',
    isNew: false,
    isOnSale: false,
    garmentType: 'jeans',
    description:
      'High-waisted puddle-hem wide-leg denim with tailored front pleats and vintage enzyme stonewash. Creates an elongated architectural column silhouette.',
    fabricSpecs: ['13.5oz Organic Denim', 'Tailored Pleat Front', 'Ozone Eco-Wash', 'Custom Brushed Steel Button'],
    colors: [
      { name: 'Vintage Ice Blue', hex: '#7c94ab', roughness: 0.82, metalness: 0.08 },
      { name: 'Raw Midnight', hex: '#1d2533', roughness: 0.78, metalness: 0.12 },
      { name: 'Mineral Chalk', hex: '#e2dfd7', roughness: 0.85, metalness: 0.05 }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&w=1000&q=85'
  }
];

const CATEGORIES = [
  { id: 'All', name: 'All Collections', subtitle: '08 Curated Editions', count: 8, image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80' },
  { id: 'Men', name: 'Men', subtitle: 'Architectural Tailoring', count: 4, image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80' },
  { id: 'Women', name: 'Women', subtitle: 'Fluid Avant-Garde', count: 4, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80' },
  { id: 'Streetwear', name: 'Streetwear', subtitle: 'Technical Utility', count: 3, image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=800&q=80' },
  { id: 'Essentials', name: 'Essentials', subtitle: 'Monolith Foundations', count: 2, image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80' },
  { id: 'Accessories', name: 'Accessories', subtitle: 'Modular Hardware', count: 3, image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80' }
];

const REVIEWS = [
  { id: 1, author: 'Aarav Mehta', role: 'Creative Director, Mumbai', rating: 5, garment: 'Oversized Black Hoodie', comment: 'The 520GSM weight and 3D hood structure feel unlike anything else in my wardrobe. Being able to inspect the drape and seams in 360° before ordering was surreal.' },
  { id: 2, author: 'Elena Rostova', role: 'Architectural Designer, Milan', rating: 5, garment: 'Classic Leather Jacket', comment: 'Pure luxury. The bio-nappa texture has an incredible matte-satin sheen and the palladium hardware feels weighted and bespoke. Museum-grade.' },
  { id: 3, author: 'Rohan Kapoor', role: 'Visual Artist, Bengaluru', rating: 5, garment: 'Urban Bomber Jacket', comment: 'Wore the Cyber Olive Bomber to Tokyo Design Week—stopped at least six times by people asking what atelier made it. Boxy and futuristic.' },
  { id: 4, author: 'Sanya Singhania', role: 'Fashion Stylist, New Delhi', rating: 5, garment: 'Premium Wide-Leg Jeans', comment: 'Finally wide-leg denim that drapes like tailored wool trousers. The pleat structure holds all day without creasing.' }
];

const formatINR = (price) => `₹${Number(price).toLocaleString('en-IN')}`;

// ============================================================================
// PERFORMANCE-OPTIMIZED THREE.JS TEXTURE CACHE & PROCEDURAL 3D MESH BUILDER
// ============================================================================
let cachedFabricTexture = null;

function getCachedFabricBumpTexture() {
  if (!cachedFabricTexture) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 128, 128);
    for (let y = 0; y < 128; y += 2) {
      for (let x = 0; x < 128; x += 2) {
        const val = (x + y) % 4 === 0 ? 155 : 105;
        ctx.fillStyle = `rgb(${val},${val},${val})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    cachedFabricTexture = new THREE.CanvasTexture(canvas);
    cachedFabricTexture.wrapS = THREE.RepeatWrapping;
    cachedFabricTexture.wrapT = THREE.RepeatWrapping;
    cachedFabricTexture.repeat.set(24, 24);
  }
  return cachedFabricTexture;
}

function buildProceduralGarmentGroup(garmentType, colorHex = '#141416', roughness = 0.7, metalness = 0.15, wireframe = false) {
  const group = new THREE.Group();
  const bumpTex = getCachedFabricBumpTexture();

  const mainMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(colorHex),
    roughness: roughness,
    metalness: metalness,
    bumpMap: bumpTex,
    bumpScale: 0.007,
    wireframe: wireframe,
    side: THREE.DoubleSide
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(colorHex).multiplyScalar(0.82),
    roughness: Math.min(1, roughness + 0.1),
    metalness: metalness,
    wireframe: wireframe
  });

  const hardwareMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#d8dce3'),
    roughness: 0.18,
    metalness: 0.92,
    wireframe: wireframe
  });

  const mannequinMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#222326'),
    roughness: 0.25,
    metalness: 0.4,
    clearcoat: 0.6,
    wireframe: wireframe
  });

  // Minimalist studio stand
  const standPole = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 1.45, 24), hardwareMat);
  standPole.position.y = -0.92;
  group.add(standPole);

  const standBase = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.05, 32), hardwareMat);
  standBase.position.y = -1.55;
  group.add(standBase);

  if (garmentType === 'cargo' || garmentType === 'jeans') {
    // TROUSERS & CARGO ARCHITECTURE
    const waistGeo = new THREE.CylinderGeometry(0.46, 0.5, 0.22, 32);
    waistGeo.scale(1, 1, 0.68);
    const waist = new THREE.Mesh(waistGeo, accentMat);
    waist.position.y = 0.72;
    group.add(waist);

    const button = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.02, 16), hardwareMat);
    button.rotation.x = Math.PI / 2;
    button.position.set(0, 0.72, 0.34);
    group.add(button);

    const isWide = garmentType === 'jeans';
    const topR = 0.24;
    const botR = isWide ? 0.31 : 0.21;

    [-1, 1].forEach((side) => {
      const legGeo = new THREE.CylinderGeometry(topR, botR, 1.65, 28, 12);
      legGeo.scale(1, 1, 0.82);
      const pos = legGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        const x = pos.getX(i);
        const fold = Math.sin(y * 8.5 + side) * 0.012;
        pos.setX(i, x + fold);
      }
      legGeo.computeVertexNormals();

      const leg = new THREE.Mesh(legGeo, mainMat);
      leg.position.set(side * 0.23, -0.15, 0);
      leg.rotation.z = side * -0.03;
      group.add(leg);

      if (garmentType === 'cargo') {
        const pocketGeo = new THREE.BoxGeometry(0.11, 0.34, 0.24);
        const pocket = new THREE.Mesh(pocketGeo, accentMat);
        pocket.position.set(side * 0.44, 0.02, 0.03);
        pocket.rotation.z = side * -0.03;
        group.add(pocket);

        const flapGeo = new THREE.BoxGeometry(0.125, 0.08, 0.25);
        const flap = new THREE.Mesh(flapGeo, hardwareMat);
        flap.position.set(side * 0.445, 0.18, 0.03);
        group.add(flap);
      }
    });
  } else {
    // UPPER BODY GARMENTS
    const neckStub = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.19, 0.24, 28), mannequinMat);
    neckStub.position.y = 0.82;
    group.add(neckStub);

    const isOversized = garmentType === 'hoodie' || garmentType === 'bomber';
    const topWidth = isOversized ? 0.64 : 0.56;
    const bottomWidth = garmentType === 'leather_jacket' ? 0.48 : 0.54;
    const torsoGeo = new THREE.CylinderGeometry(topWidth, bottomWidth, 1.32, 36, 20);
    torsoGeo.scale(1, 1, 0.62);

    const pos = torsoGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const drapeWave = Math.sin(y * 7.5 + x * 4.0) * 0.014;
      const chestCurve = y > 0.1 ? Math.cos(y * 2.2) * 0.035 : 0;
      pos.setZ(i, z + (z > 0 ? chestCurve + drapeWave : -drapeWave));
    }
    torsoGeo.computeVertexNormals();

    const torso = new THREE.Mesh(torsoGeo, mainMat);
    torso.position.y = 0.08;
    group.add(torso);

    const isShortSleeve = garmentType === 'tshirt';
    const sleeveLen = isShortSleeve ? 0.52 : 1.18;

    [-1, 1].forEach((side) => {
      const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 20), mainMat);
      shoulder.scale.set(1.1, 0.9, 0.85);
      shoulder.position.set(side * (topWidth - 0.04), 0.58, 0);
      group.add(shoulder);

      const sleeveGeo = new THREE.CylinderGeometry(0.21, isShortSleeve ? 0.19 : 0.15, sleeveLen, 24, 10);
      const sleeve = new THREE.Mesh(sleeveGeo, mainMat);
      const angle = isShortSleeve ? 0.42 : 0.26;
      sleeve.rotation.z = side * angle;
      sleeve.position.set(
        side * (topWidth + (isShortSleeve ? 0.12 : 0.2)),
        isShortSleeve ? 0.36 : 0.04,
        0.02
      );
      group.add(sleeve);

      if (!isShortSleeve) {
        const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.135, 0.12, 24), accentMat);
        cuff.rotation.z = side * angle;
        cuff.position.set(side * (topWidth + 0.35), -0.5, 0.02);
        group.add(cuff);
      }
    });

    if (garmentType === 'hoodie') {
      const hoodGeo = new THREE.TorusGeometry(0.28, 0.12, 20, 36, Math.PI * 1.35);
      const hood = new THREE.Mesh(hoodGeo, mainMat);
      hood.rotation.x = Math.PI * 0.35;
      hood.rotation.z = -Math.PI * 0.17;
      hood.position.set(0, 0.72, -0.05);
      group.add(hood);

      const pocketGeo = new THREE.BoxGeometry(0.55, 0.28, 0.06);
      const pocket = new THREE.Mesh(pocketGeo, accentMat);
      pocket.position.set(0, -0.25, 0.34);
      group.add(pocket);
    } else if (garmentType === 'denim_jacket' || garmentType === 'leather_jacket' || garmentType === 'bomber') {
      const zip = new THREE.Mesh(new THREE.BoxGeometry(0.025, 1.3, 0.03), hardwareMat);
      zip.position.set(garmentType === 'leather_jacket' ? 0.08 : 0, 0.08, 0.36);
      group.add(zip);

      const collar = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.06, 14, 32, Math.PI * 1.4), accentMat);
      collar.rotation.x = Math.PI / 2;
      collar.rotation.z = Math.PI * 0.8;
      collar.position.set(0, 0.72, 0.02);
      group.add(collar);
    }

    const hem = new THREE.Mesh(new THREE.CylinderGeometry(bottomWidth, bottomWidth * 0.96, 0.12, 32), accentMat);
    hem.scale.set(1, 1, 0.63);
    hem.position.y = -0.55;
    group.add(hem);
  }

  return group;
}

// ============================================================================
// HIGH-FPS FAST 3D CANVAS COMPONENT WITH OFFSCREEN PAUSE & TOUCH CONTROLS
// ============================================================================
const Garment3DCanvas = ({
  garmentType = 'hoodie',
  colorHex = '#141416',
  roughness = 0.7,
  metalness = 0.15,
  wireframe = false,
  autoRotate = true,
  isHero = false,
  lightingPreset = 'studio',
  zoomLevel = 1,
  onResetTrigger
}) => {
  const mountRef = useRef(null);
  const garmentGroupRef = useRef(null);
  const ringGroupRef = useRef(null);
  const cameraRef = useRef(null);
  const targetRotYRef = useRef(0.35);
  const targetRotXRef = useRef(0.05);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 360;
    let height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    const baseZ = isHero ? 4.3 : 3.9;
    camera.position.set(0, 0.1, baseZ / zoomLevel);
    cameraRef.current = camera;

    // Fast GPU Renderer with clamped pixel ratio for silky mobile performance
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio Lights
    const isDramatic = lightingPreset === 'dramatic';
    const isCyber = lightingPreset === 'cyber';

    const ambient = new THREE.AmbientLight(0xffffff, isDramatic ? 0.45 : 0.9);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xfffbf2, isDramatic ? 2.6 : 1.9);
    keyLight.position.set(3.5, 5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(isCyber ? 0x93c5fd : 0xe5e7eb, isCyber ? 2.2 : 1.4);
    rimLight.position.set(-4, 3, -3.5);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(isCyber ? 0xc084fc : 0xf5efe6, 0.9, 10);
    fillLight.position.set(0, -2, 3);
    scene.add(fillLight);

    // Build 3D Garment
    const garment = buildProceduralGarmentGroup(garmentType, colorHex, roughness, metalness, wireframe);
    garmentGroupRef.current = garment;
    scene.add(garment);

    // Floating Hero Rings
    const ringGroup = new THREE.Group();
    if (isHero) {
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xd4d4d8,
        metalness: 0.9,
        roughness: 0.15
      });
      const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.012, 14, 80), ringMat);
      ring1.rotation.x = Math.PI / 2.3;
      ring1.rotation.y = 0.25;
      ringGroup.add(ring1);

      const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.65, 0.008, 14, 80), ringMat);
      ring2.rotation.x = -Math.PI / 3;
      ring2.rotation.y = -0.4;
      ringGroup.add(ring2);

      scene.add(ringGroup);
    }
    ringGroupRef.current = ringGroup;

    // Contact Shadow Disc
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    const grad = sCtx.createRadialGradient(64, 64, 6, 64, 64, 60);
    grad.addColorStop(0, 'rgba(0,0,0,0.3)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 128, 128);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 2.6),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.58;
    scene.add(shadowPlane);

    // Interactive Drag Physics
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
      const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;
      prevX = clientX;
      prevY = clientY;
    };

    const onPointerMove = (e) => {
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
      const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;

      if (isDragging) {
        const dx = clientX - prevX;
        const dy = clientY - prevY;
        targetRotYRef.current += dx * 0.013;
        targetRotXRef.current = Math.max(-0.45, Math.min(0.45, targetRotXRef.current + dy * 0.009));
        prevX = clientX;
        prevY = clientY;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Off-screen Visibility Optimizer
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(container);

    let frameId;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      // Save mobile CPU & battery when off-screen
      if (!isVisible) return;

      const t = clock.getElapsedTime();

      if (autoRotate && !isDragging) {
        targetRotYRef.current += 0.0055;
      }

      if (garmentGroupRef.current) {
        garmentGroupRef.current.rotation.y += (targetRotYRef.current - garmentGroupRef.current.rotation.y) * 0.09;
        garmentGroupRef.current.rotation.x += (targetRotXRef.current - garmentGroupRef.current.rotation.x) * 0.09;
        garmentGroupRef.current.position.y = Math.sin(t * 1.6) * 0.035;
      }

      if (ringGroupRef.current) {
        ringGroupRef.current.rotation.y = -t * 0.16;
        ringGroupRef.current.rotation.z = Math.sin(t * 0.5) * 0.07;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 360;
      height = container.clientHeight || 420;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      // Memory cleanup
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, [garmentType, colorHex, roughness, metalness, wireframe, autoRotate, isHero, lightingPreset]);

  useEffect(() => {
    if (cameraRef.current) {
      const baseZ = isHero ? 4.3 : 3.9;
      cameraRef.current.position.z = baseZ / zoomLevel;
    }
  }, [zoomLevel, isHero]);

  useEffect(() => {
    targetRotYRef.current = 0.35;
    targetRotXRef.current = 0.05;
  }, [onResetTrigger]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full cursor-grab active:cursor-grabbing select-none"
      aria-label={`Interactive 3D ${garmentType} model`}
    />
  );
};

// ============================================================================
// RESPONSIVE PRODUCT CARD COMPONENT
// ============================================================================
const ProductCard = ({
  product,
  onQuickView,
  onAddToCart,
  isWishlisted,
  onToggleWishlist
}) => {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('L');
  const [is3DMode, setIs3DMode] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  const currentColor = product.colors[selectedColorIdx] || product.colors[0];

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product, currentColor.name, selectedSize, 1);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 1600);
  };

  return (
    <div className="group relative bg-white/95 backdrop-blur-md rounded-3xl border border-neutral-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col justify-between transition-all duration-300">
      {/* Media & 3D Stage */}
      <div className="relative aspect-[4/5] w-full bg-gradient-to-b from-[#F4F3EF] to-[#EAE8E2] overflow-hidden">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold tracking-[0.18em] uppercase bg-neutral-900 text-white rounded-full">
            {product.badge}
          </span>
          {product.isOnSale && (
            <span className="px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold tracking-[0.14em] uppercase bg-amber-600 text-white rounded-full">
              SALE
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            aria-label="Toggle Wishlist"
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
              isWishlisted
                ? 'bg-neutral-900 text-white border-neutral-900 scale-105'
                : 'bg-white/80 text-neutral-800 border-white/60 hover:bg-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIs3DMode(!is3DMode);
            }}
            title="Toggle Live 3D Mesh"
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
              is3DMode
                ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                : 'bg-white/80 text-neutral-800 border-white/60 hover:bg-white'
            }`}
          >
            <Box className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* 3D Model or Image */}
        {is3DMode ? (
          <div className="w-full h-full relative">
            <Garment3DCanvas
              garmentType={product.garmentType}
              colorHex={currentColor.hex}
              roughness={currentColor.roughness}
              metalness={currentColor.metalness}
              autoRotate={true}
            />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-neutral-900/80 text-white text-[9px] sm:text-[10px] tracking-widest uppercase backdrop-blur-sm pointer-events-none flex items-center gap-1.5 whitespace-nowrap">
              <RotateCcw className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} />
              Drag 360° 3D Mesh
            </div>
          </div>
        ) : (
          <div
            onClick={() => onQuickView(product, selectedColorIdx, selectedSize)}
            className="w-full h-full cursor-pointer relative overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-x-3 bottom-3 z-20 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 hidden sm:flex">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickView(product, selectedColorIdx, selectedSize);
                }}
                className="w-full py-2.5 rounded-xl bg-white/95 backdrop-blur-md text-neutral-900 text-[11px] font-bold tracking-wider uppercase shadow-md hover:bg-neutral-900 hover:text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" /> Quick View 3D
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-neutral-500 uppercase tracking-widest mb-1">
            <span>{product.category}</span>
            <span className="flex items-center gap-1 text-neutral-800 font-medium">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {product.rating}
            </span>
          </div>

          <h3
            onClick={() => onQuickView(product, selectedColorIdx, selectedSize)}
            className="font-bold text-neutral-900 text-sm sm:text-base tracking-tight hover:text-neutral-600 cursor-pointer transition-colors line-clamp-1"
          >
            {product.name}
          </h3>

          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-black text-neutral-900">{formatINR(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-neutral-400 line-through">{formatINR(product.originalPrice)}</span>
            )}
          </div>

          {/* Swatches & Sizes */}
          <div className="mt-3.5 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {product.colors.map((c, idx) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColorIdx(idx)}
                  title={c.name}
                  className={`w-5 h-5 rounded-full border transition-transform ${
                    selectedColorIdx === idx
                      ? 'ring-2 ring-offset-1 ring-neutral-900 scale-110'
                      : 'border-neutral-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>

            <div className="flex items-center gap-1">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`w-6 h-6 rounded-md text-[10px] font-bold transition-colors ${
                    selectedSize === sz
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleAdd}
          className={`mt-3.5 w-full py-2.5 sm:py-3 px-3 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] flex items-center justify-center gap-1.5 transition-all ${
            addedToast
              ? 'bg-emerald-700 text-white'
              : 'bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[0.99]'
          }`}
        >
          {addedToast ? (
            <>
              <Check className="w-3.5 h-3.5" /> Added ({selectedSize})
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" /> Add to Bag
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN APPLICATION
// ============================================================================
export default function App() {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_wear_cart');
      return saved ? JSON.parse(saved) : [
        {
          key: 'aura-01-Obsidian Black-L',
          product: PRODUCTS[0],
          color: 'Obsidian Black',
          size: 'L',
          quantity: 1
        }
      ];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_wear_wishlist');
      return saved ? JSON.parse(saved) : ['aura-01', 'aura-05'];
    } catch {
      return ['aura-01'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('aura_wear_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('aura_wear_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // UI State
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Hero 3D Stage Controls
  const [heroGarmentIdx, setHeroGarmentIdx] = useState(0);
  const [heroColorIdx, setHeroColorIdx] = useState(0);
  const [heroWireframe, setHeroWireframe] = useState(false);
  const [heroLighting, setHeroLighting] = useState('studio');
  const [heroAutoRotate, setHeroAutoRotate] = useState(true);
  const [heroZoom, setHeroZoom] = useState(1);
  const [heroResetKey, setHeroResetKey] = useState(0);

  // Quick View Modal
  const [quickViewData, setQuickViewData] = useState(null);
  const [qvColorIdx, setQvColorIdx] = useState(0);
  const [qvSize, setQvSize] = useState('L');
  const [qvQty, setQvQty] = useState(1);
  const [qvMode, setQvMode] = useState('3d');
  const [qvWireframe, setQvWireframe] = useState(false);
  const [qvZoom, setQvZoom] = useState(1);

  // Lookbook & Promo
  const [activeHotspot, setActiveHotspot] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);

  // Gemini AI Atelier
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiTab, setAiTab] = useState('stylist');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiOutfitResult, setAiOutfitResult] = useState(null);

  // Image Upload Matcher
  const [uploadedImagePreview, setUploadedImagePreview] = useState(null);
  const [uploadedBase64, setUploadedBase64] = useState(null);
  const [uploadedMimeType, setUploadedMimeType] = useState('image/jpeg');
  const [visualMatchResult, setVisualMatchResult] = useState(null);

  // Fit Concierge
  const [fitHeight, setFitHeight] = useState('178');
  const [fitWeight, setFitWeight] = useState('72');
  const [fitPreference, setFitPreference] = useState('Architectural Oversized');
  const [fitAdvice, setFitAdvice] = useState(null);
  const [fitLoading, setFitLoading] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // AI Outfit Handler with Fallback
  const handleGenerateAIOutfit = async (customPrompt) => {
    const queryText = customPrompt || aiPrompt;
    if (!queryText.trim()) return;

    setAiLoading(true);
    setAiError('');

    try {
      const catalogContext = PRODUCTS.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        gender: p.gender,
        price: p.price,
        colors: p.colors.map((c) => c.name),
        description: p.description
      }));

      const systemPrompt = `You are Chief Creative Director at AURA WEAR, a 3D luxury atelier.
Curate a 2 to 3 piece capsule strictly using products from: ${JSON.stringify(catalogContext)}.
Return a JSON object with keys: lookTitle, editorialNote, stylingTip, and recommendations (array with productId, recommendedColor, recommendedSize, rationale).`;

      const payload = {
        contents: [{ role: 'user', parts: [{ text: queryText }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          responseMimeType: 'application/json'
        }
      };

      const rawJson = await callGeminiAPI(payload);
      const parsed = JSON.parse(rawJson);
      setAiOutfitResult(parsed);
    } catch {
      // Smart offline fallback
      setAiOutfitResult({
        lookTitle: `Archival Silhouette: ${queryText}`,
        editorialNote: 'Engineered for seamless movement between brutalist architecture and nocturnal streetscapes.',
        stylingTip: 'Layer the heavyweight hoodie beneath the selvedge jacket and leave the front unfastened to highlight column proportions.',
        recommendations: [
          {
            productId: 'aura-01',
            recommendedColor: 'Obsidian Black',
            recommendedSize: 'L',
            rationale: '520GSM terry provides structured drop shoulders that anchor the entire silhouette.'
          },
          {
            productId: 'aura-04',
            recommendedColor: 'Dune Beige',
            recommendedSize: 'L',
            rationale: 'Origami bellows pockets introduce technical utility contrast against matte obsidian fleece.'
          }
        ]
      });
    } finally {
      setAiLoading(false);
    }
  };

  // Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      setUploadedImagePreview(dataUrl);
      setUploadedBase64(dataUrl.split(',')[1]);
      setVisualMatchResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeVisualVibe = async () => {
    if (!uploadedBase64) return;
    setAiLoading(true);
    setAiError('');

    try {
      const catalogContext = PRODUCTS.map((p) => ({
        id: p.id,
        name: p.name,
        colors: p.colors.map((c) => c.name)
      }));

      const prompt = `Match this photo to 2 ideal garments from AURA WEAR catalog: ${JSON.stringify(catalogContext)}.`;
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              { inlineData: { mimeType: uploadedMimeType, data: uploadedBase64 } }
            ]
          }
        ],
        generationConfig: { responseMimeType: 'application/json' }
      };

      const rawJson = await callGeminiAPI(payload);
      setVisualMatchResult(JSON.parse(rawJson));
    } catch {
      setVisualMatchResult({
        detectedAesthetic: 'Neo-Brutalist Monochrome',
        dominantPalette: 'Ashen Slate & Matte Carbon',
        editorialAnalysis: 'High architectural geometry with controlled textural depth and tactile matte surfaces.',
        matchedItems: [
          {
            productId: 'aura-05',
            suggestedColor: 'Noir Gloss',
            matchReason: 'Sharp tailored angles mirror the geometric lines found in your reference image.'
          },
          {
            productId: 'aura-08',
            suggestedColor: 'Vintage Ice Blue',
            matchReason: 'Wide column denim drapes harmoniously with structured outerwear.'
          }
        ]
      });
    } finally {
      setAiLoading(false);
    }
  };

  // Fit & Drape Concierge
  const handleGetFitAdvice = async (product) => {
    if (!product) return;
    setFitLoading(true);
    try {
      const prompt = `Client: Height ${fitHeight}cm, Weight ${fitWeight}kg, Style: ${fitPreference}.
Product: ${product.name}. Recommend exact size [S, M, L, XL], 3D drape feedback, and fabric care tip. Return JSON with recommendedSize, drapeAnalysis, careInstruction.`;

      const payload = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
      };

      const rawJson = await callGeminiAPI(payload);
      const parsed = JSON.parse(rawJson);
      setFitAdvice(parsed);
      if (['S', 'M', 'L', 'XL'].includes(parsed.recommendedSize)) {
        setQvSize(parsed.recommendedSize);
      }
    } catch {
      setFitAdvice({
        recommendedSize: 'L',
        drapeAnalysis: `At ${fitHeight}cm and ${fitWeight}kg, Size L delivers the intended architectural drop-shoulder posture with zero chest constriction.`,
        careInstruction: 'Cold gentle wash or eco dry-clean to preserve sculptural seams.'
      });
    } finally {
      setFitLoading(false);
    }
  };

  // Cart Functions
  const handleAddToCart = (product, color, size, quantity = 1) => {
    const key = `${product.id}-${color}-${size}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { key, product, color, size, quantity }];
    });
  };

  const updateCartQty = (key, delta) => {
    setCart((prev) =>
      prev
        .map((item) => (item.key === key ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeCartItem = (key) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const openQuickView = (product, colorIdx = 0, size = 'L') => {
    setQuickViewData(product);
    setQvColorIdx(colorIdx);
    setQvSize(size);
    setQvQty(1);
    setQvMode('3d');
    setQvZoom(1);
    setFitAdvice(null);
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesCat =
        activeCategory === 'All' ||
        p.category.toLowerCase() === activeCategory.toLowerCase() ||
        p.gender.toLowerCase() === activeCategory.toLowerCase() ||
        (activeCategory === 'Sale' && p.isOnSale) ||
        (activeCategory === 'Accessories' && (p.garmentType === 'leather_jacket' || p.garmentType === 'bomber'));
      const matchesSearch =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [activeCategory, searchQuery, sortBy]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = discountApplied ? Math.round(subtotal * 0.2) : 0;
  const shippingCost = subtotal > 4000 || subtotal === 0 ? 0 : 250;
  const finalTotal = subtotal - discountAmount + shippingCost;

  const currentHeroProduct = PRODUCTS[heroGarmentIdx] || PRODUCTS[0];
  const currentHeroColor = currentHeroProduct.colors[heroColorIdx] || currentHeroProduct.colors[0];

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white flex flex-col justify-between">
      {/* Announcement Bar */}
      <div className="bg-[#121214] text-neutral-200 text-[10px] sm:text-[11px] tracking-[0.2em] uppercase py-2 px-3 sm:px-4 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300 shrink-0" />
        <span className="truncate">AURA ATELIER 2026 • COMPLIMENTARY EXPRESS DISPATCH OVER ₹4,000 • CODE: AURA20</span>
      </div>

      {/* Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] border-b border-neutral-200/80 py-3'
            : 'bg-[#FAF9F5]/90 backdrop-blur-md py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Mobile Menu Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 rounded-xl text-neutral-800 hover:bg-neutral-200/60 transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <a href="#top" className="flex items-center gap-2.5 group focus:outline-none">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold tracking-tighter text-xs sm:text-sm group-hover:rotate-6 transition-transform">
                AW
              </div>
              <div>
                <span className="text-base sm:text-lg font-black tracking-[0.24em] uppercase block leading-none">
                  AURA WEAR
                </span>
                <span className="text-[8px] sm:text-[9px] tracking-[0.28em] text-neutral-400 uppercase block mt-0.5">
                  3D Digital Atelier
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-700">
            {['Men', 'Women', 'Streetwear', 'Essentials', 'Sale'].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActiveCategory(item);
                  scrollToSection('catalog-section');
                }}
                className={`hover:text-neutral-950 transition-colors relative py-1 ${
                  activeCategory === item
                    ? 'text-neutral-950 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-neutral-900'
                    : ''
                }`}
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('lookbook-section')}
              className="hover:text-neutral-950 transition-colors py-1"
            >
              Lookbook
            </button>
            <button
              onClick={() => scrollToSection('story-section')}
              className="hover:text-neutral-950 transition-colors py-1"
            >
              Atelier
            </button>
            <button
              onClick={() => setAiDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 text-white text-[10px] font-bold tracking-[0.18em] uppercase hover:bg-neutral-800 transition-all shadow-sm"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              AI Stylist
            </button>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <button
              onClick={() => setAiDrawerOpen(true)}
              aria-label="Open AI Bespoke Stylist"
              className="lg:hidden p-2 rounded-full bg-neutral-900 text-white hover:bg-neutral-800"
              title="AI Stylist"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </button>

            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              className="p-2 sm:p-2.5 rounded-full hover:bg-neutral-200/70 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={() => setWishlistOpen(true)}
              aria-label="Wishlist"
              className="relative p-2 sm:p-2.5 rounded-full hover:bg-neutral-200/70 transition-colors"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-neutral-900 text-white text-[9px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setCartOpen(true)}
              aria-label="Bag"
              className="relative flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-full bg-neutral-900 text-white text-xs font-semibold tracking-wider hover:bg-neutral-800 transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{cartCount}</span>
            </button>
          </div>
        </div>

        {/* Expandable Search Input */}
        {searchOpen && (
          <div className="max-w-3xl mx-auto px-4 pt-3 pb-2 animate-fadeIn">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-neutral-400 absolute left-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  scrollToSection('catalog-section');
                }}
                placeholder="Search 3D garments (e.g. Hoodie, Denim, Cargo, Leather)..."
                className="w-full pl-11 pr-20 py-2.5 sm:py-3 rounded-2xl bg-white border border-neutral-300 text-xs sm:text-sm focus:outline-none focus:border-neutral-900 shadow-sm"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-10 text-xs text-neutral-400 hover:text-neutral-700"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setSearchOpen(false)}
                className="absolute right-3 p-1 text-neutral-500 hover:text-neutral-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-neutral-200 px-5 py-4 space-y-3 animate-fadeIn">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              Browse Categories
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['All', 'Men', 'Women', 'Streetwear', 'Essentials', 'Sale'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    scrollToSection('catalog-section');
                  }}
                  className={`py-2 px-3 rounded-xl text-left text-xs font-semibold uppercase tracking-wider transition-colors ${
                    activeCategory === cat ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setAiDrawerOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 py-2 text-xs font-bold uppercase tracking-wider text-neutral-900"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Launch AI Stylist</span>
              </button>
              <button
                onClick={() => scrollToSection('lookbook-section')}
                className="text-xs font-medium text-neutral-500 hover:text-neutral-900"
              >
                Lookbook →
              </button>
            </div>
          </div>
        )}
      </header>

      {/* =====================================================================
          HERO SECTION: 3D MANNEQUIN SHOWCASE (MOBILE OPTIMIZED)
      ===================================================================== */}
      <section id="top" className="relative overflow-hidden pt-2 pb-8 sm:pt-4 sm:pb-12 lg:py-16 border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-center">
            {/* Left Copy Column */}
            <div className="lg:col-span-6 space-y-3 sm:space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200/90 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-700">
                  REAL-TIME 3D ATELIER • EDITION 04
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[0.98] text-neutral-950">
                WEAR THE <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-950 via-neutral-600 to-neutral-400">
                  FUTURE.
                </span>
              </h1>

              <p className="text-xs sm:text-sm lg:text-base text-neutral-600 max-w-xl leading-relaxed font-normal">
                Architectural streetwear crafted from 520GSM organic textiles. Inspect real-time 360° cloth simulation and material shaders below.
              </p>

              {/* Streamlined Action Buttons (Side-by-Side on Mobile, No Heavy Vertical Stacking) */}
              <div className="space-y-2 pt-0.5">
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
                  <button
                    onClick={() => scrollToSection('catalog-section')}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl bg-neutral-950 text-white text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] hover:bg-neutral-800 transition-all shadow-sm flex items-center justify-center gap-1.5 group active:scale-[0.98]"
                  >
                    <span>Shop Now</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    onClick={() => openQuickView(currentHeroProduct, heroColorIdx, 'L')}
                    className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl bg-white border border-neutral-300 text-neutral-900 text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] hover:border-neutral-900 transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
                  >
                    <Box className="w-3.5 h-3.5 text-neutral-900" />
                    <span>Inspect 3D</span>
                  </button>
                </div>

                <button
                  onClick={() => setAiDrawerOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] hover:opacity-95 transition-all shadow-xs border border-neutral-700/80 active:scale-[0.98]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Launch AI Bespoke Look Architect</span>
                </button>
              </div>

              {/* Garment Switcher Chips */}
              <div className="pt-2 sm:pt-4 border-t border-neutral-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                    LIVE 3D OUTFIT SELECTOR:
                  </span>
                  <span className="text-[9px] text-neutral-400 hidden sm:inline">Tap to swap mesh</span>
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {PRODUCTS.slice(0, 5).map((prod, idx) => (
                    <button
                      key={prod.id}
                      onClick={() => {
                        setHeroGarmentIdx(idx);
                        setHeroColorIdx(0);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        heroGarmentIdx === idx
                          ? 'bg-neutral-900 text-white shadow-sm ring-2 ring-neutral-900 ring-offset-1'
                          : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: prod.colors[0].hex }} />
                      <span>{prod.name.split(' ').slice(-2).join(' ')}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 3D Stage (Optimized for Mobile Height & Touch Controls) */}
            <div className="lg:col-span-6 relative">
              <div className="relative h-[330px] sm:h-[450px] lg:h-[510px] w-full rounded-2xl sm:rounded-[2rem] bg-gradient-to-b from-[#EFECE6] via-[#E6E3DD] to-[#F7F6F2] border border-white shadow-[0_15px_45px_-12px_rgba(0,0,0,0.08)] overflow-hidden">
                {/* Floating Top Controls (Responsive & Mobile-safe) */}
                <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between pointer-events-none gap-1.5">
                  <div className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-white/70 shadow-xs pointer-events-auto max-w-[60%] sm:max-w-none truncate">
                    <div className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-neutral-400 truncate">3D Sculpture</div>
                    <div className="text-[11px] sm:text-xs font-bold text-neutral-900 truncate">
                      {currentHeroProduct.name}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 pointer-events-auto">
                    <button
                      onClick={() => setHeroWireframe(!heroWireframe)}
                      className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider backdrop-blur-md border transition-all ${
                        heroWireframe ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white/85 text-neutral-800 border-white'
                      }`}
                    >
                      {heroWireframe ? 'Wire' : 'Solid'}
                    </button>
                    <button
                      onClick={() =>
                        setHeroLighting((prev) => (prev === 'studio' ? 'dramatic' : prev === 'dramatic' ? 'cyber' : 'studio'))
                      }
                      className="px-2 py-1 rounded-lg bg-white/85 backdrop-blur-md border border-white text-[9px] font-bold uppercase tracking-wider text-neutral-800 hover:bg-white"
                    >
                      {heroLighting}
                    </button>
                  </div>
                </div>

                {/* 3D Canvas */}
                <Garment3DCanvas
                  garmentType={currentHeroProduct.garmentType}
                  colorHex={currentHeroColor.hex}
                  roughness={currentHeroColor.roughness}
                  metalness={currentHeroColor.metalness}
                  wireframe={heroWireframe}
                  autoRotate={heroAutoRotate}
                  isHero={true}
                  lightingPreset={heroLighting}
                  zoomLevel={heroZoom}
                  onResetTrigger={heroResetKey}
                />

                {/* Mobile Rotation Hint */}
                <div className="absolute top-12 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/40 text-white/90 text-[9px] font-medium tracking-wider uppercase backdrop-blur-xs pointer-events-none flex items-center gap-1 sm:hidden">
                  <RotateCcw className="w-2.5 h-2.5" /> Drag 360°
                </div>

                {/* Bottom Controls Bar */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-white/90 backdrop-blur-md border border-white/70 shadow-xs">
                  <div className="flex items-center gap-1.5">
                    {currentHeroProduct.colors.map((c, idx) => (
                      <button
                        key={c.name}
                        onClick={() => setHeroColorIdx(idx)}
                        className={`w-5 h-5 rounded-full border transition-transform ${
                          heroColorIdx === idx ? 'ring-2 ring-offset-1 ring-neutral-900 scale-110' : 'border-neutral-300'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                    <span className="text-[10px] font-semibold text-neutral-700 ml-1 hidden sm:inline">
                      {currentHeroColor.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setHeroZoom((z) => (z >= 1.3 ? 0.9 : z + 0.15))}
                      className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-700"
                      title="Zoom"
                    >
                      <ZoomIn className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setHeroResetKey((k) => k + 1)}
                      className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-700"
                      title="Reset View"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setHeroAutoRotate(!heroAutoRotate)}
                      className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-100"
                    >
                      {heroAutoRotate ? 'Auto 360' : 'Hold'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          CATEGORIES SECTION
      ===================================================================== */}
      <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-2">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] text-neutral-400">
              ARCHITECTURAL DIVISIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 mt-0.5">
              Curated Silos
            </h2>
          </div>
          <p className="text-xs text-neutral-500 max-w-sm hidden sm:block">
            Filter our 8 signature editions with real-time WebGL 3D inspection.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  scrollToSection('catalog-section');
                }}
                className={`group relative h-36 sm:h-44 rounded-2xl sm:rounded-3xl overflow-hidden text-left p-3.5 sm:p-4 flex flex-col justify-end transition-all ${
                  isActive
                    ? 'ring-2 ring-neutral-950 ring-offset-2 shadow-lg -translate-y-0.5'
                    : 'hover:-translate-y-0.5 shadow-sm'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="relative z-10 text-white">
                  <div className="text-[9px] uppercase tracking-[0.2em] text-neutral-300">{cat.subtitle}</div>
                  <div className="text-sm sm:text-base font-bold tracking-wide flex items-center justify-between mt-0.5">
                    <span>{cat.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          FEATURED 8 PRODUCTS CATALOG
      ===================================================================== */}
      <section id="catalog-section" className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] text-neutral-400">
                08 SIGNATURE EDITIONS
              </span>
              {activeCategory !== 'All' && (
                <span className="px-2.5 py-0.5 rounded-full bg-neutral-900 text-white text-[10px] font-bold uppercase">
                  {activeCategory}
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-neutral-900 mt-1">
              Featured 3D Collection
            </h2>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center bg-white border border-neutral-200 rounded-xl p-1 overflow-x-auto max-w-full">
              {['All', 'Men', 'Women', 'Streetwear', 'Essentials'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveCategory(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeCategory === tab
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort products"
              className="px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-semibold text-neutral-800 focus:outline-none"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* 3D Mode Hint */}
        <div className="my-5 px-4 py-3 rounded-2xl bg-neutral-900/5 border border-neutral-200/80 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-600">
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-neutral-900 shrink-0" />
            <span>
              Tap the cube icon <span className="inline-block px-1.5 py-0.5 bg-white rounded border text-[10px] font-bold">3D</span> on any card to spin a real-time WebGL mesh.
            </span>
          </div>
          {activeCategory !== 'All' && (
            <button onClick={() => setActiveCategory('All')} className="text-neutral-900 font-bold underline">
              Show All ({PRODUCTS.length})
            </button>
          )}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200">
            <p className="text-neutral-500 text-sm">No garments found in this category.</p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
              className="mt-3 px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider"
            >
              Show All 8 Pieces
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={openQuickView}
                onAddToCart={handleAddToCart}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        )}
      </section>

      {/* =====================================================================
          CINEMATIC BANNER
      ===================================================================== */}
      <section className="my-10 sm:my-16 bg-[#121214] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[10px] font-bold uppercase tracking-[0.25em]">
              LIMITED CARBON-NEUTRAL DROP
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              THE BIO-NAPPA &amp; SELVEDGE ARCHIVE.
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm lg:text-base max-w-xl leading-relaxed">
              Every AURA WEAR silhouette features digital twin cloth simulation. Rotate our Classic Leather Jacket in real-time 3D or apply code <span className="text-white font-bold">AURA20</span> for 20% off.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <button
                onClick={() => openQuickView(PRODUCTS[4], 0, 'L')}
                className="px-5 sm:px-6 py-3 rounded-xl bg-white text-neutral-950 text-xs font-bold uppercase tracking-[0.18em] hover:bg-neutral-200 transition-colors"
              >
                Inspect Leather Jacket 3D
              </button>
              <button
                onClick={() => {
                  setPromoCode('AURA20');
                  setDiscountApplied(true);
                  setCartOpen(true);
                }}
                className="px-5 sm:px-6 py-3 rounded-xl border border-white/30 text-white text-xs font-bold uppercase tracking-[0.18em] hover:bg-white/10 transition-colors"
              >
                Apply 20% Code
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 h-[280px] sm:h-[340px] rounded-3xl bg-gradient-to-b from-neutral-800/80 to-neutral-900 border border-white/10 relative overflow-hidden">
            <Garment3DCanvas
              garmentType="leather_jacket"
              colorHex="#121214"
              roughness={0.25}
              metalness={0.5}
              autoRotate={true}
              lightingPreset="dramatic"
            />
            <div className="absolute bottom-3 right-3 text-[9px] uppercase tracking-widest text-neutral-400">
              WebGL 3D Studio • Drag to Rotate
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          LOOKBOOK SECTION
      ===================================================================== */}
      <section id="lookbook-section" className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] text-neutral-400">
              AUTUMN / WINTER EDITORIAL
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 mt-1">
              Interactive Lookbook
            </h2>
          </div>
          <p className="text-xs text-neutral-500 max-w-md hidden sm:block">
            Click the hotspots on the editorial photo to inspect styled 3D pieces.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 relative rounded-3xl overflow-hidden aspect-[16/11] bg-neutral-200 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=85"
              alt="Lookbook"
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />

            {/* Hotspots */}
            <button
              onClick={() => setActiveHotspot(0)}
              style={{ top: '34%', left: '46%' }}
              className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center transition-transform ${
                activeHotspot === 0 ? 'bg-neutral-900 text-white scale-125 ring-4 ring-white' : 'bg-white text-neutral-900'
              }`}
              aria-label="Inspect Upper Layer"
            >
              <Plus className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveHotspot(1)}
              style={{ top: '68%', left: '52%' }}
              className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center transition-transform ${
                activeHotspot === 1 ? 'bg-neutral-900 text-white scale-125 ring-4 ring-white' : 'bg-white text-neutral-900'
              }`}
              aria-label="Inspect Bottom Layer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Hotspot Product Card */}
          <div className="lg:col-span-5 bg-white p-5 sm:p-7 rounded-3xl border border-neutral-200 shadow-xs">
            {(() => {
              const spotProducts = [PRODUCTS[6], PRODUCTS[3]];
              const spotProd = spotProducts[activeHotspot] || PRODUCTS[0];
              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-neutral-100 text-neutral-700">
                      Lookbook Layer 0{activeHotspot + 1}
                    </span>
                    <span className="text-sm font-black text-neutral-900">{formatINR(spotProd.price)}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 items-center">
                    <img src={spotProd.image} alt={spotProd.name} className="w-full h-36 object-cover rounded-2xl" />
                    <div className="h-36 rounded-2xl bg-[#F4F3EF] overflow-hidden relative">
                      <Garment3DCanvas
                        garmentType={spotProd.garmentType}
                        colorHex={spotProd.colors[0].hex}
                        roughness={spotProd.colors[0].roughness}
                        metalness={spotProd.colors[0].metalness}
                        autoRotate={true}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-neutral-900">{spotProd.name}</h3>
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">{spotProd.description}</p>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleAddToCart(spotProd, spotProd.colors[0].name, 'L', 1)}
                      className="flex-1 py-3 px-3 rounded-xl bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800"
                    >
                      Add to Bag
                    </button>
                    <button
                      onClick={() => openQuickView(spotProd, 0, 'L')}
                      className="py-3 px-3 rounded-xl border border-neutral-300 text-xs font-bold uppercase tracking-wider hover:border-neutral-900"
                    >
                      3D View
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* =====================================================================
          BRAND STORY & REVIEWS
      ===================================================================== */}
      <section id="story-section" className="py-12 sm:py-16 bg-white border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] text-neutral-400">
                AURA ATELIER PHILOSOPHY
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-neutral-900 leading-tight">
                Zero-Waste 3D Cloth Physics Meets Luxury Textiles.
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Before cutting a single yard of Supima cotton or Okayama selvedge denim, our silhouettes are simulated in cloth physics to eliminate sample waste while guaranteeing flawless structural drape.
              </p>
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-neutral-100">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-neutral-900">520<span className="text-xs font-normal">GSM</span></div>
                  <div className="text-[10px] text-neutral-500 uppercase tracking-wider">Heavy Terry</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-neutral-900">100%</div>
                  <div className="text-[10px] text-neutral-500 uppercase tracking-wider">Traceable</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-neutral-900">360°</div>
                  <div className="text-[10px] text-neutral-500 uppercase tracking-wider">WebGL 3D</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-3">
              <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80"
                alt="Craft"
                loading="lazy"
                className="rounded-2xl h-52 sm:h-64 w-full object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80"
                alt="Showroom"
                loading="lazy"
                className="rounded-2xl h-52 sm:h-64 w-full object-cover mt-6"
              />
            </div>
          </div>

          {/* Reviews */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {REVIEWS.map((rev) => (
              <div key={rev.id} className="bg-[#FAF9F5] p-5 rounded-2xl border border-neutral-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed mb-3">“{rev.comment}”</p>
                </div>
                <div className="pt-2 border-t border-neutral-200/60">
                  <div className="text-xs font-bold text-neutral-900">{rev.author}</div>
                  <div className="text-[10px] text-neutral-400">{rev.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          NEWSLETTER
      ===================================================================== */}
      <section className="py-10 sm:py-14 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-neutral-900 text-white p-6 sm:p-10 text-center space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400">
            PRIVATE ARCHIVE ACCESS
          </span>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight">
            Join the AURA WEAR Syndicate
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
            Early invitations to limited 3D capsule drops and 15% off your next order.
          </p>

          {newsletterSubscribed ? (
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" /> Welcome to the Syndicate. Promo code: AURA20
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newsletterEmail.trim()) setNewsletterSubscribed(true);
              }}
              className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 pt-1"
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter email address..."
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-neutral-400 text-xs focus:outline-none focus:border-white"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-white text-neutral-950 text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* =====================================================================
          FOOTER
      ===================================================================== */}
      <footer className="bg-white border-t border-neutral-200 pt-10 pb-24 sm:pb-8 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-8 border-b border-neutral-100">
          <div className="space-y-2">
            <div className="text-base font-black tracking-[0.22em] text-neutral-900">AURA WEAR</div>
            <p className="leading-relaxed">Architectural streetwear engineered with 3D digital cloth simulation.</p>
          </div>
          <div>
            <div className="font-bold text-neutral-900 uppercase tracking-widest mb-2">Collections</div>
            <ul className="space-y-1.5">
              {['Men', 'Women', 'Streetwear', 'Essentials', 'Sale'].map((c) => (
                <li key={c}>
                  <button onClick={() => { setActiveCategory(c); scrollToSection('catalog-section'); }} className="hover:text-neutral-900">
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-bold text-neutral-900 uppercase tracking-widest mb-2">Client Services</div>
            <ul className="space-y-1.5">
              <li>Real-time 3D Fit Guide</li>
              <li>Complimentary Express Shipping</li>
              <li>14-Day Archive Returns</li>
            </ul>
          </div>
          <div>
            <div className="font-bold text-neutral-900 uppercase tracking-widest mb-2">Ateliers</div>
            <p className="leading-relaxed">
              DLF Emporio, New Delhi<br />
              Kala Ghoda, Mumbai<br />
              Via Monte Napoleone, Milan
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <span>© 2026 AURA WEAR ATELIER. All rights reserved.</span>
          <span>Prices in Indian Rupees (INR ₹)</span>
        </div>
      </footer>

      {/* =====================================================================
          QUICK VIEW 3D MODAL (RESPONSIVE & MOBILE-FRIENDLY)
      ===================================================================== */}
      {quickViewData && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-4xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 grid grid-cols-1 md:grid-cols-12 relative">
            <button
              onClick={() => setQuickViewData(null)}
              className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-white/90 border border-neutral-200 flex items-center justify-center hover:bg-neutral-900 hover:text-white"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left 3D View */}
            <div className="md:col-span-6 bg-[#F1EFEA] relative min-h-[320px] sm:min-h-[440px] flex flex-col justify-between p-3 sm:p-4">
              <div className="flex items-center justify-between z-20">
                <div className="inline-flex rounded-xl bg-white/90 p-1 border border-neutral-200">
                  <button
                    onClick={() => setQvMode('3d')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                      qvMode === '3d' ? 'bg-neutral-900 text-white' : 'text-neutral-600'
                    }`}
                  >
                    3D Model
                  </button>
                  <button
                    onClick={() => setQvMode('photo')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                      qvMode === 'photo' ? 'bg-neutral-900 text-white' : 'text-neutral-600'
                    }`}
                  >
                    Editorial
                  </button>
                </div>

                {qvMode === '3d' && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setQvWireframe(!qvWireframe)}
                      className="px-2 py-1 rounded-lg bg-white/90 text-[9px] font-bold uppercase border border-neutral-200"
                    >
                      {qvWireframe ? 'Solid' : 'Wire'}
                    </button>
                    <button
                      onClick={() => setQvZoom((z) => (z >= 1.25 ? 0.85 : z + 0.2))}
                      className="px-2 py-1 rounded-lg bg-white/90 text-[9px] font-bold uppercase border border-neutral-200"
                    >
                      Zoom: {Math.round(qvZoom * 100)}%
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 relative my-2">
                {qvMode === '3d' ? (
                  <Garment3DCanvas
                    garmentType={quickViewData.garmentType}
                    colorHex={(quickViewData.colors[qvColorIdx] || quickViewData.colors[0]).hex}
                    roughness={(quickViewData.colors[qvColorIdx] || quickViewData.colors[0]).roughness}
                    metalness={(quickViewData.colors[qvColorIdx] || quickViewData.colors[0]).metalness}
                    wireframe={qvWireframe}
                    autoRotate={true}
                    zoomLevel={qvZoom}
                  />
                ) : (
                  <img
                    src={quickViewData.image}
                    alt={quickViewData.name}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                )}
              </div>

              <div className="text-center text-[9px] uppercase tracking-widest text-neutral-500">
                Drag to rotate 360° • Real-time WebGL
              </div>
            </div>

            {/* Right Details */}
            <div className="md:col-span-6 p-5 sm:p-7 flex flex-col justify-between space-y-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  {quickViewData.category} • {quickViewData.badge}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-neutral-900 mt-1">{quickViewData.name}</h2>

                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-xl sm:text-2xl font-black text-neutral-900">{formatINR(quickViewData.price)}</span>
                  {quickViewData.originalPrice && (
                    <span className="text-xs text-neutral-400 line-through">
                      {formatINR(quickViewData.originalPrice)}
                    </span>
                  )}
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed mt-3">{quickViewData.description}</p>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-1.5 mt-3">
                  {quickViewData.fabricSpecs.map((spec) => (
                    <div key={spec} className="px-2.5 py-1 rounded-lg bg-neutral-100 text-[10px] font-medium text-neutral-700">
                      • {spec}
                    </div>
                  ))}
                </div>

                {/* Swatches */}
                <div className="mt-4">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">
                    Color: {(quickViewData.colors[qvColorIdx] || quickViewData.colors[0]).name}
                  </label>
                  <div className="flex items-center gap-2">
                    {quickViewData.colors.map((c, idx) => (
                      <button
                        key={c.name}
                        onClick={() => setQvColorIdx(idx)}
                        className={`w-6 h-6 rounded-full border ${
                          qvColorIdx === idx ? 'ring-2 ring-offset-1 ring-neutral-900 scale-110' : 'border-neutral-300'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>

                {/* Sizes & Qty */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">
                      Size
                    </label>
                    <div className="flex gap-1">
                      {quickViewData.sizes.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setQvSize(sz)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold border ${
                            qvSize === sz
                              ? 'bg-neutral-900 text-white border-neutral-900'
                              : 'border-neutral-200 text-neutral-700'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">
                      Quantity
                    </label>
                    <div className="flex items-center border border-neutral-200 rounded-lg">
                      <button
                        onClick={() => setQvQty((q) => Math.max(1, q - 1))}
                        className="px-2.5 py-1.5 text-neutral-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="flex-1 text-center text-xs font-bold">{qvQty}</span>
                      <button
                        onClick={() => setQvQty((q) => q + 1)}
                        className="px-2.5 py-1.5 text-neutral-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI Fit Concierge Panel */}
                <div className="mt-4 p-3.5 rounded-2xl bg-[#FAF9F5] border border-neutral-200/90 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1">
                      <Ruler className="w-3.5 h-3.5" />
                      AI 3D Fit Concierge
                    </span>
                    <button
                      onClick={() => handleGetFitAdvice(quickViewData)}
                      disabled={fitLoading}
                      className="px-2 py-1 rounded-lg bg-neutral-900 text-white text-[9px] font-bold uppercase hover:bg-neutral-800 flex items-center gap-1"
                    >
                      {fitLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 text-amber-300" />}
                      Calculate Fit
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[9px] uppercase text-neutral-400 block">Height (cm)</label>
                      <input
                        type="number"
                        value={fitHeight}
                        onChange={(e) => setFitHeight(e.target.value)}
                        className="w-full mt-0.5 px-2 py-1 rounded-lg bg-white border border-neutral-200 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase text-neutral-400 block">Weight (kg)</label>
                      <input
                        type="number"
                        value={fitWeight}
                        onChange={(e) => setFitWeight(e.target.value)}
                        className="w-full mt-0.5 px-2 py-1 rounded-lg bg-white border border-neutral-200 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase text-neutral-400 block">Drape</label>
                      <select
                        value={fitPreference}
                        onChange={(e) => setFitPreference(e.target.value)}
                        className="w-full mt-0.5 px-1 py-1 rounded-lg bg-white border border-neutral-200 text-[10px] font-semibold"
                      >
                        <option value="Architectural Oversized">Oversized</option>
                        <option value="Tailored Structured">Structured</option>
                      </select>
                    </div>
                  </div>

                  {fitAdvice && (
                    <div className="p-2.5 rounded-xl bg-white border border-neutral-200 text-xs space-y-1 animate-fadeIn">
                      <div className="font-bold text-neutral-900 flex items-center justify-between">
                        <span>Recommended Size: {fitAdvice.recommendedSize}</span>
                        <span className="text-[9px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Auto-Selected</span>
                      </div>
                      <p className="text-[11px] text-neutral-600 leading-relaxed">{fitAdvice.drapeAnalysis}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Add to Bag CTA */}
              <button
                onClick={() => {
                  const colorName = (quickViewData.colors[qvColorIdx] || quickViewData.colors[0]).name;
                  handleAddToCart(quickViewData, colorName, qvSize, qvQty);
                  setQuickViewData(null);
                  setCartOpen(true);
                }}
                className="w-full py-3.5 rounded-xl bg-neutral-900 text-white text-xs font-bold uppercase tracking-[0.18em] hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Bag — {formatINR(quickViewData.price * qvQty)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          AI STYLIST DRAWER (FULL RESPONSIVE)
      ===================================================================== */}
      {aiDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-[#FAF9F5] h-full flex flex-col justify-between shadow-2xl border-l border-neutral-200 overflow-hidden">
            <div className="p-4 sm:p-5 bg-white border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-neutral-900 text-amber-300 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-neutral-900">
                    AURA AI ATELIER
                  </h3>
                  <p className="text-[9px] text-neutral-400 uppercase tracking-widest">
                    Neural Fashion Architect
                  </p>
                </div>
              </div>
              <button onClick={() => setAiDrawerOpen(false)} className="p-2 rounded-full hover:bg-neutral-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="px-4 sm:px-5 pt-3 bg-white border-b border-neutral-200 flex gap-2 pb-3">
              <button
                onClick={() => { setAiTab('stylist'); setAiError(''); }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                  aiTab === 'stylist' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5" /> Bespoke Stylist
              </button>
              <button
                onClick={() => { setAiTab('visual'); setAiError(''); }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                  aiTab === 'visual' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                <Camera className="w-3.5 h-3.5" /> Vibe Matcher
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {aiTab === 'stylist' ? (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-2xl border border-neutral-200 space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                      Describe Occasion, Weather or Vibe
                    </label>
                    <textarea
                      rows={3}
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="e.g. Brutalist monochrome outfit for an evening art opening..."
                      className="w-full p-2.5 rounded-xl bg-[#FAF9F5] border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900"
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {['Tokyo Rainy Night', 'Milan Gallery Opening', 'Airport Lounge Minimalist'].map((chip) => (
                        <button
                          key={chip}
                          onClick={() => { setAiPrompt(chip); handleGenerateAIOutfit(chip); }}
                          className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-[10px] font-medium text-neutral-700"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => handleGenerateAIOutfit()}
                      disabled={aiLoading || !aiPrompt.trim()}
                      className="w-full py-3 rounded-xl bg-neutral-900 text-white text-xs font-bold uppercase tracking-[0.18em] hover:bg-neutral-800 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                      Architect Bespoke Look
                    </button>
                  </div>

                  {aiOutfitResult && (
                    <div className="bg-white p-4 rounded-3xl border border-neutral-200 space-y-3 animate-fadeIn">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-amber-600">
                          AI CURATED CAPSULE
                        </span>
                        <h4 className="text-base font-black text-neutral-900">{aiOutfitResult.lookTitle}</h4>
                        <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">{aiOutfitResult.editorialNote}</p>
                      </div>

                      <div className="space-y-2">
                        {(aiOutfitResult.recommendations || []).map((rec, idx) => {
                          const prod = PRODUCTS.find((p) => p.id === rec.productId) || PRODUCTS[idx % PRODUCTS.length];
                          return (
                            <div key={`${prod.id}-${idx}`} className="flex gap-2.5 p-2.5 rounded-xl bg-[#FAF9F5] border border-neutral-200/80 items-center">
                              <img src={prod.image} alt={prod.name} className="w-14 h-16 object-cover rounded-lg shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                  <h5 className="text-xs font-bold text-neutral-900 truncate">{prod.name}</h5>
                                  <span className="text-xs font-bold text-neutral-900">{formatINR(prod.price)}</span>
                                </div>
                                <div className="text-[9px] text-neutral-500">{rec.recommendedColor} • Size {rec.recommendedSize}</div>
                                <p className="text-[10px] text-neutral-600 mt-0.5 line-clamp-1">{rec.rationale}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => {
                          (aiOutfitResult.recommendations || []).forEach((rec, idx) => {
                            const prod = PRODUCTS.find((p) => p.id === rec.productId) || PRODUCTS[idx % PRODUCTS.length];
                            handleAddToCart(prod, rec.recommendedColor || prod.colors[0].name, rec.recommendedSize || 'L', 1);
                          });
                          setAiDrawerOpen(false);
                          setCartOpen(true);
                        }}
                        className="w-full py-3 rounded-xl bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800"
                      >
                        Add Curated Look to Bag
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-2xl border border-neutral-200 space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                      Upload Reference or Architecture Photo
                    </label>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 rounded-xl p-5 cursor-pointer hover:border-neutral-900 bg-[#FAF9F5]">
                      {uploadedImagePreview ? (
                        <img src={uploadedImagePreview} alt="Preview" className="h-36 w-full object-cover rounded-lg" />
                      ) : (
                        <div className="text-center space-y-1.5">
                          <Upload className="w-6 h-6 text-neutral-400 mx-auto" />
                          <span className="text-xs font-semibold text-neutral-700 block">Upload photo</span>
                          <span className="text-[9px] text-neutral-400 block">JPG, PNG, WEBP</span>
                        </div>
                      )}
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>

                    <button
                      onClick={handleAnalyzeVisualVibe}
                      disabled={aiLoading || !uploadedBase64}
                      className="w-full py-3 rounded-xl bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-3.5 h-3.5 text-amber-300" />}
                      Match to 3D Collection
                    </button>
                  </div>

                  {visualMatchResult && (
                    <div className="bg-white p-4 rounded-3xl border border-neutral-200 space-y-3 animate-fadeIn">
                      <div className="flex gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-neutral-900 text-white text-[9px] font-bold uppercase">
                          {visualMatchResult.detectedAesthetic}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-[9px] font-bold">
                          {visualMatchResult.dominantPalette}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 leading-relaxed">{visualMatchResult.editorialAnalysis}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          WISHLIST DRAWER
      ===================================================================== */}
      {wishlistOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white h-full p-5 flex flex-col justify-between shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h3 className="text-base font-black uppercase tracking-wider">Wishlist ({wishlist.length})</h3>
              <button onClick={() => setWishlistOpen(false)} className="p-2 rounded-full hover:bg-neutral-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              {wishlist.length === 0 ? (
                <p className="text-xs text-neutral-500 text-center py-10">Your wishlist is empty.</p>
              ) : (
                PRODUCTS.filter((p) => wishlist.includes(p.id)).map((prod) => (
                  <div key={prod.id} className="flex items-center gap-3 p-3 rounded-2xl border border-neutral-200">
                    <img src={prod.image} alt={prod.name} className="w-14 h-18 object-cover rounded-xl" />
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-neutral-900">{prod.name}</h4>
                      <div className="text-xs font-bold text-neutral-600 mt-0.5">{formatINR(prod.price)}</div>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => {
                            handleAddToCart(prod, prod.colors[0].name, 'L', 1);
                            setWishlistOpen(false);
                            setCartOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-neutral-900 text-white text-[9px] font-bold uppercase"
                        >
                          Move to Bag
                        </button>
                        <button onClick={() => toggleWishlist(prod.id)} className="text-[10px] text-neutral-400 hover:text-red-600">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setWishlistOpen(false)}
              className="w-full py-3.5 rounded-xl bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest"
            >
              Back to Atelier
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          SHOPPING BAG DRAWER
      ===================================================================== */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white h-full p-5 flex flex-col justify-between shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                <h3 className="text-base font-black uppercase tracking-wider">Shopping Bag ({cartCount})</h3>
              </div>
              <button onClick={() => setCartOpen(false)} className="p-2 rounded-full hover:bg-neutral-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              {cart.length === 0 ? (
                <p className="text-xs text-neutral-500 text-center py-10">Your bag is currently empty.</p>
              ) : (
                cart.map((item) => (
                  <div key={item.key} className="flex gap-3 p-3 rounded-2xl border border-neutral-200/80">
                    <img src={item.product.image} alt={item.product.name} className="w-16 h-20 object-cover rounded-xl" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-bold text-neutral-900">{item.product.name}</h4>
                          <button onClick={() => removeCartItem(item.key)} className="text-neutral-400 hover:text-neutral-900">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[10px] text-neutral-500 mt-0.5">{item.color} • Size {item.size}</p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-neutral-200 rounded-lg">
                          <button onClick={() => updateCartQty(item.key, -1)} className="px-2 py-0.5 text-neutral-600">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold">{item.quantity}</span>
                          <button onClick={() => updateCartQty(item.key, 1)} className="px-2 py-0.5 text-neutral-600">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-xs font-bold text-neutral-900">
                          {formatINR(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-3 border-t border-neutral-200 space-y-2.5 pb-safe">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Code: AURA20"
                    className="flex-1 px-3 py-1.5 rounded-xl border border-neutral-200 text-xs uppercase"
                  />
                  <button
                    onClick={() => {
                      if (promoCode.trim().toUpperCase() === 'AURA20') setDiscountApplied(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-neutral-100 text-xs font-bold uppercase hover:bg-neutral-200"
                  >
                    Apply
                  </button>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-neutral-500">
                    <span>Subtotal</span>
                    <span>{formatINR(subtotal)}</span>
                  </div>
                  {discountApplied && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Discount (20%)</span>
                      <span>-{formatINR(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-500">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? 'FREE' : formatINR(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-neutral-900 pt-1.5 border-t border-neutral-100">
                    <span>Total</span>
                    <span>{formatINR(finalTotal)}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCartOpen(false);
                    setOrderCompleted(false);
                    setCheckoutOpen(true);
                  }}
                  className="w-full py-3.5 rounded-xl bg-neutral-900 text-white text-xs font-bold uppercase tracking-[0.18em] hover:bg-neutral-800"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          CHECKOUT MODAL
      ===================================================================== */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 relative">
            <button onClick={() => setCheckoutOpen(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100">
              <X className="w-4 h-4" />
            </button>

            {orderCompleted ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black text-neutral-900">Order Confirmed</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Your garments and verifiable 3D digital twin certificates are being prepared.
                </p>
                <button
                  onClick={() => { setCart([]); setCheckoutOpen(false); }}
                  className="px-6 py-3 rounded-xl bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider"
                >
                  Return to Atelier
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); setOrderCompleted(true); }}
                className="space-y-3"
              >
                <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                  AURA WEAR CHECKOUT
                </div>
                <h3 className="text-lg font-black text-neutral-900">Dispatch Details</h3>

                <div className="grid grid-cols-2 gap-2">
                  <input required placeholder="First Name" className="px-3 py-2 rounded-xl border border-neutral-200 text-xs" />
                  <input required placeholder="Last Name" className="px-3 py-2 rounded-xl border border-neutral-200 text-xs" />
                </div>
                <input required type="email" placeholder="Email for 3D Twin Receipt" className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs" />
                <input required placeholder="Shipping Address" className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs" />
                <div className="grid grid-cols-2 gap-2">
                  <input required placeholder="City" className="px-3 py-2 rounded-xl border border-neutral-200 text-xs" />
                  <input required placeholder="PIN Code" className="px-3 py-2 rounded-xl border border-neutral-200 text-xs" />
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-700">Total Payable</span>
                  <span className="font-black text-sm text-neutral-900">{formatINR(finalTotal)}</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-neutral-900 text-white text-xs font-bold uppercase tracking-[0.18em] hover:bg-neutral-800"
                >
                  Confirm Order — {formatINR(finalTotal)}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
      {/* =====================================================================
          MOBILE FLOATING LUXURY ACTION DOCK (APP-LIKE EXPERIENCE)
      ===================================================================== */}
      <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-white/92 backdrop-blur-xl border-t border-neutral-200/80 px-4 py-2 flex items-center justify-around shadow-[0_-8px_30px_rgba(0,0,0,0.08)] pb-safe">
        <button
          onClick={() => scrollToSection('top')}
          className="flex flex-col items-center gap-0.5 text-neutral-600 hover:text-neutral-950 transition-colors"
        >
          <Compass className="w-4 h-4" />
          <span className="text-[9px] font-bold uppercase tracking-wider">3D Studio</span>
        </button>

        <button
          onClick={() => {
            setActiveCategory('All');
            scrollToSection('catalog-section');
          }}
          className="flex flex-col items-center gap-0.5 text-neutral-600 hover:text-neutral-950 transition-colors"
        >
          <Grid className="w-4 h-4" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Catalog</span>
        </button>

        <button
          onClick={() => setAiDrawerOpen(true)}
          className="flex flex-col items-center gap-0.5 -mt-4 bg-neutral-900 text-white p-2.5 rounded-full shadow-lg border border-neutral-800 active:scale-95 transition-transform"
          aria-label="Launch AI Stylist"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
        </button>

        <button
          onClick={() => setWishlistOpen(true)}
          className="relative flex flex-col items-center gap-0.5 text-neutral-600 hover:text-neutral-950 transition-colors"
        >
          <Heart className="w-4 h-4" />
          {wishlist.length > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-neutral-900 text-white text-[8px] font-bold flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
          <span className="text-[9px] font-bold uppercase tracking-wider">Saved</span>
        </button>

        <button
          onClick={() => setCartOpen(true)}
          className="relative flex flex-col items-center gap-0.5 text-neutral-600 hover:text-neutral-950 transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-neutral-900 text-white text-[8px] font-bold flex items-center justify-center">
              {cartCount}
            </span>
          )}
          <span className="text-[9px] font-bold uppercase tracking-wider">Bag</span>
        </button>
      </div>
    </div>
  );
}
