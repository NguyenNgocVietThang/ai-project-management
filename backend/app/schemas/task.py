from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, Field, model_validator

TaskStatusValue = Literal["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE", "BLOCKED"]
TaskPriorityValue = Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]


class TaskCreate(BaseModel):
    name: str = Field(min_length=3, max_length=255)
    description: str | None = None
    phase_id: int | None = None
    sprint_id: int | None = None
    epic_id: int | None = None
    primary_assignee_id: int | None = None
    priority: TaskPriorityValue = "MEDIUM"
    estimated_hours: float | None = Field(default=None, ge=0)
    start_date: date | None = None
    due_date: date | None = None
    story_points: int | None = Field(default=None, ge=0)
    labels: list[str] = Field(default_factory=list)

    @model_validator(mode="after")
    def validate_dates(self):
        if self.start_date and self.due_date and self.due_date < self.start_date:
            raise ValueError("Due date must be on or after start date")
        self.name = self.name.strip()
        self.labels = sorted({label.strip() for label in self.labels if label.strip()})
        return self


class TaskUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=3, max_length=255)
    description: str | None = None
    phase_id: int | None = None
    sprint_id: int | None = None
    epic_id: int | None = None
    primary_assignee_id: int | None = None
    priority: TaskPriorityValue | None = None
    estimated_hours: float | None = Field(default=None, ge=0)
    start_date: date | None = None
    due_date: date | None = None
    story_points: int | None = Field(default=None, ge=0)
    # Truoc day khong co truong nay o bat ky schema ghi nao, nen `progress`
    # chi nhan duoc 0 hoac 100 tu change_status - khong co cach nao ghi nhan
    # mot cong viec dang lam do dang.
    progress: float | None = Field(default=None, ge=0, le=100)
    labels: list[str] | None = None

    @model_validator(mode="after")
    def normalize(self):
        if self.name is not None:
            self.name = self.name.strip()
        if self.labels is not None:
            self.labels = sorted({label.strip() for label in self.labels if label.strip()})
        return self


class TaskStatusUpdate(BaseModel):
    status: TaskStatusValue


class TaskBulkUpdate(BaseModel):
    task_ids: list[int] = Field(min_length=1)
    status: TaskStatusValue | None = None
    priority: TaskPriorityValue | None = None
    phase_id: int | None = None
    sprint_id: int | None = None


class UserBrief(BaseModel):
    id: int
    full_name: str
    avatar_url: str | None = None
    model_config = {"from_attributes": True}


class TaskCapabilities(BaseModel):
    can_update: bool = False
    can_delete: bool = False
    can_change_status: bool = False
    can_manage_dependencies: bool = False
    can_manage_assignments: bool = False
    can_log_work: bool = False
    can_read_worklogs: bool = False


class SubtaskCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = None
    status: Literal["TODO", "IN_PROGRESS", "DONE"] = "TODO"
    estimated_hours: float | None = Field(default=None, ge=0)
    assignee_id: int | None = None


class SubtaskUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    status: Literal["TODO", "IN_PROGRESS", "DONE"] | None = None
    estimated_hours: float | None = Field(default=None, ge=0)
    actual_hours: float | None = Field(default=None, ge=0)
    assignee_id: int | None = None


class SubtaskResponse(BaseModel):
    id: int
    name: str
    description: str | None
    status: str
    is_completed: bool
    estimated_hours: float | None
    actual_hours: float
    task_id: int
    assignee_id: int | None
    model_config = {"from_attributes": True}


class DependencyCreate(BaseModel):
    depends_on_task_id: int
    dependency_type: Literal["FS", "SS", "FF", "SF"] = "FS"
    # Co gioi han: timedelta tran o khoang 2.7 trieu ngay, va mot do tre vuot qua
    # vai nam thi du nao cung la du lieu nhap sai chu khong phai lich trinh that.
    lag_days: int = Field(default=0, ge=-3650, le=3650)


class DependencyResponse(BaseModel):
    id: int
    predecessor_id: int
    successor_id: int
    dependency_type: str
    lag_days: int
    predecessor_name: str | None = None
    successor_name: str | None = None
    model_config = {"from_attributes": True}


class AssignmentCreate(BaseModel):
    user_id: int
    role: str | None = Field(default=None, max_length=100)
    allocated_hours: float = Field(default=0, ge=0)
    allocation_percentage: float = Field(default=100, ge=0, le=100)
    start_date: date | None = None
    end_date: date | None = None
    is_primary: bool = False

    @model_validator(mode="after")
    def validate_dates(self):
        if self.start_date and self.end_date and self.end_date < self.start_date:
            raise ValueError("End date must be on or after start date")
        return self


class AssignmentResponse(BaseModel):
    id: int
    task_id: int
    user_id: int
    role: str | None
    allocated_hours: float
    allocation_percentage: float
    start_date: date | None
    end_date: date | None
    user: UserBrief | None = None
    is_primary: bool = False
    model_config = {"from_attributes": True}


class ResourceWarning(BaseModel):
    user_id: int
    date: date
    reason: Literal["overloaded", "on_leave"]
    total_hours: float
    max_hours: float = 8.0
    task_ids: list[int] = Field(default_factory=list)


class AssignmentMutationResponse(BaseModel):
    assignment: AssignmentResponse
    warnings: list[ResourceWarning] = Field(default_factory=list)


class WorklogCreate(BaseModel):
    hours: float | None = Field(default=None, gt=0, le=24)
    log_date: date
    description: str | None = None
    start_time: datetime | None = None
    end_time: datetime | None = None

    @model_validator(mode="after")
    def validate_time(self):
        if (self.start_time is None) != (self.end_time is None):
            raise ValueError("Start time and end time must be provided together")
        if self.start_time and self.end_time and self.end_time <= self.start_time:
            raise ValueError("End time must be after start time")
        if self.hours is None and self.start_time is None:
            raise ValueError("Hours or a start/end time range is required")
        return self


class WorklogUpdate(BaseModel):
    hours: float | None = Field(default=None, gt=0, le=24)
    log_date: date | None = None
    description: str | None = None
    start_time: datetime | None = None
    end_time: datetime | None = None


class WorklogResponse(BaseModel):
    id: int
    task_id: int
    user_id: int
    hours: float
    log_date: date
    description: str | None
    start_time: datetime | None
    end_time: datetime | None
    created_at: datetime
    user: UserBrief | None = None
    is_running: bool = False
    model_config = {"from_attributes": True}


class WorklogProjectSummary(BaseModel):
    items: list[WorklogResponse]
    total_hours: float
    by_user: dict[int, float]


class TaskResponse(BaseModel):
    id: int
    name: str
    description: str | None
    status: str
    priority: str
    story_points: int | None
    labels: list[str] = Field(default_factory=list)
    progress: float
    estimated_hours: float | None
    actual_hours: float
    start_date: date | None
    due_date: date | None
    early_start: date | None
    early_finish: date | None
    late_start: date | None
    late_finish: date | None
    is_critical: bool
    float_days: float | None
    project_id: int
    phase_id: int | None
    sprint_id: int | None
    epic_id: int | None
    assignee_id: int | None
    primary_assignee: UserBrief | None = None
    capabilities: TaskCapabilities = Field(default_factory=TaskCapabilities)
    model_config = {"from_attributes": True}


class TaskDetailResponse(TaskResponse):
    subtasks: list[SubtaskResponse] = Field(default_factory=list)
    assignments: list[AssignmentResponse] = Field(default_factory=list)
    predecessor_dependencies: list[DependencyResponse] = Field(default_factory=list)
    successor_dependencies: list[DependencyResponse] = Field(default_factory=list)
    total_logged_hours: float = 0
    comments_count: int = 0
