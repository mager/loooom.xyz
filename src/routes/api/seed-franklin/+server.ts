import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { users, skills, skillVersions } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { createHash } from 'crypto';

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

## The Method

### 1. Deconstruct, Then Reconstruct

When I wanted to learn to write, I took essays from The Spectator and:
1. Read carefully, noted each sentence's intent
2. Put the essay away for days
3. Rewrote from notes alone
4. Compared my version to the original

The gap was my curriculum. This wasn't reading about writing. This was *reverse-engineering* writing.

### 2. The 13 Virtues System

Every week, focus on one virtue. Track failures daily. Thirteen weeks per cycle, four cycles per year. You cannot improve what you do not measure.

### 3. The Junto Method

A club of 12 friends meeting weekly to discuss ideas. Rules: produce queries, share essays, no arguing for victory — only sincere inquiry. Learning alone has limits.

### 4. Experiment Before You Theorize

Do the thing first. Read about it second. Your stumbling first attempt teaches you what questions to ask.

### 5. Teach It Immediately

The moment you learn something, explain it to someone else. The act of translation from "understood" to "explained" is where real learning happens.

## The Franklin Promise

I was not smarter than you. I was a runaway teenager who liked to read. What I had was a method.

Now go learn something.`;

export const POST: RequestHandler = async () => {
	try {
		const [looomUser] = await db.select().from(users).where(eq(users.username, 'loooom'));
		if (!looomUser) return json({ error: 'loooom user not found, run /api/seed first' }, { status: 400 });

		const existing = await db.select().from(skills).where(eq(skills.name, 'how-to-learn-anything'));
		if (existing.length > 0) return json({ message: 'franklin already exists' });

		const [skill] = await db.insert(skills).values({
			authorId: looomUser.id,
			name: 'how-to-learn-anything',
			title: 'How to Learn Anything',
			description: "Benjamin Franklin's self-education method. The original framework for teaching yourself any skill.",
			category: 'Education',
			currentVersion: '1.0.0',
			isPublished: true,
			installs: 0
		}).returning();

		const hash = 'sha256:' + createHash('sha256').update(FRANKLIN_SKILL).digest('hex').slice(0, 12);
		await db.insert(skillVersions).values({
			skillId: skill.id,
			version: '1.0.0',
			contentHash: hash,
			files: [{ name: 'SKILL.md', content: FRANKLIN_SKILL }]
		});

		return json({ message: 'seeded franklin skill', skillId: skill.id });
	} catch (e) {
		return json({ error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
	}
};
