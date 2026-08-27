from fastapi import APIRouter
from models.stats import WorkshopStats
from lib.db import db

router = APIRouter(prefix="/stats", tags=["stats"])

@router.get("", response_model=WorkshopStats)
async def get_stats():
    # Count real records from DB if available
    total_leads = await db.leads.count_documents({})
    total_emergencies = await db.emergency_dispatches.count_documents({})
    total_jobs = await db.job_trackers.count_documents({})
    
    return WorkshopStats(
        total_motors_rewound=5480 + total_jobs,
        satisfied_clients=1920 + total_leads
    )
