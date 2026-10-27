import type { GymArtifact } from './session.ts';

export const sessionTime = (run: GymArtifact) => run.finishedAt ?? run.startedAt;
export const newestSessions = (reports: GymArtifact[]) => [...reports].sort((a,b) =>
 (Date.parse(sessionTime(b)) || 0) - (Date.parse(sessionTime(a)) || 0) || a.id.localeCompare(b.id));

// Editorial notes for the recorded sessions. Imported files use their own evidence below.
const notes: Record<string, {title: string; problem: string; change: string}> = {
 'focus-climb-17bb5daa-07f9-416f-8ed5-53a38054eb61': {
  title: 'Shortened focus to 242 words',
  problem: 'The skill had 948 words. The first cut still failed time-budget and task-switching checks.',
  change: 'Removed repeated explanations. Kept clear rules for the full time budget, a concrete task, and necessary calls. Rejected the first cut, then kept two better revisions.'
 },
 'absorb-regression-eac396a7-6997-4fa0-abc2-0dd660e5fade': {
  title: 'Stopped absorb from revealing answers too soon',
  problem: 'An instruction we added on purpose made the AI reveal quiz answers before the learner could try.',
  change: 'Replaced that instruction: wait for an attempt, then give feedback. Keep each practice step small when needed.'
 },
 'absorb-climb-5471989b-759f-42e1-b29b-5fb37d2974b5': {
  title: 'Checked absorb and kept it unchanged',
  problem: 'We checked whether the published skill let learners try recall before getting feedback.',
  change: 'No edit. The first tests found no mistake to repair, so we tested the same skill on new questions.'
 },
 'focus-beacd401-3296-4055-9d4a-781f31e8754c': {
  title: 'Rejected a cut that broke the time budget',
  problem: 'We wanted to shorten focus without making its advice worse.',
  change: 'Cut the skill from 948 to 157 words by removing explanations and the worked example. The new version planned 25 minutes of activity inside a 20-minute limit.'
 },
 'absorb-regression-ef19de17-8203-40a5-8ffb-b6f67b7af36d': {
  title: 'Tried the first repair for early quiz answers',
  problem: 'An instruction we added on purpose gave away the answer before the learner could respond.',
  change: 'Changed the quiz rule to wait for the learner’s answer and keep each step within the available time.'
 },
 'absorb-7cd5c629-c48e-4e05-85c4-10fde799525a': {
  title: 'Ran the first check on absorb',
  problem: 'We checked for answers shown too early, too much information, and poor feedback.',
  change: 'No edit. The original skill passed the checks.'
 }
};

export function sessionStory(run: GymArtifact, imported = false) {
 const skill = run.schemaVersion===2 ? run.suite.skillName ?? run.suite.id : run.suite.id.replace(/-regression$/, '');
 const status = ({verified:'Passed final tests',accepted:'Kept after one pass',rejected:'Not kept','not-verified':'Final test failed','no-defect':'Unchanged','no-improvement':'No change kept',error:'Stopped',cancelled:'Cancelled',running:'In progress'})[run.status];
 const note = imported ? undefined : notes[run.id];
 const candidate = run.schemaVersion===2 ? run.selected : run.candidate;
 const result = (() => {
  if(run.schemaVersion===2) {
   const before=run.verification?.baseline?.score, after=run.verification?.candidate?.score;
   if(before && after) return `Final tests: ${before.passed}/${before.total} before, ${after.passed}/${after.total} after.${run.status==='verified'?'':run.status==='not-verified'?' The change did not pass the final check.':' No final decision is recorded.'}`;
   if(run.status==='no-defect') return `${run.baseline?.score.passed ?? 0}/${run.baseline?.score.total ?? 0} first tests passed.${before?` Then ${before.passed}/${before.total} new tests passed.`:''}`;
   return run.stopReason ?? run.error ?? 'No final result is available yet.';
  }
  const passed=(results: {passed?:boolean}[]) => results.filter(r=>r.passed===true).length;
  return `${passed(run.baseline.results)}/${run.suite.cases.length} tests passed before${run.candidate?`, ${passed(run.candidate.results)}/${run.suite.cases.length} after`:''}.${['accepted','rejected','no-defect'].includes(run.status)?'':' This session is incomplete.'} One answer per question; no separate final check.`;
 })();
 return {
  skill, status, time:sessionTime(run),
  title:note?.title ?? `${skill}: ${status.toLowerCase()}`,
  problem:note?.problem ?? run.suite.description ?? 'See the questions and checks in the session record.',
  change:note?.change ?? (candidate && candidate.hash!==(run.schemaVersion===2?run.original.hash:run.baseline.hash) ? 'A revised skill was tested. Open the session to compare the instructions and each attempted change.' : 'No changed version was selected.'),
  result
 };
}
