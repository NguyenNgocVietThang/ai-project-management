from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock

import pytest
from fastapi import HTTPException

import app.db.base  # noqa: F401 - đăng ký các quan hệ SQLAlchemy
from app.schemas.admin import RoleCreate, RoleUpdate
from app.services.role_service import RoleService


def build_db(*, scalar_side_effect=None):
    return SimpleNamespace(
        add=Mock(),
        flush=AsyncMock(),
        refresh=AsyncMock(),
        delete=AsyncMock(),
        scalar=AsyncMock(side_effect=scalar_side_effect or []),
        execute=AsyncMock(),
    )


def build_role(**overrides):
    values = {"id": 1, "name": "Custom", "description": None, "permissions": []}
    values.update(overrides)
    return SimpleNamespace(**values)


def build_actor():
    return SimpleNamespace(id=1, email="admin@example.com")


@pytest.mark.asyncio
async def test_create_role_rejects_duplicate_name():
    db = build_db(scalar_side_effect=[1])  # tên đã tồn tại
    service = RoleService(db)

    with pytest.raises(HTTPException) as error:
        await service.create_role(RoleCreate(name="PM", permission_ids=[]), build_actor())
    assert error.value.status_code == 409


@pytest.mark.asyncio
async def test_update_role_blocks_renaming_admin_role():
    role = build_role(id=1, name="Admin")
    db = build_db(scalar_side_effect=[role])  # tra cứu role
    service = RoleService(db)

    with pytest.raises(HTTPException) as error:
        await service.update_role(1, RoleUpdate(name="SuperAdmin"), build_actor())
    assert error.value.status_code == 403


@pytest.mark.asyncio
async def test_update_role_allows_renaming_custom_role():
    role = build_role(id=2, name="Custom")
    # tra cứu role, rồi kiểm tra tính duy nhất -> None (tên trống)
    db = build_db(scalar_side_effect=[role, None])
    service = RoleService(db)

    updated = await service.update_role(2, RoleUpdate(name="Renamed"), build_actor())
    assert updated.name == "Renamed"
    db.flush.assert_awaited_once()


@pytest.mark.asyncio
async def test_delete_role_blocks_deleting_admin_role():
    role = build_role(id=1, name="Admin")
    db = build_db(scalar_side_effect=[role])
    service = RoleService(db)

    with pytest.raises(HTTPException) as error:
        await service.delete_role(1, build_actor())
    assert error.value.status_code == 403
    db.delete.assert_not_awaited()


@pytest.mark.asyncio
async def test_delete_role_blocks_when_users_still_assigned():
    role = build_role(id=2, name="Custom")
    db = build_db(scalar_side_effect=[role, 3])  # tra cứu role, rồi user_count=3
    service = RoleService(db)

    with pytest.raises(HTTPException) as error:
        await service.delete_role(2, build_actor())
    assert error.value.status_code == 409
    assert "3 user" in error.value.detail
    db.delete.assert_not_awaited()


@pytest.mark.asyncio
async def test_delete_role_succeeds_when_unused():
    role = build_role(id=3, name="Unused")
    db = build_db(scalar_side_effect=[role, 0])
    service = RoleService(db)

    await service.delete_role(3, build_actor())
    db.delete.assert_awaited_once_with(role)
    db.flush.assert_awaited_once()
    audit_call = db.add.call_args_list[0].args[0]
    assert audit_call.action == "DELETE"
