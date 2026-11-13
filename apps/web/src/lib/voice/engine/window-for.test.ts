/**
 * N.199 Step 1: `windowFor` is the guard's window, named. `checkPlausibility` calls it, so these pin that the two
 * cannot disagree, that "no window" is exactly the guard's `unchecked`, and that `anchorF1sFor` is the loop the wizard
 * had inline.
 */
import { describe, expect, it } from 'vitest';
import { VOWELS, type CalibratedFormant, type Vowel } from './types';
import { CORE_BANDS, CEILING_MARGIN_SEMITONES, FLOOR_MARGIN_SEMITONES, anchorF1sFor, applyMargins, bucketFor, checkPlausibility, windowFor } from './plausibility';

const TYPES: Array<string | undefined> = [undefined, '', 'soprano', 'mezzo-soprano', 'contralto', 'tenor', 'countertenor', 'baritone', 'bass-baritone', 'bass', 'not-sure'];
const ANCHORS: Partial<Record<Vowel, number>> = { i: 296, e: 381, ɑ: 617, ɛ: 577, u: 346 };

describe('windowFor and checkPlausibility agree', () => {
	for (const type of TYPES) {
		for (const vowel of VOWELS) {
			it(`${vowel}, ${type ?? 'no type'}`, () => {
				for (const anchors of [undefined, ANCHORS]) {
					const w = windowFor(vowel, type, anchors);
					const r = checkPlausibility(500, vowel, type, anchors);
					if (w === null) {
						expect(r.plausibility).toBe('unchecked');
						expect(r.windowLow).toBeUndefined();
						expect(r.anchorSource).toBeNull();
					} else {
						expect(r.windowLow).toBe(Math.round(w.low * 100) / 100);
						expect(r.windowHigh).toBe(Math.round(w.high * 100) / 100);
						expect(r.anchorSource).toBe(w.anchorSource);
						expect(r.voiceTypeBucket).toBe(w.voiceTypeBucket);
						// The window's own edges are inside it, a hair beyond are out: the verdict is the window.
						expect(checkPlausibility(w.low * 1.0001, vowel, type, anchors).plausibility).toBe('plausible');
						expect(checkPlausibility(w.high * 0.9999, vowel, type, anchors).plausibility).toBe('plausible');
						expect(checkPlausibility(w.low * 0.9999, vowel, type, anchors).plausibility).toBe('implausible');
						expect(checkPlausibility(w.high * 1.0001, vowel, type, anchors).plausibility).toBe('implausible');
					}
				}
			});
		}
	}

	it('has no window for an anchor-derived vowel without its anchor, and a window with it', () => {
		expect(windowFor('ɨ', 'bass', {})).toBeNull();
		expect(windowFor('ɨ', 'bass', { e: 381 })).toBeNull();
		expect(windowFor('ɨ', 'bass', { i: 296 })).not.toBeNull();
		expect(windowFor('ɪ', 'bass', { e: 381 })!.anchorSource).toBe('anchors-derived');
		expect(windowFor('a', undefined, { ɑ: 617 })).not.toBeNull();
		expect(windowFor('ʌ', undefined, { ɑ: 617 })).not.toBeNull();
	});

	it('gives the six Bozeman vowels a window with no anchor, fixed by the type', () => {
		const bass = windowFor('i', 'bass')!;
		const sop = windowFor('i', 'soprano')!;
		expect(bass.anchorSource).toBe('bozeman');
		expect(sop.low).toBeGreaterThan(bass.low);
		expect(windowFor('i', 'bass', ANCHORS)).toEqual(bass);
	});

	it('applies Bozeman bands with the margins: the bass [i] window is D4 less 3 semitones to E4 plus 2', () => {
		// Independent of the exported constants: a margin changed in plausibility.ts fails here, as does one changed in zones.ts's test.
		const w = windowFor('i', 'bass')!;
		expect(FLOOR_MARGIN_SEMITONES).toBe(3);
		expect(CEILING_MARGIN_SEMITONES).toBe(2);
		expect(w.low).toBeCloseTo(293.66 / Math.pow(2, 3 / 12), 6);
		expect(w.high).toBeCloseTo(329.63 * Math.pow(2, 2 / 12), 6);
		expect(w.low).toBeCloseTo(246.94, 1);
		expect(w.high).toBeCloseTo(370.0, 0);
		expect(applyMargins(CORE_BANDS.bass.i[0], CORE_BANDS.bass.i[1])).toEqual({ low: w.low, high: w.high });
	});
});

describe('anchorF1sFor', () => {
	const f = (f1: number, reading: CalibratedFormant['reading']): CalibratedFormant => ({ f1, confidence: 'high', reading, source: 'measured-user' }) as CalibratedFormant;
	it('takes every stored reading that is not an estimate, Provisional ones included', () => {
		expect(anchorF1sFor({ i: f(296, 'captured'), e: f(381, 'provisional'), u: f(346, 'estimated') })).toEqual({ i: 296, e: 381 });
	});
	it('is empty for an empty profile', () => {
		expect(anchorF1sFor({})).toEqual({});
	});
});

describe('the two bucket functions are not one (pinned, not unified)', () => {
	// `bucketFor` (the guard) and `standInBucket` (the stand-ins) route differently; N.199's chart reads both. Where they
	// differ is pinned here so a change to either is a decision, not an accident. CONTRACT.md section 4's list of sites.
	it('differ for countertenor and for no type, agree on the five declared types', async () => {
		const { standInBucket } = await import('./stand-ins');
		const rows: Array<[string | undefined, string, string]> = [
			['soprano', 'soprano', 'soprano'],
			['mezzo-soprano', 'tenor-mezzo', 'tenor-mezzo'],
			['contralto', 'tenor-mezzo', 'tenor-mezzo'],
			['tenor', 'tenor-mezzo', 'tenor-mezzo'],
			['baritone', 'baritone', 'baritone'],
			['bass-baritone', 'bass', 'bass'],
			['bass', 'bass', 'bass'],
			['countertenor', 'union', 'tenor-mezzo'],
			['not-sure', 'union', 'middle'],
			[undefined, 'union', 'middle'],
			['', 'union', 'middle'],
		];
		for (const [type, guard, standIn] of rows) {
			expect([type, bucketFor(type), standInBucket(type)]).toEqual([type, guard, standIn]);
		}
		// And one spelling only the guard accepts.
		expect(bucketFor('mezzo soprano')).toBe('tenor-mezzo');
		expect(standInBucket('mezzo soprano')).toBe('middle');
	});
});
