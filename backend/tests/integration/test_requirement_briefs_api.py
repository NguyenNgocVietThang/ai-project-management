"""Integration test HTTP cho API hồ sơ yêu cầu (C3), provider AI giả."""
import pytest
from sqlalchemy import func, select

from app.models.job import Job
from app.models.requirement_brief import RequirementBrief
from tests.integration.test_requirement_clarify_job import (
    FakeProvider,
    exhaust_quota,
    make_runner,
    use_provider,
)

BASE = "/api/v1/requirement-briefs"
TURN = {
    "items": [
        {"key": "goals", "status": "clear", "value": "Bán cà phê online"},
        {"key": "constraints", "status": "missing", "proposed_assumption": "Ngân sách nhỏ"},
    ],
    "next_question": "Ai là khách hàng chính?",
}


async def _job_count(session):
    return await session.scalar(select(func.count()).select_from(Job))


async def _reload(session, user):
    # Lượt AI chạy ở session khác: làm mới dữ liệu, nạp lại user để dependency không lazy-load.
    session.expire_all()
    await session.refresh(user)


async def _create(http, session):
    response = await http.post(BASE, json={"idea": "  Ứng dụng bán cà phê  "})
    assert response.status_code == 202, response.text
    await session.commit()
    return response.json()


async def _run_turn(engine, monkeypatch, payload=TURN):
    use_provider(monkeypatch, FakeProvider(payload))
    runner = make_runner(engine)
    assert await runner.poll_once() == 1
    await runner.stop()


@pytest.mark.asyncio
async def test_full_flow_create_answer_accept_finalize(engine, session, make_user, as_user, monkeypatch):
    user = await make_user()
    async with as_user(user) as http:
        created = await _create(http, session)
        brief = created["brief"]
        assert brief["idea"] == "Ứng dụng bán cà phê" and brief["status"] == "clarifying"
        assert brief["pending_turn"]["job_id"] == created["job_id"]
        assert brief["item_counts"] == {"clear": 0, "missing": 7, "assumed": 0, "skipped": 0, "total": 7, "resolved": 0}
        assert brief["turns_remaining"] == brief["max_turns"]

        await _run_turn(engine, monkeypatch)
        await _reload(session, user)
        detail = (await http.get(f"{BASE}/{brief['id']}")).json()
        # Lượt đã áp xong: không còn lượt chờ.
        assert detail["pending_turn"] is None
        assert detail["open_question"] == "Ai là khách hàng chính?"
        assert detail["item_counts"]["resolved"] == 1 and detail["turns_remaining"] == detail["max_turns"] - 1

        response = await http.post(f"{BASE}/{brief['id']}/answer", json={
            "answer": "Dân văn phòng", "item_updates": [{"key": "stakeholders", "status": "clear", "value": "Chủ quán"}],
        })
        assert response.status_code == 202, response.text
        body = response.json()
        assert body["brief"]["qa_history"][-1]["answer"] == "Dân văn phòng"
        assert body["brief"]["items"]["stakeholders"]["source"] == "user"
        assert body["brief"]["open_question"] is None
        assert body["brief"]["pending_turn"]["job_id"] == body["job_id"]

        # Giả định đề xuất: chấp nhận có sửa giá trị, không gọi AI.
        jobs_before = await _job_count(session)
        response = await http.post(f"{BASE}/{brief['id']}/assumptions/constraints/accept", json={"value": "Dưới 50 triệu"})
        assert response.status_code == 200, response.text
        item = response.json()["items"]["constraints"]
        assert item == {"status": "assumed", "value": "Dưới 50 triệu", "source": "ai_assumption_confirmed", "proposed_assumption": None}
        assert await _job_count(session) == jobs_before

        # Còn mục missing => không chốt được.
        assert (await http.post(f"{BASE}/{brief['id']}/finalize")).status_code == 409
        for key in ("in_scope", "out_of_scope", "key_features", "success_criteria"):
            response = await http.patch(f"{BASE}/{brief['id']}/items/{key}", json={"status": "clear", "value": f"Giá trị {key}"})
            assert response.status_code == 200, response.text
        detail = response.json()
        assert detail["can_finalize"] is True and detail["item_counts"]["resolved"] == 7
        response = await http.post(f"{BASE}/{brief['id']}/finalize")
        assert response.status_code == 200 and response.json()["status"] == "ready"

        # Hồ sơ ready: từ chối trả lời/sửa.
        assert (await http.post(f"{BASE}/{brief['id']}/answer", json={"answer": "x"})).status_code == 409
        assert (await http.patch(f"{BASE}/{brief['id']}/items/goals", json={"status": "clear", "value": "y"})).status_code == 409
        assert (await http.post(f"{BASE}/{brief['id']}/skip")).status_code == 409


@pytest.mark.asyncio
async def test_answer_while_turn_running_is_rejected_without_second_job(session, make_user, as_user):
    user = await make_user()
    async with as_user(user) as http:
        created = await _create(http, session)
        brief_id = created["brief"]["id"]
        jobs = await _job_count(session)
        for _ in range(3):
            response = await http.post(f"{BASE}/{brief_id}/answer", json={"answer": "Trả lời sớm"})
            assert response.status_code == 409 and response.json()["detail"] == "clarify_turn_pending"
        assert await _job_count(session) == jobs
        brief = await session.get(RequirementBrief, brief_id)
        assert brief.pending_job_id == created["job_id"] and brief.qa_history == []


@pytest.mark.asyncio
async def test_answer_without_open_question_conflicts(engine, session, make_user, as_user, monkeypatch):
    user = await make_user()
    async with as_user(user) as http:
        created = await _create(http, session)
        await _run_turn(engine, monkeypatch, {"items": [], "next_question": None})
        await _reload(session, user)
        response = await http.post(f"{BASE}/{created['brief']['id']}/answer", json={"answer": "x"})
        assert response.status_code == 409 and response.json()["detail"] == "no_open_question"
        # Không kèm câu trả lời: chạy lại lượt AI.
        response = await http.post(f"{BASE}/{created['brief']['id']}/answer", json={})
        assert response.status_code == 202


@pytest.mark.asyncio
async def test_other_user_gets_404_everywhere(session, make_user, as_user):
    owner, other = await make_user(), await make_user()
    async with as_user(owner) as http:
        brief_id = (await _create(http, session))["brief"]["id"]
    async with as_user(other) as http:
        calls = [
            http.get(f"{BASE}/{brief_id}"),
            http.post(f"{BASE}/{brief_id}/answer", json={"answer": "x"}),
            http.post(f"{BASE}/{brief_id}/assumptions/goals/accept", json={"value": "x"}),
            http.post(f"{BASE}/{brief_id}/assumptions/goals/reject"),
            http.patch(f"{BASE}/{brief_id}/items/goals", json={"status": "clear", "value": "x"}),
            http.post(f"{BASE}/{brief_id}/skip"),
            http.post(f"{BASE}/{brief_id}/finalize"),
        ]
        for call in calls:
            response = await call
            assert response.status_code == 404 and response.json()["detail"] == "brief_not_found"
        assert (await http.get(BASE)).json() == []
        assert (await http.get(f"{BASE}/999999")).status_code == 404


@pytest.mark.asyncio
async def test_skip_marks_missing_skipped_and_ready(engine, session, make_user, as_user, monkeypatch):
    user = await make_user()
    async with as_user(user) as http:
        brief_id = (await _create(http, session))["brief"]["id"]
        await _run_turn(engine, monkeypatch)
        await _reload(session, user)
        response = await http.post(f"{BASE}/{brief_id}/skip")
        assert response.status_code == 200, response.text
        body = response.json()
        assert body["status"] == "ready" and body["pending_turn"] is None
        assert body["items"]["goals"]["status"] == "clear"
        skipped = [key for key, item in body["items"].items() if item["status"] == "skipped"]
        assert len(skipped) == 6 and body["item_counts"]["missing"] == 0


@pytest.mark.asyncio
async def test_reject_assumption_keeps_missing(engine, session, make_user, as_user, monkeypatch):
    user = await make_user()
    async with as_user(user) as http:
        brief_id = (await _create(http, session))["brief"]["id"]
        await _run_turn(engine, monkeypatch)
        await _reload(session, user)
        response = await http.post(f"{BASE}/{brief_id}/assumptions/constraints/reject")
        assert response.status_code == 200
        assert response.json()["items"]["constraints"] == {"status": "missing", "value": None, "source": "ai", "proposed_assumption": None}
        # Không còn đề xuất: chấp nhận/từ chối lần nữa bị 409.
        assert (await http.post(f"{BASE}/{brief_id}/assumptions/constraints/reject")).status_code == 409
        assert (await http.post(f"{BASE}/{brief_id}/assumptions/constraints/accept")).status_code == 409
        assert (await http.patch(f"{BASE}/{brief_id}/items/bogus", json={"status": "clear", "value": "x"})).status_code == 422
        assert (await http.patch(f"{BASE}/{brief_id}/items/goals", json={"status": "clear"})).status_code == 422


@pytest.mark.asyncio
async def test_create_with_quota_exhausted_leaves_no_brief(session, make_user, as_user):
    user = await make_user()
    exhaust_quota(session)
    await session.flush()
    async with as_user(user) as http:
        response = await http.post(BASE, json={"idea": "Ý tưởng"})
        assert response.status_code == 429
    count = await session.scalar(select(func.count()).select_from(RequirementBrief))
    assert count == 0


@pytest.mark.asyncio
async def test_list_newest_first_with_limit(session, make_user, as_user):
    user = await make_user()
    async with as_user(user) as http:
        ids = [(await _create(http, session))["brief"]["id"] for _ in range(3)]
        listed = (await http.get(BASE, params={"limit": 2})).json()
        assert [row["id"] for row in listed] == [ids[2], ids[1]]
        assert listed[0]["item_counts"]["total"] == 7
        assert (await http.get(BASE, params={"limit": 0})).status_code == 422


@pytest.mark.asyncio
@pytest.mark.parametrize("invalid", ["scrum", "WATERFALL", "", 42])
async def test_invalid_project_methodology_is_422_before_enqueue(session, make_user, seed_roles, as_user, invalid):
    from app.models.ai_request import AIRequest
    from tests.integration.test_project_from_brief_job import make_brief

    user = await make_user(roles=[seed_roles["Admin"]])
    brief = await make_brief(session, user)
    async with as_user(user) as http:
        response = await http.post("/api/v1/ai/generate-project-from-brief",
                                   json={"brief_id": brief.id, "methodology": invalid})
    assert response.status_code == 422
    assert any(error["loc"][-1] == "methodology" for error in response.json()["detail"])
    assert await _job_count(session) == 0
    assert await session.scalar(select(func.count()).select_from(AIRequest)) == 0
    assert brief.pending_job_id is None
