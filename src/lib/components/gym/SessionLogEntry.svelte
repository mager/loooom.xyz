<script lang="ts">
 import type { GymArtifact } from '$lib/gym/session';
 import { sessionStory } from '$lib/gym/log';
 import ClimbReport from './ClimbReport.svelte';
 import RunReport from './RunReport.svelte';
 let { run, imported=false }: {run:GymArtifact; imported?:boolean} = $props();
 let open = $state(false);
 const story = $derived(sessionStory(run, imported));
 const date = $derived(new Date(story.time));
 const validDate = $derived(Number.isFinite(date.getTime()));
 const dateText = $derived(validDate ? new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'America/Chicago'}).format(date) : 'Date unavailable');
 const timeText = $derived(validDate ? new Intl.DateTimeFormat('en-US',{hour:'numeric',minute:'2-digit',timeZoneName:'short',timeZone:'America/Chicago'}).format(date) : '');
</script>

<li class="session" id={`session-${run.id}`}>
 <div class="when"><time datetime={validDate?story.time:undefined}>{dateText}<span>{timeText}</span></time><small>{run.finishedAt?'Completed':'Started'}{imported?' · local file':''}</small></div>
 <article aria-labelledby={`title-${run.id}`}>
  <h2 id={`title-${run.id}`}>{story.title}</h2>
  <div class="meta"><span class:verified={run.status==='verified'}>{story.status}</span><span>{story.skill}</span>{#if run.suite.seededDefect}<span>Deliberately added defect</span>{/if}</div>
  <dl><div><dt>{run.status==='no-defect'?'Checked':'Problem'}</dt><dd>{story.problem}</dd></div><div><dt>Change</dt><dd>{story.change}</dd></div><div><dt>Result</dt><dd>{story.result}</dd></div></dl>
  <details bind:open><summary>Open session record <span>Answers, changes, and downloads</span></summary>{#if open}<div class="record">{#if run.schemaVersion===2}<ClimbReport {run} />{:else}<RunReport {run} />{/if}</div>{/if}</details>
 </article>
</li>

<style>
 .session{display:grid;grid-template-columns:150px minmax(0,1fr);gap:38px;padding:36px 0 40px;border-top:1px solid var(--border)}.when{padding-top:5px;color:var(--text-secondary);font-size:.85rem;line-height:1.6}.when time{display:block}.when time span,.when small{display:block}.when small{font-size:.75rem;margin-top:8px}article{min-width:0}h2{font-size:clamp(1.6rem,3vw,2.1rem);line-height:1.2;font-weight:500;text-wrap:balance}.meta{display:flex;flex-wrap:wrap;gap:10px 18px;margin:14px 0 24px;color:var(--text-secondary);font-size:.8rem}.meta>span:first-child{font-weight:600;color:var(--text-primary)}.meta>span.verified{color:var(--accent)}dl{display:grid;gap:16px}dl>div{display:grid;grid-template-columns:70px minmax(0,1fr);gap:16px}dt{font-size:.8rem;color:var(--text-secondary);padding-top:3px}dd{font-size:.95rem;line-height:1.7;max-width:67ch}details{margin-top:22px}summary{padding:10px 0;cursor:pointer;font-size:.9rem;color:var(--accent);line-height:1.5}summary span{font-size:.75rem;color:var(--text-secondary);margin-left:14px}.record{margin-top:20px;border-top:1px solid var(--border);padding:8px 0 0}summary:focus-visible{outline:2px solid var(--accent);outline-offset:4px}@media(max-width:650px){.session{grid-template-columns:1fr;gap:16px;padding:28px 0}.when{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap}.when time span{display:inline;margin-left:10px}.when small{margin:0}dl>div{grid-template-columns:1fr;gap:3px}summary span{display:block;margin:5px 0 0 16px}h2{text-wrap:pretty}}
</style>
