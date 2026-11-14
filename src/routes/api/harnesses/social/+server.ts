import { json,isHttpError } from '@sveltejs/kit';
import { and,eq } from 'drizzle-orm';
import { harnessSaves,harnessFollows } from '$lib/server/schema';
import { requireHarnessUser } from '$lib/server/harness-auth';
import { getHarness,listHarnesses } from '$lib/server/harness-store';
function failure(e:unknown) { return json({error:isHttpError(e)?e.body.message:'Your collection could not be saved. Try again later.'},{status:isHttpError(e)?e.status:503}); }
export const GET=async ({request}:{request:Request}) => {
 try {const user=await requireHarnessUser(request);const {db}=await import('$lib/server/db');
  const [saves,follows]=await Promise.all([db.select({id:harnessSaves.harnessId}).from(harnessSaves).where(eq(harnessSaves.userId,user.id)),db.select({owner:harnessFollows.owner}).from(harnessFollows).where(eq(harnessFollows.userId,user.id))]);
  const saved=saves.map(r=>r.id),following=follows.map(r=>r.owner);
  const [savedFiles,followingFiles]=await Promise.all([listHarnesses({ids:saved}),listHarnesses({owners:following})]);
  if(!savedFiles.storageAvailable||!followingFiles.storageAvailable) return json({error:'Your collection could not be loaded. Try again later.'},{status:503});
  return json({saved,following,savedHarnesses:savedFiles.harnesses,followingHarnesses:followingFiles.harnesses});
 }catch(e){return failure(e);}
};
export const POST=async ({request}:{request:Request}) => {
 try {const user=await requireHarnessUser(request);const body=await request.json();
  if(!['save','follow'].includes(body.action)||typeof body.target!=='string'||body.target.length>100||typeof body.enabled!=='boolean') return json({error:'This collection change is not valid.'},{status:400});
  const {db}=await import('$lib/server/db');
  if(body.action==='save') {
   if(body.enabled&&!await getHarness(body.target)) return json({error:'This file is no longer available.'},{status:404});
   if(body.enabled) await db.insert(harnessSaves).values({userId:user.id,harnessId:body.target}).onConflictDoNothing();
   else await db.delete(harnessSaves).where(and(eq(harnessSaves.userId,user.id),eq(harnessSaves.harnessId,body.target)));
  }else {
   const owner=body.target.toLowerCase();
   if(body.enabled&&!(await listHarnesses({owners:[owner]})).harnesses.length) return json({error:'This person has no shared files yet.'},{status:404});
   if(body.enabled) await db.insert(harnessFollows).values({userId:user.id,owner}).onConflictDoNothing();
   else await db.delete(harnessFollows).where(and(eq(harnessFollows.userId,user.id),eq(harnessFollows.owner,owner)));
  }
  return json({ok:true});
 }catch(e){return failure(e);}
};
