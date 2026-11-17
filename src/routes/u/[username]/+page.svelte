<script lang="ts">

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


	const meMdValueSections = $derived(
		data.meMd?.sections.filter((s) => s.id === 'my-values' || s.id === 'the-heart').slice(0, 1) ?? []
	);
</script>

<svelte:head>
	<title>{data.user.displayName} — Loooom</title>
</svelte:head>

<section class="profile-header">
	<div class="profile-inner">
		<div class="avatar-ring">
			<div class="avatar">
				{#if data.user.avatarUrl}<img src={data.user.avatarUrl} alt={data.user.displayName} />
				{:else}{data.user.displayName[0]}{/if}
			</div>
			{#if data.user.username === 'loooom'}<div class="creator-badge" title="Loooom Community">🧶</div>
			{:else if data.user.verified}<div class="verified-badge" title="Verified">✓</div>{/if}
		</div>
		<div class="intro">
			<h1 class="handwriting">{data.user.displayName}&nbsp;<span class="writes">writes skills about</span></h1>
			<div class="topics">
				{#each data.user.topics as topic, i}<span class="topic">{topic}{#if i < data.user.topics.length - 1}<span class="topic-sep">,&nbsp;</span>{/if}</span>{/each}
			</div>
		</div>
		{#if data.user.bio}<p class="bio">{data.user.bio}</p>{/if}
		<div class="meta">
			<span class="meta-item"><strong>{data.skills.length}</strong> skill{data.skills.length !== 1 ? 's' : ''}</span>
			<span class="meta-dot">·</span>
			<span class="meta-item"><strong>{formatNumber(data.user.totalInstalls)}</strong> uses</span>
			{#if data.user.source === 'loooom'}<span class="meta-dot">·</span><button class="follow-btn">Follow</button>{/if}
		</div>
		{#if data.user.isOwnProfile}
			<div class="owner-actions">
				<a href="/create" class="btn-primary">Publish New Skill →</a>
				<a href="/me/edit" class="btn-ghost">{#if data.user.hasMeMd}Edit{:else}Create{/if} ME.md</a>
			</div>
		{/if}
	</div>
</section>

{#if data.externalMarketplace}
<section class="marketplace-banner">
	<div class="marketplace-inner">
		<div class="marketplace-badge">External</div>
		<p class="marketplace-text">These skills are hosted on <strong>skills.sh</strong> — the open marketplace for Claude Code.</p>
		<a href={data.externalMarketplace.url} target="_blank" rel="noopener" class="marketplace-link">Visit {data.user.displayName} on skills.sh <span class="link-arrow">→</span></a>
	</div>
</section>
{/if}

{#if data.skills.length > 0}
<section class="skills-section">
	<div class="skills-inner">
		<div class="skills-list">
			<h2 class="section-label">Skills</h2>
			{#each data.skills as skill, i}
				<button class="skill-card" class:active={activeSkill === i} aria-pressed={activeSkill === i} onclick={() => selectSkill(i)}>
					<div class="skill-card-top">
						{#if skill.category}<span class="category-chip">{skill.category}</span>{/if}
						<span class="skill-installs">{skill.installs.toLocaleString()} uses</span>
					</div>
					<h3 class="skill-title">{skill.title}</h3>
					<p class="skill-desc">{skill.description}</p>
					<div class="skill-card-bottom"><span class="skill-version">v{skill.version}</span><span class="skill-updated">{relativeTime(skill.updatedAt)}</span></div>
				</button>
			{/each}
		</div>
		{#if data.skills[activeSkill]}
		<div class="skill-detail">
			<div class="detail-header">
				<div class="detail-title-wrap">
					{#if data.skills[activeSkill].emoji}<span class="detail-emoji">{data.skills[activeSkill].emoji}</span>{/if}
					<h2 class="detail-title">{data.skills[activeSkill].title}</h2>
				</div>
				<div class="detail-actions">
					{#if data.skills[activeSkill].source === 'skills.sh'}
						<a href={data.skills[activeSkill].externalUrl} target="_blank" rel="noopener" class="install-btn external">View on skills.sh <span class="install-arrow">→</span></a>
					{:else if data.skills[activeSkill].externalUrl}
						<a href={data.skills[activeSkill].externalUrl} class="install-btn">View Plugin <span class="install-arrow">→</span></a>
					{:else}
						<a href="/s/{data.user.username}/{data.skills[activeSkill].name}" class="install-btn">Use Skill <span class="install-arrow">→</span></a>
					{/if}
				</div>
			</div>
			{#if data.skills[activeSkill].source === 'skills.sh'}
				<div class="install-command-box">
					<div class="install-command-header"><span class="install-label">Install in Claude Code</span></div>
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
				<div class="external-note"><p>This skill is hosted externally on <a href="https://skills.sh" target="_blank" rel="noopener">skills.sh</a>.</p></div>
			{:else if data.skills[activeSkill].externalUrl && data.skills[activeSkill].installCommand}
				<div class="install-command-box">
					<div class="install-command-header"><span class="install-label">Install in Claude Code</span></div>
					<div class="install-command">
						<code>{data.skills[activeSkill].installCommand}</code>
						<button class="copy-btn" onclick={() => copyCommand(data.skills[activeSkill].installCommand ?? '')}>{copiedCommand === data.skills[activeSkill].installCommand ? '✓ Copied' : 'Copy'}</button>
					</div>
				</div>
			{:else if data.skills[activeSkill].files?.length}
				<div class="file-tabs">
					{#each data.skills[activeSkill].files as file, i}<button class="file-tab" class:active={activeFile === i} aria-pressed={activeFile === i} onclick={() => activeFile = i}>{file.name}</button>{/each}
				</div>
				<div class="code-viewer">
					<div class="code-header"><span class="code-filename">{data.skills[activeSkill].files[activeFile].name}</span><button class="code-copy" onclick={() => navigator.clipboard.writeText(data.skills[activeSkill].files[activeFile].content)}>Copy</button></div>
					<pre class="code-content"><code>{data.skills[activeSkill].files[activeFile].content}</code></pre>
				</div>
				<div class="version-hash"><span class="hash-label">Content Hash</span><span class="hash-value">{data.skills[activeSkill].contentHash || 'sha256:...'}</span><span class="hash-sep">·</span><span class="hash-label">Version</span><span class="hash-value">v{data.skills[activeSkill].version}</span></div>
			{/if}
		</div>
		{/if}
	</div>
</section>
{:else}
<section class="empty-state">
	<div class="empty-inner">
		<div class="empty-icon">🧶</div>
		<h3>No skills yet</h3>
		{#if data.user.isOwnProfile}<p>Publish your first skill to get started.</p><a href="/create" class="btn-primary">Create a Skill →</a>
		{:else}<p>This creator hasn't published any skills yet.</p>{/if}
	</div>
</section>
{/if}

{#if data.meMd}
<section class="memd-section">
	<div class="memd-inner">
		<div class="memd-header"><div class="memd-badge">ME.md</div><a href="/me/{data.user.username}" class="memd-view-link">View full →</a></div>
		{#if data.meMd.frontmatter.handle}<div class="memd-handle">@{data.meMd.frontmatter.handle.replace(/^@/, '')}</div>{/if}
		{#if data.meMd.frontmatter.agents?.length}
			<div class="memd-agents">
				<span class="memd-section-label">Agents</span>
				<div class="agent-chips">{#each data.meMd.frontmatter.agents as agent}<div class="agent-chip"><span class="agent-emoji">{agent.emoji || '🤖'}</span><span class="agent-name">{agent.id}</span><span class="agent-role">{agent.role}</span></div>{/each}</div>
			</div>
		{/if}
		{#each meMdValueSections as valuesSection}
			<div class="memd-values"><span class="memd-section-label">{valuesSection.title}</span><p class="memd-snippet">{valuesSection.content.slice(0, 240)}{valuesSection.content.length > 240 ? '...' : ''}</p></div>
		{/each}
		{#if data.meMd.frontmatter.tags?.length}<div class="memd-tags">{#each data.meMd.frontmatter.tags as tag}<span class="memd-tag">#{tag}</span>{/each}</div>{/if}
	</div>
</section>
{:else if data.user.hasMeMd}
<section class="memd-section memd-empty">
	<div class="memd-inner">
		<div class="memd-header"><div class="memd-badge">ME.md</div></div>
		<p>@{data.user.username} hasn't published their ME.md yet.</p>
		{#if data.user.isOwnProfile}<a href="/me/edit" class="btn-ghost">Create yours →</a>{/if}
	</div>
</section>
{/if}

<style>
	.profile-header { padding: 54px 0 40px; }
	.profile-inner { max-width: 1200px; margin: 0 auto; }
	.avatar-ring { display: inline-block; position: relative; margin-bottom: 24px; }
	.avatar { display: flex; align-items: center; justify-content: center; width: 80px; height: 80px; border: 1px solid var(--accent-border); border-radius: 50%; background: var(--accent-soft); color: var(--lime); font-size: 32px; overflow: hidden; }
	.avatar img { width: 100%; height: 100%; object-fit: cover; }
	.verified-badge, .creator-badge { position: absolute; bottom: -2px; right: -4px; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: 3px solid var(--ink); border-radius: 50%; background: var(--action-bg); color: var(--action-ink); font-size: 12px; }
	.creator-badge { background: var(--panel); font-size: 15px; }
	.intro { max-width: 880px; margin-bottom: 20px; overflow-wrap: anywhere; }
	.intro h1 { margin: 0 0 8px; font-size: clamp(36px, 4vw, 60px); font-weight: 500; letter-spacing: -.035em; line-height: 1.05; color: var(--paper); }
	.writes { color: var(--quiet); }
	.topics { font-size: clamp(28px, 3.4vw, 46px); font-weight: 500; letter-spacing: -.035em; line-height: 1.15; }
	.topic { color: var(--lime); }
	.topic-sep { color: var(--quiet); }
	.bio { max-width: 65ch; margin-bottom: 20px; color: var(--quiet); font-size: 17px; line-height: 1.6; overflow-wrap: anywhere; }
	.meta { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; }
	.meta-item { color: var(--quiet); font-size: 14px; }
	.meta-item strong { color: var(--paper); font-weight: 500; font-variant-numeric: tabular-nums; }
	.meta-dot { color: var(--quiet); }
	.follow-btn, .btn-primary, .install-btn, .copy-btn { display: inline-flex; align-items: center; justify-content: center; min-height: 46px; padding: 12px 20px; border: 1px solid var(--action-bg); border-radius: 6px; background: var(--action-bg); color: var(--action-ink); font-size: 14px; font-weight: 500; cursor: pointer; transition: background .2s; }
	.follow-btn:hover, .btn-primary:hover, .install-btn:hover, .copy-btn:hover { background: var(--action-hover); color: var(--action-ink); }
	.owner-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
	.btn-ghost { display: inline-flex; align-items: center; justify-content: center; min-height: 46px; padding: 12px 20px; border: 1px solid var(--line); border-radius: 6px; color: var(--paper); font-size: 14px; }
	.btn-ghost:hover { border-color: var(--line-strong); background: var(--panel-raised); color: var(--paper); }
	.marketplace-banner { padding-bottom: 32px; }
	.marketplace-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; flex-wrap: wrap; gap: 16px; padding: 20px; border: 1px solid var(--line); border-radius: 8px; background: var(--panel); }
	.marketplace-badge { padding: 4px 8px; border: 1px solid var(--line); border-radius: 4px; color: var(--lavender); font-size: 12px; }
	.marketplace-text { flex: 1 1 250px; min-width: 0; color: var(--quiet); font-size: 15px; line-height: 1.5; }
	.marketplace-text strong { color: var(--paper); }
	.marketplace-link { display: inline-flex; align-items: center; gap: 8px; color: var(--lime); font-size: 14px; }
	.skills-section { padding: 0 0 40px; }
	.skills-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: minmax(230px, 300px) minmax(0, 1fr); gap: 32px; align-items: start; }
	.skills-list { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
	.section-label { margin: 0 0 8px; font-size: 24px; font-weight: 500; }
	.skill-card { width: 100%; padding: 20px; text-align: left; border: 1px solid var(--line); border-radius: 8px; background: var(--panel); color: var(--paper); cursor: pointer; transition: border-color .2s, background .2s; }
	.skill-card:hover { border-color: var(--line-strong); background: var(--panel-raised); }
	.skill-card.active { border-color: var(--accent-border); background: var(--accent-soft); }
	.skill-card.active .skill-desc, .skill-card.active .skill-installs, .skill-card.active .skill-card-bottom { color: var(--lime); }
	.skill-card-top { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 12px; }
	.category-chip { padding: 4px 8px; border: 1px solid var(--accent-border); border-radius: 4px; background: var(--accent-soft); color: var(--lime); font-size: 11px; overflow-wrap: anywhere; }
	.skill-installs, .skill-version { font-family: var(--font-mono); font-size: 11px; color: var(--quiet); font-variant-numeric: tabular-nums; }
	.skill-title { margin: 0 0 10px; font-size: 20px; font-weight: 500; overflow-wrap: anywhere; }
	.skill-desc { margin-bottom: 16px; color: var(--quiet); font-size: 14px; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; overflow-wrap: anywhere; }
	.skill-card-bottom { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; color: var(--quiet); font-size: 12px; }
	.skill-card.active .skill-version { color: inherit; }
	.skill-detail { min-width: 0; }
	.detail-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px; margin-bottom: 24px; }
	.detail-title-wrap { display: flex; align-items: center; gap: 12px; min-width: 0; }
	.detail-title { margin: 0; font-size: 29px; line-height: 1.15; font-weight: 500; overflow-wrap: anywhere; }
	.detail-emoji { font-size: 24px; }
	.install-btn { gap: 10px; }
	.install-btn.external { border-color: var(--line); background: var(--panel); color: var(--paper); }
	.install-btn.external:hover { border-color: var(--line-strong); background: var(--panel-raised); color: var(--paper); }
	.file-tabs { display: flex; max-width: 100%; overflow-x: auto; border-bottom: 1px solid var(--line); }
	.file-tab { display: flex; align-items: center; min-height: 46px; flex-shrink: 0; padding: 12px 16px; border: none; border-bottom: 2px solid transparent; background: transparent; color: var(--quiet); font-family: var(--font-mono); font-size: 12px; cursor: pointer; }
	.file-tab:hover { background: var(--panel-raised); color: var(--paper); }
	.file-tab.active { color: var(--lime); border-bottom-color: var(--lime); }
	.code-viewer { border: 1px solid var(--line); border-top: none; border-radius: 0 0 8px 8px; background: var(--code-bg); overflow: hidden; }
	.code-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 8px 16px; border-bottom: 1px solid var(--line); background: var(--code-toolbar); }
	.code-filename { color: var(--code-text); font-family: var(--font-mono); font-size: 11px; overflow-wrap: anywhere; }
	.code-copy { flex-shrink: 0; min-height: 38px; padding: 8px 12px; border: 1px solid var(--line); border-radius: 6px; background: transparent; color: var(--paper); font-size: 12px; cursor: pointer; }
	.code-copy:hover { border-color: var(--line-strong); }
	.code-content { margin: 0; padding: 20px; color: var(--code-text); font-family: var(--font-mono); font-size: 12px; line-height: 1.8; white-space: pre-wrap; overflow-x: auto; overflow-wrap: anywhere; tab-size: 2; }
	.code-content code { font-family: inherit; }
	.version-hash { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; padding: 20px 0; }
	.hash-label, .hash-sep { color: var(--quiet); font-family: var(--font-mono); font-size: 11px; }
	.hash-value { max-width: 100%; padding: 4px 8px; border: 1px solid var(--line); border-radius: 4px; background: var(--panel); color: var(--quiet); font-family: var(--font-mono); font-size: 11px; overflow-wrap: anywhere; }
	.install-command-box { margin-bottom: 20px; border: 1px solid var(--line); border-radius: 8px; background: var(--code-bg); overflow: hidden; }
	.install-command-header { padding: 12px 16px; border-bottom: 1px solid var(--line); background: var(--code-toolbar); }
	.install-label { color: var(--code-text); font-size: 13px; }
	.install-command { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px; }
	.install-command code { min-width: 0; color: var(--code-text); font-family: var(--font-mono); font-size: 12px; line-height: 1.8; overflow-wrap: anywhere; }
	.copy-btn { min-height: 38px; padding: 8px 12px; flex-shrink: 0; font-size: 12px; }
	.external-note { padding: 16px; border: 1px solid var(--line); border-radius: 6px; background: var(--panel); color: var(--quiet); font-size: 14px; line-height: 1.5; }
	.external-note a { color: var(--lime); text-decoration: underline; text-underline-offset: 3px; }
	.empty-state { padding: 40px 20px; margin-bottom: 40px; border: 1px dashed var(--line); border-radius: 8px; }
	.empty-inner { max-width: 400px; margin: 0 auto; text-align: center; }
	.empty-icon { font-size: 36px; margin-bottom: 16px; }
	.empty-inner h3 { margin: 0 0 12px; font-size: 24px; }
	.empty-inner p { margin-bottom: 20px; color: var(--quiet); line-height: 1.5; }
	.memd-section { padding: 32px 0; border-top: 1px solid var(--line); }
	.memd-inner { max-width: 1200px; margin: 0 auto; }
	.memd-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; }
	.memd-badge { color: var(--paper); font-family: var(--font-mono); font-size: 16px; }
	.memd-view-link { display: inline-flex; align-items: center; min-height: 38px; color: var(--lime); font-size: 14px; }
	.memd-handle { margin-bottom: 24px; color: var(--lavender); font-family: var(--font-mono); font-size: 13px; overflow-wrap: anywhere; }
	.memd-section-label { display: block; margin-bottom: 12px; color: var(--paper); font-size: 16px; font-weight: 500; }
	.memd-agents, .memd-values { margin-bottom: 24px; }
	.agent-chips { display: flex; flex-wrap: wrap; gap: 10px; }
	.agent-chip { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; padding: 8px 12px; border: 1px solid var(--line); border-radius: 6px; background: var(--panel); font-size: 14px; overflow-wrap: anywhere; }
	.agent-emoji { font-size: 14px; }
	.agent-name { color: var(--paper); font-weight: 500; }
	.agent-role { padding-left: 8px; border-left: 1px solid var(--line); color: var(--quiet); font-size: 12px; }
	.memd-snippet { max-width: 72ch; color: var(--quiet); font-size: 15px; line-height: 1.7; overflow-wrap: anywhere; }
	.memd-tags { display: flex; flex-wrap: wrap; gap: 8px; }
	.memd-tag { padding: 4px 8px; border: 1px solid var(--line); border-radius: 4px; background: var(--panel); color: var(--quiet); font-size: 12px; overflow-wrap: anywhere; }
	@media (max-width: 1100px) { .skills-inner { grid-template-columns: 1fr; } .skills-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 230px), 1fr)); } .section-label { grid-column: 1 / -1; } }
	@media (max-width: 760px) { .profile-header { padding-top: 32px; } .code-content, .install-command code { font-size: 11px; } }
	@media (max-width: 540px) { .install-command { flex-wrap: wrap; } .install-command code { flex-basis: 100%; } .detail-actions, .detail-actions .install-btn { width: 100%; } .owner-actions a { width: 100%; } }
	@media (prefers-reduced-motion: reduce) { .follow-btn, .btn-primary, .install-btn, .copy-btn, .skill-card { transition: none; } }
</style>
