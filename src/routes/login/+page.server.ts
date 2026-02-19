import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username')?.toString()?.trim()?.toLowerCase();

		if (!username) return fail(400, { error: 'Username required' });

		const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);
		if (!user) return fail(400, { error: 'User not found' });

		cookies.set('session', user.id, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false,
			maxAge: 60 * 60 * 24 * 365
		});

		throw redirect(303, `/u/${user.username}`);
	}
};
