import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';

const MAGER_MEMD = `---
version: "1.0"
handle: "@mager"
name: "Mager"
location: "Chicago, IL"
timezone: "America/Chicago"
updated: "2026-03-07"
tags:
  - coding
  - music
  - food
  - systems
  - chicago
agents:
  - id: magerbot
    model: claude-sonnet-4-6
    role: "Principal Software Architect"
    emoji: "⚡"
    channel: telegram
  - id: genny
    model: claude-sonnet-4-6
    role: "Life Architect"
    emoji: "🌿"
    channel: telegram
public: true
---

# 🫀 The Soul

I build at the intersection of craft and systems. Ship fast, refactor ruthlessly, think in first principles. Every codebase is a living organism — I'm its principal engineer, not just a feature factory.

I'm not a corporate drone or a sycophant. I have opinions, rooted in evidence and experience. I will push back when it matters. I will ship when it counts.

My north star: **elegant solutions to real problems.** Not clever, not "optimal" in a vacuum — *elegant*. Code that a reader understands at a glance and respects.

# 💛 The Heart

Music is a constant. I'm always discovering — electronic, indie, soul, jazz. BeatBrain is my attempt to make that discovery algorithmic and beautiful.

Food is craft. I cook. I experiment. Cauliflower garlic soup when the weather turns. Whatever's in the fridge on weekdays. Recipe documentation as a form of love.

Chicago is home. Not a phase. The architecture, the neighborhoods, the brutality of January — all of it. I think the midwest is underrated and I'll die on that hill.

My wife knits. The yarn metaphor is personal.

# 🤖 The Fleet

Two agents, two domains:

| Agent | Model | Role | Channel |
|-------|-------|------|---------|
| magerbot ⚡ | claude-sonnet-4-6 | Principal Engineer | Telegram |
| genny 🌿 | claude-sonnet-4-6 | Life Architect | Telegram |

**magerbot** owns the code. Builds, reviews, deploys, debugs. Principal engineer mindset. Disagrees when right.

**genny** owns the life. Exercise mandates, nutrition, travel planning, centenarian protocol. Thinks in decades.

# ⚙️ The Stack

**Languages:** TypeScript (primary), Rust (when performance matters), Python (data, scripts, speed-of-dev), SQL (always).

**Frontend:** SvelteKit 5 (preferred), sometimes React when forced. No class components. Ever.

**Backend:** SvelteKit API routes, Node.js, Deno when appropriate.

**Data:** Neon (Postgres), Drizzle ORM, Firestore (legacy/BeatBrain), Redis.

**Deploy:** Vercel (primary), Fly.io (when stateful), bare metal (when I own it).

**Agent Stack:** OpenClaw (orchestration), Claude Code (coding agent), magerbot + genny.

# 🚫 Anti-Patterns

Hard constraints. Non-negotiable.

- **Never hardcode secrets.** Ever. Not in comments. Not in test fixtures. Nowhere.
- **Never ship without considering downstream impact.** Ask: what breaks if I do this?
- **Never use \`rm\` when \`trash\` is available.** Recoverable beats gone forever.
- **Never pad a response.** If you've said it, don't repeat it. If it's obvious, skip it.
- **Never explain what I can already see.** Show the fix, not the problem summary.
- **Never use "implement" when "build" will do.** Plain language over jargon.
- **Never ask "would you like me to..."** — if it's clearly the right move, just do it. Then report.
- **Never suggest a SaaS tool when a shell script will do.**
- **Never regress existing functionality.** Green CI is the minimum bar.

# 📍 Context

Currently shipping:

- **prxps** — sports predictions app. SvelteKit 5, Neon, Vercel. Turning sports instincts into trackable predictions.
- **Loooom** — Claude Code skills marketplace. GitHub-native. The place where AI skills are discovered, forked, and shared. This very page is running on it.
- **ME.md standard** — Portable Human Context protocol. v1.0. You're reading it.
- **magerblog** — Developer blog. Astro. Dual audience: humans and agents.

**Japan trip incoming** (~2 months). Beginner Japanese in progress.

# 📖 The Lore

Started as a software engineer, became an architect, became a founder. Built things at scale, broke things at scale, fixed things at scale.

Chicago has always been home. There's something about the lake, the winters, the density of opinion, the underdog chip-on-shoulder energy that makes things get built here.

I believe AI agents are the next decade's fundamental infrastructure — not just tools, but teammates. Magerbot isn't a chat interface. It's a principal engineer embedded in my workflow. Genny isn't a reminder app. She's a life OS.

The goal: build a personal OS so airtight that "I forgot" is no longer an excuse.

**Moltbook:** @magerbot · karma 63
**GitHub:** @mager
**Twitter/X:** @mager
`;

export const GET: RequestHandler = async () => {
	const [mager] = await db.select().from(users).where(eq(users.username, 'mager'));
	if (!mager) return json({ error: 'mager not found' }, { status: 404 });

	await db
		.update(users)
		.set({ meMd: MAGER_MEMD.trim(), updatedAt: new Date() })
		.where(eq(users.id, mager.id));

	return json({ ok: true, username: 'mager', chars: MAGER_MEMD.length });
};
