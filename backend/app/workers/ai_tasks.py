"""Các tác vụ AI chạy nền qua Celery — xem app/workers/scheduling_tasks.py cho
pattern gốc: mỗi task tự mở AsyncSessionLocal của riêng nó (`asyncio.run(...)`)
vì Celery worker không có event loop hay DB session sẵn từ một request.
"""
import asyncio
import logging
import math
from datetime import UTC, date, datetime, timedelta

from app.db.session import AsyncSessionLocal
from app.workers.celery_app import celery_app

logger = logging.getLogger(__name__)


@celery_app.task(name="ai.generate_project")
def generate_project_task(ai_request_id: int) -> dict:
    """SOP-AI-001: Tạo kế hoạch dự án (Project + Phase + Task + Dependency) từ
    prompt ngôn ngữ tự nhiên đã lưu trong `AIRequest.input_data_json`.

    Không tự động retry: mỗi lần chạy tạo ra một Project mới, nên chạy lại khi
    lỗi sẽ tạo project trùng thay vì sửa lỗi — khác với việc tính lại CPM
    (idempotent) trong scheduling_tasks.py.
    """
    return asyncio.run(_generate_with_own_session(ai_request_id))


async def _generate_with_own_session(ai_request_id: int) -> dict:
    from app.models.ai_request import AIRequest, AIRequestStatus

    async with AsyncSessionLocal() as db:
        ai_request = await db.get(AIRequest, ai_request_id)
        if ai_request is None:
            logger.warning("generate_project_task: AIRequest %s not found", ai_request_id)
            return {"status": "not_found"}

        ai_request.status = AIRequestStatus.PROCESSING
        await db.commit()

        input_data = ai_request.input_data_json or {}
        prompt = input_data.get("prompt", "")
        ai_provider = input_data.get("ai_provider")

        try:
            from app.models.user import User

            user = await db.get(User, ai_request.user_id)
            if user is None:
                raise ValueError("Requesting user no longer exists")

            project_id = await _run_generation(db, ai_request.id, prompt, ai_provider, user)

            ai_request.project_id = project_id
            ai_request.status = AIRequestStatus.COMPLETED
            ai_request.completed_at = datetime.now(UTC)
            await db.commit()
            return {"status": "completed", "project_id": project_id}
        except Exception as exc:
            logger.exception("generate_project_task failed for AIRequest %s", ai_request_id)
            await db.rollback()
            failed_request = await db.get(AIRequest, ai_request_id)
            if failed_request is not None:
                failed_request.status = AIRequestStatus.FAILED
                failed_request.error_message = str(exc)[:2000]
                await db.commit()
            raise


async def _run_generation(db, ai_request_id: int, prompt: str, ai_provider, user) -> int:
    """Gọi AI, ghi Project/Phase/Task/Dependency thật rồi lưu AIOutput. Trả về project_id."""
    from app.core.config import settings
    from app.models.ai_output import AIOutput
    from app.services.ai.model_router import AITaskType, resolve_model
    from app.services.ai.project_generator import generate_project_from_prompt

    started_at = datetime.now(UTC)
    plan = await generate_project_from_prompt(prompt, ai_provider)
    elapsed_ms = int((datetime.now(UTC) - started_at).total_seconds() * 1000)

    project = await _persist_plan(db, plan, user)

    active_provider = ai_provider or settings.ACTIVE_AI_PROVIDER
    model_name = (
        resolve_model(AITaskType.PROJECT_GENERATION) if active_provider == "xkiro" else active_provider
    )
    db.add(
        AIOutput(
            ai_request_id=ai_request_id,
            output_json=plan,
            model_name=model_name,
            processing_time_ms=elapsed_ms,
        )
    )
    return project.id


async def _persist_plan(db, plan: dict, user) -> "object":
    from app.core.exceptions import BadRequestException
    from app.schemas.project import ProjectCreate
    from app.schemas.task import DependencyCreate, TaskCreate
    from app.schemas.wbs import PhaseCreate
    from app.services.project_service import ProjectService
    from app.services.task_service import TaskService
    from app.services.wbs_service import WBSService

    if not isinstance(plan, dict):
        raise BadRequestException("AI response was not a JSON object")

    name = (plan.get("name") or "").strip()
    if not name:
        raise BadRequestException("AI response is missing a project name")

    phases_data = plan.get("phases")
    if not isinstance(phases_data, list) or not phases_data:
        raise BadRequestException("AI response has no phases")

    total_hours = 0.0
    for phase in phases_data:
        if not isinstance(phase, dict):
            continue
        for task in phase.get("tasks") or []:
            hours = task.get("estimated_hours") if isinstance(task, dict) else None
            if isinstance(hours, int | float):
                total_hours += hours

    # Kế hoạch AI không có ngày tháng — suy ra thời lượng dự án từ tổng giờ ước
    # tính (8h/ngày làm việc), có sàn 30 ngày và đệm 1 tuần cho việc điều phối.
    duration_days = max(30, math.ceil(total_hours / 8) + 7)
    start = date.today()
    end = start + timedelta(days=duration_days)

    project_service = ProjectService(db)
    project = await project_service.create(
        ProjectCreate(
            name=name[:200],
            description=(plan.get("description") or None),
            start_date=start,
            end_date=end,
        ),
        pm=user,
    )

    wbs_service = WBSService(db)
    task_service = TaskService(db)

    task_ids_by_name: dict[str, int] = {}
    pending_dependencies: list[tuple[int, list[str]]] = []

    for order_index, phase in enumerate(phases_data):
        if not isinstance(phase, dict):
            continue
        phase_name = (phase.get("name") or "").strip()[:255] or f"Phase {order_index + 1}"
        phase_resp = await wbs_service.create_phase(
            project.id, PhaseCreate(name=phase_name), user
        )

        for task in phase.get("tasks") or []:
            if not isinstance(task, dict):
                continue
            task_name = (task.get("name") or "").strip()
            if not task_name:
                continue
            hours = task.get("estimated_hours")
            task_resp = await task_service.create(
                project.id,
                TaskCreate(
                    name=task_name[:255],
                    phase_id=phase_resp.id,
                    estimated_hours=hours if isinstance(hours, int | float) and hours >= 0 else None,
                ),
                user,
            )
            task_ids_by_name[task_name] = task_resp.id
            deps = task.get("dependencies")
            if isinstance(deps, list) and deps:
                pending_dependencies.append(
                    (task_resp.id, [d for d in deps if isinstance(d, str)])
                )

    # Chỉ giải quyết dependency sau khi TOÀN BỘ task đã được tạo, vì AI có thể
    # tham chiếu một task ở phase khác chưa tới lượt xử lý.
    for task_id, dep_names in pending_dependencies:
        for dep_name in dep_names:
            dep_id = task_ids_by_name.get(dep_name.strip())
            if dep_id is None or dep_id == task_id:
                logger.warning(
                    "Bỏ qua dependency AI không giải quyết được: %r cho task %s",
                    dep_name,
                    task_id,
                )
                continue
            try:
                await task_service.add_dependency(
                    task_id, DependencyCreate(depends_on_task_id=dep_id), user
                )
            except Exception:
                # Vd chu trình phụ thuộc do AI bịa ra — bỏ qua cạnh đó, không
                # làm hỏng toàn bộ project đã tạo thành công.
                logger.warning(
                    "Bỏ qua dependency AI không hợp lệ: %s -> %s", dep_id, task_id, exc_info=True
                )

    return project


@celery_app.task(bind=True, name="ai.impact_analysis")
def impact_analysis_task(self, change_request_id: int):
    """SOP-AI-002: Phân tích tác động của một change request."""
    try:
        # TODO: Cài đặt phần phân tích tác động
        return {"status": "completed", "result": {}}
    except Exception:
        raise


@celery_app.task(bind=True, name="ai.optimize_schedule")
def optimize_schedule_task(self, project_id: int):
    """SOP-AI-003: Tối ưu lịch trình bằng AI."""
    try:
        # TODO: Cài đặt phần tối ưu lịch trình
        return {"status": "completed", "result": {}}
    except Exception:
        raise


@celery_app.task(bind=True, name="ai.risk_analysis")
def risk_analysis_task(self, project_id: int):
    """SOP-AI-005: Phân tích rủi ro bằng AI."""
    try:
        # TODO: Cài đặt phần phân tích rủi ro
        return {"status": "completed", "result": {}}
    except Exception:
        raise


@celery_app.task(bind=True, name="ai.parse_document")
def parse_document_task(self, document_id: int):
    """SOP-DOC-001: Phân tích tài liệu BRD/SRS bằng AI."""
    try:
        # TODO: Cài đặt phần phân tích tài liệu
        return {"status": "completed", "result": {}}
    except Exception:
        raise
