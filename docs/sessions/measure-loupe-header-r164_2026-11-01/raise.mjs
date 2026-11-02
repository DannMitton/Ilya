// Row 164 harness: raises the Loupe on MELODY, song 1 (Without Sun), bar 2, and returns the page.
// usage: import { raise } from './raise.mjs'
import { createRequire } from 'node:module';
import path from 'node:path';
const ROOT = path.resolve(import.meta.dirname, '../../..');
const { chromium } = createRequire(path.join(ROOT, 'apps/web/package.json'))('@playwright/test');
export const FIXTURE = path.join(ROOT, 'apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml');
export async function raise({ width, height, phone, base = 'http://localhost:5173/', bar = 2 }) {
	const browser = await chromium.launch();
	const ctx = await browser.newContext({
		viewport: { width, height },
		serviceWorkers: 'block',
		...(phone ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {}),
	});
	const page = await ctx.newPage();
	const seats = page.waitForEvent('console', { predicate: (m) => m.text().startsWith('[Ilya] N.160 seats:'), timeout: 90_000 });
	await page.goto(base);
	await page.locator('input.hidden-input').setInputFiles(FIXTURE);
	await page.getByRole('tab', { name: /Markup|Melody/i }).first().click();
	await page.locator('.score-page [data-hit]').first().waitFor({ state: 'attached' });
	await seats.catch(() => {});
	await page.waitForTimeout(5000);
	const asWritten = page.getByRole('button', { name: 'As written' });
	if (await asWritten.count()) await asWritten.first().click();
	await page.waitForTimeout(800);
	const hits = page.locator('.score-page [data-hit]');
	const n = await hits.count();
	for (let i = 0; i < Math.min(n, 30); i++) {
		const hit = hits.nth(i);
		await hit.scrollIntoViewIfNeeded();
		await hit.click({ force: true });
		const tag = page.locator('.loupe .loupe-tag');
		if (await tag.count()) {
			const txt = ((await tag.textContent()) ?? '').replace(/\s+/g, ' ').trim();
			if (new RegExp(`^m\\. ${bar}\\b`).test(txt)) { await page.waitForTimeout(1500); return { browser, page, tag: txt }; }
			await page.keyboard.press('Escape');
			await page.waitForTimeout(300);
		}
	}
	throw new Error('bar not found');
}
