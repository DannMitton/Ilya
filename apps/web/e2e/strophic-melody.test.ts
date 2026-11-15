/**
 * Strophic lane A, Step 4a (brief r5): MELODY prints a strophic song in the order it is sung, on the live page.
 * `strophic-repeat.musicxml`: an introduction, a six-bar passage in a repeat over three verses, a two-bar ending.
 *
 *     PW_CHROMIUM_PATH=/opt/pw-browsers/chromium pnpm --filter @ilya/web exec playwright test --project=chromium strophic-melody
 */
import { test, expect, type Page } from '@playwright/test';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const FIXTURE = path.resolve(process.cwd(), '../../packages/score-parser/src/fixtures/strophic-repeat.musicxml');

async function raise(page: Page, file: string = FIXTURE) {
	await page.goto('/');
	await page.locator('input.hidden-input').setInputFiles(file);
	await page.getByRole('tab', { name: 'MELODY' }).click();
	await page.locator('.score-page [data-hit]').first().waitFor({ state: 'attached', timeout: 30_000 });
	await page.waitForTimeout(3_000);
}

/** Every system on the page, in order, with the handle it carries and the events it holds. */
async function systemsOf(page: Page) {
	return page.evaluate(() =>
		[...document.querySelectorAll('.score-page svg[data-system], .score-page svg[data-verse-system]')].map((s) => ({
			own: s.getAttribute('data-system'),
			verse: s.getAttribute('data-verse-system'),
			hits: [...s.querySelectorAll('[data-hit]')].map((h) => ({ id: h.getAttribute('data-hit')!, x: Number(h.getAttribute('x')) })),
			vhits: [...s.querySelectorAll('[data-verse-hit]')].map((h) => ({ id: h.getAttribute('data-verse-hit')!, x: Number(h.getAttribute('x')) })),
		})),
	);
}

/** The lyric lines 2 and 3 taken out of the fixture, written to a temporary file: a one-verse copy of the same song. */
function oneVerseCopy(): string {
	const text = readFileSync(FIXTURE, 'utf8').replace(/<lyric number="[23]">.*?<\/lyric>/g, '');
	const dir = mkdtempSync(path.join(tmpdir(), 'strophic-'));
	const file = path.join(dir, 'strophic-repeat-verse1.musicxml');
	writeFileSync(file, text);
	return file;
}

test.describe('MELODY unfolds a strophic song', () => {
	test.setTimeout(180_000);

	test('each later pass starts mid-system, later passes are inert, and the page has no live hit for them', async ({ page }) => {
		await raise(page);
		const systems = await systemsOf(page);
		// no live handle names a later-pass event, anywhere on the page
		expect(await page.locator('.score-page [data-hit*="~v"], .score-page [data-event-id*="~v"], .score-page [data-of-event*="~v"], .score-page [data-ipa-of*="~v"]').count()).toBe(0);
		expect(await page.locator('.score-page [data-verse-hit]').count()).toBe(48);
		// each pass starts after something else in its own system: mid-system (or as the last bar of one), never at a system's start
		for (const k of [2, 3]) {
			const holder = systems.find((s) => s.vhits.some((h) => h.id.endsWith(`~v${k}`) && h.id.startsWith('m3-0-1')));
			expect(holder, `pass ${k}'s first note`).toBeTruthy();
			const first = holder!.vhits.find((h) => h.id === `m3-0-1~v${k}`)!;
			const leftOf = [...holder!.hits, ...holder!.vhits].filter((h) => h.x < first.x);
			expect(leftOf.length, `something stands left of pass ${k}'s first bar in its system`).toBeGreaterThan(0);
		}
		// a system of later-pass bars only carries data-verse-system and no data-system; a mixed one keeps data-system
		expect(systems.some((s) => s.verse !== null && s.own === null && s.hits.length === 0)).toBe(true);
		expect(systems.some((s) => s.own !== null && s.vhits.length > 0 && s.hits.length > 0)).toBe(true);
		for (const s of systems) expect((s.own === null) !== (s.verse === null)).toBe(true);
	});

	test('pageMetrics: the frame\'s above and below with three verses against the one-verse copy', async ({ page }) => {
		const measure = () =>
			page.evaluate(async () => {
				const { pageMetrics } = await import('/src/lib/score/loupe-ink.ts');
				const container = document.querySelector('.score-page')!.parentElement!;
				return pageMetrics(container);
			});
		await raise(page);
		const three = await measure();
		await raise(page, oneVerseCopy());
		const one = await measure();
		console.log('PAGEMETRICS three verses', JSON.stringify(three), 'one verse', JSON.stringify(one));
		expect(three).not.toBeNull();
		expect(one).not.toBeNull();
		expect(three!.above).toBeCloseTo(one!.above, 1);
		expect(three!.below).toBeCloseTo(one!.below, 1);
	});

	test('the Loupe on a bar after the passage', async ({ page }) => {
		await raise(page);
		const systems = await systemsOf(page);
		const hit = page.locator('.score-page [data-hit="m9-0-1"]').first(); // printed bar 10, the first of the ending
		await hit.scrollIntoViewIfNeeded();
		await hit.click();
		await page.locator('.loupe .loupe-body').waitFor();
		const tag = await page.locator('.loupe').innerText();
		const pageIndex = systems.findIndex((s) => s.hits.some((h) => h.id === 'm9-0-1')) + 1;
		console.log('LOUPE TAG', JSON.stringify(tag.split('\n').find((l) => /system|système/.test(l)) ?? tag.slice(0, 120)), 'page system', pageIndex, 'of', systems.length);
		expect(pageIndex).toBeGreaterThan(0);
	});
});
