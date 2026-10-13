"""Integration test HTTP cho API tài liệu SRS/BRD (D3) với storage giả, không gọi AI thật."""
import pytest
from sqlalchemy import select

from app.models.generated_document import GeneratedDocument
from app.models.job import Job
from app.models.project import Project
from app.services import document_service
from tests.integration.test_document_generation_job import ITEMS, FakeStorage, make_project

DOCX = b"PK\x03\x04fake-docx"


def base(project_id):
    return f"/api/v1/projects/{project_id}/documents"


async def _ready_document(session, project, storage):
    document = GeneratedDocument(
        project_id=project.id, doc_type="SRS", language="vi", version=1, status="ready",
        section_groups=[["a"], ["b"]], sections={"0": {}, "1": {}}, warnings=["assumption_used"],
        storage_key="documents/1/srs.docx", file_size=len(DOCX),
    )
    session.add(document)
    await session.flush()
    storage.objects[document.storage_key] = (DOCX, "application/octet-stream")
    return document


@pytest.mark.asyncio
async def test_generate_returns_202_with_job_and_list_shows_progress(session, make_user, seed_roles, as_user):
    project, users, _ = await make_project(session, make_user, seed_roles)
    async with as_user(users["PM"]) as http:
        response = await http.post(base(project.id), json={"doc_type": "SRS", "language": "en"})
        assert response.status_code == 202, response.text
        body = response.json()
        assert body["job_id"] and body["document"]["status"] == "queued"
        assert body["document"]["job_id"] == body["job_id"]
        assert body["document"]["progress"]["completed_groups"] == 0
        assert body["document"]["progress"]["total_groups"] >= 1
        await session.commit()

        listed = await http.get(base(project.id))
        assert listed.status_code == 200
        assert [doc["id"] for doc in listed.json()] == [body["document"]["id"]]
        assert listed.json()[0]["job_status"] == "queued"

        # Yêu cầu trùng khi job còn chạy: 409.
        again = await http.post(base(project.id), json={"doc_type": "SRS", "language": "en"})
        assert again.status_code == 409


@pytest.mark.asyncio
async def test_generate_needs_clarification_returns_200(session, make_user, seed_roles, as_user):
    project, users, _ = await make_project(session, make_user, seed_roles, with_brief=False)
    async with as_user(users["BA"]) as http:
        response = await http.post(base(project.id), json={"doc_type": "SRS"})
        assert response.status_code == 200, response.text
        body = response.json()
        assert body["job_id"] is None
        assert body["document"]["status"] == "needs_clarification"
        assert body["document"]["missing_items"] == ["no_brief"]
        assert body["document"]["language"] == "vi"


@pytest.mark.asyncio
async def test_generate_validation_and_member_role(session, make_user, seed_roles, as_user):
    project, users, _ = await make_project(session, make_user, seed_roles, items=ITEMS)
    async with as_user(users["PM"]) as http:
        assert (await http.post(base(project.id), json={"doc_type": "XYZ"})).status_code == 422
        assert (await http.post(base(project.id), json={"doc_type": "SRS", "language": "fr"})).status_code == 422
    async with as_user(users["Member"]) as http:
        assert (await http.post(base(project.id), json={"doc_type": "SRS"})).status_code in (403, 404)


@pytest.mark.asyncio
async def test_download_ready_document_and_headers(session, make_user, seed_roles, as_user, monkeypatch):
    storage = FakeStorage()
    monkeypatch.setattr(document_service, "get_storage_service", lambda: storage)
    project, users, _ = await make_project(session, make_user, seed_roles)
    document = await _ready_document(session, project, storage)
    async with as_user(users["Member"]) as http:
        detail = await http.get(f"{base(project.id)}/{document.id}")
        assert detail.status_code == 200
        assert detail.json()["progress"] == {"completed_groups": 2, "total_groups": 2}
        assert detail.json()["warnings"] == ["assumption_used"]

        response = await http.get(f"{base(project.id)}/{document.id}/download")
        assert response.status_code == 200
        assert response.content == DOCX
        assert response.headers["content-type"].startswith(
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
        assert response.headers["cache-control"] == "private, no-store"
        disposition = response.headers["content-disposition"]
        assert disposition.startswith("attachment;") and "SRS-v1-vi.docx" in disposition


@pytest.mark.asyncio
async def test_outsider_cannot_read_or_download(session, make_user, seed_roles, as_user, monkeypatch):
    storage = FakeStorage()
    monkeypatch.setattr(document_service, "get_storage_service", lambda: storage)
    project, _users, _ = await make_project(session, make_user, seed_roles)
    document = await _ready_document(session, project, storage)
    outsider = await make_user()
    async with as_user(outsider) as http:
        for url in (base(project.id), f"{base(project.id)}/{document.id}", f"{base(project.id)}/{document.id}/download"):
            response = await http.get(url)
            assert response.status_code in (403, 404), url
            assert response.content != DOCX
        assert (await http.post(base(project.id), json={"doc_type": "SRS"})).status_code in (403, 404)


@pytest.mark.asyncio
async def test_document_of_other_project_is_404(session, make_user, seed_roles, as_user, monkeypatch):
    storage = FakeStorage()
    monkeypatch.setattr(document_service, "get_storage_service", lambda: storage)
    project, users, _ = await make_project(session, make_user, seed_roles)
    document = await _ready_document(session, project, storage)
    other = Project(name="Dự án khác", pm_id=users["PM"].id)
    session.add(other)
    await session.flush()
    async with as_user(users["PM"]) as http:
        assert (await http.get(f"{base(other.id)}/{document.id}")).status_code in (403, 404)
        assert (await http.get(f"{base(other.id)}/{document.id}/download")).status_code in (403, 404)


@pytest.mark.asyncio
async def test_not_ready_download_409_and_dead_job_shown_failed(session, make_user, seed_roles, as_user):
    project, users, _ = await make_project(session, make_user, seed_roles)
    async with as_user(users["PM"]) as http:
        created = (await http.post(base(project.id), json={"doc_type": "SRS"})).json()
        doc_id = created["document"]["id"]
        assert (await http.get(f"{base(project.id)}/{doc_id}/download")).status_code == 409

        # Worker chết: job failed nhưng bản ghi còn generating -> API hiển thị failed.
        job = await session.scalar(select(Job).where(Job.id == created["job_id"]))
        job.status = "failed"
        document = await session.get(GeneratedDocument, doc_id)
        document.status = "generating"
        await session.flush()
        detail = (await http.get(f"{base(project.id)}/{doc_id}")).json()
        assert detail["status"] == "failed" and detail["error_code"] == "job_failed"
