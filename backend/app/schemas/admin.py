"""Schema cho trang Admin: quản lý người dùng, quản lý role/permission, audit log."""

from datetime import datetime

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
    full_name: str | None = Field(default=None, min_length=2, max_length=100)
    username: str | None = Field(
        default=None, min_length=3, max_length=50, pattern=r"^[a-zA-Z0-9_]+$"
    )
    phone: str | None = Field(default=None, max_length=20)
    position: str | None = Field(default=None, max_length=100)
    department: str | None = Field(default=None, max_length=100)
    is_active: bool | None = None
    is_superuser: bool | None = None
    role_ids: list[int] | None = None

    @field_validator("full_name", "username")
    @classmethod
    def required_strings_are_not_blank(cls, value: str | None) -> str | None:
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
    description: str | None = None

    model_config = {"from_attributes": True}


class RoleCreate(BaseModel):
    name: str = Field(min_length=2, max_length=50)
    description: str | None = Field(default=None, max_length=1000)
    permission_ids: list[int] = Field(default_factory=list)

    @field_validator("name")
    @classmethod
    def name_not_blank(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("Value must not be blank")
        return normalized


class RoleUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=50)
    description: str | None = Field(default=None, max_length=1000)
    permission_ids: list[int] | None = None

    @field_validator("name")
    @classmethod
    def name_not_blank(cls, value: str | None) -> str | None:
        if value is None:
            return value
        normalized = value.strip()
        if not normalized:
            raise ValueError("Value must not be blank")
        return normalized


class RoleDetailResponse(BaseModel):
    id: int
    name: str
    description: str | None = None
    permissions: list[PermissionResponse] = []
    user_count: int = 0

    model_config = {"from_attributes": True}


class RoleOptionResponse(BaseModel):
    """Chỉ đủ để đổ vào một bộ chọn vai trò dự án.

    Cố tình bỏ `permissions`: RoleDetailResponse mang toàn bộ ma trận
    role -> permission của hệ thống, và route này mở cho mọi người dùng đã đăng
    nhập vì bất kỳ PM nào cũng cần nó để mời thành viên. Phát tán bản đồ quyền đầy
    đủ cho mọi tài khoản là món quà trinh sát cho việc leo thang quyền.
    """
    id: int
    name: str
    description: str | None = None

    model_config = {"from_attributes": True}


# ─── Audit Log ──────────────────────────────────────────────────────────────


class AuditActorSummary(BaseModel):
    id: int
    full_name: str
    email: str

    model_config = {"from_attributes": True}


class AuditLogResponse(BaseModel):
    id: int
    user_id: int | None = None
    user: AuditActorSummary | None = None
    action: str
    entity_type: str
    entity_id: int | None = None
    old_values: dict | None = None
    new_values: dict | None = None
    ip_address: str | None = None
    description: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}
