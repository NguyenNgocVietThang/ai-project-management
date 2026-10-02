# Lộ trình: Mô-đun quy trình và báo cáo (Phase 4)

> **Phiên bản:** 1.3 | **Cập nhật:** 2026-10-02  
> **Trạng thái:** ~40% — Audit Timeline (`/admin/audit`), hạ tầng WebSocket/Redis, Dashboard endpoints và Change Request CRUD tối giản (`/projects/{id}/change-requests`) đã chạy thật. Approvals đa cấp (`BA -> PO -> PM`), Project Versioning, Reports DOCX/XLSX, Gantt: MỚI có model DB / endpoint scaffold stub, CHƯA mount, CHƯA có UI. 
> **Mức độ ưu tiên:** Critical – Quy trình kiểm soát thay đổi, truy vết lịch sử, hạ tầng real-time & báo cáo chuyên sâu  
> **Điều kiện tiên quyết:** [x] Phase 1 (Auth & RBAC), Phase 2 (Project Core, CPM & Real-time Chat) đã hoàn thành

---

## Tổng quan Module

Module **Workflow & Reporting (Phase 4)** thiết lập cơ chế kiểm soát chất lượng dự án toàn diện, tự động hóa quy trình phê duyệt thay đổi (Change Request), lưu trữ các mốc phiên bản dự án (Versioning & Rollback), cung cấp biểu đồ điều hành nâng cao (Gantt, Agile, EVA), hạ tầng truyền thông thời gian thực và xuất báo cáo tài liệu chuyên nghiệp (DOCX & XLSX).

### 5 Trụ cột chính:
1. **Audit Timeline & Activity Stream (SOP-AUD-001):** Hệ thống truy vết kiểm toán toàn diện, ghi nhận mọi biến động hệ thống với phân trang hiệu năng cao (cursor pagination) và bộ lọc đối tượng (`/admin/audit`).
2. **Real-time Communication & Notification Push:** Hạ tầng WebSocket kết hợp Redis Pub/Sub đa tiến trình (`app/core/ws_manager.py`), phục vụ Real-time Project Chat và Push thông báo tức thời.
3. **Change Request & Multi-Level Approval Workflow (SOP-CR):** Quy trình phê duyệt thay đổi đa cấp theo trình tự `BA -> PO -> PM`, kết hợp AI Impact Analysis.
4. **Project Versioning & Rollback (SOP-PM-004):** Tự động tạo snapshot JSONB của dự án trước mỗi thay đổi lớn, cho phép so sánh diff trực quan giữa 2 phiên bản và rollback an toàn.
5. **Advanced Analytics & Report Export Engine (SOP-RPT-001):** Sinh báo cáo chuyên nghiệp định dạng **DOCX** (python-docx) và **XLSX** (openpyxl) qua Celery worker.

---

## Hiện trạng & Hạ tầng sẵn có

| Thành phần | Trạng thái | Ghi chú |
|---|---|---|
| Audit Timeline & Log Service | Đã hoàn thành | `AuditService`, `audit_timeline.py`, `/admin/audit` |
| WebSocket & Redis Pub/Sub Bridge | Đã hoàn thành | `core/ws_manager.py`, `core/redis_client.py`, `/ws/*` |
| Real-time Project Chat | Đã hoàn thành | `chat_service.py`, `/projects/[id]/chat`, `/ws/chat/{id}` |
| Database Schema: `change_requests`, `approvals`, `project_versions`, `impact_reports`, `audit_logs` | Đã migrate | `change_requests` + `impact_reports` đã có service + endpoint + UI thật; `approvals` + `project_versions` là stub |
| RBAC Roles: `PM`, `BA`, `PO`, `Member`, `Customer`, `Admin` | Đã cấu hình | Đã phân quyền chi tiết với 34 permissions |
| Celery + Redis Task Queue | Đã có sẵn | Hạ tầng chạy; `workers/report_tasks.py` mới là stub `TODO` |
| MinIO Storage Service | Đã có sẵn | Bucket `ai-project-files` lưu trữ report docs |

---

## Danh mục tính năng triển khai theo Phase

| Tính năng | Mã SOP | Độ ưu tiên | Trạng thái | Backend Task | Frontend Component |
|---|---|---|---|---|---|
| Audit Timeline & Activity Feed | Security | Medium | Hoàn thành | `AuditService` + `audit_timeline.py` | `/admin/audit`, `AuditTimeline` |
| Real-time WebSocket Infra & Chat | SOP-CHAT-001 | High | Hoàn thành | `ws_manager.py` + `chat_service.py` | `ChatPanel`, `/projects/[id]/chat` |
| Interactive Gantt Chart & CPM | SOP-PM-003 | Critical | CPM đã mount (chỉ đọc); Gantt chưa làm | `utils/cpm.py` + `scheduling_service.py` chạy thật, endpoint `GET /projects/{id}/cpm` (`endpoints/cpm.py`) đã mount; `gantt.py` vẫn là stub `TODO` chưa mount | Chưa có `GanttChart` |
| Change Request CRUD & Submit | SOP-CR | High | Hoàn thành | `change_request_service.py` + `endpoints/change_requests.py` (đã mount) | `features/change-requests/**` (`/projects/{id}/change-requests`) |
| Multi-Level Approval Workflow Engine | SOP-CR | Critical | Chưa triển khai | `approvals.py` là stub `TODO`, chưa mount; quy trình BA → PO → PM chưa có UI | Chưa có |
| Project Versioning & Diff/Rollback | SOP-PM-004 | High | Chỉ model DB | `project_versions.py` là stub; không có `versioning_service` | Chưa có |
| DOCX/XLSX Export via Celery | SOP-RPT-001 | High | Chỉ scaffold | `report_tasks.py` là stub trả về `file_url: ""`; `reports.py` chưa mount | Chưa có |
| Agile & EVA Metrics Engine | Báo cáo | High | Hoàn thành | `dashboards.py` + `dashboard_service.py` (đã mount) | `BurndownChart`, `StatsRow` |

---

## Chi tiết các Giai đoạn

### GIAI ĐOẠN 4.1 – Audit Timeline & Activity Stream (SOP-AUD-001)
> **Trạng thái:** Đã hoàn thành 
- Backend: `AuditService` (`backend/app/services/audit_service.py`), endpoint `/api/v1/audit` với cursor pagination và bộ lọc theo `entity_type`.
- Frontend: `/app/(dashboard)/admin/audit/page.tsx` với bảng đối soát diff trực quan `old_values` và `new_values`.

### GIAI ĐOẠN 4.2 – Real-Time WebSocket Infrastructure & Project Chat (SOP-CHAT-001)
> **Trạng thái:** Đã hoàn thành 
- Backend: FastAPI native WebSocket `/ws/chat/{project_id}` và `/ws/notifications`, `ConnectionManager` kết nối Redis Pub/Sub bridge.
- Frontend: `lib/ws-client.ts`, `useChatSocket`, `ChatPanel`, `/projects/[id]/chat` với unread count badge.

### GIAI ĐOẠN 4.3 – Change Request & Multi-Level Approval Workflow (SOP-CR)
> **Trạng thái:** Một phần hoàn thành.
- **Đã hoàn thành:** CRUD Change Request tối giản (`create`, `list`, `get`, `submit` DRAFT → SUBMITTED), service `change_request_service.py`, schema `change_request.py`, endpoint `/api/v1/projects/{id}/change-requests` đã mount, giao diện `/projects/{id}/change-requests` kết nối trực tiếp với AI Impact Analysis (SOP-AI-002).
- **Chưa triển khai (Kế hoạch tiếp theo):** Quy trình phê duyệt tuần tự nhiều cấp qua bảng `approvals` (`BA Review -> PO Review -> PM Final Approval`) và snapshot tự động để apply thay đổi.

### GIAI ĐOẠN 4.4 – Project Versioning & Rollback System (SOP-PM-004)
> **Trạng thái:** Chưa bắt đầu — chỉ có model `project_versions`. Chưa có `versioning_service`, endpoint stub chưa mount.

### GIAI ĐOẠN 4.5 – Report Generation & Export (DOCX & XLSX) (SOP-RPT-001)
> **Trạng thái:** Chưa bắt đầu — `report_tasks.py` chỉ có 2 task stub trả về `{"status": "completed", "file_url": ""}`, chưa dùng python-docx/openpyxl, endpoint `/reports` chưa mount.

---

*Cập nhật lần cuối: 2026-10-02 — Phase 4 (Workflow & Reporting) — đối soát với mã nguồn.*
