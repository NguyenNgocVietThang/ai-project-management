"""
Các endpoint Dashboard – Phase 3.1 & 3.2

GET /dashboard/summary                           → Dashboard trang chủ cho người dùng hiện tại
GET /dashboard/portfolios/{portfolio_id}/health  → Các chỉ số sức khỏe của portfolio
GET /dashboard/projects/{project_id}/stats       → Dữ liệu biểu đồ ở cấp dự án
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
    Tổng quan Dashboard trang chủ cho người dùng đã xác thực.

    Trả về:
    - Số liệu thống kê (dự án đang hoạt động, tổng số task, task quá hạn, số giờ trong tuần)
    - Danh sách dự án đang hoạt động kèm thông tin tiến độ và ngân sách
    - Các task hiện được giao cho người dùng (chưa hoàn thành)
    - Hoạt động audit-log gần đây trên tất cả dự án mà người dùng nhìn thấy
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
    Các chỉ số sức khỏe của portfolio: tiến độ tổng thể, trạng thái từng dự án,
    số lượng task quá hạn, và mức sử dụng ngân sách của mỗi dự án.
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
    Dữ liệu Dashboard dự án:
    - Phân bố trạng thái task (dữ liệu biểu đồ donut)
    - Tóm tắt ngân sách (đã chi so với đã phân bổ)
    - Mức sử dụng nhân lực của team (số giờ ước tính so với số giờ đã ghi nhận mỗi thành viên)
    - Đường cong burndown 14 ngày
    """
    return await service.get_project_stats(project_id, current_user)
