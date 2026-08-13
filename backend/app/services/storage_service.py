import asyncio
from io import BytesIO
from typing import Annotated, Optional, Tuple

import urllib3
from fastapi import Depends
from minio import Minio
from minio.error import S3Error
from urllib3.util import Retry, Timeout

from app.core.config import settings


class StorageService:
    """Small async wrapper around the synchronous MinIO client."""

    def __init__(self, client: Optional[Minio] = None):
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

    def _ensure_bucket(self) -> None:
        if not self.client.bucket_exists(self.bucket):
            try:
                self.client.make_bucket(self.bucket)
            except S3Error as exc:
                if exc.code not in {"BucketAlreadyExists", "BucketAlreadyOwnedByYou"}:
                    raise

    async def put_bytes(self, key: str, data: bytes, content_type: str) -> None:
        def _put() -> None:
            self._ensure_bucket()
            self.client.put_object(
                self.bucket,
                key,
                BytesIO(data),
                length=len(data),
                content_type=content_type,
            )

        await asyncio.to_thread(_put)

    async def get_bytes(self, key: str) -> Tuple[bytes, str]:
        def _get() -> Tuple[bytes, str]:
            response = self.client.get_object(self.bucket, key)
            try:
                content_type = response.headers.get(
                    "Content-Type",
                    "application/octet-stream",
                )
                return response.read(), content_type
            finally:
                response.close()
                response.release_conn()

        return await asyncio.to_thread(_get)

    async def delete(self, key: str) -> None:
        await asyncio.to_thread(self.client.remove_object, self.bucket, key)


def get_storage_service() -> StorageService:
    return StorageService()


StorageServiceDep = Annotated[StorageService, Depends(get_storage_service)]
