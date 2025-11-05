from fastapi import APIRouter, HTTPException
from typing import List
from models import Project, ProjectCreate
from database import projects_collection
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["projects"])

@router.get("/projects", response_model=List[Project])
async def get_projects():
    """Get all projects"""
    try:
        projects = await projects_collection.find().sort("year", -1).to_list(1000)
        return projects
    except Exception as e:
        logger.error(f"Error fetching projects: {e}")
        raise HTTPException(status_code=500, detail="Error fetching projects")

@router.post("/admin/projects", response_model=Project)
async def create_project(project: ProjectCreate):
    """Create new project (Admin only)"""
    try:
        project_dict = Project(**project.dict()).dict()
        result = await projects_collection.insert_one(project_dict)
        created_project = await projects_collection.find_one({"_id": result.inserted_id})
        return created_project
    except Exception as e:
        logger.error(f"Error creating project: {e}")
        raise HTTPException(status_code=500, detail="Error creating project")

@router.put("/admin/projects/{project_id}", response_model=Project)
async def update_project(project_id: str, project: ProjectCreate):
    """Update project (Admin only)"""
    try:
        result = await projects_collection.update_one(
            {"id": project_id},
            {"$set": project.dict()}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Project not found")
        
        updated_project = await projects_collection.find_one({"id": project_id})
        return updated_project
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating project: {e}")
        raise HTTPException(status_code=500, detail="Error updating project")

@router.delete("/admin/projects/{project_id}")
async def delete_project(project_id: str):
    """Delete project (Admin only)"""
    try:
        result = await projects_collection.delete_one({"id": project_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Project not found")
        
        return {"message": "Project deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting project: {e}")
        raise HTTPException(status_code=500, detail="Error deleting project")