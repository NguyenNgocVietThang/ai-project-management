"""
Critical Path Method (CPM) Algorithm
-------------------------------------
Topological Sort (Kahn's algorithm) + Forward Pass + Backward Pass.

Supports all 4 dependency types used by `app.models.dependency.Dependency`
(FS, SS, FF, SF) with positive/negative lag (lead time), multiple
start/end nodes and disconnected sub-graphs.

Usage (pure algorithm, framework-agnostic):

    nodes = {
        1: CPMNode(id=1, duration=3),
        2: CPMNode(id=2, duration=5),
    }
    edges = [CPMEdge(predecessor_id=1, successor_id=2, dependency_type="FS", lag_days=0)]
    result = run_cpm(nodes, edges)
    result.critical_path   # -> [1, 2]
    result.project_duration  # -> 8.0

Usage (straight from ORM rows):

    result = compute_cpm_for_project(tasks, dependencies)
    for task_id, node in result.nodes.items():
        ...  # node.early_start, node.late_finish, node.is_critical, ...
"""
from dataclasses import dataclass, field
from datetime import date, timedelta
from typing import Dict, Iterable, List, Optional, Tuple

# Dependency type constants (kept as plain strings so this module has no
# hard dependency on the ORM / enum classes and stays trivially testable).
FS = "FS"  # Finish-to-Start  (successor starts after predecessor finishes)
SS = "SS"  # Start-to-Start   (successor starts after predecessor starts)
FF = "FF"  # Finish-to-Finish (successor finishes after predecessor finishes)
SF = "SF"  # Start-to-Finish  (successor finishes after predecessor starts)

VALID_DEPENDENCY_TYPES = {FS, SS, FF, SF}


@dataclass
class CPMNode:
    id: int
    duration: float  # in days, must be >= 0
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
    Build a node graph from (task_id, duration) pairs and a list of edges.
    Raises ValueError if an edge references an unknown task id.
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
    """Kahn's algorithm for topological sort. Raises ValueError on a cycle."""
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
    Calculate Early Start (ES) and Early Finish (EF) for every node,
    honoring the dependency type and lag/lead time of each incoming edge.
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
    Calculate Late Start (LS), Late Finish (LF) and Total Float for every
    node, honoring the dependency type and lag/lead time of each outgoing
    edge. Must run after `forward_pass`.
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
    Run the full CPM analysis (topological sort + forward pass + backward
    pass) on an already-built node graph and edge list.
    """
    order = topological_sort(nodes)
    forward_pass(nodes, order, edges)
    backward_pass(nodes, order, edges)

    critical_path = [nid for nid in order if nodes[nid].is_critical]
    project_duration = max((n.early_finish for n in nodes.values()), default=0.0)

    return CPMResult(nodes=nodes, order=order, critical_path=critical_path, project_duration=project_duration)


def compute_cpm(nodes: Dict[int, CPMNode]) -> Tuple[Dict[int, CPMNode], List[int]]:
    """
    Backwards-compatible entry point: run CPM using only the FS
    (Finish-to-Start, zero lag) relations already encoded in
    `node.successors` / `node.predecessors`.

    Returns: (updated nodes, critical_path task IDs)
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
    Best-effort duration (in days) for a task, in order of preference:
    1) explicit start/due date range
    2) estimated hours converted via `hours_per_day`
    3) `default_days` fallback (e.g. for tasks with no estimate yet)
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
    Convenience wrapper that builds the graph directly from ORM-like
    objects and runs the full CPM analysis.

    `tasks` items only need `.id` and optionally `.estimated_hours`,
    `.start_date`, `.due_date`.
    `dependencies` items only need `.predecessor_id`, `.successor_id`,
    `.dependency_type` (or `.dependency_type.value`) and `.lag_days`.
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
        dep_type = getattr(dep_type, "value", dep_type)  # unwrap enum if needed
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
    Convert day-offset CPM results into calendar dates, anchored at
    `project_start` (day 0). Returns, per task id:
    {early_start, early_finish, late_start, late_finish} as `date` objects,
    ready to persist onto `Task.early_start` / `.early_finish` / etc.
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
