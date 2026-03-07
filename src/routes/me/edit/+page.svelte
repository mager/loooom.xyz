<script lang="ts">
	import YarnLogo from '$lib/components/YarnLogo.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { ME_MD_TEMPLATE, parseMeMd, KNOWN_SECTIONS } from '$lib/memd';
	import { marked } from 'marked';

	let { data } = $props();

	let content = $state(data?.currentMeMd ?? ME_MD_TEMPLATE);
	let saving = $state(false);
	let saved = $state(false);
	let error = $state<string | null>(null);
	let activeTab = $state<'edit' | 'preview'>('edit');

	// Live-parse on every content change
	let parsed = $derived(parseMeMd(content));

	async function save() {
		saving = true;
		error = null;
		try {
			const res = await fetch('/api/me', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ content })
			});
			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				throw new Error(body.message ?? 'Failed to save');
			}
			saved = true;
			setTimeout(() => (saved = false), 3000);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Unknown error';
		} finally {
			saving = false;
		}
	}

	function renderMarkdown(md: string): string {
		return marked(md) as string;
	}

	// Keyboard shortcut: Cmd/Ctrl+S
	function onKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === 's') {
			e.preventDefault();
			save();
		}
	}
</script>

<svelte:head>
	<title>Edit ME.md — Loooom</title>
</svelte:head>

<svelte:window onkeydown={onKeydown} />

<div class="ambient">
	<div class="orb orb-1"></div>
</div>

<nav>
	<div class="nav-inner">
		<a href="/" class="logo">
			<YarnLogo size={22} />
			<span class="logo-text">loooom</span>
		</a>
		<div class="nav-center">
			<span class="breadcrumb-dim">ME.md</span>
			<span class="sep">/</span>
			<span class="breadcrumb-accent">edit</span>
		</div>
		<div class="nav-right">
			<ThemeToggle />
			{#if parsed.frontmatter.handle && parsed.frontmatter.handle !== 'unknown'}
				<a href="/me/{parsed.frontmatter.handle.replace('@', '')}" class="btn-ghost-sm">Preview ↗</a>
			{/if}
			<button class="btn-save" onclick={save} disabled={saving}>
				{saving ? 'Saving...' : saved ? '✓ Saved' : '⌘S Save'}
			</button>
		</div>
	</div>
</nav>

<div class="editor-layout">

	<!-- Left: Editor -->
	<div class="editor-pane">
		<div class="pane-header">
			<div class="tabs">
				<button class="tab" class:active={activeTab === 'edit'} onclick={() => activeTab = 'edit'}>
					Editor
				</button>
				<button class="tab" class:active={activeTab === 'preview'} onclick={() => activeTab = 'preview'}>
					Preview
				</button>
			</div>
			<span class="char-count">{content.length} chars</span>
		</div>

		{#if activeTab === 'edit'}
			<textarea
				class="editor"
				bind:value={content}
				spellcheck={false}
				placeholder={ME_MD_TEMPLATE}
			></textarea>
		{:else}
			<div class="preview-pane">
				{#each parsed.sections as section}
					<div class="preview-section">
						<h2 class="preview-h2">
							{#if section.icon}<span>{section.icon}</span>{/if}
							{section.title}
						</h2>
						<div class="prose">
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html renderMarkdown(section.content)}
						</div>
					</div>
				{/each}
				{#if parsed.sections.length === 0}
					<div class="preview-empty">
						<p>No sections parsed yet. Add <code># Section Headers</code> to your ME.md.</p>
					</div>
				{/if}
			</div>
		{/if}

		{#if error}
			<div class="error-bar">{error}</div>
		{/if}
	</div>

	<!-- Right: Live metadata sidebar -->
	<aside class="meta-sidebar">
		<div class="meta-section">
			<h4 class="meta-label">Parsed Frontmatter</h4>
			{#if parsed.frontmatter.handle && parsed.frontmatter.handle !== 'unknown'}
				<div class="meta-row">
					<span class="meta-key">handle</span>
					<span class="meta-val accent">{parsed.frontmatter.handle}</span>
				</div>
			{/if}
			{#if parsed.frontmatter.name}
				<div class="meta-row">
					<span class="meta-key">name</span>
					<span class="meta-val">{parsed.frontmatter.name}</span>
				</div>
			{/if}
			{#if parsed.frontmatter.location}
				<div class="meta-row">
					<span class="meta-key">location</span>
					<span class="meta-val">{parsed.frontmatter.location}</span>
				</div>
			{/if}
			{#if parsed.frontmatter.version}
				<div class="meta-row">
					<span class="meta-key">version</span>
					<span class="meta-val">{parsed.frontmatter.version}</span>
				</div>
			{/if}
			{#if parsed.frontmatter.tags && parsed.frontmatter.tags.length > 0}
				<div class="meta-row meta-row-wrap">
					<span class="meta-key">tags</span>
					<div class="tag-pills">
						{#each parsed.frontmatter.tags as tag}
							<span class="tag-pill">{tag}</span>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		{#if parsed.frontmatter.agents && parsed.frontmatter.agents.length > 0}
			<div class="meta-section">
				<h4 class="meta-label">Fleet ({parsed.frontmatter.agents.length} agents)</h4>
				{#each parsed.frontmatter.agents as agent}
					<div class="agent-row">
						<span class="agent-emoji">{agent.emoji ?? '🤖'}</span>
						<div>
							<div class="agent-id">{agent.id}</div>
							{#if agent.role}<div class="agent-role">{agent.role}</div>{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}

		<div class="meta-section">
			<h4 class="meta-label">Sections ({parsed.sections.length} found)</h4>
			{#each parsed.sections as section}
				<div class="section-row">
					<span class="section-icon">{section.icon ?? '📄'}</span>
					<span class="section-name">{section.title}</span>
					<span class="section-len">{section.content.length}c</span>
				</div>
			{/each}
			{#if parsed.sections.length === 0}
				<p class="no-sections">No sections yet. Use <code># Headers</code> to create them.</p>
			{/if}
		</div>

		<!-- Standard sections guide -->
		<div class="meta-section">
			<h4 class="meta-label">Standard Sections</h4>
			<div class="guide">
				{#each KNOWN_SECTIONS as s}
					<div class="guide-item" class:found={parsed.sections.some(sec => sec.id === s.id)}>
						<span class="guide-icon">{s.icon}</span>
						<div>
							<div class="guide-title"># {s.title}</div>
							<div class="guide-hint">{s.hint}</div>
						</div>
						{#if parsed.sections.some(sec => sec.id === s.id)}
							<span class="guide-check">✓</span>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<!-- Validation -->
		{#if parsed.errors.length > 0}
			<div class="validation-errors">
				<h4 class="meta-label">Validation Issues</h4>
				{#each parsed.errors as err}
					<div class="val-error">⚠ {err}</div>
				{/each}
			</div>
		{:else}
			<div class="validation-ok">✓ Valid ME.md</div>
		{/if}
	</aside>
</div>

<style>
	.ambient { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
	.orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.1; }
	.orb-1 {
		width: 500px; height: 500px;
		background: radial-gradient(circle, var(--violet) 0%, transparent 70%);
		top: -100px; right: -100px;
	}

	nav {
		position: sticky; top: 0; z-index: 100;
		background: var(--nav-bg); backdrop-filter: blur(12px);
		border-bottom: 1px solid var(--border);
	}
	.nav-inner {
		padding: 10px 24px;
		display: flex; align-items: center; justify-content: space-between;
	}
	.logo { display: flex; align-items: center; gap: 8px; text-decoration: none; color: var(--text-primary); }
	.logo-text { font-family: var(--font-handwriting); font-size: 1.1rem; font-weight: 200; }
	.nav-center { display: flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 0.85rem; }
	.breadcrumb-dim { color: var(--text-muted); }
	.sep { color: var(--border); }
	.breadcrumb-accent { color: var(--accent); }
	.nav-right { display: flex; align-items: center; gap: 12px; }
	.btn-ghost-sm {
		font-size: 0.82rem; color: var(--text-muted); font-family: var(--font-mono);
		text-decoration: none; padding: 4px 10px; border-radius: 6px;
		border: 1px solid var(--border); transition: all 0.2s;
	}
	.btn-ghost-sm:hover { color: var(--accent); border-color: var(--accent); }
	.btn-save {
		background: var(--gradient-cta); border: none; color: white;
		padding: 8px 20px; border-radius: 999px; font-size: 0.85rem;
		font-weight: 600; cursor: pointer; transition: opacity 0.2s;
	}
	.btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
	.btn-save:not(:disabled):hover { opacity: 0.85; }

	.editor-layout {
		display: grid;
		grid-template-columns: 1fr 320px;
		height: calc(100vh - 49px);
		position: relative; z-index: 1;
	}

	/* Editor pane */
	.editor-pane {
		display: flex; flex-direction: column;
		border-right: 1px solid var(--border);
		overflow: hidden;
	}
	.pane-header {
		display: flex; align-items: center; justify-content: space-between;
		padding: 10px 16px;
		border-bottom: 1px solid var(--border);
		background: var(--bg-secondary);
		flex-shrink: 0;
	}
	.tabs { display: flex; gap: 4px; }
	.tab {
		padding: 5px 14px; border-radius: 6px;
		background: none; border: 1px solid transparent;
		color: var(--text-muted); font-size: 0.82rem;
		cursor: pointer; transition: all 0.15s;
	}
	.tab.active { background: var(--bg-card); border-color: var(--border); color: var(--text-primary); }
	.char-count { font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); }

	.editor {
		flex: 1; resize: none;
		font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.7;
		background: var(--bg-primary); color: var(--text-primary);
		border: none; outline: none;
		padding: 24px 32px;
		tab-size: 2;
	}

	.preview-pane {
		flex: 1; overflow-y: auto;
		padding: 32px;
	}
	.preview-section { margin-bottom: 40px; }
	.preview-h2 { font-size: 1.3rem; margin: 0 0 16px; display: flex; align-items: center; gap: 8px; }
	.preview-empty { color: var(--text-muted); font-size: 0.9rem; padding: 40px; text-align: center; }
	.preview-empty code {
		font-family: var(--font-mono);
		background: var(--bg-secondary);
		padding: 2px 6px;
		border-radius: 4px;
		color: var(--accent);
	}

	.error-bar {
		background: rgba(244, 63, 94, 0.1);
		border-top: 1px solid rgba(244, 63, 94, 0.3);
		color: var(--rose);
		padding: 10px 24px;
		font-size: 0.82rem;
		flex-shrink: 0;
	}

	/* Prose */
	.prose :global(p) { color: var(--text-secondary); line-height: 1.7; margin: 0 0 1em; }
	.prose :global(ul), .prose :global(ol) { color: var(--text-secondary); padding-left: 1.4em; margin: 0 0 1em; }
	.prose :global(li) { margin-bottom: 0.3em; }
	.prose :global(strong) { color: var(--text-primary); }
	.prose :global(code) {
		font-family: var(--font-mono); font-size: 0.85em;
		background: var(--bg-secondary); padding: 2px 6px; border-radius: 4px; color: var(--accent);
	}
	.prose :global(table) { width: 100%; border-collapse: collapse; font-size: 0.875rem; margin-bottom: 1em; }
	.prose :global(th) { background: var(--bg-secondary); border: 1px solid var(--border); padding: 8px 12px; text-align: left; font-size: 0.78rem; text-transform: uppercase; color: var(--text-muted); }
	.prose :global(td) { border: 1px solid var(--border); padding: 8px 12px; color: var(--text-secondary); }

	/* Meta sidebar */
	.meta-sidebar {
		overflow-y: auto; padding: 20px 16px;
		display: flex; flex-direction: column; gap: 20px;
		background: var(--bg-secondary);
	}
	.meta-section { display: flex; flex-direction: column; gap: 8px; }
	.meta-label {
		font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.12em;
		color: var(--text-muted); font-weight: 700; margin: 0;
		padding-bottom: 6px; border-bottom: 1px solid var(--border);
	}
	.meta-row { display: flex; align-items: center; gap: 8px; font-size: 0.82rem; }
	.meta-row-wrap { align-items: flex-start; flex-wrap: wrap; }
	.meta-key { color: var(--text-muted); font-family: var(--font-mono); font-size: 0.78rem; flex-shrink: 0; }
	.meta-val { color: var(--text-secondary); }
	.meta-val.accent { color: var(--accent); font-family: var(--font-mono); }
	.tag-pills { display: flex; flex-wrap: wrap; gap: 4px; }
	.tag-pill {
		background: var(--accent-glow); border: 1px solid var(--accent-bright);
		color: var(--accent); padding: 1px 8px; border-radius: 999px; font-size: 0.72rem;
	}

	.agent-row { display: flex; align-items: flex-start; gap: 8px; font-size: 0.82rem; }
	.agent-emoji { font-size: 1rem; }
	.agent-id { font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-primary); }
	.agent-role { font-size: 0.75rem; color: var(--text-muted); }

	.section-row { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; }
	.section-icon { font-size: 0.85rem; }
	.section-name { flex: 1; color: var(--text-secondary); }
	.section-len { font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted); }
	.no-sections { font-size: 0.8rem; color: var(--text-muted); margin: 0; }
	.no-sections code { font-family: var(--font-mono); background: var(--bg-primary); padding: 1px 5px; border-radius: 3px; color: var(--accent); }

	/* Guide */
	.guide { display: flex; flex-direction: column; gap: 6px; }
	.guide-item {
		display: flex; align-items: flex-start; gap: 8px;
		padding: 7px 8px; border-radius: 6px;
		font-size: 0.78rem; opacity: 0.55;
		transition: opacity 0.2s;
	}
	.guide-item.found { opacity: 1; background: var(--accent-glow); }
	.guide-icon { font-size: 0.85rem; flex-shrink: 0; }
	.guide-title { color: var(--text-primary); font-family: var(--font-mono); font-size: 0.75rem; }
	.guide-hint { color: var(--text-muted); font-size: 0.72rem; margin-top: 2px; }
	.guide-check { margin-left: auto; color: var(--emerald); font-weight: 700; }

	/* Validation */
	.validation-errors { display: flex; flex-direction: column; gap: 6px; }
	.val-error { color: var(--rose); font-size: 0.78rem; }
	.validation-ok {
		background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3);
		color: var(--emerald); font-size: 0.8rem; padding: 8px 12px; border-radius: 8px;
		font-weight: 600;
	}
</style>
