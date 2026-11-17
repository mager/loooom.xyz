<script lang="ts">
	let { data } = $props();

	let copiedStep = $state(0);
	function copy(text: string, step: number) {
		navigator.clipboard.writeText(text);
		copiedStep = step;
		setTimeout(() => {
			copiedStep = 0;
		}, 2000);
	}
</script>

<svelte:head>
	<title>{data.plugin.title} Skill for Claude Code — Loooom</title>
	<meta name="description" content={data.plugin.description} />
	<meta name="keywords" content={[...data.plugin.keywords, 'claude code', 'ai skill', 'loooom'].join(', ')} />
	<link rel="canonical" href="https://loooom.xyz/p/{data.plugin.author}/{data.plugin.name}" />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content="{data.plugin.title} Skill for Claude Code — Loooom" />
	<meta property="og:description" content={data.plugin.description} />
	<meta property="og:url" content="https://loooom.xyz/p/{data.plugin.author}/{data.plugin.name}" />
	<meta property="og:site_name" content="Loooom" />
	<meta property="og:image" content="https://loooom.xyz/og.png" />

	<!-- Twitter / X -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="{data.plugin.title} Skill for Claude Code — Loooom" />
	<meta name="twitter:description" content={data.plugin.description} />
	<meta name="twitter:image" content="https://loooom.xyz/og.png" />
	<meta name="twitter:site" content="@mager" />

	<!-- JSON-LD -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		"name": data.plugin.title + " — Claude Code Skill",
		"description": data.plugin.description,
		"applicationCategory": "DeveloperApplication",
		"operatingSystem": "Any",
		"url": "https://loooom.xyz/p/" + data.plugin.author + "/" + data.plugin.name,
		"author": { "@type": "Person", "name": data.plugin.authorDisplay },
		"offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
	})}</script>`}
</svelte:head>

<section class="plugin-page">
	<div class="page-inner">
		<a href="/browse" class="breadcrumb">← Back to browse</a>

		<div class="plugin-hero">
			<h1 class="plugin-title">{data.plugin.title}</h1>
			<div class="plugin-meta">
				<span class="plugin-emoji">{data.plugin.emoji}</span>
				<span class="plugin-category-badge">{data.plugin.category}</span>
				<span class="plugin-version">v{data.plugin.version}</span>
				{#if data.evalScore && data.evalScore.status !== 'pending'}
					<span
						class="eval-score-badge score-{data.evalScore.status}"
						title="{data.evalScore.passed}/{data.evalScore.total} tests passing"
					>
						{data.evalScore.status === 'passing' ? '✓' : '⚠'} {data.evalScore.score}% quality
					</span>
				{/if}
			</div>
			<p class="plugin-description">{data.plugin.description}</p>
			<div class="plugin-by-line">
				<span class="by-label">by</span>
				<a href="/u/{data.plugin.author}" class="author-link">@{data.plugin.author}</a>
			</div>
		</div>

		<div class="install-section">
		{#if data.plugin.source === 'skills.sh'}
			<!-- skills.sh single-step install -->
			<h2 class="section-title handwriting">Install</h2>

			{#if data.plugin.installs}
				<div class="installs-badge">
					<span class="installs-num">{data.plugin.installs.toLocaleString()}</span>
					<span class="installs-label">installs on skills.sh</span>
				</div>
			{/if}

			<div class="install-step">
				<div class="step-num">1</div>
				<div class="step-body">
					<div class="step-label">Install with npx</div>
					<div class="step-desc">
						Works with Claude Code, Cursor, Windsurf, and any agent that supports skills.
					</div>
					<div class="code-block">
						<code>{data.plugin.installCommand}</code>
						<button
							class="copy-btn"
							onclick={() => copy(data.plugin.installCommand, 1)}
							title="Copy"
						>
							{copiedStep === 1 ? 'Copied' : 'Copy'}
						</button>
					</div>
				</div>
			</div>

			<div class="source-attribution">
				<span class="source-attr-label">Source</span>
				<a href={data.plugin.homepage} target="_blank" rel="noopener" class="source-attr-link">
					skills.sh — {data.plugin.skillsShPath}
				</a>
				<span class="source-attr-arrow">↗</span>
			</div>
		{:else}
			<!-- Loooom 2-step install -->
			<h2 class="section-title handwriting">Install in 2 steps</h2>

			<div class="install-step">
				<div class="step-num">1</div>
				<div class="step-body">
					<div class="step-label">Add the Loooom marketplace</div>
					<div class="step-desc">
						Run this once — it registers the full catalog with Claude Code.
					</div>
					<div class="code-block">
						<code>{data.marketplaceCommand}</code>
						<button
							class="copy-btn"
							onclick={() => copy(data.marketplaceCommand, 1)}
							title="Copy"
						>
							{copiedStep === 1 ? 'Copied' : 'Copy'}
						</button>
					</div>
				</div>
			</div>

			<div class="install-step">
				<div class="step-num">2</div>
				<div class="step-body">
					<div class="step-label">Install this plugin</div>
					<div class="step-desc">
						Installs to your user scope — available across all projects.
					</div>
					<div class="code-block">
						<code>{data.plugin.installCommand}</code>
						<button
							class="copy-btn"
							onclick={() => copy(data.plugin.installCommand, 2)}
							title="Copy"
						>
							{copiedStep === 2 ? 'Copied' : 'Copy'}
						</button>
					</div>
				</div>
			</div>
		{/if}
		</div>

		{#if data.plugin.skills.length > 0}
			<div class="skills-section">
				<h2 class="section-title handwriting">What's included</h2>
				<div class="skills-list">
					{#each data.plugin.skills as skill, i}
						<div class="skill-item">
							<div class="skill-num">{i + 1}</div>
							<div class="skill-body">
								<div class="skill-name">{skill.name}</div>
								<div class="skill-desc">{skill.description}</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if data.plugin.keywords.length > 0}
			<div class="keywords-section">
				{#each data.plugin.keywords as kw}
					<span class="keyword-pill">{kw}</span>
				{/each}
			</div>
		{/if}

		{#if data.promptfooConfig && data.promptfooConfig.tests.length > 0}
		<div class="tests-section">
			<div class="tests-header">
				<h2 class="section-title handwriting">Test Suite</h2>
				<div class="tests-meta">
					{#if data.evalScore}
						<span class="tests-score score-{data.evalScore.status}">
							{data.evalScore.passed}/{data.evalScore.total} passing
						</span>
					{/if}
					<span class="tests-count">{data.promptfooConfig.tests.length} tests</span>
				</div>
			</div>

			<div class="tests-list">
				{#each data.promptfooConfig.tests as test, i}
					<div class="test-item">
						<div class="test-index">{i + 1}</div>
						<div class="test-body">
							<div class="test-description">{test.description}</div>
							{#if test.message}
								<div class="test-input">"{test.message}"</div>
							{/if}
							<div class="test-assertions">
								{#each test.assertions as assertion}
									<span
										class="assertion-pill type-{assertion.type
											.replace('llm-rubric', 'rubric')
											.replace('contains-any', 'contains')
											.replace('not-contains', 'not')}"
									>
										{assertion.type}
									</span>
								{/each}
							</div>
						</div>
					</div>
				{/each}
			</div>

			<details class="yaml-details">
				<summary class="yaml-summary">View promptfooconfig.yaml</summary>
				<pre class="yaml-block"><code>{data.promptfooConfig.rawYaml}</code></pre>
			</details>
		</div>
	{/if}

	<div class="footer-actions">
			<a
				href="{data.githubBase}/{data.plugin.repoPath}"
				target="_blank"
				rel="noopener"
				class="btn-github"
			>
				View on GitHub →
			</a>
			<a href="/browse" class="btn-browse">Browse more plugins</a>
		</div>
	</div>
</section>

<style>
	.plugin-page { padding: 40px 0 32px; }
	.page-inner { max-width: 900px; margin: 0 auto; min-width: 0; }
	.breadcrumb { display: inline-flex; align-items: center; min-height: 38px; margin-bottom: 24px; color: var(--quiet); font-size: 14px; }
	.breadcrumb:hover { color: var(--lime); }
	.plugin-hero { margin-bottom: 40px; }
	.plugin-title { margin: 0 0 20px; font-size: clamp(36px, 4vw, 60px); font-weight: 500; letter-spacing: -.035em; line-height: 1.05; overflow-wrap: anywhere; }
	.plugin-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; }
	.plugin-emoji { font-size: 24px; line-height: 1; }
	.plugin-category-badge, .eval-score-badge, .tests-score, .keyword-pill, .assertion-pill { display: inline-flex; align-items: center; padding: 4px 8px; border: 1px solid var(--line); border-radius: 4px; background: var(--panel); color: var(--quiet); font-size: 12px; overflow-wrap: anywhere; }
	.plugin-category-badge { border-color: var(--accent-border); background: var(--accent-soft); color: var(--lime); }
	.plugin-version, .tests-count { font-family: var(--font-mono); font-size: 11px; color: var(--quiet); }
	.score-passing { background: var(--accent-soft); color: var(--lime); border: 1px solid var(--accent-border); }
	.score-failing { background: var(--error-bg); color: var(--error-ink); border: 1px solid var(--error-border); }
	.plugin-description { max-width: 65ch; margin-bottom: 20px; font-size: 17px; color: var(--quiet); line-height: 1.6; overflow-wrap: anywhere; }
	.plugin-by-line { display: flex; align-items: center; gap: 6px; font-size: 14px; }
	.by-label { color: var(--quiet); }
	.author-link { color: var(--paper); }
	.author-link:hover { text-decoration: underline; text-underline-offset: 4px; }
	.install-section, .skills-section, .tests-section { margin-bottom: 40px; }
	.section-title { margin: 0 0 20px; font-size: 29px; font-weight: 500; }
	.installs-badge { display: inline-flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; color: var(--quiet); font-size: 13px; }
	.installs-num { font-family: var(--font-mono); font-size: 13px; color: var(--lime); font-variant-numeric: tabular-nums; }
	.source-attribution { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; padding: 16px 0; margin-top: 20px; border-top: 1px solid var(--line); font-size: 13px; }
	.source-attr-label, .source-attr-arrow { color: var(--quiet); }
	.source-attr-link { min-width: 0; flex: 1; color: var(--lime); font-family: var(--font-mono); font-size: 12px; overflow-wrap: anywhere; }
	.source-attr-link:hover { text-decoration: underline; }
	.install-step { display: flex; gap: 20px; margin-bottom: 24px; padding: 24px 0; border-top: 1px solid var(--line); }
	.step-num { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; flex-shrink: 0; border: 1px solid var(--accent-border); border-radius: 4px; background: var(--accent-soft); color: var(--lime); font-family: var(--font-mono); font-size: 13px; }
	.step-body, .skill-body, .test-body { flex: 1; min-width: 0; }
	.step-label { margin-bottom: 6px; color: var(--paper); font-size: 18px; font-weight: 500; }
	.step-desc { margin-bottom: 16px; color: var(--quiet); font-size: 15px; line-height: 1.5; }
	.code-block { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border: 1px solid var(--line); border-radius: 8px; background: var(--code-bg); }
	.code-block code { flex: 1; min-width: 0; color: var(--code-text); font-family: var(--font-mono); font-size: 12px; line-height: 1.8; overflow-wrap: anywhere; }
	.copy-btn { min-height: 38px; flex-shrink: 0; padding: 8px 12px; border: 1px solid var(--line); border-radius: 6px; background: var(--code-toolbar); color: var(--paper); font-size: 12px; cursor: pointer; }
	.copy-btn:hover { border-color: var(--line-strong); }
	.skills-list, .tests-list { display: flex; flex-direction: column; border-top: 1px solid var(--line); }
	.skill-item, .test-item { display: flex; gap: 16px; padding: 20px 0; border-bottom: 1px solid var(--line); }
	.skill-num, .test-index { width: 24px; flex-shrink: 0; padding-top: 2px; font-family: var(--font-mono); font-size: 12px; color: var(--quiet); }
	.skill-name, .test-description { margin-bottom: 8px; font-size: 17px; font-weight: 500; color: var(--paper); overflow-wrap: anywhere; }
	.skill-desc { max-width: 70ch; color: var(--quiet); font-size: 15px; line-height: 1.5; }
	.keywords-section { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 40px; }
	.footer-actions { display: flex; flex-wrap: wrap; gap: 12px; padding-top: 24px; border-top: 1px solid var(--line); }
	.btn-github, .btn-browse { display: inline-flex; align-items: center; justify-content: center; min-height: 46px; padding: 12px 20px; border: 1px solid var(--line); border-radius: 6px; background: var(--panel); color: var(--paper); font-size: 14px; transition: border-color .2s, background .2s; }
	.btn-github { border-color: var(--action-bg); background: var(--action-bg); color: var(--action-ink); }
	.btn-github:hover { background: var(--action-hover); color: var(--action-ink); }
	.btn-browse:hover { border-color: var(--line-strong); background: var(--panel-raised); color: var(--paper); }
	.tests-header { display: flex; align-items: baseline; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-bottom: 20px; }
	.tests-header .section-title { margin-bottom: 0; }
	.tests-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; }
	.tests-score { font-family: var(--font-mono); font-size: 11px; }
	.test-input { margin: 12px 0; padding: 12px 16px; border: 1px solid var(--line); border-radius: 6px; background: var(--code-bg); color: var(--code-text); font-family: var(--font-mono); font-size: 12px; line-height: 1.8; overflow-wrap: anywhere; }
	.test-assertions { display: flex; flex-wrap: wrap; gap: 8px; }
	.assertion-pill { font-family: var(--font-mono); font-size: 11px; color: var(--lavender); }
	.yaml-details { margin-top: 24px; border: 1px solid var(--line); border-radius: 8px; background: var(--code-bg); }
	.yaml-summary { padding: 16px; color: var(--paper); font-family: var(--font-mono); font-size: 12px; cursor: pointer; overflow-wrap: anywhere; }
	.yaml-block { margin: 0; padding: 20px; border-top: 1px solid var(--line); color: var(--code-text); font-family: var(--font-mono); font-size: 12px; line-height: 1.8; overflow-x: auto; white-space: pre-wrap; overflow-wrap: anywhere; }
	.yaml-block code { font-family: inherit; }
	@media (max-width: 760px) { .plugin-page { padding-top: 24px; } .code-block code, .yaml-block, .test-input { font-size: 11px; } }
	@media (max-width: 540px) { .install-step { gap: 12px; } .code-block { flex-wrap: wrap; padding: 12px; } .code-block code { flex-basis: 100%; } .source-attr-link { flex-basis: 100%; } .footer-actions a { width: 100%; } }
	@media (prefers-reduced-motion: reduce) { .btn-github, .btn-browse { transition: none; } }
</style>
