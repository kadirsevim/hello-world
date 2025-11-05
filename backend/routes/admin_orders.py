from fastapi import APIRouter, HTTPException, Depends
from typing import List
from models import Order
from database import orders_collection
from routes.admin_auth import verify_token
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/admin", tags=["admin-orders"])

@router.get("/orders", response_model=List[Order])
async def get_all_orders(username: str = Depends(verify_token)):
    """Get all orders (Admin)"""
    try:
        orders = await orders_collection.find().sort("created_at", -1).to_list(1000)
        return orders
    except Exception as e:
        logger.error(f"Error fetching orders: {e}")
        raise HTTPException(status_code=500, detail="Error fetching orders")

@router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str, username: str = Depends(verify_token)):
    """Get single order (Admin)"""
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

@router.put("/orders/{order_id}/status")
async def update_order_status(order_id: str, status: str, username: str = Depends(verify_token)):
    """Update order status (Admin)"""
    try:
        valid_statuses = ["pending", "processing", "completed", "cancelled"]
        if status not in valid_statuses:
            raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
        
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