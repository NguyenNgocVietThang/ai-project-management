import json

import pytest
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import async_sessionmaker

from app.core.job_runner import JobContext, JobRunner
from app.models.ai_output import AIOutput
from app.models.ai_request import AIRequest, AIRequestStatus, AIRequestType
from app.models.job import Job
from app.models.project import Project
from app.services.ai.durable_jobs import AI_HANDLERS, mirror_ai_status
from app.services.ai.job_context import active_ai_context
from app.services.ai_service import AIService
from app.services.job_service import JobService

PLAN = {"name": "Durable demo", "description": "demo", "phases": [{"name": "Build", "tasks": [{"name": "Implement", "estimated_hours": 8}]}]}


@pytest.mark.asyncio
async def test_generation_is_atomic_and_replay_does_not_duplicate(engine, session, make_user, seed_roles, monkeypatch):
    user = await make_user(roles=[seed_roles["PM"]])
    response = await AIService(session).request_project_generation("Small demo", user)
    await session.commit()
    factory = async_sessionmaker(engine, expire_on_commit=False)
    calls = []

    async def provider(prompt):
        context = active_ai_context.get()
        if context.job.staged_result:
            return json.loads(context.job.staged_result["text"])
        await context.mark_dispatched()
        calls.append(prompt)
        await context.stage_result({"text": json.dumps(PLAN)})
        return PLAN

    monkeypatch.setattr("app.services.ai.project_generator.generate_project_from_prompt", provider)
    runner = JobRunner(factory, AI_HANDLERS, on_transition=mirror_ai_status)
    assert await runner.poll_once() == 1
    await runner.stop()
    session.expire_all()
    request = await session.get(AIRequest, int(response.job_id))
    assert request.status == AIRequestStatus.COMPLETED
    assert request.project_id is not None
    assert await session.scalar(select(func.count()).select_from(Project)) == 1
    assert await session.scalar(select(func.count()).select_from(AIOutput)) == 1
    assert len(calls) == 1
    assert await runner.poll_once() == 0


@pytest.mark.asyncio
async def test_staged_provider_response_resumes_after_restart(engine, session, make_user, seed_roles, monkeypatch):
    user = await make_user(roles=[seed_roles["PM"]])
    await AIService(session).request_project_generation("Small demo", user)
    await session.commit()
    factory = async_sessionmaker(engine, expire_on_commit=False)
    async with factory() as db, db.begin():
        claimed = (await JobService.claim(db, 1, 120))[0]
        db.expunge(claimed)
    ctx = JobContext(claimed, factory)
    await ctx.mark_dispatched()
    await ctx.stage_result({"text": json.dumps(PLAN)})
    from datetime import UTC, datetime, timedelta
    async with factory() as db, db.begin():
        job = await db.get(Job, claimed.id)
        job.lease_expires_at = datetime.now(UTC) - timedelta(seconds=1)

    async def saved_provider(prompt):
        context = active_ai_context.get()
        assert context.job.staged_result is not None
        return json.loads(context.job.staged_result["text"])

    monkeypatch.setattr("app.services.ai.project_generator.generate_project_from_prompt", saved_provider)
    runner = JobRunner(factory, AI_HANDLERS, on_transition=mirror_ai_status)
    assert await runner.poll_once() == 1
    await runner.stop()
    assert await session.scalar(select(func.count()).select_from(Project)) == 1
    assert await session.scalar(select(func.count()).select_from(AIOutput)) == 1


@pytest.mark.asyncio
@pytest.mark.parametrize("kind", [AIRequestType.SCHEDULE_OPTIMIZE, AIRequestType.RESOURCE_RECOMMEND, AIRequestType.RISK_ANALYSIS, AIRequestType.IMPACT_ANALYSIS])
async def test_other_ai_jobs_persist_correct_outputs_atomically(kind, engine, session, make_user, seed_roles, monkeypatch):
    from app.models.change_request import ChangeRequest
    from app.models.impact_report import ImpactReport
    from app.models.impact_report import RiskLevel as ImpactRisk
    from app.models.risk_report import RiskLevel as Risk
    from app.models.risk_report import RiskReport
    from app.models.task import Task
    user = await make_user(roles=[seed_roles["PM"]])
    project = Project(name="Demo", pm_id=user.id)
    session.add(project)
    await session.flush()
    task = Task(name="Task", project_id=project.id)
    change = ChangeRequest(title="Change", project_id=project.id, requested_by_id=user.id, description="A change")
    session.add_all([task, change])
    await session.flush()
    data = {"project_id": project.id, "task_id": task.id, "change_request_id": change.id}
    response = await AIService(session)._queue(kind, data, user, project_id=project.id, message="queued")
    await session.commit()
    async def simple(*args):
        return {"summary": "tested", "suggestions": [], "recommendations": []}
    async def risk(db, project_id):
        report = RiskReport(project_id=project_id, risk_level=Risk.MEDIUM, risk_score=5, summary="tested", risk_factors_json=["factor"], mitigation_suggestions_json=["fix"])
        db.add(report)
        await db.flush()
        return report
    async def impact(db, change_id):
        report = ImpactReport(change_request_id=change_id, risk_level=ImpactRisk.MEDIUM, risk_score=5, schedule_impact_days=2, cost_impact=20, summary="tested", affected_tasks_json=[task.id])
        db.add(report)
        await db.flush()
        return report
    monkeypatch.setattr("app.services.ai.schedule_optimizer.run_schedule_optimization", simple)
    monkeypatch.setattr("app.services.ai.resource_recommender.run_resource_recommendation", simple)
    monkeypatch.setattr("app.services.ai.risk_analyzer.run_risk_analysis", risk)
    monkeypatch.setattr("app.services.ai.impact_analyzer.run_impact_analysis", impact)
    runner = JobRunner(async_sessionmaker(engine, expire_on_commit=False), AI_HANDLERS, on_transition=mirror_ai_status)
    await runner.poll_once()
    await runner.stop()
    session.expire_all()
    request = await session.get(AIRequest, int(response.job_id))
    assert request.status == AIRequestStatus.COMPLETED, request.error_message
    output = await session.scalar(select(AIOutput).where(AIOutput.ai_request_id == request.id))
    assert output.output_json["summary"] == "tested"
    assert await runner.poll_once() == 0
