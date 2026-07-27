import { readFileSync } from 'node:fs';
import { scoreVerse, scoreMetre } from './scorer_local.ts';
const gt = JSON.parse(readFileSync(process.argv[3],'utf8'));
const rec = JSON.parse(readFileSync(process.argv[2],'utf8'));
const lo = Number(process.argv[4]), hi = Number(process.argv[5]);
const truth = { ...gt, verses: gt.verses.map((v:any)=>({ ...v, notes: v.notes.filter((n:any)=>n.measureIndex>=lo && n.measureIndex<=hi) })) };
const vs = scoreVerse(truth as any, 1, rec.verses[0]);
const n = vs.notes;
const f=(x:number)=>(x==null?'n/a':x.toFixed(4));
const F1=(p:number,r:number)=>(p+r===0?0:2*p*r/(p+r));
console.log(`truth=${n.truthNoteCount} recognized=${n.recognizedNoteCount} matched=${n.matchedCount} missed=${n.unmatchedTruth} spurious=${n.unmatchedRecognized}`);
console.log(`  PITCH F1=${f(F1(n.pitchPrecision,n.pitchRecall))}   RHYTHM F1=${f(F1(n.rhythmPrecision,n.rhythmRecall))}`);
console.log(`  DURATION EXACT: ${n.durationExactMatches}/${n.durationExactMatches + n.durationMismatches.length} rate=${f(n.durationExactRate)} mismatches=${n.durationMismatches.length}`);
if (n.durationMismatches.length > 0) {
  for (const m of n.durationMismatches) {
    console.log(`    measure ${m.measureIndex}: truth ${m.truthId} ${m.truthDuration.numerator}/${m.truthDuration.denominator} vs recognized ${m.recognizedId} ${m.recognizedDuration.numerator}/${m.recognizedDuration.denominator}`);
  }
}
// Additive (fable-spec-e16-abstain-path, 2026-07-27, item 5): abstain-path line, appended after the existing lines above, which are unchanged.
// NOTE: the pre-existing "DURATION EXACT: X/Y" line above computes Y as
// durationExactMatches + durationMismatches.length, which predates
// abstentions and so under-counts the true note/note-pair denominator by
// durationAbstentions when any exist (it is correct, and identical to
// before, whenever durationAbstentions is 0, e.g. A1/A2). n.durationExactRate
// itself is unaffected and always correct (computed against the full
// notePairs.length in scorer_local.ts); left as-is here per the brief's
// instruction to keep existing lines byte-identical. True denominator shown below.
console.log(`  DURATION ABSTENTIONS: ${n.durationAbstentions} (true note/note-pair total = ${n.durationExactMatches + n.durationMismatches.length + n.durationAbstentions})`);
if (n.durationAbstentions > 0) {
  for (const a of n.durationAbstainedPairs) {
    console.log(`    measure ${a.measureIndex}: truth ${a.truthId} ${a.truthDuration.numerator}/${a.truthDuration.denominator} vs recognized ${a.recognizedId} null (${a.reason})`);
  }
}
// Additive (fable-spec-e16-front3a_2026-07-27, decision 6, ratified): the
// `measures` array's metre figures, appended after every pre-existing line
// above (all unchanged). Inert (all zero) when `rec.measures` is absent,
// e.g. any archived pre-Front-3a output -- proven by acceptance test A3.
const ms = scoreMetre(gt.measureDurations, rec.measures);
console.log(`  METRE: judged=${ms.metreMeasuresJudged} matched=${ms.metreMatches} accuracy=${f(ms.metreAccuracy)} abstentions=${ms.metreAbstentions}`);
