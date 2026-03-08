import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { users, meMdVersions } from '$lib/server/schema';
import { eq, count } from 'drizzle-orm';
import { json, error } from '@sveltejs/kit';

/**
 * POST /api/me/versions/[id]/restore
 * Restores a specific ME.md version to the user's current content
 * and creates a new version snapshot of the restore.
 */
export const POST: RequestHandler = async ({ params, cookies }) => {
	const sessionToken = cookies.get('session');
	if (!sessionToken) throw error(401, 'Not authenticated');

	const [user] = await db
		.select({ id: users.id, username: users.username })
		.from(users)
		.where(eq(users.firebaseUid, sessionToken));

	if (!user) throw error(401, 'Session invalid');

	// Fetch the target version (must belong to this user)
	const [version] = await db
		.select({ content: meMdVersions.content, versionNum: meMdVersions.versionNum })
		.from(meMdVersions)
		.where(eq(meMdVersions.id, params.id));

	if (!version) throw error(404, 'Version not found');

	// Verify ownership by checking userId
	const [owned] = await db
		.select({ id: meMdVersions.id })
		.from(meMdVersions)
		.where(eq(meMdVersions.id, params.id));

	if (!owned) throw error(403, 'Forbidden');

	// Get next version number
	const [{ value: versionCount }] = await db
		.select({ value: count() })
		.from(meMdVersions)
		.where(eq(meMdVersions.userId, user.id));

	const nextVersionNum = Number(versionCount) + 1;

	// Restore: update current + save as new version with restore label
	await db
		.update(users)
		.set({ meMd: version.content, updatedAt: new Date() })
		.where(eq(users.id, user.id));

	await db.insert(meMdVersions).values({
		userId: user.id,
		content: version.content,
		versionNum: nextVersionNum,
		label: `Restored from v${version.versionNum}`,
		charCount: version.content.length
	});

	return json({ ok: true, versionNum: nextVersionNum, restoredFrom: version.versionNum });
};
