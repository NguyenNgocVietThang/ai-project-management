# Software Requirements Specification (SRS)
## AI Project Planning & Portfolio Management System

**Version:** 2.0
**Date:** 2026-08-05
**Trạng thái:** Cập nhật theo triển khai thực tế (Python FastAPI + Next.js 15)

---

## 1. Giới thiệu (Introduction)

### 1.1 Mục đích
Tài liệu SRS này định nghĩa các yêu cầu phần mềm chi tiết cho hệ thống **AI Project Planning & Portfolio Management** — một web application quản lý dự án thông minh tích hợp AI, tương đương MS Project nhưng được tăng cường bởi AI tự động phân tích, đề xuất và tối ưu kế hoạch dự án.

### 1.2 Phạm vi
Hệ thống phục vụ nhiều vai trò (multi-role) theo cấu trúc phân cấp:
```
Portfolio → Project → Phase / Sprint / Epic / Milestone → Task → SubTask
```

### 1.3 Tài liệu tham chiếu
- `PROJECT_INSTRUCTION.md` — Mô tả chi tiết nghiệp vụ và SOPs
- `PROJECT_STRUCTURE.md` — Cấu trúc thư mục thực tế đã triển khai
- `brd.md` — Business Requirements Document
- `design.md` — System Architecture Design

---

## 2. Kiến trúc Hệ thống (System Architecture)

### 2.1 Công nghệ (Technology Stack)

| Layer | Công nghệ | Phiên bản |
|---|---|---|
| **Frontend** | Next.js (App Router), React, TypeScript, Tailwind CSS v3, Zustand, TanStack Query v5, Recharts, @dnd-kit | Next.js 15, React 18 |
| **Backend** | FastAPI, Python, Pydantic v2, SQLAlchemy (Async), Alembic | Python 3.11+ |
| **Database** | PostgreSQL (primary), Redis (cache / session / pub-sub) | PG 16, Redis 7 |
| **Storage** | MinIO (S3-compatible) — BRD/SRS, avatar, báo cáo xuất ra | latest |
| **Queue** | Celery + Redis Broker — xử lý AI jobs bất đồng bộ | Celery 5.4 |
| **AI** | OpenAI GPT-4o hoặc Google Gemini Pro (cấu hình per Admin) | openai 1.51, google-generativeai 0.8 |
| **Auth** | JWT (Access Token + Refresh Token) + RBAC | python-jose, passlib/bcrypt |
| **Email** | fastapi-mail (SMTP) + Jinja2 templates | fastapi-mail 1.4 |
| **Export** | python-docx (DOCX), openpyxl (XLSX) — server-side generation | — |

### 2.2 Mô hình kết nối (Integration Model)

```
┌─────────────────────────────┐
│        Next.js 15           │
│   Dashboard + Gantt + UI    │
└──────────────┬──────────────┘
               │ REST API (/api/v1/...)
               ▼
┌─────────────────────────────┐
│       FastAPI Backend       │
│     (Layered Architecture)  │
└──────┬────────┬─────────────┘
       │        │
  ┌────▼──┐ ┌──▼────┐  ┌──────────┐
  │  PG   │ │ Redis │  │  MinIO   │
  │  SQL  │ │ Cache │  │  Files   │
  └───────┘ └──┬────┘  └──────────┘
               │
           ┌───▼───┐
           │Celery │  (Job Queue — 5 AI tasks)
           └───┬───┘
               │
    ┌──────────▼──────────┐
    │   AI Provider Layer  │
    │  ├─ OpenAI (GPT-4o) │
    │  └─ Gemini Pro       │
    └─────────────────────┘
```

**Nguyên tắc:**
- Frontend giao tiếp với Backend hoàn toàn qua RESTful APIs (`/api/v1/`).
- Các tác vụ nặng (Gọi AI, Sinh báo cáo, Gửi Email) được đẩy vào Redis Broker và xử lý bất đồng bộ bởi Celery Workers — **không bao giờ block event loop**.
- Database Connection Pooling được quản lý bởi SQLAlchemy AsyncEngine (pool_size=10).

---

## 3. Yêu cầu chức năng (Functional Requirements)

### 3.1 Authentication & Authorization (SRS-AUTH)

| ID | Yêu cầu |
|---|---|
| AUTH-01 | Đăng nhập / Đăng xuất sử dụng JWT (Access Token expire 30 phút + Refresh Token expire 7 ngày). |
| AUTH-02 | Mã hóa mật khẩu bằng bcrypt (passlib). |
| AUTH-03 | Phân quyền theo mô hình RBAC: 34 Permissions gán cho 7 Roles, Role gán cho User. |
| AUTH-04 | Mọi API endpoint thay đổi dữ liệu phải kiểm tra quyền RBAC qua FastAPI dependency `require_roles()`. |
| AUTH-05 | Endpoint `/api/v1/auth/login`, `/api/v1/auth/refresh`, `/api/v1/auth/logout`. |

**7 Roles hệ thống:**

| Role | Mô tả | Quyền chính |
|---|---|---|
| **Admin** | Quản trị viên | Toàn quyền 34 permissions |
| **PM** | Project Manager | Quản lý Portfolio/Project, phân công resource, duyệt CR, rollback version, xuất báo cáo |
| **BA** | Business Analyst | Review & Approve Change Request, xem Impact Report |
| **PO** | Product Owner | Approve Change Request (nghiệp vụ), xem Dashboard |
| **Member** | Thành viên | Xem Task, Start/Stop Work, ghi WorkLog, upload Deliverable |
| **Customer** | Khách hàng | Tạo Change Request, theo dõi trạng thái |
| **Investor** | Nhà đầu tư | Chỉ xem Dashboard Portfolio (read-only) |

**34 Permissions (resource:action):**
```
portfolio:  create, read, update, delete
project:    create, read, update, delete, manage_members, rollback
task:       create, read, update, delete, assign
worklog:    create, read, update
change_request: create, read, approve, apply
report:     read, export
ai:         generate_project, analyze_impact, optimize_schedule
user:       create, read, update, delete
system:     config
audit:      read
dashboard:  read
```

---

### 3.2 Quản lý Phân cấp Dự án (SRS-PM)

| ID | Yêu cầu |
|---|---|
| PM-01 | CRUD đầy đủ cho: Portfolio, Project, Phase, Sprint, Epic, Milestone, Task, Subtask, Comment. |
| PM-02 | Task thuộc về Project và tùy chọn gắn với Phase, Sprint, Epic. |
| PM-03 | Task status: `TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`, `BLOCKED`. |
| PM-04 | Task priority: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`. |
| PM-05 | Project status: `PLANNING`, `ACTIVE`, `ON_HOLD`, `COMPLETED`, `CANCELLED`. |
| PM-06 | Quản lý Members của Project (bảng `project_members` M2M). |
| PM-07 | Hỗ trợ đơn vị tiền tệ (currency) mặc định VND cho Budget/Cost. |

---

### 3.3 Task Dependency & Scheduling (SRS-DEP)

| ID | Yêu cầu |
|---|---|
| DEP-01 | Quản lý các mối quan hệ phụ thuộc giữa Task: **Finish-to-Start (FS)**, **Start-to-Start (SS)**, **Finish-to-Finish (FF)**, **Start-to-Finish (SF)** kèm `lag_days`. |
| DEP-02 | Hệ thống phải phát hiện vòng lặp Dependency (Cycle Detection) khi tạo/sửa Dependency. |
| DEP-03 | Khi có thay đổi về `start_date`, `due_date`, `estimated_hours` hoặc Dependency của Task, hệ thống tự động trigger CPM recalculation. |

---

### 3.4 Thuật toán Đường găng — Critical Path Method (SRS-CPM)

| ID | Yêu cầu |
|---|---|
| CPM-01 | **Topological Sort** (Kahn's Algorithm): Sắp xếp Tasks theo DAG, phát hiện chu trình. |
| CPM-02 | **Forward Pass**: Tính `early_start (ES)`, `early_finish (EF)` cho mỗi Task. |
| CPM-03 | **Backward Pass**: Tính `late_finish (LF)`, `late_start (LS)` cho mỗi Task. |
| CPM-04 | **Float**: `float_days = LS - ES`. Task có `float_days < 0.001` được đánh dấu `is_critical = True`. |
| CPM-05 | Kết quả CPM được lưu vào các trường tương ứng trong bảng `tasks`: `early_start`, `early_finish`, `late_start`, `late_finish`, `float_days`, `is_critical`. |
| CPM-06 | API endpoint `GET /api/v1/cpm/{project_id}` trả về trạng thái CPM toàn bộ project. |
| CPM-07 | Critical Path được highlight đỏ trên Gantt chart. Phản hồi CPM sau khi kéo thả < 500ms. |

---

### 3.5 Resource Management (SRS-RM)

| ID | Yêu cầu |
|---|---|
| RM-01 | **Assignment**: Phân công nhân sự (`user_id`) vào Task, lưu `allocated_hours`. |
| RM-02 | **Resource Leveling**: Phát hiện nhân sự bị quá tải (tổng giờ làm trong ngày > 8h). Có tính đến lịch nghỉ phép (Leaves). |
| RM-03 | Cảnh báo ngay khi assign nếu nhân sự quá tải (`RESOURCE_OVERLOADED`). |
| RM-04 | **WorkLog (Time Tracking)**: Member ghi nhận `hours_logged`, `log_date`, `note` cho từng Task. |
| RM-05 | **Skill Management**: Quản lý danh mục kỹ năng (bảng `skills`), gán Skill cho User (M2M `user_skills`). |
| RM-06 | **Leave Management**: Quản lý ngày nghỉ phép (`leaves`): `start_date`, `end_date`, `leave_type`, `status`. |
| RM-07 | API `GET /api/v1/resource-leveling/{project_id}` — trả về trạng thái tải nhân sự. |

---

### 3.6 Tích hợp AI (SRS-AI)

Tất cả AI calls **bắt buộc** thực thi qua Celery Workers (bất đồng bộ), không block API thread chính.

| ID | SOP | Yêu cầu |
|---|---|---|
| AI-01 | SOP-AI-001 | **Project Generator**: PM nhập prompt → Celery gọi AI → AI trả về JSON WBS (phases, sprints, epics, tasks, dependencies, milestones) → Parse & Insert vào DB → Trigger CPM → Render Gantt. |
| AI-02 | SOP-AI-002 | **Impact Analysis**: Tự động sau khi PO Approve CR → AI phân tích danh sách Task/Sprint/Milestone bị ảnh hưởng, sinh `ImpactReport`. |
| AI-03 | SOP-AI-003 | **Schedule Optimization**: PM Approve CR → AI tính lại Dependency chain, CPM, Resource Allocation → sinh kế hoạch mới cho PM xác nhận. |
| AI-04 | SOP-RM-001 | **Resource Recommender**: Suggest nhân sự dựa trên Skill match, Level, Cost/hour, Availability, Leave schedule. |
| AI-05 | SOP-AI-005 | **Risk Analyzer**: Đánh giá định kỳ rủi ro: Trễ tiến độ, Quá tải nhân sự, Thiếu nhân lực, Vượt ngân sách, Milestone nguy cơ trễ → Risk Score: Low/Medium/High/Critical. |
| AI-06 | SOP-DOC-001 | **Document Parser**: Đọc tài liệu BRD/SRS từ MinIO → Gợi ý bóc tách thành Epics/Tasks. |

**AI Provider Abstraction:**
```
BaseAIProvider (ABC)                  ← base.py
├── generate_text(prompt, system) → str
└── generate_json(prompt, system) → Dict

OpenAIProvider (GPT-4o)               ← openai_provider.py
GeminiProvider (Gemini Pro)           ← gemini_provider.py
ProjectGeneratorService               ← project_generator.py (SOP-AI-001)
```

**JSON schema AI phải trả về (SOP-AI-001):**
```json
{
  "project_name": "string",
  "phases": [{ "name": "string", "start": "date", "end": "date" }],
  "tasks": [{
    "id": "string",
    "name": "string",
    "phase": "string",
    "sprint": "string",
    "epic": "string",
    "estimated_hours": "number",
    "dependencies": ["task_id"],
    "milestone": "string | null"
  }]
}
```

---

### 3.7 Change Request & Approval Workflow (SRS-CR)

| ID | Yêu cầu |
|---|---|
| CR-01 | **Customer** tạo Change Request với title, description, priority, estimated_effort_days, estimated_cost. |
| CR-02 | Workflow trạng thái: `DRAFT → SUBMITTED → UNDER_REVIEW → APPROVED → REJECTED → IMPLEMENTED`. |
| CR-03 | **BA** Review & Approve/Reject CR (bước 1). |
| CR-04 | **PO** Review & Approve/Reject CR (bước 2). Khi PO Approve → AI Impact Analysis tự động khởi chạy. |
| CR-05 | **PM** Review Impact Report → Approve/Reject. Khi PM Approve → AI Schedule Optimization khởi chạy. |
| CR-06 | PM xác nhận kết quả tối ưu → Tạo Project Version Snapshot → Apply thay đổi vào dự án. |
| CR-07 | **Điều kiện cứng**: Chỉ PM được bấm Apply. Tất cả các bước trước phải Approve đầy đủ. |

---

### 3.8 Project Versioning & Rollback (SRS-VER)

| ID | Yêu cầu |
|---|---|
| VER-01 | **Snapshot kích hoạt khi:** PM Apply CR, AI Schedule Optimization được apply, PM tạo Baseline thủ công. |
| VER-02 | Snapshot serialize toàn bộ Project Data (Phase, Sprint, Epic, Task, Dependency, Milestone) thành JSON → lưu vào bảng `project_versions`. |
| VER-03 | **Rollback**: PM chọn Version → Xem diff → Xác nhận → Khôi phục dữ liệu. |
| VER-04 | API: `GET /api/v1/versions/{project_id}`, `POST /api/v1/versions/{project_id}/rollback/{version_id}`. |

---

### 3.9 Document Management (SRS-DOC)

| ID | Yêu cầu |
|---|---|
| DOC-01 | Upload file (BRD, SRS, DELIVERABLE) → Lưu MinIO → Liên kết với Project. |
| DOC-02 | Hỗ trợ xem/tải xuống tài liệu từ MinIO qua Presigned URL. |
| DOC-03 | AI tự động phân tích nội dung tài liệu và gợi ý sinh Task (SOP-DOC-001). |
| DOC-04 | Bảng `documents`: `project_id`, `name`, `file_type`, `minio_key`, `size_bytes`, `uploaded_by`, `is_ai_parsed`. |

---

### 3.10 Báo cáo & Dashboard (SRS-RPT)

| ID | Yêu cầu |
|---|---|
| RPT-01 | **Gantt Chart**: Hiển thị Task theo timeline, hỗ trợ drag & drop (@dnd-kit). |
| RPT-02 | **Dashboard Charts**: Burndown, Burnup, Velocity, Resource Utilization Heatmap, CPI/SPI/EVA, Pie Chart (phân bổ task theo trạng thái). |
| RPT-03 | **KPIs**: CPI (Cost Performance Index), SPI (Schedule Performance Index), EVA (Earned Value Analysis), CV (Cost Variance), SV (Schedule Variance), ROI. |
| RPT-04 | **Export**: Sinh file DOCX (python-docx) và XLSX (openpyxl) trên server qua Celery worker, upload MinIO, trả về URL tải xuống. |
| RPT-05 | Phân quyền Dashboard: PM/BA/PO/Member xem đầy đủ theo phạm vi. Investor chỉ xem Portfolio Dashboard (read-only). |

---

### 3.11 Notification (SRS-NOTI)

| ID | Yêu cầu |
|---|---|
| NOTI-01 | Hệ thống gửi thông báo 13 loại: `TASK_ASSIGNED`, `TASK_DUE_SOON`, `TASK_OVERDUE`, `CR_SUBMITTED`, `CR_APPROVED`, `CR_REJECTED`, `CR_NEEDS_REVIEW`, `CRITICAL_PATH_CHANGED`, `RESOURCE_OVERLOADED`, `AI_JOB_COMPLETED`, `RISK_HIGH`, `MENTION`, `SYSTEM`. |
| NOTI-02 | Kênh thông báo: Email (fastapi-mail / SMTP) qua Celery email_tasks. |
| NOTI-03 | Người nhận: PM, BA, PO và các Member liên quan đến phần bị ảnh hưởng. |
| NOTI-04 | Lưu lịch sử email trong bảng `email_logs`. |

---

### 3.12 Audit Logging (SRS-AUD)

| ID | Yêu cầu |
|---|---|
| AUD-01 | Mọi thao tác thay đổi dữ liệu của hệ thống phải được ghi vào bảng `audit_logs`. |
| AUD-02 | Mỗi record lưu: `user_id`, `ip_address`, `entity_type`, `entity_id`, `action`, `old_value` (JSON), `new_value` (JSON), `timestamp`. |
| AUD-03 | Chỉ Admin và PM có quyền xem Audit Log (`audit:read`). |

---

## 4. Cơ sở dữ liệu (Database Schema)

**7 Domains — 31+ Tables:**

### Domain 1: Base & Associations
Các bảng junction M2M: `user_roles`, `role_permissions`, `user_skills`, `project_members`.

### Domain 2: User & RBAC
| Bảng | Trường chính |
|---|---|
| `users` | `email`, `username`, `full_name`, `hashed_password`, `avatar_url`, `phone`, `position`, `department`, `hourly_rate`, `is_active`, `is_superuser`, `last_login` |
| `roles` | `name`, `description` |
| `permissions` | `resource`, `action`, `description` (VD: `task:create`) |
| `skills` | `name`, `category` |
| `leaves` | `user_id`, `start_date`, `end_date`, `leave_type`, `status` |

### Domain 3: Project Core
| Bảng | Trường chính |
|---|---|
| `portfolios` | `name`, `description`, `owner_id` |
| `projects` | `name`, `status`, `start_date`, `end_date`, `progress`, `budget`, `actual_cost`, `currency`, `portfolio_id`, `pm_id` |
| `phases` | `name`, `order`, `start_date`, `end_date`, `project_id` |
| `sprints` | `name`, `goal`, `start_date`, `end_date`, `status`, `project_id` |
| `epics` | `name`, `description`, `color`, `project_id` |
| `milestones` | `name`, `due_date`, `is_completed`, `project_id` |

### Domain 4: Task & Scheduling
| Bảng | Trường chính |
|---|---|
| `tasks` | `name`, `status`, `priority`, `story_points`, `progress`, `estimated_hours`, `actual_hours`, `start_date`, `due_date`, `actual_start`, `actual_end`, **`early_start`, `early_finish`, `late_start`, `late_finish`, `float_days`, `is_critical`** (CPM fields), `project_id`, `phase_id`, `sprint_id`, `epic_id`, `assignee_id` |
| `subtasks` | `name`, `is_completed`, `task_id` |
| `dependencies` | `predecessor_id`, `successor_id`, `dependency_type` (FS/SS/FF/SF), `lag_days` |
| `assignments` | `task_id`, `user_id`, `allocated_hours` |
| `worklogs` | `task_id`, `user_id`, `hours_logged`, `log_date`, `note` |
| `comments` | `task_id`, `user_id`, `content` |

### Domain 5: Change Management & Audit
| Bảng | Trường chính |
|---|---|
| `change_requests` | `title`, `description`, `status`, `priority`, `project_id`, `requester_id`, `estimated_effort_days`, `estimated_cost` |
| `approvals` | `change_request_id`, `approver_id`, `role`, `status`, `comment` |
| `impact_reports` | `change_request_id`, `scope_impact`, `time_impact`, `cost_impact`, `risk_level`, `ai_summary` (JSON) |
| `project_versions` | `project_id`, `version_number`, `snapshot` (JSON), `created_by` |
| `audit_logs` | `entity_type`, `entity_id`, `action`, `old_value`, `new_value`, `user_id`, `ip_address` |

### Domain 6: AI
| Bảng | Trường chính |
|---|---|
| `ai_requests` | `task_type` (SOP ref), `prompt`, `provider`, `model`, `status`, `project_id`, `user_id` |
| `ai_outputs` | `ai_request_id`, `raw_response` (JSON), `parsed_data` (JSON), `prompt_tokens`, `completion_tokens`, `total_tokens` |
| `risk_reports` | `project_id`, `risks` (JSON), `overall_risk_level`, `ai_summary` |

### Domain 7: Document & Notification
| Bảng | Trường chính |
|---|---|
| `documents` | `project_id`, `name`, `file_type`, `minio_key`, `size_bytes`, `uploaded_by`, `is_ai_parsed` |
| `notifications` | `user_id`, `title`, `message`, `notification_type` (13 types), `is_read`, `read_at`, `link`, `related_entity_type`, `related_entity_id` |
| `email_logs` | `to_email`, `subject`, `status`, `sent_at`, `error_message` |

---

## 5. API Endpoints (Tham chiếu)

Tất cả endpoints có prefix `/api/v1/`. API Docs: **http://localhost:8000/docs** (Swagger UI).

| Group | Prefix | Endpoint tiêu biểu |
|---|---|---|
| Auth | `/api/v1/auth` | POST login, POST refresh, POST logout |
| Users | `/api/v1/users` | CRUD + profile |
| Roles | `/api/v1/roles` | CRUD role & permissions |
| Portfolios | `/api/v1/portfolios` | CRUD + list projects |
| Projects | `/api/v1/projects` | CRUD + members + stats |
| Phases | `/api/v1/phases` | CRUD |
| Sprints | `/api/v1/sprints` | CRUD |
| Epics | `/api/v1/epics` | CRUD |
| Milestones | `/api/v1/milestones` | CRUD |
| Tasks | `/api/v1/tasks` | CRUD + CPM trigger + assign |
| Subtasks | `/api/v1/subtasks` | CRUD |
| Dependencies | `/api/v1/dependencies` | CRUD + cycle detection |
| Assignments | `/api/v1/assignments` | Assign/unassign + leveling check |
| Worklogs | `/api/v1/worklogs` | CRUD time tracking |
| Skills | `/api/v1/skills` | CRUD catalog |
| Leaves | `/api/v1/leaves` | CRUD leave management |
| Documents | `/api/v1/documents` | Upload, download, AI parse |
| Change Requests | `/api/v1/change-requests` | CRUD + approve workflow |
| Approvals | `/api/v1/approvals` | BA/PO/PM approve steps |
| Gantt | `/api/v1/gantt` | GET gantt data per project |
| CPM | `/api/v1/cpm` | GET/POST CPM recalculation |
| Resource Leveling | `/api/v1/resource-leveling` | GET overload check |
| Dashboards | `/api/v1/dashboards` | GET aggregated stats + charts data |
| Reports | `/api/v1/reports` | POST generate DOCX/XLSX |
| Notifications | `/api/v1/notifications` | GET list + PATCH read |
| Audit | `/api/v1/audit` | GET audit timeline |
| Versions | `/api/v1/versions` | GET history + POST rollback |
| AI | `/api/v1/ai` | POST generate, GET job status |
| System | `/api/v1/system` | GET health, GET/PUT config |

---

## 6. Celery Background Tasks

| Task | SOP | Mô tả |
|---|---|---|
| `ai.generate_project` | SOP-AI-001 | Sinh project plan từ prompt → ghi DB |
| `ai.impact_analysis` | SOP-AI-002 | Phân tích tác động Change Request |
| `ai.optimize_schedule` | SOP-AI-003 | Tối ưu lịch trình sau khi CR approved |
| `ai.risk_analysis` | SOP-AI-005 | Phân tích rủi ro định kỳ |
| `ai.parse_document` | SOP-DOC-001 | Phân tích tài liệu BRD/SRS |
| `reports.generate_docx` | SOP-RPT-001 | Sinh file DOCX, upload MinIO |
| `reports.generate_xlsx` | SOP-RPT-001 | Sinh file XLSX, upload MinIO |
| `email.send` | SOP-NOTI-001 | Gửi email thông báo |

> Celery timezone: `Asia/Ho_Chi_Minh`. Broker: `redis/1`. Result: `redis/2`.

---

## 7. Yêu cầu phi chức năng (Non-Functional Requirements)

### 7.1 Hiệu năng (Performance)
- Các APIs CRUD thông thường phải phản hồi **< 200ms**.
- CPM recalculation sau khi kéo thả Gantt: **< 500ms**.
- AI/Email calls **không bao giờ block** event loop chính; bắt buộc dùng Celery.
- Database connection pool: `pool_size = 10`.

### 7.2 Bảo mật (Security)
- Thông tin mật khẩu, API keys (OpenAI, Gemini), thông tin SMTP **bắt buộc thiết lập qua Environment Variables** (`.env`), không hard-code.
- Mọi endpoint POST/PUT/DELETE phải kiểm tra quyền RBAC hiện tại.
- Audit Logging: Mọi thao tác thay đổi dữ liệu phải lưu vào bảng `audit_logs` (IP, Action, Old/New Values).
- JWT Access Token expire: 30 phút; Refresh Token expire: 7 ngày.

### 7.3 Tính mở rộng & Maintainability
- Kiến trúc **Layered Architecture** nghiêm ngặt: Endpoints → Services → Repositories → Models. Controller không chứa Business Logic.
- Type hinting 100% trong Python Code, validation bằng Pydantic v2.
- Có khả năng thêm AI Provider mới (Claude, Llama...) chỉ bằng cách kế thừa `BaseAIProvider` mà không cần sửa Core Logic.
- Linting: black (line-length=100), isort, ruff, mypy.

### 7.4 Deployment & Infrastructure
- Docker Compose: 6 services (`postgres`, `redis`, `minio`, `backend`, `celery-worker`, `frontend`).
- Database migrations bằng Alembic (async PostgreSQL).
- MinIO bucket mặc định: `ai-project-files`.
- Seed data: 7 Roles, 34 Permissions, 1 Admin account (`admin@example.com / Admin@123456`).

---

## 8. Trạng thái triển khai (Implementation Status)

### Backend — Đã hoàn thành
- Toàn bộ SQLAlchemy models (31 models, 7 Domains)
- Alembic setup (env.py, script.py.mako)
- FastAPI app (main.py, CORS, lifespan)
- Auth endpoints (auth.py, oauth.py) & OAuth Service (oauth_service.py)
- Async Email Service (email.py) & HTML Jinja2 Email Templates
- Core security (JWT create/verify, bcrypt hashing)
- CPM Algorithm (utils/cpm.py) — đầy đủ Forward/Backward pass
- Celery workers setup (celery_app.py + 3 task files)
- AI Provider abstraction (base.py, openai_provider.py, gemini_provider.py, project_generator.py)
- Repository pattern (base_repository + 3 repos)
- Pydantic schemas (9 files)
- DB seed script (7 roles, 34 permissions, 1 admin)
- Docker Compose (6 services)

### Frontend — Đã hoàn thành
- Auth Pages (login, register, forgot-password, reset-password, verify-email, oauth-callback)
- Next.js Edge JWT Route Protection (middleware.ts)
- Zustand Auth Store (authStore.ts) & useAuth hook
- Frontend Services layer (auth.service.ts, portfolio.service.ts, project.service.ts, task.service.ts, user.service.ts, api.ts)

### Kế hoạch tiếp theo (Portfolio & Project Core)
- Implement logic bên trong Portfolio & Project endpoints
- Implement Portfolio & Project UI Pages & Member Management
- Implement Task management + Kanban Board + Task Detail Drawer
- Implement Task Dependencies Graph & CPM recalculation trigger
- Implement Assignment & WorkLog (Timesheet)
- Implement Portfolio & Project Dashboards
- Hoàn thiện AI services (impact_analysis, risk_analyzer, resource_recommender, schedule_optimizer, document_parser)

---

*Cập nhật lần cuối: 2026-08-13 — Version 2.0 — Stack: Python FastAPI + Next.js 15*
