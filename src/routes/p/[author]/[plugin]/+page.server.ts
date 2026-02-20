import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users, skills, plugins, pluginSkills } from '$lib/server/schema';
import { eq, and, asc } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, parent }) => {
	const { user: sessionUser } = await parent();

	const [author] = await db.select().from(users).where(eq(users.username, params.author));
	if (!author) throw error(404, 'Author not found');

	const [plugin] = await db
		.select()
		.from(plugins)
		.where(and(eq(plugins.authorId, author.id), eq(plugins.name, params.plugin)));
	if (!plugin) throw error(404, 'Plugin not found');

	// Get skills in order
	const pluginSkillRows = await db
		.select({
			position: pluginSkills.position,
			skill: {
				id: skills.id,
				name: skills.name,
				title: skills.title,
				description: skills.description,
				category: skills.category,
				installs: skills.installs
			}
		})
		.from(pluginSkills)
		.innerJoin(skills, eq(pluginSkills.skillId, skills.id))
		.where(eq(pluginSkills.pluginId, plugin.id))
		.orderBy(asc(pluginSkills.position));

	return {
		author: {
			username: author.username,
			displayName: author.displayName,
			avatarUrl: author.avatarUrl,
			verified: author.verified,
			topics: (author.topics ?? []) as string[]
		},
		plugin: {
			id: plugin.id,
			name: plugin.name,
			title: plugin.title,
			description: plugin.description,
			category: plugin.category,
			createdAt: plugin.createdAt.toISOString(),
			updatedAt: plugin.updatedAt.toISOString()
		},
		skills: pluginSkillRows.map((r) => ({
			...r.skill,
			position: r.position
		})),
		isOwner: sessionUser?.id === author.id
	};
};
