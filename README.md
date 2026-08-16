# AI Project Planning & Portfolio Management System

> **Hệ thống quản lý dự án thông minh tích hợp AI — tương đương MS Project với lớp AI tự động phân tích, đề xuất và tối ưu hóa kế hoạch.**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_0.115-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js_15_(React_18)-black?logo=next.js)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_16-336791?logo=postgresql)](https://www.postgresql.org)
[![Celery](https://img.shields.io/badge/Queue-Celery_%2B_Redis-37814A?logo=celery)](https://docs.celeryq.dev)
[![OpenAI & Gemini](https://img.shields.io/badge/AI-OpenAI_GPT--4o_%7C_Gemini_Pro-412991)](https://openai.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Mục lục

1. [Tổng quan dự án](#1-tổng-quan-dự-án)
2. [Kiến trúc hệ thống](#2-kiến-trúc-hệ-thống)
3. [Technology Stack](#3-technology-stack)
4. [Phân cấp cấu trúc dự án (WBS)](#4-phân-cấp-cấu-trúc-dự-án-wbs)
5. [Cấu trúc thư mục dự án](#5-cấu-trúc-thư-mục-dự-án)
6. [Database Schema (7 Domains & 32+ Tables)](#6-database-schema-7-domains--32-tables)
7. [Hệ thống phân quyền (RBAC)](#7-hệ-thống-phân-quyền-rbac)
8. [Quy trình vận hành chuẩn (SOP)](#8-quy-trình-vận-hành-chuẩn-sop)
9. [Thuật toán cốt lõi & Luồng AI](#9-thuật-toán-cốt-lõi--luồng-ai)
10. [API Specification & Endpoints](#10-api-specification--endpoints)
11. [Cài đặt và Chạy hệ thống](#11-cài-đặt-và-chạy-hệ-thống)
12. [Cấu hình & Biến môi trường](#12-cấu-hình--biến-môi-trường)
13. [Quy tắc phát triển](#13-quy-tắc-phát-triển)
14. [Roadmap phát triển](#14-roadmap-phát-triển)
15. [Tài liệu tham khảo & Thuật ngữ](#15-tài-liệu-tham-khảo--thuật-ngữ)
16. [License & Contributors](#16-license--contributors)

---

## 1. Tổng quan dự án

Xây dựng một **web application quản lý dự án thông minh** tích hợp AI, tương đương MS Project nhưng có thêm lớp AI tự động phân tích, đề xuất và tối ưu kế hoạch. Hệ thống phục vụ nhiều vai trò (multi-role) và quản lý theo cấu trúc phân cấp Portfolio → Project → Task.

### Mục tiêu cốt lõi:
- **Quản lý danh mục dự án (Portfolio & Project Management)** theo chuẩn PMI/Agile lai.
- **Sinh kế hoạch dự án tự động (AI Project Generator)** từ prompt ngôn ngữ tự nhiên bằng AI (OpenAI/Gemini).
- **Tính toán Critical Path (CPM)**, Topological Sort, Resource Leveling tự động.
- **Phân tích tác động thay đổi (AI Impact Analysis)** và tối ưu lịch (Schedule Optimization) khi có Change Request.
- **Dashboard đa chiều**: Gantt Chart, Burndown, Burnup, Velocity, EVA, CPI, SPI.
- **Quản lý phiên bản dự án (Versioning & Rollback)**, xuất báo cáo DOCX/XLSX, ghi nhận Audit Log toàn diện.

---

## 2. Kiến trúc hệ thống

```
┌────────────────────────────────────────────────────────┐
│               Frontend (Next.js 15 / React 18)         │
│          Dashboard + Interactive Gantt + UI/UX         │
└───────────────────────────┬────────────────────────────┘
                            │ REST API / WebSocket
                            ▼
┌────────────────────────────────────────────────────────┐
│             FastAPI Backend (Python 3.11+)             │
└──────┬────────────────────┬────────────────────┬───────┘
       │                    │                    │
  ┌────▼────────┐      ┌────▼────────┐     ┌─────▼────────┐
  │ PostgreSQL  │      │ Redis Cache │     │    MinIO     │
  │ (SQLAlchemy)│      │  & Session  │     │(File Storage)│
  └─────────────┘      └────┬────────┘     └──────────────┘
                            │
                       ┌────▼────────┐
                       │Celery Worker│ (Async Job Queue)
                       └────┬────────┘
                            │
               ┌────────────▼────────────┐
               │    AI Provider Layer    │
               │  ├─ OpenAI (GPT-4o)     │
               │  └─ Google Gemini Pro   │
               └─────────────────────────┘
```

### AI Provider Architecture

```
BaseAIProvider (ABC: generate_text, generate_json)
├── OpenAIProvider (openai_provider.py)
├── GeminiProvider (gemini_provider.py)
└── AI Services:
    ├── ProjectGeneratorService (SOP-AI-001)
    ├── ImpactAnalysisService (SOP-AI-002)
    ├── ScheduleOptimizationService (SOP-AI-003)
    ├── ResourceRecommendationService (SOP-RM-001)
    ├── RiskAnalysisService (SOP-AI-005)
    └── DocumentParserService (SOP-DOC-001)
```

---

## 3. Technology Stack

### Backend (Python)
| Thành phần | Công nghệ / Thư viện | Mô tả |
|---|---|---|
| **Framework** | **FastAPI 0.115+** | Asynchronous Web Framework |
| **Language** | Python 3.11+ | Type hints, async/await |
| **ORM** | **SQLAlchemy 2.0+ (Async)** | Async ORM & Session management |
| **Migrations** | **Alembic** | Database Schema Migration |
| **Validation** | **Pydantic v2** | Data parsing & validation |
| **Auth & Security** | `python-jose`, `passlib[bcrypt]` | JWT Tokens, Refresh Tokens, Password Hashing |
| **Queue / Worker** | **Celery + Redis** | Background tasks & AI async processing |
| **Caching** | Redis (`redis-py`) | In-memory caching & session store |
| **AI Providers** | `openai`, `google-generativeai` | OpenAI GPT-4o & Google Gemini Pro APIs |
| **File Storage** | `minio` (S3-compatible) | BRD, SRS, deliverable file attachments |
| **Email Service** | `FastAPI-Mail` / `smtplib` + Jinja2 | Email templates (verification, notifications) |
| **Reporting & Export** | `python-docx`, `openpyxl` | DOCX and XLSX export engines |
| **Testing** | `pytest`, `pytest-asyncio`, `httpx` | Unit & Integration testing |

### Frontend (React / TypeScript)
| Thành phần | Công nghệ / Thư viện | Mô tả |
|---|---|---|
| **Framework** | **Next.js 15 (React 18)** | React Framework với App Router |
| **Language** | TypeScript | Full type-safety |
| **Routing** | **Next.js App Router** | File-based routing (`src/app/`) |
| **State (Global)** | **Zustand** | Lightweight global state management |
| **State (Server)** | **TanStack Query v5** | Server state caching & mutation sync |
| **HTTP Client** | **Axios** | Interceptors for JWT & error handling |
| **Styling** | **Tailwind CSS v3** | Utility-first CSS |
| **Forms** | **React Hook Form + Zod** | Schema-based form validation |
| **Tables** | **TanStack Table v8** | Headless data tables |
| **Charts** | **Recharts** | Burndown, Burnup, Velocity, EVA charts |
| **Drag & Drop** | `@dnd-kit/core` | Task reordering, Kanban, Gantt manipulation |
| **Icons** | `lucide-react` | Modern icon system |

---

## 4. Phân cấp cấu trúc dự án (WBS)

Hệ thống quản lý dữ liệu theo cấu trúc phân rã công việc (Work Breakdown Structure - WBS):

```
Portfolio
└── Project
     ├── Phase
     ├── Sprint
     ├── Epic
     ├── Milestone
     └── Task
          └── SubTask
               ├── Dependencies (Finish-to-Start FS, SS, FF, SF)
               ├── Assignments (Phân công nhân sự)
               ├── WorkLogs (Timesheet giờ thực tế)
               └── Comments (Thảo luận trao đổi)
```

---

## 5. Cấu trúc thư mục dự án

### Tổng quan thư mục gốc

```
AI Project Planning & Portfolio Management system/
├── backend/                        # Python FastAPI backend source code
├── frontend/                       # Next.js 15 (React + TypeScript) frontend source code
├── docker-compose.yml              # Orchestration toàn bộ services
├── erd_ai_project_management.html  # ERD diagram (Interactive HTML)
├── .documents/                     # Tài liệu thiết kế hệ thống
│   └── specs/system-architecture/  # BRD, SRS, Design, Sequence SOP Diagrams
├── ROADMAP_PHASE_1_AUTH_MODULE.md              # Chi tiết triển khai Phase 1: Auth Module
├── ROADMAP_PHASE_2_PORTFOLIO_PROJECT_MODULE.md # Chi tiết triển khai Phase 2: Core
├── ROADMAP_PHASE_3_AI_FEATURES_MODULE.md       # Chi tiết triển khai Phase 3: AI Features
├── ROADMAP_PHASE_4_WORKFLOW_REPORTING_MODULE.md # Chi tiết triển khai Phase 4: Workflow
├── ROADMAP_PHASE_5_DOCUMENT_AI_POLISH_MODULE.md # Chi tiết triển khai Phase 5: Polish
└── README.md                                   # Tài liệu hướng dẫn toàn diện hệ thống (File này)
```

---

### Backend (Python — FastAPI)

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                     # FastAPI app entrypoint + lifespan + CORS
│   ├── api/
│   │   ├── __init__.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── router.py           # Tổng hợp tất cả 32 routers vào api_router
│   │       └── endpoints/          # Các route handlers (32 files theo module)
│   │           ├── __init__.py
│   │           ├── auth.py         # Register, Login, Forgot, Reset, Verify
│   │           ├── oauth.py        # Google & Facebook OAuth endpoints
│   │           ├── users.py        # User CRUD & Profile
│   │           ├── roles.py        # Role management
│   │           ├── permissions.py  # Permission management
│   │           ├── portfolios.py   # Portfolio CRUD
│   │           ├── projects.py     # Project CRUD + Member management
│   │           ├── phases.py       # Phase management
│   │           ├── sprints.py      # Sprint management
│   │           ├── epics.py        # Epic management
│   │           ├── milestones.py   # Milestone tracking
│   │           ├── tasks.py        # Task CRUD + CPM trigger
│   │           ├── subtasks.py     # Subtask CRUD
│   │           ├── dependencies.py # Task dependencies graph
│   │           ├── assignments.py  # Resource assignments
│   │           ├── worklogs.py     # Timesheet worklog tracking
│   │           ├── leaves.py       # Member leave management
│   │           ├── skills.py       # Skill catalog
│   │           ├── documents.py    # Document upload & MinIO linkage
│   │           ├── approvals.py    # Approval multi-step workflow
│   │           ├── change_requests.py # Change Request management
│   │           ├── gantt.py        # Gantt Chart data API
│   │           ├── cpm.py          # Critical Path calculation trigger
│   │           ├── resource_leveling.py # Overload checking API
│   │           ├── dashboards.py   # Dashboard aggregations (EVA, CPI, SPI)
│   │           ├── reports.py      # DOCX & XLSX export
│   │           ├── notifications.py # Notification management
│   │           ├── audit_timeline.py # Audit log history
│   │           ├── project_versions.py # Snapshot & Rollback
│   │           ├── ai.py           # AI generation, impact, risk endpoints
│   │           └── system.py       # Health check & system configuration
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py               # Settings (Pydantic BaseSettings đọc từ .env)
│   │   ├── security.py             # JWT create/decode + bcrypt hashing
│   │   ├── dependencies.py         # get_db, get_current_user, require_roles()
│   │   └── exceptions.py           # Custom exception handlers
│   ├── models/                     # SQLAlchemy ORM models (31 models — 7 Domains)
│   │   ├── __init__.py
│   │   ├── base.py                 # Base model with id, created_at, updated_at
│   │   ├── associations.py         # M2M: user_roles, role_permissions, user_skills, project_members
│   │   ├── user.py, role.py, permission.py, skill.py, leave.py (User & RBAC)
│   │   ├── portfolio.py, project.py, phase.py, sprint.py, epic.py, milestone.py (Project Core)
│   │   ├── task.py, subtask.py, dependency.py, assignment.py, worklog.py, comment.py (Task & CPM)
│   │   ├── change_request.py, approval.py, impact_report.py, project_version.py, audit_log.py (Change Mgmt)
│   │   ├── ai_request.py, ai_output.py, risk_report.py (AI Domain)
│   │   └── document.py, notification.py, email_log.py (Document & Notification)
│   ├── schemas/                    # Pydantic v2 schemas (Request/Response)
│   │   ├── __init__.py
│   │   ├── auth.py, user.py, project.py, task.py, gantt.py, dashboard.py, ai.py, common.py...
│   ├── services/                   # Business logic layer
│   │   ├── __init__.py
│   │   ├── auth_service.py         # Auth logic, JWT issuance
│   │   ├── oauth_service.py        # Social OAuth verification
│   │   ├── cpm_service.py          # Critical Path engine
│   │   ├── resource_leveling.py    # Resource overload detector
│   │   ├── minio_service.py        # S3 storage interaction
│   │   └── ai/                     # AI provider implementations
│   │       ├── base.py, openai_provider.py, gemini_provider.py, project_generator.py...
│   ├── repositories/               # Data access layer (Repository Pattern)
│   ├── db/
│   │   ├── __init__.py
│   │   ├── session.py              # AsyncEngine & async_sessionmaker
│   │   ├── base.py                 # Model aggregator for Alembic
│   │   └── seed.py                 # Seed script (7 Roles, 34 Permissions, Admin account)
│   ├── templates/                  # Jinja2 HTML email templates
│   ├── utils/                      # Utilities (cpm.py, date_utils.py, pagination.py, email.py)
│   └── workers/                    # Celery async task definitions
│       ├── celery_app.py, ai_tasks.py, report_tasks.py, email_tasks.py
├── alembic/                        # Database migration scripts
├── tests/                          # Automated tests (API & services)
├── requirements.txt                # Python dependencies
├── pyproject.toml                  # Linting & formatting config
├── Dockerfile                      # Backend container definition
└── .env.example
```

---

### Frontend (Next.js 15 — React + TypeScript)

```
frontend/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (auth)/                 # Auth routes (login, register, forgot, reset, verify, oauth)
│   │   ├── (dashboard)/            # Authenticated dashboard & project management views
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── portfolios/
│   │   │   ├── projects/
│   │   │   │   └── [id]/           # Project Detail (Overview, WBS, Gantt, Kanban, Team, Settings)
│   │   │   └── profile/
│   │   ├── globals.css             # Tailwind base & custom styles
│   │   ├── layout.tsx              # Root Layout
│   │   └── page.tsx                # Landing / Redirect page
│   ├── features/                   # Feature-based modular code
│   │   ├── auth/                   # LoginForm, RegisterForm, SocialLoginButtons...
│   │   ├── dashboard/              # Portfolio & Project dashboard widgets
│   │   ├── portfolio/              # Portfolio list & forms
│   │   ├── projects/               # Project management components & detail views
│   │   ├── gantt/                  # Gantt chart interactive timeline
│   │   ├── tasks/                  # Task drawer, Kanban board, assignment modals
│   │   ├── resources/              # Resource allocation matrix & leveling alerts
│   │   ├── approvals/              # Change Request workflow UI
│   │   ├── reports/                # Report generator & export dialogs
│   │   ├── audit/                  # Audit trail timeline viewer
│   │   ├── versions/               # Snapshot comparison & rollback modal
│   │   └── ai/                     # AI Project Generator & Impact Analysis UI
│   ├── components/                 # Shared UI components (Button, Modal, Table, Badge, Card...)
│   ├── services/                   # Axios API service layer (api.ts, auth, project, task, portfolio...)
│   ├── hooks/                      # Custom React hooks (useAuth, useProjects, useTasks...)
│   ├── store/                      # Zustand global state (authStore, projectStore...)
│   ├── middleware.ts               # Next.js Edge JWT route guard
│   ├── types/                      # TypeScript definitions (auth, project, task, cpm, api...)
│   └── lib/                        # Utility helpers
├── public/                         # Static assets & favicon
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json
└── .env.example
```

---

### Docker Compose Services

```yaml
# docker-compose.yml configuration
services:
  postgres:      # PostgreSQL 16 (Port 5432)
  redis:         # Redis 7 (Port 6379)
  minio:         # MinIO Object Storage (Port 9000: API, 9001: Console)
  backend:       # FastAPI Application (Port 8000)
  celery-worker: # Celery Async Background Worker
  frontend:      # Next.js 15 Web Application (Port 3000)
```

---

## 6. Database Schema (7 Domains & 32+ Tables)

Database bao gồm 32 bảng được chuẩn hóa thành 7 Domains chức năng:

| Domain | Số bảng | Bảng thành phần | Mô tả chức năng |
|---|---|---|---|
| **1. Base & Associations** | 4 | `user_roles`, `role_permissions`, `user_skills`, `project_members` | Junction tables liên kết Many-to-Many |
| **2. User & RBAC** | 5 | `users`, `roles`, `permissions`, `skills`, `leaves` | Tài khoản, phân quyền, kỹ năng, lịch nghỉ phép |
| **3. Project Core** | 6 | `portfolios`, `projects`, `phases`, `sprints`, `epics`, `milestones` | Cấu trúc phân cấp dự án (WBS) |
| **4. Task & Scheduling** | 6 | `tasks`, `subtasks`, `dependencies`, `assignments`, `worklogs`, `comments` | Công việc, CPM fields, phân công, timesheet |
| **5. Change Management** | 5 | `change_requests`, `approvals`, `impact_reports`, `project_versions`, `audit_logs` | Luồng CR, duyệt đa cấp, snapshot, audit log |
| **6. AI Domain** | 3 | `ai_requests`, `ai_outputs`, `risk_reports` | Lịch sử prompt AI, tokens, đánh giá rủi ro |
| **7. Document & Notification** | 3 | `documents`, `notifications`, `email_logs` | Quản lý file MinIO, 13 loại thông báo in-app & email |

### Key Fields phục vụ Critical Path Method (CPM) trên bảng `tasks`

```python
# app/models/task.py
class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    phase_id = Column(Integer, ForeignKey("phases.id", ondelete="SET NULL"), nullable=True)
    sprint_id = Column(Integer, ForeignKey("sprints.id", ondelete="SET NULL"), nullable=True)
    epic_id = Column(Integer, ForeignKey("epics.id", ondelete="SET NULL"), nullable=True)
    
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(Enum(TaskStatus), default=TaskStatus.TODO)
    priority = Column(Enum(TaskPriority), default=TaskPriority.MEDIUM)
    story_points = Column(Integer, nullable=True)
    
    estimated_hours = Column(Float, default=0.0)
    actual_hours = Column(Float, default=0.0)
    
    planned_start = Column(DateTime(timezone=True), nullable=True)
    planned_end = Column(DateTime(timezone=True), nullable=True)
    actual_start = Column(DateTime(timezone=True), nullable=True)
    actual_end = Column(DateTime(timezone=True), nullable=True)
    
    # CPM Scheduling Fields
    es = Column(Float, default=0.0)        # Earliest Start (hours/days offset)
    ef = Column(Float, default=0.0)        # Earliest Finish
    ls = Column(Float, default=0.0)        # Latest Start
    lf = Column(Float, default=0.0)        # Latest Finish
    float_time = Column(Float, default=0.0) # Total Slack/Float
    is_critical = Column(Boolean, default=False) # Đường găng
```

---

## 7. Hệ thống phân quyền (RBAC)

### 7 Roles trong hệ thống

| Role | Mô tả | Quyền chính |
|---|---|---|
| **Admin** | Quản trị hệ thống | Quản lý tài khoản, roles, permissions, AI providers, cấu hình hệ thống, xem toàn bộ audit logs |
| **PM** | Project Manager | Tạo/quản lý Portfolio & Project, phân công nhân sự, duyệt Change Request cuối, apply kế hoạch, rollback version, xuất báo cáo |
| **BA** | Business Analyst | Review & Approve Change Request, xem Impact Report do AI sinh ra, nhận thông báo thay đổi |
| **PO** | Product Owner | Approve Change Request (về mặt nghiệp vụ), xem Impact Report, theo dõi tiến độ Dashboard |
| **Member** | Thành viên dự án | Xem task được giao, Start/Stop công việc, ghi WorkLog (timesheet), upload file deliverables |
| **Customer** | Khách hàng | Tạo yêu cầu thay đổi (Change Request), theo dõi tiến độ và trạng thái phê duyệt |
| **Investor** | Nhà đầu tư | Xem Dashboard tổng quan cấp Portfolio (chế độ **Read-only**) |

### Nguyên tắc phân quyền
1. Phân quyền chặt chẽ thông qua bảng `role_permissions` (34 granular permissions).
2. **Chỉ PM** mới có quyền bấm Apply thay đổi vào cấu trúc dự án chính thức.
3. Investor chỉ có quyền đọc (read-only) Dashboard, không thể tạo, chỉnh sửa hay xóa bất kỳ thực thể nào.
4. Mọi hành vi tạo/sửa/xóa đều bắt buộc tự động ghi một bản ghi vào `audit_logs`.

---

## 8. Quy trình vận hành chuẩn (SOP)

### SOP-PM-001: Tạo dự án mới
- **Người thực hiện:** PM
- **Luồng:** PM nhập thông tin (Tên, Mục tiêu, Ngày bắt đầu/kết thúc, Ngân sách, Thành viên) → Upload BRD/SRS (tùy chọn) → Hệ thống khởi tạo Project → Ghi Audit Log.

---

### SOP-AI-001: AI Project Generator
- **Người thực hiện:** PM
- **Luồng:**
  ```
  PM nhập Prompt ("Xây dựng sàn TMĐT B2C đa nhà cung cấp")
    → Backend gửi prompt tới AI Provider (OpenAI / Gemini)
    → AI sinh cấu trúc JSON có cấu trúc đầy đủ (Phases, Sprints, Epics, Tasks, Dependencies, Milestones)
    → Backend validate JSON Schema qua Pydantic
    → Khởi tạo các thực thể vào Database
    → Tự động kích hoạt CPM Engine tính toán lịch trình
    → Hiển thị kế hoạch và Render biểu đồ Gantt trực quan
  ```

#### JSON Schema AI trả về:
```json
{
  "project_name": "string",
  "phases": [
    { "name": "string", "order": 1, "start_date": "YYYY-MM-DD", "end_date": "YYYY-MM-DD" }
  ],
  "tasks": [
    {
      "id": "task-1",
      "name": "string",
      "phase": "string",
      "sprint": "string",
      "epic": "string",
      "estimated_hours": 16.0,
      "dependencies": ["task-0"],
      "milestone": "string | null"
    }
  ]
}
```

---

### SOP-RM-001: Phân công nhân sự & Đề xuất AI
- **Người thực hiện:** PM
- **Luồng:** PM chọn Task → Kích hoạt AI Recommend Resource → AI phân tích (Skill match, Kinh nghiệm, Đơn giá giờ, Lịch rảnh, Lịch nghỉ phép) → Trả về danh sách ứng viên có ranking điểm phù hợp → PM xác nhận phân công → Hệ thống kiểm tra Resource Leveling.

---

### SOP-PM-002: Time Tracking & Timesheet
- **Người thực hiện:** Member
- **Luồng:** Member chọn Task → Nhấn `Start Work` (ghi nhận timestamp) → Thực hiện công việc → Nhấn `Stop Work` → Ghi nhận `WorkLog` (số giờ thực tế, ghi chú) → Cập nhật `actual_hours` lên Task.

---

### SOP-CR-001 & SOP-CR-002: Quy trình Change Request đa cấp
- **Người khởi tạo:** Customer / PM
- **Luồng phê duyệt:**
  ```
  Customer tạo Change Request
    → BA Review → Approve / Reject
        → (nếu Approve) PO Review → Approve / Reject
            → (nếu Approve) AI Impact Analysis chạy tự động (SOP-AI-002)
                → PM Review Impact Report → Approve / Reject
                    → (nếu Approve) AI Schedule Optimization chạy tự động (SOP-AI-003)
                        → PM xác nhận phương án tối ưu
                            → Hệ thống tạo Snapshot Version (Baseline)
                                → Apply thay đổi vào dữ liệu dự án thực tế
  ```
- **Ràng buộc:** Chỉ PM được nhấn nút Apply sau khi toàn bộ chuỗi phê duyệt đã hoàn thành.

---

### SOP-AI-002: AI Impact Analysis
- **Kích hoạt:** Tự động ngay sau khi PO Approve Change Request.
- **Nội dung phân tích:**
  - Danh sách Task trực tiếp & gián tiếp bị ảnh hưởng.
  - Sprint & Phase bị kéo dài.
  - Milestone có nguy cơ trễ hạn.
  - Chi phí phát sinh ước tính và tải tài nguyên.
  - Sinh bản ghi `impact_reports` lưu trữ vào cơ sở dữ liệu.

---

### SOP-AI-003: Schedule Optimization
- **Kích hoạt:** Sau khi PM Approve kết quả Impact Report.
- **Nghiệp vụ:** AI tính toán lại chuỗi phụ thuộc, tái phân bổ nguồn lực, nén tiến độ (Fast-tracking/Crashing) và đề xuất ngày kết thúc mới cho từng Task.

---

### SOP-PM-003: Critical Path Method (CPM)
- **Thuật toán:**
  1. Xây dựng đồ thị có hướng (Directed Acyclic Graph - DAG).
  2. **Topological Sort** (Kahn's Algorithm) phát hiện vòng lặp và xác định thứ tự thực hiện.
  3. **Forward Pass**: Tính $ES$ (Earliest Start) và $EF = ES + Duration$.
  4. **Backward Pass**: Tính $LF$ (Latest Finish) và $LS = LF - Duration$.
  5. **Float/Slack**: $Float = LS - ES = LF - EF$.
  6. **Critical Path**: Tập hợp tất cả các task có $Float = 0$.
- **Trigger:** Kéo thả thay đổi ngày hoặc quan hệ trên Gantt Chart sẽ kích hoạt recalculate toàn bộ các task hạ nguồn (downstream).

---

### SOP-AI-004: Resource Leveling (Kiểm tra quá tải)
- **Kích hoạt:** Khi assign Task cho nhân sự hoặc thay đổi thời gian thực hiện.
- **Cơ chế:** Kiểm tra tổng giờ làm việc trong ngày (vượt quá 8h/ngày hoặc ngưỡng cấu hình) + kiểm tra lịch nghỉ phép (`leaves`). Nếu quá tải, hiển thị cảnh báo đỏ và AI đề xuất dời lịch hoặc hoán đổi nhân sự.

---

### SOP-DOC-001: Quản lý tài liệu & AI Document Parser
- **Thao tác:** Upload tài liệu (BRD, SRS, tài liệu nghiệm thu) lên MinIO Storage → AI tự động đọc và phân tích nội dung để trích xuất các User Story, Tasks đề xuất.

---

### SOP-PM-004 & SOP-PM-005: Version Snapshot & Rollback
- **Tạo Version:** Tự động tạo snapshot trước khi apply Change Request hoặc PM chủ động tạo Baseline snapshot.
- **Rollback:** PM chọn phiên bản cũ → Xem so sánh Diff → Xác nhận Rollback → Hệ thống khôi phục toàn bộ cấu trúc WBS và dependencies về trạng thái snapshot.

---

### SOP-AUD-001: Hệ thống Audit Log
- Ghi nhận toàn bộ thao tác thêm/sửa/xóa trong hệ thống bao gồm: Actor, Action, Entity Type, Entity ID, Old Value (JSON), New Value (JSON), IP Address, Timestamp.

---

### SOP-NOTI-001: Thông báo đa kênh (13 Events)
- Phát tín hiệu in-app và gửi Email qua Celery Worker khi có: CR mới, Thay đổi trạng thái phê duyệt, Thay đổi Critical Path, Cảnh báo quá tải nhân sự, Cảnh báo rủi ro cao.

---

### SOP-RPT-001: Xuất báo cáo dự án (DOCX, XLSX)
- Xuất file báo cáo toàn diện gồm: Tiến độ tổng thể, Chỉ số EVA (PV, EV, AC, CV, SV), Chỉ số hiệu suất (CPI, SPI), Biểu đồ phân bổ công việc, Ma trận rủi ro.

---

### SOP-DB-001: Dashboard & Metrics
- Cung cấp giao diện biểu đồ: Gantt tương tác, Burndown Chart, Burnup Chart, Velocity Chart, Heatmap sử dụng tài nguyên, Phân bổ trạng thái Task.

---

### SOP-AI-005: AI Risk Analysis
- Đánh giá định kỳ các yếu tố: Trễ tiến độ đường găng, Quá tải tài nguyên, Vượt ngân sách → Xếp hạng mức độ rủi ro (Low / Medium / High / Critical) và gửi thông báo cảnh báo tức thời.

---

## 9. Thuật toán cốt lõi & Luồng AI

### Thuật toán CPM (Python Implementation)

```python
# app/utils/cpm.py
from typing import List, Dict, Set
from collections import defaultdict, deque

def topological_sort(tasks: List[Dict], dependencies: List[Dict]) -> List[int]:
    """Kahn's Algorithm xác định thứ tự thực hiện và phát hiện cycle"""
    graph = defaultdict(list)
    in_degree = defaultdict(int)
    task_ids = {t["id"] for t in tasks}

    for tid in task_ids:
        in_degree[tid] = 0

    for dep in dependencies:
        from_id, to_id = dep["from_task_id"], dep["to_task_id"]
        if from_id in task_ids and to_id in task_ids:
            graph[from_id].append(to_id)
            in_degree[to_id] += 1

    queue = deque([tid for tid in task_ids if in_degree[tid] == 0])
    ordered = []

    while queue:
        curr = queue.popleft()
        ordered.append(curr)
        for neighbor in graph[curr]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    if len(ordered) != len(task_ids):
        raise ValueError("Phát hiện vòng lặp phụ thuộc (Circular Dependency) giữa các Task!")

    return ordered

def calculate_cpm(tasks_dict: Dict[int, Dict], dependencies: List[Dict]) -> List[int]:
    """Tính toán Forward Pass, Backward Pass, Total Float và Critical Path"""
    order = topological_sort(list(tasks_dict.values()), dependencies)
    
    # 1. Forward Pass (Tính ES, EF)
    for tid in order:
        task = tasks_dict[tid]
        preds = [d for d in dependencies if d["to_task_id"] == tid]
        if preds:
            task["es"] = max(tasks_dict[d["from_task_id"]]["ef"] + d.get("lag_hours", 0) for d in preds)
        else:
            task["es"] = 0.0
        task["ef"] = task["es"] + task["estimated_hours"]

    # 2. Backward Pass (Tính LF, LS)
    max_ef = max((t["ef"] for t in tasks_dict.values()), default=0.0)
    for tid in reversed(order):
        task = tasks_dict[tid]
        succs = [d for d in dependencies if d["from_task_id"] == tid]
        if succs:
            task["lf"] = min(tasks_dict[d["to_task_id"]]["ls"] - d.get("lag_hours", 0) for d in succs)
        else:
            task["lf"] = max_ef
        task["ls"] = task["lf"] - task["estimated_hours"]

    # 3. Float & Critical Path Identification
    critical_path = []
    for tid, task in tasks_dict.items():
        task["float_time"] = task["ls"] - task["es"]
        task["is_critical"] = abs(task["float_time"]) < 0.001
        if task["is_critical"]:
            critical_path.append(tid)

    return critical_path
```

---

### Kiểm tra quá tải tài nguyên (Resource Leveling)

```python
# app/services/resource_leveling.py
from datetime import date
from typing import Dict, Any

def check_resource_overload(user_id: int, target_date: date, max_daily_hours: float = 8.0) -> Dict[str, Any]:
    # 1. Kiểm tra lịch nghỉ phép đã được duyệt
    leave = db.query(Leave).filter(
        Leave.user_id == user_id,
        Leave.start_date <= target_date,
        Leave.end_date >= target_date,
        Leave.status == "approved"
    ).first()
    
    if leave:
        return {
            "is_overloaded": True,
            "reason": "on_leave",
            "total_allocated_hours": 0.0,
            "max_hours": max_daily_hours,
            "tasks": []
        }

    # 2. Tính tổng giờ được phân bổ từ các active tasks trong ngày
    active_assignments = db.query(Assignment).join(Task).filter(
        Assignment.user_id == user_id,
        Task.planned_start <= target_date,
        Task.planned_end >= target_date
    ).all()

    total_hours = sum(a.allocated_hours / max((a.task.planned_end - a.task.planned_start).days + 1, 1) for a in active_assignments)

    return {
        "is_overloaded": total_hours > max_daily_hours,
        "reason": "hours_exceeded" if total_hours > max_daily_hours else "normal",
        "total_allocated_hours": round(total_hours, 2),
        "max_hours": max_daily_hours,
        "task_count": len(active_assignments)
    }
```

---

## 10. API Specification & Endpoints

Tất cả REST endpoints đều sử dụng chuẩn prefix `/api/v1/`.

| Nhóm Endpoint | Route Prefix | Mô tả chức năng |
|---|---|---|
| **Authentication** | `/api/v1/auth` | Đăng ký, đăng nhập, cấp lại token, quên mật khẩu, xác thực email |
| **OAuth 2.0** | `/api/v1/oauth` | Google & Facebook Social Login |
| **Users & Roles** | `/api/v1/users`, `/api/v1/roles`, `/api/v1/permissions` | Quản lý người dùng, phân quyền hệ thống |
| **Portfolios** | `/api/v1/portfolios` | CRUD danh mục dự án cấp cao |
| **Projects** | `/api/v1/projects` | CRUD dự án, quản lý thành viên, thống kê tiến độ |
| **WBS Elements** | `/api/v1/phases`, `/api/v1/sprints`, `/api/v1/epics`, `/api/v1/milestones` | Quản lý các cấp phân rã công việc |
| **Tasks & Subtasks** | `/api/v1/tasks`, `/api/v1/subtasks`, `/api/v1/dependencies` | Quản lý công việc và đồ thị ràng buộc phụ thuộc |
| **Scheduling & CPM** | `/api/v1/gantt`, `/api/v1/cpm`, `/api/v1/resource-leveling` | Dữ liệu biểu đồ Gantt, tính toán đường găng, kiểm tra quá tải |
| **Timesheet** | `/api/v1/worklogs`, `/api/v1/assignments`, `/api/v1/leaves` | Ghi nhận thời gian làm việc thực tế, phân công và nghỉ phép |
| **Change Management** | `/api/v1/change-requests`, `/api/v1/approvals`, `/api/v1/versions` | Luồng phê duyệt CR, snapshot và rollback dự án |
| **AI Features** | `/api/v1/ai` | Sinh dự án, phân tích tác động, gợi ý nhân sự, dự báo rủi ro |
| **Reporting & Dashboards** | `/api/v1/dashboards`, `/api/v1/reports`, `/api/v1/audit` | Tổng hợp chỉ số EVA, xuất file DOCX/XLSX, timeline audit |
| **System** | `/api/v1/system` | Healthcheck, cấu hình AI provider hoạt động |

> - **Swagger UI Interactive Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
> - **ReDoc OpenAPI Documentation:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 11. Cài đặt và Chạy hệ thống

### Điều kiện tiên quyết (Prerequisites)
- **Python:** >= 3.11
- **Node.js:** >= 18.x (khuyên dùng Node 20 LTS)
- **PostgreSQL:** >= 14
- **Redis:** >= 6.x
- **MinIO:** MinIO Server hoặc Amazon S3 compatible
- *(Tùy chọn)* **Docker & Docker Compose**

---

### Cách 1: Khởi chạy bằng Docker Compose (Khuyên dùng)

```bash
# 1. Khởi động toàn bộ 6 dịch vụ (PostgreSQL, Redis, MinIO, Backend, Celery, Frontend)
docker-compose up -d

# 2. Theo dõi logs backend
docker-compose logs -f backend

# 3. Dừng tất cả dịch vụ
docker-compose down
```

---

### Cách 2: Cài đặt và chạy thủ công (Local Development)

#### 1. Backend Setup (FastAPI)

```bash
cd backend

# Tạo và kích hoạt môi trường ảo
python -m venv venv
source venv/bin/activate       # Trên Linux / macOS
venv\Scripts\activate          # Trên Windows

# Cài đặt dependencies
pip install -r requirements.txt

# Tạo file cấu hình môi trường
cp .env.example .env
# (Chỉnh sửa các tham số kết nối DB, Redis, AI API Keys trong file .env)

# Thực thi migration tạo bảng cơ sở dữ liệu
alembic upgrade head

# Nạp dữ liệu mẫu khởi tạo (7 Roles, 34 Permissions, 1 Admin account)
python -m app.db.seed

# Khởi động Backend Server
uvicorn app.main:app --reload --port 8000
```

#### 2. Khởi động Celery Worker (xử lý AI & Email Async)

```bash
cd backend
# Đảm bảo môi trường ảo venv đang active
celery -A app.workers.celery_app worker --loglevel=info
```

#### 3. Frontend Setup (Next.js 15)

```bash
cd frontend

# Cài đặt các gói phụ thuộc
npm install

# Tạo file cấu hình môi trường
cp .env.example .env.local

# Khởi chạy Development Server
npm run dev
```

Truy cập ứng dụng tại: **[http://localhost:3000](http://localhost:3000)**

---

## 12. Cấu hình & Biến môi trường

### Các tham số hệ thống (`core/config.py`)

| Tên biến | Kiểu dữ liệu | Mặc định | Ý nghĩa |
|---|---|---|---|
| `APP_NAME` | `str` | `AI Project Management API` | Tên định danh ứng dụng |
| `API_V1_PREFIX` | `str` | `/api/v1` | Prefix toàn bộ REST routes |
| `SECRET_KEY` | `str` | *Bắt buộc cấu hình* | Khóa mã hóa JWT Token (tối thiểu 32 ký tự) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `int` | `30` | Thời hạn hiệu lực JWT Access Token |
| `REFRESH_TOKEN_EXPIRE_DAYS` | `int` | `7` | Thời hạn hiệu lực Refresh Token |
| `DATABASE_URL` | `str` | `postgresql+asyncpg://...` | Chuỗi kết nối Async PostgreSQL |
| `REDIS_URL` | `str` | `redis://localhost:6379/0` | URL kết nối Redis Cache |
| `CELERY_BROKER_URL` | `str` | `redis://localhost:6379/1` | Redis Broker cho Celery queue |
| `ACTIVE_AI_PROVIDER` | `str` | `openai` | AI Provider hoạt động (`openai` hoặc `gemini`) |
| `OPENAI_MODEL` | `str` | `gpt-4o` | Tên model OpenAI sử dụng |
| `GEMINI_MODEL` | `str` | `gemini-pro` | Tên model Gemini sử dụng |
| `MINIO_BUCKET` | `str` | `ai-project-files` | Tên bucket lưu trữ file trên MinIO |

---

### Mẫu cấu hình Backend (`backend/.env`)

```env
# Application
APP_ENV=development
APP_NAME=AI Project Management API
SECRET_KEY=your-super-secret-key-min-32-chars-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Database (Async PostgreSQL via asyncpg)
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/ai_project_management
DATABASE_POOL_SIZE=10
DATABASE_MAX_OVERFLOW=20

# Redis & Celery
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/1
CELERY_RESULT_BACKEND=redis://localhost:6379/2

# CORS Origins
CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]

# MinIO Object Storage
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=ai-project-files
MINIO_USE_SSL=false

# AI Providers
ACTIVE_AI_PROVIDER=openai
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o
GEMINI_API_KEY=AIzaSy...
GEMINI_MODEL=gemini-pro

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@aiprojectmanagement.com
```

### Mẫu cấu hình Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

---

## 13. Quy tắc phát triển

### 1. Quy tắc chung
- **Ngôn ngữ chuẩn:** Backend sử dụng **Python 3.11+** với Type Hints đầy đủ. Frontend sử dụng **TypeScript** nghiêm ngặt.
- **Chuẩn định dạng API Response:** Mọi response gửi về client đều tuân thủ cấu trúc đồng nhất:
  ```json
  {
    "success": true,
    "data": {},
    "message": "Thao tác thành công",
    "meta": {}
  }
  ```
- **Xử lý bất đồng bộ:** Tuyệt đối không gọi trực tiếp AI API đồng bộ làm nghẽn API request. Toàn bộ AI tasks phải đẩy vào **Celery Job Queue**.
- **Lưu trữ tệp:** Tất cả tài liệu tải lên phải thông qua dịch vụ **MinIO**, lưu metadata trong DB, không ghi file trực tiếp lên ổ cứng local server.

### 2. Backend (FastAPI)
- Tuân thủ kiến trúc phân lớp chuẩn: **Endpoint / Router → Service Layer → Repository / CRUD Layer → ORM Models**.
- Sử dụng **SQLAlchemy 2.0 Async Session** cho toàn bộ tương tác cơ sở dữ liệu.
- Mọi dữ liệu đầu vào và đầu ra đều được kiểm định chặt chẽ bằng **Pydantic v2 Schemas**.
- Thuật toán CPM (`utils/cpm.py`) phải được viết dưới dạng Pure Functions để thuận tiện cho việc viết Unit Test tự động.

### 3. Frontend (Next.js 15)
- Tận dụng tối đa **Next.js App Router** kết hợp với Server & Client Components hợp lý.
- Quản lý trạng thái Client bằng **Zustand**, đồng bộ Server Cache bằng **TanStack React Query v5**.
- Bắt buộc thực hiện **Optimistic Updates** đối với các thao tác thay đổi dữ liệu nhanh (kéo thả Task, cập nhật trạng thái) và có cơ chế Rollback nếu API báo lỗi.

### 4. AI Provider Layer
- Kế thừa từ abstract class `BaseAIProvider` để dễ dàng mở rộng thêm các nhà cung cấp LLM khác (Claude, DeepSeek, v.v.).
- Cơ chế tự động thử lại (**Retry 3 lần với Exponential Backoff**) khi gặp lỗi rate-limit hoặc timeout.
- Mọi lượt gọi AI phải được ghi log chi tiết vào 2 bảng `ai_requests` và `ai_outputs` phục vụ debug và tối ưu chi phí token.

---

## 14. Roadmap phát triển

```
[Phase 1: Core Auth] ────► [Phase 2: Project Core] ────► [Phase 3: AI Engine]
      (Hoàn thành)               (Hoàn thành)                 (Đang xử lý)
                                                                   │
[Phase 5: Document AI & Polish] ◄─── [Phase 4: Workflow & Reports] ┘
```

- [x] **Phase 1 — Core Auth & Onboarding** *(Hoàn thành)*
  - [x] Hệ thống xác thực JWT + Refresh Token, mã hóa bcrypt.
  - [x] Đăng ký, đăng nhập, quên mật khẩu, kích hoạt email.
  - [x] Social Login Google & Facebook OAuth 2.0.
  - [x] Next.js Edge Middleware bảo vệ route.
  - [x] Frontend Auth Service & Zustand Auth Store.

- [x] **Phase 2 — Portfolio & Project Core** *(Hoàn thành 15/08/2026)*
  - [x] CRUD Danh mục (Portfolio) & Dự án (Project) API + UI.
  - [x] Quản lý thành viên dự án và phân quyền vai trò.
  - [x] Cấu trúc WBS: Phase / Sprint / Epic / Milestone.
  - [x] Quản lý Task, Subtask, Kanban board, Drawer chi tiết.
  - [x] Đồ thị quan hệ phụ thuộc Task (FS/SS/FF/SF) & Thuật toán CPM.
  - [x] Phân công nhân sự, ghi nhận Timesheet WorkLog, kiểm tra quá tải tài nguyên.

- [ ] **Phase 3 — AI Features** *(Kế hoạch tiếp theo)*
  - [ ] AI Project Generator từ prompt (SOP-AI-001).
  - [ ] AI Impact Analysis phân tích tác động thay đổi (SOP-AI-002).
  - [ ] AI Schedule Optimization tối ưu lịch trình (SOP-AI-003).
  - [ ] AI Resource Recommendation gợi ý phân bổ nhân sự (SOP-RM-001).
  - [ ] AI Risk Analysis tự động đánh giá rủi ro dự án (SOP-AI-005).

- [ ] **Phase 4 — Workflow & Reporting**
  - [ ] Quy trình Change Request đa cấp (BA → PO → PM).
  - [ ] Project Versioning Snapshot & Rollback.
  - [ ] Dashboard nâng cao: Burndown, Burnup, Velocity, EVA (PV, EV, AC, CPI, SPI).
  - [ ] Xuất báo cáo tự động ra định dạng DOCX và XLSX.
  - [ ] Audit Log Timeline & Hệ thống thông báo in-app / email.

- [ ] **Phase 5 — Document AI & Polish**
  - [ ] Upload & AI Document Parser trích xuất Task từ file BRD/SRS.
  - [ ] Giao diện Dashboard dành riêng cho Nhà đầu tư (Investor - Read-only).
  - [ ] Quản lý Profile cá nhân, Avatar upload MinIO.
  - [ ] Tối ưu hiệu năng, responsive trên thiết bị di động.

---

## 15. Tài liệu tham khảo & Thuật ngữ

### Tài liệu đặc tả kỹ thuật

| Tài liệu | Vị trí tệp | Mô tả |
|---|---|---|
| **BRD** | [brd.md](./.documents/specs/system-architecture/brd.md) | Business Requirements Document — Yêu cầu nghiệp vụ |
| **SRS** | [srs.md](./.documents/specs/system-architecture/srs.md) | Software Requirements Specification — Đặc tả phần mềm |
| **Architecture Design** | [design.md](./.documents/specs/system-architecture/design.md) | Thiết kế kiến trúc kỹ thuật chi tiết |
| **Sequence Diagrams** | [.documents/specs/system-architecture/Sequence SOP/](./.documents/specs/system-architecture/Sequence%20SOP/) | Chuỗi Sequence Diagrams PlantUML cho từng SOP |
| **Interactive ERD** | [erd_ai_project_management.html](./erd_ai_project_management.html) | Sơ đồ cấu trúc 32 bảng Database (HTML tương tác) |

### Bảng giải thích thuật ngữ chuyên ngành

| Thuật ngữ | Tên đầy đủ | Giải thích nghiệp vụ |
|---|---|---|
| **CPM** | Critical Path Method | Phương pháp đường găng xác định chuỗi công việc quyết định thời gian hoàn thành dự án |
| **ES / EF** | Earliest Start / Earliest Finish | Thời điểm sớm nhất có thể bắt đầu / kết thúc công việc |
| **LS / LF** | Latest Start / Latest Finish | Thời điểm muộn nhất phải bắt đầu / kết thúc công việc để không làm trễ dự án |
| **Float / Slack** | Total Float / Total Slack | Thời gian dự trữ của công việc ($Float = LS - ES$). Task có $Float = 0$ nằm trên đường găng |
| **WBS** | Work Breakdown Structure | Cấu trúc phân rã công việc theo cấp bậc hình cây |
| **EVA** | Earned Value Analysis | Phương pháp đo lường giá trị thu được để kiểm soát tiến độ và chi phí dự án |
| **PV / EV / AC** | Planned Value / Earned Value / Actual Cost | Giá trị kế hoạch / Giá trị thu được / Chi phí thực tế đã chi |
| **CPI** | Cost Performance Index | Chỉ số hiệu suất chi phí ($CPI = EV / AC$). $CPI > 1$ là tiết kiệm chi phí |
| **SPI** | Schedule Performance Index | Chỉ số hiệu suất tiến độ ($SPI = EV / PV$). $SPI > 1$ là vượt tiến độ |
| **CR** | Change Request | Yêu cầu thay đổi phạm vi, thời gian hoặc ngân sách dự án |
| **Resource Leveling** | San bằng tài nguyên | Kỹ thuật điều chỉnh lịch trình công việc để tránh tình trạng nhân sự bị làm việc quá tải |

---

## 16. License & Contributors

### License
Dự án được phân phối dưới giấy phép mã nguồn mở **MIT License**. Xem chi tiết tại tệp [LICENSE](./LICENSE) nếu có.

### Tác giả & Đóng góp
- **Nguyễn Ngọc Việt Thắng** — Lead Developer & Architect

---

*Hệ thống AI Project Planning & Portfolio Management — Cập nhật 2026*
