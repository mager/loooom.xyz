// Fetches and caches plugin eval scores from the Loooom catalog repo.
// Scores are written nightly by the eval.yml GitHub Action.

const SCORES_URL =
	'https://raw.githubusercontent.com/mager/loooom/main/eval-scores.json';

const CACHE_TTL_MS = 60_000; // 60s

export interface PluginScore {
	score: number;
	passed: number;
	total: number;
	status: 'passing' | 'failing' | 'pending';
}

export interface EvalScores {
	updatedAt: string;
	plugins: Record<string, PluginScore>;
}

let cache: { data: EvalScores; fetchedAt: number } | null = null;

export async function fetchEvalScores(): Promise<EvalScores | null> {
	if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
		return cache.data;
	}
	try {
		const res = await fetch(SCORES_URL, { signal: AbortSignal.timeout(5000) });
		if (!res.ok) return null;
		const data: EvalScores = await res.json();
		cache = { data, fetchedAt: Date.now() };
		return data;
	} catch {
		return null;
	}
}

export function getPluginScore(
	scores: EvalScores | null,
	author: string,
	name: string
): PluginScore | null {
	if (!scores) return null;
	return scores.plugins[`${author}/${name}`] ?? null;
}
