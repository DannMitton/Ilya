import { test, expect } from 'vitest';
import { pairCount, cells, keptCombos, PRIMARY, HELD_OUT, truthFor, TYPES, VOWELS, caseFor } from './fidelity-set';

test('50 cells, 12 kept combinations each, 600 takes', () => {
	expect(cells(PRIMARY)).toHaveLength(50);
	for (const c of cells(PRIMARY)) expect(keptCombos(c.idx, PRIMARY)).toHaveLength(12);
});
test('the second-pulse check: 323 of 600 carry it, 277 do not', () => {
	expect(pairCount(PRIMARY)).toBe(323);
});
test('truths: bass [i] fR1, fR2 and fR3 as the desk gave them', () => {
	const t = truthFor('bass', 'i');
	expect(Math.round(t[1])).toBe(1705);
	expect(t[2]).toBeCloseTo(2750, 6);
	expect(truthFor('tenor', 'e')).toEqual(truthFor('mezzo-soprano', 'e'));
});
test('cell order and seeds', () => {
	const cs = cells(PRIMARY);
	expect(cs[0]).toMatchObject({ type: TYPES[0], vowel: VOWELS[0] });
	expect(cs[49]).toMatchObject({ type: 'soprano', vowel: 'u' });
	expect(caseFor(cs[3], 5, PRIMARY).seed).toBe(5000 + 3 * 20 + 5);
});
test('held-out truths move by a factor between 0.90 and 1.10', () => {
	for (const c of cells(HELD_OUT)) { expect(c.factor).toBeGreaterThanOrEqual(0.9); expect(c.factor).toBeLessThanOrEqual(1.1); }
});
