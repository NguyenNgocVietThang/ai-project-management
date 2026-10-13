"""Schema cấu trúc quy trình nghiệp vụ (BPMN rút gọn) và các hàm tiện ích thuần.

Cấu trúc này do AI sinh (B2), được vẽ thành SVG ở frontend (B3) và PNG để chèn
DOCX (B4). Vì output của model là input không tin cậy, schema kiểm tra chặt:

- `extra="forbid"` ở mọi cấp: key lạ bị từ chối thay vì lặng lẽ bỏ qua.
- Id duy nhất trên toàn bộ mô hình (lane, node, flow dùng chung một không gian
  tên) để renderer có thể dùng thẳng làm id phần tử SVG mà không đụng nhau.
- Flow trỏ node tồn tại, node trỏ lane tồn tại, không có flow tự vòng.
- Có ít nhất một start và một end; start không có flow vào, end không có flow ra.
- Mọi node đến được từ một start (không có node mồ côi) và từ mọi node đều đi
  được tới một end (không có ngõ cụt hay vòng lặp không lối ra).
- Trần kích thước để chống output AI phình to.

Quyết định thiết kế: nhánh ra của exclusive gateway thiếu nhãn điều kiện chỉ là
CẢNH BÁO (xem `lint_process_model`), không phải lỗi. Sơ đồ vẫn vẽ và đọc được,
còn từ chối sẽ buộc gọi lại AI tốn chi phí chỉ vì thiếu một chú thích.
"""

from collections import deque
from typing import Annotated, Any, Literal

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    StringConstraints,
    ValidationError,
    field_validator,
    model_validator,
)

from app.services.ai.parsing import AIResponseError, parse_json_object

# Trần kích thước: một quy trình nghiệp vụ đọc được trên một trang không cần hơn mức này.
MAX_LANES = 12
MAX_NODES = 80
MAX_FLOWS = 150

MAX_PROCESS_NAME_CHARS = 200
MAX_LANE_NAME_CHARS = 100
MAX_NODE_NAME_CHARS = 200
MAX_FLOW_LABEL_CHARS = 100

NodeType = Literal[
    "start_event",
    "end_event",
    "task",
    "exclusive_gateway",
    "parallel_gateway",
    "intermediate_event",
]

# Nhãn tiếng Việt cho từng loại node, dùng trong bảng các bước (DOCX dự phòng).
NODE_TYPE_LABELS: dict[str, str] = {
    "start_event": "Bắt đầu",
    "end_event": "Kết thúc",
    "task": "Công việc",
    "exclusive_gateway": "Rẽ nhánh (chọn một)",
    "parallel_gateway": "Song song",
    "intermediate_event": "Sự kiện trung gian",
}

# Id: bắt đầu bằng chữ cái, chỉ gồm chữ, số, gạch dưới, gạch ngang; an toàn làm id SVG.
ElementId = Annotated[
    str,
    StringConstraints(
        strip_whitespace=True, min_length=1, max_length=64, pattern=r"^[A-Za-z][A-Za-z0-9_\-]*$"
    ),
]


# Kiểu chuỗi tên: tự strip, không rỗng, giới hạn độ dài theo từng loại phần tử.
ProcessName = Annotated[
    str, StringConstraints(strip_whitespace=True, min_length=1, max_length=MAX_PROCESS_NAME_CHARS)
]
LaneName = Annotated[
    str, StringConstraints(strip_whitespace=True, min_length=1, max_length=MAX_LANE_NAME_CHARS)
]
NodeName = Annotated[
    str, StringConstraints(strip_whitespace=True, min_length=1, max_length=MAX_NODE_NAME_CHARS)
]


_STRICT = ConfigDict(extra="forbid")


class ProcessLane(BaseModel):
    """Một làn (swimlane) — vai trò hoặc bộ phận thực hiện các bước."""

    model_config = _STRICT

    id: ElementId
    name: LaneName


class ProcessNode(BaseModel):
    """Một nút trong quy trình: sự kiện, công việc hoặc cổng rẽ nhánh."""

    model_config = _STRICT

    id: ElementId
    type: NodeType
    name: NodeName
    lane_id: ElementId


class ProcessFlow(BaseModel):
    """Một luồng tuần tự từ node nguồn tới node đích, có thể mang nhãn điều kiện."""

    model_config = _STRICT

    id: ElementId
    source: ElementId
    target: ElementId
    label: str | None = Field(default=None, max_length=MAX_FLOW_LABEL_CHARS)

    @field_validator("label", mode="before")
    @classmethod
    def _normalize_label(cls, value: Any) -> Any:
        # Nhãn rỗng hoặc toàn khoảng trắng coi như không có nhãn.
        if isinstance(value, str):
            value = value.strip()
            return value or None
        return value


class ProcessModel(BaseModel):
    """Toàn bộ quy trình: làn, nút và luồng, đã kiểm tra tính toàn vẹn đồ thị."""

    model_config = _STRICT

    name: ProcessName
    lanes: list[ProcessLane] = Field(min_length=1, max_length=MAX_LANES)
    nodes: list[ProcessNode] = Field(min_length=2, max_length=MAX_NODES)
    flows: list[ProcessFlow] = Field(min_length=1, max_length=MAX_FLOWS)

    @model_validator(mode="after")
    def _check_graph(self) -> "ProcessModel":
        # 1. Id duy nhất trên toàn mô hình (lane, node, flow chung một không gian tên).
        seen: set[str] = set()
        for group, items in (("lane", self.lanes), ("node", self.nodes), ("flow", self.flows)):
            for item in items:
                if item.id in seen:
                    raise ValueError(f"Duplicate id '{item.id}' ({group})")
                seen.add(item.id)

        lane_ids = {lane.id for lane in self.lanes}
        node_by_id = {node.id: node for node in self.nodes}

        # 2. Node phải trỏ tới lane tồn tại.
        for node in self.nodes:
            if node.lane_id not in lane_ids:
                raise ValueError(f"Node '{node.id}' references unknown lane '{node.lane_id}'")

        # 3. Flow phải trỏ node tồn tại và không tự vòng về chính nó.
        for flow in self.flows:
            for end_name, ref in (("source", flow.source), ("target", flow.target)):
                if ref not in node_by_id:
                    raise ValueError(f"Flow '{flow.id}' {end_name} references unknown node '{ref}'")
            if flow.source == flow.target:
                raise ValueError(f"Flow '{flow.id}' must not loop back to the same node")

        # 4. Có ít nhất một start và một end.
        starts = [n.id for n in self.nodes if n.type == "start_event"]
        ends = [n.id for n in self.nodes if n.type == "end_event"]
        if not starts:
            raise ValueError("Process must have at least one start_event")
        if not ends:
            raise ValueError("Process must have at least one end_event")

        outgoing, incoming = _adjacency(self)

        # 5. Start không có flow vào, end không có flow ra.
        for node_id in starts:
            if incoming[node_id]:
                raise ValueError(f"start_event '{node_id}' must not have incoming flows")
        for node_id in ends:
            if outgoing[node_id]:
                raise ValueError(f"end_event '{node_id}' must not have outgoing flows")

        # 6. Mọi node đến được từ start (không có node mồ côi).
        reachable = _reach(starts, {k: [f.target for f in v] for k, v in outgoing.items()})
        orphans = [n.id for n in self.nodes if n.id not in reachable]
        if orphans:
            raise ValueError(f"Nodes not reachable from any start_event: {', '.join(orphans)}")

        # 7. Từ mọi node đều đi được tới một end (không có ngõ cụt / vòng lặp kín).
        can_finish = _reach(ends, {k: [f.source for f in v] for k, v in incoming.items()})
        dead_ends = [n.id for n in self.nodes if n.id not in can_finish]
        if dead_ends:
            raise ValueError(f"Nodes that cannot reach any end_event: {', '.join(dead_ends)}")

        return self


def _adjacency(
    model: ProcessModel,
) -> tuple[dict[str, list[ProcessFlow]], dict[str, list[ProcessFlow]]]:
    """Danh sách flow ra/vào theo node, giữ nguyên thứ tự khai báo của flows."""
    outgoing: dict[str, list[ProcessFlow]] = {n.id: [] for n in model.nodes}
    incoming: dict[str, list[ProcessFlow]] = {n.id: [] for n in model.nodes}
    for flow in model.flows:
        outgoing[flow.source].append(flow)
        incoming[flow.target].append(flow)
    return outgoing, incoming


def _reach(roots: list[str], edges: dict[str, list[str]]) -> set[str]:
    """Tập node đến được từ các gốc theo cạnh cho trước (BFS)."""
    visited = set(roots)
    queue = deque(roots)
    while queue:
        current = queue.popleft()
        for nxt in edges.get(current, []):
            if nxt not in visited:
                visited.add(nxt)
                queue.append(nxt)
    return visited


def lint_process_model(model: ProcessModel) -> list[str]:
    """Các cảnh báo không chặn (mô hình vẫn hợp lệ và vẽ được).

    - Exclusive gateway có >= 2 nhánh ra nhưng có nhánh thiếu nhãn điều kiện.
    - Lane không chứa node nào.
    """
    warnings: list[str] = []
    outgoing, _ = _adjacency(model)
    for node in model.nodes:
        if node.type != "exclusive_gateway":
            continue
        branches = outgoing[node.id]
        if len(branches) >= 2:
            unlabeled = [f.id for f in branches if not f.label]
            if unlabeled:
                warnings.append(
                    f"Exclusive gateway '{node.id}' has unlabeled branches: {', '.join(unlabeled)}"
                )
    used_lanes = {n.lane_id for n in model.nodes}
    for lane in model.lanes:
        if lane.id not in used_lanes:
            warnings.append(f"Lane '{lane.id}' has no nodes")
    return warnings


def process_steps_table(model: ProcessModel) -> list[dict[str, Any]]:
    """Bảng các bước tuần tự, dùng làm dự phòng trong DOCX khi vẽ sơ đồ lỗi.

    Duyệt BFS từ các start theo thứ tự khai báo node; nhánh ra theo thứ tự khai
    báo flow, nên kết quả ổn định với cùng một input. Mỗi dòng gồm: `order` (bắt
    đầu từ 1), `node_id`, `lane`, `step`, `type`, `type_label`, `next` (chuỗi
    các bước tiếp theo, kèm nhãn điều kiện trong ngoặc vuông, ngăn cách bằng "; ").
    """
    lane_names = {lane.id: lane.name for lane in model.lanes}
    node_by_id = {node.id: node for node in model.nodes}
    outgoing, _ = _adjacency(model)

    starts = [n.id for n in model.nodes if n.type == "start_event"]
    visited = set(starts)
    queue = deque(starts)
    ordered: list[str] = []
    while queue:
        current = queue.popleft()
        ordered.append(current)
        for flow in outgoing[current]:
            if flow.target not in visited:
                visited.add(flow.target)
                queue.append(flow.target)

    rows: list[dict[str, Any]] = []
    for index, node_id in enumerate(ordered, start=1):
        node = node_by_id[node_id]
        next_parts = []
        for flow in outgoing[node_id]:
            target_name = node_by_id[flow.target].name
            next_parts.append(f"{target_name} [{flow.label}]" if flow.label else target_name)
        rows.append(
            {
                "order": index,
                "node_id": node.id,
                "lane": lane_names[node.lane_id],
                "step": node.name,
                "type": node.type,
                "type_label": NODE_TYPE_LABELS[node.type],
                "next": "; ".join(next_parts),
            }
        )
    return rows


def parse_process_model(raw: str | dict[str, Any]) -> ProcessModel:
    """Parse output của model thành `ProcessModel`, mọi lỗi quy về `AIResponseError`.

    Chuỗi được trích xuất JSON object qua `parse_json_object` (chịu được rào
    ```json và câu dẫn nhập). Lỗi schema được tóm tắt ngắn gọn để B2 coi là lỗi
    provider và có thể thử lại.
    """
    data: Any = parse_json_object(raw) if isinstance(raw, str) else raw
    if not isinstance(data, dict):
        raise AIResponseError("Process model must be a JSON object")
    try:
        return ProcessModel.model_validate(data)
    except ValidationError as exc:
        details = []
        for err in exc.errors()[:5]:
            loc = ".".join(str(part) for part in err["loc"]) or "<root>"
            details.append(f"{loc}: {err['msg']}")
        more = exc.error_count() - len(details)
        suffix = f" (+{more} more)" if more > 0 else ""
        raise AIResponseError(f"Invalid process model: {'; '.join(details)}{suffix}") from exc
