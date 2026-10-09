/**
 * Does one doubtful bar move the tessitura? (Dann, 2026-10-09: "I'm troubled
 * that one bar's miscount disrupts our whole system for tessitura
 * identification. Can't we lessen or obviate the impact of an anomalous bar?")
 *
 * Until now a single bar the metre contradicts withheld the whole band
 * (`tessituraRow`), on the reasoning that Pacheco's cut can turn on half a
 * quaver. That holds only where the cut does turn. Here the band is cut again
 * under every reading of each doubtful bar the score itself offers:
 *
 *   1. as written, the notation reading `aggregatePhonation` chose;
 *   2. as the parser's fractions give it;
 *   3. as the time signature says it should be (the bar's pitches kept in the
 *      same proportions, scaled to the metre);
 *   4. the bar absent altogether, each doubtful bar alone and all together.
 *
 * The band stands only if every one of those cuts gives the same two ends. A
 * bar the parser could not close has, by those readings, a length somewhere
 * between nothing and what it asks, so a band the readings all agree on does
 * not depend on the bar. Where any cut moves, the caller withholds as before.
 *
 * What this is not: a proof. Where the metre itself was misread (an OMR read
 * that states 6/8 as 4/8), the true bar may lie outside these readings, and the
 * page keeps naming the doubtful bars elsewhere (`untrustedMeasures`). Pure.
 */
import { aggregatePhonation, pachecoTessitura, type Fraction, type ParsedScore, type TessituraResult } from '@ilya/score-parser';

const add = (a: Fraction, b: Fraction): Fraction => ({
	numerator: a.numerator * b.denominator + b.numerator * a.denominator,
	denominator: a.denominator * b.denominator,
});
const mul = (a: Fraction, b: Fraction): Fraction => ({ numerator: a.numerator * b.numerator, denominator: a.denominator * b.denominator });
const ratio = (num: Fraction, den: Fraction): Fraction | null =>
	den.numerator > 0 ? { numerator: num.numerator * den.denominator, denominator: num.denominator * den.numerator } : null;

/**
 * The band at the bars' written time, if and only if it is the same band under
 * every reading above; otherwise undefined.
 */
export function bandStableUnderDoubt(score: ParsedScore, doubtful: ReadonlySet<number>): TessituraResult | undefined {
	const totals = aggregatePhonation(score);
	const trusted = aggregatePhonation({ ...score, vocalLine: score.vocalLine.filter((ev) => !doubtful.has(ev.measureIndex)) }).byPitch;
	const bars = totals.trust.bars.filter((b) => doubtful.has(b.measureIndex));
	const own = new Map(bars.map((b) => [b.measureIndex, aggregatePhonation({ ...score, vocalLine: score.vocalLine.filter((ev) => ev.measureIndex === b.measureIndex) }).byPitch]));

	const bandWith = (factorOf: (bar: (typeof bars)[number]) => Fraction | null): TessituraResult | undefined => {
		const combined = new Map<number, Fraction>(trusted);
		for (const bar of bars) {
			const f = factorOf(bar);
			if (!f) continue;
			for (const [midi, q] of own.get(bar.measureIndex)!) {
				const scaled = mul(q, f);
				combined.set(midi, combined.has(midi) ? add(combined.get(midi)!, scaled) : scaled);
			}
		}
		return pachecoTessitura(combined);
	};

	const ONE: Fraction = { numerator: 1, denominator: 1 };
	const written = bandWith(() => ONE);
	if (!written) return undefined;
	const readings: Array<(bar: (typeof bars)[number]) => Fraction | null> = [
		(bar) => ratio(bar.fractionSum, bar.notationSum),
		(bar) => (bar.expected ? ratio(bar.expected, bar.notationSum) : ONE),
		() => null,
		...bars.map((one) => (bar: (typeof bars)[number]) => (bar.measureIndex === one.measureIndex ? null : ONE)),
	];
	for (const reading of readings) {
		const other = bandWith(reading);
		if (!other || other.low !== written.low || other.high !== written.high) return undefined;
	}
	return written;
}
