import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users, skills, skillVersions } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import matter from 'gray-matter';

export const load: PageServerLoad = async ({ params, parent }) => {
	const { user: sessionUser } = await parent();

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
	const files = (latestVersion?.files ?? []) as { name: string; content: string }[];

	// Extract tags from SKILL.md frontmatter
	let tags: string[] = [];
	const skillMdFile = files.find(f => f.name === 'SKILL.md');
	if (skillMdFile) {
		try {
			const parsed = matter(skillMdFile.content);
			tags = parsed.data.tags ?? [];
		} catch {
			// ignore parse errors
		}
	}

	return {
		author: {
			username: author.username,
			displayName: author.displayName,
			avatarUrl: author.avatarUrl,
			verified: author.verified,
			topics: (author.topics ?? []) as string[]
		},
		skill: {
			id: skill.id,
			name: skill.name,
			title: skill.title,
			description: skill.description,
			category: skill.category,
			tags,
			installs: skill.installs,
			version: skill.currentVersion ?? '0.0.0',
			contentHash: latestVersion?.contentHash ?? '',
			files,
			updatedAt: skill.updatedAt.toISOString(),
			createdAt: skill.createdAt.toISOString()
		},
		isOwner: sessionUser?.id === author.id
	};
};
