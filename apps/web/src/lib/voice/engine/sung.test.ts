/**
 * Lane 67, Step 2: the threshold. Five of the six core vowels sung make a voice personal; below five, nothing recorded unlocks anything personal.
 * The test of "sung" itself is pinned in `plausibility.test.ts` and `analysis/every-sung-reading-counts.test.ts`.
 */
import { describe, expect, it } from 'vitest';
import type { CalibratedFormant, Vowel } from './types';
import { CORE_VOWELS, coreCount, isPersonal, stableCore } from './sung';

const r = (f1: number, extra: Partial<CalibratedFormant> = {}): CalibratedFormant =>
	({ f1, f2: 1500, f2Quality: 'clear', confidence: 'high', reading: 'captured', source: 'measured-user', ...extra }) as CalibratedFormant;
const of = (vs: readonly Vowel[], over: Partial<Record<Vowel, CalibratedFormant>> = {}) => ({ ...Object.fromEntries(vs.map((v) => [v, r(400)])), ...over }) as Partial<Record<Vowel, CalibratedFormant>>;

describe('the six core vowels', () => {
	it('are [i], [e], [ɛ], [ɑ], [o], [u], and no hard vowel', () => {
		expect([...CORE_VOWELS]).toEqual(['i', 'e', 'ɛ', 'ɑ', 'o', 'u']);
	});
});

describe('isPersonal: five of the six core vowels', () => {
	it('is false for 0 to 4 core vowels sung and true for 5 and 6', () => {
		const counts = [0, 1, 2, 3, 4, 5, 6].map((n) => isPersonal(of(CORE_VOWELS.slice(0, n))));
		expect(counts).toEqual([false, false, false, false, false, true, true]);
		expect([0, 1, 2, 3, 4, 5, 6].map((n) => coreCount(of(CORE_VOWELS.slice(0, n))))).toEqual([0, 1, 2, 3, 4, 5, 6]);
	});
	it('does not count the four hard vowels: all four and one core vowel is not personal', () => {
		expect(coreCount(of(['ɨ', 'ɪ', 'ʌ', 'a', 'u']))).toBe(1);
		expect(isPersonal(of(['ɨ', 'ɪ', 'ʌ', 'a', 'u', 'i', 'e', 'ɛ']))).toBe(false);
		expect(isPersonal(of(['ɨ', 'ɪ', 'ʌ', 'a', 'u', 'i', 'e', 'ɛ', 'o']))).toBe(true);
	});
	it('does not count an unstable reading (confidence low) toward five: four stable and one unstable is not personal (lane 68)', () => {
		const p = of(['i', 'e', 'ɛ', 'ɑ'], { o: r(450, { confidence: 'low', reading: 'provisional' }) });
		expect(coreCount(p)).toBe(4);
		expect(isPersonal(p)).toBe(false);
	});
	it('counts five stable and one unstable as five: the unstable take is neither counted nor in the way', () => {
		const p = of(['i', 'e', 'ɛ', 'ɑ', 'o'], { u: r(300, { confidence: 'low', reading: 'provisional' }) });
		expect(coreCount(p)).toBe(5);
		expect(isPersonal(p)).toBe(true);
		expect(stableCore(p)).toEqual(['i', 'e', 'ɛ', 'ɑ', 'o']);
	});
	it('counts an unstable reading the singer kept (plausibilityOverride) as stable (lane 68, amendment 2)', () => {
		const p = of(['i', 'e', 'ɛ', 'ɑ'], { o: r(450, { confidence: 'low', reading: 'provisional', plausibilityOverride: true }) });
		expect(coreCount(p)).toBe(5);
		expect(isPersonal(p)).toBe(true);
	});
	it('stableCore lists the stable core vowels in roster order, never a hard vowel', () => {
		expect(stableCore(of(['u', 'i', 'ɨ', 'o']))).toEqual(['i', 'o', 'u']);
	});
	it('counts a reading beyond Ilya\'s reference values, kept or not', () => {
		expect(isPersonal(of(['e', 'ɛ', 'ɑ', 'o'], { i: r(1063, { plausibility: 'implausible' }) }))).toBe(true);
	});
	it('does not count an estimate or a take with no first resonance', () => {
		expect(isPersonal(of(['i', 'e', 'ɛ', 'ɑ'], { o: r(450, { reading: 'estimated' }) }))).toBe(false);
		expect(isPersonal(of(['i', 'e', 'ɛ', 'ɑ'], { o: r(0) }))).toBe(false);
	});
});
