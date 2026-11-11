// Playwright look at LEARN unit 1's Glyph Table (brief r2, step 5). Run from apps/web:
//   node docs/sessions/learn-cursive_2026-11-10/look.mjs   (dev server on :5173; run from the repository root)
import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = dirname(fileURLToPath(import.meta.url));
const { chromium } = createRequire(new URL('../../../apps/web/package.json', import.meta.url))('@playwright/test');
const sizes = { desk: { width: 1440, height: 900 }, phone: { width: 390, height: 844 } };
const learn = { en: 'LEARN', fr: 'LEÇONS' };
const browser = await chromium.launch(process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {});
let failed = 0;
for (const [sizeName, viewport] of Object.entries(sizes)) {
	const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2, ...(sizeName === 'phone' ? { hasTouch: true, isMobile: true } : {}) });
	const page = await ctx.newPage();
	await page.goto('http://localhost:5173/');
	await page.locator('textarea.text-input').waitFor({ state: 'attached', timeout: 60000 }).catch(() => {});
	await page.waitForTimeout(3000);
	for (const lang of ['en', 'fr']) {
		const label = learn[lang];
		let btn = page.getByRole('button', { name: label, exact: true }).first();
		if (!(await btn.count())) {
			await page.locator('.lang-pill').first().click();
			btn = page.getByRole('button', { name: label, exact: true }).first();
		}
		await btn.click({ timeout: 15000 }).catch(async (e) => { console.log('click failed:', e.message.split('\n').slice(0, 6).join(' | ')); console.log(await page.evaluate(() => [...document.querySelectorAll('button')].map((b) => b.textContent.trim().slice(0, 20) + (b.offsetParent ? '' : ' (hidden)')).join(', '))); throw e; });
		await page.waitForSelector('.gt-table');
		await page.waitForTimeout(500);
		const rows = await page.evaluate(() => {
			const bad = [];
			const svgs = [...document.querySelectorAll('.gt-cursive svg')];
			for (const s of svgs) {
				const r = s.getBoundingClientRect();
				if (Math.abs(r.height - 40) > 0.01 || r.width > 48.01) bad.push(`${s.getAttribute('aria-label')} ${r.width.toFixed(2)}x${r.height.toFixed(2)}`);
			}
			return { count: svgs.length, bad, rows: document.querySelectorAll('.gt-table tbody tr').length };
		});
		console.log(`${sizeName} ${lang}: ${rows.count} cursive svgs, ${rows.rows} rows, ${rows.bad.length} outside 40 high / 48 wide${rows.bad.length ? ': ' + rows.bad.join('; ') : ''}`);
		if (rows.bad.length) failed++;
		const trs = page.locator('.gt-table tbody tr');
		const n = await trs.count();
		for (const [part, from, to] of [['first8', 0, 7], ['last8', n - 8, n - 1]]) {
			const a = await trs.nth(from).boundingBox();
			await trs.nth(from).scrollIntoViewIfNeeded();
			await page.evaluate(() => { const sc = document.querySelector('.gt-table'); sc.scrollLeft = sc.scrollWidth; });
			await page.waitForTimeout(200);
			const b1 = await trs.nth(from).boundingBox();
			const b2 = await trs.nth(to).boundingBox();
			await page.screenshot({ path: `${out}/${lang}-${sizeName}-${part}.png`, clip: { x: Math.max(0, Math.min(b1.x, 0)), y: Math.max(0, b1.y - 4), width: viewport.width, height: Math.min(viewport.height - Math.max(0, b1.y - 4), b2.y + b2.height - b1.y + 8) } });
		}
	}
	await ctx.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
