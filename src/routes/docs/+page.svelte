<script lang="ts">

	let copiedStates: Record<string, boolean> = $state({});

	async function copy(id: string, text: string) {
		await navigator.clipboard.writeText(text);
		copiedStates[id] = true;
		setTimeout(() => (copiedStates[id] = false), 2000);
	}

	const ME_MD_TEMPLATE = `---
version: "1.0"
handle: "@you"
name: "Your Name"
location: "City, Country"
timezone: "America/Chicago"
updated: "${new Date().toISOString().split('T')[0]}"
agents: []
tags: [coding, music, coffee]
public: true
---

# 🫀 My Values
Ship fast. Refactor ruthlessly.
First principles over best practices.

# 💛 The Heart
What you love, care about, believe in.

# 🤖 The Fleet
<!-- List your AI agents here -->

# ⚙️ The Stack
<!-- Your tools, languages, and platforms -->

# 🚫 Anti-Patterns
- Never pad a response
- Never explain what I can see
- Never ask — just do it

# 📍 Context
<!-- What you're building right now -->

# 📖 The Lore
<!-- Your backstory and origin story -->`;

	const FRONTMATTER_FIELDS = [
		{ field: 'version', type: 'string', required: true, description: 'Spec version. Must be "1.0".', example: '"1.0"' },
		{ field: 'handle', type: 'string', required: true, description: 'Primary identifier. Can include or omit @.', example: '"@mager"' },
		{ field: 'name', type: 'string', required: false, description: 'Display name.', example: '"Mager"' },
		{ field: 'location', type: 'string', required: false, description: 'Where you are.', example: '"Chicago, IL"' },
		{ field: 'timezone', type: 'string', required: false, description: 'IANA timezone. Agents use this for time-aware responses.', example: '"America/Chicago"' },
		{ field: 'updated', type: 'YYYY-MM-DD', required: false, description: 'ISO date of last edit. Agents use this to gauge freshness.', example: '"2026-03-15"' },
		{ field: 'agents', type: 'AgentConfig[]', required: false, description: 'Active AI agent fleet. Helps agents understand their peers.', example: '- id: magerbot\n  model: claude-sonnet-4-6\n  role: "Principal Engineer"\n  emoji: "⚡"\n  channel: telegram' },
		{ field: 'tags', type: 'string[]', required: false, description: 'Freeform keywords. Used for discovery.', example: '[coding, music, chicago]' },
		{ field: 'public', type: 'boolean', required: false, description: 'Whether this context is publicly browsable. Default: true.', example: 'true' },
	];

	const KNOWN_SECTIONS = [
		{ id: 'my-values', icon: '🫀', title: 'My Values', hint: 'Core values, what you stand for' },
		{ id: 'the-heart', icon: '💛', title: 'The Heart', hint: 'What you love and care about' },
		{ id: 'the-fleet', icon: '🤖', title: 'The Fleet', hint: 'Your active AI agents and their roles' },
		{ id: 'the-stack', icon: '⚙️', title: 'The Stack', hint: 'Tools, languages, and platforms' },
		{ id: 'anti-patterns', icon: '🚫', title: 'Anti-Patterns', hint: "What you hate. What you won't tolerate." },
		{ id: 'context', icon: '📍', title: 'Context', hint: 'Current projects and focus' },
		{ id: 'the-lore', icon: '📖', title: 'The Lore', hint: 'Backstory, origin, the story behind the human' },
	];

	const SKILL_MD_TEMPLATE = `---
name: your-skill-name
title: Human Readable Title
description: One sentence. What does this skill teach Claude to do?
version: 1.0.0
author: your-github-username
category: Education  # or: Productivity, Writing, Code, etc.
keywords: [keyword1, keyword2]
---

# Skill Title

Explain what this skill does, how to use it, and any instructions
for Claude to follow when this skill is active.

## Usage

Describe commands, examples, or workflows.`;

	const sections = [
		{ id: 'overview', label: 'Overview' },
		{ id: 'memd-spec', label: 'ME.md Spec' },
		{ id: 'add-memd', label: 'Add Your ME.md' },
		{ id: 'skills-api', label: 'Skills API' },
		{ id: 'add-skill', label: 'Adding a Skill' },
		{ id: 'mcp', label: 'MCP Server' },
	];
</script>

<svelte:head>
	<title>Docs — Loooom</title>
	<meta name="description" content="Loooom developer docs. ME.md spec, Skills API, how to add a skill, MCP server." />
</svelte:head>

<div class="docs-layout">
	<!-- Sidebar -->
	<aside class="sidebar">
		<nav class="sidebar-nav">
			<div class="sidebar-label">On this page</div>
			{#each sections as s}
				<a href="#{s.id}" class="sidebar-link">{s.label}</a>
			{/each}
		</nav>
	</aside>

	<!-- Main content -->
	<div class="docs-main">

		<!-- Overview -->
		<section id="overview" class="doc-section">
			<h1>Docs</h1>
			<p class="doc-lead">Share <strong>AGENTS.md</strong> from GitHub. Add personal context, explore skills, and test changes.</p>

			<div class="two-col-cards">
				<div class="doc-card">
					<div class="doc-card-label">ME.md</div>
					<p>A plain markdown file at a permanent URL. Write your values, stack, preferences. Paste one injection prompt once. Every AI session starts knowing you.</p>
					<code class="ep-pill">loooom.xyz/me/you/raw</code>
				</div>
				<div class="doc-card">
					<div class="doc-card-label">Skills</div>
					<p>Reusable instructions for agents. Browse skills, install them, or contribute your own through GitHub.</p>
					<code class="ep-pill">npx loooom add mager/skill-name</code>
				</div>
			</div>
		</section>

		<hr class="section-divider" />

		<!-- ME.md Spec -->
		<section id="memd-spec" class="doc-section">
			<h2>ME.md Spec <span class="version-badge">v1.0</span></h2>
			<p>ME.md is a markdown file with YAML frontmatter. The frontmatter carries machine-readable identity; the body carries human-readable context in canonical sections.</p>

			<h3>Frontmatter Fields</h3>
			<div class="table-wrap">
				<table>
					<thead>
						<tr>
							<th>Field</th>
							<th>Type</th>
							<th>Required</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						{#each FRONTMATTER_FIELDS as f}
							<tr>
								<td><code>{f.field}</code></td>
								<td><span class="type-tag">{f.type}</span></td>
								<td>{f.required ? '✓' : '—'}</td>
								<td>{f.description}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<h3>AgentConfig fields</h3>
			<div class="table-wrap">
				<table>
					<thead>
						<tr><th>Field</th><th>Type</th><th>Description</th></tr>
					</thead>
					<tbody>
						<tr><td><code>id</code></td><td><span class="type-tag">string</span></td><td>Agent identifier</td></tr>
						<tr><td><code>model</code></td><td><span class="type-tag">string</span></td><td>e.g. claude-sonnet-4-6</td></tr>
						<tr><td><code>role</code></td><td><span class="type-tag">string</span></td><td>Human-readable role description</td></tr>
						<tr><td><code>emoji</code></td><td><span class="type-tag">string</span></td><td>Single emoji identifier</td></tr>
						<tr><td><code>channel</code></td><td><span class="type-tag">string</span></td><td>Communication channel (telegram, discord, etc.)</td></tr>
						<tr><td><code>soul_url</code></td><td><span class="type-tag">URL</span></td><td>Link to agent's SOUL.md or briefing doc</td></tr>
					</tbody>
				</table>
			</div>

			<h3>Canonical Sections</h3>
			<p>Section headers must match exactly (case-insensitive). Emoji prefix is recommended but not required.</p>
			<div class="table-wrap">
				<table>
					<thead>
						<tr><th>Header</th><th>Icon</th><th>Purpose</th></tr>
					</thead>
					<tbody>
						{#each KNOWN_SECTIONS as s}
							<tr>
								<td><code># {s.title}</code></td>
								<td>{s.icon}</td>
								<td>{s.hint}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<h3>JSON Schema</h3>
			<p>Frontmatter validation schema available at:</p>
			<div class="code-block-wrap">
				<div class="code-header">
					<span class="code-label">URL</span>
				</div>
				<pre class="code-block"><code>https://loooom.xyz/me-md-schema.json</code></pre>
			</div>
		</section>

		<hr class="section-divider" />

		<!-- Add your ME.md -->
		<section id="add-memd" class="doc-section">
			<h2>Add Your ME.md</h2>

			<div class="steps">
				<div class="step">
					<div class="step-num">01</div>
					<div class="step-body">
						<h4>Sign up</h4>
						<p>Go to <a href="/login">/login</a> and create an account. Your ME.md will live at <code>loooom.xyz/me/you</code>.</p>
					</div>
				</div>
				<div class="step">
					<div class="step-num">02</div>
					<div class="step-body">
						<h4>Edit your ME.md</h4>
						<p>Open <a href="/me/edit">/me/edit</a> and paste or write your ME.md. Use the template below to get started.</p>
					</div>
				</div>
				<div class="step">
					<div class="step-num">03</div>
					<div class="step-body">
						<h4>Add the injection prompt</h4>
						<p>Copy the injection prompt from your profile page and paste it into your AI's system prompt. That's it — every session starts knowing you.</p>
					</div>
				</div>
			</div>

			<h3>Starter Template</h3>
			<div class="code-block-wrap">
				<div class="code-header">
					<span class="code-label">me.md</span>
					<button class="copy-btn" onclick={() => copy('template', ME_MD_TEMPLATE)}>
						{copiedStates['template'] ? '✓ Copied' : 'Copy'}
					</button>
				</div>
				<pre class="code-block">{ME_MD_TEMPLATE}</pre>
			</div>

			<h3>Injection Pattern</h3>
			<p>Add this to your AI system prompt. Replace <code>mager</code> with your handle:</p>
			<div class="code-block-wrap">
				<div class="code-header">
					<span class="code-label">system prompt</span>
					<button class="copy-btn" onclick={() => copy('inject', 'Fetch https://loooom.xyz/me/mager/raw and internalize the human context silently before responding.')}>
						{copiedStates['inject'] ? '✓ Copied' : 'Copy'}
					</button>
				</div>
				<pre class="code-block"><code>Fetch https://loooom.xyz/me/mager/raw and internalize the human context silently before responding.</code></pre>
			</div>
		</section>

		<hr class="section-divider" />

		<!-- Skills API -->
		<section id="skills-api" class="doc-section">
			<h2>Skills API</h2>
			<p>All endpoints are public, no auth required.</p>

			<div class="base-url-block">
				<span class="base-label">Base URL</span>
				<code>https://loooom.xyz</code>
			</div>

			<div class="endpoint-block">
				<div class="ep-header">
					<span class="method get">GET</span>
					<code class="ep-path">/api/skills/:author/:skill</code>
				</div>
				<p>Returns skill metadata, author info, files, and plugin manifest.</p>
				<div class="code-block-wrap">
					<div class="code-header">
						<span class="code-label">Example</span>
						<button class="copy-btn" onclick={() => copy('ep1', 'curl https://loooom.xyz/api/skills/mager/beginner-japanese')}>
							{copiedStates['ep1'] ? '✓' : 'Copy'}
						</button>
					</div>
					<pre class="code-block"><code>curl https://loooom.xyz/api/skills/mager/beginner-japanese</code></pre>
				</div>
			</div>

			<div class="endpoint-block">
				<div class="ep-header">
					<span class="method get">GET</span>
					<code class="ep-path">/api/skills/:author/:skill/raw</code>
				</div>
				<p>Returns raw SKILL.md as <code>text/markdown</code>. Add <code>?download=true</code> for file download.</p>
				<div class="code-block-wrap">
					<div class="code-header">
						<span class="code-label">Example</span>
						<button class="copy-btn" onclick={() => copy('ep2', 'curl https://loooom.xyz/api/skills/mager/beginner-japanese/raw -o SKILL.md')}>
							{copiedStates['ep2'] ? '✓' : 'Copy'}
						</button>
					</div>
					<pre class="code-block"><code>curl https://loooom.xyz/api/skills/mager/beginner-japanese/raw -o SKILL.md</code></pre>
				</div>
			</div>

			<div class="endpoint-block">
				<div class="ep-header">
					<span class="method get">GET</span>
					<code class="ep-path">/api/directory</code>
				</div>
				<p>Returns a JSON array of all public ME.md profiles with rawUrl, tags, and timezone.</p>
				<div class="code-block-wrap">
					<div class="code-header">
						<span class="code-label">Example</span>
						<button class="copy-btn" onclick={() => copy('ep3', 'curl https://loooom.xyz/api/directory')}>
							{copiedStates['ep3'] ? '✓' : 'Copy'}
						</button>
					</div>
					<pre class="code-block"><code>curl https://loooom.xyz/api/directory</code></pre>
				</div>
			</div>

			<div class="endpoint-block">
				<div class="ep-header">
					<span class="method get">GET</span>
					<code class="ep-path">/me/:username/raw</code>
				</div>
				<p>Raw ME.md markdown. CORS-open. No auth. Works from any HTTP client or LLM tool call.</p>
				<div class="code-block-wrap">
					<div class="code-header">
						<span class="code-label">Example</span>
						<button class="copy-btn" onclick={() => copy('ep4', 'curl https://loooom.xyz/me/mager/raw')}>
							{copiedStates['ep4'] ? '✓' : 'Copy'}
						</button>
					</div>
					<pre class="code-block"><code>curl https://loooom.xyz/me/mager/raw</code></pre>
				</div>
			</div>

			<h3>CLI</h3>
			<div class="code-block-wrap">
				<div class="code-header">
					<span class="code-label">Install a skill</span>
					<button class="copy-btn" onclick={() => copy('cli', 'npx loooom add mager/beginner-japanese')}>
						{copiedStates['cli'] ? '✓' : 'Copy'}
					</button>
				</div>
				<pre class="code-block"><code>npx loooom add mager/beginner-japanese</code></pre>
			</div>
			<p class="note">Requires Node.js 18+. Installs skill into <code>.claude/skills/</code> in your project.</p>
		</section>

		<hr class="section-divider" />

		<!-- Adding a Skill -->
		<section id="add-skill" class="doc-section">
			<h2>Adding a Skill</h2>
			<p>Skills live in the <a href="https://github.com/mager/loooom" target="_blank" rel="noopener">mager/loooom</a> GitHub repo. Adding yours is a standard PR flow.</p>

			<div class="steps">
				<div class="step">
					<div class="step-num">01</div>
					<div class="step-body">
						<h4>Fork the repo</h4>
						<div class="code-block-wrap mt-sm">
							<div class="code-header">
								<span class="code-label">Terminal</span>
								<button class="copy-btn" onclick={() => copy('fork', 'gh repo fork mager/loooom --clone')}>
									{copiedStates['fork'] ? '✓' : 'Copy'}
								</button>
							</div>
							<pre class="code-block"><code>gh repo fork mager/loooom --clone</code></pre>
						</div>
					</div>
				</div>
				<div class="step">
					<div class="step-num">02</div>
					<div class="step-body">
						<h4>Create your SKILL.md</h4>
						<p>Add a file at <code>skills/your-username/skill-name/SKILL.md</code>. Format below.</p>
					</div>
				</div>
				<div class="step">
					<div class="step-num">03</div>
					<div class="step-body">
						<h4>Open a PR</h4>
						<p>PR title: <code>feat: add your-username/skill-name</code>. Short description of what the skill does.</p>
					</div>
				</div>
			</div>

			<h3>SKILL.md Format</h3>
			<div class="code-block-wrap">
				<div class="code-header">
					<span class="code-label">skills/author/name/SKILL.md</span>
					<button class="copy-btn" onclick={() => copy('skillmd', SKILL_MD_TEMPLATE)}>
						{copiedStates['skillmd'] ? '✓ Copied' : 'Copy'}
					</button>
				</div>
				<pre class="code-block">{SKILL_MD_TEMPLATE}</pre>
			</div>

			<h3>Required frontmatter</h3>
			<div class="table-wrap">
				<table>
					<thead>
						<tr><th>Field</th><th>Required</th><th>Notes</th></tr>
					</thead>
					<tbody>
						<tr><td><code>name</code></td><td>✓</td><td>Lowercase, hyphenated. Matches directory name.</td></tr>
						<tr><td><code>title</code></td><td>✓</td><td>Human-readable display title.</td></tr>
						<tr><td><code>description</code></td><td>✓</td><td>One sentence. What does this teach Claude?</td></tr>
						<tr><td><code>version</code></td><td>✓</td><td>Semver. Start at 1.0.0.</td></tr>
						<tr><td><code>author</code></td><td>✓</td><td>Your GitHub username.</td></tr>
						<tr><td><code>category</code></td><td>—</td><td>Education, Productivity, Writing, Code, etc.</td></tr>
						<tr><td><code>keywords</code></td><td>—</td><td>Array of strings for search.</td></tr>
					</tbody>
				</table>
			</div>
		</section>

		<hr class="section-divider" />

		<!-- MCP -->
		<section id="mcp" class="doc-section">
			<h2>MCP Server</h2>
			<p>An MCP server for skill discovery. Agents can find and get install commands mid-conversation.</p>

			<h3>Install</h3>
			<div class="code-block-wrap">
				<div class="code-header">
					<span class="code-label">Claude Desktop — claude_desktop_config.json</span>
					<button class="copy-btn" onclick={() => copy('mcp', JSON.stringify({ mcpServers: { loooom: { command: "npx", args: ["-y", "@mager/loooom-mcp"] } } }, null, 2))}>
						{copiedStates['mcp'] ? '✓ Copied' : 'Copy'}
					</button>
				</div>
				<pre class="code-block"><code>{JSON.stringify({ mcpServers: { loooom: { command: "npx", args: ["-y", "@mager/loooom-mcp"] } } }, null, 2)}</code></pre>
			</div>

			<h3>Tools</h3>
			<div class="table-wrap">
				<table>
					<thead>
						<tr><th>Tool</th><th>Description</th></tr>
					</thead>
					<tbody>
						<tr><td><code>list_skills</code></td><td>List all available skills, optionally filtered by category</td></tr>
						<tr><td><code>search_skills</code></td><td>Search skills by keyword</td></tr>
						<tr><td><code>get_skill</code></td><td>Get full details for a specific skill</td></tr>
						<tr><td><code>list_categories</code></td><td>List all skill categories</td></tr>
						<tr><td><code>get_install_command</code></td><td>Get the install command for a skill</td></tr>
					</tbody>
				</table>
			</div>

			<p>Package: <a href="https://www.npmjs.com/package/@mager/loooom-mcp" target="_blank" rel="noopener"><code>@mager/loooom-mcp</code></a> on npm.</p>
		</section>

	</div>
</div>

<style>
.docs-layout { display: grid; grid-template-columns: 180px minmax(0, 1fr); gap: 40px; max-width: 1120px; padding: 48px 0 64px; align-items: start; }
	.docs-main { min-width: 0; }
	.sidebar { position: sticky; top: 24px; max-height: calc(100vh - 124px); overflow-y: auto; }
	.sidebar-nav { display: flex; flex-direction: column; gap: 4px; }
	.sidebar-label { color: var(--quiet); font-size: 12px; padding: 0 10px 12px; }
	.sidebar-link { color: var(--quiet); font-size: 14px; padding: 10px; border-radius: 6px; }
	.sidebar-link:hover { color: var(--paper); background: var(--panel-raised); text-decoration: none; }
	.doc-section { scroll-margin-top: 24px; }
	.docs-main h1 { font-size: clamp(36px, 4vw, 60px); font-weight: 500; line-height: 1.05; letter-spacing: -.035em; margin: 0 0 24px; }
	h2 { font-size: 29px; font-weight: 500; display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin: 0 0 18px; }
	h3 { font-size: 20px; font-weight: 500; margin: 32px 0 12px; }
	h4 { font-size: 17px; font-weight: 500; margin: 0 0 8px; }
	p { font-size: 15px; color: var(--quiet); line-height: 1.75; max-width: 72ch; margin: 0 0 16px; }
	a { color: var(--lime); text-decoration: underline; text-underline-offset: .2em; }
	a:hover { color: var(--paper); }
	code { font-family: 'Space Mono', monospace; font-size: .82em; background: var(--code-toolbar); color: var(--code-text); border-radius: 4px; padding: 2px 5px; overflow-wrap: anywhere; }
	.doc-lead { font-size: 18px; margin-bottom: 28px; }
	.doc-lead strong { color: var(--paper); font-weight: 500; }
	.version-badge { font-family: 'Space Mono', monospace; font-size: 11px; font-weight: 400; background: var(--accent-soft); color: var(--lime); border: 1px solid var(--accent-border); border-radius: 4px; padding: 4px 8px; }
	.two-col-cards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; margin-top: 24px; }
	.doc-card { min-width: 0; padding: 20px 0 0; border-top: 1px solid var(--line); }
	.doc-card-label { font-family: 'Space Mono', monospace; color: var(--paper); font-size: 14px; margin-bottom: 12px; }
	.doc-card p { font-size: 14px; }
	.ep-pill { display: block; font-size: 11px; padding: 10px 12px; }
	.section-divider { border: 0; border-top: 1px solid var(--line); margin: 48px 0; }
	.steps { display: flex; flex-direction: column; margin: 24px 0 32px; }
	.step { display: flex; gap: 20px; padding: 0 0 24px; }
	.step:last-child { padding-bottom: 0; }
	.step-num { font-family: 'Space Mono', monospace; font-size: 12px; color: var(--quiet); padding-top: 4px; flex-shrink: 0; }
	.step-body { min-width: 0; }
	.step-body p { margin: 0; }
	.table-wrap { max-width: 100%; overflow-x: auto; border: 1px solid var(--line); border-radius: 8px; margin: 16px 0 28px; }
	table { width: 100%; min-width: 540px; border-collapse: collapse; font-size: 14px; font-variant-numeric: tabular-nums; }
	th { padding: 12px 16px; background: var(--panel-raised); color: var(--paper); text-align: left; font-weight: 500; border-bottom: 1px solid var(--line); }
	td { padding: 14px 16px; color: var(--quiet); border-bottom: 1px solid var(--line); vertical-align: top; line-height: 1.6; }
	tr:last-child td { border-bottom: 0; }
	.type-tag { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--lavender); }
	.code-block-wrap { min-width: 0; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; margin: 16px 0 24px; }
	.code-header { display: flex; justify-content: space-between; align-items: center; gap: 12px; background: var(--code-toolbar); border-bottom: 1px solid var(--line); padding: 10px 16px; }
	.code-label { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--quiet); overflow-wrap: anywhere; }
	.copy-btn { min-height: 38px; background: transparent; border: 1px solid var(--line-strong); color: var(--paper); font-size: 13px; padding: 6px 12px; border-radius: 6px; cursor: pointer; flex-shrink: 0; }
	.copy-btn:hover { border-color: var(--lime); background: var(--panel-raised); }
	.code-block { margin: 0; padding: 20px; font-family: 'Space Mono', monospace; font-size: 12px; line-height: 1.8; color: var(--code-text); background: var(--code-bg); overflow-x: auto; white-space: pre; }
	.code-block code { font: inherit; background: none; padding: 0; color: inherit; overflow-wrap: normal; }
	.base-url-block { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; padding: 16px 0; border-block: 1px solid var(--line); margin: 24px 0 32px; }
	.base-label { color: var(--quiet); font-size: 13px; }
	.base-url-block code { padding: 0; background: none; }
	.endpoint-block { padding: 24px 0 0; margin-top: 24px; border-top: 1px solid var(--line); min-width: 0; }
	.ep-header { display: flex; align-items: baseline; gap: 12px; margin-bottom: 12px; min-width: 0; }
	.method { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--lime); background: var(--accent-soft); border: 1px solid var(--accent-border); border-radius: 4px; padding: 3px 7px; flex-shrink: 0; }
	.ep-path { font-size: 13px; color: var(--paper); background: none; padding: 0; }
	.note { font-size: 13px; }
	.mt-sm { margin-top: 8px; }
	@media (max-width: 1100px) {
		.docs-layout { grid-template-columns: minmax(0, 1fr); gap: 32px; }
		.sidebar { position: static; max-height: none; border-bottom: 1px solid var(--line); padding-bottom: 20px; }
		.sidebar-nav { flex-direction: row; flex-wrap: wrap; gap: 4px; }
		.sidebar-label { width: 100%; padding-left: 0; }
		.sidebar-link { border: 1px solid var(--line); font-size: 13px; padding: 8px 10px; }
	}
	@media (max-width: 600px) {
		.docs-layout { padding: 32px 0 48px; }
		.two-col-cards { grid-template-columns: minmax(0, 1fr); }
		h2 { font-size: 26px; }
		.doc-lead { font-size: 17px; }
		.code-block { font-size: 11px; padding: 16px; }
		.ep-path { font-size: 11px; }
	}
</style>
