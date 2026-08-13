import hashlib
import logging
from datetime import datetime, timedelta, timezone
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch
from urllib.parse import parse_qs, urlparse

import pytest
from fastapi import HTTPException
from pydantic import ValidationError

from app.api.v1.endpoints.auth import FORGOT_PASSWORD_MESSAGE, forgot_password
from app.core.security import hash_password, verify_password
from app.schemas.auth import ForgotPasswordRequest, RegisterRequest, ResetPasswordRequest
from app.services.auth_service import AuthService


def build_service(user=None) -> tuple[AuthService, AsyncMock]:
    db = AsyncMock()
    service = AuthService(db)
    service.users = SimpleNamespace(
        get_by_email=AsyncMock(return_value=user),
        get_by_password_reset_token_hash_for_update=AsyncMock(return_value=user),
    )
    return service, db


def extract_token(reset_link: str) -> str:
    return parse_qs(urlparse(reset_link).query)["token"][0]


@pytest.mark.asyncio
async def test_forgot_password_endpoint_always_returns_generic_message():
    service = SimpleNamespace(request_password_reset=AsyncMock())

    response = await forgot_password(
        ForgotPasswordRequest(email="person@example.com"),
        service,
    )

    assert response.message == FORGOT_PASSWORD_MESSAGE


@pytest.mark.asyncio
async def test_unknown_email_is_not_queued_or_persisted():
    service, db = build_service(user=None)

    with patch("app.services.auth_service.send_password_reset_email_task.delay") as enqueue:
        await service.request_password_reset("missing@example.com")

    enqueue.assert_not_called()
    db.flush.assert_not_awaited()


@pytest.mark.asyncio
async def test_reset_request_stores_only_hash_and_expires_in_one_hour():
    user = SimpleNamespace(
        id=7,
        email="person@example.com",
        password_reset_token_hash=None,
        password_reset_expires_at=None,
    )
    service, db = build_service(user)
    started_at = datetime.now(timezone.utc)

    with patch("app.services.auth_service.send_password_reset_email_task.delay") as enqueue:
        await service.request_password_reset(user.email)

    _, reset_link = enqueue.call_args.args
    raw_token = extract_token(reset_link)
    assert raw_token not in user.password_reset_token_hash
    assert user.password_reset_token_hash == hashlib.sha256(raw_token.encode()).hexdigest()
    assert started_at + timedelta(minutes=59) < user.password_reset_expires_at
    assert user.password_reset_expires_at <= started_at + timedelta(hours=1, seconds=2)
    db.flush.assert_awaited_once()


@pytest.mark.asyncio
async def test_new_request_invalidates_previous_token():
    user = SimpleNamespace(
        id=7,
        email="person@example.com",
        password_reset_token_hash=None,
        password_reset_expires_at=None,
    )
    service, _ = build_service(user)

    with (
        patch(
            "app.services.auth_service.secrets.token_urlsafe",
            side_effect=["first-token", "second-token"],
        ),
        patch("app.services.auth_service.send_password_reset_email_task.delay") as enqueue,
    ):
        await service.request_password_reset(user.email)
        await service.request_password_reset(user.email)

    first_link = enqueue.call_args_list[0].args[1]
    second_link = enqueue.call_args_list[1].args[1]
    assert extract_token(first_link) == "first-token"
    assert extract_token(second_link) == "second-token"
    assert user.password_reset_token_hash == hashlib.sha256(b"second-token").hexdigest()


@pytest.mark.asyncio
async def test_queue_failure_is_hidden_and_does_not_log_sensitive_values(caplog):
    user = SimpleNamespace(
        id=42,
        email="sensitive@example.com",
        password_reset_token_hash=None,
        password_reset_expires_at=None,
    )
    service, _ = build_service(user)

    with (
        patch("app.services.auth_service.secrets.token_urlsafe", return_value="secret-token"),
        patch(
            "app.services.auth_service.send_password_reset_email_task.delay",
            side_effect=RuntimeError("broker unavailable"),
        ),
        caplog.at_level(logging.ERROR),
    ):
        await service.request_password_reset(user.email)

    assert "user_id=42" in caplog.text
    assert user.email not in caplog.text
    assert "secret-token" not in caplog.text


@pytest.mark.asyncio
async def test_valid_token_changes_password_and_cannot_be_replayed():
    token = "valid-token"
    user = SimpleNamespace(
        hashed_password=hash_password("OldPassword1"),
        password_reset_token_hash=hashlib.sha256(token.encode()).hexdigest(),
        password_reset_expires_at=datetime.now(timezone.utc) + timedelta(minutes=30),
        auth_provider="local",
        google_id=None,
        facebook_id=None,
    )
    service, db = build_service(user)
    service.users.get_by_password_reset_token_hash_for_update.side_effect = [user, None]
    request = ResetPasswordRequest(token=token, new_password="NewPassword2")

    await service.reset_password(request)

    assert verify_password("NewPassword2", user.hashed_password)
    assert not verify_password("OldPassword1", user.hashed_password)
    assert user.password_reset_token_hash is None
    assert user.password_reset_expires_at is None
    db.flush.assert_awaited_once()

    with pytest.raises(HTTPException) as exc_info:
        await service.reset_password(request)
    assert exc_info.value.status_code == 400
    assert exc_info.value.detail == "Invalid or expired reset token"


@pytest.mark.asyncio
async def test_social_only_user_can_add_password_without_losing_provider_link():
    token = "social-token"
    user = SimpleNamespace(
        hashed_password=None,
        password_reset_token_hash=hashlib.sha256(token.encode()).hexdigest(),
        password_reset_expires_at=datetime.now(timezone.utc) + timedelta(minutes=30),
        auth_provider="google",
        google_id="google-123",
        facebook_id=None,
    )
    service, _ = build_service(user)

    await service.reset_password(ResetPasswordRequest(token=token, new_password="LocalPassword3"))

    assert verify_password("LocalPassword3", user.hashed_password)
    assert user.auth_provider == "google"
    assert user.google_id == "google-123"


@pytest.mark.asyncio
async def test_expired_token_uses_same_error_as_unknown_token():
    token = "expired-token"
    user = SimpleNamespace(
        password_reset_token_hash=hashlib.sha256(token.encode()).hexdigest(),
        password_reset_expires_at=datetime.now(timezone.utc) - timedelta(seconds=1),
    )
    service, _ = build_service(user)

    with pytest.raises(HTTPException) as expired_error:
        await service.reset_password(ResetPasswordRequest(token=token, new_password="NewPassword4"))

    service.users.get_by_password_reset_token_hash_for_update.return_value = None
    with pytest.raises(HTTPException) as unknown_error:
        await service.reset_password(
            ResetPasswordRequest(token="unknown-token", new_password="NewPassword4")
        )

    assert expired_error.value.status_code == unknown_error.value.status_code == 400
    assert (
        expired_error.value.detail == unknown_error.value.detail == "Invalid or expired reset token"
    )


@pytest.mark.parametrize(
    "password",
    [
        "abcdefgh",
        "short1",
        "A1" + "a" * 71,
    ],
)
def test_registration_rejects_passwords_outside_shared_policy(password):
    with pytest.raises(ValidationError):
        RegisterRequest(
            email="person@example.com",
            username="person",
            full_name="Example Person",
            password=password,
        )


def test_registration_and_reset_accept_same_password_policy():
    password = "A1" + "a" * 70

    registration = RegisterRequest(
        email="person@example.com",
        username="person",
        full_name="Example Person",
        password=password,
    )
    reset = ResetPasswordRequest(token="token", new_password=password)

    assert registration.password == reset.new_password == password
