"""Schema cho phân tích đường găng.

Engine CPM (app/utils/cpm.py) đã hoàn chỉnh từ lâu và chạy nội bộ ở mỗi thao tác
ghi, nhưng chưa từng được expose — client không có cách nào lấy đường găng ngoài
việc đọc các trường `is_critical` / `early_start` lẫn trong TaskResponse, và
không có cách nào biết tổng thời gian dự án hay độ trễ cho phép của từng công việc.
"""
from datetime import date

from pydantic import BaseModel


class CPMTask(BaseModel):
    id: int
    name: str
    status: str
    duration_days: float
    early_start: date | None
    early_finish: date | None
    late_start: date | None
    late_finish: date | None
    float_days: float
    is_critical: bool
    predecessor_ids: list[int] = []


class CPMResponse(BaseModel):
    project_id: int
    # Tổng thời gian tính bằng ngày lịch từ mốc neo của dự án.
    project_duration_days: float
    # Ngày neo mà mọi offset được tính từ đó (project.start_date, hoặc ngày bắt
    # đầu sớm nhất trong các task nếu dự án chưa đặt).
    anchor_date: date | None
    critical_path: list[int]
    tasks: list[CPMTask]
