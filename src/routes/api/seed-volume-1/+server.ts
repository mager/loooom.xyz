import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, skills, skillVersions } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';
import { createHash } from 'crypto';

function hash(content: string) {
	return 'sha256:' + createHash('sha256').update(content).digest('hex').slice(0, 12);
}

// ─── Loooom Volume 1 — flagship skills ───────────────────────────────────────
// Non-technical skills, written to set the quality bar. See VOLUME_1.md.

const SKILLS = [
	{
		name: 'hook',
		title: 'hook',
		description: "Write a song hook people can't stop humming. The craft behind stickiness — repetition, melodic shape, and one clear idea — done on purpose, not by luck.",
		category: 'Music',
		version: '1.0.0',
		content: `---
name: hook
description: Write a hook people can't stop humming
author: mager
version: 1.0.0
tags: [music, songwriting, hooks]
category: Music
---

# hook

A hook is the part people sing in the shower without meaning to. Not the cleverest line, not the deepest one — the *stickiest*. Stickiness is craft, not luck, and this skill is about engineering it on purpose.

## What a hook actually is

Three things happen at once in every hook that works:

- **Repetition** — you hear it enough to keep it
- **A melodic shape** — it moves somewhere your ear wants to follow
- **One clear idea** — a single feeling, image, or phrase, no clutter

Miss one and the hook leaks. Land all three and it lodges in someone's head for a week.

## The Method

### 1. Find the one line

Most songs are really about one sentence. Say yours out loud. If you can't fit the feeling of the whole song into a single short phrase, you don't have a hook yet — you have a topic.

- Make it short. Three to seven words is the sweet spot.
- Make it concrete. "I miss the way you'd leave the light on" beats "I miss you so much."
- Make it singable. Read it out loud five times fast. If your mouth trips, the listener's will too.

### 2. Put the title where the ear expects it

The strongest hook is usually the title, and the strongest place for the title is the **first or last line of the chorus**. The ear is primed to remember the edges. Burying your best line in the middle wastes it.

### 3. Build the melodic shape

A hook melody is a little journey. The two reliable shapes:

- **The arc** — climb to a high note, then come home. The high note is your emotional peak; put your most important word there.
- **The drop** — start high, fall. Feels like a sigh, a release, a confession.

Put open vowels (ah, oh, ay) on the high or held notes — they ring. Tight vowels (ih, uh) choke a big note.

### 4. Repeat, but move one thing

Pure repetition gets boring; pure variation gets forgettable. The trick is **repeat the shape, change one element.**

- Same melody, one new word
- Same words, the melody lifts a step higher the second time
- Same line, the chord underneath changes so it *feels* different

Think of how the second "hey Jude" isn't new — it's the same hook earning more weight.

### 5. Earn it with contrast

A hook only hits as hard as the part before it is restrained. If the verse is busy and high-energy, the listener has nowhere to go up. Pull the verse *down* — fewer notes, lower, quieter, more space — so the hook feels like a window opening.

## Diagnosing a dead hook

- **It's forgettable** → no melodic shape. Hum it with no words. If the tune alone isn't memorable, words won't save it.
- **It's busy** → too many ideas. Cut to one.
- **It's flat** → no contrast. The section before it is too loud or too full.
- **It's awkward to sing** → prosody problem. The stressed syllables of the words aren't landing on the stressed beats of the melody. Fix the stresses, not the meaning.

## A worked example

Topic: missing someone after they moved out.

- Weak: "I really miss you now that you are gone" — abstract, sing-songy, no image.
- Better line: "you left the light on" — concrete, an image, seven syllables, ends on an open "on."
- Hook move: title goes last in the chorus. Melody arcs up on "light" (the peak word, open vowel), drops home on "on." Second time through, hold "on" a beat longer and change the chord under it from major to minor — same words, new ache.

That's a hook. One image, one shape, one move repeated with a twist.

## Agent Behavior

When this skill is active:

- Ask what the song is about in one sentence before anything else. Hold them to one.
- Push for the concrete over the abstract — ask for the specific image, object, or moment.
- Offer 3 candidate hook lines at a time, each a different angle, and say *why* each could stick.
- Talk about melodic shape in plain language (arc, drop, high note, open vowel) — never require notation.
- Check prosody: read their line against the rhythm and flag where a stressed word lands on a weak beat.
- Be encouraging and fast. Songwriting dies under perfectionism — keep them generating, not judging.
`
	},
	{
		name: 'voice',
		title: 'voice',
		description: "Write in your own voice, not ChatGPT's. Kill the corporate-AI tells, find your actual rhythm, and sound like a person on the page.",
		category: 'Writing',
		version: '1.0.0',
		content: `---
name: voice
description: Write in your own voice, not ChatGPT's
author: mager
version: 1.0.0
tags: [writing, voice, style]
category: Writing
---

# voice

Most writing today sounds like it came out of the same beige machine. Smooth, hedged, agreeable, and completely forgettable. Voice is the opposite of that: it's the sound of *you* on the page, the thing a friend would recognize without seeing your name. This skill is about finding it and protecting it.

## The tells you're not using your voice

If your draft has these, a machine is writing it, not you:

- **Hedge words everywhere** — "I think maybe it could perhaps be the case that..."
- **The "not just X, it's Y" reflex** — endless "it's not about the destination, it's about the journey" constructions
- **Throat-clearing openers** — "In today's fast-paced world," "When it comes to..."
- **Abstract nouns doing the work** — "leveraging synergies to drive engagement"
- **Even, soothing rhythm** — every sentence the same medium length, no one ever interrupted

Voice is what's left when you cut all of that and don't replace it with more of it.

## The Method

### 1. Write like you'd say it out loud

The fastest path to voice: imagine telling one specific person this, across a table, and transcribe that. People are funnier, blunter, and more specific in speech than they let themselves be in writing.

Read every draft out loud. Where your mouth stumbles or you'd never actually say it that way — rewrite that line until you would.

### 2. Be specific. Specificity *is* personality.

Generic writing is voiceless because anyone could have written it. The detail only you would notice is the whole game.

- Not "I had a tough childhood" → "we reused tea bags until they ran clear"
- Not "the city was busy" → "three guys were selling the same bootleg DVD on the same corner"

Your specifics are your fingerprint. Reach for the concrete noun, the real number, the actual brand name.

### 3. Vary your rhythm on purpose

Voice lives in the music of sentence length. Robots write everything at one tempo. People speed up and slow down.

- Follow a long, winding sentence with a short one. Like this.
- Use a fragment when you want to land a punch.
- Let one sentence run long when you're building, breathless, toward something — and then stop.

If you read a paragraph aloud and it's all one note, break it up.

### 4. Keep your actual vocabulary

You have words you really use and words you'd never say. Cut the ones you'd never say. If "utilize," "myriad," and "delve" aren't in your mouth, get them off your page. Use "use," "a lot," and "dig into."

### 5. Have a take

Voiceless writing is afraid to be wrong, so it says nothing. Voice has a point of view. Make the claim. Pick the side. Say the thing you actually believe, then defend it. A reader can feel a spine on the page, and they lean in for it.

## The read-aloud test

This one test catches almost everything:

1. Read the draft out loud, all the way through.
2. Mark every spot where you wince, slow down, or think "I'd never say that."
3. Rewrite only those spots, out loud, until they sound like you talking.

Do that twice and the machine voice is gone.

## What voice is NOT

- Not breaking grammar for the sake of it
- Not cramming in slang you don't use
- Not being loud — quiet writers have unmistakable voices too
- Not the same in every context — your voice texting a friend and your voice in a eulogy are both yours, tuned differently

## Agent Behavior

When this skill is active:

- First, get a sample of how the person actually talks — ask them to explain the topic in a voice message's worth of plain speech, or paste something they wrote casually.
- Edit *toward* their natural speech, never toward "professional polish." Polish is the disease here.
- Hunt and flag the AI/corporate tells explicitly: hedges, "not just X but Y," throat-clearing openers, abstract nouns, monotone rhythm.
- Push relentlessly for the specific detail. When they write something generic, ask "what's the real version of that?"
- Read drafts back and point to exactly where the rhythm goes flat.
- Never sand off a rough edge that's actually personality. Protect the weird, the blunt, the particular.
- Default to fewer words. Most voice problems are solved by deletion.
`
	},
	{
		name: 'story',
		title: 'story',
		description: 'Tell a story that actually lands. Stakes, a single core, the turn, and an ending on an image — the structure under every story people remember.',
		category: 'Communication',
		version: '1.0.0',
		content: `---
name: story
description: Tell a story that actually lands
author: mager
version: 1.0.0
tags: [storytelling, communication, writing]
category: Communication
---

# story

Everyone has the same stories — the trip that went wrong, the lucky break, the lesson learned the hard way. The difference between a story that lands and one that dies at the dinner table isn't the events. It's the telling. This skill is the structure underneath every story people actually remember.

## Why most stories die

- **No stakes** — nothing is at risk, so there's no reason to lean in
- **Too much setup** — three minutes of context before anything happens
- **Everything weighted equally** — the boring parts get the same airtime as the moment
- **No turn** — it's just a list of things that happened, with no surprise
- **It explains the point** — the teller spells out the lesson instead of letting it land

## The Method

### 1. Find the one-sentence core

Before you tell it, finish this: "This is a story about the time I ___." If you need three sentences, you've got two stories or none. The core is the spine. Everything that doesn't serve it gets cut.

### 2. Start in the middle

Begin as close to the action as you can. Not "so it was a Tuesday and I woke up and had breakfast" — start with "I was forty feet up the cliff when the rope went slack." You can backfill the context in one quick line once you've got their attention. Hook first, explain second.

### 3. Set the stakes early

The listener needs to know what could be won or lost, fast. Stakes don't have to be life-or-death — they can be a job, a crush, a reputation, a five-dollar bet. But name them, or the listener has no reason to care what happens next.

### 4. Build the turn

Every story people remember has a moment where it *changes* — the expectation flips, the plan breaks, the truth comes out. That's the turn, and it's the whole reason to tell the story. Structure everything to make that moment hit:

- Slow down right before it. Add detail, stretch the second.
- Then break the pattern fast. The contrast is the impact.
- Don't telegraph it. If they see it coming, it's not a turn.

### 5. Show, don't summarize

"He was furious" is a summary. "He set his coffee down very, very gently" shows it — and the listener does the work of feeling it, which is what makes it stick. Pick the one telling detail instead of the adjective. Trust the listener to get there.

### 6. End on an image, not an explanation

The kill move. Resist the urge to say "and that's when I learned that..." Land on the last concrete image or line of dialogue and *stop*. The silence after is where the meaning happens. If you explain it, you steal that from them.

## The shape, in one breath

Hook → stakes → rising detail → **the turn** → one last image → stop.

Everything else is decoration. Cut anything that doesn't move you along that line.

## A worked example

Raw version: "We went to the airport and our flight was delayed and then it got cancelled and we had to find a hotel and it was really stressful but we figured it out."

That's a list. No core, no stakes, no turn, no image. Now:

- **Core:** the time a cancelled flight got me the best night of the trip.
- **Start in the middle:** "The board flipped to CANCELLED and the whole gate groaned at once."
- **Stakes:** we had one night left and a non-refundable dinner across the city.
- **Turn:** the airline hotel shuttle driver, hearing the dinner story, took a detour and dropped us right at the restaurant door, an hour we thought we'd lost.
- **End on an image:** "He waved off the tip, said 'go, you're already late,' and pulled away before we could argue."

Same events. One lands.

## Agent Behavior

When this skill is active:

- Make them say the one-sentence core first. Don't let them tell the whole thing until they can name what it's about.
- Find the turn and build everything around it — ask "what's the moment it changed?" and protect that moment.
- Cut setup aggressively. Push to start as close to the action as possible.
- Trade summaries for single concrete details — when they tell you a feeling, ask for the thing that showed it.
- Guard the ending. Talk them out of explaining the moral; help them find the last image and stop.
- Mind the pacing: stretch the seconds before the turn, speed through the connective tissue.
- Keep it tight. A story that's twice as long is half as good.
`
	}
];

export async function POST() {
	const [magerUser] = await db.select().from(users).where(eq(users.username, 'mager'));
	if (!magerUser) return json({ error: 'mager user not found — run /api/seed first' }, { status: 404 });

	const results: { name: string; id: string; status: string }[] = [];

	for (const s of SKILLS) {
		const contentHash = hash(s.content);

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
			results.push({ name: s.name, id: existing.id, status: 'updated' });
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

			results.push({ name: s.name, id: skill.id, status: 'created' });
		}
	}

	return json({ message: `Seeded ${results.length} Volume 1 skills for mager`, results });
}
