"""Ba lỗi ở tầng WebSocket, kiểm tra cùng nhau vì chúng nằm chung một đường.

  * JWT trên query string rơi vào access log của mọi proxy ở giữa.
  * `Depends(get_db)` giữ một connection DB suốt vòng đời socket — với
    pool_size 10 + overflow 20, khoảng 30 socket đồng thời là cạn pool và mọi
    request HTTP đứng chờ.
  * Watchdog chỉ xác thực lại token, không xác thực lại tư cách thành viên, nên
    người bị xoá khỏi dự án vẫn nhận tin nhắn cho tới khi tự đóng tab.
"""
import inspect
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

import pytest

import app.db.base  # noqa: F401 - đăng ký các quan hệ SQLAlchemy
from app.api.ws import chat as chat_ws
from app.api.ws import notifications as notifications_ws
from app.api.ws.deps import WSAuthError, authenticate_ws, enforce_connection_validity
from app.core import ws_tickets


class FakeRedis:
    def __init__(self):
        self.values: dict[str, str] = {}

    async def set(self, key, value, ex=None):
        self.values[key] = value

    async def getdel(self, key):
        return self.values.pop(key, None)


@pytest.mark.asyncio
async def test_a_ticket_works_exactly_once():
    redis = FakeRedis()
    with patch("app.core.ws_tickets.get_redis", return_value=redis):
        ticket = await ws_tickets.issue(7, 3)
        assert await ws_tickets.redeem(ticket) == {"user_id": 7, "auth_version": 3}
        assert await ws_tickets.redeem(ticket) is None


@pytest.mark.asyncio
async def test_an_unknown_ticket_is_refused():
    with patch("app.core.ws_tickets.get_redis", return_value=FakeRedis()):
        assert await ws_tickets.redeem("never-issued") is None
        assert await ws_tickets.redeem("") is None


@pytest.mark.asyncio
async def test_the_raw_ticket_is_not_used_as_the_redis_key():
    """Một bản dump key Redis không được trao ra những vé còn dùng được."""
    redis = FakeRedis()
    with patch("app.core.ws_tickets.get_redis", return_value=redis):
        ticket = await ws_tickets.issue(1, 0)
    assert all(ticket not in key for key in redis.values)


@pytest.mark.asyncio
async def test_handshake_fails_closed_when_the_ticket_store_is_unreachable():
    """Không có store thì không có cách nào chứng minh bên gọi là ai."""
    with patch(
        "app.core.ws_tickets.get_redis", side_effect=RuntimeError("redis down")
    ):
        with pytest.raises(WSAuthError):
            await authenticate_ws("any-ticket")


@pytest.mark.asyncio
async def test_a_ticket_issued_before_a_password_change_is_refused():
    redis = FakeRedis()
    user = SimpleNamespace(id=7, auth_version=5, is_active=True)
    with patch("app.core.ws_tickets.get_redis", return_value=redis):
        ticket = await ws_tickets.issue(7, 4)  # phát trước khi auth_version tăng
    with patch("app.core.ws_tickets.get_redis", return_value=redis), patch(
        "app.repositories.user_repository.UserRepository.get_by_id",
        AsyncMock(return_value=user),
    ):
        with pytest.raises(WSAuthError):
            await authenticate_ws(ticket)


@pytest.mark.asyncio
async def test_an_inactive_account_cannot_connect():
    redis = FakeRedis()
    user = SimpleNamespace(id=7, auth_version=0, is_active=False)
    with patch("app.core.ws_tickets.get_redis", return_value=redis):
        ticket = await ws_tickets.issue(7, 0)
    with patch("app.core.ws_tickets.get_redis", return_value=redis), patch(
        "app.repositories.user_repository.UserRepository.get_by_id",
        AsyncMock(return_value=user),
    ):
        with pytest.raises(WSAuthError):
            await authenticate_ws(ticket)


def test_websocket_endpoints_do_not_hold_a_pooled_db_session():
    """`Depends(get_db)` ở đây giữ một connection suốt vòng đời socket."""
    for endpoint in (chat_ws.chat_ws, notifications_ws.notifications_ws):
        parameters = inspect.signature(endpoint).parameters
        assert "db" not in parameters, (
            f"{endpoint.__name__} nhận một session DB dài bằng vòng đời socket; "
            "khoảng 30 kết nối đồng thời sẽ làm cạn pool"
        )


def test_websocket_endpoints_take_a_ticket_not_a_token():
    for endpoint in (chat_ws.chat_ws, notifications_ws.notifications_ws):
        parameters = inspect.signature(endpoint).parameters
        assert "ticket" in parameters
        assert "token" not in parameters, (
            f"{endpoint.__name__} vẫn nhận JWT trên query string"
        )


@pytest.mark.asyncio
async def test_watchdog_closes_the_socket_when_channel_access_is_revoked():
    closed = {}
    websocket = SimpleNamespace(
        close=AsyncMock(side_effect=lambda code: closed.__setitem__("code", code))
    )
    user = SimpleNamespace(id=7, auth_version=0, is_active=True)

    with patch(
        "app.repositories.user_repository.UserRepository.get_by_id",
        AsyncMock(return_value=user),
    ):
        await enforce_connection_validity(
            websocket,
            user_id=7,
            auth_version=0,
            still_allowed=AsyncMock(return_value=False),
            interval=0,
        )

    assert closed["code"] == 4401


@pytest.mark.asyncio
async def test_watchdog_closes_the_socket_when_the_account_is_deactivated():
    closed = {}
    websocket = SimpleNamespace(
        close=AsyncMock(side_effect=lambda code: closed.__setitem__("code", code))
    )
    user = SimpleNamespace(id=7, auth_version=0, is_active=False)

    with patch(
        "app.repositories.user_repository.UserRepository.get_by_id",
        AsyncMock(return_value=user),
    ):
        await enforce_connection_validity(
            websocket, user_id=7, auth_version=0, interval=0
        )

    assert closed["code"] == 4401
