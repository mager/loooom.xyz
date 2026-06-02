<script lang="ts">
	import YarnLogo from './YarnLogo.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
</script>

<nav aria-label="Primary navigation">
	<div class="nav-inner">
		<a href="/" class="brand" aria-label="Loooom home">
			<YarnLogo size={23} />
			<span class="brand-text">loooom</span>
		</a>

		<div class="nav-links">
			<a href="/browse">Skills</a>
			<a href="/#grading">How it's scored</a>
			<a href="https://github.com/mager/loooom" target="_blank" rel="noopener">GitHub</a>
		</div>

		<div class="nav-actions">
			<ThemeToggle />
			<a href="/browse" class="nav-cta">Browse skills</a>
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
		max-width: 1160px;
		margin: 0 auto;
		padding: 0.7rem 1.25rem;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 1rem;
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		color: var(--text-primary);
		text-decoration: none;
	}
	.brand :global(svg) {
		transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.brand:hover :global(svg) {
		transform: rotate(-18deg) scale(1.08);
	}
	.brand-text {
		font-family: var(--font-handwriting);
		font-size: 1.4rem;
		font-weight: 400;
		color: var(--text-primary);
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		justify-self: center;
		padding: 0.3rem;
		background: color-mix(in srgb, var(--bg-card) 70%, transparent);
		border: 1px solid color-mix(in srgb, var(--border) 80%, transparent);
		border-radius: 999px;
		box-shadow: var(--card-shadow);
		backdrop-filter: blur(18px);
	}
	.nav-links a {
		color: var(--text-secondary);
		font-size: 0.86rem;
		font-weight: 600;
		text-decoration: none;
		padding: 0.42rem 0.85rem;
		border-radius: 999px;
		transition: background 0.2s, color 0.2s;
		white-space: nowrap;
	}
	.nav-links a:hover {
		background: var(--bg-secondary);
		color: var(--text-primary);
	}

	.nav-actions {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		justify-content: flex-end;
	}
	.nav-cta {
		padding: 0.55rem 1rem;
		border-radius: 999px;
		background: var(--text-primary);
		color: var(--bg-primary);
		font-weight: 700;
		font-size: 0.88rem;
		text-decoration: none;
		white-space: nowrap;
		transition: transform 0.18s ease, box-shadow 0.18s ease;
	}
	.nav-cta:hover {
		transform: translateY(-1px);
		box-shadow: 0 10px 24px color-mix(in srgb, var(--accent) 26%, transparent);
		color: var(--bg-primary);
	}

	@media (max-width: 760px) {
		.nav-inner {
			grid-template-columns: 1fr auto;
		}
		.nav-links {
			display: none;
		}
	}
	@media (max-width: 460px) {
		.nav-actions :global(.theme-toggle) {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.brand :global(svg),
		.nav-cta {
			transition: none !important;
		}
	}
</style>
