from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models.entities import User
from app.schemas.auth import LoginRequest, RegisterRequest, AdminCredentialsUpdate, Token, UserOut
from app.utils.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_admin,
    get_current_user,
)

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
    )


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    clean_username = req.username.strip()
    clean_email = req.email.strip().lower()

    if len(clean_username) < 3:
        raise HTTPException(status_code=400, detail="Username must be at least 3 characters")
    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    # Check for existing email or username
    existing_email = db.query(User).filter(User.email.ilike(clean_email)).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    existing_username = db.query(User).filter(User.username.ilike(clean_username)).first()
    if existing_username:
        raise HTTPException(status_code=400, detail="This username is already taken")

    new_user = User(
        username=clean_username,
        email=clean_email,
        full_name=req.full_name.strip() if req.full_name else clean_username,
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
    )


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
