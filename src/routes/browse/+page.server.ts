import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users, skills } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { PLUGINS, CATEGORIES as CATALOG_CATEGORIES } from '$lib/plugins';

export const load: PageServerLoad = async ({ url }) => {
	const category = url.searchParams.get('category') || null;

	const allSkills = await db
		.select({
			id: skills.id,
			name: skills.name,
			title: skills.title,
			description: skills.description,
			category: skills.category,
			installs: skills.installs,
			authorId: skills.authorId,
			isPublished: skills.isPublished
		})
		.from(skills)
		.where(eq(skills.isPublished, true));

	// Load author info for each skill
	const skillsWithAuthors = await Promise.all(
		allSkills
			.filter((s) => !category || s.category === category)
			.map(async (skill) => {
				const [author] = await db
					.select({
						username: users.username,
						displayName: users.displayName,
						avatarUrl: users.avatarUrl,
						verified: users.verified
					})
					.from(users)
					.where(eq(users.id, skill.authorId));
				return {
					name: skill.name,
					title: skill.title,
					description: skill.description,
					category: skill.category,
					installs: skill.installs,
					author: author
						? {
								username: author.username,
								displayName: author.displayName,
								avatarUrl: author.avatarUrl,
								verified: author.verified
							}
						: null
				};
			})
	);

	const categories = [
		'Writing',
		'Music',
		'Cooking',
		'Engineering',
		'Art',
		'Research',
		'Design',
		'Education',
		'Health',
		'Business'
	];

	// Static catalog plugins (GitHub-native)
	const catalogPlugins = category
		? PLUGINS.filter((p) => p.category === category)
		: PLUGINS;

	return {
		skills: skillsWithAuthors,
		plugins: catalogPlugins,
		categories,
		catalogCategories: CATALOG_CATEGORIES,
		activeCategory: category
	};
};
