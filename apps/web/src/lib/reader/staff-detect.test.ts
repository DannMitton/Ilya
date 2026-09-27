/**
 * staff-detect.test.ts — N.146's light check, against synthetic pages.
 *
 * The real measurement is against fifteen real pages (clean render fixtures,
 * the Lamm scan under both rasterizers, a real IMSLP engraving with its
 * title set above the staves, a Verovio-engraved PDF, and four real
 * text-only pages), reported in the brief's memo rather than repeated here:
 * this suite has no PNG decoder and no fixture corpus of its own, so it
 * checks the SHAPE of the rule (a staff is five evenly spaced full-width
 * dark rows; text and a stray rule or two are not) on pages built by hand.
 */
import { describe, it, expect } from 'vitest';
import { detectStavesLight } from './staff-detect';

const WHITE = 255;
const BLACK = 0;

function blankPage(width: number, height: number): Uint8ClampedArray {
	const pixels = new Uint8ClampedArray(width * height * 4);
	pixels.fill(WHITE);
	for (let i = 3; i < pixels.length; i += 4) pixels[i] = 255; // alpha
	return pixels;
}

function paintRow(pixels: Uint8ClampedArray, width: number, y: number, fraction = 1, value = BLACK): void {
	const inkWidth = Math.round(width * fraction);
	const startX = Math.floor((width - inkWidth) / 2);
	for (let x = startX; x < startX + inkWidth; x++) {
		const i = (y * width + x) * 4;
		pixels[i] = pixels[i + 1] = pixels[i + 2] = value;
	}
}

/** Five lines, `gap` px apart, starting at `top`. One staff. */
function paintStaff(pixels: Uint8ClampedArray, width: number, top: number, gap: number, fraction = 1): void {
	for (let i = 0; i < 5; i++) paintRow(pixels, width, top + i * gap, fraction);
}

describe('N.146 detectStavesLight', () => {
	it('a blank page: no staves', () => {
		const pixels = blankPage(200, 300);
		expect(detectStavesLight(pixels, 200, 300)).toBe(false);
	});

	it('five evenly spaced full-width rows: a staff', () => {
		const pixels = blankPage(200, 300);
		paintStaff(pixels, 200, 50, 10);
		expect(detectStavesLight(pixels, 200, 300)).toBe(true);
	});

	it('a staff that runs most, not all, of the page width (margins either side)', () => {
		const pixels = blankPage(400, 300);
		paintStaff(pixels, 400, 50, 12, 0.75);
		expect(detectStavesLight(pixels, 400, 300)).toBe(true);
	});

	it('a staff far down a tall page, among blank space above and below', () => {
		const pixels = blankPage(400, 2000);
		paintStaff(pixels, 400, 1200, 20);
		expect(detectStavesLight(pixels, 400, 2000)).toBe(true);
	});

	it('two full-width rules, far apart: not a staff (Project MUSE cover-page case)', () => {
		const pixels = blankPage(400, 600);
		paintRow(pixels, 400, 80);
		paintRow(pixels, 400, 520);
		expect(detectStavesLight(pixels, 400, 600)).toBe(false);
	});

	it('four evenly spaced rows, one short: no five-line group', () => {
		const pixels = blankPage(400, 300);
		paintRow(pixels, 400, 50);
		paintRow(pixels, 400, 60);
		paintRow(pixels, 400, 70);
		paintRow(pixels, 400, 80);
		expect(detectStavesLight(pixels, 400, 300)).toBe(false);
	});

	it('five rows with uneven spacing: not a staff', () => {
		const pixels = blankPage(400, 300);
		paintRow(pixels, 400, 50);
		paintRow(pixels, 400, 60);
		paintRow(pixels, 400, 70);
		paintRow(pixels, 400, 95);
		paintRow(pixels, 400, 130);
		expect(detectStavesLight(pixels, 400, 300)).toBe(false);
	});

	it('short, sparse text-like marks: no staves', () => {
		const pixels = blankPage(400, 300);
		// Short underline segments, well under the row gate, at even vertical
		// rhythm: a table of contents' own cadence, not a staff's.
		for (let line = 0; line < 8; line++) paintRow(pixels, 400, 40 + line * 30, 0.2);
		expect(detectStavesLight(pixels, 400, 300)).toBe(false);
	});

	it('a second, lower staff still answers true even where the first is damaged', () => {
		const pixels = blankPage(400, 800);
		// The first staff's middle line never printed (a stray defect); the
		// group can only ever find four of its five lines within tolerance.
		paintRow(pixels, 400, 50);
		paintRow(pixels, 400, 62);
		paintRow(pixels, 400, 86);
		paintRow(pixels, 400, 98);
		paintStaff(pixels, 400, 500, 12);
		expect(detectStavesLight(pixels, 400, 800)).toBe(true);
	});

	it('a zero-size page abstains rather than throwing', () => {
		expect(detectStavesLight(new Uint8ClampedArray(0), 0, 0)).toBe(false);
	});
});
