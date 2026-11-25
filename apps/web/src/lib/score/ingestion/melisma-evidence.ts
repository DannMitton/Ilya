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

/**
 * The sung notes the verse owns, which is the notes of the bars the verse SHOWS (round 3, fix A). A later verse shows the bars
 * where it has words of its own. The base verse shows every bar except one that carries words only on a later verse's line
 * (a second ending lettered as verse 2): `verseView` shows the base verse's words in a bar only where no later verse has words
 * and the base has none, or where the base has its own. Counting the base verse over a bar it does not show would call every note
 * there textless, and a slurred melisma on a later verse's line would fail the base verse's gate.
 */
export function scopeOf(score: ParsedScore, verse: number): string[] {
	const sung = syllableTargetIds(score.vocalLine);
	const verses = sungVerseNumbers(score);
	const base = verses[0] ?? 1;
	const withWords = new Map<number, Set<number>>();
	for (const ev of score.vocalLine) {
		for (const v of verses) {
			if (!hasVerse(ev, v)) continue;
			const set = withWords.get(ev.measureIndex) ?? new Set<number>();
			set.add(v);
			withWords.set(ev.measureIndex, set);
		}
	}
	const barOf = new Map(score.vocalLine.map((ev) => [ev.id, ev.measureIndex] as const));
	const shows = (bar: number): boolean => {
		const set = withWords.get(bar);
		return verse === base ? !set || set.has(base) : !!set && set.has(verse);
	};
	return sung.filter((id) => shows(barOf.get(id) ?? -1));
}

/**
 * The evidence over a verse's scope, given the syllables the verse comes to. `pinned` are the notes the deal left on their own
 * (a mark alone, a token with no Cyrillic letter): a note that sings nothing was never a candidate, so it comes off the scope
 * before the gate is taken, as the extender-held notes do (round 3, DESK DEFAULT). They stay counted as damage elsewhere.
 */
export function evidenceFor(events: readonly VocalLineEvent[], scope: readonly string[], syllables: number, extenderIds: ReadonlySet<string>, pinned: ReadonlySet<string> = new Set()): Evidence {
	const candidates = scope.filter((id) => !pinned.has(id));
	const extenderHeld = candidates.filter((id) => extenderIds.has(id));
	const rest = candidates.filter((id) => !extenderIds.has(id));
	const continuations = slurContinuationIds(events);
	const observed = rest.filter((id) => continuations.has(id));
	const gate: SlurGate = observed.length === 0 ? 'none' : syllables === rest.length - observed.length ? 'passed' : 'failed';
	return { scope: candidates, gate, held: new Set([...extenderHeld, ...(gate === 'passed' ? observed : [])]) };
}
