import type { PageServerLoad } from './$types';
import { PLUGINS, CATEGORIES } from '$lib/plugins';
import { db } from '$lib/server/db';
import { skills, users } from '$lib/server/schema';
import { eq, desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	type FeaturedSkill = {
		name: string;
		title: string;
		description: string | null;
		category: string | null;
		installs: number;
		version: string;
		authorUsername: string;
		authorDisplayName: string;
		authorAvatarUrl: string | null;
		link: string;
	};

	let featuredSkills: FeaturedSkill[] = [];

	try {
		const dbSkills = await db
			.select({
				name: skills.name,
				title: skills.title,
				description: skills.description,
				category: skills.category,
				installs: skills.installs,
				version: skills.currentVersion,
				authorId: skills.authorId
			})
			.from(skills)
			.where(eq(skills.isPublished, true))
			.orderBy(desc(skills.installs))
			.limit(6);

		for (const s of dbSkills) {
			const [author] = await db
				.select({ username: users.username, displayName: users.displayName, avatarUrl: users.avatarUrl })
				.from(users)
				.where(eq(users.id, s.authorId))
				.limit(1);

			featuredSkills.push({
				name: s.name,
				title: s.title,
				description: s.description,
				category: s.category,
				installs: s.installs,
				version: s.version ?? '1.0.0',
				authorUsername: author?.username ?? 'unknown',
				authorDisplayName: author?.displayName ?? 'Unknown',
				authorAvatarUrl: author?.avatarUrl ?? null,
				link: `/s/${author?.username ?? 'unknown'}/${s.name}`
			});
		}
	} catch {
		// Fallback silently
	}

	// Supplement with catalog plugins if < 6 DB skills
	if (featuredSkills.length < 6) {
		const catalogFeatured = PLUGINS.filter((p) => p.source === 'loooom')
			.slice(0, 6 - featuredSkills.length)
			.map((p) => ({
				name: p.name,
				title: p.title,
				description: p.description ?? null,
				category: p.category ?? null,
				installs: p.installs ?? 0,
				version: p.version,
				authorUsername: p.author,
				authorDisplayName: p.authorDisplay ?? p.author,
				authorAvatarUrl: null,
				link: `/p/${p.author}/${p.name}`
			}));
		featuredSkills = [...featuredSkills, ...catalogFeatured];
	}

	return {
		plugins: PLUGINS,
		categories: CATEGORIES,
		featuredSkills,
		totalCount: PLUGINS.length
	};
};
