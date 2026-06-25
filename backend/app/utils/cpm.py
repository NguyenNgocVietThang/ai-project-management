"""
Critical Path Method (CPM) Algorithm
Topological Sort + Forward Pass + Backward Pass
"""
from typing import Dict, List, Set, Tuple
from dataclasses import dataclass, field


@dataclass
class CPMNode:
    id: int
    duration: float  # in days
    successors: List[int] = field(default_factory=list)
    predecessors: List[int] = field(default_factory=list)
    early_start: float = 0.0
    early_finish: float = 0.0
    late_start: float = float('inf')
    late_finish: float = float('inf')
    float_days: float = 0.0
    is_critical: bool = False


def topological_sort(nodes: Dict[int, CPMNode]) -> List[int]:
    """Kahn's algorithm for topological sort."""
    in_degree: Dict[int, int] = {nid: 0 for nid in nodes}
    for node in nodes.values():
        for succ_id in node.successors:
            in_degree[succ_id] += 1

    queue: List[int] = [nid for nid, deg in in_degree.items() if deg == 0]
    order: List[int] = []

    while queue:
        nid = queue.pop(0)
        order.append(nid)
        for succ_id in nodes[nid].successors:
            in_degree[succ_id] -= 1
            if in_degree[succ_id] == 0:
                queue.append(succ_id)

    if len(order) != len(nodes):
        raise ValueError("Cycle detected in task dependencies")
    return order


def forward_pass(nodes: Dict[int, CPMNode], order: List[int]) -> None:
    """Calculate Early Start and Early Finish."""
    for nid in order:
        node = nodes[nid]
        if not node.predecessors:
            node.early_start = 0.0
        else:
            node.early_start = max(nodes[pred].early_finish for pred in node.predecessors)
        node.early_finish = node.early_start + node.duration


def backward_pass(nodes: Dict[int, CPMNode], order: List[int]) -> None:
    """Calculate Late Start, Late Finish and Float."""
    max_ef = max(nodes[nid].early_finish for nid in order)

    for nid in reversed(order):
        node = nodes[nid]
        if not node.successors:
            node.late_finish = max_ef
        else:
            node.late_finish = min(nodes[succ].late_start for succ in node.successors)
        node.late_start = node.late_finish - node.duration
        node.float_days = node.late_start - node.early_start
        node.is_critical = abs(node.float_days) < 0.001


def compute_cpm(nodes: Dict[int, CPMNode]) -> Tuple[Dict[int, CPMNode], List[int]]:
    """
    Run full CPM analysis.
    Returns: (updated nodes, critical_path task IDs)
    """
    order = topological_sort(nodes)
    forward_pass(nodes, order)
    backward_pass(nodes, order)
    critical_path = [nid for nid in order if nodes[nid].is_critical]
    return nodes, critical_path
