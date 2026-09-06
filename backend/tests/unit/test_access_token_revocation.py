"""Đăng xuất phải chấm dứt phiên ngay, không phải sau khi access token hết hạn.

`jti` vẫn luôn được sinh cho access token đúng vì mục đích thu hồi riêng lẻ,
nhưng danh sách thu hồi chỉ được tra ở /auth/refresh. Hệ quả: sau khi nạn nhân
bấm đăng xuất, một access token bị đánh cắp vẫn dùng được thêm 30 phút — đúng
khoảng thời gian mà việc đăng xuất lẽ ra phải đóng lại.
"""
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

import pytest

import app.db.base  # noqa: F401 - đăng ký các quan hệ SQLAlchemy
from app.core.dependencies import _user_from_token
from app.core.security import create_access_token, create_refresh_token, decode_token
from app.services.auth_service import AuthService


@pytest.mark.asyncio
async def test_request_with_a_revoked_access_token_is_rejected():
    token = create_access_token({"sub": "5", "ver": 0})
    user = SimpleNamespace(id=5, auth_version=0, is_active=True)

    with patch("app.core.dependencies.is_revoked", AsyncMock(return_value=True)), patch(
        "app.repositories.user_repository.UserRepository.get_by_id",
        AsyncMock(return_value=user),
    ):
        with pytest.raises(Exception) as error:
            await _user_from_token(token, AsyncMock())

    assert error.value.status_code == 401


@pytest.mark.asyncio
async def test_a_token_that_was_never_revoked_still_works():
    token = create_access_token({"sub": "5", "ver": 0})
    user = SimpleNamespace(id=5, auth_version=0, is_active=True)

    with patch("app.core.dependencies.is_revoked", AsyncMock(return_value=False)), patch(
        "app.repositories.user_repository.UserRepository.get_by_id",
        AsyncMock(return_value=user),
    ):
        assert await _user_from_token(token, AsyncMock()) is user


@pytest.mark.asyncio
async def test_logout_revokes_both_tokens():
    access = create_access_token({"sub": "5", "ver": 0})
    refresh = create_refresh_token({"sub": "5", "ver": 0})
    service = AuthService(AsyncMock())

    with patch("app.services.auth_service.revoke", AsyncMock(return_value=True)) as revoke:
        await service.logout(refresh, access)

    revoked = {call.args[0] for call in revoke.await_args_list}
    assert decode_token(access)["jti"] in revoked, "access token phải bị thu hồi"
    assert decode_token(refresh)["jti"] in revoked, "refresh token phải bị thu hồi"


@pytest.mark.asyncio
async def test_logout_without_an_access_token_still_revokes_the_refresh_token():
    """Client cũ không gửi header Authorization vẫn phải đăng xuất sạch phần làm được."""
    refresh = create_refresh_token({"sub": "5", "ver": 0})
    service = AuthService(AsyncMock())

    with patch("app.services.auth_service.revoke", AsyncMock(return_value=True)) as revoke:
        await service.logout(refresh, None)

    assert revoke.await_count == 1
    assert revoke.await_args.args[0] == decode_token(refresh)["jti"]


@pytest.mark.asyncio
async def test_a_refresh_token_passed_as_an_access_token_is_not_revoked_as_one():
    """Chỉ token đúng loại mới được xử lý — nếu không, nhầm loại sẽ bị bỏ qua âm thầm."""
    refresh = create_refresh_token({"sub": "5", "ver": 0})
    service = AuthService(AsyncMock())

    with patch("app.services.auth_service.revoke", AsyncMock(return_value=True)) as revoke:
        await service.logout(None, refresh)

    revoke.assert_not_awaited()
