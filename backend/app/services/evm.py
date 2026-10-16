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
