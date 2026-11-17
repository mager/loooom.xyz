<script lang="ts">
 import { resultLabel, type GymCase, type GymResult } from '$lib/gym/report';
 let { test, before, after, hasCandidate }: { test: GymCase; before?: GymResult; after?: GymResult; hasCandidate: boolean } = $props();
</script>

<details class="case">
 <summary>
  <span class="case-title">{test.title}<small>{test.split === 'holdout' ? 'Saved for the final test' : 'Used to test changes'}</small></span>
  <span class:failed={before?.passed === false} class:missing={!before} class="result">{resultLabel(before)}</span>
  <span class="arrow"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-5-5 5 5-5 5" /></svg></span>
  <span class:failed={after?.passed === false} class:missing={!after || !hasCandidate} class="result">{hasCandidate ? resultLabel(after) : '—'}</span>
  <svg class="open-hint" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5v14" /></svg>
 </summary>
 <div class="evidence">
  <h4>What we asked</h4><p class="prompt">{test.prompt}</p>
  <div class="responses">
   {#each [{ label: 'Before: AI answer', result: before }, ...(hasCandidate ? [{ label: 'After: AI answer', result: after }] : [])] as item}
    <section>
     <h4>{item.label}</h4>
     <!-- svelte-ignore a11y_no_noninteractive_tabindex (The scrollable text needs keyboard access.) -->
     <pre tabindex="0" role="region" aria-label={item.label}>{item.result?.response ?? 'No response saved.'}</pre>
     {#each item.result?.checks ?? [] as check}
      <div class="check"><strong class:failed={!check.pass}>{check.pass ? 'Pass' : 'Fail'}</strong><div><p>{check.criterion}</p><small>{check.reason}</small></div></div>
     {/each}
    </section>
   {/each}
  </div>
 </div>
</details>

<style>
 svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.5}
 .case { border-bottom: 1px solid var(--line); }
 summary { display: grid; grid-template-columns: minmax(0, 1fr) 70px 20px 80px 18px; gap: 12px; padding: 22px 0; align-items: center; cursor: pointer; list-style: none; }
 summary::-webkit-details-marker { display: none; }
 summary:hover .case-title { color: var(--lime); }
 pre:focus-visible, summary:focus-visible { outline: 2px solid var(--lime); outline-offset: 5px; }
 .case-title { font-weight: 500; font-size: 1.08rem; }
 small { display: block; color: var(--quiet); font-size: .82rem; font-weight: 400; line-height: 1.5; }
 .case-title small { margin-top: 5px; }
 .result { font-size: .85rem; font-weight: 600; color: var(--lime); }
 .missing { color: var(--quiet); }.failed { color: var(--failure); }
 .arrow, .open-hint { color: var(--quiet); }.arrow svg,.open-hint{width:100%;max-width:18px;height:18px;display:block}
 details[open] .open-hint { transform: rotate(45deg); }
 .evidence { padding-bottom: 28px; }
 h4 { font-size: .85rem; font-weight: 600; margin-bottom: 12px; }
 .prompt { color: var(--quiet); max-width: 72ch; line-height: 1.7; margin-bottom: 26px; }
 .responses { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 270px), 1fr)); gap: 24px; }
 section { min-width: 0; }
 pre { white-space: pre-wrap; overflow-wrap: anywhere; background: var(--code-bg); color: var(--code-text); border: 1px solid var(--line); padding: 18px; font-family: var(--font-display); font-size: .95rem; line-height: 1.7; border-radius: 8px; max-height: 430px; overflow: auto; scrollbar-color: var(--line-strong) var(--code-bg); }
 .check { display: grid; grid-template-columns: 32px 1fr; gap: 12px; margin-top: 18px; font-size: .85rem; line-height: 1.6; }
 .check strong { color: var(--lime); font-size: .75rem; }
 .check strong.failed { color: var(--failure); }
 .check small { margin-top: 5px; }
 @media(max-width: 600px) { summary { grid-template-columns: minmax(0,1fr) 43px 12px 52px 12px; gap: 6px; } .case-title { font-size: .95rem; } .result { font-size: .75rem; } .case-title small { font-size: .72rem; } }
</style>
