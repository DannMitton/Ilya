/**
 * THE COUNT, and the melisma evidence (item 3 of the arrival seam, cloud-lane-88; brief r5 "Then one count decides the rest").
 *
 * After `foldVowelessSyllables` has dealt a Cyrillic verse, this counts syllables against sung notes, per verse.
 *
 * - EQUAL: seat, one vowel per note. Nothing to say.
 * - A SURPLUS NOTE IS A MELISMA ONLY WHERE THE PRINT SAYS SO: by a tie (`syllableTargetIds` already leaves a note tied into the
 *   one before out of the sung notes), by an extension line (the `extender-notes` warning, item 1), or by a slur under the count
 *   gate (`score/slur-seat.ts`, `observedTargets`). ILYA INVENTS NO MELISMA.
 * - ANYTHING LEFT OVER, in either direction, is DAMAGE. Ilya invents no syllable and no melisma to cover it. It counts the place
 *   and hands it on (`ingest.ts` records it, item 4, and Corrections tells the singer, slice 6R of `plan-corrections-build_r2`).
 *
 * THE SLUR GATE is the existing one, with the verse's own syllable count in the place of the poem's slot count: where the slur
 * continuations among the sung notes, taken off the sung notes, make the syllables come out even, each continuation is evidence;
 * otherwise a slur is a phrasing mark and is not read as a melisma. On an MNX file there are NO SLURS (`types.ts`, `SlurEnd`:
 * "MusicXML only"), so the evidence there is tie and extender only. `slursRead` says which, so a slur count of zero is never
 * mistaken for agreement.
 *
 * Pure. Reads the score the fold returned, never the file.
 */
import type { ParsedScore } from '@ilya/score-parser';
import { hasVerse, type SlurGate } from './melisma-evidence';
import type { Place, VerseRedeal, VowellessFold } from './vowelless-fold';

export type { SlurGate };

export interface VerseCount {
	verse: number;
	/** Sung notes that may begin a syllable: notes, not rests, and not a note tied into the one before it. */
	sung: number;
	/** Syllables after the deal. */
	syllables: number;
	/** Sung notes with no text in this verse that the print holds, by extender or by a slur under the gate. */
	evidenced: string[];
	/** Sung notes with no text in this verse and no evidence: they read as a melisma to every reader and the print did not say so. */
	unexplained: string[];
	/** Whether the syllables and the sung notes less the evidenced ones come out even. */
	agrees: boolean;
	/** `none`: the file carries no slur to read (an MNX file, or a MusicXML file with none). */
	slurGate: SlurGate;
	/** The deal's own leftover, carried through so one record holds the verse. */
	vacated: Place[];
	overflow: Place[];
	orphans: Place[];
	undivided: Place[];
	/** Marks alone and tokens with no Cyrillic letter, left on their own notes: counted, never read as syllables. */
	pinned: Place[];
	divided: number;
}

export interface UnderlayCount {
	verses: VerseCount[];
	/** True where any event carries a printed slur end: false on an MNX file, so zero slurs there is not agreement. */
	slursRead: boolean;
	/** True where any verse is damaged: counts disagree, or text has no note, or a note has no text. */
	damaged: boolean;
}

/** The count over the fold's own result: `fold.score` is the dealt score. The evidence (a printed extender, a tie, a slur under the gate) was read by the deal. */
export function countUnderlay(fold: VowellessFold): UnderlayCount {
	const events = fold.score.vocalLine;
	const byId = new Map(events.map((e) => [e.id, e] as const));
	const slursRead = events.some((ev) => (ev.slurs?.length ?? 0) > 0);
	const verses: VerseCount[] = fold.verses.map((r: VerseRedeal) => {
		// The scope, the gate, and the held notes are the deal's own (`melisma-evidence.ts`): the verse is counted over the notes it owns.
		const { scope, held, gate } = r.evidence;
		const textless = scope.filter((id) => !hasVerse(byId.get(id)!, r.verse));
		const evidenced = textless.filter((id) => held.has(id));
		const unexplained = textless.filter((id) => !held.has(id));
		return {
			verse: r.verse,
			sung: scope.length,
			syllables: r.syllables,
			evidenced,
			unexplained,
			agrees: r.syllables === scope.length - evidenced.length,
			slurGate: gate,
			vacated: r.vacated,
			overflow: r.overflow,
			orphans: r.orphans,
			undivided: r.undivided,
			pinned: r.pinned,
			divided: r.divided,
		};
	});
	const damaged = verses.some((v) => !v.agrees || v.vacated.length > 0 || v.overflow.length > 0 || v.orphans.length > 0 || v.undivided.length > 0 || v.pinned.length > 0);
	return { verses, slursRead, damaged };
}
