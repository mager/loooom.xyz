<script lang="ts">
 import { tick } from 'svelte';
 import { sessionStory } from '$lib/gym/log';
 import type { ClimbSession } from '$lib/gym/session';
 import { weaveStages, weaveCases } from '$lib/gym/weave';
 import WeaveEvidence from './WeaveEvidence.svelte';
 let { sessions, importedId }: {sessions: ClimbSession[]; importedId?: string} = $props();
 let chosenId = $state('');
 let stageId = $state('final');
 let selected = $state<{caseId: string; repetition: number} | null>(null);
 const available = $derived(sessions.filter(s=>weaveStages(s).length));
 const run = $derived(available.find(s=>s.id===chosenId) ?? available.find(s=>s.strategy==='repair') ?? available[0]);
 const story = $derived(run ? sessionStory(run, run.id===importedId) : null);
 const stages = $derived(run ? weaveStages(run) : []);
 const stage = $derived(stages.find(s=>s.id===stageId) ?? stages[stages.length-1]);
 const rows = $derived(run && stage ? weaveCases(run,stage) : []);
 const selectedRow = $derived(rows.find(r=>r.test.id===selected?.caseId));
 const pair = $derived(selectedRow?.pairs.find(p=>p.repetition===selected?.repetition));
 const reduction = $derived(run && stage ? Math.round((1-stage.words/run.original.words)*100) : 0);
 function changeStage(id: string) { stageId=id; selected=null; }
 async function selectAnswer(caseId:string,repetition:number) {
  selected=selected?.caseId===caseId&&selected.repetition===repetition?null:{caseId,repetition};
  if(selected) { await tick(); document.getElementById('weave-answer-heading')?.focus({preventScroll:true}); document.getElementById('weave-answer-heading')?.scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}); }
 }
 function closeAnswer() {
  const active = selected;
  selected=null;
  if(active) document.getElementById(`weave-${run.id}-${active.caseId}-${active.repetition}-after`)?.focus();
 }
 const pos=(i:number,count:number,side:'before'|'after') => (side==='before'?10:70)+(count===1?10:i*20/(count-1));
</script>

{#snippet mark(passed: boolean | undefined)}
 <svg viewBox="0 0 20 20" aria-hidden="true">{#if passed===true}<path d="m5 10 3.3 3.3L15 6.5" />{:else if passed===false}<path d="m6 6 8 8M6 14l8-8" />{:else}<path d="M5 10h10" />{/if}</svg>
{/snippet}

{#if run && stage}
<section class="test-weave" aria-label="Explore recorded test results">
 <div class="session-tabs" role="group" aria-label="Choose a session">
  {#each available as session}<button aria-pressed={run.id===session.id} onclick={()=>{chosenId=session.id;stageId='final';selected=null;}}><span class="tab-name">{session.suite.skillName ?? session.suite.id}</span><span>{session.strategy==='repair'?'Repair':'Shorten'}{session.status!=='verified'?' · '+session.status:''}</span>{#if run.id===session.id}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-5-5 5 5-5 5" /></svg>{/if}</button>{/each}
 </div>
 <div class="experiment">
  <div class="experiment-story">
   <h2>{run.suite.skillName ?? run.suite.id}<span>{run.strategy==='repair'?'Repair a failed answer.':'Test a shorter skill.'}</span></h2>
   {#if run.suite.seededDefect}<p class="control-note">Deliberately added defect</p>{/if}
   <p class="purpose">{story?.problem}</p>
   <div class="stage-label">Choose a test round</div>
   <div class="stage-list">
    <div class="original-stage"><span class="node" aria-hidden="true"></span><span>Original</span><span class="words">{run.original.words} <small>words</small></span></div>
    {#each stages as item}<button class:active={stage.id===item.id} class:final={item.final} aria-pressed={stage.id===item.id} onclick={()=>changeStage(item.id)}><span class="node" class:rejected={item.outcome==='Not kept'} aria-hidden="true"></span><span>{item.label}<small>{item.outcome}</small></span><span class="words">{item.words}<small>words</small></span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-5-5 5 5-5 5" /></svg></button>{/each}
   </div>
   <a class="record-link" href={`#session-${run.id}`}>Read this session <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v15m-5-5 5 5 5-5" /></svg></a>
  </div>
  <div class="test-area">
   <div class="test-title"><h3>{stage.final?'Fresh final tests':`${stage.label} · training tests`}</h3><span>{stage.final?'Selected before testing':'Used to choose edits'}</span></div>
   <div class="matrix-head"><span>Question</span><div><span>Original <strong>{stage.before.score.passed}/{stage.before.score.total}</strong></span><span>Revised <strong>{stage.after.score.passed}/{stage.after.score.total}</strong></span></div></div>
   {#key `${run.id}-${stage.id}`}<div class="matrix" data-stage={`${run.id}-${stage.id}`}>
    {#each rows as row}
     <div class="test-row" class:inspecting={selected?.caseId===row.test.id}>
      <div class="question">{row.test.title}<span>{row.test.split==='holdout'?'Held out of editing':'Training question'}</span></div>
      <div class="pair-scroll"><div class="pairs" style={`min-width:${Math.max(250,row.pairs.length*100)}px`}>
       <svg class="threads" viewBox="0 0 360 64" preserveAspectRatio="none" aria-hidden="true">
        {#each row.pairs as p,i}<path class:selected={selected?.caseId===row.test.id&&selected.repetition===p.repetition} class:repaired={p.before?.passed===false&&p.after?.passed===true} class:failed={p.after?.passed===false} d={`M ${pos(i,row.pairs.length,'before')*3.6} 32 C 150 ${i%2===0?-8:72}, 210 ${i%2===0?72:-8}, ${pos(i,row.pairs.length,'after')*3.6} 32`} />{/each}
       </svg>
       {#each row.pairs as p,i}
        {#each ['before','after'] as side}
         {@const sample = side==='before'?p.before:p.after}
         <button id={`weave-${run.id}-${row.test.id}-${p.repetition}-${side}`} class="stitch" class:pass={sample?.passed===true} class:fail={sample?.passed===false} class:selected={selected?.caseId===row.test.id&&selected.repetition===p.repetition} style={`--x:${pos(i,row.pairs.length,side as 'before'|'after')}%`} aria-label={`${row.test.title}, answer ${p.repetition}, ${side==='before'?'original':'revised'}: ${sample ? sample.passed?'pass':'fail':'no result'}. Compare answers.`} aria-pressed={selected?.caseId===row.test.id&&selected.repetition===p.repetition} onclick={()=>selectAnswer(row.test.id,p.repetition)}>{@render mark(sample?.passed)}</button>
        {/each}
       {/each}
      </div></div>
     </div>
    {/each}
   </div>
   {/key}
   <div class="matrix-key"><span class="key-pass">{@render mark(true)}Pass</span><span class="key-fail">{@render mark(false)}Fail</span><span>Select a result to compare the two answers.</span></div>
   <div class="stage-result" aria-live="polite"><span>{stage.outcome==='Not kept'?'This cut was rejected.':run.strategy==='ablate'?`${reduction}% fewer words.`:stage.final&&run.status==='verified'?'The repair passed every final test.':'The repair was tested.'}</span><p>{stage.final ? (run.strategy==='ablate'&&stage.before.score.passed===stage.after.score.passed?'Both versions passed the same number of final tests.':'These are new responses, separate from the editing rounds.') : 'These responses informed the edit. They are not the final check.'}</p></div>
   <details class="edit-note"><summary>What changed</summary><p>{stage.final ? story?.change : run.rounds.find(r=>String(r.index)===stage.id)?.candidate?.rationale}</p></details>
  </div>
 </div>
 {#if selectedRow && pair}<WeaveEvidence test={selectedRow.test} repetition={pair.repetition} before={pair.before} after={pair.after} close={closeAnswer} />{/if}
 <div class="weave-foot"><span>{run.config.repetitions} answers per question · {run.runner.model}</span><span>AI-graded. A small test, not a guarantee.</span></div>
</section>
{/if}

<style>
 .test-weave{--weave-deep:#0b252d;--weave-ground:#10343d;--weave-text:#eff8f4;--weave-muted:#b6cece;--weave-pass:#8de2cf;--weave-fail:#ffb4a0;--weave-rule:#34545b;background:var(--weave-ground);color:var(--weave-text);border-radius:4px;overflow:clip;margin:12px 0 64px;font-weight:400;color-scheme:dark;isolation:isolate}.test-weave ::selection{background:var(--weave-pass);color:var(--weave-deep)}button,a{-webkit-tap-highlight-color:transparent}button{font:inherit}button:focus-visible,a:focus-visible{outline:2px solid var(--weave-pass);outline-offset:4px}button:disabled{opacity:.5;cursor:default}.session-tabs{display:flex;border-bottom:1px solid var(--weave-rule);background:var(--weave-deep);overflow-x:auto;scrollbar-color:var(--weave-rule) var(--weave-deep)}.session-tabs button{display:flex;align-items:center;gap:18px;min-width:220px;border:0;border-right:1px solid var(--weave-rule);background:transparent;color:var(--weave-muted);padding:20px 28px;cursor:pointer;position:relative}.session-tabs button[aria-pressed=true]{color:var(--weave-text);background:var(--weave-ground)}.session-tabs button[aria-pressed=true]:after{content:'';height:2px;background:var(--weave-pass);position:absolute;bottom:0;left:28px;right:28px}.tab-name{font-size:1.25rem;font-weight:500}.session-tabs button>span+span{font-size:.8rem}.session-tabs svg,.stage-list svg,.record-link svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.5;flex-shrink:0}.session-tabs svg{margin-left:auto}.experiment{display:grid;grid-template-columns:290px minmax(0,1fr)}.experiment-story{min-width:0;padding:32px 28px;border-right:1px solid var(--weave-rule)}h2{font-family:var(--font-handwriting);font-size:2.3rem;font-weight:400;line-height:1.25;margin-bottom:18px}h2 span{display:block;font-family:var(--font-display);font-size:1.05rem;line-height:1.5;margin-top:14px;font-weight:400}.control-note{font-size:.7rem;color:var(--weave-fail);margin:16px 0 10px}.purpose{font-size:.85rem;line-height:1.65;color:var(--weave-muted)}.stage-label{font-size:.75rem;color:var(--weave-muted);margin:26px 0 12px}.stage-list{position:relative}.stage-list:before{content:'';position:absolute;top:21px;bottom:34px;left:7px;width:1px;background:var(--weave-rule)}.original-stage,.stage-list button{position:relative;display:grid;grid-template-columns:16px 1fr auto 16px;gap:10px;align-items:center;min-height:56px;font-size:.85rem}.original-stage{color:var(--weave-muted);min-height:42px}.node{width:8px;height:8px;border-radius:50%;border:1px solid var(--weave-pass);background:var(--weave-ground);justify-self:center;z-index:1}.original-stage .node{border-color:var(--weave-muted)}.stage-list button{width:100%;background:none;border:0;text-align:left;color:var(--weave-text);cursor:pointer;padding:8px 0}.stage-list button:hover{color:var(--weave-pass)}.stage-list button small{display:block;font-size:.65rem;color:var(--weave-muted);margin-top:4px}.stage-list .words{text-align:right;font-family:var(--font-mono);font-size:.8rem;font-variant-numeric:tabular-nums}.words small{font-family:var(--font-display);font-size:.65rem;display:block}.stage-list .active .node{background:var(--weave-pass);outline:4px solid #8de2cf20}.stage-list .node.rejected{border-color:var(--weave-fail)}.stage-list .active .node.rejected{background:var(--weave-fail)}.stage-list button svg{opacity:0;transition:opacity .15s}.stage-list button.active svg{opacity:1}.stage-list button.final{border-top:1px dashed var(--weave-rule);margin-top:8px;padding-top:14px}.record-link{display:flex;gap:12px;align-items:center;font-size:.8rem;color:var(--weave-pass);margin-top:24px;text-underline-offset:4px}.record-link:hover{text-decoration:underline}.test-area{padding:28px 30px 24px;min-width:0}.test-title{display:flex;align-items:baseline;justify-content:space-between;gap:16px;margin-bottom:24px}h3{font-family:var(--font-display);font-size:1.1rem;font-weight:500;line-height:1.4}.test-title>span{color:var(--weave-muted);font-size:.7rem;line-height:1.5}.matrix-head,.test-row{display:grid;grid-template-columns:minmax(130px,.8fr) minmax(250px,1.5fr);gap:20px}.matrix-head{font-size:.75rem;color:var(--weave-muted);padding-bottom:12px;border-bottom:1px solid var(--weave-rule);align-items:end}.matrix-head>div{display:flex;justify-content:space-between;gap:12px;padding:0 4%}.matrix-head strong{display:block;font-family:var(--font-mono);font-size:1.2rem;font-weight:400;color:var(--weave-text);line-height:1.5;margin-top:4px}.matrix-head>div>span:last-child{text-align:right}.test-row{align-items:center;min-height:78px;border-bottom:1px solid var(--weave-rule);transition:background .2s}.test-row.inspecting{background:#8de2cf0a}.question{font-size:.85rem;line-height:1.4}.question>span{display:block;color:var(--weave-muted);font-size:.65rem;margin-top:7px}.pair-scroll{overflow-x:auto;scrollbar-color:var(--weave-rule) var(--weave-deep)}.pairs{height:68px;position:relative}.threads{width:100%;height:64px;position:absolute;inset:2px 0;overflow:visible;pointer-events:none}.threads path{fill:none;stroke:var(--weave-muted);stroke-width:1;opacity:.32;vector-effect:non-scaling-stroke;stroke-dasharray:550;stroke-dashoffset:0;transition:stroke-dashoffset .55s cubic-bezier(.16,1,.3,1),opacity .2s,stroke-width .2s}.threads path.repaired{stroke:var(--weave-pass);opacity:.65}.threads path.failed{stroke:var(--weave-fail);opacity:.55}.threads path.selected{opacity:1;stroke-width:2}.stitch{position:absolute;left:var(--x);top:50%;transform:translate(-50%,-50%);width:28px;height:28px;border:1px solid var(--weave-rule);border-radius:6px;background:var(--weave-ground);display:grid;place-items:center;cursor:pointer;color:var(--weave-muted);transition:background .2s,box-shadow .2s,border-color .2s;z-index:1}.stitch.pass{border-color:var(--weave-pass);color:var(--weave-pass);background:#194740}.stitch.fail{border-color:var(--weave-fail);color:var(--weave-fail);background:#4b3732}.stitch:hover,.stitch.selected{box-shadow:0 3px 10px #0005;border-color:var(--weave-text);background:var(--weave-deep)}.stitch.selected{outline:2px solid var(--weave-text);outline-offset:3px}.stitch svg{width:19px;height:19px;stroke:currentColor;stroke-width:1.5;fill:none}.matrix-key{display:flex;align-items:center;gap:16px;flex-wrap:wrap;font-size:.7rem;color:var(--weave-muted);line-height:1.5;margin-top:18px}.matrix-key>span{display:flex;align-items:center;gap:5px}.matrix-key svg{width:16px;height:16px;stroke:currentColor;stroke-width:1.5;fill:none}.key-pass{color:var(--weave-pass)}.key-fail{color:var(--weave-fail)}.matrix-key>span:last-child{margin-left:auto}.stage-result{margin-top:24px;padding-top:20px;border-top:1px solid var(--weave-rule)}.stage-result>span{font-size:1.1rem;color:var(--weave-pass);font-weight:500}.stage-result p{font-size:.8rem;line-height:1.6;color:var(--weave-muted);margin-top:7px}.weave-foot{display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap;border-top:1px solid var(--weave-rule);padding:16px 28px;font-size:.7rem;line-height:1.5;color:var(--weave-muted);background:var(--weave-deep)}
 .edit-note{margin-top:16px;font-size:.8rem;line-height:1.65}.edit-note summary{cursor:pointer;color:var(--weave-pass);padding:5px 0}.edit-note p{margin-top:10px;color:var(--weave-muted);max-width:70ch}.edit-note summary:focus-visible{outline:2px solid var(--weave-pass);outline-offset:4px}
 @starting-style{.threads path{stroke-dashoffset:550}}
 @media(min-width:1100px){.test-area{padding:32px 36px}.experiment{grid-template-columns:310px minmax(0,1fr)}}
 @media(max-width:900px){.experiment{grid-template-columns:230px minmax(0,1fr)}.experiment-story{padding:24px 20px}.test-area{padding:24px 20px}.matrix-head,.test-row{grid-template-columns:1fr;gap:0}.matrix-head>span{display:none}.test-row{padding-top:16px}.question>span{display:inline;margin-left:10px}.test-title{display:block}.test-title>span{display:block;margin-top:6px}.pairs{height:62px}.matrix-key>span:last-child{margin-left:0}.stitch{width:32px;height:32px}}
 @media(max-width:600px){.test-weave{margin-bottom:44px}.session-tabs button{min-width:50%;padding:18px;gap:12px}.session-tabs button[aria-pressed=true]:after{left:18px;right:18px}.session-tabs button>span+span{font-size:.75rem}.session-tabs svg{display:none}.experiment{grid-template-columns:minmax(0,1fr)}.experiment-story{border-right:0;border-bottom:1px solid var(--weave-rule);padding:24px 18px 18px}h2{font-size:2rem;margin-bottom:12px}h2 span{font-size:1.05rem;margin-top:10px}.control-note{margin:12px 0 8px}.purpose{font-size:.85rem}.stage-label{margin:22px 0 10px}.stage-list{display:flex;overflow-x:auto;gap:10px;padding:4px 3px 8px;scrollbar-color:var(--weave-rule) var(--weave-deep)}.stage-list:before,.original-stage,.stage-list .node,.stage-list svg{display:none}.stage-list button{width:auto;flex-shrink:0;display:block;padding:10px 14px;border:1px solid var(--weave-rule);min-width:92px}.stage-list button.active{border-color:var(--weave-pass);background:#8de2cf0a}.stage-list button.final{margin:0;padding:10px 14px;border:1px dashed var(--weave-rule)}.stage-list button.final.active{border-color:var(--weave-pass)}.stage-list .words{text-align:left;display:block;margin-top:8px}.stage-list .words small{display:inline;margin-left:5px}.record-link{margin-top:16px}.test-area{padding:24px 18px}.test-title{display:flex;gap:14px;margin-bottom:20px}.test-title>span{max-width:100px;margin:0;text-align:right}.matrix-key{gap:10px}.matrix-key>span:last-child{width:100%}.weave-foot{padding:16px 18px;gap:6px}.weave-foot>span{width:100%}.stitch{width:28px;height:28px}.question{font-size:.85rem}.question>span{display:block;margin:4px 0 0}.stage-result>span{font-size:1rem}}
 @media(prefers-reduced-motion:reduce){.threads path{transition:opacity .1s;stroke-dashoffset:0!important}.stitch,.test-row{transition:background .1s}}
</style>
