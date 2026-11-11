/**
 * Which kind of note a `<note>` element is, for the notes that take no syllable (row 181 B0g, step 2).
 *
 * `isGrace`, `isChordTone`, `isCue`, and `voiceOf` read the text of one `<note>` element and nothing else. They are the
 * tests `metre-witness.ts` (`barFacts`) has always made for the bar's sum, in one place, so the metre read and the underlay
 * cannot disagree about what a grace note, a chord tone, or a cue note is (`note-kinds.test.ts` holds the two lists equal).
 *
 * WHAT TAKES NO SYLLABLE (`skipOf`): a grace note (Dann 2026-11-05 00:19, `OPEN.md`, "A GRACE NOTE TAKES NO SYLLABLE BY DEFAULT")
 * and a chord tone, the later note of a chord (DESK DEFAULT in the same section). A cue note and a note in voice 2 or later are
 * DETECTED (`wouldSkipOf`) and counted, not skipped, in this build (DESK DEFAULT; Fable's review of the r1 brief, amendment 6):
 * the score parser keeps both as ordinary events and the poem join's `buildRuns` (`text/poem-join-wire.ts`) would fill an empty
 * one from the poem, so skipping them in the scan's seating alone would make the two paths disagree. N.191 and the join must read
 * `skip` before they join it.
 *
 * Pure.
 */

/** The notes of a part that sing no syllable of the voice's own: the first of these that applies, grace before chord. */
export type SkipKind = 'grace' | 'chord';

/** What would be skipped and is not, in this build. */
export type WouldSkipKind = 'cue' | 'voice2';

/** A grace note: `<grace/>` (the element, not a longer name such as `<graceful>`). */
export const isGrace = (note: string): boolean => /<grace[\s/>]/.test(note);

/** A chord tone: `<chord/>`, which marks every note of a chord after the first. */
export const isChordTone = (note: string): boolean => /<chord[\s/>]/.test(note);

/** A cue note: `<cue/>`. */
export const isCue = (note: string): boolean => /<cue[\s/>]/.test(note);

/** The note's `<voice>` number; 1 where it has none (MusicXML's default is the part's first voice). */
export function voiceOf(note: string): number {
	const m = /<voice>\s*(\d+)\s*<\/voice>/.exec(note);
	return m ? Number(m[1]) : 1;
}

/** The kind that takes the note out of the seated notes, or undefined. */
export function skipOf(note: string): SkipKind | undefined {
	if (isGrace(note)) return 'grace';
	if (isChordTone(note)) return 'chord';
	return undefined;
}

/** What would take the note out in a later build, for a note that is not skipped now: a cue note, then voice 2 or later. */
export function wouldSkipOf(note: string): WouldSkipKind | undefined {
	if (isCue(note)) return 'cue';
	if (voiceOf(note) >= 2) return 'voice2';
	return undefined;
}
