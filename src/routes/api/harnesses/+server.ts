import { json, isHttpError } from '@sveltejs/kit';
import { randomUUID } from 'node:crypto';
import { env } from '$env/dynamic/private';
import { harnesses, harnessVersions } from '$lib/server/schema';
import { requireHarnessUser } from '$lib/server/harness-auth';
import { importGitHubHarness, ImportError } from '$lib/server/github-harness';
export const POST = async ({request}:{request:Request}) => {
 try {
  const user=await requireHarnessUser(request); const body=await request.json();
  if(!body || typeof body.expectedCommitSha!=='string' || !/^[a-f0-9]{40}$/i.test(body.expectedCommitSha) || typeof body.url!=='string' || body.url.length>2048 || typeof body.title!=='string' || !body.title.trim() || body.title.length>100 || typeof body.description!=='string' || body.description.length>400 || !['coding','design','workflow','testing'].includes(body.topic)) return json({error:'Add a title (up to 100 characters), a short note (up to 400), and a topic.'},{status:400});
  const snapshot=await importGitHubHarness(body.url,{token:env.GITHUB_TOKEN});
  if(snapshot.commitSha!==body.expectedCommitSha) return json({error:'The file changed on GitHub after your preview. Preview it again before sharing.'},{status:409});
  const {db}=await import('$lib/server/db');
  const id=randomUUID();
  await db.batch([
   db.insert(harnesses).values({id,userId:user.id,sourceUrl:snapshot.sourceUrl,title:body.title.trim(),description:body.description.trim(),topic:body.topic,snapshot}),
   db.insert(harnessVersions).values({harnessId:id,commitSha:snapshot.commitSha,snapshot})
  ]);
  return json({id},{status:201});
 } catch(e) {
  if(e && typeof e==='object' && 'cause' in e && (e.cause as {code?:string})?.code==='23505') return json({error:'You already shared this file. Open it in the feed to refresh it.'},{status:409});
  if(isHttpError(e)) return json({error:e.body.message},{status:e.status});
  return json({error:e instanceof ImportError?e.message:'Sharing is unavailable. Please try again later.'},{status:e instanceof ImportError?e.status:503});
 }
};
