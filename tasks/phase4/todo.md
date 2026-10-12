# Công việc: Phase 4 — Workflow & Reporting

Kế hoạch và ý định đã xác nhận: tasks/phase4/plan.md. Lệnh xác minh chung:
- Backend: `backend/.venv/Scripts/python -m pytest` (baseline 400 passed / 21 skipped; 416/2 với Postgres)
- Frontend: `npm run test`, `npm run type-check`, `npm run lint`, `npm run build` trong `frontend/`
- Migration: upgrade/downgrade/upgrade trên PostgreSQL test
- Sau khi sửa mã: `graphify update .`

Mỗi task: không quá 5 tệp, để hệ thống ở trạng thái chạy được, test cùng task.

## Lát 1: AI hỏi làm rõ rồi SRS/BRD

### C1: Model và migration hồ sơ yêu cầu
**Mô tả:** Bảng `requirement_briefs` (ý tưởng gốc, danh sách mục JSON có trạng thái `clear/missing/assumed/skipped`, giá trị, nguồn, lịch sử hỏi đáp, số lượt, status `clarifying/ready/consumed`, owner, `project_id` nullable). Schema Pydantic và validator cho danh sách mục cố định.
**Tiêu chí:**
- [ ] Migration lên/xuống/lên trên PostgreSQL test
- [ ] Validator từ chối mục lạ, trạng thái lạ; mục `clear` nguồn `user` không bị ghi đè bởi nguồn AI
**Xác minh:** unit test schema/validator; pytest toàn bộ.
**Phụ thuộc:** Không. **Tệp:** `models/requirement_brief.py`, `db/base.py`, migration, `schemas/requirement_brief.py`, test. **Quy mô:** M

### C2: Job hỏi làm rõ (`ai.clarify`)
**Mô tả:** Analyzer gọi provider với hồ sơ hiện tại, nhận JSON: đánh giá mục, đúng một câu hỏi kế tiếp, đề xuất giả định tùy chọn. Validate, áp cập nhật nguyên tử theo request ID; tính quota như các AI khác; trần lượt.
**Tiêu chí:**
- [ ] Output sai schema hoặc nhiều câu hỏi bị coi là lỗi provider, không ghi hồ sơ
- [ ] Retry/restart không áp một lượt hai lần
- [ ] Hết quota hoặc vượt trần lượt trả lỗi rõ ràng, hồ sơ giữ nguyên
**Xác minh:** test với provider giả (đúng, sai schema, timeout, gọi lặp).
**Phụ thuộc:** C1. **Tệp:** `services/ai/requirement_clarifier.py`, `services/durable_handlers.py`, `models/ai_request.py` (enum), test. **Quy mô:** M

### C3: API hồ sơ yêu cầu
**Mô tả:** Tạo hồ sơ từ ý tưởng (enqueue lượt đầu), gửi câu trả lời, chấp nhận/từ chối giả định, "Bỏ qua, tạo luôn", đọc hồ sơ. Chỉ owner truy cập.
**Tiêu chí:**
- [ ] Người khác owner nhận 404/403
- [ ] Trả lời khi đang có lượt AI chạy bị từ chối 409, không tạo hai job
- [ ] Bỏ qua chuyển mục `missing` thành `skipped`, status `ready`
**Xác minh:** test endpoint; pytest.
**Phụ thuộc:** C2. **Tệp:** `endpoints/requirement_briefs.py`, `services/requirement_brief_service.py`, `api/v1/router.py`, test. **Quy mô:** M

### C4: Project Generator dùng hồ sơ đã chốt
**Mô tả:** Endpoint mới (hoặc tham số) sinh dự án từ hồ sơ `ready`; prompt hệ thống chỉ cho dùng mục `clear/assumed`, mục `skipped` để trống. Hồ sơ gắn `project_id`, chuyển `consumed`. Endpoint prompt thô giữ tương thích.
**Tiêu chí:**
- [ ] Hồ sơ chưa `ready` bị từ chối
- [ ] Không tạo hai dự án từ một hồ sơ khi retry/restart
- [ ] Luồng prompt thô cũ vẫn đạt test hiện có
**Xác minh:** test durable AI flow với provider giả; pytest.
**Phụ thuộc:** C3. **Tệp:** `services/ai/project_generator.py`, `services/ai_service.py`, `endpoints/ai.py`, test. **Quy mô:** M

### C5: UI hỏi làm rõ
**Mô tả:** Thay `AIGeneratorModal` bằng luồng: nhập ý tưởng, chat từng câu, bảng tiến độ mục (ví dụ 4/7 rõ), nút chấp nhận/sửa giả định, "Bỏ qua, tạo luôn", tạo dự án. Theo dõi job theo cơ chế polling hiện có; tải lại trang khôi phục hồ sơ. EN/VI.
**Tiêu chí:**
- [ ] Refresh giữa chừng không mất hội thoại
- [ ] Giả định hiển thị khác biệt rõ với mục người dùng xác nhận
- [ ] 390px không tràn ngang
**Xác minh:** vitest; type-check, lint, build; kiểm tra trình duyệt với provider giả.
**Phụ thuộc:** C3, C4. **Tệp:** `features/ai/components/RequirementClarifier.tsx`, hook + service, `AIGeneratorModal.tsx`, `messages/*.json`, test. **Quy mô:** M

### Checkpoint: Hỏi làm rõ
- [ ] Từ ý tưởng mơ hồ đến dự án, AI hỏi từng câu, giả định được xác nhận, bỏ qua hoạt động
- [ ] Toàn bộ test/build đạt; người dùng duyệt trước khi làm tài liệu

### D1: Mẫu tài liệu và dựng DOCX
**Mô tả:** Định nghĩa mẫu SRS và BRD (danh sách mục bắt buộc, kiểu nội dung: đoạn văn, bảng, danh sách). Renderer python-docx thuần từ JSON nội dung + mục "Giả định và vấn đề mở" sinh từ hồ sơ. Không gọi AI.
**Tiêu chí:**
- [ ] DOCX mở được, có mục lục/tiêu đề đúng cấp, bảng yêu cầu chức năng
- [ ] Mục giả định liệt kê đúng các mục `assumed/skipped`
**Xác minh:** unit test đọc lại DOCX bằng python-docx; mở thử bằng Word/LibreOffice.
**Phụ thuộc:** C1. **Tệp:** `services/documents/templates.py`, `services/documents/docx_renderer.py`, test. **Quy mô:** M

### D2: Job sinh nội dung tài liệu theo nhóm mục
**Mô tả:** Job `document.generate` cho SRS/BRD: kiểm tra mục bắt buộc của hồ sơ, thiếu thì trả trạng thái `needs_clarification` và mở lại vòng hỏi; đủ thì chia nhóm mục thành các lượt AI, lưu từng phần nguyên tử, ghép và dựng DOCX, lưu bucket private.
**Tiêu chí:**
- [ ] Nội dung AI chỉ tham chiếu dữ liệu hồ sơ/dự án; provider giả trả mục ngoài mẫu bị loại
- [ ] Restart giữa chừng tiếp tục từ phần đã lưu, không gọi lại phần đã xong
- [ ] Lỗi storage để job FAILED rõ ràng, có thể chạy lại
**Xác minh:** test với provider giả và storage giả.
**Phụ thuộc:** D1, C4. **Tệp:** `services/ai/document_writer.py`, `services/document_service.py`, `services/durable_handlers.py`, model/migration cho bản ghi tài liệu, test. **Quy mô:** M (tách D2a/D2b nếu vượt 5 tệp)

### D3: API và UI tài liệu
**Mô tả:** Endpoint yêu cầu sinh SRS/BRD, danh sách tài liệu đã sinh, tải về qua proxy kiểm tra quyền dự án. Trang/tab "Tài liệu" trong dự án; nếu cần làm rõ thì dẫn sang luồng hỏi.
**Tiêu chí:**
- [ ] Người ngoài dự án không tải được (403/404)
- [ ] Trạng thái job hiển thị qua JobsPanel, refresh khôi phục
**Xác minh:** test endpoint + vitest; build; trình duyệt.
**Phụ thuộc:** D2. **Tệp:** `endpoints/documents.py` (thay stub), service/hook/page frontend, i18n. **Quy mô:** M

### Checkpoint: Lát 1
- [ ] Ý tưởng -> hỏi làm rõ -> dự án -> SRS/BRD DOCX tải được, mục giả định đúng
- [ ] Chạy thử với provider thật một lần, ghi số quota/thời gian
- [ ] Người dùng duyệt

## Lát 2: Duyệt CR BA -> PO -> PM, phiên bản và rollback

### A1: Tạo chuỗi duyệt khi submit CR
**Mô tả:** Submit tạo 3 Approval (BA, PO, PM) cùng transaction; chặn submit nếu dự án thiếu thành viên vai trò nào. Ràng buộc unique (cr, step) qua migration.
**Tiêu chí:**
- [ ] Submit lặp không tạo bước trùng
- [ ] Thiếu vai trò trả lỗi nêu rõ vai trò còn thiếu
**Xác minh:** test service; migration lên/xuống.
**Phụ thuộc:** Không. **Tệp:** `change_request_service.py`, `models/approval.py`, migration, test. **Quy mô:** M

### A2: Quyết định bước duyệt
**Mô tả:** Endpoint approve/reject (lý do bắt buộc khi từ chối) chỉ cho bước hiện hành và đúng vai trò dự án; khóa hàng; audit log; thông báo in-app cho vai trò kế tiếp. Duyệt bước PM chuyển CR APPROVED.
**Tiêu chí:**
- [ ] Sai vai trò hoặc sai bước bị 403/409
- [ ] Hai người cùng vai trò duyệt đồng thời chỉ một thành công
- [ ] Từ chối kết thúc CR, các bước sau bị hủy
**Xác minh:** test service + concurrency PostgreSQL.
**Phụ thuộc:** A1. **Tệp:** `services/approval_service.py`, `endpoints/approvals.py` (thay stub), `router.py`, test. **Quy mô:** M

### A3: UI dòng thời gian duyệt
**Mô tả:** Trên trang CR: các bước, người quyết định, thời gian, lý do; nút duyệt/từ chối hiện theo quyền. EN/VI.
**Tiêu chí:**
- [ ] Người không đủ quyền không thấy nút
- [ ] Trạng thái cập nhật sau khi quyết định không cần reload
**Xác minh:** vitest; build; trình duyệt với 3 tài khoản vai trò.
**Phụ thuộc:** A2. **Tệp:** `features/change-requests/**`, i18n. **Quy mô:** M

### V0: Spike ngữ nghĩa snapshot/rollback
**Mô tả:** Liệt kê bảng/khóa ngoại chịu ảnh hưởng (task, dependency, phase, sprint, epic, milestone, assignment, worklog, comment, subtask). Chốt phạm vi snapshot, quy tắc task bị xóa/được thêm khi rollback, xử lý worklog. Ghi kết quả vào plan.md; không code sản phẩm.
**Tiêu chí:**
- [x] Bảng quyết định cho từng loại thực thể (plan.md mục V0, 2026-10-12)
- [ ] Người dùng duyệt quy tắc (chờ người dùng duyệt; V1/V3 tiến hành theo quy tắc mặc định)
**Phụ thuộc:** Không. **Tệp:** `tasks/phase4/plan.md`. **Quy mô:** XS

### V1: Tạo snapshot và baseline
**Mô tả:** `versioning_service` tạo snapshot theo V0 trong cùng transaction; số phiên bản tăng dần không trùng; cap phiên bản/dự án. Hook vào A2 (PM duyệt cuối) và endpoint baseline thủ công cho PM.
**Tiêu chí:**
- [ ] Snapshot nhất quán khi có ghi đồng thời
- [ ] PM duyệt cuối luôn có snapshot gắn change_request_id
**Xác minh:** test service PostgreSQL.
**Phụ thuộc:** V0, A2. **Tệp:** `services/versioning_service.py`, `endpoints/project_versions.py` (thay stub), migration nếu cần, test. **Quy mô:** M

### V2: So sánh hai phiên bản
**Mô tả:** Hàm diff thuần (thêm/xóa/sửa theo thực thể và trường); endpoint diff; UI danh sách phiên bản và màn hình so sánh.
**Tiêu chí:**
- [ ] Diff đúng với các ca thêm/xóa/sửa ngày/sửa dependency
- [ ] Phiên bản lớn không trả toàn bộ snapshot ra client khi chỉ cần diff
**Xác minh:** unit test diff; vitest; trình duyệt.
**Phụ thuộc:** V1. **Tệp:** `utils/version_diff.py`, endpoint, frontend page/hook, test. **Quy mô:** M

### V3: Rollback
**Mô tả:** PM rollback về phiên bản chọn: snapshot hiện trạng trước, khôi phục theo quy tắc V0 trong một transaction, tạo phiên bản "khôi phục về vX", enqueue tính lại CPM, audit log. UI xác nhận có hiển thị diff sẽ áp dụng.
**Tiêu chí:**
- [ ] Rollback lỗi giữa chừng không để dữ liệu nửa vời
- [ ] Rollback có thể đảo ngược bằng cách rollback về bản trước rollback
- [ ] Không mất worklog theo quy tắc V0
**Xác minh:** test PostgreSQL; trình duyệt.
**Phụ thuộc:** V2. **Tệp:** `versioning_service.py`, endpoint, frontend, test. **Quy mô:** M

### Checkpoint: Lát 2
- [ ] CR đi hết BA -> PO -> PM, snapshot tự tạo, so sánh và rollback đúng
- [ ] Người dùng duyệt

## Lát 3: Gantt chỉ đọc

### G1: Cap cho endpoint đọc CPM
**Mô tả:** Đếm task/dependency bằng COUNT trước khi nạp; vượt `CPM_MAX_TASKS`/`CPM_MAX_DEPENDENCIES` trả lỗi `resource_limit_exceeded` rõ ràng.
**Tiêu chí:** [ ] Vượt cap không nạp task; [ ] trong cap trả như cũ
**Xác minh:** test trong `tests/unit/test_cpm_scheduling.py`.
**Phụ thuộc:** Không (có thể làm sớm vì là rủi ro OOM). **Tệp:** `scheduling_service.py`, test. **Quy mô:** S

### G2: Kiểu, service, hook `useCPM`
**Tiêu chí:** [ ] 409 hiển thị được; [ ] tải lại khi task/dependency đổi hoặc job `scheduling.cpm` xong
**Phụ thuộc:** G1. **Tệp:** `types/cpm.types.ts`, `services/cpm.service.ts`, `features/gantt/hooks/useCPM.ts`, test. **Quy mô:** M

### G3: Hàm bố cục Gantt thuần
**Tiêu chí:** [ ] Mốc 0 ngày dạng kim cương; [ ] task thiếu ngày tách nhóm riêng; [ ] trục từ `anchor_date` tới `anchor + project_duration_days`
**Phụ thuộc:** G2. **Tệp:** `features/gantt/lib/layout.ts`, test. **Quy mô:** S

### G4: Component GanttChart SVG
**Tiêu chí:** [ ] Đường găng có nhãn, không chỉ dựa màu, có `aria-label`; [ ] zoom ngày/tuần/tháng, light/dark; [ ] 2000 task không treo (ảo hóa hàng)
**Phụ thuộc:** G3. **Tệp:** `components/gantt/GanttChart.tsx`, test. **Quy mô:** M

### G5: Trang Gantt, tab điều hướng, EN/VI
**Tiêu chí:** [ ] Tab hoạt động; [ ] empty/error (vòng phụ thuộc) có hướng dẫn; [ ] đủ chuỗi EN/VI
**Phụ thuộc:** G4. **Tệp:** `projects/[id]/gantt/page.tsx`, `layout.tsx`, `messages/*.json`. **Quy mô:** M

### G6: Dọn stub Gantt và cập nhật tài liệu
**Tiêu chí:** [ ] Không còn import stub; [ ] roadmap ghi Gantt chỉ đọc hoàn thành
**Phụ thuộc:** G5. **Tệp:** `endpoints/gantt.py`, `schemas/gantt.py`, `router.py`, roadmap, README. **Quy mô:** S

### Checkpoint: Lát 3
- [ ] Gantt đúng đường găng trên dự án demo; mobile không tràn
- [ ] Người dùng duyệt

## Lát 4: XLSX

- [ ] X1: Renderer openpyxl thuần (sheet Task, Đường găng, CR + lịch sử duyệt, EVA/Burndown) với test đọc lại file. M
- [ ] X2: Job `report.xlsx` + lưu bucket private + endpoint tải kiểm tra quyền; thay `workers/report_tasks.py` và `endpoints/reports.py` stub. M
- [ ] X3: Nút xuất XLSX ở trang dự án, trạng thái qua JobsPanel. S
- [ ] Checkpoint: XLSX đúng số liệu với API dashboard/CPM; người ngoài dự án bị từ chối.

## Lát 5: BPMN

- [ ] B1: Schema JSON quy trình (lane, task, gateway, event, flow) và validator (flow trỏ node tồn tại, có start/end). S
- [ ] B2: Job AI sinh quy trình từ hồ sơ yêu cầu; dữ liệu thiếu thì quay lại vòng hỏi làm rõ. M
- [ ] B3: Bố cục swimlane thuần + SVG xem trên frontend. M
- [ ] B4: Xuất PNG phía server và chèn vào SRS/BRD; lỗi vẽ thì dùng bảng các bước. M
- [ ] Checkpoint cuối Phase 4: kịch bản demo đầy đủ chạy trên Render sau cold start; roadmap và README cập nhật.
