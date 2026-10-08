# Email and private storage adapters

Implementation date: 2026-10-08. No Resend or Supabase account, verified sender, or real cloud credentials were supplied. All provider calls below are mocked; this document does **not** certify delivery, cloud persistence, signed URL expiry enforcement by Supabase, or provider quota availability.

## Email setup

Set these only on the backend:

```dotenv
EMAIL_PROVIDER=resend
RESEND_API_KEY=<server-only Resend API key>
EMAIL_FROM=<verified sender address>
EMAIL_FROM_NAME=AI Project Management
EMAIL_HTTP_TIMEOUT_SECONDS=15
```

The adapter posts HTML rendered from the existing local templates to `https://api.resend.com/emails`. It sends only sender, recipient, subject, and rendered HTML. Jinja escapes user-supplied project/inviter names. Missing credentials, the shipped placeholder sender, unsupported providers, provider rejection, and transport failure raise explicit sanitized errors. No automatic fallback silently disables email. A successful API response means acceptance by Resend, not inbox delivery.

`send_password_reset_email`, `send_email_verification_email`, and `send_project_invitation_email` accept keyword-only `idempotency_key`. Durable jobs should supply their stable opaque job/delivery ID and reuse it across retries. The legacy fallback hashes the complete payload. Resend retains idempotency keys for **24 hours**; jobs must stop automatic retries before that window ends, and an uncertain delivery older than the window needs manual reconciliation. Changing sender, templates, or payload under the same key can yield a non-retryable conflict. `EmailDeliveryError.retryable` distinguishes connection failures, throttling, server failures, and concurrent duplicate requests from authentication/validation/payload conflicts. Adapter calls do not implement their own retry loop; the durable runner owns the bounded retry policy.

`EMAIL_PROVIDER=smtp` retains the existing FastAPI Mail path only for `APP_ENV=development`; configure existing `SMTP_*` values explicitly. SMTP has no provider idempotency guarantee. Do not select SMTP on Render Free.

Official references: [send API and key expiry](https://resend.com/docs/api-reference/emails/send-email), [idempotency behavior](https://resend.com/docs/dashboard/emails/idempotency-keys). A verified sender and recipient/quota behavior still need live verification in the chosen account.

## Supabase Storage setup

```dotenv
STORAGE_PROVIDER=supabase
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<server-only service_role JWT or sb_secret key>
SUPABASE_STORAGE_BUCKET=ai-project-files
STORAGE_SIGNED_URL_TTL_SECONDS=300
STORAGE_HTTP_TIMEOUT_SECONDS=15
```

Keep these credentials in backend environment variables; never set `NEXT_PUBLIC_*` equivalents or put them in browser bundles. The adapter rejects anon/publishable keys and requires HTTPS project-origin configuration. The local check of a legacy JWT's role is only a credential-type guard; Supabase authenticates the actual key/signature.

The REST adapter avoids depending on MinIO SDK support for the Supabase S3 endpoint's path prefix. S3 compatibility was not measured without a cloud project, so no S3 interoperability claim is made. Existing MinIO behavior remains available with `STORAGE_PROVIDER=minio` for local development.

`StorageService.initialize_bucket()` explicitly creates a missing bucket with `public=false` and verifies the returned bucket metadata. Upload, download, delete, and signing recheck that the bucket is private before accessing objects; an existing public bucket fails instead of being silently modified. Concurrent private-bucket creation handles the conflict and verifies the winner's metadata. Backend service-role access bypasses Storage RLS, so every application route must authorize before calling the adapter. Do not add public RLS grants for this backend-only flow.

`put_bytes`, `get_bytes`, and `delete` preserve the service interface. `signed_url` is available for authorized future download flows, with a configured default of 300 seconds and hard bounds of 1–600 seconds. Returned links must point to the exact requested object on the configured Supabase storage origin and contain a token. A signed URL is a bearer capability until provider-enforced expiry; do not log or persist it, and obtain a fresh URL after rechecking access when it expires. There is currently no application route exposing arbitrary object signing.

Official references: [Storage access control and service keys](https://supabase.com/docs/guides/storage/security/access-control), [SDK REST request paths](https://github.com/supabase/storage-js/blob/master/src/packages/StorageFileApi.ts), [private bucket creation](https://github.com/supabase/storage/blob/master/src/http/routes/bucket/createBucket.ts).

## Existing file flow and scope

The only implemented object flow is avatar upload/download/delete. Its API uses `StorageService`, so selecting Supabase switches its backend without changing frontend URLs or CSP. Uploads remain limited to 5 MiB, validated JPEG/PNG/WebP inputs, and normalized 512×512 WebP output. Object paths are derived from the authenticated current user's ID, not supplied by clients. Avatar GET still executes the existing media authentication dependency; responses now use `Cache-Control: private, no-store` to prevent authenticated images being retained in shared caches. An absent Supabase object maps to application 404, and provider failures remain explicit 503 responses.

Authenticated users can view other active users' avatars, as before. They cannot mutate another user's avatar: the mutation endpoint is `/users/me/avatar`. General project document upload, parsing, and report object download are unimplemented stubs elsewhere in the repository; this adapter does not mount or claim those features. Project permissions were not replaced or bypassed.

## Local verification

Run from `backend` using the existing virtual environment:

```powershell
.venv/Scripts/python.exe -m pytest tests/unit/test_cloud_adapters.py tests/integration/test_private_storage_access.py tests/unit/test_password_reset_email.py tests/unit/test_email_verification_email.py tests/unit/test_user_profile_settings.py -q -p no:cacheprovider
.venv/Scripts/python.exe -m ruff check app/utils/email.py app/services/storage_service.py app/services/user_service.py app/api/v1/endpoints/users.py tests/unit/test_cloud_adapters.py tests/integration/test_private_storage_access.py --no-cache
```

Recorded result: **49 passed**, with two pre-existing multipart/pytest-asyncio deprecation warnings; focused Ruff checks passed. These results include the existing SMTP and profile regression tests.

Tests cover mocked HTTPS email acceptance, stable keys across retries/timeouts, escaped templates, credential failures, 429/5xx and permanent failures, sanitized error text/traceback causes, private bucket initialization, upload/download/delete/sign requests, bounded signing TTL, exact-object URL binding, invalid browser credentials, unsafe object paths, not-found mapping, and MinIO response cleanup. ASGI tests use the real app, SQLite records, dependency injection, media token validation, and image processing; they verify anonymous denial before object reads, user-owned upload paths, size limits, backend download, and missing-object behavior. Only provider HTTPS and Redis revocation are mocked at those boundaries.

Live acceptance still requires: verified sender and email received, quota/rejection behavior, actual Supabase private object upload/download/delete, anonymous Storage URL denial, signed download rejection after TTL, and object survival after backend restart. Existing objects in a local MinIO bucket are not copied automatically; transfer them privately preserving DB object keys before switching a populated installation, or re-upload avatars. Keep cloud acceptance items incomplete until measured.
