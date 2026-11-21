from datetime import timedelta, datetime
import random
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models.entities import User
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    AdminCredentialsUpdate,
    Token,
    UserOut,
)
from app.utils.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_admin,
    get_current_user,
)
from app.services.notification import get_notification_service

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/login", response_model=Token)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    ident = credentials.get_login_identifier()
    if not ident:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email is required",
        )

    # Allow login by username OR email (case-insensitive)
    user = (
        db.query(User)
        .filter(
            (User.email.ilike(ident))
            | (User.username.ilike(ident))
        )
        .first()
    )

    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive",
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role},
        expires_delta=access_token_expires,
    )

    return Token(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user_email=user.email,
        user_username=user.username,
        user_role=user.role,
        user_name=user.full_name or user.username or user.email,
        user_phone=user.phone,
    )


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    clean_email = req.email.strip().lower()
    if req.username and req.username.strip():
        clean_username = req.username.strip()
    else:
        base_user = clean_email.split("@")[0].replace("+", "_")
        clean_username = base_user
        counter = 1
        while db.query(User).filter(User.username.ilike(clean_username)).first():
            clean_username = f"{base_user}{counter}"
            counter += 1

    if len(clean_username) < 3:
        clean_username = f"{clean_username}_user"
    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    # Check for existing email or username
    existing_email = db.query(User).filter(User.email.ilike(clean_email)).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    if req.username and req.username.strip():
        existing_username = db.query(User).filter(User.username.ilike(clean_username)).first()
        if existing_username:
            raise HTTPException(status_code=400, detail="This username is already taken")

    new_user = User(
        username=clean_username,
        email=clean_email,
        full_name=req.full_name.strip() if req.full_name else clean_username,
        phone=req.phone.strip() if req.phone else None,
        password_hash=get_password_hash(req.password),
        role="customer",
        is_active=True,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user.email, "role": new_user.role},
        expires_delta=access_token_expires,
    )

    return Token(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user_email=new_user.email,
        user_username=new_user.username,
        user_role=new_user.role,
        user_name=new_user.full_name,
        user_phone=new_user.phone,
    )


def find_user_by_identifier(ident: str, db: Session) -> Optional[User]:
    clean = ident.strip()
    if not clean:
        return None
    if "@" in clean:
        return db.query(User).filter(User.email.ilike(clean.lower())).first()

    # Digits for phone number check
    digits = "".join(c for c in clean if c.isdigit())
    if len(digits) >= 10:
        last_10 = digits[-10:]
        user = db.query(User).filter(User.phone.like(f"%{last_10}%")).first()
        if user:
            return user

    # Fallback to username
    return db.query(User).filter(User.username.ilike(clean)).first()


@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    ident = (req.identifier or req.phone or req.email or "").strip()
    if not ident:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide your registered mobile number or email address.",
        )

    user = find_user_by_identifier(ident, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No registered account found with this mobile number or email address.",
        )

    otp = f"{random.randint(100000, 999999)}"
    user.otp_code = otp
    user.otp_expires_at = datetime.utcnow() + timedelta(minutes=10)
    db.commit()

    notifier = get_notification_service()
    if user.email:
        notifier.send_password_reset_otp(user.email, otp)
    if user.phone:
        notifier.send_password_reset_otp(user.phone, otp)

    is_mobile_req = "@" not in ident and any(c.isdigit() for c in ident)
    recipient_label = user.phone if is_mobile_req and user.phone else user.email

    phone_clean = user.phone or ""
    clean_digits = "".join(c for c in phone_clean if c.isdigit())
    if len(clean_digits) == 10:
        clean_digits = f"91{clean_digits}"

    return {
        "status": "success",
        "message": f"6-digit verification code generated for {recipient_label}.",
        "identifier": recipient_label,
        "email": user.email,
        "phone": user.phone,
        "whatsapp_url": f"https://wa.me/{clean_digits}?text=🌸+BRB+Decors:+Your+verification+OTP+code+is+*{otp}*" if clean_digits else None,
        "dev_otp": otp,
    }


@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    ident = (req.identifier or req.phone or req.email or "").strip()
    if not ident:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Identifier is required",
        )

    user = find_user_by_identifier(ident, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found",
        )
    if not user.otp_code or not user.otp_expires_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No OTP request active for this account. Please request a new code.",
        )
    if user.otp_expires_at < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This OTP has expired. Please request a new one.",
        )
    if user.otp_code.strip() != req.otp.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect OTP code. Please enter the 6-digit code received on your mobile or email.",
        )
    if len(req.new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters long.",
        )

    user.password_hash = get_password_hash(req.new_password)
    user.otp_code = None
    user.otp_expires_at = None
    db.commit()

    return {
        "status": "success",
        "message": "Password changed successfully! You can now sign in with your new password.",
    }


@router.patch("/admin/credentials", response_model=UserOut)
def update_admin_credentials(
    creds: AdminCredentialsUpdate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Allows authenticated admin/creator to update their own username and password."""
    if creds.username:
        clean_user = creds.username.strip()
        # Verify not conflicting with someone else
        conflict = (
            db.query(User)
            .filter(User.username.ilike(clean_user), User.id != current_admin.id)
            .first()
        )
        if conflict:
            raise HTTPException(status_code=400, detail="Username is already taken by another user")
        current_admin.username = clean_user

    if creds.email:
        clean_email = creds.email.strip().lower()
        conflict = (
            db.query(User)
            .filter(User.email.ilike(clean_email), User.id != current_admin.id)
            .first()
        )
        if conflict:
            raise HTTPException(status_code=400, detail="Email is already in use by another user")
        current_admin.email = clean_email

    if creds.password:
        if len(creds.password) < 6:
            raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
        current_admin.password_hash = get_password_hash(creds.password)

    db.commit()
    db.refresh(current_admin)
    return current_admin


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
