import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { skills, skillVersions, users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export const load: PageServerLoad = async ({ cookies }) => {
	const sessionId = cookies.get('session');
	if (!sessionId) {
		return { user: null };
	}

	const [user] = await db
		.select({
			id: users.id,
			username: users.username,
			displayName: users.displayName,
			avatarUrl: users.avatarUrl
		})
		.from(users)
		.where(eq(users.id, sessionId))
		.limit(1);

	return { user: user ?? null };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const sessionId = cookies.get('session');
		if (!sessionId) {
			return fail(401, { error: 'You must be signed in to publish a skill.' });
		}

		const formData = await request.formData();
		const title = formData.get('title')?.toString().trim();
		const name = formData.get('name')?.toString().trim();
		const category = formData.get('category')?.toString().trim();
		const description = formData.get('description')?.toString().trim();
		const skillContent = formData.get('skillContent')?.toString() || '';
		const additionalFilesJson = formData.get('additionalFiles')?.toString() || '[]';

		if (!title || !name) {
			return fail(400, { error: 'Title and name are required.' });
		}

		// Build files array
		const files: { name: string; content: string }[] = [
			{ name: 'SKILL.md', content: skillContent }
		];

		try {
			const additionalFiles = JSON.parse(additionalFilesJson) as { name: string; content: string }[];
			for (const f of additionalFiles) {
				if (f.name?.trim() && f.content?.trim()) {
					files.push({ name: f.name.trim(), content: f.content });
				}
			}
		} catch {
			// ignore parse errors
		}

		// Generate content hash
		const concatenated = files.map((f) => f.content).join('');
		const contentHash = 'sha256:' + crypto.createHash('sha256').update(concatenated).digest('hex');

		// Insert skill
		const [skill] = await db
			.insert(skills)
			.values({
				authorId: sessionId,
				name,
				title,
				description: description || null,
				category: category || null,
				currentVersion: '1.0.0',
				isPublished: true
			})
			.returning({ id: skills.id });

		// Insert version
		await db.insert(skillVersions).values({
			skillId: skill.id,
			version: '1.0.0',
			contentHash,
			files
		});

		// Get username for redirect
		const [user] = await db
			.select({ username: users.username })
			.from(users)
			.where(eq(users.id, sessionId))
			.limit(1);

		// Return success data instead of redirect so we can show celebration screen
		return {
			success: true,
			username: user?.username ?? null,
			skillName: name
		};
	}
};
