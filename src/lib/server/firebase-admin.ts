import { initializeApp, getApps, cert, type ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'fs';
import { resolve } from 'path';

function getServiceAccount(): ServiceAccount {
	if (process.env.FIREBASE_SERVICE_ACCOUNT) {
		return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) as ServiceAccount;
	}
	// Local dev fallback
	const filePath = resolve('firebase-service-account.json');
	return JSON.parse(readFileSync(filePath, 'utf-8')) as ServiceAccount;
}

const app = getApps().length
	? getApps()[0]
	: initializeApp({ credential: cert(getServiceAccount()) });

const adminAuth = getAuth(app);

export async function verifyIdToken(token: string) {
	return adminAuth.verifyIdToken(token);
}
