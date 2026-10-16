# AURA WEAR — 3D Fashion E-commerce Concept

A dark, futuristic fashion storefront built with React, Vite, React Three Fiber, Three.js and Framer Motion. Includes exactly eight product cards, responsive layouts, live product filters/sorting/search, wishlist, product quick view, size selection, quantity controls, and a shopping cart drawer.

## Run locally

1. Install Node.js 18+.
2. Open a terminal in this folder.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL shown by Vite (usually `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

## Notes

- The hero contains an interactive WebGL 3D orbital scene built with Three.js / React Three Fiber; product cards have perspective tilt, lighting effects and hover transitions.
- Product/editorial photography is loaded from Unsplash URLs and requires an internet connection.
- Cart and wishlist selections are persisted in localStorage on the current browser. Connect a backend to sync accounts, inventory and orders across devices.
- Checkout is intentionally a demo interaction. Connect a payment provider (such as Razorpay or Stripe) on the server before accepting real payments.
- Real garment rotation requires true 3D garment models (`.glb`/`.gltf`). This build uses real-time 3D graphics for the hero, plus CSS perspective effects on garment photography.
