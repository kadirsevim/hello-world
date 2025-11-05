from fastapi import APIRouter, HTTPException
from typing import List
from models import Order, OrderCreate
from database import orders_collection
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["orders"])

@router.post("/orders", response_model=Order)
async def create_order(order: OrderCreate):
    """Create new order"""
    try:
        order_dict = Order(**order.dict()).dict()
        result = await orders_collection.insert_one(order_dict)
        created_order = await orders_collection.find_one({"_id": result.inserted_id})
        return created_order
    except Exception as e:
        logger.error(f"Error creating order: {e}")
        raise HTTPException(status_code=500, detail="Error creating order")

@router.get("/admin/orders", response_model=List[Order])
async def get_orders():
    """Get all orders (Admin only)"""
    try:
        orders = await orders_collection.find().sort("created_at", -1).to_list(1000)
        return orders
    except Exception as e:
        logger.error(f"Error fetching orders: {e}")
        raise HTTPException(status_code=500, detail="Error fetching orders")

@router.get("/admin/orders/{order_id}", response_model=Order)
async def get_order(order_id: str):
    """Get single order (Admin only)"""
    try:
        order = await orders_collection.find_one({"id": order_id})
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        return order
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching order: {e}")
        raise HTTPException(status_code=500, detail="Error fetching order")

@router.put("/admin/orders/{order_id}/status")
async def update_order_status(order_id: str, status: str):
    """Update order status (Admin only)"""
    try:
        result = await orders_collection.update_one(
            {"id": order_id},
            {"$set": {"status": status}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Order not found")
        
        return {"message": "Order status updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating order status: {e}")
        raise HTTPException(status_code=500, detail="Error updating order status")