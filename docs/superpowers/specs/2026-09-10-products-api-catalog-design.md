# Products API & DB-Backed Catalog — Design Spec

## Context & Goal

This is Phase 0 of a larger, decomposed effort to implement the feature set described in the client-provided `Features For Website.pdf`. That PDF spans several independent subsystems (nav/collections, homepage discovery, listing/sort/wishlist, product detail page, cart additions, footer). This spec covers only the foundational piece all the others depend on: today, **product data is 100% static frontend mock data** (`frontend/src/data/mockData.ts`) — there is no `/api/products` endpoint in the backend at all, even though a `Product` table already exists in the database (used only by the checkout/order flow). Phase 1 (Nav & Collections, next) needs real collection/category data to filter against, so the catalog needs to become database-backed first.

**Goal:** Expand the backend `Product` model to carry the fields the storefront actually displays, expose it via a public `GET /api/products` endpoint, seed the database from the current mock data, and switch every frontend consumer from the static `PRODUCTS` array to a fetched, context-shared product list — with no visible behavior change to any page.

## Explicit Decisions (from stakeholder brainstorming)

1. This phase does **not** add the `collection` field or change the category taxonomy — those are Phase 1 (Nav & Collections), which builds on top of this. This phase only moves the *existing* product shape (plus display fields already added during the recent visual redesign: `originalPrice`, `hoverImage`, `soldOut`) into the database.
2. Product search is **not** built in this phase (deferred to Phase 1, per stakeholder decision, since it depends on this phase's API existing).
3. `soldOut` is **computed** (`inventory_count <= 0`) in the API response, not stored as a separate column — avoids the two ever drifting apart.
4. `sizes`/`colors` use JSON columns, not a normalized variants table — this phase (and the app today) is display-only for variants; the cart/checkout flow doesn't track per-size/color stock.
5. Frontend data-fetching approach: a shared `ProductsContext` (Approach A of three considered), modeled directly on the existing `AuthContext`/`CartContext` pattern — fetch once, cache in context, no new dependencies. Rejected: per-page fetching (redundant requests, awkward cross-page lookups for cart/checkout) and TanStack Query (new dependency, overkill for a catalog this size).
6. Loading/error UX is handled **once**, at the `Layout` level, not per-page — while products are loading, `Layout` renders a full-page loading state instead of `<Outlet />`; on error, a full-page message with a "Try Again" button (`window.location.reload()`). Every page below `Layout` can assume `products` is already populated, matching today's synchronous-import assumption.
7. **The Alembic migration will be written but not applied to the real database** by the implementing agent without the user's explicit go-ahead — applying it is a state change to a shared system (Supabase) outside this git repo's version control.
8. `ProductPage`'s existing "fall back to first product if ID not found" behavior is preserved exactly as-is — not something this phase changes.

## 1. Backend: Product Model Expansion

`backend/models.py`'s `Product` class expands from its current 6 columns to:

```python
class Product(Base):
    __tablename__ = "products"
    id = Column(String, primary_key=True, default=generate_uuid)
    sku = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    subtitle = Column(String, nullable=True)
    price = Column(Numeric(10, 2), nullable=False)
    original_price = Column(Numeric(10, 2), nullable=True)
    image = Column(String, nullable=False)
    hover_image = Column(String, nullable=True)
    badge = Column(String, nullable=True)
    description = Column(Text, nullable=False)
    sizes = Column(JSON, nullable=False, default=list)
    colors = Column(JSON, nullable=False, default=list)
    inventory_count = Column(Integer, CheckConstraint('inventory_count >= 0'), nullable=False, default=0)
    category = Column(String, nullable=False)
```

An Alembic migration (`backend/alembic/`) adds the new columns (`subtitle`, `original_price`, `image`, `hover_image`, `badge`, `description`, `sizes`, `colors`) to the existing `products` table. `image` and `description` are `nullable=False` at the model level but the migration must add them as nullable-then-backfill-then-not-null (or just nullable at the DB level with application-level enforcement), since existing rows (if any exist beyond what this phase seeds) have no value for them yet — implementation detail for the migration author to resolve safely.

## 2. Backend: API Endpoint

One new, public, rate-limited endpoint in `backend/main.py`:

```python
@app.get("/api/products")
@limiter.limit("60/minute")
async def get_products(request: Request, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).order_by(Product.name))
    products = result.scalars().all()
    return [
        {
            "id": p.id,
            "name": p.name,
            "subtitle": p.subtitle,
            "price": float(p.price),
            "originalPrice": float(p.original_price) if p.original_price else None,
            "image": p.image,
            "hoverImage": p.hover_image,
            "badge": p.badge,
            "soldOut": p.inventory_count <= 0,
            "description": p.description,
            "sizes": p.sizes,
            "colors": p.colors,
            "category": p.category,
        }
        for p in products
    ]
```

No `GET /api/products/{id}` endpoint — `ProductPage` looks up a single product from the already-fetched list client-side, exactly as it does today against the static array. Response keys are camelCase, matching the frontend `Product` interface exactly and following the same convention `/api/orders` already uses, so no field remapping is needed on the frontend.

## 3. Backend: Seeding

Extend the existing `@app.on_event("startup")` handler (which already seeds an admin user if none exists) to also seed the 7 current mock products if the `products` table is empty, translating each `mockData.ts` entry — including the `originalPrice`/`hoverImage`/zero-`inventory_count`-for-soldOut values already established during the visual redesign — into the new schema. This matches the existing "auto-seed on first run" convention rather than introducing a separate one-off script.

## 4. Frontend: `ProductsContext`

New file `frontend/src/contexts/ProductsContext.tsx`, structured like `AuthContext`/`CartContext`:

```tsx
interface ProductsContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export const ProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(res => { if (!res.ok) throw new Error('Failed to load products'); return res.json(); })
      .then(setProducts)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProductsContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => { /* same undefined-context-guard pattern as useAuth/useCart */ };
```

Mounted in `App.tsx` alongside the existing `AuthProvider`/`CartProvider` (order: `ProductsProvider` should wrap `CartProvider`, since cart-adjacent UI reads product data, though `CartContext` itself stores only `productId`/`name`/`price`/`quantity` and doesn't need `ProductsContext` directly).

`frontend/src/data/mockData.ts` keeps its `Product` interface — now the canonical shared type, matching the API response shape exactly — but **drops the static `PRODUCTS` array export**.

## 5. Frontend: Page Updates + Loading/Error UX

Five files currently `import { PRODUCTS } from '../../data/mockData'`: `HomePage.tsx`, `CatalogPage.tsx`, `ProductPage.tsx`, `CheckoutPage.tsx`, `CartDrawer.tsx`. Each swaps that import for `const { products } = useProducts();` and renames local `PRODUCTS` references to `products`.

`Layout.tsx` gates on `ProductsContext`'s `loading`/`error` state:
- `loading === true`: render a full-page loading state in place of `<Outlet />` (still rendering `Navbar`/`Footer`/`PromoBar` around it, since those don't depend on product data).
- `error !== null`: render a full-page error state ("Couldn't load products. [Try Again]") in place of `<Outlet />`, where "Try Again" reloads the page.
- Otherwise: render `<Outlet />` as today.

This means none of the five pages need their own loading/error branches — they can assume `products` is populated, matching their current synchronous-import assumption exactly.

## 6. Verification

No automated test framework exists in this project (frontend or backend) — verification is manual/agent-assisted, consistent with the recent visual redesign: `npx tsc -b --noEmit` + `npm run build` on the frontend; curling the new endpoint and confirming seed data on the backend. **The Alembic migration will be generated and reviewed, but not applied to the real (Supabase) database, without the user's explicit go-ahead** — that's a state change to a shared system outside this repo's version control, not something to run autonomously.

## Out of Scope (this phase)

- `collection` field / collection data model (Phase 1)
- Category taxonomy changes (Phase 1)
- Product search (Phase 1)
- Nav dropdowns, mobile menu, announcement bar (Phase 1)
- Homepage tabbed slider, listing sort/wishlist/quick-add, PDP media gallery/zoom/size-chart/buy-it-now/accordions, cart order-notes, footer newsletter (Phases 2–6)
- Per-variant (size/color) inventory tracking
- `GET /api/products/{id}` — not needed at this scale
- Pagination — not needed at this product-count scale; revisit if the catalog grows substantially

## Open Items for Implementation Planning

- Exact Alembic migration strategy for making `image`/`description` non-null on a table that may already have rows without those values (nullable-then-backfill vs. seed-before-migrate ordering).
- Whether `ProductsProvider` needs to wrap `CartProvider` or vice versa in `App.tsx` — resolved above (Products wraps Cart) but worth the plan double-checking no existing cross-dependency contradicts it.
