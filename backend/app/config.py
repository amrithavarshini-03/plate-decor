import json
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    APP_NAME: str = "BRB Decors API"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "sqlite:///./brb_decors.db"

    # Security & JWT
    SECRET_KEY: str = "brb_decors_super_secret_jwt_key_chennai_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    ADMIN_INITIAL_EMAIL: str = "admin@brbdecors.com"
    ADMIN_INITIAL_PASSWORD: str = "AdminDecors@2026"

    # Feature Flags
    ENABLE_PAYMENTS: bool = False
    ENABLE_WHATSAPP_CLOUD: bool = False
    ENABLE_RESEND_EMAIL: bool = False

    # Third Party
    RAZORPAY_KEY_ID: str = "rzp_test_placeholder"
    RAZORPAY_KEY_SECRET: str = "rzp_secret_placeholder"
    RESEND_API_KEY: str = ""
    RESEND_FROM_EMAIL: str = "bookings@brbdecors.com"
    WHATSAPP_API_TOKEN: str = ""
    WHATSAPP_PHONE_NUMBER_ID: str = ""
    CLOUDINARY_URL: str = ""

    # SMTP Email (Gmail / Custom)
    ENABLE_SMTP_EMAIL: bool = False
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = ""

    # Uploads directory
    UPLOADS_DIR: str = "uploads"

    # CORS
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v


settings = Settings()
