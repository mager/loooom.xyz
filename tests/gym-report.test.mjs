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

const session = () => JSON.parse(readFileSync(new URL('../src/lib/data/gym/absorb-climb.session.json', import.meta.url),'utf8'));
const { parseArtifact } = await import('../src/lib/gym/session.ts');
test('hill-climb import accepts complete repeated evidence and minimal local metadata',()=>{
 const r=session();assert.equal(parseArtifact(r).schemaVersion,2);
 delete r.suite.title;delete r.suite.description;delete r.suite.sourceUrl;
 assert.equal(parseArtifact(r).suite.id,'absorb-climb');
});
test('hill-climb import rejects tampered scores, duplicate trials and false verification',()=>{
 for(const change of [r=>r.baseline.score.passed=0,r=>r.baseline.samples.push(r.baseline.samples[0]),r=>r.baseline.samples[0].passed=false,r=>r.baseline.samples[0].repetition=99,r=>r.status='verified',r=>r.selected.hash='0'.repeat(64),r=>r.calls=r.config.maxCalls+1,r=>r.suite.sourceUrl='javascript:alert(1)',r=>r.baseline.score.byCase={},r=>r.baseline.score.interval=[1,0]]) {
  const r=session();change(r);assert.throws(()=>parseArtifact(r));
 }
});
test('verified repair must match the recorded objective and round chain',()=>{
 const repair=()=>JSON.parse(readFileSync(new URL('../src/lib/data/gym/absorb-regression.session.json',import.meta.url),'utf8'));
 assert.equal(parseArtifact(repair()).status,'verified');
 for(const change of [r=>r.rounds[0].parentHash='0'.repeat(64),r=>r.rounds[0].decision.accepted=false,r=>r.verification.decision.wordsRemoved=0,r=>r.selected.words=1,r=>r.verification.candidate.score.byCase['fresh-topic'].passed=0,r=>r.verification.decision.fixed=[]]) {const r=repair();change(r);assert.throws(()=>parseArtifact(r));}
});
