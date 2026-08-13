from typing import Annotated, Optional

from fastapi import APIRouter, Depends, Query, status

from app.core.dependencies import CurrentUser, require_permissions
from app.models.user import User
from app.schemas.common import MessageResponse, PaginatedResponse
from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate
from app.services.task_service import TaskServiceDep

router = APIRouter()


@router.get("/", response_model=PaginatedResponse[TaskResponse])
async def list_tasks(
    service: TaskServiceDep,
    current_user: CurrentUser,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=200)] = 20,
    project_id: Optional[int] = None,
    sprint_id: Optional[int] = None,
    assignee_id: Optional[int] = None,
    status_: Optional[str] = Query(default=None, alias="status"),
):
    items, total = await service.list(
        skip=(page - 1) * page_size,
        limit=page_size,
        project_id=project_id,
        sprint_id=sprint_id,
        assignee_id=assignee_id,
        status=status_,
    )
    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=(total + page_size - 1) // page_size if total else 0,
    )


@router.get("/{id}", response_model=TaskResponse)
async def get_task(id: int, service: TaskServiceDep, current_user: CurrentUser):
    return await service.get(id)


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    body: TaskCreate,
    service: TaskServiceDep,
    current_user: Annotated[User, Depends(require_permissions("task:create"))],
):
    return await service.create(body)


@router.put("/{id}", response_model=TaskResponse)
async def update_task(
    id: int,
    body: TaskUpdate,
    service: TaskServiceDep,
    current_user: Annotated[User, Depends(require_permissions("task:update"))],
):
    return await service.update(id, body)


@router.delete("/{id}", response_model=MessageResponse)
async def delete_task(
    id: int,
    service: TaskServiceDep,
    current_user: Annotated[User, Depends(require_permissions("task:delete"))],
):
    await service.delete(id)
    return MessageResponse(message="Deleted")
