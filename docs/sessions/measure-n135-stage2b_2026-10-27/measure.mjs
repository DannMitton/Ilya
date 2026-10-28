/**
 * N.135 stage 2b: drives the built app in headless Chromium. For each PDF in a folder it opens the app with `?words=read` (or without it, with --off),
 * drops the PDF on the page, waits for the read, and writes the joined MusicXML and the Lyrics text to an output folder, with the console lines the read printed.
 * The desk scores these with the harness's scorer: syllables read right (of 2,538) and (b) exact, (a) nucleus, (c) word-exact seating (of 2,385), and the time per page.
 *
 * Usage (from the repository root, after a build with the underlay files in place, see apps/web/scripts/copy-underlay-model.mjs):
 *   node docs/sessions/measure-n135-stage2b_2026-10-27/measure.mjs --pdfs <folder> --out <folder> [--url http://localhost:4173] [--off] [--only <name part>] [--timeout-s 900]
 * With no --url it starts `vite preview` (port 4173) in apps/web and stops it at the end. The model and the core are NOT looked for here: they are served by the app from /omr/models/underlay/
 * (apps/web/src/lib/omr/underlay-recognize.ts); with them absent the fetch fails, the page answers null, the song is joined as today, and the MusicXML has no <lyric>.
 *
 * It writes, for each <name>.pdf: <name>.musicxml (what the page ingested), <name>.lyrics.txt (the Lyrics field), <name>.console.txt (every console line), and, once, times.json
 * (seconds from the drop to the MusicXML, and the [omr] lines that carry homr's and the underlay's times for each page).
 * Reads no held-out song: it reads the folder it is given and nothing else.
 */
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

const args = process.argv.slice(2);
const opt = (name, fallback) => (args.includes(`--${name}`) ? args[args.indexOf(`--${name}`) + 1] : fallback);
const pdfs = opt('pdfs');
const out = opt('out');
const off = args.includes('--off');
const only = opt('only', '');
const timeoutMs = Number(opt('timeout-s', '900')) * 1000;
if (!pdfs || !out) {
	console.error('usage: node measure.mjs --pdfs <folder> --out <folder> [--url <app>] [--off] [--only <name part>] [--timeout-s 900]');
	process.exit(2);
}
const root = resolve(new URL('../../..', import.meta.url).pathname);
const require = createRequire(join(root, 'apps/web/package.json'));
const { chromium } = require('@playwright/test');

let server = null;
let url = opt('url');
if (!url) {
	url = 'http://localhost:4173';
	server = spawn('pnpm', ['--filter', '@ilya/web', 'exec', 'vite', 'preview', '--port', '4173', '--strictPort'], { cwd: root, stdio: 'ignore' });
	for (let i = 0; i < 60; i++) {
		try {
			if ((await fetch(url)).ok) break;
		} catch {
			/* not up yet */
		}
		await new Promise((r) => setTimeout(r, 1000));
	}
}

mkdirSync(out, { recursive: true });
const browser = await chromium.launch(process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {});
const times = {};
for (const file of readdirSync(pdfs).filter((f) => f.toLowerCase().endsWith('.pdf') && f.includes(only)).sort()) {
	const name = basename(file, '.pdf');
	const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
	const page = await context.newPage();
	const lines = [];
	page.on('console', (m) => lines.push(`${((performance.now() - t0) / 1000).toFixed(1)}s ${m.type()}: ${m.text()}`));
	page.on('pageerror', (e) => lines.push(`pageerror: ${String(e).slice(0, 300)}`));
	// The page makes the MusicXML it ingests as a File (scan.ts, readingFile); keep its text.
	await page.addInitScript(() => {
		const Original = window.File;
		window.File = class extends Original {
			constructor(parts, fileName, options) {
				super(parts, fileName, options);
				if (options && options.type === 'application/vnd.recordare.musicxml+xml') new Blob(parts).text().then((t) => (window.__musicxml = t));
			}
		};
	});
	let t0 = performance.now();
	await page.goto(`${url}/${off ? '' : '?words=read'}`);
	await page.locator('textarea.text-input').waitFor({ state: 'visible', timeout: 60_000 });
	await page.waitForFunction(() => !document.querySelector('textarea.text-input')?.disabled, null, { timeout: 60_000 });
	t0 = performance.now();
	await page.locator('input[type="file"].hidden-input').setInputFiles(join(pdfs, file));
	let musicxml = null;
	try {
		await page.waitForFunction(() => typeof window.__musicxml === 'string', null, { timeout: timeoutMs });
		musicxml = await page.evaluate(() => window.__musicxml);
		await page.waitForTimeout(4000); // the page fills Lyrics from the score's words after the ingest
	} catch {
		lines.push('measure: no MusicXML arrived before the timeout');
	}
	const seconds = musicxml === null ? null : (performance.now() - t0) / 1000;
	const lyrics = await page.locator('textarea.text-input').inputValue().catch(() => '');
	if (musicxml !== null) writeFileSync(join(out, `${name}.musicxml`), musicxml);
	writeFileSync(join(out, `${name}.lyrics.txt`), lyrics);
	writeFileSync(join(out, `${name}.console.txt`), lines.join('\n') + '\n');
	times[name] = { seconds, lyricTags: musicxml === null ? null : (musicxml.match(/<lyric /g) ?? []).length, omr: lines.filter((l) => l.includes('[omr]')).map((l) => l.replace(/^\S+ \S+: /, '')) };
	console.log(`${name}: ${seconds === null ? 'no MusicXML' : `${seconds.toFixed(1)} s, ${times[name].lyricTags} <lyric> tags, Lyrics ${lyrics.length} characters`}`);
	await context.close();
}
writeFileSync(join(out, 'times.json'), JSON.stringify(times, null, 1));
await browser.close();
server?.kill();
