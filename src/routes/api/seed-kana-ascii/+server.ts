import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, skills, skillVersions } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';
import { createHash } from 'crypto';

const SKILL_MD = `---
name: kana-ascii
description: Render hiragana, katakana, and kanji as ASCII art in the terminal to help learners visualize stroke structure and build visual memory. Pairs with Japanese learning sessions in Claude Code.
author: mager
version: 1.1.0
---

# Kana ASCII

Teach Japanese characters visually in the terminal using a **dot-grid canvas** (13 wide × 9 tall). Every character gets the same grid — guaranteed monospace rendering across all terminals.

## Rendering Rules

- Grid: **13 cols × 9 rows** of dots (\`.\`)
- Draw strokes **on top of dots** using: \`- | / \\ _ ( ) ~ ^ '\`
- Label strokes inline as \`[1]\` \`[2]\` \`[3]\` (never circled numbers — they break monospace)
- After the grid: list each stroke by number with its direction and type
- After strokes: give the **mnemonic** — vivid, weird, memorable

## Dot Grid Template (copy for each character)

\`\`\`
. . . . . . . . . . . . .
. . . . . . . . . . . . .
. . . . . . . . . . . . .
. . . . . . . . . . . . .
. . . . . . . . . . . . .
. . . . . . . . . . . . .
. . . . . . . . . . . . .
. . . . . . . . . . . . .
. . . . . . . . . . . . .
\`\`\`

---

## Hiragana Vowel Row

### あ (a)

\`\`\`
. . . . . . . . . . . . .
. . - - - [1] - - - . . .
. . . . | . . | . . . . .
. . . . | [2] | . . . . .
. . . . - - - - . . . . .
. . . . . | . . . . . . .
. . . . ( . ) [3] . . . .
. . . . . . \\ . . . . . .
. . . . . . ~[4] . . . . .
\`\`\`

\`\`\`
[1] horizontal bar    — left to right across top
[2] box enclosure     — down, across bottom, up (open top-left)
[3] drop + loop       — straight down, then curves into circle
[4] hook sweep        — sweeps right and flicks up
\`\`\`
Mnemonic: *Someone tied the letter 'a' into a knot. Messy — but it IS an 'a' in there.*

---

### い (i)

\`\`\`
. . . . . . . . . . . . .
. . . . . . . . . . . . .
. . ( . . . ( . . . . . .
. . | . . . | . . . . . .
. . | [1] . | [2] . . . .
. . | . . . | . . . . . .
. . ) . . . ) . . . . . .
. . . . . . . . . . . . .
. . . . . . . . . . . . .
\`\`\`

\`\`\`
[1] left stroke   — curves in at top, drops, hooks at base
[2] right stroke  — same shape, shorter
\`\`\`
Mnemonic: *Two eels side by side. 'ee' in eel → 'i'.*

---

### う (u)

\`\`\`
. . . . . . . . . . . . .
. . . . . ^ . . . . . . .
. . . . . [1] . . . . . .
. . . . ( . . ) . . . . .
. . . . | . [2] | . . . .
. . . . | . . . | . . . .
. . . . ( . . . ~ . . . .
. . . . . . . . . . . . .
. . . . . . . . . . . . .
\`\`\`

\`\`\`
[1] arch          — small hat stroke at top
[2] open oval     — down left side, across bottom, up right, flick hook
\`\`\`
Mnemonic: *Little hat on top looking up. 'u' = up.*

---

### え (e)

\`\`\`
. . . . . . . . . . . . .
. . - - - [1] - - - . . .
. . . . . | . . . . . . .
. . . . . | [2] . . . . .
. . . . . | . . . . . . .
. . . ( _ | [3] . . . . .
. . . \\ . . . . . . . . .
. . . .\\ . . . . . . . . .
. . . . ~ . . . . . . . .
\`\`\`

\`\`\`
[1] horizontal cross  — left to right
[2] vertical drop     — straight down from center
[3] left sweep        — starts mid-left, curves under and sweeps out right
\`\`\`
Mnemonic: *Person bowing with arms wide — elegant.*

---

### お (o)

\`\`\`
. . . . . . . . . . . . .
. . - - - [1] - - - . . .
. . ( . . . . . ) . . . .
. . | . . [2] . | . . . .
. . | . . . . . | . . . .
. . | . . * [3] | . . . .
. . ( . . . . . ~ . . . .
. . . . . . . . . . . . .
. . . . . . . . . . . . .
\`\`\`

\`\`\`
[1] horizontal bar    — left to right across top
[2] box enclosure     — wraps around center (open bottom-right)
[3] dot + swirl       — center dot, then sweeping hook out right
\`\`\`
Mnemonic: *A dot orbiting inside a box. 'o' = orbit.*

---

## Katakana Vowel Row

### ア (A)

\`\`\`
. . . . . . . . . . . . .
. . - - - [1] - - . . . .
. . . . . . . . . . . . .
. . . . . / . \\ . . . . .
. . . . . /[2] \\ . . . . .
. . . . . . . . \\ . . . .
. . . . . . . . |[3] . . .
. . . . . . . . | . . . .
. . . . . . . . . . . . .
\`\`\`

\`\`\`
[1] top bar        — horizontal
[2] diagonal left  — sweeps down-left from center
[3] vertical drop  — straight down right side
\`\`\`
Mnemonic: *A roof with a nail through it. Like the letter A.*

---

### イ (I)

\`\`\`
. . . . . . . . . . . . .
. . . \\ . . . . . . . . .
. . . .\\[1] . . . . . . .
. . . . \\ . . . . . . . .
. . . . .\\ . . . . . . . .
. . . . . |[2] . . . . . .
. . . . . | . . . . . . .
. . . . . ~ . . . . . . .
. . . . . . . . . . . . .
\`\`\`

\`\`\`
[1] diagonal slash  — top-right to center
[2] vertical hook   — drops from cross point, hook at base
\`\`\`
Mnemonic: *A leaning post with a hook. Falling forward like a tired 'I'.*

---

### ウ (U)

\`\`\`
. . . . . . . . . . . . .
. . . . . * [1] . . . . .
. . . . . . . . . . . . .
. . . . - - [2] - - . . .
. . . . ( . . . ) . . . .
. . . . | . [3] | . . . .
. . . . ( . . . ~ . . . .
. . . . . . . . . . . . .
. . . . . . . . . . . . .
\`\`\`

\`\`\`
[1] dot/crown jewel — single mark at top
[2] horizontal bar  — across middle
[3] open oval       — drops, curves under, hooks right
\`\`\`
Mnemonic: *A crown with a jewel. Royal 'u'.*

---

### エ (E)

\`\`\`
. . . . . . . . . . . . .
. . - - - [1] - - . . . .
. . . . . . . . . . . . .
. . . . . |[2] . . . . . .
. . . . . | . . . . . . .
. . . . . | . . . . . . .
. . - - - [3] - - . . . .
. . . . . . . . . . . . .
. . . . . . . . . . . . .
\`\`\`

\`\`\`
[1] top bar     — horizontal
[2] center post — straight vertical connecting both bars
[3] bottom bar  — horizontal (longer than top in the real character)
\`\`\`
Mnemonic: *An I-beam from construction. Engineering.*

---

### オ (O)

\`\`\`
. . . . . . . . . . . . .
. . - - - [1] - - . . . .
. . . . . | . . . . . . .
. . . . . |[2] . . . . . .
. . . . . | . . . . . . .
. . . . . + - - [3] . . .
. . . . . . . . \\ . . . .
. . . . . . . . ~ . . . .
. . . . . . . . . . . . .
\`\`\`

\`\`\`
[1] top bar         — horizontal
[2] vertical post   — drops from center of bar
[3] right arm       — shoots right from midpoint, sweeps down and hooks
\`\`\`
Mnemonic: *A cross where one arm breaks off and swings down. Open swing.*

---

## Kanji Approach

Decompose into radicals. Draw each radical component first, then show how they stack or combine.

\`\`\`
山 (yama — mountain, 3 strokes)

. . . . . . . . . . . . .
. . . | . . . | . . . . .
. . . | [1]. .|[3] . . . .
. | . | . . . | . | . . .
. |[2]| . . . | . | . . .
. | . - - - - - . | . . .
. | . . . . . . . | . . .
. - - - - - - - - - . . .
. . . . . . . . . . . . .
\`\`\`

Three peaks, middle tallest. Shows meaning directly — mountain silhouette.

Always include:
- Radical breakdown
- On-yomi (音読み): Chinese-derived reading
- Kun-yomi (訓読み): Native Japanese reading
- A sentence using it

---

## Session Flow

1. Draw the character on the dot grid
2. List strokes \`[1]\` \`[2]\` with direction + type
3. Give the mnemonic (vivid, weird, personal if the learner has a better one)
4. Ask: *"What do you see in this shape?"*
5. Drill: *"Trace it in the air. What strokes did you use?"*
6. Move on only when they can describe it from memory

## Trigger Phrases

Activate on:
- \`"draw [character]"\`
- \`"show me [character]"\`
- \`"kana ascii"\` or \`"ascii mode"\`
- Any new character introduced during a lesson

## Pairing

Works standalone or alongside \`mager/beginner-japanese\`.
`;

export async function POST() {
	const [magerUser] = await db.select().from(users).where(eq(users.username, 'mager'));
	if (!magerUser) return json({ error: 'mager user not found — run /api/seed first' }, { status: 404 });

	const [existing] = await db.select().from(skills).where(
		and(eq(skills.authorId, magerUser.id), eq(skills.name, 'kana-ascii'))
	);

	const hash = 'sha256:' + createHash('sha256').update(SKILL_MD).digest('hex').slice(0, 12);

	if (existing) {
		await db.update(skills).set({
			currentVersion: '1.1.0',
			updatedAt: new Date()
		}).where(eq(skills.id, existing.id));

		await db.insert(skillVersions).values({
			skillId: existing.id,
			version: '1.1.0',
			contentHash: hash,
			files: [{ name: 'SKILL.md', content: SKILL_MD }]
		});

		return json({ message: 'updated kana-ascii to v1.1.0', skillId: existing.id });
	}

	const [skill] = await db.insert(skills).values({
		authorId: magerUser.id,
		name: 'kana-ascii',
		title: 'Kana ASCII',
		description: 'Render hiragana, katakana, and kanji as ASCII art in the terminal. Dot-grid canvas + stroke order + mnemonics — guaranteed monospace across all terminals.',
		category: 'Education',
		currentVersion: '1.1.0',
		isPublished: true,
		installs: 0
	}).returning();

	await db.insert(skillVersions).values({
		skillId: skill.id,
		version: '1.1.0',
		contentHash: hash,
		files: [{ name: 'SKILL.md', content: SKILL_MD }]
	});

	return json({ message: 'seeded kana-ascii skill for mager', skillId: skill.id });
}
