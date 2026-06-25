# System Architecture Design

## Overview

Hệ thống **AI Project Planning & Portfolio Management** được thiết kế theo kiến trúc hiện đại, tập trung hoàn toàn vào **Python (FastAPI)** cho phía Server và **React (Vite)** cho phía Client. Thiết kế này loại bỏ hoàn toàn các di sản cũ (NestJS/Prisma), tối ưu hóa cho tốc độ xử lý I/O bất đồng bộ, tính toán thuật toán CPM, và khả năng tích hợp linh hoạt với các mô hình AI ngôn ngữ lớn (LLMs).

## Technology Stack

### Backend Layer
- **Framework Core**: FastAPI (Python 3.11+)
- **Validation & Serialization**: Pydantic v2
- **ORM**: SQLAlchemy 2.0 (Async Engine)
- **Database Migrations**: Alembic
- **Task Queue & Background Jobs**: Celery
- **Message Broker & Cache**: Redis
- **Security**: python-jose (JWT), passlib (Bcrypt) cho Authentication & RBAC.

### Frontend Layer
- **Framework**: React 18 + Vite (Single Page Application - SPA)
- **Language**: TypeScript
- **State Management**: Zustand (Local state) & TanStack Query v5 (Server state)
- **Styling**: Tailwind CSS v3
- **Routing**: React Router v6

### Infrastructure Layer
- **Database**: PostgreSQL 14+
- **File Storage**: MinIO (S3-compatible) cho BRD/SRS documents, avatar và báo cáo xuất ra.
- **AI Providers**: OpenAI (GPT-4o) hoặc Google Gemini (Gemini Pro).

---

## Backend Architecture

Backend được thiết kế theo mô hình **Layered Architecture** (Kiến trúc phân tầng) để đảm bảo tính module hóa và dễ bảo trì:

1. **Endpoints Layer (`app/api/v1/endpoints/`)**: Chịu trách nhiệm nhận HTTP requests, kiểm tra quyền (RBAC dependencies), định tuyến đến Services, và trả về Pydantic schemas.
2. **Services Layer (`app/services/`)**: Chứa toàn bộ Business Logic. Bao gồm các dịch vụ như AI Integration (`ai_service.py`), CPM Calculation (`cpm_service.py`), Resource Leveling, v.v.
3. **Repositories Layer (`app/repositories/`)**: Data Access Layer. Kế thừa từ `BaseRepository`, đảm nhiệm việc truy vấn SQLAlchemy bất đồng bộ (async). Đảm bảo Service không gọi thẳng ORM.
4. **Models Layer (`app/models/`)**: Định nghĩa cấu trúc bảng (Table) thông qua SQLAlchemy Declarative Base.
5. **Schemas Layer (`app/schemas/`)**: Data Transfer Objects (DTO) định nghĩa bằng Pydantic, dùng để validate input và serialize output.
6. **Workers Layer (`app/workers/`)**: Các Celery tasks chạy ngầm độc lập khỏi API thread chính (ví dụ: gửi email, gọi AI tạo dự án tốn thời gian, sinh file báo cáo).

---

## Database Schema (SQLAlchemy)

Cơ sở dữ liệu bao gồm khoảng 22 bảng chính, chia thành các nhóm Domain:

### 1. User & RBAC Domain
- **User**: Bảng người dùng trung tâm.
- **Role & Permission**: Quản lý phân quyền với mô hình RBAC nhiều-nhiều (User-Role-Permission).
- **Skill**: Kỹ năng của nhân sự.
- **Leave**: Quản lý ngày nghỉ, liên kết trực tiếp với resource leveling.

### 2. Project Core Domain
- **Portfolio & Project**: Danh mục dự án và Dự án.
- **Phase, Sprint, Epic, Milestone**: Cấu trúc phân cấp và nhóm công việc (WBS).
- **Task & Subtask**: Đơn vị công việc nhỏ nhất, chứa các trường tính toán CPM (ES, EF, LS, LF, float_time, is_critical).
- **Dependency**: Các mối quan hệ phụ thuộc giữa các Task (FS, SS, FF, SF) hỗ trợ độ trễ (lag days).
- **Assignment**: Phân công nguồn lực cho Task.
- **Worklog**: Ghi nhận thời gian thực tế (Timesheet).

### 3. Change Management & Audit Domain
- **ChangeRequest & Approval**: Workflow phê duyệt thay đổi (có tích hợp AI phân tích tác động).
- **ProjectVersion**: Lưu trữ snapshot (dạng JSON) của toàn bộ dự án tại một thời điểm để có thể rollback.
- **AuditLog**: Lưu trữ mọi hành động thay đổi dữ liệu của hệ thống.

### 4. Other Domains
- **Document**: Quản lý file đính kèm lưu trên MinIO.
- **Notification**: Hệ thống thông báo.

---

## Core Algorithms & Services

### Critical Path Method (CPM)
Được triển khai thuần Python tại `app/utils/cpm.py`. Thuật toán bao gồm:
1. **Topological Sort (Kahn's Algorithm)**: Sắp xếp các task theo đồ thị có hướng không chu trình (DAG) và phát hiện vòng lặp (Cycle Detection).
2. **Forward Pass**: Tính toán Early Start (ES) và Early Finish (EF).
3. **Backward Pass**: Tính toán Late Start (LS), Late Finish (LF).
4. **Float Calculation**: Tính toán Float Days. Task có float = 0 sẽ được đánh dấu là `is_critical = True`.

Mỗi khi có thay đổi về ngày, thời lượng hoặc dependency của Task, `cpm_service` sẽ được gọi để tính toán lại và update database.

### Background Task (Celery + Redis)
Các tác vụ bất đồng bộ nặng được giao cho Celery worker:
- **`ai.generate_project`**: Dịch prompt người dùng thành cấu trúc dự án WBS thông qua OpenAI/Gemini, ghi trực tiếp vào DB.
- **`ai.impact_analysis`**: Đọc cấu trúc thay đổi, sinh ra báo cáo mức độ ảnh hưởng của CR.
- **`reports.generate_docx`**: Sử dụng `python-docx` tổng hợp dữ liệu, vẽ biểu đồ, upload lên MinIO và trả về URL tải xuống.
