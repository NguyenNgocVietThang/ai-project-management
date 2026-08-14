# Roadmap: Portfolio & Project Core Module

> **Phiên bản:** 1.0 | **Cập nhật:** 2026-08-13
> **Mức độ ưu tiên:** Critical – Module cốt lõi của hệ thống
> **Điều kiện tiên quyết:** [x] Auth Module Phase 1–5 đã hoàn thiện (JWT, RBAC, OAuth, Email Verification, Profile Settings)

---

## Tổng quan

Module này xây dựng toàn bộ lớp **quản lý danh mục và dự án** — nền tảng của mọi tính năng nghiệp vụ trong hệ thống. Bao gồm:

- CRUD Portfolio, Project, Phase, Sprint, Epic, Milestone
- Phân quyền RBAC theo từng dự án (PM, BA, PO, Member, Customer)
- Task Management với quan hệ phụ thuộc (Dependencies)
- Phân công nhân sự (Assignments), ghi giờ thực tế (WorkLog)
- Dashboard tổng quan Project + Portfolio

---

## Đã có sau khi hoàn thiện Auth Module

| Thành phần | Trạng thái |
|---|---|
| User model + RBAC (roles, permissions) | Có sẵn |
| JWT Auth middleware, Route protection guard | Có sẵn |
| DB schema: portfolios, projects, phases, sprints, epics, milestones, tasks, subtasks, dependencies, assignments, worklogs | Migrations đã có |
| FastAPI skeleton endpoints | Có sẵn |
| Seed data (7 roles, 34 permissions, admin user) | Có sẵn |
| Frontend Auth & Services structure | Có sẵn |

---

## Cần triển khai

| Tính năng | Độ ưu tiên | Phase |
|---|---|---|
| Portfolio CRUD API + UI | Critical | Phase 1 |
| Project CRUD API + UI | Critical | Phase 1 |
| Project Member Management (invite, role assign) | Critical | Phase 1 |
| Phase / Sprint / Epic / Milestone CRUD | High | Phase 2 |
| Task CRUD + Subtask | Critical | Phase 2 |
| Task Dependencies (FS, SS, FF, SF) | Critical | Phase 2 |
| Assignment (phân công Task cho Member) | High | Phase 2 |
| WorkLog (ghi giờ thực tế) | High | Phase 2 |
| Dashboard: Portfolio Overview | High | Phase 3 |
| Dashboard: Project Overview | High | Phase 3 |
| In-app Notifications (13 events) | Medium | Phase 3 |
| Audit Log viewer | Medium | Phase 3 |

---

## Kế hoạch thực hiện theo Phase

---

## PHASE 1 – Portfolio & Project CRUD

> **Mục tiêu:** PM có thể tạo Portfolio, tạo Project, mời thành viên vào dự án với role cụ thể
>
> **Trạng thái:** ✅ Hoàn thành và xác minh ngày 13/08/2026

---

### 1.1 – Portfolio Management

#### Backend

**[MODIFY] `backend/app/api/v1/endpoints/portfolios.py`**
```python
@router.get("/", response_model=list[PortfolioResponse])
# Trả danh sách Portfolio của user hiện tại
# - Admin: thấy tất cả
# - PM: chỉ thấy portfolio mình quản lý

@router.post("/", response_model=PortfolioResponse, status_code=201)
# Tạo Portfolio mới (chỉ PM + Admin)
# Input: { name, description, start_date, end_date, budget }

@router.get("/{portfolio_id}", response_model=PortfolioResponse)
# Chi tiết 1 Portfolio + danh sách Project bên trong

@router.patch("/{portfolio_id}", response_model=PortfolioResponse)
# Cập nhật Portfolio (owner hoặc Admin)

@router.delete("/{portfolio_id}", status_code=204)
# Xóa Portfolio (Admin only hoặc PM owner, cascade soft-delete)
```

**[NEW] `backend/app/services/portfolio_service.py`**
```python
class PortfolioService:
    async def get_portfolios(user: User, db: AsyncSession) -> list[Portfolio]
    async def create_portfolio(data: PortfolioCreate, owner: User, db: AsyncSession) -> Portfolio
    async def get_portfolio_by_id(id: UUID, user: User, db: AsyncSession) -> Portfolio
    async def update_portfolio(id: UUID, data: PortfolioUpdate, user: User, db: AsyncSession) -> Portfolio
    async def delete_portfolio(id: UUID, user: User, db: AsyncSession) -> None
    # Ghi Audit Log sau mỗi thao tác
```

**[NEW] `backend/app/schemas/portfolio.py`**
```python
class PortfolioCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=200)
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    budget: Optional[Decimal] = None

class PortfolioUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    budget: Optional[Decimal] = None
    status: Optional[str] = None  # active | archived

class PortfolioResponse(BaseModel):
    id: UUID
    name: str
    description: Optional[str]
    start_date: Optional[date]
    end_date: Optional[date]
    budget: Optional[Decimal]
    status: str
    owner_id: UUID
    project_count: int
    created_at: datetime
```

#### Frontend

**[NEW] `frontend/src/app/(dashboard)/portfolios/page.tsx`**
```
- Portfolio list page (grid cards hoặc table view)
- Mỗi card: tên, số project, budget, status, progress bar
- Button "New Portfolio" -> mở modal/form
- Filter: status (active/archived), search by name
```

**[NEW] `frontend/src/app/(dashboard)/portfolios/[id]/page.tsx`**
```
- Portfolio detail page
- Header: tên, description, budget, timeline
- Tab "Projects" -> danh sách project con
- Tab "Overview" -> metrics tổng hợp
- Breadcrumb: Home > Portfolios > {portfolio_name}
```

**[NEW] `frontend/src/features/portfolios/`**
```
components/
  PortfolioCard.tsx         – Card hiển thị 1 portfolio
  PortfolioForm.tsx         – Form tạo/cập nhật portfolio (react-hook-form + zod)
  PortfolioList.tsx         – Grid/Table danh sách
  DeletePortfolioDialog.tsx – Confirm delete
hooks/
  usePortfolios.ts          – useQuery list, useMutation create/update/delete
services/
  portfolio.service.ts      – API calls (GET, POST, PATCH, DELETE)
types/
  portfolio.types.ts        – TypeScript interfaces
```

---

### 1.2 – Project Management

#### Backend

**[MODIFY] `backend/app/api/v1/endpoints/projects.py`**
```python
@router.get("/", response_model=list[ProjectSummaryResponse])
# Danh sách project theo portfolio hoặc của user
# Query params: ?portfolio_id=, ?status=, ?search=

@router.post("/", response_model=ProjectResponse, status_code=201)
# Tạo project mới
# Input: { name, description, portfolio_id, start_date, end_date, budget, methodology }
# methodology: "agile" | "waterfall" | "hybrid"

@router.get("/{project_id}", response_model=ProjectDetailResponse)
# Chi tiết project + phases, milestones, thống kê task

@router.patch("/{project_id}", response_model=ProjectResponse)
# Cập nhật project (PM owner)

@router.delete("/{project_id}", status_code=204)
# Soft delete project

@router.get("/{project_id}/members", response_model=list[ProjectMemberResponse])
# Danh sách thành viên + role

@router.post("/{project_id}/members", response_model=ProjectMemberResponse, status_code=201)
# Mời thành viên vào project
# Input: { user_id, role_id }
# Gửi thông báo email cho user được mời

@router.delete("/{project_id}/members/{user_id}", status_code=204)
# Xóa thành viên khỏi project
```

**[NEW] `backend/app/services/project_service.py`**
```python
class ProjectService:
    async def get_projects(user, filters, db) -> list[Project]
    async def create_project(data: ProjectCreate, owner: User, db) -> Project
    async def get_project_detail(id: UUID, user: User, db) -> ProjectDetail
    async def update_project(id: UUID, data: ProjectUpdate, user: User, db) -> Project
    async def delete_project(id: UUID, user: User, db) -> None
    async def add_member(project_id, user_id, role_id, inviter: User, db) -> ProjectMember
    async def remove_member(project_id, user_id, actor: User, db) -> None
    async def get_project_stats(project_id: UUID, db) -> ProjectStats
    # Tất cả thao tác ghi AuditLog
```

**[NEW] `backend/app/schemas/project.py`**
```python
class ProjectCreate(BaseModel):
    name: str
    description: Optional[str]
    portfolio_id: Optional[UUID]
    start_date: date
    end_date: date
    budget: Optional[Decimal]
    methodology: str = "agile"  # agile | waterfall | hybrid

class ProjectDetailResponse(BaseModel):
    id: UUID
    name: str
    description: Optional[str]
    status: str
    methodology: str
    start_date: date
    end_date: date
    budget: Optional[Decimal]
    budget_spent: Decimal
    progress_percent: float
    task_count: int
    completed_task_count: int
    member_count: int
    owner: UserSummary
    phases: list[PhaseSummary]
    milestones: list[MilestoneSummary]
    created_at: datetime
```

**Dependency injection helper:**
```python
# backend/app/api/dependencies/project_access.py
async def get_project_member(project_id, current_user, db) -> ProjectMember
# Đảm bảo user có quyền truy cập project, raise 403 nếu không
```

#### Frontend

**[NEW] `frontend/src/app/(dashboard)/projects/page.tsx`**
```
- All Projects list (cross-portfolio view)
- Card/Table toggle
- Filter: portfolio, status, methodology, date range
- "New Project" button -> wizard form (3 steps: Basic Info -> Members -> Review)
```

**[NEW] `frontend/src/app/(dashboard)/projects/[id]/page.tsx`** (Project Detail shell)
```
Layout:
  - Left sidebar: project nav (Overview, Tasks, Gantt, Members, Settings)
  - Main area: route outlet theo tab đang chọn
```

**[NEW] `frontend/src/app/(dashboard)/projects/[id]/overview/page.tsx`**
```
- Project header: name, status badge, methodology chip, timeline progress bar
- Stats cards: Tasks total/done, Budget used/total, Members, Days remaining
- Recent activity feed (audit log)
- Milestones timeline (horizontal)
```

**[NEW] `frontend/src/app/(dashboard)/projects/[id]/members/page.tsx`**
```
- Members table: avatar, name, role, joined_at, action (remove)
- "Invite Member" button -> search user modal -> assign role -> confirm
```

**[NEW] `frontend/src/features/projects/`**
```
components/
  ProjectCard.tsx
  ProjectForm.tsx            – Multi-step wizard
  ProjectWizardStep1.tsx     – Basic info
  ProjectWizardStep2.tsx     – Add initial members
  ProjectWizardStep3.tsx     – Review & create
  ProjectMembersTable.tsx
  InviteMemberDialog.tsx
  ProjectStatusBadge.tsx
hooks/
  useProjects.ts
  useProjectDetail.ts
  useProjectMembers.ts
services/
  project.service.ts
types/
  project.types.ts
```

---

## PHASE 2 – Task Management & Work Breakdown Structure

> **Mục tiêu:** PM có thể phân rã dự án thành Phase/Sprint/Task/Subtask, thiết lập Dependencies, phân công nhân sự
>
> **Trạng thái:** ✅ Hoàn thành và xác minh ngày 15/08/2026

---

### 2.1 – Phase / Sprint / Epic / Milestone CRUD

#### Backend

**[MODIFY] `backend/app/api/v1/endpoints/phases.py`**
```python
@router.get("/projects/{project_id}/phases")     # Danh sách phases
@router.post("/projects/{project_id}/phases")    # Tạo phase
@router.patch("/phases/{phase_id}")              # Cập nhật
@router.delete("/phases/{phase_id}")             # Xóa (cascade tasks)
```

**[NEW] `backend/app/api/v1/endpoints/sprints.py`**
```python
@router.get("/phases/{phase_id}/sprints")
@router.post("/phases/{phase_id}/sprints")       # Input: {name, start_date, end_date, goal}
@router.patch("/sprints/{sprint_id}")
@router.delete("/sprints/{sprint_id}")
@router.post("/sprints/{sprint_id}/start")       # Chuyển sprint -> active
@router.post("/sprints/{sprint_id}/complete")    # Chuyển sprint -> completed
```

**[NEW] `backend/app/api/v1/endpoints/milestones.py`**
```python
@router.get("/projects/{project_id}/milestones")
@router.post("/projects/{project_id}/milestones") # Input: {name, due_date, description}
@router.patch("/milestones/{milestone_id}")
@router.delete("/milestones/{milestone_id}")
@router.post("/milestones/{milestone_id}/complete")
```

**[NEW] `backend/app/services/wbs_service.py`**
```python
class WBSService:
    # WBS = Work Breakdown Structure
    async def get_full_wbs(project_id, db) -> WBSTree
    # Trả cây phân cấp: Project -> Phases -> Sprints/Epics -> Tasks -> Subtasks
```

---

### 2.2 – Task Management

#### Backend

**[MODIFY] `backend/app/api/v1/endpoints/tasks.py`**
```python
@router.get("/projects/{project_id}/tasks", response_model=list[TaskResponse])
# Query params: ?phase_id=, ?sprint_id=, ?assignee_id=, ?status=, ?priority=

@router.post("/projects/{project_id}/tasks", response_model=TaskResponse, status_code=201)
# Input: TaskCreate

@router.get("/tasks/{task_id}", response_model=TaskDetailResponse)
# Chi tiết: task info + subtasks + assignments + worklogs + comments + dependencies

@router.patch("/tasks/{task_id}", response_model=TaskResponse)
@router.delete("/tasks/{task_id}", status_code=204)

@router.post("/tasks/{task_id}/status")
# Chuyển trạng thái: todo -> in_progress -> review -> done

@router.get("/tasks/{task_id}/subtasks")
@router.post("/tasks/{task_id}/subtasks")
@router.patch("/subtasks/{subtask_id}")
@router.delete("/subtasks/{subtask_id}")
```

**[NEW] `backend/app/schemas/task.py`**
```python
class TaskCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=500)
    description: Optional[str] = None
    phase_id: Optional[UUID] = None
    sprint_id: Optional[UUID] = None
    epic_id: Optional[UUID] = None
    priority: str = "medium"       # low | medium | high | critical
    status: str = "todo"           # todo | in_progress | review | done | blocked
    estimated_hours: Optional[float] = None
    start_date: Optional[date] = None
    due_date: Optional[date] = None
    story_points: Optional[int] = None
    labels: list[str] = []
    assignee_ids: list[UUID] = []

class TaskDetailResponse(TaskResponse):
    subtasks: list[SubtaskResponse]
    assignments: list[AssignmentResponse]
    worklogs: list[WorklogSummary]
    total_logged_hours: float
    dependencies: list[DependencyResponse]
    comments_count: int
    early_start: Optional[date]
    early_finish: Optional[date]
    late_start: Optional[date]
    late_finish: Optional[date]
    float_days: Optional[float]
    is_critical: bool
```

**[NEW] `backend/app/services/task_service.py`**
```python
class TaskService:
    async def get_tasks(project_id, filters, user, db) -> list[Task]
    async def create_task(data: TaskCreate, project_id, user, db) -> Task
    async def get_task_detail(task_id, user, db) -> TaskDetail
    async def update_task(task_id, data: TaskUpdate, user, db) -> Task
    async def delete_task(task_id, user, db) -> None
    async def change_status(task_id, new_status, user, db) -> Task
    async def bulk_update_tasks(task_ids, data, user, db) -> list[Task]
```

---

### 2.3 – Task Dependencies

#### Backend

**[MODIFY] `backend/app/api/v1/endpoints/dependencies.py`**
```python
@router.post("/tasks/{task_id}/dependencies")
# Input: { depends_on_task_id: UUID, dependency_type: "FS"|"SS"|"FF"|"SF", lag_days: int }

@router.delete("/dependencies/{dependency_id}")
# Xóa quan hệ phụ thuộc

@router.get("/projects/{project_id}/dependencies")
# Lấy toàn bộ dependency graph của project -> dùng để render Gantt
```

**[NEW] `backend/app/utils/dependency_validator.py`**
```python
def validate_no_cycle(tasks: list, new_dependency: Dependency) -> bool:
    # Dùng DFS để phát hiện circular dependency

def topological_sort(tasks: list) -> list[Task]:
    # Kahn's algorithm
```

---

### 2.4 – Assignment & WorkLog

#### Backend

**[MODIFY] `backend/app/api/v1/endpoints/assignments.py`**
```python
@router.post("/tasks/{task_id}/assignments")
# Phân công task cho member

@router.delete("/assignments/{assignment_id}")
# Gỡ phân công

@router.get("/users/me/assignments")
# Lấy tất cả tasks đang được assigned cho current user
```

**[MODIFY] `backend/app/api/v1/endpoints/worklogs.py`**
```python
@router.post("/tasks/{task_id}/worklogs")
# Member ghi giờ làm việc

@router.get("/tasks/{task_id}/worklogs")
# Xem lịch sử giờ của một task

@router.get("/projects/{project_id}/worklogs")
# Tổng hợp giờ của cả project

@router.patch("/worklogs/{worklog_id}")
@router.delete("/worklogs/{worklog_id}")
```

#### Frontend — Task Board & Detail

**[NEW] `frontend/src/app/(dashboard)/projects/[id]/tasks/page.tsx`**
```
View modes:
  1. Kanban Board (columns: Todo / In Progress / Review / Done)
  2. List/Table view
  3. Sprint view

Filters:
  - Assignee, Priority, Status, Phase, Sprint, Labels, Due date range

Actions:
  - "New Task" button -> Quick-add modal
  - Click task -> opens TaskDetailDrawer
```

---

## PHASE 3 – Dashboard & Notifications

> **Mục tiêu:** Tổng quan dự án và portfolio, thông báo realtime

---

### 3.1 – Portfolio Dashboard

**[NEW] `frontend/src/app/(dashboard)/page.tsx`** (Home dashboard)
```
Layout:
  - Welcome bar: "Good morning, {name}"
  - Stats row: Active Projects / Total Tasks / Overdue Tasks / Hours This Week
  - Portfolio cards grid
  - Recent Activity feed
  - My Tasks section
```

**[NEW] `backend/app/api/v1/endpoints/dashboard.py`**
```python
@router.get("/dashboard/summary")
@router.get("/dashboard/portfolios/{portfolio_id}/health")
```

---

### 3.2 – Project Dashboard

**[NEW] `frontend/src/app/(dashboard)/projects/[id]/overview/page.tsx`**
```
Panels:
  1. Progress & Timeline card (% complete vs. planned)
  2. Budget card: spent vs. allocated (donut chart)
  3. Task Status Distribution (stacked bar chart)
  4. Team Utilization
  5. Milestone Timeline
```

---

### 3.3 – In-app Notifications

**[NEW] `backend/app/api/v1/endpoints/notifications.py`**
```python
@router.get("/notifications")
@router.patch("/notifications/{id}/read")
@router.patch("/notifications/read-all")
```

---

## Database & Backend Checklist

### Migrations cần chạy

| Migration | Mô tả |
|---|---|
| Đã có | portfolios, projects, phases, sprints, epics, milestones, tasks, subtasks, dependencies, assignments, worklogs, comments, notifications, audit_logs |
| Thêm nếu thiếu | Cột `progress_percent` (computed hoặc cached) trên `projects` |
| Thêm nếu thiếu | Index trên `tasks.project_id`, `tasks.assignee_id`, `tasks.due_date` |

---

## Kiểm thử (Test Checklist)

### Phase 1 – Portfolio & Project
- [x] PM tạo Portfolio -> hiển thị trong danh sách
- [x] PM tạo Project trong Portfolio -> project_count tăng
- [x] PM mời User (role: Member) -> User thấy project trong danh sách
- [x] Member không có quyền tạo project -> 403 Forbidden
- [x] PM xóa Portfolio -> cascade: xóa project con (soft delete)
- [x] Truy cập project không thuộc user -> 403 Forbidden

### Phase 2 – Tasks & Dependencies
- [x] Tạo Task với due_date < start_date -> validation error
- [x] Thêm dependency tạo circular loop -> reject với message rõ ràng
- [x] Chuyển Task status: todo -> in_progress -> review -> done
- [x] Member ghi WorkLog: hours > 0, work_date <= today
- [x] WorkLog tổng hợp đúng theo project/user/date range

### Phase 3 – Dashboard & Notifications
- [ ] Dashboard summary khớp với dữ liệu thực tế
- [ ] Notification xuất hiện khi PM assign task cho Member
- [ ] Mark notification as read -> biến mất khỏi unread count

---

## Phân quyền RBAC

| Action | Admin | PM | BA | PO | Member | Customer |
|---|---|---|---|---|---|---|
| Tạo Portfolio | [x] | [x] | [ ] | [ ] | [ ] | [ ] |
| Tạo Project | [x] | [x] | [ ] | [ ] | [ ] | [ ] |
| Mời Member | [x] | [x] | [ ] | [ ] | [ ] | [ ] |
| Xem Project | [x] | [x] (own) | [x] (member) | [x] (member) | [x] (member) | [ ] |
| Tạo Task | [x] | [x] | [x] | [ ] | [ ] | [ ] |
| Cập nhật Task | [x] | [x] | [x] | [ ] | [x] (assigned) | [ ] |
| Ghi WorkLog | [x] | [x] | [x] | [ ] | [x] | [ ] |
| Xem Dashboard | [x] | [x] | [x] | [x] | [x] (limited) | [ ] |

---

## Timeline Đề xuất

| Phase | Nội dung | Ước tính |
|---|---|---|
| Phase 1.1 | Portfolio CRUD (API + UI) | 3 ngày |
| Phase 1.2 | Project CRUD + Member Management | 4 ngày |
| Phase 2.1 | Phase / Sprint / Milestone CRUD | 2 ngày |
| Phase 2.2 | Task CRUD + Kanban Board | 4–5 ngày |
| Phase 2.3 | Task Dependencies | 2 ngày |
| Phase 2.4 | Assignment + WorkLog | 2 ngày |
| Phase 3.1 | Portfolio Dashboard | 2 ngày |
| Phase 3.2 | Project Dashboard (charts) | 2 ngày |
| Phase 3.3 | In-app Notifications | 2 ngày |
| Testing & Polish | QA toàn bộ module | 2–3 ngày |
| Tổng cộng | | ~25–27 ngày |

---

## Thứ tự ưu tiên thực hiện

```
1 -> Phase 1.1: Portfolio CRUD          <- Backbone của hệ thống
2 -> Phase 1.2: Project CRUD + Members  <- Chưa có project = chưa có gì
3 -> Phase 2.2: Task CRUD + Kanban      <- Core UX value
4 -> Phase 2.3: Task Dependencies       <- Cần cho CPM (Phase tiếp theo)
5 -> Phase 2.1: Phase/Sprint/Milestone  <- WBS structure
6 -> Phase 2.4: Assignment + WorkLog    <- Resource tracking
7 -> Phase 3.1: Portfolio Dashboard     <- Executive view
8 -> Phase 3.2: Project Dashboard       <- PM view
9 -> Phase 3.3: Notifications           <- UX polish
```

---

## File Tree – Trạng thái triển khai

```
frontend/src/
├── app/(dashboard)/
│   ├── page.tsx                         Home Dashboard (Phase 3.1)
│   ├── portfolios/
│   │   ├── page.tsx                     Portfolio List (Phase 1.1)
│   │   └── [id]/page.tsx               Portfolio Detail (Phase 1.1)
│   └── projects/
│       ├── page.tsx                     Projects List (Phase 1.2)
│       └── [id]/
│           ├── layout.tsx              Project Shell + Sidebar nav
│           ├── overview/page.tsx       Project Dashboard (Phase 3.2)
│           ├── tasks/page.tsx          Kanban + Task List (Phase 2.2)
│           ├── members/page.tsx        Member Management (Phase 1.2)
│           └── settings/page.tsx       Project Settings
├── features/
│   ├── portfolios/                      (Phase 1.1)
│   ├── projects/                        (Phase 1.2)
│   ├── tasks/                           (Phase 2.2–2.4)
│   └── notifications/                   (Phase 3.3)
└── store/
    ├── authStore.ts                     [x] Có sẵn
    ├── projectStore.ts                  Zustand: active project, WBS tree
    └── uiStore.ts                       Zustand: drawer state, modal state

backend/app/
├── api/v1/endpoints/
│   ├── portfolios.py                    Cần bổ sung logic (Phase 1.1)
│   ├── projects.py                      Cần bổ sung logic (Phase 1.2)
│   ├── phases.py                        Cần bổ sung logic (Phase 2.1)
│   ├── sprints.py                       Cần bổ sung logic (Phase 2.1)
│   ├── milestones.py                    Mới (Phase 2.1)
│   ├── tasks.py                         Cần bổ sung logic (Phase 2.2)
│   ├── dependencies.py                  Mới (Phase 2.3)
│   ├── assignments.py                   Mới (Phase 2.4)
│   ├── worklogs.py                      Mới (Phase 2.4)
│   ├── dashboard.py                     Mới (Phase 3.1)
│   └── notifications.py                 Mới (Phase 3.3)
├── services/
│   ├── portfolio_service.py             Mới (Phase 1.1)
│   ├── project_service.py               Mới (Phase 1.2)
│   └── wbs_service.py                   Mới (Phase 2.1)
```
