# Software Requirements Specification (SRS)
## AI Project Planning & Portfolio Management System

**Version:** 2.2.1
**Date:** 2026-09-03
**Trạng thái:** Đối soát với mã nguồn thực tế — xem §6 (Phase 1–2 + Real-time + Admin/Audit đã hoàn thành; Phase 3–5 phần lớn mới ở mức model DB / hạ tầng).

---

## 1. Giới thiệu (Introduction)

### 1.1 Mục đích
Tài liệu SRS này định nghĩa các yêu cầu phần mềm chi tiết cho hệ thống **AI Project Planning & Portfolio Management** — một web application quản lý dự án thông minh tích hợp AI, tương đương MS Project nhưng được tăng cường bởi AI tự động phân tích, đề xuất và tối ưu kế hoạch dự án, hỗ trợ Real-time Project Chat và WebSocket Notifications.

### 1.2 Phạm vi
Hệ thống phục vụ nhiều vai trò (multi-role) theo cấu trúc phân cấp:
```
Portfolio → Project → Phase / Sprint / Epic / Milestone → Task → SubTask
```
Kèm theo kênh giao tiếp thời gian thực theo từng dự án (`/ws/chat/{project_id}`), kênh thông báo cá nhân tức thời (`/ws/notifications`), và quét tự động lịch trình qua Celery Beat.

### 1.3 Tài liệu tham chiếu
- `brd.md` — Business Requirements Document
- `design.md` — System Architecture Design
- `README.md` — Tổng quan và hướng dẫn toàn diện hệ thống

---

## 2. Kiến trúc Hệ thống (System Architecture)

### 2.1 Công nghệ (Technology Stack)

| Layer | Công nghệ | Phiên bản |
|---|---|---|
| **Frontend** | Next.js (App Router), React, TypeScript, Tailwind CSS v3, Zustand, TanStack Query v5, Recharts, @dnd-kit | Next.js 15, React 18 |
| **Backend** | FastAPI, Python, Pydantic v2, SQLAlchemy 2.0 (Async Engine), Alembic | Python 3.11+ |
| **Database** | PostgreSQL (primary), Redis (cache / pub-sub / session) | PG 16, Redis 7 |
| **Storage** | MinIO (S3-compatible) — BRD/SRS, avatar, báo cáo xuất ra | latest |
| **Real-time Bus** | Redis Pub/Sub + ConnectionManager (hỗ trợ scale đa tiến trình) | Redis 7 |
| **Queue & Scheduler** | Celery + Celery Beat + Redis Broker — xử lý AI, Email, Sweeps | Celery 5.4 |
| **AI** | OpenAI GPT-4o hoặc Google Gemini Pro (cấu hình per Admin) | openai 1.51, google-generativeai 0.8 |
| **Auth** | JWT (Access Token 30m + Refresh Token 7d) + RBAC (34 permissions) | python-jose, passlib/bcrypt |
| **Email** | fastapi-mail (SMTP) + Jinja2 templates | fastapi-mail 1.4 |
| **Export** | python-docx (DOCX), openpyxl (XLSX) — server-side async generation | — |

### 2.2 Mô hình kết nối (Integration Model)

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 15 Frontend                      │
│        Dashboard + Gantt + Real-Time Chat + Notification    │
└────────────────┬───────────────────────────┬────────────────┘
                 │ REST API (/api/v1/...)    │ WebSocket (/ws/...)
                 ▼                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   FastAPI Backend Server                    │
│   (Layered Architecture + ConnectionManager + Redis PubSub) │
└──────┬─────────┬───────────────────────────┬─────────┬──────┘
       │         │                           │         │
  ┌────▼───┐ ┌───▼────┐                 ┌────▼───┐ ┌───▼────────┐
  │ PG SQL │ │ Redis  │                 │ MinIO  │ │Celery Beat │
  │        │ │Pub/Sub │                 │ Files  │ │(Scheduler) │
  └────────┘ └───┬────┘                 └────────┘ └───┬────────┘
                 │                                     │
             ┌───▼───┐                                 │
             │Celery │ ◄───────────────────────────────┘
             │Worker │ (Async Jobs: AI, Emails, Sweeps, Reports)
             └───┬───┘
                 │
      ┌──────────▼──────────┐
      │   AI Provider Layer  │
      │  ├─ OpenAI (GPT-4o) │
      │  └─ Gemini Pro       │
      └─────────────────────┘
```

---

## 3. Yêu cầu chức năng (Functional Requirements)

### 3.1 Authentication & Authorization (SRS-AUTH)

| ID | Yêu cầu |
|---|---|
| AUTH-01 | Đăng ký & Đăng nhập sử dụng JWT (Access Token expire 30 phút + Refresh Token expire 7 ngày), đồng bộ cookie `auth-token` cho Edge Middleware. |
| AUTH-02 | Mã hóa mật khẩu bằng bcrypt (passlib). |
| AUTH-03 | Phân quyền theo mô hình RBAC: 34 Permissions gán cho 7 Roles, Role gán cho User. |
| AUTH-04 | Social Login OAuth 2.0 (Google, Facebook) tự động liên kết tài khoản theo email. |
| AUTH-05 | Quên mật khẩu & Đặt lại mật khẩu an toàn qua Email xác thực dùng token một lần (TTL 1 giờ). |
| AUTH-06 | Xác thực tài khoản qua Email (Email Verification) kích hoạt cờ `email_verified`. |
| AUTH-07 | Endpoint `/api/v1/auth/me` trả về thông tin người dùng kèm danh sách `roles` và `permissions`. |

**7 Roles hệ thống:**
| Role | Mô tả | Quyền chính |
|---|---|---|
| **Admin** | Quản trị viên | Toàn quyền 34 permissions, quản lý users/roles, xem audit logs |
| **PM** | Project Manager | Quản lý Portfolio/Project, phân công resource, duyệt CR, rollback, xuất báo cáo |
| **BA** | Business Analyst | Review & Approve Change Request (bước 1), xem Impact Report |
| **PO** | Product Owner | Approve Change Request (nghiệp vụ, bước 2), xem Dashboard |
| **Member** | Thành viên | Xem Task, Start/Stop Work, ghi WorkLog, chat dự án |
| **Customer** | Khách hàng | Tạo Change Request, theo dõi tiến độ dự án |
| **Investor** | Nhà đầu tư | Xem Dashboard Portfolio & Project ở chế độ **Read-only** |

---

### 3.2 Quản trị Admin & Audit Timeline (SRS-ADMIN)

| ID | Yêu cầu |
|---|---|
| ADMIN-01 | **User Management (`/admin/users`)**: Tạo người dùng mới, sửa thông tin, đổi vai trò, bật/tắt kích hoạt (`is_active`). Ngăn chặn tự vô hiệu hóa tài khoản của chính mình và bảo vệ tài khoản Admin cuối cùng. |
| ADMIN-02 | **Role & Permission Management (`/admin/roles`)**: CRUD Vai trò hệ thống, gán tập hợp quyền hạn từ 34 Permissions phân nhóm theo Resource. Bảo vệ vai trò mặc định "Admin" không bị xóa/đổi tên. |
| ADMIN-03 | **Audit Timeline (`/admin/audit`)**: Truy vết mọi thao tác thêm/sửa/xóa với bộ lọc theo loại đối tượng (`entity_type`), phân trang hiệu năng cao, hiển thị `old_value` và `new_value`. |

---

### 3.3 Quản lý Phân cấp Dự án & Thành viên (SRS-PM)

| ID | Yêu cầu |
|---|---|
| PM-01 | CRUD đầy đủ cho: Portfolio, Project, Phase, Sprint, Epic, Milestone, Task, Subtask, Comment. |
| PM-02 | Task thuộc về Project và tùy chọn gắn với Phase, Sprint, Epic, Milestone. |
| PM-03 | Task status: `TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`, `BLOCKED`. |
| PM-04 | Task priority: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`. |
| PM-05 | Project status: `PLANNING`, `ACTIVE`, `ON_HOLD`, `COMPLETED`, `CANCELLED`. |
| PM-06 | **Quản lý Thành viên Dự án**: Gán người dùng vào dự án (`project_members`), phân vai trò trong dự án (PM, BA, PO, Member, Customer). |
| PM-07 | Hỗ trợ đơn vị tiền tệ mặc định VND cho Budget và Actual Cost. |

---

### 3.4 Task Dependency & Scheduling (SRS-DEP)

| ID | Yêu cầu |
|---|---|
| DEP-01 | Quản lý quan hệ phụ thuộc giữa Task: **Finish-to-Start (FS)**, **Start-to-Start (SS)**, **Finish-to-Finish (FF)**, **Start-to-Finish (SF)** kèm `lag_hours`. |
| DEP-02 | Phát hiện chu trình phụ thuộc (Cycle Detection / Kahn's Algorithm) ngăn chặn vòng lặp. |
| DEP-03 | Tự động kích hoạt tính toán lại đường găng CPM khi có thay đổi về thời gian hoặc quan hệ phụ thuộc. |

---

### 3.5 Thuật toán Đường găng — Critical Path Method (SRS-CPM)

| ID | Yêu cầu |
|---|---|
| CPM-01 | **Topological Sort**: Xác định thứ tự thực thi hợp lệ cho đồ thị có hướng (DAG). |
| CPM-02 | **Forward Pass**: Tính `es` (Earliest Start) và `ef` (Earliest Finish) cho từng Task. |
| CPM-03 | **Backward Pass**: Tính `lf` (Latest Finish) và `ls` (Latest Start) cho từng Task. |
| CPM-04 | **Float & Đường găng**: `float_time = ls - es`. Đánh dấu `is_critical = True` nếu `abs(float_time) < 0.001`. |
| CPM-05 | Lưu kết quả CPM trực tiếp vào các trường của bảng `tasks`. |
| CPM-06 | API endpoint `GET /api/v1/cpm/{project_id}` và `POST /api/v1/cpm/calculate` phục vụ recalculation tức thì. |
| CPM-07 | Highlight đường găng đỏ trực quan trên biểu đồ Gantt Chart. |

---

### 3.6 Resource Management & Leveling (SRS-RM)

| ID | Yêu cầu |
|---|---|
| RM-01 | **Assignment**: Phân công nhân sự vào Task, lưu `allocated_hours`. |
| RM-02 | **Resource Leveling**: Kiểm tra và phát hiện nhân sự bị quá tải (> 8h/ngày) có xét đến lịch nghỉ phép (`leaves`). |
| RM-03 | Cảnh báo quá tải nhân sự (`RESOURCE_OVERLOADED`) khi phân công. |
| RM-04 | **WorkLog (Timesheet)**: Thành viên ghi nhận số giờ thực tế làm việc, ngày làm và ghi chú. |
| RM-05 | **Skill Management**: Quản lý danh mục kỹ năng và liên kết với người dùng (`user_skills`). |
| RM-06 | **Leave Management**: Quản lý ngày nghỉ phép của nhân sự (`leaves`). |

---

### 3.7 Real-Time Project Chat (SRS-CHAT)

| ID | Yêu cầu |
|---|---|
| CHAT-01 | **Kênh Chat theo Dự án**: Mỗi Project có một kênh trao đổi riêng biệt dành cho các thành viên trong `project_members`. |
| CHAT-02 | **Giao thức WebSocket**: Kết nối qua `/ws/chat/{project_id}?token=<JWT>`, tự động kết nối lại khi mất mạng (Reconnection w/ exponential backoff). |
| CHAT-03 | **Message Bus**: Đẩy tin nhắn qua Redis Pub/Sub (`ws:chat:project:{id}`) để phân phối tới tất cả client đang kết nối trên mọi tiến trình worker. |
| CHAT-04 | **Lưu trữ & Lịch sử**: Lưu trữ tin nhắn vào bảng `chat_messages`, cung cấp API phân trang theo con trỏ (`before_id`) qua `GET /api/v1/projects/{id}/messages`. |
| CHAT-05 | **Trạng thái Chưa đọc & Đã đọc**: Theo dõi mốc tin nhắn đọc gần nhất qua bảng `chat_read_states`, cung cấp API `GET /unread-count` và `POST /read`. |
| CHAT-06 | **Fallback REST**: Cho phép gửi tin nhắn qua `POST /api/v1/projects/{id}/messages` khi WebSocket chưa sẵn sàng. |

---

### 3.8 Thông báo Thời gian thực & Quét Lịch trình (SRS-NOTI)

| ID | Yêu cầu |
|---|---|
| NOTI-01 | **WebSocket Real-time Push**: Đẩy thông báo cá nhân tức thời tới người dùng qua `/ws/notifications?token=<JWT>` trên kênh `ws:notif:user:{user_id}`. |
| NOTI-02 | **Fan-out Notification**: Khi một Task có thay đổi quan trọng (trạng thái, ngày bắt đầu, hạn chót, độ ưu tiên, người thực hiện), tự động gửi thông báo tới toàn bộ thành viên trong nhóm dự án (trừ người thực hiện thao tác). |
| NOTI-03 | **Celery Beat Daily Sweep**: Tiến trình `celery-beat` chạy định kỳ lúc 08:00 AM hàng ngày quét các task bắt đầu hôm nay và task sắp đến hạn (1 ngày trước hạn) để gửi thông báo fan-out tự động. |
| NOTI-04 | **Chống gửi trùng (Idempotency)**: Lưu dấu thời gian `last_start_notified_at` và `last_due_soon_notified_at` trên bảng `tasks`. Tự động reset cờ khi task được đổi hạn chót mới. |
| NOTI-05 | **Email Notifications**: Gửi email qua Celery Worker bằng `fastapi-mail` + Jinja2 HTML templates, lưu nhật ký vào `email_logs`. |

---

### 3.9 Tích hợp AI (SRS-AI)

| ID | SOP | Yêu cầu |
|---|---|---|
| AI-01 | SOP-AI-001 | **Project Generator**: PM nhập prompt tự nhiên → AI sinh cấu trúc JSON WBS (Phases, Sprints, Epics, Tasks, Dependencies) → Insert vào DB → Chạy CPM → Hiển thị Gantt. |
| AI-02 | SOP-AI-002 | **Impact Analysis**: Tự động kích hoạt khi PO duyệt Change Request → AI đánh giá tác động Scope, Timeline, Budget, Resource. |
| AI-03 | SOP-AI-003 | **Schedule Optimization**: AI tính toán lại chuỗi phụ thuộc và đề xuất lịch trình tối ưu sau khi CR được phê duyệt. |
| AI-04 | SOP-RM-001 | **Resource Recommendation**: Gợi ý nhân sự phù hợp cho Task dựa trên Skill match, Chi phí, Tải công việc và Lịch nghỉ phép. |
| AI-05 | SOP-AI-005 | **Risk Analysis**: Đánh giá định kỳ các rủi ro dự án (trễ hạn, quá tải, vượt chi phí) và xếp loại mức độ rủi ro. |
| AI-06 | SOP-DOC-001 | **Document Parser**: Bóc tách tài liệu BRD/SRS từ MinIO để tự động gợi ý danh mục Tasks. |

---

### 3.10 Change Request & Multi-Level Approvals (SRS-CR)

| ID | Yêu cầu |
|---|---|
| CR-01 | Khách hàng hoặc Thành viên tạo yêu cầu thay đổi (CR) kèm mô tả, ước tính thời gian và chi phí. |
| CR-02 | Quy trình phê duyệt tuần tự: `BA Review (Bước 1) → PO Review (Bước 2) → AI Impact Analysis → PM Final Approval (Bước 3)`. |
| CR-03 | Khi PM duyệt hoàn tất → Tự động tạo bản lưu Snapshot Version và áp dụng thay đổi vào cấu trúc dự án chính thức. |

---

### 3.11 Project Versioning & Rollback (SRS-VER)

| ID | Yêu cầu |
|---|---|
| VER-01 | Tự động snapshot JSON của dự án trước khi apply thay đổi lớn hoặc PM tạo Baseline thủ công. |
| VER-02 | Lưu trữ dữ liệu phiên bản trong bảng `project_versions`. |
| VER-03 | Cho phép PM xem so sánh Diff giữa hai phiên bản và thực hiện Rollback an toàn khi cần thiết. |

---

### 3.12 Document & Reporting (SRS-RPT)

| ID | Yêu cầu |
|---|---|
| RPT-01 | Quản lý tệp tải lên (BRD, SRS, tài liệu bàn giao) lưu trữ an toàn trên MinIO Storage (`documents`). |
| RPT-02 | Dashboard tổng hợp: Gantt Chart tương tác, Burndown, Burnup, Velocity, Phân bổ trạng thái Task. |
| RPT-03 | Chỉ số tài chính & tiến độ nâng cao: EVA (Earned Value Analysis), CPI, SPI, CV, SV. |
| RPT-04 | Xuất báo cáo tự động định dạng DOCX và XLSX qua Celery Worker. |

---

## 4. Cơ sở dữ liệu (Database Schema — 8 Domains, 34 Tables)

| Domain | Số bảng | Danh sách bảng |
|---|---|---|
| **1. Base & Associations** | 4 | `user_roles`, `role_permissions`, `user_skills`, `project_members` |
| **2. User & RBAC** | 5 | `users`, `roles`, `permissions`, `skills`, `leaves` |
| **3. Project Core** | 6 | `portfolios`, `projects`, `phases`, `sprints`, `epics`, `milestones` |
| **4. Task & Scheduling** | 6 | `tasks`, `subtasks`, `dependencies`, `assignments`, `worklogs`, `comments` |
| **5. Change Management** | 5 | `change_requests`, `approvals`, `impact_reports`, `project_versions`, `audit_logs` |
| **6. AI Domain** | 3 | `ai_requests`, `ai_outputs`, `risk_reports` |
| **7. Document & Notification** | 3 | `documents`, `notifications`, `email_logs` |
| **8. Real-Time Chat** | 2 | `chat_messages`, `chat_read_states` |

---

## 5. Danh mục API & WebSocket Endpoints

### REST Routers (`/api/v1/...`)

**21 router đang mount & phục vụ thật:**
- `/auth`, `/oauth`, `/users`, `/roles`, `/permissions`
- `/portfolios`, `/projects`, `/phases`, `/sprints`, `/epics`, `/milestones`
- `/tasks`, `/subtasks`, `/dependencies`, `/assignments`, `/worklogs`
- `/projects/{id}/messages` (Chat REST API)
- `/resource-leveling`, `/dashboards`, `/notifications`, `/audit`

**11 router còn là stub `TODO`, bị comment trong `router.py`, CHƯA mount:**
- `/leaves`, `/skills`, `/documents`, `/approvals`, `/change-requests`
- `/gantt`, `/cpm`, `/reports`, `/versions`, `/ai`, `/system`

### 2 WebSocket Endpoints (`/ws/...`)
- `/ws/chat/{project_id}?token=<JWT>` — Kênh chat nhóm dự án
- `/ws/notifications?token=<JWT>` — Kênh đẩy thông báo tức thời cá nhân

---

## 6. Trạng thái Triển khai (Implementation Status)

> Đối soát với mã nguồn ngày 2026-09-03. API thực tế: **21 REST router + 2 WebSocket router** được mount; 123/123 unit test pass.

- [x] **Core Auth & User Onboarding (Phase 1)**: Hoàn thành 100%.
- [x] **Portfolio, Project Core & CPM Engine (Phase 2)**: Hoàn thành 100%. CPM chạy nội bộ (`utils/cpm.py` + `scheduling_service.py`); endpoint `/cpm` và `/gantt` **chưa mount** (còn stub).
- [x] **Hệ thống Quản trị Admin & Audit Timeline**: Hoàn thành 100% (`/admin/users`, `/admin/roles`, `/admin/audit`).
- [x] **Hạ tầng Real-time WebSocket & Redis Pub/Sub**: Hoàn thành 100% (`ConnectionManager`, `redis_listener`).
- [x] **Real-time Project Chat**: Hoàn thành 100% (Backend endpoints + WS + Frontend UI & unread badge).
- [x] **Thông báo Real-time & Celery Beat Daily Sweep**: Hoàn thành 100% (WS Push + Beat 08:00 AM sweep).
- [~] **AI Provider Layer**: Mới có `BaseAIProvider`, `OpenAIProvider`, `GeminiProvider`, `project_generator.py`. Endpoint `/ai` và Celery `ai_tasks` **vẫn là stub** — chưa có tính năng AI nào chạy được.
- [~] **Change Request, Approvals & Versioning**: **Chỉ có model DB**. Endpoint `change_requests`/`approvals`/`project_versions` là stub `TODO`, chưa mount, chưa có service/UI.
- [ ] **Reports DOCX/XLSX**: `report_tasks.py` là stub trả về rỗng; endpoint `/reports` chưa mount.
- [ ] **Document AI Parser** (`/documents`), **Investor Read-only Dashboard**, **Mobile polish**: chưa bắt đầu.
- [x] **Docker Compose 7 Services**: Hoàn thành và đã cấu hình đầy đủ.

---

*Cập nhật lần cuối: 2026-09-03 — Version 2.2.1 — Stack: Python FastAPI + Next.js 15*
