import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users, skills } from '$lib/server/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getSkillQuality } from '$lib/skill-scores';

// Loooom is curated, not crowdsourced — the collection is authored. Browse shows
// only the curator's published skills, each with its rubric score. No third-party
// catalog, no skills.sh, no "automation" grab-bag.
const CURATOR = 'mager';

export const load: PageServerLoad = async ({ url }) => {
	const category = url.searchParams.get('category');

	const [curator] = await db
		.select({ id: users.id })
		.from(users)
		.where(eq(users.username, CURATOR))
		.limit(1);

	const rows = curator
		? await db
				.select({
					name: skills.name,
					title: skills.title,
					description: skills.description,
					category: skills.category,
					installs: skills.installs
				})
				.from(skills)
				.where(and(eq(skills.authorId, curator.id), eq(skills.isPublished, true)))
				.orderBy(desc(skills.installs))
		: [];

	// Only the rubric-scored collection (Volume 1, growing). A skill earns its
	// place on the shelf by being graded; unscored pre-pivot skills don't show.
	const items = rows
		.map((s) => {
			const q = getSkillQuality(CURATOR, s.name);
			return {
				name: s.name,
				title: s.title,
				description: s.description,
				category: s.category,
				score: q?.score ?? null,
				verdict: q?.verdict ?? null,
				link: `/s/${CURATOR}/${s.name}`
			};
		})
		.filter((i) => i.score !== null);

	const categories = [...new Set(items.map((i) => i.category).filter(Boolean))].sort() as string[];
	const filtered = category ? items.filter((i) => i.category === category) : items;

	return {
		skills: filtered,
		categories,
		activeCategory: category ?? null,
		total: items.length
	};
};
