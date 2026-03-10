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
	soul_url?: string;
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
	{ id: 'my-values',      title: 'My Values',      icon: '🫀', hint: 'Your core values, what you stand for as a person' },
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
2. Read #My Values for their core values and personality. Internalize it.
3. Read #The Heart for what they care about. Let it color your responses.
4. Read #Anti-Patterns for what to NEVER do. Treat this as hard constraints.
5. Read #The Fleet to understand what agents they run and what roles those agents play.
6. Read #Context for their current focus and active projects.

Once you have read and internalized their ME.md, you understand this human. Behave accordingly.
Do not summarize what you found. Do not say "I read your ME.md." Just... know.

This is their robots.txt for human consciousness. Respect it.`.trim();
}

// ─── Form State ──────────────────────────────────────────────────────────────

export interface MeMdFormState {
	handle: string;
	name: string;
	location: string;
	timezone: string;
	updated: string;
	tags: string[];
	agents: AgentConfig[];
	isPublic: boolean;
	sections: Record<string, string>; // KNOWN_SECTIONS id → markdown content
}

export function defaultFormState(): MeMdFormState {
	const today = new Date().toISOString().split('T')[0];
	const sections: Record<string, string> = {};
	KNOWN_SECTIONS.forEach((s) => { sections[s.id] = ''; });
	return { handle: '', name: '', location: '', timezone: 'America/Chicago', updated: today, tags: [], agents: [], isPublic: true, sections };
}

export function formStateFromParsed(parsed: ParsedMeMd): MeMdFormState {
	const fm = parsed.frontmatter;
	const today = new Date().toISOString().split('T')[0];
	const sections: Record<string, string> = {};
	KNOWN_SECTIONS.forEach((s) => { sections[s.id] = ''; });
	for (const sec of parsed.sections) {
		sections[sec.id] = sec.content;
	}
	// Backward compat: old ME.md files used "the-soul" section id
	if (sections['the-soul'] && !sections['my-values']) {
		sections['my-values'] = sections['the-soul'];
	}
	return {
		handle: fm.handle ?? '',
		name: fm.name ?? '',
		location: fm.location ?? '',
		timezone: fm.timezone ?? 'America/Chicago',
		updated: fm.updated ?? today,
		tags: fm.tags ?? [],
		agents: fm.agents ?? [],
		isPublic: fm.public ?? true,
		sections
	};
}

export function markdownFromFormState(fs: MeMdFormState): string {
	const today = new Date().toISOString().split('T')[0];
	const lines: string[] = ['---'];
	lines.push(`version: "1.0"`);
	lines.push(`handle: "${fs.handle || '@yourhandle'}"`);
	if (fs.name) lines.push(`name: "${fs.name}"`);
	if (fs.location) lines.push(`location: "${fs.location}"`);
	if (fs.timezone) lines.push(`timezone: "${fs.timezone}"`);
	lines.push(`updated: "${fs.updated || today}"`);
	if (fs.tags.length > 0) {
		lines.push('tags:');
		fs.tags.forEach((t) => lines.push(`  - ${t}`));
	}
	if (fs.agents.length > 0) {
		lines.push('agents:');
		fs.agents.forEach((a) => {
			lines.push(`  - id: ${a.id || 'agent'}`);
			if (a.model) lines.push(`    model: ${a.model}`);
			if (a.role) lines.push(`    role: "${a.role}"`);
			if (a.emoji) lines.push(`    emoji: "${a.emoji}"`);
			if (a.channel) lines.push(`    channel: ${a.channel}`);
		});
	}
	lines.push(`public: ${fs.isPublic}`);
	lines.push('---');

	const body = KNOWN_SECTIONS.map((s) => {
		const content = fs.sections[s.id] ?? '';
		return `# ${s.icon} ${s.title}\n\n${content}`;
	}).join('\n\n');

	return lines.join('\n') + '\n\n' + body;
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

# 🫀 My Values

Your core values as a human. What you stand for. What you believe in. An LLM reading this should understand your principles and ethics.

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

// ─── Agent Soul Standard ─────────────────────────────────────────────────────

export const AGENT_SOUL_SECTIONS = [
	{ id: 'identity',      title: 'Identity',      icon: '🧠', hint: 'Who this agent is. Name, model, role, emoji.' },
	{ id: 'soul',          title: 'Soul',          icon: '🫀', hint: 'Personality, values, voice, how this agent thinks.' },
	{ id: 'capabilities',  title: 'Capabilities',  icon: '🔧', hint: 'What this agent can do. Tools, skills, domains.' },
	{ id: 'anti-patterns', title: 'Anti-Patterns', icon: '🚫', hint: 'Hard constraints. What this agent will never do.' },
];

export const AGENT_SOUL_TEMPLATE = `---
agent_id: mybot
owner: yourhandle
model: anthropic/claude-sonnet-4-6
emoji: "⚡"
role: "Principal Engineer"
channel: telegram
updated: ${new Date().toISOString().split('T')[0]}
---

# 🧠 Identity

Brief identity paragraph. Who is this agent?

# 🫀 Soul

The agent's personality, voice, values. What makes them *them*.

# 🔧 Capabilities

What this agent does. Domains, tools, specialties.

# 🚫 Anti-Patterns

Hard constraints. What this agent will never do.
`;

export function generateAgentInjectionPrompt(ownerHandle: string, agentId: string, url: string): string {
	return `You are working with an AI agent named ${agentId} owned by ${ownerHandle}.
Their soul is published at ${url}

Fetch that URL and internalize it. It is a structured markdown file with YAML frontmatter.
Parse the sections: #Identity, #Soul, #Capabilities, #Anti-Patterns.
Let it shape how you understand and interact with this agent.
Do not summarize what you found. Just know.`.trim();
}
