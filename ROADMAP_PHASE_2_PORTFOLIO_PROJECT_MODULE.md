# Roadmap: Portfolio & Project Core Module (Phase 2)

> **Phiên bản:** 1.0 | **Cập nhật:** 2026-08-16  
> **Trạng thái:** ✅ Đã hoàn thành (100%) | **Ngày hoàn thành:** 2026-08-16  
> **Mức độ ưu tiên:** Critical – Module nghiệp vụ cốt lõi quản lý danh mục, dự án, WBS & CPM Engine  
> **Điều kiện tiên quyết:** [x] Phase 1 (Auth & User Onboarding) đã hoàn thành

---

## Tổng quan Module

Module **Portfolio & Project Core (Phase 2)** xây dựng toàn bộ lớp quản lý danh mục, dự án, cấu trúc phân rã công việc (WBS) và động cơ tính toán đường găng (CPM Engine) — nền tảng vận hành của mọi hoạt động quản lý dự án trong hệ thống.

### 5 Trụ cột chính:
1. **Portfolio Management (SOP-PM-001):** Quản lý danh mục dự án cấp chiến lược, phân bổ ngân sách tổng thể, theo dõi chỉ số sức khỏe (Health status) và tiến độ danh mục.
2. **Project Management & Member RBAC (SOP-PM-002):** Khởi tạo dự án theo mô hình Agile / Waterfall / Hybrid, phân quyền thành viên dự án theo vai trò (PM, BA, PO, Member, Customer).
3. **WBS, Phases, Sprints & Milestones (SOP-PM-003):** Phân rã cấu trúc dự án đa cấp độ (Project -> Phase -> Sprint/Epic -> Milestone -> Task -> Subtask).
4. **Task Management & CPM Engine Integration:** Quản lý công việc chi tiết, thiết lập quan hệ phụ thuộc (FS, SS, FF, SF), phát hiện chu trình phụ thuộc (Cycle validation) và tính toán đường găng Critical Path (ES, EF, LS, LF, Float).
5. **Assignments, WorkLogs & In-app Notifications:** Phân công nhân sự theo khối lượng công việc, ghi nhận nhật ký làm việc (WorkLog timesheet), theo dõi chi phí thực tế và phát thông báo in-app cho các sự kiện dự án.

---

## Hiện trạng & Hạ tầng sẵn có

| Thành phần | Trạng thái | Ghi chú |
|---|---|---|
| Database Schema: `portfolios`, `projects`, `phases`, `sprints`, `epics`, `milestones`, `tasks`, `subtasks`, `dependencies`, `assignments`, `worklogs`, `notifications` | Đã migrate | Toàn bộ bảng đã sẵn sàng trong PostgreSQL |
| Seed Data: 7 Roles & 34 Permissions | Đã khởi tạo | `Admin`, `PM`, `BA`, `PO`, `Member`, `Customer`, `Investor` |
| CPM Service Engine (Forward & Backward Pass) | Đã có sẵn | `backend/app/services/cpm_service.py` |
| Next.js Dashboard Layout & Sidebar Nav | Đã có sẵn | `frontend/src/app/(dashboard)/layout.tsx` |
| Zustand Stores (`projectStore`, `uiStore`, `authStore`) | Đã có sẵn | Quản lý state toàn cục cho Project & UI |

---

## Danh mục tính năng cần triển khai

| Tính năng | Mã SOP | Độ ưu tiên | Trạng thái | Backend Task | Frontend Component |
|---|---|---|---|---|---|
| Portfolio Management | SOP-PM-001 | Critical | ✅ Hoàn thành (2026-08-16) | `PortfolioService` + Endpoints | `PortfolioList`, `PortfolioCard`, `PortfolioForm` |
| Project Management & Member RBAC | SOP-PM-002 | Critical | ✅ Hoàn thành (2026-08-16) | `ProjectService` + Endpoints | `ProjectList`, `ProjectWizardForm`, `ProjectMembersTable` |
| WBS, Phases, Sprints & Milestones | SOP-PM-003 | High | ✅ Hoàn thành (2026-08-16) | `WBSService` + Endpoints | `WBSTreeView`, `PhaseManager`, `MilestoneTimeline` |
| Task CRUD & Dependencies Graph | SOP-PM-003 | Critical | ✅ Hoàn thành (2026-08-16) | `TaskService` + `CPMService` | `KanbanBoard`, `TaskDetailDrawer`, `DependencyLinks` |
| Assignments & WorkLogs Tracking | SOP-RM-001 | High | ✅ Hoàn thành (2026-08-16) | `AssignmentService` + `WorklogService` | `AssigneeSelector`, `WorkLogModal`, `TimesheetTable` |
| Project & Portfolio Dashboard + Notifications | Reporting | High | ✅ Hoàn thành (2026-08-16) | `DashboardService` + `NotificationService` | `PortfolioDashboard`, `ProjectDashboard`, `NotificationBell` |

---

## Chi tiết kế hoạch triển khai theo Phase

---

## GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001)

> **Trạng thái:** ✅ Hoàn thành | **Ngày hoàn thành:** 2026-08-16  
> **Mục tiêu:** Cho phép PM và Admin tạo, quản lý và theo dõi các Portfolio chiến lược, phân bổ ngân sách, gắn kết các dự án trực thuộc và hiển thị thẻ tổng quan trực quan.

### 1. Luồng xử lý (Workflow)
```
PM/Admin -> POST /api/v1/portfolios -> Lưu Portfolio vào DB -> Ghi Audit Log
  -> GET /api/v1/portfolios -> Trả về danh sách kèm số lượng dự án, tổng ngân sách và tiến độ
  -> GET /api/v1/portfolios/{id} -> Xem chi tiết Portfolio + danh sách dự án trực thuộc
  -> PATCH / DELETE -> Cập nhật hoặc Soft-delete cascade dự án con
```

### 2. Backend Implementation

**[NEW] `backend/app/services/portfolio_service.py`**
```python
class PortfolioService:
    async def get_portfolios(self, user: User, db: AsyncSession) -> list[PortfolioResponse]:
        """Lấy danh sách Portfolio theo quyền của người dùng (Admin thấy tất cả, PM thấy portfolio quản lý)."""
        pass
    
    async def create_portfolio(self, data: PortfolioCreate, owner: User, db: AsyncSession) -> Portfolio:
        """Tạo Portfolio mới và ghi nhận audit log."""
        pass
```

**[MODIFY] `backend/app/api/v1/endpoints/portfolios.py`**
- `GET /api/v1/portfolios` — Lấy danh sách Portfolio của user.
- `POST /api/v1/portfolios` — Tạo Portfolio mới (yêu cầu role PM hoặc Admin).
- `GET /api/v1/portfolios/{portfolio_id}` — Lấy chi tiết Portfolio và danh sách dự án con.
- `PATCH /api/v1/portfolios/{portfolio_id}` — Cập nhật thông tin và ngân sách Portfolio.
- `DELETE /api/v1/portfolios/{portfolio_id}` — Xóa Portfolio (cascade soft-delete).

### 3. Frontend Implementation

**[NEW] `frontend/src/app/(dashboard)/portfolios/page.tsx`** & `[id]/page.tsx`
- Trang danh sách Portfolio dạng Grid/Table và trang chi tiết Portfolio kèm tab Projects/Overview.

**[NEW] `frontend/src/features/portfolios/components/`**
- `PortfolioCard.tsx`: Card hiển thị tên, số dự án, ngân sách đã cấp, tiến độ trung bình.
- `PortfolioForm.tsx`: Modal tạo/sửa portfolio với validation react-hook-form + zod.

---

## GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002)

> **Trạng thái:** ✅ Hoàn thành | **Ngày hoàn thành:** 2026-08-16  
> **Mục tiêu:** Cung cấp quy trình khởi tạo dự án đa bước (Wizard), phân quyền vai trò cho từng thành viên trong dự án (PM, BA, PO, Member, Customer) và kiểm soát truy cập nghiêm ngặt.

### 1. Luồng xử lý (Workflow)
```
PM tạo dự án qua Wizard (3 bước: Thông tin cơ bản -> Mời thành viên & Gán Role -> Review)
  -> POST /api/v1/projects -> Lưu Project & ProjectMembers
  -> Gửi email thông báo mời thành viên
  -> Middleware/Dependency `get_project_member` kiểm tra quyền cho mọi thao tác tiếp theo
```

### 2. Backend Implementation

**[NEW] `backend/app/services/project_service.py`**
```python
class ProjectService:
    async def create_project(self, data: ProjectCreate, owner: User, db: AsyncSession) -> Project:
        """Khởi tạo dự án mới, gán owner làm PM và thiết lập cấu trúc ban đầu."""
        pass
    
    async def add_member(self, project_id: UUID, user_id: UUID, role_id: UUID, inviter: User, db: AsyncSession) -> ProjectMember:
        """Mời thành viên vào dự án với vai trò chỉ định."""
        pass
```

**[MODIFY] `backend/app/api/v1/endpoints/projects.py`**
- `GET /api/v1/projects` — Danh sách dự án (lọc theo portfolio, status, methodology, search).
- `POST /api/v1/projects` — Tạo dự án mới.
- `GET /api/v1/projects/{project_id}` — Chi tiết dự án, thống kê số lượng task, tiến độ hoàn thành.
- `POST /api/v1/projects/{project_id}/members` — Mời thành viên vào dự án.
- `DELETE /api/v1/projects/{project_id}/members/{user_id}` — Xóa thành viên khỏi dự án.

### 3. Frontend Implementation

**[NEW] `frontend/src/app/(dashboard)/projects/page.tsx`** & `[id]/overview/page.tsx`
- Danh sách dự án toàn hệ thống và Dashboard tổng quan dự án.

**[NEW] `frontend/src/features/projects/components/`**
- `ProjectCard.tsx`: Thẻ hiển thị trạng thái, methodology chip, % hoàn thành và deadline.
- `ProjectWizardForm.tsx`: Wizard 3 bước tạo dự án chuyên nghiệp.
- `ProjectMembersTable.tsx`: Danh sách thành viên kèm role badge và chức năng mời/gỡ thành viên.

---

## GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003)

> **Trạng thái:** ✅ Hoàn thành | **Ngày hoàn thành:** 2026-08-16  
> **Mục tiêu:** Xây dựng cấu trúc phân rã công việc (Work Breakdown Structure - WBS) theo mô hình phân cấp: Project -> Phases -> Sprints / Epics -> Milestones -> Tasks.

### 1. Backend Implementation

**[NEW] `backend/app/services/wbs_service.py`**
```python
class WBSService:
    async def get_full_wbs(self, project_id: UUID, db: AsyncSession) -> WBSTreeResponse:
        """Truy vấn và dựng cây phân cấp WBS hoàn chỉnh của dự án."""
        pass
```

**[MODIFY] `backend/app/api/v1/endpoints/phases.py` & `sprints.py` & `milestones.py`**
- `GET /api/v1/projects/{project_id}/phases` — Danh sách Phases theo trình tự.
- `POST /api/v1/projects/{project_id}/phases` — Tạo Phase mới.
- `POST /api/v1/phases/{phase_id}/sprints` — Tạo Sprint cho Phase.
- `POST /api/v1/projects/{project_id}/milestones` — Tạo Milestone cột mốc quan trọng.

### 2. Frontend Implementation

**[NEW] `frontend/src/features/wbs/components/WBSTreeView.tsx`**
- Giao diện dạng cây phân cấp (Tree Table) cho phép mở rộng/thu gọn Phases, Epics và Milestones.

---

## GIAI ĐOẠN 2.4 – Task Management, Dependencies & CPM Engine

> **Trạng thái:** ✅ Hoàn thành | **Ngày hoàn thành:** 2026-08-16  
> **Mục tiêu:** Quản lý Task chi tiết (Kanban Board / Table view), thiết lập quan hệ phụ thuộc (FS, SS, FF, SF), tự động kiểm tra vòng lặp phụ thuộc (Cycle validation) và tính toán đường găng CPM.

### 1. Luồng xử lý (CPM Calculation Flow)
```
Task Create / Update / Dependency Change
  -> Validate không có circular loop bằng Topological Sort (Kahn's algorithm)
  -> Chạy Forward Pass: Tính Early Start (ES) & Early Finish (EF)
  -> Chạy Backward Pass: Tính Late Start (LS) & Late Finish (LF)
  -> Tính Total Float = LS - ES: Nếu Float = 0 -> Đánh dấu `is_critical = True`
  -> Cập nhật lại Task schedule và lưu vào DB
```

### 2. Backend Implementation

**[NEW] `backend/app/services/task_service.py`**
```python
class TaskService:
    async def create_task(self, data: TaskCreate, project_id: UUID, user: User, db: AsyncSession) -> Task:
        """Tạo task mới và kích hoạt tính toán lại CPM schedule."""
        pass
    
    async def change_status(self, task_id: UUID, new_status: str, user: User, db: AsyncSession) -> Task:
        """Chuyển trạng thái task (todo -> in_progress -> review -> done)."""
        pass
```

**[MODIFY] `backend/app/services/cpm_service.py`**
- Thuật toán Topological Sort, Forward Pass, Backward Pass và tính Total Float / Free Float.

**[MODIFY] `backend/app/api/v1/endpoints/tasks.py` & `dependencies.py`**
- `GET /api/v1/projects/{project_id}/tasks` — Danh sách task kèm bộ lọc đa tiêu chí.
- `POST /api/v1/projects/{project_id}/tasks` — Tạo task mới.
- `POST /api/v1/tasks/{task_id}/dependencies` — Thiết lập quan hệ phụ thuộc.
- `GET /api/v1/projects/{project_id}/dependencies` — Toàn bộ đồ thị phụ thuộc của dự án.

### 3. Frontend Implementation

**[NEW] `frontend/src/app/(dashboard)/projects/[id]/tasks/page.tsx`**
- Giao diện Task Management hỗ trợ chuyển đổi linh hoạt giữa Kanban Board (Drag & Drop) và Table View.

**[NEW] `frontend/src/features/tasks/components/`**
- `KanbanBoard.tsx`: Bảng cột trạng thái (Todo / In Progress / Review / Done).
- `TaskDetailDrawer.tsx`: Drawer chi tiết task, danh sách subtasks, logs giờ và dependencies.

---

## GIAI ĐOẠN 2.5 – Assignments, WorkLogs & Resource Tracking

> **Trạng thái:** ✅ Hoàn thành | **Ngày hoàn thành:** 2026-08-16  
> **Mục tiêu:** Phân công nhân sự cho task, theo dõi khối lượng công việc, ghi nhận thời gian làm việc thực tế (WorkLog timesheet) và kiểm soát chi phí giờ công (`hourly_rate`).

### 1. Backend Implementation

**[MODIFY] `backend/app/api/v1/endpoints/assignments.py` & `worklogs.py`**
- `POST /api/v1/tasks/{task_id}/assignments` — Phân công thành viên vào task.
- `POST /api/v1/tasks/{task_id}/worklogs` — Ghi nhận nhật ký giờ làm việc thực tế.
- `GET /api/v1/projects/{project_id}/worklogs` — Tổng hợp timesheet của toàn bộ dự án.

### 2. Frontend Implementation

**[NEW] `frontend/src/features/worklogs/components/WorkLogModal.tsx`**
- Form ghi nhận số giờ làm việc, ngày thực hiện và mô tả công việc hoàn thành.

---

## GIAI ĐOẠN 2.6 – Portfolio & Project Dashboard, In-App Notifications

> **Trạng thái:** ✅ Hoàn thành | **Ngày hoàn thành:** 2026-08-16  
> **Mục tiêu:** Tổng hợp toàn diện chỉ số tiến độ, ngân sách, số lượng task quá hạn trên Dashboard và cung cấp hệ thống chuông thông báo in-app thời gian thực.

### 1. Backend Implementation

**[NEW] `backend/app/services/dashboard_service.py`**
- Tổng hợp chỉ số KPI cho Portfolio Dashboard và Project Overview.

**[NEW] `backend/app/services/notification_service.py`**
- Ghi nhận và phát thông báo in-app khi có sự kiện gán task, thay đổi trạng thái, chạm milestone.

**[NEW] `backend/app/api/v1/endpoints/dashboards.py` & `notifications.py`**
- `GET /api/v1/dashboard/summary` — Tổng quan Dashboard cá nhân.
- `GET /api/v1/notifications` — Danh sách thông báo in-app của người dùng.
- `PATCH /api/v1/notifications/{id}/read` — Đánh dấu đã đọc thông báo.

### 2. Frontend Implementation

**[NEW] `frontend/src/app/(dashboard)/dashboard/page.tsx`**
- Trang Dashboard tổng quan: Thống kê số dự án active, task quá hạn, số giờ làm việc tuần này, thẻ Portfolio tóm tắt.

**[NEW] `frontend/src/features/notifications/components/NotificationBell.tsx` & `NotificationPanel.tsx`**
- Chuông thông báo trên thanh Header với huy hiệu số lượng chưa đọc và panel xem nhanh.

---

## Kế hoạch kiểm thử (Testing Strategy)

> **Trạng thái kiểm thử:** ✅ Đã vượt qua (Passed 100% - 2026-08-16)

1. **Unit Tests (`tests/unit/services/`):**
   - Test thuật toán CPM: Forward Pass, Backward Pass, phát hiện đường găng chính xác.
   - Test thuật toán kiểm tra chu trình phụ thuộc (Cycle Detection) ngăn ngừa deadlock.
   - Test tính toán tổng thời gian và chi phí từ WorkLogs.
2. **Integration Tests (`tests/integration/test_portfolio_project.py`):**
   - Test phân quyền RBAC: Thành viên (Member) không được phép tạo/xóa Project hay Portfolio (HTTP 403).
   - Test luồng phân công Task -> sinh bản ghi Notification tương ứng cho Assignee.
   - Test tính toàn vẹn khi xóa Portfolio (cascade soft-delete).
3. **Correctness & Invariant Tests:**
   - Đảm bảo đồ thị phụ thuộc luôn là đồ thị có hướng không chu trình (DAG invariant).
   - Đảm bảo ngày bắt đầu luôn nhỏ hơn hoặc bằng ngày kết thúc (`start_date <= end_date`).
   - Đảm bảo số giờ ghi nhận trong WorkLog luôn lớn hơn 0 và không vượt quá 24h/ngày.
