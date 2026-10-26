# Skills marketplace and gym surfaces

Mode: Operate. Routes: `/` and `/gym`.

## Existing visual system

Extend the cream/ocean website and its dark theme. Keep the existing theme variables, Outfit, Space Mono for code, handwriting headings, and yarn logo. `DESIGN.md` and `src/app.css` remain the visual authority. These surfaces do not establish new global tokens or visual rules.

## Homepage

Preserve the author-curated collection from `origin/main`. Lead with skill discovery and testing, with links to browse skills and enter the gym. Keep the interactive rubric demo beside the hero on desktop and below its copy on mobile. The demo compares the real `hook` skill at 100/100 with its costume version at 8/100 across five rubric dimensions. It displays existing scores; it does not run a model in the browser.

Place the new gym evidence section immediately after the hero. Its introduction and saved Focus preview sit side by side on desktop and stack on mobile. Follow it with the Volume 1 flagship skills, the public rubric explanation, the author-led lab statement, and the final browse action. Keep copy-and-paste use accessible to non-technical visitors. The catalog rubric scores skill text; gym checks test behavior in model responses. These are separate measures, and neither score substitutes for the other.

The preview takes its values from the saved report through the server loader. It shows each round's word count, passed tests, and Kept or Not kept decision. The observed Focus run starts at 948 words. Round 1 has 157 words and passes 7/9 tests; it is not kept. Rounds 2 and 3 have 304 and 242 words and pass 9/9 tests; both are kept. The selected version passes 15/15 final tests. Keep the small-test and AI-grading limit beside these results. Use “Final tests” and “See what changed” in the preview. This copy change preserves the homepage structure.

## Gym

Start with a plain definition of a skill and explain that the page shows saved examples. On desktop, use a narrow example column and a wide report column. Show the three repeated-test examples first and put the three earlier tests in a closed “Earlier tests” disclosure. On mobile, a labeled native select includes all six examples and any local import.

Keep the result headline, Before and After values, final test result, and short AI-grading limit visible. The limit must state that a small test does not mean the skill will always work. Use “Before,” “After,” and “Final tests” in the main view. Reserve training, candidate, and verification terms for detailed evidence where needed.

For repeated-trial reports, separate training selection from fresh verification. Search uses training cases only. Lock the selected skill before the final check, which includes fresh responses and held-out cases. Do not imply that the final evidence guides another edit. Keep controlled defects labeled beside their results. Preserve one-pass reports and distinguish them from repeated-trial experiments.

Keep attempted changes, test results, instruction text, the local command, and test metadata in closed disclosures by default. Selecting an attempted change opens its test results automatically. Users can still select the final check, filter failures, open a question, and inspect each answer, prompt, criterion, and decision. Keep long response and instruction regions labeled, keyboard-focusable, and scrollable. Preserve the source text, hashes, and downloads. Earlier one-pass reports use the same plain labels and disclosures, with a visible note that they did not include a fresh final check. Failed, incomplete, cancelled, no-defect, and empty states must describe the available evidence without claiming improvement.

## Local workflow

The browser displays saved reports. It does not start model calls. JSON import reads a local file without uploading it. Downloads provide the full evidence and the selected skill.

The copyable command uses the pinned GitHub archive at `f45997f86ced5d8db2020ab74b9e761fc1f30a39`, as defined in `src/lib/gym/commands.ts`. It includes the suite, round limit, trial count, and model. The page states the Node 22+ and signed-in Codex CLI requirements. At this handoff, npm 0.3.0 publication is pending, so the page provides the source archive command and setup guide. Skill content remains agent-agnostic.

## Implementation evidence — 2026-10-24

Checked `PRODUCT.md`, `DESIGN.md`, the homepage and its server loader, `/gym`, `GymPreview.svelte`, `ClimbReport.svelte`, `RunReport.svelte`, `CaseResult.svelte`, the saved-report loader, and the command helper. Compared them with the existing theme CSS. After the upstream merge, checked the homepage source and its diff against `origin/main`: the rubric demo, flagship skills, rubric explanation, and lab sections remain; the marketplace-and-gym hero and saved-evidence section extend that page.

For the clarity update, checked the current gym route, both report components, the answer component, and `GymPreview.svelte`. Inspected `../skills-gym-work/review-simple/gym-desktop-final.jpg`, `gym-mobile-final.jpg`, `gym-user-final.jpg`, and `evidence-desktop-final.jpg` in that same directory. These replace the earlier gym layout evidence and show the compact default view plus expanded answer evidence on desktop and the default view at 390px and 440px mobile widths. The source confirms that selecting a round opens its results. The separate reviewer reported a ship verdict with no required fixes; this document pass did not repeat browser interaction tests.

The previously inspected `../skills-gym-work/review-climb/home-merged-desktop.jpg`, `home-merged-mobile.jpg`, and `home-merged-user-440.jpg` still establish the homepage structure. Their preview wording predates the plain-language update. Earlier dark-theme and response-focus captures remain supporting evidence only. All paths are relative to the repository root.

Preserved `DESIGN.md` and `src/app.css`; neither has a diff. No `.impeccable/design.json` sidecar was found or created. Existing documentation differences remain: `DESIGN.md` has unsupported top-level elevation, shadows, and motion groups and uses “Layout & Spacing” instead of the format's “Layout” heading. It records the light palette but omits the dark-theme values in `app.css`. These existing differences were recorded, not repaired.
