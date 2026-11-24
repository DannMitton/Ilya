// Families 3, 4, 5: INSIGHTS, the printed pages, an exported .ilya binder and the saved-voice store, driven through the real built app.
// usage: node live-capture.mjs <repo root> <out dir>      (needs `pnpm --filter @ilya/web build` done and Chromium)
// Inputs, all fixed: the built app; two tracked scores; the stored voice below (the typed-range voice the e2e suite uses, `source: 'manual'`,
// with fixed dates); the browser clock fixed to 2026-11-24T12:00:00Z; the welcome-sheet flag set; viewport 1440 x 1300 (INSIGHTS) and 1440 x 900 (print).
// NO capture stub and NO recorder voice is used.
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { createHash } from 'node:crypto';
const [root, out] = process.argv.slice(2);
const web = join(root, 'apps/web');
const { chromium } = createRequire(join(web, 'package.json'))('@playwright/test');
const FIXED = new Date('2026-11-24T12:00:00.000Z');
const sha = (b) => createHash('sha256').update(b).digest('hex');
const P = (step, octave, alter = 0) => ({ step, octave, alter });
const FORMANTS = { i: [280, 2250], e: [400, 2100], 'ɪ': [330, 1900], 'ɨ': [350, 1500], 'ɛ': [520, 1800], a: [700, 1300], 'ɑ': [650, 1000], 'ʌ': [600, 1200], o: [450, 800], u: [320, 750] };
const iso = '2026-11-01T09:00:00.000Z';
const formants = {};
for (const [v, [f1, f2]] of Object.entries(FORMANTS)) formants[v] = { f1, f2, confidence: 'high', f2Quality: 'clear', reading: 'captured', plausibility: 'plausible' };
const VOICE = { version: 2, activeId: 'v-test', voices: [{ id: 'v-test', name: 'Voice 1', createdAt: iso, updatedAt: iso, calibratedAt: iso, formants, voiceType: 'bass', characteristics: { rangeLow: P('D', 2), rangeHigh: P('F', 4), tessituraLow: P('G', 2), tessituraHigh: P('D', 4), passaggioPrimary: P('A', 3), passaggioSecondary: P('E', 4, -1), source: 'manual' } }] };
const SCORES = [['sunless-01-engraved', 'apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml'], ['tchaikovsky-op38-3-voice', 'apps/web/src/lib/score/ingestion/fixtures/tchaikovsky-op38-3-voice.musicxml']];
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.wasm': 'application/wasm', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.txt': 'text/plain', '.onnx': 'application/octet-stream' };
const buildDir = join(web, 'build');
const server = createServer((req, res) => {
	const p = decodeURIComponent((req.url ?? '/').split('?')[0]);
	let f = join(buildDir, p);
	if (!f.startsWith(buildDir) || !existsSync(f) || statSync(f).isDirectory()) f = join(buildDir, 'index.html');
	res.writeHead(200, { 'content-type': MIME[extname(f)] ?? 'application/octet-stream' });
	res.end(readFileSync(f));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch(process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {});
const log = [];
const note = (m) => { log.push(m); console.log(m); };
const dir3 = join(out, 'family3-insights'), dir4 = join(out, 'family4-print'), dir5 = join(out, 'family5-binder-voice');
for (const d of [dir3, dir4, dir5]) mkdirSync(d, { recursive: true });

async function open(lang, scorePath, height) {
	const ctx = await browser.newContext({ viewport: { width: 1440, height } });
	await ctx.clock.setFixedTime(FIXED);
	await ctx.addInitScript(([l, store]) => { try { localStorage.setItem('ilya:welcomeSeen', '1'); localStorage.setItem('ilya:language', l); localStorage.setItem('shane.profiles.v2', store); } catch {} }, [lang, JSON.stringify(VOICE)]);
	const page = await ctx.newPage();
	await page.goto(base + '/');
	await page.locator('textarea.text-input').waitFor({ state: 'visible' });
	await page.waitForFunction(() => !document.querySelector('textarea.text-input')?.disabled, null, { timeout: 60_000 });
	await page.locator('input[type="file"].hidden-input').setInputFiles(join(root, scorePath));
	await page.locator('.receipt-score').waitFor({ state: 'visible', timeout: 30_000 });
	await page.waitForSelector('[data-word-index="0-0"]', { timeout: 30_000 }).catch(() => note(`  (no first word on ${scorePath})`));
	return { ctx, page };
}

for (const lang of ['en', 'fr']) {
	// Family 3: INSIGHTS, per score, per language.
	for (const [name, path] of SCORES) {
		const { ctx, page } = await open(lang, path, 1300);
		try {
			await page.locator('#tab-insights').click();
			await page.locator('.insights-container .paper-page').first().waitFor({ state: 'visible', timeout: 30_000 });
			await page.locator('.insights-container .pitch-seconds svg').first().waitFor({ state: 'visible', timeout: 15_000 }).catch(() => note(`  (${name} ${lang}: no pitch-seconds figure drawn)`));
			await page.waitForTimeout(1_500);
			const html = await page.locator('.insights-container').evaluate((e) => e.outerHTML);
			const text = await page.locator('.insights-container').evaluate((e) => e.innerText);
			writeFileSync(join(dir3, `${name}.${lang}.insights.html`), html);
			writeFileSync(join(dir3, `${name}.${lang}.insights.txt`), text);
			note(`family 3: ${name} ${lang}: ${html.length} bytes html, ${text.length} chars text`);
		} catch (e) { note(`family 3: ${name} ${lang}: FAILED ${String(e.message).split('\n')[0]}`); }
		await ctx.close();
	}
	// Families 4 and 5 on the engraved score.
	const { ctx, page } = await open(lang, SCORES[0][1], 900);
	try {
		for (const tab of ['text', 'markup', 'insights']) {
			await page.locator(`#tab-${tab}`).click();
			await page.waitForTimeout(2_500);
			const sheets = await page.locator('.paper-page:visible').count();
			const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true });
			const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;
			writeFileSync(join(dir4, `${tab}.${lang}.pdf`), pdf);
			const sheetsHtml = await page.locator('.paper-page:visible').evaluateAll((els) => els.map((e) => e.outerHTML).join('\n<!-- ilya-baseline: sheet break -->\n'));
			writeFileSync(join(dir4, `${tab}.${lang}.sheets.html`), sheetsHtml);
			note(`family 4: ${tab} ${lang}: ${sheets} sheets on screen, ${pages} pdf pages, pdf ${pdf.length} bytes sha256 ${sha(pdf).slice(0, 12)}`);
		}
		const rep = page.getByRole('button', { name: /^r[eé]pertoire$/i }).and(page.locator(':not([data-link])'));
		if ((await rep.first().getAttribute('aria-expanded')) !== 'true') await rep.first().click();
		const band = page.getByRole('button', { name: /^(export and import|exportation et importation)$/i }).and(page.locator(':not([data-link])'));
		if ((await band.first().getAttribute('aria-expanded')) !== 'true') await band.first().click();
		const label = lang === 'en' ? 'Export this song' : 'Exporter ce chant';
		const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 30_000 }), page.getByRole('button', { name: label, exact: true }).first().click()]);
		const name = dl.suggestedFilename();
		await dl.saveAs(join(dir5, `binder.${lang}.ilya`));
		writeFileSync(join(dir5, `binder.${lang}.suggested-filename.txt`), name + '\n');
		const store = await page.evaluate(() => localStorage.getItem('shane.profiles.v2'));
		writeFileSync(join(dir5, `saved-voice.${lang}.json`), store ?? 'null');
		note(`family 5: ${lang}: binder "${name}" ${statSync(join(dir5, `binder.${lang}.ilya`)).size} bytes; voice store ${store?.length ?? 0} chars`);
	} catch (e) { note(`family 4/5 ${lang}: FAILED ${String(e.message).split('\n')[0]}`); }
	await ctx.close();
}
writeFileSync(join(out, 'live-capture.log'), log.join('\n') + '\n');
await browser.close();
server.close();
