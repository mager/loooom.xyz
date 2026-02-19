<script lang="ts">
	import { enhance } from '$app/forms';
	import YarnLogo from '$lib/components/YarnLogo.svelte';
	let { form } = $props();
</script>

<svelte:head>
	<title>Login — Loooom</title>
</svelte:head>

<div class="login-page">
	<a href="/" class="logo">
		<YarnLogo size={28} />
		<span class="logo-text">loooom</span>
	</a>

	<div class="login-card">
		<h1>Welcome back</h1>
		<p class="subtitle">Enter your username to continue</p>

		{#if form?.error}
			<div class="error">{form.error}</div>
		{/if}

		<form method="POST" use:enhance>
			<input
				type="text"
				name="username"
				placeholder="username"
				required
				autocomplete="username"
			/>
			<button type="submit">Log In →</button>
		</form>
	</div>
</div>

<style>
	.login-page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		gap: 2rem;
	}
	.logo {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--text-primary);
		text-decoration: none;
	}
	.logo-mark { font-size: 1.5rem; color: var(--accent); }
	.logo-text {
		font-family: var(--font-mono);
		font-size: 1.25rem;
		font-weight: 700;
	}
	.login-card {
		width: 100%;
		max-width: 400px;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 2.5rem;
	}
	h1 {
		font-family: var(--font-handwriting);
		font-size: 2rem;
		margin-bottom: 0.5rem;
	}
	.subtitle {
		color: var(--text-secondary);
		font-size: 0.9rem;
		margin-bottom: 1.5rem;
	}
	.error {
		background: rgba(253, 121, 168, 0.1);
		border: 1px solid rgba(253, 121, 168, 0.3);
		color: var(--yarn-pink);
		padding: 0.75rem 1rem;
		border-radius: var(--radius-sm);
		font-size: 0.875rem;
		margin-bottom: 1rem;
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	input {
		padding: 0.875rem 1.25rem;
		background: var(--bg-primary);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		color: var(--text-primary);
		font-family: var(--font-mono);
		font-size: 1rem;
		outline: none;
		transition: border-color 0.2s;
	}
	input:focus { border-color: var(--accent); }
	input::placeholder { color: var(--text-muted); }
	button {
		padding: 0.875rem;
		background: var(--accent);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.25s;
	}
	button:hover {
		background: var(--accent-bright);
		transform: translateY(-1px);
	}
</style>
