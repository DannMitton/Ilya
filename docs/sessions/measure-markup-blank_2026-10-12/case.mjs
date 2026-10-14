// Row 93 (2026-10-12, Code on the Mac): does Markup draw the syllables of «Средь шумного бала»? Extended from
// rows-78-79-shots/shoot.mjs (its voice store and context, unchanged): a stored bass voice "Dann", French, then one of
// two sources: the Jurgenson PDF dropped with the poem typed in the poem box (`pdf`), or the MusicXML fixture with the
// poem box left empty (`fixture`). Opens Markup and counts the <text> elements in its SVGs by kind. Then, with `reopen`,
// reloads the page in the same context (same IndexedDB and localStorage) and counts again on the song as stored.
// Measures only: writes nothing outside <outdir>.
// Usage: node case.mjs <outdir> <tag> <source: pdf|fixture> [sampled=i,e,...] [reopen] [port=5173] [repo=<path>] [site=<url>] [poemafter: type the poem after the score arrives]
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path';
const args = process.argv.slice(2);
const [outdir, tag, source, ...flags] = args;
const REPO = flags.find((f) => f.startsWith('repo='))?.slice(5) ?? path.resolve(process.env.HOME, 'Desktop/ilya-rewrite');
const PORT = flags.find((f) => f.startsWith('port='))?.slice(5) ?? '5173';
const HERE = path.dirname(new URL(import.meta.url).pathname);
const require = createRequire(path.join(REPO, 'apps/web/package.json'));
const { chromium } = require('@playwright/test');
const sampled = flags.find((f) => f.startsWith('sampled='))?.slice(8).split(',') ?? null;
const reopen = flags.includes('reopen');
fs.mkdirSync(outdir, { recursive: true });
const PDF = path.resolve(process.env.HOME, 'Downloads/Tchaikovsky_Op38-3_Sred-shumnogo-bala_Jurgenson-1878.pdf');
const FIXTURE = path.join(REPO, 'apps/web/src/lib/score/ingestion/fixtures/tchaikovsky-op38-3-voice.musicxml');
const POEM = fs.readFileSync(path.join(HERE, 'poem.txt'), 'utf8');
const P = (step, octave, alter = 0) => ({ step, octave, alter });
const FORMANTS = { i: [280, 2250], e: [400, 2100], 'ɪ': [330, 1900], 'ɨ': [350, 1500], 'ɛ': [520, 1800], a: [700, 1300], 'ɑ': [650, 1000], 'ʌ': [600, 1200], o: [450, 900], u: [240, 800] };
const CH = { rangeLow: P('B', 1, -1), rangeHigh: P('F', 4, 1), tessituraLow: P('B', 2), tessituraHigh: P('B', 3, -1), passaggioPrimary: P('A', 3), passaggioSecondary: P('D', 4, 1), source: 'manual' };
function store() {
	const formants = {};
	for (const [v, [f1, f2]] of Object.entries(FORMANTS)) if (!sampled || sampled.includes(v)) formants[v] = { f1, f2, confidence: 'high', f2Quality: 'clear', reading: 'captured', plausibility: 'plausible' };
	const now = '2026-09-27T12:00:00.000Z';
	return { version: 2, activeId: 'v', voices: [{ id: 'v', name: 'Dann', createdAt: now, updatedAt: now, calibratedAt: now, formants, voiceType: 'bass', characteristics: CH }] };
}
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-webgpu'] });
const ctx = await browser.newContext({ serviceWorkers: 'block', viewport: { width: 1440, height: 1300 } });
const page = await ctx.newPage();
let logs = []; page.on('console', (m) => logs.push(m.text().slice(0, 400)));
page.on('pageerror', (e) => logs.push('pageerror: ' + String(e).slice(0, 400)));
// Set once, on the first load only, so the reload keeps whatever the app itself stored.
await page.addInitScript(([l, s]) => { if (!sessionStorage.getItem('row93')) { sessionStorage.setItem('row93', '1'); localStorage.setItem('ilya:language', l); localStorage.setItem('shane.profiles.v2', s); } }, ['fr', JSON.stringify(store())]);
const URL_ = flags.find((f) => f.startsWith('site='))?.slice(5) ?? `http://localhost:${PORT}/`;
const seatLine = () => logs.find((l) => l.startsWith('[Ilya] N.160 seats:')) ?? null;
const dryLine = () => logs.find((l) => l.startsWith('[Ilya] N.160 dry run')) ?? null;
async function waitFor(fn, ms) { const t = Date.now(); while (Date.now() - t < ms) { if (fn()) return true; await page.waitForTimeout(500); } return false; }

async function markup(stage) {
	await page.evaluate(() => document.querySelector('#tab-markup')?.click());
	await page.waitForFunction(() => document.querySelectorAll('.markup-paper-container [data-system]').length > 0, null, { timeout: 120000 }).catch(() => {});
	await page.waitForTimeout(9000);
	const m = await page.evaluate(() => {
		const svgs = [...document.querySelectorAll('.markup-paper-container svg')];
		const texts = svgs.flatMap((s) => [...s.querySelectorAll('text')]);
		const kind = (t) => {
			const s = t.textContent ?? '';
			if (/[Ѐ-ӿ]/.test(s)) return 'cyrillic';
			if (/[a-zɑɐɛɪɨʌʊʃʒɲɫɣˈːʲ]/i.test(s)) return 'latinOrIpa';
			if (/^[-\s]*$/.test(s)) return 'smufl';
			return 'other';
		};
		const counts = {}; for (const t of texts) { const k = kind(t); counts[k] = (counts[k] ?? 0) + 1; }
		const sample = (k) => texts.filter((t) => kind(t) === k).slice(0, 8).map((t) => t.textContent);
		const pages = [...document.querySelectorAll('.markup-paper-container .paper-page')].filter((p) => p.querySelector('[data-system]')).length;
		const container = document.querySelector('.markup-paper-container');
		const top = container ? (container.innerText.match(/[^\n]*(provisoire|provisional|valeur par défaut|placeholder)[^\n]*/gi) ?? []) : [];
		return { svgs: svgs.length, systems: document.querySelectorAll('.markup-paper-container [data-system]').length, pages, texts: texts.length, counts, cyrSample: sample('cyrillic'), ipaSample: sample('latinOrIpa'), otherSample: sample('other'), provisionalLines: top };
	});
	const shot = path.join(outdir, `${tag}-${stage}-markup-p1.png`);
	await page.locator('.markup-paper-container .paper-page').first().screenshot({ path: shot }).catch(() => {});
	const text = await page.evaluate(() => {
		document.querySelector('#tab-text')?.click();
		return null;
	});
	await page.waitForTimeout(3000);
	const textWords = await page.locator('[data-word-index]').count();
	return { ...m, textWords };
}

const t0 = Date.now();
await page.goto(URL_);
await page.locator('textarea.text-input').waitFor({ state: 'attached', timeout: 120000 }).catch(() => {});
await page.waitForFunction(() => document.querySelector('input[type="file"].hidden-input'), null, { timeout: 120000 });
await page.waitForFunction(() => !document.querySelector('textarea.text-input')?.disabled, null, { timeout: 120000 }).catch(() => {});
await page.waitForTimeout(1500);
let poemTyped = false;
const poemAfter = flags.includes('poemafter');
if (source === 'pdf' && !poemAfter) {
	await page.locator('textarea.text-input').fill(POEM);
	poemTyped = (await page.locator('textarea.text-input').inputValue()).length > 0;
}
await page.locator('input[type="file"].hidden-input').setInputFiles(source === 'pdf' ? PDF : FIXTURE);
const scoreArrived = await page.locator('.receipt-score').waitFor({ timeout: 900000 }).then(() => true, () => false);
if (source === 'pdf' && poemAfter) {
	await page.waitForTimeout(5000);
	await page.locator('textarea.text-input').fill(POEM);
	poemTyped = (await page.locator('textarea.text-input').inputValue()).length > 0;
}
const seated = await waitFor(seatLine, 120000);
await page.waitForTimeout(5000);
const fresh = { minutes: +((Date.now() - t0) / 60000).toFixed(2), scoreArrived, poemTyped, seatLine: seatLine(), dryLine: dryLine(), poemLen: (await page.locator('textarea.text-input').inputValue().catch(() => '')).length, ...(await markup('fresh')) };
const result = { tag, source, sampled, fresh };
const freshLogs = logs;
if (reopen) {
	logs = [];
	await page.reload();
	await page.waitForFunction(() => document.querySelector('input[type="file"].hidden-input'), null, { timeout: 120000 });
	// The stored song reopens on its own after a reload; if a library list is shown instead, open its first song.
	const reopened = await waitFor(seatLine, 180000);
	const lib = await page.evaluate(() => [...document.querySelectorAll('button, a')].map((b) => (b.textContent ?? '').trim()).filter((t) => /Средь|bala/i.test(t)).slice(0, 5));
	await page.waitForTimeout(5000);
	result.reopen = { seatLineAppeared: reopened, seatLine: seatLine(), dryLine: dryLine(), libraryEntries: lib, poemLen: (await page.locator('textarea.text-input').inputValue().catch(() => '')).length, ...(await markup('reopen')) };
}
fs.writeFileSync(path.join(outdir, `${tag}.json`), JSON.stringify(result, null, 1));
fs.writeFileSync(path.join(outdir, `${tag}.log`), [...freshLogs, '---- reopen ----', ...(reopen ? logs : [])].filter((l) => !/BlurbComposer/.test(l)).join('\n'));
console.log(JSON.stringify(result));
await browser.close();
