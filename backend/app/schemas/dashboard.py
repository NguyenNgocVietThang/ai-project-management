from typing import List
from pydantic import BaseModel


class ProjectStats(BaseModel):
    total_tasks: int
    completed_tasks: int
    in_progress_tasks: int
    overdue_tasks: int
    completion_percentage: float
    cpi: float  # Cost Performance Index
    spi: float  # Schedule Performance Index


class BurndownPoint(BaseModel):
    date: str
    remaining: float
    ideal: float


class DashboardResponse(BaseModel):
    stats: ProjectStats
    burndown: List[BurndownPoint]
