/**
 * QUEUE row 108 B, tests y, bb, and the second half of cc, at phone width
 * (`input-views.test.ts`'s pattern). Run: `playwright test --project=phone relining`.
 *
 * y: drop «Within Four Walls», paste the stand-in poem (the file's own words in
 * lines of seven) into Poem: Lyrics is read back in six lines and the seats in
 * IndexedDB keep their notes and their text. bb: the same poem typed key by key
 * lays Lyrics out, and the Text region is not rebuilt until the quiet pause.
 * cc: five letters typed into Lyrics on a seated song rebuild Text once.
 */
import { test, expect, type Page } from '@playwright/test';

const FIXTURE = 'src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml';

type Seats = Record<string, { kind: string; cyrillic?: string }>;

async function seats(page: Page): Promise<Seats> {
	return page.evaluate(async () => {
		const db = await new Promise<IDBDatabase>((res) => {
			const q = indexedDB.open('ilya-library');
			q.onsuccess = () => res(q.result);
		});
		const all = await new Promise<{ pairings?: Record<string, never> }[]>((res) => {
			const q = db.transaction('songs').objectStore('songs').getAll();
			q.onsuccess = () => res(q.result);
		});
		db.close();
		return (all[0]?.pairings ?? {}) as never;
	});
}
const view = (s: Seats) => Object.fromEntries(Object.entries(s).map(([k, p]) => [k, p.kind === 'syllable' ? p.cyrillic : p.kind]));

async function dropScore(page: Page) {
	await page.goto('/');
	await page.waitForFunction(() => {
		const t = document.querySelector<HTMLTextAreaElement>('textarea.text-input');
		return t && !t.disabled;
	}, undefined, { timeout: 60_000 });
	await page.getByRole('button', { name: /drawer/i }).first().tap();
	await page.locator('input.hidden-input').setInputFiles(FIXTURE);
	await expect.poll(async () => Object.values(await seats(page)).filter((p) => p.kind === 'syllable').length, { timeout: 120_000 }).toBeGreaterThanOrEqual(96);
	await page.waitForTimeout(2500);
	await page.locator('#intake-tab-lyrics').tap();
}

const lyrics = (page: Page) => page.locator('textarea.text-input').inputValue();
const lineCount = (text: string) => text.trim().split('\n').length;
const standIn = (words: string[]) => Array.from({ length: Math.ceil(words.length / 7) }, (_, i) => words.slice(i * 7, i * 7 + 7).join(' ')).join('\n');

/** Records when the Text region (the word stacks) is rebuilt, in ms since the page loaded. */
async function watchText(page: Page) {
	await page.evaluate(() => {
		const w = window as unknown as { __textRebuilds: number[] };
		w.__textRebuilds = [];
		new MutationObserver((batch) => {
			if (batch.some((m) => (m.target as Element).closest?.('[data-word-index]') || [...m.addedNodes].some((n) => (n as Element).closest?.('[data-word-index]') || (n as Element).querySelector?.('[data-word-index]')))) w.__textRebuilds.push(performance.now());
		}).observe(document.body, { subtree: true, childList: true, characterData: true });
	});
}
/** Rebuild bursts: mutation batches closer than 150 ms count as one. */
async function bursts(page: Page): Promise<number[]> {
	const times = await page.evaluate(() => (window as unknown as { __textRebuilds: number[] }).__textRebuilds);
	const out: number[] = [];
	for (const t of times) if (out.length === 0 || t - out[out.length - 1] > 150) out.push(t);
	return out;
}

test('y. a poem pasted into Poem lays Lyrics out in its lines and moves no seat', async ({ page }) => {
	test.setTimeout(240_000);
	await dropScore(page);
	const one = await lyrics(page);
	expect(lineCount(one), 'the drop leaves one line').toBe(1);
	const before = await seats(page);
	const words = one.trim().split(/\s+/);
	await page.locator('#intake-tab-poem').tap();
	await page.locator('textarea.text-input').fill(standIn(words));
	await page.waitForTimeout(3500);
	await page.locator('#intake-tab-lyrics').tap();
	const after = await lyrics(page);
	expect(after.trim().split('\n').map((l) => l.split(' ').length)).toEqual([7, 7, 7, 7, 7, 4]);
	expect(Object.keys(await seats(page)).sort()).toEqual(Object.keys(before).sort());
	expect(view(await seats(page))).toEqual(view(before));

	// The field's own undo (section 5, item 6): one Control+Z in Lyrics. Reported, not asserted.
	await page.locator('textarea.text-input').focus();
	await page.keyboard.press('Control+z');
	await page.waitForTimeout(800);
	const undone = await lyrics(page);
	console.log(`UNDO field: lines after Control+Z = ${lineCount(undone)} (before ${lineCount(after)}); same words = ${undone.split(/\s+/).join(' ') === after.split(/\s+/).join(' ')}`);
	expect(Object.keys(await seats(page)).length).toBe(Object.keys(before).length);
});

test('bb. a poem typed key by key lays Lyrics out after the pause, and Text is not rebuilt before it', async ({ page }) => {
	test.setTimeout(240_000);
	await dropScore(page);
	const words = (await lyrics(page)).trim().split(/\s+/);
	const before = await seats(page);
	await page.locator('#intake-tab-poem').tap();
	await watchText(page);
	await page.locator('textarea.text-input').pressSequentially(standIn(words), { delay: 4 });
	const lastKey = await page.evaluate(() => performance.now());
	await page.waitForTimeout(4000);
	const rebuilt = await bursts(page);
	expect(rebuilt.filter((t) => t < lastKey), 'no rebuild of Text while the poem is being typed').toEqual([]);
	await page.locator('#intake-tab-lyrics').tap();
	expect((await lyrics(page)).trim().split('\n').map((l) => l.split(' ').length)).toEqual([7, 7, 7, 7, 7, 4]);
	expect(view(await seats(page))).toEqual(view(before));
});

test('cc. five letters typed into Lyrics on a seated song rebuild Text once, after the pause', async ({ page }) => {
	test.setTimeout(240_000);
	await dropScore(page);
	await watchText(page);
	const ta = page.locator('textarea.text-input');
	await ta.click();
	await page.keyboard.press('Control+End');
	await page.keyboard.type(' ');
	await page.keyboard.type('абвгд', { delay: 60 });
	const lastKey = await page.evaluate(() => performance.now());
	await page.waitForTimeout(4000);
	const rebuilt = await bursts(page);
	console.log(`TYPING: rebuild bursts = ${rebuilt.length}, first ${rebuilt.length ? Math.round(rebuilt[0] - lastKey) : 'none'} ms after the last key`);
	expect(rebuilt.filter((t) => t < lastKey), 'none while typing').toEqual([]);
	expect(rebuilt).toHaveLength(1);
});
