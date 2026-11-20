import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


class InspirationCreate(BaseModel):
    type: str = "image"  # image | link
    url: str
    preview_title: Optional[str] = None
    preview_image: Optional[str] = None


class InspirationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    booking_id: str
    type: str
    url: str
    preview_title: Optional[str] = None
    preview_image: Optional[str] = None
    created_at: datetime.datetime


class BookingCreate(BaseModel):
    customer_name: str = Field(..., min_length=2, max_length=255)
    phone: str = Field(..., min_length=8, max_length=50)
    email: Optional[str] = None
    city: str = Field(default="Chennai", max_length=100)
    venue: Optional[str] = None
    function_date: str = Field(..., min_length=4, max_length=50)
    occasion: str = Field(..., min_length=2, max_length=100)
    custom_occasion: Optional[str] = None
    service_type: str = Field(default="full_service")  # full_service | diy
    plate_count: int = Field(default=5, ge=1, le=108)
    plate_types: List[str] = Field(default_factory=list)
    stage_required: bool = False
    theme_colors: List[str] = Field(default_factory=list)
    notes: Optional[str] = None
    budget_range: Optional[str] = None
    inspirations: Optional[List[InspirationCreate]] = Field(default_factory=list)


class BookingStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(new|quoted|confirmed|completed|cancelled)$")
    notes: Optional[str] = None


class BookingQuoteUpdate(BaseModel):
    estimate_amount: float = Field(..., ge=0)
    notes: Optional[str] = None


class BookingDepositUpdate(BaseModel):
    deposit_paid: bool = True
    deposit_amount: float = Field(..., ge=0)
    deposit_reference: Optional[str] = None


class BookingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    customer_name: str
    phone: str
    email: Optional[str] = None
    city: str
    venue: Optional[str] = None
    function_date: str
    occasion: str
    custom_occasion: Optional[str] = None
    service_type: str
    plate_count: int
    plate_types: List[str] = []
    stage_required: bool
    theme_colors: List[str] = []
    notes: Optional[str] = None
    budget_range: Optional[str] = None
    status: str
    estimate_amount: Optional[float] = None
    deposit_paid: bool
    deposit_amount: Optional[float] = None
    deposit_reference: Optional[str] = None
    created_at: datetime.datetime
    updated_at: datetime.datetime
    inspirations: List[InspirationOut] = []
