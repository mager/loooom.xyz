import { initializeApp, getApps, cert, type ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'fs';
import { resolve } from 'path';

function getServiceAccount(): ServiceAccount {
	if (process.env.FIREBASE_SERVICE_ACCOUNT) {
		// Vercel env vars can mangle control chars in JSON — sanitize before parsing
		const raw = process.env.FIREBASE_SERVICE_ACCOUNT
			.replace(/\n/g, '\\n')
			.replace(/\r/g, '\\r')
			.replace(/\t/g, '\\t');
		const parsed = JSON.parse(raw) as Record<string, unknown>;
		// Restore actual newlines in private key
		if (typeof parsed.private_key === 'string') {
			parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
		}
		return parsed as ServiceAccount;
	}
	// Local dev fallback
	const filePath = resolve('firebase-service-account.json');
	return JSON.parse(readFileSync(filePath, 'utf-8')) as ServiceAccount;
}

let adminAuth: ReturnType<typeof getAuth> | null = null;

function getAdminAuth() {
	if (adminAuth) return adminAuth;
	try {
		const app = getApps().length
			? getApps()[0]
			: initializeApp({ credential: cert(getServiceAccount()) });
		adminAuth = getAuth(app);
		return adminAuth;
	} catch (e) {
		console.error('Firebase Admin init failed:', e);
		return null;
	}
}

export async function verifyIdToken(token: string) {
	const auth = getAdminAuth();
	if (!auth) throw new Error('Firebase not configured');
	return auth.verifyIdToken(token);
}
