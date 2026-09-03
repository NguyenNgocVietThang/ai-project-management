from datetime import date
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, Query, Response, status

from app.core.dependencies import CurrentUser, CurrentVerifiedUser, require_permissions
from app.models.project import ProjectMethodology, ProjectStatus
from app.models.user import User
from app.schemas.common import PaginatedResponse
from app.schemas.project import (
    AuditEventResponse,
    ProjectCreate,
    ProjectDetailResponse,
    ProjectMemberCreate,
    ProjectMemberResponse,
    ProjectResponse,
    ProjectSummaryResponse,
    ProjectUpdate,
)
from app.services.project_service import ProjectServiceDep

router = APIRouter()


@router.get("/", response_model=PaginatedResponse[ProjectSummaryResponse])
async def list_projects(
    service: ProjectServiceDep,
    current_user: CurrentUser,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=200)] = 20,
    portfolio_id: Optional[int] = None,
    status_: Optional[ProjectStatus] = Query(default=None, alias="status"),
    methodology: Optional[ProjectMethodology] = None,
    search: Optional[str] = Query(default=None, max_length=200),
    start_date_from: Optional[date] = None,
    end_date_to: Optional[date] = None,
):
    items, total = await service.list(
        current_user,
        skip=(page - 1) * page_size,
        limit=page_size,
        portfolio_id=portfolio_id,
        status=status_,
        methodology=methodology,
        search=search,
        start_date_from=start_date_from,
        end_date_to=end_date_to,
    )
    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=(total + page_size - 1) // page_size if total else 0,
    )


@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    body: ProjectCreate,
    service: ProjectServiceDep,
    current_user: Annotated[User, Depends(require_permissions("project:create"))],
):
    return await service.create(body, pm=current_user)


@router.get("/{project_id}/members", response_model=list[ProjectMemberResponse])
async def list_project_members(
    project_id: int,
    service: ProjectServiceDep,
    current_user: CurrentUser,
):
    return await service.list_members(project_id, current_user)


@router.post(
    "/{project_id}/members",
    response_model=ProjectMemberResponse,
    status_code=status.HTTP_201_CREATED,
)
async def add_project_member(
    project_id: int,
    body: ProjectMemberCreate,
    service: ProjectServiceDep,
    # Đã xác thực: thao tác này gửi email mời dưới danh nghĩa hệ thống.
    current_user: CurrentVerifiedUser,
):
    return await service.add_member(project_id, body, current_user)


@router.delete(
    "/{project_id}/members/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def remove_project_member(
    project_id: int,
    user_id: int,
    service: ProjectServiceDep,
    current_user: CurrentUser,
):
    await service.remove_member(project_id, user_id, current_user)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/{project_id}/activity", response_model=list[AuditEventResponse])
async def get_project_activity(
    project_id: int,
    service: ProjectServiceDep,
    current_user: CurrentUser,
    limit: Annotated[int, Query(ge=1, le=50)] = 10,
):
    return await service.activity(project_id, current_user, limit)


@router.get("/{project_id}", response_model=ProjectDetailResponse)
async def get_project(
    project_id: int,
    service: ProjectServiceDep,
    current_user: CurrentUser,
):
    return await service.get(project_id, current_user)


@router.patch("/{project_id}", response_model=ProjectResponse)
@router.put("/{project_id}", response_model=ProjectResponse, include_in_schema=False)
async def update_project(
    project_id: int,
    body: ProjectUpdate,
    service: ProjectServiceDep,
    current_user: CurrentUser,
):
    return await service.update(project_id, body, current_user)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: int,
    service: ProjectServiceDep,
    current_user: CurrentUser,
):
    await service.delete(project_id, current_user)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
