<script lang="ts">
	import YarnLogo from '$lib/components/YarnLogo.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
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

<div class="ambient">
	<div class="orb orb-1"></div>
	<div class="orb orb-2"></div>
</div>

<nav>
	<div class="nav-inner">
		<a href="/" class="logo">
			<YarnLogo size={28} />
			<span class="logo-text">loooom</span>
		</a>
		<div class="nav-links">
			<a href="/browse">Browse</a>
			<ThemeToggle />
		</div>
	</div>
</nav>

<main class="plugin-page">
	<div class="page-inner">
		<a href="/browse" class="breadcrumb">← Back to browse</a>

		<div class="plugin-hero">
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
			<h1 class="plugin-title handwriting">{data.plugin.title}</h1>
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
							{copiedStep === 1 ? '✓' : '📋'}
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
							{copiedStep === 1 ? '✓' : '📋'}
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
							{copiedStep === 2 ? '✓' : '📋'}
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
</main>

<style>
	:global(body) {
		overflow-x: hidden;
	}

	.ambient {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 0;
		overflow: hidden;
	}
	.orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(140px);
		opacity: 0.06;
	}
	:global(html[data-theme='dark']) .orb {
		opacity: 0.12;
	}
	.orb-1 {
		width: 600px;
		height: 600px;
		background: var(--ocean);
		top: -200px;
		left: -200px;
	}
	.orb-2 {
		width: 500px;
		height: 500px;
		background: var(--indigo);
		bottom: -150px;
		right: -100px;
	}

	nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		background: rgba(250, 246, 240, 0.9);
		backdrop-filter: blur(12px);
		border-bottom: 1px solid var(--border);
	}
	:global(html[data-theme='dark']) nav {
		background: rgba(18, 18, 20, 0.9);
	}
	.nav-inner {
		max-width: 900px;
		margin: 0 auto;
		padding: 0 2rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 60px;
	}
	.logo {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		text-decoration: none;
	}
	.logo-text {
		font-family: var(--font-handwriting);
		font-size: 1.4rem;
		font-weight: 200;
		color: var(--text-primary);
	}
	.nav-links {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}
	.nav-links a {
		color: var(--text-secondary);
		text-decoration: none;
		font-size: 0.95rem;
	}
	.nav-links a:hover {
		color: var(--text-primary);
	}

	.plugin-page {
		position: relative;
		z-index: 1;
		padding: 100px 2rem 4rem;
		min-height: 100vh;
	}
	.page-inner {
		max-width: 720px;
		margin: 0 auto;
	}

	.breadcrumb {
		display: inline-block;
		margin-bottom: 2rem;
		color: var(--text-muted);
		font-size: 0.9rem;
		text-decoration: none;
		transition: color 0.2s;
	}
	.breadcrumb:hover {
		color: var(--text-secondary);
	}

	.plugin-hero {
		margin-bottom: 3rem;
	}
	.plugin-meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}
	.plugin-emoji {
		font-size: 2rem;
		line-height: 1;
	}
	.plugin-category-badge {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 100px;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
	}
	.plugin-version {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--text-muted);
	}
	.eval-score-badge {
		display: inline-flex;
		align-items: center;
		padding: 0.2rem 0.6rem;
		border-radius: 100px;
		font-size: 0.7rem;
		font-weight: 500;
		letter-spacing: 0.02em;
		cursor: default;
	}
	.score-passing {
		background: rgba(34, 197, 94, 0.12);
		color: #16a34a;
		border: 1px solid rgba(34, 197, 94, 0.3);
	}
	.score-failing {
		background: rgba(234, 179, 8, 0.12);
		color: #ca8a04;
		border: 1px solid rgba(234, 179, 8, 0.3);
	}
	:global(html[data-theme='dark']) .score-passing {
		background: rgba(34, 197, 94, 0.15);
		color: #4ade80;
		border-color: rgba(34, 197, 94, 0.25);
	}
	:global(html[data-theme='dark']) .score-failing {
		background: rgba(234, 179, 8, 0.15);
		color: #facc15;
		border-color: rgba(234, 179, 8, 0.25);
	}
	.plugin-title {
		font-size: clamp(2rem, 5vw, 3rem);
		font-weight: 200;
		margin-bottom: 1rem;
		color: var(--text-primary);
		line-height: 1.1;
	}
	.plugin-description {
		font-size: 1.1rem;
		color: var(--text-secondary);
		line-height: 1.55;
		margin-bottom: 1rem;
	}
	.plugin-by-line {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}
	.by-label {
		color: var(--text-muted);
		font-size: 0.9rem;
	}
	.author-link {
		font-family: var(--font-handwriting);
		font-size: 1rem;
		color: var(--text-primary);
		text-decoration: none;
	}
	.author-link:hover {
		text-decoration: underline;
	}

	.install-section {
		margin-bottom: 3rem;
	}

	/* skills.sh install extras */
	.installs-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin-bottom: 1.25rem;
		background: color-mix(in srgb, var(--accent) 8%, transparent);
		border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
		border-radius: 999px;
		padding: 0.3rem 0.85rem;
	}
	.installs-num {
		font-family: var(--font-mono);
		font-size: 0.88rem;
		font-weight: 700;
		color: var(--accent);
	}
	.installs-label {
		font-size: 0.78rem;
		color: var(--text-muted);
	}
	.source-attribution {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 1rem;
		padding: 0.75rem 1rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
	}
	.source-attr-label {
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
	}
	.source-attr-link {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--accent);
		text-decoration: none;
		flex: 1;
	}
	.source-attr-link:hover { text-decoration: underline; }
	.source-attr-arrow { color: var(--text-muted); font-size: 0.8rem; }
	.skills-section {
		margin-bottom: 2rem;
	}
	.section-title {
		font-size: 1.75rem;
		font-weight: 200;
		margin-bottom: 1.5rem;
		color: var(--text-primary);
	}

	.install-step {
		display: flex;
		gap: 1.25rem;
		margin-bottom: 1.25rem;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		padding: 1.5rem;
		box-shadow: var(--card-shadow);
	}
	.step-num {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: var(--ocean);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 0.9rem;
		flex-shrink: 0;
	}
	.step-body {
		flex: 1;
	}
	.step-label {
		font-weight: 600;
		margin-bottom: 0.25rem;
		color: var(--text-primary);
	}
	.step-desc {
		font-size: 0.875rem;
		color: var(--text-muted);
		margin-bottom: 0.75rem;
	}
	.code-block {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 6px;
		padding: 0.75rem 1rem;
	}
	.code-block code {
		font-family: var(--font-mono);
		font-size: 0.875rem;
		color: var(--ocean);
		flex: 1;
	}
	.copy-btn {
		background: none;
		border: none;
		cursor: pointer;
		font-size: 1rem;
		opacity: 0.6;
		transition: opacity 0.2s;
		padding: 0;
	}
	.copy-btn:hover {
		opacity: 1;
	}

	.skills-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.skill-item {
		display: flex;
		gap: 1rem;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		padding: 1rem 1.25rem;
		box-shadow: var(--card-shadow);
	}
	.skill-num {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.75rem;
		color: var(--text-muted);
		flex-shrink: 0;
		font-family: var(--font-mono);
	}
	.skill-body {
		flex: 1;
	}
	.skill-name {
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 0.25rem;
	}
	.skill-desc {
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.keywords-section {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 2.5rem;
	}
	.keyword-pill {
		padding: 0.25rem 0.75rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 100px;
		font-size: 0.75rem;
		color: var(--text-muted);
		font-family: var(--font-mono);
	}

	.footer-actions {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		padding-top: 1rem;
		border-top: 1px solid var(--border);
	}
	.btn-github {
		display: inline-flex;
		align-items: center;
		padding: 0.75rem 1.5rem;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		color: var(--text-primary);
		font-size: 0.9rem;
		text-decoration: none;
		transition: all 0.2s;
		box-shadow: var(--card-shadow);
	}
	.btn-github:hover {
		border-color: var(--text-secondary);
		transform: translateY(-1px);
	}
	.btn-browse {
		display: inline-flex;
		align-items: center;
		padding: 0.75rem 1.5rem;
		background: transparent;
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		color: var(--text-secondary);
		font-size: 0.9rem;
		text-decoration: none;
		transition: all 0.2s;
	}
	.btn-browse:hover {
		color: var(--text-primary);
		border-color: var(--text-secondary);
	}

	/* ---- Test Suite ---- */
	.tests-section {
		margin-bottom: 2.5rem;
	}
	.tests-header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: 1.25rem;
		flex-wrap: wrap;
		gap: 0.75rem;
	}
	.tests-header .section-title {
		margin-bottom: 0;
	}
	.tests-meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}
	.tests-score {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		font-weight: 600;
		padding: 0.2rem 0.65rem;
		border-radius: 100px;
		border: 1px solid;
	}
	.tests-score.score-passing {
		background: rgba(34, 197, 94, 0.12);
		color: #16a34a;
		border-color: rgba(34, 197, 94, 0.3);
	}
	.tests-score.score-failing {
		background: rgba(234, 179, 8, 0.12);
		color: #ca8a04;
		border-color: rgba(234, 179, 8, 0.3);
	}
	:global(html[data-theme='dark']) .tests-score.score-passing {
		color: #4ade80;
		background: rgba(34, 197, 94, 0.15);
		border-color: rgba(34, 197, 94, 0.25);
	}
	:global(html[data-theme='dark']) .tests-score.score-failing {
		color: #facc15;
		background: rgba(234, 179, 8, 0.15);
		border-color: rgba(234, 179, 8, 0.25);
	}
	.tests-count {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--text-muted);
	}
	.tests-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}
	.test-item {
		display: flex;
		gap: 0.875rem;
		padding: 0.875rem 1rem;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		box-shadow: var(--card-shadow);
	}
	.test-index {
		font-family: var(--font-mono);
		font-size: 0.65rem;
		color: var(--text-muted);
		min-width: 1.5rem;
		padding-top: 0.15rem;
		text-align: right;
		flex-shrink: 0;
	}
	.test-body {
		flex: 1;
		min-width: 0;
	}
	.test-description {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 0.3rem;
		line-height: 1.35;
	}
	.test-input {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--text-secondary);
		margin-bottom: 0.4rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.test-assertions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
	}
	.assertion-pill {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		font-weight: 600;
		padding: 0.1rem 0.45rem;
		border-radius: 100px;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		border: 1px solid;
	}
	.type-rubric {
		background: rgba(139, 92, 246, 0.1);
		color: #7c3aed;
		border-color: rgba(139, 92, 246, 0.25);
	}
	:global(html[data-theme='dark']) .type-rubric {
		color: #a78bfa;
		background: rgba(139, 92, 246, 0.15);
		border-color: rgba(139, 92, 246, 0.25);
	}
	.type-contains {
		background: rgba(16, 185, 129, 0.1);
		color: #059669;
		border-color: rgba(16, 185, 129, 0.25);
	}
	:global(html[data-theme='dark']) .type-contains {
		color: #34d399;
		background: rgba(16, 185, 129, 0.15);
		border-color: rgba(16, 185, 129, 0.25);
	}
	.type-not {
		background: rgba(239, 68, 68, 0.1);
		color: #dc2626;
		border-color: rgba(239, 68, 68, 0.25);
	}
	:global(html[data-theme='dark']) .type-not {
		color: #f87171;
		background: rgba(239, 68, 68, 0.15);
		border-color: rgba(239, 68, 68, 0.25);
	}
	.type-unknown {
		background: var(--bg-secondary);
		color: var(--text-muted);
		border-color: var(--border);
	}

	/* ---- YAML Details ---- */
	.yaml-details {
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		overflow: hidden;
	}
	.yaml-summary {
		padding: 0.75rem 1rem;
		font-family: var(--font-mono);
		font-size: 0.78rem;
		color: var(--text-muted);
		cursor: pointer;
		background: var(--bg-secondary);
		user-select: none;
		list-style: none;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		transition: color 0.15s;
	}
	.yaml-summary:hover {
		color: var(--text-primary);
	}
	.yaml-summary::before {
		content: '▶';
		font-size: 0.55rem;
		transition: transform 0.2s;
		flex-shrink: 0;
	}
	.yaml-details[open] .yaml-summary::before {
		transform: rotate(90deg);
	}
	.yaml-block {
		margin: 0;
		padding: 1rem;
		overflow-x: auto;
		font-size: 0.72rem;
		line-height: 1.5;
		background: var(--bg-primary);
		color: var(--text-secondary);
	}
	.yaml-block code {
		font-family: var(--font-mono);
		color: inherit;
		background: none;
		padding: 0;
	}

	@media (max-width: 600px) {
		.plugin-page {
			padding: 90px 1rem 3rem;
		}
		.install-step {
			padding: 1.25rem;
		}
		.code-block code {
			font-size: 0.78rem;
			word-break: break-all;
		}
	}
</style>
