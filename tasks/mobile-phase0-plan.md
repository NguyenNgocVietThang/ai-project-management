# Kế hoạch Giai đoạn 0 — Chuẩn bị backend cho client di động

> Trạng thái: **ĐÃ DUYỆT (2026-10-24)** — Giai đoạn 0; commit thẳng `main`; payload push dùng tiêu đề gốc; G3+G6 đúng; giữ `DELETE /devices/{token}`; tối đa 10 thiết bị/người, 1 job/thiết bị; `/app/config` một bộ phiên bản.
> Baseline trước khi sửa (Python 3.11): 713 passed, 28 skipped.
> Nguồn phạm vi: `docs/mobile/ANDROID_ROADMAP.md` mục 6 «Giai đoạn 0» (hiện chỉ có ở nhánh
> `origin/claude/tender-cori-mzi6u3`, chưa vào `main`).

## 0. Các điểm cần chủ dự án chốt trước (xem cuối file, mục 9)

Có 3 điểm chặn và 4 quyết định thiết kế. Tóm tắt nhanh:
1. Prompt chưa nêu rõ giai đoạn → tôi **giả định là Giai đoạn 0** (các giai đoạn 1–3 đều yêu cầu Giai đoạn 0 đã merge).
2. Lộ trình chưa có trên `main` / nhánh làm việc → cần đưa vào nhánh này.
3. Prompt nói «làm luôn ở main» nhưng đồng thời yêu cầu «mở PR draft» → hai điều này mâu thuẫn.

## 1. Phạm vi

Chỉ làm 0.1 → 0.7 của lộ trình. **Không** làm: mã app `mobile/` (Giai đoạn 1), đăng ký FCM phía app, deep link,
chat, duyệt CR, bản tin sáng gộp cron (2.6), OAuth mobile (chỉ khảo sát).

## 2. Hiện trạng đã kiểm chứng trong mã

| Hạng mục | Kết quả đọc mã |
|---|---|
| Đăng nhập | `auth.py` `login/refresh/oauth_exchange` luôn `set_session_cookies` và trả `AccessTokenResponse` (không có refresh trong body) |
| Refresh | `read_refresh_token()` ưu tiên cookie, fallback body (`RefreshRequest`) → mobile **đã** gửi được refresh qua body, nhưng chưa **nhận** được refresh mới |
| Logout | Đã thu hồi theo body (`LogoutRequest.refresh_token`) — chỉ cần thêm test cho đường mobile |
| OAuth exchange | `core/oauth_exchange.py` đổi mã một lần → `(access, refresh)`; endpoint hiện chỉ set cookie |
| Tạo thông báo | Chỉ 2 điểm tạo `Notification`: `NotificationService.push()` và `push_many()` → là chỗ duy nhất cần gắn push (6 lời gọi từ các service) |
| Durable jobs | `Job` + `job_service.enqueue()` (cùng transaction, `dedupe_key` unique) + `JobRunner` + `HANDLERS` trong `durable_handlers.py`; `run_email` là mẫu (`mark_dispatched`, `RetryableJobError`/`PermanentJobError`) |
| Adapter ngoài | `utils/email.py`: provider chọn bằng biến môi trường, lỗi sạch không lộ nội dung provider, timeout cấu hình → làm mẫu cho `utils/push.py` |
| Migration | Head hiện tại: `20261016_investor_portal` |
| OpenAPI | `docs_url/openapi_url` tắt khi `APP_ENV != development`; `app.openapi()` vẫn gọi được trong mã |
| CORS | `allow_headers=["*"]` → trình duyệt cross-origin vẫn gửi được `X-Client` (xem rủi ro bảo mật mục 7.1) |
| CI | Chỉ có `.github/workflows/security.yml` (job `tests` chạy pytest, ruff lint) |
| Môi trường này | **Chưa cài pytest/dependencies** → bước đầu thực thi: `pip install -r requirements.txt -r requirements-dev.txt` rồi chạy baseline, báo số liệu trước khi sửa |

## 3. Thiết kế chi tiết theo từng mục

### 0.1 Auth mobile (`X-Client: android`)

- `app/core/auth_cookies.py`: thêm hằng `CLIENT_HEADER = "x-client"`, hàm `is_mobile_client(request)`.
- `app/schemas/auth.py`: thêm `MobileTokenResponse(access_token, refresh_token, token_type)`.
- `auth.py`: `login`, `refresh`, `oauth/exchange`:
  - client web (không header): **y hệt hiện nay** (cookie + `AccessTokenResponse`, body không có `refresh_token`).
  - client mobile: **không set cookie**, trả `MobileTokenResponse`.
  - `response_model=AccessTokenResponse | MobileTokenResponse` để OpenAPI sinh đúng kiểu cho Giai đoạn 1.
- **Chống leo thang từ XSS**: ở `/auth/refresh`, chỉ trả refresh token trong body khi refresh token *đến từ body* (không phải từ cookie). Lý do: XSS trên web có thể tự gắn header `X-Client`, nhưng không đọc được cookie httpOnly để đặt vào body → không lấy được refresh token. Với `login` (cần mật khẩu) và `oauth/exchange` (cần mã dùng một lần) header là đủ.
- `logout`: không đổi logic (đã thu hồi theo body); thêm test mobile. Cookie dọn như cũ (vô hại).
- Phát hiện phụ (không sửa trong giai đoạn này): `refresh` dùng chung `REFRESH_LIMIT` theo IP — nhiều thiết bị cùng NAT có thể chạm giới hạn; ghi vào PR.

### 0.2 Device token

- Model `app/models/device_token.py`: `user_id` (FK users, CASCADE), `token` (String(512), **unique**), `platform` (CHECK `android|ios`), `app_version`, `locale` (`vi|en`), `last_seen_at`, `revoked_at`; index `(user_id, revoked_at)`. Đăng ký trong `app/db/base.py` và `User` nếu cần quan hệ.
- Migration `alembic/versions/20261024_device_tokens.py` (down_revision `20261016_investor_portal`), có `downgrade`.
- `app/schemas/device.py`, `app/services/device_service.py`, `app/api/v1/endpoints/devices.py`, mount `/devices` trong `router.py`.
- `POST /devices` (cần đăng nhập; rate limit): upsert theo `token`. Token đã thuộc **người khác** (máy đổi tài khoản) → chuyển cho người gọi, xóa `revoked_at`, cập nhật `last_seen_at`. Trả 200/201 kèm id.
- `DELETE /devices/{token}`: chỉ xóa/thu hồi token **của chính người gọi**; token không tồn tại hoặc của người khác → trả 204 như nhau (không dò được sự tồn tại). Token nằm trên URL nên sẽ vào access log; chấp nhận vì token FCM đơn lẻ không đủ để gửi push (cần service account) — nêu ở mục 9 nếu bạn muốn đổi sang `POST /devices/unregister` (body).
- Giới hạn tối đa N token hoạt động/người (đề xuất 10), vượt thì thu hồi token cũ nhất — tránh phình bảng trên Supabase Free.

### 0.3 Kênh push (`push.send`)

- Cấu hình (`config.py`): `PUSH_PROVIDER: Literal["disabled","fake","fcm"] = "disabled"`, `FCM_PROJECT_ID`, `FCM_SERVICE_ACCOUNT_JSON` (secret), `PUSH_HTTP_TIMEOUT_SECONDS`. Validator production: `fake` bị từ chối; `fcm` bắt buộc đủ project id + service account. Mặc định `disabled` ⇒ **hành vi hiện tại không đổi** khi chưa cấu hình.
- Adapter `app/utils/push.py`: `send_push(token, payload, idempotency_key)`; provider `fake` ghi vào danh sách trong bộ nhớ (test không gọi mạng) và cho phép chèn kết quả giả (`UNREGISTERED`, lỗi tạm); provider `fcm` dùng `httpx` + JWT ký RS256 bằng `PyJWT[crypto]` (**đã có sẵn**, không thêm thư viện) để lấy OAuth2 token (cache đến gần hết hạn), gọi `https://fcm.googleapis.com/v1/projects/{id}/messages:send`. Lỗi → `PushDeliveryError(retryable, unregistered)` không chứa nội dung phản hồi (theo mẫu `EmailDeliveryError`).
- Gắn vào `NotificationService.push()` / `push_many()`: sau `flush`, nếu `PUSH_PROVIDER != disabled`, truy vấn token hoạt động của người nhận (một truy vấn cho cả lô trong `push_many`) và `enqueue(kind="push.send", dedupe_key=f"push:{notification.id}:{device.id}", owner_id=user_id, ...)` **trong cùng transaction** — người không có thiết bị thì không tạo job nào.
- Handler `run_push` trong `durable_handlers.py` (đăng ký `HANDLERS["push.send"]`): nạp lại thông báo + token; bỏ qua (Permanent) nếu thông báo bị xóa/đã đọc, token đã thu hồi hoặc người dùng bị vô hiệu; `mark_dispatched` rồi gửi; `UNREGISTERED`/token không hợp lệ → đặt `revoked_at`; lỗi tạm → `RetryableJobError`.
- Mã lỗi mới trong `ERROR_CODES`: `push_unconfigured`.
- **Payload (đã duyệt: dùng tiêu đề gốc)**: `data` = `notification_id`, `notification_type`, `related_entity_type`, `related_entity_id`, `link`; hiển thị = `Notification.title` gốc (cắt tối đa 120 ký tự). **Không** gửi `Notification.message`. Rủi ro đã chấp nhận: tiêu đề có thể hiện tên task/dự án trên màn hình khóa.
- Một job cho mỗi (thông báo × thiết bị) để retry không gửi trùng sang thiết bị đã nhận.

### 0.4 `GET /app/config`

- Công khai (app gọi trước khi đăng nhập), có rate limit, `Cache-Control: no-store`.
- Biến môi trường: `APP_MIN_SUPPORTED_VERSION` (mặc định `0.0.0`), `APP_LATEST_VERSION` (mặc định `0.0.0`), `MAINTENANCE_MODE` (bool), `MAINTENANCE_MESSAGE` (tùy chọn). Validator: đúng dạng `x.y.z`, `min <= latest`.
- Chỉ thông tin; **không** chặn các endpoint khác khi bảo trì (ngoài phạm vi).
- File: `endpoints/app_config.py`, `schemas/app_config.py`, mount `/app`.

### 0.5 Xuất OpenAPI

- `backend/scripts/export_openapi.py`: gọi `app.openapi()` (không cần `APP_ENV=development`), ghi `mobile/openapi/openapi.json` ổn định (`sort_keys`, indent 2, xuống dòng cuối). Tham số `--check` để so sánh với file đã commit.
- Test `tests/unit/test_openapi_export.py`: sinh được, có đủ đường dẫn mới (`/devices`, `/app/config`, `MobileTokenResponse`), và file commit không lệch.
- CI: thêm bước `python scripts/export_openapi.py --check` vào job `tests` trong `security.yml` (không thêm workflow mới).
- Lưu ý: tạo thư mục `mobile/` sớm hơn Giai đoạn 1 chỉ để chứa `openapi/` (theo giả định G6).

### 0.6 Khảo sát OAuth Google trên mobile (chỉ tài liệu)

- Viết `docs/mobile/OAUTH_MOBILE.md`: phân tích luồng hiện tại (`oauth.py`, `oauth_service.py`, `oauth_state_store.py`, cookie state gắn trình duyệt, redirect về `FRONTEND_URL/oauth-callback?code=`), so sánh 3 phương án: (A) Custom Tabs + App Link/custom scheme về app rồi `/auth/oauth/exchange` với `X-Client`; (B) Google Sign-In gốc + endpoint xác minh ID token mới; (C) hoãn, chỉ email/mật khẩu cho MVP. Nêu đề xuất, rủi ro với luồng web, và phần việc ở Giai đoạn sau. **Không triển khai.**

### 0.7 Kiểm thử + tài liệu

- README §10: thêm `/devices`, `/app/config`, header `X-Client`, ghi chú mô hình auth hai chế độ.
- `docs/deploy-render-supabase.md`: biến FCM, cách tạo service account (Firebase Console → Project settings → Service accounts → vai trò «Firebase Cloud Messaging API Admin» tối thiểu), đặt `FCM_SERVICE_ACCOUNT_JSON` là secret.
- `.env.production.example` và `render.yaml` (`sync: false` cho secret): thêm biến mới, **không** có giá trị thật.
- `docs/mobile/` (nếu đưa vào nhánh này): cập nhật bảng «Nhật ký tiến độ» + `tasks/progress.md` cuối giai đoạn.

## 4. Danh sách file

**Tạo mới:** `app/models/device_token.py`, `alembic/versions/20261024_device_tokens.py`, `app/schemas/device.py`, `app/services/device_service.py`, `app/api/v1/endpoints/devices.py`, `app/schemas/app_config.py`, `app/api/v1/endpoints/app_config.py`, `app/utils/push.py`, `backend/scripts/export_openapi.py`, `mobile/openapi/openapi.json`, `docs/mobile/OAUTH_MOBILE.md`.
**Sửa:** `app/api/v1/endpoints/auth.py`, `app/core/auth_cookies.py`, `app/schemas/auth.py`, `app/core/config.py`, `app/api/v1/router.py`, `app/db/base.py`, `app/models/user.py` (nếu cần), `app/services/notification_service.py`, `app/services/durable_handlers.py`, `app/services/job_service.py` (`ERROR_CODES`), `.github/workflows/security.yml`, `README.md`, `docs/deploy-render-supabase.md`, `.env.production.example`, `render.yaml`, `tasks/progress.md`, `docs/mobile/ANDROID_ROADMAP.md`.

## 5. Kiểm thử

| Nhóm | Test (pytest) |
|---|---|
| 0.1 | Web login/refresh/oauth-exchange: body **không** có `refresh_token`, cookie vẫn được set (không đổi). Mobile: body có `refresh_token`, không set cookie. Xoay vòng: refresh mobile hai lần liên tiếp đúng; dùng lại token cũ bị phát hiện reuse (hủy mọi phiên). Header `X-Client` + refresh đến từ **cookie** ⇒ không lộ refresh trong body. Logout mobile thu hồi refresh theo body |
| 0.2 | Đăng ký, upsert idempotent, chuyển token giữa 2 người, xóa token người khác trả 204 nhưng không đổi dữ liệu, giới hạn số token, cần đăng nhập, `platform/locale` sai → 422 |
| 0.3 | Enqueue cùng transaction (rollback ⇒ không có job), không enqueue khi `disabled` hoặc không có thiết bị, `push_many` đúng số job, dedupe, handler gửi payload trung tính (không có title/message gốc), `UNREGISTERED` ⇒ thu hồi token, lỗi tạm ⇒ retry, thông báo đã đọc/xóa ⇒ bỏ qua, adapter FCM với `httpx.MockTransport` (lấy token OAuth, 200, 404 UNREGISTERED, 5xx, timeout) — **không gọi mạng thật**, validator production |
| 0.4 | Mặc định, giá trị từ env, định dạng sai ⇒ lỗi khởi động, truy cập không cần đăng nhập |
| 0.5 | Xuất ổn định (hai lần chạy giống nhau), `--check` lệch ⇒ thoát mã ≠ 0 |
| Chung | Chạy **toàn bộ** pytest hiện có; migration upgrade/downgrade trên SQLite test và (nếu có Postgres cục bộ) PostgreSQL; `ruff check app tests` |
| Web | Frontend không đổi; vẫn chạy `npm test`, `type-check`, `lint` để chứng minh không hỏng (nếu `node_modules` cài được trong môi trường này) |

## 6. Trình tự commit nhỏ (dự kiến)

1. `docs(mobile)`: đưa lộ trình + prompt vào nhánh (cherry-pick `5c6ef95`).
2. `test`: baseline đã đo (chỉ ghi nhận, không commit nếu không có thay đổi).
3. `feat(auth)`: chế độ auth mobile + test.
4. `feat(devices)`: model, migration, endpoint + test.
5. `feat(config)`: `GET /app/config` + test.
6. `feat(push)`: cấu hình, adapter, gắn outbox, handler + test.
7. `feat(openapi)`: script xuất + `mobile/openapi/openapi.json` + CI + test.
8. `docs(mobile)`: OAuth mobile, README §10, deploy, env example, nhật ký tiến độ.
9. `graphify update .` (nếu lệnh có sẵn; hiện `which graphify` không tìm thấy trong môi trường này).

## 7. Rủi ro

1. **Bảo mật — header tự khai báo**: `X-Client` có thể bị giả mạo; đã giảm bằng quy tắc «refresh từ cookie không bao giờ lộ ra body» (mục 0.1). Rủi ro còn lại: kẻ có sẵn refresh token đã đánh cắp được dùng được — đó là mô hình đe dọa vốn có của refresh token, không mới.
2. **Hiệu năng Free tier**: mỗi thông báo thêm một truy vấn token (+ job). Giảm: chỉ chạy khi `PUSH_PROVIDER != disabled`, một truy vấn/lô, job theo thiết bị chỉ cho người có thiết bị, tối đa 10 thiết bị/người.
3. **Trùng push**: giao hàng ít nhất một lần; dedupe theo (thông báo × thiết bị) và `mark_dispatched` giảm chứ không loại bỏ hoàn toàn trùng khi mất lease sau khi gửi. Chấp nhận (thông báo vẫn nằm trong danh sách trong app).
4. **Không kiểm chứng được FCM thật**: chưa có Firebase project/service account → chỉ kiểm thử bằng giả lập; nghiệm thu thật để mục «chưa hoàn thành» (cùng cách `tasks/progress.md` xử lý email/S3).
5. **Union response_model**: cần test để chắc FastAPI không lọc mất `refresh_token` khỏi phản hồi mobile hay thêm vào phản hồi web.
6. **Môi trường**: pytest chưa cài; Postgres cục bộ có thể không có ⇒ test Postgres-only sẽ báo skip, tôi sẽ nêu rõ số lượng.
7. **Số lượng test baseline** (416 passed, 2 skipped theo `tasks/progress.md`) sẽ được đo lại, không dựa vào số cũ.

## 8. Ngoài phạm vi (ghi lại, không tự làm)

- Rate limit `/auth/refresh` theo IP cho nhiều thiết bị cùng NAT.
- Chế độ bảo trì chặn API thật sự.
- Triển khai OAuth mobile; thu hồi toàn bộ device token khi đổi mật khẩu / tăng `auth_version` (nên làm ở Giai đoạn 2 cùng đăng ký FCM).

## 9. Câu hỏi cần chủ dự án xác nhận

**A. Điểm chặn**
1. Có đúng là **Giai đoạn 0** không? (prompt chưa nêu giai đoạn).
2. **Nhánh/PR**: «làm ở main» và «mở PR draft» mâu thuẫn (không thể mở PR từ `main` vào `main`). Đề xuất: làm trên nhánh đã được chỉ định `claude/vigilant-dijkstra-wk08f3` (commit nhỏ), mở PR draft vào `main`. Nếu bạn thật sự muốn commit thẳng `main`, xác nhận lại và bỏ yêu cầu PR.
3. **Lộ trình chưa có trên nhánh này**: đề xuất cherry-pick commit docs `5c6ef95` (từ `claude/tender-cori-mzi6u3`) vào nhánh làm việc để cập nhật «Nhật ký tiến độ». Đồng ý?

**B. Giả định G1–G6 ảnh hưởng Giai đoạn 0** (lộ trình ghi «chờ duyệt»)
4. **G3** (sửa backend trong repo này): cần xác nhận — Giai đoạn 0 phụ thuộc hoàn toàn vào đây.
5. **G6** (monorepo, thư mục `mobile/`): ảnh hưởng nơi lưu `openapi.json` — xác nhận.
6. G1/G2/G4/G5 không ảnh hưởng mã Giai đoạn 0 (G1 chỉ ảnh hưởng cách dùng `openapi.json` ở Giai đoạn 1).

**C. Quyết định thiết kế**
7. Payload push: **trung tính theo loại thông báo** (đề xuất) hay dùng tiêu đề gốc?
8. `DELETE /devices/{token}` giữ như lộ trình (đề xuất) hay đổi sang `POST /devices/unregister` để token không vào access log?
9. Giới hạn **10 thiết bị/người** và job push **theo từng thiết bị** — đồng ý?
10. `GET /app/config` dùng một bộ phiên bản chung (đề xuất) hay tách theo nền tảng (`?platform=android`)?
