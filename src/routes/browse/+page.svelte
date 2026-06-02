<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title
		>{data.activeCategory ? `${data.activeCategory} skills` : 'Browse skills'} — Loooom</title
	>
	<meta
		name="description"
		content="A curated collection of high-quality skills for the creative, non-technical parts of life. Each one is scored against a rubric before it ships."
	/>
	<link rel="canonical" href="https://loooom.xyz/browse" />
	<meta property="og:title" content="Browse skills — Loooom" />
	<meta
		property="og:description"
		content="A curated collection of skills, each scored against a rubric. Copy one into any AI and start."
	/>
	<meta property="og:url" content="https://loooom.xyz/browse" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@mager" />
</svelte:head>

<div class="ambient" aria-hidden="true">
	<div class="orb orb-1"></div>
	<div class="orb orb-2"></div>
</div>

<Nav />

<section class="browse-page">
	<div class="browse-inner">
		<header class="page-header">
			<h1>
				{#if data.activeCategory}
					<span class="handwriting">{data.activeCategory}</span> skills
				{:else}
					The <span class="handwriting">collection</span>
				{/if}
			</h1>
			<p class="page-subtitle">
				A curated collection of {data.total} skill{data.total === 1 ? '' : 's'}, graded against the
				rubric as they ship. Copy one into any AI and start.
			</p>
		</header>

		{#if data.categories.length > 0}
			<nav class="categories" aria-label="Filter by category">
				<a href="/browse" class="cat-pill" class:active={!data.activeCategory}>All</a>
				{#each data.categories as cat}
					<a
						href="/browse?category={encodeURIComponent(cat)}"
						class="cat-pill"
						class:active={data.activeCategory === cat}>{cat}</a
					>
				{/each}
			</nav>
		{/if}

		{#if data.skills.length === 0}
			<div class="empty">
				<p class="empty-text">Nothing here yet{data.activeCategory ? ` in ${data.activeCategory}` : ''}.</p>
				<a href="/browse" class="empty-link">See the whole collection →</a>
			</div>
		{:else}
			<div class="grid">
				{#each data.skills as s, i}
					<a class="card" href={s.link} style="--i:{i}">
						<span class="card-name">{s.name}</span>
						{#if s.score !== null}
							<span class="card-score" data-pass={s.verdict === 'passing'}>{s.score}</span>
						{/if}
						<p class="card-desc">{s.description}</p>
						<div class="card-foot">
							{#if s.category}<span class="card-tag">{s.category}</span>{/if}
							<span class="card-go">open <i>→</i></span>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</section>

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
		opacity: 0.07;
	}
	:global(html[data-theme='dark']) .orb {
		opacity: 0.13;
	}
	.orb-1 {
		width: 500px;
		height: 500px;
		background: var(--ocean);
		top: -120px;
		left: -100px;
	}
	.orb-2 {
		width: 420px;
		height: 420px;
		background: var(--indigo);
		bottom: 8%;
		right: -120px;
		opacity: 0.05;
	}

	.browse-page {
		position: relative;
		z-index: 1;
		min-height: 100vh;
		padding: 7rem 2rem 5rem;
	}
	.browse-inner {
		max-width: 1100px;
		margin: 0 auto;
	}

	.page-header {
		margin-bottom: 2rem;
	}
	.page-header h1 {
		font-family: var(--font-display);
		font-weight: 800;
		letter-spacing: -0.04em;
		font-size: clamp(2.4rem, 6vw, 4rem);
		line-height: 1;
		color: var(--text-primary);
		margin-bottom: 0.6rem;
	}
	.handwriting {
		font-family: var(--font-handwriting);
		font-weight: 400;
		color: var(--accent-dim);
	}
	.page-subtitle {
		max-width: 52ch;
		color: var(--text-secondary);
		font-size: 1.02rem;
		line-height: 1.55;
	}

	.categories {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 2rem;
	}
	.cat-pill {
		padding: 0.4rem 1rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--bg-card) 80%, transparent);
		border: 1px solid var(--border);
		color: var(--text-secondary);
		font-size: 0.86rem;
		font-weight: 600;
		text-decoration: none;
		transition: border-color 0.2s, color 0.2s, background 0.2s;
	}
	.cat-pill:hover {
		border-color: color-mix(in srgb, var(--accent) 50%, var(--border));
		color: var(--text-primary);
	}
	.cat-pill.active {
		background: var(--accent);
		color: #fff;
		border-color: var(--accent);
	}
	:global(html[data-theme='dark']) .cat-pill.active {
		color: var(--bg-primary);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1rem;
	}

	.card {
		position: relative;
		display: grid;
		grid-template-rows: auto 1fr auto;
		gap: 0.7rem;
		min-height: 200px;
		padding: 1.4rem;
		border: 1px solid var(--border);
		border-radius: 24px;
		background: color-mix(in srgb, var(--bg-card) 86%, transparent);
		box-shadow: var(--card-shadow);
		color: var(--text-primary);
		text-decoration: none;
		overflow: hidden;
		transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.22s ease,
			border-color 0.22s ease;
	}
	.card:hover {
		transform: translateY(-4px);
		border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
		box-shadow: var(--card-shadow-hover);
	}
	/* thread drawing across the top on hover */
	.card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: linear-gradient(90deg, var(--ocean), var(--indigo));
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.card:hover::before {
		transform: scaleX(1);
	}

	.card-name {
		font-family: var(--font-handwriting);
		font-size: 1.7rem;
		line-height: 1;
		color: var(--text-primary);
	}
	.card-score {
		position: absolute;
		top: 1.35rem;
		right: 1.4rem;
		font-family: var(--font-mono);
		font-size: 0.82rem;
		font-weight: 700;
		padding: 0.18rem 0.5rem;
		border-radius: 999px;
		color: var(--text-muted);
		background: var(--bg-secondary);
	}
	.card-score[data-pass='true'] {
		color: var(--emerald);
		background: color-mix(in srgb, var(--emerald) 14%, transparent);
	}
	.card-desc {
		align-self: start;
		color: var(--text-secondary);
		font-size: 0.96rem;
		line-height: 1.5;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		overflow: hidden;
	}
	.card-foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}
	.card-tag {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--text-muted);
	}
	.card-go {
		font-family: var(--font-mono);
		font-size: 0.76rem;
		font-weight: 700;
		color: var(--accent);
		opacity: 0;
		transform: translateX(-4px);
		transition: opacity 0.22s ease, transform 0.22s ease;
	}
	.card:hover .card-go {
		opacity: 1;
		transform: translateX(0);
	}
	.card-go i {
		font-style: normal;
		transition: transform 0.22s ease;
	}
	.card:hover .card-go i {
		transform: translateX(3px);
	}

	.empty {
		text-align: center;
		padding: 5rem 0;
	}
	.empty-text {
		font-size: 1.15rem;
		color: var(--text-secondary);
		margin-bottom: 0.75rem;
	}
	.empty-link {
		font-weight: 700;
		color: var(--accent);
	}

	@media (prefers-reduced-motion: reduce) {
		.card,
		.card::before,
		.card-go {
			transition: none !important;
		}
	}

	@media (max-width: 560px) {
		.browse-page {
			padding: 6rem 1rem 4rem;
		}
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
