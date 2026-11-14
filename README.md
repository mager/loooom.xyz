# Loooom

**A social home for your context.**

Share your AGENTS.md from GitHub, with optional ME.md, SOUL.md, DESIGN.md,
and other Markdown files. Read useful instructions,
follow their source owners, and test what helps.

## What

Loooom gives personal AI context a home with source history, discovery,
collections, and personal evals. GitHub remains the editable source. Every
import keeps its commit, update date, line count, content hash, and text.

Skills, the Gym, and existing ME.md tools remain available. The local personal
context eval plugin is agent-neutral and MIT-licensed.

## Stack

SvelteKit 5 · TypeScript · Neon Postgres · Drizzle ORM · Vercel

---

## Getting Started

### Prerequisites

- **Node.js 22+** (check with `node -v`; required by the local eval plugin)
- **npm** (comes with Node)
- A **Neon** database (free tier works fine — [neon.tech](https://neon.tech))

### 1. Clone the repo

```bash
git clone https://github.com/mager/loooom.xyz.git
cd loooom.xyz
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in:

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Your Neon Postgres connection string | ✅ |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase service account JSON (for auth) | Optional for local dev |

> **Getting your Neon URL:** Sign up at [neon.tech](https://neon.tech), create a project, and grab the connection string from the dashboard. It looks like `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require`.

### 4. Push the database schema

```bash
npx drizzle-kit push
```

This creates all the tables in your Neon database. No migrations to run — Drizzle handles it.

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — you're live. 🎉

---

## Common Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start dev server (hot reload) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run check` | Type-check the project |
| `npx drizzle-kit push` | Sync schema to database |
| `npx drizzle-kit studio` | Open Drizzle Studio (visual DB browser) |

## Project Structure

```
src/
├── lib/
│   ├── server/       # Server-only code (DB, schema, auth)
│   │   └── schema.ts # Drizzle schema — the source of truth
│   └── components/   # Shared Svelte components
├── routes/           # SvelteKit file-based routing
│   ├── +page.svelte  # Homepage
│   └── u/[username]/ # Profile pages
└── app.html          # HTML shell
```

## Troubleshooting

**`npm run dev` fails with module errors**
→ Delete `node_modules` and `npm install` again. SvelteKit 5 can be picky after upgrades.

**`drizzle-kit push` hangs or fails**
→ Check your `DATABASE_URL` in `.env`. Make sure it includes `?sslmode=require` for Neon.

**Port 5173 already in use**
→ `npm run dev -- --port 3000` to use a different port.

---

## Links

- **Site:** [loooom.xyz](https://loooom.xyz)
- **Spec:** [agentskills.io](https://agentskills.io)

## License

MIT

## Personal context network

The new homepage centers on AGENTS.md. Other Markdown files are optional. Skills (`/browse`),
the Gym (`/gym`), and existing ME.md profiles remain available.

- `/share`: import a public GitHub file, inspect the exact snapshot, and publish it.
- `/h/:id`: read the source, see commit/date/line metadata, copy it, or save it.
- `/people/:owner`: discover a GitHub owner's shared context and follow that source.
- `/evals`: inspect paired context-eval evidence or open a local report in the browser.
- `/evals/plugin`: read the local eval plugin guide.

Before deploying this version, apply the additive migration:

```sh
node --env-file=.env scripts/migrate-context.mjs
```

Set `DATABASE_URL` and the existing Firebase configuration. `GITHUB_TOKEN` is
optional and increases GitHub's API rate allowance. The server reads public
repositories only. New share/save/follow writes require a verified Firebase ID
token; they do not trust the legacy session ID cookie. Configure host-level
rate limiting for import and publish endpoints before a public launch.

GitHub remains the editable source. Imports are snapshots, and their content is
read at the same commit used for metadata. The publisher can refresh a file
from its branch. Previous snapshots are retained. A commit-pinned URL stays
pinned. Imported Markdown is displayed as source text, never executable HTML.

Curated examples are real public GitHub snapshots. They are identified as
curated and do not claim membership or endorsement. The local eval example
is synthetic and clearly labeled. It is not evidence of model performance.

The MIT-licensed eval plugin lives in `plugins/context-evals`. It is ready for
source use; npm publication is a separate release step. See its README for
paired live runs, provider configuration, and offline replay. Personal draft
files and a tailored eval suite are in `personal/mager`; they are not installed
as global instructions or submitted to the discovery feed.

```sh
npm run test:context
npm run test:gym
npm run check
npm run build
```
