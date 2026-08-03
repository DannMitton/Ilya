/**
 * Tessitura by Pacheco's method, over duration-weighted phonation time.
 *
 * Source: Alberto José Vieira Pacheco, "Angelica Catalani's Voice According to a
 * Method of Statistical Analysis," *Journal of Singing* 69, no. 5 (2013), p. 559:
 *
 *   "we divide the maximum value of the vertical axis by two. At this point we
 *    draw a horizontal line. This line will cut through various bars. The
 *    interval of the notes between the most extreme of these bars we designate
 *    the tessitura."
 *
 * His y-axis is "Number of quavers", so the method is DURATION-WEIGHTED. That is
 * the whole reason it needs the phonation aggregation layer: the band is a
 * property of how long the melody sits on each pitch, not of how many notes it
 * writes there.
 *
 * ── Two traps, both already paid for ──────────────────────────────────
 *
 * **"The mean of the graph" means half the MAXIMUM.** Pacheco writes "the mean"
 * but his own worked example proves he means half the tallest bar: tallest 130 at
 * B4, and he states "the mean of this graph is 65." Implementing "mean"
 * arithmetically gives a different and wrong answer.
 *
 * **The rule degenerates.** Where one bar dominates, half its height clears every
 * other bar, the line cuts nothing else, and the method returns a one-note
 * "band". Mitton (2020) hit this at *Sunless 4* and re-based on the next most
 * frequent pitch. The degeneracy is drawn on his own Fig. 6.27, physical p. 117,
 * which shows BOTH lines: the short one spanning only F♯3 and the long one
 * running E3 to C♯4. An implementation must detect the case and record which
 * basis it used rather than silently returning a single note.
 *
 * ── And one property of the method worth surfacing ────────────────────
 *
 * **The threshold has a knife-edge.** At *Sunless 4*, C♯4 holds 10.5 quavers and
 * C4 holds 11, so any threshold in (10.5, 11] separates them and the two
 * candidate answers differ by a single half-quaver bar. The rule is unstable
 * whenever bars cluster near the line. This module reports how many bars sit
 * within a margin of the threshold and marks the band `marginal` when any do.
 * That is the abstention discipline applied to a statistic: a knife-edge band
 * presented as robust is a wrong answer wearing confidence.
 *
 * Pure. Exact rational arithmetic throughout, because the knife-edge above turns
 * on half a quaver and float drift is not an acceptable cost.
 */

import type { Fraction } from './types';
import { fractionToNumber, normalizeFraction } from './phonation';

function cmpF(a: Fraction, b: Fraction): number {
	return a.numerator * b.denominator - b.numerator * a.denominator;
}

function halveF(f: Fraction): Fraction {
	return normalizeFraction({ numerator: f.numerator, denominator: f.denominator * 2 });
}

/** Which bar height the threshold was taken from. */
export type TessituraBasis =
	/** Pacheco's rule as published: half the tallest bar. */
	| 'half-maximum'
	/**
	 * Half the SECOND-tallest bar, after the published rule returned a single
	 * pitch. Mitton's documented enhancement, applied only on degeneracy and
	 * always recorded.
	 */
	| 'half-second-maximum';

export interface TessituraResult {
	/** The band, inclusive, as MIDI numbers. */
	low: number;
	high: number;
	/** Which rule produced it. Never inferred by a caller. */
	basis: TessituraBasis;
	/** The threshold the band was cut at, in quavers. */
	threshold: Fraction;
	/** How many bars reached the threshold. */
	barsReaching: number;
	/**
	 * True when the published rule returned a single pitch and the fallback ran.
	 * A caller that shows a band should say so.
	 */
	degenerate: boolean;
	/**
	 * Bars sitting within `margin` of the threshold, by MIDI number. Non-empty
	 * means the band is unstable: a slightly different threshold moves it.
	 */
	marginalPitches: number[];
	/** True when `marginalPitches` is non-empty. */
	marginal: boolean;
	/** The margin used, so the figure can be re-derived. */
	margin: Fraction;
}

/**
 * The default margin: half a quaver.
 *
 * Not a tuned constant. It is the resolution of the underlying data — Mitton's
 * 2019 dataset records phonation in half-quaver steps — so a bar within half a
 * quaver of the line could have fallen on either side of it at the recorded
 * precision.
 */
export const DEFAULT_MARGIN: Fraction = { numerator: 1, denominator: 2 };

export interface TessituraOptions {
	/** Override the marginal-band margin, in quavers. */
	margin?: Fraction;
	/**
	 * Allow the fallback on degeneracy. Default true. Set false to see the
	 * published rule's raw answer, single note and all, which is what Fig. 6.27
	 * actually draws.
	 */
	allowFallback?: boolean;
}

/**
 * Pacheco's tessitura over a pitch → quavers map, as produced by
 * `aggregatePhonation`.
 *
 * Returns `undefined` when there is nothing to cut: an empty map, or one whose
 * every bar is zero. It does NOT return a zero-width band, which would claim a
 * tessitura was found at a pitch that is never sung.
 */
export function pachecoTessitura(
	byPitch: Map<number, Fraction>,
	options: TessituraOptions = {},
): TessituraResult | undefined {
	if (!(byPitch instanceof Map)) {
		throw new TypeError('pachecoTessitura needs a Map of MIDI number to Fraction');
	}
	const margin = options.margin ?? DEFAULT_MARGIN;
	const allowFallback = options.allowFallback ?? true;

	const bars = [...byPitch.entries()].filter(([, q]) => q.numerator > 0);
	if (bars.length === 0) return undefined;

	const heights = bars.map(([, q]) => q).sort((a, b) => cmpF(b, a));
	const tallest = heights[0];

	const cut = (threshold: Fraction) => {
		const reaching = bars.filter(([, q]) => cmpF(q, threshold) >= 0).map(([midi]) => midi);
		return reaching.sort((a, b) => a - b);
	};

	let threshold = halveF(tallest);
	let basis: TessituraBasis = 'half-maximum';
	let reaching = cut(threshold);
	let degenerate = false;

	if (reaching.length <= 1 && allowFallback) {
		// The published rule cut one bar or none. Re-base on the second-tallest
		// DISTINCT height: re-basing on an equal height would change nothing and
		// would loop.
		const secondDistinct = heights.find((h) => cmpF(h, tallest) !== 0);
		if (secondDistinct) {
			degenerate = true;
			threshold = halveF(secondDistinct);
			basis = 'half-second-maximum';
			reaching = cut(threshold);
		}
	}

	if (reaching.length === 0) return undefined;

	// Bars close enough to the line that the band is unstable.
	const marginalPitches = bars
		.filter(([, q]) => {
			const diff = normalizeFraction({
				numerator: Math.abs(q.numerator * threshold.denominator - threshold.numerator * q.denominator),
				denominator: q.denominator * threshold.denominator,
			});
			return cmpF(diff, margin) <= 0;
		})
		.map(([midi]) => midi)
		.sort((a, b) => a - b);

	return {
		low: reaching[0],
		high: reaching[reaching.length - 1],
		basis,
		threshold,
		barsReaching: reaching.length,
		degenerate,
		marginalPitches,
		marginal: marginalPitches.length > 0,
		margin,
	};
}

/**
 * Pacheco's "optimal region of the voice": *"the interval resulting from the
 * intersection of all the tessituras"* (p. 559) across a singer's repertoire.
 *
 * Returns `undefined` when the intersection is empty, which is a real and
 * reportable answer about a repertoire that spans too widely to share a region.
 * An empty intersection is NOT collapsed to a point.
 */
export function optimalRegion(
	tessituras: Array<{ low: number; high: number }>,
): { low: number; high: number } | undefined {
	if (!Array.isArray(tessituras) || tessituras.length === 0) return undefined;
	let low = -Infinity;
	let high = Infinity;
	for (const t of tessituras) {
		if (!Number.isFinite(t?.low) || !Number.isFinite(t?.high)) {
			throw new TypeError(`optimalRegion needs finite low/high, got ${JSON.stringify(t)}`);
		}
		low = Math.max(low, t.low);
		high = Math.min(high, t.high);
	}
	return low <= high ? { low, high } : undefined;
}

/** Decimal threshold, for display only. Never for accumulation. */
export function thresholdAsNumber(r: TessituraResult): number {
	return fractionToNumber(r.threshold);
}
