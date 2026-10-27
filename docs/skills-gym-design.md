# Skills marketplace and gym surfaces

Mode: Operate. Routes: `/` and `/gym`.

## Existing visual system

Extend the cream/ocean website and its dark theme. Keep the existing theme variables, Outfit, Space Mono for code, handwriting page headings, and yarn logo. Session entry headings use Outfit as specified below. `DESIGN.md` and `src/app.css` remain the visual authority. These surfaces do not establish new global tokens or visual rules.

## Homepage

Preserve the author-curated collection from `origin/main`. Lead with skill discovery and testing, with links to browse skills and enter the gym. Keep the interactive rubric demo beside the hero on desktop and below its copy on mobile. The demo compares the real `hook` skill at 100/100 with its costume version at 8/100 across five rubric dimensions. It displays existing scores; it does not run a model in the browser.

Place the new gym evidence section immediately after the hero. Its introduction and saved Focus preview sit side by side on desktop and stack on mobile. Follow it with the Volume 1 flagship skills, the public rubric explanation, the author-led lab statement, and the final browse action. Keep copy-and-paste use accessible to non-technical visitors. The catalog rubric scores skill text; gym checks test behavior in model responses. These are separate measures, and neither score substitutes for the other.

The preview takes its values from the saved report through the server loader. It shows each round's word count, passed tests, and Kept or Not kept decision. The observed Focus run starts at 948 words. Round 1 has 157 words and passes 7/9 tests; it is not kept. Rounds 2 and 3 have 304 and 242 words and pass 9/9 tests; both are kept. The selected version passes 15/15 final tests. Keep the small-test and AI-grading limit beside these results. Use “Final tests” and “See what changed” in the preview. This copy change preserves the homepage structure.

## Gym

Show a complete chronological log of all six saved sessions. Sort by completion time, latest first, and use start time when completion time is absent. Display the date and time in the America/Chicago zone, including the zone abbreviation. Show Started only when completion time is absent, and Local file for an import. Omit the repeated Completed label. On desktop, place the timestamp beside the session summary. On mobile, place it above the summary. There is no example selector or separate group of earlier tests.

Keep the page introduction factual: session count, sort order, small question set, and AI grading. Omit the header and footer slogans. Use compact Outfit entry headings at `clamp(1.2rem, 2vw, 1.4rem)` (about 19–22px), weight 500, and line-height 1.35. This is a local component treatment.

Each entry shows its title, status, skill, and Problem, Change, and Result fields. Use Checked instead of Problem when no defect was found. Include unchanged skills and rejected changes in the same log. Mark deliberately added defects plainly. Use “Passed final tests” and “Kept after one pass” for the applicable statuses. Keep recorded results separate from the short editorial account of what happened. Report the scores without repeating the status in another outcome sentence; retain failure, incomplete-result, and one-pass limits where needed.

Each entry has a “Session details” native disclosure. Render the full report only while the disclosure is open. Allow multiple records to remain open, with report heading IDs scoped to their session. The expanded report keeps the result headline, Before and After values, final test result, and short AI-grading limit visible. The limit must state that a small test does not mean the skill will always work. Use plain labels for the detailed evidence.

For repeated-trial reports, separate training selection from fresh verification. Search uses training cases only. Lock the selected skill before the final check, which includes fresh responses and held-out cases. Do not imply that the final evidence guides another edit. Keep controlled defects labeled beside their results. Preserve one-pass reports and distinguish them from repeated-trial experiments.

Keep attempted changes, test results, instruction text, the local command, and test metadata in closed disclosures by default. Selecting an attempted change opens its test results automatically. Users can still select the final check, filter failures, open a question, and inspect each answer, prompt, criterion, and decision. Keep long response and instruction regions labeled, keyboard-focusable, and scrollable. Preserve the source text, hashes, and downloads. Earlier one-pass reports use the same plain labels and disclosures, with a visible note that they did not include a fresh final check. Failed, incomplete, cancelled, no-defect, and empty states must describe the available evidence without claiming improvement.

## Local workflow

The browser displays saved reports. It does not start model calls. JSON import reads a local file without uploading it and places the imported session in the same chronological log. Show a notice that the local session is not published and provide a remove control. Imported sessions use their own report evidence and generic summary text, never the editorial notes for a saved session with the same ID. Downloads provide the full evidence and the selected skill.

The copyable command uses the pinned GitHub archive at `f45997f86ced5d8db2020ab74b9e761fc1f30a39`, as defined in `src/lib/gym/commands.ts`. It includes the suite, round limit, trial count, and model. The page states the Node 22+ and signed-in Codex CLI requirements. At this handoff, npm 0.3.0 publication is pending, so the page provides the source archive command and setup guide. Skill content remains agent-agnostic.

## Implementation evidence — 2026-10-26

Checked `PRODUCT.md`, `DESIGN.md`, the homepage and its server loader, `/gym`, `GymPreview.svelte`, `ClimbReport.svelte`, `RunReport.svelte`, `CaseResult.svelte`, the saved-report loader, and the command helper. Compared them with the existing theme CSS. After the upstream merge, checked the homepage source and its diff against `origin/main`: the rubric demo, flagship skills, rubric explanation, and lab sections remain; the marketplace-and-gym hero and saved-evidence section extend that page.

For the session-log update, checked `SessionLogEntry.svelte`, `src/lib/gym/log.ts`, the gym route, the server report loader, and the report heading IDs. Source inspection confirms timestamp fallback, local-import handling, lazy report rendering, and separate heading IDs for multiple open records. The earlier `../skills-gym-work/review-log/expanded.jpg` remains supporting evidence for the unchanged expanded report.

For the final plain-log refinement, checked the route, entry component, and summary helper against their current diff. Inspected `../skills-gym-work/review-plain/desktop.jpg` and `mobile.jpg`. These replace the earlier default log captures. The full-page images show all six entries at 1280px and 390px widths; their capture viewports were 1280×720 and 390×844. They confirm the smaller Outfit headings, shorter labels, and removal of slogans and repeated outcome text while preserving dates, controls, and evidence links.

The independent plain-log reviewer reported a ship verdict with no required fixes. The implementation handoff reports zero check errors, 74 existing warnings, eight passing tests, a passing build, and a passing keyboard disclosure check. This documentation pass did not repeat those checks or browser interaction tests.

The previously inspected `../skills-gym-work/review-climb/home-merged-desktop.jpg`, `home-merged-mobile.jpg`, and `home-merged-user-440.jpg` still establish the homepage structure. Their preview wording predates the plain-language update. Earlier dark-theme and response-focus captures remain supporting evidence only. All paths are relative to the repository root.

Preserved `DESIGN.md` and `src/app.css`; neither has a diff. No `.impeccable/design.json` sidecar was found or created. Existing documentation differences remain: `DESIGN.md` has unsupported top-level elevation, shadows, and motion groups and uses “Layout & Spacing” instead of the format's “Layout” heading. It records the light palette but omits the dark-theme values in `app.css`. These existing differences were recorded, not repaired.
