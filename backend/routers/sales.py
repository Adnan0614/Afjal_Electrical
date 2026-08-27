from fastapi import APIRouter, Depends
from typing import List, Dict, Any
from models.leads import MonthlySales
from lib.db import db
from lib.auth import require_owner

router = APIRouter(prefix="/sales", tags=["sales"])


@router.get("/monthly", response_model=List[MonthlySales])
async def monthly_sales(_: bool = Depends(require_owner)) -> List[MonthlySales]:
    """Quotes received vs jobs won per calendar month, newest month first.

    Aggregated server-side so the numbers are anchored to the stored created_at
    timestamps rather than the browser clock.
    """
    pipeline: List[Dict[str, Any]] = [
        {
            "$group": {
                "_id": {"$dateToString": {"format": "%Y-%m", "date": "$created_at"}},
                "quotes": {"$sum": 1},
                "quoted_value": {"$sum": {"$ifNull": ["$estimated_cost", 0]}},
                "won": {
                    "$sum": {"$cond": [{"$eq": ["$status", "won"]}, 1, 0]}
                },
                "won_value": {
                    "$sum": {
                        "$cond": [
                            {"$eq": ["$status", "won"]},
                            {"$ifNull": ["$estimated_cost", 0]},
                            0,
                        ]
                    }
                },
            }
        },
        {"$sort": {"_id": -1}},
        {"$limit": 24},
    ]

    rows = await db.leads.aggregate(pipeline).to_list(24)
    return [
        MonthlySales(
            month=row["_id"],
            quotes=row["quotes"],
            won=row["won"],
            won_value=float(row["won_value"]),
            quoted_value=float(row["quoted_value"]),
        )
        for row in rows
        if row["_id"]
    ]
