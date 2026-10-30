# State Management

#frontend #react #context

Application state is managed using React Context API providers:

---

## 🛍 `ProductsContext.tsx`
- **Data Loading**: Fetches live catalog products from `/api/products` (or `/api/products/preview` in dev mode).
- **Fallback**: Automatically falls back to `mockData.ts` if the FastAPI backend is offline.

---

## 🛒 `CartContext.tsx`
- Manages cart items, quantities, subtotal calculation, and open/close drawer states (`openDrawer`, `closeDrawer`).

---

## 🔐 `AuthContext.tsx`
- Manages user authentication tokens, active login sessions, and role permissions (`customer`, `business_client`, `internal_admin`).

---

## 🔗 Related Notes
- [[React Frontend Architecture]]
- [[API Reference]]
- [[Catalog Management Scripts]]
