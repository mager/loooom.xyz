import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { users, agentSouls } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

/**
 * GET /me/:username/agents/:agent/raw
 * Returns the raw agent soul markdown. CORS-open for AI consumption.
 */
export const GET: RequestHandler = async ({ params }) => {
	const [user] = await db.select().from(users).where(eq(users.username, params.username));
	if (!user) throw error(404, 'User not found');

	const [soul] = await db
		.select()
		.from(agentSouls)
		.where(and(eq(agentSouls.userId, user.id), eq(agentSouls.agentId, params.agent)));

	if (!soul) throw error(404, `No soul found for agent ${params.agent}`);

	return new Response(soul.content, {
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
			'Cache-Control': 'public, max-age=300',
			'Access-Control-Allow-Origin': '*',
			'X-Agent-Id': params.agent,
			'X-Agent-Owner': params.username,
			'X-Me-Md-Version': '1.1'
		}
	});
};
