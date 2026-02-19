import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, skills, follows } from '$lib/server/schema';
import { eq, sql, count } from 'drizzle-orm';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();
	if (!user) throw redirect(302, '/login');

	const [profile] = await db
		.select()
		.from(users)
		.where(eq(users.id, user.id))
		.limit(1);

	const userSkills = await db
		.select()
		.from(skills)
		.where(eq(skills.authorId, user.id));

	const [{ total }] = await db
		.select({ total: sql<number>`coalesce(sum(${skills.installs}), 0)` })
		.from(skills)
		.where(eq(skills.authorId, user.id));

	const [{ followers }] = await db
		.select({ followers: count() })
		.from(follows)
		.where(eq(follows.followingId, user.id));

	const [{ following }] = await db
		.select({ following: count() })
		.from(follows)
		.where(eq(follows.followerId, user.id));

	return {
		profile,
		skills: userSkills,
		totalUses: Number(total),
		followers,
		following
	};
};
