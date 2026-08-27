from pydantic import BaseModel, Field
from typing import List


class GalleryItem(BaseModel):
    label: str
    image_url: str


class SiteMedia(BaseModel):
    """Owner-editable imagery used across the public site."""
    before_image_url: str = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
    after_image_url: str = "https://images.unsplash.com/photo-1692719094491-2746e82a8595?auto=format&fit=crop&w=1200&q=80"
    before_caption: str = "BEFORE: Burnt / Shorted Stator (0.1 MΩ)"
    after_caption: str = "AFTER: 100% Pure Copper Rewound (250 MΩ)"
    gallery: List[GalleryItem] = Field(
        default_factory=lambda: [
            GalleryItem(label="Motors", image_url="https://images.pexels.com/photos/34194564/pexels-photo-34194564.jpeg?auto=compress&cs=tinysrgb&w=800"),
            GalleryItem(label="Transformers", image_url="https://images.pexels.com/photos/13287446/pexels-photo-13287446.jpeg?auto=compress&cs=tinysrgb&w=800"),
            GalleryItem(label="HT / LT Panels", image_url="https://images.pexels.com/photos/28265032/pexels-photo-28265032.jpeg?auto=compress&cs=tinysrgb&w=800"),
            GalleryItem(label="Rewinding & Testing", image_url="https://images.pexels.com/photos/33531832/pexels-photo-33531832.jpeg?auto=compress&cs=tinysrgb&w=800"),
        ]
    )


class SiteMediaUpdate(BaseModel):
    before_image_url: str
    after_image_url: str
    before_caption: str
    after_caption: str
    gallery: List[GalleryItem]
