from fastapi import APIRouter

from app.core.dependencies import CurrentUser
from app.schemas.cpm import CPMResponse
from app.services.scheduling_service import SchedulingServiceDep

router = APIRouter()


@router.get("/projects/{project_id}/cpm", response_model=CPMResponse)
async def get_critical_path(
    project_id: int,
    service: SchedulingServiceDep,
    current_user: CurrentUser,
):
    """Phân tích đường găng của một dự án.

    Chỉ đọc: nó báo cáo lịch trình đã được tính ra chứ không thay đổi gì. Việc
    tính toán vẫn diễn ra ở mọi thao tác ghi (xem scheduling_service); endpoint
    này chỉ đọc kết quả và bổ sung những thứ chưa từng lộ ra ngoài — độ trễ cho
    phép của từng công việc, tổng thời gian dự án, và chính chuỗi đường găng.
    """
    return await service.critical_path(project_id, current_user)
