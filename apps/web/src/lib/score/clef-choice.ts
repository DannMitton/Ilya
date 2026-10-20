/**
 * The clef a line is drawn in, and the octave it is read at, from the song's
 * stored octave choice (QUEUE rows 127 and 144; Dann 2026-10-19 22:49 and 22:50,
 * 2026-10-20 03:15).
 *
 * Four choices, one table (the desk's, row 144; the stored value `null` is "for
 * your range", and `'as-written'`, `'ottava'`, `'bass'` are explicit):
 *
 * | Printed        | for your range (null)        | as written       | treble, 8 below  | bass         |
 * | treble         | today's rule (see below)     | treble, shift 0  | treble-8vb, -1   | bass, -1     |
 * | treble-8vb     | today's rule                 | treble-8vb, 0    | same as written  | bass, 0      |
 * | bass           | today's rule                 | bass, 0          | treble-8vb, 0    | same as written |
 *
 * TODAY'S RULE is row 127's: a printed-treble line the range reads lower draws
 * treble with an 8 below at shift -1; anywhere else the shift is what the range
 * asks for and the clef is the renderer's own rule (`clef: null`). For a printed
 * treble line whose range asks for no shift, the table's "treble, shift 0" is
 * that same rule: the renderer's clef rule, which is treble for a line that
 * fits the range as printed (a decision, row 144's report says so).
 *
 * PURE, and given the UNSHIFTED score: the source clef is read off `parsed`, never
 * off the shifted reading, whose clef list `shiftVocalOctave` clears.
 */
import { clefFromSource, resolveVocalReadingOctave, type ParsedScore, type Pitch, type RenderClef } from '@ilya/score-parser';
import type { OctaveReading } from '$lib/library/types';

/** What the Clef choices offer, and the stored value each stands for (`'range'` is `null`: "for your range"). */
export type ClefChoice = 'range' | 'ottava' | 'bass' | 'as-written';

export const clefChoiceOf = (reading: OctaveReading | null): ClefChoice => reading ?? 'range';
export const readingOf = (choice: ClefChoice): OctaveReading | null => (choice === 'range' ? null : choice);

export interface ClefReading {
	/** The octave shift the line is read at: what the range asks for, or what the choice sets. */
	shift: number;
	/** What the range asks for, whatever is applied. */
	suggestedShift: number;
	/** The clef to draw in; null where the score's own clef rule stands. */
	clef: RenderClef | null;
	/** True where the score has a voice line: the Clef row, the chip, and the clef button show. */
	shown: boolean;
}

type Range = { lowest: Pitch; highest: Pitch } | undefined;

const sourceClefOf = (parsed: ParsedScore): RenderClef | null => (parsed.clefs?.[0] ? clefFromSource(parsed.clefs[0].clef) : null);

export function readingClef(parsed: ParsedScore | null | undefined, range: Range, reading: OctaveReading | null): ClefReading {
	if (!parsed) return { shift: 0, suggestedShift: 0, clef: null, shown: false };
	const suggestedShift = resolveVocalReadingOctave(parsed, range);
	const source = sourceClefOf(parsed);
	const shown = parsed.vocalLine.length > 0;
	const todays = (): ClefReading => {
		if (suggestedShift < 0 && source === 'treble') return { shift: -1, suggestedShift, clef: 'treble-8vb', shown };
		return { shift: suggestedShift, suggestedShift, clef: null, shown };
	};
	// A clef the score draws in none of the three (a C clef) has only "as written" and the range's own rule.
	if (reading === null || source === null) return reading === 'as-written' ? { shift: 0, suggestedShift, clef: null, shown } : todays();
	if (reading === 'as-written') return { shift: 0, suggestedShift, clef: source, shown };
	if (reading === 'ottava') return { shift: source === 'treble' ? -1 : 0, suggestedShift, clef: 'treble-8vb', shown };
	return { shift: source === 'treble' ? -1 : 0, suggestedShift, clef: 'bass', shown };
}

export interface ClefOptions {
	/** The choices to offer, in menu order. */
	options: ClefChoice[];
	/** The option that is in force: always one of `options`. */
	current: ClefChoice;
}

/**
 * The choices the Clef row and the menu offer. Where two choices draw the same
 * thing, one is offered, "As written" (the desk's default, row 144). "Read for
 * your range" is offered when the stored value is not `null`, and when `null`'s own
 * drawing matches none of the others (so the select can say what is in force).
 */
export function clefOptions(parsed: ParsedScore | null | undefined, range: Range, stored: OctaveReading | null): ClefOptions {
	if (!parsed) return { options: ['as-written'], current: 'as-written' };
	const source = sourceClefOf(parsed);
	const drawing = (r: OctaveReading | null): string => {
		const d = readingClef(parsed, range, r);
		return `${d.shift}|${d.clef ?? (d.shift === 0 ? source : null)}`;
	};
	const candidates: OctaveReading[] = source === null ? ['as-written'] : ['ottava', 'bass', 'as-written'];
	// Equal drawings collapse onto "As written", else onto the first of them.
	const kept = candidates.filter((c) => c === 'as-written' || !candidates.some((o) => o !== c && drawing(o) === drawing(c) && (o === 'as-written' || candidates.indexOf(o) < candidates.indexOf(c))));
	const equivalent = (r: OctaveReading | null): ClefChoice | null => kept.find((k) => drawing(k) === drawing(r)) ?? null;
	const inForce = equivalent(stored) ?? 'range';
	const options: ClefChoice[] = [...(stored !== null || inForce === 'range' ? (['range'] as const) : []), ...kept];
	return { options, current: inForce };
}
