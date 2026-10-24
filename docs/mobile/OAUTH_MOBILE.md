# Khảo sát đăng nhập Google trên app Android

> Trạng thái: **khảo sát + đề xuất, chưa triển khai** (Giai đoạn 0, mục 0.6). Không có thay đổi mã nào cho OAuth trong giai đoạn này.

## 1. Luồng web hiện tại (đã đọc trong mã)

1. SPA mở `GET /api/v1/oauth/google/login` (`endpoints/oauth.py`). Server sinh `state` đục + `code_verifier` PKCE, lưu vào store phía server (`core/oauth_state_store.py`, Redis hoặc DB bảo mật, TTL 15 phút), đặt cookie `oauth_state` **gắn với trình duyệt đã khởi tạo**, rồi 307 sang Google.
2. Google redirect về `GOOGLE_REDIRECT_URI` (callback của **backend**, một giá trị duy nhất). Backend kiểm `state` + cookie, đổi `code` lấy hồ sơ Google (client bí mật `GOOGLE_CLIENT_SECRET` + PKCE), tạo/liên kết tài khoản (`oauth_service.py`), phát cặp token.
3. Token **không** đi qua URL: backend lưu cặp token vào `core/oauth_exchange.py` (dùng một lần, TTL 120 giây) và redirect về `FRONTEND_URL/oauth-callback?code=…`.
4. SPA `POST /auth/oauth/exchange` với mã đó và nhận phiên.

## 2. Kết luận kiểm chứng

| Câu hỏi (lộ trình §4 mục 3) | Kết luận |
|---|---|
| Mã `code` của bước 3 có dùng được từ mobile không? | **Có, về mặt API.** `/auth/oauth/exchange` không phụ thuộc trình duyệt; từ Giai đoạn 0, request kèm `X-Client: android` nhận `refresh_token` trong body (có test với mã đổi giả lập). Chưa kiểm chứng với Google thật. |
| Luồng web có dùng lại nguyên vẹn cho app được không? | **Chưa**, vì bước 3 luôn redirect về `FRONTEND_URL` (trang web), không về app. |
| Client Google hiện tại có dùng cho app được không? | **Không.** Đang là client loại *Web* (có secret, redirect HTTPS cố định). App Android cần client loại *Android* (package name + SHA-1) hoặc dùng chính client Web làm audience của ID token. |

## 3. Phương án

### A. Custom Tabs + App Link (mở rộng luồng redirect hiện tại)
App mở `/oauth/google/login?client=android&app_challenge=<S256>` trong Chrome Custom Tabs; backend lưu cờ `client` và `app_challenge` trong payload `state`; callback redirect về **Android App Link** (`https://<host>/m/oauth-callback?code=…`, xác minh qua `assetlinks.json`), app mở lại và gọi `/auth/oauth/exchange` kèm `app_verifier`.
- Ưu: dùng lại phần lớn hạ tầng; không thêm thư viện Google vào app.
- Nhược: sửa `oauth.py`, `oauth_state_store.py`, `oauth_exchange.py` (đụng luồng web, cần test hồi quy); phải thêm PKCE cho bước đổi mã vì scheme/link có thể bị app khác chặn; cần `assetlinks.json` và domain ổn định.

### B. Google Sign-In gốc → ID token → endpoint mới (đề xuất)
App dùng Credential Manager/Google Sign-In lấy **ID token**, gửi `POST /auth/oauth/google/mobile` (endpoint **mới**) kèm `X-Client: android`. Backend xác minh chữ ký (JWKS của Google, PyJWT đã có), `aud` ∈ danh sách client ID cho phép, `exp`, `email_verified == true`, rồi gọi lại đúng logic tạo/liên kết tài khoản hiện có.
- Ưu: trải nghiệm tốt nhất, không redirect, **không sửa luồng web** (chỉ thêm endpoint + biến `GOOGLE_ANDROID_CLIENT_IDS`); không cần `assetlinks.json`.
- Nhược: cần development build (không chạy trong Expo Go) và thư viện Google Sign-In; cần tái sử dụng chính sách chống chiếm tài khoản đang có (`tests/unit/test_oauth_account_takeover.py`) — tuyệt đối chỉ tin email khi `email_verified`.

### C. Hoãn
Giai đoạn 1 chỉ có email/mật khẩu (đã nằm trong phạm vi). Người dùng đăng ký bằng Google trên web có thể đặt mật khẩu bằng luồng quên mật khẩu.

## 4. Đề xuất

1. **Giai đoạn 1: chọn C** (đúng phạm vi lộ trình, không rủi ro cho web).
2. **Sau đó: làm B** như một mục riêng, kèm test chiếm tài khoản và hồi quy auth; A chỉ là phương án dự phòng nếu B bị chặn bởi hạn chế build.
3. Việc cần chủ dự án quyết trước khi làm B: tạo OAuth client loại Android (package name + SHA-1 của keystore do chủ dự án giữ) và danh sách client ID hợp lệ.

## 5. Rủi ro với luồng web
Chỉ phương án A chạm vào luồng web (state store và exchange). B và C không thay đổi bất kỳ route OAuth hiện có.
