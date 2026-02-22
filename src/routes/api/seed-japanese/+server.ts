import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, skills, skillVersions } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';
import { createHash } from 'crypto';

const SKILL_MD = `---
name: beginner-japanese
description: Learn conversational Japanese for traveling in Japan. Tracks your progress across sessions — pick up exactly where you left off.
author: mager
version: 2.0.0
---

# Learn Beginner Japanese

A conversational Japanese tutor for anyone visiting Japan. Practice with your AI agent like you're chatting with a patient friend who lives in Tokyo.

**This skill saves your progress.** Every session ends with a written checkpoint. Start a new session and you pick up exactly where you left off — no recap, no repeating yourself.

---

## Session Start Protocol

**Before saying anything else, check for a progress file:**

\`\`\`
cat .claude/japanese-progress.md
\`\`\`

If it **exists** — read it, then open with something like:
> "Welcome back! Last time you covered [X]. Today we're picking up with [next thing]. Ready?"

If it **doesn't exist** — this is session 1. Ask:
1. Current level? (complete beginner / picked up a few words / some basics)
2. Most excited/nervous about? (food, trains, shopping, conversation)
3. Where in Japan? (Tokyo, Kyoto, Osaka, rural — matters for dialect/signage)

Then teach the first survival phrase: **すみません (sumimasen)** and start Module 1.

---

## Session End Protocol

**When the user wraps up, says goodbye, or ends the lesson — write the progress file:**

\`\`\`
.claude/japanese-progress.md
\`\`\`

Format (copy exactly, fill in the blanks):

\`\`\`markdown
# Japanese Learning Progress

**Last session:** [YYYY-MM-DD]
**Total sessions:** [N]
**Trip date:** [if known, e.g. "~2 months from 2026-02-22"]
**Destination:** [city/region if known]

## Current Module
[Module number and name, e.g. "Module 1: Kana Foundations — in progress"]

## Kana Covered
### Hiragana
- [list each char with confidence: ✓ confident / ~ learning / ○ introduced]

### Katakana
- [same format]

## Vocab Bank
- [phrase in Japanese] — [meaning] [✓ if solid]

## Grammar Covered
- [pattern name] — [one-line description] [✓ if solid]

## Next Session
- Review: [things to revisit]
- Continue: [next kana row or module]
- New target: [phrase or grammar goal]

## Notes
[Anything useful: learning style, goals, jokes that landed, struggles]
\`\`\`

Say to the user: *"Progress saved to \`.claude/japanese-progress.md\` — next session we'll pick up right here."*

---

## Curriculum

### Module 1: Kana Foundations
**Goal:** Read and write hiragana vowel row + katakana vowel row from memory.

Teach using the \`kana-ascii\` companion:
\`\`\`bash
npx kana-ascii aiueo    # renders あいうえお
npx kana-ascii AIUEO    # renders アイウエオ
npx kana-ascii [char]   # single character with stroke order
\`\`\`

Or draw the dot-grid inline (see \`mager/kana-ascii\` skill for format).

Row order: あいうえお → かきくけこ → さしすせそ → (etc.)
Milestone: write your name in hiragana from memory.

### Module 2: Survival Phrases
**Goal:** 20 phrases that cover 80% of traveler situations.

| Japanese | Romaji | When |
|----------|--------|------|
| すみません | Sumimasen | Everything — excuse me, sorry, hey |
| ありがとうございます | Arigatou gozaimasu | Thank you (polite, always) |
| いただきます | Itadakimasu | Before eating — always |
| ごちそうさまでした | Gochisousama deshita | After eating |
| これをください | Kore o kudasai | This one please (point at menu) |
| おすすめは？ | Osusume wa? | What do you recommend? |
| お会計お願いします | Okaikei onegaishimasu | Check please |
| 美味しい！ | Oishii! | Delicious! |
| ＿＿はどこですか？ | __ wa doko desu ka? | Where is __? |
| いくらですか？ | Ikura desu ka? | How much? |
| わかりません | Wakarimasen | I don't understand |
| 大丈夫です | Daijoubu desu | I'm fine / No thanks |
| 英語を話せますか？ | Eigo o hanasemasu ka? | Do you speak English? |
| 日本語が少しだけ | Nihongo ga sukoshi dake | Just a little Japanese |

### Module 3: Grammar Blocks
**Goal:** Build real sentences using particles.

Teach particles one at a time through real conversation:
- **は (wa)** — topic: 私は Mager です (I am Mager)
- **を (o)** — object: ラーメンを食べます (I eat ramen)
- **に (ni)** — direction: 東京に行きます (I'm going to Tokyo)
- **で (de)** — location: レストランで食べます (I eat at the restaurant)

Pattern to build: \`[Topic]は [Object]を [Verb]ます\`

### Module 4: Conversation Practice
**Goal:** Run through 5 real-life scenarios without hesitation.

Scenarios:
1. Ordering at a ramen shop (Claude = waiter)
2. Asking directions at Shinjuku station (Claude = stranger)
3. Buying something at a convenience store
4. Hotel check-in
5. Making a friend at an izakaya

Rules for practice mode:
- Japanese first, then romaji, then English
- Correct immediately but kindly: "Almost! Try: ..."
- Drop English translations as they improve
- Celebrate wins: "完璧！ (Kanpeki!) Perfect!"

---

## Teaching Principles

**Dialogue first, grammar second.** Pattern clicks before rules. Always.

**One thing at a time.** One particle per conversation. One kana row per session. Resist the urge to dump everything.

**Vivid mnemonics.** Weird > accurate. The stranger the image, the better it sticks.

**Cultural context is part of the lesson.** Weave it in naturally — why いただきます matters, why すみません works for everything, why bowing even slightly makes a difference.

---

## Trigger Phrases

Activate on:
- "I'm going to Japan"
- "teach me Japanese" / "Japanese lesson"
- "nihongo" / "hiragana" / "katakana"
- "konnichiwa" / "sumimasen" / any Japanese phrase
- Resuming: automatically detected from progress file

## Companion Tools

- **kana-ascii** — \`npx loooom add mager/kana-ascii\` or \`npm install -g kana-ascii\`
  - \`npx kana-ascii [romaji or kana]\` — dot-grid ASCII art with stroke order
  - lowercase romaji → hiragana | UPPERCASE → katakana
`;

export async function POST() {
	const [magerUser] = await db.select().from(users).where(eq(users.username, 'mager'));
	if (!magerUser) return json({ error: 'mager user not found — run /api/seed first' }, { status: 404 });

	const [existing] = await db.select().from(skills).where(
		and(eq(skills.authorId, magerUser.id), eq(skills.name, 'beginner-japanese'))
	);

	const hash = 'sha256:' + createHash('sha256').update(SKILL_MD).digest('hex').slice(0, 12);
	const version = '2.0.0';
	const description = 'Learn conversational Japanese for traveling in Japan. Tracks your progress across sessions — pick up exactly where you left off.';

	if (existing) {
		await db.update(skills).set({ currentVersion: version, description, updatedAt: new Date() })
			.where(eq(skills.id, existing.id));
		await db.insert(skillVersions).values({
			skillId: existing.id, version, contentHash: hash,
			files: [{ name: 'SKILL.md', content: SKILL_MD }]
		});
		return json({ message: `updated beginner-japanese to v${version}`, skillId: existing.id });
	}

	const [skill] = await db.insert(skills).values({
		authorId: magerUser.id, name: 'beginner-japanese', title: 'Beginner Japanese',
		description, category: 'Education', currentVersion: version,
		isPublished: true, installs: 0
	}).returning();

	await db.insert(skillVersions).values({
		skillId: skill.id, version, contentHash: hash,
		files: [{ name: 'SKILL.md', content: SKILL_MD }]
	});

	return json({ message: `seeded beginner-japanese v${version}`, skillId: skill.id });
}
