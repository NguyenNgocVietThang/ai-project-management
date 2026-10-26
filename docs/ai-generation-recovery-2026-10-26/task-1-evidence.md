# Task 1: restored session identity — implementation report

Status: IMPLEMENTED, local verification passed; fresh controller review pending.
Workspace: C:\BA\AI Project Planning & Portfolio Management system (main, explicitly selected by user).
Scope: approved plan Tasks 1–4; this checkpoint contains Task 1 only. No push, deployment, production mutation, provider request, or redispatch occurred.

## Root cause and change

`useAuth()` read `/auth/me` into a global `['auth', 'me']` React Query cache and returned that query identity without setting `useAuthStore.user`. Restored sessions could render an authenticated shell while job polling remained disabled because its owner came from the store. The constant cache key and unguarded direct profile loads also allowed old account identity to survive logout/account replacement.

The hook now synchronizes only a current-session profile in an effect and returns the store identity as its single source. `/auth/me` keys use opaque numeric in-memory session and token generations; no credential is included. Old profile requests fail their session checks and old profile caches are removed. Login and register begin an explicit identity boundary; refresh preserves identity while changing token generation. Direct login/register/resend profile loads check the session before and after awaiting the profile and cannot navigate or repopulate store/cache after replacement.

Logout invalidates client identity immediately, including while server logout is pending. Controller approved the necessary adjacent `auth.service.ts` change: the service captures the bearer for server-side revocation before the client clear. Its public `logout()` signature and cookie request behavior remain unchanged. Logout is excluded from automatic refresh, so a logout failure cannot bootstrap the discarded identity. The API rejects stale refresh responses, old-session 401 handling, and a queued retry carrying a superseded opaque session marker; normal concurrent same-owner refresh remains single-flight.

No auth/owner gate was removed. No token is persisted. TaskViews components, backend, UI copy, package files and test configuration were untouched.

## Files

- frontend/src/hooks/useAuth.ts
- frontend/src/hooks/useAuth.test.tsx (new)
- frontend/src/store/authStore.ts
- frontend/src/services/api.ts
- frontend/src/services/api.test.ts
- frontend/src/services/auth.service.ts (adjacent security change approved by controller)
- frontend/src/services/auth.service.test.ts (new)
- frontend/src/features/jobs/hooks/useAIJobPolling.test.tsx
- frontend/src/app/(dashboard)/layout.test.tsx

## Red evidence captured before corresponding source changes

Commands use the checked-in frontend Vitest entrypoint, one worker, CLI test timeout 15000. Commands run from the repository root unless the frontend working directory is explicitly noted. The timeout is a host runtime allowance only; no repository test configuration or assertion was weakened.

1. Working directory `frontend`: `node node_modules/vitest/vitest.mjs run src/hooks/useAuth.test.tsx src/features/jobs/hooks/useAIJobPolling.test.tsx src/services/api.test.ts --maxWorkers=1 --testTimeout=15000`
   - Saved `docs/ai-generation-recovery-2026-10-26/task-1-red.txt`.
   - Exit 1: 12 assertion failures, 11 passes. Failures include restored store null, restored owner unavailable to GET polling, previous profile returned after account switch/logout, late direct login/register/resend profile repopulation, and stale refresh returning true after logout/switch.
2. `node frontend/node_modules/vitest/vitest.mjs run --root frontend 'src/app/(dashboard)/layout.test.tsx' --maxWorkers=1 --testTimeout=15000`
   - Saved `task-1-layout-red.txt` in the same evidence directory.
   - Exit 1: cookie bootstrap retry restores the shell but store user id is undefined instead of 1.
3. `node frontend/node_modules/vitest/vitest.mjs run --root frontend src/services/auth.service.test.ts --maxWorkers=1 --testTimeout=15000`
   - Saved `task-1-logout-red.txt` before changing the service.
   - Exit 1: captured Authorization is undefined instead of the synthetic fixture bearer when local identity is immediately cleared.
4. `node frontend/node_modules/vitest/vitest.mjs run --root frontend src/services/api.test.ts -t 'queued authenticated retry' --maxWorkers=1 --testTimeout=15000`
   - Saved `task-1-retry-race-red.txt` before adding the interceptor request-boundary guard.
   - Exit 1: request resolves instead of rejecting after replacement session. The name filter intentionally focuses this red demonstration; all API tests run in the final green group.

The initial green attempt is retained as `task-1-green-initial.txt`: 29/30 passed; recovered GET had started, but its terminal result awaited another React Query notification tick under fake timers. Added that notification tick without changing any outcome assertion. Final green confirms the terminal result.

## Final verification

`node frontend/node_modules/vitest/vitest.mjs run --root frontend src/hooks/useAuth.test.tsx src/features/jobs/hooks/useAIJobPolling.test.tsx 'src/app/(dashboard)/layout.test.tsx' src/services/api.test.ts src/services/auth.service.test.ts src/store/authStore.test.ts src/features/jobs/hooks/jobPolling.test.ts src/features/jobs/hooks/useJobs.test.tsx src/features/jobs/components/JobsPanel.test.tsx src/features/auth/components/accountUi.test.tsx --maxWorkers=1 --testTimeout=15000`

- Exit 0: 10 files, 62 tests passed, no warnings/errors (`task-1-green.txt`).
- Restored `{ accessToken: fixture, hasHydrated: true, user: null }` resolves profile into the store, enables owner-authorized `getJob`, reaches COMPLETED and asserts `generateProject` was never called.
- Failed `/auth/me` leaves store anonymous and `getJob` uncalled; generation remains uncalled.
- Covers logout/account switch/same-token reauthentication, pending token rotation, successful and stale direct login/register/resend profiles, cookie bootstrap retry and invalid session redirect, normal concurrent refresh, stale refresh, queued retries and preserved bearer revocation.
- Full frontend lint: `node node_modules/eslint/bin/eslint.js src --ext .js,.jsx,.ts,.tsx`, exit 0 (`task-1-lint.txt`).
- Full frontend TypeScript: `node node_modules/typescript/bin/tsc --noEmit`, exit 0 (`task-1-types.txt`).
- `git diff --check`: passed after trimming trailing blank lines.
- Review of complete scoped source diff: no credentials except explicit synthetic fixtures; no provider calls or gate removal.

These are deterministic component/API-adapter tests. No live browser or production service was exercised by this worker. Controller owns the fresh review and later integrated/browser gates.

## Checkpoint and Graphify

Local scoped checkpoint is created after these gates. Stage only the nine listed implementation/test files and task-1-* evidence. Preserve user plan, root QA/baseline evidence and TaskViews history. The requested report at `.superpowers/sdd/2026-10-26-ai-generation-recovery/task-1-report.md` is ignored by repository policy and remains available locally; this evidence copy is committed for review.

Controller explicitly deferred `graphify update .` to Task 4. Use the installed hook's documented `GRAPHIFY_SKIP_HOOK=1` only for this local checkpoint to avoid a redundant background rebuild; no test/lint hook is disabled. No Graphify output belongs to this checkpoint.

Concerns: no known implementation blocker. Await fresh controller review; browser and production verification are outside this worker's evidence.
