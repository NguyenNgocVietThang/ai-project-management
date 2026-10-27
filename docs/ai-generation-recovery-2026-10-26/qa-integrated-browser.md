# AI recovery local browser QA evidence

QA uses real Next dev frontend127.0.0.1:3180 and FastAPI127.0.0.1:3181 with actual authentication/cookies, ordinary PM owners and isolated application/security SQLite DBs. Backend runs pinned dependencies from the disposable test environment. Only provider boundary and session factories/lifespan are substituted; durable enqueue/runner/checkpoint/authorization/business persistence are real. No production DB/provider/mail/Redis connection; backend outbound sockets are blocked.

Detailed reproducible harness: `.superpowers/sdd/2026-10-26-ai-generation-recovery/qa/setup-report.md`. Runtime credentials and generated artifacts stay in ignored `qa/runtime/`; no credentials are included here.

| Gate | Evidence |
| --- | --- |
| Pinned backend real HTTP auth/DB smoke | PASS: login httpOnly cookies; cookie-only refresh/me; owner COMPLETED restore; foreign job403/brief404; GET503->GET200; logout revokes401 |
| Existing completed job restore | PASS: EN/VI x1440/390, new cookie-only browser context, no jobGET before delayedme200 |
| Reload/modal close-reopen | PASS: all4 combinations, no new creationPOST/AIRequest/Project/provider dispatch |
| Owner-scoped recovery/legacy | PASS: all4 combinations preserve unowned legacy keys and recover only owner-scoped IDs |
| Pending/processing/status failure | PASS: all4 combinations include GET503/manualGETretry, FAILED, COMPLETED missing project link/recheck |
| Offline/online | PASS: actual browser offline event/network state, GET polling pauses and resumes |
| Hidden/visible tab | PASS: actual native Chrome tab switch, document.visibilityState checked as hidden; no synthetic event/property override |
| Long wait | PASS: actual120s wall time in EN1440, displays long-wait copy and GET-only check button |
| Keyboard | PASS: Tab stays in dialog; Escape closes all4 rows |
| Late profile after logout/accountB | PASS: captured A profile delayed30s arrives after B profile; same document remains B before reload; no A job requested as B |
| Visible Waterfall selector->POST->DB->badge | PASS: EN/VI x1440/390; Project2-5 actual DB waterfall, 3phases/3tasks/2dependencies/0Sprints each; one dispatch each |

Native visibility needs Chrome CDP attachment with public noDefaults:true on its default context: installed Playwright1.62.1 ordinarily forces focus emulation, which keeps all tabs reported visible. QA disables that tester default via native attachment rather than spoofing app visibility.

Raw evidence and screenshots (relative to QA runtime/browser):

- `restore-report.json`: request/response timing, scenario assertions, screenshot paths for `restore-{en,vi}-{1440,390}-{cookie-bootstrap,completed}.png`.
- `states-report.json`: all status matrix assertions and screenshot paths `states-{en,vi}-{1440,390}-*.png`.
- `states-en-1440-long-wait-120s.png`: actual elapsed long-wait UI.
- `smoke-report.json`: initial UI login and new-context cookie bootstrap.
- Backend `smoke-report.json`, `smoke-snapshot.json`, `smoke-pinned.log`, `backend-pinned.log`: real DB rows and HTTP evidence.

Initial real DB smoke:1 Project,3 Phases,3 Tasks,2 Dependencies,0 Sprints,1 AIOutput; durable job succeeded/attempt1 with dispatch timestamp. Recovery changed none of these counts. JobService clears staged_result after success as expected. State controls deliberately alter synthetic AIRequest projection for UI error-state tests, not provider outcome evidence.

Known limits: SQLite does not prove PostgreSQL locking/concurrency. Provider is deterministic and says nothing about actual model plan/schedule quality. Standard restore run records existing frontend /favicon.ico404; native status run has no console entries. Raw failures from deliberate offline/503 injections remain available; no new pageerror was observed. Visual screenshot review belongs to controller. No deployment or production recovery performed.

Delayed-profile race evidence: runtime/browser/account-report.json plus delayed-me-empty-owner-restoring.png, account-b-after-old-a-me-same-document.png and account-b-no-a-recovery.png. The browser assertion checks A response arrived after B and verifies B identity before any full navigation can erase a stale store value. Initial observation timeout equaled injected delay and was corrected in QA only to65s. The real application API timeout remains unchanged.

Final DB spot check after restore/status/account matrices:1 durable Job,1 AIRequest,1 Project, providerCalls1 (initial seed only). This independently verifies no durable queue insertion across all recovery checks.

Tracked sanitized export: [QA evidence](qa/README.md), [Waterfall report](qa/waterfall-report.json), [selected DB rows and request bodies](qa/waterfall-db-proof.json), [startup diagnostics](qa/waterfall-startup-diagnostics.json). All4Waterfall cases passed functional assertions and captured selected Waterfall before POST plus localized saved badge. Final clean-console gate remains unresolved because initial login produced two actual ws-ticket503s and two security-state warnings, followed by200 recovery. No underlying exception/SQLite lock trace is available, and no cause is asserted; a warm-auth recheck is pending after controller heavy gates. These are preserved rather than reported as a clean console. Owned QA servers/browser have been stopped; no machine shutdown or other-app cleanup occurred.
