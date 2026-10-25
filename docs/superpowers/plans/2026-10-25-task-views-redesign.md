# Task views redesign implementation plan

User approved A/B/C mockups and asked for subagent implementation. This plan is the reachable specification; images are visual direction, not new domain data.

## Global Constraints
- Preserve real TaskStatus values, phases, sprints, backlog, capabilities, task drawer/create/timer/bulk actions and URL filter/history behavior. Never invent workflow stages or silently mutate data.
- Board = A overview of existing five statuses; List = B collapsible groups by real phase including unphased tasks; Sprint = C navigator and selected real sprint/backlog detail.
- Use existing semantic teal/slate tokens, opaque readable workspace surfaces, existing font and components; support light/dark and vi/en with matching catalog keys. User/AI content stays unchanged.
- No page horizontal overflow at 320/390/768/1024/1440px. All status/sprint groups remain reachable with long names, empty groups and many groups. Do not merely clip overflow. Small screens use vertical reflow or accessible controls.
- Keep the tasks route compact: project context, navigation, toolbar and first task must fit a typical laptop/mobile viewport. Scope shared project layout changes to the tasks route.
- Use restrained existing transitions with reduced-motion support; no marketing hero, marquee, pinning or new animation dependency in a work-management screen.
- Work directly on local main, explicitly requested by the user after the initial isolated Task 1 work was transferred. Do not push, deploy or change production records. Preserve unrelated files.
- Run meaningful focused behavior tests per task; final lint, typecheck, full tests, production build and real-browser responsive checks. Update Graphify separately after code settles.

## Task 1: Compact workspace and Kanban overview
Files: projects/[id]/layout.tsx, tasks/page.tsx, tasks components/TaskFilters.tsx, new TaskBoard.tsx if useful, tasks tests, messages/en.json and vi.json.
1. Scope compact project context to tasks route: reduce duplicated headings/descriptions, keep project name/status/methodology and project navigation accessible. Put tasks region on a readable opaque surface.
2. Compact header/view switch/CTA/filter controls, keep filter chips and modal functionality intact. Preserve mounted search input through loading.
3. Replace fixed 5x16rem horizontal grid with responsive overview. All five actual statuses visible across desktop; medium/small widths reflow lanes or provide explicit accessible status navigation. No offscreen hidden columns. Preserve dnd-kit pointer/keyboard status transitions and read-only capabilities.
4. Cards use readable wrapping names and compact dates/assignee/priority. Long unbroken names must not widen lanes. Empty lanes display useful localized feedback. Counts explicitly represent loaded matching tasks, not invented totals.
5. Add focused tests for all five statuses, long names, permitted drag handle visibility, empty lanes and existing URL/filter/drawer regressions. Test layout route behavior where practical.
6. Run focused tests, lint/typecheck and self-review; commit only task files. Report commands, outcomes and risks in task-1-report.md.

## Task 2: Grouped list and Sprint master-detail
Files: tasks/page.tsx, new tasks components/GroupedTaskList.tsx, SprintWorkspace.tsx and grouping helper if useful, related tests, messages/en.json and vi.json.
1. Replace flat list with collapsible groups based on real phase_id and WBS phase names, including unphased/unknown-id fallback groups without losing tasks. Preserve actual status badges and dates/assignee/priority/hours. Mobile uses readable rows/cards in the same groups. Keep bulk selection/status action available with correct scope and accessible labels; do not change capability enforcement.
2. Replace vertically stacked sprint cards with persistent desktop sprint/backlog navigator and selected group detail. Mobile uses a labelled select or vertical control, never hidden horizontal tabs. Show true DONE-based completion, task count, sprint status/story points and readable rows. Backlog includes only null sprint_id; retain tasks with unknown sprint IDs via explicit fallback groups.
3. Selection must stay valid on WBS/filter data changes and project changes. A user can reach late sprint groups even with 12+ sprints; zero-task sprints still reachable. Empty detail has localized feedback. Phase and Sprint remain distinct concepts.
4. Preserve create/drawer/timer/filter URL/history/pagination behavior; expose pagination for every view if backend response has more than one page so no matching work is hidden past 200. Clearly label loaded/matching counts.
5. Add focused tests for phase grouping/collapse, unphased and unknown IDs, all sprints/backlog reachable, selected-empty and filter changes, long titles, bulk selection and pagination; run task regressions and catalog tests. Lint/typecheck and self-review; commit scoped files and report in task-2-report.md.

## Task 3: Browser QA and final corrections
Controller runs local frontend with isolated fixture backend if real backend/session unavailable. Fixtures are local test-only, never production data writes or authentication changes. Verify desktop/mobile 320/390/768/1024/1440, all views, vi/en, light/dark; no viewport overflow, late statuses/phases/sprints reachable, long names readable, filter/search/view switching, drawer and keyboard focus. Save screenshots and evidence under docs/task-views-redesign-2026-10-25. A fresh implementer fixes any verified gaps, adds necessary regressions and commits. Run final lint/typecheck/tests/build, then Graphify update and whole-branch review. Record limitations honestly.
