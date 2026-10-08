# Rà soát cuối: Render Free + Supabase Free

Ngày: 2026-10-09. Rà soát mã nguồn cục bộ; chưa có tài khoản Render/Supabase hoặc sender email để nghiệm thu cloud. Không tạo tài nguyên cloud, mua quota, commit hoặc push trong bước rà soát này.

## Kết luận

Không còn phát hiện P1/P2 chưa xử lý trong phạm vi đã kiểm tra sau khi đọc lại các bản sửa dưới đây. Kết luận này là rà soát nguồn; kết quả test/build cuối cùng và nghiệm thu cloud phải được đối chiếu riêng. Không chứng nhận uptime, peak RAM Linux, email thực nhận hoặc lịch chạy đúng phút.

Đã đọc `AGENTS.md`, `tasks/plan.md`, `tasks/todo.md` và chạy `graphify query` trước khi truy vết. Đồ thị có thể chưa phản ánh thay đổi mới nhất; đối chiếu trực tiếp nguồn cho các phần mới. Không có `graphify-out/wiki/index.md`.

## Phát hiện đã sửa trong lần rà soát

| Mức | Vấn đề và tác động | Bản sửa đã đối chiếu | Kiểm tra hồi quy |
|---|---|---|---|
| P2 | Chủ yêu cầu AI có thể đọc output dự án sau khi bị xóa khỏi nhóm hoặc dự án bị xóa mềm. | `backend/app/services/ai_service.py:80` bỏ các yêu cầu không còn quyền khỏi danh sách; `:98` kiểm tra lại quyền dự án trước khi đọc kết quả. | `backend/tests/integration/test_durable_ai_flow.py:52` kiểm tra member bị xóa nhận 403 và project bị xóa nhận 404. |
| P2 | Với pool ứng dụng 3+1, request đã giữ connection khi xác thực có thể chờ thêm connection cho durable rate-limit/auth; bốn request đồng thời có thể làm tất cả chờ timeout. | `backend/app/db/session.py:25` có pool bảo mật riêng 1+0, timeout 4 giây; `backend/app/services/security_state_service.py:20` dùng pool này. Tổng tối đa năm connection với cấu hình Render. | `backend/tests/unit/test_security_state.py:150` giữ cả bốn connection ứng dụng rồi xác minh revocation/counter vẫn tiến triển bằng PostgreSQL. |
| P2 | CPM lớn chạy trong cùng tiến trình API mà chưa có trần kích thước; timeout asyncio không giới hạn được bộ nhớ hoặc một đoạn tính toán CPU đồng bộ. | `backend/app/services/durable_handlers.py:11` đếm task/dependency trước khi nạp và tính CPM; mặc định 2000 task/10000 dependency, vượt trần trả `resource_limit_exceeded` hiển thị được qua API Jobs. | `backend/tests/unit/test_cpm_scheduling.py` kiểm tra cả trần task và dependency, bao gồm lỗi đọc qua API Jobs. |

## Các luồng đã đối chiếu

- **Runner/restart/fencing:** claim `FOR UPDATE SKIP LOCKED` ở `backend/app/services/job_service.py:139`; token/lease/expiry được kiểm tra tại `lock_owned`; recover theo lô và attempts giới hạn. `backend/app/core/job_runner.py:195` khóa job trước khi áp dụng kết quả; generation CPM cũ không ghi đè chỉnh sửa mới. Shutdown để lease phục hồi, không tái phát hành kết quả chưa xác minh.
- **AI/quota:** `backend/app/services/ai/xkiro_provider.py:24` tắt retry của SDK; dispatch intent và quota được ghi nguyên tử trước gọi provider (`:58`, `backend/app/services/ai/job_context.py:18`). Counter tính mọi dispatch, gồm retry. HTTP từ chối rõ ràng xóa cờ dispatch; timeout/5xx chưa biết kết quả trở thành lỗi terminal. Response được staged trước ghi nghiệp vụ (`:87`), dùng lại khi restart. Client được đóng cả khi thành công/lỗi (`:38`). `backend/app/services/ai/durable_jobs.py:102` kiểm tra lại user/project rồi ghi output và nghiệp vụ trong transaction có fencing; report tạm được rollback.
- **Email/outbox:** đăng ký/reset/mời tạo job trong cùng transaction nghiệp vụ. `backend/app/services/durable_handlers.py:36` giới hạn retry trong 23 giờ từ dispatch đầu; token/link hết hạn hoặc bị thay thế bị từ chối; lời mời kiểm tra lại membership/project. Key provider ổn định là dedupe key (`:64`). Payload chứa link được xóa khi job terminal trong `mirror_ai_status`. HTTP adapter không ghi nội dung response hoặc credential vào lỗi.
- **Auth/Redis loss:** revocation, rotation refresh một lần, OAuth state/exchange, WS ticket và throttle dùng trạng thái PostgreSQL trong profile Free. Thao tác bảo mật lỗi DB trả lỗi đóng an toàn, không fallback Redis. TTL được lọc ở truy vấn; consume/claim là atomic. `backend/app/api/ws/deps.py` đóng socket khi tái xác thực DB thất bại trong database mode. Redis vẫn phục vụ bus, không là nơi lưu duy nhất của trạng thái bảo mật.
- **Cron Việt Nam:** `backend/app/services/cron_service.py:16` khóa theo ngày/múi giờ và chỉ enqueue trong cửa sổ catch-up hôm nay. Batch và continuation có trần; task reminder được khóa trước đánh dấu. `backend/app/api/v1/endpoints/internal_jobs.py:19` so sánh Bearer secret constant-time. `supabase/setup-cron.sql` dùng Vault, UTC 01:00/01:30 và hai retry cold start giới hạn; SQL enqueue thành công không được hiểu là HTTP thành công. Không có keepalive mỗi phút.
- **File privacy:** `backend/app/services/storage_service.py:152` xác minh bucket private trước thao tác, không theo redirect mang server key; object key và signed URL được kiểm tra. Avatar có giới hạn input 5 MiB, chuẩn hóa ảnh và route xác thực trả `private, no-store`. File tài liệu dự án vẫn TODO; không nghiệm thu upload tài liệu chưa được triển khai. Các bảng jobs/security bật RLS và thu hồi quyền API trong migration; `supabase/private-data.sql` khóa truy cập trực tiếp dữ liệu ứng dụng.
- **Free/deploy/secrets:** `render.yaml` chỉ có hai Free Web Service và Free Key Value, một Uvicorn worker; không cần Celery/Beat trả phí. Next proxy API để cookie httpOnly hoạt động cùng origin frontend; OAuth callback cần đi qua proxy theo hướng dẫn. Backend key không đưa vào `NEXT_PUBLIC_*`. TLS DB, session pooler, migrations ngoài shell Free, proxy IP, quota giờ dùng chung, DB pause/resume và backup đều có hướng dẫn tại `docs/deploy-render-supabase.md`. Pool ứng dụng và pool bảo mật là hai pool hữu hạn.

## Giới hạn cần nghiệm thu khi có tài khoản

Cloud còn cần: sender/email thực nhận; Supabase Vault/pg_net/Cron và quyền extensions; Storage private/URL expiry thật; TLS/session pooling; peak RAM Linux dưới AI/CPM; HTTPS cookie/OAuth/proxy; cold start, kill/restart và mất Redis; quota/latency thực. Giới hạn số dispatch AI không phải trần chi phí USD. Jobs/output/nghiệp vụ bền vững không thay thế backup.

Kiểm thử tự động cục bộ do bước xác minh cuối tổng hợp. Các test được nêu ở trên là bằng chứng về phạm vi hồi quy; tài liệu này không thay thế báo cáo chạy test hoặc nghiệm thu cloud.
