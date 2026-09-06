from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, Field, model_validator

from app.schemas.task import TaskResponse


class DateRangeMixin(BaseModel):
    start_date: date | None = None
    end_date: date | None = None

    @model_validator(mode="after")
    def validate_dates(self):
        if self.start_date and self.end_date and self.end_date < self.start_date:
            raise ValueError("End date must be on or after start date")
        return self


class PhaseCreate(DateRangeMixin):
    name: str = Field(min_length=3, max_length=255)
    description: str | None = None
    order_index: int | None = Field(default=None, ge=0)


class PhaseUpdate(DateRangeMixin):
    name: str | None = Field(default=None, min_length=3, max_length=255)
    description: str | None = None
    status: Literal["PLANNED", "IN_PROGRESS", "COMPLETED", "ON_HOLD"] | None = None
    order_index: int | None = Field(default=None, ge=0)


class PhaseResponse(BaseModel):
    id: int
    project_id: int
    name: str
    description: str | None
    status: str
    order_index: int
    start_date: date | None
    end_date: date | None
    created_at: datetime
    model_config = {"from_attributes": True}


class SprintCreate(DateRangeMixin):
    name: str = Field(min_length=3, max_length=255)
    goal: str | None = None


class SprintUpdate(DateRangeMixin):
    name: str | None = Field(default=None, min_length=3, max_length=255)
    goal: str | None = None
    phase_id: int | None = None
    status: Literal["PLANNED", "ACTIVE", "COMPLETED", "CANCELLED"] | None = None


class SprintResponse(BaseModel):
    id: int
    project_id: int
    phase_id: int | None
    name: str
    goal: str | None
    status: str
    start_date: date | None
    end_date: date | None
    story_points_committed: int
    story_points_completed: int
    velocity: float
    model_config = {"from_attributes": True}


class EpicCreate(BaseModel):
    name: str = Field(min_length=3, max_length=255)
    description: str | None = None
    color: str | None = Field(default=None, pattern=r"^#[0-9A-Fa-f]{6}$")


class EpicUpdate(EpicCreate):
    name: str | None = Field(default=None, min_length=3, max_length=255)
    status: Literal["OPEN", "IN_PROGRESS", "DONE", "CLOSED"] | None = None


class EpicResponse(BaseModel):
    id: int
    project_id: int
    name: str
    description: str | None
    status: str
    story_points: int
    color: str | None
    model_config = {"from_attributes": True}


class MilestoneCreate(BaseModel):
    name: str = Field(min_length=3, max_length=255)
    description: str | None = None
    due_date: date | None = None


class MilestoneUpdate(MilestoneCreate):
    name: str | None = Field(default=None, min_length=3, max_length=255)
    status: Literal["PENDING", "AT_RISK", "COMPLETED", "MISSED"] | None = None


class MilestoneResponse(BaseModel):
    id: int
    project_id: int
    name: str
    description: str | None
    due_date: date | None
    status: str
    completed_at: datetime | None
    model_config = {"from_attributes": True}


class SprintNode(SprintResponse):
    # Rong khi include_tasks=false; task_count van luon co nghia.
    tasks: list[TaskResponse] = Field(default_factory=list)
    task_count: int = 0


class PhaseNode(PhaseResponse):
    sprints: list[SprintNode] = Field(default_factory=list)
    tasks: list[TaskResponse] = Field(default_factory=list)
    task_count: int = 0


class WBSTree(BaseModel):
    """Cau truc phan ra cong viec cua mot du an.

    Mac dinh tra ve cau truc kem so dem, KHONG kem task. Truoc day cay nay luon
    mang theo moi task cua du an da serialize day du - va trang Tasks con goi song
    song `/tasks?page_size=200`, nen no tai toan bo du an hai lan chi de dung vai
    dropdown loc. Dat `include_tasks=true` khi thuc su can cay co task.
    """
    project_id: int
    phases: list[PhaseNode]
    unphased_sprints: list[SprintNode]
    unphased_tasks: list[TaskResponse]
    unphased_task_count: int = 0
    epics: list[EpicResponse]
    milestones: list[MilestoneResponse]
    includes_tasks: bool = False


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
