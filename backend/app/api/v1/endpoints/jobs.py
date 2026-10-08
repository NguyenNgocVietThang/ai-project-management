"""Job metadata only: payloads, delivery links and lease secrets stay server-side."""
from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel, ConfigDict
from sqlalchemy import exists, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import CurrentUser
from app.core.exceptions import NotFoundException
from app.db.session import get_db
from app.models.associations import project_members
from app.models.job import Job
from app.models.project import Project

router = APIRouter()
DB = Annotated[AsyncSession, Depends(get_db)]


class JobResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    kind: str
    status: str
    owner_id: int | None
    project_id: int | None
    attempts: int
    max_attempts: int
    error_code: str | None
    result: dict | None
    created_at: datetime
    updated_at: datetime


def visible_jobs(user_id):
    project_visible = exists(select(Project.id).where(
        Project.id == Job.project_id, Project.deleted_at.is_(None),
        or_(Project.pm_id == user_id, exists(select(project_members.c.user_id).where(
            project_members.c.project_id == Project.id, project_members.c.user_id == user_id,
        ))),
    ))
    return or_(Job.owner_id == user_id, (Job.kind == "scheduling.cpm") & project_visible)


@router.get("", response_model=list[JobResponse])
async def list_jobs(db: DB, user: CurrentUser, limit: Annotated[int, Query(ge=1, le=50)] = 50):
    return (await db.scalars(select(Job).where(visible_jobs(user.id)).order_by(Job.id.desc()).limit(limit))).all()


@router.get("/{job_id}", response_model=JobResponse)
async def get_job(job_id: int, db: DB, user: CurrentUser):
    job = await db.scalar(select(Job).where(Job.id == job_id, visible_jobs(user.id)))
    if job is None:
        raise NotFoundException("Job not found")
    return job
