# Backend local verification — 2026-10-09

The complete backend suite passed on Windows with Python 3.12 from `backend/.venv` and an isolated PostgreSQL 16.14 cluster at localhost port 55439: **416 passed, 2 skipped, 2 warnings in 61.04 seconds**. There were no failed tests or setup errors in the final run.

```powershell
Set-Location backend
$env:TEST_POSTGRES_URL='postgresql+asyncpg://jobs_test@127.0.0.1:55439/postgres'
$env:SECURITY_TEST_DATABASE_URL=$env:TEST_POSTGRES_URL
.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider
```

Both environment variables are necessary: jobs tests read `TEST_POSTGRES_URL`, and durable authentication tests read `SECURITY_TEST_DATABASE_URL`. PostgreSQL tests create a separate schema per test and remove it afterward. The two skips are the SQLite variants of actual simultaneous refresh transactions and separate connection-pool saturation; their PostgreSQL variants passed. Warnings are the existing `python_multipart` import deprecation and the existing custom pytest event-loop fixture deprecation. Test doubles now use `AsyncSession` specifications where synchronous `add()` previously produced unawaited coroutine warnings.

## Contracts exercised

- Concurrent durable-job deduplication and `SKIP LOCKED` claims, stale-worker fencing, and reclaim after an actual worker subprocess exits abruptly.
- Durable access/refresh revocation with Redis unavailable; eight concurrent real `AuthService.refresh` calls issue one token pair and reject seven replays. OAuth browser binding, exchange codes and WebSocket tickets remain single use. Rate-limit counters survive store recreation, simultaneous increments preserve every count, and database errors block authorization rather than bypass it.
- With all four application connections occupied, a separate bounded security pool of one connection completes a refresh claim and rate-limit increment within five seconds. The test also checks the configured security pool size and zero overflow.
- Eight independent PostgreSQL AI quota reservations against a daily cap of two produce exactly two accepted reservations, six `ai_quota_exceeded` failures and a persisted counter of two. SQLite integration tests additionally cover transaction rollback, retries, Vietnam midnight, known provider rejections, client cleanup and staged-result reuse.
- Completed AI output checks current project access: a removed member receives 403, a deleted project returns 404, and the resumable job list omits both. The same user could read the completed output before access changed.
- CPM task and dependency limits stop execution before calculation, persist `failed/resource_limit_exceeded` after one attempt, and expose that status through the authenticated job endpoint. The existing real 301-task coalescing/latest-schedule test still passes; small-project synchronous scheduling remains covered.
- Complete production Free-profile settings accept local mock credentials without contacting providers and reject missing security, TLS, runner, email, storage, cron and AI requirements.

Ruff passed for the changed verification tests:

```powershell
.venv/Scripts/python.exe -m ruff check tests/integration/test_durable_jobs_postgres.py tests/integration/test_durable_ai_flow.py tests/unit/test_ai_service.py tests/unit/test_access_token_revocation.py tests/unit/test_auth_password_recovery.py tests/unit/test_login_lockout.py tests/unit/test_security_state.py tests/unit/test_cpm_scheduling.py tests/unit/test_production_config.py
```

## Database and Supabase SQL checks

The complete Alembic chain was upgraded from an empty disposable PostgreSQL database to `20261008_security_state` (head), downgraded to `20261008_drop_facebook_login`, then upgraded to head again. All commands succeeded; the disposable database was removed. Jobs and security-state migration tests also exercised upgrade/downgrade and checked RLS.

`supabase/private-data.sql` and `supabase/setup-cron.sql` were executed in another newly created disposable local database. A private probe table had RLS enabled and returned zero rows to a non-owner role even after SELECT was granted. Cron definitions produced exactly `0,2,5 1 * * *` and `30,32,35 1 * * *`. The security-definer enqueue function executed with local Vault/net/cron stub objects, recorded one request ID, denied PUBLIC execution, and rejected missing Vault configuration. The net stub performed no HTTP request. Its database and temporary reader role were removed.

These SQL checks establish local SQL syntax, function behavior and permission rules. They do not validate Supabase's real Vault, pg_net, pg_cron, HTTP delivery or extension ownership.

## Remaining deployment evidence

No cloud account, provider key, paid request, real recipient email, external HTTP call, push or commit was used for this verification. Actual Render/Supabase deployment, Linux memory/load behavior, private Storage compatibility, email delivery, provider quota, cold starts, Redis pub/sub reconnect and Cron HTTP delivery still require deployment acceptance. Local tests do not mark those cloud checks complete.

An initial run produced four PostgreSQL setup errors because the known ephemeral cluster had stopped, and skipped PostgreSQL security cases because their separate variable was unset. The cluster was restarted and both variables supplied before the final successful suite; that initial result is superseded by the result above.
