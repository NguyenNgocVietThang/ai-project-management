# Công việc: Render Free + Supabase Free

Checklist phân biệt mã/cấu hình đã kiểm thử cục bộ và nghiệm thu cloud còn thiếu tài khoản. Bằng chứng tổng hợp tại docs/backend-final-verification.md và các tài liệu verification liên quan. *Cập nhật: 2026-10-14.*

| Bước | Công việc / nghiệm thu | Xác minh | Phụ thuộc | Tệp dự kiến / phạm vi |
|---|---|---|---|---|
| 1 | Audit frontend SSR/static và RAM backend; chọn topology trong quota Free | Build production, đo RAM/cold start | Không | frontend/next.config.js, Dockerfiles, docs — M |
| 2 | Thêm jobs/outbox có unique key, attempts, lease và expiry; migration rollback được | Migration lên/xuống DB test, tạo trùng bị chặn | 1 | models/job.py, db/base.py, migrations — M |
| 3 | Runner claim nguyên tử; retry có giới hạn, thu hồi lease hết hạn; đóng sạch | Hai runner tranh job, kill/restart, timeout | 2 | services/job_service.py, core/job_runner.py, main.py, tests — M |
| 4 | Tạo dự án AI qua jobs; giữ API/status tương thích | End-to-end, restart giữa chạy, không tạo hai dự án | 3 | ai_service.py, ai_tasks.py hoặc service tách riêng, tests — M |
| 5 | Chuyển impact/optimize/resources/risk; chia thành các lát nhỏ nếu quá 5 tệp | Lỗi provider, timeout, giới hạn concurrency/quota | 4 | ai_service.py, services/ai, tests — M mỗi lát |
| 6 | CPM lớn chạy qua jobs và gộp chỉnh sửa; CPM nhỏ vẫn cập nhật ngay | Dự án nhỏ/lớn, sửa liên tiếp, dữ liệu lịch cuối đúng | 3 | scheduling_service.py, scheduling_tasks.py, tests — M |
| 7a | Adapter email HTTPS và cấu hình sender/provider | Gửi email thử thực tế, lỗi provider/retry | 1 | utils/email.py, config.py, tests — M |
| 7b | Auth/invitation enqueue outbox cùng transaction, không gửi trước commit | Xác minh/reset/mời, rollback, retry chống trùng | 3, 7a | auth_service.py, project_service.py, email jobs, tests — M |
| 8a | Endpoint nội bộ enqueue lịch, auth server-only, khóa theo ngày/múi giờ | Không secret bị từ chối, gọi trùng/cold start, chạy bù | 5, 3 | endpoints/internal_jobs.py, notification/risk services, tests — M |
| 8b | Supabase Cron 08:00/08:30, Vault/pg_net, theo dõi và retry giới hạn | Kiểm tra job_run_details và kết quả HTTP trên project | 8a | supabase migrations/setup, docs — S |
| 9 | UI hiển thị queued/running/success/failed và tải lại phục hồi trạng thái | Refresh/đóng tab/backend ngủ; polling dừng khi xong | 4, 5, 6 | hooks AI/jobs, components trạng thái, tests — M |
| 10a | Kiểm tra S3 compatibility; bucket private và adapter storage | Upload/download/delete, URL hết hạn, quyền dự án | 1 | storage service, config.py, tests — M |
| 10b | Chuyển luồng upload và URL frontend/CSP sang storage mới | File quá giới hạn, user trái phép, restart vẫn còn file | 10a | endpoints/files, frontend cấu hình, tests — M |
| 11 | Audit Redis mất dữ liệu; bảo toàn logout/OAuth/throttle và websocket fallback | Restart Redis, replay OAuth/token đã revoke, thông báo reconnect | 3 | core auth/Redis modules, tests; chia nhỏ theo kết quả audit — M mỗi lát |
| 12a | Thêm cấu hình chế độ free và Render deploy; migrations ngoài shell Render Free | Startup production, secrets không lọt bundle, DB SSL/pool | Các bước trên | env example, render.yaml, docs — M |
| 12b | Kiểm thử Free end-to-end và hướng dẫn resume/backup/quota | Toàn bộ checklist plan.md, quota/latency ghi lại | 12a | docs, tests cần thiết — M |

- [x] Bước 1 — build và số đo cục bộ tại docs/free-compute-audit.md; hai web service ngủ, tổng giờ <=750/tháng. Peak nghiệp vụ trên Linux/cloud cần nghiệm thu sau.
- [x] Bước 2 — schema, unique outbox và migration lên/xuống PostgreSQL test.
- [x] Bước 3 — claim cạnh tranh PostgreSQL, fencing/lease, retry giới hạn, shutdown và coalesce; docs/job-core-verification.md.
- [x] Bước 4 — API giữ AIRequest ID; rollback/outbox, idempotency, tạo dự án và resume kết quả staged kiểm thử cục bộ.
- [x] Checkpoint: job bền vững và tạo dự án AI hoạt động sau restart — mô phỏng lease/restart với provider giả; provider/cloud thực chưa nghiệm thu.
- [x] Bước 5 — cả 4 phân tích còn lại lưu output nguyên tử, cap dự án/quota và checkpoint provider; 32 test luồng/analyzer thành công.
- [x] Bước 6 — CPM lớn dùng outbox/generation, không mất chỉnh sửa cuối; CPM nhỏ vẫn sync, kiểm thử thực dự án 301 task.
- [x] Bước 7a — hoãn có chủ đích (2026-10-12): adapter HTTP đã kiểm thử giả lập; demo giữ EMAIL_PROVIDER=disabled vì không có tên miền/sender. Đăng ký/quên mật khẩu/lời mời email không khả dụng trên demo, Google OAuth dùng được.
- [x] Bước 7b — đăng ký/reset/mời tạo outbox cùng transaction; rollback, link cũ và key gửi ổn định được kiểm thử.
- [x] Bước 8a — endpoint xác thực, khóa ngày VN, batch và catch-up hôm nay có giới hạn; kiểm thử cục bộ.
- [x] Bước 8b — Supabase Cron thật: trong 3 ngày có 2 job cron.reminders và 2 job cron.risk đều succeeded; dù mỗi lịch có 3 lần gọi (+0/+2/+5 phút) vẫn chỉ 1 job/ngày, khóa theo ngày chống trùng hoạt động (2026-10-12).
- [x] Checkpoint: lịch hoạt động thực tế, không trùng; email hoãn có chủ đích
- [x] Bước 9 — 52 test, type-check/lint, production build với proxy Render và Chrome kiểm tra reload, 503, đổi owner, EN/VI, mobile; docs/frontend-job-verification.md.
- [ ] Bước 10a — Supabase REST private adapter đã kiểm thử giả lập; project Supabase thực chưa có.
- [x] Bước 10b — avatar đi qua adapter/private proxy, size/access/cache được kiểm thử; tài liệu dự án vẫn TODO, không mount.
- [x] Bước 11 — auth hiện tại giữ nguyên; revoke/OAuth/ticket/throttle bền vững trong Postgres, Redis mất không khôi phục token; kiểm thử đồng thời và pool bảo mật riêng.
- [x] Bước 12a — Free profile fail-fast, DB TLS/pool, env mẫu và Render Blueprint đạt JSON Schema chính thức; cả ba tài nguyên ghi plan free. Migration cục bộ đã kiểm thử, TLS/URLs cloud cần account thật.
- [ ] Bước 12b — hướng dẫn resume/backup/quota đã chuẩn bị; nghiệm thu cloud còn bị chặn vì chưa có account, sender/API key và URL triển khai.
- [ ] Checkpoint: nghiệm thu bản demo Free và rà soát trước khi dùng thực tế
