import os
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"), override=True)
load_dotenv(override=True)

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
import asyncio
import random
import string
from datetime import datetime, timedelta
import resend

resend.api_key = os.getenv("RESEND_API_KEY")
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from database import get_db, limiter
from models import Order, OrderItem, User, Product
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from fastapi import Response, Form, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm

from auth import (
    UserCreate, Token, UserResponse, OTPVerify,
    verify_password, get_password_hash, create_access_token, get_current_user,
    get_current_internal_admin
)

from payfast_utils import generate_signature, validate_itn, PAYFAST_MERCHANT_ID, PAYFAST_MERCHANT_KEY, PAYFAST_URL

app = FastAPI(title="SquadWear API")

# Rate Limiting Setup
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Allow CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- WebSocket Manager ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: Dict[str, Any]):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                pass

manager = ConnectionManager()

import database
from database import Base, use_sqlite_fallback

SEED_PRODUCTS = [
    {
        "id": "apex-tech-hoodie", "sku": "SQD-APEX-TECH-HOODIE",
        "name": "Apex Tech Hoodie", "subtitle": "Industrial Grey / Heavyweight",
        "price": 120.00, "original_price": None,
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBA8aYq6haC7i626RBAxGikRimxUIaCXW3sWd1UnyxtN_m2xiVcx8Is2fqlh-hlyJtRktD3Ob-g-R-Vpo8wvVax4TP9tcVuI9RNRQ1ys8k3i0imLsdPNfQkakzfznNpHlv33usRvykg2QhQK7EXd-6QiaWF6JUglpeNVk7q0QpQRLHeCTvkOd390S7-rxKiQdqOWboaAwMoBzUgtvFiy-xJTDcmAQ5qCR9Tf593FpCzW_uNnHqJs3kP8Q3VzTyQX-aWbawGDqA8P89g",
        "hover_image": "https://lh3.googleusercontent.com/aida-public/AB6AXuB7RVti_D9Ep15yDLDJkNUIeP4Gf6RDf9_ZZtTSUafk1xNSP64P35KRtO4Z7u5BxtI1k1a0QvhUW61iylcTRLCL6QFg1P3rv8vBZzMsz6yXnD1KvM3l5NhddE-NzfVVKI-GvO6cV96v0vbIehRHx1QanpK-pFJPziOYfZVNcn8sRJgasKZSxLpaxG8bFiqnpMxSF1mvdkU-2eaRx5U8BYsh4NyzGWFxpYZR-kievm4CNYMJvIKlPoiuIagRaEuw923-GgT54YbA6x-V",
        "badge": "New Drop",
        "description": "Engineered for the modern urban landscape. Our Apex Tech Hoodie features a bespoke cross-weave fleece, designed to hold its architectural shape while providing unparalleled comfort. Finished with precision-engineered hardware.",
        "sizes": ["S", "M", "L", "XL"],
        "colors": [
            {"name": "Stealth Grey", "hex": "#3d3d3d"},
            {"name": "Midnight Black", "hex": "#1a1a1a"},
            {"name": "Industrial Grey", "hex": "#e5e5e5"},
        ],
        "inventory_count": 25, "category": "Hoodies", "display_order": 0,
    },
    {
        "id": "stealth-cargo-jogger", "sku": "SQD-STEALTH-CARGO-JOGGER",
        "name": "Stealth Cargo Trousers", "subtitle": "Midnight Black / Ripstop",
        "price": 95.00, "original_price": None,
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuA-zGPVr8F43eZRbcgSLtL0A2cJduWP1zwq-G4IwMqnAXza-xleI70RSqL0P6pTiogXW1zJ-ta3PLQuqwnf3TznSdAlaez6WUUEv9EsQwDFleDpLJdn5DOM1pKeHHAuUn5EK8SY0Rq4wXpGEGgtX0IABus1Y6bLqMkLJHOhscJCbrVQGeG3mKLtI81Ff30v6oIkWEkUmy1fHYhtQN9-E_zeUOTQxZfrrDrGir7JgtaXfVputTsHL50suK_x7RZ0E2ezV5tDc72KkwsH",
        "hover_image": None,
        "badge": None,
        "description": "Modern tactical trousers in matte black, featuring reinforced knee panels and multiple functional cargo pockets with teal zipper pulls.",
        "sizes": ["30", "32", "34", "36"],
        "colors": [{"name": "Midnight Black", "hex": "#1a1a1a"}],
        "inventory_count": 25, "category": "Trousers", "display_order": 1,
    },
    {
        "id": "vector-core-tee", "sku": "SQD-VECTOR-CORE-TEE",
        "name": "Vector Tech Tracksuit", "subtitle": "Optic White / Full Set",
        "price": 145.00, "original_price": 180.00,
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuChhhWwdFkw6JeM2lQj7uHd6zHCbDlUBxlCHp2VyinovZaxAdFiIOQjYcQ0VRSRs3ANk0Un63yF84Br9sFSwh0cEsLRrewGXzQUrOZGcCHVj_mhZhj5DSTtl2q4-IDHyMU9LdI92W_VbxgiJCTMQBjv1o5FCcmnaXzE-lrO0l4c69qR_TU0M_0cleQt3Bi9V0qb9Q84fW64ubOe8SFzegttyD_EhhH3kkCWjY2wwqU7LKsXX_iXqUtDgx3aUJgVng3MWLpdkmp_hSWC",
        "hover_image": None,
        "badge": None,
        "description": "A premium technical tracksuit in optic white and charcoal, featuring an oversized track jacket and matching tapered track pants.",
        "sizes": ["S", "M", "L", "XL"],
        "colors": [{"name": "Optic White", "hex": "#ffffff"}],
        "inventory_count": 25, "category": "Full Track Suits", "display_order": 2,
    },
    {
        "id": "storm-shell-v2", "sku": "SQD-STORM-SHELL-V2",
        "name": "Storm Shell Tracksuit", "subtitle": "Forest Teal / Waterproof Set",
        "price": 210.00, "original_price": None,
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCeFU7BfWYTIq4feA0tS37_M_Fj_jU8r3lUwEAK36s2pZ78EOvUs8xqyyCS1epz-1MyFZ2gDDEkSDOKizsV7lDE6rHgufMzAuOoKQJZAutCy6aHF2Qkly1Y7Ok6smNsY6WgZVsnnepBwggXiq3aIpm3rLe_DeAwB_6TenruHOAnZbcs8G1wUEACw0k-FtfdZeiYlIXc0G4KgmeTdcd5WTrIfFFPpOHM5-36gX8EbTu28B-hMTukKt8CN3V7ThVck9eNL6iSnKOXwLL3",
        "hover_image": None,
        "badge": None,
        "description": "A futuristic technical tracksuit set in muted forest teal, featuring waterproof zip jacket and articulated track pants.",
        "sizes": ["S", "M", "L", "XL"],
        "colors": [{"name": "Forest Teal", "hex": "#0a4242"}],
        "inventory_count": 25, "category": "Full Track Suits", "display_order": 3,
    },
    {
        "id": "kinetix-hi-top", "sku": "SQD-KINETIX-HI-TOP",
        "name": "Kinetix Tech Trousers", "subtitle": "Stone Grey / Modular",
        "price": 115.00, "original_price": None,
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCs_tF23I_0G3NubpwVqPOSk1R2dOESOUs5jtPsrNGxC0Q4e8RwUYtAfDmJJeEVsviJEjvj8coq_Rphsiij9BpHClf5suKO81IGbSPYK3hCSdr8DPTAF9H-w5zEJaWJKOyITQjASdFZNbMZu0F36J7qF5wmEdQ5Ecm6JGoaAkUbh9OeqDBBLGIVgioolldL3otPrMY7T0JR6So_i65k2WlD7Ef52mRGBAYS9wHCnaKdU17UnKfgcqlw_peDZPAkqcwxkznkzawquk16",
        "hover_image": None,
        "badge": None,
        "description": "Multi-pocket modular techwear trousers in stone grey with adjustable ankle cuffs and articulated knees.",
        "sizes": ["30", "32", "34", "36"],
        "colors": [{"name": "Stone Grey", "hex": "#8c8c8c"}],
        "inventory_count": 25, "category": "Trousers", "display_order": 4,
    },
    {
        "id": "signal-sling-bag", "sku": "SQD-SIGNAL-SLING-BAG",
        "name": "Signal Stealth Tracksuit", "subtitle": "Carbon Black / Weatherproof Set",
        "price": 165.00, "original_price": None,
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuANW-fMLouqfrFpOy2qJROnDWOAl7x25XjxkDTGdkGw9SZpMmnLvB9XykTPfLjaOMqRykuAkOWNJpaDSHD0-oSI_Yi1MToGbxL0BLtIFaLv76PSheDhwA86lul4SIEj_q2CIULbttSvQkA0myxY02ilQIQDMH3LIFboUoN_HgYoBd8CURraAq4xPP3cPR-UFDCsuXaU7XOuQ5_6q-tN5waIgRS4xBhjR66h_h7LPy-CzuIAVQFd1Eq8r6fUtPQ_XAwRjbMOTdqHmrwQ",
        "hover_image": None,
        "badge": None,
        "description": "A sleek carbon black technical tracksuit with weather-resistant panels and ergonomic fit.",
        "sizes": ["S", "M", "L", "XL"],
        "colors": [{"name": "Carbon Black", "hex": "#111111"}],
        "inventory_count": 0, "category": "Full Track Suits", "display_order": 5,
    },
    {
        "id": "core-heavyweight-hoodie", "sku": "SQD-CORE-HEAVYWEIGHT-HOODIE",
        "name": "Core Heavyweight Hoodie", "subtitle": "Industrial Grey / Heavyweight",
        "price": 145.00, "original_price": None,
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuDOShzYyebbEZcW7zMY2IdXnt2mN4bluylu_e_4BLg6zrYumO2u5enwq8-mQGjZPuLLgshq1TloNlmV_Be1yZ_4qXoMJm4KM8isxAHIyeelQ7dWth6SLFoBhj3fN7nSM4PTfyaTnRJm8GDtH8lCKqXRIwPQHI4XN8vgNBYEoxT1PwEKeeM0rzBbRFfbYBGeeYSivJHGsljp4A161E5-SnnC6WQZjQn_yaW0pp1VdYELKDL4AHaNzsIEyeZ4M7U5m1--DiCO5WSKebb_",
        "hover_image": None,
        "badge": "COLLECTION 01 / ESSENTIALS",
        "description": "Engineered for the modern urban landscape. Our Core Heavyweight Hoodie features a bespoke 500GSM cross-weave fleece, designed to hold its architectural shape while providing unparalleled comfort. Finished with precision-engineered hardware.",
        "sizes": ["S", "M", "L", "XL"],
        "colors": [
            {"name": "Stealth Grey", "hex": "#3d3d3d"},
            {"name": "Midnight Black", "hex": "#1a1a1a"},
            {"name": "Industrial Grey", "hex": "#e5e5e5"},
        ],
        "inventory_count": 25, "category": "Hoodies", "display_order": 6,
    },
]

@app.on_event("startup")
async def startup_event():
    try:
        async with database.engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    except Exception as e:
        print(f"Warning: Primary database connection failed ({e}), switching to SQLite fallback...")
        use_sqlite_fallback()
        async with database.engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    async with database.AsyncSessionLocal() as session:
        result = await session.execute(select(User).where(User.email == "admin@squadattire.com"))
        admin = result.scalar_one_or_none()
        if not admin:
            admin = User(
                email="admin@squadattire.com",
                password_hash=get_password_hash("admin123"),
                account_type="internal_admin",
                first_name="Admin",
                company_name="Squad Attire"
            )
            session.add(admin)
            await session.commit()

        existing_products = (await session.execute(select(Product))).scalars().all()
        if not existing_products:
            for p in SEED_PRODUCTS:
                session.add(Product(**p))
            await session.commit()
        else:
            seed_map = {p["id"]: p for p in SEED_PRODUCTS}
            for prod in existing_products:
                if prod.id in seed_map:
                    s_item = seed_map[prod.id]
                    prod.category = s_item["category"]
                    prod.name = s_item["name"]
                    prod.subtitle = s_item["subtitle"]
                    prod.description = s_item["description"]
                    prod.price = s_item["price"]
            await session.commit()

# --- Endpoints ---

@app.get("/api/products")
@limiter.limit("60/minute")
async def get_products(request: Request, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).order_by(Product.name))
    products = result.scalars().all()
    return [
        {
            "id": p.id,
            "name": p.name,
            "subtitle": p.subtitle,
            "price": float(p.price),
            "originalPrice": float(p.original_price) if p.original_price is not None else None,
            "image": p.image,
            "hoverImage": p.hover_image,
            "badge": p.badge,
            "soldOut": p.inventory_count <= 0,
            "description": p.description,
            "sizes": p.sizes,
            "colors": p.colors,
            "category": p.category,
        }
        for p in products
    ]

@app.post("/api/auth/register", response_model=UserResponse)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        password_hash=hashed_password,
        account_type="customer", # default type
        first_name=user.first_name,
        company_name=user.company_name
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

@app.post("/api/auth/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalar_one_or_none()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    otp = ''.join(random.choices(string.digits, k=6))
    user.otp_code = otp
    user.otp_expires_at = datetime.utcnow() + timedelta(minutes=10)
    await db.commit()
    
    if resend.api_key:
        try:
            await resend.Emails.send_async({
                "from": "SquadWear Support <support@squadattire.com>",
                "to": user.email,
                "subject": "Your SquadWear Login OTP",
                "html": f"<p>Your login code is: <strong>{otp}</strong></p><p>This code expires in 10 minutes.</p>"
            })
            print(f"Sent OTP email to {user.email}")
        except Exception as e:
            print(f"Failed to send OTP email: {e}")
            print(f"\n{'='*40}\nOTP FOR {user.email}: {otp}\n{'='*40}\n")
    else:
        print(f"\n{'='*40}\nOTP FOR {user.email}: {otp}\n{'='*40}\n")
    
    return {"require_otp": True, "email": user.email}

@app.post("/api/auth/verify-otp", response_model=Token)
async def verify_otp(otp_data: OTPVerify, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == otp_data.email))
    user = result.scalar_one_or_none()
    
    if not user or not user.otp_code:
        raise HTTPException(status_code=400, detail="Invalid OTP or user")
        
    if user.otp_code != otp_data.otp_code:
        raise HTTPException(status_code=400, detail="Incorrect OTP")
        
    if not user.otp_expires_at or datetime.utcnow() > user.otp_expires_at:
        raise HTTPException(status_code=400, detail="OTP has expired")
        
    # Valid OTP
    user.otp_code = None
    user.otp_expires_at = None
    await db.commit()
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.get("/api/products")
@limiter.limit("60/minute")
async def get_products(request: Request, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).order_by(Product.display_order))
    products = result.scalars().all()
    return [
        {
            "id": p.id,
            "name": p.name,
            "subtitle": p.subtitle,
            "price": float(p.price),
            "originalPrice": float(p.original_price) if p.original_price is not None else None,
            "image": p.image,
            "hoverImage": p.hover_image,
            "badge": p.badge,
            "soldOut": p.inventory_count <= 0,
            "description": p.description,
            "sizes": p.sizes,
            "colors": p.colors,
            "category": p.category,
        }
        for p in products
    ]

from pydantic import BaseModel
class UserUpdate(BaseModel):
    first_name: str
    company_name: str | None = None

@app.put("/api/auth/me", response_model=UserResponse)
async def update_users_me(user_update: UserUpdate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    current_user.first_name = user_update.first_name
    current_user.company_name = user_update.company_name
    await db.commit()
    await db.refresh(current_user)
    return current_user

@app.delete("/api/auth/me")
async def delete_users_me(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # Delete associated orders and order items first to satisfy foreign key constraints
    result = await db.execute(select(Order).where(Order.user_id == current_user.id))
    orders = result.scalars().all()
    for order in orders:
        await db.execute(OrderItem.__table__.delete().where(OrderItem.order_id == order.id))
        await db.execute(Order.__table__.delete().where(Order.id == order.id))
    
    await db.delete(current_user)
    await db.commit()
    return {"message": "User deleted successfully"}

@app.get("/api/orders")
@limiter.limit("20/minute")
async def get_orders(request: Request, current_user: User = Depends(get_current_internal_admin), db: AsyncSession = Depends(get_db)):
    # Fetch orders from database with related users and items
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.user))
        .options(selectinload(Order.items).selectinload(OrderItem.product))
        .order_by(Order.created_at.desc())
    )
    db_orders = result.scalars().all()
    
    # Format to match the frontend expectations
    formatted_orders = []
    for order in db_orders:
        formatted_orders.append({
            "id": order.id,
            "customerName": f"{order.user.first_name} {order.user.company_name or ''}".strip() if order.user else "Unknown",
            "totalAmount": float(order.total_amount),
            "status": order.status,
            "date": order.created_at.isoformat() + "Z",
            "items": [
                {
                    "id": item.id,
                    "productName": item.product.name if item.product else "Unknown Product",
                    "quantity": item.quantity,
                    "price": float(item.price_at_purchase)
                } for item in order.items
            ]
        })
    return formatted_orders

@app.get("/api/orders/me")
@limiter.limit("20/minute")
async def get_my_orders(request: Request, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Order)
        .where(Order.user_id == current_user.id)
        .options(selectinload(Order.items).selectinload(OrderItem.product))
        .order_by(Order.created_at.desc())
    )
    db_orders = result.scalars().all()
    
    formatted_orders = []
    for order in db_orders:
        formatted_orders.append({
            "id": order.id,
            "totalAmount": float(order.total_amount),
            "status": order.status,
            "date": order.created_at.isoformat() + "Z",
            "items": [
                {
                    "id": item.id,
                    "productName": item.product.name if item.product else "Unknown Product",
                    "quantity": item.quantity,
                    "price": float(item.price_at_purchase)
                } for item in order.items
            ]
        })
    return formatted_orders

@app.put("/api/orders/{order_id}/status")
@limiter.limit("10/minute")
async def update_order_status(request: Request, order_id: str, status: str, current_user: User = Depends(get_current_internal_admin), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    
    if not order:
        return {"error": "Order not found"}
        
    order.status = status
    await db.commit()
    
    # Broadcast the change via WebSockets
    await manager.broadcast({
        "type": "ORDER_UPDATED",
        "order_id": order_id,
        "status": status,
        "timestamp": datetime.utcnow().isoformat()
    })
    
    return {"id": order.id, "status": order.status}

@app.websocket("/ws/admin")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.post("/api/checkout")
@limiter.limit("5/minute")
async def create_checkout(request: Request, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # This is a simplified checkout. In reality, you'd receive cart items in the request body.
    # We will use the authenticated user instead of a dummy user.
    user = current_user

    order = Order(user_id=user.id, total_amount=150.00, status="pending")
    db.add(order)
    await db.commit()
    await db.refresh(order)

    # Generate Payfast form data
    # Note: notify_url must be publicly accessible (e.g., via ngrok) for Payfast to send the ITN
    payfast_data = {
        "merchant_id": PAYFAST_MERCHANT_ID,
        "merchant_key": PAYFAST_MERCHANT_KEY,
        "return_url": "http://localhost:5173/payment-success",
        "cancel_url": "http://localhost:5173/payment-cancelled",
        "notify_url": "https://tricky-zebras-clap.loca.lt/api/payfast/itn",
        "name_first": user.first_name,
        "email_address": user.email,
        "m_payment_id": order.id,
        "amount": f"{order.total_amount:.2f}",
        "item_name": "SquadWear Order",
    }
    
    signature = generate_signature(payfast_data)
    payfast_data["signature"] = signature
    
    return {"payfast_url": PAYFAST_URL, "payment_data": payfast_data}

@app.post("/api/payfast/itn")
async def payfast_itn(request: Request, db: AsyncSession = Depends(get_db)):
    form_data = await request.form()
    data_dict = dict(form_data)
    
    client_host = request.client.host if request.client else ""
    
    is_valid = await validate_itn(data_dict, client_host)
    if not is_valid:
        return Response(status_code=400, content="Invalid ITN")
        
    order_id = data_dict.get("m_payment_id")
    payment_status = data_dict.get("payment_status")
    
    if order_id and payment_status == "COMPLETE":
        result = await db.execute(select(Order).where(Order.id == order_id))
        order = result.scalar_one_or_none()
        if order:
            order.status = "paid"
            await db.commit()
            
            # Broadcast the change via WebSockets
            await manager.broadcast({
                "type": "ORDER_UPDATED",
                "order_id": order.id,
                "status": "paid",
                "timestamp": datetime.utcnow().isoformat()
            })
            
    return Response(status_code=200, content="OK")
