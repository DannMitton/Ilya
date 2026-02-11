import { test, expect } from '@playwright/test';

// Helper: wait for the dictionary to finish loading
async function waitForDictionary(page: import('@playwright/test').Page) {
	await page.locator('.status-ok').waitFor({ state: 'visible', timeout: 45_000 });
}

// Helper: type text and transcribe
async function transcribe(page: import('@playwright/test').Page, text: string) {
	const textarea = page.locator('textarea');
	await textarea.fill(text);
	const btn = page.locator('.transcribe-btn');
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
		const placeholder = page.getByText('Paste Russian text and click Transcribe to begin.');
		await expect(placeholder).toBeVisible();
	});

	test('transcribes Russian text and shows IPA on Paper', async ({ page }) => {
		await transcribe(page, 'молоко');

		const wordStack = page.locator('[data-word-index="0-0"]');
		await expect(wordStack).toBeVisible();

		const cyrillic = wordStack.locator('.cyrillic');
		await expect(cyrillic).toContainText('молоко');

		const ipa = wordStack.locator('.ipa');
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

		const ribbon = inspector.locator('.ribbon');
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

		const provenance = page.locator('[data-word-index="0-0"] .provenance');
		await expect(provenance).toBeVisible();

		const label = await provenance.getAttribute('aria-label');
		expect(label?.length).toBeGreaterThan(0);
	});

	test('clitics show no provenance icon', async ({ page }) => {
		await transcribe(page, 'в доме');

		const proclitic = page.locator('[data-word-index="0-0"]');
		await expect(proclitic).toBeVisible();
		const provenanceIcon = proclitic.locator('.provenance');
		await expect(provenanceIcon).toHaveCount(0);
	});

	test('Inspector shows ribbon for transcribed word', async ({ page }) => {
		await transcribe(page, 'молоко');

		const wordStack = page.locator('[data-word-index="0-0"]');
		await wordStack.click();

		const inspector = page.locator('.inspector-panel');
		await expect(inspector).toBeVisible();

		const ribbon = inspector.locator('.ribbon');
		await expect(ribbon).toBeVisible();
	});
});

test.describe('print route', () => {
	test('print route exists and renders', async ({ page }) => {
		await page.goto('/print');
		const heading = page.getByText('Ilya — Print View');
		await expect(heading).toBeVisible();
	});
});
