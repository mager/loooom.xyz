# Skills marketplace and gym surfaces

Mode: Operate. Routes: `/` and `/gym`.

## Existing visual system

Extend the cream/ocean website and its dark theme. Keep the existing theme variables, Outfit, Space Mono for code, handwriting headings, and yarn logo. `DESIGN.md` and `src/app.css` remain the visual authority. These surfaces do not establish new global tokens or visual rules.

## Homepage

Preserve the author-curated collection from `origin/main`. Lead with skill discovery and testing, with links to browse skills and enter the gym. Keep the interactive rubric demo beside the hero on desktop and below its copy on mobile. The demo compares the real `hook` skill at 100/100 with its costume version at 8/100 across five rubric dimensions. It displays existing scores; it does not run a model in the browser.

Place the new gym evidence section immediately after the hero. Its introduction and saved Focus preview sit side by side on desktop and stack on mobile. Follow it with the Volume 1 flagship skills, the public rubric explanation, the author-led lab statement, and the final browse action. Keep copy-and-paste use accessible to non-technical visitors. The catalog rubric scores skill text; gym checks test behavior in model responses. These are separate measures, and neither score substitutes for the other.

The preview takes its values from the saved report through the server loader. It shows each round's word count, passed trials, and Keep or Reject decision. The observed Focus run starts at 948 words. Round 1 has 157 words and passes 7/9 trials; it is rejected. Rounds 2 and 3 have 304 and 242 words and pass 9/9 trials; both are kept. The selected version passes 15/15 fresh verification trials. Keep the small-sample and model-grading limit beside these results. A link opens the full evidence in the gym.

## Gym

Use a narrow experiment column and a wide report column on desktop. At mobile widths, use a labeled native select with every saved experiment. Keep the selected skill and result near the top. The first report section shows the strategy, outcome, and original-to-selected change. The training round history follows it.

For repeated-trial reports, separate training selection from fresh verification. Search uses training cases only. Lock the selected skill before the final check, which includes fresh responses and held-out cases. Do not imply that the final evidence guides another edit. Keep controlled defects labeled beside their results. Preserve one-pass reports and distinguish them from repeated-trial experiments.

Users can select a training round or the final check, filter failures, open a case, and inspect each trial's prompt, responses, criteria, and decisions. Keep long response and skill-text regions labeled, keyboard-focusable, and scrollable. Show the original and selected skill with their hashes. Failed, incomplete, cancelled, no-defect, and empty states must describe the available evidence without claiming improvement.

## Local workflow

The browser displays saved reports. It does not start model calls. JSON import reads a local file without uploading it. Downloads provide the full evidence and the selected skill.

The copyable command uses the pinned GitHub archive at `f45997f86ced5d8db2020ab74b9e761fc1f30a39`, as defined in `src/lib/gym/commands.ts`. It includes the suite, round limit, trial count, and model. The page states the Node 22+ and signed-in Codex CLI requirements. At this handoff, npm 0.3.0 publication is pending, so the page provides the source archive command and setup guide. Skill content remains agent-agnostic.

## Implementation evidence — 2026-10-24

Checked `PRODUCT.md`, `DESIGN.md`, the homepage and its server loader, `/gym`, `GymPreview.svelte`, `ClimbReport.svelte`, `RunReport.svelte`, `CaseResult.svelte`, the saved-report loader, and the command helper. Compared them with the existing theme CSS. After the upstream merge, checked the homepage source and its diff against `origin/main`: the rubric demo, flagship skills, rubric explanation, and lab sections remain; the marketplace-and-gym hero and saved-evidence section extend that page.

Inspected the final screenshots in `../skills-gym-work/review-climb/`: `home-merged-desktop.jpg`, `home-merged-mobile.jpg`, `home-merged-user-440.jpg`, `gym-desktop-fixed.jpg`, `gym-mobile-fixed.jpg`, and `gym-user-440-fixed.jpg`. Paths are relative to the repository root. The merged homepage captures replace the earlier homepage evidence; the gym captures remain current. They show desktop and 390px and 440px mobile layouts. Also inspected `gym-dark.jpg` for the inherited dark theme and `evidence-desktop.jpg` for expanded trial evidence and visible response focus. Those two earlier captures do not establish the final command copy. The separate full integration reviewer reported a ship verdict with no required fixes; this document pass did not repeat browser interaction tests.

Preserved `DESIGN.md` and `src/app.css`; neither has a diff. No `.impeccable/design.json` sidecar was found or created. Existing documentation differences remain: `DESIGN.md` has unsupported top-level elevation, shadows, and motion groups and uses “Layout & Spacing” instead of the format's “Layout” heading. It records the light palette but omits the dark-theme values in `app.css`. These existing differences were recorded, not repaired.
