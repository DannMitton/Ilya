/**
 * Strophic lane A, Step 4a (brief r5): at phone width each later pass of a strophic song still starts mid-system, and the
 * page names no later-pass event by a live handle. See `e2e/strophic-melody.test.ts`.
 *
 *     PW_CHROMIUM_PATH=/opt/pw-browsers/chromium pnpm --filter @ilya/web exec playwright test --project=phone strophic-melody
 */
import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';

const FIXTURE = path.resolve(process.cwd(), '../../packages/score-parser/src/fixtures/strophic-repeat.musicxml');

async function raise(page: Page) {
	await page.goto('/');
	await page.locator('input.hidden-input').setInputFiles(FIXTURE);
	await page.getByRole('tab', { name: 'MELODY' }).click();
	await page.locator('.score-page [data-hit]').first().waitFor({ state: 'attached', timeout: 30_000 });
	await page.waitForTimeout(3_000);
}

test('at 390 px each later pass starts mid-system and later passes are inert', async ({ page }) => {
	test.setTimeout(120_000);
	await raise(page);
	const systems = await page.evaluate(() =>
		[...document.querySelectorAll('.score-page svg[data-system], .score-page svg[data-verse-system]')].map((s) => ({
			hits: [...s.querySelectorAll('[data-hit]')].map((h) => ({ id: h.getAttribute('data-hit')!, x: Number(h.getAttribute('x')) })),
			vhits: [...s.querySelectorAll('[data-verse-hit]')].map((h) => ({ id: h.getAttribute('data-verse-hit')!, x: Number(h.getAttribute('x')) })),
		})),
	);
	expect(await page.locator('.score-page [data-hit*="~v"], .score-page [data-event-id*="~v"]').count()).toBe(0);
	for (const k of [2, 3]) {
		const holder = systems.find((s) => s.vhits.some((h) => h.id === `m3-0-1~v${k}`));
		expect(holder, `pass ${k}'s first note`).toBeTruthy();
		const first = holder!.vhits.find((h) => h.id === `m3-0-1~v${k}`)!;
		expect([...holder!.hits, ...holder!.vhits].filter((h) => h.x < first.x).length).toBeGreaterThan(0);
	}
	// Step 4b: the labels stand at the two later passes, and no bar number or tag has ink left of its system's edge
	const ink = await page.evaluate(() => ({
		labels: [...document.querySelectorAll('.score-page [data-verse-label]')].map((l) => l.textContent),
		left: [...document.querySelectorAll('.score-page [data-bar-number]')].map((n) => ({ text: n.textContent, x: (n as SVGGraphicsElement).getBBox().x })),
	}));
	expect(ink.labels).toEqual(['Verse 2', 'Verse 3']);
	expect(ink.left.filter((n) => n.x < -0.01), 'bar numbers or tags with ink left of the system edge').toEqual([]);
	expect(ink.left.some((n) => /\u00b7 verse \d/.test(n.text ?? ''))).toBe(true);
});
