# Frontend durable jobs verification

Verified locally on 2026-10-09. This covers task 9 in `tasks/todo.md`.

## Behavior

- The dashboard loads the current user's recent jobs from `/jobs` after authentication has been restored. A browser refresh creates a fresh server query; job recovery does not depend on local storage. Query keys include the actor ID, and the panel remounts when the actor changes so expanded results cannot carry over.
- Recent work displays queued, running, completed and failed states, feature links and saved AI results. Quota/budget, project size and uncertain external outcomes have explanatory messages; other failures show the backend's sanitized error code. English and Vietnamese messages are available.
- The list polls every five seconds only while queued/running jobs exist. Completed/failed AI status checks stop. Transient errors retry with a five-to-thirty-second backoff, including a transient refetch failure with previously cached terminal data. Access errors (401/403/404) stop timers and automatic focus/reconnect retries; manual refresh remains available.
- Hidden/offline pages disable polling and cancel in-flight requests through TanStack Query's abort signals. Logout/actor changes/unmount release the previous observer; service requests consume its signal. An unauthenticated panel renders safely without a QueryClient provider. This is UI isolation; backend ownership checks remain authoritative.
- Dashboard bootstrap distinguishes a temporarily unreachable refresh endpoint from an invalid session. A temporary failure leaves authentication unhydrated, shows a recovery notice and provides a retry button. A definitive invalid session redirects to login.

## Local verification

- `npm test -- --maxWorkers=1`: 12 files, 52 tests passed; exit 0 (72.42 seconds). Covers polling/backoff/terminal and access handling, remount recovery, actor cache separation, hidden/offline/logout cancellation, panel output/failure messages and dashboard bootstrap recovery. An earlier parallel run hit two worker-start timeouts under local resource contention; the final serial run had no unhandled errors.
- `npm run type-check`: exit 0.
- `npm run lint`: exit 0, no diagnostics.
- `npm run build`: exit 0 for both the local configuration and the Render profile below; all application routes remain server-rendered. Nineteen static pages were generated during compilation, with middleware retained.

Render-profile build overrides:

```powershell
$env:NEXT_PUBLIC_API_URL='/api/v1'
$env:BACKEND_PROXY_ORIGIN='https://backend.onrender.com'
$env:NEXT_PUBLIC_WS_URL='wss://backend.onrender.com'
npm run build
```

The hostname is an example used for local compilation. No request was made to that host during these checks.

## Browser verification

Playwright launched an isolated installed Chrome instance and rendered the actual `JobsPanel`, authentication store, query hooks, services, translations and application CSS in a temporary Vite fixture. Only backend responses were replaced by an Axios adapter; no provider/email/cloud requests were sent. The fixture supplied Next's environment constants, which Next normally replaces during bundling.

Passed: restored result and project link, page reload, English/Vietnamese switching, a 390-pixel viewport without horizontal overflow, simulated backend 503 followed by automatic recovery, and actor switching without the previous actor's result. The final check exited 0 with no page errors. The mobile screenshot was inspected and is retained at `docs/verification/jobs-panel-mobile.png`.

All four `.jobs-browser*` fixture files were removed and the fixture server stopped after verification. The screenshot includes fixture controls for language/actor/backend simulation, which are not application features.

## Limits

This verifies local frontend behavior against controlled responses. It does not certify a deployed Render cold start, real Supabase database recovery, provider output or real email delivery. Backend authorization/restart durability requires the separate database-backed tests and cloud acceptance described in the deployment checklist. Browser page-error collection checks runtime exceptions; it does not claim a complete accessibility or performance audit.
