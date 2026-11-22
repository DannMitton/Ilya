// Lane 79 step 4: watch the squircle's sheet-px midpoint on every frame from navigation, at 390, per page. Prints the distinct values in order.
import { chromium } from '/Users/dannmitton/Desktop/ilya-rewrite/node_modules/.pnpm/node_modules/playwright-core/index.mjs';
const browser = await chromium.launch();
for (const doc of ['text', 'markup', 'insights']) for (const lang of ['en', 'fr']) {
	const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true, storageState: { cookies: [], origins: [{ origin: 'http://localhost:5173', localStorage: [{ name: 'ilya:welcomeSeen', value: '1' }] }] } });
	await ctx.addInitScript(([l, d]) => {
		localStorage.setItem('ilya:language', l); localStorage.setItem('ilya:tab', d);
		window.__seen = []; const tick = () => { const sq = [...document.querySelectorAll('[data-blank-state]')].find((e) => e.getClientRects().length > 0); if (sq) { const w = sq.closest('.blank-window'), sheet = w.offsetParent; const q = sq.getBoundingClientRect(), s = sheet.getBoundingClientRect(), k = s.width / sheet.offsetWidth; const top = Math.round((((q.top + q.bottom) / 2 - s.top) / k) * 10) / 10; const last = window.__seen[window.__seen.length - 1]; if (last !== top) window.__seen.push(top); } requestAnimationFrame(tick); }; requestAnimationFrame(tick);
	}, [lang, doc]);
	const page = await ctx.newPage();
	await page.goto('http://localhost:5173/');
	await page.waitForFunction(() => !document.querySelector('textarea.text-input')?.disabled, null, { timeout: 60000 });
	await page.locator('#tab-' + doc).click();
	await page.waitForTimeout(4000);
	console.log(doc, lang, JSON.stringify(await page.evaluate(() => window.__seen)));
	await ctx.close();
}
await browser.close();
