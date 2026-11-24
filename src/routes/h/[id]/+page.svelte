<script lang="ts">
 import {onMount} from 'svelte';
 import {invalidateAll} from '$app/navigation';
 import SourceReader from '$lib/components/harness/SourceReader.svelte';
 import Icon from '$lib/components/harness/Icon.svelte';
 import {createCollection} from '$lib/harness/social.svelte';
 import {dateLabel,pinnedUrl} from '$lib/harness/types';
 import type {PageData} from './$types';

 let {data}:{data:PageData}=$props();
 const collection=createCollection();
 let refreshing=$state(false),refreshMessage=$state('');
 let h=$derived(data.harness);
 let owner=$derived(h.snapshot.owner);
 let saved=$derived(collection.saved.includes(h.id));
 let following=$derived(collection.following.includes(owner.toLowerCase()));
 onMount(()=>{collection.load();});

 async function refresh(){
  refreshing=true;refreshMessage='';
  try{
   const {auth}=await import('$lib/firebase');
   await auth.authStateReady();
   if(!auth.currentUser)throw new Error('Sign in again to refresh your file.');
   const res=await fetch(`/api/harnesses/${h.id}/refresh`,{method:'POST',headers:{Authorization:`Bearer ${await auth.currentUser.getIdToken()}`}});
   const result=await res.json();
   if(!res.ok)throw new Error(result.error);
   refreshMessage=result.changed?'A new snapshot was saved.':'Your snapshot is already up to date.';
   await invalidateAll();
  }catch(e){refreshMessage=e instanceof Error?e.message:'Refresh failed.';}
  finally{refreshing=false;}
 }
</script>

<svelte:head>
 <title>{h.title} — Loooom</title>
 <meta name="description" content={h.description}/>
</svelte:head>

<article class="file-workspace">
 <header class="file-header">
  <div class="file-heading">
   <div class="file-byline">
    <a href={`/people/${owner}`}>@{owner}</a>
    {#if h.curated}<span>Curated from GitHub</span>
    {:else if h.sharedBy && h.sharedBy.toLowerCase()!==owner.toLowerCase()}<span>Shared by @{h.sharedBy}</span>{/if}
   </div>
   <h1>{h.title}</h1>
  </div>
  <div class="file-actions">
   <a class="details-jump" href="#file-details">File details</a>
   <button class="button secondary compact" aria-pressed={saved} disabled={!!collection.busy} onclick={()=>collection.toggle('save',h.id)}>
    <Icon name={saved?'check':'bookmark'} size={16}/>{saved?'Saved':'Save'}<span class="sr-only"> to collection</span>
   </button>
   <a class="button secondary compact" href={pinnedUrl(h.snapshot)} target="_blank" rel="noreferrer"><Icon name="github" size={16}/>GitHub<Icon name="external" size={12}/></a>
  </div>
 </header>

 {#if collection.message}<div class="notice" role="status">{collection.message} {#if collection.message.startsWith('Sign in')}<a href={`/login?next=/h/${h.id}`}>Sign in</a>{/if}</div>{/if}
 {#if refreshMessage}<div class="notice" role="status">{refreshMessage}</div>{/if}

 <div class="file-layout">
  <div class="file-content">
   <SourceReader content={h.snapshot.content} filename={h.snapshot.path} emphasizeCopy/>
  </div>

  <aside class="file-details" id="file-details" aria-label="File details" tabindex="-1">
   <section class="file-about" aria-labelledby="about-file">
    <h2 id="about-file">About this file</h2>
    {#if h.description}<p>{h.description}</p>{/if}
    <button class="follow-action" aria-pressed={following} disabled={!!collection.busy} onclick={()=>collection.toggle('follow',owner.toLowerCase())}>
     <Icon name={following?'check':'plus'} size={14}/>{following?'Following':'Follow'} @{owner}
    </button>
   </section>

   <section class="source-record" aria-labelledby="source-heading">
    <h2 id="source-heading">Source</h2>
    <a class="repository" href={`https://github.com/${owner}/${h.snapshot.repo}`} target="_blank" rel="noreferrer"><Icon name="github" size={16}/><span>{owner}<strong>{h.snapshot.repo}</strong></span><Icon name="external" size={12}/></a>
    <dl class="source-facts">
     <div><dt>Updated</dt><dd>{dateLabel(h.snapshot.updatedAt)}</dd></div>
     <div><dt>Commit</dt><dd><a class="commit-link" href={`https://github.com/${owner}/${h.snapshot.repo}/commit/${h.snapshot.commitSha}`} target="_blank" rel="noreferrer">{h.snapshot.commitSha.slice(0,7)}<Icon name="external" size={12}/></a></dd></div>
     <div><dt>Length</dt><dd>{h.snapshot.lineCount} lines</dd></div>
    </dl>
    {#if data.user?.id===h.userId}<button class="refresh-action" onclick={refresh} disabled={refreshing}><Icon name="refresh" size={14}/>{refreshing?'Refreshing…':'Refresh from GitHub'}</button>{/if}
    <details class="snapshot-details">
     <summary>Snapshot details</summary>
     <dl>
      <div><dt>Imported</dt><dd>{dateLabel(h.snapshot.importedAt)}</dd></div>
      <div><dt>SHA-256</dt><dd class="hash">{h.snapshot.contentHash}</dd></div>
     </dl>
     <p>Read-only snapshot. GitHub is the editable source.</p>
    </details>
   </section>

   <a class="eval-link" href="/evals"><Icon name="flask" size={16}/><span>Compare with personal evals</span><Icon name="arrow" size={14}/></a>
  </aside>
 </div>
</article>

<style>
 .file-workspace{padding-top:24px;--file-gap:24px}
 .file-header{display:flex;align-items:center;justify-content:space-between;gap:24px;margin-bottom:24px}
 .file-heading{min-width:0}
 .file-byline{display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin-bottom:6px;font-size:.8125rem}
 .file-byline a{color:var(--lime);font-weight:500}
 .file-byline span{color:var(--quiet)}
 .file-header h1{font-size:2rem;line-height:1.15;font-weight:600;letter-spacing:-.035em;margin:0;overflow-wrap:anywhere;text-wrap:pretty}
 .file-actions{display:flex;gap:8px;align-items:center;flex-shrink:0}
 .file-actions .button{font-size:.8125rem;gap:8px;min-height:40px;padding:8px 12px}
 .file-actions button[aria-pressed='true']{background:var(--accent-soft);border-color:var(--accent-border);color:var(--lime)}
 .details-jump{display:none}
 .file-layout{display:grid;grid-template-columns:minmax(0,1fr) 224px;gap:var(--file-gap);align-items:start}
 .file-content{min-width:0}
 .file-details{min-width:0;scroll-margin-top:24px}
 .file-details section{padding:20px 0;border-bottom:1px solid var(--line)}
 .file-details section:first-child{padding-top:4px}
 .file-details h2{font-size:.8125rem;font-weight:600;letter-spacing:0;margin:0 0 12px;line-height:1.5}
 .file-about p{font-size:1rem;line-height:1.5;color:var(--quiet);overflow-wrap:anywhere}
 .follow-action,.refresh-action{display:inline-flex;align-items:center;justify-content:flex-start;gap:6px;border:0;background:none;color:var(--lime);font-size:.8125rem;min-height:40px;padding:8px 0;text-align:left;overflow-wrap:anywhere}
 .follow-action{margin-top:8px}
 .follow-action:hover,.refresh-action:hover{text-decoration:underline;text-underline-offset:3px}
 .repository{display:flex;gap:10px;align-items:center;font-size:.8125rem;line-height:1.6}
 .repository>span{min-width:0;overflow-wrap:anywhere;color:var(--quiet)}
 .repository strong{display:block;font-weight:500;color:var(--paper)}
 .repository>:global(svg:first-child){color:var(--quiet)}
 .repository>:global(svg:last-child){margin-left:auto;color:var(--quiet)}
 .source-facts{display:flex;flex-direction:column;gap:12px;margin:20px 0 0;font-size:.75rem}
 .source-facts>div{display:flex;justify-content:space-between;gap:12px;align-items:baseline}
 .source-facts dt{color:var(--quiet)}
 .source-facts dd{margin:0;text-align:right;font-variant-numeric:tabular-nums}
 .commit-link{display:inline-flex;align-items:center;gap:6px;font-family:'Space Mono',monospace;color:var(--lavender);font-size:.6875rem}
 .refresh-action{margin-top:12px}
 .snapshot-details{margin-top:16px;font-size:.75rem;color:var(--quiet)}
 .snapshot-details summary{cursor:pointer;padding:8px 0;min-height:36px}
 .snapshot-details summary:hover{color:var(--paper)}
 .snapshot-details dl{margin:8px 0 12px}
 .snapshot-details dt{font-weight:500;margin:12px 0 4px;color:var(--paper)}
 .snapshot-details dd{margin:0}
 .hash{font-family:'Space Mono',monospace;font-size:.625rem;overflow-wrap:anywhere;line-height:1.8}
 .snapshot-details p{line-height:1.6}
 .eval-link{display:flex;align-items:center;gap:8px;padding:20px 0;color:var(--lavender);font-size:.8125rem;line-height:1.4}
 .eval-link span{flex:1}
 .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
 @media(max-width:1100px){
  .file-layout{grid-template-columns:minmax(0,1fr)}
  .file-details{display:grid;grid-template-columns:1fr 1fr;column-gap:32px;border-top:1px solid var(--line)}
  .file-details section:first-child{padding-top:20px}
  .eval-link{grid-column:1/-1;justify-self:start;gap:12px}
  .details-jump{display:inline-flex;align-items:center;min-height:40px;font-size:.8125rem;color:var(--quiet);margin-right:8px}
 }
 @media(max-width:760px){
  .file-workspace{padding-top:20px}
  .file-header{gap:12px;flex-wrap:wrap;margin-bottom:16px}
  .file-header h1{font-size:1.75rem}
  .file-actions{width:100%}
  .details-jump{margin-right:auto}
 }
 @media(max-width:500px){.file-details{display:block}.file-actions .button{min-height:44px}.details-jump{min-height:44px}}
</style>
