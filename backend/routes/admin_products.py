from fastapi import APIRouter, HTTPException, Depends
from typing import List
from models import Product, ProductCreate
from database import products_collection
from routes.admin_auth import verify_token
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/admin", tags=["admin-products"])

@router.get("/products", response_model=List[Product])
async def get_all_products(username: str = Depends(verify_token)):
    """Get all products (Admin)"""
    try:
        products = await products_collection.find().to_list(1000)
        return products
    except Exception as e:
        logger.error(f"Error fetching products: {e}")
        raise HTTPException(status_code=500, detail="Error fetching products")

@router.post("/products", response_model=Product)
async def create_product(product: ProductCreate, username: str = Depends(verify_token)):
    """Create new product (Admin)"""
    try:
        # Check if slug already exists
        existing = await products_collection.find_one({"slug": product.slug})
        if existing:
            raise HTTPException(status_code=400, detail="Product with this slug already exists")
        
        product_dict = Product(**product.dict()).dict()
        result = await products_collection.insert_one(product_dict)
        created_product = await products_collection.find_one({"_id": result.inserted_id})
        return created_product
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating product: {e}")
        raise HTTPException(status_code=500, detail="Error creating product")

@router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, product: ProductCreate, username: str = Depends(verify_token)):
    """Update product (Admin)"""
    try:
        result = await products_collection.update_one(
            {"id": product_id},
            {"$set": product.dict()}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Product not found")
        
        updated_product = await products_collection.find_one({"id": product_id})
        return updated_product
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating product: {e}")
        raise HTTPException(status_code=500, detail="Error updating product")

@router.delete("/products/{product_id}")
async def delete_product(product_id: str, username: str = Depends(verify_token)):
    """Delete product (Admin)"""
    try:
        result = await products_collection.delete_one({"id": product_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Product not found")
        
        return {"message": "Product deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting product: {e}")
        raise HTTPException(status_code=500, detail="Error deleting product")