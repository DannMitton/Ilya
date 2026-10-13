// Rows 78a to 79 (2026-10-12, Code on the Mac): pictures of Text, Markup, and Insights on the dev server, adapted from
// row 66's shots66.mjs. A stored bass voice; with `three`, only [i], [a], and [ɑ] are sampled, so the other vowels are
// placeholders (row 69's set-up). Every page of the chosen document is saved, and its box measured.
// Usage: node shoot.mjs <outdir> <tag> <song: sunless|tchaikovsky> <doc: text|markup|insights> <lang: en|fr> [phone] [three] [sampled=i,a,u] [select=<css>]
// Prints the pages' boxes, and any placeholder sentence the page carries.
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path';
const REPO = path.resolve(process.env.HOME, 'Desktop/ilya-rewrite');
const require = createRequire(path.join(REPO, 'apps/web/package.json'));
const { chromium } = require('@playwright/test');
const [outdir, tag, song, doc, lang, ...flags] = process.argv.slice(2);
const phone = flags.includes('phone'); const three = flags.includes('three');
const sampled = flags.find((f) => f.startsWith('sampled='))?.slice(8).split(',') ?? (three ? ['i', 'a', 'ɑ'] : null);
const select = flags.find((f) => f.startsWith('select='))?.slice(7);
fs.mkdirSync(outdir, { recursive: true });
const FIX = path.join(REPO, 'apps/web/src/lib/score/ingestion/fixtures');
const FIXTURE = { sunless: `${FIX}/sunless-01-engraved.musicxml`, tchaikovsky: `${FIX}/tchaikovsky-op38-3-voice.musicxml` }[song];
const P = (step, octave, alter = 0) => ({ step, octave, alter });
const FORMANTS = { i: [280, 2250], e: [400, 2100], 'ɪ': [330, 1900], 'ɨ': [350, 1500], 'ɛ': [520, 1800], a: [700, 1300], 'ɑ': [650, 1000], 'ʌ': [600, 1200], o: [450, 900], u: [240, 800] };
const CH = { rangeLow: P('B', 1, -1), rangeHigh: P('F', 4, 1), tessituraLow: P('B', 2), tessituraHigh: P('B', 3, -1), passaggioPrimary: P('A', 3), passaggioSecondary: P('D', 4, 1), source: 'manual' };
function store() {
	const formants = {};
	for (const [v, [f1, f2]] of Object.entries(FORMANTS)) if (!sampled || sampled.includes(v)) formants[v] = { f1, f2, confidence: 'high', f2Quality: 'clear', reading: 'captured', plausibility: 'plausible' };
	const now = '2026-09-27T12:00:00.000Z';
	return { version: 2, activeId: 'v', voices: [{ id: 'v', name: 'Dann', createdAt: now, updatedAt: now, calibratedAt: now, formants, voiceType: 'bass', characteristics: CH }] };
}
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ serviceWorkers: 'block', ...(phone ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true } : { viewport: { width: 1440, height: 1300 } }) });
const page = await ctx.newPage();
const logs = []; page.on('console', (m) => logs.push(m.text()));
await page.addInitScript(([l, s]) => { localStorage.setItem('ilya:language', l); localStorage.setItem('shane.profiles.v2', s); }, [lang, JSON.stringify(store())]);
await page.goto('http://localhost:5173/');
await page.waitForFunction(() => document.querySelector('input[type="file"].hidden-input'), null, { timeout: 90000 });
await page.waitForTimeout(phone ? 4000 : 1500);
await page.locator('input[type="file"].hidden-input').setInputFiles(FIXTURE);
await page.waitForTimeout(7000);
await page.evaluate((d) => document.querySelector(`#tab-${d}`)?.click(), doc);
await page.waitForTimeout(doc === 'markup' ? 9000 : 6000);
await page.addStyleTag({ content: '.desk-head{visibility:hidden !important}' });
const container = { text: '.text-paper-container, .paper-container', markup: '.markup-paper-container', insights: '.insights-container' }[doc];
const sel = select ?? (phone && doc === 'insights'
	? '.insights-flow .flow-head:visible, .insights-flow .flow-body > *:visible, .insights-flow .flow-foot:visible'
	: `${container} .paper-page:visible`);
const pages = page.locator(sel);
const n = await pages.count();
const boxes = []; const withPlaceholder = [];
for (let i = 0; i < n; i++) {
	await pages.nth(i).scrollIntoViewIfNeeded();
	boxes.push(await pages.nth(i).boundingBox());
	if (/placeholder value for|valeur par défaut pour/.test(await pages.nth(i).innerText())) withPlaceholder.push(i + 1);
	await pages.nth(i).screenshot({ path: path.join(outdir, `${tag}-${song}-${doc}-${lang}${phone ? '-phone' : ''}-p${i + 1}.png`) });
}
const ph = await page.evaluate(() => [...document.body.innerText.matchAll(/[^.]*(placeholder value for|valeur par défaut pour)[^.]*\./g)].map((m) => m[0].trim()));
console.log(JSON.stringify({ song, doc, lang, phone, sampled, pages: n, withPlaceholder, boxes, placeholderSentences: ph }));
await browser.close();
