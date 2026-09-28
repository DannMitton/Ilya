/**
 * The grow-only width (calm-loupe slice 3, 2026-09-28). Every expected value
 * is written out by hand from the ruling `loupe-hold.ts` cites.
 */
import { describe, expect, it } from 'vitest';
import { cleanEdges, followScroll, GrowOnlyWidth, HeldHeight } from './loupe-hold';

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

/* Calm-loupe slice 7, observation 3. Strip pixels, window 225 px, the pad 8,
   from «Скучай» m. 25 at A1 as measured in the pane: the follow left the
   scroll at 23, the IPA row's ink at 239 to 265, the Cyrillic's at 290 to 311. */
describe('cleanEdges', () => {
	const ipa = [239, 265] as const;
	const cyr = [290, 311] as const;

	it('moves a cut row out of the window, whole, when the note allows', () => {
		expect(cleanEdges(23, 225, [210, 222], [ipa, cyr], 8)).toBe(13);
	});

	it('takes the row in whole when the note stands too near it to leave', () => {
		expect(cleanEdges(23, 225, [200, 236], [ipa, cyr], 8)).toBe(40);
	});

	it('gives up the air around the note before it cuts a row', () => {
		expect(cleanEdges(23, 225, [30, 236], [ipa, cyr], 8)).toBe(13);
	});

	it('keeps the follow where neither keeps the note in view', () => {
		expect(cleanEdges(23, 225, [30, 240], [ipa, cyr], 8)).toBe(23);
	});

	it('does not count an overhang under a pixel as a cut', () => {
		expect(cleanEdges(0, 225, [60, 120], [[200, 225.6]], 8)).toBe(0);
	});

	it('leaves a clean edge alone', () => {
		expect(cleanEdges(0, 225, [60, 120], [ipa, cyr], 8)).toBe(0);
	});

	it('clears the top edge the same way', () => {
		expect(cleanEdges(10, 225, [100, 150], [[0, 20]], 8)).toBe(21);
	});

	it('never asks for a scroll the window cannot reach', () => {
		expect(cleanEdges(23, 225, [200, 240], [ipa], 8, 30)).toBe(23);
	});
});
