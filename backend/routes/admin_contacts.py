from fastapi import APIRouter, HTTPException, Depends
from typing import List
from models import Contact
from database import contacts_collection
from routes.admin_auth import verify_token
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/admin", tags=["admin-contacts"])

@router.get("/contacts", response_model=List[Contact])
async def get_all_contacts(username: str = Depends(verify_token)):
    """Get all contact messages (Admin)"""
    try:
        contacts = await contacts_collection.find().sort("created_at", -1).to_list(1000)
        return contacts
    except Exception as e:
        logger.error(f"Error fetching contacts: {e}")
        raise HTTPException(status_code=500, detail="Error fetching contacts")

@router.put("/contacts/{contact_id}/status")
async def update_contact_status(contact_id: str, status: str, username: str = Depends(verify_token)):
    """Update contact status (Admin)"""
    try:
        valid_statuses = ["new", "replied"]
        if status not in valid_statuses:
            raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
        
        result = await contacts_collection.update_one(
            {"id": contact_id},
            {"$set": {"status": status}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Contact not found")
        
        return {"message": "Contact status updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating contact status: {e}")
        raise HTTPException(status_code=500, detail="Error updating contact status")

@router.delete("/contacts/{contact_id}")
async def delete_contact(contact_id: str, username: str = Depends(verify_token)):
    """Delete contact message (Admin)"""
    try:
        result = await contacts_collection.delete_one({"id": contact_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Contact not found")
        
        return {"message": "Contact deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting contact: {e}")
        raise HTTPException(status_code=500, detail="Error deleting contact")