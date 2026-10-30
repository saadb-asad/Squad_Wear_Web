# API Reference

#api #fastapi #endpoints

The backend exposes RESTful endpoints and WebSocket listeners built with FastAPI.

---

## 🛍 Product Catalog Endpoints

### `GET /api/products`
- **Description**: Returns all published catalog products for public storefront.
- **Rate Limit**: `60/minute`
- **Response**: List of published `Product` objects.

### `GET /api/products/preview`
- **Description**: Returns all products (including unpublished draft products).
- **Access**: Development & Admin preview mode (`?preview=true` or localhost).

---

## 🛒 Orders & Checkout Endpoints

### `POST /api/orders/checkout`
- **Description**: Submits shopping cart contents, calculates order totals on backend, and creates order record.
- **Payload**:
  ```json
  {
    "items": [
      { "productId": "sqd-hd-blk-350", "quantity": 1 }
    ],
    "shippingAddress": { ... }
  }
  ```

---

## ⚡ WebSocket Endpoints

### `WS /ws/admin/orders`
- **Description**: Real-time order fulfillment channel for internal admin dashboard.
- **Broadcast Events**: `order_placed`, `payment_received`, `sent_to_warehouse`.

---

## 🔗 Related Notes
- [[System Overview]]
- [[Database Schema]]
- [[State Management]]
