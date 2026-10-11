// Row 57 r6 run 3: drop a song into the intake on the dev build, open Markup, and photograph given bars.
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path';
const require = createRequire(path.resolve(process.env.HOME, 'Desktop/ilya-rewrite/apps/web/package.json'));
const { chromium } = require('@playwright/test');
const [pdf, out] = process.argv.slice(2);
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-webgpu'] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
const logs = []; page.on('console', (m) => logs.push(m.text()));
await page.goto('http://localhost:5173/');
await page.waitForSelector('input[type="file"].hidden-input', { state: 'attached', timeout: 120000 });
await page.locator('input[type="file"].hidden-input').setInputFiles(pdf);
await page.locator('.receipt-score').waitFor({ timeout: 900000 });
await page.waitForTimeout(6000);
await page.screenshot({ path: out + '-studio.png' });
fs.writeFileSync(out + '-logs.txt', logs.join('\n'));
await page.getByRole('button', { name: 'Markup', exact: true }).or(page.getByRole('tab', { name: 'Markup', exact: true })).first().click();
await page.waitForTimeout(10000);
const bars = await page.evaluate(() => [...document.querySelectorAll('[data-bar-number]')].map((e) => { const r = e.getBoundingClientRect(); return [e.textContent.trim(), Math.round(r.x), Math.round(r.y + window.scrollY)]; }));
console.log(JSON.stringify(bars));
fs.writeFileSync(out + '-bars.json', JSON.stringify(bars));
const want = (process.env.BARS || '').split(',').filter(Boolean);
for (const b of want) {
	const el = page.locator(`[data-bar-number]`, { hasText: new RegExp(`^${b}$`) }).first();
	if (await el.count()) { await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(1500); }
}
await page.screenshot({ path: out + '-markup.png' });
await page.screenshot({ path: out + '-markup-full.png', fullPage: true });
await browser.close();
