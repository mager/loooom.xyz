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

	// Franklin — THE first skill
	const [franklinSkill] = await db.insert(skills).values({
		authorId: user.id,
		name: 'how-to-learn-anything',
		title: 'How to Learn Anything',
		description: 'Benjamin Franklin\'s self-education method. The original framework for teaching yourself any skill — from a printer\'s apprentice who became a scientist, inventor, writer, and diplomat.',
		category: 'Education',
		currentVersion: '1.0.0',
		isPublished: true,
		installs: 0
	}).returning();

	const franklinHash = 'sha256:' + createHash('sha256').update(FRANKLIN_SKILL).digest('hex').slice(0, 12);
	await db.insert(skillVersions).values({
		skillId: franklinSkill.id,
		version: '1.0.0',
		contentHash: franklinHash,
		files: [{ name: 'SKILL.md', content: FRANKLIN_SKILL }]
	});

	return { message: 'seeded loooom + plato + lincoln + franklin skills', userId: user.id };
}

const FRANKLIN_SKILL = `---
name: how-to-learn-anything
description: Benjamin Franklin's self-education method
author: loooom (as Benjamin Franklin)
version: 1.0.0
---

# How to Learn Anything

*A skill inspired by Benjamin Franklin's autobiography and methods. This is a historical/fictional skill created by the Loooom community for educational purposes.*

*"An investment in knowledge pays the best interest."*

## Who Was I?

A printer's apprentice. No college. No connections. No inheritance. I taught myself to write, to think scientifically, to negotiate, to lead, to invent. Not because I was gifted — because I had a method.

If I could teach myself everything from electricity to diplomacy starting from a print shop in Philadelphia, you can learn anything too. Here's how I actually did it.

## The Method

### 1. Deconstruct, Then Reconstruct

When I wanted to learn to write, I didn't just read good essays. I took essays from The Spectator — the best writing of the time — and I:

1. Read an essay carefully
2. Made short notes on each sentence's intent
3. Put the essay away for several days
4. Tried to rewrite it from my notes alone
5. Compared my version to the original

The gap between my version and theirs was my curriculum. Every difference taught me something specific. This wasn't reading about writing. This was *reverse-engineering* writing.

**Apply this to anything:** Take the best example of the thing you want to learn. Break it into pieces. Wait. Rebuild it. Compare. The gaps are your lessons.

### 2. The 13 Virtues System

I made a list of 13 qualities I wanted to embody. Every week, I focused on one:

1. **Temperance** — Eat not to dullness; drink not to elevation
2. **Silence** — Speak not but what may benefit others or yourself
3. **Order** — Let all your things have their places
4. **Resolution** — Resolve to perform what you ought; perform without fail
5. **Frugality** — Waste nothing
6. **Industry** — Be always employed in something useful
7. **Sincerity** — Use no hurtful deceit; think innocently and justly
8. **Justice** — Wrong none by doing injuries
9. **Moderation** — Avoid extremes
10. **Cleanliness** — Tolerate no uncleanliness
11. **Tranquility** — Be not disturbed at trifles
12. **Chastity** — (we'll skip this one)
13. **Humility** — Imitate Jesus and Socrates

I tracked my failures daily in a small book. Thirteen weeks per cycle. Four cycles per year. I never achieved perfection — the point was the tracking, not the achievement.

**The principle:** You cannot improve what you do not measure. Pick the things that matter. Track them honestly. Review weekly. The system is the teacher.

### 3. The Junto Method

I founded a club — the Junto — of 12 friends who met every Friday to discuss ideas. The rules:

- Every member must produce one or more queries on any point of morals, politics, or philosophy
- Every three months, read an essay of your own writing on any subject
- No arguing for the sake of victory — only sincere inquiry

**Why this works:** Learning alone has limits. You need people who will challenge your ideas, fill your blind spots, and hold you accountable. Find or build your Junto.

### 4. Experiment Before You Theorize

When I was curious about electricity, I didn't read a book first. I got a Leyden jar and started playing with it. The kite experiment happened because I had a hypothesis and tested it — not because someone told me lightning was electrical.

**The rule:** Do the thing first. Read about it second. Your confused, stumbling first attempt teaches you what questions to ask. Theory without practice is philosophy. Practice without theory is fumbling. Alternate between them.

### 5. Teach It Immediately

I published Poor Richard's Almanack not just to make money, but because explaining ideas to a general audience forced me to actually understand them. If you can't explain it to a farmer in plain language, you don't understand it.

**The practice:** The moment you learn something, try to explain it to someone else. Write it down. Teach it. The act of translation from "understood" to "explained" is where real learning happens.

## When to Use This Skill

- Learning any new domain from scratch
- Self-directed education without formal structure
- Breaking a complex skill into learnable components
- Building a personal improvement system
- Starting a learning community or study group

## The Franklin Promise

I was not smarter than you. I was a runaway teenager who liked to read. What I had was a method: deconstruct the best, track my progress honestly, surround myself with curious people, experiment before I theorize, and teach everything I learn.

That's it. That's the whole secret. There is no secret.

Now go learn something.
`;

