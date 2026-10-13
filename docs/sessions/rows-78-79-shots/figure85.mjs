// Row 85 (2026-10-12): the Insights pitch figure at 390 px, each language: a picture, and every text's box checked
// against every other text and the figure's own edges (a label that overlaps or is clipped is reported).
// Usage: node figure85.mjs <outdir> <song: sunless|tchaikovsky> <lang>
import { createRequire } from 'module'; import path from 'path';
const REPO = path.resolve(process.env.HOME, 'Desktop/ilya-rewrite');
const require = createRequire(path.join(REPO, 'apps/web/package.json'));
const { chromium } = require('@playwright/test');
const [outdir, song, lang] = process.argv.slice(2);
const FIX = path.join(REPO, 'apps/web/src/lib/score/ingestion/fixtures');
const FIXTURE = { sunless: `${FIX}/sunless-01-engraved.musicxml`, tchaikovsky: `${FIX}/tchaikovsky-op38-3-voice.musicxml` }[song];
const P = (step, octave, alter = 0) => ({ step, octave, alter });
const FORMANTS = { i: [280, 2250], e: [400, 2100], 'ɪ': [330, 1900], 'ɨ': [350, 1500], 'ɛ': [520, 1800], a: [700, 1300], 'ɑ': [650, 1000], 'ʌ': [600, 1200], o: [450, 900], u: [240, 800] };
const formants = Object.fromEntries(Object.entries(FORMANTS).map(([v, [f1, f2]]) => [v, { f1, f2, confidence: 'high', f2Quality: 'clear', reading: 'captured', plausibility: 'plausible' }]));
const now = '2026-09-27T12:00:00.000Z';
const STORE = { version: 2, activeId: 'v', voices: [{ id: 'v', name: 'Dann', createdAt: now, updatedAt: now, calibratedAt: now, formants, voiceType: 'bass', characteristics: { rangeLow: P('B', 1, -1), rangeHigh: P('F', 4, 1), tessituraLow: P('B', 2), tessituraHigh: P('B', 3, -1), passaggioPrimary: P('A', 3), passaggioSecondary: P('D', 4, 1), source: 'manual' } }] };
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ serviceWorkers: 'block', viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true });
const page = await ctx.newPage();
await page.addInitScript(([l, s]) => { localStorage.setItem('ilya:language', l); localStorage.setItem('shane.profiles.v2', s); }, [lang, JSON.stringify(STORE)]);
await page.goto('http://localhost:5173/');
await page.waitForFunction(() => document.querySelector('input[type="file"].hidden-input'), null, { timeout: 90000 });
await page.waitForTimeout(4000);
await page.locator('input[type="file"].hidden-input').setInputFiles(FIXTURE);
await page.waitForTimeout(8000);
await page.evaluate(() => document.querySelector('#tab-insights')?.click());
await page.waitForTimeout(7000);
const fig = page.locator('.insights-flow .pitch-seconds').first();
await fig.scrollIntoViewIfNeeded();
await page.waitForTimeout(500);
await fig.screenshot({ path: path.join(outdir, `${song}-pitch-figure-${lang}-390.png`) });
const check = await fig.evaluate((el) => {
	const svg = el.querySelector('svg'); const sb = svg.getBoundingClientRect();
	const texts = [...svg.querySelectorAll('text')].map((t) => ({ text: t.textContent.trim(), r: t.getBoundingClientRect(), cls: t.classList.contains('line-name') ? 'line-name' : t.classList.contains('bracket-name') ? 'bracket-name' : '' }));
	const labels = texts.filter((t) => t.cls === 'line-name').map((t) => ({ text: t.text, left: Math.round(t.r.left - sb.left), right: Math.round(t.r.right - sb.left), svgWidth: Math.round(sb.width) }));
	const overlaps = [];
	for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
		const a = texts[i].r, b = texts[j].r;
		if (a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5) overlaps.push(`${texts[i].text} / ${texts[j].text}`);
	}
	const clipped = texts.filter((t) => t.r.right > sb.right + 0.5 || t.r.left < sb.left - 0.5 || t.r.top < sb.top - 0.5 || t.r.bottom > sb.bottom + 0.5).map((t) => t.text);
	return { labels, overlaps, clipped };
});
console.log(JSON.stringify({ song, lang, ...check }));
await browser.close();
