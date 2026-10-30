# Database Schema

#database #postgresql #sqlite #orm

The Squad Wear database is designed with ACID compliance, utilizing SQLAlchemy async ORM models supporting both **PostgreSQL** in production and **SQLite (`squadgear.db`)** as an automatic local development fallback.

---

## 📊 Entity Relationship Diagram

```mermaid
erDiagram
    USERS {
        uuid id PK
        string email UK
        string password_hash
        string account_type "Enum: customer, business_client, internal_admin"
        string first_name
        string company_name
    }

    PRODUCTS {
        uuid id PK
        string sku UK
        string name
        string subtitle
        decimal price
        decimal original_price
        int inventory_count
        string category
        boolean is_published
        int display_order
    }

    ORDERS {
        uuid id PK
        uuid user_id FK
        decimal total_amount
        string status "Enum: pending, paid, in_warehouse, in_transit, delivered"
        string payment_intent_id
    }

    ORDER_ITEMS {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        int quantity
        decimal price_at_purchase
    }

    ORDER_EVENTS {
        uuid id PK
        uuid order_id FK
        string event_status
        text notes
        timestamp created_at
    }

    USERS ||--o{ ORDERS : "places"
    ORDERS ||--|{ ORDER_ITEMS : "contains"
    PRODUCTS ||--o{ ORDER_ITEMS : "included_in"
    ORDERS ||--o{ ORDER_EVENTS : "tracks_history"
```

---

## ⚙️ Core Models (`backend/models.py`)

### `Product` Model
- `id`: Primary key string / UUID
- `sku`: Unique inventory SKU identifier (e.g., `SQD-HD-BLK-350`)
- `name`: Product display name
- `subtitle`: Fabric details (e.g., `Midnight Black / 350 GSM Cotton Fleece`)
- `price`: Numeric retail price
- `category`: Category group (`Tracksuits`, `Hoodies`, `Trousers`)
- `is_published`: Boolean controlling live catalog visibility
- `display_order`: Custom sorting index for catalog placement

---

## 🔗 Related Notes
- [[System Overview]]
- [[FastAPI Backend & DB Pipeline]]
- [[Catalog Management Scripts]]
