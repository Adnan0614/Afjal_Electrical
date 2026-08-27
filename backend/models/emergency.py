from pydantic import BaseModel, Field
from typing import Optional
import uuid
import random
from datetime import datetime

class EmergencyDispatchCreate(BaseModel):
    contact_name: str
    phone: str
    facility_name: Optional[str] = None
    location_area: str  # e.g., Tilda Neora, Raipur, Urla, Siltara, etc.
    address_details: Optional[str] = None
    equipment_type: str  # Motor Breakdown, Panel Failure, HT Line Issue, Transformer Spark, etc.
    urgency_level: str = "critical"  # "immediate_2hr", "same_day", "urgent"
    problem_description: str

class EmergencyDispatch(BaseModel):
    id: str = Field(default_factory=lambda: f"SOS-{random.randint(1000, 9999)}")
    contact_name: str
    phone: str
    facility_name: Optional[str] = None
    location_area: str
    address_details: Optional[str] = None
    equipment_type: str
    urgency_level: str = "critical"
    problem_description: str
    status: str = "dispatched"  # "received", "dispatched", "technician_en_route", "resolved"
    assigned_technician: str = "Mohammad Afjal & Rapid Response Team"
    eta_minutes: int = 45
    created_at: datetime = Field(default_factory=datetime.utcnow)
