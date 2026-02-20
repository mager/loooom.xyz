<script lang="ts">
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import YarnLogo from '$lib/components/YarnLogo.svelte';

	let { data } = $props();
	let activeFile = $state(0);

	function relativeTime(iso: string): string {
		const diff = Date.now() - new Date(iso).getTime();
		const days = Math.floor(diff / 86400000);
		if (days < 1) return 'today';
		if (days === 1) return 'yesterday';
		if (days < 7) return `${days} days ago`;
		if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
		return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
	}

	function fileIcon(name: string): string {
		if (name.endsWith('.md')) return '📄';
		if (name.endsWith('.sh')) return '⚡';
		if (name.endsWith('.py')) return '🐍';
		if (name.endsWith('.js') || name.endsWith('.ts')) return '📦';
		return '📄';
	}
</script>

<svelte:head>
	<title>{data.skill.title} by {data.author.displayName} — Loooom</title>
	<meta name="description" content={data.skill.description || `A skill by ${data.author.displayName} on Loooom`} />
</svelte:head>

<div class="ambient">
	<div class="orb orb-1"></div>
	<div class="orb orb-2"></div>
</div>

<nav>
	<div class="nav-inner">
		<a href="/" class="logo">
			<YarnLogo size={28} />
			<span class="logo-text">loooom</span>
		</a>
		<div class="nav-right">
			<a href="/browse">Browse</a>
			<ThemeToggle />
			{#if data.user}
				<a href="/u/{data.user.username}" class="btn-nav">{data.user.displayName}</a>
			{:else}
				<a href="/login" class="btn-nav">Sign In</a>
			{/if}
		</div>
	</div>
</nav>

<section class="skill-page">
	<div class="skill-inner">
		<!-- Back link -->
		<a href="/u/{data.author.username}" class="back-link">← {data.author.displayName}'s profile</a>

		<!-- Header -->
		<div class="skill-header">
			<div class="header-left">
				{#if data.skill.category}
					<span class="skill-category">{data.skill.category}</span>
				{/if}
				<h1 class="handwriting">{data.skill.title}</h1>
				{#if data.skill.description}
					<p class="skill-desc">{data.skill.description}</p>
				{/if}
				<div class="skill-meta">
					<span class="meta-item">{data.skill.installs.toLocaleString()} uses</span>
					<span class="meta-dot">·</span>
					<span class="meta-item">v{data.skill.version}</span>
					<span class="meta-dot">·</span>
					<span class="meta-item">Updated {relativeTime(data.skill.updatedAt)}</span>
				</div>
			</div>
			<div class="header-actions">
				{#if data.isOwner}
					<a href="/edit/{data.skill.id}" class="btn-edit">Edit</a>
				{/if}
				<button class="btn-use">
					Use this skill
					<span class="btn-arrow">→</span>
				</button>
			</div>
		</div>

		<!-- Author card -->
		<a href="/u/{data.author.username}" class="author-card">
			<div class="author-avatar">
				{#if data.author.avatarUrl}
					<img src={data.author.avatarUrl} alt={data.author.displayName} />
				{:else}
					{data.author.displayName[0]}
				{/if}
			</div>
			<div class="author-info">
				<span class="author-name">
					{data.author.displayName}
					{#if data.author.verified}
						<span class="verified" title="Verified">✓</span>
					{/if}
				</span>
				<span class="author-handle">@{data.author.username}</span>
			</div>
		</a>

		<!-- Files -->
		{#if data.skill.files.length > 0}
			<div class="files-section">
				<div class="file-tabs">
					{#each data.skill.files as file, i}
						<button
							class="file-tab"
							class:active={activeFile === i}
							onclick={() => activeFile = i}
						>
							<span class="file-icon">{fileIcon(file.name)}</span>
							{file.name}
						</button>
					{/each}
				</div>

				<div class="code-viewer">
					<div class="code-header">
						<span class="code-filename">{data.skill.files[activeFile].name}</span>
						<button class="code-copy" onclick={() => navigator.clipboard.writeText(data.skill.files[activeFile].content)}>
							Copy
						</button>
					</div>
					<pre class="code-content"><code>{data.skill.files[activeFile].content}</code></pre>
				</div>
			</div>
		{/if}

		<!-- Version hash -->
		<div class="version-hash">
			<span class="hash-label">Content Hash</span>
			<span class="hash-value">{data.skill.contentHash || 'sha256:...'}</span>
			<span class="hash-sep">·</span>
			<span class="hash-label">Version</span>
			<span class="hash-value">v{data.skill.version}</span>
		</div>
	</div>
</section>

<style>
	.ambient { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
	.orb { position: absolute; border-radius: 50%; filter: blur(140px); opacity: 0.06; }
	:global(html[data-theme="dark"]) .orb { opacity: 0.12; }
	.orb-1 { width: 500px; height: 500px; background: var(--accent); top: -100px; right: -100px; animation: drift 25s ease-in-out infinite; }
	.orb-2 { width: 400px; height: 400px; background: var(--yarn-pink); bottom: 10%; left: -100px; animation: drift 30s ease-in-out infinite reverse; }
	@keyframes drift { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, -20px); } }

	nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; backdrop-filter: blur(20px); background: var(--nav-bg); border-bottom: 1px solid var(--border); }
	.nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 2rem; height: 64px; display: flex; align-items: center; justify-content: space-between; }
	.logo { display: flex; align-items: center; gap: 0.5rem; color: var(--text-primary); }
	.logo:hover { color: var(--text-primary); }
	.logo-text { font-family: var(--font-handwriting); font-size: 1.3rem; font-weight: 100; letter-spacing: 0.02em; }
	.nav-right { display: flex; align-items: center; gap: 1.5rem; }
	.nav-right a { color: var(--text-secondary); font-size: 0.9rem; font-weight: 500; transition: color 0.2s; }
	.nav-right a:hover { color: var(--text-primary); }
	.btn-nav { background: var(--bg-card); color: var(--text-primary) !important; border: 1px solid var(--border); padding: 0.5rem 1.25rem; border-radius: var(--radius-sm); font-size: 0.875rem; font-weight: 500; transition: all 0.2s; text-decoration: none; }
	.btn-nav:hover { border-color: var(--text-secondary); }

	.handwriting { font-family: var(--font-handwriting); font-weight: 100; text-shadow: 0 0.5px 0 rgba(0,0,0,0.06); }
	:global(html[data-theme="dark"]) .handwriting { text-shadow: 0 0.5px 0 rgba(255,255,255,0.08); }

	.skill-page { position: relative; z-index: 1; min-height: 100vh; padding: 7rem 2rem 4rem; }
	.skill-inner { max-width: 900px; margin: 0 auto; }

	.back-link { display: inline-block; font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 2rem; transition: color 0.2s; }
	.back-link:hover { color: var(--accent-rose); }

	.skill-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 2rem; margin-bottom: 2rem; }
	.header-left { flex: 1; }
	.skill-category { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: var(--text-muted); margin-bottom: 0.5rem; display: inline-block; }
	.skill-header h1 { font-size: clamp(2rem, 4vw, 3rem); margin-bottom: 0.75rem; color: var(--text-primary); }
	.skill-desc { font-size: 1.1rem; color: var(--text-secondary); line-height: 1.45; margin-bottom: 1rem; }
	.skill-meta { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
	.meta-item { font-size: 0.85rem; color: var(--text-muted); font-family: var(--font-mono); }
	.meta-dot { color: var(--text-muted); }

	.header-actions { display: flex; gap: 0.75rem; align-items: center; flex-shrink: 0; padding-top: 1.5rem; }
	.btn-use {
		display: inline-flex; align-items: center; gap: 0.5rem;
		padding: 0.75rem 1.75rem; background: var(--accent); color: white;
		border: none; border-radius: var(--radius-md); font-family: var(--font-display);
		font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: all 0.25s;
	}
	.btn-use:hover { background: var(--accent-bright); transform: translateY(-1px); box-shadow: 0 6px 24px rgba(45,42,62,0.2); }
	:global(html[data-theme="dark"]) .btn-use { color: var(--bg-primary); }
	.btn-arrow { transition: transform 0.2s; }
	.btn-use:hover .btn-arrow { transform: translateX(3px); }
	.btn-edit {
		padding: 0.75rem 1.5rem; background: var(--bg-card); color: var(--text-primary);
		border: 1px solid var(--border); border-radius: var(--radius-md); font-family: var(--font-display);
		font-size: 0.95rem; font-weight: 500; cursor: pointer; transition: all 0.2s; text-decoration: none;
	}
	.btn-edit:hover { border-color: var(--text-secondary); color: var(--text-primary); }

	.author-card {
		display: flex; align-items: center; gap: 1rem;
		padding: 1rem 1.25rem; background: var(--bg-card); border: 1px solid var(--border);
		border-radius: var(--radius-md); margin-bottom: 2rem; transition: all 0.25s; text-decoration: none;
	}
	.author-card:hover { border-color: var(--text-muted); box-shadow: var(--card-shadow-hover); }
	.author-avatar {
		width: 48px; height: 48px; border-radius: 50%;
		background: linear-gradient(135deg, var(--accent), var(--yarn-pink));
		display: flex; align-items: center; justify-content: center;
		font-size: 1.2rem; color: white; font-weight: 500; overflow: hidden; flex-shrink: 0;
	}
	.author-avatar img { width: 100%; height: 100%; object-fit: cover; }
	.author-info { display: flex; flex-direction: column; gap: 0.15rem; }
	.author-name { font-weight: 600; color: var(--text-primary); font-size: 0.95rem; }
	.verified { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 50%; background: var(--yarn-teal); color: white; font-size: 0.6rem; font-weight: 700; margin-left: 0.3rem; vertical-align: middle; }
	.author-handle { font-size: 0.8rem; color: var(--text-muted); }

	.files-section { margin-bottom: 1rem; }
	.file-tabs { display: flex; gap: 0; border-bottom: 1px solid var(--border); }
	.file-tab {
		display: flex; align-items: center; gap: 0.4rem;
		padding: 0.75rem 1.25rem; background: none; border: none;
		border-bottom: 2px solid transparent; color: var(--text-secondary);
		font-family: var(--font-mono); font-size: 0.8rem; cursor: pointer; transition: all 0.2s;
	}
	.file-tab:hover { color: var(--text-primary); background: var(--bg-card-hover); }
	.file-tab.active { color: var(--text-primary); border-bottom-color: var(--accent); }
	.file-icon { font-size: 0.9rem; }

	.code-viewer { background: var(--bg-card); border: 1px solid var(--border); border-top: none; border-radius: 0 0 var(--radius-md) var(--radius-md); overflow: hidden; }
	.code-header { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1.25rem; border-bottom: 1px solid var(--border); background: var(--bg-secondary); }
	.code-filename { font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); }
	.code-copy { background: none; border: 1px solid var(--border); color: var(--text-muted); font-family: var(--font-mono); font-size: 0.7rem; padding: 0.25rem 0.75rem; border-radius: var(--radius-sm); cursor: pointer; transition: all 0.2s; }
	.code-copy:hover { border-color: var(--text-secondary); color: var(--text-primary); }
	.code-content { padding: 1.5rem; font-family: var(--font-mono); font-size: 0.9rem; line-height: 1.5; color: var(--text-secondary); overflow-x: auto; margin: 0; tab-size: 2; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word; }
	.code-content code { font-family: inherit; }

	.version-hash { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 0; margin-top: 1rem; font-size: 0.75rem; flex-wrap: wrap; }
	.hash-label { color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; font-family: var(--font-mono); font-size: 0.65rem; }
	.hash-value { font-family: var(--font-mono); color: var(--text-secondary); background: var(--bg-card); padding: 0.2rem 0.5rem; border-radius: 4px; border: 1px solid var(--border); }
	.hash-sep { color: var(--text-muted); }

	@media (max-width: 768px) {
		.skill-header { flex-direction: column; gap: 1.5rem; }
		.header-actions { padding-top: 0; width: 100%; }
		.btn-use { flex: 1; justify-content: center; }
		.nav-right a:not(.btn-nav):not(:global(.theme-toggle)) { display: none; }
	}
</style>
