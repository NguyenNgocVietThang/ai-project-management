# AI Project Planning & Portfolio Management System

> Hệ thống quản lý dự án thông minh tích hợp AI — tương đương MS Project

## 🎯 Tổng quan

Web application quản lý dự án thông minh tích hợp AI, hỗ trợ:
- Quản lý danh mục dự án (Portfolio & Project Management)
- Sinh kế hoạch dự án tự động từ prompt ngôn ngữ tự nhiên bằng AI
- Tính toán Critical Path (CPM), Resource Leveling tự động
- Phân tích tác động thay đổi (Impact Analysis) và tối ưu lịch
- Dashboard đa chiều: Gantt, Burndown, Burnup, Velocity, EVA, CPI, SPI

---

## 🏗️ Kiến trúc hệ thống

```
Frontend (React + Vite)  ←→  Backend (FastAPI / Python)  ←→  PostgreSQL
                                         ↓
                                 Redis + Celery
                                         ↓
                              AI Providers (OpenAI / Gemini)
                                         ↓
                                 MinIO (File Storage)
```

---

## 📦 Technology Stack

### Backend — Python
| Thành phần | Công nghệ |
|---|---|
| Framework | **FastAPI** |
| ORM | **SQLAlchemy 2.x** |
| Migrations | **Alembic** |
| Validation | **Pydantic v2** |
| Auth | python-jose (JWT) + passlib (bcrypt) |
| Queue/Worker | **Celery + Redis** |
| Cache | Redis (redis-py) |
| AI | openai, google-generativeai |
| Storage | minio (S3-compatible) |
| Email | FastMail / smtplib |
| Export | python-docx, openpyxl |
| Testing | pytest, pytest-asyncio, httpx |

### Frontend — React
| Thành phần | Công nghệ |
|---|---|
| Framework | **React 18 + Vite** |
| Language | TypeScript |
| Routing | **React Router v6** |
| State (local) | **Zustand** |
| State (server) | **TanStack Query v5** |
| HTTP | Axios |
| Styling | Tailwind CSS v3 |
| Forms | React Hook Form + Zod |
| Tables | TanStack Table v8 |
| Charts | Recharts |
| Drag & Drop | @dnd-kit |
| Icons | Lucide React |

---

## 🗄️ Database Schema (SQLAlchemy)

Hệ thống bao gồm 32 bảng, được chia thành 7 Domains chính:

### 1. Base & Associations (4 tables)
- `user_roles`, `role_permissions`, `user_skills`, `project_members`

### 2. User & RBAC Domain (5 tables)
- `users`: Thông tin tài khoản và profile (department, position, hourly_rate).
- `roles`, `permissions`: Phân quyền hệ thống.
- `skills`: Phân loại kỹ năng nhân sự.
- `leaves`: Quản lý ngày nghỉ (tính toán Resource Leveling).

### 3. Project Core Domain (6 tables)
- `portfolios`, `projects`: Quản lý cấp cao dự án và danh mục.
- `phases`, `sprints`, `epics`, `milestones`: Cấu trúc phân rã (WBS).

### 4. Task & Scheduling Domain (6 tables)
- `tasks`: Chứa các trường CPM (ES, EF, LS, LF, Float, Is Critical).
- `subtasks`: Cấp độ công việc nhỏ hơn bên trong Task.
- `dependencies`: Quan hệ ràng buộc giữa các Task (FS, SS, FF, SF).
- `assignments`: Phân công nhân sự cho Task.
- `worklogs`: Ghi nhận thời gian làm việc thực tế (Timesheet).
- `comments`: Thảo luận trên Task.

### 5. Change Management Domain (5 tables)
- `change_requests`: Quản lý yêu cầu thay đổi (CR).
- `approvals`: Workflow nhiều bước (BA -> PO -> PM).
- `impact_reports`: Đánh giá tác động của CR sinh ra bởi AI.
- `project_versions`: Lưu trữ JSON snapshot của dự án để Rollback.
- `audit_logs`: Ghi nhận thay đổi (thêm, sửa, xóa) trong hệ thống.

### 6. AI Domain (3 tables)
- `ai_requests`: Log các truy vấn gửi cho OpenAI/Gemini qua Celery.
- `ai_outputs`: Kết quả AI và lượng token sử dụng.
- `risk_reports`: Báo cáo phân tích rủi ro tự động.

### 7. Document & Notification Domain (3 tables)
- `documents`: Tài liệu quản lý trên MinIO.
- `notifications`: Thông báo in-app (13 events).
- `email_logs`: Lịch sử gửi email.

---

## 🚀 Cài đặt và chạy

### Prerequisites
- Python >= 3.11
- Node.js >= 18
- PostgreSQL >= 14
- Redis >= 6
- MinIO (hoặc S3-compatible)

### Backend Setup (Python / FastAPI)

```bash
cd backend

# Tạo virtual environment
python -m venv venv
source venv/bin/activate      # Linux/macOS
venv\Scripts\activate         # Windows

# Cài dependencies
pip install -r requirements.txt

# Setup biến môi trường
cp .env.example .env
# Chỉnh sửa .env với thông tin cấu hình

# Chạy migrations
alembic upgrade head

# Seed dữ liệu mẫu
python -m app.db.seed

# Chạy development server
uvicorn app.main:app --reload --port 8000
```

> API docs tự động: http://localhost:8000/docs (Swagger UI)
> ReDoc: http://localhost:8000/redoc

### Celery Worker (xử lý AI async)

```bash
cd backend

# Activate venv trước
celery -A app.workers.celery_app worker --loglevel=info
```

### Frontend Setup (React / Vite)

```bash
cd frontend

# Cài dependencies
npm install

# Setup biến môi trường
cp .env.example .env.local
# Chỉnh sửa VITE_API_URL=http://localhost:8000

# Chạy development server
npm run dev
```

> Ứng dụng chạy tại: http://localhost:5173

### Docker Setup

```bash
# Chạy tất cả services
docker-compose up -d

# Xem logs
docker-compose logs -f backend

# Dừng services
docker-compose down
```

---

## 📁 Cấu trúc dự án

Xem chi tiết trong [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

---

## 📋 Tài liệu

| Tài liệu | Mô tả |
|---|---|
| [PROJECT_INSTRUCTION.md](./PROJECT_INSTRUCTION.md) | Hướng dẫn chi tiết về hệ thống & SOP |
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | Cấu trúc thư mục dự án |
| [BRD (Business Requirements Document)](./.kiro/specs/system-architecture/brd.md) | Tài liệu yêu cầu nghiệp vụ |
| [SRS (Software Requirements Spec)](./.kiro/specs/system-architecture/srs.md) | Đặc tả yêu cầu phần mềm |
| [Architecture Design](./.kiro/specs/system-architecture/design.md) | Thiết kế kiến trúc tổng thể |
| API Docs | http://localhost:8000/docs (khi chạy backend) |

---

## 🔑 Vai trò hệ thống (RBAC)

| Role | Mô tả | Quyền chính |
|---|---|---|
| **Admin** | Quản trị hệ thống | Quản lý tài khoản, role, permission, AI Provider |
| **PM** | Project Manager | Quản lý Portfolio & Project, phân công resource |
| **BA** | Business Analyst | Review & Approve Change Request |
| **PO** | Product Owner | Approve Change Request (nghiệp vụ) |
| **Member** | Thành viên nhóm | Xem Task, ghi WorkLog, upload Deliverable |
| **Customer** | Khách hàng | Tạo Change Request, theo dõi trạng thái |
| **Investor** | Nhà đầu tư | Xem Dashboard tổng quan (read-only) |

---

## 🎯 Roadmap

### Phase 1 — Core (ưu tiên)
- [ ] Auth + RBAC (JWT + Refresh Token)
- [ ] Portfolio & Project CRUD
- [ ] Task management + Dependency graph
- [ ] CPM engine (Topological Sort + Forward/Backward Pass)
- [ ] Gantt Chart (render + drag & drop)
- [ ] Resource Assignment + Overload warning

### Phase 2 — AI Features
- [ ] AI Project Generator (SOP-AI-001)
- [ ] AI Impact Analysis (SOP-AI-002)
- [ ] AI Schedule Optimization (SOP-AI-003)
- [ ] AI Resource Recommendation (SOP-RM-001)
- [ ] AI Risk Analysis (SOP-AI-005)

### Phase 3 — Workflow & Reporting
- [ ] Change Request & Approval Workflow
- [ ] Project Versioning & Rollback
- [ ] Dashboard (Gantt, Burndown, Velocity, EVA, CPI, SPI)
- [ ] Report Export (DOCX, XLSX)
- [ ] Audit Timeline
- [ ] Email Notifications

### Phase 4 — Document AI & Polish
- [ ] BRD/SRS Upload + AI Document Parser
- [ ] Investor Dashboard (read-only)
- [ ] Performance optimization
- [ ] Mobile responsive

---

## 🔧 Biến môi trường

### Backend (`backend/.env`)
```env
# App
APP_ENV=development
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Database
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/ai_project_management

# Redis
REDIS_URL=redis://localhost:6379/0

# MinIO
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=ai-project-files

# AI Providers
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AIza...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASSWORD=your-app-password
```

### Frontend (`frontend/.env.local`)
```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_WS_URL=ws://localhost:8000/ws
```

---

## 📝 License

MIT

## 👥 Contributors

- [Your Name]

---

*Stack: Python FastAPI + React Vite — Cập nhật 2026-06-25*
