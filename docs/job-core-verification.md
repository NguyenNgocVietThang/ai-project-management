# Durable jobs verification

Verified locally on Windows on 2026-10-08, using backend/.venv Python 3.12 and an isolated PostgreSQL 16 cluster on localhost. No existing database or paid provider was used.

## Implemented contract

- `enqueue(db, kind, payload, dedupe_key, ...)` atomically inserts or returns the existing job and never commits. Business rows and their outbox survive or roll back together. PostgreSQL and SQLite use native conflict handling.
- Claim transactions lock a bounded ready batch with `FOR UPDATE SKIP LOCKED`, issue a fresh lease token, persist the claimed generation, and increment attempts. Completion, checkpoints and dispatch intent require the current unexpired token and business TTL.
- `JobRunner` executes handlers with configurable concurrency, timeout, polling and shutdown bounds. Provider calls happen outside the completion transaction. `JobResult.apply(db, owned_job)` writes business results together with the successful job transition under the fenced row lock.
- Recovery has bounded attempts and exponential backoff. Unknown provider outcomes after dispatch fail as `external_outcome_unknown`; a stored provider result remains available for safe finalization on a remaining attempt. Exhausted jobs remain failed for review and do not invoke the provider again.
- CPM requests coalesce by project and increment a generation. An obsolete generation never applies its result. A later edit receives a fresh attempt budget even if the old running generation fails or loses its lease.
- Provider errors and database errors persist only allowlisted codes. SQL parameters, exception text, tokens and provider response bodies are not logged. Transient DBAPI errors retry within the attempt budget.
- PostgreSQL enables RLS on `jobs` and revokes table/sequence access from PUBLIC and existing Supabase anon/authenticated/service_role roles. The backend connection must own this table or use an explicitly privileged backend role; browser Data APIs must not access outbox payloads.

## Evidence

Core suite: **17 passed**, including four real PostgreSQL tests. The remaining behavioral tests use SQLite and do not establish PostgreSQL locking behavior.

```powershell
$env:TEST_POSTGRES_URL='postgresql+asyncpg://jobs_test@127.0.0.1:55439/postgres'
.venv/Scripts/python.exe -m pytest tests/unit/test_durable_jobs.py tests/integration/test_durable_jobs_postgres.py -q -p no:cacheprovider
```

The PostgreSQL tests establish concurrent unique deduplication, competing claims while one transaction holds a lock, stale-worker fencing after recovery, and reclaim after a worker process abruptly exits with `os._exit(23)`. Migration tests run upgrade/downgrade/upgrade and verify that a non-owner role granted SELECT still sees zero rows because no RLS policy exposes private jobs.

The complete real Alembic chain succeeded from an empty disposable database through `20261008_durable_jobs`. CLI downgrade to `20261008_drop_facebook_login` and upgrade to `20261008_durable_jobs` also succeeded after the RLS changes.

CPM and audit regression suites: **25 passed**. These now assert durable enqueue rather than Celery publication. A real 301-task SQLite project queues once, coalesces a changed 16-hour task, runs through the real CPM handler, and publishes the correct two-day result and final project progress. A small real project still computes synchronously without an outbox job. The broker-outage regression confirms AI enqueue never calls Celery and the durable request survives commit.

```powershell
.venv/Scripts/python.exe -m pytest tests/unit/test_cpm_scheduling.py tests/integration/test_audit_regressions.py -q -p no:cacheprovider
```

Ruff passed for the model, service, runner, migration and all changed test files. Existing warnings concern python-multipart's import name and the shared pytest event-loop fixture; no new warning was introduced.

## Operational limits

The runner needs a live backend and database. Sleeping web services pause execution; startup recovers eligible work. Lease fencing protects database results, but external providers still need their own idempotency support. Persisting dispatch intent before an external request can conservatively report an unknown outcome after a crash even when the provider never received it.

CPM completion locks the job before task writes; a concurrent editor may hold task locks before enqueueing that job. PostgreSQL can abort one transaction as a deadlock victim. Runner DBAPI failures retry within bounds; caller transactions must also handle a database rollback safely. Using a consistent job-before-task lock order would avoid this contention in high-concurrency workloads.

Async task timeouts are cooperative: handlers must avoid blocking the event loop. Shutdown waits its configured drain interval, cancels outstanding work, and permits up to one additional second per cancellation phase. A cancelled running job remains durable for lease recovery.

The test cluster is an ephemeral local artifact under `tasks/.postgres-test/`; it is not a deployment dependency. `TEST_POSTGRES_URL` is optional for ordinary test runs; absent PostgreSQL tests explicitly skip rather than claim SQLite proves lock correctness. In deployment CI, supply a disposable PostgreSQL URL so these tests run.
