import { db } from './db';
import { users, skills, skillVersions } from './schema';
import { eq } from 'drizzle-orm';
import { createHash } from 'crypto';

const SKILL_MD = `---
name: frontend-design
description: A frontend design agent channeling a specific aesthetic philosophy
author: mager
version: 1.0.0
---

# Frontend Design

A frontend design skill for AI agents. Every UI you touch should feel hot, sleek, sexy, usable, fun, and addictive.

## Core Philosophy

Design is not decoration. It's communication. Every pixel exists to serve the user's intent while making them *feel* something. The best interfaces are invisible — they get out of the way while being impossibly beautiful.

**Principles:**
- **Clarity over cleverness** — if it needs a tooltip, redesign it
- **Motion with meaning** — every animation tells a story
- **Contrast is king** — visual hierarchy through bold contrast, not clutter
- **White space is not empty** — it's breathing room
- **Dark mode first** — because we live in the future

## Design Patterns

### Cards
Cards are the atomic unit of modern UI. Rules:
- Subtle border, generous padding (1.25rem+)
- Hover state: slight lift (translateY -2px) + border glow
- Never more than 3 levels of text hierarchy per card
- Background should be 1-2 shades lighter than page bg

### Buttons
- Primary: solid fill, bold, slight shadow
- Secondary: outlined, transparent bg
- Ghost: no border, text only, underline on hover
- Always include hover + active + focus states
- Min touch target: 44px

### Forms
- Labels above inputs, never floating
- Generous input padding (0.875rem)
- Focus ring = accent color border, not browser default
- Error states: pink/red border + helper text below
- Success: green accent, brief animation

## Layout Principles

### Spacing Scale
Use a consistent spacing scale based on 0.25rem increments:
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)  
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)
- 3xl: 4rem (64px)

### Grid
- Max content width: 1200px
- Side padding: 2rem (1rem mobile)
- Column gap: 1.5-2rem
- Mobile: single column, always

### Typography
- Display: bold, tight letter-spacing (-0.02em)
- Body: 1rem, line-height 1.6
- Small: 0.875rem for metadata
- Handwriting fonts for personality moments
- Monospace for code, versions, hashes
`;

export async function seedMager() {
	// Check if user already exists
	const existing = await db.select().from(users).where(eq(users.username, 'mager'));
	if (existing.length > 0) {
		return { message: 'mager already exists', userId: existing[0].id };
	}

	// Insert user
	const [user] = await db.insert(users).values({
		username: 'mager',
		displayName: 'Mager',
		email: 'andrew.mager@gmail.com',
		bio: 'Building things that matter. Based in Chicago.',
		verified: true,
		topics: ['coding', 'music', 'Chicago']
	}).returning();

	// Insert skill
	const [skill] = await db.insert(skills).values({
		authorId: user.id,
		name: 'frontend-design',
		title: 'Frontend Design',
		description: 'A frontend design agent channeling a specific aesthetic philosophy. Every UI you touch should feel hot, sleek, sexy, usable, fun, and addictive.',
		category: 'Design',
		currentVersion: '1.0.0',
		isPublished: true,
		installs: 0
	}).returning();

	// Insert skill version
	const contentHash = 'sha256:' + createHash('sha256').update(SKILL_MD).digest('hex').slice(0, 12);

	await db.insert(skillVersions).values({
		skillId: skill.id,
		version: '1.0.0',
		contentHash,
		files: [{ name: 'SKILL.md', content: SKILL_MD }]
	});

	return { message: 'seeded mager + frontend-design skill', userId: user.id, skillId: skill.id };
}
