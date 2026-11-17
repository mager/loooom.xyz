<script lang="ts">
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
	<div class="page-trail">
		<div class="nav-trail">
			<a href="/me/{user.username}" class="trail-link">@{user.username}</a>
			<span class="trail-sep">›</span>
			<span class="trail-current">{displayName}</span>
		</div>
	</div>

	<div class="main">
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
				<a href="/me" class="back-link">ME.md standard</a>
			</aside>
		</div>
	</div>

</div>

<style>
.page { color: var(--paper); min-width: 0; padding: 32px 0 64px; }
	.page-trail { margin-bottom: 28px; }
	.nav-trail { display: flex; flex-wrap: wrap; gap: 10px; color: var(--quiet); font-size: 14px; overflow-wrap: anywhere; }
	.trail-link { color: var(--lime); }
	.trail-link:hover { text-decoration: underline; }
	.trail-current { color: var(--paper); }
	.hero { display: flex; align-items: flex-start; gap: 24px; padding-bottom: 32px; margin-bottom: 32px; border-bottom: 1px solid var(--line); }
	.agent-emoji { font-size: 48px; line-height: 1.2; flex-shrink: 0; }
	.agent-meta { min-width: 0; flex: 1; }
	.agent-name { font-size: clamp(36px, 4vw, 60px); font-weight: 500; line-height: 1.05; letter-spacing: -.035em; margin: 0 0 16px; overflow-wrap: anywhere; }
	.agent-role { font-size: 18px; line-height: 1.6; color: var(--quiet); margin: 0 0 20px; }
	.agent-badges { display: flex; flex-wrap: wrap; gap: 8px; }
	.badge { font-family: 'Space Mono', monospace; font-size: 10px; padding: 4px 8px; border: 1px solid var(--line); border-radius: 4px; color: var(--quiet); background: var(--panel); overflow-wrap: anywhere; }
	.badge-model { color: var(--lime); background: var(--accent-soft); border-color: var(--accent-border); }
	.owner-link { color: var(--paper); }
	.owner-link:hover { text-decoration: underline; }
	.layout { display: grid; grid-template-columns: minmax(0, 1fr) 280px; gap: 40px; align-items: start; }
	.soul-body { min-width: 0; overflow-wrap: anywhere; }
	.soul-body :global(h1), .soul-body :global(h2), .soul-body :global(h3) { font-size: 26px; font-weight: 500; line-height: 1.25; margin: 32px 0 16px; color: var(--paper); }
	.soul-body :global(h1:first-child), .soul-body :global(h2:first-child), .soul-body :global(h3:first-child) { margin-top: 0; }
	.soul-body :global(h3) { font-size: 22px; }
	.soul-body :global(p), .soul-body :global(ul), .soul-body :global(ol) { font-size: 15px; line-height: 1.75; color: var(--quiet); margin: 0 0 16px; max-width: 72ch; }
	.soul-body :global(ul), .soul-body :global(ol) { padding-left: 24px; }
	.soul-body :global(li) { margin-bottom: 6px; }
	.soul-body :global(strong) { color: var(--paper); font-weight: 500; }
	.soul-body :global(a) { color: var(--lime); text-decoration: underline; }
	.soul-body :global(code) { font-family: 'Space Mono', monospace; font-size: .82em; color: var(--code-text); background: var(--code-toolbar); padding: 2px 5px; border-radius: 4px; }
	.soul-body :global(pre) { background: var(--code-bg); border: 1px solid var(--line); border-radius: 8px; padding: 20px; max-width: 100%; overflow-x: auto; margin: 20px 0; }
	.soul-body :global(pre code) { background: none; padding: 0; font-size: 12px; line-height: 1.8; }
	.soul-body :global(blockquote) { border-left: 1px solid var(--line-strong); margin: 20px 0; padding-left: 20px; color: var(--quiet); }
	.soul-body :global(img) { max-width: 100%; height: auto; }
	.soul-body :global(table) { display: block; max-width: 100%; width: max-content; overflow-x: auto; border-collapse: collapse; font-size: 14px; margin: 20px 0; }
	.soul-body :global(th), .soul-body :global(td) { border: 1px solid var(--line); padding: 10px 14px; color: var(--quiet); text-align: left; }
	.soul-body :global(th) { background: var(--panel-raised); color: var(--paper); font-weight: 500; }
	.sidebar { min-width: 0; position: sticky; top: 24px; }
	.sidebar-card { border: 1px solid var(--line); border-radius: 8px; background: var(--panel); padding: 20px; margin-bottom: 20px; }
	.sidebar-title { font-size: 20px; font-weight: 500; margin: 0 0 12px; }
	.sidebar-hint { font-size: 14px; color: var(--quiet); line-height: 1.7; margin: 0 0 24px; }
	.endpoint-block { margin-bottom: 24px; }
	.endpoint-label { display: block; color: var(--paper); font-size: 13px; margin-bottom: 10px; }
	.endpoint-url { display: block; font-family: 'Space Mono', monospace; font-size: 11px; line-height: 1.8; color: var(--code-text); background: var(--code-bg); padding: 10px 12px; border: 1px solid var(--line); border-radius: 6px; overflow-wrap: anywhere; margin-bottom: 12px; }
	.endpoint-hint { color: var(--quiet); font-size: 13px; line-height: 1.6; margin: 0 0 12px; }
	.copy-btn { width: 100%; min-height: 46px; padding: 12px 16px; color: var(--action-ink); background: var(--action-bg); border: 1px solid var(--action-bg); border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer; transition: background .2s; }
	.copy-btn:hover { background: var(--action-hover); color: var(--action-ink); }
	.curl-cmd { font-family: 'Space Mono', monospace; font-size: 11px; line-height: 1.8; color: var(--code-text); background: var(--code-bg); border: 1px solid var(--line); border-radius: 6px; padding: 12px; margin: 0; overflow-x: auto; white-space: pre; }
	.updated-at { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--quiet); margin: 0 0 16px; overflow-wrap: anywhere; }
	.back-link { display: block; color: var(--lime); font-size: 14px; line-height: 1.7; margin-top: 12px; }
	.back-link:hover { text-decoration: underline; }
	@media (max-width: 1100px) { .layout { grid-template-columns: minmax(0, 1fr); gap: 32px; } .sidebar { position: static; } }
	@media (max-width: 600px) {
		.hero { flex-direction: column; gap: 16px; }
		.agent-emoji { font-size: 36px; }
		.soul-body :global(pre code) { font-size: 11px; }
		.soul-body :global(pre) { padding: 16px; }
	}
</style>
