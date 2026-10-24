import { parseArtifact } from '$lib/gym/session';
export function savedGymReports() {
 const files=import.meta.glob('$lib/data/gym/*.json',{eager:true,import:'default'});
 return Object.values(files).map(parseArtifact).sort((a,b)=>b.schemaVersion-a.schemaVersion||a.suite.id.localeCompare(b.suite.id));
}
export function gymPreview() {
 const reports=savedGymReports();
 const session=reports.find(r=>r.schemaVersion===2&&r.suite.skillName==='focus');
 if(session?.schemaVersion===2) return {
  name:'focus',status:session.status,originalWords:session.original.words,selectedWords:session.selected?.words??session.original.words,
  rounds:session.rounds.map(r=>({index:r.index,words:r.candidate?.words??0,passed:r.candidate?.score?.passed??0,total:r.candidate?.score?.total??0,accepted:r.decision?.accepted??false})),
  finalPassed:session.verification?.candidate?.score.passed??null,finalTotal:session.verification?.candidate?.score.total??null
 };
 return null;
}
