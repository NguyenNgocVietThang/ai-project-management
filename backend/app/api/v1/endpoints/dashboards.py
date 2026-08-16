"""
Dashboard endpoints – Phase 3.1 & 3.2

GET /dashboard/summary                           → Home dashboard for current user
GET /dashboard/portfolios/{portfolio_id}/health  → Portfolio health metrics
GET /dashboard/projects/{project_id}/stats       → Project-level chart data
"""
from fastapi import APIRouter

from app.core.dependencies import CurrentUser
from app.schemas.dashboard import (
    PortfolioHealthResponse,
    ProjectDashboardStats,
    UserDashboardSummary,
)
from app.services.dashboard_service import DashboardServiceDep

router = APIRouter()


@router.get("/summary", response_model=UserDashboardSummary)
async def get_dashboard_summary(
    service: DashboardServiceDep,
    current_user: CurrentUser,
):
    """
    Home Dashboard overview for the authenticated user.

    Returns:
    - Stats (active projects, total tasks, overdue tasks, hours this week)
    - Active projects list with progress and budget info
    - Tasks currently assigned to the user (not done)
    - Recent audit-log activity across all visible projects
    """
    return await service.get_user_summary(current_user)


@router.get(
    "/portfolios/{portfolio_id}/health",
    response_model=PortfolioHealthResponse,
)
async def get_portfolio_health(
    portfolio_id: int,
    service: DashboardServiceDep,
    current_user: CurrentUser,
):
    """
    Portfolio health metrics: overall progress, per-project status,
    overdue task counts, and budget utilization for each project.
    """
    return await service.get_portfolio_health(portfolio_id, current_user)


@router.get(
    "/projects/{project_id}/stats",
    response_model=ProjectDashboardStats,
)
async def get_project_stats(
    project_id: int,
    service: DashboardServiceDep,
    current_user: CurrentUser,
):
    """
    Project Dashboard data:
    - Task status distribution (donut chart data)
    - Budget summary (spent vs. allocated)
    - Team utilization (estimated vs. logged hours per member)
    - 14-day burndown curve
    """
    return await service.get_project_stats(project_id, current_user)
