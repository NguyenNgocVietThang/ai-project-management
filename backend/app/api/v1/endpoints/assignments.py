from fastapi import APIRouter, Response, status

from app.core.dependencies import CurrentUser
from app.schemas.task import AssignmentCreate, AssignmentMutationResponse, AssignmentResponse
from app.services.resource_service import ResourceServiceDep

router = APIRouter()


@router.post("/tasks/{task_id}/assignments", response_model=AssignmentMutationResponse, status_code=201)
async def create_assignment(task_id: int, body: AssignmentCreate, service: ResourceServiceDep, current_user: CurrentUser):
    return await service.create_assignment(task_id, body, current_user)


@router.delete("/assignments/{assignment_id}", status_code=204)
async def delete_assignment(assignment_id: int, service: ResourceServiceDep, current_user: CurrentUser):
    await service.delete_assignment(assignment_id, current_user)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/users/me/assignments", response_model=list[AssignmentResponse])
async def my_assignments(service: ResourceServiceDep, current_user: CurrentUser):
    return await service.my_assignments(current_user)
