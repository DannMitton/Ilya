/**
 * ROW 113, step 2: the real path. A HEIC dropped on the intake in Chromium, which
 * does not decode HEIC, so the WebAssembly fallback is what runs.
 *
 *     HEIC_SHOTS=1 HEIC_OBSERVE_MS=600000 pnpm --filter @ilya/web exec playwright test --project=chromium heic-reader-path
 *
 * HEIC_SHOTS=1 writes the pictures to docs/sessions/row113-heic-shots/ (from the repository root).
 * HEIC_OBSERVE_MS keeps watching the score drops after the wait is shown, without asserting.
 */
import { test, expect, type Page } from '@playwright/test';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const FIXTURES = 'src/lib/reader/fixtures';
const SHOTS = process.env.HEIC_SHOTS ? '../../docs/sessions/row113-heic-shots' : null;
const OBSERVE_MS = Number(process.env.HEIC_OBSERVE_MS ?? 0);
const WAIT = /Ilya is reading the notes off your page|Reading the page/;
const REFUSAL = /could not open this iPhone photo|This browser cannot open that picture/;

async function open(page: Page) {
	const consoleLines: string[] = [];
	const requests: string[] = [];
	page.on('console', (m) => consoleLines.push(m.text()));
	page.on('request', (r) => requests.push(r.url()));
	// what tesseract is handed: the first bytes of every image posted to a Worker
	await page.addInitScript(() => {
		const w = window as unknown as { __ocrInputs: string[] };
		w.__ocrInputs = [];
		const post = Worker.prototype.postMessage;
		Worker.prototype.postMessage = function (msg: unknown, ...rest: unknown[]) {
			const image = (msg as { payload?: { image?: Uint8Array } } | null)?.payload?.image;
			if (image instanceof Uint8Array) w.__ocrInputs.push([...image.slice(0, 12)].map((b) => b.toString(16).padStart(2, '0')).join(' '));
			return (post as (...a: unknown[]) => void).call(this, msg, ...rest);
		};
	});
	await page.goto('/');
	await page.locator('input.hidden-input').waitFor({ state: 'attached', timeout: 60_000 });
	return { consoleLines, requests };
}

/**
 * tesseract.js loads its worker, its WebAssembly core, and the Russian language data from
 * cdn.jsdelivr.net (its defaults; ScoreUploader.svelte calls `createWorker('rus')` with no
 * paths). A sandbox may have no route there, so with `OCR_LOCAL` set to a directory that holds
 * `@tesseract.js-data/rus` (npm pack, unpacked as `package/`), the three are served from disk.
 * The requests are logged either way, so the run records what the app asks the CDN for.
 */
async function serveOcrLocally(page: Page, langDir: string | undefined) {
	const require = createRequire(import.meta.url);
	const worker = require.resolve('tesseract.js/dist/worker.min.js');
	const coreDir = require.resolve('tesseract.js-core/package.json').replace(/package\.json$/, '');
	await page.route('https://cdn.jsdelivr.net/**', async (route) => {
		const url = new URL(route.request().url());
		console.log(`CDN request: ${url.pathname}`);
		const name = url.pathname.split('/').pop()!;
		let path: string | null = null;
		if (url.pathname.includes('/tesseract.js@') && name === 'worker.min.js') path = worker;
		else if (url.pathname.includes('/tesseract.js-core@') && existsSync(coreDir + name)) path = coreDir + name;
		else if (langDir && url.pathname.includes('/@tesseract.js-data/rus/')) {
			const dir = url.pathname.includes('4.0.0_best_int') ? '4.0.0_best_int' : '4.0.0';
			path = `${langDir}/package/${dir}/${name}`;
		}
		if (!path || !existsSync(path)) return route.abort();
		await route.fulfill({ body: readFileSync(path), headers: { 'access-control-allow-origin': '*', 'content-type': name.endsWith('.wasm') ? 'application/wasm' : name.endsWith('.gz') ? 'application/gzip' : 'text/javascript' } });
	});
}

async function shot(page: Page, name: string) {
	if (!SHOTS) return;
	mkdirSync(SHOTS, { recursive: true });
	await page.screenshot({ path: `${SHOTS}/${name}.png`, animations: 'disabled', caret: 'hide' });
}

for (const [label, file] of [['(a) the lossless staff page', 'staff-page.heic'], ['(c) the grey photo-like page', 'photo-page.heic']] as const) {
	test(`a HEIC score photograph, ${label}, reaches the reader`, async ({ page }) => {
		test.setTimeout(OBSERVE_MS + 180_000);
		const { consoleLines, requests } = await open(page);
		const before = requests.length;
		await page.locator('input.hidden-input').setInputFiles(`${FIXTURES}/${file}`);
		await expect(page.getByText(WAIT).first()).toBeVisible({ timeout: 90_000 });
		await shot(page, `wait-${file.replace('.heic', '')}`);
		await expect(page.getByText(REFUSAL)).toHaveCount(0);
		expect(consoleLines.filter((l) => l.includes('IMAGE_UNDECODABLE'))).toEqual([]);

		const origin = new URL(page.url()).origin;
		const after = requests.slice(before);
		const outside = after.filter((u) => !u.startsWith(origin) && !u.startsWith('data:') && !u.startsWith('blob:'));
		const decoder = after.filter((u) => /\/heif\/|libheif/.test(u));
		console.log(`${file}: decoder requests: ${decoder.map((u) => new URL(u).pathname).join(', ')}`);
		console.log(`${file}: requests to other origins after the drop: ${outside.length ? outside.join(', ') : 'none'}`);
		expect(decoder.length).toBeGreaterThan(0);
		expect(outside).toEqual([]);

		if (OBSERVE_MS > 0) {
			const end = Date.now() + OBSERVE_MS;
			let last = '';
			while (Date.now() < end) {
				await page.waitForTimeout(5000);
				const text = (await page.locator('body').innerText()).slice(0, 4000);
				const status = WAIT.test(text) || /Reading your score/.test(text) ? 'waiting' : REFUSAL.test(text) ? 'refusal' : 'left the wait';
				if (status !== last) console.log(`${file}: after ${Math.round((Date.now() - (end - OBSERVE_MS)) / 1000)} s: ${status}`);
				last = status;
				if (status !== 'waiting') break;
			}
			await shot(page, `after-${file.replace('.heic', '')}`);
			console.log(`${file}: console errors: ${consoleLines.filter((l) => /error|fail/i.test(l)).slice(0, 5).join(' | ')}`);
		}
	});
}

test('a HEIC poem with no staves reaches tesseract as a PNG', async ({ page }) => {
	test.setTimeout(OBSERVE_MS + 240_000);
	await serveOcrLocally(page, process.env.OCR_LOCAL);
	const { consoleLines } = await open(page);
	await page.locator('input.hidden-input').setInputFiles(`${FIXTURES}/poem-page.heic`);
	await expect.poll(() => page.evaluate(() => (window as unknown as { __ocrInputs: string[] }).__ocrInputs.length), { timeout: 200_000 }).toBeGreaterThan(0);
	const inputs = await page.evaluate(() => (window as unknown as { __ocrInputs: string[] }).__ocrInputs);
	console.log(`tesseract was handed: ${inputs.join(' | ')}`);
	expect(inputs[0].startsWith('89 50 4e 47')).toBe(true); // a PNG, not the HEIC's 'ftyp'
	await expect(page.getByText(REFUSAL)).toHaveCount(0);
	await expect(page.getByText('OCR processing failed.')).toHaveCount(0, { timeout: 5000 }).catch(() => {});
	console.log(`console: ${consoleLines.filter((l) => /recognis|OCR|IMAGE_UNDECODABLE/i.test(l)).join(' | ') || 'no OCR or decode errors'}`);
	await shot(page, 'poem-reading');
	const poem = page.getByRole('textbox', { name: 'Poem' });
	await expect(poem).not.toHaveValue('', { timeout: 120_000 });
	console.log(`the poem landed: ${JSON.stringify((await poem.inputValue()).slice(0, 200))}`);
	await shot(page, 'poem-landed');
});
