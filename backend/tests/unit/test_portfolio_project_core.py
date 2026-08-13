from datetime import date, datetime, timezone
from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock, patch

import pytest
from fastapi import HTTPException
from pydantic import ValidationError

import app.db.base  # noqa: F401 - register SQLAlchemy relationships
from app.models.portfolio import PortfolioStatus
from app.models.project import ProjectMethodology, ProjectStatus
from app.schemas.portfolio import PortfolioCreate, PortfolioUpdate
from app.schemas.project import ProjectCreate, ProjectMemberCreate, ProjectUpdate
from app.services.portfolio_service import PortfolioService
from app.services.project_service import ProjectService

NOW = datetime(2026, 8, 13, tzinfo=timezone.utc)


def user(user_id=1, *, roles=("PM",), is_superuser=False, active=True):
    return SimpleNamespace(
        id=user_id,
        full_name=f"User {user_id}",
        username=f"user_{user_id}",
        email=f"user{user_id}@example.com",
        avatar_url=None,
        roles=[SimpleNamespace(name=name) for name in roles],
        is_superuser=is_superuser,
        is_active=active,
    )


def portfolio(**overrides):
    values = {
        "id": 10,
        "name": "Core Portfolio",
        "description": None,
        "status": PortfolioStatus.PLANNING,
        "start_date": date(2026, 8, 1),
        "end_date": date(2026, 12, 1),
        "budget": 1000.0,
        "currency": "VND",
        "owner_id": 1,
        "deleted_at": None,
        "created_at": NOW,
        "updated_at": NOW,
    }
    values.update(overrides)
    return SimpleNamespace(**values)


def project(**overrides):
    values = {
        "id": 20,
        "name": "Core Project",
        "description": None,
        "status": ProjectStatus.PLANNING,
        "methodology": ProjectMethodology.AGILE,
        "start_date": date(2026, 8, 1),
        "end_date": date(2026, 10, 1),
        "progress": 25.0,
        "budget": 500.0,
        "actual_cost": 100.0,
        "currency": "VND",
        "portfolio_id": 10,
        "pm_id": 1,
        "deleted_at": None,
        "created_at": NOW,
        "updated_at": NOW,
    }
    values.update(overrides)
    return SimpleNamespace(**values)


def db():
    return SimpleNamespace(add=Mock(), flush=AsyncMock(), refresh=AsyncMock())


def test_portfolio_and_project_schema_validation():
    valid = PortfolioCreate(
        name="  Portfolio Alpha  ",
        start_date=date(2026, 8, 1),
        end_date=date(2026, 9, 1),
        budget=0,
    )
    assert valid.name == "Portfolio Alpha"

    with pytest.raises(ValidationError):
        PortfolioCreate(name="ab")
    with pytest.raises(ValidationError):
        PortfolioCreate(
            name="Portfolio Alpha",
            start_date=date(2026, 9, 1),
            end_date=date(2026, 8, 1),
        )
    with pytest.raises(ValidationError):
        ProjectCreate(
            name="Project Alpha",
            start_date=date(2026, 9, 1),
            end_date=date(2026, 8, 1),
        )
    with pytest.raises(ValidationError):
        ProjectCreate(
            name="Project Alpha",
            start_date=date(2026, 8, 1),
            end_date=date(2026, 9, 1),
            methodology="scrum",
        )


@pytest.mark.asyncio
async def test_portfolio_scope_and_soft_delete_cascade():
    service = PortfolioService(db())
    item = portfolio(owner_id=1)
    service.repo = SimpleNamespace(
        get_active=AsyncMock(return_value=item),
        get_visible_with_metrics=AsyncMock(return_value=(item, 2, 50.0)),
        soft_delete=AsyncMock(),
    )

    await service.delete(item.id, user(1))
    service.repo.soft_delete.assert_awaited_once()
    assert service.db.add.call_args.args[0].action == "DELETE"

    outsider = user(9, roles=("Member",))
    with pytest.raises(HTTPException) as error:
        await service.delete(item.id, outsider)
    assert error.value.status_code == 403


@pytest.mark.asyncio
async def test_portfolio_update_checks_dates_against_existing_values():
    service = PortfolioService(db())
    item = portfolio()
    service.repo = SimpleNamespace(
        get_active=AsyncMock(return_value=item),
        get_visible_with_metrics=AsyncMock(return_value=(item, 0, 0.0)),
        update=AsyncMock(),
    )

    with pytest.raises(HTTPException) as error:
        await service.update(
            item.id,
            PortfolioUpdate(start_date=date(2027, 1, 1)),
            user(1),
        )
    assert error.value.status_code == 400
    service.repo.update.assert_not_awaited()


@pytest.mark.asyncio
async def test_non_member_project_access_is_forbidden():
    service = ProjectService(db())
    item = project()
    service.repo = SimpleNamespace(
        get_active=AsyncMock(return_value=item),
        get_visible_summary=AsyncMock(return_value=None),
    )

    with pytest.raises(HTTPException) as error:
        await service._visible_row(item.id, user(9, roles=("Member",)))
    assert error.value.status_code == 403


def test_project_pm_has_full_project_capabilities():
    capabilities = ProjectService._capabilities(
        project(pm_id=1),
        user(8, roles=("Member",)),
        "PM",
    )
    assert capabilities.can_update
    assert capabilities.can_delete
    assert capabilities.can_manage_members


@pytest.mark.asyncio
async def test_project_update_rejects_invalid_partial_date_range():
    service = ProjectService(db())
    item = project()
    service._require_manager = AsyncMock(return_value=(item, "Portfolio", 1, "PM"))
    service.repo.update = AsyncMock()
    service.repo.get_visible_summary = AsyncMock()

    with pytest.raises(HTTPException) as error:
        await service.update(
            item.id,
            ProjectUpdate(start_date=date(2027, 1, 1)),
            user(1),
        )
    assert error.value.status_code == 400
    service.repo.update.assert_not_awaited()


@pytest.mark.asyncio
async def test_add_member_validates_role_and_survives_email_enqueue_failure():
    service = ProjectService(db())
    item = project()
    inviter = user(1)
    member = user(2, roles=("Member",))
    role = SimpleNamespace(id=4, name="Member", description="Project member")
    service._require_manager = AsyncMock(return_value=(item, "Portfolio", 1, "PM"))
    service.users = SimpleNamespace(get_by_id=AsyncMock(return_value=member))
    service.repo = SimpleNamespace(
        get_role=AsyncMock(return_value=role),
        get_member_role=AsyncMock(return_value=None),
        add_member=AsyncMock(),
        get_member=AsyncMock(return_value=(member, role, NOW)),
    )

    with patch(
        "app.services.project_service.send_project_invitation_email_task.apply_async",
        side_effect=RuntimeError("broker unavailable"),
    ):
        result = await service.add_member(
            item.id,
            ProjectMemberCreate(user_id=member.id, role_id=role.id),
            inviter,
        )

    assert result.user.id == member.id
    assert result.role.name == "Member"
    service.repo.add_member.assert_awaited_once_with(item.id, member.id, role.id)
    assert service.db.add.call_args.args[0].action == "ADD_MEMBER"


@pytest.mark.asyncio
async def test_add_member_rejects_duplicate_and_non_project_role():
    service = ProjectService(db())
    item = project()
    member = user(2)
    service._require_manager = AsyncMock(return_value=(item, None, 1, "PM"))
    service.users = SimpleNamespace(get_by_id=AsyncMock(return_value=member))
    service.repo = SimpleNamespace(
        get_role=AsyncMock(return_value=SimpleNamespace(id=1, name="Admin")),
    )

    with pytest.raises(HTTPException) as invalid_role:
        await service.add_member(
            item.id,
            ProjectMemberCreate(user_id=member.id, role_id=1),
            user(1),
        )
    assert invalid_role.value.status_code == 400

    service.repo.get_role.return_value = SimpleNamespace(id=4, name="Member")
    service.repo.get_member_role = AsyncMock(return_value=SimpleNamespace(name="Member"))
    with pytest.raises(HTTPException) as duplicate:
        await service.add_member(
            item.id,
            ProjectMemberCreate(user_id=member.id, role_id=4),
            user(1),
        )
    assert duplicate.value.status_code == 409


@pytest.mark.asyncio
async def test_project_owner_cannot_be_removed():
    service = ProjectService(db())
    item = project(pm_id=1)
    service._require_manager = AsyncMock(return_value=(item, None, 1, "PM"))

    with pytest.raises(HTTPException) as error:
        await service.remove_member(item.id, item.pm_id, user(2))
    assert error.value.status_code == 400
    assert "owner" in error.value.detail.lower()
