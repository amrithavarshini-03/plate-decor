from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


class ProductCreate(BaseModel):
    id: Optional[str] = None
    name: str = Field(..., min_length=2, max_length=255)
    category: str = Field(..., min_length=2, max_length=100)  # trays | tools | toppers | decor
    image_url: str = Field(..., min_length=1, max_length=1024)
    affiliate_url: str = Field(..., min_length=1, max_length=1024)
    price_note: Optional[str] = None
    occasion_tags: Optional[List[str]] = Field(default_factory=list)
    is_active: bool = True


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    affiliate_url: Optional[str] = None
    price_note: Optional[str] = None
    occasion_tags: Optional[List[str]] = None
    is_active: Optional[bool] = None


class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    category: str
    image_url: str
    affiliate_url: str
    price_note: Optional[str] = None
    occasion_tags: List[str] = []
    is_active: bool
