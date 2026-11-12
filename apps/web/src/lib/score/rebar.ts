/**
 * rebar.ts — the barline and time signature layer, as pure data.
 *
 * QUEUE row 138, ruled by Dann 2026-11-09 (21:17 the barline correction,
 * 21:35 the time signature control, 21:38 "from that bar until the next
 * change", 21:47 "it's a when"). Design: `docs/sessions/brief-code-barline-and-time-signature_r1_2026-11-09.md`
 * and `review-fable-barline-correction_r1_2026-11-10.md`.
 *
 * A LAYER OVER THE READING, NEVER A CHANGE TO IT. The reader's MusicXML is kept
 * as it was read. Event ids are built from the reading's bar and position
 * (`musicxml-parser.ts:732-734`), so a bar divided at reading time would rename
 * every later event and orphan every stored correction. Here no id moves: the
 * singer's `barline` and `timeSignature` marks (on `NoteCorrection`) are applied
 * AFTER `applyCorrections`, to the corrected line, and only the bar an event
 * sits in, its onset, and the lists keyed by bar are rebuilt.
 *
 * TWO COORDINATES. A READING BAR is a bar of the reading (what the print strip,
 * the kept bands, and the unread-bars banner are keyed to, and what stays
 * fixed). A SONG BAR is a bar of the song as the singer has corrected it (what
 * MELODY, the Loupe's tag, and every `measureIndex` on a rebarred event say).
 * They are equal until a mark divides or joins a bar. `BarMap` converts.
 *
 * WHAT A MARK SAYS. `barline: 'before'` opens a bar at the entry. `'none'` removes
 * the reading's barline before the entry, which must be the first entry of its
 * reading bar and must follow the adjacent bar. `timeSignature` sets the signature
 * from the bar the entry sits in, to the next change or to the end.
 *
 * A MARK ON A DELETED ENTRY IS CARRIED to the next entry standing (review of
 * 2026-11-10, amendment 9): the singer deleted a note, not the bar.
 *
 * NOTHING IS INVENTED. A bar that does not add up is left so and flagged as it
 * is today; no rest is added, and no bar is called a pickup unless the reading
 * said so.
 */

import type {
	ClefChange,
	Fraction,
	GraceNote,
	KeySignatureChange,
	Measure,
	MetricModulation,
	ParsedScore,
	TempoMarking,
	TempoWord,
	TimeSignature,
	TimeSignatureChange,
	VocalLineEvent,
} from '@ilya/score-parser';
import { applyCorrections, madeGrace, type CorrectionMap, type NoteCorrection } from './correction';

/** The two layer fields of one record, as the layer reads them. */
export interface LayerMarks {
	barline?: 'before' | 'none';
	timeSignature?: NonNullable<NoteCorrection['timeSignature']>;
}

/** Two-way conversion between reading bars and song bars. */
export interface BarMap {
	/** True when no mark moved a barline: the two coordinates are one. */
	readonly identity: boolean;
	/** The song bar a reading bar's first entry sits in. */
	toSong(readingBar: number): number;
	/** The reading bar a song bar begins in. */
	toReading(songBar: number): number;
}

export const IDENTITY_BARS: BarMap = {
	identity: true,
	toSong: (r) => r,
	toReading: (s) => s,
};

export interface Rebarred {
	/** The score with the layer applied; the same object where nothing applied and the line is the read's. */
	score: ParsedScore;
	/** The corrected line, bars and onsets rebuilt. */
	line: VocalLineEvent[];
	bars: BarMap;
	/** True when at least one mark was found and honoured. */
	applied: boolean;
}

const ZERO: Fraction = { numerator: 0, denominator: 1 };

function gcd(a: number, b: number): number {
	return b === 0 ? a || 1 : gcd(b, a % b);
}
function frac(n: number, d: number): Fraction {
	const g = gcd(Math.abs(n), Math.abs(d)) || 1;
	return { numerator: n / g, denominator: d / g };
}
function add(a: Fraction, b: Fraction): Fraction {
	return frac(a.numerator * b.denominator + b.numerator * a.denominator, a.denominator * b.denominator);
}
function sub(a: Fraction, b: Fraction): Fraction {
	return add(a, { numerator: -b.numerator, denominator: b.denominator });
}
function cmp(a: Fraction, b: Fraction): number {
	return a.numerator * b.denominator - b.numerator * a.denominator;
}
function sum(f: Fraction | undefined): f is Fraction {
	return !!f && Number.isFinite(f.numerator) && Number.isFinite(f.denominator) && f.denominator > 0;
}

/** Whether a record carries either layer mark. */
export function hasLayer(c: NoteCorrection | undefined): boolean {
	return !!c && (c.barline !== undefined || c.timeSignature !== undefined);
}

/** Whether any record in the map carries a layer mark. */
export function hasLayerMarks(map: CorrectionMap): boolean {
	for (const id in map) if (hasLayer(map[id])) return true;
	return false;
}

function marksOf(c: NoteCorrection | undefined): LayerMarks {
	const out: LayerMarks = {};
	if (c?.barline !== undefined) out.barline = c.barline;
	if (c?.timeSignature && c.timeSignature.beats > 0 && c.timeSignature.beatType > 0) {
		out.timeSignature = c.timeSignature;
	}
	return out;
}

/**
 * The marks that govern each entry standing in `line`, a deleted entry's marks
 * carried to the next entry standing. A standing entry's own mark wins over a
 * carried one of the same kind.
 */
export function effectiveMarks(
	read: VocalLineEvent[],
	line: VocalLineEvent[],
	map: CorrectionMap,
	graceNotes?: readonly GraceNote[],
): Map<string, LayerMarks> {
	const out = new Map<string, LayerMarks>();
	const carries = Object.values(map).some((c) => (c.deleted || madeGrace(c)) && hasLayer(c));
	if (!carries) {
		for (const ev of line) {
			const m = marksOf(map[ev.id]);
			if (m.barline !== undefined || m.timeSignature !== undefined) out.set(ev.id, m);
		}
		return out;
	}
	// The line with the deletions undone, so a deleted entry's place is known.
	const kept: CorrectionMap = {};
	for (const [id, c] of Object.entries(map)) {
		if (c.deleted || madeGrace(c)) {
			// N.187: a note made a grace note leaves the line as a deleted one does, so its marks pass on the same way.
			const { deleted: _d, grace: _g, ...rest } = c;
			kept[id] = rest;
		} else kept[id] = c;
	}
	const full = applyCorrections(read, kept, graceNotes);
	let pending: LayerMarks = {};
	for (const ev of full) {
		const c = map[ev.id];
		if (c?.deleted || madeGrace(c)) {
			pending = { ...pending, ...marksOf(c) };
			continue;
		}
		const merged = { ...pending, ...marksOf(c) };
		pending = {};
		if (merged.barline !== undefined || merged.timeSignature !== undefined) out.set(ev.id, merged);
	}
	return out;
}

export function sameSignature(a: TimeSignature, b: TimeSignature): boolean {
	return a.beats === b.beats && a.beatType === b.beatType && a.symbol === b.symbol;
}

/**
 * Whether the reading's barline between `prev` and `m` may be removed: not where
 * the second bar opens a change of signature, key, or clef, not a repeat, not an
 * ending boundary, and not where it carries a mark a merge would lose.
 * `Measure` holds one signature (`types.ts:265-275`), so a merged bar cannot
 * hold two.
 */
export function mergeBlocked(prev: Measure, m: Measure): boolean {
	if (prev.timeSignature.beats !== m.timeSignature.beats || prev.timeSignature.beatType !== m.timeSignature.beatType) return true;
	if (prev.keySignature.fifths !== m.keySignature.fifths || prev.keySignature.mode !== m.keySignature.mode) return true;
	const a = prev.clef;
	const b = m.clef;
	if (!!a !== !!b || (a && b && (a.sign !== b.sign || a.line !== b.line || (a.octaveChange ?? 0) !== (b.octaveChange ?? 0)))) return true;
	if (prev.repeatEnd || m.repeatStart) return true;
	if (!!prev.ending !== !!m.ending) return true;
	if (m.jump || m.rehearsalMark) return true;
	return false;
}

interface Piece {
	reading: number;
	measure: Measure;
	events: VocalLineEvent[];
	/** The original onset of the piece's first event, the base its onsets are measured from. */
	origStart: Fraction;
	/** The onset the piece's first event takes in its song bar. */
	offset: Fraction;
	/** The piece opens its reading bar. */
	first: boolean;
	/** The piece closes its reading bar. */
	last: boolean;
	bar: number;
}

interface Bar {
	base: Measure;
	pieces: Piece[];
}

/**
 * Apply the layer.
 *
 * `score` is the ingested score (its own `vocalLine` is the read), `line` the
 * corrected line, `map` the corrections. Returns the inputs, untouched, where
 * the map carries no mark, so a song with none costs nothing.
 */
export function rebar(score: ParsedScore, line: VocalLineEvent[], map: CorrectionMap): Rebarred {
	if (!hasLayerMarks(map)) {
		return {
			score: line === score.vocalLine ? score : { ...score, vocalLine: line },
			line,
			bars: IDENTITY_BARS,
			applied: false,
		};
	}
	const marks = effectiveMarks(score.vocalLine, line, map, score.graceNotes);
	if (marks.size === 0) {
		return {
			score: line === score.vocalLine ? score : { ...score, vocalLine: line },
			line,
			bars: IDENTITY_BARS,
			applied: false,
		};
	}

	/* ── 1. The reading bars' entries, in order. */
	const groups = new Map<number, VocalLineEvent[]>();
	for (const ev of line) {
		const g = groups.get(ev.measureIndex);
		if (g) g.push(ev);
		else groups.set(ev.measureIndex, [ev]);
	}
	const known = new Set(score.measures.map((m) => m.index));
	const visit: Measure[] = [...score.measures];
	// An entry in a bar the score does not list borrows the bar before it.
	for (const idx of [...groups.keys()].filter((i) => !known.has(i)).sort((a, b) => a - b)) {
		const donor = visit[visit.length - 1];
		if (donor) visit.push({ ...donor, index: idx });
	}

	/* ── 2. Song bars: split at every `'before'`, joined at every honoured `'none'`. */
	const bars: Bar[] = [];
	const piecesOf = new Map<number, Piece[]>();
	for (const m of visit) {
		const events = groups.get(m.index) ?? [];
		const cuts = [0];
		for (let k = 1; k < events.length; k++) if (marks.get(events[k].id)?.barline === 'before') cuts.push(k);
		const segments = events.length === 0 ? [[] as VocalLineEvent[]] : cuts.map((c, i) => events.slice(c, cuts[i + 1] ?? events.length));
		const mine: Piece[] = [];
		segments.forEach((seg, i) => {
			const piece: Piece = {
				reading: m.index,
				measure: m,
				events: seg,
				origStart: seg[0]?.rhythmicPosition.fraction ?? ZERO,
				offset: ZERO,
				first: i === 0,
				last: i === segments.length - 1,
				bar: -1,
			};
			mine.push(piece);
			const prev = bars[bars.length - 1];
			const prevLast = prev?.pieces[prev.pieces.length - 1];
			const own = seg[0] ? marks.get(seg[0].id) : undefined;
			const joins =
				i === 0 &&
				own?.barline === 'none' &&
				!own.timeSignature &&
				!!prev &&
				!!prevLast &&
				prevLast.reading === m.index - 1 &&
				prevLast.events.length > 0 &&
				seg.length > 0 &&
				!mergeBlocked(prev.base, m);
			if (joins) {
				prev.pieces.push(piece);
				piece.bar = bars.length - 1;
			} else {
				bars.push({ base: m, pieces: [piece] });
				piece.bar = bars.length - 1;
			}
		});
		piecesOf.set(m.index, mine);
	}

	/* ── 3. Entries: bar, and onset from the start of the song bar. */
	const out: VocalLineEvent[] = [];
	bars.forEach((bar, s) => {
		let end: Fraction = ZERO;
		bar.pieces.forEach((piece, pi) => {
			piece.offset = pi > 0 ? end : piece.first ? piece.origStart : ZERO;
			for (const ev of piece.events) {
				const onset = add(sub(ev.rhythmicPosition.fraction, piece.origStart), piece.offset);
				const was = ev.rhythmicPosition.fraction;
				const same = onset.numerator * was.denominator === was.numerator * onset.denominator;
				out.push(
					ev.measureIndex === s && same
						? ev
						: { ...ev, measureIndex: s, rhythmicPosition: { ...ev.rhythmicPosition, fraction: onset } },
				);
				if (sum(ev.duration.fraction)) {
					const e = add(onset, ev.duration.fraction);
					if (cmp(e, end) > 0) end = e;
				}
			}
		});
	});

	/* ── 4. Time signatures: the reading's, then the singer's. */
	const sigs: TimeSignature[] = bars.map((b) => ({ ...b.base.timeSignature }));
	const readingChangeAt = (b: number) =>
		b > 0 && bars[b].pieces[0].first && !sameSignature(bars[b].base.timeSignature, bars[b - 1].base.timeSignature);
	const userAt: Array<NonNullable<LayerMarks['timeSignature']> | undefined> = bars.map((bar) => {
		for (const piece of bar.pieces) for (const ev of piece.events) {
			const t = marks.get(ev.id)?.timeSignature;
			if (t) return t;
		}
		return undefined;
	});
	for (let b = 0; b < bars.length; b++) {
		const mk = userAt[b];
		if (!mk) continue;
		let stop = bars.length;
		for (let c = b + 1; c < bars.length; c++) {
			if (userAt[c] || (mk.through === 'next' && readingChangeAt(c))) {
				stop = c;
				break;
			}
		}
		for (let i = b; i < stop; i++) sigs[i] = { beats: mk.beats, beatType: mk.beatType };
	}

	/* ── 5. The measures. */
	const structureUnchanged = bars.every((b, i) => b.pieces.length === 1 && b.pieces[0].reading === visit[i]?.index && b.pieces[0].first && b.pieces[0].last);
	const n0 = Number(bars[0]?.base.number);
	const measures: Measure[] = bars.map((bar, s) => {
		const p0 = bar.pieces[0];
		const pl = bar.pieces[bar.pieces.length - 1];
		const sig = sigs[s];
		const m: Measure = {
			...bar.base,
			index: s,
			number: structureUnchanged || !Number.isFinite(n0) ? bar.base.number : String(n0 + s),
			timeSignature: sig,
			expectedDuration: frac(sig.beats, sig.beatType),
		};
		if (!(p0.first && bar.base.isPickup)) delete m.isPickup;
		if (!p0.first) {
			delete m.repeatStart;
			delete m.jump;
			delete m.rehearsalMark;
		}
		if (pl.last) {
			const lm = pl.measure;
			if (lm.repeatEnd) m.repeatEnd = lm.repeatEnd;
			else delete m.repeatEnd;
			if (lm.repeatTimes !== undefined) m.repeatTimes = lm.repeatTimes;
			else delete m.repeatTimes;
			if (lm.repeatAfterJump !== undefined) m.repeatAfterJump = lm.repeatAfterJump;
			else delete m.repeatAfterJump;
		} else {
			delete m.repeatEnd;
			delete m.repeatTimes;
			delete m.repeatAfterJump;
		}
		if (bar.base.ending) {
			m.ending = { ...bar.base.ending };
			if (!p0.first) delete m.ending.startsHere;
			if (!pl.last) delete m.ending.endsHere;
			else if (pl.measure.ending?.endsHere) m.ending.endsHere = true;
		}
		return m;
	});

	/* ── 6. The lists keyed by bar. */
	const firstBarOf = (r: number) => piecesOf.get(r)?.[0]?.bar ?? r;
	const place = (r: number, pos: Fraction): { bar: number; pos: Fraction } => {
		const ps = piecesOf.get(r);
		if (!ps || ps.length === 0) return { bar: r, pos };
		let chosen = ps[0];
		for (const p of ps) if (p.events.length > 0 && cmp(p.origStart, pos) <= 0) chosen = p;
		return { bar: chosen.bar, pos: add(sub(pos, chosen.origStart), chosen.offset) };
	};
	const timeSignatures: TimeSignatureChange[] = [];
	sigs.forEach((sig, b) => {
		const prev = b > 0 ? sigs[b - 1] : undefined;
		const base = bars[b].base.timeSignature;
		// A bar keeps the reading's own symbol (common time, cut time) only where the digits are the reading's.
		const signature = sig.beats === base.beats && sig.beatType === base.beatType ? { ...base } : sig;
		if (!prev || !sameSignature(prev, sig)) timeSignatures.push({ measureIndex: b, signature });
	});
	const keySignatures: KeySignatureChange[] = score.keySignatures.map((k) => ({ ...k, measureIndex: firstBarOf(k.measureIndex) }));
	const clefs: ClefChange[] | undefined = score.clefs?.map((c) => ({ ...c, measureIndex: firstBarOf(c.measureIndex) }));
	const tempoMarkings: TempoMarking[] = score.tempoMarkings.map((t) => {
		const p = place(t.measureIndex, t.rhythmicPosition.fraction);
		return { ...t, measureIndex: p.bar, rhythmicPosition: { ...t.rhythmicPosition, fraction: p.pos } };
	});
	const tempoWords: TempoWord[] | undefined = score.tempoWords?.map((t) => {
		const p = place(t.measureIndex, t.rhythmicPosition.fraction);
		return { ...t, measureIndex: p.bar, rhythmicPosition: { ...t.rhythmicPosition, fraction: p.pos } };
	});
	const metricModulations: MetricModulation[] | undefined = score.metricModulations?.map((t) => {
		const p = place(t.measureIndex, t.rhythmicPosition.fraction);
		return { ...t, measureIndex: p.bar, rhythmicPosition: { ...t.rhythmicPosition, fraction: p.pos } };
	});

	const bars_: BarMap = {
		identity: false,
		toSong: (r) => piecesOf.get(r)?.[0]?.bar ?? r,
		toReading: (s) => bars[s]?.pieces[0].reading ?? s,
	};
	return {
		score: {
			...score,
			measures,
			keySignatures,
			...(clefs ? { clefs } : {}),
			timeSignatures,
			tempoMarkings,
			...(tempoWords ? { tempoWords } : {}),
			...(metricModulations ? { metricModulations } : {}),
			vocalLine: out,
		},
		line: out,
		bars: bars_,
		applied: true,
	};
}
