import secrets
from typing import Annotated

from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.session import get_db
from app.services.cron_service import enqueue_due_schedules

router = APIRouter()


@router.post("/schedules", status_code=202)
async def schedule_jobs(db: Annotated[AsyncSession, Depends(get_db)], authorization: Annotated[str | None, Header()] = None):
    if not settings.CRON_SECRET:
        raise HTTPException(503, "Cron authentication is not configured")
    expected = f"Bearer {settings.CRON_SECRET}"
    if authorization is None or not secrets.compare_digest(authorization, expected):
        raise HTTPException(401, "Invalid cron credential")
    jobs = await enqueue_due_schedules(db)
    return {"job_ids": [job.id for job in jobs]}
