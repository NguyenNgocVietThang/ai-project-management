# Cấu trúc Thư mục Dự án
## Hệ thống AI Project Planning & Portfolio Management

> Stack: **Python (FastAPI)** + **Next.js 15 (React + TypeScript)**

---

## Tổng quan thư mục gốc

```
AI Project Planning & Portfolio Management system/
├── backend/                    # Python FastAPI backend
├── frontend/                   # Next.js 15 (React + TypeScript) frontend
├── docker-compose.yml          # Orchestration toàn bộ services
├── .gitignore
├── README.md
├── PROJECT_STRUCTURE.md        # File này
├── PROJECT_INSTRUCTION.md      # Hướng dẫn chi tiết hệ thống
├── erd_ai_project_management.html  # ERD diagram (HTML)
└── .documents/
    └── specs/
        └── system-architecture/    # Đặc tả hệ thống (BRD, SRS, Design, SOP)
```

---

## Backend (Python — FastAPI)

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app entrypoint + lifespan + CORS
│   ├── api/
│   │   ├── __init__.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── router.py       # Tổng hợp tất cả 32 routers vào api_router
│   │       └── endpoints/      # Các route handler theo module (32 files)
│   │           ├── __init__.py
│   │           ├── auth.py     # Register, Login, Forgot, Reset, Verify
│   │           ├── oauth.py    # Google & Facebook OAuth endpoints
│   │           ├── users.py
│   │           ├── roles.py
│   │           ├── permissions.py
│   │           ├── portfolios.py
│   │           ├── projects.py
│   │           ├── phases.py
│   │           ├── sprints.py
│   │           ├── epics.py
│   │           ├── milestones.py
│   │           ├── tasks.py
│   │           ├── subtasks.py
│   │           ├── dependencies.py
│   │           ├── assignments.py
│   │           ├── worklogs.py
│   │           ├── leaves.py
│   │           ├── skills.py
│   │           ├── documents.py
│   │           ├── approvals.py
│   │           ├── change_requests.py
│   │           ├── gantt.py
│   │           ├── cpm.py
│   │           ├── resource_leveling.py
│   │           ├── dashboards.py
│   │           ├── reports.py
│   │           ├── notifications.py
│   │           ├── audit_timeline.py
│   │           ├── project_versions.py
│   │           ├── ai.py
│   │           └── system.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py           # Settings (Pydantic BaseSettings — đọc từ .env)
│   │   ├── security.py         # JWT (create_access_token, decode_token) + bcrypt
│   │   ├── dependencies.py     # get_db, get_current_user, require_roles()
│   │   └── exceptions.py       # Custom HTTP exceptions
│   ├── models/                 # SQLAlchemy ORM models (31 files — 7 Domains)
│   │   ├── __init__.py
│   │   ├── base.py             # DeclarativeBase + id, created_at, updated_at
│   │   ├── associations.py     # user_roles, role_permissions, user_skills, project_members
│   │   │── ─── Domain 2: User & RBAC ─────────────────────────────────────────
│   │   ├── user.py             # email, username, full_name, hashed_password, google_id,
│   │   │                       #   facebook_id, auth_provider, email_verified, avatar_url, ...
│   │   ├── role.py             # name, description -> M2M users & permissions
│   │   ├── permission.py       # resource, action, description
│   │   ├── skill.py            # name, category -> M2M users
│   │   ├── leave.py            # user_id, start_date, end_date, leave_type, status
│   │   │── ─── Domain 3: Project Core ────────────────────────────────────────
│   │   ├── portfolio.py        # name, description, owner_id
│   │   ├── project.py          # name, status, start_date, end_date, progress, budget, ...
│   │   ├── phase.py            # name, order, start_date, end_date, project_id
│   │   ├── sprint.py           # name, goal, start_date, end_date, status, project_id
│   │   ├── epic.py             # name, description, color, project_id
│   │   ├── milestone.py        # name, due_date, is_completed, project_id
│   │   │── ─── Domain 4: Task & Scheduling ──────────────────────────────────
│   │   ├── task.py             # name, status, priority, story_points, CPM fields...
│   │   ├── subtask.py          # name, is_completed, task_id
│   │   ├── dependency.py       # predecessor_id, successor_id, dependency_type (FS/SS/FF/SF)
│   │   ├── assignment.py       # task_id, user_id, allocated_hours
│   │   ├── worklog.py          # task_id, user_id, hours_logged, log_date, note
│   │   ├── comment.py          # task_id, user_id, content
│   │   │── ─── Domain 5: Change Management ──────────────────────────────────
│   │   ├── change_request.py   # title, description, status, priority, project_id, ...
│   │   ├── approval.py         # change_request_id, approver_id, role, status, comment
│   │   ├── impact_report.py    # change_request_id, scope_impact, time_impact, ...
│   │   ├── project_version.py  # project_id, version_number, snapshot (JSON), created_by
│   │   ├── audit_log.py        # entity_type, entity_id, action, old_value, new_value, ...
│   │   │── ─── Domain 6: AI ──────────────────────────────────────────────────
│   │   ├── ai_request.py       # task_type, prompt, provider, model, status, ...
│   │   ├── ai_output.py        # ai_request_id, raw_response (JSON), parsed_data (JSON)...
│   │   ├── risk_report.py      # project_id, risks (JSON), overall_risk_level, ai_summary
│   │   │── ─── Domain 7: Document & Notification ────────────────────────────
│   │   ├── document.py         # project_id, name, file_type, minio_key, size_bytes, ...
│   │   ├── notification.py     # user_id, title, message, notification_type (13 types)...
│   │   └── email_log.py        # to_email, subject, status, sent_at, error_message
│   ├── schemas/                # Pydantic v2 schemas
│   │   ├── __init__.py
│   │   ├── auth.py             # LoginRequest, RegisterRequest, TokenResponse, ResetPassword...
│   │   ├── user.py             # UserCreate, UserUpdate, UserResponse
│   │   ├── project.py          # ProjectCreate, ProjectUpdate, ProjectResponse
│   │   ├── task.py             # TaskCreate, TaskUpdate, TaskResponse (+ CPM fields)
│   │   ├── gantt.py            # GanttTask, GanttLink, GanttChartResponse
│   │   ├── dashboard.py        # DashboardStats, BurndownData, EVAMetrics
│   │   ├── ai.py               # AIGenerateRequest, AIJobStatus, AIOutputResponse
│   │   └── common.py           # PaginatedResponse, MessageResponse, ErrorResponse
│   ├── services/               # Business logic layer
│   │   ├── __init__.py
│   │   ├── auth_service.py     # Register, Login, Refresh, Password recovery
│   │   ├── oauth_service.py    # Google & Facebook OAuth handlers
│   │   └── ai/                 # AI provider abstraction layer
│   │       ├── __init__.py
│   │       ├── base.py             # BaseAIProvider (ABC): generate_text(), generate_json()
│   │       ├── openai_provider.py  # OpenAI implementation
│   │       ├── gemini_provider.py  # Google Gemini implementation
│   │       └── project_generator.py # SOP-AI-001: sinh project plan từ prompt
│   ├── repositories/           # Data access layer (Repository Pattern)
│   │   ├── __init__.py
│   │   ├── base_repository.py      # Generic CRUD
│   │   ├── user_repository.py      # get_by_email, get_by_username
│   │   ├── project_repository.py   # get_projects_by_pm, get_with_members
│   │   └── task_repository.py      # get_tasks_by_project, get_critical_tasks
│   ├── db/
│   │   ├── __init__.py
│   │   ├── session.py          # AsyncEngine, AsyncSessionLocal, get_db()
│   │   ├── base.py             # Import tất cả models cho Alembic
│   │   └── seed.py             # Seed script: 7 Roles, 34 Permissions, 1 Admin user
│   ├── templates/              # Email Jinja2 templates
│   │   └── email/
│   │       ├── reset_password.html
│   │       ├── verify_email.html
│   │       └── welcome.html
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── email.py            # FastAPI-Mail async sending utility
│   │   ├── cpm.py              # CPM Algorithm
│   │   ├── date_utils.py       # Date helper functions
│   │   └── pagination.py       # Pagination utilities
│   ├── workers/                # Celery async task workers
│   │   ├── __init__.py
│   │   ├── celery_app.py       # Celery config
│   │   ├── ai_tasks.py         # AI processing tasks
│   │   ├── report_tasks.py     # Report generation jobs (DOCX, XLSX)
│   │   └── email_tasks.py      # Email sending jobs (SMTP)
│   └── main.py                 # FastAPI app entry point
├── alembic/                    # Database migrations
├── tests/                      # Unit & integration tests
├── requirements.txt            # Production dependencies
├── pyproject.toml              # Tool config (black, isort, ruff, mypy, pytest)
├── alembic.ini                 # Alembic config
├── Dockerfile                  # Multi-stage build FastAPI app
└── .env.example                # Template biến môi trường
```

### API Prefix & Routes

Tất cả endpoints có prefix `/api/v1/`. Ví dụ:

| Endpoint group | Prefix |
|---|---|
| Auth | `/api/v1/auth` |
| OAuth | `/api/v1/oauth` |
| Users | `/api/v1/users` |
| Projects | `/api/v1/projects` |
| Tasks | `/api/v1/tasks` |
| Gantt | `/api/v1/gantt` |
| CPM | `/api/v1/cpm` |
| Resource Leveling | `/api/v1/resource-leveling` |
| AI | `/api/v1/ai` |
| Audit | `/api/v1/audit` |
| Project Versions | `/api/v1/versions` |
| System | `/api/v1/system` |

> API Docs tự động: **http://localhost:8000/docs** (Swagger UI) | **http://localhost:8000/redoc**

---

## Frontend (Next.js 15 — React + TypeScript)

> **Trạng thái:** Auth Module đã hoàn thành đầy đủ. Thư mục `services`, `hooks`, `store`, `middleware` và các trang `(auth)` đã triển khai.

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth routes
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   ├── reset-password/page.tsx
│   │   │   ├── verify-email/page.tsx
│   │   │   └── oauth-callback/page.tsx
│   │   ├── (dashboard)/        # Dashboard routes
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   └── profile/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── features/               # Feature-based modules (18 thư mục)
│   │   ├── auth/               # LoginForm, RegisterForm, SocialLoginButtons, ...
│   │   ├── dashboard/
│   │   ├── portfolio/
│   │   ├── projects/
│   │   ├── tasks/
│   │   └── ...
│   ├── components/             # Shared UI components
│   ├── services/               # API call layer (Axios)
│   │   ├── api.ts              # Axios instance + interceptors
│   │   ├── auth.service.ts     # Auth & OAuth endpoints
│   │   ├── portfolio.service.ts
│   │   ├── project.service.ts
│   │   ├── task.service.ts
│   │   └── user.service.ts
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts          # Auth mutations & state
│   │   └── ...
│   ├── store/                  # Zustand global state
│   │   ├── authStore.ts        # JWT state + Cookie sync
│   │   └── ...
│   ├── middleware.ts           # Next.js Edge JWT route guard
│   ├── types/                  # TypeScript interfaces & enums
│   └── lib/                    # Utility functions
├── next.config.js              # Next.js config
├── tailwind.config.ts          # Tailwind CSS config
├── tsconfig.json               # TypeScript config
├── package.json                # Dependencies
└── .env.example
```

---

## Docker Compose (docker-compose.yml)

| Service | Image | Port |
|---|---|---|
| `postgres` | postgres:16-alpine | 5432 |
| `redis` | redis:7-alpine | 6379 |
| `minio` | minio/minio:latest | 9000 (API), 9001 (Console) |
| `backend` | ./backend Dockerfile | 8000 |
| `celery-worker` | ./backend Dockerfile | — |
| `frontend` | ./frontend Dockerfile | 3000 |

> Network: `ai-project-network`. Volumes: `postgres_data`, `redis_data`, `minio_data`.

---

## Database Schema — 7 Domains, 31+ Tables

### Bảng tổng hợp

| Domain | Tables | Mô tả |
|---|---|---|
| **1. Base & Associations** | `user_roles`, `role_permissions`, `user_skills`, `project_members` | M2M junction tables |
| **2. User & RBAC** | `users`, `roles`, `permissions`, `skills`, `leaves` | Tài khoản, phân quyền, nhân sự |
| **3. Project Core** | `portfolios`, `projects`, `phases`, `sprints`, `epics`, `milestones` | Cấu trúc dự án (WBS) |
| **4. Task & Scheduling** | `tasks`, `subtasks`, `dependencies`, `assignments`, `worklogs`, `comments` | Công việc + CPM + Timesheet |
| **5. Change Management** | `change_requests`, `approvals`, `impact_reports`, `project_versions`, `audit_logs` | CR workflow + lịch sử |
| **6. AI** | `ai_requests`, `ai_outputs`, `risk_reports` | AI job tracking + risk |
| **7. Document & Notification** | `documents`, `notifications`, `email_logs` | File storage + thông báo |

---

## Cấu hình chính (Settings — `core/config.py`)

| Biến | Default | Mô tả |
|---|---|---|
| `APP_NAME` | `AI Project Management API` | Tên app |
| `APP_VERSION` | `1.0.0` | Version |
| `API_V1_PREFIX` | `/api/v1` | Prefix tất cả routes |
| `CORS_ORIGINS` | `["http://localhost:5173", "http://localhost:3000"]` | Allowed origins |
| `DATABASE_URL` | `postgresql+asyncpg://...` | Async PostgreSQL |
| `REDIS_URL` | `redis://localhost:6379/0` | Redis (cache + pub/sub) |
| `CELERY_BROKER_URL` | `redis://localhost:6379/1` | Celery broker |
| `CELERY_RESULT_BACKEND` | `redis://localhost:6379/2` | Celery result store |
| `ACTIVE_AI_PROVIDER` | `openai` | `"openai"` hoặc `"gemini"` |
| `OPENAI_MODEL` | `gpt-4o` | Model OpenAI |
| `GEMINI_MODEL` | `gemini-pro` | Model Gemini |
| `MINIO_BUCKET` | `ai-project-files` | MinIO bucket |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | 30 | JWT access token TTL |
| `REFRESH_TOKEN_EXPIRE_DAYS` | 7 | JWT refresh token TTL |

---

## RBAC — Roles & Permissions (từ `db/seed.py`)

### 7 Roles

| Role | Mô tả |
|---|---|
| `Admin` | Quản trị hệ thống — toàn quyền (34 permissions) |
| `PM` | Project Manager — quản lý dự án, phân công tài nguyên |
| `BA` | Business Analyst — phân tích nghiệp vụ, duyệt Change Request |
| `PO` | Product Owner — duyệt Change Request về mặt nghiệp vụ |
| `Member` | Thành viên đội dự án — thực hiện task, ghi worklog |
| `Customer` | Khách hàng — tạo Change Request, theo dõi tiến độ |
| `Investor` | Nhà đầu tư — chỉ xem Dashboard (read-only) |

---

## AI Architecture

### AI Provider Abstraction

```
BaseAIProvider (ABC)          # base.py
├── generate_text(prompt, system_prompt) -> str
└── generate_json(prompt, system_prompt) -> Dict

OpenAIProvider                # openai_provider.py
GeminiProvider                # gemini_provider.py
ProjectGeneratorService       # project_generator.py (SOP-AI-001)
```

---

## CPM Algorithm (`utils/cpm.py`)

```python
# Dataclass
CPMNode(id, duration, successors, predecessors,
        early_start, early_finish, late_start, late_finish,
        float_days, is_critical)

# Pipeline
topological_sort(nodes)   -> order[]     # Kahn's Algorithm
forward_pass(nodes, order)              # ES = max(predecessor.EF), EF = ES + duration
backward_pass(nodes, order)             # LF = min(successor.LS), LS = LF - duration
                                        # float = LS - ES, is_critical = float < 0.001
compute_cpm(nodes) -> (nodes, critical_path[])
```

---

## Trạng thái triển khai

### Đã hoàn thành

- [x] Backend: SQLAlchemy models (31 models, 7 Domains)
- [x] Backend: FastAPI App, Alembic config, CORS & Lifespan
- [x] Backend: Auth Endpoints (`auth.py`, `oauth.py`) & OAuth Service (`oauth_service.py`)
- [x] Backend: Async Email Service (`email.py`) + HTML Jinja2 Email Templates
- [x] Backend: Core security (JWT create/verify, bcrypt hashing)
- [x] Backend: DB seed script (7 roles, 34 permissions, admin user)
- [x] Backend: CPM Algorithm & Celery Workers skeleton
- [x] Frontend: Auth Pages (`login`, `register`, `forgot-password`, `reset-password`, `verify-email`, `oauth-callback`)
- [x] Frontend: Edge JWT Route Protection (`middleware.ts`)
- [x] Frontend: Zustand Auth Store (`authStore.ts`) & `useAuth` hook
- [x] Frontend: Services layer (`auth.service.ts`, `portfolio.service.ts`, `project.service.ts`, `task.service.ts`, `user.service.ts`, `api.ts`)
- [x] Infrastructure: Docker Compose (6 services)

### Kế hoạch tiếp theo (Portfolio & Project Core Module)

- [x] Portfolio CRUD API & UI Pages
- [x] Project CRUD API & UI Pages + Member Management
- [x] Phase / Sprint / Epic / Milestone CRUD
- [x] Task Management + Kanban Board + Task Detail Drawer
- [x] Task Dependencies Graph & CPM recalculation trigger
- [x] Assignment & WorkLog (Timesheet)
- [ ] Portfolio & Project Dashboards

---

## Ghi chú

- Backend sử dụng **FastAPI (Python)** + **SQLAlchemy 2.x + Alembic**
- Frontend sử dụng **Next.js 15**, data layer dùng **Zustand + TanStack Query**
- Tham khảo `PROJECT_INSTRUCTION.md` để biết chi tiết về nghiệp vụ và SOP

---

*Cập nhật lần cuối: 2026-08-13 — Stack: Python FastAPI + Next.js 15*
