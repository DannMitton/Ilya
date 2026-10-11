/**
 * Where the time-signature reader looks (`metre-windows.ts`), and which
 * staves are the voice's (`metre-model.ts`), on a hand-drawn page: a staff
 * of five lines 20 pixels apart, a bar line, and a stem with a notehead.
 */
import { describe, expect, it } from 'vitest';
import { bandOf, barLines, isCourtesyPlace, linesAt, placesOf, staffIn, windowsOf, type Grey } from './metre-windows';
import { halves, voiceBoxes } from './metre-model';

const W = 1600;
const H = 400;
const TOP = 150;
const SPACE = 20;

function page(): Grey {
	const data = new Uint8Array(W * H).fill(255);
	const ink = (x: number, y: number) => {
		if (x >= 0 && y >= 0 && x < W && y < H) data[y * W + x] = 0;
	};
	for (let k = 0; k < 5; k++) for (let x = 100; x < 1500; x++) for (let t = 0; t < 2; t++) ink(x, TOP + k * SPACE + t);
	// a bar line at x 800, top line to bottom line
	for (let y = TOP; y <= TOP + 4 * SPACE + 1; y++) for (let x = 800; x < 803; x++) ink(x, y);
	// a stem at x 500 rising past the staff, with a notehead at its foot
	for (let y = TOP - 40; y <= TOP + 4 * SPACE + 1; y++) for (let x = 500; x < 503; x++) ink(x, y);
	for (let y = TOP + 70; y < TOP + 90; y++) for (let x = 480; x < 502; x++) ink(x, y);
	return { width: W, height: H, data };
}

const box = { cx: 800 / W, cy: (TOP + 2 * SPACE) / H, w: 1400 / W, h: (4.4 * SPACE) / H, index: 0 };

describe('staffIn', () => {
	it('finds the five lines inside homr’s box, and the staff’s ends', () => {
		const st = staffIn(page(), box)!;
		expect(st).not.toBeNull();
		expect(st.space).toBeCloseTo(SPACE, 0);
		// each line is two rows of ink, so its centre is half a row below its top
		linesAt(st, 800).forEach((y, k) => expect(y).toBeCloseTo(TOP + k * SPACE + 0.5, 6));
		expect(st.x0).toBe(100);
		expect(st.x1).toBe(1499);
	});
});

describe('barLines and windowsOf', () => {
	it('takes the bar line and leaves the stem', () => {
		const g = page();
		const st = staffIn(g, box)!;
		expect(barLines(g, st)).toEqual([{ x0: 800, x1: 802 }]);
		const ws = windowsOf(g, st, 0);
		expect(ws.map((w) => [w.kind, w.x0, w.x1])).toEqual([
			['start', 100, 400],
			['bar', 803, 892],
		]);
		expect(isCourtesyPlace(ws[1])).toBe(false);
	});
});

describe('bandOf and placesOf', () => {
	it('shrinks the staff to ten pixels a space, and places the seats on the second, middle, and fourth lines', () => {
		const g = page();
		const st = staffIn(g, box)!;
		const { band, y0, k } = bandOf(g, st);
		expect(k).toBeCloseTo(0.5, 2);
		expect(band.width).toBe(Math.trunc(W * k));
		const { xs, seats } = placesOf(windowsOf(g, st, 0)[0], y0, k);
		expect(xs.length).toBe(75);
		const s = seats(xs[10]);
		expect(s[1] - s[0]).toBeCloseTo(10, 0);
		expect(s[2] - s[1]).toBeCloseTo(10, 0);
		// the band is page ink, averaged: the top line's row is dark
		const row = Math.round((linesAt(st, 800)[0] - y0) * k);
		expect(band.data[row * band.width + 300]).toBeLessThan(160);
	});
});

describe('voiceBoxes', () => {
	it('takes the boxes nearest the first part’s notes', () => {
		const xml = `<score-partwise><part id="P1"><measure><note><!-- imgpos: 300, 190 --><pitch/></note></measure></part><part id="P2"><measure><note><!-- imgpos: 300, 320 --></note></measure></part></score-partwise>`;
		const staves = [
			{ cx: 0.5, cy: 190 / H, w: 0.8, h: 0.2, index: 0 },
			{ cx: 0.5, cy: 330 / H, w: 0.8, h: 0.2, index: 1 },
		];
		expect(voiceBoxes(xml, staves, H)).toEqual([0]);
	});
});

describe('halves', () => {
	it('reads float16 little-endian bytes', () => {
		const b = new Uint16Array([0x3c00, 0xc000, 0x3555, 0x0001]);
		const f = halves(b.buffer);
		expect(f[0]).toBe(1);
		expect(f[1]).toBe(-2);
		expect(f[2]).toBeCloseTo(0.33325, 5);
		expect(f[3]).toBeCloseTo(2 ** -24, 30);
	});
});
