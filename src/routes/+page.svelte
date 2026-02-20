<script lang="ts">
	import YarnLogo from '$lib/components/YarnLogo.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { enhance } from '$app/forms';

	let { form, data } = $props();
	let submitted = $state(false);

	const useCases = [
		{ who: 'A pastry chef', what: 'sourdough starters & lamination' },
		{ who: 'Your favorite professor', what: 'research methodology' },
		{ who: 'A manga artist', what: 'panel composition & storytelling' },
		{ who: 'Anthropic', what: 'prompt engineering & agent design' },
		{ who: 'MIT OpenCourseWare', what: 'physics & computer science' },
		{ who: 'An herbalist', what: 'plant medicine & tinctures' },
	];

	const categories = [
		'Writing', 'Music', 'Cooking', 'Engineering', 'Art',
		'Research', 'Design', 'Education', 'Health', 'Business'
	];

	// Hero plugin preview data
	const heroSkills = [
		{ emoji: '🔤', title: 'Hiragana & Katakana', tag: 'Writing Systems' },
		{ emoji: '📐', title: 'Radicals', tag: 'Building Blocks' },
		{ emoji: '🈁', title: 'Easy Kanji', tag: 'First 50' },
		{ emoji: '💬', title: 'Basic Conversation', tag: 'Survival Kit' },
		{ emoji: '🔥', title: 'Level Up', tag: 'Go Deeper' },
	];
</script>

<svelte:head>
	<title>Loooom — Where Skills Are Woven</title>
	<meta name="description" content="A social skills marketplace. Everyone has something worth teaching. Skills are always free." />
</svelte:head>

<!-- Ambient background -->
<div class="ambient">
	<div class="orb orb-1"></div>
	<div class="orb orb-2"></div>
</div>

<!-- Nav -->
<nav>
	<div class="nav-inner">
		<a href="/" class="logo">
			<YarnLogo size={28} />
			<span class="logo-text">loooom</span>
		</a>
		<div class="nav-links">
			<a href="#vision">About</a>
			<a href="#explore">Explore</a>
			<a href="/docs">Docs</a>
			{#if data?.user}
				<a href="/create">Create</a>
			{/if}
			<ThemeToggle />
			{#if data?.user}
				<a href="/dashboard" class="btn-nav">{data.user.displayName}</a>
			{:else}
				<a href="/login" class="btn-nav">Sign In</a>
			{/if}
		</div>
	</div>
</nav>

<!-- Hero -->
<section class="hero">
	<div class="hero-content">
		<div class="hero-text">
			<h1>
				<span class="handwriting">Everyone has something</span>
				<br />
				<span class="handwriting accent">worth teaching.</span>
			</h1>
			<p class="hero-sub">
				Loooom is where people share skills — the things they're actually good at — 
				so AI agents can learn from the best. Not templates. Not prompts.
				<strong>Real expertise, from real people.</strong>
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
			<p class="hero-note">Skills are always free. Open source. Open format.</p>
		</div>
		<div class="hero-visual">
			<a href={data.featuredPlugins?.[0] ? `/p/${data.featuredPlugins[0].author?.username}/${data.featuredPlugins[0].name}` : '/browse'} class="hero-plugin-card">
				<div class="hero-plugin-header">
					<span class="hero-plugin-badge">🧩 Featured Plugin</span>
					<span class="hero-plugin-count">5 skills</span>
				</div>
				<h3 class="hero-plugin-title">Beginner Japanese</h3>
				<p class="hero-plugin-desc">From zero to ordering ramen in Tokyo</p>
				<div class="hero-plugin-skills">
					{#each heroSkills as skill, i}
						<div class="hero-skill-row" style="animation-delay: {i * 0.1}s">
							<span class="hero-skill-num">{i + 1}</span>
							<span class="hero-skill-emoji">{skill.emoji}</span>
							<span class="hero-skill-title">{skill.title}</span>
							<span class="hero-skill-tag">{skill.tag}</span>
						</div>
					{/each}
				</div>
				<div class="hero-plugin-footer">
					<span class="hero-plugin-author">by @mager</span>
					<span class="hero-plugin-cta">Explore →</span>
				</div>
			</a>
		</div>
	</div>
</section>

<!-- Vision -->
<section id="vision" class="vision">
	<div class="section-inner">
		<h2 class="handwriting">Knowledge is meant to be <span class="sketch">shared.</span></h2>
		<div class="vision-grid">
			<div class="vision-card">
				<p>Imagine Dave Grohl sharing a skill for <span class="marker pink">drumming fills</span> and another for <span class="marker blue">writing lyrics from the gut</span>. A pastry chef sharing her <span class="marker orange">sourdough method</span>. Your favorite professor packaging their <span class="marker green">research framework</span>.</p>
			</div>
			<div class="vision-card">
				<p>That's Loooom. A place where knowledge lives as <span class="marker pink">shareable skills</span> — not locked in books or buried in YouTube comments. You write it down, your agent learns it, and anyone can benefit.</p>
			</div>
			<div class="vision-card">
				<p>No coding required. No git. Just a simple editor where you write what you know, and it becomes something an AI agent can actually use. <span class="marker blue">If you can write a recipe, you can write a skill.</span></p>
			</div>
		</div>
	</div>
</section>

<!-- Featured Skill -->
{#if data.featuredSkill}
<section class="featured">
	<div class="section-inner">
		<h2 class="handwriting">See a skill in action<span class="sketch">.</span></h2>
		<a href="/s/{data.featuredSkill.author.username}/{data.featuredSkill.name}" class="featured-card">
			<div class="featured-meta">
				<span class="featured-category">{data.featuredSkill.category}</span>
				<span class="featured-uses">{data.featuredSkill.installs.toLocaleString()} uses</span>
			</div>
			<h3 class="featured-title">{data.featuredSkill.title}</h3>
			<p class="featured-desc">{data.featuredSkill.description}</p>
			<div class="featured-preview">
				{#if data.featuredSkill.files[0]}
					<div class="featured-code-header">
						<span class="featured-filename">📄 {data.featuredSkill.files[0].name}</span>
						<span class="featured-version">v{data.featuredSkill.version}</span>
					</div>
					<pre class="featured-code"><code>{data.featuredSkill.files[0].content.slice(0, 600)}{data.featuredSkill.files[0].content.length > 600 ? '\n...' : ''}</code></pre>
				{/if}
			</div>
			<div class="featured-author">
				<span class="featured-by">by</span>
				<span class="featured-author-name">@{data.featuredSkill.author.username}</span>
				<span class="featured-cta">View full skill →</span>
			</div>
		</a>
	</div>
</section>
{/if}

<!-- Featured Plugins -->
{#if data.featuredPlugins && data.featuredPlugins.length > 0}
<section class="plugins-section">
	<div class="section-inner">
		<h2 class="handwriting">Featured <span class="sketch">Plugins</span></h2>
		<p class="plugins-subtitle">Curated learning paths — multiple skills bundled into one curriculum.</p>
		<div class="plugins-grid">
			{#each data.featuredPlugins as plugin}
				<a href="/p/{plugin.author?.username}/{plugin.name}" class="plugin-card">
					<div class="plugin-card-top">
						{#if plugin.category}
							<span class="plugin-category">{plugin.category}</span>
						{/if}
						<span class="plugin-skill-count">{plugin.skillCount} skills</span>
					</div>
					<h3 class="plugin-title">{plugin.title}</h3>
					{#if plugin.description}
						<p class="plugin-desc">{plugin.description}</p>
					{/if}
					{#if plugin.author}
						<div class="plugin-author">
							<span class="plugin-by">by</span>
							<span class="plugin-author-name">@{plugin.author.username}</span>
						</div>
					{/if}
				</a>
			{/each}
		</div>
	</div>
</section>
{/if}

<!-- Use Cases -->
<section class="use-cases">
	<div class="section-inner">
		<h2 class="handwriting">Who's it for? <span class="sketch">Everyone.</span></h2>
		<div class="cases-grid">
			{#each useCases as uc}
				<div class="case-card">
					<span class="case-who">{uc.who}</span>
					<span class="case-arrow">→</span>
					<span class="case-what">{uc.what}</span>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Explore Categories -->
<section id="explore" class="explore">
	<div class="section-inner">
		<h2 class="handwriting">Browse by <span class="sketch">craft</span></h2>
		<div class="categories">
			{#each categories as cat}
				<a href="/browse?category={cat}" class="cat-pill">{cat}</a>
			{/each}
		</div>
		<div class="principles">
			<div class="principle">
				<span class="principle-icon">🧶</span>
				<h3>Always free</h3>
				<p>Skills never cost money. Knowledge wants to be free. Authors can receive donations from people who love their work.</p>
			</div>
			<div class="principle">
				<span class="principle-icon">🌍</span>
				<h3>Open format</h3>
				<p>Built on the <a href="https://agentskills.io" target="_blank" rel="noopener">AgentSkills.io</a> spec. Works with any AI agent — not locked to one platform.</p>
			</div>
			<div class="principle">
				<span class="principle-icon">✅</span>
				<h3>Verified authors</h3>
				<p>Real people, verified profiles. You know exactly who created the skill you're using.</p>
			</div>
		</div>
	</div>
</section>

<!-- Footer -->
<footer>
	<div class="footer-inner">
		<div class="footer-brand">
			<div class="footer-logo">
				<YarnLogo size={28} />
				<span class="logo-text">loooom</span>
			</div>
			<p class="footer-tagline">Where skills are woven.</p>
			<p class="footer-note">Open source. Always free. Made with 🧶</p>
		</div>
		<div class="footer-links">
			<div class="footer-col">
				<h4>Product</h4>
				<a href="#vision">About</a>
				<a href="#explore">Explore</a>
			</div>
			<div class="footer-col">
				<h4>Open Source</h4>
				<a href="https://github.com/mager/loooom.xyz" target="_blank" rel="noopener">GitHub</a>
				<a href="https://agentskills.io" target="_blank" rel="noopener">AgentSkills.io</a>
			</div>
			<div class="footer-col">
				<h4>Community</h4>
				<a href="https://github.com/mager/loooom.xyz" target="_blank" rel="noopener">Contribute</a>
			</div>
		</div>
	</div>
	<div class="footer-bottom">
		<span>A weeknight project by <a href="https://x.com/mager" target="_blank" rel="noopener">@mager</a> & <a href="https://x.com/mager" target="_blank" rel="noopener">@magerbot</a>. Woven in Chicago. Never stop learning.</span>
	</div>
</footer>

<style>
	/* ===== Global overflow fix ===== */
	:global(body) { overflow-x: hidden; max-width: 100vw; }

	/* ===== Ambient ===== */
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
		opacity: 0.06;
	}
	:global(html[data-theme="dark"]) .orb {
		opacity: 0.12;
	}
	.orb-1 {
		width: 500px; height: 500px;
		background: var(--accent);
		top: -100px; left: -100px;
		animation: drift 25s ease-in-out infinite;
	}
	.orb-2 {
		width: 400px; height: 400px;
		background: var(--yarn-pink);
		bottom: 10%; right: -100px;
		animation: drift 30s ease-in-out infinite reverse;
	}
	@keyframes drift {
		0%, 100% { transform: translate(0, 0); }
		50% { transform: translate(30px, -20px); }
	}

	/* ===== Nav ===== */
	nav {
		position: fixed;
		top: 0; left: 0; right: 0;
		z-index: 100;
		backdrop-filter: blur(20px);
		background: var(--nav-bg);
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
		font-size: 1.3rem;
		font-weight: 100;
		letter-spacing: 0.02em;
	}
	.nav-links {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}
	.nav-links a {
		color: var(--text-secondary);
		font-size: 0.9rem;
		font-weight: 500;
		transition: color 0.2s;
	}
	.nav-links a:hover { color: var(--text-primary); }
	.btn-nav {
		background: var(--bg-card);
		color: var(--text-primary) !important;
		border: 1px solid var(--border);
		padding: 0.5rem 1.25rem;
		border-radius: var(--radius-sm);
		font-size: 0.875rem;
		font-weight: 500;
		transition: all 0.2s;
	}
	.btn-nav:hover {
		border-color: var(--text-secondary);
	}

	/* ===== Handwriting ===== */
	.handwriting {
		font-family: var(--font-handwriting);
		font-weight: 100;
		text-shadow: 0 0.5px 0 rgba(0, 0, 0, 0.06);
	}
	:global(html[data-theme="dark"]) .handwriting {
		text-shadow: 0 0.5px 0 rgba(255, 255, 255, 0.08);
	}
	.handwriting.accent {
		color: var(--accent-rose);
		font-weight: 200;
	}
	.sketch {
		font-family: var(--font-sketch);
		font-weight: 400;
		color: var(--yarn-pink);
	}
	.marker {
		position: relative;
		padding: 0 2px;
	}
	.marker.pink {
		background: linear-gradient(to top, rgba(232, 67, 147, 0.2) 40%, transparent 40%);
	}
	.marker.blue {
		background: linear-gradient(to top, rgba(61, 133, 198, 0.2) 40%, transparent 40%);
	}
	.marker.orange {
		background: linear-gradient(to top, rgba(232, 160, 32, 0.2) 40%, transparent 40%);
	}
	.marker.green {
		background: linear-gradient(to top, rgba(39, 174, 96, 0.2) 40%, transparent 40%);
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
		grid-template-columns: 1.2fr 0.8fr;
		gap: 4rem;
		align-items: center;
	}
	h1 {
		font-size: clamp(2.2rem, 4.5vw, 3.5rem);
		line-height: 1.1;
		margin-bottom: 1.5rem;
	}
	.hero-sub {
		font-size: 1.15rem;
		color: var(--text-secondary);
		line-height: 1.45;
		max-width: 520px;
		margin-bottom: 2rem;
	}
	.hero-sub strong {
		color: var(--text-primary);
	}
	.hero-note {
		font-family: var(--font-sketch);
		font-size: 1rem;
		color: var(--text-muted);
		margin-top: 1rem;
	}
	.hero-actions {
		display: flex;
		gap: 0.5rem;
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
		box-shadow: 0 8px 30px rgba(45, 42, 62, 0.2);
	}
	.btn-arrow { transition: transform 0.2s; }
	.btn-primary:hover .btn-arrow { transform: translateX(3px); }
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
	.waitlist-input::placeholder { color: var(--text-muted); }
	.waitlist-input:focus { border-color: var(--text-secondary); }
	.waitlist-success {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.5rem;
		background: rgba(39, 174, 96, 0.1);
		border: 1px solid rgba(39, 174, 96, 0.3);
		border-radius: var(--radius-md);
		color: var(--yarn-green);
		font-weight: 500;
	}
	.success-check { font-size: 1.2rem; font-weight: 400; }
	.hero-visual {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* Hero Plugin Card */
	.hero-plugin-card {
		display: block;
		width: 100%;
		max-width: 380px;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 1.75rem;
		box-shadow: 0 8px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(108,92,231,0.05);
		transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
		text-decoration: none;
		color: inherit;
		position: relative;
		overflow: hidden;
	}
	.hero-plugin-card::before {
		content: '';
		position: absolute;
		top: 0; left: 0; right: 0;
		height: 3px;
		background: linear-gradient(90deg, var(--accent), var(--yarn-pink), var(--yarn-teal));
	}
	.hero-plugin-card:hover {
		transform: translateY(-6px) rotate(-0.5deg);
		box-shadow: 0 20px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(108,92,231,0.1);
		border-color: var(--text-muted);
		color: inherit;
	}
	.hero-plugin-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
	}
	.hero-plugin-badge {
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--accent);
		background: color-mix(in srgb, var(--accent) 10%, transparent);
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
	}
	.hero-plugin-count {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--text-muted);
	}
	.hero-plugin-title {
		font-family: var(--font-handwriting);
		font-size: 1.6rem;
		font-weight: 100;
		color: var(--text-primary);
		margin-bottom: 0.25rem;
	}
	.hero-plugin-desc {
		font-size: 0.9rem;
		color: var(--text-secondary);
		margin-bottom: 1.25rem;
	}
	.hero-plugin-skills {
		display: flex;
		flex-direction: column;
		gap: 0;
	}
	.hero-skill-row {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.5rem 0.6rem;
		border-radius: var(--radius-sm);
		transition: background 0.2s;
		animation: skillFadeIn 0.4s ease-out both;
	}
	@keyframes skillFadeIn {
		from { opacity: 0; transform: translateX(-8px); }
		to { opacity: 1; transform: translateX(0); }
	}
	.hero-plugin-card:hover .hero-skill-row:hover {
		background: var(--bg-card-hover);
	}
	.hero-skill-num {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		font-weight: 700;
		color: var(--text-muted);
		width: 16px;
		text-align: center;
	}
	.hero-skill-emoji {
		font-size: 1rem;
		width: 24px;
		text-align: center;
	}
	.hero-skill-title {
		font-family: var(--font-display);
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text-primary);
		flex: 1;
	}
	.hero-skill-tag {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	.hero-plugin-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 1rem;
		padding-top: 0.75rem;
		border-top: 1px solid var(--border);
	}
	.hero-plugin-author {
		font-family: var(--font-handwriting);
		font-size: 0.85rem;
		color: var(--text-muted);
	}
	.hero-plugin-cta {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--accent-rose);
		transition: transform 0.2s;
	}
	.hero-plugin-card:hover .hero-plugin-cta {
		transform: translateX(4px);
	}

	/* ===== Vision ===== */
	.vision {
		position: relative;
		z-index: 1;
		padding: 4rem 0 6rem;
	}
	.vision h2 {
		font-size: clamp(2rem, 4vw, 3rem);
		margin-bottom: 2.5rem;
		color: var(--text-primary);
	}
	.vision-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
	}
	.vision-card {
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 2rem;
		box-shadow: var(--card-shadow);
		transition: all 0.25s;
	}
	.vision-card:hover {
		box-shadow: var(--card-shadow-hover);
		transform: translateY(-2px);
	}
	.vision-card p {
		font-size: 1.05rem;
		line-height: 1.45;
		color: var(--text-secondary);
	}

	/* ===== Use Cases ===== */
	.use-cases {
		position: relative;
		z-index: 1;
		padding: 2rem 0 6rem;
	}
	.use-cases h2 {
		font-size: clamp(2rem, 4vw, 3rem);
		margin-bottom: 2.5rem;
	}
	.cases-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}
	.case-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.25rem 1.5rem;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		box-shadow: var(--card-shadow);
		transition: all 0.25s;
	}
	.case-card:hover {
		border-color: var(--border);
		box-shadow: var(--card-shadow-hover);
	}
	.case-who {
		font-family: var(--font-handwriting);
		font-size: 1.2rem;
		color: var(--text-primary);
		white-space: nowrap;
	}
	.case-arrow {
		color: var(--text-muted);
		font-weight: 400;
	}
	.case-what {
		font-family: var(--font-sketch);
		font-size: 1.1rem;
		color: var(--yarn-pink);
	}

	/* ===== Explore ===== */
	.section-inner {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2rem;
	}
	.explore {
		position: relative;
		z-index: 1;
		padding: 2rem 0 6rem;
	}
	.explore h2 {
		font-size: clamp(2rem, 4vw, 3rem);
		margin-bottom: 2rem;
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
		font-family: var(--font-handwriting);
		font-size: 1.05rem;
		cursor: pointer;
		transition: all 0.25s;
		box-shadow: var(--card-shadow);
		text-decoration: none;
	}
	.cat-pill:hover {
		border-color: var(--text-secondary);
		color: var(--text-primary);
		transform: translateY(-1px);
	}
	.principles {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
	}
	.principle {
		text-align: center;
		padding: 2rem 1.5rem;
	}
	.principle-icon {
		font-size: 2rem;
		display: block;
		margin-bottom: 1rem;
	}
	.principle h3 {
		font-family: var(--font-handwriting);
		font-size: 1.3rem;
		margin-bottom: 0.75rem;
	}
	.principle p {
		font-size: 0.95rem;
		color: var(--text-secondary);
		line-height: 1.45;
	}

	/* ===== Footer ===== */
	footer {
		position: relative;
		z-index: 1;
		border-top: 1px solid var(--border);
		padding: 5rem 2rem 3rem;
		margin-top: 4rem;
	}
	.footer-inner {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		margin-bottom: 3rem;
	}
	.footer-logo {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}
	.footer-tagline {
		color: var(--text-secondary);
		font-family: var(--font-handwriting);
		font-size: 1rem;
	}
	.footer-note {
		color: var(--text-muted);
		font-size: 0.8rem;
		margin-top: 0.5rem;
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

	/* ===== Featured Skill ===== */
	.featured {
		position: relative;
		z-index: 1;
		padding: 2rem 0 6rem;
	}
	.featured h2 {
		font-size: clamp(2rem, 4vw, 3rem);
		margin-bottom: 2rem;
	}
	.featured-card {
		display: block;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 2.5rem;
		box-shadow: var(--card-shadow);
		transition: all 0.3s;
		color: inherit;
		text-decoration: none;
	}
	.featured-card:hover {
		border-color: var(--border);
		box-shadow: var(--card-shadow-hover);
		transform: translateY(-3px);
		color: inherit;
	}
	.featured-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}
	.featured-category {
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--text-muted);
	}
	.featured-uses {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--text-muted);
	}
	.featured-title {
		font-family: var(--font-handwriting);
		font-size: clamp(1.5rem, 3vw, 2.2rem);
		font-weight: 200;
		margin-bottom: 0.75rem;
		color: var(--text-primary);
	}
	.featured-desc {
		font-size: 1.05rem;
		color: var(--text-secondary);
		line-height: 1.45;
		margin-bottom: 1.5rem;
		max-width: 700px;
	}
	.featured-preview {
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		overflow: hidden;
		margin-bottom: 1.5rem;
	}
	.featured-code-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.6rem 1rem;
		border-bottom: 1px solid var(--border);
		background: var(--bg-secondary);
	}
	.featured-filename {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--text-muted);
	}
	.featured-version {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--text-muted);
	}
	.featured-code {
		padding: 1.25rem;
		font-family: var(--font-mono);
		font-size: 0.88rem;
		line-height: 1.5;
		color: var(--text-secondary);
		margin: 0;
		white-space: pre-wrap;
		word-wrap: break-word;
		overflow-wrap: break-word;
		max-height: 300px;
		overflow-y: auto;
	}
	.featured-code code { font-family: inherit; }
	.featured-author {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
	}
	.featured-by { color: var(--text-muted); }
	.featured-author-name {
		font-family: var(--font-handwriting);
		font-weight: 200;
		color: var(--text-primary);
	}
	.featured-cta {
		margin-left: auto;
		color: var(--accent-rose);
		font-weight: 600;
		font-size: 0.875rem;
		transition: transform 0.2s;
	}
	.featured-card:hover .featured-cta { transform: translateX(3px); }

	/* ===== Featured Plugins ===== */
	.plugins-section {
		position: relative;
		z-index: 1;
		padding: 2rem 0 6rem;
	}
	.plugins-section h2 {
		font-size: clamp(2rem, 4vw, 3rem);
		margin-bottom: 0.75rem;
	}
	.plugins-subtitle {
		color: var(--text-secondary);
		font-size: 1.05rem;
		margin-bottom: 2rem;
	}
	.plugins-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.25rem;
	}
	.plugin-card {
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		padding: 1.5rem;
		transition: all 0.25s;
		text-decoration: none;
		display: flex;
		flex-direction: column;
	}
	.plugin-card:hover {
		border-color: var(--border);
		box-shadow: var(--card-shadow-hover);
		transform: translateY(-2px);
	}
	.plugin-card-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
	}
	.plugin-category {
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--text-muted);
	}
	.plugin-skill-count {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--text-muted);
	}
	.plugin-title {
		font-size: 1.15rem;
		font-weight: 700;
		color: var(--text-primary);
		margin-bottom: 0.5rem;
	}
	.plugin-desc {
		font-size: 0.85rem;
		color: var(--text-secondary);
		line-height: 1.35;
		margin-bottom: 1rem;
		flex: 1;
	}
	.plugin-author {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		margin-top: auto;
	}
	.plugin-by {
		font-size: 0.8rem;
		color: var(--text-muted);
	}
	.plugin-author-name {
		font-family: var(--font-handwriting);
		font-size: 0.9rem;
		color: var(--text-primary);
	}

	/* ===== Responsive ===== */
	@media (max-width: 900px) {
		.hero-content {
			grid-template-columns: 1fr;
			text-align: center;
		}
		.hero-sub { margin: 0 auto 2rem; }
		.hero-actions { justify-content: center; }
		.hero-visual { order: -1; }
		.vision-grid { grid-template-columns: 1fr; }
		.cases-grid { grid-template-columns: 1fr; }
		.case-card { flex-wrap: wrap; }
		.case-who { white-space: normal; }
		.principles { grid-template-columns: 1fr; }
		.nav-inner { padding: 0 1rem; }
		.nav-links a:not(.btn-nav):not(:global(.theme-toggle)) { display: none; }
		.footer-inner { flex-direction: column; gap: 2rem; }
		.footer-links { gap: 2rem; }
		.waitlist-form { flex-direction: column; }
		.featured-card { padding: 1.5rem; }
		.featured-code { max-height: 200px; font-size: 0.78rem; }
		.hero { padding: 6rem 1rem 3rem; overflow-x: hidden; }
		.section-inner { padding: 0 1rem; }
	}
</style>
