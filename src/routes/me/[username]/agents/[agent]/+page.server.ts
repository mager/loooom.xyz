import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users, agentSouls } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import matter from 'gray-matter';
import { generateAgentInjectionPrompt } from '$lib/memd';

interface AgentFrontmatter {
	agent_id?: string;
	emoji?: string;
	role?: string;
	model?: string;
	channel?: string;
	updated?: string;
	owner?: string;
}

export const load: PageServerLoad = async ({ params }) => {
	const [user] = await db.select().from(users).where(eq(users.username, params.username));
	if (!user) throw error(404, 'User not found');

	const [soul] = await db
		.select()
		.from(agentSouls)
		.where(and(eq(agentSouls.userId, user.id), eq(agentSouls.agentId, params.agent)));

	if (!soul) throw error(404, `No soul found for agent ${params.agent}`);

	const parsed = matter(soul.content);
	const fm = parsed.data as AgentFrontmatter;

	const rawUrl = `/me/${params.username}/agents/${params.agent}/raw`;
	const injectionPrompt = generateAgentInjectionPrompt(
		params.username,
		params.agent,
		`https://loooom.xyz${rawUrl}`
	);

	return {
		user: { username: user.username, displayName: user.displayName },
		agentId: params.agent,
		frontmatter: fm,
		body: parsed.content,
		rawUrl,
		injectionPrompt
	};
};
