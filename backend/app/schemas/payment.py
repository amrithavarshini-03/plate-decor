from typing import Optional
from pydantic import BaseModel, Field


class OrderCreate(BaseModel):
    booking_id: str
    amount: float = Field(..., ge=100, description="Amount in INR")
    currency: str = "INR"


class OrderOut(BaseModel):
    order_id: str
    booking_id: str
    amount: float
    currency: str
    key_id: str
    enabled: bool


class PaymentVerifyRequest(BaseModel):
    booking_id: str
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
