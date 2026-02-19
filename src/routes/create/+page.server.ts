import type { Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { skills, skillVersions } from '$lib/server/schema';
import crypto from 'crypto';

export const actions: Actions = {
	default: async ({ request, locals, cookies }) => {
		// Check auth via cookie (same pattern as layout)
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
		const concatenated = files.map(f => f.content).join('');
		const contentHash = 'sha256:' + crypto.createHash('sha256').update(concatenated).digest('hex');

		// Insert skill
		const [skill] = await db.insert(skills).values({
			authorId: sessionId,
			name,
			title,
			description: description || null,
			category: category || null,
			currentVersion: '1.0.0',
			isPublished: true
		}).returning({ id: skills.id });

		// Insert version
		await db.insert(skillVersions).values({
			skillId: skill.id,
			version: '1.0.0',
			contentHash,
			files
		});

		// Get username for redirect
		const { users } = await import('$lib/server/schema');
		const { eq } = await import('drizzle-orm');
		const [user] = await db.select({ username: users.username }).from(users).where(eq(users.id, sessionId)).limit(1);

		if (user) {
			throw redirect(303, `/u/${user.username}`);
		}
		throw redirect(303, '/');
	}
};
