<script lang="ts">
 import type { GymCase } from '$lib/gym/report';
 import type { Sample } from '$lib/gym/session';
 let { test, repetition, before, after, close }: {test: GymCase; repetition: number; before?: Sample; after?: Sample; close: () => void} = $props();
</script>
<section class="answer-evidence" aria-label={`Answer ${repetition}: ${test.title}`}>
 <div class="evidence-heading"><h3 id="weave-answer-heading" tabindex="-1">{test.title} <span>Answer {repetition}</span></h3><button onclick={close} aria-label="Close answer comparison"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg></button></div>
 <p class="prompt">{test.prompt}</p>
 <div class="answers">
  {#each [{label:'Original',sample:before},{label:'Revised',sample:after}] as item}
   <section><h4>{item.label}<span class:failed={item.sample?.passed===false}>{item.sample ? item.sample.passed?'Pass':'Fail':'No answer'}</span></h4>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex (Saved responses are scrollable evidence.) -->
    <pre tabindex="0" role="region" aria-label={`${item.label} answer`}>{item.sample?.response ?? 'No response saved.'}</pre>
    <details><summary>Grading reasons <span>{item.sample?.checks.filter(c=>c.pass).length ?? 0}/{item.sample?.checks.length ?? 0} checks passed</span></summary>
     {#each item.sample?.checks ?? [] as check}<div class="criterion"><strong class:failed={!check.pass}>{check.pass?'Pass':'Fail'}</strong><div><p>{check.criterion}</p><small>{check.reason}</small></div></div>{/each}
    </details>
   </section>
  {/each}
 </div>
</section>
<style>
 .answer-evidence{border-top:1px solid var(--weave-rule);padding:26px 30px 30px;background:var(--weave-deep);color:var(--weave-text)}.evidence-heading{display:flex;gap:16px;align-items:start;justify-content:space-between}h3,h4{font-family:var(--font-display);font-weight:500}h3{scroll-margin-top:24px;font-size:1.15rem;line-height:1.4}h3 span{font-size:.8rem;color:var(--weave-muted);margin-left:10px}.evidence-heading button{padding:6px;background:transparent;border:1px solid var(--weave-rule);color:var(--weave-text);cursor:pointer;border-radius:50%}.evidence-heading svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.5;display:block}.prompt{font-size:.9rem;line-height:1.65;max-width:72ch;margin:16px 0 24px;color:var(--weave-muted)}.answers{display:grid;grid-template-columns:1fr 1fr;gap:28px}.answers section{min-width:0}h4{display:flex;align-items:center;justify-content:space-between;font-size:.9rem;margin-bottom:12px}h4 span,.criterion strong{color:var(--weave-pass);font-size:.75rem}.failed{color:var(--weave-fail)!important}pre{font-family:var(--font-display);font-size:.9rem;line-height:1.7;white-space:pre-wrap;overflow-wrap:anywhere;max-height:280px;overflow:auto;padding:18px;border:1px solid var(--weave-rule);scrollbar-color:var(--weave-muted) var(--weave-deep)}summary{cursor:pointer;line-height:1.5;padding:16px 0;font-size:.85rem}summary span{font-size:.75rem;color:var(--weave-muted);margin-left:8px}.criterion{display:grid;grid-template-columns:32px 1fr;gap:12px;margin:12px 0 20px;font-size:.85rem;line-height:1.6}.criterion small{display:block;margin-top:6px;color:var(--weave-muted);font-size:.8rem}button:focus-visible,pre:focus-visible,summary:focus-visible{outline:2px solid var(--weave-pass);outline-offset:4px}@media(max-width:600px){.answer-evidence{padding:22px 18px}.answers{grid-template-columns:1fr;gap:26px}h3 span{display:block;margin:6px 0 0}}
</style>
