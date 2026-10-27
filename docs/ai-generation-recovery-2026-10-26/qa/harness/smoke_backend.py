"""Real HTTP smoke checks for backend_harness.py on loopback:3181."""
import asyncio
import json
from pathlib import Path
import httpx

HERE = Path(__file__).resolve().parent
BASE = "http://127.0.0.1:3181"
CONTROL = {"x-qa-control": "local-recovery-qa"}

async def smoke():
    async with httpx.AsyncClient(base_url=BASE, timeout=70, trust_env=False) as a, httpx.AsyncClient(base_url=BASE, timeout=70, trust_env=False) as b:
        for _ in range(40):
            try:
                snapshot = await a.get("/__qa/snapshot", headers=CONTROL)
                if snapshot.status_code == 200:
                    break
            except httpx.ConnectError:
                pass
            await asyncio.sleep(1)
        snapshot.raise_for_status()
        before = snapshot.json()
        fixture = before["fixture"]
        evidence = {"fixture": fixture, "checks": {}}
        login = await a.post("/api/v1/auth/login", data={"username": fixture["email_a"], "password": fixture["password"]})
        assert login.status_code == 200, login.text
        assert "refresh_token" not in login.json()
        cookies = [{"name": c.name, "path": c.path, "httponly": c.has_nonstandard_attr("HttpOnly")} for c in a.cookies.jar]
        assert any(c["name"] == "refresh-token" and c["httponly"] for c in cookies)
        evidence["checks"]["real_login_httpOnly_cookies"] = cookies
        # Cookie-only bootstrap: discard the login access token; POST refresh sends cookie.
        refresh = await a.post("/api/v1/auth/refresh")
        assert refresh.status_code == 200, refresh.text
        token = refresh.json()["access_token"]
        a.headers["authorization"] = f"Bearer {token}"
        me = await a.get("/api/v1/auth/me")
        assert me.status_code == 200 and me.json()["id"] == fixture["owner_a"], me.text
        assert me.json()["is_superuser"] is False
        assert {r["name"] for r in me.json()["roles"]} == {"PM"}
        evidence["checks"]["cookie_bootstrap_me"] = {"status": me.status_code, "owner_id": me.json()["id"], "is_superuser": False}
        result = await a.get(f'/api/v1/ai/jobs/{fixture["completed_job_id"]}')
        assert result.status_code == 200 and result.json()["status"] == "COMPLETED", result.text
        assert result.json()["project_id"] == fixture["completed_project_id"]
        evidence["checks"]["preexisting_completed_restore"] = result.json()
        brief = await a.get(f'/api/v1/requirement-briefs/{fixture["completed_brief_id"]}')
        assert brief.status_code == 200 and brief.json()["status"] == "consumed", brief.text
        login_b = await b.post("/api/v1/auth/login", data={"username": fixture["email_b"], "password": fixture["password"]})
        assert login_b.status_code == 200, login_b.text
        b.headers["authorization"] = f'Bearer {login_b.json()["access_token"]}'
        foreign = await b.get(f'/api/v1/ai/jobs/{fixture["completed_job_id"]}')
        assert foreign.status_code == 403, foreign.text
        foreign_brief = await b.get(f'/api/v1/requirement-briefs/{fixture["completed_brief_id"]}')
        assert foreign_brief.status_code == 404, foreign_brief.text
        evidence["checks"]["foreign_owner_rejected"] = {"job": foreign.status_code, "brief": foreign_brief.status_code}
        # Injection executes after real auth+owner endpoint checks.
        await a.post("/__qa/control", headers=CONTROL, json={"job_get_503_remaining": 1})
        failure = await a.get(f'/api/v1/ai/jobs/{fixture["completed_job_id"]}')
        retry = await a.get(f'/api/v1/ai/jobs/{fixture["completed_job_id"]}')
        assert failure.status_code == 503 and retry.status_code == 200
        evidence["checks"]["GET503_GET_retry"] = [failure.status_code, retry.status_code]
        after = (await a.get("/__qa/snapshot", headers=CONTROL)).json()
        assert len(after["provider_calls"]) == len(before["provider_calls"]) == 1
        assert len(after["tables"]["ai_requests"]) == len(before["tables"]["ai_requests"]) == 1
        assert len(after["tables"]["projects"]) == len(before["tables"]["projects"]) == 1
        assert len(after["tables"]["phases"]) == 3 and len(after["tables"]["tasks"]) == 3
        assert len(after["tables"]["dependencies"]) == 2 and len(after["tables"]["sprints"]) == 0
        assert len(after["tables"]["ai_outputs"]) == 1
        durable = after["tables"]["jobs"][0]
        assert durable["status"] == "succeeded" and durable["request_dispatched"] and durable["request_dispatched_at"]
        creation = [r for r in after["requests"] if r["method"] == "POST" and "/generate-project" in r["path"]]
        assert creation == []
        evidence["checks"]["restore_no_creation_no_dispatch"] = {"creation_http_posts": 0, "new_ai_requests": 0, "provider_calls_delta": 0}
        evidence["checks"]["actual_db_persistence"] = {"projects": 1, "phases": 3, "tasks": 3, "dependencies": 2, "sprints": 0, "ai_outputs": 1, "durable_status": durable["status"], "stage_cleared_after_success": durable["staged_result"] is None}
        logout = await a.post("/api/v1/auth/logout")
        assert logout.status_code == 200, logout.text
        revoked = await a.get("/api/v1/auth/me")
        assert revoked.status_code == 401, revoked.text
        evidence["checks"]["real_logout_revokes_access"] = revoked.status_code
        final = (await a.get("/__qa/snapshot", headers=CONTROL)).json()
        (HERE / "runtime" / "smoke-snapshot.json").write_text(json.dumps(final, indent=2, ensure_ascii=False), encoding="utf-8")
        evidence["outcome"] = "PASS"
        (HERE / "runtime" / "smoke-report.json").write_text(json.dumps(evidence, indent=2, ensure_ascii=False), encoding="utf-8")
        print(json.dumps({"outcome": evidence["outcome"], "checks": evidence["checks"]}, indent=2, ensure_ascii=False))

asyncio.run(smoke())


