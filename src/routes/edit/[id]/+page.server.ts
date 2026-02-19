import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { users, skills, skillVersions } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';
import crypto from 'crypto';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const sessionId = cookies.get('session');
	if (!sessionId) throw redirect(303, '/login');

	const [skill] = await db.select().from(skills).where(eq(skills.id, params.id));
	if (!skill) throw error(404, 'Skill not found');
	if (skill.authorId !== sessionId) throw error(403, 'You can only edit your own skills');

	const versions = await db
		.select()
		.from(skillVersions)
		.where(eq(skillVersions.skillId, skill.id));

	const latestVersion = versions.find((v) => v.version === skill.currentVersion) ?? versions[0];
	const files = (latestVersion?.files ?? []) as { name: string; content: string }[];

	// Separate SKILL.md from additional files
	const skillMd = files.find((f) => f.name === 'SKILL.md');
	const additionalFiles = files.filter((f) => f.name !== 'SKILL.md');

	return {
		skill: {
			id: skill.id,
			name: skill.name,
			title: skill.title,
			description: skill.description,
			category: skill.category,
			version: skill.currentVersion ?? '1.0.0'
		},
		skillContent: skillMd?.content ?? '',
		additionalFiles
	};
};

export const actions: Actions = {
	default: async ({ request, params, cookies }) => {
		const sessionId = cookies.get('session');
		if (!sessionId) return fail(401, { error: 'You must be signed in.' });

		const [skill] = await db.select().from(skills).where(eq(skills.id, params.id));
		if (!skill) return fail(404, { error: 'Skill not found.' });
		if (skill.authorId !== sessionId) return fail(403, { error: 'You can only edit your own skills.' });

		const formData = await request.formData();
		const title = formData.get('title')?.toString().trim();
		const name = formData.get('name')?.toString().trim();
		const category = formData.get('category')?.toString().trim();
		const description = formData.get('description')?.toString().trim();
		const skillContent = formData.get('skillContent')?.toString() || '';
		const additionalFilesJson = formData.get('additionalFiles')?.toString() || '[]';

		if (!title || !name) return fail(400, { error: 'Title and name are required.' });

		const files: { name: string; content: string }[] = [
			{ name: 'SKILL.md', content: skillContent }
		];

		try {
			const additional = JSON.parse(additionalFilesJson) as { name: string; content: string }[];
			for (const f of additional) {
				if (f.name?.trim() && f.content?.trim()) {
					files.push({ name: f.name.trim(), content: f.content });
				}
			}
		} catch { /* ignore */ }

		const concatenated = files.map((f) => f.content).join('');
		const contentHash = 'sha256:' + crypto.createHash('sha256').update(concatenated).digest('hex');

		// Bump version
		const currentParts = (skill.currentVersion ?? '1.0.0').split('.').map(Number);
		const newVersion = `${currentParts[0]}.${currentParts[1]}.${(currentParts[2] ?? 0) + 1}`;

		// Create new version
		await db.insert(skillVersions).values({
			skillId: skill.id,
			version: newVersion,
			contentHash,
			files
		});

		// Update skill
		await db.update(skills).set({
			title,
			name,
			description: description || null,
			category: category || null,
			currentVersion: newVersion,
			updatedAt: new Date()
		}).where(eq(skills.id, skill.id));

		// Redirect to skill page
		const [user] = await db.select({ username: users.username }).from(users).where(eq(users.id, sessionId)).limit(1);
		if (user) throw redirect(303, `/s/${user.username}/${name}`);
		throw redirect(303, '/');
	}
};
