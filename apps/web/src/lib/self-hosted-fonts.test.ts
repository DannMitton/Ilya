/**
 * Closing polish lane, step 6 (row 155, N.197): Ilya's fonts and its photo reader come from its own site. A TEXT TEST over the source
 * and the static folder, as the app has no DOM under vitest. The browser run in the step's report is the render.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const WEB = join(__dirname, '../..');
const read = (p: string) => readFileSync(join(WEB, p), 'utf8');

describe('the page asks no outside host for a font', () => {
	it('names no Google font host in the page shell or the page', () => {
		for (const p of ['src/app.html', 'src/routes/+page.svelte', 'src/app.css', 'static/fonts/google-families.css']) {
			expect(read(p), p).not.toMatch(/fonts\.googleapis\.com|fonts\.gstatic\.com/);
		}
	});
	it('links its own stylesheet once, in the shell', () => {
		expect(read('src/app.html').match(/href="\/fonts\/google-families\.css"/g)).toHaveLength(1);
	});
	const css = read('static/fonts/google-families.css');
	const faces = [...css.matchAll(/@font-face \{[^}]*\}/g)].map((m) => m[0]);
	it('declares the four families, every block with swap and a unicode-range', () => {
		expect(new Set(faces.map((f) => /font-family: '([^']+)'/.exec(f)![1]))).toEqual(new Set(['Source Sans 3', 'Source Serif 4', 'Noto Sans', 'Noto Serif']));
		expect(faces).toHaveLength(84);
		for (const f of faces) {
			expect(f).toContain('font-display: swap;');
			expect(f).toContain('unicode-range:');
		}
	});
	it('has every file the stylesheet names, as a woff2, and an OFL.txt in each family folder', () => {
		const urls = new Set([...css.matchAll(/url\((\/fonts\/[^)]+\.woff2)\)/g)].map((m) => m[1]));
		expect(urls.size).toBe(58);
		for (const u of urls) {
			expect(existsSync(join(WEB, 'static', u)), u).toBe(true);
			expect(readFileSync(join(WEB, 'static', u)).subarray(0, 4).toString('latin1'), u).toBe('wOF2');
		}
		for (const d of ['source-sans-3', 'source-serif-4', 'noto-sans', 'noto-serif']) expect(existsSync(join(WEB, 'static/fonts', d, 'OFL.txt')), d).toBe(true);
	});
});

describe('the photo reader is given Ilya’s own paths', () => {
	it('calls createWorker with the helper’s arguments, and the helper keeps tesseract’s defaults for gzip and cacheMethod', () => {
		expect(read('src/lib/score/ScoreUploader.svelte')).toContain('createWorker(...photoWorkerArgs(location.origin))');
		const helper = read('src/lib/omr/underlay-recognize.ts');
		const body = /export function photoWorkerArgs[\s\S]*?\n}/.exec(helper)![0];
		expect(body).not.toMatch(/gzip|cacheMethod/);
	});
	it('copies the model as it is, and the package is pinned exactly', () => {
		expect(read('scripts/copy-underlay-model.mjs')).toContain("[photoModel, 'rus.traineddata.gz']");
		expect(JSON.parse(read('package.json')).dependencies['@tesseract.js-data/rus']).toBe('1.0.0');
	});
});
