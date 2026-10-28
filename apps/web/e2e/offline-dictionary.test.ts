import { test, expect } from '@playwright/test';
import { waitForDictionary, transcribe } from './helpers';

/*
 * N.195. A browser that has opened Ilya online before, and then cannot reach
 * `/data/*`, still starts the stored dictionary and Text transcribes. The
 * repository's set-up serves `localhost`, where `app.html` registers no service
 * worker, so this is the no-worker case: the document loads, and every request
 * under `/data/` is refused at the browser, as an absent network refuses it.
 * The worker case is measured on a built copy served from a non-localhost
 * host (the report); it cannot run here.
 */
test('the stored dictionary starts when /data/ cannot be fetched', async ({ page, context }) => {
	await page.goto('/');
	await waitForDictionary(page);
	await transcribe(page, 'Я помню чудное мгновенье');
	// The manifest is stored only once every chunk is; give the writes time to land.
	await expect
		.poll(
			() =>
				page.evaluate(
					() =>
						new Promise<boolean>((resolve) => {
							const open = indexedDB.open('ilya-data', 1);
							open.onsuccess = () => {
								const g = open.result.transaction('cache').objectStore('cache').get('ilya-dict-manifest');
								g.onsuccess = () => resolve(!!g.result);
								g.onerror = () => resolve(false);
							};
							open.onerror = () => resolve(false);
						}),
				),
			{ timeout: 60_000, intervals: [500] },
		)
		.toBe(true);
	await page.waitForTimeout(1_000);

	await page.close();
	await context.route('**/data/**', (route) => route.abort('internetdisconnected'));
	const offline = await context.newPage();
	await offline.goto('/');
	await expect(offline.locator('textarea.text-input')).toBeEnabled({ timeout: 45_000 });
	await transcribe(offline, 'Я помню чудное мгновенье');
});
