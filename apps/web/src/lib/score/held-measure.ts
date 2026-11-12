/**
 * The held measure's reads for the Loupe (N.92, the carets; N.187, grace stops): moved out of `+page.svelte` unchanged, to keep that file under
 * its ratchet ceiling. `line` is the corrected line with each grace note standing in it as a stop (`lineWithGraceStops`).
 */
import type { VocalLineEvent } from '@ilya/score-parser';
import { positionsInMeasure, type Cursor } from './entry';

export interface HeldMeasure {
	/** The held measure's entries that are not rests. */
	ids: string[];
	/** The next measure that carries an entry, which bounds the loupe's window. */
	nextIds: string[];
	/**
	 * N.92, THE CARETS. The held measure's own run of places, head gap to tail gap, off the corrected line rather than the read: a
	 * hand-entered note is a place the bar can stand exactly as a read one is. The loupe draws one caret per `gap` this carries and reads
	 * every `entry` it carries as already spoken for by its own hit rectangle.
	 */
	positions: Cursor[];
}

export function heldMeasure(line: readonly VocalLineEvent[], index: number | null): HeldMeasure {
	if (index === null) return { ids: [], nextIds: [], positions: [] };
	const later = line.filter((ev) => ev.type !== 'rest' && ev.measureIndex > index);
	const first = later[0];
	return {
		ids: line.filter((ev) => ev.type !== 'rest' && ev.measureIndex === index).map((ev) => ev.id),
		nextIds: first ? later.filter((ev) => ev.measureIndex === first.measureIndex).map((ev) => ev.id) : [],
		positions: positionsInMeasure(line, index),
	};
}
