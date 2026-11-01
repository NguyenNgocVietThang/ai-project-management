# B1 — Kế hoạch chi tiết: Phân loại mức tác động CR (backend)

> Lập ngày 2026-11-01. Thuộc [`tasks/thesis-revision-plan.md`](./thesis-revision-plan.md), thiết kế gốc tại [`docs/thesis/change-control-design.md`](../docs/thesis/change-control-design.md) §2.
> Trạng thái: **chờ chủ dự án xác nhận**. Chưa viết mã.

## 0. Phát hiện khi đối chiếu mã (ảnh hưởng thiết kế)

| # | Phát hiện | Tệp | Hệ quả cho B1 |
|---|---|---|---|
| F1 | **Không có API đọc báo cáo tác động đã lưu.** UI chỉ hiển thị báo cáo từ kết quả job đang theo dõi trong state của component, nên tải lại trang là mất báo cáo | `ChangeRequestDetail.tsx` (state `jobId`), `endpoints/ai.py` | Phải thêm `GET /change-requests/{id}/impact-report`, vì cổng duyệt MAJOR và app mobile đều cần |
| F2 | **CR không sửa được sau khi tạo** (chỉ có list/create/get/submit) | `endpoints/change_requests.py` | Bỏ khái niệm `content_revision` của CR. Thay bằng `revision` của **báo cáo**: mỗi lần chạy lại AI thì tăng, người duyệt xác nhận theo đúng revision đã đọc |
| F3 | Báo cáo upsert tại chỗ (unique theo CR) ở **hai nơi**: `run_impact_analysis` (pha execute, sau đó bị rollback) và `apply` trong `durable_jobs.py`; ngoài ra còn mã Celery kế thừa `workers/ai_tasks.py` | `ai/impact_analyzer.py:191`, `ai/durable_jobs.py:195` | Trường mới phải được ghi ở pha `apply`; pha execute chỉ cần trả thêm dữ liệu trong `result` |
| F4 | Chỉ PM hoặc BA được tạo CR | `change_request_service.py:39` | PM tạo CR thì mức coi như **đã chốt luôn**; BA tạo thì PM phải chốt |
| F5 | Lỗi 422 nghiệp vụ dùng chuỗi `detail` dạng `code: ...`, frontend parse bằng regex | `missing_roles` trong `approvals.ts:61` | Mã lỗi mới theo cùng quy ước: `detail = "<code>"` hoặc `"<code>: <chi tiết>"` |
| F6 | `Project.budget` có thể null; duration lấy từ CPM | `models/project.py:66` | Quy tắc gợi ý dự phòng phải chịu được thiếu budget |

## 1. Phạm vi B1

**Trong B1:** model, migration, schema, service, endpoint, prompt AI, kiểm thử backend, cập nhật SRS và `change-control-design.md` theo F1–F2.
**Không trong B1:** giao diện web (B2), app mobile (B7), khôi phục phiên bản (B3).

## 2. Thay đổi dữ liệu — migration `20261101_cr_impact_level`

| Bảng | Cột mới | Kiểu | Ghi chú |
|---|---|---|---|
| `change_requests` | `impact_level` | `String(16)` NOT NULL, mặc định `'MODERATE'`, CHECK in (`MINOR`,`MODERATE`,`MAJOR`) | Dùng String + CHECK giống `device_tokens.platform`, tránh enum native khó downgrade |
| | `impact_level_confirmed_by_id` | FK `users.id` NULL | NULL + có `confirmed_at` nghĩa là hệ thống chốt (dữ liệu cũ) |
| | `impact_level_confirmed_at` | `DateTime(tz)` NULL | NULL nghĩa là PM chưa chốt |
| | `impact_level_change_reason` | `Text` NULL | Lý do lần đổi mức gần nhất; lịch sử đầy đủ nằm trong audit log |
| `impact_reports` | `revision` | `Integer` NOT NULL, mặc định 1 | +1 mỗi lần ghi đè báo cáo |
| | `source` | `String(8)` NOT NULL, mặc định `'AI'`, CHECK in (`AI`,`MANUAL`) | |
| | `suggested_impact_level` | `String(16)` NULL, CHECK | Mức AI gợi ý (hoặc quy tắc dự phòng) |
| | `impact_level_rationale` | `Text` NULL | Lý do gợi ý |
| | `created_by_id` | FK `users.id` NULL | Người chạy job AI hoặc PM nhập thủ công |
| `approvals` | `impact_level_at_decision` | `String(16)` NULL | Mức tại thời điểm quyết định |
| | `acknowledged_report_revision` | `Integer` NULL | Revision báo cáo người duyệt xác nhận đã đọc |

**Dữ liệu cũ:** mọi CR hiện có được gán `MODERATE`, `impact_level_confirmed_at = now()`, `confirmed_by_id = NULL` (hệ thống chốt). Báo cáo cũ được gán `revision=1`, `source='AI'`.
**Downgrade:** xóa các cột và constraint vừa thêm. Kiểm thử lên/xuống trên PostgreSQL cục bộ và SQLite như các migration trước; `test_alembic_head.py` phải trỏ head mới.

## 3. Quy tắc nghiệp vụ

### 3.1 Đặt và chốt mức

| Hành động | Ai | Khi nào | Quy tắc |
|---|---|---|---|
| Đề xuất mức khi tạo CR | Người tạo (PM/BA) | Tạo | Trường `impact_level` tùy chọn, mặc định `MODERATE`. Người tạo là PM thì **tự chốt** (`confirmed_by = PM`) |
| Chốt / đổi mức | **Chỉ PM của dự án** (không phải admin) | CR ở `DRAFT`, `SUBMITTED`, `UNDER_REVIEW` | `POST /change-requests/{id}/impact-level` `{level, reason?}`. Ghi audit `IMPACT_LEVEL` với mức cũ/mới |
| Hạ mức từ `MAJOR` | PM | như trên | `reason` bắt buộc (không rỗng), thiếu thì 422 `reason_required` |
| Đổi mức khi CR đã kết thúc | — | `APPROVED`/`REJECTED`/`CANCELLED`/`IMPLEMENTED` | 409 |

### 3.2 Nâng mức giữa chừng mở lại các bước

Nếu PM **nâng mức** khi đã có bước `APPROVED` (CR `UNDER_REVIEW`), thì:
1. mọi bước `APPROVED` quay về `PENDING`; xóa `approver_id`, `approved_at`, `comment`, `acknowledged_report_revision`;
2. CR về `SUBMITTED`;
3. ghi audit (danh sách bước bị mở lại) và gửi thông báo cho người giữ vai trò BA ("CR cần duyệt lại do nâng mức tác động").

Hạ mức thì **không** mở lại, vì điều kiện cũ chặt hơn nên vẫn thỏa. Mọi thao tác chạy dưới cùng khóa hàng CR (`with_for_update`) như `_decide`, tránh đua với quyết định duyệt.

### 3.3 Cổng khi quyết định bước (`ApprovalService._decide`)

Kiểm tra theo thứ tự, sau các kiểm tra vai trò/trạng thái hiện có:

| # | Điều kiện | Áp dụng | Lỗi |
|---|---|---|---|
| G1 | `impact_level_confirmed_at` không null | Duyệt **và** từ chối, mọi mức | 422 `impact_level_unconfirmed` |
| G2 | Có báo cáo tác động (AI hoặc MANUAL) | Duyệt, mức `MAJOR` | 422 `impact_report_required` |
| G3 | `acknowledged_report_revision` trong body **bằng** `revision` hiện tại của báo cáo | Duyệt, mức `MAJOR` | thiếu: 422 `acknowledgement_required`; lệch: 422 `impact_report_changed` (báo cáo đã chạy lại sau khi người duyệt đọc) |
| G4 | `comment` không rỗng | Duyệt, mức `MAJOR` | 422 `comment_required` |

- **Từ chối** CR MAJOR không cần G2–G4, vì từ chối là hướng an toàn (lý do vẫn bắt buộc như hiện tại).
- Duyệt mức `MINOR`/`MODERATE` vẫn chấp nhận `acknowledged_report_revision` (tùy chọn) và lưu lại nếu có.
- Bước được quyết định lưu `impact_level_at_decision`. Audit `APPROVE`/`REJECT` ghi thêm `impact_level` và `acknowledged_report_revision`.
- **Duyệt nhanh từ thông báo:** backend không cần biết request đến từ đâu, vì G3–G4 đã tự chặn mọi lần duyệt MAJOR không kèm xác nhận và nhận xét. App mobile chỉ cần ẩn nút duyệt nhanh khi CR là MAJOR.

### 3.4 Báo cáo tác động

- **Đọc:** `GET /change-requests/{id}/impact-report`. Mọi thành viên dự án được đọc (cùng quyền đọc CR). Chưa có báo cáo thì 404.
- **Nhập thủ công:** `PUT /change-requests/{id}/impact-report/manual` (chỉ PM, CR chưa kết thúc) với body `{risk_level, schedule_impact_days, cost_impact, summary (bắt buộc), suggested_impact_level?}`.
  - Chỉ cho phép khi **chưa có** báo cáo `source=AI`; ngược lại trả 409, tránh ghi đè kết quả AI. Đây là đường dự phòng khi AI lỗi hoặc hết quota.
  - Ghi đè báo cáo MANUAL cũ thì `revision + 1`. Ghi audit.
- **Chạy lại AI** khi đang có báo cáo MANUAL: AI ghi đè, `source=AI`, `revision + 1`. Người duyệt sau phải xác nhận revision mới (G3).
- Response báo cáo luôn có `advisory: true` (hằng số) và `source`, để UI/mobile hiển thị nhãn "Khuyến nghị – không có giá trị quyết định".

### 3.5 AI gợi ý mức (`impact_analyzer.py`)

- Mở rộng `SYSTEM_PROMPT`: thêm `"suggested_impact_level": "MINOR"|"MODERATE"|"MAJOR"` và `"impact_level_rationale": "<1-3 câu>"`, kèm định nghĩa ba mức đúng như `change-control-design.md` §2.1. Prompt giữ nguyên câu dặn dữ liệu người dùng là không tin cậy.
- `_validate_ai_output`: mức không hợp lệ hoặc thiếu thì dùng **quy tắc dự phòng** `derive_impact_level(...)` (hàm thuần, có unit test) và gắn rationale `"Suy ra theo quy tắc từ số liệu báo cáo"`:
  - `MAJOR` khi `schedule_impact_days ≥ 10`, **hoặc** ≥ 10% thời lượng dự án (CPM), **hoặc** `cost_impact ≥ 10%` budget (nếu có budget), **hoặc** `risk_level = CRITICAL`;
  - `MINOR` khi `schedule_impact_days ≤ 2` **và** không task găng nào nằm trong `affected_task_ids` **và** (`cost_impact ≤ 2%` budget hoặc không có budget và `cost_impact = 0`) **và** `risk_level = LOW`;
  - còn lại `MODERATE`.
  - Các ngưỡng đặt thành hằng số ở đầu tệp để dễ chỉnh sau đánh giá E2.
- **Hệ thống không bao giờ tự đổi `change_requests.impact_level` theo gợi ý.** Có test khẳng định điều này.

## 4. Thay đổi API (tóm tắt)

| Endpoint | Thay đổi |
|---|---|
| `POST /projects/{pid}/change-requests` | Body thêm `impact_level?` |
| `GET` CR (list/detail), `submit` | Response thêm `impact_level`, `impact_level_confirmed`, `impact_level_confirmed_by_id`, `impact_level_confirmed_at`, `impact_level_change_reason` |
| `POST /change-requests/{id}/impact-level` | **Mới** — PM chốt/đổi mức |
| `GET /change-requests/{id}/impact-report` | **Mới** — đọc báo cáo đã lưu |
| `PUT /change-requests/{id}/impact-report/manual` | **Mới** — PM nhập đánh giá thủ công |
| `POST .../approvals/{step}/approve` | Body thêm `acknowledged_report_revision?`; áp dụng G1–G4 |
| `POST .../approvals/{step}/reject` | Áp dụng G1 |
| `GET .../approvals` | Response chuỗi thêm `impact_level`, `impact_level_confirmed`, `report_revision` (null nếu chưa có), `requires_acknowledgement`, `requires_comment`; mỗi bước thêm `impact_level_at_decision`, `acknowledged_report_revision` |
| Job `ai.impact_analysis` | Kết quả có thêm `suggested_impact_level`, `impact_level_rationale`, `source`, `revision`, `advisory` |

Mọi thay đổi chỉ **thêm trường**, frontend hiện tại không vỡ khi đọc. Sau khi đổi API phải xuất lại `mobile/openapi/openapi.json` bằng script hiện có.

## 5. Tệp dự kiến

| Tệp | Loại |
|---|---|
| `backend/alembic/versions/20261101_cr_impact_level.py` | mới |
| `backend/app/models/change_request.py`, `impact_report.py`, `approval.py` | sửa — thêm enum `ImpactLevel`, `ReportSource` |
| `backend/app/schemas/change_request.py`, `impact_report.py`, `approval.py` | sửa |
| `backend/app/services/change_request_service.py` | sửa — tạo CR với mức, `set_impact_level`, đọc báo cáo, nhập thủ công |
| `backend/app/services/approval_service.py` | sửa — cổng G1–G4, lưu mức/ack, mở lại bước |
| `backend/app/services/ai/impact_analyzer.py` | sửa — prompt, validate, `derive_impact_level` |
| `backend/app/services/ai/durable_jobs.py` | sửa — pha `apply` ghi trường mới, tăng revision |
| `backend/app/workers/ai_tasks.py` | sửa tối thiểu cho khớp schema (mã kế thừa) |
| `backend/app/api/v1/endpoints/change_requests.py` | sửa — 3 endpoint mới |
| `mobile/openapi/openapi.json` | sinh lại |
| `docs/specs/system-architecture/srs.md`, `docs/thesis/change-control-design.md` | cập nhật theo F1–F2 và trạng thái |

Số tệp lớn hơn 5 nên **chia 3 commit**: (1) migration + model + schema; (2) service/endpoint mức tác động + cổng duyệt + báo cáo; (3) AI gợi ý + job + OpenAPI + tài liệu.

## 6. Kiểm thử

**Unit**
- `test_impact_analyzer.py`: AI trả mức hợp lệ thì giữ; thiếu/sai thì dùng quy tắc dự phòng; bảng biên của `derive_impact_level` (2/3 ngày, 9/10 ngày, 10% thời lượng, có/không budget, task găng, CRITICAL).
- `test_change_request_service.py`: mặc định MODERATE; PM tạo thì tự chốt; BA tạo thì chưa chốt; giá trị mức sai thì 422.

**Integration** (`test_cr_impact_level.py` mới, mở rộng `test_approval_decisions.py`)
1. G1: CR do BA tạo, chưa chốt, BA duyệt hoặc từ chối thì 422 `impact_level_unconfirmed`.
2. Chỉ PM chốt được; BA/PO/admin thì 403; người ngoài dự án thì 404/403 như quy ước hiện có.
3. Hạ từ MAJOR không lý do thì 422 `reason_required`; có lý do thì đạt, audit đúng.
4. MAJOR chưa có báo cáo thì duyệt 422 `impact_report_required`; từ chối vẫn được.
5. MAJOR có báo cáo nhưng thiếu ack thì 422 `acknowledgement_required`; ack lệch revision thì 422 `impact_report_changed`; thiếu comment thì 422 `comment_required`; đủ cả thì duyệt qua cả 3 bước, CR APPROVED, snapshot được tạo.
6. Nâng MODERATE lên MAJOR sau khi BA đã duyệt: bước BA về PENDING, CR về SUBMITTED, BA nhận thông báo, audit liệt kê bước mở lại. Hạ mức thì không mở lại.
7. Đổi mức khi CR đã APPROVED/REJECTED thì 409.
8. Báo cáo: GET 404 khi chưa có; nhập thủ công chỉ PM; nhập thủ công khi đã có báo cáo AI thì 409; nhập thủ công ghi đè MANUAL thì revision +1; chạy AI sau MANUAL thì `source=AI`, revision +1.
9. Job `ai.impact_analysis` với provider giả: lưu `suggested_impact_level`, revision tăng sau mỗi lần chạy, **`change_requests.impact_level` không đổi**.
10. Quyền đọc báo cáo: thành viên dự án đọc được; người ngoài dự án không đọc được (bổ sung vào `test_authz_matrix.py` nếu ma trận có liệt kê route).
11. `test_route_exposure.py` / `test_openapi_export.py`: cập nhật danh sách route mới.

**PostgreSQL** (`test_approval_postgres.py`): PM đổi mức đồng thời với BA duyệt; khóa hàng bảo đảm hoặc BA nhận 409/422, hoặc bước bị mở lại, không có trạng thái lẫn lộn.

**Migration:** lên/xuống trên PostgreSQL cục bộ; dữ liệu CR cũ sau upgrade là MODERATE và đã chốt.

**Hồi quy:** toàn bộ `pytest` backend đạt; frontend `vitest` + type-check đạt (dù không sửa, để chứng minh thêm trường không làm vỡ).

## 7. Tiêu chí nghiệm thu B1

- Mọi ca ở §6 đạt; không test cũ nào bị bỏ qua hay sửa kỳ vọng ngoài các chỗ hợp lệ do thêm trường.
- Không có đường mã nào để AI ghi `change_requests.impact_level` hoặc `approvals`.
- OpenAPI sinh lại; SRS CR-07, CR-08 đổi từ **[Dự kiến]** sang đã triển khai; `graphify update .` chạy xong.

## 8. Điểm cần chủ dự án quyết định

| # | Câu hỏi | Đề xuất |
|---|---|---|
| D1 | Giữa B1 và B2, web chưa có nút "PM chốt mức". CR mới do BA tạo sẽ **bị chặn duyệt (G1)** cho tới khi có B2 | **Làm B1 rồi B2 ngay, đẩy `main` cùng lúc**, để web không có khoảng thời gian bị vỡ luồng |
| D2 | G1 áp dụng cho mọi mức, kể cả MINOR? | Có. Người tạo có thể khai MINOR để né kiểm soát, nên PM chốt là chốt chặn |
| D3 | Có cho PM tự hạ MAJOR khi chính PM là người tạo không? | Có, nhưng bắt buộc lý do và ghi audit. Hội đồng xem được trong audit timeline |
| D4 | Ngưỡng quy tắc dự phòng (2 ngày / 10 ngày / 10% / 2%) | Dùng tạm, chỉnh sau E2 và ghi lý do chỉnh |
