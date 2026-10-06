import { describe, expect, it } from 'vitest';
import { renderScaleFor } from './page-pdf';

const BASE = 400 / 72;
const px = (wPt: number, hPt: number) => {
	const s = renderScaleFor(wPt, hPt);
	return [Math.round(wPt * s), Math.round(hPt * s)];
};

describe('renderScaleFor: no printed page is larger than a sheet of tabloid paper', () => {
	it('leaves real-size pages at exactly 400 dpi', () => {
		for (const [w, h] of [
			[665.76, 885.6], // the working Mussorgsky pages
			[595.28, 841.89], // A4
			[612, 792], // Letter
			[792, 1224], // tabloid, the largest real sheet (11 x 17)
			[1224, 792], // tabloid on its side
			[841.89, 595.28], // A4 on its side
		]) {
			expect(renderScaleFor(w, h)).toBe(BASE);
		}
	});

	it('renders a page claiming 1860 x 2630 pt as a tabloid sheet', () => {
		const [w, h] = px(1860, 2630.25);
		expect(w).toBe(4400);
		expect(h).toBeLessThanOrEqual(6800);
		expect(h / w).toBeCloseTo(2630.25 / 1860, 2);
	});

	it('does the same on its side', () => {
		const [w, h] = px(2630.25, 1860);
		expect(h).toBe(4400);
		expect(w).toBeLessThanOrEqual(6800);
	});

	it('is limited by the long side where that is the tighter fit', () => {
		const [w, h] = px(800, 2400); // narrow and tall
		expect(h).toBe(6800);
		expect(w).toBeLessThan(4400);
	});

	it('falls back to 400 dpi on a degenerate size rather than returning NaN', () => {
		expect(renderScaleFor(0, 0)).toBe(BASE);
		expect(renderScaleFor(Number.NaN, 100)).toBe(BASE);
	});
});
