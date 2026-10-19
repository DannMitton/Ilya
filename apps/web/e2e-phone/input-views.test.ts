/**
 * N.135 STAGE 3. INPUT'S TWO VIEWS, POEM AND LYRICS, AT PHONE WIDTH.
 *
 * Run it (the `phone` project is the only one that reads this directory):
 *
 *     pnpm --filter @ilya/web exec playwright test --project=phone input-views
 *
 * WHAT IT MEASURES, in the order the brief's "done when" asks: the pair shows
 * and each view holds its own text; the colour is a LAYER behind the textarea,
 * so it is checked against the textarea's own text pixel for pixel (the layer
 * with its colours forced to ink, against the textarea with its glyphs shown
 * and the layer hidden: any difference is a word drawn off the textarea's);
 * the words the alignment says differ are the ones coloured; the pair's touch
 * strip is 44 px tall while the drawn pair is not; and typing a poem into Poem
 * moves no seat of «Within Four Walls» (`pairings` read back from IndexedDB,
 * before and after, count and every key and value).
 *
 * NOT HERE: a PDF page dropped on the field. `pdfjs-dist` 6 needs
 * `Map.prototype.getOrInsertComputed` and `Math.sumPrecise`, which the
 * Chromium Playwright ships here lacks, so the drop is measured by hand with
 * both polyfilled (the report names where). The routing itself is pinned in
 * `lib/text/input-views.test.ts`.
 */
import { test, expect, type Page } from '@playwright/test';

const FIXTURE = 'src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml';

async function openDrawer(page: Page) {
	await page.goto('/');
	await page.waitForFunction(() => {
		const t = document.querySelector<HTMLTextAreaElement>('textarea.text-input');
		return t && !t.disabled;
	}, undefined, { timeout: 60_000 });
	await page.getByRole('button', { name: /drawer/i }).first().tap();
	await page.locator('#intake-tab-lyrics').waitFor();
}

/** The field's pixels with the layer's text on show, against the textarea's own text on show. */
async function layerAgainstTextarea(page: Page): Promise<number> {
	const a = await shot(page, '.layer .differs,.layer .omitted{color:var(--ink-primary)!important}::highlight(intake-differs),::highlight(intake-omitted){color:var(--ink-primary)!important}');
	const b = await shot(page, '.layer .differs,.layer .omitted{color:var(--ink-primary)!important}.layer{visibility:hidden!important}.text-input{color:var(--ink-primary)!important;-webkit-text-fill-color:var(--ink-primary)!important}');
	return page.evaluate(async ([x, y]) => {
		const decode = async (s: string) => {
			const bytes = Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
			const bmp = await createImageBitmap(new Blob([bytes], { type: 'image/png' }));
			const canvas = new OffscreenCanvas(bmp.width, bmp.height);
			const g = canvas.getContext('2d')!;
			g.drawImage(bmp, 0, 0);
			return g.getImageData(0, 0, bmp.width, bmp.height).data;
		};
		const [p, q] = [await decode(x), await decode(y)];
		let bad = p.length === q.length ? 0 : -1;
		for (let i = 0; bad >= 0 && i < p.length; i += 4) {
			if (Math.abs(p[i] - q[i]) + Math.abs(p[i + 1] - q[i + 1]) + Math.abs(p[i + 2] - q[i + 2]) > 24) bad++;
		}
		return bad;
	}, [a, b]);
}

async function shot(page: Page, css: string): Promise<string> {
	await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur?.());
	const style = await page.addStyleTag({ content: css });
	const png = await page.locator('.field').screenshot();
	await style.evaluate((n) => n.remove());
	return png.toString('base64');
}

async function seats(page: Page): Promise<Record<string, unknown>> {
	return page.evaluate(async () => {
		const db = await new Promise<IDBDatabase>((res) => {
			const q = indexedDB.open('ilya-library');
			q.onsuccess = () => res(q.result);
		});
		const all = await new Promise<{ pairings?: Record<string, unknown> }[]>((res) => {
			const q = db.transaction('songs').objectStore('songs').getAll();
			q.onsuccess = () => res(q.result);
		});
		db.close();
		return all[0]?.pairings ?? {};
	});
}

test.describe('Input, two views (N.135 stage 3)', () => {
	test('the pair shows, each view holds its own text, and the line says which view this is', async ({ page }) => {
		await openDrawer(page);
		// Row 109 C: a song with no text opens Input on Poem.
		await expect(page.locator('#intake-tab-poem')).toHaveAttribute('aria-selected', 'true');
		await page.locator('#intake-tab-lyrics').tap();
		await expect(page.locator('#intake-tab-lyrics')).toHaveAttribute('aria-selected', 'true');
		await expect(page.locator('.views-line').first()).toContainText('The words as sung');
		const ta = page.locator('textarea.text-input');
		await ta.fill('Тебя я увидел');
		await page.locator('#intake-tab-poem').tap();
		await expect(page.locator('.views-line').first()).toContainText('Edits here change the published poem');
		await expect(ta).toHaveValue('');
		await ta.fill('Средь шумного бала');
		await page.locator('#intake-tab-lyrics').tap();
		await expect(ta).toHaveValue('Тебя я увидел');
		await page.locator('#intake-tab-poem').tap();
		await expect(ta).toHaveValue('Средь шумного бала');
	});

	test('the colour layer sits exactly under the textarea\'s own text, coloured or not', async ({ page }) => {
		await openDrawer(page);
		await page.locator('#intake-tab-lyrics').tap();
		const ta = page.locator('textarea.text-input');
		const poem = 'Средь шумного бала, случайно, в тревоге мирской суеты, тебя я увидел.';
		const lyrics = 'Средь шумного бала, шумного бала,\nслучайно в тревоге суеты, тебя я увидал, увидал.\n';
		await ta.fill(lyrics);
		expect(await layerAgainstTextarea(page), 'no Poem yet, nothing coloured').toBe(0);
		await page.locator('#intake-tab-poem').tap();
		await ta.fill(poem);
		await page.locator('#intake-tab-lyrics').tap();
		const coloured = await page.evaluate(() => [...(CSS.highlights.get('intake-differs') ?? [])].map((r) => r.toString()));
		expect(coloured).toEqual(['шумного', 'бала,', 'увидал,', 'увидал.']);
		expect(await layerAgainstTextarea(page), 'with the Poem in, the colours on').toBe(0);
		await page.locator('#intake-tab-poem').tap();
		const greyed = await page.evaluate(() => [...(CSS.highlights.get('intake-omitted') ?? [])].map((r) => r.toString()));
		expect(greyed).toEqual(['мирской', 'увидел.']);
		await expect(page.locator('.views-line').nth(1)).toContainText('Greyed words are those left out');
		expect(await layerAgainstTextarea(page), 'the Poem view, greys on').toBe(0);
	});

	test('the pair\'s touch strip is 44 px tall and the drawn pair is not', async ({ page }) => {
		await openDrawer(page);
		const m = await page.evaluate(() => {
			const b = document.querySelector('#intake-tab-lyrics') as HTMLElement;
			return { drawn: b.getBoundingClientRect().height, strip: parseFloat(getComputedStyle(b, '::after').height) };
		});
		expect(m.strip).toBe(44);
		expect(m.drawn).toBeLessThan(44);
	});

	test('a poem typed into Poem moves no seat of «Within Four Walls»', async ({ page }) => {
		test.setTimeout(180_000);
		await page.goto('/');
		await page.waitForFunction(() => {
			const t = document.querySelector<HTMLTextAreaElement>('textarea.text-input');
			return t && !t.disabled;
		}, undefined, { timeout: 60_000 });
		await page.getByRole('button', { name: /drawer/i }).first().tap();
		const seated = page.waitForEvent('console', { predicate: (m) => m.text().startsWith('[Ilya] N.160 seats:'), timeout: 90_000 });
		await page.locator('input.hidden-input').setInputFiles(FIXTURE);
		await seated;
		await page.waitForTimeout(2500);
		await expect(page.locator('.views-line').first()).toContainText('Your score\'s sung words are in Lyrics');
		const before = await seats(page);
		expect(Object.keys(before).length).toBeGreaterThan(0);
		const words = (await page.locator('textarea.text-input').inputValue()).trim().split(/\s+/);
		await page.locator('#intake-tab-poem').tap();
		await expect(page.locator('textarea.text-input')).toHaveValue('');
		const poem = words.slice(0, words.length - 6).join(' ');
		await page.locator('textarea.text-input').fill(poem);
		await page.waitForTimeout(3000);
		const after = await seats(page);
		expect(Object.keys(after).length).toBe(Object.keys(before).length);
		// Row 108 B: Lyrics now takes the poem's line breaks, so each seat's ORIGIN moves to its new line;
		// its note, its text, its IPA, and its slot are what "moves no seat" means, and those are unchanged.
		const noOrigin = (m: Record<string, unknown>) => Object.fromEntries(Object.entries(m).map(([k, p]) => [k, { ...(p as object), origin: undefined }]));
		expect(noOrigin(after)).toEqual(noOrigin(before));
	});
});
