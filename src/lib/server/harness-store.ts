import { env } from '$env/dynamic/private';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { harnesses, users } from './schema';
import curated from '$lib/harness/curated.json';
import type { Harness } from '$lib/harness/types';
export const curatedHarnesses: Harness[] = curated;
export async function listHarnesses(filters: {ids?:string[]; owners?:string[]} = {}): Promise<{harnesses:Harness[]; storageAvailable:boolean}> {
 const owners=filters.owners?.map(owner=>owner.toLowerCase());
 const selectedCurated=curatedHarnesses.filter(h=>(filters.ids===undefined||filters.ids.includes(h.id))&&(owners===undefined||owners.includes(h.snapshot.owner.toLowerCase())));
 if (!env.DATABASE_URL) return {harnesses:selectedCurated,storageAvailable:false};
 // Curated IDs are text labels, while database IDs are UUIDs.
 const ids=filters.ids?.filter(id=>/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));
 if(ids?.length===0||owners?.length===0) return {harnesses:selectedCurated,storageAvailable:true};
 try {
  const {db} = await import('./db');
  const query = db.select({id:harnesses.id,title:harnesses.title,description:harnesses.description,topic:harnesses.topic,snapshot:harnesses.snapshot,userId:harnesses.userId,sharedBy:users.username}).from(harnesses).innerJoin(users,eq(users.id,harnesses.userId)).where(and(ids===undefined?undefined:inArray(harnesses.id,ids),owners===undefined?undefined:inArray(sql<string>`lower(${harnesses.snapshot}->>'owner')`,owners))).orderBy(desc(harnesses.updatedAt));
  // Only discovery is capped. A saved file or owner must remain reachable.
  const rows = await (filters.ids===undefined&&owners===undefined?query.limit(100):query);
  return {harnesses:[...rows.map(r=>({...r,curated:false})),...selectedCurated],storageAvailable:true};
 } catch { return {harnesses:selectedCurated,storageAvailable:false}; }
}
export async function getHarness(id:string): Promise<Harness|null> {
 const curated = curatedHarnesses.find(h=>h.id===id); if(curated) return curated;
 if(!/^[0-9a-f-]{36}$/i.test(id) || !env.DATABASE_URL) return null;
 const {db}=await import('./db');
 const [row]=await db.select({id:harnesses.id,title:harnesses.title,description:harnesses.description,topic:harnesses.topic,snapshot:harnesses.snapshot,userId:harnesses.userId,sharedBy:users.username}).from(harnesses).innerJoin(users,eq(users.id,harnesses.userId)).where(eq(harnesses.id,id)).limit(1);
 return row ? {...row,curated:false} : null;
}
