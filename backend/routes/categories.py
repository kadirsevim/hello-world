from fastapi import APIRouter, HTTPException
from typing import List
from models import Category
from database import get_db_pool
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["categories"])

@router.get("/categories", response_model=List[Category])
async def get_categories():
    """Get all categories"""
    try:
        pool = await get_db_pool()
        async with pool.acquire() as conn:
            async with conn.cursor() as cursor:
                await cursor.execute("SELECT id, name, slug, icon FROM categories")
                rows = await cursor.fetchall()
                
                categories = []
                for row in rows:
                    categories.append({
                        'id': row[0],
                        'name': row[1],
                        'slug': row[2],
                        'icon': row[3]
                    })
                
                return categories
    except Exception as e:
        logger.error(f"Error fetching categories: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching categories: {str(e)}")