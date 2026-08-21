# System Architecture Design
## AI Project Planning & Portfolio Management System

**Version:** 2.2
**Date:** 2026-08-22

---

## Overview

Hệ thống **AI Project Planning & Portfolio Management** được thiết kế theo kiến trúc hiện đại, tập trung hoàn toàn vào **Python (FastAPI)** cho phía Server và **Next.js 15 (React + TypeScript)** cho phía Client. Thiết kế này loại bỏ hoàn toàn các di sản cũ (NestJS/Prisma/BullMQ), tối ưu hóa cho:
- Tốc độ xử lý I/O bất đồng bộ (AsyncIO + SQLAlchemy Async)
- Tính toán thuật toán CPM (thuần Python)
- Tích hợp linh hoạt với các mô hình AI ngôn ngữ lớn (LLMs) qua abstraction layer

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
| Task Queue | Celery[redis] | 5.4.0 |
| Message Broker / Cache | Redis | 5.1.1 |
| Celery Monitor | flower | 2.0.1 |
| AI — OpenAI | openai | 1.51.0 |
| AI — Gemini | google-generativeai | 0.8.0 |
| File Storage | minio / boto3 | 7.2.9 / 1.35.0 |
| Email | fastapi-mail + Jinja2 | 1.4.1 / 3.1.4 |
| Export DOCX | python-docx | 1.1.2 |
| Export XLSX | openpyxl | 3.1.5 |
| HTTP Client | httpx | 0.27.2 |
| Date Utils | python-dateutil, pytz | 2.9.0 / 2024.2 |
| Linting / QA | black, isort, ruff, mypy | — |
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
| Styling | Tailwind CSS v3 | ^3.3.0 |
| Forms | React Hook Form + Zod + @hookform/resolvers | ^7.47.0 / ^3.22.0 |
| Tables | TanStack Table v8 | — |
| Charts | Recharts | ^2.8.0 |
| Drag & Drop | @dnd-kit/core + sortable | ^6.0.0 / ^8.0.0 |
| Icons | Lucide React | ^0.290.0 |
| Date | date-fns | ^2.30.0 |
| CSS Utils | clsx + tailwind-merge | ^2.0.0 |

### Infrastructure Layer

| Service | Image / Tech | Port |
|---|---|---|
| `postgres` | postgres:16-alpine | 5432 |
| `redis` | redis:7-alpine | 6379 |
| `minio` | minio/minio:latest | 9000 (API), 9001 (Console) |
| `backend` | ./backend Dockerfile (FastAPI) | 8000 |
| `celery-worker` | ./backend Dockerfile | — |
| `frontend` | ./frontend Dockerfile (Next.js) | 3000 |

> Network: `ai-project-network`. Volumes: `postgres_data`, `redis_data`, `minio_data`.

---

## Backend Architecture

Backend được thiết kế theo mô hình **Layered Architecture** (Kiến trúc phân tầng) để đảm bảo tính module hóa và dễ bảo trì:

```
HTTP Request
     │
     ▼
┌─────────────────────────────────────────────────┐
│ 1. ENDPOINTS LAYER  (app/api/v1/endpoints/)     │
│    - Nhận HTTP request                          │
│    - Kiểm tra quyền RBAC (require_roles())      │
│    - Định tuyến đến Services                    │
│    - Trả về Pydantic schemas (DTO)              │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│ 2. SERVICES LAYER  (app/services/)              │
│    - Chứa toàn bộ Business Logic                │
│    - AI services, CPM service, Email service    │
│    - Không gọi trực tiếp ORM                   │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│ 3. REPOSITORIES LAYER  (app/repositories/)      │
│    - Data Access Layer (Repository Pattern)     │
│    - Kế thừa BaseRepository (CRUD generic)      │
│    - Thực thi SQLAlchemy async queries          │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│ 4. MODELS LAYER  (app/models/)                  │
│    - SQLAlchemy Declarative Base                │
│    - 31 models, 7 Domains                      │
└─────────────────────────────────────────────────┘

Phụ trợ:
┌─────────────────────────────────────────────────┐
│ 5. SCHEMAS LAYER  (app/schemas/)                │
│    - Pydantic DTOs (Request/Response)           │
│    - Validate input, serialize output           │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│ 6. WORKERS LAYER  (app/workers/)                │
│    - Celery tasks chạy ngầm (AI, Email, Report) │
│    - Độc lập hoàn toàn với API thread           │
└─────────────────────────────────────────────────┘
```

### Cấu trúc thư mục Backend thực tế

```
backend/
├── app/
│   ├── main.py                 # FastAPI entrypoint + lifespan + CORS
│   ├── api/v1/
│   │   ├── router.py           # Tổng hợp 31 routers → api_router
│   │   └── endpoints/          # 31 endpoint files
│   │       ├── auth.py         # JWT login/refresh/logout
│   │       ├── users.py        ├── roles.py  ├── permissions.py
│   │       ├── portfolios.py   ├── projects.py ├── phases.py
│   │       ├── sprints.py      ├── epics.py  ├── milestones.py
│   │       ├── tasks.py        ├── subtasks.py ├── dependencies.py
│   │       ├── assignments.py  ├── worklogs.py ├── leaves.py
│   │       ├── skills.py       ├── documents.py ├── approvals.py
│   │       ├── change_requests.py ├── gantt.py ├── cpm.py
│   │       ├── resource_leveling.py ├── dashboards.py ├── reports.py
│   │       ├── notifications.py ├── audit_timeline.py
│   │       ├── project_versions.py ├── ai.py └── system.py
│   ├── core/
│   │   ├── config.py           # Pydantic BaseSettings (đọc .env)
│   │   ├── security.py         # JWT create/decode + bcrypt hash/verify
│   │   ├── dependencies.py     # get_db, get_current_user, require_roles()
│   │   └── exceptions.py       # Custom HTTP exceptions
│   ├── models/                 # 31 SQLAlchemy models — 7 Domains
│   │   ├── base.py             # DeclarativeBase + id, created_at, updated_at
│   │   ├── associations.py     # user_roles, role_permissions, user_skills, project_members
│   │   ├── user.py  ├── role.py  ├── permission.py  ├── skill.py  ├── leave.py
│   │   ├── portfolio.py  ├── project.py  ├── phase.py  ├── sprint.py
│   │   ├── epic.py  ├── milestone.py
│   │   ├── task.py  ├── subtask.py  ├── dependency.py  ├── assignment.py
│   │   ├── worklog.py  ├── comment.py
│   │   ├── change_request.py  ├── approval.py  ├── impact_report.py
│   │   ├── project_version.py  ├── audit_log.py
│   │   ├── ai_request.py  ├── ai_output.py  ├── risk_report.py
│   │   ├── document.py  ├── notification.py  └── email_log.py
│   ├── schemas/                # 9 Pydantic schema files
│   │   ├── auth.py  ├── user.py  ├── project.py  ├── task.py
│   │   ├── gantt.py  ├── dashboard.py  ├── ai.py  └── common.py
│   ├── services/ai/            # AI Provider abstraction
│   │   ├── base.py             # BaseAIProvider (ABC)
│   │   ├── openai_provider.py  # OpenAI GPT-4o
│   │   ├── gemini_provider.py  # Google Gemini Pro
│   │   └── project_generator.py # SOP-AI-001
│   │   # TODO: impact_analysis.py, schedule_optimizer.py,
│   │   #       resource_recommender.py, risk_analyzer.py, document_parser.py
│   ├── repositories/           # Repository Pattern
│   │   ├── base_repository.py  # Generic CRUD (get_by_id, list, create, update, delete)
│   │   ├── user_repository.py  # get_by_email, get_by_username
│   │   ├── project_repository.py # get_projects_by_pm, get_with_members
│   │   └── task_repository.py  # get_tasks_by_project, get_critical_tasks
│   ├── db/
│   │   ├── session.py          # AsyncEngine + AsyncSessionLocal + get_db()
│   │   ├── base.py             # Import tất cả models cho Alembic
│   │   └── seed.py             # 7 Roles, 34 Permissions, 1 Admin
│   ├── workers/                # Celery async tasks
│   │   ├── celery_app.py       # Celery config (broker/backend Redis)
│   │   ├── ai_tasks.py         # generate_project, impact_analysis, optimize_schedule, risk_analysis, parse_document
│   │   ├── report_tasks.py     # DOCX/XLSX generation
│   │   └── email_tasks.py      # Email sending
│   └── utils/
│       ├── cpm.py              # CPM Algorithm (CPMNode, topological_sort, forward_pass, backward_pass, compute_cpm)
│       ├── date_utils.py       # Date helpers
│       └── pagination.py       # Pagination utilities
├── alembic/                    # Database migrations (async PostgreSQL)
├── tests/
│   ├── unit/
│   └── integration/
├── requirements.txt
├── requirements-dev.txt
├── pyproject.toml              # black, isort, ruff, mypy, pytest config
├── alembic.ini
├── Dockerfile
└── .env.example
```

---

## Frontend Architecture

Frontend sử dụng **Next.js 15 App Router** theo mô hình **Feature-based architecture**:

```
frontend/src/
├── app/                        # Next.js App Router (routes, layouts, pages)
│   └── [routes sẽ implement]
├── features/                   # Feature-based modules (17 modules)
│   ├── auth/                   # Login, register, reset password
│   ├── dashboard/              # Portfolio & Project dashboards
│   ├── portfolio/              # Portfolio management
│   ├── projects/               # Project management
│   ├── gantt/                  # Gantt Chart + drag & drop
│   ├── phases/                 # Phase management UI
│   ├── sprints/                # Sprint board (Kanban)
│   ├── epics/                  # Epic management UI
│   ├── milestones/             # Milestone tracker
│   ├── tasks/                  # Task management + dependency graph
│   ├── resources/              # Resource management + workload
│   ├── documents/              # BRD/SRS upload & AI viewer
│   ├── approvals/              # CR & approval workflow UI
│   ├── reports/                # Report export UI (DOCX, XLSX)
│   ├── audit/                  # Audit timeline view
│   ├── versions/               # Version history & rollback UI
│   └── ai/                     # AI prompt input + result viewer
├── components/                 # Shared UI components
│   ├── gantt/                  # Custom Gantt Chart component
│   ├── charts/                 # Burndown, Burnup, Velocity, EVA (Recharts)
│   ├── tables/                 # Data tables (TanStack Table v8)
│   ├── dialogs/                # Modal & drawer components
│   ├── forms/                  # Form components (React Hook Form + Zod)
│   └── common/                 # Base UI (Button, Badge, Alert, Input...)
├── services/                   # API call layer (Axios)
│   # api.ts — Axios instance + interceptors
│   # auth.service.ts, project.service.ts, task.service.ts,
│   # gantt.service.ts, ai.service.ts
├── hooks/                      # Custom React hooks
│   # useAuth.ts, useProjects.ts, useTasks.ts
├── store/                      # Zustand global state
│   # authStore.ts, projectStore.ts, uiStore.ts
├── types/                      # TypeScript interfaces & enums
│   # auth.types.ts, project.types.ts, task.types.ts, api.types.ts
└── lib/                        # Utility functions
    # utils.ts, date.ts, cpm.ts, validators.ts
```

**State Management Strategy:**
- **Zustand** — Local/Global UI state (auth token, active project, UI state)
- **TanStack Query v5** — Server state (data fetching, caching, synchronization)
- **React Hook Form + Zod** — Form state và validation

---

## Database Schema (SQLAlchemy — 7 Domains, 31 Tables)

### ERD tổng quan

```
User Domain
  users ←──── user_roles ────→ roles ←── role_permissions ──→ permissions
  users ←──── user_skills ───→ skills
  users ──── leaves

Project Domain
  portfolios ──── projects ──── project_members ──── users
  projects ──── phases, sprints, epics, milestones
  projects ──── tasks ──── subtasks
  tasks ──── dependencies (self-ref: predecessor ↔ successor)
  tasks ──── assignments ──── users
  tasks ──── worklogs ──── users
  tasks ──── comments ──── users

Change Management Domain
  projects ──── change_requests ──── approvals ──── users
  change_requests ──── impact_reports
  projects ──── project_versions
  audit_logs (global entity tracking)

AI Domain
  projects ──── ai_requests ──── ai_outputs
  projects ──── risk_reports

Document & Notification Domain
  projects ──── documents
  users ──── notifications
  email_logs
```

### CPM Fields trong bảng `tasks`

```python
class Task(Base):
    __tablename__ = "tasks"
    # ... standard fields ...
    
    # CPM computed fields (tự động cập nhật bởi cpm_service)
    early_start   = Column(Float, nullable=True)   # ES
    early_finish  = Column(Float, nullable=True)   # EF
    late_start    = Column(Float, nullable=True)   # LS
    late_finish   = Column(Float, nullable=True)   # LF
    float_days    = Column(Float, nullable=True)   # Slack = LS - ES
    is_critical   = Column(Boolean, default=False) # float_days < 0.001
```

---

## Core Algorithms & Services

### Critical Path Method (CPM) — `app/utils/cpm.py`

```python
# Dataclass node
CPMNode(
  id, duration,          # input
  successors, predecessors,  # graph edges
  early_start, early_finish,
  late_start,  late_finish,
  float_days,  is_critical   # output
)

# Pipeline
topological_sort(nodes) → order[]     # Kahn's Algorithm — phát hiện cycle
forward_pass(nodes, order)
  # ES = max(predecessor.early_finish + lag_days)  [0 nếu không có predecessor]
  # EF = ES + duration
backward_pass(nodes, order)
  # LF = min(successor.late_start - lag_days)  [max(EF) nếu không có successor]
  # LS = LF - duration
  # float_days = LS - ES
  # is_critical = float_days < 0.001

compute_cpm(nodes) → (nodes[], critical_path[])
```

**Trigger Flow:**
```
PM kéo thả Task trên Gantt
  → PATCH /api/v1/tasks/{id}
  → cpm_service.recalculate(project_id)
  → Cập nhật early_start/early_finish/late_start/late_finish/float_days/is_critical cho tất cả tasks
  → Response trả về CPM results
  → Frontend re-render Gantt (Critical Path highlight đỏ)
```

### Resource Leveling — `app/services/resource_leveling.py`

```python
def check_overload(user_id, date, max_hours=8.0) → OverloadResult:
    # 1. Kiểm tra leave: nếu có approved leave → overloaded (on_leave)
    # 2. Lấy tất cả assignments của user có task active trong ngày
    # 3. Tính daily_hours = allocated_hours / working_days(task)
    # 4. Cộng dồn total_hours
    # 5. is_overloaded = total_hours > max_hours
    return OverloadResult(is_overloaded, total_hours, max_hours, tasks_on_date)
```

### AI Provider Abstraction — `app/services/ai/`

```python
class BaseAIProvider(ABC):
    @abstractmethod
    async def generate_text(prompt: str, system_prompt: str = "") → str: ...
    @abstractmethod
    async def generate_json(prompt: str, system_prompt: str = "") → Dict: ...

class OpenAIProvider(BaseAIProvider):   # GPT-4o via openai SDK
class GeminiProvider(BaseAIProvider):  # Gemini Pro via google-generativeai

# Celery task delegates to active provider:
ACTIVE_AI_PROVIDER = settings.ACTIVE_AI_PROVIDER  # "openai" | "gemini"
```

### Background Tasks (Celery + Redis)

```
Celery Worker Pool
├── ai.generate_project      ← SOP-AI-001: prompt → WBS JSON → DB insert → CPM
├── ai.impact_analysis       ← SOP-AI-002: CR → ImpactReport
├── ai.optimize_schedule     ← SOP-AI-003: CPM + resource re-plan → proposed schedule
├── ai.risk_analysis         ← SOP-AI-005: periodic risk scoring
├── ai.parse_document        ← SOP-DOC-001: MinIO doc → task suggestions
├── reports.generate_docx    ← SOP-RPT-001: python-docx → MinIO → URL
├── reports.generate_xlsx    ← SOP-RPT-001: openpyxl → MinIO → URL
└── email.send               ← SOP-NOTI-001: fastapi-mail SMTP
```

---

## Real-Time Communication (WebSocket)

Two native FastAPI `WebSocket` endpoints, mounted at the **app root** under
`/ws` (not under `/api/v1` — see `app/main.py`), backed by a Redis pub/sub
bridge (`app/core/ws_manager.py`) so messages fan out correctly across
multiple uvicorn workers:

```
/ws/chat/{project_id}?token=<JWT>   ← project team chat (1 channel per Project)
/ws/notifications?token=<JWT>       ← per-user real-time notification push
```

**Auth handshake**: the JWT access token travels as a query parameter, not
an `Authorization` header — browsers cannot set custom headers on a
WebSocket handshake. `app/api/ws/deps.py::authenticate_ws()` decodes it the
same way `get_current_user()` does for REST (same `auth_version`/`is_active`
checks); on failure the server closes the socket with code `4401`.

**Delivery model**: `app/core/ws_manager.py::publish(channel, payload)`
publishes to Redis only (channel-prefixed `ws:<channel>`); a background
`redis_listener()` task (started in the FastAPI `lifespan`, retries with
backoff on a Redis outage) subscribes to `ws:*` and re-broadcasts to this
process's local connections — including messages this same process
published, so `publish()` deliberately does not also broadcast locally
(would double-deliver). If Redis is briefly down, WS delivery fails silently
rather than raising: chat still persists via the DB + REST history endpoint,
notifications still land via the DB + the `useUnreadCount` poll fallback.

**Chat** (`app/api/ws/chat.py`, `app/services/chat_service.py`): channel
`chat:project:{id}`, gated by the same `get_project_context()` project-team
membership check used by REST. Incoming `{"type":"message","content":...}`
frames go through the identical `ChatService.create_message()` path as the
REST fallback (`POST /api/v1/projects/{id}/messages`) — a single code path,
so the sender receives their own message back via the pub/sub broadcast
rather than a direct echo.

**Notifications** (`app/api/ws/notifications.py`): channel
`notif:user:{id}`. `NotificationService.push()` — the one choke point every
notification trigger already goes through — flushes (to get the
server-generated `id`/`created_at`) then calls `publish()`, so every
existing and future trigger gets real-time push automatically with no
per-call-site changes.

Frontend: `frontend/src/lib/ws-client.ts` is a small shared
reconnecting-WebSocket helper (exponential backoff, JSON parsing) used by
both `features/chat/hooks/useChatSocket.ts` and
`features/notifications/hooks/useNotifications.ts::useNotificationSocket()`.

---

## Security Architecture

### Authentication Flow

```
POST /api/v1/auth/login
  → verify password (bcrypt)
  → create access_token (JWT, 30min) + refresh_token (JWT, 7days)
  → return { access_token, refresh_token, token_type }

POST /api/v1/auth/refresh
  → validate refresh_token
  → return new access_token

Protected Endpoint:
  → Bearer token in Authorization header
  → get_current_user() dependency: decode JWT → load User from DB
  → require_roles(["PM", "BA"]) dependency: check user.roles intersection
```

### RBAC Implementation

```python
# FastAPI dependency
def require_roles(roles: List[str]):
    async def check(current_user = Depends(get_current_user)):
        user_roles = {r.name for r in current_user.roles}
        if not user_roles.intersection(roles) and not current_user.is_superuser:
            raise ForbiddenException()
    return check

# Usage in endpoint
@router.post("/projects/{id}/rollback/{version_id}")
async def rollback(
    ...,
    _: None = Depends(require_roles(["PM", "Admin"]))
):
```

---

## Configuration (Environment Variables)

File: `backend/.env.example`

| Biến | Mô tả |
|---|---|
| `DATABASE_URL` | `postgresql+asyncpg://user:pass@postgres:5432/dbname` |
| `DATABASE_POOL_SIZE` | `10` |
| `REDIS_URL` | `redis://redis:6379/0` |
| `CELERY_BROKER_URL` | `redis://redis:6379/1` |
| `CELERY_RESULT_BACKEND` | `redis://redis:6379/2` |
| `SECRET_KEY` | JWT signing key (strong random string) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | `7` |
| `ACTIVE_AI_PROVIDER` | `openai` hoặc `gemini` |
| `OPENAI_API_KEY` | OpenAI API key |
| `OPENAI_MODEL` | `gpt-4o` |
| `GEMINI_API_KEY` | Google Gemini API key |
| `GEMINI_MODEL` | `gemini-pro` |
| `MINIO_ENDPOINT` | `minio:9000` |
| `MINIO_ACCESS_KEY` | MinIO access key |
| `MINIO_SECRET_KEY` | MinIO secret key |
| `MINIO_BUCKET` | `ai-project-files` |
| `SMTP_HOST` | SMTP server |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | SMTP username |
| `SMTP_PASSWORD` | SMTP password |
| `CORS_ORIGINS` | `["http://localhost:3000"]` |

File: `frontend/.env.example`

| Biến | Mô tả |
|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000/api/v1` |
| `NEXT_PUBLIC_WS_URL` | `ws://localhost:8000` — bare origin; the app appends `/ws/...` itself (see [Real-Time Communication](#real-time-communication-websocket)) |

---

## Change History

| Version | Date | Thay đổi |
|---|---|---|
| 1.0 | 2026-06-25 | Phiên bản ban đầu |
| 2.0 | 2026-08-05 | Cập nhật toàn diện: Next.js 15 (thay Vite), 7 Domains/31 Tables, thêm chi tiết Layered Architecture, Repository Pattern, 34 Permissions, 13 Notification types, chi tiết Celery tasks, CPM fields, security flow |
| 2.1 | 2026-08-13 | Đã hoàn thành Auth & User Onboarding Module (Login, Register, Google & Facebook OAuth, Password recovery, Email verification, Edge JWT Guard, Auth Services & Store). Cập nhật tài liệu sát thực tế. |
| 2.2 | 2026-08-22 | Đã hoàn thành Admin panel (user/role/permission CRUD + audit log), Notification triggers (task start/due-soon/change → toàn bộ project team, qua Celery Beat daily sweep), và Chat module (project-scoped, real-time). Thêm mục "Real-Time Communication (WebSocket)": `/ws/chat/{project_id}` và `/ws/notifications`, Redis pub/sub bridge (`app/core/ws_manager.py`), JWT-via-query-param auth handshake. Sửa `NEXT_PUBLIC_WS_URL` thành bare origin (trước đây tài liệu ghi nhầm có sẵn `/ws`). |

---

*Cập nhật lần cuối: 2026-08-22 — Version 2.2 — Stack: Python FastAPI + Next.js 15*
