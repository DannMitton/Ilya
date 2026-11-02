import { raise } from './raise.mjs';
for (const [name, opts] of [['desktop-1400', { width: 1400, height: 900 }], ['phone-390', { width: 390, height: 844, phone: true }]]) {
	const { browser, page, tag } = await raise(opts);
	console.log(name, tag);
	await page.screenshot({ path: `before-${name}.png` });
	const box = await page.locator('.loupe').boundingBox();
	const bar = await page.locator('.loupe-bar').boundingBox();
	console.log(name, 'loupe', JSON.stringify(box), 'bar', JSON.stringify(bar));
	await browser.close();
}
