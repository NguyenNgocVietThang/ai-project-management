from datetime import date, datetime
from typing import Any, Optional

from pydantic import BaseModel, Field, field_validator, model_validator

from app.models.project import ProjectMethodology, ProjectStatus


class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=200)
    description: Optional[str] = Field(default=None, max_length=5000)
    portfolio_id: Optional[int] = None
    start_date: date
    end_date: date
    budget: Optional[float] = Field(default=None, ge=0)
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
    def normalize_description(cls, value: Optional[str]) -> Optional[str]:
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
    name: Optional[str] = Field(default=None, min_length=3, max_length=200)
    description: Optional[str] = Field(default=None, max_length=5000)
    portfolio_id: Optional[int] = None
    status: Optional[ProjectStatus] = None
    methodology: Optional[ProjectMethodology] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    budget: Optional[float] = Field(default=None, ge=0)
    currency: Optional[str] = Field(default=None, min_length=3, max_length=10)

    @field_validator("name")
    @classmethod
    def normalize_name(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        normalized = value.strip()
        if len(normalized) < 3:
            raise ValueError("Name must contain at least 3 non-whitespace characters")
        return normalized

    @field_validator("description")
    @classmethod
    def normalize_description(cls, value: Optional[str]) -> Optional[str]:
        return value.strip() or None if value is not None else None

    @field_validator("currency")
    @classmethod
    def normalize_currency(cls, value: Optional[str]) -> Optional[str]:
        return value.strip().upper() if value else value


class ProjectMemberCreate(BaseModel):
    user_id: int = Field(..., gt=0)
    role_id: int = Field(..., gt=0)


class UserSummary(BaseModel):
    id: int
    full_name: str
    username: str
    email: str
    avatar_url: Optional[str] = None

    model_config = {"from_attributes": True}


class RoleSummary(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

    model_config = {"from_attributes": True}


class ProjectCapabilities(BaseModel):
    can_update: bool
    can_delete: bool
    can_manage_members: bool


class ProjectSummaryResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    status: str
    methodology: str
    start_date: Optional[date]
    end_date: Optional[date]
    progress_percent: float
    budget: Optional[float]
    budget_spent: float
    currency: str
    portfolio_id: Optional[int]
    portfolio_name: Optional[str]
    pm_id: int
    member_count: int
    created_at: datetime
    updated_at: datetime
    current_user_role: Optional[str]
    capabilities: ProjectCapabilities


class ProjectResponse(ProjectSummaryResponse):
    pass


class PhaseSummary(BaseModel):
    id: int
    name: str
    status: str
    order_index: int
    start_date: Optional[date]
    end_date: Optional[date]

    model_config = {"from_attributes": True}


class MilestoneSummary(BaseModel):
    id: int
    name: str
    description: Optional[str]
    status: str
    due_date: Optional[date]
    completed_at: Optional[datetime]

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
    old_values: Optional[dict[str, Any]]
    new_values: Optional[dict[str, Any]]
    description: Optional[str]
    created_at: datetime
    actor: Optional[UserSummary]
