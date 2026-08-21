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
**Status:** in_progress
- [ ] Models: ChatMessage, ChatReadState + register in db/base.py
- [ ] Migration for chat_messages / chat_read_states (chained after Phase B migration)
- [ ] Schemas: chat.py
- [ ] Service: chat_service.py
- [ ] REST endpoints: api/v1/endpoints/chat.py + router registration
- [ ] WebSocket endpoint: api/ws/chat.py
- [ ] Frontend: features/chat/{types,services,hooks,components}, new /projects/[id]/chat page, nav tab
- [ ] Tests: test_chat_service.py
- [ ] Manual verification (2 sessions, real-time delivery + reconnect)

### Phase E — Real-time notification push over WebSocket
**Status:** not_started
- [ ] `api/ws/notifications.py` — user-scoped channel
- [ ] Hook `publish()` into `NotificationService.push()`
- [ ] Frontend: useNotificationSocket(), wire into dashboard layout, relax poll interval
- [ ] Test for push() -> publish() call
- [ ] Manual verification

### Phase F — Wrap-up
**Status:** not_started
- [ ] Full backend test suite run
- [ ] Frontend `npm run build`
- [ ] Document WS endpoints in .documents/

## Next Step
Start Phase D: ChatMessage/ChatReadState models + migration, then chat_service.py, REST endpoints, WS endpoint, and frontend features/chat module.
