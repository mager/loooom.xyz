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
	<title>{data.plugin.title} — Loooom</title>
	<meta name="description" content={data.plugin.description} />
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
			</div>
			<h1 class="plugin-title handwriting">{data.plugin.title}</h1>
			<p class="plugin-description">{data.plugin.description}</p>
			<div class="plugin-by-line">
				<span class="by-label">by</span>
				<a href="/u/{data.plugin.author}" class="author-link">@{data.plugin.author}</a>
			</div>
		</div>

		<div class="install-section">
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
		background: var(--yarn-pink);
		top: -200px;
		left: -200px;
	}
	.orb-2 {
		width: 500px;
		height: 500px;
		background: var(--yarn-blue);
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
		background: var(--accent-rose, #e84a5f);
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
		color: var(--accent-rose, #e84a5f);
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
