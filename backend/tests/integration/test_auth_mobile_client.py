"""Chế độ auth cho app Android (`X-Client: android`).

Web giữ nguyên hành vi: refresh token chỉ nằm trong cookie httpOnly, không bao giờ ở body.
App di động không có kho cookie nên nhận refresh token trong body.
"""
from unittest.mock import AsyncMock, patch

import pytest
import pytest_asyncio

from app.core.auth_cookies import REFRESH_COOKIE_NAME
from app.core.security import create_refresh_token, decode_token, hash_password

LOGIN_URL = "/api/v1/auth/login"
REFRESH_URL = "/api/v1/auth/refresh"
LOGOUT_URL = "/api/v1/auth/logout"
EXCHANGE_URL = "/api/v1/auth/oauth/exchange"
MOBILE = {"X-Client": "android"}
PASSWORD = "StrongPassword123"


class FakeRevocations:
    """Danh sách thu hồi trong bộ nhớ, thay cho Redis/DB bảo mật."""

    def __init__(self):
        self.jtis: set[str] = set()

    async def revoke(self, jti, expires_at=None):
        self.jtis.add(jti)
        return True

    async def is_revoked(self, jti):
        return jti in self.jtis


@pytest.fixture
def revocations():
    fake = FakeRevocations()
    with patch("app.services.auth_service.revoke", fake.revoke), patch(
        "app.services.auth_service.is_revoked", fake.is_revoked
    ), patch("app.core.dependencies.is_revoked", fake.is_revoked), patch(
        "app.services.auth_service.seconds_until_unlocked", AsyncMock(return_value=None)
    ), patch("app.services.auth_service.record_login_failure", AsyncMock()), patch(
        "app.services.auth_service.clear_login_failures", AsyncMock()
    ):
        yield fake


@pytest_asyncio.fixture
async def account(make_user, session):
    user = await make_user()
    user.hashed_password = hash_password(PASSWORD)
    await session.commit()
    return user


async def _login(client, user, headers=None):
    return await client.post(
        LOGIN_URL, data={"username": user.email, "password": PASSWORD}, headers=headers or {}
    )


def _set_cookie_names(response) -> set[str]:
    return {
        value.split("=", 1)[0]
        for key, value in response.headers.multi_items()
        if key.lower() == "set-cookie"
    }


@pytest.mark.asyncio
async def test_web_login_keeps_refresh_token_in_cookie_only(client, account, revocations):
    response = await _login(client, account)

    assert response.status_code == 200
    body = response.json()
    assert "access_token" in body
    assert "refresh_token" not in body, "web không được nhận refresh token trong body"
    assert REFRESH_COOKIE_NAME in _set_cookie_names(response)


@pytest.mark.asyncio
async def test_mobile_login_returns_refresh_token_in_body_without_cookies(
    client, account, revocations
):
    response = await _login(client, account, MOBILE)

    assert response.status_code == 200
    body = response.json()
    assert body["token_type"] == "bearer"
    assert decode_token(body["access_token"])["type"] == "access"
    assert decode_token(body["refresh_token"])["type"] == "refresh"
    assert _set_cookie_names(response) == set(), "app không dùng cookie"


@pytest.mark.asyncio
async def test_unknown_client_header_is_treated_as_web(client, account, revocations):
    response = await _login(client, account, {"X-Client": "toaster"})

    assert "refresh_token" not in response.json()
    assert REFRESH_COOKIE_NAME in _set_cookie_names(response)


@pytest.mark.asyncio
async def test_mobile_refresh_rotates_token_in_body(client, account, revocations):
    first = (await _login(client, account, MOBILE)).json()

    second = await client.post(
        REFRESH_URL, json={"refresh_token": first["refresh_token"]}, headers=MOBILE
    )
    assert second.status_code == 200
    rotated = second.json()
    assert rotated["refresh_token"] != first["refresh_token"]
    assert _set_cookie_names(second) == set()

    third = await client.post(
        REFRESH_URL, json={"refresh_token": rotated["refresh_token"]}, headers=MOBILE
    )
    assert third.status_code == 200, "token mới xoay vòng phải dùng được"


@pytest.mark.asyncio
async def test_replaying_a_rotated_mobile_token_revokes_every_session(
    client, account, session, revocations
):
    first = (await _login(client, account, MOBILE)).json()
    rotated = (
        await client.post(
            REFRESH_URL, json={"refresh_token": first["refresh_token"]}, headers=MOBILE
        )
    ).json()

    replay = await client.post(
        REFRESH_URL, json={"refresh_token": first["refresh_token"]}, headers=MOBILE
    )
    assert replay.status_code == 401

    await session.refresh(account)
    assert account.auth_version == 1, "dùng lại token cũ phải hủy mọi phiên"
    after = await client.post(
        REFRESH_URL, json={"refresh_token": rotated["refresh_token"]}, headers=MOBILE
    )
    assert after.status_code == 401


@pytest.mark.asyncio
async def test_web_refresh_from_cookie_is_unchanged(client, account, revocations):
    login = await _login(client, account)
    client.cookies.set(REFRESH_COOKIE_NAME, create_refresh_token({"sub": str(account.id), "ver": 0}))

    response = await client.post(REFRESH_URL)

    assert response.status_code == 200
    assert "refresh_token" not in response.json()
    assert REFRESH_COOKIE_NAME in _set_cookie_names(response)
    assert login.status_code == 200


@pytest.mark.asyncio
async def test_header_cannot_extract_refresh_token_from_httponly_cookie(
    client, account, revocations
):
    """XSS tự gắn `X-Client` + cookie tự gửi kèm không được lấy refresh token ra body."""
    client.cookies.set(REFRESH_COOKIE_NAME, create_refresh_token({"sub": str(account.id), "ver": 0}))

    response = await client.post(REFRESH_URL, headers=MOBILE)

    assert response.status_code == 200
    assert "refresh_token" not in response.json()
    assert REFRESH_COOKIE_NAME in _set_cookie_names(response)


@pytest.mark.asyncio
async def test_mobile_logout_revokes_refresh_token_from_body(client, account, revocations):
    tokens = (await _login(client, account, MOBILE)).json()

    response = await client.post(
        LOGOUT_URL,
        json={"refresh_token": tokens["refresh_token"]},
        headers={**MOBILE, "Authorization": f"Bearer {tokens['access_token']}"},
    )

    assert response.status_code == 200
    assert decode_token(tokens["refresh_token"])["jti"] in revocations.jtis
    assert decode_token(tokens["access_token"])["jti"] in revocations.jtis
    again = await client.post(
        REFRESH_URL, json={"refresh_token": tokens["refresh_token"]}, headers=MOBILE
    )
    assert again.status_code == 401


@pytest.mark.asyncio
async def test_oauth_exchange_returns_refresh_token_only_to_mobile(client, revocations):
    pair = ("access-token-value", "refresh-token-value")
    with patch("app.api.v1.endpoints.auth.redeem_exchange_code", AsyncMock(return_value=pair)):
        web = await client.post(EXCHANGE_URL, json={"code": "abc"})
    with patch("app.api.v1.endpoints.auth.redeem_exchange_code", AsyncMock(return_value=pair)):
        mobile = await client.post(EXCHANGE_URL, json={"code": "abc"}, headers=MOBILE)

    assert web.json() == {"access_token": "access-token-value", "token_type": "bearer"}
    assert REFRESH_COOKIE_NAME in _set_cookie_names(web)
    assert mobile.json()["refresh_token"] == "refresh-token-value"
    assert _set_cookie_names(mobile) == set()
