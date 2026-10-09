import { test, expect } from '@playwright/test';
import path from 'path';
import { waitForDictionary } from './helpers';

/*
 * A PRINT HOLDS EXACTLY THE PAGES ILYA NUMBERS. Walk finding 2026-10-09 (Dann,
 * "A BLANK LAST PAGE IN PRINT" in docs/memory/OPEN.md): Markup printed one
 * sheet more than its "Page N of M", and Insights printed two for its one.
 * The cause was a 2rem bottom padding on `.markup-paper-container` and
 * `.insights-container` that the print reset in app.css named for
 * `.paper-container` only. This opens the one tracked engraved fixture,
 * counts the `.paper-page` sheets on screen, then counts the pages Chromium
 * prints (letter, `preferCSSPageSize`), and says the two are equal on each
 * document.
 */
test.use({ viewport: { width: 1440, height: 900 } });

const pdfPageCount = (pdf: Buffer): number => (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;

test('Text, Markup, and Insights each print the pages Ilya numbers', async ({ page }) => {
	await page.goto('/');
	await waitForDictionary(page);
	const fixture = path.resolve(process.cwd(), 'src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml');
	await page.locator('input[type="file"].hidden-input').setInputFiles(fixture);
	await expect(page.locator('.receipt-score')).toBeVisible({ timeout: 10_000 });
	await page.waitForSelector('[data-word-index="0-0"]', { timeout: 10_000 });

	for (const tab of ['text', 'markup', 'insights']) {
		await page.locator(`#tab-${tab}`).click();
		await page.waitForTimeout(2_500);
		const sheets = await page.locator('.paper-page:visible').count();
		expect(sheets, `${tab}: there is something to print`).toBeGreaterThan(0);
		const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true });
		expect(pdfPageCount(pdf), `${tab}: pages printed against sheets on screen`).toBe(sheets);
	}
});
