import { raise } from './raise.mjs';
const { browser, page } = await raise({ width: 390, height: 844, phone: true });
const box = async (sel) => JSON.stringify(await page.locator(sel).first().boundingBox());
const state = async (name) => {
	await page.waitForTimeout(700);
	console.log(name, 'loupe', await box('.loupe'), 'header', await box('.loupe-header'), 'bar', await box('.loupe-bar'), 'panel', await box('.loupe-panel'), '| label:', await page.locator('.loupe-move').getAttribute('aria-label'));
	await page.screenshot({ path: `step3-phone-390-${name}.png` });
};
// make Undo and Redo both show
await page.locator('#loupe-mode-corrections').click();
await page.waitForTimeout(500);
await page.keyboard.press('.');
await page.waitForTimeout(400);
await page.locator('.loupe-header').getByRole('button', { name: /^Undo/ }).tap();
await page.waitForTimeout(400);
const tog = page.locator('.loupe-syl-toggle');
if ((await tog.getAttribute('aria-expanded')) === 'true') await tog.tap();
await state('seat-shut');
console.log('header buttons', JSON.stringify(await page.locator('.loupe-header button').evaluateAll((els) => els.map((e) => [e.textContent.trim(), Math.round(e.getBoundingClientRect().width), Math.round(e.getBoundingClientRect().height)]))));
await page.locator('.loupe-move').tap();
await state('bottom-shut');
await tog.tap();
await state('bottom-open');
await page.locator('.loupe-move').tap();
await state('top-open');
await tog.tap();
await state('top-shut');
await browser.close();
