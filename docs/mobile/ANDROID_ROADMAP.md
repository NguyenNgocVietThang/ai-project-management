# Lộ trình phát triển ứng dụng Android

> Trạng thái: **ĐỀ XUẤT — chờ chủ dự án duyệt** (soạn ngày 2026-10-24).
> Mọi giả định ở mục 2 chưa được xác nhận chính thức; thay đổi giả định thì cập nhật tài liệu này trước khi code.
> Prompt giao việc cho từng giai đoạn: [`PHASE_PROMPTS.md`](./PHASE_PROMPTS.md).

## 1. Mục tiêu

Xây dựng **app đồng hành (companion app)** cho hệ thống quản lý dự án hiện tại. App không port toàn bộ web mà chỉ phục vụ các việc cần xử lý ngay trên điện thoại: nhận thông báo, làm việc được giao, ghi giờ, trao đổi, duyệt Change Request, xem số liệu tóm tắt.

Không thuộc phạm vi app: Gantt, AI Project Generator, BPMN, Admin Portal, Versioning/Rollback (giữ trên web vì màn hình nhỏ không phù hợp).

## 2. Giả định (chờ xác nhận)

| # | Giả định | Phương án thay thế |
|---|---|---|
| G1 | Công nghệ: **Expo React Native + TypeScript** | Kotlin + Jetpack Compose; hoặc PWA/TWA trước |
| G2 | Người dùng ưu tiên MVP: **Member**, sau đó **BA/PO/PM** (duyệt CR); Investor/Customer ở giai đoạn 3 | Đổi thứ tự theo nhu cầu |
| G3 | Được phép sửa backend trong cùng repo (Giai đoạn 0) | Tách repo/nhánh riêng |
| G4 | Phát hành: APK nội bộ → Google Play Internal Testing | Lên Play bản công khai |
| G5 | Có thể cần iOS về sau (lý do chọn React Native) | Chỉ Android |
| G6 | Mã app đặt trong thư mục `mobile/` cùng repo (monorepo) | Repo riêng |

## 3. Hiện trạng hệ thống liên quan (đã kiểm chứng trong mã)

| Hạng mục | Hiện trạng | Tham chiếu |
|---|---|---|
| API | 33 REST router `/api/v1` + 2 WebSocket (`/ws/chat/{id}`, `/ws/notifications`) | `backend/app/api/v1/router.py` |
| Đăng nhập | `POST /auth/login` chỉ trả `access_token` trong body; refresh token chỉ đi qua cookie httpOnly | `backend/app/api/v1/endpoints/auth.py:55-71` |
| Refresh | `POST /auth/refresh` chấp nhận refresh token từ cookie **hoặc body** (dành cho client không phải trình duyệt) | `backend/app/core/auth_cookies.py:79` |
| WebSocket | Dùng vé dùng-một-lần từ `POST /auth/ws-ticket`, kiểm tra lại quyền mỗi 60 giây | `backend/app/api/ws/deps.py` |
| OAuth Google | Luồng web redirect, đổi `code` một lần qua `POST /auth/oauth/exchange` | `backend/app/api/v1/endpoints/oauth.py`, `schemas/auth.py:59` |
| Thông báo | Model có `link`, `related_entity_type`, `related_entity_id` → đủ để làm deep link | `backend/app/models/notification.py` |
| Push (FCM) | **Chưa có** (không có device token, không có kênh push) | — |
| Duyệt CR | `GET/POST /change-requests/{id}/approvals` | `backend/app/api/v1/endpoints/approvals.py` |
| Timer worklog | `POST /tasks/{id}/worklogs/start`, `POST /worklogs/{id}/stop`, `GET /users/me/worklogs/active` | `backend/app/api/v1/endpoints/worklogs.py` |
| OpenAPI | Chỉ bật khi `APP_ENV=development` | `backend/app/main.py:71` |
| Tác vụ nền | Durable jobs + outbox trong Postgres; cron gọi `POST /api/v1/internal/jobs/schedules` | `docs/deploy-render-supabase.md` |
| Hạ tầng | Render Free (ngủ khi rảnh, cold start 30–60 giây) + Supabase Free | `render.yaml` |
| i18n | Web hỗ trợ vi (mặc định) / en | `docs/i18n.md` |

## 4. Khoảng trống phải xử lý

1. **Auth cho mobile:** cần chế độ trả refresh token trong body (header `X-Client: android`), nếu không phải dựa vào cookie jar — mong manh.
2. **Push notification:** thiếu bảng `device_tokens`, endpoint đăng ký/hủy, job gửi FCM HTTP v1.
3. **OAuth Google trên mobile:** cần luồng PKCE/redirect về custom scheme rồi đổi qua `/auth/oauth/exchange`; chưa kiểm chứng `code` hiện tại dùng được từ mobile.
4. **OpenAPI ở môi trường dev** để sinh client kiểu dữ liệu tự động.
5. **Ép nâng cấp app:** thiếu endpoint phiên bản tối thiểu được hỗ trợ.
6. **Cold start Render Free:** app cần trạng thái "đang đánh thức máy chủ", timeout và retry hợp lý.

## 5. Quyết định kiến trúc

| Chủ đề | Quyết định |
|---|---|
| Khung | Expo (managed) + Expo Router, TypeScript strict |
| Server state | TanStack Query v5 (cùng thư viện với web) |
| Validate | Zod (cùng quy ước với web) |
| Lưu token | `expo-secure-store` (Android Keystore). Access token giữ trong bộ nhớ; refresh token trong SecureStore |
| Refresh | Single-flight (một lời gọi refresh dùng chung, giống `frontend/src/services/api.ts`) vì refresh token có xoay vòng |
| Realtime | WebSocket khi app foreground (vé qua `/auth/ws-ticket`); FCM khi nền |
| Offline | Giai đoạn 3: SQLite (`expo-sqlite`) + hàng đợi đồng bộ cho worklog |
| i18n | `i18next` vi/en, mặc định vi, bám bảng từ `frontend/messages` |
| Client API | Sinh kiểu từ `openapi.json` (`openapi-typescript`), không viết tay |
| Kiểm thử | Jest + React Native Testing Library; Maestro cho luồng E2E chính; backend dùng pytest như hiện tại |
| CI | GitHub Actions: lint, type-check, test, build EAS (profile preview) |

## 6. Lộ trình

### Giai đoạn 0 — Chuẩn bị backend

**Mục tiêu:** backend sẵn sàng cho client di động, không phá web hiện tại.

| Việc | Chi tiết |
|---|---|
| 0.1 Auth mobile | Khi có header `X-Client: android`: `login`, `refresh`, `oauth/exchange` trả thêm `refresh_token` trong body; `logout` thu hồi theo body. Web giữ nguyên hành vi cookie |
| 0.2 Device token | Migration Alembic bảng `device_tokens` (user_id, token duy nhất, platform, app_version, locale, last_seen_at, revoked_at). Endpoint `POST /devices`, `DELETE /devices/{token}` |
| 0.3 Kênh push | Job `push.send` (outbox, cùng transaction với `Notification`), adapter FCM HTTP v1 có chế độ giả lập cho test; payload chứa `notification_id`, `related_entity_type`, `related_entity_id`, `link`; tự thu hồi token khi FCM trả `UNREGISTERED` |
| 0.4 Phiên bản app | `GET /app/config` trả `min_supported_version`, `latest_version`, `maintenance` |
| 0.5 OpenAPI | Script xuất `openapi.json` từ app (không cần bật docs trên production) lưu vào `mobile/openapi/` |
| 0.6 OAuth mobile | Khảo sát và thiết kế luồng PKCE → custom scheme; chỉ triển khai nếu không phá luồng web |
| 0.7 Kiểm thử + tài liệu | Test đơn vị/tích hợp cho từng mục; cập nhật README (§10 API) và `docs/deploy-render-supabase.md` (biến môi trường FCM) |

**Tiêu chí nghiệm thu:** toàn bộ test backend hiện có vẫn pass; test mới cho 0.1–0.4 pass; web đăng nhập/refresh/logout không đổi hành vi; `openapi.json` sinh được trong CI.

### Giai đoạn 1 — Khung app và luồng cơ bản

| Việc | Chi tiết |
|---|---|
| 1.1 Khởi tạo | `mobile/` Expo + Router + TS strict, ESLint, Jest, cấu hình môi trường (`EXPO_PUBLIC_API_URL`) |
| 1.2 Client API | Sinh kiểu từ OpenAPI, axios + interceptor refresh single-flight, xử lý cold start (timeout dài lần đầu, màn hình chờ) |
| 1.3 Đăng nhập | Email/mật khẩu, lưu phiên an toàn, tự khôi phục phiên khi mở app, đăng xuất |
| 1.4 Thông báo | Danh sách, chưa đọc, đánh dấu đã đọc/tất cả, xóa (dùng `/notifications`) |
| 1.5 Việc của tôi | Danh sách task được giao, xem chi tiết, đổi trạng thái |
| 1.6 Timer worklog | Start/Stop, hiển thị timer đang chạy (`/users/me/worklogs/active`), thêm worklog thủ công |
| 1.7 Nền tảng | i18n vi/en, theme sáng/tối/hệ thống, kiểm tra `min_supported_version` khi mở |

**Tiêu chí nghiệm thu:** đăng nhập được trên thiết bị/emulator thật với backend dev; refresh token xoay vòng không văng phiên khi nhiều request song song; timer start/stop khớp dữ liệu trên web; test Jest cho auth store, interceptor, các hook chính; build APK preview chạy được.

### Giai đoạn 2 — Push, chat, duyệt CR

| Việc | Chi tiết |
|---|---|
| 2.1 FCM | Xin quyền thông báo (Android 13+), đăng ký/làm mới token qua `POST /devices`, hủy khi đăng xuất |
| 2.2 Deep link | Bấm thông báo mở đúng màn hình theo `related_entity_type/id` (Task, ChangeRequest, project chat) |
| 2.3 Chat dự án | Lịch sử, gửi tin, đếm chưa đọc; WebSocket khi foreground với vé từ `/auth/ws-ticket`, tự kết nối lại có backoff |
| 2.4 Duyệt CR | Danh sách CR chờ tôi duyệt, xem tóm tắt tác động AI, Duyệt/Từ chối (BA → PO → PM) kèm lý do |
| 2.5 Action button | Nút Duyệt/Từ chối ngay trong thông báo (chỉ khi người dùng đã mở khóa thiết bị; xác nhận lại bằng sinh trắc học nếu bật) |
| 2.6 Bản tin sáng | Backend gộp `cron.reminders` (08:00) và `cron.risk` (08:30) thành một push tóm tắt "việc hôm nay + rủi ro cao" |

**Tiêu chí nghiệm thu:** push tới được khi app ở nền/đã đóng; bấm thông báo mở đúng đích; chat nhận tin theo thời gian thực và mất kết nối vẫn phục hồi; duyệt CR từ app cho kết quả giống web (audit log, thông báo bước kế tiếp); không lộ dữ liệu của dự án mà người dùng không phải thành viên.

### Giai đoạn 3 — Mở rộng và phát hành

| Việc | Chi tiết |
|---|---|
| 3.1 Dashboard | Tóm tắt KPI (`/dashboards/summary`), tiến độ dự án; màn hình chỉ đọc cho Investor/Customer |
| 3.2 Offline timesheet | Ghi worklog khi mất mạng, đồng bộ lại có xử lý xung đột (ưu tiên bản máy chủ khi trùng khoảng giờ, báo người dùng) |
| 3.3 Chụp/tải tài liệu | Chụp bằng camera hoặc chọn file, tải lên storage private; phân tích tài liệu bằng AI chỉ làm khi backend hoàn tất mục "Document upload & AI parser" (Phase 5 web) |
| 3.4 Bảo mật | Khóa sinh trắc học, ẩn nội dung ở màn hình đa nhiệm, phát hiện thiết bị root (cảnh báo, không chặn) |
| 3.5 Phát hành | EAS Build, ký bằng keystore do chủ dự án giữ, Play Internal Testing, hướng dẫn cập nhật, ép nâng cấp qua `min_supported_version` |

**Tiêu chí nghiệm thu:** E2E Maestro cho luồng đăng nhập → nhận push → duyệt CR → ghi giờ; kiểm thử offline (bật chế độ máy bay giữa chừng); checklist Play Console hoàn tất cho Internal Testing.

### Giai đoạn 4 — Tùy chọn (sau khi có phản hồi người dùng)

Xếp theo giá trị trên công sức:

1. Nhập việc nhanh bằng văn bản/giọng nói, AI tạo task (tận dụng lớp AI hiện có).
2. Nghỉ phép: hoàn thiện endpoint `leaves` (đang là stub) và màn hình xin nghỉ.
3. Widget màn hình chính: timer đang chạy, task đến hạn.
4. Đồng bộ lịch (milestone, hạn task) sang Google Calendar.
5. iOS (nếu giả định G5 đúng).

## 7. Rủi ro và giảm thiểu

| Rủi ro | Mức | Giảm thiểu |
|---|---|---|
| Cold start Render Free làm app trông như treo | Cao | Màn hình chờ, timeout dài lần đầu, retry; cân nhắc ping định kỳ hoặc nâng gói |
| Refresh token xoay vòng gây đăng xuất khi gọi song song | Cao | Single-flight refresh, test đồng thời |
| Push bị chặn bởi tối ưu pin của một số hãng máy | Trung bình | Hướng dẫn trong app, đo tỷ lệ nhận push |
| Lộ dữ liệu qua push (nội dung nhạy cảm trên màn hình khóa) | Trung bình | Payload chỉ chứa id + tiêu đề trung tính, nội dung chi tiết lấy lại khi mở app |
| Model AI miễn phí chậm/hạn chế ảnh hưởng tính năng AI trên mobile | Thấp–Trung bình | Tính năng AI chạy qua durable job, app chỉ hiển thị trạng thái |
| Lệch API giữa web và mobile | Trung bình | Sinh client từ OpenAPI trong CI, kiểm tra thay đổi phá vỡ tương thích |

## 8. Quy tắc phối hợp giữa các phiên làm việc

- Mỗi giai đoạn là một nhánh riêng, một PR riêng; không gộp nhiều giai đoạn vào một PR.
- Cập nhật mục "Nhật ký tiến độ" bên dưới và `tasks/progress.md` cuối mỗi giai đoạn.
- Comment mã và tài liệu viết bằng tiếng Việt; tên biến/tên file bằng tiếng Anh.
- Trước khi bắt đầu một giai đoạn, phiên làm việc phải xác nhận kế hoạch chi tiết với chủ dự án.

## 9. Nhật ký tiến độ

| Giai đoạn | Trạng thái | PR | Ghi chú |
|---|---|---|---|
| 0 — Chuẩn bị backend | Chưa bắt đầu | — | — |
| 1 — Khung app | Chưa bắt đầu | — | — |
| 2 — Push, chat, duyệt CR | Chưa bắt đầu | — | — |
| 3 — Mở rộng, phát hành | Chưa bắt đầu | — | — |
| 4 — Tùy chọn | Chưa bắt đầu | — | — |
