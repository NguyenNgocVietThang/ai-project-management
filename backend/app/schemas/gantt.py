from typing import List, Optional
from datetime import date
from pydantic import BaseModel


class GanttTask(BaseModel):
    id: int
    name: str
    start_date: Optional[date]
    due_date: Optional[date]
    early_start: Optional[date]
    early_finish: Optional[date]
    late_start: Optional[date]
    late_finish: Optional[date]
    float_days: Optional[float]
    is_critical: bool
    status: str
    assignee_id: Optional[int]
    predecessor_ids: List[int] = []


class GanttResponse(BaseModel):
    project_id: int
    tasks: List[GanttTask]
    critical_path: List[int]  # List of task IDs on the critical path
