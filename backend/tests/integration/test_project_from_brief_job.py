"""Integration test C4: sinh dự án từ hồ sơ yêu cầu đã chốt với provider giả."""
import json
from datetime import UTC, datetime, timedelta

import pytest
from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import async_sessionmaker

from app.core.job_runner import JobContext, JobRunner
from app.models.ai_request import AIRequest, AIRequestStatus
from app.models.job import Job
from app.models.project import Project
from app.models.requirement_brief import RequirementBrief
from app.services.ai.durable_jobs import AI_HANDLERS, mirror_ai_status, run_ai
from app.services.ai.job_context import active_ai_context
from app.services.ai.parsing import USER_INPUT_FENCE
from app.services.ai_service import AIService
from app.services.job_service import JobService
from tests.integration.test_requirement_clarify_job import exhaust_quota

PLAN = {"name": "Quán cà phê", "description": "demo", "phases": [{"name": "Build", "tasks": [{"name": "Implement", "estimated_hours": 8}]}]}

# Hồ sơ đã chốt: có mục clear, assumed, skipped và một mục missing còn đề xuất giả định.
READY_ITEMS = {
    "goals": {"status": "clear", "value": "GIA_TRI_CLEAR bán cà phê online", "source": "user", "proposed_assumption": None},
    "stakeholders": {"status": "clear", "value": "Chủ quán", "source": "ai", "proposed_assumption": None},
    "in_scope": {"status": "assumed", "value": "GIA_TRI_ASSUMED web và mobile", "source": "ai_assumption_confirmed", "proposed_assumption": None},
    "out_of_scope": {"status": "skipped", "value": None, "source": None, "proposed_assumption": None},
    "key_features": {"status": "clear", "value": "Đặt hàng", "source": "user", "proposed_assumption": None},
    "constraints": {"status": "missing", "value": None, "source": None, "proposed_assumption": "DE_XUAT_BIA_DAT"},
    "success_criteria": {"status": "skipped", "value": None, "source": None, "proposed_assumption": None},
}


class FakeProvider:
    """Provider giả theo giao thức checkpoint; ghi lại prompt đã nhận."""

    def __init__(self, payload):
        self.payload = payload
        self.prompts = []

    async def generate_json(self, prompt, system_prompt="", task=None):
        context = active_ai_context.get()
        if context.job.staged_result:
            return json.loads(context.job.staged_result["text"])
        await context.mark_dispatched()
        self.prompts.append((prompt, system_prompt))
        await context.stage_result({"text": json.dumps(self.payload)})
        return self.payload


def use_provider(monkeypatch, provider):
    async def factory():
        return provider

    monkeypatch.setattr("app.services.ai.project_generator.get_ai_provider", factory)
    return provider


async def make_brief(session, user, status="ready"):
    brief = RequirementBrief(
        owner_id=user.id, idea="Ứng dụng bán cà phê", items=json.loads(json.dumps(READY_ITEMS)),
        qa_history=[], status=status,
    )
    session.add(brief)
    await session.flush()
    return brief


def make_runner(engine):
    return JobRunner(async_sessionmaker(engine, expire_on_commit=False), AI_HANDLERS, on_transition=mirror_ai_status)


async def job_for(session, request_id):
    jobs = (await session.scalars(select(Job))).all()
    return next(job for job in jobs if job.payload.get("ai_request_id") == request_id)


@pytest.mark.asyncio
async def test_ready_brief_generates_one_project_and_consumes_brief(engine, session, make_user, seed_roles, monkeypatch):
    user = await make_user(roles=[seed_roles["PM"]])
    brief = await make_brief(session, user)
    brief_id = brief.id
    response = await AIService(session).request_project_generation_from_brief(brief_id, user)
    assert brief.pending_job_id is not None
    await session.commit()
    provider = use_provider(monkeypatch, FakeProvider(PLAN))
    runner = make_runner(engine)
    assert await runner.poll_once() == 1
    assert await runner.poll_once() == 0
    await runner.stop()
    session.expire_all()
    request = await session.get(AIRequest, int(response.job_id))
    brief = await session.get(RequirementBrief, brief_id)
    assert request.status == AIRequestStatus.COMPLETED and request.project_id is not None, request.error_message
    assert brief.status == "consumed" and brief.project_id == request.project_id and brief.pending_job_id is None
    assert await session.scalar(select(func.count()).select_from(Project)) == 1

    # Prompt: chỉ mục clear/assumed có giá trị; skipped/missing chỉ nêu tên, không kèm đề xuất.
    assert len(provider.prompts) == 1
    prompt, system_prompt = provider.prompts[0]
    body = json.loads(prompt.split(USER_INPUT_FENCE)[1].strip())
    assert body["idea"] == "Ứng dụng bán cà phê"
    assert body["clear_requirements"]["goals"].startswith("GIA_TRI_CLEAR")
    assert body["confirmed_assumptions"] == {"in_scope": "GIA_TRI_ASSUMED web và mobile"}
    assert set(body["unspecified_items"]) == {"out_of_scope", "constraints", "success_criteria"}
    for key in body["unspecified_items"]:
        assert key not in body["clear_requirements"] and key not in body["confirmed_assumptions"]
    assert "DE_XUAT_BIA_DAT" not in prompt
    assert "do NOT invent" in system_prompt and "CONFIRMED" in system_prompt

    # Hồ sơ đã consumed: không được xếp hàng lần nữa.
    await session.refresh(user)
    with pytest.raises(HTTPException) as exc:
        await AIService(session).request_project_generation_from_brief(brief_id, user)
    assert (exc.value.status_code, exc.value.detail) == (409, "brief_not_ready")


@pytest.mark.asyncio
async def test_brief_not_ready_or_foreign_is_rejected(session, make_user):
    user = await make_user()
    other = await make_user()
    clarifying = await make_brief(session, user, status="clarifying")
    with pytest.raises(HTTPException) as exc:
        await AIService(session).request_project_generation_from_brief(clarifying.id, user)
    assert (exc.value.status_code, exc.value.detail) == (409, "brief_not_ready")
    ready = await make_brief(session, user)
    with pytest.raises(HTTPException) as exc:
        await AIService(session).request_project_generation_from_brief(ready.id, other)
    assert exc.value.status_code == 404
    assert await session.scalar(select(func.count()).select_from(Job)) == 0


@pytest.mark.asyncio
async def test_second_enqueue_while_pending_is_rejected_and_key_is_idempotent(session, make_user):
    user = await make_user()
    brief = await make_brief(session, user)
    await AIService(session).request_project_generation_from_brief(brief.id, user)
    with pytest.raises(HTTPException) as exc:
        await AIService(session).request_project_generation_from_brief(brief.id, user)
    assert (exc.value.status_code, exc.value.detail) == (409, "brief_generation_pending")
    # Cùng Idempotency-Key: trả lại đúng job cũ, không tạo job mới.
    keyed = await make_brief(session, user)
    first = await AIService(session).request_project_generation_from_brief(keyed.id, user, request_key="k1")
    again = await AIService(session).request_project_generation_from_brief(keyed.id, user, request_key="k1")
    assert again.job_id == first.job_id
    assert await session.scalar(select(func.count()).select_from(Job)) == 2


@pytest.mark.asyncio
async def test_quota_exhausted_returns_429(session, make_user):
    user = await make_user()
    brief = await make_brief(session, user)
    exhaust_quota(session)
    await session.flush()
    with pytest.raises(HTTPException) as exc:
        await AIService(session).request_project_generation_from_brief(brief.id, user)
    assert (exc.value.status_code, exc.value.detail) == (429, "ai_quota_exceeded")
    assert brief.pending_job_id is None


@pytest.mark.asyncio
async def test_restart_and_duplicate_jobs_never_create_two_projects(engine, session, make_user, seed_roles, monkeypatch):
    user = await make_user(roles=[seed_roles["PM"]])
    brief = await make_brief(session, user)
    brief_id = brief.id
    first = await AIService(session).request_project_generation_from_brief(brief_id, user)
    # Mô phỏng job thứ hai lọt qua chốt pending (trường hợp xấu nhất).
    brief.pending_job_id = None
    await session.flush()
    second = await AIService(session).request_project_generation_from_brief(brief_id, user)
    await session.commit()
    factory = async_sessionmaker(engine, expire_on_commit=False)
    # Worker chết sau khi provider đã trả lời cho job đầu (kết quả đã stage).
    async with factory() as db, db.begin():
        claimed = (await JobService.claim(db, 1, 120))[0]
        db.expunge(claimed)
    ctx = JobContext(claimed, factory)
    await ctx.mark_dispatched()
    await ctx.stage_result({"text": json.dumps(PLAN)})
    async with factory() as db, db.begin():
        stale = await db.get(Job, claimed.id)
        stale.lease_expires_at = datetime.now(UTC) - timedelta(seconds=1)
    provider = use_provider(monkeypatch, FakeProvider(PLAN))
    # Mỗi vòng chờ job chạy xong (stop) rồi mới poll tiếp, để thứ tự xác định.
    for _ in range(3):
        runner = make_runner(engine)
        await runner.poll_once()
        await runner.stop()
    session.expire_all()
    brief = await session.get(RequirementBrief, brief_id)
    assert brief.status == "consumed" and brief.project_id is not None
    assert await session.scalar(select(func.count()).select_from(Project)) == 1
    for response in (first, second):
        assert (await session.get(AIRequest, int(response.job_id))).status == AIRequestStatus.COMPLETED
    # Chỉ một job gọi provider; job còn lại dùng kết quả đã stage và bị chặn khi apply
    # (hoặc thấy hồ sơ consumed nên không gọi provider).
    assert len(provider.prompts) <= 1

    # Áp lại trực tiếp một job (giả lập apply lặp sau restart): vẫn chỉ một dự án.
    job = await job_for(session, int(second.job_id))
    outcome = await run_ai(JobContext(job, factory))
    if outcome.apply is not None:
        async with factory() as db, db.begin():
            await outcome.apply(db, await db.get(Job, job.id))
    assert await session.scalar(select(func.count()).select_from(Project)) == 1


@pytest.mark.asyncio
async def test_endpoint_contract(session, make_user, seed_roles, as_user):
    user = await make_user(roles=[seed_roles["Admin"]])
    ready = await make_brief(session, user)
    clarifying = await make_brief(session, user, status="clarifying")
    client = as_user(user)
    response = await client.post("/api/v1/ai/generate-project-from-brief", json={"brief_id": ready.id})
    assert response.status_code == 202 and response.json()["status"] == "PENDING"
    response = await client.post("/api/v1/ai/generate-project-from-brief", json={"brief_id": clarifying.id})
    assert response.status_code == 409
    response = await client.post("/api/v1/ai/generate-project-from-brief", json={"brief_id": 999999})
    assert response.status_code == 404
    response = await client.post("/api/v1/ai/generate-project-from-brief", json={"brief_id": ready.id, "x": 1})
    assert response.status_code == 422


@pytest.mark.asyncio
@pytest.mark.parametrize("methodology", ["agile", "waterfall", "hybrid"])
async def test_confirmed_methodology_reaches_prompt_output_and_project(
    engine, session, make_user, seed_roles, as_user, monkeypatch, methodology,
):
    from app.models.ai_output import AIOutput
    from app.models.dependency import Dependency
    from app.models.phase import Phase
    from app.models.sprint import Sprint
    from app.models.task import Task

    user = await make_user(roles=[seed_roles["Admin"]])
    brief = await make_brief(session, user)
    # A valid but contradictory model choice cannot replace the confirmed choice.
    plan = {"name": "Confirmed project", "methodology": "hybrid" if methodology != "hybrid" else "agile",
            "phases": [
                {"name": "Requirements", "tasks": [{"name": "Specify", "estimated_hours": 8}]},
                {"name": "Delivery", "tasks": [{"name": "Implement", "estimated_hours": 16, "dependencies": ["Specify"]}]},
            ]}
    async with as_user(user) as http:
        response = await http.post("/api/v1/ai/generate-project-from-brief",
                                   json={"brief_id": brief.id, "methodology": methodology})
    assert response.status_code == 202, response.text
    request_id = int(response.json()["job_id"])
    request = await session.get(AIRequest, request_id)
    assert request.input_data_json == {"brief_id": brief.id, "methodology": methodology}
    assert len(brief.items) == 7
    await session.commit()
    provider = use_provider(monkeypatch, FakeProvider(plan))
    runner = make_runner(engine)
    await runner.poll_once()
    await runner.stop()
    session.expire_all()
    request = await session.get(AIRequest, request_id)
    assert request.status == AIRequestStatus.COMPLETED, request.error_message
    project = await session.get(Project, request.project_id)
    assert project.methodology.value == methodology
    output = await session.scalar(select(AIOutput).where(AIOutput.ai_request_id == request_id))
    assert output.output_json["methodology"] == methodology
    prompt, system = provider.prompts[0]
    body = json.loads(prompt.split(USER_INPUT_FENCE)[1].strip())
    assert body["methodology"] == methodology
    assert '"methodology"' in system and "waterfall" in system
    assert "Sprint" in system
    phases = (await session.scalars(select(Phase).where(Phase.project_id == project.id))).all()
    tasks = (await session.scalars(select(Task).where(Task.project_id == project.id))).all()
    assert {phase.name for phase in phases} == {"Requirements", "Delivery"}
    assert {task.name for task in tasks} == {"Specify", "Implement"}
    ids = {task.name: task.id for task in tasks}
    dependency = await session.scalar(select(Dependency).where(Dependency.successor_id == ids["Implement"]))
    assert dependency.predecessor_id == ids["Specify"]
    assert all(task.phase_id in {phase.id for phase in phases} and task.sprint_id is None for task in tasks)
    assert await session.scalar(select(func.count()).select_from(Sprint).where(Sprint.project_id == project.id)) == 0
    assert all(task.early_start is not None and task.early_finish is not None for task in tasks)


@pytest.mark.asyncio
@pytest.mark.parametrize("methodology", ["waterfall", "hybrid", "agile", None])
async def test_restart_legacy_staged_plan_preserves_saved_choice_without_provider(
    engine, session, make_user, seed_roles, monkeypatch, methodology,
):
    user = await make_user(roles=[seed_roles["PM"]])
    brief = await make_brief(session, user)
    kwargs = {"methodology": methodology} if methodology is not None else {}
    response = await AIService(session).request_project_generation_from_brief(brief.id, user, **kwargs)
    request_id = int(response.job_id)
    await session.commit()
    factory = async_sessionmaker(engine, expire_on_commit=False)
    async with factory() as db, db.begin():
        claimed = (await JobService.claim(db, 1, 120))[0]
        db.expunge(claimed)
    context = JobContext(claimed, factory)
    await context.mark_dispatched()
    await context.stage_result({"text": json.dumps(PLAN)})
    async with factory() as db, db.begin():
        job = await db.get(Job, claimed.id)
        job.lease_expires_at = datetime.now(UTC) - timedelta(seconds=1)

    async def forbidden_provider():
        pytest.fail("staged restart must not construct or call a provider")
    monkeypatch.setattr("app.services.ai.project_generator.get_ai_provider", forbidden_provider)
    runner = make_runner(engine)
    await runner.poll_once()
    await runner.stop()
    session.expire_all()
    request = await session.get(AIRequest, request_id)
    assert request.status == AIRequestStatus.COMPLETED, request.error_message
    assert (await session.get(Project, request.project_id)).methodology.value == (methodology or "agile")
    assert await session.scalar(select(func.count()).select_from(Project)) == 1


@pytest.mark.asyncio
async def test_methodology_is_part_of_idempotency_payload(session, make_user, seed_roles, as_user):
    user = await make_user(roles=[seed_roles["Admin"]])
    brief = await make_brief(session, user)
    async with as_user(user) as http:
        headers = {"Idempotency-Key": "confirmed-choice"}
        body = {"brief_id": brief.id, "methodology": "waterfall"}
        first = await http.post("/api/v1/ai/generate-project-from-brief", json=body, headers=headers)
        again = await http.post("/api/v1/ai/generate-project-from-brief", json=body, headers=headers)
        changed = await http.post("/api/v1/ai/generate-project-from-brief",
                                  json={**body, "methodology": "agile"}, headers=headers)
    assert first.status_code == again.status_code == 202
    assert first.json()["job_id"] == again.json()["job_id"]
    assert changed.status_code == 409
    assert await session.scalar(select(func.count()).select_from(Job)) == 1


@pytest.mark.asyncio
async def test_legacy_idempotency_omission_is_preserved_and_explicit_choice_conflicts(session, make_user):
    user = await make_user()
    brief = await make_brief(session, user)
    service = AIService(session)
    first = await service.request_project_generation_from_brief(brief.id, user, request_key="legacy")
    again = await service.request_project_generation_from_brief(brief.id, user, request_key="legacy")
    request = await session.get(AIRequest, int(first.job_id))
    assert request.input_data_json == {"brief_id": brief.id}
    assert first.job_id == again.job_id
    with pytest.raises(HTTPException) as error:
        await service.request_project_generation_from_brief(brief.id, user, methodology="agile", request_key="legacy")
    assert error.value.status_code == 409
    assert await session.scalar(select(func.count()).select_from(Job)) == 1
