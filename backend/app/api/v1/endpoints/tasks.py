from datetime import date
from typing import Annotated

from fastapi import APIRouter, Query, Request, Response, status

from app.core.dependencies import CurrentUser, CurrentVerifiedUser
from app.core.rate_limit import BULK_WRITE_LIMIT, limiter
from app.schemas.common import PaginatedResponse
from app.schemas.task import (
    SubtaskCreate,
    SubtaskResponse,
    TaskBulkUpdate,
    TaskCreate,
    TaskDetailResponse,
    TaskResponse,
    TaskStatusUpdate,
    TaskUpdate,
)
from app.services.task_service import TaskServiceDep

router = APIRouter()


@router.get("/projects/{project_id}/tasks", response_model=PaginatedResponse[TaskResponse])
async def list_tasks(
    project_id: int,
    service: TaskServiceDep,
    current_user: CurrentUser,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=200)] = 50,
    search: str | None = None,
    phase_id: int | None = None,
    sprint_id: int | None = None,
    epic_id: int | None = None,
    assignee_id: int | None = None,
    status_: str | None = Query(default=None, alias="status"),
    priority: str | None = None,
    labels: Annotated[list[str] | None, Query()] = None,
    due_date_from: date | None = None,
    due_date_to: date | None = None,
):
    return await service.list(
        project_id,
        current_user,
        page=page,
        page_size=page_size,
        search=search,
        phase_id=phase_id,
        sprint_id=sprint_id,
        epic_id=epic_id,
        assignee_id=assignee_id,
        status=status_,
        priority=priority,
        labels=labels,
        due_date_from=due_date_from,
        due_date_to=due_date_to,
    )


@router.post("/projects/{project_id}/tasks", response_model=TaskResponse, status_code=201)
async def create_task(project_id: int, body: TaskCreate, service: TaskServiceDep, current_user: CurrentVerifiedUser):
    return await service.create(project_id, body, current_user)


@router.get("/tasks/{task_id}", response_model=TaskDetailResponse)
async def get_task(task_id: int, service: TaskServiceDep, current_user: CurrentUser):
    return await service.get(task_id, current_user)


@router.patch("/tasks/{task_id}", response_model=TaskResponse)
async def update_task(task_id: int, body: TaskUpdate, service: TaskServiceDep, current_user: CurrentVerifiedUser):
    return await service.update(task_id, body, current_user)


@router.delete("/tasks/{task_id}", status_code=204)
async def delete_task(task_id: int, service: TaskServiceDep, current_user: CurrentVerifiedUser):
    await service.delete(task_id, current_user)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/tasks/{task_id}/status", response_model=TaskResponse)
async def change_task_status(task_id: int, body: TaskStatusUpdate, service: TaskServiceDep, current_user: CurrentVerifiedUser):
    return await service.change_status(task_id, body, current_user)


@router.patch("/projects/{project_id}/tasks/bulk", response_model=list[TaskResponse])
@limiter.limit(BULK_WRITE_LIMIT)
async def bulk_update_tasks(request: Request, project_id: int, body: TaskBulkUpdate, service: TaskServiceDep, current_user: CurrentVerifiedUser):
    return await service.bulk_update(project_id, body, current_user)


@router.get("/tasks/{task_id}/subtasks", response_model=list[SubtaskResponse])
async def list_subtasks(task_id: int, service: TaskServiceDep, current_user: CurrentUser):
    return await service.list_subtasks(task_id, current_user)


@router.post("/tasks/{task_id}/subtasks", response_model=SubtaskResponse, status_code=201)
async def create_subtask(task_id: int, body: SubtaskCreate, service: TaskServiceDep, current_user: CurrentVerifiedUser):
    return await service.create_subtask(task_id, body, current_user)
