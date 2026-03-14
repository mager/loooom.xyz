<script lang="ts">
	import YarnLogo from '$lib/components/YarnLogo.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	const tools = [
		{
			name: 'list_skills',
			emoji: '📋',
			description: 'Browse the full Loooom skill catalog. Returns all available skills with titles, categories, authors, and install counts.',
			example: 'list_skills()',
			accentColor: '#e07b54',
			bgColor: 'rgba(224, 123, 84, 0.08)',
		},
		{
			name: 'search_skills',
			emoji: '🔍',
			description: 'Find skills by topic, keyword, or use case. Fuzzy search across names, descriptions, and tags.',
			example: 'search_skills({ query: "git" })',
			accentColor: '#b45309',
			bgColor: 'rgba(180, 83, 9, 0.08)',
		},
		{
			name: 'get_skill',
			emoji: '🔎',
			description: 'Get full details on any skill — readme, install command, author info, version, and usage examples.',
			example: 'get_skill({ id: "mager/prxps-skill" })',
			accentColor: '#0e7490',
			bgColor: 'rgba(14, 116, 144, 0.08)',
		},
		{
			name: 'list_categories',
			emoji: '🗂️',
			description: 'Explore all skill categories in the marketplace. Useful for navigating by domain — coding, productivity, research, etc.',
			example: 'list_categories()',
			accentColor: '#7c3aed',
			bgColor: 'rgba(124, 58, 237, 0.08)',
		},
		{
			name: 'get_install_command',
			emoji: '⚡',
			description: 'Get the exact install command for any skill. Works for Claude Code, Cursor, Windsurf, and other MCP-compatible clients.',
			example: 'get_install_command({ id: "mager/prxps-skill" })',
			accentColor: '#16a34a',
			bgColor: 'rgba(22, 163, 74, 0.08)',
		},
	];

	const claudeConfig = `{
  "mcpServers": {
    "loooom": {
      "command": "npx",
      "args": ["-y", "@mager/loooom-mcp"]
    }
  }
}`;

	let copiedNpx = $state(false);
	let copiedJson = $state(false);

	async function copyNpx() {
		await navigator.clipboard.writeText('npx -y @mager/loooom-mcp');
		copiedNpx = true;
		setTimeout(() => (copiedNpx = false), 2000);
	}

	async function copyJson() {
		await navigator.clipboard.writeText(claudeConfig);
		copiedJson = true;
		setTimeout(() => (copiedJson = false), 2000);
	}
</script>

<svelte:head>
	<title>MCP Server — Skills, discoverable by any AI — Loooom</title>
	<meta
		name="description"
		content="The Loooom MCP server gives any AI agent 5 tools to discover, search, and install Claude Code skills from the marketplace."
	/>
</svelte:head>

<!-- Ambient -->
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
			<a href="/mcp" class="nav-link nav-link-active">MCP</a>
			<a href="/me" class="nav-link">ME.md</a>
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
			<span class="badge">@mager/loooom-mcp</span>
		</div>

		<h1 class="hero-title">
			Skills, <span class="hero-accent">discoverable</span><br />
			by any AI
		</h1>

		<p class="hero-sub">
			An MCP server that gives your AI agents 5 tools to browse, search,<br />
			and install skills from the Loooom marketplace. Works with Claude,<br />
			Cursor, Windsurf — any MCP-compatible client.
		</p>

		<div class="hero-actions">
			<a href="#quickstart" class="btn-primary">Get started →</a>
			<a href="https://github.com/mager/loooom" target="_blank" rel="noopener" class="btn-ghost">View on GitHub ↗</a>
		</div>

		<!-- Config preview in hero -->
		<div class="hero-code-wrap">
			<div class="code-window">
				<div class="code-header">
					<div class="dots">
						<span class="dot red"></span>
						<span class="dot yellow"></span>
						<span class="dot green"></span>
					</div>
					<span class="code-filename">claude_desktop_config.json</span>
					<button class="copy-btn" onclick={copyJson} title="Copy config">
						{copiedJson ? '✓' : '⎘'}
					</button>
				</div>
				<pre class="code-block"><code><span class="json-brace">{'{'}</span>
  <span class="json-key">"mcpServers"</span><span class="json-colon">:</span> <span class="json-brace">{'{'}</span>
    <span class="json-key">"loooom"</span><span class="json-colon">:</span> <span class="json-brace">{'{'}</span>
      <span class="json-key">"command"</span><span class="json-colon">:</span> <span class="json-str">"npx"</span><span class="json-comma">,</span>
      <span class="json-key">"args"</span><span class="json-colon">:</span> <span class="json-bracket">[</span><span class="json-str">"-y"</span><span class="json-comma">,</span> <span class="json-str">"@mager/loooom-mcp"</span><span class="json-bracket">]</span>
    <span class="json-brace">{'}'}</span>
  <span class="json-brace">{'}'}</span>
<span class="json-brace">{'}'}</span></code></pre>
			</div>
		</div>
	</div>
</section>

<!-- Tools section -->
<section class="tools-section">
	<div class="tools-inner">
		<div class="section-header">
			<span class="section-label">5 tools</span>
			<h2>What your AI can do</h2>
			<p>Each tool is purpose-built for skill discovery. Simple inputs, structured outputs.</p>
		</div>

		<div class="tools-grid">
			{#each tools as tool}
				<div class="tool-card" style="--accent-color: {tool.accentColor}; --bg-color: {tool.bgColor};">
					<div class="tool-stripe"></div>
					<div class="tool-body">
						<div class="tool-name-row">
							<span class="tool-emoji">{tool.emoji}</span>
							<code class="tool-name">{tool.name}</code>
						</div>
						<p class="tool-desc">{tool.description}</p>
						<div class="tool-example-wrap">
							<span class="example-label">example</span>
							<code class="tool-example">{tool.example}</code>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Quick Start -->
<section class="quickstart" id="quickstart">
	<div class="quickstart-inner">
		<div class="section-header">
			<span class="section-label">Quick Start</span>
			<h2>Two ways to install</h2>
			<p>Pick your client. Both methods pull the latest version automatically.</p>
		</div>

		<div class="install-options">
			<!-- Claude Desktop -->
			<div class="install-card">
				<div class="install-icon">🤖</div>
				<h3>Claude Desktop</h3>
				<p>Add to your <code>claude_desktop_config.json</code> and restart Claude.</p>
				<div class="code-window dark">
					<div class="code-header">
						<div class="dots">
							<span class="dot red"></span>
							<span class="dot yellow"></span>
							<span class="dot green"></span>
						</div>
						<span class="code-filename">claude_desktop_config.json</span>
						<button class="copy-btn" onclick={copyJson}>
							{copiedJson ? '✓ copied' : '⎘ copy'}
						</button>
					</div>
					<pre class="code-block"><code><span class="json-brace">{'{'}</span>
  <span class="json-key">"mcpServers"</span><span class="json-colon">:</span> <span class="json-brace">{'{'}</span>
    <span class="json-key">"loooom"</span><span class="json-colon">:</span> <span class="json-brace">{'{'}</span>
      <span class="json-key">"command"</span><span class="json-colon">:</span> <span class="json-str">"npx"</span><span class="json-comma">,</span>
      <span class="json-key">"args"</span><span class="json-colon">:</span> <span class="json-bracket">[</span><span class="json-str">"-y"</span><span class="json-comma">,</span> <span class="json-str">"@mager/loooom-mcp"</span><span class="json-bracket">]</span>
    <span class="json-brace">{'}'}</span>
  <span class="json-brace">{'}'}</span>
<span class="json-brace">{'}'}</span></code></pre>
				</div>
				<p class="install-hint">Config location: <code>~/Library/Application Support/Claude/claude_desktop_config.json</code></p>
			</div>

			<!-- npx -->
			<div class="install-card">
				<div class="install-icon">⚡</div>
				<h3>Run directly with npx</h3>
				<p>Test it right now without installing anything. Works with any MCP-compatible shell.</p>
				<div class="code-window dark">
					<div class="code-header">
						<div class="dots">
							<span class="dot red"></span>
							<span class="dot yellow"></span>
							<span class="dot green"></span>
						</div>
						<span class="code-filename">terminal</span>
						<button class="copy-btn" onclick={copyNpx}>
							{copiedNpx ? '✓ copied' : '⎘ copy'}
						</button>
					</div>
					<pre class="code-block"><code><span class="json-str">npx</span> <span class="json-key">-y</span> <span class="json-amber">@mager/loooom-mcp</span></code></pre>
				</div>
				<p class="install-hint">Works with <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener">any MCP client</a> — Cursor, Windsurf, OpenClaw, and more.</p>
			</div>
		</div>
	</div>
</section>

<!-- CTA -->
<section class="cta">
	<div class="cta-inner">
		<h2 class="cta-title">Ready to browse?</h2>
		<p class="cta-sub">Explore the marketplace. Find a skill. Let your AI install it.</p>
		<div class="cta-actions">
			<a href="/browse" class="btn-primary btn-large">Browse Skills →</a>
			<a href="https://github.com/mager/loooom" target="_blank" rel="noopener" class="btn-ghost">Star on GitHub ↗</a>
		</div>
		<p class="cta-package">
			<code>npm i -g @mager/loooom-mcp</code> — coming soon
		</p>
	</div>
</section>

<style>
	/* ─── Ambient ───────────────────────────────────────────────────────── */
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
		filter: blur(90px);
		opacity: 0.15;
	}
	.orb-1 {
		width: 700px; height: 700px;
		background: radial-gradient(circle, #e07b54 0%, transparent 70%);
		top: -200px; right: -150px;
	}
	.orb-2 {
		width: 500px; height: 500px;
		background: radial-gradient(circle, var(--accent) 0%, transparent 70%);
		bottom: 30%; left: -100px;
	}
	.orb-3 {
		width: 400px; height: 400px;
		background: radial-gradient(circle, #7c3aed 0%, transparent 70%);
		bottom: 5%; right: 20%;
	}

	/* ─── Nav ───────────────────────────────────────────────────────────── */
	nav {
		position: sticky;
		top: 0;
		z-index: 100;
		background: var(--nav-bg, rgba(250, 250, 249, 0.85));
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
	.nav-link-active {
		color: var(--text-primary);
		font-weight: 500;
	}
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

	/* ─── Hero ──────────────────────────────────────────────────────────── */
	.hero {
		position: relative;
		z-index: 1;
		padding: 90px 32px 80px;
		text-align: center;
	}
	.hero-inner {
		max-width: 820px;
		margin: 0 auto;
	}
	.eyebrow-wrap { margin-bottom: 24px; }
	.badge {
		display: inline-block;
		font-family: var(--font-mono);
		font-size: 0.78rem;
		background: var(--bg-card);
		border: 1px solid var(--border);
		color: var(--amber);
		padding: 5px 14px;
		border-radius: 6px;
		letter-spacing: 0.02em;
	}
	.hero-title {
		font-family: var(--font-handwriting);
		font-weight: 100;
		font-size: clamp(2.8rem, 7vw, 5.5rem);
		line-height: 1.1;
		margin: 0 0 24px;
		color: var(--text-primary);
	}
	.hero-accent {
		font-style: italic;
		background: linear-gradient(135deg, #e07b54 0%, var(--amber) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	.hero-sub {
		font-size: 1.1rem;
		color: var(--text-secondary);
		line-height: 1.7;
		margin: 0 0 40px;
	}
	.hero-actions {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16px;
		margin-bottom: 48px;
	}
	.btn-primary {
		background: linear-gradient(135deg, #e07b54 0%, var(--amber) 100%);
		color: white;
		padding: 14px 32px;
		border-radius: 999px;
		font-weight: 600;
		font-size: 0.95rem;
		text-decoration: none;
		display: inline-block;
		transition: opacity 0.2s, transform 0.2s;
		border: none;
		cursor: pointer;
	}
	.btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
	.btn-primary.btn-large { padding: 16px 40px; font-size: 1.05rem; }
	.btn-ghost {
		background: none;
		border: 1px solid var(--border);
		color: var(--text-secondary);
		padding: 14px 24px;
		border-radius: 999px;
		font-size: 0.95rem;
		cursor: pointer;
		transition: all 0.2s;
		text-decoration: none;
		display: inline-block;
	}
	.btn-ghost:hover {
		border-color: var(--text-primary);
		color: var(--text-primary);
	}

	/* ─── Code windows ──────────────────────────────────────────────────── */
	.hero-code-wrap {
		max-width: 540px;
		margin: 0 auto;
		text-align: left;
	}
	.code-window {
		border-radius: var(--radius-lg);
		overflow: hidden;
		border: 1px solid var(--border);
		box-shadow: var(--card-shadow);
	}
	.code-window.dark {
		border-color: rgba(255,255,255,0.08);
	}
	.code-header {
		background: #252532;
		border-bottom: 1px solid rgba(255,255,255,0.06);
		padding: 10px 16px;
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.dots { display: flex; gap: 6px; }
	.dot {
		width: 10px; height: 10px;
		border-radius: 50%;
	}
	.dot.red    { background: #ff5f57; }
	.dot.yellow { background: #febc2e; }
	.dot.green  { background: #28c840; }
	.code-filename {
		flex: 1;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: rgba(255,255,255,0.35);
	}
	.copy-btn {
		background: none;
		border: 1px solid rgba(255,255,255,0.12);
		color: rgba(255,255,255,0.4);
		padding: 3px 10px;
		border-radius: 4px;
		font-size: 0.75rem;
		cursor: pointer;
		transition: all 0.2s;
		font-family: var(--font-mono);
	}
	.copy-btn:hover {
		border-color: rgba(255,255,255,0.3);
		color: rgba(255,255,255,0.7);
	}
	.code-block {
		background: #1a1a2e;
		margin: 0;
		padding: 22px 24px;
		font-family: var(--font-mono);
		font-size: 0.82rem;
		line-height: 1.7;
		overflow-x: auto;
		white-space: pre;
	}
	/* JSON syntax colors */
	:global(.json-key)    { color: #fbbf24; } /* amber */
	:global(.json-str)    { color: #e2d9c8; } /* warm cream */
	:global(.json-brace)  { color: #94a3b8; }
	:global(.json-bracket){ color: #94a3b8; }
	:global(.json-colon)  { color: #64748b; }
	:global(.json-comma)  { color: #64748b; }
	:global(.json-amber)  { color: #f59e0b; }

	/* ─── Tools Section ─────────────────────────────────────────────────── */
	.tools-section {
		position: relative;
		z-index: 1;
		padding: 80px 32px;
		background: var(--bg-secondary);
	}
	.tools-inner { max-width: 1100px; margin: 0 auto; }

	.section-header {
		text-align: center;
		margin-bottom: 52px;
	}
	.section-label {
		display: inline-block;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--amber);
		margin-bottom: 12px;
		background: rgba(245, 158, 11, 0.1);
		padding: 4px 12px;
		border-radius: 4px;
	}
	.section-header h2 {
		font-size: 2.2rem;
		line-height: 1.1;
		margin: 0 0 14px;
		font-weight: 700;
	}
	.section-header p {
		color: var(--text-secondary);
		font-size: 1rem;
	}

	.tools-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: 16px;
	}
	.tool-card {
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		overflow: hidden;
		display: flex;
		transition: box-shadow 0.2s, transform 0.2s;
	}
	.tool-card:hover {
		box-shadow: var(--card-shadow-hover);
		transform: translateY(-2px);
	}
	.tool-stripe {
		width: 4px;
		background: var(--accent-color);
		flex-shrink: 0;
	}
	.tool-body {
		padding: 20px 22px;
		flex: 1;
		background: var(--bg-color);
	}
	.tool-name-row {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 10px;
	}
	.tool-emoji { font-size: 1.3rem; }
	.tool-name {
		font-family: var(--font-mono);
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--accent-color);
		background: none;
		padding: 0;
	}
	.tool-desc {
		color: var(--text-secondary);
		font-size: 0.88rem;
		line-height: 1.6;
		margin: 0 0 16px;
	}
	.tool-example-wrap {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.example-label {
		font-size: 0.68rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
		font-family: var(--font-mono);
	}
	.tool-example {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--amber);
		background: rgba(245, 158, 11, 0.07);
		border: 1px solid rgba(245, 158, 11, 0.15);
		padding: 6px 10px;
		border-radius: 6px;
		display: block;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* ─── Quick Start ───────────────────────────────────────────────────── */
	.quickstart {
		position: relative;
		z-index: 1;
		padding: 80px 32px;
	}
	.quickstart-inner { max-width: 1100px; margin: 0 auto; }

	.install-options {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 28px;
	}
	.install-card {
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 28px 32px;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.install-icon {
		font-size: 2.2rem;
	}
	.install-card h3 {
		font-size: 1.2rem;
		margin: 0;
		font-weight: 600;
	}
	.install-card > p {
		color: var(--text-secondary);
		font-size: 0.9rem;
		line-height: 1.6;
		margin: 0;
	}
	.install-card > p code {
		font-family: var(--font-mono);
		font-size: 0.82em;
		background: var(--bg-secondary);
		padding: 2px 6px;
		border-radius: 4px;
		color: var(--text-primary);
	}
	.install-hint {
		color: var(--text-muted) !important;
		font-size: 0.8rem !important;
	}
	.install-hint a {
		color: var(--accent);
		text-decoration: none;
	}
	.install-hint a:hover { text-decoration: underline; }
	.install-hint code {
		font-family: var(--font-mono);
		font-size: 0.8em !important;
		color: var(--text-muted) !important;
		background: var(--bg-secondary);
		padding: 2px 5px;
		border-radius: 3px;
	}

	/* ─── CTA ───────────────────────────────────────────────────────────── */
	.cta {
		position: relative;
		z-index: 1;
		padding: 100px 32px;
		text-align: center;
		background: var(--bg-secondary);
	}
	.cta-inner { max-width: 600px; margin: 0 auto; }
	.cta-title {
		font-family: var(--font-handwriting);
		font-weight: 100;
		font-size: 3rem;
		margin: 0 0 14px;
	}
	.cta-sub {
		color: var(--text-secondary);
		font-size: 1.05rem;
		margin: 0 0 36px;
	}
	.cta-actions {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16px;
		margin-bottom: 32px;
	}
	.cta-package {
		color: var(--text-muted);
		font-size: 0.85rem;
		margin: 0;
	}
	.cta-package code {
		font-family: var(--font-mono);
		font-size: 0.82em;
		background: var(--bg-card);
		border: 1px solid var(--border);
		padding: 4px 10px;
		border-radius: 6px;
	}

	/* ─── Responsive ────────────────────────────────────────────────────── */
	@media (max-width: 768px) {
		.hero { padding: 60px 20px 60px; }
		.hero-title { font-size: 2.8rem; }
		.hero-actions { flex-direction: column; }
		.install-options { grid-template-columns: 1fr; }
		.tools-grid { grid-template-columns: 1fr; }
		.nav-inner { padding: 12px 20px; }
	}
</style>
