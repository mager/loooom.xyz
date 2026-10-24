<script lang="ts">
 import { resultLabel, type GymCase, type GymResult } from '$lib/gym/report';
 let { test, before, after, hasCandidate }: { test: GymCase; before?: GymResult; after?: GymResult; hasCandidate: boolean } = $props();
</script>

<details class="case">
 <summary>
  <span class="case-title">{test.title}<small>{test.split === 'holdout' ? 'Saved for the final test' : 'Used to test changes'}</small></span>
  <span class:failed={before?.passed === false} class="result">{resultLabel(before)}</span>
  <span aria-hidden="true" class="arrow">→</span>
  <span class:failed={after?.passed === false} class="result">{hasCandidate ? resultLabel(after) : '—'}</span>
  <span class="open-hint" aria-hidden="true">+</span>
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
 .case { border-bottom: 1px solid var(--border); }
 summary { display: grid; grid-template-columns: minmax(0, 1fr) 70px 20px 80px 18px; gap: 12px; padding: 22px 0; align-items: center; cursor: pointer; list-style: none; }
 summary::-webkit-details-marker { display: none; }
 summary:hover .case-title { color: var(--accent); }
 pre:focus-visible, summary:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; }
 .case-title { font-weight: 500; font-size: 1.08rem; }
 small { display: block; color: var(--text-secondary); font-size: .82rem; font-weight: 400; line-height: 1.5; }
 .case-title small { margin-top: 5px; }
 .result { font-size: .85rem; font-weight: 600; color: var(--accent); }
 .failed { color: var(--text-primary); text-decoration: underline wavy; text-decoration-color: var(--rose); text-underline-offset: 5px; }
 .arrow, .open-hint { color: var(--text-secondary); }
 details[open] .open-hint { transform: rotate(45deg); }
 .evidence { padding-bottom: 28px; }
 h4 { font-size: .85rem; font-weight: 600; margin-bottom: 12px; }
 .prompt { color: var(--text-secondary); max-width: 72ch; line-height: 1.7; margin-bottom: 26px; }
 .responses { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 270px), 1fr)); gap: 24px; }
 section { min-width: 0; }
 pre { white-space: pre-wrap; overflow-wrap: anywhere; background: var(--bg-secondary); padding: 18px; font-family: var(--font-display); font-size: .95rem; line-height: 1.7; border-radius: var(--radius-sm); max-height: 430px; overflow: auto; }
 .check { display: grid; grid-template-columns: 32px 1fr; gap: 12px; margin-top: 18px; font-size: .85rem; line-height: 1.6; }
 .check strong { color: var(--accent); font-size: .75rem; }
 .check strong.failed { color: var(--text-primary); }
 .check small { margin-top: 5px; }
 @media(max-width: 600px) { summary { grid-template-columns: minmax(0,1fr) 43px 12px 52px 12px; gap: 6px; } .case-title { font-size: .95rem; } .result { font-size: .75rem; } .case-title small { font-size: .72rem; } }
</style>
