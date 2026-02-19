import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const username = data.get('username')?.toString()?.trim()?.toLowerCase();
		const displayName = data.get('displayName')?.toString()?.trim();
		const email = data.get('email')?.toString()?.trim()?.toLowerCase();

		if (!username || username.length < 2) {
			return fail(400, { error: 'Username must be at least 2 characters', username, displayName, email });
		}
		if (!displayName) {
			return fail(400, { error: 'Display name is required', username, displayName, email });
		}
		if (!email || !email.includes('@')) {
			return fail(400, { error: 'Valid email is required', username, displayName, email });
		}

		try {
			await db.insert(users).values({
				username,
				displayName,
				bio: '',
				verified: false,
				topics: []
			});
			return { success: true };
		} catch (e: unknown) {
			const msg = e instanceof Error ? e.message : '';
			if (msg.includes('unique') || msg.includes('duplicate')) {
				return fail(400, { error: 'Username already taken', username, displayName, email });
			}
			return fail(500, { error: 'Something went wrong. Try again.', username, displayName, email });
		}
	}
};
