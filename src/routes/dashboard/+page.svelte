<script lang="ts">
	import YarnLogo from '$lib/components/YarnLogo.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	let { data } = $props();
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
			<YarnLogo size={22} />
			<span class="logo-text">loooom</span>
		</a>
		<div class="nav-right">
			<ThemeToggle />
			<div class="user-chip">
				{#if data.profile.avatarUrl}
					<img src={data.profile.avatarUrl} alt="" class="user-chip-avatar" />
				{:else}
					<span class="user-chip-initial">{data.profile.displayName[0]}</span>
				{/if}
				<span class="user-chip-name">{data.profile.displayName}</span>
			</div>
		</div>
	</div>
</nav>

<main class="page">
	<div class="card">
		<div class="badge">Early Access</div>

		<div class="avatar-wrap">
			{#if data.profile.avatarUrl}
				<img src={data.profile.avatarUrl} alt={data.profile.displayName} class="avatar" />
			{:else}
				<div class="avatar-fallback">{data.profile.displayName[0]}</div>
			{/if}
			<div class="avatar-badge" title="GitHub connected">
				<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
				</svg>
			</div>
		</div>

		<h1 class="heading">You're on the list, {data.profile.displayName.split(' ')[0]}.</h1>
		<p class="sub">
			Loooom is in early access. We're heads-down building creator tools — the skill editor,
			publishing flow, and community features. You'll hear from us first when it opens up.
		</p>

		<div class="checks">
			<div class="check-row">
				<span class="check-icon">✓</span>
				<span>GitHub account connected</span>
			</div>
			<div class="check-row">
				<span class="check-icon">✓</span>
				<span>Spot reserved as <code>@{data.profile.username}</code></span>
			</div>
			<div class="check-row pending">
				<span class="check-icon pending">◎</span>
				<span>Creator tools — coming soon</span>
			</div>
		</div>

		<div class="actions">
			<a href="/browse" class="btn-primary">Browse skills →</a>
			<a
				href="https://github.com/mager/loooom"
				target="_blank"
				rel="noopener"
				class="btn-secondary"
			>Star us on GitHub</a>
		</div>
	</div>
</main>

<style>
	.ambient { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
	.orb { position: absolute; border-radius: 50%; filter: blur(140px); opacity: 0.06; }
	:global(html[data-theme="dark"]) .orb { opacity: 0.12; }
	.orb-1 { width: 500px; height: 500px; background: var(--accent); top: -100px; right: -100px; animation: drift 25s ease-in-out infinite; }
	.orb-2 { width: 400px; height: 400px; background: var(--ocean); bottom: 10%; left: -100px; animation: drift 30s ease-in-out infinite reverse; }
	@keyframes drift { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, -20px); } }

	nav {
		position: fixed; top: 0; left: 0; right: 0; z-index: 100;
		backdrop-filter: blur(20px); background: var(--nav-bg);
		border-bottom: 1px solid var(--border);
	}
	.nav-inner {
		max-width: 1200px; margin: 0 auto; padding: 0 2rem;
		height: 64px; display: flex; align-items: center; justify-content: space-between;
	}
	.logo { display: flex; align-items: center; gap: 0.5rem; color: var(--text-primary); text-decoration: none; }
	.logo-text { font-family: var(--font-handwriting); font-size: 1.3rem; font-weight: 100; letter-spacing: 0.02em; }
	.nav-right { display: flex; align-items: center; gap: 1rem; }

	.user-chip {
		display: flex; align-items: center; gap: 0.5rem;
		background: var(--bg-card); border: 1px solid var(--border);
		padding: 0.35rem 1rem 0.35rem 0.35rem; border-radius: 100px;
		color: var(--text-primary);
	}
	.user-chip-avatar { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; }
	.user-chip-initial {
		width: 28px; height: 28px; border-radius: 50%;
		background: linear-gradient(135deg, var(--accent), var(--ocean));
		display: flex; align-items: center; justify-content: center;
		color: white; font-size: 0.75rem; font-weight: 600;
	}
	.user-chip-name { font-size: 0.85rem; font-weight: 500; }

	.page {
		position: relative; z-index: 1;
		min-height: 100vh;
		display: flex; align-items: center; justify-content: center;
		padding: 6rem 2rem 4rem;
	}

	.card {
		width: 100%; max-width: 480px;
		background: var(--bg-card); border: 1px solid var(--border);
		border-radius: var(--radius-lg); padding: 3rem 2.5rem;
		text-align: center;
		box-shadow: 0 4px 40px rgba(0,0,0,0.06);
	}
	:global(html[data-theme="dark"]) .card {
		box-shadow: 0 4px 40px rgba(0,0,0,0.3);
	}

	.badge {
		display: inline-block;
		font-family: var(--font-mono); font-size: 0.65rem; text-transform: uppercase;
		letter-spacing: 0.12em; color: var(--accent); background: color-mix(in srgb, var(--accent) 10%, transparent);
		border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
		padding: 0.3rem 0.75rem; border-radius: 100px; margin-bottom: 2rem;
	}

	.avatar-wrap {
		position: relative; display: inline-block; margin-bottom: 1.75rem;
	}
	.avatar {
		width: 80px; height: 80px; border-radius: 50%; object-fit: cover;
		border: 3px solid var(--border);
	}
	.avatar-fallback {
		width: 80px; height: 80px; border-radius: 50%;
		background: linear-gradient(135deg, var(--accent), var(--ocean));
		display: flex; align-items: center; justify-content: center;
		font-size: 2rem; color: white; font-weight: 700;
		border: 3px solid var(--border);
	}
	.avatar-badge {
		position: absolute; bottom: 2px; right: 2px;
		width: 24px; height: 24px; border-radius: 50%;
		background: var(--text-primary); color: var(--bg-primary);
		display: flex; align-items: center; justify-content: center;
		border: 2px solid var(--bg-card);
	}

	.heading {
		font-family: var(--font-handwriting); font-weight: 100;
		font-size: clamp(1.6rem, 4vw, 2.2rem);
		color: var(--text-primary); margin-bottom: 1rem;
	}
	.sub {
		font-size: 0.9rem; color: var(--text-secondary); line-height: 1.65;
		margin-bottom: 2rem;
	}

	.checks {
		display: flex; flex-direction: column; gap: 0.6rem;
		text-align: left; margin-bottom: 2.5rem;
		padding: 1.25rem 1.5rem;
		background: var(--bg-primary); border-radius: var(--radius-md);
		border: 1px solid var(--border);
	}
	.check-row {
		display: flex; align-items: center; gap: 0.75rem;
		font-size: 0.875rem; color: var(--text-primary);
	}
	.check-row.pending { color: var(--text-muted); }
	.check-icon {
		color: var(--emerald); font-weight: 700; flex-shrink: 0; width: 16px;
	}
	.check-icon.pending { color: var(--text-muted); }
	code {
		font-family: var(--font-mono); font-size: 0.8em;
		background: var(--bg-card); border: 1px solid var(--border);
		padding: 0.1em 0.4em; border-radius: 4px;
	}

	.actions {
		display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;
	}
	.btn-primary {
		display: inline-flex; align-items: center; gap: 0.4rem;
		padding: 0.75rem 1.5rem; background: var(--accent); color: white;
		border: none; border-radius: var(--radius-md); font-family: var(--font-display);
		font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s;
	}
	.btn-primary:hover { background: var(--accent-bright); transform: translateY(-1px); color: white; }
	:global(html[data-theme="dark"]) .btn-primary { color: var(--bg-primary); }
	:global(html[data-theme="dark"]) .btn-primary:hover { color: var(--bg-primary); }
	.btn-secondary {
		display: inline-flex; align-items: center; gap: 0.4rem;
		padding: 0.75rem 1.5rem; background: var(--bg-primary); color: var(--text-primary);
		border: 1px solid var(--border); border-radius: var(--radius-md); font-family: var(--font-display);
		font-size: 0.9rem; font-weight: 500; text-decoration: none; transition: all 0.2s;
	}
	.btn-secondary:hover { border-color: var(--text-secondary); color: var(--text-primary); }
</style>
