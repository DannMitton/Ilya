/**
 * entry-marks.ts — a note entered at the head caret of a bar the singer made (QUEUE row 138, B5; Fable's finding 11 and amendment 11).
 *
 * THE CASE. A note entered at the head caret of bar k is anchored to the last entry of bar k − 1 and names bar k (`entry.ts`,
 * `enterEntry`; `correction.ts`, `NoteCorrection.entered`). Where bar k was made by a `barline: 'before'` mark, k − 1 and k are halves of ONE reading
 * bar, so the anchor's own bar is the bar before the barline and the new note would land there, in the wrong half. The mark that opens the bar
 * belongs on the entry that now opens it: this moves `barline: 'before'` and the singer's `timeSignature` from the old first entry to the new one,
 * so the new note is the first of the bar and the old first entry is the second.
 *
 * `entered.measureIndex` is written in READING bars (through `BarMap.toReading`), the coordinate `applyCorrections` and `reflowOnsets` read it in;
 * with no mark on the song the two are equal, and every stored record reads as it always did.
 */
import type { VocalLineEvent } from '@ilya/score-parser';
import type { CorrectionMap, NoteCorrection } from './correction';

/**
 * The corrections after the entry `newId`, just written at the gap `c`, takes over the marks that open the bar the gap is the head of. `line` is
 * the corrected line in SONG bars. Where the gap is not the head of a bar, or the bar's first entry carries no mark, the map is returned as it is.
 */
export function adoptBarMarks(
	map: CorrectionMap,
	line: readonly VocalLineEvent[],
	c: { after: string | null; measureIndex?: number },
	newId: string,
): CorrectionMap {
	if (c.measureIndex === undefined) return map;
	const at = line.findIndex((e) => e.measureIndex === c.measureIndex);
	if (at < 0) return map;
	const head = c.after === (at > 0 ? line[at - 1].id : null);
	if (!head) return map;
	const first = line[at];
	const old = map[first.id];
	if (!old || (old.barline !== 'before' && !old.timeSignature)) return map;
	const moved: Pick<NoteCorrection, 'barline' | 'timeSignature'> = {
		...(old.barline === 'before' ? { barline: 'before' as const } : {}),
		...(old.timeSignature ? { timeSignature: old.timeSignature } : {}),
	};
	const { barline: _b, timeSignature: _t, ...rest } = old;
	const next: CorrectionMap = { ...map, [newId]: { ...map[newId], ...moved } };
	if (old.barline === 'none') next[first.id] = { ...rest, barline: 'none' };
	else if (Object.values(rest).some((v) => v !== undefined)) next[first.id] = rest;
	else delete next[first.id];
	return next;
}
