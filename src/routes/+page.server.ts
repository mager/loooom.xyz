import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { waitlist } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
	waitlist: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString()?.trim()?.toLowerCase();

		if (!email || !email.includes('@')) {
			return fail(400, { error: 'Valid email required', email });
		}

		try {
			await db.insert(waitlist).values({ email }).onConflictDoNothing();
			return { success: true };
		} catch {
			return fail(500, { error: 'Something went wrong. Try again.', email });
		}
	}
};
