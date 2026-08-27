from fastapi import APIRouter
from models.stats import WorkshopStats
from lib.db import db

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("", response_model=WorkshopStats)
async def get_stats() -> WorkshopStats:
    """Public workshop credibility counters, nudged by real activity in the DB."""
    total_leads: int = await db.leads.count_documents({})
    total_jobs: int = await db.job_trackers.count_documents({})

    return WorkshopStats(
        total_motors_rewound=5480 + total_jobs,
        satisfied_clients=1920 + total_leads,
    )
