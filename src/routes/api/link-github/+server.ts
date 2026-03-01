import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { verifyIdToken } from '$lib/server/firebase-admin';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { eq, and, ne } from 'drizzle-orm';

// Link a GitHub Firebase identity to an existing logged-in session.
// Requires: valid session cookie (existing account) + { idToken } from GitHub sign-in.
export const POST: RequestHandler = async ({ request, cookies }) => {
	const sessionUserId = cookies.get('session');
	if (!sessionUserId) {
		return json({ error: 'Not logged in' }, { status: 401 });
	}

	const body = await request.json();
	const { idToken } = body;
	if (!idToken) {
		return json({ error: 'Missing idToken' }, { status: 400 });
	}

	// Verify the GitHub Firebase token
	let decoded;
	try {
		decoded = await verifyIdToken(idToken);
	} catch {
		return json({ error: 'Invalid token' }, { status: 401 });
	}

	const firebaseUid = decoded.uid;
	const githubAvatarUrl = decoded.picture ?? null;

	// Make sure this firebaseUid isn't already tied to a DIFFERENT account
	const [existing] = await db
		.select({ id: users.id })
		.from(users)
		.where(and(eq(users.firebaseUid, firebaseUid), ne(users.id, sessionUserId)))
		.limit(1);

	if (existing) {
		return json({ error: 'This GitHub account is already linked to another Loooom account' }, { status: 409 });
	}

	// Link it
	await db
		.update(users)
		.set({
			firebaseUid,
			...(githubAvatarUrl ? { avatarUrl: githubAvatarUrl } : {})
		})
		.where(eq(users.id, sessionUserId));

	return json({ success: true });
};
