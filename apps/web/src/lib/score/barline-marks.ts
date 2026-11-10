/**
 * barline-marks.ts — the Barline verb, as pure data (QUEUE row 138, B3).
 *
 * ONE VERB, TWO DIRECTIONS, on the note held in the Loupe: "Add a barline after
 * this note" where the next entry is in the same bar, "Remove the barline after
 * this note" where it opens the next. The mark is written on the NEXT entry
 * (`NoteCorrection.barline`, `rebar.ts`), the entry that opens the bar, so the
 * barline does not move when the note held is deleted.
 *
 * THE LAYER DECIDES WHETHER A MARK LANDS, NOT A SECOND COPY OF ITS RULES. Each
 * candidate mark is tried through `rebar` itself and offered only if it changes
 * the bar the next entry sits in. So a removal `rebar` would refuse (a change of
 * signature, key, or clef; a repeat; a bar of the singer's own signature) is not
 * offered, for the same reason it would not be honoured: Fable's finding 9, kept
 * by construction.
 *
 * A BARLINE IS NEVER PLACED INSIDE A TUPLET GROUP (Sibelius's plug-in cannot
 * either, `docs/sessions/survey-barline-handling_r1_2026-11-09.md`): a bar divided
 * inside one would hold a group that cannot be counted. A run of entries
 * carrying one tuplet is a group's worth at a time, `actualNotes` of them.
 *
 * A note that crosses a new barline cannot happen here: a barline is only ever
 * placed BETWEEN entries. The tie across a barline (Dann 21:30) belongs to the
 * paths that place one by arithmetic or by a new time signature (A2, T2).
 */
import type { ParsedScore, VocalLineEvent } from '@ilya/score-parser';
import type { CorrectionMap } from './correction';
import { rebar } from './rebar';

export interface BarlineVerb {
	kind: 'add' | 'remove';
	/** The entry that opens (or would open) the bar: the one the mark is written on. */
	nextId: string;
	/** The corrections as they stand after the verb. */
	map: CorrectionMap;
}

/** Whether `a` and `b` are consecutive members of one tuplet group, the run read from the head of the line. */
function insideTuplet(line: readonly VocalLineEvent[], i: number): boolean {
	const a = line[i];
	const b = line[i + 1];
	const ta = a?.duration.tuplet;
	const tb = b?.duration.tuplet;
	if (!ta || !tb) return false;
	if (ta.actualNotes !== tb.actualNotes || ta.normalNotes !== tb.normalNotes || ta.normalType !== tb.normalType) return false;
	// How many of the same group's members end at `a`, counting back to a change of tuplet or of bar.
	let run = 1;
	for (let k = i - 1; k >= 0; k--) {
		const t = line[k].duration.tuplet;
		if (!t || t.actualNotes !== ta.actualNotes || t.normalNotes !== ta.normalNotes || t.normalType !== ta.normalType) break;
		run++;
	}
	return run % ta.actualNotes !== 0;
}

/** The record with its `barline` set, or removed where `value` is undefined; a record left saying nothing is dropped. */
export function withBarline(map: CorrectionMap, id: string, value: 'before' | 'none' | undefined): CorrectionMap {
	const { barline: _was, ...rest } = map[id] ?? {};
	const next = value === undefined ? rest : { ...rest, barline: value };
	if (!Object.values(next).some((v) => v !== undefined)) {
		const { [id]: _gone, ...others } = map;
		return others;
	}
	return { ...map, [id]: next };
}

/**
 * The verb the held entry offers, with the corrections it would write, or null
 * where it offers none (the last entry of the song, inside a tuplet group, a
 * removal the layer would not honour).
 *
 * `read` is the ingested score, `line` the corrected line BEFORE the layer.
 */
export function barlineVerb(read: ParsedScore, line: VocalLineEvent[], map: CorrectionMap, id: string): BarlineVerb | null {
	const now = rebar(read, line, map).line;
	const i = now.findIndex((e) => e.id === id);
	if (i < 0 || i + 1 >= now.length) return null;
	const here = now[i];
	const next = now[i + 1];
	const joined = next.measureIndex === here.measureIndex;
	const marked = map[next.id]?.barline;
	const lands = (m: CorrectionMap): boolean => {
		const after = rebar(read, line, m).line;
		const a = after.find((e) => e.id === id);
		const b = after.find((e) => e.id === next.id);
		return !!a && !!b && (joined ? b.measureIndex > a.measureIndex : b.measureIndex === a.measureIndex);
	};
	if (joined) {
		if (insideTuplet(now, i)) return null;
		const tries = marked === 'none' ? [withBarline(map, next.id, undefined), withBarline(map, next.id, 'before')] : [withBarline(map, next.id, 'before')];
		const m = tries.find(lands);
		return m ? { kind: 'add', nextId: next.id, map: m } : null;
	}
	const tries = marked === 'before' ? [withBarline(map, next.id, undefined), withBarline(map, next.id, 'none')] : [withBarline(map, next.id, 'none')];
	const m = tries.find(lands);
	return m ? { kind: 'remove', nextId: next.id, map: m } : null;
}
