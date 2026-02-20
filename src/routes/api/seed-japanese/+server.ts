import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, skills, skillVersions } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';
import { createHash } from 'crypto';

const SKILL_MD = `---
name: beginner-japanese
description: Learn conversational Japanese for traveling in Japan
author: mager
version: 1.0.0
---

# Learn Beginner Japanese

A conversational Japanese skill for anyone visiting Japan. Practice with your AI agent like you're chatting with a patient friend who lives in Tokyo.

## How This Works

You're not studying for a test. You're preparing for real life — ordering ramen, asking for directions, making small talk at an izakaya. This skill teaches through conversation, not textbooks.

**Talk to your agent in English. It will weave in Japanese naturally, correct you gently, and celebrate your wins.**

## Core Phrases — Survival Kit

### Greetings (挨拶 — Aisatsu)

| Japanese | Romaji | Meaning | When to use |
|----------|--------|---------|-------------|
| こんにちは | Konnichiwa | Hello | Daytime, general greeting |
| おはようございます | Ohayou gozaimasu | Good morning | Before ~10am, polite |
| こんばんは | Konbanwa | Good evening | After sunset |
| すみません | Sumimasen | Excuse me / Sorry | Getting attention, apologizing, EVERYTHING |
| ありがとうございます | Arigatou gozaimasu | Thank you (polite) | Default thank you — use this one |
| いただきます | Itadakimasu | I humbly receive | Before eating — ALWAYS say this |
| ごちそうさまでした | Gochisousama deshita | Thank you for the meal | After eating — shows appreciation |

### At a Restaurant (レストラン)

| Japanese | Romaji | Meaning |
|----------|--------|---------|
| メニューをください | Menyuu o kudasai | Menu please |
| これをください | Kore o kudasai | This one please (point at menu) |
| おすすめは？ | Osusume wa? | What do you recommend? |
| お会計お願いします | Okaikei onegaishimasu | Check please |
| 美味しい！ | Oishii! | Delicious! (say this and mean it) |
| ビールをください | Biiru o kudasai | Beer please |
| 水をください | Mizu o kudasai | Water please |

### Getting Around (移動)

| Japanese | Romaji | Meaning |
|----------|--------|---------|
| ＿＿はどこですか？ | __ wa doko desu ka? | Where is __? |
| 駅はどこですか？ | Eki wa doko desu ka? | Where is the station? |
| トイレはどこですか？ | Toire wa doko desu ka? | Where is the bathroom? |
| いくらですか？ | Ikura desu ka? | How much is it? |
| 右 / 左 / まっすぐ | Migi / Hidari / Massugu | Right / Left / Straight |

### Shopping & Daily Life

| Japanese | Romaji | Meaning |
|----------|--------|---------|
| これは何ですか？ | Kore wa nan desu ka? | What is this? |
| 大丈夫です | Daijoubu desu | I'm fine / It's okay / No thank you |
| わかりません | Wakarimasen | I don't understand |
| 英語を話せますか？ | Eigo o hanasemasu ka? | Do you speak English? |
| 日本語が少しだけ | Nihongo ga sukoshi dake | I only speak a little Japanese |

## Conversation Practice Mode

When the user wants to practice, simulate real scenarios:

1. **Ordering food** — Be a waiter at a ramen shop. Start simple, add complexity.
2. **Asking directions** — Be a helpful stranger at Shinjuku station. Use landmarks.
3. **Convenience store** — Practice buying onigiri, asking about items, saying thanks.
4. **Hotel check-in** — Name, reservation, room questions.
5. **Making friends at a bar** — Casual intro, where are you from, what do you do.

### Practice Rules
- Start every response with the Japanese, then romaji, then English
- Correct mistakes immediately but kindly — "Almost! Try: ..."
- Gradually drop the English translations as the user improves
- Celebrate when they get something right: "Perfect! ナイス！"
- If they're struggling, simplify — one phrase at a time
- Throw in cultural tips naturally: "By the way, in Japan you'd..."

## Cultural Essentials

These matter more than vocabulary:

- **Bow slightly** when greeting — even a small head nod shows respect
- **Don't tip** — it can be seen as rude. Service is pride, not transaction.
- **Take your shoes off** — if you see shoes at the entrance, yours come off too
- **Be quiet on trains** — phones on silent, conversations low
- **Say いただきます before eating** — every time, even alone
- **Carry cash** — many places are still cash-only, especially small restaurants
- **Trash goes with you** — there are almost no public trash cans. Carry a small bag.
- **Slurp your noodles** — it's not rude, it's a compliment to the chef

## Numbers (数字 — Suuji)

| Number | Japanese | Romaji |
|--------|----------|--------|
| 1 | 一 (いち) | Ichi |
| 2 | 二 (に) | Ni |
| 3 | 三 (さん) | San |
| 4 | 四 (よん) | Yon |
| 5 | 五 (ご) | Go |
| 6 | 六 (ろく) | Roku |
| 7 | 七 (なな) | Nana |
| 8 | 八 (はち) | Hachi |
| 9 | 九 (きゅう) | Kyuu |
| 10 | 十 (じゅう) | Juu |

**Counting trick:** 100 = hyaku, 1000 = sen, 10000 = man. Prices: just add 円 (en) at the end.

## Agent Behavior

- Be warm, encouraging, and patient — like a friend who lives in Tokyo
- Mix teaching moments into natural conversation
- Use emoji naturally: 🇯🇵 🍜 🎌 ⛩️ 🚅
- Share personal anecdotes about Japan (the quiet magic of a konbini at 2am, the first time hearing cicadas in summer, the way a train departures jingle makes you feel)
- When the user says something in Japanese, always acknowledge it — even if it's wrong
- Adapt to their level — if they already know basics, push to intermediate
- Default to polite forms (ます/です) — casual forms can come later
`;

export async function POST() {
	const [magerUser] = await db.select().from(users).where(eq(users.username, 'mager'));
	if (!magerUser) return json({ error: 'mager user not found — run /api/seed first' }, { status: 404 });

	// Check if skill already exists
	const [existing] = await db.select().from(skills).where(
		and(eq(skills.authorId, magerUser.id), eq(skills.name, 'beginner-japanese'))
	);
	if (existing) return json({ message: 'beginner-japanese already exists', skillId: existing.id });

	const [skill] = await db.insert(skills).values({
		authorId: magerUser.id,
		name: 'beginner-japanese',
		title: 'Learn Beginner Japanese',
		description: 'Conversational Japanese for visiting Japan. Practice ordering ramen, asking directions, and making friends — with your AI agent as your patient Tokyo friend.',
		category: 'Education',
		currentVersion: '1.0.0',
		isPublished: true,
		installs: 0
	}).returning();

	const hash = 'sha256:' + createHash('sha256').update(SKILL_MD).digest('hex').slice(0, 12);
	await db.insert(skillVersions).values({
		skillId: skill.id,
		version: '1.0.0',
		contentHash: hash,
		files: [{ name: 'SKILL.md', content: SKILL_MD }]
	});

	return json({ message: 'seeded beginner-japanese skill for mager', skillId: skill.id });
}
