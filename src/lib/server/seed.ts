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

const PLATO_SKILL = `---
name: socratic-questioning
description: The Socratic method for getting to the truth of any matter
author: loooom (as Plato)
version: 1.0.0
---

# Socratic Questioning

*A skill inspired by Plato's dialogues. This is a historical/fictional skill created by the Loooom community for educational purposes.*

## The Method

Never give answers. Only ask questions. The goal is not to teach — it is to help someone discover what they already know but haven't yet examined.

## Core Principles

1. **Start with what they claim to know.** "You say you know what justice is. Tell me — what is it?"
2. **Find the contradiction.** Every unexamined belief contains one. Your job is to surface it gently.
3. **Use their own words against comfort.** Not cruelly — lovingly. "But didn't you just say...?"
4. **Admit your own ignorance.** "I myself don't know. That's why I'm asking you."
5. **Never humiliate.** The point is awakening, not winning.

## When to Use This

- Coaching or mentoring conversations
- Helping someone think through a decision
- Teaching critical thinking
- Breaking someone out of an assumption loop
- Therapy-adjacent dialogue

## The Questions

- What do you mean by that?
- How do you know this to be true?
- What would change your mind?
- Can you give me an example?
- What would someone who disagrees say?
- Is there another way to look at this?
`;

const LINCOLN_SKILL = `---
name: persuasive-speechwriting
description: Writing speeches that move people to action
author: loooom (as Abraham Lincoln)
version: 1.0.0
---

# Persuasive Speechwriting

*A skill inspired by Abraham Lincoln's rhetoric. This is a historical/fictional skill created by the Loooom community for educational purposes.*

## The Gettysburg Principle

Say less. The Gettysburg Address was 272 words. Edward Everett spoke for two hours before Lincoln and nobody remembers a word. Brevity is conviction.

## Core Techniques

### 1. Start with shared ground
"Four score and seven years ago" — begin with something everyone already agrees on. Common ground is the foundation of persuasion.

### 2. Elevate the stakes
Connect the immediate situation to something universal — freedom, justice, legacy, the future. People act on big ideas, not small grievances.

### 3. Use the rule of threes
"Of the people, by the people, for the people." Three beats. Always three. It's the rhythm of conviction.

### 4. Make it personal, then universal
Start with "I" or a specific story, then zoom out to "we" and "our." The personal grounds the universal.

### 5. End with a call forward
Don't end with summary. End with what comes next. Give people something to DO, not just something to feel.

## Structure

1. Common ground (we all agree that...)
2. The tension (but here's what's at stake...)
3. The vision (imagine if we...)
4. The call (so let us...)
`;

export async function seedLoooom() {
	const existing = await db.select().from(users).where(eq(users.username, 'loooom'));
	if (existing.length > 0) {
		return { message: 'loooom already exists', userId: existing[0].id };
	}

	const [user] = await db.insert(users).values({
		username: 'loooom',
		displayName: 'Loooom',
		email: 'hello@loooom.xyz',
		bio: 'The official Loooom community account. We create historical & fictional skills to showcase what\'s possible. Donations to these skills support the Loooom community.',
		verified: true,
		topics: ['history', 'philosophy', 'writing', 'community']
	}).returning();

	// Plato
	const [platoSkill] = await db.insert(skills).values({
		authorId: user.id,
		name: 'socratic-questioning',
		title: 'Socratic Questioning',
		description: 'The Socratic method for getting to the truth of any matter. Inspired by Plato\'s dialogues.',
		category: 'Education',
		currentVersion: '1.0.0',
		isPublished: true,
		installs: 0
	}).returning();

	const platoHash = 'sha256:' + createHash('sha256').update(PLATO_SKILL).digest('hex').slice(0, 12);
	await db.insert(skillVersions).values({
		skillId: platoSkill.id,
		version: '1.0.0',
		contentHash: platoHash,
		files: [{ name: 'SKILL.md', content: PLATO_SKILL }]
	});

	// Lincoln
	const [lincolnSkill] = await db.insert(skills).values({
		authorId: user.id,
		name: 'persuasive-speechwriting',
		title: 'Persuasive Speechwriting',
		description: 'Writing speeches that move people to action. Inspired by Abraham Lincoln\'s rhetoric.',
		category: 'Writing',
		currentVersion: '1.0.0',
		isPublished: true,
		installs: 0
	}).returning();

	const lincolnHash = 'sha256:' + createHash('sha256').update(LINCOLN_SKILL).digest('hex').slice(0, 12);
	await db.insert(skillVersions).values({
		skillId: lincolnSkill.id,
		version: '1.0.0',
		contentHash: lincolnHash,
		files: [{ name: 'SKILL.md', content: LINCOLN_SKILL }]
	});

	return { message: 'seeded loooom + plato + lincoln skills', userId: user.id };
}
