<script lang="ts">

	const tools = [
		{
			name: 'list_skills',
			description: 'Browse the full Loooom skill catalog. Returns all available skills with titles, categories, authors, and install counts.',
			example: 'list_skills()',
		},
		{
			name: 'search_skills',
			description: 'Find skills by topic, keyword, or use case. Fuzzy search across names, descriptions, and tags.',
			example: 'search_skills({ query: "git" })',
		},
		{
			name: 'get_skill',
			description: 'Get full details on any skill — readme, install command, author info, version, and usage examples.',
			example: 'get_skill({ id: "mager/beginner-japanese" })',
		},
		{
			name: 'list_categories',
			description: 'Explore all skill categories in the marketplace. Useful for navigating by domain — coding, productivity, research, etc.',
			example: 'list_categories()',
		},
		{
			name: 'get_install_command',
			description: 'Get the exact install command for any skill. Works for Claude Code, Cursor, Windsurf, and other MCP-compatible clients.',
			example: 'get_install_command({ id: "mager/beginner-japanese" })',
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

<!-- Hero -->
<section class="hero">
	<div class="hero-inner">
		<h1 class="hero-title">
			Skills, <span class="hero-accent">discoverable</span><br />
			by any AI
		</h1>
		<p class="package-name">@mager/loooom-mcp</p>

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
					<span class="code-filename">claude_desktop_config.json</span>
					<button class="copy-btn" onclick={copyJson} title="Copy config">
						{copiedJson ? 'Copied' : 'Copy'}
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
			<h2>What your AI can do</h2>
			<p class="section-detail">5 tools</p>
			<p>Each tool is purpose-built for skill discovery. Simple inputs, structured outputs.</p>
		</div>

		<div class="tools-grid">
			{#each tools as tool}
				<div class="tool-card">
					<div class="tool-body">
						<div class="tool-name-row">
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
			<h2>Two ways to install</h2>
			<p class="section-detail">Quick Start</p>
			<p>Pick your client. Both methods pull the latest version automatically.</p>
		</div>

		<div class="install-options">
			<!-- Claude Desktop -->
			<div class="install-card">
				<h3>Claude Desktop</h3>
				<p>Add to your <code>claude_desktop_config.json</code> and restart Claude.</p>
				<div class="code-window dark">
					<div class="code-header">
						<span class="code-filename">claude_desktop_config.json</span>
						<button class="copy-btn" onclick={copyJson}>
							{copiedJson ? 'Copied' : 'Copy'}
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
				<h3>Run directly with npx</h3>
				<p>Test it right now without installing anything. Works with any MCP-compatible shell.</p>
				<div class="code-window dark">
					<div class="code-header">
						<span class="code-filename">terminal</span>
						<button class="copy-btn" onclick={copyNpx}>
							{copiedNpx ? 'Copied' : 'Copy'}
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
.hero { padding: 48px 0; border-bottom: 1px solid var(--line); }
	.hero-inner { max-width: 900px; }
	.hero-title { font-size: clamp(36px, 4vw, 60px); font-weight: 500; line-height: 1.05; letter-spacing: -.035em; margin: 0 0 20px; }
	.hero-accent { color: var(--lime); }
	.package-name { font-family: 'Space Mono', monospace; font-size: 12px; color: var(--quiet); margin: 0 0 24px; }
	.hero-sub { color: var(--quiet); font-size: 18px; line-height: 1.65; max-width: 65ch; margin: 0 0 28px; }
	.hero-actions, .cta-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-bottom: 32px; }
	.btn-primary, .btn-ghost { display: inline-flex; justify-content: center; align-items: center; min-height: 46px; border: 1px solid var(--line); border-radius: 6px; padding: 12px 20px; font-size: 14px; font-weight: 500; transition: background .2s, border-color .2s; }
	.btn-primary { background: var(--action-bg); color: var(--action-ink); border-color: var(--action-bg); }
	.btn-primary:hover { background: var(--action-hover); color: var(--action-ink); }
	.btn-ghost { background: transparent; color: var(--paper); }
	.btn-ghost:hover { background: var(--panel-raised); color: var(--paper); border-color: var(--line-strong); }
	.hero-code-wrap { max-width: 640px; }
	.code-window { min-width: 0; overflow: hidden; border: 1px solid var(--line); border-radius: 8px; }
	.code-header { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; padding: 10px 16px; border-bottom: 1px solid var(--line); background: var(--code-toolbar); }
	.code-filename { flex: 1; font-family: 'Space Mono', monospace; font-size: 11px; color: var(--quiet); overflow-wrap: anywhere; }
	.copy-btn { min-height: 38px; padding: 6px 12px; border: 1px solid var(--line-strong); border-radius: 6px; color: var(--paper); background: transparent; font-size: 13px; cursor: pointer; }
	.copy-btn:hover { background: var(--panel-raised); border-color: var(--lime); }
	.code-block { padding: 20px; margin: 0; background: var(--code-bg); color: var(--code-text); font-family: 'Space Mono', monospace; font-size: 12px; line-height: 1.8; overflow-x: auto; white-space: pre; }
	.code-block code { font: inherit; }
	.json-key, .json-amber { color: var(--code-list); }
	.json-str { color: var(--code-text); }
	.json-brace, .json-bracket, .json-colon, .json-comma { color: var(--code-line); }
	.tools-section, .quickstart { padding: 48px 0; border-bottom: 1px solid var(--line); }
	.quickstart { scroll-margin-top: 24px; }
	.section-header { margin-bottom: 32px; max-width: 72ch; }
	.section-header h2 { margin: 0 0 16px; font-size: 29px; }
	.section-header p { color: var(--quiet); line-height: 1.7; }
	.section-header .section-detail { margin: 0 0 12px; font-size: 13px; }
	.tools-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 32px; }
	.tool-card { min-width: 0; border-top: 1px solid var(--line); padding: 24px 0; }
	.tool-body { min-width: 0; }
	.tool-name-row { margin-bottom: 12px; }
	.tool-name { font-family: 'Space Mono', monospace; font-size: 13px; color: var(--paper); overflow-wrap: anywhere; }
	.tool-desc { font-size: 15px; line-height: 1.7; color: var(--quiet); margin: 0 0 16px; max-width: 72ch; }
	.tool-example-wrap { display: flex; flex-direction: column; gap: 8px; }
	.example-label { color: var(--quiet); font-size: 12px; }
	.tool-example { font-family: 'Space Mono', monospace; font-size: 11px; line-height: 1.8; color: var(--code-text); background: var(--code-bg); border: 1px solid var(--line); border-radius: 6px; padding: 12px; overflow-wrap: anywhere; }
	.install-options { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px; }
	.install-card { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
	.install-card h3 { margin: 0; font-size: 22px; }
	.install-card > p { color: var(--quiet); line-height: 1.7; margin: 0; }
	.install-card p code, .cta-package code { font-family: 'Space Mono', monospace; font-size: .8em; color: var(--code-text); background: var(--code-toolbar); padding: 2px 5px; border-radius: 4px; overflow-wrap: anywhere; }
	.install-card .install-hint { font-size: 13px; }
	.install-hint a { color: var(--lime); text-decoration: underline; }
	.cta { padding: 48px 0 64px; }
	.cta-title { font-size: 29px; margin: 0 0 16px; }
	.cta-sub { color: var(--quiet); font-size: 17px; margin: 0 0 24px; }
	.cta-package { color: var(--quiet); font-size: 13px; line-height: 1.8; }
	@media (max-width: 1100px) { .install-options { grid-template-columns: minmax(0, 1fr); gap: 32px; } }
	@media (max-width: 600px) {
		.hero { padding: 32px 0; }
		.hero-sub { font-size: 17px; }
		.hero-sub br { display: none; }
		.tools-grid { grid-template-columns: minmax(0, 1fr); }
		.tools-section, .quickstart, .cta { padding: 32px 0; }
		.code-block { font-size: 11px; padding: 16px; }
		.hero-actions, .cta-actions { align-items: stretch; }
		.hero-actions a, .cta-actions a { flex: 1 1 100%; }
	}
</style>
