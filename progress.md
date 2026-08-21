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

**Phase C — Shared WebSocket infrastructure (complete)**
- `backend/app/core/redis_client.py`: lazy async Redis singleton (`get_redis()`), separate from Celery's broker/backend Redis DBs.
- `backend/app/core/ws_manager.py`: `ConnectionManager` (per-process channel→sockets registry), `publish()` (Redis-only, no direct local broadcast — avoids double delivery since `redis_listener()` re-broadcasts everything it receives, including same-process publishes), `redis_listener()` (subscribes to `ws:*`, retries with exponential backoff up to 30s on connection loss instead of dying).
- `backend/app/api/ws/deps.py`: `authenticate_ws(token, db)` — decodes JWT via existing `decode_token`, loads user via `UserRepository`, checks `auth_version` + `is_active`; raises `WSAuthError` for the caller to turn into a `4401` close.
- `backend/app/api/ws/router.py`: empty `ws_router` aggregator — Phase D (chat) and Phase E (notifications) will register their websocket routes into it.
- `backend/app/main.py`: starts `redis_listener()` as a background task in `lifespan` (cancelled cleanly on shutdown), mounts `ws_router` at app root `/ws` (matches existing `NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws` in docker-compose/frontend env).
- New test: `test_ws_manager.py` (5 tests — connect/disconnect/broadcast/failed-send-drops-connection). Note: had to use a plain class instead of `SimpleNamespace` for the fake WebSocket, since `SimpleNamespace` defines `__eq__` without `__hash__` and is therefore unhashable — can't go in a `set()` the way `ConnectionManager` stores connections.
- Full suite: 83/83 passing. Verified `app.main` imports cleanly with the new wiring.

**Phase D — Chat feature (complete, pending live manual verification)**
- Backend: `ChatMessage`/`ChatReadState` models (mirrors `Comment`'s CASCADE convention), migration `20260821_chat_tables` (chained after Phase B's), `chat_service.py` (history cursor-paginated via `before_id`, create_message persists + publish()es, unread_count/mark_read via `ChatReadState`), REST endpoints under `/projects/{id}/messages|unread-count|read`, WS endpoint `/ws/chat/{project_id}?token=...` (checks membership before `accept()`, routes through the same `ChatService.create_message()` as REST).
- Discovered + fixed a real inconsistency: `docker-compose.yml` had `NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws` while `.env.local`/`.env.example` had the bare origin `ws://localhost:8000` — standardized on bare origin everywhere, frontend code always appends `/ws/...`.
- Frontend: `features/chat/{types,services,hooks,components}` following the `features/notifications/` colocated pattern — `useChatSocket` (native WebSocket, reconnect w/ backoff via new shared `lib/ws-client.ts`, exposes `isConnected` so the composer falls back to REST `postMessage` if the socket isn't up yet), `useChat` (React Query: `useChatHistory` via `useInfiniteQuery`, `useChatUnreadCount`, `usePostChatMessage`, `useMarkChatRead`), `ChatPanel`/`ChatMessageItem` components. New route `/projects/[id]/chat`, "Chat" nav tab with unread badge added to the project layout.
- Bug caught by ESLint (not by tsc): `useChatUnreadCount(id)` was called after two early `return` statements in the project layout — violates React's rules-of-hooks. Fixed by moving the hook call above the early returns.
- Backend tests: `test_chat_service.py` (7 tests) — required fixing two test-authoring mistakes: (1) `db.scalars` mock needs `.all()` on its result, a bare list doesn't work; (2) `flush()` was mocked as a no-op, so it never populated the ORM object's `id`/`created_at` the way a real Postgres flush does via INSERT...RETURNING — had to make the mock simulate that.
- Full backend suite: 90/90 passing. Frontend: `tsc --noEmit` clean, `next lint` clean (whole repo, 0 warnings/errors).
- Deferred: live 2-browser-session manual verification — needs `docker compose up`; will do a combined pass after Phase E lands too.

**Phase E — Real-time notification push over WebSocket (complete, pending live manual verification)**
- Backend: `api/ws/notifications.py` — `/ws/notifications?token=...`, user-scoped channel `notif:user:{id}`, registered in `api/ws/router.py`.
- Hooked `publish()` into the single choke point `NotificationService.push()` — now does `db.add()` then `await db.flush()` (to get server-generated `id`/`created_at` for the payload) then `publish()`. Audited both existing call sites (`task_service.py` create/reassignment) — safe, no caller depended on `push()` staying flush-free.
- Frontend: `useNotificationSocket()` added to `features/notifications/hooks/useNotifications.ts` (opens one WS per session, increments the unread-count cache + invalidates the list on every push), wired into `(dashboard)/layout.tsx` — had to place the hook call **before** the layout's early `return <FullPageSpinner />` (same rules-of-hooks lesson as Phase D). `useUnreadCount`'s poll relaxed from 30s to 120s now that WS is the primary channel (poll kept only as a safety net for reconnect gaps/backgrounded tabs).
- New test: `test_notification_service.py` (2 tests) — one verifies `push()` persists + calls `publish()` with the right channel/payload; the other documents a contract: `push()` does NOT shield callers from a `publish()` exception, so `ws_manager.publish()`'s own internal soft-fail (catch-all + log) is what actually protects notification creation from a Redis outage.
- Verified: both `/ws/chat/{project_id}` and `/ws/notifications` routes registered on the running app; full backend suite 92/92; frontend `tsc --noEmit` and `next lint` both clean.
- Deferred: live 2-session manual verification (needs `docker compose up` — postgres/redis/backend/celery worker/celery beat all running). This is the one remaining unchecked box across Phases B/D/E; recommend doing it as a single combined pass once the user has the stack running locally.

### Now starting Phase F (wrap-up).

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| Global `python` on PATH has no project deps (fastapi/sqlalchemy not found) | 1 | Found `backend/.venv`; run tests via `./.venv/Scripts/python.exe -m pytest` instead |
