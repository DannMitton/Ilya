/**
 * The piano's upper staff, found inside homr's box (brief r5 step 3). Pages are
 * drawn by hand: five lines `SP` apart from a top line, across a range of
 * columns, on white. A is the voice staff (a hand-made `Staff`); homr's boxes
 * are fractions of the page.
 */
import { describe, expect, it } from 'vitest';
import type { Grey } from './metre-windows';
import { staffIn } from './metre-windows';
import { lyricBand, MARGIN, systemsOf, type PlacedStaff } from './underlay-band';
import { SHARE, topFromColumns, topLineBelow } from './underlay-below';

const W = 1200;
const H = 1000;
const SP = 20;

function blank(): Grey {
	return { width: W, height: H, data: new Uint8Array(W * H).fill(255) };
}
/** A staff of five 2 px lines, `SP` apart, from `top`, over columns `x0` to `x1`. */
function draw(g: Grey, top: number, x0 = 100, x1 = 1100, space = SP): void {
	for (let k = 0; k < 5; k++) for (let x = x0; x < x1; x++) for (let t = 0; t < 2; t++) g.data[(top + k * space + t) * g.width + x] = 0;
}
/** One line across columns `x0` to `x1` at `y`: a ledger line. */
function line(g: Grey, y: number, x0: number, x1: number): void {
	for (let x = x0; x < x1; x++) for (let t = 0; t < 2; t++) g.data[(y + t) * g.width + x] = 0;
}
const box = (y0: number, y1: number, index = 1) => ({ cx: 0.5, cy: (y0 + y1) / 2 / H, w: 0.9, h: (y1 - y0) / H, index });
/** A: lines 100 to 180, so bottom 180. */
const A: PlacedStaff = { box: box(80, 200, 0), staff: { xs: [100, 1100], ls: [[100, 120, 140, 160, 180], [100, 120, 140, 160, 180]], space: SP, x0: 100, x1: 1100 } };
const placed = (y0: number, y1: number): PlacedStaff => ({ box: box(y0, y1), staff: { xs: [100, 1100], ls: [[y1 - 80, y1 - 60, y1 - 40, y1 - 20, y1], [y1 - 80, y1 - 60, y1 - 40, y1 - 20, y1]], space: SP, x0: 100, x1: 1100 } });

describe('topLineBelow', () => {
	it('ends the band 1.5 spaces above the upper piano staff when homr boxed both piano staves as one (staffIn alone returns the lower)', () => {
		const g = blank();
		draw(g, 400); // upper piano staff: top line 400
		draw(g, 560); // lower: top line 560
		const b = box(380, 650); // one box, about three staves tall, as homr gave
		const top = topLineBelow(g, A, { box: b, staff: staffIn(g, b)! });
		expect(top).toBeGreaterThanOrEqual(399);
		expect(top).toBeLessThanOrEqual(401);
		const band = lyricBand(A, null, W, H, 0, top)!;
		expect(band.y1).toBe(Math.floor(top! - MARGIN * SP));
		expect(Math.abs(band.y1 - (400 - 1.5 * SP))).toBeLessThanOrEqual(1);
	});

	it('takes the upper staff where half the strips find it and half the lower (mutant: the median of every strip lands between the two)', () => {
		const g = blank();
		draw(g, 400, 100, 600);
		draw(g, 560, 600, 1100);
		const top = topLineBelow(g, A, placed(380, 650))!;
		expect(Math.abs(top - 400)).toBeLessThanOrEqual(1);
		// The rule it replaces, on the same strips: the median of all of them.
		const all = [400, 400, 400, 400, 400, 560, 560, 560, 560, 560];
		const medianOfAll = [...all].sort((x, y) => x - y)[5];
		expect(Math.abs(medianOfAll - 400)).toBeGreaterThan(SP);
	});

	it('ignores a ledger line one space above the staff in a third of the strips', () => {
		const g = blank();
		draw(g, 400);
		line(g, 400 - SP, 350, 520); // a third of the middle half of A's span (columns 350 to 850)
		const top = topLineBelow(g, A, placed(380, 650))!;
		expect(Math.abs(top - 400)).toBeLessThanOrEqual(1);
	});

	it('agrees with today\'s line where homr boxed the upper staff alone', () => {
		const g = blank();
		draw(g, 400);
		const b = box(380, 500);
		const placedB: PlacedStaff = { box: b, staff: staffIn(g, b)! };
		expect(Math.abs(topLineBelow(g, A, placedB)! - placedB.staff.ls[0][0])).toBeLessThanOrEqual(1);
	});

	it('counts a group only at a space within 0.8 to 1.25 of A\'s', () => {
		const g = blank();
		draw(g, 400, 100, 1100, 40); // twice A's space
		// Nothing counts, so the top of homr's box stands: 380.
		expect(topLineBelow(g, A, placed(380, 650))).toBeCloseTo(380, 0);
	});

	it('falls back to the top of homr\'s next box where no group is found, and to null where there is no box', () => {
		const g = blank();
		expect(topLineBelow(g, A, placed(380, 650))).toBeCloseTo(380, 0);
		expect(topLineBelow(g, A, null)).toBeNull();
		expect(lyricBand(A, null, W, H, 0, null)!.y1).toBe(180 + 20 * SP);
	});

	it('searches into the next box, to its bottom, not to its top', () => {
		const g = blank();
		draw(g, 450); // inside a box that runs 380 to 650
		expect(Math.abs(topLineBelow(g, A, placed(380, 650))! - 450)).toBeLessThanOrEqual(1);
	});
});

describe('topFromColumns', () => {
	it('is the topmost line two strips share, then the median down to two spaces below it', () => {
		expect(topFromColumns([300, 400, 400, 401, 560], SP)).toBe(400);
	});
	it('ignores a single strip above the rest', () => {
		expect(topFromColumns([380, 400, 400, 400, 401], SP)).toBe(400);
	});
	it('has no answer for no strip', () => {
		expect(topFromColumns([], SP)).toBeNull();
		expect(SHARE).toBe(0.1);
	});
});

describe('systemsOf with the ink search', () => {
	it('gives the band of the system the ink-found line, and the old line without it', () => {
		const notes = [{ x: 500, y: 140 }];
		const staves = [A, placed(380, 650)];
		const withInk = systemsOf(notes, staves, W, H, () => 400)[0].band!;
		expect(withInk.y1).toBe(400 - 30);
		const without = systemsOf(notes, staves, W, H)[0].band!;
		expect(without.y1).toBe(Math.floor(staves[1].staff.ls[0][0] - 30));
	});
});
