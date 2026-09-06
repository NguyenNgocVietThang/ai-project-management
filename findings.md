# Findings

## Backend Architecture (Verified & Tested)
- **Layered Structure**: `api/v1/endpoints/*.py` (22 REST routers mounted + 10 `TODO: Implement` stubs commented out in `router.py`) + `api/ws/*.py` (2 WebSocket routes) → `services/*.py` (business logic, each with `XxxServiceDep` dependency) → `repositories/*.py` → `models/*.py` (SQLAlchemy 2.0 async with `Mapped`/`mapped_column`).
- **Not implemented yet (stub routers, not mounted)**: `/leaves`, `/skills`, `/documents`, `/approvals`, `/change-requests`, `/gantt`, `/reports`, `/versions`, `/ai`, `/system`. `/cpm` is now mounted read-only (`GET /projects/{id}/cpm`). `workers/ai_tasks.py` and `workers/report_tasks.py` are also stubs; only `email_tasks.py` + `notification_tasks.py` are real. CPM logic itself is real and runs internally via `app/utils/cpm.py` + `services/scheduling_service.py`.
- **Auth**: JWT via `python-jose`, `core/dependencies.py` has `CurrentUser`, `require_roles(*names)`, `require_permissions(*"resource:action")`.
- **Project-scoped Auth**: Helpers in `services/phase2_common.py`: `get_project_context`, `require_project_roles`, `notify_project_team`, `add_audit`.
- **Database & Migrations**: PostgreSQL 16 + `asyncpg`, Alembic migrations in `backend/alembic/versions/`. Current single head: `20260904_perf_indexes` (Chain: 13e3544bef02 → 20260810 → 20260812(x2) → 20260813(x2) → 20260814_phase2_task_wbs → 20260821_task_notify_columns → 20260821_chat_tables).
- **8 Domains & 34 Database Tables**: 4 junction tables (`user_roles`, `role_permissions`, `user_skills`, `project_members`) + 30 entity tables (including `chat_messages`, `chat_read_states`, `tasks` with `last_start_notified_at` / `last_due_soon_notified_at`).
- **Real-Time WebSocket & Redis Pub/Sub**: `app/core/ws_manager.py` (`ConnectionManager`, `publish()`, `redis_listener()`), `app/core/redis_client.py` (lazy async Redis singleton). Handshake via `app/api/ws/deps.py::authenticate_ws` (query param `?token=...`).
- **Celery Worker & Celery Beat**: `workers/celery_app.py` has `beat_schedule` for `sweep-task-dates-daily` (`crontab(hour=8, minute=0)`, Asia/Ho_Chi_Minh) executing `sweep_task_dates_task` in `workers/notification_tasks.py`.
- **Test Suite**: 246 tests passing (verified 2026-09-06) — `tests/unit/` plus a new
  `tests/integration/` suite backed by `tests/conftest.py` (in-memory SQLite + ASGI
  client) that exercises the real authorization matrix at HTTP level. Frontend has
  22 Vitest tests (`npm test`).
- **Background scheduling**: `workers/scheduling_tasks.py` recalculates the critical
  path off the request path, debounced per project, for projects above
  `CPM_SYNC_TASK_THRESHOLD` (default 300 tasks).
- **Session credentials**: refresh token lives in an httpOnly cookie
  (`core/auth_cookies.py`); the access token is memory-only on the client.
  WebSocket handshakes use single-use tickets (`core/ws_tickets.py`), not JWTs on
  the query string.

## Key Models
- `Task` (`models/task.py`): Status enum, CPM fields (`es, ef, ls, lf, float_time, is_critical`), `start_date`, `due_date`, `last_start_notified_at`, `last_due_soon_notified_at`, `assignee_id`, `project_id`.
- `Project` (`models/project.py`): `status`, `start_date`, `end_date`, `pm_id`, `portfolio_id`.
- `project_members` (`models/associations.py`): `(project_id, user_id, role_id, joined_at)` — Project team table distinct from global RBAC.
- `ChatMessage` & `ChatReadState` (`models/chat_message.py`, `chat_read_state.py`): Project-scoped message history & cursor-based unread tracking.
- `Notification` (`models/notification.py`): 13 notification types. `NotificationService.push()` persists to DB, flushes for ID/timestamp, and automatically publishes to Redis channel `ws:notif:user:{user_id}` for instant WebSocket delivery.
- `AuditLog` (`models/audit_log.py`): Global immutable entity change tracking.

## Admin / RBAC Feature (100% Complete)
- Backend: `schemas/admin.py`, `services/admin_service.py` (AdminUserService: list/create/update/deactivate/reactivate), `services/role_service.py` (RoleService: role CRUD, 34 permission_ids assignment, protects "Admin"), `services/audit_service.py` (read-only paginated audit timeline).
- Endpoints: `users.py` (require_permissions user:read/create/update/delete), `roles.py` (require_roles Admin), `permissions.py`, `audit_timeline.py` (require_permissions audit:read).
- Frontend: `/admin/{users,roles,audit}` pages, full CRUD with optimistic React Query updates, `RoleForm.tsx` permission-matrix UI, `lib/rbac.ts` (`isAdminUser`).

## Real-Time Project Chat & WebSocket Notification (100% Complete)
- Backend:
  - `/ws/chat/{project_id}`: Checked via `get_project_context()`, messages dispatched to Redis channel `ws:chat:project:{project_id}`.
  - `/ws/notifications`: Personal push channel `ws:notif:user:{user_id}`.
  - REST fallback: `/api/v1/projects/{id}/messages` (cursor `before_id`), `/unread-count`, `/read`.
- Frontend:
  - `features/chat/`: `ChatPanel.tsx`, `ChatMessageItem.tsx`, `useChatSocket.ts`, `useChat.ts` (React Query infinite query).
  - Page: `/projects/[id]/chat/page.tsx` + Chat tab with unread count badge in project layout.
  - `features/notifications/hooks/useNotifications.ts`: `useNotificationSocket()` wired in `(dashboard)/layout.tsx`.
  - Client: `lib/ws-client.ts` shared reconnecting WebSocket client.

## Frontend Architecture & Quality
- **App Router**: Feature-colocated structure (`features/<name>/{components,hooks,services,types}`).
- **Server State**: TanStack Query v5 with custom key factories.
- **Client Auth**: Zustand store (`authStore.ts`) persisted & mirrored into `auth-token` cookie for Next.js Edge Middleware.
- **Environment**: `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1`, `NEXT_PUBLIC_WS_URL=ws://localhost:8000` (bare origin, frontend code appends `/ws/...`).
- **Build Quality**: `next build`, `tsc --noEmit`, `next lint` and `npm test` all pass
  with 0 errors. `npm audit --audit-level=high` reports 0 vulnerabilities.
- **i18n**: `next-intl` with `vi` as the default locale and `en` as the alternative;
  the locale is stored in a cookie, so routes keep their existing shape (no
  `[locale]` segment).
- **Theming**: class-based dark mode with an explicit light/dark/system toggle;
  an inline script applies the theme before first paint.
