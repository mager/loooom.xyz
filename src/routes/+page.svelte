<script lang="ts">
	import YarnLogo from '$lib/components/YarnLogo.svelte';
	import { MARKETPLACE_COMMAND } from '$lib/plugins';

	let { data } = $props();

	const featuredPlugins = $derived(
		data.plugins.filter((p: { source: string }) => p.source === 'loooom').slice(0, 3)
	);

	const loooomCount = $derived(
		data.plugins.filter((p: { source: string }) => p.source === 'loooom').length
	);

	let copied = $state(false);
	let waitlistEmail = $state('');
	let waitlistState = $state<'idle' | 'loading' | 'done' | 'already' | 'error'>('idle');

	function copyCommand() {
		navigator.clipboard.writeText(MARKETPLACE_COMMAND);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	async function joinWaitlist(e: Event) {
		e.preventDefault();
		if (!waitlistEmail) return;
		waitlistState = 'loading';
		try {
			const res = await fetch('/api/waitlist', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: waitlistEmail })
			});
			const data = await res.json();
			if (!res.ok) { waitlistState = 'error'; return; }
			waitlistState = data.already ? 'already' : 'done';
		} catch {
			waitlistState = 'error';
		}
	}
</script>

<svelte:head>
	<title>Loooom — Claude Code Skills Marketplace</title>
	<meta
		name="description"
		content="A GitHub-native marketplace for Claude Code. Browse community-built skills and install anything in one command."
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
			<a href="/browse" class="nav-link">Browse</a>
			<a
				href="https://github.com/mager/loooom"
				target="_blank"
				rel="noopener"
				class="nav-link">GitHub</a
			>
			<a href="/login" class="btn-nav">Sign In</a>
		</div>
	</div>
</nav>

<!-- Hero -->
<section class="hero">
	<div class="hero-inner">
		<p class="eyebrow">Claude Code Skills Marketplace</p>
		<h1>Teach Claude<br />new tricks.</h1>
		<p class="hero-sub">
			A GitHub-native marketplace for Claude Code. Browse {loooomCount}+ original skills — plus
			curated picks from across the ecosystem.
		</p>

		<div class="terminal">
			<div class="terminal-bar">
				<span class="terminal-dot"></span>
				<span class="terminal-dot"></span>
				<span class="terminal-dot"></span>
				<span class="terminal-label">Claude Code</span>
				<button class="copy-btn" onclick={copyCommand}>
					{copied ? '✓ copied' : 'copy'}
				</button>
			</div>
			<div class="terminal-body">
				<span class="prompt">$</span>
				<span class="cmd">{MARKETPLACE_COMMAND}</span>
			</div>
		</div>

		<div class="hero-links">
			<a href="/browse" class="link-cta">Browse skills →</a>
			<a
				href="https://github.com/mager/loooom"
				target="_blank"
				rel="noopener"
				class="link-ghost">Contribute on GitHub</a
			>
		</div>

		<div class="waitlist-block">
			<p class="waitlist-eyebrow">Want to publish skills?</p>
			{#if waitlistState === 'done'}
				<p class="waitlist-success">✓ You're on the list. We'll reach out when creator tools open up.</p>
			{:else if waitlistState === 'already'}
				<p class="waitlist-success">✓ Already on the list — we've got you.</p>
			{:else}
				<form class="waitlist-form" onsubmit={joinWaitlist}>
					<input
						type="email"
						bind:value={waitlistEmail}
						placeholder="you@example.com"
						required
						disabled={waitlistState === 'loading'}
					/>
					<button type="submit" disabled={waitlistState === 'loading'}>
						{waitlistState === 'loading' ? '...' : 'Join waitlist →'}
					</button>
				</form>
				{#if waitlistState === 'error'}
					<p class="waitlist-error">Something went wrong. Try again.</p>
				{/if}
				<p class="waitlist-note">Or <a href="/login">sign in with GitHub</a> for instant access.</p>
			{/if}
		</div>
	</div>
</section>

<!-- What is a skill? -->
<section class="explainer">
	<div class="section-inner">
		<div class="explainer-grid">
			<div class="explainer-text">
				<p class="section-eyebrow">How it works</p>
				<h2>Skills are just markdown.</h2>
				<p>
					A skill is a <code>SKILL.md</code> file — plain English instructions Claude reads before
					responding. No SDK. No server. No build step.
				</p>
				<p>
					GitHub is the database. Your <code>.claude/skills/</code> directory is the runtime.
					Skills activate automatically when Claude Code reads them at session start.
				</p>
				<a href="/docs" class="link-cta" style="display: inline-flex; margin-top: 1.25rem;"
					>Read the docs →</a
				>
			</div>
			<div class="skill-preview">
				<div class="skill-file-header">
					<span class="file-dot"></span>
					<span class="file-dot"></span>
					<span class="file-dot"></span>
					<span class="file-name">SKILL.md</span>
				</div>
				<pre class="skill-code"><code>{`# Beginner Japanese

## When to activate
When the user wants to practice
Japanese for an upcoming trip.

## Your method
1. Start with survival phrases
2. Build vocabulary through context
3. Track progress across sessions

## Always
Speak romaji first, then kana.
Correct gently. Celebrate wins.`}</code></pre>
			</div>
		</div>
	</div>
</section>

<!-- Creator Trust -->
<section class="trust">
	<div class="section-inner">
		<div class="trust-inner">
			<div class="trust-text">
				<p class="section-eyebrow">For creators</p>
				<h2>This isn't training.<br />It's teaching.</h2>
				<p>
					You write the skill. Claude follows it. Your knowledge <strong>never</strong> trains
					Anthropic's models — it lives in a file on your GitHub, published under your name,
					deletable by you at any time.
				</p>
				<p>
					Think of it like publishing a book. Except every reader gets a personal tutor who teaches
					your method, your voice, your way.
				</p>
			</div>
			<div class="trust-stats">
				<div class="trust-stat">
					<span class="stat-icon">✍️</span>
					<strong>You write it</strong>
					<span>Plain English. Your method. Your voice.</span>
				</div>
				<div class="trust-stat">
					<span class="stat-icon">🔒</span>
					<strong>You own it</strong>
					<span>Hosted on your GitHub. Edit or delete anytime.</span>
				</div>
				<div class="trust-stat">
					<span class="stat-icon">🏷️</span>
					<strong>Your name on it</strong>
					<span>Every install credits you as the author.</span>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- How to install -->
<section class="how">
	<div class="section-inner">
		<p class="section-eyebrow">Getting started</p>
		<h2>Three steps. That's it.</h2>
		<div class="steps">
			<div class="step">
				<span class="step-num">01</span>
				<div class="step-body">
					<h3>Add the marketplace</h3>
					<p>Connect Claude Code to the Loooom skill catalog with one command.</p>
					<code class="inline-cmd">{MARKETPLACE_COMMAND}</code>
				</div>
			</div>
			<div class="step">
				<span class="step-num">02</span>
				<div class="step-body">
					<h3>Install any skill</h3>
					<p>Browse by category or search. Every skill is a single install command.</p>
					<code class="inline-cmd">/plugin install beginner-japanese@loooom</code>
				</div>
			</div>
			<div class="step">
				<span class="step-num">03</span>
				<div class="step-body">
					<h3>Claude reads it automatically</h3>
					<p>
						Skills live in <code>.claude/skills/</code>. Claude reads them at session start — no
						configuration required.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Plugin Showcase -->
<section class="plugins">
	<div class="section-inner">
		<div class="plugins-header">
			<div>
				<p class="section-eyebrow">Marketplace</p>
				<h2>Featured skills</h2>
			</div>
			<a href="/browse" class="link-ghost browse-all">Browse all {data.plugins.length} →</a>
		</div>
		<div class="plugins-grid">
			{#each featuredPlugins as plugin}
				<a href="/p/{plugin.author}/{plugin.name}" class="plugin-card">
					<span class="plugin-emoji">{plugin.emoji}</span>
					<h3 class="plugin-title">{plugin.title}</h3>
					<p class="plugin-desc">{plugin.description}</p>
					<span class="plugin-author">@{plugin.author}</span>
				</a>
			{/each}
		</div>
		<div class="community-callout">
			<span class="community-icon">🌐</span>
			<p>
				We also curate the best skills from across the ecosystem — not just Loooom originals.
				Got one worth featuring?
				<a
					href="https://twitter.com/loooomxyz"
					target="_blank"
					rel="noopener"
					class="callout-link">Tweet at @loooomxyz</a
				> to submit.
			</p>
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
				<h4>Product</h4>
				<a href="/browse">Browse</a>
				<a href="/startweaving">Create a Skill</a>
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
		padding: 7rem 1.5rem 4.5rem;
		text-align: center;
	}
	.hero-inner {
		max-width: 600px;
		margin: 0 auto;
	}
	.eyebrow {
		font-family: var(--font-mono);
		font-size: 0.65rem;
		font-weight: 400;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ocean);
		margin-bottom: 1.25rem;
	}
	h1 {
		font-size: clamp(2.75rem, 9vw, 5rem);
		color: var(--text-primary);
		margin-bottom: 1.25rem;
	}
	.hero-sub {
		font-size: clamp(0.95rem, 2.5vw, 1.1rem);
		color: var(--text-secondary);
		line-height: 1.6;
		max-width: 460px;
		margin: 0 auto 2rem;
		font-weight: 300;
	}

	/* ===== Terminal Block ===== */
	.terminal {
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 10px;
		overflow: hidden;
		margin: 0 auto 1.75rem;
		max-width: 460px;
		text-align: left;
	}
	.terminal-bar {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.55rem 0.85rem;
		background: var(--bg-secondary);
		border-bottom: 1px solid var(--border);
	}
	.terminal-dot {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: var(--border);
	}
	.terminal-label {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		color: var(--text-muted);
		margin-left: 0.25rem;
		flex: 1;
	}
	.copy-btn {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		color: var(--text-muted);
		background: none;
		border: 1px solid var(--border);
		border-radius: 4px;
		padding: 0.18rem 0.5rem;
		cursor: pointer;
		transition: all 0.15s;
	}
	.copy-btn:hover {
		color: var(--text-primary);
		border-color: var(--text-muted);
	}
	.terminal-body {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.9rem 1rem;
	}
	.prompt {
		font-family: var(--font-mono);
		font-size: 0.9rem;
		color: var(--text-muted);
		user-select: none;
	}
	.cmd {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		color: var(--ocean);
	}

	/* ===== Hero Links ===== */
	.hero-links {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1.75rem;
		flex-wrap: wrap;
	}
	.link-cta {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-primary) !important;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		transition: color 0.2s;
	}
	.link-cta:hover {
		color: var(--ocean) !important;
	}
	.link-ghost {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-muted) !important;
		text-decoration: none;
		transition: color 0.2s;
	}
	.link-ghost:hover {
		color: var(--text-secondary) !important;
	}

	/* ===== Waitlist ===== */
	.waitlist-block {
		margin-top: 2.5rem;
		padding-top: 2rem;
		border-top: 1px solid var(--border);
		text-align: center;
		max-width: 440px;
		margin-left: auto;
		margin-right: auto;
	}
	.waitlist-eyebrow {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--text-muted);
		margin-bottom: 0.75rem;
	}
	.waitlist-form {
		display: flex;
		gap: 0.5rem;
		width: 100%;
	}
	.waitlist-form input {
		flex: 1;
		padding: 0.75rem 1rem;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		color: var(--text-primary);
		font-family: var(--font-display);
		font-size: 0.9rem;
		outline: none;
		transition: border-color 0.2s;
	}
	.waitlist-form input:focus { border-color: var(--accent); }
	.waitlist-form input::placeholder { color: var(--text-muted); }
	.waitlist-form input:disabled { opacity: 0.6; }
	.waitlist-form button {
		padding: 0.75rem 1.25rem;
		background: var(--accent);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-family: var(--font-display);
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		white-space: nowrap;
		transition: all 0.2s;
	}
	.waitlist-form button:hover:not(:disabled) { background: var(--accent-bright); }
	.waitlist-form button:disabled { opacity: 0.6; cursor: not-allowed; }
	:global(html[data-theme="dark"]) .waitlist-form button { color: var(--bg-primary); }
	.waitlist-note {
		font-size: 0.8rem;
		color: var(--text-muted);
		margin-top: 0.75rem;
	}
	.waitlist-note a { color: var(--ocean); text-decoration: none; }
	.waitlist-note a:hover { color: var(--ocean-deep); }
	.waitlist-success {
		font-size: 0.9rem;
		color: var(--emerald);
		font-weight: 600;
	}
	.waitlist-error {
		font-size: 0.8rem;
		color: var(--rose);
		margin-top: 0.5rem;
	}

	/* ===== Explainer (What is a skill?) ===== */
	.explainer {
		padding: 4.5rem 0;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		background: var(--bg-secondary);
	}
	.explainer-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4rem;
		align-items: center;
	}
	.explainer-text h2 {
		font-size: 1.9rem;
		color: var(--text-primary);
		margin-bottom: 1rem;
	}
	.explainer-text p {
		font-size: 0.95rem;
		color: var(--text-secondary);
		line-height: 1.65;
		margin-bottom: 0.75rem;
		font-weight: 300;
	}
	.explainer-text code {
		font-family: var(--font-mono);
		font-size: 0.82rem;
		color: var(--ocean);
		background: var(--bg-card);
		border: 1px solid var(--border);
		padding: 0.1em 0.4em;
		border-radius: 4px;
	}
	.skill-preview {
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 10px;
		overflow: hidden;
	}
	.skill-file-header {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.55rem 0.85rem;
		background: var(--bg-secondary);
		border-bottom: 1px solid var(--border);
	}
	.file-dot {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: var(--border);
	}
	.file-name {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		color: var(--text-muted);
		margin-left: 0.3rem;
	}
	.skill-code {
		padding: 1rem 1.1rem;
		margin: 0;
		overflow-x: auto;
	}
	.skill-code code {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--text-secondary);
		line-height: 1.65;
		white-space: pre;
	}

	/* ===== Creator Trust ===== */
	.trust {
		padding: 4.5rem 0;
		border-top: 1px solid var(--border);
	}
	.trust-inner {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4rem;
		align-items: center;
	}
	.trust-text h2 {
		font-size: 1.9rem;
		color: var(--text-primary);
		margin-bottom: 1rem;
		line-height: 1.15;
	}
	.trust-text p {
		font-size: 0.95rem;
		color: var(--text-secondary);
		line-height: 1.65;
		font-weight: 300;
		margin-bottom: 0.75rem;
	}
	.trust-text strong {
		color: var(--ocean);
		font-weight: 600;
	}
	.trust-stats {
		display: flex;
		flex-direction: column;
		gap: 0;
	}
	.trust-stat {
		display: grid;
		grid-template-columns: 2rem 1fr;
		grid-template-rows: auto auto;
		column-gap: 0.75rem;
		padding: 1.1rem 0;
		border-top: 1px solid var(--border);
	}
	.trust-stat:last-child {
		border-bottom: 1px solid var(--border);
	}
	.stat-icon {
		grid-row: 1 / 3;
		font-size: 1.1rem;
		padding-top: 0.1rem;
	}
	.trust-stat strong {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-primary);
		display: block;
	}
	.trust-stat span {
		font-size: 0.8rem;
		color: var(--text-muted);
		font-weight: 300;
		line-height: 1.4;
	}

	/* ===== How It Works ===== */
	.how {
		padding: 4.5rem 0;
	}
	.how h2 {
		font-size: 1.9rem;
		color: var(--text-primary);
		margin-bottom: 2.5rem;
	}
	.steps {
		display: flex;
		flex-direction: column;
	}
	.step {
		display: grid;
		grid-template-columns: 56px 1fr;
		gap: 1.5rem;
		padding: 1.75rem 0;
		border-top: 1px solid var(--border);
	}
	.step:last-child {
		border-bottom: 1px solid var(--border);
	}
	.step-num {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		color: var(--text-muted);
		padding-top: 0.3rem;
	}
	.step-body h3 {
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 0.4rem;
		letter-spacing: -0.015em;
	}
	.step-body p {
		font-size: 0.9rem;
		color: var(--text-secondary);
		line-height: 1.6;
		margin-bottom: 0.75rem;
		font-weight: 300;
	}
	.step-body p code {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--ocean);
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		padding: 0.1em 0.4em;
		border-radius: 4px;
	}
	.inline-cmd {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		color: var(--ocean);
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 6px;
		padding: 0.45rem 0.85rem;
		display: inline-block;
	}

	/* ===== Plugin Showcase ===== */
	.plugins {
		padding: 4.5rem 0;
		border-top: 1px solid var(--border);
		background: var(--bg-secondary);
	}
	.plugins-header {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		margin-bottom: 1.75rem;
		gap: 1rem;
	}
	.plugins-header h2 {
		font-size: 1.9rem;
		color: var(--text-primary);
	}
	.browse-all {
		white-space: nowrap;
		padding-bottom: 0.2rem;
	}
	.plugins-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		border: 1px solid var(--border);
		border-radius: 10px;
		overflow: hidden;
	}
	.plugin-card {
		background: var(--bg-card);
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		text-decoration: none;
		color: inherit;
		transition: background 0.15s;
		border-right: 1px solid var(--border);
	}
	.plugin-card:last-child {
		border-right: none;
	}
	.plugin-card:hover {
		background: var(--bg-card-hover);
		color: inherit;
	}
	.plugin-emoji {
		font-size: 1.75rem;
		margin-bottom: 0.25rem;
	}
	.plugin-title {
		font-family: var(--font-display);
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--text-primary);
		letter-spacing: -0.015em;
	}
	.plugin-desc {
		font-size: 0.8rem;
		color: var(--text-secondary);
		line-height: 1.5;
		flex: 1;
		font-weight: 300;
	}
	.plugin-author {
		font-family: var(--font-mono);
		font-size: 0.65rem;
		color: var(--text-muted);
		margin-top: 0.25rem;
	}

	/* ===== Community Callout ===== */
	.community-callout {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		margin-top: 1.5rem;
		padding: 1rem 1.25rem;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 8px;
	}
	.community-icon {
		font-size: 1.1rem;
		flex-shrink: 0;
		padding-top: 0.05rem;
	}
	.community-callout p {
		font-size: 0.85rem;
		color: var(--text-secondary);
		line-height: 1.6;
		font-weight: 300;
		margin: 0;
	}
	.callout-link {
		color: var(--ocean) !important;
		text-decoration: none;
		font-weight: 500;
		transition: opacity 0.2s;
	}
	.callout-link:hover {
		opacity: 0.75;
	}

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
</style>
