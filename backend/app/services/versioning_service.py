"""Phiên bản dự án (V1): chụp snapshot và baseline theo ngữ nghĩa V0 (tasks/phase4/plan.md).

- Snapshot gồm phases, sprints, epics, milestones, tasks, dependencies với các trường liệt kê
  ở V0; KHÔNG gồm worklog/comment/subtask/assignment và KHÔNG lưu trường CPM.
- `create_snapshot` chạy trong transaction của caller (không commit). Khóa hàng dự án
  (`SELECT ... FOR UPDATE` trên PostgreSQL) tuần tự hóa việc tạo phiên bản và cấp số phiên
  bản (max+1 dưới khóa, thêm unique constraint `uq_project_version` làm chốt chặn cuối).
- Giới hạn: khóa dự án chỉ tuần tự hóa các lần tạo phiên bản với nhau; các ghi task/phase
  thông thường không lấy khóa này. Ở mức READ COMMITTED mặc định, mỗi câu SELECT thấy dữ liệu
  đã commit tại thời điểm chạy câu đó, nên một ghi đồng thời commit giữa các câu SELECT có thể
  làm snapshot lệch nhẹ giữa các bảng. Muốn tuyệt đối nhất quán cần REPEATABLE READ cho cả
  transaction, không đổi được giữa chừng ở đây.
- `kind` lưu trong snapshot JSON (không thêm cột) để tránh migration.
"""
import copy
from datetime import UTC, date, datetime
from typing import Annotated, Any

from fastapi import Depends
from sqlalchemy import Date as SADate
from sqlalchemy import Enum as SAEnum
from sqlalchemy import delete, func, or_, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ConflictException, NotFoundException, UnprocessableException
from app.db.session import get_db
from app.models.assignment import Assignment
from app.models.associations import project_members
from app.models.comment import Comment
from app.models.dependency import Dependency
from app.models.epic import Epic
from app.models.milestone import Milestone
from app.models.phase import Phase
from app.models.project import Project
from app.models.project_version import ProjectVersion
from app.models.sprint import Sprint
from app.models.subtask import Subtask
from app.models.task import Task
from app.models.user import User
from app.models.worklog import Worklog
from app.services.phase2_common import (
    add_audit,
    get_project_context,
    json_value,
    require_project_roles,
)
from app.utils.version_diff import diff_snapshots

SNAPSHOT_SCHEMA_VERSION = 1
# Số phiên bản tối đa mỗi dự án. Đề xuất chuyển thành settings PROJECT_VERSION_CAP.
MAX_VERSIONS_PER_PROJECT = 50

KIND_MANUAL_BASELINE = "manual_baseline"
KIND_CHANGE_REQUEST = "change_request_approved"
KIND_PRE_ROLLBACK = "pre_rollback"
KIND_ROLLBACK = "rollback"

PHASE_FIELDS = ("id", "name", "description", "status", "order_index", "start_date", "end_date")
SPRINT_FIELDS = ("id", "name", "goal", "status", "phase_id", "start_date", "end_date")
EPIC_FIELDS = ("id", "name", "description", "status")
MILESTONE_FIELDS = ("id", "name", "description", "status", "due_date")
TASK_FIELDS = (
    "id", "name", "description", "status", "priority", "story_points", "estimated_hours",
    "progress", "start_date", "due_date", "phase_id", "sprint_id", "epic_id", "assignee_id",
)
DEPENDENCY_FIELDS = ("id", "predecessor_id", "successor_id", "dependency_type", "lag_days")


def _pick(instance: Any, fields: tuple[str, ...]) -> dict:
    return {field: json_value(getattr(instance, field)) for field in fields}


async def _rows(db: AsyncSession, model, project_id: int, fields: tuple[str, ...]) -> list[dict]:
    query = select(model).where(model.project_id == project_id)
    if model is Task:
        # Task đã lưu trữ (V3) không thuộc trạng thái kế hoạch nên không vào snapshot.
        query = query.where(Task.archived_at.is_(None))
    items = await db.scalars(query.order_by(model.id))
    return [_pick(item, fields) for item in items]


async def build_snapshot(db: AsyncSession, project_id: int, *, kind: str) -> dict:
    """Đọc toàn bộ thực thể trong phạm vi V0 của dự án trong transaction hiện tại."""
    tasks = await _rows(db, Task, project_id, TASK_FIELDS)
    task_ids = select(Task.id).where(Task.project_id == project_id, Task.archived_at.is_(None))
    deps = await db.scalars(
        select(Dependency)
        .where(or_(Dependency.predecessor_id.in_(task_ids), Dependency.successor_id.in_(task_ids)))
        .order_by(Dependency.id)
    )
    data = {
        "phases": await _rows(db, Phase, project_id, PHASE_FIELDS),
        "sprints": await _rows(db, Sprint, project_id, SPRINT_FIELDS),
        "epics": await _rows(db, Epic, project_id, EPIC_FIELDS),
        "milestones": await _rows(db, Milestone, project_id, MILESTONE_FIELDS),
        "tasks": tasks,
        "dependencies": [_pick(dep, DEPENDENCY_FIELDS) for dep in deps],
    }
    return {
        "schema_version": SNAPSHOT_SCHEMA_VERSION,
        "kind": kind,
        "project_id": project_id,
        "captured_at": datetime.now(UTC).isoformat(),
        "counts": {key: len(value) for key, value in data.items()},
        **data,
    }


async def _lock_project(db: AsyncSession, project_id: int) -> Project:
    # populate_existing: đọc lại sau khi chờ khóa, không dùng bản cũ trong identity map.
    project = await db.scalar(
        select(Project)
        .where(Project.id == project_id)
        .with_for_update()
        .execution_options(populate_existing=True)
    )
    if project is None or project.deleted_at is not None:
        raise NotFoundException("Project not found")
    return project


async def _enforce_cap(db: AsyncSession, project_id: int, *, cap: int) -> None:
    """Giữ tối đa `cap - 1` phiên bản trước khi thêm mới: xóa phiên bản cũ nhất không phải baseline."""
    total = await db.scalar(
        select(func.count()).select_from(ProjectVersion).where(ProjectVersion.project_id == project_id)
    ) or 0
    overflow = total - cap + 1
    if overflow <= 0:
        return
    victims = list(await db.scalars(
        select(ProjectVersion.id)
        .where(ProjectVersion.project_id == project_id, ProjectVersion.is_baseline.is_(False))
        .order_by(ProjectVersion.version_number)
        .limit(overflow)
    ))
    if len(victims) < overflow:
        raise ConflictException(
            f"Project version limit ({cap}) reached and all remaining versions are baselines"
        )
    await db.execute(delete(ProjectVersion).where(ProjectVersion.id.in_(victims)))


async def create_snapshot(
    db: AsyncSession,
    project_id: int,
    user: User,
    *,
    label: str,
    description: str | None = None,
    is_baseline: bool = False,
    change_request_id: int | None = None,
    kind: str = KIND_MANUAL_BASELINE,
    cap: int = MAX_VERSIONS_PER_PROJECT,
) -> ProjectVersion:
    """Tạo phiên bản mới trong transaction của caller (chỉ flush, không commit)."""
    await _lock_project(db, project_id)
    await _enforce_cap(db, project_id, cap=cap)
    current_max = await db.scalar(
        select(func.max(ProjectVersion.version_number)).where(ProjectVersion.project_id == project_id)
    )
    snapshot = await build_snapshot(db, project_id, kind=kind)
    version = ProjectVersion(
        project_id=project_id,
        version_number=(current_max or 0) + 1,
        label=label[:100],
        description=description,
        is_baseline=is_baseline,
        snapshot=snapshot,
        change_request_id=change_request_id,
        created_by_id=user.id,
    )
    db.add(version)
    await db.flush()
    add_audit(
        db, user.id, "CREATE", "ProjectVersion", version.id,
        new_values={
            "project_id": project_id, "version_number": version.version_number, "kind": kind,
            "is_baseline": is_baseline, "change_request_id": change_request_id,
        },
        description=f"Project {project_id} version {version.version_number}: {version.label}",
    )
    return version


# ─── Rollback phiên bản (V3) ────────────────────────────────────────────────

# Thứ tự xử lý đảm bảo khóa ngoại: phase trước sprint (sprint.phase_id), các thực thể cha
# trước task (task.phase_id/sprint_id/epic_id).
_PARENT_SPECS = (
    ("phases", Phase, PHASE_FIELDS),
    ("sprints", Sprint, SPRINT_FIELDS),
    ("epics", Epic, EPIC_FIELDS),
    ("milestones", Milestone, MILESTONE_FIELDS),
)
# Trường khóa ngoại cần dịch qua id_map khi khôi phục.
_FK_TARGETS = {"phase_id": "phases", "sprint_id": "sprints", "epic_id": "epics"}
# Cột khóa ngoại trên task trỏ tới từng loại thực thể cha (để gỡ trước khi xóa cứng).
_TASK_FK_COLUMN = {"phases": "phase_id", "sprints": "sprint_id", "epics": "epic_id"}


def _from_json(model, field: str, value: Any) -> Any:
    """Đổi giá trị JSON trong snapshot về kiểu Python của cột (enum, date)."""
    if value is None:
        return None
    column_type = model.__table__.c[field].type
    if isinstance(column_type, SAEnum) and column_type.enum_class is not None:
        return column_type.enum_class(value)
    if isinstance(column_type, SADate) and isinstance(value, str):
        return date.fromisoformat(value)
    return value


def _apply_fields(
    instance: Any, model, item: dict, fields: tuple[str, ...], id_map: dict[str, dict[int, int]]
) -> None:
    for field in fields:
        if field == "id":
            continue
        value = item.get(field)
        target = _FK_TARGETS.get(field)
        if target is not None and value is not None:
            value = id_map[target].get(value, value)
        setattr(instance, field, _from_json(model, field, value))


async def _tasks_with_dependent_rows(db: AsyncSession, task_ids: list[int]) -> set[int]:
    """Trả về các task có worklog/comment/subtask/assignment (không được xóa cứng)."""
    if not task_ids:
        return set()
    result: set[int] = set()
    for model in (Worklog, Comment, Subtask, Assignment):
        result.update(await db.scalars(select(model.task_id).where(model.task_id.in_(task_ids))))
    return result


async def rollback_to_version(
    db: AsyncSession,
    project_id: int,
    version_id: int,
    user: User,
    *,
    cap: int = MAX_VERSIONS_PER_PROJECT,
) -> tuple[ProjectVersion, dict]:
    """Khôi phục dự án về snapshot của `version_id` theo bảng quy tắc V0.

    Chạy trong transaction của caller (chỉ flush). Lỗi ở bất kỳ bước nào thì caller rollback
    toàn bộ: snapshot "trước khi khôi phục", thay đổi dữ liệu và phiên bản kết quả cùng mất.
    Worklog/comment/subtask/assignment không bao giờ bị xóa hay sửa.
    """
    context = await require_project_roles(db, project_id, user, "PM")
    target = await db.get(ProjectVersion, version_id)
    if target is None or target.project_id != project_id:
        raise NotFoundException("Project version not found")
    # Sao chép trước: cap có thể xóa chính phiên bản đích khi tạo các phiên bản mới.
    snapshot = copy.deepcopy(target.snapshot or {})
    target_number = target.version_number
    if snapshot.get("schema_version") != SNAPSHOT_SCHEMA_VERSION:
        raise UnprocessableException("Unsupported snapshot schema version")

    # create_snapshot khóa hàng dự án; mọi bước sau chạy dưới khóa này.
    pre = await create_snapshot(
        db, project_id, user, label=f"Trước khi khôi phục về v{target_number}",
        kind=KIND_PRE_ROLLBACK, cap=cap,
    )

    id_map: dict[str, dict[int, int]] = {
        key: {} for key in ("phases", "sprints", "epics", "milestones", "tasks")
    }
    warnings: list[dict] = []
    stats = {
        "restored": 0, "recreated": 0, "deleted": 0, "archived": 0, "unarchived": 0,
        "dependencies_added": 0, "dependencies_removed": 0, "dependencies_updated": 0,
    }

    # 1. Phase/Sprint/Epic/Milestone có trong snapshot: khôi phục trường hoặc tạo lại.
    for key, model, fields in _PARENT_SPECS:
        existing = {
            item.id: item
            for item in await db.scalars(select(model).where(model.project_id == project_id))
        }
        for item in snapshot.get(key) or []:
            instance = existing.get(item["id"])
            if instance is None:
                instance = model(project_id=project_id)
                _apply_fields(instance, model, item, fields, id_map)
                db.add(instance)
                await db.flush()
                id_map[key][item["id"]] = instance.id
                stats["recreated"] += 1
            else:
                _apply_fields(instance, model, item, fields, id_map)
                stats["restored"] += 1

    # 2. Task có trong snapshot: khôi phục trường, bỏ lưu trữ, hoặc tạo lại với ID mới.
    members = set(await db.scalars(
        select(project_members.c.user_id).where(project_members.c.project_id == project_id)
    ))
    if context.project.pm_id is not None:
        members.add(context.project.pm_id)
    existing_tasks = {
        task.id: task
        for task in await db.scalars(select(Task).where(Task.project_id == project_id))
    }
    kept_task_ids: set[int] = set()
    for item in snapshot.get("tasks") or []:
        assignee_id = item.get("assignee_id")
        if assignee_id is not None and assignee_id not in members:
            warnings.append({
                "code": "assignee_not_member", "task_id": item["id"],
                "task_name": item.get("name"), "assignee_id": assignee_id,
            })
            item = {**item, "assignee_id": None}
        task = existing_tasks.get(item["id"])
        if task is None:
            task = Task(project_id=project_id)
            _apply_fields(task, Task, item, TASK_FIELDS, id_map)
            db.add(task)
            await db.flush()
            id_map["tasks"][item["id"]] = task.id
            stats["recreated"] += 1
        else:
            _apply_fields(task, Task, item, TASK_FIELDS, id_map)
            if task.archived_at is not None:
                task.archived_at = None
                stats["unarchived"] += 1
            stats["restored"] += 1
        kept_task_ids.add(task.id)
    await db.flush()

    # 3. Task không có trong snapshot: lưu trữ nếu có dữ liệu phụ thuộc, ngược lại xóa cứng.
    extra_ids = [task_id for task_id in existing_tasks if task_id not in kept_task_ids]
    protected = await _tasks_with_dependent_rows(db, extra_ids)
    now = datetime.now(UTC)
    for task_id in extra_ids:
        task = existing_tasks[task_id]
        if task_id in protected and task.archived_at is None:
            task.archived_at = now
            stats["archived"] += 1
    to_delete = [task_id for task_id in extra_ids if task_id not in protected]
    if to_delete:
        removed = await db.execute(
            delete(Dependency)
            .where(or_(
                Dependency.predecessor_id.in_(to_delete), Dependency.successor_id.in_(to_delete)
            ))
            .execution_options(synchronize_session=False)
        )
        stats["dependencies_removed"] += removed.rowcount or 0
        await db.execute(
            delete(Task).where(Task.id.in_(to_delete)).execution_options(synchronize_session=False)
        )
        for task_id in to_delete:
            db.expunge(existing_tasks[task_id])
        stats["deleted"] += len(to_delete)
    await db.flush()

    # 4. Dependency: đưa về đúng tập snapshot theo cặp (pred, succ) đã dịch ID; cạnh trỏ tới
    #    task lưu trữ (không thuộc tập giữ lại) bị bỏ.
    def _task_id(value: int) -> int:
        return id_map["tasks"].get(value, value)

    desired: dict[tuple[int, int], dict] = {}
    for item in snapshot.get("dependencies") or []:
        pair = (_task_id(item["predecessor_id"]), _task_id(item["successor_id"]))
        if pair[0] in kept_task_ids and pair[1] in kept_task_ids:
            desired[pair] = item
    project_task_ids = select(Task.id).where(Task.project_id == project_id)
    current_deps = list(await db.scalars(
        select(Dependency).where(or_(
            Dependency.predecessor_id.in_(project_task_ids),
            Dependency.successor_id.in_(project_task_ids),
        ))
    ))
    seen: set[tuple[int, int]] = set()
    for dep in current_deps:
        pair = (dep.predecessor_id, dep.successor_id)
        item = desired.get(pair)
        if item is None:
            await db.delete(dep)
            stats["dependencies_removed"] += 1
            continue
        seen.add(pair)
        dep_type = _from_json(Dependency, "dependency_type", item.get("dependency_type"))
        lag = item.get("lag_days") or 0
        if dep.dependency_type != dep_type or dep.lag_days != lag:
            dep.dependency_type = dep_type
            dep.lag_days = lag
            stats["dependencies_updated"] += 1
    await db.flush()
    for pair, item in desired.items():
        if pair in seen:
            continue
        db.add(Dependency(
            predecessor_id=pair[0], successor_id=pair[1],
            dependency_type=_from_json(Dependency, "dependency_type", item.get("dependency_type")),
            lag_days=item.get("lag_days") or 0,
        ))
        stats["dependencies_added"] += 1
    await db.flush()

    # 5. Phase/Sprint/Epic/Milestone không có trong snapshot: xóa cứng. Gỡ khóa ngoại trỏ tới
    #    chúng trước (DB có SET NULL nhưng SQLite có thể không bật kiểm tra khóa ngoại).
    for key, model, _fields in reversed(_PARENT_SPECS):
        keep = {id_map[key].get(item["id"], item["id"]) for item in snapshot.get(key) or []}
        victims = [
            item_id
            for item_id in await db.scalars(select(model.id).where(model.project_id == project_id))
            if item_id not in keep
        ]
        if not victims:
            continue
        fk_column = _TASK_FK_COLUMN.get(key)
        if fk_column is not None:
            await db.execute(
                update(Task)
                .where(getattr(Task, fk_column).in_(victims))
                .values({fk_column: None})
                .execution_options(synchronize_session="fetch")
            )
        if key == "phases":
            await db.execute(
                update(Sprint)
                .where(Sprint.phase_id.in_(victims))
                .values(phase_id=None)
                .execution_options(synchronize_session="fetch")
            )
        await db.execute(
            delete(model).where(model.id.in_(victims)).execution_options(synchronize_session="fetch")
        )
        stats["deleted"] += len(victims)
    await db.flush()

    # 6. Phiên bản kết quả kèm id_map/cảnh báo; enqueue CPM trong cùng transaction (outbox).
    version = await create_snapshot(
        db, project_id, user, label=f"Khôi phục về v{target_number}",
        kind=KIND_ROLLBACK, cap=cap,
    )
    clean_map = {
        key: {str(old): new for old, new in mapping.items()}
        for key, mapping in id_map.items()
        if mapping
    }
    version.snapshot = {
        **version.snapshot,
        "id_map": clean_map,
        "warnings": warnings,
        "rollback": {
            "target_version_id": version_id,
            "target_version_number": target_number,
            "pre_rollback_version_id": pre.id,
            "stats": stats,
        },
    }
    from app.services.job_service import enqueue

    await enqueue(
        db, kind="scheduling.cpm", payload={"project_id": project_id},
        dedupe_key=f"cpm:{project_id}", project_id=project_id, coalesce=True,
    )
    add_audit(
        db, user.id, "ROLLBACK", "Project", project_id,
        new_values={
            "target_version_id": version_id, "target_version_number": target_number,
            "pre_rollback_version_id": pre.id, "rollback_version_id": version.id,
            "stats": stats, "warnings": len(warnings),
        },
        description=f"Project {project_id} rolled back to version {target_number}",
    )
    await db.flush()
    summary = {
        "pre_rollback_version_id": pre.id,
        "target_version_id": version_id,
        "target_version_number": target_number,
        "changes": stats,
        "total_changes": sum(stats.values()) - stats["restored"],
        "id_map": clean_map,
        "warnings": warnings,
    }
    return version, summary


def version_metadata(version: ProjectVersion) -> dict:
    snapshot = version.snapshot or {}
    return {
        "id": version.id,
        "project_id": version.project_id,
        "version_number": version.version_number,
        "label": version.label,
        "description": version.description,
        "is_baseline": version.is_baseline,
        "kind": snapshot.get("kind"),
        "change_request_id": version.change_request_id,
        "created_by_id": version.created_by_id,
        "created_at": version.created_at,
        "schema_version": snapshot.get("schema_version"),
        "counts": snapshot.get("counts", {}),
    }


class VersioningService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_versions(self, project_id: int, user: User) -> list[dict]:
        await get_project_context(self.db, project_id, user)
        versions = await self.db.scalars(
            select(ProjectVersion)
            .where(ProjectVersion.project_id == project_id)
            .order_by(ProjectVersion.version_number.desc())
        )
        return [version_metadata(v) for v in versions]

    async def get_version(
        self, project_id: int, version_id: int, user: User, *, include_snapshot: bool = False
    ) -> dict:
        await get_project_context(self.db, project_id, user)
        version = await self.db.get(ProjectVersion, version_id)
        if version is None or version.project_id != project_id:
            raise NotFoundException("Project version not found")
        data = version_metadata(version)
        if include_snapshot:
            data["snapshot"] = version.snapshot
        return data

    async def _load(self, project_id: int, version_id: int) -> ProjectVersion:
        version = await self.db.get(ProjectVersion, version_id)
        if version is None or version.project_id != project_id:
            raise NotFoundException("Project version not found")
        return version

    async def diff_versions(
        self, project_id: int, base_id: int, target_id: int | None, user: User
    ) -> dict:
        """So sánh hai phiên bản; `target_id=None` nghĩa là so với hiện trạng (không lưu)."""
        await get_project_context(self.db, project_id, user)
        base = await self._load(project_id, base_id)
        if target_id is None:
            target_snapshot = await build_snapshot(self.db, project_id, kind="current")
            target_meta = None
        else:
            target = await self._load(project_id, target_id)
            target_snapshot = target.snapshot or {}
            target_meta = version_metadata(target)
        return {
            "project_id": project_id,
            "base": version_metadata(base),
            "target": target_meta,
            "target_is_current": target_id is None,
            **diff_snapshots(base.snapshot or {}, target_snapshot),
        }

    async def create_baseline(
        self, project_id: int, user: User, *, label: str, description: str | None = None
    ) -> dict:
        await require_project_roles(self.db, project_id, user, "PM")
        version = await create_snapshot(
            self.db, project_id, user, label=label, description=description,
            is_baseline=True, kind=KIND_MANUAL_BASELINE,
        )
        await self.db.commit()
        await self.db.refresh(version)
        return version_metadata(version)

    async def rollback(self, project_id: int, version_id: int, user: User) -> dict:
        """Khôi phục về phiên bản trong một commit duy nhất.

        Lỗi giữa chừng: không commit; get_db (hoặc caller) rollback toàn bộ transaction.
        """
        version, summary = await rollback_to_version(self.db, project_id, version_id, user)
        await self.db.commit()
        await self.db.refresh(version)
        return {"version": version_metadata(version), "summary": summary}


def get_versioning_service(db: Annotated[AsyncSession, Depends(get_db)]) -> VersioningService:
    return VersioningService(db)


VersioningServiceDep = Annotated[VersioningService, Depends(get_versioning_service)]
