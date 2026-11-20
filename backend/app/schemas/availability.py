from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


class BlockedDateCreate(BaseModel):
    date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$", description="Date in YYYY-MM-DD format")
    reason: str = Field(..., min_length=2, max_length=255)
    is_auspicious: bool = False
    notes: Optional[str] = None


class BlockedDateOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    date: str
    reason: str
    is_auspicious: bool
    notes: Optional[str] = None


class DayStatus(BaseModel):
    date: str
    status: str  # "available" | "booked" | "blocked" | "auspicious_available" | "auspicious_booked"
    reason: Optional[str] = None
    is_auspicious: bool = False


class AvailabilityCalendarOut(BaseModel):
    month: str  # YYYY-MM
    days: List[DayStatus]
    booked_dates: List[str]
    blocked_dates: List[BlockedDateOut]
    auspicious_dates: List[str]
