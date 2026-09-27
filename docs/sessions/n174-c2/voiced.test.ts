import { test, expect, type Page } from '@playwright/test';
import { waitForDictionary } from '../e2e/helpers';

/* A DESK-BUILT TEST VOICE, not a singer's. Shapes follow
   analyze-score-adapter.test.ts (formant(), COMPLETE); the f1 values are
   plain test data. Its only job is to make the calibrated Markup and
   Insights render the same way before and after each N.174 slice. */
const OUT = process.env.N174_OUT ?? '/home/claude/n174-baseline/shots';
const FIXTURE = '/home/claude/n174-baseline/fixture.musicxml';
const P = (step: string, octave: number, alter = 0) => ({ step, octave, alter });
const F1: Record<string, number> = { i: 280, e: 400, 'ɪ': 360, 'ɨ': 320, 'ɛ': 500, a: 700, 'ɑ': 680, 'ʌ': 560, o: 450, u: 300 };
const formants = Object.fromEntries(Object.entries(F1).map(([v, f1]) => [v, { f1, confidence: 'high', reading: 'captured', source: 'measured-user' }]));
const STORE = {
	version: 2,
	activeId: 'n174-test-voice',
	voices: [{
		id: 'n174-test-voice', name: 'Test voice', createdAt: '2026-09-27T00:00:00.000Z', updatedAt: '2026-09-27T00:00:00.000Z',
		formants,
		characteristics: { source: 'manual', rangeLow: P('E', 3), rangeHigh: P('A', 4), tessituraLow: P('G', 3), tessituraHigh: P('D', 4), passaggioPrimary: P('G', 3), passaggioSecondary: P('B', 3) },
	}],
};

async function settle(page: Page) {
	await page.addStyleTag({ content: '*::-webkit-scrollbar{display:none!important} *{scrollbar-width:none!important}' });
	await page.evaluate(() => document.fonts.ready);
	await page.waitForLoadState('networkidle').catch(() => {});
	await page.waitForTimeout(800);
}
async function scrollTo(page: Page, frac: number) {
	return page.evaluate((f) => {
		const els = [document.scrollingElement!, ...document.querySelectorAll('*')] as HTMLElement[];
		const sc = els.filter((e) => e && e.scrollHeight > e.clientHeight + 4 && getComputedStyle(e).overflowY !== 'visible' && getComputedStyle(e).overflowY !== 'hidden')
			.sort((a, b) => b.clientWidth * b.clientHeight - a.clientWidth * a.clientHeight)[0];
		if (!sc) return 0;
		sc.scrollTop = Math.round((sc.scrollHeight - sc.clientHeight) * f);
		return sc.scrollHeight - sc.clientHeight;
	}, frac);
}
async function shot(page: Page, name: string) {
	for (const [tag, f] of [['a-top', 0], ['b-mid', 0.5], ['c-end', 1]] as const) {
		const range = await scrollTo(page, f);
		if (f > 0 && range === 0) break;
		await settle(page);
		await page.screenshot({ path: `${OUT}/${test.info().project.name}-${name}-${tag}.png`, animations: 'disabled', caret: 'hide' });
	}
	await scrollTo(page, 0);
}

for (const lang of ['en', 'fr'] as const) {
	test(`voiced ${lang}`, async ({ page }) => {
		await page.addInitScript((s) => { if (!sessionStorage.getItem('n174-seeded')) { localStorage.setItem('shane.profiles.v2', s); sessionStorage.setItem('n174-seeded', '1'); } }, JSON.stringify(STORE));
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.goto('/');
		await waitForDictionary(page);
		if (lang === 'fr') {
			await page.locator('.lang-pill').click();
			await expect(page.locator('.lang-pill')).toHaveAttribute('lang', 'en');
		}
		await page.locator('input.hidden-input').setInputFiles(FIXTURE);
		await page.waitForSelector('[data-word-index="0-0"]', { timeout: 15_000 });
		const tabs = page.getByRole('tab');
		await tabs.nth(1).click();
		await shot(page, `${lang}-6-voiced-markup`);
		await tabs.nth(2).click();
		await shot(page, `${lang}-7-voiced-insights`);
	});
}
