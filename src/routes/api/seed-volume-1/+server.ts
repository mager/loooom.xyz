import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, skills, skillVersions } from '$lib/server/schema';
import { eq, and, desc } from 'drizzle-orm';
import { createHash } from 'crypto';

function hash(content: string) {
	return 'sha256:' + createHash('sha256').update(content).digest('hex').slice(0, 12);
}

// ─── Loooom Volume 1 — flagship skills ───────────────────────────────────────
// Canonical SKILL.md content lives in skills/<name>/SKILL.md — the SAME files
// the eval harness scores (npm run eval), so what we publish is exactly what we
// graded. Catalog metadata (the richer title/description shown in the UI) lives
// here. See VOLUME_1.md and RUBRIC.md.

const CONTENT = import.meta.glob('/skills/*/SKILL.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

function contentFor(name: string): string {
	const c = CONTENT[`/skills/${name}/SKILL.md`];
	if (!c) throw new Error(`missing canonical file: skills/${name}/SKILL.md`);
	return c;
}

const CATALOG = [
	{
		name: 'hook',
		title: 'hook',
		description:
			"Write a song hook people can't stop humming. The craft behind stickiness — repetition, melodic shape, and one clear idea — done on purpose, not by luck.",
		category: 'Music',
		version: '1.0.0'
	},
	{
		name: 'voice',
		title: 'voice',
		description:
			"Write in your own voice, not ChatGPT's. Kill the corporate-AI tells, find your actual rhythm, and sound like a person on the page.",
		category: 'Writing',
		version: '1.0.0'
	},
	{
		name: 'story',
		title: 'story',
		description:
			'Tell a story that actually lands. Stakes, a single core, the turn, and an ending on an image — the structure under every story people remember.',
		category: 'Communication',
		version: '1.0.0'
	},
	{
		name: 'frame',
		title: 'frame',
		description:
			'See like a photographer. Subject, light, and a clean frame — the eye behind a good photo, not the camera. Works with the phone in your pocket.',
		category: 'Creativity',
		version: '1.0.0'
	},
	{
		name: 'improvise',
		title: 'improvise',
		description:
			'Cook by feel, not by recipe. The five tastes, cooking in ratios, and the rescues — so you can open the fridge and just make something good.',
		category: 'Life',
		version: '1.0.0'
	},
	{
		name: 'train',
		title: 'train',
		description:
			'Get stronger without a coach. Progressive overload, a few compound lifts, and the consistency that actually moves the needle.',
		category: 'Life',
		version: '1.0.0'
	},
	{
		name: 'rest',
		title: 'rest',
		description:
			'Fix your sleep and get your energy back. The handful of habits — wake time, light, caffeine timing — that quietly decide how you feel all day.',
		category: 'Life',
		version: '1.0.0'
	},
	{
		name: 'stack',
		title: 'stack',
		description:
			'Money basics in plain English. The gap, the order of operations, and letting time compound — no stock-picking, no jargon, no hype.',
		category: 'Life',
		version: '1.0.0'
	},
	{
		name: 'leverage',
		title: 'leverage',
		description:
			'Negotiate without flinching. Know your walk-away, anchor, trade instead of concede, and use the silence — the moves that change hands at the table.',
		category: 'Communication',
		version: '1.0.0'
	},
	{
		name: 'stage',
		title: 'stage',
		description:
			'Command a room when you speak. One idea, the pause, a voice that varies, and never reading your slides.',
		category: 'Communication',
		version: '1.0.0'
	},
	{
		name: 'reply',
		title: 'reply',
		description:
			'Write a text or DM that lands right. Match energy, lead with the point, and know when a hard thing should be a call instead.',
		category: 'Communication',
		version: '1.0.0'
	},
	{
		name: 'level',
		title: 'level',
		description:
			'Have the hard conversation. Name the one thing, lead with care, state impact not accusation, and land on a request — so it lands, not just gets said.',
		category: 'Communication',
		version: '1.0.0'
	},
	{
		name: 'decide',
		title: 'decide',
		description:
			'Make a hard call faster. Reversible vs not, deciding at 70%, the regret test, and committing instead of relitigating.',
		category: 'Mind',
		version: '1.0.0'
	},
	{
		name: 'focus',
		title: 'focus',
		description:
			'Do deep work in a noisy world. One task, distraction out of reach, real blocks of time, and starting ugly — attention defended against an environment built to break it.',
		category: 'Mind',
		version: '1.0.0'
	},
	{
		name: 'absorb',
		title: 'absorb',
		description:
			'Learn anything faster. Active recall over rereading, spacing over cramming, and the productive struggle that actually makes things stick.',
		category: 'Mind',
		version: '1.0.0'
	}
];

export async function POST() {
	const [magerUser] = await db.select().from(users).where(eq(users.username, 'mager'));
	if (!magerUser) return json({ error: 'mager user not found — run /api/seed first' }, { status: 404 });

	const results: { name: string; id: string; status: string }[] = [];

	for (const s of CATALOG) {
		const content = contentFor(s.name);
		const contentHash = hash(content);

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

			// Publish content edits too — otherwise the stored SKILL.md is frozen
			// at first insert and edits never reach the page or the copy button.
			const [latest] = await db
				.select()
				.from(skillVersions)
				.where(eq(skillVersions.skillId, existing.id))
				.orderBy(desc(skillVersions.createdAt))
				.limit(1);

			let status = 'updated';
			if (!latest) {
				await db.insert(skillVersions).values({
					skillId: existing.id,
					version: s.version,
					contentHash,
					files: [{ name: 'SKILL.md', content }]
				});
				status = 'content-added';
			} else if (latest.contentHash !== contentHash) {
				await db
					.update(skillVersions)
					.set({ version: s.version, contentHash, files: [{ name: 'SKILL.md', content }] })
					.where(eq(skillVersions.id, latest.id));
				status = 'content-updated';
			}
			results.push({ name: s.name, id: existing.id, status });
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
				files: [{ name: 'SKILL.md', content }]
			});

			results.push({ name: s.name, id: skill.id, status: 'created' });
		}
	}

	return json({ message: `Seeded ${results.length} Volume 1 skills for mager`, results });
}
