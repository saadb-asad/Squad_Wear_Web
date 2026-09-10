# Products API & DB-Backed Catalog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move product data from static frontend mock data to a real, database-backed catalog served by a new `GET /api/products` endpoint, with every frontend page reading from it via a shared `ProductsContext` instead of importing a static array — no visible behavior change on any page.

**Architecture:** Backend: expand the `Product` SQLAlchemy model with the display fields the storefront needs, add an Alembic migration, seed the 7 current mock products on startup (extending the existing admin-seed pattern), and expose them via one public `GET /api/products` endpoint. Frontend: a new `ProductsContext` (modeled on the existing `AuthContext`/`CartContext`) fetches the list once and every consuming page swaps its static `PRODUCTS` import for `useProducts()`. Loading/error states are handled once, in `Layout.tsx`, not per-page.

**Tech Stack:** FastAPI, SQLAlchemy (async), Alembic, PostgreSQL (Supabase) on the backend; React 19, TypeScript, react-router-dom on the frontend.

**Spec:** `docs/superpowers/specs/2026-09-10-products-api-catalog-design.md`

## Global Constraints

- This phase does NOT add a `collection` field or change the category taxonomy — those belong to the next phase (Nav & Collections).
- `soldOut` is never a stored column — it is computed as `inventory_count <= 0` in the API response.
- `sizes`/`colors` are JSON columns, not a normalized variants table.
- **The Alembic migration must be generated/written but MUST NOT be applied (`alembic upgrade head`) against the real database by the implementing agent without the user's explicit, separate go-ahead.** This is a state change to a shared system (Supabase) outside git version control.
- **No task in this plan may start the backend dev server** (`uvicorn main:app` or any run command that boots the FastAPI app) or otherwise cause the `@app.on_event("startup")` handler to execute, since that handler will attempt to connect to and seed the real database — the same real-database concern as the migration. Backend verification is limited to static checks: `python -m py_compile`, `python -c "import <module>"` (import-only — SQLAlchemy's `create_async_engine` does not connect eagerly, so a plain import is safe), and code review. Actually starting the server and hitting the endpoint is a manual step for the user to do themselves after reviewing and applying the migration.
- No automated test framework exists in this project (frontend or backend). Frontend verification: `npx tsc -b --noEmit` and `npm run build`. Backend verification: the static checks above.
- `ProductPage`'s existing "fall back to first product if ID not found" behavior must be preserved exactly.
- Product `id` values in the seed data must match the existing frontend `id` strings exactly (e.g. `apex-tech-hoodie`) — these are used in cart items and `/catalog/:id` URLs today and must keep working.

---

## File Structure

New files:
- `backend/alembic/versions/a91c4e7b2f6a_add_product_display_fields.py` — migration adding the new `products` columns
- `frontend/src/contexts/ProductsContext.tsx` — `ProductsProvider` + `useProducts()` hook

Modified files:
- `backend/models.py` — expand `Product` model
- `backend/main.py` — add `GET /api/products` endpoint; extend `startup_event` to seed products
- `frontend/src/App.tsx` — mount `ProductsProvider`
- `frontend/src/components/layout/Layout.tsx` — loading/error gating
- `frontend/src/data/mockData.ts` — drop the `PRODUCTS` array export, keep the `Product` interface
- `frontend/src/pages/Home/HomePage.tsx` — use `useProducts()`
- `frontend/src/pages/Catalog/CatalogPage.tsx` — use `useProducts()`
- `frontend/src/pages/Catalog/ProductPage.tsx` — use `useProducts()`
- `frontend/src/pages/Checkout/CheckoutPage.tsx` — use `useProducts()`
- `frontend/src/components/ui/CartDrawer.tsx` — use `useProducts()`

Not modified: `backend/auth.py`, `backend/database.py`, `backend/payfast_utils.py`, any Admin Dashboard file, any other frontend page.

---

### Task 1: Backend — expand the `Product` model

**Files:**
- Modify: `backend/models.py`

**Interfaces:**
- Produces: `Product` SQLAlchemy model with columns `id, sku, name, subtitle, price, original_price, image, hover_image, badge, description, sizes, colors, inventory_count, category`. Task 2 (migration) and Task 3 (endpoint + seed) both depend on this exact column set and exact names.

- [ ] **Step 1: Update the import line and the `Product` class**

In `backend/models.py`, change the import line:

```python
from sqlalchemy import Column, String, Numeric, Integer, ForeignKey, Text, DateTime, CheckConstraint, JSON
```

Replace the `Product` class:

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

Do not change `User`, `Order`, `OrderItem`, `OrderEvent`, or `BusinessInquiry` in this file.

- [ ] **Step 2: Verify**

Run `cd backend && python -m py_compile models.py` and confirm it exits with no output/errors. Do NOT run anything that imports or starts the FastAPI app itself in this task.

- [ ] **Step 3: Commit**

```bash
git add backend/models.py
git commit -m "Expand Product model with catalog display fields"
```

---

### Task 2: Backend — Alembic migration (write only, do not apply)

**Files:**
- Create: `backend/alembic/versions/a91c4e7b2f6a_add_product_display_fields.py`

**Interfaces:**
- Consumes: the exact column set from Task 1's `Product` model.
- Produces: a migration file on disk. **This task does not run `alembic upgrade head`.**

- [ ] **Step 1: Write the migration file**

The current migration head is `f58c004c272e` (`backend/alembic/versions/f58c004c272e_enable_rls_on_public_tables.py`). Create the new file with this exact content:

```python
"""Add product display fields

Revision ID: a91c4e7b2f6a
Revises: f58c004c272e
Create Date: 2026-09-10 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a91c4e7b2f6a'
down_revision: Union[str, Sequence[str], None] = 'f58c004c272e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('products', sa.Column('subtitle', sa.String(), nullable=True))
    op.add_column('products', sa.Column('original_price', sa.Numeric(precision=10, scale=2), nullable=True))
    op.add_column('products', sa.Column('image', sa.String(), nullable=False, server_default=''))
    op.add_column('products', sa.Column('hover_image', sa.String(), nullable=True))
    op.add_column('products', sa.Column('badge', sa.String(), nullable=True))
    op.add_column('products', sa.Column('description', sa.Text(), nullable=False, server_default=''))
    op.add_column('products', sa.Column('sizes', sa.JSON(), nullable=False, server_default='[]'))
    op.add_column('products', sa.Column('colors', sa.JSON(), nullable=False, server_default='[]'))
    op.alter_column('products', 'image', server_default=None)
    op.alter_column('products', 'description', server_default=None)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('products', 'colors')
    op.drop_column('products', 'sizes')
    op.drop_column('products', 'description')
    op.drop_column('products', 'badge')
    op.drop_column('products', 'hover_image')
    op.drop_column('products', 'image')
    op.drop_column('products', 'original_price')
    op.drop_column('products', 'subtitle')
```

Note the pattern for `image`/`description`: they're added with a temporary empty-string `server_default` so the `NOT NULL` constraint can apply even if the `products` table already has rows (there is no code path anywhere in this codebase that currently inserts into `products`, so it is expected to be empty, but this pattern is safe either way). The `alter_column` calls immediately after drop the server default again, so it doesn't linger as an implicit default for future inserts — new rows must supply real values, matching the model's `nullable=False`.

- [ ] **Step 2: Verify the file is well-formed**

Run `cd backend && python -m py_compile alembic/versions/a91c4e7b2f6a_add_product_display_fields.py` and confirm no errors. **Do not run `alembic upgrade head`, `alembic revision --autogenerate`, or any other Alembic command that connects to the database** — this migration is written and reviewed, not applied, in this task.

- [ ] **Step 3: Commit**

```bash
git add backend/alembic/versions/a91c4e7b2f6a_add_product_display_fields.py
git commit -m "Add migration for product display fields (not applied — see PLAN)"
```

---

### Task 3: Backend — `GET /api/products` endpoint + startup seeding

**Files:**
- Modify: `backend/main.py`

**Interfaces:**
- Consumes: `Product` model from Task 1 (exact column names).
- Produces: `GET /api/products` returning `[{id, name, subtitle, price, originalPrice, image, hoverImage, badge, soldOut, description, sizes, colors, category}, ...]`. Frontend Task 5 (`ProductsContext`) fetches this exact shape and exact URL.

- [ ] **Step 1: Add the seed data and extend `startup_event`**

In `backend/main.py`, the existing `startup_event` function seeds an admin user. Extend it to also seed products, using the exact same async session. Replace:

```python
@app.on_event("startup")
async def startup_event():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).where(User.email == "admin@squadattire.com"))
        admin = result.scalar_one_or_none()
        if not admin:
            admin = User(
                email="admin@squadattire.com",
                password_hash=get_password_hash("admin123"),
                account_type="internal_admin",
                first_name="Admin",
                company_name="Squad Attire"
            )
            session.add(admin)
            await session.commit()
```

with:

```python
SEED_PRODUCTS = [
    {
        "id": "apex-tech-hoodie", "sku": "SQD-APEX-TECH-HOODIE",
        "name": "Apex Tech Hoodie", "subtitle": "Industrial Grey / Heavyweight",
        "price": 120.00, "original_price": None,
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBA8aYq6haC7i626RBAxGikRimxUIaCXW3sWd1UnyxtN_m2xiVcx8Is2fqlh-hlyJtRktD3Ob-g-R-Vpo8wvVax4TP9tcVuI9RNRQ1ys8k3i0imLsdPNfQkakzfznNpHlv33usRvykg2QhQK7EXd-6QiaWF6JUglpeNVk7q0QpQRLHeCTvkOd390S7-rxKiQdqOWboaAwMoBzUgtvFiy-xJTDcmAQ5qCR9Tf593FpCzW_uNnHqJs3kP8Q3VzTyQX-aWbawGDqA8P89g",
        "hover_image": "https://lh3.googleusercontent.com/aida-public/AB6AXuB7RVti_D9Ep15yDLDJkNUIeP4Gf6RDf9_ZZtTSUafk1xNSP64P35KRtO4Z7u5BxtI1k1a0QvhUW61iylcTRLCL6QFg1P3rv8vBZzMsz6yXnD1KvM3l5NhddE-NzfVVKI-GvO6cV96v0vbIehRHx1QanpK-pFJPziOYfZVNcn8sRJgasKZSxLpaxG8bFiqnpMxSF1mvdkU-2eaRx5U8BYsh4NyzGWFxpYZR-kievm4CNYMJvIKlPoiuIagRaEuw923-GgT54YbA6x-V",
        "badge": "New Drop",
        "description": "Engineered for the modern urban landscape. Our Apex Tech Hoodie features a bespoke cross-weave fleece, designed to hold its architectural shape while providing unparalleled comfort. Finished with precision-engineered hardware.",
        "sizes": ["S", "M", "L", "XL"],
        "colors": [
            {"name": "Stealth Grey", "hex": "#3d3d3d"},
            {"name": "Midnight Black", "hex": "#1a1a1a"},
            {"name": "Industrial Grey", "hex": "#e5e5e5"},
        ],
        "inventory_count": 25, "category": "Outerwear",
    },
    {
        "id": "stealth-cargo-jogger", "sku": "SQD-STEALTH-CARGO-JOGGER",
        "name": "Stealth Cargo Jogger", "subtitle": "Midnight Black / Ripstop",
        "price": 95.00, "original_price": None,
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuA-zGPVr8F43eZRbcgSLtL0A2cJduWP1zwq-G4IwMqnAXza-xleI70RSqL0P6pTiogXW1zJ-ta3PLQuqwnf3TznSdAlaez6WUUEv9EsQwDFleDpLJdn5DOM1pKeHHAuUn5EK8SY0Rq4wXpGEGgtX0IABus1Y6bLqMkLJHOhscJCbrVQGeG3mKLtI81Ff30v6oIkWEkUmy1fHYhtQN9-E_zeUOTQxZfrrDrGir7JgtaXfVputTsHL50suK_x7RZ0E2ezV5tDc72KkwsH",
        "hover_image": None,
        "badge": None,
        "description": "Modern tactical joggers in matte black, featuring reinforced knee panels and multiple functional cargo pockets with teal zipper pulls.",
        "sizes": ["30", "32", "34", "36"],
        "colors": [{"name": "Midnight Black", "hex": "#1a1a1a"}],
        "inventory_count": 25, "category": "Outerwear",
    },
    {
        "id": "vector-core-tee", "sku": "SQD-VECTOR-CORE-TEE",
        "name": "Vector Core Tee", "subtitle": "Optic White / Tech Print",
        "price": 45.00, "original_price": 60.00,
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuChhhWwdFkw6JeM2lQj7uHd6zHCbDlUBxlCHp2VyinovZaxAdFiIOQjYcQ0VRSRs3ANk0Un63yF84Br9sFSwh0cEsLRrewGXzQUrOZGcCHVj_mhZhj5DSTtl2q4-IDHyMU9LdI92W_VbxgiJCTMQBjv1o5FCcmnaXzE-lrO0l4c69qR_TU0M_0cleQt3Bi9V0qb9Q84fW64ubOe8SFzegttyD_EhhH3kkCWjY2wwqU7LKsXX_iXqUtDgx3aUJgVng3MWLpdkmp_hSWC",
        "hover_image": None,
        "badge": None,
        "description": "A crisp, white oversized graphic T-shirt with a minimalist technical diagram printed on the chest in reflective teal ink. Boxy oversized fit.",
        "sizes": ["S", "M", "L", "XL"],
        "colors": [{"name": "Optic White", "hex": "#ffffff"}],
        "inventory_count": 25, "category": "T-Shirts",
    },
    {
        "id": "storm-shell-v2", "sku": "SQD-STORM-SHELL-V2",
        "name": "Storm Shell V2", "subtitle": "Forest Teal / Waterproof",
        "price": 210.00, "original_price": None,
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCeFU7BfWYTIq4feA0tS37_M_Fj_jU8r3lUwEAK36s2pZ78EOvUs8xqyyCS1epz-1MyFZ2gDDEkSDOKizsV7lDE6rHgufMzAuOoKQJZAutCy6aHF2Qkly1Y7Ok6smNsY6WgZVsnnepBwggXiq3aIpm3rLe_DeAwB_6TenruHOAnZbcs8G1wUEACw0k-FtfdZeiYlIXc0G4KgmeTdcd5WTrIfFFPpOHM5-36gX8EbTu28B-hMTukKt8CN3V7ThVck9eNL6iSnKOXwLL3",
        "hover_image": None,
        "badge": None,
        "description": "A futuristic technical shell jacket in a muted forest teal color, featuring waterproof zippers and an asymmetrical front closure.",
        "sizes": ["S", "M", "L", "XL"],
        "colors": [{"name": "Forest Teal", "hex": "#0a4242"}],
        "inventory_count": 25, "category": "Outerwear",
    },
    {
        "id": "kinetix-hi-top", "sku": "SQD-KINETIX-HI-TOP",
        "name": "Kinetix Hi-Top", "subtitle": "Stone Grey / Modular",
        "price": 185.00, "original_price": None,
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCs_tF23I_0G3NubpwVqPOSk1R2dOESOUs5jtPsrNGxC0Q4e8RwUYtAfDmJJeEVsviJEjvj8coq_Rphsiij9BpHClf5suKO81IGbSPYK3hCSdr8DPTAF9H-w5zEJaWJKOyITQjASdFZNbMZu0F36J7qF5wmEdQ5Ecm6JGoaAkUbh9OeqDBBLGIVgioolldL3otPrMY7T0JR6So_i65k2WlD7Ef52mRGBAYS9wHCnaKdU17UnKfgcqlw_peDZPAkqcwxkznkzawquk16",
        "hover_image": None,
        "badge": None,
        "description": "A pair of high-top techwear sneakers in multi-tonal grey and white, with complex strap systems and a chunky, sculpted sole.",
        "sizes": ["8", "9", "10", "11", "12"],
        "colors": [{"name": "Stone Grey", "hex": "#8c8c8c"}],
        "inventory_count": 25, "category": "Footwear",
    },
    {
        "id": "signal-sling-bag", "sku": "SQD-SIGNAL-SLING-BAG",
        "name": "Signal Sling Bag", "subtitle": "Carbon Black / Weatherproof",
        "price": 65.00, "original_price": None,
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuANW-fMLouqfrFpOy2qJROnDWOAl7x25XjxkDTGdkGw9SZpMmnLvB9XykTPfLjaOMqRykuAkOWNJpaDSHD0-oSI_Yi1MToGbxL0BLtIFaLv76PSheDhwA86lul4SIEj_q2CIULbttSvQkA0myxY02ilQIQDMH3LIFboUoN_HgYoBd8CURraAq4xPP3cPR-UFDCsuXaU7XOuQ5_6q-tN5waIgRS4xBhjR66h_h7LPy-CzuIAVQFd1Eq8r6fUtPQ_XAwRjbMOTdqHmrwQ",
        "hover_image": None,
        "badge": None,
        "description": "A sleek black technical crossbody bag with carbon-fiber textured panels and magnetic FIDLOCK buckles.",
        "sizes": ["One Size"],
        "colors": [{"name": "Carbon Black", "hex": "#111111"}],
        "inventory_count": 0, "category": "Accessories",
    },
    {
        "id": "core-heavyweight-hoodie", "sku": "SQD-CORE-HEAVYWEIGHT-HOODIE",
        "name": "Core Heavyweight Hoodie", "subtitle": "Industrial Grey / Heavyweight",
        "price": 145.00, "original_price": None,
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuDOShzYyebbEZcW7zMY2IdXnt2mN4bluylu_e_4BLg6zrYumO2u5enwq8-mQGjZPuLLgshq1TloNlmV_Be1yZ_4qXoMJm4KM8isxAHIyeelQ7dWth6SLFoBhj3fN7nSM4PTfyaTnRJm8GDtH8lCKqXRIwPQHI4XN8vgNBYEoxT1PwEKeeM0rzBbRFfbYBGeeYSivJHGsljp4A161E5-SnnC6WQZjQn_yaW0pp1VdYELKDL4AHaNzsIEyeZ4M7U5m1--DiCO5WSKebb_",
        "hover_image": None,
        "badge": "COLLECTION 01 / ESSENTIALS",
        "description": "Engineered for the modern urban landscape. Our Core Heavyweight Hoodie features a bespoke 500GSM cross-weave fleece, designed to hold its architectural shape while providing unparalleled comfort. Finished with precision-engineered hardware.",
        "sizes": ["S", "M", "L", "XL"],
        "colors": [
            {"name": "Stealth Grey", "hex": "#3d3d3d"},
            {"name": "Midnight Black", "hex": "#1a1a1a"},
            {"name": "Industrial Grey", "hex": "#e5e5e5"},
        ],
        "inventory_count": 25, "category": "Outerwear",
    },
]

@app.on_event("startup")
async def startup_event():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).where(User.email == "admin@squadattire.com"))
        admin = result.scalar_one_or_none()
        if not admin:
            admin = User(
                email="admin@squadattire.com",
                password_hash=get_password_hash("admin123"),
                account_type="internal_admin",
                first_name="Admin",
                company_name="Squad Attire"
            )
            session.add(admin)
            await session.commit()

        existing_product = await session.execute(select(Product).limit(1))
        if existing_product.scalars().first() is None:
            for p in SEED_PRODUCTS:
                session.add(Product(**p))
            await session.commit()
```

Note: this uses `select(Product).limit(1)` plus `.scalars().first()` rather than `.scalar_one_or_none()` — the latter raises `MultipleResultsFound` once the query can return more than one row, which it will on every server restart after the first successful seed (7 products). `.scalars().first()` just returns the first row or `None`, which is all "is the table empty" needs, and `.limit(1)` keeps the query cheap regardless of how large the table grows later.

- [ ] **Step 2: Add the `GET /api/products` endpoint**

Add this endpoint in `backend/main.py`, near the other `@app.get` endpoints (e.g. after `read_users_me`, before `UserUpdate`, or any other sensible location among the existing endpoints — exact position doesn't matter, just keep it with the other route handlers):

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
            "originalPrice": float(p.original_price) if p.original_price is not None else None,
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

- [ ] **Step 3: Verify**

Run `cd backend && python -m py_compile main.py` and confirm no errors. **Do not run `python -c "import main"` or start the app** — even though importing `main.py` wouldn't itself trigger the startup event or a DB connection, stay within this plan's static-checks-only rule (see Global Constraints) rather than relying on that distinction.

- [ ] **Step 4: Commit**

```bash
git add backend/main.py
git commit -m "Add GET /api/products endpoint and startup product seeding"
```

---

### Task 4: Frontend — `ProductsContext`

**Files:**
- Create: `frontend/src/contexts/ProductsContext.tsx`

**Interfaces:**
- Consumes: `Product` type from `../data/mockData` (still exported after Task 8), `API_BASE_URL` from `../config`.
- Produces: `ProductsProvider({ children })`, `useProducts()` returning `{ products: Product[], loading: boolean, error: string | null }`. Tasks 5–10 all consume this exact hook and shape.

- [ ] **Step 1: Create the context**

```tsx
// frontend/src/contexts/ProductsContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../data/mockData';
import { API_BASE_URL } from '../config';

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load products');
        return res.json();
      })
      .then((data: Product[]) => setProducts(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProductsContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
```

- [ ] **Step 2: Mount it in `App.tsx`**

In `frontend/src/App.tsx`, add the import and wrap the existing providers:

```tsx
import { ProductsProvider } from './contexts/ProductsContext';
```

Change:

```tsx
    <AuthProvider>
      <CartProvider>
```

to:

```tsx
    <ProductsProvider>
    <AuthProvider>
      <CartProvider>
```

and the matching closing tags at the end of the JSX:

```tsx
      </CartProvider>
    </AuthProvider>
```

to:

```tsx
      </CartProvider>
    </AuthProvider>
    </ProductsProvider>
```

(Indentation of the inner tags doesn't need to change — only wrap the existing tree with one more provider level.)

- [ ] **Step 3: Verify**

Run `cd frontend && npx tsc -b --noEmit` and confirm no errors.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/contexts/ProductsContext.tsx frontend/src/App.tsx
git commit -m "Add ProductsContext and mount ProductsProvider in App"
```

---

### Task 5: Frontend — `Layout.tsx` loading/error gating

**Files:**
- Modify: `frontend/src/components/layout/Layout.tsx`

**Interfaces:**
- Consumes: `useProducts()` from Task 4 (`loading`, `error`).

- [ ] **Step 1: Add the gating**

Replace the full contents of `frontend/src/components/layout/Layout.tsx`:

```tsx
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { PromoBar } from '../ui/PromoBar';
import { CartDrawer } from '../ui/CartDrawer';
import { useProducts } from '../../contexts/ProductsContext';

export const Layout = () => {
  const { loading, error } = useProducts();

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      <PromoBar message="Rs. 250 COD fee — FREE with bank transfer" />
      <Navbar />
      <main style={{ flex: 1, paddingBottom: '4rem' }}>
        {loading ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <p className="font-ui text-sm text-on-surface-variant">Loading…</p>
          </div>
        ) : error ? (
          <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
            <p className="font-ui text-sm text-on-surface-variant">Couldn't load products.</p>
            <button
              onClick={() => window.location.reload()}
              className="border border-outline px-6 py-3 font-ui text-shout text-xs text-on-surface hover:border-secondary hover:text-secondary transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};
```

Note: `Navbar`, `Footer`, and `PromoBar` still render during the loading/error states — they don't depend on product data.

- [ ] **Step 2: Verify**

Run `cd frontend && npx tsc -b --noEmit` and confirm no errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/layout/Layout.tsx
git commit -m "Gate page content on ProductsContext loading/error state in Layout"
```

---

### Task 6: Frontend — migrate `HomePage.tsx`

**Files:**
- Modify: `frontend/src/pages/Home/HomePage.tsx`

**Interfaces:**
- Consumes: `useProducts()` from Task 4.

- [ ] **Step 1: Replace the static import and move `CATEGORY_TILES` inside the component**

The current file computes `CATEGORY_TILES` at module scope from the static `PRODUCTS` import — this can't work once product data is fetched asynchronously, so it must move inside the component body, computed from the hook's `products`. Replace the full contents of `frontend/src/pages/Home/HomePage.tsx`:

```tsx
import { useCart } from '../../contexts/CartContext';
import { useProducts } from '../../contexts/ProductsContext';
import { CategoryTile } from '../../components/ui/CategoryTile';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { ProductCard } from '../../components/ui/ProductCard';
import { BrandMessageBlock } from '../../components/ui/BrandMessageBlock';
import { TestimonialCard } from '../../components/ui/TestimonialCard';

const TESTIMONIALS = [
  { name: 'Ahmed R.', date: 'Aug 2026', quote: 'Fit is exactly as pictured and the fabric feels heavyweight. Reordering already.' },
  { name: 'Sana K.', date: 'Jul 2026', quote: 'Exchange process was painless — sized up a hoodie in two days flat.' },
  { name: 'Bilal M.', date: 'Jul 2026', quote: "Best oversized tee I've bought locally. Squad Wear gets the streetwear fit right." },
];

export const HomePage = () => {
  const { addToCart } = useCart();
  const { products } = useProducts();

  const categoryTiles = [
    { label: 'Outerwear', category: 'Outerwear', image: products[0]?.image ?? '' },
    { label: 'T-Shirts', category: 'T-Shirts', image: products.find(p => p.category === 'T-Shirts')?.image ?? '' },
    { label: 'Footwear', category: 'Footwear', image: products.find(p => p.category === 'Footwear')?.image ?? '' },
    { label: 'Accessories', category: 'Accessories', image: products.find(p => p.category === 'Accessories')?.image ?? '' },
  ];

  return (
    <main className="w-full max-w-max-width mx-auto px-4 lg:px-margin-desktop space-y-16 lg:space-y-section-y py-section-y-mobile lg:py-section-y">
      <h1 className="sr-only">Squad Wear</h1>
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {categoryTiles.map(tile => (
          <CategoryTile key={tile.category} {...tile} />
        ))}
      </section>

      <section className="space-y-10">
        <SectionHeading title="New Drops" subtitle="Freshly stocked. Shop before they're gone." />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map(product => (
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

Note the `?? ''` fallbacks on the tile images: `Layout` (Task 5) already guarantees `products` is non-empty and loaded before this component renders in the normal case, but these fallbacks make the component itself safe even if called with an empty array (e.g. in isolation), replacing the old `!` non-null assertions that would have crashed.

- [ ] **Step 2: Verify**

Run `cd frontend && npx tsc -b --noEmit` and confirm no errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/Home/HomePage.tsx
git commit -m "Migrate HomePage to useProducts()"
```

---

### Task 7: Frontend — migrate `CatalogPage.tsx`

**Files:**
- Modify: `frontend/src/pages/Catalog/CatalogPage.tsx`

**Interfaces:**
- Consumes: `useProducts()` from Task 4.

- [ ] **Step 1: Replace the import and the `PRODUCTS` reference**

In `frontend/src/pages/Catalog/CatalogPage.tsx`, change:

```tsx
import { PRODUCTS } from '../../data/mockData';
```

to:

```tsx
import { useProducts } from '../../contexts/ProductsContext';
```

Inside the component, add the hook call alongside the existing `useCart()`/`useSearchParams()` calls:

```tsx
  const { addToCart } = useCart();
  const { products } = useProducts();
  const [searchParams] = useSearchParams();
```

Change the `filteredProducts` computation from `PRODUCTS.filter(...)` to `products.filter(...)` — same predicate logic, just the source array changes:

```tsx
  const filteredProducts = products.filter(product => {
```

- [ ] **Step 2: Verify**

Run `cd frontend && npx tsc -b --noEmit` and confirm no errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/Catalog/CatalogPage.tsx
git commit -m "Migrate CatalogPage to useProducts()"
```

---

### Task 8: Frontend — migrate `ProductPage.tsx`

**Files:**
- Modify: `frontend/src/pages/Catalog/ProductPage.tsx`

**Interfaces:**
- Consumes: `useProducts()` from Task 4.

- [ ] **Step 1: Replace the import and both `PRODUCTS` references**

In `frontend/src/pages/Catalog/ProductPage.tsx`, change:

```tsx
import { PRODUCTS } from '../../data/mockData';
```

to:

```tsx
import { useProducts } from '../../contexts/ProductsContext';
```

Inside the component:

```tsx
export const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useProducts();
  const product = products.find(p => p.id === id) || products[0]; // fallback to first product if not found
  const { addToCart } = useCart();
```

And the recommendations line:

```tsx
  const recommendations = products.filter(p => p.id !== product.id).slice(0, 4);
```

Preserve the exact fallback-to-first-product behavior — do not change it (per the spec's explicit decision to keep this as-is).

- [ ] **Step 2: Verify**

Run `cd frontend && npx tsc -b --noEmit` and confirm no errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/Catalog/ProductPage.tsx
git commit -m "Migrate ProductPage to useProducts()"
```

---

### Task 9: Frontend — migrate `CheckoutPage.tsx`

**Files:**
- Modify: `frontend/src/pages/Checkout/CheckoutPage.tsx`

**Interfaces:**
- Consumes: `useProducts()` from Task 4.

- [ ] **Step 1: Replace the import and both `PRODUCTS` references**

In `frontend/src/pages/Checkout/CheckoutPage.tsx`, change:

```tsx
import { PRODUCTS } from '../../data/mockData';
```

to:

```tsx
import { useProducts } from '../../contexts/ProductsContext';
```

Inside the component, add the hook call and update the two usages:

```tsx
export const CheckoutPage = () => {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const { isAuthenticated, token } = useAuth();
  const { products } = useProducts();
```

```tsx
  // Get some recommendations for 'Complete the Kit'
  const recommendations = products.slice(0, 2);
```

```tsx
            const productInfo = products.find(p => p.id === item.productId);
```

Do not change `handleCheckout`, `applyPromo`, or the `subtotal`/`tax`/`finalTotal` calculations — this task only changes where product lookups come from.

- [ ] **Step 2: Verify**

Run `cd frontend && npx tsc -b --noEmit` and confirm no errors. Re-read `handleCheckout` and `applyPromo` in the diff to confirm they are byte-identical to before.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/Checkout/CheckoutPage.tsx
git commit -m "Migrate CheckoutPage to useProducts(), checkout logic unchanged"
```

---

### Task 10: Frontend — migrate `CartDrawer.tsx`

**Files:**
- Modify: `frontend/src/components/ui/CartDrawer.tsx`

**Interfaces:**
- Consumes: `useProducts()` from Task 4.

- [ ] **Step 1: Replace the import and both `PRODUCTS` references**

In `frontend/src/components/ui/CartDrawer.tsx`, change:

```tsx
import { PRODUCTS } from '../../data/mockData';
```

to:

```tsx
import { useProducts } from '../../contexts/ProductsContext';
```

Inside the component:

```tsx
export const CartDrawer = () => {
  const { items, removeFromCart, updateQuantity, total, isDrawerOpen, closeDrawer } = useCart();
  const { products } = useProducts();
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const progressPct = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);
  const suggestions = products.slice(0, 3);
```

And the item-image lookup:

```tsx
                  <img
                    src={products.find(p => p.id === item.productId)?.image}
```

- [ ] **Step 2: Verify**

Run `cd frontend && npx tsc -b --noEmit` and confirm no errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/ui/CartDrawer.tsx
git commit -m "Migrate CartDrawer to useProducts()"
```

---

### Task 11: Frontend — drop the static `PRODUCTS` export

**Files:**
- Modify: `frontend/src/data/mockData.ts`

**Interfaces:**
- Consumes: nothing new. This task runs last among the frontend migration tasks specifically because every consumer of `PRODUCTS` must already be migrated (Tasks 6–10) before the export can be removed without breaking a build.
- Produces: `mockData.ts` exports only the `Product` interface — no more `PRODUCTS` array.

- [ ] **Step 1: Confirm no remaining consumers**

Run `grep -rn "PRODUCTS" frontend/src --include="*.tsx" --include="*.ts"` and confirm the only remaining match is the declaration itself in `mockData.ts` (i.e., Tasks 6–10 are all actually done and committed). If any other file still references `PRODUCTS`, stop and report BLOCKED — do not proceed with this task until that's resolved, since removing the export would break the build.

- [ ] **Step 2: Remove the `PRODUCTS` export**

In `frontend/src/data/mockData.ts`, delete the `export const PRODUCTS: Product[] = [...]` array (the entire block, from `export const PRODUCTS` through its closing `];`). Keep the `export interface Product { ... }` block exactly as it is — it's now the canonical type shared with the backend API response shape.

- [ ] **Step 3: Verify**

Run `cd frontend && npx tsc -b --noEmit` and `cd frontend && npm run build`, confirm both are clean. A clean build here is strong evidence no file still references the removed export (TypeScript would fail to resolve the missing import otherwise).

- [ ] **Step 4: Commit**

```bash
git add frontend/src/data/mockData.ts
git commit -m "Remove static PRODUCTS export now that all pages fetch from the API"
```

---

### Task 12: Full verification pass

**Files:** none (verification only).

- [ ] **Step 1: Frontend checks**

Run `cd frontend && npx tsc -b --noEmit` and `cd frontend && npm run build`. Both must be clean. Also run `grep -rn "from '../../data/mockData'\|from '../data/mockData'" frontend/src` and confirm every remaining import is only for the `Product` type (e.g. `import type { Product } from '...'` or `import { Product } from '...'` used only as a type), never `PRODUCTS`.

- [ ] **Step 2: Backend static checks**

Run `cd backend && python -m py_compile models.py main.py alembic/versions/a91c4e7b2f6a_add_product_display_fields.py` and confirm no errors. Do not run anything that imports `main.py` live, starts the server, or touches Alembic against the real database — those are explicitly out of scope for this plan (see Global Constraints).

- [ ] **Step 3: Report to the user, do not proceed further automatically**

This plan's work is code-complete once Steps 1–2 pass. Two things remain that require the user's explicit action, not this plan's automation:
1. Review the migration at `backend/alembic/versions/a91c4e7b2f6a_add_product_display_fields.py` and, when ready, run `alembic upgrade head` themselves (or explicitly ask an agent to do it) against the real database.
2. After the migration is applied, start the backend (`uvicorn main:app` or equivalent) themselves to trigger the startup seed and confirm `GET /api/products` returns the 7 seeded products, then spot-check the frontend (`npm run dev`) against a running backend to confirm pages render real API data instead of the old static array.

No commit for this task — it's a verification/reporting pass.
