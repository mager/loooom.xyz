<script lang="ts">
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import YarnLogo from '$lib/components/YarnLogo.svelte';

	let { data } = $props();

	const totalUses = data.skills.reduce((sum, s) => sum + s.installs, 0);

	function relativeTime(iso: string): string {
		const diff = Date.now() - new Date(iso).getTime();
		const days = Math.floor(diff / 86400000);
		if (days < 1) return 'today';
		if (days === 1) return 'yesterday';
		if (days < 7) return `${days} days ago`;
		if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
		return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
	}

	const skillEmojis = ['🔤', '📐', '🈁', '💬', '🔥'];
</script>

<svelte:head>
	<title>{data.plugin.title} by {data.author.displayName} — Loooom</title>
	<meta name="description" content={data.plugin.description || `A plugin by ${data.author.displayName} on Loooom`} />
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

<section class="plugin-page">
	<div class="plugin-inner">
		<a href="/u/{data.author.username}" class="back-link">← {data.author.displayName}'s profile</a>

		<!-- Header -->
		<div class="plugin-header">
			<div class="header-left">
				{#if data.plugin.category}
					<span class="plugin-badge">🧩 Plugin</span>
					<span class="plugin-category">{data.plugin.category}</span>
				{/if}
				<h1 class="handwriting">{data.plugin.title}</h1>
				{#if data.plugin.description}
					<p class="plugin-desc">{data.plugin.description}</p>
				{/if}
				<div class="plugin-meta">
					<span class="meta-item">{data.skills.length} skills</span>
					<span class="meta-dot">·</span>
					<span class="meta-item">{totalUses.toLocaleString()} total uses</span>
					<span class="meta-dot">·</span>
					<span class="meta-item">Updated {relativeTime(data.plugin.updatedAt)}</span>
				</div>
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

		<!-- Skills Path -->
		<div class="skills-path">
			<h2 class="path-title">Learning Path</h2>
			<div class="path-list">
				{#each data.skills as skill, i}
					<a href="/s/{data.author.username}/{skill.name}" class="path-card">
						<div class="path-number">
							<span class="number-emoji">{skillEmojis[i] ?? '📄'}</span>
							<span class="number-text">{i + 1}</span>
						</div>
						{#if i < data.skills.length - 1}
							<div class="path-connector"></div>
						{/if}
						<div class="path-content">
							<h3>{skill.title}</h3>
							{#if skill.description}
								<p>{skill.description}</p>
							{/if}
							<div class="path-skill-meta">
								<span>{skill.installs.toLocaleString()} uses</span>
							</div>
						</div>
						<div class="path-arrow">→</div>
					</a>
				{/each}
			</div>
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

	.plugin-page { position: relative; z-index: 1; min-height: 100vh; padding: 7rem 2rem 4rem; }
	.plugin-inner { max-width: 900px; margin: 0 auto; }

	.back-link { display: inline-block; font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 2rem; transition: color 0.2s; }
	.back-link:hover { color: var(--accent-rose); }

	.plugin-header { margin-bottom: 2rem; }
	.header-left { flex: 1; }
	.plugin-badge {
		display: inline-block; font-size: 0.7rem; font-weight: 600; text-transform: uppercase;
		letter-spacing: 0.12em; color: var(--accent); background: color-mix(in srgb, var(--accent) 10%, transparent);
		padding: 0.25rem 0.75rem; border-radius: 999px; margin-right: 0.5rem;
	}
	.plugin-category { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: var(--text-muted); }
	.plugin-header h1 { font-size: clamp(2rem, 4vw, 3rem); margin: 0.5rem 0 0.75rem; color: var(--text-primary); }
	.plugin-desc { font-size: 1.1rem; color: var(--text-secondary); line-height: 1.45; margin-bottom: 1rem; }
	.plugin-meta { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
	.meta-item { font-size: 0.85rem; color: var(--text-muted); font-family: var(--font-mono); }
	.meta-dot { color: var(--text-muted); }

	.author-card {
		display: flex; align-items: center; gap: 1rem;
		padding: 1rem 1.25rem; background: var(--bg-card); border: 1px solid var(--border);
		border-radius: var(--radius-md); margin-bottom: 2.5rem; transition: all 0.25s; text-decoration: none;
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

	/* Skills Path */
	.skills-path { margin-bottom: 3rem; }
	.path-title {
		font-family: var(--font-display); font-size: 1.1rem; font-weight: 600;
		color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.08em;
		margin-bottom: 1.5rem;
	}
	.path-list { display: flex; flex-direction: column; gap: 0; }

	.path-card {
		display: flex; align-items: center; gap: 1.5rem;
		padding: 1.25rem 1.5rem; background: var(--bg-card);
		border: 1px solid var(--border); border-radius: var(--radius-md);
		margin-bottom: 0; transition: all 0.25s; text-decoration: none;
		position: relative;
	}
	.path-card:not(:last-child) { border-bottom-left-radius: 0; border-bottom-right-radius: 0; border-bottom: none; }
	.path-card:not(:first-child) { border-top-left-radius: 0; border-top-right-radius: 0; }
	.path-card:hover { background: var(--bg-card-hover); border-color: var(--text-muted); z-index: 1; border-radius: var(--radius-md); border: 1px solid var(--text-muted); }

	.path-number {
		display: flex; flex-direction: column; align-items: center; gap: 0.25rem;
		flex-shrink: 0; width: 48px;
	}
	.number-emoji { font-size: 1.5rem; }
	.number-text {
		font-family: var(--font-mono); font-size: 0.65rem; font-weight: 700;
		color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em;
	}

	.path-connector { display: none; }

	.path-content { flex: 1; min-width: 0; }
	.path-content h3 {
		font-family: var(--font-display); font-size: 1.05rem; font-weight: 600;
		color: var(--text-primary); margin-bottom: 0.35rem;
	}
	.path-content p {
		font-size: 0.875rem; color: var(--text-secondary); line-height: 1.4;
		display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
	}
	.path-skill-meta { margin-top: 0.4rem; }
	.path-skill-meta span { font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); }

	.path-arrow {
		font-size: 1.2rem; color: var(--text-muted); flex-shrink: 0;
		transition: transform 0.2s, color 0.2s;
	}
	.path-card:hover .path-arrow { transform: translateX(4px); color: var(--accent); }

	@media (max-width: 768px) {
		.path-card { gap: 1rem; padding: 1rem; }
		.path-number { width: 40px; }
		.number-emoji { font-size: 1.2rem; }
		.nav-right a:not(.btn-nav):not(:global(.theme-toggle)) { display: none; }
	}
</style>
