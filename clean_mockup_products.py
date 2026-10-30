import os
import sys
import asyncio
from sqlalchemy.future import select

sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

import database
from models import Product

# List of valid Winter 26 product IDs
WINTER26_IDS = {
    "sqd-hd-blk-350", "sqd-hd-gry-350", "sqd-hd-nvy-350", "sqd-hd-olv-350", "sqd-hd-red-350",
    "sqd-ts-blk-350", "sqd-ts-nvy-350", "sqd-ts-stblk-350", "sqd-ts-mrn-350", "sqd-ts-olv-350",
    "sqd-tr-gdst-350", "sqd-tr-sqdst-350", "sqd-tr-blksg-350", "sqd-tr-nvyb-350", "sqd-tr-mrnst-350"
}

async def remove_mockups():
    async with database.AsyncSessionLocal() as session:
        result = await session.execute(select(Product))
        products = result.scalars().all()

        deleted_count = 0
        for p in products:
            if p.id not in WINTER26_IDS:
                await session.delete(p)
                deleted_count += 1

        await session.commit()
        print(f"Cleaned up database: Removed {deleted_count} mockup products. Only the 15 Winter '26 products remain!")

if __name__ == "__main__":
    asyncio.run(remove_mockups())
