/**
 * ME.md — Portable Human Context Protocol v1.0
 * "robots.txt for human consciousness"
 *
 * Parses a ME.md file into structured metadata + renderable sections.
 * Frontmatter: YAML. Body: standard markdown with known section headers.
 */

import matter from 'gray-matter';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AgentConfig {
	id: string;
	model?: string;
	role?: string;
	emoji?: string;
	channel?: string;
}

export interface MeMdFrontmatter {
	version: string;           // ME.md spec version (e.g. "1.0")
	handle: string;            // Human's primary identifier (e.g. "@mager")
	name?: string;             // Display name
	location?: string;         // Where they are
	timezone?: string;         // IANA timezone
	updated?: string;          // ISO date of last update
	agents?: AgentConfig[];    // Active agent fleet
	tags?: string[];           // Freeform keywords (coding, music, food, etc.)
	public?: boolean;          // Whether this context is public (default: true)
}

export interface MeMdSection {
	id: string;                // slug of header (e.g. "the-soul")
	title: string;             // Raw header text (e.g. "The Soul")
	level: number;             // Heading level (1-3)
	content: string;           // Raw markdown content of section
	icon?: string;             // Emoji decoration if header starts with one
}

export interface ParsedMeMd {
	frontmatter: MeMdFrontmatter;
	sections: MeMdSection[];
	raw: string;               // Original markdown (minus frontmatter)
	valid: boolean;
	errors: string[];
}

// ─── Known Sections (canonical ME.md spec) ───────────────────────────────────

export const KNOWN_SECTIONS = [
	{ id: 'the-soul',       title: 'The Soul',       icon: '🫀', hint: 'Core values, personality, what makes you *you*' },
	{ id: 'the-heart',      title: 'The Heart',      icon: '💛', hint: 'What you love, care about, believe in' },
	{ id: 'the-fleet',      title: 'The Fleet',      icon: '🤖', hint: 'Your active AI agents and their roles' },
	{ id: 'the-stack',      title: 'The Stack',      icon: '⚙️', hint: 'Tools, languages, platforms you use daily' },
	{ id: 'anti-patterns',  title: 'Anti-Patterns',  icon: '🚫', hint: "What you hate. What drives you crazy. What you won't tolerate." },
	{ id: 'context',        title: 'Context',        icon: '📍', hint: 'Current projects, focus, what you\'re building right now' },
	{ id: 'the-lore',       title: 'The Lore',       icon: '📖', hint: 'Backstory. Origin. The story behind the human.' },
];

// ─── Parser ──────────────────────────────────────────────────────────────────

export function parseMeMd(raw: string): ParsedMeMd {
	const errors: string[] = [];

	let parsed: matter.GrayMatterFile<string>;
	try {
		parsed = matter(raw);
	} catch (e) {
		return {
			frontmatter: { version: '0', handle: 'unknown' },
			sections: [],
			raw,
			valid: false,
			errors: ['Failed to parse frontmatter: ' + String(e)]
		};
	}

	const fm = parsed.data as Partial<MeMdFrontmatter>;

	// Validate required fields
	if (!fm.handle) errors.push('Missing required field: handle');
	if (!fm.version) errors.push('Missing required field: version');

	const frontmatter: MeMdFrontmatter = {
		version: fm.version ?? '1.0',
		handle: fm.handle ?? 'unknown',
		name: fm.name,
		location: fm.location,
		timezone: fm.timezone,
		updated: fm.updated,
		agents: fm.agents ?? [],
		tags: fm.tags ?? [],
		public: fm.public ?? true
	};

	// Parse sections from markdown body
	const sections = parseBodySections(parsed.content);

	return {
		frontmatter,
		sections,
		raw: parsed.content,
		valid: errors.length === 0,
		errors
	};
}

function parseBodySections(content: string): MeMdSection[] {
	const lines = content.split('\n');
	const sections: MeMdSection[] = [];
	let currentSection: MeMdSection | null = null;
	const currentLines: string[] = [];

	const headingRe = /^(#{1,3})\s+(.+)$/;

	function flush() {
		if (currentSection) {
			currentSection.content = currentLines.join('\n').trim();
			sections.push(currentSection);
			currentLines.length = 0;
		}
	}

	for (const line of lines) {
		const match = headingRe.exec(line);
		if (match) {
			flush();
			const level = match[1].length;
			const raw = match[2].trim();
			// Detect leading emoji as icon
			const emojiMatch = /^(\p{Emoji}\s+)/u.exec(raw);
			const icon = emojiMatch ? emojiMatch[1].trim() : undefined;
			const title = emojiMatch ? raw.slice(emojiMatch[0].length).trim() : raw;
			currentSection = {
				id: slugify(title),
				title,
				level,
				content: '',
				icon
			};
		} else if (currentSection) {
			currentLines.push(line);
		}
	}
	flush();

	return sections;
}

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

// ─── Injection Prompt Generator ──────────────────────────────────────────────

export function generateInjectionPrompt(handle: string, url: string): string {
	return `You are working with a human who has published their context at ${url}

Fetch that URL. It is a ME.md file: a structured markdown document with YAML frontmatter and standard sections.

Parse it as follows:
1. Read the YAML frontmatter for metadata: their handle (${handle}), active agents, timezone, and tags.
2. Read #The Soul for their core values and personality. Internalize it.
3. Read #The Heart for what they care about. Let it color your responses.
4. Read #Anti-Patterns for what to NEVER do. Treat this as hard constraints.
5. Read #The Fleet to understand what agents they run and what roles those agents play.
6. Read #Context for their current focus and active projects.

Once you have read and internalized their ME.md, you understand this human. Behave accordingly.
Do not summarize what you found. Do not say "I read your ME.md." Just... know.

This is their robots.txt for human consciousness. Respect it.`.trim();
}

// ─── Default Template ─────────────────────────────────────────────────────────

export const ME_MD_TEMPLATE = `---
version: "1.0"
handle: "@yourhandle"
name: "Your Name"
location: "Your City"
timezone: "America/Chicago"
updated: "${new Date().toISOString().split('T')[0]}"
tags:
  - coding
  - music
  - design
agents:
  - id: mybot
    model: claude-sonnet-4-6
    role: "Principal Engineer"
    emoji: "⚡"
    channel: telegram
public: true
---

# 🫀 The Soul

Who you are at the core. Your values, personality, what makes you *you*. An LLM reading this should feel like it *knows* you.

# 💛 The Heart

What you love. What you build for. What gets you out of bed.

# 🤖 The Fleet

Your active AI agents and what they do.

| Agent | Model | Role |
|-------|-------|------|
| mybot | claude-sonnet-4-6 | Principal Engineer |

# ⚙️ The Stack

Tools you use daily. Languages, frameworks, platforms.

# 🚫 Anti-Patterns

Hard constraints. What to never do. What drives you crazy.

- Never write a docstring that just repeats the function name
- Never suggest a SaaS tool when a shell script will do
- Never ask "would you like me to..." — just do it

# 📍 Context

Current projects. Active focus. What you're building right now.

# 📖 The Lore

Where you came from. The origin story. The backstory that matters.
`;
