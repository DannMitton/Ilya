/**
 * N.123 part 2: three measures of where the singing sits and how much of it
 * there is, read off the tessituragram's rows. Pure functions; the figure
 * only draws them. Brief: `docs/sessions/brief-code-n123-part2_r1_2026-09-30.md`.
 *
 * Every measure takes the rows `tessituragram()` already built: one row per
 * SOUNDING pitch, its time in quaver-equivalents from `aggregatePhonation`'s
 * `byPitch`, repeats counted, rests out. So the three agree with the bars to
 * the quaver, and with the phonation-time section's tempo.
 */

import type { Pitch } from '@ilya/score-parser';
import type { FigureRow, SecondsFigure } from './insights';

/** The half-mass band: the lowest and highest sounding pitch of the run, MIDI. */
export interface HalfMassBand {
	low: number;
	high: number;
	/** The run's share of the total sung time, 0.5 to 1. */
	share: number;
}

/**
 * THE HALF-MASS BAND. The narrowest contiguous run of sounding pitches whose
 * summed sung time is at least half the total; a tie in width goes to the run
 * holding more time, and a tie in both to the lower run (DESK DEFAULT, so the
 * pick is deterministic). "Contiguous" is over the rows, the pitches the piece
 * sings: an unsung semitone inside the run is crossed, never a gap. Width is
 * in semitones. The fraction one half is the desk's default; the wording
 * "half the singing" is Dann's (`OPEN.md`, N.123).
 */
export function halfMassBand(rows: readonly FigureRow[]): HalfMassBand | null {
	const total = rows.reduce((s, r) => s + r.quavers, 0);
	if (total <= 0) return null;
	let best: { i: number; j: number; width: number; mass: number } | null = null;
	for (let i = 0; i < rows.length; i++) {
		let mass = 0;
		for (let j = i; j < rows.length; j++) {
			mass += rows[j].quavers;
			if (mass * 2 < total) continue;
			const width = rows[j].midi - rows[i].midi;
			if (!best || width < best.width || (width === best.width && mass > best.mass)) best = { i, j, width, mass };
			break;
		}
	}
	return best ? { low: rows[best.i].midi, high: rows[best.j].midi, share: best.mass / total } : null;
}

/** The centre of gravity: the exact value, and the semitone it is shown as. */
export interface CentreOfGravity {
	/** Rastall's p, in MIDI numbers, unrounded. */
	value: number;
	/** The nearest semitone, MIDI. */
	midi: number;
	/** How that semitone is named. */
	pitch: Pitch;
}

const SHARP_NAMES: Array<[Pitch['step'], number]> = [
	['C', 0], ['C', 1], ['D', 0], ['D', 1], ['E', 0], ['F', 0], ['F', 1], ['G', 0], ['G', 1], ['A', 0], ['A', 1], ['B', 0],
];
const FLAT_NAMES: Array<[Pitch['step'], number]> = [
	['C', 0], ['D', -1], ['D', 0], ['E', -1], ['E', 0], ['F', 0], ['G', -1], ['G', 0], ['A', -1], ['A', 0], ['B', -1], ['B', 0],
];

function spell(midi: number, flats: boolean): Pitch {
	const pc = ((midi % 12) + 12) % 12;
	const [step, alter] = (flats ? FLAT_NAMES : SHARP_NAMES)[pc];
	return { step, alter, octave: Math.floor(midi / 12) - 1 };
}

/**
 * THE CENTRE OF GRAVITY. Rastall's PCG, as Barcan 2013 gives it (p. 37, note
 * vii): number each semitone in sequence; p = (1·d1 + 2·d2 + ... + n·dn) /
 * (d1 + d2 + ... + dn), where dn is the sounding duration of pitch n. MIDI
 * numbers are such a sequence, so p is the time-weighted mean MIDI number.
 *
 * Shown as the nearest semitone (DESK DEFAULT; a half rounds up). If the piece
 * sings it, it takes the piece's least-altered spelling there, then the lower
 * letter (C4 over B♯3; A♯3 over B♭3). If
 * not, a natural is named plainly, and a sharp or flat follows the sung
 * accidental nearest to it in pitch (the piece's own spelling of its
 * neighbours); with no sung accidental at all, a sharp (DESK DEFAULT).
 */
export function centreOfGravity(rows: readonly FigureRow[]): CentreOfGravity | null {
	const total = rows.reduce((s, r) => s + r.quavers, 0);
	if (total <= 0) return null;
	const value = rows.reduce((s, r) => s + r.midi * r.quavers, 0) / total;
	const midi = Math.round(value);
	const row = rows.find((r) => r.midi === midi);
	if (row && row.spellings.length > 0) {
		const plain = [...row.spellings].sort((a, b) => Math.abs(a.alter ?? 0) - Math.abs(b.alter ?? 0));
		return { value, midi, pitch: plain[0] };
	}
	const altered = rows
		.flatMap((r) => r.spellings.filter((p) => (p.alter ?? 0) !== 0).map((p) => ({ midi: r.midi, flat: (p.alter ?? 0) < 0 })))
		.sort((a, b) => Math.abs(a.midi - midi) - Math.abs(b.midi - midi) || a.midi - b.midi);
	return { value, midi, pitch: spell(midi, altered[0]?.flat ?? false) };
}

/** The cycle dose: a count when the tempo is a point, a span when it is inferred. */
export type CycleDose = { kind: 'point'; cycles: number } | { kind: 'range'; low: number; high: number };

/**
 * THE CYCLE DOSE. The sum over sung time of f0 × seconds, rests out (Dann's
 * ruling, `OPEN.md` §N.123). It is the vocal loading index of Titze, Švec,
 * and Popolo 2003 (*JSLHR* 46(4), pp. 919-932), after Rantala and Vilkman
 * 1999: the number of vocal-fold oscillatory periods, which Rantala and
 * Vilkman read as the number of fold collisions. f0 is each row's sounding
 * pitch at A4 = 440 Hz, equal temperament.
 *
 * `price` is the phonation-time section's own (`secondsPerQuaver`), so the
 * dose follows the tempo the page prints: a point, a range when the tempo is
 * inferred, and null when there is no tempo (DESK DEFAULT: a count without
 * time is not a count).
 */
export function cycleDose(rows: readonly FigureRow[], price: ((quavers: number) => SecondsFigure) | null): CycleDose | null {
	if (!price || rows.length === 0) return null;
	let low = 0;
	let high = 0;
	let point = true;
	for (const r of rows) {
		const hz = 440 * 2 ** ((r.midi - 69) / 12);
		const s = price(r.quavers);
		if (s.kind === 'point') {
			low += hz * s.seconds;
			high += hz * s.seconds;
		} else {
			point = false;
			low += hz * s.low;
			high += hz * s.high;
		}
	}
	return point ? { kind: 'point', cycles: low } : { kind: 'range', low: Math.min(low, high), high: Math.max(low, high) };
}

/**
 * A count to two significant figures (DESK DEFAULT), grouped as the language
 * groups thousands: "14,000"; « 14 000 » with a no-break space (U+00A0).
 */
export function formatCycles(n: number, language: 'en' | 'fr'): string {
	const rounded = Number(n.toPrecision(2));
	const s = new Intl.NumberFormat(language === 'fr' ? 'fr-CA' : 'en-CA', { maximumFractionDigits: 0 }).format(rounded);
	return language === 'fr' ? s.replace(/[\s ]/g, ' ') : s;
}
