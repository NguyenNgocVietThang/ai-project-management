from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field, field_validator

from app.core.security import validate_password_policy
from app.schemas.project import RoleSummary


class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(default=None, min_length=2, max_length=100)
    username: Optional[str] = Field(
        default=None,
        min_length=3,
        max_length=50,
        pattern=r"^[a-zA-Z0-9_]+$",
    )
    phone: Optional[str] = Field(default=None, max_length=20)
    position: Optional[str] = Field(default=None, max_length=100)
    department: Optional[str] = Field(default=None, max_length=100)

    @field_validator("full_name", "username")
    @classmethod
    def required_strings_are_not_blank(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return value
        normalized = value.strip()
        if not normalized:
            raise ValueError("Value must not be blank")
        return normalized

    @field_validator("phone", "position", "department")
    @classmethod
    def normalize_optional_strings(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        return value.strip() or None


class ChangePasswordRequest(BaseModel):
    current_password: Optional[str] = Field(default=None, max_length=100)
    new_password: str = Field(..., min_length=12, max_length=100)

    @field_validator("new_password")
    @classmethod
    def password_meets_policy(cls, value: str) -> str:
        return validate_password_policy(value)


class DeleteAccountRequest(BaseModel):
    username: str = Field(..., min_length=1, max_length=100)


class OAuthConnectResponse(BaseModel):
    authorization_url: str


OAuthProvider = Literal["google", "facebook"]


class UserResponse(UserBase):
    # Ghi đè UserBase.email (EmailStr): response phải phản ánh nguyên trạng dữ liệu đã lưu,
    # bao gồm cả các địa chỉ tổng hợp như "deleted_<id>_<hex>@deleted.invalid" do
    # quá trình ẩn danh của UserService.deactivate_account ghi ra — EmailStr từ chối
    # TLD ".invalid" được dành riêng (RFC 2606) và sẽ gây lỗi 500 với bất kỳ tài khoản
    # nào đã bị vô hiệu hóa/ẩn danh.
    email: str
    id: int
    is_active: bool
    is_superuser: bool
    email_verified: bool
    avatar_url: Optional[str] = None
    phone: Optional[str] = None
    position: Optional[str] = None
    department: Optional[str] = None
    hourly_rate: Optional[float] = None
    has_password: bool
    google_connected: bool
    facebook_connected: bool
    roles: list[RoleSummary] = []
    last_login: Optional[datetime] = None

    model_config = {"from_attributes": True}
