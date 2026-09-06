from datetime import date, datetime
from typing import Any

from pydantic import BaseModel, Field, field_validator, model_validator

from app.models.project import ProjectMethodology, ProjectStatus


class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=200)
    description: str | None = Field(default=None, max_length=5000)
    portfolio_id: int | None = None
    start_date: date
    end_date: date
    budget: float | None = Field(default=None, ge=0)
    currency: str = Field(default="VND", min_length=3, max_length=10)
    methodology: ProjectMethodology = ProjectMethodology.AGILE

    @field_validator("name")
    @classmethod
    def normalize_name(cls, value: str) -> str:
        normalized = value.strip()
        if len(normalized) < 3:
            raise ValueError("Name must contain at least 3 non-whitespace characters")
        return normalized

    @field_validator("description")
    @classmethod
    def normalize_description(cls, value: str | None) -> str | None:
        return value.strip() or None if value is not None else None

    @field_validator("currency")
    @classmethod
    def normalize_currency(cls, value: str) -> str:
        return value.strip().upper()

    @model_validator(mode="after")
    def dates_are_ordered(self):
        if self.end_date < self.start_date:
            raise ValueError("End date must be on or after start date")
        return self


class ProjectUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=3, max_length=200)
    description: str | None = Field(default=None, max_length=5000)
    portfolio_id: int | None = None
    status: ProjectStatus | None = None
    methodology: ProjectMethodology | None = None
    start_date: date | None = None
    end_date: date | None = None
    budget: float | None = Field(default=None, ge=0)
    currency: str | None = Field(default=None, min_length=3, max_length=10)

    @field_validator("name")
    @classmethod
    def normalize_name(cls, value: str | None) -> str | None:
        if value is None:
            return None
        normalized = value.strip()
        if len(normalized) < 3:
            raise ValueError("Name must contain at least 3 non-whitespace characters")
        return normalized

    @field_validator("description")
    @classmethod
    def normalize_description(cls, value: str | None) -> str | None:
        return value.strip() or None if value is not None else None

    @field_validator("currency")
    @classmethod
    def normalize_currency(cls, value: str | None) -> str | None:
        return value.strip().upper() if value else value

    @model_validator(mode="after")
    def dates_are_ordered(self):
        """Cung rang buoc nhu khi tao.

        Chi Create co kiem tra nay, nen mot lan PATCH van dat duoc end_date truoc
        start_date - va scheduling_service dung project.start_date lam moc neo cho
        toan bo CPM, nen mot du an co ngay dao nguoc lam hong ca lich trinh.
        """
        if self.start_date and self.end_date and self.end_date < self.start_date:
            raise ValueError("End date must be on or after start date")
        return self


class ProjectMemberRoleUpdate(BaseModel):
    role_id: int = Field(..., gt=0)


class ProjectMemberCreate(BaseModel):
    user_id: int = Field(..., gt=0)
    role_id: int = Field(..., gt=0)


class UserSummary(BaseModel):
    id: int
    full_name: str
    username: str
    email: str
    avatar_url: str | None = None

    model_config = {"from_attributes": True}


class UserSearchResult(BaseModel):
    """Kết quả tìm kiếm cho bộ chọn thành viên.

    `email` được che bớt. Địa chỉ đầy đủ biến /users/search thành công cụ thu thập:
    bất kỳ tài khoản nào cũng quét được theo tên miền ("@company.com") và lấy về
    toàn bộ danh bạ nhân sự. Phần còn lại đủ để phân biệt hai người trùng tên, mà
    không phát tán thứ có thể đem đi spam hay phishing.
    """
    id: int
    full_name: str
    username: str
    email_hint: str
    avatar_url: str | None = None


class RoleSummary(BaseModel):
    id: int
    name: str
    description: str | None = None

    model_config = {"from_attributes": True}


class ProjectCapabilities(BaseModel):
    can_update: bool
    can_delete: bool
    can_manage_members: bool


class ProjectSummaryResponse(BaseModel):
    id: int
    name: str
    description: str | None
    status: str
    methodology: str
    start_date: date | None
    end_date: date | None
    progress_percent: float
    budget: float | None
    budget_spent: float
    currency: str
    portfolio_id: int | None
    portfolio_name: str | None
    pm_id: int
    member_count: int
    created_at: datetime
    updated_at: datetime
    current_user_role: str | None
    capabilities: ProjectCapabilities


class ProjectResponse(ProjectSummaryResponse):
    pass


class PhaseSummary(BaseModel):
    id: int
    name: str
    status: str
    order_index: int
    start_date: date | None
    end_date: date | None

    model_config = {"from_attributes": True}


class MilestoneSummary(BaseModel):
    id: int
    name: str
    description: str | None
    status: str
    due_date: date | None
    completed_at: datetime | None

    model_config = {"from_attributes": True}


class ProjectDetailResponse(ProjectSummaryResponse):
    owner: UserSummary
    task_count: int
    completed_task_count: int
    phases: list[PhaseSummary]
    milestones: list[MilestoneSummary]


class ProjectMemberResponse(BaseModel):
    user: UserSummary
    role: RoleSummary
    joined_at: datetime
    is_owner: bool


class AuditEventResponse(BaseModel):
    id: int
    action: str
    old_values: dict[str, Any] | None
    new_values: dict[str, Any] | None
    description: str | None
    created_at: datetime
    actor: UserSummary | None
