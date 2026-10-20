# Local browser QA — 2026-10-20

This folder contains a reusable real-browser harness for the actual local Next.js frontend, isolated synthetic API fixtures, screenshots, and measured DOM geometry. **These are synthetic project-2 fixtures, not a read of the production project.** The historical production audit remains in `../ui-audit-2026-10-20/`.

The fixtures preserve the historical audit's three phases, 17 tasks, 16 TODO and one IN_PROGRESS, absent phase dates, and phases named Sprint. Exact production names were unavailable in a machine-readable baseline; project/task/phase names here are illustrative Vietnamese names. The single `Phân tích` task makes search reproducible. Variants cover 0, 1 and 50 tasks, unusually long names, API loading and API error. No real credentials are present.

## Run

Start the existing frontend dev server at `http://127.0.0.1:3000`, then from the repository root in PowerShell:

```powershell
& 'C:/Users/VIET THANG/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' 'docs/ui-redesign-2026-10-20/browser-qa.cjs' smoke
# Full matrix (80 route/viewport/language/theme cases + 15 edge cases):
& 'C:/Users/VIET THANG/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' 'docs/ui-redesign-2026-10-20/browser-qa.cjs' final
```

`QA_ROUTE=wbs` restricts a run to one route. `QA_BASE_URL` accepts only localhost/127.0.0.1 with an explicit port. `QA_BROWSER` overrides the installed Chrome executable; `QA_PLAYWRIGHT_MODULE` overrides the bundled Playwright module. No dependencies or browsers were installed. Each named run writes its own folder; rerunning the same name replaces its evidence.

## Isolation and checks

- Fresh browser contexts receive only synthetic `has-session=1`, locale and theme choices; authentication refresh and websocket tickets are fulfilled locally with meaningless synthetic strings.
- Every API request is intercepted; unknown endpoints return 404, unknown writes return 405, and WebSockets are intercepted and closed. API routes never fall through to a real backend. External images, fonts and telemetry are blocked. Only local frontend GET resources continue.
- Captures cover WBS, tasks, overview and Gantt. The full matrix is 320/390/768/1024/1440 pixels × VI/EN × light/dark. Mobile height is 844; desktop/tablet height is 900. Screenshots include full page and first viewport.
- JSON includes document overflow, dialog geometry, containing ancestors and their transform/filter/contain/perspective, raw translation-key candidates, console errors, API request paths and reduced-motion preference.
- WBS checks initial focus, 16 forward Tab presses, reverse Tab, Escape, opener focus restoration, and dialog geometry after scrolling. Grouped project navigation checks all 13 link targets, `aria-current`, Enter-open and Escape-close/focus for each disclosure.

## Evidence timing

`baseline/` was captured while changes were being implemented. Its WBS screenshots preceded the shell redesign but **already contain the Modal portal/translation fix**. Therefore this is an intermediate local baseline, not the original broken modal. Its first task screenshots show the original expanded filters and original navigation. Overview-mobile failed because the initial harness misclassified a same-origin Next.js RSC/HMR fetch as an API request and answered 404; this was a harness defect, not evidence of an application bug. The classifier was corrected before final QA. Later routes may contain changes made during the run. Initial 405 console entries came from deliberately blocked `/auth/ws-ticket` calls, subsequently replaced with a local synthetic ticket fixture and intercepted WebSockets.

The original broken production modal is documented in `../ui-audit-2026-10-20/07-phase-dialog-mobile.jpg` and that audit's README (top about 639, bottom about 1202 at 390×844). The original containing-block cause was not measured before the source changed; do not claim the new portal DOM proves the old cause.

`smoke/` contains the first shell-integrated WBS check at 320, 390 and 1440. All three had no console/page error or document overflow, 16 forward Tabs stayed inside the modal, Escape closed it and opener focus restored. At 320/390, dialog top/bottom were 146/698 within an 844px viewport; desktop 208/692 within 900px.

## Limits

Chromium desktop viewport emulation is not a physical iOS/Android or virtual-keyboard test. These checks do not establish contrast ratios, axe compliance, performance, production integration, real data correctness, or usability-study completion. Loading/error fixtures intentionally have no successful backend operation; mutations are never sent to production. API errors are collected for diagnosis and must be distinguished from unexpected app errors. Final evidence should be captured after edits and the dev server stabilize.
