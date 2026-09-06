"""Gộp tài khoản qua OAuth phải dựa vào khẳng định của provider, không phải chuỗi email.

Trước đây `_get_or_create_social_user` tìm thấy một tài khoản local trùng email là
gắn thẳng provider_id vào đó và đặt `email_verified = True`. Bất kỳ ai tạo được một
identity ở provider mang email của nạn nhân đều chiếm được tài khoản đó — kể cả tài
khoản Admin — ngay ở lần đăng nhập đầu tiên, không có bước xác nhận nào.
"""
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest

import app.db.base  # noqa: F401 - đăng ký các quan hệ SQLAlchemy
from app.core.exceptions import ConflictException
from app.models.user import User
from app.services.oauth_service import OAuthService


def _service_with_existing(existing: User | None) -> OAuthService:
    service = OAuthService(AsyncMock())

    async def create_user(user):
        user.id = 99
        return user

    service.users = SimpleNamespace(
        get_by_google_id=AsyncMock(return_value=None),
        get_by_facebook_id=AsyncMock(return_value=None),
        get_by_email=AsyncMock(return_value=existing),
        get_by_username=AsyncMock(return_value=None),
        create=AsyncMock(side_effect=create_user),
    )
    return service


def _victim() -> User:
    return User(
        email="admin@company.com",
        username="admin",
        full_name="Admin",
        hashed_password="hashed",
        email_verified=True,
    )


@pytest.mark.asyncio
async def test_unverified_provider_email_cannot_take_over_a_local_account():
    victim = _victim()
    service = _service_with_existing(victim)

    with pytest.raises(ConflictException):
        await service._get_or_create_social_user(
            email="admin@company.com",
            full_name="Attacker",
            avatar_url=None,
            provider="google",
            provider_id="attacker-identity",
            email_provider_verified=False,
        )

    assert victim.google_id is None, "identity của kẻ tấn công không được gắn vào tài khoản nạn nhân"


@pytest.mark.asyncio
async def test_facebook_never_asserts_verification_so_it_cannot_merge():
    """Graph API không công bố trạng thái xác minh, nên luồng Facebook không bao giờ gộp."""
    victim = _victim()
    service = _service_with_existing(victim)

    with pytest.raises(ConflictException):
        await service._get_or_create_social_user(
            email="admin@company.com",
            full_name="Attacker",
            avatar_url=None,
            provider="facebook",
            provider_id="attacker-identity",
            email_provider_verified=False,
        )

    assert victim.facebook_id is None


@pytest.mark.asyncio
async def test_new_account_from_unverified_email_is_not_marked_verified():
    service = _service_with_existing(None)

    user = await service._get_or_create_social_user(
        email="someone@example.com",
        full_name="Someone",
        avatar_url=None,
        provider="facebook",
        provider_id="fb-1",
        email_provider_verified=False,
    )

    assert user.email_verified is False


@pytest.mark.asyncio
async def test_identity_without_email_is_never_treated_as_verified():
    service = _service_with_existing(None)

    user = await service._get_or_create_social_user(
        email=None,
        full_name="No Email",
        avatar_url=None,
        provider="facebook",
        provider_id="fb-2",
        email_provider_verified=True,
    )

    assert user.email_verified is False
    # .invalid là TLD được dành riêng, không bao giờ phân giải được — khác với một
    # tên miền trông như thật mà người khác có thể đăng ký.
    assert user.email.endswith("@social.invalid")


@pytest.mark.asyncio
async def test_google_profile_carries_the_verified_flag_through():
    """Cờ này bị bỏ qua trước đây; kiểm tra nó thực sự được đọc từ userinfo."""
    import httpx

    service = OAuthService(AsyncMock())
    captured = {}

    class FakeResponse:
        def __init__(self, payload):
            self.status_code = 200
            self._payload = payload

        def json(self):
            return self._payload

    class FakeClient:
        async def __aenter__(self):
            return self

        async def __aexit__(self, *args):
            return False

        async def post(self, *args, **kwargs):
            return FakeResponse({"access_token": "tok"})

        async def get(self, *args, **kwargs):
            return FakeResponse(captured["profile"])

    captured["profile"] = {"id": "g1", "email": "a@b.com", "verified_email": True, "name": "A"}
    original = httpx.AsyncClient
    httpx.AsyncClient = lambda *a, **k: FakeClient()
    try:
        info = await service.fetch_google_user("code")
        assert info["email_verified"] is True

        captured["profile"] = {"id": "g1", "email": "a@b.com", "verified_email": False, "name": "A"}
        info = await service.fetch_google_user("code")
        assert info["email_verified"] is False

        # Cờ vắng mặt phải được hiểu là chưa xác minh, không phải đã xác minh.
        captured["profile"] = {"id": "g1", "email": "a@b.com", "name": "A"}
        info = await service.fetch_google_user("code")
        assert info["email_verified"] is False
    finally:
        httpx.AsyncClient = original
