import os
import sys
import asyncio
from sqlalchemy.future import select
from sqlalchemy import text

# Adjust path to include backend
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

import database
from models import Product

async def publish_all_drafts():
    """
    Publishes all draft products to make them visible on the live website simultaneously.
    """
    async with database.engine.begin() as conn:
        await conn.run_sync(database.Base.metadata.create_all)
        try:
            await conn.execute(text("ALTER TABLE products ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT TRUE"))
        except Exception:
            pass

    async with database.AsyncSessionLocal() as session:
        result = await session.execute(select(Product).where(Product.is_published == False))
        drafts = result.scalars().all()
        count = len(drafts)

        if count == 0:
            print("No draft products found. All products are already live on the website!")
            return

        for p in drafts:
            p.is_published = True

        await session.commit()
        print(f"🎉 SUCCESS! {count} draft products are now LIVE on the website!")

if __name__ == "__main__":
    asyncio.run(publish_all_drafts())
