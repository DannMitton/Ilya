/**
 * The lyric band: Dann's rectangle between the voice staff and the staff below
 * it, in proportion to the staff space. Staves are made by hand: five lines
 * `space` apart from `top`, level or sloping, across `x0` to `x1`.
 */
import { describe, expect, it } from 'vitest';
import { BELOW, DROP, MARGIN, downThePage, lyricBand, staffOfNotes, systemsOf, type PlacedStaff } from './underlay-band';

/** A staff whose top line is at `top` at its left end and `top + drop` at its right end. */
function staff(top: number, space = 30, x0 = 100, x1 = 900, drop = 0, index = 0): PlacedStaff {
	const line = (k: number) => top + k * space;
	return {
		box: { cx: (x0 + x1) / 2 / 1000, cy: 0, w: (x1 - x0) / 1000, h: 0, index },
		staff: { xs: [x0, x1], ls: [[0, 1, 2, 3, 4].map(line), [0, 1, 2, 3, 4].map((k) => line(k) + drop)], space, x0, x1 },
	};
}

const W = 1000;
const H = 2000;

describe('lyricBand', () => {
	// A: lines 100 to 220 (bottom 220). B: top line 500.
	const a = staff(100);
	const b = staff(500);

	it('runs from A\'s bottom line plus 1.5 spaces to B\'s top line minus 1.5 spaces, across the page', () => {
		expect(lyricBand(a, b, W, H)).toEqual({ staff: 0, x0: 0, x1: W, y0: 220 + 45, y1: 500 - 45, space: 30 });
		expect(MARGIN).toBe(1.5);
	});

	it('takes the margins in A\'s staff spaces, so a larger print gives a larger band for the same spaces', () => {
		const big = lyricBand(staff(200, 60), staff(1000, 60), W, H)!;
		expect(big).toMatchObject({ y0: 200 + 240 + 90, y1: 1000 - 90, space: 60 });
		// The same print at twice the size: every length doubles.
		const small = lyricBand(staff(100, 30), staff(500, 30), W, H)!;
		expect([big.y0 - 200, big.y1 - 200, big.space]).toEqual([2 * (small.y0 - 100), 2 * (small.y1 - 100), 2 * small.space]);
	});

	it('runs 20 spaces under A where no staff lies below it', () => {
		expect(lyricBand(a, null, W, H)).toMatchObject({ y0: 265, y1: 220 + 20 * 30 });
		expect(BELOW).toBe(20);
	});

	it('stops at the page\'s end where 20 spaces would pass it', () => {
		expect(lyricBand(a, null, W, 700)).toMatchObject({ y1: 700 });
	});

	it('keeps a band of exactly 2 spaces and drops one under it', () => {
		// The band is the gap from A\'s bottom to B\'s top less 3 spaces: a gap of 5 spaces gives 2.
		expect(lyricBand(a, staff(220 + 150), W, H)).not.toBeNull();
		expect(lyricBand(a, staff(220 + 149), W, H)).toBeNull();
		expect(DROP).toBe(2);
	});

	it('is not dropped at 40 px, the harness\'s fixed floor, where 2 spaces are fewer: the floor is in spaces', () => {
		const small = staff(100, 10);
		const band = lyricBand(small, staff(100 + 40 + 10 * 6, 10), W, H); // gap 60 less 30 is 30 px: 3 spaces
		expect(band).not.toBeNull();
		expect(band!.y1 - band!.y0).toBeLessThan(40);
	});

	it('reads the lines at A\'s centre column on a sloping staff', () => {
		const tilted = staff(100, 30, 100, 900, 40); // right end 40 px lower; at the centre, 20
		const level = staff(500, 30, 100, 900, 40);
		expect(lyricBand(tilted, level, W, H)).toMatchObject({ y0: 220 + 20 + 45, y1: 500 + 20 - 45 });
	});

	it('takes the margin under A and over B in A\'s staff spaces, whatever space B has', () => {
		expect(lyricBand(a, staff(500, 20), W, H)).toMatchObject({ y0: 265, y1: 500 - 45 });
	});

	it('is null for an empty gap', () => {
		expect(lyricBand(a, staff(230), W, H)).toBeNull();
	});
});

describe('systemsOf', () => {
	// Two systems of three staves: voice, piano upper, piano lower.
	const staves = [staff(100), staff(500), staff(800), staff(1200), staff(1600), staff(1900)];
	const note = (x: number, y: number) => ({ x, y });

	it('orders the staves down the page', () => {
		expect(downThePage([staves[2], staves[0], staves[1]])).toEqual([1, 2, 0]);
	});

	it('gives each voice note the staff nearest it, a ledger-line note above a staff included', () => {
		const owner = staffOfNotes([note(300, 160), note(300, 60), note(300, 280), note(300, 1250)], staves);
		expect(owner).toEqual([0, 0, 0, 3]);
	});

	it('gives a note under a staff to that staff by its middle line: nearer the next staff\'s top line, it is still the nearer staff\'s', () => {
		// Staff 0: top 100, middle 160. Staff 1: top 500, middle 560. A note at 330 is 170 from the first middle and 230 from the second, but 230 from the first top and 170 from the second.
		expect(staffOfNotes([note(300, 330)], staves)).toEqual([0]);
	});

	it('makes one system of each staff that holds a voice note, with B the next staff down', () => {
		const systems = systemsOf([note(200, 150), note(400, 170), note(300, 1250)], staves, W, 2200);
		expect(systems.map((s) => [s.staff, s.notes])).toEqual([
			[0, [0, 1]],
			[3, [2]],
		]);
		expect(systems[0].band).toMatchObject({ y0: 265, y1: 500 - 45, space: 30 });
		expect(systems[1].band).toMatchObject({ y0: 1200 + 120 + 45, y1: 1600 - 45 });
	});

	it('leaves out a staff that holds no voice note, such as the piano\'s', () => {
		const systems = systemsOf([note(200, 150)], staves, W, 2200);
		expect(systems.map((s) => s.staff)).toEqual([0]);
	});

	it('gives the last staff of the page 20 spaces', () => {
		const systems = systemsOf([note(200, 1950)], staves, W, 2800);
		expect(systems[0]).toMatchObject({ staff: 5, band: { y0: 1900 + 120 + 45, y1: 1900 + 120 + 600 } });
	});

	it('keeps a system whose band is dropped, with a null band', () => {
		const close = [staff(100), staff(260)];
		const systems = systemsOf([note(200, 150)], close, W, 2000);
		expect(systems).toHaveLength(1);
		expect(systems[0].band).toBeNull();
	});

	it('has no system without staves or without notes', () => {
		expect(systemsOf([], staves, W, H)).toEqual([]);
		expect(systemsOf([note(1, 1)], [], W, H)).toEqual([]);
	});
});
