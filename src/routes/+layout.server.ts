import type { LayoutServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { version as siteVersion } from '../../package.json';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const sessionId = cookies.get('session');
	if (!sessionId || !/^[0-9a-f-]{36}$/i.test(sessionId) || !env.DATABASE_URL) return { user: null, siteVersion };
	try {
	const { db } = await import('$lib/server/db');

	const [user] = await db.select({
		id: users.id,
		username: users.username,
		displayName: users.displayName,
		avatarUrl: users.avatarUrl,
		verified: users.verified
	}).from(users).where(eq(users.id, sessionId)).limit(1);

	return { user: user ?? null, siteVersion };
	} catch { return { user: null, siteVersion }; }
};
