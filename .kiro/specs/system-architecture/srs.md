# Software Requirements Specification (SRS)
## AI Project Planning & Portfolio Management System

**Version:** 1.0
**Date:** 2026-06-25

---

## 1. Giới thiệu (Introduction)
Tài liệu SRS này định nghĩa các yêu cầu phần mềm chi tiết để xây dựng hệ thống AI Project Planning & Portfolio Management dựa trên kiến trúc Python (FastAPI) và React (Vite).

---

## 2. Kiến trúc Hệ thống (System Architecture)

### 2.1 Công nghệ (Technology Stack)
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS v3, Zustand (Local state), TanStack Query v5 (Server state), Recharts, @dnd-kit (Gantt drag & drop).
- **Backend:** Python 3.11+, FastAPI, Pydantic v2.
- **Database Layer:** PostgreSQL 14+, SQLAlchemy 2.0 (Async Engine), Alembic (Migrations).
- **Background Jobs:** Celery, Redis (Broker & Result Backend).
- **File Storage:** MinIO (S3-Compatible)
- **AI Integration:** OpenAI API (GPT-4o), Google Generative AI SDK (Gemini Pro).

### 2.2 Mô hình kết nối (Integration Model)
- Frontend giao tiếp với Backend thông qua RESTful APIs.
- Các tác vụ nặng (Sinh báo cáo, Gọi AI, Gửi Email) được đẩy vào Redis Broker và xử lý bất đồng bộ bởi Celery Workers.
- Database Connection Pooling được quản lý bởi SQLAlchemy (AsyncSession).

---

## 3. Yêu cầu chức năng (Functional Requirements)

### 3.1 Authentication & Authorization
- Đăng nhập, đăng xuất sử dụng JWT (Access Token & Refresh Token).
- Mã hóa mật khẩu bằng bcrypt.
- Phân quyền theo mô hình RBAC: Permission được gán cho Role, Role được gán cho User.
- API Endpoints được bảo vệ bởi dependency `require_roles()`.

### 3.2 Quản lý Dự án & Task (Project & Task Management)
- CRUD cho Portfolio, Project, Phase, Sprint, Epic, Milestone, Task, Subtask.
- Quản lý các mối quan hệ (Task Dependency): Finish-to-Start (FS), Start-to-Start (SS), Finish-to-Finish (FF), Start-to-Finish (SF) kèm Lag Days.
- Ghi nhận Worklog (Time tracking) cho từng Task.

### 3.3 Thuật toán lõi (Core Algorithms)
- **CPM (Critical Path Method):** Mỗi khi task thay đổi, hệ thống phải sắp xếp tô-pô (Topological Sort), tính toán Forward Pass (ES, EF) và Backward Pass (LS, LF) để tìm ra Float Days và đánh dấu các task trên Critical Path.
- **Resource Leveling:** Thuật toán phát hiện sự chồng chéo lịch làm việc của nhân sự, cộng dồn tổng số giờ làm trong ngày của một user và so sánh với cấu hình (VD: 8h/ngày). Có tính đến cả lịch nghỉ phép (Leaves).

### 3.4 Tích hợp Trí tuệ Nhân tạo (AI Features)
Backend phải gọi qua Celery Worker để không làm block API:
- **Project Generator:** Nhận prompt -> Gửi AI -> Trả về cấu trúc WBS (JSON) -> Parse và Insert vào DB.
- **Impact Analysis & Schedule Optimization:** Phân tích Change Request, tính toán rủi ro và tự động vẽ lại lịch trình dự án để PM duyệt.
- **Resource Recommender:** Suggest nhân sự dựa trên kỹ năng và lịch rảnh.
- **Risk Analyzer:** Đánh giá định kỳ các rủi ro (Risk Score: Low/Medium/High/Critical).
- **Document Parser:** Đọc tài liệu BRD/SRS từ MinIO và gợi ý bóc tách thành Epics/Tasks.

### 3.5 Báo cáo & Dashboard
- API cung cấp số liệu cho các Chart: Gantt, Burndown, Burnup, Velocity, Phân bổ nguồn lực.
- Tính toán trực tiếp các chỉ số quản lý dự án chuẩn: CPI (Cost Performance Index), SPI (Schedule Performance Index), EVA (Earned Value Analysis).
- **Export Reports:** Sinh file DOCX (python-docx) và XLSX (openpyxl) trên server, upload MinIO và trả về URL.

### 3.6 Change Management & Versioning
- Quản lý trạng thái CR: DRAFT -> SUBMITTED -> UNDER_REVIEW -> APPROVED -> REJECTED -> IMPLEMENTED.
- **Project Snapshot:** Khi PM tạo baseline hoặc apply CR, hệ thống serialize toàn bộ Project Data thành JSON và lưu vào bảng `ProjectVersion`. Hỗ trợ rollback bằng cách deserialize data này.

---

## 4. Yêu cầu phi chức năng (Non-Functional Requirements)

### 4.1 Hiệu năng (Performance)
- Các APIs CRUD thông thường phải phản hồi < 200ms.
- Các thao tác kéo thả trên Gantt chart (cập nhật dependency/ngày tháng) trigger CPM, phản hồi < 500ms.
- Việc gọi API của bên thứ 3 (AI, Email) không bao giờ được chặn (block) event loop chính; bắt buộc dùng Celery.

### 4.2 Bảo mật (Security)
- Thông tin mật khẩu, API keys (OpenAI, Gemini), thông tin SMTP phải được thiết lập qua Environment Variables (`.env`), không hard-code.
- Mọi API endpoint thay đổi dữ liệu (POST, PUT, DELETE) bắt buộc phải kiểm tra quyền RBAC hiện tại.
- Audit Logging: Mọi thao tác thay đổi dữ liệu của dự án phải được lưu lịch sử thay đổi (Bảng `AuditLog` lưu IP, Action, Old Values, New Values).

### 4.3 Tính mở rộng & Maintainability (Scalability & Maintainability)
- Kiến trúc thư mục tuân thủ nghiêm ngặt Layered Architecture. Controller (Endpoints) không chứa Business Logic.
- Type hinting 100% trong Python Code, validation chặt chẽ bằng Pydantic.
- Có khả năng thêm các AI Provider mới (như Claude hoặc Llama) chỉ bằng cách kế thừa class `BaseAIProvider` mà không cần sửa Core Logic.
