from typing import Annotated, Literal

from fastapi import APIRouter, Query, Response, status

from app.core.dependencies import CurrentUser, CurrentVerifiedUser
from app.schemas.wbs import PhaseCreate, PhaseDeleteImpact, PhaseResponse, PhaseUpdate, WBSTree
from app.services.wbs_service import WBSServiceDep

router = APIRouter()


@router.get("/projects/{project_id}/phases", response_model=list[PhaseResponse])
async def list_phases(project_id: int, service: WBSServiceDep, current_user: CurrentUser):
    return await service.list_phases(project_id, current_user)


@router.post("/projects/{project_id}/phases", response_model=PhaseResponse, status_code=201)
async def create_phase(project_id: int, body: PhaseCreate, service: WBSServiceDep, current_user: CurrentVerifiedUser):
    return await service.create_phase(project_id, body, current_user)


@router.get("/phases/{phase_id}", response_model=PhaseResponse)
async def get_phase(phase_id: int, service: WBSServiceDep, current_user: CurrentUser):
    return await service.get_phase(phase_id, current_user)


@router.patch("/phases/{phase_id}", response_model=PhaseResponse)
async def update_phase(phase_id: int, body: PhaseUpdate, service: WBSServiceDep, current_user: CurrentVerifiedUser):
    return await service.update_phase(phase_id, body, current_user)


@router.get("/phases/{phase_id}/delete-impact", response_model=PhaseDeleteImpact)
async def phase_delete_impact(phase_id: int, service: WBSServiceDep, current_user: CurrentUser):
    return await service.delete_impact(phase_id, current_user)


@router.delete("/phases/{phase_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_phase(
    phase_id: int,
    service: WBSServiceDep,
    current_user: CurrentVerifiedUser,
    strategy: Literal["cascade", "reassign", "unlink"] = Query(...),
    target_phase_id: int | None = None,
):
    await service.delete_phase(phase_id, strategy, current_user, target_phase_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/projects/{project_id}/wbs", response_model=WBSTree)
async def get_wbs(
    project_id: int,
    service: WBSServiceDep,
    current_user: CurrentUser,
    include_tasks: Annotated[bool, Query()] = False,
):
    """Cau truc WBS. Mac dinh khong kem task - xem WBSTree."""
    return await service.tree(project_id, current_user, include_tasks=include_tasks)
