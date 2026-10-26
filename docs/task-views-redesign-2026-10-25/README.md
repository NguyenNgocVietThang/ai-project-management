# Task workspace redesign — 25 October 2026

User approved three image concepts and requested implementation through fresh subagents. Work began in isolation, then moved to **local main at the user's explicit request**. The user subsequently authorized a GitHub push for automatic website deployment after final verification. No production data mutation is part of this change.

## Resulting views

- Board: compact, readable five-status Kanban overview; columns reflow at smaller widths, full task names wrap, status changes retain capability checks and pointer/keyboard support.
- List: real phase groups with accessible disclosure, unphased and unavailable-reference fallback groups, readable task metadata and bulk actions scoped to eligible loaded tasks.
- Sprint: real sprint/backlog navigation and selected detail, mobile group selector, loaded-task completion and story points. Empty and unavailable groups remain reachable.
- Shared: compact tasks-only project context, opaque workspace, preserved task drawer/create/timer, localized filters/history and pagination across all views.

The image concepts supply visual direction. They do not introduce seven invented workflow statuses or conflate phase and sprint. Existing semantic tokens and themes are retained, and motion stays restrained for an operational screen.

## Reproducible verification

Run the local frontend on port 3100 with API configured to localhost. The scripts launch an isolated headless Chrome profile and intercept every API request with synthetic data; they never fall back to production. The fixture contains 12 phases/sprints, null and unavailable references, long unbroken names and optional 205-task pagination.

```powershell
node docs/task-views-redesign-2026-10-25/browser-qa.cjs views
node docs/task-views-redesign-2026-10-25/functional-qa.cjs
```

The matrix covers 320/390/768/1024/1440px, vi/en, light/dark and all three views, plus empty and 205-task cases. It records document overflow, console errors, raw translation keys, first-task position and representative screenshots. Functional checks cover late groups, keyboard disclosure, search/view/history, drawer focus, pagination and a keyboard status drop against an in-memory fixture only.

The 66-case browser matrix passed. Two initial Chrome target crashes were retried successfully with shared browser sessions and software rendering; retry details remain in the report. Functional checks, final frontend gates and deployment evidence will be recorded here after verification finishes.

## Verified results

- Full frontend suite: 60 files / 271 tests passed. One worker and a 15000ms command-line timeout allowance were used on the slow Windows host; repository test configuration and assertions were not weakened.
- Full ESLint and TypeScript checking passed. Production build is tracked in frontend-build.txt.
- Browser matrix: 66/66 cases passed; see views/report.json. Initial infrastructure target crashes were rerun and are retained as retry evidence.
- Functional browser checks: seven cases passed, covering late phase/sprint/unknown/backlog access, keyboard disclosure, search/view/history preservation, drawer focus, all-view second-page access, real keyboard status drop against local fixture, and delayed-query selection continuity.
- Task review found one Sprint selection lifecycle regression. Commit 9ff0d73 retains the workspace through loading and adds a page regression; scoped re-review approved the fix. Initial UI commits: 67f0a70 and 447e93b.
- All API mutations in browser verification targeted intercepted in-memory fixtures. Production verification after deployment is read-only.

## Decisions recorded during execution

1. Proceed from the approved three image concepts without another design approval; if misunderstood, the cost is reversible UI rework.
2. Map A/B/C to Board/List/Sprint while retaining the five actual statuses and real phase/sprint entities; if the grouping choice is wrong, presentation needs adjustment.
3. Use restrained existing motion rather than marketing AIDA/GSAP sections; if a different motion direction is desired, it requires visual rework.
4. Initially use an isolated native worktree under the invoked execution workflow; its cost is an extra checkout. It is retained because the app identifies it as the chat primary checkout and rejects archiving it.
5. Transfer stable work to local main after the user explicitly requested it; this made changes local to main. The user later explicitly authorized a GitHub push and automatic deployment.

Final gate: ESLint, TypeScript and production Next.js build all passed. Independent whole-change review approved without actionable findings. Graphify AST update completed:6185nodes/20529edges. GitHub push and live verification follow the user's explicit authorization.
