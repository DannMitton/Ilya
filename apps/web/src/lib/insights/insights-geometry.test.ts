/**
 * Lane 80 (QUEUE row 202): a closed screen-only disclosure is charged to the page it lands on. The e2e fixtures carry no case where a closed summary lands within
 * 16 px of the window's bottom, so the arithmetic is pinned here, on synthetic heights.
 */
import { describe, expect, it } from 'vitest';
import { paginate, type Segment } from './paginate';
import { chargeRiders, ridingSegment } from './insights-geometry';

const GEOMETRY = { gap: 16, inner: 12, pad: 17, openPad: 5 };
/** Blocks 0 and 1 are free and printed; block 2 is the closed disclosure after block 1. */
const heights = [400, 300, 150];
const run = (capacity: number) => (reserve: (page: number) => number): Segment[][] =>
	paginate(['free', 'free'], [400, 300], { ...GEOMETRY, capacity: (n) => capacity - reserve(n) });

describe('chargeRiders', () => {
	it('with no rider it is paginate, unchanged: both blocks fit a 720 px page', () => {
		const pages = chargeRiders(run(720), [], heights);
		expect(pages.map((p) => p.flatMap((s) => s.blocks))).toEqual([[0, 1]]);
	});

	it('a closed summary and the gap before it are paid by the page it lands on: block 1 moves to the next page rather than leave the summary on the footer', () => {
		const rider = { block: 2, charge: 20 + GEOMETRY.gap };
		const pages = chargeRiders(run(720), [rider], heights);
		expect(pages.map((p) => p.flatMap((s) => s.blocks))).toEqual([[0], [1]]);
		expect(ridingSegment(pages, 2, heights)?.page).toBe(1);
	});

	it('a rider that fits is not charged to a page it does not land on, and the pages are the ones without it', () => {
		const rider = { block: 2, charge: 20 + GEOMETRY.gap };
		const pages = chargeRiders(run(760), [rider], heights);
		expect(pages.map((p) => p.flatMap((s) => s.blocks))).toEqual([[0, 1]]);
		expect(ridingSegment(pages, 2, heights)?.page).toBe(0);
	});

	it('a rider rides with the part that ends its block, not a part that breaks before the block ends', () => {
		const cut: Segment[][] = [[{ group: 'free', blocks: [1], openTop: false, openBottom: false, cuts: { 1: [0, 100] } }], [{ group: 'free', blocks: [1], openTop: false, openBottom: false, cuts: { 1: [100, 300] } }]];
		expect(ridingSegment(cut, 2, heights)?.page).toBe(1);
	});
});
