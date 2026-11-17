<script lang="ts">
 import TestWeave from '$lib/components/gym/TestWeave.svelte';
 import type { ClimbSession } from '$lib/gym/session';
 import SessionLogEntry from '$lib/components/gym/SessionLogEntry.svelte';
 import { newestSessions } from '$lib/gym/log';
 import { parseArtifact, type GymArtifact } from '$lib/gym/session';
 let { data } = $props();
 let imported = $state<GymArtifact | null>(null);
 let error = $state('');
 let loading = $state(false);
 const reports = $derived(newestSessions(imported ? [imported, ...data.reports.filter(r => r.id !== imported?.id)] : data.reports));
 const sessions = $derived(reports.filter((r): r is ClimbSession => r.schemaVersion===2));
 async function loadFile(event: Event) {
  const input = event.currentTarget as HTMLInputElement;
  const file = input.files?.[0]; if (!file) return;
  loading = true; error = '';
  try {
   if (file.size > 2_000_000) throw new Error('This file is too large. Choose a gym JSON report smaller than 2 MB.');
   const report = parseArtifact(JSON.parse(await file.text()));
   imported = report;
  } catch (e) { error = e instanceof SyntaxError ? 'This file is not valid JSON. Choose a report from loooom gym.' : e instanceof Error ? e.message : 'Could not read this file.'; }
  finally { loading = false; input.value = ''; }
 }
</script>

<svelte:head><title>Gym session log — Loooom</title><meta name="description" content="A log of real skills gym sessions: problems found, changes tried, and test results. Failed attempts and unchanged skills included." /></svelte:head>

<section class="gym-page" aria-labelledby="gym-heading">
  <div class="intro"><div><h1 id="gym-heading">Gym log<span>.</span></h1><p>Compare saved answers before and after each skill change.</p><a class="runner-link" href="https://github.com/mager/loooom">Runner source <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg></a></div><div class="import"><label class="load-file" class:loading>{loading ? 'Reading report…' : 'Open results file'}<input type="file" accept=".json,application/json" onchange={loadFile} disabled={loading} /></label><small>JSON file. Nothing is uploaded.</small></div></div>
  {#if error}<p class="import-error" role="alert">{error}</p>{/if}
  <TestWeave {sessions} importedId={imported?.id} />
  <div class="log-intro"><h2>Session history</h2><p>{reports.length} saved {reports.length===1?'session':'sessions'} · latest completed first</p></div>
  {#if imported}<p class="local-note" role="status">Local session added to this view. It is not published. <button onclick={()=>imported=null}>Remove local session</button></p>{/if}
  <ol class="session-log" aria-label="Gym session history">{#each reports as run (run.id)}<SessionLogEntry {run} imported={imported?.id===run.id} />{/each}</ol>
  {#if !reports.length}<div class="empty"><h2>No sessions recorded yet.</h2><p>Run a skill through the gym, then open its results file here.</p></div>{/if}

</section>

<style>
 .gym-page{min-width:0;padding-bottom:28px}
 .intro{display:flex;justify-content:space-between;gap:32px;align-items:center;padding:54px 0 36px}
 .intro h1{font-size:clamp(36px,4vw,60px);font-weight:500;line-height:1.02;letter-spacing:-.035em;margin:0}
 h1 span{color:var(--lime)}
 .intro p{font-size:17px;line-height:1.6;margin-top:18px;color:var(--quiet);max-width:50ch}
 .runner-link{display:inline-flex;align-items:center;gap:6px;margin-top:16px;color:var(--quiet);font-size:13px;text-decoration:underline;text-underline-offset:4px}
 .runner-link svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.5}
 .import{display:flex;flex-direction:column;align-items:flex-start;gap:10px;flex-shrink:0}
 .import small{font-size:12px;color:var(--quiet)}
 .load-file{position:relative;display:inline-flex;align-items:center;overflow:hidden;min-height:46px;padding:12px 20px;border-radius:6px;border:1px solid var(--action-bg);background:var(--action-bg);color:var(--action-ink);font-size:14px;font-weight:500;cursor:pointer;transition:background .2s}
 .load-file:hover{background:var(--action-hover)}
 .load-file.loading{opacity:.55;cursor:wait}
 .load-file:focus-within{outline:2px solid var(--lime);outline-offset:5px}
 .load-file input{position:absolute;inset:0;opacity:0;width:100%;height:100%;cursor:pointer}
 .log-intro{display:flex;justify-content:space-between;gap:20px;align-items:baseline;padding-bottom:24px;color:var(--quiet);line-height:1.65;font-size:13px}
 .log-intro h2{font-size:28px;line-height:1.2;font-weight:500;color:var(--paper);margin:0}
 .session-log{list-style:none;padding:0;margin:0}
 .local-note,.import-error{padding:16px 20px;border:1px solid var(--notice-border);border-radius:6px;background:var(--notice-bg);color:var(--notice-ink);margin:0 0 24px;line-height:1.6}
 .import-error{border-color:var(--error-border);background:var(--error-bg);color:var(--error-ink)}
 .local-note button{min-height:46px;margin-left:10px;padding:0;background:none;border:0;font:inherit;text-decoration:underline;text-underline-offset:4px;color:inherit;cursor:pointer}
 .empty{padding:30px 0;border-top:1px solid var(--line)}
 .empty p{margin-top:12px;color:var(--quiet)}
 a:focus-visible,button:focus-visible{outline:2px solid var(--lime);outline-offset:5px}
 .gym-page :global([id^="session-"]){scroll-margin-top:24px}
 @media(max-width:900px){.intro{align-items:flex-start;flex-direction:column;gap:24px}.log-intro{display:block}.log-intro p{margin-top:8px}}
 @media(max-width:760px){.intro{padding:36px 0 28px}.intro p{font-size:16px}.local-note button{display:block;margin-left:0}.log-intro h2{font-size:26px}}
 @media(prefers-reduced-motion:reduce){.load-file{transition:none}}
</style>
