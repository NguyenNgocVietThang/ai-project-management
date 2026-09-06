"""Khoá tài khoản khi có quá nhiều lần đăng nhập sai.

Rate limit của slowapi khoá theo IP, nên nó không chặn được kiểu tấn công thực
tế hơn: một botnet thử cùng một tài khoản từ hàng nghìn địa chỉ, mỗi địa chỉ chỉ
vài lần. Nhìn từ phía tài khoản, số lần thử trước đây là không giới hạn.
"""
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

import pytest

import app.db.base  # noqa: F401 - đăng ký các quan hệ SQLAlchemy
from app.core import login_throttle
from app.core.security import hash_password
from app.services.auth_service import AuthService


class FakeRedis:
    """Vừa đủ Redis cho login_throttle, có TTL đơn giản hoá."""

    def __init__(self):
        self.values: dict[str, int] = {}
        self.ttls: dict[str, int] = {}

    async def incr(self, key):
        self.values[key] = self.values.get(key, 0) + 1
        return self.values[key]

    async def expire(self, key, seconds):
        self.ttls[key] = seconds

    async def set(self, key, value, ex=None):
        self.values[key] = value
        self.ttls[key] = ex or 0

    async def ttl(self, key):
        return self.ttls.get(key, -2) if key in self.values else -2

    async def delete(self, *keys):
        for key in keys:
            self.values.pop(key, None)
            self.ttls.pop(key, None)


@pytest.mark.asyncio
async def test_account_locks_after_repeated_failures_regardless_of_source_ip():
    redis = FakeRedis()
    with patch("app.core.login_throttle.get_redis", return_value=redis):
        assert await login_throttle.seconds_until_unlocked("victim@example.com") is None

        for _ in range(login_throttle.FAILURE_THRESHOLD):
            await login_throttle.record_failure("victim@example.com")

        locked_for = await login_throttle.seconds_until_unlocked("victim@example.com")
        assert locked_for and locked_for > 0


@pytest.mark.asyncio
async def test_lockout_backs_off_further_with_each_extra_failure():
    redis = FakeRedis()
    with patch("app.core.login_throttle.get_redis", return_value=redis):
        for _ in range(login_throttle.FAILURE_THRESHOLD):
            await login_throttle.record_failure("victim@example.com")
        first = await login_throttle.seconds_until_unlocked("victim@example.com")

        await login_throttle.record_failure("victim@example.com")
        second = await login_throttle.seconds_until_unlocked("victim@example.com")

    assert second > first, "một cuộc tấn công kéo dài phải bị chờ lâu hơn"


@pytest.mark.asyncio
async def test_successful_sign_in_clears_the_counter():
    redis = FakeRedis()
    with patch("app.core.login_throttle.get_redis", return_value=redis):
        for _ in range(login_throttle.FAILURE_THRESHOLD):
            await login_throttle.record_failure("victim@example.com")
        await login_throttle.clear("victim@example.com")
        assert await login_throttle.seconds_until_unlocked("victim@example.com") is None


@pytest.mark.asyncio
async def test_lockout_survives_a_redis_outage_by_failing_open():
    """Cache gián đoạn không được biến thành sự cố khoá toàn bộ người dùng."""
    broken = SimpleNamespace(
        ttl=AsyncMock(side_effect=RuntimeError("redis down")),
        incr=AsyncMock(side_effect=RuntimeError("redis down")),
    )
    with patch("app.core.login_throttle.get_redis", return_value=broken):
        assert await login_throttle.seconds_until_unlocked("a@b.com") is None
        await login_throttle.record_failure("a@b.com")  # không được ném lỗi


@pytest.mark.asyncio
async def test_authenticate_refuses_while_locked_without_hashing_a_password():
    """Trong lúc bị khoá, mỗi lần thử vẫn tốn một lần bcrypt sẽ biến cơ chế bảo vệ
    thành kênh khuếch đại tải — nên phải chặn trước cả khi tra cứu user."""
    users = SimpleNamespace(get_by_email=AsyncMock())
    service = AuthService(AsyncMock())
    service.users = users

    with patch(
        "app.services.auth_service.seconds_until_unlocked",
        AsyncMock(return_value=42),
    ):
        with pytest.raises(Exception) as error:
            await service.authenticate("victim@example.com", "guess")

    assert error.value.status_code == 401
    users.get_by_email.assert_not_awaited()


@pytest.mark.asyncio
async def test_a_wrong_password_is_counted_against_the_account():
    user = SimpleNamespace(
        id=1,
        email="victim@example.com",
        hashed_password=hash_password("CorrectHorse12"),
        is_active=True,
    )
    db = AsyncMock()
    service = AuthService(db)
    service.users = SimpleNamespace(get_by_email=AsyncMock(return_value=user))

    with patch(
        "app.services.auth_service.seconds_until_unlocked", AsyncMock(return_value=None)
    ), patch(
        "app.services.auth_service.record_login_failure", AsyncMock()
    ) as record:
        with pytest.raises(Exception):
            await service.authenticate("victim@example.com", "wrong-password")

    record.assert_awaited_once_with("victim@example.com")


@pytest.mark.asyncio
async def test_unknown_email_is_also_counted():
    """Nếu chỉ đếm khi tài khoản tồn tại, chênh lệch thời gian phản hồi tự nó trở
    thành một kênh liệt kê tài khoản."""
    service = AuthService(AsyncMock())
    service.users = SimpleNamespace(get_by_email=AsyncMock(return_value=None))

    with patch(
        "app.services.auth_service.seconds_until_unlocked", AsyncMock(return_value=None)
    ), patch(
        "app.services.auth_service.record_login_failure", AsyncMock()
    ) as record:
        with pytest.raises(Exception):
            await service.authenticate("nobody@example.com", "guess")

    record.assert_awaited_once_with("nobody@example.com")
