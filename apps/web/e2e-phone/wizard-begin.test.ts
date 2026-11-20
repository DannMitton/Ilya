/**
 * LANE 75, ITEM 3 (QUEUE row 167): BEGIN STAYS IN REACH ON A SHORT PHONE. On the wizard's welcome screen, with contralto chosen (so the picker's note is shown),
 * the whole of Begin is on screen with the drawer's scroll at rest, nothing sits on top of it, and it does not cover the nine choices or the note. Three short
 * phones, in English and in French. Before the fix Begin sat 41 to 172 px below the fold at these sizes (measured on the stub, lane 75 item 3 report).
 *
 *     PW_CHROMIUM_PATH=... pnpm --filter @ilya/web exec playwright test --project=phone wizard-begin
 *
 * It is a guard on geometry, not on wording: no sentence is asserted. The `phone` project is touch (`pointer: coarse`), which is the condition the layout in
 * `voice/VoiceTypeFirst.svelte` is written for.
 */
import { test, expect, type Page } from '@playwright/test';

const NOW = '2026-11-01T10:00:00.000Z';
const SIZES = [
	{ width: 390, height: 667 },
	{ width: 375, height: 667 },
	{ width: 360, height: 640 }
];

async function openWelcome(page: Page, language: 'en' | 'fr') {
	// A voice with no type, so the welcome screen asks for one (`askTypeFirst`).
	const store = { version: 2, activeId: 'v', voices: [{ id: 'v', name: 'Dann', createdAt: NOW, updatedAt: NOW, calibratedAt: NOW, formants: {} }] };
	await page.addInitScript(([s, lang]) => { localStorage.setItem('ilya:language', lang); localStorage.setItem('shane.profiles.v2', s); }, [JSON.stringify(store), language] as const);
	await page.goto('/?capture=stub');
	await expect(page.locator('.drawer-pull')).toBeVisible({ timeout: 45_000 });
	await page.locator('.drawer-pull').click();
	await expect(page.locator('textarea.text-input')).toBeEnabled({ timeout: 45_000 });
	await page.getByRole('button', { name: /^(voice|voix)$/i }).click();
	// The door is named for the state: nothing recorded (`calib.pane.door.record`).
	await page.getByRole('button', { name: /^(record your vowels|capter vos voyelles)$/i }).click();
	await expect(page.locator('.vt-first')).toBeVisible();
}

/** Everything the claim needs, read in one pass from the live render: Begin's box, the scroll box's, what is on top at Begin's centre, and the boxes Begin must not cover. */
async function geometry(page: Page) {
	return page.evaluate(() => {
		const box = (e: Element) => { const r = e.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, left: r.left, right: r.right }; };
		const body = document.querySelector('.takeover-body')!;
		const begin = [...document.querySelectorAll('.wizard-phase .wizard-primary')].find((b) => b.closest('.wizard-phase'))!;
		const r = begin.getBoundingClientRect();
		const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
		return {
			scrollTop: body.scrollTop,
			viewport: innerHeight,
			begin: box(begin),
			scroller: box(body),
			onTop: !!top && (top === begin || begin.contains(top)),
			choices: [...document.querySelectorAll('.vt-first .vt-option')].map(box),
			note: box(document.querySelector('.vt-first .vt-note')!),
			noteText: (document.querySelector('.vt-first .vt-note')!.textContent ?? '').trim()
		};
	});
}
type Box = { top: number; bottom: number; left: number; right: number };
const overlaps = (a: Box, b: Box) => a.top < b.bottom && b.top < a.bottom && a.left < b.right && b.left < a.right;

for (const size of SIZES) {
	test.describe(`${size.width} by ${size.height}`, () => {
		test.use({ viewport: size });
		for (const language of ['en', 'fr'] as const) {
			test(`${language}: contralto chosen, Begin is whole on screen at rest, uncovered, and covers neither the nine choices nor the note`, async ({ page }) => {
				await openWelcome(page, language);
				await page.locator('input[name="voice-type-first"][value="contralto"]').check();
				// The note is shown (it is what makes the screen too tall), and the singer has not scrolled: the check above may have, so the scroll is put back to rest.
				await expect(page.locator('.vt-first .vt-note p')).toBeVisible();
				await page.evaluate(() => { document.querySelector('.takeover-body')!.scrollTop = 0; });
				const g = await geometry(page);
				expect(g.noteText.length, 'the note is shown').toBeGreaterThan(0);
				expect(g.choices.length, 'the nine choices').toBe(9);
				expect(g.scrollTop, 'at rest').toBe(0);
				// 1. The whole of Begin is inside the scroll box and inside the window, with nothing on top of it.
				expect(g.begin.top, 'Begin starts inside the scroll box').toBeGreaterThanOrEqual(g.scroller.top);
				expect(g.begin.bottom, 'Begin ends inside the scroll box').toBeLessThanOrEqual(g.scroller.bottom);
				expect(g.begin.bottom, 'Begin ends inside the window').toBeLessThanOrEqual(g.viewport);
				expect(g.onTop, 'nothing sits over Begin').toBe(true);
				// 2. Begin covers none of the nine choices and not the note.
				for (const [k, c] of g.choices.entries()) expect(overlaps(g.begin, c), `choice ${k + 1}`).toBe(false);
				expect(overlaps(g.begin, g.note), 'the note').toBe(false);
			});
		}
	});
}
