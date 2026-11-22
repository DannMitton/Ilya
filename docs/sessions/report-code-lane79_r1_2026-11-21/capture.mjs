// Lane 79 harness: node capture.mjs <outDir>. Dev server on :5173. Reads each blank page in sheet px at 390 and 1024, EN and FR, three voice states; takes the 12 captures.
import { chromium } from '/Users/dannmitton/Desktop/ilya-rewrite/node_modules/.pnpm/node_modules/playwright-core/index.mjs';
import { writeFileSync } from 'node:fs';
const out = process.argv[2];
const NOW = '2026-11-21T10:00:00.000Z';
const R = (f1, f2) => ({ f1, f2, confidence: 'high', f2Quality: 'clear', reading: 'captured', source: 'measured-user', plausibility: 'plausible' });
const SAMPLES = { i: R(300, 2200), e: R(450, 2000), u: R(350, 800), a: R(800, 1200), o: R(500, 900) };
const VOICES = { none: [], 'type only': [{ id: 'v', name: 'Dann', createdAt: NOW, updatedAt: NOW, calibratedAt: NOW, formants: {}, voiceType: 'baritone' }], samples: [{ id: 'v', name: 'Dann', createdAt: NOW, updatedAt: NOW, calibratedAt: NOW, formants: SAMPLES, voiceType: 'baritone' }] };
const WIDTHS = { phone: { width: 390, height: 844, deviceScaleFactor: 3, hasTouch: true, isMobile: true }, tablet: { width: 1024, height: 1366, deviceScaleFactor: 2 } };
const browser = await chromium.launch();
const rows = [];
for (const [wname, w] of Object.entries(WIDTHS).filter(([n]) => !process.env.ONLY || n === process.env.ONLY)) for (const lang of ['en', 'fr']) for (const [vname, voices] of Object.entries(VOICES)) {
	const ctx = await browser.newContext({ viewport: { width: w.width, height: w.height }, deviceScaleFactor: w.deviceScaleFactor, hasTouch: !!w.hasTouch, isMobile: !!w.isMobile, storageState: { cookies: [], origins: [{ origin: 'http://localhost:5173', localStorage: [{ name: 'ilya:welcomeSeen', value: '1' }] }] } });
	await ctx.addInitScript(([l, s]) => { localStorage.setItem('ilya:language', l); localStorage.setItem('shane.profiles.v2', s); }, [lang, JSON.stringify({ version: 2, activeId: voices.length ? 'v' : null, voices })]);
	const page = await ctx.newPage();
	await page.goto('http://localhost:5173/');
	await page.locator('textarea.text-input').waitFor({ state: 'attached', timeout: 60000 });
	await page.waitForFunction(() => !document.querySelector('textarea.text-input').disabled, null, { timeout: 60000 });
	for (const doc of ['text', 'markup', 'insights']) {
		await page.locator('#tab-' + doc).click();
		await page.locator('[data-blank-state]:visible').first().waitFor({ timeout: 30000 });
		let last = '', m;
		for (let i = 0; i < 40; i++) {
			m = await page.evaluate(() => {
				const sq = [...document.querySelectorAll('[data-blank-state]')].find((e) => e.getClientRects().length > 0);
				const win = sq.closest('.blank-window'), sheet = win.offsetParent, sr = sheet.getBoundingClientRect(), k = sr.width / sheet.offsetWidth;
				const y = (v) => Math.round(((v - sr.top) / k) * 100) / 100, x = (v) => Math.round(((v - sr.left) / k) * 100) / 100;
				const rule = sheet.querySelector('.header-rule').getBoundingClientRect(), hair = sheet.querySelector('.footer-hairline').getBoundingClientRect(), q = sq.getBoundingClientRect();
				const header = sheet.querySelector('.title-header'), footer = sheet.querySelector('.page-footer');
				return { scale: Math.round(k * 10000) / 10000, headerHeight: header.offsetHeight, footerHeight: footer.offsetHeight, windowTop: win.offsetTop, windowBottom: sheet.offsetHeight - win.offsetTop - win.offsetHeight, ruleBottom: y(rule.bottom), footerRuleTop: y(hair.top), windowMid: Math.round(((y(rule.bottom) + y(hair.top)) / 2) * 100) / 100, squircleTop: y(q.top), squircleBottom: y(q.bottom), squircleMid: Math.round(((y(q.top) + y(q.bottom)) / 2) * 100) / 100, squircleLeft: x(q.left), squircleWidth: Math.round((q.width / k) * 100) / 100, headerText: header.innerText.replace(/\s+/g, ' ').slice(0, 160) };
			});
			const sig = JSON.stringify(m); if (sig === last) break; last = sig; await page.waitForTimeout(600);
		}
		rows.push({ doc, width: wname, lang, voice: vname, ...m });
		if (vname === 'samples') { const el = (await page.locator('[data-blank-state]:visible').first().elementHandle()); await page.evaluate(() => window.scrollTo(0, 0)); await page.screenshot({ path: `${out}/blank-${doc}-${wname}-${lang}.png`, fullPage: false }); }
	}
	await ctx.close();
}
await browser.close();
writeFileSync(`${out}/measurements${process.env.ONLY ? '-' + process.env.ONLY : ''}.json`, JSON.stringify(rows, null, 1));
console.log(rows.length, 'rows');
