<script lang="ts">
	import { KNOWN_SECTIONS, ME_MD_TEMPLATE } from '$lib/memd';

	let copied = $state(false);

	function copyTemplate() {
		navigator.clipboard.writeText(ME_MD_TEMPLATE);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<svelte:head>
	<title>ME.md — Personal context on Loooom</title>
	<meta
		name="description"
		content="Write your context once. Use it across agents. Create, copy, and publish a ME.md file."
	/>
</svelte:head>

<!-- Hero -->
<section class="hero">
	<div class="hero-inner">
		<h1 class="hero-title">
			<span class="me">ME</span><span class="dot-md">.md</span>
		</h1>
		<p class="hero-tagline">
			Write your context once. Use it across agents.
		</p>
		<p class="hero-sub">
			One public URL for your personal context.
		</p>
		<div class="hero-actions">
			<a href="/login" class="btn-primary">Create your ME.md</a>
			<button class="btn-ghost" onclick={copyTemplate}>
				{copied ? 'Copied' : 'Copy template'}
			</button>
		</div>
		<div class="hero-url-demo">
			<span class="url-label">File URL</span>
			<code class="url-demo">loooom.xyz/me/<span class="url-handle">you</span></code>
		</div>
	</div>
</section>

<!-- What it is -->
<section class="explainer">
	<div class="explainer-inner">
		<div class="explainer-text">
			<h2>A Markdown file for your context</h2>
			<p>
				<strong>ME.md</strong> combines YAML frontmatter with sections for your values,
				tools, preferences, and current work.
			</p>
			<p>
				Publish it at a public URL so agents can read the same context.
			</p>
		</div>
		<div class="explainer-code">
			<div class="code-header">
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
			<p>Use the standard sections or add your own.</p>
		</div>
		<div class="sections-grid">
			{#each KNOWN_SECTIONS as section}
				<div class="section-card">
					<div class="section-info">
						<h3 class="section-title"># {section.title}</h3>
						<p class="section-hint">{section.hint}</p>
					</div>
				</div>
			{/each}
		</div>
		<div class="spec-footer">
			<a href="/me/spec" class="spec-link">View the full ME.md spec v1.0</a>
			<a href="/me-md-schema.json" target="_blank" download class="spec-link ghost">Download JSON Schema</a>
		</div>
	</div>
</section>

<!-- Injection prompt -->
<section class="injection">
	<div class="injection-inner">
		<div class="injection-header">
			<h2>The Injection Prompt</h2>
			<p>Use this prompt with an agent that can fetch URLs.</p>
		</div>
		<div class="code-block-wrap">
			<div class="code-header">
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
					<p>Fill in the sections that describe your work. Add constraints under Anti-Patterns.</p>
				</div>
			</div>
			<div class="step">
				<div class="step-num">02</div>
				<div class="step-text">
					<h3>Publish on Loooom</h3>
					<p>Your context lives at <code>loooom.xyz/me/you</code>. Raw Markdown is available at <code>/me/you/raw</code>.</p>
				</div>
			</div>
			<div class="step">
				<div class="step-num">03</div>
				<div class="step-text">
					<h3>Use and update your context</h3>
					<p>Add the injection prompt to your agent. Adapt useful context from others and save new versions of your own.</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- CTA -->
<section class="cta">
	<div class="cta-inner">
		<h2>Create your ME.md</h2>
		<a href="/login" class="btn-primary btn-large">Sign in to start</a>
		<div class="cta-examples">
			<span>See examples:</span>
			<a href="/me/mager">mager</a>
		</div>
	</div>
</section>

<style>
.hero { padding: 48px 0; border-bottom: 1px solid var(--line); }
	.hero-inner { max-width: 800px; }
	.hero-title { font-size: clamp(36px, 4vw, 60px); font-weight: 500; line-height: 1.05; letter-spacing: -.035em; margin: 0 0 16px; }
	.dot-md { color: var(--quiet); }
	.hero-tagline { font-size: 22px; line-height: 1.4; color: var(--paper); margin: 0 0 12px; }
	.hero-sub { font-size: 18px; line-height: 1.7; color: var(--quiet); margin: 0 0 28px; }
	.hero-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-bottom: 28px; }
	.btn-primary, .btn-ghost, .spec-link { display: inline-flex; justify-content: center; align-items: center; min-height: 46px; padding: 12px 20px; border: 1px solid var(--line); border-radius: 6px; font-size: 14px; font-weight: 500; transition: background .2s, border-color .2s; cursor: pointer; }
	.btn-primary { background: var(--action-bg); border-color: var(--action-bg); color: var(--action-ink); }
	.btn-primary:hover { background: var(--action-hover); color: var(--action-ink); }
	.btn-ghost, .spec-link { background: transparent; color: var(--paper); }
	.btn-ghost:hover, .spec-link:hover { background: var(--panel-raised); color: var(--paper); border-color: var(--line-strong); }
	.hero-url-demo { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; color: var(--quiet); font-size: 13px; }
	.url-demo { font-family: 'Space Mono', monospace; font-size: 12px; background: var(--code-toolbar); color: var(--code-text); padding: 8px 12px; border-radius: 4px; overflow-wrap: anywhere; }
	.url-handle { color: var(--lime); }
	.explainer, .spec, .injection, .how { padding: 48px 0; border-bottom: 1px solid var(--line); }
	.explainer-inner { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 40px; align-items: start; }
	.explainer-text h2, .spec-header h2, .injection-header h2, .how-inner h2, .cta-inner h2 { font-size: 29px; font-weight: 500; margin: 0 0 20px; line-height: 1.2; }
	.explainer-text p { color: var(--quiet); font-size: 15px; line-height: 1.75; margin: 0 0 16px; max-width: 72ch; }
	.explainer-text strong { color: var(--paper); font-weight: 500; }
	.explainer-code, .code-block-wrap { min-width: 0; overflow: hidden; border: 1px solid var(--line); border-radius: 8px; }
	.code-header { display: flex; align-items: center; padding: 14px 16px; border-bottom: 1px solid var(--line); background: var(--code-toolbar); }
	.code-filename { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--quiet); }
	.code-block { background: var(--code-bg); color: var(--code-text); font-family: 'Space Mono', monospace; font-size: 12px; line-height: 1.8; margin: 0; padding: 20px; overflow-x: auto; white-space: pre; }
	.code-block code { font: inherit; }
	.spec-header, .injection-header { margin-bottom: 32px; max-width: 72ch; }
	.spec-header p, .injection-header p { color: var(--quiet); font-size: 16px; line-height: 1.7; }
	.sections-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 32px; }
	.section-card { border-top: 1px solid var(--line); padding: 20px 0; min-width: 0; }
	.section-info { min-width: 0; }
	.section-title { font-family: 'Space Mono', monospace; font-size: 13px; font-weight: 400; letter-spacing: 0; margin: 0 0 8px; overflow-wrap: anywhere; }
	.section-hint { font-size: 14px; line-height: 1.65; color: var(--quiet); margin: 0; }
	.spec-footer { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
	.injection-inner { max-width: 860px; }
	.how-inner { max-width: 900px; }
	.steps { display: flex; flex-direction: column; gap: 28px; margin-top: 28px; }
	.step { display: flex; gap: 20px; }
	.step-num { font-family: 'Space Mono', monospace; font-size: 12px; color: var(--quiet); flex-shrink: 0; padding-top: 5px; }
	.step-text { min-width: 0; }
	.step-text h3 { font-size: 20px; font-weight: 500; margin: 0 0 8px; }
	.step-text p { font-size: 15px; line-height: 1.75; color: var(--quiet); max-width: 72ch; }
	.step-text code { font-family: 'Space Mono', monospace; font-size: .8em; background: var(--code-toolbar); color: var(--code-text); padding: 2px 5px; border-radius: 4px; overflow-wrap: anywhere; }
	.cta { padding: 48px 0 64px; }
	.cta-examples { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; font-size: 14px; color: var(--quiet); }
	.cta-examples a { color: var(--lime); text-decoration: underline; }
	@media (max-width: 1100px) { .explainer-inner { grid-template-columns: minmax(0, 1fr); gap: 28px; } }
	@media (max-width: 600px) {
		.hero, .explainer, .spec, .injection, .how, .cta { padding: 32px 0; }
		.hero-sub { font-size: 17px; }
		.sections-grid { grid-template-columns: minmax(0, 1fr); }
		.hero-actions { align-items: stretch; }
		.hero-actions > * { flex: 1 1 100%; }
		.code-block { font-size: 11px; padding: 16px; }
	}
</style>
