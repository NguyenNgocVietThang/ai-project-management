# Đặc tả yêu cầu phần mềm (SRS)
## Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI

**Version:** 2.4.0
**Date:** 2026-10-13
**Trạng thái:** Đối soát với mã nguồn thực tế — xem §6 (Phase 1–4 hoàn thành phần mã nguồn, đã gộp vào `main` cục bộ, chưa push; chờ người dùng duyệt quy tắc rollback V0, duyệt checkpoint, chạy thử provider AI thật và kịch bản demo trên Render. Phase 5 làm một phần: đã có thông báo đẩy WebSocket, avatar, polish giao diện; chưa có upload/parse tài liệu gốc; dashboard Investor đã hoàn thành 2026-10-16).

---

## 1. Giới thiệu (Introduction)

### 1.1 Mục đích
Tài liệu SRS này định nghĩa các yêu cầu phần mềm chi tiết cho hệ thống **AI Project Planning & Portfolio Management** — một web application quản lý dự án thông minh tích hợp AI, tương đương MS Project nhưng được tăng cường bởi AI tự động phân tích, đề xuất và tối ưu kế hoạch dự án, hỗ trợ Real-time Project Chat và WebSocket Notifications.

### 1.2 Phạm vi
Hệ thống phục vụ nhiều vai trò (multi-role) theo cấu trúc phân cấp:
```
Portfolio → Project → Phase / Sprint / Epic / Milestone → Task → SubTask
```
Kèm theo kênh giao tiếp thời gian thực theo từng dự án (`/ws/chat/{project_id}`), kênh thông báo cá nhân tức thời (`/ws/notifications`), và quét tự động lịch trình qua job cron hằng ngày (Supabase Cron hoặc cron cục bộ gọi endpoint nội bộ, sinh durable job trong PostgreSQL).

### 1.3 Tài liệu tham chiếu
- `brd.md` — Business Requirements Document
- `design.md` — System Architecture Design
- `README.md` — Tổng quan và hướng dẫn toàn diện hệ thống

---

## 2. Kiến trúc Hệ thống (Kiến trúc hệ thống)

### 2.1 Công nghệ (Ngăn xếp công nghệ)

| Layer | Công nghệ | Phiên bản |
|---|---|---|
| Phía giao diện | Next.js (App Router), React, TypeScript, Tailwind CSS v3, Zustand, TanStack Query v5, Recharts, @dnd-kit, next-intl (i18n vi/en, locale trong cookie) | Next.js 15, React 18 |
| Phía máy chủ | FastAPI, Python, Pydantic v2, SQLAlchemy 2.0 (Async Engine), Alembic | Python 3.11+ |
| **Database** | PostgreSQL (primary), Redis (cache / pub-sub / session) | PG 16, Redis 7 |
| **Storage** | Bucket riêng tư Supabase Storage (cloud) hoặc MinIO (cục bộ) — avatar, SRS/BRD DOCX, XLSX; tải xuống qua proxy backend có kiểm tra quyền | — |
| **Real-time Bus** | Redis Pub/Sub + ConnectionManager (hỗ trợ scale đa tiến trình) | Redis 7 |
| **Tác vụ nền & lịch** | Durable jobs trong PostgreSQL (bảng `jobs`, runner chạy trong tiến trình FastAPI, outbox cùng transaction) + Supabase Cron (hoặc cron cục bộ) gọi `POST /api/v1/internal/jobs/schedules`. Celery chỉ còn mã kế thừa, không bắt buộc | — |
| **AI** | xKiro — cổng AI tương thích OpenAI, nhiều model miễn phí (DeepSeek, Qwen, Mistral) theo từng loại việc | openai 1.51 (SDK) |
| **Auth** | JWT (Access Token 30m + Refresh Token 7d) + RBAC (34 permissions); WebSocket xác thực bằng vé dùng một lần (không phải JWT trên query string) | PyJWT, passlib/bcrypt |
| **Email** | SMTP (fastapi-mail) hoặc Resend + Jinja2 templates; trên demo Render đang tắt gửi thật | fastapi-mail 1.4 |
| **Export** | python-docx (SRS/BRD DOCX), openpyxl (XLSX), Pillow (ảnh PNG quy trình BPMN chèn vào DOCX) — sinh phía server qua durable job | — |

### 2.2 Mô hình kết nối (Integration Model)

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 15 Frontend                      │
│  Dashboard + Gantt chỉ đọc + Chat + Thông báo + Tài liệu    │
└────────────────┬───────────────────────────┬────────────────┘
                 │ REST API (/api/v1/...)    │ WebSocket (/ws/...)
                 ▼                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   FastAPI Backend Server                    │
│   (Layered Architecture + ConnectionManager + Redis PubSub) │
│   Job runner trong tiến trình (durable jobs, bảng jobs)     │
└──────┬─────────┬──────────────────┬──────────────┬──────────┘
       │         │                  │              ▲
  ┌────▼───┐ ┌───▼────┐   ┌─────────▼────────┐     │ POST /internal/jobs/schedules
  │ PG SQL │ │ Redis  │   │ Supabase Storage │  ┌──┴───────────────────┐
  │ + jobs │ │Pub/Sub │   │ hoặc MinIO       │  │ Supabase Cron hoặc   │
  └────────┘ └────────┘   └──────────────────┘  │ cron cục bộ          │
                                                │ (08:00, 08:30)       │
                                                └──────────────────────┘
      ┌──────────────────────┐
      │   AI Provider Layer  │ <── job runner gọi (ai.*, document.generate)
      │  └─ xKiro (DeepSeek, │
      │     Qwen, Mistral)   │
      └──────────────────────┘
```

---

## 3. Yêu cầu chức năng (Yêu cầu chức năng)

### 3.1 Authentication & Authorization (SRS-AUTH)

| ID | Yêu cầu |
|---|---|
| AUTH-01 | Đăng ký & Đăng nhập sử dụng JWT (Access Token expire 30 phút + Refresh Token expire 7 ngày). Access Token chỉ lưu trong bộ nhớ phía client (không ghi localStorage); Refresh Token nằm trong cookie `httpOnly` do server đặt (`app/core/auth_cookies.py`). Cờ `has-session` (không chứa bí mật) đồng bộ cho Next.js Edge Middleware biết có phiên đăng nhập hay không. |
| AUTH-02 | Mã hóa mật khẩu bằng bcrypt (passlib). |
| AUTH-03 | Phân quyền theo mô hình RBAC: 34 Permissions gán cho 7 Roles, Role gán cho User. |
| AUTH-04 | Social Login OAuth 2.0 (Google) tự động liên kết tài khoản theo email. |
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
| CHAT-02 | **Giao thức WebSocket**: Kết nối qua `/ws/chat/{project_id}?ticket=<ticket>` dùng vé một lần (60 giây, lấy trước qua `POST /api/v1/auth/ws-ticket`), tự động kết nối lại khi mất mạng (Reconnection w/ exponential backoff). |
| CHAT-03 | **Message Bus**: Đẩy tin nhắn qua Redis Pub/Sub (`ws:chat:project:{id}`) để phân phối tới tất cả client đang kết nối trên mọi tiến trình worker. |
| CHAT-04 | **Lưu trữ & Lịch sử**: Lưu trữ tin nhắn vào bảng `chat_messages`, cung cấp API phân trang theo con trỏ (`before_id`) qua `GET /api/v1/projects/{id}/messages`. |
| CHAT-05 | **Trạng thái Chưa đọc & Đã đọc**: Theo dõi mốc tin nhắn đọc gần nhất qua bảng `chat_read_states`, cung cấp API `GET /unread-count` và `POST /read`. |
| CHAT-06 | **Fallback REST**: Cho phép gửi tin nhắn qua `POST /api/v1/projects/{id}/messages` khi WebSocket chưa sẵn sàng. |

---

### 3.8 Thông báo Thời gian thực & Quét Lịch trình (SRS-NOTI)

| ID | Yêu cầu |
|---|---|
| NOTI-01 | **WebSocket Real-time Push**: Đẩy thông báo cá nhân tức thời tới người dùng qua `/ws/notifications?ticket=<ticket>` (vé một lần, xem CHAT-02) trên kênh `ws:notif:user:{user_id}`. |
| NOTI-02 | **Fan-out Notification**: Khi một Task có thay đổi quan trọng (trạng thái, ngày bắt đầu, hạn chót, độ ưu tiên, người thực hiện), tự động gửi thông báo tới toàn bộ thành viên trong nhóm dự án (trừ người thực hiện thao tác). |
| NOTI-03 | **Daily Sweep bằng job cron**: Supabase Cron (hoặc cron cục bộ) gọi `POST /api/v1/internal/jobs/schedules`, sinh job `cron.reminders` lúc 08:00 (Asia/Ho_Chi_Minh) quét các task bắt đầu hôm nay và task sắp đến hạn (1 ngày trước hạn) để gửi thông báo fan-out tự động. |
| NOTI-04 | **Chống gửi trùng (Idempotency)**: Lưu dấu thời gian `last_start_notified_at` và `last_due_soon_notified_at` trên bảng `tasks`. Tự động reset cờ khi task được đổi hạn chót mới. |
| NOTI-05 | **Email Notifications**: Gửi email qua durable job (`email.verify`, `email.reset`, `email.invite`) bằng SMTP hoặc Resend + Jinja2 HTML templates, lưu nhật ký vào `email_logs`. Trên demo Render hiện tắt gửi thật. |

---

### 3.9 Tích hợp AI (SRS-AI)

| ID | SOP | Yêu cầu |
|---|---|---|
| AI-01 | SOP-AI-001 | **Project Generator**: PM nhập prompt tự nhiên → AI sinh cấu trúc JSON WBS (Phases, Sprints, Epics, Tasks, Dependencies) → Insert vào DB → Chạy CPM → Hiển thị Gantt. |
| AI-02 | SOP-AI-002 | **Impact Analysis**: Chạy theo yêu cầu trên trang Change Request (job `ai.impact_analysis`) → AI đánh giá tác động Scope, Timeline, Budget, Resource. |
| AI-03 | SOP-AI-003 | **Schedule Optimization**: AI tính toán lại chuỗi phụ thuộc và đề xuất lịch trình tối ưu sau khi CR được phê duyệt. |
| AI-04 | SOP-RM-001 | **Resource Recommendation**: Gợi ý nhân sự phù hợp cho Task dựa trên Skill match, Chi phí, Tải công việc và Lịch nghỉ phép. |
| AI-05 | SOP-AI-005 | **Risk Analysis**: Đánh giá định kỳ các rủi ro dự án (trễ hạn, quá tải, vượt chi phí) và xếp loại mức độ rủi ro. |
| AI-06 | SOP-DOC-001 | **Document Parser**: Bóc tách tài liệu BRD/SRS tải lên để gợi ý danh mục Tasks. Chưa làm, thuộc Phase 5. |
| AI-07 | — | **Hỏi làm rõ yêu cầu**: Hồ sơ yêu cầu 7 mục (goals, stakeholders, in_scope, out_of_scope, key_features, constraints, success_criteria), mỗi mục có trạng thái clear/missing/assumed/skipped. AI hỏi đúng một câu mỗi lượt, có thể đề xuất giả định, trần 12 lượt; người dùng có thể chọn "Bỏ qua, tạo luôn"; AI không ghi đè mục người dùng đã xác nhận (job `ai.requirement_clarify`, API `/requirement-briefs`, UI `RequirementClarifier` trong `AIGeneratorModal`). |
| AI-08 | — | **Sinh dự án từ hồ sơ**: `POST /ai/generate-project-from-brief` chỉ dùng mục clear/assumed của hồ sơ đã chốt; mục skipped không được bịa. Endpoint prompt thô cũ giữ tương thích. |
| AI-09 | — | **Sinh nội dung SRS/BRD**: AI viết JSON theo nhóm mục trên mẫu cố định (SRS 3 lượt AI, BRD 4 lượt); mục "Giả định và vấn đề mở" sinh từ hồ sơ; nếu còn mục missing thì trả `needs_clarification` và mở lại vòng hỏi. Ngôn ngữ mặc định tiếng Việt, tham số `language` vi hoặc en (job `document.generate`). |
| AI-10 | — | **Sinh mô hình quy trình BPMN**: AI sinh ProcessModel (lane, task, gateway, event, flow) qua job `ai.bpmn_generate`, có validator kiểm tra cấu trúc. |
| AI-11 | — | **Hạn mức AI**: Giới hạn số job AI mỗi ngày theo `AI_DAILY_JOB_LIMIT` (mặc định 20/ngày). |

---

### 3.10 Change Request & Multi-Level Approvals (SRS-CR)

| ID | Yêu cầu |
|---|---|
| CR-01 | Khách hàng hoặc Thành viên tạo yêu cầu thay đổi (CR) kèm mô tả, ước tính thời gian và chi phí. |
| CR-02 | Submit CR tạo 3 bước duyệt tuần tự BA -> PO -> PM (`/change-requests/{id}/approvals`). Dự án thiếu thành viên giữ vai trò cần thiết thì trả 422 `missing_roles`. |
| CR-03 | Thành viên dự án đúng vai trò của bước hiện hành (kể cả người tạo CR) mới được quyết định; admin hệ thống chỉ được xem. Khóa hàng chống quyết định đồng thời; ràng buộc unique (change_request_id, step_order). |
| CR-04 | Từ chối bắt buộc có lý do; khi một bước bị từ chối, các bước sau chuyển `CANCELLED`. Mọi quyết định ghi audit log và gửi thông báo in-app. |
| CR-05 | PM duyệt bước cuối thì tự động tạo snapshot phiên bản gắn `change_request_id`. UI `ApprovalTimeline` trên trang chi tiết CR `/projects/[id]/change-requests/[crId]`. |

---

### 3.11 Project Versioning & Rollback (SRS-VER)

| ID | Yêu cầu |
|---|---|
| VER-01 | Snapshot JSON gồm phase, sprint, epic, milestone, task, dependency (không gồm worklog, comment, subtask, assignment); tạo tự động khi PM duyệt CR hoặc baseline thủ công (chỉ PM hoặc admin). Tối đa 50 phiên bản mỗi dự án. |
| VER-02 | Lưu trữ dữ liệu phiên bản trong bảng `project_versions`; API `/projects/{id}/versions`. |
| VER-03 | Diff giữa hai phiên bản hoặc với hiện trạng (`/{a}/diff/{b}` hoặc `/{a}/diff/current`), chỉ trả các thay đổi. |
| VER-04 | Rollback (`/{id}/rollback`) chạy trong một transaction theo quy tắc V0: task có dữ liệu phụ thuộc được đánh dấu `archived_at` thay vì xóa; worklog không bao giờ bị xóa; task đã xóa được tạo lại với ID mới kèm `id_map`; tạo phiên bản "trước khi khôi phục" để có thể đảo ngược; tính lại CPM sau khôi phục. Trang `/projects/[id]/versions`. |

---

### 3.12 Tài liệu và báo cáo (SRS-RPT)

| ID | Yêu cầu |
|---|---|
| RPT-01 | Tải lên và bóc tách tài liệu gốc (BRD, SRS, tài liệu bàn giao): chưa làm, thuộc Phase 5. |
| RPT-02 | Dashboard tổng hợp: Burndown, Burnup, Velocity, Phân bổ trạng thái Task. |
| RPT-03 | Chỉ số tài chính & tiến độ nâng cao: EVA (Earned Value Analysis), CPI, SPI, CV, SV. |
| RPT-04 | **SRS/BRD DOCX**: sinh từ mẫu cố định qua job `document.generate`, lưu vào `generated_documents`, tải qua `/projects/{id}/documents/.../download` (proxy kiểm tra quyền). Có chèn ảnh PNG quy trình BPMN vẽ phía server bằng Pillow; nếu vẽ lỗi thì dùng bảng các bước. Trang `/projects/[id]/documents`. |
| RPT-05 | **Gantt chỉ đọc**: vẽ SVG từ `GET /projects/{id}/cpm`; đường găng có nhãn chữ (không chỉ dựa vào màu); zoom ngày/tuần/tháng; ảo hóa hàng (2000 task). Giới hạn `CPM_MAX_TASKS`/`CPM_MAX_DEPENDENCIES`, vượt thì trả 422 `resource_limit_exceeded`. Trang `/projects/[id]/gantt`. Kéo thả ngoài phạm vi. |
| RPT-06 | **XLSX**: job `report.xlsx` xuất các sheet Task, Đường găng, CR và duyệt, EVA và Burndown (EVA tính theo giờ công: BAC = tổng giờ ước tính, EV, AC, PV, SPI, CPI); tải qua `/projects/{id}/reports/xlsx/{job_id}/download`. Nút Xuất XLSX ở trang tổng quan dự án. |
| RPT-07 | **Trang quy trình**: `/projects/[id]/process` vẽ swimlane SVG từ ProcessModel (`/projects/{id}/process-model`). |

---

## 4. Cơ sở dữ liệu (Lược đồ cơ sở dữ liệu — 10 Domains, 39 Tables)

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
| **9. Requirement & Generated Artifacts** | 3 | `requirement_briefs`, `generated_documents`, `process_models` |
| **10. Hạ tầng** | 2 | `jobs` (durable jobs), `security_states` |

Ghi chú thay đổi Phase 4: thêm cột `tasks.archived_at`; bảng `approvals` thêm `required_role`, `approver_id` cho phép null, trạng thái `CANCELLED`, ràng buộc unique (change_request_id, step_order); enum `airequesttype` thêm `REQUIREMENT_CLARIFY`, `DOCUMENT_GENERATE`, `BPMN_GENERATE`. Head migration: `20261013_process_models`.

---

## 5. Danh mục API & WebSocket Endpoints

### REST Routers (`/api/v1/...`)

**32 router đang mount và phục vụ thật:**
- `/auth`, `/oauth`, `/users`, `/roles`, `/permissions`
- `/portfolios`, `/projects`, `/phases`, `/sprints`, `/epics`, `/milestones`
- `/tasks`, `/subtasks`, `/dependencies`, `/assignments`, `/worklogs`
- `/change-requests`
- `/projects/{id}/messages` (Chat REST API)
- `/cpm` (chỉ đọc — engine chạy nội bộ từ Phase 2, endpoint chỉ phơi kết quả)
- `/resource-leveling`, `/dashboards`, `/notifications`, `/audit`, `/ai` (gồm `POST /ai/generate-project-from-brief`)
- Mới Phase 4: `/requirement-briefs`, `/change-requests/{id}/approvals`, `/projects/{id}/versions`, `/projects/{id}/documents`, `/projects/{id}/reports/xlsx`, `/projects/{id}/process-model`
- Tác vụ nền: `/jobs`, `/internal/jobs` (gồm `POST /internal/jobs/schedules` cho cron)

**3 router còn là stub, chưa mount:** `/leaves`, `/skills`, `/system`. Stub `/gantt` đã xóa (Gantt vẽ từ `/projects/{id}/cpm`).

### 2 WebSocket Endpoints (`/ws/...`)
- `/ws/chat/{project_id}?ticket=<ticket>` — Kênh chat nhóm dự án
- `/ws/notifications?ticket=<ticket>` — Kênh đẩy thông báo tức thời cá nhân

Cả hai dùng vé một lần (single-use ticket, TTL 60 giây, cấp qua `POST /api/v1/auth/ws-ticket`), không phải JWT trên query string — xem `app/core/ws_tickets.py` và `app/api/ws/deps.py`.

---

## 6. Trạng thái Triển khai (Trạng thái triển khai)

> Đối soát với mã nguồn ngày 2026-10-13. API thực tế: **32 REST router + 2 WebSocket router** được mount. Kiểm thử backend: 649 passed / 28 skipped (SQLite), 659 passed / 16 skipped khi có PostgreSQL (1 test phụ thuộc môi trường có sẵn lỗi). Frontend: 129 test trên 26 tệp (`vitest`) đạt; type-check, lint, build đạt.

- [x] **Core Auth & User Onboarding (Phase 1)**: Hoàn thành 100%.
- [x] **Portfolio, Project Core & CPM Engine (Phase 2)**: Hoàn thành 100%. CPM chạy nội bộ (`utils/cpm.py` + `scheduling_service.py`); endpoint `/cpm` đã mount (chỉ đọc); stub `/gantt` đã xóa, Gantt chỉ đọc hoàn thành ở Phase 4.
- [x] **Hệ thống Quản trị Admin & Audit Timeline**: Hoàn thành 100% (`/admin/users`, `/admin/roles`, `/admin/audit`).
- [x] **Hạ tầng Real-time WebSocket & Redis Pub/Sub**: Hoàn thành 100% (`ConnectionManager`, `redis_listener`).
- [x] **Real-time Project Chat**: Hoàn thành 100% (Backend endpoints + WS + Frontend UI & unread badge).
- [x] **Thông báo Real-time & Daily Sweep**: Hoàn thành 100% (WS Push + job cron `cron.reminders` 08:00 do Supabase Cron hoặc cron cục bộ kích hoạt).
- [x] **Durable jobs thay Celery**: Hoàn thành. Bảng `jobs`, runner trong tiến trình FastAPI, outbox cùng transaction. Mã Celery trong `backend/app/workers/` chỉ còn kế thừa; service `celery-worker`/`celery-beat` trong docker-compose không bắt buộc.
- [x] **AI Project Generator (SOP-AI-001)**: Hoàn thành 100%. `BaseAIProvider` + `XkiroProvider` + `project_generator.py`, endpoint `/ai/generate-project` đã mount, job `ai.project_generate` sinh Project/Phase/Task/Dependency thật, modal UI `AIGeneratorModal`.
- [x] **AI 4 Trụ cột còn lại (SOP-AI-002 → 005)**: Hoàn thành 100%. Cả 4 module AI (`impact_analyzer.py`, `schedule_optimizer.py`, `resource_recommender.py`, `risk_analyzer.py`) hoạt động thật qua durable job (`ai.impact_analysis`, `ai.schedule_optimize`, `ai.resource_recommend`, `ai.risk_analysis`), endpoint `/ai/impact-analysis`, `/ai/optimize-schedule`, `/ai/resource-recommendation`, `/ai/risk-analysis` đã mount; job cron `cron.risk` quét rủi ro 08:30 hàng ngày; UI tại `/projects/{id}/change-requests` và `/projects/{id}/ai-insights`.
- [x] **Change Request CRUD**: Hoàn thành và đã mount (`change_requests.py`, `change_request_service.py`).
- [x] **Phase 4 Workflow & Reporting**: Hoàn thành phần mã nguồn (gộp vào `main` cục bộ, chưa push): hỏi làm rõ yêu cầu và sinh dự án từ hồ sơ; duyệt CR BA -> PO -> PM; phiên bản snapshot, diff, rollback V0; Gantt chỉ đọc; SRS/BRD DOCX; XLSX; BPMN swimlane và PNG. `workers/report_tasks.py` đã xóa. Còn chờ người dùng: duyệt quy tắc rollback V0, duyệt checkpoint, chạy thử provider AI thật, kịch bản demo trên Render sau cold start.
- [x] **Investor Read-only Dashboard**: Hoàn thành (2026-10-16). Router `/investor`, bảng `portfolio_investors`, trang `/investor`; investor chỉ xem portfolio được cấp, quyền cấp yêu cầu role Investor tại thời điểm đọc; `overdue_projects` bỏ qua dự án COMPLETED và CANCELLED. Backend 697 passed / 28 skipped, frontend 146 test. Chưa có UI cho `GET /investor/projects/{id}` và `risk_distribution`.
- [ ] **Upload và bóc tách tài liệu gốc (Phase 5)**, kéo thả Gantt, gửi email thật trên demo: chưa làm.
- [x] **Mobile Responsive & Polish**: Hoàn thành cơ bản mobile navigation với modal focus trap, theme switcher (light/dark/system).
- [x] **Docker Compose 7 Services Dev + Deploy Render + Supabase (Free Tier)**: Hoàn thành cấu hình đầy đủ.

---

*Cập nhật lần cuối: 2026-10-13 — Version 2.4.0 — Stack: Python FastAPI + Next.js 15*
