// Loooom skill-quality rubric — the operative version used by the LLM judge.
// The human-readable companion lives in RUBRIC.md (keep them in sync when the
// weights or dimensions change). This is Gate 2 of the harness; Gate 1 is the
// deterministic spec check in spec.ts.

export const RUBRIC_VERSION = '1.0';

export interface Dimension {
	id: 'method' | 'specificity' | 'worked_example' | 'point_of_view' | 'voice';
	label: string;
	weight: number; // fractions sum to 1.0
	guidance: string;
}

// The five things that separate a real skill from a costume — drawn straight
// from the quality bar in the Loooom blog post. Weighted toward the two signals
// that matter most: is there a real method, and is it specific enough that you
// couldn't regenerate it from the title alone.
export const DIMENSIONS: Dimension[] = [
	{
		id: 'method',
		label: 'Method',
		weight: 0.25,
		guidance:
			'A real, ordered, followable procedure — not adjectives or vibes. A reader could actually DO the steps and get a result. "Be catchy and use repetition" is not a method; numbered moves that build on each other are.'
	},
	{
		id: 'specificity',
		label: 'Specificity',
		weight: 0.25,
		guidance:
			'Concrete, non-obvious technique: named moves, real numbers, specific images. The killer test — could you regenerate this skill from its TITLE alone? If yes, it is generic and scores low. The detail only a practitioner would know is the whole game.'
	},
	{
		id: 'worked_example',
		label: 'Worked example',
		weight: 0.15,
		guidance:
			'At least one example carried end to end — ideally a weak→strong transformation that shows the method working on a real case. "For example, be memorable" is not a worked example; a before/after that applies the steps is.'
	},
	{
		id: 'point_of_view',
		label: 'Point of view',
		weight: 0.2,
		guidance:
			'Tells the model what NOT to do: failure modes, anti-patterns, diagnoses, explicit tradeoffs. This is where expertise hides — anyone can list what to do, only a practitioner knows the common ways it goes wrong.'
	},
	{
		id: 'voice',
		label: 'Voice & restraint',
		weight: 0.15,
		guidance:
			'Reads like a practitioner wrote it — opinionated, confident, signal-dense. Not bloated, not hedged, not padded to look like effort. High-signal beats long.'
	}
];

export interface DimensionScore {
	score: number; // 0–5
	note: string;
}

export interface QualityResult {
	dimensions: Record<Dimension['id'], DimensionScore>;
	regeneratableFromTitle: boolean;
	verdictLine: string;
	score: number; // 0–100, weighted
	verdict: 'passing' | 'needs-work' | 'failing';
}

// Weighted 0–5 dimension scores → 0–100.
export function computeScore(dims: Record<Dimension['id'], DimensionScore>): number {
	let total = 0;
	for (const d of DIMENSIONS) {
		const s = dims[d.id]?.score ?? 0;
		total += (s / 5) * d.weight;
	}
	return Math.round(total * 100);
}

// A skill passes only if it clears the bar overall AND has no weak limb. A 90
// average with one dimension at 1 is not a skill worth shipping — it has a hole.
export function verdictFor(
	score: number,
	dims: Record<Dimension['id'], DimensionScore>
): QualityResult['verdict'] {
	const min = Math.min(...DIMENSIONS.map((d) => dims[d.id]?.score ?? 0));
	if (score >= 80 && min >= 3) return 'passing';
	if (score >= 60) return 'needs-work';
	return 'failing';
}

// System prompt for the judge. Includes calibration anchors so a 3 means the
// same thing across skills and across model swaps.
export function buildSystemPrompt(): string {
	const dimBlock = DIMENSIONS.map(
		(d) => `- **${d.label}** (${Math.round(d.weight * 100)}% of score): ${d.guidance}`
	).join('\n');

	return `You are a strict, expert evaluator of "skills" — markdown instruction files (SKILL.md) that teach an AI agent to do one thing well. Loooom is a curated collection held to a deliberately high bar, so judge like a practitioner who actually does this craft for a living, not like a friendly reviewer.

Most skills in the wild are a costume: a paragraph of generic instructions with a nice filename, regenerable from the title alone. A small number are real craft: a genuine method, concrete and specific, with a point of view about what not to do. Your job is to tell them apart and score honestly. Do not be generous. A competent-but-obvious skill is a 3, not a 5.

Score each dimension 0–5:
${dimBlock}

Anchors for every dimension:
- 0 — absent or actively wrong.
- 1 — a costume. Generic, could be regenerated from the title; no real expertise.
- 3 — competent and correct but obvious; a knowledgeable amateur could have written it.
- 5 — expert. Specific, non-obvious craft a practitioner would recognize as the real thing.

The single most important test: **could a decent writer regenerate this skill knowing only its title and one-line description?** If yes, it is a costume and Specificity and Method should both be low, regardless of how polished the prose is.

Respond with ONLY a JSON object, no prose before or after, in exactly this shape:
{
  "method": { "score": <0-5 integer>, "note": "<one specific sentence citing evidence from the text>" },
  "specificity": { "score": <0-5 integer>, "note": "<...>" },
  "worked_example": { "score": <0-5 integer>, "note": "<...>" },
  "point_of_view": { "score": <0-5 integer>, "note": "<...>" },
  "voice": { "score": <0-5 integer>, "note": "<...>" },
  "regeneratable_from_title": <true|false>,
  "verdict_line": "<one blunt sentence: is this real craft or a costume, and why>"
}

Every note must cite something concrete from the skill — a specific step, phrase, or omission. Generic notes are as bad as the costumes you are catching.`;
}
