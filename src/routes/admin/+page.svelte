<script lang="ts">
	import YarnLogo from '$lib/components/YarnLogo.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	let { data } = $props();

	function relativeTime(date: string | Date): string {
		const diff = Date.now() - new Date(date).getTime();
		const mins = Math.floor(diff / 60000);
		if (mins < 60) return `${mins}m ago`;
		const hours = Math.floor(diff / 3600000);
		if (hours < 24) return `${hours}h ago`;
		const days = Math.floor(diff / 86400000);
		if (days < 7) return `${days}d ago`;
		return new Date(date).toLocaleDateString();
	}

	let activeTab = $state<'users' | 'skills' | 'plugins' | 'waitlist'>('users');
</script>

<svelte:head>
	<title>Admin — Loooom</title>
</svelte:head>

<nav>
	<div class="nav-inner">
		<a href="/" class="logo">
			<YarnLogo size={28} />
			<span class="logo-text">loooom</span>
		</a>
		<div class="nav-right">
			<span class="admin-badge">⚡ admin</span>
			<ThemeToggle />
		</div>
	</div>
</nav>

<main class="admin">
	<header class="admin-header">
		<h1 class="handwriting">Mission Control</h1>
		<p class="subtitle">The full picture.</p>
	</header>

	<!-- Stats Grid -->
	<section class="stats-grid">
		<div class="stat-card">
			<span class="stat-value">{data.stats.totalUsers}</span>
			<span class="stat-label">Total Users</span>
			{#if data.stats.newUsersThisWeek > 0}
				<span class="stat-badge">+{data.stats.newUsersThisWeek} this week</span>
			{/if}
		</div>
		<div class="stat-card">
			<span class="stat-value">{data.stats.totalWaitlist}</span>
			<span class="stat-label">Waitlist</span>
			{#if data.stats.newWaitlistThisWeek > 0}
				<span class="stat-badge">+{data.stats.newWaitlistThisWeek} this week</span>
			{/if}
		</div>
		<div class="stat-card">
			<span class="stat-value">{data.stats.publishedSkills}<span class="stat-sub">/{data.stats.totalSkills}</span></span>
			<span class="stat-label">Skills Published</span>
		</div>
		<div class="stat-card">
			<span class="stat-value">{data.stats.publishedPlugins}<span class="stat-sub">/{data.stats.totalPlugins}</span></span>
			<span class="stat-label">Plugins Published</span>
		</div>
		<div class="stat-card stat-wide">
			<span class="stat-value">{data.stats.totalInstalls.toLocaleString()}</span>
			<span class="stat-label">Total Installs</span>
		</div>
	</section>

	<!-- Tabs -->
	<div class="tabs">
		<button class="tab" class:active={activeTab === 'users'} onclick={() => activeTab = 'users'}>
			Users <span class="tab-count">{data.stats.totalUsers}</span>
		</button>
		<button class="tab" class:active={activeTab === 'skills'} onclick={() => activeTab = 'skills'}>
			Skills <span class="tab-count">{data.stats.totalSkills}</span>
		</button>
		<button class="tab" class:active={activeTab === 'plugins'} onclick={() => activeTab = 'plugins'}>
			Plugins <span class="tab-count">{data.stats.totalPlugins}</span>
		</button>
		<button class="tab" class:active={activeTab === 'waitlist'} onclick={() => activeTab = 'waitlist'}>
			Waitlist <span class="tab-count">{data.stats.totalWaitlist}</span>
		</button>
	</div>

	<!-- Tables -->
	{#if activeTab === 'users'}
		<div class="table-wrap">
			<table>
				<thead>
					<tr>
						<th>Username</th>
						<th>Display Name</th>
						<th>Email</th>
						<th>Verified</th>
						<th>Joined</th>
					</tr>
				</thead>
				<tbody>
					{#each data.users as u}
						<tr>
							<td><a href="/u/{u.username}" class="link">@{u.username}</a></td>
							<td>{u.displayName}</td>
							<td class="muted">{u.email ?? '—'}</td>
							<td>
								{#if u.verified}
									<span class="badge badge-green">✓ verified</span>
								{:else}
									<span class="badge badge-muted">—</span>
								{/if}
							</td>
							<td class="muted">{relativeTime(u.createdAt)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	{#if activeTab === 'skills'}
		<div class="table-wrap">
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Title</th>
						<th>Category</th>
						<th>Installs</th>
						<th>Status</th>
						<th>Created</th>
					</tr>
				</thead>
				<tbody>
					{#each data.skills as s}
						<tr>
							<td class="mono">{s.name}</td>
							<td>{s.title}</td>
							<td class="muted">{s.category ?? '—'}</td>
							<td>{s.installs.toLocaleString()}</td>
							<td>
								{#if s.isPublished}
									<span class="badge badge-green">published</span>
								{:else}
									<span class="badge badge-muted">draft</span>
								{/if}
							</td>
							<td class="muted">{relativeTime(s.createdAt)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	{#if activeTab === 'plugins'}
		<div class="table-wrap">
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Title</th>
						<th>Category</th>
						<th>Status</th>
						<th>Created</th>
					</tr>
				</thead>
				<tbody>
					{#each data.plugins as p}
						<tr>
							<td class="mono">{p.name}</td>
							<td>{p.title}</td>
							<td class="muted">{p.category ?? '—'}</td>
							<td>
								{#if p.isPublished}
									<span class="badge badge-green">published</span>
								{:else}
									<span class="badge badge-muted">draft</span>
								{/if}
							</td>
							<td class="muted">{relativeTime(p.createdAt)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	{#if activeTab === 'waitlist'}
		<div class="table-wrap">
			<table>
				<thead>
					<tr>
						<th>Email</th>
						<th>Signed up</th>
					</tr>
				</thead>
				<tbody>
					{#each data.waitlist as w}
						<tr>
							<td>{w.email}</td>
							<td class="muted">{relativeTime(w.createdAt)}</td>
						</tr>
					{/each}
					{#if data.waitlist.length === 0}
						<tr><td colspan="2" class="muted empty">No waitlist entries yet.</td></tr>
					{/if}
				</tbody>
			</table>
		</div>
	{/if}
</main>

<style>
	nav {
		position: sticky;
		top: 0;
		z-index: 100;
		background: var(--bg);
		border-bottom: 1px solid var(--border);
	}

	.nav-inner {
		max-width: 1100px;
		margin: 0 auto;
		padding: 0 1.5rem;
		height: 56px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		text-decoration: none;
		color: var(--text);
	}

	.logo-text {
		font-family: 'Playwrite IT Moderna', cursive;
		font-weight: 200;
		font-size: 1.15rem;
		letter-spacing: -0.01em;
	}

	.nav-right {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.admin-badge {
		font-family: 'Space Mono', monospace;
		font-size: 0.75rem;
		padding: 0.2rem 0.6rem;
		background: var(--ink);
		color: var(--bg);
		border-radius: 999px;
	}

	/* Main */
	.admin {
		max-width: 1100px;
		margin: 0 auto;
		padding: 2.5rem 1.5rem 5rem;
	}

	.admin-header {
		margin-bottom: 2rem;
	}

	.admin-header h1 {
		font-family: 'Playwrite IT Moderna', cursive;
		font-weight: 100;
		font-size: 2.2rem;
		line-height: 1.1;
		color: var(--ink);
		margin: 0 0 0.25rem;
	}

	.subtitle {
		color: var(--muted);
		font-size: 0.95rem;
		margin: 0;
	}

	/* Stats */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
		margin-bottom: 2.5rem;
	}

	.stat-wide {
		grid-column: 1 / -1;
	}

	.stat-card {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 1.25rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.stat-value {
		font-family: 'Space Mono', monospace;
		font-size: 2rem;
		font-weight: 700;
		color: var(--ink);
		line-height: 1;
	}

	.stat-sub {
		font-size: 1.1rem;
		color: var(--muted);
		font-weight: 400;
	}

	.stat-label {
		font-size: 0.8rem;
		color: var(--muted);
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.stat-badge {
		font-size: 0.72rem;
		color: #16a34a;
		background: #dcfce7;
		padding: 0.1rem 0.5rem;
		border-radius: 999px;
		width: fit-content;
		margin-top: 0.25rem;
	}

	/* Tabs */
	.tabs {
		display: flex;
		gap: 0.25rem;
		border-bottom: 1px solid var(--border);
		margin-bottom: 1.5rem;
	}

	.tab {
		background: none;
		border: none;
		padding: 0.65rem 1.1rem;
		font-size: 0.9rem;
		color: var(--muted);
		cursor: pointer;
		border-bottom: 2px solid transparent;
		margin-bottom: -1px;
		display: flex;
		align-items: center;
		gap: 0.4rem;
		transition: color 0.15s, border-color 0.15s;
	}

	.tab:hover {
		color: var(--ink);
	}

	.tab.active {
		color: var(--ink);
		border-bottom-color: var(--ink);
		font-weight: 600;
	}

	.tab-count {
		font-family: 'Space Mono', monospace;
		font-size: 0.7rem;
		background: var(--border);
		padding: 0.05rem 0.4rem;
		border-radius: 999px;
	}

	/* Table */
	.table-wrap {
		overflow-x: auto;
		border: 1px solid var(--border);
		border-radius: 12px;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}

	thead {
		background: var(--surface);
		border-bottom: 1px solid var(--border);
	}

	th {
		text-align: left;
		padding: 0.75rem 1rem;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--muted);
		font-weight: 600;
	}

	td {
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--border);
		color: var(--text);
		vertical-align: middle;
	}

	tr:last-child td {
		border-bottom: none;
	}

	tr:hover td {
		background: var(--surface);
	}

	.muted {
		color: var(--muted);
	}

	.mono {
		font-family: 'Space Mono', monospace;
		font-size: 0.8rem;
	}

	.link {
		color: var(--ink);
		text-decoration: none;
		font-weight: 500;
	}

	.link:hover {
		text-decoration: underline;
	}

	.badge {
		font-size: 0.7rem;
		padding: 0.15rem 0.5rem;
		border-radius: 999px;
		font-weight: 500;
	}

	.badge-green {
		background: #dcfce7;
		color: #16a34a;
	}

	.badge-muted {
		background: var(--border);
		color: var(--muted);
	}

	.empty {
		text-align: center;
		padding: 2rem;
	}

	@media (max-width: 700px) {
		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.stat-wide {
			grid-column: span 2;
		}
	}
</style>
