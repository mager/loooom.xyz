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

const { newestSessions, sessionStory } = await import('../src/lib/gym/log.ts');
const readRun = name => JSON.parse(readFileSync(new URL(`../src/lib/data/gym/${name}`,import.meta.url),'utf8'));
test('session history sorts by completion time without mutating the input',()=>{
 const focus=readRun('focus-climb.session.json'), repair=readRun('absorb-regression.session.json');
 // Focus started earlier but completed later than the repair.
 assert.ok(Date.parse(focus.startedAt)<Date.parse(repair.startedAt));
 const input=[repair,focus];assert.deepEqual(newestSessions(input).map(r=>r.id),[focus.id,repair.id]);assert.equal(input[0],repair);
});
test('session summaries distinguish final checks, early tests, and no-edit results',()=>{
 const focus=sessionStory(readRun('focus-climb.session.json'));
 assert.match(focus.result,/15\/15 before, 15\/15 after/);
 assert.match(focus.change,/Rejected the first cut/);
 const rejected=sessionStory(readRun('focus.json'));
 assert.equal(rejected.status,'Not kept');assert.match(rejected.result,/3\/3 tests passed before, 2\/3 after/);
 const unchanged=sessionStory(readRun('absorb-climb.session.json'));
 assert.equal(unchanged.status,'Unchanged');assert.match(unchanged.result,/9\/9 first tests passed. Then 6\/6 new tests passed/);
});
test('local imports do not inherit editorial notes from a matching saved session id',()=>{
 const local=readRun('focus-climb.session.json');local.suite.description='A different local investigation.';
 const story=sessionStory(local,true);assert.equal(story.problem,'A different local investigation.');assert.notEqual(story.title,'Shortened focus to 242 words');
});

const { weaveStages, weaveCases } = await import('../src/lib/gym/weave.ts');
test('test weave keeps rejected rounds and uses fresh baseline responses for the final comparison',()=>{
 const run=readRun('focus-climb.session.json');
 const stages=weaveStages(run);
 assert.deepEqual(stages.map(s=>s.outcome),['Not kept','Kept','Kept','Passed']);
 assert.equal(stages[0].before.score.passed,7);
 assert.equal(stages.at(-1).before.score.passed,15);
 assert.equal(stages.at(-1).before,run.verification.baseline);
 assert.equal(weaveCases(run,stages[0]).some(r=>r.test.split==='holdout'),false);
 assert.equal(weaveCases(run,stages.at(-1)).filter(r=>r.test.split==='holdout').length,2);
});
test('test weave pairs answers by question and repetition, not array position',()=>{
 const run=readRun('absorb-regression.session.json');
 run.verification.candidate.samples.reverse();
 const stage=weaveStages(run).at(-1);
 for(const row of weaveCases(run,stage)) for(const pair of row.pairs) {
  assert.equal(pair.before.id,pair.after.id);
  assert.equal(pair.after.caseId,row.test.id);
  assert.equal(pair.after.repetition,pair.repetition);
 }
});
test('test weave does not invent candidates for unchanged or partial sessions',()=>{
 const unchanged=readRun('absorb-climb.session.json');
 assert.deepEqual(weaveStages(unchanged),[]);
 const partial=readRun('focus-climb.session.json');
 partial.baseline=null;partial.verification=null;
 assert.deepEqual(weaveStages(partial),[]);
});
