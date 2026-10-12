"""Integration test cho job hỏi làm rõ `ai.requirement_clarify` (C2) với provider giả."""
import hashlib
import json
from datetime import UTC, datetime, timedelta
from zoneinfo import ZoneInfo

import pytest
from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import async_sessionmaker

from app.core.config import settings
from app.core.job_runner import JobContext, JobRunner
from app.models.ai_output import AIOutput
from app.models.ai_request import AIRequest, AIRequestStatus
from app.models.job import Job
from app.models.requirement_brief import RequirementBrief
from app.models.security_state import SecurityState
from app.schemas.requirement_brief import apply_item_updates, empty_items
from app.services.ai.durable_jobs import AI_HANDLERS, mirror_ai_status
from app.services.ai.job_context import active_ai_context, reserve_ai_call
from app.services.ai.requirement_clarifier import (
    JOB_KIND,
    apply_clarify_result,
    enqueue_clarify_turn,
)
from app.services.job_service import JobService

GOOD = {
    "items": [
        {"key": "goals", "status": "clear", "value": "Bán cà phê online"},
        {"key": "stakeholders", "status": "clear", "value": "AI ghi đè"},
        {"key": "constraints", "status": "missing", "proposed_assumption": "Ngân sách nhỏ"},
    ],
    "next_question": "Ai là khách hàng chính?",
}


class FakeProvider:
    """Provider giả theo đúng giao thức checkpoint của provider thật."""

    def __init__(self, payload):
        self.payload = payload
        self.calls = 0

    async def generate_json(self, prompt, system_prompt="", task=None):
        context = active_ai_context.get()
        if context.job.staged_result:
            return json.loads(context.job.staged_result["text"])
        await context.mark_dispatched()
        self.calls += 1
        if isinstance(self.payload, Exception):
            raise self.payload
        await context.stage_result({"text": json.dumps(self.payload)})
        return self.payload


class QuotaProvider(FakeProvider):
    """Dùng đúng bước trừ quota của provider thật trước khi dispatch."""

    async def generate_json(self, prompt, system_prompt="", task=None):
        await active_ai_context.get().mark_dispatched(before_dispatch=reserve_ai_call)
        self.calls += 1
        return self.payload


def use_provider(monkeypatch, provider):
    async def factory():
        return provider

    monkeypatch.setattr("app.services.ai.project_generator.get_ai_provider", factory)
    return provider


async def make_brief(session, user, **overrides):
    # Mục stakeholders đã được người dùng chốt: AI không được ghi đè.
    items = apply_item_updates(
        empty_items(), [{"key": "stakeholders", "status": "clear", "value": "Chủ quán"}], source="user"
    ).items
    brief = RequirementBrief(
        owner_id=user.id, idea="Ứng dụng bán cà phê", items=items.to_json(), qa_history=[], **overrides
    )
    session.add(brief)
    await session.flush()
    return brief


def make_runner(engine):
    return JobRunner(async_sessionmaker(engine, expire_on_commit=False), AI_HANDLERS, on_transition=mirror_ai_status)


def exhaust_quota(session):
    today = datetime.now(ZoneInfo(settings.APP_TIMEZONE)).date()
    session.add(SecurityState(
        namespace="ai-quota", key_hash=hashlib.sha256(today.isoformat().encode()).hexdigest(),
        counter=settings.AI_DAILY_JOB_LIMIT, expires_at=datetime.now(UTC) + timedelta(days=2),
    ))


@pytest.mark.asyncio
async def test_good_turn_applies_once(engine, session, make_user, monkeypatch):
    user = await make_user()
    brief = await make_brief(session, user)
    request, job = await enqueue_clarify_turn(session, brief, user)
    assert job.kind == JOB_KIND and brief.pending_job_id == job.id
    brief_id = brief.id
    request_id = request.id
    await session.commit()
    provider = use_provider(monkeypatch, FakeProvider(GOOD))
    runner = make_runner(engine)
    assert await runner.poll_once() == 1
    assert await runner.poll_once() == 0
    await runner.stop()
    session.expire_all()
    brief = await session.get(RequirementBrief, brief_id)
    assert provider.calls == 1
    assert brief.turn_count == 1 and brief.pending_job_id is None and brief.last_ai_request_id == request_id
    assert brief.items["goals"] == {"status": "clear", "value": "Bán cà phê online", "source": "ai", "proposed_assumption": None}
    assert brief.items["stakeholders"]["value"] == "Chủ quán"
    assert brief.items["constraints"]["proposed_assumption"] == "Ngân sách nhỏ"
    assert brief.qa_history[-1]["question"] == "Ai là khách hàng chính?"
    assert brief.qa_history[-1]["ai_request_id"] == request_id
    assert brief.status == "clarifying"
    output = await session.scalar(select(AIOutput).where(AIOutput.ai_request_id == request_id))
    assert output.output_json["ignored"] == ["stakeholders"]
    assert output.output_json["complete"] is False
    assert (await session.get(AIRequest, request_id)).status == AIRequestStatus.COMPLETED


@pytest.mark.asyncio
@pytest.mark.parametrize("payload", [
    {"items": [], "next_question": "Mục tiêu là gì? Ngân sách bao nhiêu?"},
    {"items": [{"key": "goals", "status": "assumed", "value": "x"}], "next_question": None},
    {"items": [], "next_question": None, "extra": True},
    {"items": [], "next_question": ["A?", "B?"]},
])
async def test_invalid_output_fails_job_without_touching_brief(engine, session, make_user, monkeypatch, payload):
    user = await make_user()
    brief = await make_brief(session, user)
    before = dict(brief.items)
    request, job = await enqueue_clarify_turn(session, brief, user)
    brief_id = brief.id
    job_id = job.id
    await session.commit()
    use_provider(monkeypatch, FakeProvider(payload))
    runner = make_runner(engine)
    await runner.poll_once()
    await runner.stop()
    session.expire_all()
    brief = await session.get(RequirementBrief, brief_id)
    assert brief.items == before and brief.turn_count == 0 and brief.qa_history == []
    assert brief.last_ai_request_id is None
    failed = await session.get(Job, job_id)
    assert failed.status == "failed" and failed.error_code == "invalid_provider_response"
    assert await session.scalar(select(func.count()).select_from(AIOutput)) == 0
    # Job đã kết thúc: được tạo lượt mới dù pending_job_id còn trỏ vào job cũ.
    await session.refresh(user)
    await enqueue_clarify_turn(session, brief, user)


@pytest.mark.asyncio
async def test_provider_timeout_does_not_touch_brief(engine, session, make_user, monkeypatch):
    user = await make_user()
    brief = await make_brief(session, user)
    request, job = await enqueue_clarify_turn(session, brief, user)
    brief_id = brief.id
    job_id = job.id
    await session.commit()
    use_provider(monkeypatch, FakeProvider(TimeoutError()))
    runner = make_runner(engine)
    await runner.poll_once()
    await runner.stop()
    session.expire_all()
    brief = await session.get(RequirementBrief, brief_id)
    assert brief.turn_count == 0 and brief.qa_history == [] and brief.last_ai_request_id is None
    assert (await session.get(Job, job_id)).status != "succeeded"
    assert await session.scalar(select(func.count()).select_from(AIOutput)) == 0


@pytest.mark.asyncio
async def test_restart_with_staged_result_and_repeat_apply_are_idempotent(engine, session, make_user, monkeypatch):
    user = await make_user()
    brief = await make_brief(session, user)
    request, job = await enqueue_clarify_turn(session, brief, user)
    brief_id = brief.id
    request_id = request.id
    await session.commit()
    factory = async_sessionmaker(engine, expire_on_commit=False)
    # Mô phỏng worker chết sau khi provider đã trả lời (kết quả đã được stage).
    async with factory() as db, db.begin():
        claimed = (await JobService.claim(db, 1, 120))[0]
        db.expunge(claimed)
    ctx = JobContext(claimed, factory)
    await ctx.mark_dispatched()
    await ctx.stage_result({"text": json.dumps(GOOD)})
    async with factory() as db, db.begin():
        stale = await db.get(Job, claimed.id)
        stale.lease_expires_at = datetime.now(UTC) - timedelta(seconds=1)
    provider = use_provider(monkeypatch, FakeProvider(GOOD))
    runner = make_runner(engine)
    assert await runner.poll_once() == 1
    await runner.stop()
    assert provider.calls == 0

    # Áp lại trực tiếp cùng một lượt: phải bị bỏ qua.
    async with factory() as db, db.begin():
        again = await apply_clarify_result(db, request=await db.get(AIRequest, request_id), brief_id=brief_id, result=GOOD)
    assert again is None
    session.expire_all()
    brief = await session.get(RequirementBrief, brief_id)
    assert brief.turn_count == 1 and len(brief.qa_history) == 1
    assert await session.scalar(select(func.count()).select_from(AIOutput)) == 1


@pytest.mark.asyncio
async def test_complete_turn_reports_complete_but_keeps_status(engine, session, make_user, monkeypatch):
    user = await make_user()
    brief = await make_brief(session, user)
    request, job = await enqueue_clarify_turn(session, brief, user)
    brief_id = brief.id
    await session.commit()
    keys = ["goals", "in_scope", "out_of_scope", "key_features", "constraints", "success_criteria"]
    use_provider(monkeypatch, FakeProvider({"items": [{"key": k, "status": "clear", "value": k} for k in keys], "next_question": None}))
    runner = make_runner(engine)
    await runner.poll_once()
    await runner.stop()
    session.expire_all()
    brief = await session.get(RequirementBrief, brief_id)
    output = await session.scalar(select(AIOutput))
    assert output.output_json["complete"] is True and output.output_json["missing"] == []
    assert brief.status == "clarifying" and brief.qa_history == [] and brief.turn_count == 1


@pytest.mark.asyncio
async def test_enqueue_guards_keep_brief_unchanged(session, make_user):
    user = await make_user()
    other = await make_user()
    brief = await make_brief(session, user)
    with pytest.raises(HTTPException) as exc:
        await enqueue_clarify_turn(session, brief, other)
    assert exc.value.status_code == 403

    await enqueue_clarify_turn(session, brief, user)
    with pytest.raises(HTTPException) as exc:
        await enqueue_clarify_turn(session, brief, user)
    assert (exc.value.status_code, exc.value.detail) == (409, "clarify_turn_pending")

    limited = await make_brief(session, user, turn_count=12)
    with pytest.raises(HTTPException) as exc:
        await enqueue_clarify_turn(session, limited, user)
    assert (exc.value.status_code, exc.value.detail) == (409, "clarify_turn_limit")
    assert limited.pending_job_id is None and limited.turn_count == 12

    ready = await make_brief(session, user, status="ready")
    with pytest.raises(HTTPException) as exc:
        await enqueue_clarify_turn(session, ready, user)
    assert (exc.value.status_code, exc.value.detail) == (409, "brief_not_clarifying")


@pytest.mark.asyncio
async def test_enqueue_rejects_when_daily_quota_exhausted(session, make_user):
    user = await make_user()
    brief = await make_brief(session, user)
    exhaust_quota(session)
    await session.flush()
    with pytest.raises(HTTPException) as exc:
        await enqueue_clarify_turn(session, brief, user)
    assert (exc.value.status_code, exc.value.detail) == (429, "ai_quota_exceeded")
    assert brief.pending_job_id is None
    assert await session.scalar(select(func.count()).select_from(Job)) == 0


@pytest.mark.asyncio
async def test_quota_exhausted_at_dispatch_fails_job_and_keeps_brief(engine, session, make_user, monkeypatch):
    user = await make_user()
    brief = await make_brief(session, user)
    request, job = await enqueue_clarify_turn(session, brief, user)
    exhaust_quota(session)
    brief_id = brief.id
    job_id = job.id
    await session.commit()
    provider = use_provider(monkeypatch, QuotaProvider(GOOD))
    runner = make_runner(engine)
    await runner.poll_once()
    await runner.stop()
    session.expire_all()
    assert provider.calls == 0
    assert (await session.get(Job, job_id)).error_code == "ai_quota_exceeded"
    brief = await session.get(RequirementBrief, brief_id)
    assert brief.turn_count == 0 and brief.qa_history == []
