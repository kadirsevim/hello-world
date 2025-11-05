from fastapi import APIRouter, HTTPException
from typing import List
from models import Contact, ContactCreate
from database import contacts_collection
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["contact"])

@router.post("/contact", response_model=Contact)
async def create_contact(contact: ContactCreate):
    """Create new contact message"""
    try:
        contact_dict = Contact(**contact.dict()).dict()
        result = await contacts_collection.insert_one(contact_dict)
        created_contact = await contacts_collection.find_one({"_id": result.inserted_id})
        return created_contact
    except Exception as e:
        logger.error(f"Error creating contact: {e}")
        raise HTTPException(status_code=500, detail="Error creating contact")

@router.get("/admin/contacts", response_model=List[Contact])
async def get_contacts():
    """Get all contact messages (Admin only)"""
    try:
        contacts = await contacts_collection.find().sort("created_at", -1).to_list(1000)
        return contacts
    except Exception as e:
        logger.error(f"Error fetching contacts: {e}")
        raise HTTPException(status_code=500, detail="Error fetching contacts")

@router.put("/admin/contacts/{contact_id}/status")
async def update_contact_status(contact_id: str, status: str):
    """Update contact status (Admin only)"""
    try:
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