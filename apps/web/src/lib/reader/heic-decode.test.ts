/**
 * Row 113. The decoder against real HEIC bytes: the synthetic fixtures in
 * `fixtures/` (made by `fixtures/make-fixtures.py`), and, when
 * `ILYA_HEIC_REAL` names a file, a real iPhone photograph the repository does
 * not hold.
 *
 * "Upright" is judged by the staff lines: on a page the lines run across, so
 * many ROWS are mostly dark and next to no COLUMNS are. A page on its side has
 * it the other way round.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { decodeHeic, type HeicRgba } from './heic-decode';

const fixture = (name: string) => new Uint8Array(readFileSync(fileURLToPath(new URL(`./fixtures/${name}`, import.meta.url))));
const wasmBinary = new Uint8Array(
	readFileSync(fileURLToPath(new URL('../../../node_modules/libheif-js/libheif-wasm/libheif.wasm', import.meta.url)))
);
const decode = (bytes: Uint8Array) => decodeHeic(bytes, wasmBinary);

const grey = (p: HeicRgba, i: number) => (p.data[i] + p.data[i + 1] + p.data[i + 2]) / 3;

/** Rows and columns with more than half their pixels dark (grey under 100). */
function darkLines(p: HeicRgba): { rows: number; cols: number } {
	const colDark = new Uint32Array(p.width);
	let rows = 0;
	for (let y = 0; y < p.height; y++) {
		let dark = 0;
		for (let x = 0; x < p.width; x++) {
			if (grey(p, (y * p.width + x) * 4) < 100) {
				dark++;
				colDark[x]++;
			}
		}
		if (dark > p.width / 2) rows++;
	}
	let cols = 0;
	for (let x = 0; x < p.width; x++) if (colDark[x] > p.height / 2) cols++;
	return { rows, cols };
}

/** The same page turned a quarter turn, as a decoder that ignored `irot` would hand it over. */
function quarterTurn(p: HeicRgba): HeicRgba {
	const data = new Uint8ClampedArray(p.data.length);
	for (let y = 0; y < p.height; y++) {
		for (let x = 0; x < p.width; x++) {
			const from = (y * p.width + x) * 4;
			const to = (x * p.height + (p.height - 1 - y)) * 4;
			data.set(p.data.subarray(from, from + 4), to);
		}
	}
	return { width: p.height, height: p.width, data };
}

const MEAN_GREY = (p: HeicRgba) => {
	let sum = 0;
	for (let i = 0; i < p.data.length; i += 4) sum += grey(p, i);
	return sum / (p.data.length / 4);
};

describe('decodeHeic on the synthetic fixtures', () => {
	it('(a) reads a lossless page at its size, with the staff lines across', async () => {
		const page = await decode(fixture('staff-page.heic'));
		expect([page.width, page.height]).toEqual([1600, 2200]);
		expect(page.data.length).toBe(1600 * 2200 * 4);
		const { rows, cols } = darkLines(page);
		expect(rows).toBeGreaterThanOrEqual(100);
		expect(cols).toBe(0);
	});

	it('(b) stored on its side with an irot box comes back upright', async () => {
		const page = await decode(fixture('staff-page-irot.heic'));
		expect([page.width, page.height]).toEqual([1600, 2200]);
		const { rows, cols } = darkLines(page);
		expect(rows).toBeGreaterThanOrEqual(100);
		expect(cols).toBe(0);
	});

	it('the upright test can fail: a quarter turn of (b) reads as on its side', async () => {
		const sideways = quarterTurn(await decode(fixture('staff-page-irot.heic')));
		expect([sideways.width, sideways.height]).toEqual([2200, 1600]);
		const { rows, cols } = darkLines(sideways);
		expect(cols).toBeGreaterThanOrEqual(100);
		expect(rows).toBe(0);
	});

	it('(c) reads a grey photo-like page: paper near 200, lines across', async () => {
		const page = await decode(fixture('photo-page.heic'));
		expect([page.width, page.height]).toEqual([1600, 2200]);
		expect(MEAN_GREY(page)).toBeGreaterThan(185);
		expect(MEAN_GREY(page)).toBeLessThan(215);
		const { rows, cols } = darkLines(page);
		expect(rows).toBeGreaterThanOrEqual(100);
		expect(cols).toBe(0);
	});

	it('(e) reassembles a grid of 512 px tiles into one whole page', async () => {
		const page = await decode(fixture('staff-page-grid.heic'));
		expect([page.width, page.height]).toEqual([1600, 2200]);
		const { rows, cols } = darkLines(page);
		expect(rows).toBeGreaterThanOrEqual(100);
		expect(cols).toBe(0);
	});

	it('reads the primary image, not the first one listed', async () => {
		const page = await decode(fixture('two-images-second-primary.heic'));
		expect([page.width, page.height]).toEqual([800, 1100]);
		expect(darkLines(page).rows).toBeGreaterThan(0);
	});
});

describe('decodeHeic on files that are not whole', () => {
	it('rejects a HEIF cut short', async () => {
		const whole = fixture('staff-page.heic');
		await expect(decode(whole.slice(0, Math.floor(whole.length * 0.4)))).rejects.toThrow();
	});

	it('rejects bytes that are not HEIF', async () => {
		await expect(decode(new Uint8Array(2048).fill(7))).rejects.toThrow();
	});

	it('rejects when the decoder file cannot be fetched', async () => {
		// no wasmBinary, and Node has no origin for the relative URL
		await expect(decodeHeic(fixture('staff-page.heic'))).rejects.toThrow();
	});
});

const REAL = process.env.ILYA_HEIC_REAL;
describe.skipIf(!REAL)('decodeHeic on the real iPhone photograph (ILYA_HEIC_REAL)', () => {
	it('is upright: row-to-row variation of the page exceeds column-to-column', async () => {
		const page = await decode(new Uint8Array(readFileSync(REAL!)));
		// A photograph is not binary, so the lines are judged by how much the mean grey of a row
		// varies against how much the mean grey of a column does: horizontal lines vary the rows.
		const rowMean = new Float64Array(page.height);
		const colMean = new Float64Array(page.width);
		for (let y = 0; y < page.height; y++) {
			for (let x = 0; x < page.width; x++) {
				const g = grey(page, (y * page.width + x) * 4);
				rowMean[y] += g / page.width;
				colMean[x] += g / page.height;
			}
		}
		const variance = (a: Float64Array) => {
			const m = a.reduce((s, v) => s + v, 0) / a.length;
			return a.reduce((s, v) => s + (v - m) ** 2, 0) / a.length;
		};
		console.log(`ILYA_HEIC_REAL ${page.width}x${page.height} rowVariance=${variance(rowMean).toFixed(1)} colVariance=${variance(colMean).toFixed(1)}`);
		expect(variance(rowMean)).toBeGreaterThan(variance(colMean));
	});
});
