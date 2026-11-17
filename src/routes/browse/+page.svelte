<script lang="ts">

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
				A curated collection of {data.total} skill{data.total === 1 ? '' : 's'}, every one graded
				against the rubric before it ships. Copy one into any AI and start.
			</p>
		</header>

		{#if data.categories.length > 0}
			<nav class="categories" aria-label="Filter by category">
				<a href="/browse" class="cat-pill" class:active={!data.activeCategory} aria-current={!data.activeCategory ? 'page' : undefined}>All</a>
				{#each data.categories as cat}
					<a
						href="/browse?category={encodeURIComponent(cat)}"
						class="cat-pill"
						class:active={data.activeCategory === cat}
						aria-current={data.activeCategory === cat ? 'page' : undefined}>{cat}</a
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
				{#each data.skills as s}
					<a class="card" href={s.link}>
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
	.browse-page { padding: 54px 0 32px; }
	.browse-inner { max-width: 1200px; margin: 0 auto; min-width: 0; }
	.page-header { margin-bottom: 32px; }
	.page-header h1 { margin: 0 0 16px; font-size: clamp(36px, 4vw, 60px); font-weight: 500; line-height: 1.05; letter-spacing: -.035em; overflow-wrap: anywhere; }
	.handwriting { color: var(--lime); }
	.page-subtitle { max-width: 65ch; color: var(--quiet); font-size: 17px; line-height: 1.6; }
	.categories { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
	.cat-pill { display: inline-flex; align-items: center; min-height: 46px; padding: 10px 14px; border: 1px solid var(--line); border-radius: 6px; background: var(--panel); color: var(--quiet); font-size: 14px; transition: border-color .2s, background .2s; }
	.cat-pill:hover { border-color: var(--line-strong); color: var(--paper); }
	.cat-pill.active { border-color: var(--accent-border); background: var(--accent-soft); color: var(--lime); text-decoration: underline; text-underline-offset: 5px; }
	.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)); gap: 16px; }
	.card { display: grid; grid-template-columns: minmax(0, 1fr) auto; grid-template-rows: auto 1fr auto; gap: 16px 12px; min-height: 220px; padding: 24px; border: 1px solid var(--line); border-radius: 10px; background: var(--panel); color: var(--paper); transition: border-color .2s; }
	.card:hover { border-color: var(--line-strong); color: var(--paper); }
	.card-name { font-size: 25px; font-weight: 500; line-height: 1.15; letter-spacing: -.025em; overflow-wrap: anywhere; }
	.card-score { align-self: start; padding: 4px 7px; border: 1px solid var(--line); border-radius: 4px; background: var(--panel-raised); color: var(--quiet); font-family: var(--font-mono); font-size: 12px; font-variant-numeric: tabular-nums; }
	.card-score[data-pass='true'] { border-color: var(--accent-border); background: var(--accent-soft); color: var(--lime); }
	.card-desc { grid-column: 1 / -1; align-self: start; color: var(--quiet); font-size: 15px; line-height: 1.5; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; line-clamp: 3; overflow: hidden; overflow-wrap: anywhere; }
	.card-foot { grid-column: 1 / -1; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
	.card-tag { font-family: var(--font-mono); font-size: 11px; color: var(--quiet); overflow-wrap: anywhere; }
	.card-go { font-size: 13px; color: var(--lime); }
	.card-go i { font-style: normal; }
	.empty { padding: 48px 20px; border: 1px dashed var(--line); border-radius: 8px; }
	.empty-text { color: var(--quiet); font-size: 17px; margin-bottom: 16px; }
	.empty-link { display: inline-block; color: var(--lime); padding: 10px 0; }
	@media (max-width: 760px) { .browse-page { padding-top: 32px; } .card { padding: 20px; } }
	@media (prefers-reduced-motion: reduce) { .cat-pill, .card { transition: none; } }
</style>
