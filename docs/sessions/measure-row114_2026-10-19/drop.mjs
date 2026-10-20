// Row 76 (from row 74's drop.mjs; SITE env names the site): drop one PDF into the intake on the dev build, as a singer does (row 55's procedure), in a fresh
// browser context; keep the reading the app stores and the app's [omr] console lines. Prints one line: the letter and
// how it went. Never prints anything of the song.
// Usage: node drop.mjs <letter> <pdf> <out dir>
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path';
const require = createRequire(path.resolve(process.env.HOME, 'Desktop/ilya-rewrite/apps/web/package.json'));
const { chromium } = require('@playwright/test');
const [letter, pdf, out] = process.argv.slice(2);
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-webgpu'] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await ctx.newPage();
const logs = []; page.on('console', (m) => { if (m.text().includes('[omr]')) logs.push(m.text()); });
const t0 = Date.now();
let refused = null;
try {
	await page.goto(process.env.SITE || 'http://localhost:5173/');
	await page.waitForSelector('input[type="file"].hidden-input', { state: 'attached', timeout: 120000 });
	await page.locator('input[type="file"].hidden-input').setInputFiles(pdf);
	await page.locator('.receipt-score').waitFor({ timeout: 600000 });
	await page.waitForTimeout(4000);
} catch (e) { refused = 'no score after ten minutes or a load fault: ' + String(e.message).split('\n')[0].slice(0, 80); }
const vault = await page.evaluate(() => new Promise((res) => {
	const r = indexedDB.open('ilya-library');
	r.onerror = () => res(null);
	r.onsuccess = () => { const db = r.result; if (![...db.objectStoreNames].includes('sources')) return res(null);
		const q = db.transaction('sources', 'readonly').objectStore('sources').getAll(); q.onsuccess = () => res(q.result.map((s) => s.reading ? { stamp: s.reading.stamp, musicXml: s.reading.musicXml } : null)); };
})).catch(() => null);
const reading = (vault || []).find((v) => v && v.musicXml) || null;
if (!refused && !reading) refused = 'no reading kept';
const minutes = (Date.now() - t0) / 60000;
const backend = (logs.find((l) => /homr read .* on (\w[\w-]*)/.test(l)) || '').match(/ on ([\w-]+)$/)?.[1] ?? 'unknown';
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, letter + '.json'), JSON.stringify({ letter, refused, minutes, backend, stamp: reading?.stamp ?? null, logs }));
if (reading) fs.writeFileSync(path.join(out, letter + '.musicxml'), reading.musicXml);
console.log(`${letter}: ${refused ? 'refused (' + refused + ')' : 'read on ' + backend}, ${minutes.toFixed(2)} min`);
await browser.close();
