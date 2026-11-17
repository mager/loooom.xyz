<script lang="ts">
	import { KNOWN_SECTIONS } from '$lib/memd';

	const SPEC_VERSION = '1.0';
	const SCHEMA_URL = 'https://loooom.xyz/me-md-schema.json';
	const AJV_EXAMPLE = `import Ajv from 'ajv';
import schema from './me-md-schema.json';
import { parseMeMd } from '@loooom/memd'; // coming soon

const ajv = new Ajv();
const validate = ajv.compile(schema);

const { frontmatter } = parseMeMd(rawMarkdown);
const valid = validate(frontmatter);
if (!valid) console.error(validate.errors);`;
	const PARSER_EXAMPLE = `import { parseMeMd, generateInjectionPrompt } from '$lib/memd';

const result = parseMeMd(rawMarkdown);
// result.frontmatter  → structured metadata
// result.sections     → array of { id, title, icon, content }
// result.valid        → boolean
// result.errors       → string[]

const prompt = generateInjectionPrompt('@mager', 'https://loooom.xyz/me/mager/raw');
// → ready-to-paste system prompt`;

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

<!-- Page header -->
<header class="page-header">
	<div class="header-inner">
		<div class="header-copy">
			<div class="breadcrumb">
				<a href="/me">ME.md</a>
				<span class="sep">/</span>
				<span>Spec</span>
			</div>
			<h1>
				<span class="me-title">ME.md</span> Specification
				<span class="version-badge">v{SPEC_VERSION}</span>
			</h1>
			<p class="file-kind">Portable Human Context Protocol</p>
			<p class="header-sub">
				The official standard for a single markdown file that tells any AI who you are, what matters, and how to work with you.
			</p>
			<div class="header-actions">
				<a href="/me" class="btn-primary">Create your ME.md</a>
				<a href="/me-md-schema.json" target="_blank" class="btn-ghost" download>Download schema</a>
				<button class="btn-ghost" onclick={copySchemaUrl}>
					{schemaCopied ? 'Copied' : 'Copy schema URL'}
				</button>
			</div>
			<div class="schema-url-row">
				<span class="label">JSON Schema</span>
				<code class="schema-url">{SCHEMA_URL}</code>
			</div>
		</div>
		<div class="hero-panel" aria-label="ME.md file preview">
			<div class="hero-panel-top">
				<span>me.md</span>
				<strong>valid v{SPEC_VERSION}</strong>
			</div>
			<pre><code>---
version: "1.0"
handle: "@yourhandle"
timezone: "America/Chicago"
---

# The Soul
I build with taste, momentum, and care.

# Working With Me
Be direct. Keep context portable.</code></pre>
			<div class="hero-stats">
				<span><strong>2</strong> required fields</span>
				<span><strong>7</strong> canonical sections</span>
			</div>
		</div>
	</div>
</header>

<div class="spec-body">
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
							<span class="field-req" class:required={f.required}><span class="field-req-label">Required: </span>{f.required ? 'Yes' : 'No'}</span>
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
							<span class="field-req" class:required={f.required}><span class="field-req-label">Required: </span>{f.required ? 'Yes' : 'No'}</span>
							<span class="field-desc">{f.description}</span>
						</div>
					{/each}
				</div>
				<div class="code-wrap" style="margin-top: 24px">
					<div class="code-header">
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
						<span class="code-label">validate with ajv (Node.js)</span>
					</div>
					<pre class="code"><code>{AJV_EXAMPLE}</code></pre>
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
						<span class="code-label">src/lib/memd.ts (reference implementation)</span>
					</div>
					<pre class="code"><code>{PARSER_EXAMPLE}</code></pre>
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
</div>

<style>
.page-header { padding: 48px 0; border-bottom: 1px solid var(--line); }
	.header-inner { display: grid; grid-template-columns: minmax(0, 1fr) minmax(280px, 360px); gap: 40px; align-items: center; }
	.header-copy { min-width: 0; }
	.breadcrumb { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; color: var(--quiet); font-size: 14px; margin-bottom: 24px; }
	.breadcrumb a { color: var(--lime); }
	.breadcrumb a:hover { text-decoration: underline; }
	.page-header h1 { font-size: clamp(36px, 4vw, 60px); font-weight: 500; line-height: 1.05; letter-spacing: -.035em; margin: 0 0 20px; }
	.me-title { color: var(--paper); }
	.version-badge { display: inline-block; vertical-align: middle; font-family: 'Space Mono', monospace; font-size: 11px; font-weight: 400; line-height: 1.5; letter-spacing: 0; color: var(--lime); background: var(--accent-soft); border: 1px solid var(--accent-border); border-radius: 4px; padding: 4px 8px; }
	.file-kind { color: var(--quiet); font-size: 14px; margin: 0 0 16px; }
	.header-sub { font-size: 17px; line-height: 1.7; color: var(--quiet); max-width: 65ch; margin: 0 0 24px; }
	.header-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }
	.btn-primary, .btn-ghost, .btn-ghost-sm, .btn-copy { display: inline-flex; align-items: center; justify-content: center; min-height: 46px; padding: 12px 16px; border: 1px solid var(--line); border-radius: 6px; background: transparent; color: var(--paper); font-size: 14px; font-weight: 500; cursor: pointer; transition: background .2s, border-color .2s; }
	.btn-primary { background: var(--action-bg); border-color: var(--action-bg); color: var(--action-ink); }
	.btn-primary:hover { background: var(--action-hover); color: var(--action-ink); }
	.btn-ghost:hover, .btn-ghost-sm:hover, .btn-copy:hover { background: var(--panel-raised); color: var(--paper); border-color: var(--line-strong); }
	.schema-url-row { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
	.label { color: var(--quiet); font-size: 13px; }
	.schema-url { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--code-text); background: var(--code-toolbar); border-radius: 4px; padding: 8px 10px; overflow-wrap: anywhere; }
	.hero-panel { min-width: 0; overflow: hidden; background: var(--code-bg); border: 1px solid var(--line); border-radius: 8px; }
	.hero-panel-top { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; padding: 14px 16px; background: var(--code-toolbar); border-bottom: 1px solid var(--line); font-family: 'Space Mono', monospace; font-size: 11px; color: var(--quiet); }
	.hero-panel-top strong { color: var(--lime); font-weight: 400; }
	.hero-panel pre { margin: 0; padding: 20px; font-family: 'Space Mono', monospace; font-size: 11px; line-height: 1.8; color: var(--code-text); overflow-x: auto; }
	.hero-panel pre code { font: inherit; }
	.hero-stats { display: flex; flex-wrap: wrap; gap: 8px 20px; border-top: 1px solid var(--line); padding: 14px 16px; color: var(--quiet); font-size: 12px; }
	.hero-stats strong { color: var(--paper); font-weight: 500; }
	.spec-inner { display: grid; grid-template-columns: 180px minmax(0, 1fr); gap: 40px; padding: 40px 0 64px; }
	.toc { position: sticky; top: 24px; height: fit-content; max-height: calc(100vh - 124px); overflow-y: auto; }
	.toc-label { color: var(--quiet); font-size: 12px; margin: 0 0 12px; }
	.toc-nav ul { list-style: none; margin: 0; padding: 0; }
	.toc-nav li { margin: 0 0 4px; }
	.toc-nav a { display: block; border-radius: 6px; color: var(--quiet); padding: 10px; font-size: 14px; }
	.toc-nav a:hover { background: var(--panel-raised); color: var(--paper); }
	.content { min-width: 0; }
	.content section { margin-bottom: 48px; scroll-margin-top: 24px; }
	.content section:last-child { margin-bottom: 0; }
	.content h2 { font-size: 29px; font-weight: 500; line-height: 1.2; padding-bottom: 18px; border-bottom: 1px solid var(--line); margin: 0 0 20px; }
	.content p { font-size: 15px; color: var(--quiet); line-height: 1.75; max-width: 72ch; margin: 0 0 18px; }
	.content a { color: var(--lime); text-decoration: underline; }
	.content a:hover { color: var(--paper); }
	.content code { font-family: 'Space Mono', monospace; font-size: .82em; background: var(--code-toolbar); color: var(--code-text); padding: 2px 5px; border-radius: 4px; overflow-wrap: anywhere; }
	.callout { display: flex; align-items: flex-start; gap: 14px; padding: 20px; margin: 24px 0; color: var(--notice-ink); background: var(--notice-bg); border: 1px solid var(--notice-border); border-radius: 8px; font-size: 14px; line-height: 1.7; }
	.callout-icon { flex-shrink: 0; }
	.callout div { min-width: 0; }
	.callout strong { font-weight: 500; }
	.code-wrap { min-width: 0; overflow: hidden; border: 1px solid var(--line); border-radius: 8px; margin-bottom: 24px; }
	.code-header { padding: 14px 16px; background: var(--code-toolbar); border-bottom: 1px solid var(--line); }
	.code-label { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--quiet); overflow-wrap: anywhere; }
	.code { background: var(--code-bg); color: var(--code-text); font-family: 'Space Mono', monospace; font-size: 12px; line-height: 1.8; margin: 0; padding: 20px; overflow-x: auto; white-space: pre; }
	.code code { background: none; padding: 0; color: inherit; font: inherit; overflow-wrap: normal; }
	.field-table { border: 1px solid var(--line); border-radius: 8px; overflow: hidden; background: var(--panel); }
	.field-table-header, .field-row { display: grid; grid-template-columns: minmax(75px, .8fr) minmax(85px, 1fr) 65px minmax(0, 2fr); gap: 12px; padding: 16px; border-bottom: 1px solid var(--line); align-items: start; }
	.field-table-header { color: var(--paper); background: var(--panel-raised); font-size: 12px; }
	.field-row:last-child { border-bottom: 0; }
	.content .field-name { font-size: 11px; color: var(--lime); background: none; padding: 0; }
	.field-type { font-family: 'Space Mono', monospace; font-size: 11px; line-height: 1.8; color: var(--quiet); overflow-wrap: anywhere; }
	.field-req { font-size: 12px; color: var(--quiet); }
	.field-req.required { color: var(--paper); }
	.field-req-label { display: none; }
	.field-desc { font-size: 14px; line-height: 1.7; color: var(--quiet); overflow-wrap: anywhere; }
	.field-example-row { display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; background: var(--code-bg); border-bottom: 1px solid var(--line); }
	.field-example-row:last-child { border-bottom: 0; }
	.example-label { color: var(--quiet); font-size: 12px; flex-shrink: 0; }
	.content .inline-example, .content .inline-code { font-family: 'Space Mono', monospace; font-size: 11px; line-height: 1.8; color: var(--code-text); background: none; padding: 0; margin: 0; min-width: 0; }
	.inline-code { overflow-x: auto; white-space: pre; }
	.inline-code code { font: inherit; background: none; padding: 0; }
	.sections-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 24px; }
	.section-card { padding: 20px 0; border-top: 1px solid var(--line); min-width: 0; }
	.section-top { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; }
	.section-top > div { min-width: 0; }
	.section-icon { font-size: 22px; flex-shrink: 0; }
	.content .section-id, .content .section-slug { display: block; padding: 0; background: none; font-size: 11px; line-height: 1.8; color: var(--paper); }
	.content .section-slug { color: var(--quiet); }
	.content .section-hint { font-size: 14px; margin: 0; }
	.schema-box { padding: 20px; border: 1px solid var(--line); border-radius: 8px; background: var(--panel); }
	.schema-url-display { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin-bottom: 16px; }
	.schema-url-display code { flex: 1; min-width: 0; font-size: 11px; padding: 0; background: none; }
	.btn-copy { min-height: 38px; padding: 8px 12px; font-size: 13px; }
	.schema-actions { display: flex; flex-wrap: wrap; gap: 10px; }
	.content .btn-ghost-sm { color: var(--paper); text-decoration: none; font-size: 13px; }
	.version-table { border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }
	.version-row { display: grid; grid-template-columns: 70px 85px minmax(0, 1fr); gap: 12px; align-items: start; padding: 16px; border-bottom: 1px solid var(--line); font-size: 14px; color: var(--quiet); }
	.version-row:last-child { border-bottom: 0; }
	.version-row.header { font-size: 12px; background: var(--panel-raised); color: var(--paper); }
	.status-badge { font-size: 11px; color: var(--lime); background: var(--accent-soft); border: 1px solid var(--accent-border); padding: 3px 6px; border-radius: 4px; }
	@media (max-width: 1250px) {
		.header-inner { grid-template-columns: minmax(0, 1fr); gap: 28px; }
		.hero-panel { max-width: 640px; }
		.spec-inner { grid-template-columns: minmax(0, 1fr); gap: 32px; }
		.toc { position: static; max-height: none; border-bottom: 1px solid var(--line); padding-bottom: 24px; }
		.toc-nav ul { display: flex; flex-wrap: wrap; gap: 6px; }
		.toc-nav li { margin: 0; }
		.toc-nav a { font-size: 13px; border: 1px solid var(--line); padding: 8px 10px; }
	}
	@media (max-width: 650px) {
		.page-header { padding: 32px 0; }
		.spec-inner { padding: 32px 0 48px; }
		.content h2 { font-size: 26px; }
		.field-table-header { display: none; }
		.field-row { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 8px 12px; }
		.field-desc { grid-column: 1 / -1; }
		.field-req { grid-column: 1 / -1; }
		.field-req-label { display: inline; }
		.field-example-row { flex-direction: column; gap: 8px; }
		.inline-code { max-width: 100%; }
		.sections-grid { grid-template-columns: minmax(0, 1fr); }
		.header-actions > * { flex: 1 1 100%; }
		.code { font-size: 11px; padding: 16px; }
		.version-row { grid-template-columns: 52px 70px minmax(0, 1fr); gap: 8px; padding: 12px; font-size: 12px; }
	}
</style>
