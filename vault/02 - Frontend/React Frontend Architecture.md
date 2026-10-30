# React Frontend Architecture

#frontend #react #vite #tailwind

The frontend is a single-page React application built with **Vite** and **Tailwind CSS**, designed with an editorial streetwear aesthetic inspired by high-end fashion typography.

---

## 🎨 Design Tokens & Theme Configuration

- **Typography**: `Geist` font family across headings, body text, and UI labels.
- **Color Palette**:
  - `surface` / `background`: `#ffffff`
  - `on-surface` / `secondary`: `#030302` (Deep Charcoal Black)
  - `outline`: `#d3cec5`
  - `surface-container-low`: `#f5f5f5`

---

## 📁 File Structure (`frontend/src/`)

```
src/
├── assets/          # Static logos & branding
├── components/      # UI components & layouts
│   ├── layout/      # Navbar, Footer, Layout
│   └── ui/          # ProductCard, CategoryTile, CartDrawer
├── contexts/        # React Context API states
├── data/            # Local fallback product data (mockData.ts)
├── pages/           # Route views (Home, Catalog, Checkout, Admin)
└── styles/          # Tailwind & CSS index rules
```

---

## 🔗 Related Notes
- [[Components Library]]
- [[State Management]]
- [[Media Assets Optimization]]
