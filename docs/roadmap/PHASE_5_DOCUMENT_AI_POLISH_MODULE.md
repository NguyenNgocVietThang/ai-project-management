# Lộ trình: Mô-đun AI tài liệu và hoàn thiện (Phase 5)

> **Phiên bản:** 1.4 | **Cập nhật:** 2026-10-13  
> **Trạng thái:** ~50% — Real-time Notification Push (`/ws/notifications` qua vé dùng một lần), quét nhắc việc hằng ngày (cron + durable jobs, thay Celery Beat), Profile/Avatar (MinIO cục bộ hoặc Supabase Storage), và Mobile Responsive menu/theme polish đã chạy thật. Document AI Parser (upload/parse tài liệu gốc) và Investor Dashboard: CHƯA làm. Lưu ý: `/projects/{id}/documents` hiện có là tài liệu SRS/BRD do hệ thống sinh (Phase 4), không phải upload/parser. 
> **Mức độ ưu tiên:** High – Tự động hóa tài liệu, Cổng nhà đầu tư, Thông báo WebSocket & Tối ưu hóa hiệu năng  
> **Điều kiện tiên quyết:** [x] Phase 1 (Auth & RBAC), Phase 2 (Project Core, CPM & Real-time Chat) đã hoàn thành

---

## Tổng quan Module

Module **Document AI & Polish (Phase 5)** hoàn thiện hệ sinh thái quản lý dự án thông minh với năng lực bóc tách tài liệu đặc tả tự động bằng AI, cung cấp cổng thông tin điều hành chỉ đọc cho Nhà đầu tư (Investor Portal), hệ thống thông báo đẩy thời gian thực qua WebSocket kết hợp quét nhắc việc hằng ngày (cron + durable jobs), và tối ưu hóa toàn diện hiệu năng backend/frontend.

### 5 Trụ cột chính:
1. **Real-time Notification Push & Scheduled Sweeps (SOP-NOTI-001):** Đẩy thông báo tức thời qua WebSocket (`/ws/notifications`), kết hợp job `cron.reminders` quét định kỳ 08:00 AM hàng ngày nhắc việc bắt đầu và sắp đến hạn.
2. **Document AI Parser (SOP-DOC-001):** Tải lên tài liệu nghiệp vụ (BRD, SRS, RFP, PDF, DOCX, TXT) lên MinIO, sử dụng AI để tự động bóc tách Requirements và gợi ý WBS. Khác với tính năng sinh SRS/BRD DOCX của Phase 4 (hệ thống viết tài liệu từ hồ sơ yêu cầu), trụ cột này đi theo chiều ngược lại: đọc tài liệu do người dùng tải lên.
3. **Investor Dashboard Portal:** Cổng thông tin điều hành chỉ đọc (Read-Only) dành riêng cho vai trò **Investor**, tổng hợp chỉ số ROI, ngân sách, sức khỏe danh mục dự án và tiến độ tổng thể.
4. **Profile & Avatar Management Polish:** Nâng cấp trang hồ sơ người dùng, hỗ trợ tải lên avatar lên MinIO, liên kết mạng xã hội và cấu hình thông báo.
5. **Performance Optimization & Mobile Responsive Polish:** Tối ưu hóa truy vấn cơ sở dữ liệu (indexing, eager loading), caching Redis, và tinh chỉnh giao diện Responsive.

---

## Hiện trạng & Hạ tầng sẵn có

| Thành phần | Trạng thái | Ghi chú |
|---|---|---|
| WebSocket Real-time Notification Push | Đã hoàn thành | `/ws/notifications`, `useNotificationSocket` |
| Lịch quét hằng ngày (cron + durable jobs) | Đã hoàn thành | Supabase Cron (hoặc cron cục bộ) gọi `POST /api/v1/internal/jobs/schedules`, sinh `cron.reminders` (08:00) và `cron.risk` (08:30); thay Celery Beat |
| MinIO File Storage & Bucket `ai-project-files` | Đã có sẵn | Lưu trữ tài liệu BRD/SRS và Avatar |
| Database Models: `documents`, `notifications`, `email_logs`, `users` | Đã migrate | Sẵn sàng lưu trữ dữ liệu |
| FastAPI-Mail & SMTP Configuration | Đã cấu hình | `backend/app/utils/email.py` & templates |
| Durable jobs (bảng `jobs` PostgreSQL) | Đã có sẵn (thay Celery) | Chạy tác vụ nền (AI, `document.generate`, `report.xlsx`, `email.*`); Document AI Parser khi làm sẽ dùng cơ chế này |
| RBAC Role `Investor` | Đã cấu hình | Hỗ trợ RBAC Guard cho chế độ Read-Only |

---

## Danh mục tính năng triển khai theo Phase

| Tính năng | Mã SOP | Độ ưu tiên | Trạng thái | Backend Task | Frontend Component |
|---|---|---|---|---|---|
| Real-time Notification Push | SOP-NOTI-001 | Critical | Hoàn thành | `NotificationService.push` + WS | `NotificationBell`, `useNotificationSocket` |
| Daily Task Sweeps | SOP-NOTI-001 | High | Hoàn thành | job `cron.reminders` (thay `notification_tasks.py` của Celery Beat) | — (Chạy ngầm tự động) |
| BRD/SRS Document AI Parser | SOP-DOC-001 | Critical | Chưa bắt đầu | Chưa có endpoint upload/parse; `/projects/{id}/documents` hiện là tài liệu SRS/BRD do hệ thống sinh (Phase 4), không nhận tệp tải lên | Chưa có |
| Investor Dashboard (Read-Only) | Portal | High | Chưa bắt đầu | Không có `InvestorService` | Chưa có |
| Avatar Upload & Profile Settings | Core | Medium | Hoàn thành | `UserService` + MinIO (`/users`) | `profile/page.tsx`, `AvatarSection` |
| Query Optimization & Redis Caching | Performance | High | Một phần | `selectinload` dùng rải rác; chưa có tầng cache Redis chủ động | Lazy charts (Recharts) |
| Mobile & Tablet Responsive Polish | UI/UX | High | Hoàn thành cơ bản | — | Menu mobile dạng modal có focus trap, Escape, chuyển đổi theme light/dark/system, thẻ KPI responsive |

---

## Chi tiết các Giai đoạn

### GIAI ĐOẠN 5.1 – Real-time Notification Push & Daily Sweep (SOP-NOTI-001)
> **Trạng thái:** Đã hoàn thành 
- Backend:
  - WebSocket `/ws/notifications?ticket=<ticket>` đẩy thông báo cá nhân theo kênh `ws:notif:user:{user_id}`, xác thực qua vé dùng một lần (single-use ticket, TTL 60s).
  - Choke point `NotificationService.push()` tự động flush và publish tới Redis Pub/Sub.
  - Quét định kỳ (ban đầu Celery Beat `sweep_task_dates_task`, nay là job `cron.reminders` do cron gọi `POST /api/v1/internal/jobs/schedules`) lúc 08:00 AM (Asia/Ho_Chi_Minh) quét các task bắt đầu hôm nay và sắp đến hạn (1 ngày trước hạn).
- Frontend:
  - `useNotificationSocket()` kết nối qua WebSocket client, tự động tăng unread count và cập nhật danh sách thông báo live.

### GIAI ĐOẠN 5.2 – BRD/SRS Document Upload & AI Document Parser (SOP-DOC-001)
> **Trạng thái:** Chưa bắt đầu — chưa có endpoint upload/parse tài liệu gốc; storage (Supabase bucket riêng tư hoặc MinIO) đã có nhưng chưa nối luồng upload document.
- Phân biệt với Phase 4: `/projects/{id}/documents` (+ `/download`) và trang `/projects/[id]/documents` hiện phục vụ tài liệu SRS/BRD DOCX do hệ thống sinh (job `document.generate`, bảng `generated_documents`). Upload và bóc tách tài liệu do người dùng cung cấp vẫn là việc của giai đoạn này; khi triển khai cần chọn đường dẫn không đụng với route tài liệu sinh.

### GIAI ĐOẠN 5.3 – Investor Dashboard Portal (Executive Read-Only View)
> **Trạng thái:** Kế hoạch tiếp theo 
- Cổng xem dữ liệu tổng hợp cấp Portfolio (ROI, tổng ngân sách, sức khỏe dự án) chỉ đọc dành riêng cho role Investor.

### GIAI ĐOẠN 5.4 – Profile Settings & Avatar Management Polish
> **Trạng thái:** Hoàn thành — trang `profile/` (ProfileDetailsForm, AvatarSection, PasswordSection, LinkedAccountsSection, DangerZoneSection); backend `/users` + MinIO.

### GIAI ĐOẠN 5.5 – Performance Optimization & Mobile Responsiveness
> **Trạng thái:** Một phần — tối ưu mobile navigation với modal focus trap, chuyển đổi theme light/dark/system mượt mà, cấu hình deploy production Render + Supabase; tầng Redis caching chủ động cho truy vấn phức tạp vẫn là kế hoạch tiếp theo.

---

*Cập nhật lần cuối: 2026-10-13 — Phase 5 (Document AI & Polish) — đối soát với mã nguồn.*
