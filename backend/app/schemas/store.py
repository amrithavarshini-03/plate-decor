from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class StoreCreate(BaseModel):
    id: Optional[str] = None
    name: str = Field(..., min_length=2, max_length=255)
    area: str = Field(..., min_length=2, max_length=100)
    city: str = Field(default="Chennai", max_length=100)
    map_url: str = Field(..., min_length=1, max_length=1024)
    speciality: str = Field(..., min_length=2, max_length=255)
    discount_percent: int = Field(default=10, ge=0, le=100)
    discount_note: str = Field(default="Say BRB Decors at the counter for discount.")
    is_active: bool = True


class StoreUpdate(BaseModel):
    name: Optional[str] = None
    area: Optional[str] = None
    city: Optional[str] = None
    map_url: Optional[str] = None
    speciality: Optional[str] = None
    discount_percent: Optional[int] = None
    discount_note: Optional[str] = None
    is_active: Optional[bool] = None


class StoreOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    area: str
    city: str
    map_url: str
    speciality: str
    discount_percent: int
    discount_note: str
    is_active: bool
