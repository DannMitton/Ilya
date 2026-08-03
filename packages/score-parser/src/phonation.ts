/**
 * Phonation-time aggregation.
 *
 * The layer Shane is named for and did not have: summed SOUNDING time per
 * pitch, per vowel, and per pitch-and-vowel, in Pacheco's quaver-equivalents,
 * with an optional conversion to seconds where the score states a tempo.
 *
 * Three consumers land on this one layer (E.19 handover §6): the Chapter 6
 * pitch-sums histogram, both tessitura methods (Pacheco's half-maximum band
 * and any duration-weighted percentile), and the vocal-fold oscillation count.
 *
 * ── Why sounding length is not simply `duration.fraction` ──────────────
 *
 * `types.ts` states the contract: "The source of truth is `base`/`dots`/
 * `tuplet`; this field [`fraction`] is derived." In a spec-conformant MusicXML
 * file the two readings agree and everything here is a no-op. They do NOT
 * always agree. MEASURED 2026-07-30 over the six-song Sunless corpus converted
 * by `musx2mxl`: `<duration>` is written WITHOUT the tuplet adjustment, so
 * `duration.fraction` overstates every tuplet note. Sunless 3 came to 340
 * quavers read that way against 280.5 by every other witness, a 21 percent
 * overstatement, and 16 of its 41 bars did not close against their own metre.
 *
 * So this module does not pick a reading. It cross-checks both against an
 * oracle neither produced: **a measure must sum to its own time signature.**
 * Where the two readings disagree, the bar that closes decides. Where neither
 * closes, the bar is marked UNTRUSTED and its contribution is reported
 * separately rather than folded silently into a total. A caller may then
 * abstain, warn, or proceed knowingly, but nothing here vouches for a figure
 * the metre contradicts.
 *
 * MEASURED, same corpus: reading from `base`/`dots`/`tuplet` closes 197 of 207
 * bars where a metre is known; reading `duration.fraction` closes 183. Exactly
 * two bars in the corpus close under neither, holding 22 quavers in total.
 *
 * ── Units ──────────────────────────────────────────────────────────────
 *
 * Quaver-equivalents, per Pacheco 2013 and per the `methodology_unit` of
 * Mitton's own 2019 dataset. Quavers compare repertoire across tempi where
 * seconds cannot. Seconds are offered alongside, never instead, and only where
 * the score states a tempo: `secondsFor` returns `undefined` rather than
 * assuming a bpm.
 *
 * All arithmetic is exact rational. The dataset carries half-quaver values and
 * the Pacheco threshold rule has a knife-edge that turned on a single
 * half-quaver bar (E.19 §7.1), so float drift is not an acceptable cost.
 *
 * Pure and non-destructive: the input `ParsedScore` is never mutated.
 */

import type { Duration, Fraction, ParsedScore, Pitch, VocalLineEvent } from './types';
import { resolveTempo, type ResolveTempoOptions, type TempoResolution } from './tempo-seam';

// ── exact rational arithmetic ───────────────────────────────────────

function gcd(a: number, b: number): number {
	a = Math.abs(a);
	b = Math.abs(b);
	while (b) {
		const t = a % b;
		a = b;
		b = t;
	}
	return a || 1;
}

/** Normalise a fraction to lowest terms with a positive denominator. */
export function normalizeFraction(f: Fraction): Fraction {
	let { numerator: n, denominator: d } = f;
	if (!Number.isInteger(n) || !Number.isInteger(d)) {
		throw new TypeError(`Fraction must be integral, got ${n}/${d}`);
	}
	if (d === 0) throw new RangeError('Fraction denominator is zero');
	if (d < 0) {
		n = -n;
		d = -d;
	}
	const g = gcd(n, d);
	return { numerator: n / g, denominator: d / g };
}

function addF(a: Fraction, b: Fraction): Fraction {
	return normalizeFraction({
		numerator: a.numerator * b.denominator + b.numerator * a.denominator,
		denominator: a.denominator * b.denominator,
	});
}

function mulF(a: Fraction, b: Fraction): Fraction {
	return normalizeFraction({ numerator: a.numerator * b.numerator, denominator: a.denominator * b.denominator });
}

function cmpF(a: Fraction, b: Fraction): number {
	return a.numerator * b.denominator - b.numerator * a.denominator;
}

/** Decimal value of a fraction. For display and comparison only, never for accumulation. */
export function fractionToNumber(f: Fraction): number {
	return f.numerator / f.denominator;
}

const ZERO: Fraction = { numerator: 0, denominator: 1 };
const QUAVERS_PER_WHOLE: Fraction = { numerator: 8, denominator: 1 };

// ── sounding length, and its two readings ───────────────────────────

const BASE_IN_WHOLES: Record<string, Fraction> = {
	maxima: { numerator: 8, denominator: 1 },
	long: { numerator: 4, denominator: 1 },
	breve: { numerator: 2, denominator: 1 },
	whole: { numerator: 1, denominator: 1 },
	half: { numerator: 1, denominator: 2 },
	quarter: { numerator: 1, denominator: 4 },
	eighth: { numerator: 1, denominator: 8 },
	'16th': { numerator: 1, denominator: 16 },
	'32nd': { numerator: 1, denominator: 32 },
	'64th': { numerator: 1, denominator: 64 },
	'128th': { numerator: 1, denominator: 128 },
	'256th': { numerator: 1, denominator: 256 },
	'512th': { numerator: 1, denominator: 512 },
	'1024th': { numerator: 1, denominator: 1024 },
};

/**
 * Reading B: sounding length in whole-note units derived from the declared
 * source of truth, `base` × dot factor × (`normalNotes` / `actualNotes`).
 */
export function soundingFromNotation(duration: Duration): Fraction {
	const base = BASE_IN_WHOLES[duration.base];
	if (!base) throw new RangeError(`Unknown note base ${JSON.stringify(duration.base)}`);
	const dots = duration.dots ?? 0;
	if (!Number.isInteger(dots) || dots < 0 || dots > 3) {
		throw new RangeError(`Dots must be an integer 0 to 3, got ${String(duration.dots)}`);
	}
	let total = base;
	let increment = base;
	for (let i = 0; i < dots; i++) {
		increment = mulF(increment, { numerator: 1, denominator: 2 });
		total = addF(total, increment);
	}
	if (duration.tuplet) {
		const { actualNotes, normalNotes } = duration.tuplet;
		if (!Number.isInteger(actualNotes) || !Number.isInteger(normalNotes) || actualNotes <= 0 || normalNotes <= 0) {
			throw new RangeError(`Unusable tuplet ${JSON.stringify(duration.tuplet)}`);
		}
		total = mulF(total, { numerator: normalNotes, denominator: actualNotes });
	}
	return total;
}

/** Reading A: sounding length as the parser derived it into `duration.fraction`. */
export function soundingFromFraction(duration: Duration): Fraction {
	const f = duration.fraction;
	if (!f || !Number.isInteger(f.numerator) || !Number.isInteger(f.denominator)) {
		throw new TypeError(`duration.fraction is unusable: ${JSON.stringify(f)}`);
	}
	return normalizeFraction(f);
}

/** Which reading a measure's events were summed under, and why. */
export type BarVerdict =
	/** Both readings agree. Nothing to arbitrate. */
	| 'agreed'
	/** The readings differ and the notation reading closes the bar against its metre. */
	| 'metre-chose-notation'
	/** The readings differ and the parser's `fraction` closes the bar against its metre. */
	| 'metre-chose-fraction'
	/** The readings differ and NEITHER closes the bar. Nothing here vouches for this bar. */
	| 'untrusted'
	/** No metre is known for this bar, so the metre could not arbitrate. */
	| 'no-metre'
	/**
	 * A pickup bar. It is SHORTER than its metre by definition, so the metre
	 * cannot arbitrate here and no bar-sum failure is claimed against it.
	 * A rule may not fail on facts outside its subject.
	 */
	| 'pickup-not-arbitrable';

export interface BarReading {
	measureIndex: number;
	verdict: BarVerdict;
	/** The metre in force, when known. */
	expected?: Fraction;
	/** Sum under the notation reading. */
	notationSum: Fraction;
	/** Sum under the `fraction` reading. */
	fractionSum: Fraction;
}

// ── the aggregation ─────────────────────────────────────────────────

/**
 * Resolves the operative sung vowel for an event, or `undefined` where there
 * is none to resolve. Deliberately the same shape as `overlay-engine`'s
 * `VowelResolver`, so the app passes its own resolver and this module never
 * decides what a vowel is.
 */
export type VowelForEvent = (event: VocalLineEvent) => string | undefined;

export interface PhonationOptions {
	/**
	 * Supplies the operative vowel per event. Omit it and the per-vowel and
	 * per-pitch-per-vowel totals are absent (not empty): no vowel was ever
	 * asked for, so no claim is made about any.
	 */
	vowelForEvent?: VowelForEvent;
}

export interface PhonationCoverage {
	/** Note events carrying a pitch, the population every pitch total is drawn from. */
	pitchedNotes: number;
	/** Rest events, excluded by definition: this is phonation time, not elapsed time. */
	rests: number;
	/** Note events with no pitch. Counted, never silently dropped. */
	unpitchedNotes: number;
	/** Pitched notes for which a vowel was resolved. Absent when no resolver was supplied. */
	notesWithVowel?: number;
	/** Pitched notes for which the resolver abstained. Absent when no resolver was supplied. */
	notesWithoutVowel?: number;
}

export interface PhonationTrust {
	/** Bars where the two readings of sounding length disagreed. */
	arbitratedBars: number;
	/** Bars where neither reading closes against the metre. */
	untrustedBars: number;
	/** Measure indices of those untrusted bars, so a caller can name them. */
	untrustedMeasureIndices: number[];
	/**
	 * Quavers of sung time sitting inside an untrusted bar. This quantity is
	 * INCLUDED in the totals below and reported here so a caller may decide;
	 * it is never quietly excluded, which would be a second unvouched claim.
	 */
	untrustedQuavers: Fraction;
	/** Per-bar detail, for attestation. */
	bars: BarReading[];
}

export interface PhonationTotals {
	/** Pacheco's unit throughout. Stated on the value so a consumer cannot mistake it. */
	unit: 'quaver-equivalents';
	/** Summed sounding time per MIDI pitch number. Enharmonics collapse; A♯3 and B♭3 are one key. */
	byPitch: Map<number, Fraction>;
	/** Summed sounding time per vowel. Absent when no resolver was supplied. */
	byVowel?: Map<string, Fraction>;
	/** Summed sounding time per pitch, then per vowel. Absent when no resolver was supplied. */
	byPitchByVowel?: Map<number, Map<string, Fraction>>;
	/** Total sung time. Equals the sum of `byPitch`. */
	total: Fraction;
	coverage: PhonationCoverage;
	trust: PhonationTrust;
}

/** MIDI number for a `Pitch`. Local, so this module has no import cycle with the engine. */
export function midiOf(pitch: Pitch): number {
	const semis: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
	const s = semis[pitch.step];
	if (s === undefined) throw new RangeError(`Unknown pitch step ${JSON.stringify(pitch.step)}`);
	if (!Number.isInteger(pitch.octave)) throw new TypeError(`Pitch octave must be an integer`);
	return (pitch.octave + 1) * 12 + s + (pitch.alter ?? 0);
}

/**
 * The metre each measure must close to, from the score's own `expectedDuration`
 * (which `types.ts:227` states is derived from `timeSignature`, never from the
 * notes). That independence is the whole point: the oracle must not come from
 * the events it judges. A pickup bar is excluded, since it is shorter than its
 * metre by definition and a rule may not fail on facts outside its subject.
 */
function metrePerMeasure(parsed: ParsedScore): { metre: Map<number, Fraction>; pickups: Set<number> } {
	const metre = new Map<number, Fraction>();
	const pickups = new Set<number>();
	parsed.measures.forEach((m, i) => {
		const index = Number.isInteger(m.index) ? m.index : i;
		if (m.isPickup) {
			pickups.add(index);
			return;
		}
		const expected = m.expectedDuration;
		if (expected && Number.isInteger(expected.numerator) && Number.isInteger(expected.denominator) && expected.denominator !== 0) {
			metre.set(index, normalizeFraction(expected));
			return;
		}
		const ts = m.timeSignature;
		if (ts && Number.isFinite(ts.beats) && Number.isFinite(ts.beatType) && ts.beatType > 0) {
			metre.set(index, normalizeFraction({ numerator: ts.beats, denominator: ts.beatType }));
		}
	});
	return { metre, pickups };
}

/**
 * Aggregate phonation time over a parsed score's vocal line.
 *
 * Pass a score already projected into performance order (`scoreInPerformanceOrder`)
 * when the question is what the singer actually sings; pass the notated score
 * when the question is about the page.
 */
export function aggregatePhonation(parsed: ParsedScore, options: PhonationOptions = {}): PhonationTotals {
	if (!parsed || !Array.isArray(parsed.vocalLine) || !Array.isArray(parsed.measures)) {
		throw new TypeError('aggregatePhonation needs a ParsedScore with vocalLine and measures arrays');
	}
	const { vowelForEvent } = options;
	const { metre, pickups } = metrePerMeasure(parsed);

	// 1. Read every bar under both readings and let the metre arbitrate.
	const notationBar = new Map<number, Fraction>();
	const fractionBar = new Map<number, Fraction>();
	for (const ev of parsed.vocalLine) {
		const m = ev.measureIndex;
		notationBar.set(m, addF(notationBar.get(m) ?? ZERO, soundingFromNotation(ev.duration)));
		fractionBar.set(m, addF(fractionBar.get(m) ?? ZERO, soundingFromFraction(ev.duration)));
	}

	const bars: BarReading[] = [];
	const chosen = new Map<number, 'notation' | 'fraction'>();
	for (const m of [...notationBar.keys()].sort((a, b) => a - b)) {
		const notationSum = notationBar.get(m) as Fraction;
		const fractionSum = fractionBar.get(m) as Fraction;
		const expected = metre.get(m);
		let verdict: BarVerdict;
		if (cmpF(notationSum, fractionSum) === 0) {
			verdict = 'agreed';
			chosen.set(m, 'notation');
		} else if (pickups.has(m)) {
			verdict = 'pickup-not-arbitrable';
			chosen.set(m, 'notation');
		} else if (!expected) {
			verdict = 'no-metre';
			chosen.set(m, 'notation');
		} else if (cmpF(notationSum, expected) === 0) {
			verdict = 'metre-chose-notation';
			chosen.set(m, 'notation');
		} else if (cmpF(fractionSum, expected) === 0) {
			verdict = 'metre-chose-fraction';
			chosen.set(m, 'fraction');
		} else {
			verdict = 'untrusted';
			// The notation reading is the declared source of truth, so it is what
			// the untrusted bar is summed under. The bar is named either way.
			chosen.set(m, 'notation');
		}
		bars.push({ measureIndex: m, verdict, ...(expected ? { expected } : {}), notationSum, fractionSum });
	}

	const untrusted = new Set(bars.filter((b) => b.verdict === 'untrusted').map((b) => b.measureIndex));

	// 2. Sum, in quavers, under each bar's chosen reading.
	const byPitch = new Map<number, Fraction>();
	const byVowel = vowelForEvent ? new Map<string, Fraction>() : undefined;
	const byPitchByVowel = vowelForEvent ? new Map<number, Map<string, Fraction>>() : undefined;
	let total = ZERO;
	let untrustedQuavers = ZERO;
	const coverage: PhonationCoverage = { pitchedNotes: 0, rests: 0, unpitchedNotes: 0 };
	if (vowelForEvent) {
		coverage.notesWithVowel = 0;
		coverage.notesWithoutVowel = 0;
	}

	for (const ev of parsed.vocalLine) {
		if (ev.type === 'rest') {
			coverage.rests += 1;
			continue;
		}
		if (!ev.pitch) {
			coverage.unpitchedNotes += 1;
			continue;
		}
		coverage.pitchedNotes += 1;

		const reading = chosen.get(ev.measureIndex) === 'fraction' ? soundingFromFraction : soundingFromNotation;
		const quavers = mulF(reading(ev.duration), QUAVERS_PER_WHOLE);
		const midi = midiOf(ev.pitch);

		byPitch.set(midi, addF(byPitch.get(midi) ?? ZERO, quavers));
		total = addF(total, quavers);
		if (untrusted.has(ev.measureIndex)) untrustedQuavers = addF(untrustedQuavers, quavers);

		if (vowelForEvent && byVowel && byPitchByVowel) {
			const vowel = vowelForEvent(ev);
			if (vowel === undefined) {
				coverage.notesWithoutVowel = (coverage.notesWithoutVowel ?? 0) + 1;
			} else {
				coverage.notesWithVowel = (coverage.notesWithVowel ?? 0) + 1;
				byVowel.set(vowel, addF(byVowel.get(vowel) ?? ZERO, quavers));
				const inner = byPitchByVowel.get(midi) ?? new Map<string, Fraction>();
				inner.set(vowel, addF(inner.get(vowel) ?? ZERO, quavers));
				byPitchByVowel.set(midi, inner);
			}
		}
	}

	return {
		unit: 'quaver-equivalents',
		byPitch,
		...(byVowel ? { byVowel } : {}),
		...(byPitchByVowel ? { byPitchByVowel } : {}),
		total,
		coverage,
		trust: {
			arbitratedBars: bars.filter((b) => b.verdict === 'metre-chose-notation' || b.verdict === 'metre-chose-fraction').length,
			untrustedBars: untrusted.size,
			untrustedMeasureIndices: [...untrusted].sort((a, b) => a - b),
			untrustedQuavers,
			bars,
		},
	};
}

// ── quavers to seconds, and the four caveats that travel with it ────

export interface SecondsResult {
	seconds: number;
	/** The tempo the conversion used, so the figure can be re-derived. */
	bpm: number;
	/** The beat the bpm counts, in whole-note units. */
	beatUnitInWholes: Fraction;
	/** The full resolution, so a caller can render provenance and caveats. */
	tempo: TempoResolution;
	/**
	 * The seconds this span would take at each end of an INFERRED tempo's band.
	 * Absent when the tempo is encoded or user-set, which have no band.
	 * Present means the figure is a range and a consumer must not print a point.
	 */
	secondsRange?: [number, number];
}

/**
 * Convert quaver-equivalents to seconds at a stated tempo.
 *
 * `seconds = wholeNoteUnits ÷ beatUnitInWholes × 60 ÷ bpm`.
 *
 * Returns `undefined` when the score states no tempo. It does NOT assume a
 * bpm: a fabricated tempo would make every seconds figure and every
 * oscillation count downstream of it a guess wearing a number's confidence.
 *
 * Four caveats belong beside any seconds figure a UI shows, and none of them
 * is this function's to hide (E.19 handover §6): it is nominal, not a measured
 * performance; it takes the score's first stated tempo and ignores rubato and
 * any later change; equal temperament at A4 = 440 is an assumption worth about
 * five percent against baroque pitch when the figure feeds an oscillation
 * count; and rests are excluded, which is what makes it phonation time rather
 * than elapsed time.
 */
export function secondsFor(
	quavers: Fraction,
	parsed: ParsedScore,
	options: ResolveTempoOptions = {},
): SecondsResult | undefined {
	// Reads THE SEAM, not `parsed.tempoMarkings` directly. Reading the markings
	// bypasses the designed precedence and would never see a tier default or a
	// singer's override, which is exactly the defect this call site had.
	const tempo = resolveTempo(parsed, options);
	if (!tempo) return undefined;

	// "dotted-quarter = 60" is a different beat from "quarter = 60" by half
	// again, and 6/8 songs state it that way. Ignoring `beatUnitDots` would
	// make every seconds figure in compound metre wrong by 1.5x.
	const beatBase = BASE_IN_WHOLES[tempo.beatUnit] ?? BASE_IN_WHOLES.quarter;
	if (!beatBase) return undefined;
	const beatUnitInWholes = soundingFromNotation({
		base: tempo.beatUnit,
		dots: tempo.beatUnitDots ?? 0,
		fraction: beatBase,
	} as Duration);

	const wholes = mulF(quavers, { numerator: 1, denominator: 8 });
	const beats = fractionToNumber(wholes) / fractionToNumber(beatUnitInWholes);
	// Prefer the EXACT bpm where the seam supplied one: the decimal `bpm` is a
	// display value and computing from it reintroduces the drift the exact
	// fraction exists to remove (Dann, 2026-07-31: work in proportions, convert
	// once at the end).
	const at = (bpm: number) => (beats * 60) / bpm;
	const atExact = (f: Fraction) => (beats * 60 * f.denominator) / f.numerator;
	const secondsAt = tempo.bpmExact ? atExact(tempo.bpmExact) : at(tempo.bpm);

	return {
		seconds: secondsAt,
		bpm: tempo.bpm,
		beatUnitInWholes,
		tempo,
		// A band tempo yields a band of seconds. Faster bpm gives fewer seconds,
		// so the low end of the bpm band is the HIGH end of the duration band.
		...(tempo.rangeExact
			? { secondsRange: [atExact(tempo.rangeExact[1]), atExact(tempo.rangeExact[0])] as [number, number] }
			: tempo.range
				? { secondsRange: [at(tempo.range[1]), at(tempo.range[0])] as [number, number] }
				: {}),
	};
}

/**
 * Nominal vocal-fold oscillations over a span of phonation, at equal
 * temperament with A4 = 440.
 *
 * `oscillations = f₀ × seconds`. Returns `undefined` wherever `secondsFor`
 * does. Nominal, never measured: it counts the oscillations a perfectly
 * in-tune, perfectly metronomic performance of the notated page would
 * produce, which is a property of the score, not of a singer.
 */
export function nominalOscillations(
	midi: number,
	quavers: Fraction,
	parsed: ParsedScore,
	options: ResolveTempoOptions = {},
): number | undefined {
	const s = secondsFor(quavers, parsed, options);
	if (!s) return undefined;
	return hzOf(midi) * s.seconds;
}

/** Equal-tempered frequency, A4 = 440 by the definition of the standard. */
export function hzOf(midi: number): number {
	if (!Number.isFinite(midi)) throw new TypeError(`hzOf needs a finite MIDI number, got ${String(midi)}`);
	return 440 * Math.pow(2, (midi - 69) / 12);
}

export interface FoldCycleResult {
	/** Nominal vocal-fold cycles over the whole sung line. */
	cycles: number;
	/**
	 * The count at each end of an INFERRED tempo's band. Absent for an encoded or
	 * user-set tempo. **Present means a consumer must show a range, not a point.**
	 */
	cyclesRange?: [number, number];
	seconds: number;
	tempo: TempoResolution;
}

/**
 * Total nominal vocal-fold cycles for a whole aggregation.
 *
 * Sums pitch by pitch, because frequency differs per pitch and the total is not
 * `f(total duration)`. Returns `undefined` wherever the tempo is unresolvable.
 *
 * Nominal throughout: it counts the cycles a perfectly in-tune, perfectly
 * metronomic performance of the notated page would produce. It is a property of
 * the score, not of a singer, and where `cyclesRange` is present it is a learned
 * guess with its spread attached.
 */
export function totalFoldCycles(
	totals: PhonationTotals,
	parsed: ParsedScore,
	options: ResolveTempoOptions = {},
): FoldCycleResult | undefined {
	const whole = secondsFor(totals.total, parsed, options);
	if (!whole) return undefined;

	const cyclesAt = (bpmScale: number): number => {
		let sum = 0;
		for (const [midi, q] of totals.byPitch) {
			const s = secondsFor(q, parsed, options);
			if (!s) continue;
			sum += hzOf(midi) * s.seconds * bpmScale;
		}
		return sum;
	};

	const cycles = cyclesAt(1);
	const band = whole.tempo.range;
	return {
		cycles,
		seconds: whole.seconds,
		tempo: whole.tempo,
		// Cycles scale inversely with bpm, so the band's fast end gives the fewest.
		...(band
			? { cyclesRange: [cycles * (whole.tempo.bpm / band[1]), cycles * (whole.tempo.bpm / band[0])] as [number, number] }
			: {}),
	};
}
