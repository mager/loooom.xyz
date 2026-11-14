import { json,isHttpError } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { eq } from 'drizzle-orm';
import { requireHarnessUser } from '$lib/server/harness-auth';
import { harnesses,harnessVersions } from '$lib/server/schema';
import { getHarness } from '$lib/server/harness-store';
import { importGitHubHarness,ImportError } from '$lib/server/github-harness';
import type {RequestHandler} from './$types';
export const POST:RequestHandler=async ({request,params})=>{
 try{
  const user=await requireHarnessUser(request),h=await getHarness(params.id);
  if(!h || h.userId!==user.id) return json({error:'Only the person who shared this file can refresh it.'},{status:403});
  const snapshot=await importGitHubHarness(h.snapshot.sourceUrl,{token:env.GITHUB_TOKEN});
  const {db}=await import('$lib/server/db');
  await db.batch([
   db.insert(harnessVersions).values({harnessId:h.id,commitSha:h.snapshot.commitSha,snapshot:h.snapshot}).onConflictDoNothing(),
   db.insert(harnessVersions).values({harnessId:h.id,commitSha:snapshot.commitSha,snapshot}).onConflictDoNothing(),
   db.update(harnesses).set({snapshot,updatedAt:new Date()}).where(eq(harnesses.id,h.id))
  ]);
  return json({changed:snapshot.commitSha!==h.snapshot.commitSha});
 }catch(e){return json({error:isHttpError(e)?e.body.message:e instanceof ImportError?e.message:'Refresh failed. Your saved version is unchanged.'},{status:isHttpError(e)?e.status:e instanceof ImportError?e.status:503});}
};
