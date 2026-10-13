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

	it('floats a figure that does not fit to the next page, and the prose after it moves up (row 79, rule 3)', () => {
		// totals: prose 100, figure 300, prose 60, prose 60. Page 1 holds 400: 20 + 100 + 5 + 300 would be 425.
		const groups = ['totals', 'totals', 'totals', 'totals'] as Group[];
		const pages = paginate(groups, [100, 300, 60, 60], geo(400, 600), [false, true, false, false]);
		expect(pages.map((p) => p.map((s) => s.blocks))).toEqual([[[0, 2, 3]], [[1]]]);
		expect(pages[0][0]).toMatchObject({ openTop: false, openBottom: true });
		expect(pages[1][0]).toMatchObject({ openTop: true, openBottom: false });
	});

	it('moves only the prose that fits, and never a block ahead of the one that introduces the figure', () => {
		const groups = ['totals', 'totals', 'totals', 'totals'] as Group[];
		const pages = paginate(groups, [100, 300, 300, 60], geo(400, 800), [false, true, false, false]);
		// 20 + 100 + 5 + 300 + 20 = 445: the 300 of prose does not fit beside the 100, so nothing moves up and the order is kept.
		expect(pages.map((p) => p.map((s) => s.blocks))).toEqual([[[0]], [[1, 2, 3]]]);
		expect(pages.flat().flatMap((s) => s.blocks)[0]).toBe(0);
	});

	it('does not pull prose from another squircle, nor a second figure', () => {
		const pages = paginate(['totals', 'totals', 'totals', 'sources'] as Group[], [100, 300, 60, 60], geo(400, 600), [false, true, true, false]);
		expect(pages.map((p) => p.map((s) => s.blocks))).toEqual([[[0]], [[1, 2], [3]]]);
	});

	it('breaks a paragraph between its lines to fill the page, and carries the rest on (row 79, rule 2)', () => {
		// moments: 100, then a 300 block whose lines start every 20 px (breaks at 40 .. 260). Page 1 holds 300:
		// 20 + 100 + 5 + b + 20 <= 300, so b <= 155, and the lowest break that fits is 140.
		const breaks = [[], [40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260]];
		const pages = paginate(['moments', 'moments'] as Group[], [100, 300], geo(300, 600), [], breaks);
		expect(pages.map((p) => p.map((s) => s.blocks))).toEqual([[[0, 1]], [[1]]]);
		expect(pages[0][0].cuts).toEqual({ 1: [0, 140] });
		expect(pages[1][0].cuts).toEqual({ 1: [140, 300] });
		expect(pages[0][0].openBottom).toBe(true);
		expect(pages[1][0].openTop).toBe(true);
	});

	it('keeps two lines on each page: a part that would leave fewer moves whole', () => {
		// The only break is at 40 (two lines above), and 20 + 100 + 5 + 40 + 20 = 185 > 150: nothing fits, so the block moves.
		const pages = paginate(['moments', 'moments'] as Group[], [100, 80], geo(150, 600), [], [[], [40]]);
		expect(pages.map((p) => p.map((s) => s.blocks))).toEqual([[[0]], [[1]]]);
		expect(pages[1][0].cuts).toBeUndefined();
	});

	it('breaks a remainder again, two lines on from where it began', () => {
		const tops = Array.from({ length: 30 }, (_, k) => 20 * k).slice(2, 29);
		const pages = paginate(['free'] as Group[], [600], geo(250, 250), [], [tops]);
		const parts = pages.map((p) => p[0].cuts![0]);
		expect(parts[0][0]).toBe(0);
		for (let k = 1; k < parts.length; k++) {
			expect(parts[k][0]).toBe(parts[k - 1][1]);
			expect(parts[k][1] - parts[k][0]).toBeGreaterThanOrEqual(40);
		}
		expect(parts[parts.length - 1][1]).toBe(600);
		for (const [a, b] of parts) expect(b - a).toBeLessThanOrEqual(250);
	});
});
