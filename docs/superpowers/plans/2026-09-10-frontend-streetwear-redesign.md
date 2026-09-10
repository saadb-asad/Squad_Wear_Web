# SquadWear Streetwear Frontend Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reskin every customer-facing page of the SquadWear frontend (`frontend/src`) to a streetwear editorial look modeled on VIBGYOR/Dropyard/AWKWRDx, via new Tailwind theme tokens and a shared `components/ui` primitive set, while leaving all colors, branding, backend behavior, and the Admin Dashboard untouched.

**Architecture:** Add new, additively-named Tailwind tokens (fonts, sizes, spacing) alongside the existing Material-style tokens so nothing already in use (including Admin Dashboard) changes meaning. Build presentational primitives in `components/ui` that take explicit props. Compose pages from those primitives, in dependency order (tokens → primitives → pages).

**Tech Stack:** React 19, Vite, TypeScript, Tailwind CSS, react-router-dom, lucide-react icons. No test runner is configured in this project (`frontend/package.json` has no jest/vitest) — verification steps use the Vite dev server (`npm run dev`) and manual browser inspection instead of automated tests.

**Spec:** `docs/superpowers/specs/2026-09-10-frontend-streetwear-redesign-design.md`

## Global Constraints

- Every existing Tailwind color token in `frontend/tailwind.config.js` (`primary`, `secondary`, `surface*`, `on-*`, `tertiary*`, `error*`, `background`, etc.) is unchanged — no task edits any color value.
- SquadWear name, logo (`src/assets/logo.png`), and favicon are unchanged.
- `pages/Admin/AdminDashboard.tsx` is not edited by any task. Because it renders inside `Layout` like every other route, it will pick up the new `Navbar`/`Footer`/`PromoBar`/`CartDrawer` chrome (Task 12) — that is expected and matches the approved spec (Layout wraps every route). The dashboard's own body content and its use of `font-headline-*`/`font-body-*`/`font-label-*`/`neo-*` classes must keep rendering exactly as today, which is why Task 1 adds new token names (`font-display`, `font-ui`, `text-display-*`) instead of redefining the existing `headline-*`/`body-*`/`label-*` tokens.
- No new npm dependencies beyond Google Fonts `<link>` tags (no shadcn/ui, no new component libraries, no new state libraries — `CartContext` already exists and is extended, not replaced).
- Placeholder imagery only (existing `lh3.googleusercontent.com` mock URLs) — no real product photography sourcing.

---

## File Structure

New files:
- `frontend/src/components/ui/Button.tsx` — solid/outline button
- `frontend/src/components/ui/Badge.tsx` — new/sale/sold-out tag
- `frontend/src/components/ui/SectionHeading.tsx` — bold header + optional subcopy
- `frontend/src/components/ui/ProductCard.tsx` — image hover-swap product tile
- `frontend/src/components/ui/CategoryTile.tsx` — large tappable category tile
- `frontend/src/components/ui/TestimonialCard.tsx` — customer quote card
- `frontend/src/components/ui/BrandMessageBlock.tsx` — bold mission-statement band
- `frontend/src/components/ui/PromoBar.tsx` — slim top promo strip
- `frontend/src/components/ui/CartDrawer.tsx` — "Your Locker" slide-out cart

Modified files:
- `frontend/tailwind.config.js` — add `display`/`ui` font families, `display-xl/lg/md` size tokens, `section-y`/`section-y-mobile` spacing tokens
- `frontend/src/styles/index.css` — add `.text-shout` utility (existing `neo-*` utilities untouched)
- `frontend/index.html` — add Bebas Neue + Montserrat Google Fonts links
- `frontend/src/config.ts` — add `FREE_SHIPPING_THRESHOLD`
- `frontend/src/data/mockData.ts` — extend `Product` with `originalPrice?`, `hoverImage?`, `soldOut?`
- `frontend/src/contexts/CartContext.tsx` — add drawer open state (`isDrawerOpen`, `openDrawer`, `closeDrawer`), auto-open on add
- `frontend/src/components/layout/Navbar.tsx` — rework: flat styling, cart icon opens drawer instead of navigating
- `frontend/src/components/layout/Footer.tsx` — rework: flat styling, VIBGYOR-style columns
- `frontend/src/components/layout/Layout.tsx` — render `PromoBar` and `CartDrawer`
- `frontend/src/pages/Home/HomePage.tsx` — full rebuild using primitives
- `frontend/src/pages/Catalog/CatalogPage.tsx` — restyle + read `?category=` query param
- `frontend/src/pages/Catalog/ProductPage.tsx` — restyle, hover-swap image
- `frontend/src/pages/Checkout/CheckoutPage.tsx` — restyle only, logic untouched
- `frontend/src/pages/About/AboutPage.tsx` — restyle + `BrandMessageBlock`
- `frontend/src/pages/Portal/LoginPage.tsx`, `SignupPage.tsx`, `PortalPage.tsx` — restyle only, logic untouched
- `frontend/src/pages/Legal/TermsPage.tsx`, `PrivacyPage.tsx`, `frontend/src/pages/Support/ReturnsPage.tsx`, `ShippingPage.tsx` — typography-only restyle

Not modified: `pages/Admin/AdminDashboard.tsx`, all backend files, `CartContext`'s existing item logic (`addToCart`/`removeFromCart`/`updateQuantity`/`clearCart`/`total`).

---

### Task 1: Theme tokens — fonts, sizes, spacing

**Files:**
- Modify: `frontend/index.html`
- Modify: `frontend/tailwind.config.js`
- Modify: `frontend/src/styles/index.css`

**Interfaces:**
- Produces: Tailwind classes `font-display`, `font-ui`, `text-display-xl`, `text-display-lg`, `text-display-md`, `spacing.section-y` (`py-section-y`), `spacing.section-y-mobile` (`py-section-y-mobile`), utility class `.text-shout`. All later tasks style redesigned components with these.

- [ ] **Step 1: Add Google Fonts links**

In `frontend/index.html`, add two new `<link>` tags after the existing Anybody link (leave the Anybody and Material Symbols links exactly as they are — Admin Dashboard still uses Anybody):

```html
    <link href="https://fonts.googleapis.com/css2?family=Anybody:wght@100..900&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
```

- [ ] **Step 2: Add new font/size/spacing tokens to Tailwind config**

In `frontend/tailwind.config.js`, inside `theme.extend`, add new keys alongside the existing `fontFamily`, `fontSize`, and `spacing` objects (do not remove or rename any existing key):

```js
            "fontFamily": {
                "label-md": ["Anybody"],
                "headline-xl": ["Anybody"],
                "headline-lg": ["Anybody"],
                "headline-md": ["Anybody"],
                "headline-lg-mobile": ["Anybody"],
                "body-lg": ["Anybody"],
                "body-md": ["Anybody"],
                "label-sm": ["Anybody"],
                "display": ["Bebas Neue"],
                "ui": ["Montserrat"]
            },
```

```js
            "fontSize": {
                "label-md": ["14px", {"lineHeight": "1.4", "letterSpacing": "0.05em", "fontWeight": "600"}],
                "headline-xl": ["48px", {"lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "800"}],
                "headline-lg": ["32px", {"lineHeight": "1.2", "letterSpacing": "-0.01em", "fontWeight": "700"}],
                "headline-md": ["24px", {"lineHeight": "1.3", "fontWeight": "600"}],
                "headline-lg-mobile": ["28px", {"lineHeight": "1.2", "fontWeight": "700"}],
                "body-lg": ["18px", {"lineHeight": "1.6", "fontWeight": "400"}],
                "body-md": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
                "label-sm": ["12px", {"lineHeight": "1.4", "fontWeight": "500"}],
                "display-xl": ["64px", {"lineHeight": "1.05", "letterSpacing": "0.01em", "fontWeight": "400"}],
                "display-lg": ["40px", {"lineHeight": "1.1", "letterSpacing": "0.01em", "fontWeight": "400"}],
                "display-md": ["28px", {"lineHeight": "1.15", "letterSpacing": "0.01em", "fontWeight": "400"}]
            },
```

Note: Bebas Neue ships one weight (400) on Google Fonts — its boldness comes from the condensed all-caps-reading letterforms, not a heavy weight, so `fontWeight` stays `400` on the `display-*` tokens.

```js
            "spacing": {
                "margin-desktop": "48px",
                "max-width": "1280px",
                "unit": "8px",
                "margin-mobile": "16px",
                "gutter": "24px",
                "section-y": "96px",
                "section-y-mobile": "56px"
            },
```

- [ ] **Step 3: Add the `.text-shout` utility**

In `frontend/src/styles/index.css`, inside the existing `@layer utilities { ... }` block, add (leave every existing `.neo-*` rule untouched):

```css
  .text-shout {
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
```

- [ ] **Step 4: Verify**

Run `cd frontend && npm run dev`, open the printed local URL, and open browser dev tools. Confirm no console errors on load. Confirm `/admin` (log in as `admin@squadattire.com` / `admin123` via `/portal/login`) still renders with its current neumorphic look — nothing should look different yet, since no component uses the new tokens.

- [ ] **Step 5: Commit**

```bash
git add frontend/index.html frontend/tailwind.config.js frontend/src/styles/index.css
git commit -m "Add streetwear theme tokens (fonts, sizes, spacing) alongside existing tokens"
```

---

### Task 2: `Button` and `Badge` primitives

**Files:**
- Create: `frontend/src/components/ui/Button.tsx`
- Create: `frontend/src/components/ui/Badge.tsx`

**Interfaces:**
- Consumes: Tailwind tokens from Task 1 (`font-ui`, `.text-shout`), existing color tokens (`on-surface`, `surface`, `secondary`, `error`, `outline`, `on-error`, `on-secondary`).
- Produces: `Button({ variant?: 'solid' | 'outline', ...ButtonHTMLAttributes })`, `Badge({ variant: 'new' | 'sale' | 'sold-out', children })`. Every later primitive/page task imports these by exact name.

- [ ] **Step 1: Create `Button`**

```tsx
// frontend/src/components/ui/Button.tsx
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline';
}

export const Button = ({ variant = 'solid', className = '', ...props }: ButtonProps) => {
  const base =
    'font-ui text-shout text-sm px-6 py-3 border transition-colors disabled:opacity-40 disabled:cursor-not-allowed';
  const styles =
    variant === 'solid'
      ? 'bg-on-surface text-surface border-on-surface hover:bg-secondary hover:border-secondary'
      : 'bg-transparent text-on-surface border-on-surface hover:bg-on-surface hover:text-surface';

  return <button className={`${base} ${styles} ${className}`} {...props} />;
};
```

- [ ] **Step 2: Create `Badge`**

```tsx
// frontend/src/components/ui/Badge.tsx
import type { ReactNode } from 'react';

type BadgeVariant = 'new' | 'sale' | 'sold-out';

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  new: 'bg-secondary text-on-secondary',
  sale: 'bg-error text-on-error',
  'sold-out': 'bg-outline text-surface',
};

export const Badge = ({ variant, children }: BadgeProps) => (
  <span className={`font-ui text-shout inline-block px-3 py-1 text-xs ${VARIANT_STYLES[variant]}`}>
    {children}
  </span>
);
```

- [ ] **Step 3: Verify**

Run `cd frontend && npx tsc -b --noEmit` (type-check only, matches the `build` script's first step) and confirm it exits with no errors related to these two new files.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/ui/Button.tsx frontend/src/components/ui/Badge.tsx
git commit -m "Add Button and Badge UI primitives"
```

---

### Task 3: `SectionHeading`, `BrandMessageBlock`, `PromoBar` primitives

**Files:**
- Create: `frontend/src/components/ui/SectionHeading.tsx`
- Create: `frontend/src/components/ui/BrandMessageBlock.tsx`
- Create: `frontend/src/components/ui/PromoBar.tsx`

**Interfaces:**
- Consumes: Task 1 tokens (`font-display`, `text-display-lg`/`text-display-md`, `.text-shout`), color tokens (`on-surface`, `on-surface-variant`, `surface`).
- Produces: `SectionHeading({ title, subtitle?, className? })`, `BrandMessageBlock({ heading, body })`, `PromoBar({ message })`.

- [ ] **Step 1: Create `SectionHeading`**

```tsx
// frontend/src/components/ui/SectionHeading.tsx
interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const SectionHeading = ({ title, subtitle, className = '' }: SectionHeadingProps) => (
  <div className={`space-y-2 ${className}`}>
    <h2 className="font-display text-display-md lg:text-display-lg text-shout text-on-surface">{title}</h2>
    {subtitle && <p className="font-ui text-sm text-on-surface-variant">{subtitle}</p>}
  </div>
);
```

- [ ] **Step 2: Create `BrandMessageBlock`**

```tsx
// frontend/src/components/ui/BrandMessageBlock.tsx
interface BrandMessageBlockProps {
  heading: string;
  body: string;
}

export const BrandMessageBlock = ({ heading, body }: BrandMessageBlockProps) => (
  <div className="bg-on-surface px-6 py-section-y-mobile text-center lg:py-section-y">
    <p className="font-display text-display-md text-shout mx-auto max-w-3xl text-surface lg:text-display-lg">
      {heading}
    </p>
    <p className="font-ui mx-auto mt-4 max-w-xl text-sm text-surface/70">{body}</p>
  </div>
);
```

- [ ] **Step 3: Create `PromoBar`**

```tsx
// frontend/src/components/ui/PromoBar.tsx
interface PromoBarProps {
  message: string;
}

export const PromoBar = ({ message }: PromoBarProps) => (
  <div className="w-full bg-on-surface px-4 py-2 text-center">
    <p className="font-ui text-shout text-xs text-surface">{message}</p>
  </div>
);
```

- [ ] **Step 4: Verify**

Run `cd frontend && npx tsc -b --noEmit`, confirm no errors from these three files.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/ui/SectionHeading.tsx frontend/src/components/ui/BrandMessageBlock.tsx frontend/src/components/ui/PromoBar.tsx
git commit -m "Add SectionHeading, BrandMessageBlock, and PromoBar UI primitives"
```

---

### Task 4: Extend `mockData.ts` with sale/hover-image/sold-out fields

**Files:**
- Modify: `frontend/src/data/mockData.ts`

**Interfaces:**
- Produces: `Product` interface gains `originalPrice?: number`, `hoverImage?: string`, `soldOut?: boolean`. `ProductCard` (Task 5), `CatalogPage`, `ProductPage`, `CheckoutPage` all read these as optional fields — nothing that reads `Product` today breaks, since all three are optional.

- [ ] **Step 1: Extend the interface and populate demo values**

In `frontend/src/data/mockData.ts`, change the interface:

```ts
export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  badge?: string;
  soldOut?: boolean;
  description: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  category: string;
}
```

Then, on the `apex-tech-hoodie` entry, add a `hoverImage` (reusing an existing placeholder URL already used elsewhere in this codebase, for visual variety without sourcing new assets) and remove nothing else:

```ts
    badge: 'New Drop',
    hoverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7RVti_D9Ep15yDLDJkNUIeP4Gf6RDf9_ZZtTSUafk1xNSP64P35KRtO4Z7u5BxtI1k1a0QvhUW61iylcTRLCL6QFg1P3rv8vBZzMsz6yXnD1KvM3l5NhddE-NzfVVKI-GvO6cV96v0vbIehRHx1QanpK-pFJPziOYfZVNcn8sRJgasKZSxLpaxG8bFiqnpMxSF1mvdkU-2eaRx5U8BYsh4NyzGWFxpYZR-kievm4CNYMJvIKlPoiuIagRaEuw923-GgT54YbA6x-V',
```

On `vector-core-tee`, add a sale price:

```ts
    price: 45.00,
    originalPrice: 60.00,
```

On `signal-sling-bag`, mark it sold out:

```ts
    category: 'Accessories',
    soldOut: true
```

(adjust the trailing comma on the line above it to accommodate — `category: 'Accessories',` followed by the new `soldOut: true` line, then the closing `}`.)

- [ ] **Step 2: Verify**

Run `cd frontend && npx tsc -b --noEmit`. Confirm no type errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/data/mockData.ts
git commit -m "Extend Product mock data with sale price, hover image, and sold-out demo values"
```

---

### Task 5: `ProductCard` and `CategoryTile` primitives

**Files:**
- Create: `frontend/src/components/ui/ProductCard.tsx`
- Create: `frontend/src/components/ui/CategoryTile.tsx`

**Interfaces:**
- Consumes: `Product` type from `../../data/mockData` (Task 4), `Badge` (Task 2), Task 1 tokens.
- Produces: `ProductCard({ product: Product, onAddToCart: (product: Product) => void })`, `CategoryTile({ label: string, category: string, image: string })`. `HomePage`, `CatalogPage`, `ProductPage` (Tasks 9–11) import both by exact name.

- [ ] **Step 1: Create `ProductCard`**

```tsx
// frontend/src/components/ui/ProductCard.tsx
import { Link } from 'react-router-dom';
import type { Product } from '../../data/mockData';
import { Badge } from './Badge';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const isSale = product.originalPrice != null && product.originalPrice > product.price;

  return (
    <div className="group flex flex-col border border-outline">
      <Link to={`/catalog/${product.id}`} className="relative block aspect-[4/5] overflow-hidden bg-surface-container-low">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-0"
        />
        <img
          src={product.hoverImage || product.image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.soldOut && <Badge variant="sold-out">Sold Out</Badge>}
          {!product.soldOut && isSale && <Badge variant="sale">Sale</Badge>}
          {!product.soldOut && !isSale && product.badge && <Badge variant="new">{product.badge}</Badge>}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <Link to={`/catalog/${product.id}`}>
          <h3 className="font-ui text-sm font-semibold text-on-surface transition-colors hover:text-secondary">
            {product.name}
          </h3>
        </Link>
        <p className="font-ui text-xs text-on-surface-variant">{product.subtitle}</p>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            {isSale && (
              <span className="font-ui text-xs text-on-surface-variant line-through">
                ${product.originalPrice!.toFixed(2)}
              </span>
            )}
            <span className="font-ui text-sm font-bold text-on-surface">${product.price.toFixed(2)}</span>
          </div>
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.soldOut}
            aria-label={`Add ${product.name} to cart`}
            className="border border-on-surface p-2 text-on-surface transition-colors hover:bg-on-surface hover:text-surface disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Create `CategoryTile`**

```tsx
// frontend/src/components/ui/CategoryTile.tsx
import { Link } from 'react-router-dom';

interface CategoryTileProps {
  label: string;
  category: string;
  image: string;
}

export const CategoryTile = ({ label, category, image }: CategoryTileProps) => (
  <Link
    to={`/catalog?category=${encodeURIComponent(category)}`}
    className="group relative block aspect-[3/4] overflow-hidden border border-outline"
  >
    <img
      src={image}
      alt={label}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-on-surface/20 transition-colors group-hover:bg-on-surface/30" />
    <span className="font-display text-shout absolute bottom-6 left-6 text-display-md text-surface">{label}</span>
  </Link>
);
```

- [ ] **Step 3: Verify**

Run `cd frontend && npx tsc -b --noEmit`, confirm no errors.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/ui/ProductCard.tsx frontend/src/components/ui/CategoryTile.tsx
git commit -m "Add ProductCard and CategoryTile UI primitives"
```

---

### Task 6: `TestimonialCard` primitive

**Files:**
- Create: `frontend/src/components/ui/TestimonialCard.tsx`

**Interfaces:**
- Produces: `TestimonialCard({ name: string, date: string, quote: string })`. `HomePage` (Task 9) imports this.

- [ ] **Step 1: Create it**

```tsx
// frontend/src/components/ui/TestimonialCard.tsx
interface TestimonialCardProps {
  name: string;
  date: string;
  quote: string;
}

export const TestimonialCard = ({ name, date, quote }: TestimonialCardProps) => (
  <div className="flex flex-col gap-4 border border-outline p-6">
    <p className="font-ui text-sm text-on-surface">&ldquo;{quote}&rdquo;</p>
    <div className="font-ui flex items-center justify-between text-xs text-on-surface-variant">
      <span className="font-semibold text-on-surface">{name}</span>
      <span>{date}</span>
    </div>
  </div>
);
```

- [ ] **Step 2: Verify**

Run `cd frontend && npx tsc -b --noEmit`, confirm no errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/ui/TestimonialCard.tsx
git commit -m "Add TestimonialCard UI primitive"
```

---

### Task 7: Extend `CartContext` with drawer state and add `FREE_SHIPPING_THRESHOLD`

**Files:**
- Modify: `frontend/src/contexts/CartContext.tsx`
- Modify: `frontend/src/config.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces: `useCart()` now also returns `isDrawerOpen: boolean`, `openDrawer: () => void`, `closeDrawer: () => void`. `addToCart` now also opens the drawer as a side effect. `config.ts` exports `FREE_SHIPPING_THRESHOLD: number`. Task 8 (`CartDrawer`) and Task 12 (`Navbar`) consume these exact names.

- [ ] **Step 1: Add `FREE_SHIPPING_THRESHOLD`**

```ts
// frontend/src/config.ts
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const FREE_SHIPPING_THRESHOLD = 150;
```

- [ ] **Step 2: Add drawer state to `CartContext`**

In `frontend/src/contexts/CartContext.tsx`, extend the interface:

```ts
interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}
```

Inside `CartProvider`, add the state and wire `addToCart` to open the drawer:

```ts
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const addToCart = (newItem: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === newItem.productId);
      if (existing) {
        return prev.map(i => i.productId === newItem.productId ? { ...i, quantity: i.quantity + newItem.quantity } : i);
      }
      return [...prev, newItem];
    });
    setIsDrawerOpen(true);
  };
```

And add `openDrawer`/`closeDrawer` next to the other handlers, then include them in the provider value:

```ts
  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, isDrawerOpen, openDrawer, closeDrawer }}>
      {children}
    </CartContext.Provider>
  );
};
```

- [ ] **Step 3: Verify**

Run `cd frontend && npx tsc -b --noEmit`. Confirm no errors (existing consumers of `useCart()` — `Navbar`, `CatalogPage`, `ProductPage`, `CheckoutPage` — only destructure fields that still exist, so they keep compiling unchanged).

- [ ] **Step 4: Commit**

```bash
git add frontend/src/contexts/CartContext.tsx frontend/src/config.ts
git commit -m "Add cart drawer open state and free-shipping threshold config"
```

---

### Task 8: `CartDrawer` — "Your Locker"

**Files:**
- Create: `frontend/src/components/ui/CartDrawer.tsx`

**Interfaces:**
- Consumes: `useCart()` (Task 7: `items`, `removeFromCart`, `updateQuantity`, `total`, `isDrawerOpen`, `closeDrawer`), `PRODUCTS` from `../../data/mockData`, `FREE_SHIPPING_THRESHOLD` from `../../config`, `Button` (Task 2).
- Produces: `CartDrawer` (no props — reads everything from `useCart()`). Task 9 (`Layout`) renders this once.

- [ ] **Step 1: Create it**

```tsx
// frontend/src/components/ui/CartDrawer.tsx
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { PRODUCTS } from '../../data/mockData';
import { FREE_SHIPPING_THRESHOLD } from '../../config';
import { Button } from './Button';

export const CartDrawer = () => {
  const { items, removeFromCart, updateQuantity, total, isDrawerOpen, closeDrawer } = useCart();

  if (!isDrawerOpen) return null;

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const progressPct = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);
  const suggestions = PRODUCTS.slice(0, 3);

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-on-surface/40" onClick={closeDrawer} />
      <div className="relative flex h-full w-full max-w-md flex-col bg-surface">
        <div className="flex items-center justify-between border-b border-outline px-6 py-5">
          <h2 className="font-display text-shout text-display-md text-on-surface">Your Locker</h2>
          <button onClick={closeDrawer} aria-label="Close cart" className="p-2 text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="border-b border-outline px-6 py-4">
          {remaining > 0 ? (
            <p className="font-ui text-xs text-on-surface-variant">
              You're <span className="font-bold text-on-surface">${remaining.toFixed(2)}</span> away from FREE shipping
            </p>
          ) : (
            <p className="font-ui text-xs font-bold text-secondary">✓ FREE SHIPPING UNLOCKED</p>
          )}
          <div className="mt-2 h-2 w-full bg-surface-container-low">
            <div className="h-full bg-secondary transition-all" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
              <h3 className="font-display text-shout text-display-md text-on-surface">Locker's Empty — Time to Gear Up</h3>
              <div className="grid w-full grid-cols-3 gap-3">
                {suggestions.map(p => (
                  <Link key={p.id} to={`/catalog/${p.id}`} onClick={closeDrawer} className="block">
                    <img src={p.image} alt={p.name} className="aspect-square w-full border border-outline object-cover" />
                    <p className="font-ui mt-1 truncate text-xs text-on-surface">{p.name}</p>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map(item => (
                <li key={item.productId} className="flex gap-4">
                  <img
                    src={PRODUCTS.find(p => p.id === item.productId)?.image}
                    alt={item.name}
                    className="h-20 w-20 flex-shrink-0 border border-outline object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between gap-2">
                      <span className="font-ui text-sm font-semibold text-on-surface">{item.name}</span>
                      <span className="font-ui text-sm text-on-surface">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 border border-outline px-2 py-1">
                        <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} aria-label="Decrease quantity">-</button>
                        <span className="font-ui text-xs">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} aria-label="Increase quantity">+</button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="font-ui text-xs text-on-surface-variant underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-outline px-6 py-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-ui text-sm text-on-surface-variant">Subtotal</span>
            <span className="font-display text-display-md text-on-surface">${total.toFixed(2)}</span>
          </div>
          <Link to="/checkout" onClick={closeDrawer}>
            <Button variant="solid" className="w-full" disabled={items.length === 0}>
              Go to Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Verify**

Run `cd frontend && npx tsc -b --noEmit`, confirm no errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/ui/CartDrawer.tsx
git commit -m "Add Your Locker cart drawer with free-shipping progress and empty state"
```

---

### Task 9: Rework `Navbar`, `Footer`, `Layout`

**Files:**
- Modify: `frontend/src/components/layout/Navbar.tsx`
- Modify: `frontend/src/components/layout/Footer.tsx`
- Modify: `frontend/src/components/layout/Layout.tsx`

**Interfaces:**
- Consumes: `useCart()` (`openDrawer`, `items` — Task 7), `PromoBar` (Task 3), `CartDrawer` (Task 8).
- Produces: no new exports; this is the chrome every route (including `/admin`) renders inside.

- [ ] **Step 1: Rework `Navbar`**

Replace the full contents of `frontend/src/components/layout/Navbar.tsx`:

```tsx
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

import logoUrl from '../../assets/logo.png';

export const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const { items, openDrawer } = useCart();
  const location = useLocation();

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="w-full sticky top-0 px-4 lg:px-margin-desktop py-4 bg-surface z-50 border-b border-outline">
      <div className="flex justify-between items-center w-full max-w-max-width mx-auto">
        <Link to="/" className="flex items-center gap-3">
          <img src={logoUrl} alt="Squad Wear Logo" className="h-8 md:h-10 object-contain invert" />
          <span className="font-display text-shout text-display-md hidden text-on-surface sm:block">
            Squad Wear
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/catalog"
            className={`font-ui text-shout text-xs transition-colors duration-300 ${isActive('/catalog') ? 'text-secondary font-bold border-b-2 border-secondary' : 'text-on-surface-variant font-medium hover:text-secondary'}`}
          >
            Shop
          </Link>
          <Link
            to="/about"
            className={`font-ui text-shout text-xs transition-colors duration-300 ${isActive('/about') ? 'text-secondary font-bold border-b-2 border-secondary' : 'text-on-surface-variant font-medium hover:text-secondary'}`}
          >
            About
          </Link>
          {user?.role === 'internal_admin' && (
            <Link
              to="/admin"
              className={`font-ui text-shout text-xs transition-colors duration-300 ${isActive('/admin') ? 'text-secondary font-bold border-b-2 border-secondary' : 'text-on-surface-variant font-medium hover:text-secondary'}`}
            >
              Dashboard
            </Link>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="border border-outline flex items-center px-4 py-2 hidden lg:flex">
            <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-sm w-32 font-ui outline-none" placeholder="Search gear..." type="text"/>
          </div>
          <button onClick={openDrawer} className="border border-outline p-3 flex items-center justify-center relative" aria-label="Open cart">
            <span className="material-symbols-outlined text-on-surface">shopping_bag</span>
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>
          <Link to={isAuthenticated ? "/portal" : "/portal/login"} className="border border-outline p-3 flex items-center justify-center">
            <span className="material-symbols-outlined text-on-surface">person</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};
```

- [ ] **Step 2: Rework `Footer`**

Replace the full contents of `frontend/src/components/layout/Footer.tsx`:

```tsx
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full mt-24 py-12 px-4 lg:px-margin-desktop bg-surface border-t border-outline">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full max-w-max-width mx-auto gap-8 lg:gap-gutter">
        <div className="space-y-4">
          <div className="font-display text-shout text-display-md text-on-surface">Squad Wear</div>
          <p className="font-ui max-w-xs text-sm text-on-surface-variant">
            Building a community-driven streetwear brand that's in-trend, affordable, and keeps you geared up for the next drop.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
          <div className="space-y-4">
            <h4 className="font-ui text-shout text-xs font-bold text-on-surface">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="font-ui text-sm text-on-surface-variant hover:text-secondary transition-colors">About</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-ui text-shout text-xs font-bold text-on-surface">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/shipping" className="font-ui text-sm text-on-surface-variant hover:text-secondary transition-colors">Shipping</Link></li>
              <li><Link to="/returns" className="font-ui text-sm text-on-surface-variant hover:text-secondary transition-colors">Returns</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-ui text-shout text-xs font-bold text-on-surface">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" className="font-ui text-sm text-on-surface-variant hover:text-secondary transition-colors">Terms</Link></li>
              <li><Link to="/privacy" className="font-ui text-sm text-on-surface-variant hover:text-secondary transition-colors">Privacy</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-max-width mx-auto mt-12 pt-8 border-t border-outline text-center md:text-left">
        <p className="font-ui text-sm text-on-surface-variant">© {new Date().getFullYear()} Squad Wear Streetwear. All rights reserved.</p>
      </div>
    </footer>
  );
};
```

- [ ] **Step 3: Render `PromoBar` and `CartDrawer` in `Layout`**

Replace the full contents of `frontend/src/components/layout/Layout.tsx`:

```tsx
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { PromoBar } from '../ui/PromoBar';
import { CartDrawer } from '../ui/CartDrawer';

export const Layout = () => {
  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      <PromoBar message="Rs. 250 COD fee — FREE with bank transfer" />
      <Navbar />
      <main style={{ flex: 1, paddingBottom: '4rem' }}>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};
```

- [ ] **Step 4: Verify**

Run `cd frontend && npm run dev`. Visit `/` and confirm: the promo bar shows above a flat (no soft-shadow) nav bar; clicking the cart icon opens the "Your Locker" drawer instead of navigating; adding any item to cart (once Task 10+ wires `addToCart` on a page) opens the drawer automatically. Visit `/admin` (after logging in as `admin@squadattire.com`/`admin123`) and confirm the dashboard's own content still looks neumorphic/unchanged, with only the surrounding nav/footer/promo bar looking new — this is expected per the spec (Layout wraps every route).

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/layout/Navbar.tsx frontend/src/components/layout/Footer.tsx frontend/src/components/layout/Layout.tsx
git commit -m "Rework Navbar/Footer to flat streetwear styling and wire in PromoBar/CartDrawer"
```

---

### Task 10: Rebuild `HomePage`

**Files:**
- Modify: `frontend/src/pages/Home/HomePage.tsx`

**Interfaces:**
- Consumes: `CategoryTile`, `SectionHeading`, `ProductCard`, `BrandMessageBlock`, `TestimonialCard` (Tasks 3, 5, 6), `PRODUCTS` from `../../data/mockData`, `useCart()`.

- [ ] **Step 1: Replace the page**

Replace the full contents of `frontend/src/pages/Home/HomePage.tsx`:

```tsx
import { PRODUCTS } from '../../data/mockData';
import { useCart } from '../../contexts/CartContext';
import { CategoryTile } from '../../components/ui/CategoryTile';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { ProductCard } from '../../components/ui/ProductCard';
import { BrandMessageBlock } from '../../components/ui/BrandMessageBlock';
import { TestimonialCard } from '../../components/ui/TestimonialCard';

const CATEGORY_TILES = [
  { label: 'Outerwear', category: 'Outerwear', image: PRODUCTS[0].image },
  { label: 'T-Shirts', category: 'T-Shirts', image: PRODUCTS.find(p => p.category === 'T-Shirts')!.image },
  { label: 'Footwear', category: 'Footwear', image: PRODUCTS.find(p => p.category === 'Footwear')!.image },
  { label: 'Accessories', category: 'Accessories', image: PRODUCTS.find(p => p.category === 'Accessories')!.image },
];

const TESTIMONIALS = [
  { name: 'Ahmed R.', date: 'Aug 2026', quote: 'Fit is exactly as pictured and the fabric feels heavyweight. Reordering already.' },
  { name: 'Sana K.', date: 'Jul 2026', quote: 'Exchange process was painless — sized up a hoodie in two days flat.' },
  { name: 'Bilal M.', date: 'Jul 2026', quote: "Best oversized tee I've bought locally. Squad Wear gets the streetwear fit right." },
];

export const HomePage = () => {
  const { addToCart } = useCart();

  return (
    <main className="w-full max-w-max-width mx-auto px-4 lg:px-margin-desktop space-y-16 lg:space-y-section-y py-section-y-mobile lg:py-section-y">
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {CATEGORY_TILES.map(tile => (
          <CategoryTile key={tile.category} {...tile} />
        ))}
      </section>

      <section className="space-y-10">
        <SectionHeading title="New Drops" subtitle="Freshly stocked. Shop before they're gone." />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.slice(0, 4).map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={p => addToCart({ productId: p.id, name: p.name, price: p.price, quantity: 1 })}
            />
          ))}
        </div>
      </section>

      <BrandMessageBlock
        heading="Streetwear That Doesn't Cost a Fortune"
        body="We don't restrict good fits to a big budget. Squad Wear is built for everyday wear, priced for everyday people."
      />

      <section className="space-y-10">
        <SectionHeading title="From the Squad" subtitle="Real feedback from real customers." />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map(t => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </section>
    </main>
  );
};
```

- [ ] **Step 2: Verify**

Run `cd frontend && npm run dev`, visit `/`. Confirm: category tiles render and each links to `/catalog?category=<name>` (the link will 404-filter to an empty grid until Task 11 wires the query param — that's expected at this point, verify again after Task 11), product grid shows sale/sold-out/new badges correctly per Task 4's demo data, "Add to cart" opens the Locker drawer.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/Home/HomePage.tsx
git commit -m "Rebuild HomePage with category tiles, product grid, brand message, and testimonials"
```

---

### Task 11: Restyle `CatalogPage` and wire `?category=` query param

**Files:**
- Modify: `frontend/src/pages/Catalog/CatalogPage.tsx`

**Interfaces:**
- Consumes: `ProductCard`, `SectionHeading` (Tasks 3, 5), `useSearchParams` from `react-router-dom`.
- Produces: no new exports; `CategoryTile` links from Task 10 now resolve correctly.

- [ ] **Step 1: Read the `category` query param on mount**

In `frontend/src/pages/Catalog/CatalogPage.tsx`, change the imports and the `selectedCategories` initialization:

```tsx
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PRODUCTS } from '../../data/mockData';
import { useCart } from '../../contexts/CartContext';
import { ProductCard } from '../../components/ui/ProductCard';
import { SectionHeading } from '../../components/ui/SectionHeading';

export const CatalogPage = () => {
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Outerwear', 'T-Shirts']);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState(250);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategories([category]);
    }
  }, [searchParams]);
```

- [ ] **Step 2: Replace the product grid markup to use `ProductCard`**

Replace the `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">...</div>` block (the one mapping `filteredProducts` to hand-rolled `neo-extruded` cards) with:

```tsx
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={p => addToCart({ productId: p.id, name: p.name, price: p.price, quantity: 1 })}
              />
            ))}
          </div>
```

- [ ] **Step 3: Restyle the filter sidebar and page heading to flat borders**

In the same file, replace `neo-recessed`/`neo-extruded` classes used on the filter sidebar's checkboxes, size buttons, color swatches, and "Clear Filters" button with `border border-outline` equivalents, and swap `font-headline-md text-headline-md` / `font-label-md text-label-md` on that sidebar for `font-display text-shout text-display-md` (section title) / `font-ui text-shout text-xs` (filter labels) respectively, matching the pattern used in `ProductCard`. Add a `<SectionHeading title="Shop All" subtitle="Every drop, one place." className="mb-4" />` immediately inside the `<main>` wrapper, above the `flex flex-col md:flex-row gap-gutter` filter/grid row.

- [ ] **Step 4: Verify**

Run `cd frontend && npm run dev`. From `/`, click each category tile and confirm `/catalog?category=Footwear` (etc.) shows only that category pre-checked and filtered. Confirm sale/sold-out badges render on the grid via `ProductCard`, and "Clear Filters" still resets category/size/color/price state as before.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/pages/Catalog/CatalogPage.tsx
git commit -m "Restyle CatalogPage with ProductCard grid and wire category query param"
```

---

### Task 12: Restyle `ProductPage`

**Files:**
- Modify: `frontend/src/pages/Catalog/ProductPage.tsx`

**Interfaces:**
- Consumes: `ProductCard`, `Button`, `Badge` (Tasks 2, 5).

- [ ] **Step 1: Restyle the hero image, info panel, and CTAs**

In `frontend/src/pages/Catalog/ProductPage.tsx`:
- Add imports: `import { Button } from '../../components/ui/Button';` and `import { Badge } from '../../components/ui/Badge';`.
- Replace the hero `<div className="neo-extruded rounded-[32px] overflow-hidden aspect-[4/5] relative">` wrapper's class with `border border-outline overflow-hidden aspect-[4/5] relative`, and inside it, add a second `<img>` sourced from `product.hoverImage || product.image` positioned absolutely with `opacity-0 group-hover:opacity-100` (mirroring `ProductCard`'s hover-swap pattern) — wrap the whole hero block in a `group` class to enable this.
- Replace the `{product.badge && (...)}` block's inner `<span>` with `<Badge variant="new">{product.badge}</Badge>` (drop the now-redundant `bg-surface/80 backdrop-blur-md ...` classes since `Badge` supplies its own styling).
- Replace the "Add to Bag" `<button>` with `<Button variant="solid" onClick={handleAddToCart} disabled={product.soldOut} className="w-full py-4">{product.soldOut ? 'Sold Out' : 'Add to Bag'}</Button>`.
- In the "Complete the Look" recommendations grid, replace the hand-rolled recommendation cards with `<ProductCard product={rec} onAddToCart={p => addToCart({ productId: p.id, name: p.name, price: p.price, quantity: 1 })} />` (drop the custom `Link`/image/button markup entirely, since `ProductCard` already links to the product and has its own add-to-cart button).
- Swap `neo-extruded`/`neo-recessed` classes on the size-selector buttons, color-swatch buttons, and the two "Product Features Bento" tiles for `border border-outline` (selected state: `border-secondary text-secondary` instead of `neo-recessed text-secondary`).

- [ ] **Step 2: Verify**

Run `cd frontend && npm run dev`. Visit any `/catalog/<id>` route. Confirm: hovering the hero image swaps to the second angle (for `apex-tech-hoodie`, which has `hoverImage` from Task 4; other products fall back to the same image, no visual break), size/color selection still works, "Add to Bag" opens the Locker drawer, and the recommendations grid renders as `ProductCard`s with working add-to-cart.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/Catalog/ProductPage.tsx
git commit -m "Restyle ProductPage with hover-swap hero image and shared ProductCard recommendations"
```

---

### Task 13: Restyle `CheckoutPage`

**Files:**
- Modify: `frontend/src/pages/Checkout/CheckoutPage.tsx`

**Interfaces:**
- Consumes: `Button` (Task 2). No logic changes — `handleCheckout`, `applyPromo`, and all `useCart`/`useAuth` calls stay exactly as they are.

- [ ] **Step 1: Restyle only**

In `frontend/src/pages/Checkout/CheckoutPage.tsx`, replace every `neo-extruded`/`neo-recessed`/`neo-extruded-sm`/`neo-button-active` class with flat equivalents:
- Cart-item rows, order summary card, and "Complete the Kit" tiles: `neo-extruded rounded-*` → `border border-outline` (drop the rounding to match the flat streetwear look; keep padding/layout classes as-is).
- Quantity stepper buttons and promo-code input: `neo-recessed`/`neo-extruded` → `border border-outline`.
- The main checkout `<button onClick={handleCheckout}>`: replace its className logic with the `Button` primitive — `<Button variant="solid" onClick={handleCheckout} disabled={items.length === 0 || isProcessing} className="w-full py-4">...</Button>`, keeping the exact same children (`{isProcessing ? 'Processing...' : ...}` plus the arrow icon) and the exact same `onClick`/`disabled` logic.
- Do not touch `handleCheckout`, `applyPromo`, `subtotal`/`tax`/`finalTotal` calculations, or the PayFast form-submission logic.

- [ ] **Step 2: Verify**

Run `cd frontend && npm run dev`. Add an item to cart, go to `/checkout`, confirm: quantity +/- and remove still work, promo code `SQUAD10` still applies a 10% discount, and clicking checkout while logged out still redirects to `/portal/login` (checkout while logged in will attempt a real backend call — verify only that the button is disabled/enabled correctly and the request fires, without needing a live PayFast sandbox).

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/Checkout/CheckoutPage.tsx
git commit -m "Restyle CheckoutPage to flat borders, logic unchanged"
```

---

### Task 14: Restyle `AboutPage` with `BrandMessageBlock`

**Files:**
- Modify: `frontend/src/pages/About/AboutPage.tsx`

**Interfaces:**
- Consumes: `SectionHeading`, `BrandMessageBlock`, `Button` (Tasks 2, 3).

- [ ] **Step 1: Restyle**

Replace the full contents of `frontend/src/pages/About/AboutPage.tsx`:

```tsx
import { SectionHeading } from '../../components/ui/SectionHeading';
import { BrandMessageBlock } from '../../components/ui/BrandMessageBlock';
import { Button } from '../../components/ui/Button';

export const AboutPage = () => {
  return (
    <main className="w-full max-w-max-width mx-auto px-4 lg:px-margin-desktop space-y-16 py-section-y-mobile lg:py-section-y">
      <SectionHeading
        title="About Squad Wear"
        subtitle="Engineered for the urban environment. Our mission is to fuse high-performance fabrics with streetwear silhouettes built for movement."
      />

      <div className="grid grid-cols-1 gap-gutter md:grid-cols-2">
        <div className="border border-outline p-6 lg:p-8 space-y-4">
          <h2 className="font-display text-shout text-display-md text-on-surface">Our Story</h2>
          <p className="font-ui text-sm text-on-surface-variant">
            Born from the necessity of functional everyday wear, Squad Wear began as an experimental project to create garments that could withstand both harsh weather conditions and the aesthetic demands of modern street culture.
          </p>
          <p className="font-ui text-sm text-on-surface-variant">
            We source proprietary materials and partner with state-of-the-art manufacturing facilities to ensure every seam, zipper, and pocket serves a distinct purpose.
          </p>
        </div>

        <div className="border border-outline p-6 lg:p-8 space-y-4">
          <h2 className="font-display text-shout text-display-md text-on-surface">B2B & Custom Orders</h2>
          <p className="font-ui text-sm text-on-surface-variant">
            We provide customized tactical gear and streetwear for teams, corporate clients, and specialized crews. Connect with our dedicated B2B team to discuss your specific requirements.
          </p>
          <div className="pt-4">
            <Button variant="solid">Contact Sales</Button>
          </div>
        </div>
      </div>

      <BrandMessageBlock
        heading="We Don't Restrict Fashion to a Single Budget"
        body="Squad Wear is built to be affordable and inclusive — good fits for everyone, not just a select few."
      />
    </main>
  );
};
```

- [ ] **Step 2: Verify**

Run `cd frontend && npm run dev`, visit `/about`, confirm layout renders with no console errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/About/AboutPage.tsx
git commit -m "Restyle AboutPage with SectionHeading and BrandMessageBlock"
```

---

### Task 15: Restyle Portal pages (`LoginPage`, `SignupPage`, `PortalPage`)

**Files:**
- Modify: `frontend/src/pages/Portal/LoginPage.tsx`
- Modify: `frontend/src/pages/Portal/SignupPage.tsx`
- Modify: `frontend/src/pages/Portal/PortalPage.tsx`

**Interfaces:**
- Consumes: `Button` (Task 2). No changes to any `handle*`/`fetch` logic in any of the three files.

- [ ] **Step 1: Restyle `LoginPage`**

In `frontend/src/pages/Portal/LoginPage.tsx`: replace the outer card's `neo-extruded bg-surface p-8 md:p-12 rounded-[40px]` with `border border-outline bg-surface p-8 md:p-12`; replace the icon badge's `neo-recessed p-4 rounded-2xl` with `border border-outline p-4`; replace both `<input>` elements' `neo-recessed bg-surface w-full p-4 rounded-xl` with `border border-outline bg-surface w-full p-4`; replace both submit `<button>` elements with `<Button variant="solid" type="submit" disabled={isLoading} className="w-full py-4 mt-2">{...same children...}</Button>`. Leave `handleLoginSubmit`, `handleOtpSubmit`, and all `useState`/`fetch` calls untouched.

- [ ] **Step 2: Restyle `SignupPage`**

Apply the same class substitutions (`neo-extruded`/`neo-recessed` → `border border-outline`, submit button → `Button`) to `frontend/src/pages/Portal/SignupPage.tsx`. Leave `handleSubmit` and all state untouched.

- [ ] **Step 3: Restyle `PortalPage`**

Apply the same class substitutions to `frontend/src/pages/Portal/PortalPage.tsx` across all four views (`overview`, `orders`, `profile`, `settings`) — every `neo-extruded`/`neo-recessed` container becomes `border border-outline`, and the "View Orders"/"Edit Profile"/"Account Settings"/"Save Changes" action buttons become `<Button variant="solid">`. The destructive "I understand, delete my account" button becomes `<Button variant="outline" className="w-full border-error text-on-error-container hover:bg-error hover:text-on-error">`. Leave `fetchOrders`, `handleUpdateProfile`, `handleDeleteAccount`, and all state/effects untouched.

- [ ] **Step 4: Verify**

Run `cd frontend && npm run dev`. Test the full flow: `/portal/signup` creates an account, `/portal/login` logs in (check server console or Resend dashboard per `backend/main.py`'s OTP email logic for the 6-digit code — it also prints to the backend console when `RESEND_API_KEY` is unset), `/portal` shows the four views without console errors, and "delete my account" still shows the native `confirm()` dialog before calling the delete endpoint.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/pages/Portal/LoginPage.tsx frontend/src/pages/Portal/SignupPage.tsx frontend/src/pages/Portal/PortalPage.tsx
git commit -m "Restyle Portal pages to flat borders, auth/OTP logic unchanged"
```

---

### Task 16: Restyle Legal and Support pages (typography only)

**Files:**
- Modify: `frontend/src/pages/Legal/TermsPage.tsx`
- Modify: `frontend/src/pages/Legal/PrivacyPage.tsx`
- Modify: `frontend/src/pages/Support/ReturnsPage.tsx`
- Modify: `frontend/src/pages/Support/ShippingPage.tsx`

**Interfaces:**
- Consumes: Task 1 tokens only (`font-display`, `text-display-md`, `font-ui`, `.text-shout`). No structural changes, no new imports beyond the token classes.

- [ ] **Step 1: Restyle each page identically**

In each of the four files, apply the same three substitutions (all four files currently share the exact same structural pattern):
- Outer wrapper `neo-extruded p-6 lg:p-10 rounded-[40px] bg-surface` → `border border-outline p-6 lg:p-10 bg-surface`.
- Page `<h1>` classes `font-headline-xl text-headline-xl text-on-surface` → `font-display text-shout text-display-lg text-on-surface`.
- Each section wrapper `neo-recessed rounded-3xl p-6 lg:p-8 bg-surface-container-low` → `border border-outline p-6 lg:p-8 bg-surface-container-low`, and each section `<h2>` classes `font-headline-md text-headline-md text-on-surface` → `font-display text-shout text-display-md text-on-surface`.

Leave all body `<p>`/`<ul>`/`<li>` text and classes (`font-body-md text-body-md`) untouched — policy body copy stays on the existing body token, only headings move to the new display font per the approved "typography-only restyle" scope.

- [ ] **Step 2: Verify**

Run `cd frontend && npm run dev`, visit `/terms`, `/privacy`, `/returns`, `/shipping`. Confirm headings render in Bebas Neue and body copy is unchanged.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/Legal/TermsPage.tsx frontend/src/pages/Legal/PrivacyPage.tsx frontend/src/pages/Support/ReturnsPage.tsx frontend/src/pages/Support/ShippingPage.tsx
git commit -m "Restyle Legal and Support page headings to display font, flat borders"
```

---

### Task 17: Full-site visual verification pass

**Files:** none (verification only).

- [ ] **Step 1: Walk every route**

Run `cd frontend && npm run dev`. In a browser, visit and visually check each of: `/`, `/catalog`, `/catalog?category=Footwear`, `/catalog/apex-tech-hoodie`, `/checkout` (with 1+ items in cart), `/about`, `/portal/login`, `/portal/signup`, `/portal` (logged in), `/terms`, `/privacy`, `/returns`, `/shipping`, and `/admin` (logged in as `admin@squadattire.com`/`admin123`).

For each customer-facing page, confirm: no `neo-extruded`/`neo-recessed` soft shadows remain, headings render in Bebas Neue, body/labels render in Montserrat, all color values look identical to before the redesign (same blues/teals/grays — only shapes/type changed), and the "Your Locker" drawer opens correctly from the Navbar cart icon on every page.

For `/admin`, confirm the dashboard body content still renders in its original neumorphic style — only the Navbar/Footer/PromoBar chrome around it should look new.

- [ ] **Step 2: Run the production build**

Run `cd frontend && npm run build`. Confirm it completes with no TypeScript or build errors (this runs `tsc -b && vite build`, so it re-checks types across every file touched in this plan).

- [ ] **Step 3: Report**

No commit for this task — it's a verification pass. If any issue is found, fix it in the relevant task's files and re-commit there (do not create a separate "fixes" commit; amend forward with a new commit describing the fix and which task it corrects).
