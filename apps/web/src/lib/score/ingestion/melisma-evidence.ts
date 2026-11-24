/**
 * What the print says holds a note, in one place, for the deal (`vowelless-fold.ts`) and the count (`underlay-count.ts`)
 * to read the same way (cloud-lane-88, round 2).
 *
 * THE SCOPE OF A VERSE (blocker 1). A verse is counted over the sung notes it OWNS: the base verse (the first sung verse, as
 * `verseView` takes it) over every sung note; a later verse only over the bars where it has words of its own, because
 * `verseView` shows the base verse's words in every other bar and the later verse is silent there. Counting a later verse over
 * the whole file would call every note the base verse owns "textless" and write an abstention that deletes real vowels.
 *
 * THE EVIDENCE is the existing rule, not a new one: a tie (a note tied into the one before is never a sung note,
 * `syllableTargetIds`), an extender (the parser's `extender-notes`), or a slur under the count gate (`score/slur-seat.ts`,
 * `observedTargets`). Fix 4: the extender-held notes are taken off the sung notes BEFORE the gate is taken, so a song that
 * mixes an extension line with a slur does not fail the gate for the extension line's sake. The gate's formula is unchanged.
 *
 * Pure, and a leaf of the pipeline: it imports only `../sung-notes` and the score-parser package.
 */
import { sungVerseNumbers, type ParsedScore, type VocalLineEvent } from '@ilya/score-parser';
import { slurContinuationIds, syllableTargetIds } from '../sung-notes';

export type SlurGate = 'none' | 'passed' | 'failed';

export interface Evidence {
	/** The sung notes this verse owns. */
	scope: string[];
	gate: SlurGate;
	/** Scope notes the print holds: under an extender, or a slur continuation when the gate passed. */
	held: Set<string>;
}

/** Whether a note carries words of this verse. */
export function hasVerse(ev: VocalLineEvent, verse: number): boolean {
	const syl = ev.syllable;
	if (!syl) return false;
	if (syl.versesInfo && syl.versesInfo.length > 0) return syl.versesInfo.some((v) => v.verseNumber === verse);
	return syl.verseNumber === verse;
}

/** The sung notes the verse owns: all of them for the base verse, else those in the bars where the verse has words. */
export function scopeOf(score: ParsedScore, verse: number): string[] {
	const sung = syllableTargetIds(score.vocalLine);
	const base = sungVerseNumbers(score)[0] ?? 1;
	if (verse === base) return sung;
	const bars = new Set(score.vocalLine.filter((ev) => hasVerse(ev, verse)).map((ev) => ev.measureIndex));
	const barOf = new Map(score.vocalLine.map((ev) => [ev.id, ev.measureIndex] as const));
	return sung.filter((id) => bars.has(barOf.get(id) ?? -1));
}

/** The evidence over a verse's scope, given the syllables the verse comes to. */
export function evidenceFor(events: readonly VocalLineEvent[], scope: readonly string[], syllables: number, extenderIds: ReadonlySet<string>): Evidence {
	const extenderHeld = scope.filter((id) => extenderIds.has(id));
	const rest = scope.filter((id) => !extenderIds.has(id));
	const continuations = slurContinuationIds(events);
	const observed = rest.filter((id) => continuations.has(id));
	const gate: SlurGate = observed.length === 0 ? 'none' : syllables === rest.length - observed.length ? 'passed' : 'failed';
	return { scope: [...scope], gate, held: new Set([...extenderHeld, ...(gate === 'passed' ? observed : [])]) };
}
