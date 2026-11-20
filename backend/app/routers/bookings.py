import uuid
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Request, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import Booking, BookingInspiration, User
from app.schemas.booking import (
    BookingCreate,
    BookingOut,
    BookingStatusUpdate,
    BookingQuoteUpdate,
    BookingDepositUpdate,
)
from app.utils.security import get_current_admin
from app.utils.rate_limit import limiter
from app.services.notification import get_notification_service

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])


def generate_booking_id() -> str:
    year = datetime.datetime.utcnow().year
    suffix = uuid.uuid4().hex[:6].upper()
    return f"BRB-{year}-{suffix}"


@router.post("", response_model=BookingOut, status_code=status.HTTP_201_CREATED)
@limiter.limit("20/minute")
def create_booking(
    request: Request,
    booking_in: BookingCreate,
    db: Session = Depends(get_db),
):
    """Public customer booking endpoint. Saves plate requirements & inspirations."""
    new_id = generate_booking_id()

    booking = Booking(
        id=new_id,
        customer_name=booking_in.customer_name,
        phone=booking_in.phone,
        email=booking_in.email,
        city=booking_in.city,
        venue=booking_in.venue,
        function_date=booking_in.function_date,
        occasion=booking_in.occasion,
        custom_occasion=booking_in.custom_occasion,
        service_type=booking_in.service_type,
        plate_count=booking_in.plate_count,
        plate_types=booking_in.plate_types,
        stage_required=booking_in.stage_required,
        theme_colors=booking_in.theme_colors,
        notes=booking_in.notes,
        budget_range=booking_in.budget_range,
        status="new",
        deposit_paid=False,
    )

    db.add(booking)
    db.flush()

    if booking_in.inspirations:
        for insp in booking_in.inspirations:
            db_insp = BookingInspiration(
                booking_id=new_id,
                type=insp.type,
                url=insp.url,
                preview_title=insp.preview_title,
                preview_image=insp.preview_image,
            )
            db.add(db_insp)

    db.commit()
    db.refresh(booking)

    # Trigger notifications
    notifier = get_notification_service()
    booking_dict = {
        "id": booking.id,
        "customer_name": booking.customer_name,
        "phone": booking.phone,
        "email": booking.email,
        "function_date": booking.function_date,
        "occasion": booking.occasion,
        "plate_count": booking.plate_count,
        "service_type": booking.service_type,
    }
    notifier.send_booking_confirmation(booking_dict)

    return booking


@router.get("", response_model=List[BookingOut])
def list_bookings(
    status_filter: Optional[str] = Query(None, alias="status"),
    occasion: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Admin only: list bookings filtered by status, occasion or query."""
    query = db.query(Booking)
    if status_filter:
        query = query.filter(Booking.status == status_filter)
    if occasion:
        query = query.filter(Booking.occasion == occasion)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Booking.customer_name.ilike(search_pattern))
            | (Booking.phone.ilike(search_pattern))
            | (Booking.id.ilike(search_pattern))
            | (Booking.city.ilike(search_pattern))
        )
    return query.order_by(Booking.created_at.desc()).offset(offset).limit(limit).all()


@router.get("/{booking_id}", response_model=BookingOut)
def get_booking(
    booking_id: str,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Admin only: get single booking detail."""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking


@router.patch("/{booking_id}/status", response_model=BookingOut)
def update_booking_status(
    booking_id: str,
    update_data: BookingStatusUpdate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Admin only: update status in pipeline (new -> quoted -> confirmed -> completed -> cancelled)."""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    booking.status = update_data.status
    if update_data.notes:
        booking.notes = f"{booking.notes or ''}\n[Status {update_data.status}]: {update_data.notes}".strip()
    booking.updated_at = datetime.datetime.utcnow()

    db.commit()
    db.refresh(booking)

    # Notify
    notifier = get_notification_service()
    notifier.send_status_update({"id": booking.id, "customer_name": booking.customer_name}, booking.status)

    return booking


@router.patch("/{booking_id}/quote", response_model=BookingOut)
def update_booking_quote(
    booking_id: str,
    quote_data: BookingQuoteUpdate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Admin only: enter formal quote amount."""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    booking.estimate_amount = quote_data.estimate_amount
    booking.status = "quoted"
    if quote_data.notes:
        booking.notes = f"{booking.notes or ''}\n[Quote ₹{quote_data.estimate_amount}]: {quote_data.notes}".strip()
    booking.updated_at = datetime.datetime.utcnow()

    db.commit()
    db.refresh(booking)

    # Notify
    notifier = get_notification_service()
    notifier.send_quote_notification({"id": booking.id, "customer_name": booking.customer_name}, quote_data.estimate_amount)

    return booking


@router.patch("/{booking_id}/deposit", response_model=BookingOut)
def update_booking_deposit(
    booking_id: str,
    deposit_data: BookingDepositUpdate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Admin only: mark deposit as received."""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    booking.deposit_paid = deposit_data.deposit_paid
    booking.deposit_amount = deposit_data.deposit_amount
    booking.deposit_reference = deposit_data.deposit_reference
    booking.status = "confirmed"
    booking.updated_at = datetime.datetime.utcnow()

    db.commit()
    db.refresh(booking)
    return booking


@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_booking(
    booking_id: str,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Admin only: delete booking."""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    db.delete(booking)
    db.commit()
    return None
