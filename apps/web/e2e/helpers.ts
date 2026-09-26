import { expect, type Page } from '@playwright/test';

/**
 * Wait for the dictionary to finish loading.
 *
 * `.status-ok` was removed at commit 5f6a2f3 (N.108-5); see the comment at
 * apps/web/src/lib/components/Drawer/IntakePanel.svelte:233. The intake
 * textarea's `disabled` attribute is bound to `loaderState.isLoading`, so an
 * enabled field is the app's own signal that loading has ended. A FAILED load
 * re-enables it too (`loader.ts`, the catch block), so the enabled field alone
 * would let every test run against no dictionary; the one line the loader
 * logs on failure catches that. (From the JVoice thread's repair, 95f41c2.)
 */
export async function waitForDictionary(page: Page): Promise<void> {
	const failures: string[] = [];
	page.on('console', (m) => {
		if (m.text().includes('[Ilya] Dictionary loading failed')) failures.push(m.text());
	});
	await expect(page.locator('textarea.text-input')).toBeEnabled({ timeout: 45_000 });
	expect(failures, 'the dictionary failed to load').toEqual([]);
}

/**
 * Type text into the intake and wait for the transcription to appear.
 *
 * THERE IS NO TRANSCRIBE BUTTON ANY MORE. `handleTranscribe` was removed
 * 2026-09-16 (N.145); see the comment at apps/web/src/routes/+page.svelte:660
 * ("yes, remove the button"). Typing now transcribes itself: `joinText`
 * (+page.svelte:3186) transcribes at once on paste and after a short quiet
 * pause (`QUIET_MS`) while typing. `.fill()` fires an `input` event, which
 * the field's `oninput` reads with `arrivalOf(e)`, so we simply wait out the
 * debounce by waiting for the first word to render.
 */
export async function transcribe(page: Page, text: string): Promise<void> {
	const textarea = page.locator('textarea.text-input');
	await textarea.fill(text);
	await page.waitForSelector('[data-word-index="0-0"]', { timeout: 10_000 });
}

/**
 * Expand a drawer station by its StationHeader label ("Notation",
 * "Analysis", ...), if it is not already expanded. Both stations render
 * their content only `{#if expanded}` (NotationFields.svelte, and
 * AnalysisStation.svelte:73), and both start collapsed in a fresh browser
 * context, so a test that needs the toggle switches (Notation) or the
 * Inspector (Analysis, which mounts InspectorPanel only inside its own
 * `{#if expanded}`, AnalysisStation.svelte:73-83) must open the station
 * first.
 */
export async function expandStation(page: Page, label: string): Promise<void> {
	const button = page.getByRole('button', { name: label, exact: true });
	const expanded = await button.getAttribute('aria-expanded');
	if (expanded !== 'true') {
		await button.click();
	}
}

/**
 * Click a word, then open the Analysis station so the Inspector it
 * conditionally mounts becomes visible. Selecting a word alone no longer
 * shows the Inspector: `InspectorPanel` renders inside AnalysisStation's
 * `consoleContent` snippet, which that component only renders
 * `{#if expanded}` (AnalysisStation.svelte:73,82-83). A fresh page loads
 * with Analysis collapsed.
 */
export async function openInspectorFor(page: Page, wordLocatorSelector: string): Promise<void> {
	await page.locator(wordLocatorSelector).click();
	await expandStation(page, 'Analysis');
}
