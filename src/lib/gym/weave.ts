import type { ClimbSession, Evaluation } from './session.ts';

export interface WeaveStage {
 id: string;
 label: string;
 outcome: string;
 words: number;
 before: Evaluation;
 after: Evaluation;
 final: boolean;
}

// Keep fresh verification separate from the training responses used to select edits.
export function weaveStages(run: ClimbSession): WeaveStage[] {
 const stages: WeaveStage[] = [];
 if (run.baseline) {
  for (const round of run.rounds) {
   if (!round.candidate?.score || !round.candidate.samples || !round.decision) continue;
   stages.push({id: String(round.index), label: `Round ${round.index}`,
    outcome: round.decision.accepted ? 'Kept' : 'Not kept', words: round.candidate.words,
    before: run.baseline, after: round.candidate as Evaluation, final: false});
  }
 }
 const final = run.verification;
 if (final?.baseline && final.candidate) {
  stages.push({id: 'final', label: 'Final check', outcome: run.status === 'verified' ? 'Passed' : run.status === 'not-verified' ? 'Not passed' : 'Pending',
   words: final.candidate.words, before: final.baseline, after: final.candidate, final: true});
 }
 return stages;
}

export function weaveCases(run: ClimbSession, stage: WeaveStage) {
 return run.suite.cases.filter(test => stage.before.samples.some(s => s.caseId === test.id) || stage.after.samples.some(s => s.caseId === test.id))
  .map(test => ({test, pairs: Array.from({length: run.config.repetitions}, (_, i) => ({
   repetition: i + 1,
   before: stage.before.samples.find(s => s.caseId === test.id && s.repetition === i + 1),
   after: stage.after.samples.find(s => s.caseId === test.id && s.repetition === i + 1)
  }))}));
}
