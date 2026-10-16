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
