from io import BytesIO
from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock, patch

import pytest
from fastapi import HTTPException
from PIL import Image

import app.db.base  # noqa: F401 - đăng ký các quan hệ SQLAlchemy
from app.core.security import create_refresh_token, verify_password
from app.schemas.user import ChangePasswordRequest, DeleteAccountRequest, UserUpdate
from app.services.auth_service import AuthService
from app.services.oauth_service import OAuthService, OAuthState
from app.services.user_service import MAX_AVATAR_BYTES, UserService


def build_db():
    return SimpleNamespace(flush=AsyncMock(), refresh=AsyncMock(), add=Mock())


def build_user(**overrides):
    values = {
        "id": 7,
        "email": "person@example.com",
        "username": "person_7",
        "full_name": "Person Seven",
        "phone": None,
        "position": None,
        "department": None,
        "hourly_rate": 30.0,
        "avatar_url": None,
        "avatar_storage_key": None,
        "hashed_password": None,
        "google_id": "google-7",
        "facebook_id": None,
        "auth_provider": "google",
        "auth_version": 0,
        "password_reset_token_hash": None,
        "password_reset_expires_at": None,
        "email_verification_token_hash": None,
        "email_verification_expires_at": None,
        "email_verified": True,
        "last_login": object(),
        "is_superuser": False,
        "is_active": True,
    }
    values.update(overrides)
    return SimpleNamespace(**values)


def build_service(user=None):
    db = build_db()
    storage = SimpleNamespace(
        put_bytes=AsyncMock(),
        get_bytes=AsyncMock(),
        delete=AsyncMock(),
    )
    service = UserService(db, storage)
    service.users = SimpleNamespace(
        get_by_username=AsyncMock(return_value=None),
        get_by_id=AsyncMock(return_value=user),
        get_by_id_for_update=AsyncMock(return_value=user),
    )
    return service, db, storage


@pytest.mark.asyncio
async def test_profile_partial_update_and_username_conflict():
    user = build_user()
    service, db, _ = build_service(user)

    updated = await service.update_profile(
        user,
        UserUpdate(full_name="Updated Person", phone=" +84 123 "),
    )

    assert updated.full_name == "Updated Person"
    assert updated.phone == "+84 123"
    assert updated.email == "person@example.com"
    assert updated.hourly_rate == 30.0
    db.flush.assert_awaited_once()
    assert db.add.call_args.args[0].action == "UPDATE_PROFILE"

    other_user = build_user(id=8, username="taken_name")
    service.users.get_by_username.return_value = other_user
    with pytest.raises(HTTPException) as error:
        await service.update_profile(user, UserUpdate(username="taken_name"))
    assert error.value.status_code == 409


@pytest.mark.asyncio
async def test_change_password_validates_current_password_and_revokes_sessions():
    from app.core.security import hash_password

    user = build_user(hashed_password=hash_password("OldPassword1"), auth_version=4)
    service, _, _ = build_service(user)

    with pytest.raises(HTTPException) as error:
        await service.change_password(
            user,
            ChangePasswordRequest(
                current_password="WrongPassword1",
                new_password="NewPassword2",
            ),
        )
    assert error.value.status_code == 400

    await service.change_password(
        user,
        ChangePasswordRequest(
            current_password="OldPassword1",
            new_password="NewPassword2",
        ),
    )
    assert verify_password("NewPassword2", user.hashed_password)
    assert user.auth_version == 5


@pytest.mark.asyncio
async def test_social_only_account_can_set_password_without_current_password():
    user = build_user(hashed_password=None, auth_version=0)
    service, _, _ = build_service(user)

    await service.change_password(
        user,
        ChangePasswordRequest(new_password="LocalPassword3"),
    )

    assert verify_password("LocalPassword3", user.hashed_password)
    assert user.google_id == "google-7"
    assert user.auth_version == 1


def avatar_bytes(size=(900, 600), image_format="PNG") -> bytes:
    output = BytesIO()
    Image.new("RGB", size, color=(38, 99, 235)).save(output, format=image_format)
    return output.getvalue()


def test_avatar_normalization_outputs_square_webp_and_rejects_corrupt_data():
    normalized = UserService._normalize_avatar(avatar_bytes())
    with Image.open(BytesIO(normalized)) as image:
        assert image.format == "WEBP"
        assert image.size == (512, 512)

    with pytest.raises(HTTPException) as error:
        UserService._normalize_avatar(b"not-an-image")
    assert error.value.status_code == 400


@pytest.mark.asyncio
async def test_avatar_upload_checks_size_and_replaces_previous_object():
    user = build_user(
        avatar_url="https://old.example/avatar.png",
        avatar_storage_key="avatars/7/old.webp",
    )
    service, _, storage = build_service(user)
    upload = SimpleNamespace(
        content_type="image/png",
        read=AsyncMock(return_value=avatar_bytes()),
    )

    await service.upload_avatar(user, upload)

    storage.put_bytes.assert_awaited_once()
    assert storage.put_bytes.call_args.args[0].startswith("avatars/7/")
    assert storage.put_bytes.call_args.args[2] == "image/webp"
    storage.delete.assert_awaited_once_with("avatars/7/old.webp")
    assert user.avatar_url.startswith("/api/v1/users/7/avatar?v=")

    oversized = SimpleNamespace(
        content_type="image/png",
        read=AsyncMock(return_value=b"x" * (MAX_AVATAR_BYTES + 1)),
    )
    with pytest.raises(HTTPException) as error:
        await service.upload_avatar(user, oversized)
    assert error.value.status_code == 400


@pytest.mark.asyncio
async def test_avatar_upload_rejects_mime_and_reports_storage_outage():
    user = build_user()
    service, _, storage = build_service(user)
    invalid_type = SimpleNamespace(
        content_type="image/gif",
        read=AsyncMock(return_value=avatar_bytes()),
    )
    with pytest.raises(HTTPException) as invalid_error:
        await service.upload_avatar(user, invalid_type)
    assert invalid_error.value.status_code == 400
    storage.put_bytes.assert_not_awaited()

    storage.put_bytes.side_effect = RuntimeError("storage unavailable")
    valid_upload = SimpleNamespace(
        content_type="image/png",
        read=AsyncMock(return_value=avatar_bytes()),
    )
    with pytest.raises(HTTPException) as storage_error:
        await service.upload_avatar(user, valid_upload)
    assert storage_error.value.status_code == 503
    assert user.avatar_storage_key is None


@pytest.mark.asyncio
async def test_disconnect_blocks_last_sign_in_method():
    user = build_user(hashed_password=None, google_id="google-7", facebook_id=None)
    service, _, _ = build_service(user)

    with pytest.raises(HTTPException) as error:
        await service.disconnect_social_account(user, "google")
    assert error.value.status_code == 400
    assert "last sign-in method" in error.value.detail

    user.hashed_password = "local-hash"
    updated = await service.disconnect_social_account(user, "google")
    assert updated.google_id is None
    assert updated.auth_provider == "local"


@pytest.mark.asyncio
async def test_deactivate_anonymizes_profile_but_preserves_identity_and_relations():
    relation_marker = object()
    user = build_user(
        phone="123",
        position="Developer",
        department="Engineering",
        avatar_storage_key="avatars/7/current.webp",
        avatar_url="/api/v1/users/7/avatar",
        projects=[relation_marker],
    )
    service, _, storage = build_service(user)

    with pytest.raises(HTTPException) as error:
        await service.deactivate_account(user, DeleteAccountRequest(username="wrong"))
    assert error.value.status_code == 400

    await service.deactivate_account(user, DeleteAccountRequest(username="person_7"))

    storage.delete.assert_awaited_once_with("avatars/7/current.webp")
    assert user.id == 7
    assert user.projects == [relation_marker]
    assert user.email.endswith("@deleted.invalid")
    assert user.username.startswith("deleted_7_")
    assert user.full_name == "Deleted User"
    assert user.phone is None and user.position is None and user.department is None
    assert user.google_id is None and user.hashed_password is None
    assert user.is_active is False
    assert user.is_superuser is False
    assert user.auth_version == 1


@pytest.mark.asyncio
async def test_oauth_link_state_binds_provider_mode_user_and_browser():
    """State phải dùng được đúng một lần, và chỉ từ trình duyệt đã tạo ra nó."""
    service = OAuthService(build_db())
    store: dict[str, str] = {}

    class FakeRedis:
        async def set(self, key, value, ex=None):
            store[key] = value

        async def getdel(self, key):
            return store.pop(key, None)

    with patch("app.core.oauth_state_store.get_redis", return_value=FakeRedis()):
        state, secret, challenge = await service.start_flow(
            "google", mode="link", user_id=7
        )
        assert challenge, "Google phải dùng PKCE"

        # Quay lại từ một trình duyệt khác (không có/sai cookie) thì bị từ chối.
        with pytest.raises(HTTPException):
            await service.consume_flow(state, "wrong-secret", "google")
        with pytest.raises(HTTPException):
            await service.consume_flow(state, None, "google")

        parsed, verifier = await service.consume_flow(state, secret, "google")
        assert parsed.provider == "google"
        assert parsed.mode == "link"
        assert parsed.user_id == 7
        assert verifier, "code_verifier của PKCE phải ở lại phía server"

        # Đã dùng rồi thì không dùng lại được nữa.
        with pytest.raises(HTTPException):
            await service.consume_flow(state, secret, "google")


@pytest.mark.asyncio
async def test_oauth_state_is_rejected_for_a_different_provider():
    service = OAuthService(build_db())
    store: dict[str, str] = {}

    class FakeRedis:
        async def set(self, key, value, ex=None):
            store[key] = value

        async def getdel(self, key):
            return store.pop(key, None)

    with patch("app.core.oauth_state_store.get_redis", return_value=FakeRedis()):
        state, secret, _ = await service.start_flow("google", mode="link", user_id=7)
        with pytest.raises(HTTPException):
            await service.consume_flow(state, secret, "facebook")


@pytest.mark.asyncio
async def test_oauth_link_rejects_provider_account_owned_by_another_user():
    user = build_user()
    other = build_user(id=99)
    service = OAuthService(build_db())
    service.users = SimpleNamespace(
        get_by_id_for_update=AsyncMock(return_value=user),
        get_by_google_id=AsyncMock(return_value=other),
    )
    state = OAuthState(provider="google", mode="link", user_id=user.id)

    with pytest.raises(HTTPException) as error:
        await service.link_social_account(
            state,
            {"id": "another-google", "email": "other@example.com"},
        )
    assert error.value.status_code == 409


@pytest.mark.asyncio
async def test_oauth_link_connects_provider_without_issuing_tokens():
    user = build_user(google_id=None)
    service = OAuthService(build_db())
    service.users = SimpleNamespace(
        get_by_id_for_update=AsyncMock(return_value=user),
        get_by_google_id=AsyncMock(return_value=None),
    )
    state = OAuthState(provider="google", mode="link", user_id=user.id)

    linked = await service.link_social_account(
        state,
        {
            "id": "new-google-id",
            "email": user.email,
            "email_verified": True,
            "avatar_url": "https://example.com/avatar.png",
        },
    )

    assert linked is user
    assert user.google_id == "new-google-id"
    assert user.email_verified is True
    assert service.db.add.call_args.args[0].action == "CONNECT_OAUTH"


@pytest.mark.asyncio
async def test_refresh_token_is_rejected_after_auth_version_changes():
    user = build_user(auth_version=3)
    service = AuthService(build_db())
    service.users = SimpleNamespace(get_by_id=AsyncMock(return_value=user))
    old_refresh_token = create_refresh_token({"sub": str(user.id), "ver": 2})

    with pytest.raises(HTTPException) as error:
        await service.refresh(old_refresh_token)
    assert error.value.status_code == 401
