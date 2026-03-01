<script lang="ts">
	import YarnLogo from '$lib/components/YarnLogo.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { MARKETPLACE_COMMAND } from '$lib/plugins';
	let { data } = $props();

	const featuredPlugins = $derived(data.plugins.filter((p: { source: string }) => p.source === 'loooom'));

	const imagineCards = [
		{ emoji: '🎵', name: 'Katy Perry', title: 'shared her songwriting process', desc: 'How she builds a hook, writes from emotion, and crafts a bridge that hits every time.' },
		{ emoji: '🍕', name: 'A Michelin chef', title: 'taught his knife technique', desc: 'The grip, the angle, the rhythm. What takes years to learn, taught in minutes.' },
		{ emoji: '🏀', name: 'An NBA coach', title: 'broke down zone defense', desc: 'Rotations, reads, positioning. The playbook, unlocked for anyone.' },
		{ emoji: '🎨', name: 'A tattoo artist', title: 'explained her stippling method', desc: 'Needle depth, pressure, spacing. The craft behind the ink.' },
		{ emoji: '📚', name: 'A Harvard prof', title: 'shared her research framework', desc: 'How to find a thesis, build an argument, and write something worth reading.' },
		{ emoji: '🧘', name: 'A meditation teacher', title: 'bottled his breathing method', desc: 'The 4-7-8 technique and the body scan, explained with patience.' },
	];

</script>

<svelte:head>
	<title>Loooom — Share What You Know</title>
	<meta name="description" content="Turn your expertise into an AI skill. Anyone can learn from you, forever. No code required." />
</svelte:head>

<!-- Nav -->
<nav>
	<div class="nav-inner">
		<a href="/" class="logo">
			<YarnLogo size={26} />
			<span class="logo-text">loooom</span>
		</a>
		<div class="nav-right">
			<a href="/browse" class="nav-link">Explore</a>
			<ThemeToggle />
			<a href="/login" class="btn-nav">Sign In</a>
		</div>
	</div>
</nav>

<!-- Hero -->
<section class="hero">
	<div class="hero-inner">
		<p class="hero-eyebrow">✦ Skills marketplace for AI agents</p>
		<h1>
			<span class="hand">Teach what you know.</span>
			<br />
			<span class="hand accent">AI does the rest.</span>
		</h1>
		<p class="hero-sub">
			Turn your expertise into an AI skill. Anyone can learn from you — forever.
		</p>
		<div class="hero-ctas">
			<a href="/startweaving" class="btn-primary">Share Your Expertise</a>
			<a href="/browse" class="btn-ghost">Browse Skills →</a>
		</div>
		<p class="hero-note">Always free · Open source · Works with any AI</p>
	</div>
</section>

<!-- Imagine If... -->
<section class="imagine">
	<div class="section-inner">
		<h2 class="hand">What if your favorite expert<br /><span class="sketch">had an AI version?</span></h2>
	</div>
	<div class="imagine-track">
		{#each imagineCards as card}
			<div class="imagine-card">
				<span class="imagine-emoji">{card.emoji}</span>
				<div class="imagine-body">
					<p class="imagine-who"><strong>{card.name}</strong> {card.title}</p>
					<p class="imagine-desc">{card.desc}</p>
				</div>
			</div>
		{/each}
	</div>
</section>

<!-- How It Works -->
<section class="how">
	<div class="section-inner">
		<h2 class="hand">Three steps. <span class="sketch">That's it.</span></h2>
		<div class="steps">
			<div class="step">
				<div class="step-num">1</div>
				<h3>Write what you know</h3>
				<p>Plain English. No code, no jargon.</p>
			</div>
			<div class="step-arrow">→</div>
			<div class="step">
				<div class="step-num">2</div>
				<h3>Publish your skill</h3>
				<p>Live on Loooom. Anyone can find and use it.</p>
			</div>
			<div class="step-arrow">→</div>
			<div class="step">
				<div class="step-num">3</div>
				<h3>Your knowledge, forever</h3>
				<p>AI agents learn from you. Teach thousands — effortlessly.</p>
			</div>
		</div>
		<div class="how-cta">
			<a href="/startweaving" class="btn-primary">Start Creating</a>
		</div>
	</div>
</section>

<!-- Plugin Showcase -->
<section class="plugins">
	<div class="section-inner">
		<div class="plugins-header">
			<div>
				<h2 class="hand">Live skills, <span class="sketch">ready to use.</span></h2>
				<p class="plugins-sub">{data.plugins.length} skills in the marketplace. Free, forever.</p>
			</div>
			<a href="/browse" class="btn-outline">See all →</a>
		</div>
		<div class="plugins-grid">
			{#each featuredPlugins as plugin}
				<a href="/p/{plugin.author}/{plugin.name}" class="plugin-card">
					<div class="plugin-top">
						<span class="plugin-emoji">{plugin.emoji}</span>
						<span class="plugin-cat">{plugin.category}</span>
					</div>
					<h3 class="plugin-title">{plugin.title}</h3>
					<p class="plugin-desc">{plugin.description}</p>
					<div class="plugin-footer">
						<span class="plugin-author">by @{plugin.author}</span>
						<span class="plugin-skills">{plugin.skills.length} skills</span>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- For the technically curious -->
<section class="dev-section">
	<div class="section-inner">
		<div class="dev-card">
			<div class="dev-left">
				<p class="dev-eyebrow">For Claude Code users</p>
				<h3 class="hand">Add the whole marketplace<br />in one command.</h3>
				<p class="dev-desc">Works with Claude Code, Cursor, and any MCP-compatible agent.</p>
			</div>
			<div class="dev-snippet">
				<code>{MARKETPLACE_COMMAND}</code>
			</div>
		</div>
	</div>
</section>

<!-- Footer -->
<footer>
	<div class="footer-inner">
		<div class="footer-brand">
			<div class="footer-logo">
				<YarnLogo size={24} />
				<span class="logo-text">loooom</span>
			</div>
			<p class="footer-tagline">Where skills are woven.</p>
			<p class="footer-note">Open source. Always free. Made with 🧶 in Chicago.</p>
		</div>
		<div class="footer-links">
			<div class="footer-col">
				<h4>Product</h4>
				<a href="/browse">Browse</a>
				<a href="/startweaving">Create</a>
				<a href="/docs">Docs</a>
			</div>
			<div class="footer-col">
				<h4>Open Source</h4>
				<a href="https://github.com/mager/loooom.xyz" target="_blank" rel="noopener">GitHub</a>
				<a href="https://agentskills.io" target="_blank" rel="noopener">AgentSkills.io</a>
			</div>
		</div>
	</div>
	<div class="footer-bottom">
		A weeknight project by <a href="https://x.com/mager" target="_blank" rel="noopener">@mager</a> &amp; <a href="https://x.com/mager" target="_blank" rel="noopener">@magerbot</a>.
	</div>
</footer>

<style>
	/* ===== Base ===== */
	:global(body) { overflow-x: hidden; }

	/* ===== Nav ===== */
	nav {
		position: fixed;
		top: 0; left: 0; right: 0;
		z-index: 100;
		backdrop-filter: blur(20px);
		background: var(--nav-bg);
		border-bottom: 1px solid var(--border);
	}
	.nav-inner {
		max-width: 1100px;
		margin: 0 auto;
		padding: 0 1.25rem;
		height: 56px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.logo {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--text-primary);
		text-decoration: none;
	}
	.logo-text {
		font-family: var(--font-handwriting);
		font-size: 1.25rem;
		font-weight: 100;
	}
	.nav-right {
		display: flex;
		align-items: center;
		gap: 1.25rem;
	}
	.nav-link {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-secondary);
		text-decoration: none;
		transition: color 0.2s;
	}
	.nav-link:hover { color: var(--text-primary); }
	.btn-nav {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary) !important;
		text-decoration: none;
		padding: 0.45rem 1.1rem;
		border: 1.5px solid var(--border);
		border-radius: var(--radius-sm);
		transition: border-color 0.2s;
	}
	.btn-nav:hover { border-color: var(--text-muted); }

	/* ===== Shared ===== */
	.section-inner {
		max-width: 1100px;
		margin: 0 auto;
		padding: 0 1.25rem;
	}
	.hand {
		font-family: var(--font-handwriting);
		font-weight: 100;
		line-height: 1.15;
	}
	.hand.accent { color: var(--accent-rose); font-weight: 200; }
	.sketch {
		font-family: var(--font-sketch);
		font-weight: 400;
		color: var(--yarn-pink);
	}

	/* ===== Buttons ===== */
	.btn-primary {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.9rem 2rem;
		background: var(--accent-rose);
		color: #fff !important;
		border-radius: var(--radius-md);
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 700;
		text-decoration: none;
		transition: all 0.2s;
		border: none;
	}
	.btn-primary:hover {
		background: var(--yarn-pink);
		transform: translateY(-1px);
		box-shadow: 0 8px 24px rgba(196, 69, 105, 0.3);
	}
	.btn-ghost {
		display: inline-flex;
		align-items: center;
		padding: 0.9rem 1.5rem;
		color: var(--text-secondary) !important;
		font-size: 1rem;
		font-weight: 600;
		text-decoration: none;
		transition: color 0.2s;
	}
	.btn-ghost:hover { color: var(--text-primary) !important; }
	.btn-outline {
		display: inline-flex;
		align-items: center;
		padding: 0.6rem 1.25rem;
		border: 1.5px solid var(--border);
		border-radius: var(--radius-sm);
		color: var(--text-secondary) !important;
		font-size: 0.875rem;
		font-weight: 600;
		text-decoration: none;
		transition: all 0.2s;
		white-space: nowrap;
	}
	.btn-outline:hover {
		border-color: var(--text-muted);
		color: var(--text-primary) !important;
	}

	/* ===== Hero ===== */
	.hero {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 6rem 1.25rem 3.5rem;
		text-align: center;
		position: relative;
	}
	.hero::before {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(ellipse 80% 60% at 50% 40%, rgba(196, 69, 105, 0.07) 0%, transparent 70%);
		pointer-events: none;
	}
	.hero-inner {
		max-width: 600px;
		width: 100%;
		position: relative;
	}
	.hero-eyebrow {
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--accent-rose);
		margin-bottom: 1rem;
	}
	h1 {
		font-size: clamp(2.4rem, 8vw, 4.5rem);
		margin-bottom: 1rem;
	}
	.hero-sub {
		font-size: clamp(0.95rem, 2.5vw, 1.1rem);
		color: var(--text-secondary);
		line-height: 1.5;
		max-width: 420px;
		margin: 0 auto 1.5rem;
	}
	.hero-ctas {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0.25rem;
		margin-bottom: 1rem;
	}
	.hero-note {
		font-size: 0.75rem;
		color: var(--text-muted);
		font-family: var(--font-sketch);
	}

	/* ===== Imagine Section ===== */
	.imagine {
		padding: 3rem 0;
		overflow: hidden;
	}
	.imagine .section-inner {
		margin-bottom: 1.25rem;
		text-align: center;
	}
	.imagine h2 {
		font-size: clamp(1.5rem, 4.5vw, 2.5rem);
		margin-bottom: 0;
	}
	.imagine-sub {
		color: var(--text-secondary);
		font-size: 1.05rem;
		max-width: 500px;
		margin: 0 auto;
	}
	.imagine-track {
		display: flex;
		gap: 1rem;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
		padding: 0.5rem max(1.25rem, calc((100% - 1100px) / 2 + 1.25rem)) 1rem;
	}
	.imagine-track::-webkit-scrollbar { display: none; }
	.imagine-card {
		flex: 0 0 280px;
		scroll-snap-align: start;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		box-shadow: var(--card-shadow);
		transition: all 0.25s;
	}
	.imagine-card:hover {
		transform: translateY(-3px);
		box-shadow: var(--card-shadow-hover);
	}
	.imagine-emoji {
		font-size: 2rem;
	}
	.imagine-who {
		font-size: 0.95rem;
		color: var(--text-primary);
		line-height: 1.4;
	}
	.imagine-who strong { color: var(--accent-rose); }
	.imagine-desc {
		font-size: 0.85rem;
		color: var(--text-secondary);
		line-height: 1.45;
	}

	/* ===== How It Works ===== */
	.how {
		padding: 3rem 0;
		background: var(--bg-secondary);
	}
	.how h2 {
		font-size: clamp(1.5rem, 4.5vw, 2.5rem);
		margin-bottom: 2rem;
		text-align: center;
	}
	.steps {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		margin-bottom: 2rem;
	}
	.step {
		flex: 1;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		padding: 1.25rem;
		box-shadow: var(--card-shadow);
	}
	.step-num {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: var(--accent-rose);
		color: #fff;
		font-weight: 800;
		font-size: 0.85rem;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 0.75rem;
	}
	.step h3 {
		font-size: 0.95rem;
		font-weight: 700;
		margin-bottom: 0.35rem;
		color: var(--text-primary);
	}
	.step p {
		font-size: 0.82rem;
		color: var(--text-secondary);
		line-height: 1.45;
	}
	.step-arrow {
		font-size: 1.25rem;
		color: var(--text-muted);
		padding-top: 1.25rem;
		flex-shrink: 0;
	}
	.how-cta {
		text-align: center;
	}

	/* ===== Plugin Showcase ===== */
	.plugins {
		padding: 3rem 0;
	}
	.plugins-header {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}
	.plugins-header h2 {
		font-size: clamp(1.5rem, 4.5vw, 2.5rem);
		margin-bottom: 0.25rem;
	}
	.plugins-sub {
		color: var(--text-secondary);
		font-size: 0.95rem;
	}
	.plugins-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1rem;
	}
	.plugin-card {
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		text-decoration: none;
		color: inherit;
		box-shadow: var(--card-shadow);
		transition: all 0.25s;
	}
	.plugin-card:hover {
		transform: translateY(-3px);
		box-shadow: var(--card-shadow-hover);
		color: inherit;
	}
	.plugin-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.plugin-emoji { font-size: 1.75rem; }
	.plugin-cat {
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
	}
	.plugin-title {
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--text-primary);
		margin-top: 0.25rem;
	}
	.plugin-desc {
		font-size: 0.85rem;
		color: var(--text-secondary);
		line-height: 1.4;
		flex: 1;
	}
	.plugin-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 0.5rem;
		padding-top: 0.75rem;
		border-top: 1px solid var(--border);
	}
	.plugin-author {
		font-family: var(--font-handwriting);
		font-size: 0.85rem;
		color: var(--text-muted);
	}
	.plugin-skills {
		font-family: var(--font-mono);
		font-size: 0.65rem;
		color: var(--text-muted);
	}

	/* ===== Dev Section ===== */
	.dev-section {
		padding: 2.5rem 0;
		border-top: 1px solid var(--border);
	}
	.dev-card {
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 1.5rem;
		display: flex;
		align-items: center;
		gap: 1.5rem;
		flex-wrap: wrap;
		box-shadow: var(--card-shadow);
	}
	.dev-left { flex: 1; min-width: 220px; }
	.dev-eyebrow {
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--accent-rose);
		margin-bottom: 0.5rem;
	}
	.dev-left h3 {
		font-size: clamp(1.2rem, 3vw, 1.6rem);
		margin-bottom: 0.5rem;
	}
	.dev-desc {
		font-size: 0.9rem;
		color: var(--text-secondary);
	}
	.dev-snippet {
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		padding: 0.85rem 1.25rem;
		flex-shrink: 0;
	}
	.dev-snippet code {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		color: var(--accent-rose);
		white-space: nowrap;
	}

	/* ===== Footer ===== */
	footer {
		border-top: 1px solid var(--border);
		padding: 2.5rem 1.25rem 1.5rem;
	}
	.footer-inner {
		max-width: 1100px;
		margin: 0 auto 2rem;
		display: flex;
		justify-content: space-between;
		gap: 2rem;
		flex-wrap: wrap;
	}
	.footer-logo {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}
	.footer-tagline {
		font-family: var(--font-handwriting);
		font-size: 0.95rem;
		color: var(--text-secondary);
		margin-bottom: 0.25rem;
	}
	.footer-note {
		font-size: 0.75rem;
		color: var(--text-muted);
	}
	.footer-links {
		display: flex;
		gap: 3rem;
	}
	.footer-col {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}
	.footer-col h4 {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
		margin-bottom: 0.25rem;
	}
	.footer-col a {
		font-size: 0.875rem;
		color: var(--text-secondary);
		text-decoration: none;
		transition: color 0.2s;
	}
	.footer-col a:hover { color: var(--text-primary); }
	.footer-bottom {
		max-width: 1100px;
		margin: 0 auto;
		padding-top: 1.5rem;
		border-top: 1px solid var(--border);
		text-align: center;
		font-size: 0.75rem;
		color: var(--text-muted);
	}
	.footer-bottom a { color: var(--text-muted); text-decoration: none; }
	.footer-bottom a:hover { color: var(--text-primary); }

	/* ===== Responsive — tablet ===== */
	@media (max-width: 720px) {
		.steps {
			flex-direction: column;
			gap: 0;
		}
		.step-arrow {
			transform: rotate(90deg);
			padding: 0.2rem 0;
			text-align: center;
			width: 100%;
		}
		.plugins-header {
			flex-direction: column;
			align-items: flex-start;
		}
		.dev-card {
			flex-direction: column;
			gap: 1rem;
		}
		.dev-snippet { width: 100%; overflow-x: auto; }
		.footer-inner { flex-direction: column; }
		.footer-links { gap: 2rem; }
		.imagine-card { flex: 0 0 220px; }
	}

	@media (max-width: 480px) {
		.nav-link { display: none; }
		h1 { font-size: 2.2rem; }
		.hero { padding: 4rem 1.25rem 2rem; }
		.hero-sub { font-size: 0.95rem; margin-bottom: 1.25rem; }
		.imagine { padding: 2rem 0; }
		.how { padding: 2rem 0; }
		.plugins { padding: 2rem 0; }
		.dev-section { padding: 2rem 0; }
		.imagine-card { flex: 0 0 80vw; }
		.hero-ctas { flex-direction: column; align-items: stretch; }
		.btn-ghost { padding: 0.5rem; text-align: center; }
		.btn-primary { justify-content: center; }
	}
</style>
