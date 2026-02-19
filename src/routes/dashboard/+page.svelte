<script lang="ts">
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import YarnLogo from '$lib/components/YarnLogo.svelte';

	let { data } = $props();

	function relativeTime(iso: string): string {
		const diff = Date.now() - new Date(iso).getTime();
		const days = Math.floor(diff / 86400000);
		if (days < 1) return 'today';
		if (days === 1) return 'yesterday';
		if (days < 7) return `${days} days ago`;
		if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
		return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
	}

	const publishedSkills = $derived(data.skills.filter((s: any) => s.isPublished));
	const draftSkills = $derived(data.skills.filter((s: any) => !s.isPublished));
</script>

<svelte:head>
	<title>Dashboard — Loooom</title>
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
			<a href="/create" class="nav-link">Create</a>
			<ThemeToggle />
			<a href="/u/{data.profile.username}" class="user-chip">
				{#if data.profile.avatarUrl}
					<img src={data.profile.avatarUrl} alt="" class="user-chip-avatar" />
				{:else}
					<span class="user-chip-initial">{data.profile.displayName[0]}</span>
				{/if}
				<span class="user-chip-name">{data.profile.displayName}</span>
			</a>
		</div>
	</div>
</nav>

<main class="dashboard">
	<section class="welcome">
		<h1 class="handwriting">Welcome back, {data.profile.displayName}</h1>
	</section>

	<section class="stats-row">
		<div class="stat-card">
			<span class="stat-value">{publishedSkills.length}</span>
			<span class="stat-label">Published Skills</span>
		</div>
		<div class="stat-card">
			<span class="stat-value">{data.totalUses.toLocaleString()}</span>
			<span class="stat-label">Total Uses</span>
		</div>
		<div class="stat-card">
			<span class="stat-value">{data.followers}</span>
			<span class="stat-label">Followers</span>
		</div>
		<div class="stat-card">
			<span class="stat-value">{data.following}</span>
			<span class="stat-label">Following</span>
		</div>
	</section>

	<section class="quick-actions">
		<a href="/create" class="btn-primary">Write a new skill <span class="btn-arrow">→</span></a>
		<a href="/u/{data.profile.username}" class="btn-secondary">View my profile</a>
	</section>

	<section class="skills-section">
		<h2 class="section-label">My Skills</h2>

		{#if data.skills.length === 0}
			<div class="empty-state">
				<p class="handwriting empty-title">You haven't written any skills yet.</p>
				<p class="empty-sub">Time to share what you know!</p>
				<a href="/create" class="btn-primary">Write your first skill <span class="btn-arrow">→</span></a>
			</div>
		{:else}
			<div class="skills-grid">
				{#each data.skills as skill}
					<div class="skill-card">
						<div class="skill-card-top">
							{#if skill.category}
								<span class="skill-category">{skill.category}</span>
							{/if}
							<span class="skill-badge" class:published={skill.isPublished}>
								{skill.isPublished ? 'Published' : 'Draft'}
							</span>
						</div>
						<h3 class="skill-title">{skill.title}</h3>
						{#if skill.description}
							<p class="skill-desc">{skill.description}</p>
						{/if}
						<div class="skill-meta">
							<span class="skill-uses">{skill.installs.toLocaleString()} uses</span>
							<span class="skill-updated">{relativeTime(skill.updatedAt.toISOString ? skill.updatedAt.toISOString() : String(skill.updatedAt))}</span>
						</div>
						<div class="skill-actions">
							<a href="/edit/{skill.id}" class="action-link">Edit</a>
							<a href="/s/{data.profile.username}/{skill.name}" class="action-link">View</a>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</main>

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
	.nav-right { display: flex; align-items: center; gap: 1rem; }
	.nav-link { font-size: 0.875rem; color: var(--text-secondary); font-weight: 500; }
	.nav-link:hover { color: var(--text-primary); }

	.user-chip {
		display: flex; align-items: center; gap: 0.5rem;
		background: var(--bg-card); border: 1px solid var(--border);
		padding: 0.35rem 1rem 0.35rem 0.35rem; border-radius: 100px;
		color: var(--text-primary); text-decoration: none; transition: all 0.2s;
	}
	.user-chip:hover { border-color: var(--accent); color: var(--text-primary); }
	.user-chip-avatar { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; }
	.user-chip-initial {
		width: 28px; height: 28px; border-radius: 50%;
		background: linear-gradient(135deg, var(--accent), var(--yarn-pink));
		display: flex; align-items: center; justify-content: center;
		color: white; font-size: 0.75rem; font-weight: 600;
	}
	.user-chip-name { font-size: 0.85rem; font-weight: 500; }

	.handwriting { font-family: var(--font-handwriting); font-weight: 100; text-shadow: 0 0.5px 0 rgba(0,0,0,0.06); }
	:global(html[data-theme="dark"]) .handwriting { text-shadow: 0 0.5px 0 rgba(255,255,255,0.08); }

	.dashboard { position: relative; z-index: 1; max-width: 1000px; margin: 0 auto; padding: 7rem 2rem 4rem; }

	.welcome { margin-bottom: 2.5rem; }
	.welcome h1 { font-size: clamp(1.8rem, 3.5vw, 2.8rem); color: var(--text-primary); }

	.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2.5rem; }
	.stat-card {
		background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md);
		padding: 1.25rem; display: flex; flex-direction: column; gap: 0.25rem;
		transition: all 0.25s;
	}
	.stat-card:hover { border-color: rgba(108, 92, 231, 0.3); box-shadow: var(--card-shadow-hover); }
	.stat-value { font-size: 1.75rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; }
	.stat-label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; font-family: var(--font-mono); }

	.quick-actions { display: flex; gap: 1rem; margin-bottom: 3rem; flex-wrap: wrap; }
	.btn-primary {
		display: inline-flex; align-items: center; gap: 0.5rem;
		padding: 0.75rem 1.75rem; background: var(--accent); color: white;
		border: none; border-radius: var(--radius-md); font-family: var(--font-display);
		font-size: 0.95rem; font-weight: 600; text-decoration: none; transition: all 0.25s;
	}
	.btn-primary:hover { background: var(--accent-bright); transform: translateY(-1px); box-shadow: 0 8px 30px rgba(108,92,231,0.3); color: white; }
	.btn-arrow { transition: transform 0.2s; }
	.btn-primary:hover .btn-arrow { transform: translateX(3px); }
	.btn-secondary {
		display: inline-flex; align-items: center; gap: 0.5rem;
		padding: 0.75rem 1.75rem; background: var(--bg-card); color: var(--text-primary);
		border: 1px solid var(--border); border-radius: var(--radius-md); font-family: var(--font-display);
		font-size: 0.95rem; font-weight: 500; text-decoration: none; transition: all 0.25s;
	}
	.btn-secondary:hover { border-color: var(--accent); color: var(--text-primary); }

	.skills-section { margin-bottom: 3rem; }
	.section-label {
		font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase;
		letter-spacing: 0.15em; color: var(--text-muted); margin-bottom: 1rem;
	}

	.empty-state {
		text-align: center; padding: 4rem 2rem;
		background: var(--bg-card); border: 1px dashed var(--border); border-radius: var(--radius-md);
	}
	.empty-title { font-size: 1.5rem; color: var(--text-primary); margin-bottom: 0.5rem; }
	.empty-sub { color: var(--text-secondary); margin-bottom: 1.5rem; }

	.skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }
	.skill-card {
		background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md);
		padding: 1.25rem; transition: all 0.25s; font-family: var(--font-display);
	}
	.skill-card:hover { background: var(--bg-card-hover); border-color: rgba(108,92,231,0.3); box-shadow: var(--card-shadow-hover); }
	.skill-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
	.skill-category { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent); }
	.skill-badge {
		font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;
		padding: 0.2rem 0.6rem; border-radius: 100px;
		background: rgba(232,67,147,0.1); color: var(--yarn-pink);
	}
	.skill-badge.published { background: rgba(39,174,96,0.1); color: var(--yarn-green); }
	.skill-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-primary); }
	.skill-desc { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.25; margin-bottom: 0.75rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
	.skill-meta { display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.75rem; font-family: var(--font-mono); }
	.skill-actions { display: flex; gap: 1rem; border-top: 1px solid var(--border); padding-top: 0.75rem; }
	.action-link { font-size: 0.8rem; color: var(--accent); font-weight: 500; text-decoration: none; }
	.action-link:hover { color: var(--accent-bright); }

	@media (max-width: 768px) {
		.stats-row { grid-template-columns: repeat(2, 1fr); }
		.skills-grid { grid-template-columns: 1fr; }
	}
	@media (max-width: 480px) {
		.stats-row { grid-template-columns: 1fr; }
	}
</style>
