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

	let copiedCurl = $state(false);
	let copiedAgents = $state(false);

	function copyCurl() {
		navigator.clipboard.writeText('curl https://loooom.xyz/me/mager/raw');
		copiedCurl = true;
		setTimeout(() => (copiedCurl = false), 2000);
	}

	function copyAgents() {
		navigator.clipboard.writeText('https://loooom.xyz/AGENTS.md');
		copiedAgents = true;
		setTimeout(() => (copiedAgents = false), 2000);
	}
</script>

<svelte:head>
	<title>Loooom — Machine-First Human Context</title>
	<meta
		name="description"
		content="Publish your ME.md — one URL that tells every AI who you are. Machine-readable. Always public. No re-prompting."
	/>
	<!-- Machine meta -->
	<meta name="loooom-agents" content="https://loooom.xyz/AGENTS.md" />
	<meta name="loooom-directory" content="https://loooom.xyz/api/directory" />
	<meta name="loooom-llms" content="https://loooom.xyz/llms.txt" />
	<link rel="alternate" type="text/plain" title="LLM Index" href="/llms.txt" />
	<link rel="alternate" type="text/markdown" title="Agent Briefing" href="/AGENTS.md" />
</svelte:head>

<!-- Nav -->
<nav>
	<div class="nav-inner">
		<a href="/" class="logo">
			<YarnLogo size={22} />
			<span class="logo-text">loooom</span>
		</a>
		<div class="nav-right">
			<a href="/mcp" class="nav-link">MCP</a>
			<a href="/me" class="nav-link nav-link-memd">ME.md</a>
			<a href="/browse" class="nav-link">Skills</a>
			<a href="/AGENTS.md" class="nav-link nav-link-agents" target="_blank">AGENTS.md</a>
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

<!-- Hero: speaks to both humans and machines -->
<section class="hero">
	<div class="hero-inner">
		<!-- Machine eyebrow — the real CTA for bots -->
		<div class="machine-eyebrow">
			<span class="machine-eyebrow-prompt">$</span>
			<code class="machine-eyebrow-cmd">curl https://loooom.xyz/me/<span class="cmd-handle">mager</span>/raw</code>
			<button class="machine-eyebrow-copy" onclick={copyCurl} aria-label="Copy curl command">
				{copiedCurl ? '✓' : 'copy'}
			</button>
		</div>

		<h1>One URL.<br/>Every AI<br/>knows you.</h1>

		<p class="hero-sub">
			Stop re-introducing yourself every session. Your <strong>ME.md</strong> is a portable context file — plain markdown, always public, machine-readable by any AI.
		</p>

		<div class="hero-url-preview">
			<span class="url-prefix">loooom.xyz/me/</span><span class="url-handle">you</span><span class="url-suffix">/raw</span>
		</div>

		<div class="hero-actions">
			<a href="/login" class="btn-primary-hero">Claim your ME.md →</a>
			<a href="/me/mager" class="btn-ghost-hero">See an example</a>
		</div>
		<p class="hero-hint">Free. No signup to browse. Raw markdown always CORS-open.</p>
	</div>
</section>

<!-- Machine-first: the agent quickstart section -->
<section class="agent-section">
	<div class="section-inner">
		<div class="agent-section-header">
			<div class="agent-badge">🤖 For AI Agents</div>
			<h2>If you're a bot, start here.</h2>
			<p class="agent-section-sub">Everything on Loooom is machine-readable by design. No scraping required. No API key. Just fetch.</p>
		</div>

		<div class="agent-cards">
			<!-- Card 1: Fetch any human -->
			<div class="agent-card">
				<div class="agent-card-num">01</div>
				<h3>Fetch any human's context</h3>
				<div class="agent-code-block">
					<div class="code-line"><span class="code-comment"># Get a human's full context in one command</span></div>
					<div class="code-line"><span class="code-cmd">curl</span> https://loooom.xyz/me/<span class="code-var">mager</span>/raw</div>
					<div class="code-line code-dim"><span class="code-comment"># Returns plain markdown — parse or inject directly</span></div>
				</div>
				<p>CORS-open. No auth. Works from any LLM, any HTTP client, any language.</p>
			</div>

			<!-- Card 2: Directory -->
			<div class="agent-card">
				<div class="agent-card-num">02</div>
				<h3>Discover all public profiles</h3>
				<div class="agent-code-block">
					<div class="code-line"><span class="code-comment"># JSON directory of every ME.md on Loooom</span></div>
					<div class="code-line"><span class="code-cmd">curl</span> https://loooom.xyz/api/directory</div>
					<div class="code-line code-dim"><span class="code-comment"># [{'{'} username, rawUrl, tags, timezone... {'}'}]</span></div>
				</div>
				<p>Full index with rawUrl per profile. Use it to build agent directories, context prefetchers, or human indexes.</p>
			</div>

			<!-- Card 3: AGENTS.md -->
			<div class="agent-card">
				<div class="agent-card-num">03</div>
				<h3>Read the full machine briefing</h3>
				<div class="agent-code-block">
					<div class="code-line"><span class="code-comment"># Complete protocol docs, written for LLMs</span></div>
					<div class="code-line"><span class="code-cmd">GET</span> https://loooom.xyz/<span class="code-var">AGENTS.md</span></div>
					<div class="code-line code-dim"><span class="code-comment"># API endpoints, schema, integration patterns</span></div>
				</div>
				<p>The authoritative briefing for any AI working with Loooom. Schema, endpoints, examples, integration patterns.</p>
				<div class="agent-card-links">
					<a href="/AGENTS.md" target="_blank" class="agent-card-link-primary">Read AGENTS.md →</a>
					<button class="agent-card-link-copy" onclick={copyAgents}>{copiedAgents ? '✓ copied' : 'Copy URL'}</button>
				</div>
			</div>
		</div>

		<!-- Machine endpoints table -->
		<div class="endpoints-table">
			<div class="endpoints-title">Machine-Readable Endpoints</div>
			<div class="endpoints-grid">
				<div class="ep-row ep-header">
					<span>Endpoint</span>
					<span>Format</span>
					<span>Auth</span>
					<span>Use for</span>
				</div>
				<div class="ep-row">
					<code>/me/{'{username}'}/raw</code>
					<span class="ep-badge ep-md">Markdown</span>
					<span class="ep-none">None</span>
					<span>Inject human context into AI sessions</span>
				</div>
				<div class="ep-row">
					<code>/api/directory</code>
					<span class="ep-badge ep-json">JSON</span>
					<span class="ep-none">None</span>
					<span>Enumerate all public ME.md profiles</span>
				</div>
				<div class="ep-row">
					<code>/AGENTS.md</code>
					<span class="ep-badge ep-md">Markdown</span>
					<span class="ep-none">None</span>
					<span>Full protocol briefing for AI agents</span>
				</div>
				<div class="ep-row">
					<code>/llms.txt</code>
					<span class="ep-badge ep-txt">Text</span>
					<span class="ep-none">None</span>
					<span>LLM indexing (llms.txt standard)</span>
				</div>
				<div class="ep-row">
					<code>/me-md-schema.json</code>
					<span class="ep-badge ep-json">JSON Schema</span>
					<span class="ep-none">None</span>
					<span>Validate ME.md frontmatter</span>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- For humans: How ME.md works -->
<section class="how-memd">
	<div class="section-inner">
		<p class="section-eyebrow">How it works</p>
		<h2>Three steps. Done forever.</h2>
		<div class="steps-memd">
			<div class="step-memd">
				<div class="step-num-memd">01</div>
				<div class="step-content">
					<h3>Write your ME.md</h3>
					<p>Seven canonical sections. Plain markdown. Start with your values, stack, and a hard list of what you hate. Takes 10 minutes.</p>
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
					<p>One injection prompt in your system prompt. Every AI session starts already knowing you. No more re-introducing yourself to Claude, GPT, Gemini.</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Format demo -->
<section class="demo-section">
	<div class="section-inner">
		<div class="demo-grid">
			<div class="demo-text">
				<p class="section-eyebrow">The format</p>
				<h2>Frontmatter for machines.<br/>Markdown for humans.</h2>
				<p>YAML frontmatter carries your identity: handle, timezone, agent fleet. Markdown sections carry your soul: values, preferences, anti-patterns.</p>
				<p>Any AI can read it. Any human can edit it. One file to rule every context window.</p>
				<div class="demo-text-links">
					<a href="/me" class="link-cta">Explore the ME.md spec →</a>
					<a href="/me/mager/raw" target="_blank" class="link-ghost">See raw example ↗</a>
				</div>
			</div>
			<div class="demo-code">
				<div class="code-win">
					<div class="code-win-bar">
						<span class="win-dot r"></span>
						<span class="win-dot y"></span>
						<span class="win-dot g"></span>
						<span class="win-label">me.md</span>
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

<!-- Skills: secondary section -->
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
			<p class="footer-note">Machine-first. Open source. Always free. Made in Chicago.</p>
			<div class="footer-machine-links">
				<a href="/AGENTS.md" class="footer-machine-link">AGENTS.md</a>
				<a href="/llms.txt" class="footer-machine-link">llms.txt</a>
				<a href="/api/directory" class="footer-machine-link">directory</a>
			</div>
		</div>
		<div class="footer-links">
			<div class="footer-col">
				<h4>ME.md</h4>
				<a href="/me">What is ME.md?</a>
				<a href="/me/mager">See an example</a>
				<a href="/me/mager/raw">Raw example ↗</a>
				<a href="/login">Claim yours</a>
			</div>
			<div class="footer-col">
				<h4>Skills</h4>
				<a href="/browse">Browse</a>
				<a href="/startweaving">Create</a>
				<a href="/docs">Docs</a>
			</div>
			<div class="footer-col">
				<h4>For Machines</h4>
				<a href="/AGENTS.md" target="_blank">AGENTS.md</a>
				<a href="/llms.txt" target="_blank">llms.txt</a>
				<a href="/api/directory" target="_blank">Directory API</a>
				<a href="/me-md-schema.json" target="_blank">JSON Schema</a>
			</div>
			<div class="footer-col">
				<h4>Open Source</h4>
				<a href="https://github.com/mager/loooom.xyz" target="_blank" rel="noopener">Website</a>
				<a href="https://github.com/mager/loooom" target="_blank" rel="noopener">Catalog</a>
			</div>
		</div>
	</div>
	<div class="footer-bottom">
		A weeknight project by <a href="https://x.com/mager" target="_blank" rel="noopener">@mager</a>
		&amp;
		<a href="https://x.com/mager" target="_blank" rel="noopener">@magerbot</a>.
		&nbsp;·&nbsp;
		<a href="/AGENTS.md">For bots: read AGENTS.md first.</a>
	</div>
</footer>

<style>
	/* ===== Base ===== */
	:global(html),
	:global(body) {
		overflow-x: hidden;
		max-width: 100vw;
	}

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
		max-width: 1040px;
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
	.nav-link:hover { color: var(--text-primary); }
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
	}
	.nav-link-agents {
		font-family: var(--font-mono);
		font-size: 0.72rem !important;
		color: var(--ocean) !important;
		border: 1px solid color-mix(in srgb, var(--ocean) 30%, transparent);
		padding: 3px 8px;
		border-radius: 4px;
	}
	.nav-link-agents:hover {
		background: color-mix(in srgb, var(--ocean) 8%, transparent);
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
		white-space: nowrap;
		flex-shrink: 0;
	}
	.btn-nav:hover { border-color: var(--text-muted); }
	.logo { flex-shrink: 0; }

	/* ===== Shared ===== */
	.section-inner {
		max-width: 1040px;
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

	/* Machine eyebrow — the command prompt */
	.machine-eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		background: var(--bg-secondary);
		border: 1px solid color-mix(in srgb, var(--ocean) 40%, transparent);
		border-radius: 6px;
		padding: 0.45rem 0.85rem;
		margin-bottom: 2rem;
		font-family: var(--font-mono);
		font-size: 0.78rem;
		max-width: 100%;
		box-sizing: border-box;
		overflow: hidden;
	}
	.machine-eyebrow-prompt {
		color: var(--ocean);
		font-weight: 700;
		flex-shrink: 0;
	}
	.machine-eyebrow-cmd {
		color: var(--text-secondary);
		font-family: inherit;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		min-width: 0;
	}
	.cmd-handle {
		color: var(--violet);
		font-weight: 700;
	}
	.machine-eyebrow-copy {
		background: none;
		border: none;
		color: var(--ocean);
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 600;
		cursor: pointer;
		padding: 0;
		opacity: 0.7;
		transition: opacity 0.2s;
		flex-shrink: 0;
	}
	.machine-eyebrow-copy:hover { opacity: 1; }

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
	.url-suffix { color: var(--ocean); }
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

	/* ===== Agent Section ===== */
	.agent-section {
		padding: 5rem 1.5rem;
		background: var(--bg-secondary);
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
	}
	.agent-section-header {
		text-align: center;
		margin-bottom: 3rem;
	}
	.agent-badge {
		display: inline-block;
		background: color-mix(in srgb, var(--ocean) 12%, transparent);
		border: 1px solid color-mix(in srgb, var(--ocean) 35%, transparent);
		color: var(--ocean);
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 4px 14px;
		border-radius: 999px;
		margin-bottom: 1rem;
	}
	.agent-section-header h2 {
		font-size: clamp(1.6rem, 4vw, 2.4rem);
		margin-bottom: 0.75rem;
	}
	.agent-section-sub {
		color: var(--text-secondary);
		max-width: 520px;
		margin: 0 auto;
		line-height: 1.65;
		font-size: 0.95rem;
	}

	/* Agent cards */
	.agent-cards {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.25rem;
		margin-bottom: 2.5rem;
	}
	.agent-card {
		background: var(--bg-primary);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}
	.agent-card-num {
		font-family: var(--font-mono);
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		color: var(--ocean);
	}
	.agent-card h3 {
		font-size: 1rem;
		font-weight: 700;
		margin: 0;
		line-height: 1.25;
	}
	.agent-card p {
		font-size: 0.85rem;
		color: var(--text-secondary);
		line-height: 1.6;
		margin: 0;
	}

	/* Agent code blocks */
	.agent-code-block {
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 0.85rem 1rem;
		display: flex;
		flex-direction: column;
		gap: 3px;
		overflow-x: auto;
		max-width: 100%;
	}
	.code-line {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		line-height: 1.5;
		color: var(--text-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
	}
	.code-dim { opacity: 0.6; }
	.code-comment { color: var(--text-muted); }
	.code-cmd { color: var(--ocean); font-weight: 700; }
	.code-var { color: var(--violet); }

	.agent-card-links {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	.agent-card-link-primary {
		font-size: 0.82rem;
		font-weight: 700;
		color: var(--ocean);
		text-decoration: none;
		transition: opacity 0.2s;
	}
	.agent-card-link-primary:hover { opacity: 0.8; }
	.agent-card-link-copy {
		font-size: 0.75rem;
		font-family: var(--font-mono);
		background: none;
		border: 1px solid var(--border);
		color: var(--text-muted);
		padding: 2px 8px;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s;
	}
	.agent-card-link-copy:hover { border-color: var(--ocean); color: var(--ocean); }

	/* Endpoints table */
	.endpoints-table {
		border: 1px solid var(--border);
		border-radius: 12px;
		overflow: hidden;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
	}
	.endpoints-title {
		background: var(--bg-primary);
		border-bottom: 1px solid var(--border);
		padding: 0.75rem 1.25rem;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-muted);
	}
	.endpoints-grid {
		display: flex;
		flex-direction: column;
		min-width: 560px;
	}
	.ep-row {
		display: grid;
		grid-template-columns: 2fr 1fr 0.6fr 2fr;
		gap: 1rem;
		padding: 0.65rem 1.25rem;
		font-size: 0.82rem;
		border-bottom: 1px solid var(--border);
		align-items: center;
	}
	.ep-row:last-child { border-bottom: none; }
	.ep-header {
		background: var(--bg-secondary);
		font-family: var(--font-mono);
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-muted);
	}
	.ep-row code {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		color: var(--violet);
		word-break: break-all;
	}
	.ep-row span:not(.ep-badge):not(.ep-none) {
		color: var(--text-secondary);
		font-size: 0.8rem;
	}
	.ep-badge {
		display: inline-block;
		font-family: var(--font-mono);
		font-size: 0.65rem;
		font-weight: 700;
		padding: 2px 7px;
		border-radius: 4px;
	}
	.ep-md { background: color-mix(in srgb, var(--violet) 12%, transparent); color: var(--violet); }
	.ep-json { background: color-mix(in srgb, var(--ocean) 12%, transparent); color: var(--ocean); }
	.ep-txt { background: color-mix(in srgb, var(--text-muted) 12%, transparent); color: var(--text-muted); }
	.ep-none {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: #22c55e;
	}

	/* ===== How ME.md Works ===== */
	.how-memd {
		padding: 5rem 1.5rem;
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
		border: 2px solid var(--bg-primary);
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
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		padding: 1px 6px;
		border-radius: 4px;
		color: var(--violet);
	}

	/* ===== Demo Section ===== */
	.demo-section {
		padding: 5rem 1.5rem;
		background: var(--bg-secondary);
		border-top: 1px solid var(--border);
	}
	.demo-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4rem;
		align-items: center;
	}
	.demo-text h2 { margin-bottom: 1rem; }
	.demo-text p { color: var(--text-secondary); line-height: 1.65; margin: 0 0 0.85rem; font-size: 0.95rem; }
	.demo-text-links { display: flex; gap: 1.25rem; flex-wrap: wrap; align-items: center; margin-top: 1.25rem; }
	.code-win {
		border: 1px solid var(--border);
		border-radius: 16px;
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
	.win-dot { width: 10px; height: 10px; border-radius: 50%; }
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
		-webkit-overflow-scrolling: touch;
	}

	/* ===== Skills Secondary ===== */
	.skills-secondary {
		padding: 4rem 1.5rem;
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

	/* ===== Shared CTAs ===== */
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
		max-width: 1040px;
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
		color: var(--text-primary);
	}
	.footer-note {
		font-size: 0.78rem;
		color: var(--text-muted);
		font-weight: 300;
		margin-bottom: 0.75rem;
	}
	.footer-machine-links {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	.footer-machine-link {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		font-weight: 600;
		color: var(--ocean);
		text-decoration: none;
		background: color-mix(in srgb, var(--ocean) 8%, transparent);
		border: 1px solid color-mix(in srgb, var(--ocean) 25%, transparent);
		padding: 2px 8px;
		border-radius: 4px;
		transition: all 0.2s;
	}
	.footer-machine-link:hover {
		background: color-mix(in srgb, var(--ocean) 15%, transparent);
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
	.footer-col a:hover { color: var(--text-primary); }
	.footer-bottom {
		max-width: 1040px;
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
	.footer-bottom a:hover { color: var(--text-primary); }

	/* ===== Responsive ===== */
	@media (max-width: 900px) {
		.agent-cards {
			grid-template-columns: 1fr;
		}
		.ep-row {
			grid-template-columns: 1.5fr 0.8fr 0.6fr 1.5fr;
		}
	}
	@media (max-width: 720px) {
		.demo-grid,
		.skills-secondary-inner {
			grid-template-columns: 1fr;
			gap: 2rem;
		}
		.footer-inner {
			flex-direction: column;
		}
		.footer-links {
			gap: 2rem;
			flex-wrap: wrap;
		}
		.ep-row {
			grid-template-columns: 1fr 1fr;
			gap: 0.5rem;
		}
		.ep-row span:last-child {
			display: none;
		}
	}
	@media (max-width: 640px) {
		h1 { font-size: 2.75rem; }
		.hero { padding: 5.5rem 1rem 3rem; }
		.hero-actions { flex-direction: column; align-items: center; }
		.machine-eyebrow { font-size: 0.68rem; max-width: calc(100vw - 2rem); }
		.nav-link { display: none; }
		.nav-link-memd { display: none; }
		.nav-link-agents { display: none; }
		.agent-section { padding: 3rem 1rem; }
		.agent-card { padding: 1.25rem; }
		.section-inner { padding: 0 1rem; }
		.how-memd { padding: 3.5rem 1rem; }
		.demo-section { padding: 3.5rem 1rem; }
		.skills-secondary { padding: 3rem 1rem; }
		.hero-url-preview { font-size: 0.85rem; max-width: calc(100vw - 2rem); }
	}
</style>
