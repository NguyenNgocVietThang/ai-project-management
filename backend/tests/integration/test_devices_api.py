"""POST /devices và DELETE /devices/{token}: token push của app di động."""
import pytest
from sqlalchemy import select

from app.models.device_token import DeviceToken
from app.services.device_service import MAX_ACTIVE_DEVICES_PER_USER

TOKEN_A = "fcm-token-a-" + "x" * 40
TOKEN_B = "fcm-token-b-" + "y" * 40


def _body(token=TOKEN_A, **overrides):
    return {"token": token, "platform": "android", "app_version": "1.0.0", "locale": "vi", **overrides}


async def _all(session):
    return (await session.scalars(select(DeviceToken).order_by(DeviceToken.id))).all()


@pytest.mark.asyncio
async def test_registering_requires_authentication(client):
    assert (await client.post("/api/v1/devices", json=_body())).status_code == 401
    assert (await client.delete(f"/api/v1/devices/{TOKEN_A}")).status_code == 401


@pytest.mark.asyncio
async def test_register_creates_device_for_caller(session, make_user, as_user):
    user = await make_user()
    async with as_user(user) as http:
        response = await http.post("/api/v1/devices", json=_body(locale="en"))

    assert response.status_code == 200
    assert response.json()["locale"] == "en"
    (device,) = await _all(session)
    assert device.user_id == user.id
    assert device.revoked_at is None
    assert device.last_seen_at is not None


@pytest.mark.asyncio
async def test_register_is_idempotent_and_refreshes_metadata(session, make_user, as_user):
    user = await make_user()
    async with as_user(user) as http:
        first = await http.post("/api/v1/devices", json=_body(app_version="1.0.0"))
        second = await http.post("/api/v1/devices", json=_body(app_version="1.1.0"))

    assert first.json()["id"] == second.json()["id"]
    (device,) = await _all(session)
    assert device.app_version == "1.1.0"


@pytest.mark.asyncio
async def test_token_moves_to_new_owner_when_account_changes_on_same_phone(
    session, make_user, as_user
):
    first, second = await make_user(), await make_user()
    async with as_user(first) as http:
        await http.post("/api/v1/devices", json=_body())
    async with as_user(second) as http:
        await http.post("/api/v1/devices", json=_body())

    (device,) = await _all(session)
    assert device.user_id == second.id, "push của người cũ không được tới máy này nữa"


@pytest.mark.asyncio
async def test_register_revives_a_revoked_token(session, make_user, as_user):
    user = await make_user()
    async with as_user(user) as http:
        await http.post("/api/v1/devices", json=_body())
        await http.delete(f"/api/v1/devices/{TOKEN_A}")
        await http.post("/api/v1/devices", json=_body())

    (device,) = await _all(session)
    assert device.revoked_at is None


@pytest.mark.asyncio
async def test_unregister_revokes_own_token(session, make_user, as_user):
    user = await make_user()
    async with as_user(user) as http:
        await http.post("/api/v1/devices", json=_body())
        response = await http.delete(f"/api/v1/devices/{TOKEN_A}")

    assert response.status_code == 204
    (device,) = await _all(session)
    assert device.revoked_at is not None


@pytest.mark.asyncio
async def test_cannot_revoke_another_users_token_and_response_does_not_reveal_it(
    session, make_user, as_user
):
    owner, attacker = await make_user(), await make_user()
    async with as_user(owner) as http:
        await http.post("/api/v1/devices", json=_body())
    async with as_user(attacker) as http:
        existing = await http.delete(f"/api/v1/devices/{TOKEN_A}")
        missing = await http.delete(f"/api/v1/devices/{TOKEN_B}")

    assert existing.status_code == missing.status_code == 204
    (device,) = await _all(session)
    assert device.revoked_at is None and device.user_id == owner.id


@pytest.mark.asyncio
async def test_oldest_devices_are_revoked_beyond_the_limit(session, make_user, as_user):
    user = await make_user()
    async with as_user(user) as http:
        for index in range(MAX_ACTIVE_DEVICES_PER_USER + 2):
            token = f"fcm-token-{index:02d}-" + "z" * 40
            response = await http.post("/api/v1/devices", json=_body(token))
            assert response.status_code == 200

    devices = await _all(session)
    active = [device for device in devices if device.revoked_at is None]
    assert len(active) == MAX_ACTIVE_DEVICES_PER_USER
    assert devices[-1].revoked_at is None, "thiết bị vừa đăng ký không được bị thu hồi"
    assert devices[0].revoked_at is not None


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "overrides",
    [{"platform": "windows"}, {"locale": "fr"}, {"token": "short"}, {"token": "bad token with spaces " * 3}],
)
async def test_invalid_payload_is_rejected(make_user, as_user, overrides):
    user = await make_user()
    async with as_user(user) as http:
        response = await http.post("/api/v1/devices", json=_body(**overrides))
    assert response.status_code == 422
