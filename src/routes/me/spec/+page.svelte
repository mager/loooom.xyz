<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import { KNOWN_SECTIONS } from '$lib/memd';

	const SPEC_VERSION = '1.0';
	const SCHEMA_URL = 'https://loooom.xyz/me-md-schema.json';

	const FRONTMATTER_FIELDS = [
		{
			field: 'version',
			type: 'string',
			required: true,
			description: 'ME.md spec version. Must be "1.0" for this spec.',
			example: '"1.0"'
		},
		{
			field: 'handle',
			type: 'string',
			required: true,
			description: "Human's primary identifier. Can include or omit the @ prefix.",
			example: '"@mager"'
		},
		{
			field: 'name',
			type: 'string',
			required: false,
			description: 'Display name.',
			example: '"Mager"'
		},
		{
			field: 'location',
			type: 'string',
			required: false,
			description: 'Where the human is based.',
			example: '"Chicago, IL"'
		},
		{
			field: 'timezone',
			type: 'string',
			required: false,
			description: 'IANA timezone string. Used by agents for time-aware responses.',
			example: '"America/Chicago"'
		},
		{
			field: 'updated',
			type: 'date (YYYY-MM-DD)',
			required: false,
			description: 'ISO date of last update. Agents can use this to know how fresh the context is.',
			example: '"2026-03-07"'
		},
		{
			field: 'agents',
			type: 'AgentConfig[]',
			required: false,
			description: 'Active AI agent fleet. Helps agents understand the full ecosystem they\'re part of.',
			example: '- id: magerbot\n  model: claude-sonnet-4-6\n  role: "Principal Engineer"\n  emoji: "⚡"\n  channel: telegram'
		},
		{
			field: 'tags',
			type: 'string[]',
			required: false,
			description: 'Freeform keywords describing the human. Useful for discovery and context.',
			example: '[coding, music, food]'
		},
		{
			field: 'public',
			type: 'boolean',
			required: false,
			description: 'Whether this context file is publicly accessible. Defaults to true.',
			example: 'true'
		}
	];

	const AGENT_FIELDS = [
		{ field: 'id', type: 'string', required: true, description: 'Agent name or identifier.' },
		{ field: 'model', type: 'string', required: false, description: 'Underlying model (e.g. claude-sonnet-4-6, gpt-4o).' },
		{ field: 'role', type: 'string', required: false, description: 'Role or job title for this agent.' },
		{ field: 'emoji', type: 'string', required: false, description: 'Single emoji identifier.' },
		{ field: 'channel', type: 'string', required: false, description: 'Primary communication channel (telegram, discord, slack, signal).' },
	];

	let schemaCopied = $state(false);
	function copySchemaUrl() {
		navigator.clipboard.writeText(SCHEMA_URL);
		schemaCopied = true;
		setTimeout(() => (schemaCopied = false), 2000);
	}
</script>

<svelte:head>
	<title>ME.md Spec v{SPEC_VERSION} — Official Standard</title>
	<meta
		name="description"
		content="The official ME.md v1.0 specification. Portable Human Context Protocol — frontmatter schema, canonical sections, and tooling."
	/>
</svelte:head>

<!-- Ambient -->
<div class="ambient">
	<div class="orb orb-1"></div>
	<div class="orb orb-2"></div>
</div>

<!-- Nav -->
<Nav />

<!-- Page header -->
<header class="page-header">
	<div class="header-inner">
		<div class="breadcrumb">
			<a href="/me">ME.md</a>
			<span class="sep">›</span>
			<span>Spec</span>
		</div>
		<h1>
			<span class="me-title">ME.md</span> Specification
			<span class="version-badge">v{SPEC_VERSION}</span>
		</h1>
		<p class="header-sub">
			The official standard for Portable Human Context. A single markdown file that tells any AI who you are.
		</p>
		<div class="header-actions">
			<a href="/me" class="btn-primary">Create your ME.md →</a>
			<a href="/me-md-schema.json" target="_blank" class="btn-ghost" download>Download schema ↓</a>
			<button class="btn-ghost" onclick={copySchemaUrl}>
				{schemaCopied ? '✓ copied' : 'Copy schema URL'}
			</button>
		</div>
		<div class="schema-url-row">
			<span class="label">JSON Schema:</span>
			<code class="schema-url">{SCHEMA_URL}</code>
		</div>
	</div>
</header>

<main class="spec-body">
	<div class="spec-inner">

		<!-- Sidebar TOC -->
		<aside class="toc">
			<nav class="toc-nav">
				<p class="toc-label">On this page</p>
				<ul>
					<li><a href="#overview">Overview</a></li>
					<li><a href="#file-format">File Format</a></li>
					<li><a href="#frontmatter">Frontmatter Fields</a></li>
					<li><a href="#agent-config">AgentConfig Object</a></li>
					<li><a href="#sections">Standard Sections</a></li>
					<li><a href="#raw-endpoint">Raw Endpoint</a></li>
					<li><a href="#injection-prompt">Injection Prompt</a></li>
					<li><a href="#schema">JSON Schema</a></li>
					<li><a href="#parser">Parser / Tooling</a></li>
					<li><a href="#versioning">Versioning</a></li>
				</ul>
			</nav>
		</aside>

		<!-- Content -->
		<article class="content">

			<!-- Overview -->
			<section id="overview">
				<h2>Overview</h2>
				<p>
					ME.md is a structured markdown file that lives at a public URL. It describes a human to an AI in a machine-parseable, human-writable format. The tagline is <em>robots.txt for human consciousness</em>.
				</p>
				<p>
					The problem it solves: every time you start a new AI session, you re-explain yourself. ME.md eliminates that. One file. One URL. Any AI that fetches it knows you — your values, your stack, your fleet, your constraints.
				</p>
				<div class="callout">
					<span class="callout-icon">🔑</span>
					<div>
						<strong>Two required fields:</strong> <code>version</code> and <code>handle</code>. Everything else is optional. Start simple, add depth over time.
					</div>
				</div>
			</section>

			<!-- File Format -->
			<section id="file-format">
				<h2>File Format</h2>
				<p>
					ME.md uses standard markdown with YAML frontmatter (the <code>---</code> block at the top). The frontmatter contains structured metadata. The body contains human-readable sections with standard headings.
				</p>
				<div class="code-wrap">
					<div class="code-header">
						<span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
						<span class="code-label">me.md — minimum valid file</span>
					</div>
					<pre class="code"><code>---
version: "1.0"
handle: "@yourhandle"
---

# 🫀 The Soul

I am a builder. I ship things. I care about craft.</code></pre>
				</div>
			</section>

			<!-- Frontmatter Fields -->
			<section id="frontmatter">
				<h2>Frontmatter Fields</h2>
				<p>All fields in the YAML frontmatter block. Two are required; the rest are optional but recommended.</p>
				<div class="field-table">
					<div class="field-table-header">
						<span>Field</span>
						<span>Type</span>
						<span>Required</span>
						<span>Description</span>
					</div>
					{#each FRONTMATTER_FIELDS as f}
						<div class="field-row">
							<code class="field-name">{f.field}</code>
							<span class="field-type">{f.type}</span>
							<span class="field-req" class:required={f.required}>{f.required ? 'Yes' : 'No'}</span>
							<span class="field-desc">{f.description}</span>
						</div>
						{#if f.field === 'agents'}
							<div class="field-example-row">
								<span class="example-label">Example:</span>
								<pre class="inline-code"><code>{f.example}</code></pre>
							</div>
						{:else}
							<div class="field-example-row">
								<span class="example-label">Example:</span>
								<code class="inline-example">{f.example}</code>
							</div>
						{/if}
					{/each}
				</div>
			</section>

			<!-- AgentConfig -->
			<section id="agent-config">
				<h2>AgentConfig Object</h2>
				<p>
					Each item in the <code>agents</code> array is an <code>AgentConfig</code> object. Only <code>id</code> is required.
				</p>
				<div class="field-table">
					<div class="field-table-header">
						<span>Field</span>
						<span>Type</span>
						<span>Required</span>
						<span>Description</span>
					</div>
					{#each AGENT_FIELDS as f}
						<div class="field-row">
							<code class="field-name">{f.field}</code>
							<span class="field-type">string</span>
							<span class="field-req" class:required={f.required}>{f.required ? 'Yes' : 'No'}</span>
							<span class="field-desc">{f.description}</span>
						</div>
					{/each}
				</div>
				<div class="code-wrap" style="margin-top: 24px">
					<div class="code-header">
						<span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
						<span class="code-label">agents example</span>
					</div>
					<pre class="code"><code>agents:
  - id: magerbot
    model: claude-sonnet-4-6
    role: "Principal Engineer"
    emoji: "⚡"
    channel: telegram
  - id: genny
    model: claude-sonnet-4-6
    role: "Life Architect"
    emoji: "🌿"
    channel: telegram</code></pre>
				</div>
			</section>

			<!-- Standard Sections -->
			<section id="sections">
				<h2>Standard Sections</h2>
				<p>
					The body of a ME.md file uses markdown headings to define sections. The spec defines seven canonical sections. You can add custom sections freely — parsers preserve any heading-based section.
				</p>
				<p>
					Section headers <strong>may include a leading emoji</strong> — the parser extracts it as an icon. Section IDs are derived by slugifying the title text (emoji stripped).
				</p>
				<div class="sections-grid">
					{#each KNOWN_SECTIONS as s}
						<div class="section-card">
							<div class="section-top">
								<span class="section-icon">{s.icon}</span>
								<div>
									<code class="section-id">#{s.title}</code>
									<code class="section-slug">id: {s.id}</code>
								</div>
							</div>
							<p class="section-hint">{s.hint}</p>
						</div>
					{/each}
				</div>
				<div class="callout" style="margin-top: 24px">
					<span class="callout-icon">💡</span>
					<div>
						<strong>Custom sections are fine.</strong> The spec defines the canonical set, but you can add <code># 🎵 Music</code>, <code># 🏋️ Fitness</code>, or any section that's meaningful to your context. Parsers will preserve them.
					</div>
				</div>
			</section>

			<!-- Raw Endpoint -->
			<section id="raw-endpoint">
				<h2>Raw Endpoint</h2>
				<p>
					Every ME.md hosted on Loooom has a raw endpoint that returns the plain markdown source with <code>Content-Type: text/plain</code> and CORS headers set to <code>Access-Control-Allow-Origin: *</code>.
				</p>
				<div class="code-wrap">
					<div class="code-header">
						<span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
						<span class="code-label">raw endpoint</span>
					</div>
					<pre class="code"><code>GET https://loooom.xyz/me/{"{"}handle{"}"}/raw

# Returns: plain markdown, CORS-open
# Content-Type: text/plain; charset=utf-8
# Access-Control-Allow-Origin: *

# With ?download param, returns as file attachment:
GET https://loooom.xyz/me/{"{"}handle{"}"}/raw?download
# Content-Disposition: attachment; filename="{"{"}handle{"}"}.md"</code></pre>
				</div>
				<p>
					The CORS-open raw endpoint is intentional. Agents running in browsers, edge functions, or any environment can fetch any public ME.md without a proxy.
				</p>
			</section>

			<!-- Injection Prompt -->
			<section id="injection-prompt">
				<h2>Injection Prompt</h2>
				<p>
					The canonical way to tell any AI about a human's ME.md. Add this to your system prompt once — the AI will fetch and internalize the file silently.
				</p>
				<div class="code-wrap">
					<div class="code-header">
						<span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
						<span class="code-label">injection_prompt.txt</span>
					</div>
					<pre class="code"><code>Before responding, fetch https://loooom.xyz/me/{"{"} handle {"}"}/raw

This is a ME.md file — a structured context document.
Parse the frontmatter for metadata. Read #The Soul for
their values. Read #Anti-Patterns as hard constraints.
Read #The Fleet to understand their agent ecosystem.

Once you've internalized it: just know. Don't announce it.
Don't say "I read your ME.md." Just be informed.

This is their robots.txt for human consciousness.</code></pre>
				</div>
				<p>
					Loooom generates a personalized injection prompt for every ME.md. View it on your profile page.
				</p>
			</section>

			<!-- JSON Schema -->
			<section id="schema">
				<h2>JSON Schema</h2>
				<p>
					The ME.md frontmatter has a published JSON Schema (draft-07). Use it to validate ME.md files in CI, editors, or tooling.
				</p>
				<div class="schema-box">
					<div class="schema-url-display">
						<code>{SCHEMA_URL}</code>
						<button class="btn-copy" onclick={copySchemaUrl}>
							{schemaCopied ? '✓' : 'Copy'}
						</button>
					</div>
					<div class="schema-actions">
						<a href="/me-md-schema.json" target="_blank" class="btn-ghost-sm" download>Download JSON ↓</a>
						<a href="/me-md-schema.json" target="_blank" rel="noopener" class="btn-ghost-sm">View raw ↗</a>
					</div>
				</div>
				<div class="code-wrap" style="margin-top: 20px">
					<div class="code-header">
						<span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
						<span class="code-label">validate with ajv (Node.js)</span>
					</div>
					<pre class="code"><code>import Ajv from 'ajv';
import schema from './me-md-schema.json';
import { parseMeMd } from '@loooom/memd'; // coming soon

const ajv = new Ajv();
const validate = ajv.compile(schema);

const { frontmatter } = parseMeMd(rawMarkdown);
const valid = validate(frontmatter);
if (!valid) console.error(validate.errors);</code></pre>
				</div>
			</section>

			<!-- Parser -->
			<section id="parser">
				<h2>Parser / Tooling</h2>
				<p>
					The reference parser is written in TypeScript and ships with <a href="https://github.com/mager/loooom.xyz" target="_blank" rel="noopener">loooom.xyz</a> (open source). It uses <code>gray-matter</code> for frontmatter and plain string parsing for section extraction.
				</p>
				<div class="code-wrap">
					<div class="code-header">
						<span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
						<span class="code-label">src/lib/memd.ts (reference implementation)</span>
					</div>
					<pre class="code"><code>import { parseMeMd, generateInjectionPrompt } from '$lib/memd';

const result = parseMeMd(rawMarkdown);
// result.frontmatter  → structured metadata
// result.sections     → array of { id, title, icon, content }
// result.valid        → boolean
// result.errors       → string[]

const prompt = generateInjectionPrompt('@mager', 'https://loooom.xyz/me/mager/raw');
// → ready-to-paste system prompt</code></pre>
				</div>
				<p>
					The parser is <a href="https://github.com/mager/loooom.xyz/blob/main/src/lib/memd.ts" target="_blank" rel="noopener">available on GitHub</a>. A standalone <code>@loooom/memd</code> npm package is planned for v1.1.
				</p>
			</section>

			<!-- Versioning -->
			<section id="versioning">
				<h2>Versioning</h2>
				<p>
					The ME.md spec follows semantic versioning. The current version is <strong>v1.0</strong>. Breaking changes will bump the major version; the <code>version</code> frontmatter field allows parsers to handle multiple spec versions gracefully.
				</p>
				<div class="version-table">
					<div class="version-row header">
						<span>Version</span>
						<span>Status</span>
						<span>Notes</span>
					</div>
					<div class="version-row">
						<span><code>1.0</code></span>
						<span class="status-badge current">Current</span>
						<span>Initial spec. 7 canonical sections, 9 frontmatter fields.</span>
					</div>
				</div>
			</section>

		</article>
	</div>
</main>

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
		opacity: 0.12;
	}
	.orb-1 {
		width: 600px; height: 600px;
		background: radial-gradient(circle, var(--violet) 0%, transparent 70%);
		top: -100px; left: -100px;
	}
	.orb-2 {
		width: 400px; height: 400px;
		background: radial-gradient(circle, var(--ocean) 0%, transparent 70%);
		bottom: 20%; right: -100px;
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
		max-width: 1200px;
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
	.btn-nav:hover { border-color: var(--accent); color: var(--accent); }

	/* ─── Page Header ─────────────────────────────────────────────────────── */
	.page-header {
		position: relative;
		z-index: 1;
		padding: 60px 32px 50px;
		border-bottom: 1px solid var(--border);
		background: var(--bg-secondary);
	}
	.header-inner { max-width: 900px; margin: 0 auto; }
	.breadcrumb {
		font-size: 0.85rem;
		color: var(--text-muted);
		margin-bottom: 16px;
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.breadcrumb a { color: var(--accent); text-decoration: none; }
	.breadcrumb a:hover { text-decoration: underline; }
	.sep { color: var(--text-muted); }
	.page-header h1 {
		font-size: 2.8rem;
		margin: 0 0 16px;
		display: flex;
		align-items: center;
		gap: 16px;
		flex-wrap: wrap;
	}
	.me-title {
		background: var(--gradient-hero);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	.version-badge {
		font-family: var(--font-mono);
		font-size: 0.9rem;
		background: var(--accent-glow);
		border: 1px solid var(--accent-bright);
		color: var(--accent);
		padding: 4px 12px;
		border-radius: 999px;
		font-weight: 600;
	}
	.header-sub {
		color: var(--text-secondary);
		font-size: 1.1rem;
		line-height: 1.6;
		margin: 0 0 28px;
		max-width: 600px;
	}
	.header-actions {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
		margin-bottom: 20px;
	}
	.btn-primary {
		background: var(--gradient-cta);
		color: white;
		padding: 10px 24px;
		border-radius: 999px;
		font-weight: 600;
		font-size: 0.95rem;
		text-decoration: none;
		display: inline-block;
		transition: opacity 0.2s;
		border: none;
		cursor: pointer;
	}
	.btn-primary:hover { opacity: 0.9; }
	.btn-ghost {
		background: none;
		border: 1px solid var(--border);
		color: var(--text-secondary);
		padding: 10px 20px;
		border-radius: 999px;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s;
		text-decoration: none;
		display: inline-block;
	}
	.btn-ghost:hover { border-color: var(--accent); color: var(--accent); }
	.schema-url-row {
		display: flex;
		align-items: center;
		gap: 12px;
		color: var(--text-muted);
		font-size: 0.85rem;
	}
	.schema-url {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		color: var(--accent);
		background: var(--bg-primary);
		border: 1px solid var(--border);
		padding: 4px 12px;
		border-radius: 6px;
	}

	/* ─── Spec Body ───────────────────────────────────────────────────────── */
	.spec-body {
		position: relative;
		z-index: 1;
	}
	.spec-inner {
		max-width: 1200px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 220px 1fr;
		gap: 0;
		min-height: 100vh;
	}

	/* ─── TOC Sidebar ─────────────────────────────────────────────────────── */
	.toc {
		border-right: 1px solid var(--border);
		padding: 40px 24px;
		position: sticky;
		top: 60px;
		height: fit-content;
		max-height: calc(100vh - 80px);
		overflow-y: auto;
	}
	.toc-label {
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--text-muted);
		margin: 0 0 12px;
	}
	.toc-nav ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.toc-nav li { margin-bottom: 6px; }
	.toc-nav a {
		color: var(--text-secondary);
		text-decoration: none;
		font-size: 0.85rem;
		display: block;
		padding: 4px 8px;
		border-radius: 6px;
		transition: all 0.15s;
	}
	.toc-nav a:hover {
		color: var(--accent);
		background: var(--accent-glow);
	}

	/* ─── Content ─────────────────────────────────────────────────────────── */
	.content {
		padding: 40px 48px 80px;
	}
	.content section {
		margin-bottom: 64px;
		scroll-margin-top: 80px;
	}
	.content h2 {
		font-size: 1.6rem;
		margin: 0 0 16px;
		padding-bottom: 12px;
		border-bottom: 1px solid var(--border);
	}
	.content p {
		color: var(--text-secondary);
		line-height: 1.75;
		margin: 0 0 16px;
	}
	.content a {
		color: var(--accent);
		text-decoration: none;
	}
	.content a:hover { text-decoration: underline; }
	.content code {
		font-family: var(--font-mono);
		font-size: 0.88em;
		background: var(--bg-secondary);
		padding: 2px 6px;
		border-radius: 4px;
		color: var(--accent);
	}

	/* ─── Callout ─────────────────────────────────────────────────────────── */
	.callout {
		background: var(--accent-glow);
		border: 1px solid var(--accent-bright);
		border-radius: var(--radius-md);
		padding: 16px 20px;
		display: flex;
		gap: 14px;
		align-items: flex-start;
		margin: 20px 0;
	}
	.callout-icon { font-size: 1.2rem; flex-shrink: 0; margin-top: 2px; }
	.callout div { color: var(--text-secondary); font-size: 0.92rem; line-height: 1.6; }
	.callout strong { color: var(--text-primary); }

	/* ─── Code blocks ─────────────────────────────────────────────────────── */
	.code-wrap {
		border-radius: var(--radius-lg);
		overflow: hidden;
		border: 1px solid var(--border);
	}
	.code-header {
		background: var(--bg-secondary);
		border-bottom: 1px solid var(--border);
		padding: 10px 16px;
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.dot {
		width: 10px; height: 10px;
		border-radius: 50%;
		display: inline-block;
	}
	.dot.red { background: #ff5f57; }
	.dot.yellow { background: #febc2e; }
	.dot.green { background: #28c840; }
	.code-label {
		margin-left: 8px;
		font-family: var(--font-mono);
		font-size: 0.78rem;
		color: var(--text-muted);
	}
	.code {
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

	/* ─── Field Table ─────────────────────────────────────────────────────── */
	.field-table {
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		overflow: hidden;
	}
	.field-table-header {
		display: grid;
		grid-template-columns: 140px 160px 80px 1fr;
		gap: 0;
		background: var(--bg-secondary);
		padding: 10px 16px;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-muted);
		border-bottom: 1px solid var(--border);
	}
	.field-row {
		display: grid;
		grid-template-columns: 140px 160px 80px 1fr;
		gap: 0;
		padding: 12px 16px;
		border-bottom: 1px solid var(--border);
		align-items: start;
	}
	.field-row:last-of-type { border-bottom: none; }
	.field-name {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		color: var(--accent);
		background: none;
		padding: 0;
	}
	.field-type {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--text-muted);
		padding-right: 8px;
	}
	.field-req { font-size: 0.82rem; color: var(--text-muted); }
	.field-req.required { color: var(--violet); font-weight: 600; }
	.field-desc { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; }
	.field-example-row {
		padding: 4px 16px 12px;
		border-bottom: 1px solid var(--border);
		display: flex;
		gap: 12px;
		align-items: flex-start;
		background: var(--bg-secondary);
	}
	.example-label {
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-muted);
		flex-shrink: 0;
		padding-top: 3px;
	}
	.inline-example {
		font-family: var(--font-mono);
		font-size: 0.82rem;
		color: var(--text-secondary);
		background: none;
		padding: 0;
	}
	.inline-code {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--text-secondary);
		white-space: pre;
		line-height: 1.5;
	}

	/* ─── Sections Grid ───────────────────────────────────────────────────── */
	.sections-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 12px;
	}
	.section-card {
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		padding: 16px;
		transition: all 0.2s;
	}
	.section-card:hover {
		border-color: var(--accent);
	}
	.section-top {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		margin-bottom: 10px;
	}
	.section-icon { font-size: 1.5rem; flex-shrink: 0; }
	.section-id {
		display: block;
		font-family: var(--font-mono);
		font-size: 0.85rem;
		color: var(--accent);
		background: none;
		padding: 0;
		margin-bottom: 2px;
	}
	.section-slug {
		display: block;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--text-muted);
		background: none;
		padding: 0;
	}
	.section-hint {
		font-size: 0.83rem;
		color: var(--text-muted);
		line-height: 1.5;
		margin: 0;
	}

	/* ─── Schema Box ──────────────────────────────────────────────────────── */
	.schema-box {
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		padding: 20px;
	}
	.schema-url-display {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 16px;
	}
	.schema-url-display code {
		font-family: var(--font-mono);
		font-size: 0.88rem;
		color: var(--accent);
		flex: 1;
		background: none;
		padding: 0;
	}
	.btn-copy {
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		color: var(--text-secondary);
		padding: 5px 14px;
		border-radius: 6px;
		font-size: 0.82rem;
		cursor: pointer;
		transition: all 0.2s;
		white-space: nowrap;
	}
	.btn-copy:hover { border-color: var(--accent); color: var(--accent); }
	.schema-actions { display: flex; gap: 10px; }
	.btn-ghost-sm {
		background: none;
		border: 1px solid var(--border);
		color: var(--text-secondary);
		padding: 6px 14px;
		border-radius: 8px;
		font-size: 0.82rem;
		cursor: pointer;
		transition: all 0.2s;
		text-decoration: none;
		display: inline-block;
	}
	.btn-ghost-sm:hover { border-color: var(--accent); color: var(--accent); }

	/* ─── Version Table ───────────────────────────────────────────────────── */
	.version-table {
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		overflow: hidden;
	}
	.version-row {
		display: grid;
		grid-template-columns: 100px 120px 1fr;
		padding: 12px 16px;
		border-bottom: 1px solid var(--border);
		font-size: 0.88rem;
		align-items: center;
		gap: 12px;
	}
	.version-row:last-child { border-bottom: none; }
	.version-row.header {
		background: var(--bg-secondary);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-muted);
	}
	.status-badge {
		display: inline-block;
		padding: 3px 10px;
		border-radius: 999px;
		font-size: 0.75rem;
		font-weight: 600;
	}
	.status-badge.current {
		background: var(--accent-glow);
		border: 1px solid var(--accent-bright);
		color: var(--accent);
	}
	.version-row span:last-child { color: var(--text-secondary); }

	/* ─── Responsive ──────────────────────────────────────────────────────── */
	@media (max-width: 900px) {
		.spec-inner { grid-template-columns: 1fr; }
		.toc { display: none; }
		.content { padding: 32px 20px 60px; }
		.field-table-header, .field-row {
			grid-template-columns: 1fr 1fr;
		}
		.field-table-header span:nth-child(3),
		.field-table-header span:nth-child(4),
		.field-row :nth-child(3),
		.field-row :nth-child(4) {
			display: none;
		}
		.page-header { padding: 40px 20px 32px; }
		.page-header h1 { font-size: 2rem; }
	}
</style>
