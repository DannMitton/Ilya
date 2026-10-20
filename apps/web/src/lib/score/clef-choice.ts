/**
 * The clef a line is drawn in, and the octave it is read at, from the song's
 * stored octave choice (QUEUE row 127; Dann 2026-10-19 22:49 and 22:50).
 *
 * A line printed in treble that the singer's range asks to read an octave lower
 * is drawn in the TREBLE CLEF WITH AN 8 BELOW at the print's own heads (the
 * sounding pitches sit where the print puts them under `treble-8vb`, so nothing
 * is shifted in Markup). The singer can choose bass instead, and the heads move to
 * their bass-clef places, or as written, which is today's "As written".
 *
 * PURE, and given the UNSHIFTED score: the source clef is read off `parsed`, never
 * off the shifted reading, whose clef list `shiftVocalOctave` clears.
 */
import { clefFromSource, resolveVocalReadingOctave, type ParsedScore, type Pitch, type RenderClef } from '@ilya/score-parser';
import type { OctaveReading } from '$lib/library/types';

/** What the Clef select offers, and the stored value each stands for (`null` is "for your range"). */
export type ClefChoice = 'ottava' | 'bass' | 'as-written';

export const clefChoiceOf = (reading: OctaveReading | null): ClefChoice => (reading === 'as-written' ? 'as-written' : reading === 'bass' ? 'bass' : 'ottava');
export const readingOf = (choice: ClefChoice): OctaveReading | null => (choice === 'as-written' ? 'as-written' : choice === 'bass' ? 'bass' : null);

export interface ClefReading {
	/** The octave shift the line is read at: what the range asks for, or 0 as written. */
	shift: number;
	/** What the range asks for, whatever is applied. */
	suggestedShift: number;
	/** The clef to draw in; null outside the printed-treble case, where the score's own clef rule stands. */
	clef: RenderClef | null;
	/** True exactly where a downward reading applies to a line printed in treble: the Clef row's condition. */
	shown: boolean;
}

export function readingClef(
	parsed: ParsedScore | null | undefined,
	range: { lowest: Pitch; highest: Pitch } | undefined,
	reading: OctaveReading | null,
): ClefReading {
	if (!parsed) return { shift: 0, suggestedShift: 0, clef: null, shown: false };
	const suggestedShift = resolveVocalReadingOctave(parsed, range);
	const sourceClef = parsed.clefs?.[0] ? clefFromSource(parsed.clefs[0].clef) : null;
	if (suggestedShift < 0 && sourceClef === 'treble') {
		if (reading === 'as-written') return { shift: 0, suggestedShift, clef: 'treble', shown: true };
		return { shift: -1, suggestedShift, clef: reading === 'bass' ? 'bass' : 'treble-8vb', shown: true };
	}
	// Outside that case `'bass'` is inert, and `'as-written'` turns a reading off, as before.
	const shift = reading === 'as-written' ? 0 : suggestedShift;
	return { shift, suggestedShift, clef: null, shown: false };
}
