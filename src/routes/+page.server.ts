import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { waitlist, skills, skillVersions, users, plugins, pluginSkills } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import { eq, and, count } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	// Load featured skill: Franklin's "How to Learn Anything" from loooom account
	const [loooomUser] = await db.select().from(users).where(eq(users.username, 'loooom'));
	if (!loooomUser) return { featuredSkill: null };

	const [skill] = await db.select().from(skills).where(
		and(eq(skills.authorId, loooomUser.id), eq(skills.name, 'how-to-learn-anything'))
	);
	if (!skill) return { featuredSkill: null };

	const [version] = await db.select().from(skillVersions).where(eq(skillVersions.skillId, skill.id));

	// Load featured plugins
	const allPlugins = await db
		.select({
			id: plugins.id,
			name: plugins.name,
			title: plugins.title,
			description: plugins.description,
			category: plugins.category,
			authorId: plugins.authorId
		})
		.from(plugins)
		.where(eq(plugins.isPublished, true));

	const featuredPlugins = await Promise.all(
		allPlugins.map(async (p) => {
			const [author] = await db
				.select({ username: users.username, displayName: users.displayName })
				.from(users)
				.where(eq(users.id, p.authorId));
			const [skillCount] = await db
				.select({ count: count() })
				.from(pluginSkills)
				.where(eq(pluginSkills.pluginId, p.id));
			return {
				name: p.name,
				title: p.title,
				description: p.description,
				category: p.category,
				skillCount: skillCount?.count ?? 0,
				author: author ? { username: author.username, displayName: author.displayName } : null
			};
		})
	);

	return {
		featuredPlugins,
		featuredSkill: {
			title: skill.title,
			description: skill.description,
			category: skill.category,
			installs: skill.installs,
			author: { username: loooomUser.username, displayName: loooomUser.displayName, verified: loooomUser.verified },
			name: skill.name,
			version: skill.currentVersion ?? '1.0.0',
			contentHash: version?.contentHash ?? '',
			files: (version?.files ?? []) as { name: string; content: string }[]
		}
	};
};

export const actions: Actions = {
	waitlist: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString()?.trim()?.toLowerCase();

		if (!email || !email.includes('@')) {
			return fail(400, { error: 'Valid email required', email });
		}

		try {
			await db.insert(waitlist).values({ email }).onConflictDoNothing();
			return { success: true };
		} catch {
			return fail(500, { error: 'Something went wrong. Try again.', email });
		}
	}
};
