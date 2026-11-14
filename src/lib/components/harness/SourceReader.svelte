<script lang="ts">
 import Icon from './Icon.svelte';
 let {content,filename='AGENTS.md'}:{content:string;filename?:string}=$props();
 let copied=$state(false),copyError=$state('');
 async function copy(){try{await navigator.clipboard.writeText(content);copied=true;copyError='';}catch{copyError='Copy was blocked. Select the text below to copy it.';}}
 let lines=$derived(content.replace(/\r\n/g,'\n').replace(/\n$/,'').split('\n'));
</script>
<div class="source-reader"><div class="reader-toolbar"><span><Icon name="file" size={16}/>{filename}</span><button onclick={copy}><Icon name={copied?'check':'copy'} size={15}/>{copied?'Copied':'Copy file'}</button></div>{#if copyError}<p class="notice" role="status">{copyError}</p>{/if}<div class="source-lines" role="region" aria-label={`${filename} source`}>
 {#each lines as line,i}<div class="source-line" id={`L${i+1}`}><a href={`#L${i+1}`} aria-label={`Line ${i+1}`}>{i+1}</a><code class:heading={line.startsWith('#')} class:list={/^[-*] /.test(line)}>{line||' '}</code></div>{/each}
 </div></div>
<style>
 .source-reader{border:1px solid var(--line);border-radius:8px;overflow:hidden;background:var(--code-bg)}.reader-toolbar{display:flex;justify-content:space-between;align-items:center;padding:13px 18px;background:var(--code-toolbar);border-bottom:1px solid var(--line);gap:15px}.reader-toolbar>span{display:flex;gap:9px;align-items:center;font-family:'Space Mono',monospace;font-size:11px;color:var(--paper);overflow-wrap:anywhere}.reader-toolbar button{display:flex;gap:7px;align-items:center;border:1px solid var(--line-strong);color:var(--paper);background:none;padding:7px 10px;border-radius:4px;font-size:11px;white-space:nowrap}.reader-toolbar button:hover{color:var(--lime)}.source-lines{padding:22px 0;overflow-x:auto}.source-line{display:flex;gap:20px;min-height:25px;padding-right:22px;line-height:1.8}.source-line:target{background:var(--code-target)}.source-line>a{font-family:'Space Mono',monospace;font-size:11px;color:var(--code-line);width:48px;flex-shrink:0;text-align:right;user-select:none;position:sticky;left:0;background:var(--code-bg)}.source-line>code{font-family:'Space Mono',monospace;font-size:12px;color:var(--code-text);white-space:pre-wrap;overflow-wrap:anywhere;min-width:0}.source-line>code.heading{color:var(--lime);font-weight:700}.source-line>code.list{color:var(--code-list)}@media(max-width:760px){.source-line{gap:12px;padding-right:14px}.source-line>a{width:30px;font-size:10px}.source-line>code{font-size:11px}.reader-toolbar{padding:11px 13px}}
</style>
