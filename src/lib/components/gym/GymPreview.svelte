<script lang="ts">
 let { report }: {report: {name:string;status:string;originalWords:number;selectedWords:number;rounds:{index:number;words:number;passed:number;total:number;accepted:boolean}[];finalPassed:number|null;finalTotal:number|null}|null} = $props();
</script>
<div class="preview">
 <h2>{report?.name ?? 'A useful test.'}</h2>
 <div class="preview-top"><span>Skills gym</span><span>Saved experiment</span></div>
 {#if report}
 <p class="intro">{report.originalWords} words in. Every cut earns its place.</p>
 <div class="columns" aria-hidden="true"><span>Round</span><span>Words</span><span>Tests</span></div>
 {#each report.rounds as round}
 <div class="round"><span>{round.index}<small>{round.accepted?'Keep':'Reject'}</small></span><div class="word-count"><span>{round.words}</span><div class="bar" style={`--length: ${Math.max(3,round.words/report.originalWords*100)}%`} class:accepted={round.accepted}></div></div><strong>{round.passed}/{round.total}</strong></div>
 {/each}
 <div class="result"><span>{report.status==='verified'?'Passed fresh verification':report.status==='not-verified'?'Fresh verification failed':'Original kept'}</span><strong>{report.finalPassed!==null?`${report.finalPassed}/${report.finalTotal}`:'No winner'}</strong></div>
 <p class="footnote">Three trials per case. Held-out checks after selection. Small sample; model-graded.</p>
 {:else}<p class="intro">Test a skill. Read the failure. Try a repair or a shorter version. Keep the full record.</p><ol><li>Evaluate the original</li><li>Make one useful change</li><li>Verify with fresh trials</li></ol>{/if}
 <a href="/gym">Inspect the evidence <span aria-hidden="true">→</span></a>
</div>
<style>
 .preview{border-block:1px solid var(--border);padding:24px 0;min-width:0}.preview-top{display:flex;justify-content:space-between;gap:16px;font-size:.8rem;color:var(--text-secondary)}.preview-top>span:first-child{color:var(--accent);font-weight:500}h2{font-family:var(--font-handwriting);font-size:3.5rem;font-weight:400;line-height:1.1;margin:0 0 16px}.intro{color:var(--text-secondary);font-size:.95rem;line-height:1.6;margin:14px 0 24px}.columns,.round{display:grid;grid-template-columns:80px 1fr 52px;gap:20px;align-items:center}.columns{font-size:.7rem;color:var(--text-secondary);margin-bottom:10px}.round{padding:16px 0;border-top:1px solid var(--border);font-variant-numeric:tabular-nums}.round>span{font-size:1.25rem;display:flex;align-items:baseline;gap:10px}.round small{font-size:.75rem;color:var(--text-secondary)}.round strong{font-size:.95rem;font-weight:500}.word-count{min-width:0;font-size:.85rem}.bar{height:4px;width:var(--length);background:var(--text-secondary);margin-top:8px;opacity:.6}.bar.accepted{background:var(--accent);opacity:1}.result{display:flex;justify-content:space-between;gap:16px;align-items:center;background:var(--bg-secondary);padding:18px 14px;margin-top:12px;font-size:.85rem}.result strong{font-size:1.1rem;color:var(--accent);font-weight:500;white-space:nowrap}.footnote{font-size:.75rem;color:var(--text-secondary);line-height:1.6;margin-top:16px}a{display:flex;align-items:center;justify-content:space-between;color:var(--accent);font-weight:500;font-size:.9rem;margin-top:24px;padding:8px 0;text-decoration:none}a:hover{text-decoration:underline;text-underline-offset:5px}a:focus-visible{outline:2px solid var(--accent);outline-offset:4px}ol{padding-left:20px;line-height:2;color:var(--text-secondary)}@media(max-width:600px){.columns,.round{gap:14px}.preview{margin-top:10px}h2{font-size:3rem}}
</style>
