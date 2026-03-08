<script lang="ts">
	import YarnLogo from '$lib/components/YarnLogo.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import {
		ME_MD_TEMPLATE,
		parseMeMd,
		KNOWN_SECTIONS,
		defaultFormState,
		formStateFromParsed,
		markdownFromFormState,
		type MeMdFormState,
		type AgentConfig
	} from '$lib/memd';
	import { marked } from 'marked';

	let { data } = $props();

	type EditorMode = 'form' | 'raw' | 'preview';

	// ── Editor mode ──────────────────────────────────────────────────────────
	let editorMode = $state<EditorMode>('form');

	// ── Form state ────────────────────────────────────────────────────────────
	let formState = $state<MeMdFormState>(
		data.currentMeMd
			? formStateFromParsed(parseMeMd(data.currentMeMd))
			: defaultFormState()
	);

	// ── Raw content ───────────────────────────────────────────────────────────
	let rawContent = $state(data.currentMeMd ?? ME_MD_TEMPLATE);

	// ── Tag input ─────────────────────────────────────────────────────────────
	let tagInput = $state('');

	// ── Versions ──────────────────────────────────────────────────────────────
	let versions = $state(data.versions ?? []);
	let restoringId = $state<string | null>(null);

	// ── Save state ────────────────────────────────────────────────────────────
	let saving = $state(false);
	let saved = $state(false);
	let saveError = $state<string | null>(null);
	let labelInput = $state('');
	let showLabelInput = $state(false);

	// ── Preview parse ─────────────────────────────────────────────────────────
	let parsedFromRaw = $derived(parseMeMd(rawContent));

	// ── Live content (used for save) ──────────────────────────────────────────
	function getLiveContent(): string {
		return editorMode === 'raw' ? rawContent : markdownFromFormState(formState);
	}

	// ── Parsed for sidebar meta (when in form mode, derive from form) ─────────
	let sidebarParsed = $derived(
		editorMode === 'raw'
			? parsedFromRaw
			: parseMeMd(markdownFromFormState(formState))
	);

	// ── Mode switch ───────────────────────────────────────────────────────────
	function switchMode(newMode: EditorMode) {
		if (newMode === editorMode) return;
		if (newMode === 'raw' && editorMode === 'form') {
			rawContent = markdownFromFormState(formState);
		} else if (newMode === 'form' && editorMode === 'raw') {
			formState = formStateFromParsed(parseMeMd(rawContent));
		} else if (newMode === 'preview' && editorMode === 'form') {
			rawContent = markdownFromFormState(formState);
		}
		editorMode = newMode;
	}

	// ── Save ──────────────────────────────────────────────────────────────────
	async function save() {
		saving = true;
		saveError = null;
		try {
			const content = getLiveContent();
			const res = await fetch('/api/me', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ content, label: labelInput || null })
			});
			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				throw new Error(body.message ?? 'Failed to save');
			}
			saved = true;
			labelInput = '';
			showLabelInput = false;
			setTimeout(() => (saved = false), 3000);
			// Refresh versions
			const vRes = await fetch('/api/me/versions');
			if (vRes.ok) {
				const vData = await vRes.json();
				versions = vData.versions;
			}
		} catch (e) {
			saveError = e instanceof Error ? e.message : 'Unknown error';
		} finally {
			saving = false;
		}
	}

	// ── Restore version ───────────────────────────────────────────────────────
	async function restoreVersion(id: string) {
		restoringId = id;
		try {
			const res = await fetch(`/api/me/versions/${id}/restore`, { method: 'POST' });
			if (!res.ok) throw new Error('Restore failed');
			// Reload the page to get fresh content
			window.location.reload();
		} catch (e) {
			alert('Restore failed. Try again.');
		} finally {
			restoringId = null;
		}
	}

	// ── Tag helpers ───────────────────────────────────────────────────────────
	function addTag() {
		const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
		if (tag && !formState.tags.includes(tag)) {
			formState.tags = [...formState.tags, tag];
		}
		tagInput = '';
	}

	function removeTag(tag: string) {
		formState.tags = formState.tags.filter((t) => t !== tag);
	}

	function onTagKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ',') {
			e.preventDefault();
			addTag();
		} else if (e.key === 'Backspace' && tagInput === '' && formState.tags.length > 0) {
			formState.tags = formState.tags.slice(0, -1);
		}
	}

	// ── Agent helpers ─────────────────────────────────────────────────────────
	function addAgent() {
		formState.agents = [
			...formState.agents,
			{ id: '', model: 'claude-sonnet-4-6', role: '', emoji: '🤖', channel: 'telegram' }
		];
	}

	function removeAgent(i: number) {
		formState.agents = formState.agents.filter((_, idx) => idx !== i);
	}

	// ── Misc ──────────────────────────────────────────────────────────────────
	function renderMarkdown(md: string): string {
		return marked(md) as string;
	}

	function relativeTime(date: string | Date): string {
		const ms = Date.now() - new Date(date).getTime();
		const mins = Math.floor(ms / 60000);
		if (mins < 1) return 'just now';
		if (mins < 60) return `${mins}m ago`;
		const hrs = Math.floor(mins / 60);
		if (hrs < 24) return `${hrs}h ago`;
		const days = Math.floor(hrs / 24);
		if (days < 7) return `${days}d ago`;
		return new Date(date).toLocaleDateString();
	}

	function autoresize(node: HTMLTextAreaElement) {
		function resize() {
			node.style.height = 'auto';
			node.style.height = Math.max(node.scrollHeight, 96) + 'px';
		}
		resize();
		node.addEventListener('input', resize);
		return { destroy() { node.removeEventListener('input', resize); } };
	}

	function onKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === 's') {
			e.preventDefault();
			save();
		}
	}

	const SECTION_COLORS: Record<string, string> = {
		'the-soul':      '#f43f5e',
		'the-heart':     '#f59e0b',
		'the-fleet':     '#8b5cf6',
		'the-stack':     '#0ea5e9',
		'anti-patterns': '#ef4444',
		'context':       '#10b981',
		'the-lore':      '#f97316'
	};
</script>

<svelte:head>
	<title>Edit ME.md — Loooom</title>
</svelte:head>

<svelte:window onkeydown={onKeydown} />

<div class="ambient">
	<div class="orb orb-1"></div>
	<div class="orb orb-2"></div>
</div>

<!-- ── Nav ── -->
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
			{#if sidebarParsed.frontmatter.handle && sidebarParsed.frontmatter.handle !== 'unknown'}
				<a href="/me/{sidebarParsed.frontmatter.handle.replace('@', '')}" class="btn-ghost-sm">
					Preview ↗
				</a>
			{/if}
			<button class="btn-label-toggle" onclick={() => (showLabelInput = !showLabelInput)} title="Add save label">
				🏷
			</button>
			<button class="btn-save" onclick={save} disabled={saving}>
				{saving ? 'Saving…' : saved ? '✓ Saved' : '⌘S Save'}
			</button>
		</div>
	</div>
	{#if showLabelInput}
		<div class="label-bar">
			<input
				class="label-input"
				bind:value={labelInput}
				placeholder="Optional version label (e.g. 'Added Japan trip context')"
				onkeydown={(e) => e.key === 'Enter' && save()}
			/>
			<span class="label-hint">Press Enter or ⌘S to save with this label</span>
		</div>
	{/if}
</nav>

<!-- ── Mode tabs ── -->
<div class="mode-bar">
	<div class="mode-tabs">
		<button class="mode-tab" class:active={editorMode === 'form'} onclick={() => switchMode('form')}>
			<span class="tab-icon">✦</span> Form
		</button>
		<button class="mode-tab" class:active={editorMode === 'raw'} onclick={() => switchMode('raw')}>
			<span class="tab-icon">{ '{' }</span> Raw
		</button>
		<button class="mode-tab" class:active={editorMode === 'preview'} onclick={() => switchMode('preview')}>
			<span class="tab-icon">◉</span> Preview
		</button>
	</div>
	{#if saveError}
		<span class="mode-error">⚠ {saveError}</span>
	{/if}
	{#if sidebarParsed.valid}
		<span class="mode-valid">✓ Valid ME.md</span>
	{:else}
		<span class="mode-invalid">⚠ {sidebarParsed.errors.length} issue{sidebarParsed.errors.length > 1 ? 's' : ''}</span>
	{/if}
</div>

<!-- ── Main layout ── -->
<div class="editor-layout">

	<!-- ── Content area ── -->
	<div class="content-area">

		<!-- FORM MODE -->
		{#if editorMode === 'form'}
			<div class="form-scroll">

				<!-- Identity card -->
				<div class="form-card identity-card">
					<div class="card-header">
						<span class="card-icon">🪪</span>
						<div>
							<div class="card-title">Your Identity</div>
							<div class="card-hint">The basics — who you are and how agents find you</div>
						</div>
					</div>
					<div class="identity-grid">
						<div class="field-group">
							<label class="field-label" for="f-handle">Handle <span class="required">*</span></label>
							<input
								id="f-handle"
								class="field-input handle-input"
								bind:value={formState.handle}
								placeholder="@yourhandle"
								spellcheck={false}
							/>
						</div>
						<div class="field-group">
							<label class="field-label" for="f-name">Display Name</label>
							<input
								id="f-name"
								class="field-input"
								bind:value={formState.name}
								placeholder="Your Name"
							/>
						</div>
						<div class="field-group">
							<label class="field-label" for="f-location">Location</label>
							<input
								id="f-location"
								class="field-input"
								bind:value={formState.location}
								placeholder="Chicago, IL"
							/>
						</div>
						<div class="field-group">
							<label class="field-label" for="f-timezone">Timezone</label>
							<input
								id="f-timezone"
								class="field-input"
								bind:value={formState.timezone}
								placeholder="America/Chicago"
								spellcheck={false}
							/>
						</div>
					</div>
					<div class="field-group mt-4">
						<label class="field-label">Tags</label>
						<div class="tag-editor">
							{#each formState.tags as tag}
								<span class="tag-chip">
									{tag}
									<button class="tag-remove" onclick={() => removeTag(tag)}>×</button>
								</span>
							{/each}
							<input
								class="tag-input"
								bind:value={tagInput}
								onkeydown={onTagKeydown}
								placeholder={formState.tags.length === 0 ? 'Type a tag and press Enter…' : '+ add tag'}
							/>
						</div>
						<div class="field-hint">Comma or Enter to add • Backspace to remove last</div>
					</div>
					<div class="field-group mt-4">
						<label class="field-label">
							<input type="checkbox" bind:checked={formState.isPublic} class="checkbox" />
							Public ME.md (AI agents can fetch and read this)
						</label>
					</div>
				</div>

				<!-- Fleet card -->
				<div class="form-card fleet-card">
					<div class="card-header">
						<span class="card-icon">🤖</span>
						<div>
							<div class="card-title">Your Agent Fleet</div>
							<div class="card-hint">The AI agents you run and what they do</div>
						</div>
					</div>
					{#if formState.agents.length > 0}
						<div class="fleet-table">
							<div class="fleet-header">
								<span>Emoji</span>
								<span>ID</span>
								<span>Model</span>
								<span>Role</span>
								<span>Channel</span>
								<span></span>
							</div>
							{#each formState.agents as agent, i}
								<div class="fleet-row">
									<input class="fleet-cell emoji-cell" bind:value={agent.emoji} placeholder="🤖" />
									<input class="fleet-cell" bind:value={agent.id} placeholder="mybot" spellcheck={false} />
									<input class="fleet-cell" bind:value={agent.model} placeholder="claude-sonnet-4-6" spellcheck={false} />
									<input class="fleet-cell" bind:value={agent.role} placeholder="Principal Engineer" />
									<input class="fleet-cell" bind:value={agent.channel} placeholder="telegram" spellcheck={false} />
									<button class="fleet-remove" onclick={() => removeAgent(i)} title="Remove agent">×</button>
								</div>
							{/each}
						</div>
					{:else}
						<p class="fleet-empty">No agents yet. Add your first agent below.</p>
					{/if}
					<button class="btn-add-agent" onclick={addAgent}>
						+ Add Agent
					</button>
				</div>

				<!-- Section cards -->
				{#each KNOWN_SECTIONS as section}
					<div
						class="form-card section-card"
						style="--section-color: {SECTION_COLORS[section.id] ?? '#8b5cf6'}"
					>
						<div class="card-header">
							<span class="card-icon">{section.icon}</span>
							<div>
								<div class="card-title">{section.title}</div>
								<div class="card-hint">{section.hint}</div>
							</div>
							<span class="char-badge">
								{(formState.sections[section.id] ?? '').length}c
							</span>
						</div>
						<textarea
							class="section-textarea"
							bind:value={formState.sections[section.id]}
							placeholder={`Write your ${section.title.toLowerCase()} here…`}
							use:autoresize
						></textarea>
					</div>
				{/each}

				<div class="form-spacer"></div>
			</div>

		<!-- RAW MODE -->
		{:else if editorMode === 'raw'}
			<div class="raw-pane">
				<div class="raw-header">
					<span class="mono-label">ME.md</span>
					<span class="char-count">{rawContent.length} chars</span>
				</div>
				<textarea
					class="raw-editor"
					bind:value={rawContent}
					spellcheck={false}
					placeholder={ME_MD_TEMPLATE}
				></textarea>
			</div>

		<!-- PREVIEW MODE -->
		{:else}
			<div class="preview-scroll">
				{#if sidebarParsed.sections.length > 0}
					<div class="preview-identity">
						{#if sidebarParsed.frontmatter.name}
							<h1 class="preview-name">{sidebarParsed.frontmatter.name}</h1>
						{/if}
						<div class="preview-meta">
							{#if sidebarParsed.frontmatter.handle}
								<span class="preview-handle">{sidebarParsed.frontmatter.handle}</span>
							{/if}
							{#if sidebarParsed.frontmatter.location}
								<span class="preview-sep">·</span>
								<span>{sidebarParsed.frontmatter.location}</span>
							{/if}
						</div>
						{#if sidebarParsed.frontmatter.tags && sidebarParsed.frontmatter.tags.length > 0}
							<div class="preview-tags">
								{#each sidebarParsed.frontmatter.tags as tag}
									<span class="preview-tag">{tag}</span>
								{/each}
							</div>
						{/if}
					</div>
					{#each sidebarParsed.sections as section}
						<div class="preview-section" style="--section-color: {SECTION_COLORS[section.id] ?? '#8b5cf6'}">
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
				{:else}
					<div class="preview-empty">
						<p>Nothing to preview yet. Fill in the Form or add sections in Raw mode.</p>
					</div>
				{/if}
			</div>
		{/if}

	</div>

	<!-- ── Sidebar ── -->
	<aside class="sidebar">

		<!-- Validation -->
		{#if sidebarParsed.errors.length > 0}
			<div class="sidebar-section validation-errors">
				<div class="sidebar-label">Issues</div>
				{#each sidebarParsed.errors as err}
					<div class="val-error">⚠ {err}</div>
				{/each}
			</div>
		{:else}
			<div class="validation-ok">✓ Valid ME.md</div>
		{/if}

		<!-- Parsed meta (collapsed in form mode since form IS the edit) -->
		{#if editorMode === 'raw'}
			<div class="sidebar-section">
				<div class="sidebar-label">Parsed</div>
				{#if sidebarParsed.frontmatter.handle !== 'unknown'}
					<div class="meta-row">
						<span class="meta-key">handle</span>
						<span class="meta-val accent">{sidebarParsed.frontmatter.handle}</span>
					</div>
				{/if}
				{#if sidebarParsed.frontmatter.name}
					<div class="meta-row">
						<span class="meta-key">name</span>
						<span class="meta-val">{sidebarParsed.frontmatter.name}</span>
					</div>
				{/if}
				<div class="meta-row">
					<span class="meta-key">sections</span>
					<span class="meta-val">{sidebarParsed.sections.length}</span>
				</div>
				<div class="meta-row">
					<span class="meta-key">agents</span>
					<span class="meta-val">{sidebarParsed.frontmatter.agents?.length ?? 0}</span>
				</div>
			</div>

			<!-- Section checklist -->
			<div class="sidebar-section">
				<div class="sidebar-label">Sections</div>
				{#each KNOWN_SECTIONS as s}
					<div class="guide-item" class:found={sidebarParsed.sections.some(sec => sec.id === s.id)}>
						<span>{s.icon}</span>
						<span class="guide-title">{s.title}</span>
						{#if sidebarParsed.sections.some(sec => sec.id === s.id)}
							<span class="guide-check">✓</span>
						{/if}
					</div>
				{/each}
			</div>
		{/if}

		<!-- Version history -->
		<div class="sidebar-section versions-section">
			<div class="sidebar-label">Version History</div>
			{#if versions.length === 0}
				<p class="versions-empty">Save to create your first version snapshot.</p>
			{:else}
				<div class="version-timeline">
					{#each versions as v, i}
						<div class="version-item" class:latest={i === 0}>
							<div class="version-dot" class:dot-latest={i === 0}></div>
							<div class="version-body">
								<div class="version-top">
									<span class="version-num">v{v.versionNum}</span>
									<span class="version-time">{relativeTime(v.createdAt)}</span>
								</div>
								{#if v.label}
									<div class="version-label-text">{v.label}</div>
								{/if}
								<div class="version-meta">{v.charCount.toLocaleString()} chars</div>
								{#if i > 0}
									<button
										class="version-restore"
										onclick={() => restoreVersion(v.id)}
										disabled={restoringId === v.id}
									>
										{restoringId === v.id ? 'Restoring…' : 'Restore'}
									</button>
								{:else}
									<span class="version-current">current</span>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Raw url copy -->
		{#if sidebarParsed.frontmatter.handle && sidebarParsed.frontmatter.handle !== 'unknown'}
			<div class="sidebar-section">
				<div class="sidebar-label">Raw URL</div>
				<div class="raw-url-row">
					<code class="raw-url">
						loooom.xyz/me/{sidebarParsed.frontmatter.handle.replace('@', '')}/raw
					</code>
					<button
						class="copy-btn"
						onclick={() => navigator.clipboard.writeText(`https://loooom.xyz/me/${sidebarParsed.frontmatter.handle.replace('@', '')}/raw`)}
					>
						Copy
					</button>
				</div>
			</div>
		{/if}

	</aside>
</div>

<style>
	/* ── Ambient ── */
	.ambient { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
	.orb { position: absolute; border-radius: 50%; filter: blur(100px); }
	.orb-1 {
		width: 600px; height: 600px; opacity: 0.06;
		background: radial-gradient(circle, var(--violet, #8b5cf6) 0%, transparent 70%);
		top: -150px; right: -100px;
	}
	.orb-2 {
		width: 400px; height: 400px; opacity: 0.04;
		background: radial-gradient(circle, var(--emerald, #10b981) 0%, transparent 70%);
		bottom: -100px; left: -50px;
	}

	/* ── Nav ── */
	nav {
		position: sticky; top: 0; z-index: 100;
		background: var(--nav-bg, rgba(250,246,240,0.9)); backdrop-filter: blur(12px);
		border-bottom: 1px solid var(--border, #e5e0d8);
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
	.nav-right { display: flex; align-items: center; gap: 10px; }
	.btn-ghost-sm {
		font-size: 0.82rem; color: var(--text-muted); font-family: var(--font-mono);
		text-decoration: none; padding: 4px 10px; border-radius: 6px;
		border: 1px solid var(--border); transition: all 0.2s;
	}
	.btn-ghost-sm:hover { color: var(--accent); border-color: var(--accent); }
	.btn-label-toggle {
		background: none; border: 1px solid var(--border); border-radius: 6px;
		padding: 5px 8px; cursor: pointer; font-size: 0.9rem;
		color: var(--text-muted); transition: all 0.2s;
	}
	.btn-label-toggle:hover { border-color: var(--accent); }
	.btn-save {
		background: var(--gradient-cta, linear-gradient(135deg, #8b5cf6, #06b6d4)); border: none; color: white;
		padding: 8px 20px; border-radius: 999px; font-size: 0.85rem;
		font-weight: 600; cursor: pointer; transition: opacity 0.2s;
	}
	.btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
	.btn-save:not(:disabled):hover { opacity: 0.85; }

	.label-bar {
		display: flex; align-items: center; gap: 12px;
		padding: 8px 24px; background: var(--bg-secondary, #f5f0ea);
		border-top: 1px solid var(--border);
	}
	.label-input {
		flex: 1; max-width: 400px;
		background: var(--bg-primary); border: 1px solid var(--border);
		border-radius: 6px; padding: 6px 12px;
		font-size: 0.82rem; color: var(--text-primary);
		font-family: var(--font-mono);
	}
	.label-input:focus { outline: none; border-color: var(--accent); }
	.label-hint { font-size: 0.75rem; color: var(--text-muted); }

	/* ── Mode bar ── */
	.mode-bar {
		display: flex; align-items: center; gap: 16px;
		padding: 0 24px;
		background: var(--bg-secondary, #f5f0ea);
		border-bottom: 1px solid var(--border);
		height: 44px;
		position: sticky; top: 49px; z-index: 90;
	}
	.mode-tabs { display: flex; gap: 2px; }
	.mode-tab {
		display: flex; align-items: center; gap: 6px;
		padding: 8px 16px; border-radius: 6px;
		background: none; border: none;
		color: var(--text-muted); font-size: 0.83rem; font-weight: 500;
		cursor: pointer; transition: all 0.15s;
		position: relative;
	}
	.mode-tab:hover { color: var(--text-primary); background: var(--bg-primary); }
	.mode-tab.active {
		color: var(--accent, #8b5cf6); background: var(--bg-primary);
		font-weight: 600;
	}
	.mode-tab.active::after {
		content: ''; position: absolute; bottom: -1px; left: 8px; right: 8px;
		height: 2px; background: var(--accent, #8b5cf6); border-radius: 1px;
	}
	.tab-icon { font-size: 0.7rem; opacity: 0.7; }
	.mode-valid { margin-left: auto; font-size: 0.75rem; color: var(--emerald, #10b981); font-weight: 600; }
	.mode-invalid { margin-left: auto; font-size: 0.75rem; color: var(--rose, #f43f5e); font-weight: 600; }
	.mode-error { font-size: 0.75rem; color: var(--rose, #f43f5e); }

	/* ── Main layout ── */
	.editor-layout {
		display: grid;
		grid-template-columns: 1fr 300px;
		height: calc(100vh - 93px); /* nav + mode-bar */
		position: relative; z-index: 1;
	}

	/* ── Content area ── */
	.content-area {
		overflow: hidden;
		display: flex; flex-direction: column;
		border-right: 1px solid var(--border);
	}

	/* ── Form mode ── */
	.form-scroll {
		flex: 1; overflow-y: auto;
		padding: 24px 32px;
		display: flex; flex-direction: column; gap: 20px;
	}
	.form-spacer { height: 48px; }

	.form-card {
		background: var(--bg-card, white);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 20px 24px;
		position: relative;
		overflow: hidden;
	}
	.section-card {
		border-left: 4px solid var(--section-color, #8b5cf6);
	}
	.fleet-card {
		border-left: 4px solid #8b5cf6;
	}

	.card-header {
		display: flex; align-items: flex-start; gap: 12px;
		margin-bottom: 16px;
	}
	.card-icon { font-size: 1.4rem; flex-shrink: 0; margin-top: 1px; }
	.card-title { font-size: 0.95rem; font-weight: 700; color: var(--text-primary); line-height: 1.2; }
	.card-hint { font-size: 0.78rem; color: var(--text-muted); margin-top: 2px; }
	.char-badge {
		margin-left: auto; font-family: var(--font-mono); font-size: 0.7rem;
		color: var(--text-muted); background: var(--bg-secondary);
		padding: 2px 7px; border-radius: 999px; flex-shrink: 0;
	}

	/* Identity grid */
	.identity-grid {
		display: grid; grid-template-columns: 1fr 1fr;
		gap: 14px;
	}
	.field-group { display: flex; flex-direction: column; gap: 5px; }
	.field-label {
		font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em;
		color: var(--text-muted); font-weight: 700;
		display: flex; align-items: center; gap: 4px;
	}
	.required { color: var(--rose, #f43f5e); }
	.field-input {
		background: var(--bg-primary); border: 1px solid var(--border);
		border-radius: 8px; padding: 8px 12px;
		font-size: 0.88rem; color: var(--text-primary);
		transition: border-color 0.15s;
		font-family: inherit;
	}
	.field-input:focus { outline: none; border-color: var(--accent, #8b5cf6); box-shadow: 0 0 0 3px rgba(139,92,246,0.1); }
	.handle-input { font-family: var(--font-mono); }
	.mt-4 { margin-top: 14px; }
	.field-hint { font-size: 0.72rem; color: var(--text-muted); margin-top: 3px; }

	/* Tag editor */
	.tag-editor {
		display: flex; flex-wrap: wrap; gap: 6px; align-items: center;
		background: var(--bg-primary); border: 1px solid var(--border);
		border-radius: 8px; padding: 8px 10px;
		min-height: 42px; cursor: text;
		transition: border-color 0.15s;
	}
	.tag-editor:focus-within { border-color: var(--accent, #8b5cf6); box-shadow: 0 0 0 3px rgba(139,92,246,0.1); }
	.tag-chip {
		display: flex; align-items: center; gap: 4px;
		background: var(--accent-glow, rgba(139,92,246,0.1));
		border: 1px solid rgba(139,92,246,0.3);
		color: var(--accent, #8b5cf6);
		padding: 2px 8px 2px 10px; border-radius: 999px;
		font-size: 0.78rem; font-weight: 500;
	}
	.tag-remove {
		background: none; border: none; cursor: pointer;
		color: inherit; font-size: 0.9rem; line-height: 1;
		padding: 0; opacity: 0.6;
	}
	.tag-remove:hover { opacity: 1; }
	.tag-input {
		background: none; border: none; outline: none;
		font-size: 0.82rem; color: var(--text-primary);
		min-width: 100px; flex: 1;
		font-family: inherit;
	}

	/* Checkbox */
	.checkbox { margin-right: 6px; accent-color: var(--accent, #8b5cf6); }

	/* Fleet table */
	.fleet-table { margin-bottom: 12px; }
	.fleet-header {
		display: grid;
		grid-template-columns: 52px 1fr 1.4fr 1.4fr 80px 28px;
		gap: 6px; padding: 0 4px 6px;
		font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.1em;
		color: var(--text-muted); font-weight: 700;
	}
	.fleet-row {
		display: grid;
		grid-template-columns: 52px 1fr 1.4fr 1.4fr 80px 28px;
		gap: 6px; padding: 4px;
		border-radius: 6px;
		transition: background 0.15s;
	}
	.fleet-row:hover { background: var(--bg-secondary); }
	.fleet-cell {
		background: var(--bg-primary); border: 1px solid var(--border);
		border-radius: 6px; padding: 6px 8px;
		font-size: 0.82rem; color: var(--text-primary);
		font-family: var(--font-mono); font-size: 0.78rem;
		transition: border-color 0.15s;
	}
	.fleet-cell:focus { outline: none; border-color: var(--accent, #8b5cf6); }
	.emoji-cell { text-align: center; font-size: 1rem; font-family: inherit; }
	.fleet-remove {
		background: none; border: none; cursor: pointer;
		color: var(--text-muted); font-size: 1rem; border-radius: 4px;
		transition: color 0.15s;
	}
	.fleet-remove:hover { color: var(--rose, #f43f5e); }
	.fleet-empty { color: var(--text-muted); font-size: 0.82rem; margin: 0 0 12px; font-style: italic; }
	.btn-add-agent {
		background: none; border: 1px dashed var(--border);
		border-radius: 8px; padding: 8px 16px;
		color: var(--text-muted); font-size: 0.82rem;
		cursor: pointer; width: 100%; transition: all 0.15s;
	}
	.btn-add-agent:hover {
		border-color: var(--accent, #8b5cf6);
		color: var(--accent, #8b5cf6);
		background: var(--accent-glow, rgba(139,92,246,0.05));
	}

	/* Section textarea */
	.section-textarea {
		width: 100%; resize: none; overflow: hidden;
		background: var(--bg-primary); border: 1px solid var(--border);
		border-radius: 8px; padding: 12px 16px;
		font-size: 0.88rem; color: var(--text-primary);
		line-height: 1.7; font-family: var(--font-mono);
		transition: border-color 0.15s;
		min-height: 96px; box-sizing: border-box;
	}
	.section-textarea:focus {
		outline: none;
		border-color: var(--section-color, #8b5cf6);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--section-color, #8b5cf6) 15%, transparent);
	}

	/* ── Raw mode ── */
	.raw-pane {
		flex: 1; display: flex; flex-direction: column; overflow: hidden;
	}
	.raw-header {
		display: flex; align-items: center; justify-content: space-between;
		padding: 10px 24px;
		border-bottom: 1px solid var(--border);
		background: var(--bg-secondary); flex-shrink: 0;
	}
	.mono-label { font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted); }
	.char-count { font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); }
	.raw-editor {
		flex: 1; resize: none;
		font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.7;
		background: var(--bg-primary); color: var(--text-primary);
		border: none; outline: none;
		padding: 24px 32px;
		tab-size: 2;
	}

	/* ── Preview mode ── */
	.preview-scroll {
		flex: 1; overflow-y: auto;
		padding: 40px 48px;
		max-width: 760px;
	}
	.preview-identity { margin-bottom: 40px; padding-bottom: 32px; border-bottom: 1px solid var(--border); }
	.preview-name { font-size: 2rem; font-weight: 700; margin: 0 0 8px; }
	.preview-meta { display: flex; align-items: center; gap: 8px; color: var(--text-muted); font-size: 0.9rem; margin-bottom: 12px; }
	.preview-handle { font-family: var(--font-mono); color: var(--accent); }
	.preview-sep { opacity: 0.4; }
	.preview-tags { display: flex; flex-wrap: wrap; gap: 6px; }
	.preview-tag {
		background: var(--bg-secondary); color: var(--text-muted);
		border: 1px solid var(--border);
		padding: 2px 10px; border-radius: 999px; font-size: 0.75rem;
	}
	.preview-section {
		margin-bottom: 40px;
		padding-left: 16px;
		border-left: 3px solid var(--section-color, #8b5cf6);
	}
	.preview-h2 { font-size: 1.2rem; margin: 0 0 12px; display: flex; align-items: center; gap: 8px; }
	.preview-empty { color: var(--text-muted); font-size: 0.9rem; padding: 60px 40px; text-align: center; }

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

	/* ── Sidebar ── */
	.sidebar {
		overflow-y: auto; padding: 16px;
		display: flex; flex-direction: column; gap: 16px;
		background: var(--bg-secondary, #f5f0ea);
	}
	.sidebar-section { display: flex; flex-direction: column; gap: 8px; }
	.sidebar-label {
		font-size: 0.67rem; text-transform: uppercase; letter-spacing: 0.12em;
		color: var(--text-muted); font-weight: 700;
		padding-bottom: 6px; border-bottom: 1px solid var(--border);
	}

	.validation-errors { }
	.val-error { color: var(--rose, #f43f5e); font-size: 0.78rem; }
	.validation-ok {
		background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3);
		color: var(--emerald, #10b981); font-size: 0.78rem;
		padding: 8px 12px; border-radius: 8px; font-weight: 600;
	}

	.meta-row { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; }
	.meta-key { color: var(--text-muted); font-family: var(--font-mono); font-size: 0.75rem; flex-shrink: 0; }
	.meta-val { color: var(--text-secondary); }
	.meta-val.accent { color: var(--accent); font-family: var(--font-mono); }

	/* Guide items */
	.guide-item {
		display: flex; align-items: center; gap: 7px;
		padding: 5px 6px; border-radius: 5px;
		font-size: 0.78rem; opacity: 0.45; transition: all 0.2s;
	}
	.guide-item.found { opacity: 1; background: var(--accent-glow, rgba(139,92,246,0.08)); }
	.guide-title { flex: 1; color: var(--text-secondary); }
	.guide-check { color: var(--emerald, #10b981); font-weight: 700; font-size: 0.7rem; }

	/* Version timeline */
	.versions-section { }
	.versions-empty { font-size: 0.78rem; color: var(--text-muted); font-style: italic; margin: 0; }
	.version-timeline {
		display: flex; flex-direction: column; gap: 0;
		position: relative;
		padding-left: 20px;
	}
	.version-timeline::before {
		content: ''; position: absolute; left: 7px; top: 8px; bottom: 8px;
		width: 2px; background: var(--border);
	}
	.version-item {
		display: flex; gap: 12px; align-items: flex-start;
		padding: 8px 0; position: relative;
	}
	.version-dot {
		width: 10px; height: 10px; border-radius: 50%;
		background: var(--border); border: 2px solid var(--bg-secondary);
		flex-shrink: 0; margin-top: 4px;
		position: absolute; left: -16px;
	}
	.dot-latest {
		background: var(--accent, #8b5cf6);
		box-shadow: 0 0 0 3px rgba(139,92,246,0.2);
	}
	.version-body { flex: 1; }
	.version-top { display: flex; align-items: center; gap: 6px; }
	.version-num { font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700; color: var(--text-primary); }
	.version-time { font-size: 0.72rem; color: var(--text-muted); }
	.version-label-text { font-size: 0.75rem; color: var(--accent); margin-top: 2px; font-style: italic; }
	.version-meta { font-size: 0.7rem; color: var(--text-muted); margin-top: 2px; }
	.version-current {
		display: inline-block; margin-top: 4px;
		font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.1em;
		color: var(--emerald, #10b981); font-weight: 700;
	}
	.version-restore {
		display: block; margin-top: 5px;
		background: none; border: 1px solid var(--border);
		border-radius: 4px; padding: 2px 8px;
		font-size: 0.72rem; color: var(--text-muted);
		cursor: pointer; transition: all 0.15s;
	}
	.version-restore:hover:not(:disabled) {
		border-color: var(--accent, #8b5cf6);
		color: var(--accent, #8b5cf6);
	}
	.version-restore:disabled { opacity: 0.5; cursor: not-allowed; }

	/* Raw URL */
	.raw-url-row { display: flex; align-items: center; gap: 6px; }
	.raw-url {
		flex: 1; font-family: var(--font-mono); font-size: 0.68rem;
		color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
	}
	.copy-btn {
		background: none; border: 1px solid var(--border);
		border-radius: 4px; padding: 2px 8px;
		font-size: 0.72rem; color: var(--text-muted);
		cursor: pointer; flex-shrink: 0; transition: all 0.15s;
	}
	.copy-btn:hover { border-color: var(--accent); color: var(--accent); }
</style>
