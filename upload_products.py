import os
import json
import argparse
import asyncio
from sqlalchemy.future import select
from sqlalchemy import text
import uuid

# Adjust path to include backend
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

import database
from models import Product

async def bulk_upload_products(json_filepath: str, publish_immediately: bool = False):
    """
    Reads products from a JSON file and uploads them to the database.
    By default, products are uploaded as DRAFT (is_published=False) so they do NOT show on the live website.
    """
    if not os.path.exists(json_filepath):
        print(f"Error: File '{json_filepath}' not found.")
        return

    with open(json_filepath, 'r', encoding='utf-8') as f:
        products_data = json.load(f)

    if not isinstance(products_data, list):
        print("Error: JSON content must be a list of product objects.")
        return

    print(f"Loaded {len(products_data)} products from {json_filepath}.")
    print(f"Upload Mode: {'LIVE (Publish Immediately)' if publish_immediately else 'DRAFT (Staging/Hidden from public site)'}")

    # Initialize DB tables & add column if missing
    async with database.engine.begin() as conn:
        await conn.run_sync(database.Base.metadata.create_all)
        try:
            await conn.execute(text("ALTER TABLE products ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT TRUE"))
        except Exception:
            pass

    async with database.AsyncSessionLocal() as session:
        created_count = 0
        updated_count = 0

        for p_item in products_data:
            prod_id = p_item.get("id") or str(uuid.uuid4())
            sku = p_item.get("sku") or f"SQD-{prod_id.upper()[:8]}"

            result = await session.execute(select(Product).where((Product.id == prod_id) | (Product.sku == sku)))
            existing = result.scalar_one_or_none()

            if existing:
                existing.name = p_item.get("name", existing.name)
                existing.subtitle = p_item.get("subtitle", existing.subtitle)
                existing.price = p_item.get("price", existing.price)
                existing.original_price = p_item.get("originalPrice", p_item.get("original_price", existing.original_price))
                existing.image = p_item.get("image", existing.image)
                existing.hover_image = p_item.get("hoverImage", p_item.get("hover_image", existing.hover_image))
                existing.badge = p_item.get("badge", existing.badge)
                existing.description = p_item.get("description", existing.description)
                existing.sizes = p_item.get("sizes", existing.sizes)
                existing.colors = p_item.get("colors", existing.colors)
                existing.category = p_item.get("category", existing.category)
                existing.inventory_count = p_item.get("inventoryCount", p_item.get("inventory_count", existing.inventory_count))
                existing.is_published = publish_immediately
                updated_count += 1
            else:
                new_prod = Product(
                    id=prod_id,
                    sku=sku,
                    name=p_item["name"],
                    subtitle=p_item.get("subtitle"),
                    price=p_item["price"],
                    original_price=p_item.get("originalPrice", p_item.get("original_price")),
                    image=p_item["image"],
                    hover_image=p_item.get("hoverImage", p_item.get("hover_image")),
                    badge=p_item.get("badge"),
                    description=p_item.get("description", ""),
                    sizes=p_item.get("sizes", ["S", "M", "L", "XL"]),
                    colors=p_item.get("colors", []),
                    category=p_item.get("category", "General"),
                    inventory_count=p_item.get("inventoryCount", p_item.get("inventory_count", 10)),
                    is_published=publish_immediately
                )
                session.add(new_prod)
                created_count += 1

        await session.commit()
        print(f"Success! {created_count} products created, {updated_count} products updated.")
        if not publish_immediately:
            print("Note: All newly uploaded products are currently in DRAFT status.")
            print("To publish the entire catalog live to the website, run:")
            print("  python publish_catalog.py")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Upload products to database in Draft or Live mode.")
    parser.add_argument("json_file", help="Path to products JSON file")
    parser.add_argument("--publish", action="store_true", help="Publish products live immediately (default: False / Draft)")
    args = parser.parse_args()

    asyncio.run(bulk_upload_products(args.json_file, args.publish))
