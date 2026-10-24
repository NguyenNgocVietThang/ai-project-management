# Prompt giao việc theo giai đoạn (app Android)

Mỗi prompt dùng cho **một phiên cloud session riêng**, chạy theo thứ tự Giai đoạn 0 → 1 → 2 → 3. Lộ trình đầy đủ: [`ANDROID_ROADMAP.md`](./ANDROID_ROADMAP.md).

Cách dùng: dán **Phần chung** rồi dán prompt của giai đoạn tương ứng vào phiên mới. Giai đoạn sau chỉ bắt đầu khi PR của giai đoạn trước đã được duyệt và merge.

## Phần chung (dán đầu mọi prompt)

```
Bạn đang làm việc trong repo nguyenngocvietthang/ai-project-management (hệ thống quản lý dự án tích hợp AI: FastAPI + Next.js 15 + Postgres + Redis, triển khai Render Free + Supabase Free).

Đọc trước khi làm, theo thứ tự:
1. AGENTS.md và README.md (đặc biệt §2 kiến trúc, §7 RBAC, §10 API).
2. docs/mobile/ANDROID_ROADMAP.md — lộ trình app Android, các giả định G1–G6 và quyết định kiến trúc. Đây là nguồn sự thật cho phạm vi.
3. Mã liên quan tới giai đoạn của bạn (đường dẫn nêu trong prompt).

Quy tắc bắt buộc:
- Giao tiếp, file kế hoạch, tài liệu và comment mã viết bằng TIẾNG VIỆT. Chỉ tên biến, tên file, tên hàm dùng tiếng Anh. Không giao tiếp bằng tiếng Anh.
- BƯỚC ĐẦU TIÊN: đọc mã, rồi viết kế hoạch chi tiết cho giai đoạn (danh sách file sẽ tạo/sửa, API, migration, test, rủi ro) và HỎI TÔI XÁC NHẬN. Không viết mã tính năng trước khi tôi duyệt kế hoạch. Nếu giả định G1–G6 trong lộ trình chưa chốt và ảnh hưởng tới giai đoạn này, hỏi luôn trong bước này.
- Chỉ làm đúng phạm vi giai đoạn, không làm lan sang giai đoạn khác. Phát hiện việc ngoài phạm vi thì ghi vào cuối PR, không tự làm.
- Không phá hành vi web hiện tại. Chạy lại toàn bộ test hiện có (backend: pytest trong backend/; frontend: npm test, type-check, lint trong frontend/) trước khi push.
- Mọi thay đổi có test đi kèm. Báo cáo trung thực kết quả test (kể cả test fail hoặc bị bỏ qua).
- Không commit secret, keystore, file google-services.json thật; dùng biến môi trường và file .example.
- Nhánh: tạo nhánh riêng cho giai đoạn (tên nêu trong prompt), commit nhỏ có thông điệp rõ, push, mở PR ở trạng thái draft. Cuối giai đoạn cập nhật bảng "Nhật ký tiến độ" trong docs/mobile/ANDROID_ROADMAP.md và tasks/progress.md.
- Sau khi sửa mã, chạy `graphify update .` nếu lệnh graphify có sẵn.
```

## Giai đoạn 0 — Chuẩn bị backend

```
GIAI ĐOẠN 0 — Chuẩn bị backend cho client di động. Nhánh: claude/mobile-phase0-backend.

Thực hiện mục 6 "Giai đoạn 0" trong docs/mobile/ANDROID_ROADMAP.md (0.1 → 0.7).

Mã cần đọc trước:
- backend/app/api/v1/endpoints/auth.py, backend/app/core/auth_cookies.py, backend/app/services/auth_service.py, backend/app/schemas/auth.py
- backend/app/api/v1/endpoints/oauth.py, backend/app/services/oauth_service.py
- backend/app/models/notification.py, backend/app/services/notification_service.py
- Hệ thống durable jobs và outbox (tìm trong backend/app: jobs, internal_jobs.py, các adapter email trong backend/app/utils/email.py và docs/adapter-verification.md) để làm mẫu cho adapter FCM
- backend/alembic/versions (migration mới nhất: 20261016_investor_portal.py)
- backend/tests/ (cách viết test unit/integration hiện có)

Yêu cầu chính:
1. Chế độ auth mobile qua header X-Client: android — trả refresh_token trong body ở login/refresh/oauth exchange; web giữ nguyên cookie. Có test chứng minh web không đổi hành vi và refresh token xoay vòng vẫn đúng.
2. Bảng device_tokens + migration Alembic + POST /devices, DELETE /devices/{token} (chỉ thao tác trên token của chính người gọi).
3. Job push.send theo mẫu outbox hiện có, adapter FCM HTTP v1 có chế độ giả lập (provider "fake") để test; không gọi mạng thật trong test. Payload trung tính: chỉ id, tiêu đề, related_entity_type/id, link. Thu hồi token khi FCM báo UNREGISTERED.
4. GET /app/config (min_supported_version, latest_version, maintenance), cấu hình qua biến môi trường.
5. Script xuất openapi.json không cần bật APP_ENV=development, lưu vào mobile/openapi/openapi.json, thêm bước kiểm tra trong CI (.github/workflows) nếu phù hợp.
6. Khảo sát luồng OAuth Google cho mobile và ghi kết luận vào docs/mobile/ (không bắt buộc triển khai nếu rủi ro phá luồng web; nêu rõ đề xuất).
7. Cập nhật README §10, docs/deploy-render-supabase.md (biến môi trường FCM, cách tạo service account) và .env.production.example.

Tiêu chí nghiệm thu: theo mục "Tiêu chí nghiệm thu" của Giai đoạn 0 trong lộ trình. Nhớ bước đầu tiên: trình kế hoạch và chờ tôi xác nhận.
```

## Giai đoạn 1 — Khung app và luồng cơ bản

```
GIAI ĐOẠN 1 — Khung app Android và luồng cơ bản. Nhánh: claude/mobile-phase1-app-shell.

Điều kiện tiên quyết: PR Giai đoạn 0 đã merge (kiểm tra mobile/openapi/openapi.json và header X-Client đã có; nếu chưa, dừng và báo tôi).

Thực hiện mục 6 "Giai đoạn 1" trong docs/mobile/ANDROID_ROADMAP.md (1.1 → 1.7) với quyết định kiến trúc ở mục 5 (Expo + Expo Router + TS strict, TanStack Query, Zod, expo-secure-store, i18next vi/en).

Mã tham khảo để bám quy ước:
- frontend/src/services/api.ts (interceptor refresh single-flight, xử lý lỗi mạng khác 401/403)
- frontend/src/store/authStore.ts (nguyên tắc không ghi access token xuống đĩa)
- frontend/src/features/notifications, frontend/src/features/tasks (useTasks, useTimesheet)
- frontend/messages (chuỗi i18n vi/en để tái sử dụng khóa)
- backend/app/api/v1/endpoints: notifications.py, tasks.py, worklogs.py, auth.py

Yêu cầu chính:
- Thư mục mobile/ độc lập (package.json riêng), không làm thay đổi build của frontend/ và backend/.
- Client API sinh từ mobile/openapi/openapi.json bằng openapi-typescript; không viết tay kiểu dữ liệu.
- Xử lý cold start Render Free: timeout dài cho request đầu, màn hình "đang đánh thức máy chủ", retry có giới hạn.
- Refresh token lưu SecureStore, access token chỉ trong bộ nhớ; test song song nhiều request khi token hết hạn chỉ gọi refresh một lần.
- Màn hình: đăng nhập, thông báo, việc của tôi + chi tiết, timer worklog (+ worklog thủ công), cài đặt (ngôn ngữ, giao diện, đăng xuất).
- Kiểm tra min_supported_version khi mở app, chặn dùng nếu quá cũ.
- CI: workflow lint + type-check + test cho mobile/ (chỉ chạy khi mobile/ thay đổi).
- README trong mobile/ hướng dẫn chạy dev bằng tiếng Việt.

Tiêu chí nghiệm thu: theo mục "Tiêu chí nghiệm thu" của Giai đoạn 1. Nhớ bước đầu tiên: trình kế hoạch và chờ tôi xác nhận.
```

## Giai đoạn 2 — Push, chat, duyệt CR

```
GIAI ĐOẠN 2 — Push notification, chat dự án, duyệt Change Request. Nhánh: claude/mobile-phase2-push-chat-approvals.

Điều kiện tiên quyết: PR Giai đoạn 0 và 1 đã merge.

Thực hiện mục 6 "Giai đoạn 2" trong docs/mobile/ANDROID_ROADMAP.md (2.1 → 2.6).

Mã cần đọc:
- backend/app/api/ws/ (deps.py, chat.py, notifications.py), backend/app/core/ws_tickets.py, backend/app/api/v1/endpoints/chat.py, backend/app/services/chat_service.py
- backend/app/api/v1/endpoints/approvals.py, change_requests.py và các service duyệt CR
- backend/app/services/notification_service.py (nơi gắn thêm push), job cron.reminders và cron.risk
- frontend/src/features/chat (useChatSocket), frontend/src/lib/ws-client.ts (backoff, vé WS)
- Code push do Giai đoạn 0 thêm vào (push.send, device_tokens)

Yêu cầu chính:
- Đăng ký/làm mới/hủy FCM token qua POST/DELETE /devices; xin quyền thông báo Android 13+.
- Deep link theo related_entity_type/id (Task, ChangeRequest, chat dự án); xử lý cả trường hợp app đóng hẳn.
- Chat: lịch sử, gửi tin, đếm chưa đọc; WebSocket khi foreground bằng vé từ /auth/ws-ticket, kết nối lại có backoff, xử lý đóng với mã 4401.
- Duyệt CR theo chuỗi BA → PO → PM: chỉ hiện CR đến lượt người dùng, hiển thị tóm tắt tác động AI, duyệt/từ chối kèm lý do. Tái dùng đúng endpoint và quy tắc quyền của web.
- Action button trong thông báo cho Duyệt/Từ chối; yêu cầu xác nhận sinh trắc học nếu người dùng đã bật.
- Backend: push tóm tắt buổi sáng gộp cron.reminders (08:00) và cron.risk (08:30) — có test.
- Payload push không chứa nội dung nhạy cảm; chi tiết lấy lại sau khi mở app.
- Test: unit cho deep link router, chat socket (giả lập), hành động duyệt; test backend cho push tóm tắt buổi sáng và quyền dữ liệu (người không thuộc dự án không nhận/thấy).

Tiêu chí nghiệm thu: theo mục "Tiêu chí nghiệm thu" của Giai đoạn 2. Nhớ bước đầu tiên: trình kế hoạch và chờ tôi xác nhận.
```

## Giai đoạn 3 — Mở rộng và phát hành

```
GIAI ĐOẠN 3 — Dashboard, offline timesheet, tài liệu, bảo mật, phát hành. Nhánh: claude/mobile-phase3-release.

Điều kiện tiên quyết: PR Giai đoạn 0, 1, 2 đã merge.

Thực hiện mục 6 "Giai đoạn 3" trong docs/mobile/ANDROID_ROADMAP.md (3.1 → 3.5).

Mã cần đọc:
- backend/app/api/v1/endpoints/dashboards.py, investor.py, worklogs.py, documents.py, backend/app/services/storage_service.py
- frontend/src/features/dashboard và trang /investor để tái sử dụng chỉ số hiển thị
- Code mobile/ của Giai đoạn 1–2

Yêu cầu chính:
- Dashboard tóm tắt cho PM/Member; màn hình chỉ đọc cho Investor/Customer theo đúng quyền portfolio_investors.
- Offline timesheet: lưu worklog cục bộ (expo-sqlite), hàng đợi đồng bộ khi có mạng, chiến lược xung đột ghi rõ trong tài liệu (ưu tiên bản máy chủ khi trùng khoảng giờ và báo người dùng). Có test cho đồng bộ lại, xung đột, mất mạng giữa chừng.
- Chụp/chọn file tải lên storage private. Phần AI phân tích tài liệu CHỈ làm nếu backend đã có chức năng "Document upload & AI parser"; nếu chưa, dừng ở bước tải lên và ghi rõ trong PR.
- Bảo mật: khóa sinh trắc học, ẩn nội dung màn hình đa nhiều tác vụ, cảnh báo thiết bị root (không chặn).
- Phát hành: cấu hình EAS Build (profile preview và production), hướng dẫn tạo keystore do chủ dự án tự giữ (KHÔNG commit keystore), checklist Play Internal Testing, quy trình cập nhật và ép nâng cấp qua min_supported_version.
- E2E Maestro cho luồng: đăng nhập → nhận push → duyệt CR → ghi giờ.
- Tài liệu hướng dẫn người dùng cuối (tiếng Việt) trong docs/mobile/.

Tiêu chí nghiệm thu: theo mục "Tiêu chí nghiệm thu" của Giai đoạn 3. Nhớ bước đầu tiên: trình kế hoạch và chờ tôi xác nhận.
```

## Giai đoạn 4 — Tùy chọn

Chỉ bắt đầu khi có phản hồi từ người dùng thật. Chọn một hạng mục trong mục 6 "Giai đoạn 4" của lộ trình, mở phiên mới với Phần chung và mô tả hạng mục đó; vẫn phải qua bước trình kế hoạch và chờ xác nhận.
