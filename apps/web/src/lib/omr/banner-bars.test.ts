/** Row 181 step 6: the banner's bars as pieces, each bar number a link (`banner-bars.ts`), in the words `barsText` already prints. */
import { describe, expect, it } from 'vitest';
import { barsText } from '$lib/score/ingestion/ingest';
import { barPieces, barsOf } from './banner-bars';
import type { BarRange } from './unread-bars';

const join = (ranges: BarRange[], lang: 'en' | 'fr') => barPieces(ranges, lang).map((p) => p.text).join('');

describe('barPieces', () => {
	const cases: BarRange[][] = [[[4, 4]], [[9, 12]], [[4, 4], [9, 12]], [[4, 4], [9, 12], [39, 39]]];

	it('prints exactly what barsText prints, in both languages', () => {
		for (const c of cases) for (const lang of ['en', 'fr'] as const) expect(join(c, lang)).toBe(barsText(c, lang));
	});

	it('links each bar number, a range at its first and last bar, and links nothing else', () => {
		expect(barPieces([[4, 4], [9, 12], [39, 39]], 'en').filter((p) => p.bar !== undefined).map((p) => p.bar)).toEqual([4, 9, 12, 39]);
		expect(barPieces([[9, 12]], 'fr').map((p) => [p.text, p.bar])).toEqual([['9', 9], [' à ', undefined], ['12', 12]]);
	});
});

describe('barsOf', () => {
	it('lists every bar of the ranges once, in order: the walk\'s "1 of 3"', () => {
		expect(barsOf([[4, 4], [9, 11]])).toEqual([4, 9, 10, 11]);
		expect(barsOf([[3, 5], [4, 6]])).toEqual([3, 4, 5, 6]);
		expect(barsOf([])).toEqual([]);
	});
});
