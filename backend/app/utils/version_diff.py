"""So sánh hai snapshot phiên bản dự án (V2). Hàm thuần, không truy cập DB.

- Thực thể so khớp theo `id`; dependency so khớp theo khóa tự nhiên
  (predecessor_id, successor_id) vì rollback (V3) có thể tạo lại dependency với id mới.
- Nếu có `id_map` (ID cũ -> ID mới, V3 lưu trong phiên bản rollback), ID phía snapshot cũ
  được dịch sang ID mới trước khi so, gồm cả các khóa ngoại phase/sprint/epic và
  predecessor/successor.
- Mỗi danh sách added/removed/changed của từng loại bị cắt tối đa `limit` mục kèm cờ
  `truncated`; phần tóm tắt luôn đếm đủ.
"""
from typing import Any

ENTITY_TYPES = ("phases", "sprints", "epics", "milestones", "tasks", "dependencies")
DEFAULT_LIMIT = 500

# Trường khóa ngoại trỏ tới thực thể nào (để dịch ID theo id_map).
_FK_FIELDS = {
    "phase_id": "phases",
    "sprint_id": "sprints",
    "epic_id": "epics",
    "predecessor_id": "tasks",
    "successor_id": "tasks",
}
# Trường không so sánh (định danh hoặc đã dùng làm khóa so khớp).
_IGNORED = {"id"}
_DEP_IGNORED = {"id", "predecessor_id", "successor_id"}


def _normalize_id_map(id_map: dict | None) -> dict[str, dict[int, int]]:
    """Chuẩn hóa id_map: {loại: {id_cũ: id_mới}}; khóa JSON dạng chuỗi được đổi sang int."""
    result: dict[str, dict[int, int]] = {}
    for entity, mapping in (id_map or {}).items():
        if isinstance(mapping, dict):
            result[entity] = {int(k): int(v) for k, v in mapping.items() if v is not None}
    return result


def _translate(item: dict, entity: str, id_map: dict[str, dict[int, int]]) -> dict:
    if not id_map:
        return item
    out = dict(item)
    own = id_map.get(entity, {})
    if entity != "dependencies" and out.get("id") in own:
        out["id"] = own[out["id"]]
    for field, target in _FK_FIELDS.items():
        value = out.get(field)
        if value is not None and value in id_map.get(target, {}):
            out[field] = id_map[target][value]
    return out


def _key(item: dict, entity: str) -> Any:
    if entity == "dependencies":
        return (item.get("predecessor_id"), item.get("successor_id"))
    return item.get("id")


def _field_changes(old: dict, new: dict, ignored: set[str]) -> list[dict]:
    fields = [f for f in dict.fromkeys([*old.keys(), *new.keys()]) if f not in ignored]
    return [
        {"field": f, "old": old.get(f), "new": new.get(f)}
        for f in fields
        if old.get(f) != new.get(f)
    ]


def _brief(item: dict, entity: str, task_names: dict[int, str]) -> dict:
    """Bản tóm tắt gọn của một thực thể để hiển thị, không trả toàn bộ bản ghi."""
    if entity == "dependencies":
        pred, succ = item.get("predecessor_id"), item.get("successor_id")
        return {
            "id": item.get("id"),
            "predecessor_id": pred,
            "successor_id": succ,
            "predecessor_name": task_names.get(pred),
            "successor_name": task_names.get(succ),
            "dependency_type": item.get("dependency_type"),
            "lag_days": item.get("lag_days"),
        }
    return {"id": item.get("id"), "name": item.get("name")}


def _cap(items: list, limit: int) -> tuple[list, bool]:
    return items[:limit], len(items) > limit


def diff_snapshots(
    old: dict, new: dict, *, id_map: dict | None = None, limit: int = DEFAULT_LIMIT
) -> dict:
    """So sánh snapshot `old` với `new`.

    `id_map` mặc định lấy từ `new["id_map"]` nếu có (ID của `old` -> ID của `new`).
    Trả về {"entities": {loại: {added, removed, changed, truncated}}, "summary": {...},
    "truncated": bool}.
    """
    mapping = _normalize_id_map(id_map if id_map is not None else new.get("id_map"))
    # Tên task để hiển thị dependency; ưu tiên tên mới, thiếu thì lấy tên cũ đã dịch ID.
    task_names: dict[int, str] = {}
    for task in old.get("tasks") or []:
        translated = _translate(task, "tasks", mapping)
        task_names[translated.get("id")] = translated.get("name")
    for task in new.get("tasks") or []:
        task_names[task.get("id")] = task.get("name")

    entities: dict[str, dict] = {}
    summary: dict[str, dict[str, int]] = {}
    any_truncated = False
    for entity in ENTITY_TYPES:
        ignored = _DEP_IGNORED if entity == "dependencies" else _IGNORED
        old_items = {
            _key(t, entity): t
            for t in (_translate(i, entity, mapping) for i in old.get(entity) or [])
        }
        new_items = {_key(i, entity): i for i in new.get(entity) or []}
        added = [_brief(new_items[k], entity, task_names) for k in new_items if k not in old_items]
        removed = [_brief(old_items[k], entity, task_names) for k in old_items if k not in new_items]
        changed = []
        for k, new_item in new_items.items():
            if k not in old_items:
                continue
            changes = _field_changes(old_items[k], new_item, ignored)
            if changes:
                changed.append({**_brief(new_item, entity, task_names), "changes": changes})
        summary[entity] = {"added": len(added), "removed": len(removed), "changed": len(changed)}
        added, t1 = _cap(added, limit)
        removed, t2 = _cap(removed, limit)
        changed, t3 = _cap(changed, limit)
        truncated = t1 or t2 or t3
        any_truncated = any_truncated or truncated
        entities[entity] = {
            "added": added, "removed": removed, "changed": changed, "truncated": truncated,
        }
    totals = {
        kind: sum(s[kind] for s in summary.values()) for kind in ("added", "removed", "changed")
    }
    return {
        "entities": entities,
        "summary": {"by_entity": summary, "total": totals},
        "truncated": any_truncated,
    }
