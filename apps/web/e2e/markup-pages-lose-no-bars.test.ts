import { test, expect } from '@playwright/test';
import path from 'path';
import { waitForDictionary } from './helpers';

/*
 * MARKUP'S PAGES LOSE NO BARS (QUEUE row 72). Found on row 25: on the
 * Tchaikovsky song, page 1 drew three systems after a tall empty band and cut
 * the next ones off at the footer, because a stylesheet rule sized each NESTED
 * system `<svg>` to the whole page. This opens each engraved fixture on
 * Markup and says, of the live page: every bar is drawn once, and every
 * system's staff box, read from its own screen transform, stands inside the
 * page's score window.
 */
test.use({ viewport: { width: 1440, height: 900 } });

for (const fixture of ['tchaikovsky-op38-3-voice.musicxml', 'sunless-01-engraved.musicxml']) {
	test(`Markup draws every bar of ${fixture} once, inside its page`, async ({ page }) => {
		await page.goto('/');
		await waitForDictionary(page);
		await page.locator('input[type="file"].hidden-input').setInputFiles(path.resolve(process.cwd(), 'src/lib/score/ingestion/fixtures', fixture));
		await expect(page.locator('.receipt-score')).toBeVisible({ timeout: 10_000 });
		await page.locator('#tab-markup').click();
		await page.waitForTimeout(3_000);
		const r = await page.evaluate(() => {
			const bars: number[] = [];
			const outside: string[] = [];
			for (const win of document.querySelectorAll('.markup-paper-container .score-window')) {
				const w = win.getBoundingClientRect();
				for (const sys of win.querySelectorAll<SVGSVGElement>(':scope > svg > svg[data-system]')) {
					const [a, b] = sys.getAttribute('data-system')!.split('-').map(Number);
					for (let i = a; i <= b; i++) bars.push(i);
					const vb = sys.viewBox.baseVal;
					const m = sys.getScreenCTM()!;
					const top = m.f + m.d * vb.y;
					const bottom = top + m.d * vb.height;
					if (top < w.top - 1 || bottom > w.bottom + 1) outside.push(`${a}-${b}`);
				}
			}
			return { bars, outside };
		});
		expect(r.outside, 'systems drawn outside their page window').toEqual([]);
		expect(r.bars).toEqual(r.bars.map((_, i) => i));
		expect(r.bars.length).toBeGreaterThan(10);
	});
}
