// Lane 80 (QUEUE row 202), step 0 and the control. Run from apps/web:
//   node ../../docs/sessions/report-code-lane80_r1_2026-11-21/measure.mjs <label> [width]
// Needs the dev server on :5173. Writes <label>.json beside this file. Every length is in SHEET px (the client box
// divided by the sheet's scale), so a phone's fit transform is divided out. No fixture names or states a fact about a person:
// the voice is a bass called "Voice 1" (ENVIRONMENT.md, A CAPTURE FIXTURE NEVER CARRIES DANN'S NAME).
import { createRequire } from 'node:module';
const { chromium } = createRequire(process.cwd() + '/x.js')('@playwright/test');
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIX = path.resolve(process.cwd(), 'src/lib/score/ingestion/fixtures');
const SONGS = { sunless: `${FIX}/sunless-01-engraved.musicxml`, tchaikovsky: `${FIX}/tchaikovsky-op38-3-voice.musicxml` };
const label = process.argv[2] ?? 'step0';
const WIDTH = Number(process.argv[3] ?? 1440);
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null;
const P = (step, octave, alter = 0) => ({ step, octave, alter });
const FORMANTS = { i: [280, 2250], e: [400, 2100], 'ɪ': [330, 1900], 'ɨ': [350, 1500], 'ɛ': [520, 1800], a: [700, 1300], 'ɑ': [650, 1000], 'ʌ': [600, 1200], o: [450, 900], u: [240, 800] };
function voice() {
	const formants = {};
	for (const [v, [f1, f2]] of Object.entries(FORMANTS)) formants[v] = { f1, f2, confidence: 'high', f2Quality: 'clear', reading: 'captured', plausibility: 'plausible' };
	const now = '2026-11-21T12:00:00.000Z';
	return JSON.stringify({ version: 2, activeId: 'v', voices: [{ id: 'v', name: 'Voice 1', createdAt: now, updatedAt: now, calibratedAt: now, formants, voiceType: 'bass', characteristics: { rangeLow: P('B', 1, -1), rangeHigh: P('F', 4, 1), tessituraLow: P('B', 2), tessituraHigh: P('B', 3, -1), passaggioPrimary: P('A', 3), passaggioSecondary: P('D', 4, 1), source: 'manual' } }] });
}

/** Everything read from the page, one record per visible sheet. Runs in the page. */
function readPages() {
	const out = { htmlFontSize: getComputedStyle(document.documentElement).fontSize, pages: [] };
	for (const pg of document.querySelectorAll('.paper-page')) {
		if (pg.getClientRects().length === 0) continue;
		const pr = pg.getBoundingClientRect();
		const k = pr.width / pg.offsetWidth;
		const y = (v) => (v - pr.top) / k;
		const x = (v) => (v - pr.left) / k;
		const box = (e) => (e ? { t: y(e.getBoundingClientRect().top), b: y(e.getBoundingClientRect().bottom), l: x(e.getBoundingClientRect().left), r: x(e.getBoundingClientRect().right) } : null);
		const rec = { sheetW: pg.offsetWidth, sheetH: pg.offsetHeight, scale: k };
		const rule = pg.querySelector('.header-rule');
		const head = rule ? rule.parentElement : null;
		rec.header = head ? { cls: head.className, offsetHeight: head.offsetHeight, ruleBottom: y(rule.getBoundingClientRect().bottom) } : null;
		const run = pg.querySelector('.running-header');
		rec.runningHeaderOffsetHeight = run ? run.offsetHeight : null;
		const aside = pg.querySelector('.header-aside');
		rec.headerAsideClientWidth = aside ? aside.clientWidth : null;
		const foot = pg.querySelector('.page-footer');
		if (foot) {
			const hair = foot.querySelector('.footer-hairline');
			const fc = foot.querySelector('.footer-content');
			const att = foot.querySelector('.attribution-text');
			const cell = foot.querySelector('.pagination-cell');
			const lh = att ? parseFloat(getComputedStyle(att).lineHeight) || null : null;
			rec.footer = {
				offsetHeight: foot.offsetHeight,
				hairlineTopFromSheetBottom: pg.offsetHeight - y(hair.getBoundingClientRect().top),
				footerContentHeight: fc.offsetHeight,
				creditLines: att && lh ? Math.round((att.getBoundingClientRect().height / k / lh) * 100) / 100 : null,
				creditHasRichter: /Richter/.test(att?.textContent ?? ''),
				paginationCellWidth: cell ? cell.getBoundingClientRect().width / k : null,
				pageLabel: cell?.textContent?.trim() ?? null,
				bandHeight: foot.offsetHeight - fc.offsetHeight - hair.offsetHeight,
				hasLegend: !!foot.querySelector('.provenance-legend'),
				hasBroad: !!foot.querySelector('.broad-legend'),
				hasApparatus: !!foot.querySelector('.apparatus'),
				left: x(foot.getBoundingClientRect().left),
				right: x(foot.getBoundingClientRect().right),
			};
		}
		// first glyph of TEXT's first Cyrillic row
		const row = pg.querySelector('.cyrillic-row');
		if (row) {
			const w = document.createTreeWalker(row, NodeFilter.SHOW_TEXT);
			let n;
			while ((n = w.nextNode())) if (n.textContent.trim()) break;
			if (n) {
				const r = document.createRange();
				const i = n.textContent.search(/\S/);
				r.setStart(n, i);
				r.setEnd(n, i + 1);
				const b = r.getBoundingClientRect();
				rec.firstGlyph = { left: x(b.left), top: y(b.top), text: n.textContent.trim()[0] };
				rec.firstCyrillicRowBox = box(row);
			}
		}
		// the window element
		const win = pg.querySelector('.page-content') ?? pg.querySelector('.score-window') ?? pg.querySelector('.column') ?? pg.querySelector('.commentary-window');
		rec.window = win ? { cls: win.className, ...box(win) } : null;
		// control: TEXT lines, MELODY bars, INSIGHTS parts
		const words = [...pg.querySelectorAll('[data-word-index]')].map((e) => Number(e.getAttribute('data-word-index').split('-')[0]));
		if (words.length) rec.lines = { first: Math.min(...words), last: Math.max(...words), distinct: new Set(words).size };
		const sys = [...pg.querySelectorAll('svg[data-system]')].map((s) => s.getAttribute('data-system'));
		if (sys.length) rec.systems = { first: sys[0], last: sys[sys.length - 1], n: sys.length };
		const parts = [...pg.querySelectorAll('.part')].map((p) => (p.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40));
		if (parts.length) rec.parts = { first: parts[0], last: parts[parts.length - 1], n: parts.length };
		const summaries = [...pg.querySelectorAll('summary')].filter((s) => s.getClientRects().length > 0).map((s) => ({ b: y(s.getBoundingClientRect().bottom), text: s.textContent.trim().slice(0, 30) }));
		if (summaries.length) rec.summaries = summaries;
		// the squircles (blank state) and the credit row's own box
		rec.rowsEndingBelowWindow = [...pg.querySelectorAll('.verse-row')].filter((r) => rec.window && y(r.getBoundingClientRect().bottom) > rec.window.b + 0.5).length;
		out.pages.push(rec);
	}
	return out;
}

async function newContext(browser, language) {
	const context = await browser.newContext({ viewport: { width: WIDTH, height: 1300 }, storageState: path.resolve(process.cwd(), 'e2e/returning-browser.storage.json') });
	await context.addInitScript(([l, s]) => { localStorage.setItem('ilya:language', l); localStorage.setItem('shane.profiles.v2', s); }, [language, voice()]);
	return context;
}

async function settle(page, ms) {
	let last = '';
	for (let i = 0; i < 40; i++) {
		const sig = JSON.stringify(await page.evaluate(readPages));
		if (sig === last) return;
		last = sig;
		await page.waitForTimeout(ms);
	}
}

const results = {};
const browser = await chromium.launch(process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {});
const jobs = [];
for (const [name, file] of Object.entries(SONGS)) for (const doc of ['text', 'markup', 'insights']) for (const language of ['en', 'fr']) jobs.push({ key: `${name}/${doc}/${language}`, kind: 'score', file, doc, language });
const LATIN = 'sanguis atque caulis\nелка зеленый ежик\nмама мыла раму';
jobs.push({ key: 'typed-richter/text/en', kind: 'typed', text: LATIN, language: 'en' }, { key: 'typed-richter/text/fr', kind: 'typed', text: LATIN, language: 'fr' });
const MANY = Array.from({ length: 160 }, () => 'достопримечательностями достопримечательностями достопримечательностями').join('\n');
jobs.push({ key: 'typed-many/text/en', kind: 'typed', text: MANY, language: 'en' }, { key: 'typed-many/text/fr', kind: 'typed', text: MANY, language: 'fr' });

for (const j of jobs) {
	if (ONLY && !ONLY.some((o) => j.key.includes(o))) continue;
	const context = await newContext(browser, j.language);
	const page = await context.newPage();
	try {
		await page.goto('http://localhost:5173/');
		await page.locator('textarea.text-input').waitFor();
		await page.waitForFunction(() => !document.querySelector('textarea.text-input').disabled, null, { timeout: 90_000 });
		if (j.kind === 'score') {
			await page.locator('input[type="file"].hidden-input').setInputFiles(j.file);
			await page.waitForTimeout(8000);
			await page.evaluate((d) => document.querySelector(`#tab-${d}`)?.click(), j.doc);
			await page.waitForTimeout(j.doc === 'markup' ? 10_000 : 7000);
		} else {
			await page.locator('#intake-tab-lyrics').click();
			await page.locator('textarea.text-input').focus();
			await page.keyboard.insertText(j.text);
			await page.waitForTimeout(3000);
			await page.evaluate(() => document.querySelector('#tab-text')?.click());
			await page.waitForTimeout(7000);
		}
		await settle(page, 1500);
		results[j.key] = await page.evaluate(readPages);
		console.log(j.key, results[j.key].pages.length, 'pages');
	} catch (e) {
		results[j.key] = { error: String(e) };
		console.log(j.key, 'ERROR', String(e).slice(0, 120));
	}
	await context.close();
}
await browser.close();
fs.writeFileSync(path.join(HERE, `${label}.json`), JSON.stringify({ label, width: WIDTH, results }, null, 1));
