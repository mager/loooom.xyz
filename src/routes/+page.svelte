<script lang="ts">
	import YarnBall from '$lib/components/YarnBall.svelte';
	import YarnLogo from '$lib/components/YarnLogo.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { enhance } from '$app/forms';

	let { form } = $props();
	let submitted = $state(false);

	const categories = [
		'Writing', 'Engineering', 'Research', 'Creative', 'Automation',
		'Data', 'Design', 'DevOps', 'Music', 'Education'
	];
</script>

<svelte:head>
	<title>Loooom — Where Skills Are Woven</title>
	<meta name="description" content="A social skills marketplace for AI agents. Discover, craft, and share agent skills from verified authors." />
</svelte:head>

<!-- Ambient background -->
<div class="ambient">
	<div class="orb orb-1"></div>
	<div class="orb orb-2"></div>
	<div class="orb orb-3"></div>
</div>

<!-- Nav -->
<nav>
	<div class="nav-inner">
		<a href="/" class="logo">
			<YarnLogo size={28} />
			<span class="logo-text">loooom</span>
		</a>
		<div class="nav-links">
			<a href="#explore">Explore</a>
			<ThemeToggle />
			<button class="btn-nav">Sign In</button>
		</div>
	</div>
</nav>

<!-- Hero -->
<section class="hero">
	<div class="hero-content">
		<div class="hero-text">
			<div class="badge">
				<span class="badge-dot"></span>
				Coming Soon
			</div>
			<h1>
				Where skills are
				<span class="gradient-text">woven</span>
			</h1>
			<p class="hero-sub">
				A social marketplace for AI agent skills. Discover context-rich skills
				from verified authors. Craft your own. Share with the world.
			</p>
			<div class="hero-actions">
				{#if submitted || form?.success}
					<div class="waitlist-success">
						<span class="success-check">✓</span>
						You're on the list. We'll be in touch.
					</div>
				{:else}
					<form method="POST" action="?/waitlist" use:enhance={() => {
						return async ({ update }) => {
							await update();
							if (form?.success) submitted = true;
							submitted = true;
						};
					}} class="waitlist-form">
						<input
							type="email"
							name="email"
							placeholder="your@email.com"
							required
							class="waitlist-input"
						/>
						<button type="submit" class="btn-primary">
							Join Waitlist
							<span class="btn-arrow">→</span>
						</button>
					</form>
				{/if}
			</div>
		</div>
		<div class="hero-visual">
			<YarnBall size={360} animated={true} />
		</div>
	</div>

	<!-- Floating thread particles -->
	<div class="threads">
		{#each Array(6) as _, i}
			<div class="thread-particle" style="--delay: {i * 0.8}s; --x: {15 + i * 14}%;"></div>
		{/each}
	</div>
</section>

<!-- Explore Categories -->
<section id="explore" class="explore">
	<div class="section-inner">
		<span class="section-tag">Explore</span>
		<h2>Skills for <span class="gradient-text">every craft</span></h2>
		<div class="categories">
			{#each categories as cat}
				<button class="cat-pill">{cat}</button>
			{/each}
		</div>
		<div class="explore-cta">
			<p>Hundreds of skills from verified authors — launching soon.</p>
		</div>
	</div>
</section>

<!-- Footer -->
<footer>
	<div class="footer-inner">
		<div class="footer-brand">
			<YarnLogo size={28} />
			<span class="logo-text">loooom</span>
			<p class="footer-tagline">Where skills are woven.</p>
		</div>
		<div class="footer-links">
			<div class="footer-col">
				<h4>Product</h4>
				<a href="#explore">Explore</a>
			</div>
			<div class="footer-col">
				<h4>Spec</h4>
				<a href="https://agentskills.io" target="_blank" rel="noopener">AgentSkills.io</a>
				<a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
			</div>
			<div class="footer-col">
				<h4>Social</h4>
				<a href="#">X / Twitter</a>
				<a href="#">Discord</a>
			</div>
		</div>
	</div>
	<div class="footer-bottom">
		<span>© 2026 Loooom. Open format. Open community.</span>
	</div>
</footer>

<style>
	/* ===== Ambient Background ===== */
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
		filter: blur(120px);
		opacity: 0.08;
	}
	:global(html[data-theme="dark"]) .orb {
		opacity: 0.15;
	}
	.orb-1 {
		width: 600px; height: 600px;
		background: var(--accent);
		top: -200px; left: -100px;
		animation: drift 25s ease-in-out infinite;
	}
	.orb-2 {
		width: 500px; height: 500px;
		background: var(--yarn-pink);
		top: 40%; right: -150px;
		animation: drift 30s ease-in-out infinite reverse;
	}
	.orb-3 {
		width: 400px; height: 400px;
		background: var(--yarn-blue);
		bottom: -100px; left: 30%;
		animation: drift 20s ease-in-out infinite;
	}
	@keyframes drift {
		0%, 100% { transform: translate(0, 0); }
		25% { transform: translate(30px, -20px); }
		50% { transform: translate(-20px, 30px); }
		75% { transform: translate(15px, 15px); }
	}

	/* ===== Nav ===== */
	nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
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
	.logo-mark {
		font-size: 1.5rem;
		color: var(--accent);
	}
	.logo-text {
		font-family: var(--font-mono);
		font-size: 1.25rem;
		font-weight: 700;
		letter-spacing: -0.02em;
	}
	.nav-links {
		display: flex;
		align-items: center;
		gap: 2rem;
	}
	.nav-links a {
		color: var(--text-secondary);
		font-size: 0.875rem;
		font-weight: 500;
		transition: color 0.2s;
	}
	.nav-links a:hover { color: var(--text-primary); }
	.btn-nav {
		background: var(--bg-card);
		color: var(--text-primary);
		border: 1px solid var(--border);
		padding: 0.5rem 1.25rem;
		border-radius: var(--radius-sm);
		font-family: var(--font-display);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}
	.btn-nav:hover {
		border-color: var(--accent);
		background: rgba(108, 92, 231, 0.1);
	}

	/* ===== Hero ===== */
	.hero {
		position: relative;
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 8rem 2rem 4rem;
		z-index: 1;
	}
	.hero-content {
		max-width: 1200px;
		width: 100%;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4rem;
		align-items: center;
	}
	.badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.375rem 1rem;
		border-radius: 100px;
		background: rgba(108, 92, 231, 0.1);
		border: 1px solid rgba(108, 92, 231, 0.3);
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--accent-bright);
		margin-bottom: 1.5rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}
	.badge-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--accent);
		animation: pulse-dot 2s ease-in-out infinite;
	}
	@keyframes pulse-dot {
		0%, 100% { opacity: 1; transform: scale(1); }
		50% { opacity: 0.5; transform: scale(0.8); }
	}
	h1 {
		font-size: clamp(3rem, 6vw, 4.5rem);
		font-weight: 800;
		line-height: 1.05;
		letter-spacing: -0.03em;
		margin-bottom: 1.5rem;
	}
	.gradient-text {
		background: var(--gradient-hero);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	.hero-sub {
		font-size: 1.2rem;
		color: var(--text-secondary);
		line-height: 1.6;
		max-width: 500px;
		margin-bottom: 2.5rem;
	}
	.hero-actions {
		display: flex;
		gap: 1rem;
	}
	.btn-primary {
		display: inline-flex;
		align-items: center;
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
	}
	.btn-primary:hover {
		background: var(--accent-bright);
		transform: translateY(-1px);
		box-shadow: 0 8px 30px rgba(108, 92, 231, 0.4);
	}
	.btn-arrow {
		transition: transform 0.2s;
	}
	.btn-primary:hover .btn-arrow {
		transform: translateX(3px);
	}
	.waitlist-form {
		display: flex;
		gap: 0.5rem;
		width: 100%;
		max-width: 480px;
	}
	.waitlist-input {
		flex: 1;
		padding: 0.875rem 1.25rem;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		color: var(--text-primary);
		font-family: var(--font-display);
		font-size: 1rem;
		outline: none;
		transition: border-color 0.2s;
	}
	.waitlist-input::placeholder {
		color: var(--text-muted);
	}
	.waitlist-input:focus {
		border-color: var(--accent);
	}
	.waitlist-success {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.5rem;
		background: rgba(85, 239, 196, 0.1);
		border: 1px solid rgba(85, 239, 196, 0.3);
		border-radius: var(--radius-md);
		color: var(--yarn-green);
		font-weight: 500;
	}
	.success-check {
		font-size: 1.2rem;
		font-weight: 700;
	}
	.hero-visual {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* Thread particles */
	.threads {
		position: absolute;
		inset: 0;
		pointer-events: none;
		overflow: hidden;
	}
	.thread-particle {
		position: absolute;
		left: var(--x);
		bottom: -10px;
		width: 2px;
		height: 60px;
		background: linear-gradient(to top, transparent, var(--accent-bright));
		opacity: 0.15;
		animation: rise 8s ease-in infinite;
		animation-delay: var(--delay);
	}
	@keyframes rise {
		0% { transform: translateY(0); opacity: 0; }
		10% { opacity: 0.15; }
		90% { opacity: 0.15; }
		100% { transform: translateY(-100vh); opacity: 0; }
	}

	/* ===== Sections Shared ===== */
	.section-inner {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2rem;
	}
	.section-tag {
		display: inline-block;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--accent);
		margin-bottom: 1rem;
	}
	section h2 {
		font-size: clamp(2rem, 4vw, 3rem);
		font-weight: 800;
		letter-spacing: -0.02em;
		margin-bottom: 3rem;
	}

	/* ===== Explore ===== */
	.explore {
		position: relative;
		z-index: 1;
		padding: 6rem 0;
	}
	.categories {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-bottom: 3rem;
	}
	.cat-pill {
		padding: 0.625rem 1.5rem;
		border-radius: 100px;
		background: var(--bg-card);
		border: 1px solid var(--border);
		color: var(--text-secondary);
		font-family: var(--font-display);
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.25s;
	}
	.cat-pill:hover {
		border-color: var(--accent);
		color: var(--text-primary);
		background: rgba(108, 92, 231, 0.1);
	}
	.explore-cta {
		text-align: center;
		padding: 3rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-xl);
		background: var(--gradient-subtle);
	}
	.explore-cta p {
		color: var(--text-secondary);
		font-size: 1.1rem;
	}

	/* ===== Footer ===== */
	footer {
		position: relative;
		z-index: 1;
		border-top: 1px solid var(--border);
		padding: 4rem 2rem 2rem;
		margin-top: 4rem;
	}
	.footer-inner {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		margin-bottom: 3rem;
	}
	.footer-tagline {
		color: var(--text-muted);
		font-size: 0.875rem;
		margin-top: 0.75rem;
	}
	.footer-links {
		display: flex;
		gap: 4rem;
	}
	.footer-col {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.footer-col h4 {
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
		margin-bottom: 0.25rem;
	}
	.footer-col a {
		color: var(--text-secondary);
		font-size: 0.9rem;
	}
	.footer-col a:hover { color: var(--text-primary); }
	.footer-bottom {
		max-width: 1200px;
		margin: 0 auto;
		padding-top: 2rem;
		border-top: 1px solid var(--border);
		text-align: center;
		color: var(--text-muted);
		font-size: 0.8rem;
	}

	/* ===== Responsive ===== */
	@media (max-width: 900px) {
		.hero-content {
			grid-template-columns: 1fr;
			text-align: center;
		}
		.hero-sub { margin: 0 auto 2.5rem; }
		.hero-actions { justify-content: center; }
		.hero-visual { order: -1; }
		.nav-links a:not(.btn-nav) { display: none; }
		.footer-inner { flex-direction: column; gap: 2rem; }
		.footer-links { gap: 2rem; }
	}
</style>
