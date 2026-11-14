# Loooom: share your harness

The user's brief replaces the skills-first homepage with a social home for AGENTS.md, SOUL.md, and ME.md. People link a public GitHub file, read its instructions, inspect source metadata, save useful files, and follow GitHub source owners. GitHub remains the source of truth. The expanded brief includes a working personal eval plugin and report reader in this release, plus a portable personal context pack for Mager. Source is ready locally; deployment and package publication are separate steps. No scores or release availability will be invented.

## Approach
Keep SvelteKit, Neon, and Firebase. Add immutable GitHub snapshots with an explicit refresh action, a discovery feed, a file reader, a share form, bookmarks, and follows. Keep existing Skills, Gym, profile, and ME.md routes available. Imports are public text only, limited to 100 KiB, with fixed GitHub API hosts and no execution of imported instructions. New writes verify Firebase tokens rather than trusting the legacy UUID cookie. The local MIT-licensed eval plugin compares baseline and context answers, preserves evidence, and supports a clearly labeled synthetic replay. Reports open locally in the browser. Mager's pack adapts existing OpenClaw instructions and selected, attributed replies to the user-provided X post.

The user's final navigation correction is binding: one “Share your context” button in the context topbar. The homepage hero leads to community discovery. The share page omits its own redundant navigation button.

Further user corrections: four interwoven rings in the logo and favicon, one for each o in loooom. Both light and dark versions are required. A sticky footer holds the theme control, About, the site version, and “A side project by @mager.” Preserve the chosen theme across visits and keep content clear of the footer on mobile.

## Visual direction
Operate for discovery and publishing; Read for source files. Replace the old cream/cyan world with Night Press: ink, acid lime, pale lavender, compact editorial rows, large Outfit typography, and a moving CSS weave. The social task remains a familiar feed with search, topic filters, and readable file previews. The weave is the signature: fine threads cross behind an AGENTS.md sheet, with a static reduced-motion state.

Grounded directions considered: open-source field guide; risograph collective; conference identity; textile samples; record sleeve index; Night Press digital zine; annotated research notebook. Seed seed:85672bf9685244de assigned candidate six. The remote challenger catalog was unavailable. This is a code-led build. Use real stored content or clearly labeled examples; do not invent member activity or eval scores.

## Verification
Test GitHub validation, slash refs, immutable commit/content pairing, size limits, upstream failures, plugin behavior, and report validation. Run Svelte checks, existing tests, and the production build. Inspect desktop and mobile layouts, import errors, real GitHub preview, filtering, text reading/copy, report opening, and logged-out actions. Signed-in writes and live model quality require a later signed-in/provider test; do not present them as verified.

## Final product and release direction

AGENTS.md leads the homepage and default discovery view. ME.md, SOUL.md,
DESIGN.md, and other Markdown files are optional context. The importer accepts
public `.md` files under the existing 100 KiB bound. Authorship stays visible;
sharing files does not create or copy a person's identity. Keep copy direct and
short. There is one footer, with all controls on one line on mobile.

The user authorized pushing and deploying the finished result. Production is
the existing Vercel `loooom-xyz` project and the repository's `main` branch.
