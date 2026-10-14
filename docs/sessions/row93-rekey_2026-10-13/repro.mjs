// Row 93 fix (2026-10-13, Code on the Mac): the real history of «Средь шумного бала». The old reader
// (`?reader=ilya`) reads the Jurgenson PDF and the typed poem seats under `r{bar}-{x}` ids; then the page is
// opened WITHOUT the flag, so the restore reads with homr and keeps that reading; then reloaded once more. At
// each stage: the stored pairing keys by shape, the reading stamp, the Markup <text> counts, the station's orphan
// line, and the `re-key` and `N.160` console lines. Set-up (voice store, French, headless Chrome with WebGPU,
// service workers blocked) is case.mjs's from measure-markup-blank_2026-10-12, unchanged.
// Usage: node repro.mjs <outdir> <tag> [port=5173] [redrop]
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path';
const [outdir, tag, ...flags] = process.argv.slice(2);
const REPO = path.resolve(process.env.HOME, 'Desktop/ilya-rewrite');
const PORT = flags.find((f) => f.startsWith('port='))?.slice(5) ?? '5173';
const require = createRequire(path.join(REPO, 'apps/web/package.json'));
const { chromium } = require('@playwright/test');
fs.mkdirSync(outdir, { recursive: true });
const PDF = path.resolve(process.env.HOME, 'Downloads/Tchaikovsky_Op38-3_Sred-shumnogo-bala_Jurgenson-1878.pdf');
const POEM = fs.readFileSync(path.join(REPO, 'docs/sessions/measure-markup-blank_2026-10-12/poem.txt'), 'utf8');
const P = (step, octave, alter = 0) => ({ step, octave, alter });
const FORMANTS = { i: [280, 2250], e: [400, 2100], 'ɪ': [330, 1900], 'ɛ': [520, 1800], a: [700, 1300], 'ʌ': [600, 1200], o: [450, 900], u: [240, 800] };
const CH = { rangeLow: P('B', 1, -1), rangeHigh: P('F', 4, 1), tessituraLow: P('B', 2), tessituraHigh: P('B', 3, -1), passaggioPrimary: P('A', 3), passaggioSecondary: P('D', 4, 1), source: 'manual' };
function store() {
	const formants = {};
	for (const [v, [f1, f2]] of Object.entries(FORMANTS)) formants[v] = { f1, f2, confidence: 'high', f2Quality: 'clear', reading: 'captured', plausibility: 'plausible' };
	const now = '2026-09-27T12:00:00.000Z';
	return { version: 2, activeId: 'v', voices: [{ id: 'v', name: 'Dann', createdAt: now, updatedAt: now, calibratedAt: now, formants, voiceType: 'bass', characteristics: CH }] };
}
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-webgpu'] });
const ctx = await browser.newContext({ serviceWorkers: 'block', viewport: { width: 1440, height: 1300 } });
const page = await ctx.newPage();
let logs = []; const allLogs = [];
page.on('console', (m) => { const s = m.text().slice(0, 600); logs.push(s); allLogs.push(s); });
page.on('pageerror', (e) => { const s = 'pageerror: ' + String(e).slice(0, 400); logs.push(s); allLogs.push(s); });
await page.addInitScript(([l, s]) => { if (!sessionStorage.getItem('row93')) { sessionStorage.setItem('row93', '1'); localStorage.setItem('ilya:language', l); localStorage.setItem('shane.profiles.v2', s); } }, ['fr', JSON.stringify(store())]);
const BASE = `http://localhost:${PORT}/`;
const line = (prefix) => logs.filter((l) => l.startsWith(prefix));
async function waitFor(fn, ms) { const t = Date.now(); while (Date.now() - t < ms) { if (fn()) return true; await page.waitForTimeout(500); } return false; }

const OLD = /^r\d+-\d+(?:-\d+)?$/;
const vault = () => page.evaluate(() => new Promise((res) => {
	const r = indexedDB.open('ilya-library');
	r.onerror = () => res({ error: String(r.error) });
	r.onsuccess = () => {
		const db = r.result; const out = { songs: [], sources: [] };
		const t = db.transaction(['songs', 'sources'], 'readonly');
		t.objectStore('songs').getAll().onsuccess = (e) => (out.songs = e.target.result.map((s) => ({ id: s.id, name: s.name, pairings: s.pairings, corrections: Object.keys(s.corrections || {}) })));
		t.objectStore('sources').getAll().onsuccess = (e) => (out.sources = e.target.result.map((s) => ({ songId: s.songId, fileName: s.fileName, byteLength: s.byteLength, reading: s.reading ? { stamp: s.reading.stamp, musicXml: s.reading.musicXml } : null })));
		t.oncomplete = () => res(out);
	};
}));
async function record(stage) {
	let v = null;
	for (let i = 0; i < 20 && !v; i++) { try { v = await vault(); } catch { await page.waitForTimeout(1500); } }
	const song = v.songs[0] ?? null; const src = v.sources[0] ?? null;
	const keys = song ? Object.keys(song.pairings) : [];
	const kinds = {}; for (const p of Object.values(song?.pairings ?? {})) kinds[p.kind] = (kinds[p.kind] ?? 0) + 1;
	const xml = src?.reading?.musicXml ?? '';
	if (xml) fs.writeFileSync(path.join(outdir, `${tag}-${stage}.kept.musicxml`), xml);
	if (song) fs.writeFileSync(path.join(outdir, `${tag}-${stage}.pairings.json`), JSON.stringify(song.pairings, null, 1));
	return {
		songs: v.songs.length, entries: keys.length, oldKeys: keys.filter((k) => OLD.test(k)).length, cursorKeys: keys.filter((k) => /^m\d+-/.test(k)).length,
		firstKeys: keys.slice(0, 3), lastKey: keys.at(-1) ?? null, kinds, corrections: song?.corrections.length ?? null,
		source: src && { fileName: src.fileName, byteLength: src.byteLength, stamp: src.reading?.stamp ?? null, xmlLen: xml.length, notes: (xml.match(/<note[\s>]/g) ?? []).length, notesWithId: (xml.match(/<note\s[^>]*id=/g) ?? []).length, imgpos: (xml.match(/imgpos:/g) ?? []).length },
	};
}
async function markup(stage) {
	await page.evaluate(() => document.querySelector('#tab-markup')?.click());
	await page.waitForFunction(() => document.querySelectorAll('.markup-paper-container [data-system]').length > 0, null, { timeout: 120000 }).catch(() => {});
	await page.waitForTimeout(9000);
	// The station's orphan line (`station.orphaned`) renders inside the Voice band, which draws only when open.
	const band = await page.evaluate(() => { const b = document.querySelector('section.group-score button.band-toggle'); if (!b) return 'no band'; if (b.getAttribute('aria-expanded') === 'false') b.click(); return 'open'; });
	await page.waitForTimeout(1500);
	const m = await page.evaluate(() => {
		const svgs = [...document.querySelectorAll('.markup-paper-container svg')];
		const texts = svgs.flatMap((s) => [...s.querySelectorAll('text')]);
		const kind = (t) => { const s = t.textContent ?? ''; if (/[Ѐ-ӿ]/.test(s)) return 'cyrillic'; if (/[a-zɑɐɛɪɨʌʊʃʒɲɫɣˈːʲ]/i.test(s)) return 'latinOrIpa'; if (/^[-\s]*$/.test(s)) return 'smufl'; return 'other'; };
		const counts = {}; for (const t of texts) { const k = kind(t); counts[k] = (counts[k] ?? 0) + 1; }
		const sample = (k) => texts.filter((t) => kind(t) === k).slice(0, 6).map((t) => t.textContent);
		const orphan = (document.body.textContent ?? '').match(/\d+ placements n’ont plus de note[^.]*\./)?.[0] ?? null;
		const bandText = (document.querySelector('#band-scoreMarkup')?.textContent ?? '').replace(/\s+/g, ' ').slice(0, 300);
		return { systems: document.querySelectorAll('.markup-paper-container [data-system]').length, counts, cyrSample: sample('cyrillic'), ipaSample: sample('latinOrIpa'), orphanLine: orphan, bandText };
	});
	await page.locator('.markup-paper-container .paper-page').first().screenshot({ path: path.join(outdir, `${tag}-${stage}-markup-p1.png`) }).catch(() => {});
	await page.evaluate(() => document.querySelector('#tab-text')?.click());
	await page.waitForTimeout(2000);
	return { band, ...m };
}
const stageLines = () => ({ seat: line('[Ilya] N.160 seats:'), dry: line('[Ilya] N.160 dry run'), rekey: logs.filter((l) => / re-key: /.test(l)), omr: logs.filter((l) => /^\[omr\]/.test(l)).slice(0, 4), errors: logs.filter((l) => l.startsWith('pageerror')) });
const result = { tag };

// Stage 1: the old reader reads the PDF; the poem seats under its ids.
const t0 = Date.now();
await page.goto(BASE + '?reader=ilya');
await page.locator('textarea.text-input').waitFor({ state: 'attached', timeout: 120000 });
await page.waitForFunction(() => document.querySelector('input[type="file"].hidden-input'), null, { timeout: 120000 });
await page.waitForFunction(() => !document.querySelector('textarea.text-input')?.disabled, null, { timeout: 900000 }).catch(() => {});
await page.waitForTimeout(1500);
await page.locator('textarea.text-input').fill(POEM);
await page.locator('input[type="file"].hidden-input').setInputFiles(PDF);
await page.getByRole('button', { name: /Lire cette page|Read this page/ }).click({ timeout: 60000 });
const arrived = await page.locator('.receipt-score').waitFor({ timeout: 900000 }).then(() => true, () => false);
await waitFor(() => line('[Ilya] N.160 seats:').length > 0, 120000);
await page.waitForTimeout(5000);
result.old = { minutes: +((Date.now() - t0) / 60000).toFixed(2), arrived, ...stageLines(), vault: await record('old'), markup: await markup('old') };
console.log('old', JSON.stringify(result.old.vault));

// Stage 2: opened without the flag. The restore reads with homr and keeps the reading.
for (const [stage, url] of [['reopen1', BASE], ['reopen2', BASE]]) {
	logs = [];
	const t = Date.now();
	await page.goto(url);
	await page.waitForFunction(() => document.querySelector('input[type="file"].hidden-input'), null, { timeout: 120000 });
	await waitFor(() => line('[Ilya] N.160 seats:').length > 0, 900000);
	// The first reopen reads with homr; the seat line can print before that read lands.
	if (stage === 'reopen1') await waitFor(() => logs.some((l) => /homr read \d+ of/.test(l)), 900000);
	await page.waitForTimeout(8000);
	result[stage] = { minutes: +((Date.now() - t) / 60000).toFixed(2), ...stageLines(), vault: await record(stage), markup: await markup(stage) };
	console.log(stage, JSON.stringify(result[stage].vault), JSON.stringify(result[stage].markup.counts), result[stage].rekey);
}
// Stage 3, with `redrop`: the same PDF dropped again onto the reopened song, as a singer would.
if (flags.includes('redrop')) {
	logs = [];
	const t = Date.now();
	await page.locator('input[type="file"].hidden-input').setInputFiles(PDF);
	const asked = () => page.evaluate(() => /Ce n’est pas la même musique|This is not the same music/.test(document.querySelector('dialog[open]')?.textContent ?? ''));
	const t1 = Date.now(); let ask = false;
	while (Date.now() - t1 < 600000) { if ((ask = await asked())) break; if (logs.some((l) => /homr read \d+ of/.test(l))) break; await page.waitForTimeout(1000); }
	if (!ask) { await page.waitForTimeout(10000); ask = await asked(); }
	const dialog = ask ? await page.evaluate(() => (document.querySelector('dialog[open]')?.textContent ?? '').replace(/\s+/g, ' ').slice(0, 400)) : null;
	if (ask) await page.getByRole('button', { name: /Conserver|Keep/ }).first().click().catch(() => {});
	await page.waitForTimeout(15000);
	result.redrop = { minutes: +((Date.now() - t) / 60000).toFixed(2), askDialog: ask, dialog, ...stageLines(), vault: await record('redrop'), markup: await markup('redrop') };
	console.log('redrop', ask, JSON.stringify(result.redrop.vault), JSON.stringify(result.redrop.markup.counts), result.redrop.rekey);
}
fs.writeFileSync(path.join(outdir, `${tag}.json`), JSON.stringify(result, null, 1));
fs.writeFileSync(path.join(outdir, `${tag}.log`), allLogs.filter((l) => !/BlurbComposer/.test(l)).join('\n'));
await browser.close();
