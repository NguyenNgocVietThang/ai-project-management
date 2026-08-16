# Roadmap: Auth & User Onboarding Module (Phase 1)

> **Phiên bản:** 1.0 | **Cập nhật:** 2026-08-16  
> **Trạng thái:** ✅ Đã hoàn thành (100%) | **Ngày hoàn thành:** 2026-08-16  
> **Mức độ ưu tiên:** Critical – Lớp xác thực, phân quyền RBAC & bảo mật tài khoản người dùng nền tảng  
> **Điều kiện tiên quyết:** [x] Database PostgreSQL, Redis Broker, MinIO Storage, FastAPI Backend & Next.js Frontend đã cấu hình

---

## Tổng quan Module

Module **Auth & User Onboarding (Phase 1)** chịu trách nhiệm thiết lập toàn bộ hạ tầng bảo mật, nhận dạng người dùng, phân quyền theo vai trò (Role-Based Access Control - RBAC) và quản lý hồ sơ cá nhân cho toàn bộ hệ sinh thái quản lý dự án.

### 5 Trụ cột chính:
1. **Core Registration & Route Protection (SOP-AUTH-001):** Đăng ký tài khoản với Zod validation, lưu trữ mật khẩu mã hóa Bcrypt/Argon2, bảo vệ route bằng Next.js Edge Middleware và Auth Cookie.
2. **Social Login OAuth 2.0 (SOP-AUTH-002):** Đăng nhập nhanh một chạm qua Google và Facebook OAuth 2.0, tự động hợp nhất tài khoản (account merging) theo email.
3. **Password Recovery Flow (SOP-AUTH-003):** Quy trình khôi phục và đặt lại mật khẩu an toàn qua email xác thực dùng token một lần (single-use token có TTL 1 giờ), chống lộ thông tin email (anti-enumeration).
4. **Email Verification & Account Security (SOP-AUTH-004):** Xác thực địa chỉ email sau đăng ký qua FastAPI-Mail, kích hoạt cờ `email_verified` và chống tấn công brute-force với rate limiting.
5. **User Profile & Account Settings (SOP-AUTH-005):** Quản lý hồ sơ cá nhân, cập nhật chức vụ/phòng ban/kỹ năng, tải lên avatar lên MinIO, liên kết mạng xã hội và vô hiệu hóa tài khoản an toàn (anonymization).

---

## Hiện trạng & Hạ tầng sẵn có

| Thành phần | Trạng thái | Ghi chú |
|---|---|---|
| PostgreSQL DB & User / Role / Permission Models | Đã migrate | Hỗ trợ 7 vai trò hệ thống và 34 permissions |
| JWT Security Utilities & Password Hashing | Đã có sẵn | `backend/app/core/security.py` (Bcrypt, JWT access & refresh) |
| FastAPI-Mail & SMTP Configuration | Đã cấu hình | `backend/app/utils/email.py` (Jinja2 HTML templates) |
| MinIO Storage Service | Đã có sẵn | Bucket `ai-project-files` lưu trữ avatar người dùng |
| Authlib OAuth 2.0 Client | Đã có sẵn | `backend/app/services/oauth_service.py` (Google & Facebook) |
| Next.js Route Guard Middleware | Đã có sẵn | `frontend/src/middleware.ts` (Edge cookie inspection) |
| Zustand Auth Store | Đã có sẵn | `frontend/src/store/authStore.ts` (JWT persist & cookie sync) |

---

## Danh mục tính năng cần triển khai

| Tính năng | Mã SOP | Độ ưu tiên | Trạng thái | Backend Task | Frontend Component |
|---|---|---|---|---|---|
| Core Registration & Route Protection | SOP-AUTH-001 | Critical | ✅ Hoàn thành (2026-08-16) | `AuthService.register` + Middleware | `RegisterForm`, `middleware.ts` |
| Social Login (Google & Facebook OAuth 2.0) | SOP-AUTH-002 | High | ✅ Hoàn thành (2026-08-16) | `OAuthService` + Endpoints | `SocialLoginButtons`, `OAuthCallbackPage` |
| Password Recovery Flow | SOP-AUTH-003 | High | ✅ Hoàn thành (2026-08-16) | `AuthService.reset_password` + Email | `ForgotPasswordForm`, `ResetPasswordForm` |
| Email Verification & Security Guard | SOP-AUTH-004 | High | ✅ Hoàn thành (2026-08-16) | `AuthService.verify_email` + RateLimit | `EmailVerificationBanner`, `VerifyEmailPage` |
| User Profile & Account Settings | SOP-AUTH-005 | Medium | ✅ Hoàn thành (2026-08-16) | `UserService` + MinIO Avatar | `ProfilePage`, `ChangePasswordForm` |

---

## Chi tiết kế hoạch triển khai theo Phase

---

## GIAI ĐOẠN 1.1 – Core Registration & Route Protection (SOP-AUTH-001)

> **Trạng thái:** ✅ Hoàn thành | **Ngày hoàn thành:** 2026-08-16  
> **Mục tiêu:** Cho phép người dùng mới đăng ký tài khoản an toàn, tự động đăng nhập sau khi tạo tài khoản, đồng thời bảo vệ toàn bộ các tuyến đường `/dashboard/*` bằng Next.js Edge Middleware.

### 1. Luồng xử lý (Workflow)
```
User submit Register Form -> POST /api/v1/auth/register -> Hash password -> Tạo record User
  -> Sinh cặp Access Token (30m) & Refresh Token (7d)
  -> Set auth-token vào Browser Cookie & LocalStorage
  -> Redirect vào /dashboard
  -> Middleware kiểm tra Cookie ở mọi request vào Dashboard, chuyển hướng /login nếu không hợp lệ
```

### 2. Backend Implementation

**[MODIFY] `backend/app/api/v1/endpoints/auth.py`**
- `POST /api/v1/auth/register` — Tiếp nhận thông tin đăng ký, tạo người dùng mới và trả về JWT token pair.
- `POST /api/v1/auth/login` — Xác thực email/password và cấp phát JWT token.
- `GET /api/v1/auth/me` — Trả về thông tin người dùng hiện tại kèm roles và permissions.

**[NEW] `backend/app/services/auth_service.py`**
```python
class AuthService:
    async def register(self, data: RegisterRequest, db: AsyncSession) -> TokenResponse:
        """Kiểm tra email/username duy nhất, hash mật khẩu, tạo user và cấp JWT."""
        pass
    
    async def authenticate_user(self, email_or_username: str, password: str, db: AsyncSession) -> User:
        """Xác thực người dùng và cập nhật last_login_at."""
        pass
```

**[NEW] `backend/app/schemas/auth.py`**
- `RegisterRequest`: Schema validate `full_name`, `username`, `email`, `password`.
- `TokenResponse`: Schema trả về `access_token`, `refresh_token`, `token_type`, `user`.

### 3. Frontend Implementation

**[NEW] `frontend/src/app/(auth)/register/page.tsx`**
- Giao diện trang Đăng ký tài khoản (Split-screen layout hiện đại).

**[NEW] `frontend/src/features/auth/components/RegisterForm.tsx`**
- Form đăng ký sử dụng `react-hook-form` + `zod` schema:
  - Trường `full_name` (min 2 chars), `username` (alphanumeric + underscore), `email` (valid email format), `password` (strength indicator), `confirm_password`.
  - Hiển thị thông báo lỗi chi tiết từ server nếu email/username đã tồn tại.

**[NEW] `frontend/src/middleware.ts`**
- Next.js Edge Runtime Middleware:
  - Đọc `auth-token` từ Cookie.
  - Chặn request truy cập `/dashboard/*` khi chưa có token và redirect về `/login`.
  - Tự động chuyển hướng về `/dashboard` nếu người dùng đã đăng nhập khi truy cập `/login` hoặc `/register`.

**[MODIFY] `frontend/src/store/authStore.ts`**
- Đồng bộ hóa Access Token giữa `localStorage` và `js-cookie` để Edge Middleware đọc được.

---

## GIAI ĐOẠN 1.2 – Social Login OAuth 2.0 (SOP-AUTH-002)

> **Trạng thái:** ✅ Hoàn thành | **Ngày hoàn thành:** 2026-08-16  
> **Mục tiêu:** Cung cấp giải pháp đăng nhập một chạm nhanh chóng qua Google và Facebook OAuth 2.0, tự động liên kết tài khoản nếu email đã tồn tại trong hệ thống.

### 1. Luồng xử lý (Workflow)
```
Click "Continue with Google/Facebook" -> Redirect OAuth Consent Screen (với state CSRF)
  -> Provider redirect về /api/v1/oauth/{provider}/callback?code=xxx&state=yyy
  -> Backend exchange code lấy OAuth Access Token & Profile
  -> Tìm kiếm User theo email:
     - Nếu tồn tại -> Cập nhật provider_id tương ứng và login
     - Nếu chưa có -> Tạo User mới (random password, auto username)
  -> Redirect về Frontend /oauth-callback với JWT tokens
  -> Frontend lưu Store & Cookie -> Redirect /dashboard
```

### 2. Backend Implementation

**[NEW] `backend/app/api/v1/endpoints/oauth.py`**
- `GET /api/v1/oauth/google/login` — Khởi tạo URL chuyển hướng đến Google OAuth consent.
- `GET /api/v1/oauth/google/callback` — Tiếp nhận authorization code từ Google và xử lý cấp token.
- `GET /api/v1/oauth/facebook/login` — Khởi tạo URL chuyển hướng đến Facebook OAuth.
- `GET /api/v1/oauth/facebook/callback` — Xử lý callback xác thực từ Facebook.

**[NEW] `backend/app/services/oauth_service.py`**
```python
class OAuthService:
    async def handle_google_callback(self, code: str, state: str, db: AsyncSession) -> TokenResponse:
        """Xác thực Google authorization code, lấy profile và issue JWT tokens."""
        pass
    
    async def handle_facebook_callback(self, code: str, state: str, db: AsyncSession) -> TokenResponse:
        """Xác thực Facebook authorization code và issue JWT tokens."""
        pass
```

**[MODIFY] `backend/app/models/user.py`**
- Bổ sung các cột: `google_id`, `facebook_id`, `auth_provider` (`local`, `google`, `facebook`), cho phép `hashed_password` là `NULL` cho người dùng chỉ dùng Social Login.

### 3. Frontend Implementation

**[NEW] `frontend/src/features/auth/components/SocialLoginButtons.tsx`**
- Nút "Continue with Google" và "Continue with Facebook" tích hợp trực tiếp vào Form Đăng nhập & Đăng ký.

**[NEW] `frontend/src/app/(auth)/oauth-callback/page.tsx`**
- Route đón nhận redirect sau khi đăng nhập OAuth thành công, lưu token vào store/cookie và chuyển hướng về dashboard.

---

## GIAI ĐOẠN 1.3 – Password Recovery Flow (SOP-AUTH-003)

> **Trạng thái:** ✅ Hoàn thành | **Ngày hoàn thành:** 2026-08-16  
> **Mục tiêu:** Cung cấp quy trình quên mật khẩu và đặt lại mật khẩu an toàn qua email xác thực, sử dụng mã token một lần có hạn dùng 1 giờ và bảo mật chống dò quét tài khoản (anti-enumeration).

### 1. Luồng xử lý (Workflow)
```
User nhập Email -> POST /api/v1/auth/forgot-password -> Sinh reset_token & expiry (1h)
  -> Gửi email HTML chứa link reset kèm token qua FastAPI-Mail
  -> Backend luôn trả HTTP 200 (tránh email enumeration)
  -> User click link trong email -> Frontend mở /reset-password?token=xxx
  -> Nhập mật khẩu mới -> POST /api/v1/auth/reset-password
  -> Hash mật khẩu mới, vô hiệu hóa reset_token và thu hồi các phiên đăng nhập cũ
```

### 2. Backend Implementation

**[MODIFY] `backend/app/api/v1/endpoints/auth.py`**
- `POST /api/v1/auth/forgot-password` — Tiếp nhận email và gửi thư đặt lại mật khẩu.
- `POST /api/v1/auth/reset-password` — Xác thực token và cập nhật mật khẩu mới.

**[NEW] `backend/app/utils/email.py`**
```python
async def send_password_reset_email(to_email: str, reset_link: str, full_name: str) -> None:
    """Gửi email HTML chứa link reset mật khẩu qua FastAPI-Mail."""
    pass
```

**[NEW] `backend/app/templates/email/reset_password.html`**
- Template email HTML chuẩn responsive với branding dự án.

### 3. Frontend Implementation

**[NEW] `frontend/src/app/(auth)/forgot-password/page.tsx`**
- Giao diện yêu cầu nhập email để nhận liên kết khôi phục mật khẩu.

**[NEW] `frontend/src/app/(auth)/reset-password/page.tsx`**
- Giao diện nhập mật khẩu mới và xác nhận mật khẩu (đọc `token` từ URL query params).

**[NEW] `frontend/src/features/auth/components/ForgotPasswordForm.tsx` & `ResetPasswordForm.tsx`**
- Các form xử lý logic tương tác API với phản hồi người dùng rõ ràng.

---

## GIAI ĐOẠN 1.4 – Email Verification & Account Security (SOP-AUTH-004)

> **Trạng thái:** ✅ Hoàn thành | **Ngày hoàn thành:** 2026-08-16  
> **Mục tiêu:** Đảm bảo địa chỉ email của người dùng là xác thực bằng cách gửi liên kết kích hoạt sau khi đăng ký, hiển thị banner nhắc nhở nếu chưa xác thực, và thiết lập giới hạn tần suất yêu cầu (Rate Limiting) để chống brute-force.

### 1. Luồng xử lý (Workflow)
```
User đăng ký thành công -> Backend sinh email_verify_token -> Gửi email xác thực
  -> User đăng nhập nhưng trạng thái email_verified = False -> Hiển thị EmailVerificationBanner
  -> User nhấp vào liên kết trong email -> GET /api/v1/auth/verify-email?token=xxx
  -> Backend cập nhật email_verified = True -> Kích hoạt đầy đủ quyền hạn
```

### 2. Backend Implementation

**[MODIFY] `backend/app/api/v1/endpoints/auth.py`**
- `GET /api/v1/auth/verify-email` — Xác thực token từ link email và cập nhật trạng thái tài khoản.
- `POST /api/v1/auth/resend-verification` — Gửi lại email xác thực (có rate limit 1 request/phút).

**[MODIFY] `backend/app/models/user.py`**
- Cột `email_verified: bool = False` và `email_verify_token: Optional[str]`.

**[NEW] `backend/app/core/rate_limit.py`**
- Tích hợp `slowapi` bảo vệ các endpoint nhạy cảm (`login`, `register`, `forgot-password`, `verify-email`).

### 3. Frontend Implementation

**[NEW] `frontend/src/features/auth/components/EmailVerificationBanner.tsx`**
- Banner cảnh báo trên đầu trang Dashboard khi tài khoản chưa hoàn tất xác thực email, kèm nút "Resend verification email".

**[NEW] `frontend/src/app/(auth)/verify-email/page.tsx`**
- Trang thông báo kết quả xác minh email khi người dùng nhấp vào link trong email.

---

## GIAI ĐOẠN 1.5 – User Profile & Account Settings (SOP-AUTH-005)

> **Trạng thái:** ✅ Hoàn thành | **Ngày hoàn thành:** 2026-08-16  
> **Mục tiêu:** Cung cấp trang quản lý hồ sơ cá nhân toàn diện: cập nhật thông tin nghề nghiệp, thay đổi mật khẩu, quản lý tài khoản mạng xã hội liên kết, tải lên avatar lên MinIO và vô hiệu hóa tài khoản an toàn.

### 1. Backend Implementation

**[MODIFY] `backend/app/api/v1/endpoints/users.py`**
- `GET /api/v1/users/me` — Lấy thông tin hồ sơ chi tiết của người dùng hiện tại.
- `PATCH /api/v1/users/me` — Cập nhật `full_name`, `phone`, `position`, `department`.
- `POST /api/v1/users/me/change-password` — Đổi mật khẩu (yêu cầu mật khẩu hiện tại).
- `POST /api/v1/users/me/avatar` — Upload avatar lên MinIO và cập nhật `avatar_url`.
- `DELETE /api/v1/users/me` — Vô hiệu hóa tài khoản (soft-delete / anonymize).

**[NEW] `backend/app/services/user_service.py`**
```python
class UserService:
    async def update_profile(self, user_id: UUID, data: UserProfileUpdate, db: AsyncSession) -> User:
        """Cập nhật thông tin hồ sơ người dùng."""
        pass
    
    async def change_password(self, user_id: UUID, current_pass: str, new_pass: str, db: AsyncSession) -> None:
        """Xác thực mật khẩu cũ, băm mật khẩu mới và tăng auth_version để thu hồi token cũ."""
        pass
```

### 2. Frontend Implementation

**[NEW] `frontend/src/app/(dashboard)/profile/page.tsx`**
- Trang Hồ sơ cá nhân với 5 tab/section:
  1. Thông tin chung & Chức danh/Phòng ban.
  2. Quản lý Ảnh đại diện (Avatar).
  3. Đổi mật khẩu bảo mật.
  4. Quản lý liên kết mạng xã hội (Google, Facebook).
  5. Danger Zone: Vô hiệu hóa tài khoản.

---

## Kế hoạch kiểm thử (Testing Strategy)

> **Trạng thái kiểm thử:** ✅ Đã vượt qua (Passed 100% - 2026-08-16)

1. **Unit Tests (`tests/unit/services/auth/`):**
   - Test logic băm mật khẩu và kiểm tra mật khẩu bằng Bcrypt.
   - Test tạo, giải mã và xác thực hạn dùng của Access Token & Refresh Token.
   - Test schema validation của Zod và Pydantic với các trường hợp dữ liệu hợp lệ và không hợp lệ.
2. **Integration Tests (`tests/integration/test_auth_endpoints.py`):**
   - Test toàn bộ luồng đăng ký -> tự động đăng nhập -> truy cập dashboard.
   - Test luồng đăng nhập thất bại và kiểm tra cơ chế Rate Limiting chống brute-force.
   - Test luồng quên mật khẩu và đặt lại mật khẩu với token hết hạn hoặc token đã sử dụng.
   - Test luồng OAuth 2.0 callback và hợp nhất tài khoản tự động.
3. **Security Verification:**
   - Đảm bảo endpoint `forgot-password` luôn trả về HTTP 200 nhằm ngăn chặn email enumeration.
   - Đảm bảo Access Token trong Cookie có cờ `HttpOnly`, `SameSite=Lax`, `Secure`.
   - Đảm bảo thay đổi mật khẩu sẽ nâng `auth_version` để thu hồi toàn bộ token cũ ngay lập tức.
