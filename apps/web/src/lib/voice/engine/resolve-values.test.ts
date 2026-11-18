/**
 * N.199 Step 1: `resolveVowelValues`, the one function that gives every vowel its fR1 and fR2. The adapter's output
 * is pinned byte for byte by `analysis/adapter-golden.test.ts`; these pin the flag the chart uses.
 */
import { describe, expect, it } from 'vitest';
import type { CalibratedFormant, Vowel } from './types';
import { VOWELS } from './types';
import { resolveVowelValues } from './resolve-values';

const f = (f1: number, f2: number): CalibratedFormant => ({ f1, f2, f2Quality: 'clear', confidence: 'high', reading: 'captured', source: 'measured-user' }) as CalibratedFormant;

describe('the placeholder flag', () => {
	const WITHHELD = ['contralto', 'countertenor', 'bass-baritone', 'not-sure', undefined, ''];
	const FIVE = ['soprano', 'mezzo-soprano', 'tenor', 'baritone', 'bass'];

	it('declared-types (the adapter, and the default) withholds stand-ins from a voice that has sung nothing and is not one of the five', () => {
		for (const type of WITHHELD) {
			const r = resolveVowelValues({}, type);
			expect(r.standIns, String(type)).toBeUndefined();
			expect(Object.keys(r.fR1), String(type)).toEqual([]);
			expect(r.generic).toBe(false);
			expect(resolveVowelValues({}, type, { placeholders: 'declared-types' })).toEqual(r);
		}
	});

	it('declared-types fills a voice of the five whole, every vowel a surrogate, and calls it generic', () => {
		for (const type of FIVE) {
			const r = resolveVowelValues({}, type);
			expect(r.generic, type).toBe(true);
			for (const v of VOWELS) {
				expect(r.fR1[v], `${type} ${v}`).toBeGreaterThan(0);
				expect(r.fR2[v]).toBeGreaterThan(0);
				expect(r.fR1Source[v]).toBe('surrogate');
			}
		}
	});

	it('always gives every voice, including the withheld ones, all ten values, and still says generic only for the five', () => {
		for (const type of [...WITHHELD, ...FIVE]) {
			const r = resolveVowelValues({}, type, { placeholders: 'always' });
			expect(r.standIns, String(type)).toBeDefined();
			for (const v of VOWELS) {
				expect(r.fR1[v], `${type} ${v}`).toBeGreaterThan(0);
				expect(r.fR2[v]).toBeGreaterThan(0);
			}
			expect(r.generic).toBe(FIVE.includes(type as string));
		}
	});

	it('for the five, always and declared-types give the same answer', () => {
		for (const type of FIVE) expect(resolveVowelValues({}, type, { placeholders: 'always' })).toEqual(resolveVowelValues({}, type));
	});

	const FIVE_CORE: Partial<Record<Vowel, CalibratedFormant>> = { i: f(296, 1705), e: f(381, 1532), ɛ: f(577, 1311), o: f(489, 826), u: f(346, 804) };

	it('below five core vowels the flag and the values are those of nothing sung, whatever is stored (lane 67)', () => {
		for (const sung of [{ u: f(346, 804) }, { i: f(296, 1705), e: f(381, 1532), ɛ: f(577, 1311), ɑ: f(617, 1013) }, { u: f(346, 804), 'ɨ': f(404, 1100) }] as Partial<Record<Vowel, CalibratedFormant>>[]) {
			for (const type of [...WITHHELD, ...FIVE]) {
				for (const placeholders of ['always', 'declared-types'] as const) {
					const a = resolveVowelValues(sung, type, { placeholders });
					const none = resolveVowelValues({}, type, { placeholders });
					const strip = (r: typeof a) => ({ fR1: r.fR1, fR2: r.fR2, fR1Source: r.fR1Source, fR2Source: r.fR2Source, anySung: r.anySung, generic: r.generic, standIns: r.standIns });
					expect(strip(a), `${type} ${placeholders}`).toEqual(strip(none));
				}
			}
		}
	});

	it('once five core vowels are sung the flag changes nothing', () => {
		const sung = FIVE_CORE;
		for (const type of [...WITHHELD, ...FIVE]) {
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
