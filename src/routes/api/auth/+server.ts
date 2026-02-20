import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { verifyIdToken } from '$lib/server/firebase-admin';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const body = await request.json();
	const { idToken, username, displayName } = body;

	if (!idToken) {
		return json({ error: 'Missing idToken' }, { status: 400 });
	}

	let decoded;
	try {
		decoded = await verifyIdToken(idToken);
	} catch {
		return json({ error: 'Invalid token' }, { status: 401 });
	}

	const email = decoded.email?.toLowerCase();
	const firebaseUid = decoded.uid;

	if (!email) {
		return json({ error: 'No email in token' }, { status: 400 });
	}

	// Look up existing user by firebaseUid or email
	let [user] = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid)).limit(1);

	if (!user) {
		[user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
		if (user) {
			// Link existing user to Firebase
			await db.update(users).set({ firebaseUid }).where(eq(users.id, user.id));
		}
	}

	if (!user) {
		// Create new user (signup flow)
		if (!username) {
			return json({ error: 'Username required for new accounts' }, { status: 400 });
		}

		try {
			[user] = await db.insert(users).values({
				username: username.trim().toLowerCase(),
				displayName: displayName?.trim() || username.trim(),
				email,
				firebaseUid,
				bio: '',
				verified: false,
				topics: []
			}).returning();
		} catch (e: unknown) {
			const msg = e instanceof Error ? e.message : '';
			if (msg.includes('unique') || msg.includes('duplicate')) {
				return json({ error: 'Username already taken' }, { status: 409 });
			}
			return json({ error: 'Failed to create account' }, { status: 500 });
		}
	}

	cookies.set('session', user.id, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		maxAge: 60 * 60 * 24 * 365
	});

	return json({
		user: {
			id: user.id,
			username: user.username,
			displayName: user.displayName
		}
	});
};
