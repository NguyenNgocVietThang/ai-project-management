# Nhật ký tiến độ Phase 4

Nhánh: `feature/phase4-workflow-reporting` (tạo từ `main` ngày 2026-10-12). Không push, không merge.

## Môi trường kiểm thử

- Backend: chạy từ thư mục gốc `backend/.venv/Scripts/python -m pytest backend/tests -c backend/pyproject.toml -q -p no:cacheprovider`. Chạy từ `backend/` hiện lỗi vì `backend/.env` cục bộ có biến `SEED_ADMIN_*` mà `Settings` cấm (extra_forbidden); không sửa tệp bí mật này.
- Baseline 2026-10-12: 408 passed, 21 skipped (SQLite). Với PostgreSQL 16 tạm (cổng 55439, `TEST_POSTGRES_URL`): 412 passed, 16 skipped, 1 failed (`test_postgres_recovers_after_worker_process_dies`: tiến trình con không import được `app` khi chạy từ thư mục gốc; lỗi môi trường có sẵn, không do Phase 4).
- Frontend: 12 tệp, 52 test Vitest đạt.
- Migration: chu trình upgrade -> downgrade -1 -> upgrade trên DB tạm `ppm_migr`; head ban đầu `20261008_security_state`.

## Nhật ký

- 2026-10-12: V0 viết vào `plan.md` theo quy tắc thận trọng, chờ người dùng duyệt. Ghi hai mặc định cho câu hỏi mở.
