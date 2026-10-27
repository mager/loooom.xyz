<script lang="ts">
 import YarnLogo from '$lib/components/YarnLogo.svelte';
 import ThemeToggle from '$lib/components/ThemeToggle.svelte';
 import SessionLogEntry from '$lib/components/gym/SessionLogEntry.svelte';
 import { newestSessions } from '$lib/gym/log';
 import { parseArtifact, type GymArtifact } from '$lib/gym/session';
 let { data } = $props();
 let imported = $state<GymArtifact | null>(null);
 let error = $state('');
 let loading = $state(false);
 const reports = $derived(newestSessions(imported ? [imported, ...data.reports.filter(r => r.id !== imported?.id)] : data.reports));
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

<div class="gym-shell">
 <header><a href="/" class="brand" aria-label="Loooom home"><YarnLogo size={24} /><span>loooom</span></a><nav aria-label="Primary navigation"><a href="/browse">Skills</a><a href="/gym" aria-current="page">Gym</a><a href="/docs">Docs</a></nav><ThemeToggle /></header>
 <main>
  <div class="intro"><div><h1>Gym log<span>.</span></h1><p>What we found. What we changed. How we checked it.</p></div><div class="import"><label class="load-file">{loading ? 'Reading report…' : 'Open results file'}<input type="file" accept=".json,application/json" onchange={loadFile} disabled={loading} /></label><small>JSON file. Nothing is uploaded.</small></div></div>
  {#if error}<p class="import-error" role="alert">{error}</p>{/if}
  <div class="log-intro"><p>{reports.length} recorded {reports.length===1?'session':'sessions'} · latest completed first</p><p>Fixes, rejected changes, and skills we kept as they were. These are saved runs, graded by an AI.</p></div>
  {#if imported}<p class="local-note" role="status">Local session added to this view. It is not published. <button onclick={()=>imported=null}>Remove local session</button></p>{/if}
  <ol class="session-log" aria-label="Gym session history">{#each reports as run (run.id)}<SessionLogEntry {run} imported={imported?.id===run.id} />{/each}</ol>
  {#if !reports.length}<div class="empty"><h2>No sessions recorded yet.</h2><p>Run a skill through the gym, then open its results file here.</p></div>{/if}

 </main>
 <footer><a href="/">loooom</a><span>Small experiments. Visible evidence.</span><a href="https://github.com/mager/loooom">Runner source</a></footer>
</div>

<style>
 .gym-shell{max-width:1120px;margin:0 auto;padding:0 40px}header{min-height:74px;display:flex;gap:32px;align-items:center;border-bottom:1px solid var(--border)}.brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--text-primary)}.brand span{font-family:var(--font-handwriting);font-size:1.5rem}header nav{margin-left:auto;display:flex;gap:30px}header nav a{font-size:.9rem;color:var(--text-secondary);text-decoration:none}header nav a[aria-current]{color:var(--accent);font-weight:600}.intro{display:flex;justify-content:space-between;gap:30px;align-items:center;padding:44px 0 30px}h1{font-size:clamp(2.8rem,5vw,3.5rem);font-weight:500;line-height:1.08;letter-spacing:-.04em}h1 span{color:var(--accent)}.intro p{max-width:50ch;line-height:1.6;color:var(--text-secondary);font-size:1.15rem;margin-top:16px}.import{display:flex;flex-direction:column;align-items:flex-start;gap:10px;flex-shrink:0}.import small{font-size:.75rem;color:var(--text-secondary)}.load-file{position:relative;overflow:hidden;padding:13px 20px;border-radius:var(--radius-sm);border:1px solid var(--accent);color:var(--accent);font-weight:500;cursor:pointer}.load-file:hover{background:var(--accent-glow)}.load-file:focus-within{outline:2px solid var(--accent);outline-offset:4px}.load-file input{position:absolute;inset:0;opacity:0;width:100%;cursor:pointer}.log-intro{padding-bottom:28px;color:var(--text-secondary);line-height:1.65;font-size:.9rem}.log-intro p+p{margin-top:8px}.session-log{list-style:none;padding:0;margin:0}.local-note,.import-error{padding:16px 20px;border:1px solid var(--border);margin-bottom:24px;line-height:1.6}.import-error{border-color:var(--rose)}.local-note button{margin-left:10px;background:none;border:0;font:inherit;text-decoration:underline;color:var(--accent);cursor:pointer}.empty{padding:30px 0;border-top:1px solid var(--border)}.empty p{margin-top:12px}a{color:var(--accent);text-underline-offset:4px}a:focus-visible,button:focus-visible{outline:2px solid var(--accent);outline-offset:4px}footer{display:flex;justify-content:space-between;flex-wrap:wrap;gap:18px;border-top:1px solid var(--border);margin-top:32px;padding:28px 0 36px;font-size:.8rem;color:var(--text-secondary)}@media(max-width:700px){.gym-shell{padding:0 20px}header{gap:16px}.brand span{font-size:1.1rem}header nav{gap:18px}header nav a{font-size:.8rem}.intro{flex-direction:column;align-items:flex-start;gap:24px;padding:34px 0 28px}.intro p{font-size:1rem}footer span{width:100%;order:3}}
</style>
