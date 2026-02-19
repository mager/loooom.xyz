<script lang="ts">
	import { page } from '$app/state';

	// Mock data — will come from Neon later
	const profile = $derived({
		username: page.params.username,
		displayName: page.params.username === 'mager' ? 'Mager' : page.params.username,
		avatar: null,
		verified: true,
		topics: ['coding', 'music', 'Chicago'],
		bio: 'Building things that matter. Based in Chicago.',
		followers: 342,
		skills: [
			{
				name: 'sveltekit-patterns',
				title: 'SvelteKit Patterns',
				description: 'Production-grade SvelteKit patterns — routing, load functions, form actions, streaming. The good stuff.',
				category: 'Engineering',
				installs: 1283,
				version: '2.1.0',
				updatedAt: '2 days ago',
				files: [
					{
						name: 'SKILL.md',
						content: `---
name: sveltekit-patterns
description: Production SvelteKit patterns
author: mager
version: 2.1.0
---

# SvelteKit Patterns

## Load Functions
Always colocate your load function with the route.
Use \`+page.server.ts\` for sensitive data.

## Form Actions
Prefer progressive enhancement:
\`\`\`typescript
export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    // validate, persist, return
  }
};
\`\`\``
					},
					{
						name: 'scripts/setup.sh',
						content: `#!/bin/bash
# Quick project setup
npm create svelte@latest my-app
cd my-app
npm install
npm run dev`
					}
				]
			},
			{
				name: 'chicago-food-guide',
				title: 'Chicago Food Guide',
				description: 'Deep-dish discourse. Tavern-style truths. The real guide to eating in Chicago, from someone who lives it.',
				category: 'Writing',
				installs: 876,
				version: '1.4.0',
				updatedAt: '1 week ago',
				files: [
					{
						name: 'SKILL.md',
						content: `---
name: chicago-food-guide
description: Authoritative Chicago food recommendations
author: mager
version: 1.4.0
---

# Chicago Food Guide

## The Rules
1. Lou Malnati's > Giordano's (fight me)
2. Italian beef: wet, with giardiniera
3. Hot dogs: never ketchup
4. Tavern-style pizza is the real Chicago pizza`
					}
				]
			},
			{
				name: 'beat-discovery',
				title: 'Beat Discovery',
				description: 'Find new music before it blows up. Weighted scoring across Spotify, Reddit, and Pitchfork. Tuned for taste.',
				category: 'Music',
				installs: 2104,
				version: '3.0.0',
				updatedAt: '5 days ago',
				files: [
					{
						name: 'SKILL.md',
						content: `---
name: beat-discovery
description: Music discovery with weighted scoring
author: mager
version: 3.0.0
---

# Beat Discovery

Score = (spotify_weight * popularity)
      + (reddit_weight * freshness)
      + (pitchfork_weight * review_score)

## Sources
- Spotify New Releases API
- Reddit r/indieheads [FRESH]
- Pitchfork Best New Music`
					},
					{
						name: 'scripts/score.py',
						content: `import numpy as np

def weighted_score(sources: dict) -> float:
    """Calculate weighted discovery score."""
    weights = {
        'spotify': 0.35,
        'reddit': 0.40,
        'pitchfork': 0.25
    }
    return sum(
        weights[k] * v
        for k, v in sources.items()
    )`
					}
				]
			}
		]
	});

	let activeSkill = $state(0);
	let activeFile = $state(0);

	function selectSkill(i: number) {
		activeSkill = i;
		activeFile = 0;
	}
</script>

<svelte:head>
	<title>{profile.displayName} — Loooom</title>
</svelte:head>

<!-- Ambient -->
<div class="ambient">
	<div class="orb orb-1"></div>
	<div class="orb orb-2"></div>
</div>

<!-- Nav -->
<nav>
	<div class="nav-inner">
		<a href="/" class="logo">
			<span class="logo-mark">◎</span>
			<span class="logo-text">loooom</span>
		</a>
		<div class="nav-right">
			<button class="btn-nav">Sign In</button>
		</div>
	</div>
</nav>

<!-- Profile Header -->
<section class="profile-header">
	<div class="profile-inner">
		<!-- Avatar -->
		<div class="avatar-ring">
			<div class="avatar">
				{profile.displayName[0]}
			</div>
			{#if profile.verified}
				<div class="verified-badge" title="Verified">✓</div>
			{/if}
		</div>

		<!-- The handwriting intro -->
		<div class="intro">
			<h1 class="handwriting">
				{profile.displayName}
				<span class="writes"> writes skills about</span>
			</h1>
			<div class="topics">
				{#each profile.topics as topic, i}
					<span class="topic">
						{topic}{#if i < profile.topics.length - 1}<span class="topic-sep">,&nbsp;</span>{/if}
					</span>
				{/each}
			</div>
		</div>

		<!-- Bio & meta -->
		<p class="bio">{profile.bio}</p>
		<div class="meta">
			<span class="meta-item">
				<strong>{profile.followers}</strong> followers
			</span>
			<span class="meta-dot">·</span>
			<span class="meta-item">
				<strong>{profile.skills.length}</strong> skills
			</span>
			<span class="meta-dot">·</span>
			<button class="follow-btn">Follow</button>
			<button class="tip-btn">💜 Tip</button>
		</div>
	</div>
</section>

<!-- Skills Section -->
<section class="skills-section">
	<div class="skills-inner">
		<div class="skills-list">
			<h2 class="section-label">Skills</h2>
			{#each profile.skills as skill, i}
				<button
					class="skill-card"
					class:active={activeSkill === i}
					onclick={() => selectSkill(i)}
				>
					<div class="skill-card-top">
						<span class="skill-category">{skill.category}</span>
						<span class="skill-installs">{skill.installs.toLocaleString()} installs</span>
					</div>
					<h3 class="skill-title">{skill.title}</h3>
					<p class="skill-desc">{skill.description}</p>
					<div class="skill-card-bottom">
						<span class="skill-version">v{skill.version}</span>
						<span class="skill-updated">{skill.updatedAt}</span>
					</div>
				</button>
			{/each}
		</div>

		<!-- Skill Detail / Code Viewer -->
		<div class="skill-detail">
			<div class="detail-header">
				<h2 class="detail-title">{profile.skills[activeSkill].title}</h2>
				<div class="detail-actions">
					<button class="install-btn">
						Install
						<span class="install-arrow">→</span>
					</button>
				</div>
			</div>

			<!-- File tabs -->
			<div class="file-tabs">
				{#each profile.skills[activeSkill].files as file, i}
					<button
						class="file-tab"
						class:active={activeFile === i}
						onclick={() => activeFile = i}
					>
						<span class="file-icon">{file.name.endsWith('.md') ? '📄' : file.name.endsWith('.sh') ? '⚡' : '🐍'}</span>
						{file.name}
					</button>
				{/each}
			</div>

			<!-- Code/content viewer -->
			<div class="code-viewer">
				<div class="code-header">
					<span class="code-filename">{profile.skills[activeSkill].files[activeFile].name}</span>
					<button class="code-copy" onclick={() => navigator.clipboard.writeText(profile.skills[activeSkill].files[activeFile].content)}>
						Copy
					</button>
				</div>
				<pre class="code-content"><code>{profile.skills[activeSkill].files[activeFile].content}</code></pre>
			</div>

			<!-- Version hash -->
			<div class="version-hash">
				<span class="hash-label">Content Hash</span>
				<span class="hash-value">sha256:7f3a...e2b1</span>
				<span class="hash-sep">·</span>
				<span class="hash-label">Version</span>
				<span class="hash-value">v{profile.skills[activeSkill].version}</span>
				<span class="hash-sep">·</span>
				<a href="#" class="hash-link">View all versions →</a>
			</div>
		</div>
	</div>
</section>

<style>
	/* ===== Ambient ===== */
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
		filter: blur(140px);
		opacity: 0.12;
	}
	.orb-1 {
		width: 500px; height: 500px;
		background: var(--accent);
		top: -100px; right: -100px;
		animation: drift 25s ease-in-out infinite;
	}
	.orb-2 {
		width: 400px; height: 400px;
		background: var(--yarn-pink);
		bottom: 10%; left: -100px;
		animation: drift 30s ease-in-out infinite reverse;
	}
	@keyframes drift {
		0%, 100% { transform: translate(0, 0); }
		50% { transform: translate(30px, -20px); }
	}

	/* ===== Nav ===== */
	nav {
		position: fixed;
		top: 0; left: 0; right: 0;
		z-index: 100;
		backdrop-filter: blur(20px);
		background: rgba(10, 10, 15, 0.8);
		border-bottom: 1px solid rgba(42, 42, 58, 0.5);
	}
	.nav-inner {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2rem;
		height: 64px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.logo {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--text-primary);
	}
	.logo:hover { color: var(--text-primary); }
	.logo-mark { font-size: 1.5rem; color: var(--accent); }
	.logo-text {
		font-family: var(--font-mono);
		font-size: 1.25rem;
		font-weight: 700;
		letter-spacing: -0.02em;
	}
	.nav-right { display: flex; align-items: center; gap: 1rem; }
	.btn-nav {
		background: var(--bg-card);
		color: var(--text-primary);
		border: 1px solid var(--border);
		padding: 0.5rem 1.25rem;
		border-radius: var(--radius-sm);
		font-family: var(--font-display);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}
	.btn-nav:hover {
		border-color: var(--accent);
		background: rgba(108, 92, 231, 0.1);
	}

	/* ===== Profile Header ===== */
	.profile-header {
		position: relative;
		z-index: 1;
		padding: 8rem 2rem 3rem;
	}
	.profile-inner {
		max-width: 800px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	/* Avatar */
	.avatar-ring {
		position: relative;
		margin-bottom: 2.5rem;
	}
	.avatar {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--accent), var(--yarn-pink));
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-serif);
		font-size: 2.5rem;
		font-weight: 700;
		color: white;
		box-shadow: 0 0 0 3px var(--bg-primary), 0 0 0 5px var(--accent);
	}
	.verified-badge {
		position: absolute;
		bottom: 2px;
		right: 2px;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: var(--accent);
		color: white;
		font-size: 0.8rem;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 3px solid var(--bg-primary);
	}

	/* Handwriting intro */
	.intro {
		margin-bottom: 1.5rem;
	}
	.handwriting {
		font-family: var(--font-handwriting);
		font-size: clamp(2.5rem, 5vw, 4rem);
		font-weight: 700;
		line-height: 1.2;
		color: var(--text-primary);
		letter-spacing: -0.01em;
	}
	.writes {
		font-weight: 500;
		color: var(--text-secondary);
	}
	.topics {
		display: inline;
		font-family: var(--font-handwriting);
		font-size: clamp(2.5rem, 5vw, 4rem);
		font-weight: 700;
		line-height: 1.3;
	}
	.topic {
		color: var(--text-primary);
		position: relative;
		display: inline;
		background-image: linear-gradient(to right, var(--accent), var(--yarn-pink));
		background-position: 0 92%;
		background-size: 100% 4px;
		background-repeat: no-repeat;
		padding-bottom: 2px;
	}
	.topic-sep {
		color: var(--text-muted);
		background: none;
	}

	/* Bio & meta */
	.bio {
		font-size: 1.1rem;
		color: var(--text-secondary);
		margin-bottom: 1.5rem;
		line-height: 1.6;
	}
	.meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
		justify-content: center;
	}
	.meta-item {
		font-size: 0.9rem;
		color: var(--text-secondary);
	}
	.meta-item strong {
		color: var(--text-primary);
		font-weight: 600;
	}
	.meta-dot {
		color: var(--text-muted);
	}
	.follow-btn {
		padding: 0.5rem 1.5rem;
		border-radius: 100px;
		background: var(--accent);
		color: white;
		border: none;
		font-family: var(--font-display);
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.25s;
	}
	.follow-btn:hover {
		background: var(--accent-bright);
		transform: translateY(-1px);
		box-shadow: 0 4px 20px rgba(108, 92, 231, 0.4);
	}
	.tip-btn {
		padding: 0.5rem 1.5rem;
		border-radius: 100px;
		background: transparent;
		color: var(--text-secondary);
		border: 1px solid var(--border);
		font-family: var(--font-display);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.25s;
	}
	.tip-btn:hover {
		border-color: var(--yarn-pink);
		color: var(--yarn-pink);
	}

	/* ===== Skills Section ===== */
	.skills-section {
		position: relative;
		z-index: 1;
		padding: 2rem 2rem 6rem;
	}
	.skills-inner {
		max-width: 1200px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 340px 1fr;
		gap: 2rem;
		align-items: start;
	}

	/* Skills list */
	.skills-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		position: sticky;
		top: 80px;
	}
	.section-label {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--text-muted);
		margin-bottom: 0.5rem;
	}
	.skill-card {
		text-align: left;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		padding: 1.25rem;
		cursor: pointer;
		transition: all 0.25s;
		font-family: var(--font-display);
	}
	.skill-card:hover {
		background: var(--bg-card-hover);
		border-color: rgba(108, 92, 231, 0.3);
	}
	.skill-card.active {
		border-color: var(--accent);
		background: rgba(108, 92, 231, 0.08);
		box-shadow: 0 0 0 1px var(--accent), 0 8px 30px rgba(108, 92, 231, 0.12);
	}
	.skill-card-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}
	.skill-category {
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--accent);
	}
	.skill-installs {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--text-muted);
	}
	.skill-title {
		font-size: 1.1rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
		color: var(--text-primary);
	}
	.skill-desc {
		font-size: 0.85rem;
		color: var(--text-secondary);
		line-height: 1.5;
		margin-bottom: 0.75rem;
	}
	.skill-card-bottom {
		display: flex;
		justify-content: space-between;
		font-size: 0.75rem;
		color: var(--text-muted);
	}
	.skill-version {
		font-family: var(--font-mono);
	}

	/* ===== Skill Detail ===== */
	.skill-detail {
		min-width: 0;
	}
	.detail-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}
	.detail-title {
		font-size: 1.75rem;
		font-weight: 800;
		letter-spacing: -0.02em;
	}
	.install-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.75rem;
		background: var(--accent);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-family: var(--font-display);
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.25s;
	}
	.install-btn:hover {
		background: var(--accent-bright);
		transform: translateY(-1px);
		box-shadow: 0 6px 24px rgba(108, 92, 231, 0.4);
	}
	.install-arrow {
		transition: transform 0.2s;
	}
	.install-btn:hover .install-arrow {
		transform: translateX(3px);
	}

	/* File tabs */
	.file-tabs {
		display: flex;
		gap: 0;
		border-bottom: 1px solid var(--border);
		margin-bottom: 0;
	}
	.file-tab {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.75rem 1.25rem;
		background: none;
		border: none;
		border-bottom: 2px solid transparent;
		color: var(--text-secondary);
		font-family: var(--font-mono);
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.2s;
	}
	.file-tab:hover {
		color: var(--text-primary);
		background: rgba(108, 92, 231, 0.05);
	}
	.file-tab.active {
		color: var(--accent-bright);
		border-bottom-color: var(--accent);
	}
	.file-icon {
		font-size: 0.9rem;
	}

	/* Code viewer */
	.code-viewer {
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-top: none;
		border-radius: 0 0 var(--radius-md) var(--radius-md);
		overflow: hidden;
	}
	.code-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1.25rem;
		border-bottom: 1px solid rgba(42, 42, 58, 0.5);
		background: rgba(108, 92, 231, 0.03);
	}
	.code-filename {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--text-muted);
	}
	.code-copy {
		background: none;
		border: 1px solid var(--border);
		color: var(--text-muted);
		font-family: var(--font-mono);
		font-size: 0.7rem;
		padding: 0.25rem 0.75rem;
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: all 0.2s;
	}
	.code-copy:hover {
		border-color: var(--accent);
		color: var(--accent-bright);
	}
	.code-content {
		padding: 1.5rem;
		font-family: var(--font-mono);
		font-size: 0.82rem;
		line-height: 1.7;
		color: var(--text-secondary);
		overflow-x: auto;
		margin: 0;
		tab-size: 2;
	}
	.code-content code {
		font-family: inherit;
	}

	/* Version hash */
	.version-hash {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 0;
		margin-top: 1rem;
		font-size: 0.75rem;
		flex-wrap: wrap;
	}
	.hash-label {
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-family: var(--font-mono);
		font-size: 0.65rem;
	}
	.hash-value {
		font-family: var(--font-mono);
		color: var(--text-secondary);
		background: var(--bg-card);
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		border: 1px solid var(--border);
	}
	.hash-sep { color: var(--text-muted); }
	.hash-link {
		font-family: var(--font-mono);
		font-size: 0.75rem;
	}

	/* ===== Responsive ===== */
	@media (max-width: 900px) {
		.skills-inner {
			grid-template-columns: 1fr;
		}
		.skills-list {
			position: static;
		}
	}
</style>
