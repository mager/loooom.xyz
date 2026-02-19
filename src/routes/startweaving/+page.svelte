<script lang="ts">
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<svelte:head>
	<title>Start Weaving — Loooom</title>
</svelte:head>

<div class="ambient">
	<div class="orb orb-1"></div>
	<div class="orb orb-2"></div>
</div>

<nav>
	<div class="nav-inner">
		<a href="/" class="logo">
			<span class="logo-mark">◎</span>
			<span class="logo-text">loooom</span>
		</a>
		<ThemeToggle />
	</div>
</nav>

<section class="signup-section">
	<div class="signup-card">
		{#if form?.success}
			<div class="success">
				<span class="success-icon">🧶</span>
				<h1 class="handwriting">You're in.</h1>
				<p>Welcome to Loooom. Your loom is ready.</p>
				<a href="/" class="back-link">← Back to home</a>
			</div>
		{:else}
			<span class="badge">🧵 Invite Only</span>
			<h1 class="handwriting">Start Weaving</h1>
			<p class="subtitle">You found the secret door. Create your account and start crafting skills.</p>

			{#if form?.error}
				<div class="error">{form.error}</div>
			{/if}

			<form method="POST" use:enhance class="signup-form">
				<label>
					<span class="label-text">Username</span>
					<input type="text" name="username" placeholder="mager" required value={form?.username ?? ''} />
				</label>
				<label>
					<span class="label-text">Display Name</span>
					<input type="text" name="displayName" placeholder="Mager" required value={form?.displayName ?? ''} />
				</label>
				<label>
					<span class="label-text">Email</span>
					<input type="email" name="email" placeholder="you@example.com" required value={form?.email ?? ''} />
				</label>
				<button type="submit" class="btn-primary">
					Start Weaving
					<span class="btn-arrow">→</span>
				</button>
			</form>
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
		opacity: 0.12;
	}
	.orb-1 {
		width: 500px; height: 500px;
		background: var(--accent);
		top: -100px; left: -100px;
	}
	.orb-2 {
		width: 400px; height: 400px;
		background: var(--yarn-pink);
		bottom: -100px; right: -100px;
	}

	nav {
		position: fixed;
		top: 0; left: 0; right: 0;
		z-index: 100;
		backdrop-filter: blur(20px);
		background: var(--nav-bg, rgba(10, 10, 15, 0.8));
		border-bottom: 1px solid rgba(42, 42, 58, 0.5);
	}
	.nav-inner {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2rem;
		height: 64px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.logo {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--text-primary);
	}
	.logo:hover { color: var(--text-primary); }
	.logo-mark { font-size: 1.5rem; color: var(--accent); }
	.logo-text {
		font-family: var(--font-mono);
		font-size: 1.25rem;
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.signup-section {
		position: relative;
		z-index: 1;
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 6rem 2rem;
	}

	.signup-card {
		max-width: 440px;
		width: 100%;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-xl);
		padding: 3rem;
	}

	.badge {
		display: inline-block;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--accent-bright);
		margin-bottom: 1rem;
	}

	.handwriting {
		font-family: var(--font-handwriting);
		font-size: 3rem;
		font-weight: 700;
		background: var(--gradient-hero);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin-bottom: 0.75rem;
	}

	.subtitle {
		color: var(--text-secondary);
		font-size: 1rem;
		line-height: 1.6;
		margin-bottom: 2rem;
	}

	.error {
		padding: 0.75rem 1rem;
		background: rgba(253, 121, 168, 0.1);
		border: 1px solid rgba(253, 121, 168, 0.3);
		border-radius: var(--radius-sm);
		color: var(--yarn-pink);
		font-size: 0.875rem;
		margin-bottom: 1.5rem;
	}

	.signup-form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.label-text {
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-muted);
		font-family: var(--font-mono);
	}

	input {
		padding: 0.875rem 1rem;
		background: var(--bg-primary);
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		color: var(--text-primary);
		font-family: var(--font-display);
		font-size: 1rem;
		outline: none;
		transition: border-color 0.2s;
	}
	input::placeholder { color: var(--text-muted); }
	input:focus { border-color: var(--accent); }

	.btn-primary {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.875rem 2rem;
		background: var(--accent);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.25s;
		margin-top: 0.5rem;
	}
	.btn-primary:hover {
		background: var(--accent-bright);
		transform: translateY(-1px);
		box-shadow: 0 8px 30px rgba(108, 92, 231, 0.4);
	}
	.btn-arrow { transition: transform 0.2s; }
	.btn-primary:hover .btn-arrow { transform: translateX(3px); }

	.success {
		text-align: center;
	}
	.success-icon {
		font-size: 3rem;
		display: block;
		margin-bottom: 1rem;
	}
	.success p {
		color: var(--text-secondary);
		margin-bottom: 1.5rem;
	}
	.back-link {
		font-size: 0.9rem;
		color: var(--accent-bright);
	}
</style>
