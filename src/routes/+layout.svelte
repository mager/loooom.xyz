<script lang="ts">
	import '../app.css';
	import ContextShell from '$lib/components/harness/ContextShell.svelte';
	import { inject } from '@vercel/analytics';

	inject();

	let { children, data } = $props();
</script>

<ContextShell user={data.user}>{@render children()}</ContextShell>
