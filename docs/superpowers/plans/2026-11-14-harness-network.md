# Harness Network Implementation Plan

> Execute inline with superpowers:executing-plans.

**Goal:** Build a social AGENTS.md / SOUL.md / ME.md discovery and GitHub publishing flow, personal evals, and Mager's portable context pack.
**Architecture:** SvelteKit server loading, bounded GitHub REST imports, Neon storage, Firebase-verified mutations. Explicit source snapshots and refresh preserve provenance.
**Tech Stack:** Svelte 5, TypeScript, Drizzle, Neon, Firebase.
**Spec:** docs/superpowers/specs/2026-11-14-harness-network-design.md

## Constraints
Public AGENTS.md, SOUL.md, and ME.md files. No secrets, fabricated activity, or live eval claims. Preserve existing Skills, Gym, and ME.md routes. Responsive and keyboard accessible. Render imported text as text. One share button in the context topbar.

## Review focus
Untrusted URLs; branch names with slashes; unavailable database or GitHub; stale content mixed with new commit metadata; forged legacy session cookies.

## Tasks
- [x] Write failing GitHub importer tests. Implement URL parsing, bounded fetches, pinned snapshots and readable errors; pass tests.
- [x] Add schema and additive migration, storage helpers, and verified share/save/follow/refresh endpoints. Keep setup failures explicit. Apply the additive migration.
- [x] Build shell, discovery, source reader, share form and personal eval report viewer; update navigation and product description.
- [x] Build and test the MIT-licensed context eval plugin, with synthetic replay clearly labeled.
- [x] Find existing personal instructions; build AGENTS.md, SOUL.md, ME.md, source notes, and a personal eval suite.
- [x] Run check, tests and build. Inspect desktop/mobile and interactive states. Run design detector and independent finish review.
- [x] Add four-ring branding, light and dark themes, one mobile footer line, and concise AGENTS.md-first copy.
- [x] Record the implemented design in DESIGN.md and .impeccable/design.json.
