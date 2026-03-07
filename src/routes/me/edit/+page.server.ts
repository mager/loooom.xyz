import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
	const sessionToken = cookies.get('session');
	if (!sessionToken) throw redirect(302, '/login');

	const [user] = await db
		.select({ meMd: users.meMd, username: users.username })
		.from(users)
		.where(eq(users.firebaseUid, sessionToken));

	if (!user) throw redirect(302, '/login');

	return {
		currentMeMd: user.meMd ?? null,
		username: user.username
	};
};
