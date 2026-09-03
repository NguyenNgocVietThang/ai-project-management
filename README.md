# AI Project Planning & Portfolio Management System

> **Hệ thống quản lý dự án & danh mục thông minh tích hợp AI — tương đương MS Project với lớp AI tự động phân tích, đề xuất và tối ưu hóa kế hoạch, hỗ trợ Real-time Project Chat và WebSocket Notifications.**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_0.115-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js_15_(React_18)-black?logo=next.js)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_16-336791?logo=postgresql)](https://www.postgresql.org)
[![Redis](https://img.shields.io/badge/Cache%20%26%20PubSub-Redis_7-DC382D?logo=redis)](https://redis.io)
[![Celery](https://img.shields.io/badge/Queue%20%26%20Beat-Celery_%2B_Redis-37814A?logo=celery)](https://docs.celeryq.dev)
[![WebSocket](https://img.shields.io/badge/Real--time-WebSocket_%2B_Redis_PubSub-010101)](https://fastapi.tiangolo.com/advanced/websockets/)
[![OpenAI & Gemini](https://img.shields.io/badge/AI-OpenAI_GPT--4o_%7C_Gemini_Pro-412991)](https://openai.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Mục lục

1. [Tổng quan dự án](#1-tổng-quan-dự-án)
2. [Kiến trúc hệ thống](#2-kiến-trúc-hệ-thống)
3. [Technology Stack](#3-technology-stack)
4. [Phân cấp cấu trúc dự án (WBS)](#4-phân-cấp-cấu-trúc-dự-án-wbs)
5. [Cấu trúc thư mục dự án](#5-cấu-trúc-thư-mục-dự-án)
6. [Database Schema (8 Domains & 34 Tables)](#6-database-schema-8-domains--34-tables)
7. [Hệ thống phân quyền (RBAC) & Quản trị Admin](#7-hệ-thống-phân-quyền-rbac--quản-trị-admin)
8. [Quy trình vận hành chuẩn (SOP)](#8-quy-trình-vận-hành-chuẩn-sop)
9. [Thuật toán cốt lõi & Hạ tầng Real-time](#9-thuật-toán-cốt-lõi--hạ-tầng-real-time)
10. [API Specification & WebSocket Endpoints](#10-api-specification--websocket-endpoints)
11. [Cài đặt và Chạy hệ thống](#11-cài-đặt-và-chạy-hệ-thống)
12. [Cấu hình & Biến môi trường](#12-cấu-hình--biến-môi-trường)
13. [Quy tắc phát triển](#13-quy-tắc-phát-triển)
14. [Roadmap phát triển](#14-roadmap-phát-triển)
15. [Tài liệu tham khảo & Thuật ngữ](#15-tài-liệu-tham-khảo--thuật-ngữ)
16. [License & Contributors](#16-license--contributors)

---

## 1. Tổng quan dự án

Xây dựng một **web application quản lý dự án và danh mục đầu tư thông minh** tích hợp AI, tương đương MS Project nhưng được trang bị lớp AI tự động phân tích, sinh kế hoạch, đề xuất nhân sự, phát hiện rủi ro và đánh giá tác động thay đổi. Hệ thống hỗ trợ đa người dùng (multi-role), giao tiếp thời gian thực (Real-time Project Chat & WebSocket Notification Push) và quét lịch trình tự động qua Celery Beat.

### Mục tiêu cốt lõi (tầm nhìn sản phẩm — không phải toàn bộ đã hoàn thành, xem [§14 Roadmap](#14-roadmap-phát-triển)):
- **Quản lý danh mục & dự án (Portfolio & Project Management)** theo chuẩn kết hợp Waterfall & Agile.
- **Sinh kế hoạch dự án tự động (AI Project Generator)** từ mô tả ngôn ngữ tự nhiên (Prompt) thông qua OpenAI / Google Gemini.
- **Tính toán đường găng (Critical Path Method - CPM)**, sắp xếp tô-pô (Topological Sort) và cân bằng tải nhân sự (Resource Leveling).
- **Giao tiếp thời gian thực (Real-time Collaboration)**: Kênh Chat nội bộ theo từng dự án (`/ws/chat/{project_id}`) và đẩy thông báo tức thời (`/ws/notifications`) qua WebSocket kết hợp Redis Pub/Sub đa tiến trình.
- **Hệ thống Quản trị & Audit Timeline**: Quản lý người dùng, vai trò, 34 quyền hạn (permissions) chi tiết và truy vết toàn bộ thay đổi hệ thống.
- **Tự động quét lịch & gửi thông báo định kỳ**: Celery Beat quét định kỳ hàng ngày (08:00 Asia/Ho_Chi_Minh) các công việc bắt đầu trong ngày hoặc sắp đến hạn để gửi thông báo fan-out tới toàn bộ nhóm dự án.
- **Phân tích tác động thay đổi (AI Impact Analysis)** và tối ưu lịch (Schedule Optimization) khi phát sinh Change Request.
- **Dashboard & Báo cáo đa chiều**: Gantt Chart tương tác, Burndown, Burnup, Velocity, Earned Value Analysis (EVA, CPI, SPI), xuất file DOCX/XLSX.

### Trạng thái triển khai thực tế (cập nhật 2026-09-03)

| Nhóm chức năng | Trạng thái | Ghi chú |
|---|---|---|
| Auth, RBAC, Admin Portal, OAuth, Profile | ✅ Chạy thật + test | Phase 1 hoàn thành |
| Portfolio / Project / WBS / Task / Dependency / Assignment / WorkLog | ✅ Chạy thật + test | Phase 2 hoàn thành |
| CPM Engine | ✅ Chạy nội bộ | `app/utils/cpm.py` + `scheduling_service.py`; **chưa có** endpoint `/cpm` và `/gantt` (mới là stub) |
| Real-time Chat + Notification Push + Celery Beat daily sweep | ✅ Chạy thật + test | Phase 2/5 hoàn thành |
| Dashboard KPI / EVA / Burndown | ✅ Chạy thật | endpoint `/dashboards` đã mount |
| AI (Generator, Impact, Optimize, Risk, Resource) | 🟡 Chỉ hạ tầng | Có `BaseAIProvider` + `OpenAIProvider` + `GeminiProvider` + `project_generator.py` và models; **chưa mount** endpoint `/ai`, Celery `ai_tasks` vẫn là stub |
| Change Request / Approvals / Project Versioning / Rollback | 🟡 Chỉ model DB | Endpoint là stub `TODO`, **chưa mount**, chưa có UI |
| Reports DOCX/XLSX | 🟡 Chỉ scaffold | `report_tasks.py` là stub trả về rỗng, endpoint `/reports` chưa mount |
| Documents / AI Document Parser | 🟡 Chỉ model DB | endpoint `/documents` là stub, chưa mount |
| Leaves / Skills catalog | 🟡 Chỉ model DB | endpoint là stub, chưa mount |
| Investor Read-only Dashboard, Mobile polish | ❌ Chưa làm | — |

> **API thực tế đang phục vụ:** 21 REST router (`/api/v1/...`) + 2 WebSocket router (`/ws/...`). 11 router còn lại (`leaves, skills, documents, approvals, change_requests, gantt, cpm, reports, project_versions, ai, system`) vẫn là stub `TODO: Implement`, bị comment trong [`router.py`](./backend/app/api/v1/router.py) và **không** được mount.

---

## 2. Kiến trúc hệ thống

```
┌────────────────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 15 / React 18)                    │
│    App Router + Zustand + TanStack Query + Interactive Gantt + Chat    │
└──────────────────┬───────────────────────────────┬─────────────────────┘
                   │ REST API (/api/v1/...)        │ WebSocket (/ws/...)
                   ▼                               ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    FastAPI Backend (Python 3.11+)                      │
│     Layered Architecture: Endpoints → Services → Repositories → Models │
│     ConnectionManager (Redis Pub/Sub Bus) + AsyncIO Event Loop         │
└──────┬───────────────────┬───────────────────────┬──────────────┬──────┘
       │                   │                       │              │
  ┌────▼────────┐     ┌────▼────────┐        ┌─────▼────────┐ ┌───▼────────┐
  │ PostgreSQL  │     │ Redis Cache │        │    MinIO     │ │Celery Beat │
  │ (SQLAlchemy │     │  & Pub/Sub  │        │(File Storage)│ │ (Scheduler)│
  │  Async Engine)    └────┬────────┘        └──────────────┘ └───┬────────┘
  └─────────────┘          │                                      │
                      ┌────▼────────┐                             │
                      │Celery Worker│ ◄───────────────────────────┘
                      │ (Async Queue)  Async Tasks (AI, Emails, Sweeps, Reports)
                      └────┬────────┘
                           │
              ┌────────────▼────────────┐
              │    AI Provider Layer    │
              │  ├─ OpenAI (GPT-4o)     │
              │  └─ Google Gemini Pro   │
              └─────────────────────────┘
```

### Hạ tầng Real-time & WebSocket Architecture

```
Client WebSocket (/ws/chat/{id} hoặc /ws/notifications?token=...)
   │
   ▼
FastAPI WS Endpoint (authenticate_ws verifies JWT & checks project membership)
   │
   ├── ConnectionManager (Local In-Memory Sockets Registry)
   │
   └── Redis Pub/Sub Bus (Cross-process broadcasting: ws:chat:{project_id}, ws:notif:user:{user_id})
       │
       ▼
   redis_listener (Background task in FastAPI lifespan, receives & dispatches to local sockets)
```

---

## 3. Technology Stack

### Backend (Python)
| Thành phần | Công nghệ / Thư viện | Phiên bản | Mô tả |
|---|---|---|---|
| **Framework** | **FastAPI** | `0.115+` | Asynchronous High-performance Web Framework |
| **ASGI Server** | `uvicorn[standard]` | `0.30.0` | ASGI Server với hỗ trợ native WebSocket |
| **Language** | Python | `3.11+` | Type hints nghiêm ngặt, async/await |
| **ORM** | **SQLAlchemy** | `2.0.35+` | Async ORM & Session management (Mapped/mapped_column) |
| **Database Driver** | `asyncpg` | `0.29.0` | High-performance Async PostgreSQL driver |
| **Migrations** | **Alembic** | `1.13.3` | Database Schema Migration tool |
| **Validation** | **Pydantic v2** | `2.9.0` | Data parsing & strict validation |
| **Auth & Security** | `python-jose`, `passlib[bcrypt]` | — | JWT Access/Refresh tokens, Password hashing |
| **Real-time Bus** | **Redis Pub/Sub + ConnectionManager** | `5.1.1` | Cross-process WebSocket broadcasting |
| **Queue & Worker** | **Celery** | `5.4.0` | Background tasks & AI processing queue |
| **Scheduler** | **Celery Beat** | `5.4.0` | Cron scheduler (quét task start/due-soon hàng ngày) |
| **Caching** | Redis (`redis.asyncio`) | `5.1.1` | In-memory caching & session store |
| **AI Providers** | `openai`, `google-generativeai` | — | OpenAI GPT-4o & Google Gemini Pro APIs |
| **File Storage** | `minio` / `boto3` | `7.2.9` | S3-compatible storage (BRD/SRS, Avatar, Reports) |
| **Email Service** | `fastapi-mail` + Jinja2 | `1.4.1` | Template email async dispatch |
| **Reporting** | `python-docx`, `openpyxl` | — | Xuất báo cáo dự án định dạng DOCX & XLSX |
| **Testing** | `pytest`, `pytest-asyncio`, `httpx` | — | Automated unit testing suite (`backend/tests/unit/`, 123/123 passed) |

### Frontend (Next.js / React / TypeScript)
| Thành phần | Công nghệ / Thư viện | Phiên bản | Mô tả |
|---|---|---|---|
| **Framework** | **Next.js 15 (App Router)** | `15.0.0` | React Framework với Route Groups & Layouts |
| **UI Runtime** | **React** | `18.3.0` | Modern React with Server & Client components |
| **Language** | **TypeScript** | `5.2.2+` | Full type-safety across frontend |
| **Global State** | **Zustand** | `4.4.0+` | Auth state persistence & Cookie synchronization |
| **Server State** | **TanStack Query v5** | `5.0.0+` | React Query server-state caching & mutations |
| **HTTP Client** | **Axios** | `1.5.0+` | Interceptors for JWT attach & refresh flow |
| **Real-time Client** | `lib/ws-client.ts` (Native WS) | — | Reconnecting WebSocket client với exponential backoff |
| **Styling** | **Tailwind CSS v3** | `3.3.0+` | Utility-first CSS & responsive theme |
| **Forms** | **React Hook Form + Zod** | — | Schema-based form validation |
| **Tables** | **TanStack Table v8** | — | Headless data tables |
| **Charts** | **Recharts** | `2.8.0+` | Gantt, Burndown, Burnup, Velocity, EVA charts |
| **Drag & Drop** | `@dnd-kit/core`, `@dnd-kit/sortable` | `6.0.0+` | Task reordering & Kanban board |
| **Icons** | `lucide-react` | `0.290.0+` | Modern icon system |
| **Date Utils** | `date-fns` | `2.30.0` | Date formatting and manipulation |

### Hạ tầng Docker (7 Dịch vụ trong `docker-compose.yml`)
| Container Service | Base Image | Cổng ánh xạ | Chức năng |
|---|---|---|---|
| `postgres` | `postgres:16-alpine` | `5432:5432` | Cơ sở dữ liệu quan hệ chính |
| `redis` | `redis:7-alpine` | `6379:6379` | Cache, Celery Broker & WebSocket Pub/Sub Bus |
| `minio` | `minio/minio:latest` | `9000:9000`, `9001:9001` | Object Storage API & Web Console |
| `backend` | `./backend Dockerfile` | `8000:8000` | FastAPI REST API & WebSocket Server |
| `celery-worker` | `./backend Dockerfile` | — | Background Worker xử lý AI, Email, Report |
| `celery-beat` | `./backend Dockerfile` | — | Scheduled Task Runner (08:00 AM daily sweep) |
| `frontend` | `./frontend Dockerfile` | `3000:3000` | Next.js Web Application |

---

## 4. Phân cấp cấu trúc dự án (WBS)

```
Portfolio (Danh mục chiến lược)
└── Project (Dự án: Agile / Waterfall / Hybrid)
     ├── Project Members (PM, BA, PO, Member, Customer)
     ├── Project Chat (/projects/[id]/chat & /ws/chat/[id])
     ├── Phase (Giai đoạn)
     ├── Sprint (Chu kỳ Agile)
     ├── Epic (Nhóm tính năng lớn)
     ├── Milestone (Cột mốc quan trọng)
     └── Task (Công việc chi tiết)
          ├── SubTask (Hạng mục công việc con)
          ├── Dependencies (Mối quan hệ FS, SS, FF, SF + Lag hours)
          ├── Assignments (Phân bổ nhân sự theo khối lượng/chi phí)
          ├── WorkLogs (Timesheet ghi nhận giờ thực tế)
          └── Comments (Bình luận & thảo luận)
```

---

## 5. Cấu trúc thư mục dự án

```
AI Project Planning & Portfolio Management system/
├── backend/                                  # Python FastAPI Backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                           # FastAPI App + lifespan + CORS + WS Router mount
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── v1/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── router.py                 # Aggregator: 21 REST routers được mount (+11 stub bị comment)
│   │   │   │   └── endpoints/                # 32 file handler (21 đã hiện thực, 11 còn là stub TODO)
│   │   │   └── ws/
│   │   │       ├── __init__.py
│   │   │       ├── deps.py                   # authenticate_ws (JWT validation via query param)
│   │   │       ├── router.py                 # WebSocket router aggregator mounted at /ws
│   │   │       ├── chat.py                   # /ws/chat/{project_id}
│   │   │       └── notifications.py          # /ws/notifications
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py                     # Pydantic BaseSettings (.env loading)
│   │   │   ├── security.py                   # JWT create/decode + bcrypt hashing
│   │   │   ├── dependencies.py               # get_db, CurrentUser, require_roles, require_permissions
│   │   │   ├── exceptions.py                 # Custom exception handlers
│   │   │   ├── redis_client.py               # Async Redis singleton (get_redis)
│   │   │   └── ws_manager.py                 # ConnectionManager + publish() + redis_listener()
│   │   ├── db/
│   │   │   ├── __init__.py
│   │   │   ├── session.py                    # SQLAlchemy AsyncEngine & async_sessionmaker
│   │   │   ├── base.py                       # Model aggregator (34 tables)
│   │   │   └── seed.py                       # Seed data (7 Roles, 34 Permissions, Admin account)
│   │   ├── models/                           # 34 SQLAlchemy ORM models (8 Domains)
│   │   │   ├── base.py, associations.py, user.py, role.py, permission.py, skill.py, leave.py
│   │   │   ├── portfolio.py, project.py, phase.py, sprint.py, epic.py, milestone.py
│   │   │   ├── task.py, subtask.py, dependency.py, assignment.py, worklog.py, comment.py
│   │   │   ├── change_request.py, approval.py, project_version.py, audit_log.py, impact_report.py
│   │   │   ├── ai_request.py, ai_output.py, risk_report.py
│   │   │   ├── document.py, notification.py, email_log.py
│   │   │   └── chat_message.py, chat_read_state.py
│   │   ├── schemas/                          # Pydantic v2 Request/Response DTOs
│   │   │   ├── admin.py, auth.py, chat.py, dashboard.py, project.py, task.py, wbs.py, etc.
│   │   ├── services/                         # Business Logic Layer
│   │   │   ├── admin_service.py              # User & Role Admin management
│   │   │   ├── audit_service.py              # Audit log inspection
│   │   │   ├── auth_service.py               # Authentication & token issuance
│   │   │   ├── chat_service.py               # Project chat history, unread counts & publish
│   │   │   ├── scheduling_service.py         # Critical Path Method engine (dùng utils/cpm.py)
│   │   │   ├── dashboard_service.py          # KPIs, EVA, Burndown metrics
│   │   │   ├── notification_service.py       # Notification push & WS publish
│   │   │   ├── oauth_service.py              # Google & Facebook OAuth 2.0
│   │   │   ├── phase2_common.py              # get_project_context, notify_project_team, add_audit
│   │   │   ├── portfolio_service.py, project_service.py, task_service.py, wbs_service.py
│   │   │   ├── resource_service.py, role_service.py, user_service.py, storage_service.py
│   │   │   └── ai/                           # AI Provider implementations (OpenAI, Gemini)
│   │   ├── templates/email/                  # Jinja2 HTML email templates
│   │   ├── utils/                            # Helper utilities (cpm.py, email.py, pagination.py)
│   │   └── workers/                          # Celery Background Workers & Scheduler
│   │       ├── celery_app.py                 # Celery app + beat_schedule (daily task sweep)
│   │       ├── notification_tasks.py         # sweep_task_dates_task (task start & due-soon)
│   │       ├── ai_tasks.py, email_tasks.py, report_tasks.py
│   │   ├── alembic/versions/                 # Database migrations chain
│   │   └── tests/unit/                       # Automated unit test suite (123/123 passing)
│
├── frontend/                                 # Next.js 15 React / TypeScript Frontend
│   ├── src/
│   │   ├── app/                              # Next.js App Router
│   │   │   ├── (auth)/                       # login, register, forgot-password, reset-password, verify-email, oauth-callback
│   │   │   ├── (dashboard)/                  # Authenticated layout with NotificationBell & Nav
│   │   │   │   ├── layout.tsx                # Shell layout with useNotificationSocket
│   │   │   │   ├── dashboard/page.tsx        # Unified portfolio & project dashboard
│   │   │   │   ├── portfolios/               # Portfolio list & detail pages
│   │   │   │   ├── projects/                 # Projects list page
│   │   │   │   │   └── [id]/                 # Project Shell (Tabs: Overview, Tasks, WBS, Members, Chat, Settings)
│   │   │   │   │       ├── overview/page.tsx
│   │   │   │   │       ├── tasks/page.tsx    # Kanban & Task list views
│   │   │   │   │       ├── wbs/page.tsx      # WBS hierarchy tree view
│   │   │   │   │       ├── members/page.tsx  # Project team members management
│   │   │   │   │       ├── chat/page.tsx     # Real-time Project Chat room
│   │   │   │   │       └── settings/page.tsx
│   │   │   │   ├── admin/                    # Admin Portal (users, roles, audit)
│   │   │   │   │   ├── users/page.tsx
│   │   │   │   │   ├── roles/page.tsx
│   │   │   │   │   └── audit/page.tsx
│   │   │   │   └── profile/page.tsx          # Profile & User settings
│   │   │   ├── globals.css                   # Tailwind styles
│   │   │   ├── layout.tsx                    # Root Layout
│   │   │   └── page.tsx                      # Landing redirect
│   │   ├── features/                         # Feature-colocated modules
│   │   │   ├── admin/                        # AdminUserList, RoleForm, AuditTimeline
│   │   │   ├── auth/                         # LoginForm, RegisterForm, SocialLoginButtons
│   │   │   ├── chat/                         # ChatPanel, ChatMessageItem, useChatSocket, useChat
│   │   │   ├── dashboard/                    # KPI cards, EVA charts, ActivityFeed
│   │   │   ├── notifications/                # NotificationBell, NotificationList, useNotifications
│   │   │   ├── portfolios/                   # PortfolioCard, PortfolioForm, usePortfolios
│   │   │   ├── projects/                     # ProjectWizard, ProjectCard, ProjectMembersTable
│   │   │   ├── tasks/                        # KanbanBoard, TaskDrawer, useTasks
│   │   │   ├── users/                        # UserProfileForm, useUsers
│   │   │   └── wbs/                          # WBSTreeView, PhaseModal, useWBS
│   │   ├── components/common/                # Shared UI primitives (Avatar, Button, Modal, Input, Spinner, etc.)
│   │   ├── lib/
│   │   │   ├── ws-client.ts                  # Reconnecting WebSocket client helper
│   │   │   ├── rbac.ts                       # isAdminUser helper
│   │   │   └── utils.ts                      # Styling & date utilities
│   │   ├── services/api.ts                   # Axios client with JWT interceptor & refresh queue
│   │   ├── store/authStore.ts                # Zustand Auth Store (persisted token & cookie sync)
│   │   └── middleware.ts                     # Next.js Edge Route Guard
│
├── docker-compose.yml                        # 7-service orchestration configuration
├── erd_ai_project_management.html            # Interactive HTML ERD diagram
└── .documents/specs/system-architecture/     # BRD, SRS, Design, Sequence Diagrams
```

---

## 6. Database Schema (8 Domains & 34 Tables)

Cơ sở dữ liệu gồm **34 bảng** (4 bảng quan hệ Many-to-Many + 30 bảng thực thể) chia thành **8 Domains chức năng**:

| Domain | Số bảng | Danh sách bảng | Mô tả chức năng |
|---|---|---|---|
| **1. Base & Associations** | 4 | `user_roles`, `role_permissions`, `user_skills`, `project_members` | Bảng liên kết N-N cho Role, Permission, Skill, Project Team |
| **2. User & RBAC** | 5 | `users`, `roles`, `permissions`, `skills`, `leaves` | Tài khoản, 34 quyền hệ thống, danh mục kỹ năng, lịch nghỉ phép |
| **3. Project Core** | 6 | `portfolios`, `projects`, `phases`, `sprints`, `epics`, `milestones` | Cấu trúc phân rã công việc WBS & Danh mục |
| **4. Task & Scheduling** | 6 | `tasks`, `subtasks`, `dependencies`, `assignments`, `worklogs`, `comments` | Công việc, CPM fields, phân bổ nhân sự, timesheet, cờ thông báo |
| **5. Change Management** | 5 | `change_requests`, `approvals`, `project_versions`, `audit_logs`, `impact_reports` | Quy trình CR đa cấp (BA→PO→PM), snapshot, rollback, audit trail |
| **6. AI Domain** | 3 | `ai_requests`, `ai_outputs`, `risk_reports` | Lịch sử prompt AI, tokens tiêu thụ, phân tích rủi ro |
| **7. Document & Notification** | 3 | `documents`, `notifications`, `email_logs` | Quản lý tệp MinIO, thông báo in-app và nhật ký gửi email |
| **8. Real-Time Chat** | 2 | `chat_messages`, `chat_read_states` | Tin nhắn trò chuyện theo dự án, trạng thái đã đọc theo người dùng |

### Bảng `tasks` với các trường CPM và cờ thông báo định kỳ

```python
class Task(Base):
    __tablename__ = "tasks"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[TaskStatus] = mapped_column(default=TaskStatus.TODO)
    priority: Mapped[TaskPriority] = mapped_column(default=TaskPriority.MEDIUM)
    estimated_hours: Mapped[float] = mapped_column(Float, default=0.0)
    actual_hours: Mapped[float] = mapped_column(Float, default=0.0)
    
    start_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    due_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    
    # CPM Scheduling Fields
    es: Mapped[float] = mapped_column(Float, default=0.0)         # Earliest Start
    ef: Mapped[float] = mapped_column(Float, default=0.0)         # Earliest Finish
    ls: Mapped[float] = mapped_column(Float, default=0.0)         # Latest Start
    lf: Mapped[float] = mapped_column(Float, default=0.0)         # Latest Finish
    float_time: Mapped[float] = mapped_column(Float, default=0.0) # Slack/Float
    is_critical: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Idempotency timestamp columns for Celery Beat sweeps
    last_start_notified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    last_due_soon_notified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
```

---

## 7. Hệ thống phân quyền (RBAC) & Quản trị Admin

### 7 Roles hệ thống

| Role | Mô tả | Quyền chính |
|---|---|---|
| **Admin** | Quản trị hệ thống | Quản trị toàn diện Người dùng, Vai trò, Gán 34 permissions, Xem Audit Logs, Cấu hình AI |
| **PM** | Project Manager | Tạo/quản lý Portfolio & Project, Phân công nhân sự, Quản lý thành viên, Duyệt CR, Rollback, Xuất báo cáo |
| **BA** | Business Analyst | Xem xét và phê duyệt Change Request (bước 1), Xem báo cáo AI Impact Report |
| **PO** | Product Owner | Phê duyệt Change Request (bước 2), Theo dõi tiến độ & Roadmap dự án |
| **Member** | Thành viên dự án | Xem task được phân công, Cập nhật trạng thái, Ghi nhận WorkLog timesheet, Chat nhóm dự án |
| **Customer** | Khách hàng | Khởi tạo Change Request, Theo dõi tiến độ dự án của mình |
| **Investor** | Nhà đầu tư | Xem Dashboard chỉ số Portfolio / Dự án ở chế độ **Read-only** |

### Quản trị Admin Panel (Frontend `/admin`)
- **Users (`/admin/users`)**: Tạo người dùng, chỉnh sửa thông tin, kích hoạt / vô hiệu hóa tài khoản an toàn (bảo vệ tài khoản admin cuối cùng).
- **Roles (`/admin/roles`)**: Tạo vai trò tùy chỉnh, gán nhóm quyền theo tài nguyên từ 34 permissions (bảo vệ vai trò mặc định "Admin").
- **Audit Logs (`/admin/audit`)**: Bảng truy vết toàn bộ thao tác hệ thống với bộ lọc theo loại đối tượng (`entity_type`) và phân trang.

---

## 8. Quy trình vận hành chuẩn (SOP)

- **SOP-PM-001: Khởi tạo dự án & Quản lý thành viên**: PM tạo dự án, phân bổ ngân sách, gán thành viên qua `project_members`.
- **SOP-AI-001: AI Project Generator**: PM nhập Prompt tự nhiên → AI sinh cấu trúc WBS (Phases, Sprints, Epics, Tasks, Dependencies) → Tự động tính toán CPM.
- **SOP-PM-002: Time Tracking & Timesheets**: Member bấm `Start`/`Stop` hoặc ghi nhận WorkLog thủ công → Cập nhật `actual_hours` và chi phí.
- **SOP-PM-003: Critical Path Method (CPM)**: Tự động chạy thuật toán Topological Sort + Forward/Backward pass khi có cập nhật thời lượng hoặc quan hệ phụ thuộc.
- **SOP-RM-001 & SOP-AI-004: Resource Leveling & Đề xuất AI**: Đề xuất nhân sự tối ưu dựa trên kỹ năng (`user_skills`), chi phí và lịch nghỉ phép (`leaves`), cảnh báo khi quá tải >8h/ngày.
- **SOP-CR-001: Change Request Workflow**: Quy trình duyệt đa cấp tuần tự `Customer → BA → PO → AI Impact Analysis → PM Final Approval → Snapshot Version → Apply`.
- **SOP-PM-004: Project Versioning & Rollback**: Tự động lưu snapshot baseline trước khi cập nhật lớn, cho phép so sánh Diff và khôi phục khi cần.
- **SOP-CHAT-001: Project Real-time Chat**: Kênh chat nội bộ dự án kết nối qua WebSocket `/ws/chat/{project_id}`, lưu trữ lịch sử tin nhắn và đếm unread count.
- **SOP-NOTI-001: Real-time Notification & Daily Sweep**: Đẩy thông báo tức thời qua WebSocket `/ws/notifications` khi có sự kiện (giao task, đổi trạng thái, cập nhật ngày); Celery Beat quét định kỳ 08:00 AM hàng ngày gửi thông báo task bắt đầu và sắp đến hạn.
- **SOP-RPT-001: Xuất báo cáo tự động**: Xuất file tổng hợp tiến độ và tài chính định dạng DOCX và XLSX qua Celery worker.

---

## 9. Thuật toán cốt lõi & Hạ tầng Real-time

### Thuật toán Critical Path Method (Pure Python in `app/utils/cpm.py`)

```python
def calculate_cpm(tasks_dict: Dict[int, Dict], dependencies: List[Dict]) -> List[int]:
    """Tính toán Forward Pass, Backward Pass, Total Float và Critical Path"""
    order = topological_sort(list(tasks_dict.values()), dependencies)
    
    # 1. Forward Pass (ES, EF)
    for tid in order:
        task = tasks_dict[tid]
        preds = [d for d in dependencies if d["to_task_id"] == tid]
        task["es"] = max((tasks_dict[d["from_task_id"]]["ef"] + d.get("lag_hours", 0) for d in preds), default=0.0)
        task["ef"] = task["es"] + task["estimated_hours"]

    # 2. Backward Pass (LF, LS)
    max_ef = max((t["ef"] for t in tasks_dict.values()), default=0.0)
    for tid in reversed(order):
        task = tasks_dict[tid]
        succs = [d for d in dependencies if d["from_task_id"] == tid]
        task["lf"] = min((tasks_dict[d["to_task_id"]]["ls"] - d.get("lag_hours", 0) for d in succs), default=max_ef)
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

### WebSocket ConnectionManager & Redis Pub/Sub Bus (`app/core/ws_manager.py`)

```python
class ConnectionManager:
    """Quản lý các kết nối WebSocket cục bộ và phân phối message từ Redis Pub/Sub."""
    def __init__(self):
        self.active_connections: dict[str, set[WebSocket]] = defaultdict(set)

    async def connect(self, channel: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[channel].add(websocket)

    def disconnect(self, channel: str, websocket: WebSocket):
        self.active_connections[channel].discard(websocket)

    async def broadcast_local(self, channel: str, message: dict):
        for ws in list(self.active_connections.get(channel, set())):
            try:
                await ws.send_json(message)
            except Exception:
                self.disconnect(channel, ws)

async def publish(channel: str, message: dict):
    """Đẩy message lên Redis Pub/Sub để phát tán tới mọi tiến trình backend worker."""
    redis = await get_redis()
    await redis.publish(f"ws:{channel}", json.dumps(message))
```

---

## 10. API Specification & WebSocket Endpoints

### Danh mục REST API Routers (`/api/v1/...`)

**21 router đang được mount & phục vụ thật:**

| STT | Endpoint Prefix | Router File | Mô tả chức năng |
|---|---|---|---|
| 1 | `/auth` | `auth.py` | Đăng ký, đăng nhập, cấp token, đổi mật khẩu, xác thực email |
| 2 | `/oauth` | `oauth.py` | Google & Facebook OAuth 2.0 Social Login |
| 3 | `/users` | `users.py` | CRUD người dùng, xem & cập nhật hồ sơ cá nhân |
| 4 | `/roles` | `roles.py` | Quản lý vai trò (Role CRUD) và gán quyền |
| 5 | `/permissions` | `permissions.py` | Danh sách 34 permissions hệ thống |
| 6 | `/portfolios` | `portfolios.py` | CRUD danh mục dự án cấp cao |
| 7 | `/projects` | `projects.py` | CRUD dự án & quản lý thành viên (`/projects/{id}/members`) |
| 8 | `/phases` | `phases.py` | Quản lý các giai đoạn (Phase) của dự án |
| 9 | `/sprints` | `sprints.py` | Quản lý Sprint theo chu kỳ Agile |
| 10 | `/epics` | `epics.py` | Quản lý Epic (tính năng lớn) |
| 11 | `/milestones` | `milestones.py` | Theo dõi các cột mốc quan trọng |
| 12 | `/tasks` | `tasks.py` | CRUD Task, đổi trạng thái, kích hoạt CPM & thông báo |
| 13 | `/subtasks` | `subtasks.py` | Quản lý công việc con (Subtask) |
| 14 | `/dependencies` | `dependencies.py` | Thiết lập liên kết phụ thuộc (FS, SS, FF, SF) & kiểm tra chu trình |
| 15 | `/assignments` | `assignments.py` | Phân bổ nhân sự cho công việc |
| 16 | `/worklogs` | `worklogs.py` | Ghi nhận thời gian làm việc thực tế (Timesheet) |
| 17 | `/projects/{id}/messages` | `chat.py` | Lấy lịch sử tin nhắn chat theo dự án (cursor pagination) + unread-count / read |
| 18 | `/resource-leveling` | `resource_leveling.py` | Kiểm tra và cảnh báo quá tải nhân sự |
| 19 | `/dashboards` | `dashboards.py` | Tổng hợp chỉ số KPI, EVA, Burndown/Burnup/Velocity |
| 20 | `/notifications` | `notifications.py` | Lấy danh sách thông báo, đếm unread count, đánh dấu đã đọc |
| 21 | `/audit` | `audit_timeline.py` | Truy vết lịch sử biến động toàn hệ thống (Audit Trail) |

**11 router còn là stub `TODO: Implement` — bị comment trong `router.py`, CHƯA mount:**
`/leaves` · `/skills` · `/documents` · `/approvals` · `/change-requests` · `/gantt` · `/cpm` · `/reports` · `/versions` · `/ai` · `/system`
> Các file này tồn tại trong `api/v1/endpoints/` nhưng chỉ trả về placeholder và không có dependency auth. Xem chú thích trong [`router.py`](./backend/app/api/v1/router.py).

### Danh mục WebSocket Endpoints (`/ws/...`)

| Endpoint Route | Giao thức | Xác thực | Mục đích |
|---|---|---|---|
| `/ws/chat/{project_id}` | WebSocket | `?token=<JWT>` | Kênh chat thời gian thực cho thành viên dự án (`project_members`) |
| `/ws/notifications` | WebSocket | `?token=<JWT>` | Đẩy thông báo cá nhân tức thời tới người dùng (`notif:user:{user_id}`) |

> - **Swagger UI Interactive Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
> - **ReDoc OpenAPI Documentation:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 11. Cài đặt và Chạy hệ thống

### Điều kiện tiên quyết
- **Python:** >= 3.11
- **Node.js:** >= 18.x (khuyên dùng Node 20 LTS)
- **PostgreSQL:** >= 16
- **Redis:** >= 7.x
- **MinIO:** MinIO Server (hoặc S3 compatible)
- *(Khuyên dùng)* **Docker & Docker Compose**

---

### Cách 1: Khởi chạy toàn bộ hệ thống bằng Docker Compose

```bash
# 1. Khởi động 7 dịch vụ (PostgreSQL, Redis, MinIO, Backend, Celery Worker, Celery Beat, Frontend)
docker-compose up -d

# 2. Kiểm tra trạng thái các container
docker-compose ps

# 3. Xem logs thời gian thực của backend & celery
docker-compose logs -f backend celery-worker celery-beat

# 4. Dừng hệ thống khi kết thúc làm việc
docker-compose down
```

---

### Cách 2: Cài đặt và chạy thủ công (Local Development)

#### 1. Khởi động Backend (FastAPI)

```bash
cd backend

# Tạo và kích hoạt môi trường ảo Python
python -m venv .venv
# Trên Windows:
.venv\Scripts\activate
# Trên Linux/macOS:
source .venv/bin/activate

# Cài đặt thư viện dependencies
pip install -r requirements.txt

# Cấu hình biến môi trường
cp .env.example .env

# Chạy migration database
alembic upgrade head

# Nạp dữ liệu seed ban đầu (7 Roles, 34 Permissions, 1 Admin Account)
# Mật khẩu admin lấy từ SEED_ADMIN_PASSWORD; nếu không đặt, script sinh ngẫu nhiên
# và in ra MỘT LẦN duy nhất — hãy lưu lại ngay.
# Tuỳ chọn: SEED_ADMIN_EMAIL, SEED_ADMIN_USERNAME
python -m app.db.seed

# Khởi chạy server FastAPI kèm WebSocket support
uvicorn app.main:app --reload --port 8000
```

#### 2. Khởi động Celery Worker & Celery Beat

```bash
# Terminal 2: Khởi động Celery Worker
cd backend
.venv\Scripts\activate
celery -A app.workers.celery_app worker --loglevel=info

# Terminal 3: Khởi động Celery Beat (Quét task định kỳ hàng ngày)
cd backend
.venv\Scripts\activate
celery -A app.workers.celery_app beat --loglevel=info
```

#### 3. Khởi động Frontend (Next.js 15)

```bash
# Terminal 4: Khởi động Next.js App
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Truy cập ứng dụng tại: **[http://localhost:3000](http://localhost:3000)**

---

## 12. Cấu hình & Biến môi trường

### Backend Environment (`backend/.env`)

```env
# Application
APP_ENV=development
APP_NAME=AI Project Management API
APP_VERSION=2.2.0
SECRET_KEY=your-super-secret-key-min-32-chars-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Database (PostgreSQL Async via asyncpg)
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/ai_project_management
DATABASE_POOL_SIZE=10
DATABASE_MAX_OVERFLOW=20

# Redis (Cache, Pub/Sub & Celery)
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/1
CELERY_RESULT_BACKEND=redis://localhost:6379/2

# CORS
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]

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

### Frontend Environment (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

> **Lưu ý**: `NEXT_PUBLIC_WS_URL` sử dụng định dạng bare origin (không có đuôi `/ws`), mã nguồn frontend sẽ tự động ghép nối `/ws/chat/{project_id}` và `/ws/notifications`.

---

## 13. Quy tắc phát triển

1. **Chuẩn kiến trúc phân tầng (Layered Architecture)**: `Endpoints (Router)` → `Services (Business Logic)` → `Repositories (Data Access)` → `Models (SQLAlchemy Declarative)`.
2. **Xử lý Real-time qua Redis Pub/Sub**: WebSocket messages đẩy qua hàm `publish(channel, data)`, `redis_listener` nhận và phân phối về các socket cục bộ nhằm hỗ trợ scale đa tiến trình worker.
3. **Quản lý Token & Bảo mật**:
   - Access Token có thời hạn 30 phút, Refresh Token 7 ngày.
   - WebSocket xác thực qua Query Token (`authenticate_ws`) với kiểm tra `auth_version` và `is_active`.
   - Phân quyền endpoint qua `require_roles()` hoặc `require_permissions()`.
4. **Không block Event Loop**: Toàn bộ tác vụ nặng (AI generation, Document parsing, Gửi email, Xuất báo cáo, Quét lịch trình) bắt buộc chạy qua Celery Background Tasks.
5. **Đồng bộ hóa Frontend State**:
   - Quản lý Server State bằng **TanStack Query v5** theo mô hình Feature-colocated (`features/<feature>/hooks/`).
   - Sử dụng `lib/ws-client.ts` để tự động kết nối lại khi mất mạng (Reconnection w/ exponential backoff).

---

## 14. Roadmap phát triển

```
[Phase 1: Core Auth & RBAC] ──► [Phase 2: Project Core & Chat] ──► [Phase 3: AI Engine]
       (100% Hoàn thành)                (100% Hoàn thành)             (~15% — chỉ có Provider layer)
                                                                            │
[Phase 5: Document AI & Polish] ◄──── [Phase 4: Workflow & Reporting] ◄─────┘
  (~40% — WS/Beat/Notif xong,          (~30% — chỉ Audit Timeline + WS xong,
   Document/Investor chưa làm)          CR/Versioning/Reports mới ở mức model DB)
```

- [x] **Phase 1 — Core Auth & User Onboarding** *(Hoàn thành)*
  - [x] Xác thực JWT Access + Refresh Token, mã hóa bcrypt, Edge Middleware route guard.
  - [x] Đăng ký, đăng nhập, quên/đổi mật khẩu, xác thực email qua SMTP.
  - [x] Social Login Google & Facebook OAuth 2.0.
  - [x] Quản lý hồ sơ người dùng & Avatar MinIO.
  - [x] Quản trị Admin: Quản lý người dùng (`/admin/users`), phân quyền Roles & 34 Permissions (`/admin/roles`).

- [x] **Phase 2 — Portfolio & Project Core + Real-time Chat** *(Hoàn thành)*
  - [x] CRUD Portfolio & Project kèm phân quyền thành viên dự án (`project_members`).
  - [x] Cấu trúc phân rã WBS: Phases, Sprints, Epics, Milestones, Tasks, Subtasks.
  - [x] Đồ thị quan hệ phụ thuộc Task (FS/SS/FF/SF) & Động cơ tính đường găng CPM (nội bộ `utils/cpm.py`).
  - [x] Phân bổ nhân sự, Timesheet WorkLogs, Resource Leveling kiểm tra quá tải.
  - [x] **Real-time Project Chat (`/projects/[id]/chat`, `/ws/chat/{id}`)** với lịch sử tin nhắn và unread badge.
  - [x] **Notification triggers & Celery Beat daily sweep** (thông báo task bắt đầu và sắp đến hạn lúc 08:00 AM).
  - [ ] Endpoint `/gantt`, `/cpm` công khai (hiện chỉ tính nội bộ, chưa có API/UI Gantt).

- [ ] **Phase 3 — AI Features Module** *(~15% — mới có Provider layer)*
  - [x] Tầng trừu tượng hóa AI Provider (`BaseAIProvider`, `OpenAIProvider`, `GeminiProvider`).
  - [x] `project_generator.py` — hàm `generate_project_from_prompt()` (chưa được gọi từ endpoint/worker nào).
  - [x] Models logging (`ai_requests`, `ai_outputs`, `risk_reports`) đã migrate.
  - [ ] Endpoint `/ai` (đang là stub, chưa mount) + Celery `ai_tasks` (đang là stub).
  - [ ] AI Project Generator UI, Impact Analysis, Schedule Optimization, Resource Recommendation, Risk Analysis.

- [ ] **Phase 4 — Workflow & Reporting Module** *(~30%)*
  - [x] Hệ thống Quản trị & Audit Timeline toàn diện (`/admin/audit`, cursor pagination).
  - [x] Hạ tầng WebSocket + Redis Pub/Sub (`ws_manager.py`).
  - [x] Models DB: `change_requests`, `approvals`, `project_versions`, `impact_reports` đã migrate.
  - [x] Dashboard endpoints (`/dashboards`: KPI, EVA, Burndown).
  - [ ] Change Request & Multi-Level Approval workflow (endpoint stub, chưa mount, chưa có UI).
  - [ ] Project Versioning snapshot & Rollback (endpoint stub, chưa mount).
  - [ ] Interactive Gantt Chart endpoint + UI.
  - [ ] DOCX / XLSX Export (`report_tasks.py` là stub trả về rỗng, endpoint `/reports` chưa mount).

- [ ] **Phase 5 — Document AI & Polish** *(~40%)*
  - [x] **Real-time Notification Push qua WebSocket (`/ws/notifications`)**.
  - [x] **Celery Beat Scheduled Runner trong Docker Compose**.
  - [x] Profile & Avatar MinIO (frontend + backend).
  - [ ] Document upload & AI parser (endpoint `/documents` là stub, chưa mount).
  - [ ] Investor Read-Only Dashboard view.
  - [ ] Mobile navigation & UI fine-tuning polish.

---

## 15. Tài liệu tham khảo & Thuật ngữ

### Danh mục tài liệu kỹ thuật
| Tài liệu | Vị trí | Mô tả |
|---|---|---|
| **BRD** | [.documents/specs/system-architecture/brd.md](./.documents/specs/system-architecture/brd.md) | Business Requirements Document — Yêu cầu nghiệp vụ |
| **SRS** | [.documents/specs/system-architecture/srs.md](./.documents/specs/system-architecture/srs.md) | Software Requirements Specification — Đặc tả chức năng chi tiết |
| **Architecture Design** | [.documents/specs/system-architecture/design.md](./.documents/specs/system-architecture/design.md) | Tài liệu thiết kế kiến trúc hệ thống tổng thể |
| **Sequence Diagrams** | [.documents/specs/system-architecture/Sequence SOP/](./.documents/specs/system-architecture/Sequence%20SOP/) | Chuỗi Sequence Diagrams PlantUML cho từng SOP |
| **Interactive ERD** | [erd_ai_project_management.html](./erd_ai_project_management.html) | Sơ đồ tương tác cấu trúc 34 bảng Database |

---

## 16. License & Contributors

- **Lead Architect & Developer:** Nguyễn Ngọc Việt Thắng
- **Giấy phép:** [MIT License](./LICENSE)

---
*Cập nhật toàn diện hệ thống: 2026-09-03 (đối soát README với mã nguồn thực tế: 21/32 REST router đang mount, 123/123 unit test pass, Phase 3–5 mới ở mức hạ tầng).*
