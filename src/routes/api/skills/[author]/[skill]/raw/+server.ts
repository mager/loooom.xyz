import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { users, skills, skillVersions } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params, url }) => {
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

	const skillFile = files.find((f) => f.name === 'SKILL.md') ?? files[0];
	if (!skillFile) throw error(404, 'No skill content found');

	const headers: Record<string, string> = {
		'Content-Type': 'text/markdown; charset=utf-8'
	};

	if (url.searchParams.get('download') === 'true') {
		headers['Content-Disposition'] = 'attachment; filename="SKILL.md"';
	}

	return new Response(skillFile.content, { headers });
};
