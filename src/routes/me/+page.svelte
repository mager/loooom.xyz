<script lang="ts">
	import YarnLogo from '$lib/components/YarnLogo.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { KNOWN_SECTIONS, ME_MD_TEMPLATE } from '$lib/memd';

	let copied = $state(false);

	function copyTemplate() {
		navigator.clipboard.writeText(ME_MD_TEMPLATE);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<svelte:head>
	<title>ME.md — Portable Human Context</title>
	<meta
		name="description"
		content="robots.txt for human consciousness. One URL. Every AI knows you."
	/>
</svelte:head>

<!-- Ambient orbs -->
<div class="ambient">
	<div class="orb orb-1"></div>
	<div class="orb orb-2"></div>
	<div class="orb orb-3"></div>
</div>

<!-- Nav -->
<nav>
	<div class="nav-inner">
		<a href="/" class="logo">
			<YarnLogo size={22} />
			<span class="logo-text">loooom</span>
		</a>
		<div class="nav-right">
			<a href="/mcp" class="nav-link">MCP</a>
			<a href="/me/spec" class="nav-link">Spec</a>
			<a href="/browse" class="nav-link">Skills</a>
			<a href="https://github.com/mager/loooom" target="_blank" rel="noopener" class="nav-link">GitHub</a>
			<ThemeToggle />
			<a href="/login" class="btn-nav">Sign In</a>
		</div>
	</div>
</nav>

<!-- Hero -->
<section class="hero">
	<div class="hero-inner">
		<div class="eyebrow-wrap">
			<span class="badge">Portable Human Context</span>
		</div>
		<h1 class="hero-title">
			<span class="me">ME</span><span class="dot-md">.md</span>
		</h1>
		<p class="hero-tagline">
			robots.txt for human consciousness.
		</p>
		<p class="hero-sub">
			One URL. Every AI knows you.<br />
			Stop re-prompting. Start being understood.
		</p>
		<div class="hero-actions">
			<a href="/login" class="btn-primary">Claim your ME.md →</a>
			<button class="btn-ghost" onclick={copyTemplate}>
				{copied ? '✓ copied' : 'Copy template'}
			</button>
		</div>
		<div class="hero-url-demo">
			<span class="url-label">your context, forever:</span>
			<code class="url-demo">loooom.xyz/me/<span class="url-handle">you</span></code>
		</div>
	</div>
</section>

<!-- What it is -->
<section class="explainer">
	<div class="explainer-inner">
		<div class="explainer-text">
			<h2>You've described yourself to every AI, every time.<br/>
			<span class="accent-text">Stop it.</span></h2>
			<p>
				Every new Claude session. Every new ChatGPT tab. Every fresh context window.
				You re-explain who you are, what you're building, how you like to work.
			</p>
			<p>
				<strong>ME.md</strong> is a structured markdown file — frontmatter + sections —
				that lives at a public URL. Any AI can fetch it. Any agent can parse it.
				You own it. You version it. You are it.
			</p>
			<p class="quote">
				"One file to rule them, one file to find them,<br/>
				one file to understand them and in context bind them."
			</p>
		</div>
		<div class="explainer-code">
			<div class="code-header">
				<span class="code-dot red"></span>
				<span class="code-dot yellow"></span>
				<span class="code-dot green"></span>
				<span class="code-filename">ME.md</span>
			</div>
			<pre class="code-block"><code>---
version: "1.0"
handle: "@mager"
name: "Mager"
location: "Chicago"
timezone: "America/Chicago"
agents:
  - id: magerbot
    model: claude-sonnet-4-6
    role: "Principal Engineer"
    emoji: "⚡"
tags: [coding, music, food]
---

# 🫀 The Soul

I build at the intersection of craft and
systems. Ship fast, refactor ruthlessly.
First principles > best practices.

# 🚫 Anti-Patterns

- Never explain what I can see
- Never pad responses with filler
- Never ship without considering impact

# 📍 Context

Currently: prxps (sports predictions) +
Loooom (skills marketplace)</code></pre>
		</div>
	</div>
</section>

<!-- Standard sections -->
<section class="spec">
	<div class="spec-inner">
		<div class="spec-header">
			<h2>The ME.md Standard</h2>
			<p>A canonical set of sections — machine-readable, human-writable. Extend freely.</p>
		</div>
		<div class="sections-grid">
			{#each KNOWN_SECTIONS as section}
				<div class="section-card">
					<div class="section-icon">{section.icon}</div>
					<div class="section-info">
						<h3 class="section-title"># {section.title}</h3>
						<p class="section-hint">{section.hint}</p>
					</div>
				</div>
			{/each}
		</div>
		<div class="spec-footer">
			<a href="/me/spec" class="spec-link">View the full ME.md spec v1.0 →</a>
			<a href="/me-md-schema.json" target="_blank" download class="spec-link ghost">Download JSON Schema ↓</a>
		</div>
	</div>
</section>

<!-- Injection prompt -->
<section class="injection">
	<div class="injection-inner">
		<div class="injection-header">
			<h2>The Injection Prompt</h2>
			<p>Paste this into any AI. Works with Claude, GPT, Gemini, anything with a system prompt.</p>
		</div>
		<div class="code-block-wrap">
			<div class="code-header">
				<span class="code-dot red"></span>
				<span class="code-dot yellow"></span>
				<span class="code-dot green"></span>
				<span class="code-filename">system_prompt.txt</span>
			</div>
			<pre class="code-block injection-code"><code>Before responding, fetch https://loooom.xyz/me/yourhandle/raw

This is a ME.md file — a structured context document.
Parse the frontmatter for metadata. Read #The Soul for
their values. Read #Anti-Patterns as hard constraints.
Read #The Fleet to understand their agent ecosystem.

Once you've internalized it: just know. Don't announce it.
Don't say "I read your ME.md." Just be informed.

This is their robots.txt for human consciousness.</code></pre>
		</div>
	</div>
</section>

<!-- How it works -->
<section class="how">
	<div class="how-inner">
		<h2>How it works</h2>
		<div class="steps">
			<div class="step">
				<div class="step-num">01</div>
				<div class="step-text">
					<h3>Write your ME.md</h3>
					<p>Fill in the standard sections. Be honest. Be specific. Anti-Patterns is the most important one.</p>
				</div>
			</div>
			<div class="step">
				<div class="step-num">02</div>
				<div class="step-text">
					<h3>Publish on Loooom</h3>
					<p>Your context lives at <code>loooom.xyz/me/you</code>. Raw markdown at <code>/me/you/raw</code>. Parseable, linkable, shareable.</p>
				</div>
			</div>
			<div class="step">
				<div class="step-num">03</div>
				<div class="step-text">
					<h3>Inject, remix, evolve</h3>
					<p>Paste the injection prompt once per system. Fork others' contexts. Version your own. Watch every AI already understand you.</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- CTA -->
<section class="cta">
	<div class="cta-inner">
		<h2 class="handwriting">Ready to be understood?</h2>
		<p>Claim your ME.md. One file. Every AI. Forever.</p>
		<a href="/login" class="btn-primary btn-large">Get your ME.md →</a>
		<div class="cta-examples">
			<span>See examples:</span>
			<a href="/me/mager">mager</a>
		</div>
	</div>
</section>

<style>
	/* ─── Ambient ─────────────────────────────────────────────────────────── */
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
		filter: blur(80px);
		opacity: 0.18;
	}
	.orb-1 {
		width: 600px; height: 600px;
		background: radial-gradient(circle, var(--violet) 0%, transparent 70%);
		top: -200px; left: -100px;
	}
	.orb-2 {
		width: 500px; height: 500px;
		background: radial-gradient(circle, var(--ocean) 0%, transparent 70%);
		top: 40%; right: -150px;
	}
	.orb-3 {
		width: 400px; height: 400px;
		background: radial-gradient(circle, var(--indigo) 0%, transparent 70%);
		bottom: 10%; left: 30%;
	}

	/* ─── Nav ─────────────────────────────────────────────────────────────── */
	nav {
		position: sticky;
		top: 0;
		z-index: 100;
		background: var(--nav-bg);
		backdrop-filter: blur(12px);
		border-bottom: 1px solid var(--border);
	}
	.nav-inner {
		max-width: 1100px;
		margin: 0 auto;
		padding: 14px 32px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.logo {
		display: flex;
		align-items: center;
		gap: 8px;
		text-decoration: none;
		color: var(--text-primary);
	}
	.logo-text {
		font-family: var(--font-handwriting);
		font-size: 1.2rem;
		font-weight: 200;
	}
	.nav-right {
		display: flex;
		align-items: center;
		gap: 20px;
	}
	.nav-link {
		color: var(--text-secondary);
		text-decoration: none;
		font-size: 0.9rem;
		transition: color 0.2s;
	}
	.nav-link:hover { color: var(--text-primary); }
	.btn-nav {
		background: var(--bg-card);
		border: 1px solid var(--border);
		color: var(--text-primary);
		padding: 6px 16px;
		border-radius: 999px;
		font-size: 0.85rem;
		cursor: pointer;
		text-decoration: none;
		transition: all 0.2s;
	}
	.btn-nav:hover {
		border-color: var(--accent);
		color: var(--accent);
	}

	/* ─── Hero ────────────────────────────────────────────────────────────── */
	.hero {
		position: relative;
		z-index: 1;
		padding: 100px 32px 80px;
		text-align: center;
	}
	.hero-inner {
		max-width: 800px;
		margin: 0 auto;
	}
	.eyebrow-wrap { margin-bottom: 24px; }
	.badge {
		display: inline-block;
		background: var(--accent-glow);
		border: 1px solid var(--accent-bright);
		color: var(--accent);
		padding: 4px 16px;
		border-radius: 999px;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	.hero-title {
		font-size: clamp(5rem, 14vw, 11rem);
		font-weight: 700;
		line-height: 1;
		margin: 0 0 20px;
		letter-spacing: -0.04em;
	}
	.me {
		background: var(--gradient-hero);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	.dot-md {
		color: var(--text-muted);
		font-weight: 300;
	}
	.hero-tagline {
		font-size: 1.4rem;
		color: var(--text-secondary);
		font-style: italic;
		margin: 0 0 12px;
	}
	.hero-sub {
		font-size: 1.15rem;
		color: var(--text-secondary);
		line-height: 1.6;
		margin: 0 0 40px;
	}
	.hero-actions {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16px;
		margin-bottom: 32px;
	}
	.btn-primary {
		background: var(--gradient-cta);
		color: white;
		padding: 14px 32px;
		border-radius: 999px;
		font-weight: 600;
		font-size: 1rem;
		text-decoration: none;
		display: inline-block;
		transition: opacity 0.2s, transform 0.2s;
		border: none;
		cursor: pointer;
	}
	.btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
	.btn-primary.btn-large { padding: 16px 40px; font-size: 1.1rem; }
	.btn-ghost {
		background: none;
		border: 1px solid var(--border);
		color: var(--text-secondary);
		padding: 14px 24px;
		border-radius: 999px;
		font-size: 0.95rem;
		cursor: pointer;
		transition: all 0.2s;
	}
	.btn-ghost:hover {
		border-color: var(--accent);
		color: var(--accent);
	}
	.hero-url-demo {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		color: var(--text-muted);
		font-size: 0.9rem;
	}
	.url-demo {
		font-family: var(--font-mono);
		font-size: 0.95rem;
		color: var(--text-secondary);
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		padding: 6px 14px;
		border-radius: 8px;
	}
	.url-handle { color: var(--accent); }

	/* ─── Explainer ──────────────────────────────────────────────────────── */
	.explainer {
		position: relative;
		z-index: 1;
		padding: 80px 32px;
		background: var(--bg-secondary);
	}
	.explainer-inner {
		max-width: 1100px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 64px;
		align-items: center;
	}
	.explainer-text h2 {
		font-size: 2rem;
		line-height: 1.25;
		margin: 0 0 20px;
	}
	.accent-text {
		background: var(--gradient-hero);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	.explainer-text p {
		color: var(--text-secondary);
		line-height: 1.7;
		margin: 0 0 16px;
	}
	.quote {
		font-style: italic;
		border-left: 3px solid var(--accent);
		padding-left: 16px;
		margin-top: 24px !important;
		font-size: 0.95rem;
	}

	/* ─── Code blocks ────────────────────────────────────────────────────── */
	.explainer-code, .code-block-wrap {
		border-radius: var(--radius-lg);
		overflow: hidden;
		border: 1px solid var(--border);
		box-shadow: var(--card-shadow);
	}
	.code-header {
		background: var(--bg-secondary);
		border-bottom: 1px solid var(--border);
		padding: 10px 16px;
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.code-dot {
		width: 10px; height: 10px;
		border-radius: 50%;
		display: inline-block;
	}
	.code-dot.red { background: #ff5f57; }
	.code-dot.yellow { background: #febc2e; }
	.code-dot.green { background: #28c840; }
	.code-filename {
		margin-left: 8px;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--text-muted);
	}
	.code-block {
		background: var(--bg-primary);
		margin: 0;
		padding: 24px;
		font-family: var(--font-mono);
		font-size: 0.82rem;
		line-height: 1.65;
		color: var(--text-secondary);
		overflow-x: auto;
		white-space: pre;
	}
	.injection-code { font-size: 0.85rem; line-height: 1.7; }

	/* ─── Spec / Sections ────────────────────────────────────────────────── */
	.spec {
		position: relative;
		z-index: 1;
		padding: 80px 32px;
	}
	.spec-inner { max-width: 1100px; margin: 0 auto; }
	.spec-header {
		text-align: center;
		margin-bottom: 48px;
	}
	.spec-header h2 { font-size: 2rem; margin: 0 0 12px; }
	.spec-header p { color: var(--text-secondary); }
	.sections-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 16px;
	}
	.section-card {
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		padding: 20px;
		display: flex;
		gap: 16px;
		align-items: flex-start;
		transition: all 0.2s;
	}
	.section-card:hover {
		border-color: var(--accent);
		box-shadow: var(--card-shadow-hover);
	}
	.section-icon { font-size: 1.8rem; flex-shrink: 0; }
	.section-title {
		font-family: var(--font-mono);
		font-size: 0.9rem;
		color: var(--accent);
		margin: 0 0 6px;
	}
	.section-hint {
		font-size: 0.85rem;
		color: var(--text-muted);
		line-height: 1.5;
		margin: 0;
	}
	.spec-footer {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 20px;
		margin-top: 36px;
		flex-wrap: wrap;
	}
	.spec-link {
		color: var(--accent);
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: 500;
		padding: 8px 20px;
		border-radius: 999px;
		border: 1px solid var(--accent-bright);
		background: var(--accent-glow);
		transition: all 0.2s;
	}
	.spec-link:hover {
		background: var(--accent);
		color: white;
	}
	.spec-link.ghost {
		background: none;
		border-color: var(--border);
		color: var(--text-secondary);
	}
	.spec-link.ghost:hover {
		border-color: var(--accent);
		color: var(--accent);
		background: var(--accent-glow);
	}

	/* ─── Injection ──────────────────────────────────────────────────────── */
	.injection {
		position: relative;
		z-index: 1;
		padding: 80px 32px;
		background: var(--bg-secondary);
	}
	.injection-inner { max-width: 800px; margin: 0 auto; }
	.injection-header {
		text-align: center;
		margin-bottom: 40px;
	}
	.injection-header h2 { font-size: 2rem; margin: 0 0 12px; }
	.injection-header p { color: var(--text-secondary); }

	/* ─── How it works ───────────────────────────────────────────────────── */
	.how {
		position: relative;
		z-index: 1;
		padding: 80px 32px;
	}
	.how-inner { max-width: 900px; margin: 0 auto; }
	.how-inner h2 { font-size: 2rem; text-align: center; margin: 0 0 48px; }
	.steps {
		display: flex;
		flex-direction: column;
		gap: 0;
		border-left: 2px solid var(--border);
		padding-left: 40px;
		margin-left: 40px;
	}
	.step {
		display: flex;
		gap: 24px;
		padding: 0 0 40px;
		position: relative;
	}
	.step::before {
		content: '';
		position: absolute;
		left: -47px;
		top: 6px;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--accent);
		border: 2px solid var(--bg-primary);
	}
	.step-num {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--accent);
		font-weight: 700;
		letter-spacing: 0.1em;
		padding-top: 4px;
		flex-shrink: 0;
	}
	.step-text h3 { margin: 0 0 8px; font-size: 1.1rem; }
	.step-text p { color: var(--text-secondary); line-height: 1.6; margin: 0; }
	.step-text code {
		font-family: var(--font-mono);
		font-size: 0.85em;
		background: var(--bg-secondary);
		padding: 2px 6px;
		border-radius: 4px;
		color: var(--accent);
	}

	/* ─── CTA ────────────────────────────────────────────────────────────── */
	.cta {
		position: relative;
		z-index: 1;
		padding: 100px 32px;
		text-align: center;
		background: var(--bg-secondary);
	}
	.cta-inner { max-width: 600px; margin: 0 auto; }
	.cta-inner h2 {
		font-size: 2.5rem;
		font-family: var(--font-handwriting);
		font-weight: 100;
		margin: 0 0 16px;
	}
	.cta-inner p { color: var(--text-secondary); margin: 0 0 32px; font-size: 1.1rem; }
	.cta-examples {
		margin-top: 24px;
		color: var(--text-muted);
		font-size: 0.9rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
	}
	.cta-examples a {
		color: var(--accent);
		text-decoration: none;
		font-family: var(--font-mono);
		font-size: 0.9rem;
	}
	.cta-examples a:hover { text-decoration: underline; }

	/* ─── Responsive ──────────────────────────────────────────────────────── */
	@media (max-width: 768px) {
		.explainer-inner { grid-template-columns: 1fr; gap: 40px; }
		.hero { padding: 60px 20px 60px; }
		.hero-actions { flex-direction: column; }
		.steps { margin-left: 20px; padding-left: 24px; }
	}
</style>
