/**
 * CAUSE 1c (calm-loupe report §1 item 1c, §4 item 1; row 5 slice 7,
 * 2026-10-15): the head caret of measure k keeps the loupe on k.
 *
 * Before, Left from a measure's first entry onto its head caret re-raised
 * measure k − 1 with different music, because a gap took its anchor's measure
 * and the head gap of k is the tail gap of k − 1. A note entered there is now
 * seated in the measure the loupe shows.
 *
 * The score is the Tchaikovsky voice line (99 measures, 3/8). The loupe is
 * raised on an entry of a measure after the first, so there is a measure
 * before it to flip to.
 */
import { test, expect, type Page } from '@playwright/test';

const FIXTURE = 'src/lib/score/ingestion/fixtures/tchaikovsky-op38-3-voice.musicxml';

async function raise(page: Page) {
	await page.goto('/');
	await page.locator('input.hidden-input').setInputFiles(FIXTURE);
	await page.getByRole('tab', { name: 'Markup' }).click();
	await page.locator('.score-page [data-hit]').first().waitFor({ state: 'attached' });
	// The page redraws the score once its poem is seated; let that settle first.
	await page.waitForTimeout(6_000);
	const hit = page.locator('.score-page [data-hit]').nth(12);
	await hit.scrollIntoViewIfNeeded();
	await hit.click();
	await page.locator('.loupe .loupe-body').waitFor();
	await page.locator('#loupe-mode-corrections').click();
	await page.locator('.loupe [data-loupe-gap]').first().waitFor({ state: 'attached' });
	await page.waitForTimeout(800);
}

const tag = async (page: Page) =>
	((await page.locator('.loupe .loupe-tag').textContent()) ?? '').replace(/\s+/g, ' ').trim().split(' · ')[0];
const readout = async (page: Page) =>
	((await page.locator('.readout').first().textContent()) ?? '').replace(/\s+/g, ' ').trim();

test.describe('the head caret keeps the loupe on its own measure', () => {
	test.setTimeout(120_000);

	test('Left from a measure’s first entry lands on its head caret and the tag does not change', async ({ page }) => {
		await raise(page);
		const start = await tag(page);
		const seen: { tag: string; ro: string }[] = [];
		for (let i = 0; i < 8; i++) {
			await page.keyboard.press('ArrowLeft');
			await page.waitForTimeout(500);
			seen.push({ tag: await tag(page), ro: await readout(page) });
		}
		const changed = seen.findIndex((s) => s.tag !== start);
		expect(changed, JSON.stringify(seen)).toBeGreaterThan(0);
		// The press that first changes the tag lands on an ENTRY (the previous
		// measure's last note), never on a gap: the gap before it still names
		// the measure the singer was in.
		expect(seen[changed].ro, JSON.stringify(seen)).not.toMatch(/^(after|before) /);
		expect(seen[changed - 1].ro, JSON.stringify(seen)).toMatch(/^after /);
		expect(seen[changed - 1].tag).toBe(start);
	});

	test('a note entered at the head caret is the first of that measure, and the loupe stays', async ({ page }) => {
		await raise(page);
		const start = await tag(page);
		await page.locator('.loupe [data-loupe-gap]').first().click();
		await page.waitForTimeout(500);
		expect(await readout(page)).toMatch(/^after /);
		expect(await tag(page)).toBe(start);
		await page.keyboard.press('5'); // a quarter
		await page.waitForTimeout(800);
		expect(await tag(page), 'the loupe stays on the measure it entered into').toBe(start);
		expect(await readout(page)).toMatch(/Quarter/);
		// The gap before the new note is still the head caret of the same measure.
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(500);
		expect(await readout(page)).toMatch(/^after /);
		expect(await tag(page)).toBe(start);
	});
});
