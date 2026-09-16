"""SOP-AI-004: goi y nhan su phai loc bo user_id AI bia ra va chuan hoa fit_score/rank."""
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

import pytest

import app.db.base  # noqa: F401 - dang ky quan he SQLAlchemy
from app.core.exceptions import NotFoundException
from app.services.ai.resource_recommender import (
    generate_resource_recommendation,
    run_resource_recommendation,
)


def _task(**overrides):
    values = {
        "id": 1,
        "project_id": 10,
        "name": "Build login page",
        "description": "Implement the login form",
    }
    values.update(overrides)
    return SimpleNamespace(**values)


def _candidate(user_id, **overrides):
    values = {
        "user_id": user_id,
        "full_name": f"User {user_id}",
        "skills": ["Python"],
        "hourly_rate": 20.0,
        "current_workload_hours": 5.0,
        "on_leave": False,
    }
    values.update(overrides)
    return values


@pytest.mark.asyncio
async def test_valid_ranked_response_passes_through():
    candidates = [_candidate(1), _candidate(2)]
    ai_response = {
        "summary": "User 2 fits best",
        "recommendations": [
            {"user_id": 2, "rank": 1, "reason": "Strong skill match", "fit_score": 90},
            {"user_id": 1, "rank": 2, "reason": "Available", "fit_score": 60},
        ],
    }
    with patch(
        "app.services.ai.resource_recommender.XkiroProvider.generate_json",
        new=AsyncMock(return_value=ai_response),
    ):
        result = await generate_resource_recommendation(_task(), candidates)

    assert result["summary"] == "User 2 fits best"
    assert [item["user_id"] for item in result["recommendations"]] == [2, 1]
    assert [item["rank"] for item in result["recommendations"]] == [1, 2]
    assert result["recommendations"][0]["fit_score"] == 90


@pytest.mark.asyncio
async def test_unknown_user_id_is_dropped_without_crashing():
    candidates = [_candidate(1)]
    ai_response = {
        "summary": "ok",
        "recommendations": [
            {"user_id": 1, "rank": 1, "reason": "fine", "fit_score": 50},
            {"user_id": 999, "rank": 2, "reason": "made up", "fit_score": 80},
        ],
    }
    with patch(
        "app.services.ai.resource_recommender.XkiroProvider.generate_json",
        new=AsyncMock(return_value=ai_response),
    ):
        result = await generate_resource_recommendation(_task(), candidates)

    assert [item["user_id"] for item in result["recommendations"]] == [1]


@pytest.mark.asyncio
async def test_fit_score_outside_range_is_clamped():
    candidates = [_candidate(1), _candidate(2)]
    ai_response = {
        "summary": "ok",
        "recommendations": [
            {"user_id": 1, "rank": 1, "reason": "great", "fit_score": 500},
            {"user_id": 2, "rank": 2, "reason": "bad", "fit_score": -20},
        ],
    }
    with patch(
        "app.services.ai.resource_recommender.XkiroProvider.generate_json",
        new=AsyncMock(return_value=ai_response),
    ):
        result = await generate_resource_recommendation(_task(), candidates)

    scores = {item["user_id"]: item["fit_score"] for item in result["recommendations"]}
    assert scores[1] == 100
    assert scores[2] == 0


@pytest.mark.asyncio
async def test_ranks_are_renumbered_contiguously_after_filtering():
    candidates = [_candidate(1), _candidate(2), _candidate(3)]
    ai_response = {
        "summary": "ok",
        "recommendations": [
            {"user_id": 999, "rank": 1, "reason": "fake", "fit_score": 99},
            {"user_id": 1, "rank": 5, "reason": "a", "fit_score": 40},
            {"user_id": 2, "rank": 9, "reason": "b", "fit_score": 70},
            {"user_id": 3, "rank": 2, "reason": "c", "fit_score": 55},
        ],
    }
    with patch(
        "app.services.ai.resource_recommender.XkiroProvider.generate_json",
        new=AsyncMock(return_value=ai_response),
    ):
        result = await generate_resource_recommendation(_task(), candidates)

    ranks = [item["rank"] for item in result["recommendations"]]
    assert ranks == [1, 2, 3]
    # Sap giam dan theo fit_score: user 2 (70) > user 3 (55) > user 1 (40)
    assert [item["user_id"] for item in result["recommendations"]] == [2, 3, 1]


@pytest.mark.asyncio
async def test_run_resource_recommendation_merges_stats_and_raises_when_task_missing():
    db = AsyncMock()
    db.get = AsyncMock(return_value=None)

    with pytest.raises(NotFoundException):
        await run_resource_recommendation(db, 1)


@pytest.mark.asyncio
async def test_run_resource_recommendation_merges_raw_stats_into_result():
    task = _task()
    db = AsyncMock()
    db.get = AsyncMock(return_value=task)

    stats = [_candidate(1, full_name="Alice", current_workload_hours=12.0, on_leave=True)]
    ai_result = {
        "summary": "Alice fits",
        "recommendations": [{"user_id": 1, "rank": 1, "reason": "only option", "fit_score": 42}],
    }

    with (
        patch(
            "app.services.ai.resource_recommender._candidate_stats",
            new=AsyncMock(return_value=stats),
        ),
        patch(
            "app.services.ai.resource_recommender.generate_resource_recommendation",
            new=AsyncMock(return_value=ai_result),
        ),
    ):
        result = await run_resource_recommendation(db, 1)

    assert result["summary"] == "Alice fits"
    merged = result["recommendations"][0]
    assert merged["full_name"] == "Alice"
    assert merged["current_workload_hours"] == 12.0
    assert merged["on_leave"] is True
    assert merged["fit_score"] == 42
    assert merged["rank"] == 1
