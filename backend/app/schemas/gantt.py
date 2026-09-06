from datetime import date

from pydantic import BaseModel


class GanttTask(BaseModel):
    id: int
    name: str
    start_date: date | None
    due_date: date | None
    early_start: date | None
    early_finish: date | None
    late_start: date | None
    late_finish: date | None
    float_days: float | None
    is_critical: bool
    status: str
    assignee_id: int | None
    predecessor_ids: list[int] = []


class GanttResponse(BaseModel):
    project_id: int
    tasks: list[GanttTask]
    critical_path: list[int]  # Danh sách ID của các task nằm trên đường găng
