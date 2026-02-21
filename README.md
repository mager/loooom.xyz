# 🧶 Loooom

**Where skills are woven.**

A social skills marketplace. Share what you know. Use what inspires you.

## What

Loooom is a place where people share skills — the things they're actually good at — so AI agents can learn from the best. Not templates. Not prompts. Real expertise, from real people.

Skills are always free. Authors can receive donations. The whole thing is open source.

## Stack

SvelteKit 5 · TypeScript · Neon Postgres · Drizzle ORM · Vercel

---

## Getting Started

### Prerequisites

- **Node.js 20+** (check with `node -v`)
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
