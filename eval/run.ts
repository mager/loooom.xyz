// Loooom skill-quality harness. Two gates:
//   Gate 1 (spec.ts)  — deterministic structure check. Free, always runs.
//   Gate 2 (judge.ts) — LLM-as-judge against the rubric. Free via Groq/Ollama.
//
//   npm run eval              # both gates, all skills
//   npm run eval -- --spec    # Gate 1 only (no model, no network)
//   npm run eval -- hook      # only skills whose name matches an argument
//
// Writes eval-scores.json at the repo root for the site to display.

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadSkills, loadFixtures } from './load';
import { runSpec, type SpecResult } from './spec';
import { judgeSkill, JUDGE_INFO } from './judge';
import { RUBRIC_VERSION, DIMENSIONS, type QualityResult } from './rubric';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

const args = process.argv.slice(2);
const specOnly = args.includes('--spec');
const calibrate = args.includes('--calibrate');
const filters = args.filter((a) => !a.startsWith('--'));

// Calibration thresholds: a costume must land below COSTUME_MAX, a real skill
// at or above GOOD_MIN. A judge that can't keep them apart is rubber-stamping.
const COSTUME_MAX = 60;
const GOOD_MIN = 80;

const c = {
	reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
	green: '\x1b[32m', yellow: '\x1b[33m', red: '\x1b[31m', cyan: '\x1b[36m'
};
const verdictColor = (v: string) => (v === 'passing' ? c.green : v === 'needs-work' ? c.yellow : c.red);

interface SkillReport {
	spec: SpecResult;
	quality: QualityResult | null;
	verdict: string;
}

// Self-test the judge: it must score deliberate "costume" fixtures low and the
// real skills high. Reports the separation gap and fails (exit 1) if the judge
// can't tell craft from costume — so CI catches a degraded judge.
async function runCalibration() {
	console.log(`\n${c.bold}Loooom judge calibration${c.reset} ${c.dim}· rubric v${RUBRIC_VERSION}${c.reset}`);
	console.log(`${c.dim}judge: ${JUDGE_INFO.model} @ ${JUDGE_INFO.baseUrl}${c.reset}`);
	if (!JUDGE_INFO.hasKey && JUDGE_INFO.baseUrl.includes('groq')) {
		console.error(`${c.red}No EVAL_API_KEY / GROQ_API_KEY set.${c.reset}`);
		process.exit(1);
	}

	const reals = loadSkills().map((s) => ({ ...s, kind: 'real' as const, judgeName: s.name }));
	const costumes = loadFixtures().map((s) => ({ ...s, kind: 'costume' as const, judgeName: s.name.replace(/^costume-/, '') }));
	if (!costumes.length) {
		console.error(`${c.red}No costume fixtures in eval/fixtures/ — nothing to calibrate against.${c.reset}`);
		process.exit(1);
	}
	console.log('');

	const rows: { name: string; kind: 'real' | 'costume'; score: number }[] = [];
	for (const s of [...reals, ...costumes]) {
		const q = await judgeSkill(s.judgeName, s.raw);
		rows.push({ name: s.name, kind: s.kind, score: q.score });
		const ok = s.kind === 'costume' ? q.score < COSTUME_MAX : q.score >= GOOD_MIN;
		const tag = s.kind === 'costume' ? `${c.yellow}costume${c.reset}` : `real   `;
		console.log(`  ${ok ? c.green : c.red}${q.score.toString().padStart(3)}${c.reset}  ${tag}  ${s.name}  ${c.dim}${q.verdictLine}${c.reset}`);
	}

	const good = rows.filter((r) => r.kind === 'real').map((r) => r.score);
	const cost = rows.filter((r) => r.kind === 'costume').map((r) => r.score);
	const minGood = Math.min(...good);
	const maxCostume = Math.max(...cost);
	const gap = minGood - maxCostume;
	const pass = cost.every((s) => s < COSTUME_MAX) && good.every((s) => s >= GOOD_MIN) && gap > 0;

	console.log(`\n  ${c.dim}worst real ${minGood} · best costume ${maxCostume} · separation ${gap}${c.reset}\n`);
	if (pass) {
		console.log(`${c.green}${c.bold}CALIBRATION PASS${c.reset} — the judge separates craft from costume (gap ${gap}).\n`);
	} else {
		console.log(`${c.red}${c.bold}CALIBRATION FAIL${c.reset} — judge isn't discriminating. Tighten the rubric or try a stronger model (e.g. EVAL_MODEL=openai/gpt-oss-120b).\n`);
	}
	process.exit(pass ? 0 : 1);
}

async function main() {
	if (calibrate) {
		await runCalibration();
		return;
	}
	let skills = loadSkills();
	if (filters.length) skills = skills.filter((s) => filters.some((f) => s.name.includes(f)));
	if (!skills.length) {
		console.error('No skills found under skills/*/SKILL.md');
		process.exit(1);
	}

	console.log(`\n${c.bold}Loooom skill eval${c.reset} ${c.dim}· rubric v${RUBRIC_VERSION}${c.reset}`);
	if (!specOnly) {
		console.log(`${c.dim}judge: ${JUDGE_INFO.model} @ ${JUDGE_INFO.baseUrl}${c.reset}`);
		if (!JUDGE_INFO.hasKey && JUDGE_INFO.baseUrl.includes('groq')) {
			console.error(`${c.red}No EVAL_API_KEY / GROQ_API_KEY set — run with --spec, or set a key.${c.reset}`);
			process.exit(1);
		}
	}
	console.log('');

	const report: Record<string, SkillReport> = {};

	for (const skill of skills) {
		const spec = runSpec(skill.name, skill.raw);
		let quality: QualityResult | null = null;
		let err: string | null = null;

		if (!specOnly) {
			try {
				quality = await judgeSkill(skill.name, skill.raw);
			} catch (e) {
				err = e instanceof Error ? e.message : String(e);
			}
		}

		const verdict = quality ? quality.verdict : spec.passed === spec.total ? 'spec-ok' : 'spec-fail';
		report[`mager/${skill.name}`] = { spec, quality, verdict };

		// ── print ──
		const head = quality
			? `${verdictColor(quality.verdict)}${quality.score.toString().padStart(3)}${c.reset} ${verdictColor(quality.verdict)}${quality.verdict}${c.reset}`
			: `${c.dim}spec ${spec.passed}/${spec.total}${c.reset}`;
		console.log(`${c.bold}${skill.name}${c.reset}  ${head}`);

		const specFails = spec.checks.filter((ck) => !ck.ok);
		console.log(`  ${c.dim}spec ${spec.passed}/${spec.total}${c.reset}` + (specFails.length ? `  ${c.yellow}⚠ ${specFails.map((f) => f.id).join(', ')}${c.reset}` : `  ${c.green}✓${c.reset}`));
		for (const f of specFails) console.log(`    ${c.yellow}- ${f.msg}${c.reset}`);

		if (quality) {
			for (const d of DIMENSIONS) {
				const ds = quality.dimensions[d.id];
				const col = ds.score >= 4 ? c.green : ds.score >= 3 ? c.yellow : c.red;
				console.log(`  ${col}${ds.score}/5${c.reset} ${d.label.padEnd(16)} ${c.dim}${ds.note}${c.reset}`);
			}
			console.log(`  ${c.cyan}↳ ${quality.verdictLine}${c.reset}`);
			if (quality.regeneratableFromTitle) console.log(`  ${c.red}↳ judge flags: regeneratable from title alone${c.reset}`);
		} else if (!specOnly) {
			console.log(`  ${c.red}judge error: ${err}${c.reset}`);
		}
		console.log('');
	}

	const out = {
		updatedAt: new Date().toISOString(),
		rubricVersion: RUBRIC_VERSION,
		judge: specOnly ? null : { model: JUDGE_INFO.model, baseUrl: JUDGE_INFO.baseUrl },
		skills: report
	};
	const outPath = join(ROOT, 'eval-scores.json');
	writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
	console.log(`${c.dim}wrote ${outPath}${c.reset}\n`);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
