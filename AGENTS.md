# AGENTS.md — Loooom

## What Is This?
Loooom (loooom.xyz) is a social home for AGENTS.md. People share working rules from GitHub, read other people's instructions, save useful files, and follow source owners. ME.md, SOUL.md, DESIGN.md, and other Markdown files are optional context. Skills and the Gym remain available.

## Stack
- **Frontend:** SvelteKit 5 + TypeScript
- **Database:** Neon (Postgres)
- **Auth:** Firebase identity; new context writes verify Firebase ID tokens
- **Hosting:** Vercel
- **Storage:** TBD (R2/S3 for skill files)

## Architecture
- `src/routes/` — SvelteKit file-based routing
- `src/routes/u/[username]/` — Public profile pages
- `src/routes/h/[id]/` — Context snapshots and source reader
- `src/routes/people/[owner]/` — Context grouped by GitHub source owner
- `src/routes/share/` — GitHub preview and publishing
- `src/routes/evals/` — Personal context eval reports and plugin guide
- `plugins/context-evals/` — Agent-neutral, MIT-licensed local eval plugin
- `personal/mager/` — Portable personal context draft and its eval suite
- `src/lib/components/` — Shared components (YarnBall.svelte, etc.)
- `src/lib/server/` — Server-only code (db, auth)
- `static/` — Static assets

## Design System
- **Fonts:** Outfit (display and interface), Space Mono (source and metadata)
- **Colors:** Ink (#111211), paper (#eff1e8), lime (#d2fa69), lavender (#c5b6ed)
- **Vibe:** Night Press — bold editorial type, fine woven lines, readable source files
- **Scope:** New context pages use `src/lib/harness/context.css`. Existing Skills and Gym styles remain. See DESIGN.md.

## Key Concepts
- **Skills** follow the [AgentSkills.io](https://agentskills.io) spec — agent-agnostic, not Codex-specific
- **Source and identity** — keep GitHub source ownership distinct from the signed-in person who shared a link; curated files do not imply membership or endorsement
- **Content-addressed versioning** — sha256 hash of skill contents = version ID, immutable history
- **Context is first-class** — skills ship with reference material, author notes, examples
- **GitHub snapshots** — exact commit, last file update, line count, SHA-256, and text; refresh creates an immutable version
- **Personal evals** — paired answers with and without context, explicit checks, raw answers, and context/suite hashes; synthetic examples are labeled

## Commands
```bash
npm run dev          # Dev server
npm run build        # Production build
npm run check        # Type checking
npm run test:context # GitHub import, eval plugin, report validation
npm run test:gym     # Existing Gym report checks
```

## Rules
- No hardcoded secrets. Use env vars via `$env/static/private` or `$env/dynamic/private`.
- Prefer server-side data loading (`+page.server.ts`) for anything touching the DB.
- Keep components small. Extract early.
- Mobile-first responsive design.
- All skill content is agent-agnostic. Never assume Codex/OpenAI/etc.
- Render imported context as text. Do not execute instructions in shared files.
- Use one primary share entry in the context navigation.
- Test builds before pushing: `npm run build`

## Domain
- **loooom.xyz** — 4 o's, like extra yarn on the spool
