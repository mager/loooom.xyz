<script lang="ts">
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import YarnLogo from '$lib/components/YarnLogo.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Browse Skills{data.activeCategory ? ` — ${data.activeCategory}` : ''} — Loooom</title>
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
			<ThemeToggle />
			{#if data.user}
				<a href="/create" class="nav-link">Create</a>
				<a href="/u/{data.user.username}" class="btn-nav">{data.user.displayName}</a>
			{:else}
				<a href="/login" class="btn-nav">Sign In</a>
			{/if}
		</div>
	</div>
</nav>

<section class="browse-page">
	<div class="browse-inner">
		<h1 class="handwriting">
			{#if data.activeCategory}
				{data.activeCategory} <span class="sketch">skills</span>
			{:else}
				Browse <span class="sketch">skills</span>
			{/if}
		</h1>

		<div class="categories">
			<a href="/browse" class="cat-pill" class:active={!data.activeCategory}>All</a>
			{#each data.categories as cat}
				<a href="/browse?category={cat}" class="cat-pill" class:active={data.activeCategory === cat}>{cat}</a>
			{/each}
		</div>

		{#if data.skills.length === 0}
			<div class="empty">
				<p class="empty-text">No skills found{data.activeCategory ? ` in ${data.activeCategory}` : ''}.</p>
				<p class="empty-hint">Be the first to <a href="/create">create one</a>!</p>
			</div>
		{:else}
			<div class="skills-grid">
				{#each data.skills as skill}
					<a href="/s/{skill.author?.username}/{skill.name}" class="skill-card">
						<div class="card-top">
							{#if skill.category}
								<span class="skill-category">{skill.category}</span>
							{/if}
							<span class="skill-uses">{skill.installs.toLocaleString()} uses</span>
						</div>
						<h3 class="skill-title">{skill.title}</h3>
						{#if skill.description}
							<p class="skill-desc">{skill.description}</p>
						{/if}
						{#if skill.author}
							<div class="card-author">
								<div class="author-avatar-sm">
									{#if skill.author.avatarUrl}
										<img src={skill.author.avatarUrl} alt={skill.author.displayName} />
									{:else}
										{skill.author.displayName[0]}
									{/if}
								</div>
								<span class="author-name">{skill.author.displayName}</span>
								{#if skill.author.verified}
									<span class="verified">✓</span>
								{/if}
							</div>
						{/if}
					</a>
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	.ambient { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
	.orb { position: absolute; border-radius: 50%; filter: blur(140px); opacity: 0.06; }
	:global(html[data-theme="dark"]) .orb { opacity: 0.12; }
	.orb-1 { width: 500px; height: 500px; background: var(--accent); top: -100px; left: -100px; animation: drift 25s ease-in-out infinite; }
	.orb-2 { width: 400px; height: 400px; background: var(--yarn-pink); bottom: 10%; right: -100px; animation: drift 30s ease-in-out infinite reverse; }
	@keyframes drift { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, -20px); } }

	nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; backdrop-filter: blur(20px); background: var(--nav-bg); border-bottom: 1px solid var(--border); }
	.nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 2rem; height: 64px; display: flex; align-items: center; justify-content: space-between; }
	.logo { display: flex; align-items: center; gap: 0.5rem; color: var(--text-primary); }
	.logo:hover { color: var(--text-primary); }
	.logo-text { font-family: var(--font-handwriting); font-size: 1.3rem; font-weight: 100; letter-spacing: 0.02em; }
	.nav-right { display: flex; align-items: center; gap: 1.5rem; }
	.nav-link { color: var(--text-secondary); font-size: 0.9rem; font-weight: 500; }
	.nav-link:hover { color: var(--text-primary); }
	.btn-nav { background: var(--bg-card); color: var(--text-primary) !important; border: 1px solid var(--border); padding: 0.5rem 1.25rem; border-radius: var(--radius-sm); font-size: 0.875rem; font-weight: 500; transition: all 0.2s; text-decoration: none; }
	.btn-nav:hover { border-color: var(--text-secondary); }

	.handwriting { font-family: var(--font-handwriting); font-weight: 100; text-shadow: 0 0.5px 0 rgba(0,0,0,0.06); }
	:global(html[data-theme="dark"]) .handwriting { text-shadow: 0 0.5px 0 rgba(255,255,255,0.08); }
	.sketch { font-family: var(--font-sketch); font-weight: 400; color: var(--yarn-pink); }

	.browse-page { position: relative; z-index: 1; min-height: 100vh; padding: 7rem 2rem 4rem; }
	.browse-inner { max-width: 1200px; margin: 0 auto; }
	.browse-inner h1 { font-size: clamp(2rem, 4vw, 3rem); margin-bottom: 2rem; color: var(--text-primary); }

	.categories { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 3rem; }
	.cat-pill {
		padding: 0.625rem 1.5rem; border-radius: 100px; background: var(--bg-card);
		border: 1px solid var(--border); color: var(--text-secondary);
		font-family: var(--font-handwriting); font-size: 1.05rem; cursor: pointer;
		transition: all 0.25s; box-shadow: var(--card-shadow); text-decoration: none;
	}
	.cat-pill:hover { border-color: var(--text-secondary); color: var(--text-primary); transform: translateY(-1px); }
	.cat-pill.active { background: var(--accent); color: white; border-color: var(--accent); }
	:global(html[data-theme="dark"]) .cat-pill.active { color: var(--bg-primary); }

	.empty { text-align: center; padding: 4rem 0; }
	.empty-text { font-size: 1.2rem; color: var(--text-secondary); margin-bottom: 0.5rem; }
	.empty-hint { color: var(--text-muted); }

	.skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.25rem; }
	.skill-card {
		background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md);
		padding: 1.5rem; transition: all 0.25s; text-decoration: none; display: flex; flex-direction: column;
	}
	.skill-card:hover { border-color: var(--border); box-shadow: var(--card-shadow-hover); transform: translateY(-2px); }
	.card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
	.skill-category { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: var(--text-muted); }
	.skill-uses { font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted); }
	.skill-title { font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem; }
	.skill-desc { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.35; margin-bottom: 1rem; flex: 1; }
	.card-author { display: flex; align-items: center; gap: 0.5rem; margin-top: auto; }
	.author-avatar-sm {
		width: 24px; height: 24px; border-radius: 50%;
		background: linear-gradient(135deg, var(--accent), var(--yarn-pink));
		display: flex; align-items: center; justify-content: center;
		font-size: 0.65rem; color: white; overflow: hidden; flex-shrink: 0;
	}
	.author-avatar-sm img { width: 100%; height: 100%; object-fit: cover; }
	.author-name { font-size: 0.8rem; color: var(--text-secondary); }
	.verified { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; border-radius: 50%; background: var(--yarn-teal); color: white; font-size: 0.55rem; font-weight: 700; }

	@media (max-width: 768px) {
		.skills-grid { grid-template-columns: 1fr; }
		.nav-right a:not(.btn-nav):not(:global(.theme-toggle)) { display: none; }
	}
</style>
