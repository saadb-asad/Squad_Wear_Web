# SquadWear Frontend Redesign — Design Spec

## Context & Goal

SquadWear's customer-facing frontend (React 19 + Vite + TypeScript + Tailwind, `frontend/src`) should be redesigned to match the visual language of three client-specified reference sites, all Pakistani streetwear e-commerce brands:

- **VIBGYOR** (https://vibgyorclothing.com.pk) — chosen as the **primary structural/visual template**: left-logo + dropdown category nav, repeated bold tagline hero, dual front/back product images per card, prominent customer testimonials, neutral palette.
- **Dropyard Pakistan** (https://www.dropyardpakistan.com) — accent reference (Instagram/UGC wall, star ratings on cards, free-shipping threshold messaging) — not adopted directly this round except the free-shipping-progress idea folded into the cart (Section 6).
- **AWKWRDx** (https://www.awkwardxstore.com) — accents adopted: **category-tile hero grid** and a bold **inclusive/affordable brand-messaging block**.

This is a **theme/layout redesign only** — no backend changes, no change to existing functionality (auth/OTP flow, cart logic, PayFast checkout, admin order management).

## Explicit Constraints (from stakeholder decisions)

1. **Full redesign in one pass** across all customer-facing pages (not phased).
2. **Colors are fixed.** Every existing token in `frontend/tailwind.config.js` under `theme.extend.colors` (the Material-Design-3-style palette: `primary`, `secondary`, `surface*`, `on-*`, `tertiary*`, `secondary-fixed-dim`/`secondary-container` teal accent, `error*`, `background`, etc.) must remain exactly as defined. Only layout, typography, spacing, and component structure change.
3. **SquadWear branding stays** — same name, logo (`src/assets/logo.png`), favicon. No identity change.
4. **Admin Dashboard (`pages/Admin/AdminDashboard.tsx`) is out of scope** — stays on its current utilitarian/neumorphic styling.
5. **Placeholder imagery only** — continue using `mockData.ts`-style placeholder/stock imagery; structure the layout so real product photography can drop in later without further layout changes.
6. **Approach: design tokens + shared UI primitives** (not bespoke per-page styling, not a new component library like shadcn/ui). Extend the existing Tailwind theme, build a small set of reusable primitives in `components/ui`, then compose every page from them.

## 1. Theme Tokens (`frontend/tailwind.config.js`, `styles/index.css`)

### Colors
No changes. All existing color tokens are preserved verbatim.

### Typography
Replace the current single font family (`Anybody`, used for everything) with a two-font pairing, chosen for streetwear branding fit (tall condensed display + geometric grotesk body — see design-conversation research citing Bebas Neue and Montserrat as standard streetwear/urban-brand choices):

- **Display font — Bebas Neue**: applied to `headline-xl`, `headline-lg`, `headline-md`, `headline-lg-mobile` tokens (hero taglines, section headers, category tile labels, promo bar text, nav wordmark). Tall, condensed, naturally uppercase-reading.
- **Body/UI font — Montserrat**: applied to `body-lg`, `body-md`, `label-md`, `label-sm` tokens (nav links, product titles, prices, paragraph copy, form labels). Full weight range (400–800) so it serves both regular copy and semi-bold labels/prices.
- Both are Google Fonts (SIL Open Font License, free for commercial use). Load via `@fontsource` packages or a Google Fonts `<link>` in `index.html` (implementation detail decided during planning).
- Adjust `fontSize` token definitions in `tailwind.config.js`:
  - `headline-xl`: increase to `56px`/`64px` desktop scale, weight `900`, `letterSpacing: -0.03em`.
  - `headline-lg` / `headline-md`: weight `800`, tighter tracking.
  - `body-lg` / `body-md` / `label-md` / `label-sm`: weights/sizes unchanged, just re-pointed to Montserrat.
- New utility class `.text-shout` (uppercase, wide letter-spacing) for nav links and badge text, layered on top of the label tokens.

### Spacing
Existing spacing tokens (`margin-desktop`, `margin-mobile`, `gutter`, `unit`, `max-width`) are kept. Add two new tokens for consistent section rhythm:
- `spacing.section-y`: `96px` (desktop vertical section padding)
- `spacing.section-y-mobile`: `56px` (mobile vertical section padding)

### Borders / Shadows
The current neumorphic utilities (`neo-extruded`, `neo-recessed`, `neo-extruded-sm`, `neo-interactive`, defined in `styles/index.css`) are **retired from all customer-facing pages** in favor of flat, high-contrast styling (`border border-outline`, sharp corners, no soft shadows) — this matches the flat card-edge treatment shared by all three references and reads as "streetwear editorial" rather than "soft UI dashboard."
- The utility classes themselves are **not deleted** — `AdminDashboard.tsx` (out of scope) may continue using them.

## 2. Shared UI Primitives (`frontend/src/components/ui/`)

| Primitive | Purpose | Reference influence |
|---|---|---|
| `PromoBar` | Slim top banner strip above the header (shipping/COD messaging) | VIBGYOR |
| `Navbar` (rework of existing `layout/Navbar.tsx`) | Logo left, category dropdown nav, search, login/cart icons right; flat styling replacing neumorphic | VIBGYOR |
| `Footer` (rework of existing `layout/Footer.tsx`) | Multi-column: Quick Links, Order Tracker, social links, mission statement | VIBGYOR |
| `Button` | Solid (primary) + outline (secondary) variants, sharp corners, using existing color tokens | shared |
| `Badge` | "NEW" / "SALE" / "SOLD OUT" tags | VIBGYOR / Dropyard |
| `ProductCard` | Product image that hover-swaps to a second angle, title, regular/sale price, sold-out state, add-to-cart action | VIBGYOR (dual image) |
| `CategoryTile` | Large tappable image tile with a bold label, used in a hero grid | AWKWRDx |
| `TestimonialCard` | Customer name, date, quote | VIBGYOR |
| `BrandMessageBlock` | Bold mission-statement band (SquadWear equivalent of AWKWRDx's affordability/inclusivity messaging) | AWKWRDx |
| `SectionHeading` | Consistent bold header + optional subcopy for section starts | shared |
| `CartDrawer` | Slide-out mini-cart (see Section 6) | new, no direct reference — fills a gap none of the three sites needed to demonstrate |

Forms/inputs on Checkout and Portal pages are restyled to pick up `Button` and flat-border input treatment but keep their existing markup/logic.

## 3. Page-by-Page Mapping

- **Layout** (`components/layout/Layout.tsx`, wraps every route): `PromoBar` + reworked `Navbar` + `<Outlet />` + reworked `Footer`.
- **Home** (`pages/Home/HomePage.tsx`): Hero replaced with a `CategoryTile` grid (e.g. Hoodies / Tees / Bottoms / New Drops) → `SectionHeading` + `ProductCard` grid for featured products (from `mockData.ts`) → `BrandMessageBlock` → `SectionHeading` + row of `TestimonialCard` → footer (via Layout).
- **Catalog** (`pages/Catalog/CatalogPage.tsx`): `SectionHeading` (category/"Shop All" title) → existing filter/sort bar restyled (logic unchanged) → `ProductCard` grid.
- **Product** (`pages/Catalog/ProductPage.tsx`): Image area with hover/swap between two angles → title/price/size-selector/`Button` add-to-cart, restyled → related products as a `ProductCard` row.
- **Checkout** (`pages/Checkout/CheckoutPage.tsx`): No functional change to cart summary or PayFast handoff — inputs, cards, buttons move from neumorphic to flat-bordered styling.
- **About / B2B** (`pages/About/AboutPage.tsx`): `SectionHeading` + `BrandMessageBlock` + existing business-inquiry form, restyled only.
- **Portal** (`pages/Portal/LoginPage.tsx`, `SignupPage.tsx`, `PortalPage.tsx`): Forms restyled with `Button`/input treatment; OTP flow logic untouched.
- **Legal** (`pages/Legal/TermsPage.tsx`, `PrivacyPage.tsx`) & **Support** (`pages/Support/ReturnsPage.tsx`, `ShippingPage.tsx`): Typography-only restyle (`SectionHeading` + body copy on new type tokens) — no structural change.
- **Admin Dashboard**: untouched (out of scope, Constraint 4).

## 4. Data / Assets

- Continue using `frontend/src/data/mockData.ts` for product data. Extend it if needed with a second image URL per product (for the `ProductCard` hover-swap) and a `category` field usable by `CategoryTile` links — exact shape to be finalized during implementation planning.
- Placeholder imagery: reuse/extend existing assets in `src/assets/` or well-attributed stock-style placeholders. No real product photography this round (Constraint 5).

## 5. Component/Page Isolation

Each primitive in Section 2 takes explicit props and has no dependency on which page renders it (e.g. `ProductCard` takes a product object + an `onAddToCart` callback, not a page-specific context reach-in). Pages compose primitives and own their data-fetching/state; primitives own presentation only. This keeps primitives independently reviewable and reusable across Home/Catalog/Product without page-specific branching inside them.

## 6. Cart: "The Locker" Drawer

Current state (verified in code): the Navbar cart icon links directly to `/checkout` (`components/layout/Navbar.tsx`) — there is no cart preview; the only place cart contents are visible is the full Checkout page. This is a functional gap, not just a style mismatch.

New creative direction:

- **Slide-out drawer**, not a page redirect. Clicking the cart icon (or completing an add-to-cart action) opens a `CartDrawer` over the current page. Backed by the existing `CartContext` (`contexts/CartContext.tsx`) — no changes to cart state logic, only a new UI surface consuming it.
- **"YOUR LOCKER" branding** — a bold `headline-md` (Bebas Neue) label at the top of the drawer instead of a generic "Cart" heading.
- **Live free-shipping progress bar**: a thin fill bar showing "You're Rs. X away from FREE shipping" that animates toward a defined threshold constant as the subtotal grows, flipping to a "✓ FREE SHIPPING UNLOCKED" state once crossed. Threshold value to be defined as a config constant (e.g. alongside `API_BASE_URL` in `config.ts`).
- **Bold empty state**: "LOCKER'S EMPTY — TIME TO GEAR UP" headline with 2–3 suggested products pulled from `mockData.ts`, so an empty drawer still has a conversion path.
- Each line item: existing qty stepper / remove actions, `Badge` for sale items, restyled with flat borders.
- Drawer footer: subtotal + `Button` linking to the full Checkout page (checkout flow itself unchanged).

## Out of Scope

- Backend/API changes of any kind.
- Admin Dashboard visual changes.
- Real product photography sourcing.
- Changing SquadWear's name, logo, or color identity.
- New third-party component libraries or design-system dependencies.

## Open Items for Implementation Planning

- Exact mechanism for loading Bebas Neue/Montserrat (self-hosted via `@fontsource/*` vs. Google Fonts `<link>` in `index.html`) — either is acceptable; planning should pick one for consistency with the project's existing asset-loading conventions.
- Free-shipping threshold value for the Locker drawer (placeholder business number until stakeholder provides a real one).
- Exact `mockData.ts` shape extension for second product image + category linkage used by `CategoryTile`.
