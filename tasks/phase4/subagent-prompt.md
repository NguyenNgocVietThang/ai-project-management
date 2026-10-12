# Prompt điều phối subagent — Phase 4

Dán toàn bộ khối dưới đây vào một đoạn chat mới (Claude Code, thư mục gốc dự án).

---

Dùng subagent để thực hiện toàn bộ Phase 4 theo `tasks/phase4/todo.md` cho đến khi mọi task được đánh dấu xong. Bạn là điều phối viên: tự lập lịch, giao việc cho subagent, kiểm tra kết quả, gộp và commit. Không dừng lại hỏi giữa chừng trừ các trường hợp ở mục "Điểm dừng bắt buộc".

## Đọc trước khi bắt đầu

1. `AGENTS.md` (quy tắc graphify), `tasks/phase4/plan.md` (ý định đã xác nhận, kiến trúc, rủi ro), `tasks/phase4/todo.md` (task, tiêu chí, xác minh, phụ thuộc).
2. Chạy `graphify query "<câu hỏi>"` trước khi đọc mã thô cho mỗi vùng mã mới.
3. Không sửa `tasks/plan.md`, `tasks/todo.md` (kế hoạch Render còn mục mở).

## Quy tắc bắt buộc cho mọi subagent (chép nguyên vào prompt của từng subagent)

- Comment trong mã viết bằng tiếng Việt. Tệp Markdown không dùng emoji/biểu tượng; trạng thái diễn đạt bằng chữ.
- Chỉ sửa các tệp thuộc task được giao; nếu buộc phải sửa tệp chung (xem danh sách tệp chung bên dưới), báo lại cho điều phối viên thay vì tự sửa.
- Viết test cùng task. Backend chạy bằng `backend/.venv/Scripts/python -m pytest` (baseline 400 passed / 21 skipped; không được giảm). Frontend trong `frontend/`: `npm run test`, `npm run type-check`, `npm run lint`.
- Không gọi provider AI thật, không gửi email, không gọi Supabase/Render thật. Dùng provider/storage giả lập trong test.
- Không làm yếu chất lượng để qua test: không skip/xóa test, không `@ts-ignore`, `eslint-disable`, `# type: ignore` mới, không hạ ngưỡng cấu hình.
- Không commit, không push. Trả về: danh sách tệp đã sửa, lệnh test đã chạy kèm kết quả số liệu, tiêu chí nào đạt, điều gì chưa chắc.

## Tệp chung (chỉ điều phối viên sửa, hoặc giao cho đúng một subagent tại một thời điểm)

`backend/app/api/v1/router.py`, `backend/app/services/durable_handlers.py`, `backend/app/models/ai_request.py` (enum), `backend/app/db/base.py`, `backend/alembic/versions/*`, `frontend/messages/en.json`, `frontend/messages/vi.json`, `frontend/src/app/(dashboard)/projects/[id]/layout.tsx`, `backend/app/core/config.py`.

Migration Alembic phải tuyến tính: chỉ một subagent tạo migration tại một thời điểm, `down_revision` trỏ head mới nhất; sau mỗi migration kiểm tra upgrade -> downgrade -> upgrade trên PostgreSQL test và `alembic heads` chỉ có một head.

## Lịch thực hiện theo đợt

Trong mỗi đợt, các nhánh song song không chung tệp. Chạy subagent song song trong một message; đợi đủ kết quả, xác minh, commit từng task rồi mới sang đợt sau.

- Đợt 1 (song song):
  - Nhánh Gantt: G1 -> G2 -> G3 -> G4 (một subagent làm tuần tự; G5 để đợt sau vì đụng `layout.tsx` và i18n).
  - Nhánh hồ sơ: C1 (có migration).
  - Nhánh renderer thuần: D1 (DOCX), X1 (XLSX), B1 (schema BPMN) — không migration, không tệp chung.
  - Điều phối viên tự viết V0 (xem mục V0 bên dưới).
- Đợt 2: C2 (chạm `durable_handlers.py`, enum AI) ; A1 (migration, sau khi C1 đã merge) ; G5 (`layout.tsx`, i18n).
- Đợt 3: C3 (`router.py`) ; A2 ; G6.
- Đợt 4: C4 ; A3 (frontend CR, i18n) ; V1.
- Đợt 5: C5 (i18n) ; V2.
- Đợt 6: D2 (migration bản ghi tài liệu, `durable_handlers.py`) ; V3.
- Đợt 7: D3 (thay stub `documents.py`, `router.py`, i18n) ; X2 (thay stub `reports.py`, `report_tasks.py`).
- Đợt 8: X3 ; B2.
- Đợt 9: B3.
- Đợt 10: B4.

Nếu hai task cùng đợt cần cùng một tệp chung, chạy tuần tự trong đợt đó. Điều chỉnh lịch khi thực tế khác, nhưng không bao giờ cho hai subagent cùng sửa một tệp.

## V0 — quy tắc rollback mặc định

Người dùng chưa duyệt V0. Điều phối viên viết V0 vào `tasks/phase4/plan.md` theo quy tắc thận trọng sau, rồi tiếp tục; ghi rõ "chờ người dùng duyệt" trong báo cáo cuối:
- Snapshot gồm: phase, sprint, epic, milestone, task (trường lịch, trạng thái, phân cấp, assignee), dependency. Không gồm worklog, comment, chat, file.
- Rollback: task có trong snapshot được khôi phục giá trị trường; task không có trong snapshot nhưng đang tồn tại thì chuyển trạng thái hủy/lưu trữ, không xóa cứng nếu có worklog/comment/assignment, xóa cứng nếu không có dữ liệu phụ thuộc; task có trong snapshot nhưng đã bị xóa thì tạo lại với ID mới và ghi ánh xạ trong phiên bản rollback.
- Worklog không bao giờ bị xóa bởi rollback.

## Câu hỏi mở — giá trị mặc định đã áp dụng

- Người tạo CR được duyệt bước của vai trò mình (phục vụ demo ít tài khoản); ghi chú trong tài liệu.
- Tài liệu sinh bằng tiếng Việt mặc định, có tham số `language` (`vi` | `en`).
Ghi hai mặc định này vào `plan.md` và nêu trong báo cáo cuối.

## Xác minh sau mỗi task (điều phối viên tự chạy, không tin báo cáo subagent)

1. Đọc diff; kiểm tra đủ tiêu chí trong `todo.md`, không có thay đổi ngoài phạm vi, không có suppression mới.
2. Chạy lại test liên quan và toàn bộ pytest/vitest khi task chạm backend/frontend.
3. Nếu có migration: upgrade/downgrade/upgrade trên PostgreSQL test và một head duy nhất.
4. Đạt thì: đánh dấu `[x]` trong `tasks/phase4/todo.md` kèm một dòng bằng chứng (số test, lệnh), thêm nhật ký vào `tasks/phase4/progress.md`, commit.
5. Không đạt: gửi lại cho chính subagent đó (SendMessage) với lỗi cụ thể; tối đa 2 vòng, sau đó tự sửa hoặc ghi là chặn.

## Git

- Làm trên nhánh mới `feature/phase4-workflow-reporting` tạo từ `main`. Không push, không merge vào `main`.
- Mỗi task một commit, thông điệp kiểu repo hiện có: tiếng Việt không dấu, tiền tố conventional, ví dụ `feat(gantt): them cap kich thuoc cho endpoint doc CPM (G1)`.
- Commit dưới git config của người dùng (NguyenNgocVietThang). Không thêm dòng Co-Authored-By hay bất kỳ ghi công Claude/Anthropic nào.

## Checkpoint giữa các lát

Tại mỗi "Checkpoint" trong `todo.md`, chạy toàn bộ: pytest, vitest, type-check, lint, `npm run build`, migration lên/xuống. Kiểm tra trình duyệt bằng Docker stack cục bộ với provider AI giả cho các luồng UI (hỏi làm rõ, duyệt CR, phiên bản/rollback, Gantt, tải tài liệu), gồm cả 390px. Mục "người dùng duyệt" trong checkpoint: không dừng, ghi lại để người dùng duyệt ở báo cáo cuối.

## Điểm dừng bắt buộc (chỉ những trường hợp này mới hỏi người dùng)

- Cần gọi provider AI thật, Supabase/Render thật, hoặc bất kỳ thao tác ra ngoài máy.
- Thay đổi phá vỡ API hiện có mà frontend/demo đang dùng.
- Một task bị chặn sau 2 vòng sửa và không có cách vòng qua hợp lý.

Các bước nghiệm thu cần cloud (chạy thử provider thật ở checkpoint lát 1, kịch bản demo trên Render) không làm; ghi là "chờ người dùng" trong báo cáo.

## Kết thúc

Hoàn tất khi mọi task trong `tasks/phase4/todo.md` là `[x]` hoặc ghi rõ lý do chặn. Sau đó:
1. Chạy toàn bộ kiểm tra lần cuối và `graphify update .`.
2. Cập nhật `docs/roadmap/PHASE_4_WORKFLOW_REPORTING_MODULE.md` và README theo hiện trạng thật.
3. Báo cáo ngắn bằng tiếng Việt: task xong, số liệu test, quyết định mặc định đã áp dụng (V0, hai câu hỏi mở), mục chờ người dùng (duyệt checkpoint, nghiệm thu provider thật/Render), rủi ro còn lại.
