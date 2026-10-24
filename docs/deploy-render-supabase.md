# Demo Render Free + Supabase Free

Mã nguồn và cấu hình cục bộ đã được điều chỉnh. Chưa có bản cloud được nghiệm thu: chủ dự án chưa có tài khoản Render, Supabase hoặc sender email. Không tạo tài nguyên trả phí. Xem `tasks/todo.md` để phân biệt phần đã kiểm thử và phần cần tài khoản thực.

## Kiến trúc và quota

Next.js cần Node server: production build thành công nhưng static export thất bại; còn locale cookie, middleware và headers động. Dùng hai **Web Service Free**, một Node frontend và một FastAPI backend với một Uvicorn worker. Key Value Free chỉ hỗ trợ bus WebSocket; jobs và trạng thái bảo mật lưu bền vững trong Postgres. Không cần Celery worker, Beat, Render Cron hoặc Render Postgres.

Hai web service dùng **chung 750 giờ/tháng trong workspace**. Chạy cả hai 24/7 cần khoảng 1440–1488 giờ, vượt quota. Chấp nhận sleep và cold start. Không ping để ép luôn thức. Tab đang mở, polling và WebSocket có thể làm dịch vụ tiếp tục hoạt động; đóng tab khi không dùng.

Số đo Windows tại `docs/free-compute-audit.md`: Next runtime peak 178.21 MiB, backend peak 158.32 MiB trên request không có DB. Build Next peak 1232 MiB chạy trong build pipeline riêng. Chưa chứng minh peak AI/CPM trên Linux hoặc Render; không gộp cả hai vào 512 MB. Cấu hình runner concurrency 1, pool ứng dụng 3+1 và pool bảo mật riêng 1+0, tổng tối đa 5 connection. Pool riêng giúp kiểm tra bảo mật tiến triển khi request đã giữ hết connection ứng dụng.

Nguồn chính thức kiểm tra ngày 2026-10-08: [Render Free](https://render.com/docs/free) có sleep sau 15 phút, cold start khoảng một phút; [Supabase Free](https://supabase.com/pricing) gồm DB 500 MB, Storage 1 GB, egress 5 GB và cached egress 5 GB, pause sau một tuần không hoạt động; [Resend Free](https://resend.com/pricing) 3000 email/tháng, 100/ngày. Kiểm tra dashboard khi thiết lập vì quota có thể thay đổi. Free không đảm bảo always-on hoặc nhắc đúng phút.

## Thiết lập lần đầu

1. Tạo workspace Render Free và project Supabase Free, chọn Singapore nếu có. Không bật nâng cấp, add-on hoặc auto-upgrade. Blueprint `render.yaml` ghi rõ `plan: free` cho cả ba tài nguyên. Nếu dashboard không cho dùng Blueprint Free, tạo thủ công cùng tham số; không chuyển sang Starter. Kiểm tra dịch vụ trùng tên trước khi áp dụng vào workspace có sẵn.
2. Tạo Resend Free và xác minh sender/tên miền đang sở hữu. Tạo API key gửi email. Sender thử nghiệm có giới hạn người nhận; chưa có sender hợp lệ thì chưa nghiệm thu email thực tế. Không mua tên miền hoặc quota khi chưa được đồng ý.
3. Trong Supabase Connect, chọn **Session pooler IPv4 port 5432** hoặc direct endpoint có kết nối phù hợp. Dùng URI `postgresql+asyncpg://`, percent-encode mật khẩu. Đặt `DATABASE_SSL=true`, pool 3+1. Không mặc định Transaction pooler 6543: asyncpg dùng prepared statements. Nếu buộc dùng transaction pooling, bật `DATABASE_DISABLE_PREPARED_STATEMENTS=true`, kiểm thử thật với Supavisor trước khi nghiệm thu. Migration dùng session/direct connection.
4. Chạy migration từ máy cục bộ hoặc CI được phép: cài `backend/requirements.txt`, cung cấp `DATABASE_URL`/`DATABASE_SSL` bằng environment hoặc dotenv riêng, rồi từ thư mục backend chạy `python -m alembic upgrade head`. Backup DB có dữ liệu trước. Không chạy migration tự động mỗi startup; Render Free không có shell/predeploy như gói trả phí. Không tự `stamp head` cho DB chưa đối chiếu schema.
5. Chạy `supabase/private-data.sql` với chủ DB. Auth ứng dụng được giữ nguyên, không chuyển sang Supabase Auth. Tắt Data API nếu không dùng; RLS không có policy cho anon/authenticated ngăn truy cập trực tiếp dữ liệu ứng dụng. Backend DB role phải là owner/BYPASSRLS, chỉ giữ trên server. Không thêm public policy để chữa lỗi quyền.
6. Tạo Storage bucket `ai-project-files`, **Public OFF**. Backend dùng Supabase REST và service-role JWT chỉ trên server; adapter kiểm tra bucket private. Luồng avatar giới hạn 5 MiB, normalize 512x512, tải qua API có xác thực và cache `private,no-store`. Tài liệu S3 compatibility đã kiểm tra, nhưng chưa thử project thật; REST tránh vấn đề path prefix của MinIO SDK. Nếu có avatar MinIO cũ, copy đúng object key và kiểm tra checksum trước chuyển provider; không xóa nguồn.
7. Kết nối repo với Render và tạo các dịch vụ theo `render.yaml`: backend root `backend`, frontend root `frontend`. Frontend build có heap riêng; runtime Node giới hạn heap 320 MiB. Điền biến **tách theo service** trong `.env.production.example`. Backend giữ DB/JWT/cron/AI/email/storage keys. Frontend chỉ giữ URL public và `BACKEND_PROXY_ORIGIN`; không đưa key vào `NEXT_PUBLIC_*`.
8. Đặt hostname thực cho `ALLOWED_HOSTS`, `CORS_ORIGINS`, `FRONTEND_URL`. Frontend dùng `NEXT_PUBLIC_API_URL=/api/v1`, `NEXT_PUBLIC_WS_URL=wss://BACKEND.onrender.com`, `BACKEND_PROXY_ORIGIN=https://BACKEND.onrender.com`. Next proxy API để cookie httpOnly là first-party. Không dùng API cross-site trực tiếp với cookie Lax. Google OAuth nếu có: callback cũng qua frontend, `https://FRONTEND.onrender.com/api/v1/oauth/google/callback`, đăng ký URI này trong Google Console. Password login vẫn hoạt động khi chưa cấu hình Google.
9. `TRUST_PROXY_HEADERS` mặc định false đến khi xác minh proxy ghi đè X-Forwarded-For. IP throttle có thể gộp người dùng sau proxy, phù hợp demo ít người; account throttle vẫn độc lập và bền vững. Không tin XFF tùy ý để tăng tính khả dụng.
10. Bật Supabase Cron (pg_cron), pg_net và Vault trong Integrations. Thêm bằng Vault UI: `demo_backend_origin` và `demo_cron_secret` bằng `CRON_SECRET` backend. Chạy `supabase/setup-cron.sql`. UTC 01:00/01:30 tương ứng Việt Nam 08:00/08:30. Mỗi lịch có hai retry cold start ở +2/+5 phút; không có keepalive liên tục. Endpoint xác thực constant-time và chỉ enqueue; khóa theo ngày ngăn gọi trùng.

## Tác vụ, lỗi và resume

AI kiểm tra danh mục `GET /v1/models` trước mỗi lượt mới và chỉ gọi model có
`access_tier=free`. Model của tác vụ được ưu tiên nếu còn miễn phí; tiếp theo là
`XKIRO_FREE_FALLBACK_MODELS` (mảng JSON), tối đa ba model khác nhau trong một lần chạy.
Model trả 403/404/429 có thể chuyển sang model tiếp theo; 400/401/402 dừng ngay.
Timeout, mất kết nối hoặc 5xx sau khi gửi giữ trạng thái chưa rõ kết quả và không
tự gọi model khác. Mỗi lần gửi đều tính vào quota AI của ứng dụng. Khi không đọc
được danh mục, hệ thống không gửi yêu cầu sinh nội dung; hết danh sách model miễn phí
thì báo lỗi. Quota miễn phí của nhà cung cấp dùng chung tài khoản, không tăng theo
số model dự phòng. AIOutput lưu tên model thực sự trả kết quả từ checkpoint.

Outbox và bản ghi nghiệp vụ commit cùng transaction. Runner claim bằng `FOR UPDATE SKIP LOCKED`, lease/fencing ngăn worker cũ ghi kết quả. Timeout 180 giây, lease 240 giây, heartbeat, retry giới hạn 3 attempts. CPM dùng generation để không bỏ sót chỉnh sửa trong lúc đang chạy. Khi Render ngủ, jobs chờ trong DB; khi thức, runner tự recover và tiếp tục.

AI không giữ DB transaction khi gọi provider; SDK không tự retry. Ghi dispatch intent trước gửi, checkpoint response trước ghi nghiệp vụ. Project/Phase/Task/Dependency/AIOutput và success commit nguyên tử. Nếu đã gửi nhưng chưa lưu response, job FAILED `external_outcome_unknown`: kiểm tra provider usage và để người dùng chủ động tạo yêu cầu mới, không tự gọi lại có thể tốn tiền. Response đã staged được dùng lại sau restart. Không cam kết exactly-once qua API bên ngoài.

Quota AI giới hạn 20 lần dispatch/ngày toàn ứng dụng, kể cả retry, tối đa 1000 task cho phân tích và 150 task/50 phase khi sinh dự án. Hết quota báo `ai_quota_exceeded`; lịch ngày sau vẫn chạy, người dùng có thể chủ động thử lại. Đây là trần số request, không phải trần USD. Chỉ cấp key có budget được chấp thuận; không bật auto-topup hoặc mua quota. Kiểm thử cục bộ không gọi provider thật.

CPM nhỏ đến 300 task vẫn cập nhật đồng bộ; CPM lớn chạy qua jobs và gộp chỉnh sửa. Demo giới hạn mặc định 2000 task/10000 dependency cho mỗi lần CPM qua `CPM_MAX_TASKS` và `CPM_MAX_DEPENDENCIES`. Vượt trần thì job báo `resource_limit_exceeded`, giữ lịch cũ và không nạp toàn bộ đồ thị vào RAM. Thu gọn/chia dự án rồi chỉnh sửa để enqueue lại; chỉ nâng trần sau khi đo RAM/CPU trên hạ tầng phù hợp. Không coi lịch cũ là kết quả đã tính lại thành công.

Resend dùng idempotency key ổn định, retry trong 23 giờ sau attempt đầu tiên (nhỏ hơn cửa sổ 24 giờ của provider). Không gửi link reset/verify hết hạn hoặc đã bị thay thế. Nội dung/link email được xóa khỏi payload khi terminal. SMTP chỉ dành cho development. Lỗi sender/quota/provider hiện trong trạng thái job và dashboard provider, không bị âm thầm bỏ qua.

Lịch chạy theo ngày Việt Nam, batch 20. Catch-up chỉ **hôm nay**, từ giờ đến hạn đến 12 giờ sau lịch; không phát hàng loạt nhắc cũ. Risk quét project ACTIVE mỗi ngày, giữ quota và expiry. UI Jobs tải trạng thái từ DB sau reload, hiển thị queued/running/succeeded/failed và kết quả AI; transient/offline/cold start được retry có backoff.

Nếu Supabase pause: Resume ở dashboard, chờ DB ready, kiểm tra TLS/Storage/Cron, rồi mở API/frontend. Runner tự resume, catch-up có giới hạn. Nếu Render hết 750 giờ, chờ reset quota; không tự nâng gói. Redis Free mất dữ liệu không làm token revoke/OAuth/throttle mất vì free profile dùng Postgres; DB bảo mật lỗi thì fail closed/503. Chat/notification lưu DB và có REST/reconnect khi bus Redis gián đoạn.

Chuyển từ Redis security store cũ sang Postgres phải invalidate session cũ bằng xoay `SECRET_KEY` hoặc tăng `users.auth_version`: migration không tự nhập tombstone đã mất. Sau restore DB cũ cũng invalidate session trước mở lại. Không xoay secret tùy ý nếu chưa muốn đăng xuất mọi người.

## Quota, backup và theo dõi

- Render Dashboard: tổng giờ tất cả Free Web Service, bandwidth, pipeline minutes, memory/CPU, OOM/restart. Không dùng monitor gọi liên tục để giữ thức.
- Supabase Usage: DB/Storage/egress/connections. Cron SQL success chỉ có nghĩa đã enqueue HTTP; đối chiếu `cron.job_run_details`, `demo_ops.cron_http_requests` JOIN `net._http_response` để xem status/timed_out/error, rồi kiểm tra trạng thái jobs. Không dump Vault/header/response body.
- SQL an toàn: `select status,kind,count(*) from jobs group by status,kind;`. Jobs terminal cũ hơn 7 ngày được dọn theo lô 100 khi backend thức; AIRequests/Outputs/nghiệp vụ không tự xóa. Archive/backup dữ liệu AI khi gần DB quota. Security TTL được lọc/dọn theo lô.
- Backup thủ công định kỳ và trước migration. Supabase Free không có managed backup đầy đủ cho ứng dụng. Cài Postgres client phù hợp; cấp `PGHOST/PGPORT/PGUSER/PGDATABASE/PGPASSWORD/PGSSLMODE=verify-full` qua env/private pgpass, chạy `pg_dump --format=custom --file=demo-backup.dump`. Không đưa password vào command line, log hoặc Git. Storage bytes phải backup riêng; DB dump không chứa nội dung file.
- Thử restore vào DB test trước với `pg_restore --no-owner --no-acl --dbname=TEST_DATABASE demo-backup.dump`; đối chiếu số hàng và checksum Storage. Restore live là quyết định riêng, không dùng `--clean` khi chưa có backup/ủy quyền.

## Push notification cho app Android (FCM)

Mặc định `PUSH_PROVIDER=disabled`: không truy vấn thiết bị, không tạo job, hành vi hiện tại không đổi. Chỉ bật khi đã có Firebase project.

1. Tạo Firebase project (gói Spark miễn phí), thêm ứng dụng Android với package name của app. **Không** commit `google-services.json` thật vào Git.
2. Firebase Console → Project settings → Service accounts → **Generate new private key**. Tài khoản dịch vụ chỉ cần vai trò **Firebase Cloud Messaging API Admin**. Bảo đảm API *Firebase Cloud Messaging API (V1)* đã bật.
3. Trong dashboard Render của backend đặt (đều là secret/biến môi trường, không ghi vào file trong repo):
   - `PUSH_PROVIDER=fcm`
   - `FCM_PROJECT_ID` = Project ID của Firebase
   - `FCM_SERVICE_ACCOUNT_JSON` = toàn bộ nội dung file JSON vừa tải, dán trên một dòng. Xóa file JSON khỏi máy sau khi dán.
4. Backend từ chối khởi động nếu `PUSH_PROVIDER=fcm` mà thiếu hai biến trên, hoặc nếu `PUSH_PROVIDER=fake` ngoài môi trường development.
5. Vận hành: mỗi (thông báo × thiết bị) là một job `push.send` trong bảng `jobs` (cùng transaction với thông báo, hết hạn sau 6 giờ). Token FCM báo `UNREGISTERED` bị thu hồi tự động (`device_tokens.revoked_at`). Kiểm tra: `select status,error_code,count(*) from jobs where kind='push.send' group by 1,2;`.
6. Giới hạn đã biết: giao hàng "ít nhất một lần" (hiếm khi trùng nếu worker mất lease sau khi gửi); push hiển thị **tiêu đề thông báo gốc** trên màn hình khóa, không kèm nội dung chi tiết. Chưa nghiệm thu với FCM thật (chưa có Firebase project) — chỉ kiểm thử bằng giả lập HTTP.

Phiên bản app: đặt `APP_MIN_SUPPORTED_VERSION` / `APP_LATEST_VERSION` (dạng `x.y.z`) và `MAINTENANCE_MODE`; app đọc qua `GET /api/v1/app/config`. Sau khi đổi API cho app, chạy `python backend/scripts/export_openapi.py` và commit `mobile/openapi/openapi.json` (CI kiểm tra lệch).

## Các mục còn cần nghiệm thu trên cloud

Tạo account/project/sender; nhận email thật; pg_net/Vault/quyền extensions; Storage private/persistence/URL expiry thật; TLS/pooling; peak RAM Linux dưới AI/CPM; đăng ký/verify/login/logout/reset/invite/AI/notification/avatar qua HTTPS proxy; cold start, restart, Redis maintenance và quota/latency thật. Thử token replay, user trái quyền job/file, đóng tab và reload Jobs. Google OAuth cần key và callback thật. FCM thật (gửi push tới thiết bị) cũng chưa nghiệm thu.

Xuất SRS/BRD DOCX và báo cáo XLSX đã được triển khai qua durable jobs; BPMN cũng có luồng sinh riêng. Upload/parse tài liệu gốc BRD/SRS vẫn là TODO, chưa có endpoint. Storage đã triển khai cho avatar và adapter server-only; luồng upload tài liệu gốc cần RBAC riêng. Nghiệm thu Storage trên Supabase cloud vẫn còn mở; xem [kiểm chứng adapter](adapter-verification.md). URL ký TTL 300 giây là credential ngắn hạn: ai có URL còn dùng được đến expiry, không hứa thu hồi tức thì.
