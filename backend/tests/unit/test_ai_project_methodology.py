"""Confirmed methodology is authoritative; provided invalid plan values fail closed."""
import pytest
from sqlalchemy import func, select

from app.models.project import Project
from app.services.ai.persistence import _persist_plan
from tests.integration.test_project_from_brief_job import PLAN


@pytest.mark.asyncio
@pytest.mark.parametrize("methodology", ["agile", "waterfall", "hybrid"])
async def test_persistence_carries_plan_methodology(session, make_user, seed_roles, methodology):
    user = await make_user(roles=[seed_roles["PM"]])
    project = await _persist_plan(session, {**PLAN, "methodology": methodology}, user)
    assert project.methodology == methodology


@pytest.mark.asyncio
@pytest.mark.parametrize("invalid", ["scrum", "WATERFALL", "", None, 42])
@pytest.mark.parametrize("confirmed", [None, "waterfall"])
async def test_invalid_supplied_plan_methodology_rejected_before_any_project(
    session, make_user, seed_roles, invalid, confirmed,
):
    user = await make_user(roles=[seed_roles["PM"]])
    with pytest.raises(ValueError):
        await _persist_plan(session, {**PLAN, "methodology": invalid}, user, confirmed_methodology=confirmed)
    assert await session.scalar(select(func.count()).select_from(Project)) == 0


@pytest.mark.asyncio
async def test_legacy_missing_methodology_defaults_agile_without_name_inference(session, make_user, seed_roles):
    user = await make_user(roles=[seed_roles["PM"]])
    project = await _persist_plan(session, {**PLAN, "name": "Waterfall named legacy project"}, user)
    assert project.methodology == "agile"


@pytest.mark.asyncio
async def test_legacy_worker_uses_same_methodology_persistence(session, make_user, seed_roles):
    from app.workers.ai_tasks import _persist_plan as legacy_persist
    user = await make_user(roles=[seed_roles["PM"]])
    project = await legacy_persist(session, {**PLAN, "methodology": "hybrid"}, user)
    assert project.methodology == "hybrid"
