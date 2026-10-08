from datetime import datetime
from zoneinfo import ZoneInfo

import pytest
from sqlalchemy import func, select

from app.models.job import Job
from app.services.cron_service import enqueue_due_schedules


@pytest.mark.asyncio
async def test_schedule_vietnam_time_and_limited_catchup(session):
    tz = ZoneInfo("Asia/Ho_Chi_Minh")
    assert await enqueue_due_schedules(session, now=datetime(2026, 10, 8, 7, 59, tzinfo=tz)) == []
    jobs = await enqueue_due_schedules(session, now=datetime(2026, 10, 8, 8, 10, tzinfo=tz))
    assert [job.kind for job in jobs] == ["cron.reminders"]
    await enqueue_due_schedules(session, now=datetime(2026, 10, 8, 8, 40, tzinfo=tz))
    await enqueue_due_schedules(session, now=datetime(2026, 10, 8, 9, 0, tzinfo=tz))
    assert await session.scalar(select(func.count()).select_from(Job)) == 2
    # Late wakeup does not enqueue yesterday or old reminders.
    assert await enqueue_due_schedules(session, now=datetime(2026, 10, 9, 23, 0, tzinfo=tz)) == []
    assert await session.scalar(select(func.count()).select_from(Job)) == 2


@pytest.mark.asyncio
async def test_cron_auth_and_duplicate_requests(client, session, monkeypatch):
    from app.core.config import settings
    monkeypatch.setattr(settings, "CRON_SECRET", "test-secret-32-chars-long-enough")
    assert (await client.post("/api/v1/internal/jobs/schedules")).status_code == 401
    assert (await client.post("/api/v1/internal/jobs/schedules", headers={"Authorization": "Bearer bad"})).status_code == 401
    for _ in range(2):
        response = await client.post("/api/v1/internal/jobs/schedules", headers={"Authorization": "Bearer test-secret-32-chars-long-enough"})
        assert response.status_code == 202
    assert await session.scalar(select(func.count()).select_from(Job)) <= 2
