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
import { loadSkills } from './load';
import { runSpec, type SpecResult } from './spec';
import { judgeSkill, JUDGE_INFO } from './judge';
import { RUBRIC_VERSION, DIMENSIONS, type QualityResult } from './rubric';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

const args = process.argv.slice(2);
const specOnly = args.includes('--spec');
const filters = args.filter((a) => !a.startsWith('--'));

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

async function main() {
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
