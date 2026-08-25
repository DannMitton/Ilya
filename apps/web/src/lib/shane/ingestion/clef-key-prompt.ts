/**
 * clef-key-prompt.ts — what the intake prompt pre-fills from, N.97.
 *
 * The reader now reads the clef glyph and the run of sharps or flats beside it,
 * and the prompt asks the singer to CONFIRM that rather than to answer blind.
 * The rule that turns a glyph into a pre-selected option is here rather than in
 * `ScoreUploader.svelte`, on this project's own standing discipline: vitest
 * never compiles a `.svelte` file, so logic that needs testing does not belong
 * in one.
 *
 * A READING THE PROMPT CANNOT OFFER IS TREATED AS NO READING AT ALL. The clef
 * control is three-way, treble, treble sounding an octave lower, and bass, and
 * the reader can also match a C clef. A page that prints one falls back to the
 * ask rather than pre-selecting a clef nobody read. So does a key signature
 * that abstained. Half a confirmation would put copy on the screen saying Ilya
 * read two things while one of them is a default.
 */

import type { ClefKeyProbe } from '../engine/page-reader';

/** The two controls' values: an index into CLEF_CHOICES, and a fifths count. */
export interface ClefKeyPrefill {
	clefChoice: number;
	fifths: number;
}

/**
 * Indices into `ScoreUploader`'s `CLEF_CHOICES`, which is the order the options
 * are offered in and is not this module's to change:
 *   0  treble
 *   1  treble, sounding an octave lower
 *   2  bass
 *
 * THE 8-BEARING GLYPH IS THE ONLY THING THAT PRE-SELECTS THE OCTAVE-DOWN
 * TREBLE. A plain G clef on paper does not establish sounding octave: a tenor
 * line prints one and sounds an octave lower, and only some editions print the
 * small 8. This corpus proves the point rather than assuming it. Sunless 6 is
 * engraved with `octaveChange` -1 in its own fixture configuration and its
 * pages print a PLAIN G clef, so a reader that inferred the octave from the
 * glyph would be wrong on every system of it. The glyph is reported; the octave
 * stays the singer's answer.
 */
const CLEF_CHOICE_FOR_GLYPH: Record<string, number> = {
	gClef: 0,
	gClef8vb: 1,
	fClef: 2
};

/** The fifths the prompt offers, -7 through 7, flats first. */
const MIN_FIFTHS = -7;
const MAX_FIFTHS = 7;

/**
 * The two control values to pre-select from a probe, or null to ask instead.
 *
 * Null on every one of: no probe at all, a clef the systems disagreed on, a
 * clef the prompt does not offer, a key signature that abstained, and a fifths
 * count outside what the prompt lists. Each of those is an honest "the reader
 * did not settle this", and the caller shows the original ask wording for all
 * of them.
 */
export function prefillFrom(probe: ClefKeyProbe | null | undefined): ClefKeyPrefill | null {
	if (!probe) return null;
	if (probe.glyph === null || probe.fifths === null) return null;
	const clefChoice = CLEF_CHOICE_FOR_GLYPH[probe.glyph];
	if (clefChoice === undefined) return null;
	if (!Number.isInteger(probe.fifths)) return null;
	if (probe.fifths < MIN_FIFTHS || probe.fifths > MAX_FIFTHS) return null;
	return { clefChoice, fifths: probe.fifths };
}
