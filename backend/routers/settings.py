from fastapi import APIRouter, Depends

from lib.auth import require_owner
from lib.db import db
from models.settings import SiteMedia, SiteMediaUpdate

router = APIRouter(prefix="/settings", tags=["settings"])

MEDIA_DOC_ID = "site_media"


@router.get("/media", response_model=SiteMedia)
async def get_site_media():
    """Public — the site renders these images for everyone."""
    doc = await db.site_settings.find_one({"_id": MEDIA_DOC_ID})
    if not doc:
        return SiteMedia()
    doc.pop("_id", None)
    return SiteMedia(**doc)


@router.put("/media", response_model=SiteMedia)
async def update_site_media(payload: SiteMediaUpdate, _: bool = Depends(require_owner)):
    """Owner only — replace the before/after and gallery imagery."""
    data = payload.model_dump()
    await db.site_settings.update_one(
        {"_id": MEDIA_DOC_ID},
        {"$set": data},
        upsert=True,
    )
    return SiteMedia(**data)
