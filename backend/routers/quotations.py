from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List
from datetime import datetime, timezone

from models.quotations import (
    MAX_OPTIONS,
    OptionSelect,
    Quotation,
    QuotationCreate,
    QuotationUpdate,
)
from lib.db import db
from lib.auth import require_owner

router = APIRouter(prefix="/quotations", tags=["quotations"])


def _now() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


async def _get_or_404(quotation_id: str) -> dict:
    doc = await db.quotations.find_one({"id": quotation_id})
    if not doc:
        raise HTTPException(status_code=404, detail=f"Quotation '{quotation_id}' not found")
    return doc


@router.post("", response_model=Quotation)
async def create_quotation(payload: QuotationCreate, _: bool = Depends(require_owner)) -> Quotation:
    quotation = Quotation(**payload.model_dump())
    await db.quotations.insert_one(quotation.model_dump())
    return quotation


@router.get("", response_model=List[Quotation])
async def list_quotations(
    limit: int = Query(50, le=200), _: bool = Depends(require_owner)
) -> List[Quotation]:
    docs = await db.quotations.find().sort("created_at", -1).to_list(limit)
    return [Quotation(**doc) for doc in docs]


@router.get("/{quotation_id}", response_model=Quotation)
async def get_quotation(quotation_id: str, _: bool = Depends(require_owner)) -> Quotation:
    return Quotation(**await _get_or_404(quotation_id))


@router.put("/{quotation_id}", response_model=Quotation)
async def update_quotation(
    quotation_id: str, payload: QuotationUpdate, _: bool = Depends(require_owner)
) -> Quotation:
    """Whole-document save: options, work items, customer details and status."""
    doc = await _get_or_404(quotation_id)
    patch = payload.model_dump(exclude_none=True)

    options = patch.get("options")
    if options is not None and len(options) > MAX_OPTIONS:
        raise HTTPException(
            status_code=400, detail=f"A quotation can compare at most {MAX_OPTIONS} options."
        )

    # A selected option must actually exist on the document being saved.
    selected = patch.get("selected_option_id")
    if selected:
        candidates = options if options is not None else doc.get("options", [])
        if not any(opt["id"] == selected for opt in candidates):
            raise HTTPException(status_code=400, detail="Selected option is not part of this quotation.")

    patch["updated_at"] = _now()
    await db.quotations.update_one({"id": quotation_id}, {"$set": patch})
    doc.update(patch)
    return Quotation(**doc)


@router.post("/{quotation_id}/select-option", response_model=Quotation)
async def select_option(
    quotation_id: str, payload: OptionSelect, _: bool = Depends(require_owner)
) -> Quotation:
    """Approve one of the compared options and move the deal to `approved`."""
    doc = await _get_or_404(quotation_id)
    if not any(opt["id"] == payload.option_id for opt in doc.get("options", [])):
        raise HTTPException(status_code=404, detail="Option not found on this quotation.")

    patch = {"selected_option_id": payload.option_id, "status": "approved", "updated_at": _now()}
    await db.quotations.update_one({"id": quotation_id}, {"$set": patch})
    doc.update(patch)
    return Quotation(**doc)


@router.delete("/{quotation_id}", response_model=Quotation)
async def delete_quotation(quotation_id: str, _: bool = Depends(require_owner)) -> Quotation:
    doc = await _get_or_404(quotation_id)
    await db.quotations.delete_one({"id": quotation_id})
    return Quotation(**doc)
