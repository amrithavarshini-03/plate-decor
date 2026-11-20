import calendar
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import Booking, BlockedDate, User
from app.schemas.availability import (
    BlockedDateCreate,
    BlockedDateOut,
    DayStatus,
    AvailabilityCalendarOut,
)
from app.utils.security import get_current_admin

router = APIRouter(prefix="/api/availability", tags=["Availability Calendar"])


@router.get("", response_model=AvailabilityCalendarOut)
def get_availability_calendar(
    month: Optional[str] = Query(None, description="Month in YYYY-MM format"),
    db: Session = Depends(get_db),
):
    """Public availability calendar for date picker."""
    now = datetime.datetime.utcnow()
    target_month = month or now.strftime("%Y-%m")
    try:
        year_str, month_str = target_month.split("-")
        year, m = int(year_str), int(month_str)
    except Exception:
        year, m = now.year, now.month
        target_month = f"{year:04d}-{m:02d}"

    num_days = calendar.monthrange(year, m)[1]

    # Query bookings for this month
    month_prefix = f"{target_month}%"
    bookings = db.query(Booking).filter(
        Booking.function_date.like(month_prefix),
        Booking.status.in_(["new", "quoted", "confirmed"]),
    ).all()
    booked_dates_set = {b.function_date for b in bookings}

    # Query blocked and auspicious dates for this month
    blocked_entries = db.query(BlockedDate).filter(BlockedDate.date.like(month_prefix)).all()
    blocked_dict = {b.date: b for b in blocked_entries}

    days_list: List[DayStatus] = []
    auspicious_dates_list: List[str] = []

    for d in range(1, num_days + 1):
        date_str = f"{year:04d}-{m:02d}-{d:02d}"
        blocked_entry = blocked_dict.get(date_str)
        is_booked = date_str in booked_dates_set
        is_auspicious = bool(blocked_entry and blocked_entry.is_auspicious)

        if is_auspicious:
            auspicious_dates_list.append(date_str)

        if blocked_entry and not blocked_entry.is_auspicious:
            day_status = "blocked"
            reason = blocked_entry.reason
        elif is_booked and is_auspicious:
            day_status = "auspicious_booked"
            reason = "Booked (Auspicious Muhurtham)"
        elif is_booked:
            day_status = "booked"
            reason = "Booked"
        elif is_auspicious:
            day_status = "auspicious_available"
            reason = blocked_entry.reason or "Auspicious Muhurtham Date"
        else:
            day_status = "available"
            reason = "Available for Ceremonial Plating"

        days_list.append(
            DayStatus(
                date=date_str,
                status=day_status,
                reason=reason,
                is_auspicious=is_auspicious,
            )
        )

    return AvailabilityCalendarOut(
        month=target_month,
        days=days_list,
        booked_dates=list(booked_dates_set),
        blocked_dates=[BlockedDateOut.model_validate(b) for b in blocked_entries],
        auspicious_dates=auspicious_dates_list,
    )


@router.post("/block", response_model=BlockedDateOut, status_code=status.HTTP_201_CREATED)
def add_blocked_or_auspicious_date(
    date_in: BlockedDateCreate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    existing = db.query(BlockedDate).filter(BlockedDate.date == date_in.date).first()
    if existing:
        existing.reason = date_in.reason
        existing.is_auspicious = date_in.is_auspicious
        existing.notes = date_in.notes
        db.commit()
        db.refresh(existing)
        return existing

    new_blocked = BlockedDate(
        date=date_in.date,
        reason=date_in.reason,
        is_auspicious=date_in.is_auspicious,
        notes=date_in.notes,
    )
    db.add(new_blocked)
    db.commit()
    db.refresh(new_blocked)
    return new_blocked


@router.delete("/block/{date_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_blocked_date(
    date_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    entry = db.query(BlockedDate).filter(BlockedDate.id == date_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Blocked date record not found")
    db.delete(entry)
    db.commit()
    return None
