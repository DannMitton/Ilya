/**
 * frameRow on synthetic rows: deskew, closing, scale, padding, and the
 * transform back. Glyphs are solid blocks, so every expectation is a count of
 * pixels a person can check by hand.
 */
import { describe, expect, it } from 'vitest';
import {
	DEFAULT_INK_HEIGHT,
	DEFAULT_PAD_RATIO,
	frameRow,
	inkExtent,
	paperTone,
	unframeBox,
	unframePoint,
} from './underlay-frame';
import type { GreyBandLike } from './underlay-rows';

function blank(width: number, height: number, paper = 255): GreyBandLike {
	return { width, height, data: new Uint8Array(width * height).fill(paper) };
}

/** Ink over columns [x0, x1) of lines [y0, y1). */
function rect(c: GreyBandLike, x0: number, x1: number, y0: number, y1: number, value = 0): void {
	const data = c.data as Uint8Array;
	for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) data[y * c.width + x] = value;
}

/** A line of glyph blocks, 14 by 20, every 36 px, sloping `slope` px of drop per px across (y grows down). */
function slanted(slope: number, paper = 255): GreyBandLike {
	const c = blank(600, 80, paper);
	for (let k = 0; k < 16; k++) {
		const x = 20 + 36 * k;
		const y = 20 + Math.round(x * slope);
		rect(c, x, x + 14, y, y + 20);
	}
	return c;
}

/** The mean row of the ink (grey under 128) in columns [x0, x1). */
function centroidY(c: GreyBandLike, x0: number, x1: number): number {
	let sum = 0;
	let n = 0;
	for (let y = 0; y < c.height; y++) {
		for (let x = Math.floor(x0); x < Math.floor(x1); x++) {
			if (c.data[y * c.width + x] < 128) {
				sum += y;
				n++;
			}
		}
	}
	return sum / n;
}

/** The first and last row, and column, of the ink. */
function inkBox(c: GreyBandLike) {
	let x0 = c.width;
	let x1 = -1;
	let y0 = c.height;
	let y1 = -1;
	for (let y = 0; y < c.height; y++) {
		for (let x = 0; x < c.width; x++) {
			if (c.data[y * c.width + x] < 128) {
				x0 = Math.min(x0, x);
				x1 = Math.max(x1, x);
				y0 = Math.min(y0, y);
				y1 = Math.max(y1, y);
			}
		}
	}
	return { x0, x1, y0, y1 };
}

const span = (c: GreyBandLike) => {
	const b = inkBox(c);
	return b.y1 - b.y0 + 1;
};

describe('frameRow, deskew', () => {
	// A drop of tan(1.5 degrees) per px across, which is a clockwise tilt of 1.5 degrees on the screen.
	const tilt = Math.tan((1.5 * Math.PI) / 180);

	it('levels a line of glyphs tilted by 1.5 degrees, and reports the angle (positive counter-clockwise)', () => {
		const tilted = slanted(tilt);
		const before = centroidY(tilted, 540, 590) - centroidY(tilted, 10, 60);
		expect(before).toBeGreaterThan(12);
		const { crop, transform } = frameRow(tilted);
		expect(Math.abs(transform.angle - 1.5)).toBeLessThanOrEqual(0.1 + 1e-9);
		const after = (centroidY(crop, crop.width * 0.9, crop.width * 0.98) - centroidY(crop, crop.width * 0.02, crop.width * 0.1)) / transform.scale;
		expect(Math.abs(after)).toBeLessThan(1);
	});

	it('reports a negative angle for a tilt the other way', () => {
		const { transform } = frameRow(slanted(-tilt));
		expect(Math.abs(transform.angle + 1.5)).toBeLessThanOrEqual(0.1 + 1e-9);
	});

	it('leaves a level line at 0.0', () => {
		expect(frameRow(slanted(0)).transform.angle).toBe(0);
	});

	it('does not turn further than 3 degrees', () => {
		const { transform } = frameRow(slanted(Math.tan((5 * Math.PI) / 180)));
		expect(transform.angle).toBe(3);
	});

	it('fills what the turn uncovers with the paper tone', () => {
		const { crop } = frameRow(slanted(tilt, 176));
		expect(crop.data[0]).toBe(176);
		expect(crop.data[crop.width * crop.height - 1]).toBe(176);
		expect(inkBox(crop).x0).toBeGreaterThan(0);
	});
});

describe('frameRow, what counts as ink', () => {
	it('reads grey under 128 as ink and 128 or over as paper', () => {
		const c = blank(10, 20);
		rect(c, 0, 10, 2, 6, 127);
		rect(c, 0, 10, 10, 18, 128);
		expect(inkExtent(c.data, 10, 20)).toEqual([2, 5]);
	});

	it('does not let a pale smudge set the extent', () => {
		const c = blank(200, 120);
		rect(c, 30, 170, 20, 68, 60); // the row, 48 rows of ink
		rect(c, 30, 170, 80, 120, 150); // a smudge 40 rows tall that is not ink
		expect(inkExtent(c.data, 200, 120)).toEqual([20, 67]);
		expect(frameRow(c).transform.scale).toBeCloseTo(32 / 48, 6);
	});
});

describe('frameRow, closing', () => {
	/** A bar 100 by 30 with a gap `gap` px wide, cut through its whole height. */
	const barWithGap = (gap: number) => {
		const c = blank(140, 60);
		rect(c, 20, 120, 15, 45);
		rect(c, 69, 69 + gap, 15, 45, 255);
		return c;
	};
	// An ink extent of 30 at inkHeight 30 keeps the scale at 1, and no padding keeps the pixels in place.
	const framed = (gap: number) => frameRow(barWithGap(gap), { inkHeight: 30, padRatio: 0 });

	it('closes a gap of 1 px in a stroke', () => {
		const { crop, transform } = framed(1);
		expect(transform.scale).toBe(1);
		expect(crop.data[30 * crop.width + 69]).toBeLessThan(128);
	});

	it('closes a gap of 2 px, the widest a 3 by 3 kernel closes', () => {
		const { crop } = framed(2);
		expect(crop.data[30 * crop.width + 69]).toBeLessThan(128);
		expect(crop.data[30 * crop.width + 70]).toBeLessThan(128);
	});

	it('does not close a gap of 3 px', () => {
		const { crop } = framed(3);
		expect(crop.data[30 * crop.width + 70]).toBeGreaterThanOrEqual(128);
	});

	it('leaves the outline of a solid block where it was', () => {
		const { crop } = frameRow(barWithGap(0), { inkHeight: 30, padRatio: 0 });
		expect(inkBox(crop)).toEqual({ x0: 20, x1: 119, y0: 15, y1: 44 });
	});
});

describe('frameRow, scale', () => {
	const rowOf = (height: number) => {
		const c = blank(200, 100);
		rect(c, 30, 90, 20, 20 + height);
		rect(c, 110, 170, 20, 20 + height);
		return c;
	};

	it('brings an ink extent of 48 px to 32', () => {
		const { crop, transform } = frameRow(rowOf(48));
		expect(transform.scale).toBeCloseTo(32 / 48, 6);
		expect(Math.abs(span(crop) - 32)).toBeLessThanOrEqual(1);
	});

	it('brings an ink extent of 24 px to 32', () => {
		const { crop, transform } = frameRow(rowOf(24));
		expect(transform.scale).toBeCloseTo(32 / 24, 6);
		expect(Math.abs(span(crop) - 32)).toBeLessThanOrEqual(1);
	});

	it('takes the extent between 2 and 98 percent of the ink, so a stray speck does not set it', () => {
		const c = rowOf(40);
		rect(c, 100, 101, 2, 3); // one dark pixel 18 rows above the row
		expect(inkExtent(c.data, c.width, c.height)).toEqual([20, 59]);
		expect(frameRow(c).transform.scale).toBeCloseTo(32 / 40, 6);
	});

	it('uses the inkHeight it is given', () => {
		const { crop } = frameRow(rowOf(48), { inkHeight: 20 });
		expect(Math.abs(span(crop) - 20)).toBeLessThanOrEqual(1);
	});

	it('resizes both axes by the factor', () => {
		const { crop, transform } = frameRow(rowOf(24), { padRatio: 0 });
		expect(crop.width).toBe(Math.round(200 * transform.scale));
		expect(crop.height).toBe(Math.round(100 * transform.scale));
	});

	it('measures the extent from the top: cumulative ink at 2 and 98 percent, inclusive', () => {
		const c = blank(10, 100);
		rect(c, 0, 10, 10, 58); // 48 rows of equal ink
		expect(inkExtent(c.data, 10, 100)).toEqual([10, 57]);
	});

	it('has no extent for a crop with no ink', () => {
		expect(inkExtent(blank(10, 10).data, 10, 10)).toBeNull();
	});
});

describe('frameRow, padding', () => {
	const withPaper = (paper: number) => {
		const c = blank(120, 60, paper);
		rect(c, 30, 90, 20, 44);
		return c;
	};

	it('pads half the ink height, 16 px at 32, of the paper tone on every side by default, 176 on grey paper', () => {
		const { crop, transform } = frameRow(withPaper(176));
		const pad = DEFAULT_PAD_RATIO * DEFAULT_INK_HEIGHT;
		expect(pad).toBe(16);
		expect(transform.pad).toBe(pad);
		for (let x = 0; x < crop.width; x++) {
			expect(crop.data[x]).toBe(176);
			expect(crop.data[(pad - 1) * crop.width + x]).toBe(176);
			expect(crop.data[(crop.height - 1) * crop.width + x]).toBe(176);
		}
		for (let y = 0; y < crop.height; y++) {
			expect(crop.data[y * crop.width]).toBe(176);
			expect(crop.data[y * crop.width + crop.width - 1]).toBe(176);
		}
		expect(crop.paper).toBe(176);
	});

	it('pads 255 on white paper', () => {
		const { crop } = frameRow(withPaper(255));
		expect(crop.data[0]).toBe(255);
		expect(crop.data[crop.width * crop.height - 1]).toBe(255);
	});

	it('pads by the ratio it is given, of the ink height, and grows the crop by twice that', () => {
		const a = frameRow(withPaper(255), { padRatio: 0 }).crop;
		const b = frameRow(withPaper(255), { padRatio: 0.25 }).crop;
		expect([b.width, b.height]).toEqual([a.width + 16, a.height + 16]);
		const c = frameRow(withPaper(255), { padRatio: 0.25, inkHeight: 64 }).crop;
		const d = frameRow(withPaper(255), { padRatio: 0, inkHeight: 64 }).crop;
		expect([c.width - d.width, c.height - d.height]).toEqual([32, 32]);
	});

	it('names the paper tone as the most frequent grey, the lowest on a tie', () => {
		expect(paperTone(new Uint8Array([200, 200, 10, 255, 255, 255, 200]))).toBe(200);
		expect(paperTone(new Uint8Array([9, 9, 4, 4, 7]))).toBe(4);
	});

	it('is a crop of the size the transform says', () => {
		const { crop } = frameRow(withPaper(255));
		expect(crop.data.length).toBe(crop.width * crop.height);
		expect(DEFAULT_INK_HEIGHT).toBe(32);
	});
});

describe('frameRow, the transform back', () => {
	it('maps a glyph of the framed crop back to where it stood, within 1 px, for scale and padding', () => {
		const c = blank(300, 90);
		rect(c, 40, 60, 25, 55); // a glyph 20 by 30
		rect(c, 200, 230, 25, 55);
		const { crop, transform } = frameRow(c);
		expect(transform.angle).toBe(0);
		// The right-hand glyph: find its columns in the framed crop.
		const right = { ...crop, data: crop.data.map((g, i) => (i % crop.width < crop.width / 2 ? 255 : g)) };
		const found = inkBox(right);
		const back = unframeBox(transform, { x0: found.x0, y0: found.y0, x1: found.x1 + 1, y1: found.y1 + 1 });
		expect(Math.abs(back.x0 - 200)).toBeLessThanOrEqual(1);
		expect(Math.abs(back.x1 - 230)).toBeLessThanOrEqual(1);
		expect(Math.abs(back.y0 - 25)).toBeLessThanOrEqual(1);
		expect(Math.abs(back.y1 - 55)).toBeLessThanOrEqual(1);
	});

	it('maps with the padding and the scale of the transform it is given', () => {
		const t = { scale: 2, pad: 10, angle: 0, width: 100, height: 40 };
		expect(unframeBox(t, { x0: 30, y0: 14, x1: 70, y1: 30 })).toEqual({ x0: 10, y0: 2, x1: 30, y1: 10 });
		expect(unframePoint(t, 10, 10)).toEqual({ x: 0, y: 0 });
	});

	it('maps a point back through the turn too: the last glyph of a tilted row, to within 1.5 px', () => {
		const tilted = slanted(Math.tan((1.5 * Math.PI) / 180));
		const { crop, transform } = frameRow(tilted);
		const last = { ...crop, data: crop.data.map((g, i) => (i % crop.width < crop.width * 0.9 ? 255 : g)) };
		const b = inkBox(last);
		const centre = unframePoint(transform, (b.x0 + b.x1 + 1) / 2, (b.y0 + b.y1 + 1) / 2);
		const k = 15;
		const x = 20 + 36 * k;
		const y = 20 + Math.round(x * Math.tan((1.5 * Math.PI) / 180));
		expect(Math.abs(centre.x - (x + 7))).toBeLessThanOrEqual(1.5);
		expect(Math.abs(centre.y - (y + 10))).toBeLessThanOrEqual(1.5);
	});

	it('widens a box to the bounding box of its turn, which is the approximation for the angle', () => {
		const t = { scale: 1, pad: 0, angle: 3, width: 400, height: 40 };
		const b = unframeBox(t, { x0: 100, y0: 10, x1: 140, y1: 30 });
		expect(b.x1 - b.x0).toBeGreaterThan(40);
		expect(b.y1 - b.y0).toBeGreaterThan(20);
	});
});

describe('frameRow, a crop with no ink', () => {
	it('passes through steps 1 to 3 unchanged and is padded', () => {
		const c = blank(120, 40, 200);
		const { crop, transform } = frameRow(c);
		expect(transform).toEqual({ scale: 1, pad: 16, angle: 0, width: 120, height: 40 });
		expect([crop.width, crop.height]).toEqual([152, 72]);
		for (let y = 0; y < crop.height; y++) {
			for (let x = 0; x < crop.width; x++) expect(crop.data[y * crop.width + x]).toBe(200);
		}
	});

	it('keeps the grey it was given in the middle', () => {
		const c = blank(30, 20, 220);
		rect(c, 0, 30, 0, 20, 200); // not ink (200 is over 128), and the more frequent grey is 220 nowhere: 200 is
		const { crop } = frameRow(c);
		expect(crop.data[16 * crop.width + 16]).toBe(200);
		expect(crop.data[0]).toBe(200);
	});
});
