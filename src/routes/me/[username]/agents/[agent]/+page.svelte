<script lang="ts">
	import YarnLogo from '$lib/components/YarnLogo.svelte';
	import { marked } from 'marked';

	let { data } = $props();

	const { user, agentId, frontmatter: fm, body, rawUrl, injectionPrompt } = data;

	const displayName = fm.agent_id ?? agentId;
	const emoji = fm.emoji ?? '🤖';
	const role = fm.role ?? 'AI Agent';
	const model = fm.model ?? null;
	const channel = fm.channel ?? null;
	const updated = fm.updated ?? null;

	const renderedBody = marked.parse(body);

	let copiedRaw = $state(false);
	let copiedPrompt = $state(false);

	function copyRaw() {
		navigator.clipboard.writeText(`https://loooom.xyz${rawUrl}`);
		copiedRaw = true;
		setTimeout(() => (copiedRaw = false), 2000);
	}

	function copyPrompt() {
		navigator.clipboard.writeText(injectionPrompt);
		copiedPrompt = true;
		setTimeout(() => (copiedPrompt = false), 2000);
	}
</script>

<svelte:head>
	<title>{emoji} {displayName} — Agent Soul · Loooom</title>
	<meta name="description" content="{emoji} {displayName} — {role}. Agent soul by @{user.username} on Loooom." />
	<meta property="og:title" content="{emoji} {displayName} · Agent Soul" />
	<meta property="og:description" content="{role} · owned by @{user.username}" />
</svelte:head>

<div class="page">
	<!-- Nav -->
	<nav class="nav">
		<a href="/" class="logo-link">
			<YarnLogo size={28} />
		</a>
		<div class="nav-trail">
			<a href="/me/{user.username}" class="trail-link">@{user.username}</a>
			<span class="trail-sep">›</span>
			<span class="trail-current">{displayName}</span>
		</div>
	</nav>

	<main class="main">
		<!-- Hero -->
		<header class="hero">
			<div class="agent-emoji">{emoji}</div>
			<div class="agent-meta">
				<h1 class="agent-name">{displayName}</h1>
				<p class="agent-role">{role}</p>
				<div class="agent-badges">
					{#if model}
						<span class="badge badge-model">{model}</span>
					{/if}
					{#if channel}
						<span class="badge badge-channel">via {channel}</span>
					{/if}
					<span class="badge badge-owner">by <a href="/me/{user.username}" class="owner-link">@{user.username}</a></span>
				</div>
			</div>
		</header>

		<div class="layout">
			<!-- Soul content -->
			<article class="soul-body">
				{@html renderedBody}
			</article>

			<!-- Sidebar -->
			<aside class="sidebar">
				<div class="sidebar-card">
					<h3 class="sidebar-title">For AI Agents</h3>
					<p class="sidebar-hint">Fetch this soul to understand who you're working with.</p>

					<div class="endpoint-block">
						<span class="endpoint-label">Raw URL</span>
						<code class="endpoint-url">loooom.xyz{rawUrl}</code>
						<button class="copy-btn" onclick={copyRaw}>
							{copiedRaw ? '✓ Copied' : 'Copy URL'}
						</button>
					</div>

					<div class="endpoint-block">
						<span class="endpoint-label">Injection Prompt</span>
						<p class="endpoint-hint">Paste into any system prompt.</p>
						<button class="copy-btn" onclick={copyPrompt}>
							{copiedPrompt ? '✓ Copied' : 'Copy Prompt'}
						</button>
					</div>

					<div class="curl-block">
						<span class="endpoint-label">Fetch in terminal</span>
						<pre class="curl-cmd">curl loooom.xyz{rawUrl}</pre>
					</div>
				</div>

				{#if updated}
					<p class="updated-at">Updated {updated}</p>
				{/if}

				<a href="/me/{user.username}" class="back-link">← View @{user.username}'s ME.md</a>
			</aside>
		</div>
	</main>

	<footer class="footer">
		<p>Agent soul hosted on <a href="/">Loooom</a> · <a href="/me">ME.md standard</a></p>
	</footer>
</div>

<style>
	.page {
		min-height: 100vh;
		background: #faf6f0;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
		font-family: 'Outfit', sans-serif;
		color: #1a1209;
	}

	/* Nav */
	.nav {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem 2rem;
		border-bottom: 1px solid #e8ddd0;
	}
	.logo-link { display: flex; align-items: center; }
	.nav-trail {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: #8b7355;
	}
	.trail-link { color: #8b7355; text-decoration: none; }
	.trail-link:hover { color: #1a1209; }
	.trail-sep { color: #c4ad94; }
	.trail-current { color: #1a1209; font-weight: 500; }

	/* Main */
	.main {
		max-width: 960px;
		margin: 0 auto;
		padding: 2rem 1.5rem 4rem;
	}

	/* Hero */
	.hero {
		display: flex;
		align-items: flex-start;
		gap: 1.5rem;
		margin-bottom: 3rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid #e8ddd0;
	}
	.agent-emoji {
		font-size: 4rem;
		line-height: 1;
		flex-shrink: 0;
	}
	.agent-meta { flex: 1; }
	.agent-name {
		font-family: 'Playwrite IT Moderna', cursive;
		font-weight: 200;
		font-size: 2.25rem;
		line-height: 1.1;
		color: #1a1209;
		margin: 0 0 0.25rem;
		text-shadow: 1px 1px 0 rgba(139, 115, 85, 0.15);
	}
	.agent-role {
		font-size: 1rem;
		color: #6b5740;
		margin: 0 0 0.75rem;
		font-style: italic;
	}
	.agent-badges {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.badge {
		font-size: 0.75rem;
		padding: 0.2rem 0.6rem;
		border-radius: 9999px;
		font-family: 'Space Mono', monospace;
	}
	.badge-model { background: #1a1209; color: #faf6f0; }
	.badge-channel { background: #e8ddd0; color: #6b5740; }
	.badge-owner { background: #f0ebe3; color: #8b7355; }
	.owner-link { color: inherit; text-decoration: none; font-weight: 600; }
	.owner-link:hover { text-decoration: underline; }

	/* Layout */
	.layout {
		display: grid;
		grid-template-columns: 1fr 280px;
		gap: 3rem;
		align-items: start;
	}

	/* Soul body — rendered markdown */
	.soul-body :global(h1) {
		font-family: 'Playwrite IT Moderna', cursive;
		font-weight: 200;
		font-size: 1.5rem;
		color: #1a1209;
		margin: 2rem 0 0.75rem;
		padding-left: 0.75rem;
		border-left: 3px solid #c4937a;
		text-shadow: 1px 1px 0 rgba(139, 115, 85, 0.15);
	}
	.soul-body :global(h1:first-child) { margin-top: 0; }
	.soul-body :global(h2) {
		font-size: 1.1rem;
		font-weight: 600;
		color: #3d2e1e;
		margin: 1.5rem 0 0.5rem;
	}
	.soul-body :global(p) {
		line-height: 1.7;
		color: #3d2e1e;
		margin: 0 0 1rem;
	}
	.soul-body :global(strong) { color: #1a1209; }
	.soul-body :global(ul), .soul-body :global(ol) {
		padding-left: 1.5rem;
		margin: 0 0 1rem;
	}
	.soul-body :global(li) {
		line-height: 1.6;
		color: #3d2e1e;
		margin-bottom: 0.25rem;
	}
	.soul-body :global(code) {
		font-family: 'Space Mono', monospace;
		font-size: 0.85em;
		background: #f0ebe3;
		padding: 0.1em 0.3em;
		border-radius: 3px;
	}

	/* Sidebar */
	.sidebar { position: sticky; top: 1.5rem; }
	.sidebar-card {
		background: white;
		border: 1px solid #e8ddd0;
		border-radius: 12px;
		padding: 1.25rem;
		margin-bottom: 1rem;
	}
	.sidebar-title {
		font-size: 0.875rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #8b7355;
		margin: 0 0 0.5rem;
	}
	.sidebar-hint {
		font-size: 0.8rem;
		color: #8b7355;
		margin: 0 0 1rem;
		line-height: 1.5;
	}
	.endpoint-block {
		margin-bottom: 1.25rem;
	}
	.endpoint-label {
		display: block;
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #8b7355;
		margin-bottom: 0.35rem;
	}
	.endpoint-url {
		display: block;
		font-family: 'Space Mono', monospace;
		font-size: 0.7rem;
		color: #3d2e1e;
		background: #f8f4ef;
		padding: 0.4rem 0.6rem;
		border-radius: 6px;
		margin-bottom: 0.4rem;
		word-break: break-all;
	}
	.endpoint-hint {
		font-size: 0.75rem;
		color: #8b7355;
		margin: 0 0 0.4rem;
	}
	.copy-btn {
		width: 100%;
		padding: 0.5rem;
		background: #1a1209;
		color: #faf6f0;
		border: none;
		border-radius: 8px;
		font-size: 0.8rem;
		font-family: 'Space Mono', monospace;
		cursor: pointer;
		transition: background 0.15s;
	}
	.copy-btn:hover { background: #3d2e1e; }
	.curl-block { margin-top: 0.5rem; }
	.curl-cmd {
		font-family: 'Space Mono', monospace;
		font-size: 0.65rem;
		background: #1a1209;
		color: #a8e6a3;
		padding: 0.5rem 0.6rem;
		border-radius: 6px;
		overflow-x: auto;
		white-space: pre;
		margin: 0.35rem 0 0;
	}

	.updated-at {
		font-size: 0.75rem;
		color: #b0977a;
		text-align: center;
		margin-bottom: 0.75rem;
	}
	.back-link {
		display: block;
		text-align: center;
		font-size: 0.8rem;
		color: #8b7355;
		text-decoration: none;
	}
	.back-link:hover { color: #1a1209; text-decoration: underline; }

	/* Footer */
	.footer {
		text-align: center;
		padding: 2rem;
		border-top: 1px solid #e8ddd0;
		font-size: 0.8rem;
		color: #b0977a;
	}
	.footer a { color: #8b7355; text-decoration: none; }
	.footer a:hover { text-decoration: underline; }

	/* Mobile */
	@media (max-width: 700px) {
		.layout { grid-template-columns: 1fr; }
		.hero { flex-direction: column; gap: 1rem; }
		.agent-emoji { font-size: 3rem; }
		.agent-name { font-size: 1.75rem; }
		.sidebar { position: static; }
	}
</style>
