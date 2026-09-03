from pydantic import BaseModel, EmailStr, Field, field_validator

from app.core.security import validate_password_policy


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50, pattern=r"^[a-zA-Z0-9_]+$")
    full_name: str = Field(..., min_length=2, max_length=100)
    password: str = Field(..., min_length=12, max_length=100)

    @field_validator("password")
    @classmethod
    def password_meets_policy(cls, value: str) -> str:
        return validate_password_policy(value)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str = Field(..., min_length=1, max_length=512)
    new_password: str = Field(..., min_length=12, max_length=100)

    @field_validator("new_password")
    @classmethod
    def password_meets_policy(cls, value: str) -> str:
        return validate_password_policy(value)


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


class OAuthExchangeRequest(BaseModel):
    code: str = Field(..., min_length=1, max_length=512)


class LogoutRequest(BaseModel):
    # Để tùy chọn để một client đã mất refresh token vẫn có thể gọi
    # logout và nhận về 200 sạch sẽ thay vì lỗi validation.
    refresh_token: str | None = None


class TokenPayload(BaseModel):
    sub: str
    type: str
