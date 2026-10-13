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
from datetime import UTC, datetime
from typing import Annotated, Any

from fastapi import Depends
from sqlalchemy import delete, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ConflictException, NotFoundException
from app.db.session import get_db
from app.models.dependency import Dependency
from app.models.epic import Epic
from app.models.milestone import Milestone
from app.models.phase import Phase
from app.models.project import Project
from app.models.project_version import ProjectVersion
from app.models.sprint import Sprint
from app.models.task import Task
from app.models.user import User
from app.services.phase2_common import (
    add_audit,
    get_project_context,
    json_value,
    require_project_roles,
)

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
    items = await db.scalars(select(model).where(model.project_id == project_id).order_by(model.id))
    return [_pick(item, fields) for item in items]


async def build_snapshot(db: AsyncSession, project_id: int, *, kind: str) -> dict:
    """Đọc toàn bộ thực thể trong phạm vi V0 của dự án trong transaction hiện tại."""
    tasks = await _rows(db, Task, project_id, TASK_FIELDS)
    task_ids = select(Task.id).where(Task.project_id == project_id)
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


def get_versioning_service(db: Annotated[AsyncSession, Depends(get_db)]) -> VersioningService:
    return VersioningService(db)


VersioningServiceDep = Annotated[VersioningService, Depends(get_versioning_service)]
