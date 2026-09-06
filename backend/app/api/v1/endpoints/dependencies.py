from fastapi import APIRouter, Response, status

from app.core.dependencies import CurrentUser, CurrentVerifiedUser
from app.schemas.task import DependencyCreate, DependencyResponse
from app.services.task_service import TaskServiceDep

router = APIRouter()


@router.post("/tasks/{task_id}/dependencies", response_model=DependencyResponse, status_code=201)
async def create_dependency(task_id: int, body: DependencyCreate, service: TaskServiceDep, current_user: CurrentVerifiedUser):
    return await service.add_dependency(task_id, body, current_user)


@router.delete("/dependencies/{dependency_id}", status_code=204)
async def delete_dependency(dependency_id: int, service: TaskServiceDep, current_user: CurrentVerifiedUser):
    await service.delete_dependency(dependency_id, current_user)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/projects/{project_id}/dependencies", response_model=list[DependencyResponse])
async def list_dependencies(project_id: int, service: TaskServiceDep, current_user: CurrentUser):
    return await service.list_dependencies(project_id, current_user)
