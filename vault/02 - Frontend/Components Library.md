# Components Library

#frontend #components #ui

Key UI components powering the Squad Wear web app:

---

## 💎 Navbar (`Navbar.tsx`)
- **Translucent Glassmorphism Header**:
  - `sticky top-0 bg-surface/80 backdrop-blur-md z-50 border-b border-outline/50`
  - Blurs video and product grid imagery smoothly underneath as the user scrolls.
- **Navigation Links**: Dynamic route highlighting for Tracksuits, Hoodies, Trousers, and `Shop All`.

---

## 🎬 Seamless Hero Video Player (`HomePage.tsx`)
- **Full-Width 1080p Video**:
  - `min-h-[75vh] lg:min-h-[85vh]` background video container with `object-cover`.
  - HTML5 video parameters: `autoPlay loop muted playsInline preload="auto"`.
  - Dual source fallbacks: `hero.webm` & `hero.mp4`.
  - Clean video display without heavy vignette filters.

---

## 📦 Product Card (`ProductCard.tsx`) & Category Tile (`CategoryTile.tsx`)
- Hover image swap effect (`hoverImage`).
- Badge tag rendering (`Winter '26 Drop`).
- Instant cart add action drawer triggers.

---

## 🔗 Related Notes
- [[React Frontend Architecture]]
- [[Media Assets Optimization]]
- [[State Management]]
