<script lang="ts">
	import { enhance } from '$app/forms';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import YarnLogo from '$lib/components/YarnLogo.svelte';
	import { validateSkill, formatValidation, type ValidationResult } from '$lib/skill-validator';

	let { data, form } = $props();

	const DRAFT_KEY = 'loooom-skill-draft';

	const DEFAULT_TEMPLATE = `---
name: my-skill
description: One sentence describing what this skill teaches Claude to do
author: ${data.user?.username ?? 'your-handle'}
version: 1.0.0
tags: [example, tag]
---

# Skill Name

One sentence: what does this skill teach an AI to do?

## When to use this skill

- Situation one
- Situation two
- Situation three

## Agent Behavior

When this skill is active, Claude should:

- Do this specific thing
- Adopt this tone or approach
- Follow these guidelines

## Examples

### Example 1
**User:** Input here
**Claude:** Expected response

## Notes

Any caveats, edge cases, or important considerations.
`;

	const CATEGORIES = [
		'Writing', 'Music', 'Cooking', 'Engineering', 'Art',
		'Research', 'Design', 'Education', 'Health', 'Business',
		'Life', 'Productivity', 'Coding', 'Languages'
	];

	function loadDraft() {
		if (typeof window === 'undefined') return null;
		try {
			const raw = localStorage.getItem(DRAFT_KEY);
			return raw ? JSON.parse(raw) : null;
		} catch { return null; }
	}

	function saveDraft() {
		if (typeof window === 'undefined') return;
		try {
			localStorage.setItem(DRAFT_KEY, JSON.stringify({
				title, name, category, description, skillContent
			}));
		} catch {}
	}

	function clearDraft() {
		if (typeof window === 'undefined') return;
		try { localStorage.removeItem(DRAFT_KEY); } catch {}
	}

	// Init state from draft or defaults
	const draft = typeof window !== 'undefined' ? loadDraft() : null;
	let title = $state(draft?.title ?? '');
	let name = $state(draft?.name ?? '');
	let nameEdited = $state(!!draft?.name);
	let category = $state(draft?.category ?? '');
	let description = $state(draft?.description ?? '');
	let skillContent = $state(draft?.skillContent ?? DEFAULT_TEMPLATE);
	let additionalFiles = $state<{ name: string; content: string }[]>([]);
	let publishing = $state(false);
	let activeTab = $state<'write' | 'preview' | 'validate'>('write');
	let editorEl = $state<HTMLTextAreaElement | null>(null);

	// Live validation
	let validation = $derived<ValidationResult>(validateSkill(skillContent));

	// Word/char counts
	const wordCount = $derived(skillContent.trim() ? skillContent.trim().split(/\s+/).length : 0);
	const charCount = $derived(skillContent.length);

	function slugify(text: string): string {
		return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
	}

	function onTitleInput() {
		if (!nameEdited) name = slugify(title);
		saveDraft();
	}

	function addFile() {
		additionalFiles = [...additionalFiles, { name: '', content: '' }];
	}
	function removeFile(i: number) {
		additionalFiles = additionalFiles.filter((_, idx) => idx !== i);
	}

	// Editor toolbar actions
	function wrap(before: string, after: string, placeholder = 'text') {
		if (!editorEl) return;
		const start = editorEl.selectionStart;
		const end = editorEl.selectionEnd;
		const sel = skillContent.slice(start, end) || placeholder;
		skillContent = skillContent.slice(0, start) + before + sel + after + skillContent.slice(end);
		saveDraft();
		setTimeout(() => {
			if (!editorEl) return;
			editorEl.focus();
			editorEl.setSelectionRange(start + before.length, start + before.length + sel.length);
		}, 0);
	}

	function insertAtLineStart(prefix: string) {
		if (!editorEl) return;
		const start = editorEl.selectionStart;
		const lineStart = skillContent.lastIndexOf('\n', start - 1) + 1;
		skillContent = skillContent.slice(0, lineStart) + prefix + skillContent.slice(lineStart);
		saveDraft();
		setTimeout(() => { if (editorEl) editorEl.focus(); }, 0);
	}

	function handleKeydown(e: KeyboardEvent) {
		const meta = e.metaKey || e.ctrlKey;
		if (meta && e.key === 'b') { e.preventDefault(); wrap('**', '**', 'bold text'); }
		if (meta && e.key === 'i') { e.preventDefault(); wrap('*', '*', 'italic text'); }
		if (meta && e.key === 'k') { e.preventDefault(); wrap('[', '](url)', 'link text'); }
		if (e.key === 'Tab') {
			e.preventDefault();
			const start = editorEl!.selectionStart;
			const end = editorEl!.selectionEnd;
			skillContent = skillContent.slice(0, start) + '  ' + skillContent.slice(end);
			setTimeout(() => { if (editorEl) editorEl.setSelectionRange(start + 2, start + 2); }, 0);
		}
	}

	// Markdown renderer
	function renderMarkdown(md: string): string {
		return md
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
			.replace(/(<li>[\s\S]*?(?=<\/li>)<\/li>\n?)+/g, '<ul>$&</ul>');
	}
</script>

<svelte:head>
	<title>Publish a Skill — Loooom</title>
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

	<!-- SUCCESS STATE -->
	{#if form?.success}
		<div class="success-state">
			<div class="success-confetti" aria-hidden="true">🎉</div>
			<h1 class="handwriting">It's live!</h1>
			<p class="success-sub">Your skill is published and ready to be used by any AI.</p>

			<div class="install-showcase">
				<div class="install-label">Claude Code — add the Loooom marketplace first</div>
				<div class="install-command">
					<code>/plugin marketplace add mager/loooom</code>
					<button class="copy-btn" onclick={() => navigator.clipboard.writeText('/plugin marketplace add mager/loooom')}>Copy</button>
				</div>
				<div class="install-label install-label-secondary">Then use your skill</div>
				<div class="install-command">
					<code>/skill use {form.skillName}</code>
					<button class="copy-btn" onclick={() => {
						navigator.clipboard.writeText(`/skill use ${form.skillName}`);
					}}>Copy</button>
				</div>
				<div class="install-label install-label-secondary">Or install directly with npx</div>
				<div class="install-command install-command-alt">
					<code>npx loooom add {form.username}/{form.skillName}</code>
					<button class="copy-btn" onclick={() => {
						navigator.clipboard.writeText(`npx loooom add ${form.username}/${form.skillName}`);
					}}>Copy</button>
				</div>
			</div>

			<div class="success-actions">
				<a href="/u/{form.username}" class="btn-view">View your profile →</a>
				<a href="/create" class="btn-another" onclick={clearDraft}>Publish another</a>
			</div>
		</div>

	<!-- AUTH GATE -->
	{:else if !data.user}
		<div class="auth-gate">
			<div class="auth-icon">✍️</div>
			<h1 class="handwriting">Write what you know.</h1>
			<p>Skills are markdown files that teach AI agents new behaviors. Sign in to publish yours — it's free.</p>
			<a href="/login" class="btn-primary">Sign in to publish →</a>
			<p class="auth-hint">No account? <a href="/startweaving">Create one</a> — takes 30 seconds.</p>
		</div>

	<!-- CREATE FORM -->
	{:else}
		<div class="create-inner">
			<div class="create-header">
				<h1 class="handwriting">Write what you know.</h1>
				<p class="create-sub">Share your expertise as a skill. Plain markdown. Free forever.</p>
			</div>

			{#if form?.error}
				<div class="error-msg">{form.error}</div>
			{/if}

			<form method="POST" use:enhance={() => {
				publishing = true;
				return async ({ update }) => {
					publishing = false;
					clearDraft();
					await update();
				};
			}}>

				<!-- META FIELDS -->
				<div class="form-grid">
					<div class="field field-title">
						<label for="title">Title</label>
						<input
							id="title"
							type="text"
							name="title"
							bind:value={title}
							oninput={onTitleInput}
							placeholder="e.g. Sourdough Bread From Scratch"
							required
						/>
					</div>

					<div class="field field-slug">
						<label for="name">Slug <span class="label-hint">auto-generated</span></label>
						<input
							id="name"
							type="text"
							name="name"
							bind:value={name}
							oninput={() => { nameEdited = true; saveDraft(); }}
							placeholder="sourdough-bread-from-scratch"
							required
						/>
					</div>

					<div class="field field-desc">
						<label for="description">Short description</label>
						<input
							id="description"
							type="text"
							name="description"
							bind:value={description}
							oninput={saveDraft}
							placeholder="One sentence about what this teaches an AI to do"
							maxlength="200"
						/>
					</div>

					<div class="field field-cat">
						<label>Category</label>
						<div class="category-chips">
							{#each CATEGORIES as cat}
								<button
									type="button"
									class="cat-chip"
									class:selected={category === cat}
									onclick={() => { category = cat; saveDraft(); }}
								>{cat}</button>
							{/each}
						</div>
						<input type="hidden" name="category" value={category} />
					</div>
				</div>

				<!-- EDITOR -->
				<div class="editor-section">
					<div class="editor-header">
						<label class="editor-label">SKILL.md</label>
						<div class="editor-tabs">
							<button type="button" class="etab" class:active={activeTab === 'write'} onclick={() => activeTab = 'write'}>Write</button>
							<button type="button" class="etab" class:active={activeTab === 'preview'} onclick={() => activeTab = 'preview'}>Preview</button>
							<button type="button" class="etab" class:active={activeTab === 'validate'} class:has-errors={validation.errors.length > 0} class:has-warnings={validation.warnings.length > 0 && validation.errors.length === 0} onclick={() => activeTab = 'validate'}>
								Validate
								{#if validation.errors.length > 0}
									<span class="badge error">{validation.errors.length}</span>
								{:else if validation.warnings.length > 0}
									<span class="badge warn">{validation.warnings.length}</span>
								{:else}
									<span class="badge ok">✓</span>
								{/if}
							</button>
						</div>
					</div>

					{#if activeTab === 'write'}
						<!-- Toolbar -->
						<div class="toolbar">
							<button type="button" class="tool-btn" title="Bold (⌘B)" onclick={() => wrap('**', '**', 'bold')}>
								<strong>B</strong>
							</button>
							<button type="button" class="tool-btn" title="Italic (⌘I)" onclick={() => wrap('*', '*', 'italic')}>
								<em>I</em>
							</button>
							<div class="tool-sep"></div>
							<button type="button" class="tool-btn" title="H1" onclick={() => insertAtLineStart('# ')}>H1</button>
							<button type="button" class="tool-btn" title="H2" onclick={() => insertAtLineStart('## ')}>H2</button>
							<button type="button" class="tool-btn" title="H3" onclick={() => insertAtLineStart('### ')}>H3</button>
							<div class="tool-sep"></div>
							<button type="button" class="tool-btn" title="Inline code" onclick={() => wrap('`', '`', 'code')}>
								<code>&lt;/&gt;</code>
							</button>
							<button type="button" class="tool-btn" title="Code block" onclick={() => wrap('```\n', '\n```', 'code')}>
								{ '```' }
							</button>
							<div class="tool-sep"></div>
							<button type="button" class="tool-btn" title="Link (⌘K)" onclick={() => wrap('[', '](url)', 'link')}>🔗</button>
							<button type="button" class="tool-btn" title="Bullet list" onclick={() => insertAtLineStart('- ')}>• List</button>
							<div class="tool-end">
								<span class="char-count">{wordCount}w · {charCount}c</span>
							</div>
						</div>
						<textarea
							name="skillContent"
							class="md-editor"
							bind:value={skillContent}
							bind:this={editorEl}
							oninput={saveDraft}
							onkeydown={handleKeydown}
							spellcheck="true"
							placeholder="Write your skill in markdown..."
						></textarea>
					{:else if activeTab === 'preview'}
						<div class="md-preview">
							{@html renderMarkdown(skillContent)}
						</div>
					{:else}
						<div class="validation-panel">
							{#if validation.errors.length === 0 && validation.warnings.length === 0 && validation.suggestions.length === 0}
								<div class="validation-success">
									<div class="success-icon">✅</div>
									<h3>All checks passed!</h3>
									<p>Your SKILL.md follows the Loooom v1.0 specification.</p>
								</div>
							{:else}
								{#if validation.errors.length > 0}
									<div class="validation-section errors">
										<h4>❌ Errors</h4>
										<ul>
											{#each validation.errors as error}
												<li><strong>{error.field || 'General'}:</strong> {error.message}</li>
											{/each}
										</ul>
									</div>
								{/if}
								{#if validation.warnings.length > 0}
									<div class="validation-section warnings">
										<h4>⚠️ Warnings</h4>
										<ul>
											{#each validation.warnings as warning}
												<li>{warning.message}</li>
											{/each}
										</ul>
									</div>
								{/if}
								{#if validation.suggestions.length > 0}
									<div class="validation-section suggestions">
										<h4>💡 Suggestions</h4>
										<ul>
											{#each validation.suggestions as suggestion}
												<li>{suggestion.message}</li>
											{/each}
										</ul>
									</div>
								{/if}
							{/if}
						</div>
					{/if}
				</div>

				<!-- ADDITIONAL FILES -->
				<div class="additional-files">
					<div class="files-header">
						<label>Additional Files <span class="label-hint">optional</span></label>
						<button type="button" class="btn-add-file" onclick={addFile}>+ Add file</button>
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

				<!-- PUBLISH BAR -->
				<div class="publish-bar">
					<button type="submit" class="btn-publish" disabled={publishing || !title.trim()}>
						{publishing ? 'Publishing...' : 'Publish Skill →'}
					</button>
					<span class="publish-note">Skills are always free &amp; open.</span>
					{#if draft}
						<button type="button" class="btn-clear-draft" onclick={() => { clearDraft(); title = ''; name = ''; category = ''; description = ''; skillContent = DEFAULT_TEMPLATE; }}>
							Clear draft
						</button>
					{/if}
				</div>
			</form>
		</div>
	{/if}
</section>

<style>
	.ambient {
		position: fixed; inset: 0;
		pointer-events: none; z-index: 0; overflow: hidden;
	}
	.orb { position: absolute; border-radius: 50%; filter: blur(140px); opacity: 0.05; }
	:global(html[data-theme="dark"]) .orb { opacity: 0.1; }
	.orb-1 { width: 500px; height: 500px; background: var(--accent); top: -100px; left: -100px; animation: drift 25s ease-in-out infinite; }
	.orb-2 { width: 400px; height: 400px; background: var(--ocean); bottom: 10%; right: -100px; animation: drift 30s ease-in-out infinite reverse; }
	@keyframes drift { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, -20px); } }

	nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; backdrop-filter: blur(20px); background: var(--nav-bg); border-bottom: 1px solid var(--border); }
	.nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 2rem; height: 64px; display: flex; align-items: center; justify-content: space-between; }
	.logo { display: flex; align-items: center; gap: 0.5rem; color: var(--text-primary); text-decoration: none; }
	.logo-text { font-family: var(--font-handwriting); font-size: 1.3rem; font-weight: 100; }
	.nav-right { display: flex; align-items: center; gap: 1rem; }
	.btn-nav { background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border); padding: 0.5rem 1.25rem; border-radius: var(--radius-sm); font-size: 0.875rem; font-weight: 500; transition: all 0.2s; text-decoration: none; }
	.btn-nav:hover { border-color: var(--text-secondary); }

	.handwriting { font-family: var(--font-handwriting); font-weight: 100; text-shadow: 0 0.5px 0 rgba(0,0,0,0.06); }

	.create-page { position: relative; z-index: 1; min-height: 100vh; padding: 7rem 2rem 4rem; }

	/* ===== SUCCESS ===== */
	.success-state {
		max-width: 520px;
		margin: 3rem auto;
		text-align: center;
	}
	.success-confetti {
		font-size: 4rem;
		margin-bottom: 1rem;
		animation: bounce 0.6s ease-out;
	}
	@keyframes bounce {
		0% { transform: scale(0.5); opacity: 0; }
		60% { transform: scale(1.2); }
		100% { transform: scale(1); opacity: 1; }
	}
	.success-state h1 {
		font-size: clamp(2rem, 5vw, 3rem);
		color: var(--text-primary);
		margin-bottom: 0.75rem;
	}
	.success-sub { color: var(--text-secondary); font-size: 1rem; margin-bottom: 2rem; }
	.install-showcase {
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 12px;
		overflow: hidden;
		margin-bottom: 2rem;
	}
	.install-label {
		padding: 0.6rem 1.1rem;
		background: var(--bg-secondary);
		border-bottom: 1px solid var(--border);
		font-family: var(--font-mono);
		font-size: 0.68rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
		text-align: left;
	}
	.install-label-secondary {
		border-top: 1px solid var(--border);
		color: var(--text-muted);
		opacity: 0.7;
	}
	.install-command {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.9rem 1.1rem;
		background: #0d0d14;
	}
	.install-command code {
		font-family: var(--font-mono);
		font-size: 0.88rem;
		color: #a5b4fc;
		background: none;
	}
	.install-command-alt code {
		color: #6ee7b7;
	}
	.copy-btn {
		background: var(--accent);
		color: white;
		border: none;
		padding: 0.35rem 0.85rem;
		border-radius: 6px;
		font-size: 0.78rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		white-space: nowrap;
	}
	:global(html[data-theme="dark"]) .copy-btn { color: var(--bg-primary); }
	.copy-btn:hover { opacity: 0.85; }
	.success-actions { display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap; }
	.btn-view {
		padding: 0.8rem 1.75rem;
		background: var(--accent);
		color: white;
		border-radius: 999px;
		font-weight: 700;
		font-size: 0.9rem;
		text-decoration: none;
		transition: opacity 0.2s;
	}
	.btn-view:hover { opacity: 0.85; }
	:global(html[data-theme="dark"]) .btn-view { color: var(--bg-primary); }
	.btn-another {
		font-size: 0.88rem;
		color: var(--text-muted);
		text-decoration: none;
		transition: color 0.2s;
	}
	.btn-another:hover { color: var(--text-primary); }

	/* ===== AUTH GATE ===== */
	.auth-gate {
		max-width: 440px;
		margin: 4rem auto;
		text-align: center;
	}
	.auth-icon { font-size: 3.5rem; margin-bottom: 1rem; }
	.auth-gate h1 { font-size: clamp(2rem, 5vw, 3rem); margin-bottom: 0.75rem; color: var(--text-primary); }
	.auth-gate p { color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 2rem; line-height: 1.6; }
	.btn-primary {
		display: inline-flex; align-items: center; gap: 0.5rem;
		padding: 0.9rem 2rem; background: var(--accent); color: white;
		border: none; border-radius: 999px; font-size: 1rem; font-weight: 700;
		cursor: pointer; transition: all 0.2s; text-decoration: none;
	}
	.btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
	:global(html[data-theme="dark"]) .btn-primary { color: var(--bg-primary); }
	.auth-hint { font-size: 0.82rem; color: var(--text-muted); margin-top: 1.25rem; }
	.auth-hint a { color: var(--ocean); text-decoration: none; }
	.auth-hint a:hover { text-decoration: underline; }

	/* ===== CREATE FORM ===== */
	.create-inner { max-width: 1000px; margin: 0 auto; }
	.create-header { margin-bottom: 2.5rem; }
	.create-header h1 { font-size: clamp(2rem, 4vw, 3rem); color: var(--text-primary); margin-bottom: 0.4rem; }
	.create-sub { color: var(--text-secondary); font-size: 0.95rem; }

	.error-msg {
		padding: 0.875rem 1.25rem;
		background: rgba(239, 68, 68, 0.08);
		border: 1px solid rgba(239, 68, 68, 0.3);
		border-radius: 10px;
		color: #ef4444;
		font-weight: 500;
		margin-bottom: 1.5rem;
	}

	/* META GRID */
	.form-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.25rem;
		margin-bottom: 2rem;
	}
	.field-desc { grid-column: 1 / -1; }
	.field-cat { grid-column: 1 / -1; }
	.field { display: flex; flex-direction: column; gap: 0.4rem; }
	.field label {
		font-family: var(--font-handwriting);
		font-size: 1rem;
		color: var(--text-primary);
		font-weight: 100;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.label-hint {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-muted);
	}
	.field input {
		padding: 0.7rem 1rem;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 10px;
		color: var(--text-primary);
		font-family: var(--font-display);
		font-size: 0.95rem;
		outline: none;
		transition: border-color 0.2s;
	}
	.field input:focus { border-color: var(--violet); }
	.field input::placeholder { color: var(--text-muted); }

	/* Category chips */
	.category-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.cat-chip {
		padding: 0.35rem 0.9rem;
		background: var(--bg-card);
		border: 1.5px solid var(--border);
		border-radius: 999px;
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 0.15s;
	}
	.cat-chip:hover { border-color: var(--text-secondary); color: var(--text-primary); }
	.cat-chip.selected {
		background: color-mix(in srgb, var(--violet) 12%, transparent);
		border-color: var(--violet);
		color: var(--violet);
		font-weight: 700;
	}

	/* ===== EDITOR ===== */
	.editor-section { margin-bottom: 2rem; }
	.editor-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.6rem;
	}
	.editor-label {
		font-family: var(--font-handwriting);
		font-size: 1rem;
		color: var(--text-primary);
		font-weight: 100;
	}
	.editor-tabs {
		display: flex;
		gap: 0;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 2px;
	}
	.etab {
		padding: 0.35rem 0.9rem;
		background: none;
		border: none;
		border-radius: 6px;
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--text-muted);
		cursor: pointer;
		transition: all 0.15s;
	}
	.etab.active {
		background: var(--bg-primary);
		color: var(--text-primary);
		box-shadow: 0 1px 4px rgba(0,0,0,0.08);
	}

	/* Toolbar */
	.toolbar {
		display: flex;
		align-items: center;
		gap: 2px;
		padding: 0.5rem 0.75rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-bottom: none;
		border-radius: 12px 12px 0 0;
		flex-wrap: wrap;
	}
	.tool-btn {
		padding: 0.3rem 0.6rem;
		background: none;
		border: none;
		border-radius: 5px;
		font-family: var(--font-mono);
		font-size: 0.78rem;
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 0.15s;
		min-width: 28px;
		text-align: center;
	}
	.tool-btn:hover { background: var(--bg-card); color: var(--text-primary); }
	.tool-btn code { font-size: 0.7rem; }
	.tool-sep { width: 1px; height: 18px; background: var(--border); margin: 0 4px; }
	.tool-end { margin-left: auto; }
	.char-count {
		font-family: var(--font-mono);
		font-size: 0.65rem;
		color: var(--text-muted);
	}

	.md-editor {
		width: 100%;
		min-height: 420px;
		padding: 1.25rem;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-top: none;
		border-radius: 0 0 12px 12px;
		color: var(--text-primary);
		font-family: var(--font-mono);
		font-size: 0.875rem;
		line-height: 1.65;
		resize: vertical;
		outline: none;
		transition: border-color 0.2s;
		box-sizing: border-box;
		tab-size: 2;
	}
	.md-editor:focus { border-color: var(--violet); }

	.md-preview {
		min-height: 420px;
		padding: 1.5rem;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-top: none;
		border-radius: 0 0 12px 12px;
		font-family: var(--font-display);
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--text-secondary);
	}
	.md-preview :global(h1) { font-family: var(--font-handwriting); font-size: 1.7rem; font-weight: 100; color: var(--text-primary); margin: 0 0 0.75rem; }
	.md-preview :global(h2) { font-family: var(--font-handwriting); font-size: 1.3rem; font-weight: 100; color: var(--text-primary); margin: 1.5rem 0 0.5rem; border-bottom: 1px solid var(--border); padding-bottom: 0.4rem; }
	.md-preview :global(h3) { font-family: var(--font-handwriting); font-size: 1.1rem; font-weight: 100; color: var(--text-primary); margin: 1.25rem 0 0.4rem; }
	.md-preview :global(h4) { font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin: 1rem 0 0.35rem; }
	.md-preview :global(p) { margin: 0 0 0.75rem; }
	.md-preview :global(strong) { color: var(--text-primary); font-weight: 700; }
	.md-preview :global(em) { color: var(--text-secondary); }
	.md-preview :global(code) { font-family: var(--font-mono); font-size: 0.82em; background: var(--bg-secondary); padding: 0.15em 0.45em; border-radius: 4px; color: var(--violet); }
	.md-preview :global(pre) { background: #0d0d14; border-radius: 8px; padding: 1rem 1.25rem; overflow-x: auto; margin: 1rem 0; }
	.md-preview :global(pre code) { background: none; padding: 0; color: #a5b4fc; font-size: 0.82rem; }
	.md-preview :global(ul) { padding-left: 1.5rem; margin: 0 0 0.75rem; }
	.md-preview :global(li) { margin-bottom: 0.3rem; }
	.md-preview :global(a) { color: var(--ocean); text-decoration: underline; }

	/* Additional files */
	.additional-files { margin-bottom: 2rem; }
	.files-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; }
	.files-header label { font-family: var(--font-handwriting); font-size: 1rem; color: var(--text-primary); font-weight: 100; display: flex; align-items: center; gap: 0.5rem; }
	.btn-add-file {
		padding: 0.4rem 1rem; background: var(--bg-card); border: 1.5px dashed var(--border);
		border-radius: 8px; color: var(--text-secondary); font-size: 0.83rem; cursor: pointer; transition: all 0.2s;
	}
	.btn-add-file:hover { border-color: var(--violet); color: var(--violet); }
	.extra-file { background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px; margin-bottom: 0.75rem; overflow: hidden; }
	.extra-file-header { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--border); background: var(--bg-secondary); }
	.file-name-input { flex: 1; padding: 0.4rem 0.5rem; background: transparent; border: none; color: var(--text-primary); font-family: var(--font-mono); font-size: 0.8rem; outline: none; }
	.file-name-input::placeholder { color: var(--text-muted); }
	.btn-remove-file { background: none; border: none; color: var(--text-muted); font-size: 1.2rem; cursor: pointer; padding: 0.25rem 0.5rem; transition: color 0.2s; }
	.btn-remove-file:hover { color: #ef4444; }
	.file-content-input { width: 100%; min-height: 120px; padding: 0.75rem; background: transparent; border: none; color: var(--text-primary); font-family: var(--font-mono); font-size: 0.82rem; line-height: 1.5; resize: vertical; outline: none; box-sizing: border-box; }

	/* Publish bar */
	.publish-bar { display: flex; align-items: center; gap: 1.25rem; padding-top: 1.25rem; border-top: 1px solid var(--border); flex-wrap: wrap; }
	.btn-publish {
		display: inline-flex; align-items: center; gap: 0.5rem;
		padding: 0.875rem 2.5rem; background: var(--accent); color: white;
		border: none; border-radius: 999px; font-size: 1rem; font-weight: 700;
		cursor: pointer; transition: all 0.2s;
	}
	.btn-publish:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
	:global(html[data-theme="dark"]) .btn-publish { color: var(--bg-primary); }
	.btn-publish:disabled { opacity: 0.45; cursor: not-allowed; }
	.publish-note { font-family: var(--font-handwriting); font-size: 0.9rem; color: var(--text-muted); }
	.btn-clear-draft {
		margin-left: auto;
		background: none;
		border: none;
		font-size: 0.78rem;
		color: var(--text-muted);
		cursor: pointer;
		transition: color 0.2s;
	}
	.btn-clear-draft:hover { color: #ef4444; }

	/* Validation panel */
	.validation-panel {
		min-height: 420px;
		padding: 1.5rem;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-top: none;
		border-radius: 0 0 12px 12px;
	}
	.validation-success {
		text-align: center;
		padding: 3rem 1rem;
	}
	.success-icon { font-size: 3rem; margin-bottom: 1rem; }
	.validation-success h3 {
		font-family: var(--font-handwriting);
		font-size: 1.5rem;
		font-weight: 100;
		color: var(--text-primary);
		margin-bottom: 0.5rem;
	}
	.validation-success p { color: var(--text-secondary); font-size: 0.9rem; }

	.validation-section {
		margin-bottom: 1.5rem;
		padding: 1rem 1.25rem;
		border-radius: 10px;
	}
	.validation-section.errors {
		background: rgba(239, 68, 68, 0.06);
		border: 1px solid rgba(239, 68, 68, 0.25);
	}
	.validation-section.warnings {
		background: rgba(245, 158, 11, 0.06);
		border: 1px solid rgba(245, 158, 11, 0.25);
	}
	.validation-section.suggestions {
		background: rgba(59, 130, 246, 0.06);
		border: 1px solid rgba(59, 130, 246, 0.25);
	}
	.validation-section h4 {
		font-size: 0.85rem;
		font-weight: 700;
		margin-bottom: 0.75rem;
		color: var(--text-primary);
	}
	.validation-section ul {
		margin: 0;
		padding-left: 1.25rem;
		font-size: 0.9rem;
		color: var(--text-secondary);
	}
	.validation-section li {
		margin-bottom: 0.4rem;
		line-height: 1.5;
	}

	/* Tab badges */
	.badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 18px;
		height: 18px;
		padding: 0 5px;
		border-radius: 999px;
		font-size: 0.65rem;
		font-weight: 700;
		margin-left: 0.35rem;
	}
	.badge.error {
		background: #ef4444;
		color: white;
	}
	.badge.warn {
		background: #f59e0b;
		color: white;
	}
	.badge.ok {
		background: #10b981;
		color: white;
		font-size: 0.55rem;
	}
	.etab.has-errors { color: #ef4444; }
	.etab.has-warnings { color: #f59e0b; }

	@media (max-width: 768px) {
		.form-grid { grid-template-columns: 1fr; }
		.field-desc { grid-column: 1; }
		.field-cat { grid-column: 1; }
		.create-page { padding: 6rem 1.25rem 3rem; }
		.publish-bar { flex-direction: column; align-items: stretch; }
		.publish-note { text-align: center; }
	}
</style>
