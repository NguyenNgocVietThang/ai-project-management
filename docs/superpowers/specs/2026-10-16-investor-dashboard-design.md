# Thiết kế: Investor Dashboard (Phase 5, giai đoạn 5.3)

> **Ngày:** 2026-10-16 | **Trạng thái:** Đã triển khai | **Lộ trình gốc:** `docs/roadmap/PHASE_5_DOCUMENT_AI_POLISH_MODULE.md`

## 1. Mục tiêu

Cho người dùng có role `Investor` một cổng chỉ đọc để xem tình hình tài chính và tiến độ của các portfolio họ được cấp quyền: ngân sách, chi phí thực, chỉ số EVM (CPI, SPI, EAC, VAC), ROI kỳ vọng và mức rủi ro.

Ngoài phạm vi:
- quy đổi tiền tệ
- xuất báo cáo cho investor
- gửi thông báo khi được cấp quyền
- investor bình luận hoặc tương tác

## 2. Hiện trạng

- Role `Investor` được seed trong `backend/app/db/seed.py` với `portfolio:read`, `project:read`, `dashboard:read`, `report:read`, nhưng chưa endpoint nào kiểm tra các quyền này.
- `PortfolioService._get_owned` và `DashboardService.get_portfolio_health` chỉ cho admin hoặc `owner_id`, nên investor hiện nhận 403.
- `Project` có `budget`, `actual_cost`, `progress`, `currency`, `start_date`, `end_date`, `portfolio_id`. Không có trường lợi ích kỳ vọng.
- `RiskReport` lưu `risk_score` (0–10) và `risk_level` (LOW/MEDIUM/HIGH/CRITICAL) theo dự án, có thể có nhiều bản ghi.
- Migration head hiện tại: `20261013_process_models`.

## 3. Mô hình dữ liệu

Một migration mới `20261016_investor_portal`, `down_revision = "20261013_process_models"`:

| Thay đổi | Chi tiết |
|---|---|
| Bảng `portfolio_investors` | Cột chuẩn của `Base` (`id`, `created_at`, `updated_at`); `portfolio_id` FK `portfolios.id` ON DELETE CASCADE; `user_id` FK `users.id` ON DELETE CASCADE; `granted_by_id` FK `users.id` ON DELETE SET NULL, nullable. UniqueConstraint `uq_portfolio_investors_portfolio_user` trên `(portfolio_id, user_id)`. Index `ix_portfolio_investors_user` trên `user_id`. `created_at` chính là thời điểm cấp quyền (`granted_at` trong API). |
| Cột `projects.expected_benefit` | Float, nullable. Tổng lợi ích kỳ vọng của dự án, cùng tiền tệ với `projects.currency`. Phải `>= 0` (CHECK `ck_projects_expected_benefit_nonneg`). |

Downgrade xóa CHECK, cột và bảng theo thứ tự ngược lại.

Model mới `backend/app/models/portfolio_investor.py` (`PortfolioInvestor(Base)`), đăng ký trong `app/models/__init__.py` như các model khác. Dùng model ORM thay vì `Table` kết hợp (như `project_members`), vì cần lưu `granted_by_id` và dùng `created_at` làm thời điểm cấp.

## 4. Quy tắc truy cập

Ký hiệu: `admin` là `is_admin(user)` trong `backend/app/services/phase2_common.py`; `owner` là `portfolio.owner_id == user.id`; `granted` là có dòng `portfolio_investors(portfolio_id, user.id)`.

| Hành động | Điều kiện |
|---|---|
| Gọi bất kỳ endpoint `/investor/*` | Có quyền `portfolio:read` (kiểm tra bằng `require_permissions("portfolio:read")`). |
| Xem portfolio P qua `/investor` | `admin` hoặc `owner` hoặc `granted`. |
| Xem dự án X qua `/investor` | X chưa bị xóa mềm, `X.portfolio_id` không null, và người dùng xem được portfolio đó theo dòng trên. |
| Liệt kê, cấp, thu hồi investor của P | `admin` hoặc `owner`. |
| Được nhận quyền | Người được cấp phải có role `Investor`; nếu không thì trả 400. |
| Quyền đã cấp còn hiệu lực | (Quyết định F3) Chỉ khi người được cấp vẫn có role `Investor` tại thời điểm đọc; mất role thì lượt cấp ngừng có tác dụng (admin và owner không bị ảnh hưởng). |

Quy tắc bổ sung:
- Portfolio hoặc dự án đã xóa mềm trả 404. Không có quyền thì trả 403, giống các service hiện có.
- Mỗi request đọc quyền thẳng từ DB, không cache. Thu hồi có hiệu lực ngay ở request kế tiếp.
- Cấp quyền cho người đã có quyền là thao tác idempotent: trả 200 với bản ghi hiện có, không lỗi.
- Cấp và thu hồi đều ghi `AuditLog` (`entity_type="Portfolio"`, action `grant_investor`/`revoke_investor`) theo cách `PortfolioService._audit` đang làm.
- Không thay đổi endpoint ghi nào hiện có. Investor không phải owner, không phải PM hay thành viên dự án, nên các kiểm tra hiện tại đã trả 403. Test sẽ khẳng định điều này.
- Dữ liệu trả cho investor chỉ là số liệu tổng hợp cấp dự án. Không trả danh sách thành viên, task chi tiết, worklog, chat hay thông tin cá nhân.

## 5. Chỉ số EVM và ROI

Hàm thuần trong `backend/app/services/evm.py`, không truy cập DB:

```
compute_project_metrics(budget, actual_cost, progress, start_date, end_date, expected_benefit, today) -> ProjectMetrics
aggregate_metrics(list[ProjectMetrics]) -> PortfolioMetrics
```

Định nghĩa (mọi giá trị có thể là `null` khi thiếu dữ liệu):

| Chỉ số | Công thức | Trả `null` khi |
|---|---|---|
| BAC | `budget` | `budget` null hoặc `<= 0` |
| AC | `actual_cost` | không bao giờ (mặc định 0) |
| EV | BAC × clamp(`progress`, 0, 100) / 100 | BAC null |
| PV | BAC × tỷ lệ thời gian đã trôi | BAC null, hoặc thiếu `start_date`/`end_date`, hoặc `end_date < start_date` |
| CPI | EV / AC | EV null hoặc AC = 0 |
| SPI | EV / PV | EV null, PV null hoặc PV = 0 |
| EAC | BAC / CPI | CPI null hoặc CPI = 0 |
| VAC | BAC − EAC | EAC null |
| ROI kỳ vọng | (`expected_benefit` − C) / C, với C = EAC nếu có, ngược lại C = BAC | `expected_benefit` null, hoặc C null hoặc C = 0 |

Tỷ lệ thời gian đã trôi được tính như sau:
- trước `start_date`: 0
- từ `end_date` trở đi: 1
- ở giữa: (`today` − `start_date`) / (`end_date` − `start_date`) tính theo ngày
- `start_date == end_date` thì là 1 nếu `today >= start_date`, ngược lại là 0

ROI trả kèm `roi_basis` là `"eac"` hoặc `"bac"`, để giao diện ghi rõ ROI được tính trên chi phí dự báo hay trên ngân sách gốc (ví dụ dự án chưa ghi chi phí nào).

Phân loại sức khỏe dự án (`health`), lấy mức kém nhất giữa CPI và SPI:
- `on_track`: chỉ số đó `>= 0.95`
- `at_risk`: từ `0.85` đến dưới `0.95`
- `off_track`: dưới `0.85`
- `unknown`: cả CPI và SPI đều null

Nếu chỉ một trong hai có giá trị thì phân loại theo chỉ số đó.

Tổng hợp cấp portfolio:
- Chỉ gộp các dự án có `currency` trùng `portfolio.currency` và có BAC.
- BAC, AC, EV, PV được cộng dồn. CPI, SPI, EAC, VAC tính lại từ tổng theo cùng công thức. Không lấy trung bình các tỷ số.
- `expected_benefit` cộng dồn trên các dự án được gộp có giá trị này. ROI portfolio dùng tổng đó với tổng C của chính các dự án đó.
- Dự án khác tiền tệ vẫn có trong danh sách với chỉ số riêng, mang cờ `excluded_from_totals = true` và lý do `currency_mismatch`. Dự án thiếu BAC mang lý do `no_budget`.

Giá trị tiền làm tròn 2 chữ số; tỷ số làm tròn 3 chữ số; ROI trả dạng tỷ lệ (0.25 nghĩa là 25%).

## 6. API

Schema Pydantic đặt trong `backend/app/schemas/investor.py`.

### 6.1 Cổng investor (router mới `backend/app/api/v1/endpoints/investor.py`, prefix `/investor`)

`GET /investor/portfolios`: danh sách portfolio người dùng xem được (admin thấy tất cả portfolio chưa xóa).
- Phân trang `skip`/`limit` theo kiểu `PaginatedResponse` hiện có.
- Mỗi mục gồm: `id`, `name`, `status`, `currency`, `budget` (của portfolio), `project_count`, `total_bac`, `total_ac`, `cpi`, `spi`, `health`, `granted_at` (null nếu xem với tư cách admin hoặc owner).

`GET /investor/portfolios/{id}`: tổng quan một portfolio.
- `portfolio`: `id`, `name`, `description`, `status`, `start_date`, `end_date`, `budget`, `currency`
- `totals`: một `PortfolioMetrics` (BAC, AC, EV, PV, CPI, SPI, EAC, VAC, expected_benefit, roi, roi_basis, health)
- `health_distribution`: số dự án theo `on_track`/`at_risk`/`off_track`/`unknown`
- `risk_distribution`: số dự án theo `risk_level` của `RiskReport` mới nhất, cộng nhóm `none` cho dự án chưa có báo cáo
- `overdue_projects`: số dự án có `end_date < today` và chưa `COMPLETED` hoặc `CANCELLED` (quyết định F6: dự án đã hủy không bị coi là trễ hạn)
- `projects`: danh sách `InvestorProjectRow` gồm `id`, `name`, `status`, `start_date`, `end_date`, `progress`, `currency`, các chỉ số ở mục 5, `health`, `risk_level`, `risk_score`, `overdue_tasks`, `excluded_from_totals`, `exclusion_reason`

`GET /investor/projects/{id}`: một `InvestorProjectRow` kèm `task_counts` (theo trạng thái) và `risk_summary` (trường `summary` của `RiskReport` mới nhất, có thể null).

### 6.2 Quản lý investor của portfolio (thêm vào `backend/app/api/v1/endpoints/portfolios.py`)

| Endpoint | Mô tả |
|---|---|
| `GET /portfolios/{id}/investors` | Danh sách `{user_id, full_name, email, granted_at, granted_by_id}`. |
| `POST /portfolios/{id}/investors` | Body `{ "email": "..." }`. Không tìm thấy user thì 404; user không có role Investor thì 400; đã có quyền thì trả bản ghi cũ (200); tạo mới thì 201. |
| `DELETE /portfolios/{id}/investors/{user_id}` | Thu hồi quyền, 204. Không có bản ghi thì 404. |

Cấp quyền theo email để không phải thêm endpoint tìm kiếm người dùng mới.

### 6.3 Thay đổi schema Project

- `expected_benefit: float | None = Field(default=None, ge=0)` trong `ProjectCreate` và `ProjectUpdate` (`backend/app/schemas/project.py`).
- `expected_benefit` có trong `ProjectSummaryResponse`.
- Ai sửa được `budget` thì sửa được `expected_benefit`, không thêm quy tắc mới.

## 7. Truy vấn

`InvestorService` (`backend/app/services/investor_service.py`) dùng một số câu SQL cố định cho mỗi request, không phụ thuộc số dự án:

1. Lấy portfolio chưa xóa.
2. Kiểm tra quyền: một `EXISTS` trên `portfolio_investors` (bỏ qua nếu admin hoặc owner).
3. Lấy các cột cần thiết của dự án chưa xóa trong portfolio (không `select(Project)` đầy đủ).
4. Đếm task quá hạn theo dự án bằng một câu GROUP BY. Dùng lại `DashboardService._project_task_counts` nếu chữ ký phù hợp; nếu không thì tách hàm đó ra `phase2_common` hoặc một module truy vấn chung, để cả hai service cùng gọi.
5. Lấy `RiskReport` mới nhất cho mỗi dự án bằng một câu: subquery `max(id)` theo `project_id`, join lại. Dùng `id` thay vì `created_at` để không bị trùng khi hai báo cáo có cùng thời điểm.

`GET /investor/portfolios` dùng một câu cho danh sách portfolio xem được (LEFT JOIN `portfolio_investors`) và một câu aggregate cho các dự án của những portfolio trong trang hiện tại.

Ngân sách truy vấn được kiểm thử: overview tối đa 6 câu SQL, và số câu bằng nhau giữa portfolio 1 dự án và portfolio 20 dự án.

## 8. Frontend

- `frontend/src/lib/rbac.ts`: thêm `isInvestorUser(user)`, trả `true` khi có role `Investor`. Thêm `canViewInvestorPortal(user)`, trả `true` khi là investor hoặc admin.
- `frontend/src/components/layout/Navigation.tsx`: thêm nhóm "Investor" có cờ `investorOnly`, hiện khi `canViewInvestorPortal`. Cờ được truyền từ `(dashboard)/layout.tsx` giống cách `isAdmin` đang được truyền vào `MainNav`/`MobileNav`.
- Route `frontend/src/app/(dashboard)/investor/`:
  - `layout.tsx`: chặn theo `canViewInvestorPortal`, chuyển về `/dashboard` nếu không đủ quyền, theo mẫu `admin/layout.tsx`.
  - `page.tsx`: danh sách portfolio dạng thẻ (tên, BAC, AC, CPI, SPI, nhãn health).
  - `portfolios/[id]/page.tsx`: hàng KPI, hai biểu đồ, bảng dự án.
- Feature `frontend/src/features/investor/`:
  - `services/investor.service.ts`, `hooks/useInvestor.ts`, `types/investor.types.ts`
  - Component:
    - `InvestorKpiRow`: BAC, AC, EAC, CPI, SPI, ROI, theo kiểu `StatsRow`.
    - `HealthDonut`: dùng `DonutChart`.
    - `BudgetVsEacChart`: thanh ngang BAC so với EAC theo dự án, dùng Recharts qua `components/charts`.
    - `InvestorProjectTable`: có màu ngưỡng theo `health`. Ô `null` hiện "Chưa đủ dữ liệu" kèm tooltip lý do. Dự án bị loại khỏi tổng hiện nhãn "Khác tiền tệ" hoặc "Chưa có ngân sách".
  - Nhãn ROI ghi rõ cơ sở: "trên chi phí dự báo" hoặc "trên ngân sách".
- Trang chi tiết portfolio hiện có (`frontend/src/app/(dashboard)/portfolios/[id]/page.tsx`): thêm thẻ "Nhà đầu tư" với danh sách, ô nhập email để cấp và nút thu hồi có hộp xác nhận. Thẻ chỉ hiện khi `capabilities.can_update`, cờ này đã phản ánh admin hoặc owner.
- Form tạo và sửa dự án: thêm ô "Lợi ích kỳ vọng" cạnh "Ngân sách".
- Chuỗi giao diện thêm vào `frontend/messages/en.json` và `frontend/messages/vi.json`.
- Định dạng tiền dùng `Intl.NumberFormat` theo `currency` của từng dự án hoặc portfolio.
- Ở màn hình 390px không có thanh cuộn ngang toàn trang: bảng dự án nằm trong khung tự cuộn, hàng KPI xuống dòng.

## 9. Xử lý lỗi

| Tình huống | Phản hồi |
|---|---|
| Không có `portfolio:read` | 403 |
| Portfolio hoặc dự án không tồn tại hay đã xóa mềm | 404 |
| Không có quyền xem portfolio | 403 |
| Dự án không thuộc portfolio nào | 404 (không lộ sự tồn tại) |
| Cấp quyền cho email không tồn tại | 404 |
| Cấp quyền cho user không có role Investor | 400 với thông điệp rõ ràng |
| Không phải admin hay owner mà gọi API quản lý investor | 403 |

Frontend dùng các trạng thái lỗi và skeleton đang có. 403 trên trang investor thì chuyển về danh sách kèm thông báo "Bạn không còn quyền xem portfolio này".

## 10. Kiểm thử

Backend (pytest, `backend/.venv`):
- `tests/unit/test_evm.py`:
  - đủ dữ liệu
  - thiếu ngày
  - `end_date < start_date`
  - AC = 0
  - EV = 0
  - trước ngày bắt đầu, sau ngày kết thúc, `start_date == end_date`
  - vượt ngân sách
  - ROI dùng EAC và ROI dùng BAC
  - phân loại health tại đúng các ngưỡng 0.85 và 0.95
  - tổng hợp portfolio có dự án khác tiền tệ và dự án thiếu ngân sách
- `tests/integration/test_investor_portal.py`:
  - Ma trận quyền: investor được cấp, investor chưa được cấp, investor đã bị thu hồi, owner, admin, PM không liên quan, user không có `portfolio:read`. Kiểm tra trên cả ba endpoint `/investor`.
  - Investor nhận 403 khi gọi `PATCH /portfolios/{id}`, `PATCH /projects/{id}`, tạo task.
  - Cấp quyền: thành công, idempotent, sai role trả 400, email không tồn tại trả 404, người không phải owner trả 403.
  - Thu hồi có hiệu lực ngay ở request kế tiếp.
  - Có ghi audit log.
  - Đếm số câu SQL (event `before_cursor_execute`): overview tối đa 6 câu và không đổi giữa 1 và 20 dự án.
- Migration upgrade, downgrade, upgrade trên PostgreSQL 16 cục bộ.
- Toàn bộ test hiện có vẫn đạt (baseline 400 passed / 21 skipped trên SQLite).

Frontend (vitest):
- `rbac.test.ts` cho `isInvestorUser` và `canViewInvestorPortal`.
- Layout investor chuyển hướng khi không đủ quyền.
- `InvestorKpiRow` và `InvestorProjectTable` hiển thị đúng ô `null`, nhãn loại trừ và cơ sở ROI.
- Type-check, lint và production build đạt.

Trình duyệt (docker compose cục bộ):
- Tài khoản investor chỉ thấy portfolio được cấp; sau khi thu hồi thì bị chặn.
- Owner cấp và thu hồi được từ trang portfolio.
- Kiểm tra cả EN và VI, màn hình 390px không tràn ngang.

## 11. Tài liệu cập nhật khi xong

- `docs/roadmap/PHASE_5_DOCUMENT_AI_POLISH_MODULE.md`: giai đoạn 5.3 chuyển sang hoàn thành, cập nhật tỷ lệ.
- `README.md`, `tasks/progress.md`, `docs/specs/system-architecture/srs.md`: cập nhật theo trạng thái thật.
- Chạy `graphify update .` sau khi sửa mã.
