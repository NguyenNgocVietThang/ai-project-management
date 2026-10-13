"""Vẽ sơ đồ quy trình (`ProcessModel`) thành ảnh PNG phía server để chèn vào DOCX (B4).

Hàm thuần, không I/O mạng; chỉ đọc tệp font hệ thống (nếu có). Bố cục:

- Mỗi lane là một dải ngang có nhãn ở cột bên trái.
- Cột của node theo hạng BFS từ các start: node được thăm lần đầu có hạng = hạng
  nguồn + 1; cạnh ngược (vòng lặp) trỏ về node đã thăm nên không làm tăng hạng.
- Nhiều node cùng (lane, hạng) xếp chồng theo chiều dọc trong lane.
- Hình: sự kiện tròn (end viền dày, sự kiện trung gian viền đôi), công việc là chữ
  nhật bo góc, gateway hình thoi có dấu X (exclusive) hoặc + (parallel).
- Cạnh tiến vẽ thẳng/gấp khúc từ phải nguồn sang trái đích; cạnh ngược đi vòng
  bên dưới hai node. Nhãn flow đặt gần đầu cạnh.

Để giới hạn bộ nhớ (Render Free 512 MB), ảnh được vẽ trực tiếp ở tỉ lệ đã thu nhỏ
thay vì vẽ to rồi resize; kích thước cuối luôn <= max_width x max_height.

Font: ưu tiên font TTF hệ thống có glyph tiếng Việt (DejaVu Sans trên Linux,
Arial/Segoe UI/Tahoma/DejaVu trên Windows). Nếu không tìm thấy, dùng font mặc
định của Pillow (không có glyph tiếng Việt) và bỏ dấu để chữ vẫn đọc được.
"""

from __future__ import annotations

import io
import math
import os
import unicodedata
from collections import deque
from dataclasses import dataclass
from functools import lru_cache

from PIL import Image, ImageDraw, ImageFont

from app.schemas.bpmn import ProcessModel

# Kích thước gốc (trước khi thu nhỏ), đơn vị pixel.
_LANE_LABEL_W = 150
_TITLE_H = 48
_COL_W = 210
_ROW_H = 110
_TASK_W = 160
_TASK_H = 66
_EVENT_D = 44
_GATEWAY_D = 56
_PAD = 24
_FONT_SIZE = 14
_LABEL_FONT_SIZE = 12
_TITLE_FONT_SIZE = 20
_MIN_FONT_SIZE = 7
_MAX_TEXT_LINES = 3

_FONT_CANDIDATES: tuple[str, ...] = (
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/TTF/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    "/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf",
    "/Library/Fonts/Arial.ttf",
    "DejaVuSans.ttf",
    "arial.ttf",
    "segoeui.ttf",
    "tahoma.ttf",
)

_COLORS = {
    "bg": (255, 255, 255),
    "lane_a": (246, 248, 252),
    "lane_b": (255, 255, 255),
    "lane_border": (170, 178, 192),
    "lane_label_bg": (226, 232, 242),
    "text": (30, 34, 42),
    "stroke": (55, 65, 81),
    "task_fill": (232, 241, 255),
    "event_fill": (236, 250, 240),
    "end_fill": (253, 236, 236),
    "gateway_fill": (255, 247, 222),
    "edge": (75, 85, 99),
    "edge_label": (90, 60, 10),
}


class ProcessRenderError(RuntimeError):
    """Không vẽ được sơ đồ quy trình; nơi gọi chuyển sang bảng các bước."""


@lru_cache(maxsize=1)
def _font_path() -> str | None:
    """Đường dẫn font TTF đầu tiên có glyph tiếng Việt, hoặc None nếu không có."""
    windir = os.environ.get("WINDIR")
    candidates = list(_FONT_CANDIDATES)
    if windir:
        candidates += [os.path.join(windir, "Fonts", name) for name in ("DejaVuSans.ttf", "arial.ttf", "segoeui.ttf")]
    for candidate in candidates:
        try:
            font = ImageFont.truetype(candidate, 16)
        except OSError:
            continue
        if _has_vietnamese_glyphs(font):
            return candidate
    return None


def _has_vietnamese_glyphs(font: ImageFont.FreeTypeFont) -> bool:
    # So sánh mặt nạ glyph với glyph "không có" (ký tự ở vùng riêng dành riêng).
    missing = bytes(font.getmask("\U000f0000"))
    return all(bytes(font.getmask(ch)) != missing for ch in "ạươđẫỹ")


def supports_vietnamese() -> bool:
    """True nếu tìm được font TTF hiển thị đầy đủ tiếng Việt có dấu."""
    return _font_path() is not None


def _load_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    path = _font_path()
    if path is not None:
        return ImageFont.truetype(path, size)
    return ImageFont.load_default(size=size)


def _strip_diacritics(text: str) -> str:
    # Dùng khi không có font tiếng Việt: bỏ dấu để không hiện ô vuông.
    text = text.replace("đ", "d").replace("Đ", "D")
    decomposed = unicodedata.normalize("NFD", text)
    return "".join(ch for ch in decomposed if not unicodedata.combining(ch))


@dataclass
class _Box:
    cx: float
    cy: float
    w: float
    h: float

    @property
    def left(self) -> float:
        return self.cx - self.w / 2

    @property
    def right(self) -> float:
        return self.cx + self.w / 2

    @property
    def top(self) -> float:
        return self.cy - self.h / 2

    @property
    def bottom(self) -> float:
        return self.cy + self.h / 2


def _ranks(model: ProcessModel) -> dict[str, int]:
    """Hạng BFS từ các start; cạnh trỏ về node đã thăm (vòng lặp) không đổi hạng."""
    outgoing: dict[str, list[str]] = {n.id: [] for n in model.nodes}
    for flow in model.flows:
        outgoing[flow.source].append(flow.target)
    starts = [n.id for n in model.nodes if n.type == "start_event"]
    rank = {node_id: 0 for node_id in starts}
    queue = deque(starts)
    while queue:
        current = queue.popleft()
        for target in outgoing[current]:
            if target not in rank:
                rank[target] = rank[current] + 1
                queue.append(target)
    # Phòng thủ: node không đến được (schema đã chặn) đặt sau cùng.
    last = max(rank.values(), default=0) + 1
    for node in model.nodes:
        rank.setdefault(node.id, last)
    return rank


def _wrap(draw: ImageDraw.ImageDraw, text: str, font, max_width: float, max_lines: int) -> list[str]:
    """Ngắt dòng theo từ cho vừa chiều rộng; cắt bớt và thêm dấu ba chấm nếu quá số dòng."""
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        # Từ quá dài: cắt theo ký tự.
        while draw.textlength(word, font=font) > max_width and len(word) > 1:
            cut = len(word)
            while cut > 1 and draw.textlength(word[:cut], font=font) > max_width:
                cut -= 1
            if current:
                lines.append(current)
                current = ""
            lines.append(word[:cut])
            word = word[cut:]
        candidate = f"{current} {word}".strip()
        if draw.textlength(candidate, font=font) <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    if len(lines) > max_lines:
        lines = lines[:max_lines]
        last = lines[-1]
        while last and draw.textlength(last + "…", font=font) > max_width:
            last = last[:-1]
        lines[-1] = last.rstrip() + "…"
    return lines or [""]


def render_process_png(model: ProcessModel, *, max_width: int = 2400, max_height: int = 1600) -> bytes:
    """Vẽ quy trình thành PNG (bytes). Ném `ProcessRenderError` nếu không vẽ được."""
    if max_width < 100 or max_height < 100:
        raise ProcessRenderError("Kích thước tối đa của ảnh quá nhỏ")
    try:
        return _render(model, max_width, max_height)
    except ProcessRenderError:
        raise
    except Exception as exc:  # Mọi lỗi vẽ quy về một loại để nơi gọi dùng bảng dự phòng.
        raise ProcessRenderError(f"Không vẽ được sơ đồ quy trình: {exc}") from exc


def _render(model: ProcessModel, max_width: int, max_height: int) -> bytes:
    vietnamese = supports_vietnamese()
    label = (lambda s: s) if vietnamese else _strip_diacritics

    rank = _ranks(model)
    lane_index = {lane.id: i for i, lane in enumerate(model.lanes)}
    # Số node xếp chồng tại mỗi ô (lane, hạng) và vị trí của từng node trong ô.
    slot: dict[str, int] = {}
    cell_count: dict[tuple[int, int], int] = {}
    for node in model.nodes:
        key = (lane_index[node.lane_id], rank[node.id])
        slot[node.id] = cell_count.get(key, 0)
        cell_count[key] = slot[node.id] + 1
    rows_per_lane = [1] * len(model.lanes)
    for (lane_i, _), count in cell_count.items():
        rows_per_lane[lane_i] = max(rows_per_lane[lane_i], count)

    columns = max(rank.values()) + 1
    natural_w = _LANE_LABEL_W + columns * _COL_W + _PAD
    lanes_h = sum(rows_per_lane) * _ROW_H
    natural_h = _TITLE_H + lanes_h + _PAD

    scale = min(1.0, max_width / natural_w, max_height / natural_h)
    width = max(1, min(max_width, math.ceil(natural_w * scale)))
    height = max(1, min(max_height, math.ceil(natural_h * scale)))

    def s(value: float) -> float:
        return value * scale

    def font_of(size: int):
        return _load_font(max(_MIN_FONT_SIZE, round(size * scale)))

    font = font_of(_FONT_SIZE)
    small = font_of(_LABEL_FONT_SIZE)
    title_font = font_of(_TITLE_FONT_SIZE)
    line_w = max(1, round(2 * scale))

    image = Image.new("RGB", (width, height), _COLORS["bg"])
    draw = ImageDraw.Draw(image)

    # Tiêu đề quy trình.
    title = _wrap(draw, label(model.name), title_font, width - s(2 * _PAD), 1)[0]
    draw.text((s(_PAD), s(_TITLE_H / 2)), title, fill=_COLORS["text"], font=title_font, anchor="lm")

    # Dải lane và nhãn lane.
    lane_top: list[float] = []
    y = _TITLE_H
    for i, lane in enumerate(model.lanes):
        lane_top.append(y)
        h = rows_per_lane[i] * _ROW_H
        fill = _COLORS["lane_a"] if i % 2 == 0 else _COLORS["lane_b"]
        draw.rectangle([s(0), s(y), width - 1, s(y + h)], fill=fill, outline=_COLORS["lane_border"], width=1)
        draw.rectangle([s(0), s(y), s(_LANE_LABEL_W), s(y + h)], fill=_COLORS["lane_label_bg"], outline=_COLORS["lane_border"], width=1)
        lines = _wrap(draw, label(lane.name), font, s(_LANE_LABEL_W - 16), 4)
        _draw_lines(draw, lines, s(_LANE_LABEL_W / 2), s(y + h / 2), font)
        y += h

    # Vị trí từng node (toạ độ gốc, sẽ nhân tỉ lệ khi vẽ).
    boxes: dict[str, _Box] = {}
    for node in model.nodes:
        li = lane_index[node.lane_id]
        cx = _LANE_LABEL_W + rank[node.id] * _COL_W + _COL_W / 2
        cy = lane_top[li] + slot[node.id] * _ROW_H + _ROW_H / 2
        if node.type == "task":
            w, h = _TASK_W, _TASK_H
        elif node.type in ("exclusive_gateway", "parallel_gateway"):
            w = h = _GATEWAY_D
        else:
            w = h = _EVENT_D
        boxes[node.id] = _Box(s(cx), s(cy), s(w), s(h))

    # Cạnh vẽ trước để node phủ lên đầu/cuối đường.
    node_type = {n.id: n.type for n in model.nodes}
    for flow in model.flows:
        src, dst = boxes[flow.source], boxes[flow.target]
        if dst.left >= src.right:
            mid_x = (src.right + dst.left) / 2
            points = [(src.right, src.cy), (mid_x, src.cy), (mid_x, dst.cy), (dst.left, dst.cy)]
            label_at = (src.right + 4 * scale, src.cy - 4 * scale)
        else:
            # Cạnh ngược hoặc cùng cột: đi vòng phía dưới hai node.
            route_y = max(src.bottom, dst.bottom) + s(18)
            points = [(src.cx, src.bottom), (src.cx, route_y), (dst.cx, route_y), (dst.cx, dst.bottom)]
            label_at = (min(src.cx, dst.cx) + 6 * scale, route_y + 2 * scale)
        draw.line(points, fill=_COLORS["edge"], width=line_w, joint="curve")
        _arrow_head(draw, points[-2], points[-1], s(9))
        if flow.label:
            text = _wrap(draw, label(flow.label), small, s(_COL_W - 30), 1)[0]
            anchor = "lb" if dst.left >= src.right else "lt"
            bbox = draw.textbbox(label_at, text, font=small, anchor=anchor)
            draw.rectangle(bbox, fill=_COLORS["bg"])
            draw.text(label_at, text, fill=_COLORS["edge_label"], font=small, anchor=anchor)

    # Node.
    for node in model.nodes:
        box = boxes[node.id]
        kind = node_type[node.id]
        name = label(node.name)
        if kind == "task":
            draw.rounded_rectangle([box.left, box.top, box.right, box.bottom], radius=s(10), fill=_COLORS["task_fill"], outline=_COLORS["stroke"], width=line_w)
            lines = _wrap(draw, name, font, box.w - s(12), _MAX_TEXT_LINES)
            _draw_lines(draw, lines, box.cx, box.cy, font)
            continue
        if kind in ("exclusive_gateway", "parallel_gateway"):
            diamond = [(box.cx, box.top), (box.right, box.cy), (box.cx, box.bottom), (box.left, box.cy)]
            draw.polygon(diamond, fill=_COLORS["gateway_fill"], outline=_COLORS["stroke"], width=line_w)
            m = box.w * 0.2
            mark_w = max(1, round(3 * scale))
            if kind == "exclusive_gateway":
                draw.line([(box.cx - m, box.cy - m), (box.cx + m, box.cy + m)], fill=_COLORS["stroke"], width=mark_w)
                draw.line([(box.cx - m, box.cy + m), (box.cx + m, box.cy - m)], fill=_COLORS["stroke"], width=mark_w)
            else:
                draw.line([(box.cx - m * 1.3, box.cy), (box.cx + m * 1.3, box.cy)], fill=_COLORS["stroke"], width=mark_w)
                draw.line([(box.cx, box.cy - m * 1.3), (box.cx, box.cy + m * 1.3)], fill=_COLORS["stroke"], width=mark_w)
        else:
            outline_w = max(2, round(5 * scale)) if kind == "end_event" else line_w
            fill = _COLORS["end_fill"] if kind == "end_event" else _COLORS["event_fill"]
            draw.ellipse([box.left, box.top, box.right, box.bottom], fill=fill, outline=_COLORS["stroke"], width=outline_w)
            if kind == "intermediate_event":
                inset = s(4)
                draw.ellipse([box.left + inset, box.top + inset, box.right - inset, box.bottom - inset], outline=_COLORS["stroke"], width=line_w)
        # Tên sự kiện/gateway đặt dưới hình.
        lines = _wrap(draw, name, small, s(_COL_W - 20), 2)
        line_h = _line_height(small)
        _draw_lines(draw, lines, box.cx, box.bottom + s(4) + line_h * len(lines) / 2, small)

    buffer = io.BytesIO()
    image.save(buffer, format="PNG", optimize=True)
    return buffer.getvalue()


def _line_height(font) -> float:
    left, top, right, bottom = font.getbbox("ÀgẤ")
    return (bottom - top) * 1.2


def _draw_lines(draw: ImageDraw.ImageDraw, lines: list[str], cx: float, cy: float, font) -> None:
    """Vẽ các dòng chữ căn giữa quanh tâm (cx, cy)."""
    line_h = _line_height(font)
    start = cy - line_h * (len(lines) - 1) / 2
    for i, line in enumerate(lines):
        draw.text((cx, start + i * line_h), line, fill=_COLORS["text"], font=font, anchor="mm")


def _arrow_head(draw: ImageDraw.ImageDraw, start: tuple[float, float], end: tuple[float, float], size: float) -> None:
    angle = math.atan2(end[1] - start[1], end[0] - start[0])
    spread = math.radians(25)
    left = (end[0] - size * math.cos(angle - spread), end[1] - size * math.sin(angle - spread))
    right = (end[0] - size * math.cos(angle + spread), end[1] - size * math.sin(angle + spread))
    draw.polygon([end, left, right], fill=_COLORS["edge"])
