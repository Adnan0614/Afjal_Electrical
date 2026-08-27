from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid

class TestReading(BaseModel):
    parameter: str
    value: str
    standard_spec: str
    status: str = "Passed"  # "Passed", "Warning", "Pending"

class JobStep(BaseModel):
    step_number: int
    title: str
    description: str
    completed: bool
    completed_at: Optional[str] = None

class JobTrackerCreate(BaseModel):
    job_id: Optional[str] = None
    customer_name: str
    company_name: Optional[str] = None
    phone: str
    equipment_name: str
    equipment_specs: str  # e.g., "50 HP 3-Phase Squirrel Cage Induction Motor (Kirloskar)"
    service_type: str  # "Complete Rewinding", "Varnish & Bearing Overhaul", "HT Panel Repair"
    intake_date: str
    estimated_delivery: str
    current_stage: str  # "Diagnostic & Testing", "Stripping & Core Prep", "Copper Rewinding", "Varnish & VPI Baking", "Load Testing & Balancing", "Ready for Pickup / Dispatch"
    status_percentage: int = 15
    steps: List[JobStep] = []
    test_readings: List[TestReading] = []
    technician_notes: Optional[str] = None
    wire_type: str = "100% Electrolytic Dual-Coated Copper (Class-H 180°C)"
    warranty_months: int = 6

class JobTracker(BaseModel):
    id: str = Field(default_factory=lambda: f"AE-2024-{uuid.uuid4().hex[:4].upper()}")
    job_id: str
    customer_name: str
    company_name: Optional[str] = None
    phone: str
    equipment_name: str
    equipment_specs: str
    service_type: str
    intake_date: str
    estimated_delivery: str
    current_stage: str
    status_percentage: int
    steps: List[JobStep]
    test_readings: List[TestReading]
    technician_notes: Optional[str] = None
    wire_type: str = "100% Electrolytic Dual-Coated Copper (Class-H 180°C)"
    warranty_months: int = 6
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
