from datetime import UTC, datetime, timedelta
from types import SimpleNamespace

import httpx
import pytest
from openai import AsyncOpenAI
from sqlalchemy import select
from sqlalchemy.ext.asyncio import async_sessionmaker

from app.core.config import settings
from app.core.job_runner import JobContext, PermanentJobError, RetryableJobError
from app.models.job import Job
from app.models.security_state import SecurityState
from app.services.ai import job_context
from app.services.ai.job_context import active_ai_context, reserve_ai_call
from app.services.ai.xkiro_provider import XkiroProvider
from app.services.job_service import JobService, enqueue


@pytest.mark.asyncio
async def test_dispatch_budget_counts_retries_and_rolls_back_failed_transaction(engine, monkeypatch):
    monkeypatch.setattr(settings, "AI_DAILY_JOB_LIMIT", 2)
    factory = async_sessionmaker(engine, expire_on_commit=False)
    async with factory() as db, db.begin():
        await reserve_ai_call(db, None)
    with pytest.raises(RuntimeError):
        async with factory() as db, db.begin():
            await reserve_ai_call(db, None)
            raise RuntimeError("rollback")
    async with factory() as db, db.begin():
        await reserve_ai_call(db, None)
    with pytest.raises(PermanentJobError, match="ai_quota_exceeded"):
        async with factory() as db, db.begin():
            await reserve_ai_call(db, None)
    async with factory() as db:
        row = await db.scalar(select(SecurityState).where(SecurityState.namespace == "ai-quota"))
        assert row.counter == 2


@pytest.mark.asyncio
async def test_budget_resets_at_vietnam_midnight(engine, monkeypatch):
    monkeypatch.setattr(settings, "AI_DAILY_JOB_LIMIT", 1)
    instant = datetime(2026, 10, 8, 16, 59, tzinfo=UTC)

    class Clock(datetime):
        @classmethod
        def now(cls, tz=None):
            return instant.astimezone(tz) if tz else instant

    monkeypatch.setattr(job_context, "datetime", Clock)
    factory = async_sessionmaker(engine, expire_on_commit=False)
    async with factory() as db, db.begin():
        await reserve_ai_call(db, None)
    instant += timedelta(minutes=1)
    async with factory() as db, db.begin():
        await reserve_ai_call(db, None)
    async with factory() as db:
        rows = (await db.scalars(select(SecurityState))).all()
        assert len(rows) == 2
        assert [row.counter for row in rows] == [1, 1]


@pytest.mark.asyncio
@pytest.mark.parametrize("status, expected", [(429, RetryableJobError), (400, PermanentJobError)])
async def test_rejected_provider_request_has_known_outcome_and_closes_client(engine, monkeypatch, status, expected):
    monkeypatch.setattr(settings, "XKIRO_API_KEY", "test-key")
    factory = async_sessionmaker(engine, expire_on_commit=False)
    async with factory() as db, db.begin():
        await enqueue(db, "ai.test", {}, "test-reject", ambiguous_on_lease_loss=True)
    async with factory() as db, db.begin():
        claimed = (await JobService.claim(db, 1, 240))[0]
        db.expunge(claimed)
    context = JobContext(claimed, factory)
    def transport(request):
        if request.method == "GET":
            return httpx.Response(200, json={"data": [{"id": settings.XKIRO_MODEL_CHAT_QUICK, "access_tier": "free"}]})
        return httpx.Response(status, json={"error": {"message": "rejected"}})

    client = httpx.AsyncClient(transport=httpx.MockTransport(transport))
    provider = object.__new__(XkiroProvider)
    provider.client = AsyncOpenAI(api_key="test-key", http_client=client, max_retries=0)
    token = active_ai_context.set(context)
    try:
        with pytest.raises(expected):
            await provider.generate_text("test")
    finally:
        active_ai_context.reset(token)
    assert client.is_closed
    async with factory() as db:
        row = await db.get(Job, claimed.id)
        assert row.request_dispatched is False
        budget = await db.scalar(select(SecurityState).where(SecurityState.namespace == "ai-quota"))
        assert budget.counter == 1


@pytest.mark.asyncio
async def test_staged_provider_result_resumes_without_call_or_budget(monkeypatch):
    from unittest.mock import AsyncMock
    monkeypatch.setattr(settings, "XKIRO_API_KEY", "test-key")
    context = SimpleNamespace(job=SimpleNamespace(staged_result={"text": "saved"}), mark_dispatched=AsyncMock())
    provider = object.__new__(XkiroProvider)
    provider.client = SimpleNamespace(close=AsyncMock())
    token = active_ai_context.set(context)
    try:
        assert await provider.generate_text("test") == "saved"
    finally:
        active_ai_context.reset(token)
    context.mark_dispatched.assert_not_called()
    provider.client.close.assert_awaited_once()
