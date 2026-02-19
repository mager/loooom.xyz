import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
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
			const [newUser] = await db.insert(users).values({
				username,
				displayName,
				email,
				bio: '',
				verified: false,
				topics: []
			}).returning({ id: users.id, username: users.username });

			cookies.set('session', newUser.id, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: false,
				maxAge: 60 * 60 * 24 * 365 // 1 year
			});

			throw redirect(303, `/u/${newUser.username}`);
		} catch (e: unknown) {
			if (e instanceof Response || (e && typeof e === 'object' && 'status' in e && (e as { status: number }).status === 303)) throw e;
			const msg = e instanceof Error ? e.message : '';
			if (msg.includes('unique') || msg.includes('duplicate')) {
				return fail(400, { error: 'Username already taken', username, displayName, email });
			}
			return fail(500, { error: 'Something went wrong. Try again.', username, displayName, email });
		}
	}
};
