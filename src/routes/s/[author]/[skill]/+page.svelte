<script lang="ts">
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import { marked } from 'marked';

	let { data } = $props();
	let activeFile = $state(0);
	let showInstall = $state(false);
	let copiedSkill = $state(false);
	let copiedCli = $state(false);

	// Find the primary SKILL.md file
	const skillMdIndex = data.skill.files.findIndex((f: { name: string }) => f.name === 'SKILL.md');
	const hasSkillMd = skillMdIndex !== -1;

	// Strip frontmatter from SKILL.md before rendering (frontmatter is already shown in page header)
	function stripFrontmatter(content: string): string {
		const lines = content.split('\n');
		if (lines[0]?.trim() === '---') {
			const endIdx = lines.slice(1).findIndex(l => l.trim() === '---');
			if (endIdx !== -1) {
				return lines.slice(endIdx + 2).join('\n').trim();
			}
		}
		return content;
	}
	const renderedSkillMd = hasSkillMd ? marked.parse(stripFrontmatter(data.skill.files[skillMdIndex].content)) : '';
	// Non-SKILL.md files for the raw code viewer
	const otherFiles = data.skill.files.filter((_: unknown, i: number) => i !== skillMdIndex);

	function relativeTime(iso: string): string {
		const diff = Date.now() - new Date(iso).getTime();
		const days = Math.floor(diff / 86400000);
		if (days < 1) return 'today';
		if (days === 1) return 'yesterday';
		if (days < 7) return `${days} days ago`;
		if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
		return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
	}

	function fileIcon(name: string): string {
		if (name.endsWith('.md')) return '📄';
		if (name.endsWith('.sh')) return '⚡';
		if (name.endsWith('.py')) return '🐍';
		if (name.endsWith('.js') || name.endsWith('.ts')) return '📦';
		return '📄';
	}

	function getSkillContent(): string {
		const skillFile = data.skill.files.find(f => f.name === 'SKILL.md') ?? data.skill.files[0];
		return skillFile?.content ?? '';
	}

	async function copySkillContent() {
		await navigator.clipboard.writeText(getSkillContent());
		copiedSkill = true;
		setTimeout(() => copiedSkill = false, 2000);
	}

	async function copyCli() {
		const cmd = `npx loooom add ${data.author.username}/${data.skill.name}`;
		await navigator.clipboard.writeText(cmd);
		copiedCli = true;
		setTimeout(() => copiedCli = false, 2000);
	}

	function handleClickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('.install-wrap')) {
			showInstall = false;
		}
	}

	$effect(() => {
		if (showInstall) {
			document.addEventListener('click', handleClickOutside, true);
			return () => document.removeEventListener('click', handleClickOutside, true);
		}
	});
</script>

<svelte:head>
	<title>{data.skill.title} by {data.author.displayName} — Loooom</title>
	<meta name="description" content={data.skill.description || `A skill by ${data.author.displayName} on Loooom`} />
</svelte:head>

<div class="ambient">
	<div class="orb orb-1"></div>
	<div class="orb orb-2"></div>
</div>

<Nav />

<section class="skill-page">
	<div class="skill-inner">
		<!-- Back link -->
		<a href="/u/{data.author.username}" class="back-link">← {data.author.displayName}'s profile</a>

		<!-- Header -->
		<div class="skill-header">
			{#if data.skill.category}
				<span class="skill-category">{data.skill.category}</span>
			{/if}
			<h1 class="handwriting">{data.skill.title}</h1>
			{#if data.skill.description}
				<p class="skill-desc">{data.skill.description}</p>
			{/if}
			
			<!-- Author byline -->
			<div class="byline">
				<a href="/u/{data.author.username}" class="byline-author">
					<span class="byline-avatar">
						{#if data.author.avatarUrl}
							<img src={data.author.avatarUrl} alt={data.author.displayName} />
						{:else}
							{data.author.displayName[0]}
						{/if}
					</span>
					<span class="byline-name">{data.author.displayName}</span>
					{#if data.author.verified}
						<span class="verified" title="Verified">✓</span>
					{/if}
				</a>
				<span class="byline-dot">·</span>
				<span class="byline-meta">v{data.skill.version}</span>
				<span class="byline-dot">·</span>
				<span class="byline-meta">{data.skill.installs.toLocaleString()} uses</span>
				<span class="byline-dot">·</span>
				<span class="byline-meta">Updated {relativeTime(data.skill.updatedAt)}</span>
				
				{#if data.isOwner}
					<span class="byline-dot">·</span>
					<a href="/edit/{data.skill.id}" class="byline-edit">Edit</a>
				{/if}
			</div>
		</div>

		<!-- Install button -->
		{#if data.skill.files.length > 0}
			<div class="install-bar">
				<div class="install-wrap">
					<button class="btn-install" onclick={() => showInstall = !showInstall}>
						Install
						<svg class="install-arrow" class:open={showInstall} viewBox="0 0 12 12" width="12" height="12">
							<path fill="currentColor" d="M6 8L1 3h10z"/>
						</svg>
					</button>
					
					{#if showInstall}
						<div class="install-popover">
							<div class="install-option">
								<span class="install-label">CLI</span>
								<button class="install-copy" onclick={copyCli}>
									<code>npx loooom add {data.author.username}/{data.skill.name}</code>
									<span class="copy-hint">{copiedCli ? '✓' : 'copy'}</span>
								</button>
							</div>
							<div class="install-divider"></div>
							<div class="install-option">
								<span class="install-label">Manual</span>
								<button class="install-copy" onclick={copySkillContent}>
									<span>Copy SKILL.md content</span>
									<span class="copy-hint">{copiedSkill ? '✓' : 'copy'}</span>
								</button>
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Rendered SKILL.md -->
		{#if hasSkillMd}
			<div class="prose">
				{@html renderedSkillMd}
			</div>
		{/if}

		<!-- Other files (raw code viewer) -->
		{#if otherFiles.length > 0}
			<div class="files-section">
				<div class="files-header">
					<div class="file-tabs">
						{#each otherFiles as file, i}
							<button
								class="file-tab"
								class:active={activeFile === i}
								onclick={() => activeFile = i}
							>
								<span class="file-icon">{fileIcon(file.name)}</span>
								{file.name}
							</button>
						{/each}
					</div>
				</div>

				<div class="code-viewer">
					<div class="code-header">
						<span class="code-filename">{otherFiles[activeFile].name}</span>
						<button class="code-copy" onclick={() => navigator.clipboard.writeText(otherFiles[activeFile].content)}>
							Copy
						</button>
					</div>
					<pre class="code-content"><code>{otherFiles[activeFile].content}</code></pre>
				</div>
			</div>
		{/if}

		<!-- Version hash -->
		<div class="version-hash">
			<span class="hash-label">Content Hash</span>
			<span class="hash-value">{data.skill.contentHash || 'sha256:...'}</span>
			<span class="hash-sep">·</span>
			<span class="hash-label">Version</span>
			<span class="hash-value">v{data.skill.version}</span>
		</div>
	</div>
</section>

<style>
	.ambient { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
	.orb { position: absolute; border-radius: 50%; filter: blur(140px); opacity: 0.06; }
	:global(html[data-theme="dark"]) .orb { opacity: 0.12; }
	.orb-1 { width: 500px; height: 500px; background: var(--ocean); top: -100px; right: -100px; animation: drift 25s ease-in-out infinite; opacity: 0.08; }
	.orb-2 { width: 400px; height: 400px; background: var(--indigo); bottom: 10%; left: -100px; animation: drift 30s ease-in-out infinite reverse; opacity: 0.06; }
	@keyframes drift { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, -20px); } }

	nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; backdrop-filter: blur(20px); background: var(--nav-bg); border-bottom: 1px solid var(--border); }
	.nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 2rem; height: 64px; display: flex; align-items: center; justify-content: space-between; }
	.logo { display: flex; align-items: center; gap: 0.5rem; color: var(--text-primary); }
	.logo:hover { color: var(--text-primary); }
	.logo-text { font-family: var(--font-handwriting); font-size: 1.3rem; font-weight: 100; letter-spacing: 0.02em; }
	.nav-right { display: flex; align-items: center; gap: 1.5rem; }
	.nav-right a { color: var(--text-secondary); font-size: 0.9rem; font-weight: 500; transition: color 0.2s; }
	.nav-right a:hover { color: var(--text-primary); }
	.btn-nav { background: var(--bg-card); color: var(--text-primary) !important; border: 1px solid var(--border); padding: 0.5rem 1.25rem; border-radius: var(--radius-sm); font-size: 0.875rem; font-weight: 500; transition: all 0.2s; text-decoration: none; }
	.btn-nav:hover { border-color: var(--text-secondary); }

	.handwriting { font-family: var(--font-handwriting); font-weight: 100; text-shadow: 0 0.5px 0 rgba(0,0,0,0.06); }
	:global(html[data-theme="dark"]) .handwriting { text-shadow: 0 0.5px 0 rgba(255,255,255,0.08); }

	.skill-page { position: relative; z-index: 1; min-height: 100vh; padding: 7rem 2rem 4rem; }
	.skill-inner { max-width: 900px; margin: 0 auto; }

	.back-link { display: inline-block; font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.5rem; transition: color 0.2s; }
	.back-link:hover { color: var(--ocean); }

	.skill-header { margin-bottom: 2rem; }
	.skill-category { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: var(--text-muted); margin-bottom: 0.5rem; display: inline-block; }
	.skill-header h1 { font-size: clamp(2rem, 4vw, 3rem); margin-bottom: 0.75rem; color: var(--text-primary); }
	.skill-desc { font-size: 1.1rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1.25rem; }

	/* Byline - compact author info */
	.byline { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; font-size: 0.85rem; }
	.byline-author { display: flex; align-items: center; gap: 0.5rem; color: var(--text-primary); text-decoration: none; transition: opacity 0.2s; }
	.byline-author:hover { opacity: 0.8; }
	.byline-avatar { width: 24px; height: 24px; border-radius: 50%; background: linear-gradient(135deg, var(--ocean), var(--indigo)); display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: white; font-weight: 500; overflow: hidden; }
	.byline-avatar img { width: 100%; height: 100%; object-fit: cover; }
	.byline-name { font-weight: 500; }
	.verified { display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; border-radius: 50%; background: var(--emerald); color: white; font-size: 0.5rem; font-weight: 700; margin-left: -0.1rem; }
	.byline-dot { color: var(--text-muted); }
	.byline-meta { color: var(--text-muted); }
	.byline-edit { color: var(--ocean); text-decoration: none; }
	.byline-edit:hover { text-decoration: underline; }

	/* Install bar */
	.install-bar { display: flex; justify-content: flex-end; margin-bottom: 2rem; }

	/* Prose — rendered SKILL.md */
	.prose { margin-bottom: 3rem; color: var(--text-secondary); line-height: 1.7; font-size: 1rem; }
	.prose :global(h1) { font-family: var(--font-handwriting); font-weight: 100; font-size: 2rem; color: var(--text-primary); margin: 2.5rem 0 1rem; line-height: 1.15; }
	.prose :global(h2) { font-size: 1.35rem; font-weight: 700; color: var(--text-primary); margin: 2.25rem 0 0.75rem; letter-spacing: -0.01em; padding-bottom: 0.4rem; border-bottom: 1px solid var(--border); }
	.prose :global(h3) { font-size: 1.1rem; font-weight: 600; color: var(--text-primary); margin: 1.75rem 0 0.5rem; }
	.prose :global(p) { margin: 0 0 1rem; }
	.prose :global(ul), .prose :global(ol) { margin: 0 0 1rem; padding-left: 1.5rem; }
	.prose :global(li) { margin-bottom: 0.35rem; }
	.prose :global(li > ul), .prose :global(li > ol) { margin-top: 0.35rem; margin-bottom: 0; }
	.prose :global(strong) { color: var(--text-primary); font-weight: 600; }
	.prose :global(a) { color: var(--ocean); text-decoration: none; border-bottom: 1px solid transparent; transition: border-color 0.2s; }
	.prose :global(a:hover) { border-bottom-color: var(--ocean); }
	.prose :global(hr) { border: none; border-top: 1px solid var(--border); margin: 2rem 0; }
	.prose :global(blockquote) { border-left: 3px solid var(--accent); margin: 1rem 0; padding: 0.5rem 1rem; background: var(--bg-card); border-radius: 0 var(--radius-sm) var(--radius-sm) 0; color: var(--text-secondary); }
	/* Inline code */
	.prose :global(code) { font-family: var(--font-mono); font-size: 0.85em; background: var(--bg-card); border: 1px solid var(--border); padding: 0.15em 0.4em; border-radius: 4px; color: var(--text-primary); }
	/* Code blocks */
	.prose :global(pre) { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 1.25rem 1.5rem; overflow-x: auto; margin: 0 0 1.25rem; line-height: 1.5; }
	.prose :global(pre code) { background: none; border: none; padding: 0; border-radius: 0; font-size: 0.85rem; color: var(--text-secondary); }
	/* Tables */
	.prose :global(table) { width: 100%; border-collapse: collapse; margin: 0 0 1.25rem; font-size: 0.9rem; overflow-x: auto; display: block; }
	.prose :global(th), .prose :global(td) { padding: 0.6rem 1rem; border: 1px solid var(--border); text-align: left; }
	.prose :global(th) { background: var(--bg-card); font-weight: 600; color: var(--text-primary); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; }
	.prose :global(td) { background: var(--bg-primary); }
	.prose :global(td code) { font-size: 0.8em; }

	/* Files section — other files */
	.files-section { margin-bottom: 1rem; }
	.files-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); }
	.file-tabs { display: flex; gap: 0; }
	.file-tab {
		display: flex; align-items: center; gap: 0.4rem;
		padding: 0.75rem 1.25rem; background: none; border: none;
		border-bottom: 2px solid transparent; color: var(--text-secondary);
		font-family: var(--font-mono); font-size: 0.8rem; cursor: pointer; transition: all 0.2s;
	}
	.file-tab:hover { color: var(--text-primary); background: var(--bg-card-hover); }
	.file-tab.active { color: var(--text-primary); border-bottom-color: var(--accent); }
	.file-icon { font-size: 0.9rem; }

	/* Compact install dropdown */
	.install-wrap { position: relative; padding-right: 0.5rem; }
	.btn-install {
		display: inline-flex; align-items: center; gap: 0.4rem;
		padding: 0.4rem 0.75rem; background: var(--bg-card); color: var(--text-secondary);
		border: 1px solid var(--border); border-radius: var(--radius-sm);
		font-family: var(--font-mono); font-size: 0.75rem; font-weight: 500;
		cursor: pointer; transition: all 0.2s;
	}
	.btn-install:hover { border-color: var(--text-muted); color: var(--text-primary); }
	.install-arrow { transition: transform 0.2s; opacity: 0.7; }
	.install-arrow.open { transform: rotate(180deg); }

	.install-popover {
		position: absolute; top: calc(100% + 0.4rem); right: 0;
		width: 320px; max-width: 90vw;
		background: var(--bg-card); border: 1px solid var(--border);
		border-radius: var(--radius-md); box-shadow: 0 8px 32px rgba(0,0,0,0.12);
		padding: 0.75rem; z-index: 200;
		animation: popoverIn 0.12s ease-out;
	}
	@keyframes popoverIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }

	.install-option { display: flex; flex-direction: column; gap: 0.35rem; }
	.install-divider { height: 1px; background: var(--border); margin: 0.5rem 0; }
	.install-label {
		font-family: var(--font-mono); font-size: 0.6rem; font-weight: 600;
		text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted);
	}
	.install-copy {
		display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;
		width: 100%; padding: 0.5rem 0.6rem;
		background: var(--bg-secondary); border: 1px solid var(--border);
		border-radius: var(--radius-sm); cursor: pointer; transition: all 0.2s;
		text-align: left;
	}
	.install-copy:hover { border-color: var(--text-muted); }
	.install-copy code, .install-copy span:first-child {
		font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-secondary);
		overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; min-width: 0;
	}
	.copy-hint {
		font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-muted);
		flex-shrink: 0; transition: color 0.2s;
	}
	.install-copy:hover .copy-hint { color: var(--text-primary); }

	.code-viewer { background: var(--bg-card); border: 1px solid var(--border); border-top: none; border-radius: 0 0 var(--radius-md) var(--radius-md); overflow: hidden; }
	.code-header { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1.25rem; border-bottom: 1px solid var(--border); background: var(--bg-secondary); }
	.code-filename { font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); }
	.code-copy { background: none; border: 1px solid var(--border); color: var(--text-muted); font-family: var(--font-mono); font-size: 0.7rem; padding: 0.25rem 0.75rem; border-radius: var(--radius-sm); cursor: pointer; transition: all 0.2s; }
	.code-copy:hover { border-color: var(--text-secondary); color: var(--text-primary); }
	.code-content { padding: 1.5rem; font-family: var(--font-mono); font-size: 0.9rem; line-height: 1.5; color: var(--text-secondary); overflow-x: auto; margin: 0; tab-size: 2; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word; }
	.code-content code { font-family: inherit; }

	.version-hash { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 0; margin-top: 1rem; font-size: 0.75rem; flex-wrap: wrap; }
	.hash-label { color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; font-family: var(--font-mono); font-size: 0.65rem; }
	.hash-value { font-family: var(--font-mono); color: var(--text-secondary); background: var(--bg-card); padding: 0.2rem 0.5rem; border-radius: 4px; border: 1px solid var(--border); }
	.hash-sep { color: var(--text-muted); }

	@media (max-width: 768px) {
		.files-header { flex-direction: column; align-items: stretch; }
		.file-tabs { overflow-x: auto; -webkit-overflow-scrolling: touch; }
		.install-wrap { padding: 0.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: flex-end; }
		.install-popover { right: 0.5rem; }
		.byline { font-size: 0.8rem; }
		.nav-right a:not(.btn-nav):not(:global(.theme-toggle)) { display: none; }
	}
</style>
