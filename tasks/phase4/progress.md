# Nhật ký tiến độ Phase 4

Nhánh: `feature/phase4-workflow-reporting` (tạo từ `main` ngày 2026-10-12). Không push, không merge.

## Môi trường kiểm thử

- Backend: chạy từ thư mục gốc `backend/.venv/Scripts/python -m pytest backend/tests -c backend/pyproject.toml -q -p no:cacheprovider`. Chạy từ `backend/` hiện lỗi vì `backend/.env` cục bộ có biến `SEED_ADMIN_*` mà `Settings` cấm (extra_forbidden); không sửa tệp bí mật này.
- Baseline 2026-10-12: 408 passed, 21 skipped (SQLite). Với PostgreSQL 16 tạm (cổng 55439, `TEST_POSTGRES_URL`): 412 passed, 16 skipped, 1 failed (`test_postgres_recovers_after_worker_process_dies`: tiến trình con không import được `app` khi chạy từ thư mục gốc; lỗi môi trường có sẵn, không do Phase 4).
- Frontend: 12 tệp, 52 test Vitest đạt.
- Migration: chu trình upgrade -> downgrade -1 -> upgrade trên DB tạm `ppm_migr`; head ban đầu `20261008_security_state`.

## Nhật ký

- 2026-10-12: V0 viết vào `plan.md` theo quy tắc thận trọng, chờ người dùng duyệt. Ghi hai mặc định cho câu hỏi mở.
- 2026-10-12: B1 xong. `schemas/bpmn.py` (ProcessModel, validator đồ thị, trần 12 lane/80 node/150 flow, `process_steps_table`, `parse_process_model`). Test 40 passed. Nhánh gateway thiếu nhãn chỉ là cảnh báo.
- 2026-10-12: X1 xong. `services/reports/xlsx_renderer.py` 4 sheet, chống formula injection bằng kiểu chuỗi. Test 14 passed. EVA chưa có nguồn số liệu trong dashboard_service.
- 2026-10-12: D1 xong. `services/documents/templates.py`, `docx_renderer.py` (SRS/BRD, TOC field, bảng yêu cầu, mục giả định từ hồ sơ, ảnh BPMN hoặc bảng bước dự phòng). Test 15 passed. Điều phối viên bỏ một `noqa` thừa. Chưa mở thử bằng Word/LibreOffice.
- 2026-10-13: C1 xong. Bảng `requirement_briefs` (RLS trên Postgres), schema và `apply_item_updates`. Migration cycle đạt. Pytest 521/21. Người dùng yêu cầu: hoàn tất thì tự gộp vào `main` và commit (không push).
- 2026-10-13: G1-G4 xong. CPM đọc áp cap (422 resource_limit_exceeded), useCPM theo dõi job, layout thuần, GanttChart SVG ảo hóa. Vitest 71 passed; pytest CPM 22 passed. Migration enum AIRequest (`20261013_ai_request_types_phase4`) do điều phối viên viết, cycle đạt.
- 2026-10-13: G5 xong. Trang `projects/[id]/gantt`, tab Gantt, namespace i18n `gantt` (25 key). Vitest 77 passed, build đạt.
- 2026-10-13: C2 xong. `services/ai/requirement_clarifier.py`, nhánh REQUIREMENT_CLARIFY trong `durable_jobs.py`; trần 12 lượt (409 `clarify_turn_limit`), quota 429; hồ sơ không tự chuyển `ready` (output có `complete`).
- 2026-10-13: A1 xong. Migration `20261013_approval_chain` (approver_id nullable, required_role, CANCELLED, unique (cr, step)). Submit tạo 3 bước BA/PO/PM, CR ở SUBMITTED; thiếu vai trò 422.
- 2026-10-13: G6 xong. Xóa stub Gantt, cập nhật router comment, README, roadmap. Pytest 558/21.
- 2026-10-13: C3 xong. API `/requirement-briefs` (tạo, đọc, trả lời, giả định, sửa mục, skip, finalize); không tự finalize.
