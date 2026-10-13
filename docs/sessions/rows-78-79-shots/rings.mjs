// Row 78c (2026-10-12, Code on the Mac): the red crossing rings on Markup, measured on the live page (localhost:5173).
// For each ring, in its system's own units: its box; whether it lies inside the system's viewBox; the horizontal gap to
// the nearest ink of any other note that shares its height (negative = overlap); the gap from its bottom to the ink top of
// the Cyrillic below it (canvas glyph metrics, not the text box). Also the systems on each page. With `shots`, pictures of the first crossing, unselected and
// selected (the note clicked), desktop and phone.
// Usage: node rings.mjs <outdir> <tag> <song: sunless|tchaikovsky> [three] [shots] [ring=<note id>, to picture that crossing]
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path';
const REPO = path.resolve(process.env.HOME, 'Desktop/ilya-rewrite');
const require = createRequire(path.join(REPO, 'apps/web/package.json'));
const { chromium } = require('@playwright/test');
const [outdir, tag, song, ...flags] = process.argv.slice(2);
const three = flags.includes('three'); const pick = flags.find((f) => f.startsWith('ring='))?.slice(5); const shots = flags.includes('shots') || !!pick;
fs.mkdirSync(outdir, { recursive: true });
const FIX = path.join(REPO, 'apps/web/src/lib/score/ingestion/fixtures');
const FIXTURE = { sunless: `${FIX}/sunless-01-engraved.musicxml`, tchaikovsky: `${FIX}/tchaikovsky-op38-3-voice.musicxml` }[song];
const P = (step, octave, alter = 0) => ({ step, octave, alter });
const FORMANTS = { i: [280, 2250], e: [400, 2100], 'ɪ': [330, 1900], 'ɨ': [350, 1500], 'ɛ': [520, 1800], a: [700, 1300], 'ɑ': [650, 1000], 'ʌ': [600, 1200], o: [450, 900], u: [240, 800] };
const CH = { rangeLow: P('B', 1, -1), rangeHigh: P('F', 4, 1), tessituraLow: P('B', 2), tessituraHigh: P('B', 3, -1), passaggioPrimary: P('A', 3), passaggioSecondary: P('D', 4, 1), source: 'manual' };
function store() {
	const formants = {};
	for (const [v, [f1, f2]] of Object.entries(FORMANTS)) if (!three || ['i', 'a', 'ɑ'].includes(v)) formants[v] = { f1, f2, confidence: 'high', f2Quality: 'clear', reading: 'captured', plausibility: 'plausible' };
	const now = '2026-09-27T12:00:00.000Z';
	return { version: 2, activeId: 'v', voices: [{ id: 'v', name: 'Dann', createdAt: now, updatedAt: now, calibratedAt: now, formants, voiceType: 'bass', characteristics: CH }] };
}
async function open(browser, phone) {
	const ctx = await browser.newContext({ serviceWorkers: 'block', ...(phone ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true } : { viewport: { width: 1440, height: 1300 }, deviceScaleFactor: 2 }) });
	const page = await ctx.newPage();
	await page.addInitScript(([s]) => { localStorage.setItem('ilya:language', 'en'); localStorage.setItem('shane.profiles.v2', s); }, [JSON.stringify(store())]);
	await page.goto('http://localhost:5173/');
	await page.waitForFunction(() => document.querySelector('input[type="file"].hidden-input'), null, { timeout: 90000 });
	await page.waitForTimeout(phone ? 4000 : 1500);
	await page.locator('input[type="file"].hidden-input').setInputFiles(FIXTURE);
	await page.waitForTimeout(7000);
	await page.evaluate(() => document.querySelector('#tab-markup')?.click());
	await page.waitForFunction(() => document.querySelectorAll('.markup-paper-container [data-system]').length > 0, null, { timeout: 60000 });
	await page.waitForTimeout(6000);
	return { ctx, page };
}
const measure = () => {
	const out = { rings: [], pages: [] };
	for (const pg of document.querySelectorAll('.markup-paper-container .paper-page')) {
		const n = pg.querySelectorAll('[data-system]').length;
		if (n) out.pages.push(n);
	}
	const user = (el, svg) => {
		const r = el.getBoundingClientRect(); const m = svg.getScreenCTM().inverse();
		const p = (x, y) => { const q = new DOMPoint(x, y).matrixTransform(m); return [q.x, q.y]; };
		const [l, t] = p(r.left, r.top); const [rr, b] = p(r.right, r.bottom);
		return { l, t, r: rr, b };
	};
	const r2 = (v) => Math.round(v * 10) / 10;
	for (const ring of document.querySelectorAll('.markup-paper-container [data-crossing-ring]')) {
		const svg = ring.closest('[data-system]');
		const box = user(ring, svg);
		const vb = svg.getAttribute('viewBox').split(/\s+/).map(Number);
		const sw = Number(ring.getAttribute('stroke-width')) / 2;
		const outer = { l: box.l, t: box.t, r: box.r, b: box.b }; // getBoundingClientRect includes the stroke
		// The note it encloses: the hit rectangle whose centre is nearest the ring's.
		let id = ring.getAttribute('data-crossing-of'), best = id ? -1 : Infinity; // the ring's own handle since row 78c; before it, the nearest hit
		for (const h of svg.querySelectorAll('[data-hit]')) {
			const hb = user(h, svg); const d = Math.abs((hb.l + hb.r) / 2 - (outer.l + outer.r) / 2);
			if (best >= 0 && d < best) { best = d; id = h.getAttribute('data-hit'); }
		}
		const own = (el) =>
			el.closest(`[data-event-id="${CSS.escape(id ?? '')}"]`) || [el.getAttribute('data-ipa-of'), el.getAttribute('data-of-event'), el.getAttribute('data-withheld')].includes(id);
		let gap = Infinity, gapWhat = null, cyrGap = Infinity;
		for (const el of svg.querySelectorAll('text, path, ellipse, line, rect, circle, polygon, polyline, use')) {
			if (el === ring || el.closest('[data-crossing-ring],[data-selection-ring],[data-hit]') || el.hasAttribute('data-hit')) continue;
			if (el.tagName === 'rect' && el.getAttribute('fill') === 'none' && !el.getAttribute('stroke')) continue;
			const b = user(el, svg);
			if (!(b.r > b.l || b.b > b.t)) continue;
			if (el.tagName === 'line' && b.r - b.l > 60 && b.b - b.t < 3) continue; // staff lines run through every ring
			const cyr = el.tagName === 'text' && /[Ѐ-ӿ]/.test(el.textContent);
			if (cyr && b.r > outer.l && b.l < outer.r && b.t >= outer.b - 2) {
				// The glyphs' INK top, not the text box's (which is the face's ascent): canvas metrics in the element's own font.
				const cs = getComputedStyle(el); const c = (window.__cv ??= document.createElement('canvas').getContext('2d'));
				c.font = `${cs.fontStyle} ${cs.fontWeight} ${el.getAttribute('font-size') ?? cs.fontSize}${/^\d+(\.\d+)?$/.test(el.getAttribute('font-size') ?? '') ? 'px' : ''} ${cs.fontFamily}`;
				const inkTop = Number(el.getAttribute('y')) - c.measureText(el.textContent).actualBoundingBoxAscent;
				cyrGap = Math.min(cyrGap, inkTop - outer.b);
			}
			if (own(el) || cyr) continue;
			if (b.l >= outer.l && b.r <= outer.r && b.t >= outer.t && b.b <= outer.b) continue; // ink the ring encloses (a ledger line of its own note) is not a neighbour
			if (b.b <= outer.t || b.t >= outer.b) continue;
			const g = Math.max(b.l - outer.r, outer.l - b.r);
			if (g < gap) { gap = g; gapWhat = `${el.tagName}${el.getAttribute('data-analysis') ? ':' + el.getAttribute('data-analysis') : ''}${el.textContent?.trim() ? ' "' + el.textContent.trim().slice(0, 8) + '"' : ''} [${[...el.attributes].map((a) => a.name + '=' + a.value).join(' ').slice(0, 120)}] in ${el.parentElement?.getAttribute('data-event-id') ?? el.parentElement?.tagName}`; }
		}
		out.rings.push({
			id, x: r2(outer.l), y: r2(outer.t), w: r2(outer.r - outer.l), h: r2(outer.b - outer.t), rx: ring.getAttribute('rx'),
			insideViewBox: outer.l >= vb[0] - 0.01 && outer.t >= vb[1] - 0.01 && outer.r <= vb[0] + vb[2] + 0.01 && outer.b <= vb[1] + vb[3] + 0.01,
			topMargin: r2(outer.t - vb[1]), gap: r2(gap), gapWhat, cyrGap: Number.isFinite(cyrGap) ? r2(cyrGap) : null,
		});
	}
	return out;
};
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const { ctx, page } = await open(browser, false);
const m = await page.evaluate(measure);
console.log(JSON.stringify({ song, tag, three, ...m }));
if (shots && m.rings.length) {
	for (const phone of [false, true]) {
		const { ctx: c2, page: p2 } = phone ? await open(browser, true) : { ctx: null, page };
		const k = pick ? Math.max(0, m.rings.findIndex((r) => r.id === pick)) : 0;
		const ring = p2.locator('.markup-paper-container [data-crossing-ring]').nth(k);
		await ring.scrollIntoViewIfNeeded(); await p2.waitForTimeout(500);
		const clip = async () => { const b = await ring.boundingBox(); return { x: Math.max(0, b.x - (phone ? 70 : 140)), y: Math.max(0, b.y - (phone ? 60 : 110)), width: b.width + (phone ? 140 : 280), height: b.height + (phone ? 120 : 220) }; };
		const name = (s) => path.join(outdir, `${tag}-${song}${pick ? '-' + pick : ''}-${phone ? 'phone' : 'desktop'}-${s}.png`);
		await p2.screenshot({ path: name('unselected'), clip: await clip() });
		const id = m.rings[k].id;
		const hit = p2.locator(`[data-hit="${id}"]`).first();
		await hit.dispatchEvent('click'); await p2.waitForTimeout(1200);
		const sel = await p2.evaluate(() => document.querySelectorAll('.markup-paper-container [data-selection-ring]').length);
		await ring.scrollIntoViewIfNeeded(); await p2.waitForTimeout(400);
		await p2.screenshot({ path: name('selected'), clip: await clip() });
		console.log(JSON.stringify({ shot: phone ? 'phone' : 'desktop', selectionRings: sel }));
		if (c2) await c2.close();
	}
}
await ctx.close(); await browser.close();
