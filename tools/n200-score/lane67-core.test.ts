/**
 * Lane 67's measure (`lane67-core.ts`), on small profiles built by hand. Not a gate: this tool's tests live beside it (`vitest.config.ts`).
 */
import { describe, it, expect } from 'vitest';
import { template } from '$lib/voice/engine/stand-ins';
import type { CalibratedFormant } from '$lib/voice/engine/types';
import { CORE, estimate, median, p90, tractScale, type Profile } from './lane67-core';

const fm = (f1: number, f2: number | undefined, extra: Partial<CalibratedFormant> = {}): CalibratedFormant =>
	({ f1, ...(f2 === undefined ? {} : { f2 }), f2Quality: f2 === undefined ? 'absent' : 'clear', confidence: 'high', reading: 'captured', source: 'measured-user', ...extra }) as CalibratedFormant;
const sungFrom = (bucket: 'middle' | 'bass', scale: number, drop?: string): Profile => {
	const t = template(bucket);
	const p: Profile = {};
	for (const v of CORE) if (v !== drop) p[v] = fm(t.f1[v] * scale, t.f2[v] * scale);
	return p;
};

describe('the tract scale', () => {
	it('is 1 when the singer sings the shape, and the ratio when every value is the shape times a number', () => {
		const shape = template('middle');
		expect(tractScale(sungFrom('middle', 1), shape)).toBeCloseTo(1, 10);
		expect(tractScale(sungFrom('middle', 1.2), shape)).toBeCloseTo(1.2, 10);
	});
	it('takes a sung vowel with no usable fR2 into fR1\'s mean only', () => {
		const shape = template('middle');
		const p = sungFrom('middle', 1.1);
		p.e = fm(shape.f1.e * 2, undefined);
		const expected = Math.exp((Math.log(1.1) * 10 + Math.log(2)) / 11);
		expect(tractScale(p, shape)).toBeCloseTo(expected, 10);
	});
	it('is NaN with no sung core vowel', () => {
		expect(tractScale({}, template('middle'))).toBeNaN();
	});
});

describe('the estimates', () => {
	it('shape: a voice that is the middle shape times 1.3 gives the missing vowel at shape times 1.3, both resonances', () => {
		const t = template('middle');
		const e = estimate('shape', sungFrom('middle', 1.3, 'o'), 'o', 'baritone');
		expect(e.f1).toBeCloseTo(t.f1.o * 1.3, 6);
		expect(e.f2).toBeCloseTo(t.f2.o * 1.3, 6);
	});
	it('declared: a bass voice that is the bass template gives the missing vowel exactly', () => {
		const t = template('bass');
		const e = estimate('declared', sungFrom('bass', 1, 'ɛ'), 'ɛ', 'bass');
		expect(e.f1).toBeCloseTo(t.f1.ɛ, 6);
		expect(e.f2).toBeCloseTo(t.f2.ɛ, 6);
	});
	it('fit: returns today\'s stand-in for the missing vowel (a surrogate near the singer\'s own shape)', () => {
		const t = template('bass');
		const e = estimate('fit', sungFrom('bass', 1, 'u'), 'u', 'bass');
		expect(e.f1).toBeCloseTo(t.f1.u, 0);
	});
});

describe('the summary statistics', () => {
	it('median and nearest-rank 90th percentile', () => {
		expect(median([3, 1, 2])).toBe(2);
		expect(median([1, 2, 3, 4])).toBe(2.5);
		expect(p90([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toBe(9);
		expect(median([])).toBeNaN();
	});
});
