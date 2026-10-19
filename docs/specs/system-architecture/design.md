# Thiết kế kiến trúc hệ thống
## Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI

**Version:** 2.5.0
**Date:** 2026-10-19
**Current baseline:** 33 REST routers, 39 database tables, 9 business domains; latest recorded test snapshot is 2026-10-16 (backend 697 passed / 28 skipped; frontend 32 files / 146 tests). Historical counts remain in Change History.

---

## Tổng quan

Hệ thống **AI Project Planning & Portfolio Management** được thiết kế theo kiến trúc hiện đại, tập trung hoàn toàn vào **Python (FastAPI)** cho phía Server và **Next.js 15 (React + TypeScript)** cho phía Client. Thiết kế tối ưu hóa cho:
- Tốc độ xử lý I/O bất đồng bộ (AsyncIO + SQLAlchemy Async Engine với asyncpg)
- Tính toán thuật toán CPM (thuần Python)
- Tích hợp linh hoạt với các mô hình AI ngôn ngữ lớn (LLMs) qua abstraction layer
- Giao tiếp thời gian thực hai chiều (Real-time WebSockets + Redis Pub/Sub đa tiến trình)
- Tác vụ nền bền vững (durable jobs lưu trong PostgreSQL, runner chạy trong tiến trình FastAPI) và lịch hằng ngày qua cron endpoint (Supabase Cron hoặc cron cục bộ); mã Celery chỉ còn kế thừa

---

## Ngăn xếp công nghệ

### Lớp phía máy chủ

| Thành phần | Thư viện | Phiên bản |
|---|---|---|
| Framework Core | FastAPI | 0.115.0 |
| ASGI Server | uvicorn[standard] | 0.30.0 |
| Validation & Serialization | Pydantic v2 | 2.9.0 |
| Settings | pydantic-settings | 2.5.0 |
| ORM | SQLAlchemy (Async Engine) | 2.0.35 |
| DB Driver | asyncpg | 0.29.0 |
| Database Migrations | Alembic | 1.13.3 |
| Security (JWT) | PyJWT[crypto] (thay python-jose — CVE-2024-33663/33664) | 2.13.0 |
| Security (Hash) | passlib[bcrypt] | 1.7.4 |
| Real-time Bus | Redis Pub/Sub + ConnectionManager | 5.1.1 |
| Task Queue | Durable jobs (bảng `jobs` PostgreSQL, outbox cùng transaction, runner trong FastAPI) | — |
| Bộ lập lịch | Supabase Cron / cron cục bộ gọi `POST /api/v1/internal/jobs/schedules` | — |
| Celery (kế thừa, không bắt buộc) | Celery[redis] | 5.4.0 |
| Message Broker / Cache | Redis | 5.1.1 |
| AI — xKiro | openai (SDK) | 1.51.0 |
| Lưu trữ tệp | minio / boto3 | 7.2.9 / 1.35.0 |
| Email | fastapi-mail + Jinja2 | 1.4.1 / 3.1.4 |
| Export DOCX | python-docx (SRS/BRD theo mẫu cố định) | 1.1.2 |
| Ảnh BPMN (PNG phía server) | Pillow | 11.0.0 |
| Export XLSX | openpyxl | 3.1.5 |
| HTTP Client | httpx | 0.27.2 |
| Date Utils | python-dateutil, pytz | 2.9.0 / 2024.2 |
| Kiểm thử | pytest, pytest-asyncio, httpx (kết quả theo từng lần chạy xem `docs/backend-final-verification.md`; mốc mới nhất ghi nhận 2026-10-16: backend 697/28, frontend 32 tệp / 146 test) | — |

### Lớp phía giao diện

| Thành phần | Thư viện | Phiên bản |
|---|---|---|
| Khung phát triển | Next.js (App Router) | ^15.5.25 |
| UI Runtime | React | ^18.3.0 |
| Ngôn ngữ | TypeScript | ^5.2.2 |
| Server State | TanStack Query v5 | ^5.0.0 |
| Global State | Zustand | ^4.4.0 |
| HTTP Client | Axios | ^1.5.0 |
| Real-time Client | lib/ws-client.ts (Native WebSocket) | — |
| Styling | Tailwind CSS v3 | ^3.3.0 |
| Forms | React Hook Form + Zod + @hookform/resolvers | ^7.47.0 / ^3.22.0 |
| i18n | next-intl (vi mặc định / en, locale lưu trong cookie, không dùng `[locale]` URL segment) | ^4.14.2 |
| Theme | ThemeProvider tự viết (class-based dark mode: light/dark/system) | — |
| Charts | Recharts | ^2.15.4 |
| Drag & Drop | @dnd-kit/core + sortable | ^6.0.0 / ^8.0.0 |
| Icons | Lucide React | ^0.290.0 |
| Date | date-fns | ^2.30.0 |
| CSS Utils | clsx + tailwind-merge | ^2.0.0 |

### Infrastructure Layer (Docker Compose — 7 Services Dev / 8 Services Prod)

| Service | Image / Tech | Port | Môi trường |
|---|---|---|---|
| `postgres` | postgres:16-alpine | 5432 | Dev & Prod |
| `redis` | redis:7-alpine | 6379 | Dev & Prod |
| `minio` | minio/minio:latest | 9000 (API), 9001 (Console) | Dev & Prod |
| `backend` | ./backend Dockerfile (FastAPI) | 8000 (Dev) / Nội bộ (Prod) | Dev & Prod |
| `celery-worker` | ./backend Dockerfile | — | Kế thừa, không bắt buộc |
| `celery-beat` | ./backend Dockerfile | — | Kế thừa, không bắt buộc |
| `frontend` | ./frontend Dockerfile (Next.js) | 3000 (Dev) / Nội bộ (Prod) | Dev & Prod |

> Network: `ai-project-network`. Volumes: `postgres_data`, `redis_data`, `minio_data`. Tác vụ nền chạy bằng durable jobs trong `backend`, nên `celery-worker`/`celery-beat` có thể bỏ khi chạy. Triển khai Production trên Render + Supabase Free Tier (xem [`docs/deploy-render-supabase.md`](../../deploy-render-supabase.md)).

---

## Kiến trúc phía máy chủ

Backend được thiết kế theo mô hình **Layered Architecture** (Kiến trúc phân tầng):

```
HTTP / WS Request
     │
     ▼
┌────────────────────────────────────────────────────────┐
│ 1. ENDPOINTS & WS LAYER (app/api/v1/ & app/api/ws/)    │
│    - 33 REST Routers mounted + 2 WebSocket Routers     │
│    - Kiểm tra RBAC (require_roles, require_permissions)│
│    - Xác thực WS handshake via vé một lần (ticket)     │
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
│    - SQLAlchemy Declarative Base (39 bảng)             │
│    - 9 domain nghiệp vụ, cộng bảng hạ tầng             │
└────────────────────────────────────────────────────────┘
```

### Cấu trúc thư mục phía máy chủ thực tế

```
backend/
├── app/
│   ├── main.py                 # FastAPI entrypoint + lifespan + CORS + WS Router mount
│   ├── api/
│   │   ├── v1/
│   │   │   ├── router.py       # Mount 33 REST routers (3 stub chưa mount: leaves, skills, system) → api_router
│   │   │   └── endpoints/
│   │   │       ├── auth.py, oauth.py, users.py, roles.py, permissions.py
│   │   │       ├── portfolios.py, projects.py, phases.py, sprints.py, epics.py, milestones.py
│   │   │       ├── tasks.py, subtasks.py, dependencies.py, assignments.py, worklogs.py
│   │   │       ├── chat.py, change_requests.py, cpm.py, resource_leveling.py, dashboards.py
│   │   │       ├── notifications.py, audit_timeline.py, ai.py, jobs.py, internal_jobs.py
│   │   │       ├── requirement_briefs.py   # /requirement-briefs (hỏi làm rõ yêu cầu)
│   │   │       ├── approvals.py            # /change-requests/{id}/approvals (BA -> PO -> PM)
│   │   │       ├── project_versions.py     # /projects/{id}/versions (baseline, diff, rollback)
│   │   │       ├── documents.py            # /projects/{id}/documents (+ /download) SRS/BRD DOCX
│   │   │       ├── reports.py              # /projects/{id}/reports/xlsx (+ /{job_id}/download)
│   │   │       ├── process_models.py       # /projects/{id}/process-model (BPMN)
│   │   │       └── leaves.py, skills.py, system.py   (stub, chưa mount)
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
│   ├── models/                 # 39 bảng — 8 Domains + jobs/security_states
│   │   ├── base.py             # DeclarativeBase + id, created_at, updated_at
│   │   ├── associations.py     # user_roles, role_permissions, user_skills, project_members
│   │   ├── user.py, role.py, permission.py, skill.py, leave.py (User & RBAC)
│   │   ├── portfolio.py, project.py, phase.py, sprint.py, epic.py, milestone.py (Project Core)
│   │   ├── task.py, subtask.py, dependency.py, assignment.py, worklog.py, comment.py (Task & CPM)
│   │   ├── requirement_brief.py, generated_document.py, process_model.py, job.py, security_state.py
│   │   ├── change_request.py, approval.py, project_version.py, audit_log.py, impact_report.py (Change Mgmt)
│   │   ├── ai_request.py, ai_output.py, risk_report.py (AI Domain)
│   │   ├── document.py, notification.py, email_log.py (Document & Notification)
│   │   └── chat_message.py, chat_read_state.py (Chat Domain)
│   ├── schemas/                # Pydantic schema files (admin, auth, chat, project, task, etc.)
│   ├── services/               # Business logic layer
│   │   ├── admin_service.py, audit_service.py, auth_service.py, chat_service.py
│   │   ├── change_request_service.py, scheduling_service.py (CPM), dashboard_service.py
│   │   ├── notification_service.py, oauth_service.py, phase2_common.py
│   │   ├── portfolio_service.py, project_service.py, resource_service.py
│   │   ├── role_service.py, task_service.py, user_service.py, wbs_service.py, storage_service.py
│   │   ├── job_service.py, durable_handlers.py, cron_service.py, daily_reminders.py (durable jobs + lịch)
│   │   ├── requirement_brief_service.py, approval_service.py, versioning_service.py
│   │   ├── document_service.py, process_model_service.py
│   │   ├── documents/          # templates.py, docx_renderer.py, process_png.py (PNG BPMN bằng Pillow)
│   │   ├── reports/            # report_service.py, xlsx_renderer.py (Task, Đường găng, CR và duyệt, EVA và Burndown)
│   │   └── ai/                 # base.py, xkiro_provider.py, model_router.py, durable_jobs.py, project_generator.py, impact_analyzer.py, schedule_optimizer.py, resource_recommender.py, risk_analyzer.py, requirement_clarifier.py, document_writer.py, process_modeler.py
│   ├── db/
│   │   ├── session.py          # AsyncEngine + async_sessionmaker + get_db()
│   │   ├── base.py             # Import tất cả models cho Alembic
│   │   └── seed.py             # 7 Roles, 34 Permissions, 1 Admin Account
│   ├── workers/                # Mã Celery kế thừa (không còn là đường chạy chính)
│   │   ├── celery_app.py, notification_tasks.py, ai_tasks.py, email_tasks.py, scheduling_tasks.py
│   │   └── __init__.py
│   └── utils/
│       ├── cpm.py              # Pure Python CPM Algorithm (topological_sort, calculate_cpm)
│       ├── version_diff.py     # Diff snapshot phiên bản (chỉ trả thay đổi)
│       ├── date_utils.py, pagination.py, email.py, sanitize.py
├── alembic/                    # Database migrations (async PostgreSQL)
└── tests/unit/                 # Xem kết quả theo mốc trong docs/backend-final-verification.md
```

---

## Kiến trúc phía giao diện

Frontend sử dụng **Next.js 15 App Router** theo mô hình **Feature-colocated architecture**:

```
frontend/src/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # login, register, forgot-password, reset-password, verify-email, oauth-callback
│   ├── (dashboard)/            # Authenticated layout with NotificationBell & WebSocket listener
│   │   ├── layout.tsx          # Shell layout (wires useNotificationSocket)
│   │   ├── dashboard/page.tsx  # KPI overview & project health
│   │   ├── process/                # Swimlane SVG cho ProcessModel
│   ├── reports/                # Nút Xuất XLSX
│   ├── portfolios/         # Portfolio list & detail views
│   │   ├── projects/           # Projects list page
│   │   │   └── [id]/           # Project Detail Shell (Overview, Tasks, WBS, Members, Chat, Change Requests, AI Insights, Settings)
│   │   │       ├── overview/page.tsx
│   │   │       ├── tasks/page.tsx
│   │   │       ├── wbs/page.tsx
│   │   │       ├── members/page.tsx
│   │   │       ├── chat/page.tsx
│   │   │       ├── change-requests/page.tsx # Danh sách Change Request + AI Impact Analysis
│   │   │       ├── change-requests/[crId]/  # Chi tiết CR + ApprovalTimeline
│   │   │       ├── versions/page.tsx        # Snapshot, baseline, diff, rollback
│   │   │       ├── gantt/page.tsx           # Gantt chỉ đọc (SVG, từ GET /projects/{id}/cpm)
│   │   │       ├── documents/page.tsx       # SRS/BRD DOCX
│   │   │       ├── process/page.tsx         # Quy trình BPMN swimlane SVG
│   │   │       ├── timesheet/
│   │   │       ├── ai-insights/page.tsx     # Risk Widget + Schedule Optimizer + Resource Recommender
│   │   │       └── settings/page.tsx
│   │   ├── admin/              # Admin Portal
│   │   │   ├── users/page.tsx  # User list & status toggle
│   │   │   ├── roles/page.tsx  # Role CRUD & permission matrix
│   │   │   └── audit/page.tsx  # System-wide audit timeline
│   │   └── profile/page.tsx    # User profile & skills
├── features/                   # Feature-colocated modules
│   ├── admin/                  # AdminUserList, RoleForm, AuditTimeline
│   ├── ai/                     # AIGeneratorModal, RequirementClarifier, useAIGenerator
│   ├── auth/                   # LoginForm, RegisterForm, SocialLoginButtons
│   ├── change-requests/        # ChangeRequestList, ChangeRequestDetail, ChangeRequestModal
│   ├── chat/                   # ChatPanel, ChatMessageItem, useChatSocket, useChat
│   ├── dashboard/              # KPI cards, EVA charts, ActivityFeed
│   ├── documents/              # Sinh/tải SRS, BRD
│   ├── gantt/                  # Gantt SVG, ảo hóa hàng, zoom ngày/tuần/tháng
│   ├── jobs/                   # Theo dõi durable job
│   ├── notifications/          # NotificationBell, NotificationList, useNotifications
│   ├── process/                # Swimlane SVG cho ProcessModel
│   ├── reports/                # Nút Xuất XLSX
│   ├── portfolios/             # PortfolioCard, PortfolioForm, usePortfolios
│   ├── projects/               # ProjectWizard, ProjectCard, ProjectMembersTable
│   ├── tasks/                  # KanbanBoard, TaskDrawer, useTasks
│   ├── versions/               # Danh sách phiên bản, diff, rollback
│   ├── ...                     # audit, profile, resource-recommendation, risk-analysis, schedule-optimization
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

## Lược đồ cơ sở dữ liệu (SQLAlchemy — 8 Domains, 39 bảng)

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
  tasks.archived_at (task được lưu trữ khi rollback thay vì xóa)

Domain 5: Change Management
  projects ──── change_requests ──── approvals ──── users
    (approvals: required_role, approver_id nullable, trạng thái CANCELLED, unique (change_request_id, step_order))
  change_requests ──── impact_reports
  projects ──── project_versions (snapshot có thể gắn change_request_id)
  audit_logs (global entity tracking)

Domain 6: AI Domain
  projects ──── ai_requests ──── ai_outputs
  projects ──── risk_reports
  requirement_briefs (hồ sơ yêu cầu 7 mục) ──── projects
  projects ──── process_models (BPMN)
  enum airequesttype thêm REQUIREMENT_CLARIFY, DOCUMENT_GENERATE, BPMN_GENERATE

Domain 7: Document & Notification
  projects ──── documents
  projects ──── generated_documents (SRS/BRD DOCX)
  users ──── notifications
  email_logs

Domain 8: Real-Time Chat
  projects ──── chat_messages ──── users
  chat_messages ──── chat_read_states ──── users

Hạ tầng: jobs (durable jobs), security_states
Head migration: 20261013_process_models
```

---

## Real-Time Communication (WebSocket)

Hệ thống cung cấp 2 native FastAPI `WebSocket` endpoints được mount tại **app root** dưới `/ws` (không nằm dưới `/api/v1` — xem `app/main.py`), sử dụng Redis Pub/Sub làm message bus đa tiến trình (`app/core/ws_manager.py`):

```
/ws/chat/{project_id}?ticket=<ticket>   ← Kênh chat theo từng dự án (dành cho project_members)
/ws/notifications?ticket=<ticket>       ← Kênh đẩy thông báo cá nhân theo người dùng (notif:user:{id})
```

**Cơ chế xác thực (Auth handshake)**: Trình duyệt không đặt được header tuỳ ý trên WebSocket handshake, nên access token JWT KHÔNG được truyền trực tiếp trên query string (từng làm vậy trước đây — rủi ro lộ token qua access log của proxy/load balancer). Thay vào đó, client gọi `POST /api/v1/auth/ws-ticket` (xác thực bằng header `Authorization` như request thường) để xin một **vé dùng một lần** (`app/core/ws_tickets.py::issue()`), sống 60 giây, lưu trong Redis dưới dạng SHA-256 hash. Vé được truyền qua query param `?ticket=...` khi mở socket; `app/api/ws/deps.py::authenticate_ws()` gọi `ws_tickets.py::redeem()` (đọc-và-xoá atomic) để đổi vé lấy `user_id`/`auth_version`, sau đó xác thực `auth_version`/`is_active` của user. Nếu không hợp lệ, đóng socket với mã code `4401`. Với socket đang mở lâu dài, một watchdog (`enforce_connection_validity()`) kiểm tra lại mỗi 60 giây xem tài khoản còn active và còn quyền truy cập kênh hay không.

**Mô hình phân phối (Delivery model)**: `app/core/ws_manager.py::publish(channel, payload)` đẩy tin nhắn lên Redis (tiền tố `ws:<channel>`). Background task `redis_listener()` trong FastAPI lifespan nhận và phân phối về các WebSocket nội bộ của tiến trình.

**Project Chat**: Gated bởi `get_project_context()` kiểm tra quyền thành viên dự án. Khung tin nhắn gửi lên qua socket được định tuyến qua cùng phương thức `ChatService.create_message()` như REST fallback (`POST /api/v1/projects/{id}/messages`).

**Real-time Notifications**: Single choke point `NotificationService.push()` lưu bản ghi vào DB, `flush()` lấy ID và timestamp rồi gọi `publish()`, giúp toàn bộ các trigger (tạo task, đổi trạng thái, cập nhật ngày, fan-out) tự động đẩy qua WebSocket tức thời.

---

## Durable jobs và tác vụ theo lịch

Celery đã được thay bằng **durable jobs** lưu trong bảng `jobs` của PostgreSQL. Job được ghi cùng transaction với dữ liệu nghiệp vụ (outbox), runner chạy trong tiến trình FastAPI nhận và xử lý. Trạng thái job đọc qua `/api/v1/jobs`. Mã Celery trong `app/workers/` chỉ còn kế thừa; service `celery-worker`/`celery-beat` trong docker-compose không bắt buộc.

Kind job hiện có: `ai.project_generate`, `ai.impact_analysis`, `ai.schedule_optimize`, `ai.resource_recommend`, `ai.risk_analysis`, `ai.requirement_clarify`, `ai.bpmn_generate`, `document.generate`, `report.xlsx`, `scheduling.cpm`, `email.verify|reset|invite`, `cron.reminders`, `cron.risk`. Quota AI theo `AI_DAILY_JOB_LIMIT` (mặc định 20 job/ngày).

Lịch hằng ngày: Supabase Cron (cloud) hoặc cron cục bộ gọi `POST /api/v1/internal/jobs/schedules`; endpoint này sinh job theo lịch (múi giờ `Asia/Ho_Chi_Minh`):
1. **`cron.reminders` (08:00)**: quét task bắt đầu hôm nay (`start_date == today`, TODO, chưa thông báo) và task sắp đến hạn (`due_date == today + 1`, chưa DONE, chưa thông báo), gửi thông báo fan-out tới nhóm dự án và cập nhật `last_start_notified_at` / `last_due_soon_notified_at`.
2. **`cron.risk` (08:30)**: xếp hàng phân tích rủi ro AI cho các dự án `ACTIVE`.

Email gửi qua SMTP hoặc Resend; trên bản demo Render hiện đang tắt. Tệp (avatar, SRS/BRD DOCX, XLSX) lưu trong bucket riêng tư (Supabase Storage trên cloud, MinIO cục bộ) và tải qua proxy kiểm tra quyền.

---

## Thiết kế các luồng Phase 4

### Hỏi làm rõ yêu cầu
- Hồ sơ yêu cầu (`requirement_briefs`) gồm 7 mục: goals, stakeholders, in_scope, out_of_scope, key_features, constraints, success_criteria; mỗi mục có trạng thái clear / missing / assumed / skipped.
- AI (`ai/requirement_clarifier.py`, job `ai.requirement_clarify`) hỏi đúng một câu mỗi lượt, có thể đề xuất giả định, trần 12 lượt; có nút "Bỏ qua, tạo luôn". AI không ghi đè mục người dùng đã xác nhận. UI `RequirementClarifier` trong `AIGeneratorModal`.
- `POST /ai/generate-project-from-brief` chỉ dùng mục clear/assumed; mục skipped không được bịa. Endpoint sinh từ prompt thô cũ giữ tương thích.

### Duyệt Change Request
- Submit tạo 3 bước BA -> PO -> PM (`approval_service.py`); dự án thiếu vai trò trả 422 `missing_roles`.
- Thành viên đúng vai trò (kể cả người tạo CR) quyết định bước hiện hành; admin hệ thống chỉ xem. Khóa hàng chống quyết định đồng thời.
- Từ chối bắt buộc có lý do, các bước sau chuyển CANCELLED. Ghi audit log và thông báo in-app. PM duyệt cuối tự tạo snapshot gắn `change_request_id`.
- UI `ApprovalTimeline` tại `/projects/[id]/change-requests/[crId]`.

### Snapshot và rollback (quy tắc V0)
- Snapshot (`versioning_service.py`) gồm phase, sprint, epic, milestone, task, dependency; không gồm worklog, comment, subtask, assignment. Tối đa 50 phiên bản/dự án; baseline thủ công chỉ PM/admin.
- Diff (`utils/version_diff.py`, `/{a}/diff/{b|current}`) chỉ trả các thay đổi.
- Rollback chạy trong một transaction: task có dữ liệu phụ thuộc được đánh dấu `archived_at` thay vì xóa; worklog không bao giờ bị xóa; task đã xóa được tạo lại với ID mới và trả `id_map`; tự tạo phiên bản "trước khi khôi phục" để đảo ngược; tính lại CPM sau rollback.

### Gantt chỉ đọc
- Vẽ SVG từ `GET /projects/{id}/cpm` (không còn router `/gantt`); đường găng có nhãn chữ, zoom ngày/tuần/tháng, ảo hóa hàng (tới 2000 task). CPM có giới hạn `CPM_MAX_TASKS`/`CPM_MAX_DEPENDENCIES`, vượt trả 422 `resource_limit_exceeded`. Kéo thả ngoài phạm vi.

### Chuỗi job sinh tài liệu SRS/BRD
- Job `document.generate`: `ai/document_writer.py` viết JSON theo nhóm mục (SRS 3 lượt AI, BRD 4 lượt), ghép vào mẫu cố định (`documents/templates.py`, `docx_renderer.py`), lưu `generated_documents` và storage.
- Mục "Giả định và vấn đề mở" sinh từ hồ sơ yêu cầu. Nếu hồ sơ còn mục missing, tài liệu ở trạng thái `needs_clarification` và mở lại vòng hỏi. Ngôn ngữ mặc định tiếng Việt, tham số `language` vi|en.

### Xuất XLSX
- Job `report.xlsx` (`reports/report_service.py`, `xlsx_renderer.py`) tạo các sheet Task, Đường găng, CR và duyệt, EVA và Burndown. EVA tính theo giờ công: BAC = tổng giờ ước tính, EV, AC, PV, SPI, CPI. Nút Xuất XLSX ở trang tổng quan dự án.

### Mô hình quy trình BPMN
- Job `ai.bpmn_generate`: `ai/process_modeler.py` sinh ProcessModel (lane, task, gateway, event, flow), qua validator rồi lưu `process_models` (`process_model_service.py`).
- Trang `/projects/[id]/process` vẽ swimlane SVG. Phía server vẽ PNG bằng Pillow (`documents/process_png.py`) để chèn vào DOCX; nếu vẽ lỗi thì dùng bảng các bước.

---

## Change History

| Version | Date | Thay đổi |
|---|---|---|
| 1.0 | 2026-06-25 | Phiên bản ban đầu |
| 2.0 | 2026-08-05 | Cập nhật toàn diện: Next.js 15 (thay Vite), 7 Domains/31 Tables, thêm chi tiết Layered Architecture, Repository Pattern, 34 Permissions, 13 Notification types, chi tiết Celery tasks, CPM fields, security flow |
| 2.1 | 2026-08-13 | Đã hoàn thành Auth & User Onboarding Module (Login, Register, Google & Facebook OAuth, Password recovery, Email verification, Edge JWT Guard, Auth Services & Store). Cập nhật tài liệu sát thực tế. |
| 2.2 | 2026-08-22 | Đã hoàn thành Admin panel (users, roles, permissions, audit timeline), Notification triggers (task start/due-soon/change fan-out qua Celery Beat daily sweep), và Real-time Project Chat. Bổ sung Domain 8 (Chat) với 2 bảng `chat_messages` và `chat_read_states` (tổng 34 tables), Redis Pub/Sub bridge. |
| 2.2.1 | 2026-09-03 | Đối soát tài liệu với mã nguồn thực tế: **21/32 REST router được mount** (11 router `leaves/skills/documents/approvals/change_requests/gantt/cpm/reports/versions/ai/system` vẫn là stub `TODO`, chưa mount); `workers/ai_tasks.py` và `report_tasks.py` là stub; CPM chạy nội bộ qua `utils/cpm.py` + `scheduling_service.py`; 123/123 unit test pass. Model DB đủ 34 bảng nhưng business logic Phase 3–5 phần lớn chưa hiện thực. |
| 2.2.2 | 2026-09-16 | Sửa các sai lệch phát hiện khi đối soát lại với mã nguồn: thực tế **23/32 REST router được mount**... |
| 2.3.0 | 2026-10-02 | Hoàn thành toàn diện Phase 3 (AI Features) với 5/5 trụ cột: AI Project Generator, AI Impact Analysis, AI Schedule Optimization, AI Resource Recommendation, AI Risk Analysis. Mount thêm `change_requests` router (nâng tổng số lên **24/32 REST router đang hoạt động**, chỉ còn 8 stub). Thêm 2 route frontend mới (`change-requests`, `ai-insights`). Thêm Celery Beat risk sweep (08:30 hàng ngày). Chuyển triển khai production sang Render + Supabase (Free Tier), thay thế Oracle Cloud Always Free. Cập nhật bộ unit test backend lên 264/264 passing. |
| 2.4.0 | 2026-10-13 | Mốc lịch sử: hoàn thành mã nguồn Phase 4 (Workflow & Reporting): hỏi làm rõ yêu cầu (`requirement_briefs`), duyệt CR 3 bước BA -> PO -> PM, snapshot/diff/rollback theo quy tắc V0, Gantt chỉ đọc, SRS/BRD DOCX, XLSX, BPMN (SVG và PNG bằng Pillow). Thay Celery bằng durable jobs + cron endpoint (Celery chỉ còn kế thừa). Khi đó ghi nhận 32 REST router được mount, 3 stub; 39 bảng. Kết quả kiểm thử lúc đó: backend 649/28 và frontend 129 test; đây là kết quả lịch sử, không phải hiện trạng mới nhất. |

---

*Cập nhật hiện trạng: 2026-10-19 — Version 2.5.0. Các dòng Change History giữ nguyên làm nhật ký; số liệu kiểm thử trong đó là mốc lịch sử. Mốc hiện trạng gần nhất được ghi nhận ngày 2026-10-16: backend 697/28, frontend 32 tệp / 146 test. Stack: Python FastAPI + Next.js 15.*
