import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { seedMager, seedLoooom } from '$lib/server/seed';

export const POST: RequestHandler = async () => {
	try {
		const magerResult = await seedMager();
		const looomResult = await seedLoooom();
		return json({ mager: magerResult, loooom: looomResult });
	} catch (e: unknown) {
		const message = e instanceof Error ? e.message : 'Unknown error';
		return json({ error: message }, { status: 500 });
	}
};
