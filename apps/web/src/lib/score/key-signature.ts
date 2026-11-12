/**
 * key-signature.ts: the key signature card's arithmetic, as pure data (N.192, step 6b).
 *
 * The sibling of `time-signature.ts`, with its two write-time rules: ONE MARK STANDS IN A BAR (a new one replaces any other in the bar), and
 * "TO THE END OF THE SONG" REMOVES HER OWN LATER MARKS in the same step, so marks never overlap. The mark is a `NoteCorrection.keySignature` on the
 * entry that opens the bar, so it is one more correction: it rides the map, is saved with the song, and is undone by the same Undo as every other.
 *
 * IT IS APPLIED AFTER `rebar`, where `BarLayer` builds the corrected score (`applyKeyLayer`): each bar in scope takes the new key on
 * `Measure.keySignature` (keeping the bar's mode), `keySignatures` is rebuilt from the measures, so the head, the transposition ruler, and
 * `engraveInKey`'s `printed` all see it; and for 'follow' the notes in scope are re-spelled, bar by bar, against the key that bar HAD
 * before the mark.
 *
 * 'FOLLOW': a note whose alteration equals the old key's alteration for its letter takes the new key's. THE KNOWN HARM, not built around:
 * a printed accidental that equals the misread key's alteration (a natural on G under a signature read as two sharps where three are printed)
 * is re-spelled too, and so is every later such note in the bar that the printed natural governs. Whether a scan writes `<alter>0</alter>` for
 * a printed natural is NOT ESTABLISHED (step 0), so the parser keeps no flag to tell the two apart. 'keep' changes no pitch. A pitch the
 * singer set (a `pitch` correction or a hand entry) is never moved.
 */
import type { GraceNote, ParsedScore, Pitch, VocalLineEvent } from '@ilya/score-parser';
import { keySignatureAlter } from '@ilya/score-parser';
import type { CorrectionMap, NoteCorrection } from './correction';
import { rebar } from './rebar';

export type KeyMark = NonNullable<NoteCorrection['keySignature']>;
export type KeyThrough = 'next' | 'end';
export interface KeySpec {
	fifths: number;
	through: KeyThrough;
	notes: 'follow' | 'keep';
}

/** The fifteen signatures the card lists, by count, flats to sharps. */
export const KEY_CHOICES: readonly number[] = [-7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7];

/** The i18n key and the count for a signature's label (the upload question's own strings: count the sharps or flats on your paper). */
export function keyLabelKey(fifths: number): { key: string; n: number } {
	return { key: fifths === 0 ? 'upload.ask.keyNone' : fifths === 1 ? 'upload.ask.keySharp' : fifths > 1 ? 'upload.ask.keySharps' : fifths === -1 ? 'upload.ask.keyFlat' : 'upload.ask.keyFlats', n: Math.abs(fifths) };
}

interface Placed {
	bar: number;
	id: string;
	mark: KeyMark;
}

function marksIn(line: readonly VocalLineEvent[], map: CorrectionMap): Placed[] {
	const out: Placed[] = [];
	for (const [id, c] of Object.entries(map)) {
		if (c.keySignature === undefined || c.deleted) continue;
		const ev = line.find((e) => e.id === id);
		if (ev) out.push({ bar: ev.measureIndex, id, mark: c.keySignature });
	}
	return out.sort((a, b) => a.bar - b.bar);
}

export const hasKeyMarks = (map: CorrectionMap): boolean => Object.values(map).some((c) => c.keySignature !== undefined);

/** Re-spell one pitch from the old key to the new, or return it as it is. */
function respell(p: Pitch, old: number, next: number): Pitch {
	if (p.alter !== keySignatureAlter(p.step, old)) return p;
	const alter = keySignatureAlter(p.step, next);
	return alter === p.alter ? p : { ...p, alter };
}

/**
 * The corrected score, line, and grace list with the singer's key marks applied. `score`, `line`, and `graces` are the post-`rebar` ones (song
 * bars). The same objects come back where there is no mark.
 */
export function applyKeyLayer(
	score: ParsedScore,
	line: VocalLineEvent[],
	map: CorrectionMap,
	graces?: GraceNote[],
): { score: ParsedScore; line: VocalLineEvent[]; graces: GraceNote[] | undefined } {
	if (!hasKeyMarks(map)) return { score, line, graces };
	const placed = marksIn(line, map);
	if (placed.length === 0) return { score, line, graces };
	const n = score.measures.length;
	const reading = score.measures.map((m) => m.keySignature.fifths);
	const fifths = [...reading];
	const scope = new Map<number, { old: number; next: number; follow: boolean }>();
	placed.forEach((p, i) => {
		const target = p.mark === 'remove' ? (p.bar > 0 ? fifths[p.bar - 1] : undefined) : p.mark.fifths;
		if (target === undefined) return;
		const follow = p.mark === 'remove' ? true : p.mark.notes === 'follow';
		let end = n - 1;
		if (p.mark === 'remove' || p.mark.through === 'next') {
			let change = Infinity;
			for (let k = p.bar + 1; k < n; k++) if (reading[k] !== reading[k - 1]) { change = k; break; }
			end = Math.min(placed[i + 1]?.bar ?? Infinity, change, n) - 1;
		}
		for (let b = p.bar; b <= end; b++) {
			scope.set(b, { old: fifths[b], next: target, follow });
			fifths[b] = target;
		}
	});
	const measures = score.measures.map((m, i) => (fifths[i] === m.keySignature.fifths ? m : { ...m, keySignature: { ...m.keySignature, fifths: fifths[i] } }));
	const keySignatures = measures.flatMap((m, i) => (i === 0 || m.keySignature.fifths !== measures[i - 1].keySignature.fifths ? [{ measureIndex: i, signature: m.keySignature }] : []));
	const barOf = new Map(line.map((e) => [e.id, e.measureIndex] as const));
	const movable = (id: string): boolean => map[id]?.pitch === undefined && !map[id]?.entered;
	const respelled = (id: string, bar: number | undefined, p: Pitch): Pitch => {
		const s = bar === undefined ? undefined : scope.get(bar);
		return s && s.follow && s.old !== s.next && movable(id) ? respell(p, s.old, s.next) : p;
	};
	const newLine = line.map((e) => {
		if (!e.pitch) return e;
		const p = respelled(e.id, e.measureIndex, e.pitch);
		return p === e.pitch ? e : { ...e, pitch: p };
	});
	const newGraces = graces?.map((g) => {
		const p = respelled(g.id, barOf.get(g.principalId), g.pitch);
		return p === g.pitch ? g : { ...g, pitch: p };
	});
	return { score: { ...score, measures, keySignatures }, line: newLine, graces: newGraces };
}

/** What the card needs of the held entry's bar. */
export interface HeldKey {
	bar: number;
	/** The entry that opens the bar, which carries the mark. */
	openerId: string;
	/** The key the bar has now, the singer's change included. */
	fifths: number;
	/** The reading's own key for the bar. */
	reading: number;
	/** The singer's own mark in this bar, if any. */
	mine?: KeyMark;
	/** The key of the bar before (undefined on the first bar). */
	before?: number;
	/** The bar opens with a key change that "Remove this key change" can take away: not the first bar. */
	canRemove: boolean;
}

export function heldKey(read: ParsedScore, line: VocalLineEvent[], map: CorrectionMap, id: string): HeldKey | null {
	const r = rebar(read, line, map);
	const ev = r.line.find((e) => e.id === id);
	if (!ev) return null;
	const bar = ev.measureIndex;
	const opener = r.line.find((e) => e.measureIndex === bar);
	const here = r.score.measures.find((m) => m.index === bar);
	if (!opener || !here) return null;
	const k = applyKeyLayer(r.score, r.line, map);
	const fifths = k.score.measures.find((m) => m.index === bar)?.keySignature.fifths ?? here.keySignature.fifths;
	const before = k.score.measures.find((m) => m.index === bar - 1)?.keySignature.fifths;
	const mine = marksIn(r.line, map).find((p) => p.bar === bar)?.mark;
	return { bar, openerId: opener.id, fifths, reading: here.keySignature.fifths, ...(before !== undefined ? { before } : {}), ...(mine ? { mine } : {}), canRemove: bar > 0 && before !== undefined && before !== fifths };
}

function withoutKey(map: CorrectionMap, id: string): CorrectionMap {
	const { keySignature: _k, ...rest } = map[id] ?? {};
	if (!Object.values(rest).some((v) => v !== undefined)) {
		const { [id]: _gone, ...others } = map;
		return others;
	}
	return { ...map, [id]: rest };
}

/** The map after the singer's marks in this bar (and, for 'end', every later bar) are cleared. */
function cleared(read: ParsedScore, line: VocalLineEvent[], map: CorrectionMap, bar: number, through: KeyThrough | 'bar'): CorrectionMap {
	const r = rebar(read, line, map);
	let next = map;
	for (const p of marksIn(r.line, map)) if (p.bar === bar || (through === 'end' && p.bar > bar)) next = withoutKey(next, p.id);
	return next;
}

/** The corrections after the singer sets the held bar's key, or null where the entry is not in the line. */
export function setKey(read: ParsedScore, line: VocalLineEvent[], map: CorrectionMap, id: string, spec: KeySpec): CorrectionMap | null {
	if (!Number.isInteger(spec.fifths) || spec.fifths < -7 || spec.fifths > 7) return null;
	const held = heldKey(read, line, map, id);
	if (!held) return null;
	const next = cleared(read, line, map, held.bar, spec.through);
	if (spec.fifths === held.reading && spec.through === 'next') return next;
	return { ...next, [held.openerId]: { ...next[held.openerId], keySignature: { fifths: spec.fifths, through: spec.through, notes: spec.notes } } };
}

/** Remove the key change this bar opens: the singer's own mark is taken away, and where the reading still changes key here, `'remove'` overrides it. */
export function removeKey(read: ParsedScore, line: VocalLineEvent[], map: CorrectionMap, id: string): CorrectionMap | null {
	const held = heldKey(read, line, map, id);
	if (!held || !held.canRemove) return null;
	const next = cleared(read, line, map, held.bar, 'bar');
	if (held.mine === undefined || held.reading !== held.before) return { ...next, [held.openerId]: { ...next[held.openerId], keySignature: 'remove' } };
	return next;
}
