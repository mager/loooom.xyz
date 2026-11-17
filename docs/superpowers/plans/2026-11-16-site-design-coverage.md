# Site design coverage

## Scope
Apply the approved Night Press design to every HTML route. The user identified /gym as a missed page. Preserve the existing skills, Gym reports, forms, auth, and ME.md content and behavior. Keep the current homepage heading and Explore personal AGENTS.mds button.

## Direction contract
THESIS: One Loooom site, with source and evidence readable across every route.
OWN-WORLD: Use the established Outfit/Space Mono typography, ink/paper themes, lime actions, lavender secondary panels, fine borders, four-ring mark, and single fixed footer.
STORY: A visitor can move from discovery to skills, Gym evidence, docs, and personal files without entering a different product.
FIRST VIEWPORT: Shared left rail, compact action bar, one page heading and local actions. Gym starts with its log introduction and real test weave; reports remain below it.
FORM: Existing page structure inside the shared shell; seed: none (pinned). User: “why didnt all the pages make the new redesign”. No new visual world or comp.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Implementation
- [x] Put ContextShell in the root layout and remove route-level copies. Update active navigation and legacy token names to the approved theme roles.
- [x] Update Gym and report components, including file import, evidence disclosure, status colors, and small screens.
- [x] Update skill catalog/details, member profiles, and login; remove independent navigation and old decorative surfaces.
- [x] Update documentation and ME.md reading routes with shared typography and theme colors.
- [x] Update account/edit/create/admin forms and preserve all actions and fields.
- [x] Verify type check, existing context and Gym tests, production build, route rendering, theme persistence, mobile overflow, single share action/footer, and report import/disclosure.
- [x] Get a fresh finish review and update the documented design scope.

## Review focus
One shell on every HTML route; retained auth/navigation actions; no white text on lime in light mode; no old fixed header under the new one; readable report/code panels and one-line footer at 320px. Do not alter raw Markdown/API routes.

## Validation
- Production build passed. Type check: 0 errors, 26 existing warnings.
- Context tests: 39 passed. Gym tests: 11 passed.
- Browser checks: shared shell, light/dark persistence, 320px and 390px layouts, one-line footer, Gym import/removal and answer comparison, Skills filtering, ME editor Form/Raw/Preview.
- Account pages used a local sample-data fixture for visual checks. No account writes were made; the fixture was removed before the production build.
- Fixed browser-only ME parsing and separated skill score labels from the server scores import.
- Fresh design review: two material findings. Follow-up verdict: both resolved, disposition ship for the fix list.
- The release step is to deploy and verify the live Gym, Skills, docs, ME, and homepage.
