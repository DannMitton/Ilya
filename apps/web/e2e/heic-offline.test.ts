/**
 * ROW 113, amendment of Dann 2026-10-27 14:58 (singers with no data plan or wifi):
 * Ilya opened online once can open a HEIC offline, even if no HEIC was ever opened
 * online. The service worker fetches the decoder's files in the background after
 * the app shell is cached (static/sw.js, DECODER_FILES).
 *
 * The service worker registers only on a production build and not on `localhost`
 * (app.html), so this serves `build/` itself on 127.0.0.2, which is still a secure
 * context. Build first:
 *
 *     pnpm --filter @ilya/web build
 *     pnpm --filter @ilya/web exec playwright test --project=chromium heic-offline
 */
import { test, expect } from '@playwright/test';
import { createServer, type Server } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const BUILD = join(process.cwd(), 'build');
const HOST = '127.0.0.2';
const PORT = 4173;
const TYPES: Record<string, string> = {
	'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
	'.json': 'application/json', '.wasm': 'application/wasm', '.png': 'image/png', '.svg': 'image/svg+xml',
	'.txt': 'text/plain', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2'
};

let server: Server;

test.beforeAll(async () => {
	test.skip(!existsSync(join(BUILD, 'sw.js')), 'run `pnpm --filter @ilya/web build` first');
	server = createServer((req, res) => {
		const path = normalize(decodeURIComponent(new URL(req.url!, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
		let file = join(BUILD, path);
		if (!file.startsWith(BUILD) || !existsSync(file) || !statSync(file).isFile()) file = join(BUILD, 'index.html');
		res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
		res.end(readFileSync(file));
	});
	await new Promise<void>((ok) => server.listen(PORT, HOST, ok));
});
test.afterAll(() => server?.close());

test('a singer offline who never opened a HEIC can open one', async ({ browser }) => {
	test.setTimeout(180_000);
	const context = await browser.newContext({ baseURL: `http://${HOST}:${PORT}`, viewport: { width: 1440, height: 900 } });
	const page = await context.newPage();
	const logs: string[] = [];
	page.on('console', (m) => logs.push(m.text()));
	await page.goto('/');
	await page.evaluate(() => navigator.serviceWorker.ready);
	// the background fetch starts a few seconds after the shell is cached
	const FILES = ['/heif/libheif.wasm', '/heif/LICENSE-libheif.txt'];
	await expect
		.poll(
			() => page.evaluate(async (urls) => (await Promise.all(urls.map((u) => caches.match(u)))).every(Boolean), FILES),
			{ timeout: 60_000 }
		)
		.toBe(true);
	const cached = await page.evaluate(async () => {
		const keys = await caches.keys();
		const urls: string[] = [];
		for (const k of keys) for (const r of await (await caches.open(k)).keys()) urls.push(new URL(r.url).pathname);
		return urls.filter((u) => u.startsWith('/heif/') || /\/_app\/immutable\/chunks\//.test(u));
	});
	console.log(`cached before going offline (decoder files and chunks): ${cached.length} entries`);

	// The first load ran before the worker controlled the page, so the app's own files were not
	// cached by it. One more online visit, as any returning singer has made, caches them.
	await page.reload();
	await page.locator('input.hidden-input').waitFor({ state: 'attached', timeout: 60_000 });
	await page.waitForLoadState('networkidle');
	await context.setOffline(true);
	await page.reload();
	await page.locator('input.hidden-input').waitFor({ state: 'attached', timeout: 60_000 });
	await page.locator('input.hidden-input').setInputFiles('src/lib/reader/fixtures/staff-page.heic');
	await expect(
		page.getByText(/Ilya is reading the notes off your page|Reading the page/).first()
	).toBeVisible({ timeout: 60_000 });
	const refusals = page.getByText(/cannot yet open iPhone photos in HEIC|This browser cannot open that picture/);
	await expect(refusals).toHaveCount(0);
	expect(logs.filter((l) => l.includes('IMAGE_UNDECODABLE'))).toEqual([]);
	await context.close();
});
