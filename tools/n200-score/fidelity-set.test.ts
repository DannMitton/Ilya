import { test, expect } from 'vitest';
import { pairCount, cells, keptCombos, PRIMARY, HELD_OUT, THIRD, setByName, truthFor, TYPES, VOWELS, caseFor } from './fidelity-set';

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
test('the third set: seeds, permutation, and truth factor as the desk confirmed; no seed shared with an earlier set', () => {
	const cs = cells(THIRD);
	expect(THIRD).toEqual({ seedBase: 15000, permBase: 17000, truthBase: 19000 });
	expect(caseFor(cs[3], 5, THIRD).seed).toBe(15000 + 3 * 20 + 5);
	for (const c of cs) { expect(c.factor).toBeGreaterThanOrEqual(0.9); expect(c.factor).toBeLessThanOrEqual(1.1); }
	const seeds = (o: typeof PRIMARY) => new Set(cs.flatMap((c) => Array.from({ length: 12 }, (_, k) => caseFor(c, k, o).seed)));
	const third = seeds(THIRD);
	expect(third.size).toBe(600);
	for (const o of [PRIMARY, HELD_OUT]) for (const v of seeds(o)) expect(third.has(v)).toBe(false);
	expect(cells(THIRD)[0].factor).not.toBe(cells(HELD_OUT)[0].factor);
});
test('N200_SET: three names, and an unknown name throws instead of falling to the primary set', () => {
	expect(setByName('primary')).toBe(PRIMARY);
	expect(setByName('held')).toBe(HELD_OUT);
	expect(setByName('third')).toBe(THIRD);
	expect(() => setByName('')).toThrow(/N200_SET/);
	expect(() => setByName('thrid')).toThrow(/N200_SET/);
});
