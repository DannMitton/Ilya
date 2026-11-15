/**
 * N.201 step 3 (desktop): REPERTOIRE opens on arrival at two or more songs, and
 * folds on a pick (the open song included), on New song, and by its own
 * chevron. Rename and Delete show on the song in hand only.
 *
 * The expectations are the brief's (`brief-code-n201-drawer-order_r2`, step 3).
 */
import { test, expect, type Page } from '@playwright/test';
import { waitForDictionary, transcribe } from './helpers';

const band = (page: Page, name: string) => page.getByRole('button', { name: new RegExp(`^${name}$`, 'i') });

test('REPERTOIRE opens on arrival at two songs, folds on each of its three events', async ({ page }) => {
	await page.goto('/');
	await waitForDictionary(page);
	// One song: the stored set stands, so REPERTOIRE is shut on a reload.
	await transcribe(page, 'молоко');
	await page.waitForTimeout(2_000);
	await page.reload();
	await waitForDictionary(page);
	await expect(band(page, 'Repertoire')).toHaveAttribute('aria-expanded', 'false');

	// New song: folds REPERTOIRE and opens INPUT.
	await band(page, 'Repertoire').click();
	await page.locator('.new-btn').click();
	await expect(band(page, 'Repertoire')).toHaveAttribute('aria-expanded', 'false');
	await expect(band(page, 'Input')).toHaveAttribute('aria-expanded', 'true');
	await page.waitForTimeout(500);
	await transcribe(page, 'вода');
	await page.waitForTimeout(2_000);

	// Two songs: a desk opens REPERTOIRE on arrival.
	await page.reload();
	await waitForDictionary(page);
	await expect(band(page, 'Repertoire')).toHaveAttribute('aria-expanded', 'true');
	await expect(page.locator('.song-open')).toHaveCount(2);
	// Rename and Delete on the open row only.
	await expect(page.getByRole('button', { name: 'Rename' })).toHaveCount(1);
	await expect(page.getByRole('button', { name: 'Delete' })).toHaveCount(1);

	// Picking the song that is already open folds it.
	await page.locator('.song-open[aria-current="true"]').click();
	await expect(band(page, 'Repertoire')).toHaveAttribute('aria-expanded', 'false');

	// Picking another song folds it and opens that song.
	await band(page, 'Repertoire').click();
	await page.locator('.song-open:not([aria-current="true"])').click();
	await expect(band(page, 'Repertoire')).toHaveAttribute('aria-expanded', 'false');
	await expect(page.locator('textarea.text-input')).toHaveValue('молоко');

	// Its own chevron opens and shuts it, and nothing else shuts it.
	await band(page, 'Repertoire').click();
	await expect(band(page, 'Repertoire')).toHaveAttribute('aria-expanded', 'true');
	await band(page, 'Piece').click();
	await expect(band(page, 'Repertoire')).toHaveAttribute('aria-expanded', 'true');
	await band(page, 'Repertoire').click();
	await expect(band(page, 'Repertoire')).toHaveAttribute('aria-expanded', 'false');
});
