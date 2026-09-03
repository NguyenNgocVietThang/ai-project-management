# Roadmap: Portfolio & Project Core Module (Phase 2)

> **Phiên bản:** 1.1 | **Cập nhật:** 2026-08-22  
> **Trạng thái:** ✅ Đã hoàn thành (100%) | **Ngày hoàn thành:** 2026-08-22  
> **Mức độ ưu tiên:** Critical – Module nghiệp vụ cốt lõi quản lý danh mục, dự án, WBS, CPM Engine & Real-time Chat  
> **Điều kiện tiên quyết:** [x] Phase 1 (Auth & User Onboarding) đã hoàn thành

---

## Tổng quan Module

Module **Portfolio & Project Core (Phase 2)** xây dựng toàn bộ lớp quản lý danh mục, dự án, cấu trúc phân rã công việc (WBS), động cơ tính toán đường găng (CPM Engine), hệ thống Real-time Project Chat và tự động hóa thông báo fan-out tới toàn nhóm dự án.

### 7 Trụ cột chính:
1. **Portfolio Management (SOP-PM-001):** Quản lý danh mục dự án cấp chiến lược, phân bổ ngân sách tổng thể, theo dõi chỉ số sức khỏe (Health status) và tiến độ danh mục.
2. **Project Management & Member RBAC (SOP-PM-002):** Khởi tạo dự án theo mô hình Agile / Waterfall / Hybrid, phân quyền thành viên dự án theo vai trò (PM, BA, PO, Member, Customer).
3. **WBS, Phases, Sprints & Milestones (SOP-PM-003):** Phân rã cấu trúc dự án đa cấp độ (Project -> Phase -> Sprint/Epic -> Milestone -> Task -> Subtask).
4. **Task Management & CPM Engine Integration:** Quản lý công việc chi tiết, thiết lập quan hệ phụ thuộc (FS, SS, FF, SF), phát hiện chu trình phụ thuộc (Cycle validation) và tính toán đường găng Critical Path (ES, EF, LS, LF, Float).
5. **Assignments, WorkLogs & Resource Tracking:** Phân công nhân sự theo khối lượng công việc, ghi nhận nhật ký làm việc (WorkLog timesheet), theo dõi chi phí thực tế.
6. **Real-time Project Chat (SOP-CHAT-001):** Kênh chat nhóm dự án trực tiếp qua WebSocket `/ws/chat/{project_id}`, phân phối qua Redis Pub/Sub, lưu trữ lịch sử tin nhắn và đếm unread count.
7. **Task Notification Triggers & Celery Beat Daily Sweep (SOP-NOTI-001):** Thông báo fan-out tới toàn bộ nhóm dự án khi Task có thay đổi quan trọng; Celery Beat quét định kỳ 08:00 AM gửi thông báo nhắc việc bắt đầu và sắp đến hạn.

---

## Danh mục tính năng đã triển khai

| Tính năng | Mã SOP | Độ ưu tiên | Trạng thái | Backend Task | Frontend Component |
|---|---|---|---|---|---|
| Portfolio Management | SOP-PM-001 | Critical | ✅ Hoàn thành | `PortfolioService` + Endpoints | `PortfolioList`, `PortfolioCard`, `PortfolioForm` |
| Project Management & Member RBAC | SOP-PM-002 | Critical | ✅ Hoàn thành | `ProjectService` + Endpoints | `ProjectList`, `ProjectWizardForm`, `ProjectMembersTable` |
| WBS, Phases, Sprints & Milestones | SOP-PM-003 | High | ✅ Hoàn thành | `WBSService` + Endpoints | `WBSTreeView`, `PhaseManager`, `MilestoneTimeline` |
| Task CRUD & Dependencies Graph | SOP-PM-003 | Critical | ✅ Hoàn thành | `TaskService` + `scheduling_service.py` + `utils/cpm.py` | `KanbanBoard`, `TaskDrawer` |
| Assignments & WorkLogs Tracking | SOP-RM-001 | High | ✅ Hoàn thành | `AssignmentService` + `WorklogService` | `AssigneeSelector`, `WorkLogModal`, `TimesheetTable` |
| Project & Portfolio Dashboard | Reporting | High | ✅ Hoàn thành | `DashboardService` + `NotificationService` | `PortfolioDashboard`, `ProjectDashboard`, `NotificationBell` |
| Real-time Project Chat | SOP-CHAT-001 | High | ✅ Hoàn thành | `ChatService` + `/ws/chat/{id}` | `ChatPanel`, `ChatMessageItem`, `useChatSocket` |
| Notification Triggers & Beat Sweep | SOP-NOTI-001 | High | ✅ Hoàn thành | `notify_project_team` + Celery Beat | `NotificationBell`, `useNotificationSocket` |

---

## Chi tiết các Giai đoạn đã hoàn thành

### GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001)
- Backend: `PortfolioService`, `/api/v1/portfolios` (CRUD danh mục, cascade soft-delete).
- Frontend: `/app/(dashboard)/portfolios/page.tsx` & `[id]/page.tsx`, `PortfolioCard.tsx`, `PortfolioForm.tsx`.

### GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002)
- Backend: `ProjectService`, `/api/v1/projects` (CRUD dự án, quản lý thành viên qua `project_members`).
- Frontend: `/app/(dashboard)/projects/page.tsx` & `[id]/overview/page.tsx`, `ProjectWizardForm.tsx`, `ProjectMembersTable.tsx`.

### GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003)
- Backend: `WBSService`, `/api/v1/phases`, `/api/v1/sprints`, `/api/v1/epics`, `/api/v1/milestones`.
- Frontend: `/app/(dashboard)/projects/[id]/wbs/page.tsx`, `WBSTreeView.tsx`.

### GIAI ĐOẠN 2.4 – Task Management, Dependencies & CPM Engine
- Backend: `TaskService`, `scheduling_service.py`, pure Python CPM (`app/utils/cpm.py`), `/api/v1/tasks`, `/api/v1/dependencies`. CPM chạy nội bộ khi cập nhật task/dependency — **chưa có endpoint `/cpm` công khai** (`cpm.py` vẫn là stub).
- Frontend: `/app/(dashboard)/projects/[id]/tasks/page.tsx`, `KanbanBoard.tsx`, `TaskDrawer.tsx`.

### GIAI ĐOẠN 2.5 – Assignments, WorkLogs & Resource Tracking
- Backend: `AssignmentService`, `WorklogService`, `resource_service.py`, `/api/v1/assignments`, `/api/v1/worklogs`, `/api/v1/resource-leveling`. **`/api/v1/leaves` và `/api/v1/skills` chưa mount** (model đã có, endpoint là stub).
- Frontend: `WorkLogModal.tsx`, `AssigneeSelector.tsx`.

### GIAI ĐOẠN 2.6 – Portfolio & Project Dashboard, In-App Notifications
- Backend: `DashboardService`, `NotificationService`, `/api/v1/dashboards`, `/api/v1/notifications`.
- Frontend: `/app/(dashboard)/dashboard/page.tsx`, `NotificationBell.tsx`, `NotificationList.tsx`.

### GIAI ĐOẠN 2.7 – Real-Time Project Chat (SOP-CHAT-001)
- Backend:
  - Models: `ChatMessage`, `ChatReadState` (`app/models/chat_message.py`, `chat_read_state.py`).
  - Service: `ChatService` (`app/services/chat_service.py`) — phân trang con trỏ `before_id`, lưu trữ và publish tới Redis.
  - Endpoints: REST `/api/v1/projects/{id}/messages|unread-count|read` + WebSocket `/ws/chat/{project_id}`.
  - WebSocket Infrastructure: `app/core/ws_manager.py` (ConnectionManager, `publish()`, `redis_listener()`), `app/api/ws/deps.py` (`authenticate_ws`).
- Frontend:
  - Modules: `frontend/src/features/chat/` (`ChatPanel.tsx`, `ChatMessageItem.tsx`, `useChatSocket.ts`, `useChat.ts`).
  - Router: `/app/(dashboard)/projects/[id]/chat/page.tsx`, Tab Chat với huy hiệu số tin chưa đọc trên thanh điều hướng dự án.
  - Helper: `frontend/src/lib/ws-client.ts` tự động kết nối lại khi mất mạng.

### GIAI ĐOẠN 2.8 – Task Notification Triggers & Celery Beat Daily Sweep (SOP-NOTI-001)
- Backend:
  - Helper: `notify_project_team()` (`app/services/phase2_common.py`) fan-out thông báo tới toàn bộ thành viên dự án.
  - Triggers: Hook vào `TaskService.update()` (phát hiện thay đổi `SIGNIFICANT_TASK_FIELDS`) và `TaskService.change_status()`.
  - Task Columns: Thêm `last_start_notified_at` và `last_due_soon_notified_at` vào bảng `tasks` để chống gửi trùng.
  - Celery Beat: `app/workers/notification_tasks.py` (`sweep_task_dates_task`) chạy định kỳ lúc 08:00 AM hàng ngày quét các task bắt đầu và sắp đến hạn.
  - Service `celery-beat` bổ sung vào `docker-compose.yml`.

---

*Cập nhật lần cuối: 2026-09-03 — Phase 2 hoàn thành (lưu ý: endpoint `/cpm`, `/gantt`, `/leaves`, `/skills` vẫn là stub chưa mount; CPM chạy nội bộ).*
