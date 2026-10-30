# 🏴‍☠️ Squad Wear — Project Knowledge Base (MOC)

Welcome to the **Squad Wear Obsidian Vault**. This vault contains complete technical architecture documentation, database schemas, API specs, frontend design system guidelines, catalog management pipelines, and asset optimization workflows.

---

## 🗺 Map of Content (Navigation)

### 📐 01 — System Architecture
- [[System Overview]] — Fullstack architecture, tech stack breakdown, and service topology
- [[Database Schema]] — ERD diagram, PostgreSQL/SQLite schemas, audit logs & constraints
- [[API Reference]] — REST endpoints, WebSocket event handlers, authentication & PayFast ITN flow
- [[Cloudflare Migration Plan]] — Free tier cost breakdown, D1 database setup, Workers API & Pages deployment

### 🎨 02 — Frontend (React + Vite)
- [[React Frontend Architecture]] — Routing, Tailwind token system, Geist typography & theme tokens
- [[Components Library]] — Translucent Navbar, 1080p Seamless Video Hero, CategoryTile, ProductCard, CartDrawer
- [[State Management]] — `ProductsContext`, `CartContext`, `AuthContext` implementations & caching

### ⚙️ 03 — Backend (FastAPI + Python)
- [[FastAPI Backend & DB Pipeline]] — Engine creation, SQLite fallback logic, AsyncSessionLocal, SlowAPI rate limiting
- [[Catalog Management Scripts]] — `process_winter26_catalog.py`, `upload_products.py`, `publish_catalog.py`, `clean_mockup_products.py`

### ⚡ 04 — Workflows & Optimization
- [[Media Assets Optimization]] — FFmpeg 1080p seamless video loop encoding (crossfade & trim), Pillow PNG quantization
- [[Development Setup & Operations]] — Local environment execution (`npm run dev`, `uvicorn`), database migrations, build verification

---

## 🏷 Vault Tags
- `#architecture` `#frontend` `#backend` `#database` `#media-optimization` `#api` `#security`
