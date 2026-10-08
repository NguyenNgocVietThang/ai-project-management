from io import BytesIO
from unittest.mock import AsyncMock

import httpx
import pytest
from PIL import Image

from app.core.security import create_access_token
from app.main import app
from app.services import storage_service
from app.services.storage_service import get_storage_service
from tests.unit.test_cloud_adapters import storage_settings


@pytest.mark.asyncio
async def test_anonymous_avatar_access_is_denied_before_storage(client):
    storage = AsyncMock()
    app.dependency_overrides[get_storage_service] = lambda: storage
    response = await client.get("/api/v1/users/1/avatar")
    assert response.status_code == 401
    storage.get_bytes.assert_not_awaited()


@pytest.mark.asyncio
async def test_supabase_avatar_roundtrip_keeps_ownership_and_size_limits(
    monkeypatch, make_user, as_user
):
    monkeypatch.setattr(storage_service, "settings", storage_settings())
    owner = await make_user()
    other = await make_user()
    objects = {}

    def handle(request):
        if "/bucket/" in request.url.path:
            return httpx.Response(200, json={"public": False})
        if request.method == "POST":
            objects[request.url.path] = request.content
            return httpx.Response(200, json={"Key": request.url.path})
        if request.url.path in objects:
            return httpx.Response(
                200, content=objects[request.url.path], headers={"Content-Type": "image/webp"}
            )
        return httpx.Response(400, json={"statusCode": "404"})

    raw = BytesIO()
    Image.new("RGB", (30, 30), "blue").save(raw, format="PNG")
    async with httpx.AsyncClient(transport=httpx.MockTransport(handle)) as provider:
        storage = storage_service.StorageService(http_client=provider)
        app.dependency_overrides[get_storage_service] = lambda: storage
        async with as_user(owner) as client:
            response = await client.post(
                "/api/v1/users/me/avatar", files={"file": ("a.png", raw.getvalue(), "image/png")}
            )
            assert response.status_code == 200
            assert owner.avatar_storage_key.startswith(f"avatars/{owner.id}/")
            assert response.json()["avatar_url"].startswith(f"/api/v1/users/{owner.id}/avatar")
            oversized = await client.post(
                "/api/v1/users/me/avatar",
                files={"file": ("a.png", b"x" * (5 * 1024 * 1024 + 1), "image/png")},
            )
            assert oversized.status_code == 400
            assert len(objects) == 1
            # The real media authentication dependency runs, including token decoding
            # and active/version checks; only Redis revocation is replaced.
            monkeypatch.setattr("app.core.dependencies.is_revoked", AsyncMock(return_value=False))
            token = create_access_token({"sub": str(owner.id), "ver": owner.auth_version})
            download = await client.get(
                response.json()["avatar_url"], headers={"Authorization": f"Bearer {token}"}
            )
            assert download.status_code == 200
            assert download.headers["Content-Type"] == "image/webp"
            assert download.headers["Cache-Control"] == "private, no-store"
            with Image.open(BytesIO(download.content)) as image:
                assert image.size == (512, 512)

        async with as_user(other) as client:
            response = await client.post(
                "/api/v1/users/me/avatar", files={"file": ("a.png", raw.getvalue(), "image/png")}
            )
            assert response.status_code == 200
            assert other.avatar_storage_key.startswith(f"avatars/{other.id}/")
            assert owner.avatar_storage_key != other.avatar_storage_key
            # Arbitrary user IDs have no avatar mutation route.
            forbidden = await client.post(
                f"/api/v1/users/{owner.id}/avatar",
                files={"file": ("a.png", raw.getvalue(), "image/png")},
            )
            assert forbidden.status_code == 405


@pytest.mark.asyncio
async def test_deleted_supabase_avatar_maps_to_404(monkeypatch, make_user, as_user):
    monkeypatch.setattr(storage_service, "settings", storage_settings())
    owner = await make_user(avatar_storage_key="avatars/missing.webp")
    monkeypatch.setattr("app.core.dependencies.is_revoked", AsyncMock(return_value=False))

    def handle(request):
        return (
            httpx.Response(200, json={"public": False})
            if "/bucket/" in request.url.path
            else httpx.Response(400, json={"statusCode": "404"})
        )

    async with httpx.AsyncClient(transport=httpx.MockTransport(handle)) as provider:
        storage = storage_service.StorageService(http_client=provider)
        app.dependency_overrides[get_storage_service] = lambda: storage
        async with as_user(owner) as client:
            token = create_access_token({"sub": str(owner.id), "ver": owner.auth_version})
            response = await client.get(
                f"/api/v1/users/{owner.id}/avatar", headers={"Authorization": f"Bearer {token}"}
            )
            assert response.status_code == 404
