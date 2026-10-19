/**
 * QUEUE row 108, Part C, test j. Tchaikovsky op. 38 no. 3 dropped onto an
 * empty song: its old spelling seats on arrival (172 seats), the music's rest
 * after «такъ» ends a phrase, and Text shows «так» as [ˈtɑk] where a line break
 * would have read [ˈtɑɡ]. Run: `playwright test --project=phone phrase-ends`.
 */
import { test, expect, type Page } from '@playwright/test';

const FIXTURE = 'src/lib/score/ingestion/fixtures/tchaikovsky-op38-3-voice.musicxml';

async function seats(page: Page): Promise<Record<string, { kind: string; ipa?: string; origin?: { word?: string } }>> {
	return page.evaluate(async () => {
		const db = await new Promise<IDBDatabase>((res) => {
			const q = indexedDB.open('ilya-library');
			q.onsuccess = () => res(q.result);
		});
		const all = await new Promise<{ pairings?: Record<string, never> }[]>((res) => {
			const q = db.transaction('songs').objectStore('songs').getAll();
			q.onsuccess = () => res(q.result);
		});
		db.close();
		return (all[0]?.pairings ?? {}) as never;
	});
}

test('Tchaikovsky onto an empty song: 172 seats, and «так» reads [ˈtɑk] in Text', async ({ page }) => {
	test.setTimeout(240_000);
	await page.goto('/');
	await page.waitForFunction(() => {
		const t = document.querySelector<HTMLTextAreaElement>('textarea.text-input');
		return t && !t.disabled;
	}, undefined, { timeout: 60_000 });
	await page.getByRole('button', { name: /drawer/i }).first().tap();
	await page.locator('input.hidden-input').setInputFiles(FIXTURE);
	await expect.poll(async () => Object.values(await seats(page)).filter((p) => p.kind === 'syllable').length, { timeout: 120_000 }).toBe(172);
	await page.waitForTimeout(3000);
	// Text and the reading aid both draw the word; the first is Text's
	await expect(page.locator('[data-word-index="0-77"]').first()).toHaveAttribute('aria-label', 'так: ˈtɑk');
	// The stored seat keeps the IPA it was made with; Markup draws the live slot's (`drawPairings`), which is what Text shows.
	const tak = Object.values(await seats(page)).filter((p) => p.kind === 'syllable' && p.origin?.word === 'так');
	console.log('stored seat IPA for «так»:', JSON.stringify(tak.map((p) => p.ipa)));
	expect(tak).toHaveLength(2); // the two «так» of the song
});
