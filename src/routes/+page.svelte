<script lang="ts">
	import YarnLogo from '$lib/components/YarnLogo.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { MARKETPLACE_COMMAND } from '$lib/plugins';

	let { data } = $props();

	const featuredPlugins = $derived(
		data.plugins.filter((p: { source: string }) => p.source === 'loooom').slice(0, 3)
	);

	const loooomCount = $derived(
		data.plugins.filter((p: { source: string }) => p.source === 'loooom').length
	);
</script>

<svelte:head>
	<title>Loooom — ME.md & AI Skills Marketplace</title>
	<meta
		name="description"
		content="Publish your ME.md — a portable human context file any AI can read. Plus a GitHub-native Claude Code skills marketplace."
	/>
</svelte:head>

<!-- Nav -->
<nav>
	<div class="nav-inner">
		<a href="/" class="logo">
			<YarnLogo size={22} />
			<span class="logo-text">loooom</span>
		</a>
		<div class="nav-right">
			<a href="/me" class="nav-link nav-link-memd">ME.md</a>
			<a href="/browse" class="nav-link">Skills</a>
			<a
				href="https://github.com/mager/loooom"
				target="_blank"
				rel="noopener"
				class="nav-link">GitHub</a
			>
			<ThemeToggle />
			<a href="/login" class="btn-nav">Sign In</a>
		</div>
	</div>
</nav>

<!-- Hero -->
<section class="hero">
	<div class="hero-inner">
		<div class="hero-eyebrow">
			<span class="eyebrow-badge">Portable Human Context</span>
		</div>
		<h1>One URL.<br/>Every AI<br/>knows you.</h1>
		<p class="hero-sub">
			Stop re-prompting every session. Publish your <strong>ME.md</strong> on Loooom — one file that tells any AI who you are, how you think, and what you're building.
		</p>
		<div class="hero-url-preview">
			<span class="url-prefix">loooom.xyz/me/</span><span class="url-handle">you</span>
		</div>
		<div class="hero-actions">
			<a href="/login" class="btn-primary-hero">Claim your ME.md →</a>
			<a href="/me/mager" class="btn-ghost-hero">See an example</a>
		</div>
		<p class="hero-hint">Free. No signup required to browse. Raw markdown always public.</p>
	</div>
</section>

<!-- How it works -->
<section class="how-memd">
	<div class="section-inner">
		<p class="section-eyebrow">How it works</p>
		<h2>Three steps. Done forever.</h2>
		<div class="steps-memd">
			<div class="step-memd">
				<div class="step-num-memd">01</div>
				<div class="step-content">
					<h3>Write your ME.md</h3>
					<p>Seven canonical sections. Plain markdown. Start with your values, stack, and one hard list of what you hate.</p>
				</div>
			</div>
			<div class="step-memd">
				<div class="step-num-memd">02</div>
				<div class="step-content">
					<h3>Publish on Loooom</h3>
					<p>Your context lives at <code>loooom.xyz/me/you</code>. Raw markdown at <code>/me/you/raw</code>. CORS-open so any AI can fetch it directly.</p>
				</div>
			</div>
			<div class="step-memd">
				<div class="step-num-memd">03</div>
				<div class="step-content">
					<h3>Paste once. Known everywhere.</h3>
					<p>One injection prompt in your system prompt. Every AI session starts already knowing you. No more re-introducing yourself.</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Live example -->
<section class="demo-section">
	<div class="section-inner">
		<div class="demo-grid">
			<div class="demo-text">
				<p class="section-eyebrow">The format</p>
				<h2>Frontmatter for machines.<br/>Markdown for humans.</h2>
				<p>YAML frontmatter carries your identity: handle, timezone, agent fleet. Markdown sections carry your soul: values, preferences, anti-patterns.</p>
				<p>Any AI can read it. Any human can edit it. One file to rule every context window.</p>
				<a href="/me" class="link-cta" style="display: inline-flex; margin-top: 1.25rem;">Explore the ME.md spec →</a>
			</div>
			<div class="demo-code">
				<div class="code-win">
					<div class="code-win-bar">
						<span class="win-dot r"></span>
						<span class="win-dot y"></span>
						<span class="win-dot g"></span>
						<span class="win-label">ME.md</span>
					</div>
					<pre class="code-win-body"><code>---
version: "1.0"
handle: "@you"
timezone: "America/Chicago"
agents:
  - id: mybot
    role: "Principal Engineer"
    emoji: "⚡"
tags: [coding, music, coffee]
---

# 🫀 The Soul
Ship fast. Refactor ruthlessly.
First principles over best practices.

# 🚫 Anti-Patterns
- Never pad a response
- Never explain what I can see
- Never ask — just do it

# 📍 Context
Building: my-app-v2</code></pre>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Skills: secondary -->
<section class="skills-secondary">
	<div class="section-inner">
		<div class="skills-secondary-inner">
			<div class="skills-secondary-text">
				<p class="section-eyebrow">Also on Loooom</p>
				<h2>AI Skills Marketplace</h2>
				<p>Claude Code skills — plain markdown files that teach Claude new capabilities. Browse {loooomCount}+ originals, install with one command.</p>
				<div class="skills-links">
					<a href="/browse" class="link-cta">Browse skills →</a>
					<a href="https://github.com/mager/loooom" target="_blank" rel="noopener" class="link-ghost">Contribute on GitHub</a>
				</div>
			</div>
			<div class="skills-secondary-plugins">
				{#each featuredPlugins as plugin}
					<a href="/p/{plugin.author}/{plugin.name}" class="mini-plugin-card">
						<span class="mini-plugin-emoji">{plugin.emoji}</span>
						<div>
							<div class="mini-plugin-title">{plugin.title}</div>
							<div class="mini-plugin-author">@{plugin.author}</div>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>
</section>


<!-- Footer -->
<footer>
	<div class="footer-inner">
		<div class="footer-brand">
			<div class="footer-logo">
				<YarnLogo size={20} />
				<span class="footer-logo-text">loooom</span>
			</div>
			<p class="footer-note">Open source. Always free. Made in Chicago.</p>
		</div>
		<div class="footer-links">
			<div class="footer-col">
				<h4>ME.md</h4>
				<a href="/me">What is ME.md?</a>
				<a href="/me/mager">See an example</a>
				<a href="/login">Claim yours</a>
			</div>
			<div class="footer-col">
				<h4>Skills</h4>
				<a href="/browse">Browse</a>
				<a href="/startweaving">Create</a>
				<a href="/docs">Docs</a>
			</div>
			<div class="footer-col">
				<h4>Open Source</h4>
				<a href="https://github.com/mager/loooom.xyz" target="_blank" rel="noopener">GitHub</a>
				<a href="https://github.com/mager/loooom" target="_blank" rel="noopener">Catalog</a>
			</div>
			<div class="footer-col">
				<h4>Community</h4>
				<a href="https://twitter.com/loooomxyz" target="_blank" rel="noopener">@loooomxyz</a>
			</div>
		</div>
	</div>
	<div class="footer-bottom">
		A weeknight project by <a href="https://x.com/mager" target="_blank" rel="noopener">@mager</a>
		&amp;
		<a href="https://x.com/mager" target="_blank" rel="noopener">@magerbot</a>.
	</div>
</footer>

<style>
	/* ===== Base ===== */
	:global(body) {
		overflow-x: hidden;
	}

	/* ===== Override global h2 handwriting font ===== */
	h1, h2, h3 {
		font-family: var(--font-display);
		font-weight: 700;
		line-height: 1.1;
		letter-spacing: -0.025em;
	}

	/* ===== Nav ===== */
	nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		backdrop-filter: blur(20px);
		background: var(--nav-bg);
		border-bottom: 1px solid var(--border);
	}
	.nav-inner {
		max-width: 960px;
		margin: 0 auto;
		padding: 0 1.5rem;
		height: 54px;
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
		font-size: 1.35rem;
		font-weight: 100;
		letter-spacing: 0;
		color: var(--text-primary);
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
	.nav-link:hover {
		color: var(--text-primary);
	}
	.btn-nav {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary) !important;
		text-decoration: none;
		padding: 0.4rem 1rem;
		border: 1.5px solid var(--border);
		border-radius: 6px;
		transition: border-color 0.2s;
	}
	.btn-nav:hover {
		border-color: var(--text-muted);
	}

	/* ===== Shared ===== */
	.section-inner {
		max-width: 960px;
		margin: 0 auto;
		padding: 0 1.5rem;
	}
	.section-eyebrow {
		font-family: var(--font-mono);
		font-size: 0.65rem;
		font-weight: 400;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ocean);
		margin-bottom: 0.5rem;
	}

	/* ===== Hero ===== */
	.hero {
		padding: 7rem 1.5rem 5rem;
		text-align: center;
	}
	.hero-inner {
		max-width: 580px;
		margin: 0 auto;
	}
	.hero-eyebrow { margin-bottom: 1.5rem; }
	.eyebrow-badge {
		display: inline-block;
		background: linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(6,182,212,0.08) 100%);
		border: 1px solid rgba(139,92,246,0.3);
		color: var(--violet);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 4px 14px;
		border-radius: 999px;
	}
	h1 {
		font-size: clamp(3rem, 10vw, 5.5rem);
		color: var(--text-primary);
		margin-bottom: 1.5rem;
		line-height: 1;
	}
	.hero-sub {
		font-size: clamp(0.95rem, 2.5vw, 1.1rem);
		color: var(--text-secondary);
		line-height: 1.65;
		max-width: 480px;
		margin: 0 auto 2rem;
		font-weight: 300;
	}
	.hero-sub strong { color: var(--text-primary); }
	.hero-url-preview {
		display: inline-flex;
		align-items: center;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 10px;
		padding: 0.65rem 1.25rem;
		font-family: var(--font-mono);
		font-size: 1rem;
		margin-bottom: 2rem;
	}
	.url-prefix { color: var(--text-muted); }
	.url-handle {
		color: var(--violet);
		font-weight: 700;
	}
	.hero-actions {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		flex-wrap: wrap;
		margin-bottom: 1.25rem;
	}
	.btn-primary-hero {
		background: linear-gradient(135deg, var(--violet) 0%, var(--ocean) 100%);
		color: white;
		font-weight: 700;
		font-size: 0.95rem;
		padding: 0.8rem 1.75rem;
		border-radius: 999px;
		text-decoration: none;
		transition: opacity 0.2s, transform 0.2s;
	}
	.btn-primary-hero:hover { opacity: 0.9; transform: translateY(-1px); }
	.btn-ghost-hero {
		background: none;
		border: 1.5px solid var(--border);
		color: var(--text-secondary);
		font-size: 0.9rem;
		padding: 0.8rem 1.5rem;
		border-radius: 999px;
		text-decoration: none;
		transition: all 0.2s;
	}
	.btn-ghost-hero:hover { border-color: var(--violet); color: var(--violet); }
	.hero-hint {
		font-size: 0.78rem;
		color: var(--text-muted);
		margin: 0;
	}

	/* ===== How ME.md Works ===== */
	.how-memd {
		padding: 5rem 1.5rem;
		background: var(--bg-secondary);
		border-top: 1px solid var(--border);
	}
	.how-memd h2 { margin-bottom: 3rem; }
	.steps-memd {
		display: flex;
		flex-direction: column;
		gap: 0;
		border-left: 2px solid var(--border);
		padding-left: 2.5rem;
		margin-left: 2rem;
		max-width: 640px;
	}
	.step-memd {
		display: flex;
		gap: 1.5rem;
		padding-bottom: 2.5rem;
		position: relative;
	}
	.step-memd::before {
		content: '';
		position: absolute;
		left: -2.85rem;
		top: 5px;
		width: 10px; height: 10px;
		border-radius: 50%;
		background: var(--violet);
		border: 2px solid var(--bg-secondary);
	}
	.step-num-memd {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--violet);
		font-weight: 700;
		letter-spacing: 0.1em;
		padding-top: 4px;
		flex-shrink: 0;
	}
	.step-content h3 { font-size: 1.05rem; margin: 0 0 0.4rem; }
	.step-content p { color: var(--text-secondary); line-height: 1.65; margin: 0; font-size: 0.9rem; }
	.step-content code {
		font-family: var(--font-mono);
		font-size: 0.82em;
		background: var(--bg-primary);
		border: 1px solid var(--border);
		padding: 1px 6px;
		border-radius: 4px;
		color: var(--violet);
	}

	/* ===== Demo Section ===== */
	.demo-section {
		padding: 5rem 1.5rem;
	}
	.demo-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4rem;
		align-items: center;
	}
	.demo-text h2 { margin-bottom: 1rem; }
	.demo-text p { color: var(--text-secondary); line-height: 1.65; margin: 0 0 0.85rem; font-size: 0.95rem; }
	.code-win {
		border: 1px solid var(--border);
		border-radius: var(--radius-lg, 16px);
		overflow: hidden;
		box-shadow: var(--card-shadow);
	}
	.code-win-bar {
		background: var(--bg-secondary);
		border-bottom: 1px solid var(--border);
		padding: 10px 14px;
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.win-dot {
		width: 10px; height: 10px;
		border-radius: 50%;
	}
	.win-dot.r { background: #ff5f57; }
	.win-dot.y { background: #febc2e; }
	.win-dot.g { background: #28c840; }
	.win-label {
		margin-left: 8px;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--text-muted);
	}
	.code-win-body {
		margin: 0;
		padding: 1.25rem 1.5rem;
		font-family: var(--font-mono);
		font-size: 0.78rem;
		line-height: 1.65;
		color: var(--text-secondary);
		background: var(--bg-primary);
		overflow-x: auto;
		white-space: pre;
	}

	/* ===== Skills Secondary ===== */
	.skills-secondary {
		padding: 4rem 1.5rem;
		background: var(--bg-secondary);
		border-top: 1px solid var(--border);
	}
	.skills-secondary-inner {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4rem;
		align-items: start;
	}
	.skills-secondary-text h2 { margin-bottom: 0.75rem; font-size: 1.6rem; }
	.skills-secondary-text p { color: var(--text-secondary); line-height: 1.65; margin: 0 0 1.5rem; font-size: 0.9rem; }
	.skills-links { display: flex; gap: 1.5rem; flex-wrap: wrap; align-items: center; }
	.skills-secondary-plugins { display: flex; flex-direction: column; gap: 10px; }
	.mini-plugin-card {
		display: flex;
		align-items: center;
		gap: 12px;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 10px;
		padding: 12px 16px;
		text-decoration: none;
		color: inherit;
		transition: border-color 0.2s, box-shadow 0.2s;
	}
	.mini-plugin-card:hover { border-color: var(--ocean); box-shadow: 0 4px 16px rgba(6,182,212,0.1); }
	.mini-plugin-emoji { font-size: 1.4rem; flex-shrink: 0; }
	.mini-plugin-title { font-size: 0.88rem; font-weight: 600; color: var(--text-primary); }
	.mini-plugin-author { font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono); }

	/* ===== Shared ===== */
	.link-cta {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-primary) !important;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		transition: color 0.2s;
	}
	.link-cta:hover { color: var(--ocean) !important; }
	.link-ghost {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-muted) !important;
		text-decoration: none;
		transition: color 0.2s;
	}
	.link-ghost:hover { color: var(--text-secondary) !important; }

	/* ===== Footer ===== */
	footer {
		border-top: 1px solid var(--border);
		padding: 2.5rem 1.5rem 1.5rem;
	}
	.footer-inner {
		max-width: 960px;
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
	.footer-logo-text {
		font-family: var(--font-handwriting);
		font-size: 1.2rem;
		font-weight: 100;
		letter-spacing: 0;
		color: var(--text-primary);
	}
	.footer-note {
		font-size: 0.78rem;
		color: var(--text-muted);
		font-weight: 300;
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
		font-family: var(--font-display);
		font-size: 0.7rem;
		font-weight: 700;
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
		font-weight: 300;
	}
	.footer-col a:hover {
		color: var(--text-primary);
	}
	.footer-bottom {
		max-width: 960px;
		margin: 0 auto;
		padding-top: 1.5rem;
		border-top: 1px solid var(--border);
		text-align: center;
		font-size: 0.75rem;
		color: var(--text-muted);
		font-weight: 300;
	}
	.footer-bottom a {
		color: var(--text-muted);
		text-decoration: none;
	}
	.footer-bottom a:hover {
		color: var(--text-primary);
	}

	/* ===== Responsive ===== */
	@media (max-width: 720px) {
		.explainer-grid,
		.trust-inner {
			grid-template-columns: 1fr;
			gap: 2rem;
		}
		.plugins-grid {
			grid-template-columns: 1fr;
		}
		.plugin-card {
			border-right: none;
			border-bottom: 1px solid var(--border);
		}
		.plugin-card:last-child {
			border-bottom: none;
		}
		.plugins-header {
			flex-direction: column;
			align-items: flex-start;
		}
		.footer-inner {
			flex-direction: column;
		}
		.footer-links {
			gap: 2rem;
		}
	}

	@media (max-width: 480px) {
		h1 {
			font-size: 2.75rem;
		}
		.hero {
			padding: 5.5rem 1.25rem 3rem;
		}
		.hero-links {
			flex-direction: column;
			align-items: center;
			gap: 1rem;
		}
		.step {
			grid-template-columns: 44px 1fr;
			gap: 1rem;
		}
		.nav-link {
			display: none;
		}
		.explainer {
			padding: 3rem 0;
		}
		.how,
		.plugins {
			padding: 3rem 0;
		}
	}

	/* ── ME.md callout ── */
	.memd-callout {
		padding: 80px 2rem;
		background: linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(6, 182, 212, 0.06) 100%);
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		text-align: center;
	}
	.memd-inner { max-width: 680px; margin: 0 auto; }
	.memd-badge {
		display: inline-block;
		background: linear-gradient(135deg, var(--violet) 0%, var(--ocean) 100%);
		color: white;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 3px 12px;
		border-radius: 999px;
		margin-bottom: 20px;
	}
	.memd-title {
		font-size: clamp(1.4rem, 3.5vw, 2rem);
		line-height: 1.3;
		margin: 0 0 16px;
		font-weight: 700;
	}
	.memd-brand {
		background: linear-gradient(135deg, var(--violet) 0%, var(--ocean) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		font-style: italic;
	}
	.memd-desc {
		color: var(--text-secondary);
		line-height: 1.65;
		margin: 0 0 28px;
	}
	.memd-actions { display: flex; align-items: center; justify-content: center; gap: 14px; margin-bottom: 20px; }
	.btn-memd-primary {
		background: linear-gradient(135deg, var(--violet) 0%, var(--ocean) 100%);
		color: white; border: none;
		padding: 12px 28px; border-radius: 999px;
		font-weight: 600; font-size: 0.95rem;
		text-decoration: none; cursor: pointer;
		transition: opacity 0.2s, transform 0.2s;
	}
	.btn-memd-primary:hover { opacity: 0.9; transform: translateY(-1px); }
	.btn-memd-ghost {
		background: none;
		border: 1px solid var(--border);
		color: var(--text-secondary);
		padding: 12px 24px; border-radius: 999px;
		font-size: 0.9rem; text-decoration: none;
		transition: all 0.2s;
	}
	.btn-memd-ghost:hover { border-color: var(--violet); color: var(--violet); }
	.memd-tagline { color: var(--text-muted); font-style: italic; font-size: 0.9rem; margin: 0; }

	/* ME.md nav pill */
	.nav-link-memd {
		background: linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%);
		border: 1px solid rgba(139, 92, 246, 0.25);
		color: var(--violet) !important;
		padding: 3px 10px;
		border-radius: 999px;
		font-weight: 600;
		font-style: italic;
	}
	.nav-link-memd:hover {
		background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%);
		color: var(--violet) !important;
	}
</style>
