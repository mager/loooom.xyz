import type {Harness} from './types';
export function createCollection() {
 let saved = $state<string[]>([]), following = $state<string[]>([]), message = $state(''), busy = $state('');
 let savedHarnesses=$state<Harness[]>([]),followingHarnesses=$state<Harness[]>([]);
 async function headers() {
  const {auth}=await import('$lib/firebase');await auth.authStateReady();
  if(!auth.currentUser) throw new Error('Sign in to save files and follow people.');
  return {'Content-Type':'application/json',Authorization:`Bearer ${await auth.currentUser.getIdToken()}`};
 }
 async function load() {
  try {const res=await fetch('/api/harnesses/social',{headers:await headers()});const data=await res.json();if(res.ok){saved=data.saved;following=data.following;savedHarnesses=data.savedHarnesses;followingHarnesses=data.followingHarnesses;}}
  catch { /* A visitor can read every public file without signing in. */ }
 }
 async function toggle(action:'save'|'follow',target:string) {
  if(busy)return;busy=`${action}:${target}`;message='';
  const list=action==='save'?saved:following,enabled=!list.includes(target);
  try {const res=await fetch('/api/harnesses/social',{method:'POST',headers:await headers(),body:JSON.stringify({action,target,enabled})});const data=await res.json();if(!res.ok)throw new Error(data.error);
   const next=enabled?[...list,target]:list.filter(x=>x!==target);if(action==='save')saved=next;else following=next;
   await load();
   message=action==='save'?(enabled?'File saved to your collection.':'File removed from your collection.'):(enabled?'You are now following this person.':'You unfollowed this person.');
  }catch(e){message=e instanceof Error?e.message:'The change could not be saved.';}finally{busy='';}
 }
 return {get saved(){return saved;},get following(){return following;},get savedHarnesses(){return savedHarnesses;},get followingHarnesses(){return followingHarnesses;},get message(){return message;},get busy(){return busy;},load,toggle};
}
