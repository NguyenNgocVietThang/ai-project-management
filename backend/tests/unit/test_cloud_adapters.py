import base64
import json
from types import SimpleNamespace
from unittest.mock import Mock

import httpx
import pytest

from app.services import storage_service
from app.utils import email


def email_settings(**overrides):
    values = dict(
        EMAIL_PROVIDER="resend",
        RESEND_API_KEY="re_secret",
        EMAIL_FROM="demo@example.com",
        EMAIL_FROM_NAME="Demo",
        EMAIL_HTTP_TIMEOUT_SECONDS=15,
        APP_ENV="development",
    )
    values.update(overrides)
    return SimpleNamespace(**values)


def storage_settings(**overrides):
    payload = (
        base64.urlsafe_b64encode(json.dumps({"role": "service_role"}).encode()).decode().rstrip("=")
    )
    values = dict(
        STORAGE_PROVIDER="supabase",
        SUPABASE_URL="https://demo.supabase.co",
        SUPABASE_SERVICE_ROLE_KEY=f"header.{payload}.signature",
        SUPABASE_STORAGE_BUCKET="private-files",
        STORAGE_HTTP_TIMEOUT_SECONDS=15,
        STORAGE_SIGNED_URL_TTL_SECONDS=300,
    )
    values.update(overrides)
    return SimpleNamespace(**values)


@pytest.mark.asyncio
async def test_resend_retries_keep_key_and_escape_template(monkeypatch):
    monkeypatch.setattr(email, "settings", email_settings())
    requests = []

    def handle(request):
        requests.append(request)
        return httpx.Response(200, json={"id": "email-123"})

    original = httpx.AsyncClient
    monkeypatch.setattr(
        email.httpx,
        "AsyncClient",
        lambda **kw: original(transport=httpx.MockTransport(handle), **kw),
    )
    for _ in range(2):
        await email.send_project_invitation_email(
            "recipient@example.com",
            "<script>alert(1)</script>",
            "Demo",
            "Member",
            "https://demo.example/project",
            idempotency_key="job-123",
        )
    assert (
        requests[0].headers["idempotency-key"]
        == requests[1].headers["idempotency-key"]
        == "job-123"
    )
    payload = json.loads(requests[0].content)
    assert set(payload) == {"from", "to", "subject", "html"}
    assert "&lt;script&gt;" in payload["html"]
    assert "<script>" not in payload["html"]


@pytest.mark.asyncio
@pytest.mark.parametrize("status,retryable", [(429, True), (503, True), (401, False), (422, False)])
async def test_resend_errors_are_sanitized_and_classified(monkeypatch, status, retryable):
    monkeypatch.setattr(email, "settings", email_settings())
    original = httpx.AsyncClient
    monkeypatch.setattr(
        email.httpx,
        "AsyncClient",
        lambda **kw: original(
            transport=httpx.MockTransport(
                lambda request: httpx.Response(status, json={"message": "secret-token"})
            ),
            **kw,
        ),
    )
    with pytest.raises(email.EmailDeliveryError) as caught:
        await email.send_password_reset_email(
            "person@example.com", "https://example.com/reset?token=secret-token"
        )
    assert caught.value.retryable is retryable
    assert "secret-token" not in str(caught.value)
    assert caught.value.__cause__ is None


@pytest.mark.asyncio
async def test_resend_missing_key_fails_explicitly(monkeypatch):
    monkeypatch.setattr(email, "settings", email_settings(RESEND_API_KEY=""))
    with pytest.raises(email.EmailDeliveryError, match="configuration"):
        await email.send_email_verification_email(
            "person@example.com", "https://example.com/verify"
        )


@pytest.mark.asyncio
async def test_supabase_private_bucket_upload_download_delete_and_sign(monkeypatch):
    monkeypatch.setattr(storage_service, "settings", storage_settings())
    objects = {}
    seen = []

    def handle(request):
        seen.append(request)
        assert request.headers["authorization"].startswith("Bearer ")
        if request.url.path == "/storage/v1/bucket/private-files":
            return httpx.Response(200, json={"public": False})
        if request.method == "POST" and "/object/sign/" in request.url.path:
            assert json.loads(request.content) == {"expiresIn": 300}
            return httpx.Response(
                200, json={"signedURL": "/object/sign/private-files/avatars/7/a.webp?token=signed"}
            )
        if request.method == "POST":
            objects[request.url.path] = request.content
            return httpx.Response(200, json={"Key": "avatars/7/a.webp"})
        if request.method == "GET":
            return httpx.Response(
                200, content=objects[request.url.path], headers={"Content-Type": "image/webp"}
            )
        assert json.loads(request.content) == {"prefixes": ["avatars/7/a.webp"]}
        objects.clear()
        return httpx.Response(200, json=[])

    async with httpx.AsyncClient(transport=httpx.MockTransport(handle)) as client:
        service = storage_service.StorageService(http_client=client)
        await service.put_bytes("avatars/7/a.webp", b"image", "image/webp")
        assert await service.get_bytes("avatars/7/a.webp") == (b"image", "image/webp")
        url = await service.signed_url("avatars/7/a.webp")
        assert (
            url
            == "https://demo.supabase.co/storage/v1/object/sign/private-files/avatars/7/a.webp?token=signed"
        )
        await service.delete("avatars/7/a.webp")
    assert not objects
    assert all("/public/" not in request.url.path for request in seen)


@pytest.mark.asyncio
async def test_supabase_bucket_creation_is_private_and_verified(monkeypatch):
    monkeypatch.setattr(storage_service, "settings", storage_settings())
    exists = False

    def handle(request):
        nonlocal exists
        if request.method == "POST":
            assert json.loads(request.content)["public"] is False
            exists = True
            return httpx.Response(200, json={"name": "private-files"})
        return (
            httpx.Response(200, json={"public": False})
            if exists
            else httpx.Response(400, json={"statusCode": "404"})
        )

    async with httpx.AsyncClient(transport=httpx.MockTransport(handle)) as client:
        await storage_service.StorageService(http_client=client).initialize_bucket()
    assert exists


@pytest.mark.asyncio
async def test_supabase_public_bucket_is_rejected(monkeypatch):
    monkeypatch.setattr(storage_service, "settings", storage_settings())
    requests = []

    def handle(request):
        requests.append(request)
        return httpx.Response(200, json={"public": True})

    async with httpx.AsyncClient(transport=httpx.MockTransport(handle)) as client:
        with pytest.raises(storage_service.StorageError, match="private"):
            await storage_service.StorageService(http_client=client).put_bytes(
                "avatars/a.webp", b"x", "image/webp"
            )
    assert len(requests) == 1


@pytest.mark.parametrize(
    "key", ["anon", "sb_publishable_demo", "header.eyJyb2xlIjoiYW5vbiJ9.signature"]
)
def test_supabase_rejects_browser_credentials(monkeypatch, key):
    monkeypatch.setattr(
        storage_service, "settings", storage_settings(SUPABASE_SERVICE_ROLE_KEY=key)
    )
    with pytest.raises(storage_service.StorageError, match="server"):
        storage_service.StorageService()


@pytest.mark.asyncio
async def test_supabase_not_found_is_distinct_and_provider_details_are_hidden(monkeypatch):
    monkeypatch.setattr(storage_service, "settings", storage_settings())

    def handle(request):
        if "/bucket/" in request.url.path:
            return httpx.Response(200, json={"public": False})
        return httpx.Response(400, json={"statusCode": "404", "message": "sensitive-key"})

    async with httpx.AsyncClient(transport=httpx.MockTransport(handle)) as client:
        with pytest.raises(storage_service.StorageNotFoundError) as caught:
            await storage_service.StorageService(http_client=client).get_bytes(
                "avatars/missing.webp"
            )
    assert "sensitive-key" not in str(caught.value)


@pytest.mark.asyncio
@pytest.mark.parametrize("ttl", [0, 601])
async def test_signed_url_rejects_unbounded_lifetime(monkeypatch, ttl):
    monkeypatch.setattr(storage_service, "settings", storage_settings())
    with pytest.raises(ValueError):
        await storage_service.StorageService().signed_url("avatars/a.webp", expires_seconds=ttl)


@pytest.mark.asyncio
async def test_minio_compatibility_releases_download_connection(monkeypatch):
    monkeypatch.setattr(
        storage_service, "settings", SimpleNamespace(STORAGE_PROVIDER="minio", MINIO_BUCKET="files")
    )
    response = Mock(headers={"Content-Type": "image/webp"})
    response.read.return_value = b"image"
    client = Mock()
    client.get_object.return_value = response
    service = storage_service.StorageService(client=client)
    assert await service.get_bytes("avatars/a.webp") == (b"image", "image/webp")
    response.close.assert_called_once()
    response.release_conn.assert_called_once()


@pytest.mark.asyncio
async def test_minio_infrastructure_errors_become_sanitized_storage_errors(monkeypatch):
    # MinIO không chạy hoặc mạng lỗi: job phải nhận StorageError (mã storage_error),
    # không phải ngoại lệ thô làm job ra handler_failed.
    monkeypatch.setattr(
        storage_service, "settings", SimpleNamespace(STORAGE_PROVIDER="minio", MINIO_BUCKET="files")
    )
    client = Mock()
    client.bucket_exists.side_effect = ConnectionError("http://minio-secret:9000 refused")
    client.get_object.side_effect = ConnectionError("http://minio-secret:9000 refused")
    service = storage_service.StorageService(client=client)
    with pytest.raises(storage_service.StorageError) as put_error:
        await service.put_bytes("reports/1/a.xlsx", b"x", "application/octet-stream")
    assert "minio-secret" not in str(put_error.value)
    with pytest.raises(storage_service.StorageError):
        await service.get_bytes("reports/1/a.xlsx")


@pytest.mark.asyncio
async def test_email_transport_timeout_hides_secrets_and_retains_retry_key(monkeypatch):
    monkeypatch.setattr(email, "settings", email_settings())
    requests = []

    def handle(request):
        requests.append(request)
        if len(requests) == 1:
            raise httpx.ReadTimeout("private-reset-token", request=request)
        return httpx.Response(200, json={"id": "accepted"})

    original = httpx.AsyncClient
    monkeypatch.setattr(
        email.httpx,
        "AsyncClient",
        lambda **kw: original(transport=httpx.MockTransport(handle), **kw),
    )
    with pytest.raises(email.EmailDeliveryError) as caught:
        await email.send_password_reset_email(
            "person@example.com", "https://example.com/reset?token=secret"
        )
    assert caught.value.retryable is True
    assert "private-reset-token" not in str(caught.value)
    assert caught.value.__suppress_context__ is True
    await email.send_password_reset_email(
        "person@example.com", "https://example.com/reset?token=secret"
    )
    assert requests[0].headers["idempotency-key"] == requests[1].headers["idempotency-key"]
    assert "secret" not in requests[0].headers["idempotency-key"]


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "name,retryable",
    [("concurrent_idempotent_requests", True), ("invalid_idempotent_request", False)],
)
async def test_email_idempotency_conflict_is_classified(monkeypatch, name, retryable):
    monkeypatch.setattr(email, "settings", email_settings())
    original = httpx.AsyncClient
    monkeypatch.setattr(
        email.httpx,
        "AsyncClient",
        lambda **kw: original(
            transport=httpx.MockTransport(lambda request: httpx.Response(409, json={"name": name})),
            **kw,
        ),
    )
    with pytest.raises(email.EmailDeliveryError) as caught:
        await email.send_email_verification_email(
            "person@example.com", "https://example.com/verify"
        )
    assert caught.value.retryable is retryable


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "key", ["../other", "avatars/../other", "avatars//other", "avatars\\other", "/avatars/a"]
)
async def test_storage_rejects_traversal_before_provider_access(monkeypatch, key):
    monkeypatch.setattr(storage_service, "settings", storage_settings())
    with pytest.raises(ValueError):
        await storage_service.StorageService().get_bytes(key)


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "url",
    [
        "https://evil.example/secret",
        "//evil.example/secret",
        "/object/sign/private-files/other.webp?token=x",
        "/object/sign/private-files/avatars/a.webp?wrong=x",
    ],
)
async def test_signed_url_is_bound_to_expected_object(monkeypatch, url):
    monkeypatch.setattr(storage_service, "settings", storage_settings())

    def handle(request):
        return (
            httpx.Response(200, json={"public": False})
            if "/bucket/" in request.url.path
            else httpx.Response(200, json={"signedURL": url})
        )

    async with httpx.AsyncClient(transport=httpx.MockTransport(handle)) as client:
        with pytest.raises(storage_service.StorageError, match="signed URL"):
            await storage_service.StorageService(http_client=client).signed_url("avatars/a.webp")


@pytest.mark.asyncio
async def test_storage_timeout_has_no_sensitive_traceback_cause(monkeypatch):
    monkeypatch.setattr(storage_service, "settings", storage_settings())

    def handle(request):
        raise httpx.ConnectTimeout("service-role-secret", request=request)

    async with httpx.AsyncClient(transport=httpx.MockTransport(handle)) as client:
        with pytest.raises(storage_service.StorageError) as caught:
            await storage_service.StorageService(http_client=client).get_bytes("avatars/a.webp")
    assert caught.value.__cause__ is None
    assert caught.value.__suppress_context__ is True
    assert "service-role-secret" not in str(caught.value)
