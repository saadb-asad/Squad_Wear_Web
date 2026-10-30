import os
import sys
import json
import asyncio
from sqlalchemy.future import select

sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

import database
from models import Product

# 1. Update winter26_products.json
json_path = "winter26_products.json"
if os.path.exists(json_path):
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    for p in data:
        p["originalPrice"] = None
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    print("Updated winter26_products.json: Set all originalPrice fields to null.")

# 2. Update Database records
async def remove_db_sales():
    async with database.AsyncSessionLocal() as session:
        result = await session.execute(select(Product))
        products = result.scalars().all()
        for p in products:
            p.original_price = None
        await session.commit()
        print(f"Updated Database: Removed sale / original_price from {len(products)} products.")

if __name__ == "__main__":
    asyncio.run(remove_db_sales())
