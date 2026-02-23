import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, skills, plugins, waitlist } from '$lib/server/schema';
import { desc, count, sql } from 'drizzle-orm';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();
	if (!user || user.username !== 'mager') throw redirect(302, '/');

	const [userList, skillList, pluginList, waitlistList] = await Promise.all([
		db.select().from(users).orderBy(desc(users.createdAt)),
		db.select().from(skills).orderBy(desc(skills.createdAt)),
		db.select().from(plugins).orderBy(desc(plugins.createdAt)),
		db.select().from(waitlist).orderBy(desc(waitlist.createdAt))
	]);

	const [{ totalInstalls }] = await db
		.select({ totalInstalls: sql<number>`coalesce(sum(${skills.installs}), 0)` })
		.from(skills);

	const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

	const newUsersThisWeek = userList.filter((u) => new Date(u.createdAt) > oneWeekAgo).length;
	const newWaitlistThisWeek = waitlistList.filter(
		(w) => new Date(w.createdAt) > oneWeekAgo
	).length;

	return {
		users: userList,
		skills: skillList,
		plugins: pluginList,
		waitlist: waitlistList,
		stats: {
			totalUsers: userList.length,
			newUsersThisWeek,
			totalSkills: skillList.length,
			publishedSkills: skillList.filter((s) => s.isPublished).length,
			totalPlugins: pluginList.length,
			publishedPlugins: pluginList.filter((p) => p.isPublished).length,
			totalWaitlist: waitlistList.length,
			newWaitlistThisWeek,
			totalInstalls: Number(totalInstalls)
		}
	};
};
