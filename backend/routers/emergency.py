from fastapi import APIRouter, HTTPException, Query
from typing import List
from models.emergency import EmergencyDispatch, EmergencyDispatchCreate
from lib.db import db
import random

router = APIRouter(prefix="/emergency-dispatch", tags=["emergency"])

@router.post("", response_model=EmergencyDispatch)
async def create_emergency_dispatch(dispatch_in: EmergencyDispatchCreate):
    dispatch_dict = dispatch_in.model_dump()
    
    # Calculate realistic ETA based on location
    loc = dispatch_in.location_area.lower()
    if "tilda" in loc or "neora" in loc:
        eta = random.randint(15, 30)
    elif "raipur" in loc or "urla" in loc or "siltara" in loc or "birgaon" in loc:
        eta = random.randint(35, 55)
    else:
        eta = random.randint(60, 90)
        
    dispatch_obj = EmergencyDispatch(**dispatch_dict, eta_minutes=eta)
    await db.emergency_dispatches.insert_one(dispatch_obj.model_dump())
    return dispatch_obj

@router.get("", response_model=List[EmergencyDispatch])
async def list_emergency_dispatches(limit: int = Query(50, le=200)):
    docs = await db.emergency_dispatches.find().sort("created_at", -1).to_list(limit)
    return [EmergencyDispatch(**doc) for doc in docs]

@router.get("/{dispatch_id}", response_model=EmergencyDispatch)
async def get_emergency_dispatch(dispatch_id: str):
    doc = await db.emergency_dispatches.find_one({"id": dispatch_id})
    if not doc:
        # Check without prefix if user typed just number
        doc = await db.emergency_dispatches.find_one({"id": f"SOS-{dispatch_id}"})
    if not doc:
        raise HTTPException(status_code=404, detail="Emergency ticket not found")
    return EmergencyDispatch(**doc)
