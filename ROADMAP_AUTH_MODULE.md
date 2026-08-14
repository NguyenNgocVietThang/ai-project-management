# Roadmap: Authentication & User Onboarding Module

> **Phiên bản:** 1.1 | **Cập nhật:** 2026-08-13

---

## Tổng quan hiện trạng

### Đã hoàn thành (Already Built)

| Thành phần | File | Trạng thái |
|---|---|---|
| Login page UI | `frontend/src/app/(auth)/login/page.tsx` | Hoàn chỉnh |
| Register page UI | `frontend/src/app/(auth)/register/page.tsx` | Hoàn chỉnh |
| Auth layout (split-screen) | `frontend/src/app/(auth)/layout.tsx` | Hoàn chỉnh |
| LoginForm component | `frontend/src/features/auth/components/LoginForm.tsx` | Email + Password + Social |
| RegisterForm component | `frontend/src/features/auth/components/RegisterForm.tsx` | Email + Password + Social |
| SocialLoginButtons | `frontend/src/features/auth/components/SocialLoginButtons.tsx` | Google + Facebook |
| OAuth Callback page | `frontend/src/app/(auth)/oauth-callback/page.tsx` | OAuth 2.0 Handler |
| Route Protection Middleware | `frontend/src/middleware.ts` | Edge JWT Cookie Guard |
| Forgot Password flow | `frontend/src/app/(auth)/forgot-password/` | UI + API integration |
| Reset Password flow | `frontend/src/app/(auth)/reset-password/` | UI + API integration |
| Email Verification flow | `frontend/src/app/(auth)/verify-email/` | Banner + API verify |
| Auth store (Zustand) | `frontend/src/store/authStore.ts` | JWT persist + Cookie sync |
| useAuth hook | `frontend/src/hooks/useAuth.ts` | Login/Logout/Register/Me |
| Auth service (frontend) | `frontend/src/services/auth.service.ts` | Full Auth & OAuth endpoints |
| Profile Settings UI | `frontend/src/app/(dashboard)/profile/page.tsx` | Profile, avatar, password, linked accounts, danger zone |
| User Profile API | `backend/app/api/v1/endpoints/users.py` | Self-service profile and account settings |
| Backend auth endpoints | `backend/app/api/v1/endpoints/auth.py` | Register/Login/Forgot/Reset/Verify |
| Backend OAuth endpoints | `backend/app/api/v1/endpoints/oauth.py` | Google & Facebook OAuth |
| OAuth service (backend) | `backend/app/services/oauth_service.py` | Authlib + Token logic |
| Email utility | `backend/app/utils/email.py` | FastAPI-Mail async sending |
| Security utilities | `backend/app/core/security.py` | JWT create/verify |
| DB Migrations | `backend/alembic/versions/` | OAuth, Reset & Verification fields |

### Chưa có / Đang lên kế hoạch (Pending / In Progress)

| Tính năng | Mô tả | Độ ưu tiên | Trạng thái |
|---|---|---|---|
| Rate limiting | Chống brute-force login với `slowapi` | Medium | Security |
| Integration Testing | E2E / Unit testing toàn bộ Auth Flow | High | QA |

---

## Kế hoạch thực hiện theo Phase

---

## PHASE 1 – Core Registration & Route Protection
> **Mục tiêu:** Người dùng mới có thể tự đăng ký và hệ thống bảo vệ các route cần auth

### 1.1 – Trang Đăng Ký (Register Page)

#### Frontend

**[NEW] `frontend/src/app/(auth)/register/page.tsx`**
```
- Title: "Create your account"
- Import và render <RegisterForm />
```

**[NEW] `frontend/src/features/auth/components/RegisterForm.tsx`**
```
Fields:
  - full_name: string (required, min 2 chars)
  - username: string (required, 3-50 chars, alphanumeric + underscore)
  - email: string (required, valid email)
  - password: string (required, min 8 chars, có strength indicator)
  - confirm_password: string (required, must match password)

Behavior:
  - Dùng react-hook-form + zod validation (tương tự LoginForm)
  - On submit: gọi authService.register(data)
  - On success: tự động login -> redirect /dashboard
  - On error: hiển thị Alert với message từ server (email/username đã tồn tại)
  - Link "Already have an account? Sign in" -> /login
```

**[MODIFY] `frontend/src/services/auth.service.ts`**
```
+ Thêm method: register(data: RegisterCredentials): Promise<User>
  -> POST /auth/register với body JSON
```

**[MODIFY] `frontend/src/hooks/useAuth.ts`**
```
+ Thêm registerMutation (useMutation)
  -> On success: tự login rồi redirect dashboard
+ Export: register, isRegistering, registerError
```

**[MODIFY] `frontend/src/app/(auth)/layout.tsx`**
```
+ Thêm navigation link giữa Login <-> Register
```

#### Backend (đã có endpoint, kiểm tra schema)

**[VERIFY] `backend/app/schemas/auth.py`**
```
Kiểm tra RegisterRequest schema có đủ fields:
  - email, username, full_name, password
Nếu thiếu -> bổ sung validation (password strength, etc.)
```

---

### 1.2 – Route Protection Middleware

> **Vấn đề trước đây:** Không có gì ngăn user chưa đăng nhập truy cập `/dashboard`

**[NEW] `frontend/src/middleware.ts`** (Next.js Middleware)
```typescript
// Logic:
// 1. Đọc access_token từ cookie
// 2. Nếu request vào /dashboard/* mà không có token -> redirect /login
// 3. Nếu request vào /login hoặc /register mà đã có token -> redirect /dashboard

// Matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
```

> **Lưu ý quan trọng:** `authStore.ts` lưu token vào localStorage. Next.js middleware chạy ở Edge Runtime, không đọc được localStorage.
> **Giải pháp:** Lưu thêm access token vào cookie khi login, middleware đọc cookie đó.

**[MODIFY] `frontend/src/store/authStore.ts`**
```
+ Khi setTokens -> đồng thời set cookie 'auth-token' với js-cookie
+ Khi clear -> xóa cookie đó
```

---

## PHASE 2 – Social Login (Google & Facebook OAuth)

### 2.1 – Google OAuth

#### Backend

**[NEW] `backend/app/api/v1/endpoints/oauth.py`**
```python
@router.get("/google/login")
# Redirect user đến Google OAuth consent screen
# Params: redirect_uri, scope (email, profile), state (CSRF token)

@router.get("/google/callback")
# Google redirect về đây với ?code=xxx
# 1. Exchange code -> access_token từ Google
# 2. Fetch user info từ Google API (email, name, avatar)
# 3. Tìm user theo email trong DB:
#    - Nếu tồn tại -> update google_id, login
#    - Nếu chưa có -> tạo user mới (username auto-gen từ email, random password)
# 4. Issue JWT tokens -> redirect frontend với tokens
```

**[MODIFY] `backend/app/models/user.py`**
```python
+ google_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, unique=True)
+ facebook_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, unique=True)
+ auth_provider: Mapped[str] = mapped_column(String(50), default="local")
  # values: "local" | "google" | "facebook"
+ hashed_password: thay thành Optional (vì social login không có password)
```

**[NEW] `backend/app/services/oauth_service.py`**
```python
class OAuthService:
    async def google_login(code: str, state: str) -> TokenResponse
    async def facebook_login(code: str, state: str) -> TokenResponse
    async def _get_or_create_social_user(email, full_name, avatar_url, provider, provider_id)
```

**[MODIFY] `backend/app/core/config.py` (bổ sung fields)**
```python
+ GOOGLE_CLIENT_ID: str = ""
+ GOOGLE_CLIENT_SECRET: str = ""
+ GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/v1/oauth/google/callback"
+ FACEBOOK_APP_ID: str = ""
+ FACEBOOK_APP_SECRET: str = ""
+ FACEBOOK_REDIRECT_URI: str = "http://localhost:8000/api/v1/oauth/facebook/callback"
+ FRONTEND_URL: str = "http://localhost:3000"
```

**Dependencies (Backend):**
```
authlib>=1.3.0      # OAuth 2.0 client library
httpx>=0.27.0       # HTTP client cho OAuth API calls
fastapi-mail>=1.4.0 # Email sending
jinja2>=3.1.0       # Email templates HTML
```

#### Frontend

**[NEW] `frontend/src/features/auth/components/SocialLoginButtons.tsx`**
```
- GoogleButton: icon + "Continue with Google"
- FacebookButton: icon + "Continue with Facebook"
- onClick: window.location.href = `${API_URL}/oauth/google/login`
```

**[NEW] `frontend/src/app/(auth)/oauth-callback/page.tsx`**
```
- Page nhận ?access_token=&refresh_token= từ backend redirect
- Lưu tokens vào authStore + cookie
- Fetch /auth/me
- Redirect /dashboard
```

**[MODIFY] `frontend/src/features/auth/components/LoginForm.tsx`**
```
+ Thêm divider "Or continue with"
+ Render <SocialLoginButtons />
+ Thêm link "Forgot your password?" -> /forgot-password
```

**[MODIFY] `frontend/src/features/auth/components/RegisterForm.tsx`**
```
+ Thêm <SocialLoginButtons /> phía trên form
```

**Dependencies (Frontend):**
```
js-cookie        # Đọc/ghi cookie từ browser
@types/js-cookie # TypeScript types
```

---

### 2.2 – Facebook OAuth

> Logic tương tự Google, chỉ khác ở OAuth endpoints và user info fields.

**Lưu ý Facebook API:**
- Cần tạo Facebook App tại https://developers.facebook.com
- Permissions cần: `email`, `public_profile`
- Facebook không luôn trả về email (user có thể từ chối) -> cần handle case này

---

## PHASE 3 – Password Recovery

### 3.1 – Forgot Password

#### Backend

**[MODIFY] `backend/app/api/v1/endpoints/auth.py` (bổ sung 2 endpoints)**
```python
@router.post("/forgot-password")
# Input: { email: str }
# 1. Tìm user theo email (luôn trả 200 dù không tồn tại – tránh email enumeration)
# 2. Nếu tồn tại: tạo reset token, lưu DB với expiry 1 giờ
# 3. Gửi email với link: {FRONTEND_URL}/reset-password?token={token}
# Response: { message: "If email exists, a reset link has been sent" }

@router.post("/reset-password")
# Input: { token: str, new_password: str }
# 1. Verify token (check DB, check expiry)
# 2. Update hashed_password
# 3. Invalidate token (xóa khỏi DB)
# 4. Response: { message: "Password reset successful" }
```

**[MODIFY] `backend/app/models/user.py` (bổ sung fields)**
```python
+ password_reset_token: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
+ password_reset_expires: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
```

**[NEW] `backend/app/utils/email.py`**
```python
async def send_password_reset_email(to_email: str, reset_link: str) -> None
async def send_email_verification(to_email: str, verify_link: str) -> None
async def send_welcome_email(to_email: str, full_name: str) -> None
# Dùng FastAPI-Mail + Jinja2 templates HTML
```

**[NEW] `backend/app/templates/email/` (thư mục templates)**
```
reset_password.html
verify_email.html
welcome.html
```

#### Frontend

**[NEW] `frontend/src/app/(auth)/forgot-password/page.tsx`**
```
- Form: chỉ có email field
- On submit -> POST /auth/forgot-password
- Show success message (email-agnostic để tránh enumeration)
- Link "Back to login"
```

**[NEW] `frontend/src/app/(auth)/reset-password/page.tsx`**
```
- Đọc ?token= từ URL query params
- Form: new_password + confirm_password
- On submit -> POST /auth/reset-password
- On success -> redirect /login với success toast
```

**[MODIFY] `frontend/src/services/auth.service.ts`**
```
+ forgotPassword(email: string): Promise<void>
+ resetPassword(token: string, newPassword: string): Promise<void>
```

---

## PHASE 4 – Email Verification

### 4.1 – Xác minh email sau đăng ký

**[MODIFY] `backend/app/models/user.py`**
```python
+ email_verified: Mapped[bool] = mapped_column(Boolean, default=False)
+ email_verify_token: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
```

**[MODIFY] `backend/app/services/auth_service.py` -> register()**
```python
# Sau khi tạo user:
# 1. Tạo email verification token
# 2. Gửi email xác minh
# 3. User vẫn login được nhưng thấy banner "Please verify your email"
```

**[MODIFY] `backend/app/api/v1/endpoints/auth.py` (bổ sung)**
```python
@router.get("/verify-email")
# ?token=xxx
# Verify token -> set email_verified=True -> redirect frontend với success
```

**[NEW] `frontend/src/app/(auth)/verify-email/page.tsx`**
```
- Nhận ?token= từ URL
- Gọi GET /auth/verify-email?token=xxx
- Show loading -> success/error message
```

---

## PHASE 5 – Profile & Account Settings — Hoàn thành

### 5.1 – Trang Profile Settings

**[NEW] `frontend/src/app/(dashboard)/profile/page.tsx`**
```
Sections:
  1. Avatar upload (MinIO integration)
  2. Thông tin cơ bản: full_name, username, phone, position, department
  3. Change Password (current + new + confirm)
  4. Linked accounts (Google, Facebook – connect/disconnect)
  5. Danger zone: Delete account
```

**[MODIFY] `backend/app/api/v1/endpoints/users.py` (bổ sung)**
```python
@router.patch("/me", response_model=UserResponse)
# Cập nhật profile của current user

@router.post("/me/change-password")
# Input: { current_password, new_password }

@router.post("/me/avatar")
# Upload avatar -> MinIO -> update avatar_url

@router.get("/{user_id}/avatar")
# Stream avatar từ private MinIO bucket

@router.post("/me/linked-accounts/{provider}/connect")
@router.delete("/me/linked-accounts/{provider}")
# Connect/disconnect Google hoặc Facebook

@router.delete("/me")
# Anonymize và vô hiệu hóa tài khoản, giữ lịch sử nghiệp vụ
```

---

## Database Migrations cần tạo

| Migration file | Thay đổi |
|---|---|
| `add_oauth_fields` | Thêm `google_id`, `facebook_id`, `auth_provider` vào `users` |
| `add_password_reset_fields` | Thêm `password_reset_token`, `password_reset_expires` |
| `add_email_verification_fields` | Thêm `email_verified`, `email_verify_token` |
| `make_password_nullable` | Cho phép `hashed_password` NULL (social-only users) |
| `add_profile_security_fields` | Thêm `auth_version`, `avatar_storage_key` |

```bash
alembic revision --autogenerate -m "add_auth_extended_fields"
alembic upgrade head
```

---

## Kiểm thử (Test Checklist)

### Phase 1 – Registration
- [x] Đăng ký thành công với thông tin hợp lệ
- [x] Email đã tồn tại -> hiển thị lỗi rõ ràng
- [x] Username đã tồn tại -> hiển thị lỗi rõ ràng
- [x] Password quá ngắn -> validation error client-side
- [x] Confirm password không khớp -> validation error
- [x] Sau đăng ký -> auto login -> redirect /dashboard
- [x] Route protection: truy cập /dashboard khi chưa login -> redirect /login

### Phase 2 – Social Login
- [x] Click "Continue with Google" -> redirect Google consent
- [x] Google callback thành công -> tạo/tìm user -> JWT -> redirect /dashboard
- [x] Social login với email đã có tài khoản local -> merge (không tạo duplicate)
- [x] Facebook: tương tự Google
- [x] Facebook không trả email -> xử lý gracefully

### Phase 3 & 4 – Password Recovery & Email Verification
- [x] Nhập email tồn tại -> nhận được email reset
- [x] Nhập email không tồn tại -> vẫn trả 200 (không leak info)
- [x] Token hết hạn (sau 1h) -> hiển thị lỗi phù hợp
- [x] Token dùng 2 lần -> lần 2 thất bại (token đã bị invalidate)
- [x] Reset thành công -> login với password mới
- [x] Verify Email token link -> kích hoạt trạng thái email_verified

### Phase 5 – Profile & Account Settings
- [x] Cập nhật profile và kiểm tra username trùng
- [x] Upload/chuẩn hóa avatar WebP 512×512 qua MinIO
- [x] Đổi/đặt mật khẩu và thu hồi toàn bộ token cũ
- [x] Connect/disconnect Google và Facebook an toàn
- [x] Vô hiệu hóa, ẩn danh tài khoản và giữ lịch sử nghiệp vụ

---

## Security Checklist

- [x] **CSRF protection:** Dùng `state` parameter trong OAuth flows
- [ ] **Rate limiting:** Giới hạn số lần login thất bại/phút (dùng `slowapi`)
- [x] **Password strength:** Yêu cầu tối thiểu 8 ký tự, ít nhất 1 số hoặc ký tự đặc biệt
- [x] **Token expiry:** Access 30 phút, Refresh 7 ngày (đã config)
- [x] **Email enumeration:** Forgot password luôn trả 200
- [x] **Cookie strategy:** Đã áp dụng auth cookie cho Edge middleware guard

---

## File Tree và Trạng thái triển khai

```
frontend/src/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx                    [x] Hoàn chỉnh
│   │   ├── login/page.tsx               [x] Hoàn chỉnh
│   │   ├── register/page.tsx            [x] Đã hoàn thành (Phase 1)
│   │   ├── forgot-password/page.tsx     [x] Đã hoàn thành (Phase 3)
│   │   ├── reset-password/page.tsx      [x] Đã hoàn thành (Phase 3)
│   │   ├── verify-email/page.tsx        [x] Đã hoàn thành (Phase 4)
│   │   └── oauth-callback/page.tsx      [x] Đã hoàn thành (Phase 2)
│   └── (dashboard)/
│       └── profile/page.tsx             [x] Đã hoàn thành (Phase 5)
├── features/auth/components/
│   ├── LoginForm.tsx                    [x] Đã hoàn thành (Auth + Social link)
│   ├── RegisterForm.tsx                 [x] Đã hoàn thành (Auth + Social link)
│   ├── ForgotPasswordForm.tsx           [x] Đã hoàn thành
│   ├── ResetPasswordForm.tsx            [x] Đã hoàn thành
│   ├── EmailVerificationBanner.tsx     [x] Đã hoàn thành
│   └── SocialLoginButtons.tsx           [x] Đã hoàn thành (Google + Facebook)
├── hooks/
│   └── useAuth.ts                       [x] Đã bổ sung register mutation & verify
├── middleware.ts                        [x] Đã tạo (Route protection edge guard)
└── services/
    └── auth.service.ts                  [x] Đã tích hợp đầy đủ API endpoints

backend/app/
├── api/v1/endpoints/
│   ├── auth.py                          [x] Đã bổ sung register/forgot/reset/verify
│   └── oauth.py                         [x] Đã tạo (Google & Facebook OAuth)
├── models/
│   └── user.py                          [x] Đã bổ sung social IDs, verification & reset fields
├── services/
│   ├── auth_service.py                  [x] Đã bổ sung full auth logic
│   └── oauth_service.py                 [x] Đã tạo (Google & Facebook login handlers)
├── utils/
│   └── email.py                         [x] Đã tạo (FastAPI-Mail async service)
├── templates/email/
│   ├── reset_password.html              [x] Đã tạo
│   ├── verify_email.html               [x] Đã tạo
│   └── welcome.html                    [x] Đã tạo
└── core/
    └── config.py                        [x] Đã bổ sung OAuth & Mail configs
```
