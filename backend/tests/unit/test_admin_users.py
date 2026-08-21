from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock

import pytest
from fastapi import HTTPException

import app.db.base  # noqa: F401 - register SQLAlchemy relationships
from app.models.user import User
from app.schemas.admin import AdminUserCreate, AdminUserUpdate
from app.services.admin_service import AdminUserService


def build_db(*, scalar_side_effect=None):
    return SimpleNamespace(
        add=Mock(),
        flush=AsyncMock(),
        refresh=AsyncMock(),
        delete=AsyncMock(),
        scalar=AsyncMock(side_effect=scalar_side_effect or []),
        execute=AsyncMock(),
    )


def build_user(**overrides):
    values = {
        "id": 1,
        "email": "person@example.com",
        "username": "person",
        "full_name": "Person One",
        "is_active": True,
        "is_superuser": False,
        "roles": [],
    }
    values.update(overrides)
    return SimpleNamespace(**values)


@pytest.mark.asyncio
async def test_create_user_success():
    db = build_db(scalar_side_effect=[None, None])  # email free, username free
    service = AdminUserService(db)
    actor = build_user(id=1, is_superuser=True)

    data = AdminUserCreate(
        email="new@example.com",
        username="newuser",
        full_name="New User",
        password="Passw0rd!",
        role_ids=[],
        is_active=True,
    )
    user = await service.create_user(data, actor)

    assert isinstance(user, User)
    assert user.email == "new@example.com"
    db.flush.assert_awaited_once()
    # first add() call is the new User, second is the AuditLog row
    assert db.add.call_count == 2
    audit_call = db.add.call_args_list[1].args[0]
    assert audit_call.action == "CREATE"
    assert audit_call.entity_type == "User"


@pytest.mark.asyncio
async def test_create_user_duplicate_email_conflicts():
    db = build_db(scalar_side_effect=[1])  # email already exists
    service = AdminUserService(db)
    actor = build_user(id=1, is_superuser=True)

    data = AdminUserCreate(
        email="dup@example.com",
        username="dupuser",
        full_name="Dup User",
        password="Passw0rd!",
    )
    with pytest.raises(HTTPException) as error:
        await service.create_user(data, actor)
    assert error.value.status_code == 409


@pytest.mark.asyncio
async def test_update_user_blocks_self_deactivation():
    admin = build_user(id=1, roles=[SimpleNamespace(name="Admin")])
    db = build_db(scalar_side_effect=[admin])  # get_user lookup
    service = AdminUserService(db)

    with pytest.raises(HTTPException) as error:
        await service.update_user(admin.id, AdminUserUpdate(is_active=False), actor=admin)
    assert error.value.status_code == 400
    assert "own account" in error.value.detail


@pytest.mark.asyncio
async def test_update_user_blocks_removing_last_admin_role():
    target = build_user(id=2, roles=[SimpleNamespace(name="Admin")])
    actor = build_user(id=1, is_superuser=True)
    # sequence: get_user -> target; _count_active_admins -> admin_role_id, then count=0
    db = build_db(scalar_side_effect=[target, 99, 0])
    service = AdminUserService(db)

    with pytest.raises(HTTPException) as error:
        await service.update_user(target.id, AdminUserUpdate(role_ids=[]), actor=actor)
    assert error.value.status_code == 400
    assert "last remaining admin" in error.value.detail


@pytest.mark.asyncio
async def test_update_user_allows_removing_admin_when_other_admins_remain():
    target = build_user(id=2, roles=[SimpleNamespace(name="Admin")])
    actor = build_user(id=1, is_superuser=True)
    # sequence: get_user -> target; _count_active_admins -> admin_role_id, then count=2
    db = build_db(scalar_side_effect=[target, 99, 2])
    service = AdminUserService(db)

    updated = await service.update_user(target.id, AdminUserUpdate(role_ids=[]), actor=actor)
    assert updated.roles == []
    db.flush.assert_awaited_once()


@pytest.mark.asyncio
async def test_deactivate_user_blocks_self():
    admin = build_user(id=3)
    db = build_db(scalar_side_effect=[admin])
    service = AdminUserService(db)

    with pytest.raises(HTTPException) as error:
        await service.deactivate_user(admin.id, actor=admin)
    assert error.value.status_code == 400


@pytest.mark.asyncio
async def test_deactivate_user_blocks_last_active_admin():
    target = build_user(id=4, roles=[SimpleNamespace(name="Admin")])
    actor = build_user(id=1, is_superuser=True)
    # get_user -> target; _count_active_admins -> admin_role_id, then count=0
    db = build_db(scalar_side_effect=[target, 99, 0])
    service = AdminUserService(db)

    with pytest.raises(HTTPException) as error:
        await service.deactivate_user(target.id, actor=actor)
    assert error.value.status_code == 400
    assert "last remaining admin" in error.value.detail


@pytest.mark.asyncio
async def test_deactivate_user_succeeds_when_other_admins_remain():
    target = build_user(id=5, roles=[SimpleNamespace(name="Member")])
    actor = build_user(id=1, is_superuser=True)
    db = build_db(scalar_side_effect=[target])
    service = AdminUserService(db)

    updated = await service.deactivate_user(target.id, actor=actor)
    assert updated.is_active is False
    audit_call = db.add.call_args_list[0].args[0]
    assert audit_call.action == "DEACTIVATE"
