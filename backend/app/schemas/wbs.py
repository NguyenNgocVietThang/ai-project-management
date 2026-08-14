from datetime import date, datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field, model_validator

from app.schemas.task import TaskResponse


class DateRangeMixin(BaseModel):
    start_date: Optional[date] = None
    end_date: Optional[date] = None

    @model_validator(mode="after")
    def validate_dates(self):
        if self.start_date and self.end_date and self.end_date < self.start_date:
            raise ValueError("End date must be on or after start date")
        return self


class PhaseCreate(DateRangeMixin):
    name: str = Field(min_length=3, max_length=255)
    description: Optional[str] = None
    order_index: Optional[int] = Field(default=None, ge=0)


class PhaseUpdate(DateRangeMixin):
    name: Optional[str] = Field(default=None, min_length=3, max_length=255)
    description: Optional[str] = None
    status: Optional[Literal["PLANNED", "IN_PROGRESS", "COMPLETED", "ON_HOLD"]] = None
    order_index: Optional[int] = Field(default=None, ge=0)


class PhaseResponse(BaseModel):
    id: int
    project_id: int
    name: str
    description: Optional[str]
    status: str
    order_index: int
    start_date: Optional[date]
    end_date: Optional[date]
    created_at: datetime
    model_config = {"from_attributes": True}


class SprintCreate(DateRangeMixin):
    name: str = Field(min_length=3, max_length=255)
    goal: Optional[str] = None


class SprintUpdate(DateRangeMixin):
    name: Optional[str] = Field(default=None, min_length=3, max_length=255)
    goal: Optional[str] = None
    phase_id: Optional[int] = None
    status: Optional[Literal["PLANNED", "ACTIVE", "COMPLETED", "CANCELLED"]] = None


class SprintResponse(BaseModel):
    id: int
    project_id: int
    phase_id: Optional[int]
    name: str
    goal: Optional[str]
    status: str
    start_date: Optional[date]
    end_date: Optional[date]
    story_points_committed: int
    story_points_completed: int
    velocity: float
    model_config = {"from_attributes": True}


class EpicCreate(BaseModel):
    name: str = Field(min_length=3, max_length=255)
    description: Optional[str] = None
    color: Optional[str] = Field(default=None, pattern=r"^#[0-9A-Fa-f]{6}$")


class EpicUpdate(EpicCreate):
    name: Optional[str] = Field(default=None, min_length=3, max_length=255)
    status: Optional[Literal["OPEN", "IN_PROGRESS", "DONE", "CLOSED"]] = None


class EpicResponse(BaseModel):
    id: int
    project_id: int
    name: str
    description: Optional[str]
    status: str
    story_points: int
    color: Optional[str]
    model_config = {"from_attributes": True}


class MilestoneCreate(BaseModel):
    name: str = Field(min_length=3, max_length=255)
    description: Optional[str] = None
    due_date: Optional[date] = None


class MilestoneUpdate(MilestoneCreate):
    name: Optional[str] = Field(default=None, min_length=3, max_length=255)
    status: Optional[Literal["PENDING", "AT_RISK", "COMPLETED", "MISSED"]] = None


class MilestoneResponse(BaseModel):
    id: int
    project_id: int
    name: str
    description: Optional[str]
    due_date: Optional[date]
    status: str
    completed_at: Optional[datetime]
    model_config = {"from_attributes": True}


class SprintNode(SprintResponse):
    tasks: list[TaskResponse] = Field(default_factory=list)


class PhaseNode(PhaseResponse):
    sprints: list[SprintNode] = Field(default_factory=list)
    tasks: list[TaskResponse] = Field(default_factory=list)


class WBSTree(BaseModel):
    project_id: int
    phases: list[PhaseNode]
    unphased_sprints: list[SprintNode]
    unphased_tasks: list[TaskResponse]
    epics: list[EpicResponse]
    milestones: list[MilestoneResponse]


class PhaseDeleteImpact(BaseModel):
    phase_id: int
    phase_name: str
    sprint_count: int
    task_count: int
    subtask_count: int
    internal_dependency_count: int
    external_dependency_count: int
    assignment_count: int
    worklog_count: int
    comment_count: int


PhaseDeleteStrategy = Literal["cascade", "reassign", "unlink"]
