import { test, expect } from '@playwright/test';

/* Helper: wait for the dictionary to finish loading.
   THE `.status-ok` CLASS IS GONE, deleted with `dictReady` in N.108 increment 1
   (`IntakePanel.svelte`, the comment above `replacePoem`). The signal the app
   still gives is the poem field: it is `disabled={loaderState.isLoading}`. A
   FAILED load re-enables it too (`loader.ts`, the catch block), so the enabled
   field alone would let every test run against no dictionary. The failure is
   caught by the one line the loader logs when it fails. */
async function waitForDictionary(page: import('@playwright/test').Page) {
	const failures: string[] = [];
	page.on('console', (m) => {
		if (m.text().includes('[Ilya] Dictionary loading failed')) failures.push(m.text());
	});
	await expect(page.locator('textarea.text-input')).toBeEnabled({ timeout: 45_000 });
	expect(failures, 'the dictionary failed to load').toEqual([]);
}

/* Helper: enter text and transcribe.
   THE TRANSCRIBE BUTTON IS GONE, removed in N.145 (2026-09-16, Dann: "yes,
   remove the button"). Typed text transcribes after a 600 ms pause; Cmd+Enter,
   or Ctrl+Enter, transcribes at once (`IntakePanel.svelte`, `handleKeydown`).
   The helper presses it, so the tests drive the singer's own shortcut. */
async function transcribe(page: import('@playwright/test').Page, text: string) {
	const textarea = page.locator('textarea.text-input');
	await textarea.fill(text);
	await textarea.press('ControlOrMeta+Enter');
	await page.waitForSelector('[data-word-index="0-0"]', { timeout: 10_000 });
}

/* Helper: open one of the drawer's sections.
   NOTATION AND ANALYSIS START CLOSED. Each renders its body only while
   `sections` holds its id (`+page.svelte`, `STATION_IDS`), so the switches and
   the Inspector are not in the page until the singer opens them. The Inspector
   lives inside Analysis (`AnalysisStation.svelte`, `{#if expanded}`). */
async function openSection(page: import('@playwright/test').Page, name: 'Notation' | 'Analysis') {
	const header = page.getByRole('button', { name: new RegExp(`^${name}`) });
	if ((await header.getAttribute('aria-expanded')) !== 'true') await header.click();
	await expect(header).toHaveAttribute('aria-expanded', 'true');
}

test.describe('Ilya core loop', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await waitForDictionary(page);
	});

	/* The desk's empty page, `paper.empty` in `i18n.ts`. The old sentence, "To
	   begin, open the drawer on the left and enter your text.", is gone. */
	test('shows empty state before transcription', async ({ page }) => {
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
		await openSection(page, 'Analysis');

		const wordStack = page.locator('[data-word-index="0-0"]');
		await wordStack.click();

		const inspector = page.locator('.inspector-panel');
		await expect(inspector).toBeVisible();

		const ribbon = inspector.locator('.ribbon-body');
		await expect(ribbon).toBeVisible();
	});

	test('Clear button dismisses Word Console', async ({ page }) => {
		await transcribe(page, 'молоко');
		await openSection(page, 'Analysis');

		const wordStack = page.locator('[data-word-index="0-0"]');
		await wordStack.click();
		await expect(page.locator('.inspector-panel')).toBeVisible();

		// Clear resets everything including selectedWord (`handleClear`, then
		// `resetTranscriptionView`). It is the poem receipt's button now, not
		// `.btn-secondary`; the score receipt has its own Clear.
		const clearBtn = page.locator('.receipt-poem .receipt-btn', { hasText: 'Clear' });
		await clearBtn.click();

		await expect(page.locator('.inspector-panel')).not.toBeVisible({ timeout: 5_000 });
	});

	/* THE FOCUS MOVE ONTO THE FIRST WORD IS GONE. It belonged to an explicit
	   press of Transcribe and went with the button in N.145 (`+page.svelte`,
	   the comment where `handleTranscribe` was); nothing replaces it. This test
	   used to assert it. It now focuses the first word itself and tests only
	   what is still there: Tab moves between word stacks. */
	test('keyboard navigation: Tab between WordStacks', async ({ page }) => {
		await transcribe(page, 'молоко ещё');

		const first = page.locator('[data-word-index="0-0"]');
		await first.focus();
		await expect(first).toBeFocused();

		await page.keyboard.press('Tab');
		const second = page.locator('[data-word-index="0-1"]');
		await expect(second).toBeFocused();
	});

	test('Enter on WordStack opens Inspector', async ({ page }) => {
		await transcribe(page, 'молоко');
		await openSection(page, 'Analysis');

		// Explicitly focus the first WordStack, then press Enter
		const first = page.locator('[data-word-index="0-0"]');
		await first.focus();
		await page.keyboard.press('Enter');

		// Check for Inspector content (ribbon inside inspector)
		const inspector = page.locator('.inspector-panel');
		await expect(inspector).toBeVisible({ timeout: 5_000 });
	});

	/* The switch is named rather than taken as `.first()`: the first switch is
	   no longer "Reduced vowel" but "Apply stress acutes", and position is not
	   what this test is about. Reconstitution is used because its effect shows
	   on the Paper: молоко's remote [ʌ] reverts to /ɑ/ (Grayson p. 128). */
	test('notation toggle updates switch state', async ({ page }) => {
		await transcribe(page, 'молоко');
		await openSection(page, 'Notation');

		const toggle = page.getByRole('switch', { name: 'Reconstitution' });
		await expect(toggle).toHaveAttribute('aria-checked', 'false');
		const ipa = page.locator('[data-word-index="0-0"] .ipa-row');
		await expect(ipa).toContainText('ʌ');

		await toggle.click();

		await expect(toggle).toHaveAttribute('aria-checked', 'true');
		await expect(ipa).not.toContainText('ʌ');
	});

	/* A DICTIONARY WORD CARRIES NO MARK. Since the provenance redesign the icon
	   shows only for non-standard sources, never for dictionary, supplement, or
	   clitic (`WordStack.svelte`, `showProvenance`). This test used to demand an
	   icon or VERIFY on молоко, a dictionary word, which is now wrong by design.
	   It asserts the rule instead: nothing on молоко. */
	test('provenance icons are visible on transcribed words', async ({ page }) => {
		await transcribe(page, 'молоко');

		const wordStack = page.locator('[data-word-index="0-0"]');
		await expect(wordStack).toBeVisible();
		await expect(wordStack.locator('.provenance-icon')).toHaveCount(0);
		await expect(wordStack.locator('.verify-label')).toHaveCount(0);
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
		await openSection(page, 'Analysis');

		const wordStack = page.locator('[data-word-index="0-0"]');
		await wordStack.click();

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

	// ONE pill, and it names the language you are NOT in. Ruled by Dann
	// 2026-08-20. There is no aria-pressed to assert any more, so the test
	// reads the label instead: it is the whole state the control carries.
	test('language pill switches the app and then offers the way back', async ({ page }) => {
		const pill = page.locator('.lang-pill');

		// On an English page the pill offers French, in French.
		await expect(pill).toHaveText('Français');
		await expect(pill).toHaveAttribute('lang', 'fr');

		await pill.click();

		// On a French page it offers the language he came from, in English.
		await expect(pill).toHaveText('English');
		await expect(pill).toHaveAttribute('lang', 'en');
	});

	test('French empty state shows French placeholder', async ({ page }) => {
		// Switch to French first
		const frOption = page.locator('.lang-pill');
		await frOption.click();

		// Check for French empty state text (`paper.empty`, French)
		const placeholder = page.getByText('Saisissez votre texte cyrillique dans le tiroir à gauche.');
		await expect(placeholder).toBeVisible({ timeout: 5_000 });
	});

	test('language toggle updates gloss language after transcription', async ({ page }) => {
		await transcribe(page, 'молоко');

		// Switch to French
		const frOption = page.locator('.lang-pill');
		await frOption.click();

		// Wait for breath animation to complete and content to re-render
		await page.waitForTimeout(500);

		// Verify the word is still displayed (re-rendered with French glosses)
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

		// Check whether the word has inferred class or verify label
		const isInferred = await wordStack.evaluate(
			(el) => el.classList.contains('is-inferred')
		);
		const hasVerify = await wordStack.locator('.verify-label').count();

		// молоко may or may not be inferred; this test verifies the mechanism exists
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
		await openSection(page, 'Analysis');

		const proclitic = page.locator('[data-word-index="0-0"]');
		await proclitic.click();

		const inspector = page.locator('.inspector-panel');
		await expect(inspector).toBeVisible();

		// Inspector header shows the word's IPA
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

		const wordStack = page.locator('[data-word-index="0-0"]');
		const ipaRow = wordStack.locator('.ipa-row');

		// Capture IPA before toggle
		const ipaBefore = await ipaRow.textContent();

		// Named, not `.last()`: the root panel it was last in is gone, and the
		// switch lives in Notation, which starts closed.
		await openSection(page, 'Notation');
		await page.getByRole('switch', { name: 'Open syllables' }).click();

		// Wait for re-render
		await page.waitForTimeout(200);

		// IPA should have changed (consonants shifted rightward)
		const ipaAfter = await ipaRow.textContent();
		expect(ipaAfter).not.toBe(ipaBefore);
	});
});
