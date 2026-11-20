from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict


class LoginRequest(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    identifier: Optional[str] = None
    password: str

    def get_login_identifier(self) -> str:
        return (self.identifier or self.username or self.email or "").strip()


class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: Optional[str] = None


class AdminCredentialsUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    email: Optional[EmailStr] = None


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user_email: str
    user_username: Optional[str] = None
    user_role: str
    user_name: Optional[str] = None


class TokenData(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    role: Optional[str] = None


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: Optional[str] = None
    email: str
    full_name: Optional[str] = None
    role: str
    is_active: bool
