from fastapi import APIRouter, Response, status

from app.core.dependencies import CurrentUser, CurrentVerifiedUser
from app.models.sprint import Sprint, SprintStatus
from app.schemas.wbs import SprintCreate, SprintResponse, SprintUpdate
from app.services.wbs_service import WBSServiceDep

router = APIRouter()


@router.get("/phases/{phase_id}/sprints", response_model=list[SprintResponse])
async def list_sprints(phase_id: int, service: WBSServiceDep, current_user: CurrentUser):
    return await service.list_sprints(phase_id, current_user)


@router.post("/phases/{phase_id}/sprints", response_model=SprintResponse, status_code=201)
async def create_sprint(phase_id: int, body: SprintCreate, service: WBSServiceDep, current_user: CurrentVerifiedUser):
    return await service.create_sprint(phase_id, body, current_user)


@router.get("/sprints/{sprint_id}", response_model=SprintResponse)
async def get_sprint(sprint_id: int, service: WBSServiceDep, current_user: CurrentUser):
    return await service.get_sprint(sprint_id, current_user)


@router.patch("/sprints/{sprint_id}", response_model=SprintResponse)
async def update_sprint(sprint_id: int, body: SprintUpdate, service: WBSServiceDep, current_user: CurrentVerifiedUser):
    return await service.update_sprint(sprint_id, body, current_user)


@router.delete("/sprints/{sprint_id}", status_code=204)
async def delete_sprint(sprint_id: int, service: WBSServiceDep, current_user: CurrentVerifiedUser):
    await service.delete_simple(Sprint, sprint_id, current_user)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/sprints/{sprint_id}/start", response_model=SprintResponse)
async def start_sprint(sprint_id: int, service: WBSServiceDep, current_user: CurrentVerifiedUser):
    return await service.transition_sprint(sprint_id, SprintStatus.ACTIVE, current_user)


@router.post("/sprints/{sprint_id}/complete", response_model=SprintResponse)
async def complete_sprint(sprint_id: int, service: WBSServiceDep, current_user: CurrentVerifiedUser):
    return await service.transition_sprint(sprint_id, SprintStatus.COMPLETED, current_user)
