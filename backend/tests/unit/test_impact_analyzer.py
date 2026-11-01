"""SOP-AI-002: run_impact_analysis phải kẹp/loại bỏ output AI không hợp lệ trước khi
lưu ImpactReport — không bao giờ để dữ liệu bịa (risk_level lạ, risk_score ngoài
khoảng, id task không tồn tại) làm hỏng bản ghi hoặc văng lỗi không kiểm soát.
"""
from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock, patch

import pytest

import app.db.base  # noqa: F401 - đăng ký các quan hệ SQLAlchemy
from app.models.change_request import ImpactLevel
from app.models.impact_report import RiskLevel
from app.services.ai.impact_analyzer import (
    DEFAULT_RISK_LEVEL,
    RULE_RATIONALE,
    SYSTEM_PROMPT,
    _validate_ai_output,
    derive_impact_level,
    run_impact_analysis,
)


class FakeScalars:
    def __init__(self, items):
        self._items = items

    def all(self):
        return self._items


def change_request(**overrides):
    values = {
        "id": 1,
        "project_id": 10,
        "title": "Add SSO",
        "description": "Add single sign-on to the login flow",
        "reason": "Enterprise customer requirement",
        "impact_description": "Login module changes",
    }
    values.update(overrides)
    return SimpleNamespace(**values)


def project(**overrides):
    values = {"id": 10, "name": "Portal Revamp", "currency": "VND", "start_date": None}
    values.update(overrides)
    return SimpleNamespace(**values)


def task(task_id, name="Task"):
    return SimpleNamespace(
        id=task_id, name=name, estimated_hours=8, start_date=None, due_date=None
    )


def make_db(*, cr, proj, tasks, dependencies=None, existing_report=None):
    dependencies = dependencies or []
    get_mock = AsyncMock(side_effect=[cr, proj])
    scalars_results = [FakeScalars(tasks)]
    if tasks:
        scalars_results.append(FakeScalars(dependencies))
    scalars_mock = AsyncMock(side_effect=scalars_results)
    scalar_mock = AsyncMock(return_value=existing_report)
    return SimpleNamespace(
        get=get_mock,
        scalars=scalars_mock,
        scalar=scalar_mock,
        add=Mock(),
        flush=AsyncMock(),
    )


def patched_ai(return_value):
    return patch(
        "app.services.ai.impact_analyzer.generate_impact_analysis",
        AsyncMock(return_value=return_value),
    )


@pytest.mark.asyncio
async def test_well_formed_ai_response_is_persisted_into_impact_report():
    tasks = [task(100, "Design"), task(101, "Build")]
    db = make_db(cr=change_request(), proj=project(), tasks=tasks)
    ai_output = {
        "risk_level": "HIGH",
        "risk_score": 7.5,
        "schedule_impact_days": 3,
        "cost_impact": 15000.0,
        "affected_task_ids": [100],
        "summary": "Significant rework needed in the login module.",
    }

    with patched_ai(ai_output):
        report = await run_impact_analysis(db, 1)

    db.add.assert_called_once_with(report)
    db.flush.assert_awaited_once()
    assert report.change_request_id == 1
    assert report.risk_level == RiskLevel.HIGH
    assert report.risk_score == 7.5
    assert report.schedule_impact_days == 3
    assert report.cost_impact == 15000.0
    assert report.affected_tasks_json == [100]
    assert report.summary == "Significant rework needed in the login module."
    assert report.ai_analysis_json == ai_output


@pytest.mark.asyncio
async def test_out_of_range_risk_score_is_clamped_into_0_to_10():
    tasks = [task(100)]
    db_high = make_db(cr=change_request(), proj=project(), tasks=tasks)
    with patched_ai({"risk_level": "LOW", "risk_score": 999, "affected_task_ids": []}):
        report_high = await run_impact_analysis(db_high, 1)
    assert report_high.risk_score == 10.0

    db_low = make_db(cr=change_request(), proj=project(), tasks=tasks)
    with patched_ai({"risk_level": "LOW", "risk_score": -42, "affected_task_ids": []}):
        report_low = await run_impact_analysis(db_low, 1)
    assert report_low.risk_score == 0.0


@pytest.mark.asyncio
async def test_invalid_risk_level_falls_back_to_default_instead_of_raising():
    tasks = [task(100)]
    db = make_db(cr=change_request(), proj=project(), tasks=tasks)
    with patched_ai({"risk_level": "SUPER_DUPER_BAD", "risk_score": 5, "affected_task_ids": []}):
        report = await run_impact_analysis(db, 1)

    assert report.risk_level == DEFAULT_RISK_LEVEL


@pytest.mark.asyncio
async def test_affected_task_ids_outside_project_are_filtered_out():
    tasks = [task(100, "Design"), task(101, "Build")]
    db = make_db(cr=change_request(), proj=project(), tasks=tasks)
    with patched_ai(
        {
            "risk_level": "MEDIUM",
            "risk_score": 4,
            "affected_task_ids": [100, 999, "101", "not-an-id"],
        }
    ):
        report = await run_impact_analysis(db, 1)

    assert report.affected_tasks_json == [100, 101]


@pytest.mark.asyncio
async def test_existing_impact_report_is_updated_in_place_not_duplicated():
    tasks = [task(100)]
    existing = SimpleNamespace(
        id=5,
        change_request_id=1,
        risk_level=RiskLevel.LOW,
        risk_score=1.0,
        schedule_impact_days=0,
        cost_impact=0.0,
        affected_tasks_json=None,
        ai_analysis_json=None,
        summary=None,
        # Báo cáo cũ do PM nhập thủ công: chạy lại AI phải ghi đè và tăng revision.
        revision=1,
        source="MANUAL",
    )
    db = make_db(cr=change_request(), proj=project(), tasks=tasks, existing_report=existing)
    with patched_ai({"risk_level": "CRITICAL", "risk_score": 9, "affected_task_ids": [100]}):
        report = await run_impact_analysis(db, 1)

    assert report is existing
    assert report.risk_level == RiskLevel.CRITICAL
    assert report.revision == 2 and report.source == "AI"
    # AI không trả mức gợi ý: dùng quy tắc dự phòng (CRITICAL => MAJOR).
    assert report.suggested_impact_level == "MAJOR"
    assert report.impact_level_rationale == RULE_RATIONALE
    db.add.assert_not_called()


# --- KH-CR: AI gợi ý mức tác động (chỉ tư vấn) -----------------------------------------


def _derive(**overrides):
    values = {
        "risk_level": RiskLevel.LOW, "schedule_impact_days": 0, "cost_impact": 0.0,
        "affected_task_ids": [], "critical_task_ids": set(), "project_duration_days": 200.0,
        "budget": 1_000_000.0,
    }
    values.update(overrides)
    return derive_impact_level(**values)


@pytest.mark.parametrize(
    ("overrides", "expected"),
    [
        ({}, ImpactLevel.MINOR),
        ({"schedule_impact_days": 2}, ImpactLevel.MINOR),
        ({"schedule_impact_days": 3}, ImpactLevel.MODERATE),
        ({"schedule_impact_days": 9}, ImpactLevel.MODERATE),
        ({"schedule_impact_days": 10}, ImpactLevel.MAJOR),
        ({"schedule_impact_days": -10}, ImpactLevel.MAJOR),  # rút ngắn lớn cũng là thay đổi lớn
        # 10% thời lượng dự án: 5 ngày trên dự án 50 ngày.
        ({"schedule_impact_days": 5, "project_duration_days": 50.0}, ImpactLevel.MAJOR),
        ({"schedule_impact_days": 4, "project_duration_days": 50.0}, ImpactLevel.MODERATE),
        ({"cost_impact": 20_000.0}, ImpactLevel.MINOR),  # đúng 2% budget
        ({"cost_impact": 20_001.0}, ImpactLevel.MODERATE),
        ({"cost_impact": 100_000.0}, ImpactLevel.MAJOR),  # 10% budget
        # Không có budget: mọi chi phí khác 0 đều không còn là MINOR, nhưng không tự thành MAJOR.
        ({"budget": None, "cost_impact": 1.0}, ImpactLevel.MODERATE),
        ({"budget": None, "cost_impact": 0.0}, ImpactLevel.MINOR),
        ({"affected_task_ids": [7], "critical_task_ids": {7}}, ImpactLevel.MODERATE),
        ({"risk_level": RiskLevel.MEDIUM}, ImpactLevel.MODERATE),
        ({"risk_level": RiskLevel.CRITICAL}, ImpactLevel.MAJOR),
        ({"project_duration_days": None, "schedule_impact_days": 1}, ImpactLevel.MINOR),
    ],
)
def test_derive_impact_level_thresholds(overrides, expected):
    assert _derive(**overrides) == expected


def test_valid_ai_suggestion_is_kept_with_its_rationale():
    out = _validate_ai_output(
        {"risk_level": "LOW", "suggested_impact_level": " major ", "impact_level_rationale": " Changes the milestone. "},
        valid_task_ids=set(),
    )
    assert out["suggested_impact_level"] == "MAJOR"
    assert out["impact_level_rationale"] == "Changes the milestone."


@pytest.mark.parametrize("bad", [None, "", "HUGE", 3, ["MAJOR"]])
def test_invalid_ai_suggestion_falls_back_to_the_rule(bad):
    out = _validate_ai_output(
        {"risk_level": "HIGH", "schedule_impact_days": 12, "suggested_impact_level": bad,
         "impact_level_rationale": "ignored"},
        valid_task_ids=set(),
    )
    assert out["suggested_impact_level"] == "MAJOR"
    assert out["impact_level_rationale"] == RULE_RATIONALE


def test_prompt_states_the_suggestion_is_advisory():
    assert "suggested_impact_level" in SYSTEM_PROMPT
    assert "advisory only" in SYSTEM_PROMPT


@pytest.mark.asyncio
async def test_new_report_records_suggestion_but_never_touches_the_cr_level():
    cr = change_request(impact_level="MINOR")
    db = make_db(cr=cr, proj=project(budget=None), tasks=[task(100)])
    with patched_ai({"risk_level": "HIGH", "schedule_impact_days": 15, "suggested_impact_level": "MAJOR"}):
        report = await run_impact_analysis(db, 1)
    assert report.revision == 1 and report.source == "AI"
    assert report.suggested_impact_level == "MAJOR"
    # Gợi ý của AI không bao giờ tự áp vào CR: mức do PM chốt.
    assert cr.impact_level == "MINOR"
