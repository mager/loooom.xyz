// Gate 1 — deterministic spec compliance. Free, no model. Checks the things a
// good skill must structurally have before it is worth spending a judge call on.
// Mirrors the agentskills SKILL.md spec (allowed frontmatter fields) plus the
// Loooom house conventions (a method, a what-not-to-do section, an example).

import matter from 'gray-matter';

export interface SpecCheck {
	id: string;
	ok: boolean;
	msg: string;
}

export interface SpecResult {
	passed: number;
	total: number;
	checks: SpecCheck[];
}

// The agentskills spec allows only these six frontmatter keys. Anything else
// (author, version, tags, category, ...) must live under `metadata`.
const ALLOWED_FRONTMATTER = ['name', 'description', 'license', 'compatibility', 'allowed-tools', 'metadata'];

function wordCount(body: string): number {
	return body.trim().split(/\s+/).filter(Boolean).length;
}

export function runSpec(name: string, raw: string): SpecResult {
	const checks: SpecCheck[] = [];
	const add = (id: string, ok: boolean, msg: string) => checks.push({ id, ok, msg });

	let fm: Record<string, unknown> = {};
	let body = raw;
	let parsed = true;
	try {
		const g = matter(raw);
		fm = g.data as Record<string, unknown>;
		body = g.content;
	} catch {
		parsed = false;
	}

	add('frontmatter_parses', parsed, parsed ? 'YAML frontmatter parses' : 'frontmatter failed to parse');

	const hasName = typeof fm.name === 'string' && (fm.name as string).length > 0;
	add('has_name', hasName, hasName ? `name: ${fm.name}` : 'missing required field: name');
	add('name_matches_dir', fm.name === name, fm.name === name ? 'name matches directory' : `name "${fm.name}" != dir "${name}"`);

	const desc = typeof fm.description === 'string' ? (fm.description as string) : '';
	add('has_description', desc.length >= 10 && desc.length <= 280, desc ? `description (${desc.length} chars)` : 'missing/short description');

	const extra = Object.keys(fm).filter((k) => !ALLOWED_FRONTMATTER.includes(k));
	add(
		'frontmatter_spec_clean',
		extra.length === 0,
		extra.length === 0 ? 'frontmatter is spec-clean' : `non-spec frontmatter keys (move under metadata): ${extra.join(', ')}`
	);

	// A real method: a "## Method" heading or numbered procedure steps.
	const hasMethod = /^#{1,3}\s+the\s+method/im.test(body) || /^\s*###?\s+\d+\.\s+\S/m.test(body);
	add('has_method', hasMethod, hasMethod ? 'has an ordered method' : 'no ordered method/procedure found');

	// A point of view: what NOT to do.
	const hasAntipattern = /\b(don'?t|never|avoid|not\b|fails?|wrong|dead|tells|diagnos)/i.test(body);
	add('has_what_not_to_do', hasAntipattern, hasAntipattern ? 'addresses failure modes / what not to do' : 'no anti-patterns or failure modes');

	// At least one worked example.
	const hasExample = /^#{1,4}\s+.*\b(example|worked)\b/im.test(body) || /\bworked example\b/i.test(body);
	add('has_worked_example', hasExample, hasExample ? 'has a worked example' : 'no worked example section');

	// Loooom house convention: an Agent Behavior block.
	const hasAgentBehavior = /^#{1,4}\s+agent behavior/im.test(body);
	add('has_agent_behavior', hasAgentBehavior, hasAgentBehavior ? 'has Agent Behavior block' : 'missing Agent Behavior block');

	// Signal density — SkillOpt found high-signal ~920-token files win; flag bloat and thinness.
	const wc = wordCount(body);
	const okLen = wc >= 250 && wc <= 1500;
	add('signal_density', okLen, `${wc} words${okLen ? '' : wc < 250 ? ' (too thin)' : ' (bloated — tighten)'}`);

	return { passed: checks.filter((c) => c.ok).length, total: checks.length, checks };
}
