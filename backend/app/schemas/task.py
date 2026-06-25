from typing import Optional
from datetime import date
from pydantic import BaseModel


class TaskCreate(BaseModel):
    name: str
    description: Optional[str] = None
    project_id: int
    phase_id: Optional[int] = None
    sprint_id: Optional[int] = None
    epic_id: Optional[int] = None
    assignee_id: Optional[int] = None
    priority: str = "MEDIUM"
    estimated_hours: Optional[float] = None
    start_date: Optional[date] = None
    due_date: Optional[date] = None


class TaskUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    assignee_id: Optional[int] = None
    estimated_hours: Optional[float] = None
    actual_hours: Optional[float] = None
    start_date: Optional[date] = None
    due_date: Optional[date] = None


class TaskResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    status: str
    priority: str
    estimated_hours: Optional[float]
    actual_hours: Optional[float]
    start_date: Optional[date]
    due_date: Optional[date]
    is_critical: bool
    float_days: Optional[float]
    project_id: int

    model_config = {"from_attributes": True}
