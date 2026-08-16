from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel


# ─── Shared building blocks ────────────────────────────────────────────────────

class MyTaskItem(BaseModel):
    """A task currently assigned to the authenticated user."""
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
    """Lightweight project card for the home dashboard grid."""
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


# ─── 3.1  User / Home Dashboard ────────────────────────────────────────────────

class UserDashboardStats(BaseModel):
    active_projects: int
    total_tasks: int          # tasks across all user's projects
    overdue_tasks: int
    hours_this_week: float    # summed from worklogs this ISO-week


class UserDashboardSummary(BaseModel):
    """Response for GET /dashboard/summary"""
    stats: UserDashboardStats
    active_projects: List[ActiveProjectSummary]
    my_tasks: List[MyTaskItem]
    recent_activity: List[RecentActivityItem]


# ─── 3.1  Portfolio Health ─────────────────────────────────────────────────────

class PortfolioProjectHealth(BaseModel):
    project_id: int
    project_name: str
    progress_percent: float
    status: str
    overdue_tasks: int
    budget_utilization_pct: Optional[float]   # actual_cost / budget * 100


class PortfolioHealthResponse(BaseModel):
    """Response for GET /dashboard/portfolios/{portfolio_id}/health"""
    portfolio_id: int
    portfolio_name: str
    total_projects: int
    active_projects: int
    completed_projects: int
    overall_progress: float
    projects: List[PortfolioProjectHealth]


# ─── 3.2  Project Dashboard ────────────────────────────────────────────────────

class TaskStatusCount(BaseModel):
    status: str
    count: int
    color: str   # hex color hint for chart


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
    """Response for GET /dashboard/projects/{project_id}/stats"""
    project_id: int
    project_name: str
    # Task distribution for Donut / Stacked-bar chart
    task_distribution: List[TaskStatusCount]
    # Budget for Donut chart
    budget: BudgetSummary
    # Team utilization for Bar chart
    team_utilization: List[TeamMemberUtilization]
    # Burndown / progress over time
    burndown: List["BurndownPoint"]
    total_tasks: int
    completed_tasks: int
    overdue_tasks: int
    critical_tasks: int


# ─── Legacy (kept for compatibility) ──────────────────────────────────────────

class ProjectStats(BaseModel):
    total_tasks: int
    completed_tasks: int
    in_progress_tasks: int
    overdue_tasks: int
    completion_percentage: float
    cpi: float   # Cost Performance Index
    spi: float   # Schedule Performance Index


class BurndownPoint(BaseModel):
    date: str
    remaining: float
    ideal: float


class DashboardResponse(BaseModel):
    stats: ProjectStats
    burndown: List[BurndownPoint]
