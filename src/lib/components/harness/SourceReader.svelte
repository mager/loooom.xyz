<script lang="ts">
 import Icon from './Icon.svelte';
 let {content,filename='AGENTS.md',emphasizeCopy=false}:{content:string;filename?:string;emphasizeCopy?:boolean}=$props();
 let copiedContent=$state<string|null>(null),copyError=$state('');
 let copied=$derived(copiedContent===content);
 async function copy(){
  const text=content;
  try{await navigator.clipboard.writeText(text);copiedContent=text;copyError='';}
  catch{copyError='Copy was blocked. Select the text below to copy it.';}
 }
 let lines=$derived(content.replace(/\r\n/g,'\n').replace(/\n$/,'').split('\n'));
 let pathParts=$derived(filename.split('/'));
</script>

<div class="source-reader" class:reading-view={emphasizeCopy}>
 <div class="reader-toolbar">
  <span class="reader-filename"><Icon name="file" size={16}/><span>{#each pathParts as part,i}<span class="path-part">{part}{i<pathParts.length-1?'/':''}</span><wbr/>{/each}</span></span>
  <button class:copy-primary={emphasizeCopy} onclick={copy}><Icon name={copied?'check':'copy'} size={15}/>{copied?'Copied':'Copy file'}</button>
  <span class="sr-only" role="status">{copied?'File copied to clipboard.':''}</span>
 </div>
 {#if copyError}<p class="notice" role="status">{copyError}</p>{/if}
 <div class="source-lines" role="region" aria-label={`${filename} source`}>
  {#each lines as line,i}
   <div class="source-line" id={`L${i+1}`}>
    <a href={`#L${i+1}`} aria-label={`Line ${i+1}`}>{i+1}</a>
    <code class:heading={line.startsWith('#')}>{line||' '}</code>
   </div>
  {/each}
 </div>
</div>

<style>
 .source-reader{border:1px solid var(--line);border-radius:6px;background:var(--code-bg)}
 .reader-toolbar{display:flex;justify-content:space-between;align-items:center;padding:10px 16px;background:var(--code-toolbar);border-bottom:1px solid var(--line);border-radius:5px 5px 0 0;gap:16px}
 .reader-filename{display:flex;gap:10px;align-items:center;font-family:'Space Mono',monospace;font-size:.75rem;color:var(--paper);min-width:0}
 .reader-filename>span{overflow-wrap:anywhere;min-width:0}
 .path-part{display:inline-block;max-width:100%}
 .reader-filename>:global(svg){color:var(--lime)}
 .reader-toolbar button{display:flex;gap:7px;align-items:center;justify-content:center;border:1px solid var(--line-strong);color:var(--paper);background:transparent;padding:8px 12px;min-height:36px;border-radius:4px;font-size:.8125rem;white-space:nowrap}
 .reader-toolbar button:hover{background:var(--panel-raised)}
 .reader-toolbar button.copy-primary{background:var(--action-bg);border-color:var(--action-bg);color:var(--action-ink);font-weight:500}
 .reader-toolbar button.copy-primary:hover{background:var(--action-hover)}
 .source-lines{padding:20px 0}
 .source-line{display:flex;gap:20px;min-height:26px;padding-right:24px;line-height:1.85;scroll-margin-block:80px}
 .source-line:target{background:var(--code-target);box-shadow:inset 3px 0 var(--lime)}
 .source-line>a{font-family:'Space Mono',monospace;font-size:.6875rem;line-height:2.36;color:var(--code-line);width:44px;flex-shrink:0;text-align:right;user-select:none;font-variant-numeric:tabular-nums}
 .source-line>code{font-family:'Space Mono',monospace;font-size:.875rem;color:var(--code-text);white-space:pre-wrap;overflow-wrap:anywhere;min-width:0;tab-size:4}
 .source-line>code.heading{color:var(--lime);font-weight:700}
 .reading-view .reader-toolbar{position:sticky;top:0;z-index:5}
 .sr-only{position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
 @media(max-width:760px){
  .source-line{gap:12px;padding-right:16px}
  .source-line>a{width:28px}
  .reader-toolbar{padding:8px 12px;gap:12px}
  .reader-toolbar button{min-height:44px;padding:8px 10px}
  .reader-filename{font-size:.6875rem;gap:8px}
 }
</style>
