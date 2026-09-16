"""SOP-AI-005: run_risk_analysis phải luôn tạo được một RiskReport hợp lệ, kể cả
khi AI trả về dữ liệu bất thường (điểm ngoài khoảng, risk_level không hợp lệ,
risk_factors/mitigation_suggestions không phải list, hoặc JSON hỏng hoàn toàn).
"""
from datetime import date
from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock, patch

import pytest

import app.db.base  # noqa: F401 - đăng ký các quan hệ SQLAlchemy
from app.models.risk_report import RiskLevel
from app.services.ai.parsing import AIResponseError
from app.services.ai.risk_analyzer import run_risk_analysis


def project(**overrides):
    values = {
        "id": 7,
        "name": "Website Revamp",
        "description": "Mo ta du an",
        "status": "ACTIVE",
        "start_date": date(2026, 1, 1),
        "end_date": date(2026, 12, 31),
        "progress": 40.0,
        "budget": 100_000.0,
        "actual_cost": 60_000.0,
        "currency": "VND",
    }
    values.update(overrides)
    return SimpleNamespace(**values)


def _scalars_result(items):
    return Mock(all=Mock(return_value=items))


def fake_db(*, project_obj):
    """DB giả với danh sách task rỗng — bỏ qua nhánh CPM/workload phức tạp để test
    tập trung vào phần validate/persist output của AI."""
    return SimpleNamespace(
        get=AsyncMock(return_value=project_obj),
        scalars=AsyncMock(return_value=_scalars_result([])),
        execute=AsyncMock(),
        add=Mock(),
        flush=AsyncMock(),
    )


@pytest.mark.asyncio
async def test_well_formed_response_persists_correctly():
    ai_output = {
        "risk_score": 6.4,
        "risk_level": "HIGH",
        "risk_factors": [
            {"factor": "Budget overrun", "severity": "HIGH", "explanation": "60% budget used at 40% progress"}
        ],
        "mitigation_suggestions": ["Re-baseline the budget", "Escalate to sponsor"],
        "summary": "Project is trending over budget relative to progress.",
    }
    db = fake_db(project_obj=project())
    with patch("app.services.ai.risk_analyzer.generate_risk_analysis", AsyncMock(return_value=ai_output)):
        report = await run_risk_analysis(db, 7)

    assert report.project_id == 7
    assert report.risk_score == 6.4
    assert report.risk_level == RiskLevel.HIGH
    assert report.risk_factors_json == ai_output["risk_factors"]
    assert report.mitigation_suggestions_json == ai_output["mitigation_suggestions"]
    assert report.summary == ai_output["summary"]
    db.add.assert_called_once_with(report)
    db.flush.assert_awaited_once()


@pytest.mark.asyncio
async def test_out_of_range_risk_score_is_clamped():
    db_high = fake_db(project_obj=project())
    with patch(
        "app.services.ai.risk_analyzer.generate_risk_analysis",
        AsyncMock(return_value={"risk_score": 42, "risk_level": "CRITICAL"}),
    ):
        report_high = await run_risk_analysis(db_high, 7)
    assert report_high.risk_score == 10.0

    db_low = fake_db(project_obj=project())
    with patch(
        "app.services.ai.risk_analyzer.generate_risk_analysis",
        AsyncMock(return_value={"risk_score": -5, "risk_level": "LOW"}),
    ):
        report_low = await run_risk_analysis(db_low, 7)
    assert report_low.risk_score == 0.0


@pytest.mark.asyncio
async def test_invalid_risk_level_falls_back_to_score_derived_level():
    db = fake_db(project_obj=project())
    with patch(
        "app.services.ai.risk_analyzer.generate_risk_analysis",
        AsyncMock(return_value={"risk_score": 6, "risk_level": "SUPER_DUPER_BAD"}),
    ):
        report = await run_risk_analysis(db, 7)

    # score=6 khong khop bat ky enum RiskLevel nao -> suy ra tu thang diem: HIGH.
    assert report.risk_score == 6.0
    assert report.risk_level == RiskLevel.HIGH


@pytest.mark.asyncio
async def test_non_list_factors_and_suggestions_are_wrapped_not_raised():
    db = fake_db(project_obj=project())
    ai_output = {
        "risk_score": 3,
        "risk_level": "LOW",
        "risk_factors": "Everything looks fine but written as prose",
        "mitigation_suggestions": "Just keep monitoring",
        "summary": None,
    }
    with patch("app.services.ai.risk_analyzer.generate_risk_analysis", AsyncMock(return_value=ai_output)):
        report = await run_risk_analysis(db, 7)

    assert report.risk_factors_json == [ai_output["risk_factors"]]
    assert report.mitigation_suggestions_json == [ai_output["mitigation_suggestions"]]
    assert report.summary is None


@pytest.mark.asyncio
async def test_unusable_ai_output_still_produces_a_safe_report():
    """AIResponseError (JSON hong/rong) khong duoc lam sap ca luot quet ma phai
    roi ve mot RiskReport voi gia tri mac dinh an toan."""
    db = fake_db(project_obj=project())
    with patch(
        "app.services.ai.risk_analyzer.generate_risk_analysis",
        AsyncMock(side_effect=AIResponseError("Model did not return valid JSON")),
    ):
        report = await run_risk_analysis(db, 7)

    assert report.risk_score == 0.0
    assert report.risk_level == RiskLevel.LOW
    assert report.risk_factors_json == []
    assert report.mitigation_suggestions_json == []


@pytest.mark.asyncio
async def test_missing_project_raises_value_error():
    db = fake_db(project_obj=None)
    with pytest.raises(ValueError):
        await run_risk_analysis(db, 999)
