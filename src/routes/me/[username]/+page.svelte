<script lang="ts">
	import YarnLogo from '$lib/components/YarnLogo.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { marked } from 'marked';
	import { generateInjectionPrompt } from '$lib/memd';

	let { data } = $props();

	const { user, parsed, rawUrl } = data;
	const { frontmatter, sections } = parsed;

	let viewMode = $state<'rendered' | 'raw'>('rendered');
	let copiedPrompt = $state(false);
	let copiedRaw = $state(false);
	let copiedContent = $state(false);
	let rawContent = $state<string | null>(null);
	let rawLoading = $state(false);

	const injectionPrompt = generateInjectionPrompt(
		frontmatter.handle,
		`https://loooom.xyz${rawUrl}`
	);

	async function loadRaw() {
		if (rawContent) return;
		rawLoading = true;
		try {
			const res = await fetch(`/me/${user.username}/raw`);
			rawContent = await res.text();
		} catch {
			rawContent = '# Error loading raw content';
		} finally {
			rawLoading = false;
		}
	}

	async function switchToRaw() {
		viewMode = 'raw';
		await loadRaw();
	}

	function copyPrompt() {
		navigator.clipboard.writeText(injectionPrompt);
		copiedPrompt = true;
		setTimeout(() => (copiedPrompt = false), 2000);
	}

	async function copyContent() {
		await loadRaw();
		if (rawContent) {
			await navigator.clipboard.writeText(rawContent);
			copiedContent = true;
			setTimeout(() => (copiedContent = false), 2500);
		}
	}

	function copyRaw() {
		navigator.clipboard.writeText(`https://loooom.xyz${rawUrl}`);
		copiedRaw = true;
		setTimeout(() => (copiedRaw = false), 2000);
	}

	function downloadMd() {
		const a = document.createElement('a');
		a.href = `/me/${user.username}/raw?download`;
		a.download = `${user.username}.md`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}

	function renderMarkdown(md: string): string {
		return marked(md) as string;
	}

	const SECTION_ICONS: Record<string, string> = {
		'the-soul': '🫀', 'my-values': '🫀',
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
	<title>{frontmatter.handle} — ME.md on Loooom</title>
	<meta name="description" content="{frontmatter.name ?? user.username}'s Portable Human Context. Fetch raw: https://loooom.xyz{rawUrl}" />
	<meta name="me-md-raw" content="https://loooom.xyz{rawUrl}" />
	<meta name="me-md-handle" content="{frontmatter.handle}" />
	<meta name="me-md-version" content="{frontmatter.version ?? '1.0'}" />
	{#if frontmatter.updated}<meta name="me-md-updated" content="{frontmatter.updated}" />{/if}
	{#if frontmatter.timezone}<meta name="me-md-timezone" content="{frontmatter.timezone}" />{/if}
	<meta property="og:title" content="{frontmatter.handle} — ME.md" />
	<meta property="og:description" content="{frontmatter.name ?? user.username}'s portable human context. Any AI can read this." />
</svelte:head>

<!-- NAV -->
<nav>
	<div class="nav-inner">
		<a href="/" class="logo">
			<YarnLogo size={20} />
			<span class="logo-text">loooom</span>
		</a>
		<div class="nav-breadcrumb">
			<span class="bc-dim">me /</span>
			<span class="bc-handle">{user.username}.md</span>
		</div>
		<div class="nav-right">
			<ThemeToggle />
			<a href="/me/{user.username}/raw" class="btn-raw" target="_blank">raw ↗</a>
			<a href="/u/{user.username}" class="btn-nav">Profile</a>
		</div>
	</div>
</nav>

<!-- FILE HERO -->
<header class="file-hero">
	<div class="file-hero-inner">
		<!-- File identity -->
		<div class="file-identity">
			<div class="file-icon-wrap">
				<div class="file-icon">
					<span class="file-icon-lines">
						<span></span><span></span><span></span>
					</span>
					<span class="file-icon-ext">.md</span>
				</div>
			</div>
			<div class="file-meta">
				<h1 class="file-name">{user.username}.md</h1>
				<div class="file-attrs">
					<span class="file-attr"><span class="attr-key">handle</span><span class="attr-val">{frontmatter.handle}</span></span>
					{#if frontmatter.location}<span class="file-attr-sep">·</span><span class="file-attr"><span class="attr-val">📍 {frontmatter.location}</span></span>{/if}
					{#if frontmatter.updated}<span class="file-attr-sep">·</span><span class="file-attr"><span class="attr-key">updated</span><span class="attr-val">{frontmatter.updated}</span></span>{/if}
					<span class="file-attr-sep">·</span><span class="file-attr"><span class="attr-key">ME.md</span><span class="attr-val">v{frontmatter.version}</span></span>
				</div>
				{#if frontmatter.tags?.length}
					<div class="file-tags">
						{#each frontmatter.tags as tag}<span class="ftag">#{tag}</span>{/each}
					</div>
				{/if}
			</div>
		</div>

		<!-- Action bar -->
		<div class="file-actions">
			<button class="faction-btn faction-primary" onclick={copyPrompt}>
				{copiedPrompt ? '✓ Copied!' : '⚡ Copy injection prompt'}
			</button>
			<button class="faction-btn faction-ghost" onclick={copyContent}>
				{copiedContent ? '✓ Copied!' : '📋 Copy ME.md'}
			</button>
			<button class="faction-btn faction-ghost" onclick={copyRaw}>
				{copiedRaw ? '✓' : '🔗'}
			</button>
			<button class="faction-btn faction-ghost" onclick={downloadMd}>⬇</button>
		</div>

		<!-- Machine fetch bar -->
		<div class="fetch-bar">
			<span class="fetch-prompt">$</span>
			<code class="fetch-cmd">curl https://loooom.xyz{rawUrl}</code>
			<button class="fetch-copy" onclick={copyRaw}>{copiedRaw ? '✓' : 'copy'}</button>
		</div>
	</div>
</header>

<!-- VIEW TOGGLE -->
<div class="view-toggle-bar">
	<div class="view-toggle-inner">
		<div class="view-tabs">
			<button class="vtab" class:active={viewMode === 'rendered'} onclick={() => viewMode = 'rendered'}>
				<span class="vtab-icon">◉</span> Rendered
			</button>
			<button class="vtab" class:active={viewMode === 'raw'} onclick={switchToRaw}>
				<span class="vtab-icon">⌥</span> Raw markdown
			</button>
		</div>
		{#if frontmatter.agents?.length}
			<div class="fleet-pills">
				{#each frontmatter.agents as agent}
					<div class="fleet-pill">
						<span>{agent.emoji ?? '🤖'}</span>
						<span class="fleet-id">{agent.id}</span>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<!-- MAIN CONTENT -->
<div class="page-body">

	<!-- RAW VIEW: show the actual markdown file -->
	{#if viewMode === 'raw'}
		<div class="raw-view">
			<div class="raw-window">
				<div class="raw-window-bar">
					<span class="win-dot r"></span>
					<span class="win-dot y"></span>
					<span class="win-dot g"></span>
					<span class="win-filename">{user.username}.md</span>
					<span class="win-badge">UTF-8 · Markdown</span>
				</div>
				<div class="raw-window-body">
					{#if rawLoading}
						<div class="raw-loading">Loading...</div>
					{:else if rawContent}
						<pre class="raw-content">{rawContent}</pre>
					{/if}
				</div>
			</div>
		</div>

	<!-- RENDERED VIEW -->
	{:else}
		<div class="rendered-layout">
			<!-- Sidebar -->
			<aside class="sidebar">
				<!-- Avatar + identity -->
				<div class="sidebar-identity">
					<div class="sid-avatar">
						{#if user.avatarUrl}
							<img src={user.avatarUrl} alt={user.displayName} />
						{:else}
							{(frontmatter.name ?? user.username)[0].toUpperCase()}
						{/if}
					</div>
					<div>
						<div class="sid-handle">{frontmatter.handle}</div>
						{#if frontmatter.name}<div class="sid-name">{frontmatter.name}</div>{/if}
						{#if frontmatter.timezone}<div class="sid-tz">🕐 {frontmatter.timezone}</div>{/if}
					</div>
				</div>

				<!-- Agent fleet -->
				{#if frontmatter.agents?.length}
					<div class="sb-block">
						<div class="sb-label">🤖 The Fleet</div>
						<div class="sb-agents">
							{#each frontmatter.agents as agent}
								<div class="sb-agent">
									<span class="sb-agent-emoji">{agent.emoji ?? '🤖'}</span>
									<div class="sb-agent-info">
										<span class="sb-agent-id">{agent.id}</span>
										{#if agent.role}<span class="sb-agent-role">{agent.role}</span>{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Section nav -->
				{#if sections.length}
					<div class="sb-block">
						<div class="sb-label">Sections</div>
						<nav class="sb-nav">
							{#each sections as sec}
								<a href="#section-{sec.id}" class="sb-nav-item">
									<span>{sectionIcon(sec.id, sec.icon)}</span>
									<span>{sec.title}</span>
								</a>
							{/each}
						</nav>
					</div>
				{/if}

				<!-- Quick actions -->
				<div class="sb-block">
					<button class="sb-action primary" onclick={copyPrompt}>{copiedPrompt ? '✓ Copied!' : '⚡ Copy injection prompt'}</button>
					<button class="sb-action" onclick={() => switchToRaw()}>View raw markdown →</button>
				</div>

				<div class="sb-version">ME.md v{frontmatter.version}{#if frontmatter.updated} · {frontmatter.updated}{/if}</div>
			</aside>

			<!-- Sections -->
			<main class="sections-main">
				{#each sections as section}
					<div id="section-{section.id}" class="section-card">
						<div class="section-card-header">
							<div class="section-card-label">
								<span class="sc-icon">{sectionIcon(section.id, section.icon)}</span>
								<h2 class="sc-title">{section.title}</h2>
							</div>
							<!-- Raw snippet toggle per section -->
							<div class="sc-raw-pill">
								<code class="sc-raw-id">#{section.id}</code>
							</div>
						</div>
						<div class="section-body prose">
							{@html renderMarkdown(section.content)}
						</div>
					</div>
				{/each}

				<!-- Injection prompt card -->
				<div class="injection-card">
					<div class="injection-card-header">
						<span class="inj-badge">⚡ Injection Prompt</span>
						<p class="inj-hint">Paste this into any AI system prompt to auto-load this context.</p>
					</div>
					<pre class="inj-code">{injectionPrompt}</pre>
					<button class="inj-copy-btn" onclick={copyPrompt}>{copiedPrompt ? '✓ Copied!' : 'Copy prompt'}</button>
				</div>
			</main>
		</div>
	{/if}
</div>

<style>
	/* ===== NAV ===== */
	nav {
		position: sticky; top: 0; z-index: 100;
		background: var(--bg-primary);
		border-bottom: 1px solid var(--border);
		backdrop-filter: blur(12px);
	}
	.nav-inner {
		max-width: 1280px; margin: 0 auto;
		padding: 0 2rem; height: 52px;
		display: flex; align-items: center; justify-content: space-between;
		gap: 1rem;
	}
	.logo { display: flex; align-items: center; gap: 0.5rem; color: var(--text-primary); text-decoration: none; flex-shrink: 0; }
	.logo-text { font-family: var(--font-handwriting); font-size: 1rem; font-weight: 200; }
	.nav-breadcrumb { display: flex; align-items: center; gap: 0.4rem; font-family: var(--font-mono); font-size: 0.82rem; min-width: 0; overflow: hidden; }
	.bc-dim { color: var(--text-muted); flex-shrink: 0; }
	.bc-handle { color: var(--text-primary); font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.nav-right { display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0; }
	.btn-raw { font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); text-decoration: none; padding: 3px 10px; border: 1px solid var(--border); border-radius: 6px; transition: all 0.15s; }
	.btn-raw:hover { color: var(--violet); border-color: var(--violet); }
	.btn-nav { font-size: 0.82rem; color: var(--text-secondary); text-decoration: none; padding: 5px 14px; border: 1px solid var(--border); border-radius: 999px; transition: all 0.15s; background: var(--bg-card); }
	.btn-nav:hover { border-color: var(--violet); color: var(--violet); }

	/* ===== FILE HERO ===== */
	.file-hero {
		background: var(--bg-secondary);
		border-bottom: 1px solid var(--border);
		padding: 2.5rem 2rem;
	}
	.file-hero-inner {
		max-width: 1280px; margin: 0 auto;
		display: flex; flex-direction: column; gap: 1.5rem;
	}
	.file-identity { display: flex; align-items: flex-start; gap: 1.5rem; }
	.file-icon-wrap { flex-shrink: 0; }
	.file-icon {
		width: 56px; height: 70px;
		background: var(--bg-card);
		border: 2px solid var(--border);
		border-radius: 8px;
		display: flex; flex-direction: column; align-items: center; justify-content: center;
		gap: 4px;
		position: relative;
	}
	.file-icon::after {
		content: '';
		position: absolute; top: -2px; right: -2px;
		width: 14px; height: 14px;
		background: var(--bg-secondary);
		border-bottom: 2px solid var(--border);
		border-left: 2px solid var(--border);
		border-radius: 0 6px 0 6px;
	}
	.file-icon-lines { display: flex; flex-direction: column; gap: 3px; margin-bottom: 4px; }
	.file-icon-lines span { display: block; height: 2px; border-radius: 1px; background: var(--text-muted); }
	.file-icon-lines span:nth-child(1) { width: 28px; }
	.file-icon-lines span:nth-child(2) { width: 22px; }
	.file-icon-lines span:nth-child(3) { width: 18px; }
	.file-icon-ext { font-family: var(--font-mono); font-size: 0.62rem; font-weight: 800; color: var(--violet); letter-spacing: 0.05em; }

	.file-meta { flex: 1; min-width: 0; }
	.file-name {
		font-family: var(--font-mono);
		font-size: clamp(1.5rem, 4vw, 2.25rem);
		font-weight: 800;
		letter-spacing: -0.02em;
		color: var(--text-primary);
		margin: 0 0 0.5rem;
	}
	.file-attrs {
		display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;
		font-family: var(--font-mono); font-size: 0.75rem; margin-bottom: 0.75rem;
	}
	.file-attr { display: flex; align-items: center; gap: 0.3rem; }
	.attr-key { color: var(--text-muted); }
	.attr-val { color: var(--text-secondary); font-weight: 600; }
	.file-attr-sep { color: var(--border); }
	.file-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }
	.ftag { font-family: var(--font-mono); font-size: 0.68rem; color: var(--violet); background: color-mix(in srgb, var(--violet) 10%, transparent); border: 1px solid color-mix(in srgb, var(--violet) 25%, transparent); padding: 2px 8px; border-radius: 999px; }

	.file-actions {
		display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;
	}
	.faction-btn, .faction-primary {
		padding: 0.55rem 1.25rem;
		border-radius: 999px;
		font-size: 0.82rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.15s;
		border: none;
	}
	.faction-primary { background: var(--violet); color: white; }
	.faction-primary:hover { opacity: 0.88; }
	.faction-ghost {
		background: var(--bg-card);
		border: 1.5px solid var(--border) !important;
		color: var(--text-secondary);
	}
	.faction-ghost:hover { border-color: var(--violet) !important; color: var(--violet); }
	.faction-btn { background: var(--bg-card); border: 1.5px solid var(--border); color: var(--text-secondary); }
	.faction-btn:hover { border-color: var(--violet); color: var(--violet); }
	/* Also used as primary in the hero */
	.faction-btn.faction-primary { background: var(--violet); color: white; border: none; }

	.fetch-bar {
		display: inline-flex; align-items: center; gap: 0.75rem;
		background: #0d0d14;
		border: 1px solid #2a2a3e;
		border-radius: 10px;
		padding: 0.6rem 1rem;
		font-family: var(--font-mono);
		max-width: 520px;
		width: 100%;
	}
	.fetch-prompt { color: #6366f1; font-weight: 700; flex-shrink: 0; }
	.fetch-cmd { color: #a5b4fc; font-size: 0.82rem; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.fetch-copy { background: none; border: 1px solid #2a2a3e; color: #6366f1; font-family: var(--font-mono); font-size: 0.68rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; cursor: pointer; transition: all 0.15s; flex-shrink: 0; }
	.fetch-copy:hover { background: rgba(99,102,241,0.15); }

	/* ===== VIEW TOGGLE BAR ===== */
	.view-toggle-bar {
		border-bottom: 1px solid var(--border);
		background: var(--bg-primary);
		position: sticky;
		top: 52px;
		z-index: 90;
	}
	.view-toggle-inner {
		max-width: 1280px; margin: 0 auto;
		padding: 0 2rem;
		display: flex; align-items: center; justify-content: space-between;
		gap: 1rem;
	}
	.view-tabs { display: flex; gap: 0; }
	.vtab {
		display: flex; align-items: center; gap: 0.4rem;
		padding: 0.7rem 1.1rem;
		background: none; border: none;
		border-bottom: 2px solid transparent;
		font-family: var(--font-mono);
		font-size: 0.78rem; font-weight: 600;
		color: var(--text-muted);
		cursor: pointer; transition: all 0.15s;
	}
	.vtab.active { color: var(--violet); border-bottom-color: var(--violet); }
	.vtab:hover:not(.active) { color: var(--text-secondary); }
	.vtab-icon { font-size: 0.7rem; }
	.fleet-pills { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; padding: 0.5rem 0; }
	.fleet-pill { display: flex; align-items: center; gap: 0.35rem; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 999px; padding: 0.2rem 0.7rem; font-size: 0.75rem; }
	.fleet-id { font-family: var(--font-mono); font-weight: 700; color: var(--text-secondary); font-size: 0.72rem; }

	/* ===== PAGE BODY ===== */
	.page-body { max-width: 1280px; margin: 0 auto; }

	/* ===== RAW VIEW ===== */
	.raw-view { padding: 2rem; }
	.raw-window {
		border: 1px solid var(--border);
		border-radius: 14px;
		overflow: hidden;
		box-shadow: 0 8px 40px rgba(0,0,0,0.12);
	}
	.raw-window-bar {
		background: #1a1a2a;
		border-bottom: 1px solid #2a2a3e;
		padding: 10px 16px;
		display: flex; align-items: center; gap: 8px;
	}
	.win-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
	.win-dot.r { background: #ff5f57; }
	.win-dot.y { background: #febc2e; }
	.win-dot.g { background: #28c840; }
	.win-filename { font-family: var(--font-mono); font-size: 0.78rem; color: #a5b4fc; font-weight: 700; margin-left: 8px; }
	.win-badge { margin-left: auto; font-family: var(--font-mono); font-size: 0.65rem; color: #4a4a6a; }
	.raw-window-body { background: #0d0d14; max-height: 80vh; overflow-y: auto; }
	.raw-loading { color: #4a4a6a; font-family: var(--font-mono); font-size: 0.85rem; padding: 2rem; }
	.raw-content {
		margin: 0;
		padding: 2rem;
		font-family: var(--font-mono);
		font-size: 0.82rem;
		line-height: 1.75;
		color: #c8c8e8;
		white-space: pre-wrap;
		word-break: break-word;
		tab-size: 2;
		/* Subtle YAML/MD syntax coloring via text */
	}

	/* ===== RENDERED LAYOUT ===== */
	.rendered-layout {
		display: grid;
		grid-template-columns: 260px 1fr;
		gap: 0;
		min-height: 80vh;
	}

	/* ===== SIDEBAR ===== */
	.sidebar {
		border-right: 1px solid var(--border);
		padding: 2rem 1.5rem;
		position: sticky;
		top: 96px; /* nav + toggle bar */
		height: calc(100vh - 96px);
		overflow-y: auto;
		display: flex; flex-direction: column; gap: 1.75rem;
	}
	.sidebar-identity {
		display: flex; align-items: center; gap: 1rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid var(--border);
	}
	.sid-avatar {
		width: 48px; height: 48px; border-radius: 50%;
		background: linear-gradient(135deg, var(--violet), var(--ocean));
		display: flex; align-items: center; justify-content: center;
		font-weight: 800; font-size: 1.1rem; color: white;
		overflow: hidden; flex-shrink: 0;
	}
	.sid-avatar img { width: 100%; height: 100%; object-fit: cover; }
	.sid-handle { font-family: var(--font-mono); font-size: 0.88rem; font-weight: 800; color: var(--violet); }
	.sid-name { font-size: 0.82rem; color: var(--text-secondary); margin-top: 2px; }
	.sid-tz { font-size: 0.72rem; color: var(--text-muted); margin-top: 2px; font-family: var(--font-mono); }

	.sb-block { display: flex; flex-direction: column; gap: 0.75rem; }
	.sb-label { font-family: var(--font-mono); font-size: 0.62rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: var(--text-muted); }
	.sb-agents { display: flex; flex-direction: column; gap: 0.5rem; }
	.sb-agent { display: flex; align-items: center; gap: 0.6rem; padding: 0.5rem 0.75rem; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 8px; }
	.sb-agent-emoji { font-size: 1rem; }
	.sb-agent-info { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
	.sb-agent-id { font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: var(--text-primary); }
	.sb-agent-role { font-size: 0.7rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

	.sb-nav { display: flex; flex-direction: column; gap: 2px; }
	.sb-nav-item { display: flex; align-items: center; gap: 0.6rem; padding: 0.45rem 0.6rem; border-radius: 6px; font-size: 0.82rem; color: var(--text-secondary); text-decoration: none; transition: all 0.12s; }
	.sb-nav-item:hover { background: var(--bg-secondary); color: var(--text-primary); }

	.sb-action { width: 100%; padding: 0.6rem 1rem; border-radius: 8px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.15s; background: var(--bg-secondary); border: 1.5px solid var(--border); color: var(--text-secondary); }
	.sb-action:hover { border-color: var(--violet); color: var(--violet); }
	.sb-action.primary { background: var(--violet); border-color: var(--violet); color: white; }
	.sb-action.primary:hover { opacity: 0.88; }
	.sb-version { font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-muted); margin-top: auto; }

	/* ===== SECTIONS ===== */
	.sections-main { padding: 2.5rem 3rem; display: flex; flex-direction: column; gap: 2rem; max-width: 780px; }

	.section-card {
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 14px;
		overflow: hidden;
	}
	.section-card-header {
		display: flex; align-items: center; justify-content: space-between;
		padding: 1rem 1.5rem;
		background: var(--bg-secondary);
		border-bottom: 1px solid var(--border);
	}
	.section-card-label { display: flex; align-items: center; gap: 0.75rem; }
	.sc-icon { font-size: 1.2rem; }
	.sc-title { font-size: 1rem; font-weight: 700; margin: 0; color: var(--text-primary); letter-spacing: -0.01em; }
	.sc-raw-pill { }
	.sc-raw-id { font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-muted); background: var(--bg-card); padding: 2px 8px; border-radius: 4px; border: 1px solid var(--border); }

	.section-body { padding: 1.5rem; }

	/* Prose */
	.prose :global(p) { color: var(--text-secondary); line-height: 1.75; margin: 0 0 1em; font-size: 0.925rem; }
	.prose :global(h3) { color: var(--text-primary); margin: 1.5em 0 0.5em; font-size: 0.95rem; }
	.prose :global(ul), .prose :global(ol) { color: var(--text-secondary); padding-left: 1.5em; margin: 0 0 1em; line-height: 1.7; font-size: 0.925rem; }
	.prose :global(li) { margin-bottom: 0.3em; }
	.prose :global(strong) { color: var(--text-primary); }
	.prose :global(code) { font-family: var(--font-mono); font-size: 0.82em; background: var(--bg-secondary); padding: 2px 6px; border-radius: 4px; color: var(--violet); }
	.prose :global(pre) { background: #0d0d14; border-radius: 8px; padding: 1rem; overflow-x: auto; margin: 1rem 0; }
	.prose :global(pre code) { background: none; padding: 0; color: #a5b4fc; }
	.prose :global(table) { width: 100%; border-collapse: collapse; font-size: 0.875rem; margin: 1rem 0; }
	.prose :global(th) { background: var(--bg-secondary); border: 1px solid var(--border); padding: 8px 14px; text-align: left; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); }
	.prose :global(td) { border: 1px solid var(--border); padding: 9px 14px; color: var(--text-secondary); font-size: 0.875rem; }
	.prose :global(blockquote) { border-left: 3px solid var(--violet); margin: 1em 0; padding-left: 1rem; color: var(--text-secondary); font-style: italic; }

	/* ===== INJECTION CARD ===== */
	.injection-card {
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 14px;
		overflow: hidden;
	}
	.injection-card-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); }
	.inj-badge { display: inline-block; font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; color: var(--violet); margin-bottom: 0.4rem; }
	.inj-hint { font-size: 0.82rem; color: var(--text-muted); margin: 0; }
	.inj-code {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		line-height: 1.7;
		color: #c8c8e8;
		background: #0d0d14;
		margin: 0;
		padding: 1.5rem;
		overflow-x: auto;
		white-space: pre-wrap;
		border-bottom: 1px solid var(--border);
	}
	.inj-copy-btn { margin: 1rem 1.5rem; padding: 0.5rem 1.25rem; background: var(--violet); border: none; color: white; border-radius: 999px; font-size: 0.82rem; font-weight: 700; cursor: pointer; transition: opacity 0.15s; }
	.inj-copy-btn:hover { opacity: 0.88; }

	/* ===== RESPONSIVE ===== */
	@media (max-width: 900px) {
		.rendered-layout { grid-template-columns: 1fr; }
		.sidebar { position: static; height: auto; border-right: none; border-bottom: 1px solid var(--border); }
		.sections-main { padding: 1.5rem; }
		.fleet-pills { display: none; }
	}
	@media (max-width: 640px) {
		.file-hero { padding: 1.25rem 1rem; }
		.file-hero-inner { gap: 1.25rem; }
		.file-name { font-size: 1.4rem; }
		.file-icon { display: none; }
		.file-identity { gap: 0; }

		/* Stack attrs vertically — clean left edge */
		.file-attrs {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.3rem;
			margin-bottom: 0.75rem;
		}
		.file-attr-sep { display: none; }
		.file-attr { gap: 0.45rem; }
		.attr-key {
			display: inline-block;
			min-width: 3.5rem;
		}

		/* Action buttons: primary full-width, ghost row below */
		.file-actions {
			flex-wrap: wrap;
			gap: 0.5rem;
		}
		/* "Copy injection prompt" — primary, full row */
		.faction-btn.faction-primary {
			width: 100%;
			text-align: center;
			order: 0;
		}
		/* "Copy ME.md" — grows to fill */
		.faction-btn.faction-ghost:first-of-type {
			flex: 1;
		}

		.fetch-bar { max-width: 100%; }
		.raw-view { padding: 1rem; }
		.view-toggle-inner { padding: 0 1rem; }

		/* Nav: tighter padding, hide "raw ↗" text link, shrink profile button */
		.nav-inner { padding: 0 1rem; gap: 0.5rem; }
		.btn-raw { display: none; }
		.btn-nav { padding: 4px 10px; font-size: 0.75rem; }
		.nav-breadcrumb { font-size: 0.75rem; }
	}
</style>
