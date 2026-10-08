# Audit compute miễn phí: Render + Supabase

Ngày đo: 2026-10-08, Windows, Asia/Bangkok. Phạm vi: Bước 1 của `tasks/plan.md` và `tasks/todo.md`. HEAD tham chiếu: `48f2a44`; audit dùng trạng thái working tree hiện tại, có các thay đổi của người dùng chưa commit.

## Quyết định

Giữ frontend **Next.js Node server** và backend **FastAPI một Uvicorn worker** ở **hai Render Free web service riêng**, cùng workspace. Chấp nhận ngủ/cold start và quản lý tổng giờ chạy dưới 750 giờ/tháng. Dùng Supabase cho Postgres/Storage và Render Key Value Free cho Redis như kế hoạch; không thêm Celery worker hoặc Beat thành dịch vụ compute riêng.

Đây là quyết định topology cho bản demo ít người, chưa phải nghiệm thu bản deploy: các bước jobs/outbox, email HTTPS, cron và storage còn phải thực hiện. Hiện tại các đường gọi Celery vẫn tồn tại. Không cam kết hai web service hoạt động 24/7 hoặc tác vụ đúng phút.

Static export đã **thử và thất bại**. Gộp Node và Python vào một instance 512 MB chưa được chọn: số đo baseline chưa bao gồm DB thật, runner jobs, AI, upload và dự án lớn.

## Cách đo và phạm vi dữ liệu

- Chạy `graphify query` trước khi đọc mã. Không có `graphify-out/wiki/index.md` để điều hướng.
- Sao chép frontend/backend vào thư mục audit tạm, loại mọi `.env*`, build output cũ, virtual environment và cache. Frontend dùng junction đến `node_modules` đã cài; backend dùng interpreter `.venv` hiện có. Không đọc giá trị `.env`, không gửi request AI/email/cloud, không đổi nguồn hoặc cấu hình ứng dụng trong workspace.
- Frontend: Node **24.17.0**, npm **11.13.0**, Next.js **15.5.25**, next-intl **4.14.2**. Backend: Python **3.12.10**, FastAPI **0.115.0**, Uvicorn **0.30.0**, SQLAlchemy **2.0.35**, asyncpg **0.29.0**; `pip check` không báo dependency hỏng.
- Docker CLI có nhưng daemon `dockerDesktopLinuxEngine` không chạy. Lúc đo ban đầu chưa xác minh được Postgres/Redis local; backend cố ý dùng endpoint loopback audit không có server, secret chỉ tạo trong tiến trình và các provider credentials để trống. Sau đó tìm thấy PostgreSQL 16 tại `C:\Program Files\PostgreSQL\16\bin`; đã khởi động cluster test local cô lập ở port 55439 để kiểm thử jobs và security state thật. Các số RAM/startup dưới đây vẫn là baseline ban đầu với dependency unavailable, chưa được thay bằng workload DB thành công.
- Lấy mẫu mỗi **100 ms**, cộng Windows `WorkingSetSize` và `PrivateUsage` của toàn bộ cây tiến trình bằng `CreateToolhelp32Snapshot`/`GetProcessMemoryInfo`. Working set là số tương đương resident memory trên Windows; private commit là chỉ số khác, **không** được cộng vào working set. Không gọi các số này là Linux RSS/cgroup memory đã xác minh.
- Một lần build ban đầu đã compile trong 77 giây nhưng sandbox chặn spawn validation worker (`EPERM`). Lần retry cho phép spawn đã chạy đầy đủ lint/type validation, page data và tối ưu build. Vì có cache từ lần compile trước, thời gian build thành công dưới đây không đại diện build hoàn toàn cold.

## Production build và static export

Build giữ nguyên cấu hình sao chép:

```text
NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_API_URL=https://api.audit.example/api/v1
NEXT_PUBLIC_WS_URL=wss://api.audit.example
node node_modules/next/dist/bin/next build
```

| Kiểm tra | Kết quả |
| --- | --- |
| Production build đầy đủ | Exit 0, 85.28 giây; compile 13.7 giây trong lần retry |
| Peak working set của cây build | 1,232.01 MiB |
| Peak private commit của cây build | 1,308.28 MiB |
| Route output | 28 route được liệt kê đều `ƒ` — server-rendered on demand; gồm `/login`, `/dashboard`, `/projects/[id]`, `/portfolios/[id]` và `/_not-found` |
| Middleware | Có trong production output, 34.4 kB |
| Static experiment | Chỉ thêm `module.exports.output = 'export'` vào **bản config tạm**, giữ nguyên ứng dụng |
| Static build | Exit 1, 62.20 giây; thất bại lúc collect page data |

Lỗi static thực tế:

```text
Page "/portfolios/[id]" is missing "generateStaticParams()"
so it cannot be used with "output: export" config.
```

Next cũng cảnh báo `headers` không tự hoạt động với `output: export`. Không sửa route hay bỏ middleware/i18n để làm experiment xanh.

Những yêu cầu runtime hiện có:

1. `frontend/src/i18n/request.ts` đọc `await cookies()`; root layout gọi `getLocale()`/`getMessages()`. Runtime đã trả HTML tiếng Anh hoặc Việt theo cookie trên cùng URL, xem bảng phía dưới.
2. `frontend/src/middleware.ts` redirect theo `has-session`. Đây là tiện ích điều hướng; backend vẫn chịu trách nhiệm xác thực thật.
3. `frontend/next.config.js` thiết lập CSP và các security header theo origin API/WebSocket. Runtime đã trả CSP.
4. Route với ID dự án/portfolio xuất hiện sau build; không thể coi tập ID runtime là tập route biết trước khi build. Lỗi `/portfolios/[id]` là blocker đầu tiên gặp trong experiment, không phải danh sách đầy đủ mọi blocker.
5. `Avatar.tsx` dùng `next/image`; nếu nghiên cứu static trong một giai đoạn khác còn phải xử lý image loader cùng các yêu cầu trên.

[Tài liệu Next.js 15 về static export](https://nextjs.org/docs/15/app/guides/static-exports) xác nhận các giới hạn tương ứng cho dynamic routes, cookies, headers, middleware và image optimization mặc định. Kết quả thực tế cho thấy không thể chọn Render Static Site cho code hiện tại.

## Bộ nhớ và request production

Frontend chạy `node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 18101`. Backend chạy `.venv/Scripts/python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 18100` với `APP_ENV=production`, không reload, một worker.

| Phép đo | Frontend Node | Backend Python |
| --- | ---: | ---: |
| Thời gian đến HTTP response đầu tiên | 3.67 giây, `/login` 200 | 24.33 giây, `/health` 503 |
| Idle working set, sau response đầu + 5 giây | 147.78 MiB | 157.31 MiB |
| Peak working set trong cả lượt đo | 178.21 MiB | 158.32 MiB |
| Peak private commit | 221.03 MiB | 135.60 MiB |
| Working set sau tải + 5 giây | 178.21 MiB | 158.30 MiB |
| Tải ngắn | 50 request, concurrency 4 | 50 request, concurrency 4 |
| Kết quả tải | 30 × 200, 20 × 307 | 17 × 401, 16 × 404, 17 × 503 |
| Median / max latency của tải hỗn hợp | 78 / 125 ms | 16 / 4,297 ms |

Next báo `Ready in 2.5s`. Backend báo startup complete lúc 22:34:51; response đầu bao gồm 5.36 giây của health probe chờ DB/Redis. Mốc 24.33 giây vì vậy bao gồm import/startup và probe lỗi, không phải healthy cold start. Build frontend chạy đồng thời với lượt backend nên startup/latency có thể chịu tranh tài nguyên máy local.

Request frontend cụ thể:

| Request | Kết quả kiểm tra |
| --- | --- |
| `/login`, `locale=en` | 200, HTML `lang="en"`, 17,434 bytes, có CSP |
| `/login`, `locale=vi` | 200, HTML `lang="vi"`, 19,108 bytes, có CSP |
| `/dashboard`, không cookie | 307 đến `/login?from=%2Fdashboard` |
| `/login`, `has-session=1` | 307 đến `/dashboard` |
| `/projects/audit-project`, `has-session=1; locale=en` | 200, HTML `lang="en"`, có CSP; chỉ render shell, không chứng minh quyền hoặc dữ liệu dự án |

Request backend cụ thể: `/api/v1/projects/` không credential trả 401 `Not authenticated`; `/docs` trả 404 trong production; `/health` trả 503, database `unavailable`, Redis `degraded`. Lượt đo sử dụng lifespan và import nghiệp vụ thực; không mock server thành app rỗng. Tuy nhiên nó **không** đo workload DB thành công hoặc AI/CPM/file processing. Median tải hỗn hợp backend có nhiều request bị từ chối nhanh, không phải latency nghiệp vụ.

## Áp dụng giới hạn Render

Theo [compute plans](https://render.com/docs/compute-plans), mỗi web service Free có 0.1 CPU và 512 MB RAM. Theo [Free docs](https://render.com/docs/free), workspace chia sẻ 750 giờ chạy/tháng; dịch vụ ngủ sau 15 phút không nhận traffic và thường cần khoảng một phút để thức. Traffic HTTP/WebSocket có thể kéo dài thời gian thức. Không dùng ping hoặc polling liên tục để tránh ngủ.

Tính quota cho hai service:

```text
h_frontend + h_backend <= 750 giờ/tháng
Nếu cùng thức: tối đa 375 giờ/tháng (~12.1 giờ/ngày trong tháng 31 ngày).
Hai service chạy liên tục tháng 31 ngày: 2 * 744 = 1,488 giờ, vượt quota.
Ví dụ demo cùng thức 6 giờ/ngày trong 31 ngày: 372 giờ;
thời gian đuôi 15 phút sau mỗi phiên và các lần thức riêng còn phải cộng thêm.
```

Chọn hai service tách riêng giúp giữ ngân sách RAM riêng cho Node và Python. Runtime hiện đo thấp hơn 512 MB, nhưng 0.1 CPU có thể làm cold start và xử lý chậm hơn máy local. Tất cả job/polling/cron vẫn phải giới hạn như plan; browser mở lâu hoặc cron đánh thức sẽ thay đổi tổng giờ chạy. Cần xem usage của **cả workspace**, bao gồm service khác nếu có.

Tổng hai peak working set quan sát là **336.53 MiB**; tổng hai peak private commit là **356.63 MiB**. Các peak riêng không được đo trong cùng một workload phối hợp, và không thể dùng phép cộng này làm bảo đảm instance gộp đạt 512 MB. Chưa đo memory của DB pool có dữ liệu, job runner, kết quả AI lớn, workbook/document, upload, reverse proxy, page cache hoặc restart trùng tiến trình. Giữ khả năng gộp làm phương án nghiên cứu sau, cần Linux/cgroup load test và chứng minh routing/supervision trước.

Build không diễn ra trong runtime 512 MB: [Render build pipeline](https://render.com/docs/build-pipeline) chạy compute riêng; Starter mặc định có 2 CPU/8 GB và Hobby gồm 500 pipeline phút/tháng. Peak build 1.23 GiB đo trên Windows chưa phải bằng chứng Linux build, nhưng không mâu thuẫn với chọn runtime Free. Chạy build ở pipeline, không `next build` lúc service khởi động. Chưa chạy Docker build nên chưa xác minh install/build trên Node 20 Alpine và Python 3.11 Slim trong Dockerfiles hiện có.

## Việc cần xác minh ở bước deploy

- Build/container production trên Linux theo runtime thực; đo memory cgroup khi Node/Python đã warmed, DB/Redis hoạt động và một job lớn đang chạy. Bắt đầu một Uvicorn worker và concurrency jobs 1; chỉ tăng sau số đo mới.
- Thực hiện chức năng DB/AI/email/CPM/upload thành công, kiểm tra giới hạn kích thước và timeout; các số baseline trên không thay nghiệm thu đó.
- Kiểm tra hai origin HTTPS, API/WebSocket URL, CORS, CSP, cookies và OAuth thực tế. Bind `$PORT` trên Render; không giữ port loopback audit.
- Thử cả hai service ngủ rồi mở frontend, tiếp đó gọi backend; đo trải nghiệm hai cold start. Chỉ polling khi màn hình cần, backoff và dừng khi xong.
- Xác minh deployment frontend giữ nguyên config/security headers, private secrets không vào client bundle và artifacts không kèm `.env`. Chưa sửa Dockerfiles trong audit này.
- Theo dõi hours, pipeline minutes và memory của workspace; thêm ghi nhận quota vào hướng dẫn vận hành khi triển khai. Không có cloud resource nào được tạo bởi audit.

Artifacts máy local ở thư mục tạm `C:\Users\VIET THANG\AppData\Local\Temp\free-compute-audit-20261008`: `node-build-result.json`, `node-build-samples.json`, `node-build.stdout.log`, `frontend-result.json`, `backend-result.json`, các samples/log tương ứng, `build-result.json` và `build.stderr.log` của static experiment, cùng `measure.py`. Secret backend chỉ tồn tại trong environment tiến trình; các logs/artifacts không in secret hoặc đọc `.env`.
