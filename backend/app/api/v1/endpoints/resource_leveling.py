from datetime import date
from typing import Optional

from fastapi import APIRouter

from app.core.dependencies import CurrentUser
from app.schemas.task import ResourceWarning
from app.services.resource_service import ResourceServiceDep

router = APIRouter()


@router.get("/resource-leveling/{project_id}", response_model=list[ResourceWarning])
async def resource_leveling(
    project_id: int,
    service: ResourceServiceDep,
    current_user: CurrentUser,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
):
    return await service.resource_leveling(project_id, current_user, start_date, end_date)
