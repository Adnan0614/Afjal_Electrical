from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid

class ReviewCreate(BaseModel):
    author_name: str
    company_or_location: str
    rating: int = Field(ge=1, le=5)
    equipment_serviced: str
    review_text: str
    verified_customer: bool = True

class Review(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    author_name: str
    company_or_location: str
    rating: int = 5
    equipment_serviced: str
    review_text: str
    verified_customer: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
