"""Phiên bản dự án (V1): danh sách, chi tiết và tạo baseline thủ công."""
from datetime import datetime

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.core.dependencies import CurrentUser, CurrentVerifiedUser
from app.services.versioning_service import VersioningServiceDep

router = APIRouter()


class BaselineCreate(BaseModel):
    label: str = Field(min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=5000)


class ProjectVersionResponse(BaseModel):
    id: int
    project_id: int
    version_number: int
    label: str
    description: str | None
    is_baseline: bool
    kind: str | None
    change_request_id: int | None
    created_by_id: int
    created_at: datetime
    schema_version: int | None
    counts: dict[str, int]
    # Chỉ có khi gọi chi tiết với include_snapshot=true.
    snapshot: dict | None = None


@router.get("/projects/{project_id}/versions", response_model=list[ProjectVersionResponse])
async def list_versions(project_id: int, service: VersioningServiceDep, current_user: CurrentUser):
    return await service.list_versions(project_id, current_user)


@router.get("/projects/{project_id}/versions/{version_id}", response_model=ProjectVersionResponse)
async def get_version(
    project_id: int,
    version_id: int,
    service: VersioningServiceDep,
    current_user: CurrentUser,
    include_snapshot: bool = False,
):
    return await service.get_version(
        project_id, version_id, current_user, include_snapshot=include_snapshot
    )


@router.post(
    "/projects/{project_id}/versions/baseline", response_model=ProjectVersionResponse, status_code=201
)
async def create_baseline(
    project_id: int, body: BaselineCreate, service: VersioningServiceDep, current_user: CurrentVerifiedUser
):
    return await service.create_baseline(
        project_id, current_user, label=body.label, description=body.description
    )
