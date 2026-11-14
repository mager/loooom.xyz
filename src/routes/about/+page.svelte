<script lang="ts">
 import ContextShell from '$lib/components/harness/ContextShell.svelte';
 import Icon from '$lib/components/harness/Icon.svelte';
</script>

<svelte:head><title>About — Loooom</title><meta name="description" content="Share AGENTS.md. Try other working rules, with optional personal and design context."/></svelte:head>

<ContextShell>
 <div class="page-intro"><h1>About <span>Loooom.</span></h1><p>Share your AGENTS.md. See how others work with agents.</p></div>
 <div class="about-content">
  <section><h2>AGENTS.md comes first.</h2><p>Share your working rules. Other Markdown context is optional.</p><dl><div><dt>AGENTS.md</dt><dd>Your working rules, tools, and boundaries.</dd></div><div><dt>ME.md</dt><dd>The personal context you choose to share.</dd></div><div><dt>SOUL.md</dt><dd>Character and voice. Borrow ideas, not an identity.</dd></div><div><dt>DESIGN.md</dt><dd>Design rules and visual standards.</dd></div></dl></section>
  <section><h2>GitHub is the source.</h2><p>Snapshots keep the source, commit, date, and hash. Owners and sharers get separate credit. Curated authors may not have a Loooom account.</p><div class="about-links"><a class="text-link" href="https://github.com/mager/loooom.xyz" target="_blank" rel="noreferrer"><Icon name="github" size={16}/>Source code <Icon name="external" size={13}/></a><a class="text-link" href="/me/spec">ME.md spec <Icon name="arrow" size={16}/></a></div></section>
  <section class="about-maker"><h2>Test the fit.</h2><p>Personal evals compare answers with and without your files. Synthetic examples are labeled. A passing check is not a general quality score.</p><p>Skills and the Gym are still here. Built by <a href="https://x.com/mager" target="_blank" rel="noreferrer">@mager</a>.</p><div class="about-links"><a class="text-link" href="/evals">Personal evals <Icon name="arrow" size={16}/></a><a class="text-link" href="/browse">Skills <Icon name="arrow" size={16}/></a><a class="text-link" href="/gym">The Gym <Icon name="arrow" size={16}/></a></div></section>
 </div>
</ContextShell>

<style>
 .page-intro h1 span{color:var(--lime)}.about-content{max-width:74ch}.about-content section{border-top:1px solid var(--line);padding:30px 0 34px}.about-content h2{margin:0 0 17px}.about-content p{color:var(--quiet);line-height:1.8;margin:0 0 17px}.about-content dl{margin:25px 0 0}.about-content dl>div{display:grid;grid-template-columns:135px 1fr;gap:22px;padding:15px 0;border-top:1px solid var(--line)}.about-content dt{font-family:'Space Mono',monospace;font-size:12px;color:var(--lime)}.about-content dd{margin:0;color:var(--quiet);font-size:14px}.about-content .text-link,.about-maker p>a{color:var(--lime)}.about-links{display:flex;gap:20px;flex-wrap:wrap;margin-top:22px}@media(max-width:500px){.about-content dl>div{grid-template-columns:1fr;gap:7px}.about-content section{padding:25px 0}.about-content p{font-size:14px}.about-links{gap:15px}}
</style>
