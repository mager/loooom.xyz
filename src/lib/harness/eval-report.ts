export type ContextResult = {output:string;passed:boolean;assertions:{type:string;passed:boolean;value?:unknown}[]};
export type ContextReport = {schemaVersion:1;status:string;evidence:{mode:'replay'|'live';synthetic:boolean;label:string};context:{sha256:string};suite:{sha256:string;definition:{name:string;cases:{id:string}[]}};results:{caseId:string;prompt:string;baseline:ContextResult|null;context:ContextResult|null}[]};
export function parseContextReport(value:unknown):ContextReport {
 const fail=():never=>{throw new Error('Use a complete or incomplete JSON report from the Loooom context eval plugin.');};
 const obj=(v:unknown):Record<string,unknown>=>v&&typeof v==='object'&&!Array.isArray(v)?v as Record<string,unknown>:fail();
 const text=(v:unknown)=>typeof v==='string';
 const r=obj(value),e=obj(r.evidence),c=obj(r.context),s=obj(r.suite),d=obj(s.definition);
 if(r.schemaVersion!==1||!['complete','error','partial','running'].includes(String(r.status))||!['live','replay'].includes(String(e.mode))||typeof e.synthetic!=='boolean'||!text(e.label)||!text(d.name)||!Array.isArray(d.cases)||!d.cases.length||!Array.isArray(r.results)||(r.status==='complete'&&!r.results.length)||r.results.length>100||! /^[a-f0-9]{64}$/.test(String(c.sha256))||! /^[a-f0-9]{64}$/.test(String(s.sha256)))fail();
 const caseIds=new Set<string>();for(const item of d.cases as unknown[]){const id=obj(item).id;if(!text(id)||caseIds.has(String(id)))fail();caseIds.add(String(id));}
 const seen=new Set();
 for(const item of r.results as unknown[]){const result=obj(item);if(!caseIds.has(String(result.caseId))||seen.has(result.caseId)||!text(result.prompt))fail();seen.add(result.caseId);
  for(const side of [result.baseline,result.context]){if(side===null){if(r.status==='complete')fail();continue;}const v=obj(side);if(!text(v.output)||typeof v.passed!=='boolean'||!Array.isArray(v.assertions)||!v.assertions.length)fail();for(const a of v.assertions as unknown[]){const check=obj(a);if(!text(check.type)||typeof check.passed!=='boolean')fail();}if(v.passed!==(v.assertions as {passed:boolean}[]).every(a=>a.passed))fail();}
 }
 if(r.status==='complete'&&seen.size!==caseIds.size)fail();
 return value as ContextReport;
}

export async function readContextReport(file:{size:number;text:()=>Promise<string>}):Promise<ContextReport> {
 if(file.size>64*1024*1024) throw new Error('Use a report up to 64 MiB. Split a larger suite into smaller runs.');
 return parseContextReport(JSON.parse(await file.text()));
}
