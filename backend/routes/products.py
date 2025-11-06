from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import json
from models import Product, ProductCreate
from database import get_db_pool
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
        pool = await get_db_pool()
        async with pool.acquire() as conn:
            async with conn.cursor() as cursor:
                # Build query
                query = "SELECT * FROM products WHERE 1=1"
                params = []
                
                if category:
                    query += " AND category_id = %s"
                    params.append(category)
                
                if search:
                    query += " AND (name LIKE %s OR description LIKE %s)"
                    search_term = f"%{search}%"
                    params.extend([search_term, search_term])
                
                # Sorting
                if sort == "price-asc":
                    query += " ORDER BY price ASC"
                elif sort == "price-desc":
                    query += " ORDER BY price DESC"
                elif sort == "rating":
                    query += " ORDER BY rating DESC"
                else:
                    query += " ORDER BY name ASC"
                
                await cursor.execute(query, params)
                rows = await cursor.fetchall()
                
                products = []
                for row in rows:
                    product = {
                        'id': row[0],
                        'name': row[1],
                        'slug': row[2],
                        'category': row[3],
                        'category_id': row[4],
                        'price': float(row[5]),
                        'image': row[6],
                        'description': row[7],
                        'features': json.loads(row[8]) if row[8] else [],
                        'stock': row[9],
                        'rating': float(row[10]),
                        'created_at': row[11].isoformat() if row[11] else None
                    }
                    products.append(product)
                
                return products
    except Exception as e:
        logger.error(f"Error fetching products: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching products: {str(e)}")

@router.get("/products/{slug}", response_model=Product)
async def get_product(slug: str):
    """Get single product by slug"""
    try:
        pool = await get_db_pool()
        async with pool.acquire() as conn:
            async with conn.cursor() as cursor:
                await cursor.execute("SELECT * FROM products WHERE slug = %s", (slug,))
                row = await cursor.fetchone()
                
                if not row:
                    raise HTTPException(status_code=404, detail="Product not found")
                
                product = {
                    'id': row[0],
                    'name': row[1],
                    'slug': row[2],
                    'category': row[3],
                    'category_id': row[4],
                    'price': float(row[5]),
                    'image': row[6],
                    'description': row[7],
                    'features': json.loads(row[8]) if row[8] else [],
                    'stock': row[9],
                    'rating': float(row[10]),
                    'created_at': row[11].isoformat() if row[11] else None
                }
                
                return product
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching product: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching product: {str(e)}")
