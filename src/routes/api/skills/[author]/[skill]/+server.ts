import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { users, skills, skillVersions } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params }) => {
	const [author] = await db.select().from(users).where(eq(users.username, params.author));
	if (!author) throw error(404, 'Author not found');

	const [skill] = await db
		.select()
		.from(skills)
		.where(and(eq(skills.authorId, author.id), eq(skills.name, params.skill)));
	if (!skill) throw error(404, 'Skill not found');

	const versions = await db
		.select()
		.from(skillVersions)
		.where(eq(skillVersions.skillId, skill.id));

	const latestVersion = versions.find((v) => v.version === skill.currentVersion) ?? versions[0];

	return json({
		skill: {
			name: skill.name,
			title: skill.title,
			description: skill.description,
			category: skill.category,
			version: skill.currentVersion,
			contentHash: latestVersion?.contentHash ?? null,
			author: {
				username: author.username,
				displayName: author.displayName,
				verified: author.verified
			},
			files: (latestVersion?.files ?? []) as { name: string; content: string }[]
		}
	});
};
