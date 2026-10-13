// Row 89: one drop of an OPENED song (4F only) on the dev server, as drop.mjs does, with three hooks added in the
// browser only: the served modules homr-reader.ts and triplets.ts are patched in flight (page.route), so the tree
// is untouched. Logs: homr's own MusicXML per page ([diag] xmls), each lookOverNotes answer ([diag] look), and each
// completeTriplets call with its rule ([diag] ct). Writes <out>/<label>.diag.json and the stored reading.
// Usage: node diag.mjs <label> <pdf> <out dir>
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path';
const require = createRequire(path.resolve(process.env.HOME, 'Desktop/ilya-rewrite/apps/web/package.json'));
const { chromium } = require('@playwright/test');
const [label, pdf, out] = process.argv.slice(2);
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-webgpu'] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const patched = { reader: false, triplets: false };
await ctx.route(/\/src\/lib\/omr\/(homr-reader|triplets)\.ts(\?.*)?$/, async (route) => {
	const res = await route.fetch();
	let body = await res.text();
	if (/homr-reader\.ts/.test(route.request().url())) {
		const a = body.replace(/for \(let round = 0; round < 3; round\+\+\) \{/, (s) => `console.info('[diag] xmls ' + JSON.stringify(xmls)); ${s}`);
		const b = a.replace(/(const over = lookOverNotes\([^;]*\);)/, `$1 console.info('[diag] look ' + JSON.stringify({ page: q.page, notes: q.notes, dx, dy, numbers: over.numbers, centres: over.centres, space: over.space }));`);
		patched.reader = a !== body && b !== a; body = b;
	} else {
		const a = body.replace(/export function completeTriplets\(/, 'function completeTriplets__(');
		patched.triplets = a !== body;
		body = a + `\nexport function completeTriplets(c, m, d, s, l) {
	const seen = [];
	const r = completeTriplets__(c, m, d, s, l ? (n) => { const x = l(n); seen.push(x); return x; } : l);
	console.info('[diag] ct ' + JSON.stringify({ input: c, metre: m, divisions: d, statesMetre: s, page: seen, rule: r.rule, output: r.children }));
	return r;
}\n`;
	}
	await route.fulfill({ response: res, body });
});
const page = await ctx.newPage();
const logs = []; const diag = [];
page.on('console', (m) => { const t = m.text(); if (t.includes('[omr]')) logs.push(t); if (t.startsWith('[diag] ')) diag.push(t); });
const t0 = Date.now();
let refused = null;
try {
	await page.goto('http://localhost:5173/');
	await page.waitForSelector('input[type="file"].hidden-input', { state: 'attached', timeout: 120000 });
	await page.locator('input[type="file"].hidden-input').setInputFiles(pdf);
	await page.locator('.receipt-score').waitFor({ timeout: 600000 });
	await page.waitForTimeout(4000);
} catch (e) { refused = 'no score: ' + String(e.message).split('\n')[0].slice(0, 80); }
const vault = await page.evaluate(() => new Promise((res) => {
	const r = indexedDB.open('ilya-library');
	r.onerror = () => res(null);
	r.onsuccess = () => { const db = r.result; if (![...db.objectStoreNames].includes('sources')) return res(null);
		const q = db.transaction('sources', 'readonly').objectStore('sources').getAll(); q.onsuccess = () => res(q.result.map((s) => s.reading ? { stamp: s.reading.stamp, musicXml: s.reading.musicXml } : null)); };
})).catch(() => null);
const reading = (vault || []).find((v) => v && v.musicXml) || null;
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, label + '.diag.json'), JSON.stringify({ label, refused, patched, minutes: (Date.now() - t0) / 60000, stamp: reading?.stamp ?? null, logs, diag }));
if (reading) fs.writeFileSync(path.join(out, label + '.musicxml'), reading.musicXml);
console.log(`${label}: ${refused ? 'refused (' + refused + ')' : 'read'}; patched ${JSON.stringify(patched)}; ${diag.length} diag lines`);
await browser.close();
