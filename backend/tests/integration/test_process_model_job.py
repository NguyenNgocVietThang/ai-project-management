"""Integration test B2: job AI sinh quy trình BPMN từ hồ sơ yêu cầu với provider giả."""
import json

import pytest
from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import async_sessionmaker

from app.core.job_runner import JobContext, JobRunner
from app.main import app
from app.models.ai_output import AIOutput
from app.models.ai_request import AIRequest, AIRequestStatus
from app.models.job import Job
from app.models.process_model import ProcessModelRecord
from app.services import process_model_service as svc
from app.services.ai.durable_jobs import AI_HANDLERS, mirror_ai_status, run_ai
from app.services.ai.job_context import active_ai_context, reserve_ai_call
from app.services.ai.parsing import USER_INPUT_FENCE
from app.services.job_service import JobService
from tests.integration.test_document_generation_job import ITEMS, make_project
from tests.integration.test_requirement_clarify_job import exhaust_quota

GOOD = {
    "name": "Đặt cà phê online",
    "lanes": [{"id": "khach", "name": "Khách hàng"}, {"id": "chu", "name": "Chủ quán"}],
    "nodes": [
        {"id": "s", "type": "start_event", "name": "Bắt đầu", "lane_id": "khach"},
        {"id": "dat", "type": "task", "name": "Đặt hàng", "lane_id": "khach"},
        {"id": "g", "type": "exclusive_gateway", "name": "Còn hàng?", "lane_id": "chu"},
        {"id": "giao", "type": "task", "name": "Giao hàng", "lane_id": "chu"},
        {"id": "e", "type": "end_event", "name": "Kết thúc", "lane_id": "chu"},
    ],
    "flows": [
        {"id": "f1", "source": "s", "target": "dat"},
        {"id": "f2", "source": "dat", "target": "g"},
        {"id": "f3", "source": "g", "target": "giao", "label": "Có"},
        # Thiếu nhãn điều kiện: chỉ là cảnh báo lint.
        {"id": "f4", "source": "g", "target": "e"},
        {"id": "f5", "source": "giao", "target": "e"},
    ],
}
# Sai schema: flow trỏ node không tồn tại.
BAD = {**GOOD, "flows": [*GOOD["flows"], {"id": "f9", "source": "giao", "target": "khong_co"}]}


class FakeProvider:
    def __init__(self, payload):
        self.payload = payload
        self.calls = []

    async def generate_json(self, prompt, system_prompt="", task=None):
        context = active_ai_context.get()
        if context.job.staged_result:
            return json.loads(context.job.staged_result["text"])
        await context.mark_dispatched(before_dispatch=reserve_ai_call)
        self.calls.append((json.loads(prompt.split(USER_INPUT_FENCE)[1].strip()), system_prompt))
        await context.stage_result({"text": json.dumps(self.payload)})
        return self.payload


def use_provider(monkeypatch, payload):
    provider = FakeProvider(payload)

    async def factory():
        return provider

    monkeypatch.setattr("app.services.ai.project_generator.get_ai_provider", factory)
    return provider


async def run_jobs(engine, rounds=3):
    for _ in range(rounds):
        runner = JobRunner(async_sessionmaker(engine, expire_on_commit=False), AI_HANDLERS, on_transition=mirror_ai_status)
        claimed = await runner.poll_once()
        await runner.stop()
        if claimed == 0:
            return


def with_items(**changes):
    items = json.loads(json.dumps(ITEMS))
    for key, status in changes.items():
        items[key] = {"status": status, "value": None, "source": None, "proposed_assumption": None}
    return items


@pytest.mark.asyncio
async def test_generates_process_from_brief_and_get_latest(engine, session, make_user, seed_roles, monkeypatch):
    provider = use_provider(monkeypatch, GOOD)
    project, users, brief = await make_project(session, make_user, seed_roles)
    outcome = await svc.request_process_model(session, project.id, users["BA"], "en")
    assert outcome.status == "queued" and outcome.job_id and outcome.ai_request_id
    project_id, request_id, brief_id = project.id, outcome.ai_request_id, brief.id
    # Yêu cầu trùng khi job còn chờ: 409.
    with pytest.raises(HTTPException) as exc:
        await svc.request_process_model(session, project_id, users["PM"])
    assert exc.value.status_code == 409
    await session.commit()
    await run_jobs(engine)

    session.expire_all()
    assert (await session.get(AIRequest, request_id)).status == AIRequestStatus.COMPLETED
    record = await svc.get_latest_process_model(session, project_id)
    assert record.version == 1 and record.language == "en" and record.brief_id == brief_id
    assert record.ai_request_id == request_id and record.model["name"] == "Đặt cà phê online"
    assert any("f4" in warning or "Kết thúc" in warning for warning in record.warnings)
    # Prompt chỉ có dữ liệu hồ sơ clear/assumed (assumed tách riêng), không có đề xuất chưa duyệt.
    body, system_prompt = provider.calls[0]
    assert body["brief"]["assumptions"] == {"in_scope": "GIA_TRI_ASSUMED web và mobile"}
    assert body["brief"]["requirements"]["stakeholders"] == "Chủ quán"
    assert "DE_XUAT_BIA_DAT" not in json.dumps(body, ensure_ascii=False)
    assert body["project"]["tasks"][0]["name"] == "TASK_THAT"
    assert "English" in system_prompt and "Do NOT invent" in system_prompt

    # Mọi thành viên đọc được; có bảng các bước và cảnh báo.
    await session.refresh(users["Member"])
    latest = await svc.read_latest_for_user(session, project_id, users["Member"])
    assert latest["version"] == 1 and latest["steps"][0]["node_id"] == "s"
    assert [lane["id"] for lane in latest["model"]["lanes"]] == ["khach", "chu"]
    assert latest["warnings"] == record.warnings
    model = await svc.get_latest_process(session, project_id)
    assert model is not None and len(model.nodes) == 5

    # Sinh lại tạo phiên bản mới.
    await session.refresh(users["BA"])
    again = await svc.request_process_model(session, project_id, users["BA"])
    await session.commit()
    await run_jobs(engine)
    session.expire_all()
    assert again.status == "queued"
    assert (await svc.get_latest_process_model(session, project_id)).version == 2


@pytest.mark.asyncio
async def test_invalid_schema_output_is_rejected_and_nothing_saved(engine, session, make_user, seed_roles, monkeypatch):
    use_provider(monkeypatch, BAD)
    project, users, _ = await make_project(session, make_user, seed_roles)
    outcome = await svc.request_process_model(session, project.id, users["PM"])
    project_id, request_id = project.id, outcome.ai_request_id
    await session.commit()
    await run_jobs(engine)
    session.expire_all()
    request = await session.get(AIRequest, request_id)
    assert request.status == AIRequestStatus.FAILED and request.error_message == "invalid_provider_response"
    assert await session.scalar(select(func.count()).select_from(ProcessModelRecord)) == 0
    assert await session.scalar(select(AIOutput).where(AIOutput.ai_request_id == request_id)) is None
    assert await svc.get_latest_process_model(session, project_id) is None


@pytest.mark.asyncio
async def test_missing_items_reopen_clarification_without_ai(engine, session, make_user, seed_roles, monkeypatch):
    provider = use_provider(monkeypatch, GOOD)
    # stakeholders missing; key_features missing nhưng in_scope assumed => chỉ stakeholders chặn.
    project, users, brief = await make_project(
        session, make_user, seed_roles, items=with_items(stakeholders="missing", key_features="missing"),
    )
    outcome = await svc.request_process_model(session, project.id, users["PM"])
    assert outcome.status == "needs_clarification" and outcome.job_id is None
    assert outcome.missing_items == ["stakeholders"] and outcome.skipped_items == []
    assert outcome.brief_reopened and brief.status == "clarifying"
    assert await session.scalar(select(func.count()).select_from(Job)) == 0
    assert await session.scalar(select(func.count()).select_from(AIRequest)) == 0
    assert provider.calls == []


@pytest.mark.asyncio
async def test_skipped_items_need_input_but_do_not_reopen(session, make_user, seed_roles, monkeypatch):
    use_provider(monkeypatch, GOOD)
    project, users, brief = await make_project(
        session, make_user, seed_roles,
        items=with_items(stakeholders="skipped", key_features="skipped", in_scope="missing"),
    )
    outcome = await svc.request_process_model(session, project.id, users["PM"])
    assert outcome.status == "needs_clarification"
    # in_scope missing => mở lại hồ sơ; stakeholders/key_features skipped được báo riêng.
    assert outcome.missing_items == ["in_scope"]
    assert outcome.skipped_items == ["stakeholders", "key_features"]

    project2, users2, brief2 = await make_project(
        session, make_user, seed_roles, items=with_items(stakeholders="skipped"),
    )
    outcome = await svc.request_process_model(session, project2.id, users2["PM"])
    assert outcome.status == "needs_clarification" and outcome.missing_items == []
    assert outcome.skipped_items == ["stakeholders"] and not outcome.brief_reopened
    assert brief2.status == "consumed"


@pytest.mark.asyncio
async def test_no_brief_role_language_and_quota(session, make_user, seed_roles, monkeypatch):
    use_provider(monkeypatch, GOOD)
    project, users, _ = await make_project(session, make_user, seed_roles, with_brief=False)
    outcome = await svc.request_process_model(session, project.id, users["PM"])
    assert outcome.status == "needs_clarification" and outcome.missing_items == ["no_brief"]
    with pytest.raises(HTTPException) as exc:
        await svc.request_process_model(session, project.id, users["Member"])
    assert exc.value.status_code == 403
    with pytest.raises(HTTPException) as exc:
        await svc.request_process_model(session, project.id, users["PM"], "fr")
    assert exc.value.status_code == 400

    project2, users2, _ = await make_project(session, make_user, seed_roles)
    exhaust_quota(session)
    await session.flush()
    with pytest.raises(HTTPException) as exc:
        await svc.request_process_model(session, project2.id, users2["PM"])
    assert exc.value.status_code == 429


@pytest.mark.asyncio
async def test_repeated_apply_does_not_write_twice(engine, session, make_user, seed_roles, monkeypatch):
    provider = use_provider(monkeypatch, GOOD)
    project, users, _ = await make_project(session, make_user, seed_roles)
    outcome = await svc.request_process_model(session, project.id, users["BA"])
    request_id = outcome.ai_request_id
    await session.commit()
    factory = async_sessionmaker(engine, expire_on_commit=False)
    async with factory() as db, db.begin():
        claimed = (await JobService.claim(db, 1, 120))[0]
        db.expunge(claimed)
    result = await run_ai(JobContext(claimed, factory))
    assert result.apply is not None and len(provider.calls) == 1
    # Áp hai lần (giả lập retry/restart sau khi đã lưu): chỉ một bản ghi, một AIOutput.
    for _ in range(2):
        async with factory() as db, db.begin():
            await result.apply(db, await db.get(Job, claimed.id))
    session.expire_all()
    assert await session.scalar(select(func.count()).select_from(ProcessModelRecord)) == 1
    assert await session.scalar(
        select(func.count()).select_from(AIOutput).where(AIOutput.ai_request_id == request_id)
    ) == 1
    # Chạy lại job đã có kết quả: không gọi provider lần nữa.
    again = await run_ai(JobContext(claimed, factory))
    assert again.apply is None and len(provider.calls) == 1


@pytest.mark.asyncio
async def test_http_contract(session, make_user, seed_roles, as_user, monkeypatch):
    from app.api.v1.endpoints.process_models import router

    # router.py chưa mount (do điều phối viên thêm); test tự gắn router vào app test.
    if not any(getattr(route, "path", "") == "/api/v1/projects/{project_id}/process-model" for route in app.routes):
        app.include_router(router, prefix="/api/v1")
    use_provider(monkeypatch, GOOD)
    project, users, _ = await make_project(session, make_user, seed_roles)
    url = f"/api/v1/projects/{project.id}/process-model"
    async with as_user(users["Member"]) as http:
        assert (await http.get(url)).status_code == 404
        assert (await http.post(url, json={})).status_code == 403
    async with as_user(users["PM"]) as http:
        response = await http.post(url, json={"language": "vi"})
        assert response.status_code == 202, response.text
        assert response.json()["status"] == "queued" and response.json()["job_id"]
        assert (await http.post(url, json={"language": "xx"})).status_code == 422
    session.add(ProcessModelRecord(
        project_id=project.id, version=1, language="vi", model=GOOD, warnings=[], created_by_id=users["PM"].id,
    ))
    await session.flush()
    async with as_user(users["Member"]) as http:
        body = (await http.get(url)).json()
        assert body["version"] == 1 and body["model"]["name"] == GOOD["name"]
        assert body["steps"] and body["warnings"]

    project2, users2, _ = await make_project(session, make_user, seed_roles, with_brief=False)
    async with as_user(users2["BA"]) as http:
        response = await http.post(f"/api/v1/projects/{project2.id}/process-model")
        assert response.status_code == 200 and response.json()["missing_items"] == ["no_brief"]
