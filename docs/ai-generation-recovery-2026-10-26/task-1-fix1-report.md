# Task 1 fix round 1: preserve current profile and reject stale service profiles

Status: DONE. Implementation, self-review, full covering tests, lint and TypeScript passed. Fresh independent re-review pending.

## Scope and changes

Resumed the interrupted fix round from existing uncommitted changes, rather than restarting Task 1 or changing Tasks 2-4. The four source/test changes were already drafted and needed no further source modification after inspection.

- `useAuth` restoration effect fills only an empty current store identity. It reads the live store before writing and keeps the session/token-generation checks. A newer profile or email verification update remains authoritative when another consumer mounts or an older restoration request completes.
- `authService.me` captures the opaque session generation before requesting `/auth/me` and rejects a result after local logout or session replacement. It checks session generation rather than token generation so ordinary same-owner refresh remains valid. This protects existing direct service callers before their subsequent `setUser` continuation.
- Two real-hook regressions cover cached profile/verification updates followed by another consumer mount, and an older in-flight profile completing after a newer store update.
- Service tests cover late logout/account replacement responses and successful same-owner token rotation. The existing captured-bearer logout test remains intact.

No public hook/store/service signature changed. No auth/owner condition was removed. No token persistence, provider request, production mutation, push, deployment, or job redispatch occurred.

## Red evidence retained from interrupted worker

- `task-1-fix1-red.txt`: `node frontend/node_modules/vitest/vitest.mjs run --root frontend src/hooks/useAuth.test.tsx -t 'preserves' --maxWorkers=1 --testTimeout=15000` failed the two requested stale-profile assertions: newer full name/avatar and `email_verified: true` reverted to the prior profile/false. The existing restoration effect unconditionally overwrote store identity.
- `task-1-fix1-service-red.txt`: `node frontend/node_modules/vitest/vitest.mjs run --root frontend src/services/auth.service.test.ts --maxWorkers=1 --testTimeout=15000` failed the logout and replacement-session cases because the promise resolved the old user instead of rejecting. Same-owner rotation and bearer revocation passed.
- `task-1-fix1-service-initial.txt` retains the corresponding initial 10-file run: 65 passed / 2 failed before the service guard.
- `task-1-fix1-green.txt` retains the interrupted worker's subsequent successful 10-file / 67-test result. Fresh verification by this replacement worker is recorded separately below.

## Fresh verification

Working directory: `C:/BA/AI Project Planning & Portfolio Management system/frontend`.

Full covering suite command:

```powershell
node node_modules/vitest/vitest.mjs run src/hooks/useAuth.test.tsx src/features/jobs/hooks/useAIJobPolling.test.tsx 'src/app/(dashboard)/layout.test.tsx' src/services/api.test.ts src/services/auth.service.test.ts src/store/authStore.test.ts src/features/jobs/hooks/jobPolling.test.ts src/features/jobs/hooks/useJobs.test.tsx src/features/jobs/components/JobsPanel.test.tsx src/features/auth/components/accountUi.test.tsx --maxWorkers=1 --testTimeout=15000
```

- First fresh attempt (`task-1-fix1-full-green.txt`): exit 1; 9 files / 48 tests passed, but the `useAuth.test.tsx` forks worker timed out during startup. No assertion failure. The log preserves the infrastructure error; it is not a passing suite.
- Same full command retried without simultaneous lint/typecheck: exit 0, 10 files / 67 tests passed (`task-1-fix1-full-green-retry.txt`, duration 84.08s). Vitest emitted only its informational environment startup timing hint. No repository configuration, assertions, worker count, or test timeout changed.
- `node node_modules/eslint/bin/eslint.js src --ext .js,.jsx,.ts,.tsx`: exit 0 (`task-1-fix1-lint.txt`).
- `node node_modules/typescript/bin/tsc --noEmit`: exit 0 (`task-1-fix1-types.txt`).
- `git diff --check`: exit 0; Git only reports the existing LF-to-CRLF checkout notices.

## Self-review and limits

Read the full four-file diff, the previous task/review reports, auth hook/store/service implementation and red/green evidence. The empty-store condition uses the live store, so dependency timing cannot overwrite a newer same-session profile. Old sessions remain blocked both by the hook generation checks and by the service response guard. Same-owner token rotation is accepted at the service boundary. The logout bearer capture and existing auth-race tests are retained.

This fixes the review finding and the controller-requested adjacent service response boundary. It does not claim that all asynchronous profile writers outside this scope are audited. Browser/integrated validation and Graphify remain with the controller's Task 4 gate, per the ledger. Fresh independent re-review remains required before advancing Task 1.

## Files

Four implementation/test files: `frontend/src/hooks/useAuth.ts`, `frontend/src/hooks/useAuth.test.tsx`, `frontend/src/services/auth.service.ts`, `frontend/src/services/auth.service.test.ts`. Evidence: only `docs/ai-generation-recovery-2026-10-26/task-1-fix1-*`. Ignored recovery report: `.superpowers/sdd/2026-10-26-ai-generation-recovery/task-1-fix1-report.md`.
