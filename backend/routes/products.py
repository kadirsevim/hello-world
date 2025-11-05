from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from models import Product, ProductCreate
from database import products_collection
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["products"])

@router.get("/products", response_model=List[Product])
async def get_products(
    category: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    sort: Optional[str] = Query("name")
):
    """Get all products with optional filters"""
    try:
        query = {}
        
        if category:
            query["category_id"] = category
        
        if search:
            query["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}}
            ]
        
        # Sorting
        sort_field = "name"
        sort_direction = 1
        
        if sort == "price-asc":
            sort_field = "price"
            sort_direction = 1
        elif sort == "price-desc":
            sort_field = "price"
            sort_direction = -1
        elif sort == "rating":
            sort_field = "rating"
            sort_direction = -1
        
        products = await products_collection.find(query).sort(sort_field, sort_direction).to_list(1000)
        return products
    except Exception as e:
        logger.error(f"Error fetching products: {e}")
        raise HTTPException(status_code=500, detail="Error fetching products")

@router.get("/products/{slug}", response_model=Product)
async def get_product(slug: str):
    """Get single product by slug"""
    try:
        product = await products_collection.find_one({"slug": slug})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching product: {e}")
        raise HTTPException(status_code=500, detail="Error fetching product")

@router.post("/admin/products", response_model=Product)
async def create_product(product: ProductCreate):
    """Create new product (Admin only)"""
    try:
        product_dict = Product(**product.dict()).dict()
        result = await products_collection.insert_one(product_dict)
        created_product = await products_collection.find_one({"_id": result.inserted_id})
        return created_product
    except Exception as e:
        logger.error(f"Error creating product: {e}")
        raise HTTPException(status_code=500, detail="Error creating product")

@router.put("/admin/products/{product_id}", response_model=Product)
async def update_product(product_id: str, product: ProductCreate):
    """Update product (Admin only)"""
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

@router.delete("/admin/products/{product_id}")
async def delete_product(product_id: str):
    """Delete product (Admin only)"""
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