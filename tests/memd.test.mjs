import test from 'node:test';
import assert from 'node:assert/strict';
import {
	ME_MD_TEMPLATE,
	parseMeMd,
	formStateFromParsed,
	markdownFromFormState
} from '../src/lib/memd.ts';

function withoutBuffer(action) {
	const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'Buffer');
	delete globalThis.Buffer;
	try {
		return action();
	} finally {
		if (descriptor) Object.defineProperty(globalThis, 'Buffer', descriptor);
	}
}

test('parses metadata and sections when the browser has no Buffer global', () => {
	const body = '\n# 🫀 My Values\n\nKeep source text.\n\n## A custom section\n\n- Test the result.\n';
	const result = withoutBuffer(() => parseMeMd(`---
version: "1.0"
handle: "@reader"
updated: "2026-11-17"
tags: [coding, design]
agents:
  - id: helper
    role: "Review changes"
public: false
---
${body}`));

	assert.equal(result.valid, true, result.errors.join('\n'));
	assert.equal(result.frontmatter.handle, '@reader');
	assert.equal(result.frontmatter.version, '1.0');
	assert.equal(result.frontmatter.updated, '2026-11-17');
	assert.equal(result.frontmatter.public, false);
	assert.deepEqual(result.frontmatter.tags, ['coding', 'design']);
	assert.deepEqual(result.frontmatter.agents, [{ id: 'helper', role: 'Review changes' }]);
	assert.equal(result.raw, body);
	assert.deepEqual(result.sections, [
		{ id: 'my-values', title: 'My Values', level: 1, icon: '🫀', content: 'Keep source text.' },
		{ id: 'a-custom-section', title: 'A custom section', level: 2, icon: undefined, content: '- Test the result.' }
	]);
});

test('reports malformed YAML without replacing it with a browser runtime error', () => {
	const raw = '---\nversion: "1.0"\nhandle: [unfinished\n---\n# Context\nDraft';
	const result = withoutBuffer(() => parseMeMd(raw));

	assert.equal(result.valid, false);
	assert.match(result.errors[0], /Failed to parse frontmatter:.*YAMLException/s);
	assert.doesNotMatch(result.errors[0], /Buffer|ReferenceError/);
	assert.equal(result.raw, raw);
	assert.deepEqual(result.sections, []);
});

test('keeps required-field errors and body sections without metadata', () => {
	for (const prefix of ['', '---\n---\n']) {
		const result = parseMeMd(`${prefix}# Context\n\nA draft without identity.`);
		assert.equal(result.valid, false);
		assert.deepEqual(result.errors, ['Missing required field: handle', 'Missing required field: version']);
		assert.equal(result.frontmatter.handle, 'unknown');
		assert.equal(result.frontmatter.version, '1.0');
		assert.equal(result.frontmatter.public, true);
		assert.equal(result.sections[0].content, 'A draft without identity.');
	}
});

test('accepts BOM and CRLF files while keeping the Markdown body unchanged', () => {
	const body = '\r\n# Context\r\n\r\nKeep these line endings.\r\n';
	const result = parseMeMd(`\ufeff---\r\nversion: "1.0"\r\nhandle: "@reader"\r\n---\r\n${body}`);
	assert.equal(result.valid, true, result.errors.join('\n'));
	assert.equal(result.raw, body);
	assert.equal(result.frontmatter.handle, '@reader');
});

test('keeps template values and form edits through a browser Markdown roundtrip', () => {
	const { initial, saved } = withoutBuffer(() => {
		const initial = parseMeMd(ME_MD_TEMPLATE);
		const form = formStateFromParsed(initial);
		form.handle = '@reader';
		form.name = 'Test Reader';
		form.isPublic = false;
		form.tags = ['writing', 'testing'];
		form.sections['my-values'] = 'Keep a clear record.';
		form.sections.context = 'Test the editor.\n\n- Switch between Form and Raw.';
		return { initial, saved: parseMeMd(markdownFromFormState(form)) };
	});

	assert.equal(initial.valid, true, initial.errors.join('\n'));
	assert.equal(saved.valid, true, saved.errors.join('\n'));
	assert.equal(saved.frontmatter.handle, '@reader');
	assert.equal(saved.frontmatter.name, 'Test Reader');
	assert.equal(saved.frontmatter.timezone, 'America/Chicago');
	assert.equal(saved.frontmatter.public, false);
	assert.deepEqual(saved.frontmatter.tags, ['writing', 'testing']);
	assert.deepEqual(saved.frontmatter.agents, [{
		id: 'mybot', model: 'claude-sonnet-4-6', role: 'Principal Engineer', emoji: '⚡', channel: 'telegram'
	}]);
	assert.equal(saved.sections.length, 7);
	assert.equal(saved.sections.find(section => section.id === 'my-values').content, 'Keep a clear record.');
	assert.equal(saved.sections.find(section => section.id === 'context').content, 'Test the editor.\n\n- Switch between Form and Raw.');
	assert.equal(saved.sections.find(section => section.id === 'the-lore').content,
		'Where you came from. The origin story. The backstory that matters.');
});
