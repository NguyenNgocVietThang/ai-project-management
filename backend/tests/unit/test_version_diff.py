"""Unit test hàm so sánh snapshot (V2)."""
from app.utils.version_diff import ENTITY_TYPES, diff_snapshots


def _snap(**kw):
    base = {key: [] for key in ENTITY_TYPES}
    base.update(kw)
    return base


def _task(id_, name, **kw):
    return {"id": id_, "name": name, "start_date": None, "due_date": None, "phase_id": None, **kw}


def test_identical_snapshots_have_no_changes():
    snap = _snap(tasks=[_task(1, "A")])
    result = diff_snapshots(snap, snap)
    assert result["summary"]["total"] == {"added": 0, "removed": 0, "changed": 0}
    assert result["truncated"] is False
    assert set(result["entities"]) == set(ENTITY_TYPES)


def test_added_removed_and_changed_dates():
    old = _snap(tasks=[_task(1, "A", due_date="2026-01-10"), _task(2, "B")])
    new = _snap(tasks=[_task(1, "A", due_date="2026-01-20"), _task(3, "C")])
    tasks = diff_snapshots(old, new)["entities"]["tasks"]
    assert tasks["added"] == [{"id": 3, "name": "C"}]
    assert tasks["removed"] == [{"id": 2, "name": "B"}]
    assert tasks["changed"] == [{
        "id": 1, "name": "A",
        "changes": [{"field": "due_date", "old": "2026-01-10", "new": "2026-01-20"}],
    }]


def test_phase_and_milestone_changes():
    old = _snap(phases=[{"id": 1, "name": "P", "end_date": "2026-02-01"}],
                milestones=[{"id": 5, "name": "M", "due_date": None}])
    new = _snap(phases=[{"id": 1, "name": "P2", "end_date": "2026-03-01"}], milestones=[])
    result = diff_snapshots(old, new)
    fields = {c["field"] for c in result["entities"]["phases"]["changed"][0]["changes"]}
    assert fields == {"name", "end_date"}
    assert result["entities"]["milestones"]["removed"] == [{"id": 5, "name": "M"}]
    assert result["summary"]["by_entity"]["phases"] == {"added": 0, "removed": 0, "changed": 1}


def test_dependencies_matched_by_natural_key():
    tasks = [_task(1, "A"), _task(2, "B"), _task(3, "C")]
    old = _snap(tasks=tasks, dependencies=[
        {"id": 10, "predecessor_id": 1, "successor_id": 2, "dependency_type": "FS", "lag_days": 0},
        {"id": 11, "predecessor_id": 2, "successor_id": 3, "dependency_type": "FS", "lag_days": 0},
    ])
    # Dependency 1->2 tạo lại với id khác và đổi lag; 2->3 bị xóa; 1->3 thêm mới.
    new = _snap(tasks=tasks, dependencies=[
        {"id": 99, "predecessor_id": 1, "successor_id": 2, "dependency_type": "FS", "lag_days": 2},
        {"id": 12, "predecessor_id": 1, "successor_id": 3, "dependency_type": "SS", "lag_days": 0},
    ])
    deps = diff_snapshots(old, new)["entities"]["dependencies"]
    assert deps["changed"][0]["changes"] == [{"field": "lag_days", "old": 0, "new": 2}]
    assert deps["changed"][0]["predecessor_name"] == "A"
    assert [(d["predecessor_id"], d["successor_id"]) for d in deps["removed"]] == [(2, 3)]
    assert deps["added"][0]["successor_name"] == "C" and deps["added"][0]["dependency_type"] == "SS"


def test_id_map_translates_old_ids_before_compare():
    old = _snap(
        phases=[{"id": 1, "name": "P"}],
        tasks=[_task(5, "A", phase_id=1), _task(6, "B", phase_id=1)],
        dependencies=[{"id": 1, "predecessor_id": 5, "successor_id": 6,
                       "dependency_type": "FS", "lag_days": 0}],
    )
    new = _snap(
        phases=[{"id": 101, "name": "P"}],
        tasks=[_task(105, "A", phase_id=101), _task(106, "B renamed", phase_id=101)],
        dependencies=[{"id": 7, "predecessor_id": 105, "successor_id": 106,
                       "dependency_type": "FS", "lag_days": 0}],
        # Khóa JSON là chuỗi.
        id_map={"phases": {"1": 101}, "tasks": {"5": 105, "6": 106}},
    )
    result = diff_snapshots(old, new)
    assert result["summary"]["total"] == {"added": 0, "removed": 0, "changed": 1}
    assert result["entities"]["tasks"]["changed"][0]["changes"] == [
        {"field": "name", "old": "B", "new": "B renamed"}
    ]
    # Không dùng id_map thì mọi thứ thành thêm/xóa.
    plain = diff_snapshots(old, new, id_map={})
    assert plain["summary"]["by_entity"]["tasks"]["added"] == 2


def test_truncation_caps_lists_but_counts_all():
    new = _snap(tasks=[_task(i, f"T{i}") for i in range(1, 8)])
    result = diff_snapshots(_snap(), new, limit=3)
    assert len(result["entities"]["tasks"]["added"]) == 3
    assert result["entities"]["tasks"]["truncated"] is True
    assert result["truncated"] is True
    assert result["summary"]["by_entity"]["tasks"]["added"] == 7


def test_added_items_are_brief_not_full_records():
    new = _snap(tasks=[_task(1, "A", description="x" * 1000)])
    added = diff_snapshots(_snap(), new)["entities"]["tasks"]["added"][0]
    assert added == {"id": 1, "name": "A"}
