import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { waitlist, skills, skillVersions, users } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	// Load featured skill: Franklin's "How to Learn Anything" from loooom account
	const [loooomUser] = await db.select().from(users).where(eq(users.username, 'loooom'));
	if (!loooomUser) return { featuredSkill: null };

	const [skill] = await db.select().from(skills).where(
		and(eq(skills.authorId, loooomUser.id), eq(skills.name, 'how-to-learn-anything'))
	);
	if (!skill) return { featuredSkill: null };

	const [version] = await db.select().from(skillVersions).where(eq(skillVersions.skillId, skill.id));

	return {
		featuredSkill: {
			title: skill.title,
			description: skill.description,
			category: skill.category,
			installs: skill.installs,
			author: { username: loooomUser.username, displayName: loooomUser.displayName, verified: loooomUser.verified },
			name: skill.name,
			version: skill.currentVersion ?? '1.0.0',
			contentHash: version?.contentHash ?? '',
			files: (version?.files ?? []) as { name: string; content: string }[]
		}
	};
};

export const actions: Actions = {
	waitlist: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString()?.trim()?.toLowerCase();

		if (!email || !email.includes('@')) {
			return fail(400, { error: 'Valid email required', email });
		}

		try {
			await db.insert(waitlist).values({ email }).onConflictDoNothing();
			return { success: true };
		} catch {
			return fail(500, { error: 'Something went wrong. Try again.', email });
		}
	}
};
