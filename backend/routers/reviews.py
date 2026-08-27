from fastapi import APIRouter, HTTPException, Query
from typing import List
from models.reviews import Review, ReviewCreate
from lib.db import db

router = APIRouter(prefix="/reviews", tags=["reviews"])

@router.get("", response_model=List[Review])
async def list_reviews(limit: int = Query(50, le=100)):
    docs = await db.reviews.find().sort("created_at", -1).to_list(limit)
    return [Review(**doc) for doc in docs]

@router.post("", response_model=Review)
async def create_review(review_in: ReviewCreate):
    review_dict = review_in.model_dump()
    review_obj = Review(**review_dict)
    await db.reviews.insert_one(review_obj.model_dump())
    return review_obj
