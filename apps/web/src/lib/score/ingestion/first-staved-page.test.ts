/**
 * The cover-page search (QUEUE row 44). The fake rasterizer renders pages in
 * order up to the limit and shows each to `stop`, as `rasterizePdf` does; a
 * page's "ink" is a one-byte buffer holding its number, and `has` reads its
 * staves from a table, so every expectation is read off the input.
 */
import { describe, expect, it } from 'vitest';
import { COVER_SEARCH_PAGES, MIN_TEXT_LETTERS, decidePdfRoute, lettersIn, searchForStaves, type Rasterize } from './first-staved-page';

const ink = (n: number): ArrayBuffer => new Uint8Array([n]).buffer;
const numberOf = (b: ArrayBuffer) => new Uint8Array(b)[0];

function pdf(pageCount: number, failOn?: number) {
	const rendered: number[] = [];
	const rasterize: Rasterize = async (limit, stop) => {
		const out: ArrayBuffer[] = [];
		for (let n = 1; n <= Math.min(pageCount, limit); n++) {
			if (n === failOn) throw new Error(`page ${n} will not render`);
			rendered.push(n);
			out.push(ink(n));
			if (await stop(ink(n), n)) break;
		}
		return out;
	};
	return { rasterize, rendered };
}
const stavesOn = (...pages: number[]) => async (b: ArrayBuffer) => pages.includes(numberOf(b));

describe('looking past a cover for the first page with staves', () => {
	it('sends a PDF to the reader when page 1 has no staves and page 2 has', async () => {
		const p = pdf(5);
		const r = await searchForStaves(p.rasterize, stavesOn(2, 3, 4, 5));
		expect(r!.stavedPage).toBe(2);
		expect(numberOf(r!.ink)).toBe(1);
		// It stops at the first staved page: pages 3 to 5 are never rendered.
		expect(p.rendered).toEqual([1, 2]);
	});

	it('goes to the poem route with page 1 when none of the first four pages has staves', async () => {
		const p = pdf(9);
		const r = await searchForStaves(p.rasterize, stavesOn(5, 6));
		expect(r!.stavedPage).toBeNull();
		expect(numberOf(r!.ink)).toBe(1);
		expect(p.rendered).toEqual([1, 2, 3, 4]);
		expect(COVER_SEARCH_PAGES).toBe(4);
	});

	it('leaves a one-page score unchanged: page 1, staved, one page rendered', async () => {
		const p = pdf(1);
		const r = await searchForStaves(p.rasterize, stavesOn(1));
		expect(r).toEqual({ ink: expect.anything(), stavedPage: 1 });
		expect(p.rendered).toEqual([1]);
	});

	it('leaves a one-page poem unchanged: page 1, no staves', async () => {
		const r = await searchForStaves(pdf(1).rasterize, stavesOn());
		expect(r!.stavedPage).toBeNull();
		expect(numberOf(r!.ink)).toBe(1);
	});

	it('finds staves on the fourth page but not the fifth', async () => {
		expect((await searchForStaves(pdf(6).rasterize, stavesOn(4)))!.stavedPage).toBe(4);
		expect((await searchForStaves(pdf(6).rasterize, stavesOn(5)))!.stavedPage).toBeNull();
	});

	it('ends the search quietly when a page after the first will not render, keeping page 1 for the poem route', async () => {
		const r = await searchForStaves(pdf(4, 3).rasterize, stavesOn(4));
		expect(r!.stavedPage).toBeNull();
		expect(numberOf(r!.ink)).toBe(1);
	});

	it('fails when page 1 itself will not render, and answers null for a PDF with no pages', async () => {
		await expect(searchForStaves(pdf(3, 1).rasterize, stavesOn(1))).rejects.toThrow('page 1 will not render');
		expect(await searchForStaves(pdf(0).rasterize, stavesOn(1))).toBeNull();
	});
});

describe('where a PDF goes (QUEUE row 45)', () => {
	const poem = 'Вчера мы шли по полю и пели о весне, о дальней стороне, о тихой реке и белой луне.';

	it('goes to the reader, told staves were found, when a page has staves', () => {
		expect(decidePdfRoute(2, poem)).toEqual({ to: 'reader', stavesFound: true });
		expect(decidePdfRoute(1, null)).toEqual({ to: 'reader', stavesFound: true });
	});

	it('goes to the reader anyway, told none were found, when there are no staves and no usable text layer', () => {
		expect(decidePdfRoute(null, '')).toEqual({ to: 'reader', stavesFound: false });
		expect(decidePdfRoute(null, ' \n 1 2 3 \n . . ')).toEqual({ to: 'reader', stavesFound: false });
		// A stray watermark's worth of letters is still no text layer.
		expect(decidePdfRoute(null, 'IMSLP')).toEqual({ to: 'reader', stavesFound: false });
	});

	it('goes straight to the poem route when there are no staves and a text layer', () => {
		expect(decidePdfRoute(null, poem)).toEqual({ to: 'poem' });
		expect(decidePdfRoute(null, 'a'.repeat(MIN_TEXT_LETTERS))).toEqual({ to: 'poem' });
		expect(decidePdfRoute(null, 'a'.repeat(MIN_TEXT_LETTERS - 1))).toEqual({ to: 'reader', stavesFound: false });
	});

	it('goes to the poem route, as before, when the text layer cannot be read', () => {
		expect(decidePdfRoute(null, null)).toEqual({ to: 'poem' });
	});

	it('counts letters in any script, not digits or marks', () => {
		expect(lettersIn('Весна, 1899!')).toBe(5);
		expect(lettersIn('Spring 12')).toBe(6);
	});
});
