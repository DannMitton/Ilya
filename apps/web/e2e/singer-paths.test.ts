import { test, expect } from '@playwright/test';
import path from 'path';
import { waitForDictionary, transcribe, expandStation } from './helpers';

/*
 * NEW COVERAGE (branch `audit`, task 2). Each test pins one singer path that
 * core-loop.test.ts did not reach. See the note in core-loop.test.ts on why
 * the viewport is widened: the chromium project's default 1280px runs the
 * phone layout, and every one of these tests targets the desk drawer.
 */
test.use({ viewport: { width: 1440, height: 900 } });

test.describe('opening a score', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await waitForDictionary(page);
	});

	test('opening a MusicXML score through the upload UI shows the score and its transcription', async ({ page }) => {
		// REUSED FIXTURE: apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml,
		// already in the tree for the score-parser/ingestion package.
		// THE ONE PICKER: the intake's hidden file input, IntakePanel.svelte:499-505,
		// class `hidden-input`, `accept` is N.70's list (.mnx, .json, .xml,
		// .musicxml, .mxl, .musx, .mscz, .pdf, image/*).
		const fixture = path.resolve(process.cwd(), 'src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml');
		await page.locator('input[type="file"].hidden-input').setInputFiles(fixture);

		// The score's receipt (IntakePanel.svelte:469-473, tag `upload.watermark` = "score").
		await expect(page.locator('.receipt-score')).toBeVisible({ timeout: 10_000 });

		// The score's own words fill the poem field and transcribe themselves,
		// via `flushText()` (+page.svelte's ingestion path).
		await page.waitForSelector('[data-word-index="0-0"]', { timeout: 10_000 });
		const wordCount = await page.locator('[data-word-index]').count();
		expect(wordCount).toBeGreaterThan(1);

		const textarea = page.locator('textarea.text-input');
		await expect(textarea).not.toHaveValue('');
	});
});

test.describe('correcting a word', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await waitForDictionary(page);
	});

	test('correcting a word\'s gloss in the Inspector sticks', async ({ page }) => {
		// The editable gloss cell lives in the Inspector's dictionary
		// expansion, InspectorPanel.svelte:1038-1043 (`.dict-gloss-input`),
		// reached through the `.dict-button` (t('inspector.dictionary')).
		// `handleGlossInput` (InspectorPanel.svelte:849-857) calls
		// `onglossoverride` on every keystroke, which +page.svelte wires to
		// `doc.glossOverrides`, and `WordStack.svelte`'s `displayGloss`
		// (WordStack.svelte:87-89) prefers the override over the dictionary
		// gloss.
		await transcribe(page, 'молоко');
		const wordStack = page.locator('[data-word-index="0-0"]');
		await wordStack.click();
		await expandStation(page, 'Analysis');

		await page.locator('.dict-button').click();
		const glossInput = page.locator('.dict-gloss-input');
		await expect(glossInput).toBeVisible();
		await expect(glossInput).toHaveValue('milk');

		await glossInput.fill('MY CORRECTION');
		await expect(wordStack.locator('.gloss-row')).toHaveText('MY CORRECTION');

		// It sticks: closing the word and reselecting it still shows the
		// corrected gloss, and it survives a reload once the autosave has had
		// a moment to run.
		await wordStack.click();
		await page.waitForTimeout(300);
		await wordStack.click();
		await expect(wordStack.locator('.gloss-row')).toHaveText('MY CORRECTION');

		await page.waitForTimeout(2_000);
		await page.reload();
		await waitForDictionary(page);
		await page.waitForSelector('[data-word-index="0-0"]', { timeout: 10_000 });
		await expect(page.locator('[data-word-index="0-0"] .gloss-row')).toHaveText('MY CORRECTION');
	});
});

test.describe('bilingual Fit and Insights', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await waitForDictionary(page);
	});

	test('switching EN/FR updates the Fit pane\'s uncalibrated message', async ({ page }) => {
		// The tab is internally 'shane' and reads "Markup" / "Annotation" in
		// the drawn UI (`tab.markedScore`, i18n.ts:118), a surprise against
		// AGENTS.md's "the user-facing tab is Fit... never translated";
		// see the audit memo. This test pins what actually renders.
		await page.getByRole('tab', { name: 'Markup' }).click();

		const empty = page.locator('.profile-empty');
		await expect(empty).toHaveText('Calibrate your voice to begin.');

		await page.locator('.lang-pill').click();
		await expect(empty).toHaveText('Calibrez votre voix pour commencer.');
	});

	test('switching EN/FR updates the Insights pane\'s uncalibrated message', async ({ page }) => {
		await page.getByRole('tab', { name: 'Insights' }).click();

		// `insights.identityUncalibrated` (i18n.ts:1466) fills "Insights for
		// {voice} · not calibrated", but the string arrives at this header as
		// the `poet` prop, and TitleHeader.svelte:60 uppercases every poet
		// line it draws (`poet.trim().toUpperCase()`), so the DOM text is
		// genuinely all caps: a real rendering step, not a stale expectation.
		await page.waitForTimeout(500);
		await expect(page.locator('.metadata-line')).toContainText('NOT CALIBRATED');

		await page.locator('.lang-pill').click();
		await expect(page.locator('.metadata-line')).toContainText('SANS CALIBRATION');
	});
});

test.describe('the library', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await waitForDictionary(page);
	});

	test('a song saves to the library and reopens after a reload', async ({ page }) => {
		// SONGS lives under the collapsed "Piece" band as "Repertoire"
		// (`songs.heading`, i18n.ts:1411), inside `SongList.svelte`. There is
		// no explicit Save: every song autosaves as the singer types (the
		// legacy single-song driver has no New song button; the current
		// driver does, once there is more than one song,
		// SongList.svelte:190-192, `plural`).
		await transcribe(page, 'молоко');
		await expandStation(page, 'Piece');
		await expandStation(page, 'Repertoire');

		await page.locator('.new-btn').click();
		// A moment for the new song's own (empty) document to mount before
		// typing into it, or the keystrokes can land while the old song is
		// still the active document.
		await page.waitForTimeout(500);
		await transcribe(page, 'вода');
		// Give the autosave a moment before the reload exercises IndexedDB
		// rather than an in-memory value that never left the tab.
		await page.waitForTimeout(2_000);

		await page.reload();
		await waitForDictionary(page);
		await page.waitForSelector('[data-word-index="0-0"]', { timeout: 10_000 });
		await expect(page.locator('textarea.text-input')).toHaveValue('вода');

		await expandStation(page, 'Piece');
		await expandStation(page, 'Repertoire');
		const rows = page.locator('.song-open');
		await expect(rows).toHaveCount(2);

		await page.locator('.song-open', { hasText: 'молоко' }).click();
		await expect(page.locator('textarea.text-input')).toHaveValue('молоко');
	});
});

test.describe('Learn and Guide', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await waitForDictionary(page);
	});

	test('Learn and Guide open and show their first heading in English and French', async ({ page }) => {
		await page.getByRole('button', { name: 'Learn', exact: true }).click();
		await expect(page.locator('#learn-title')).toHaveText('Russian Lyric Diction for Singers');

		await page.getByRole('button', { name: 'Guide', exact: true }).click();
		await expect(page.locator('main h1').first()).toHaveText('Guide');

		await page.locator('.lang-pill').click();
		await expect(page.locator('main h1').first()).toHaveText('Guide');

		await page.getByRole('button', { name: 'Leçons', exact: true }).click();
		await expect(page.locator('#learn-title')).toHaveText('La diction lyrique russe pour chanteurs');
	});
});

test.describe('Fit with no calibration', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await waitForDictionary(page);
	});

	test('Fit shows its honest empty state with no calibration', async ({ page }) => {
		// `profile.emptyState`, i18n.ts:1190. Drawn by MarkupPane.svelte:1148-1149
		// only in the pre-calibration branch, so its presence is itself the
		// singer-visible signal that nothing has been measured yet. No
		// microphone is touched.
		await page.getByRole('tab', { name: 'Markup' }).click();

		const empty = page.locator('.profile-empty');
		await expect(empty).toBeVisible();
		await expect(empty).toHaveText('Calibrate your voice to begin.');

		// The calibration invitation is offered, never forced. It lives in
		// the drawer's own "Voice" station (VoiceAnchor.svelte, wired at
		// +page.svelte), not inside the Fit pane itself, and Voice starts
		// collapsed.
		await expandStation(page, 'Voice');
		await expect(page.getByRole('button', { name: 'Calibrate', exact: true })).toBeVisible();
	});
});
