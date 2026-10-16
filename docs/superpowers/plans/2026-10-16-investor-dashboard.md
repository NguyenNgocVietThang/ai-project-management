# Investor Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cho người dùng role `Investor` một cổng chỉ đọc xem EVM, ROI kỳ vọng và rủi ro của các portfolio họ được cấp quyền, kèm màn hình để chủ portfolio cấp/thu hồi quyền.

**Architecture:** Hàm EVM thuần (`app/services/evm.py`) tách khỏi DB. `InvestorService` đọc số liệu bằng một số câu SQL cố định rồi đưa qua các hàm EVM. Quyền xem lưu trong bảng `portfolio_investors` và được đọc thẳng từ DB ở mỗi request. Frontend thêm route `/investor` có chặn theo role, cùng một thẻ quản lý investor trên trang portfolio sẵn có.

**Tech Stack:** FastAPI, SQLAlchemy 2 async, Alembic, Pydantic v2, pytest + httpx (SQLite in-memory); Next.js App Router, TanStack Query, next-intl, Recharts, Vitest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-10-16-investor-dashboard-design.md`

## Global Constraints

- Chú thích mã nguồn viết bằng tiếng Việt. Tệp `.md` không dùng emoji.
- Commit dưới tên tác giả theo git config (NguyenNgocVietThang). KHÔNG thêm dòng `Co-Authored-By`.
- Không push, không deploy.
- Chạy backend test bằng `backend/.venv`: từ thư mục `backend/`, chạy `.venv/Scripts/python -m pytest`. Baseline hiện tại: 400 passed / 21 skipped (SQLite).
- Frontend: từ thư mục `frontend/`, chạy `npx vitest run <file>`, `npm run type-check`, `npm run lint`, `npm run build` (các script này có sẵn trong `frontend/package.json`).
- Migration mới: `revision = "20261016_investor_portal"`, `down_revision = "20261013_process_models"`.
- Bảng mới trên PostgreSQL phải bật RLS và REVOKE quyền của `PUBLIC`/`anon`/`authenticated`/`service_role`, giống `alembic/versions/20261013_process_models.py`.
- Ngưỡng health: `on_track` khi `>= 0.95`, `at_risk` khi từ `0.85` đến dưới `0.95`, `off_track` khi dưới `0.85`, `unknown` khi không có chỉ số.
- Làm tròn: tiền 2 chữ số, tỷ số và ROI 3 chữ số. ROI là tỷ lệ: 0.25 nghĩa là 25%.
- Overview portfolio dùng tối đa 6 câu SQL, và số câu không phụ thuộc số dự án.
- Sau khi sửa mã: chạy `graphify update .` từ thư mục gốc repo.

### Chỗ plan làm rõ thêm cho spec

Ghi lại để reviewer không coi là sai lệch:

1. Phân trang `/investor/portfolios` dùng `page`/`page_size` giống `GET /portfolios` hiện có, không dùng `skip`/`limit`.
2. Chỉ số trong response được lồng dưới khóa `metrics` (dự án) và `totals` (portfolio), dùng chung schema `MetricsResponse`.
3. SPI của portfolio chỉ tính trên các dự án có PV: ΣEV(dự án có PV) / ΣPV. Làm vậy để dự án thiếu ngày không thổi phồng tử số.
4. `roi_basis` của portfolio là `"mixed"` khi các dự án dùng cơ sở khác nhau.
5. Action audit viết hoa (`GRANT_INVESTOR`, `REVOKE_INVESTOR`), giống `CREATE`/`UPDATE` hiện có.

---

## File Structure

Backend:
- Create `backend/app/services/evm.py`: hàm thuần tính EVM/ROI/health.
- Create `backend/app/models/portfolio_investor.py`: model `PortfolioInvestor`.
- Modify `backend/app/models/project.py`: thêm cột `expected_benefit` và CHECK.
- Modify `backend/app/db/base.py`: import model mới.
- Create `backend/alembic/versions/20261016_investor_portal.py`.
- Modify `backend/app/schemas/project.py`, `backend/app/services/project_service.py`: thêm `expected_benefit`.
- Create `backend/app/schemas/investor.py`.
- Create `backend/app/services/investor_service.py`: đọc dữ liệu cổng investor và quản lý quyền.
- Modify `backend/app/services/dashboard_service.py`: tách `_project_task_counts` thành hàm cấp module `project_task_counts`.
- Create `backend/app/api/v1/endpoints/investor.py`. Modify `backend/app/api/v1/endpoints/portfolios.py`, `backend/app/api/v1/router.py`.
- Tests:
  - `backend/tests/unit/test_evm.py`
  - `backend/tests/integration/test_project_expected_benefit.py`
  - `backend/tests/integration/test_portfolio_investor_grants.py`
  - `backend/tests/integration/test_investor_portal.py`

Frontend:
- Create `frontend/src/features/investor/types/investor.types.ts`, `services/investor.service.ts`, `hooks/useInvestor.ts`.
- Create component trong `frontend/src/features/investor/components/`:
  - `metricFormat.ts`
  - `InvestorKpiRow.tsx`
  - `HealthDonut.tsx`
  - `BudgetVsEacChart.tsx`
  - `InvestorProjectTable.tsx`
  - `PortfolioInvestorsCard.tsx`
- Create `frontend/src/app/(dashboard)/investor/layout.tsx`, `page.tsx`, `portfolios/[id]/page.tsx`.
- Modify:
  - `frontend/src/lib/rbac.ts`
  - `frontend/src/components/layout/Navigation.tsx`
  - `frontend/src/app/(dashboard)/layout.tsx`
  - `frontend/src/app/(dashboard)/portfolios/[id]/page.tsx`
  - `frontend/src/features/projects/project.validation.ts`
  - `frontend/src/features/projects/components/ProjectForm.tsx`
  - `frontend/src/features/projects/components/ProjectWizard.tsx`
  - `frontend/src/types/project.types.ts`
  - `frontend/messages/en.json`, `frontend/messages/vi.json`
- Tests:
  - `frontend/src/lib/rbac.test.ts`
  - `frontend/src/app/(dashboard)/investor/layout.test.tsx`
  - `frontend/src/features/investor/components/InvestorProjectTable.test.tsx`
  - `frontend/src/features/investor/components/InvestorKpiRow.test.tsx`
  - `frontend/src/features/investor/components/PortfolioInvestorsCard.test.tsx`

---

### Task 1: Hàm EVM thuần

**Files:**
- Create: `backend/app/services/evm.py`
- Test: `backend/tests/unit/test_evm.py`

**Interfaces:**
- Produces:
  - `Metrics` (dataclass frozen) với các trường `bac, ac, ev, pv, cpi, spi, eac, vac, expected_benefit, roi: float | None` (riêng `ac: float`), `roi_basis: str | None` (`"eac"`/`"bac"`/`"mixed"`/None), `health: str`.
  - `compute_project_metrics(*, budget, actual_cost, progress, start_date, end_date, expected_benefit, today) -> Metrics`
  - `aggregate_metrics(items: list[Metrics]) -> Metrics`
  - `elapsed_fraction(start, end, today) -> float | None`
  - `classify_health(cpi, spi) -> str`
  - `HEALTH_KEYS = ("on_track", "at_risk", "off_track", "unknown")`

- [ ] **Step 1: Viết test lỗi**

Tạo `backend/tests/unit/test_evm.py`:

```python
"""Kiểm thử hàm EVM thuần: công thức, trường hợp thiếu dữ liệu và ngưỡng health."""
from datetime import date

import pytest

from app.services.evm import (
    aggregate_metrics,
    classify_health,
    compute_project_metrics,
    elapsed_fraction,
)

TODAY = date(2026, 6, 1)
# 20 ngày, hôm nay ở giữa: tỷ lệ thời gian đã trôi = 0.5
START = date(2026, 5, 22)
END = date(2026, 6, 11)


def metrics(**overrides):
    values = dict(
        budget=1000.0,
        actual_cost=400.0,
        progress=50.0,
        start_date=START,
        end_date=END,
        expected_benefit=None,
        today=TODAY,
    )
    values.update(overrides)
    return compute_project_metrics(**values)


def test_du_an_du_du_lieu():
    m = metrics()
    assert (m.bac, m.ac, m.ev, m.pv) == (1000.0, 400.0, 500.0, 500.0)
    assert m.cpi == 1.25
    assert m.spi == 1.0
    assert m.eac == 800.0
    assert m.vac == 200.0
    assert m.health == "on_track"


def test_thieu_ngay_thi_khong_co_pv_va_spi():
    m = metrics(start_date=None)
    assert m.pv is None and m.spi is None
    assert m.cpi == 1.25
    assert m.health == "on_track"


def test_ngay_ket_thuc_truoc_ngay_bat_dau_thi_khong_co_pv():
    m = metrics(start_date=END, end_date=START)
    assert m.pv is None


def test_chua_ghi_chi_phi_thi_khong_co_cpi_eac_vac():
    m = metrics(actual_cost=0.0)
    assert m.cpi is None and m.eac is None and m.vac is None
    assert m.spi == 1.0
    assert m.health == "on_track"


def test_ev_bang_khong_thi_cpi_bang_khong_va_khong_co_eac():
    m = metrics(progress=0.0)
    assert m.cpi == 0.0
    assert m.eac is None
    assert m.health == "off_track"


def test_tien_do_vuot_100_bi_kep():
    assert metrics(progress=140.0).ev == 1000.0


def test_ty_le_thoi_gian():
    assert elapsed_fraction(START, END, date(2026, 5, 1)) == 0.0
    assert elapsed_fraction(START, END, date(2026, 7, 1)) == 1.0
    assert elapsed_fraction(START, END, TODAY) == 0.5
    assert elapsed_fraction(TODAY, TODAY, TODAY) == 1.0
    assert elapsed_fraction(TODAY, TODAY, date(2026, 5, 31)) == 0.0
    assert elapsed_fraction(None, END, TODAY) is None


def test_vuot_ngan_sach():
    m = metrics(actual_cost=800.0)
    assert m.cpi == 0.625
    assert m.eac == 1600.0
    assert m.vac == -600.0
    assert m.health == "off_track"


def test_roi_tinh_tren_eac():
    m = metrics(expected_benefit=1200.0)
    assert m.roi == 0.5
    assert m.roi_basis == "eac"


def test_roi_tinh_tren_bac_khi_chua_co_eac():
    m = metrics(actual_cost=0.0, expected_benefit=1500.0)
    assert m.roi == 0.5
    assert m.roi_basis == "bac"


def test_khong_co_ngan_sach():
    m = metrics(budget=None, expected_benefit=1500.0)
    assert m.bac is None and m.ev is None and m.pv is None
    assert m.roi is None and m.roi_basis is None
    assert m.health == "unknown"
    assert metrics(budget=0.0).bac is None


@pytest.mark.parametrize(
    ("cpi", "spi", "expected"),
    [
        (0.95, None, "on_track"),
        (0.9499, None, "at_risk"),
        (0.85, None, "at_risk"),
        (0.8499, None, "off_track"),
        (None, None, "unknown"),
        (1.2, 0.8, "off_track"),
        (None, 0.9, "at_risk"),
    ],
)
def test_nguong_health(cpi, spi, expected):
    assert classify_health(cpi, spi) == expected


def test_tong_hop_tinh_lai_ty_so_tu_tong():
    a = metrics()
    b = metrics(budget=3000.0, actual_cost=3000.0)
    total = aggregate_metrics([a, b])
    assert (total.bac, total.ac, total.ev, total.pv) == (4000.0, 3400.0, 2000.0, 2000.0)
    assert total.cpi == 0.588
    assert total.spi == 1.0
    assert total.eac == 6800.0
    assert total.vac == -2800.0
    assert total.health == "off_track"


def test_tong_hop_spi_chi_tinh_du_an_co_pv():
    a = metrics()
    no_dates = metrics(start_date=None, progress=100.0, actual_cost=1000.0)
    total = aggregate_metrics([a, no_dates])
    assert total.ev == 1500.0
    assert total.spi == 1.0


def test_tong_hop_roi_co_so_hon_hop():
    a = metrics(expected_benefit=1200.0)
    b = metrics(actual_cost=0.0, expected_benefit=1500.0)
    total = aggregate_metrics([a, b])
    assert total.expected_benefit == 2700.0
    assert total.roi == 0.5
    assert total.roi_basis == "mixed"


def test_tong_hop_rong():
    total = aggregate_metrics([])
    assert total.bac is None and total.ac == 0.0
    assert total.health == "unknown"
```

- [ ] **Step 2: Chạy test để thấy lỗi**

Run (từ `backend/`): `.venv/Scripts/python -m pytest tests/unit/test_evm.py -q`
Expected: FAIL với `ModuleNotFoundError: No module named 'app.services.evm'`

- [ ] **Step 3: Viết code**

Tạo `backend/app/services/evm.py`:

```python
"""Chỉ số Earned Value Management (EVM) và ROI kỳ vọng.

Hàm thuần, không truy cập DB: nhận số liệu của dự án và trả về chỉ số. Chỉ số nào
thiếu dữ liệu thì là None, thay vì chia cho 0 hoặc trả một con số vô nghĩa.
Công thức và ngưỡng: docs/superpowers/specs/2026-10-16-investor-dashboard-design.md §5.
"""
from dataclasses import dataclass
from datetime import date

HEALTH_ON_TRACK = 0.95
HEALTH_AT_RISK = 0.85
HEALTH_KEYS: tuple[str, ...] = ("on_track", "at_risk", "off_track", "unknown")


@dataclass(frozen=True)
class Metrics:
    bac: float | None
    ac: float
    ev: float | None
    pv: float | None
    cpi: float | None
    spi: float | None
    eac: float | None
    vac: float | None
    expected_benefit: float | None
    roi: float | None
    # "eac" | "bac" | "mixed" (chỉ ở cấp portfolio) | None
    roi_basis: str | None
    health: str


def _ratio(numerator: float | None, denominator: float | None) -> float | None:
    if numerator is None or denominator is None or denominator == 0:
        return None
    return numerator / denominator


def _money(value: float | None) -> float | None:
    return None if value is None else round(value, 2)


def _rate(value: float | None) -> float | None:
    return None if value is None else round(value, 3)


def elapsed_fraction(start: date | None, end: date | None, today: date) -> float | None:
    """Tỷ lệ thời gian kế hoạch đã trôi qua, kẹp trong [0, 1]."""
    if start is None or end is None or end < start:
        return None
    if today < start:
        return 0.0
    if today >= end:
        return 1.0
    return (today - start).days / (end - start).days


def classify_health(cpi: float | None, spi: float | None) -> str:
    """Lấy chỉ số kém nhất trong hai; chỉ có một thì xét theo chỉ số đó."""
    values = [value for value in (cpi, spi) if value is not None]
    if not values:
        return "unknown"
    worst = min(values)
    if worst >= HEALTH_ON_TRACK:
        return "on_track"
    if worst >= HEALTH_AT_RISK:
        return "at_risk"
    return "off_track"


def _build(
    *,
    bac: float | None,
    ac: float,
    ev: float | None,
    pv: float | None,
    cpi: float | None,
    spi: float | None,
    expected_benefit: float | None,
    roi: float | None,
    roi_basis: str | None,
) -> Metrics:
    eac = _ratio(bac, cpi)
    vac = None if eac is None or bac is None else bac - eac
    return Metrics(
        bac=_money(bac),
        ac=round(ac, 2),
        ev=_money(ev),
        pv=_money(pv),
        cpi=_rate(cpi),
        spi=_rate(spi),
        eac=_money(eac),
        vac=_money(vac),
        expected_benefit=_money(expected_benefit),
        roi=_rate(roi),
        roi_basis=roi_basis,
        # Phân loại trên giá trị chưa làm tròn để ngưỡng được so chính xác.
        health=classify_health(cpi, spi),
    )


def compute_project_metrics(
    *,
    budget: float | None,
    actual_cost: float | None,
    progress: float | None,
    start_date: date | None,
    end_date: date | None,
    expected_benefit: float | None,
    today: date,
) -> Metrics:
    bac = budget if budget is not None and budget > 0 else None
    ac = float(actual_cost or 0.0)
    ev = None if bac is None else bac * min(max(progress or 0.0, 0.0), 100.0) / 100
    fraction = elapsed_fraction(start_date, end_date, today)
    pv = None if bac is None or fraction is None else bac * fraction
    cpi = _ratio(ev, ac)
    spi = _ratio(ev, pv)
    eac = _ratio(bac, cpi)

    roi: float | None = None
    roi_basis: str | None = None
    if expected_benefit is not None:
        # Ưu tiên chi phí dự báo; chưa có (chưa ghi chi phí) thì dùng ngân sách gốc.
        if eac:
            roi, roi_basis = _ratio(expected_benefit - eac, eac), "eac"
        elif bac:
            roi, roi_basis = _ratio(expected_benefit - bac, bac), "bac"

    return _build(
        bac=bac, ac=ac, ev=ev, pv=pv, cpi=cpi, spi=spi,
        expected_benefit=expected_benefit, roi=roi, roi_basis=roi_basis,
    )


def aggregate_metrics(items: list[Metrics]) -> Metrics:
    """Cộng dồn BAC/AC/EV/PV rồi tính lại tỷ số từ tổng, không lấy trung bình tỷ số.

    Bên gọi chịu trách nhiệm lọc dự án khác tiền tệ trước khi truyền vào.
    """
    included = [item for item in items if item.bac is not None]
    if not included:
        return _build(
            bac=None, ac=0.0, ev=None, pv=None, cpi=None, spi=None,
            expected_benefit=None, roi=None, roi_basis=None,
        )
    bac = sum(item.bac for item in included)
    ac = sum(item.ac for item in included)
    ev = sum(item.ev for item in included)
    with_pv = [item for item in included if item.pv is not None]
    pv = sum(item.pv for item in with_pv) if with_pv else None
    # SPI chỉ so trên các dự án có PV, để dự án thiếu ngày không thổi phồng tử số.
    spi = _ratio(sum(item.ev for item in with_pv), pv) if with_pv else None
    cpi = _ratio(ev, ac)

    expected_benefit: float | None = None
    roi: float | None = None
    roi_basis: str | None = None
    with_roi = [item for item in included if item.roi_basis is not None]
    if with_roi:
        expected_benefit = sum(item.expected_benefit for item in with_roi)
        cost = sum(item.eac if item.roi_basis == "eac" else item.bac for item in with_roi)
        roi = _ratio(expected_benefit - cost, cost)
        bases = {item.roi_basis for item in with_roi}
        roi_basis = bases.pop() if len(bases) == 1 else "mixed"

    return _build(
        bac=bac, ac=ac, ev=ev, pv=pv, cpi=cpi, spi=spi,
        expected_benefit=expected_benefit, roi=roi, roi_basis=roi_basis,
    )
```

- [ ] **Step 4: Chạy test để thấy đạt**

Run: `.venv/Scripts/python -m pytest tests/unit/test_evm.py -q`
Expected: tất cả PASS.

- [ ] **Step 5: Commit**

```bash
git add backend/app/services/evm.py backend/tests/unit/test_evm.py
git commit -m "feat(investor): them ham EVM/ROI thuan va kiem thu nguong"
```

---

### Task 2: Mô hình dữ liệu, migration và trường `expected_benefit`

**Files:**
- Create: `backend/app/models/portfolio_investor.py`, `backend/alembic/versions/20261016_investor_portal.py`
- Modify: `backend/app/models/project.py:37-70`, `backend/app/db/base.py`, `backend/app/schemas/project.py`, `backend/app/services/project_service.py:65-93,170-185`
- Test: `backend/tests/integration/test_project_expected_benefit.py`

**Interfaces:**
- Produces:
  - `PortfolioInvestor` (model): `portfolio_id: int`, `user_id: int`, `granted_by_id: int | None`, cùng `id`/`created_at`/`updated_at` của `Base`.
  - `Project.expected_benefit: float | None`.
  - `ProjectCreate.expected_benefit`, `ProjectUpdate.expected_benefit`, `ProjectSummaryResponse.expected_benefit` (`float | None`, `ge=0`).

- [ ] **Step 1: Viết test lỗi**

Tạo `backend/tests/integration/test_project_expected_benefit.py`:

```python
"""Lợi ích kỳ vọng của dự án: lưu được, trả về được, không nhận số âm."""
from datetime import date

import pytest
from sqlalchemy import insert

from app.models.associations import project_members
from app.models.project import Project


@pytest.fixture
async def pm_project(session, make_user, seed_roles):
    pm = await make_user(roles=[seed_roles["PM"]])
    project = Project(
        name="Alpha", pm_id=pm.id, start_date=date(2026, 1, 1), end_date=date(2026, 12, 31)
    )
    session.add(project)
    await session.flush()
    await session.execute(
        insert(project_members).values(
            project_id=project.id, user_id=pm.id, role_id=seed_roles["PM"].id
        )
    )
    return pm, project


@pytest.mark.asyncio
async def test_pm_cap_nhat_va_doc_lai_loi_ich_ky_vong(as_user, pm_project):
    pm, project = pm_project
    async with as_user(pm) as client:
        response = await client.patch(
            f"/api/v1/projects/{project.id}", json={"expected_benefit": 5000}
        )
    assert response.status_code == 200, response.text
    assert response.json()["expected_benefit"] == 5000


@pytest.mark.asyncio
async def test_loi_ich_ky_vong_am_bi_tu_choi(as_user, pm_project):
    pm, project = pm_project
    async with as_user(pm) as client:
        response = await client.patch(
            f"/api/v1/projects/{project.id}", json={"expected_benefit": -1}
        )
    assert response.status_code == 422
```

- [ ] **Step 2: Chạy test để thấy lỗi**

Run: `.venv/Scripts/python -m pytest tests/integration/test_project_expected_benefit.py -q`
Expected: FAIL. Test thứ nhất báo `KeyError: 'expected_benefit'`. Test thứ hai trả 200 thay vì 422, vì trường lạ bị bỏ qua.

- [ ] **Step 3: Thêm model và cột**

Tạo `backend/app/models/portfolio_investor.py`:

```python
"""Quyền xem chỉ đọc của nhà đầu tư trên một portfolio.

Một dòng nghĩa là user (role Investor) được xem số liệu tổng hợp của portfolio đó
qua /investor. `created_at` của Base chính là thời điểm cấp quyền.
"""
from sqlalchemy import ForeignKey, Index, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class PortfolioInvestor(Base):
    __tablename__ = "portfolio_investors"
    __table_args__ = (
        UniqueConstraint("portfolio_id", "user_id", name="uq_portfolio_investors_portfolio_user"),
        Index("ix_portfolio_investors_user", "user_id"),
    )

    portfolio_id: Mapped[int] = mapped_column(
        ForeignKey("portfolios.id", ondelete="CASCADE"), nullable=False
    )
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    # Người cấp quyền; tài khoản đó bị xóa thì quyền vẫn giữ.
    granted_by_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )

    def __repr__(self) -> str:
        return f"<PortfolioInvestor portfolio={self.portfolio_id} user={self.user_id}>"
```

Trong `backend/app/models/project.py`:
- Thêm `CheckConstraint` vào dòng import từ `sqlalchemy`.
- Thêm vào cuối tuple `__table_args__`:

```python
        CheckConstraint(
            "expected_benefit IS NULL OR expected_benefit >= 0",
            name="ck_projects_expected_benefit_nonneg",
        ),
```

- Thêm ngay sau dòng `currency`:

```python
    # Tổng lợi ích kỳ vọng, cùng tiền tệ với `currency`; dùng để tính ROI cho Investor.
    expected_benefit: Mapped[float | None] = mapped_column(Float, nullable=True)
```

Trong `backend/app/db/base.py`, thêm cạnh dòng import `Portfolio`:

```python
from app.models.portfolio_investor import PortfolioInvestor  # noqa: F401
```

- [ ] **Step 4: Thêm schema và service**

Trong `backend/app/schemas/project.py`:
- `ProjectCreate` và `ProjectUpdate`: thêm ngay sau `budget` dòng `expected_benefit: float | None = Field(default=None, ge=0)`.
- `ProjectSummaryResponse`: thêm `expected_benefit: float | None = None` ngay sau `budget_spent`.

Trong `backend/app/services/project_service.py`:
- Hàm `_summary` (khoảng dòng 73): thêm `expected_benefit=project.expected_benefit,` ngay sau `budget_spent=project.actual_cost,`.
- Hàm `create` (khoảng dòng 181): thêm `expected_benefit=data.expected_benefit,` ngay sau `budget=data.budget,`.
- Hàm `update` không cần sửa: nó áp `data.model_dump(exclude_unset=True)` qua `repo.update`.

- [ ] **Step 5: Chạy test để thấy đạt**

Run: `.venv/Scripts/python -m pytest tests/integration/test_project_expected_benefit.py -q`
Expected: 2 PASS.

- [ ] **Step 6: Viết migration**

Tạo `backend/alembic/versions/20261016_investor_portal.py`:

```python
"""Cổng nhà đầu tư: bảng portfolio_investors và cột projects.expected_benefit.

Revision ID: 20261016_investor_portal
Revises: 20261013_process_models
"""

import sqlalchemy as sa

from alembic import op

revision = "20261016_investor_portal"
down_revision = "20261013_process_models"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "portfolio_investors",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("portfolio_id", sa.Integer(), sa.ForeignKey("portfolios.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("granted_by_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL")),
        sa.UniqueConstraint("portfolio_id", "user_id", name="uq_portfolio_investors_portfolio_user"),
    )
    op.create_index("ix_portfolio_investors_id", "portfolio_investors", ["id"])
    op.create_index("ix_portfolio_investors_user", "portfolio_investors", ["user_id"])
    op.add_column("projects", sa.Column("expected_benefit", sa.Float(), nullable=True))
    op.create_check_constraint(
        "ck_projects_expected_benefit_nonneg",
        "projects",
        "expected_benefit IS NULL OR expected_benefit >= 0",
    )
    if op.get_bind().dialect.name == "postgresql":
        # Quyền truy cập là dữ liệu nhạy cảm; schema public của Supabase mở qua Data API
        # nên chỉ chủ bảng (backend) được đọc/ghi.
        op.execute("ALTER TABLE portfolio_investors ENABLE ROW LEVEL SECURITY")
        op.execute("REVOKE ALL ON TABLE portfolio_investors FROM PUBLIC")
        op.execute("REVOKE ALL ON SEQUENCE portfolio_investors_id_seq FROM PUBLIC")
        op.execute(
            """
            DO $$
            DECLARE api_role TEXT;
            BEGIN
                FOREACH api_role IN ARRAY ARRAY['anon', 'authenticated', 'service_role'] LOOP
                    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = api_role) THEN
                        EXECUTE format('REVOKE ALL ON TABLE portfolio_investors FROM %I', api_role);
                        EXECUTE format('REVOKE ALL ON SEQUENCE portfolio_investors_id_seq FROM %I', api_role);
                    END IF;
                END LOOP;
            END $$;
        """
        )


def downgrade() -> None:
    op.drop_constraint("ck_projects_expected_benefit_nonneg", "projects", type_="check")
    op.drop_column("projects", "expected_benefit")
    op.drop_table("portfolio_investors")
```

- [ ] **Step 7: Kiểm migration trên PostgreSQL 16 cục bộ**

Dùng DB tạm như các lần kiểm thử trước (xem `tasks/progress.md`, mục PostgreSQL 16 cục bộ). Đặt `DATABASE_URL` trỏ tới DB tạm, rồi chạy từ `backend/`:

```bash
.venv/Scripts/python -m alembic upgrade head
.venv/Scripts/python -m alembic downgrade 20261013_process_models
.venv/Scripts/python -m alembic upgrade head
```

Expected: cả ba lệnh không lỗi; `\d portfolio_investors` có unique constraint và RLS bật.

Nếu không có PostgreSQL cục bộ, ghi lại là chưa kiểm và báo người dùng. KHÔNG bỏ qua mà không ghi.

- [ ] **Step 8: Chạy toàn bộ backend test**

Run: `.venv/Scripts/python -m pytest -q`
Expected: 400 + số test mới passed, 21 skipped, không có failure.

- [ ] **Step 9: Commit**

```bash
git add backend/app/models/portfolio_investor.py backend/app/models/project.py backend/app/db/base.py backend/alembic/versions/20261016_investor_portal.py backend/app/schemas/project.py backend/app/services/project_service.py backend/tests/integration/test_project_expected_benefit.py
git commit -m "feat(investor): bang portfolio_investors va truong expected_benefit cho du an"
```

---

### Task 3: Cấp và thu hồi quyền investor

**Files:**
- Create: `backend/app/schemas/investor.py` (phần grant), `backend/app/services/investor_service.py` (phần grant)
- Modify: `backend/app/api/v1/endpoints/portfolios.py`
- Test: `backend/tests/integration/test_portfolio_investor_grants.py`

**Interfaces:**
- Consumes: `PortfolioInvestor` (Task 2).
- Produces:
  - `InvestorGrantCreate(email: EmailStr)`
  - `InvestorGrantResponse(user_id: int, full_name: str, email: str, granted_at: datetime, granted_by_id: int | None)`
  - `InvestorService(db)` với `list_grants(portfolio_id, actor) -> list[InvestorGrantResponse]`, `grant(portfolio_id, email, actor) -> tuple[InvestorGrantResponse, bool]` (bool là `created`), `revoke(portfolio_id, user_id, actor) -> None`
  - `InvestorServiceDep`
  - Fixture test `investor_setup` (dùng lại ở Task 4, được định nghĩa lại trong tệp test của Task 4).

- [ ] **Step 1: Viết test lỗi**

Tạo `backend/tests/integration/test_portfolio_investor_grants.py`:

```python
"""Cấp/thu hồi quyền investor trên portfolio: chỉ admin hoặc chủ portfolio."""
import pytest
from sqlalchemy import select

from app.models.audit_log import AuditLog
from app.models.permission import Permission
from app.models.portfolio import Portfolio
from app.models.portfolio_investor import PortfolioInvestor
from app.models.role import Role


@pytest.fixture
async def grant_setup(session, make_user, seed_roles):
    read = Permission(resource="portfolio", action="read")
    investor_role = Role(name="Investor", description="Investor role")
    investor_role.permissions = [read]
    session.add_all([read, investor_role])
    await session.flush()

    owner = await make_user(roles=[seed_roles["PM"]])
    stranger = await make_user(roles=[seed_roles["PM"]])
    admin = await make_user(roles=[seed_roles["Admin"]])
    investor = await make_user(email="inv@example.com", roles=[investor_role])
    member = await make_user(email="member@example.com", roles=[seed_roles["Member"]])
    portfolio = Portfolio(name="Growth", owner_id=owner.id, currency="VND")
    session.add(portfolio)
    await session.flush()
    return {
        "owner": owner, "stranger": stranger, "admin": admin,
        "investor": investor, "member": member, "portfolio": portfolio,
    }


def url(setup):
    return f"/api/v1/portfolios/{setup['portfolio'].id}/investors"


@pytest.mark.asyncio
async def test_chu_portfolio_cap_quyen_thanh_cong_va_co_audit(as_user, session, grant_setup):
    async with as_user(grant_setup["owner"]) as client:
        response = await client.post(url(grant_setup), json={"email": "INV@example.com"})
    assert response.status_code == 201, response.text
    body = response.json()
    assert body["user_id"] == grant_setup["investor"].id
    assert body["granted_by_id"] == grant_setup["owner"].id
    audit = await session.scalar(select(AuditLog).where(AuditLog.action == "GRANT_INVESTOR"))
    assert audit is not None and audit.entity_id == grant_setup["portfolio"].id


@pytest.mark.asyncio
async def test_cap_quyen_lap_lai_la_idempotent(as_user, session, grant_setup):
    async with as_user(grant_setup["owner"]) as client:
        first = await client.post(url(grant_setup), json={"email": "inv@example.com"})
        second = await client.post(url(grant_setup), json={"email": "inv@example.com"})
    assert first.status_code == 201
    assert second.status_code == 200
    rows = (await session.scalars(select(PortfolioInvestor))).all()
    assert len(rows) == 1


@pytest.mark.asyncio
async def test_user_khong_co_role_investor_bi_tu_choi(as_user, grant_setup):
    async with as_user(grant_setup["owner"]) as client:
        response = await client.post(url(grant_setup), json={"email": "member@example.com"})
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_email_khong_ton_tai_tra_404(as_user, grant_setup):
    async with as_user(grant_setup["owner"]) as client:
        response = await client.post(url(grant_setup), json={"email": "nobody@example.com"})
    assert response.status_code == 404


@pytest.mark.asyncio
@pytest.mark.parametrize("who", ["stranger", "investor"])
async def test_nguoi_khong_phai_chu_khong_quan_ly_duoc(as_user, grant_setup, who):
    async with as_user(grant_setup[who]) as client:
        listing = await client.get(url(grant_setup))
        granting = await client.post(url(grant_setup), json={"email": "inv@example.com"})
    assert listing.status_code == 403
    assert granting.status_code == 403


@pytest.mark.asyncio
async def test_admin_liet_ke_va_thu_hoi(as_user, session, grant_setup):
    async with as_user(grant_setup["owner"]) as client:
        await client.post(url(grant_setup), json={"email": "inv@example.com"})
    async with as_user(grant_setup["admin"]) as client:
        listing = await client.get(url(grant_setup))
        revoke = await client.delete(f"{url(grant_setup)}/{grant_setup['investor'].id}")
        again = await client.delete(f"{url(grant_setup)}/{grant_setup['investor'].id}")
    assert listing.status_code == 200
    assert [item["email"] for item in listing.json()] == ["inv@example.com"]
    assert revoke.status_code == 204
    assert again.status_code == 404
    audit = await session.scalar(select(AuditLog).where(AuditLog.action == "REVOKE_INVESTOR"))
    assert audit is not None
```

- [ ] **Step 2: Chạy test để thấy lỗi**

Run: `.venv/Scripts/python -m pytest tests/integration/test_portfolio_investor_grants.py -q`
Expected: FAIL với 404/405 (route chưa có).

- [ ] **Step 3: Viết schema phần grant**

Tạo `backend/app/schemas/investor.py`:

```python
"""Schema cổng nhà đầu tư (Phase 5, 5.3)."""
from datetime import datetime

from pydantic import BaseModel, EmailStr


class InvestorGrantCreate(BaseModel):
    email: EmailStr


class InvestorGrantResponse(BaseModel):
    user_id: int
    full_name: str
    email: str
    granted_at: datetime
    granted_by_id: int | None
```

(`EmailStr` đã được dùng trong `backend/app/schemas/admin.py`, nên `email-validator` có sẵn.)

- [ ] **Step 4: Viết service phần grant**

Tạo `backend/app/services/investor_service.py`:

```python
"""Cổng nhà đầu tư: quản lý quyền xem portfolio và đọc số liệu tổng hợp chỉ đọc.

Quyền luôn đọc thẳng từ DB ở mỗi request (không cache), nên thu hồi có hiệu lực
ngay ở request kế tiếp.
"""
from typing import Annotated

from fastapi import Depends
from sqlalchemy import exists, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import BadRequestException, ForbiddenException, NotFoundException
from app.db.session import get_db
from app.models.audit_log import AuditLog
from app.models.portfolio import Portfolio
from app.models.portfolio_investor import PortfolioInvestor
from app.models.user import User
from app.schemas.investor import InvestorGrantResponse
from app.services.phase2_common import is_admin

INVESTOR_ROLE = "Investor"


class InvestorService:
    def __init__(self, db: AsyncSession):
        self.db = db

    # ── Tra cứu portfolio và quyền ────────────────────────────────────────────

    async def _active_portfolio(self, portfolio_id: int) -> Portfolio:
        portfolio = await self.db.scalar(
            select(Portfolio).where(Portfolio.id == portfolio_id, Portfolio.deleted_at.is_(None))
        )
        if portfolio is None:
            raise NotFoundException("Portfolio not found")
        return portfolio

    async def _managed_portfolio(self, portfolio_id: int, actor: User) -> Portfolio:
        portfolio = await self._active_portfolio(portfolio_id)
        if not is_admin(actor) and portfolio.owner_id != actor.id:
            raise ForbiddenException("Only the portfolio owner or an admin can manage investors")
        return portfolio

    async def _viewable_portfolio(self, portfolio_id: int, user: User) -> Portfolio:
        portfolio = await self._active_portfolio(portfolio_id)
        if is_admin(user) or portfolio.owner_id == user.id:
            return portfolio
        granted = await self.db.scalar(
            select(
                exists().where(
                    PortfolioInvestor.portfolio_id == portfolio.id,
                    PortfolioInvestor.user_id == user.id,
                )
            )
        )
        if not granted:
            raise ForbiddenException("You do not have access to this portfolio")
        return portfolio

    # ── Quản lý quyền investor ────────────────────────────────────────────────

    @staticmethod
    def _grant_response(grant: PortfolioInvestor, user: User) -> InvestorGrantResponse:
        return InvestorGrantResponse(
            user_id=user.id,
            full_name=user.full_name,
            email=user.email,
            granted_at=grant.created_at,
            granted_by_id=grant.granted_by_id,
        )

    def _audit(self, actor: User, action: str, portfolio: Portfolio, investor_id: int) -> None:
        self.db.add(
            AuditLog(
                user_id=actor.id,
                action=action,
                entity_type="Portfolio",
                entity_id=portfolio.id,
                new_values={"investor_id": investor_id},
                description=f"{action.title()} on portfolio {portfolio.name}",
            )
        )

    async def list_grants(self, portfolio_id: int, actor: User) -> list[InvestorGrantResponse]:
        await self._managed_portfolio(portfolio_id, actor)
        result = await self.db.execute(
            select(PortfolioInvestor, User)
            .join(User, User.id == PortfolioInvestor.user_id)
            .where(PortfolioInvestor.portfolio_id == portfolio_id)
            .order_by(PortfolioInvestor.created_at, PortfolioInvestor.id)
        )
        return [self._grant_response(grant, user) for grant, user in result.all()]

    async def grant(
        self, portfolio_id: int, email: str, actor: User
    ) -> tuple[InvestorGrantResponse, bool]:
        portfolio = await self._managed_portfolio(portfolio_id, actor)
        target = await self.db.scalar(
            select(User).where(func.lower(User.email) == email.strip().lower())
        )
        if target is None:
            raise NotFoundException("User not found")
        if not any(role.name == INVESTOR_ROLE for role in target.roles):
            raise BadRequestException("User does not have the Investor role")

        existing = await self.db.scalar(
            select(PortfolioInvestor).where(
                PortfolioInvestor.portfolio_id == portfolio.id,
                PortfolioInvestor.user_id == target.id,
            )
        )
        if existing is not None:
            return self._grant_response(existing, target), False

        grant = PortfolioInvestor(
            portfolio_id=portfolio.id, user_id=target.id, granted_by_id=actor.id
        )
        self.db.add(grant)
        await self.db.flush()
        # Nạp created_at do server sinh; truy cập thuộc tính hết hạn trong async sẽ lỗi.
        await self.db.refresh(grant)
        self._audit(actor, "GRANT_INVESTOR", portfolio, target.id)
        return self._grant_response(grant, target), True

    async def revoke(self, portfolio_id: int, user_id: int, actor: User) -> None:
        portfolio = await self._managed_portfolio(portfolio_id, actor)
        grant = await self.db.scalar(
            select(PortfolioInvestor).where(
                PortfolioInvestor.portfolio_id == portfolio.id,
                PortfolioInvestor.user_id == user_id,
            )
        )
        if grant is None:
            raise NotFoundException("Investor access not found")
        await self.db.delete(grant)
        await self.db.flush()
        self._audit(actor, "REVOKE_INVESTOR", portfolio, user_id)


async def get_investor_service(db: Annotated[AsyncSession, Depends(get_db)]) -> InvestorService:
    return InvestorService(db)


InvestorServiceDep = Annotated[InvestorService, Depends(get_investor_service)]
```

- [ ] **Step 5: Thêm route vào `portfolios.py`**

Trong `backend/app/api/v1/endpoints/portfolios.py`, thêm import:

```python
from app.schemas.investor import InvestorGrantCreate, InvestorGrantResponse
from app.services.investor_service import InvestorServiceDep
```

Thêm vào cuối tệp:

```python
@router.get("/{portfolio_id}/investors", response_model=list[InvestorGrantResponse])
async def list_portfolio_investors(
    portfolio_id: int,
    service: InvestorServiceDep,
    current_user: CurrentUser,
):
    return await service.list_grants(portfolio_id, current_user)


@router.post(
    "/{portfolio_id}/investors",
    response_model=InvestorGrantResponse,
    status_code=status.HTTP_201_CREATED,
)
async def grant_portfolio_investor(
    portfolio_id: int,
    body: InvestorGrantCreate,
    response: Response,
    service: InvestorServiceDep,
    current_user: CurrentVerifiedUser,
):
    grant, created = await service.grant(portfolio_id, body.email, current_user)
    # Cấp lại cho người đã có quyền: trả bản ghi cũ với 200, không coi là lỗi.
    if not created:
        response.status_code = status.HTTP_200_OK
    return grant


@router.delete("/{portfolio_id}/investors/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def revoke_portfolio_investor(
    portfolio_id: int,
    user_id: int,
    service: InvestorServiceDep,
    current_user: CurrentVerifiedUser,
):
    await service.revoke(portfolio_id, user_id, current_user)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
```

- [ ] **Step 6: Chạy test để thấy đạt**

Run: `.venv/Scripts/python -m pytest tests/integration/test_portfolio_investor_grants.py -q`
Expected: tất cả PASS.

- [ ] **Step 7: Commit**

```bash
git add backend/app/schemas/investor.py backend/app/services/investor_service.py backend/app/api/v1/endpoints/portfolios.py backend/tests/integration/test_portfolio_investor_grants.py
git commit -m "feat(investor): API cap va thu hoi quyen investor cho portfolio"
```

---

### Task 4: API đọc của cổng investor

**Files:**
- Modify: `backend/app/schemas/investor.py`, `backend/app/services/investor_service.py`, `backend/app/services/dashboard_service.py:285-305`, `backend/app/api/v1/router.py`
- Create: `backend/app/api/v1/endpoints/investor.py`
- Test: `backend/tests/integration/test_investor_portal.py`

**Interfaces:**
- Consumes: `compute_project_metrics`, `aggregate_metrics`, `Metrics`, `HEALTH_KEYS` (Task 1); `InvestorService._viewable_portfolio` (Task 3).
- Produces:
  - Hàm cấp module `project_task_counts(db, project_ids, today)` trong `dashboard_service.py`. Trả các dòng có `project_id, total, done, overdue`.
  - Schema `MetricsResponse`, `InvestorProjectRow`, `InvestorProjectDetail`, `InvestorPortfolioItem`, `InvestorPortfolioOverview`, `PortfolioBrief`.
  - Route `GET /api/v1/investor/portfolios`, `GET /api/v1/investor/portfolios/{id}`, `GET /api/v1/investor/projects/{id}`.

- [ ] **Step 1: Viết test lỗi**

Tạo `backend/tests/integration/test_investor_portal.py`:

```python
"""Cổng nhà đầu tư: ma trận quyền, số liệu và ngân sách truy vấn."""
from datetime import date, timedelta

import pytest
from sqlalchemy import event

from app.models.permission import Permission
from app.models.portfolio import Portfolio
from app.models.portfolio_investor import PortfolioInvestor
from app.models.project import Project, ProjectStatus
from app.models.risk_report import RiskLevel, RiskReport
from app.models.role import Role
from app.models.task import Task


@pytest.fixture
async def investor_setup(session, make_user, seed_roles):
    read = Permission(resource="portfolio", action="read")
    investor_role = Role(name="Investor", description="Investor role")
    investor_role.permissions = [read]
    session.add_all([read, investor_role])
    await session.flush()

    # Seed thật cho PM quyền portfolio:read; fixture seed_roles thì không, nên gắn thêm
    # một role chỉ mang quyền đó (không gán vào seed_roles["PM"].permissions vì sẽ
    # kích hoạt lazy load ngoài greenlet).
    pm_reader = Role(name="PMReader", description="PM portfolio read")
    pm_reader.permissions = [read]
    session.add(pm_reader)
    await session.flush()

    owner = await make_user(roles=[seed_roles["PM"], pm_reader])
    admin = await make_user(roles=[seed_roles["Admin"]], superuser=True)
    granted = await make_user(roles=[investor_role])
    other_investor = await make_user(roles=[investor_role])
    no_permission = await make_user(roles=[seed_roles["Member"]])

    portfolio = Portfolio(name="Growth", owner_id=owner.id, currency="VND")
    session.add(portfolio)
    await session.flush()

    today = date.today()
    alpha = Project(
        name="Alpha", pm_id=owner.id, portfolio_id=portfolio.id, currency="VND",
        budget=1000.0, actual_cost=400.0, progress=50.0, expected_benefit=1200.0,
        start_date=today - timedelta(days=10), end_date=today + timedelta(days=10),
        status=ProjectStatus.ACTIVE,
    )
    usd = Project(
        name="Overseas", pm_id=owner.id, portfolio_id=portfolio.id, currency="USD",
        budget=500.0, actual_cost=100.0, progress=20.0,
        start_date=today - timedelta(days=10), end_date=today + timedelta(days=10),
    )
    unbudgeted = Project(
        name="Seed", pm_id=owner.id, portfolio_id=portfolio.id, currency="VND",
        start_date=today - timedelta(days=30), end_date=today - timedelta(days=1),
    )
    standalone = Project(name="Lonely", pm_id=owner.id, currency="VND")
    session.add_all([alpha, usd, unbudgeted, standalone])
    await session.flush()
    session.add_all([
        RiskReport(project_id=alpha.id, risk_score=2.0, risk_level=RiskLevel.LOW),
        RiskReport(project_id=alpha.id, risk_score=8.0, risk_level=RiskLevel.HIGH, summary="Late vendor"),
        Task(project_id=alpha.id, name="Overdue", due_date=today - timedelta(days=2)),
        PortfolioInvestor(portfolio_id=portfolio.id, user_id=granted.id, granted_by_id=owner.id),
    ])
    await session.flush()
    return {
        "owner": owner, "admin": admin, "granted": granted, "other_investor": other_investor,
        "no_permission": no_permission, "portfolio": portfolio, "alpha": alpha, "usd": usd,
        "unbudgeted": unbudgeted, "standalone": standalone,
    }


def overview_url(setup):
    return f"/api/v1/investor/portfolios/{setup['portfolio'].id}"


@pytest.mark.asyncio
@pytest.mark.parametrize(
    ("who", "expected"),
    [("granted", 200), ("owner", 200), ("admin", 200), ("other_investor", 403), ("no_permission", 403)],
)
async def test_ma_tran_quyen_overview(as_user, investor_setup, who, expected):
    async with as_user(investor_setup[who]) as client:
        response = await client.get(overview_url(investor_setup))
        project = await client.get(f"/api/v1/investor/projects/{investor_setup['alpha'].id}")
    assert response.status_code == expected
    assert project.status_code == expected


@pytest.mark.asyncio
async def test_danh_sach_chi_gom_portfolio_duoc_cap(as_user, investor_setup):
    async with as_user(investor_setup["granted"]) as client:
        granted = await client.get("/api/v1/investor/portfolios")
    async with as_user(investor_setup["other_investor"]) as client:
        other = await client.get("/api/v1/investor/portfolios")
    assert granted.status_code == 200
    items = granted.json()["items"]
    assert [item["id"] for item in items] == [investor_setup["portfolio"].id]
    assert items[0]["granted_at"] is not None
    assert items[0]["project_count"] == 3
    assert other.json()["items"] == []


@pytest.mark.asyncio
async def test_so_lieu_overview(as_user, investor_setup):
    async with as_user(investor_setup["granted"]) as client:
        body = (await client.get(overview_url(investor_setup))).json()

    totals = body["totals"]
    # Chỉ Alpha được gộp: Overseas khác tiền tệ, Seed chưa có ngân sách.
    assert totals["bac"] == 1000.0
    assert totals["ac"] == 400.0
    assert totals["cpi"] == 1.25
    assert totals["roi"] == 0.5
    assert totals["roi_basis"] == "eac"

    rows = {row["name"]: row for row in body["projects"]}
    assert rows["Alpha"]["excluded_from_totals"] is False
    assert rows["Alpha"]["risk_level"] == "HIGH"  # báo cáo mới nhất
    assert rows["Alpha"]["overdue_tasks"] == 1
    assert rows["Overseas"]["exclusion_reason"] == "currency_mismatch"
    assert rows["Seed"]["exclusion_reason"] == "no_budget"
    assert "Lonely" not in rows

    assert body["risk_distribution"] == {"LOW": 0, "MEDIUM": 0, "HIGH": 1, "CRITICAL": 0, "none": 2}
    assert sum(body["health_distribution"].values()) == 3
    assert body["overdue_projects"] == 1  # Seed đã qua end_date và chưa COMPLETED


@pytest.mark.asyncio
async def test_chi_tiet_du_an_khong_lo_du_lieu_ca_nhan(as_user, investor_setup):
    async with as_user(investor_setup["granted"]) as client:
        body = (await client.get(f"/api/v1/investor/projects/{investor_setup['alpha'].id}")).json()
    assert body["risk_summary"] == "Late vendor"
    assert body["task_counts"] == {"TODO": 1}
    assert not {"members", "pm_id", "worklogs", "messages"} & set(body)


@pytest.mark.asyncio
async def test_du_an_ngoai_portfolio_tra_404(as_user, investor_setup):
    async with as_user(investor_setup["admin"]) as client:
        response = await client.get(f"/api/v1/investor/projects/{investor_setup['standalone'].id}")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_thu_hoi_co_hieu_luc_ngay(as_user, investor_setup):
    async with as_user(investor_setup["granted"]) as client:
        before = await client.get(overview_url(investor_setup))
    async with as_user(investor_setup["owner"]) as client:
        revoke = await client.delete(
            f"/api/v1/portfolios/{investor_setup['portfolio'].id}/investors/{investor_setup['granted'].id}"
        )
    async with as_user(investor_setup["granted"]) as client:
        after = await client.get(overview_url(investor_setup))
    assert (before.status_code, revoke.status_code, after.status_code) == (200, 204, 403)


@pytest.mark.asyncio
async def test_investor_khong_ghi_duoc(as_user, investor_setup):
    portfolio_id = investor_setup["portfolio"].id
    project_id = investor_setup["alpha"].id
    async with as_user(investor_setup["granted"]) as client:
        portfolio = await client.patch(f"/api/v1/portfolios/{portfolio_id}", json={"name": "Hacked"})
        project = await client.patch(f"/api/v1/projects/{project_id}", json={"name": "Hacked"})
        task = await client.post(f"/api/v1/projects/{project_id}/tasks", json={"name": "Hacked task"})
    assert portfolio.status_code == 403
    assert project.status_code == 403
    assert task.status_code == 403


@pytest.mark.asyncio
async def test_so_cau_sql_khong_doi_theo_so_du_an(as_user, session, engine, investor_setup):
    statements: list[str] = []

    def count(conn, cursor, statement, parameters, context, executemany):
        statements.append(statement)

    async def measure() -> int:
        statements.clear()
        event.listen(engine.sync_engine, "before_cursor_execute", count)
        try:
            async with as_user(investor_setup["granted"]) as client:
                response = await client.get(overview_url(investor_setup))
            assert response.status_code == 200
        finally:
            event.remove(engine.sync_engine, "before_cursor_execute", count)
        return len(statements)

    small = await measure()
    for index in range(17):
        session.add(Project(
            name=f"Extra {index}", pm_id=investor_setup["owner"].id,
            portfolio_id=investor_setup["portfolio"].id, budget=100.0, currency="VND",
        ))
    await session.flush()
    large = await measure()
    assert small <= 6
    assert large == small
```

`TaskCreate` chỉ bắt buộc `name` (tối thiểu 3 ký tự), nên body `{"name": "Hacked task"}` hợp lệ và request đi tới kiểm tra quyền.

- [ ] **Step 2: Chạy test để thấy lỗi**

Run: `.venv/Scripts/python -m pytest tests/integration/test_investor_portal.py -q`
Expected: FAIL với 404 cho `/api/v1/investor/...`.

- [ ] **Step 3: Tách hàm đếm task**

Trong `backend/app/services/dashboard_service.py`, đặt hàm sau ở cấp module, ngay trên `class DashboardService`:

```python
async def project_task_counts(db: AsyncSession, project_ids: list[int], today: date):
    """Đếm task theo dự án trong một câu GROUP BY (tổng, xong, quá hạn).

    Dùng chung cho dashboard và cổng nhà đầu tư để số liệu quá hạn khớp nhau.
    """
    if not project_ids:
        return []
    result = await db.execute(
        select(
            Task.project_id,
            func.count().label("total"),
            func.sum(case((Task.status == TaskStatus.DONE, 1), else_=0)).label("done"),
            func.sum(
                case(((Task.due_date < today) & (Task.status != TaskStatus.DONE), 1), else_=0)
            ).label("overdue"),
        )
        .where(Task.project_id.in_(project_ids))
        .group_by(Task.project_id)
    )
    return result.all()
```

Thay thân `DashboardService._project_task_counts` bằng:

```python
    async def _project_task_counts(self, project_ids: list[int], today: date):
        return await project_task_counts(self.db, project_ids, today)
```

Chạy `.venv/Scripts/python -m pytest tests -q -k dashboard`. Expected: các test dashboard có sẵn vẫn PASS.

- [ ] **Step 4: Thêm schema đọc**

Trong `backend/app/schemas/investor.py`:
- Đổi dòng import thành `from datetime import date, datetime`.
- Thêm vào cuối tệp:

```python
class MetricsResponse(BaseModel):
    bac: float | None
    ac: float
    ev: float | None
    pv: float | None
    cpi: float | None
    spi: float | None
    eac: float | None
    vac: float | None
    expected_benefit: float | None
    roi: float | None
    roi_basis: str | None
    health: str


class InvestorProjectRow(BaseModel):
    id: int
    name: str
    status: str
    start_date: date | None
    end_date: date | None
    progress: float
    currency: str
    metrics: MetricsResponse
    risk_level: str | None
    risk_score: float | None
    overdue_tasks: int
    excluded_from_totals: bool
    # "currency_mismatch" | "no_budget" | None
    exclusion_reason: str | None


class InvestorProjectDetail(InvestorProjectRow):
    portfolio_id: int
    task_counts: dict[str, int]
    risk_summary: str | None


class PortfolioBrief(BaseModel):
    id: int
    name: str
    description: str | None
    status: str
    start_date: date | None
    end_date: date | None
    budget: float | None
    currency: str


class InvestorPortfolioItem(BaseModel):
    id: int
    name: str
    status: str
    currency: str
    budget: float | None
    project_count: int
    total_bac: float | None
    total_ac: float
    cpi: float | None
    spi: float | None
    health: str
    granted_at: datetime | None


class InvestorPortfolioOverview(BaseModel):
    portfolio: PortfolioBrief
    totals: MetricsResponse
    health_distribution: dict[str, int]
    risk_distribution: dict[str, int]
    overdue_projects: int
    projects: list[InvestorProjectRow]
```

- [ ] **Step 5: Thêm phần đọc vào service**

Trong `backend/app/services/investor_service.py`:
- Thêm import:

```python
from dataclasses import asdict
from datetime import date

from sqlalchemy import or_

from app.models.project import Project, ProjectStatus
from app.models.risk_report import RiskLevel, RiskReport
from app.models.task import Task
from app.schemas.investor import (
    InvestorPortfolioItem,
    InvestorPortfolioOverview,
    InvestorProjectDetail,
    InvestorProjectRow,
    MetricsResponse,
    PortfolioBrief,
)
from app.services.dashboard_service import project_task_counts
from app.services.evm import HEALTH_KEYS, Metrics, aggregate_metrics, compute_project_metrics
```

- Thêm hằng số ở cấp module:

```python
# Chỉ lấy cột cần cho số liệu, không nạp cả đối tượng Project.
_PROJECT_COLUMNS = (
    Project.id, Project.portfolio_id, Project.name, Project.status, Project.start_date,
    Project.end_date, Project.progress, Project.currency, Project.budget,
    Project.actual_cost, Project.expected_benefit,
)
```

- Thêm các phương thức sau vào `InvestorService`:

```python
    # ── Đọc số liệu ───────────────────────────────────────────────────────────

    async def _project_rows(self, portfolio_ids: list[int]):
        if not portfolio_ids:
            return []
        result = await self.db.execute(
            select(*_PROJECT_COLUMNS)
            .where(Project.portfolio_id.in_(portfolio_ids), Project.deleted_at.is_(None))
            .order_by(Project.id)
        )
        return result.all()

    async def _latest_risks(self, project_ids: list[int]) -> dict:
        if not project_ids:
            return {}
        # max(id) thay vì max(created_at) để không trùng khi hai báo cáo cùng thời điểm.
        latest = (
            select(func.max(RiskReport.id).label("id"))
            .where(RiskReport.project_id.in_(project_ids))
            .group_by(RiskReport.project_id)
            .subquery()
        )
        result = await self.db.execute(
            select(
                RiskReport.project_id, RiskReport.risk_level,
                RiskReport.risk_score, RiskReport.summary,
            ).join(latest, RiskReport.id == latest.c.id)
        )
        return {row.project_id: row for row in result.all()}

    @staticmethod
    def _metrics(project, today: date) -> Metrics:
        return compute_project_metrics(
            budget=project.budget,
            actual_cost=project.actual_cost,
            progress=project.progress,
            start_date=project.start_date,
            end_date=project.end_date,
            expected_benefit=project.expected_benefit,
            today=today,
        )

    @staticmethod
    def _exclusion(project, metrics: Metrics, currency: str) -> str | None:
        if project.currency != currency:
            return "currency_mismatch"
        if metrics.bac is None:
            return "no_budget"
        return None

    def _row(self, project, metrics: Metrics, currency: str, task_row, risk) -> InvestorProjectRow:
        reason = self._exclusion(project, metrics, currency)
        return InvestorProjectRow(
            id=project.id,
            name=project.name,
            status=project.status.value,
            start_date=project.start_date,
            end_date=project.end_date,
            progress=round(project.progress, 1),
            currency=project.currency,
            metrics=MetricsResponse(**asdict(metrics)),
            risk_level=risk.risk_level.value if risk else None,
            risk_score=risk.risk_score if risk else None,
            overdue_tasks=int(task_row.overdue or 0) if task_row else 0,
            excluded_from_totals=reason is not None,
            exclusion_reason=reason,
        )

    async def portfolio_overview(
        self, portfolio_id: int, user: User, today: date | None = None
    ) -> InvestorPortfolioOverview:
        today = today or date.today()
        portfolio = await self._viewable_portfolio(portfolio_id, user)
        projects = await self._project_rows([portfolio.id])
        ids = [project.id for project in projects]
        task_map = {row.project_id: row for row in await project_task_counts(self.db, ids, today)}
        risks = await self._latest_risks(ids)

        rows: list[InvestorProjectRow] = []
        included: list[Metrics] = []
        for project in projects:
            metrics = self._metrics(project, today)
            row = self._row(project, metrics, portfolio.currency, task_map.get(project.id), risks.get(project.id))
            rows.append(row)
            if not row.excluded_from_totals:
                included.append(metrics)

        health = dict.fromkeys(HEALTH_KEYS, 0)
        risk_counts = {level.value: 0 for level in RiskLevel} | {"none": 0}
        for row in rows:
            health[row.metrics.health] += 1
            risk_counts[row.risk_level or "none"] += 1
        overdue = sum(
            1 for row in rows
            if row.end_date and row.end_date < today and row.status != ProjectStatus.COMPLETED.value
        )
        return InvestorPortfolioOverview(
            portfolio=PortfolioBrief(
                id=portfolio.id,
                name=portfolio.name,
                description=portfolio.description,
                status=portfolio.status.value,
                start_date=portfolio.start_date,
                end_date=portfolio.end_date,
                budget=portfolio.budget,
                currency=portfolio.currency,
            ),
            totals=MetricsResponse(**asdict(aggregate_metrics(included))),
            health_distribution=health,
            risk_distribution=risk_counts,
            overdue_projects=overdue,
            projects=rows,
        )

    async def list_portfolios(
        self, user: User, *, skip: int, limit: int, today: date | None = None
    ) -> tuple[list[InvestorPortfolioItem], int]:
        today = today or date.today()
        admin = is_admin(user)
        grant_join = (PortfolioInvestor.portfolio_id == Portfolio.id) & (
            PortfolioInvestor.user_id == user.id
        )
        conditions = [Portfolio.deleted_at.is_(None)]
        if not admin:
            conditions.append(or_(Portfolio.owner_id == user.id, PortfolioInvestor.id.is_not(None)))

        total = await self.db.scalar(
            select(func.count(Portfolio.id))
            .select_from(Portfolio)
            .outerjoin(PortfolioInvestor, grant_join)
            .where(*conditions)
        )
        result = await self.db.execute(
            select(Portfolio, PortfolioInvestor.created_at.label("granted_at"))
            .outerjoin(PortfolioInvestor, grant_join)
            .where(*conditions)
            .order_by(Portfolio.name, Portfolio.id)
            .offset(skip)
            .limit(limit)
        )
        page = result.all()
        projects = await self._project_rows([row.Portfolio.id for row in page])

        items: list[InvestorPortfolioItem] = []
        for row in page:
            portfolio = row.Portfolio
            own = [project for project in projects if project.portfolio_id == portfolio.id]
            included = []
            for project in own:
                metrics = self._metrics(project, today)
                if self._exclusion(project, metrics, portfolio.currency) is None:
                    included.append(metrics)
            totals = aggregate_metrics(included)
            # Xem với tư cách admin hoặc chủ thì không hiện thời điểm cấp quyền.
            viewing_as_investor = not admin and portfolio.owner_id != user.id
            items.append(
                InvestorPortfolioItem(
                    id=portfolio.id,
                    name=portfolio.name,
                    status=portfolio.status.value,
                    currency=portfolio.currency,
                    budget=portfolio.budget,
                    project_count=len(own),
                    total_bac=totals.bac,
                    total_ac=totals.ac,
                    cpi=totals.cpi,
                    spi=totals.spi,
                    health=totals.health,
                    granted_at=row.granted_at if viewing_as_investor else None,
                )
            )
        return items, int(total or 0)

    async def project_summary(
        self, project_id: int, user: User, today: date | None = None
    ) -> InvestorProjectDetail:
        today = today or date.today()
        project = (
            await self.db.execute(
                select(*_PROJECT_COLUMNS).where(Project.id == project_id, Project.deleted_at.is_(None))
            )
        ).first()
        # Dự án không thuộc portfolio nào trả 404 để không lộ sự tồn tại.
        if project is None or project.portfolio_id is None:
            raise NotFoundException("Project not found")
        portfolio = await self._viewable_portfolio(project.portfolio_id, user)

        task_rows = await project_task_counts(self.db, [project.id], today)
        risks = await self._latest_risks([project.id])
        status_rows = await self.db.execute(
            select(Task.status, func.count().label("cnt"))
            .where(Task.project_id == project.id, Task.archived_at.is_(None))
            .group_by(Task.status)
        )
        metrics = self._metrics(project, today)
        row = self._row(
            project, metrics, portfolio.currency,
            task_rows[0] if task_rows else None, risks.get(project.id),
        )
        risk = risks.get(project.id)
        return InvestorProjectDetail(
            **row.model_dump(),
            portfolio_id=portfolio.id,
            task_counts={status.value: int(cnt) for status, cnt in status_rows.all()},
            risk_summary=risk.summary if risk else None,
        )
```

- [ ] **Step 6: Thêm router và mount**

Tạo `backend/app/api/v1/endpoints/investor.py`:

```python
"""Cổng nhà đầu tư: chỉ đọc, mọi route yêu cầu quyền portfolio:read."""
from typing import Annotated

from fastapi import APIRouter, Depends, Query

from app.core.dependencies import require_permissions
from app.models.user import User
from app.schemas.common import PaginatedResponse
from app.schemas.investor import (
    InvestorPortfolioItem,
    InvestorPortfolioOverview,
    InvestorProjectDetail,
)
from app.services.investor_service import InvestorServiceDep

router = APIRouter()

PortfolioReader = Annotated[User, Depends(require_permissions("portfolio:read"))]


@router.get("/portfolios", response_model=PaginatedResponse[InvestorPortfolioItem])
async def list_investor_portfolios(
    service: InvestorServiceDep,
    current_user: PortfolioReader,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
):
    items, total = await service.list_portfolios(
        current_user, skip=(page - 1) * page_size, limit=page_size
    )
    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=(total + page_size - 1) // page_size if total else 0,
    )


@router.get("/portfolios/{portfolio_id}", response_model=InvestorPortfolioOverview)
async def get_investor_portfolio(
    portfolio_id: int, service: InvestorServiceDep, current_user: PortfolioReader
):
    return await service.portfolio_overview(portfolio_id, current_user)


@router.get("/projects/{project_id}", response_model=InvestorProjectDetail)
async def get_investor_project(
    project_id: int, service: InvestorServiceDep, current_user: PortfolioReader
):
    return await service.project_summary(project_id, current_user)
```

Trong `backend/app/api/v1/router.py`:
- Thêm `investor,` vào khối `from app.api.v1.endpoints import (...)`, đúng thứ tự chữ cái.
- Thêm ngay sau dòng mount `dashboards`:

```python
api_router.include_router(investor.router, prefix="/investor", tags=["Investor"])
```

- [ ] **Step 7: Chạy test để thấy đạt**

Run: `.venv/Scripts/python -m pytest tests/integration/test_investor_portal.py -q`
Expected: tất cả PASS.

Lưu ý cho test số câu SQL: nếu `small` lớn hơn 6, in `statements` ra để xem câu thừa. Thường gặp: lazy load `user.roles` hoặc `Role.permissions`. Sửa bằng cách nạp sẵn trong fixture, KHÔNG nới ngưỡng.

- [ ] **Step 8: Chạy toàn bộ backend test và ruff**

Run:

```bash
.venv/Scripts/python -m pytest -q
.venv/Scripts/python -m ruff check app tests
```

Expected: không có failure. Ruff sạch (CI ghim ruff 0.6.9).

- [ ] **Step 9: Commit**

```bash
git add backend/app/schemas/investor.py backend/app/services/investor_service.py backend/app/services/dashboard_service.py backend/app/api/v1/endpoints/investor.py backend/app/api/v1/router.py backend/tests/integration/test_investor_portal.py
git commit -m "feat(investor): API doc cong nha dau tu voi EVM, ROI va rui ro"
```

---

### Task 5: Frontend nền tảng: kiểu dữ liệu, service, hook, RBAC, điều hướng, i18n

**Files:**
- Create:
  - `frontend/src/features/investor/types/investor.types.ts`
  - `frontend/src/features/investor/services/investor.service.ts`
  - `frontend/src/features/investor/hooks/useInvestor.ts`
  - `frontend/src/lib/rbac.test.ts`
- Modify:
  - `frontend/src/lib/rbac.ts`
  - `frontend/src/components/layout/Navigation.tsx`
  - `frontend/src/app/(dashboard)/layout.tsx:100,130`
  - `frontend/messages/en.json`, `frontend/messages/vi.json`

**Interfaces:**
- Consumes: các route backend của Task 3 và Task 4.
- Produces:
  - `isInvestorUser(user)`, `canViewInvestorPortal(user)`
  - Type: `Metrics`, `InvestorProjectRow`, `InvestorProjectDetail`, `InvestorPortfolioItem`, `InvestorPortfolioOverview`, `InvestorGrant`, `HealthKey`
  - `investorService`
  - Hook: `useInvestorPortfolios()`, `useInvestorPortfolio(id)`, `usePortfolioInvestors(portfolioId, enabled)`, `useGrantInvestor(portfolioId)`, `useRevokeInvestor(portfolioId)`
  - Namespace i18n `investor`; khóa `nav.investor`, `nav.groupInvestor`.
  - Prop mới `isInvestor?: boolean` của `MainNav` và `MobileNav`.

- [ ] **Step 1: Viết test lỗi cho RBAC**

Tạo `frontend/src/lib/rbac.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import type { User } from '@/types/auth.types'
import { canViewInvestorPortal, isInvestorUser } from './rbac'

const user = (roles: string[], is_superuser = false) =>
  ({ id: 1, is_superuser, roles: roles.map((name, id) => ({ id, name })) }) as unknown as User

describe('rbac investor', () => {
  it('nhận diện role Investor', () => {
    expect(isInvestorUser(user(['Investor']))).toBe(true)
    expect(isInvestorUser(user(['PM']))).toBe(false)
    expect(isInvestorUser(null)).toBe(false)
  })

  it('investor và admin vào được cổng, PM thì không', () => {
    expect(canViewInvestorPortal(user(['Investor']))).toBe(true)
    expect(canViewInvestorPortal(user(['Admin']))).toBe(true)
    expect(canViewInvestorPortal(user([], true))).toBe(true)
    expect(canViewInvestorPortal(user(['PM']))).toBe(false)
  })
})
```

- [ ] **Step 2: Chạy test để thấy lỗi**

Run (từ `frontend/`): `npx vitest run src/lib/rbac.test.ts`
Expected: FAIL vì `isInvestorUser` không được export.

- [ ] **Step 3: Viết RBAC**

Thêm vào cuối `frontend/src/lib/rbac.ts`:

```ts
/** Người dùng có role "Investor" (phản chiếu INVESTOR_ROLE ở backend investor_service.py). */
export function isInvestorUser(user: User | null | undefined): boolean {
  if (!user) return false
  return user.roles.some((role) => role.name === 'Investor')
}

/** Cổng /investor mở cho investor và admin; quyền xem từng portfolio vẫn do backend quyết. */
export function canViewInvestorPortal(user: User | null | undefined): boolean {
  return isInvestorUser(user) || isAdminUser(user)
}
```

Run: `npx vitest run src/lib/rbac.test.ts`. Expected: PASS.

- [ ] **Step 4: Viết type, service, hook**

Tạo `frontend/src/features/investor/types/investor.types.ts`:

```ts
/** Phản chiếu backend app/schemas/investor.py */

export type HealthKey = 'on_track' | 'at_risk' | 'off_track' | 'unknown'
export type RoiBasis = 'eac' | 'bac' | 'mixed'
export type ExclusionReason = 'currency_mismatch' | 'no_budget'

export interface Metrics {
  bac: number | null
  ac: number
  ev: number | null
  pv: number | null
  cpi: number | null
  spi: number | null
  eac: number | null
  vac: number | null
  expected_benefit: number | null
  roi: number | null
  roi_basis: RoiBasis | null
  health: HealthKey
}

export interface InvestorProjectRow {
  id: number
  name: string
  status: string
  start_date: string | null
  end_date: string | null
  progress: number
  currency: string
  metrics: Metrics
  risk_level: string | null
  risk_score: number | null
  overdue_tasks: number
  excluded_from_totals: boolean
  exclusion_reason: ExclusionReason | null
}

export interface InvestorProjectDetail extends InvestorProjectRow {
  portfolio_id: number
  task_counts: Record<string, number>
  risk_summary: string | null
}

export interface InvestorPortfolioItem {
  id: number
  name: string
  status: string
  currency: string
  budget: number | null
  project_count: number
  total_bac: number | null
  total_ac: number
  cpi: number | null
  spi: number | null
  health: HealthKey
  granted_at: string | null
}

export interface InvestorPortfolioOverview {
  portfolio: {
    id: number
    name: string
    description: string | null
    status: string
    start_date: string | null
    end_date: string | null
    budget: number | null
    currency: string
  }
  totals: Metrics
  health_distribution: Record<HealthKey, number>
  risk_distribution: Record<string, number>
  overdue_projects: number
  projects: InvestorProjectRow[]
}

export interface InvestorGrant {
  user_id: number
  full_name: string
  email: string
  granted_at: string
  granted_by_id: number | null
}
```

Tạo `frontend/src/features/investor/services/investor.service.ts`:

```ts
import { api } from '@/services/api'
import type { PaginatedResponse } from '@/types/common.types'
import type {
  InvestorGrant,
  InvestorPortfolioItem,
  InvestorPortfolioOverview,
  InvestorProjectDetail,
} from '../types/investor.types'

export const investorService = {
  listPortfolios: () =>
    api
      .get<PaginatedResponse<InvestorPortfolioItem>>('/investor/portfolios', { params: { page: 1, page_size: 100 } })
      .then((r) => r.data),

  getPortfolio: (id: number) =>
    api.get<InvestorPortfolioOverview>(`/investor/portfolios/${id}`).then((r) => r.data),

  getProject: (id: number) =>
    api.get<InvestorProjectDetail>(`/investor/projects/${id}`).then((r) => r.data),

  listGrants: (portfolioId: number) =>
    api.get<InvestorGrant[]>(`/portfolios/${portfolioId}/investors`).then((r) => r.data),

  grant: (portfolioId: number, email: string) =>
    api.post<InvestorGrant>(`/portfolios/${portfolioId}/investors`, { email }).then((r) => r.data),

  revoke: (portfolioId: number, userId: number) =>
    api.delete(`/portfolios/${portfolioId}/investors/${userId}`).then(() => undefined),
}
```

Tạo `frontend/src/features/investor/hooks/useInvestor.ts`:

```ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { investorService } from '../services/investor.service'

export const INVESTOR_KEYS = {
  portfolios: ['investor', 'portfolios'] as const,
  portfolio: (id: number) => ['investor', 'portfolio', id] as const,
  grants: (portfolioId: number) => ['investor', 'grants', portfolioId] as const,
}

/** Danh sách portfolio người dùng được xem qua cổng nhà đầu tư */
export function useInvestorPortfolios() {
  return useQuery({ queryKey: INVESTOR_KEYS.portfolios, queryFn: investorService.listPortfolios, staleTime: 30_000 })
}

/** Tổng quan một portfolio: KPI, phân bố sức khỏe/rủi ro, bảng dự án */
export function useInvestorPortfolio(id: number) {
  return useQuery({
    queryKey: INVESTOR_KEYS.portfolio(id),
    queryFn: () => investorService.getPortfolio(id),
    enabled: id > 0,
    staleTime: 30_000,
    // 403 sau khi bị thu hồi là kết quả cuối, thử lại không có ích.
    retry: false,
  })
}

/** Danh sách investor của một portfolio (chỉ chủ hoặc admin gọi được) */
export function usePortfolioInvestors(portfolioId: number, enabled: boolean) {
  return useQuery({
    queryKey: INVESTOR_KEYS.grants(portfolioId),
    queryFn: () => investorService.listGrants(portfolioId),
    enabled: enabled && portfolioId > 0,
  })
}

export function useGrantInvestor(portfolioId: number) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (email: string) => investorService.grant(portfolioId, email),
    onSuccess: () => client.invalidateQueries({ queryKey: INVESTOR_KEYS.grants(portfolioId) }),
  })
}

export function useRevokeInvestor(portfolioId: number) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (userId: number) => investorService.revoke(portfolioId, userId),
    onSuccess: () => client.invalidateQueries({ queryKey: INVESTOR_KEYS.grants(portfolioId) }),
  })
}
```

- [ ] **Step 5: Thêm chuỗi i18n**

Trong `frontend/messages/en.json`:
- Trong object `nav`, thêm `"investor": "Investor portal"` và `"groupInvestor": "Investor"`.
- Thêm namespace cấp cao nhất:

```json
"investor": {
  "title": "Investor portal",
  "description": "Read-only financial and schedule view of the portfolios shared with you.",
  "empty": "No portfolio has been shared with you yet.",
  "loading": "Loading investor data…",
  "loadError": "Could not load investor data.",
  "noAccess": "You no longer have access to this portfolio.",
  "backToList": "Back to portfolios",
  "projects": "{count, plural, one {# project} other {# projects}}",
  "kpi": { "bac": "Budget (BAC)", "ac": "Actual cost", "eac": "Forecast cost (EAC)", "cpi": "CPI", "spi": "SPI", "roi": "Expected ROI" },
  "roiBasis": { "eac": "on forecast cost", "bac": "on budget", "mixed": "mixed basis" },
  "health": { "on_track": "On track", "at_risk": "At risk", "off_track": "Off track", "unknown": "Not enough data" },
  "healthChart": "Project health",
  "budgetChart": "Budget vs forecast cost",
  "risk": "Risk",
  "overdueProjects": "Overdue projects",
  "notEnoughData": "Not enough data",
  "notEnoughDataHint": "Needs a budget, dates and recorded cost.",
  "exclusion": { "currency_mismatch": "Different currency", "no_budget": "No budget yet" },
  "excludedHint": "Not included in portfolio totals.",
  "table": { "project": "Project", "progress": "Progress", "health": "Health", "risk": "Risk", "overdue": "Overdue tasks" },
  "grants": {
    "title": "Investors",
    "description": "Investors get read-only access to this portfolio's figures.",
    "email": "Investor email",
    "grant": "Grant access",
    "revoke": "Revoke",
    "cancel": "Cancel",
    "revokeConfirm": "Revoke {name}'s access to this portfolio?",
    "empty": "No investor has access yet.",
    "grantedOn": "Granted {date}"
  }
}
```

Trong `frontend/messages/vi.json`, thêm cùng cấu trúc khóa:
- Trong `nav`: `"investor": "Cổng nhà đầu tư"`, `"groupInvestor": "Nhà đầu tư"`.
- Namespace cấp cao nhất:

```json
"investor": {
  "title": "Cổng nhà đầu tư",
  "description": "Xem chỉ đọc tình hình tài chính và tiến độ của các portfolio được chia sẻ với bạn.",
  "empty": "Chưa có portfolio nào được chia sẻ với bạn.",
  "loading": "Đang tải dữ liệu nhà đầu tư…",
  "loadError": "Không tải được dữ liệu nhà đầu tư.",
  "noAccess": "Bạn không còn quyền xem portfolio này.",
  "backToList": "Quay lại danh sách portfolio",
  "projects": "{count} dự án",
  "kpi": { "bac": "Ngân sách (BAC)", "ac": "Chi phí thực", "eac": "Chi phí dự báo (EAC)", "cpi": "CPI", "spi": "SPI", "roi": "ROI kỳ vọng" },
  "roiBasis": { "eac": "trên chi phí dự báo", "bac": "trên ngân sách", "mixed": "cơ sở kết hợp" },
  "health": { "on_track": "Đúng kế hoạch", "at_risk": "Có rủi ro", "off_track": "Chệch kế hoạch", "unknown": "Chưa đủ dữ liệu" },
  "healthChart": "Sức khỏe dự án",
  "budgetChart": "Ngân sách so với chi phí dự báo",
  "risk": "Rủi ro",
  "overdueProjects": "Dự án trễ hạn",
  "notEnoughData": "Chưa đủ dữ liệu",
  "notEnoughDataHint": "Cần ngân sách, ngày kế hoạch và chi phí đã ghi nhận.",
  "exclusion": { "currency_mismatch": "Khác tiền tệ", "no_budget": "Chưa có ngân sách" },
  "excludedHint": "Không được tính vào tổng của portfolio.",
  "table": { "project": "Dự án", "progress": "Tiến độ", "health": "Sức khỏe", "risk": "Rủi ro", "overdue": "Task quá hạn" },
  "grants": {
    "title": "Nhà đầu tư",
    "description": "Nhà đầu tư được xem chỉ đọc số liệu của portfolio này.",
    "email": "Email nhà đầu tư",
    "grant": "Cấp quyền",
    "revoke": "Thu hồi",
    "cancel": "Hủy",
    "revokeConfirm": "Thu hồi quyền xem portfolio này của {name}?",
    "empty": "Chưa có nhà đầu tư nào được cấp quyền.",
    "grantedOn": "Cấp ngày {date}"
  }
}
```

- [ ] **Step 6: Thêm điều hướng theo role**

Trong `frontend/src/components/layout/Navigation.tsx`:
- Thêm `LineChart` vào import `lucide-react`.
- Đổi `adminOnly: boolean` của mỗi nhóm trong `GROUPS` thành `audience: 'all' | 'admin' | 'investor'`:
  - `groupWorkspace` và `groupPersonal` là `'all'`
  - `groupAdmin` là `'admin'`
- Thêm nhóm sau ngay trước `groupAdmin`:

```ts
  {
    key: 'groupInvestor',
    audience: 'investor',
    links: [{ href: '/investor', key: 'investor', Icon: LineChart }],
  },
```

- Đổi chữ ký và bộ lọc của `MainNav`:

```tsx
export function MainNav({ isAdmin, isInvestor = false, onNavigate }: { isAdmin: boolean; isInvestor?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname()
  const t = useTranslations('nav')
  // Nhóm hiện theo đối tượng; backend vẫn kiểm tra quyền ở từng API.
  const visible = (audience: 'all' | 'admin' | 'investor') =>
    audience === 'all' || (audience === 'admin' && isAdmin) || (audience === 'investor' && isInvestor)
  return (
    <nav aria-label={t('mainNavigation')} className="flex flex-col gap-6">
      {GROUPS.filter(group => visible(group.audience)).map(group => (
```

(Phần còn lại của JSX giữ nguyên.)

- `MobileNav`: thêm prop `isInvestor = false` vào chữ ký và kiểu, rồi truyền `<MainNav isAdmin={isAdmin} isInvestor={isInvestor} onNavigate={onClose} />`.

Trong `frontend/src/app/(dashboard)/layout.tsx`:
- Import `canViewInvestorPortal` cùng chỗ với `isAdminUser`.
- Dòng 100: `<MainNav isAdmin={isAdminUser(user)} isInvestor={canViewInvestorPortal(user)} />`.
- Dòng 130: thêm `isInvestor={canViewInvestorPortal(user)}` vào `MobileNav`.

- [ ] **Step 7: Kiểm tra**

Run: `npx vitest run src/lib/rbac.test.ts "src/app/(dashboard)/layout.test.tsx"` và `npm run type-check`.
Expected: PASS, không lỗi type.

- [ ] **Step 8: Commit**

```bash
git add frontend/src/features/investor frontend/src/lib/rbac.ts frontend/src/lib/rbac.test.ts frontend/src/components/layout/Navigation.tsx "frontend/src/app/(dashboard)/layout.tsx" frontend/messages/en.json frontend/messages/vi.json
git commit -m "feat(investor): kieu du lieu, service, hook, rbac va menu cong nha dau tu"
```

---

### Task 6: Trang cổng investor và các component hiển thị

**Files:**
- Create:
  - `frontend/src/features/investor/components/metricFormat.ts`
  - `frontend/src/features/investor/components/InvestorKpiRow.tsx`
  - `frontend/src/features/investor/components/HealthDonut.tsx`
  - `frontend/src/features/investor/components/BudgetVsEacChart.tsx`
  - `frontend/src/features/investor/components/InvestorProjectTable.tsx`
  - `frontend/src/app/(dashboard)/investor/layout.tsx`
  - `frontend/src/app/(dashboard)/investor/page.tsx`
  - `frontend/src/app/(dashboard)/investor/portfolios/[id]/page.tsx`
- Test:
  - `frontend/src/features/investor/components/InvestorProjectTable.test.tsx`
  - `frontend/src/features/investor/components/InvestorKpiRow.test.tsx`
  - `frontend/src/app/(dashboard)/investor/layout.test.tsx`

**Interfaces:**
- Consumes: type, hook và i18n của Task 5; `DonutChart` (`@/components/charts/DonutChart`); `chartColors`, `axisProps`, `gridProps`, `animationProps`, `usePrefersReducedMotion` (`@/components/charts/chartTheme`); `ChartTooltip`; `Card`, `PageHeader`, `LoadingState`, `ErrorState`, `EmptyState`; `formatMoney` (`@/lib/format`).
- Produces:
  - `HEALTH_COLORS: Record<HealthKey, string>`, `formatRatio(value)`, `formatPercent(value)`
  - Component `<InvestorKpiRow totals currency />`, `<HealthDonut distribution />`, `<BudgetVsEacChart projects />`, `<InvestorProjectTable projects />`

- [ ] **Step 1: Viết test lỗi cho component**

Tạo `frontend/src/features/investor/components/InvestorProjectTable.test.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it } from 'vitest'
import messages from '../../../../messages/vi.json'
import type { InvestorProjectRow, Metrics } from '../types/investor.types'
import { InvestorProjectTable } from './InvestorProjectTable'

const metrics = (overrides: Partial<Metrics> = {}): Metrics => ({
  bac: 1000, ac: 400, ev: 500, pv: 500, cpi: 1.25, spi: 1, eac: 800, vac: 200,
  expected_benefit: 1200, roi: 0.5, roi_basis: 'eac', health: 'on_track', ...overrides,
})

const row = (overrides: Partial<InvestorProjectRow> = {}): InvestorProjectRow => ({
  id: 1, name: 'Alpha', status: 'ACTIVE', start_date: null, end_date: null, progress: 50,
  currency: 'VND', metrics: metrics(), risk_level: 'HIGH', risk_score: 8, overdue_tasks: 2,
  excluded_from_totals: false, exclusion_reason: null, ...overrides,
})

function setup(projects: InvestorProjectRow[]) {
  return render(
    <NextIntlClientProvider locale="vi" messages={messages}>
      <InvestorProjectTable projects={projects} />
    </NextIntlClientProvider>,
  )
}

describe('bảng dự án nhà đầu tư', () => {
  it('hiện chỉ số, nhãn health và ROI theo phần trăm', () => {
    setup([row()])
    const line = screen.getByRole('row', { name: /Alpha/ })
    expect(within(line).getByText('1,25')).toBeInTheDocument()
    expect(within(line).getByText('Đúng kế hoạch')).toBeInTheDocument()
    expect(within(line).getByText('50%')).toBeInTheDocument()
  })

  it('ô thiếu dữ liệu hiện "Chưa đủ dữ liệu" và dự án bị loại có nhãn lý do', () => {
    setup([row({ id: 2, name: 'Seed', metrics: metrics({ cpi: null, spi: null, roi: null, roi_basis: null, health: 'unknown' }), excluded_from_totals: true, exclusion_reason: 'no_budget' })])
    const line = screen.getByRole('row', { name: /Seed/ })
    expect(within(line).getAllByText('Chưa đủ dữ liệu').length).toBeGreaterThan(0)
    expect(within(line).getByText('Chưa có ngân sách')).toBeInTheDocument()
  })
})
```

Tạo `frontend/src/features/investor/components/InvestorKpiRow.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it } from 'vitest'
import messages from '../../../../messages/vi.json'
import type { Metrics } from '../types/investor.types'
import { InvestorKpiRow } from './InvestorKpiRow'

const totals: Metrics = {
  bac: 4000, ac: 3400, ev: 2000, pv: 2000, cpi: 0.588, spi: 1, eac: 6800, vac: -2800,
  expected_benefit: 2700, roi: 0.5, roi_basis: 'mixed', health: 'off_track',
}

describe('hàng KPI nhà đầu tư', () => {
  it('ghi rõ cơ sở ROI và hiện ô thiếu dữ liệu', () => {
    render(
      <NextIntlClientProvider locale="vi" messages={messages}>
        <InvestorKpiRow totals={{ ...totals, eac: null }} currency="VND" />
      </NextIntlClientProvider>,
    )
    expect(screen.getByText('cơ sở kết hợp')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
    expect(screen.getByText('Chưa đủ dữ liệu')).toBeInTheDocument()
  })
})
```

Tạo `frontend/src/app/(dashboard)/investor/layout.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { User } from '@/types/auth.types'
import InvestorLayout from './layout'

const mocks = vi.hoisted(() => ({ replace: vi.fn(), user: null as User | null }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: mocks.replace }) }))
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: mocks.user }) }))

const asUser = (roles: string[]) => ({ id: 1, is_superuser: false, roles: roles.map((name, id) => ({ id, name })) }) as unknown as User

beforeEach(() => vi.clearAllMocks())

describe('chặn cổng nhà đầu tư theo role', () => {
  it('PM bị chuyển về dashboard', () => {
    mocks.user = asUser(['PM'])
    render(<InvestorLayout><p>Secret</p></InvestorLayout>)
    expect(mocks.replace).toHaveBeenCalledWith('/dashboard')
    expect(screen.queryByText('Secret')).not.toBeInTheDocument()
  })

  it('investor xem được nội dung', () => {
    mocks.user = asUser(['Investor'])
    render(<InvestorLayout><p>Secret</p></InvestorLayout>)
    expect(screen.getByText('Secret')).toBeInTheDocument()
    expect(mocks.replace).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Chạy test để thấy lỗi**

Run: `npx vitest run src/features/investor "src/app/(dashboard)/investor"`
Expected: FAIL vì không tìm thấy module component/layout.

- [ ] **Step 3: Viết tiện ích định dạng**

Tạo `frontend/src/features/investor/components/metricFormat.ts`:

```ts
import { chartColors } from '@/components/charts/chartTheme'
import type { HealthKey } from '../types/investor.types'

/** Màu theo ngưỡng health; khớp ngưỡng 0.95 / 0.85 ở backend app/services/evm.py. */
export const HEALTH_COLORS: Record<HealthKey, string> = {
  on_track: chartColors.success,
  at_risk: chartColors.warning,
  off_track: chartColors.destructive,
  unknown: chartColors.muted,
}

export const HEALTH_TEXT_CLASS: Record<HealthKey, string> = {
  on_track: 'text-success',
  at_risk: 'text-warning',
  off_track: 'text-destructive',
  unknown: 'text-muted-foreground',
}

/** Tỷ số như CPI/SPI, 2 chữ số thập phân theo locale. */
export function formatRatio(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
}

/** ROI dạng tỷ lệ (0.5) hiển thị thành phần trăm (50%). */
export function formatPercent(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 }).format(value)
}
```

(`text-success` và `text-warning` đã có trong `frontend/tailwind.config.*`.)

- [ ] **Step 4: Viết `InvestorKpiRow`**

Tạo `frontend/src/features/investor/components/InvestorKpiRow.tsx`:

```tsx
'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Card } from '@/components/ui/Card'
import { formatMoney } from '@/lib/format'
import type { Metrics } from '../types/investor.types'
import { formatPercent, formatRatio } from './metricFormat'

/** Sáu chỉ số tổng hợp; ô thiếu dữ liệu hiện chữ thay vì số 0 gây hiểu nhầm. */
export function InvestorKpiRow({ totals, currency }: { totals: Metrics; currency: string }) {
  const t = useTranslations('investor')
  const locale = useLocale()
  const missing = t('notEnoughData')
  const items = [
    { key: 'bac', value: totals.bac === null ? missing : formatMoney(totals.bac, currency) },
    { key: 'ac', value: formatMoney(totals.ac, currency) },
    { key: 'eac', value: totals.eac === null ? missing : formatMoney(totals.eac, currency) },
    { key: 'cpi', value: totals.cpi === null ? missing : formatRatio(totals.cpi, locale) },
    { key: 'spi', value: totals.spi === null ? missing : formatRatio(totals.spi, locale) },
    { key: 'roi', value: totals.roi === null ? missing : formatPercent(totals.roi, locale), hint: totals.roi_basis ? t(`roiBasis.${totals.roi_basis}`) : null },
  ] as const
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
      {items.map((item) => (
        <Card key={item.key} className="p-4">
          <p className="text-caption font-medium uppercase tracking-wide text-muted-foreground">{t(`kpi.${item.key}`)}</p>
          <p className="mt-3 break-words text-h4 tabular-nums">{item.value}</p>
          {'hint' in item && item.hint && <p className="mt-1 text-caption text-muted-foreground">{item.hint}</p>}
        </Card>
      ))}
    </div>
  )
}
```

- [ ] **Step 5: Viết `InvestorProjectTable`**

Tạo `frontend/src/features/investor/components/InvestorProjectTable.tsx`:

```tsx
'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import type { InvestorProjectRow } from '../types/investor.types'
import { HEALTH_TEXT_CLASS, formatPercent, formatRatio } from './metricFormat'

/** Bảng dự án: tự cuộn ngang trong khung để trang 390px không bị tràn. */
export function InvestorProjectTable({ projects }: { projects: InvestorProjectRow[] }) {
  const t = useTranslations('investor')
  const locale = useLocale()
  const missing = <span className="text-muted-foreground" title={t('notEnoughDataHint')}>{t('notEnoughData')}</span>
  return (
    <Card flush className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-body-sm">
          <thead className="bg-muted/50 text-left text-caption uppercase text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">{t('table.project')}</th>
              <th scope="col" className="px-4 py-3 font-medium">{t('table.progress')}</th>
              <th scope="col" className="px-4 py-3 font-medium">{t('kpi.cpi')}</th>
              <th scope="col" className="px-4 py-3 font-medium">{t('kpi.spi')}</th>
              <th scope="col" className="px-4 py-3 font-medium">{t('kpi.roi')}</th>
              <th scope="col" className="px-4 py-3 font-medium">{t('table.health')}</th>
              <th scope="col" className="px-4 py-3 font-medium">{t('table.risk')}</th>
              <th scope="col" className="px-4 py-3 font-medium">{t('table.overdue')}</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-t">
                <th scope="row" className="px-4 py-3 text-left font-medium">
                  {project.name}
                  {project.exclusion_reason && (
                    <span className="ml-2 rounded bg-muted px-2 py-0.5 text-caption font-normal text-muted-foreground" title={t('excludedHint')}>
                      {t(`exclusion.${project.exclusion_reason}`)}
                    </span>
                  )}
                </th>
                <td className="px-4 py-3 tabular-nums">{Math.round(project.progress)}%</td>
                <td className="px-4 py-3 tabular-nums">{project.metrics.cpi === null ? missing : formatRatio(project.metrics.cpi, locale)}</td>
                <td className="px-4 py-3 tabular-nums">{project.metrics.spi === null ? missing : formatRatio(project.metrics.spi, locale)}</td>
                <td className="px-4 py-3 tabular-nums">{project.metrics.roi === null ? missing : formatPercent(project.metrics.roi, locale)}</td>
                <td className={cn('px-4 py-3 font-medium', HEALTH_TEXT_CLASS[project.metrics.health])}>{t(`health.${project.metrics.health}`)}</td>
                <td className="px-4 py-3">{project.risk_level ?? '—'}</td>
                <td className="px-4 py-3 tabular-nums">{project.overdue_tasks > 0 ? <span className="font-medium text-destructive">{project.overdue_tasks}</span> : '0'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
```

- [ ] **Step 6: Chạy test component**

Run: `npx vitest run src/features/investor`
Expected: PASS.

Nếu `formatRatio(1.25, 'vi')` cho ra chuỗi khác `1,25` trong môi trường Node của test, xem đầu ra thực tế và sửa giá trị mong đợi trong test cho khớp `Intl` của Node. Không đổi hàm format chỉ để test pass.

- [ ] **Step 7: Viết biểu đồ**

Tạo `frontend/src/features/investor/components/HealthDonut.tsx`:

```tsx
'use client'

import { useTranslations } from 'next-intl'
import { DonutChart } from '@/components/charts/DonutChart'
import type { HealthKey } from '../types/investor.types'
import { HEALTH_COLORS } from './metricFormat'

const ORDER: HealthKey[] = ['on_track', 'at_risk', 'off_track', 'unknown']

/** Phân bố sức khỏe dự án trong portfolio. */
export function HealthDonut({ distribution }: { distribution: Record<HealthKey, number> }) {
  const t = useTranslations('investor')
  const data = ORDER.map((key) => ({ name: t(`health.${key}`), value: distribution[key] ?? 0, color: HEALTH_COLORS[key] }))
  const total = data.reduce((sum, slice) => sum + slice.value, 0)
  return <DonutChart data={data} centerValue={total} summaryLabel={t('healthChart')} emptyLabel={t('empty')} />
}
```

Tạo `frontend/src/features/investor/components/BudgetVsEacChart.tsx`:

```tsx
'use client'

/**
 * BudgetVsEacChart – thanh ngang so sánh ngân sách (BAC) với chi phí dự báo (EAC)
 * theo dự án. Chỉ vẽ dự án được tính vào tổng (cùng tiền tệ, có ngân sách); có bảng
 * sr-only để thông tin không chỉ nằm trong hình.
 */
import { useTranslations } from 'next-intl'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartTooltip } from '@/components/charts/ChartTooltip'
import { animationProps, axisProps, chartColors, gridProps, usePrefersReducedMotion } from '@/components/charts/chartTheme'
import { formatMoney } from '@/lib/format'
import type { InvestorProjectRow } from '../types/investor.types'

export function BudgetVsEacChart({ projects, currency }: { projects: InvestorProjectRow[]; currency: string }) {
  const t = useTranslations('investor')
  const reducedMotion = usePrefersReducedMotion()
  const data = projects
    .filter((project) => !project.excluded_from_totals)
    .map((project) => ({ name: project.name, bac: project.metrics.bac ?? 0, eac: project.metrics.eac }))
  if (data.length === 0) return <p className="text-body-sm text-muted-foreground">{t('empty')}</p>
  // ChartTooltip truyền giá trị dạng number | string, nên ép về number trước khi định dạng.
  const money = (value: number | string) => formatMoney(Number(value), currency)
  return (
    <>
      <ResponsiveContainer width="100%" height={Math.max(160, data.length * 48)}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
          <CartesianGrid {...gridProps} horizontal={false} />
          <XAxis type="number" {...axisProps} tickFormatter={money} />
          <YAxis type="category" dataKey="name" width={120} {...axisProps} />
          <Tooltip content={<ChartTooltip valueFormatter={money} />} />
          <Legend />
          <Bar dataKey="bac" name={t('kpi.bac')} fill={chartColors.primary} radius={[0, 4, 4, 0]} {...animationProps(reducedMotion)} />
          <Bar dataKey="eac" name={t('kpi.eac')} fill={chartColors.warning} radius={[0, 4, 4, 0]} {...animationProps(reducedMotion)} />
        </BarChart>
      </ResponsiveContainer>
      <table className="sr-only">
        <caption>{t('budgetChart')}</caption>
        <tbody>{data.map((row) => <tr key={row.name}><th scope="row">{row.name}</th><td>{money(row.bac)}</td><td>{row.eac === null ? t('notEnoughData') : money(row.eac)}</td></tr>)}</tbody>
      </table>
    </>
  )
}
```

(`axisProps` chỉ chứa `tick`, `tickLine`, `axisLine`, nên spread được trên cả hai trục.)

- [ ] **Step 8: Viết layout và trang**

Tạo `frontend/src/app/(dashboard)/investor/layout.tsx`:

```tsx
'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { FullPageSpinner } from '@/components/common/FullPageSpinner'
import { useAuth } from '@/hooks/useAuth'
import { canViewInvestorPortal } from '@/lib/rbac'

export default function InvestorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user } = useAuth()
  const allowed = canViewInvestorPortal(user)

  // `(dashboard)/layout.tsx` đã đảm bảo đăng nhập; ở đây chỉ chặn thêm theo role.
  // Backend vẫn kiểm tra quyền xem từng portfolio.
  useEffect(() => {
    if (user && !allowed) router.replace('/dashboard')
  }, [user, allowed, router])

  if (!user || !allowed) return <FullPageSpinner />
  return <>{children}</>
}
```

Tạo `frontend/src/app/(dashboard)/investor/page.tsx`:

```tsx
'use client'

import { LineChart } from 'lucide-react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { EmptyState, ErrorState, LoadingState } from '@/components/common/PageState'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { formatRatio, HEALTH_TEXT_CLASS } from '@/features/investor/components/metricFormat'
import { useInvestorPortfolios } from '@/features/investor/hooks/useInvestor'
import { formatMoney } from '@/lib/format'
import { cn } from '@/lib/utils'
import { getApiErrorMessage } from '@/types/api.types'

export default function InvestorHomePage() {
  const t = useTranslations('investor')
  const locale = useLocale()
  const query = useInvestorPortfolios()
  if (query.isLoading) return <LoadingState variant="page" label={t('loading')} />
  if (query.isError || !query.data) return <ErrorState message={getApiErrorMessage(query.error, t('loadError'))} onRetry={() => void query.refetch()} />
  const items = query.data.items
  return (
    <div className="space-y-8">
      <PageHeader title={t('title')} description={t('description')} />
      {items.length === 0
        ? <EmptyState icon={LineChart} title={t('empty')} />
        : <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <Card key={item.id} as="article" interactive className="group">
                <h2 className="text-h4">
                  <Link href={`/investor/portfolios/${item.id}`} className="after:absolute after:inset-0 after:rounded-xl group-hover:text-primary focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring">{item.name}</Link>
                </h2>
                <p className="mt-1 text-caption text-muted-foreground">{t('projects', { count: item.project_count })}</p>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-body-sm">
                  <div><dt className="text-muted-foreground">{t('kpi.bac')}</dt><dd className="tabular-nums">{item.total_bac === null ? t('notEnoughData') : formatMoney(item.total_bac, item.currency)}</dd></div>
                  <div><dt className="text-muted-foreground">{t('kpi.ac')}</dt><dd className="tabular-nums">{formatMoney(item.total_ac, item.currency)}</dd></div>
                  <div><dt className="text-muted-foreground">{t('kpi.cpi')}</dt><dd className="tabular-nums">{item.cpi === null ? t('notEnoughData') : formatRatio(item.cpi, locale)}</dd></div>
                  <div><dt className="text-muted-foreground">{t('kpi.spi')}</dt><dd className="tabular-nums">{item.spi === null ? t('notEnoughData') : formatRatio(item.spi, locale)}</dd></div>
                </dl>
                <p className={cn('mt-4 text-body-sm font-medium', HEALTH_TEXT_CLASS[item.health])}>{t(`health.${item.health}`)}</p>
              </Card>
            ))}
          </div>}
    </div>
  )
}
```

Tạo `frontend/src/app/(dashboard)/investor/portfolios/[id]/page.tsx`:

```tsx
'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { ErrorState, LoadingState } from '@/components/common/PageState'
import { useBreadcrumbLabel } from '@/components/layout/Breadcrumbs'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { BudgetVsEacChart } from '@/features/investor/components/BudgetVsEacChart'
import { HealthDonut } from '@/features/investor/components/HealthDonut'
import { InvestorKpiRow } from '@/features/investor/components/InvestorKpiRow'
import { InvestorProjectTable } from '@/features/investor/components/InvestorProjectTable'
import { useInvestorPortfolio } from '@/features/investor/hooks/useInvestor'
import { useNumericParam } from '@/hooks/useNumericParam'
import { getApiErrorMessage } from '@/types/api.types'

export default function InvestorPortfolioPage() {
  const id = useNumericParam()
  const router = useRouter()
  const t = useTranslations('investor')
  const query = useInvestorPortfolio(id)
  const status = (query.error as { response?: { status?: number } } | null)?.response?.status
  useBreadcrumbLabel(`/investor/portfolios/${id}`, query.data?.portfolio.name)

  // Bị thu hồi quyền trong lúc đang xem: quay về danh sách kèm thông báo.
  useEffect(() => {
    if (status === 403) {
      toast.error(t('noAccess'))
      router.replace('/investor')
    }
  }, [status, router, t])

  if (query.isLoading) return <LoadingState variant="page" label={t('loading')} />
  if (query.isError || !query.data) return <ErrorState message={getApiErrorMessage(query.error, t('loadError'))} onRetry={() => void query.refetch()} />
  const { portfolio, totals, projects, health_distribution, overdue_projects } = query.data
  return (
    <div className="space-y-8">
      <Link href="/investor" className="-mb-4 inline-flex min-h-11 items-center gap-2 text-body-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" aria-hidden="true" />{t('backToList')}</Link>
      <PageHeader title={portfolio.name} description={portfolio.description ?? undefined} meta={<span className="text-caption text-muted-foreground">{t('overdueProjects')}: {overdue_projects}</span>} />
      <InvestorKpiRow totals={totals} currency={portfolio.currency} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card as="section" aria-labelledby="investor-health"><CardHeader className="mb-4"><CardTitle id="investor-health">{t('healthChart')}</CardTitle></CardHeader><HealthDonut distribution={health_distribution} /></Card>
        <Card as="section" aria-labelledby="investor-budget"><CardHeader className="mb-4"><CardTitle id="investor-budget">{t('budgetChart')}</CardTitle></CardHeader><BudgetVsEacChart projects={projects} currency={portfolio.currency} /></Card>
      </div>
      <InvestorProjectTable projects={projects} />
    </div>
  )
}
```

(Dự án dùng `sonner` cho thông báo, xem `frontend/src/lib/notify.ts`. Ở đây gọi `toast.error` trực tiếp vì thông điệp đã được dịch sẵn, không lấy từ lỗi API.)

- [ ] **Step 9: Kiểm tra**

Run:

```bash
npx vitest run src/features/investor "src/app/(dashboard)/investor"
npm run type-check
npm run lint
```

Expected: tất cả PASS, không lỗi.

- [ ] **Step 10: Commit**

```bash
git add frontend/src/features/investor "frontend/src/app/(dashboard)/investor"
git commit -m "feat(investor): trang cong nha dau tu voi KPI, bieu do va bang du an"
```

---

### Task 7: Quản lý investor trên trang portfolio và trường lợi ích kỳ vọng trong form dự án

**Files:**
- Create:
  - `frontend/src/features/investor/components/PortfolioInvestorsCard.tsx`
  - `frontend/src/features/investor/components/PortfolioInvestorsCard.test.tsx`
- Modify:
  - `frontend/src/app/(dashboard)/portfolios/[id]/page.tsx`
  - `frontend/src/features/projects/project.validation.ts`
  - `frontend/src/features/projects/components/ProjectForm.tsx`
  - `frontend/src/features/projects/components/ProjectWizard.tsx`
  - `frontend/src/types/project.types.ts`

**Interfaces:**
- Consumes: `usePortfolioInvestors`, `useGrantInvestor`, `useRevokeInvestor` (Task 5); `Modal`, `Button`, `Input`, `Label`, `Alert`, `Card`.
- Produces: `<PortfolioInvestorsCard portfolioId={number} />`; trường form `expected_benefit` (chuỗi trong form, `number | null` trong `ProjectCreate`/`ProjectUpdate`/`Project`).

- [ ] **Step 1: Viết test lỗi**

Tạo `frontend/src/features/investor/components/PortfolioInvestorsCard.test.tsx`:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import messages from '../../../../messages/vi.json'
import { PortfolioInvestorsCard } from './PortfolioInvestorsCard'

const api = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn(), delete: vi.fn() }))
vi.mock('@/services/api', () => ({ api }))

function setup() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <NextIntlClientProvider locale="vi" messages={messages}><PortfolioInvestorsCard portfolioId={7} /></NextIntlClientProvider>
    </QueryClientProvider>,
  )
}

const grant = { user_id: 3, full_name: 'Nhà đầu tư A', email: 'a@example.com', granted_at: '2026-10-16T08:00:00Z', granted_by_id: 1 }

beforeEach(() => vi.clearAllMocks())

describe('thẻ quản lý nhà đầu tư', () => {
  it('cấp quyền theo email', async () => {
    api.get.mockResolvedValue({ data: [] })
    api.post.mockResolvedValue({ data: grant })
    setup()
    await userEvent.type(await screen.findByLabelText('Email nhà đầu tư'), 'a@example.com')
    await userEvent.click(screen.getByRole('button', { name: 'Cấp quyền' }))
    expect(api.post).toHaveBeenCalledWith('/portfolios/7/investors', { email: 'a@example.com' })
  })

  it('thu hồi sau khi xác nhận', async () => {
    api.get.mockResolvedValue({ data: [grant] })
    api.delete.mockResolvedValue({})
    setup()
    await userEvent.click(await screen.findByRole('button', { name: 'Thu hồi' }))
    const dialog = await screen.findByRole('dialog')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Thu hồi' }))
    expect(api.delete).toHaveBeenCalledWith('/portfolios/7/investors/3')
  })
})
```

- [ ] **Step 2: Chạy test để thấy lỗi**

Run: `npx vitest run src/features/investor/components/PortfolioInvestorsCard.test.tsx`
Expected: FAIL vì không tìm thấy module.

- [ ] **Step 3: Viết component**

Tạo `frontend/src/features/investor/components/PortfolioInvestorsCard.tsx`:

```tsx
'use client'

import { useFormatter, useTranslations } from 'next-intl'
import { useState } from 'react'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Label } from '@/components/common/Label'
import { Modal } from '@/components/common/Modal'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { getApiErrorMessage } from '@/types/api.types'
import { useGrantInvestor, usePortfolioInvestors, useRevokeInvestor } from '../hooks/useInvestor'
import type { InvestorGrant } from '../types/investor.types'

/** Chủ portfolio hoặc admin cấp/thu hồi quyền xem chỉ đọc cho nhà đầu tư. */
export function PortfolioInvestorsCard({ portfolioId }: { portfolioId: number }) {
  const t = useTranslations('investor.grants')
  const format = useFormatter()
  const grants = usePortfolioInvestors(portfolioId, true)
  const grantMutation = useGrantInvestor(portfolioId)
  const revokeMutation = useRevokeInvestor(portfolioId)
  const [email, setEmail] = useState('')
  const [pending, setPending] = useState<InvestorGrant | null>(null)

  return (
    <Card as="section" aria-labelledby="portfolio-investors-title">
      <CardHeader className="mb-4">
        <CardTitle id="portfolio-investors-title" className="sm:text-h3">{t('title')}</CardTitle>
        <p className="text-body-sm text-muted-foreground">{t('description')}</p>
      </CardHeader>

      <form
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
        onSubmit={async (event) => {
          event.preventDefault()
          await grantMutation.mutateAsync(email.trim())
          setEmail('')
        }}
      >
        <div className="flex-1">
          <Label htmlFor="investor-email">{t('email')}</Label>
          <Input id="investor-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <Button type="submit" fullWidth={false} isLoading={grantMutation.isPending}>{t('grant')}</Button>
      </form>
      {grantMutation.isError && <Alert className="mt-3">{getApiErrorMessage(grantMutation.error)}</Alert>}

      {grants.data && grants.data.length === 0 && <p className="mt-4 text-body-sm text-muted-foreground">{t('empty')}</p>}
      {grants.data && grants.data.length > 0 && (
        <ul className="mt-4 divide-y">
          {grants.data.map((grant) => (
            <li key={grant.user_id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate font-medium">{grant.full_name}</p>
                <p className="truncate text-caption text-muted-foreground">{grant.email} · {t('grantedOn', { date: format.dateTime(new Date(grant.granted_at), { dateStyle: 'medium' }) })}</p>
              </div>
              <Button variant="outline" fullWidth={false} onClick={() => setPending(grant)}>{t('revoke')}</Button>
            </li>
          ))}
        </ul>
      )}

      <Modal open={pending !== null} onClose={() => setPending(null)} title={t('revoke')}>
        <p className="text-body">{pending && t('revokeConfirm', { name: pending.full_name })}</p>
        {revokeMutation.isError && <Alert className="mt-3">{getApiErrorMessage(revokeMutation.error)}</Alert>}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" fullWidth={false} onClick={() => setPending(null)}>{t('cancel')}</Button>
          <Button
            variant="destructive"
            fullWidth={false}
            isLoading={revokeMutation.isPending}
            onClick={async () => {
              if (!pending) return
              await revokeMutation.mutateAsync(pending.user_id)
              setPending(null)
            }}
          >
            {t('revoke')}
          </Button>
        </div>
      </Modal>
    </Card>
  )
}
```

- [ ] **Step 4: Gắn thẻ vào trang portfolio**

Trong `frontend/src/app/(dashboard)/portfolios/[id]/page.tsx`:
- Thêm import `import { PortfolioInvestorsCard } from '@/features/investor/components/PortfolioInvestorsCard'`.
- Thêm ngay trước `<section aria-labelledby="portfolio-projects-title">`:

```tsx
    {portfolio.capabilities.can_update && <PortfolioInvestorsCard portfolioId={portfolio.id} />}
```

- [ ] **Step 5: Thêm trường lợi ích kỳ vọng vào form dự án**

`frontend/src/types/project.types.ts`:
- Interface `Project`: thêm `expected_benefit: number | null` sau `budget_spent`.
- Interface `ProjectCreate`: thêm `expected_benefit?: number | null` sau `budget`.

`frontend/src/features/projects/project.validation.ts`: thêm sau `budget`:

```ts
    expected_benefit: z
      .string()
      .refine((value) => value === '' || (!Number.isNaN(Number(value)) && Number(value) >= 0), {
        message: 'Expected benefit must be zero or greater',
      }),
```

`frontend/src/features/projects/components/ProjectForm.tsx`:
- `defaultValues`: thêm `expected_benefit: project.expected_benefit?.toString() ?? '',`.
- Object gửi đi: thêm `expected_benefit: values.expected_benefit === '' ? null : Number(values.expected_benefit),`.
- Trong `ProjectFields`, đổi lưới chứa `Budget` và `Currency` thành `sm:grid-cols-3`, thêm ô sau ngay sau ô Budget:

```tsx
      <div><Label htmlFor="project-expected-benefit">Expected benefit</Label><Input id="project-expected-benefit" inputMode="decimal" hasError={Boolean(errors.expected_benefit)} {...register('expected_benefit')} />{errors.expected_benefit && <p id="project-expected-benefit-error" role="alert" className="mt-1 text-body-sm text-destructive">{errors.expected_benefit.message}</p>}</div>
```

(Nhãn đang hard-code tiếng Anh giống các ô khác trong form này. Giữ nguyên quy ước của tệp, không i18n riêng một ô.)

`frontend/src/features/projects/components/ProjectWizard.tsx`:
- `defaultValues` (dòng 30): thêm `expected_benefit: ''`.
- Object gửi đi (dòng 45): thêm `expected_benefit: values.expected_benefit === '' ? null : Number(values.expected_benefit),`.

Tìm các nơi khác dựng `ProjectFormValues` hoặc test có `defaultValues` dự án: `grep -rn "budget: ''" frontend/src`. Thêm `expected_benefit: ''` ở mỗi nơi để type-check không báo thiếu khóa.

- [ ] **Step 6: Kiểm tra**

Run:

```bash
npx vitest run
npm run type-check
npm run lint
npm run build
```

Expected: toàn bộ test frontend PASS (52 test cũ + test mới), type-check, lint và build đạt.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/features/investor/components/PortfolioInvestorsCard.tsx frontend/src/features/investor/components/PortfolioInvestorsCard.test.tsx "frontend/src/app/(dashboard)/portfolios/[id]/page.tsx" frontend/src/features/projects frontend/src/types/project.types.ts frontend/messages/en.json frontend/messages/vi.json
git commit -m "feat(investor): quan ly nha dau tu tren trang portfolio va truong loi ich ky vong"
```

---

### Task 8: Kiểm chứng trên trình duyệt và cập nhật tài liệu

**Files:**
- Modify:
  - `docs/roadmap/PHASE_5_DOCUMENT_AI_POLISH_MODULE.md`
  - `README.md`
  - `tasks/progress.md`
  - `docs/specs/system-architecture/srs.md`
  - `docs/superpowers/specs/2026-10-16-investor-dashboard-design.md` (trạng thái)

- [ ] **Step 1: Chạy stack cục bộ**

Bật docker compose theo memory "Docker local dev gotchas" (frontend Node 20, `NODE_ENV`, anon-volume). Chạy migration trong container backend: `alembic upgrade head`.

- [ ] **Step 2: Kiểm tra luồng bằng trình duyệt in-app**

Dùng tài khoản test cục bộ từ seed. Tạo một user role Investor nếu seed chưa có, và ghi thông tin đăng nhập vào tệp seed hoặc example-config, không ghi vào chat.

Kiểm tra lần lượt:
1. Chủ portfolio mở `/portfolios/{id}`, thấy thẻ "Nhà đầu tư", cấp quyền bằng email investor.
2. Đăng nhập investor: menu có "Cổng nhà đầu tư", `/investor` chỉ liệt kê portfolio vừa được cấp, trang chi tiết có KPI, hai biểu đồ, bảng dự án.
3. Chủ thu hồi quyền. Investor tải lại trang chi tiết thì bị đưa về `/investor` kèm thông báo.
4. User role PM không được cấp quyền: mở `/investor` thì bị chuyển về `/dashboard`.
5. Đổi ngôn ngữ EN/VI: không còn khóa i18n thô.
6. `resize_window` mobile (390px): không có thanh cuộn ngang toàn trang. Kiểm bằng `document.documentElement.scrollWidth <= window.innerWidth`.
7. `read_console_messages` không có lỗi.

Chụp ảnh màn hình trang chi tiết để làm bằng chứng.

- [ ] **Step 3: Cập nhật tài liệu**

- `docs/roadmap/PHASE_5_DOCUMENT_AI_POLISH_MODULE.md`:
  - Dòng "Investor Dashboard (Read-Only)" trong bảng tính năng chuyển sang "Hoàn thành", điền backend `InvestorService` + `/investor` và frontend `/investor`.
  - Mục "GIAI ĐOẠN 5.3" ghi trạng thái hoàn thành, kèm tóm tắt quyền theo portfolio và chỉ số EVM/ROI.
  - Cập nhật tỷ lệ tổng ở đầu tệp và dòng "Cập nhật lần cuối".
- `README.md`: cập nhật dòng Phase 5 và số router đang mount (thêm `investor`).
- `docs/specs/system-architecture/srs.md`: đổi mục "Investor Read-only Dashboard" từ chưa làm sang đã làm.
- `tasks/progress.md`: thêm mục ngày thực hiện, ghi số test backend/frontend thật và kết quả migration PostgreSQL (hoặc ghi rõ chưa kiểm).
- Spec: đổi "Trạng thái: Chờ duyệt" thành "Đã triển khai".

Tất cả không dùng emoji.

- [ ] **Step 4: Cập nhật đồ thị tri thức**

Run (từ gốc repo): `graphify update .`

- [ ] **Step 5: Kiểm tra cuối**

Run:

```bash
cd backend && .venv/Scripts/python -m pytest -q && .venv/Scripts/python -m ruff check app tests
cd ../frontend && npx vitest run && npm run type-check && npm run lint
git diff --check
```

Expected: tất cả đạt.

- [ ] **Step 6: Commit**

```bash
git add docs README.md tasks/progress.md graphify-out
git commit -m "docs: cap nhat trang thai Investor Dashboard (Phase 5, giai doan 5.3)"
```

Lưu ý: `graphify-out/` đã có thay đổi chưa commit từ trước khi bắt đầu plan này. Trước khi `git add graphify-out`, hỏi người dùng có muốn gộp chung không. Nếu không, bỏ `graphify-out` khỏi lệnh add.
