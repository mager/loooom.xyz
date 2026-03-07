<script lang="ts">
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import YarnLogo from '$lib/components/YarnLogo.svelte';

	let { data } = $props();

	let activeSkill = $state(0);
	let activeFile = $state(0);
	let copiedCommand = $state<string | null>(null);

	function selectSkill(i: number) {
		activeSkill = i;
		activeFile = 0;
	}

	function relativeTime(iso: string): string {
		const diff = Date.now() - new Date(iso).getTime();
		const days = Math.floor(diff / 86400000);
		if (days < 1) return 'today';
		if (days === 1) return 'yesterday';
		if (days < 7) return `${days} days ago`;
		if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
		return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
	}

	function copyCommand(cmd: string) {
		navigator.clipboard.writeText(cmd);
		copiedCommand = cmd;
		setTimeout(() => copiedCommand = null, 2000);
	}

	function formatNumber(n: number): string {
		if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
		if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
		return n.toString();
	}
</script>

<svelte:head>
	<title>{data.user.displayName} — Loooom</title>
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
			<YarnLogo size={28} />
			<span class="logo-text">loooom</span>
		</a>
		<div class="nav-right">
			<ThemeToggle />
			<button class="btn-nav">Sign In</button>
		</div>
	</div>
</nav>

<!-- Profile Header -->
<section class="profile-header">
	<div class="profile-inner">
		<div class="avatar-ring">
			<div class="avatar">
				{#if data.user.avatarUrl}
					<img src={data.user.avatarUrl} alt={data.user.displayName} />
				{:else}
					{data.user.displayName[0]}
				{/if}
			</div>
			{#if data.user.username === 'loooom'}
				<div class="creator-badge" title="Loooom Community">🧶</div>
			{:else if data.user.verified}
				<div class="verified-badge" title="Verified">✓</div>
			{/if}
		</div>

		<div class="intro">
			<h1 class="handwriting">
				{data.user.displayName}
				<span class="writes"> writes skills about</span>
			</h1>
			<div class="topics">
				{#each data.user.topics as topic, i}
					<span class="topic">
						{topic}{#if i < data.user.topics.length - 1}<span class="topic-sep">,&nbsp;</span>{/if}
					</span>
				{/each}
			</div>
		</div>

		{#if data.user.bio}
			<p class="bio">{data.user.bio}</p>
		{/if}
		<div class="meta">
			<span class="meta-item">
				<strong>{data.skills.length}</strong> skill{data.skills.length !== 1 ? 's' : ''}
			</span>
			{#if data.user.source === 'skills.sh'}
				{@const totalInstalls = data.skills.reduce((sum, s) => sum + (s.installs || 0), 0)}
				<span class="meta-dot">·</span>
				<span class="meta-item">
					<strong>{formatNumber(totalInstalls)}</strong> installs
				</span>
			{/if}
			{#if data.user.source === 'loooom'}
				<span class="meta-dot">·</span>
				<button class="follow-btn">Follow</button>
				<button class="tip-btn">💜 Tip</button>
			{/if}
			{#if data.user.hasMeMd}
				<span class="meta-dot">·</span>
				<a href="/me/{data.user.username}" class="memd-link">me.md ↗</a>
			{/if}
		</div>
	</div>
</section>

<!-- External Marketplace Banner -->
{#if data.externalMarketplace}
<section class="marketplace-banner">
	<div class="marketplace-inner">
		<div class="marketplace-badge">🔗 External</div>
		<p class="marketplace-text">
			These skills are hosted on <strong>skills.sh</strong> — the open marketplace for Claude Code.
		</p>
		<a href={data.externalMarketplace.url} target="_blank" rel="noopener" class="marketplace-link">
			Visit {data.user.displayName} on skills.sh
			<span class="link-arrow">→</span>
		</a>
	</div>
</section>
{/if}

<!-- Skills Section -->
{#if data.skills.length > 0}
<section class="skills-section">
	<div class="skills-inner">
		<div class="skills-list">
			<h2 class="section-label">Skills</h2>
			{#each data.skills as skill, i}
				<button
					class="skill-card"
					class:active={activeSkill === i}
					onclick={() => selectSkill(i)}
				>
					<div class="skill-card-top">
						<span class="skill-category">{skill.category}</span>
						<span class="skill-installs">{skill.installs.toLocaleString()} uses</span>
					</div>
					<h3 class="skill-title">{skill.title}</h3>
					<p class="skill-desc">{skill.description}</p>
					<div class="skill-card-bottom">
						<span class="skill-version">v{skill.version}</span>
						<span class="skill-updated">{relativeTime(skill.updatedAt)}</span>
					</div>
				</button>
			{/each}
		</div>

		{#if data.skills[activeSkill]}
		<div class="skill-detail">
			<div class="detail-header">
				<div class="detail-title-wrap">
					{#if data.skills[activeSkill].emoji}
						<span class="detail-emoji">{data.skills[activeSkill].emoji}</span>
					{/if}
					<h2 class="detail-title">{data.skills[activeSkill].title}</h2>
				</div>
				<div class="detail-actions">
					{#if data.skills[activeSkill].source === 'skills.sh'}
						<a href={data.skills[activeSkill].externalUrl} target="_blank" rel="noopener" class="install-btn external">
							View on skills.sh
							<span class="install-arrow">→</span>
						</a>
					{:else if data.skills[activeSkill].externalUrl}
						<a href={data.skills[activeSkill].externalUrl} class="install-btn">
							View Plugin
							<span class="install-arrow">→</span>
						</a>
					{:else}
						<a href="/s/{data.user.username}/{data.skills[activeSkill].name}" class="install-btn">
							Use
							<span class="install-arrow">→</span>
						</a>
					{/if}
				</div>
			</div>

			{#if data.skills[activeSkill].source === 'skills.sh'}
				<!-- External skill: show install command -->
				<div class="install-command-box">
					<div class="install-command-header">
						<span class="install-label">Install in Claude Code</span>
					</div>
					<div class="install-command">
						<code>{data.skills[activeSkill].installCommand}</code>
						<button 
							class="copy-btn"
							onclick={() => copyCommand(data.skills[activeSkill].installCommand)}
						>
							{copiedCommand === data.skills[activeSkill].installCommand ? '✓ Copied' : 'Copy'}
						</button>
					</div>
				</div>

				<div class="external-note">
					<p>
						This skill is hosted externally on <a href="https://skills.sh" target="_blank" rel="noopener">skills.sh</a>.
						Install counts and documentation are synced from the source repository.
					</p>
				</div>
			{:else if data.skills[activeSkill].externalUrl && data.skills[activeSkill].installCommand}
				<!-- Loooom catalog plugin: show install command + link to plugin page -->
				<div class="install-command-box">
					<div class="install-command-header">
						<span class="install-label">Install in Claude Code</span>
					</div>
					<div class="install-command">
						<code>{data.skills[activeSkill].installCommand}</code>
						<button 
							class="copy-btn"
							onclick={() => copyCommand(data.skills[activeSkill].installCommand ?? '')}
						>
							{copiedCommand === data.skills[activeSkill].installCommand ? '✓ Copied' : 'Copy'}
						</button>
					</div>
				</div>
			{:else if data.skills[activeSkill].files?.length}
				<!-- Native skill: show file viewer -->
				<div class="file-tabs">
					{#each data.skills[activeSkill].files as file, i}
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

				<div class="code-viewer">
					<div class="code-header">
						<span class="code-filename">{data.skills[activeSkill].files[activeFile].name}</span>
						<button class="code-copy" onclick={() => navigator.clipboard.writeText(data.skills[activeSkill].files[activeFile].content)}>
							Copy
						</button>
					</div>
					<pre class="code-content"><code>{data.skills[activeSkill].files[activeFile].content}</code></pre>
				</div>

				<div class="version-hash">
					<span class="hash-label">Content Hash</span>
					<span class="hash-value">{data.skills[activeSkill].contentHash || 'sha256:...'}</span>
					<span class="hash-sep">·</span>
					<span class="hash-label">Version</span>
					<span class="hash-value">v{data.skills[activeSkill].version}</span>
				</div>
			{/if}
		</div>
		{/if}
	</div>
</section>
{/if}

<style>
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
		background: var(--ocean);
		bottom: 10%; left: -100px;
		animation: drift 30s ease-in-out infinite reverse;
	}
	@keyframes drift {
		0%, 100% { transform: translate(0, 0); }
		50% { transform: translate(30px, -20px); }
	}

	nav {
		position: fixed;
		top: 0; left: 0; right: 0;
		z-index: 100;
		backdrop-filter: blur(20px);
		background: var(--nav-bg, rgba(10, 10, 15, 0.8));
		border-bottom: 1px solid var(--border);
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
		font-family: var(--font-handwriting);
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
		border-color: var(--text-secondary);
		background: var(--bg-card-hover);
	}

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

	.avatar-ring {
		position: relative;
		margin-bottom: 2.5rem;
	}
	.avatar {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--accent), var(--ocean));
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-serif);
		font-size: 2.5rem;
		font-weight: 400;
		color: white;
		box-shadow: 0 0 0 3px var(--bg-primary), 0 0 0 5px var(--border);
		overflow: hidden;
	}
	.avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.verified-badge {
		position: absolute;
		bottom: 2px;
		right: 2px;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: var(--emerald);
		color: white;
		font-size: 0.8rem;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 3px solid var(--bg-primary);
	}
	.creator-badge {
		position: absolute;
		bottom: -2px;
		right: -2px;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: var(--bg-primary);
		font-size: 1.1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2px solid var(--border);
	}

	.intro { margin-bottom: 1.5rem; }
	.handwriting {
		font-family: var(--font-handwriting);
		font-size: clamp(2rem, 4vw, 3rem);
		font-weight: 100;
		line-height: 1.15;
		color: var(--text-primary);
		text-shadow: 0 0.5px 0 rgba(0, 0, 0, 0.06);
	}
	.writes {
		font-weight: 100;
		color: var(--text-secondary);
	}
	.topics {
		display: inline;
		font-family: var(--font-handwriting);
		font-size: clamp(2rem, 4vw, 3rem);
		font-weight: 200;
		line-height: 1.25;
		overflow-wrap: break-word;
		word-break: break-word;
	}
	.topic {
		color: var(--text-primary);
		position: relative;
		display: inline;
		background-image: linear-gradient(to right, var(--accent), var(--ocean));
		background-position: 0 92%;
		background-size: 100% var(--topic-underline-height, 4px);
		background-repeat: no-repeat;
		padding-bottom: 2px;
	}
	.topic-sep {
		color: var(--text-muted);
		background: none;
	}

	.bio {
		font-size: 1.1rem;
		color: var(--text-secondary);
		margin-bottom: 1.5rem;
		line-height: 1.4;
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
	.meta-dot { color: var(--text-muted); }
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
	:global(html[data-theme="dark"]) .follow-btn {
		color: var(--bg-primary);
	}
	.follow-btn:hover {
		background: var(--accent-bright);
		transform: translateY(-1px);
		box-shadow: 0 4px 20px rgba(45, 42, 62, 0.2);
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
		border-color: var(--ocean);
		color: var(--ocean);
	}
	.memd-link {
		padding: 0.4rem 1rem;
		border-radius: 100px;
		background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.08) 100%);
		border: 1px solid rgba(139, 92, 246, 0.3);
		color: var(--violet);
		font-size: 0.82rem;
		font-weight: 600;
		font-style: italic;
		text-decoration: none;
		transition: all 0.2s;
	}
	.memd-link:hover {
		background: linear-gradient(135deg, rgba(139, 92, 246, 0.18) 0%, rgba(6, 182, 212, 0.14) 100%);
		border-color: var(--violet);
	}

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
		border-color: var(--text-muted);
	}
	.skill-card.active {
		border-color: var(--accent);
		background: var(--bg-card-hover);
		box-shadow: 0 0 0 1px var(--accent), var(--card-shadow-hover);
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
		letter-spacing: 0.15em;
		color: var(--text-muted);
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
		line-height: 1.25;
		margin-bottom: 0.75rem;
	}
	.skill-card-bottom {
		display: flex;
		justify-content: space-between;
		font-size: 0.75rem;
		color: var(--text-muted);
	}
	.skill-version { font-family: var(--font-mono); }

	.skill-detail { min-width: 0; }
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
		text-decoration: none;
	}
	.install-btn:hover {
		background: var(--accent-bright);
		transform: translateY(-1px);
		box-shadow: 0 6px 24px rgba(45, 42, 62, 0.2);
	}
	:global(html[data-theme="dark"]) .install-btn {
		color: var(--bg-primary);
	}
	.install-arrow { transition: transform 0.2s; }
	.install-btn:hover .install-arrow { transform: translateX(3px); }

	.file-tabs {
		display: flex;
		gap: 0;
		border-bottom: 1px solid var(--border);
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
		background: var(--bg-card-hover);
	}
	.file-tab.active {
		color: var(--text-primary);
		border-bottom-color: var(--accent);
	}
	.file-icon { font-size: 0.9rem; }

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
		border-bottom: 1px solid var(--border);
		background: var(--bg-secondary);
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
		border-color: var(--text-secondary);
		color: var(--text-primary);
	}
	.code-content {
		padding: 1.5rem;
		font-family: var(--font-mono);
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--text-secondary);
		overflow-x: auto;
		margin: 0;
		tab-size: 2;
		white-space: pre-wrap;
		word-wrap: break-word;
		overflow-wrap: break-word;
	}
	.code-content code { font-family: inherit; }

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

	/* Marketplace Banner */
	.marketplace-banner {
		position: relative;
		z-index: 1;
		padding: 0 2rem 2rem;
	}
	.marketplace-inner {
		max-width: 800px;
		margin: 0 auto;
		background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 1.5rem 2rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
		flex-wrap: wrap;
	}
	.marketplace-badge {
		background: var(--accent);
		color: white;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		padding: 0.35rem 0.75rem;
		border-radius: 100px;
		white-space: nowrap;
	}
	:global(html[data-theme="dark"]) .marketplace-badge {
		color: var(--bg-primary);
	}
	.marketplace-text {
		flex: 1;
		font-size: 0.95rem;
		color: var(--text-secondary);
		margin: 0;
		min-width: 200px;
	}
	.marketplace-text strong {
		color: var(--text-primary);
	}
	.marketplace-link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		color: var(--accent);
		font-family: var(--font-display);
		font-size: 0.9rem;
		font-weight: 600;
		text-decoration: none;
		white-space: nowrap;
	}
	.marketplace-link:hover .link-arrow {
		transform: translateX(3px);
	}
	.link-arrow {
		transition: transform 0.2s;
	}

	/* Install Command Box */
	.install-command-box {
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		overflow: hidden;
		margin-bottom: 1.5rem;
	}
	.install-command-header {
		padding: 0.75rem 1.25rem;
		background: var(--bg-secondary);
		border-bottom: 1px solid var(--border);
	}
	.install-label {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
	}
	.install-command {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 1.25rem;
		background: #1a1a2e;
	}
	.install-command code {
		font-family: var(--font-mono);
		font-size: 0.9rem;
		color: #a5b4fc;
		background: none;
	}
	.copy-btn {
		background: var(--accent);
		color: white;
		border: none;
		padding: 0.4rem 0.9rem;
		border-radius: var(--radius-sm);
		font-family: var(--font-display);
		font-size: 0.8rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}
	:global(html[data-theme="dark"]) .copy-btn {
		color: var(--bg-primary);
	}
	.copy-btn:hover {
		background: var(--accent-bright);
	}

	/* External Note */
	.external-note {
		padding: 1rem;
		background: var(--bg-secondary);
		border-radius: var(--radius-md);
		font-size: 0.85rem;
		color: var(--text-muted);
		line-height: 1.5;
	}
	.external-note a {
		color: var(--accent);
		text-decoration: none;
	}
	.external-note a:hover {
		text-decoration: underline;
	}

	/* Detail Title with Emoji */
	.detail-title-wrap {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}
	.detail-emoji {
		font-size: 1.5rem;
	}

	/* External Install Button */
	.install-btn.external {
		background: transparent;
		border: 2px solid var(--accent);
		color: var(--accent);
	}
	.install-btn.external:hover {
		background: var(--accent);
		color: white;
	}
	:global(html[data-theme="dark"]) .install-btn.external:hover {
		color: var(--bg-primary);
	}

	@media (max-width: 900px) {
		.skills-inner {
			grid-template-columns: 1fr;
		}
		.skills-list { position: static; }
	}
</style>
