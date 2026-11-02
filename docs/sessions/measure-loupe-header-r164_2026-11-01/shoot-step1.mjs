import { raise } from './raise.mjs';
const tag = process.argv[2] ?? 'step1';
for (const [name, opts] of [['desktop-1400', { width: 1400, height: 900 }], ['phone-390', { width: 390, height: 844, phone: true }]]) {
	const { browser, page } = await raise(opts);
	// Corrections mode takes the music keys; a dot fills the Undo stack. Then the panel is shut for the first shot.
	await page.locator('#loupe-mode-corrections').click();
	await page.waitForTimeout(500);
	await page.locator('.score-page').first().evaluate(() => document.activeElement?.blur?.());
	await page.keyboard.press('.');
	await page.waitForTimeout(800);
	const tog = page.locator('.loupe-syl-toggle');
	if ((await tog.getAttribute('aria-expanded')) === 'true') await tog.click();
	await page.waitForTimeout(700);
	await page.screenshot({ path: `${tag}-${name}-shut.png` });
	const m = async (sel) => JSON.stringify(await page.locator(sel).first().boundingBox());
	console.log(name, 'loupe', await m('.loupe'), 'header', await m('.loupe-header'), 'bar', await m('.loupe-bar'));
	console.log(name, 'buttons', JSON.stringify(await page.locator('.loupe-header-button').evaluateAll((els) => els.map((e) => [e.textContent.trim(), Math.round(e.getBoundingClientRect().width), Math.round(e.getBoundingClientRect().height)]))));
	await page.locator('.loupe-syl-toggle').click();
	await page.waitForTimeout(900);
	await page.screenshot({ path: `${tag}-${name}-open.png` });
	console.log(name, 'open loupe', await m('.loupe'), 'panel', await m('.loupe-panel'));
	await browser.close();
}
