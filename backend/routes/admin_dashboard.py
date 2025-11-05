from fastapi import APIRouter, Depends
from database import products_collection, orders_collection, contacts_collection, blog_collection, projects_collection
from routes.admin_auth import verify_token
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/admin", tags=["admin-dashboard"])

@router.get("/dashboard/stats")
async def get_dashboard_stats(username: str = Depends(verify_token)):
    """Get dashboard statistics"""
    try:
        # Count documents
        total_products = await products_collection.count_documents({})
        total_orders = await orders_collection.count_documents({})
        total_contacts = await contacts_collection.count_documents({})
        total_blog_posts = await blog_collection.count_documents({})
        total_projects = await projects_collection.count_documents({})
        
        # Get pending orders count
        pending_orders = await orders_collection.count_documents({"status": "pending"})
        
        # Get unread contacts count
        unread_contacts = await contacts_collection.count_documents({"status": "new"})
        
        # Calculate total revenue from orders
        orders = await orders_collection.find().to_list(1000)
        total_revenue = sum(order.get('total', 0) for order in orders)
        
        return {
            "total_products": total_products,
            "total_orders": total_orders,
            "total_contacts": total_contacts,
            "total_blog_posts": total_blog_posts,
            "total_projects": total_projects,
            "pending_orders": pending_orders,
            "unread_contacts": unread_contacts,
            "total_revenue": total_revenue
        }
    except Exception as e:
        logger.error(f"Error fetching dashboard stats: {e}")
        return {
            "total_products": 0,
            "total_orders": 0,
            "total_contacts": 0,
            "total_blog_posts": 0,
            "total_projects": 0,
            "pending_orders": 0,
            "unread_contacts": 0,
            "total_revenue": 0
        }

@router.get("/dashboard/recent-orders")
async def get_recent_orders(username: str = Depends(verify_token)):
    """Get recent orders for dashboard"""
    try:
        orders = await orders_collection.find().sort("created_at", -1).limit(5).to_list(5)
        return orders
    except Exception as e:
        logger.error(f"Error fetching recent orders: {e}")
        return []

@router.get("/dashboard/recent-contacts")
async def get_recent_contacts(username: str = Depends(verify_token)):
    """Get recent contacts for dashboard"""
    try:
        contacts = await contacts_collection.find().sort("created_at", -1).limit(5).to_list(5)
        return contacts
    except Exception as e:
        logger.error(f"Error fetching recent contacts: {e}")
        return []