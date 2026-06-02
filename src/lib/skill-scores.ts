// Reads the committed eval-scores.json (produced by `npm run eval`) so the site
// can show each skill's quality score — the public quality bar in action.
// Bundled at build time via import.meta.glob; updates on redeploy.

export interface DimensionScore {
	score: number;
	note: string;
}

export interface SkillQuality {
	score: number;
	verdict: 'passing' | 'needs-work' | 'failing';
	verdictLine: string;
	regeneratableFromTitle: boolean;
	dimensions: Record<string, DimensionScore>;
}

interface ScoresFile {
	updatedAt: string;
	rubricVersion: string;
	judge: { model: string; baseUrl: string } | null;
	skills: Record<string, { spec: { passed: number; total: number }; quality: SkillQuality | null }>;
}

const loaded = import.meta.glob('/eval-scores.json', { eager: true, import: 'default' }) as Record<
	string,
	ScoresFile
>;
const scores: ScoresFile | null = loaded['/eval-scores.json'] ?? null;

// Dimension display order + labels (mirrors eval/rubric.ts DIMENSIONS).
export const QUALITY_DIMENSIONS: { id: string; label: string }[] = [
	{ id: 'method', label: 'Method' },
	{ id: 'specificity', label: 'Specificity' },
	{ id: 'worked_example', label: 'Worked example' },
	{ id: 'point_of_view', label: 'Point of view' },
	{ id: 'voice', label: 'Voice' }
];

export interface SkillQualityView extends SkillQuality {
	rubricVersion: string;
	specPassed: number;
	specTotal: number;
}

export function getSkillQuality(author: string, name: string): SkillQualityView | null {
	const entry = scores?.skills?.[`${author}/${name}`];
	if (!entry?.quality) return null;
	return {
		...entry.quality,
		rubricVersion: scores!.rubricVersion,
		specPassed: entry.spec.passed,
		specTotal: entry.spec.total
	};
}
