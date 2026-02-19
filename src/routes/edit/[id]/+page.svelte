<script lang="ts">
	import { enhance } from '$app/forms';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import YarnLogo from '$lib/components/YarnLogo.svelte';

	let { data, form } = $props();

	let title = $state(data.skill.title);
	let name = $state(data.skill.name);
	let category = $state(data.skill.category ?? '');
	let description = $state(data.skill.description ?? '');
	let skillContent = $state(data.skillContent);
	let additionalFiles = $state<{ name: string; content: string }[]>(data.additionalFiles);
	let publishing = $state(false);

	const categories = [
		'Writing', 'Music', 'Cooking', 'Engineering', 'Art',
		'Research', 'Design', 'Education', 'Health', 'Business'
	];

	function addFile() {
		additionalFiles = [...additionalFiles, { name: '', content: '' }];
	}

	function removeFile(i: number) {
		additionalFiles = additionalFiles.filter((_, idx) => idx !== i);
	}

	function renderMarkdown(md: string): string {
		let html = md
			.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
			.replace(/`([^`]+)`/g, '<code>$1</code>')
			.replace(/^#### (.+)$/gm, '<h4>$1</h4>')
			.replace(/^### (.+)$/gm, '<h3>$1</h3>')
			.replace(/^## (.+)$/gm, '<h2>$1</h2>')
			.replace(/^# (.+)$/gm, '<h1>$1</h1>')
			.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
			.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
			.replace(/\*(.+?)\*/g, '<em>$1</em>')
			.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
			.replace(/^- (.+)$/gm, '<li>$1</li>')
			.replace(/^(?!<[hluop]|<li|<pre|<code)(.+)$/gm, '<p>$1</p>')
			.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
		return html;
	}
</script>

<svelte:head>
	<title>Edit {data.skill.title} — Loooom</title>
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
		<div class="nav-right">
			<ThemeToggle />
			{#if data.user}
				<a href="/u/{data.user.username}" class="btn-nav">{data.user.displayName}</a>
			{:else}
				<a href="/login" class="btn-nav">Sign In</a>
			{/if}
		</div>
	</div>
</nav>

<section class="create-page">
	<div class="create-inner">
		<h1 class="handwriting">Edit your skill.</h1>
		<p class="create-sub">Update your skill — a new version will be created automatically. Currently v{data.skill.version}.</p>

		{#if form?.error}
			<div class="error-msg">{form.error}</div>
		{/if}

		<form method="POST" use:enhance={() => {
			publishing = true;
			return async ({ update }) => {
				publishing = false;
				await update();
			};
		}}>
			<div class="form-grid">
				<div class="field">
					<label for="title">Title</label>
					<input id="title" type="text" name="title" bind:value={title} placeholder="e.g. Sourdough Bread From Scratch" required />
				</div>
				<div class="field">
					<label for="name">Slug</label>
					<input id="name" type="text" name="name" bind:value={name} placeholder="sourdough-bread-from-scratch" required />
					<span class="field-hint">This will be the skill's URL identifier</span>
				</div>
				<div class="field">
					<label for="category">Category</label>
					<select id="category" name="category" bind:value={category}>
						<option value="">Choose a category...</option>
						{#each categories as cat}
							<option value={cat}>{cat}</option>
						{/each}
					</select>
				</div>
				<div class="field">
					<label for="description">Short Description</label>
					<input id="description" type="text" name="description" bind:value={description} placeholder="A one-liner about what this skill teaches" maxlength="200" />
				</div>
			</div>

			<div class="editor-section">
				<label>SKILL.md</label>
				<div class="editor-container">
					<textarea name="skillContent" class="md-editor" bind:value={skillContent} placeholder="Write your skill content in markdown..." spellcheck="true"></textarea>
					<div class="md-preview">
						{@html renderMarkdown(skillContent)}
					</div>
				</div>
			</div>

			<div class="additional-files">
				<div class="files-header">
					<label>Additional Files</label>
					<button type="button" class="btn-add-file" onclick={addFile}>+ Add File</button>
				</div>
				{#each additionalFiles as file, i}
					<div class="extra-file">
						<div class="extra-file-header">
							<input type="text" bind:value={additionalFiles[i].name} placeholder="filename.py" class="file-name-input" />
							<button type="button" class="btn-remove-file" onclick={() => removeFile(i)}>×</button>
						</div>
						<textarea bind:value={additionalFiles[i].content} placeholder="File contents..." class="file-content-input"></textarea>
					</div>
				{/each}
			</div>

			<input type="hidden" name="additionalFiles" value={JSON.stringify(additionalFiles)} />

			<div class="publish-bar">
				<button type="submit" class="btn-publish" disabled={publishing || !title.trim()}>
					{#if publishing}
						Saving...
					{:else}
						Save Changes <span class="btn-arrow">→</span>
					{/if}
				</button>
				<span class="publish-note">This will create version v{(() => { const p = data.skill.version.split('.').map(Number); return `${p[0]}.${p[1]}.${(p[2]??0)+1}`; })()}</span>
			</div>
		</form>
	</div>
</section>

<style>
	.ambient { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
	.orb { position: absolute; border-radius: 50%; filter: blur(140px); opacity: 0.06; }
	:global(html[data-theme="dark"]) .orb { opacity: 0.12; }
	.orb-1 { width: 500px; height: 500px; background: var(--accent); top: -100px; left: -100px; animation: drift 25s ease-in-out infinite; }
	.orb-2 { width: 400px; height: 400px; background: var(--yarn-pink); bottom: 10%; right: -100px; animation: drift 30s ease-in-out infinite reverse; }
	@keyframes drift { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, -20px); } }

	nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; backdrop-filter: blur(20px); background: var(--nav-bg); border-bottom: 1px solid var(--border); }
	.nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 2rem; height: 64px; display: flex; align-items: center; justify-content: space-between; }
	.logo { display: flex; align-items: center; gap: 0.5rem; color: var(--text-primary); }
	.logo:hover { color: var(--text-primary); }
	.logo-text { font-family: var(--font-handwriting); font-size: 1.3rem; font-weight: 100; letter-spacing: 0.02em; }
	.nav-right { display: flex; align-items: center; gap: 1rem; }
	.btn-nav { background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border); padding: 0.5rem 1.25rem; border-radius: var(--radius-sm); font-size: 0.875rem; font-weight: 500; transition: all 0.2s; text-decoration: none; }
	.btn-nav:hover { border-color: var(--accent); }

	.handwriting { font-family: var(--font-handwriting); font-weight: 100; text-shadow: 0 0.5px 0 rgba(0,0,0,0.06); }
	:global(html[data-theme="dark"]) .handwriting { text-shadow: 0 0.5px 0 rgba(255,255,255,0.08); }

	.create-page { position: relative; z-index: 1; min-height: 100vh; padding: 7rem 2rem 4rem; }
	.create-inner { max-width: 960px; margin: 0 auto; }
	.create-inner h1 { font-size: clamp(2rem, 4vw, 3rem); margin-bottom: 0.5rem; color: var(--text-primary); }
	.create-sub { color: var(--text-secondary); font-size: 1.05rem; margin-bottom: 2.5rem; }

	.error-msg { padding: 0.875rem 1.25rem; background: rgba(232,67,147,0.1); border: 1px solid rgba(232,67,147,0.3); border-radius: var(--radius-md); color: var(--yarn-pink); font-weight: 500; margin-bottom: 1.5rem; }

	.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 2rem; }
	.field { display: flex; flex-direction: column; gap: 0.4rem; }
	.field label { font-family: var(--font-handwriting); font-size: 1.1rem; color: var(--text-primary); font-weight: 100; }
	.field input, .field select { padding: 0.75rem 1rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); color: var(--text-primary); font-family: var(--font-display); font-size: 0.95rem; outline: none; transition: border-color 0.2s; }
	.field input:focus, .field select:focus { border-color: var(--accent); }
	.field input::placeholder { color: var(--text-muted); }
	.field select { cursor: pointer; }
	.field-hint { font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono); }

	.editor-section { margin-bottom: 2rem; }
	.editor-section > label { font-family: var(--font-handwriting); font-size: 1.1rem; color: var(--text-primary); font-weight: 100; display: block; margin-bottom: 0.5rem; }
	.editor-container { display: grid; grid-template-columns: 1fr 1fr; gap: 0; border: 1px solid var(--border); border-radius: var(--radius-md); overflow: hidden; min-height: 400px; background: var(--bg-card); }
	.md-editor { padding: 1.25rem; background: transparent; border: none; border-right: 1px solid var(--border); color: var(--text-primary); font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.6; resize: vertical; outline: none; min-height: 400px; }
	.md-editor::placeholder { color: var(--text-muted); }
	.md-preview { padding: 1.25rem; overflow-y: auto; font-family: var(--font-display); font-size: 0.95rem; line-height: 1.5; color: var(--text-secondary); }
	.md-preview :global(h1) { font-family: var(--font-handwriting); font-size: 1.6rem; font-weight: 100; color: var(--text-primary); margin: 0 0 0.75rem; }
	.md-preview :global(h2) { font-family: var(--font-handwriting); font-size: 1.3rem; font-weight: 100; color: var(--text-primary); margin: 1.25rem 0 0.5rem; }
	.md-preview :global(h3) { font-family: var(--font-handwriting); font-size: 1.1rem; font-weight: 100; color: var(--text-primary); margin: 1rem 0 0.4rem; }
	.md-preview :global(p) { margin: 0 0 0.75rem; }
	.md-preview :global(strong) { color: var(--text-primary); font-weight: 600; }
	.md-preview :global(code) { font-family: var(--font-mono); font-size: 0.85em; background: rgba(108,92,231,0.08); padding: 0.15em 0.4em; border-radius: 3px; }
	.md-preview :global(pre) { background: rgba(0,0,0,0.06); padding: 1rem; border-radius: var(--radius-sm); overflow-x: auto; margin: 0.75rem 0; }
	.md-preview :global(pre code) { background: none; padding: 0; }
	.md-preview :global(ul) { padding-left: 1.5rem; margin: 0 0 0.75rem; }
	.md-preview :global(li) { margin-bottom: 0.3rem; }
	.md-preview :global(a) { color: var(--accent); text-decoration: underline; }

	.additional-files { margin-bottom: 2rem; }
	.files-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; }
	.files-header label { font-family: var(--font-handwriting); font-size: 1.1rem; color: var(--text-primary); font-weight: 100; }
	.btn-add-file { padding: 0.4rem 1rem; background: var(--bg-card); border: 1px dashed var(--border); border-radius: var(--radius-sm); color: var(--text-secondary); font-family: var(--font-display); font-size: 0.85rem; cursor: pointer; transition: all 0.2s; }
	.btn-add-file:hover { border-color: var(--accent); color: var(--accent); }

	.extra-file { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); margin-bottom: 0.75rem; overflow: hidden; }
	.extra-file-header { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--border); background: rgba(108,92,231,0.03); }
	.file-name-input { flex: 1; padding: 0.4rem 0.5rem; background: transparent; border: none; color: var(--text-primary); font-family: var(--font-mono); font-size: 0.8rem; outline: none; }
	.file-name-input::placeholder { color: var(--text-muted); }
	.btn-remove-file { background: none; border: none; color: var(--text-muted); font-size: 1.2rem; cursor: pointer; padding: 0.25rem 0.5rem; }
	.btn-remove-file:hover { color: var(--yarn-pink); }
	.file-content-input { width: 100%; min-height: 120px; padding: 0.75rem; background: transparent; border: none; color: var(--text-primary); font-family: var(--font-mono); font-size: 0.82rem; line-height: 1.5; resize: vertical; outline: none; box-sizing: border-box; }

	.publish-bar { display: flex; align-items: center; gap: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border); }
	.btn-publish { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.875rem 2.5rem; background: var(--accent); color: white; border: none; border-radius: var(--radius-md); font-family: var(--font-display); font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.25s; }
	.btn-publish:hover:not(:disabled) { background: var(--accent-bright); transform: translateY(-1px); box-shadow: 0 8px 30px rgba(108,92,231,0.3); }
	.btn-publish:disabled { opacity: 0.5; cursor: not-allowed; }
	.btn-publish .btn-arrow { transition: transform 0.2s; }
	.btn-publish:hover:not(:disabled) .btn-arrow { transform: translateX(3px); }
	.publish-note { font-family: var(--font-sketch, var(--font-handwriting)); font-size: 0.9rem; color: var(--text-muted); }

	@media (max-width: 768px) {
		.form-grid { grid-template-columns: 1fr; }
		.editor-container { grid-template-columns: 1fr; }
		.md-editor { border-right: none; border-bottom: 1px solid var(--border); min-height: 250px; }
		.md-preview { min-height: 200px; }
		.publish-bar { flex-direction: column; align-items: stretch; gap: 0.75rem; }
		.publish-note { text-align: center; }
	}
</style>
