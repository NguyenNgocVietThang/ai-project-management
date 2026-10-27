# Reproducible local AI-recovery browser evidence

These reports and original screenshots were exported from isolated local QA. No production data or provider was used. The controller inspected the Vietnamese mobile completion/offline screenshots and English desktop long-wait screenshot and found their layout/readability acceptable.

- [Restore matrix](restore-report.json): EN/VI x1440/390, cookie-only new context, delayed profile before owner job GET, existing COMPLETED result, reload and modal close/reopen, unchanged legacy keys, no new generation.
- [Status matrix](states-report.json): all4locale/viewport combinations; actual offline and native hidden tab pause/resume; GET503/manualGET retry; FAILED; missing project link; keyboard checks. Actual120s wall time was exercised once in EN1440.
- [Account boundary](account-report.json): delayed A profile arrives after B profile following UI logout/login; B remains the identity in the same document before a reload, no A job requested as B.
- [Manifest](manifest.json): SHA256/size and sanitization record. Reports contain method/path/status/timing, synthetic IDs and assertion summaries. No cookies, password, authorization/header data, storageState, DB files, fixture.json or backend logs are exported. Source reports needed zero redactions; scanner independently checked current fixture password, JWT patterns and bearer credentials. Selected screenshots are byte-for-byte copies.

Selected visual evidence:

| Scenario | Screenshot |
| --- | --- |
| Vietnamese390px, restored completed result | [Completed](screenshots/restore-vi-390-completed.png) |
| Vietnamese390px, offline state | [Offline](screenshots/states-vi-390-offline.png) |
| English1440px, actual120s wait | [Long wait](screenshots/states-en-1440-long-wait-120s.png) |
| B identity after old A response, same document | [Account B](screenshots/account-b-after-old-a-me-same-document.png) |

## Reproduce

[Harness sources](harness/) are a compact copy of the executed QA scripts. The exported backend fixture generates a random signing key and password at startup; both exist only in its ignored runtime directory. Current run originally used `.superpowers/sdd/2026-10-26-ai-generation-recovery/qa/`; source behavior is unchanged except for replacing the ignored fixture's fixed synthetic signing key with a random one in this export. `runtime/` and `__pycache__/` are ignored beneath the exported harness as well.

Use the isolated pinned Python environment created from `backend/requirements.txt` and `backend/requirements-dev.txt`; do not run from backend/.env. From repository root, after stopping only the already-owned QA backend on3181:

```powershell
& '.superpowers/sdd/2026-10-26-ai-generation-recovery/test-env/pinned-venv/Scripts/python.exe' -u 'docs/ai-generation-recovery-2026-10-26/qa/harness/backend_harness.py' --reset
```

The harness chooses a safe cwd and synthetic loopback settings internally. It replaces DB session factories (including imported security-state alias), provider boundary and lifespan only. Real app routes, cookie/password/JWT checks, verification/permissions/owner gates, enqueue, durable worker/checkpoint and Project/Phase/Task/dependency persistence remain active. Two ordinary verified PM users have only project:create; no superuser/Admin bypass. Application and security state use separate local SQLite files. Outbound backend socket connections are blocked, except Windows asyncio's private loopback socketpair. The initial completed job is generated through the real worker before HTTP startup; its provider dispatch is seed baseline1, recovery delta must0.

Run the real HTTP smoke in a separate shell:

```powershell
& '.superpowers/sdd/2026-10-26-ai-generation-recovery/test-env/pinned-venv/Scripts/python.exe' 'docs/ai-generation-recovery-2026-10-26/qa/harness/smoke_backend.py'
```

Start Next from frontend with NEXT_PUBLIC_API_URL=/api/v1, BACKEND_PROXY_ORIGIN=http://127.0.0.1:3181 and a local NEXT_PUBLIC_WS_URL; use host127.0.0.1/port3180. The scripts allow120s navigation for known cold dev compilation; behavior assertions remain strict. Browser dependency is the installed Playwright1.62.1 runtime and Chrome at the absolute paths in browser_qa.cjs.

```powershell
node 'docs/ai-generation-recovery-2026-10-26/qa/harness/browser_qa.cjs' restore
node 'docs/ai-generation-recovery-2026-10-26/qa/harness/browser_qa.cjs' account
```

Native status visibility requires a real isolated Chrome profile on debugging port3193. Installed Playwright ordinarily forces focus emulation; setting noDefaults:true on a native default context removes that tester override. No visibility property/event is spoofed. Keep one about:blank anchor tab. Start only when3193 is free (the starter refuses to stop another process):

```powershell
& 'docs/ai-generation-recovery-2026-10-26/qa/harness/start_native_chrome.ps1'
$env:QA_NATIVEVIS='1'
$env:QA_HEADED='1'
node 'docs/ai-generation-recovery-2026-10-26/qa/harness/browser_qa.cjs' states
```

The normal Waterfall/account/restore modes use fresh isolated browser contexts, not a personal Chrome profile. Generated cookies/storageState/credentials stay in ignored runtime, and no auth user/token is written to browser storage by the tests. The only seeded browser values are synthetic owner-scoped brief/job IDs and unowned legacy sentinel IDs.

Waterfall mode passed EN/VI x1440/390 through the actual visible selector, request payload, real Project DB methodology, phases/tasks/dependencies/no Sprint and localized saved badge. This functional result is separate from the unresolved startup console issue below. Normal rate limits stay enabled; repeated runs may require waiting for their windows or restarting only the synthetic QA DB.

## Scope and limitations

No commit, push, production deploy/recovery or shutdown was performed by the QA worker. SQLite does not prove PostgreSQL lock/concurrency behavior. A fixture provider does not prove real-model plan/schedule quality. The standard restore run records existing /favicon.ico404; no new pageerror was observed. Controller review owns final integration and visual acceptance.

## Waterfall functional result and startup console limitation

[Waterfall report](waterfall-report.json) passed all4combinations. [Sanitized DB proof](waterfall-db-proof.json) includes the actual request bodies and selected AIRequest, durable Job, Project, Phase, Task and Dependency rows read after real worker persistence. It excludes user/security-state tables, credentials, lease tokens, raw DB files and provider prompts.

| Case | Job / project | Payload / DB method | Phases / tasks / dependencies / Sprints |
| --- | --- | --- | --- |
| EN1440 | 2 / 2 | waterfall / waterfall | 3 / 3 / 2 / 0 |
| EN390 | 3 / 3 | waterfall / waterfall | 3 / 3 / 2 / 0 |
| VI1440 | 4 / 4 | waterfall / waterfall | 3 / 3 / 2 / 0 |
| VI390 | 5 / 5 | waterfall / waterfall | 3 / 3 / 2 / 0 |

Each case observes the accessible native selector initially Agile, explicitly selects Waterfall, captures it before POST, receives202, observes COMPLETED and a saved localized badge. DB count delta is exactly1 Job/AIRequest/Project and provider dispatch delta1 per case. Provider output is a fixture; Project persistence is real and independently queried.

| Case | Before POST | Saved badge |
| --- | --- | --- |
| EN1440 | [Selector](screenshots/waterfall-en-1440-confirmed-selector.png) | [Badge](screenshots/waterfall-en-1440-persisted-badge.png) |
| EN390 | [Selector](screenshots/waterfall-en-390-confirmed-selector.png) | [Badge](screenshots/waterfall-en-390-persisted-badge.png) |
| VI1440 | [Selector](screenshots/waterfall-vi-1440-confirmed-selector.png) | [Badge](screenshots/waterfall-vi-1440-persisted-badge.png) |
| VI390 | [Selector](screenshots/waterfall-vi-390-confirmed-selector.png) | [Badge](screenshots/waterfall-vi-390-persisted-badge.png) |

**Clean-console gate remains unresolved.** Initial real-login had existing/favicon404 and two actual/auth/ws-ticket503 responses; backend emitted two fixed `Durable security state is unavailable` warnings, then tickets recovered to200. No pageerror or AI create/status failure was observed. [Startup diagnostics](waterfall-startup-diagnostics.json) preserves request times, statuses and sanitized warning excerpts. The security-state service intentionally hides underlying exception details, and no lock/timeout/exception traceback appears in the log. The evidence cannot establish a SQLite lock, timeout category or resource-pressure root cause. No application security source was changed, no imported alias was left on a global factory, and no gate or rate limit was bypassed. A focused warm-auth recheck is pending after controller heavy validation; it must not be silently waived.

Cleanup: Playwright browser exited normally; owned Next/backend sessions received Ctrl+C. Controller confirmed ports stopped. Native QA Chrome was already absent. No personal Chrome, other user app, shutdown or commit was performed.
