"""SOP-AI-003: schedule_optimizer chỉ đọc/tư vấn — output AI là dữ liệu không tin
cậy nên phải được lọc theo task_id thật, và hàm không bao giờ được ghi đè lịch
trình thật lên các object Task đã nạp.
"""
from datetime import date
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

import pytest

import app.db.base  # noqa: F401 - đăng ký các quan hệ SQLAlchemy
from app.models.task import TaskStatus
from app.services.ai.schedule_optimizer import (
    generate_schedule_optimization,
    run_schedule_optimization,
)


def _tasks_with_cpm():
    return [
        {
            "id": 1,
            "name": "Design",
            "status": "IN_PROGRESS",
            "duration_days": 3.0,
            "early_start": "2026-01-01",
            "early_finish": "2026-01-04",
            "late_start": "2026-01-01",
            "late_finish": "2026-01-04",
            "float_days": 0.0,
            "is_critical": True,
            "assignee_ids": [10],
        },
        {
            "id": 2,
            "name": "Build",
            "status": "TODO",
            "duration_days": 5.0,
            "early_start": "2026-01-04",
            "early_finish": "2026-01-09",
            "late_start": "2026-01-06",
            "late_finish": "2026-01-11",
            "float_days": 2.0,
            "is_critical": False,
            "assignee_ids": [11],
        },
    ]


def _fake_provider(response_json):
    return SimpleNamespace(generate_json=AsyncMock(return_value=response_json))


@pytest.mark.asyncio
async def test_valid_suggestions_referencing_real_task_ids_pass_through():
    project = SimpleNamespace(id=1, name="Website Revamp")
    ai_response = {
        "summary": "Crash the design task to shorten the critical path.",
        "estimated_days_saved": 2,
        "suggestions": [
            {
                "task_id": 1,
                "action": "CRASH",
                "detail": "Add a second designer for 2 days.",
                "estimated_days_saved": 2,
            }
        ],
    }
    provider = _fake_provider(ai_response)

    with patch(
        "app.services.ai.schedule_optimizer.get_ai_provider", AsyncMock(return_value=provider)
    ):
        result = await generate_schedule_optimization(project, _tasks_with_cpm(), [], None)

    assert result["summary"] == ai_response["summary"]
    assert result["estimated_days_saved"] == 2
    assert result["suggestions"] == [
        {
            "task_id": 1,
            "action": "CRASH",
            "detail": "Add a second designer for 2 days.",
            "estimated_days_saved": 2,
        }
    ]


@pytest.mark.asyncio
async def test_suggestion_referencing_unknown_task_id_is_filtered_without_crashing():
    project = SimpleNamespace(id=1, name="Website Revamp")
    ai_response = {
        "summary": "Some suggestions.",
        "estimated_days_saved": 5,
        "suggestions": [
            {
                "task_id": 999,  # không tồn tại trong project -> phải bị loại
                "action": "CRASH",
                "detail": "AI hallucinated this task.",
                "estimated_days_saved": 3,
            },
            {
                "task_id": 2,
                "action": "FAST_TRACK",
                "detail": "Start Build in parallel with the tail end of Design.",
                "estimated_days_saved": 1,
            },
        ],
    }
    provider = _fake_provider(ai_response)

    with patch(
        "app.services.ai.schedule_optimizer.get_ai_provider", AsyncMock(return_value=provider)
    ):
        result = await generate_schedule_optimization(project, _tasks_with_cpm(), [], None)

    task_ids = [s["task_id"] for s in result["suggestions"]]
    assert task_ids == [2]


@pytest.mark.asyncio
async def test_suggestion_with_invalid_action_falls_back_to_other():
    project = SimpleNamespace(id=1, name="Website Revamp")
    ai_response = {
        "summary": "x",
        "estimated_days_saved": 1,
        "suggestions": [
            {
                "task_id": 1,
                "action": "NOT_A_REAL_ACTION",
                "detail": "d",
                "estimated_days_saved": 1,
            }
        ],
    }
    provider = _fake_provider(ai_response)

    with patch(
        "app.services.ai.schedule_optimizer.get_ai_provider", AsyncMock(return_value=provider)
    ):
        result = await generate_schedule_optimization(project, _tasks_with_cpm(), [], None)

    assert result["suggestions"][0]["action"] == "OTHER"


@pytest.mark.asyncio
async def test_non_dict_and_missing_fields_in_ai_response_degrade_gracefully():
    project = SimpleNamespace(id=1, name="Website Revamp")
    ai_response = {
        "suggestions": [
            "not a dict",
            {"task_id": "not-an-int", "action": "CRASH", "detail": "d"},
            {"task_id": 1},  # thiếu action/detail/estimated_days_saved
        ]
    }
    provider = _fake_provider(ai_response)

    with patch(
        "app.services.ai.schedule_optimizer.get_ai_provider", AsyncMock(return_value=provider)
    ):
        result = await generate_schedule_optimization(project, _tasks_with_cpm(), [], None)

    assert result["summary"] == ""
    assert result["estimated_days_saved"] == 0.0
    assert result["suggestions"] == [
        {"task_id": 1, "action": "OTHER", "detail": "", "estimated_days_saved": 0.0}
    ]


def _fake_task(task_id, name, status=TaskStatus.TODO, estimated_hours=8.0):
    return SimpleNamespace(
        id=task_id,
        project_id=1,
        name=name,
        status=status,
        estimated_hours=estimated_hours,
        start_date=None,
        due_date=None,
        # Các cột lịch trình thật trên Task — dùng để chứng minh
        # run_schedule_optimization không bao giờ ghi đè chúng (đây là dịch vụ
        # chỉ đọc/tư vấn, khác với recalculate_project trong scheduling_service.py).
        early_start=None,
        early_finish=None,
        late_start=None,
        late_finish=None,
        float_days=None,
        is_critical=None,
    )


def _db_with(tasks, dependencies=(), assignments=(), leaves=(), project=None):
    scalars_results = [
        SimpleNamespace(all=lambda: list(tasks)),
        SimpleNamespace(all=lambda: list(dependencies)),
        SimpleNamespace(all=lambda: list(assignments)),
        SimpleNamespace(all=lambda: list(leaves)),
    ]
    db = SimpleNamespace(
        get=AsyncMock(return_value=project),
        scalars=AsyncMock(side_effect=scalars_results),
    )
    return db


@pytest.mark.asyncio
async def test_run_schedule_optimization_never_mutates_input_task_schedule_fields():
    project = SimpleNamespace(id=1, name="Website Revamp", start_date=date(2026, 1, 1))
    task1 = _fake_task(1, "Design")
    task2 = _fake_task(2, "Build")
    db = _db_with([task1, task2], project=project)

    fake_result = {
        "summary": "ok",
        "estimated_days_saved": 1.0,
        "suggestions": [
            {"task_id": 1, "action": "CRASH", "detail": "d", "estimated_days_saved": 1.0}
        ],
    }

    with patch(
        "app.services.ai.schedule_optimizer.generate_schedule_optimization",
        AsyncMock(return_value=fake_result),
    ) as mocked_generate:
        result = await run_schedule_optimization(db, project_id=1, constraints=None)

    assert result == fake_result
    mocked_generate.assert_awaited_once()

    # Không thao tác nào bên trong hàm được phép đụng tới các trường lịch trình
    # thật trên object Task đã nạp — chỉ có recalculate_project (một luồng ghi
    # riêng biệt, chạy trước) mới được phép làm việc đó.
    for task in (task1, task2):
        assert task.early_start is None
        assert task.early_finish is None
        assert task.late_start is None
        assert task.late_finish is None
        assert task.float_days is None
        assert task.is_critical is None


@pytest.mark.asyncio
async def test_run_schedule_optimization_passes_real_task_ids_and_assignees_to_generator():
    project = SimpleNamespace(id=1, name="Website Revamp", start_date=date(2026, 1, 1))
    task1 = _fake_task(1, "Design")
    task2 = _fake_task(2, "Build")
    assignment = SimpleNamespace(task_id=1, user_id=10)
    db = _db_with([task1, task2], assignments=[assignment], project=project)

    captured = {}

    async def fake_generate(project_arg, tasks_with_cpm, leaves, constraints):
        captured["tasks_with_cpm"] = tasks_with_cpm
        return {"summary": "", "estimated_days_saved": 0.0, "suggestions": []}

    with patch(
        "app.services.ai.schedule_optimizer.generate_schedule_optimization",
        AsyncMock(side_effect=fake_generate),
    ):
        await run_schedule_optimization(db, project_id=1, constraints=None)

    tasks_with_cpm = captured["tasks_with_cpm"]
    ids = {entry["id"] for entry in tasks_with_cpm}
    assert ids == {1, 2}
    by_id = {entry["id"]: entry for entry in tasks_with_cpm}
    assert by_id[1]["assignee_ids"] == [10]
    assert by_id[2]["assignee_ids"] == []


@pytest.mark.asyncio
async def test_run_schedule_optimization_with_no_project_returns_empty_result():
    db = _db_with([], project=None)

    result = await run_schedule_optimization(db, project_id=999, constraints=None)

    assert result == {"summary": "", "estimated_days_saved": 0.0, "suggestions": []}
