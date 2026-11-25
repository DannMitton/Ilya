/**
 * Item 1 of the arrival seam (cloud-lane-88): the print's own mark for a held note, `<extend>`, read in any MusicXML file.
 * Kept out of `musicxml-parser.ts` so that file stays under its ratchet ceiling.
 *
 * THE SPAN IS ADOPTED from `apps/web/src/lib/omr/extend-convention.ts` (`extenderMelismaIds`) rather than redrawn: every sung
 * note after a note whose lyric carries a starting or continuing `<extend>`, up to the next note that carries a syllable, never
 * across a rest, and a note tied into the one before is left out (a tie already makes it a continuation). The note that carries
 * the lyric is not itself in the span.
 */
import type { ParseWarning, VocalLineEvent } from './types';

/** Whether an `<extend>`'s `type` keeps a line going: absent (MusicXML's default is start), `start`, or `continue`. */
export const extendHoldsLine = (type: string | null): boolean => type === null || type === 'start' || type === 'continue';

/** The `extender-notes` warning for the notes the print's extenders sustain; none where there are none. `starts` are the events whose lyric holds a line. */
export function extenderNotes(vocalLine: readonly VocalLineEvent[], starts: ReadonlySet<string>): ParseWarning[] {
	const eventIds: string[] = [];
	let sustaining = false;
	for (const ev of vocalLine) {
		if (ev.type === 'rest') sustaining = false;
		else if (ev.syllable) sustaining = starts.has(ev.id);
		else if (sustaining && ev.tied?.type !== 'stop' && ev.tied?.type !== 'continue') eventIds.push(ev.id);
	}
	return eventIds.length === 0 ? [] : [{ code: 'extender-notes', message: `A printed extender sustains ${eventIds.length} note(s).`, eventIds }];
}
