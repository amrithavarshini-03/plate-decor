import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class TestimonialCreate(BaseModel):
    id: Optional[str] = None
    name: str = Field(..., min_length=2, max_length=255)
    city: str = Field(..., min_length=2, max_length=100)
    occasion: str = Field(..., min_length=2, max_length=255)
    text: str = Field(..., min_length=5)
    text_tamil: Optional[str] = None
    photo_url: Optional[str] = None
    rating: int = Field(default=5, ge=1, le=5)
    is_featured: bool = True


class TestimonialUpdate(BaseModel):
    name: Optional[str] = None
    city: Optional[str] = None
    occasion: Optional[str] = None
    text: Optional[str] = None
    text_tamil: Optional[str] = None
    photo_url: Optional[str] = None
    rating: Optional[int] = None
    is_featured: Optional[bool] = None


class TestimonialOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    city: str
    occasion: str
    text: str
    text_tamil: Optional[str] = None
    photo_url: Optional[str] = None
    rating: int
    is_featured: bool
    created_at: datetime.datetime
