from datetime import date
from typing import Optional

from fastapi import APIRouter, Response, status

from app.core.dependencies import CurrentUser
from app.schemas.task import WorklogCreate, WorklogProjectSummary, WorklogResponse, WorklogUpdate
from app.services.resource_service import ResourceServiceDep

router = APIRouter()


@router.post("/tasks/{task_id}/worklogs", response_model=WorklogResponse, status_code=201)
async def create_worklog(task_id: int, body: WorklogCreate, service: ResourceServiceDep, current_user: CurrentUser):
    return await service.create_worklog(task_id, body, current_user)


@router.get("/tasks/{task_id}/worklogs", response_model=list[WorklogResponse])
async def list_task_worklogs(task_id: int, service: ResourceServiceDep, current_user: CurrentUser):
    return await service.list_task_worklogs(task_id, current_user)


@router.get("/projects/{project_id}/worklogs", response_model=WorklogProjectSummary)
async def project_worklogs(
    project_id: int,
    service: ResourceServiceDep,
    current_user: CurrentUser,
    user_id: Optional[int] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
):
    return await service.project_worklogs(project_id, current_user, user_id, start_date, end_date)


@router.patch("/worklogs/{worklog_id}", response_model=WorklogResponse)
async def update_worklog(worklog_id: int, body: WorklogUpdate, service: ResourceServiceDep, current_user: CurrentUser):
    return await service.update_worklog(worklog_id, body, current_user)


@router.delete("/worklogs/{worklog_id}", status_code=204)
async def delete_worklog(worklog_id: int, service: ResourceServiceDep, current_user: CurrentUser):
    await service.delete_worklog(worklog_id, current_user)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/tasks/{task_id}/worklogs/start", response_model=WorklogResponse, status_code=201)
async def start_timer(task_id: int, service: ResourceServiceDep, current_user: CurrentUser):
    return await service.start_timer(task_id, current_user)


@router.post("/worklogs/{worklog_id}/stop", response_model=WorklogResponse)
async def stop_timer(worklog_id: int, service: ResourceServiceDep, current_user: CurrentUser):
    return await service.stop_timer(worklog_id, current_user)


@router.get("/users/me/worklogs/active", response_model=Optional[WorklogResponse])
async def active_timer(service: ResourceServiceDep, current_user: CurrentUser):
    return await service.active_timer(current_user)
