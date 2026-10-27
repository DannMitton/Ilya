/**
 * ROW 113: Ilya opens iPhone photos in HEIC.
 *
 * Playwright's Chromium does not decode HEIC, so `createImageBitmap` rejects and
 * `toGreyscalePng` takes the WebAssembly fallback. The same page, as a lossless
 * HEIC and as the PNG it was encoded from, must come out as the same ink.
 *
 *     pnpm --filter @ilya/web exec playwright test --project=chromium heic-fallback
 */
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const FIXTURES = 'src/lib/reader/fixtures';
const b64 = (name: string) => readFileSync(`${FIXTURES}/${name}`).toString('base64');

test('a lossless HEIC page reads as the same ink as its source PNG', async ({ page }) => {
	test.setTimeout(120_000);
	await page.goto('/');
	const result = await page.evaluate(
		async ({ heic, png }) => {
			const bytes = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
			const { toGreyscalePng } = await import('/src/lib/reader/page-image.ts');
			const pixels = async (ink: ArrayBuffer) => {
				const bitmap = await createImageBitmap(new Blob([ink], { type: 'image/png' }));
				const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
				const ctx = canvas.getContext('2d')!;
				ctx.drawImage(bitmap, 0, 0);
				return { width: bitmap.width, height: bitmap.height, data: ctx.getImageData(0, 0, bitmap.width, bitmap.height).data };
			};
			const nativeHeic = await createImageBitmap(new Blob([bytes(heic)], { type: 'image/heic' })).then(
				() => true,
				() => false
			);
			const fromHeic = await pixels(await toGreyscalePng(new File([bytes(heic)], 'IMG_0001.HEIC', { type: 'image/heic' })));
			const fromPng = await pixels(await toGreyscalePng(new File([bytes(png)], 'staff-page.png', { type: 'image/png' })));
			let within = 0;
			let worst = 0;
			const n = fromPng.data.length / 4;
			for (let i = 0; i < n; i++) {
				const d = Math.abs(fromHeic.data[i * 4] - fromPng.data[i * 4]);
				if (d <= 2) within++;
				if (d > worst) worst = d;
			}
			return {
				nativeHeic,
				heicSize: [fromHeic.width, fromHeic.height],
				pngSize: [fromPng.width, fromPng.height],
				share: within / n,
				worst
			};
		},
		{ heic: b64('staff-page.heic'), png: b64('staff-page.png') }
	);
	expect(result.nativeHeic, 'this Chromium decodes HEIC itself, so the fallback is not exercised').toBe(false);
	expect(result.heicSize).toEqual([1600, 2200]);
	expect(result.heicSize).toEqual(result.pngSize);
	console.log(`HEIC against PNG ink: ${(result.share * 100).toFixed(3)} percent within 2 levels, worst ${result.worst}`);
	expect(result.share).toBeGreaterThanOrEqual(0.99);
});
