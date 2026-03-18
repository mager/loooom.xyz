<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';

	let { data } = $props();

	const featuredSkills = $derived(data.featuredSkills ?? []);
	const totalCount = $derived(data.totalCount ?? 0);

	type Skill = {
		name: string;
		title: string;
		description: string | null;
		category: string | null;
		installs: number;
		version: string;
		authorUsername: string;
		authorDisplayName: string;
		authorAvatarUrl: string | null;
		link: string;
	};

	let copiedCommand = $state<string | null>(null);
	function copyCommand(cmd: string) {
		navigator.clipboard.writeText(cmd);
		copiedCommand = cmd;
		setTimeout(() => (copiedCommand = null), 2000);
	}

	const categoryColors: Record<string, string> = {
		writing: '#e8a598',
		music: '#a8c5da',
		cooking: '#c8b89a',
		engineering: '#98b4d4',
		art: '#d4a8c4',
		research: '#a8d4b8',
		design: '#d4c4a8',
		education: '#b8a8d4',
		health: '#a8d4c8',
		business: '#d4b8a8',
		languages: '#a8c8d4',
		productivity: '#c4d4a8',
		life: '#d4a8b8',
		coding: '#a8acd4',
		default: '#c4b8d4'
	};

	function categoryColor(cat: string | null): string {
		return categoryColors[(cat ?? '').toLowerCase()] ?? categoryColors.default;
	}
</script>

<svelte:head>
	<title>Loooom — Skills Marketplace for AI Agents</title>
	<meta
		name="description"
		content="Discover, publish, and share skills with any AI. The open marketplace for Claude Code skills — written by humans, used by agents."
	/>
	<meta name="loooom-agents" content="https://loooom.xyz/AGENTS.md" />
	<meta name="loooom-directory" content="https://loooom.xyz/api/directory" />
	<meta name="loooom-llms" content="https://loooom.xyz/llms.txt" />
	<link rel="alternate" type="text/plain" title="LLM Index" href="/llms.txt" />
	<link rel="alternate" type="text/markdown" title="Agent Briefing" href="/AGENTS.md" />
</svelte:head>

<Nav />

<!-- ===== HERO ===== -->
<section class="hero">
	<div class="hero-inner">
		<div class="hero-eyebrow">
			<span class="eyebrow-dot"></span>
			<span class="eyebrow-text">Open skills marketplace</span>
		</div>

		<h1>Skills for<br/><span class="h1-accent">any AI.</span></h1>

		<p class="hero-sub">
			Discover and publish skills that teach Claude Code new behaviors.
			Plain markdown. Free forever. Anyone can contribute.
		</p>

		<div class="hero-count">
			<span class="count-num">{totalCount}+</span>
			<span class="count-label">skills and growing</span>
		</div>

		<div class="hero-actions">
			<a href="/browse" class="btn-primary">Browse Skills →</a>
			<a href="/create" class="btn-ghost">Publish a Skill</a>
		</div>
	</div>
</section>

<!-- ===== FEATURED SKILLS ===== -->
<section class="featured">
	<div class="section-inner">
		<div class="section-header">
			<p class="eyebrow">Featured Skills</p>
			<h2>Built by the community</h2>
			<a href="/browse" class="see-all">See all →</a>
		</div>

		<div class="skills-grid">
			{#each featuredSkills as skill (skill.name + skill.authorUsername)}
				<a href={skill.link} class="skill-card">
					<div class="skill-card-top">
						{#if skill.category}
							<span class="category-chip" style="background: {categoryColor(skill.category)}22; color: {categoryColor(skill.category)}; border-color: {categoryColor(skill.category)}44;">
								{skill.category}
							</span>
						{/if}
						<span class="installs">{skill.installs.toLocaleString()} uses</span>
					</div>
					<h3 class="skill-title">{skill.title}</h3>
					{#if skill.description}
						<p class="skill-desc">{skill.description}</p>
					{/if}
					<div class="skill-card-footer">
						<div class="author">
							<div class="author-avatar">
								{#if skill.authorAvatarUrl}
									<img src={skill.authorAvatarUrl} alt={skill.authorDisplayName} />
								{:else}
									{skill.authorDisplayName[0]}
								{/if}
							</div>
							<span class="author-name">{skill.authorDisplayName}</span>
						</div>
						<span class="skill-version">v{skill.version}</span>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- ===== HOW IT WORKS ===== -->
<section class="how">
	<div class="section-inner how-inner">
		<div class="how-text">
			<p class="eyebrow">Anyone can publish</p>
			<h2>Got a skill?<br/>Share it.</h2>
			<p class="how-sub">
				Skills are plain markdown files that teach Claude new behaviors.
				If you know how to do something — write it down and share it.
				No coding required.
			</p>
			<a href="/create" class="btn-primary">Start writing →</a>
		</div>
		<div class="how-steps">
			<div class="step">
				<div class="step-num">01</div>
				<div class="step-content">
					<h3>Sign in</h3>
					<p>Create your Loooom profile. It's free.</p>
				</div>
			</div>
			<div class="step-line"></div>
			<div class="step">
				<div class="step-num">02</div>
				<div class="step-content">
					<h3>Write your SKILL.md</h3>
					<p>Describe what your skill teaches. Use our editor with live preview.</p>
				</div>
			</div>
			<div class="step-line"></div>
			<div class="step">
				<div class="step-num">03</div>
				<div class="step-content">
					<h3>Publish for free</h3>
					<p>Your skill gets a permanent URL and install command. Always open.</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- ===== INSTALL DEMO ===== -->
<section class="install-demo">
	<div class="section-inner">
		<div class="demo-grid">
			<div class="demo-copy">
				<p class="eyebrow">One command away</p>
				<h2>Skills install in seconds.</h2>
				<p class="demo-sub">
					Any skill on Loooom installs directly into Claude Code.
					No config. No setup. Just run the command and it works.
				</p>
				<button
					class="copy-install-btn"
					onclick={() => copyCommand('/plugin marketplace add mager/loooom')}
				>
					{copiedCommand === '/plugin marketplace add mager/loooom' ? '✓ Copied!' : 'Copy install command'}
				</button>
			</div>
			<div class="code-window">
				<div class="code-bar">
					<span class="dot r"></span>
					<span class="dot y"></span>
					<span class="dot g"></span>
					<span class="code-label">Terminal</span>
				</div>
				<div class="code-body">
					<div class="code-line"><span class="prompt">$</span> <span class="cmd">/plugin marketplace add</span> <span class="arg">mager/loooom</span></div>
					<div class="code-line output">✓ Adding marketplace: mager/loooom</div>
					<div class="code-line output">✓ Fetching catalog...</div>
					<div class="code-line output">✓ 12 skills available</div>
					<div class="code-line"><span class="prompt">$</span> <span class="cmd">/skill use</span> <span class="arg">beginner-japanese</span></div>
					<div class="code-line output">✓ Skill loaded. Ready to teach.</div>
					<div class="code-line blink"><span class="prompt">$</span> <span class="cursor">▌</span></div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- ===== ME.MD (secondary) ===== -->
<section class="memd-section">
	<div class="section-inner">
		<div class="memd-inner">
			<div class="memd-badge">📄 Also on Loooom</div>
			<h2>Let every AI know who you are.</h2>
			<p class="memd-sub">
				<strong>ME.md</strong> is your portable identity file — a permanent URL that any AI can fetch.
				Write once, known everywhere. No re-introducing yourself to Claude, GPT, or Gemini.
			</p>
			<div class="memd-actions">
				<a href="/me" class="btn-memd-primary">Learn about ME.md →</a>
				<a href="/me/mager" class="btn-memd-ghost">See an example</a>
			</div>
		</div>
	</div>
</section>

<!-- ===== FOOTER ===== -->
<footer>
	<div class="footer-inner">
		<div class="footer-brand">
			<p class="footer-note">Open source. Free forever. Made in Chicago.</p>
			<div class="footer-machine-links">
				<a href="/AGENTS.md" class="footer-machine-link">AGENTS.md</a>
				<a href="/llms.txt" class="footer-machine-link">llms.txt</a>
				<a href="/api/directory" class="footer-machine-link">directory</a>
			</div>
		</div>
		<div class="footer-links">
			<div class="footer-col">
				<h4>Skills</h4>
				<a href="/browse">Browse</a>
				<a href="/create">Publish</a>
				<a href="/docs">Docs</a>
			</div>
			<div class="footer-col">
				<h4>ME.md</h4>
				<a href="/me">Overview</a>
				<a href="/me/mager">Example</a>
				<a href="/login">Claim yours</a>
			</div>
			<div class="footer-col">
				<h4>Open Source</h4>
				<a href="https://github.com/mager/loooom.xyz" target="_blank" rel="noopener">loooom.xyz</a>
				<a href="https://github.com/mager/loooom" target="_blank" rel="noopener">catalog</a>
			</div>
		</div>
	</div>
	<div class="footer-bottom">
		A weeknight project by <a href="https://x.com/mager" target="_blank" rel="noopener">@mager</a> &amp; <a href="https://x.com/mager" target="_blank" rel="noopener">@magerbot</a>.
	</div>
</footer>

<style>
	:global(html), :global(body) {
		overflow-x: hidden;
		max-width: 100vw;
	}

	.section-inner {
		max-width: 1040px;
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	.eyebrow {
		font-family: var(--font-mono);
		font-size: 0.65rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ocean);
		margin-bottom: 0.6rem;
	}

	/* ===== HERO ===== */
	.hero {
		padding: 8rem 1.5rem 5rem;
		text-align: center;
	}
	.hero-inner {
		max-width: 600px;
		margin: 0 auto;
	}
	.hero-eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 2rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--text-muted);
	}
	.eyebrow-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #22c55e;
		box-shadow: 0 0 6px #22c55e;
		animation: pulse 2s ease-in-out infinite;
	}
	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}
	.eyebrow-text { color: var(--text-muted); }

	h1 {
		font-family: var(--font-display);
		font-size: clamp(3.5rem, 10vw, 6rem);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.035em;
		color: var(--text-primary);
		margin-bottom: 1.5rem;
	}
	.h1-accent {
		color: var(--violet);
		position: relative;
	}
	.h1-accent::after {
		content: '';
		position: absolute;
		bottom: 0.05em;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(90deg, var(--violet), var(--ocean));
		border-radius: 2px;
		opacity: 0.4;
	}

	.hero-sub {
		font-size: clamp(0.95rem, 2.5vw, 1.15rem);
		color: var(--text-secondary);
		line-height: 1.65;
		max-width: 480px;
		margin: 0 auto 1.75rem;
		font-weight: 300;
	}

	.hero-count {
		display: inline-flex;
		align-items: baseline;
		gap: 0.5rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 999px;
		padding: 0.4rem 1.1rem;
		margin-bottom: 2rem;
		font-family: var(--font-mono);
	}
	.count-num {
		font-size: 1rem;
		font-weight: 700;
		color: var(--violet);
	}
	.count-label {
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.hero-actions {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		flex-wrap: wrap;
	}
	.btn-primary {
		background: var(--violet);
		color: white;
		font-weight: 700;
		font-size: 0.95rem;
		padding: 0.85rem 1.85rem;
		border-radius: 999px;
		text-decoration: none;
		transition: opacity 0.2s, transform 0.2s;
		white-space: nowrap;
	}
	.btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
	.btn-ghost {
		background: none;
		border: 1.5px solid var(--border);
		color: var(--text-secondary);
		font-size: 0.9rem;
		font-weight: 500;
		padding: 0.85rem 1.5rem;
		border-radius: 999px;
		text-decoration: none;
		transition: all 0.2s;
		white-space: nowrap;
	}
	.btn-ghost:hover { border-color: var(--violet); color: var(--violet); }

	/* ===== FEATURED SKILLS ===== */
	.featured {
		padding: 4.5rem 1.5rem;
		border-top: 1px solid var(--border);
	}
	.section-header {
		display: flex;
		align-items: baseline;
		gap: 1.5rem;
		margin-bottom: 2.5rem;
		flex-wrap: wrap;
	}
	.section-header h2 {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(1.5rem, 4vw, 2rem);
		letter-spacing: -0.025em;
		line-height: 1.1;
		color: var(--text-primary);
		margin: 0;
		flex: 1;
		min-width: 0;
	}
	.see-all {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--ocean);
		text-decoration: none;
		white-space: nowrap;
		transition: opacity 0.2s;
	}
	.see-all:hover { opacity: 0.75; }

	.skills-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.25rem;
	}
	.skill-card {
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 14px;
		padding: 1.4rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		text-decoration: none;
		transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
	}
	.skill-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 30px rgba(0,0,0,0.08);
		border-color: var(--text-muted);
	}
	.skill-card-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}
	.category-chip {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 3px 9px;
		border-radius: 999px;
		border: 1px solid;
	}
	.installs {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		color: var(--text-muted);
	}
	.skill-title {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 1.05rem;
		line-height: 1.2;
		color: var(--text-primary);
		margin: 0;
	}
	.skill-desc {
		font-size: 0.85rem;
		color: var(--text-secondary);
		line-height: 1.5;
		margin: 0;
		flex: 1;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.skill-card-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 0.75rem;
		border-top: 1px solid var(--border);
		margin-top: auto;
	}
	.author {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.author-avatar {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--violet), var(--ocean));
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.65rem;
		font-weight: 700;
		color: white;
		overflow: hidden;
		flex-shrink: 0;
	}
	.author-avatar img { width: 100%; height: 100%; object-fit: cover; }
	.author-name {
		font-size: 0.78rem;
		color: var(--text-muted);
		font-weight: 500;
	}
	.skill-version {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		color: var(--text-muted);
	}

	/* ===== HOW IT WORKS ===== */
	.how {
		padding: 5rem 1.5rem;
		background: var(--bg-secondary);
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
	}
	.how-inner {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4rem;
		align-items: center;
	}
	.how-text h2 {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: clamp(2rem, 4vw, 2.75rem);
		letter-spacing: -0.03em;
		line-height: 1.05;
		color: var(--text-primary);
		margin-bottom: 1rem;
	}
	.how-sub {
		font-size: 0.95rem;
		color: var(--text-secondary);
		line-height: 1.65;
		margin-bottom: 2rem;
		max-width: 380px;
	}
	.how-steps {
		display: flex;
		flex-direction: column;
		gap: 0;
	}
	.step {
		display: flex;
		gap: 1.25rem;
		align-items: flex-start;
	}
	.step-line {
		height: 24px;
		width: 2px;
		background: var(--border);
		margin-left: 18px;
	}
	.step-num {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: var(--bg-primary);
		border: 2px solid var(--border);
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-mono);
		font-size: 0.65rem;
		font-weight: 700;
		color: var(--violet);
		flex-shrink: 0;
	}
	.step-content { padding-top: 0.4rem; padding-bottom: 0.5rem; }
	.step-content h3 {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.95rem;
		color: var(--text-primary);
		margin: 0 0 0.2rem;
	}
	.step-content p {
		font-size: 0.85rem;
		color: var(--text-secondary);
		line-height: 1.5;
		margin: 0;
	}

	/* ===== INSTALL DEMO ===== */
	.install-demo {
		padding: 5rem 1.5rem;
	}
	.demo-grid {
		display: grid;
		grid-template-columns: 1fr 1.1fr;
		gap: 4rem;
		align-items: center;
	}
	.demo-copy h2 {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: clamp(1.6rem, 3.5vw, 2.25rem);
		letter-spacing: -0.03em;
		line-height: 1.1;
		color: var(--text-primary);
		margin-bottom: 0.85rem;
	}
	.demo-sub {
		font-size: 0.9rem;
		color: var(--text-secondary);
		line-height: 1.65;
		margin-bottom: 1.5rem;
		max-width: 360px;
	}
	.copy-install-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.7rem 1.5rem;
		background: var(--bg-secondary);
		border: 1.5px solid var(--border);
		border-radius: 8px;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 0.2s;
	}
	.copy-install-btn:hover { border-color: var(--violet); color: var(--violet); }

	.code-window {
		border: 1px solid var(--border);
		border-radius: 14px;
		overflow: hidden;
		box-shadow: 0 8px 40px rgba(0,0,0,0.08);
	}
	.code-bar {
		background: var(--bg-secondary);
		border-bottom: 1px solid var(--border);
		padding: 10px 14px;
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.dot { width: 10px; height: 10px; border-radius: 50%; }
	.dot.r { background: #ff5f57; }
	.dot.y { background: #febc2e; }
	.dot.g { background: #28c840; }
	.code-label {
		margin-left: 8px;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--text-muted);
	}
	.code-body {
		padding: 1.25rem 1.5rem;
		background: #0d0d14;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.code-line {
		font-family: var(--font-mono);
		font-size: 0.82rem;
		line-height: 1.6;
	}
	.prompt { color: #6366f1; margin-right: 0.5rem; }
	.cmd { color: #a5b4fc; }
	.arg { color: #34d399; }
	.output { color: #4ade80; padding-left: 1.25rem; }
	.cursor { animation: blink 1s step-end infinite; }
	@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
	.blink { color: #6366f1; }

	/* ===== ME.MD SECTION ===== */
	.memd-section {
		padding: 4rem 1.5rem;
		background: var(--bg-secondary);
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
	}
	.memd-inner {
		max-width: 680px;
		margin: 0 auto;
		text-align: center;
	}
	.memd-badge {
		display: inline-block;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 999px;
		padding: 0.3rem 0.9rem;
		font-family: var(--font-mono);
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		color: var(--text-muted);
		margin-bottom: 1.25rem;
	}
	.memd-inner h2 {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: clamp(1.5rem, 3.5vw, 2rem);
		letter-spacing: -0.025em;
		color: var(--text-primary);
		margin-bottom: 0.85rem;
	}
	.memd-sub {
		font-size: 0.95rem;
		color: var(--text-secondary);
		line-height: 1.65;
		margin-bottom: 1.75rem;
	}
	.memd-sub strong { color: var(--text-primary); }
	.memd-actions {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		flex-wrap: wrap;
	}
	.btn-memd-primary {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-primary);
		text-decoration: none;
		transition: color 0.2s;
	}
	.btn-memd-primary:hover { color: var(--ocean); }
	.btn-memd-ghost {
		font-size: 0.875rem;
		color: var(--text-muted);
		text-decoration: none;
		transition: color 0.2s;
	}
	.btn-memd-ghost:hover { color: var(--text-secondary); }

	/* ===== FOOTER ===== */
	footer {
		border-top: 1px solid var(--border);
		padding: 2.5rem 1.5rem 1.5rem;
	}
	.footer-inner {
		max-width: 1040px;
		margin: 0 auto 2rem;
		display: flex;
		justify-content: space-between;
		gap: 2rem;
		flex-wrap: wrap;
	}
	.footer-note {
		font-size: 0.78rem;
		color: var(--text-muted);
		font-weight: 300;
		margin-bottom: 0.75rem;
	}
	.footer-machine-links {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	.footer-machine-link {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		font-weight: 600;
		color: var(--ocean);
		text-decoration: none;
		background: color-mix(in srgb, var(--ocean) 8%, transparent);
		border: 1px solid color-mix(in srgb, var(--ocean) 25%, transparent);
		padding: 2px 8px;
		border-radius: 4px;
		transition: all 0.2s;
	}
	.footer-machine-link:hover { background: color-mix(in srgb, var(--ocean) 15%, transparent); }
	.footer-links { display: flex; gap: 3rem; }
	.footer-col { display: flex; flex-direction: column; gap: 0.6rem; }
	.footer-col h4 {
		font-family: var(--font-display);
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
		margin-bottom: 0.25rem;
	}
	.footer-col a {
		font-size: 0.875rem;
		color: var(--text-secondary);
		text-decoration: none;
		transition: color 0.2s;
		font-weight: 300;
	}
	.footer-col a:hover { color: var(--text-primary); }
	.footer-bottom {
		max-width: 1040px;
		margin: 0 auto;
		padding-top: 1.5rem;
		border-top: 1px solid var(--border);
		text-align: center;
		font-size: 0.75rem;
		color: var(--text-muted);
		font-weight: 300;
	}
	.footer-bottom a { color: var(--text-muted); text-decoration: none; }
	.footer-bottom a:hover { color: var(--text-primary); }

	/* ===== RESPONSIVE ===== */
	@media (max-width: 900px) {
		.skills-grid { grid-template-columns: repeat(2, 1fr); }
		.how-inner { grid-template-columns: 1fr; gap: 2.5rem; }
		.demo-grid { grid-template-columns: 1fr; gap: 2.5rem; }
	}
	@media (max-width: 640px) {
		.hero { padding: 6rem 1rem 3.5rem; }
		h1 { font-size: 3rem; }
		.skills-grid { grid-template-columns: 1fr; }
		.hero-actions { flex-direction: column; align-items: center; }
		.footer-inner { flex-direction: column; }
		.footer-links { gap: 2rem; flex-wrap: wrap; }
	}
</style>
