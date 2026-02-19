# Loooom — Vision

> Where skills are woven.

## What
A social skills marketplace for AI agents. Browse, craft, and install agent skills from verified authors with rich context.

## Why
Existing skill directories (skills.sh, etc.) are developer-centric and lack social discovery. We believe:
- **Skills have authors, and authors have credibility.** Who made it matters.
- **Context is what separates expertise from prompts.** Reference material, examples, philosophy — not just instructions.
- **Non-technical creators should be able to publish skills.** A WYSIWYG editor, not git.
- **Discovery should be social.** Follow authors, see trending, browse by category.

## Core Principles
1. **Agent-agnostic** — follows [agentskills.io](https://agentskills.io) spec
2. **Creator-first** — WYSIWYG markdown editor, no git required
3. **Verified authors** — X/Twitter OAuth for identity
4. **Context is first-class** — skills ship with reference material, author notes, examples
5. **Social discovery** — profiles, follow, trending, categories, ratings
6. **GitHub integration** — import from repos or export to GitHub
7. **Content-addressed versioning** — sha256(content) = version ID, immutable history
8. **Free + tips** — platform is free, authors can receive donations

## The Profile Page
The heart of Loooom. Big handwriting font: "Mager writes skills about **coding**, **music**, and **Chicago**" with gradient underlines on topics. Skills listed with full code viewers, file tabs, version hashes. Simple, beautiful, personal.

## Stack
- SvelteKit 5 + TypeScript
- Neon (Postgres)
- Vercel
- Twitter/X OAuth 2.0

## Name
Loooom. Four o's. Like extra yarn on the spool. Domain: loooom.xyz.
