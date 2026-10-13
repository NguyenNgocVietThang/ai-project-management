"""X2: yêu cầu xuất báo cáo XLSX của dự án qua job bền `report.xlsx`.

Luồng:
- `request_xlsx_report` (trong transaction của request): kiểm tra quyền, chống trùng job đang
  chạy cho cùng dự án + ngôn ngữ, rồi xếp job. Không commit (get_db commit sau request).
- Handler `run_report_job`: đọc dữ liệu trong MỘT session (dùng lại hàm công khai của
  SchedulingService/DashboardService để số liệu khớp API CPM/dashboard), dựng XLSX bằng
  `render_project_xlsx`, lưu bucket private với key không đoán được
  `reports/{project_id}/{uuid}.xlsx`, kết quả job là `{storage_key, file_size, filename, language}`.
- `read_report_file`: endpoint tải proxy gọi sau khi kiểm tra thành viên dự án.

Quyền xuất và tải: mọi thành viên đọc được task (PM/BA/PO/Member, cùng tập
`TASK_READER_ROLES` với API CPM) và Admin hệ thống. Báo cáo chỉ chứa dữ liệu mà các vai
trò này vốn đã xem được qua API, nên không hạn chế thêm.

EVA (đơn vị: giờ công, không phải tiền) - tính đơn giản trên các task chưa lưu trữ:
- BAC = tổng estimated_hours
- EV  = tổng estimated_hours * progress / 100
- AC  = tổng actual_hours
- PV  = tổng estimated_hours * tỉ lệ thời gian kế hoạch đã trôi qua đến hôm nay, với tỉ lệ
  = clamp((hôm nay - start_date + 1) / (due_date - start_date + 1), 0, 1) tính theo ngày
  (task thiếu start_date hoặc due_date: tỉ lệ 1 nếu hôm nay > ngày còn lại, ngược lại 0;
  thiếu cả hai: không đóng góp PV)
- SV = EV - PV, CV = EV - AC, SPI = EV / PV (PV > 0), CPI = EV / AC (AC > 0),
  EAC = BAC / CPI (CPI > 0)
Nếu BAC = 0 (không task nào có ước tính) thì EVA = None (sheet ghi "Không có dữ liệu").
"""
from __future__ import annotations

import asyncio
import uuid
from datetime import UTC, date, datetime

from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.exceptions import (
    BadRequestException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
    ServiceUnavailableException,
    UnprocessableException,
)
from app.core.job_runner import JobResult, PermanentJobError
from app.models.approval import Approval
from app.models.change_request import ChangeRequest
from app.models.job import Job
from app.models.task import Task
from app.models.user import User
from app.services.job_service import enqueue
from app.services.phase2_common import get_project_context
from app.services.reports.xlsx_renderer import (
    BurndownRow,
    ChangeRequestRow,
    CriticalPathData,
    EVAData,
    ProjectInfo,
    ProjectReportData,
    ReportApprovalStep,
    TaskRow,
    render_project_xlsx,
)
from app.services.storage_service import StorageError, get_storage_service

JOB_KIND = "report.xlsx"
REPORT_LANGUAGES = ("vi", "en")
XLSX_CONTENT_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
ACTIVE_JOB_STATUSES = ("queued", "running")
# Giới hạn số CR đưa vào báo cáo (task đã bị giới hạn bởi CPM_MAX_TASKS qua API CPM).
MAX_CHANGE_REQUESTS = 2000


def _require_reader(context) -> None:
    from app.services.task_service import _require_task_reader

    _require_task_reader(context)


def report_filename(project_id: int, language: str) -> str:
    """Tên tệp gợi ý: chỉ ký tự ASCII an toàn để đặt trong Content-Disposition."""
    return f"project-{project_id}-report-{language}.xlsx"


async def request_xlsx_report(db, project_id: int, user: User, language: str = "vi") -> Job:
    """Xếp job xuất XLSX; trả job đang chạy sẵn nếu cùng dự án + ngôn ngữ (chống trùng).

    Ngoại lệ: BadRequest("invalid_language"), NotFound/Forbidden khi không phải thành viên.
    """
    if language not in REPORT_LANGUAGES:
        raise BadRequestException("invalid_language")
    _require_reader(await get_project_context(db, project_id, user))
    active = (await db.scalars(
        select(Job)
        .where(Job.kind == JOB_KIND, Job.project_id == project_id, Job.status.in_(ACTIVE_JOB_STATUSES))
        .order_by(Job.id.desc())
    )).all()
    for job in active:
        if (job.payload or {}).get("language") == language:
            return job
    return await enqueue(
        db, kind=JOB_KIND, payload={"project_id": project_id, "language": language},
        dedupe_key=f"report:{project_id}:{language}:{uuid.uuid4().hex}",
        owner_id=user.id, project_id=project_id,
    )


async def get_report_job(db, project_id: int, job_id: int, user: User) -> Job:
    """Job báo cáo thuộc dự án, sau khi kiểm tra người gọi là thành viên đọc được task."""
    _require_reader(await get_project_context(db, project_id, user))
    job = await db.get(Job, job_id)
    if job is None or job.kind != JOB_KIND or job.project_id != project_id:
        raise NotFoundException("Report not found")
    return job


async def read_report_file(db, project_id: int, job_id: int, user: User, storage=None) -> tuple[bytes, str]:
    """Đọc bytes XLSX cho endpoint proxy tải: (data, tên tệp)."""
    job = await get_report_job(db, project_id, job_id, user)
    if job.status != "succeeded":
        raise ConflictException("report_failed" if job.status == "failed" else "report_not_ready")
    result = job.result or {}
    key = result.get("storage_key")
    # Chỉ chấp nhận key do handler tạo cho đúng dự án này.
    if not isinstance(key, str) or not key.startswith(f"reports/{project_id}/"):
        raise NotFoundException("Report not found")
    storage = storage or get_storage_service()
    try:
        data, _content_type = await storage.get_bytes(key)
    except StorageError as exc:
        raise ServiceUnavailableException("storage_unavailable") from exc
    language = result.get("language") if result.get("language") in REPORT_LANGUAGES else "vi"
    return data, report_filename(project_id, language)


# ---------------------------------------------------------------------------
# Thu thập dữ liệu
# ---------------------------------------------------------------------------


def compute_eva(tasks: list[Task], today: date) -> EVAData | None:
    """EVA theo giờ công; công thức ở docstring đầu module."""
    bac = ev = ac = pv = 0.0
    for task in tasks:
        estimate = float(task.estimated_hours or 0.0)
        ac += float(task.actual_hours or 0.0)
        if estimate <= 0:
            continue
        bac += estimate
        ev += estimate * max(0.0, min(100.0, float(task.progress or 0.0))) / 100.0
        start, due = task.start_date, task.due_date
        if start and due and due >= start:
            ratio = ((today - start).days + 1) / ((due - start).days + 1)
        elif start or due:
            ratio = 1.0 if today > (due or start) else 0.0
        else:
            ratio = 0.0
        pv += estimate * max(0.0, min(1.0, ratio))
    if bac <= 0:
        return None
    cpi = ev / ac if ac > 0 else None
    return EVAData(
        pv=round(pv, 2), ev=round(ev, 2), ac=round(ac, 2), bac=round(bac, 2),
        sv=round(ev - pv, 2), cv=round(ev - ac, 2),
        spi=round(ev / pv, 3) if pv > 0 else None,
        cpi=round(cpi, 3) if cpi is not None else None,
        eac=round(bac / cpi, 2) if cpi else None,
    )


async def build_report_data(db, project_id: int, user: User, *, today: date | None = None) -> ProjectReportData:
    """Dựng ProjectReportData. Ném Forbidden/NotFound/Unprocessable như API tương ứng."""
    from app.services.dashboard_service import DashboardService
    from app.services.scheduling_service import SchedulingService

    today = today or date.today()
    context = await get_project_context(db, project_id, user)
    _require_reader(context)
    # API CPM tự kiểm tra giới hạn CPM_MAX_TASKS/CPM_MAX_DEPENDENCIES trước khi nạp task.
    try:
        cpm = await SchedulingService(db).critical_path(project_id, user)
    except ConflictException:
        # Đồ thị có chu trình: vẫn xuất báo cáo, chỉ bỏ trống phần CPM.
        cpm = None
    stats = await DashboardService(db).get_project_stats(project_id, user)

    tasks = list((await db.scalars(
        select(Task)
        .where(Task.project_id == project_id, Task.archived_at.is_(None))
        .options(
            selectinload(Task.phase), selectinload(Task.sprint),
            selectinload(Task.epic), selectinload(Task.assignee),
        )
        .order_by(Task.id)
    )).all())
    cpm_by_id = {item.id: item for item in cpm.tasks} if cpm else {}
    rows = []
    for task in tasks:
        node = cpm_by_id.get(task.id)
        rows.append(TaskRow(
            id=task.id, name=task.name,
            phase=task.phase.name if task.phase else None,
            sprint=task.sprint.name if task.sprint else None,
            epic=task.epic.name if task.epic else None,
            status=task.status.value, priority=task.priority.value,
            assignee=task.assignee.full_name if task.assignee else None,
            start_date=task.start_date, due_date=task.due_date, progress=task.progress,
            estimated_hours=task.estimated_hours, actual_hours=task.actual_hours,
            duration_days=node.duration_days if node else None,
            early_start=node.early_start if node else task.early_start,
            early_finish=node.early_finish if node else task.early_finish,
            late_start=node.late_start if node else task.late_start,
            late_finish=node.late_finish if node else task.late_finish,
            float_days=node.float_days if node else task.float_days,
            is_critical=node.is_critical if node else bool(task.is_critical),
        ))

    change_requests = (await db.scalars(
        select(ChangeRequest)
        .where(ChangeRequest.project_id == project_id)
        .options(
            selectinload(ChangeRequest.requested_by),
            selectinload(ChangeRequest.approvals).selectinload(Approval.approver),
        )
        .order_by(ChangeRequest.id)
        .limit(MAX_CHANGE_REQUESTS)
    )).all()
    cr_rows = [
        ChangeRequestRow(
            id=cr.id, title=cr.title, status=cr.status.value,
            requested_by=cr.requested_by.full_name if cr.requested_by else None,
            created_at=cr.created_at,
            approvals=[
                ReportApprovalStep(
                    step_order=step.step_order,
                    decision=step.status.value if step.status else None,
                    role=step.required_role,
                    decided_by=step.approver.full_name if step.approver else None,
                    decided_at=step.approved_at, reason=step.comment,
                )
                for step in sorted(cr.approvals, key=lambda item: item.step_order)
            ],
        )
        for cr in change_requests
    ]

    return ProjectReportData(
        project=ProjectInfo(name=context.project.name, exported_at=datetime.now(UTC)),
        tasks=rows,
        critical_path=CriticalPathData(
            task_ids=list(cpm.critical_path), project_duration_days=cpm.project_duration_days,
        ) if cpm else CriticalPathData(),
        change_requests=cr_rows,
        eva=compute_eva(tasks, today),
        burndown=[BurndownRow.from_dashboard_point(point) for point in stats.burndown],
    )


# ---------------------------------------------------------------------------
# Job bền
# ---------------------------------------------------------------------------


async def run_report_job(ctx) -> JobResult:
    payload = ctx.job.payload or {}
    project_id, language = payload.get("project_id"), payload.get("language", "vi")
    if not isinstance(project_id, int) or language not in REPORT_LANGUAGES:
        raise PermanentJobError("invalid_payload")
    async with ctx.session_factory() as db:
        user = await db.get(User, ctx.job.owner_id) if ctx.job.owner_id else None
        if user is None or not user.is_active:
            raise PermanentJobError("project_unavailable")
        try:
            data = await build_report_data(db, project_id, user)
        except UnprocessableException as exc:
            raise PermanentJobError("resource_limit_exceeded") from exc
        except (ForbiddenException, NotFoundException) as exc:
            # Người yêu cầu đã rời dự án hoặc dự án bị xóa trong lúc chờ.
            raise PermanentJobError("project_unavailable") from exc
        await db.rollback()

    content = await asyncio.to_thread(render_project_xlsx, data, language=language)
    # Key không đoán được; bucket private, chỉ tải qua endpoint đã kiểm tra quyền.
    key = f"reports/{project_id}/{uuid.uuid4().hex}.xlsx"
    await ctx.assert_lease()
    try:
        await get_storage_service().put_bytes(key, content, XLSX_CONTENT_TYPE)
    except (StorageError, ValueError) as exc:
        raise PermanentJobError("storage_error") from exc
    return JobResult(result={
        "storage_key": key, "file_size": len(content),
        "filename": report_filename(project_id, language), "language": language,
    })
