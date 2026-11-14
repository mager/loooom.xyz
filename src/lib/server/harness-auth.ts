import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { verifyIdToken } from './firebase-admin';
import { users } from './schema';
export async function requireHarnessUser(request:Request) {
 const token = request.headers.get('authorization')?.match(/^Bearer (.+)$/)?.[1];
 if (!token) error(401,'Sign in to share, save, or follow.');
 let uid: string;
 try { uid=(await verifyIdToken(token)).uid; } catch { error(401,'Your sign-in has expired. Sign in again.'); }
 const {db}=await import('./db');
 const [user]=await db.select({id:users.id,username:users.username}).from(users).where(eq(users.firebaseUid,uid)).limit(1);
 if(!user) error(401,'Finish signing in to your Loooom account.');
 return user;
}
