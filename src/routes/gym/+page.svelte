<script lang="ts">
 import YarnLogo from '$lib/components/YarnLogo.svelte';
 import ThemeToggle from '$lib/components/ThemeToggle.svelte';
 import RunReport from '$lib/components/gym/RunReport.svelte';
 import { parseArtifact, type GymArtifact } from '$lib/gym/session';
 import ClimbReport from '$lib/components/gym/ClimbReport.svelte';
 let { data } = $props();
 let selectedId = $state('');
 let imported = $state<GymArtifact | null>(null);
 let error = $state('');
 let loading = $state(false);
 const reports = $derived(imported ? [imported, ...data.reports.filter(r => r.id !== imported?.id)] : data.reports);
 const selected = $derived(reports.find(r => r.id === selectedId) ?? reports.find(r => r.status === 'verified' && r.suite.id === 'focus-climb') ?? reports.find(r => r.status === 'verified') ?? reports.find(r => r.schemaVersion === 2) ?? reports[0]);
 const experimentLabel = (r: GymArtifact) => `${r.schemaVersion === 2 ? r.suite.skillName ?? r.suite.id : r.suite.id === 'absorb-regression' ? 'absorb' : r.suite.id} · ${r.suite.seededDefect ? 'controlled repair' : r.strategy === 'ablate' ? 'shorten' : 'original skill'}${r.schemaVersion === 2 ? ' · repeated trials' : ' · one pass'}`;
 async function loadFile(event: Event) {
  const input = event.currentTarget as HTMLInputElement;
  const file = input.files?.[0]; if (!file) return;
  loading = true; error = '';
  try {
   if (file.size > 2_000_000) throw new Error('This file is too large. Choose a gym JSON report smaller than 2 MB.');
   const report = parseArtifact(JSON.parse(await file.text()));
   imported = report; selectedId = report.id;
  } catch (e) { error = e instanceof SyntaxError ? 'This file is not valid JSON. Choose a report from loooom gym.' : e instanceof Error ? e.message : 'Could not read this file.'; }
  finally { loading = false; input.value = ''; }
 }
</script>

<svelte:head><title>Skills gym — Loooom</title><meta name="description" content="Test a skill, inspect a failure, and compare a repair or a shorter version. Real local runs with visible evidence." /></svelte:head>

<div class="gym-shell">
 <header><a href="/" class="brand" aria-label="Loooom home"><YarnLogo size={24} /><span>loooom</span></a><nav aria-label="Primary navigation"><a href="/browse">Skills</a><a href="/gym" aria-current="page">Gym</a><a href="/docs">Docs</a></nav><ThemeToggle /></header>
 <main>
  <div class="intro"><div><h1>Skills gym<span>.</span></h1><p>Test. Find the weak spot. Try again.</p></div><div class="import"><label class="load-file">{loading ? 'Reading report…' : 'Load run JSON'}<input type="file" accept=".json,application/json" onchange={loadFile} disabled={loading} /></label><small>Local file. Nothing is uploaded.</small></div></div>
  {#if error}<p class="import-error" role="alert">{error}</p>{/if}
  <div class="workspace">
   <aside class="experiments"><div class="mobile-picker"><label for="experiment">Experiment</label><select id="experiment" value={selected?.id} onchange={(event)=>selectedId=event.currentTarget.value}>{#each reports as report (report.id)}<option value={report.id}>{experimentLabel(report)}</option>{/each}</select></div><h2>Experiments</h2><nav aria-label="Gym experiments">{#each reports as report (report.id)}<button class:active={selected?.id === report.id} aria-pressed={selected?.id === report.id} onclick={() => selectedId = report.id}><span class="skill-name">{report.schemaVersion === 2 ? report.suite.skillName ?? report.suite.id : report.suite.id === 'absorb-regression' ? 'absorb' : report.suite.id}</span><span>{report.suite.seededDefect ? report.schemaVersion === 2 ? 'Repeated repair · controlled defect' : 'Repair · controlled defect' : report.schemaVersion === 2 ? `Hill climb · ${report.config.repetitions} trials per case` : report.strategy === 'ablate' ? 'Shorten · remove sections' : 'Repair · original skill'}</span>{#if imported?.id === report.id}<small>Local import</small>{/if}</button>{/each}</nav><div class="method"><h3>Train. Select. Verify.</h3><p>Repair uses failed examples. Shorten removes text. Each round must pass the same training checks.</p><p>The selected skill then gets fresh trials and held-out cases. These results never go back to the editor.</p><a href="https://github.com/mager/loooom/tree/codex/skills-gym/gym">Read the runner guide</a></div></aside>
   <div class="report">{#if selected}{#key selected.id}{#if selected.schemaVersion === 2}<ClimbReport run={selected} />{:else}<RunReport run={selected} />{/if}{/key}{:else}<div class="empty"><h2>Your first round starts locally.</h2><p>Use the <a href="https://github.com/mager/loooom/tree/codex/skills-gym/gym">source setup guide</a> to run a test, then load its JSON report here.</p></div>{/if}</div>
  </div>
 </main>
 <footer><a href="/">loooom</a><span>Small experiments. Visible evidence.</span><a href="https://github.com/mager/loooom">Runner source</a></footer>
</div>

<style>
 .gym-shell { max-width: 1240px; margin: 0 auto; padding: 0 40px; }
 header { min-height: 74px; display: flex; gap: 32px; align-items: center; border-bottom: 1px solid var(--border); }
 .brand { display: flex; align-items: center; gap: 10px; text-decoration: none; color: var(--text-primary); }.brand span { font-family: var(--font-handwriting); font-size: 1.5rem; }
 header nav { margin-left: auto; display: flex; gap: 30px; }header nav a { font-size: .9rem; color: var(--text-secondary); text-decoration: none; }header nav a[aria-current] { color: var(--accent); font-weight: 600; }
 .intro { display: flex; justify-content: space-between; gap: 30px; align-items: center; padding: 32px 0; }
 h1 { font-size: clamp(2.8rem,5vw,3.5rem); font-weight: 500; line-height: 1.08; letter-spacing: -.04em; }h1 span { color: var(--accent); }.intro p { color: var(--text-secondary); font-size: 1.15rem; margin-top: 16px; }
 .import { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }.import small { font-size: .75rem; color: var(--text-secondary); }
 .load-file { position: relative; overflow: hidden; padding: 13px 20px; border-radius: var(--radius-sm); border: 1px solid var(--accent); color: var(--accent); font-weight: 500; cursor: pointer; }.load-file:hover { background: var(--accent-glow); }.load-file:focus-within { outline: 2px solid var(--accent); outline-offset: 4px; }.load-file input { position: absolute; inset: 0; opacity: 0; width: 100%; cursor: pointer; }
 .workspace { display: grid; grid-template-columns: 220px minmax(0,1fr); gap: 52px; padding-top: 34px; border-top: 1px solid var(--border); }
 .mobile-picker { display: none; }
 .experiments h2 { font-size: .85rem; font-weight: 500; margin: 0 0 18px 14px; color: var(--text-secondary); }.experiments nav { display: flex; flex-direction: column; gap: 6px; }.experiments button { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; width: 100%; text-align: left; padding: 17px 14px; background: transparent; color: var(--text-secondary); border: 1px solid transparent; border-radius: var(--radius-sm); font-family: inherit; cursor: pointer; }.experiments button:hover { background: var(--bg-secondary); }.experiments button.active { background: var(--bg-card); color: var(--accent); border-color: var(--border); }.skill-name { font-size: 1.2rem; font-weight: 500; }.experiments button > span:nth-child(2) { font-size: .8rem; line-height: 1.4; }.experiments button small { font-size: .7rem; }
 .method { margin: 36px 14px 0; padding-top: 24px; border-top: 1px solid var(--border); }.method h3 { font-size: .9rem; font-weight: 500; }.method p { font-size: .85rem; line-height: 1.7; color: var(--text-secondary); margin-top: 12px; }.method a { display: inline-block; margin-top: 20px; font-size: .8rem; }
 .report { min-width: 0; }.empty { padding: 24px; background: var(--bg-secondary); }.empty p { margin-top: 16px; line-height: 1.7; }.import-error { color: var(--text-primary); padding: 16px 20px; border: 1px solid var(--rose); border-radius: var(--radius-sm); margin-bottom: 24px; line-height: 1.5; }
 a { color: var(--accent); text-underline-offset: 4px; }a:focus-visible, button:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; }
 footer { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 18px; border-top: 1px solid var(--border); margin-top: 64px; padding: 28px 0 36px; font-size: .8rem; color: var(--text-secondary); }
 @media(max-width:900px) { .gym-shell { padding: 0 24px; }.workspace { grid-template-columns: 180px minmax(0,1fr); gap: 28px; }.intro { padding-top: 40px; } }
 @media(max-width:700px) { .gym-shell { padding: 0 20px; }header { min-height: 74px; gap: 16px; }.brand span { font-size: 1.1rem; }header nav { gap: 18px; }header nav a { font-size: .8rem; }.intro { flex-direction: column; align-items: flex-start; gap: 24px; padding: 34px 0; }.intro p { font-size: 1rem; }.workspace { display: block; padding-top: 24px; }.experiments h2, .experiments nav { display: none; }.mobile-picker { display: flex; flex-direction: column; gap: 10px; }.mobile-picker label { color: var(--text-secondary); font-size: .8rem; }.mobile-picker select { width: 100%; min-width: 0; padding: 14px 10px; color: var(--text-primary); background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-sm); font: inherit; font-size: .85rem; }.mobile-picker select:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }.experiments button { min-width: 0; padding: 12px; }.experiments button:last-child { grid-column: 1 / -1; }.method { display: none; }.report { margin-top: 28px; }footer span { width: 100%; order: 3; } }
 @media(prefers-reduced-motion:no-preference) { .report { animation: enter .24s ease-out; } @keyframes enter { from { transform: translateY(5px); } to { transform: translateY(0); } } }
</style>
