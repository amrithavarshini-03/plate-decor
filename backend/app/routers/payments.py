from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import Booking
from app.schemas.payment import OrderCreate, OrderOut, PaymentVerifyRequest
from app.services.payment import PaymentService

router = APIRouter(prefix="/api/payments", tags=["Payments (Razorpay)"])


@router.post("/create-order", response_model=OrderOut)
def create_deposit_order(
    order_in: OrderCreate,
    db: Session = Depends(get_db),
):
    booking = db.query(Booking).filter(Booking.id == order_in.booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    order_info = PaymentService.create_order(order_in.booking_id, order_in.amount)
    return OrderOut(**order_info)


@router.post("/verify")
def verify_deposit_payment(
    verify_in: PaymentVerifyRequest,
    db: Session = Depends(get_db),
):
    booking = db.query(Booking).filter(Booking.id == verify_in.booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    is_valid = PaymentService.verify_payment_signature(
        order_id=verify_in.razorpay_order_id,
        payment_id=verify_in.razorpay_payment_id,
        signature=verify_in.razorpay_signature,
    )
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid payment verification signature")

    booking.deposit_paid = True
    booking.deposit_reference = verify_in.razorpay_payment_id
    booking.status = "confirmed"
    db.commit()

    return {
        "status": "success",
        "message": "Ceremonial deposit successfully verified. Booking confirmed!",
        "booking_id": booking.id,
    }
