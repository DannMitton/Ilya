/**
 * QUEUE row 66: the page breaks. Capacities and heights are the test's own
 * round numbers, so every expectation is arithmetic on the input.
 */
import { describe, expect, it } from 'vitest';
import { paginate, type Geometry } from './paginate';
import type { Group } from './singer-blocks';

const geo = (first: number, rest = first): Geometry => ({ capacity: (n) => (n === 0 ? first : rest), gap: 10, inner: 5, pad: 20, openPad: 4 });

describe('paginate', () => {
	it('keeps a squircle whole when it fits, its blocks in one segment', () => {
		// free 100, then moments 50 + 50: 100 + 10 + 20 + 50 + 5 + 50 + 20 = 255.
		const pages = paginate(['free', 'moments', 'moments'] as Group[], [100, 50, 50], geo(255));
		expect(pages).toHaveLength(1);
		expect(pages[0].map((s) => s.blocks)).toEqual([[0], [1, 2]]);
	});

	it('breaks a squircle across a page, open at the break on both sides', () => {
		const pages = paginate(['free', 'moments', 'moments'] as Group[], [100, 50, 50], geo(254, 500));
		expect(pages).toHaveLength(2);
		expect(pages[0][1]).toMatchObject({ group: 'moments', blocks: [1], openTop: false, openBottom: true });
		expect(pages[1][0]).toMatchObject({ group: 'moments', blocks: [2], openTop: true, openBottom: false });
	});

	it('starts a new squircle on a new page closed, when the break falls between squircles', () => {
		const pages = paginate(['moments', 'totals'] as Group[], [100, 100], geo(150, 500));
		expect(pages[0][0]).toMatchObject({ openBottom: false });
		expect(pages[1][0]).toMatchObject({ group: 'totals', openTop: false });
	});

	it('places a block taller than a page on its own page rather than losing it', () => {
		const pages = paginate(['free', 'totals', 'free'] as Group[], [50, 900, 50], geo(300));
		expect(pages.map((p) => p.map((s) => s.blocks))).toEqual([[[0]], [[1]], [[2]]]);
	});

	it('never puts more on a page than its capacity, except one overlong block', () => {
		const groups = Array.from({ length: 40 }, (_, k) => (['free', 'moments', 'totals', 'sources'] as Group[])[Math.floor(k / 10)]);
		const heights = groups.map((_, k) => 20 + ((k * 37) % 90));
		const g = geo(400, 600);
		const pages = paginate(groups, heights, g);
		pages.forEach((segments, n) => {
			let used = 0;
			segments.forEach((s, j) => {
				const boxed = s.group !== 'free';
				used += (j > 0 ? g.gap : 0) + (boxed ? (s.openTop ? g.openPad : g.pad) + g.pad : 0);
				s.blocks.forEach((b, k) => (used += (k > 0 ? g.inner : 0) + heights[b]));
			});
			expect(used).toBeLessThanOrEqual(g.capacity(n));
		});
		expect(pages.flat().flatMap((s) => s.blocks)).toEqual(groups.map((_, k) => k));
	});
});
