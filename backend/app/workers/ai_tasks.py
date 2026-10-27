"""Các tác vụ AI chạy nền qua Celery — xem app/workers/scheduling_tasks.py cho
pattern gốc: mỗi task tự mở AsyncSessionLocal của riêng nó (`asyncio.run(...)`)
vì Celery worker không có event loop hay DB session sẵn từ một request.
"""
import asyncio
import logging
from datetime import UTC, datetime

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
    # Keep the old Celery import path compatible with the durable implementation.
    from app.services.ai.persistence import _persist_plan as persist_plan

    return await persist_plan(db, plan, user)


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
            # Bản quét tự động không có người thao tác nên gán cho PM của dự án
            # (AIRequest.user_id là NOT NULL).
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
