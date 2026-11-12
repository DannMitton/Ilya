/**
 * The grace note verbs (N.187): the pure writes behind the Grace note cell, the `/` key, and the Slash cell. Each takes the
 * map and returns the next one; the wiring, the undo sentence, and the selection are `correction-verbs.svelte.ts`'s.
 *
 * Finale's handling is the model (ruling 2026-10-18, N.187): a grace note is an ordinary note with a flag that is toggled,
 * so the verbs are the ordinary note verbs plus these.
 */
import type { GraceNote, Pitch } from '@ilya/score-parser';
import { withCorrection, type CorrectionMap } from './correction';
import { nextEnteredId } from './entry';

/** Whether an id names a grace note in the corrected grace list. */
export const isGraceId = (graces: readonly GraceNote[] | undefined, id: string | null): boolean => !!id && !!graces?.some((g) => g.id === id);

/**
 * The Grace note cell and `;` on a taken entry: a full note becomes a grace note of its own value; a grace note becomes a full note
 * again (a read grace note by `grace: 'none'`; a hand-added or converted one by dropping the mark, so the entry or the note stands as it is).
 */
export function toggleGrace(map: CorrectionMap, id: string, isGrace: boolean, readIds: ReadonlySet<string>): CorrectionMap {
	if (!isGrace) return withCorrection(map, id, { grace: { slash: true } });
	return withCorrection(map, id, { grace: readIds.has(id) ? 'none' : undefined });
}

/**
 * A grace note added immediately before the next entry: an entered record anchored on the entry that precedes it in the selection
 * order (so it stands after any grace notes already there and before the one taken), at `pitch`, an eighth, slashed.
 */
export function addGrace(map: CorrectionMap, anchor: string | null, pitch: Pitch): { map: CorrectionMap; id: string } {
	const id = nextEnteredId(map);
	return { id, map: withCorrection(map, id, { entered: { after: anchor }, grace: { slash: true }, pitch, base: 'eighth' }) };
}

/** The Slash cell: the stroke through a lone grace note's flag, on or off. `drawn` is what is drawn now (a scan's undefined draws slashed). */
export function toggleSlash(map: CorrectionMap, id: string, drawn: boolean): CorrectionMap {
	return withCorrection(map, id, { grace: { slash: !drawn } });
}
