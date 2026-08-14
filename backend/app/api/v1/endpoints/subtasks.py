from fastapi import APIRouter, Response, status

from app.core.dependencies import CurrentUser
from app.schemas.task import SubtaskResponse, SubtaskUpdate
from app.services.task_service import TaskServiceDep

router = APIRouter()


@router.patch("/subtasks/{subtask_id}", response_model=SubtaskResponse)
async def update_subtask(subtask_id: int, body: SubtaskUpdate, service: TaskServiceDep, current_user: CurrentUser):
    return await service.update_subtask(subtask_id, body, current_user)


@router.delete("/subtasks/{subtask_id}", status_code=204)
async def delete_subtask(subtask_id: int, service: TaskServiceDep, current_user: CurrentUser):
    await service.delete_subtask(subtask_id, current_user)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
