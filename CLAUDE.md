# CLAUDE.md — Loooom

## What Is This?
Loooom (loooom.xyz) is a social skills marketplace for AI agents. Think skills.sh meets a social directory — verified authors, context-rich skills, beautiful discovery.

## Stack
- **Frontend:** SvelteKit 5 + TypeScript
- **Database:** Neon (Postgres)
- **Auth:** Twitter/X OAuth 2.0
- **Hosting:** Vercel
- **Storage:** TBD (R2/S3 for skill files)

## Architecture
- `src/routes/` — SvelteKit file-based routing
- `src/routes/u/[username]/` — Public profile pages
- `src/lib/components/` — Shared components (YarnBall.svelte, etc.)
- `src/lib/server/` — Server-only code (db, auth)
- `static/` — Static assets

## Design System
- **Fonts:** Outfit (display), Space Mono (code), Caveat (handwriting), Playfair Display (serif accents)
- **Colors:** Dark base (#0a0a0f), purple accent (#6c5ce7), pink (#fd79a8), blue (#74b9ff)
- **Vibe:** Futuristic craft — yarn/weaving metaphors meet clean tech UI

## Key Concepts
- **Skills** follow the [AgentSkills.io](https://agentskills.io) spec — agent-agnostic, not Claude-specific
- **Verified Authors** — identity via X/Twitter OAuth
- **Content-addressed versioning** — sha256 hash of skill contents = version ID, immutable history
- **Context is first-class** — skills ship with reference material, author notes, examples

## Commands
```bash
npm run dev          # Dev server
npm run build        # Production build
npm run check        # Type checking
```

## Rules
- No hardcoded secrets. Use env vars via `$env/static/private` or `$env/dynamic/private`.
- Prefer server-side data loading (`+page.server.ts`) for anything touching the DB.
- Keep components small. Extract early.
- Mobile-first responsive design.
- All skill content is agent-agnostic. Never assume Claude/OpenAI/etc.
- Test builds before pushing: `npm run build`

## Domain
- **loooom.xyz** — 4 o's, like extra yarn on the spool
