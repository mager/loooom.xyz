import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { json, error } from '@sveltejs/kit';
import { parseMeMd } from '$lib/memd';

/**
 * POST /api/me
 * Saves the authenticated user's ME.md content.
 * Body: { content: string }
 */
export const POST: RequestHandler = async ({ request, cookies }) => {
	const sessionToken = cookies.get('session');
	if (!sessionToken) throw error(401, 'Not authenticated');

	const [user] = await db
		.select({ id: users.id, username: users.username })
		.from(users)
		.where(eq(users.firebaseUid, sessionToken));

	if (!user) throw error(401, 'Session invalid');

	const body = await request.json().catch(() => null);
	if (!body?.content || typeof body.content !== 'string') {
		throw error(400, 'Missing content field');
	}

	const content = body.content.trim();
	if (content.length > 100_000) throw error(400, 'ME.md too large (max 100kb)');

	// Parse and validate
	const parsed = parseMeMd(content);
	if (!parsed.frontmatter.handle) {
		throw error(400, 'ME.md must have a handle in frontmatter');
	}

	await db
		.update(users)
		.set({ meMd: content, updatedAt: new Date() })
		.where(eq(users.id, user.id));

	return json({
		ok: true,
		username: user.username,
		sections: parsed.sections.length,
		agents: parsed.frontmatter.agents?.length ?? 0,
		valid: parsed.valid,
		errors: parsed.errors
	});
};

/**
 * GET /api/me
 * Returns the authenticated user's ME.md content.
 */
export const GET: RequestHandler = async ({ cookies }) => {
	const sessionToken = cookies.get('session');
	if (!sessionToken) throw error(401, 'Not authenticated');

	const [user] = await db
		.select({ meMd: users.meMd, username: users.username })
		.from(users)
		.where(eq(users.firebaseUid, sessionToken));

	if (!user) throw error(401, 'Session invalid');

	return json({
		username: user.username,
		content: user.meMd ?? null
	});
};
