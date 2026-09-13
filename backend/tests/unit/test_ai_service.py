"""SOP-AI-001: AIService.get_job phải trả project_id để frontend biết điều
hướng người dùng tới project vừa được AI tạo ra sau khi job COMPLETED.
"""
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest

import app.db.base  # noqa: F401 - đăng ký các quan hệ SQLAlchemy
from app.core.exceptions import ForbiddenException, NotFoundException
from app.models.ai_request import AIRequestStatus
from app.services.ai_service import AIService


def ai_request(**overrides):
    values = {
        "id": 7,
        "user_id": 1,
        "status": AIRequestStatus.COMPLETED,
        "error_message": None,
        "project_id": 42,
    }
    values.update(overrides)
    return SimpleNamespace(**values)


def user(user_id=1, *, is_superuser=False, roles=()):
    return SimpleNamespace(id=user_id, is_superuser=is_superuser, roles=list(roles))


def db(*, get_result, scalar_result=None):
    return SimpleNamespace(get=AsyncMock(return_value=get_result), scalar=AsyncMock(return_value=scalar_result))


@pytest.mark.asyncio
async def test_completed_job_returns_project_id_and_output():
    output = SimpleNamespace(output_json={"name": "AI Plan"})
    service = AIService(db(get_result=ai_request(), scalar_result=output))

    response = await service.get_job(7, user())

    assert response.project_id == 42
    assert response.status == "COMPLETED"
    assert response.result == {"name": "AI Plan"}


@pytest.mark.asyncio
async def test_pending_job_has_no_project_id_yet():
    service = AIService(db(get_result=ai_request(status=AIRequestStatus.PENDING, project_id=None)))

    response = await service.get_job(7, user())

    assert response.project_id is None
    assert response.result is None


@pytest.mark.asyncio
async def test_missing_job_raises_not_found():
    service = AIService(db(get_result=None))

    with pytest.raises(NotFoundException):
        await service.get_job(7, user())


@pytest.mark.asyncio
async def test_other_users_job_is_forbidden_unless_admin():
    service = AIService(db(get_result=ai_request(user_id=1)))

    with pytest.raises(ForbiddenException):
        await service.get_job(7, user(user_id=2))


@pytest.mark.asyncio
async def test_admin_can_view_another_users_job():
    output = SimpleNamespace(output_json={"name": "AI Plan"})
    service = AIService(db(get_result=ai_request(user_id=1), scalar_result=output))

    response = await service.get_job(7, user(user_id=2, roles=[SimpleNamespace(name="Admin")]))

    assert response.project_id == 42
