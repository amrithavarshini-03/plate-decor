import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


class HotspotCreate(BaseModel):
    x_percent: float = Field(..., ge=0, le=100)
    y_percent: float = Field(..., ge=0, le=100)
    product_id: Optional[str] = None
    title: str = Field(..., min_length=1, max_length=255)
    product_name: str = Field(..., min_length=1, max_length=255)
    affiliate_url: str = Field(..., min_length=1, max_length=1024)
    price_note: Optional[str] = None


class HotspotOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    gallery_item_id: str
    x_percent: float
    y_percent: float
    product_id: Optional[str] = None
    title: str
    product_name: str
    affiliate_url: str
    price_note: Optional[str] = None


class GalleryItemCreate(BaseModel):
    id: Optional[str] = None
    title: str = Field(..., min_length=2, max_length=255)
    title_tamil: Optional[str] = None
    occasion: str = Field(..., min_length=2, max_length=100)
    plate_type: str = Field(..., min_length=2, max_length=100)
    color_theme: str = Field(..., min_length=2, max_length=100)
    budget: str = Field(default="signature")
    price: Optional[float] = None
    price_range: Optional[str] = None
    image_url: str = Field(..., min_length=1, max_length=1024)
    is_featured: bool = False
    sort_order: int = 0
    description: Optional[str] = None
    hotspots: Optional[List[HotspotCreate]] = Field(default_factory=list)


class GalleryItemUpdate(BaseModel):
    title: Optional[str] = None
    title_tamil: Optional[str] = None
    occasion: Optional[str] = None
    plate_type: Optional[str] = None
    color_theme: Optional[str] = None
    budget: Optional[str] = None
    price: Optional[float] = None
    price_range: Optional[str] = None
    image_url: Optional[str] = None
    is_featured: Optional[bool] = None
    sort_order: Optional[int] = None
    description: Optional[str] = None


class GalleryItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    title_tamil: Optional[str] = None
    occasion: str
    plate_type: str
    color_theme: str
    budget: str
    price: Optional[float] = None
    price_range: Optional[str] = None
    image_url: str
    is_featured: bool
    sort_order: int
    description: Optional[str] = None
    created_at: datetime.datetime
    hotspots: List[HotspotOut] = []
