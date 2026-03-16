<script lang="ts">
	import YarnLogo from './YarnLogo.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
</script>

<nav>
	<div class="nav-inner">
		<a href="/" class="logo">
			<YarnLogo size={22} />
			<span class="logo-text">loooom</span>
		</a>
		<div class="nav-right">
			<a href="/me" class="nav-link">ME.md</a>
			<a href="/browse" class="nav-link">Skills</a>
			<a href="/docs" class="nav-link">Docs</a>
			<a
				href="https://github.com/mager/loooom"
				target="_blank"
				rel="noopener"
				class="nav-link">GitHub</a
			>
			<ThemeToggle />
			<a href="/login" class="btn-nav">Sign In</a>
		</div>
	</div>
</nav>

<style>
	nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		backdrop-filter: blur(20px);
		background: var(--nav-bg);
		border-bottom: 1px solid var(--border);
	}
	.nav-inner {
		max-width: 1040px;
		margin: 0 auto;
		padding: 0 1.5rem;
		height: 52px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.logo {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--text-primary);
		text-decoration: none;
		flex-shrink: 0;
	}
	.logo-text {
		font-family: var(--font-handwriting);
		font-size: 1.35rem;
		font-weight: 100;
		color: var(--text-primary);
	}
	.nav-right {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}
	.nav-link {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-secondary);
		text-decoration: none;
		transition: color 0.15s;
	}
	.nav-link:hover {
		color: var(--text-primary);
	}
	.btn-nav {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary);
		text-decoration: none;
		padding: 0.375rem 0.875rem;
		border: 1.5px solid var(--border);
		border-radius: 6px;
		transition: border-color 0.15s;
		white-space: nowrap;
		flex-shrink: 0;
	}
	.btn-nav:hover {
		border-color: var(--text-muted);
	}
	@media (max-width: 600px) {
		.nav-link {
			display: none;
		}
		.nav-right {
			gap: 0.75rem;
		}
	}
</style>
