<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import { getPluginScore } from '$lib/eval-scores';

	let { data } = $props();
	let activeTab = $state<'skills' | 'plugins'>('plugins');
	let sourceFilter = $state<'all' | 'loooom' | 'skills.sh'>('all');

	// --- Sorting ---
	type PluginSortKey = 'score' | 'name' | 'skills' | 'category' | 'author';
	type SkillSortKey = 'installs' | 'name' | 'category' | 'author';

	let pluginSort = $state<{ key: PluginSortKey; dir: 1 | -1 }>({ key: 'score', dir: -1 });
	let skillSort = $state<{ key: SkillSortKey; dir: 1 | -1 }>({ key: 'installs', dir: -1 });

	function togglePluginSort(key: PluginSortKey) {
		if (pluginSort.key === key) {
			pluginSort = { key, dir: pluginSort.dir === 1 ? -1 : 1 };
		} else {
			pluginSort = { key, dir: -1 };
		}
	}

	function toggleSkillSort(key: SkillSortKey) {
		if (skillSort.key === key) {
			skillSort = { key, dir: skillSort.dir === 1 ? -1 : 1 };
		} else {
			skillSort = { key, dir: -1 };
		}
	}

	const sortedPlugins = $derived(() => {
		const plugins = [...data.plugins].filter(p =>
			sourceFilter === 'all' || p.source === sourceFilter
		);
		return plugins.sort((a, b) => {
			const dir = pluginSort.dir;
			if (pluginSort.key === 'score') {
				const sa = getPluginScore(data.evalScores, a.author, a.name)?.score ?? -1;
				const sb = getPluginScore(data.evalScores, b.author, b.name)?.score ?? -1;
				return (sa - sb) * dir;
			}
			if (pluginSort.key === 'skills') {
				return (a.skills.length - b.skills.length) * dir;
			}
			if (pluginSort.key === 'name') {
				return a.title.localeCompare(b.title) * dir;
			}
			if (pluginSort.key === 'category') {
				return a.category.localeCompare(b.category) * dir;
			}
			if (pluginSort.key === 'author') {
				return a.author.localeCompare(b.author) * dir;
			}
			return 0;
		});
	});

	const sortedSkills = $derived(() => {
		const skills = [...data.skills];
		return skills.sort((a, b) => {
			const dir = skillSort.dir;
			if (skillSort.key === 'installs') return (a.installs - b.installs) * dir;
			if (skillSort.key === 'name') return a.title.localeCompare(b.title) * dir;
			if (skillSort.key === 'category') return (a.category ?? '').localeCompare(b.category ?? '') * dir;
			if (skillSort.key === 'author') return (a.author?.displayName ?? '').localeCompare(b.author?.displayName ?? '') * dir;
			return 0;
		});
	});

	function sortIcon(key: string, current: { key: string; dir: number }) {
		if (current.key !== key) return '↕';
		return current.dir === -1 ? '↓' : '↑';
	}

	function scoreColor(score: number | null) {
		if (score === null) return 'score-none';
		if (score >= 80) return 'score-green';
		if (score >= 50) return 'score-yellow';
		return 'score-red';
	}

	// --- Copy to clipboard ---
	let copiedKey = $state<string | null>(null);

	async function copyInstall(text: string, key: string, e: MouseEvent) {
		e.stopPropagation();
		try {
			await navigator.clipboard.writeText(text);
			copiedKey = key;
			setTimeout(() => { copiedKey = null; }, 1800);
		} catch {
			// fallback: select the text
		}
	}
</script>

<svelte:head>
	<title>Browse Claude Code Skills{data.activeCategory ? ` — ${data.activeCategory}` : ''} — Loooom</title>
	<meta name="description" content="Discover Claude Code skills for learning languages, writing, design, thinking, and more. Install any skill in seconds and supercharge your AI agent." />
	<meta name="keywords" content="claude code skills, AI skills, agent plugins, loooom marketplace, claude code plugins" />
	<link rel="canonical" href="https://loooom.xyz/browse" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Browse Claude Code Skills — Loooom" />
	<meta property="og:description" content="Discover Claude Code skills for learning languages, writing, design, thinking, and more. Install any skill in seconds." />
	<meta property="og:url" content="https://loooom.xyz/browse" />
	<meta property="og:image" content="https://loooom.xyz/og.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Browse Claude Code Skills — Loooom" />
	<meta name="twitter:description" content="Discover Claude Code skills for learning languages, writing, design, thinking, and more." />
	<meta name="twitter:image" content="https://loooom.xyz/og.png" />
	<meta name="twitter:site" content="@mager" />
</svelte:head>

<div class="ambient">
	<div class="orb orb-1"></div>
	<div class="orb orb-2"></div>
</div>

<Nav />

<section class="browse-page">
	<div class="browse-inner">
		<div class="page-header">
			<h1 class="handwriting">
				{#if data.activeCategory}
					{data.activeCategory} <span class="sketch">skills</span>
				{:else}
					Browse <span class="sketch">skills</span>
				{/if}
			</h1>
			<p class="page-subtitle">
				{data.plugins.length + data.skills.length} skills · sorted by quality
			</p>
		</div>

		<!-- Tabs -->
		<div class="tabs">
			<button class="tab" class:active={activeTab === 'plugins'} onclick={() => activeTab = 'plugins'}>
				Plugins <span class="tab-count">{data.plugins.length}</span>
			</button>
			<button class="tab" class:active={activeTab === 'skills'} onclick={() => activeTab = 'skills'}>
				Skills <span class="tab-count">{data.skills.length}</span>
			</button>
		</div>

		<!-- Source Filter (plugins only) -->
		{#if activeTab === 'plugins'}
			<div class="source-filters">
				<button class="source-pill" class:active={sourceFilter === 'all'} onclick={() => sourceFilter = 'all'}>All sources</button>
				<button class="source-pill source-loooom" class:active={sourceFilter === 'loooom'} onclick={() => sourceFilter = 'loooom'}>🧶 Loooom</button>
				<button class="source-pill source-skillssh" class:active={sourceFilter === 'skills.sh'} onclick={() => sourceFilter = 'skills.sh'}>skills.sh</button>
			</div>
		{/if}

		<!-- Category Filter -->
		<div class="categories">
			<a href="/browse" class="cat-pill" class:active={!data.activeCategory}>All</a>
			{#if activeTab === 'plugins'}
				{#each data.catalogCategories as cat}
					<a href="/browse?category={cat}" class="cat-pill" class:active={data.activeCategory === cat}>{cat}</a>
				{/each}
			{:else}
				{#each data.categories as cat}
					<a href="/browse?category={cat}" class="cat-pill" class:active={data.activeCategory === cat}>{cat}</a>
				{/each}
			{/if}
		</div>

		<!-- Plugins Table -->
		{#if activeTab === 'plugins'}
			{#if data.plugins.length === 0}
				<div class="empty">
					<p class="empty-text">No plugins found.</p>
				</div>
			{:else}
				<div class="table-wrap">
					<table class="data-table">
						<thead>
							<tr>
								<th class="col-name">
									<button class="sort-btn" onclick={() => togglePluginSort('name')}>
										Plugin <span class="sort-icon">{sortIcon('name', pluginSort)}</span>
									</button>
								</th>
								<th class="col-author">
									<button class="sort-btn" onclick={() => togglePluginSort('author')}>
										Author <span class="sort-icon">{sortIcon('author', pluginSort)}</span>
									</button>
								</th>
								<th class="col-category">
									<button class="sort-btn" onclick={() => togglePluginSort('category')}>
										Category <span class="sort-icon">{sortIcon('category', pluginSort)}</span>
									</button>
								</th>
								<th class="col-skills">
									<button class="sort-btn" onclick={() => togglePluginSort('skills')}>
										Skills <span class="sort-icon">{sortIcon('skills', pluginSort)}</span>
									</button>
								</th>
								<th class="col-score">
									<button class="sort-btn" onclick={() => togglePluginSort('score')}>
										Quality <span class="sort-icon">{sortIcon('score', pluginSort)}</span>
									</button>
								</th>
								<th class="col-install">Install</th>
							</tr>
						</thead>
						<tbody>
							{#each sortedPlugins() as plugin}
								{@const score = getPluginScore(data.evalScores, plugin.author, plugin.name)}
								<tr class="table-row" onclick={() => window.location.href = `/p/${plugin.author}/${plugin.name}`} role="link" tabindex="0" onkeydown={(e) => e.key === 'Enter' && (window.location.href = `/p/${plugin.author}/${plugin.name}`)}>
									<td class="col-name">
										<div class="plugin-name-cell">
											<span class="plugin-emoji">{plugin.emoji}</span>
											<div>
												<div class="plugin-title-row">
													<span class="plugin-title">{plugin.title}</span>
													{#if plugin.source === 'skills.sh'}
														<span class="source-badge-sm">skills.sh</span>
													{/if}
												</div>
												<div class="plugin-desc-short">{plugin.description.slice(0, 72)}{plugin.description.length > 72 ? '…' : ''}</div>
											</div>
										</div>
									</td>
									<td class="col-author">
										<span class="cell-author">@{plugin.author}</span>
									</td>
									<td class="col-category">
										<span class="cat-badge">{plugin.category}</span>
									</td>
									<td class="col-skills">
										<span class="cell-num">{plugin.skills.length}</span>
									</td>
									<td class="col-score">
										{#if score}
											<span class="score-badge {scoreColor(score.score)}" title="{score.passed}/{score.total} tests passing">
												{score.score}%
											</span>
										{:else}
											<span class="score-badge score-none">—</span>
										{/if}
									</td>
									<td class="col-install" onclick={(e) => e.stopPropagation()}>
										{#if plugin.source === 'skills.sh'}
											<div class="dual-install">
												<button
													class="install-code copy-btn"
													class:copied={copiedKey === `${plugin.author}/${plugin.name}`}
													onclick={(e) => copyInstall(plugin.installCommand, `${plugin.author}/${plugin.name}`, e)}
													title="Click to copy"
												>
													<span class="install-text">{plugin.installCommand}</span>
													<span class="copy-icon">{copiedKey === `${plugin.author}/${plugin.name}` ? '✓' : '⎘'}</span>
												</button>
												<a href={plugin.homepage} target="_blank" rel="noopener" class="source-link">View on skills.sh ↗</a>
											</div>
										{:else}
											<button
												class="install-code copy-btn"
												class:copied={copiedKey === `${plugin.author}/${plugin.name}`}
												onclick={(e) => copyInstall(plugin.installCommand, `${plugin.author}/${plugin.name}`, e)}
												title="Click to copy"
											>
												<span class="install-text">{plugin.installCommand}</span>
												<span class="copy-icon">{copiedKey === `${plugin.author}/${plugin.name}` ? '✓' : '⎘'}</span>
											</button>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		{:else}
			<!-- Skills Table -->
			{#if data.skills.length === 0}
				<div class="empty">
					<p class="empty-text">No skills found{data.activeCategory ? ` in ${data.activeCategory}` : ''}.</p>
					<p class="empty-hint">Be the first to <a href="/create">create one</a>!</p>
				</div>
			{:else}
				<div class="table-wrap">
					<table class="data-table">
						<thead>
							<tr>
								<th class="col-name">
									<button class="sort-btn" onclick={() => toggleSkillSort('name')}>
										Skill <span class="sort-icon">{sortIcon('name', skillSort)}</span>
									</button>
								</th>
								<th class="col-author">
									<button class="sort-btn" onclick={() => toggleSkillSort('author')}>
										Author <span class="sort-icon">{sortIcon('author', skillSort)}</span>
									</button>
								</th>
								<th class="col-category">
									<button class="sort-btn" onclick={() => toggleSkillSort('category')}>
										Category <span class="sort-icon">{sortIcon('category', skillSort)}</span>
									</button>
								</th>
								<th class="col-installs">
									<button class="sort-btn" onclick={() => toggleSkillSort('installs')}>
										Uses <span class="sort-icon">{sortIcon('installs', skillSort)}</span>
									</button>
								</th>
							</tr>
						</thead>
						<tbody>
							{#each sortedSkills() as skill}
								<tr class="table-row" onclick={() => window.location.href = `/s/${skill.author?.username}/${skill.name}`} role="link" tabindex="0" onkeydown={(e) => e.key === 'Enter' && (window.location.href = `/s/${skill.author?.username}/${skill.name}`)}>
									<td class="col-name">
										<div class="plugin-name-cell">
											<div>
												<div class="plugin-title">{skill.title}</div>
												{#if skill.description}
													<div class="plugin-desc-short">{skill.description.slice(0, 72)}{skill.description.length > 72 ? '…' : ''}</div>
												{/if}
											</div>
										</div>
									</td>
									<td class="col-author">
										<div class="author-cell">
											{#if skill.author}
												<div class="author-avatar-sm">
													{#if skill.author.avatarUrl}
														<img src={skill.author.avatarUrl} alt={skill.author.displayName} />
													{:else}
														{skill.author.displayName[0]}
													{/if}
												</div>
												<span class="cell-author">{skill.author.displayName}</span>
												{#if skill.author.verified}
													<span class="verified">✓</span>
												{/if}
											{:else}
												<span class="cell-author text-muted">—</span>
											{/if}
										</div>
									</td>
									<td class="col-category">
										{#if skill.category}
											<span class="cat-badge">{skill.category}</span>
										{:else}
											<span class="text-muted">—</span>
										{/if}
									</td>
									<td class="col-installs">
										<span class="cell-num">{skill.installs.toLocaleString()}</span>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		{/if}
	</div>
</section>

<style>
	/* ---- Ambient ---- */
	.ambient { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
	.orb { position: absolute; border-radius: 50%; filter: blur(140px); opacity: 0.06; }
	:global(html[data-theme="dark"]) .orb { opacity: 0.12; }
	.orb-1 { width: 500px; height: 500px; background: var(--accent); top: -100px; left: -100px; animation: drift 25s ease-in-out infinite; }
	.orb-2 { width: 400px; height: 400px; background: var(--indigo); bottom: 10%; right: -100px; animation: drift 30s ease-in-out infinite reverse; opacity: 0.06; }
	@keyframes drift { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, -20px); } }

	/* ---- Nav ---- */
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

	/* ---- Typography ---- */
	.handwriting { font-family: var(--font-handwriting); font-weight: 100; text-shadow: 0 0.5px 0 rgba(0,0,0,0.06); }
	:global(html[data-theme="dark"]) .handwriting { text-shadow: 0 0.5px 0 rgba(255,255,255,0.08); }
	.sketch { font-family: var(--font-sketch); font-weight: 400; color: var(--ocean); }

	/* ---- Page Layout ---- */
	.browse-page { position: relative; z-index: 1; min-height: 100vh; padding: 7rem 2rem 4rem; }
	.browse-inner { max-width: 1200px; margin: 0 auto; }

	.page-header { margin-bottom: 1.5rem; }
	.page-header h1 { font-size: clamp(2rem, 4vw, 3rem); margin-bottom: 0.25rem; color: var(--text-primary); }
	.page-subtitle { font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted); }

	/* ---- Tabs ---- */
	.tabs { display: flex; gap: 0; margin-bottom: 1.25rem; border-bottom: 1px solid var(--border); }
	.tab { background: none; border: none; border-bottom: 2px solid transparent; padding: 0.75rem 1.5rem; font-family: var(--font-display); font-size: 0.95rem; font-weight: 600; color: var(--text-secondary); cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 0.5rem; }
	.tab:hover { color: var(--text-primary); }
	.tab.active { color: var(--text-primary); border-bottom-color: var(--accent); }
	.tab-count { background: var(--bg-secondary); color: var(--text-muted); border-radius: 100px; padding: 0.1rem 0.5rem; font-size: 0.72rem; font-family: var(--font-mono); }
	.tab.active .tab-count { background: color-mix(in srgb, var(--accent) 15%, transparent); color: var(--accent); }

	/* ---- Category Pills ---- */
	.categories { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; }
	.cat-pill {
		padding: 0.4rem 1rem; border-radius: 100px; background: var(--bg-card);
		border: 1px solid var(--border); color: var(--text-secondary);
		font-family: var(--font-handwriting); font-size: 0.95rem; cursor: pointer;
		transition: all 0.2s; text-decoration: none;
	}
	.cat-pill:hover { border-color: var(--text-secondary); color: var(--text-primary); }
	.cat-pill.active { background: var(--accent); color: white; border-color: var(--accent); }
	:global(html[data-theme="dark"]) .cat-pill.active { color: var(--bg-primary); }

	/* ---- Empty ---- */
	.empty { text-align: center; padding: 4rem 0; }
	.empty-text { font-size: 1.2rem; color: var(--text-secondary); margin-bottom: 0.5rem; }
	.empty-hint { color: var(--text-muted); }

	/* ---- Data Table ---- */
	.table-wrap {
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		overflow-x: auto;
		background: var(--bg-card);
	}

	.data-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}

	.data-table thead {
		background: var(--bg-secondary);
		border-bottom: 1px solid var(--border);
	}

	.data-table th {
		padding: 0;
		text-align: left;
		font-weight: 600;
		color: var(--text-muted);
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.sort-btn {
		background: none;
		border: none;
		padding: 0.75rem 1rem;
		width: 100%;
		text-align: left;
		cursor: pointer;
		color: var(--text-muted);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		font-family: var(--font-display);
		display: flex;
		align-items: center;
		gap: 0.35rem;
		transition: color 0.15s;
	}
	.sort-btn:hover { color: var(--text-primary); }

	.sort-icon {
		font-size: 0.65rem;
		opacity: 0.5;
		font-style: normal;
	}

	.data-table th:last-child .sort-btn,
	.data-table th:last-child {
		padding-right: 1.25rem;
	}

	.data-table tbody tr {
		border-bottom: 1px solid var(--border);
		transition: background 0.15s;
	}
	.data-table tbody tr:last-child { border-bottom: none; }

	.table-row {
		cursor: pointer;
	}
	.table-row:hover { background: color-mix(in srgb, var(--accent) 4%, var(--bg-card)); }
	.table-row:focus { outline: 2px solid var(--accent); outline-offset: -2px; }

	.data-table td {
		padding: 0.875rem 1rem;
		vertical-align: middle;
		color: var(--text-secondary);
	}

	/* ---- Column Widths ---- */
	.col-name { width: 35%; min-width: 220px; }
	.col-author { width: 12%; white-space: nowrap; }
	.col-category { width: 12%; }
	.col-skills, .col-installs { width: 8%; text-align: center; }
	.col-score { width: 10%; text-align: center; }
	.col-install { width: 23%; min-width: 210px; }

	/* ---- Cell Content ---- */
	.plugin-name-cell { display: flex; align-items: flex-start; gap: 0.75rem; }
	.plugin-emoji { font-size: 1.5rem; line-height: 1; flex-shrink: 0; margin-top: 0.1rem; }
	.plugin-title { font-weight: 700; color: var(--text-primary); font-size: 0.9rem; margin-bottom: 0.2rem; }
	.plugin-desc-short { font-size: 0.75rem; color: var(--text-muted); line-height: 1.35; }

	.cell-author { font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-secondary); }
	.text-muted { color: var(--text-muted); }

	.cat-badge {
		display: inline-block;
		padding: 0.2rem 0.6rem;
		border-radius: 100px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		font-size: 0.68rem;
		font-weight: 500;
		color: var(--text-muted);
		text-transform: capitalize;
		white-space: nowrap;
	}

	.cell-num {
		font-family: var(--font-mono);
		font-size: 0.82rem;
		color: var(--text-secondary);
		display: block;
		text-align: center;
	}

	/* ---- Score Badge ---- */
	.score-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.2rem 0.55rem;
		border-radius: 100px;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 600;
		min-width: 44px;
	}
	.score-green { background: rgba(34, 197, 94, 0.12); color: #16a34a; border: 1px solid rgba(34, 197, 94, 0.3); }
	.score-yellow { background: rgba(234, 179, 8, 0.12); color: #ca8a04; border: 1px solid rgba(234, 179, 8, 0.3); }
	.score-red { background: rgba(239, 68, 68, 0.12); color: #dc2626; border: 1px solid rgba(239, 68, 68, 0.3); }
	.score-none { background: var(--bg-secondary); color: var(--text-muted); border: 1px solid var(--border); }

	:global(html[data-theme="dark"]) .score-green { background: rgba(34, 197, 94, 0.15); color: #4ade80; border-color: rgba(34, 197, 94, 0.25); }
	:global(html[data-theme="dark"]) .score-yellow { background: rgba(234, 179, 8, 0.15); color: #facc15; border-color: rgba(234, 179, 8, 0.25); }
	:global(html[data-theme="dark"]) .score-red { background: rgba(239, 68, 68, 0.15); color: #f87171; border-color: rgba(239, 68, 68, 0.25); }

	/* ---- Source Filters ---- */
	.source-filters {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}
	.source-pill {
		background: none;
		border: 1px solid var(--border);
		border-radius: 999px;
		padding: 0.3rem 0.85rem;
		font-size: 0.78rem;
		font-weight: 500;
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 0.2s;
		font-family: var(--font-display);
	}
	.source-pill:hover { border-color: var(--text-secondary); color: var(--text-primary); }
	.source-pill.active { background: var(--accent); color: white; border-color: var(--accent); }
	:global(html[data-theme="dark"]) .source-pill.active { color: var(--bg-primary); }

	/* ---- Source badge in name cell ---- */
	.plugin-title-row { display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.2rem; }
	.source-badge-sm {
		font-size: 0.58rem;
		font-weight: 600;
		padding: 0.1rem 0.4rem;
		border-radius: 999px;
		background: rgba(108, 92, 231, 0.08);
		border: 1px solid rgba(108, 92, 231, 0.2);
		color: var(--accent);
		white-space: nowrap;
		letter-spacing: 0.04em;
	}

	/* ---- Dual install ---- */
	.dual-install { display: flex; flex-direction: column; gap: 0.3rem; }
	.source-link {
		font-size: 0.65rem;
		color: var(--accent);
		text-decoration: none;
		font-weight: 500;
		opacity: 0.75;
		transition: opacity 0.15s;
	}
	.source-link:hover { opacity: 1; }

	/* ---- Install Code / Copy Button ---- */
	.install-code {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--text-muted);
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 4px;
		padding: 0.25rem 0.5rem;
		white-space: nowrap;
		display: inline-block;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.copy-btn {
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		max-width: 100%;
		transition: border-color 0.15s, background 0.15s, color 0.15s;
		overflow: hidden;
	}
	.copy-btn:hover {
		border-color: var(--accent);
		color: var(--accent);
		background: color-mix(in srgb, var(--accent) 6%, var(--bg-secondary));
	}
	.copy-btn.copied {
		border-color: #16a34a;
		color: #16a34a;
		background: rgba(34, 197, 94, 0.08);
	}
	:global(html[data-theme="dark"]) .copy-btn.copied {
		color: #4ade80;
		border-color: #4ade80;
		background: rgba(34, 197, 94, 0.12);
	}
	.install-text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		flex: 1;
	}
	.copy-icon {
		font-size: 0.75rem;
		flex-shrink: 0;
		opacity: 0.6;
	}
	.copy-btn:hover .copy-icon,
	.copy-btn.copied .copy-icon {
		opacity: 1;
	}

	/* ---- Author Cell (Skills) ---- */
	.author-cell { display: flex; align-items: center; gap: 0.4rem; }
	.author-avatar-sm {
		width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
		background: linear-gradient(135deg, var(--ocean), var(--indigo));
		display: flex; align-items: center; justify-content: center;
		font-size: 0.6rem; color: white; overflow: hidden;
	}
	.author-avatar-sm img { width: 100%; height: 100%; object-fit: cover; }
	.verified { display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; border-radius: 50%; background: var(--emerald); color: white; font-size: 0.5rem; font-weight: 700; }

	/* ---- Mobile ---- */
	@media (max-width: 768px) {
		.col-install { display: none; }
		.col-score { display: none; }
		.plugin-desc-short { display: none; }
		.nav-right a:not(.btn-nav):not(:global(.theme-toggle)) { display: none; }
	}
	@media (max-width: 500px) {
		.col-author { display: none; }
		.col-category { display: none; }
	}
</style>
