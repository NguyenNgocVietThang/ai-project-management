# Task Plan: Chat, Notification Triggers & Admin Review

## Goal
Ship three features on top of the existing FastAPI + Next.js app:
1. Review & commit the already-built Admin (users/roles/permissions/audit) feature.
2. Extend the existing Notification system with real triggers (task start, due-soon, field changes) fanned out to the whole project team, via a Celery Beat scheduled sweep.
3. Build a project-scoped real-time Chat feature over a new shared WebSocket + Redis pub/sub infrastructure, and reuse that infra to push notifications in real time too.

Full approved plan: `C:\Users\VIET THANG\.claude\plans\t-i-mu-n-ti-p-t-c-soft-prism.md`

## Confirmed decisions (from user Q&A)
- Chat scope: project-scoped channel (one per Project, open to `project_members`).
- Chat transport: real-time WebSocket (native FastAPI WebSocket + Redis pub/sub, no socket.io).
- Notification audience: ALL project team members (project_members), excluding the actor.
- Notification type for "task starting"/"task changed": reuse existing `SYSTEM` enum value (no new enum values, no enum migration).
- Frontend granular `hasPermission()`: SKIPPED for this round — keep `isAdminUser()` only.
- Due-soon threshold: 1 day before `due_date`, swept once daily at 08:00 via Celery Beat.
- Admin feature: review & polish existing uncommitted work, do not rebuild; commit as its own checkpoint before other phases.

## Phases

### Phase A — Admin review & commit checkpoint
**Status:** complete
- [x] Run existing admin/audit unit tests, confirm pass — 16/16 passed
- [x] Spot-check endpoint guards (require_permissions/require_roles) on users/roles/permissions/audit_timeline — all correct
- [x] Confirm with user which unrelated modified files (.mcp.json, .claude/launch.json) to include/exclude from commit — user chose to commit everything together
- [x] Commit admin-related backend + frontend files as one logical unit — commit `742e23a`

### Phase B — Notification triggers + Celery Beat
**Status:** complete
- [x] Add `notify_project_team()` fan-out helper to `phase2_common.py`
- [x] Hook task field-change + status-change notifications into `task_service.py` (update() + change_status())
- [x] Add `last_start_notified_at` / `last_due_soon_notified_at` columns to `Task` model
- [x] New Alembic migration for the two columns (down_revision = 20260814_phase2_task_wbs) — verified single head via `alembic heads`
- [x] New `notification_tasks.py` Celery task (sweep) + beat_schedule in `celery_app.py` (daily 08:00 Asia/Ho_Chi_Minh)
- [x] Add `celery-beat` service to docker-compose.yml
- [x] Tests: test_notification_triggers.py (6 tests), test_notification_tasks.py (2 tests) — all passing
- [ ] Manual verification (deferred — needs docker compose + live DB; not blocking further phases)

### Phase C — Shared WebSocket infrastructure
**Status:** complete
- [x] `core/redis_client.py` — async Redis singleton
- [x] `core/ws_manager.py` — ConnectionManager + publish() + redis_listener() (with retry/backoff on Redis outage)
- [x] `api/ws/deps.py` — authenticate_ws() (raises WSAuthError, caller closes with code 4401)
- [x] Wire redis_listener() into main.py lifespan; mount empty `ws_router` (from api/ws/router.py) at app root `/ws` — Phase D/E will register their sub-routers into it
- [x] Test: test_ws_manager.py (5 tests, all passing)

### Phase D — Chat feature
**Status:** complete (pending live manual verification)
- [x] Models: ChatMessage, ChatReadState + register in db/base.py
- [x] Migration for chat_messages / chat_read_states (chained after Phase B migration) — verified single alembic head
- [x] Schemas: chat.py
- [x] Service: chat_service.py (history/create_message/unread_count/mark_read, all gated by get_project_context)
- [x] REST endpoints: api/v1/endpoints/chat.py + router registration
- [x] WebSocket endpoint: api/ws/chat.py (registered in api/ws/router.py)
- [x] Frontend: features/chat/{types,services,hooks,components} (ChatPanel, ChatMessageItem, useChatSocket, useChat), new /projects/[id]/chat page, "Chat" nav tab with unread badge in project layout
- [x] Shared `lib/ws-client.ts` reconnecting-WebSocket helper (also used by Phase E)
- [x] Fixed docker-compose.yml/frontend env NEXT_PUBLIC_WS_URL inconsistency (bare origin everywhere; code appends `/ws/...`)
- [x] Tests: test_chat_service.py (7 tests) — all passing
- [x] Frontend verification: `tsc --noEmit` clean, `next lint` clean (0 errors across whole repo)
- [ ] Manual verification (2 browser sessions, real-time delivery + reconnect) — deferred, needs docker compose + live DB; will do a combined pass with Phase E

### Phase E — Real-time notification push over WebSocket
**Status:** complete (pending live manual verification)
- [x] `api/ws/notifications.py` — user-scoped channel `notif:user:{id}`, registered in api/ws/router.py
- [x] Hook `publish()` into `NotificationService.push()` (now flushes to get id/created_at, then publishes; audited both existing call sites in task_service.py — safe)
- [x] Frontend: `useNotificationSocket()` in useNotifications.ts, wired into dashboard layout (before early returns, rules-of-hooks), poll interval relaxed 30s -> 120s (safety net only)
- [x] Tests: test_notification_service.py (2 tests: persists+broadcasts, contract test for publish() exception propagation)
- [x] Verified: both /ws/chat/{project_id} and /ws/notifications routes registered; tsc clean; next lint clean; full backend suite 92/92
- [ ] Manual verification (2 sessions, task change -> bell badge updates live) — deferred, needs docker compose + live DB

### Phase F — Wrap-up
**Status:** complete
- [x] Full backend test suite run — 92/92 passing
- [x] Frontend production build (`next build`) — succeeds, all 23 routes generated incl. `/projects/[id]/chat`
- [x] Documented WS endpoints in `.documents/specs/system-architecture/design.md` (new "Real-Time Communication (WebSocket)" section + fixed the stale `NEXT_PUBLIC_WS_URL` doc value + Change History 2.2 entry)

## All phases complete except live manual verification
The one remaining item across Phases B/D/E is a live multi-session manual check (task notification fan-out, chat real-time delivery + reconnect, notification bell live update) — needs `docker compose up` with Postgres/Redis/backend/celery-worker/celery-beat all running. Everything else (unit tests, type-check, lint, production build, migration chain) is verified. See progress.md for the full session log.

## Next Step
All planned phases are implemented, tested, and committed. Only remaining step is the user running a live manual verification pass (docker compose up) whenever convenient — see "Manual verification" checklist notes in each phase above.
