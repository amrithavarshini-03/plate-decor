import logging
import smtplib
from abc import ABC, abstractmethod
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import List
import httpx
from app.config import settings

logger = logging.getLogger("brb_decors.notifications")


class BaseNotificationService(ABC):
    @abstractmethod
    def send_booking_confirmation(self, booking_data: dict) -> bool:
        pass

    @abstractmethod
    def send_quote_notification(self, booking_data: dict, amount: float) -> bool:
        pass

    @abstractmethod
    def send_status_update(self, booking_data: dict, new_status: str) -> bool:
        pass

    @abstractmethod
    def send_password_reset_otp(self, email: str, otp: str) -> bool:
        pass

    def send_sms_otp(self, phone: str, otp: str) -> bool:
        return self.send_password_reset_otp(phone, otp)

    def send_whatsapp_otp(self, phone: str, otp: str) -> bool:
        return self.send_password_reset_otp(phone, otp)


class ConsoleNotificationService(BaseNotificationService):
    """Fallback / development logger notification service."""

    def send_booking_confirmation(self, booking_data: dict) -> bool:
        logger.info(
            f"🌸 [NOTIFICATION] New Plate Booking: {booking_data.get('id')} | "
            f"Customer: {booking_data.get('customer_name')} ({booking_data.get('phone')}) | "
            f"Occasion: {booking_data.get('occasion')} | "
            f"Plates: {booking_data.get('plate_count')} | "
            f"Date: {booking_data.get('function_date')}"
        )
        return True

    def send_quote_notification(self, booking_data: dict, amount: float) -> bool:
        logger.info(
            f"🌸 [NOTIFICATION] Quote Ready: {booking_data.get('id')} | "
            f"Customer: {booking_data.get('customer_name')} | "
            f"Amount: ₹{amount:,.2f}"
        )
        return True

    def send_status_update(self, booking_data: dict, new_status: str) -> bool:
        logger.info(
            f"🌸 [NOTIFICATION] Status Changed: {booking_data.get('id')} -> {new_status}"
        )
        return True

    def send_password_reset_otp(self, email: str, otp: str) -> bool:
        logger.info(
            f"🔑 [PASSWORD RESET OTP] Target: {email} | OTP Code: {otp} (Valid for 10 minutes)"
        )
        return True

    def send_sms_otp(self, phone: str, otp: str) -> bool:
        logger.info(
            f"📱 [SMS GATEWAY DISPATCH] To: {phone} | Code: {otp} | Message: Your BRB Decors 6-digit OTP code is {otp}."
        )
        return True

    def send_whatsapp_otp(self, phone: str, otp: str) -> bool:
        logger.info(
            f"💬 [WHATSAPP DISPATCH] To: {phone} | Code: {otp} | Message: 🌸 BRB Decors: Your verification OTP is {otp}"
        )
        return True


class ResendEmailNotificationService(BaseNotificationService):
    """Resend email provider for customer notifications."""

    def __init__(self, api_key: str, from_email: str):
        self.api_key = api_key
        self.from_email = from_email

    def send_booking_confirmation(self, booking_data: dict) -> bool:
        if not self.api_key or not booking_data.get("email"):
            return False
        try:
            url = "https://api.resend.com/emails"
            headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
            payload = {
                "from": self.from_email,
                "to": [booking_data["email"]],
                "subject": f"🌸 BRB Decors — Your Plate Plan is Received! ({booking_data['id']})",
                "html": f"""
                <div style="font-family: serif; color: #2B1A2E; background: #FBF6EC; padding: 24px; border-radius: 16px;">
                    <h2 style="color: #2F5D3A;">Vanakkam {booking_data.get('customer_name', 'Client')}!</h2>
                    <p>We have lovingly recorded your ceremonial plating request for <strong>{booking_data.get('plate_count')} plates</strong> on <strong>{booking_data.get('function_date')}</strong>.</p>
                    <p><strong>Occasion:</strong> {booking_data.get('occasion')}</p>
                    <p><strong>Service Type:</strong> {booking_data.get('service_type')}</p>
                    <hr style="border: 0; border-top: 1px solid #E8DAC8; margin: 20px 0;" />
                    <p style="font-size: 13px; color: #635166;">BRB Decors, Tamil Nadu — Arranged with love, plate by plate.</p>
                </div>
                """,
            }
            with httpx.Client(timeout=5.0) as client:
                res = client.post(url, headers=headers, json=payload)
                return res.status_code in [200, 201]
        except Exception as e:
            logger.warning(f"Failed to send Resend email: {e}")
            return False

    def send_quote_notification(self, booking_data: dict, amount: float) -> bool:
        return True

    def send_status_update(self, booking_data: dict, new_status: str) -> bool:
        return True

    def send_password_reset_otp(self, email: str, otp: str) -> bool:
        if not self.api_key or not email:
            logger.info(f"🔑 [OTP Fallback Logger] Email: {email} | OTP: {otp}")
            return True
        try:
            url = "https://api.resend.com/emails"
            headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
            payload = {
                "from": self.from_email,
                "to": [email],
                "subject": "🌸 BRB Decors — Your Password Reset OTP",
                "html": f"""
                <div style="font-family: serif; color: #2B1A2E; background: #FBF6EC; padding: 24px; border-radius: 16px; border: 2px solid #E4C580;">
                    <h2 style="color: #2F5D3A;">Password Reset Verification</h2>
                    <p>Vanakkam! We received a request to reset your password for your BRB Decors account.</p>
                    <p>Your one-time 6-digit verification code is:</p>
                    <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #2F5D3A; background: #FFFDF9; padding: 16px; border-radius: 12px; border: 1px solid #E8DAC8; text-align: center; margin: 20px 0;">
                        {otp}
                    </div>
                    <p style="font-size: 12px; color: #635166;">This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
                    <hr style="border: 0; border-top: 1px solid #E8DAC8; margin: 20px 0;" />
                    <p style="font-size: 11px; color: #8B5E14;">BRB Decors Ceremonial Studio — Tamil Nadu</p>
                </div>
                """,
            }
            with httpx.Client(timeout=5.0) as client:
                res = client.post(url, headers=headers, json=payload)
                return res.status_code in [200, 201]
        except Exception as e:
            logger.warning(f"Failed to send OTP via Resend: {e}")
            return True


class WhatsAppCloudNotificationService(BaseNotificationService):
    """WhatsApp Cloud API provider for instant messaging."""

    def __init__(self, token: str, phone_number_id: str):
        self.token = token
        self.phone_number_id = phone_number_id

    def send_booking_confirmation(self, booking_data: dict) -> bool:
        if not self.token or not self.phone_number_id:
            return False
        try:
            url = f"https://graph.facebook.com/v18.0/{self.phone_number_id}/messages"
            headers = {"Authorization": f"Bearer {self.token}", "Content-Type": "application/json"}
            recipient_phone = booking_data.get("phone", "").replace("+", "").replace(" ", "").replace("-", "")
            if not recipient_phone.startswith("91") and len(recipient_phone) == 10:
                recipient_phone = "91" + recipient_phone

            payload = {
                "messaging_product": "whatsapp",
                "to": recipient_phone,
                "type": "text",
                "text": {
                    "body": (
                        f"🌸 Vanakkam from BRB Decors!\n\n"
                        f"Your ceremonial plate inquiry ({booking_data.get('id')}) has been received.\n"
                        f"Plates: {booking_data.get('plate_count')}\n"
                        f"Function Date: {booking_data.get('function_date')}\n\n"
                        f"Our decorator is reviewing flower availability and will message you shortly!"
                    )
                },
            }
            with httpx.Client(timeout=5.0) as client:
                res = client.post(url, headers=headers, json=payload)
                return res.status_code in [200, 201]
        except Exception as e:
            logger.warning(f"Failed to send WhatsApp Cloud notification: {e}")
            return False

    def send_quote_notification(self, booking_data: dict, amount: float) -> bool:
        return True

    def send_status_update(self, booking_data: dict, new_status: str) -> bool:
        return True

    def send_password_reset_otp(self, recipient: str, otp: str) -> bool:
        if not self.token or not self.phone_number_id or not recipient:
            return False
        digits = "".join(c for c in recipient if c.isdigit())
        if len(digits) < 10:
            return False
        if len(digits) == 10:
            digits = "91" + digits
        try:
            url = f"https://graph.facebook.com/v18.0/{self.phone_number_id}/messages"
            headers = {"Authorization": f"Bearer {self.token}", "Content-Type": "application/json"}
            payload = {
                "messaging_product": "whatsapp",
                "to": digits,
                "type": "text",
                "text": {
                    "body": (
                        f"🌸 Vanakkam from BRB Decors!\n\n"
                        f"Your 6-digit password verification code is: *{otp}*\n\n"
                        f"This code expires in 10 minutes. Please enter this code on the website to reset your password."
                    )
                },
            }
            with httpx.Client(timeout=5.0) as client:
                res = client.post(url, headers=headers, json=payload)
                return res.status_code in [200, 201]
        except Exception as e:
            logger.warning(f"Failed to send WhatsApp OTP: {e}")
            return False


class Fast2SMSNotificationService(BaseNotificationService):
    """Instant Indian mobile SMS gateway (fast2sms.com)."""

    def __init__(self, api_key: str):
        self.api_key = api_key

    def send_booking_confirmation(self, booking_data: dict) -> bool:
        return True

    def send_quote_notification(self, booking_data: dict, amount: float) -> bool:
        return True

    def send_status_update(self, booking_data: dict, new_status: str) -> bool:
        return True

    def send_password_reset_otp(self, recipient: str, otp: str) -> bool:
        if not self.api_key or not recipient:
            return False
        digits = "".join(c for c in recipient if c.isdigit())
        if len(digits) < 10:
            return False
        digits = digits[-10:]
        try:
            url = f"https://www.fast2sms.com/dev/bulkV2?authorization={self.api_key}&route=otp&variables_values={otp}&numbers={digits}"
            with httpx.Client(timeout=5.0) as client:
                res = client.get(url)
                return res.status_code == 200
        except Exception as e:
            logger.warning(f"Failed to send Fast2SMS OTP: {e}")
            return False


class SMTPNotificationService(BaseNotificationService):
    """Direct SMTP email service (supports Gmail, Outlook, AWS SES SMTP, etc.)."""

    def __init__(self, host: str, port: int, user: str, password: str, from_email: str):
        self.host = host
        self.port = port
        self.user = user
        self.password = password
        self.from_email = from_email or user

    def send_booking_confirmation(self, booking_data: dict) -> bool:
        return True

    def send_quote_notification(self, booking_data: dict, amount: float) -> bool:
        return True

    def send_status_update(self, booking_data: dict, new_status: str) -> bool:
        return True

    def send_password_reset_otp(self, email: str, otp: str) -> bool:
        if not self.user or not self.password or not email:
            return False
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = "🌸 BRB Decors — Your Password Reset OTP"
            msg["From"] = self.from_email
            msg["To"] = email

            html = f"""
            <div style="font-family: serif; color: #2B1A2E; background: #FBF6EC; padding: 24px; border-radius: 16px; border: 2px solid #E4C580;">
                <h2 style="color: #2F5D3A;">Password Reset Verification</h2>
                <p>Vanakkam! We received a request to reset your password for your BRB Decors account.</p>
                <p>Your one-time 6-digit verification code is:</p>
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #2F5D3A; background: #FFFDF9; padding: 16px; border-radius: 12px; border: 1px solid #E8DAC8; text-align: center; margin: 20px 0;">
                    {otp}
                </div>
                <p style="font-size: 12px; color: #635166;">This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
                <hr style="border: 0; border-top: 1px solid #E8DAC8; margin: 20px 0;" />
                <p style="font-size: 11px; color: #8B5E14;">BRB Decors Ceremonial Studio — Tamil Nadu</p>
            </div>
            """
            msg.attach(MIMEText(html, "html"))

            with smtplib.SMTP(self.host, self.port, timeout=10) as server:
                server.starttls()
                server.login(self.user, self.password)
                server.sendmail(self.from_email, [email], msg.as_string())
            logger.info(f"📧 Sent OTP email to {email} via SMTP")
            return True
        except Exception as e:
            logger.warning(f"Failed to send OTP via SMTP: {e}")
            return False


class CompositeNotificationService(BaseNotificationService):
    """Dispatches to multiple active notification providers."""

    def __init__(self, services: List[BaseNotificationService]):
        self.services = services

    def send_booking_confirmation(self, booking_data: dict) -> bool:
        results = [s.send_booking_confirmation(booking_data) for s in self.services]
        return any(results)

    def send_quote_notification(self, booking_data: dict, amount: float) -> bool:
        results = [s.send_quote_notification(booking_data, amount) for s in self.services]
        return any(results)

    def send_status_update(self, booking_data: dict, new_status: str) -> bool:
        results = [s.send_status_update(booking_data, new_status) for s in self.services]
        return any(results)

    def send_password_reset_otp(self, email: str, otp: str) -> bool:
        results = [s.send_password_reset_otp(email, otp) for s in self.services]
        return any(results)

    def send_sms_otp(self, phone: str, otp: str) -> bool:
        results = [s.send_sms_otp(phone, otp) for s in self.services]
        return any(results)

    def send_whatsapp_otp(self, phone: str, otp: str) -> bool:
        results = [s.send_whatsapp_otp(phone, otp) for s in self.services]
        return any(results)


def get_notification_service() -> BaseNotificationService:
    providers: List[BaseNotificationService] = [ConsoleNotificationService()]

    if settings.ENABLE_RESEND_EMAIL and settings.RESEND_API_KEY:
        providers.append(
            ResendEmailNotificationService(
                api_key=settings.RESEND_API_KEY,
                from_email=settings.RESEND_FROM_EMAIL,
            )
        )

    if (settings.ENABLE_SMTP_EMAIL or settings.SMTP_USER) and settings.SMTP_PASSWORD:
        providers.append(
            SMTPNotificationService(
                host=settings.SMTP_HOST,
                port=settings.SMTP_PORT,
                user=settings.SMTP_USER,
                password=settings.SMTP_PASSWORD,
                from_email=settings.SMTP_FROM_EMAIL or settings.SMTP_USER,
            )
        )

    if settings.ENABLE_WHATSAPP_CLOUD and settings.WHATSAPP_API_TOKEN:
        providers.append(
            WhatsAppCloudNotificationService(
                token=settings.WHATSAPP_API_TOKEN,
                phone_number_id=settings.WHATSAPP_PHONE_NUMBER_ID,
            )
        )

    if settings.FAST2SMS_API_KEY:
        providers.append(Fast2SMSNotificationService(api_key=settings.FAST2SMS_API_KEY))

    return CompositeNotificationService(providers)
