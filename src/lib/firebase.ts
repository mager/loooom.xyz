import { initializeApp, getApps } from 'firebase/app';
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut as firebaseSignOut,
	sendPasswordResetEmail
} from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyDjVuXEwUHEyy67np9kwn5wRc-3userBT8',
	authDomain: 'loooom-59f62.firebaseapp.com',
	projectId: 'loooom-59f62',
	storageBucket: 'loooom-59f62.firebasestorage.app',
	messagingSenderId: '621085527697',
	appId: '1:621085527697:web:2934cf207b952f1c787930'
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);

export async function signUpWithEmail(email: string, password: string) {
	const cred = await createUserWithEmailAndPassword(auth, email, password);
	return cred.user;
}

export async function signInWithEmail(email: string, password: string) {
	const cred = await signInWithEmailAndPassword(auth, email, password);
	return cred.user;
}

export async function signOut() {
	await firebaseSignOut(auth);
}

export async function resetPassword(email: string) {
	await sendPasswordResetEmail(auth, email);
}
