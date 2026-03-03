import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { waitlist } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const email = body.email?.toString().trim().toLowerCase();

	if (!email || !email.includes('@')) {
		return json({ error: 'Valid email required' }, { status: 400 });
	}

	try {
		const [existing] = await db.select().from(waitlist).where(eq(waitlist.email, email)).limit(1);
		if (existing) {
			return json({ ok: true, already: true });
		}

		await db.insert(waitlist).values({ email });
		return json({ ok: true });
	} catch {
		return json({ error: 'Something went wrong' }, { status: 500 });
	}
};
