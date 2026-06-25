# Cấu trúc Thư mục Dự án
## Hệ thống AI Project Planning & Portfolio Management

> Stack: **Python (FastAPI)** + **React (Vite + TypeScript)**

---

## 📁 Tổng quan thư mục gốc

```
Đồ án tốt nghiệp/
├── backend/                    # Python FastAPI backend
├── frontend/                   # React (Vite + TypeScript) frontend
├── docker-compose.yml          # Orchestration toàn bộ services
├── .gitignore
├── README.md
├── PROJECT_STRUCTURE.md        # File này
├── PROJECT_INSTRUCTION.md      # Hướng dẫn chi tiết hệ thống
├── erd_ai_project_management.html  # ERD diagram
└── .kiro/
    └── specs/
        ├── database-setup/     # Spec thiết lập database
        └── python-react-migration/  # Spec migration sang Python + React
```

---

## ✅ Backend (Python — FastAPI)

```
backend/
├── app/
│   ├── main.py                 # FastAPI app entrypoint
│   ├── api/
│   │   └── v1/
│   │       ├── router.py       # Tổng hợp tất cả routers
│   │       └── endpoints/      # Các route handler theo module
│   │           ├── auth.py
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
│   │   ├── config.py           # Settings (Pydantic BaseSettings)
│   │   ├── security.py         # JWT, password hashing (bcrypt)
│   │   ├── dependencies.py     # FastAPI Depends() (DB session, current user)
│   │   └── exceptions.py       # Custom HTTP exceptions
│   ├── models/                 # SQLAlchemy ORM models
│   │   ├── base.py
│   │   ├── user.py
│   │   ├── role.py
│   │   ├── permission.py
│   │   ├── portfolio.py
│   │   ├── project.py
│   │   ├── phase.py
│   │   ├── sprint.py
│   │   ├── epic.py
│   │   ├── milestone.py
│   │   ├── task.py
│   │   ├── subtask.py
│   │   ├── dependency.py
│   │   ├── assignment.py
│   │   ├── worklog.py
│   │   ├── leave.py
│   │   ├── skill.py
│   │   ├── document.py
│   │   ├── approval.py
│   │   ├── change_request.py
│   │   ├── notification.py
│   │   ├── audit_log.py
│   │   └── project_version.py
│   ├── schemas/                # Pydantic schemas (request/response DTOs)
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── role.py
│   │   ├── portfolio.py
│   │   ├── project.py
│   │   ├── task.py
│   │   ├── gantt.py
│   │   ├── dashboard.py
│   │   ├── ai.py
│   │   └── common.py           # Pagination, response wrappers
│   ├── services/               # Business logic layer
│   │   ├── auth_service.py
│   │   ├── user_service.py
│   │   ├── project_service.py
│   │   ├── task_service.py
│   │   ├── gantt_service.py
│   │   ├── cpm_service.py      # Critical Path Method engine
│   │   ├── resource_service.py
│   │   ├── report_service.py
│   │   ├── notification_service.py
│   │   ├── email_service.py
│   │   ├── storage_service.py  # MinIO S3-compatible
│   │   └── ai/
│   │       ├── base.py         # Abstract AI provider
│   │       ├── openai_provider.py
│   │       ├── gemini_provider.py
│   │       ├── project_generator.py  # SOP-AI-001
│   │       ├── impact_analysis.py    # SOP-AI-002
│   │       ├── schedule_optimizer.py # SOP-AI-003
│   │       ├── resource_recommender.py # SOP-RM-001
│   │       ├── risk_analyzer.py      # SOP-AI-005
│   │       └── document_parser.py    # SOP-DOC-001
│   ├── repositories/           # Data access layer (DB queries)
│   │   ├── base_repository.py
│   │   ├── user_repository.py
│   │   ├── project_repository.py
│   │   ├── task_repository.py
│   │   └── ...
│   ├── db/
│   │   ├── session.py          # SQLAlchemy engine & session
│   │   └── base.py             # Import all models for Alembic
│   ├── workers/                # Celery async task workers
│   │   ├── celery_app.py       # Celery configuration
│   │   ├── ai_tasks.py         # AI async jobs
│   │   ├── report_tasks.py     # Report generation jobs
│   │   └── email_tasks.py      # Email sending jobs
│   └── utils/
│       ├── cpm.py              # CPM algorithm (Topological Sort + Forward/Backward Pass)
│       ├── date_utils.py
│       └── pagination.py
├── alembic/                    # Database migrations (thay Prisma)
│   ├── env.py
│   ├── script.py.mako
│   └── versions/               # Migration files
├── tests/
│   ├── conftest.py
│   ├── unit/
│   └── integration/
├── requirements.txt            # Production dependencies
├── requirements-dev.txt        # Dev dependencies (pytest, black, etc.)
├── pyproject.toml              # Tool config (black, isort, mypy)
├── alembic.ini                 # Alembic config
├── Dockerfile
├── .dockerignore
└── .env.example
```

### Công nghệ Backend (Python)

| Thành phần | Thư viện |
|---|---|
| Framework | FastAPI |
| ORM | SQLAlchemy 2.x |
| Migrations | Alembic |
| Validation | Pydantic v2 |
| Auth | python-jose (JWT), passlib (bcrypt) |
| Queue/Worker | Celery + Redis |
| Cache | Redis (redis-py) |
| AI | openai, google-generativeai |
| Storage | minio (S3-compatible) |
| Email | FastMail / smtplib |
| Export | python-docx, openpyxl |
| Testing | pytest, pytest-asyncio, httpx |
| Linting | black, isort, ruff, mypy |

---

## ✅ Frontend (React — Vite + TypeScript)

```
frontend/
├── public/
│   ├── favicon.ico
│   └── assets/
├── src/
│   ├── main.tsx                # React entrypoint
│   ├── App.tsx                 # Root component + Router setup
│   ├── router/
│   │   └── index.tsx           # React Router v6 routes
│   ├── features/               # Feature-based modules
│   │   ├── auth/               # Login, register, reset password
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── store/
│   │   ├── dashboard/          # Portfolio & Project dashboards
│   │   ├── portfolio/          # Portfolio management
│   │   ├── projects/           # Project management
│   │   ├── gantt/              # Gantt Chart + drag & drop
│   │   ├── phases/             # Phase management UI
│   │   ├── sprints/            # Sprint board UI (Kanban)
│   │   ├── epics/              # Epic management UI
│   │   ├── milestones/         # Milestone tracker
│   │   ├── tasks/              # Task management + dependency graph
│   │   ├── resources/          # Resource management + workload
│   │   ├── documents/          # BRD/SRS upload & AI viewer
│   │   ├── approvals/          # CR & approval workflow UI
│   │   ├── reports/            # Report export UI (DOCX, XLSX)
│   │   ├── audit/              # Audit timeline view
│   │   ├── versions/           # Version history & rollback UI
│   │   └── ai/                 # AI prompt input + result viewer
│   ├── components/             # Shared UI components
│   │   ├── gantt/              # Gantt Chart component (custom)
│   │   ├── charts/             # Burndown, Burnup, Velocity, EVA
│   │   ├── tables/             # Data tables (TanStack Table)
│   │   ├── dialogs/            # Modal & drawer components
│   │   ├── forms/              # Form components (React Hook Form)
│   │   ├── layout/             # Sidebar, Header, PageWrapper
│   │   └── ui/                 # Base UI (Button, Badge, Alert, Input...)
│   ├── services/               # API call layer (axios)
│   │   ├── api.ts              # Axios instance + interceptors
│   │   ├── auth.service.ts
│   │   ├── project.service.ts
│   │   ├── task.service.ts
│   │   ├── gantt.service.ts
│   │   ├── ai.service.ts
│   │   └── ...
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useProjects.ts
│   │   ├── useTasks.ts
│   │   └── ...
│   ├── store/                  # Zustand global state
│   │   ├── authStore.ts
│   │   ├── projectStore.ts
│   │   └── uiStore.ts
│   ├── types/                  # TypeScript interfaces & enums
│   │   ├── auth.types.ts
│   │   ├── project.types.ts
│   │   ├── task.types.ts
│   │   └── api.types.ts
│   ├── lib/                    # Utility functions
│   │   ├── utils.ts
│   │   ├── date.ts
│   │   ├── cpm.ts              # CPM visualization helpers
│   │   └── validators.ts
│   └── styles/
│       └── index.css           # Global styles + Tailwind
├── index.html
├── vite.config.ts              # Vite config
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── Dockerfile
├── .dockerignore
└── .env.example
```

### Công nghệ Frontend (React)

| Thành phần | Thư viện |
|---|---|
| Framework | React 18 + Vite |
| Language | TypeScript |
| Routing | React Router v6 |
| State | Zustand |
| Server State | TanStack Query (React Query) v5 |
| HTTP | Axios |
| UI/CSS | Tailwind CSS v3 |
| Forms | React Hook Form + Zod |
| Tables | TanStack Table v8 |
| Charts | Recharts |
| Gantt | Custom hoặc @dhtmlx/gantt |
| Drag & Drop | @dnd-kit |
| Icons | Lucide React |
| Date | date-fns |
| Notifications | react-hot-toast |

---

## 📋 Các bước tiếp theo

### 1. Backend (Python)
- [ ] Tạo virtual environment & cài `requirements.txt`
- [ ] Setup Alembic migrations từ models SQLAlchemy
- [ ] Implement `core/security.py` (JWT, bcrypt)
- [ ] Implement CPM algorithm trong `utils/cpm.py`
- [ ] Setup Celery workers cho AI async jobs
- [ ] Tạo guards/dependencies (RBAC) trong `core/dependencies.py`
- [ ] Implement tất cả service layer theo module

### 2. Frontend (React + Vite)
- [ ] Khởi tạo project với `npm create vite@latest`
- [ ] Setup React Router v6 với protected routes
- [ ] Implement Authentication flow (login, refresh token)
- [ ] Tạo Gantt Chart component
- [ ] Implement Dashboard với các Chart (Burndown, EVA, CPI)
- [ ] Tạo các feature modules còn lại

### 3. Database
- [ ] Setup PostgreSQL instance
- [ ] Chạy Alembic migrations
- [ ] Tạo seed script cho roles và permissions
- [ ] Setup Redis cho Celery broker & cache
- [ ] Setup MinIO cho file storage

### 4. Deployment
- [ ] Cập nhật docker-compose.yml cho Python backend
- [ ] Tạo Dockerfile cho FastAPI app
- [ ] Configure environment variables
- [ ] Setup CI/CD pipeline

---

## 🎯 Giai đoạn phát triển

### Phase 1 — Core (ưu tiên)
- Auth + RBAC
- Portfolio & Project CRUD
- Task management + Dependency graph
- CPM engine (Topological Sort + Forward/Backward Pass)
- Gantt Chart (render + drag & drop)
- Resource Assignment + Overload warning

### Phase 2 — AI Features
- AI Project Generator (SOP-AI-001)
- AI Impact Analysis (SOP-AI-002)
- AI Schedule Optimization (SOP-AI-003)
- AI Resource Recommendation (SOP-RM-001)
- AI Risk Analysis (SOP-AI-005)

### Phase 3 — Workflow & Reporting
- Change Request & Approval Workflow
- Project Versioning & Rollback
- Dashboard (Gantt, Burndown, Velocity, EVA, CPI, SPI)
- Report Export (DOCX, XLSX)
- Audit Timeline
- Email Notifications

### Phase 4 — Document AI & Polish
- BRD/SRS Upload + AI Document Parser
- Investor Dashboard (read-only)
- Performance optimization
- Mobile responsive

---

## 📝 Ghi chú

- Backend đã được chuyển từ **NestJS (TypeScript)** → **FastAPI (Python)**
- Frontend đã được chuyển từ **Next.js 15** → **React + Vite (TypeScript)**
- ORM chuyển từ **Prisma** → **SQLAlchemy 2.x + Alembic**
- Queue chuyển từ **BullMQ** → **Celery + Redis**
- Toàn bộ modules & tính năng được giữ nguyên, chỉ thay đổi công nghệ
- Database schema đã có spec chi tiết trong `.kiro/specs/database-setup/`
- Tham khảo PROJECT_INSTRUCTION.md để biết chi tiết về từng module và SOP

---

*Cập nhật lần cuối: 2026-06-25 — Stack: Python FastAPI + React Vite*
