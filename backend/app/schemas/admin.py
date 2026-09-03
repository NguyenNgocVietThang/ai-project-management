"""Schema cho trang Admin: quản lý người dùng, quản lý role/permission, audit log."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, field_validator

from app.core.security import validate_password_policy
from app.schemas.user import UserResponse

# ─── Người dùng ─────────────────────────────────────────────────────────────


class AdminUserCreate(BaseModel):
    email: EmailStr
    username: str = Field(min_length=3, max_length=50, pattern=r"^[a-zA-Z0-9_]+$")
    full_name: str = Field(min_length=2, max_length=100)
    password: str = Field(min_length=12, max_length=100)
    role_ids: list[int] = Field(default_factory=list)
    is_active: bool = True

    @field_validator("password")
    @classmethod
    def password_meets_policy(cls, value: str) -> str:
        return validate_password_policy(value)

    @field_validator("full_name")
    @classmethod
    def full_name_not_blank(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("Value must not be blank")
        return normalized


class AdminUserUpdate(BaseModel):
    full_name: Optional[str] = Field(default=None, min_length=2, max_length=100)
    username: Optional[str] = Field(
        default=None, min_length=3, max_length=50, pattern=r"^[a-zA-Z0-9_]+$"
    )
    phone: Optional[str] = Field(default=None, max_length=20)
    position: Optional[str] = Field(default=None, max_length=100)
    department: Optional[str] = Field(default=None, max_length=100)
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None
    role_ids: Optional[list[int]] = None

    @field_validator("full_name", "username")
    @classmethod
    def required_strings_are_not_blank(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return value
        normalized = value.strip()
        if not normalized:
            raise ValueError("Value must not be blank")
        return normalized


class AdminUserResponse(UserResponse):
    created_at: datetime


# ─── Roles & Permissions ────────────────────────────────────────────────────


class PermissionResponse(BaseModel):
    id: int
    resource: str
    action: str
    description: Optional[str] = None

    model_config = {"from_attributes": True}


class RoleCreate(BaseModel):
    name: str = Field(min_length=2, max_length=50)
    description: Optional[str] = Field(default=None, max_length=1000)
    permission_ids: list[int] = Field(default_factory=list)

    @field_validator("name")
    @classmethod
    def name_not_blank(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("Value must not be blank")
        return normalized


class RoleUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=2, max_length=50)
    description: Optional[str] = Field(default=None, max_length=1000)
    permission_ids: Optional[list[int]] = None

    @field_validator("name")
    @classmethod
    def name_not_blank(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return value
        normalized = value.strip()
        if not normalized:
            raise ValueError("Value must not be blank")
        return normalized


class RoleDetailResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    permissions: list[PermissionResponse] = []
    user_count: int = 0

    model_config = {"from_attributes": True}


# ─── Audit Log ──────────────────────────────────────────────────────────────


class AuditActorSummary(BaseModel):
    id: int
    full_name: str
    email: str

    model_config = {"from_attributes": True}


class AuditLogResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    user: Optional[AuditActorSummary] = None
    action: str
    entity_type: str
    entity_id: Optional[int] = None
    old_values: Optional[dict] = None
    new_values: Optional[dict] = None
    ip_address: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}
