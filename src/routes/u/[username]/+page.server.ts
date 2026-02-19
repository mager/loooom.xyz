import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users, skills, skillVersions } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const [user] = await db.select().from(users).where(eq(users.username, params.username));

	if (!user) {
		throw error(404, 'User not found');
	}

	const userSkills = await db.select().from(skills).where(eq(skills.authorId, user.id));

	// Load versions for each skill
	const skillsWithFiles = await Promise.all(
		userSkills.map(async (skill) => {
			const versions = await db
				.select()
				.from(skillVersions)
				.where(eq(skillVersions.skillId, skill.id));

			const latestVersion = versions.find((v) => v.version === skill.currentVersion) ?? versions[0];

			return {
				name: skill.name,
				title: skill.title,
				description: skill.description,
				category: skill.category,
				installs: skill.installs,
				version: skill.currentVersion ?? '0.0.0',
				updatedAt: skill.updatedAt.toISOString(),
				contentHash: latestVersion?.contentHash ?? '',
				files: (latestVersion?.files ?? []) as { name: string; content: string }[]
			};
		})
	);

	return {
		user: {
			username: user.username,
			displayName: user.displayName,
			bio: user.bio,
			avatarUrl: user.avatarUrl,
			verified: user.verified,
			topics: (user.topics ?? []) as string[]
		},
		skills: skillsWithFiles
	};
};
