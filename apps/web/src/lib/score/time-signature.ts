/**
 * time-signature.ts — the time signature card's arithmetic, as pure data (QUEUE row 138, T1).
 *
 * THE MODEL IS FINALE'S, at Dann's request (2026-11-09 21:38): a change applies
 * from the bar it is made at, to the next time signature change ("to next time
 * change") or to the end of the song ("through end of piece"). The mark is a
 * `NoteCorrection.timeSignature` on the entry that opens the bar
 * (`correction.ts`, applied by `rebar.ts`), so it is one more correction: it
 * rides the map, is saved with the song, and is undone by the same Undo as every
 * other verb.
 *
 * "IN HER ORDER" NEEDS TWO WRITE-TIME RULES, because the map stores no order
 * (`docs/sessions/review-fable-tuesday-briefs_r1_2026-11-10.md`, amendment 10):
 *
 *   1. "To the end of the song" removes her own later marks, in the same step
 *      (Finale overwrites). A change she makes afterwards on a later bar bounds
 *      the earlier one, as `rebar` applies it.
 *   2. Only one mark stands in a bar: a new one replaces any other in the bar.
 *
 * Choosing the signature the reading already has, "to the next change", is the
 * way back: it writes nothing, and removes the singer's mark if there was one.
 * Setting the signature back by hand does not move barlines she placed or
 * removed (amendment 4); a barline is hers to take away.
 */
import type { ParsedScore, TimeSignature, VocalLineEvent } from '@ilya/score-parser';
import { applyCorrections, madeGrace, type CorrectionMap, type NoteCorrection } from './correction';
import { rebar } from './rebar';

export type Through = NonNullable<NoteCorrection['timeSignature']>['through'];

/** The signatures the card lists, in the order a singer looks for them. */
export const COMMON_SIGNATURES: ReadonlyArray<{ beats: number; beatType: number }> = [
	{ beats: 2, beatType: 4 },
	{ beats: 3, beatType: 4 },
	{ beats: 4, beatType: 4 },
	{ beats: 5, beatType: 4 },
	{ beats: 6, beatType: 4 },
	{ beats: 2, beatType: 2 },
	{ beats: 3, beatType: 2 },
	{ beats: 4, beatType: 2 },
	{ beats: 3, beatType: 8 },
	{ beats: 5, beatType: 8 },
	{ beats: 6, beatType: 8 },
	{ beats: 9, beatType: 8 },
	{ beats: 12, beatType: 8 },
];

/** Beat durations a time signature may have: powers of two, as `TimeSignature.beatType` requires (`types.ts:347`). */
export const BEAT_TYPES: readonly number[] = [1, 2, 4, 8, 16, 32, 64];

/** Whether the pair is a time signature a bar can be counted in. Any pair that is, may be typed. */
export function validSignature(beats: number, beatType: number): boolean {
	return Number.isInteger(beats) && beats >= 1 && beats <= 99 && BEAT_TYPES.includes(beatType);
}

/** What the card needs of the held entry's bar. */
export interface HeldBar {
	/** The song bar the held entry sits in. */
	bar: number;
	/** The entry that opens it, which carries the mark. */
	openerId: string;
	/** The signature the bar is counted in now, the singer's change included. */
	signature: TimeSignature;
	/** The reading's own signature for the bar. */
	reading: TimeSignature;
	/** The singer's own mark in this bar, if any. */
	mine?: NonNullable<NoteCorrection['timeSignature']>;
}

/** The ids of every record carrying a time signature mark, and the entry standing in for each (a deleted entry's mark passes to the next one standing). */
function ownersOf(read: ParsedScore, map: CorrectionMap): Map<string, string> {
	const out = new Map<string, string>();
	const kept: CorrectionMap = {};
	for (const [id, c] of Object.entries(map)) {
		if (c.deleted || madeGrace(c)) {
			// N.187: a note made a grace note leaves the line as a deleted one does, so its marks pass on the same way.
			const { deleted: _d, grace: _g, ...rest } = c;
			kept[id] = rest;
		} else kept[id] = c;
	}
	const full = applyCorrections(read.vocalLine, kept, read.graceNotes);
	let pending: string[] = [];
	for (const ev of full) {
		const c = map[ev.id];
		if (c?.deleted || madeGrace(c)) {
			if (c.timeSignature) pending.push(ev.id);
			continue;
		}
		if (c?.timeSignature) pending.push(ev.id);
		for (const p of pending) out.set(p, ev.id);
		pending = [];
	}
	return out;
}

/** The bar the entry sits in, the entry that opens it, and the signatures in play; null where the entry is not in the line. */
export function heldBar(read: ParsedScore, line: VocalLineEvent[], map: CorrectionMap, id: string): HeldBar | null {
	const r = rebar(read, line, map);
	const ev = r.line.find((e) => e.id === id);
	if (!ev) return null;
	const bar = ev.measureIndex;
	const opener = r.line.find((e) => e.measureIndex === bar);
	const measure = r.score.measures.find((m) => m.index === bar);
	const reading = read.measures.find((m) => m.index === r.bars.toReading(bar));
	if (!opener || !measure || !reading) return null;
	const owners = ownersOf(read, map);
	let mine: HeldBar['mine'];
	for (const [src, owner] of owners) {
		const o = r.line.find((e) => e.id === owner);
		if (o && o.measureIndex === bar) mine = map[src]?.timeSignature;
	}
	return { bar, openerId: opener.id, signature: measure.timeSignature, reading: reading.timeSignature, ...(mine ? { mine } : {}) };
}

function withoutTimeSignature(map: CorrectionMap, id: string): CorrectionMap {
	const { timeSignature: _t, ...rest } = map[id] ?? {};
	if (!Object.values(rest).some((v) => v !== undefined)) {
		const { [id]: _gone, ...others } = map;
		return others;
	}
	return { ...map, [id]: rest };
}

/**
 * The corrections after the singer sets the held bar's signature, or null where the pair is not a time signature, or the entry is
 * not in the line.
 */
export function setSignature(
	read: ParsedScore,
	line: VocalLineEvent[],
	map: CorrectionMap,
	id: string,
	sig: { beats: number; beatType: number },
	through: Through,
): CorrectionMap | null {
	if (!validSignature(sig.beats, sig.beatType)) return null;
	const held = heldBar(read, line, map, id);
	if (!held) return null;
	const r = rebar(read, line, map);
	const barOf = (entryId: string) => r.line.find((e) => e.id === entryId)?.measureIndex;
	let next = map;
	// One mark stands in a bar, and "to the end" removes her own later ones (amendment 10).
	for (const [src, owner] of ownersOf(read, map)) {
		const b = barOf(owner);
		if (b === undefined) continue;
		if (b === held.bar || (through === 'end' && b > held.bar)) next = withoutTimeSignature(next, src);
	}
	const sameAsReading = sig.beats === held.reading.beats && sig.beatType === held.reading.beatType;
	if (sameAsReading && through === 'next') return next;
	return { ...next, [held.openerId]: { ...next[held.openerId], timeSignature: { beats: sig.beats, beatType: sig.beatType, through } } };
}
