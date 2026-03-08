import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users, meMdVersions } from '$lib/server/schema';
import { eq, desc } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
	const sessionToken = cookies.get('session');
	if (!sessionToken) throw redirect(302, '/login');

	const [user] = await db
		.select({ meMd: users.meMd, username: users.username, id: users.id })
		.from(users)
		.where(eq(users.id, sessionToken));

	if (!user) throw redirect(302, '/login');

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
		.limit(30);

	return {
		currentMeMd: user.meMd ?? null,
		username: user.username,
		versions
	};
};
