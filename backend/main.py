from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
import asyncio
from datetime import datetime

app = FastAPI(title="SquadGear API")

# Allow CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Mock Data ---
MOCK_ORDERS = [
    {
        "id": "ORD-1001",
        "customerName": "Alice Smith",
        "totalAmount": 145.50,
        "status": "paid",
        "date": "2026-07-18T10:30:00Z",
        "items": [
            {"id": "1", "productName": "Neon Cyber Hoodie", "quantity": 1, "price": 95.00},
            {"id": "2", "productName": "Urban Tech Joggers", "quantity": 1, "price": 50.50}
        ]
    },
    {
        "id": "ORD-1002",
        "customerName": "Bob Johnson (B2B)",
        "totalAmount": 1200.00,
        "status": "pending",
        "date": "2026-07-18T11:15:00Z",
        "items": [
            {"id": "3", "productName": "Squad Basic Tee - Bulk", "quantity": 50, "price": 24.00}
        ]
    },
    {
        "id": "ORD-1003",
        "customerName": "Charlie Davis",
        "totalAmount": 85.00,
        "status": "processing",
        "date": "2026-07-17T15:45:00Z",
        "items": [
            {"id": "4", "productName": "Reflective Windbreaker", "quantity": 1, "price": 85.00}
        ]
    },
    {
        "id": "ORD-1004",
        "customerName": "Diana Prince",
        "totalAmount": 210.00,
        "status": "shipped",
        "date": "2026-07-16T09:20:00Z",
        "items": [
            {"id": "5", "productName": "Tactical Cargo Pants", "quantity": 2, "price": 105.00}
        ]
    }
]

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

# --- Endpoints ---
@app.get("/api/orders")
async def get_orders():
    return MOCK_ORDERS

@app.put("/api/orders/{order_id}/status")
async def update_order_status(order_id: str, status: str):
    for order in MOCK_ORDERS:
        if order["id"] == order_id:
            order["status"] = status
            # Broadcast the change via WebSockets
            await manager.broadcast({
                "type": "ORDER_UPDATED",
                "order_id": order_id,
                "status": status,
                "timestamp": datetime.utcnow().isoformat()
            })
            return order
    return {"error": "Order not found"}

@app.websocket("/ws/admin")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # We can process incoming messages here if needed
    except WebSocketDisconnect:
        manager.disconnect(websocket)
