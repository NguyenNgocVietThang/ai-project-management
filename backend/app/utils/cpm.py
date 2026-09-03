"""
Thuật toán Critical Path Method (CPM)
-------------------------------------
Topological Sort (thuật toán Kahn) + Forward Pass + Backward Pass.

Hỗ trợ cả 4 loại dependency mà `app.models.dependency.Dependency` dùng
(FS, SS, FF, SF) với lag dương/âm (lead time), nhiều node bắt đầu/kết thúc
và các đồ thị con rời nhau.

Cách dùng (thuật toán thuần, không phụ thuộc framework):

    nodes = {
        1: CPMNode(id=1, duration=3),
        2: CPMNode(id=2, duration=5),
    }
    edges = [CPMEdge(predecessor_id=1, successor_id=2, dependency_type="FS", lag_days=0)]
    result = run_cpm(nodes, edges)
    result.critical_path   # -> [1, 2]
    result.project_duration  # -> 8.0

Cách dùng (trực tiếp từ các bản ghi ORM):

    result = compute_cpm_for_project(tasks, dependencies)
    for task_id, node in result.nodes.items():
        ...  # node.early_start, node.late_finish, node.is_critical, ...
"""
from dataclasses import dataclass, field
from datetime import date, timedelta
from typing import Dict, Iterable, List, Optional, Tuple

# Các hằng số loại dependency (giữ dạng chuỗi thuần để module này không phụ
# thuộc cứng vào ORM / các lớp enum và vẫn dễ dàng viết test).
FS = "FS"  # Finish-to-Start  (successor bắt đầu sau khi predecessor kết thúc)
SS = "SS"  # Start-to-Start   (successor bắt đầu sau khi predecessor bắt đầu)
FF = "FF"  # Finish-to-Finish (successor kết thúc sau khi predecessor kết thúc)
SF = "SF"  # Start-to-Finish  (successor kết thúc sau khi predecessor bắt đầu)

VALID_DEPENDENCY_TYPES = {FS, SS, FF, SF}


@dataclass
class CPMNode:
    id: int
    duration: float  # tính bằng ngày, phải >= 0
    name: Optional[str] = None
    successors: List[int] = field(default_factory=list)
    predecessors: List[int] = field(default_factory=list)

    early_start: float = 0.0
    early_finish: float = 0.0
    late_start: float = 0.0
    late_finish: float = 0.0
    float_days: float = 0.0
    is_critical: bool = False


@dataclass
class CPMEdge:
    predecessor_id: int
    successor_id: int
    dependency_type: str = FS
    lag_days: float = 0.0


@dataclass
class CPMResult:
    nodes: Dict[int, CPMNode]
    order: List[int]
    critical_path: List[int]
    project_duration: float


FLOAT_EPSILON = 1e-6


def _normalize_type(dependency_type: str) -> str:
    dep_type = (dependency_type or FS).upper()
    if dep_type not in VALID_DEPENDENCY_TYPES:
        raise ValueError(f"Unknown dependency type: {dependency_type!r}")
    return dep_type


def build_graph(
    tasks: Iterable[Tuple[int, float]],
    edges: Iterable[CPMEdge],
) -> Dict[int, CPMNode]:
    """
    Dựng đồ thị node từ các cặp (task_id, duration) và một danh sách edge.
    Ném ValueError nếu một edge tham chiếu đến task id không tồn tại.
    """
    nodes: Dict[int, CPMNode] = {tid: CPMNode(id=tid, duration=max(0.0, dur)) for tid, dur in tasks}

    for edge in edges:
        if edge.predecessor_id not in nodes:
            raise ValueError(f"Dependency references unknown task id: {edge.predecessor_id}")
        if edge.successor_id not in nodes:
            raise ValueError(f"Dependency references unknown task id: {edge.successor_id}")
        if edge.predecessor_id == edge.successor_id:
            raise ValueError(f"Task {edge.predecessor_id} cannot depend on itself")

        _normalize_type(edge.dependency_type)
        nodes[edge.predecessor_id].successors.append(edge.successor_id)
        nodes[edge.successor_id].predecessors.append(edge.predecessor_id)

    return nodes


def topological_sort(nodes: Dict[int, CPMNode]) -> List[int]:
    """Thuật toán Kahn cho topological sort. Ném ValueError nếu có chu trình."""
    in_degree: Dict[int, int] = {nid: 0 for nid in nodes}
    for node in nodes.values():
        for succ_id in node.successors:
            in_degree[succ_id] += 1

    queue: List[int] = sorted(nid for nid, deg in in_degree.items() if deg == 0)
    order: List[int] = []

    while queue:
        nid = queue.pop(0)
        order.append(nid)
        for succ_id in sorted(nodes[nid].successors):
            in_degree[succ_id] -= 1
            if in_degree[succ_id] == 0:
                queue.append(succ_id)

    if len(order) != len(nodes):
        remaining = sorted(set(nodes) - set(order))
        raise ValueError(f"Cycle detected in task dependencies (involves task ids: {remaining})")
    return order


def _edges_by_successor(edges: List[CPMEdge]) -> Dict[int, List[CPMEdge]]:
    by_succ: Dict[int, List[CPMEdge]] = {}
    for edge in edges:
        by_succ.setdefault(edge.successor_id, []).append(edge)
    return by_succ


def _edges_by_predecessor(edges: List[CPMEdge]) -> Dict[int, List[CPMEdge]]:
    by_pred: Dict[int, List[CPMEdge]] = {}
    for edge in edges:
        by_pred.setdefault(edge.predecessor_id, []).append(edge)
    return by_pred


def forward_pass(nodes: Dict[int, CPMNode], order: List[int], edges: List[CPMEdge]) -> None:
    """
    Tính Early Start (ES) và Early Finish (EF) cho từng node,
    tôn trọng loại dependency và lag/lead time của mỗi edge đi vào.
    """
    incoming = _edges_by_successor(edges)

    for nid in order:
        node = nodes[nid]
        node_edges = incoming.get(nid, [])

        if not node_edges:
            node.early_start = 0.0
        else:
            candidates: List[float] = []
            for edge in node_edges:
                pred = nodes[edge.predecessor_id]
                dep_type = _normalize_type(edge.dependency_type)
                lag = edge.lag_days

                if dep_type == FS:
                    candidates.append(pred.early_finish + lag)
                elif dep_type == SS:
                    candidates.append(pred.early_start + lag)
                elif dep_type == FF:
                    candidates.append(pred.early_finish + lag - node.duration)
                elif dep_type == SF:
                    candidates.append(pred.early_start + lag - node.duration)
            node.early_start = max(0.0, max(candidates))

        node.early_finish = node.early_start + node.duration


def backward_pass(nodes: Dict[int, CPMNode], order: List[int], edges: List[CPMEdge]) -> None:
    """
    Tính Late Start (LS), Late Finish (LF) và Total Float cho từng node,
    tôn trọng loại dependency và lag/lead time của mỗi edge đi ra.
    Phải chạy sau `forward_pass`.
    """
    outgoing = _edges_by_predecessor(edges)
    project_duration = max((n.early_finish for n in nodes.values()), default=0.0)

    for nid in reversed(order):
        node = nodes[nid]
        node_edges = outgoing.get(nid, [])

        if not node_edges:
            node.late_finish = project_duration
        else:
            candidates: List[float] = []
            for edge in node_edges:
                succ = nodes[edge.successor_id]
                dep_type = _normalize_type(edge.dependency_type)
                lag = edge.lag_days

                if dep_type == FS:
                    candidates.append(succ.late_start - lag)
                elif dep_type == SS:
                    candidates.append(succ.late_start - lag + node.duration)
                elif dep_type == FF:
                    candidates.append(succ.late_finish - lag)
                elif dep_type == SF:
                    candidates.append(succ.late_finish - lag + node.duration)
            node.late_finish = min(candidates)

        node.late_start = node.late_finish - node.duration
        node.float_days = node.late_start - node.early_start
        node.is_critical = abs(node.float_days) < FLOAT_EPSILON


def run_cpm(nodes: Dict[int, CPMNode], edges: List[CPMEdge]) -> CPMResult:
    """
    Chạy toàn bộ phân tích CPM (topological sort + forward pass + backward
    pass) trên đồ thị node và danh sách edge đã dựng sẵn.
    """
    order = topological_sort(nodes)
    forward_pass(nodes, order, edges)
    backward_pass(nodes, order, edges)

    critical_path = [nid for nid in order if nodes[nid].is_critical]
    project_duration = max((n.early_finish for n in nodes.values()), default=0.0)

    return CPMResult(nodes=nodes, order=order, critical_path=critical_path, project_duration=project_duration)


def compute_cpm(nodes: Dict[int, CPMNode]) -> Tuple[Dict[int, CPMNode], List[int]]:
    """
    Điểm vào tương thích ngược: chạy CPM chỉ dùng các quan hệ FS
    (Finish-to-Start, lag bằng 0) đã được mã hóa sẵn trong
    `node.successors` / `node.predecessors`.

    Trả về: (các node đã cập nhật, danh sách task ID của critical_path)
    """
    edges = [
        CPMEdge(predecessor_id=nid, successor_id=succ_id, dependency_type=FS, lag_days=0)
        for nid, node in nodes.items()
        for succ_id in node.successors
    ]
    result = run_cpm(nodes, edges)
    return result.nodes, result.critical_path


def task_duration_days(
    estimated_hours: Optional[float] = None,
    start_date: Optional[date] = None,
    due_date: Optional[date] = None,
    hours_per_day: float = 8.0,
    default_days: float = 1.0,
) -> float:
    """
    Ước lượng thời lượng (tính bằng ngày) cho một task, theo thứ tự ưu tiên:
    1) khoảng ngày start/due được chỉ định rõ
    2) số giờ ước tính quy đổi qua `hours_per_day`
    3) giá trị dự phòng `default_days` (ví dụ cho task chưa có ước tính)
    """
    if start_date is not None and due_date is not None and due_date >= start_date:
        return float((due_date - start_date).days) or default_days
    if estimated_hours is not None and estimated_hours > 0:
        return estimated_hours / hours_per_day
    return default_days


def compute_cpm_for_project(
    tasks: Iterable[object],
    dependencies: Iterable[object],
    hours_per_day: float = 8.0,
    default_task_days: float = 1.0,
) -> CPMResult:
    """
    Hàm bọc tiện lợi: dựng đồ thị trực tiếp từ các object kiểu ORM
    và chạy toàn bộ phân tích CPM.

    Mỗi phần tử `tasks` chỉ cần `.id` và tùy chọn `.estimated_hours`,
    `.start_date`, `.due_date`.
    Mỗi phần tử `dependencies` chỉ cần `.predecessor_id`, `.successor_id`,
    `.dependency_type` (hoặc `.dependency_type.value`) và `.lag_days`.
    """
    task_pairs = [
        (
            task.id,
            task_duration_days(
                estimated_hours=getattr(task, "estimated_hours", None),
                start_date=getattr(task, "start_date", None),
                due_date=getattr(task, "due_date", None),
                hours_per_day=hours_per_day,
                default_days=default_task_days,
            ),
        )
        for task in tasks
    ]

    edges = []
    for dep in dependencies:
        dep_type = getattr(dep, "dependency_type", FS)
        dep_type = getattr(dep_type, "value", dep_type)  # bóc enum nếu cần
        edges.append(
            CPMEdge(
                predecessor_id=dep.predecessor_id,
                successor_id=dep.successor_id,
                dependency_type=dep_type,
                lag_days=getattr(dep, "lag_days", 0) or 0,
            )
        )

    nodes = build_graph(task_pairs, edges)
    return run_cpm(nodes, edges)


def offsets_to_dates(result: CPMResult, project_start: date) -> Dict[int, Dict[str, date]]:
    """
    Chuyển kết quả CPM dạng offset theo ngày thành ngày lịch, lấy mốc tại
    `project_start` (ngày 0). Trả về, theo từng task id:
    {early_start, early_finish, late_start, late_finish} dưới dạng object `date`,
    sẵn sàng để lưu vào `Task.early_start` / `.early_finish` / v.v.
    """
    dates: Dict[int, Dict[str, date]] = {}
    for nid, node in result.nodes.items():
        dates[nid] = {
            "early_start": project_start + timedelta(days=node.early_start),
            "early_finish": project_start + timedelta(days=node.early_finish),
            "late_start": project_start + timedelta(days=node.late_start),
            "late_finish": project_start + timedelta(days=node.late_finish),
        }
    return dates
