import { parseReport, type GymCase, type GymVersion, type GymReport } from './report.ts';
export interface Sample { id: string; caseId: string; repetition: number; response: string; elapsedMs: number; passed: boolean; checks: {criterion: string; pass: boolean; reason: string}[] }
export interface Evaluation extends Omit<GymVersion, 'results'> { samples: Sample[]; score: {passed: number; total: number; rate: number; byCase: Record<string, {passed: number; total: number}>; interval: [number, number]} }
export interface ClimbSession {
 schemaVersion: 2; kind: 'hill-climb'; id: string; startedAt: string; finishedAt?: string;
 status: 'running' | 'verified' | 'not-verified' | 'no-improvement' | 'no-defect' | 'error' | 'cancelled';
 strategy: 'repair' | 'ablate'; suiteHash: string;
 suite: {id: string; skillName?: string; title?: string; description?: string; sourceUrl?: string; seededDefect?: string; cases: GymCase[]};
 runner: {name: string; version: string; model: string; judge: string};
 config: {repetitions: number; maxRounds: number; maxCalls: number}; calls: number;
 original: Omit<GymVersion, 'results'>; baseline: Evaluation | null; selected: Evaluation | null;
 rounds: {index: number; parentHash: string; status: string; candidate: (Omit<GymVersion, 'results'> & {samples?: Sample[]; score?: Evaluation['score']; rationale: string}) | null; decision: GymReport['decision']}[];
 verification: {baseline: Evaluation | null; candidate: Evaluation | null; decision: GymReport['decision']} | null;
 limitation: string; error?: string; stopReason?: string;
}
export type GymArtifact = GymReport | ClimbSession;
export function parseArtifact(value: unknown): GymArtifact {
 const schema=(value as {schemaVersion?: number})?.schemaVersion;
 if(schema===1) return parseReport(value);
 if(schema!==2) throw new Error('Choose a schemaVersion 1 or 2 JSON report from loooom gym.');
 return parseSession(value);
}
export function parseSession(value: unknown): ClimbSession {
 function fail(): never { throw new Error('This file is not a valid hill-climb report. Export a schemaVersion 2 report from loooom gym climb.'); }
 const obj = (x: unknown): Record<string, unknown> => x && typeof x === 'object' && !Array.isArray(x) ? x as Record<string, unknown> : fail();
 const str = (x: unknown) => typeof x === 'string' && x.length > 0;
 const integer = (x: unknown) => Number.isInteger(x) && Number(x) >= 0;
 const r = obj(value), config = obj(r.config), runner = obj(r.runner), suite = obj(r.suite);
 if (r.schemaVersion !== 2 || r.kind !== 'hill-climb' || !['running','verified','not-verified','no-improvement','no-defect','error','cancelled'].includes(String(r.status))) fail();
 if (!integer(config.repetitions) || Number(config.repetitions) < 1 || Number(config.repetitions) > 10 || !integer(config.maxRounds) || Number(config.maxRounds) < 1 || Number(config.maxRounds) > 10 || !integer(config.maxCalls) || !integer(r.calls) || Number(r.calls) > Number(config.maxCalls)) fail();
 if (!Array.isArray(r.rounds) || r.rounds.length > Number(config.maxRounds)) fail();
 // Reuse the v1 validator for the shared suite, version, decision and check fields.
 if (suite.sourceUrl !== undefined && (typeof suite.sourceUrl !== 'string' || !suite.sourceUrl.startsWith('https://github.com/'))) fail();
 const shared = {schemaVersion:1,id:r.id,startedAt:r.startedAt,status:'running',strategy:r.strategy,suiteHash:r.suiteHash,suite:{...suite,title:suite.title??suite.id,description:suite.description??'Local skill experiment.',sourceUrl:suite.sourceUrl??'https://github.com/mager/loooom'},runner:{...runner,repetitions:config.repetitions},limitation:r.limitation,candidate:null,decision:null};
 const validateVersion = (v: unknown) => { const data=obj(v); parseReport({...shared,baseline:{...data,results:[]}}); return data; };
 validateVersion(r.original);
 const cases = suite.cases as GymCase[];
 const evaluation = (v: unknown, expectedCases?: GymCase[]) => {
  const data=validateVersion(v), score=obj(data.score);
  if (!Array.isArray(data.samples) || !data.samples.length) fail();
  const seen = new Set<string>(); const counts: Record<string,{passed:number;total:number}> = {};
  for (const item of data.samples) {
   const sample=obj(item), test=cases.find(c=>c.id===sample.caseId);
   if (!test || !integer(sample.repetition) || Number(sample.repetition)<1 || Number(sample.repetition)>Number(config.repetitions) || sample.id!==`${sample.caseId}--r${sample.repetition}` || seen.has(String(sample.id)) || typeof sample.passed!=='boolean') fail();
   seen.add(String(sample.id));
   parseReport({...shared,baseline:{...data,results:[{...sample,id:sample.caseId}]}});
   const count=counts[String(sample.caseId)] ??= {passed:0,total:0}; count.total++; if(sample.passed) count.passed++;
  }
  const included=expectedCases??cases.filter(c=>counts[c.id]);
  if (included.length!==Object.keys(counts).length || included.some(c=>counts[c.id]?.total!==config.repetitions)) fail();
  const passed=Object.values(counts).reduce((sum,c)=>sum+c.passed,0), total=data.samples.length;
  if (score.passed!==passed || score.total!==total || score.rate!==passed/total) fail();
  const byCase=obj(score.byCase);
  if(Object.keys(byCase).length!==Object.keys(counts).length) fail();
  for(const [id,count] of Object.entries(counts)) { const saved=obj(byCase[id]); if(saved.passed!==count.passed || saved.total!==count.total) fail(); }
  if(!Array.isArray(score.interval) || score.interval.length!==2 || score.interval.some(n=>typeof n!=='number'||!Number.isFinite(n)||n<0||n>1) || score.interval[0]>score.interval[1]) fail();
 };
 const decision = (d: unknown) => { parseReport({...shared,baseline:{...obj(r.original),results:[]},decision:d}); };
 const validateDecision = (before: Evaluation, after: Evaluation, d: NonNullable<GymReport['decision']>, final = false) => {
  const ids=Object.keys(before.score.byCase);
  if(ids.length!==Object.keys(after.score.byCase).length || ids.some(id=>before.score.byCase[id].total!==after.score.byCase[id]?.total)) fail();
  const regressions=ids.filter(id=>after.score.byCase[id].passed<before.score.byCase[id].passed);
  const fixed=ids.filter(id=>after.score.byCase[id].passed>before.score.byCase[id].passed);
  const accepted=!regressions.length && (r.strategy==='repair' ? after.score.passed>before.score.passed : after.words<before.words&&after.score.rate===1) && (!final || after.score.rate===1);
  if(d.accepted!==accepted || JSON.stringify(d.regressions)!==JSON.stringify(regressions) || JSON.stringify(d.fixed)!==JSON.stringify(fixed) || d.wordsRemoved!==before.words-after.words || d.reductionPercent!==Math.round((1-after.words/before.words)*100)) fail();
 };
 const train=cases.filter(c=>c.split==='train');
 if(r.baseline!==null) { evaluation(r.baseline,train); if(obj(r.baseline).hash!==obj(r.original).hash) fail(); }
 if(r.selected!==null) evaluation(r.selected,train);
 for(const [i,item] of r.rounds.entries()) {
  const round=obj(item);
  if(round.index!==i+1 || !/^[a-f0-9]{64}$/.test(String(round.parentHash)) || !['proposing','evaluating','duplicate','accepted','rejected'].includes(String(round.status))) fail();
  if(round.candidate!==null) { const c=validateVersion(round.candidate); if(!str(c.rationale)) fail(); if(c.samples!==undefined) evaluation(c,train); }
  if(round.decision!==null) decision(round.decision);
  if(['accepted','rejected'].includes(String(round.status)) && (!obj(round.candidate).samples || !round.decision || obj(round.decision).accepted!==(round.status==='accepted'))) fail();
 }
 if(r.verification!==null) { const v=obj(r.verification); if(v.baseline!==null) evaluation(v.baseline); if(v.candidate!==null) evaluation(v.candidate,cases); if(v.decision!==null) decision(v.decision); }
 if(r.error!==undefined&&!str(r.error)) fail();
 if(r.stopReason!==undefined&&!str(r.stopReason)) fail();
 if(r.finishedAt!==undefined && !Number.isFinite(Date.parse(String(r.finishedAt)))) fail();
 const session=value as ClimbSession;
 let incumbent=session.baseline;
 for(const round of session.rounds) {
  if(!incumbent || round.parentHash!==incumbent.hash) fail();
  if(round.decision && round.candidate?.score) {
   validateDecision(incumbent,round.candidate as Evaluation,round.decision);
   if(round.decision.accepted) incumbent=round.candidate as Evaluation;
  }
 }
 if(session.selected && session.selected.hash!==incumbent?.hash) fail();
 if(session.selected && session.selected.hash!==session.original.hash && !session.rounds.some(round=>round.status==='accepted'&&round.candidate?.hash===session.selected?.hash)) fail();
 if(['verified','not-verified','no-defect','no-improvement'].includes(session.status)) {
  if(!session.finishedAt || !session.baseline || !session.selected || !session.verification?.baseline) fail();
  if(['verified','not-verified'].includes(session.status)) {
   const v=session.verification;
   if(!v.baseline||!v.candidate||!v.decision||v.candidate.hash!==session.selected.hash||v.baseline.hash!==session.original.hash||v.baseline.samples.length!==cases.length*session.config.repetitions) fail();
   validateDecision(v.baseline,v.candidate,v.decision,true);
   if((session.status==='verified')!==v.decision.accepted) fail();
   if(session.status==='verified'&&(v.candidate.score.rate!==1||v.decision.regressions.length>0)) fail();
  } else if(session.selected.hash!==session.original.hash || session.verification.candidate!==null || session.verification.decision!==null) fail();
 }
 return session;
}
