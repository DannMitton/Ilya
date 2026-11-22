// Lane 81 (QUEUE row 204), step 1: the rendered census. Run from apps/web:
//   node ../../docs/sessions/report-code-lane81_r1_2026-11-22/census.mjs <before|after>
// Needs the dev server on :5173. For each of 4 conditions (en/fr x 1024/390), TEXT, MELODY, and INSIGHTS for one score (Tchaikovsky op. 38 no. 3), page 1 and
// page 2, and the three blank pages: one PNG per sheet and one JSON of everything measured on it, in SHEET px (client box / the sheet's scale).
// The voice is a bass called "Voice 1": no fixture names a person. The "Voice line as written" card is dismissed (Escape) before each capture.
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const { chromium } = createRequire(process.cwd() + '/x.js')('@playwright/test');
const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIX = path.resolve(process.cwd(), 'src/lib/score/ingestion/fixtures');
const WHICH = process.argv[2] ?? 'before';
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null;
const BASE = process.env.BASE ?? 'http://localhost:5173';
const P = (step, octave, alter = 0) => ({ step, octave, alter });
const F = { i: [280, 2250], e: [400, 2100], 'ɪ': [330, 1900], 'ɨ': [350, 1500], 'ɛ': [520, 1800], a: [700, 1300], 'ɑ': [650, 1000], 'ʌ': [600, 1200], o: [450, 900], u: [240, 800] };
const formants = {};
for (const [v, [f1, f2]] of Object.entries(F)) formants[v] = { f1, f2, confidence: 'high', f2Quality: 'clear', reading: 'captured', plausibility: 'plausible' };
const now = '2026-11-22T12:00:00.000Z';
const voice = JSON.stringify({ version: 2, activeId: 'v', voices: [{ id: 'v', name: 'Voice 1', createdAt: now, updatedAt: now, calibratedAt: now, formants, voiceType: 'bass', characteristics: { rangeLow: P('B', 1, -1), rangeHigh: P('F', 4, 1), tessituraLow: P('B', 2), tessituraHigh: P('B', 3, -1), passaggioPrimary: P('A', 3), passaggioSecondary: P('D', 4, 1), source: 'manual' } }] });

/** Runs in the page: everything measured on every visible sheet. */
function readSheets() {
	const sheets = [];
	for (const pg of document.querySelectorAll('.paper-page')) {
		if (pg.getClientRects().length === 0) continue;
		const pr = pg.getBoundingClientRect();
		const k = pr.width / pg.offsetWidth;
		const X = (v) => Math.round(((v - pr.left) / k) * 100) / 100;
		const Y = (v) => Math.round(((v - pr.top) / k) * 100) / 100;
		const key = (e) => e.tagName.toLowerCase() + [...e.classList].filter((c) => !/^svelte-/.test(c)).map((c) => '.' + c).join('');
		const path = (e) => { const a = []; for (let n = e; n && n !== pg; n = n.parentElement) a.unshift(key(n)); return a.slice(-3).join(' > '); };
		const items = { text: [], rules: [], boxes: [] };
		for (const e of pg.querySelectorAll('*')) {
			if (e.closest('svg') && e.tagName.toLowerCase() !== 'svg') continue;
			const r = e.getBoundingClientRect();
			if (r.width === 0 && r.height === 0) continue;
			const cs = getComputedStyle(e);
			if (cs.visibility === 'hidden' || cs.display === 'none') continue;
			const own = [...e.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim());
			if (own.length) {
				const rg = document.createRange();
				rg.setStartBefore(own[0]); rg.setEndAfter(own[own.length - 1]);
				const tb = rg.getBoundingClientRect();
				items.text.push({ p: path(e), t: own.map((n) => n.textContent.trim()).join(' ').slice(0, 28), tl: X(tb.left), tr: X(tb.right), tt: Y(tb.top), tbm: Y(tb.bottom), el: X(r.left), er: X(r.right), et: Y(r.top), eb: Y(r.bottom), w: Math.round((r.width / k) * 100) / 100,
					fs: cs.fontSize, fw: cs.fontWeight, lh: cs.lineHeight, col: cs.color, ff: cs.fontFamily.split(',')[0].replace(/"/g, ''), st: cs.fontStyle, ls: cs.letterSpacing, tt2: cs.textTransform, ti: cs.textIndent, ta: cs.textAlign, mt: cs.marginTop, mb: cs.marginBottom, pl: cs.paddingLeft, pr: cs.paddingRight, ct: cs.fontVariantCaps });
			}
			const bt = parseFloat(cs.borderTopWidth), bb = parseFloat(cs.borderBottomWidth), bl = parseFloat(cs.borderLeftWidth), br2 = parseFloat(cs.borderRightWidth);
			const bg = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent';
			const thin = bg && (r.height / k <= 2.5 || r.width / k <= 2.5);
			if (e.tagName === 'HR' || thin || bt > 0 || bb > 0) items.rules.push({ p: path(e), t: Y(r.top), b: Y(r.bottom), l: X(r.left), r: X(r.right), bt: cs.borderTopWidth + ' ' + cs.borderTopColor, bb: cs.borderBottomWidth + ' ' + cs.borderBottomColor, bg: bg ? cs.backgroundColor : '' });
			const rad = cs.borderTopLeftRadius;
			if ((parseFloat(rad) > 0 || bl > 0 || br2 > 0 || e.hasAttribute('data-blank-state')) && (bg || bl > 0 || bt > 0 || e.hasAttribute('data-blank-state')) && r.height / k > 4) items.boxes.push({ p: path(e), t: Y(r.top), b: Y(r.bottom), l: X(r.left), r: X(r.right), rad, border: cs.borderTopWidth + ' ' + cs.borderLeftWidth + ' ' + cs.borderTopColor, bg: bg ? cs.backgroundColor : '', sh: cs.boxShadow === 'none' ? '' : cs.boxShadow.slice(0, 40) });
		}
		const frame = (sel) => { const e = pg.querySelector(sel); if (!e) return null; const r = e.getBoundingClientRect(); return { t: Y(r.top), b: Y(r.bottom), l: X(r.left), r: X(r.right) }; };
		sheets.push({ w: pg.offsetWidth, h: pg.offsetHeight, scale: k, bg: getComputedStyle(pg).backgroundColor, rule: frame('.header-rule'), hair: frame('.footer-hairline'), footer: frame('.page-footer'), items });
	}
	return sheets;
}

async function settle(page, ms) {
	let last = '';
	for (let i = 0; i < 40; i++) {
		const sig = JSON.stringify(await page.evaluate(readSheets));
		if (sig === last) return;
		last = sig;
		await page.waitForTimeout(ms);
	}
}

const DOCS = ['text', 'markup', 'insights'];
// Placeholder state: a bass with only three vowels sampled, so "To complete your personal vowel space ..." is drawn (MELODY's header note, INSIGHTS' note block).
const fewFormants = {};
for (const v of ['i', 'a', 'u']) fewFormants[v] = formants[v];
const voiceFew = JSON.stringify({ ...JSON.parse(voice), voices: [{ ...JSON.parse(voice).voices[0], formants: fewFormants }] });
const browser = await chromium.launch();
const out = {};
for (const language of ['en', 'fr']) for (const width of [1024, 390]) for (const scenario of ['score', 'blank', 'placeholder']) {
	const cond = `${language}-${width}-${scenario}`;
	if (ONLY && !ONLY.some((o) => cond.includes(o))) continue;
	const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 1366 }, deviceScaleFactor: 2, isMobile: width === 390, hasTouch: width === 390, storageState: path.resolve(process.cwd(), 'e2e/returning-browser.storage.json') });
	await context.addInitScript(([l, s]) => { localStorage.setItem('ilya:welcomeSeen', '1'); localStorage.setItem('ilya:language', l); localStorage.setItem('shane.profiles.v2', s); }, [language, scenario === 'placeholder' ? voiceFew : voice]);
	const page = await context.newPage();
	await page.goto(BASE + '/');
	await page.locator('textarea.text-input').waitFor();
	await page.waitForFunction(() => !document.querySelector('textarea.text-input').disabled, null, { timeout: 90000 });
	if (scenario !== 'blank') { await page.locator('input[type="file"].hidden-input').setInputFiles(`${FIX}/tchaikovsky-op38-3-voice.musicxml`); await page.waitForTimeout(8000); }
	for (const d of (scenario === 'placeholder' ? ['markup', 'insights'] : DOCS)) {
		await page.evaluate((x) => document.querySelector(`#tab-${x}`)?.click(), d);
		await page.waitForTimeout(d === 'markup' && scenario === 'score' ? 12000 : 7000);
		await page.keyboard.press('Escape');
		await page.evaluate(() => document.activeElement?.blur?.());
		await page.waitForTimeout(500);
		await settle(page, 1500);
		const sheets = await page.evaluate(readSheets);
		const want = scenario === 'placeholder' ? [1] : scenario === 'score' ? [1, 2, Math.min(sheets.length, 3)].filter((v, i, a) => a.indexOf(v) === i) : [1];
		for (const n of want) {
			const el = page.locator('.paper-page:visible').nth(n - 1);
			if (!(await el.count())) continue;
			await el.scrollIntoViewIfNeeded();
			await page.waitForTimeout(400);
			await el.screenshot({ path: path.join(HERE, 'pics', `${WHICH}-${d}-${scenario}-${language}-p${n}-${width}.png`) });
		}
		out[`${cond}/${d}`] = { pages: sheets.length, sheets };
		console.log(cond, d, sheets.length, 'sheets');
	}
	await context.close();
}
await browser.close();
const f = path.join(HERE, `census-${WHICH}.json`);
fs.writeFileSync(f, JSON.stringify(out));
console.log('wrote', f);
