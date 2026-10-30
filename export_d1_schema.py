import json
import os

schema_sql = """-- Squad Wear Cloudflare D1 Database Schema
-- Compatible with Cloudflare D1 Serverless SQL Engine

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    account_type TEXT NOT NULL DEFAULT 'customer',
    first_name TEXT,
    company_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    price REAL NOT NULL,
    original_price REAL,
    image TEXT NOT NULL,
    hover_image TEXT,
    badge TEXT,
    inventory_count INTEGER NOT NULL DEFAULT 50,
    category TEXT NOT NULL,
    sizes_json TEXT NOT NULL DEFAULT '["S","M","L","XL"]',
    colors_json TEXT NOT NULL DEFAULT '[]',
    is_published INTEGER NOT NULL DEFAULT 1,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    customer_email TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    shipping_address_json TEXT NOT NULL,
    total_amount REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    payment_method TEXT NOT NULL DEFAULT 'cod',
    payment_intent_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_purchase REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS order_events (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    event_status TEXT NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);
"""

def clean_str(val):
    if val is None:
        return ""
    return str(val).replace("'", "''")

def generate_seed_sql(json_path, output_sql_path):
    with open(json_path, 'r', encoding='utf-8') as f:
        products = json.load(f)

    statements = ["-- Seed Data for Cloudflare D1 Products\n"]
    for idx, p in enumerate(products):
        p_id = p.get('id', f'sqd-p-{idx+1}')
        sku = p.get('sku', f'SQD-SKU-{idx+1}')
        name = clean_str(p.get('name'))
        subtitle = clean_str(p.get('subtitle'))
        description = clean_str(p.get('description'))
        price = p.get('price', 0.0)
        orig_price = p.get('originalPrice')
        orig_price_val = "NULL" if orig_price is None else str(orig_price)
        image = clean_str(p.get('image'))
        hover_image = clean_str(p.get('hoverImage'))
        badge = clean_str(p.get('badge'))
        inventory = p.get('inventoryCount', 50)
        category = clean_str(p.get('category'))
        sizes_json = clean_str(json.dumps(p.get('sizes', ["S", "M", "L", "XL"])))
        colors_json = clean_str(json.dumps(p.get('colors', [])))
        is_published = 1 if p.get('isPublished', True) else 0

        sql = (
            f"INSERT OR REPLACE INTO products "
            f"(id, sku, name, subtitle, description, price, original_price, image, hover_image, badge, inventory_count, category, sizes_json, colors_json, is_published, display_order) "
            f"VALUES ('{p_id}', '{sku}', '{name}', '{subtitle}', '{description}', {price}, {orig_price_val}, '{image}', '{hover_image}', '{badge}', {inventory}, '{category}', '{sizes_json}', '{colors_json}', {is_published}, {idx});"
        )
        statements.append(sql)

    with open(output_sql_path, 'w', encoding='utf-8') as out:
        out.write("\n".join(statements))

    print(f"Generated {len(products)} SQL seed statements in {output_sql_path}")

def main():
    os.makedirs('cloudflare_migration', exist_ok=True)
    schema_path = 'cloudflare_migration/schema_d1.sql'
    seed_path = 'cloudflare_migration/seed_products_d1.sql'

    with open(schema_path, 'w', encoding='utf-8') as f:
        f.write(schema_sql)
    print(f"Wrote D1 Schema DDL to {schema_path}")

    generate_seed_sql('winter26_products.json', seed_path)

if __name__ == '__main__':
    main()
