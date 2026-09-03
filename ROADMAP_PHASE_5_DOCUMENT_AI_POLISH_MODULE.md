# Roadmap: Document AI & Polish Module (Phase 5)

> **Phiên bản:** 1.2 | **Cập nhật:** 2026-09-03  
> **Trạng thái:** 🟡 ~40% — Real-time Notification Push (`/ws/notifications`), Celery Beat daily sweep và Profile/Avatar đã chạy thật. Document AI Parser (endpoint `/documents` stub, chưa mount), Investor Dashboard, Mobile polish: CHƯA làm.  
> **Mức độ ưu tiên:** High – Tự động hóa tài liệu, Cổng nhà đầu tư, Thông báo WebSocket & Tối ưu hóa hiệu năng  
> **Điều kiện tiên quyết:** [x] Phase 1 (Auth & RBAC), Phase 2 (Project Core, CPM & Real-time Chat) đã hoàn thành

---

## Tổng quan Module

Module **Document AI & Polish (Phase 5)** hoàn thiện hệ sinh thái quản lý dự án thông minh với năng lực bóc tách tài liệu đặc tả tự động bằng AI, cung cấp cổng thông tin điều hành chỉ đọc cho Nhà đầu tư (Investor Portal), hệ thống thông báo đẩy thời gian thực qua WebSocket kết hợp Celery Beat daily sweep, và tối ưu hóa toàn diện hiệu năng backend/frontend.

### 5 Trụ cột chính:
1. **Real-time Notification Push & Scheduled Sweeps (SOP-NOTI-001):** Đẩy thông báo tức thời qua WebSocket (`/ws/notifications`), kết hợp Celery Beat quét định kỳ 08:00 AM hàng ngày nhắc việc bắt đầu và sắp đến hạn.
2. **Document AI Parser (SOP-DOC-001):** Tải lên tài liệu nghiệp vụ (BRD, SRS, RFP, PDF, DOCX, TXT) lên MinIO, sử dụng AI để tự động bóc tách Requirements và gợi ý WBS.
3. **Investor Dashboard Portal:** Cổng thông tin điều hành chỉ đọc (Read-Only) dành riêng cho vai trò **Investor**, tổng hợp chỉ số ROI, ngân sách, sức khỏe danh mục dự án và tiến độ tổng thể.
4. **Profile & Avatar Management Polish:** Nâng cấp trang hồ sơ người dùng, hỗ trợ tải lên avatar lên MinIO, liên kết mạng xã hội và cấu hình thông báo.
5. **Performance Optimization & Mobile Responsive Polish:** Tối ưu hóa truy vấn cơ sở dữ liệu (indexing, eager loading), caching Redis, và tinh chỉnh giao diện Responsive.

---

## Hiện trạng & Hạ tầng sẵn có

| Thành phần | Trạng thái | Ghi chú |
|---|---|---|
| WebSocket Real-time Notification Push | ✅ Đã hoàn thành | `/ws/notifications`, `useNotificationSocket` |
| Celery Beat Daily Sweep Scheduler | ✅ Đã hoàn thành | `app/workers/notification_tasks.py`, 08:00 AM daily |
| MinIO File Storage & Bucket `ai-project-files` | ✅ Đã có sẵn | Lưu trữ tài liệu BRD/SRS và Avatar |
| Database Models: `documents`, `notifications`, `email_logs`, `users` | ✅ Đã migrate | Sẵn sàng lưu trữ dữ liệu |
| FastAPI-Mail & SMTP Configuration | ✅ Đã cấu hình | `backend/app/utils/email.py` & templates |
| Celery Task Queue & Redis Broker | ✅ Đã có sẵn | Chạy background jobs cho Document AI & Email dispatch |
| RBAC Role `Investor` | ✅ Đã cấu hình | Hỗ trợ RBAC Guard cho chế độ Read-Only |

---

## Danh mục tính năng triển khai theo Phase

| Tính năng | Mã SOP | Độ ưu tiên | Trạng thái | Backend Task | Frontend Component |
|---|---|---|---|---|---|
| Real-time Notification Push | SOP-NOTI-001 | Critical | ✅ Hoàn thành | `NotificationService.push` + WS | `NotificationBell`, `useNotificationSocket` |
| Celery Beat Daily Task Sweeps | SOP-NOTI-001 | High | ✅ Hoàn thành | `notification_tasks.py` | — (Chạy ngầm tự động) |
| BRD/SRS Document AI Parser | SOP-DOC-001 | Critical | ❌ Chưa bắt đầu | `documents.py` là stub `TODO`, chưa mount; không có Celery task | ❌ Chưa có |
| Investor Dashboard (Read-Only) | Portal | High | ❌ Chưa bắt đầu | Không có `InvestorService` | ❌ Chưa có |
| Avatar Upload & Profile Settings | Core | Medium | ✅ Hoàn thành | `UserService` + MinIO (`/users`) | `profile/page.tsx`, `AvatarSection` |
| Query Optimization & Redis Caching | Performance | High | ⏳ Một phần | `selectinload` dùng rải rác; chưa có tầng cache Redis chủ động | Lazy charts (Recharts) |
| Mobile & Tablet Responsive Polish | UI/UX | High | ❌ Chưa làm | — | Chưa có mobile navigation riêng |

---

## Chi tiết các Giai đoạn

### GIAI ĐOẠN 5.1 – Real-time Notification Push & Celery Beat Daily Sweep (SOP-NOTI-001)
> **Trạng thái:** ✅ Đã hoàn thành  
- Backend:
  - WebSocket `/ws/notifications?token=<JWT>` đẩy thông báo cá nhân theo kênh `ws:notif:user:{user_id}`.
  - Choke point `NotificationService.push()` tự động flush và publish tới Redis Pub/Sub.
  - Celery Beat task `sweep_task_dates_task` chạy định kỳ lúc 08:00 AM (Asia/Ho_Chi_Minh) quét các task bắt đầu hôm nay và sắp đến hạn (1 ngày trước hạn).
- Frontend:
  - `useNotificationSocket()` kết nối qua WebSocket client, tự động tăng unread count và cập nhật danh sách thông báo live.

### GIAI ĐOẠN 5.2 – BRD/SRS Document Upload & AI Document Parser (SOP-DOC-001)
> **Trạng thái:** ❌ Chưa bắt đầu — `documents.py` là stub `TODO`, chưa mount; `storage_service.py` (MinIO) đã có nhưng chưa nối endpoint upload document.

### GIAI ĐOẠN 5.3 – Investor Dashboard Portal (Executive Read-Only View)
> **Trạng thái:** ⏳ Kế hoạch tiếp theo  
- Cổng xem dữ liệu tổng hợp cấp Portfolio (ROI, tổng ngân sách, sức khỏe dự án) chỉ đọc dành riêng cho role Investor.

### GIAI ĐOẠN 5.4 – Profile Settings & Avatar Management Polish
> **Trạng thái:** ✅ Hoàn thành — trang `profile/` (ProfileDetailsForm, AvatarSection, PasswordSection, LinkedAccountsSection, DangerZoneSection); backend `/users` + MinIO.

### GIAI ĐOẠN 5.5 – Performance Optimization & Mobile Responsiveness
> **Trạng thái:** ⏳ Một phần — có `selectinload` rải rác; CHƯA có tầng Redis caching chủ động, CHƯA polish mobile navigation.

---

*Cập nhật lần cuối: 2026-09-03 — Phase 5 (Document AI & Polish) — đối soát với mã nguồn.*
