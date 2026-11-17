<script lang="ts">
	import { goto } from '$app/navigation';
	import { signUpWithEmail, signInWithGitHub } from '$lib/firebase';

	let username = $state('');
	let displayName = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let error = $state('');
	let loading = $state(false);
	let ghLoading = $state(false);

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
				if (data.error?.includes('Username already taken')) {
					error = 'That username is taken — try signing in instead';
				} else {
					error = data.error || 'GitHub signup failed';
				}
				ghLoading = false;
				return;
			}
			goto('/dashboard');
		} catch (e: unknown) {
			const msg = e instanceof Error ? e.message : '';
			if (msg.includes('popup-closed')) { ghLoading = false; return; }
			error = 'GitHub signup failed. Please try again.';
			ghLoading = false;
		}
	}

	async function handleSignup(e: Event) {
		e.preventDefault();
		error = '';

		if (username.trim().length < 2) {
			error = 'Username must be at least 2 characters';
			return;
		}
		if (!displayName.trim()) {
			error = 'Display name is required';
			return;
		}
		if (!email.includes('@')) {
			error = 'Valid email is required';
			return;
		}
		if (password.length < 6) {
			error = 'Password must be at least 6 characters';
			return;
		}
		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			return;
		}

		loading = true;

		try {
			const user = await signUpWithEmail(email, password);
			const idToken = await user.getIdToken();

			const res = await fetch('/api/auth', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					idToken,
					username: username.trim().toLowerCase(),
					displayName: displayName.trim()
				})
			});

			const data = await res.json();
			if (!res.ok) {
				error = data.error || 'Signup failed';
				loading = false;
				return;
			}

			goto('/dashboard');
		} catch (e: unknown) {
			const msg = e instanceof Error ? e.message : 'Signup failed';
			if (msg.includes('email-already-in-use')) {
				error = 'An account with this email already exists';
			} else if (msg.includes('weak-password')) {
				error = 'Password is too weak. Use at least 6 characters.';
			} else {
				error = 'Signup failed. Please try again.';
			}
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Create an account — Loooom</title>
</svelte:head>





<section class="signup-section">
	<div class="signup-card">

		<h1 class="handwriting">Create an account</h1>
		<p class="subtitle">Share your files and save useful context.</p>

		{#if error}
			<div class="error">{error}</div>
		{/if}

		<button class="btn-github" onclick={handleGitHub} disabled={ghLoading}>
			<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
			{ghLoading ? 'Connecting...' : 'Sign up with GitHub'}
		</button>

		<div class="divider"><span>or</span></div>

		<form onsubmit={handleSignup} class="signup-form">
			<label>
				<span class="label-text">Username</span>
				<input type="text" bind:value={username} placeholder="mager" required />
			</label>
			<label>
				<span class="label-text">Display Name</span>
				<input type="text" bind:value={displayName} placeholder="Mager" required />
			</label>
			<label>
				<span class="label-text">Email</span>
				<input type="email" bind:value={email} placeholder="you@example.com" required />
			</label>
			<label>
				<span class="label-text">Password</span>
				<input type="password" bind:value={password} placeholder="at least 6 characters" required autocomplete="new-password" />
			</label>
			<label>
				<span class="label-text">Confirm Password</span>
				<input type="password" bind:value={confirmPassword} placeholder="confirm password" required autocomplete="new-password" />
			</label>
			<button type="submit" class="btn-primary" disabled={loading}>
				{loading ? 'Creating account...' : 'Create an account'}
				{#if !loading}<span class="btn-arrow">→</span>{/if}
			</button>
		</form>

		<p class="login-link">Already have an account? <a href="/login">Sign in</a></p>
	</div>
</section>

<style>
	.signup-section {
		position: relative;
		z-index: 1;
		min-height: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 48px 0 40px;
	}

	.signup-card {
		max-width: 440px;
		width: 100%;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-xl);
		padding: 28px;
	}

	.handwriting {
		font-family: var(--font-handwriting);
		font-size: clamp(32px,4vw,48px);
		font-weight: 500;
		color: var(--paper);



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
		color: var(--ocean);
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
		font-family: var(--font-handwriting);
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
	input:focus { border-color: var(--text-secondary); }

	.btn-primary {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.875rem 2rem;
		background: var(--action-bg);
		color: var(--action-ink);
		border: none;
		border-radius: var(--radius-md);
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.25s;
		margin-top: 0.5rem;
	}
	.btn-primary:hover:not(:disabled) {
		background: var(--action-hover);

		box-shadow: 0 8px 30px rgba(45, 42, 62, 0.2);
	}
	:global(html[data-theme="dark"]) .btn-primary {
		color: var(--action-ink);
	}
	.btn-primary:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	.btn-arrow { transition: transform 0.2s; }
	.btn-primary:hover:not(:disabled) .btn-arrow { transform: translateX(3px); }

	.login-link {
		text-align: center;
		margin-top: 1.5rem;
		font-size: 0.875rem;
		color: var(--text-secondary);
	}
	.login-link a {
		color: var(--ocean);
	}
	.login-link a:hover {
		color: var(--ocean);
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
		margin: 1rem 0; color: var(--text-muted); font-size: 0.8rem;
	}
	.divider::before, .divider::after {
		content: ''; flex: 1; height: 1px; background: var(--border);
	}
</style>
