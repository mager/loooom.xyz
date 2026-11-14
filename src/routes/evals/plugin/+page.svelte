<script lang="ts">import ContextShell from '$lib/components/harness/ContextShell.svelte';import SourceReader from '$lib/components/harness/SourceReader.svelte';let {data}=$props();</script>
<svelte:head><title>Context eval plugin guide — Loooom</title></svelte:head>
<ContextShell><div class="page-intro"><a class="back-link" href="/evals">Back to personal evals</a><h1>Context eval guide.</h1><p>Run from source. The package is not yet published.</p></div><SourceReader content={data.guide} filename="context-evals / README.md"/></ContextShell>
