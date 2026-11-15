import { describe, expect, it } from 'vitest';
import type { CalibratedFormant, Vowel } from '../engine/types';
import { VOWELS } from '../engine/types';
import { buildChartModel } from './model';

const f = (f1: number, f2: number): CalibratedFormant => ({ f1, f2, f2Quality: 'clear', confidence: 'high', reading: 'captured', source: 'measured-user' }) as CalibratedFormant;
const ALL = Object.fromEntries(VOWELS.map((v, k) => [v, f(300 + 40 * k, 2000 - 100 * k)])) as Record<Vowel, CalibratedFormant>;

describe('the chart model', () => {
	it('has ten zones always, placeholders for the unsung, dots for the sung, and no all-ten until it is so', () => {
		const m = buildChartModel({ i: ALL.i, e: ALL.e }, 'bass');
		expect([m.zones.length, m.placeholders.length, m.sung.length, m.allTen]).toEqual([10, 8, 2, false]);
		const all = buildChartModel(ALL, 'bass');
		expect([all.zones.length, all.placeholders.length, all.sung.length, all.allTen]).toEqual([10, 0, 10, true]);
	});
	it('holds every dot and every placeholder in the full view', () => {
		const m = buildChartModel({ i: ALL.i }, undefined);
		for (const p of [...m.placeholders, ...m.sung]) {
			expect(Math.log(p.f1)).toBeGreaterThanOrEqual(m.full.v0);
			expect(Math.log(p.f1)).toBeLessThanOrEqual(m.full.v1);
		}
	});
	it('works with nothing sung for every voice type', () => {
		for (const t of [undefined, 'soprano', 'contralto', 'countertenor', 'bass', 'not-sure']) {
			const m = buildChartModel({}, t);
			expect(m.placeholders).toHaveLength(10);
			expect(m.full.u0).toBeGreaterThan(m.full.u1);
		}
	});
});
