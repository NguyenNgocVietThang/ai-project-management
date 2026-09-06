from fastapi import APIRouter, Response, status

from app.core.dependencies import CurrentUser, CurrentVerifiedUser
from app.models.milestone import Milestone
from app.schemas.wbs import MilestoneCreate, MilestoneResponse, MilestoneUpdate
from app.services.wbs_service import WBSServiceDep

router = APIRouter()


@router.get("/projects/{project_id}/milestones", response_model=list[MilestoneResponse])
async def list_milestones(project_id: int, service: WBSServiceDep, current_user: CurrentUser):
    return await service.list_milestones(project_id, current_user)


@router.post("/projects/{project_id}/milestones", response_model=MilestoneResponse, status_code=201)
async def create_milestone(project_id: int, body: MilestoneCreate, service: WBSServiceDep, current_user: CurrentVerifiedUser):
    return await service.create_milestone(project_id, body, current_user)


@router.get("/milestones/{milestone_id}", response_model=MilestoneResponse)
async def get_milestone(milestone_id: int, service: WBSServiceDep, current_user: CurrentUser):
    return await service.get_milestone(milestone_id, current_user)


@router.patch("/milestones/{milestone_id}", response_model=MilestoneResponse)
async def update_milestone(milestone_id: int, body: MilestoneUpdate, service: WBSServiceDep, current_user: CurrentVerifiedUser):
    return await service.update_milestone(milestone_id, body, current_user)


@router.delete("/milestones/{milestone_id}", status_code=204)
async def delete_milestone(milestone_id: int, service: WBSServiceDep, current_user: CurrentVerifiedUser):
    await service.delete_simple(Milestone, milestone_id, current_user)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/milestones/{milestone_id}/complete", response_model=MilestoneResponse)
async def complete_milestone(milestone_id: int, service: WBSServiceDep, current_user: CurrentVerifiedUser):
    return await service.complete_milestone(milestone_id, current_user)
