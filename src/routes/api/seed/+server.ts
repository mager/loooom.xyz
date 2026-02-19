import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { seedMager } from '$lib/server/seed';

export const POST: RequestHandler = async () => {
	try {
		const result = await seedMager();
		return json(result);
	} catch (e: unknown) {
		const message = e instanceof Error ? e.message : 'Unknown error';
		return json({ error: message }, { status: 500 });
	}
};
