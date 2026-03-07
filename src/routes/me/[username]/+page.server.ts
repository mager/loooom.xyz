import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { parseMeMd } from '$lib/memd';

export const load: PageServerLoad = async ({ params }) => {
	const [user] = await db.select().from(users).where(eq(users.username, params.username));

	if (!user) throw error(404, 'User not found');
	if (!user.meMd) throw error(404, `${params.username} hasn't published a me.md yet`);

	const parsed = parseMeMd(user.meMd);

	return {
		user: {
			username: user.username,
			displayName: user.displayName,
			avatarUrl: user.avatarUrl,
			verified: user.verified,
			bio: user.bio
		},
		parsed,
		rawUrl: `/me/${params.username}/raw`
	};
};
