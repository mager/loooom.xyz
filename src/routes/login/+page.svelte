<script lang="ts">
	import { goto } from '$app/navigation';
	import YarnLogo from '$lib/components/YarnLogo.svelte';
	import { signInWithEmail, resetPassword, signInWithGitHub } from '$lib/firebase';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);
	let ghLoading = $state(false);
	let resetMode = $state(false);
	let resetSent = $state(false);

	async function handleGitHub() {
		error = '';
		ghLoading = true;
		try {
			const user = await signInWithGitHub();
			const idToken = await user.getIdToken();
			const ghUsername = user.displayName?.toLowerCase().replace(/\s+/g, '') || user.email?.split('@')[0] || 'user';

			const res = await fetch('/api/auth', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ idToken, username: ghUsername, displayName: user.displayName || ghUsername })
			});

			const data = await res.json();
			if (!res.ok) {
				error = data.error || 'GitHub login failed';
				ghLoading = false;
				return;
			}
			goto('/dashboard');
		} catch (e: unknown) {
			const msg = e instanceof Error ? e.message : '';
			if (msg.includes('popup-closed')) {
				ghLoading = false;
				return;
			}
			error = 'GitHub login failed. Please try again.';
			ghLoading = false;
		}
	}

	async function handleLogin(e: Event) {
		e.preventDefault();
		error = '';
		loading = true;

		try {
			const user = await signInWithEmail(email, password);
			const idToken = await user.getIdToken();

			const res = await fetch('/api/auth', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ idToken })
			});

			const data = await res.json();
			if (!res.ok) {
				error = data.error || 'Login failed';
				loading = false;
				return;
			}

			goto('/dashboard');
		} catch (e: unknown) {
			const msg = e instanceof Error ? e.message : 'Login failed';
			if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
				error = 'Invalid email or password';
			} else if (msg.includes('too-many-requests')) {
				error = 'Too many attempts. Try again later.';
			} else {
				error = 'Login failed. Please try again.';
			}
			loading = false;
		}
	}

	async function handleReset(e: Event) {
		e.preventDefault();
		error = '';
		if (!email) {
			error = 'Enter your email first';
			return;
		}
		try {
			await resetPassword(email);
			resetSent = true;
		} catch {
			error = 'Could not send reset email. Check your address.';
		}
	}
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
		{#if resetMode}
			{#if resetSent}
				<h1>Check your email</h1>
				<p class="subtitle">We sent a password reset link to <strong>{email}</strong></p>
				<button class="link-btn" onclick={() => { resetMode = false; resetSent = false; }}>← Back to login</button>
			{:else}
				<h1>Reset password</h1>
				<p class="subtitle">Enter your email and we'll send a reset link</p>

				{#if error}
					<div class="error">{error}</div>
				{/if}

				<form onsubmit={handleReset}>
					<input
						type="email"
						bind:value={email}
						placeholder="you@example.com"
						required
						autocomplete="email"
					/>
					<button type="submit">Send Reset Link →</button>
				</form>
				<button class="link-btn" onclick={() => { resetMode = false; error = ''; }}>← Back to login</button>
			{/if}
		{:else}
			<h1>Welcome back</h1>
			<p class="subtitle">Sign in to your Loooom account</p>

			{#if error}
				<div class="error">{error}</div>
			{/if}

			<button class="btn-github" onclick={handleGitHub} disabled={ghLoading}>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
				{ghLoading ? 'Connecting...' : 'Sign in with GitHub'}
			</button>

			<div class="divider"><span>or</span></div>

			<form onsubmit={handleLogin}>
				<input
					type="email"
					bind:value={email}
					placeholder="you@example.com"
					required
					autocomplete="email"
				/>
				<input
					type="password"
					bind:value={password}
					placeholder="password"
					required
					autocomplete="current-password"
				/>
				<button type="submit" disabled={loading}>
					{loading ? 'Signing in...' : 'Log In →'}
				</button>
			</form>
			<div class="links">
				<button class="link-btn" onclick={() => { resetMode = true; error = ''; }}>Forgot password?</button>
				<a href="/startweaving">Create account</a>
			</div>
		{/if}
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
	.logo-text {
		font-family: var(--font-handwriting);
		font-size: 1.25rem;
		font-weight: 100;
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
		font-family: var(--font-handwriting);
		font-size: 1rem;
		outline: none;
		transition: border-color 0.2s;
	}
	input:focus { border-color: var(--text-secondary); }
	input::placeholder { color: var(--text-muted); }
	button[type="submit"] {
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
	button[type="submit"]:hover:not(:disabled) {
		background: var(--accent-bright);
		transform: translateY(-1px);
		box-shadow: 0 6px 24px rgba(45, 42, 62, 0.15);
	}
	:global(html[data-theme="dark"]) button[type="submit"] {
		color: var(--bg-primary);
	}
	button[type="submit"]:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	.links {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 1.25rem;
		font-size: 0.875rem;
	}
	.link-btn {
		background: none;
		border: none;
		color: var(--accent-rose);
		cursor: pointer;
		font-family: var(--font-display);
		font-size: 0.875rem;
		padding: 0;
		margin-top: 1rem;
	}
	.link-btn:hover {
		color: var(--yarn-pink);
	}
	.btn-github {
		display: flex; align-items: center; justify-content: center; gap: 0.75rem;
		width: 100%; padding: 0.875rem;
		background: var(--bg-primary); color: var(--text-primary);
		border: 1px solid var(--border); border-radius: var(--radius-md);
		font-family: var(--font-display); font-size: 0.95rem; font-weight: 600;
		cursor: pointer; transition: all 0.25s;
	}
	.btn-github:hover:not(:disabled) { border-color: var(--text-secondary); background: var(--bg-card-hover); }
	.btn-github:disabled { opacity: 0.6; cursor: not-allowed; }
	.divider {
		display: flex; align-items: center; gap: 1rem;
		margin: 0.5rem 0; color: var(--text-muted); font-size: 0.8rem;
	}
	.divider::before, .divider::after {
		content: ''; flex: 1; height: 1px; background: var(--border);
	}
</style>
