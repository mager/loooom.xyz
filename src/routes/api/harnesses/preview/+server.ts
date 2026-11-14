import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { ImportError, importGitHubHarness } from '$lib/server/github-harness';
import type { RequestHandler } from './$types';
// This bounded per-instance throttle supplements the host's rate limiting.
const requests = new Map<string,number[]>();
export const POST:RequestHandler = async ({request,getClientAddress}) => {
 const now=Date.now(), ip=getClientAddress();
 const recent=(requests.get(ip)??[]).filter(t=>t>now-60000);
 if(recent.length>=10) return json({error:'Too many imports. Wait one minute and try again.'},{status:429});
 if(requests.size>1000) requests.clear(); requests.set(ip,[...recent,now]);
 try {
  const body=await request.json();
  if(typeof body.url!=='string' || body.url.length>2048) return json({error:'Enter a GitHub file link.'},{status:400});
  return json({snapshot:await importGitHubHarness(body.url,{token:env.GITHUB_TOKEN})});
 } catch(e) { return json({error:e instanceof ImportError?e.message:'The file could not be imported. Check the link and try again.'},{status:e instanceof ImportError?e.status:400}); }
};
