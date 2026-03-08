import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { users, meMdVersions } from '$lib/server/schema';
import { eq, desc } from 'drizzle-orm';
import { json, error } from '@sveltejs/kit';

/**
 * GET /api/me/versions
 * Returns the authenticated user's ME.md version history (most recent first).
 */
export const GET: RequestHandler = async ({ cookies }) => {
	const sessionToken = cookies.get('session');
	if (!sessionToken) throw error(401, 'Not authenticated');

	const [user] = await db
		.select({ id: users.id })
		.from(users)
		.where(eq(users.id, sessionToken));

	if (!user) throw error(401, 'Session invalid');

	const versions = await db
		.select({
			id: meMdVersions.id,
			versionNum: meMdVersions.versionNum,
			label: meMdVersions.label,
			charCount: meMdVersions.charCount,
			createdAt: meMdVersions.createdAt
		})
		.from(meMdVersions)
		.where(eq(meMdVersions.userId, user.id))
		.orderBy(desc(meMdVersions.createdAt))
		.limit(50);

	return json({ versions });
};
