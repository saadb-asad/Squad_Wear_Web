import os
import shutil
import json
import asyncio

# Create public images directory
PUBLIC_IMG_DIR = os.path.join("frontend", "public", "products", "winter26")
os.makedirs(PUBLIC_IMG_DIR, exist_ok=True)

SOURCE_PICS = os.path.join("Winter 26", "Squad Wears Web Pics")

def copy_and_get_url(src_path, dest_filename):
    if not os.path.exists(src_path):
        print(f"Warning: Source image not found: {src_path}")
        return None
    dest_path = os.path.join(PUBLIC_IMG_DIR, dest_filename)
    shutil.copy2(src_path, dest_path)
    return f"/products/winter26/{dest_filename}"

# List of all 15 products in Winter 26 Drop
winter26_products = [
    # --- HOODIES (Rs 2,800) ---
    {
        "id": "sqd-hd-blk-350",
        "sku": "SQD-HD-BLK-350",
        "name": "Squad Black Hoodie",
        "subtitle": "Midnight Black / 350 GSM Cotton Fleece",
        "price": 2800.0,
        "originalPrice": None,
        "category": "Hoodies",
        "badge": "Winter '26 Drop",
        "description": "Premium 350 GSM heavyweight cotton fleece hoodie in Midnight Black. Features plush interior lining, drop-shoulder athletic cut, double-lined hood, and high-density Squad logo detailing.",
        "sizes": ["S", "M", "L", "XL"],
        "colors": [{"name": "Midnight Black", "hex": "#121212"}],
        "inventoryCount": 50,
        "front_src": os.path.join(SOURCE_PICS, "Squad Hoddies", "Black  SQD-HD-BLK-350", "Squad Black Hoddie Front.jpeg"),
        "back_src": os.path.join(SOURCE_PICS, "Squad Hoddies", "Black  SQD-HD-BLK-350", "Squad Black Hoddie Back.jpeg"),
    },
    {
        "id": "sqd-hd-gry-350",
        "sku": "SQD-HD-GRY-350",
        "name": "Squad Grey Hoodie",
        "subtitle": "Heather Grey / 350 GSM Cotton Fleece",
        "price": 2800.0,
        "originalPrice": None,
        "category": "Hoodies",
        "badge": "Winter '26 Drop",
        "description": "Signature 350 GSM heavyweight cotton fleece hoodie in Heather Grey. Engineered with ribbed cuffs, deep front kangaroo pocket, and breathable warmth for cold weather.",
        "sizes": ["S", "M", "L", "XL"],
        "colors": [{"name": "Heather Grey", "hex": "#8e8e8e"}],
        "inventoryCount": 50,
        "front_src": os.path.join(SOURCE_PICS, "Squad Hoddies", "Grey SQD-HD-GRY-350", "Squad Grey Hoodie Front.jpeg"),
        "back_src": os.path.join(SOURCE_PICS, "Squad Hoddies", "Grey SQD-HD-GRY-350", "Squad Grey Hoodie Back.jpeg"),
    },
    {
        "id": "sqd-hd-nvy-350",
        "sku": "SQD-HD-NVY-350",
        "name": "Squad Navy Hoodie",
        "subtitle": "Deep Navy / 350 GSM Cotton Fleece",
        "price": 2800.0,
        "originalPrice": None,
        "category": "Hoodies",
        "badge": "Winter '26 Drop",
        "description": "Rich Deep Navy 350 GSM fleece hoodie built for street luxury and warmth. Crafted from ultra-soft cotton blend with reinforced stitching.",
        "sizes": ["S", "M", "L", "XL"],
        "colors": [{"name": "Deep Navy", "hex": "#1b263b"}],
        "inventoryCount": 50,
        "front_src": os.path.join(SOURCE_PICS, "Squad Hoddies", "Navy  SQD-HD-NVY-350", "Squad Navy Hoddie Front.jpeg"),
        "back_src": os.path.join(SOURCE_PICS, "Squad Hoddies", "Navy  SQD-HD-NVY-350", "Squad Navy Hoddie Back.jpeg"),
    },
    {
        "id": "sqd-hd-olv-350",
        "sku": "SQD-HD-OLV-350",
        "name": "Squad Olive Hoodie",
        "subtitle": "Tactical Olive / 350 GSM Cotton Fleece",
        "price": 2800.0,
        "originalPrice": None,
        "category": "Hoodies",
        "badge": "Winter '26 Drop",
        "description": "Tactical Olive green 350 GSM cotton fleece hoodie. Perfect balance of streetwear aesthetic and heavy cold protection.",
        "sizes": ["S", "M", "L", "XL"],
        "colors": [{"name": "Tactical Olive", "hex": "#4b5320"}],
        "inventoryCount": 50,
        "front_src": os.path.join(SOURCE_PICS, "Squad Hoddies", "Olive  SQD-HD-OLV-350", "Squad Olive Hoddie Front.jpeg"),
        "back_src": os.path.join(SOURCE_PICS, "Squad Hoddies", "Olive  SQD-HD-OLV-350", "Squad Olive Hoddie Back.jpeg"),
    },
    {
        "id": "sqd-hd-red-350",
        "sku": "SQD-HD-RED-350",
        "name": "Squad Red Hoodie",
        "subtitle": "Crimson Red / 350 GSM Cotton Fleece",
        "price": 2800.0,
        "originalPrice": None,
        "category": "Hoodies",
        "badge": "Winter '26 Drop",
        "description": "Bold Crimson Red 350 GSM fleece hoodie. Stand out with vibrant color fastness, drop shoulder fit, and premium cotton feel.",
        "sizes": ["S", "M", "L", "XL"],
        "colors": [{"name": "Crimson Red", "hex": "#8b0000"}],
        "inventoryCount": 50,
        "front_src": os.path.join(SOURCE_PICS, "Squad Hoddies", "Red  SQD-HD-RED-350", "Squad Red Hoddie Front.png"),
        "back_src": os.path.join(SOURCE_PICS, "Squad Hoddies", "Red  SQD-HD-RED-350", "Squad Red Hoddie Back.jpeg"),
    },

    # --- TRACKSUITS (Rs 5,990) ---
    {
        "id": "sqd-ts-blk-350",
        "sku": "SQD-TS-BLK-350",
        "name": "Black Drop Tracksuit",
        "subtitle": "Full Set / 350 GSM Cotton Fleece",
        "price": 5990.0,
        "originalPrice": 7500.0,
        "category": "Tracksuits",
        "badge": "Winter '26 Drop",
        "description": "Complete 2-piece heavyweight 350 GSM fleece tracksuit set in Black Drop. Includes oversized hoodie and matching tapered fleece joggers with zip pockets.",
        "sizes": ["S", "M", "L", "XL"],
        "colors": [{"name": "Black Drop", "hex": "#121212"}],
        "inventoryCount": 45,
        "front_src": os.path.join(SOURCE_PICS, "Squad Track Suits", "black drop  SQD-TS-BLK-350", "Front.jpeg"),
        "back_src": os.path.join(SOURCE_PICS, "Squad Track Suits", "black drop  SQD-TS-BLK-350", "Back.jpeg"),
    },
    {
        "id": "sqd-ts-nvy-350",
        "sku": "SQD-TS-NVY-350",
        "name": "Navy Drop Tracksuit",
        "subtitle": "Full Set / 350 GSM Cotton Fleece",
        "price": 5990.0,
        "originalPrice": 7500.0,
        "category": "Tracksuits",
        "badge": "Winter '26 Drop",
        "description": "Deep Navy full 2-piece tracksuit crafted from 350 GSM high-grade cotton fleece. Features ergonomic waistband and precision branding.",
        "sizes": ["S", "M", "L", "XL"],
        "colors": [{"name": "Navy Drop", "hex": "#1b263b"}],
        "inventoryCount": 45,
        "front_src": os.path.join(SOURCE_PICS, "Squad Track Suits", "Navy drop  SQD-TS-NVY-350", "Front.jpeg"),
        "back_src": os.path.join(SOURCE_PICS, "Squad Track Suits", "Navy drop  SQD-TS-NVY-350", "Back.jpeg"),
    },
    {
        "id": "sqd-ts-stblk-350",
        "sku": "SQD-TS-STBLK-350",
        "name": "Strip Black Tracksuit",
        "subtitle": "Stripe Edition / 350 GSM Cotton Fleece",
        "price": 5990.0,
        "originalPrice": 7500.0,
        "category": "Tracksuits",
        "badge": "Winter '26 Drop",
        "description": "Urban Strip Black 2-piece fleece tracksuit featuring athletic side panel striping, 350 GSM heavyweight fleece, and custom hardware.",
        "sizes": ["S", "M", "L", "XL"],
        "colors": [{"name": "Strip Black", "hex": "#1c1c1c"}],
        "inventoryCount": 40,
        "front_src": os.path.join(SOURCE_PICS, "Squad Track Suits", "strip black tracksuit  SQD-TS-STBLK-350", "Front.jpeg"),
        "back_src": os.path.join(SOURCE_PICS, "Squad Track Suits", "strip black tracksuit  SQD-TS-STBLK-350", "Back.jpeg"),
    },
    {
        "id": "sqd-ts-mrn-350",
        "sku": "SQD-TS-MRN-350",
        "name": "Maroon Heritage Tracksuit",
        "subtitle": "Heritage Edition / 350 GSM Cotton Fleece",
        "price": 5990.0,
        "originalPrice": 7500.0,
        "category": "Tracksuits",
        "badge": "Winter '26 Drop",
        "description": "Rich Maroon Heritage 2-piece tracksuit. Built with 350 GSM cotton fleece for superior thermal insulation and distinct style.",
        "sizes": ["S", "M", "L", "XL"],
        "colors": [{"name": "Maroon Heritage", "hex": "#58111a"}],
        "inventoryCount": 40,
        "front_src": os.path.join(SOURCE_PICS, "Squad Track Suits", "maroon heritage  SQD-TS-MRN-350", "Front.png"),
        "back_src": os.path.join(SOURCE_PICS, "Squad Track Suits", "maroon heritage  SQD-TS-MRN-350", "Back View.jpeg"),
    },
    {
        "id": "sqd-ts-olv-350",
        "sku": "SQD-TS-OLV-350",
        "name": "Olive Riyasat Tracksuit",
        "subtitle": "Riyasat Edition / 350 GSM Cotton Fleece",
        "price": 5990.0,
        "originalPrice": 7500.0,
        "category": "Tracksuits",
        "badge": "Winter '26 Drop",
        "description": "Olive Riyasat edition full 2-piece tracksuit in 350 GSM brushed fleece. Tailored fit with deep side pockets and flexible stretch cuffs.",
        "sizes": ["S", "M", "L", "XL"],
        "colors": [{"name": "Olive Riyasat", "hex": "#3b4d29"}],
        "inventoryCount": 40,
        "front_src": os.path.join(SOURCE_PICS, "Squad Track Suits", "Olive riyasat  SQD-TS-OLV-350", "Front.jpeg"),
        "back_src": os.path.join(SOURCE_PICS, "Squad Track Suits", "Olive riyasat  SQD-TS-OLV-350", "Back.jpeg"),
    },

    # --- TROUSERS (Rs 2,700) ---
    {
        "id": "sqd-tr-gdst-350",
        "sku": "SQD-TR-GDST-350",
        "name": "Golden Strip Trouser",
        "subtitle": "Gold Detail / 350 GSM Cotton Fleece",
        "price": 2700.0,
        "originalPrice": 3300.0,
        "category": "Trousers",
        "badge": "Winter '26 Drop",
        "description": "Heavyweight 350 GSM fleece trousers featuring metallic Golden Strip side tape, elasticated drawcord waist, and deep zip pockets.",
        "sizes": ["S", "M", "L", "XL"],
        "colors": [{"name": "Black & Gold", "hex": "#121212"}],
        "inventoryCount": 60,
        "front_src": os.path.join(SOURCE_PICS, "Squad Trousers", "Golden Strip  SQD-TR-GDST-350.png"),
        "back_src": None,
    },
    {
        "id": "sqd-tr-sqdst-350",
        "sku": "SQD-TR-SQDST-350",
        "name": "Squad Strip Trouser",
        "subtitle": "Squad Tape / 350 GSM Cotton Fleece",
        "price": 2700.0,
        "originalPrice": 3300.0,
        "category": "Trousers",
        "badge": "Winter '26 Drop",
        "description": "Signature Squad Strip trousers in 350 GSM heavy fleece. Designed for comfort, durability, and modern urban styling.",
        "sizes": ["S", "M", "L", "XL"],
        "colors": [{"name": "Black", "hex": "#121212"}],
        "inventoryCount": 60,
        "front_src": os.path.join(SOURCE_PICS, "Squad Trousers", "Squad Strip  SQD-TR-SQDST-350.jpeg"),
        "back_src": None,
    },
    {
        "id": "sqd-tr-blksg-350",
        "sku": "SQD-TR-BLKSG-350",
        "name": "Black Signature Trouser",
        "subtitle": "Signature / 350 GSM Cotton Fleece",
        "price": 2700.0,
        "originalPrice": 3300.0,
        "category": "Trousers",
        "badge": "Winter '26 Drop",
        "description": "Minimalist Black Signature fleece trousers in 350 GSM plush cotton fleece. Clean cuff finish with subtle Squad emblem.",
        "sizes": ["S", "M", "L", "XL"],
        "colors": [{"name": "Black", "hex": "#121212"}],
        "inventoryCount": 60,
        "front_src": os.path.join(SOURCE_PICS, "Squad Trousers", "Black Signature  SQD-TR-BLKSG-350.jpeg"),
        "back_src": None,
    },
    {
        "id": "sqd-tr-nvyb-350",
        "sku": "SQD-TR-NVYB-350",
        "name": "Navy Blue Squad Trouser",
        "subtitle": "Navy Squad / 350 GSM Cotton Fleece",
        "price": 2700.0,
        "originalPrice": 3300.0,
        "category": "Trousers",
        "badge": "Winter '26 Drop",
        "description": "Deep Navy Blue fleece trousers crafted from 350 GSM cotton fleece with custom waistband drawstrings.",
        "sizes": ["S", "M", "L", "XL"],
        "colors": [{"name": "Navy Blue", "hex": "#1b263b"}],
        "inventoryCount": 60,
        "front_src": os.path.join(SOURCE_PICS, "Squad Trousers", "Navy Blue Squad  SQD-TR-NVYB-350.jpeg"),
        "back_src": None,
    },
    {
        "id": "sqd-tr-mrnst-350",
        "sku": "SQD-TR-MRNST-350",
        "name": "Maroon Strip Trouser",
        "subtitle": "Maroon Strip / 350 GSM Cotton Fleece",
        "price": 2700.0,
        "originalPrice": 3300.0,
        "category": "Trousers",
        "badge": "Winter '26 Drop",
        "description": "Maroon Strip fleece trousers engineered with 350 GSM cotton fleece and side accent striping.",
        "sizes": ["S", "M", "L", "XL"],
        "colors": [{"name": "Maroon", "hex": "#58111a"}],
        "inventoryCount": 60,
        "front_src": os.path.join(SOURCE_PICS, "Squad Trousers", "Maroon Strip  SQD-TR-MRNST-350.jpeg"),
        "back_src": None,
    },
]

# Process images and generate output JSON
processed_products = []
for p in winter26_products:
    sku = p["sku"]
    ext_front = os.path.splitext(p["front_src"])[1] if p["front_src"] else ".jpeg"
    front_url = copy_and_get_url(p["front_src"], f"{sku}_front{ext_front}") if p["front_src"] else "/logo.png"

    hover_url = None
    if p["back_src"]:
        ext_back = os.path.splitext(p["back_src"])[1]
        hover_url = copy_and_get_url(p["back_src"], f"{sku}_back{ext_back}")

    prod_entry = {
        "id": p["id"],
        "sku": p["sku"],
        "name": p["name"],
        "subtitle": p["subtitle"],
        "price": p["price"],
        "originalPrice": p["originalPrice"],
        "image": front_url,
        "hoverImage": hover_url,
        "badge": p["badge"],
        "description": p["description"],
        "sizes": p["sizes"],
        "colors": p["colors"],
        "category": p["category"],
        "inventoryCount": p["inventoryCount"]
    }
    processed_products.append(prod_entry)

# Write JSON
json_out_path = "winter26_products.json"
with open(json_out_path, "w") as f:
    json.dump(processed_products, f, indent=2)

print(f"Successfully processed {len(processed_products)} products and saved to {json_out_path}")
