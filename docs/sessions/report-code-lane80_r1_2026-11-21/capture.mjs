// Lane 80: the before and after pictures. Run from apps/web: node <this> <before|after>. English, a bass called "Voice 1" (no fixture names a person).
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const { chromium } = createRequire(process.cwd() + '/x.js')('@playwright/test');
const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIX = path.resolve(process.cwd(), 'src/lib/score/ingestion/fixtures');
const WHICH = process.argv[2] ?? 'before';
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null;
const BASE = process.env.BASE ?? 'http://localhost:5173'; // BASE is another origin when a scratch copy of an older commit is served; its storage needs the returning-browser flag too
const P = (step, octave, alter = 0) => ({ step, octave, alter });
const F = { i: [280, 2250], e: [400, 2100], 'ɪ': [330, 1900], 'ɨ': [350, 1500], 'ɛ': [520, 1800], a: [700, 1300], 'ɑ': [650, 1000], 'ʌ': [600, 1200], o: [450, 900], u: [240, 800] };
const formants = {};
for (const [v, [f1, f2]] of Object.entries(F)) formants[v] = { f1, f2, confidence: 'high', f2Quality: 'clear', reading: 'captured', plausibility: 'plausible' };
const now = '2026-11-21T12:00:00.000Z';
const voice = JSON.stringify({ version: 2, activeId: 'v', voices: [{ id: 'v', name: 'Voice 1', createdAt: now, updatedAt: now, calibratedAt: now, formants, voiceType: 'bass', characteristics: { rangeLow: P('B', 1, -1), rangeHigh: P('F', 4, 1), tessituraLow: P('B', 2), tessituraHigh: P('B', 3, -1), passaggioPrimary: P('A', 3), passaggioSecondary: P('D', 4, 1), source: 'manual' } }] });
const jobs = [
	{ name: 'text-tchaikovsky', doc: 'text', file: 'tchaikovsky-op38-3-voice.musicxml', pages: [1, 2] },
	{ name: 'text-sunless', doc: 'text', file: 'sunless-01-engraved.musicxml', pages: [1] },
	{ name: 'melody-sunless', doc: 'markup', file: 'sunless-01-engraved.musicxml', pages: [1, 2] },
	{ name: 'insights-sunless', doc: 'insights', file: 'sunless-01-engraved.musicxml', pages: [1] },
	{ name: 'insights-tchaikovsky', doc: 'insights', file: 'tchaikovsky-op38-3-voice.musicxml', pages: [2, 3] },
	{ name: 'insights-tchaikovsky-fr', doc: 'insights', file: 'tchaikovsky-op38-3-voice.musicxml', pages: [4], language: 'fr' },
	{ name: 'text-richter', doc: 'text', typed: 'sanguis atque caulis\nелка зеленый ежик\nмама мыла раму', pages: [1] },
];
const browser = await chromium.launch();
for (const width of [390, 1024]) {
	for (const j of jobs) {
		if (ONLY && !ONLY.includes(j.name)) continue;
		const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 1366 }, deviceScaleFactor: 2, isMobile: width === 390, hasTouch: width === 390, storageState: path.resolve(process.cwd(), 'e2e/returning-browser.storage.json') });
		await context.addInitScript(([l, s]) => { localStorage.setItem('ilya:welcomeSeen', '1'); localStorage.setItem('ilya:language', l); localStorage.setItem('shane.profiles.v2', s); }, [j.language ?? 'en', voice]);
		const page = await context.newPage();
		await page.goto(BASE + '/');
		await page.locator('textarea.text-input').waitFor();
		await page.waitForFunction(() => !document.querySelector('textarea.text-input').disabled, null, { timeout: 90000 });
		if (j.file) {
			await page.locator('input[type="file"].hidden-input').setInputFiles(`${FIX}/${j.file}`);
			await page.waitForTimeout(8000);
		} else {
			await page.evaluate((text) => { document.querySelector('#intake-tab-lyrics')?.click(); const ta = document.querySelector('textarea.text-input'); ta.value = text; ta.dispatchEvent(new Event('input', { bubbles: true })); }, j.typed);
			await page.waitForTimeout(3000);
		}
		await page.evaluate((d) => document.querySelector(`#tab-${d}`)?.click(), j.doc);
		await page.waitForTimeout(j.doc === 'markup' ? 12000 : 9000);
		// The "Voice line as written" chip floats over MELODY's title block until it is dismissed (Escape, as ClefControls says); lane 80 review, amendment 2.
		await page.keyboard.press('Escape');
		await page.evaluate(() => document.querySelector('.clef-overlay') && ((document.activeElement)?.blur?.()));
		await page.waitForTimeout(500);
		for (const n of j.pages) {
			const el = page.locator('.paper-page:visible').nth(n - 1);
			await el.scrollIntoViewIfNeeded();
			await page.waitForTimeout(500);
			await el.screenshot({ path: path.join(HERE, `pic-${WHICH}-${j.name}-p${n}-${width}.png`) });
		}
		console.log(width, j.name, 'ok');
		await context.close();
	}
}
await browser.close();
