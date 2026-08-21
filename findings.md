# Findings

## Backend architecture (verified via Explore agent + direct reads)
- Layered: `api/v1/endpoints/*.py` (thin routing) → `services/*.py` (business logic, each with `XxxServiceDep` Annotated dep) → `models/*.py` (SQLAlchemy 2.0 async, `Mapped`/`mapped_column`).
- Auth: JWT via `python-jose`, `core/dependencies.py` has `CurrentUser`, `require_roles(*names)`, `require_permissions(*"resource:action")`.
- Project-scoped auth helpers in `services/phase2_common.py`: `get_project_context`, `require_project_roles`, `add_audit(db, actor_id, action, entity_type, entity_id, old_values=, new_values=, description=)`.
- DB: PostgreSQL + asyncpg, Alembic migrations in `backend/alembic/versions/`. Current head: `20260814_phase2_task_wbs.py` (chain: 13e3544bef02 → 20260810 → 20260812(x2) → 20260813(x2) → 20260814_phase2_task_wbs).
- Celery: `workers/celery_app.py`, Redis broker/backend already configured, NO beat_schedule configured yet. `redis==5.1.1` (has `redis.asyncio`), `uvicorn[standard]==0.30.0` (pulls in `websockets`) — both already deps, no new packages needed for WS/pubsub.
- Tests: `backend/tests/unit/`, no real DB — `SimpleNamespace`/`AsyncMock` pattern. Every test file must `import app.db.base  # noqa: F401` first.

## Key models
- `Task` (`models/task.py`): status enum TODO/IN_PROGRESS/IN_REVIEW/DONE/BLOCKED, `start_date`, `due_date`, `actual_start`, `actual_end`, CPM fields, FK `assignee_id` (single), `project_id`.
- `Project` (`models/project.py`): `status`, `start_date`, `end_date`, `pm_id`, `portfolio_id`.
- `project_members` (`models/associations.py`): `(project_id, user_id, role_id, joined_at)` — the project TEAM table (distinct from global RBAC). Project member management already exists: `GET/POST /projects/{id}/members`, `DELETE /projects/{id}/members/{user_id}` in `endpoints/projects.py` + `ProjectService`.
- `Notification` (`models/notification.py`): `user_id, title, message, notification_type, is_read, read_at, link, related_entity_type, related_entity_id`. `NotificationType` enum already has TASK_ASSIGNED/TASK_DUE_SOON/TASK_OVERDUE/CR_*/CRITICAL_PATH_CHANGED/RESOURCE_OVERLOADED/AI_JOB_COMPLETED/RISK_HIGH/MENTION/SYSTEM.
- `NotificationService.push(db, *, user_id, title, message, ntype, link=, entity_type=, entity_id=)` static helper already exists (`services/notification_service.py`). Only trigger wired today: `task_service.py` on task creation-with-assignee and reassignment (TASK_ASSIGNED).
- `Role`/`Permission`/audit models all pre-existing and solid (see Admin section below).

## Admin/RBAC feature — CONFIRMED FEATURE-COMPLETE, no rebuild needed
- Backend: `schemas/admin.py`, `services/admin_service.py` (AdminUserService: list/create/update/deactivate/reactivate, protects last-admin + self-deactivation), `services/role_service.py` (RoleService: list/get/create/update/delete, protects built-in "Admin" role via PROTECTED_ROLE_NAME, permission_ids assignment on create/update), `services/audit_service.py` (read-only paginated).
- Endpoints: `users.py` (require_permissions user:read/create/update/delete), `roles.py` (require_roles Admin), `permissions.py` (read-only), `audit_timeline.py` (require_permissions audit:read).
- Frontend: `/admin/{users,roles,audit}` pages, full CRUD with optimistic React Query updates, `RoleForm.tsx` has working permission-checkbox UI grouped by resource.
- `lib/rbac.ts`: only `isAdminUser(user)` = `is_superuser || roles.some(name==='Admin')`. No granular `hasPermission()` — user decided to skip adding this for now.
- Read `role_service.py`, `schemas/admin.py`, `RoleForm.tsx` in full — no bugs found, matches its tests.

## Frontend architecture
- App Router: `(dashboard)` route group, shared shell at `app/(dashboard)/layout.tsx` (header: nav links + right-side flex group with `<NotificationBell/>` + user menu — insertion point for future chat/notification UI).
- Feature-colocated pattern (`features/<name>/{components,hooks,services,types}`) is the CURRENT pattern, established by `features/notifications/` and `features/dashboard/` (most recent commit). Older top-level `src/services/*.service.ts` + `src/types/*.types.ts` split is legacy — `src/services/notification.service.ts` and `src/types/notification.types.ts` are confirmed ORPHANED/dead code, do not extend them.
- React Query v5 is the primary server-state layer (key-factory + hook pattern, see `features/tasks/hooks/useTasks.ts`). Zustand only for auth (`store/authStore.ts`, persisted, JWT also mirrored into non-httpOnly `auth-token` cookie — this is why WS auth via query-string token is acceptable here).
- No WebSocket client lib installed; no toast system; no Popover/DropdownMenu primitive (NotificationBell hand-rolls dropdown). Reusable primitives: `Avatar`, `Button`, `Modal`, `Input`, `Label`, `Spinner`, `PageState`, `Alert` in `components/common/`.
- Notifications feature (`features/notifications/`): real API, 30s poll (`refetchInterval`) via `useUnreadCount`, NOT real-time yet.
- `docker-compose.yml` / frontend env already provisions `NEXT_PUBLIC_WS_URL=ws://localhost:8000` (bare origin, no path) — signal that WS routes should mount at app root `/ws/...`, not under `/api/v1`.

## Design decisions locked in (from planning phase)
- WebSocket: FastAPI native `WebSocket`, Redis pub/sub as cross-process bus (`publish()` → Redis only, delivery to local sockets happens via the `redis_listener()` re-broadcast — avoid double-delivery, do NOT also broadcast_local() directly inside publish()).
- Chat and Notification WS are TWO separate endpoints (`/ws/chat/{project_id}`, `/ws/notifications`) sharing the same `ConnectionManager`/Redis infra.
- `ChatMessage.user_id` FK uses `ondelete="CASCADE"` — mirrors existing `Comment` model convention.
- Chat WS handshake test needs a real test DB — treat as manual verification, not part of mock-only unit suite (no test-Postgres fixture exists yet).
