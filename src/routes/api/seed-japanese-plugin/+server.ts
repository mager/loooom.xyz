import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, skills, skillVersions, plugins, pluginSkills } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';
import { createHash } from 'crypto';

function hash(content: string) {
	return 'sha256:' + createHash('sha256').update(content).digest('hex').slice(0, 12);
}

const SKILLS_DATA = [
	{
		name: 'learn-hiragana-katakana',
		title: 'Learn Hiragana & Katakana',
		description: 'Master the two Japanese writing systems — 46 characters each. Mnemonics, stroke order, and practice drills.',
		category: 'Education',
		version: '1.0.0',
		content: `---
name: learn-hiragana-katakana
description: Master the two Japanese writing systems
author: mager
version: 1.0.0
---

# Learn Hiragana & Katakana

Before you can read anything in Japanese, you need these two alphabets. Hiragana is for native Japanese words. Katakana is for foreign words (like コーヒー = coffee). Together they're your foundation.

## How to Use This Skill

Tell your AI agent: "I want to learn hiragana" or "Quiz me on katakana." It will guide you through characters in groups of 5, using mnemonics and spaced repetition.

## Hiragana (ひらがな) — 46 Characters

### The Vowels (Start Here)
| Character | Romaji | Mnemonic |
|-----------|--------|----------|
| あ | a | Looks like an **a**ntenna on a head |
| い | i | Two **i**ce cream sticks standing up |
| う | u | A mouth saying "**oo**" |
| え | e | An **e**nergetic gymnast |
| お | o | A golf ball rolling into a hole — "**o**h!" |

### K-Row
| ka | ki | ku | ke | ko |
|----|----|----|----|----|
| か | き | く | け | こ |

### S-Row
| sa | shi | su | se | so |
|----|-----|----|----|-----|
| さ | し | す | せ | そ |

### T-Row
| ta | chi | tsu | te | to |
|----|-----|-----|----|----|
| た | ち | つ | て | と |

### N-Row
| na | ni | nu | ne | no |
|----|----|----|----|----|
| な | に | ぬ | ね | の |

### H-Row
| ha | hi | fu | he | ho |
|----|----|----|----|----|
| は | ひ | ふ | へ | ほ |

### M-Row
| ma | mi | mu | me | mo |
|----|----|----|----|----|
| ま | み | む | め | も |

### Y-Row
| ya | yu | yo |
|----|----|----|
| や | ゆ | よ |

### R-Row
| ra | ri | ru | re | ro |
|----|----|----|----|----|
| ら | り | る | れ | ろ |

### W-Row + N
| wa | wo | n |
|----|----|----|
| わ | を | ん |

## Katakana (カタカナ) — 46 Characters

Katakana mirrors hiragana but with sharper, more angular shapes. Used for:
- Foreign words: コンピューター (computer), ピザ (pizza)
- Sound effects: ドキドキ (heartbeat), ガタガタ (rattling)
- Emphasis (like italics in English)

### The Vowels
| Character | Romaji | Mnemonic |
|-----------|--------|----------|
| ア | a | An **a**xe chopping |
| イ | i | An **ea**sel standing |
| ウ | u | Looks like a boxing glove — "**oo**f!" |
| エ | e | An **e**levator with floors |
| オ | o | A figure skating — "**o**lympics!" |

### Practice Method

1. **Learn 5 characters per session** — don't rush
2. **Write them** — use your finger on a table, pen on paper, anything
3. **Flash card mode** — ask your agent to quiz you randomly
4. **Read real words** — your agent will show words using only characters you know
5. **Daily review** — 5 minutes of review beats 1 hour once a week

## Agent Behavior

- Start with hiragana vowels, then move row by row
- Only introduce katakana after hiragana is solid (or if user requests)
- Use mnemonics generously — visual memory beats rote memorization
- Quiz in both directions: show character → user says romaji, AND say romaji → user writes character
- Track which characters the user struggles with and review those more often
- Celebrate milestones: "You now know 20 characters — that's almost half of hiragana!"
- Mix in simple words using learned characters: し + た = した (did)
`
	},
	{
		name: 'learn-radicals',
		title: 'Learn Radicals',
		description: 'The building blocks of kanji. ~50 most common radicals with meanings and visual mnemonics.',
		category: 'Education',
		version: '1.0.0',
		content: `---
name: learn-radicals
description: The building blocks of kanji — learn radicals to unlock kanji
author: mager
version: 1.0.0
---

# Learn Radicals

Kanji aren't random squiggles — they're built from smaller pieces called radicals (部首, bushu). Learn ~50 radicals and suddenly kanji become puzzles you can decode instead of pictures you memorize.

## Why Radicals First?

The kanji 休 (rest) = 人 (person) + 木 (tree). A person leaning against a tree... resting. Once you see the pieces, you never forget it.

## The Essential 50 Radicals

### People & Body
| Radical | Meaning | Example Kanji |
|---------|---------|---------------|
| 人 / 亻 | person | 休 (rest), 体 (body) |
| 口 | mouth | 食 (eat), 言 (say) |
| 目 | eye | 見 (see), 睡 (sleep) |
| 手 / 扌 | hand | 持 (hold), 打 (hit) |
| 足 | foot/leg | 走 (run), 路 (road) |
| 心 / 忄 | heart/mind | 思 (think), 悲 (sad) |
| 耳 | ear | 聞 (hear), 聴 (listen) |
| 女 | woman | 好 (like), 姉 (sister) |

### Nature
| Radical | Meaning | Example Kanji |
|---------|---------|---------------|
| 日 | sun/day | 明 (bright), 時 (time) |
| 月 | moon/month | 朝 (morning), 期 (period) |
| 水 / 氵 | water | 海 (sea), 池 (pond) |
| 火 / 灬 | fire | 焼 (burn), 煮 (boil) |
| 木 | tree | 森 (forest), 本 (book) |
| 山 | mountain | 岩 (rock), 島 (island) |
| 土 | earth/soil | 地 (ground), 場 (place) |
| 金 / 釒 | metal/gold | 銀 (silver), 鉄 (iron) |
| 石 | stone | 砂 (sand), 研 (polish) |
| 雨 | rain | 雲 (cloud), 雪 (snow) |
| 花 / 艹 | grass/flower | 花 (flower), 草 (grass) |

### Structure & Concept
| Radical | Meaning | Example Kanji |
|---------|---------|---------------|
| 大 | big | 太 (thick), 天 (heaven) |
| 小 | small | 少 (few) |
| 上 | up | 止 (stop) |
| 下 | down | 不 (not) |
| 力 | power | 動 (move), 助 (help) |
| 刀 / 刂 | sword/knife | 切 (cut), 分 (divide) |
| 門 | gate | 間 (between), 開 (open) |
| 言 / 訁 | speech | 話 (talk), 読 (read) |
| 糸 / 糹 | thread | 紙 (paper), 絵 (picture) |
| 食 / 飠 | food/eat | 飲 (drink), 飯 (rice/meal) |
| 車 | vehicle | 転 (turn), 軽 (light) |
| 道 / 辶 | road/walk | 道 (path), 進 (advance) |

### Enclosures
| Radical | Meaning | Example Kanji |
|---------|---------|---------------|
| 囗 | enclosure | 国 (country), 園 (garden) |
| 宀 | roof | 家 (house), 安 (peace) |
| 广 | cliff/building | 店 (shop), 度 (degree) |

## How to Study

1. **5 radicals per session** — learn the meaning + 2 example kanji each
2. **Make stories** — 明 = sun + moon = "bright" (sun AND moon shining)
3. **Spot them in the wild** — when you see kanji, try to identify the radicals
4. **Build up** — once you know the radical, the kanji that use it become learnable

## Agent Behavior

- Introduce radicals in thematic groups (nature, body, concepts)
- Always show the radical → meaning → example kanji → story/mnemonic
- Quiz by showing a kanji and asking "what radicals do you see?"
- When introducing new kanji in later skills, reference the radicals: "Remember 水 (water)? That's the left side of 海 (sea)"
- Make the stories vivid and weird — weird = memorable
`
	},
	{
		name: 'learn-easy-kanji',
		title: 'Learn Easy Kanji',
		description: 'Your first 50 kanji — numbers, days, basic nouns. Built from radicals you already know.',
		category: 'Education',
		version: '1.0.0',
		content: `---
name: learn-easy-kanji
description: First 50 kanji — numbers, days, and essential nouns
author: mager
version: 1.0.0
---

# Learn Easy Kanji

You know radicals. Now let's build real kanji. These 50 are the most useful — you'll see them on signs, menus, and train stations everywhere in Japan.

## Numbers (数字)

| Kanji | Reading | Meaning | Mnemonic |
|-------|---------|---------|----------|
| 一 | いち (ichi) | one | One horizontal line |
| 二 | に (ni) | two | Two horizontal lines |
| 三 | さん (san) | three | Three horizontal lines |
| 四 | よん (yon) | four | A window with four panes |
| 五 | ご (go) | five | A person doing a dance — "go dance!" |
| 六 | ろく (roku) | six | A person with a top hat |
| 七 | なな (nana) | seven | Looks like an upside-down 7 |
| 八 | はち (hachi) | eight | A mustache — "h-eight" |
| 九 | きゅう (kyuu) | nine | A person curling up |
| 十 | じゅう (juu) | ten | A cross — 10 like a + sign |
| 百 | ひゃく (hyaku) | hundred | One + white = 100 |
| 千 | せん (sen) | thousand | A person with an antenna |
| 万 | まん (man) | ten thousand | "10,000 — man, that's a lot!" |

## Days of the Week

| Kanji | Day | Meaning |
|-------|-----|---------|
| 日 | にちようび | Sunday (sun day) |
| 月 | げつようび | Monday (moon day) |
| 火 | かようび | Tuesday (fire day) |
| 水 | すいようび | Wednesday (water day) |
| 木 | もくようび | Thursday (tree day) |
| 金 | きんようび | Friday (gold day) |
| 土 | どようび | Saturday (earth day) |

## Essential Nouns

| Kanji | Reading | Meaning | Radical Breakdown |
|-------|---------|---------|-------------------|
| 人 | ひと (hito) | person | Radical itself |
| 大 | おお (oo) | big | Person with arms spread wide |
| 小 | ちい (chii) | small | A small thing between two marks |
| 山 | やま (yama) | mountain | Three peaks |
| 川 | かわ (kawa) | river | Three flowing lines |
| 田 | た (ta) | rice field | A field divided into plots |
| 口 | くち (kuchi) | mouth | An open mouth |
| 目 | め (me) | eye | An eye turned sideways |
| 手 | て (te) | hand | A hand with fingers |
| 足 | あし (ashi) | foot | Radical itself |
| 車 | くるま (kuruma) | car | A cart seen from above |
| 学 | がく (gaku) | study | Child under a roof with books |
| 校 | こう (kou) | school | Tree + father + child |
| 本 | ほん (hon) | book | A tree with roots marked |
| 食 | しょく (shoku) | food/eat | A roof over a delicious thing |
| 水 | みず (mizu) | water | Splashing water |
| 花 | はな (hana) | flower | Grass radical + change |
| 国 | くに (kuni) | country | A jewel inside an enclosure |
| 店 | みせ (mise) | shop | A building radical + fortune |

## Signs You'll See Everywhere

| Kanji | Meaning | Where |
|-------|---------|-------|
| 入 | enter | Entrances |
| 出 | exit | Exits |
| 男 | man | Restrooms |
| 女 | woman | Restrooms |
| 北/南/東/西 | N/S/E/W | Stations, signs |
| 駅 | station | Train stations |
| 円 | yen | Prices |

## Study Method

1. **5 kanji per session** — read, write, use in context
2. **Always connect to radicals** — "I see the water radical!"
3. **Read in context** — your agent will show real sentences
4. **Write practice** — stroke order matters (top to bottom, left to right)

## Agent Behavior

- Start with numbers (most immediately useful)
- Then days of the week (you'll see these on schedules)
- Then essential nouns grouped by theme
- Always show: kanji → reading → meaning → radical breakdown → example sentence
- Quiz both recognition (see kanji, say meaning) and recall (hear meaning, write kanji)
- When user sees a kanji in real life, help them decode it using radicals
`
	},
	{
		name: 'learn-basic-japanese',
		title: 'Learn Basic Conversation',
		description: 'Greetings, survival phrases, particles, and basic verb conjugation. Everything you need to get by in Japan.',
		category: 'Education',
		version: '1.0.0',
		content: `---
name: learn-basic-japanese
description: Conversational Japanese basics — greetings, particles, and survival phrases
author: mager
version: 1.0.0
---

# Learn Basic Conversation

You can read characters and recognize kanji. Now let's talk. This skill covers the phrases and grammar you need to actually communicate in Japan.

## Teaching Approach (Genki-Inspired)

Every new concept starts with a short, natural conversation. Grammar comes AFTER you've seen it in context. Don't memorize rules — let the pattern click first.

## Greetings (挨拶 — Aisatsu)

| Japanese | Romaji | Meaning | When |
|----------|--------|---------|------|
| こんにちは | Konnichiwa | Hello | Daytime |
| おはようございます | Ohayou gozaimasu | Good morning | Before ~10am |
| こんばんは | Konbanwa | Good evening | After sunset |
| すみません | Sumimasen | Excuse me / Sorry | Getting attention, apologizing |
| ありがとうございます | Arigatou gozaimasu | Thank you (polite) | Default thank you |
| いただきます | Itadakimasu | I humbly receive | Before eating — ALWAYS |
| ごちそうさまでした | Gochisousama deshita | Thank you for the meal | After eating |

## Particles — The Secret to Japanese Grammar

Japanese grammar lives in its particles. Learn them one at a time:

### は (wa) — Topic Marker
"As for [topic]..."
- 私は学生です (Watashi wa gakusei desu) — "As for me, I'm a student"
- 東京はきれいです (Tokyo wa kirei desu) — "As for Tokyo, it's beautiful"

### を (o) — Object Marker
Marks what the verb acts on:
- ラーメンを食べます (Raamen o tabemasu) — "I eat ramen"
- 水を飲みます (Mizu o nomimasu) — "I drink water"

### に (ni) — Direction / Time
- 駅に行きます (Eki ni ikimasu) — "I go to the station"
- 7時に起きます (Shichi-ji ni okimasu) — "I wake up at 7"

### で (de) — Location of Action
- レストランで食べます (Resutoran de tabemasu) — "I eat at the restaurant"
- 家で勉強します (Ie de benkyou shimasu) — "I study at home"

### の (no) — Possession / Connection
- 私の名前 (Watashi no namae) — "My name"
- 日本の食べ物 (Nihon no tabemono) — "Japanese food"

## Sentence Building

Build like Lego blocks:
1. ＿＿です — "It's __"
2. ＿＿は＿＿です — "As for __, it's __"
3. ＿＿を＿＿ます — "I [verb] __"
4. ＿＿で＿＿を＿＿ます — "At __, I [verb] __"

## Basic Verbs (ます-form / Polite)

| Verb | Meaning | Negative | Past |
|------|---------|----------|------|
| 食べます (tabemasu) | eat | 食べません | 食べました |
| 飲みます (nomimasu) | drink | 飲みません | 飲みました |
| 行きます (ikimasu) | go | 行きません | 行きました |
| 見ます (mimasu) | see | 見ません | 見ました |
| 買います (kaimasu) | buy | 買いません | 買いました |

Pattern: ます → ません (negative), ます → ました (past)

## Survival Phrases

### At a Restaurant
| Japanese | Meaning |
|----------|---------|
| メニューをください | Menu please |
| これをください | This one please (point) |
| おすすめは？ | What do you recommend? |
| お会計お願いします | Check please |
| 美味しい！ | Delicious! |
| ビールをください | Beer please |

### Getting Around
| Japanese | Meaning |
|----------|---------|
| ＿＿はどこですか？ | Where is __? |
| 駅はどこですか？ | Where is the station? |
| トイレはどこですか？ | Where is the bathroom? |
| いくらですか？ | How much? |
| 右 / 左 / まっすぐ | Right / Left / Straight |

### Daily Life
| Japanese | Meaning |
|----------|---------|
| 大丈夫です | I'm fine / It's okay |
| わかりません | I don't understand |
| 英語を話せますか？ | Do you speak English? |
| 日本語が少しだけ | I only speak a little Japanese |

## Practice Scenarios

1. **Ordering food** — Be a waiter at a ramen shop
2. **Asking directions** — Be a helpful stranger at Shinjuku station
3. **Convenience store** — Buying onigiri, asking about items
4. **Hotel check-in** — Name, reservation, room questions

## Cultural Essentials

- **Bow slightly** when greeting
- **Don't tip** — service is pride, not transaction
- **Shoes off** when you see shoes at the entrance
- **Quiet on trains** — phones on silent
- **いただきます before eating** — every time
- **Carry cash** — many places are cash-only
- **No public trash cans** — carry a small bag
- **Slurp your noodles** — it's a compliment

## Agent Behavior

- Be warm and encouraging — like a friend who lives in Tokyo
- Start every practice response with Japanese, then romaji, then English
- Correct mistakes kindly: "Almost! Try: ..."
- Gradually drop English translations as the user improves
- Throw in cultural tips naturally
- Use emoji: 🇯🇵 🍜 ⛩️ 🚅
`
	},
	{
		name: 'learn-intermediate-japanese',
		title: 'Level Up Your Japanese',
		description: 'Casual forms, te-form, compound sentences, adjectives. Go beyond survival phrases.',
		category: 'Education',
		version: '1.0.0',
		content: `---
name: learn-intermediate-japanese
description: Level up — casual forms, te-form, adjectives, and real conversations
author: mager
version: 1.0.0
---

# Level Up Your Japanese

You've got the basics. Now let's sound more natural. This skill covers casual speech, the powerful て-form, adjective conjugation, and expressing your thoughts and desires.

## Casual vs Polite

Polite (ます-form) is for strangers, work, shops. Casual is for friends, family, and sounding natural.

| Polite | Casual | Meaning |
|--------|--------|---------|
| 食べます | 食べる | eat |
| 飲みます | 飲む | drink |
| 行きます | 行く | go |
| 見ます | 見る | see |
| します | する | do |
| 来ます (kimasu) | 来る (kuru) | come |
| です | だ | is/am |

### When to Go Casual
- Talking to friends your age or younger
- In izakayas after a few drinks
- Texting / social media
- When someone talks casually to you first

### When to Stay Polite
- Meeting someone for the first time
- Anyone older / in authority
- Customer service situations
- When in doubt — polite is never wrong

## て-Form (The Swiss Army Knife)

The て-form is the most useful conjugation in Japanese. It connects actions, makes requests, and describes ongoing states.

### How to Make It
| Verb ending | て-form | Example |
|-------------|---------|---------|
| る-verbs | drop る, add て | 食べる → 食べて |
| う/つ/る | → って | 買う → 買って |
| む/ぬ/ぶ | → んで | 飲む → 飲んで |
| く | → いて | 書く → 書いて |
| ぐ | → いで | 泳ぐ → 泳いで |
| す | → して | 話す → 話して |

### Uses of て-Form

**1. Connecting actions (and then...)**
朝起きて、コーヒーを飲んで、仕事に行きます。
(I wake up, drink coffee, and go to work.)

**2. Requests (〜てください)**
ゆっくり話してください。
(Please speak slowly.)

**3. Ongoing state (〜ている)**
今、食べている。(I'm eating right now.)
東京に住んでいる。(I live in Tokyo.)

**4. Permission (〜てもいい)**
写真を撮ってもいいですか？
(Is it okay to take a photo?)

**5. Prohibition (〜てはいけない)**
ここで食べてはいけません。
(You must not eat here.)

## Adjectives

### い-Adjectives (Japanese origin)
| Base | Meaning | Negative | Past |
|------|---------|----------|------|
| 高い (takai) | expensive/tall | 高くない | 高かった |
| 安い (yasui) | cheap | 安くない | 安かった |
| 美味しい (oishii) | delicious | 美味しくない | 美味しかった |
| 暑い (atsui) | hot (weather) | 暑くない | 暑かった |
| 寒い (samui) | cold | 寒くない | 寒かった |

### な-Adjectives (often Chinese origin)
| Base | Meaning | Negative | Past |
|------|---------|----------|------|
| きれい (kirei) | pretty/clean | きれいじゃない | きれいだった |
| 静か (shizuka) | quiet | 静かじゃない | 静かだった |
| 好き (suki) | like | 好きじゃない | 好きだった |
| 有名 (yuumei) | famous | 有名じゃない | 有名だった |

## Expressing Desires & Opinions

### I want to ～ (〜たい)
食べたい — I want to eat
日本に行きたい — I want to go to Japan

### I think ～ (〜と思う)
美味しいと思う — I think it's delicious
日本語は面白いと思います — I think Japanese is interesting

### I like ～ / I don't like ～
寿司が好きです — I like sushi
納豆が好きじゃないです — I don't like natto

## Practice Scenarios

1. **Izakaya conversation** — Casual talk with new Japanese friends. What do you do? Where are you from?
2. **Shopping in Harajuku** — Describing what you want, asking about sizes, expressing opinions
3. **Planning a day trip** — Suggesting activities, making decisions together
4. **Talking about hobbies** — What you like, what you want to try
5. **Texting a friend** — Casual, short messages with emoji

## Agent Behavior

- Mix casual and polite based on the practice scenario
- Introduce new grammar through dialogue first, explain after
- Push the user gently — "try saying that in casual form"
- Celebrate when they use new grammar correctly
- If they mix up casual/polite, explain the social context
- Use real cultural scenarios — not textbook drills
`
	}
];

export async function POST() {
	const [magerUser] = await db.select().from(users).where(eq(users.username, 'mager'));
	if (!magerUser) return json({ error: 'mager user not found — run /api/seed first' }, { status: 404 });

	const skillIds: string[] = [];

	for (const s of SKILLS_DATA) {
		const contentHash = hash(s.content);

		// Check if skill exists
		const [existing] = await db.select().from(skills).where(
			and(eq(skills.authorId, magerUser.id), eq(skills.name, s.name))
		);

		if (existing) {
			await db.update(skills).set({
				title: s.title,
				description: s.description,
				currentVersion: s.version,
				updatedAt: new Date()
			}).where(eq(skills.id, existing.id));
			skillIds.push(existing.id);
		} else {
			const [skill] = await db.insert(skills).values({
				authorId: magerUser.id,
				name: s.name,
				title: s.title,
				description: s.description,
				category: s.category,
				currentVersion: s.version,
				isPublished: true,
				installs: 0
			}).returning();

			await db.insert(skillVersions).values({
				skillId: skill.id,
				version: s.version,
				contentHash,
				files: [{ name: 'SKILL.md', content: s.content }]
			});

			skillIds.push(skill.id);
		}
	}

	// Create or update the plugin
	const [existingPlugin] = await db.select().from(plugins).where(
		and(eq(plugins.authorId, magerUser.id), eq(plugins.name, 'beginner-japanese'))
	);

	let pluginId: string;

	if (existingPlugin) {
		await db.update(plugins).set({
			title: 'Beginner Japanese',
			description: "A complete beginner's path to conversational Japanese. Five skills that take you from zero to ordering ramen in Tokyo.",
			updatedAt: new Date()
		}).where(eq(plugins.id, existingPlugin.id));
		pluginId = existingPlugin.id;

		// Clear existing plugin_skills
		await db.delete(pluginSkills).where(eq(pluginSkills.pluginId, existingPlugin.id));
	} else {
		const [plugin] = await db.insert(plugins).values({
			authorId: magerUser.id,
			name: 'beginner-japanese',
			title: 'Beginner Japanese',
			description: "A complete beginner's path to conversational Japanese. Five skills that take you from zero to ordering ramen in Tokyo.",
			category: 'Education',
			isPublished: true
		}).returning();
		pluginId = plugin.id;
	}

	// Link skills to plugin
	for (let i = 0; i < skillIds.length; i++) {
		await db.insert(pluginSkills).values({
			pluginId,
			skillId: skillIds[i],
			position: i
		});
	}

	return json({
		message: 'Seeded Beginner Japanese plugin with 5 skills',
		pluginId,
		skillIds
	});
}
