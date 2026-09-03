"""Xoay vòng refresh token, phát hiện tái sử dụng, và thu hồi khi logout (Phase C1).

Bản thân store dựa trên Redis được patch bỏ ở đây: các test này cố định logic
quyết định trong AuthService, không phải phần lưu trữ. `revoke`/`is_revoked` được patch
tại nơi chúng được *sử dụng* (app.services.auth_service), không phải nơi chúng được định nghĩa.
"""
from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock, patch

import pytest
from fastapi import HTTPException

import app.db.base  # noqa: F401 - đăng ký các quan hệ SQLAlchemy
from app.core.security import create_access_token, create_refresh_token
from app.services.auth_service import AuthService


def build_db():
    return SimpleNamespace(flush=AsyncMock(), refresh=AsyncMock(), commit=AsyncMock(), add=Mock())


def build_service(user):
    service = AuthService(build_db())
    service.users = SimpleNamespace(get_by_id=AsyncMock(return_value=user))
    return service


def build_user(**overrides):
    values = {"id": 7, "is_active": True, "auth_version": 0}
    values.update(overrides)
    return SimpleNamespace(**values)


@pytest.mark.asyncio
async def test_refresh_rotates_the_presented_token_out():
    user = build_user()
    service = build_service(user)
    token = create_refresh_token({"sub": "7", "ver": 0})

    with (
        patch("app.services.auth_service.is_revoked", AsyncMock(return_value=False)),
        patch("app.services.auth_service.revoke", AsyncMock(return_value=True)) as revoked,
    ):
        tokens = await service.refresh(token)

    assert tokens.access_token and tokens.refresh_token
    assert tokens.refresh_token != token, "a new refresh token must be issued"
    revoked.assert_awaited_once()
    assert revoked.await_args.args[0], "the old token's jti must be revoked"


@pytest.mark.asyncio
async def test_replaying_a_rotated_refresh_token_revokes_every_session():
    """Hai bên cùng giữ một token nghĩa là nó đã bị lộ — hủy tất cả session, không chỉ session này."""
    user = build_user(auth_version=4)
    service = build_service(user)
    token = create_refresh_token({"sub": "7", "ver": 4})

    with (
        patch("app.services.auth_service.is_revoked", AsyncMock(return_value=True)),
        patch("app.services.auth_service.revoke", AsyncMock(return_value=True)),
    ):
        with pytest.raises(HTTPException) as error:
            await service.refresh(token)

    assert error.value.status_code == 401
    assert user.auth_version == 5, "auth_version must be bumped to invalidate all tokens"
    # Trạng thái đã tăng phải tồn tại qua việc rollback-khi-có-exception của get_db().
    service.db.commit.assert_awaited()
    assert service.db.add.call_args.args[0].action == "REFRESH_TOKEN_REUSED"


@pytest.mark.asyncio
async def test_logout_revokes_the_refresh_token():
    service = build_service(build_user())
    token = create_refresh_token({"sub": "7", "ver": 0})

    with patch("app.services.auth_service.revoke", AsyncMock(return_value=True)) as revoked:
        await service.logout(token)

    revoked.assert_awaited_once()
    assert service.db.add.call_args.args[0].action == "LOGOUT"


@pytest.mark.asyncio
async def test_logout_without_a_token_is_a_no_op():
    service = build_service(build_user())
    with patch("app.services.auth_service.revoke", AsyncMock()) as revoked:
        await service.logout(None)
    revoked.assert_not_awaited()


@pytest.mark.asyncio
async def test_logout_ignores_a_token_of_the_wrong_type():
    """Một access token gửi tới /logout không được coi là refresh token."""
    service = build_service(build_user())
    access = create_access_token({"sub": "7", "ver": 0})

    with patch("app.services.auth_service.revoke", AsyncMock()) as revoked:
        await service.logout(access)

    revoked.assert_not_awaited()
