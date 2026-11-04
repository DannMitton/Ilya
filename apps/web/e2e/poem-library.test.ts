import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { waitForDictionary } from './helpers';

/*
 * THE POEM LIBRARY, BUILD 1: THE SINGER'S WALK, in a real browser (step 6 of
 * `docs/sessions/brief-code-poem-library-build1_r3_2026-11-03.md`; the walk is its top section).
 *
 * The Lyrics are the fixtures of `tools/poems/fixtures`: twelve read Lyrics, public-domain poems only.
 * "Row 114 song 2" is «Весёлый час». A paste is a real paste (the clipboard and Control+V), because a keystroke
 * and a paste reach the page differently (`IntakeViews.svelte`, `arrivalOf`) and the walk depends on it.
 * The strings are Dann's, ratified 2026-11-03 20:21 (D1 to D3 of 20:01 applied, step 7, part 4); the English the tests read is the table's.
 */
test.use({ viewport: { width: 1440, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });

const FIXTURES = join(process.cwd(), '../../tools/poems/fixtures');
const fixture = (name: string): string => readFileSync(join(FIXTURES, `${name}.lyrics.txt`), 'utf8');
const SONG2 = fixture('r114-song2');

const field = (page: Page) => page.locator('textarea.text-input');
const card = (page: Page) => page.getByTestId('poem-library-card');
const removed = (page: Page) => page.getByTestId('poem-library-removed');
const lines = (page: Page) => page.locator('.views-line');
const QUIET = 'Алексей Васильевич Кольцов, “Весёлый час”, from Russian Wikisource.'; // D1: English quotes a Russian title in “…”
const BASED_ON = `Based on ${QUIET}`;

async function open(page: Page): Promise<void> {
	await page.goto('/');
	await waitForDictionary(page);
}

/** A real paste into Lyrics: the clipboard, then Control+V in the focused field. */
async function pasteIntoLyrics(page: Page, text: string): Promise<void> {
	await page.locator('#intake-tab-lyrics').click();
	await field(page).focus();
	await page.evaluate((t) => navigator.clipboard.writeText(t), text);
	await page.keyboard.press('Control+V');
}

/**
 * A poem page: a PDF with a text layer, which the intake reads as a poem and offers to Poem (`routePoemPage`).
 * FOURTEEN LINES, not one: a page with a single line of text was read as music (the staff check took it for staves,
 * and the intake started the score reader), a measured finding of this test's first run.
 */
function poemPagePdf(words: string): Buffer {
	const stream = Array.from({ length: 14 }, (_, i) => `BT /F1 14 Tf 72 ${700 - i * 22} Td (${words} ${i + 1}) Tj ET`).join('\n');
	const objects = [
		'<< /Type /Catalog /Pages 2 0 R >>',
		'<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
		'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
		`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
		'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
	];
	let body = '%PDF-1.4\n';
	const offsets: number[] = [];
	objects.forEach((o, i) => {
		offsets.push(body.length);
		body += `${i + 1} 0 obj\n${o}\nendobj\n`;
	});
	const xref = body.length;
	body += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('')}`;
	body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
	return Buffer.from(body, 'latin1');
}

/** The song is written within the autosave's debounce (800 ms, 5 s at most); the test waits that out before a reload. */
const SAVED_MS = 2500;

test.describe('walk 1 to 3: she pastes a song, sees a card, and keeps the poem', () => {
	test('the card names the poem, and nothing takes her focus', async ({ page }) => {
		await open(page);
		await pasteIntoLyrics(page, SONG2);
		await expect(card(page)).toBeVisible({ timeout: 30_000 });

		// What it names, in the order she wonders it.
		await expect(card(page)).toContainText('Ilya found this poem for your song:');
		await expect(card(page)).toContainText('“Весёлый час”');
		await expect(card(page)).toContainText('“Дайте бокалы!”'); // D1 reaches the card (part 6)
		await expect(card(page)).toContainText('Алексей Васильевич Кольцов');
		await expect(card(page)).not.toContainText('translated by');
		await expect(card(page)).not.toContainText('a passage beginning');
		await expect(card(page)).toContainText('From Russian Wikisource.');
		await expect(card(page)).not.toContainText('in modern spelling');
		await expect(card(page)).toContainText('Coloured words in LYRICS now show where your song departs from this poem.'); // D2
		const buttons = card(page).getByRole('button');
		await expect(buttons).toHaveText(['Not this poem', 'Keep this poem']);

		// In the LYRICS view, above the field, and the field she was pasting into still has her focus.
		await expect(page.locator('#intake-tab-lyrics')).toHaveAttribute('aria-selected', 'true');
		await expect(field(page)).toBeFocused();
		const [cardBox, fieldBox] = await Promise.all([card(page).boundingBox(), field(page).boundingBox()]);
		expect(cardBox!.y + cardBox!.height).toBeLessThanOrEqual(fieldBox!.y);

		// Named by its heading, and the heading is spoken through a polite live region.
		await expect(card(page)).toHaveAttribute('role', 'group');
		const heading = await card(page).getAttribute('aria-labelledby');
		await expect(page.locator(`#${heading}`)).toHaveText('Ilya found this poem for your song:');
		await expect(page.locator('.visually-hidden[aria-live="polite"]').filter({ hasText: 'Ilya found this poem' })).toHaveCount(1);

		// Before the field in tab order.
		await page.locator('#intake-tab-lyrics').focus();
		await page.keyboard.press('Tab');
		await expect(card(page).locator('a.site-link')).toBeFocused(); // the source link (step 8, part 1)
		await page.keyboard.press('Tab');
		await expect(buttons.nth(0)).toBeFocused();
		await page.keyboard.press('Tab');
		await expect(buttons.nth(1)).toBeFocused();
		await page.keyboard.press('Tab');
		await expect(field(page)).toBeFocused();
	});

	test('the poem is in POEM, and the Lyrics are as she pasted them', async ({ page }) => {
		await open(page);
		await pasteIntoLyrics(page, SONG2);
		await expect(card(page)).toBeVisible({ timeout: 30_000 });
		await expect(field(page)).toHaveValue(SONG2);
		await page.locator('#intake-tab-poem').click();
		await expect(field(page)).toHaveValue(/^Дайте бокалы!\nДайте вина!\nРадость/);
		// POEM ends at «Видит заря!», not at the library's dating line (step 7, part 3)
		await expect(field(page)).toHaveValue(/Видит заря!$/);
		await expect(field(page)).not.toHaveValue(/1830/);
		await expect(card(page)).toBeVisible(); // the card stands over whichever view is showing
		await expect(card(page)).not.toContainText('a passage beginning');
	});

	test('Keep this poem folds the card to one quiet line, which shows under POEM only', async ({ page }) => {
		await open(page);
		await pasteIntoLyrics(page, SONG2);
		await expect(card(page)).toBeVisible({ timeout: 30_000 });
		await page.getByRole('button', { name: 'Keep this poem' }).click();
		await expect(card(page)).toHaveCount(0);

		// Her focus has somewhere to be: the view she is on.
		await expect(page.locator('#intake-tab-lyrics')).toBeFocused();
		await expect(lines(page).first()).not.toContainText('Wikisource'); // under LYRICS the ordinary line stands
		await page.locator('#intake-tab-poem').click();
		await expect(lines(page).first()).toHaveText(QUIET);
		await page.locator('#intake-tab-lyrics').click();
		await expect(lines(page).first()).not.toContainText('Wikisource');
	});
});

test.describe('walk 4: she taps Not this poem', () => {
	test('Poem empties, Lyrics are as they were, and Undo restores the filled state', async ({ page }) => {
		await open(page);
		await pasteIntoLyrics(page, SONG2);
		await expect(card(page)).toBeVisible({ timeout: 30_000 });
		const before = await field(page).inputValue();
		expect(before).toBe(SONG2);

		await page.getByRole('button', { name: 'Not this poem' }).click();
		await expect(card(page)).toHaveCount(0);
		await expect(removed(page)).toContainText('Poem removed.');
		await expect(removed(page).getByRole('button', { name: 'Undo' })).toBeFocused();
		await expect(field(page)).toHaveValue(before); // doc.inputText equals its value before the fill
		await page.locator('#intake-tab-poem').click();
		await expect(field(page)).toHaveValue('');
		await expect(removed(page)).toBeVisible(); // the line shows in whichever view

		await page.getByRole('button', { name: 'Undo' }).click();
		await expect(removed(page)).toHaveCount(0);
		await expect(card(page)).toBeVisible(); // the card, since it was unanswered
		await expect(field(page)).toHaveValue(/^Дайте бокалы!\nДайте вина!/);
		await page.locator('#intake-tab-lyrics').click();
		await expect(field(page)).toHaveValue(before);
	});

	test('the same poem is not offered again for that song this session', async ({ page }) => {
		await open(page);
		await pasteIntoLyrics(page, SONG2);
		await expect(card(page)).toBeVisible({ timeout: 30_000 });
		await page.getByRole('button', { name: 'Not this poem' }).click();
		await expect(removed(page)).toBeVisible();

		// Clear Lyrics and paste the same song again: nothing is offered.
		await field(page).focus();
		await page.keyboard.press('Control+A');
		await page.keyboard.press('Delete');
		await pasteIntoLyrics(page, SONG2);
		await page.waitForTimeout(4000);
		await expect(card(page)).toHaveCount(0);
		await page.locator('#intake-tab-poem').click();
		await expect(field(page)).toHaveValue('');
	});
});

test.describe('walk 5: she ignores the card', () => {
	test('the poem stays, and a reload of the song shows the card again', async ({ page }) => {
		await open(page);
		await pasteIntoLyrics(page, SONG2);
		await expect(card(page)).toBeVisible({ timeout: 30_000 });
		await page.waitForTimeout(SAVED_MS);

		await page.reload();
		await waitForDictionary(page);
		await expect(card(page)).toBeVisible({ timeout: 30_000 }); // the library loads after the app is interactive
		await expect(card(page)).toContainText('“Весёлый час”');
		await page.locator('#intake-tab-poem').click();
		await expect(field(page)).toHaveValue(/^Дайте бокалы!\nДайте вина!/);
	});

	test('after Keep, a reload shows no card and the quiet line', async ({ page }) => {
		await open(page);
		await pasteIntoLyrics(page, SONG2);
		await expect(card(page)).toBeVisible({ timeout: 30_000 });
		await page.getByRole('button', { name: 'Keep this poem' }).click();
		await page.waitForTimeout(SAVED_MS);

		await page.reload();
		await waitForDictionary(page);
		await page.locator('#intake-tab-poem').click();
		await expect(lines(page).first()).toHaveText(QUIET, { timeout: 30_000 });
		await expect(card(page)).toHaveCount(0);
	});
});

test.describe('walk 6 and 7: she edits the poem, and her own poem wins', () => {
	test('a typed key makes the poem hers: the card is gone and the line reads Based on', async ({ page }) => {
		await open(page);
		await pasteIntoLyrics(page, SONG2);
		await expect(card(page)).toBeVisible({ timeout: 30_000 });
		await page.locator('#intake-tab-poem').click();
		await field(page).focus();
		await page.keyboard.press('Control+End');
		await page.keyboard.type(' x');
		await expect(card(page)).toHaveCount(0);
		await expect(lines(page).first()).toHaveText(BASED_ON);
		await page.locator('#intake-tab-lyrics').click();
		await expect(lines(page).first()).not.toContainText('Based on');
	});

	test('a poem page asks before it replaces a poem she edited', async ({ page }) => {
		await open(page);
		await pasteIntoLyrics(page, SONG2);
		await expect(card(page)).toBeVisible({ timeout: 30_000 });
		await page.locator('#intake-tab-poem').click();
		await field(page).focus();
		await page.keyboard.press('Control+End');
		await page.keyboard.type(' x');
		await expect(lines(page).first()).toHaveText(BASED_ON);

		await page.locator('input.hidden-input').setInputFiles({ name: 'poem.pdf', mimeType: 'application/pdf', buffer: poemPagePdf('Her own poem on a page') });
		const dialog = page.locator('dialog[open]');
		await expect(dialog).toBeVisible({ timeout: 30_000 });
		await expect(dialog).toContainText('Replace the poem?');
		await dialog.getByRole('button', { name: 'Replace the poem' }).click();
		await expect(field(page)).toHaveValue(/Her own poem on a page/);
		await expect(lines(page).first()).not.toContainText('Wikisource'); // the source is gone with the poem it named
	});

	test('a poem page replaces an unedited library poem with no question', async ({ page }) => {
		await open(page);
		await pasteIntoLyrics(page, SONG2);
		await expect(card(page)).toBeVisible({ timeout: 30_000 });

		await page.locator('input.hidden-input').setInputFiles({ name: 'poem.pdf', mimeType: 'application/pdf', buffer: poemPagePdf('Her own poem on a page') });
		await page.locator('#intake-tab-poem').click();
		await expect(field(page)).toHaveValue(/Her own poem on a page/, { timeout: 30_000 });
		await expect(page.locator('dialog[open]')).toHaveCount(0);
		await expect(card(page)).toHaveCount(0);
		await expect(lines(page).first()).not.toContainText('Wikisource');
	});
});

test.describe('walk 8: her song sets a passage of a long poem', () => {
	test('fixture S fills the stanzas of the fish’s song only, and the card says passage', async ({ page }) => {
		await open(page);
		await pasteIntoLyrics(page, fixture('S'));
		await expect(card(page)).toBeVisible({ timeout: 30_000 });
		await expect(card(page)).toContainText('“Мцыри”');
		await expect(card(page)).toContainText('a passage beginning “Дитя моё, останься здесь со мной”'); // D1, D4
		await expect(card(page)).toContainText('Михаил Юрьевич Лермонтов');
		await page.locator('#intake-tab-poem').click();
		const poem = await field(page).inputValue();
		expect(poem).toContain('Останься здесь со мной');
		expect(poem).not.toContain('Немного лет тому назад');
		expect(poem.length).toBeLessThan(2000); // «Мцыри» is 19,433 characters
	});
});

test.describe('walk 9: nothing she did not ask for happens later', () => {
	test('typing the Lyrics fills nothing, however long she waits', async ({ page }) => {
		await open(page);
		await page.locator('#intake-tab-lyrics').click();
		await field(page).focus();
		await page.keyboard.insertText(SONG2.slice(0, 700)); // typed text: an `insertText` input, not a paste
		await page.waitForTimeout(9000); // past the idle callback that loads the library, and the quiet pause
		await expect(card(page)).toHaveCount(0);
		await page.locator('#intake-tab-poem').click();
		await expect(field(page)).toHaveValue('');
	});

	test('a Lyrics with no poem in the library fills nothing', async ({ page }) => {
		await open(page);
		await pasteIntoLyrics(page, fixture('U4'));
		await page.waitForTimeout(9000);
		await expect(card(page)).toHaveCount(0);
		await page.locator('#intake-tab-poem').click();
		await expect(field(page)).toHaveValue('');
	});

	test('a cycle of several songs fills nothing', async ({ page }) => {
		await open(page);
		await pasteIntoLyrics(page, ['r114-song1', 'r114-song2', 'r114-song3', 'r114-song4', 'r114-song5'].map(fixture).join('\n'));
		await page.waitForTimeout(9000);
		await expect(card(page)).toHaveCount(0);
		await page.locator('#intake-tab-poem').click();
		await expect(field(page)).toHaveValue('');
	});

	test('a song reopened after Not this poem is not filled again, and a poem she wrote herself is never filled over', async ({ page }) => {
		await open(page);
		await pasteIntoLyrics(page, SONG2);
		await expect(card(page)).toBeVisible({ timeout: 30_000 });
		await page.getByRole('button', { name: 'Not this poem' }).click();
		await page.waitForTimeout(SAVED_MS);
		await page.reload();
		await waitForDictionary(page);
		await page.waitForTimeout(9000); // the library loads; nothing arrives, so nothing is offered
		await expect(card(page)).toHaveCount(0);
		await page.locator('#intake-tab-poem').click();
		await expect(field(page)).toHaveValue('');
	});

	test('her own Poem is never filled over', async ({ page }) => {
		await open(page);
		await page.locator('#intake-tab-poem').click();
		await field(page).focus();
		await page.keyboard.insertText('Своё стихотворение,\nнаписанное самой');
		await pasteIntoLyrics(page, SONG2);
		await page.waitForTimeout(9000);
		await expect(card(page)).toHaveCount(0);
		await page.locator('#intake-tab-poem').click();
		await expect(field(page)).toHaveValue('Своё стихотворение,\nнаписанное самой');
	});
});

test.describe('nothing about the singer or the song leaves the device', () => {
	test('a paste, a keep, and a decline make no request that carries the song, and fetch the poem file once, by name', async ({ page }) => {
		const requests: { method: string; url: string; body: string | null }[] = [];
		page.on('request', (r) => requests.push({ method: r.method(), url: decodeURIComponent(r.url()), body: r.postData() }));
		await open(page);
		await pasteIntoLyrics(page, SONG2);
		await expect(card(page)).toBeVisible({ timeout: 30_000 });
		// The card's source link points at the entry's own page, and an unclicked link made no request (the log above).
		const lib = JSON.parse(readFileSync(join(FIXTURES, '../library.json'), 'utf8'));
		const url = lib.entries.find((e: { id: string }) => e.id === '0127a63ffe').source.url;
		const link = card(page).locator('a.site-link');
		await expect(link).toHaveAttribute('href', url);
		await expect(link).toHaveAttribute('target', '_blank');
		await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
		await expect(link).toHaveText('Russian Wikisource');
		await page.getByRole('button', { name: 'Keep this poem' }).click();
		await page.locator('#intake-tab-poem').click();
		await page.waitForTimeout(1500);

		// Every word of five letters or more of the Lyrics she pasted (the fixture is a scan's misreading, so these
		// are its words, not the poem's), and the poem's title and poet. Any request that carries one has sent the song.
		const song = [...new Set([...(SONG2.match(/[А-Яа-яЁё]{5,}/g) ?? []), 'Весёлый', 'Кольцов'])];
		expect(song.length).toBeGreaterThan(20); // not vacuous
		for (const r of requests) {
			for (const word of song) {
				expect(r.url, `${r.method} ${r.url}`).not.toContain(word);
				expect(r.body ?? '', `${r.method} ${r.url} body`).not.toContain(word);
			}
		}
		// Nothing was sent: no request with a body, and no write method, to anywhere.
		expect(requests.filter((r) => r.body !== null && r.url.startsWith('http'))).toEqual([]);
		expect(requests.filter((r) => !['GET', 'HEAD'].includes(r.method) && !r.url.startsWith('data:') && !r.url.startsWith('blob:'))).toEqual([]);
		// The one request of the feature: the poem file, by its name, with no query.
		const poemFile = requests.filter((r) => /\/data\/dictionary\.poems\.[0-9a-f]{8}\.json/.test(r.url));
		expect(poemFile).toHaveLength(1);
		expect(poemFile[0].url).toMatch(/\.json$/);
		expect(poemFile[0].method).toBe('GET');
	});
});

test.describe('the same walk in French', () => {
	test('the card and the line speak the ratified French', async ({ page }) => {
		await open(page);
		await page.locator('.lang-pill').click();
		await pasteIntoLyrics(page, SONG2);
		await expect(card(page)).toBeVisible({ timeout: 30_000 });
		await expect(card(page)).toContainText('Ilya a trouvé ce poème pour votre chant :');
		await expect(card(page)).toContainText('Tiré de Wikisource en russe.'); // D3
		await expect(card(page)).toContainText('«Весёлый час»'); // French keeps « » (part 6)
		await expect(card(page).getByRole('button')).toHaveText(['Pas ce poème', 'Conserver ce poème']);
		await card(page).getByRole('button', { name: 'Conserver ce poème' }).click();
		await page.locator('#intake-tab-poem').click();
		await expect(lines(page).first()).toHaveText('Алексей Васильевич Кольцов, « Весёлый час », tiré de Wikisource en russe.');
	});
});
