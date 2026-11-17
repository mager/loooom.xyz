<script lang="ts">
	import { marked } from 'marked';
	import { QUALITY_DIMENSIONS } from '$lib/skill-quality-labels';

	let { data } = $props();
	let activeFile = $state(0);
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

	// Quality score, graded against the Loooom rubric (eval-scores.json).
	const qualityDims = data.quality
		? QUALITY_DIMENSIONS.map((d) => ({
				label: d.label,
				score: data.quality!.dimensions[d.id]?.score ?? 0,
				note: data.quality!.dimensions[d.id]?.note ?? ''
			}))
		: [];

	function relativeTime(iso: string): string {
		const diff = Date.now() - new Date(iso).getTime();
		const days = Math.floor(diff / 86400000);
		if (days < 1) return 'today';
		if (days === 1) return 'yesterday';
		if (days < 7) return `${days} days ago`;
		if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
		return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
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

</script>

<svelte:head>
	<title>{data.skill.title} by {data.author.displayName} — Loooom</title>
	<meta name="description" content={data.skill.description || `A skill by ${data.author.displayName} on Loooom`} />
</svelte:head>

<section class="skill-page">
	<div class="skill-inner">
		<!-- Back link -->
		<a href="/u/{data.author.username}" class="back-link">← {data.author.displayName}'s profile</a>

		<!-- Header -->
		<div class="skill-header">
			<h1>{data.skill.title}</h1>
			{#if data.skill.category}<span class="skill-category">{data.skill.category}</span>{/if}
			{#if data.skill.description}
				<p class="skill-desc">{data.skill.description}</p>
			{/if}
			{#if data.skill.tags && data.skill.tags.length > 0}
				<div class="skill-tags">
					{#each data.skill.tags as tag}
						<a href="/browse?tag={encodeURIComponent(tag)}" class="skill-tag">#{tag}</a>
					{/each}
				</div>
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

		<!-- Quality score — the Loooom bar, in public -->
		{#if data.quality}
			<details class="quality" data-verdict={data.quality.verdict}>
				<summary class="q-summary">
					<span class="q-score">{data.quality.score}</span>
					<span class="q-meta">
						<span class="q-verdict">{data.quality.verdict.replace('-', ' ')}</span>
						<span class="q-sub">graded · rubric v{data.quality.rubricVersion} · spec {data.quality.specPassed}/{data.quality.specTotal}</span>
					</span>
					<span class="q-toggle">how it scored</span>
				</summary>
				<div class="q-body">
					{#if data.quality.verdictLine}
						<p class="q-line">“{data.quality.verdictLine}”</p>
					{/if}
					<div class="q-dims">
						{#each qualityDims as d}
							<div class="q-dim">
								<span class="q-dim-name">{d.label}</span>
								<span class="q-bars" aria-label={`${d.score} out of 5`}>
									{#each Array(5) as _, i}
										<span class="q-bar" class:on={i < d.score}></span>
									{/each}
								</span>
								<span class="q-dim-note">{d.note}</span>
							</div>
						{/each}
					</div>
				</div>
			</details>
		{/if}

		<!-- Use this skill — primary action -->
		{#if data.skill.files.length > 0}
			<div class="use-card">
				<div class="use-main">
					<div class="use-text">
						<h2 class="use-title">Use this skill</h2>
						<p class="use-help">Copy it, paste into any AI — Claude, ChatGPT, Gemini — and start.</p>
					</div>
					<button class="btn-use" class:copied={copiedSkill} onclick={copySkillContent}>
						{copiedSkill ? 'Copied — now paste it in ✓' : 'Copy & paste into any AI'}
					</button>
				</div>

				<details class="use-dev">
					<summary>For developers</summary>
					<div class="use-dev-body">
						<button class="dev-copy" onclick={copyCli}>
							<code>npx loooom add {data.author.username}/{data.skill.name}</code>
							<span class="copy-hint">{copiedCli ? '✓ copied' : 'copy'}</span>
						</button>
					</div>
				</details>
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
								aria-pressed={activeFile === i}
								onclick={() => activeFile = i}
							>
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
	.skill-page { padding: 40px 0 32px; }
	.skill-inner { max-width: 900px; margin: 0 auto; min-width: 0; }
	.back-link { display: inline-flex; align-items: center; min-height: 38px; margin-bottom: 24px; color: var(--quiet); font-size: 14px; }
	.back-link:hover { color: var(--lime); }
	.skill-header { margin-bottom: 32px; }
	.skill-header h1 { margin: 0 0 16px; font-size: clamp(36px, 4vw, 60px); line-height: 1.05; font-weight: 500; letter-spacing: -.035em; overflow-wrap: anywhere; }
	.skill-category { display: inline-block; padding: 4px 8px; margin-bottom: 16px; border: 1px solid var(--accent-border); border-radius: 4px; background: var(--accent-soft); color: var(--lime); font-size: 12px; }
	.skill-desc { max-width: 65ch; font-size: 17px; color: var(--quiet); line-height: 1.6; margin-bottom: 20px; overflow-wrap: anywhere; }
	.skill-tags { display: flex; flex-wrap: wrap; gap: 8px; margin: 16px 0; }
	.skill-tag { padding: 6px 8px; border: 1px solid var(--line); border-radius: 4px; color: var(--quiet); font-size: 12px; overflow-wrap: anywhere; }
	.skill-tag:hover { color: var(--lime); border-color: var(--accent-border); }
	.byline { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 13px; }
	.byline-author { display: flex; align-items: center; gap: 8px; color: var(--paper); }
	.byline-avatar { width: 28px; height: 28px; border-radius: 50%; background: var(--accent-soft); color: var(--lime); border: 1px solid var(--accent-border); display: flex; align-items: center; justify-content: center; font-size: 12px; overflow: hidden; flex-shrink: 0; }
	.byline-avatar img { width: 100%; height: 100%; object-fit: cover; }
	.byline-name { font-weight: 500; }
	.verified { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; border-radius: 50%; background: var(--action-bg); color: var(--action-ink); font-size: 10px; }
	.byline-dot, .byline-meta { color: var(--quiet); }
	.byline-edit { color: var(--lime); }
	.byline-edit:hover { text-decoration: underline; }
	.quality { margin-bottom: 24px; background: var(--panel); border: 1px solid var(--line); border-radius: 8px; }
	.quality[data-verdict='passing'] { border-color: var(--accent-border); }
	.q-summary { display: flex; align-items: center; gap: 16px; padding: 16px 20px; cursor: pointer; list-style: none; }
	.q-summary::-webkit-details-marker { display: none; }
	.q-score { font-family: var(--font-mono); font-size: 28px; line-height: 1; min-width: 40px; text-align: center; font-variant-numeric: tabular-nums; }
	.quality[data-verdict='passing'] .q-score { color: var(--lime); }
	.quality[data-verdict='needs-work'] .q-score { color: var(--lavender); }
	.quality[data-verdict='failing'] .q-score { color: var(--failure); }
	.q-meta { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 0; }
	.q-verdict { font-weight: 500; text-transform: capitalize; color: var(--paper); }
	.q-sub { font-family: var(--font-mono); font-size: 11px; line-height: 1.6; color: var(--quiet); }
	.q-toggle { flex-shrink: 0; color: var(--quiet); font-size: 12px; }
	.quality[open] .q-toggle::after { content: ' −'; }
	.quality:not([open]) .q-toggle::after { content: ' +'; }
	.q-body { padding: 0 20px 20px; }
	.q-line { margin: 0 0 20px; color: var(--quiet); font-size: 15px; line-height: 1.5; }
	.q-dims { display: flex; flex-direction: column; gap: 16px; }
	.q-dim { display: grid; grid-template-columns: 120px auto; gap: 6px 16px; align-items: center; }
	.q-dim-name { font-weight: 500; font-size: 14px; }
	.q-bars { display: inline-flex; gap: 4px; }
	.q-bar { width: 24px; height: 6px; border-radius: 2px; background: var(--line); }
	.q-bar.on { background: var(--lime); }
	.q-dim-note { grid-column: 2 / -1; color: var(--quiet); font-size: 13px; line-height: 1.5; }
	.use-card { margin-bottom: 40px; padding: 24px; border: 1px solid var(--line); border-radius: 8px; background: var(--panel); }
	.use-main { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 24px; }
	.use-title { margin: 0 0 8px; font-size: 22px; font-weight: 500; }
	.use-help { max-width: 36ch; color: var(--quiet); font-size: 15px; line-height: 1.5; }
	.btn-use { min-height: 46px; padding: 12px 20px; border: 1px solid var(--action-bg); border-radius: 6px; background: var(--action-bg); color: var(--action-ink); font-size: 14px; font-weight: 500; cursor: pointer; transition: background .2s; }
	.btn-use:hover, .btn-use.copied { background: var(--action-hover); color: var(--action-ink); }
	.prose { max-width: 72ch; margin-bottom: 40px; color: var(--quiet); font-size: 16px; line-height: 1.7; overflow-wrap: anywhere; }
	.prose :global(h1) { margin: 40px 0 16px; color: var(--paper); font-size: 32px; line-height: 1.15; font-weight: 500; }
	.prose :global(h2) { margin: 36px 0 12px; padding-bottom: 8px; border-bottom: 1px solid var(--line); color: var(--paper); font-size: 26px; font-weight: 500; }
	.prose :global(h3) { margin: 28px 0 10px; color: var(--paper); font-size: 20px; font-weight: 500; }
	.prose :global(p) { margin: 0 0 16px; }
	.prose :global(ul), .prose :global(ol) { margin: 0 0 16px; padding-left: 24px; }
	.prose :global(li) { margin-bottom: 6px; }
	.prose :global(li > ul), .prose :global(li > ol) { margin: 6px 0 0; }
	.prose :global(strong) { color: var(--paper); font-weight: 500; }
	.prose :global(a) { color: var(--lime); text-decoration: underline; text-underline-offset: 3px; }
	.prose :global(hr) { margin: 32px 0; border: none; border-top: 1px solid var(--line); }
	.prose :global(blockquote) { margin: 20px 0; padding: 12px 20px; border-left: 1px solid var(--accent-border); background: var(--panel); }
	.prose :global(code) { font-family: var(--font-mono); font-size: .85em; background: var(--code-bg); border: 1px solid var(--line); padding: 2px 5px; border-radius: 4px; color: var(--code-text); }
	.prose :global(pre) { margin: 0 0 20px; padding: 20px; background: var(--code-bg); border: 1px solid var(--line); border-radius: 8px; overflow-x: auto; line-height: 1.8; }
	.prose :global(pre code) { background: none; border: none; padding: 0; border-radius: 0; font-size: 12px; }
	.prose :global(table) { width: 100%; border-collapse: collapse; margin: 0 0 20px; font-size: 14px; overflow-x: auto; display: block; }
	.prose :global(th), .prose :global(td) { padding: 10px 16px; border: 1px solid var(--line); text-align: left; }
	.prose :global(th) { background: var(--panel); color: var(--paper); font-weight: 500; }
	.prose :global(td) { background: var(--ink); }
	.prose :global(img) { max-width: 100%; height: auto; }
	.files-section { margin-bottom: 16px; min-width: 0; }
	.files-header { border-bottom: 1px solid var(--line); }
	.file-tabs { display: flex; overflow-x: auto; gap: 0; }
	.file-tab { display: flex; align-items: center; min-height: 46px; flex-shrink: 0; padding: 12px 16px; border: none; border-bottom: 2px solid transparent; background: transparent; color: var(--quiet); font-family: var(--font-mono); font-size: 12px; cursor: pointer; }
	.file-tab:hover { background: var(--panel-raised); color: var(--paper); }
	.file-tab.active { color: var(--lime); border-bottom-color: var(--lime); }
	.use-dev { margin-top: 20px; padding-top: 12px; border-top: 1px solid var(--line); }
	.use-dev summary { padding: 8px 0; cursor: pointer; font-size: 13px; color: var(--quiet); }
	.use-dev summary:hover { color: var(--paper); }
	.use-dev-body { margin-top: 10px; }
	.dev-copy { display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%; min-height: 46px; padding: 12px; background: var(--code-bg); border: 1px solid var(--line); border-radius: 6px; cursor: pointer; text-align: left; }
	.dev-copy:hover { border-color: var(--line-strong); }
	.dev-copy code { min-width: 0; color: var(--code-text); font-family: var(--font-mono); font-size: 12px; overflow-wrap: anywhere; }
	.copy-hint { flex-shrink: 0; color: var(--quiet); font-size: 12px; }
	.code-viewer { background: var(--code-bg); border: 1px solid var(--line); border-top: none; border-radius: 0 0 8px 8px; overflow: hidden; }
	.code-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 8px 16px; border-bottom: 1px solid var(--line); background: var(--code-toolbar); }
	.code-filename { color: var(--code-text); font-family: var(--font-mono); font-size: 11px; overflow-wrap: anywhere; }
	.code-copy { flex-shrink: 0; min-height: 38px; padding: 8px 12px; border: 1px solid var(--line); border-radius: 6px; background: transparent; color: var(--paper); font-size: 12px; cursor: pointer; }
	.code-copy:hover { border-color: var(--line-strong); }
	.code-content { margin: 0; padding: 20px; color: var(--code-text); font-family: var(--font-mono); font-size: 12px; line-height: 1.8; overflow-x: auto; white-space: pre-wrap; overflow-wrap: anywhere; tab-size: 2; }
	.code-content code { font-family: inherit; }
	.version-hash { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; padding: 20px 0; }
	.hash-label, .hash-sep { color: var(--quiet); font-family: var(--font-mono); font-size: 11px; }
	.hash-value { max-width: 100%; padding: 4px 8px; border: 1px solid var(--line); border-radius: 4px; background: var(--panel); color: var(--quiet); font-family: var(--font-mono); font-size: 11px; overflow-wrap: anywhere; }
	@media (max-width: 760px) { .skill-page { padding-top: 24px; } .use-card { padding: 20px; } .btn-use { width: 100%; } .code-content, .prose :global(pre code) { font-size: 11px; } }
	@media (max-width: 540px) { .q-summary { flex-wrap: wrap; } .q-toggle { width: 100%; text-align: right; } .q-dim { grid-template-columns: 1fr; } .q-dim-note { grid-column: 1; } }
	@media (prefers-reduced-motion: reduce) { .btn-use { transition: none; } }
</style>
