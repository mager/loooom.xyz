// Gate 2 — LLM-as-judge against the rubric. Provider-agnostic: talks to any
// OpenAI-compatible /chat/completions endpoint, so the same code runs on Groq's
// free tier (default), a local Ollama, Gemini's compat endpoint, OpenRouter, etc.
// No Anthropic, no paid API. Swap providers with three env vars:
//
//   EVAL_BASE_URL   default https://api.groq.com/openai/v1
//   EVAL_MODEL      default llama-3.3-70b-versatile
//   EVAL_API_KEY    default falls back to GROQ_API_KEY (empty is fine for Ollama)
//
// Higher-ceiling free judges on Groq: openai/gpt-oss-120b, qwen/qwen3-32b.
// Local & fully offline: EVAL_BASE_URL=http://localhost:11434/v1 EVAL_MODEL=qwen2.5:14b

import {
	DIMENSIONS,
	buildSystemPrompt,
	computeScore,
	verdictFor,
	type Dimension,
	type DimensionScore,
	type QualityResult
} from './rubric';

const BASE_URL = process.env.EVAL_BASE_URL || 'https://api.groq.com/openai/v1';
const MODEL = process.env.EVAL_MODEL || 'llama-3.3-70b-versatile';
const API_KEY = process.env.EVAL_API_KEY || process.env.GROQ_API_KEY || '';

export const JUDGE_INFO = { baseUrl: BASE_URL, model: MODEL, hasKey: Boolean(API_KEY) };

interface RawScores {
	[k: string]: { score: number; note: string } | boolean | string;
}

function clampScore(n: unknown): number {
	const v = Math.round(Number(n));
	if (!Number.isFinite(v)) return 0;
	return Math.max(0, Math.min(5, v));
}

// Models occasionally wrap JSON in prose or code fences despite instructions.
// Extract the first balanced {...} block and parse that.
function extractJson(text: string): RawScores {
	const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
	const candidate = fenced ? fenced[1] : text;
	const start = candidate.indexOf('{');
	const end = candidate.lastIndexOf('}');
	if (start === -1 || end === -1) throw new Error('no JSON object in judge response');
	return JSON.parse(candidate.slice(start, end + 1));
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function callModel(system: string, user: string): Promise<string> {
	const body = JSON.stringify({
		model: MODEL,
		temperature: 0,
		max_tokens: 1500,
		response_format: { type: 'json_object' },
		messages: [
			{ role: 'system', content: system },
			{ role: 'user', content: user }
		]
	});

	// Free tiers rate-limit by tokens/minute; back off on 429/5xx and retry.
	for (let attempt = 0; ; attempt++) {
		const res = await fetch(`${BASE_URL}/chat/completions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {})
			},
			body
		});

		if (res.status === 429 || res.status === 503 || res.status === 529) {
			if (attempt >= 6) throw new Error(`judge HTTP ${res.status} after ${attempt} retries`);
			const text = await res.text().catch(() => '');
			const header = Number(res.headers.get('retry-after'));
			const fromBody = text.match(/try again in ([\d.]+)s/);
			const waitMs = header
				? header * 1000 + 250
				: fromBody
					? Math.ceil(parseFloat(fromBody[1]) * 1000) + 250
					: (attempt + 1) * 2000;
			await sleep(Math.min(waitMs, 30000));
			continue;
		}

		if (!res.ok) {
			const errBody = await res.text().catch(() => '');
			throw new Error(`judge HTTP ${res.status}: ${errBody.slice(0, 300)}`);
		}

		const data = await res.json();
		const content = data?.choices?.[0]?.message?.content;
		if (typeof content !== 'string') throw new Error('judge returned no content');
		return content;
	}
}

export async function judgeSkill(name: string, raw: string): Promise<QualityResult> {
	const system = buildSystemPrompt();
	const user = `Score this skill named "${name}". Here is the full SKILL.md:\n\n---\n${raw}\n---\n\nReturn only the JSON object.`;

	let parsed: RawScores | null = null;
	let lastErr: unknown = null;
	for (let attempt = 0; attempt < 2; attempt++) {
		try {
			const text = await callModel(
				system,
				attempt === 0 ? user : `${user}\n\nReturn ONLY valid JSON. No prose, no code fences.`
			);
			parsed = extractJson(text);
			break;
		} catch (e) {
			lastErr = e;
		}
	}
	if (!parsed) throw new Error(`judge failed: ${lastErr instanceof Error ? lastErr.message : String(lastErr)}`);

	const dims = {} as Record<Dimension['id'], DimensionScore>;
	for (const d of DIMENSIONS) {
		const entry = parsed[d.id];
		if (entry && typeof entry === 'object') {
			dims[d.id] = { score: clampScore((entry as { score: unknown }).score), note: String((entry as { note: unknown }).note ?? '') };
		} else {
			dims[d.id] = { score: 0, note: 'missing from judge output' };
		}
	}

	const score = computeScore(dims);
	return {
		dimensions: dims,
		regeneratableFromTitle: parsed.regeneratable_from_title === true,
		verdictLine: typeof parsed.verdict_line === 'string' ? parsed.verdict_line : '',
		score,
		verdict: verdictFor(score, dims)
	};
}
