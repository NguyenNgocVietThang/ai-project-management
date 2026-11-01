from fastapi import APIRouter, status

from app.core.dependencies import CurrentUser, CurrentVerifiedUser
from app.schemas.change_request import (
    ChangeRequestCreate,
    ChangeRequestResponse,
    ImpactLevelUpdateRequest,
)
from app.schemas.impact_report import ImpactReportResponse, ManualImpactReportRequest
from app.services.change_request_service import ChangeRequestServiceDep

router = APIRouter()


@router.get("/projects/{project_id}/change-requests", response_model=list[ChangeRequestResponse])
async def list_change_requests(
    project_id: int, service: ChangeRequestServiceDep, current_user: CurrentUser
):
    return await service.list_for_project(project_id, current_user)


@router.post(
    "/projects/{project_id}/change-requests",
    response_model=ChangeRequestResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_change_request(
    project_id: int,
    body: ChangeRequestCreate,
    service: ChangeRequestServiceDep,
    current_user: CurrentVerifiedUser,
):
    return await service.create(project_id, body, current_user)


@router.get("/change-requests/{change_request_id}", response_model=ChangeRequestResponse)
async def get_change_request(
    change_request_id: int, service: ChangeRequestServiceDep, current_user: CurrentUser
):
    return await service.get(change_request_id, current_user)


@router.post("/change-requests/{change_request_id}/submit", response_model=ChangeRequestResponse)
async def submit_change_request(
    change_request_id: int, service: ChangeRequestServiceDep, current_user: CurrentVerifiedUser
):
    return await service.submit(change_request_id, current_user)


@router.post("/change-requests/{change_request_id}/impact-level", response_model=ChangeRequestResponse)
async def set_impact_level(
    change_request_id: int,
    body: ImpactLevelUpdateRequest,
    service: ChangeRequestServiceDep,
    current_user: CurrentVerifiedUser,
):
    """PM chốt hoặc đổi mức tác động (MINOR/MODERATE/MAJOR)."""
    return await service.set_impact_level(change_request_id, body, current_user)


@router.get("/change-requests/{change_request_id}/impact-report", response_model=ImpactReportResponse)
async def get_impact_report(
    change_request_id: int, service: ChangeRequestServiceDep, current_user: CurrentUser
):
    """Báo cáo tác động đã lưu (chỉ mang tính tư vấn); 404 khi chưa có."""
    return await service.get_impact_report(change_request_id, current_user)


@router.put(
    "/change-requests/{change_request_id}/impact-report/manual", response_model=ImpactReportResponse
)
async def set_manual_impact_report(
    change_request_id: int,
    body: ManualImpactReportRequest,
    service: ChangeRequestServiceDep,
    current_user: CurrentVerifiedUser,
):
    """PM nhập đánh giá tác động thủ công khi chưa có báo cáo AI."""
    return await service.set_manual_impact_report(change_request_id, body, current_user)
