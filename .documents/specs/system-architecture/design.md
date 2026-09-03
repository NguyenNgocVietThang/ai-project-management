# System Architecture Design
## AI Project Planning & Portfolio Management System

**Version:** 2.2
**Date:** 2026-08-22

---

## Overview

Hệ thống **AI Project Planning & Portfolio Management** được thiết kế theo kiến trúc hiện đại, tập trung hoàn toàn vào **Python (FastAPI)** cho phía Server và **Next.js 15 (React + TypeScript)** cho phía Client. Thiết kế tối ưu hóa cho:
- Tốc độ xử lý I/O bất đồng bộ (AsyncIO + SQLAlchemy Async Engine với asyncpg)
- Tính toán thuật toán CPM (thuần Python)
- Tích hợp linh hoạt với các mô hình AI ngôn ngữ lớn (LLMs) qua abstraction layer
- Giao tiếp thời gian thực hai chiều (Real-time WebSockets + Redis Pub/Sub đa tiến trình)
- Tác vụ nền và quét lịch trình tự động (Celery Worker & Celery Beat)

---

## Technology Stack

### Backend Layer

| Thành phần | Thư viện | Phiên bản |
|---|---|---|
| Framework Core | FastAPI | 0.115.0 |
| ASGI Server | uvicorn[standard] | 0.30.0 |
| Validation & Serialization | Pydantic v2 | 2.9.0 |
| Settings | pydantic-settings | 2.5.0 |
| ORM | SQLAlchemy (Async Engine) | 2.0.35 |
| DB Driver | asyncpg | 0.29.0 |
| Database Migrations | Alembic | 1.13.3 |
| Security (JWT) | python-jose[cryptography] | 3.3.0 |
| Security (Hash) | passlib[bcrypt] | 1.7.4 |
| Real-time Bus | Redis Pub/Sub + ConnectionManager | 5.1.1 |
| Task Queue | Celery[redis] | 5.4.0 |
| Scheduler | Celery Beat | 5.4.0 |
| Message Broker / Cache | Redis | 5.1.1 |
| AI — OpenAI | openai | 1.51.0 |
| AI — Gemini | google-generativeai | 0.8.0 |
| File Storage | minio / boto3 | 7.2.9 / 1.35.0 |
| Email | fastapi-mail + Jinja2 | 1.4.1 / 3.1.4 |
| Export DOCX | python-docx | 1.1.2 |
| Export XLSX | openpyxl | 3.1.5 |
| HTTP Client | httpx | 0.27.2 |
| Date Utils | python-dateutil, pytz | 2.9.0 / 2024.2 |
| Testing | pytest, pytest-asyncio, httpx | — |

### Frontend Layer

| Thành phần | Thư viện | Phiên bản |
|---|---|---|
| Framework | Next.js (App Router) | 15.0.0 |
| UI Runtime | React | ^18.3.0 |
| Language | TypeScript | ^5.2.2 |
| Server State | TanStack Query v5 | ^5.0.0 |
| Global State | Zustand | ^4.4.0 |
| HTTP Client | Axios | ^1.5.0 |
| Real-time Client | lib/ws-client.ts (Native WebSocket) | — |
| Styling | Tailwind CSS v3 | ^3.3.0 |
| Forms | React Hook Form + Zod + @hookform/resolvers | ^7.47.0 / ^3.22.0 |
| Tables | TanStack Table v8 | — |
| Charts | Recharts | ^2.8.0 |
| Drag & Drop | @dnd-kit/core + sortable | ^6.0.0 / ^8.0.0 |
| Icons | Lucide React | ^0.290.0 |
| Date | date-fns | ^2.30.0 |
| CSS Utils | clsx + tailwind-merge | ^2.0.0 |

### Infrastructure Layer (Docker Compose — 7 Services)

| Service | Image / Tech | Port |
|---|---|---|
| `postgres` | postgres:16-alpine | 5432 |
| `redis` | redis:7-alpine | 6379 |
| `minio` | minio/minio:latest | 9000 (API), 9001 (Console) |
| `backend` | ./backend Dockerfile (FastAPI) | 8000 |
| `celery-worker` | ./backend Dockerfile | — |
| `celery-beat` | ./backend Dockerfile | — |
| `frontend` | ./frontend Dockerfile (Next.js) | 3000 |

> Network: `ai-project-network`. Volumes: `postgres_data`, `redis_data`, `minio_data`.

---

## Backend Architecture

Backend được thiết kế theo mô hình **Layered Architecture** (Kiến trúc phân tầng):

```
HTTP / WS Request
     │
     ▼
┌────────────────────────────────────────────────────────┐
│ 1. ENDPOINTS & WS LAYER (app/api/v1/ & app/api/ws/)    │
│    - 21 REST Routers mounted + 2 WebSocket Routers     │
│    - Kiểm tra RBAC (require_roles, require_permissions)│
│    - Xác thực WS handshake via JWT token query param  │
│    - Trả về Pydantic DTO schemas                       │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ 2. SERVICES LAYER  (app/services/)                     │
│    - Chứa toàn bộ Business Logic                       │
│    - AI services, CPM engine, Chat, Notification Push  │
│    - Quản lý Audit Log & Trigger Fan-out               │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ 3. REPOSITORIES LAYER  (app/repositories/)             │
│    - Data Access Layer (Repository Pattern)            │
│    - Kế thừa BaseRepository (CRUD generic)             │
│    - Thực thi SQLAlchemy async queries                 │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ 4. MODELS LAYER  (app/models/)                         │
│    - SQLAlchemy Declarative Base (34 models/tables)    │
│    - 8 Domains chức năng                               │
└────────────────────────────────────────────────────────┘
```

### Cấu trúc thư mục Backend thực tế

```
backend/
├── app/
│   ├── main.py                 # FastAPI entrypoint + lifespan + CORS + WS Router mount
│   ├── api/
│   │   ├── v1/
│   │   │   ├── router.py       # Mount 21 REST routers (+11 stub bị comment) → api_router
│   │   │   └── endpoints/      # 32 file (21 hiện thực, 11 stub TODO)
│   │   │       ├── auth.py, oauth.py, users.py, roles.py, permissions.py
│   │   │       ├── portfolios.py, projects.py, phases.py, sprints.py, epics.py, milestones.py
│   │   │       ├── tasks.py, subtasks.py, dependencies.py, assignments.py, worklogs.py
│   │   │       ├── chat.py, leaves.py, skills.py, documents.py, approvals.py
│   │   │       ├── change_requests.py, gantt.py, cpm.py, resource_leveling.py
│   │   │       ├── dashboards.py, reports.py, notifications.py, audit_timeline.py
│   │   │       ├── project_versions.py, ai.py, system.py
│   │   └── ws/
│   │       ├── deps.py         # authenticate_ws (JWT validation via query param)
│   │       ├── router.py       # ws_router mounted at app root /ws
│   │       ├── chat.py         # /ws/chat/{project_id}
│   │       └── notifications.py# /ws/notifications
│   ├── core/
│   │   ├── config.py           # Pydantic BaseSettings (đọc .env)
│   │   ├── security.py         # JWT create/decode + bcrypt hash/verify
│   │   ├── dependencies.py     # get_db, get_current_user, require_roles, require_permissions
│   │   ├── redis_client.py     # Async Redis singleton (get_redis)
│   │   ├── ws_manager.py       # ConnectionManager + publish() + redis_listener()
│   │   └── exceptions.py       # Custom HTTP exceptions
│   ├── models/                 # 34 SQLAlchemy models — 8 Domains
│   │   ├── base.py             # DeclarativeBase + id, created_at, updated_at
│   │   ├── associations.py     # user_roles, role_permissions, user_skills, project_members
│   │   ├── user.py, role.py, permission.py, skill.py, leave.py (User & RBAC)
│   │   ├── portfolio.py, project.py, phase.py, sprint.py, epic.py, milestone.py (Project Core)
│   │   ├── task.py, subtask.py, dependency.py, assignment.py, worklog.py, comment.py (Task & CPM)
│   │   ├── change_request.py, approval.py, project_version.py, audit_log.py, impact_report.py (Change Mgmt)
│   │   ├── ai_request.py, ai_output.py, risk_report.py (AI Domain)
│   │   ├── document.py, notification.py, email_log.py (Document & Notification)
│   │   └── chat_message.py, chat_read_state.py (Chat Domain)
│   ├── schemas/                # Pydantic schema files (admin, auth, chat, project, task, etc.)
│   ├── services/               # Business logic layer
│   │   ├── admin_service.py, audit_service.py, auth_service.py, chat_service.py
│   │   ├── scheduling_service.py (CPM), dashboard_service.py, notification_service.py, oauth_service.py
│   │   ├── phase2_common.py, portfolio_service.py, project_service.py, resource_service.py
│   │   ├── role_service.py, task_service.py, user_service.py, wbs_service.py, storage_service.py
│   │   └── ai/                 # base.py, openai_provider.py, gemini_provider.py, project_generator.py (chưa nối endpoint)
│   ├── db/
│   │   ├── session.py          # AsyncEngine + async_sessionmaker + get_db()
│   │   ├── base.py             # Import tất cả models cho Alembic
│   │   └── seed.py             # 7 Roles, 34 Permissions, 1 Admin Account
│   ├── workers/                # Celery async tasks & Beat scheduler
│   │   ├── celery_app.py       # Celery config + beat_schedule (daily task sweep)
│   │   ├── notification_tasks.py # sweep_task_dates_task (task start & due-soon)
│   │   ├── ai_tasks.py, report_tasks.py, email_tasks.py
│   │   └── __init__.py
│   └── utils/
│       ├── cpm.py              # Pure Python CPM Algorithm (topological_sort, calculate_cpm)
│       ├── date_utils.py, pagination.py, email.py
├── alembic/                    # Database migrations (async PostgreSQL)
└── tests/unit/                 # Automated unit test suite (123/123 passing)
```

---

## Frontend Architecture

Frontend sử dụng **Next.js 15 App Router** theo mô hình **Feature-colocated architecture**:

```
frontend/src/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # login, register, forgot-password, reset-password, verify-email, oauth-callback
│   ├── (dashboard)/            # Authenticated layout with NotificationBell & WebSocket listener
│   │   ├── layout.tsx          # Shell layout (wires useNotificationSocket)
│   │   ├── dashboard/page.tsx  # KPI overview & project health
│   │   ├── portfolios/         # Portfolio list & detail views
│   │   ├── projects/           # Projects list page
│   │   │   └── [id]/           # Project Detail Shell (Overview, Tasks, WBS, Members, Chat, Settings)
│   │   │       ├── overview/page.tsx
│   │   │       ├── tasks/page.tsx
│   │   │       ├── wbs/page.tsx
│   │   │       ├── members/page.tsx
│   │   │       ├── chat/page.tsx
│   │   │       └── settings/page.tsx
│   │   ├── admin/              # Admin Portal
│   │   │   ├── users/page.tsx  # User list & status toggle
│   │   │   ├── roles/page.tsx  # Role CRUD & permission matrix
│   │   │   └── audit/page.tsx  # System-wide audit timeline
│   │   └── profile/page.tsx    # User profile & skills
├── features/                   # Feature-colocated modules
│   ├── admin/                  # AdminUserList, RoleForm, AuditTimeline
│   ├── auth/                   # LoginForm, RegisterForm, SocialLoginButtons
│   ├── chat/                   # ChatPanel, ChatMessageItem, useChatSocket, useChat
│   ├── dashboard/              # KPI cards, EVA charts, ActivityFeed
│   ├── notifications/          # NotificationBell, NotificationList, useNotifications
│   ├── portfolios/             # PortfolioCard, PortfolioForm, usePortfolios
│   ├── projects/               # ProjectWizard, ProjectCard, ProjectMembersTable
│   ├── tasks/                  # KanbanBoard, TaskDrawer, useTasks
│   ├── users/                  # UserProfileForm, useUsers
│   └── wbs/                    # WBSTreeView, PhaseModal, useWBS
├── components/common/          # Reusable UI primitives (Avatar, Button, Modal, Input, Spinner, etc.)
├── lib/
│   ├── ws-client.ts            # Reconnecting WebSocket helper (exponential backoff)
│   ├── rbac.ts                 # isAdminUser helper
│   └── utils.ts
├── services/api.ts             # Axios client with JWT interceptor & refresh queue
└── store/authStore.ts          # Zustand Auth Store (persisted token & cookie sync)
```

---

## Database Schema (SQLAlchemy — 8 Domains, 34 Tables)

### ERD tổng quan

```
Domain 1: Base & Associations
  user_roles, role_permissions, user_skills, project_members

Domain 2: User & RBAC
  users ←──── user_roles ────→ roles ←── role_permissions ──→ permissions
  users ←──── user_skills ───→ skills
  users ──── leaves

Domain 3: Project Core
  portfolios ──── projects ──── project_members ──── users
  projects ──── phases, sprints, epics, milestones
  projects ──── tasks ──── subtasks

Domain 4: Task & Scheduling
  tasks ──── dependencies (self-ref: predecessor ↔ successor)
  tasks ──── assignments ──── users
  tasks ──── worklogs ──── users
  tasks ──── comments ──── users

Domain 5: Change Management
  projects ──── change_requests ──── approvals ──── users
  change_requests ──── impact_reports
  projects ──── project_versions
  audit_logs (global entity tracking)

Domain 6: AI Domain
  projects ──── ai_requests ──── ai_outputs
  projects ──── risk_reports

Domain 7: Document & Notification
  projects ──── documents
  users ──── notifications
  email_logs

Domain 8: Real-Time Chat
  projects ──── chat_messages ──── users
  chat_messages ──── chat_read_states ──── users
```

---

## Real-Time Communication (WebSocket)

Hệ thống cung cấp 2 native FastAPI `WebSocket` endpoints được mount tại **app root** dưới `/ws` (không nằm dưới `/api/v1` — xem `app/main.py`), sử dụng Redis Pub/Sub làm message bus đa tiến trình (`app/core/ws_manager.py`):

```
/ws/chat/{project_id}?token=<JWT>   ← Kênh chat theo từng dự án (dành cho project_members)
/ws/notifications?token=<JWT>       ← Kênh đẩy thông báo cá nhân theo người dùng (notif:user:{id})
```

**Cơ chế xác thực (Auth handshake)**: JWT access token truyền qua query parameter (`?token=...`). `app/api/ws/deps.py::authenticate_ws()` giải mã và xác thực `auth_version`/`is_active`. Nếu không hợp lệ, đóng socket với mã code `4401`.

**Mô hình phân phối (Delivery model)**: `app/core/ws_manager.py::publish(channel, payload)` đẩy tin nhắn lên Redis (tiền tố `ws:<channel>`). Background task `redis_listener()` trong FastAPI lifespan nhận và phân phối về các WebSocket nội bộ của tiến trình.

**Project Chat**: Gated bởi `get_project_context()` kiểm tra quyền thành viên dự án. Khung tin nhắn gửi lên qua socket được định tuyến qua cùng phương thức `ChatService.create_message()` như REST fallback (`POST /api/v1/projects/{id}/messages`).

**Real-time Notifications**: Single choke point `NotificationService.push()` lưu bản ghi vào DB, `flush()` lấy ID và timestamp rồi gọi `publish()`, giúp toàn bộ các trigger (tạo task, đổi trạng thái, cập nhật ngày, fan-out) tự động đẩy qua WebSocket tức thời.

---

## Celery Beat & Scheduled Tasks

Hệ thống thiết lập tiến trình `celery-beat` riêng biệt trong `docker-compose.yml`:
- **Task**: `sweep-task-dates-daily` (`app/workers/notification_tasks.py`)
- **Tần suất**: Chạy định kỳ lúc 08:00 AM hàng ngày (Múi giờ Asia/Ho_Chi_Minh).
- **Nghiệp vụ**:
  1. Quét các task bắt đầu hôm nay (`start_date == today`, trạng thái TODO, chưa gửi thông báo) → Gửi thông báo fan-out tới toàn bộ nhóm dự án và cập nhật `last_start_notified_at`.
  2. Quét các task sắp đến hạn (`due_date == today + 1 day`, chưa DONE, chưa gửi thông báo) → Gửi thông báo fan-out tới nhóm dự án và cập nhật `last_due_soon_notified_at`.

---

## Change History

| Version | Date | Thay đổi |
|---|---|---|
| 1.0 | 2026-06-25 | Phiên bản ban đầu |
| 2.0 | 2026-08-05 | Cập nhật toàn diện: Next.js 15 (thay Vite), 7 Domains/31 Tables, thêm chi tiết Layered Architecture, Repository Pattern, 34 Permissions, 13 Notification types, chi tiết Celery tasks, CPM fields, security flow |
| 2.1 | 2026-08-13 | Đã hoàn thành Auth & User Onboarding Module (Login, Register, Google & Facebook OAuth, Password recovery, Email verification, Edge JWT Guard, Auth Services & Store). Cập nhật tài liệu sát thực tế. |
| 2.2 | 2026-08-22 | Đã hoàn thành Admin panel (users, roles, permissions, audit timeline), Notification triggers (task start/due-soon/change fan-out qua Celery Beat daily sweep), và Real-time Project Chat. Bổ sung Domain 8 (Chat) với 2 bảng `chat_messages` và `chat_read_states` (tổng 34 tables), Redis Pub/Sub bridge. |
| 2.2.1 | 2026-09-03 | Đối soát tài liệu với mã nguồn thực tế: **21/32 REST router được mount** (11 router `leaves/skills/documents/approvals/change_requests/gantt/cpm/reports/versions/ai/system` vẫn là stub `TODO`, chưa mount); `workers/ai_tasks.py` và `report_tasks.py` là stub; CPM chạy nội bộ qua `utils/cpm.py` + `scheduling_service.py`; 123/123 unit test pass. Model DB đủ 34 bảng nhưng business logic Phase 3–5 phần lớn chưa hiện thực. |

---

*Cập nhật lần cuối: 2026-09-03 — Version 2.2.1 — Stack: Python FastAPI + Next.js 15*
