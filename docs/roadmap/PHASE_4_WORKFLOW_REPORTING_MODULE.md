# Lộ trình: Mô-đun quy trình và báo cáo (Phase 4)

> **Phiên bản:** 2.2 | **Cập nhật:** 2026-10-18  
> **Trạng thái:** Hoàn thành phần mã nguồn; nhánh `feature/phase4-workflow-reporting` đã merge vào `main` và xóa. Còn chờ người dùng: duyệt quy tắc rollback V0 và các checkpoint, chạy thử provider AI thật, kịch bản demo trên Render sau cold start.  
> **Mức độ ưu tiên:** Critical – kiểm soát thay đổi, truy vết phiên bản, báo cáo cho hội đồng chấm  
> **Điều kiện tiên quyết:** Phase 1 (Auth và RBAC), Phase 2 (Project Core, CPM, chat) đã hoàn thành  
> **Kế hoạch chi tiết:** `tasks/phase4/plan.md` (ý định, kiến trúc, V0), `tasks/phase4/todo.md` (task và bằng chứng), `tasks/phase4/progress.md` (nhật ký)

---

## Tổng quan

Phase 4 bổ sung kịch bản demo trọn vẹn: nhập ý tưởng, AI hỏi làm rõ theo danh sách mục (có giả định và nút bỏ qua), tạo dự án, Gantt/đường găng, gửi CR, duyệt BA -> PO -> PM, tự tạo phiên bản, so sánh và rollback, xuất SRS/BRD (DOCX, có sơ đồ BPMN) và XLSX. Mọi tác vụ nền chạy bằng durable jobs trong PostgreSQL (không Celery), phù hợp gói Render Free.

---

## Hiện trạng theo tính năng

| Tính năng | Trạng thái | Backend | Frontend |
|---|---|---|---|
| Audit Timeline | Hoàn thành (trước Phase 4) | `AuditService`, `audit_timeline.py` | `/admin/audit` |
| WebSocket, chat | Hoàn thành (trước Phase 4) | `ws_manager.py`, `chat_service.py` | `/projects/[id]/chat` |
| Hồ sơ yêu cầu và AI hỏi làm rõ | Hoàn thành | Bảng `requirement_briefs`, job `ai.requirement_clarify`, API `/requirement-briefs` (trần 12 lượt, quota) | `RequirementClarifier` trong `AIGeneratorModal` |
| Sinh dự án từ hồ sơ đã chốt | Hoàn thành | `POST /ai/generate-project-from-brief`; chỉ dùng mục clear/assumed, mục skipped không được bịa | Nút "Tạo dự án" / "Bỏ qua, tạo luôn" |
| Gantt chỉ đọc | Hoàn thành | `GET /projects/{id}/cpm` có cap `CPM_MAX_TASKS`/`CPM_MAX_DEPENDENCIES` (422 `resource_limit_exceeded`) | `GanttChart` SVG, trang `/projects/[id]/gantt`; kéo thả ngoài phạm vi |
| Duyệt CR BA -> PO -> PM | Hoàn thành | Submit tạo 3 bước (thiếu vai trò trả 422 `missing_roles`), `/change-requests/{id}/approvals` approve/reject, khóa hàng, audit, thông báo in-app | `ApprovalTimeline`, trang chi tiết CR |
| Phiên bản, so sánh, rollback | Hoàn thành | `versioning_service` (snapshot theo V0, cap 50), `/projects/{id}/versions` (baseline, diff, rollback), cột `tasks.archived_at` | Trang `/projects/[id]/versions`, `RollbackDialog` |
| SRS/BRD DOCX | Hoàn thành | Bảng `generated_documents`, chuỗi job `document.generate` (mỗi job một nhóm mục), storage private, `/projects/{id}/documents` + tải proxy | Trang `/projects/[id]/documents` |
| XLSX | Hoàn thành | Job `report.xlsx`, `/projects/{id}/reports/xlsx` + tải proxy, số liệu lấy từ cùng service CPM/dashboard | Nút "Xuất XLSX" ở trang tổng quan |
| BPMN | Hoàn thành | Schema `ProcessModel`, job `ai.bpmn_generate`, bảng `process_models`, PNG phía server (Pillow) chèn vào DOCX, dự phòng bảng các bước | Trang `/projects/[id]/process` (swimlane SVG) |

---

## Quyết định mặc định đang chờ người dùng duyệt

- V0 (quy tắc snapshot/rollback): snapshot gồm phase, sprint, epic, milestone, task, dependency; task mới có worklog/comment/subtask/assignment được lưu trữ (`archived_at`) thay vì xóa; task không có dữ liệu phụ thuộc bị xóa cứng; task đã xóa được tạo lại với ID mới và ghi `id_map`; worklog không bao giờ bị rollback xóa. Chi tiết trong `tasks/phase4/plan.md`.
- Người tạo CR được duyệt bước của vai trò mình (phục vụ demo ít tài khoản). Admin hệ thống chỉ xem chuỗi duyệt, không quyết định bước.
- Tài liệu sinh bằng tiếng Việt mặc định, tham số `language` nhận `vi` hoặc `en`.
- Mục hồ sơ `skipped` không chặn sinh tài liệu (hiện ở mục "Giả định và vấn đề mở"); mục `missing` đưa hồ sơ về vòng hỏi làm rõ.

---

## Hạn chế đã biết

- Quota AI: mỗi lượt hỏi làm rõ, mỗi nhóm mục tài liệu (SRS 3 lượt, BRD 4 lượt) và mỗi lần sinh BPMN tính vào `AI_DAILY_JOB_LIMIT` (mặc định 20/ngày).
- Render dùng runtime Python: nếu không có font TTF có glyph tiếng Việt, chữ trong PNG BPMN bị bỏ dấu (vẫn đọc được).
- Snapshot nhất quán theo khóa hàng dự án ở mức READ COMMITTED; ghi task đồng thời có thể làm snapshot lệch nhẹ giữa các bảng.
- Khi dự án có 50 phiên bản đều là baseline, bước PM duyệt cuối nhận 409 vì không tạo được snapshot.
- Chưa có chế độ provider AI giả ở server để diễn tập demo không tốn quota.

---

*Cập nhật lần cuối: 2026-10-18 — Phase 4 — nhánh `feature/phase4-workflow-reporting` đã merge vào `main` và xóa. Tất cả lát (1–5) đã hoàn thành phần mã nguồn; nghiệm thu cloud và chạy thử provider AI thật vẫn chờ người dùng.*
