# Products API, Database Fallback & Frontend DB Fetching Implementation Plan

Fix backend database errors, implement automatic database connection fallback (local SQLite if cloud DB is unreachable), expand backend `Product` model, add `/api/products` endpoint with auto-seeding on startup, and migrate the frontend to fetch products from the database on page refresh via `ProductsContext`.

## Problem & Background Context
1. **Backend Database Error**: Connecting to Supabase currently fails with `tenant/user postgres.jhvanhcoyxebzoucypmk not found`, causing backend crashes whenever database queries run.
2. **Missing Products API & DB Fetching**: The storefront currently relies on a static `PRODUCTS` array in `mockData.ts`. There is no `/api/products` endpoint in `main.py`, no `ProductsContext` in the frontend, and refreshing the website does not fetch products from the database.

## Proposed Solution
- **Backend Database Resilience**: Update `database.py` with fallback to local SQLite (`sqlite+aiosqlite:///./squadgear.db`) if the remote PostgreSQL connection fails, and ensure table schema auto-creation (`Base.metadata.create_all`) on startup.
- **Product Model Expansion**: Update `backend/models.py` to include `subtitle`, `original_price`, `image`, `hover_image`, `badge`, `description`, `sizes`, and `colors`.
- **Alembic Migration**: Add migration `a91c4e7b2f6a_add_product_display_fields.py` for schema changes.
- **Startup Auto-Seeding & `GET /api/products` Endpoint**: In `backend/main.py`, seed admin user and 7 default products on startup if missing. Provide `GET /api/products` returning camelCase product objects with `soldOut` calculation.
- **Frontend `ProductsContext`**: Create `frontend/src/contexts/ProductsContext.tsx` to fetch `/api/products` from the backend API.
- **Frontend Page Migration**: Update `HomePage`, `CatalogPage`, `ProductPage`, `CheckoutPage`, and `CartDrawer` to read from `useProducts()`, and clean up static `PRODUCTS` export from `mockData.ts`.

---

## User Review Required

> [!IMPORTANT]
> **Database Fallback Mechanism**: If Supabase credentials are missing or unreachable, the system automatically falls back to SQLite so local development and testing work seamlessly without server crashes.

---

## Proposed Changes

### Backend Component

#### [MODIFY] [database.py](file:///mnt/vmstore/SquadGear_Web/backend/database.py)
- Add connection fallback logic so if PostgreSQL fails or is unavailable, it gracefully initializes SQLite `sqlite+aiosqlite:///./squadgear.db`.

#### [MODIFY] [models.py](file:///mnt/vmstore/SquadGear_Web/backend/models.py)
- Expand `Product` model with `subtitle`, `original_price`, `image`, `hover_image`, `badge`, `description`, `sizes`, `colors`.

#### [NEW] [a91c4e7b2f6a_add_product_display_fields.py](file:///mnt/vmstore/SquadGear_Web/backend/alembic/versions/a91c4e7b2f6a_add_product_display_fields.py)
- Add Alembic migration file for new product fields.

#### [MODIFY] [main.py](file:///mnt/vmstore/SquadGear_Web/backend/main.py)
- Add table auto-creation in `startup_event`.
- Add product auto-seeding in `startup_event` from mock products data.
- Add `GET /api/products` endpoint returning the database catalog.

---

### Frontend Component

#### [NEW] [ProductsContext.tsx](file:///mnt/vmstore/SquadGear_Web/frontend/src/contexts/ProductsContext.tsx)
- Implement `ProductsProvider` and `useProducts()` hook to fetch `/api/products` on load and handle loading/error states.

#### [MODIFY] [App.tsx](file:///mnt/vmstore/SquadGear_Web/frontend/src/App.tsx)
- Wrap application with `ProductsProvider`.

#### [MODIFY] [Layout.tsx](file:///mnt/vmstore/SquadGear_Web/frontend/src/components/layout/Layout.tsx)
- Gate `Outlet` content on `ProductsContext` loading and error states.

#### [MODIFY] [HomePage.tsx](file:///mnt/vmstore/SquadGear_Web/frontend/src/pages/Home/HomePage.tsx)
#### [MODIFY] [CatalogPage.tsx](file:///mnt/vmstore/SquadGear_Web/frontend/src/pages/Catalog/CatalogPage.tsx)
#### [MODIFY] [ProductPage.tsx](file:///mnt/vmstore/SquadGear_Web/frontend/src/pages/Catalog/ProductPage.tsx)
#### [MODIFY] [CheckoutPage.tsx](file:///mnt/vmstore/SquadGear_Web/frontend/src/pages/Checkout/CheckoutPage.tsx)
#### [MODIFY] [CartDrawer.tsx](file:///mnt/vmstore/SquadGear_Web/frontend/src/components/ui/CartDrawer.tsx)
- Replace static `PRODUCTS` imports with `useProducts()` hook.

#### [MODIFY] [mockData.ts](file:///mnt/vmstore/SquadGear_Web/frontend/src/data/mockData.ts)
- Remove static `PRODUCTS` array export, preserving `Product` TypeScript interface.

---

## Verification Plan

### Automated Tests
- `cd backend && .venv/bin/python -c "import main"`: Verify backend imports and model compilation without errors.
- `cd frontend && npx tsc -b && npm run build`: Verify TypeScript compilation and Vite production build.
- `cd frontend && npm run lint`: Ensure no linter regressions.

### Manual Verification
- Start backend server and verify `GET http://localhost:8000/api/products` returns 7 seeded products.
- Refresh frontend page (`http://localhost:5173`) and verify products load dynamically from the backend database.
