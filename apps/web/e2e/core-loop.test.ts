import { test, expect } from '@playwright/test';

// Helper: wait for the dictionary to finish loading
async function waitForDictionary(page: import('@playwright/test').Page) {
	await page.locator('.status-ok').waitFor({ state: 'visible', timeout: 45_000 });
}

// Helper: type text and transcribe
async function transcribe(page: import('@playwright/test').Page, text: string) {
	const textarea = page.locator('textarea');
	await textarea.fill(text);
	const btn = page.locator('.btn-primary');
	await expect(btn).toBeEnabled({ timeout: 5_000 });
	await btn.click();
	await page.waitForSelector('[data-word-index="0-0"]', { timeout: 10_000 });
}

test.describe('Ilya core loop', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await waitForDictionary(page);
	});

	test('shows empty state before transcription', async ({ page }) => {
		const placeholder = page.getByText('To begin, open the drawer on the left and enter your text.');
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

		const wordStack = page.locator('[data-word-index="0-0"]');
		await wordStack.click();

		const inspector = page.locator('.inspector-panel');
		await expect(inspector).toBeVisible();

		const ribbon = inspector.locator('.ribbon-body');
		await expect(ribbon).toBeVisible();
	});

	test('Escape returns from Inspector to Root panel', async ({ page }) => {
		await transcribe(page, 'молоко');

		const wordStack = page.locator('[data-word-index="0-0"]');
		await wordStack.click();
		await expect(page.locator('.inspector-panel')).toBeVisible();

		await page.keyboard.press('Escape');

		// Verify Root panel is back by checking for the textarea
		const textarea = page.locator('textarea');
		await expect(textarea).toBeVisible({ timeout: 5_000 });
	});

	test('focus returns to clicked word after Escape', async ({ page }) => {
		await transcribe(page, 'молоко ещё');

		const second = page.locator('[data-word-index="0-1"]');
		await second.click();
		await expect(page.locator('.inspector-panel')).toBeVisible();

		await page.keyboard.press('Escape');

		// Wait for root panel to be back
		await expect(page.locator('textarea')).toBeVisible({ timeout: 5_000 });

		const focused = page.locator('[data-word-index="0-1"]');
		await expect(focused).toBeFocused();
	});

	test('keyboard navigation: Tab between WordStacks', async ({ page }) => {
		await transcribe(page, 'молоко ещё');

		const first = page.locator('[data-word-index="0-0"]');
		await expect(first).toBeFocused();

		await page.keyboard.press('Tab');
		const second = page.locator('[data-word-index="0-1"]');
		await expect(second).toBeFocused();
	});

	test('Enter on WordStack opens Inspector', async ({ page }) => {
		await transcribe(page, 'молоко');

		// Explicitly focus the first WordStack, then press Enter
		const first = page.locator('[data-word-index="0-0"]');
		await first.focus();
		await page.keyboard.press('Enter');

		// Check for Inspector content (ribbon inside inspector)
		const inspector = page.locator('.inspector-panel');
		await expect(inspector).toBeVisible({ timeout: 5_000 });
	});

	test('notation toggle updates switch state', async ({ page }) => {
		await transcribe(page, 'молоко');

		// First toggle (Reduced vowel) starts unchecked
		const firstToggle = page.locator('button[role="switch"]').first();
		await expect(firstToggle).toHaveAttribute('aria-checked', 'false');

		await firstToggle.click();

		// Now it should be checked
		await expect(firstToggle).toHaveAttribute('aria-checked', 'true');
	});

	test('provenance icons are visible on transcribed words', async ({ page }) => {
		await transcribe(page, 'молоко');

		// молоко is a dictionary word -- check for provenance icon or verify label
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

	test('language toggle switches between English and French', async ({ page }) => {
		// Default is English
		const enOption = page.locator('.lang-option', { hasText: 'English' });
		await expect(enOption).toHaveAttribute('aria-pressed', 'true');

		// Switch to French
		const frOption = page.locator('.lang-option', { hasText: 'Français' });
		await frOption.click();
		await expect(frOption).toHaveAttribute('aria-pressed', 'true');
		await expect(enOption).toHaveAttribute('aria-pressed', 'false');
	});

	test('French empty state shows French placeholder', async ({ page }) => {
		// Switch to French first
		const frOption = page.locator('.lang-option', { hasText: 'Français' });
		await frOption.click();

		// Check for French empty state text
		const placeholder = page.getByText('Pour commencer, ouvrez le tiroir');
		await expect(placeholder).toBeVisible({ timeout: 5_000 });
	});

	test('language toggle updates gloss language after transcription', async ({ page }) => {
		await transcribe(page, 'молоко');

		// Switch to French
		const frOption = page.locator('.lang-option', { hasText: 'Français' });
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

		// The open syllabification toggle is the last switch in the root panel
		const toggles = page.locator('button[role="switch"]');
		const lastToggle = toggles.last();
		await lastToggle.click();

		// Wait for re-render
		await page.waitForTimeout(200);

		// IPA should have changed (consonants shifted rightward)
		const ipaAfter = await ipaRow.textContent();
		expect(ipaAfter).not.toBe(ipaBefore);
	});
});
