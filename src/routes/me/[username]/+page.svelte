<script lang="ts">
	import YarnLogo from '$lib/components/YarnLogo.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { marked } from 'marked';
	import { generateInjectionPrompt } from '$lib/memd';

	let { data } = $props();

	const { user, parsed, rawUrl } = data;
	const { frontmatter, sections } = parsed;

	let copiedPrompt = $state(false);
	let copiedRaw = $state(false);
	let activeSection = $state<string | null>(sections[0]?.id ?? null);

	const injectionPrompt = generateInjectionPrompt(
		frontmatter.handle,
		`https://loooom.xyz${rawUrl}`
	);

	function copyPrompt() {
		navigator.clipboard.writeText(injectionPrompt);
		copiedPrompt = true;
		setTimeout(() => (copiedPrompt = false), 2000);
	}

	function copyRaw() {
		navigator.clipboard.writeText(`https://loooom.xyz${rawUrl}`);
		copiedRaw = true;
		setTimeout(() => (copiedRaw = false), 2000);
	}

	function renderMarkdown(md: string): string {
		return marked(md) as string;
	}

	function scrollTo(id: string) {
		activeSection = id;
		document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	// Section icon map
	const SECTION_ICONS: Record<string, string> = {
		'the-soul': '🫀',
		'the-heart': '💛',
		'the-fleet': '🤖',
		'the-stack': '⚙️',
		'anti-patterns': '🚫',
		'context': '📍',
		'the-lore': '📖'
	};

	function sectionIcon(id: string, existingIcon?: string): string {
		return existingIcon ?? SECTION_ICONS[id] ?? '📄';
	}
</script>

<svelte:head>
	<title>{frontmatter.handle} — ME.md</title>
	<meta name="description" content="{frontmatter.name ?? user.username}'s Portable Human Context on Loooom" />
</svelte:head>

<div class="ambient">
	<div class="orb orb-1"></div>
	<div class="orb orb-2"></div>
</div>

<!-- Nav -->
<nav>
	<div class="nav-inner">
		<a href="/" class="logo">
			<YarnLogo size={22} />
			<span class="logo-text">loooom</span>
		</a>
		<div class="nav-center">
			<span class="breadcrumb">ME.md</span>
			<span class="breadcrumb-sep">/</span>
			<span class="breadcrumb-handle">{frontmatter.handle}</span>
		</div>
		<div class="nav-right">
			<ThemeToggle />
			<a href="/me/{user.username}/raw" class="btn-ghost-sm" target="_blank">raw ↗</a>
			<a href="/u/{user.username}" class="btn-nav">Skills</a>
		</div>
	</div>
</nav>

<!-- Layout: sidebar + content -->
<div class="layout">

	<!-- Sidebar -->
	<aside class="sidebar">
		<!-- Identity card -->
		<div class="identity-card">
			<div class="avatar">
				{#if user.avatarUrl}
					<img src={user.avatarUrl} alt={user.displayName} />
				{:else}
					<span class="avatar-letter">{(frontmatter.name ?? user.username)[0].toUpperCase()}</span>
				{/if}
			</div>
			<div class="identity-meta">
				<h2 class="handle">{frontmatter.handle}</h2>
				{#if frontmatter.name}
					<p class="real-name">{frontmatter.name}</p>
				{/if}
				{#if frontmatter.location}
					<p class="location">📍 {frontmatter.location}</p>
				{/if}
				{#if frontmatter.timezone}
					<p class="timezone">🕐 {frontmatter.timezone}</p>
				{/if}
			</div>
		</div>

		<!-- Tags -->
		{#if frontmatter.tags && frontmatter.tags.length > 0}
			<div class="sidebar-block">
				<h4 class="sidebar-label">Tags</h4>
				<div class="tags">
					{#each frontmatter.tags as tag}
						<span class="tag">{tag}</span>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Agent Fleet -->
		{#if frontmatter.agents && frontmatter.agents.length > 0}
			<div class="sidebar-block">
				<h4 class="sidebar-label">Agent Fleet</h4>
				<div class="agents">
					{#each frontmatter.agents as agent}
						<div class="agent-card">
							<span class="agent-emoji">{agent.emoji ?? '🤖'}</span>
							<div class="agent-info">
								<span class="agent-id">{agent.id}</span>
								{#if agent.role}
									<span class="agent-role">{agent.role}</span>
								{/if}
								{#if agent.model}
									<span class="agent-model">{agent.model}</span>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Section nav -->
		{#if sections.length > 0}
			<div class="sidebar-block">
				<h4 class="sidebar-label">Sections</h4>
				<nav class="section-nav">
					{#each sections as section}
						<button
							class="section-nav-item"
							class:active={activeSection === section.id}
							onclick={() => scrollTo(section.id)}
						>
							<span class="nav-icon">{sectionIcon(section.id, section.icon)}</span>
							<span class="nav-title">{section.title}</span>
						</button>
					{/each}
				</nav>
			</div>
		{/if}

		<!-- Actions -->
		<div class="sidebar-block">
			<h4 class="sidebar-label">Use this context</h4>
			<div class="actions">
				<button class="action-btn" onclick={copyPrompt}>
					{copiedPrompt ? '✓ Copied!' : '⚡ Copy injection prompt'}
				</button>
				<button class="action-btn action-btn-secondary" onclick={copyRaw}>
					{copiedRaw ? '✓ Copied!' : '🔗 Copy raw URL'}
				</button>
				<a href="/me/{user.username}/raw" target="_blank" class="action-link">
					View raw markdown ↗
				</a>
			</div>
		</div>

		<!-- Version / metadata -->
		<div class="sidebar-meta">
			<span class="meta-badge">ME.md v{frontmatter.version}</span>
			{#if frontmatter.updated}
				<span class="meta-updated">Updated {frontmatter.updated}</span>
			{/if}
		</div>
	</aside>

	<!-- Main content -->
	<main class="content">
		<!-- Header -->
		<div class="content-header">
			<h1 class="content-title">
				<span class="title-handle">{frontmatter.handle}</span>
				<span class="title-suffix">'s context</span>
			</h1>
			<p class="content-tagline">Portable Human Context · ME.md v{frontmatter.version}</p>
		</div>

		<!-- Sections -->
		{#each sections as section}
			<div id="section-{section.id}" class="section-block" data-section={section.id}>
				<div class="section-header">
					{#if section.icon}
						<span class="section-h-icon">{section.icon}</span>
					{/if}
					<h2 class="section-h2">{section.title}</h2>
				</div>
				<div class="section-body prose">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html renderMarkdown(section.content)}
				</div>
			</div>
		{/each}

		<!-- Injection prompt panel -->
		<div class="injection-panel">
			<div class="injection-header">
				<h3>⚡ Injection Prompt</h3>
				<p>Paste into any AI system prompt to load this context automatically.</p>
			</div>
			<pre class="injection-code">{injectionPrompt}</pre>
			<button class="copy-prompt-btn" onclick={copyPrompt}>
				{copiedPrompt ? '✓ Copied!' : 'Copy prompt'}
			</button>
		</div>
	</main>
</div>

<style>
	/* ─── Ambient ─────────────────────────────────────────────────────────── */
	.ambient {
		position: fixed; inset: 0;
		pointer-events: none; z-index: 0; overflow: hidden;
	}
	.orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.12; }
	.orb-1 {
		width: 500px; height: 500px;
		background: radial-gradient(circle, var(--violet) 0%, transparent 70%);
		top: -100px; right: -100px;
	}
	.orb-2 {
		width: 400px; height: 400px;
		background: radial-gradient(circle, var(--ocean) 0%, transparent 70%);
		bottom: 20%; left: -100px;
	}

	/* ─── Nav ────────────────────────────────────────────────────────────── */
	nav {
		position: sticky; top: 0; z-index: 100;
		background: var(--nav-bg); backdrop-filter: blur(12px);
		border-bottom: 1px solid var(--border);
	}
	.nav-inner {
		max-width: 1300px; margin: 0 auto;
		padding: 12px 32px;
		display: flex; align-items: center; justify-content: space-between;
	}
	.logo {
		display: flex; align-items: center; gap: 8px;
		text-decoration: none; color: var(--text-primary);
		flex-shrink: 0;
	}
	.logo-text { font-family: var(--font-handwriting); font-size: 1.1rem; font-weight: 200; }
	.nav-center {
		display: flex; align-items: center; gap: 8px;
		font-family: var(--font-mono); font-size: 0.85rem;
	}
	.breadcrumb { color: var(--text-muted); }
	.breadcrumb-sep { color: var(--border); }
	.breadcrumb-handle { color: var(--accent); }
	.nav-right { display: flex; align-items: center; gap: 12px; }
	.btn-ghost-sm {
		font-size: 0.82rem; color: var(--text-muted);
		font-family: var(--font-mono);
		text-decoration: none;
		padding: 4px 10px; border-radius: 6px;
		border: 1px solid var(--border);
		transition: all 0.2s;
	}
	.btn-ghost-sm:hover { color: var(--accent); border-color: var(--accent); }
	.btn-nav {
		background: var(--bg-card); border: 1px solid var(--border);
		color: var(--text-primary); padding: 6px 16px; border-radius: 999px;
		font-size: 0.85rem; cursor: pointer; text-decoration: none;
		transition: all 0.2s;
	}
	.btn-nav:hover { border-color: var(--accent); color: var(--accent); }

	/* ─── Layout ─────────────────────────────────────────────────────────── */
	.layout {
		display: grid;
		grid-template-columns: 280px 1fr;
		max-width: 1300px;
		margin: 0 auto;
		min-height: calc(100vh - 57px);
		position: relative; z-index: 1;
	}

	/* ─── Sidebar ────────────────────────────────────────────────────────── */
	.sidebar {
		border-right: 1px solid var(--border);
		padding: 32px 24px;
		position: sticky;
		top: 57px;
		height: calc(100vh - 57px);
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.identity-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 12px;
		padding-bottom: 24px;
		border-bottom: 1px solid var(--border);
	}
	.avatar {
		width: 72px; height: 72px;
		border-radius: 50%;
		overflow: hidden;
		border: 2px solid var(--border);
		display: flex; align-items: center; justify-content: center;
		background: var(--bg-secondary);
		font-size: 2rem;
	}
	.avatar img { width: 100%; height: 100%; object-fit: cover; }
	.avatar-letter { font-weight: 700; color: var(--accent); }
	.identity-meta { width: 100%; }
	.handle {
		font-family: var(--font-mono);
		font-size: 1.1rem;
		color: var(--accent);
		margin: 0 0 4px;
	}
	.real-name { color: var(--text-primary); font-weight: 600; margin: 0 0 4px; font-size: 0.9rem; }
	.location, .timezone { color: var(--text-muted); font-size: 0.8rem; margin: 0; }

	.sidebar-block { display: flex; flex-direction: column; gap: 10px; }
	.sidebar-label {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--text-muted);
		font-weight: 600;
		margin: 0;
	}
	.tags { display: flex; flex-wrap: wrap; gap: 6px; }
	.tag {
		background: var(--accent-glow);
		border: 1px solid var(--accent-bright);
		color: var(--accent);
		padding: 2px 10px;
		border-radius: 999px;
		font-size: 0.75rem;
		font-weight: 500;
	}
	.agents { display: flex; flex-direction: column; gap: 8px; }
	.agent-card {
		display: flex; align-items: flex-start; gap: 10px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 10px 12px;
	}
	.agent-emoji { font-size: 1.2rem; flex-shrink: 0; }
	.agent-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
	.agent-id { font-family: var(--font-mono); font-size: 0.82rem; color: var(--text-primary); font-weight: 600; }
	.agent-role { font-size: 0.78rem; color: var(--text-secondary); }
	.agent-model { font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); }

	/* Section nav */
	.section-nav { display: flex; flex-direction: column; gap: 2px; }
	.section-nav-item {
		display: flex; align-items: center; gap: 8px;
		padding: 7px 10px;
		border-radius: var(--radius-sm);
		background: none; border: none; cursor: pointer;
		text-align: left; width: 100%;
		color: var(--text-secondary); font-size: 0.85rem;
		transition: all 0.15s;
	}
	.section-nav-item:hover {
		background: var(--bg-secondary);
		color: var(--text-primary);
	}
	.section-nav-item.active {
		background: var(--accent-glow);
		color: var(--accent);
	}
	.nav-icon { font-size: 0.9rem; flex-shrink: 0; }
	.nav-title { flex: 1; }

	/* Actions */
	.actions { display: flex; flex-direction: column; gap: 8px; }
	.action-btn {
		width: 100%;
		background: var(--gradient-cta);
		border: none; color: white;
		padding: 9px 16px;
		border-radius: 999px;
		font-size: 0.82rem;
		font-weight: 600;
		cursor: pointer;
		transition: opacity 0.2s;
	}
	.action-btn:hover { opacity: 0.85; }
	.action-btn-secondary {
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		color: var(--text-secondary);
	}
	.action-btn-secondary:hover { border-color: var(--accent); color: var(--accent); }
	.action-link {
		text-align: center;
		color: var(--text-muted);
		font-size: 0.78rem;
		text-decoration: none;
	}
	.action-link:hover { color: var(--accent); }

	.sidebar-meta {
		margin-top: auto;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.meta-badge {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--text-muted);
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		padding: 3px 8px;
		border-radius: 6px;
		display: inline-block;
		width: fit-content;
	}
	.meta-updated { font-size: 0.72rem; color: var(--text-muted); }

	/* ─── Main Content ───────────────────────────────────────────────────── */
	.content {
		padding: 48px 64px;
		max-width: 800px;
		display: flex;
		flex-direction: column;
		gap: 0;
	}
	.content-header { margin-bottom: 48px; }
	.content-title { font-size: 2.4rem; margin: 0 0 8px; line-height: 1.1; }
	.title-handle {
		background: var(--gradient-hero);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	.title-suffix { color: var(--text-muted); font-weight: 400; }
	.content-tagline { color: var(--text-muted); font-family: var(--font-mono); font-size: 0.85rem; margin: 0; }

	/* Section blocks */
	.section-block {
		padding: 40px 0;
		border-bottom: 1px solid var(--border);
		scroll-margin-top: 80px;
	}
	.section-block:last-of-type { border-bottom: none; }
	.section-header {
		display: flex; align-items: center; gap: 12px;
		margin-bottom: 24px;
	}
	.section-h-icon { font-size: 1.6rem; }
	.section-h2 { font-size: 1.5rem; margin: 0; }

	/* Prose rendering */
	.prose :global(p) { color: var(--text-secondary); line-height: 1.75; margin: 0 0 1em; }
	.prose :global(h3) { color: var(--text-primary); margin: 1.5em 0 0.5em; }
	.prose :global(ul), .prose :global(ol) {
		color: var(--text-secondary);
		padding-left: 1.5em;
		margin: 0 0 1em;
		line-height: 1.7;
	}
	.prose :global(li) { margin-bottom: 0.3em; }
	.prose :global(strong) { color: var(--text-primary); }
	.prose :global(code) {
		font-family: var(--font-mono);
		font-size: 0.85em;
		background: var(--bg-secondary);
		padding: 2px 6px;
		border-radius: 4px;
		color: var(--accent);
	}
	.prose :global(table) { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
	.prose :global(th) {
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		padding: 8px 16px;
		text-align: left;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-muted);
	}
	.prose :global(td) {
		border: 1px solid var(--border);
		padding: 10px 16px;
		color: var(--text-secondary);
	}
	.prose :global(blockquote) {
		border-left: 3px solid var(--accent);
		margin: 0 0 1em;
		padding-left: 16px;
		color: var(--text-secondary);
		font-style: italic;
	}

	/* Injection panel */
	.injection-panel {
		margin-top: 48px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 28px;
	}
	.injection-header { margin-bottom: 20px; }
	.injection-header h3 { margin: 0 0 6px; font-size: 1rem; }
	.injection-header p { color: var(--text-muted); font-size: 0.85rem; margin: 0; }
	.injection-code {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		line-height: 1.65;
		color: var(--text-secondary);
		background: var(--bg-primary);
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 16px;
		margin: 0 0 16px;
		overflow-x: auto;
		white-space: pre-wrap;
	}
	.copy-prompt-btn {
		background: var(--gradient-cta);
		border: none; color: white;
		padding: 9px 24px;
		border-radius: 999px;
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
		transition: opacity 0.2s;
	}
	.copy-prompt-btn:hover { opacity: 0.85; }

	/* ─── Responsive ────────────────────────────────────────────────────── */
	@media (max-width: 900px) {
		.layout { grid-template-columns: 1fr; }
		.sidebar { position: static; height: auto; border-right: none; border-bottom: 1px solid var(--border); }
		.content { padding: 32px 24px; max-width: 100%; }
	}
</style>
