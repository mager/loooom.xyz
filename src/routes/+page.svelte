<script lang="ts">
	import YarnLogo from '$lib/components/YarnLogo.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import { onMount } from 'svelte';

	// ── The grader (hero signature moment) ──────────────────────────────────
	// Two versions of the same skill, same topic, opposite craft. The real
	// hook scores 100; a costume version of it scores 8. Watching the gap is
	// the whole thesis: quality here is measured, not claimed.
	const DIMS = ['Method', 'Specificity', 'Worked example', 'Point of view', 'Voice'];
	const REAL = { score: 100, dims: [5, 5, 5, 5, 5], verdict: 'craft' };
	const COSTUME = { score: 8, dims: [1, 0, 0, 0, 1], verdict: 'costume' };

	let mode = $state<'real' | 'costume'>('real');
	const current = $derived(mode === 'real' ? REAL : COSTUME);

	let displayScore = $state(0);
	let stamped = $state(false);
	let reduce = false;
	let raf = 0;

	function animateScore(to: number) {
		cancelAnimationFrame(raf);
		stamped = false;
		if (reduce) {
			displayScore = to;
			stamped = true;
			return;
		}
		const from = displayScore;
		const start = performance.now();
		const dur = 950;
		const step = (now: number) => {
			const t = Math.min(1, (now - start) / dur);
			const e = 1 - Math.pow(1 - t, 3); // ease-out-cubic
			displayScore = Math.round(from + (to - from) * e);
			if (t < 1) raf = requestAnimationFrame(step);
			else {
				displayScore = to;
				stamped = true;
			}
		};
		raf = requestAnimationFrame(step);
	}

	function setMode(m: 'real' | 'costume') {
		if (m === mode) return;
		mode = m;
		animateScore(m === 'real' ? REAL.score : COSTUME.score);
	}

	onMount(() => {
		reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const el = document.querySelector('.grader');
		if (!el || reduce) {
			displayScore = REAL.score;
			stamped = true;
			return;
		}
		const io = new IntersectionObserver(
			(entries, obs) => {
				for (const en of entries)
					if (en.isIntersecting) {
						animateScore(REAL.score);
						obs.disconnect();
					}
			},
			{ threshold: 0.45 }
		);
		io.observe(el);
		return () => {
			io.disconnect();
			cancelAnimationFrame(raf);
		};
	});

	// ── What you can make ───────────────────────────────────────────────────
	const flagships = [
		{ name: 'hook', verb: 'Write a song hook', line: "people can't stop humming.", score: 100, tag: 'songwriting' },
		{ name: 'voice', verb: 'Find your own voice', line: 'instead of the default AI register.', score: 97, tag: 'writing' },
		{ name: 'story', verb: 'Tell a story', line: 'that actually lands.', score: 100, tag: 'storytelling' }
	];

	const rubric = [
		{ name: 'Method', blurb: 'A real, ordered procedure you can follow, not a pile of adjectives.' },
		{ name: 'Specificity', blurb: "Concrete, non-obvious craft. If you could regenerate it from the title, it fails." },
		{ name: 'Worked example', blurb: 'At least one case carried end to end, weak version to strong.' },
		{ name: 'Point of view', blurb: 'What not to do. The failure modes are where the expertise hides.' },
		{ name: 'Voice', blurb: 'Reads like a practitioner wrote it. Opinionated, dense, unpadded.' }
	];
</script>

<svelte:head>
	<title>Loooom — Curated skills for making things</title>
	<meta
		name="description"
		content="A curated collection of high-quality skills for the creative, non-technical parts of life. Each one is scored against a rubric before it ships. Copy one into any AI and start."
	/>
	<meta name="loooom-agents" content="https://loooom.xyz/AGENTS.md" />
	<meta name="loooom-llms" content="https://loooom.xyz/llms.txt" />
	<link rel="alternate" type="text/plain" title="LLM Index" href="/llms.txt" />
	<link rel="alternate" type="text/markdown" title="Agent Briefing" href="/AGENTS.md" />
</svelte:head>

<div class="page-shell">
	<div class="grain" aria-hidden="true"></div>

	<Nav />

	<main>
		<!-- HERO -->
		<section class="hero">
			<div class="hero-copy">
				<p class="eyebrow">Curated skills · scored before they ship</p>
				<h1>Make something <em>good.</em></h1>
				<p class="hero-sub">
					Loooom is a small, curated collection of skills for the creative, non-technical parts of
					life. Every one is graded against a rubric first. Copy one into any AI and start making.
				</p>
				<div class="hero-actions">
					<a href="/browse" class="primary-action">Browse the skills</a>
					<a href="/s/mager/hook" class="secondary-action">See one up close</a>
				</div>
				<p class="hero-trust">
					No terminal, no install. Works in Claude, ChatGPT, Gemini, anything.
				</p>
			</div>

			<!-- The grader: the thesis, live -->
			<div class="grader" class:is-costume={mode === 'costume'} aria-label="Live skill grading demo">
				<div class="grader-head">
					<span class="grader-title">Grading <code>hook</code></span>
					<div class="seg" role="tablist" aria-label="Which version to grade">
						<button
							role="tab"
							aria-selected={mode === 'real'}
							class:active={mode === 'real'}
							onclick={() => setMode('real')}>The real skill</button
						>
						<button
							role="tab"
							aria-selected={mode === 'costume'}
							class:active={mode === 'costume'}
							onclick={() => setMode('costume')}>A costume</button
						>
					</div>
				</div>

				<div class="grader-score">
					<span class="score-num">{displayScore}</span>
					<span class="score-of">/100</span>
					<span class="verdict v-{current.verdict}">{current.verdict}</span>
				</div>

				<div class="dims">
					{#each DIMS as d, i}
						<div class="dim">
							<span class="dim-name">{d}</span>
							<span class="dim-track">
								<span
									class="dim-fill"
									style="width:{(current.dims[i] / 5) * 100}%; transition-delay:{i * 70}ms"
								></span>
							</span>
							<span class="dim-val">{current.dims[i]}<i>/5</i></span>
						</div>
					{/each}
				</div>

				<div class="grader-foot">
					{#if mode === 'costume'}
						<span class="quip">You could guess this one from the title.</span>
					{:else}
						<span class="stamp" class:on={stamped}>✓ graded</span>
						<span class="foot-note">free model · same rubric, every skill</span>
					{/if}
				</div>
			</div>
		</section>

		<!-- WHAT YOU CAN MAKE -->
		<section class="make" aria-labelledby="make-heading">
			<div class="make-head">
				<h2 id="make-heading">What you can make today</h2>
				<p>Three are written and live. Twelve more are coming, held to the same bar.</p>
			</div>
			<div class="make-grid">
				{#each flagships as s, i}
					<a class="make-card" href="/s/mager/{s.name}" style="--i:{i}">
						<span class="make-name">{s.name}</span>
						<span class="make-score" data-pass={s.score >= 80}>{s.score}</span>
						<p class="make-line"><strong>{s.verb}</strong> {s.line}</p>
						<span class="make-tag">{s.tag}</span>
						<span class="make-go">open <i>→</i></span>
					</a>
				{/each}
			</div>
		</section>

		<!-- HOW IT'S SCORED -->
		<section class="grading" id="grading" aria-labelledby="grading-heading">
			<div class="grading-copy">
				<h2 id="grading-heading">Every skill earns its place.</h2>
				<p>
					Most skills you find online are a costume: a paragraph of generic advice with a nice
					filename, regenerable from the title alone. The good ones have a real method, concrete
					detail, and a point of view about what not to do.
				</p>
				<p>
					So every skill here is scored against the same five things, by a model, on a rubric you can
					read. A costume <code>hook</code> earns an 8. The real one earns 100. The gap is the point.
				</p>
				<a class="ghost-link" href="https://github.com/mager/loooom" target="_blank" rel="noopener"
					>Read the rubric <i>→</i></a
				>
			</div>
			<ol class="rubric">
				{#each rubric as r, i}
					<li style="--i:{i}">
						<span class="rubric-name">{r.name}</span>
						<span class="rubric-blurb">{r.blurb}</span>
					</li>
				{/each}
			</ol>
		</section>

		<!-- LAB, NOT STARTUP -->
		<section class="lab" aria-labelledby="lab-heading">
			<h2 id="lab-heading">A lab, not a startup.</h2>
			<p>
				Loooom is a personal experiment in how good a skill can actually be, and how you measure it.
				Curated, not crowdsourced. Free to use, always. Open source, the whole way down.
			</p>
		</section>

		<!-- FINAL CTA -->
		<section class="final">
			<h2>Go make something.</h2>
			<div class="hero-actions">
				<a href="/browse" class="primary-action">Browse the skills</a>
				<a href="/s/mager/story" class="secondary-action">Start with a story</a>
			</div>
		</section>
	</main>

	<footer>
		<div class="footer-brand">
			<YarnLogo size={22} />
			<span>loooom</span>
		</div>
		<div class="footer-links">
			<a href="/browse">Skills</a>
			<a href="#grading">Rubric</a>
			<a href="/AGENTS.md">AGENTS.md</a>
			<a href="https://github.com/mager/loooom" target="_blank" rel="noopener">GitHub</a>
		</div>
		<span class="footer-made">woven in Chicago by @mager</span>
	</footer>
</div>

<style>
	:global(html),
	:global(body) {
		overflow-x: hidden;
	}

	:global(body) {
		background:
			radial-gradient(circle at 12% -5%, color-mix(in srgb, var(--ocean) 16%, transparent), transparent 36rem),
			radial-gradient(circle at 88% 4%, color-mix(in srgb, var(--indigo) 14%, transparent), transparent 32rem),
			var(--bg-primary);
	}

	.page-shell {
		position: relative;
		min-height: 100vh;
	}

	/* woven grid texture, fading down */
	.grain {
		position: fixed;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		opacity: 0.5;
		background-image:
			linear-gradient(color-mix(in srgb, var(--text-primary) 4%, transparent) 1px, transparent 1px),
			linear-gradient(90deg, color-mix(in srgb, var(--text-primary) 4%, transparent) 1px, transparent 1px);
		background-size: 46px 46px;
		mask-image: linear-gradient(to bottom, black, transparent 62%);
	}

	main,
	footer {
		position: relative;
		z-index: 1;
	}

	.footer-brand {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		color: var(--text-primary);
		font-family: var(--font-handwriting);
		font-size: 1.45rem;
	}

	main {
		max-width: 1160px;
		margin: 0 auto;
		padding: clamp(4.5rem, 6vw, 5.5rem) 1.25rem 0;
	}

	.eyebrow {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--accent);
		font-weight: 700;
	}

	h1,
	h2 {
		font-family: var(--font-display);
		letter-spacing: -0.045em;
		color: var(--text-primary);
		text-wrap: balance;
	}

	/* ── Hero ── */
	.hero {
		display: grid;
		grid-template-columns: minmax(0, 1.05fr) minmax(330px, 0.82fr);
		gap: clamp(2rem, 6vw, 4.5rem);
		align-items: center;
		padding: clamp(1rem, 3vw, 2.5rem) 0 clamp(3rem, 8vw, 6rem);
	}

	.hero-copy {
		min-width: 0;
	}

	h1 {
		margin: 1rem 0 1.4rem;
		font-size: clamp(3.2rem, 8vw, 6rem);
		line-height: 0.92;
		font-weight: 800;
	}
	h1 em {
		font-family: var(--font-handwriting);
		font-style: normal;
		font-weight: 400;
		color: var(--accent-dim);
		position: relative;
		padding-right: 0.06em;
	}
	/* hand-drawn underline on the payoff word */
	h1 em::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0.06em;
		bottom: 0.04em;
		height: 0.12em;
		border-radius: 999px;
		background: linear-gradient(90deg, var(--ocean), var(--indigo));
		transform: scaleX(0);
		transform-origin: left;
		animation: draw 0.9s 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
	}
	@keyframes draw {
		to {
			transform: scaleX(1);
		}
	}

	.hero-sub {
		max-width: 44ch;
		color: var(--text-secondary);
		font-size: clamp(1.05rem, 1.7vw, 1.3rem);
		line-height: 1.6;
	}

	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.85rem;
		margin-top: 2rem;
	}

	.primary-action,
	.secondary-action {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 48px;
		padding: 0.85rem 1.35rem;
		border-radius: 999px;
		font-family: var(--font-display);
		font-weight: 700;
		cursor: pointer;
		transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
	}
	.primary-action {
		background: var(--gradient-cta);
		color: #fff;
		box-shadow: 0 16px 40px color-mix(in srgb, var(--accent) 26%, transparent);
	}
	.primary-action:hover {
		transform: translateY(-2px);
		box-shadow: 0 22px 52px color-mix(in srgb, var(--accent) 34%, transparent);
		color: #fff;
	}
	.secondary-action {
		color: var(--text-primary);
		border: 1px solid var(--border);
		background: color-mix(in srgb, var(--bg-card) 78%, transparent);
	}
	.secondary-action:hover {
		transform: translateY(-2px);
		border-color: color-mix(in srgb, var(--accent) 50%, var(--border));
		color: var(--text-primary);
	}

	.hero-trust {
		margin-top: 1.5rem;
		color: var(--text-muted);
		font-size: 0.86rem;
		font-family: var(--font-mono);
	}

	/* ── The grader ── */
	.grader {
		position: relative;
		padding: 1.4rem 1.5rem 1.25rem;
		border: 1px solid color-mix(in srgb, var(--border) 90%, transparent);
		border-radius: 26px;
		background: color-mix(in srgb, var(--bg-card) 92%, transparent);
		box-shadow: 0 30px 80px color-mix(in srgb, var(--accent) 14%, transparent);
		backdrop-filter: blur(16px);
		transition: box-shadow 0.4s ease, border-color 0.4s ease, filter 0.4s ease;
	}
	.grader::before {
		content: '';
		position: absolute;
		inset: -1px;
		border-radius: 27px;
		padding: 1px;
		background: linear-gradient(135deg, color-mix(in srgb, var(--ocean) 55%, transparent), transparent 45%);
		-webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		pointer-events: none;
	}
	.grader.is-costume {
		filter: saturate(0.7);
		box-shadow: 0 24px 60px color-mix(in srgb, var(--rose) 12%, transparent);
	}

	.grader-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		margin-bottom: 1.1rem;
	}
	.grader-title {
		font-family: var(--font-mono);
		font-size: 0.82rem;
		color: var(--text-muted);
	}
	.grader-title code {
		color: var(--text-primary);
		font-weight: 700;
	}

	.seg {
		display: inline-flex;
		padding: 0.2rem;
		gap: 0.15rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 999px;
	}
	.seg button {
		border: 0;
		cursor: pointer;
		padding: 0.32rem 0.7rem;
		border-radius: 999px;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 700;
		color: var(--text-muted);
		background: transparent;
		transition: color 0.2s, background 0.2s;
	}
	.seg button.active {
		color: var(--text-primary);
		background: var(--bg-card);
		box-shadow: var(--card-shadow);
	}

	.grader-score {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		margin-bottom: 1.25rem;
	}
	.score-num {
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: clamp(3.2rem, 7vw, 4.6rem);
		line-height: 1;
		font-variant-numeric: tabular-nums;
		letter-spacing: -0.04em;
		color: var(--emerald);
		transition: color 0.4s ease;
	}
	.is-costume .score-num {
		color: var(--rose);
	}
	.score-of {
		font-family: var(--font-mono);
		font-size: 1rem;
		color: var(--text-muted);
	}
	.verdict {
		margin-left: auto;
		align-self: center;
		padding: 0.3rem 0.7rem;
		border-radius: 999px;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}
	.v-craft {
		color: var(--emerald);
		background: color-mix(in srgb, var(--emerald) 16%, transparent);
	}
	.v-costume {
		color: var(--rose);
		background: color-mix(in srgb, var(--rose) 16%, transparent);
	}

	.dims {
		display: grid;
		gap: 0.6rem;
	}
	.dim {
		display: grid;
		grid-template-columns: 7.5rem 1fr auto;
		align-items: center;
		gap: 0.7rem;
	}
	.dim-name {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--text-secondary);
	}
	.dim-track {
		height: 7px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--text-muted) 22%, transparent);
		overflow: hidden;
	}
	.dim-fill {
		display: block;
		height: 100%;
		border-radius: 999px;
		background: linear-gradient(90deg, var(--ocean), var(--indigo));
		transition: width 0.85s cubic-bezier(0.34, 1.3, 0.5, 1);
	}
	.is-costume .dim-fill {
		background: linear-gradient(90deg, var(--rose), color-mix(in srgb, var(--amber) 70%, var(--rose)));
	}
	.dim-val {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		font-weight: 700;
		color: var(--text-primary);
	}
	.dim-val i {
		color: var(--text-muted);
		font-style: normal;
		font-weight: 400;
	}

	.grader-foot {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin-top: 1.1rem;
		padding-top: 0.9rem;
		border-top: 1px solid var(--border);
		min-height: 1.9rem;
	}
	.stamp {
		font-family: var(--font-mono);
		font-size: 0.74rem;
		font-weight: 700;
		color: var(--emerald);
		padding: 0.2rem 0.5rem;
		border: 1.5px solid color-mix(in srgb, var(--emerald) 55%, transparent);
		border-radius: 7px;
		transform: rotate(-5deg) scale(0.6);
		opacity: 0;
		transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
	}
	.stamp.on {
		transform: rotate(-5deg) scale(1);
		opacity: 1;
	}
	.foot-note {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--text-muted);
	}
	.quip {
		font-family: var(--font-mono);
		font-size: 0.76rem;
		color: var(--rose);
		font-style: italic;
	}

	/* ── Sections ── */
	.make,
	.grading,
	.lab,
	.final {
		padding: clamp(3.5rem, 7vw, 6rem) 0;
		border-top: 1px solid var(--border);
	}

	h2 {
		font-size: clamp(2rem, 4.5vw, 3.4rem);
		line-height: 1;
		font-weight: 800;
	}

	.make-head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.6rem 2rem;
		margin-bottom: 2rem;
	}
	.make-head p {
		color: var(--text-secondary);
		font-size: 1rem;
		max-width: 34ch;
	}

	.make-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}
	.make-card {
		position: relative;
		display: grid;
		grid-template-rows: auto 1fr auto;
		gap: 0.5rem;
		min-height: 220px;
		padding: 1.4rem;
		border: 1px solid var(--border);
		border-radius: 24px;
		background: color-mix(in srgb, var(--bg-card) 86%, transparent);
		box-shadow: var(--card-shadow);
		color: var(--text-primary);
		overflow: hidden;
		transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.22s ease, border-color 0.22s ease;
	}
	.make-card:hover {
		transform: translateY(-4px);
		border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
		box-shadow: var(--card-shadow-hover);
	}
	/* a thread that draws across the top on hover */
	.make-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: linear-gradient(90deg, var(--ocean), var(--indigo));
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.make-card:hover::before {
		transform: scaleX(1);
	}
	.make-name {
		font-family: var(--font-handwriting);
		font-size: 1.7rem;
		color: var(--text-primary);
		line-height: 1;
	}
	.make-score {
		position: absolute;
		top: 1.3rem;
		right: 1.4rem;
		font-family: var(--font-mono);
		font-size: 0.82rem;
		font-weight: 700;
		color: var(--emerald);
		padding: 0.18rem 0.5rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--emerald) 14%, transparent);
	}
	.make-line {
		align-self: center;
		font-size: 1.02rem;
		line-height: 1.45;
		color: var(--text-secondary);
	}
	.make-line strong {
		color: var(--text-primary);
		font-weight: 700;
	}
	.make-tag {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--text-muted);
	}
	.make-go {
		position: absolute;
		bottom: 1.3rem;
		right: 1.4rem;
		font-family: var(--font-mono);
		font-size: 0.76rem;
		font-weight: 700;
		color: var(--accent);
		opacity: 0;
		transform: translateX(-4px);
		transition: opacity 0.22s ease, transform 0.22s ease;
	}
	.make-card:hover .make-go {
		opacity: 1;
		transform: translateX(0);
	}
	.make-go i {
		font-style: normal;
		transition: transform 0.22s ease;
	}
	.make-card:hover .make-go i {
		transform: translateX(3px);
	}

	/* ── Grading section ── */
	.grading {
		display: grid;
		grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
		gap: clamp(2rem, 5vw, 4rem);
		align-items: center;
	}
	.grading-copy h2 {
		margin-bottom: 1.2rem;
	}
	.grading-copy p {
		color: var(--text-secondary);
		font-size: 1.05rem;
		line-height: 1.65;
		margin-bottom: 1rem;
		max-width: 52ch;
	}
	.grading-copy code {
		font-family: var(--font-mono);
		font-size: 0.9em;
		color: var(--accent-dim);
		font-weight: 700;
	}
	.ghost-link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin-top: 0.5rem;
		font-weight: 700;
		color: var(--accent);
	}
	.ghost-link i {
		font-style: normal;
		transition: transform 0.2s ease;
	}
	.ghost-link:hover i {
		transform: translateX(4px);
	}

	.rubric {
		list-style: none;
		display: grid;
		gap: 0.55rem;
		counter-reset: r;
	}
	.rubric li {
		counter-increment: r;
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.3rem 1rem;
		align-items: baseline;
		padding: 1rem 1.2rem;
		border: 1px solid var(--border);
		border-radius: 18px;
		background: color-mix(in srgb, var(--bg-card) 70%, transparent);
		transition: border-color 0.2s ease, transform 0.2s ease;
	}
	.rubric li:hover {
		border-color: color-mix(in srgb, var(--accent) 40%, var(--border));
		transform: translateX(4px);
	}
	.rubric li::before {
		content: counter(r);
		font-family: var(--font-mono);
		font-size: 0.78rem;
		font-weight: 700;
		color: var(--accent);
		grid-row: span 2;
	}
	.rubric-name {
		font-weight: 700;
		color: var(--text-primary);
		font-size: 1.02rem;
	}
	.rubric-blurb {
		grid-column: 2;
		color: var(--text-secondary);
		font-size: 0.92rem;
		line-height: 1.5;
	}

	/* ── Lab ── */
	.lab {
		max-width: 720px;
	}
	.lab h2 {
		margin-bottom: 1rem;
	}
	.lab p {
		color: var(--text-secondary);
		font-size: 1.15rem;
		line-height: 1.6;
		max-width: 56ch;
	}

	/* ── Final ── */
	.final {
		text-align: center;
		max-width: 720px;
		margin: 0 auto;
	}
	.final h2 {
		margin-bottom: 1.5rem;
		font-size: clamp(2.4rem, 6vw, 4rem);
	}
	.final .hero-actions {
		justify-content: center;
	}

	/* ── Footer ── */
	footer {
		max-width: 1160px;
		margin: 0 auto;
		padding: 2.5rem 1.25rem 3rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 1rem;
		border-top: 1px solid var(--border);
	}
	.footer-brand {
		font-size: 1.2rem;
	}
	.footer-links {
		display: flex;
		gap: 1.1rem;
		flex-wrap: wrap;
	}
	.footer-links a {
		color: var(--text-secondary);
		font-size: 0.88rem;
		font-weight: 600;
	}
	.footer-links a:hover {
		color: var(--text-primary);
	}
	.footer-made {
		font-family: var(--font-handwriting);
		font-size: 1.05rem;
		color: var(--text-muted);
	}

	/* ── Responsive ── */
	@media (max-width: 900px) {
		.hero,
		.grading {
			grid-template-columns: 1fr;
		}
		.make-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 620px) {
		main {
			padding: 4rem 1rem 0;
		}
		h1 {
			font-size: clamp(2.7rem, 14vw, 3.6rem);
		}
		.dim {
			grid-template-columns: 6.2rem 1fr auto;
		}
		.dim-name {
			font-size: 0.74rem;
		}
		footer {
			flex-direction: column;
			align-items: flex-start;
		}
	}

	/* ── Reduced motion ── */
	@media (prefers-reduced-motion: reduce) {
		.dim-fill,
		.stamp,
		.make-card,
		.make-card::before,
		.primary-action,
		.secondary-action {
			transition: none !important;
		}
		h1 em::after {
			animation: none;
			transform: scaleX(1);
		}
		.stamp {
			opacity: 1;
			transform: rotate(-5deg) scale(1);
		}
	}
</style>
