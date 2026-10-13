/**
 * line-breaks.test.ts: where a prose block may break (QUEUE row 79, rule 2),
 * on numbers: lines merge where they overlap, and a break leaves at least two
 * lines on each side.
 */
import { describe, expect, it } from 'vitest';
import { breakOffsets, mergeLines } from './line-breaks';

describe('line breaks (row 79)', () => {
	it('merges the fragments of one line, and a superscript, into one line', () => {
		expect(mergeLines([{ top: 0, bottom: 20 }, { top: 2, bottom: 18 }, { top: -3, bottom: 8 }, { top: 21, bottom: 41 }])).toEqual([
			{ top: -3, bottom: 20 },
			{ top: 21, bottom: 41 },
		]);
	});

	it('offers a break at each line top that leaves two lines on either side', () => {
		const lines = [0, 20, 40, 60, 80].map((t) => ({ top: t, bottom: t + 18 }));
		expect(breakOffsets(lines)).toEqual([40, 60]);
		expect(breakOffsets(lines.slice(0, 3))).toEqual([]);
	});
});
