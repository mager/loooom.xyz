<script lang="ts">
	import YarnLogo from '$lib/components/YarnLogo.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	let { data } = $props();

	const featuredPlugins = $derived(
		data.plugins.filter((plugin: { source: string }) => plugin.source === 'loooom').slice(0, 4)
	);

	const skillCount = $derived(data.plugins.length);
	const contextUrl = 'https://loooom.xyz/me/mager/raw';
	const promptText = `Before we work together, fetch ${contextUrl} and use it as durable context about me.`;

	let copiedContext = $state(false);
	let copiedPrompt = $state(false);

	async function copyContextUrl() {
		await navigator.clipboard.writeText(contextUrl);
		copiedContext = true;
		setTimeout(() => (copiedContext = false), 1800);
	}

	async function copyPrompt() {
		await navigator.clipboard.writeText(promptText);
		copiedPrompt = true;
		setTimeout(() => (copiedPrompt = false), 1800);
	}
</script>

<svelte:head>
	<title>Loooom — Personal context and skills for AI agents</title>
	<meta
		name="description"
		content="Loooom helps people publish reusable AI context with ME.md and discover practical skills for agents."
	/>
	<meta name="loooom-agents" content="https://loooom.xyz/AGENTS.md" />
	<meta name="loooom-directory" content="https://loooom.xyz/api/directory" />
	<meta name="loooom-llms" content="https://loooom.xyz/llms.txt" />
	<link rel="alternate" type="text/plain" title="LLM Index" href="/llms.txt" />
	<link rel="alternate" type="text/markdown" title="Agent Briefing" href="/AGENTS.md" />
</svelte:head>

<div class="page-shell">
	<div class="grain"></div>

	<nav class="site-nav" aria-label="Primary navigation">
		<a href="/" class="brand" aria-label="Loooom home">
			<YarnLogo size={24} />
			<span>loooom</span>
		</a>

		<div class="nav-links">
			<a href="/me">ME.md</a>
			<a href="/browse">Skills</a>
			<a href="/me/mager">Example</a>
		</div>

		<div class="nav-actions">
			<ThemeToggle />
			<a href="/login" class="nav-cta">Start</a>
		</div>
	</nav>

	<main>
		<section class="hero">
			<div class="hero-copy">
				<p class="eyebrow hero-eyebrow">Context + skills for AI agents</p>
				<h1>
					<span>Stop teaching</span>
					<span>every AI who</span>
					<span>you are from</span>
					<span>scratch.</span>
				</h1>
				<p class="hero-sub">
					Publish reusable <strong>ME.md</strong> context. Browse skills agents can run with.
				</p>

				<div class="hero-actions">
					<a href="/login" class="primary-action">Claim your ME.md</a>
					<a href="/browse" class="secondary-action">Browse skills</a>
				</div>

				<div class="quick-proof" aria-label="Example public context URL">
					<code>{contextUrl}</code>
					<button onclick={copyContextUrl}>{copiedContext ? 'copied' : 'copy'}</button>
				</div>
			</div>

			<div class="hero-card" aria-label="ME.md preview">
				<div class="card-topline">
					<span class="window-dots" aria-hidden="true">
						<span class="dot dot-amber"></span>
						<span class="dot dot-rose"></span>
						<span class="dot dot-emerald"></span>
					</span>
					<span>ME.md</span>
				</div>
				<pre><code>---
handle: "@you"
timezone: "America/Chicago"
tags: [building, design, music]
---

# The Soul
How I think, what I value, what matters.

# The Stack
The tools, projects, and systems I use.

# Anti-Patterns
What an AI should never do with me.

# Context
What I am working on right now.</code></pre>
			</div>
		</section>

		<section class="positioning" aria-labelledby="what-it-does">
			<div class="section-heading">
				<p class="eyebrow">What Loooom does</p>
				<h2 id="what-it-does">Two simple primitives for better agent work.</h2>
			</div>

			<div class="product-grid">
				<a href="/me" class="product-card context-card">
					<span class="product-kicker">01 / Personal context</span>
					<h3>Publish a durable ME.md</h3>
					<p>
						A plain markdown profile with your preferences, projects, tools, anti-patterns,
						and working style. Humans can read it. Agents can fetch it.
					</p>
					<span class="card-link">See the format</span>
				</a>

				<a href="/browse" class="product-card skills-card">
					<span class="product-kicker">02 / Skill discovery</span>
					<h3>Find skills that make agents useful</h3>
					<p>
						Browse practical agent skills for learning, writing, design, debugging, and
						creative work. Start from examples instead of blank prompts.
					</p>
					<span class="card-link">Explore {skillCount}+ skills</span>
				</a>
			</div>
		</section>

		<section class="why" aria-labelledby="why-heading">
			<div>
				<p class="eyebrow">Why people would use it</p>
				<h2 id="why-heading">The repeated setup tax is real.</h2>
			</div>
			<div class="why-copy">
				<p>
					Every new AI session starts with the same setup: who you are, what you are building,
					how direct you want the response, what tools you use, and what mistakes drive you
					crazy.
				</p>
				<p>
					Loooom turns that into a URL. Share it with a teammate, paste it into an agent, or
					let software fetch the raw markdown directly.
				</p>
			</div>
		</section>

		<section class="workflow" aria-labelledby="workflow-heading">
			<div class="section-heading centered">
				<p class="eyebrow">How it works</p>
				<h2 id="workflow-heading">Write once. Reuse everywhere.</h2>
			</div>

			<div class="steps">
				<div class="step">
					<span>1</span>
					<h3>Create your context</h3>
					<p>Start from a ME.md template and write the parts agents actually need.</p>
				</div>
				<div class="step">
					<span>2</span>
					<h3>Share the raw URL</h3>
					<p>Your context is public markdown at <code>/me/you/raw</code>.</p>
				</div>
				<div class="step">
					<span>3</span>
					<h3>Add useful skills</h3>
					<p>Browse skills and give your agent repeatable playbooks.</p>
				</div>
			</div>

			<div class="prompt-card">
				<div>
					<span class="prompt-label">Paste this into an AI</span>
					<p>{promptText}</p>
				</div>
				<button onclick={copyPrompt}>{copiedPrompt ? 'copied' : 'copy prompt'}</button>
			</div>
		</section>

		<section class="featured" aria-labelledby="featured-heading">
			<div class="section-heading">
				<p class="eyebrow">Featured skills</p>
				<h2 id="featured-heading">Start with concrete agent abilities.</h2>
			</div>

			<div class="skill-grid">
				{#each featuredPlugins as plugin}
					<a href="/p/{plugin.author}/{plugin.name}" class="skill-card">
						<span class="skill-emoji">{plugin.emoji}</span>
						<div>
							<h3>{plugin.title}</h3>
							<p>{plugin.description}</p>
							<span>@{plugin.author}</span>
						</div>
					</a>
				{/each}
			</div>
		</section>

		<section class="final-cta">
			<p class="eyebrow">The ask</p>
			<h2>Give your future agents a better starting point.</h2>
			<div class="hero-actions">
				<a href="/login" class="primary-action">Create your ME.md</a>
				<a href="/me/mager" class="secondary-action">View an example</a>
			</div>
		</section>
	</main>

	<footer>
		<div class="footer-brand">
			<YarnLogo size={22} />
			<span>loooom</span>
		</div>
		<div class="footer-links">
			<a href="/AGENTS.md">AGENTS.md</a>
			<a href="/llms.txt">llms.txt</a>
			<a href="/api/directory">Directory</a>
			<a href="https://github.com/mager/loooom.xyz" target="_blank" rel="noopener">GitHub</a>
		</div>
	</footer>
</div>

<style>
	:global(html),
	:global(body) {
		overflow-x: hidden;
	}

	:global(body) {
		background:
			radial-gradient(circle at top left, color-mix(in srgb, var(--ocean) 18%, transparent), transparent 34rem),
			radial-gradient(circle at 80% 10%, color-mix(in srgb, var(--amber) 14%, transparent), transparent 28rem),
			var(--bg-primary);
	}

	.page-shell {
		position: relative;
		min-height: 100vh;
	}

	.grain {
		position: fixed;
		inset: 0;
		pointer-events: none;
		opacity: 0.35;
		background-image:
			linear-gradient(color-mix(in srgb, var(--text-primary) 5%, transparent) 1px, transparent 1px),
			linear-gradient(90deg, color-mix(in srgb, var(--text-primary) 5%, transparent) 1px, transparent 1px);
		background-size: 44px 44px;
		mask-image: linear-gradient(to bottom, black, transparent 70%);
	}

	.site-nav,
	main,
	footer {
		position: relative;
		z-index: 1;
	}

	.site-nav {
		max-width: 1160px;
		margin: 0 auto;
		padding: 1rem 1.25rem;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 1rem;
	}

	.brand,
	.footer-brand {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		color: var(--text-primary);
		font-family: var(--font-handwriting);
		font-size: 1.45rem;
	}

	.nav-links,
	.nav-actions,
	.footer-links {
		display: flex;
		align-items: center;
		gap: 0.9rem;
	}

	.nav-links {
		justify-content: center;
		padding: 0.35rem;
		background: color-mix(in srgb, var(--bg-card) 76%, transparent);
		border: 1px solid color-mix(in srgb, var(--border) 80%, transparent);
		border-radius: 999px;
		box-shadow: var(--card-shadow);
		backdrop-filter: blur(18px);
	}

	.nav-links a,
	.footer-links a {
		color: var(--text-secondary);
		font-size: 0.88rem;
		font-weight: 600;
	}

	.nav-links a {
		padding: 0.42rem 0.8rem;
		border-radius: 999px;
	}

	.nav-links a:hover {
		background: var(--bg-secondary);
		color: var(--text-primary);
	}

	.nav-actions {
		justify-content: flex-end;
	}

	.nav-cta,
	.primary-action,
	.secondary-action,
	.prompt-card button,
	.quick-proof button {
		border: 0;
		cursor: pointer;
		font-family: var(--font-display);
		font-weight: 800;
	}

	.nav-cta {
		padding: 0.6rem 1rem;
		border-radius: 999px;
		background: var(--text-primary);
		color: var(--bg-primary);
	}

	main {
		max-width: 1160px;
		margin: 0 auto;
		padding: 3.5rem 1.25rem 0;
	}

	.hero {
		display: grid;
		grid-template-columns: minmax(0, 1.02fr) minmax(320px, 0.78fr);
		gap: clamp(2rem, 6vw, 5rem);
		align-items: center;
		padding: 5rem 0 6rem;
	}

	.hero-copy {
		min-width: 0;
		max-width: 100%;
	}

	.eyebrow,
	.product-kicker,
	.prompt-label {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--accent);
		font-weight: 700;
	}

	h1,
	h2,
	h3 {
		font-family: var(--font-display);
		letter-spacing: -0.045em;
		color: var(--text-primary);
	}

	h1 {
		max-width: 780px;
		margin: 1rem 0 1.25rem;
		font-size: clamp(3.4rem, 7.2vw, 6.4rem);
		line-height: 0.94;
	}

	h1 span {
		display: block;
	}

	h2 {
		font-size: clamp(2.1rem, 5vw, 4.4rem);
		line-height: 0.98;
	}

	h3 {
		font-size: 1.35rem;
		line-height: 1.05;
	}

	.hero-sub {
		max-width: 360px;
		color: var(--text-secondary);
		font-size: clamp(1.08rem, 2vw, 1.35rem);
		line-height: 1.6;
	}

	.hero-sub strong {
		color: var(--text-primary);
	}

	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.85rem;
		margin-top: 2rem;
	}

	.primary-action,
	.secondary-action {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 48px;
		padding: 0.85rem 1.2rem;
		border-radius: 999px;
	}

	.primary-action {
		background: linear-gradient(135deg, var(--text-primary), color-mix(in srgb, var(--accent) 70%, var(--text-primary)));
		color: var(--bg-primary);
		box-shadow: 0 20px 50px color-mix(in srgb, var(--accent) 22%, transparent);
	}

	.secondary-action {
		color: var(--text-primary);
		border: 1px solid var(--border);
		background: color-mix(in srgb, var(--bg-card) 78%, transparent);
	}

	.quick-proof {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		max-width: 100%;
		margin-top: 1.4rem;
		padding: 0.45rem;
		border: 1px solid var(--border);
		border-radius: 14px;
		background: var(--bg-card);
		box-shadow: var(--card-shadow);
	}

	.quick-proof code {
		min-width: 0;
		padding: 0 0.35rem;
		color: var(--text-secondary);
		font-family: var(--font-mono);
		font-size: 0.82rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.quick-proof button,
	.prompt-card button {
		flex-shrink: 0;
		border-radius: 10px;
		background: var(--bg-secondary);
		color: var(--accent);
		padding: 0.55rem 0.75rem;
	}

	.hero-card {
		position: relative;
		padding: 1rem;
		border: 1px solid color-mix(in srgb, var(--border) 85%, transparent);
		border-radius: 30px;
		background:
			linear-gradient(135deg, color-mix(in srgb, var(--bg-card) 90%, transparent), color-mix(in srgb, var(--bg-secondary) 80%, transparent)),
			var(--bg-card);
		box-shadow: 0 30px 100px color-mix(in srgb, var(--accent) 16%, transparent);
		transform: rotate(1.5deg);
	}

	.hero-card::before {
		content: "";
		position: absolute;
		inset: -14px;
		z-index: -1;
		border-radius: 36px;
		background: linear-gradient(135deg, color-mix(in srgb, var(--ocean) 28%, transparent), color-mix(in srgb, var(--amber) 18%, transparent));
		transform: rotate(-4deg);
	}

	.card-topline {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		padding: 0.2rem 0.35rem 0.9rem;
		color: var(--text-muted);
		font-family: var(--font-mono);
		font-size: 0.78rem;
	}

	.window-dots {
		display: inline-flex;
		align-items: center;
		gap: 0.32rem;
	}

	.dot {
		width: 0.7rem;
		height: 0.7rem;
		border-radius: 999px;
	}

	.dot-amber {
		background: var(--amber);
	}

	.dot-rose {
		background: var(--rose);
	}

	.dot-emerald {
		background: var(--emerald);
	}

	pre {
		overflow: auto;
		margin: 0;
		padding: 1.25rem;
		border-radius: 22px;
		background: color-mix(in srgb, var(--bg-primary) 88%, black);
		color: var(--text-secondary);
		font-family: var(--font-mono);
		font-size: clamp(0.75rem, 1.45vw, 0.9rem);
		line-height: 1.7;
	}

	.positioning,
	.workflow,
	.featured,
	.final-cta,
	.why {
		padding: 5rem 0;
		border-top: 1px solid var(--border);
	}

	.section-heading {
		display: grid;
		grid-template-columns: minmax(0, 0.78fr) minmax(0, 1.22fr);
		gap: 2rem;
		align-items: end;
		margin-bottom: 1.5rem;
	}

	.section-heading.centered {
		display: block;
		max-width: 680px;
		margin: 0 auto 2rem;
		text-align: center;
	}

	.product-grid,
	.steps,
	.skill-grid {
		display: grid;
		gap: 1rem;
	}

	.product-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.product-card,
	.step,
	.skill-card,
	.prompt-card {
		border: 1px solid var(--border);
		background: color-mix(in srgb, var(--bg-card) 86%, transparent);
		box-shadow: var(--card-shadow);
		backdrop-filter: blur(18px);
	}

	.product-card {
		position: relative;
		min-height: 310px;
		padding: clamp(1.3rem, 3vw, 2rem);
		border-radius: 32px;
		overflow: hidden;
		color: var(--text-primary);
	}

	.product-card::after {
		content: "";
		position: absolute;
		right: -5rem;
		bottom: -5rem;
		width: 15rem;
		height: 15rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--accent) 12%, transparent);
	}

	.skills-card::after {
		background: color-mix(in srgb, var(--amber) 18%, transparent);
	}

	.product-card h3 {
		margin: 1.4rem 0 0.85rem;
		font-size: clamp(1.8rem, 3vw, 2.5rem);
	}

	.product-card p,
	.step p,
	.skill-card p,
	.why-copy p {
		color: var(--text-secondary);
		line-height: 1.65;
	}

	.card-link {
		position: absolute;
		left: clamp(1.3rem, 3vw, 2rem);
		bottom: clamp(1.3rem, 3vw, 2rem);
		color: var(--accent);
		font-weight: 800;
	}

	.why {
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
		gap: 3rem;
		align-items: start;
	}

	.why-copy {
		display: grid;
		gap: 1rem;
		font-size: 1.08rem;
	}

	.steps {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.step {
		padding: 1.25rem;
		border-radius: 24px;
	}

	.step span {
		display: inline-flex;
		width: 2.3rem;
		height: 2.3rem;
		align-items: center;
		justify-content: center;
		margin-bottom: 1.4rem;
		border-radius: 999px;
		background: var(--text-primary);
		color: var(--bg-primary);
		font-family: var(--font-mono);
		font-weight: 800;
	}

	.step h3,
	.skill-card h3 {
		margin-bottom: 0.55rem;
	}

	.prompt-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 1rem;
		padding: 1rem;
		border-radius: 22px;
	}

	.prompt-card p {
		margin-top: 0.35rem;
		color: var(--text-primary);
		line-height: 1.45;
	}

	.skill-grid {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.skill-card {
		display: grid;
		gap: 1rem;
		padding: 1rem;
		border-radius: 24px;
		color: var(--text-primary);
	}

	.skill-card p {
		display: -webkit-box;
		min-height: 4.9rem;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		line-clamp: 3;
	}

	.skill-card span:last-child {
		display: inline-block;
		margin-top: 0.8rem;
		color: var(--text-muted);
		font-family: var(--font-mono);
		font-size: 0.78rem;
	}

	.skill-emoji {
		font-size: 2rem;
	}

	.final-cta {
		max-width: 760px;
		margin: 0 auto;
		text-align: center;
	}

	.final-cta .hero-actions {
		justify-content: center;
	}

	footer {
		max-width: 1160px;
		margin: 0 auto;
		padding: 2rem 1.25rem 2.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		border-top: 1px solid var(--border);
	}

	.footer-brand {
		font-size: 1.2rem;
	}

	@media (max-width: 900px) {
		.site-nav {
			grid-template-columns: 1fr auto;
		}

		.nav-links {
			display: none;
		}

		.hero,
		.section-heading,
		.why {
			grid-template-columns: 1fr;
		}

		.hero {
			padding-top: 3rem;
		}

		.hero-card {
			transform: none;
		}

		.product-grid,
		.steps,
		.skill-grid {
			grid-template-columns: 1fr;
		}

		.product-card {
			min-height: 250px;
		}
	}

	@media (max-width: 620px) {
		.site-nav {
			padding: 0.85rem 1rem;
		}

		.nav-actions :global(.theme-toggle) {
			display: none;
		}

		main {
			padding: 2rem 1rem 0;
		}

		h1 {
			font-size: clamp(2.7rem, 13vw, 3.55rem);
			line-height: 0.96;
			letter-spacing: -0.06em;
		}

		.hero-sub {
			font-size: 1rem;
		}

		.hero-copy,
		.hero-eyebrow {
			width: 100%;
			max-width: calc(100vw - 2rem);
		}

		.hero-card {
			width: calc(100vw - 2rem);
			max-width: 100%;
		}

		.quick-proof,
		.prompt-card,
		footer {
			align-items: stretch;
			flex-direction: column;
		}

		.quick-proof {
			display: flex;
		}

		.prompt-card button,
		.quick-proof button {
			width: 100%;
		}

		.positioning,
		.workflow,
		.featured,
		.final-cta,
		.why {
			padding: 3.5rem 0;
		}

		footer {
			align-items: flex-start;
		}

		.footer-links {
			flex-wrap: wrap;
		}
	}
</style>
