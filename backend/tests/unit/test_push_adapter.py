"""Adapter FCM HTTP v1: kiểm thử bằng httpx.MockTransport, KHÔNG gọi mạng thật."""
import json

import httpx
import jwt
import pytest
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa

from app.core.config import Settings, settings
from app.utils import push
from app.utils.push import PushDeliveryError, PushMessage, send_push

_KEY = rsa.generate_private_key(public_exponent=65537, key_size=2048)
PRIVATE_PEM = _KEY.private_bytes(
    serialization.Encoding.PEM,
    serialization.PrivateFormat.PKCS8,
    serialization.NoEncryption(),
).decode()
PUBLIC_PEM = _KEY.public_key().public_bytes(
    serialization.Encoding.PEM, serialization.PublicFormat.SubjectPublicKeyInfo
)
MESSAGE = PushMessage(token="device-token-1", title="Tiêu đề", body="Thân", data={"notification_id": "7"})


@pytest.fixture(autouse=True)
def fcm_settings(monkeypatch):
    monkeypatch.setattr(settings, "PUSH_PROVIDER", "fcm")
    monkeypatch.setattr(settings, "FCM_PROJECT_ID", "demo-project")
    monkeypatch.setattr(
        settings,
        "FCM_SERVICE_ACCOUNT_JSON",
        json.dumps({"client_email": "svc@demo.iam.gserviceaccount.com", "private_key": PRIVATE_PEM}),
    )
    push._token_cache.update(value="", expires_at=0.0)
    yield
    push._token_cache.update(value="", expires_at=0.0)


class Recorder:
    def __init__(self, send_response=None, token_response=None, send_error=None):
        self.calls: list[httpx.Request] = []
        self.send_response = send_response or httpx.Response(200, json={"name": "projects/x/messages/1"})
        self.token_response = token_response or httpx.Response(
            200, json={"access_token": "oauth-token", "expires_in": 3600}
        )
        self.send_error = send_error

    def handler(self, request: httpx.Request) -> httpx.Response:
        self.calls.append(request)
        if request.url.host == "oauth2.googleapis.com":
            return self.token_response
        if self.send_error is not None:
            raise self.send_error
        return self.send_response

    @property
    def sends(self):
        return [call for call in self.calls if call.url.host == "fcm.googleapis.com"]

    @property
    def token_calls(self):
        return [call for call in self.calls if call.url.host == "oauth2.googleapis.com"]


@pytest.fixture
def transport(monkeypatch):
    def install(recorder: Recorder) -> Recorder:
        real = httpx.AsyncClient

        def factory(*args, **kwargs):
            kwargs["transport"] = httpx.MockTransport(recorder.handler)
            return real(*args, **kwargs)

        monkeypatch.setattr("app.utils.push.httpx.AsyncClient", factory)
        return recorder

    return install


@pytest.mark.asyncio
async def test_successful_send_uses_oauth_token_and_v1_message_shape(transport):
    recorder = transport(Recorder())

    await send_push(MESSAGE)

    (send,) = recorder.sends
    assert str(send.url) == "https://fcm.googleapis.com/v1/projects/demo-project/messages:send"
    assert send.headers["authorization"] == "Bearer oauth-token"
    sent = json.loads(send.content)["message"]
    assert sent["token"] == "device-token-1"
    assert sent["notification"] == {"title": "Tiêu đề", "body": "Thân"}
    assert sent["data"] == {"notification_id": "7"}


@pytest.mark.asyncio
async def test_oauth_assertion_is_a_valid_signed_jwt_for_fcm_scope(transport):
    recorder = transport(Recorder())

    await send_push(MESSAGE)

    form = dict(pair.split("=", 1) for pair in recorder.token_calls[0].content.decode().split("&"))
    assert form["grant_type"].startswith("urn%3Aietf")
    claims = jwt.decode(
        form["assertion"], PUBLIC_PEM, algorithms=["RS256"], audience="https://oauth2.googleapis.com/token"
    )
    assert claims["iss"] == "svc@demo.iam.gserviceaccount.com"
    assert claims["scope"] == "https://www.googleapis.com/auth/firebase.messaging"


@pytest.mark.asyncio
async def test_access_token_is_cached_between_sends(transport):
    recorder = transport(Recorder())

    await send_push(MESSAGE)
    await send_push(MESSAGE)

    assert len(recorder.token_calls) == 1
    assert len(recorder.sends) == 2


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "response",
    [
        httpx.Response(404, json={"error": {"status": "NOT_FOUND"}}),
        httpx.Response(
            404,
            json={"error": {"status": "NOT_FOUND", "details": [{"errorCode": "UNREGISTERED"}]}},
        ),
        httpx.Response(403, json={"error": {"details": [{"errorCode": "SENDER_ID_MISMATCH"}]}}),
    ],
)
async def test_dead_tokens_are_reported_as_unregistered(transport, response):
    transport(Recorder(send_response=response))

    with pytest.raises(PushDeliveryError) as error:
        await send_push(MESSAGE)

    assert error.value.unregistered is True
    assert error.value.retryable is False


@pytest.mark.asyncio
@pytest.mark.parametrize("status", [429, 500, 503])
async def test_server_side_errors_are_retryable(transport, status):
    transport(Recorder(send_response=httpx.Response(status, json={})))

    with pytest.raises(PushDeliveryError) as error:
        await send_push(MESSAGE)

    assert error.value.retryable is True and error.value.unregistered is False


@pytest.mark.asyncio
async def test_expired_oauth_token_is_dropped_and_retried(transport):
    transport(Recorder(send_response=httpx.Response(401, json={})))

    with pytest.raises(PushDeliveryError) as error:
        await send_push(MESSAGE)

    assert error.value.retryable is True
    assert push._token_cache["value"] == "", "lần thử sau phải xin token OAuth mới"


@pytest.mark.asyncio
async def test_bad_request_is_permanent_and_does_not_revoke(transport):
    transport(Recorder(send_response=httpx.Response(400, json={"error": {"status": "INVALID_ARGUMENT"}})))

    with pytest.raises(PushDeliveryError) as error:
        await send_push(MESSAGE)

    assert error.value.retryable is False and error.value.unregistered is False


@pytest.mark.asyncio
async def test_network_failure_is_retryable(transport):
    transport(Recorder(send_error=httpx.ConnectError("boom")))

    with pytest.raises(PushDeliveryError) as error:
        await send_push(MESSAGE)

    assert error.value.retryable is True


@pytest.mark.asyncio
@pytest.mark.parametrize("status, retryable", [(400, False), (401, False), (503, True)])
async def test_oauth_failures(transport, status, retryable):
    transport(Recorder(token_response=httpx.Response(status, json={"error": "x"})))

    with pytest.raises(PushDeliveryError) as error:
        await send_push(MESSAGE)

    assert error.value.retryable is retryable


@pytest.mark.asyncio
async def test_errors_never_echo_provider_response_or_secrets(transport):
    transport(Recorder(send_response=httpx.Response(400, text="SECRET-PROVIDER-BODY device-token-1")))

    with pytest.raises(PushDeliveryError) as error:
        await send_push(MESSAGE)

    text = str(error.value)
    assert "SECRET-PROVIDER-BODY" not in text and "device-token-1" not in text
    assert PRIVATE_PEM not in text


@pytest.mark.asyncio
@pytest.mark.parametrize("raw", ["", "not json", "{}", json.dumps({"client_email": "a@b"})])
async def test_unusable_service_account_is_a_permanent_error(monkeypatch, raw):
    monkeypatch.setattr(settings, "FCM_SERVICE_ACCOUNT_JSON", raw)

    with pytest.raises(PushDeliveryError) as error:
        await send_push(MESSAGE)

    assert error.value.retryable is False


@pytest.mark.asyncio
async def test_disabled_provider_refuses_to_send(monkeypatch):
    monkeypatch.setattr(settings, "PUSH_PROVIDER", "disabled")
    with pytest.raises(PushDeliveryError):
        await send_push(MESSAGE)


# ── Cấu hình ────────────────────────────────────────────────────────────────

PROD = dict(
    APP_ENV="production",
    SECRET_KEY="k" * 40,
    MINIO_ACCESS_KEY="real-access",
    MINIO_SECRET_KEY="real-secret",
    ALLOWED_HOSTS=["app.example.com"],
    CORS_ORIGINS=["https://app.example.com"],
    FRONTEND_URL="https://app.example.com",
)


def test_fake_provider_is_rejected_outside_development():
    with pytest.raises(ValueError, match="PUSH_PROVIDER=fake"):
        Settings(_env_file=None, **PROD, PUSH_PROVIDER="fake")


def test_fcm_requires_project_and_service_account_in_production():
    with pytest.raises(ValueError, match="FCM_PROJECT_ID"):
        Settings(_env_file=None, **PROD, PUSH_PROVIDER="fcm")
    Settings(
        _env_file=None,
        **PROD,
        PUSH_PROVIDER="fcm",
        FCM_PROJECT_ID="demo",
        FCM_SERVICE_ACCOUNT_JSON="{}",
    )


def test_push_is_disabled_by_default_and_service_account_is_not_in_repr():
    config = Settings(_env_file=None, FCM_SERVICE_ACCOUNT_JSON="sa-json-xyz")
    assert config.PUSH_PROVIDER == "disabled"
    assert "sa-json-xyz" not in repr(config)
