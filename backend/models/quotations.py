"""Multi-option quotations and multi-item work invoices.

One document per customer requirement holds up to five alternative equipment
options plus the work/service lines that get invoiced once an option is approved:

    requirement -> options -> compare -> approve -> work order -> work items -> invoice
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime
import uuid

QuotationStatus = Literal["draft", "sent", "approved", "ordered", "invoiced"]
WorkItemStatus = Literal["pending", "in_progress", "completed"]

MAX_OPTIONS = 5


def _new_id(prefix: str) -> str:
    return f"{prefix}-{str(uuid.uuid4())[:8].upper()}"


class QuoteOption(BaseModel):
    id: str = Field(default_factory=lambda: _new_id("OPT"))
    product_name: str
    brand: Optional[str] = None
    model: Optional[str] = None
    specifications: Optional[str] = None
    quantity: float = 1
    unit_price: float = 0
    tax_percent: float = 18
    discount_percent: float = 0
    supplier: Optional[str] = None
    warranty: Optional[str] = None
    delivery_time: Optional[str] = None
    remarks: Optional[str] = None


class WorkItem(BaseModel):
    id: str = Field(default_factory=lambda: _new_id("WRK"))
    description: str
    quantity: float = 1
    unit: str = "Job"          # Job / Nos / Mtr / Hour / Trip
    rate: float = 0
    material_cost: float = 0
    labour_cost: float = 0
    discount_percent: float = 0
    tax_percent: float = 18
    status: WorkItemStatus = "pending"
    remarks: Optional[str] = None


class QuotationCreate(BaseModel):
    customer_name: str
    customer_phone: str
    customer_location: Optional[str] = None
    requirement: str
    lead_id: Optional[str] = None


class QuotationUpdate(BaseModel):
    """Whole-document save from the editor — every field is optional."""
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    customer_location: Optional[str] = None
    requirement: Optional[str] = None
    status: Optional[QuotationStatus] = None
    selected_option_id: Optional[str] = None
    options: Optional[List[QuoteOption]] = None
    work_items: Optional[List[WorkItem]] = None
    notes: Optional[str] = None


class OptionSelect(BaseModel):
    option_id: str


class Quotation(BaseModel):
    id: str = Field(default_factory=lambda: _new_id("QTN"))
    customer_name: str
    customer_phone: str
    customer_location: Optional[str] = None
    requirement: str
    lead_id: Optional[str] = None
    status: QuotationStatus = "draft"
    selected_option_id: Optional[str] = None
    options: List[QuoteOption] = Field(default_factory=list)
    work_items: List[WorkItem] = Field(default_factory=list)
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
