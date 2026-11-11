/**
 * rebar-notes.ts — "Rebar the notes", as pure data (QUEUE row 138, T2).
 *
 * THE FINALE MODEL (Rebar Music) with SIBELIUS'S AND DORICO'S TIES (Dann 2026-11-09 21:30): from the bar the singer chose, walk the notes
 * forward and fill bars of the new time signature, tying any note that crosses a boundary. It stops where the signature's scope stops: at the
 * end of the song, at a later signature of hers, or (to the next change) at the reading's own next change of signature. At a key or clef change, a
 * repeat, an ending, a jump, a rehearsal mark, or any other barline the layer will not remove (`rebar.ts`, `mergeBlocked`) it does NOT stop: the
 * reading's barline stays and the fill starts again after it (lane 47, amendment 3). A tuplet group that cannot be counted whole into the bar it falls in is NOT a stop: a tuplet is never
 * split across a barline, so the group is left as read and the fill starts again after it (lane 47, amendment 2). A bar may be short or long: NOTHING IS
 * INVENTED, no rest is added, and the bar stays flagged as not adding up.
 *
 * IT IS NOT A STORED MODE. At the moment the singer chooses it, this computes the barlines and splits the new signature implies and writes
 * them as ORDINARY RECORDS in the one map: `barline` marks, shortened `base` and `dots`, `tied`, and hand-entered entries for the remainders
 * (`entered.after` naming the part before). So every path ends in the same few stored fields, and one Undo takes the lot back
 * (review of 2026-11-10, amendments 3 and 4). It REPLACES the barlines inside its scope, the singer's own included (Dorico's pitfall is
 * overwriting manual barlines silently; here the scope is the one she chose, and Undo restores them).
 *
 * A TIE NEEDS FOUR THINGS, and a note split in a bar is a note split in the data (amendment 3): the read note takes the shorter length and
 * `tied: 'start'`; the remainder is an entered entry after it with the same pitch; every remainder but the last is `tied: 'start'`; the last
 * carries the tie the read note had. A REST that crosses is split with no tie. A length no single value holds (five sixteenths) is a chain.
 * The seats survive: a note after a tie start takes no syllable (`pairings.ts`), so the syllable stays on the first part.
 */
import type { Fraction, NoteBase, ParsedScore, VocalLineEvent } from '@ilya/score-parser';
import { applyCorrections, currentPitch, durationFraction, type CorrectionMap, type NoteCorrection } from './correction';
import { currentTie, currentType, nextEnteredId } from './entry';
import { effectiveMarks, mergeBlocked, sameSignature } from './rebar';
import { heldBar, setSignature, type Through } from './time-signature';

const ZERO: Fraction = { numerator: 0, denominator: 1 };

function gcd(a: number, b: number): number {
	return b === 0 ? Math.abs(a) || 1 : gcd(b, a % b);
}
function frac(n: number, d: number): Fraction {
	const g = gcd(n, d);
	return { numerator: n / g, denominator: d / g };
}
const add = (a: Fraction, b: Fraction) => frac(a.numerator * b.denominator + b.numerator * a.denominator, a.denominator * b.denominator);
const sub = (a: Fraction, b: Fraction) => frac(a.numerator * b.denominator - b.numerator * a.denominator, a.denominator * b.denominator);
const cmp = (a: Fraction, b: Fraction) => a.numerator * b.denominator - b.numerator * a.denominator;
const isZero = (a: Fraction) => a.numerator === 0;
function summable(f: Fraction | undefined): f is Fraction {
	return !!f && Number.isFinite(f.numerator) && Number.isFinite(f.denominator) && f.denominator > 0 && f.numerator > 0;
}

/** Every single note value, longest first, with its length: a whole down to a 64th, each undotted, dotted, and double-dotted. */
const VALUES: ReadonlyArray<{ base: NoteBase; dots: number; length: Fraction }> = (['whole', 'half', 'quarter', 'eighth', '16th', '32nd', '64th'] as const).flatMap((base) =>
	[0, 1, 2].map((dots) => ({ base, dots, length: durationFraction(base, dots) })),
).sort((a, b) => cmp(b.length, a.length));

/** `length` as a chain of single note values, longest first, or null where the 64th cannot reach it. */
export function notatable(length: Fraction): Array<{ base: NoteBase; dots: number }> | null {
	const out: Array<{ base: NoteBase; dots: number }> = [];
	let left = length;
	while (!isZero(left)) {
		const v = VALUES.find((x) => cmp(x.length, left) <= 0);
		if (!v || out.length > 16) return null;
		out.push({ base: v.base, dots: v.dots });
		left = sub(left, v.length);
	}
	return out;
}

interface Part {
	base: NoteBase;
	dots: number;
	/** The part opens a bar of the new time signature. */
	opens: boolean;
}

function sameTuplet(a: VocalLineEvent, b: VocalLineEvent): boolean {
	const x = a.duration.tuplet;
	const y = b.duration.tuplet;
	return !!x && !!y && x.actualNotes === y.actualNotes && x.normalNotes === y.normalNotes && x.normalType === y.normalType;
}

/** The record with its `barline` set or removed; a record left saying nothing is dropped. */
function withBarlineMark(map: CorrectionMap, id: string, value: 'before' | 'none' | undefined): CorrectionMap {
	const { barline: _was, ...rest } = map[id] ?? {};
	const next = value === undefined ? rest : { ...rest, barline: value };
	if (!Object.values(next).some((v) => v !== undefined)) {
		const { [id]: _gone, ...others } = map;
		return others;
	}
	return { ...map, [id]: next };
}

/**
 * `map` with the `barline` taken off every DELETED record whose mark would carry (`rebar.ts`, `effectiveMarks`) to a standing entry strictly between
 * `from` and `to` in `line`. The rebar replaces the barlines in its scope, so a deleted note's barline, which the layer carries to the next entry
 * standing, goes with them (lane 47, amendment 5).
 */
function withoutDeletedBarlines(read: ParsedScore, line: VocalLineEvent[], map: CorrectionMap, from: number, to: number): CorrectionMap {
	if (!Object.values(map).some((c) => c.deleted && c.barline !== undefined)) return map;
	const kept: CorrectionMap = {};
	for (const [id, c] of Object.entries(map)) {
		if (c.deleted) {
			const { deleted: _d, ...rest } = c;
			kept[id] = rest;
		} else kept[id] = c;
	}
	const place = new Map(line.map((e, i) => [e.id, i] as const));
	let next = map;
	let pending: string[] = [];
	for (const ev of applyCorrections(read.vocalLine, kept)) {
		if (map[ev.id]?.deleted) {
			if (map[ev.id].barline !== undefined) pending.push(ev.id);
			continue;
		}
		const i = place.get(ev.id);
		if (i !== undefined && i > from && i < to) for (const id of pending) next = withBarlineMark(next, id, undefined);
		pending = [];
	}
	return next;
}

/**
 * The corrections after the singer changes the held bar's time signature AND re-bars the notes, or null where `setSignature` refuses (the signature
 * is not one, or the held bar is not there). Where the notes cannot be re-barred (a piece shorter than a 64th crosses a barline) it returns what
 * `setSignature` returns: the signature applies and the barlines stay, in the same one Undo step (Dann 2026-11-10 22:31). `line` is the corrected
 * line before the layer (`BarLayer.preLine`).
 */
export function rebarNotes(
	read: ParsedScore,
	line: VocalLineEvent[],
	map: CorrectionMap,
	heldId: string,
	sig: { beats: number; beatType: number },
	through: Through,
): CorrectionMap | null {
	const signed = setSignature(read, line, map, heldId, sig, through);
	if (!signed) return null;
	const held = heldBar(read, line, map, heldId);
	if (!held) return null;
	const start = line.findIndex((e) => e.id === held.openerId);
	if (start < 0) return null;
	const length = frac(sig.beats, sig.beatType);

	/* ── Where the scope ends: where the SIGNATURE's scope ends, and nowhere else (lane 47, amendment 3). `rebar.ts` ends it at a later signature of hers
	   (either scope) and, to the next change, at the reading's own next change of signature; to the end it runs to the last entry. A reading barline the
	   layer will not remove for any other reason (a key or clef change, a repeat, an ending, a jump, a rehearsal mark, a gap of bars) does not end it:
	   the fill starts again there and the reading's barline stays. */
	const readingMeasure = (i: number) => read.measures.find((m) => m.index === line[i].measureIndex);
	const barlineBefore = (i: number): 'none' | 'removable' | 'blocked' => {
		const prev = line[i - 1];
		if (!prev || prev.measureIndex === line[i].measureIndex) return 'none';
		const a = read.measures.find((m) => m.index === prev.measureIndex);
		const b = readingMeasure(i);
		if (prev.measureIndex !== line[i].measureIndex - 1 || !a || !b || mergeBlocked(a, b)) return 'blocked';
		return 'removable';
	};
	const readingChangesSignatureAt = (i: number): boolean => {
		const prev = line[i - 1];
		if (!prev || prev.measureIndex === line[i].measureIndex) return false;
		const a = read.measures.find((m) => m.index === prev.measureIndex);
		const b = readingMeasure(i);
		return !!a && !!b && !sameSignature(a.timeSignature, b.timeSignature);
	};
	const owners = effectiveMarks(read.vocalLine, line, signed);
	let stop = line.length;
	for (let i = start + 1; i < line.length; i++) {
		if (owners.get(line[i].id)?.timeSignature || (through === 'next' && readingChangesSignatureAt(i))) {
			stop = i;
			break;
		}
	}

	/* ── Fill bars of the new signature from the held bar's opener. */
	const plan = new Map<number, Part[]>();
	let fill = ZERO;
	let groupEnd = 0;
	for (let i = start; i < stop; i++) {
		const ev = line[i];
		const d = ev.duration.fraction;
		if (!summable(d)) {
			stop = i;
			break;
		}
		// A reading barline the layer keeps stays, whatever the fill: the bar before it may be short and flagged, and the next bar starts here.
		if (i > start && barlineBefore(i) === 'blocked') fill = ZERO;
		const remaining = sub(length, fill);
		if (ev.duration.tuplet && i >= groupEnd) {
			// The head of a group. A tuplet is never split across a barline: it fits whole into the bar it falls in, or it is left exactly as read
			// (no plan, no record, no barline of ours), and the fill starts again after it, as at a blocked barline. The bar that holds it is short
			// or long and flagged; nothing is invented (lane 47, amendment 2).
			const members = ev.duration.tuplet.actualNotes;
			let total = ZERO;
			let end = i;
			for (let k = i; k < Math.min(i + members, stop) && sameTuplet(line[k], ev); k++) {
				const f = line[k].duration.fraction;
				if (!summable(f)) break;
				total = add(total, f);
				end = k + 1;
			}
			groupEnd = end;
			if (cmp(total, remaining) > 0) {
				fill = ZERO;
				i = end - 1;
				continue;
			}
		}
		const chunks: Array<{ length: Fraction; opens: boolean }> = [];
		if (cmp(d, remaining) <= 0) {
			chunks.push({ length: d, opens: isZero(fill) });
			fill = cmp(d, remaining) === 0 ? ZERO : add(fill, d);
		} else {
			chunks.push({ length: remaining, opens: isZero(fill) });
			let left = sub(d, remaining);
			fill = ZERO;
			while (!isZero(left)) {
				const c = cmp(left, length) < 0 ? left : length;
				chunks.push({ length: c, opens: true });
				left = sub(left, c);
				fill = cmp(c, length) === 0 ? ZERO : c;
			}
		}
		const parts: Part[] = [];
		for (const chunk of chunks) {
			// An entry that stays one chunk of its own length is not re-valued, so it needs no notatable chain: a triplet member (1/6) never has one.
			if (chunks.length === 1 && cmp(chunk.length, d) === 0) {
				parts.push({ base: ev.duration.base, dots: ev.duration.dots, opens: chunk.opens });
				continue;
			}
			const values = notatable(chunk.length);
			// A crossing piece shorter than a 64th has no note value: the rebar cannot be done, but the signature still applies and the barlines stay (Dann 2026-11-10 22:31).
			if (!values) return signed;
			values.forEach((v, k) => parts.push({ ...v, opens: chunk.opens && k === 0 }));
		}
		plan.set(i, parts);
	}
	if (plan.size === 0) return signed;

	/* ── Write it. The barlines in scope are replaced; the opener of the held bar keeps its own. */
	let next = withoutDeletedBarlines(read, line, signed, start, stop);
	for (let i = start + 1; i < stop; i++) if (next[line[i].id]?.barline !== undefined) next = withBarlineMark(next, line[i].id, undefined);
	for (let i = start + 1; i < stop; i++) {
		const parts = plan.get(i);
		if (!parts) continue;
		// Only where the reading has no barline is one written; at a blocked barline the reading's own stays and no mark is written on the entry after it.
		const before = barlineBefore(i);
		if (parts[0].opens && before === 'none') next = withBarlineMark(next, line[i].id, 'before');
		else if (!parts[0].opens && before === 'removable') next = withBarlineMark(next, line[i].id, 'none');
	}
	// The bar after the scope opens where the scope ended, so the short bar before it closes there.
	if (stop < line.length && barlineBefore(stop) === 'none' && next[line[stop].id]?.barline !== 'before') next = withBarlineMark(next, line[stop].id, 'before');

	for (const [i, parts] of plan) {
		if (parts.length < 2) continue;
		const ev = line[i];
		const isNote = currentType(ev, next) === 'note';
		const pitch = currentPitch(ev, next);
		const tiedAfter = currentTie(ev, next);
		const ids: string[] = [ev.id];
		let working = next;
		parts.slice(1).forEach((p, k) => {
			const id = nextEnteredId(working);
			const last = k === parts.length - 2;
			const rec: NoteCorrection = {
				entered: { after: ids[ids.length - 1] },
				base: p.base,
				dots: p.dots,
				type: isNote ? 'note' : 'rest',
				...(isNote && pitch ? { pitch } : {}),
				...(isNote && (!last || tiedAfter) ? { tied: 'start' as const } : {}),
			};
			working = { ...working, [id]: rec };
			ids.push(id);
			if (p.opens) working = withBarlineMark(working, id, 'before');
		});
		working = { ...working, [ev.id]: { ...working[ev.id], base: parts[0].base, dots: parts[0].dots, ...(isNote ? { tied: 'start' as const } : {}) } };
		next = working;
	}
	return next;
}

/** Re-bars with no change to the signature: the same fill from the held bar, to the next change. For the card's "Rebar the notes" with the signature already in force. */
export function rebarNotesInForce(read: ParsedScore, line: VocalLineEvent[], map: CorrectionMap, heldId: string): CorrectionMap | null {
	const held = heldBar(read, line, map, heldId);
	if (!held) return null;
	return rebarNotes(read, line, map, heldId, { beats: held.signature.beats, beatType: held.signature.beatType }, held.mine?.through ?? 'next');
}
