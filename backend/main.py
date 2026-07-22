from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
import asyncio
import os
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

from database import AsyncSessionLocal

@app.on_event("startup")
async def startup_event():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).where(User.email == "admin@squadwear.com"))
        admin = result.scalar_one_or_none()
        if not admin:
            admin = User(
                email="admin@squadwear.com",
                password_hash=get_password_hash("admin123"),
                account_type="internal_admin",
                first_name="Admin",
                company_name="Squad Wear"
            )
            session.add(admin)
            await session.commit()

# --- Endpoints ---

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
