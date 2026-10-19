import json

import httpx
import pytest
from openai import AsyncOpenAI
from sqlalchemy import select
from sqlalchemy.ext.asyncio import async_sessionmaker

from app.core.config import settings
from app.core.job_runner import AmbiguousJobError, JobContext, PermanentJobError, RetryableJobError
from app.models.job import Job
from app.models.security_state import SecurityState
from app.services.ai.job_context import active_ai_context
from app.services.ai.xkiro_provider import XkiroProvider
from app.services.job_service import JobService, enqueue

FREE = ["mistralai/mistral-large-4-0", "mistralai/mistral-medium-3.5", "qwen/qwen-plus-2025-07-28:free"]


async def invoke(engine, monkeypatch, statuses, *, catalog=None, limit=20, primary="paid/model", catalog_status=200):
    monkeypatch.setattr(settings, "XKIRO_API_KEY", "test-key")
    monkeypatch.setattr(settings, "XKIRO_MODEL_PROJECT_GENERATION", primary)
    monkeypatch.setattr(settings, "AI_DAILY_JOB_LIMIT", limit)
    factory = async_sessionmaker(engine, expire_on_commit=False)
    async with factory() as db, db.begin():
        await enqueue(db, "ai.test", {}, "fallback-test", ambiguous_on_lease_loss=True)
    async with factory() as db, db.begin():
        job = (await JobService.claim(db, 1, 240))[0]
        db.expunge(job)
    context = JobContext(job, factory)
    calls = []

    def transport(request):
        if request.method == "GET":
            if catalog_status != 200:
                return httpx.Response(catalog_status, json={"error": {"message": "catalog unavailable"}})
            rows = catalog if catalog is not None else [
                {"id": "paid/model", "access_tier": "paid"},
                *[{"id": name, "access_tier": "free"} for name in FREE],
            ]
            return httpx.Response(200, json={"object": "list", "data": rows})
        calls.append(json.loads(request.content)["model"])
        status = statuses[min(len(calls) - 1, len(statuses) - 1)]
        if status == "timeout":
            raise httpx.ReadTimeout("timeout", request=request)
        if status != 200:
            return httpx.Response(status, json={"error": {"message": "rejected"}})
        return httpx.Response(200, json={"id": "test", "object": "chat.completion", "created": 1,
            "model": calls[-1], "choices": [{"index": 0, "message": {"role": "assistant", "content": "ok"}, "finish_reason": "stop"}]})

    client = httpx.AsyncClient(transport=httpx.MockTransport(transport))
    provider = object.__new__(XkiroProvider)
    provider.client = AsyncOpenAI(api_key="test-key", http_client=client, max_retries=0)
    token = active_ai_context.set(context)
    error = None
    result = None
    try:
        from app.services.ai.model_router import AITaskType
        result = await provider.generate_text("test", task=AITaskType.PROJECT_GENERATION)
    except (PermanentJobError, RetryableJobError) as exc:
        error = exc
    finally:
        active_ai_context.reset(token)
    assert client.is_closed
    async with factory() as db:
        budget = await db.scalar(select(SecurityState).where(SecurityState.namespace == "ai-quota"))
        saved = await db.get(Job, job.id)
        return calls, error, result, budget.counter if budget else 0, saved.staged_result, saved.request_dispatched


@pytest.mark.asyncio
async def test_free_only_fallback_counts_every_dispatch_and_stages_actual_model(engine, monkeypatch):
    calls, error, result, budget, staged, _ = await invoke(engine, monkeypatch, [404, 200])
    assert error is None
    assert result == "ok"
    assert calls == FREE[:2]
    assert budget == 2
    assert staged == {"text": "ok", "model": FREE[1]}


@pytest.mark.asyncio
@pytest.mark.parametrize("status", [403, 429])
async def test_known_model_rejection_can_use_next_free_model(engine, monkeypatch, status):
    calls, error, _, budget, _, _ = await invoke(engine, monkeypatch, [status, 200])
    assert error is None
    assert calls == FREE[:2]
    assert budget == 2


@pytest.mark.asyncio
@pytest.mark.parametrize("status", [400, 401, 402])
async def test_request_auth_or_account_errors_do_not_rotate_models(engine, monkeypatch, status):
    calls, error, _, budget, _, dispatched = await invoke(engine, monkeypatch, [status])
    assert type(error) is PermanentJobError
    assert calls == FREE[:1]
    assert budget == 1
    assert dispatched is False


@pytest.mark.asyncio
@pytest.mark.parametrize("status", [408, 500, "timeout"])
async def test_ambiguous_outcome_never_dispatches_another_model(engine, monkeypatch, status):
    calls, error, _, budget, _, dispatched = await invoke(engine, monkeypatch, [status])
    assert isinstance(error, AmbiguousJobError)
    assert calls == FREE[:1]
    assert budget == 1
    assert dispatched is True


@pytest.mark.asyncio
async def test_fallback_attempts_are_bounded(engine, monkeypatch):
    calls, error, _, budget, _, dispatched = await invoke(engine, monkeypatch, [404])
    assert isinstance(error, PermanentJobError)
    assert calls == FREE
    assert budget == 3
    assert dispatched is False


@pytest.mark.asyncio
@pytest.mark.parametrize("catalog", [[], [{"id": FREE[0], "access_tier": "paid"}], [{"id": FREE[0]}]])
async def test_empty_or_paid_only_catalog_fails_without_chat_dispatch(engine, monkeypatch, catalog):
    calls, error, _, budget, _, _ = await invoke(engine, monkeypatch, [200], catalog=catalog)
    assert error.code == "no_free_model_available"
    assert calls == []
    assert budget == 0


@pytest.mark.asyncio
async def test_fallback_cannot_bypass_daily_quota(engine, monkeypatch):
    calls, error, _, budget, _, dispatched = await invoke(engine, monkeypatch, [404, 200], limit=1)
    assert error.code == "ai_quota_exceeded"
    assert calls == FREE[:1]
    assert budget == 1
    assert dispatched is False


@pytest.mark.asyncio
async def test_free_primary_is_preferred_and_duplicate_candidates_are_removed(engine, monkeypatch):
    calls, error, _, budget, _, _ = await invoke(engine, monkeypatch, [404, 404, 200], primary=FREE[1])
    assert error is None
    assert calls == [FREE[1], FREE[0], FREE[2]]
    assert budget == 3


@pytest.mark.asyncio
async def test_catalog_outage_never_dispatches_a_generation(engine, monkeypatch):
    calls, error, _, budget, _, _ = await invoke(engine, monkeypatch, [200], catalog_status=503)
    assert isinstance(error, RetryableJobError)
    assert error.code == "model_catalog_unavailable"
    assert calls == []
    assert budget == 0
