import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users, skills, skillVersions } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { PLUGINS } from '$lib/plugins';

// Map skill categories → human-readable topic labels
const CATEGORY_TOPICS: Record<string, string> = {
	languages: 'language learning',
	learning: 'learning methods',
	thinking: 'critical thinking',
	writing: 'writing',
	design: 'UI design',
	productivity: 'productivity',
	marketing: 'marketing',
	automation: 'AI automation',
	documents: 'document tools',
	memory: 'agent memory',
	music: 'music',
	coding: 'coding',
	cooking: 'cooking'
};

function topicsFromSkills(skillList: { category: string; keywords?: string[] }[]): string[] {
	const seen = new Set<string>();
	const topics: string[] = [];
	for (const s of skillList) {
		if (topics.length >= 4) break;
		const label = CATEGORY_TOPICS[s.category] ?? s.category;
		if (!seen.has(label)) { seen.add(label); topics.push(label); }
	}
	return topics;
}

// External marketplace metadata for skills.sh authors
const EXTERNAL_MARKETPLACES: Record<string, { url: string; description: string }> = {
	anthropics: {
		url: 'https://skills.sh/anthropics/skills',
		description: "Official Anthropic skills for Claude Code — document tools, testing utilities, and MCP builders from the team that built Claude."
	},
	obra: {
		url: 'https://skills.sh/obra',
		description: "Productivity superpowers for developers — systematic debugging, TDD, git workflows, and agent orchestration."
	},
	'inference-sh-9': {
		url: 'https://skills.sh/inference-sh-9',
		description: 'AI-powered automation skills — image/video generation, browser control, web scraping, and social automation.'
	},
	coreyhaines31: {
		url: 'https://skills.sh/coreyhaines31',
		description: 'Marketing skills for growth — SEO, copywriting, content strategy, and launch playbooks.'
	},
	'browser-use': {
		url: 'https://skills.sh/browser-use',
		description: 'Browser automation skills — full web control for AI agents.'
	},
	firecrawl: {
		url: 'https://skills.sh/firecrawl',
		description: 'Web scraping and extraction skills — turn messy web pages into clean data.'
	}
};

export const load: PageServerLoad = async ({ params }) => {
	// First try database (Loooom native users)
	const [dbUser] = await db.select().from(users).where(eq(users.username, params.username));

	if (dbUser) {
		const userSkills = await db.select().from(skills).where(eq(skills.authorId, dbUser.id));

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
					files: (latestVersion?.files ?? []) as { name: string; content: string }[],
					source: 'loooom' as const,
					externalUrl: null as string | null
				};
			})
		);

		return {
			user: {
				username: dbUser.username,
				displayName: dbUser.displayName,
				bio: dbUser.bio,
				avatarUrl: dbUser.avatarUrl,
				verified: dbUser.verified,
				topics: skillsWithFiles.length > 0
					? topicsFromSkills(skillsWithFiles)
					: (dbUser.topics ?? []) as string[],
				source: 'loooom' as const
			},
			skills: skillsWithFiles,
			externalMarketplace: null
		};
	}

	// Fallback: check if this is an external skills.sh author
	const authorSkills = PLUGINS.filter((p) => p.author === params.username && p.source === 'skills.sh');

	if (authorSkills.length > 0) {
		const authorDisplay = authorSkills[0].authorDisplay;
		const topics = topicsFromSkills(authorSkills);

		const marketplace = EXTERNAL_MARKETPLACES[params.username];

		return {
			user: {
				username: params.username,
				displayName: authorDisplay,
				bio: marketplace?.description || `${authorDisplay} skills for Claude Code`,
				avatarUrl: null,
				verified: true,
				topics,
				source: 'skills.sh' as const
			},
			skills: authorSkills.map((s) => ({
				name: s.name,
				title: s.title,
				description: s.description,
				category: s.category,
				installs: s.installs ?? 0,
				version: s.version,
				updatedAt: new Date().toISOString(), // skills.sh doesn't expose this
				contentHash: '',
				files: [] as { name: string; content: string }[],
				source: 'skills.sh' as const,
				externalUrl: s.homepage,
				installCommand: s.installCommandSkillsSh || s.installCommand,
				emoji: s.emoji
			})),
			externalMarketplace: marketplace || null
		};
	}

	throw error(404, 'User not found');
};
