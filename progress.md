# Progress Log

## Session 1 — 2026-08-21

### Planning
- Explored backend + frontend architecture via 2 parallel Explore agents.
- Discovered admin/RBAC feature already essentially complete (uncommitted working tree).
- Discovered notification infra (model/enum/service/REST) exists but only "task assigned" trigger wired; no scheduler; no real-time push.
- Discovered zero WebSocket/real-time infra anywhere in the app.
- Designed detailed 6-phase implementation plan via Plan agent, refined with user Q&A (chat scope, transport, notification audience, enum reuse, permission-check scope, due-soon threshold).
- Plan approved by user. Plan file: `C:\Users\VIET THANG\.claude\plans\t-i-mu-n-ti-p-t-c-soft-prism.md`.
- Created task_plan.md / findings.md / progress.md at project root.

### Implementation

**Phase A — Admin review & commit (complete)**
- Ran 16 existing admin/audit unit tests — all passed, no changes needed.
- Spot-checked endpoint guards on users/roles/permissions/audit_timeline — all correct.
- Asked user about unrelated uncommitted files (.mcp.json, .claude/launch.json, minor CORS/authStore/auth-layout tweaks); user chose to commit everything together.
- Committed as `742e23a` — 52 files, admin panel + pre-existing local config.

**Phase B — Notification triggers + Celery Beat (complete)**
- Added `notify_project_team()` to `backend/app/services/phase2_common.py` (fan-out via `project_members`, `exclude_user_ids` support).
- Hooked it into `backend/app/services/task_service.py`: `update()` now detects changes to `SIGNIFICANT_TASK_FIELDS` (status/start_date/due_date/priority/assignee_id) and notifies the team (excluding actor + newly-reassigned assignee who got a dedicated push); `change_status()` notifies the team on every status transition.
- `due_date` change inside `update()` clears `last_due_soon_notified_at` so a rescheduled task can re-trigger the "due soon" sweep.
- Added `last_start_notified_at` / `last_due_soon_notified_at` nullable DateTime columns to `Task` model (`backend/app/models/task.py`).
- New migration `20260821_task_notify_columns.py` chained after `20260814_phase2_task_wbs` — verified single head via `alembic heads`.
- New `backend/app/workers/notification_tasks.py`: `sweep_task_dates(db)` (testable, injectable session) + Celery task wrapper `sweep_task_dates_task`. Finds tasks starting today (status TODO, not yet notified) and tasks due in `DUE_SOON_DAYS_AHEAD=1` days (not DONE, not yet notified), fires `notify_project_team`, stamps idempotency columns.
- Registered task module + added `beat_schedule` (`sweep-task-dates-daily`, `crontab(hour=8, minute=0)`, Asia/Ho_Chi_Minh) in `celery_app.py`.
- Added `celery-beat` service to `docker-compose.yml` (separate long-running process from `celery-worker`).
- New tests: `test_notification_triggers.py` (6 tests: fan-out exclusion, task update fires/skips team notify, due-soon flag reset, status-change fires/skips) + `test_notification_tasks.py` (2 tests: sweep fires + stamps, sweep no-ops when nothing matches). Full suite: 78/78 passing.
- Verified: `alembic heads` shows single head; model columns registered; celery beat_schedule wired; no circular imports.
- Deferred: live manual verification (needs `docker compose up` with Postgres/Redis/Celery running) — not blocking, will do a combined manual pass after Phase D/E are also in place.

### Now starting Phase C (shared WebSocket infrastructure).

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| Global `python` on PATH has no project deps (fastapi/sqlalchemy not found) | 1 | Found `backend/.venv`; run tests via `./.venv/Scripts/python.exe -m pytest` instead |
