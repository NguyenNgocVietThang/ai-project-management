from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel


# ─── Các khối dùng chung ───────────────────────────────────────────────────────

class MyTaskItem(BaseModel):
    """Một task hiện được giao cho người dùng đã xác thực."""
    id: int
    name: str
    project_id: int
    project_name: str
    status: str
    priority: str
    due_date: Optional[date]
    is_critical: bool
    is_overdue: bool


class ActiveProjectSummary(BaseModel):
    """Thẻ dự án gọn nhẹ cho lưới dashboard trang chủ."""
    id: int
    name: str
    status: str
    methodology: str
    progress_percent: float
    task_count: int
    completed_task_count: int
    budget: Optional[float]
    budget_spent: float
    currency: str
    end_date: Optional[date]
    days_remaining: Optional[int]


class RecentActivityItem(BaseModel):
    id: int
    action: str
    description: Optional[str]
    entity_type: str
    entity_id: Optional[int]
    actor_name: Optional[str]
    created_at: datetime


# ─── 3.1  Dashboard người dùng / trang chủ ─────────────────────────────────────

class UserDashboardStats(BaseModel):
    active_projects: int
    total_tasks: int          # tổng số task trên tất cả dự án của người dùng
    overdue_tasks: int
    hours_this_week: float    # tổng hợp từ worklog trong tuần ISO hiện tại


class UserDashboardSummary(BaseModel):
    """Dữ liệu phản hồi cho GET /dashboard/summary"""
    stats: UserDashboardStats
    active_projects: List[ActiveProjectSummary]
    my_tasks: List[MyTaskItem]
    recent_activity: List[RecentActivityItem]


# ─── 3.1  Tình trạng Portfolio ─────────────────────────────────────────────────

class PortfolioProjectHealth(BaseModel):
    project_id: int
    project_name: str
    progress_percent: float
    status: str
    overdue_tasks: int
    budget_utilization_pct: Optional[float]   # actual_cost / budget * 100


class PortfolioHealthResponse(BaseModel):
    """Dữ liệu phản hồi cho GET /dashboard/portfolios/{portfolio_id}/health"""
    portfolio_id: int
    portfolio_name: str
    total_projects: int
    active_projects: int
    completed_projects: int
    overall_progress: float
    projects: List[PortfolioProjectHealth]


# ─── 3.2  Dashboard dự án ──────────────────────────────────────────────────────

class TaskStatusCount(BaseModel):
    status: str
    count: int
    color: str   # gợi ý màu hex cho biểu đồ


class TeamMemberUtilization(BaseModel):
    user_id: int
    full_name: str
    avatar_url: Optional[str]
    estimated_hours: float
    logged_hours: float
    task_count: int


class BudgetSummary(BaseModel):
    budget: Optional[float]
    spent: float
    remaining: Optional[float]
    utilization_pct: Optional[float]
    currency: str


class ProjectDashboardStats(BaseModel):
    """Dữ liệu phản hồi cho GET /dashboard/projects/{project_id}/stats"""
    project_id: int
    project_name: str
    # Phân bố task cho biểu đồ Donut / Stacked-bar
    task_distribution: List[TaskStatusCount]
    # Ngân sách cho biểu đồ Donut
    budget: BudgetSummary
    # Mức sử dụng nhân sự của nhóm cho biểu đồ Bar
    team_utilization: List[TeamMemberUtilization]
    # Burndown / tiến độ theo thời gian
    burndown: List["BurndownPoint"]
    total_tasks: int
    completed_tasks: int
    overdue_tasks: int
    critical_tasks: int


# ─── Legacy (giữ lại để tương thích) ──────────────────────────────────────────

class ProjectStats(BaseModel):
    total_tasks: int
    completed_tasks: int
    in_progress_tasks: int
    overdue_tasks: int
    completion_percentage: float
    cpi: float   # Cost Performance Index (chỉ số hiệu quả chi phí)
    spi: float   # Schedule Performance Index (chỉ số hiệu quả tiến độ)


class BurndownPoint(BaseModel):
    date: str
    remaining: float
    ideal: float


class DashboardResponse(BaseModel):
    stats: ProjectStats
    burndown: List[BurndownPoint]
