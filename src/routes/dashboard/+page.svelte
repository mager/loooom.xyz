<script lang="ts">
	import YarnLogo from '$lib/components/YarnLogo.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { enhance } from '$app/forms';
	import { parseMeMd, generateInjectionPrompt, KNOWN_SECTIONS } from '$lib/memd';

	let { data } = $props();

	const handle = data.profile.username;
	const profileUrl = `https://loooom.xyz/me/${handle}`;
	const rawUrl = `https://loooom.xyz/me/${handle}/raw`;

	const parsed = $derived(data.profile.meMd ? parseMeMd(data.profile.meMd) : null);
	const hasMeMd = $derived(!!data.profile.meMd);

	const agentCount = $derived(parsed?.frontmatter.agents?.length ?? 0);
	const sectionCount = $derived(parsed?.sections.length ?? 0);
	const tagsCount = $derived(parsed?.frontmatter.tags?.length ?? 0);
	const lastUpdated = $derived(parsed?.frontmatter.updated ?? null);

	const filledSections = $derived(
		KNOWN_SECTIONS.filter(s =>
			parsed?.sections.some(ps => ps.id === s.id && ps.content.trim().length > 0)
		)
	);

	let copiedUrl = $state(false);
	let copiedRaw = $state(false);
	let copiedPrompt = $state(false);

	function copyProfileUrl() {
		navigator.clipboard.writeText(profileUrl);
		copiedUrl = true;
		setTimeout(() => (copiedUrl = false), 2000);
	}

	function copyRawUrl() {
		navigator.clipboard.writeText(rawUrl);
		copiedRaw = true;
		setTimeout(() => (copiedRaw = false), 2000);
	}

	function copyInjectionPrompt() {
		const prompt = generateInjectionPrompt(`@${handle}`, rawUrl);
		navigator.clipboard.writeText(prompt);
		copiedPrompt = true;
		setTimeout(() => (copiedPrompt = false), 2000);
	}
</script>

<svelte:head>
	<title>Dashboard — Loooom</title>
</svelte:head>

<div class="ambient">
	<div class="orb orb-1"></div>
	<div class="orb orb-2"></div>
</div>

<!-- Nav -->
<nav>
	<div class="nav-inner">
		<a href="/" class="logo">
			<YarnLogo size={22} />
			<span class="logo-text">loooom</span>
		</a>
		<div class="nav-right">
			<ThemeToggle />
			<div class="user-chip">
				{#if data.profile.avatarUrl}
					<img src={data.profile.avatarUrl} alt="" class="user-chip-avatar" />
				{:else}
					<span class="user-chip-initial">{data.profile.displayName[0]}</span>
				{/if}
				<span class="user-chip-name">@{handle}</span>
			</div>
		</div>
	</div>
</nav>

<main class="dashboard">
	<div class="dashboard-inner">

		<!-- Header -->
		<header class="dash-header">
			<div class="dash-greeting">
				<h1>Hey, {data.profile.displayName.split(' ')[0]}. 👋</h1>
				<p class="dash-sub">Your ME.md is your context. Keep it sharp.</p>
			</div>
			<a href="/me/edit" class="btn-primary">
				{hasMeMd ? 'Edit ME.md →' : 'Write your ME.md →'}
			</a>
		</header>

		{#if hasMeMd}
			<!-- ME.md Status Card -->
			<section class="me-card">
				<div class="me-card-top">
					<div class="me-title-row">
						<span class="me-badge">ME.md</span>
						<span class="me-handle">@{handle}</span>
						{#if lastUpdated}
							<span class="me-updated">updated {lastUpdated}</span>
						{/if}
					</div>
					<div class="me-stats">
						<div class="stat">
							<span class="stat-num">{agentCount}</span>
							<span class="stat-label">agent{agentCount !== 1 ? 's' : ''}</span>
						</div>
						<div class="stat-divider"></div>
						<div class="stat">
							<span class="stat-num">{sectionCount}</span>
							<span class="stat-label">sections</span>
						</div>
						<div class="stat-divider"></div>
						<div class="stat">
							<span class="stat-num">{tagsCount}</span>
							<span class="stat-label">tags</span>
						</div>
					</div>
				</div>

				<!-- Section completeness -->
				<div class="sections-check">
					{#each KNOWN_SECTIONS as s}
						{@const filled = filledSections.some(fs => fs.id === s.id)}
						<div class="section-pill" class:filled>
							<span>{s.icon}</span>
							<span class="pill-name">{s.title}</span>
							<span class="pill-check">{filled ? '✓' : '◎'}</span>
						</div>
					{/each}
				</div>

				<!-- URLs / Actions -->
				<div class="me-actions">
					<div class="url-row">
						<code class="url-display">{profileUrl}</code>
						<button class="btn-copy" onclick={copyProfileUrl}>
							{copiedUrl ? '✓' : 'Copy'}
						</button>
						<a href={profileUrl} target="_blank" rel="noopener" class="btn-copy">View ↗</a>
					</div>
					<div class="url-row">
						<code class="url-display">{rawUrl}</code>
						<button class="btn-copy" onclick={copyRawUrl}>
							{copiedRaw ? '✓' : 'Copy raw'}
						</button>
					</div>
					<div class="prompt-row">
						<div class="prompt-label">
							<span class="prompt-icon">🤖</span>
							<span>Injection prompt — paste into any AI system prompt</span>
						</div>
						<button class="btn-inject" onclick={copyInjectionPrompt}>
							{copiedPrompt ? '✓ Copied!' : 'Copy injection prompt'}
						</button>
					</div>
				</div>
			</section>

			<!-- Agent Fleet -->
			{#if agentCount > 0}
				<section class="fleet-section">
					<h2 class="section-title">🤖 Your Fleet</h2>
					<div class="fleet-grid">
						{#each parsed?.frontmatter.agents ?? [] as agent}
							<div class="agent-card">
								<div class="agent-emoji">{agent.emoji ?? '🤖'}</div>
								<div class="agent-info">
									<span class="agent-id">{agent.id}</span>
									{#if agent.role}<span class="agent-role">{agent.role}</span>{/if}
									{#if agent.model}<span class="agent-model">{agent.model}</span>{/if}
								</div>
								{#if agent.channel}
									<span class="agent-channel">{agent.channel}</span>
								{/if}
							</div>
						{/each}
					</div>
				</section>
			{/if}

		{:else}
			<!-- Empty state -->
			<section class="empty-state">
				<div class="empty-icon">📄</div>
				<h2>You don't have a ME.md yet.</h2>
				<p>
					One file at a public URL. Any AI can fetch it. Every tool you use will know who you are
					before you say a word.
				</p>
				<a href="/me/edit" class="btn-primary">Write your ME.md →</a>
				<a href="/me" class="btn-ghost">Learn more about ME.md</a>
			</section>
		{/if}

		<!-- Skills Section -->
		<section class="skills-section">
			<div class="skills-header">
				<h2 class="section-title">🧶 My Skills</h2>
				<a href="/create" class="btn-new-skill">+ New Skill</a>
			</div>

			{#if data.skills.length === 0}
				<div class="skills-empty">
					<div class="skills-empty-icon">✍️</div>
					<p>You haven't published any skills yet.</p>
					<a href="/create" class="btn-primary">Write your first skill →</a>
				</div>
			{:else}
				<div class="skills-list">
					{#each data.skills as skill}
						<div class="skill-row">
							<div class="skill-row-left">
								<div class="skill-name-row">
									<a href="/s/{handle}/{skill.name}" class="skill-title-link">{skill.title}</a>
									<span class="skill-slug">/{handle}/{skill.name}</span>
								</div>
								<div class="skill-meta-row">
									{#if skill.category}
										<span class="skill-cat-badge">{skill.category}</span>
									{/if}
									{#if skill.currentVersion}
										<span class="skill-version">v{skill.currentVersion}</span>
									{/if}
									<span class="skill-installs">⬇ {skill.installs}</span>
									<span class={`skill-status ${skill.isPublished ? 'published' : 'draft'}`}>
										{skill.isPublished ? 'Live' : 'Draft'}
									</span>
								</div>
								{#if skill.description}
									<p class="skill-desc">{skill.description}</p>
								{/if}
							</div>
							<div class="skill-row-actions">
								<a href="/edit/{skill.id}" class="skill-action-btn">Edit</a>
								<form method="POST" action="?/togglePublish" use:enhance>
									<input type="hidden" name="skillId" value={skill.id} />
									<button type="submit" class="skill-action-btn">
										{skill.isPublished ? 'Unpublish' : 'Publish'}
									</button>
								</form>
								<form method="POST" action="?/deleteSkill" use:enhance
									onsubmit={(e) => { if (!confirm(`Delete "${skill.title}"? This can't be undone.`)) e.preventDefault(); }}>
									<input type="hidden" name="skillId" value={skill.id} />
									<button type="submit" class="skill-action-btn danger">Delete</button>
								</form>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</section>

		<!-- Quick links -->
		<section class="quick-links">
			<a href="/me/edit" class="quick-link">
				<span class="ql-icon">✏️</span>
				<span class="ql-text">Edit ME.md</span>
			</a>
			<a href={`/me/${handle}`} target="_blank" class="quick-link">
				<span class="ql-icon">👤</span>
				<span class="ql-text">View profile</span>
			</a>
			<a href="/me/spec" class="quick-link">
				<span class="ql-icon">📐</span>
				<span class="ql-text">ME.md spec</span>
			</a>
			<a href={rawUrl} target="_blank" class="quick-link">
				<span class="ql-icon">⚡</span>
				<span class="ql-text">Raw (for AIs)</span>
			</a>
		</section>

	</div>
</main>

<style>
	/* ─── Ambient ─────────────────────────────────────────────────────────── */
	.ambient {
		position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden;
	}
	.orb {
		position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.13;
	}
	.orb-1 {
		width: 500px; height: 500px;
		background: radial-gradient(circle, var(--violet) 0%, transparent 70%);
		top: -100px; left: -50px;
	}
	.orb-2 {
		width: 400px; height: 400px;
		background: radial-gradient(circle, var(--ocean) 0%, transparent 70%);
		bottom: 10%; right: -100px;
	}

	/* ─── Nav ─────────────────────────────────────────────────────────────── */
	nav {
		position: sticky; top: 0; z-index: 100;
		background: var(--nav-bg); backdrop-filter: blur(12px);
		border-bottom: 1px solid var(--border);
	}
	.nav-inner {
		max-width: 900px; margin: 0 auto; padding: 14px 32px;
		display: flex; align-items: center; justify-content: space-between;
	}
	.logo {
		display: flex; align-items: center; gap: 8px;
		text-decoration: none; color: var(--text-primary);
	}
	.logo-text { font-family: var(--font-handwriting); font-size: 1.2rem; font-weight: 200; }
	.nav-right { display: flex; align-items: center; gap: 16px; }
	.user-chip {
		display: flex; align-items: center; gap: 8px;
		background: var(--bg-card); border: 1px solid var(--border);
		padding: 5px 12px 5px 6px; border-radius: 999px;
	}
	.user-chip-avatar { width: 22px; height: 22px; border-radius: 50%; object-fit: cover; }
	.user-chip-initial {
		width: 22px; height: 22px; border-radius: 50%;
		background: var(--accent-glow); border: 1px solid var(--accent-bright);
		color: var(--accent); font-size: 0.75rem; font-weight: 700;
		display: flex; align-items: center; justify-content: center;
	}
	.user-chip-name { font-size: 0.85rem; color: var(--text-secondary); }

	/* ─── Dashboard ───────────────────────────────────────────────────────── */
	.dashboard { position: relative; z-index: 1; padding: 48px 32px 80px; }
	.dashboard-inner { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 28px; }

	/* ─── Header ──────────────────────────────────────────────────────────── */
	.dash-header {
		display: flex; align-items: center; justify-content: space-between; gap: 20px;
	}
	.dash-header h1 { font-size: 2rem; margin: 0 0 4px; }
	.dash-sub { color: var(--text-secondary); margin: 0; font-size: 1rem; }

	/* ─── Buttons ─────────────────────────────────────────────────────────── */
	.btn-primary {
		background: var(--gradient-cta); color: white;
		padding: 12px 24px; border-radius: 999px;
		font-weight: 600; font-size: 0.95rem;
		text-decoration: none; display: inline-block;
		transition: opacity 0.2s; border: none; cursor: pointer; white-space: nowrap;
	}
	.btn-primary:hover { opacity: 0.88; }
	.btn-ghost {
		background: none; border: 1px solid var(--border); color: var(--text-secondary);
		padding: 10px 20px; border-radius: 999px; font-size: 0.9rem;
		cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-block;
	}
	.btn-ghost:hover { border-color: var(--accent); color: var(--accent); }
	.btn-copy {
		background: var(--bg-secondary); border: 1px solid var(--border);
		color: var(--text-secondary); padding: 5px 12px;
		border-radius: 6px; font-size: 0.8rem; cursor: pointer;
		transition: all 0.2s; white-space: nowrap; text-decoration: none;
		display: inline-block;
	}
	.btn-copy:hover { border-color: var(--accent); color: var(--accent); }
	.btn-inject {
		background: var(--accent-glow); border: 1px solid var(--accent-bright);
		color: var(--accent); padding: 8px 16px;
		border-radius: 8px; font-size: 0.85rem; font-weight: 600;
		cursor: pointer; transition: all 0.2s; white-space: nowrap;
	}
	.btn-inject:hover { background: var(--accent); color: white; }

	/* ─── ME.md Card ──────────────────────────────────────────────────────── */
	.me-card {
		background: var(--bg-card); border: 1px solid var(--border);
		border-radius: var(--radius-lg); overflow: hidden;
	}
	.me-card-top {
		padding: 24px 24px 20px;
		border-bottom: 1px solid var(--border);
		display: flex; align-items: center; justify-content: space-between; gap: 16px;
		flex-wrap: wrap;
	}
	.me-title-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
	.me-badge {
		font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700;
		background: var(--accent-glow); border: 1px solid var(--accent-bright);
		color: var(--accent); padding: 3px 10px; border-radius: 999px;
	}
	.me-handle { font-family: var(--font-mono); font-size: 1rem; color: var(--text-primary); }
	.me-updated { font-size: 0.8rem; color: var(--text-muted); }
	.me-stats { display: flex; align-items: center; gap: 16px; }
	.stat { text-align: center; }
	.stat-num { display: block; font-size: 1.5rem; font-weight: 700; color: var(--text-primary); line-height: 1; }
	.stat-label { font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; }
	.stat-divider { width: 1px; height: 32px; background: var(--border); }

	/* ─── Section completeness ────────────────────────────────────────────── */
	.sections-check {
		padding: 16px 24px;
		border-bottom: 1px solid var(--border);
		display: flex; gap: 8px; flex-wrap: wrap;
	}
	.section-pill {
		display: flex; align-items: center; gap: 5px;
		background: var(--bg-secondary); border: 1px solid var(--border);
		padding: 5px 10px; border-radius: 999px; font-size: 0.8rem;
		color: var(--text-muted); transition: all 0.2s;
	}
	.section-pill.filled {
		background: var(--accent-glow); border-color: var(--accent-bright);
		color: var(--text-primary);
	}
	.pill-check { font-size: 0.7rem; }
	.section-pill.filled .pill-check { color: var(--accent); }

	/* ─── ME.md Actions ───────────────────────────────────────────────────── */
	.me-actions { padding: 20px 24px; display: flex; flex-direction: column; gap: 12px; }
	.url-row {
		display: flex; align-items: center; gap: 8px;
		background: var(--bg-secondary); border: 1px solid var(--border);
		border-radius: 8px; padding: 8px 12px;
	}
	.url-display {
		flex: 1; font-family: var(--font-mono); font-size: 0.8rem;
		color: var(--text-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
	}
	.prompt-row {
		display: flex; align-items: center; justify-content: space-between; gap: 12px;
		background: var(--bg-secondary); border: 1px solid var(--border);
		border-radius: 8px; padding: 12px 16px; flex-wrap: wrap;
	}
	.prompt-label { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-secondary); }
	.prompt-icon { font-size: 1rem; }

	/* ─── Fleet ───────────────────────────────────────────────────────────── */
	.fleet-section {}
	.section-title { font-size: 1.1rem; margin: 0 0 14px; color: var(--text-secondary); font-weight: 600; }
	.fleet-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
	.agent-card {
		background: var(--bg-card); border: 1px solid var(--border);
		border-radius: var(--radius-md); padding: 16px;
		display: flex; align-items: flex-start; gap: 12px;
		transition: border-color 0.2s;
	}
	.agent-card:hover { border-color: var(--accent); }
	.agent-emoji { font-size: 1.6rem; flex-shrink: 0; }
	.agent-info { flex: 1; min-width: 0; }
	.agent-id { display: block; font-family: var(--font-mono); font-size: 0.9rem; font-weight: 600; color: var(--text-primary); }
	.agent-role { display: block; font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px; }
	.agent-model { display: block; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); margin-top: 4px; }
	.agent-channel {
		font-size: 0.72rem; color: var(--accent);
		background: var(--accent-glow); border: 1px solid var(--accent-bright);
		padding: 2px 8px; border-radius: 999px; white-space: nowrap; align-self: flex-start;
	}

	/* ─── Empty state ─────────────────────────────────────────────────────── */
	.empty-state {
		background: var(--bg-card); border: 1px solid var(--border);
		border-radius: var(--radius-lg); padding: 60px 32px;
		text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px;
	}
	.empty-icon { font-size: 3rem; }
	.empty-state h2 { margin: 0; font-size: 1.4rem; }
	.empty-state p { color: var(--text-secondary); max-width: 400px; line-height: 1.6; margin: 0; }

	/* ─── Quick Links ─────────────────────────────────────────────────────── */
	.quick-links {
		display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px;
	}
	.quick-link {
		background: var(--bg-card); border: 1px solid var(--border);
		border-radius: var(--radius-md); padding: 16px;
		text-decoration: none; display: flex; flex-direction: column; gap: 8px;
		transition: all 0.2s;
	}
	.quick-link:hover { border-color: var(--accent); box-shadow: var(--card-shadow-hover); }
	.ql-icon { font-size: 1.4rem; }
	.ql-text { font-size: 0.85rem; color: var(--text-secondary); font-weight: 500; }

	/* ─── Skills Section ─────────────────────────────────────────────────────── */
	.skills-section {}

	.skills-header {
		display: flex; align-items: center; justify-content: space-between;
		margin-bottom: 14px;
	}

	.btn-new-skill {
		display: inline-flex; align-items: center; gap: 6px;
		padding: 8px 18px;
		background: var(--gradient-cta); color: white;
		border-radius: 999px; font-weight: 700; font-size: 0.85rem;
		text-decoration: none; transition: opacity 0.2s;
		white-space: nowrap;
	}
	.btn-new-skill:hover { opacity: 0.88; }

	.skills-empty {
		background: var(--bg-card); border: 1px dashed var(--border);
		border-radius: var(--radius-lg); padding: 40px 24px;
		text-align: center; display: flex; flex-direction: column;
		align-items: center; gap: 12px;
	}
	.skills-empty-icon { font-size: 2.5rem; }
	.skills-empty p { color: var(--text-secondary); margin: 0; font-size: 0.95rem; }

	.skills-list {
		display: flex; flex-direction: column;
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		overflow: hidden;
	}

	.skill-row {
		display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
		padding: 16px 20px;
		background: var(--bg-card);
		transition: background 0.15s;
	}
	.skill-row + .skill-row { border-top: 1px solid var(--border); }
	.skill-row:hover { background: var(--bg-secondary); }

	.skill-row-left { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }

	.skill-name-row { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
	.skill-title-link {
		font-weight: 700; font-size: 0.95rem; color: var(--text-primary);
		text-decoration: none; transition: color 0.15s;
	}
	.skill-title-link:hover { color: var(--accent); }
	.skill-slug {
		font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted);
	}

	.skill-meta-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
	.skill-cat-badge {
		font-family: var(--font-mono); font-size: 0.62rem; font-weight: 700;
		text-transform: uppercase; letter-spacing: 0.07em;
		background: var(--bg-secondary); border: 1px solid var(--border);
		color: var(--text-muted); padding: 2px 8px; border-radius: 4px;
	}
	.skill-version {
		font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-muted);
	}
	.skill-installs {
		font-size: 0.72rem; color: var(--text-muted);
	}
	.skill-status {
		font-family: var(--font-mono); font-size: 0.62rem; font-weight: 700;
		text-transform: uppercase; letter-spacing: 0.07em;
		padding: 2px 8px; border-radius: 4px;
	}
	.skill-status.published {
		color: #16a34a; background: rgba(22, 163, 74, 0.1); border: 1px solid rgba(22, 163, 74, 0.25);
	}
	.skill-status.draft {
		color: var(--text-muted); background: var(--bg-secondary); border: 1px solid var(--border);
	}
	.skill-desc {
		font-size: 0.82rem; color: var(--text-muted); margin: 0;
		white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
	}

	.skill-row-actions {
		display: flex; align-items: center; gap: 6px; flex-shrink: 0; flex-wrap: wrap;
	}
	.skill-row-actions form { margin: 0; }
	.skill-action-btn {
		display: inline-block;
		padding: 5px 12px;
		background: var(--bg-secondary); border: 1px solid var(--border);
		border-radius: 6px; font-size: 0.78rem; font-weight: 600;
		color: var(--text-secondary); cursor: pointer;
		text-decoration: none; transition: all 0.15s; white-space: nowrap;
	}
	.skill-action-btn:hover { border-color: var(--accent); color: var(--accent); }
	.skill-action-btn.danger:hover { border-color: #ef4444; color: #ef4444; }

	/* ─── Responsive ──────────────────────────────────────────────────────── */
	@media (max-width: 640px) {
		.dashboard { padding: 32px 16px 60px; }
		.dash-header { flex-direction: column; align-items: flex-start; }
		.me-card-top { flex-direction: column; align-items: flex-start; }
		.prompt-row { flex-direction: column; align-items: flex-start; }
		.skill-row { flex-direction: column; }
		.skill-row-actions { width: 100%; justify-content: flex-start; }
	}
</style>
