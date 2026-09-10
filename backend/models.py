import uuid
from sqlalchemy import Column, String, Numeric, Integer, ForeignKey, Text, DateTime, CheckConstraint, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    account_type = Column(String, nullable=False) # Enum: customer, business_client, internal_admin
    first_name = Column(String, nullable=False)
    company_name = Column(String, nullable=True)
    otp_code = Column(String, nullable=True)
    otp_expires_at = Column(DateTime, nullable=True)
    
    orders = relationship("Order", back_populates="user")

class Product(Base):
    __tablename__ = "products"
    id = Column(String, primary_key=True, default=generate_uuid)
    sku = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    subtitle = Column(String, nullable=True)
    price = Column(Numeric(10, 2), nullable=False)
    original_price = Column(Numeric(10, 2), nullable=True)
    image = Column(String, nullable=False)
    hover_image = Column(String, nullable=True)
    badge = Column(String, nullable=True)
    description = Column(Text, nullable=False)
    sizes = Column(JSON, nullable=False, default=list)
    colors = Column(JSON, nullable=False, default=list)
    inventory_count = Column(Integer, CheckConstraint('inventory_count >= 0'), nullable=False, default=0)
    category = Column(String, nullable=False)

class Order(Base):
    __tablename__ = "orders"
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)
    status = Column(String, nullable=False, default="pending")
    payment_intent_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")
    events = relationship("OrderEvent", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(String, primary_key=True, default=generate_uuid)
    order_id = Column(String, ForeignKey("orders.id"), nullable=False)
    product_id = Column(String, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, CheckConstraint('quantity > 0'), nullable=False)
    price_at_purchase = Column(Numeric(10, 2), nullable=False)
    
    order = relationship("Order", back_populates="items")
    product = relationship("Product")

class OrderEvent(Base):
    __tablename__ = "order_events"
    id = Column(String, primary_key=True, default=generate_uuid)
    order_id = Column(String, ForeignKey("orders.id"), nullable=False)
    event_status = Column(String, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    order = relationship("Order", back_populates="events")

class BusinessInquiry(Base):
    __tablename__ = "business_inquiries"
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String, nullable=False, default="unread")
