<script lang="ts">
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import YarnLogo from '$lib/components/YarnLogo.svelte';

	let copiedStates: Record<string, boolean> = $state({});

	async function copyText(id: string, text: string) {
		await navigator.clipboard.writeText(text);
		copiedStates[id] = true;
		setTimeout(() => copiedStates[id] = false, 2000);
	}
</script>

<svelte:head>
	<title>API Docs — Loooom</title>
	<meta name="description" content="Loooom API documentation. Everything you need to use skills programmatically." />
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
		<div class="nav-links">
			<a href="/#vision">About</a>
			<a href="/#explore">Explore</a>
			<a href="/docs" class="active">Docs</a>
			<ThemeToggle />
			<a href="/login" class="btn-nav">Sign In</a>
		</div>
	</div>
</nav>

<section class="docs-page">
	<div class="docs-inner">
		<div class="docs-header">
			<h1 class="handwriting">Loooom API</h1>
			<p class="docs-subtitle">Everything you need to use skills programmatically.</p>
			<div class="base-url">
				<span class="base-label">Base URL</span>
				<code class="base-value">https://loooom.xyz/api</code>
			</div>
		</div>

		<!-- Endpoint 1: Get a skill -->
		<div class="endpoint-card">
			<div class="endpoint-header">
				<span class="method get">GET</span>
				<code class="endpoint-path">/api/skills/:author/:skill</code>
			</div>
			<p class="endpoint-desc">Returns skill metadata, author info, files, and plugin manifest.</p>

			<div class="example-block">
				<div class="example-header">
					<span class="example-label">Example</span>
					<button class="copy-btn" onclick={() => copyText('curl1', 'curl https://loooom.xyz/api/skills/mager/beginner-japanese')}>
						{copiedStates['curl1'] ? '✓ Copied' : 'Copy'}
					</button>
				</div>
				<pre class="code-block"><code>curl https://loooom.xyz/api/skills/mager/beginner-japanese</code></pre>
			</div>

			<div class="example-block">
				<div class="example-header">
					<span class="example-label">Response</span>
					<button class="copy-btn" onclick={() => copyText('resp1', `{\n  "skill": {\n    "name": "beginner-japanese",\n    "title": "Learn Beginner Japanese",\n    "description": "...",\n    "category": "Education",\n    "version": "1.1.0",\n    "contentHash": "sha256:...",\n    "author": {\n      "username": "mager",\n      "displayName": "Mager",\n      "verified": true\n    },\n    "files": [\n      { "name": "SKILL.md", "content": "..." }\n    ]\n  },\n  "plugin": {\n    "name": "mager-beginner-japanese",\n    "description": "...",\n    "version": "1.1.0",\n    "author": { "name": "Mager" },\n    "skills": {\n      "beginner-japanese": {\n        "files": ["SKILL.md"]\n      }\n    }\n  }\n}`)}>
						{copiedStates['resp1'] ? '✓ Copied' : 'Copy'}
					</button>
				</div>
				<pre class="code-block json"><code>{`{
  "skill": {
    "name": "beginner-japanese",
    "title": "Learn Beginner Japanese",
    "description": "...",
    "category": "Education",
    "version": "1.1.0",
    "contentHash": "sha256:...",
    "author": {
      "username": "mager",
      "displayName": "Mager",
      "verified": true
    },
    "files": [
      { "name": "SKILL.md", "content": "..." }
    ]
  },
  "plugin": {
    "name": "mager-beginner-japanese",
    "description": "...",
    "version": "1.1.0",
    "author": { "name": "Mager" },
    "skills": {
      "beginner-japanese": {
        "files": ["SKILL.md"]
      }
    }
  }
}`}</code></pre>
			</div>
		</div>

		<!-- Endpoint 2: Get raw SKILL.md -->
		<div class="endpoint-card">
			<div class="endpoint-header">
				<span class="method get">GET</span>
				<code class="endpoint-path">/api/skills/:author/:skill/raw</code>
			</div>
			<p class="endpoint-desc">Returns the raw SKILL.md content as <code class="inline-code">text/markdown</code>.</p>

			<div class="example-block">
				<div class="example-header">
					<span class="example-label">Example</span>
					<button class="copy-btn" onclick={() => copyText('curl2', 'curl https://loooom.xyz/api/skills/mager/beginner-japanese/raw -o SKILL.md')}>
						{copiedStates['curl2'] ? '✓ Copied' : 'Copy'}
					</button>
				</div>
				<pre class="code-block"><code>curl https://loooom.xyz/api/skills/mager/beginner-japanese/raw -o SKILL.md</code></pre>
			</div>

			<div class="param-note">
				<span class="param-name">?download=true</span>
				<span class="param-desc">Adds <code class="inline-code">Content-Disposition: attachment</code> header.</span>
			</div>
		</div>

		<!-- CLI -->
		<div class="endpoint-card cli-card">
			<div class="endpoint-header">
				<span class="method cli">CLI</span>
				<code class="endpoint-path">npx loooom</code>
			</div>
			<p class="endpoint-desc">Install skills directly into your project. Creates <code class="inline-code">skills/beginner-japanese/SKILL.md</code> in your working directory.</p>

			<div class="example-block">
				<div class="example-header">
					<span class="example-label">Usage</span>
					<button class="copy-btn" onclick={() => copyText('cli', 'npx loooom add mager/beginner-japanese')}>
						{copiedStates['cli'] ? '✓ Copied' : 'Copy'}
					</button>
				</div>
				<pre class="code-block"><code>npx loooom add mager/beginner-japanese</code></pre>
			</div>

			<div class="param-note">
				<span class="param-desc">Requires Node.js 18+</span>
			</div>
		</div>
	</div>
</section>

<style>
	.ambient { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
	.orb { position: absolute; border-radius: 50%; filter: blur(140px); opacity: 0.06; }
	:global(html[data-theme="dark"]) .orb { opacity: 0.12; }
	.orb-1 { width: 500px; height: 500px; background: var(--accent); top: -100px; right: -100px; animation: drift 25s ease-in-out infinite; }
	.orb-2 { width: 400px; height: 400px; background: var(--yarn-pink); bottom: 10%; left: -100px; animation: drift 30s ease-in-out infinite reverse; }
	@keyframes drift { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, -20px); } }

	nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; backdrop-filter: blur(20px); background: var(--nav-bg); border-bottom: 1px solid var(--border); }
	.nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 2rem; height: 64px; display: flex; align-items: center; justify-content: space-between; }
	.logo { display: flex; align-items: center; gap: 0.5rem; color: var(--text-primary); }
	.logo:hover { color: var(--text-primary); }
	.logo-text { font-family: var(--font-handwriting); font-size: 1.3rem; font-weight: 100; letter-spacing: 0.02em; }
	.nav-links { display: flex; align-items: center; gap: 1.5rem; }
	.nav-links a { color: var(--text-secondary); font-size: 0.9rem; font-weight: 500; transition: color 0.2s; }
	.nav-links a:hover, .nav-links a.active { color: var(--text-primary); }
	.btn-nav { background: var(--bg-card); color: var(--text-primary) !important; border: 1px solid var(--border); padding: 0.5rem 1.25rem; border-radius: var(--radius-sm); font-size: 0.875rem; font-weight: 500; transition: all 0.2s; }
	.btn-nav:hover { border-color: var(--text-secondary); }

	.handwriting { font-family: var(--font-handwriting); font-weight: 100; text-shadow: 0 0.5px 0 rgba(0,0,0,0.06); }
	:global(html[data-theme="dark"]) .handwriting { text-shadow: 0 0.5px 0 rgba(255,255,255,0.08); }

	.docs-page { position: relative; z-index: 1; min-height: 100vh; padding: 7rem 2rem 4rem; }
	.docs-inner { max-width: 800px; margin: 0 auto; }

	.docs-header { margin-bottom: 3rem; }
	.docs-header h1 { font-size: clamp(2.5rem, 5vw, 3.5rem); margin-bottom: 0.75rem; color: var(--text-primary); }
	.docs-subtitle { font-size: 1.15rem; color: var(--text-secondary); line-height: 1.45; margin-bottom: 1.5rem; }

	.base-url { display: inline-flex; align-items: center; gap: 0.75rem; padding: 0.6rem 1rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-sm); }
	.base-label { font-family: var(--font-mono); font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: var(--text-muted); }
	.base-value { font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-primary); }

	.endpoint-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 2rem; margin-bottom: 1.5rem; box-shadow: var(--card-shadow); transition: box-shadow 0.25s; }
	.endpoint-card:hover { box-shadow: var(--card-shadow-hover); }
	.endpoint-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
	.method { font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 0.3rem 0.7rem; border-radius: 6px; }
	.method.get { background: rgba(39, 174, 96, 0.15); color: var(--yarn-green); }
	.method.cli { background: rgba(196, 69, 105, 0.15); color: var(--accent-rose); }
	.endpoint-path { font-family: var(--font-mono); font-size: 1rem; color: var(--text-primary); font-weight: 500; }
	.endpoint-desc { font-size: 1rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1.5rem; }
	.inline-code { font-family: var(--font-mono); font-size: 0.85em; background: var(--bg-secondary); padding: 0.15rem 0.4rem; border-radius: 4px; color: var(--text-primary); }

	.example-block { margin-bottom: 1.25rem; }
	.example-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
	.example-label { font-family: var(--font-mono); font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: var(--text-muted); }
	.copy-btn { background: none; border: 1px solid var(--border); color: var(--text-muted); font-family: var(--font-mono); font-size: 0.7rem; padding: 0.25rem 0.75rem; border-radius: var(--radius-sm); cursor: pointer; transition: all 0.2s; }
	.copy-btn:hover { border-color: var(--text-secondary); color: var(--text-primary); }

	.code-block { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 1.25rem; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.6; color: var(--text-secondary); overflow-x: auto; margin: 0; white-space: pre-wrap; word-wrap: break-word; }
	:global(html[data-theme="dark"]) .code-block { background: #0e0e16; border-color: var(--border); }
	.code-block code { font-family: inherit; }
	.code-block.json { font-size: 0.8rem; }

	.param-note { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; background: var(--bg-secondary); border-radius: var(--radius-sm); margin-top: 1rem; }
	.param-name { font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-rose); font-weight: 600; white-space: nowrap; }
	.param-desc { font-size: 0.85rem; color: var(--text-secondary); }

	@media (max-width: 768px) {
		.docs-page { padding: 6rem 1rem 3rem; }
		.endpoint-card { padding: 1.5rem; }
		.endpoint-header { flex-wrap: wrap; }
		.endpoint-path { font-size: 0.85rem; }
		.nav-links a:not(.btn-nav):not(:global(.theme-toggle)) { display: none; }
	}
</style>
