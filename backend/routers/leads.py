from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional
from models.leads import Lead, LeadCreate
from lib.db import db
from lib.auth import require_owner

router = APIRouter(prefix="/leads", tags=["leads"])

@router.post("", response_model=Lead)
async def create_lead(lead_in: LeadCreate):
    lead_dict = lead_in.model_dump()
    lead_obj = Lead(**lead_dict)
    await db.leads.insert_one(lead_obj.model_dump())
    return lead_obj

@router.get("", response_model=List[Lead])
async def list_leads(limit: int = Query(50, le=200), _: bool = Depends(require_owner)):
    docs = await db.leads.find().sort("created_at", -1).to_list(limit)
    return [Lead(**doc) for doc in docs]

@router.get("/{lead_id}", response_model=Lead)
async def get_lead(lead_id: str, _: bool = Depends(require_owner)):
    doc = await db.leads.find_one({"id": lead_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Lead not found")
    return Lead(**doc)
