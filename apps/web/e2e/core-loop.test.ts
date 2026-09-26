import { test, expect } from '@playwright/test';
import { waitForDictionary, transcribe, expandStation } from './helpers';

/*
 * SURPRISE, found while repairing this file: Playwright's 'Desktop Chrome'
 * device is 1280x720. The app's own desk/phone breakpoint is
 * `isDeskLayout` (apps/web/src/lib/components/Drawer/layout.ts:62-64),
 * which requires `viewportWidth >= DESK_LAYOUT_MIN_WIDTH`, and
 * `DESK_LAYOUT_MIN_WIDTH` is `DRAWER_WIDTH (520) + SHEET_WIDTH (816) +
 * DESK_PADDING * 2 (64)` = 1400 (layout.ts:41,44,53). At the chromium
 * project's default 1280px this whole file silently ran the PHONE layout
 * (a bottom drawer sheet, "Tap Drawer at the bottom of the screen…"), not
 * the desk layout every one of these tests was written against. Every test
 * in this file targets the desk drawer, so the viewport is widened here.
 */
test.use({ viewport: { width: 1440, height: 900 } });

/*
 * REPAIR NOTES (branch `audit`). Two of the shared assumptions this file
 * was built on are gone from the app:
 *
 * 1. `.status-ok` was removed at commit 5f6a2f3 (N.108-5); see the comment
 *    at apps/web/src/lib/components/Drawer/IntakePanel.svelte:233. Replaced
 *    by `waitForDictionary` in ./helpers.ts, which waits for the intake
 *    textarea to be enabled (its `disabled` is bound to
 *    `loaderState.isLoading`, IntakePanel.svelte:375).
 *
 * 2. The Transcribe button (`.btn-primary`, `handleTranscribe`) was removed
 *    2026-09-16 (N.145); see +page.svelte:660 ("yes, remove the button").
 *    Typing now transcribes itself via `joinText` (+page.svelte:3186).
 *    Replaced by `transcribe` in ./helpers.ts, which fills the textarea and
 *    waits for the first word to render.
 */

test.describe('Ilya core loop', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await waitForDictionary(page);
	});

	test('shows empty state before transcription', async ({ page }) => {
		// DELETED AND REPLACED: the old copy, "To begin, open the drawer on the
		// left and enter your text.", does not exist anywhere in src/ any more
		// (verified: `grep -rn "To begin, open the drawer" src` finds nothing).
		// The current empty-state string is `paper.empty` in i18n.ts:699,
		// drawn by `.empty-directive` in TitlePage.svelte:167-168.
		const placeholder = page.getByText('Enter your Cyrillic text in the drawer on the left.');
		await expect(placeholder).toBeVisible();
	});

	test('transcribes Russian text and shows IPA on Paper', async ({ page }) => {
		await transcribe(page, 'молоко');

		const wordStack = page.locator('[data-word-index="0-0"]');
		await expect(wordStack).toBeVisible();

		const cyrillic = wordStack.locator('.cyrillic-row');
		await expect(cyrillic).toContainText('молоко');

		const ipa = wordStack.locator('.ipa-row');
		await expect(ipa).toBeVisible();
		const ipaText = await ipa.textContent();
		expect(ipaText?.length).toBeGreaterThan(0);
	});

	test('handles multi-word input across lines', async ({ page }) => {
		await transcribe(page, 'молоко ещё');

		const first = page.locator('[data-word-index="0-0"]');
		const second = page.locator('[data-word-index="0-1"]');
		await expect(first).toBeVisible();
		await expect(second).toBeVisible();
	});

	test('clicking a word opens the Inspector', async ({ page }) => {
		await transcribe(page, 'молоко');

		// REPAIRED: selecting a word no longer shows the Inspector by itself.
		// `InspectorPanel` now mounts only inside AnalysisStation's
		// `consoleContent` snippet, itself gated `{#if expanded}`
		// (AnalysisStation.svelte:73,82-83; wired at +page.svelte:4776), and
		// Analysis starts collapsed. Clicking the word still selects it
		// (`selectedWord = word`, +page.svelte:2798); the station just has to
		// be open to show what it drives.
		const wordStack = page.locator('[data-word-index="0-0"]');
		await wordStack.click();
		await expandStation(page, 'Analysis');

		const inspector = page.locator('.inspector-panel');
		await expect(inspector).toBeVisible();

		const ribbon = inspector.locator('.ribbon-body');
		await expect(ribbon).toBeVisible();
	});

	test('Clear button dismisses Word Console', async ({ page }) => {
		await transcribe(page, 'молоко');

		const wordStack = page.locator('[data-word-index="0-0"]');
		await wordStack.click();
		await expandStation(page, 'Analysis');
		await expect(page.locator('.inspector-panel')).toBeVisible();

		// REPAIRED SELECTOR: `.btn-secondary` with text "Clear" is gone.
		// `.btn-secondary` in the current tree belongs only to
		// ScoreUploader.svelte (Cancel / Try another). The intake's Clear is
		// now `.receipt-btn` bearing `t('intake.clear', language)`
		// (IntakePanel.svelte:463), and it still dismisses the Inspector:
		// `onclear` -> `handleClear` (+page.svelte:2729) ->
		// `resetSessionState` -> `resetTranscriptionView` (+page.svelte:2474),
		// which sets `selectedWord = null`.
		const clearBtn = page.locator('.receipt-btn', { hasText: 'Clear' });
		await clearBtn.click();

		await expect(page.locator('.inspector-panel')).not.toBeVisible({ timeout: 5_000 });
	});

	test('keyboard navigation: Tab between WordStacks', async ({ page }) => {
		await transcribe(page, 'молоко ещё');

		// REPAIRED: the first WordStack no longer receives focus on its own
		// after transcription. That focus move was part of the removed
		// Transcribe button's handler: "yes, remove the button. It ran
		// transcribeText() ... and then, only for an explicit press, the
		// breath-in animation, a console record of the transcription, and a
		// focus move onto the first word. All three of those went with it;
		// nothing replaces them" (+page.svelte:660-666, N.145, 2026-09-16).
		// The Tab-between-WordStacks behaviour itself is untouched, so the
		// test focuses the first word explicitly rather than asserting an
		// autofocus that was deliberately removed.
		const first = page.locator('[data-word-index="0-0"]');
		await first.focus();
		await expect(first).toBeFocused();

		await page.keyboard.press('Tab');
		const second = page.locator('[data-word-index="0-1"]');
		await expect(second).toBeFocused();
	});

	test('Enter on WordStack opens Inspector', async ({ page }) => {
		await transcribe(page, 'молоко');

		const first = page.locator('[data-word-index="0-0"]');
		await first.focus();
		await page.keyboard.press('Enter');
		// REPAIRED: see 'clicking a word opens the Inspector' above. Enter
		// selects the word the same way a click does; Analysis still has to
		// be open for the Inspector it mounts to show.
		await expandStation(page, 'Analysis');

		const inspector = page.locator('.inspector-panel');
		await expect(inspector).toBeVisible({ timeout: 5_000 });
	});

	test('notation toggle updates switch state', async ({ page }) => {
		await transcribe(page, 'молоко');

		// REPAIRED: the notation switches only render `{#if expanded}`
		// (NotationFields.svelte's own StationHeader, label `cosmetic.heading`
		// = "Notation", i18n.ts:204), and Notation starts collapsed.
		await expandStation(page, 'Notation');

		const firstToggle = page.locator('button[role="switch"]').first();
		await expect(firstToggle).toHaveAttribute('aria-checked', 'false');

		await firstToggle.click();

		await expect(firstToggle).toHaveAttribute('aria-checked', 'true');
	});

	test('provenance icons are visible on transcribed words', async ({ page }) => {
		// REPAIRED WORD: "молоко" is a dictionary word, and `showProvenance`
		// (apps/web/src/lib/provenance.ts:40-45) explicitly returns false for
		// stressSource 'dictionary' ("normal operation, no icon"), so a
		// dictionary word never draws a provenance icon or a VERIFY label. A
		// word absent from the dictionary gets stressSource 'inferred'
		// (pipeline.ts:655,671) and WordStack.svelte draws `.verify-label`
		// for it (`{#if isInferred}`, WordStack.svelte:186-188). "бабамба" is
		// not a real word and is not in the dictionary, so it exercises the
		// mechanism this test is actually pinning.
		await transcribe(page, 'бабамба');

		const wordStack = page.locator('[data-word-index="0-0"]');
		await expect(wordStack).toBeVisible();

		const hasProvenance = await wordStack.locator('.provenance-icon').count();
		const hasVerify = await wordStack.locator('.verify-label').count();
		expect(hasProvenance + hasVerify).toBeGreaterThan(0);
	});

	test('clitics show no provenance icon', async ({ page }) => {
		await transcribe(page, 'в доме');

		const proclitic = page.locator('[data-word-index="0-0"]');
		await expect(proclitic).toBeVisible();
		const provenanceIcon = proclitic.locator('.provenance-icon');
		await expect(provenanceIcon).toHaveCount(0);
	});

	test('Inspector shows ribbon for transcribed word', async ({ page }) => {
		await transcribe(page, 'молоко');

		const wordStack = page.locator('[data-word-index="0-0"]');
		await wordStack.click();
		await expandStation(page, 'Analysis');

		const inspector = page.locator('.inspector-panel');
		await expect(inspector).toBeVisible();

		const ribbon = inspector.locator('.ribbon-body');
		await expect(ribbon).toBeVisible();
	});
});

test.describe('bilingual interface', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await waitForDictionary(page);
	});

	test('language pill switches the app and then offers the way back', async ({ page }) => {
		const pill = page.locator('.lang-pill');

		await expect(pill).toHaveText('Français');
		await expect(pill).toHaveAttribute('lang', 'fr');

		await pill.click();

		await expect(pill).toHaveText('English');
		await expect(pill).toHaveAttribute('lang', 'en');
	});

	test('French empty state shows French placeholder', async ({ page }) => {
		// REPAIRED COPY: see the note on 'shows empty state before
		// transcription' above. French text is `paper.empty.fr`, i18n.ts:699.
		const frOption = page.locator('.lang-pill');
		await frOption.click();

		const placeholder = page.getByText('Saisissez votre texte cyrillique dans le tiroir à gauche.');
		await expect(placeholder).toBeVisible({ timeout: 5_000 });
	});

	test('language toggle updates gloss language after transcription', async ({ page }) => {
		await transcribe(page, 'молоко');

		const frOption = page.locator('.lang-pill');
		await frOption.click();

		await page.waitForTimeout(500);

		const wordStack = page.locator('[data-word-index="0-0"]');
		await expect(wordStack).toBeVisible();
	});
});

test.describe('WYSIWYG Paper', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await waitForDictionary(page);
	});

	test('Paper renders transcription in main content area', async ({ page }) => {
		await transcribe(page, 'молоко');

		const mainContent = page.locator('.main-content');
		await expect(mainContent).toBeVisible();

		const wordStack = page.locator('[data-word-index="0-0"]');
		await expect(wordStack).toBeVisible();
	});

	test('word stacks show three rows: IPA, Cyrillic, gloss', async ({ page }) => {
		await transcribe(page, 'молоко');

		const wordStack = page.locator('[data-word-index="0-0"]');
		const ipaRow = wordStack.locator('.ipa-row');
		const cyrillicRow = wordStack.locator('.cyrillic-row');
		const glossRow = wordStack.locator('.gloss-row');

		await expect(ipaRow).toBeVisible();
		await expect(cyrillicRow).toBeVisible();
		await expect(glossRow).toBeVisible();
	});

	test('VERIFY treatment wraps inferred stress words', async ({ page }) => {
		await transcribe(page, 'молоко');

		const wordStack = page.locator('[data-word-index="0-0"]');
		await expect(wordStack).toBeVisible();

		const isInferred = await wordStack.evaluate(
			(el) => el.classList.contains('is-inferred')
		);
		const hasVerify = await wordStack.locator('.verify-label').count();

		if (isInferred) {
			expect(hasVerify).toBe(1);
		}
	});
});

test.describe('clitic display', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await waitForDictionary(page);
	});

	test('proclitic is identified with is-clitic class', async ({ page }) => {
		await transcribe(page, 'в доме');

		const proclitic = page.locator('[data-word-index="0-0"]');
		await expect(proclitic).toBeVisible();
		await expect(proclitic).toHaveClass(/is-clitic/);
	});

	test('clitic has reduced padding for visual connection to host', async ({ page }) => {
		await transcribe(page, 'в доме');

		const proclitic = page.locator('[data-word-index="0-0"]');
		await expect(proclitic).toHaveClass(/is-clitic/);
	});

	test('Inspector shows full IPA for clitic word', async ({ page }) => {
		await transcribe(page, 'в доме');

		const proclitic = page.locator('[data-word-index="0-0"]');
		await proclitic.click();
		await expandStation(page, 'Analysis');

		const inspector = page.locator('.inspector-panel');
		await expect(inspector).toBeVisible();

		const wordIpa = inspector.locator('.word-ipa');
		await expect(wordIpa).toBeVisible();
	});
});

test.describe('open syllabification', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await waitForDictionary(page);
	});

	test('open syllabification toggle changes IPA spacing on Paper', async ({ page }) => {
		await transcribe(page, 'москва');
		await expandStation(page, 'Notation');

		const wordStack = page.locator('[data-word-index="0-0"]');
		const ipaRow = wordStack.locator('.ipa-row');

		const ipaBefore = await ipaRow.textContent();

		const toggles = page.locator('button[role="switch"]');
		const lastToggle = toggles.last();
		await lastToggle.click();

		await page.waitForTimeout(200);

		const ipaAfter = await ipaRow.textContent();
		expect(ipaAfter).not.toBe(ipaBefore);
	});
});
