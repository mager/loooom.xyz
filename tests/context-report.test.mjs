import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parseContextReport,readContextReport} from '../src/lib/harness/eval-report.ts';
const sample=()=>JSON.parse(fs.readFileSync(new URL('../plugins/context-evals/examples/report.synthetic.json',import.meta.url),'utf8'));
test('opens the actual plugin report and preserves its synthetic evidence label',()=>{const report=parseContextReport(sample());assert.equal(report.evidence.synthetic,true);assert.equal(report.results.filter(r=>r.context.passed).length,3);});
test('rejects forged pass flags and duplicate case results',()=>{const report=sample();report.results[0].baseline.passed=true;assert.throws(()=>parseContextReport(report));const duplicate=sample();duplicate.results[1]=duplicate.results[0];assert.throws(()=>parseContextReport(duplicate));});
test('rejects incomplete evidence represented as a complete run',()=>{const report=sample();report.results[0].context=null;assert.throws(()=>parseContextReport(report));});
test('rejects structurally invalid imports',()=>{for(const value of [null,[],{}, {schemaVersion:1}, {__proto__:{schemaVersion:1}}]) assert.throws(()=>parseContextReport(value));});
test('opens an interrupted checkpoint with only one saved answer',()=>{const report=sample();report.status='running';report.results=[{...report.results[0],context:null}];assert.equal(parseContextReport(report).results[0].context,null);report.results=[];assert.equal(parseContextReport(report).results.length,0);});
test('opens valid reports larger than 1 MiB and bounds oversized input before reading',async()=>{
 const report=sample();report.results[0].context.request={messages:[{role:'system',content:'x'.repeat(1_100_000)}]};
 const file=new File([JSON.stringify(report)],'report.json');assert.ok(file.size>1024*1024);
 assert.equal((await readContextReport(file)).results.length,3);
 await assert.rejects(readContextReport({size:64*1024*1024+1,text:()=>{throw new Error('must not read');}}),/64 MiB/);
});
