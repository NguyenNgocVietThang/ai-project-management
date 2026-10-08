import asyncio
import base64
import json
from datetime import timedelta
from io import BytesIO
from typing import Annotated
from urllib.parse import parse_qs, quote, urlsplit

import httpx
import urllib3
from fastapi import Depends
from minio import Minio
from minio.error import S3Error
from urllib3.util import Retry, Timeout

from app.core.config import settings


class StorageError(RuntimeError):
    """Sanitized storage failure suitable for application logs."""


class StorageNotFoundError(StorageError):
    pass


class StorageService:
    """Private Supabase REST storage, with the existing local MinIO adapter."""

    def __init__(
        self, client: Minio | None = None, *, http_client: httpx.AsyncClient | None = None
    ):
        self.provider = settings.STORAGE_PROVIDER
        self.http_client = http_client
        if self.provider == "supabase":
            parsed = urlsplit(settings.SUPABASE_URL)
            if (
                parsed.scheme != "https"
                or not parsed.netloc
                or parsed.username
                or parsed.password
                or parsed.query
                or parsed.fragment
                or parsed.path not in {"", "/"}
            ):
                raise StorageError("Supabase HTTPS project URL configuration is required")
            self.base_url = settings.SUPABASE_URL.rstrip("/") + "/storage/v1"
            key = settings.SUPABASE_SERVICE_ROLE_KEY
            # New secret keys are opaque; legacy keys must claim service_role.
            # Supabase performs the actual signature verification.
            server_key = key.startswith("sb_secret_") and len(key) > len("sb_secret_")
            if not server_key:
                try:
                    encoded = key.split(".")[1]
                    claims = json.loads(
                        base64.urlsafe_b64decode(encoded + "=" * (-len(encoded) % 4))
                    )
                    server_key = claims.get("role") == "service_role"
                except (ValueError, IndexError, AttributeError):
                    server_key = False
            if not server_key:
                raise StorageError("Supabase server-only service role/secret key is required")
            self.headers = {"Authorization": f"Bearer {key}", "apikey": key}
            self.bucket = settings.SUPABASE_STORAGE_BUCKET
            if not self.bucket or any(
                char not in "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_"
                for char in self.bucket
            ):
                raise StorageError("Invalid Supabase bucket configuration")
            self.client = None
        elif self.provider == "minio":
            self.client = client or Minio(
                settings.MINIO_ENDPOINT,
                access_key=settings.MINIO_ACCESS_KEY,
                secret_key=settings.MINIO_SECRET_KEY,
                secure=settings.MINIO_USE_SSL,
                http_client=urllib3.PoolManager(
                    timeout=Timeout(connect=3.0, read=10.0),
                    retries=Retry(total=1, backoff_factor=0.2),
                ),
            )
            self.bucket = settings.MINIO_BUCKET
        else:
            raise StorageError("Unsupported storage provider configuration")

    @staticmethod
    def _key(key: str) -> str:
        if (
            not key
            or "\\" in key
            or any(part in {"", ".", ".."} for part in key.split("/"))
            or any(ord(char) < 32 for char in key)
        ):
            raise ValueError("Invalid storage object key")
        return quote(key, safe="/")

    async def _request(self, method: str, path: str, **kwargs) -> httpx.Response:
        headers = {**self.headers, **kwargs.pop("headers", {})}
        try:
            if self.http_client is not None:
                return await self.http_client.request(
                    method,
                    self.base_url + path,
                    headers=headers,
                    timeout=settings.STORAGE_HTTP_TIMEOUT_SECONDS,
                    follow_redirects=False,
                    **kwargs,
                )
            async with httpx.AsyncClient(timeout=settings.STORAGE_HTTP_TIMEOUT_SECONDS) as client:
                return await client.request(
                    method, self.base_url + path, headers=headers, follow_redirects=False, **kwargs
                )
        except httpx.HTTPError:
            raise StorageError("Supabase storage connection failed") from None

    @staticmethod
    def _status(response: httpx.Response) -> int:
        # Storage wraps some 404/409 errors in HTTP 400 with statusCode.
        if response.status_code == 400:
            try:
                code = int(response.json().get("statusCode", 400))
                return code if code in {404, 409} else 400
            except (ValueError, TypeError, AttributeError):
                pass
        return response.status_code

    @classmethod
    def _check(cls, response: httpx.Response) -> None:
        if cls._status(response) == 404:
            raise StorageNotFoundError("Storage object or bucket was not found")
        if not response.is_success:
            raise StorageError(f"Supabase storage operation failed (HTTP {response.status_code})")

    @staticmethod
    def _json(response: httpx.Response) -> dict:
        try:
            payload = response.json()
            if isinstance(payload, dict):
                return payload
        except ValueError:
            pass
        raise StorageError("Supabase storage returned an invalid acknowledgement")

    def _ensure_bucket(self) -> None:
        if not self.client.bucket_exists(self.bucket):
            try:
                self.client.make_bucket(self.bucket)
            except S3Error as exc:
                if exc.code not in {"BucketAlreadyExists", "BucketAlreadyOwnedByYou"}:
                    raise

    async def initialize_bucket(self) -> None:
        """Create a missing private bucket, or reject an existing public bucket."""
        if self.provider == "minio":
            await asyncio.to_thread(self._ensure_bucket)
            return
        response = await self._request("GET", f"/bucket/{self.bucket}")
        if self._status(response) == 404:
            created = await self._request(
                "POST",
                "/bucket",
                json={
                    "id": self.bucket,
                    "name": self.bucket,
                    "public": False,
                },
            )
            if self._status(created) != 409:
                self._check(created)
            response = await self._request("GET", f"/bucket/{self.bucket}")
        self._check(response)
        if self._json(response).get("public") is not False:
            raise StorageError("Supabase storage bucket must be private")

    async def put_bytes(self, key: str, data: bytes, content_type: str) -> None:
        path = self._key(key)
        if self.provider == "supabase":
            await self.initialize_bucket()
            response = await self._request(
                "POST",
                f"/object/{self.bucket}/{path}",
                content=data,
                headers={"Content-Type": content_type, "x-upsert": "false"},
            )
            self._check(response)
            return

        def _put() -> None:
            self._ensure_bucket()
            self.client.put_object(
                self.bucket, key, BytesIO(data), length=len(data), content_type=content_type
            )

        await asyncio.to_thread(_put)

    async def get_bytes(self, key: str) -> tuple[bytes, str]:
        path = self._key(key)
        if self.provider == "supabase":
            await self.initialize_bucket()
            response = await self._request("GET", f"/object/{self.bucket}/{path}")
            self._check(response)
            return response.content, response.headers.get(
                "Content-Type", "application/octet-stream"
            )

        def _get() -> tuple[bytes, str]:
            response = self.client.get_object(self.bucket, key)
            try:
                return response.read(), response.headers.get(
                    "Content-Type", "application/octet-stream"
                )
            finally:
                response.close()
                response.release_conn()

        return await asyncio.to_thread(_get)

    async def delete(self, key: str) -> None:
        self._key(key)
        if self.provider == "supabase":
            await self.initialize_bucket()
            response = await self._request(
                "DELETE", f"/object/{self.bucket}", json={"prefixes": [key]}
            )
            self._check(response)
            return
        await asyncio.to_thread(self.client.remove_object, self.bucket, key)

    async def signed_url(self, key: str, *, expires_seconds: int | None = None) -> str:
        """Call only after authorization. URLs are bearer capabilities until expiry."""
        path = self._key(key)
        ttl = (
            settings.STORAGE_SIGNED_URL_TTL_SECONDS if expires_seconds is None else expires_seconds
        )
        if isinstance(ttl, bool) or not isinstance(ttl, int) or not 1 <= ttl <= 600:
            raise ValueError("Storage signed URL lifetime must be between 1 and 600 seconds")
        if self.provider == "minio":
            return await asyncio.to_thread(
                self.client.presigned_get_object, self.bucket, key, expires=timedelta(seconds=ttl)
            )
        await self.initialize_bucket()
        response = await self._request(
            "POST", f"/object/sign/{self.bucket}/{path}", json={"expiresIn": ttl}
        )
        self._check(response)
        signed = self._json(response).get("signedURL")
        if not isinstance(signed, str) or not signed.startswith(f"/object/sign/{self.bucket}/"):
            raise StorageError("Supabase storage returned an invalid signed URL")
        parsed = urlsplit(signed)
        if (
            parsed.scheme
            or parsed.netloc
            or parsed.fragment
            or parsed.path != f"/object/sign/{self.bucket}/{path}"
            or not parse_qs(parsed.query).get("token")
        ):
            raise StorageError("Supabase storage returned an invalid signed URL")
        return self.base_url + signed


def get_storage_service() -> StorageService:
    return StorageService()


StorageServiceDep = Annotated[StorageService, Depends(get_storage_service)]
