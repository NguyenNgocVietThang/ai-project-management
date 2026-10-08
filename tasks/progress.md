# Tiến độ — tasks/plan.md

## Quyết định và bằng chứng

- 2026-10-08: Đọc AGENTS.md, plan.md, todo.md và query graphify trước khi khám phá mã. Bảo toàn thay đổi có sẵn; nhánh cục bộ codex/render-supabase-free.
- Bước 1: Next build production thành công; export static thất bại. Chọn hai dịch vụ Free ngủ, một Uvicorn worker; 750 giờ là tổng workspace. Không gộp khi chưa chứng minh headroom 512 MB. Chi tiết docs/free-compute-audit.md.
- Người dùng chưa có tài khoản Render/Supabase/provider email. Tiếp tục toàn bộ mã/cấu hình cục bộ; nghiệm thu cloud, sender, S3/REST thực và pg_net để chưa hoàn thành.
- Ruling: Giữ các API AI hiện có và AIRequest ID; bảng jobs liên kết AIRequest, outbox cùng transaction. Không mount các endpoint báo cáo/tài liệu TODO.
- Ruling: Chạy trong checkout đã có thay đổi kế hoạch của người dùng, trên nhánh riêng, để không bỏ sót các tệp kế hoạch chưa commit. Không push/merge.

## Quan hệ phụ thuộc rà soát

| Bước | Giao diện chung / quyết định |
|---|---|
| 1 -> 12 | Node runtime, hai dịch vụ ngủ, quota dùng chung; không có static site |
| 2 -> 3 -> 4/5 | Job bền vững, claim/lease, AIRequest cùng transaction; unique output đã có |
| 3 -> 6 | CPM enqueue trong transaction chỉnh sửa; generation/version tránh bỏ sót chỉnh sửa đang chạy |
| 7a + 3 -> 7b | Email HTTP + outbox; commit nghiệp vụ trước gửi; provider idempotency hữu hạn |
| 5 + 3 -> 8a -> 8b | Risk chia batch; khóa ngày VN; cron auth; catch-up hôm nay sau giờ đến hạn |
| 4/5/6 -> 9 | Status server có owner/project authorization; UI resume theo owner |
| 1 -> 10a -> 10b | Bucket private và adapter; kiểm tra quyền trước URL ký |
| 3 -> 11 | Redis không lưu công việc/bảo mật duy nhất; auth hiện tại được giữ |
| tất cả -> 12 | Migration ngoài Render shell; SSL/session pool; hướng dẫn cloud chưa nghiệm thu |

## Kiểm thử

- Backend cuối: 416 passed, 2 skipped (chỉ các biến thể SQLite không chứng minh concurrency/pool; bản Postgres đã đạt), 2 cảnh báo deprecation có sẵn. Xem docs/backend-final-verification.md.
- PostgreSQL 16 cục bộ: migration từ DB rỗng lên head, rollback về trước jobs và upgrade lại; claim cạnh tranh, subprocess restart thật, fencing, quota AI đồng thời và replay token đã thu hồi.
- Adapter email/Storage kiểm thử HTTP giả lập, quyền avatar/no-store/size; không gọi provider thật. Supabase SQL chạy ở DB tạm với Vault/net/cron stub, không chứng minh pg_net HTTP cloud.
- Rà soát cuối đã sửa 3 P2: quyền đọc AI sau khi mất membership, pool bảo mật dự trữ riêng và cap CPM trước nạp RAM. Không còn P1/P2 mở theo docs/free-review.md.
- Ruling: tổng pool ứng dụng 3+1 và bảo mật 1+0 là tối đa 5 connection; pool riêng tránh deadlock/starvation khi xác thực giữ connection nghiệp vụ.
- Ruling: CPM demo tối đa 2000 task/10000 dependency; vượt giới hạn báo job FAILED resource_limit_exceeded, giữ lịch cũ để không ghi kết quả chưa tính.
- Ruling: lỗi mạng/503 lúc refresh không xóa cookie/session flag; UI cho thử lại sau cold start. Chỉ 401/403 xác định phiên không hợp lệ mới đăng xuất.
- Tất cả nghiệm thu cloud giữ chưa hoàn thành. Không tạo service/tài nguyên, không nâng gói hoặc gửi email/API AI thật.
- Render Blueprint được kiểm tra bằng JSON Schema chính thức tải ngày 2026-10-09: PASS; hai Web Service Free và một Key Value Free, không worker/Beat/Cron/Postgres trả phí. Đã sửa boolean env value thành chuỗi đúng schema.
- graphify update . đã hoàn thành bằng AST, không LLM/API: 3880 nodes, 12304 edges, 192 communities. Graphify báo thiếu tree_sitter_sql (hai SQL không được trích) và pyproject.toml không tạo node; SQL đã được kiểm thử PostgreSQL trực tiếp. Community mới đặt tên theo hub, chưa chạy semantic labeling có phí.
- Frontend cuối: 52 test đạt (12 file), type-check và lint đạt; production build cấu hình Render đạt. Chrome dùng component thật/backend giả lập: refresh phục hồi result/link, đổi owner không lộ output, 503 retry, EN/VI, 390px không tràn ngang, không page error. docs/frontend-job-verification.md.
- Cluster PostgreSQL tạm tasks/.postgres-test đã dừng sau kiểm thử; không dừng hoặc sửa instance PostgreSQL khác.
- Manifest build xác nhận proxy /api/v1 và CSP WebSocket đúng cấu hình Render; public JS không có tên các biến secret backend. git diff --check đạt.
- Công cụ tự động chặn lệnh dọn cache kiểm tra schema tạm (blocked by policy); tasks/.validation-libs và .render-validation.json vẫn được Git ignore, không chứa credential thật hoặc ảnh hưởng deployment.
