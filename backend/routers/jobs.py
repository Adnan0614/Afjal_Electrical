from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from models.jobs import JobTracker, JobTrackerCreate
from lib.db import db
from datetime import datetime

router = APIRouter(prefix="/jobs", tags=["jobs"])

@router.get("", response_model=List[JobTracker])
async def list_jobs(phone: Optional[str] = None, limit: int = Query(50, le=100)):
    query = {}
    if phone:
        query["phone"] = {"$regex": phone, "$options": "i"}
    docs = await db.job_trackers.find(query).sort("created_at", -1).to_list(limit)
    return [JobTracker(**doc) for doc in docs]

@router.get("/{job_id}", response_model=JobTracker)
async def get_job_by_id(job_id: str):
    clean_id = job_id.strip()
    # Try exact match, or case-insensitive match
    doc = await db.job_trackers.find_one({"job_id": {"$regex": f"^{clean_id}$", "$options": "i"}})
    if not doc:
        doc = await db.job_trackers.find_one({"id": {"$regex": f"^{clean_id}$", "$options": "i"}})
    if not doc:
        # Try matching phone number if user entered phone instead of ID
        doc = await db.job_trackers.find_one({"phone": {"$regex": clean_id, "$options": "i"}})
    if not doc:
        raise HTTPException(status_code=404, detail=f"No repair job found matching '{clean_id}'")
    return JobTracker(**doc)

@router.post("", response_model=JobTracker)
async def create_job(job_in: JobTrackerCreate):
    job_dict = job_in.model_dump()
    if not job_dict.get("job_id"):
        # Auto generate job id
        import uuid
        job_dict["job_id"] = f"AE-2024-{str(uuid.uuid4().hex[:4]).upper()}"
    
    # If no steps provided, generate standard 6 stages
    if not job_dict.get("steps"):
        stages = [
            ("Diagnostic & Surge Testing", "Equipment received, insulation resistance tested with 5000V Megger, thermal scan and root fault identified.", True),
            ("Stripping & Core Cleaning", "Old burnt coil carefully stripped, stator core cleaned, slots deburred and insulated with Nomex/Mylar Class-H paper.", True),
            ("100% Copper Coil Winding", "Precision wound with Class-H dual-coat electrolytic copper wire, slot wedges inserted, phase separators secured.", job_dict.get("status_percentage", 0) >= 40),
            ("Vacuum Pressure Varnish & Baking", "Dual-dipped in high-dielectric synthetic varnish and oven-baked at 135°C for 8 hours for maximum moisture resistance.", job_dict.get("status_percentage", 0) >= 65),
            ("Dynamic Balancing & Load Testing", "Rotor dynamic balancing, SKF C3 bearing fitment, no-load & rated current thermal run test under load.", job_dict.get("status_percentage", 0) >= 85),
            ("Quality Certified & Ready", "Final inspection passed with Class-B certificate, sealed and ready for dispatch / customer handover.", job_dict.get("status_percentage", 0) >= 100),
        ]
        job_dict["steps"] = [
            {"step_number": i + 1, "title": s[0], "description": s[1], "completed": s[2], "completed_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M") if s[2] else None}
            for i, s in enumerate(stages)
        ]

    job_obj = JobTracker(**job_dict)
    await db.job_trackers.insert_one(job_obj.model_dump())
    return job_obj
