"""Local-only real-app QA harness. Run directly; never via production app import.

Only DB sessions, provider boundary and app lifespan are substituted. Authentication,
owner checks, enqueue, durable runner, checkpoint, persistence and API routes are real.
"""
import asyncio
import copy
import json
import os
from pathlib import Path
import socket
import secrets
import sys
from contextlib import asynccontextmanager
from datetime import UTC, datetime

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]
BACKEND = ROOT / "backend"
os.chdir(HERE)  # Settings must never discover backend/.env.
sys.path.insert(0, str(BACKEND))
SAFE_ENV = {
    "APP_ENV": "development", "DEPLOYMENT_PROFILE": "local",
    "DATABASE_URL": "postgresql+asyncpg://ai_recovery_test:synthetic@127.0.0.1:55449/ai_recovery_test",
    "DATABASE_SSL": "false", "DATABASE_DISABLE_PREPARED_STATEMENTS": "false",
    "SECRET_KEY": secrets.token_urlsafe(48),
    "REDIS_URL": "redis://127.0.0.1:6398/0", "CELERY_BROKER_URL": "redis://127.0.0.1:6398/1",
    "CELERY_RESULT_BACKEND": "redis://127.0.0.1:6398/2", "SECURITY_STATE_BACKEND": "database",
    "XKIRO_API_KEY": "", "XKIRO_BASE_URL": "http://127.0.0.1:55448/v1",
    "SMTP_HOST": "127.0.0.1", "SMTP_PORT": "55447", "SMTP_USER": "", "SMTP_PASSWORD": "",
    "RESEND_API_KEY": "", "GOOGLE_CLIENT_ID": "", "GOOGLE_CLIENT_SECRET": "",
    "SUPABASE_URL": "", "SUPABASE_SERVICE_ROLE_KEY": "", "FCM_SERVICE_ACCOUNT_JSON": "",
    "PUSH_PROVIDER": "disabled", "JOBS_ENABLED": "false",
    "ALLOWED_HOSTS": '["127.0.0.1","localhost"]',
    "CORS_ORIGINS": '["http://127.0.0.1:3180","http://localhost:3180"]',
    "FRONTEND_URL": "http://127.0.0.1:3180",
}
os.environ.update(SAFE_ENV)
# Defense in depth: this backend process needs NO outbound sockets. No provider,
# mail, Redis, global Postgres connection, or DNS request can escape the fixture.
_original_connect = socket.socket.connect
_original_socketpair = socket.socketpair
_internal_socketpair = False
def local_socketpair(*args, **kwargs):
    # Windows asyncio implements its private self-pipe using a loopback socketpair.
    global _internal_socketpair
    _internal_socketpair = True
    try:
        return _original_socketpair(*args, **kwargs)
    finally:
        _internal_socketpair = False
socket.socketpair = local_socketpair
def no_connect(sock, address):
    if _internal_socketpair and address[0] in {"127.0.0.1", "::1"}:
        return _original_connect(sock, address)
    raise OSError("QA harness blocks all outbound socket connections")
socket.socket.connect = no_connect
socket.socket.connect_ex = no_connect

from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import event, func, select
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
import app.db.base
import app.db.session as db_session
from app.models.base import Base
from app.models.user import User
from app.models.role import Role
from app.models.permission import Permission
from app.models.requirement_brief import RequirementBrief
from app.models.ai_request import AIRequest, AIRequestStatus
from app.models.project import Project
from app.models.job import Job
from app.models.task import Task
from app.models.dependency import Dependency
from app.models.phase import Phase
from app.models.sprint import Sprint
from app.models.ai_output import AIOutput
from app.core.security import hash_password
from app.schemas.requirement_brief import REQUIREMENT_ITEM_KEYS

DATA = HERE / "runtime"
DATA.mkdir(exist_ok=True)
DB_PATH = DATA / "application.sqlite3"
SECURITY_DB_PATH = DATA / "security.sqlite3"
engine = create_async_engine(f"sqlite+aiosqlite:///{DB_PATH.as_posix()}", connect_args={"timeout": 15})
security_engine = create_async_engine(f"sqlite+aiosqlite:///{SECURITY_DB_PATH.as_posix()}", connect_args={"timeout": 15})
for local_engine in (engine, security_engine):
    @event.listens_for(local_engine.sync_engine, "connect")
    def sqlite_setup(connection, record):
        cursor = connection.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()
factory = async_sessionmaker(engine, expire_on_commit=False, autoflush=False)
security_factory = async_sessionmaker(security_engine, expire_on_commit=False, autoflush=False)
db_session.AsyncSessionLocal = factory
db_session.SecuritySessionLocal = security_factory
db_session.engine = engine
db_session.security_engine = security_engine
# Explicitly replace the imported alias as required by durable security services.
import app.services.security_state_service as security_state
security_state.AsyncSessionLocal = security_factory

from app.main import app
from app.core.job_runner import JobRunner
from app.services.ai.durable_jobs import AI_HANDLERS, mirror_ai_status
from app.services.ai.job_context import active_ai_context
from app.services.ai_service import AIService
import app.services.ai.project_generator as project_generator

PASSWORD = secrets.token_urlsafe(24)
CONTROL = "local-recovery-qa"
state = {"requests": [], "provider_calls": [], "me_delay_ms": 0,
         "job_get_503_remaining": 0, "runner_paused": False, "fixture": {}}
PLAN = {
    "name": "QA Recovery Waterfall", "description": "Synthetic local fixture, real persistence",
    "methodology": "waterfall", "phases": [
        {"name": "Requirements", "tasks": [{"name": "Approve requirements", "estimated_hours": 8}]},
        {"name": "Implementation", "tasks": [{"name": "Implement solution", "estimated_hours": 16,
                                              "dependencies": ["Approve requirements"]}]},
        {"name": "Verification", "tasks": [{"name": "Acceptance verification", "estimated_hours": 8,
                                            "dependencies": ["Implement solution"]}]},
    ],
}
class FixtureProvider:
    async def generate_json(self, prompt, system_prompt="", task=None):
        context = active_ai_context.get()
        if context.job.staged_result:
            return json.loads(context.job.staged_result["text"])
        await context.mark_dispatched()
        state["provider_calls"].append({"job_id": context.job_id, "prompt": prompt,
                                         "system_prompt": system_prompt, "at": datetime.now(UTC).isoformat()})
        payload = copy.deepcopy(PLAN)
        await context.stage_result({"text": json.dumps(payload), "model": "local-fixture-only"})
        return payload
async def provider_factory():
    return FixtureProvider()
project_generator.get_ai_provider = provider_factory


def ready_items():
    return {key: {"status": "clear", "value": f"Synthetic QA {key}", "source": "user",
                  "proposed_assumption": None} for key in REQUIREMENT_ITEM_KEYS}

async def make_ready_brief(db, owner_id):
    brief = RequirementBrief(owner_id=owner_id, idea="Synthetic QA recovery project",
                             items=ready_items(), qa_history=[], status="ready")
    db.add(brief)
    await db.flush()
    return brief

async def seed():
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
    async with security_engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
    async with factory() as db:
        # Refuse to treat an old run as fresh. Restart explicitly with --reset.
        if await db.scalar(select(func.count()).select_from(User)):
            raise RuntimeError("QA database already seeded; use --reset for a new isolated run")
        permission = Permission(resource="project", action="create")
        role = Role(name="PM", description="Ordinary QA project creator", permissions=[permission])
        db.add(role)
        users = []
        for label in ("a", "b"):
            user = User(email=f"recovery-{label}@qa.example", username=f"recovery_{label}",
                        full_name=f"Recovery QA {label.upper()}", hashed_password=hash_password(PASSWORD),
                        is_active=True, email_verified=True, is_superuser=False, auth_version=0,
                        roles=[role])
            db.add(user)
            await db.flush()
            users.append(user)
        old_brief = await make_ready_brief(db, users[0].id)
        response = await AIService(db).request_project_generation_from_brief(old_brief.id, users[0], request_key="qa-preexisting")
        ready_a = await make_ready_brief(db, users[0].id)
        ready_b = await make_ready_brief(db, users[1].id)
        state["fixture"] = {"owner_a": users[0].id, "owner_b": users[1].id,
                            "email_a": users[0].email, "email_b": users[1].email, "password": PASSWORD,
                            "completed_job_id": response.job_id, "completed_brief_id": old_brief.id,
                            "ready_brief_a": ready_a.id, "ready_brief_b": ready_b.id}
        await db.commit()
    seed_runner = JobRunner(factory, AI_HANDLERS, on_transition=mirror_ai_status)
    await seed_runner.poll_once()
    await seed_runner.stop()
    async with factory() as db:
        request = await db.get(AIRequest, int(response.job_id))
        if request.status != AIRequestStatus.COMPLETED or request.project_id is None:
            raise RuntimeError(f"Real seed durable job failed: {request.status} {request.error_message}")
        state["fixture"]["completed_project_id"] = request.project_id
    state["fixture"]["seed_provider_calls"] = len(state["provider_calls"])
    (DATA / "fixture.json").write_text(json.dumps(state["fixture"], indent=2), encoding="utf-8")

async def runner_loop(stop):
    runner = JobRunner(factory, AI_HANDLERS, on_transition=mirror_ai_status)
    try:
        while not stop.is_set():
            if not state["runner_paused"]:
                await runner.poll_once()
            try:
                await asyncio.wait_for(stop.wait(), timeout=0.25)
            except TimeoutError:
                pass
    finally:
        await runner.stop()

@asynccontextmanager
async def local_lifespan(app):
    await seed()
    stop = asyncio.Event()
    loop = asyncio.create_task(runner_loop(stop))
    try:
        yield
    finally:
        stop.set()
        await loop
        (DATA / "requests.json").write_text(json.dumps(state["requests"], indent=2), encoding="utf-8")
        (DATA / "provider-calls.json").write_text(json.dumps(state["provider_calls"], indent=2), encoding="utf-8")
        await engine.dispose()
        await security_engine.dispose()
app.router.lifespan_context = local_lifespan

@app.middleware("http")
async def evidence_and_controls(request: Request, call_next):
    path = request.url.path
    item = {"method": request.method, "path": path, "at": datetime.now(UTC).isoformat()}
    # Record authenticated token subject only, never token or cookies.
    from app.core.security import decode_token
    auth = request.headers.get("authorization", "")
    if auth.startswith("Bearer "):
        payload = decode_token(auth[7:]) or {}
        item["subject"] = payload.get("sub")
    delay_ms = state["me_delay_ms"] if path == "/api/v1/auth/me" else 0
    response = await call_next(request)
    if delay_ms:
        await asyncio.sleep(delay_ms / 1000)
    if path.startswith("/api/v1/ai/jobs/") and request.method == "GET" and response.status_code == 200 and state["job_get_503_remaining"]:
        state["job_get_503_remaining"] -= 1
        response = JSONResponse({"detail": "Synthetic QA status service unavailable"}, status_code=503)
    item["status"] = response.status_code
    if not path.startswith("/__qa"):
        state["requests"].append(item)
    return response


def guard(request):
    if not request.client or request.client.host not in {"127.0.0.1", "::1"} or request.headers.get("x-qa-control") != CONTROL:
        raise HTTPException(403, "Local QA control header required")

class Controls(BaseModel):
    model_config = ConfigDict(extra="forbid")
    me_delay_ms: int = Field(default=0, ge=0, le=60000)
    job_get_503_remaining: int = Field(default=0, ge=0, le=100)
    runner_paused: bool = False
    clear_evidence: bool = False

@app.post("/__qa/control")
async def control(body: Controls, request: Request):
    guard(request)
    for key in ("me_delay_ms", "job_get_503_remaining", "runner_paused"):
        state[key] = getattr(body, key)
    if body.clear_evidence:
        state["requests"].clear()
        state["provider_calls"].clear()
    return {key: state[key] for key in ("me_delay_ms", "job_get_503_remaining", "runner_paused")}

class JobState(BaseModel):
    model_config = ConfigDict(extra="forbid")
    status: AIRequestStatus
    missing_project_link: bool = False
    error: str | None = "synthetic_qa_failure"

@app.post("/__qa/job/{job_id}")
async def job_state(job_id: int, body: JobState, request: Request):
    guard(request)
    async with factory() as db, db.begin():
        row = await db.get(AIRequest, job_id)
        if row is None:
            raise HTTPException(404, "Unknown QA job")
        row.status = body.status
        row.error_message = body.error if body.status == AIRequestStatus.FAILED else None
        row.project_id = None if body.missing_project_link else state["fixture"]["completed_project_id"]
    return {"job_id": job_id, "status": body.status.value}

@app.post("/__qa/brief/{owner_id}")
async def new_brief(owner_id: int, request: Request):
    guard(request)
    if owner_id not in {state["fixture"]["owner_a"], state["fixture"]["owner_b"]}:
        raise HTTPException(404, "Unknown fixture owner")
    async with factory() as db, db.begin():
        brief = await make_ready_brief(db, owner_id)
        return {"brief_id": brief.id, "owner_id": owner_id}

@app.get("/__qa/snapshot")
async def snapshot(request: Request):
    guard(request)
    async with factory() as db:
        tables = {}
        for model in (User, RequirementBrief, AIRequest, Job, Project, Phase, Task, Dependency, Sprint, AIOutput):
            rows = (await db.scalars(select(model).order_by(model.id))).all()
            columns = [column.name for column in model.__table__.columns]
            # Exclude password/token hashes. Remaining rows are synthetic local data only.
            columns = [key for key in columns if not any(s in key for s in ("password", "token", "secret"))]
            tables[model.__tablename__] = [{key: getattr(row, key) for key in columns} for row in rows]
    from fastapi.encoders import jsonable_encoder
    return jsonable_encoder({"fixture": state["fixture"], "requests": state["requests"],
                             "provider_calls": state["provider_calls"], "tables": tables,
                             "db_paths": [str(DB_PATH), str(SECURITY_DB_PATH)],
                             "auth_overrides": [], "outbound_sockets": "blocked"})

if __name__ == "__main__":
    if "--reset" in sys.argv:
        # Fixed, verified QA-only files; never recurse or touch another workspace.
        for db_path in (DB_PATH, SECURITY_DB_PATH):
            assert db_path.parent == DATA and DATA.parent == HERE
            for suffix in ("", "-wal", "-shm"):
                Path(str(db_path) + suffix).unlink(missing_ok=True)
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=3181, access_log=True)



