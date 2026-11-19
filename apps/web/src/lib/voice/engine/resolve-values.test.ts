/**
 * N.199 Step 1: `resolveVowelValues`, the one function that gives every vowel its fR1 and fR2. The adapter's output
 * is pinned byte for byte by `analysis/adapter-golden.test.ts`; these pin the flag the chart uses.
 */
import { describe, expect, it } from 'vitest';
import type { CalibratedFormant, Vowel } from './types';
import { VOWELS } from './types';
import { resolveVowelValues } from './resolve-values';
import { template } from './stand-ins';

const f = (f1: number, f2: number): CalibratedFormant => ({ f1, f2, f2Quality: 'clear', confidence: 'high', reading: 'captured', source: 'measured-user' }) as CalibratedFormant;

describe('the placeholder flag', () => {
	// QUEUE row 167 (ruling of 2026-11-19, sections 1 and 8): eight declared types have a starting profile; "Not sure" and no type take none.
	const WITHHELD = ['not-sure', undefined, ''];
	const EIGHT = ['soprano', 'mezzo-soprano', 'contralto', 'countertenor', 'tenor', 'baritone', 'bass-baritone', 'bass'];

	it('declared-types (the adapter, and the default) withholds stand-ins from a voice that has sung nothing and is not one of the eight', () => {
		for (const type of WITHHELD) {
			const r = resolveVowelValues({}, type);
			expect(r.standIns, String(type)).toBeUndefined();
			expect(Object.keys(r.fR1), String(type)).toEqual([]);
			expect(r.generic).toBe(false);
			expect(resolveVowelValues({}, type, { placeholders: 'declared-types' })).toEqual(r);
		}
	});

	it('declared-types fills a voice of the eight whole, every vowel a surrogate, and calls it generic', () => {
		for (const type of EIGHT) {
			const r = resolveVowelValues({}, type);
			expect(r.generic, type).toBe(true);
			for (const v of VOWELS) {
				expect(r.fR1[v], `${type} ${v}`).toBeGreaterThan(0);
				expect(r.fR2[v]).toBeGreaterThan(0);
				expect(r.fR1Source[v]).toBe('surrogate');
			}
		}
	});

	it('always gives every voice, including the withheld ones, all ten values, and still says generic only for the eight', () => {
		for (const type of [...WITHHELD, ...EIGHT]) {
			const r = resolveVowelValues({}, type, { placeholders: 'always' });
			expect(r.standIns, String(type)).toBeDefined();
			for (const v of VOWELS) {
				expect(r.fR1[v], `${type} ${v}`).toBeGreaterThan(0);
				expect(r.fR2[v]).toBeGreaterThan(0);
			}
			expect(r.generic).toBe(EIGHT.includes(type as string));
		}
	});

	it('for the eight, always and declared-types give the same answer', () => {
		for (const type of EIGHT) expect(resolveVowelValues({}, type, { placeholders: 'always' })).toEqual(resolveVowelValues({}, type));
	});

	const FIVE_CORE: Partial<Record<Vowel, CalibratedFormant>> = { i: f(296, 1705), e: f(381, 1532), ɛ: f(577, 1311), o: f(489, 826), u: f(346, 804) };

	const BELOW: Array<[string, Partial<Record<Vowel, CalibratedFormant>>]> = [
		['one core vowel', { u: f(346, 804) }],
		['four core vowels', { i: f(296, 1705), e: f(381, 1532), ɛ: f(577, 1311), ɑ: f(617, 1013) }],
		['one core and one hard vowel', { u: f(346, 804), 'ɨ': f(404, 1100) }],
	];

	it('below five stable core vowels every sampled vowel is used as sampled, for every type and both modes (lane 68)', () => {
		for (const [name, sung] of BELOW) {
			for (const type of [...WITHHELD, ...EIGHT]) {
				for (const placeholders of ['always', 'declared-types'] as const) {
					const r = resolveVowelValues(sung, type, { placeholders });
					for (const [v, fm] of Object.entries(sung) as [Vowel, CalibratedFormant][]) {
						expect([r.fR1[v], r.fR2[v], r.fR1Source[v], r.fR2Source[v]], `${name} ${type} ${placeholders} ${v}`).toEqual([fm.f1, fm.f2, 'sung', 'sung']);
					}
					expect(r.anySung).toBe(true);
				}
			}
		}
	});

	it('below five, the vowels not sampled are the declared type\'s placeholders unscaled, and generic is false (lane 68)', () => {
		const tpl = template('bass');
		const r = resolveVowelValues({ i: f(500, 2500) }, 'bass');
		expect(r.generic).toBe(false);
		expect(r.standIns?.bucket).toBe('bass');
		expect(r.fR1.e).toBeCloseTo(tpl.f1.e, 0);
		expect(r.fR2.u).toBeCloseTo(tpl.f2.u, 0);
		expect(r.fR1Source.e).toBe('surrogate');
		expect(r.standIns?.steps.e).toBe('template');
	});

	it('below five, an unsampled hard vowel is a placeholder from the template\'s anchors, even with a sampled anchor (lane 68, amendment 1)', () => {
		const r = resolveVowelValues({ i: f(500, 2500), u: f(450, 900) }, 'bass');
		expect(r.fR1Source['ɨ']).toBe('surrogate');
		expect(r.standIns?.steps['ɨ']).toBe('derived');
		const none = resolveVowelValues({}, 'bass');
		expect(r.fR1['ɨ']).toBe(none.fR1['ɨ']);
	});

	it('a type with no placeholder profile and one sampled vowel draws: the unsampled vowels take the staff of its bucket (lane 68)', () => {
		for (const [type, bucket] of [['contralto', 'tenor-mezzo'], ['countertenor', 'tenor-mezzo'], ['bass-baritone', 'bass'], ['not-sure', 'middle'], [undefined, 'middle']] as const) {
			const r = resolveVowelValues({ u: f(346, 804) }, type);
			expect(r.standIns?.bucket, String(type)).toBe(bucket);
			expect(r.fR1.i, String(type)).toBeCloseTo(template(bucket).f1.i, 0);
			expect(r.generic).toBe(false);
		}
	});

	it('four stable core vowels and one unstable: the unstable one is used for its vowel and does not complete the profile', () => {
		const sung = { i: f(296, 1705), e: f(381, 1532), ɛ: f(577, 1311), o: f(489, 826), u: { ...f(346, 804), confidence: 'low' as const } } as Partial<Record<Vowel, CalibratedFormant>>;
		const r = resolveVowelValues(sung, 'bass');
		expect(r.fR1.u).toBe(346);
		expect(r.fR1Source.u).toBe('sung');
		expect(r.fR1.ɑ).toBeCloseTo(template('bass').f1.ɑ, 0); // unscaled placeholder, not a fitted value
		expect(r.standIns?.steps.ɑ).toBe('template');
	});

	it('once five core vowels are sung the flag changes nothing', () => {
		const sung = FIVE_CORE;
		for (const type of [...WITHHELD, ...EIGHT]) {
			expect(resolveVowelValues(sung, type, { placeholders: 'always' })).toEqual(resolveVowelValues(sung, type));
		}
	});

	it('keeps a sung value and marks it sung; a derived one is derived', () => {
		const r = resolveVowelValues(FIVE_CORE, 'bass', { placeholders: 'always' });
		expect(r.fR1.i).toBe(296);
		expect(r.fR1Source.i).toBe('sung');
		expect(r.fR1Source['ɨ']).toBe('derived');
		expect(r.fR1Source.ɑ).toBe('surrogate');
	});
});
