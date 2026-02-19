---
name: loooom
description: Manage loooom.xyz social skills marketplace
---

**Repo:** ~/Code/loooom | github.com/mager/loooom.xyz
**Domain:** loooom.xyz (4 o's)
**Tagline:** "Where skills are woven"
**Live:** loooom-xyz.vercel.app

**Stack:**
- **Frontend:** SvelteKit 5 + TypeScript → Vercel
- **Database:** Neon (Postgres) + Drizzle ORM
- **Auth:** Cookie-based sessions (X OAuth planned)
- **Fonts:** Playwrite IT Moderna (handwriting, wt 100-200), Gaegu (sketch), Outfit (display), Space Mono (code)
- **Theme:** Light default — warm cream paper (#faf6f0), grain texture. Dark available.

**Architecture:**
```
loooom.xyz
├── src/routes/
│   ├── +page.svelte              # Landing page (waitlist, vision, use cases)
│   ├── +page.server.ts           # Waitlist action
│   ├── +layout.server.ts         # Session auth (reads cookie)
│   ├── startweaving/             # Secret signup page
│   ├── login/                    # Login page (username-based)
│   ├── u/[username]/             # Profile pages (DB-backed)
│   └── api/
│       ├── seed/                 # Seed mager + loooom accounts
│       └── seed-franklin/        # Add Franklin skill to loooom
├── src/lib/
│   ├── components/
│   │   ├── YarnBall.svelte       # Animated hero SVG
│   │   ├── YarnLogo.svelte       # Nav logo (mini yarnball)
│   │   └── ThemeToggle.svelte    # Light/dark toggle
│   └── server/
│       ├── db.ts                 # Neon connection
│       ├── schema.ts             # Drizzle schema
│       └── seed.ts               # Seed data (mager + loooom + historical skills)
├── drizzle.config.ts
├── CLAUDE.md
├── VISION.md
└── README.md
```

**Schema (Drizzle → Neon):**
- `users` — username, displayName, email, bio, avatarUrl, xId, xUsername, verified, topics (jsonb)
- `skills` — name, title, description, category, currentVersion, installs, isPublished, authorId
- `skill_versions` — version, contentHash (sha256), files (jsonb array of {name, content})
- `follows` — followerId, followingId
- `waitlist` — email signups

**Seeded Data:**
- `mager` — verified, topics: coding/music/Chicago, skill: Frontend Design
- `loooom` — community account, historical skills: Franklin (How to Learn Anything), Plato (Socratic Questioning), Lincoln (Persuasive Speechwriting)

**Design Philosophy:**
- **Etsy meets Dribbble** — curated, beautiful, creator-centric
- **"Hot nerd at the coffee shop with a book"** — not a SaaS landing page
- Playwrite IT Moderna at weight 100 = barely-there calligraphy, ink-on-paper text-shadow
- Marker-highlight effects (.marker.pink/.blue/.orange/.green)
- Tight line-heights: 1.1 headlines, 1.15 handwriting, 1.4 body
- Light mode: paper grain, warm cream, thick paint-marker topic underlines
- Profile: "[Name] writes skills about topic1, topic2" with gradient underlines

**Language Rules:**
- Never say "install" → use "use", "save", "add", "share"
- Never say "celebrity" → it's about showcasing skills and discovery
- Target: non-technical creators (sourdough bakers, musicians, professors)

**Positioning:**
- skills.sh = npm registry (index, developer tools)
- Loooom = Etsy/Dribbble (discovery, social, creator community)
- Skills = prompts + code. Always free. Forkable. Agent-agnostic.

**Workflow:**
1. `npm run dev` for local
2. `npm run build` before push
3. `npx drizzle-kit push` to sync schema to Neon
4. `POST /api/seed` to seed data (idempotent)
5. Commit: `feat(loooom):`, `fix(loooom):`

**Next Steps (priority):**
1. WYSIWYG markdown skill editor — THE unlock
2. X/Twitter OAuth for verified profiles
3. Search + discovery
4. Forking mechanism
5. Donation/tip mechanism
6. GitHub sync (import/export)

**Blog draft:** ~/Code/magerblog/src/content/blog/2026-02-18-loooom.md (draft: true)
