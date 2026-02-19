import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const sessionId = cookies.get('session');
	if (!sessionId) return { user: null };

	const [user] = await db.select({
		id: users.id,
		username: users.username,
		displayName: users.displayName,
		avatarUrl: users.avatarUrl,
		verified: users.verified
	}).from(users).where(eq(users.id, sessionId)).limit(1);

	return { user: user ?? null };
};
