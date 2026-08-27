from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List
from models.reviews import Review, ReviewCreate, ReviewFeatureUpdate
from lib.db import db
from lib.auth import require_owner

router = APIRouter(prefix="/reviews", tags=["reviews"])

@router.get("", response_model=List[Review])
async def list_reviews(limit: int = Query(50, le=100)) -> List[Review]:
    # Featured reviews first, newest within each group — the owner curates the top of the wall.
    docs = await db.reviews.find().sort([("featured", -1), ("created_at", -1)]).to_list(limit)
    return [Review(**doc) for doc in docs]

@router.post("", response_model=Review)
async def create_review(review_in: ReviewCreate) -> Review:
    review_dict = review_in.model_dump()
    review_obj = Review(**review_dict)
    await db.reviews.insert_one(review_obj.model_dump())
    return review_obj

@router.patch("/{review_id}/feature", response_model=Review)
async def set_review_featured(
    review_id: str,
    payload: ReviewFeatureUpdate,
    _: bool = Depends(require_owner),
) -> Review:
    doc = await db.reviews.find_one({"id": review_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Review not found")
    await db.reviews.update_one({"id": review_id}, {"$set": {"featured": payload.featured}})
    doc["featured"] = payload.featured
    return Review(**doc)

@router.delete("/{review_id}", response_model=Review)
async def delete_review(review_id: str, _: bool = Depends(require_owner)) -> Review:
    doc = await db.reviews.find_one({"id": review_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Review not found")
    await db.reviews.delete_one({"id": review_id})
    return Review(**doc)
