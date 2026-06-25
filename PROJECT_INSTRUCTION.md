# PROJECT INSTRUCTION
## Hệ thống AI Project Planning & Portfolio Management

> Phiên bản: 1.0 | Cập nhật theo SOP v1.0

---

## 1. TỔNG QUAN DỰ ÁN

Xây dựng một **web application quản lý dự án thông minh** tích hợp AI, tương đương MS Project nhưng có thêm lớp AI tự động phân tích, đề xuất và tối ưu kế hoạch. Hệ thống phục vụ nhiều vai trò (multi-role) và quản lý theo cấu trúc phân cấp Portfolio → Project → Task.

### Mục tiêu cốt lõi

- Quản lý danh mục dự án (Portfolio & Project Management) theo chuẩn PMI/Agile lai
- Sinh kế hoạch dự án tự động từ prompt ngôn ngữ tự nhiên bằng AI (OpenAI/Gemini)
- Tính toán Critical Path (CPM), Topological Sort, Resource Leveling tự động
- Phân tích tác động thay đổi (Impact Analysis) và tối ưu lịch (Schedule Optimization) bằng AI
- Dashboard đa chiều: Gantt, Burndown, Burnup, Velocity, EVA, CPI, SPI
- Xuất báo cáo DOCX/XLSX, quản lý phiên bản dự án, audit log toàn diện

---

## 2. KIẾN TRÚC HỆ THỐNG

```
┌─────────────────────────────┐
│       React 18              │
│   Dashboard + Gantt + UI    │
└──────────────┬──────────────┘
               │ REST / WebSocket
               ▼
┌─────────────────────────────┐
│      FastAPI Backend        │
└──────┬────────┬─────────────┘
       │        │
  ┌────▼──┐ ┌──▼────┐  ┌──────────┐
  │  PG   │ │ Redis │  │  MinIO   │
  │  SQL  │ │ Cache │  │  Files   │
  └───────┘ └──┬────┘  └──────────┘
               │
           ┌───▼───┐
           │ Celery│  (Job Queue)
           └───┬───┘
               │
    ┌──────────▼──────────┐
    │   AI Provider Layer  │
    │  ├─ OpenAI (GPT-4o) │
    │  └─ Gemini Pro       │
    └─────────────────────┘
```

### Stack kỹ thuật

| Layer | Công nghệ |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Zustand, React Query |
| Backend | FastAPI (Python 3.11+), SQLAlchemy 2.0, Alembic |
| Database | PostgreSQL (primary), Redis (cache/session) |
| Storage | MinIO (S3-compatible, lưu BRD/SRS/deliverables) |
| Queue | Celery + Redis (xử lý AI job async) |
| AI | OpenAI GPT-4o / Google Gemini Pro (cấu hình per Admin) |
| Auth | JWT + Refresh Token, RBAC (python-jose, passlib) |
| Email | FastAPI-Mail / SendGrid |
| Export | python-docx, openpyxl (server-side generation) |

---

## 3. PHÂN CẤP CẤU TRÚC DỰ ÁN

```
Portfolio
└── Project
     ├── Phase
     ├── Sprint
     ├── Epic
     ├── Milestone
     └── Task
          └── SubTask
               ├── Dependencies (Finish-to-Start, etc.)
               ├── Assignments (nhân sự)
               ├── WorkLogs (giờ thực tế)
               └── Comments
```

---

## 4. HỆ THỐNG PHÂN QUYỀN (RBAC)

### Các Role và quyền hạn

| Role | Mô tả | Quyền chính |
|---|---|---|
| **Admin** | Quản trị hệ thống | Quản lý tài khoản, role, permission, AI Provider, audit log |
| **PM** | Project Manager | Tạo/quản lý Portfolio & Project, phân công resource, duyệt CR, rollback version, xuất báo cáo |
| **BA** | Business Analyst | Review & Approve Change Request, xem Impact Report, nhận thông báo |
| **PO** | Product Owner | Approve Change Request (nghiệp vụ), xem Impact Report, xem Dashboard |
| **Member** | Thành viên nhóm | Xem Task, Start/Stop Work, ghi WorkLog, upload Deliverable |
| **Customer** | Khách hàng | Tạo Change Request, theo dõi trạng thái, xem tiến độ |
| **Investor** | Nhà đầu tư | Chỉ xem Dashboard tổng quan (read-only) |

### Nguyên tắc phân quyền

- Permission được gán theo Role, không gán trực tiếp cho User
- Chỉ **PM** có quyền Apply thay đổi vào dự án
- Investor chỉ có quyền xem Dashboard — không có quyền thao tác bất kỳ
- Mọi thao tác đều được ghi vào Audit Log

---

## 5. CÁC QUY TRÌNH VẬN HÀNH (SOP)

### SOP-PM-001: Tạo dự án mới
**Người thực hiện:** PM

Luồng: PM → Tạo dự án → Nhập thông tin cơ bản → Upload BRD/SRS (tùy chọn) → Lưu dự án → Ghi Audit Log

**Dữ liệu đầu vào bắt buộc:**
- Tên dự án, Mô tả, Ngày bắt đầu, Ngày kết thúc dự kiến, Ngân sách, Thành viên

**Kết quả:** Dự án được tạo, Audit Log ghi nhận

---

### SOP-AI-001: AI Project Generator
**Người thực hiện:** PM

```
PM nhập Prompt ("Tạo dự án website bán hàng")
  → Chỉnh sửa prompt nếu cần
  → Gửi tới AI Engine (OpenAI/Gemini)
  → AI trả về JSON có cấu trúc:
     { phases[], sprints[], epics[], tasks[], dependencies[], milestones[] }
  → Backend validate + parse JSON
  → Sinh Phase, Sprint, Epic, Task, Dependency, Milestone vào DB
  → Tính toán lịch dựa trên working hours
  → Render Gantt Chart
```

**JSON schema AI phải trả về:**
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

### SOP-RM-001: Resource Assignment
**Người thực hiện:** PM

```
PM chọn Task
  → Yêu cầu AI đề xuất nhân sự
  → AI đánh giá: Skill match, Level, Cost/hour, Availability, Leave schedule
  → AI đề xuất danh sách nhân sự phù hợp (có ranking)
  → PM xem xét, duyệt và giao việc
  → Hệ thống kiểm tra Resource Leveling
```

---

### SOP-PM-002: Time Tracking
**Người thực hiện:** Member

```
Member → Start Work (timestamp ghi nhận)
       → Thực hiện công việc
       → Stop Work (timestamp ghi nhận)
       → Ghi nhận WorkLog (start_time, end_time, actual_hours)
       → Actual Hours được cập nhật lên Task
```

---

### SOP-CR-001 & SOP-CR-002: Change Request & Approval Workflow
**Người khởi tạo:** Customer

```
Customer tạo Change Request
  → BA Review → Approve hoặc Reject
      → (nếu Approve) PO Review → Approve hoặc Reject
          → (nếu Approve) AI Impact Analysis tự động chạy
              → PM Review Impact Report → Approve hoặc Reject
                  → (nếu Approve) AI Schedule Optimization
                      → PM xác nhận kết quả tối ưu
                          → Tạo Version Snapshot
                              → Apply thay đổi vào dự án
```

**Điều kiện cứng:** Chỉ PM được bấm Apply. Tất cả bước trước đó phải Approve đầy đủ.

---

### SOP-AI-002: AI Impact Analysis
**Kích hoạt:** Tự động sau khi PO Approve Change Request

AI phân tích và xác định:
- Danh sách Task bị ảnh hưởng
- Sprint bị ảnh hưởng
- Milestone có nguy cơ trễ
- Resource bị ảnh hưởng
- Sinh Impact Report (lưu DB, hiển thị cho BA/PO/PM)

---

### SOP-AI-003: Schedule Optimization
**Kích hoạt:** PM Approve Change Request

```
AI tính lại:
  - Dependency chain
  - Critical Path (CPM)
  - Resource Allocation (leveling)
  - Milestone dates
→ Sinh kế hoạch mới (đề xuất)
→ PM xem xét và xác nhận
→ Apply kế hoạch mới
```

---

### SOP-PM-003: Critical Path Method (CPM)
**Thuật toán:**

```
1. Topological Sort (loại bỏ vòng tròn dependency)
2. Forward Pass: tính ES (Earliest Start), EF (Earliest Finish)
3. Backward Pass: tính LF (Latest Finish), LS (Latest Start)
4. Slack = LS - ES hoặc LF - EF
5. Critical Path = chuỗi Task có Slack = 0
```

**Output hiển thị:** ES, EF, LS, LF, Float cho mỗi Task. Critical Path highlight đỏ trên Gantt.

**Trigger tự động:** Khi PM kéo thả thay đổi thời gian Task → hệ thống recalculate toàn bộ downstream tasks.

---

### SOP-AI-004: Resource Leveling (Kiểm tra quá tải)
**Kích hoạt:** Mỗi khi Task được assign cho một nhân sự

```
Khi assign Task:
  → Kiểm tra tổng giờ làm trong ngày/tuần của nhân sự
  → Kiểm tra lịch nghỉ phép (leaves)
  → Kiểm tra các Task đang thực hiện
  → Nếu vượt ngưỡng (8h/ngày hoặc cấu hình):
      → Hiển thị cảnh báo đỏ
      → AI đề xuất: đổi người / dời lịch Task
```

---

### SOP-DOC-001: Document Management
**Tài liệu:** BRD, SRS, Deliverables

```
Upload File → Lưu MinIO → Liên kết với Project
           → AI đọc nội dung tài liệu
           → Tự động gợi ý sinh Task từ BRD/SRS
```

---

### SOP-PM-004 & SOP-PM-005: Project Versioning & Rollback
**Versioning kích hoạt khi:**
- Apply Change Request
- AI tối ưu kế hoạch được apply
- PM tạo Baseline thủ công

**Rollback:**
```
PM chọn Version → Xem diff thay đổi → Xác nhận Rollback
→ Khôi phục: Phase, Sprint, Epic, Task, Dependency, Milestone
```

---

### SOP-AUD-001: Audit Tracking
**Kích hoạt:** Mọi thao tác hệ thống

Mỗi audit record lưu: Người thực hiện, Timestamp, Hành động, Entity bị tác động, Giá trị cũ (JSON), Giá trị mới (JSON)

---

### SOP-NOTI-001: Notification
**Kích hoạt bởi:**
- Change Request mới
- Approval (bất kỳ bước nào)
- Critical Path thay đổi
- Resource quá tải
- AI phát hiện rủi ro (Risk Score: High / Critical)

**Kênh:** Email (NodeMailer/SendGrid). Mở rộng sau: In-app notification.

**Người nhận:** PM, BA, PO, và các Member liên quan đến phần bị ảnh hưởng.

---

### SOP-RPT-001: Project Reporting
**Xuất file:** DOCX, XLSX

**Nội dung báo cáo:**
- Tiến độ tổng quan (% hoàn thành)
- CPI (Cost Performance Index)
- SPI (Schedule Performance Index)
- EVA (Earned Value Analysis)
- Burndown Chart, Burnup Chart, Velocity Chart
- Resource Utilization
- ROI, Cost Variance, Schedule Variance

---

### SOP-DB-001: Dashboard
**Loại biểu đồ:**
- Gantt Chart (có drag & drop)
- Burndown / Burnup Chart
- Velocity Chart
- Resource Utilization Heatmap
- CPI / SPI / EVA metrics
- Pie Chart (phân bổ task theo trạng thái)

**Phân quyền xem Dashboard:**
- PM, BA, PO, Member: xem đầy đủ theo phạm vi
- Investor: chỉ xem Dashboard tổng quan Portfolio (read-only)

---

### SOP-AI-005: AI Risk Analysis
**AI đánh giá định kỳ hoặc khi có thay đổi:**
- Trễ tiến độ
- Quá tải nhân sự
- Thiếu nhân lực
- Vượt ngân sách
- Milestone nguy cơ trễ

**Output:** Risk Score → Low / Medium / High / Critical

**Thông báo:** Gửi Email cho PM, BA, PO khi Risk Score ≥ High

---

## 6. CẤU TRÚC THƯ MỤC

### Backend (FastAPI)
```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/
│   │       │   ├── auth.py             # JWT, refresh token, login, logout
│   │       │   ├── users.py            # CRUD user, profile
│   │       │   ├── roles.py            # Role management
│   │       │   ├── permissions.py      # Permission management
│   │       │   ├── portfolios.py       # Portfolio CRUD
│   │       │   ├── projects.py         # Project CRUD + versioning
│   │       │   ├── phases.py           # Phase management
│   │       │   ├── sprints.py          # Sprint management
│   │       │   ├── epics.py            # Epic management
│   │       │   ├── milestones.py       # Milestone tracking
│   │       │   ├── tasks.py            # Task CRUD + CPM trigger
│   │       │   ├── subtasks.py         # SubTask management
│   │       │   ├── dependencies.py     # Task dependency graph
│   │       │   ├── assignments.py      # Resource assignment
│   │       │   ├── worklogs.py         # Time tracking
│   │       │   ├── leaves.py           # Leave management
│   │       │   ├── skills.py           # Skill catalog
│   │       │   ├── documents.py        # BRD/SRS upload & AI parse
│   │       │   ├── approvals.py        # Approval workflow
│   │       │   ├── change_requests.py  # CR management
│   │       │   ├── gantt.py            # Gantt data API
│   │       │   ├── dashboards.py       # Dashboard data aggregation
│   │       │   ├── reports.py          # Report generation (docx/xlsx)
│   │       │   ├── notifications.py    # Notification management
│   │       │   ├── audit.py            # Audit log
│   │       │   ├── versions.py         # Version snapshot & rollback
│   │       │   └── system.py           # System config, health check
│   │       └── router.py               # Router aggregation
│   ├── core/
│   │   ├── config.py                   # Settings, env vars
│   │   ├── security.py                 # JWT, password hashing
│   │   ├── dependencies.py             # Dependency injection
│   │   └── exceptions.py               # Custom exceptions
│   ├── db/
│   │   ├── base.py                     # SQLAlchemy Base
│   │   ├── session.py                  # Database session
│   │   └── init_db.py                  # DB initialization
│   ├── models/                         # SQLAlchemy models
│   │   ├── user.py
│   │   ├── project.py
│   │   ├── task.py
│   │   └── ...
│   ├── schemas/                        # Pydantic schemas (request/response)
│   │   ├── user.py
│   │   ├── project.py
│   │   ├── task.py
│   │   └── ...
│   ├── crud/                           # CRUD operations
│   │   ├── user.py
│   │   ├── project.py
│   │   ├── task.py
│   │   └── ...
│   ├── services/                       # Business logic
│   │   ├── auth_service.py
│   │   ├── cpm_service.py              # Critical Path engine
│   │   ├── resource_leveling.py        # Overload detection
│   │   ├── email_service.py            # Email service
│   │   ├── ai/
│   │   │   ├── base.py                 # Abstract AI provider
│   │   │   ├── openai_provider.py      # OpenAI integration
│   │   │   ├── gemini_provider.py      # Gemini integration
│   │   │   ├── project_generator.py    # SOP-AI-001
│   │   │   ├── risk_analysis.py        # SOP-AI-005
│   │   │   ├── impact_analysis.py      # SOP-AI-002
│   │   │   ├── resource_recommendation.py # SOP-RM-001
│   │   │   ├── schedule_optimization.py   # SOP-AI-003
│   │   │   └── document_parser.py      # SOP-DOC-001
│   │   └── minio_service.py            # MinIO file storage
│   ├── utils/                          # Utility functions
│   │   ├── cpm_algorithm.py            # CPM core algorithm
│   │   ├── date_utils.py               # Date helpers
│   │   └── constants.py                # Enums, constants
│   ├── middleware/                     # Custom middleware
│   │   ├── auth.py                     # Auth middleware
│   │   └── logging.py                  # Request logging
│   ├── tasks/                          # Celery tasks (async jobs)
│   │   ├── ai_tasks.py                 # AI processing tasks
│   │   ├── email_tasks.py              # Email sending tasks
│   │   └── report_tasks.py             # Report generation tasks
│   └── main.py                         # FastAPI app entry point
├── alembic/                            # Database migrations
│   ├── versions/                       # Migration files
│   └── env.py
├── tests/                              # Test suite
│   ├── api/
│   ├── services/
│   └── utils/
├── requirements.txt                    # Python dependencies
├── .env.example                        # Environment variables template
└── Dockerfile
```

### Frontend (React + Vite)
```
frontend/
├── src/
│   ├── features/
│   │   ├── auth/               # Login, register, reset password
│   │   ├── dashboard/          # Portfolio & Project dashboards
│   │   ├── portfolio/          # Portfolio management
│   │   ├── projects/           # Project management
│   │   ├── gantt/              # Gantt Chart + drag & drop
│   │   ├── phases/             # Phase management UI
│   │   ├── sprints/            # Sprint board UI
│   │   ├── epics/              # Epic management UI
│   │   ├── milestones/         # Milestone tracker
│   │   ├── tasks/              # Task management
│   │   ├── resources/          # Resource management UI
│   │   ├── documents/          # BRD/SRS upload & viewer
│   │   ├── approvals/          # CR & approval workflow UI
│   │   ├── reports/            # Report export UI
│   │   ├── audit/              # Audit timeline view
│   │   ├── versions/           # Version history & rollback UI
│   │   └── ai/                 # AI prompt input, AI result viewer
│   ├── components/
│   │   ├── gantt/              # Gantt Chart component
│   │   ├── charts/             # Burndown, Burnup, Velocity, Pie, Heatmap
│   │   ├── tables/             # Data tables
│   │   ├── dialogs/            # Modal dialogs
│   │   ├── forms/              # Form components
│   │   └── common/             # Button, Badge, Alert, etc.
│   ├── services/               # API call services (axios)
│   │   ├── api.ts              # Axios instance
│   │   ├── authService.ts
│   │   ├── projectService.ts
│   │   └── ...
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useProjects.ts
│   │   └── ...
│   ├── store/                  # Zustand global state
│   │   ├── authStore.ts
│   │   ├── projectStore.ts
│   │   └── ...
│   ├── types/                  # TypeScript interfaces
│   │   ├── user.types.ts
│   │   ├── project.types.ts
│   │   └── ...
│   ├── utils/                  # Utility functions
│   │   ├── date.utils.ts
│   │   ├── format.utils.ts
│   │   └── ...
│   ├── router/                 # React Router configuration
│   │   └── index.tsx
│   ├── App.tsx                 # Main App component
│   └── main.tsx                # Entry point
├── public/                     # Static assets
├── index.html                  # HTML template
├── package.json                # Node dependencies
├── tsconfig.json               # TypeScript config
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS config
├── .env.example                # Environment variables template
└── Dockerfile
```

---

## 7. DATABASE SCHEMA (ERD lõi)

**Giai đoạn 1: ~48–55 bảng.**

### Nhóm bảng chính

```
User Domain:
  users, roles, permissions, role_permissions, user_roles, user_skills, skills, leaves

Project Domain:
  portfolios, projects, phases, sprints, epics, milestones,
  tasks, subtasks, task_dependencies, assignments, worklogs, comments

Document Domain:
  documents (type: BRD | SRS | DELIVERABLE)

Change & Approval Domain:
  change_requests, approvals, impact_reports, audit_logs

Version Domain:
  project_versions, project_snapshots

AI Domain:
  ai_requests, ai_outputs, risk_reports, optimization_reports

Notification Domain:
  notifications, email_logs
```

### Key fields cho Tasks (phục vụ CPM)
```python
# SQLAlchemy model example
class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    phase_id = Column(Integer, ForeignKey("phases.id"), nullable=True)
    sprint_id = Column(Integer, ForeignKey("sprints.id"), nullable=True)
    epic_id = Column(Integer, ForeignKey("epics.id"), nullable=True)
    
    name = Column(String)
    description = Column(Text)
    status = Column(Enum(TaskStatus))
    
    estimated_hours = Column(Float)
    actual_hours = Column(Float)
    
    planned_start = Column(DateTime)
    planned_end = Column(DateTime)
    actual_start = Column(DateTime, nullable=True)
    actual_end = Column(DateTime, nullable=True)
    
    # CPM fields
    es = Column(Float)  # Earliest Start
    ef = Column(Float)  # Earliest Finish
    ls = Column(Float)  # Latest Start
    lf = Column(Float)  # Latest Finish
    float_time = Column(Float)  # Slack/Float
    is_critical = Column(Boolean, default=False)
    
    priority = Column(Enum(TaskPriority))
    story_points = Column(Integer, nullable=True)

class TaskDependency(Base):
    __tablename__ = "task_dependencies"
    
    id = Column(Integer, primary_key=True)
    from_task_id = Column(Integer, ForeignKey("tasks.id"))
    to_task_id = Column(Integer, ForeignKey("tasks.id"))
    dep_type = Column(Enum(DependencyType))  # FS, SS, FF, SF
    lag_hours = Column(Float, default=0)
```

---

## 8. THUẬT TOÁN CỐT LÕI

### Critical Path Method (CPM)

```python
# utils/cpm_algorithm.py

from typing import List, Dict, Tuple
from collections import defaultdict, deque

def topological_sort(tasks: List[Dict], dependencies: List[Dict]) -> List[Dict]:
    """Kahn's algorithm for topological sorting"""
    graph = defaultdict(list)
    in_degree = defaultdict(int)
    
    for dep in dependencies:
        graph[dep['from_task_id']].append(dep['to_task_id'])
        in_degree[dep['to_task_id']] += 1
    
    queue = deque([task['id'] for task in tasks if in_degree[task['id']] == 0])
    sorted_tasks = []
    
    while queue:
        task_id = queue.popleft()
        sorted_tasks.append(task_id)
        
        for successor in graph[task_id]:
            in_degree[successor] -= 1
            if in_degree[successor] == 0:
                queue.append(successor)
    
    return sorted_tasks

def forward_pass(tasks: Dict, dependencies: List[Dict]) -> None:
    """Calculate ES (Earliest Start) and EF (Earliest Finish)"""
    for task_id in topological_sort(list(tasks.values()), dependencies):
        task = tasks[task_id]
        
        # Find max EF of predecessors
        predecessors = [dep for dep in dependencies if dep['to_task_id'] == task_id]
        if predecessors:
            task['es'] = max(
                tasks[dep['from_task_id']]['ef'] + dep.get('lag_hours', 0)
                for dep in predecessors
            )
        else:
            task['es'] = 0  # or project start date
        
        task['ef'] = task['es'] + task['estimated_hours']

def backward_pass(tasks: Dict, dependencies: List[Dict]) -> None:
    """Calculate LS (Latest Start) and LF (Latest Finish)"""
    sorted_ids = topological_sort(list(tasks.values()), dependencies)
    
    # Initialize LF for tasks with no successors
    max_ef = max(task['ef'] for task in tasks.values())
    for task_id in sorted_ids:
        task = tasks[task_id]
        successors = [dep for dep in dependencies if dep['from_task_id'] == task_id]
        if not successors:
            task['lf'] = max_ef
    
    # Backward pass
    for task_id in reversed(sorted_ids):
        task = tasks[task_id]
        successors = [dep for dep in dependencies if dep['from_task_id'] == task_id]
        
        if successors:
            task['lf'] = min(
                tasks[dep['to_task_id']]['ls'] - dep.get('lag_hours', 0)
                for dep in successors
            )
        
        task['ls'] = task['lf'] - task['estimated_hours']

def calculate_critical_path(tasks: Dict, dependencies: List[Dict]) -> List[int]:
    """Calculate Critical Path and identify critical tasks"""
    forward_pass(tasks, dependencies)
    backward_pass(tasks, dependencies)
    
    critical_tasks = []
    for task_id, task in tasks.items():
        task['float'] = task['ls'] - task['es']
        task['is_critical'] = abs(task['float']) < 0.01  # floating point tolerance
        
        if task['is_critical']:
            critical_tasks.append(task_id)
    
    return critical_tasks
```

### Trigger tự động

Khi PM kéo thả Task trên Gantt → `recalculateCPM(projectId)` → Cập nhật ES/EF/LS/LF cho tất cả Task downstream → Re-render Gantt với Critical Path highlight.

### Resource Leveling

```python
def check_resource_overload(user_id: int, date: datetime.date, max_hours: float = 8.0) -> Dict:
    """
    Check if a user is overloaded on a specific date
    Returns: {is_overloaded: bool, total_hours: float, tasks: List}
    """
    # Get all assignments for user on that date
    assignments = db.query(Assignment).filter(
        Assignment.user_id == user_id,
        Assignment.status == 'active'
    ).all()
    
    total_hours = 0
    tasks_on_date = []
    
    for assignment in assignments:
        task = assignment.task
        if task.planned_start <= date <= task.planned_end:
            # Calculate daily allocation
            daily_hours = assignment.allocated_hours / (
                (task.planned_end - task.planned_start).days + 1
            )
            total_hours += daily_hours
            tasks_on_date.append({
                'task_id': task.id,
                'task_name': task.name,
                'allocated_hours': daily_hours
            })
    
    # Check leaves
    leave = db.query(Leave).filter(
        Leave.user_id == user_id,
        Leave.start_date <= date,
        Leave.end_date >= date,
        Leave.status == 'approved'
    ).first()
    
    if leave:
        return {
            'is_overloaded': True,
            'reason': 'on_leave',
            'total_hours': 0,
            'tasks': []
        }
    
    return {
        'is_overloaded': total_hours > max_hours,
        'total_hours': total_hours,
        'max_hours': max_hours,
        'tasks': tasks_on_date
    }
```

---

## 9. LUỒNG AI (BPMN)

### BPMN 1 — AI Project Generator (SOP-AI-001)
```
PM (prompt) → AI Engine → JSON response → Backend validate
→ Tạo Phase/Sprint/Epic/Task/Dependency/Milestone
→ Chạy CPM → Render Gantt
```

### BPMN 2 — Change Request (SOP-CR-001 + SOP-CR-002 + SOP-AI-002 + SOP-AI-003)
```
Customer (CR) → BA Approve → PO Approve
→ AI Impact Analysis (auto)
→ PM Review → PM Approve
→ AI Schedule Optimization (auto)
→ PM Confirm → Version Snapshot → Apply
```

### BPMN 3 — Resource Assignment (SOP-RM-001 + SOP-AI-004)
```
PM (chọn Task) → AI Recommendation (Skill/Availability/Leave/Cost/Workload)
→ PM Approve → Assignment Created
→ Resource Leveling Check → Alert nếu overload
```

---

## 10. API ENDPOINTS (cấu trúc tham khảo)

```
POST   /api/auth/login
POST   /api/auth/refresh

GET    /api/portfolios
POST   /api/portfolios
GET    /api/portfolios/:id/projects

POST   /api/projects
GET    /api/projects/:id
GET    /api/projects/:id/gantt
POST   /api/projects/:id/ai/generate       ← SOP-AI-001
GET    /api/projects/:id/cpm               ← SOP-PM-003
GET    /api/projects/:id/versions
POST   /api/projects/:id/rollback/:versionId ← SOP-PM-005

GET    /api/tasks/:id
PATCH  /api/tasks/:id                      ← triggers CPM recalc
POST   /api/tasks/:id/assign
GET    /api/tasks/:id/ai/recommend-resource ← SOP-RM-001

POST   /api/change-requests
PATCH  /api/change-requests/:id/approve    ← BA/PO/PM
GET    /api/change-requests/:id/impact     ← SOP-AI-002
POST   /api/change-requests/:id/optimize   ← SOP-AI-003

GET    /api/projects/:id/dashboard
GET    /api/projects/:id/reports/export?format=docx|xlsx

GET    /api/audit-logs?projectId=:id
```

---

## 11. QUY TẮC PHÁT TRIỂN

### General

- Backend viết bằng **Python 3.11+** với type hints đầy đủ
- Frontend viết bằng **TypeScript** hoàn toàn
- Tất cả API response theo chuẩn: `{ success, data, message, meta }`
- Mọi thao tác ghi DB phải có entry trong `audit_logs`
- AI job chạy qua **Celery** (async), không block request
- File upload phải qua MinIO, không lưu local

### Backend (FastAPI)

- Kiến trúc phân lớp rõ ràng: API Layer → Service Layer → CRUD Layer → Model Layer
- Dùng **SQLAlchemy 2.0** (async) cho tất cả DB access
- Validate input bằng **Pydantic V2** models
- Authentication: JWT với `python-jose`, password hashing với `passlib[bcrypt]`
- Dependencies injection qua FastAPI's `Depends()`
- CPM algorithm đặt trong `app/utils/cpm_algorithm.py` — pure function, dễ test
- Async/await cho mọi I/O operations
- Migration quản lý bằng **Alembic**

### Frontend (React + Vite)

- Component structure: Functional components + hooks
- State management: Zustand cho global, React Query cho server state
- Routing: React Router v6
- Gantt Chart: tự build hoặc dùng `dhtmlx-gantt` / `frappe-gantt` (customize)
- Drag & drop: `@dnd-kit/core`
- Charts: `recharts` hoặc `chart.js`
- API calls: `axios` với interceptors (auth token, error handling)
- Mọi action thay đổi dữ liệu phải có optimistic update + rollback nếu lỗi

### AI Provider

- Abstract interface `BaseAIProvider` → `OpenAIProvider` / `GeminiProvider`
- Admin cấu hình provider active trong DB
- Retry 3 lần với exponential backoff khi AI timeout
- Lưu mọi AI request/response vào `ai_requests`, `ai_outputs` (phục vụ debug & audit)
- Chạy AI tasks qua Celery workers để tránh block main thread

---

## 12. GIAI ĐOẠN PHÁT TRIỂN (ROADMAP)

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

## 13. ĐỊNH NGHĨA THUẬT NGỮ

| Thuật ngữ | Ý nghĩa |
|---|---|
| CPM | Critical Path Method — phương pháp đường găng |
| ES/EF | Earliest Start / Earliest Finish |
| LS/LF | Latest Start / Latest Finish |
| Float/Slack | Thời gian dự trữ của Task (=0 là critical) |
| EVA | Earned Value Analysis |
| CPI | Cost Performance Index = EV/AC |
| SPI | Schedule Performance Index = EV/PV |
| CR | Change Request |
| BRD | Business Requirements Document |
| SRS | Software Requirements Specification |
| BA | Business Analyst |
| PO | Product Owner |
| PM | Project Manager |
| Resource Leveling | Cân bằng tải nhân sự, tránh overload |

---

*Instruction này được tổng hợp từ yêu cầu của người dùng kết hợp với SOP – QUY TRÌNH VẬN HÀNH HỆ THỐNG AI PROJECT PLANNING & PORTFOLIO MANAGEMENT v1.0*
