/**
 * Grace notes in Corrections (N.187).
 *
 * A grace note is a sung pitch that takes no time, kept in `ParsedScore.graceNotes`
 * and never in the line. The singer's corrections to one are ordinary records in
 * the one `CorrectionMap` (`NoteCorrection.grace`, `pitch`, `base`, `deleted`), and
 * this file is the pure function that turns the read list, the map, and the
 * corrected line into the grace list the page draws, and the one SELECTION ORDER
 * every reader of a selected id uses (each grace note before its principal, an
 * after-grace after it), so the arrow keys, the Loupe's `measureHold`, and the
 * hit rectangles all agree.
 *
 * Where a grace note stands is DERIVED from the sequence of what stands in the
 * line, never stored: a grace note belongs to the next note that stands after
 * its place (a deleted or converted principal passes its grace notes on, as
 * `time-signature.ts` passes a mark on), and to the last note, as an
 * after-grace, where none follows.
 */
import type { GraceNote, Pitch, VocalLineEvent } from '@ilya/score-parser';
import { madeGrace, type CorrectionMap } from './correction';

/** One item of the sung sequence: a note that stands in the line, or a grace note. */
interface Item {
	id: string;
	/** Set on a grace note. */
	grace?: { slash?: boolean; pitch: Pitch; base: GraceNote['base']; slurred?: true; read?: GraceNote };
}

const HEAD = '\u0000head';

/** The pitch a hand-added or converted grace note sings: the record's, else the note's own read pitch. */
function pitchOf(c: { pitch?: Pitch } | undefined, fallback: Pitch | undefined): Pitch | undefined {
	return c?.pitch ?? fallback;
}

/**
 * The sung sequence: the corrected line's notes in order, each with the grace notes the READ put before it (and after it, for
 * an after-grace), then the grace notes the singer made, in their places. Rests are left out of it (a grace note hangs on a note).
 */
function sequence(read: readonly GraceNote[] | undefined, map: CorrectionMap, readLine: readonly VocalLineEvent[], line: readonly VocalLineEvent[]): Item[] {
	const standing = new Set(line.filter((e) => e.type === 'note').map((e) => e.id));
	const readGrace = new Map<string, GraceNote>((read ?? []).map((g) => [g.id, g]));
	const kept = (read ?? []).filter((g) => map[g.id]?.grace !== 'none' && !map[g.id]?.deleted);
	const asItem = (g: GraceNote): Item => {
		const c = map[g.id];
		const gc = c?.grace && c.grace !== 'none' ? c.grace : undefined;
		return { id: g.id, grace: { slash: gc ? gc.slash : g.slash, pitch: c?.pitch ?? g.pitch, base: c?.base ?? g.base, ...(g.slurred ? { slurred: true as const } : {}), read: g } };
	};
	const seq: Item[] = [];
	const homeless: GraceNote[] = [];
	const before = new Map<string, GraceNote[]>();
	const after = new Map<string, GraceNote[]>();
	for (const g of kept) {
		if (!standing.has(g.principalId)) { homeless.push(g); continue; }
		const m = g.after ? after : before;
		m.set(g.principalId, [...(m.get(g.principalId) ?? []), g]);
	}
	for (const ev of line) {
		if (ev.type !== 'note') continue;
		for (const g of before.get(ev.id) ?? []) seq.push(asItem(g));
		seq.push({ id: ev.id });
		for (const g of after.get(ev.id) ?? []) seq.push(asItem(g));
	}
	/* Where an item's place is, for an insertion: after the nearest item before it in the READ that still stands in `seq`, or at the head. */
	const readOrder = readLine.map((e) => e.id);
	const insertAt = (anchorId: string | null): number => {
		if (anchorId === null) return 0;
		const here = seq.findIndex((x) => x.id === anchorId);
		if (here >= 0) {
			let i = here + 1;
			// stay after the anchor's own after-graces
			while (i < seq.length && seq[i].grace?.read?.after && seq[i].grace?.read?.principalId === anchorId) i++;
			return i;
		}
		const r = readOrder.indexOf(anchorId);
		for (let k = r - 1; k >= 0; k--) {
			const at = seq.findIndex((x) => x.id === readOrder[k]);
			if (at >= 0) return insertAt(readOrder[k]);
		}
		return 0;
	};
	// A read grace note whose principal no longer stands passes to the next note that does: it stays where its principal was.
	for (const g of homeless) {
		const at = insertAt(g.principalId);
		seq.splice(at, 0, asItem(g));
	}
	// A read full note the singer made a grace note: in its read place.
	for (const ev of readLine) {
		const c = map[ev.id];
		if (ev.type !== 'note' || !madeGrace(c) || c?.deleted || c?.entered) continue;
		const prev = readOrder.indexOf(ev.id) - 1;
		const anchor = prev >= 0 ? readOrder[prev] : null;
		const gc = c!.grace as { slash: boolean };
		seq.splice(insertAt(anchor), 0, { id: ev.id, grace: { slash: gc.slash, pitch: pitchOf(c, ev.pitch) ?? { step: 'C', octave: 4, alter: 0 }, base: c!.base ?? ev.duration.base } });
	}
	// A grace note the singer added: after the entry it follows, in the order added, repeated until every anchor is placed.
	let pending = Object.entries(map).filter(([, c]) => c.entered && madeGrace(c) && !c.deleted);
	for (let guard = 0; pending.length && guard < 64; guard++) {
		const rest: typeof pending = [];
		for (const [id, c] of pending) {
			const anchor = c.entered!.after;
			const known = anchor === null || seq.some((x) => x.id === anchor) || readOrder.includes(anchor) || !pending.some(([o]) => o === anchor);
			if (!known) { rest.push([id, c]); continue; }
			const gc = c.grace as { slash: boolean };
			seq.splice(insertAt(anchor), 0, { id, grace: { slash: gc.slash, pitch: c.pitch ?? { step: 'C', octave: 4, alter: 0 }, base: c.base ?? 'eighth' } });
		}
		if (rest.length === pending.length) { for (const [id, c] of rest) seq.splice(0, 0, { id, grace: { slash: (c.grace as { slash: boolean }).slash, pitch: c.pitch ?? { step: 'C', octave: 4, alter: 0 }, base: c.base ?? 'eighth' } }); break; }
		pending = rest;
	}
	void readGrace;
	return seq;
}

/**
 * The corrected grace list: read grace notes with their `pitch`, `base`, `slash` and `deleted` corrections applied, full notes made
 * grace notes, and hand-added ones, each attached to the next note that stands after its place (an after-grace of the last note where none follows).
 * Returns the read list itself where no correction touches a grace note, and `undefined` where there is none.
 */
export function correctedGraceNotes(
	read: readonly GraceNote[] | undefined,
	map: CorrectionMap,
	readLine: readonly VocalLineEvent[],
	line: readonly VocalLineEvent[],
): GraceNote[] | undefined {
	const standing = new Set(line.map((e) => e.id));
	const touched = Object.values(map).some((c) => c.grace !== undefined) || (read ?? []).some((g) => map[g.id] || !standing.has(g.principalId));
	if (!touched) return read as GraceNote[] | undefined;
	const seq = sequence(read, map, readLine, line);
	const out: GraceNote[] = [];
	seq.forEach((item, i) => {
		if (!item.grace) return;
		const g = item.grace;
		const fixed = g.read?.after ? g.read.principalId : undefined;
		let principal = fixed;
		let isAfter = fixed !== undefined;
		if (!principal) {
			for (let k = i + 1; k < seq.length; k++) if (!seq[k].grace) { principal = seq[k].id; break; }
		}
		if (!principal) {
			for (let k = i - 1; k >= 0; k--) if (!seq[k].grace) { principal = seq[k].id; isAfter = true; break; }
		}
		if (!principal) return;
		out.push({
			id: item.id,
			principalId: principal,
			...(isAfter ? { after: true as const } : {}),
			pitch: g.pitch,
			base: g.base,
			...(g.slash !== undefined ? { slash: g.slash } : {}),
			...(g.slurred ? { slurred: true as const } : {}),
		});
	});
	return out.length ? out : undefined;
}

/**
 * The ids a selection can stand on, in the order the arrow keys walk them: each grace note before its principal, an after-grace after
 * it, rests left out (a note or a grace note only), deleted ones left out.
 */
export function selectionOrder(
	graceNotes: readonly GraceNote[] | undefined,
	line: readonly VocalLineEvent[],
	map: CorrectionMap,
): string[] {
	const live = (id: string): boolean => !map[id]?.deleted;
	const before = new Map<string, string[]>();
	const after = new Map<string, string[]>();
	for (const g of graceNotes ?? []) {
		const m = g.after ? after : before;
		m.set(g.principalId, [...(m.get(g.principalId) ?? []), g.id]);
	}
	const out: string[] = [];
	for (const ev of line) {
		if (ev.type === 'rest') continue;
		out.push(...(before.get(ev.id) ?? []).filter(live));
		if (live(ev.id)) out.push(ev.id);
		out.push(...(after.get(ev.id) ?? []).filter(live));
	}
	return out;
}

export { HEAD as GRACE_HEAD };

const ZERO = { numerator: 0, denominator: 1 };

/** A grace note as a stop the Loupe's cursor can stand on: an entry of no length, in its principal's bar and at its onset. */
function stopFor(g: GraceNote, host: VocalLineEvent): VocalLineEvent {
	return { id: g.id, type: 'note', measureIndex: host.measureIndex, rhythmicPosition: { fraction: host.rhythmicPosition.fraction }, duration: { base: g.base, dots: 0, fraction: ZERO }, pitch: g.pitch } as VocalLineEvent;
}

/**
 * The corrected line with each grace note standing in it as a zero-length entry, in the selection order: the line the Loupe's cursor,
 * the carets, the hit list of a held bar, and the verbs walk, so a grace note is a place the bar can stand exactly as a note is. The
 * page's drawing, the bar sums, and the underlay keep the line without them. The line itself where there are none.
 */
export function lineWithGraceStops(line: VocalLineEvent[], graces: readonly GraceNote[] | undefined): VocalLineEvent[] {
	if (!graces || graces.length === 0) return line;
	const before = new Map<string, GraceNote[]>();
	const after = new Map<string, GraceNote[]>();
	for (const g of graces) {
		const m = g.after ? after : before;
		m.set(g.principalId, [...(m.get(g.principalId) ?? []), g]);
	}
	const out: VocalLineEvent[] = [];
	for (const ev of line) {
		for (const g of before.get(ev.id) ?? []) out.push(stopFor(g, ev));
		out.push(ev);
		for (const g of after.get(ev.id) ?? []) out.push(stopFor(g, ev));
	}
	return out;
}
