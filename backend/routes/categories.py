from fastapi import APIRouter, HTTPException
from typing import List
from models import Category
from database import categories_collection
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["categories"])

@router.get("/categories", response_model=List[Category])
async def get_categories():
    """Get all categories"""
    try:
        categories = await categories_collection.find().to_list(1000)
        return categories
    except Exception as e:
        logger.error(f"Error fetching categories: {e}")
        raise HTTPException(status_code=500, detail="Error fetching categories")