import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

/**
 * GET /me/:username/raw
 * Returns the raw ME.md content as plain text.
 * Designed for AI agents to fetch and parse.
 */
export const GET: RequestHandler = async ({ params, url }) => {
	const [user] = await db.select().from(users).where(eq(users.username, params.username));

	if (!user) throw error(404, 'User not found');
	if (!user.meMd) throw error(404, `${params.username} has not published a ME.md`);

	const download = url.searchParams.has('download');

	const headers: Record<string, string> = {
		'Content-Type': 'text/markdown; charset=utf-8',
		'Cache-Control': 'public, max-age=300',
		'Access-Control-Allow-Origin': '*',
		'X-Me-Md-Version': '1.0',
		'X-Me-Md-Handle': user.username
	};

	if (download) {
		headers['Content-Disposition'] = `attachment; filename="${params.username}.md"`;
		headers['Cache-Control'] = 'no-cache';
	}

	return new Response(user.meMd, { headers });
};
