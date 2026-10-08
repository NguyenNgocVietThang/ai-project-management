from unittest.mock import AsyncMock

import pytest
from sqlalchemy import func, select

from app.models.job import Job
from app.models.user import User
from app.schemas.auth import RegisterRequest
from app.services.auth_service import AuthService


@pytest.mark.asyncio
async def test_registration_outbox_rollback_and_no_precommit_delivery(session, monkeypatch):
    send = AsyncMock()
    monkeypatch.setattr("app.utils.email.send_email_verification_email", send)
    user = await AuthService(session).register(RegisterRequest(email="demo@example.com", username="demo", full_name="Demo", password="StrongPassword123"))
    job = await session.scalar(select(Job))
    assert job.kind == "email.verify"
    assert job.payload["user_id"] == user.id
    assert "token=" in job.payload["link"]
    send.assert_not_awaited()
    await session.rollback()
    assert await session.scalar(select(func.count()).select_from(User)) == 0
    assert await session.scalar(select(func.count()).select_from(Job)) == 0


@pytest.mark.asyncio
async def test_old_reset_link_not_sent_after_new_request(session, make_user, monkeypatch):
    from sqlalchemy.ext.asyncio import async_sessionmaker

    from app.core.job_runner import JobRunner
    from app.services.durable_handlers import HANDLERS
    user = await make_user()
    await AuthService(session).request_password_reset(user.email)
    await AuthService(session).request_password_reset(user.email)
    await session.commit()
    send = AsyncMock()
    monkeypatch.setattr("app.utils.email.send_password_reset_email", send)
    factory = async_sessionmaker(session.bind, expire_on_commit=False)
    runner = JobRunner(factory, HANDLERS)
    await runner.poll_once()
    await runner.stop()
    jobs = (await session.scalars(select(Job).order_by(Job.id))).all()
    await session.refresh(jobs[0])
    assert jobs[0].status == "failed"
    assert jobs[0].error_code == "email_expired"
    send.assert_not_awaited()
    runner = JobRunner(factory, HANDLERS)
    await runner.poll_once()
    await runner.stop()
    send.assert_awaited_once()
    assert send.call_args.kwargs["idempotency_key"] == jobs[1].dedupe_key
