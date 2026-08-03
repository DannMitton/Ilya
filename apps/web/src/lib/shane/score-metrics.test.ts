/**
 * Acceptance for the measurement seam.
 *
 * **Standing Rule V1.** No expected value below comes from the mechanism under
 * test. Every figure is derived by hand from `demoScore()`'s own printed note
 * values, or from a published definition, and the derivation is written out
 * beside the assertion so it can be checked without running anything.
 *
 * **The fixture is READ, never reconstructed.** `demoScore()` is the package's
 * own maintained four-measure fixture, exported from the barrel. Nothing here
 * rebuilds it from a summary.
 *
 * **`asNumber` is local on purpose.** Comparing the seam's Fractions using the
 * package's own `fractionToNumber` would be a consistency check between two
 * outputs of one mechanism, which this project's Consistency Corollary says is
 * never evidence of correctness. Four lines of arithmetic here are independent.
 *
 * **No IPA appears in this file.** The vowel resolver below is a PLUMBING STUB
 * returning opaque labels. It makes no phonological claim, and it must not:
 * every IPA string in this project comes from Ilya (the standing directive),
 * and a test fixture is not an exception to that.
 */

import { describe, expect, it } from 'vitest';
import { demoScore, type Fraction, type VocalLineEvent } from '@ilya/score-parser';
import { scoreMetrics } from './score-metrics';

/** Local, so no assertion is checked against the package's own arithmetic. */
const asNumber = (f: Fraction): number => f.numerator / f.denominator;

/**
 * Hand-derived from `demoScore()`'s printed note values, in quaver-equivalents
 * (an eighth is 1). The three triplet eighths are 3-in-the-time-of-2, so each
 * sounds 2/3 of a quaver.
 *
 *   MIDI 41 (F2)   n1 quarter 2 + n7 eighth 1                        = 3
 *   MIDI 43 (G2)   n8 eighth 1 + n18 eighth 1                        = 2
 *   MIDI 45 (A2)   n2 1 + n9 sixteenth 1/2 + n13 trip 2/3 + n19 1
 *                    + n20 quarter 2                                 = 31/6
 *   MIDI 46 (B♭2)  n10 sixteenth 1/2 + n14 trip 2/3                  = 7/6
 *   MIDI 47 (B2)   n3 eighth 1                                       = 1
 *   MIDI 48 (C3)   n15 trip 2/3                                      = 2/3
 *   MIDI 50 (D3)   n5 quarter 2 + n16 quarter 2                      = 4
 *   MIDI 52 (E3)   n11 eighth 1                                      = 1
 *   MIDI 62 (D4)   n6 half 4                                         = 4
 *                                                                  ------
 *                                                                     22
 */
const EXPECTED_BY_PITCH: Record<number, number> = {
	41: 3,
	43: 2,
	45: 31 / 6,
	46: 7 / 6,
	47: 1,
	48: 2 / 3,
	50: 4,
	52: 1,
	62: 4
};
const EXPECTED_TOTAL_QUAVERS = 22;

describe('scoreMetrics: what it sums', () => {
	it('DENOTATION: the full return, destructured, with each field in domain terms', () => {
		const { phonation, tessitura, tempo, seconds, foldCycles } = scoreMetrics(demoScore());

		expect(phonation.unit).toBe('quaver-equivalents');
		expect(phonation.byPitch).toBeInstanceOf(Map);
		expect(typeof phonation.total.numerator).toBe('number');
		expect(typeof phonation.total.denominator).toBe('number');
		expect(phonation.total.denominator).not.toBe(0);
		expect(tessitura).toBeDefined();
		// demoScore states no tempo of any kind. See the abstention block below.
		expect(tempo).toBeUndefined();
		expect(seconds).toBeUndefined();
		expect(foldCycles).toBeUndefined();
	});

	it('sums 22 quavers, and the per-pitch distribution matches the printed note values', () => {
		const { phonation } = scoreMetrics(demoScore());

		expect(asNumber(phonation.total)).toBeCloseTo(EXPECTED_TOTAL_QUAVERS, 10);
		// The DISTRIBUTION, not just the total: a total can be right while every
		// pitch inside it is wrong.
		expect([...phonation.byPitch.keys()].sort((a, b) => a - b)).toEqual(
			Object.keys(EXPECTED_BY_PITCH)
				.map(Number)
				.sort((a, b) => a - b)
		);
		for (const [midi, expected] of Object.entries(EXPECTED_BY_PITCH)) {
			const got = phonation.byPitch.get(Number(midi));
			expect(got, `MIDI ${midi}`).toBeDefined();
			expect(asNumber(got as Fraction), `MIDI ${midi}`).toBeCloseTo(expected, 10);
		}
	});

	it('counts its population: 17 pitched notes, 4 rests, 0 unpitched', () => {
		// Counted off the fixture itself rather than asserted from memory of it.
		const score = demoScore();
		const pitched = score.vocalLine.filter((e) => e.type === 'note' && e.pitch).length;
		const rests = score.vocalLine.filter((e) => e.type === 'rest').length;

		const { phonation } = scoreMetrics(score);
		expect(phonation.coverage.pitchedNotes).toBe(pitched);
		expect(phonation.coverage.rests).toBe(rests);
		expect(phonation.coverage.unpitchedNotes).toBe(0);
		// Rests are excluded by definition: this is phonation time, not elapsed time.
		expect(pitched).toBe(17);
		expect(rests).toBe(4);
	});

	it('every bar of the fixture closes against its own metre', () => {
		// demoScore is five 3/4 bars, six quavers each, and its triplet carries the
		// tuplet adjustment on `fraction` as well as on base/dots. So both readings
		// of sounding length agree everywhere and nothing needs arbitrating. This
		// is the CLEAN case; the corpus is where the two readings diverge.
		const { phonation } = scoreMetrics(demoScore());
		expect(phonation.trust.untrustedBars).toBe(0);
		expect(phonation.trust.untrustedMeasureIndices).toEqual([]);
		expect(asNumber(phonation.trust.untrustedQuavers)).toBe(0);
		expect(phonation.trust.bars).toHaveLength(5);
		expect(phonation.trust.bars.map((b) => b.verdict)).toEqual([
			'agreed',
			'agreed',
			'agreed',
			'agreed',
			'agreed'
		]);
	});
});

describe('scoreMetrics: Pacheco tessitura', () => {
	it('cuts at half the tallest bar, and names the pitch that sits on the line', () => {
		// Tallest bar is MIDI 45 at 31/6 quavers, so the threshold is 31/12,
		// which is 2.5833... Bars reaching it: 41 (3), 45 (31/6), 50 (4), 62 (4).
		// Bars within half a quaver of the line: 41 only, at |3 − 31/12| = 5/12.
		const { tessitura } = scoreMetrics(demoScore());

		expect(tessitura).toBeDefined();
		expect(tessitura?.low).toBe(41);
		expect(tessitura?.high).toBe(62);
		expect(tessitura?.basis).toBe('half-maximum');
		expect(tessitura?.degenerate).toBe(false);
		expect(tessitura?.barsReaching).toBe(4);
		expect(asNumber(tessitura?.threshold as Fraction)).toBeCloseTo(31 / 12, 10);
		// The band is unstable at its bottom edge, and it says so.
		expect(tessitura?.marginal).toBe(true);
		expect(tessitura?.marginalPitches).toEqual([41]);
	});

	it('NEGATIVE CONTROL: a score with nothing sung yields no band, not a zero-width one', () => {
		const empty = demoScore();
		empty.vocalLine = [];
		const { phonation, tessitura } = scoreMetrics(empty);

		expect(asNumber(phonation.total)).toBe(0);
		expect(tessitura).toBeUndefined();
	});
});

describe('scoreMetrics: abstention, and what it costs to break it', () => {
	it('NEGATIVE CONTROL: no stated tempo means no seconds and no cycle count', () => {
		// Fired on real input from the population this seam reads: demoScore
		// carries an empty `tempoMarkings` and no `tempoWords` at all.
		const score = demoScore();
		expect(score.tempoMarkings).toEqual([]);
		expect(score.tempoWords).toBeUndefined();

		const m = scoreMetrics(score);
		expect(m.tempo).toBeUndefined();
		expect(m.seconds).toBeUndefined();
		expect(m.foldCycles).toBeUndefined();
		// And the tempo-free half is still fully present. Abstaining on one
		// quantity must not suppress another.
		expect(asNumber(m.phonation.total)).toBeCloseTo(EXPECTED_TOTAL_QUAVERS, 10);
		expect(m.tessitura).toBeDefined();
	});

	it("PROVENANCE: the singer's override reaches every tempo-consuming call", () => {
		// 22 quavers is 22/8 of a whole note; at a quarter-note beat that is 11
		// beats; at 120 bpm that is 11 × 60 ÷ 120 = 5.5 seconds. Derived from the
		// definition of bpm, not from `secondsFor`.
		const m = scoreMetrics(demoScore(), { tempo: { overrideBpm: 120 } });

		expect(m.tempo?.provenance).toBe('user');
		expect(m.tempo?.bpm).toBe(120);
		expect(m.seconds?.seconds).toBeCloseTo(5.5, 10);
		expect(m.foldCycles).toBeDefined();
	});

	it('CONSISTENCY: seconds and the cycle count cannot disagree about the tempo', () => {
		// This is the one thing the seam itself can get wrong. If the two calls
		// were handed different options they would each be internally coherent and
		// jointly false, which is exactly the failure that looks finished.
		const m = scoreMetrics(demoScore(), { tempo: { overrideBpm: 96 } });

		expect(m.seconds?.seconds).toBeCloseTo(m.foldCycles?.seconds as number, 10);
		expect(m.seconds?.tempo.bpm).toBe(m.foldCycles?.tempo.bpm);
		expect(m.foldCycles?.tempo.provenance).toBe('user');
	});

	it('CROSS-MEASURE: the cycle count reproduces an independent hand derivation', () => {
		// cycles = Σ over pitches of f₀(midi) × seconds at that pitch, with
		// f₀ = 440 × 2^((m − 69)/12) by the definition of equal temperament at
		// A4 = 440. At quarter = 120 a quaver lasts 0.25 s, so:
		//   Σ quavers × f₀ = 3×87.307 + 2×97.999 + (31/6)×110 + (7/6)×116.541
		//                  + 1×123.471 + (2/3)×130.813 + 4×146.832 + 1×164.814
		//                  + 4×293.665
		//                  = 3299.698...
		//   cycles = 0.25 × 3299.698... = 824.9246
		// Computed from the formula, never from `hzOf`.
		const m = scoreMetrics(demoScore(), { tempo: { overrideBpm: 120 } });
		expect(m.foldCycles?.cycles).toBeCloseTo(824.9246, 3);
		// An override has no band, so there is no range to show and none is invented.
		expect(m.foldCycles?.cyclesRange).toBeUndefined();
	});
});

describe('scoreMetrics: the vowel channel', () => {
	/**
	 * PLUMBING STUB. Returns an opaque label, never a phoneme. Its only job is
	 * to prove the seam passes a caller's resolver through and counts what it
	 * answers. A real resolver is `buildVowelResolver`, and a real vowel comes
	 * from Ilya.
	 */
	const stub = (e: VocalLineEvent): string | undefined =>
		e.syllable ? `label-${e.measureIndex % 2}` : undefined;

	it('absent resolver means absent totals, not empty ones', () => {
		const { phonation } = scoreMetrics(demoScore());

		expect(phonation.byVowel).toBeUndefined();
		expect(phonation.byPitchByVowel).toBeUndefined();
		expect(phonation.coverage.notesWithVowel).toBeUndefined();
		expect(phonation.coverage.notesWithoutVowel).toBeUndefined();
	});

	it('a supplied resolver is used, and its abstentions are counted rather than dropped', () => {
		const score = demoScore();
		// The expectation is computed off the fixture with the same predicate the
		// stub uses. That is deliberate: the claim under test is that the seam
		// PASSED the resolver through and counted its answers, not that the stub
		// is phonologically right, which it is not and does not claim to be.
		const pitched = score.vocalLine.filter((e) => e.type === 'note' && e.pitch);
		const withVowel = pitched.filter((e) => stub(e) !== undefined).length;

		const { phonation } = scoreMetrics(score, { vowelForEvent: stub });

		expect(phonation.byVowel).toBeInstanceOf(Map);
		expect(phonation.byPitchByVowel).toBeInstanceOf(Map);
		expect(phonation.coverage.notesWithVowel).toBe(withVowel);
		expect(phonation.coverage.notesWithoutVowel).toBe(pitched.length - withVowel);
		// Nothing is lost between the two views: the per-vowel sums must add back
		// to the sung time of the notes a vowel was resolved for.
		const vowelSum = [...(phonation.byVowel as Map<string, Fraction>).values()].reduce(
			(a, f) => a + asNumber(f),
			0
		);
		expect(vowelSum).toBeGreaterThan(0);
		expect(vowelSum).toBeLessThanOrEqual(asNumber(phonation.total) + 1e-9);
	});
});
