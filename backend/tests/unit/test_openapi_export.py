"""Xuất OpenAPI cho app di động: ổn định, đủ endpoint mới và không lệch file đã commit."""
import importlib.util
import json
from pathlib import Path

import pytest

SCRIPT = Path(__file__).resolve().parents[2] / "scripts" / "export_openapi.py"


@pytest.fixture(scope="module")
def exporter():
    spec = importlib.util.spec_from_file_location("export_openapi", SCRIPT)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_export_is_deterministic_and_contains_mobile_endpoints(exporter):
    first, second = exporter.render_openapi(), exporter.render_openapi()

    assert first == second
    assert first.endswith("\n")
    document = json.loads(first)
    assert {"/api/v1/devices", "/api/v1/devices/{token}", "/api/v1/app/config"} <= set(document["paths"])
    assert "MobileTokenResponse" in document["components"]["schemas"]


def test_committed_openapi_matches_the_api(exporter):
    """Đổi API mà quên chạy `python scripts/export_openapi.py` sẽ làm test này đỏ."""
    assert exporter.main(["--check"]) == 0


def test_check_fails_when_file_is_stale(exporter, tmp_path):
    stale = tmp_path / "openapi.json"
    stale.write_text("{}\n", encoding="utf-8")

    assert exporter.main(["--check", "--output", str(stale)]) == 1
    assert exporter.main(["--check", "--output", str(tmp_path / "missing.json")]) == 1


def test_export_writes_the_file(exporter, tmp_path):
    target = tmp_path / "nested" / "openapi.json"

    assert exporter.main(["--output", str(target)]) == 0
    assert target.read_text(encoding="utf-8") == exporter.render_openapi()
