import hmac
import hashlib
import logging
from typing import Dict, Any
from fastapi import HTTPException
from app.config import settings

logger = logging.getLogger("brb_decors.payments")


class PaymentService:
    @staticmethod
    def is_enabled() -> bool:
        return settings.ENABLE_PAYMENTS

    @classmethod
    def create_order(cls, booking_id: str, amount_inr: float) -> Dict[str, Any]:
        """Creates an order for deposit booking."""
        if not cls.is_enabled():
            # When disabled by feature flag, provide a mock/simulated order token
            return {
                "order_id": f"order_mock_{booking_id}",
                "booking_id": booking_id,
                "amount": amount_inr,
                "currency": "INR",
                "key_id": settings.RAZORPAY_KEY_ID,
                "enabled": False,
                "message": "Online deposits are currently disabled by feature flag (ENABLE_PAYMENTS=false). Traditional booking without advance deposit is active.",
            }

        # Real Razorpay Order Creation via HTTP/Client
        try:
            import httpx
            url = "https://api.razorpay.com/v1/orders"
            auth = (settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
            payload = {
                "amount": int(amount_inr * 100),  # In paise
                "currency": "INR",
                "receipt": f"rcpt_{booking_id}",
                "notes": {"booking_id": booking_id},
            }
            with httpx.Client(timeout=10.0) as client:
                res = client.post(url, auth=auth, json=payload)
                if res.status_code not in [200, 201]:
                    raise HTTPException(status_code=400, detail="Failed to create Razorpay payment order")
                data = res.json()
                return {
                    "order_id": data["id"],
                    "booking_id": booking_id,
                    "amount": amount_inr,
                    "currency": "INR",
                    "key_id": settings.RAZORPAY_KEY_ID,
                    "enabled": True,
                }
        except Exception as e:
            logger.error(f"Razorpay order error: {e}")
            raise HTTPException(status_code=500, detail=f"Payment gateway error: {str(e)}")

    @classmethod
    def verify_payment_signature(cls, order_id: str, payment_id: str, signature: str) -> bool:
        if not cls.is_enabled():
            return True  # Bypass in mock mode
        msg = f"{order_id}|{payment_id}".encode()
        secret = settings.RAZORPAY_KEY_SECRET.encode()
        generated_signature = hmac.new(secret, msg, hashlib.sha256).hexdigest()
        return hmac.compare_digest(generated_signature, signature)
