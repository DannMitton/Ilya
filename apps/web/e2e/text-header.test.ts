import { test, expect, type Page } from '@playwright/test';
import { waitForDictionary } from './helpers';

/*
 * THE HEADER NAMES THE TEXT THE PAGE PRINTS (poem library build 1, step 7, part 2; Dann 2026-11-03 20:17 to 20:19: "they
 * must correspond"; strings ratified 20:21). The states are Fable's table (review r1, amendment 9), reached through the
 * real controls: what is in Lyrics, what is in Poem, and which view INPUT's pill is on (row 172: the pair on TEXT is gone, and TEXT follows the pill). Checking nothing here has changed about the header: if a state goes red, the header or the pill's route to TEXT moved. Each is read in English and French,
 * on screen and under `emulateMedia('print')`, on page 1's mark and on page 2's running head (the header prints).
 */
test.use({ viewport: { width: 1440, height: 1300 } });

const NB = ' ';
const LONG = Array.from({ length: 30 }, (_, i) => `слово первое второе третье ${i}`).join('\n');
const OTHER = Array.from({ length: 30 }, (_, i) => `иное стихотворение строка ${i}`).join('\n');

async function open(page: Page, language: 'en' | 'fr'): Promise<void> {
	await page.addInitScript((l) => localStorage.setItem('ilya:language', l), language);
	await page.goto('/');
	await waitForDictionary(page);
}
const field = (page: Page) => page.locator('textarea.text-input');
async function put(page: Page, view: 'lyrics' | 'poem', text: string): Promise<void> {
	await page.locator(`#intake-tab-${view}`).click();
	await field(page).focus();
	await page.keyboard.insertText(text);
}
async function showText(page: Page): Promise<void> {
	await page.waitForTimeout(3000);
	await page.evaluate(() => (document.querySelector('#tab-text') as HTMLElement | null)?.click());
	await page.waitForTimeout(5000);
}
/** The tab names the pages carry: page 1's mark, and the running head of every later page. */
async function heads(page: Page): Promise<{ mark: string; running: string[] }> {
	const mark = (await page.locator('.paper-page:visible .tab-mark').first().innerText()).trim();
	const running = (await page.locator('.paper-page:visible .running-header .header-tab').allInnerTexts()).map((s) => s.trim());
	return { mark, running };
}

const STATES = [
	{ name: 'Lyrics only', en: 'TEXT: LYRICS', fr: `TEXTE${NB}: PAROLES`, setup: async (p: Page) => put(p, 'lyrics', LONG) },
	{ name: 'Poem only, INPUT on LYRICS', en: 'TEXT: POEM', fr: `TEXTE${NB}: POÈME`, setup: async (p: Page) => { await put(p, 'poem', LONG); await p.locator('#intake-tab-lyrics').click(); } },
	{ name: 'both and the same: no pair', en: 'TEXT: LYRICS', fr: `TEXTE${NB}: PAROLES`, setup: async (p: Page) => { await put(p, 'lyrics', LONG); await put(p, 'poem', LONG); }, noPair: true },
	{ name: 'both, different, INPUT on LYRICS', en: 'TEXT: LYRICS', fr: `TEXTE${NB}: PAROLES`, setup: async (p: Page) => { await put(p, 'lyrics', LONG); await put(p, 'poem', OTHER); await p.locator('#intake-tab-lyrics').click(); } },
	{ name: 'both, different, INPUT on POEM', en: 'TEXT: POEM', fr: `TEXTE${NB}: POÈME`, setup: async (p: Page) => { await put(p, 'lyrics', LONG); await put(p, 'poem', OTHER); }, pairOnPoem: true },
	{ name: 'a POEM view with an empty POEM', en: 'TEXT: LYRICS', fr: `TEXTE${NB}: PAROLES`, setup: async (p: Page) => { await put(p, 'lyrics', LONG); await p.locator('#intake-tab-poem').click(); } },
] as const;

for (const language of ['en', 'fr'] as const) {
	for (const state of STATES) {
		test(`${state.name}: ${language === 'en' ? state.en : state.fr}, on page 1 and page 2, on screen and in print`, async ({ page }) => {
			test.setTimeout(120_000);
			await open(page, language);
			await state.setup(page);
			await showText(page);
			if ('pairOnPoem' in state && state.pairOnPoem) {
				await page.locator('#intake-tab-poem').click();
				await page.waitForTimeout(4000);
			}
			if ('noPair' in state && state.noPair) await expect(page.locator('#text-source')).toHaveCount(0);
			const want = language === 'en' ? state.en : state.fr;
			for (const media of ['screen', 'print'] as const) {
				await page.emulateMedia({ media });
				await page.waitForTimeout(500);
				const h = await heads(page);
				expect(h.mark, `${media}, page 1`).toBe(want);
				expect(h.running.length, `${media}: the song needs a second page`).toBeGreaterThan(0);
				for (const r of h.running) expect(r, `${media}, running head`).toBe(want);
			}
		});
	}

	test(`nothing entered: the bare tab name, ${language}`, async ({ page }) => {
		await open(page, language);
		await page.evaluate(() => (document.querySelector('#tab-text') as HTMLElement | null)?.click());
		await page.waitForTimeout(2500);
		const h = await heads(page);
		expect(h.mark).toBe(language === 'en' ? 'TEXT' : 'TEXTE');
	});
}
