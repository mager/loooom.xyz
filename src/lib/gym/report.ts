export interface GymCase { id: string; title: string; split: 'train' | 'holdout'; prompt: string; criteria: string[] }
export interface GymResult { id: string; response: string; elapsedMs: number; passed?: boolean; checks?: { criterion: string; pass: boolean; reason: string }[] }
export interface GymVersion { hash: string; words: number; bytes: number; content: string; results: GymResult[]; rationale?: string }
export interface GymReport {
 schemaVersion: 1; id: string; startedAt: string; finishedAt?: string;
 status: 'running' | 'accepted' | 'rejected' | 'no-defect' | 'error';
 strategy: 'repair' | 'ablate'; suiteHash: string;
 suite: { id: string; title: string; description: string; sourceUrl: string; seededDefect?: string; cases: GymCase[] };
 runner: { name: string; version: string; model: string; judge: string; repetitions: number };
 baseline: GymVersion; candidate: GymVersion | null;
 decision: { accepted: boolean; fixed: string[]; regressions: string[]; wordsRemoved: number; reductionPercent: number; reason: string } | null;
 limitation: string; error?: string;
}

// Validate imported files before any nested field reaches the UI.
export function parseReport(value: unknown): GymReport {
 const fail = (): never => { throw new Error('This file is not a supported gym report. Export a schemaVersion 1 JSON report from loooom gym.'); };
 const record = (v: unknown): Record<string, unknown> => v && typeof v === 'object' && !Array.isArray(v) ? v as Record<string, unknown> : fail();
 const text = (v: unknown) => typeof v === 'string' && v.length > 0;
 const count = (v: unknown) => typeof v === 'number' && Number.isFinite(v) && v >= 0;
 const strings = (v: unknown) => Array.isArray(v) && v.every(x => typeof x === 'string');
 const r = record(value), s = record(r.suite), runner = record(r.runner);
 if (r.schemaVersion !== 1 || !text(r.id) || !text(r.suiteHash) || !text(r.startedAt) || !Number.isFinite(Date.parse(String(r.startedAt))) || !['running','accepted','rejected','no-defect','error'].includes(String(r.status)) || !['repair','ablate'].includes(String(r.strategy)) || !text(r.limitation)) fail();
 if (!text(s.id) || !/^[a-z][a-z0-9-]*$/.test(String(s.id)) || !text(s.title) || !text(s.description) || !text(s.sourceUrl) || !String(s.sourceUrl).startsWith('https://github.com/') || (s.seededDefect !== undefined && !text(s.seededDefect))) fail();
 if (!Array.isArray(s.cases) || !s.cases.length) fail();
 const cases = s.cases as unknown[];
 const ids = new Set<string>();
 for (const item of cases) {
  const c = record(item);
  if (!text(c.id) || ids.has(String(c.id)) || !text(c.title) || !text(c.prompt) || !['train','holdout'].includes(String(c.split)) || !strings(c.criteria) || !(c.criteria as string[]).length) fail();
  ids.add(String(c.id));
 }
 if (!text(runner.name) || !text(runner.version) || !text(runner.model) || !text(runner.judge) || !count(runner.repetitions)) fail();
 for (const v of [r.baseline, r.candidate].filter(x => x !== null)) {
  const variant = record(v);
  if (!text(variant.content) || !/^[a-f0-9]{64}$/.test(String(variant.hash)) || !count(variant.words) || !count(variant.bytes) || !Array.isArray(variant.results) || (variant.rationale !== undefined && !text(variant.rationale))) fail();
  if (variant.words !== String(variant.content).trim().split(/\s+/u).filter(Boolean).length || variant.bytes !== new TextEncoder().encode(String(variant.content)).length) fail();
  const resultIds = new Set();
  for (const item of variant.results as unknown[]) {
   const result = record(item);
   if (!ids.has(String(result.id)) || resultIds.has(result.id) || !text(result.response) || !count(result.elapsedMs)) fail();
   resultIds.add(result.id);
   if (result.passed !== undefined && typeof result.passed !== 'boolean') fail();
   if (result.checks !== undefined) {
    const c = record(cases.find(x => record(x).id === result.id));
    if (!Array.isArray(result.checks) || result.checks.length !== (c.criteria as string[]).length) fail();
    (result.checks as unknown[]).forEach((item, i) => { const check = record(item); if (check.criterion !== (c.criteria as string[])[i] || typeof check.pass !== 'boolean' || !text(check.reason)) fail(); });
    if (result.passed !== (result.checks as {pass: boolean}[]).every(x => x.pass)) fail();
   } else if (result.passed !== undefined) fail();
  }
 }
 if (r.decision !== null) {
  const d = record(r.decision);
  if (typeof d.accepted !== 'boolean' || !strings(d.fixed) || !strings(d.regressions) || typeof d.wordsRemoved !== 'number' || !Number.isFinite(d.wordsRemoved) || typeof d.reductionPercent !== 'number' || !Number.isFinite(d.reductionPercent) || !text(d.reason)) fail();
 }
 if (r.error !== undefined && !text(r.error)) fail();
 if (r.finishedAt !== undefined && (!text(r.finishedAt) || !Number.isFinite(Date.parse(String(r.finishedAt))))) fail();
 const report = value as GymReport;
 if (['accepted','rejected','no-defect'].includes(report.status)) {
  if (!report.decision || report.baseline.results.length !== cases.length || report.baseline.results.some(x => x.passed === undefined)) fail();
  if (report.status !== 'no-defect' && (!report.candidate || report.candidate.results.length !== cases.length || report.candidate.results.some(x => x.passed === undefined))) fail();
  if ((report.status === 'accepted') !== report.decision?.accepted) fail();
  if (report.status === 'accepted' && (report.candidate?.results.some(x => !x.passed) || report.decision?.regressions.length)) fail();
  if (report.status === 'no-defect' && report.candidate !== null) fail();
 }
 return report;
}
export const passed = (v: GymVersion) => v.results.filter(r => r.passed === true).length;
export const resultLabel = (r?: GymResult) => r?.passed === true ? 'Pass' : r?.passed === false ? 'Fail' : 'Not graded';
