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

        try:
            from app.models.user import User

            user = await db.get(User, ai_request.user_id)
            if user is None:
                raise ValueError("Requesting user no longer exists")

            project_id = await _run_generation(db, ai_request.id, prompt, user)

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


async def _run_generation(db, ai_request_id: int, prompt: str, user) -> int:
    """Gọi AI, ghi Project/Phase/Task/Dependency thật rồi lưu AIOutput. Trả về project_id."""
    from app.models.ai_output import AIOutput
    from app.services.ai.model_router import AITaskType, resolve_model
    from app.services.ai.project_generator import generate_project_from_prompt

    started_at = datetime.now(UTC)
    plan = await generate_project_from_prompt(prompt)
    elapsed_ms = int((datetime.now(UTC) - started_at).total_seconds() * 1000)

    project = await _persist_plan(db, plan, user)

    model_name = resolve_model(AITaskType.PROJECT_GENERATION)
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

    # Một model đôi khi trả "phases" dạng list chuỗi tên phase kèm "tasks" là một
    # mảng phẳng riêng ở cấp cao nhất, thay vì phases[].tasks[] lồng nhau như đã
    # yêu cầu trong SYSTEM_PROMPT. Nếu không chặn ở đây, vòng lặp bên dưới âm thầm
    # bỏ qua mọi phần tử không phải dict và tạo ra một Project rỗng (0 phase, 0
    # task) nhưng vẫn báo COMPLETED — người dùng tưởng AI đã sinh xong kế hoạch.
    has_any_task = any(
        isinstance(phase, dict) and any(isinstance(task, dict) for task in (phase.get("tasks") or []))
        for phase in phases_data
    )
    if not has_any_task:
        raise BadRequestException(
            "AI response did not match the expected phases[].tasks[] shape"
        )

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


async def _run_ai_job(
    ai_request_id: int, *, task_type, runner, to_output_json
) -> dict:
    """Khung chung cho 4 job AI ở dưới (impact/schedule/resource/risk) — cùng
    vòng đời với `_generate_with_own_session` ở trên (SOP-AI-001): tự mở
    AsyncSessionLocal riêng, PENDING -> PROCESSING -> COMPLETED/FAILED, ghi
    AIOutput khi xong. `runner(db, **input_data)` chạy logic AI thật;
    `to_output_json(result)` chuyển kết quả thành dict JSON-serializable đúng
    hình dạng mà frontend từng feature đã tự định nghĩa (xem các
    `*.types.ts` tương ứng)."""
    from app.models.ai_output import AIOutput
    from app.models.ai_request import AIRequest, AIRequestStatus
    from app.services.ai.model_router import resolve_model

    async with AsyncSessionLocal() as db:
        ai_request = await db.get(AIRequest, ai_request_id)
        if ai_request is None:
            logger.warning("_run_ai_job: AIRequest %s not found", ai_request_id)
            return {"status": "not_found"}

        ai_request.status = AIRequestStatus.PROCESSING
        await db.commit()

        input_data = ai_request.input_data_json or {}
        try:
            started_at = datetime.now(UTC)
            result = await runner(db, input_data)
            elapsed_ms = int((datetime.now(UTC) - started_at).total_seconds() * 1000)

            db.add(
                AIOutput(
                    ai_request_id=ai_request.id,
                    output_json=to_output_json(result),
                    model_name=resolve_model(task_type),
                    processing_time_ms=elapsed_ms,
                )
            )
            ai_request.status = AIRequestStatus.COMPLETED
            ai_request.completed_at = datetime.now(UTC)
            await db.commit()
            return {"status": "completed"}
        except Exception as exc:
            logger.exception("AI job failed for AIRequest %s (type=%s)", ai_request_id, task_type)
            await db.rollback()
            failed_request = await db.get(AIRequest, ai_request_id)
            if failed_request is not None:
                failed_request.status = AIRequestStatus.FAILED
                failed_request.error_message = str(exc)[:2000]
                await db.commit()
            raise


@celery_app.task(name="ai.impact_analysis")
def impact_analysis_task(ai_request_id: int) -> dict:
    """SOP-AI-002: Phân tích tác động của một change request."""
    return asyncio.run(_impact_analysis_with_own_session(ai_request_id))


async def _impact_analysis_with_own_session(ai_request_id: int) -> dict:
    from app.schemas.impact_report import ImpactReportResponse
    from app.services.ai.impact_analyzer import run_impact_analysis
    from app.services.ai.model_router import AITaskType

    async def runner(db, input_data):
        return await run_impact_analysis(db, input_data["change_request_id"])

    def to_output_json(report):
        return ImpactReportResponse.model_validate(report).model_dump(mode="json")

    return await _run_ai_job(
        ai_request_id,
        task_type=AITaskType.IMPACT_ANALYSIS,
        runner=runner,
        to_output_json=to_output_json,
    )


@celery_app.task(name="ai.optimize_schedule")
def optimize_schedule_task(ai_request_id: int) -> dict:
    """SOP-AI-003: Tối ưu lịch trình bằng AI (chỉ đề xuất, không ghi đè Task)."""
    return asyncio.run(_optimize_schedule_with_own_session(ai_request_id))


async def _optimize_schedule_with_own_session(ai_request_id: int) -> dict:
    from app.services.ai.model_router import AITaskType
    from app.services.ai.schedule_optimizer import run_schedule_optimization

    async def runner(db, input_data):
        return await run_schedule_optimization(
            db, input_data["project_id"], input_data.get("constraints")
        )

    return await _run_ai_job(
        ai_request_id,
        task_type=AITaskType.SCHEDULE_OPTIMIZATION,
        runner=runner,
        to_output_json=lambda result: result,
    )


@celery_app.task(name="ai.resource_recommendation")
def resource_recommendation_task(ai_request_id: int) -> dict:
    """SOP-AI-004 / SOP-RM-001: Đề xuất nhân sự phù hợp cho 1 task."""
    return asyncio.run(_resource_recommendation_with_own_session(ai_request_id))


async def _resource_recommendation_with_own_session(ai_request_id: int) -> dict:
    from app.services.ai.model_router import AITaskType
    from app.services.ai.resource_recommender import run_resource_recommendation

    async def runner(db, input_data):
        return await run_resource_recommendation(db, input_data["task_id"])

    return await _run_ai_job(
        ai_request_id,
        task_type=AITaskType.RESOURCE_RECOMMENDATION,
        runner=runner,
        to_output_json=lambda result: result,
    )


@celery_app.task(name="ai.risk_analysis")
def risk_analysis_task(ai_request_id: int) -> dict:
    """SOP-AI-005: Phân tích rủi ro bằng AI, ghi vào bảng risk_reports."""
    return asyncio.run(_risk_analysis_with_own_session(ai_request_id))


async def _risk_analysis_with_own_session(ai_request_id: int) -> dict:
    from app.schemas.risk_report import RiskReportResponse
    from app.services.ai.model_router import AITaskType
    from app.services.ai.risk_analyzer import run_risk_analysis

    async def runner(db, input_data):
        return await run_risk_analysis(db, input_data["project_id"])

    def to_output_json(report):
        return RiskReportResponse.model_validate(report).model_dump(mode="json")

    return await _run_ai_job(
        ai_request_id,
        task_type=AITaskType.RISK_ANALYSIS,
        runner=runner,
        to_output_json=to_output_json,
    )


@celery_app.task(name="ai.sweep_active_projects_for_risk")
def sweep_active_projects_for_risk() -> dict:
    """SOP-AI-005: quét định kỳ (Celery Beat) — enqueue risk_analysis cho từng
    project đang ACTIVE, mỗi project một AIRequest/job riêng (đứng tên hệ thống,
    không gắn user_id thật) để không có ai phải tự bấm "Run risk scan" thủ công.
    Enqueue từng project độc lập, một project lỗi không chặn các project khác."""
    return asyncio.run(_sweep_active_projects_for_risk())


async def _sweep_active_projects_for_risk() -> dict:
    from sqlalchemy import select

    from app.models.ai_request import AIRequest, AIRequestStatus, AIRequestType
    from app.models.project import Project, ProjectStatus

    queued = 0
    async with AsyncSessionLocal() as db:
        project_ids = list(
            (
                await db.scalars(
                    select(Project.id).where(
                        Project.status == ProjectStatus.ACTIVE, Project.deleted_at.is_(None)
                    )
                )
            ).all()
        )
        for project_id in project_ids:
            project = await db.get(Project, project_id)
            if project is None:
                continue
            # Quét tự động không có user thao tác — gán cho PM cua du an de AIRequest
            # van co user_id hop le (cot nay NOT NULL) va PM la nguoi hop ly nhat de
            # xem lai job neu can.
            ai_request = AIRequest(
                project_id=project_id,
                user_id=project.pm_id,
                request_type=AIRequestType.RISK_ANALYSIS,
                status=AIRequestStatus.PENDING,
                input_data_json={"project_id": project_id},
            )
            db.add(ai_request)
            await db.flush()
            try:
                risk_analysis_task.delay(ai_request.id)
                queued += 1
            except Exception:
                logger.exception(
                    "sweep_active_projects_for_risk: could not queue project_id=%s", project_id
                )
        await db.commit()
    return {"queued": queued}


@celery_app.task(bind=True, name="ai.parse_document")
def parse_document_task(self, document_id: int):
    """SOP-DOC-001: Phân tích tài liệu BRD/SRS bằng AI."""
    try:
        # TODO: Cài đặt phần phân tích tài liệu
        return {"status": "completed", "result": {}}
    except Exception:
        raise
