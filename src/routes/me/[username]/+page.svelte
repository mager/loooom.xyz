<script lang="ts">
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
					{#if frontmatter.location}<span class="file-attr-sep">·</span><span class="file-attr"><span class="attr-key">location</span><span class="attr-val">{frontmatter.location}</span></span>{/if}
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
			<a href="/u/{user.username}" class="faction-btn faction-ghost">Profile</a>
			<a href="/me/{user.username}/raw" class="faction-btn faction-ghost" target="_blank">Read raw file</a>
			<button class="faction-btn faction-primary" onclick={copyPrompt}>
				{copiedPrompt ? 'Copied' : 'Copy injection prompt'}
			</button>
			<button class="faction-btn faction-ghost" onclick={copyContent}>
				{copiedContent ? 'Copied' : 'Copy ME.md'}
			</button>
			<button class="faction-btn faction-ghost" onclick={copyRaw}>
				{copiedRaw ? 'Copied' : 'Copy URL'}
			</button>
			<button class="faction-btn faction-ghost" onclick={downloadMd}>Download</button>
		</div>

		<!-- Machine fetch bar -->
		<div class="fetch-bar">
			<span class="fetch-prompt">$</span>
			<code class="fetch-cmd">curl https://loooom.xyz{rawUrl}</code>
			<button class="fetch-copy" onclick={copyRaw}>{copiedRaw ? 'Copied' : 'Copy'}</button>
		</div>
	</div>
</header>

<!-- VIEW TOGGLE -->
<div class="view-toggle-bar">
	<div class="view-toggle-inner">
		<div class="view-tabs">
			<button class="vtab" class:active={viewMode === 'rendered'} aria-pressed={viewMode === 'rendered'} onclick={() => viewMode = 'rendered'}>
				Rendered
			</button>
			<button class="vtab" class:active={viewMode === 'raw'} aria-pressed={viewMode === 'raw'} onclick={switchToRaw}>
				Raw markdown
			</button>
		</div>
		{#if frontmatter.agents?.length}
			<div class="fleet-pills">
				{#each frontmatter.agents as agent}
					<div class="fleet-pill">
						{#if agent.emoji}<span>{agent.emoji}</span>{/if}
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
						{#if frontmatter.timezone}<div class="sid-tz">{frontmatter.timezone}</div>{/if}
					</div>
				</div>

				<!-- Agent fleet -->
				{#if frontmatter.agents?.length}
					<div class="sb-block">
						<div class="sb-label">The Fleet</div>
						<div class="sb-agents">
							{#each frontmatter.agents as agent}
								<div class="sb-agent">
									{#if agent.emoji}<span class="sb-agent-emoji">{agent.emoji}</span>{/if}
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
									{#if sec.icon}<span>{sec.icon}</span>{/if}
									<span>{sec.title}</span>
								</a>
							{/each}
						</nav>
					</div>
				{/if}

				<!-- Quick actions -->
				<div class="sb-block">
					<button class="sb-action primary" onclick={copyPrompt}>{copiedPrompt ? 'Copied' : 'Copy injection prompt'}</button>
					<button class="sb-action" onclick={() => switchToRaw()}>View raw markdown</button>
				</div>

				<div class="sb-version">ME.md v{frontmatter.version}{#if frontmatter.updated} · {frontmatter.updated}{/if}</div>
			</aside>

			<!-- Sections -->
			<div class="sections-main">
				{#each sections as section}
					<div id="section-{section.id}" class="section-card">
						<div class="section-card-header">
							<div class="section-card-label">
								{#if section.icon}<span class="sc-icon">{section.icon}</span>{/if}
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
						<span class="inj-badge">Injection Prompt</span>
						<p class="inj-hint">Paste this into any AI system prompt to auto-load this context.</p>
					</div>
					<pre class="inj-code">{injectionPrompt}</pre>
					<button class="inj-copy-btn" onclick={copyPrompt}>{copiedPrompt ? 'Copied' : 'Copy prompt'}</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
.file-hero { padding: 48px 0 32px; border-bottom: 1px solid var(--line); }
	.file-hero-inner { display: flex; flex-direction: column; gap: 24px; }
	.file-identity { display: flex; align-items: flex-start; gap: 24px; }
	.file-icon-wrap { flex-shrink: 0; }
	.file-icon { width: 52px; height: 66px; border: 1px solid var(--line-strong); border-radius: 6px; background: var(--panel); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; }
	.file-icon-lines { display: flex; flex-direction: column; gap: 4px; }
	.file-icon-lines span { display: block; height: 1px; width: 24px; background: var(--quiet); }
	.file-icon-lines span:last-child { width: 16px; }
	.file-icon-ext { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--quiet); }
	.file-meta { min-width: 0; flex: 1; }
	.file-name { font-size: clamp(36px, 4vw, 60px); font-weight: 500; line-height: 1.05; letter-spacing: -.035em; margin: 0 0 16px; overflow-wrap: anywhere; }
	.file-attrs { display: flex; flex-wrap: wrap; gap: 8px; align-items: baseline; font-family: 'Space Mono', monospace; font-size: 11px; color: var(--quiet); line-height: 1.8; margin-bottom: 14px; }
	.file-attr { display: inline-flex; flex-wrap: wrap; gap: 6px; min-width: 0; overflow-wrap: anywhere; }
	.attr-val { color: var(--paper); }
	.file-attr-sep { color: var(--quiet); }
	.file-tags { display: flex; flex-wrap: wrap; gap: 6px; }
	.ftag { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--lime); background: var(--accent-soft); border: 1px solid var(--accent-border); padding: 3px 8px; border-radius: 4px; overflow-wrap: anywhere; }
	.file-actions { display: flex; flex-wrap: wrap; gap: 10px; }
	.faction-btn, .sb-action, .inj-copy-btn { display: inline-flex; align-items: center; justify-content: center; min-height: 46px; padding: 12px 16px; background: transparent; border: 1px solid var(--line); border-radius: 6px; color: var(--paper); font-size: 14px; font-weight: 500; cursor: pointer; transition: background .2s, border-color .2s; }
	.faction-btn:hover, .sb-action:hover { color: var(--paper); border-color: var(--line-strong); background: var(--panel-raised); }
	.faction-btn.faction-primary, .sb-action.primary, .inj-copy-btn { color: var(--action-ink); background: var(--action-bg); border-color: var(--action-bg); }
	.faction-btn.faction-primary:hover, .sb-action.primary:hover, .inj-copy-btn:hover { color: var(--action-ink); background: var(--action-hover); border-color: var(--action-hover); }
	.fetch-bar { display: flex; align-items: center; gap: 12px; width: 100%; max-width: 720px; min-width: 0; background: var(--code-bg); border: 1px solid var(--line); border-radius: 8px; padding: 12px 16px; }
	.fetch-prompt { font-family: 'Space Mono', monospace; color: var(--code-line); }
	.fetch-cmd { min-width: 0; flex: 1; font-family: 'Space Mono', monospace; font-size: 11px; line-height: 1.8; color: var(--code-text); overflow-wrap: anywhere; }
	.fetch-copy { background: transparent; color: var(--paper); border: 1px solid var(--line-strong); border-radius: 6px; min-height: 38px; padding: 6px 10px; font-size: 13px; flex-shrink: 0; }
	.fetch-copy:hover { background: var(--panel-raised); border-color: var(--lime); }
	.view-toggle-bar { border-bottom: 1px solid var(--line); }
	.view-toggle-inner { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; }
	.view-tabs { display: flex; flex-wrap: wrap; gap: 8px; }
	.vtab { min-height: 48px; background: transparent; border: 0; border-bottom: 2px solid transparent; padding: 12px 10px; font-size: 14px; color: var(--quiet); cursor: pointer; }
	.vtab.active { color: var(--lime); border-bottom-color: var(--lime); }
	.vtab:hover { color: var(--paper); }
	.fleet-pills { display: flex; flex-wrap: wrap; gap: 8px; padding: 10px 0; }
	.fleet-pill { display: flex; align-items: center; gap: 6px; background: var(--panel); border: 1px solid var(--line); border-radius: 4px; padding: 4px 8px; font-size: 12px; }
	.fleet-id { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--quiet); overflow-wrap: anywhere; }
	.page-body { min-width: 0; padding-bottom: 64px; }
	.raw-view { padding-top: 32px; }
	.raw-window { border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }
	.raw-window-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; padding: 14px 16px; background: var(--code-toolbar); border-bottom: 1px solid var(--line); }
	.win-filename, .win-badge { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--quiet); overflow-wrap: anywhere; }
	.win-badge { margin-left: auto; }
	.raw-window-body { background: var(--code-bg); max-height: 80vh; overflow: auto; }
	.raw-loading { color: var(--quiet); padding: 24px; }
	.raw-content { margin: 0; padding: 24px; font-family: 'Space Mono', monospace; font-size: 12px; line-height: 1.8; color: var(--code-text); white-space: pre-wrap; overflow-wrap: anywhere; tab-size: 2; }
	.rendered-layout { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 32px; align-items: start; padding-top: 32px; }
	.sidebar { min-width: 0; position: sticky; top: 24px; max-height: calc(100vh - 124px); overflow-y: auto; display: flex; flex-direction: column; gap: 28px; padding-right: 24px; border-right: 1px solid var(--line); }
	.sidebar-identity { display: flex; align-items: center; gap: 12px; padding-bottom: 24px; border-bottom: 1px solid var(--line); }
	.sidebar-identity > div:last-child { min-width: 0; }
	.sid-avatar { width: 44px; height: 44px; flex-shrink: 0; border-radius: 50%; background: var(--avatar-bg); color: var(--paper); border: 1px solid var(--avatar-border); display: grid; place-items: center; overflow: hidden; }
	.sid-avatar img { width: 100%; height: 100%; object-fit: cover; }
	.sid-handle { color: var(--paper); font-size: 15px; overflow-wrap: anywhere; }
	.sid-name { font-size: 13px; color: var(--quiet); margin-top: 3px; }
	.sid-tz { font-size: 11px; color: var(--quiet); margin-top: 4px; overflow-wrap: anywhere; }
	.sb-block { display: flex; flex-direction: column; gap: 12px; }
	.sb-label { font-size: 13px; color: var(--quiet); }
	.sb-agents { display: flex; flex-direction: column; gap: 14px; }
	.sb-agent { display: flex; align-items: flex-start; gap: 10px; }
	.sb-agent-emoji { flex-shrink: 0; }
	.sb-agent-info { display: flex; flex-direction: column; min-width: 0; gap: 4px; }
	.sb-agent-id { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--paper); overflow-wrap: anywhere; }
	.sb-agent-role { color: var(--quiet); font-size: 12px; line-height: 1.6; }
	.sb-nav { display: flex; flex-direction: column; gap: 4px; }
	.sb-nav-item { display: flex; gap: 10px; align-items: center; color: var(--quiet); padding: 10px 8px; font-size: 14px; border-radius: 6px; }
	.sb-nav-item:hover { background: var(--panel-raised); color: var(--paper); }
	.sb-action { width: 100%; font-size: 13px; padding: 10px 12px; }
	.sb-version { font-family: 'Space Mono', monospace; color: var(--quiet); font-size: 10px; line-height: 1.8; }
	.sections-main { display: flex; flex-direction: column; gap: 32px; min-width: 0; }
	.section-card { min-width: 0; scroll-margin-top: 24px; }
	.section-card-header { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; padding-bottom: 16px; border-bottom: 1px solid var(--line); margin-bottom: 20px; }
	.section-card-label { display: flex; align-items: center; gap: 12px; min-width: 0; }
	.sc-icon { font-size: 22px; }
	.sc-title { margin: 0; font-size: 26px; font-weight: 500; }
	.sc-raw-id { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--quiet); overflow-wrap: anywhere; }
	.section-body { min-width: 0; }
	.prose { overflow-wrap: anywhere; }
	.prose :global(p), .prose :global(ul), .prose :global(ol) { color: var(--quiet); font-size: 15px; line-height: 1.75; margin: 0 0 16px; max-width: 72ch; }
	.prose :global(h1), .prose :global(h2), .prose :global(h3), .prose :global(h4) { color: var(--paper); font-weight: 500; font-size: 22px; line-height: 1.3; margin: 28px 0 12px; }
	.prose :global(ul), .prose :global(ol) { padding-left: 24px; }
	.prose :global(li) { margin-bottom: 6px; }
	.prose :global(strong) { color: var(--paper); font-weight: 500; }
	.prose :global(a) { color: var(--lime); text-decoration: underline; }
	.prose :global(img) { max-width: 100%; height: auto; }
	.prose :global(code) { font-family: 'Space Mono', monospace; font-size: .82em; color: var(--code-text); background: var(--code-toolbar); border-radius: 4px; padding: 2px 5px; }
	.prose :global(pre) { max-width: 100%; background: var(--code-bg); border: 1px solid var(--line); border-radius: 8px; padding: 20px; overflow-x: auto; margin: 20px 0; }
	.prose :global(pre code) { color: var(--code-text); background: none; padding: 0; font-size: 12px; line-height: 1.8; }
	.prose :global(table) { display: block; max-width: 100%; width: max-content; overflow-x: auto; border-collapse: collapse; font-size: 14px; margin: 20px 0; }
	.prose :global(th), .prose :global(td) { border: 1px solid var(--line); padding: 10px 14px; color: var(--quiet); text-align: left; }
	.prose :global(th) { background: var(--panel-raised); color: var(--paper); font-weight: 500; }
	.prose :global(blockquote) { border-left: 1px solid var(--line-strong); margin: 20px 0; padding-left: 20px; color: var(--quiet); }
	.injection-card { min-width: 0; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; background: var(--panel); }
	.injection-card-header { padding: 20px; border-bottom: 1px solid var(--line); }
	.inj-badge { font-size: 16px; color: var(--paper); display: block; margin-bottom: 8px; }
	.inj-hint { color: var(--quiet); font-size: 14px; line-height: 1.7; }
	.inj-code { font-family: 'Space Mono', monospace; font-size: 12px; line-height: 1.8; color: var(--code-text); background: var(--code-bg); margin: 0; padding: 20px; overflow-wrap: anywhere; white-space: pre-wrap; border-bottom: 1px solid var(--line); }
	.inj-copy-btn { margin: 16px 20px; }
	@media (max-width: 1100px) {
		.rendered-layout { grid-template-columns: minmax(0, 1fr); }
		.sidebar { position: static; max-height: none; border-right: 0; border-bottom: 1px solid var(--line); padding: 0 0 28px; }
		.sb-nav { flex-direction: row; flex-wrap: wrap; }
		.sb-nav-item { border: 1px solid var(--line); }
	}
	@media (max-width: 600px) {
		.file-hero { padding: 32px 0; }
		.file-icon-wrap { display: none; }
		.file-identity { gap: 0; }
		.file-attrs { flex-direction: column; gap: 4px; align-items: flex-start; }
		.file-attr-sep { display: none; }
		.faction-btn { flex-grow: 1; }
		.faction-primary { flex-basis: 100%; }
		.fetch-bar { padding: 12px; gap: 8px; }
		.raw-content, .inj-code { padding: 16px; font-size: 11px; }
		.prose :global(pre code) { font-size: 11px; }
		.sc-title { font-size: 24px; }
	}
</style>
