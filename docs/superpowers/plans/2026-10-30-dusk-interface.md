# Dusk interface implementation

User approved either Hallmark Hedgerow or Dusk and a matched light/dark landscape pair. Dusk selected after viewing both references.

## Design contract

- Reference: https://www.usehallmark.com/themes/dusk/ . Adapt its atmospheric landscape, charcoal surfaces, restrained lavender and sans typography to a working application.
- Keep routes, navigation labels, brand, translations, authentication, API calls and permissions intact.
- Use existing Next.js / Tailwind 3 / Lucide components, no replacement UI framework.
- Be Vietnam Pro with Vietnamese support; density 6, variance 5, motion 3. Rounded panels 16px, controls 10px, buttons pill shaped.
- Generated dawn and night photographs share the same camera, mountains, lake and trees. Background is decorative. Solid surfaces protect data and form readability. No stock claims or invented metrics.
- Preserve existing fireworks preference and controls as an optional user feature.

## Implementation sequence

1. Generate matched backgrounds with built-in imagegen, convert to WebP and store in frontend/public/backgrounds. Update semantic tokens, typography and background layers.
2. Recompose auth introduction and form; restyle shared app navigation, headers, cards and buttons; create a landscape dashboard introduction and consolidated metrics strip. Shared tokens carry the style through project/task/WBS/Gantt/admin surfaces.
3. Run frontend tests, typecheck, lint, production build. Inspect login/dashboard/projects in light/dark and mobile/desktop; test theme, navigation and dialogs. Use synthetic intercepted API fixtures if no local backend is available, explicitly label evidence.
4. Update design documentation and Graphify AST. Record actual verification and screenshots. No production deployment in this request.

## Image prompts

Built-in imagegen created a quiet photographic dawn valley with low mist, a winding lake, evergreen trees and restrained apricot sky; no text, UI or buildings. A second edit retained the landscape geometry and changed illumination to charcoal-blue night and silver-lavender fog. These are generated assets, not photographs of a claimed real location.
