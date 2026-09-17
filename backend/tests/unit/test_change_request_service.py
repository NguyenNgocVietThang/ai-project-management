"""Change Request CRUD tối giản — nền cho AI Impact Analysis (SOP-AI-002).

Không có workflow duyệt nhiều bước ở đây; chỉ create/list/get/submit. Xem docs/archive/phase3-ai-features/plan.md.
"""
from datetime import UTC, datetime
from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock, patch

import pytest

import app.db.base  # noqa: F401 - đăng ký các quan hệ SQLAlchemy
from app.core.exceptions import ConflictException, ForbiddenException, NotFoundException
from app.models.change_request import ChangeRequest, CRStatus
from app.schemas.change_request import ChangeRequestCreate
from app.services.change_request_service import ChangeRequestService
from app.services.phase2_common import ProjectContext


def _simulate_db_defaults(item):
    # Mo phong RETURNING cua asyncpg: mot INSERT that se dien id/created_at khi
    # flush; fake db o day khong cham DB nen phai tu gan.
    if getattr(item, "id", None) is None:
        item.id = 999
    if getattr(item, "created_at", None) is None:
        item.created_at = datetime.now(UTC)


def fake_db(**overrides):
    values = {
        "add": Mock(side_effect=_simulate_db_defaults),
        "flush": AsyncMock(),
        "get": AsyncMock(return_value=None),
        "scalars": AsyncMock(),
    }
    values.update(overrides)
    return SimpleNamespace(**values)


def user(user_id=1):
    return SimpleNamespace(id=user_id)


def project_context(role="PM", is_admin=False):
    return ProjectContext(project=SimpleNamespace(id=7), role=role, is_admin=is_admin)


@pytest.mark.asyncio
async def test_pm_can_create_change_request():
    service = ChangeRequestService(fake_db())
    with patch(
        "app.services.change_request_service.get_project_context",
        AsyncMock(return_value=project_context(role="PM")),
    ):
        response = await service.create(
            7, ChangeRequestCreate(title="Add SSO", description="Add SSO login"), user()
        )
    assert response.status == "DRAFT"
    assert response.title == "Add SSO"


@pytest.mark.asyncio
async def test_member_cannot_create_change_request():
    service = ChangeRequestService(fake_db())
    with patch(
        "app.services.change_request_service.get_project_context",
        AsyncMock(return_value=project_context(role="Member")),
    ):
        with pytest.raises(ForbiddenException):
            await service.create(
                7, ChangeRequestCreate(title="Add SSO", description="Add SSO login"), user()
            )


@pytest.mark.asyncio
async def test_submit_moves_draft_to_submitted():
    item = ChangeRequest(
        id=3, project_id=7, requested_by_id=1, title="X", description="Y", status=CRStatus.DRAFT,
        created_at=datetime.now(UTC),
    )
    service = ChangeRequestService(fake_db(get=AsyncMock(return_value=item)))
    with patch(
        "app.services.change_request_service.get_project_context",
        AsyncMock(return_value=project_context(role="PM")),
    ):
        response = await service.submit(3, user())
    assert response.status == "SUBMITTED"


@pytest.mark.asyncio
async def test_submit_rejects_non_draft():
    item = ChangeRequest(
        id=3, project_id=7, requested_by_id=1, title="X", description="Y",
        status=CRStatus.SUBMITTED,
    )
    service = ChangeRequestService(fake_db(get=AsyncMock(return_value=item)))
    with patch(
        "app.services.change_request_service.get_project_context",
        AsyncMock(return_value=project_context(role="PM")),
    ):
        with pytest.raises(ConflictException):
            await service.submit(3, user())


@pytest.mark.asyncio
async def test_submit_missing_change_request_raises_not_found():
    service = ChangeRequestService(fake_db(get=AsyncMock(return_value=None)))
    with pytest.raises(NotFoundException):
        await service.submit(999, user())


@pytest.mark.asyncio
async def test_other_member_cannot_submit_someone_elses_change_request():
    item = ChangeRequest(
        id=3, project_id=7, requested_by_id=1, title="X", description="Y", status=CRStatus.DRAFT
    )
    service = ChangeRequestService(fake_db(get=AsyncMock(return_value=item)))
    with patch(
        "app.services.change_request_service.get_project_context",
        AsyncMock(return_value=project_context(role="Member")),
    ):
        with pytest.raises(ForbiddenException):
            await service.submit(3, user(user_id=2))
