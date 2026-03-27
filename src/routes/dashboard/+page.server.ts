import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, skills } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();
	if (!user) throw redirect(302, '/login');

	const [profile] = await db
		.select()
		.from(users)
		.where(eq(users.id, user.id))
		.limit(1);

	const mySkills = await db
		.select()
		.from(skills)
		.where(eq(skills.authorId, user.id))
		.orderBy(skills.updatedAt);

	return { profile, skills: mySkills };
};

export const actions: Actions = {
	deleteSkill: async ({ request, parent }) => {
		const { user } = await parent();
		if (!user) return fail(401, { error: 'Not authenticated' });

		const data = await request.formData();
		const skillId = data.get('skillId')?.toString();
		if (!skillId) return fail(400, { error: 'Missing skill ID' });

		const [skill] = await db.select().from(skills).where(eq(skills.id, skillId)).limit(1);
		if (!skill || skill.authorId !== user.id) return fail(403, { error: 'Forbidden' });

		await db.delete(skills).where(eq(skills.id, skillId));
		return { deleted: true };
	},

	togglePublish: async ({ request, parent }) => {
		const { user } = await parent();
		if (!user) return fail(401, { error: 'Not authenticated' });

		const data = await request.formData();
		const skillId = data.get('skillId')?.toString();
		if (!skillId) return fail(400, { error: 'Missing skill ID' });

		const [skill] = await db.select().from(skills).where(eq(skills.id, skillId)).limit(1);
		if (!skill || skill.authorId !== user.id) return fail(403, { error: 'Forbidden' });

		await db.update(skills).set({ isPublished: !skill.isPublished }).where(eq(skills.id, skillId));
		return { toggled: true };
	}
};
