import { test, expect, type Page } from '@playwright/test';
import { waitForDictionary } from '../e2e/helpers';

const OUT = process.env.N174_OUT ?? '/home/claude/n174-baseline/shots';
const FIXTURE = '/home/claude/n174-baseline/fixture.musicxml';

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
	test(`baseline ${lang}`, async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.goto('/');
		await waitForDictionary(page);
		if (lang === 'fr') {
			await page.locator('.lang-pill').click();
			await expect(page.locator('.lang-pill')).toHaveAttribute('lang', 'en');
		}
		await page.locator('input.hidden-input').setInputFiles(FIXTURE);
		await page.waitForSelector('[data-word-index="0-0"]', { timeout: 15_000 });
		await shot(page, `${lang}-1-text`);
		await page.getByRole('tab', { name: lang === 'en' ? 'Markup' : /./ }).first();
		const tabs = page.getByRole('tab');
		const names = await tabs.allInnerTexts();
		console.log(`[n174] ${lang} tabs: ${JSON.stringify(names)}`);
		await tabs.nth(1).click();
		await shot(page, `${lang}-2-markup`);
		await tabs.nth(2).click();
		await shot(page, `${lang}-3-insights`);
		const learn = page.getByRole('button', { name: lang === 'en' ? 'Learn' : 'Leçons', exact: true });
		await learn.click();
		await shot(page, `${lang}-4-learn`);
		await page.getByRole('button', { name: 'Guide', exact: true }).click();
		await shot(page, `${lang}-5-guide`);
	});
}
