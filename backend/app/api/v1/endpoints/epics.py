from fastapi import APIRouter, Response, status

from app.core.dependencies import CurrentUser
from app.models.epic import Epic
from app.schemas.wbs import EpicCreate, EpicResponse, EpicUpdate
from app.services.wbs_service import WBSServiceDep

router = APIRouter()


@router.get("/projects/{project_id}/epics", response_model=list[EpicResponse])
async def list_epics(project_id: int, service: WBSServiceDep, current_user: CurrentUser):
    return await service.list_epics(project_id, current_user)


@router.post("/projects/{project_id}/epics", response_model=EpicResponse, status_code=201)
async def create_epic(project_id: int, body: EpicCreate, service: WBSServiceDep, current_user: CurrentUser):
    return await service.create_epic(project_id, body, current_user)


@router.get("/epics/{epic_id}", response_model=EpicResponse)
async def get_epic(epic_id: int, service: WBSServiceDep, current_user: CurrentUser):
    return await service.get_epic(epic_id, current_user)


@router.patch("/epics/{epic_id}", response_model=EpicResponse)
async def update_epic(epic_id: int, body: EpicUpdate, service: WBSServiceDep, current_user: CurrentUser):
    return await service.update_epic(epic_id, body, current_user)


@router.delete("/epics/{epic_id}", status_code=204)
async def delete_epic(epic_id: int, service: WBSServiceDep, current_user: CurrentUser):
    await service.delete_simple(Epic, epic_id, current_user)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
