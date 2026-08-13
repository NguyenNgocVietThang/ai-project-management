import hashlib
import logging
from datetime import datetime, timedelta, timezone
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch
from urllib.parse import parse_qs, urlparse

import httpx
import pytest
from fastapi import HTTPException

import app.db.base  # noqa: F401 - register all SQLAlchemy relationships for User construction
from app.models.user import User
from app.main import app
from app.schemas.auth import RegisterRequest
from app.services.auth_service import AuthService
from app.services.oauth_service import OAuthService


def build_service(user=None) -> tuple[AuthService, AsyncMock]:
    db = AsyncMock()
    service = AuthService(db)
    service.users = SimpleNamespace(
        get_by_email_verification_token_hash_for_update=AsyncMock(return_value=user),
        get_by_id_for_update=AsyncMock(return_value=user),
    )
    return service, db


def extract_token(link: str) -> str:
    return parse_qs(urlparse(link).query)["token"][0]


@pytest.mark.asyncio
async def test_registration_stores_hashed_token_and_survives_queue_failure(caplog):
    db = AsyncMock()
    service = AuthService(db)

    async def create_user(user):
        user.id = 17
        return user

    service.users = SimpleNamespace(
        get_by_email=AsyncMock(return_value=None),
        get_by_username=AsyncMock(return_value=None),
        create=AsyncMock(side_effect=create_user),
    )
    request = RegisterRequest(
        email="sensitive@example.com",
        username="sensitive_user",
        full_name="Sensitive User",
        password="Password1",
    )
    started_at = datetime.now(timezone.utc)

    with (
        patch("app.services.auth_service.secrets.token_urlsafe", return_value="secret-token"),
        patch(
            "app.services.auth_service.send_email_verification_task.delay",
            side_effect=RuntimeError("broker unavailable"),
        ),
        caplog.at_level(logging.ERROR),
    ):
        user = await service.register(request)

    assert user.email_verified is False
    assert user.email_verification_token_hash == hashlib.sha256(b"secret-token").hexdigest()
    assert started_at + timedelta(hours=23, minutes=59) < user.email_verification_expires_at
    assert user.email_verification_expires_at <= started_at + timedelta(hours=24, seconds=2)
    assert "user_id=17" in caplog.text
    assert request.email not in caplog.text
    assert "secret-token" not in caplog.text


@pytest.mark.asyncio
@pytest.mark.parametrize("naive_expiry", [False, True])
async def test_valid_verification_token_is_one_time_and_handles_database_timezone(
    naive_expiry,
):
    token = "valid-token"
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=30)
    if naive_expiry:
        expires_at = expires_at.replace(tzinfo=None)
    user = SimpleNamespace(
        email_verified=False,
        email_verification_token_hash=hashlib.sha256(token.encode()).hexdigest(),
        email_verification_expires_at=expires_at,
    )
    service, db = build_service(user)
    service.users.get_by_email_verification_token_hash_for_update.side_effect = [user, None]

    await service.verify_email(token)

    assert user.email_verified is True
    assert user.email_verification_token_hash is None
    assert user.email_verification_expires_at is None
    db.flush.assert_awaited_once()

    with pytest.raises(HTTPException) as replay_error:
        await service.verify_email(token)
    assert replay_error.value.status_code == 400
    assert replay_error.value.detail == "Invalid or expired email verification token"


@pytest.mark.asyncio
async def test_missing_expired_and_unknown_tokens_share_one_error():
    expired_user = SimpleNamespace(
        email_verified=False,
        email_verification_expires_at=datetime.now(timezone.utc) - timedelta(seconds=1),
    )
    service, _ = build_service(expired_user)

    with pytest.raises(HTTPException) as expired_error:
        await service.verify_email("expired")

    service.users.get_by_email_verification_token_hash_for_update.return_value = None
    with pytest.raises(HTTPException) as unknown_error:
        await service.verify_email("unknown")
    with pytest.raises(HTTPException) as missing_error:
        await service.verify_email(None)

    errors = (expired_error.value, unknown_error.value, missing_error.value)
    assert all(error.status_code == 400 for error in errors)
    assert {error.detail for error in errors} == {
        "Invalid or expired email verification token"
    }


@pytest.mark.asyncio
async def test_resend_replaces_old_token_and_queues_new_link():
    old_hash = hashlib.sha256(b"old-token").hexdigest()
    user = SimpleNamespace(
        id=9,
        email="person@example.com",
        email_verified=False,
        email_verification_token_hash=old_hash,
        email_verification_expires_at=datetime.now(timezone.utc) + timedelta(hours=20),
    )
    service, db = build_service(user)

    with (
        patch("app.services.auth_service.secrets.token_urlsafe", return_value="new-token"),
        patch("app.services.auth_service.send_email_verification_task.delay") as enqueue,
    ):
        sent = await service.resend_email_verification(user.id)

    assert sent is True
    assert user.email_verification_token_hash != old_hash
    assert user.email_verification_token_hash == hashlib.sha256(b"new-token").hexdigest()
    assert extract_token(enqueue.call_args.args[1]) == "new-token"
    db.flush.assert_awaited_once()


@pytest.mark.asyncio
async def test_resend_enforces_sixty_second_cooldown():
    user = SimpleNamespace(
        id=9,
        email="person@example.com",
        email_verified=False,
        email_verification_token_hash="hash",
        email_verification_expires_at=datetime.now(timezone.utc) + timedelta(
            hours=24, seconds=-10
        ),
    )
    service, _ = build_service(user)

    with (
        patch("app.services.auth_service.send_email_verification_task.delay") as enqueue,
        pytest.raises(HTTPException) as error,
    ):
        await service.resend_email_verification(user.id)

    assert error.value.status_code == 429
    assert 1 <= int(error.value.headers["Retry-After"]) <= 50
    enqueue.assert_not_called()


@pytest.mark.asyncio
async def test_resend_skips_already_verified_account():
    user = SimpleNamespace(id=9, email_verified=True)
    service, db = build_service(user)

    with patch("app.services.auth_service.send_email_verification_task.delay") as enqueue:
        sent = await service.resend_email_verification(user.id)

    assert sent is False
    enqueue.assert_not_called()
    db.flush.assert_not_awaited()


@pytest.mark.asyncio
async def test_resend_queue_failure_returns_retryable_error_without_sensitive_logs(caplog):
    user = SimpleNamespace(
        id=23,
        email="sensitive@example.com",
        email_verified=False,
        email_verification_token_hash=None,
        email_verification_expires_at=None,
    )
    service, _ = build_service(user)

    with (
        patch("app.services.auth_service.secrets.token_urlsafe", return_value="secret-token"),
        patch(
            "app.services.auth_service.send_email_verification_task.delay",
            side_effect=RuntimeError("broker unavailable"),
        ),
        caplog.at_level(logging.ERROR),
        pytest.raises(HTTPException) as error,
    ):
        await service.resend_email_verification(user.id)

    assert error.value.status_code == 503
    assert "try again" in error.value.detail.lower()
    assert "user_id=23" in caplog.text
    assert user.email not in caplog.text
    assert "secret-token" not in caplog.text


@pytest.mark.asyncio
async def test_resend_endpoint_requires_authentication():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post("/api/v1/auth/resend-verification")

    assert response.status_code == 401


@pytest.mark.asyncio
async def test_oauth_account_is_marked_verified():
    db = AsyncMock()
    service = OAuthService(db)

    async def create_user(user):
        user.id = 31
        return user

    service.users = SimpleNamespace(
        get_by_google_id=AsyncMock(return_value=None),
        get_by_email=AsyncMock(return_value=None),
        get_by_username=AsyncMock(return_value=None),
        create=AsyncMock(side_effect=create_user),
    )

    user = await service._get_or_create_social_user(
        email="oauth@example.com",
        full_name="OAuth User",
        avatar_url=None,
        provider="google",
        provider_id="google-31",
    )

    assert user.email_verified is True


@pytest.mark.asyncio
async def test_oauth_link_marks_existing_local_account_verified():
    existing_user = User(
        email="existing@example.com",
        username="existing_user",
        full_name="Existing User",
        hashed_password="not-used",
        email_verified=False,
        email_verification_token_hash="old-hash",
        email_verification_expires_at=datetime.now(timezone.utc) + timedelta(hours=1),
    )
    db = AsyncMock()
    service = OAuthService(db)
    service.users = SimpleNamespace(
        get_by_google_id=AsyncMock(return_value=None),
        get_by_email=AsyncMock(return_value=existing_user),
    )

    user = await service._get_or_create_social_user(
        email=existing_user.email,
        full_name=existing_user.full_name,
        avatar_url=None,
        provider="google",
        provider_id="google-existing",
    )

    assert user is existing_user
    assert user.email_verified is True
    assert user.google_id == "google-existing"
    assert user.email_verification_token_hash is None
    assert user.email_verification_expires_at is None
    db.flush.assert_awaited_once()
