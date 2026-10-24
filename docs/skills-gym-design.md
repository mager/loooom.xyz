# Skills gym surface

Mode: Operate. Route: /gym.

Extend the existing cream/ocean website and its dark theme. Keep Outfit, Space Mono for measurements and code, and the existing logo. This is a focused report viewer with a narrow experiment selector and a wide evidence column, not a new brand.

The first viewport shows the selected skill, the strategy, the observed before/after result, and the test rows. The main interaction opens a case into the exact prompt, responses, and criterion decisions. A skill comparison and local JSON import support independent review. Failed, incomplete, no-defect, and empty states must remain honest.

The runner is local. The website must not imply that a browser button starts a model run. A local-run command and report import make the boundary clear. Controlled regression data is labeled beside its result.

## Implementation evidence — 2026-10-24

Checked the `/gym` route, `RunReport.svelte`, and `CaseResult.svelte` against `DESIGN.md`, `src/app.css`, and `PRODUCT.md`. Also inspected the desktop and mobile screenshots in `../skills-gym-work/review/desktop.jpg` and `../skills-gym-work/review/mobile.jpg` (paths from the repository root).

The page uses the existing theme variables, Outfit, Space Mono, handwriting headings, and yarn logo. The desktop view has a narrow experiment column and a wide report column. On mobile, the selector wraps into a two-column grid and the report follows it. Scores, controlled-defect labels, and case results remain visible in both screenshots. Source inspection confirms labeled, keyboard-focusable response and skill-text regions with visible focus styles. JSON import reads the local file in the browser; it does not upload the report or start a model run. Interaction verification belongs to the separate finish review.

Preserved `DESIGN.md` and `src/app.css`; neither has a diff. No design sidecar was found. Existing documentation differences remain: `DESIGN.md` has unsupported top-level elevation, shadows, and motion groups and uses “Layout & Spacing” instead of the format's “Layout” heading. It describes the light palette but does not capture the dark-theme values in `app.css`. These existing differences were recorded, not repaired. This surface does not establish new global tokens or visual rules.
