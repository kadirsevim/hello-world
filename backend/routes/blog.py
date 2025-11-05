from fastapi import APIRouter, HTTPException
from typing import List
from models import Blog, BlogCreate
from database import blog_collection
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["blog"])

@router.get("/blog", response_model=List[Blog])
async def get_blog_posts():
    """Get all blog posts"""
    try:
        posts = await blog_collection.find().sort("date", -1).to_list(1000)
        return posts
    except Exception as e:
        logger.error(f"Error fetching blog posts: {e}")
        raise HTTPException(status_code=500, detail="Error fetching blog posts")

@router.get("/blog/{slug}", response_model=Blog)
async def get_blog_post(slug: str):
    """Get single blog post by slug"""
    try:
        post = await blog_collection.find_one({"slug": slug})
        if not post:
            raise HTTPException(status_code=404, detail="Blog post not found")
        return post
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching blog post: {e}")
        raise HTTPException(status_code=500, detail="Error fetching blog post")

@router.post("/admin/blog", response_model=Blog)
async def create_blog_post(post: BlogCreate):
    """Create new blog post (Admin only)"""
    try:
        post_dict = Blog(**post.dict()).dict()
        result = await blog_collection.insert_one(post_dict)
        created_post = await blog_collection.find_one({"_id": result.inserted_id})
        return created_post
    except Exception as e:
        logger.error(f"Error creating blog post: {e}")
        raise HTTPException(status_code=500, detail="Error creating blog post")

@router.put("/admin/blog/{post_id}", response_model=Blog)
async def update_blog_post(post_id: str, post: BlogCreate):
    """Update blog post (Admin only)"""
    try:
        result = await blog_collection.update_one(
            {"id": post_id},
            {"$set": post.dict()}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Blog post not found")
        
        updated_post = await blog_collection.find_one({"id": post_id})
        return updated_post
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating blog post: {e}")
        raise HTTPException(status_code=500, detail="Error updating blog post")

@router.delete("/admin/blog/{post_id}")
async def delete_blog_post(post_id: str):
    """Delete blog post (Admin only)"""
    try:
        result = await blog_collection.delete_one({"id": post_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Blog post not found")
        
        return {"message": "Blog post deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting blog post: {e}")
        raise HTTPException(status_code=500, detail="Error deleting blog post")