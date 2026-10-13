// Row 79 (2026-10-12, Code on the Mac): every page of Text, Markup, or Insights on the dev server, measured and pictured.
// Per page, in CSS px from the page's top: where the content begins (below the running head, or the page's own top block),
// where it ends (the lowest visible ink that is not the head or the footer), and where the footer's first line begins
// (its apparatus, legend, or hairline, whichever is highest). Empty share = (footer - content end) / (footer - content top).
// A fully sampled bass voice, desktop 1440 px. Usage: node pages.mjs <outdir> <tag> <song> <doc: text|markup|insights> <lang> [noshots]
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path';
const REPO = path.resolve(process.env.HOME, 'Desktop/ilya-rewrite');
const require = createRequire(path.join(REPO, 'apps/web/package.json'));
const { chromium } = require('@playwright/test');
const [outdir, tag, song, doc, lang, ...flags] = process.argv.slice(2);
fs.mkdirSync(outdir, { recursive: true });
const FIX = path.join(REPO, 'apps/web/src/lib/score/ingestion/fixtures');
const FIXTURE = { sunless: `${FIX}/sunless-01-engraved.musicxml`, tchaikovsky: `${FIX}/tchaikovsky-op38-3-voice.musicxml` }[song];
const P = (step, octave, alter = 0) => ({ step, octave, alter });
const FORMANTS = { i: [280, 2250], e: [400, 2100], 'ɪ': [330, 1900], 'ɨ': [350, 1500], 'ɛ': [520, 1800], a: [700, 1300], 'ɑ': [650, 1000], 'ʌ': [600, 1200], o: [450, 900], u: [240, 800] };
const CH = { rangeLow: P('B', 1, -1), rangeHigh: P('F', 4, 1), tessituraLow: P('B', 2), tessituraHigh: P('B', 3, -1), passaggioPrimary: P('A', 3), passaggioSecondary: P('D', 4, 1), source: 'manual' };
const formants = Object.fromEntries(Object.entries(FORMANTS).map(([v, [f1, f2]]) => [v, { f1, f2, confidence: 'high', f2Quality: 'clear', reading: 'captured', plausibility: 'plausible' }]));
const now = '2026-09-27T12:00:00.000Z';
const STORE = { version: 2, activeId: 'v', voices: [{ id: 'v', name: 'Dann', createdAt: now, updatedAt: now, calibratedAt: now, formants, voiceType: 'bass', characteristics: CH }] };
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ serviceWorkers: 'block', viewport: { width: 1440, height: 1300 } });
const page = await ctx.newPage();
await page.addInitScript(([l, s]) => { localStorage.setItem('ilya:language', l); localStorage.setItem('shane.profiles.v2', s); }, [lang, JSON.stringify(STORE)]);
await page.goto('http://localhost:5173/');
await page.waitForFunction(() => document.querySelector('input[type="file"].hidden-input'), null, { timeout: 90000 });
await page.waitForTimeout(1500);
await page.locator('input[type="file"].hidden-input').setInputFiles(FIXTURE);
await page.waitForTimeout(8000);
await page.evaluate((d) => document.querySelector(`#tab-${d}`)?.click(), doc);
await page.waitForTimeout(doc === 'markup' ? 10000 : 7000);
const pages = page.locator('.paper-page:visible');
const n = await pages.count();
const rows = [];
for (let i = 0; i < n; i++) {
	const el = pages.nth(i);
	await el.scrollIntoViewIfNeeded();
	const m = await el.evaluate((pg) => {
		const pr = pg.getBoundingClientRect();
		const rel = (r) => ({ t: r.top - pr.top, b: r.bottom - pr.top });
		// A closed <details>' body is laid out but not painted: not content (its summary is).
		const skip = (e) => e.closest('.page-footer, .running-header, .tab-mark') || (e.closest('details:not([open])') && !e.closest('summary'));
		let top = Infinity, bottom = -Infinity;
		for (const e of pg.querySelectorAll('*')) {
			if (skip(e) || e.children.length > 0 && !(e instanceof SVGElement)) continue; // leaves, and whole SVGs
			if (e instanceof SVGElement && e.tagName !== 'svg') continue;
			const cs = getComputedStyle(e);
			if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) continue;
			const r = e.getBoundingClientRect();
			if (r.width < 1 || r.height < 1 || r.height > pr.height * 0.95) continue;
			const q = rel(r);
			// Row 79: a block broken between lines shows in a clipping window (`.part`); what it hides is not on this page.
			const clip = e.closest('.part');
			if (clip) { const c = rel(clip.getBoundingClientRect()); q.t = Math.max(q.t, c.t); q.b = Math.min(q.b, c.b); if (q.b <= q.t) continue; }
			top = Math.min(top, q.t); bottom = Math.max(bottom, q.b);
		}
		const head = pg.querySelector('.running-header');
		const contentTop = head ? rel(head.getBoundingClientRect()).b : top;
		let footer = pr.height;
		const f = pg.querySelector('.page-footer');
		if (f) for (const c of f.querySelectorAll('.apparatus > *, .provenance-legend, .broad-legend, .footer-hairline')) {
			const r = c.getBoundingClientRect(); if (r.height > 0) footer = Math.min(footer, r.top - pr.top);
		}
		return { height: Math.round(pr.height), contentTop: Math.round(contentTop), contentEnd: Math.round(bottom), footer: Math.round(footer), systems: pg.querySelectorAll('[data-system]').length };
	});
	m.empty = m.footer - m.contentEnd; m.share = Math.round((1000 * m.empty) / (m.footer - m.contentTop)) / 10;
	rows.push(m);
	if (!flags.includes('noshots')) await el.screenshot({ path: path.join(outdir, `${tag}-${song}-${doc}-${lang}-p${i + 1}.png`) });
}
console.log(JSON.stringify({ song, doc, lang, pages: n, rows }));
await browser.close();
