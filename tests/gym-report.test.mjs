import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseReport } from '../src/lib/gym/report.ts';
const sample = () => JSON.parse(readFileSync(new URL('../src/lib/data/gym/absorb.json', import.meta.url), 'utf8'));
test('accepts a saved report and partial reports', () => {
 const report=sample(); assert.equal(parseReport(report).suite.id,'absorb');
 report.status='error'; report.baseline.results=report.baseline.results.slice(0,1); report.decision=null;
 assert.equal(parseReport(report).status,'error');
});
test('rejects malformed nested data, duplicates, and unsafe source URLs', () => {
 for (const mutate of [r=>r.suite.cases.push(r.suite.cases[0]),r=>r.baseline=null,r=>r.suite.sourceUrl='javascript:alert(1)',r=>r.baseline.results[0].checks[0].pass='yes',r=>r.baseline.results[0].passed=false,r=>r.runner=null,r=>r.baseline.results=[],r=>r.candidate={}]) {
  const r=sample();mutate(r);assert.throws(()=>parseReport(r));
 }
 assert.throws(()=>parseReport(null)); assert.throws(()=>parseReport({schemaVersion:2}));
});
