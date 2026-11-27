// Step 3: one scan dropped into the running app, read end to end by the app's own reader, in a fresh browser profile.
// Nothing in the app is changed. The page's `Worker` is wrapped only to copy what each Worker answers (the underlay's
// layout, the metre reader's windows, and tesseract's words per row). Writes <out>.json (console lines, those answers,
// the reading the app stored with the song, and what homr's pass returned where it can be seen) and screenshots
// <out>-text.png, <out>-melody.png, and <out>-melody-tall.png. Needs the dev server on :5173.
// usage: node step3-e2e.mjs <scan.pdf> <out prefix>
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire('/Users/dannmitton/Desktop/ilya-rewrite/apps/web/package.json');
const { chromium } = require('@playwright/test');
const [pdf, out] = process.argv.slice(2);
const browser = await chromium.launch();
const ctx = await browser.newContext({ serviceWorkers: 'block', viewport: { width: 1600, height: 1100 } });
await ctx.addInitScript(() => {
	const Real = window.Worker;
	window.__answers = [];
	window.Worker = class extends Real {
		constructor(url, opts) {
			super(url, opts);
			this.addEventListener('message', (e) => {
				const d = e.data;
				const keep = d && ((d.ok && (d.layout || d.seen || d.looks)) || (d.status === 'resolve' && d.data && d.data.blocks));
				if (keep) window.__answers.push(JSON.parse(JSON.stringify(d, (k, v) => (v instanceof Blob || (k === 'rows' && d.looks) ? undefined : v))));
			});
		}
	};
});
const page = await ctx.newPage();
const lines = [];
const t0 = Date.now();
const say = (s) => { const l = `${((Date.now() - t0) / 1000).toFixed(1)}s ${s}`; lines.push(l); if (/\[omr\]|\[Ilya\]|error|Error/.test(s)) console.log(l.slice(0, 600)); };
page.on('console', (m) => { const t = m.text(); if (!/BlurbComposer/.test(t)) say(`[${m.type()}] ${t}`); });
page.on('pageerror', (e) => say('[pageerror] ' + e.message));
await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
await page.locator('input[type="file"].hidden-input').waitFor({ state: 'attached', timeout: 120000 });
await page.waitForTimeout(8000);
// a fresh profile meets the welcome sheet, which covers the document tabs
const begin = page.getByRole('button', { name: /^Begin$/ });
if (await begin.count()) await begin.click();
await page.waitForTimeout(1000);
say('dropping the scan');
await page.locator('input[type="file"].hidden-input').setInputFiles(pdf);
const done = () => lines.some((l) => /\[omr\] homr read \d|\[omr\] homr did not read/.test(l));
while (!done() && Date.now() - t0 < 1_500_000) await page.waitForTimeout(2000);
say(done() ? 'the read ended' : 'timed out');
await page.waitForTimeout(20000);
await page.screenshot({ path: out + '-text.png' });
const melody = page.getByRole('tab', { name: /^MELODY$/i }).or(page.getByRole('button', { name: /^MELODY$/i })).first();
if (await melody.count()) {
	await melody.click();
	await page.waitForTimeout(25000);
	await page.screenshot({ path: out + '-melody.png' });
	await page.setViewportSize({ width: 1600, height: 3200 });
	await page.waitForTimeout(8000);
	await page.screenshot({ path: out + '-melody-tall.png' });
} else say('no MELODY control found');
const stored = await page.evaluate(async () => {
	const db = await new Promise((res, rej) => { const q = indexedDB.open('ilya-library'); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); });
	const stores = [...db.objectStoreNames];
	const all = {};
	for (const s of stores) all[s] = await new Promise((res) => { const q = db.transaction(s).objectStore(s).getAll(); q.onsuccess = () => res(q.result); q.onerror = () => res(null); });
	return JSON.parse(JSON.stringify(all, (k, v) => (v instanceof Blob || v instanceof ArrayBuffer || ArrayBuffer.isView(v) ? '[binary]' : v)));
});
const answers = await page.evaluate(() => window.__answers);
const bodyText = await page.evaluate(() => document.body.innerText);
fs.writeFileSync(out + '.json', JSON.stringify({ lines, answers, stored, bodyText }, null, 1));
console.log('answers captured:', answers.length, '; stores:', Object.keys(stored).join(','));
await browser.close();
