<script lang="ts">
	import { goto } from '$app/navigation';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import YarnLogo from '$lib/components/YarnLogo.svelte';
	import { signUpWithEmail } from '$lib/firebase';

	let username = $state('');
	let displayName = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let error = $state('');
	let loading = $state(false);

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
	<title>Start Weaving — Loooom</title>
</svelte:head>

<div class="ambient">
	<div class="orb orb-1"></div>
	<div class="orb orb-2"></div>
</div>

<nav>
	<div class="nav-inner">
		<a href="/" class="logo">
			<YarnLogo size={28} />
			<span class="logo-text">loooom</span>
		</a>
		<ThemeToggle />
	</div>
</nav>

<section class="signup-section">
	<div class="signup-card">
		<span class="badge">🧵 Invite Only</span>
		<h1 class="handwriting">Start Weaving</h1>
		<p class="subtitle">You found the secret door. Create your account and start crafting skills.</p>

		{#if error}
			<div class="error">{error}</div>
		{/if}

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
				{loading ? 'Creating account...' : 'Start Weaving'}
				{#if !loading}<span class="btn-arrow">→</span>{/if}
			</button>
		</form>

		<p class="login-link">Already have an account? <a href="/login">Sign in</a></p>
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
		border-bottom: 1px solid var(--border);
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
	.logo-text {
		font-family: var(--font-handwriting);
		font-size: 1.25rem;
		font-weight: 100;
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
		letter-spacing: 0.12em;
		color: var(--accent-rose);
		margin-bottom: 1rem;
	}

	.handwriting {
		font-family: var(--font-handwriting);
		font-size: 3rem;
		font-weight: 100;
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
	.btn-primary:hover:not(:disabled) {
		background: var(--accent-bright);
		transform: translateY(-1px);
		box-shadow: 0 8px 30px rgba(45, 42, 62, 0.2);
	}
	:global(html[data-theme="dark"]) .btn-primary {
		color: var(--bg-primary);
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
		color: var(--accent-rose);
	}
	.login-link a:hover {
		color: var(--yarn-pink);
	}
</style>
