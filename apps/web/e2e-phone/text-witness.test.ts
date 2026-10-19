/**
 * ROWS 109 AND 110 (N.186), ON THE SINGER'S PATH, at phone width: Text shows the
 * witness there is, and a wordless score takes the poem into Lyrics and seats.
 *
 *     PW_CHROMIUM_PATH=/opt/pw-browsers/chromium pnpm --filter @ilya/web exec playwright test --project=phone text-witness
 */
import { test, expect, type Page } from '@playwright/test';

const note = (step: string, type: string, duration: number) =>
	`<note><pitch><step>${step}</step><octave>4</octave></pitch><duration>${duration}</duration><type>${type}</type></note>`;
/** The shape of `no-lyrics-control.musicxml`: C4 D4 E4 F4 quarters, G4 half, a half rest, no words. */
const WORDLESS = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="3.1"><part-list><score-part id="P1"><part-name>Voice</part-name></score-part></part-list>
<part id="P1"><measure number="1"><attributes><divisions>2</divisions><key><fifths>0</fifths></key><time><beats>4</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes>
${note('C', 'quarter', 2)}${note('D', 'quarter', 2)}${note('E', 'quarter', 2)}${note('F', 'quarter', 2)}</measure>
<measure number="2">${note('G', 'half', 4)}<note><rest/><duration>4</duration><type>half</type></note></measure></part></score-partwise>`;
const FILE = { name: 'wordless.musicxml', mimeType: 'application/xml', buffer: Buffer.from(WORDLESS) };
const POEM = 'Я тебя любил';

async function open(page: Page) {
	await page.goto('/');
	await page.waitForFunction(() => {
		const t = document.querySelector<HTMLTextAreaElement>('textarea.text-input');
		return t && !t.disabled;
	}, undefined, { timeout: 60_000 });
	await page.getByRole('button', { name: /drawer/i }).first().tap();
	await page.locator('#intake-tab-lyrics').waitFor();
}

async function song(page: Page) {
	return page.evaluate(async () => {
		const db = await new Promise<IDBDatabase>((res) => {
			const q = indexedDB.open('ilya-library');
			q.onsuccess = () => res(q.result);
		});
		const all = await new Promise<{ poem?: string; publishedPoem?: string; pairings?: Record<string, { kind: string }> }[]>((res) => {
			const q = db.transaction('songs').objectStore('songs').getAll();
			q.onsuccess = () => res(q.result);
		});
		db.close();
		const r = all[0] ?? {};
		return { lyrics: r.poem ?? '', poem: r.publishedPoem ?? '', seats: Object.values(r.pairings ?? {}).filter((p) => p.kind === 'syllable').length };
	});
}

/** The words on the page itself; the phone also mounts the reading aid's copy. */
const words = (page: Page) => page.locator('.paper-container [data-word-index]').count();

test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

test.describe('Text shows the witness there is (rows 109 and 110)', () => {
	test('a new song opens Input on Poem, and a poem alone is what Text transcribes', async ({ page }) => {
		await open(page);
		await expect(page.locator('#intake-tab-poem')).toHaveAttribute('aria-selected', 'true');
		await page.locator('textarea.text-input').fill(POEM);
		await expect.poll(() => words(page), { timeout: 15_000 }).toBe(3);
		const s = await song(page);
		expect(s.lyrics).toBe('');
	});

	test('a wordless score onto an empty Lyrics takes the poem and seats 5 of 5 (poem first)', async ({ page }) => {
		test.setTimeout(120_000);
		await open(page);
		await page.locator('textarea.text-input').fill(POEM);
		await page.locator('input.hidden-input').setInputFiles(FILE);
		await expect.poll(async () => (await song(page)).seats, { timeout: 30_000 }).toBe(5);
		const s = await song(page);
		expect(s.lyrics).toBe(POEM);
		expect(s.poem).toBe(POEM);
	});

	test('a wordless score first, then a poem pasted: Lyrics takes it and seats', async ({ page }) => {
		test.setTimeout(120_000);
		await open(page);
		await page.locator('input.hidden-input').setInputFiles(FILE);
		await page.waitForTimeout(2000);
		await page.locator('#intake-tab-poem').tap();
		await page.evaluate((text) => navigator.clipboard.writeText(text), POEM);
		await page.locator('textarea.text-input').focus();
		await page.keyboard.press('Control+V');
		await expect.poll(async () => (await song(page)).seats, { timeout: 30_000 }).toBe(5);
		expect((await song(page)).lyrics).toBe(POEM);
	});

	test('a wordless score onto Lyrics the singer wrote leaves it alone', async ({ page }) => {
		test.setTimeout(120_000);
		await open(page);
		await page.locator('#intake-tab-lyrics').tap();
		await page.locator('textarea.text-input').fill('Мои собственные слова');
		await page.locator('#intake-tab-poem').tap();
		await page.locator('textarea.text-input').fill(POEM);
		await page.locator('input.hidden-input').setInputFiles(FILE);
		await page.waitForTimeout(3000);
		expect((await song(page)).lyrics).toBe('Мои собственные слова');
	});

	test('a reload does not refill an emptied Lyrics from the poem', async ({ page }) => {
		test.setTimeout(120_000);
		await open(page);
		await page.locator('textarea.text-input').fill(POEM);
		await page.locator('input.hidden-input').setInputFiles(FILE);
		await expect.poll(async () => (await song(page)).seats, { timeout: 30_000 }).toBe(5);
		await page.locator('#intake-tab-lyrics').tap();
		await page.locator('.receipt-poem').getByRole('button', { name: 'Clear' }).tap();
		await page.waitForTimeout(2500);
		await page.reload();
		await page.waitForFunction(() => document.querySelector('textarea.text-input'), undefined, { timeout: 60_000 });
		await page.waitForTimeout(4000);
		const s = await song(page);
		expect(s.lyrics).toBe('');
		expect(s.poem).toBe(POEM);
	});

	test('clearing Poem leaves Lyrics', async ({ page }) => {
		await open(page);
		await page.locator('#intake-tab-lyrics').tap();
		await page.locator('textarea.text-input').fill('Тебя я увидел');
		await page.locator('#intake-tab-poem').tap();
		await page.locator('textarea.text-input').fill(POEM);
		await page.locator('.receipt-poem').getByRole('button', { name: 'Clear' }).tap();
		await page.waitForTimeout(2500);
		const s = await song(page);
		expect(s.lyrics).toBe('Тебя я увидел');
		expect(s.poem).toBe('');
	});
});

const FIXTURE = 'src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml';

test('a score with words dropped on a new song shows Lyrics with no tap, and a tapped Poem stays', async ({ page }) => {
	test.setTimeout(120_000);
	await open(page);
	await expect(page.locator('#intake-tab-poem')).toHaveAttribute('aria-selected', 'true');
	const seated = page.waitForEvent('console', { predicate: (m) => m.text().startsWith('[Ilya] N.160 seats:'), timeout: 90_000 });
	await page.locator('input.hidden-input').setInputFiles('src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml');
	await seated;
	await expect(page.locator('#intake-tab-lyrics')).toHaveAttribute('aria-selected', 'true');
	await expect(page.locator('textarea.text-input')).not.toHaveValue('');
});

test('a Poem the singer tapped stays when a score with words arrives', async ({ page }) => {
	test.setTimeout(120_000);
	await open(page);
	await page.locator('#intake-tab-poem').tap();
	const seated = page.waitForEvent('console', { predicate: (m) => m.text().startsWith('[Ilya] N.160 seats:'), timeout: 90_000 });
	await page.locator('input.hidden-input').setInputFiles('src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml');
	await seated;
	await page.waitForTimeout(1500);
	await expect(page.locator('#intake-tab-poem')).toHaveAttribute('aria-selected', 'true');
});

test.describe('the pair in Text (row 110)', () => {
	test('with both texts differing: Lyrics on open, Poem on choice whole with its unset words grey, back to Lyrics, seats unchanged', async ({ page }) => {
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
		await page.locator('#intake-tab-lyrics').tap();
		const lyricsWords = (await page.locator('textarea.text-input').inputValue()).trim().split(/\s+/);
		// The poem: the song's words, the last 6 left out, the 11th replaced (a test text, not a published poem).
		const poemWords = lyricsWords.slice(0, lyricsWords.length - 6);
		poemWords[10] = 'ИЗМЕНЁННОЕ';
		await page.locator('#intake-tab-poem').tap();
		await page.locator('textarea.text-input').fill(poemWords.join(' '));
		await page.waitForTimeout(2500);
		const before = await song(page);
		expect(before.seats).toBeGreaterThan(0);
		// Closed drawer shows the Text page.
		await page.getByRole('button', { name: /paper/i }).first().tap();
		await expect(page.locator('#text-tab-lyrics')).toHaveAttribute('aria-selected', 'true');
		const onLyrics = await words(page);
		expect(onLyrics).toBe(lyricsWords.length);
		await page.locator('#text-tab-poem').tap();
		await expect(page.locator('#text-tab-poem')).toHaveAttribute('aria-selected', 'true');
		await expect.poll(() => words(page), { timeout: 15_000 }).toBe(poemWords.length);
		expect(await page.locator('.paper-container .word-stack.muted').count()).toBe(1);
		await page.locator('#text-tab-lyrics').tap();
		await expect.poll(() => words(page), { timeout: 15_000 }).toBe(lyricsWords.length);
		expect(await page.locator('.paper-container .word-stack.muted').count()).toBe(0);
		await page.waitForTimeout(2500);
		const after = await song(page);
		expect(after.seats).toBe(before.seats);
		expect(after.lyrics).toBe(before.lyrics);
	});

	test('with both texts the same words: no pair', async ({ page }) => {
		await open(page);
		await page.locator('#intake-tab-lyrics').tap();
		await page.locator('textarea.text-input').fill('Тебя я увидел');
		await page.locator('#intake-tab-poem').tap();
		await page.locator('textarea.text-input').fill('тебя, я увидел.');
		await page.waitForTimeout(1500);
		await page.getByRole('button', { name: /paper/i }).first().tap();
		await expect(page.locator('#text-tab-poem')).toHaveCount(0);
	});

	test('with only a poem or only Lyrics: no pair', async ({ page }) => {
		await open(page);
		await page.locator('textarea.text-input').fill(POEM);
		await page.waitForTimeout(1500);
		await page.getByRole('button', { name: /paper/i }).first().tap();
		await expect(page.locator('#text-tab-poem')).toHaveCount(0);
	});
});
