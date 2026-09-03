# Roadmap: Auth & User Onboarding Module (Phase 1)

> **Phiên bản:** 1.1 | **Cập nhật:** 2026-08-22  
> **Trạng thái:** ✅ Đã hoàn thành (100%) | **Ngày hoàn thành:** 2026-08-22  
> **Mức độ ưu tiên:** Critical – Lớp xác thực, phân quyền RBAC, bảo mật tài khoản & Quản trị Admin  
> **Điều kiện tiên quyết:** [x] Database PostgreSQL, Redis Broker, MinIO Storage, FastAPI Backend & Next.js Frontend đã cấu hình

---

## Tổng quan Module

Module **Auth & User Onboarding (Phase 1)** chịu trách nhiệm thiết lập toàn bộ hạ tầng bảo mật, nhận dạng người dùng, phân quyền theo vai trò (Role-Based Access Control - RBAC), quản lý hồ sơ cá nhân và cung cấp cổng Quản trị hệ thống (Admin Portal) cho toàn bộ nền tảng.

### 6 Trụ cột chính:
1. **Core Registration & Route Protection (SOP-AUTH-001):** Đăng ký tài khoản với Zod validation, lưu trữ mật khẩu mã hóa Bcrypt, bảo vệ route bằng Next.js Edge Middleware và Auth Cookie.
2. **Social Login OAuth 2.0 (SOP-AUTH-002):** Đăng nhập nhanh một chạm qua Google và Facebook OAuth 2.0, tự động hợp nhất tài khoản (account merging) theo email.
3. **Password Recovery Flow (SOP-AUTH-003):** Quy trình khôi phục và đặt lại mật khẩu an toàn qua email xác thực dùng token một lần (single-use token có TTL 1 giờ), chống lộ thông tin email (anti-enumeration).
4. **Email Verification & Account Security (SOP-AUTH-004):** Xác thực địa chỉ email sau đăng ký qua FastAPI-Mail, kích hoạt cờ `email_verified` và chống tấn công brute-force với rate limiting.
5. **User Profile & Account Settings (SOP-AUTH-005):** Quản lý hồ sơ cá nhân, cập nhật chức vụ/phòng ban/kỹ năng, tải lên avatar lên MinIO, liên kết mạng xã hội và vô hiệu hóa tài khoản an toàn.
6. **Admin Management & RBAC Control (SOP-ADM-001):** Quản trị danh sách người dùng (`/admin/users`), tạo & quản lý vai trò và phân bổ 34 quyền granular (`/admin/roles`), và theo dõi dòng sự kiện biến động toàn hệ thống (`/admin/audit`).

---

## Hiện trạng & Hạ tầng sẵn có

| Thành phần | Trạng thái | Ghi chú |
|---|---|---|
| PostgreSQL DB & User / Role / Permission Models | Đã migrate | Hỗ trợ 7 vai trò hệ thống và 34 permissions |
| JWT Security Utilities & Password Hashing | Đã có sẵn | `backend/app/core/security.py` (Bcrypt, JWT access & refresh) |
| FastAPI-Mail & SMTP Configuration | Đã cấu hình | `backend/app/utils/email.py` (Jinja2 HTML templates) |
| MinIO Storage Service | Đã có sẵn | Bucket `ai-project-files` lưu trữ avatar người dùng |
| Authlib / OAuth Client | Đã có sẵn | `backend/app/services/oauth_service.py` (Google & Facebook) |
| Next.js Route Guard Middleware | Đã có sẵn | `frontend/src/middleware.ts` (Edge cookie inspection) |
| Zustand Auth Store | Đã có sẵn | `frontend/src/store/authStore.ts` (JWT persist & cookie sync) |
| Admin Service & Endpoints | Đã có sẵn | `admin_service.py`, `role_service.py`, `audit_service.py` |

---

## Danh mục tính năng đã triển khai

| Tính năng | Mã SOP | Độ ưu tiên | Trạng thái | Backend Task | Frontend Component |
|---|---|---|---|---|---|
| Core Registration & Route Protection | SOP-AUTH-001 | Critical | ✅ Hoàn thành | `AuthService.register` + Middleware | `RegisterForm`, `middleware.ts` |
| Social Login (Google & Facebook OAuth 2.0) | SOP-AUTH-002 | High | ✅ Hoàn thành | `OAuthService` + Endpoints | `SocialLoginButtons`, `OAuthCallbackPage` |
| Password Recovery Flow | SOP-AUTH-003 | High | ✅ Hoàn thành | `AuthService.reset_password` + Email | `ForgotPasswordForm`, `ResetPasswordForm` |
| Email Verification & Security Guard | SOP-AUTH-004 | High | ✅ Hoàn thành | `AuthService.verify_email` + RateLimit | `EmailVerificationBanner`, `VerifyEmailPage` |
| User Profile & Account Settings | SOP-AUTH-005 | Medium | ✅ Hoàn thành | `UserService` + MinIO Avatar | `ProfilePage`, `ChangePasswordForm` |
| Admin User & Role Management | SOP-ADM-001 | High | ✅ Hoàn thành | `AdminService`, `RoleService` | `AdminUserList`, `RoleForm` |
| System Audit Timeline Inspection | SOP-AUD-001 | Medium | ✅ Hoàn thành | `AuditService` (Cursor pagination) | `AuditTimelineView` |

---

## Chi tiết các Giai đoạn đã hoàn thành

### GIAI ĐOẠN 1.1 – Core Registration & Route Protection (SOP-AUTH-001)
- Backend: `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/auth/me`.
- Frontend: `RegisterForm`, `LoginForm`, `middleware.ts` Edge cookie protection, `authStore.ts`.

### GIAI ĐOẠN 1.2 – Social Login OAuth 2.0 (SOP-AUTH-002)
- Backend: `GET /api/v1/oauth/{provider}/login`, `GET /api/v1/oauth/{provider}/callback` (Google & Facebook).
- Frontend: `SocialLoginButtons.tsx`, `/app/(auth)/oauth-callback/page.tsx`.

### GIAI ĐOẠN 1.3 – Password Recovery Flow (SOP-AUTH-003)
- Backend: `POST /api/v1/auth/forgot-password`, `POST /api/v1/auth/reset-password`, FastAPI-Mail template.
- Frontend: `ForgotPasswordForm.tsx`, `ResetPasswordForm.tsx`.

### GIAI ĐOẠN 1.4 – Email Verification & Security Guard (SOP-AUTH-004)
- Backend: `GET /api/v1/auth/verify-email`, `POST /api/v1/auth/resend-verification`.
- Frontend: `EmailVerificationBanner.tsx`, `/app/(auth)/verify-email/page.tsx`.

### GIAI ĐOẠN 1.5 – User Profile & Account Settings (SOP-AUTH-005)
- Backend: `GET/PATCH /api/v1/users/me`, `POST /api/v1/users/me/change-password`, `POST /api/v1/users/me/avatar`.
- Frontend: `/app/(dashboard)/profile/page.tsx`.

### GIAI ĐOẠN 1.6 – Admin Management & RBAC Control (SOP-ADM-001)
- Backend:
  - `AdminUserService` (`app/services/admin_service.py`): CRUD người dùng, kích hoạt/vô hiệu hóa, bảo vệ tài khoản admin cuối.
  - `RoleService` (`app/services/role_service.py`): CRUD vai trò, gán 34 permissions, bảo vệ vai trò "Admin".
  - `AuditService` (`app/services/audit_service.py`): Lấy danh sách audit logs với phân trang và bộ lọc entity.
  - Endpoints: `/api/v1/users`, `/api/v1/roles`, `/api/v1/permissions`, `/api/v1/audit`.
- Frontend:
  - `/app/(dashboard)/admin/users/page.tsx`: Danh sách & thao tác kích hoạt người dùng.
  - `/app/(dashboard)/admin/roles/page.tsx`: Danh sách vai trò & `RoleForm.tsx` phân quyền theo Resource matrix.
  - `/app/(dashboard)/admin/audit/page.tsx`: Timeline truy vết biến động toàn hệ thống.

---

*Cập nhật lần cuối: 2026-09-03 — Phase 1 hoàn thành 100% (đối soát với mã nguồn: auth/oauth/users/roles/permissions/audit đều mount & có unit test).*
