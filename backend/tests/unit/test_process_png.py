"""Unit test B4: vẽ quy trình thành PNG phía server."""
import io

import pytest
from PIL import Image

from app.schemas.bpmn import ProcessModel
from app.services.documents import process_png
from app.services.documents.process_png import ProcessRenderError, render_process_png

LONG = "Kiểm tra và phê duyệt hồ sơ đề nghị thanh toán của khách hàng doanh nghiệp ưu tiên đặc biệt"


def build_model(extra_tasks: int = 0) -> ProcessModel:
    nodes = [
        {"id": "s", "type": "start_event", "name": "Bắt đầu", "lane_id": "kh"},
        {"id": "t1", "type": "task", "name": "Gửi yêu cầu đặt hàng", "lane_id": "kh"},
        {"id": "g1", "type": "exclusive_gateway", "name": "Hợp lệ?", "lane_id": "nv"},
        {"id": "t2", "type": "task", "name": LONG, "lane_id": "nv"},
        {"id": "p1", "type": "parallel_gateway", "name": "Tách song song", "lane_id": "nv"},
        {"id": "t3", "type": "task", "name": "Đóng gói", "lane_id": "kho"},
        {"id": "t4", "type": "task", "name": "Xuất hoá đơn", "lane_id": "nv"},
        {"id": "p2", "type": "parallel_gateway", "name": "Gộp", "lane_id": "nv"},
        {"id": "i1", "type": "intermediate_event", "name": "Chờ giao", "lane_id": "kho"},
        {"id": "e", "type": "end_event", "name": "Kết thúc", "lane_id": "kh"},
    ]
    flows = [
        {"id": "f1", "source": "s", "target": "t1"},
        {"id": "f2", "source": "t1", "target": "g1"},
        {"id": "f3", "source": "g1", "target": "t2", "label": "Hợp lệ"},
        {"id": "f4", "source": "g1", "target": "t1", "label": "Thiếu thông tin, yêu cầu bổ sung"},
        {"id": "f5", "source": "t2", "target": "p1"},
        {"id": "f6", "source": "p1", "target": "t3"},
        {"id": "f7", "source": "p1", "target": "t4"},
        {"id": "f8", "source": "t3", "target": "p2"},
        {"id": "f9", "source": "t4", "target": "p2"},
        {"id": "f10", "source": "p2", "target": "i1"},
    ]
    previous = "i1"
    for i in range(extra_tasks):
        nodes.append({"id": f"x{i}", "type": "task", "name": f"Bước bổ sung số {i}", "lane_id": "kho"})
        flows.append({"id": f"fx{i}", "source": previous, "target": f"x{i}"})
        previous = f"x{i}"
    flows.append({"id": "fend", "source": previous, "target": "e"})
    return ProcessModel.model_validate({
        "name": "Quy trình xử lý đơn hàng",
        "lanes": [{"id": "kh", "name": "Khách hàng"}, {"id": "nv", "name": "Nhân viên bán hàng"}, {"id": "kho", "name": "Bộ phận kho vận"}],
        "nodes": nodes,
        "flows": flows,
    })


def open_png(data: bytes) -> Image.Image:
    image = Image.open(io.BytesIO(data))
    image.load()
    return image


def test_renders_valid_png_with_lanes_gateways_loop_and_long_vietnamese_names():
    data = render_process_png(build_model())
    image = open_png(data)
    assert image.format == "PNG"
    assert 100 < image.width <= 2400 and 100 < image.height <= 1600
    # Ảnh không trắng trơn: có nhiều màu (lane, hình, chữ).
    assert len(image.convert("RGB").getcolors(maxcolors=1_000_000)) > 10


def test_large_process_is_scaled_down_within_limits():
    data = render_process_png(build_model(extra_tasks=60), max_width=1200, max_height=800)
    image = open_png(data)
    assert image.width <= 1200 and image.height <= 800


def test_vietnamese_font_available_on_this_machine_or_diacritics_stripped():
    # Có font tiếng Việt thì dùng; nếu không, hàm bỏ dấu phải cho ra chữ ASCII đọc được.
    assert process_png._strip_diacritics("Đặt hàng ưu tiên") == "Dat hang uu tien"
    render_process_png(build_model())  # cả hai nhánh đều không được ném lỗi


def test_render_without_vietnamese_font_falls_back(monkeypatch):
    monkeypatch.setattr(process_png, "_font_path", lambda: None)
    image = open_png(render_process_png(build_model()))
    assert image.width <= 2400


def test_internal_failure_raises_process_render_error(monkeypatch):
    def boom(*args, **kwargs):
        raise MemoryError("hết bộ nhớ")

    monkeypatch.setattr(process_png.Image, "new", boom)
    with pytest.raises(ProcessRenderError):
        render_process_png(build_model())
    with pytest.raises(ProcessRenderError):
        render_process_png(build_model(), max_width=10)
