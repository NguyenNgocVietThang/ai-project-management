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

## Nghiệm thu cloud (2026-10-12)

- Người dùng chọn hoàn tất kế hoạch Render + Supabase trước, tạm dừng Phase 4. Quyết định Phase 4 đã chốt: Gantt tự vẽ SVG/CSS từ `GET /projects/{id}/cpm`, không thêm thư viện.
- Task A (đối soát): frontend `ai-project-frontend-5zvz.onrender.com` phản hồi 307 sau 0,57 s (đang thức). Proxy `/api/v1/auth/me` trả 401 JSON từ FastAPI, nên backend chạy và proxy đúng. `/health` không đi qua proxy (chỉ `/api/v1`), hostname backend trực tiếp chưa xác định. Migration head, bucket private, extension pg_cron/pg_net/Vault cần truy vấn chỉ đọc trên Supabase SQL Editor (người dùng chạy).
- Trạng thái mục mở: 7a hoãn (EMAIL_PROVIDER=disabled, chưa có sender); 8b, 10a, 12b chờ kết quả truy vấn và thao tác đăng nhập của người dùng.
- Backend trực tiếp `ai-project-backend-ejed.onrender.com/health`: 200, database ok, redis ok, 0,38 s (đang thức, chưa phải số đo cold start).
- 8b đạt: bảng jobs 3 ngày gần nhất có cron.reminders succeeded x2, cron.risk succeeded x2 (một job/ngày dù có retry +2/+5 phút).
- 7a: người dùng chọn giữ email tắt có chủ đích; đóng mục với lý do.
- Google OAuth trên demo: người dùng đăng nhập thành công.
- Mở: dashboard Supabase báo 113 lỗi / 116 "Postgres requests" trong 60 phút. Backend không gọi PostgREST (`/rest/v1`), chỉ dùng kết nối Postgres trực tiếp và `storage/v1`; cần xem Logs Explorer và kiểm tra RLS/quyền anon trên schema public.
- Cold start đo thật (16:10 UTC, backend ngủ khoảng 1 giờ): `/health` trả 200 sau 42,7 s. Trong lúc backend đang thức dậy, frontend proxy `/api/v1/oauth/google/login` trả 502 Bad Gateway từ Render; tải lại sau khi backend thức thì hết lỗi. Đây là giới hạn đã biết của gói Free (docs nêu cold start khoảng 1 phút).
- Task B (Storage thật, 2026-10-12 ~16:15 UTC, trình duyệt in-app, tài khoản Google của người dùng):
  - Ảnh 6 MiB bị chặn ở client ("Avatar must not exceed 5 MiB."), không có request gửi đi. Giới hạn phía server chỉ có test cục bộ, chưa thử trên cloud.
  - Ảnh PNG thử 600x600 (14 KB) upload qua UI: `POST /api/v1/users/me/avatar` 200. Ảnh trả về là WebP 512x512, `Cache-Control: private, no-store`.
  - Không có phiên đăng nhập: `GET /api/v1/users/1/avatar` trả 401 qua cả proxy frontend lẫn backend trực tiếp.
  - Còn lại: tải lại avatar sau khi backend ngủ/khởi động lại, và người dùng xác nhận object nằm trong bucket private `ai-project-files`.

## Cập nhật 2026-10-14

- Một nhóm file Markdown đã được rà soát/cập nhật trong đợt 2026-10-14 (README, roadmap Phase 4/5, checklist và nhật ký); đây không phải khẳng định mọi Markdown trong repo đều cập nhật cùng ngày.
- Trạng thái tổng hợp: Phase 1–4 hoàn thành phần mã nguồn, Phase 4 chờ nghiệm thu cloud (Render + AI thật), Phase 5 ~50% (Document AI Parser + Investor Dashboard chưa bắt đầu).
- Các mục còn mở (todo.md): Bước 10a (Supabase project thật chưa có), 12b (nghiệm thu cloud đầy đủ còn đợi account + sender).

## Cập nhật 2026-10-16 — Investor Dashboard (Phase 5, giai đoạn 5.3)

- Hoàn thành trên nhánh feat/investor-dashboard: bảng `portfolio_investors`, cột `projects.expected_benefit`, `InvestorService` và router `/investor` (33 REST router đang mount), trang `/investor`, thẻ "Nhà đầu tư" ở `/portfolios/[id]`.
- Quyết định sau rà soát cuối: F3 quyền đã cấp chỉ có hiệu lực khi người nhận còn role Investor lúc đọc; F6 `overdue_projects` bỏ qua dự án COMPLETED và CANCELLED. Cả hai đã ghi vào spec (mục 4 và 6.1).
- Kiểm thử: backend 697 passed / 28 skipped, ruff sạch (trước kế hoạch: 649 / 28). Frontend 32 file / 146 test; tsc, eslint, next build sạch.
- Migration PostgreSQL 16 (cụm tạm): upgrade, downgrade, upgrade lại đều đạt.
- Kiểm tra trình duyệt (docker compose cục bộ, dữ liệu thử riêng): owner cấp investor và lỗi cấp quyền chỉ hiện một lần; investor chỉ thấy portfolio được cấp; số liệu khớp tính tay; thu hồi thì investor bị đưa về `/investor` kèm thông báo; PM vào `/investor` bị chuyển về `/dashboard`; EN/VI không còn khóa thô; 390px không tràn ngang. Phát hiện và đã sửa: bảng sr-only làm trang desktop tràn ngang (scrollWidth 1410 so với 1302), giá trị KPI bị ngắt giữa số ở độ rộng 1000-1300px.
- Chưa có giao diện cho `GET /investor/projects/{id}` và `risk_distribution`.
- Việc theo dõi: (1) task đã lưu trữ vẫn bị tính trong `project_task_counts` (dashboard và investor), cần sửa riêng vì đổi số liệu dashboard; (2) lỗi cấp quyền từ backend hiển thị tiếng Anh; (3) cấp quyền đồng thời hai lần cho cùng người có thể trả 500 thay vì 200 idempotent; (4) môi trường cục bộ: image `minio/minio` không còn trên Docker Hub, `backend/.env` chứa `SEED_ADMIN_*` bị `Settings` (extra=forbid) từ chối, watcher `uvicorn --reload` lỗi quyền trên `.pytest_cache`.
- Chưa làm: đồ thị tri thức (`graphify update .`) chờ người dùng quyết định vì `graphify-out/` đã có thay đổi chưa commit từ trước.

## Cập nhật 2026-10-18 — Dọn dẹp nhánh và cache lỗi thời (nhật ký)

- Xóa 3 nhánh cục bộ đã merge vào `main`: `codex/consistent-firework-launch`, `feature/phase4-workflow-reporting`, `feat/ui-modernization`.
- Xóa 1 nhánh remote đã merge: `origin/feat/ui-modernization`.
- Xóa ~134 MB thư mục lỗi thời đã gitignore: `tasks/.postgres-test/` (67 MB, cụm PostgreSQL tạm), `.mypy_cache/` (64 MB), `tasks/.validation-libs/` (2.7 MB), `.pytest_cache/`, `.ruff_cache/`, `tasks/.render-validation.json`.
- Cập nhật các file Markdown được liệt kê: README, roadmap Phase 4/5, tasks/plan.md, tasks/todo.md, tasks/progress.md và tasks/phase4/progress.md.
- Nhánh còn lại: chỉ `main` (local) và `origin/main` (remote).

## Đối soát hiện trạng 2026-10-19

- `git worktree list` chỉ có checkout chính; không có worktree phụ đăng ký trong metadata của repo. Không xác định được thư mục mồ côi nào thuộc repo này để xóa an toàn.
- Trạng thái cloud: chưa nghiệm thu Supabase Storage, email provider hoặc các luồng cloud; báo cáo cloud ngày 2026-10-12 là nhật ký lịch sử. Xem `docs/adapter-verification.md` và `tasks/todo.md`.
- Tài liệu roadmap Phase 5 sửa để phản ánh adapter Storage đã kiểm thử giả lập cục bộ nhưng chưa nghiệm thu trên Supabase thật. Xuất DOCX/XLSX đã có; chỉ upload/parse tài liệu nguồn còn TODO.
- Số liệu test trong các báo cáo giữ nguyên theo ngày chạy; mốc mới nhất trong tài liệu hiện có là backend 697 passed / 28 skipped và frontend 32 tệp / 146 test (2026-10-16).
