<script lang="ts">
 import { gymCommand, GYM_GUIDE } from '$lib/gym/commands';
 import CaseResult from './CaseResult.svelte';
 import { passed, type GymReport } from '$lib/gym/report';
 let { run }: { run: GymReport } = $props();
 let onlyFailures = $state(false);
 let copyState = $state('Copy command');
 const command = $derived(gymCommand('run',run.suite.id,run.runner.model));
 const visibleCases = $derived(run.suite.cases.filter(c => !onlyFailures || run.baseline.results.find(r => r.id === c.id)?.passed === false || run.candidate?.results.find(r => r.id === c.id)?.passed === false));
 const status = $derived(({ accepted: 'Candidate accepted', rejected: 'Candidate rejected', 'no-defect': 'No training defect found', error: 'Run interrupted', running: 'Partial report' })[run.status]);
 async function copyCommand() {
  try { await navigator.clipboard.writeText(command); copyState = 'Copied'; }
  catch { copyState = 'Select the command to copy'; }
 }
 function downloadCandidate() {
  if (!run.candidate) return;
  const url = URL.createObjectURL(new Blob([run.candidate.content], { type: 'text/markdown' }));
  const a = document.createElement('a'); a.href = url; a.download = `${run.suite.id}-candidate-SKILL.md`; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
 }
 function download() {
  const url = URL.createObjectURL(new Blob([JSON.stringify(run, null, 2)], { type: 'application/json' }));
  const a = document.createElement('a'); a.href = url; a.download = `${run.id}.json`; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
 }
</script>

<article>
 <div class="report-title"><div><h2>{run.suite.title}</h2><p>{run.suite.description}</p></div><span class="strategy">{run.strategy === 'repair' ? 'Repair' : 'Shorten'}</span></div>
 {#if run.suite.seededDefect}<aside class="notice"><strong>Controlled regression</strong><p>{run.suite.seededDefect}</p></aside>{/if}
 <section class="comparison" aria-label="Evaluation comparison">
  <div><h3>Original</h3><p class="score">{passed(run.baseline)}<span> / {run.suite.cases.length}</span></p><p class="metric-label">cases passed</p><p class="size">{run.baseline.words.toLocaleString()} words <code>{run.baseline.hash.slice(0, 8)}</code></p></div>
  <span class="join" aria-hidden="true">→</span>
  <div><h3>{run.candidate ? 'Candidate' : 'No candidate'}</h3>{#if run.candidate}<p class="score">{passed(run.candidate)}<span> / {run.suite.cases.length}</span></p><p class="metric-label">cases passed</p><p class="size">{run.candidate.words.toLocaleString()} words <code>{run.candidate.hash.slice(0, 8)}</code></p>{:else}<p class="no-candidate">{run.status === 'no-defect' ? 'Keep the original.' : 'Not available yet.'}</p>{/if}</div>
 </section>
 <div class="decision"><strong>{status}</strong><p>{run.decision?.reason ?? 'This file has incomplete results. Run the local command again to create a complete report.'}</p>{#if run.decision && run.strategy === 'ablate' && run.candidate}<p>{run.decision.wordsRemoved} words removed ({run.decision.reductionPercent}%).</p>{/if}</div>
 {#if run.error}<p role="alert" class="notice">{run.error}</p>{/if}
 <section class="tests" aria-labelledby="test-heading">
  <div class="section-head"><h3 id="test-heading">Test cases</h3><label><input type="checkbox" bind:checked={onlyFailures} /> Only failures</label></div>
  <div class="column-labels"><span>Open a case to inspect the evidence</span><span>Original</span><span aria-hidden="true"></span><span>Candidate</span><span aria-hidden="true"></span></div>
  {#each visibleCases as test (test.id)}<CaseResult {test} before={run.baseline.results.find(r => r.id === test.id)} after={run.candidate?.results.find(r => r.id === test.id)} hasCandidate={!!run.candidate} />{:else}<p class="empty">No failed cases in this report.</p>{/each}
 </section>
 <details class="skill-comparison"><summary>Compare skill text <span>{run.baseline.words} → {run.candidate?.words ?? run.baseline.words} words</span></summary>
  {#if run.candidate?.rationale}<p class="rationale">{run.candidate.rationale}</p>{/if}
  <div class="skill-columns">{#each [{label: 'Original', value: run.baseline}, ...(run.candidate ? [{label: 'Candidate', value: run.candidate}] : [])] as item}<section><h4>{item.label}</h4><!-- svelte-ignore a11y_no_noninteractive_tabindex (The scrollable text needs keyboard access.) -->
     <pre tabindex="0" role="region" aria-label={`${item.label} skill text`}>{item.value.content}</pre></section>{/each}</div>
 </details>
 <section class="reproduce" aria-labelledby="rerun-heading"><h3 id="rerun-heading">Run another round</h3><p>Use the available GitHub build with Node 22+ and a signed-in Codex CLI. Loooom 0.3.0 is not on npm yet. <a href={GYM_GUIDE}>Source setup guide</a>.</p><div class="command"><code>{command}</code><button onclick={copyCommand}>{copyState}</button></div><p class="local-note">Runs on your computer. This page does not start model calls.</p></section>
 <footer><p>{run.limitation}</p><dl><div><dt>Runner</dt><dd>{run.runner.version}</dd></div><div><dt>Model</dt><dd>{run.runner.model}</dd></div><div><dt>Run date</dt><dd>{new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'America/Chicago' }).format(new Date(run.startedAt))}</dd></div><div><dt>Suite hash</dt><dd><code title={run.suiteHash}>{run.suiteHash.slice(0, 12)}</code></dd></div></dl><p class="judge">Judge: {run.runner.judge}. Repetitions per case: {run.runner.repetitions}.</p><div class="footer-actions"><a href={run.suite.sourceUrl} target="_blank" rel="noreferrer">View pinned source</a><button onclick={download}>Download report</button>{#if run.candidate}<button onclick={downloadCandidate}>Download candidate</button>{/if}</div></footer>
</article>

<style>
 article { min-width: 0; }
 .report-title { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 26px; }
 h2 { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 500; line-height: 1.2; letter-spacing: -.025em; }
 .report-title p { color: var(--text-secondary); max-width: 60ch; line-height: 1.65; margin-top: 12px; }
 .strategy { border: 1px solid var(--border); border-radius: 30px; padding: 6px 14px; white-space: nowrap; font-size: .85rem; }
 .notice { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 16px 20px; line-height: 1.6; margin-bottom: 24px; overflow-wrap: anywhere; }
 .notice strong { font-size: .9rem; }.notice p { margin-top: 4px; font-size: .9rem; color: var(--text-secondary); }
 .comparison { display: grid; grid-template-columns: 1fr 40px 1fr; align-items: center; padding: 20px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); gap: 18px; }
 h3 { font-size: 1rem; font-weight: 500; }
 .score { font-size: 3rem; font-weight: 500; line-height: 1.2; margin-top: 12px; font-variant-numeric: tabular-nums; letter-spacing: -.04em; }
 .score span { font-size: 1.6rem; color: var(--text-secondary); font-weight: 300; letter-spacing: 0; }
 .metric-label { color: var(--text-secondary); font-size: .9rem; }
 .size { margin-top: 12px; font-size: .85rem; display: flex; flex-wrap: wrap; gap: 14px; color: var(--text-secondary); }
 code { font-family: var(--font-mono); font-size: .75rem; }
 .join { color: var(--accent); font-size: 1.8rem; }.no-candidate { margin-top: 20px; color: var(--text-secondary); }
 .decision { padding: 22px 0; }.decision strong { color: var(--accent); font-weight: 600; }.decision p { font-size: .95rem; color: var(--text-secondary); margin-top: 5px; line-height: 1.6; }
 .tests { margin-top: 24px; }.section-head { display: flex; justify-content: space-between; gap: 16px; align-items: center; margin-bottom: 18px; }
 .section-head h3, .reproduce h3 { font-size: 1.25rem; }label { display: flex; align-items: center; gap: 8px; font-size: .85rem; color: var(--text-secondary); cursor: pointer; min-height: 36px; }input { accent-color: var(--accent); }
 .column-labels { display: grid; grid-template-columns: minmax(0,1fr) 70px 20px 80px 18px; gap: 12px; color: var(--text-secondary); font-size: .75rem; border-bottom: 1px solid var(--border); padding-bottom: 12px; }
 .empty { padding: 28px 0; color: var(--text-secondary); }
 .skill-comparison { margin-top: 30px; border-bottom: 1px solid var(--border); padding-bottom: 24px; }summary { cursor: pointer; font-weight: 500; }summary span { color: var(--text-secondary); font-size: .85rem; margin-left: 16px; font-weight: 400; }
 .rationale { color: var(--text-secondary); line-height: 1.7; margin: 20px 0; }.skill-columns { display: grid; grid-template-columns: repeat(auto-fit,minmax(min(100%,270px),1fr)); gap: 20px; margin-top: 24px; }.skill-columns section { min-width: 0; }h4 { margin-bottom: 10px; font-size: .9rem; font-weight: 500; }pre { white-space: pre-wrap; overflow-wrap: anywhere; background: var(--bg-secondary); border-radius: var(--radius-sm); padding: 18px; font-size: .8rem; line-height: 1.7; max-height: 550px; overflow: auto; font-family: var(--font-mono); }
 .reproduce { margin: 40px 0; }.reproduce p { margin-top: 12px; line-height: 1.7; color: var(--text-secondary); max-width: 68ch; }
 .command { margin-top: 18px; padding: 16px; background: var(--bg-secondary); border-radius: var(--radius-sm); display: flex; align-items: center; gap: 20px; }.command code { flex: 1; overflow-wrap: anywhere; min-width: 0; line-height: 1.7; }.command button { white-space: nowrap; }.local-note { font-size: .8rem; }
 button { font: inherit; font-size: .85rem; cursor: pointer; padding: 9px 12px; border-radius: 6px; border: 1px solid var(--border); background: var(--bg-card); color: var(--text-primary); }button:hover { border-color: var(--accent); }a { color: var(--accent); text-underline-offset: 4px; }pre:focus-visible, button:focus-visible, summary:focus-visible, input:focus-visible, a:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; }
 footer { padding-top: 24px; border-top: 1px solid var(--border); color: var(--text-secondary); font-size: .85rem; line-height: 1.7; }footer > p { max-width: 75ch; }dl { display: flex; flex-wrap: wrap; gap: 16px 30px; margin: 24px 0 16px; }dt { font-size: .75rem; }dd { color: var(--text-primary); }.judge { font-size: .8rem; }.footer-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 24px; margin-top: 24px; }
 @media(max-width:600px) { .report-title { flex-direction: column-reverse; gap: 12px; }.comparison { grid-template-columns: 1fr 20px 1fr; gap: 10px; }.score { font-size: 2.8rem; }.size { gap: 5px; flex-direction: column; }.column-labels { grid-template-columns: minmax(0,1fr) 43px 12px 52px 12px; gap: 6px; font-size: .62rem; }.column-labels > span:first-child { max-width: 18ch; }.command { align-items: flex-start; flex-direction: column; }summary span { display: block; margin: 8px 0 0 16px; } }
</style>
