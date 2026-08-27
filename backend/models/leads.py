from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
import uuid
from datetime import datetime

class LeadCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    service_type: str
    equipment_type: Optional[str] = None
    capacity_hp: Optional[str] = None
    wire_grade: Optional[str] = None
    estimated_cost: Optional[float] = None
    details: Optional[str] = None
    location: Optional[str] = None
    source: str = "quote_calculator"  # "quote_calculator", "contact_form", "roi_calculator"
    meta_data: Optional[Dict[str, Any]] = None

class Lead(BaseModel):
    id: str = Field(default_factory=lambda: f"LEAD-{str(uuid.uuid4())[:8].upper()}")
    name: str
    phone: str
    email: Optional[str] = None
    service_type: str
    equipment_type: Optional[str] = None
    capacity_hp: Optional[str] = None
    wire_grade: Optional[str] = None
    estimated_cost: Optional[float] = None
    details: Optional[str] = None
    location: Optional[str] = None
    source: str = "quote_calculator"
    meta_data: Optional[Dict[str, Any]] = None
    status: str = "new"  # new, contacted, in_progress, completed
    created_at: datetime = Field(default_factory=datetime.utcnow)
