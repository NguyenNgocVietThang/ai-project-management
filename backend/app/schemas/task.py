from datetime import date, datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field, model_validator


TaskStatusValue = Literal["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE", "BLOCKED"]
TaskPriorityValue = Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]


class TaskCreate(BaseModel):
    name: str = Field(min_length=3, max_length=255)
    description: Optional[str] = None
    phase_id: Optional[int] = None
    sprint_id: Optional[int] = None
    epic_id: Optional[int] = None
    primary_assignee_id: Optional[int] = None
    priority: TaskPriorityValue = "MEDIUM"
    estimated_hours: Optional[float] = Field(default=None, ge=0)
    start_date: Optional[date] = None
    due_date: Optional[date] = None
    story_points: Optional[int] = Field(default=None, ge=0)
    labels: list[str] = Field(default_factory=list)

    @model_validator(mode="after")
    def validate_dates(self):
        if self.start_date and self.due_date and self.due_date < self.start_date:
            raise ValueError("Due date must be on or after start date")
        self.name = self.name.strip()
        self.labels = sorted({label.strip() for label in self.labels if label.strip()})
        return self


class TaskUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=3, max_length=255)
    description: Optional[str] = None
    phase_id: Optional[int] = None
    sprint_id: Optional[int] = None
    epic_id: Optional[int] = None
    primary_assignee_id: Optional[int] = None
    priority: Optional[TaskPriorityValue] = None
    estimated_hours: Optional[float] = Field(default=None, ge=0)
    start_date: Optional[date] = None
    due_date: Optional[date] = None
    story_points: Optional[int] = Field(default=None, ge=0)
    labels: Optional[list[str]] = None

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
    status: Optional[TaskStatusValue] = None
    priority: Optional[TaskPriorityValue] = None
    phase_id: Optional[int] = None
    sprint_id: Optional[int] = None


class UserBrief(BaseModel):
    id: int
    full_name: str
    avatar_url: Optional[str] = None
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
    description: Optional[str] = None
    status: Literal["TODO", "IN_PROGRESS", "DONE"] = "TODO"
    estimated_hours: Optional[float] = Field(default=None, ge=0)
    assignee_id: Optional[int] = None


class SubtaskUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = None
    status: Optional[Literal["TODO", "IN_PROGRESS", "DONE"]] = None
    estimated_hours: Optional[float] = Field(default=None, ge=0)
    actual_hours: Optional[float] = Field(default=None, ge=0)
    assignee_id: Optional[int] = None


class SubtaskResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    status: str
    is_completed: bool
    estimated_hours: Optional[float]
    actual_hours: float
    task_id: int
    assignee_id: Optional[int]
    model_config = {"from_attributes": True}


class DependencyCreate(BaseModel):
    depends_on_task_id: int
    dependency_type: Literal["FS", "SS", "FF", "SF"] = "FS"
    lag_days: int = 0


class DependencyResponse(BaseModel):
    id: int
    predecessor_id: int
    successor_id: int
    dependency_type: str
    lag_days: int
    predecessor_name: Optional[str] = None
    successor_name: Optional[str] = None
    model_config = {"from_attributes": True}


class AssignmentCreate(BaseModel):
    user_id: int
    role: Optional[str] = Field(default=None, max_length=100)
    allocated_hours: float = Field(default=0, ge=0)
    allocation_percentage: float = Field(default=100, ge=0, le=100)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
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
    role: Optional[str]
    allocated_hours: float
    allocation_percentage: float
    start_date: Optional[date]
    end_date: Optional[date]
    user: Optional[UserBrief] = None
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
    hours: Optional[float] = Field(default=None, gt=0, le=24)
    log_date: date
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None

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
    hours: Optional[float] = Field(default=None, gt=0, le=24)
    log_date: Optional[date] = None
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None


class WorklogResponse(BaseModel):
    id: int
    task_id: int
    user_id: int
    hours: float
    log_date: date
    description: Optional[str]
    start_time: Optional[datetime]
    end_time: Optional[datetime]
    created_at: datetime
    user: Optional[UserBrief] = None
    is_running: bool = False
    model_config = {"from_attributes": True}


class WorklogProjectSummary(BaseModel):
    items: list[WorklogResponse]
    total_hours: float
    by_user: dict[int, float]


class TaskResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    status: str
    priority: str
    story_points: Optional[int]
    labels: list[str] = Field(default_factory=list)
    progress: float
    estimated_hours: Optional[float]
    actual_hours: float
    start_date: Optional[date]
    due_date: Optional[date]
    early_start: Optional[date]
    early_finish: Optional[date]
    late_start: Optional[date]
    late_finish: Optional[date]
    is_critical: bool
    float_days: Optional[float]
    project_id: int
    phase_id: Optional[int]
    sprint_id: Optional[int]
    epic_id: Optional[int]
    assignee_id: Optional[int]
    primary_assignee: Optional[UserBrief] = None
    capabilities: TaskCapabilities = Field(default_factory=TaskCapabilities)
    model_config = {"from_attributes": True}


class TaskDetailResponse(TaskResponse):
    subtasks: list[SubtaskResponse] = Field(default_factory=list)
    assignments: list[AssignmentResponse] = Field(default_factory=list)
    predecessor_dependencies: list[DependencyResponse] = Field(default_factory=list)
    successor_dependencies: list[DependencyResponse] = Field(default_factory=list)
    total_logged_hours: float = 0
    comments_count: int = 0
