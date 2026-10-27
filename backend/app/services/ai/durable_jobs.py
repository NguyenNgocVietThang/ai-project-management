"""AI provider work is outside transactions; business writes are fenced and atomic."""
from datetime import UTC, datetime

from sqlalchemy import func, select

from app.core.config import settings
from app.core.job_runner import JobResult, PermanentJobError
from app.models.ai_output import AIOutput
from app.models.ai_request import AIRequest, AIRequestStatus, AIRequestType
from app.models.project import Project
from app.models.task import Task
from app.models.user import User
from app.services.ai.job_context import active_ai_context
from app.services.ai.model_router import AITaskType, resolve_model
from app.services.phase2_common import get_project_context

TYPE_MODELS = {
    AIRequestType.PROJECT_GENERATE: AITaskType.PROJECT_GENERATION,
    AIRequestType.IMPACT_ANALYSIS: AITaskType.IMPACT_ANALYSIS,
    AIRequestType.SCHEDULE_OPTIMIZE: AITaskType.SCHEDULE_OPTIMIZATION,
    AIRequestType.RESOURCE_RECOMMEND: AITaskType.RESOURCE_RECOMMENDATION,
    AIRequestType.RISK_ANALYSIS: AITaskType.RISK_ANALYSIS,
    # Hỏi làm rõ hồ sơ yêu cầu dùng lại model của sinh dự án.
    AIRequestType.REQUIREMENT_CLARIFY: AITaskType.PROJECT_GENERATION,
    # B2: sinh quy trình BPMN từ hồ sơ dùng lại model của sinh dự án.
    AIRequestType.BPMN_GENERATE: AITaskType.PROJECT_GENERATION,
}


async def mirror_ai_status(db, job):
    if job.kind.startswith("email.") and job.status in ("succeeded", "failed"):
        job.payload = {"user_id": job.payload.get("user_id")}
        return
    if not job.kind.startswith("ai."):
        return
    request = await db.get(AIRequest, job.payload["ai_request_id"])
    if request is None:
        return
    request.status = {
        "queued": AIRequestStatus.PENDING, "running": AIRequestStatus.PROCESSING,
        "succeeded": AIRequestStatus.COMPLETED, "failed": AIRequestStatus.FAILED,
    }[job.status]
    request.error_message = job.error_code
    if job.status in ("succeeded", "failed"):
        request.completed_at = datetime.now(UTC)


async def authorize_request(db, request):
    user = await db.get(User, request.user_id)
    if user is None or not user.is_active or not user.email_verified:
        raise PermanentJobError("project_unavailable")
    if request.project_id is not None:
        project = await db.get(Project, request.project_id)
        if project is None or project.deleted_at is not None:
            raise PermanentJobError("project_unavailable")
        await get_project_context(db, request.project_id, user)
        total = await db.scalar(select(func.count()).select_from(Task).where(Task.project_id == request.project_id))
        if total > settings.AI_MAX_PROJECT_TASKS:
            raise PermanentJobError("ai_budget_exceeded")
    return user


async def run_ai(ctx):
    async with ctx.session_factory() as db:
        request = await db.get(AIRequest, ctx.job.payload["ai_request_id"])
        if request is None:
            raise PermanentJobError("invalid_payload")
        output = await db.scalar(select(AIOutput).where(AIOutput.ai_request_id == request.id))
        if output is not None:
            return JobResult(result={"ai_request_id": request.id})
        await authorize_request(db, request)
        request_id, request_type = request.id, request.request_type
        input_data = request.input_data_json or {}
        await db.commit()
        token = active_ai_context.set(ctx)
        try:
            if request_type == AIRequestType.PROJECT_GENERATE:
                from app.models.project import ProjectMethodology
                from app.schemas.ai import validated_project_methodology
                from app.services.ai.parsing import parse_json_object

                try:
                    confirmed = ProjectMethodology(input_data["methodology"]) if "methodology" in input_data else None
                except ValueError as exc:
                    raise PermanentJobError("invalid_payload") from exc
                staged = ctx.job.staged_result
                if "brief_id" in input_data:
                    # C4: sinh từ hồ sơ đã chốt; ảnh chụp đọc trước khi gọi provider.
                    from app.models.requirement_brief import RequirementBrief
                    from app.services.ai.project_generator import (
                        build_brief_snapshot_for_generation,
                        generate_project_from_brief,
                    )
                    brief = await db.get(RequirementBrief, input_data["brief_id"])
                    if brief is None or brief.owner_id != request.user_id:
                        raise PermanentJobError("invalid_payload")
                    if brief.status == "consumed" or brief.project_id is not None:
                        # Hồ sơ đã sinh dự án (retry/restart): kết thúc an toàn, không gọi provider.
                        return JobResult(result={"ai_request_id": request_id})
                    if brief.status != "ready":
                        raise PermanentJobError("invalid_payload")
                    snapshot = build_brief_snapshot_for_generation(brief)
                    if confirmed is not None:
                        snapshot["methodology"] = confirmed.value
                    result = parse_json_object(staged["text"]) if staged is not None else await generate_project_from_brief(snapshot)
                else:
                    from app.services.ai.project_generator import generate_project_from_prompt
                    result = parse_json_object(staged["text"]) if staged is not None else await generate_project_from_prompt(input_data["prompt"])
                try:
                    methodology = validated_project_methodology(result, confirmed)
                except ValueError as exc:
                    raise PermanentJobError("invalid_provider_response") from exc
                result = {**result, "methodology": methodology.value}
                phases = result.get("phases", [])
                if len(phases) > 50 or sum(len(p.get("tasks", [])) for p in phases if isinstance(p, dict)) > min(settings.AI_MAX_PROJECT_TASKS, 150):
                    raise PermanentJobError("ai_budget_exceeded")
            elif request_type == AIRequestType.IMPACT_ANALYSIS:
                from app.schemas.impact_report import ImpactReportResponse
                from app.services.ai.impact_analyzer import run_impact_analysis
                report = await run_impact_analysis(db, input_data["change_request_id"])
                result = ImpactReportResponse.model_validate(report).model_dump(mode="json")
            elif request_type == AIRequestType.SCHEDULE_OPTIMIZE:
                from app.services.ai.schedule_optimizer import run_schedule_optimization
                result = await run_schedule_optimization(db, input_data["project_id"], input_data.get("constraints"))
            elif request_type == AIRequestType.RESOURCE_RECOMMEND:
                from app.services.ai.resource_recommender import run_resource_recommendation
                result = await run_resource_recommendation(db, input_data["task_id"])
            elif request_type == AIRequestType.RISK_ANALYSIS:
                from app.schemas.risk_report import RiskReportResponse
                from app.services.ai.risk_analyzer import run_risk_analysis
                report = await run_risk_analysis(db, input_data["project_id"])
                result = RiskReportResponse.model_validate(report).model_dump(mode="json")
            elif request_type == AIRequestType.REQUIREMENT_CLARIFY:
                from app.models.requirement_brief import RequirementBrief
                from app.services.ai.parsing import AIResponseError
                from app.services.ai.requirement_clarifier import (
                    build_brief_snapshot,
                    run_requirement_clarification,
                )
                brief = await db.get(RequirementBrief, input_data.get("brief_id"))
                if brief is None or brief.owner_id != request.user_id or brief.status != "clarifying":
                    raise PermanentJobError("invalid_payload")
                snapshot = build_brief_snapshot(brief)
                try:
                    result = await run_requirement_clarification(snapshot)
                except AIResponseError as exc:
                    # Output sai schema hoặc nhiều câu hỏi: lỗi provider, không ghi hồ sơ.
                    raise PermanentJobError("invalid_provider_response") from exc
            elif request_type == AIRequestType.BPMN_GENERATE:
                from app.services.process_model_service import run_process_generation
                result = await run_process_generation(db, request, input_data)
            else:
                raise PermanentJobError("handler_missing")
        finally:
            active_ai_context.reset(token)
            # Report services only flushed here: undo until fenced final write.
            await db.rollback()

    async def apply(db, job):
        request = await db.get(AIRequest, request_id)
        if request is None:
            raise PermanentJobError("invalid_payload")
        user = await authorize_request(db, request)
        existing = await db.scalar(select(AIOutput).where(AIOutput.ai_request_id == request_id))
        if existing is not None:
            return
        final_result = dict(result)
        if request_type == AIRequestType.PROJECT_GENERATE:
            from app.services.ai.persistence import _persist_plan
            brief = None
            if "brief_id" in input_data:
                # C4: khóa hồ sơ trong cùng transaction với việc tạo dự án.
                from app.services.ai.requirement_clarifier import _lock_brief
                brief = await _lock_brief(db, input_data["brief_id"])
                if brief is None or brief.owner_id != request.user_id:
                    raise PermanentJobError("invalid_payload")
                if brief.status == "consumed" or brief.project_id is not None:
                    # Đã có dự án từ hồ sơ này: không tạo dự án thứ hai.
                    return
                if brief.status != "ready":
                    raise PermanentJobError("invalid_payload")
            from app.services.scheduling_service import recalculate_project
            db.info["defer_cpm"] = True
            try:
                project = await _persist_plan(db, result, user)
            finally:
                db.info.pop("defer_cpm", None)
            await recalculate_project(db, project.id, force_sync=True)
            request.project_id = project.id
            job.project_id = project.id
            if brief is not None:
                brief.project_id = project.id
                brief.status = "consumed"
                brief.pending_job_id = None
        elif request_type == AIRequestType.IMPACT_ANALYSIS:
            from app.models.impact_report import ImpactReport, RiskLevel
            report = await db.scalar(select(ImpactReport).where(ImpactReport.change_request_id == input_data["change_request_id"]))
            if report is None:
                report = ImpactReport(change_request_id=input_data["change_request_id"])
                db.add(report)
            for key in ("risk_score", "schedule_impact_days", "cost_impact", "summary"):
                setattr(report, key, result[key])
            report.risk_level = RiskLevel(result["risk_level"])
            report.affected_tasks_json = result.get("affected_task_ids", result.get("affected_tasks_json", []))
            report.ai_analysis_json = result.get("ai_analysis_json")
            await db.flush()
            from app.schemas.impact_report import ImpactReportResponse
            final_result = ImpactReportResponse.model_validate(report).model_dump(mode="json")
        elif request_type == AIRequestType.RISK_ANALYSIS:
            from app.models.risk_report import RiskLevel, RiskReport
            report = RiskReport(project_id=input_data["project_id"], risk_score=result["risk_score"], risk_level=RiskLevel(result["risk_level"]), risk_factors_json=result.get("risk_factors_json", result.get("risk_factors", [])), mitigation_suggestions_json=result.get("mitigation_suggestions_json", result.get("mitigation_suggestions", [])), summary=result.get("summary"))
            db.add(report)
            await db.flush()
            from app.schemas.risk_report import RiskReportResponse
            final_result = RiskReportResponse.model_validate(report).model_dump(mode="json")
        elif request_type == AIRequestType.REQUIREMENT_CLARIFY:
            from app.services.ai.requirement_clarifier import apply_clarify_result
            try:
                applied = await apply_clarify_result(db, request=request, brief_id=input_data["brief_id"], result=result)
            except (LookupError, PermissionError) as exc:
                raise PermanentJobError("invalid_payload") from exc
            except ValueError as exc:
                raise PermanentJobError("invalid_provider_response") from exc
            if applied is None:
                # Lượt này đã được áp (retry/restart): không áp lần hai.
                return
            final_result = applied
        elif request_type == AIRequestType.BPMN_GENERATE:
            from app.services.process_model_service import persist_process_model
            record = await persist_process_model(db, request=request, input_data=input_data, result=result)
            if record is None:
                # Đã lưu bởi lần áp trước (retry/restart): không ghi hai lần.
                return
            final_result = {"process_model_id": record.id, "version": record.version, "warnings": record.warnings}
        actual_model = (ctx.job.staged_result or {}).get("model") or resolve_model(TYPE_MODELS[request_type])
        db.add(AIOutput(ai_request_id=request_id, output_json=final_result, model_name=actual_model))
        request.status = AIRequestStatus.COMPLETED
        request.completed_at = datetime.now(UTC)

    return JobResult(result={"ai_request_id": request_id}, apply=apply)


AI_HANDLERS = {f"ai.{kind.value.lower()}": run_ai for kind in TYPE_MODELS}
