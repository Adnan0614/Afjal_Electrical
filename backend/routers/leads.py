from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional
from datetime import datetime, timezone
from models.leads import Lead, LeadCreate, LeadStatusUpdate
from lib.db import db
from lib.auth import require_owner

router = APIRouter(prefix="/leads", tags=["leads"])

@router.post("", response_model=Lead)
async def create_lead(lead_in: LeadCreate) -> Lead:
    lead_dict = lead_in.model_dump()
    lead_obj = Lead(**lead_dict)
    await db.leads.insert_one(lead_obj.model_dump())
    return lead_obj

@router.get("", response_model=List[Lead])
async def list_leads(
    limit: int = Query(50, le=200),
    status: Optional[str] = Query(None),
    _: bool = Depends(require_owner),
) -> List[Lead]:
    query = {"status": status} if status else {}
    docs = await db.leads.find(query).sort("created_at", -1).to_list(limit)
    return [Lead(**doc) for doc in docs]

@router.get("/{lead_id}", response_model=Lead)
async def get_lead(lead_id: str, _: bool = Depends(require_owner)) -> Lead:
    doc = await db.leads.find_one({"id": lead_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Lead not found")
    return Lead(**doc)

@router.patch("/{lead_id}/status", response_model=Lead)
async def update_lead_status(
    lead_id: str,
    payload: LeadStatusUpdate,
    _: bool = Depends(require_owner),
) -> Lead:
    """Move a quote request along the New → Called → Quoted → Won/Lost pipeline."""
    doc = await db.leads.find_one({"id": lead_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Lead not found")

    updated_at = datetime.now(timezone.utc).replace(tzinfo=None)
    await db.leads.update_one(
        {"id": lead_id},
        {"$set": {"status": payload.status, "updated_at": updated_at}},
    )
    doc["status"] = payload.status
    doc["updated_at"] = updated_at
    return Lead(**doc)
