/**
 * GET /api/directory
 * Machine-readable directory of all public ME.md profiles.
 * CORS-open, no auth required.
 *
 * Response: JSON array of profile summaries with rawUrl for each.
 * Intended audience: AI agents, crawlers, LLM indexers.
 */
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { isNotNull } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import { parseMeMd } from '$lib/memd';

export const GET: RequestHandler = async ({ url }) => {
	// Fetch all users with a published ME.md
	const rows = await db
		.select({
			username: users.username,
			displayName: users.displayName,
			avatarUrl: users.avatarUrl,
			meMd: users.meMd,
			updatedAt: users.updatedAt
		})
		.from(users)
		.where(isNotNull(users.meMd));

	const origin = url.origin || 'https://loooom.xyz';

	const profiles = rows
		.map((row) => {
			if (!row.meMd) return null;

			let frontmatter: Record<string, unknown> = {};
			try {
				const parsed = parseMeMd(row.meMd);
				frontmatter = parsed.frontmatter as Record<string, unknown>;
			} catch {
				// malformed ME.md — still include basic info
			}

			// Skip profiles that are explicitly private
			if (frontmatter.public === false) return null;

			return {
				username: row.username,
				handle: (frontmatter.handle as string) ?? `@${row.username}`,
				name: (frontmatter.name as string) ?? row.displayName ?? row.username,
				location: (frontmatter.location as string) ?? null,
				timezone: (frontmatter.timezone as string) ?? null,
				tags: (frontmatter.tags as string[]) ?? [],
				agents: (frontmatter.agents as unknown[]) ?? [],
				updated: frontmatter.updated
					? String(frontmatter.updated)
					: row.updatedAt?.toISOString().split('T')[0] ?? null,
				rawUrl: `${origin}/me/${row.username}/raw`,
				viewUrl: `${origin}/me/${row.username}`
			};
		})
		.filter(Boolean);

	return json(profiles, {
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Cache-Control': 'public, max-age=300', // 5-min cache
			'X-Loooom-Resource': 'me-md-directory',
			'X-Loooom-Agents': `${origin}/AGENTS.md`
		}
	});
};

export const OPTIONS: RequestHandler = async () => {
	return new Response(null, {
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type'
		}
	});
};
