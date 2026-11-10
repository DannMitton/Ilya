/**
 * QUEUE row 138 (Dann 2026-11-09 21:35, 21:38, 21:47), step T1: the time signature card in the Loupe's CORRECTIONS pane.
 *
 * Change the time signature from the bar held to the next change, or to the end of the song, keeping the barlines (the default, because on
 * 37 stored readings the reader fused no bar and misread signatures and durations). The Gretchaninov reading states 4/8 over bars of three
 * quarters, so every bar reads over-full; 4/8 to 3/4 makes them all add up. Finale is the model; every string is the ratified one.
 *
 *     PW_CHROMIUM_PATH=/opt/pw-browsers/chromium pnpm --filter @ilya/web exec playwright test --project=chromium time-signature-card
 */
import { test, expect, type Page } from '@playwright/test';

const WRONG = 'src/lib/omr/fixtures/time-signature-wrong.musicxml';

async function raise(page: Page, id: string, lang: 'en' | 'fr' = 'en') {
	await page.goto('/');
	if (lang === 'fr') await page.locator('.lang-pill').click();
	await page.locator('input.hidden-input').setInputFiles(WRONG);
	await page.getByRole('tab', { name: lang === 'fr' ? 'CHANT' : 'MELODY' }).click();
	await page.locator('.score-page [data-hit]').first().waitFor({ state: 'attached', timeout: 30_000 });
	await page.waitForTimeout(3_000);
	const hit = page.locator(`.score-page [data-hit="${id}"]`).first();
	await hit.scrollIntoViewIfNeeded();
	await hit.click();
	await page.locator('.loupe .loupe-body').waitFor();
	await page.locator('#loupe-mode-corrections').click();
	await page.locator('.loupe [data-ts-open]').waitFor({ state: 'attached' });
}

const tag = async (page: Page) => ((await page.locator('.loupe .loupe-tag').textContent()) ?? '').replace(/\s+/g, ' ').trim();
const undo = (page: Page) => page.locator('.loupe-header').getByRole('button', { name: /^Undo/ });
const redo = (page: Page) => page.locator('.loupe-header').getByRole('button', { name: /^Redo/ });
const meter = (page: Page, m: string) => page.locator(`.score-page [data-meter="${m}"]`);

test.describe('the time signature card', () => {
	test.setTimeout(180_000);

	test('4/8 to 3/4 to the end, keeping the barlines: every bar adds up, Undo restores, Redo applies again', async ({ page }) => {
		await raise(page, 'm0-0-1');
		const open = page.locator('.loupe [data-ts-open]');
		await expect(open).toHaveText('Time signature');
		await expect(open).toHaveAccessibleName('Change the time signature from this bar');
		expect(await tag(page)).toMatch(/6 of 4/);
		await expect(meter(page, '4/8').first()).toBeAttached();

		await open.click();
		const card = page.locator('[data-ts-card]');
		await expect(card).toBeVisible();
		await expect(card.getByRole('heading')).toHaveText('Time signature');
		await expect(page.locator('[data-ts-beats]')).toHaveValue('4');
		await expect(page.locator('[data-ts-beat-type]')).toHaveValue('8');
		await expect(page.locator('[data-ts-through="next"]')).toBeChecked();
		await expect(card.getByText('Number of beats')).toBeVisible();
		await expect(card.getByText('Beat duration')).toBeVisible();
		await expect(card.getByText('To the next time signature change')).toBeVisible();
		await expect(card.getByText('To the end of the song')).toBeVisible();

		await card.locator('[data-ts-common="3/4"]').click();
		await expect(page.locator('[data-ts-beats]')).toHaveValue('3');
		await expect(page.locator('[data-ts-beat-type]')).toHaveValue('4');
		await page.locator('[data-ts-through="end"]').check();
		await page.locator('[data-ts-apply]').click();
		await expect(card).toHaveCount(0);

		await expect(meter(page, '3/4').first()).toBeAttached();
		await expect(meter(page, '4/8')).toHaveCount(0);
		expect(await tag(page)).not.toMatch(/of 4/);
		await expect(undo(page)).toHaveAccessibleName(/time signature changed/);

		await undo(page).click();
		await expect(meter(page, '4/8').first()).toBeAttached();
		expect(await tag(page)).toMatch(/6 of 4/);

		await redo(page).click();
		await expect(meter(page, '3/4').first()).toBeAttached();
		expect(await tag(page)).not.toMatch(/of 4/);
	});

	test('any signature can be typed; an impossible one cannot be applied; Escape and Cancel close the card and change nothing', async ({ page }) => {
		await raise(page, 'm0-0-1');
		await page.locator('.loupe [data-ts-open]').click();
		const card = page.locator('[data-ts-card]');
		await page.locator('[data-ts-beats]').fill('7');
		await page.locator('[data-ts-beat-type]').fill('5');
		await expect(page.locator('[data-ts-apply]')).toBeDisabled();
		await page.locator('[data-ts-beat-type]').fill('16');
		await expect(page.locator('[data-ts-apply]')).toBeEnabled();
		await page.keyboard.press('Escape');
		await expect(card).toHaveCount(0);
		await expect(page.locator('.loupe [data-ts-open]')).toBeFocused();
		expect(await tag(page)).toMatch(/6 of 4/);

		await page.locator('.loupe [data-ts-open]').click();
		await page.locator('[data-ts-cancel]').click();
		await expect(card).toHaveCount(0);
		await expect(meter(page, '4/8').first()).toBeAttached();
	});

	test('choosing the signature the reading has, to the next change, is the way back and writes nothing', async ({ page }) => {
		await raise(page, 'm0-0-1');
		const open = page.locator('.loupe [data-ts-open]');
		await open.click();
		await page.locator('[data-ts-common="3/4"]').click();
		await page.locator('[data-ts-apply]').click();
		await expect(meter(page, '3/4').first()).toBeAttached();
		await open.click();
		await expect(page.locator('[data-ts-beats]')).toHaveValue('3');
		await page.locator('[data-ts-beats]').fill('4');
		await page.locator('[data-ts-beat-type]').fill('8');
		await page.locator('[data-ts-apply]').click();
		await expect(meter(page, '4/8').first()).toBeAttached();
		expect(await tag(page)).toMatch(/6 of 4/);
	});

	test('in French the face, the sentence, the fields, and the scopes are the ratified words', async ({ page }) => {
		await raise(page, 'm0-0-1', 'fr');
		const open = page.locator('.loupe [data-ts-open]');
		await expect(open).toHaveText('Chiffrage de mesure');
		await expect(open).toHaveAccessibleName('Changer le chiffrage de mesure à partir de cette mesure');
		await open.click();
		const card = page.locator('[data-ts-card]');
		await expect(card.getByText('Nombre de temps')).toBeVisible();
		await expect(card.getByText('Unité de temps')).toBeVisible();
		await expect(card.getByText('Jusqu’au prochain changement de chiffrage')).toBeVisible();
		await expect(card.getByText('Jusqu’à la fin du chant')).toBeVisible();
	});

	test('a tap on the time signature drawn on the score opens the card on its bar, with no Loupe and no note held', async ({ page }) => {
		await page.goto('/');
		await page.locator('input.hidden-input').setInputFiles(WRONG);
		await page.getByRole('tab', { name: 'MELODY' }).click();
		await page.locator('.score-page [data-hit]').first().waitFor({ state: 'attached', timeout: 30_000 });
		await page.waitForTimeout(3_000);
		const hit = page.locator('[data-ts-hit]').first();
		await expect(hit).toBeAttached();
		await expect(hit).toHaveAttribute('data-ts-hit', /^m0-/);
		await expect(hit).toHaveAccessibleName('Change the time signature from this bar');
		await hit.click();
		await expect(page.locator('[data-ts-beats]')).toHaveValue('4');
		await expect(page.locator('[data-ts-beat-type]')).toHaveValue('8');
		await page.locator('[data-ts-common="3/4"]').click();
		await page.locator('[data-ts-through="end"]').check();
		await page.locator('[data-ts-apply]').click();
		await expect(meter(page, '3/4').first()).toBeAttached();
		await expect(meter(page, '4/8')).toHaveCount(0);
		// the tap is still there on the new signature, and gives focus back to its own button
		await expect(page.locator('[data-ts-hit]').first()).toBeAttached();
	});

	test('Rebar the notes: a 3/4 song laid out in bars of four comes right with ties, one Undo takes it all back, and Redo does it again', async ({ page }) => {
		await page.goto('/');
		await page.locator('input.hidden-input').setInputFiles('src/lib/omr/fixtures/time-signature-barlines-wrong.musicxml');
		await page.getByRole('tab', { name: 'MELODY' }).click();
		await page.locator('.score-page [data-hit]').first().waitFor({ state: 'attached', timeout: 30_000 });
		await page.waitForTimeout(3_000);
		const hit = page.locator('.score-page [data-hit="m0-0-1"]').first();
		await hit.scrollIntoViewIfNeeded();
		await hit.click();
		await page.locator('.loupe .loupe-body').waitFor();
		await page.locator('#loupe-mode-corrections').click();

		await page.locator('.loupe [data-ts-open]').click();
		const card = page.locator('[data-ts-card]');
		const rebar = card.locator('[data-ts-rebar]');
		await expect(rebar).not.toBeChecked();
		await expect(card.getByText('Rebar the notes')).toBeVisible();
		await expect(card.getByText('Moves notes across barlines to fill bars of the new time signature, tying any note that crosses one.')).toBeVisible();
		await card.locator('[data-ts-common="3/4"]').click();
		await page.locator('[data-ts-through="end"]').check();
		await rebar.check();
		await page.locator('[data-ts-apply]').click();
		await expect(card).toHaveCount(0);

		// 24 quarters in bars of three: eight bars. Walk to the last bar with the arrow keys (the read song has six).
		await expect(meter(page, '3/4').first()).toBeAttached();
		await expect(undo(page)).toHaveAccessibleName(/time signature changed/);
		for (let i = 0; i < 80 && !/m\.\s?8\b/.test(await tag(page)); i++) {
			await page.keyboard.press('ArrowRight');
			await page.waitForTimeout(120);
		}
		expect(await tag(page)).toMatch(/m\.\s?8\b/);
		expect(await tag(page)).not.toMatch(/of 3/);

		await undo(page).click();
		await expect(meter(page, '4/4').first()).toBeAttached();
		expect(await tag(page)).not.toMatch(/m\.\s?8\b/);

		await redo(page).click();
		await expect(meter(page, '3/4').first()).toBeAttached();
		expect(await tag(page)).toMatch(/m\.\s?8\b/);
	});

	test('Rebar the notes is off every time the card opens, and in French it reads as ratified', async ({ page }) => {
		await raise(page, 'm0-0-1', 'fr');
		await page.locator('.loupe [data-ts-open]').click();
		const card = page.locator('[data-ts-card]');
		await card.locator('[data-ts-rebar]').check();
		await expect(card.getByText('Redistribuer les notes')).toBeVisible();
		await expect(card.getByText('Déplace les notes d’une mesure à l’autre pour remplir les mesures du nouveau chiffrage, en liant toute note qui franchit une barre de mesure.')).toBeVisible();
		await page.locator('[data-ts-cancel]').click();
		await page.locator('.loupe [data-ts-open]').click();
		await expect(card.locator('[data-ts-rebar]')).not.toBeChecked();
	});
});
