import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { users, agentSouls } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';
import { error, json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const username = url.searchParams.get('username');
	const agentId = url.searchParams.get('agent');
	if (!username || !agentId) throw error(400, 'Missing username or agent');

	const [user] = await db.select().from(users).where(eq(users.username, username));
	if (!user) throw error(404, 'User not found');

	const [soul] = await db
		.select()
		.from(agentSouls)
		.where(and(eq(agentSouls.userId, user.id), eq(agentSouls.agentId, agentId)));

	if (!soul) throw error(404, 'Agent soul not found');

	return json(
		{ agentId: soul.agentId, content: soul.content, updatedAt: soul.updatedAt },
		{ headers: { 'Access-Control-Allow-Origin': '*' } }
	);
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	const sessionToken = cookies.get('session');
	if (!sessionToken) throw error(401, 'Not authenticated');

	const [user] = await db.select().from(users).where(eq(users.firebaseUid, sessionToken));
	if (!user) throw error(401, 'Invalid session');

	const body = await request.json();
	const { agentId, content } = body as { agentId: string; content: string };
	if (!agentId || !content) throw error(400, 'Missing agentId or content');

	await db
		.insert(agentSouls)
		.values({ userId: user.id, agentId, content })
		.onConflictDoUpdate({
			target: [agentSouls.userId, agentSouls.agentId],
			set: { content, updatedAt: new Date() }
		});

	return json({ ok: true });
};
