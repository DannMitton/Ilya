/**
 * The grow-only width (calm-loupe slice 3, 2026-09-28). Every expected value
 * is written out by hand from the ruling `loupe-hold.ts` cites.
 */
import { describe, expect, it } from 'vitest';
import { followScroll, GrowOnlyWidth, HeldHeight } from './loupe-hold';

describe('GrowOnlyWidth', () => {
	it('the first frame on a measure is its own width, not eased', () => {
		const h = new GrowOnlyWidth();
		expect(h.hold('m2|929', 600)).toEqual({ width: 600, eased: false });
	});

	it('on the same measure it grows, and eases the growth', () => {
		const h = new GrowOnlyWidth();
		h.hold('m2|929', 600);
		expect(h.hold('m2|929', 640)).toEqual({ width: 640, eased: true });
	});

	it('on the same measure it never shrinks', () => {
		const h = new GrowOnlyWidth();
		h.hold('m2|929', 640);
		expect(h.hold('m2|929', 600)).toEqual({ width: 640, eased: true });
		expect(h.hold('m2|929', 620)).toEqual({ width: 640, eased: true });
	});

	it('a new measure starts over, narrower or wider, at once', () => {
		const h = new GrowOnlyWidth();
		h.hold('m2|929', 640);
		expect(h.hold('m3|929', 500)).toEqual({ width: 500, eased: false });
	});

	it('a new room starts over, so a width from a wider room cannot stand', () => {
		const h = new GrowOnlyWidth();
		h.hold('m2|1200', 1100);
		expect(h.hold('m2|929', 929)).toEqual({ width: 929, eased: false });
	});

	it('returning to a measure after another starts over too', () => {
		const h = new GrowOnlyWidth();
		h.hold('m2|929', 700);
		h.hold('m3|929', 500);
		expect(h.hold('m2|929', 650)).toEqual({ width: 650, eased: false });
	});
});

describe('followScroll', () => {
	it('leaves a span already in view where it is', () => {
		expect(followScroll(100, 500, 200, 260, 24)).toBe(100);
	});

	it('scrolls right just far enough to show a span past the right edge', () => {
		expect(followScroll(0, 500, 600, 660, 24)).toBe(184);
	});

	it('scrolls left just far enough to show a span past the left edge', () => {
		expect(followScroll(400, 500, 300, 360, 24)).toBe(276);
	});

	it('never scrolls before the strip begins', () => {
		expect(followScroll(50, 500, 10, 40, 24)).toBe(0);
	});
});

describe('HeldHeight', () => {
	it('holds the first height drawn on a measure, whatever comes after', () => {
		const h = new HeldHeight();
		expect(h.hold('m2|929|1.000', 225)).toBe(225);
		expect(h.hold('m2|929|1.000', 328)).toBe(225);
		expect(h.hold('m2|929|1.000', 200)).toBe(225);
	});

	it('starts over on a new measure or a new room', () => {
		const h = new HeldHeight();
		h.hold('m2|929|1.000', 225);
		expect(h.hold('m3|929|1.000', 328)).toBe(328);
		expect(h.hold('m3|1200|1.000', 250)).toBe(250);
	});
});
