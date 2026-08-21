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
**Status:** in_progress
- [ ] Run existing admin/audit unit tests, confirm pass
- [ ] Spot-check endpoint guards (require_permissions/require_roles) on users/roles/permissions/audit_timeline
- [ ] Confirm with user which unrelated modified files (.mcp.json, .claude/launch.json) to include/exclude from commit
- [ ] Commit admin-related backend + frontend files as one logical unit

### Phase B — Notification triggers + Celery Beat
**Status:** not_started
- [ ] Add `notify_project_team()` fan-out helper to `phase2_common.py`
- [ ] Hook task field-change + status-change notifications into `task_service.py`
- [ ] Add `last_start_notified_at` / `last_due_soon_notified_at` columns to `Task` model
- [ ] New Alembic migration for the two columns (down_revision = 20260814_phase2_task_wbs)
- [ ] New `notification_tasks.py` Celery task (sweep) + beat_schedule in `celery_app.py`
- [ ] Add `celery-beat` service to docker-compose.yml
- [ ] Tests: test_notification_triggers.py, test_notification_tasks.py
- [ ] Manual verification

### Phase C — Shared WebSocket infrastructure
**Status:** not_started
- [ ] `core/redis_client.py` — async Redis singleton
- [ ] `core/ws_manager.py` — ConnectionManager + publish() + redis_listener()
- [ ] `api/ws/deps.py` — authenticate_ws()
- [ ] Wire redis_listener() into main.py lifespan; mount ws_router at app root `/ws`
- [ ] Test: test_ws_manager.py

### Phase D — Chat feature
**Status:** not_started
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
Start Phase A: run the three existing admin/audit unit test files and report results.
