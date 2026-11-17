<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	let next = $derived(page.url.searchParams.get('next') ?? '/');
	let returnTo = $derived(next.startsWith('/') && !next.startsWith('//') && !next.includes('\\') ? next : '/');
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
			goto(returnTo);
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

			goto(returnTo);
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
					<div class="error" role="alert">{error}</div>
				{/if}

				<form onsubmit={handleReset}>
					<label for="reset-email">Email</label>
					<input
						id="reset-email"
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
				<div class="error" role="alert">{error}</div>
			{/if}

			<button class="btn-github" onclick={handleGitHub} disabled={ghLoading}>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
				{ghLoading ? 'Connecting...' : 'Sign in with GitHub'}
			</button>

			<div class="divider"><span>or</span></div>

			<form onsubmit={handleLogin}>
				<label for="login-email">Email</label>
				<input
					id="login-email"
					type="email"
					bind:value={email}
					placeholder="you@example.com"
					required
					autocomplete="email"
				/>
				<label for="login-password">Password</label>
				<input
					id="login-password"
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
	.login-page { padding: 54px 0 40px; }
	.login-card { width: 100%; max-width: 480px; margin: 0 auto; }
	.login-card h1 { margin: 0 0 16px; font-size: clamp(36px, 4vw, 52px); line-height: 1.05; font-weight: 500; letter-spacing: -.035em; }
	.subtitle { color: var(--quiet); font-size: 16px; line-height: 1.6; margin-bottom: 28px; overflow-wrap: anywhere; }
	.error { margin-bottom: 20px; padding: 12px 16px; border: 1px solid var(--error-border); border-radius: 6px; background: var(--error-bg); color: var(--error-ink); font-size: 14px; line-height: 1.5; }
	form { display: flex; flex-direction: column; gap: 10px; }
	label { margin-top: 8px; color: var(--paper); font-size: 14px; }
	input { width: 100%; min-width: 0; min-height: 46px; padding: 12px; background: var(--panel); border: 1px solid var(--line); border-radius: 6px; color: var(--paper); font-size: 16px; caret-color: var(--lime); transition: border-color .2s; }
	input:focus { border-color: var(--lime); }
	input::placeholder { color: var(--quiet); }
	button[type='submit'] { min-height: 46px; margin-top: 12px; padding: 12px 20px; border: 1px solid var(--action-bg); border-radius: 6px; background: var(--action-bg); color: var(--action-ink); font-size: 14px; font-weight: 500; cursor: pointer; transition: background .2s; }
	button[type='submit']:hover:not(:disabled) { background: var(--action-hover); color: var(--action-ink); }
	button:disabled { opacity: .55; cursor: wait; }
	.links { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-top: 20px; font-size: 14px; }
	.links a { display: inline-flex; align-items: center; min-height: 46px; color: var(--lime); }
	.link-btn { display: inline-flex; align-items: center; min-height: 46px; padding: 8px 0; margin-top: 16px; border: none; background: transparent; color: var(--lime); font-size: 14px; cursor: pointer; }
	.links .link-btn { margin-top: 0; }
	.link-btn:hover, .links a:hover { text-decoration: underline; text-underline-offset: 4px; }
	.btn-github { display: flex; align-items: center; justify-content: center; gap: 12px; min-height: 46px; width: 100%; padding: 12px 16px; border: 1px solid var(--line); border-radius: 6px; background: var(--panel); color: var(--paper); font-size: 14px; cursor: pointer; transition: background .2s, border-color .2s; }
	.btn-github:hover:not(:disabled) { border-color: var(--line-strong); background: var(--panel-raised); }
	.divider { display: flex; align-items: center; gap: 16px; margin: 24px 0 12px; color: var(--quiet); font-size: 13px; }
	.divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--line); }
	@media (max-width: 760px) { .login-page { padding-top: 32px; } }
	@media (prefers-reduced-motion: reduce) { input, button[type='submit'], .btn-github { transition: none; } }
</style>
