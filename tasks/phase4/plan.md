# Kế hoạch lưu trữ: Phase 4 — Workflow & Reporting (đã triển khai mã nguồn)

Ngày lập: 2026-10-12 (cập nhật sau phỏng vấn ý định cùng ngày). Đây là bản kế hoạch lịch sử, được giữ để lưu ý định và quyết định trước triển khai. Phase 4 đã hoàn tất phần mã nguồn; xem docs/roadmap/PHASE_4_WORKFLOW_REPORTING_MODULE.md để biết trạng thái hiện hành.

Tệp riêng trong `tasks/phase4/` vì `tasks/plan.md` và `tasks/todo.md` (Render + Supabase Free) còn mục mở chờ nghiệm thu cloud (10a, 12b, checkpoint cuối). Không ghi đè hai tệp đó.

## Ý định đã xác nhận (2026-10-12)

- Kết quả: trên bản demo Render có một kịch bản trọn vẹn: nhập ý tưởng, AI hỏi làm rõ theo danh sách mục (có giả định và nút bỏ qua), tạo dự án, Gantt/đường găng, gửi CR, duyệt BA -> PO -> PM, tự tạo phiên bản, so sánh và rollback, xuất SRS/BRD (DOCX, có BPMN) và XLSX.
- Người xem: hội đồng chấm đồ án, qua bản demo Render. Các vai BA/PO/PM là thành viên trong dự án.
- Thứ tự: (1) AI hỏi làm rõ rồi SRS/BRD; (2) duyệt CR rồi phiên bản + rollback; (3) Gantt; (4) XLSX; (5) BPMN dạng sơ đồ, dự phòng bằng bảng các bước.
- Thành công: AI không điền thông tin chưa được xác nhận, mọi giả định hiển thị ở mục riêng; tài liệu khớp dữ liệu dự án; kịch bản demo chạy từ đầu đến cuối sau cold start.
- Ràng buộc: gói Free (512 MB RAM, backend ngủ, quota AI), không Celery, dùng durable jobs hiện có; còn vài tháng tới ngày bảo vệ.
- Ngoài phạm vi: upload/parse file yêu cầu gốc; kéo thả Gantt; chỉ định người duyệt cụ thể cho từng CR; email thông báo duyệt (email đang tắt); chỉnh sửa DOCX trong ứng dụng.

## Hiện trạng tại thời điểm lập kế hoạch (2026-10-12; bối cảnh lịch sử)

- Khi lập kế hoạch, AI Project Generator chỉ nhận prompt thô; Phase 4 sau đó bổ sung luồng hỏi làm rõ và sinh từ hồ sơ.
- AI chạy qua `AIRequest` + jobs; quota `AI_DAILY_JOB_LIMIT=20`/ngày, `AI_MAX_OUTPUT_TOKENS=8000`, timeout 90 giây.
- Vai trò dự án khi lập kế hoạch: `PM, BA, PO, Member, Customer`; khi đó CR cho PM/BA tạo và chưa có workflow duyệt.
- Khi lập kế hoạch, `ProjectVersion` chưa có service/endpoint; Phase 4 sau đó bổ sung baseline, diff và rollback.
- `python-docx` và `openpyxl` đã có trong requirements. Storage private adapter (Supabase) đã có cho avatar; nghiệm thu cloud (10a) chưa xong.
- CPM: tại thời điểm lập kế hoạch `GET /projects/{id}/cpm` tính đồng bộ, chưa áp dụng các giới hạn được đề xuất.
- Khi đó các luồng Gantt, approvals, project versions và reports còn chưa triển khai; Phase 4 sau đó đã bổ sung.

## Quyết định kiến trúc

### Hồ sơ yêu cầu và AI hỏi làm rõ
- Bảng mới `requirement_briefs`: ý tưởng gốc, danh sách mục (mục tiêu, người dùng/bên liên quan, phạm vi làm, ngoài phạm vi, chức năng chính, ràng buộc, tiêu chí thành công), mỗi mục có trạng thái `clear | missing | assumed | skipped`, giá trị và nguồn (`user` / `ai_assumption_confirmed`), lịch sử hỏi đáp, `project_id` sau khi tạo dự án.
- Mỗi lượt AI là một durable job (`ai.clarify`), không gọi provider đồng bộ trong request. Output JSON chặt: đánh giá từng mục, đúng một câu hỏi kế tiếp, đề xuất giả định tùy chọn. Server validate schema; AI không được đổi mục đã `clear` do người dùng xác nhận.
- Dừng hỏi khi mọi mục khác `missing`, hoặc người dùng bấm "Bỏ qua, tạo luôn" (mục còn thiếu chuyển `skipped`), hoặc chạm trần số lượt (mặc định 12).
- Project Generator nhận hồ sơ đã chốt thay cho prompt thô. Prompt hệ thống chỉ cho dùng mục `clear`/`assumed`; mục `skipped` không được bịa nội dung. Endpoint prompt thô cũ giữ cho tương thích nhưng UI chuyển sang luồng mới.

### Tài liệu SRS/BRD
- Nguồn dữ liệu: hồ sơ yêu cầu + dữ liệu dự án (WBS, task, CPM, CR đã duyệt). AI sinh nội dung theo từng mục của mẫu tài liệu thành JSON có cấu trúc; server dựng DOCX bằng python-docx từ mẫu cố định. Không để AI sinh DOCX/Markdown tự do.
- Trước khi viết, kiểm tra các mục bắt buộc của mẫu; thiếu thì quay lại vòng hỏi làm rõ trên cùng hồ sơ.
- Mục "Giả định và vấn đề mở" sinh từ dữ liệu hồ sơ (mục `assumed`/`skipped`), không do AI tự viết.
- Mỗi tài liệu chia nhiều job theo nhóm mục để không vượt 8000 token output; kết quả từng phần lưu nguyên tử, ghép khi đủ. File lưu bucket private, tải qua proxy kiểm tra quyền dự án.

### Duyệt CR và phiên bản
- Submit CR tạo 3 bước Approval (BA, PO, PM) cùng transaction. Bất kỳ thành viên có đúng vai trò đều được quyết định bước hiện hành; khóa hàng chống quyết định đồng thời. Từ chối ở bất kỳ bước nào kết thúc CR. Dự án thiếu thành viên của một vai trò thì chặn submit với thông báo rõ.
- Snapshot (task, dependency, WBS, các trường lịch) tạo trong cùng transaction khi: PM duyệt cuối, tạo baseline thủ công, và ngay trước mỗi lần rollback.
- Rollback không xóa lịch sử: tạo phiên bản mới "khôi phục về vX". Task có worklog/comment không bị xóa cứng khi rollback (chi tiết chốt ở V0). Sau rollback, tính lại CPM qua luồng job hiện có.

### Gantt, XLSX, BPMN
- Gantt tự vẽ SVG/CSS từ `GET /projects/{id}/cpm`, chỉ đọc, không thêm thư viện (chốt trước đó).
- XLSX qua job `report.xlsx`: sheet Task, Đường găng, CR + lịch sử duyệt, EVA/Burndown.
- BPMN: AI sinh cấu trúc quy trình JSON (lane, task, gateway, flow), server validate; vẽ sơ đồ bằng SVG ở frontend và PNG để chèn DOCX. Nếu vẽ không đạt, dự phòng bằng bảng các bước trong DOCX.

## Rủi ro và giảm thiểu

| Rủi ro | Mức | Giảm thiểu |
|---|---|---|
| Mỗi lượt hỏi tốn quota AI 20 job/ngày, demo hết quota giữa chừng | Cao | Trần lượt, đếm quota riêng/hiển thị còn lại; chế độ provider giả cho diễn tập; tăng quota có cấu hình |
| AI vẫn bịa khi sinh dự án/tài liệu | Cao | Output JSON có schema; mục giả định sinh từ dữ liệu hồ sơ; test với provider giả trả nội dung ngoài hồ sơ phải bị loại/gắn cờ |
| SRS/BRD vượt giới hạn token, timeout 90 giây | Trung bình | Chia job theo nhóm mục, checkpoint từng phần |
| Rollback làm mất worklog/assignment hoặc vỡ khóa ngoại | Cao | Spike V0 chốt ngữ nghĩa trước khi code; không xóa cứng task có dữ liệu phụ thuộc |
| Endpoint CPM đọc tính đồng bộ trên dự án lớn, OOM Render Free | Cao | G1 áp cap trước khi nạp |
| Snapshot JSON làm đầy 500 MB Supabase Free | Trung bình | Cap số phiên bản/dự án, chỉ lưu trường cần thiết |
| Storage cloud chưa nghiệm thu (10a) mà DOCX/XLSX phụ thuộc | Trung bình | Kiểm thử adapter giả lập trước; nghiệm thu 10a trước checkpoint tài liệu |
| Cold start Render trả 502 khi demo | Trung bình | Kịch bản demo có bước đánh thức backend trước; UI thử lại (đã có) |

## Câu hỏi mở (không chặn lát 1)

- Người tạo CR có được duyệt bước của chính vai trò mình không? Mặc định đề xuất: được, để demo với ít tài khoản; ghi chú trong tài liệu.
- Ngôn ngữ tài liệu: mặc định tiếng Việt, có tùy chọn tiếng Anh theo locale người dùng?
- Ngữ nghĩa rollback chi tiết cho task đã có worklog (chốt ở V0).

## Mặc định đã áp dụng cho câu hỏi mở (2026-10-12, chờ người dùng duyệt)

- Người tạo CR được quyết định bước duyệt của vai trò mình (phục vụ demo ít tài khoản). Ghi chú trong tài liệu người dùng và roadmap.
- Tài liệu SRS/BRD sinh bằng tiếng Việt mặc định; endpoint nhận tham số `language` với giá trị `vi` hoặc `en`.

## V0: Ngữ nghĩa snapshot và rollback (2026-10-12, chờ người dùng duyệt)

Trạng thái: điều phối viên viết theo quy tắc thận trọng; chờ người dùng duyệt. V1 và V3 thực hiện theo bảng dưới đây.

### Khóa ngoại liên quan (đã đối chiếu model)

- `tasks`: `project_id` (CASCADE), `phase_id`, `sprint_id`, `epic_id`, `assignee_id` (SET NULL).
- `dependencies`: `predecessor_id`, `successor_id` -> `tasks` (CASCADE).
- `worklogs`, `comments`, `subtasks`, `assignments`: `task_id` -> `tasks` (CASCADE). Xóa cứng task sẽ kéo theo xóa các bản ghi này, nên rollback không được xóa cứng task có dữ liệu loại này.
- `sprints.phase_id` (SET NULL); `phases`, `sprints`, `epics`, `milestones`: `project_id` (CASCADE).
- `project_versions.change_request_id` (SET NULL).
- `TaskStatus` hiện không có giá trị hủy; V3 thêm cột `tasks.archived_at` (nullable, qua migration) thay vì đổi enum.

### Phạm vi snapshot

| Thực thể | Có trong snapshot | Trường lưu |
|---|---|---|
| Phase | Có | id, name, description, status, thứ tự, start/end |
| Sprint | Có | id, name, status, phase_id, start/end, mục tiêu |
| Epic | Có | id, name, description, status |
| Milestone | Có | id, name, description, status, due_date |
| Task | Có | id, name, description, status, priority, story_points, estimated_hours, progress, start_date, due_date, phase_id, sprint_id, epic_id, assignee_id |
| Dependency | Có | predecessor_id, successor_id, dependency_type, lag_days |
| Worklog, Comment, Subtask, Assignment | Không | Không lưu; không bao giờ bị rollback xóa |
| Chat, file, thông báo, audit log | Không | Không lưu |

Trường CPM (ES/EF/LS/LF, float, is_critical) không lưu; sau rollback tính lại qua job CPM hiện có. Snapshot có `schema_version` để đọc được khi model đổi.

### Quy tắc rollback theo từng ca

| Ca | Xử lý |
|---|---|
| Task có trong snapshot và đang tồn tại | Khôi phục giá trị các trường trong snapshot; nếu đang `archived_at` thì bỏ lưu trữ |
| Task không có trong snapshot nhưng đang tồn tại, có worklog/comment/subtask/assignment | Không xóa cứng; đặt `archived_at = now()`; danh sách task, CPM, dashboard, Gantt, báo cáo bỏ qua task đã lưu trữ |
| Task không có trong snapshot, không có dữ liệu phụ thuộc | Xóa cứng |
| Task có trong snapshot nhưng đã bị xóa | Tạo lại với ID mới; ghi ánh xạ `id_map` (ID cũ -> ID mới) trong phiên bản rollback |
| Dependency | Đưa tập dependency về đúng snapshot (xóa cạnh thừa, tạo cạnh thiếu), ID task dịch qua `id_map`; cạnh trỏ tới task lưu trữ bị bỏ |
| Phase/Sprint/Epic/Milestone có trong snapshot | Khôi phục trường; bị xóa thì tạo lại với ID mới, ghi `id_map` |
| Phase/Sprint/Epic/Milestone không có trong snapshot | Xóa cứng (khóa ngoại từ task là SET NULL, không mất dữ liệu phụ thuộc) |
| Worklog | Không bao giờ bị rollback xóa hay sửa |
| Assignee trong snapshot không còn là thành viên dự án | Đặt `assignee_id = NULL`, ghi cảnh báo trong phiên bản rollback |

### Giao dịch và lịch sử

- Trước rollback: tạo snapshot hiện trạng ("trước khi khôi phục về vX") trong cùng transaction.
- Toàn bộ khôi phục chạy trong một transaction; lỗi thì rollback DB, không để dữ liệu nửa vời.
- Sau khôi phục: tạo phiên bản mới "khôi phục về vX" chứa snapshot kết quả và `id_map`; enqueue job CPM; ghi audit log.
- Đảo ngược rollback bằng cách rollback về phiên bản "trước khi khôi phục".
- Cap phiên bản/dự án (mặc định 50): khi đầy, xóa phiên bản cũ nhất không phải baseline; baseline thủ công vượt cap thì trả 409.
