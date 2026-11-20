/**
 * N.203 lane 60 (Steps 1 to 3): the VOICE pane at rest, its seam to the wizard, and its doors, in a browser (no unit test mounts the wizard,
 * and the tree has no DOM test environment). Desk layout, the stub session (`?capture=stub`, development server only), no microphone.
 */
import { test, expect, type Page } from '@playwright/test';
import path from 'path';
import { expandStation } from './helpers';

test.use({ viewport: { width: 1440, height: 900 } });

const STORE_KEY = 'shane.profiles.v2';
const R = (f1: number, f2: number) => ({ f1, f2, confidence: 'high', f2Quality: 'clear', reading: 'captured', source: 'measured-user', plausibility: 'plausible' });
const NINE = { i: R(296, 1705), e: R(381, 1532), 'ɪ': R(393, 1600), 'ɨ': R(404, 1100), 'ɛ': R(577, 1311), a: R(711, 1113), 'ɑ': R(617, 1013), 'ʌ': R(616, 1167), o: R(489, 826) };

type Voice = { id: string; name: string; formants?: Record<string, unknown>; voiceType?: string };
async function open(page: Page, voices: Voice[] | null, room?: string) {
	const now = '2026-11-01T10:00:00.000Z';
	const store = voices && { version: 2, activeId: voices[0].id, voices: voices.map((v) => ({ createdAt: now, updatedAt: now, calibratedAt: now, formants: {}, ...v })) };
	await page.addInitScript(([s, r]) => { localStorage.setItem('ilya:language', 'en'); if (s) localStorage.setItem('shane.profiles.v2', s); if (r) (window as unknown as { __ilyaStubReadiness?: string }).__ilyaStubReadiness = r; }, [store ? JSON.stringify(store) : null, room ?? ''] as const);
	await page.goto('/?capture=stub');
	await expect(page.locator('textarea.text-input')).toBeEnabled({ timeout: 45_000 });
	await expandStation(page, 'Voice');
}
const stored = (page: Page) => page.evaluate((k) => JSON.parse(localStorage.getItem(k)!), STORE_KEY);
const sentence = (page: Page) => page.locator('.vp-sentence');
const door = (page: Page, name: RegExp) => page.getByRole('button', { name });

test.describe('the VOICE pane at rest', () => {
	test('with no voice saved it is the first-launch form, and Start names the voice and shows the pane', async ({ page }) => {
		await open(page, null);
		await expect(page.locator('.vp-door')).toHaveCount(0);
		const field = page.locator('#ps-first-name');
		await field.fill('Dann');
		await page.getByRole('button', { name: 'Start', exact: true }).click();
		await expect(sentence(page)).toHaveText(/^Record your ten vowels/);
		expect((await stored(page)).voices[0].name).toBe('Dann');
		await expect(door(page, /^record your vowels$/i)).toBeVisible();
		await expect(door(page, /^your vowel space$/i)).toHaveCount(0);
	});

	/* Lane 65, Step 1 (Dann 2026-11-17 15:04, his option 2): the switcher; three rows of equal weight; the sentence; the doors. */
	const ORDER = ['switcher', 'type-row', 'describeVoice', 'insightsShares', 'sentence', 'doors'];
	const paneOrder = (page: Page) => page.locator('.voice-pane').evaluate((el) => [...el.children].map((c) => {
		if (c.classList.contains('vp-sentence')) return 'sentence';
		if (c.classList.contains('vp-doors')) return 'doors';
		if (c.getAttribute('data-vp-row') === 'voiceType') return 'type-row';
		return c.getAttribute('data-station') ?? 'switcher';
	}));
	test('the pane’s children stand in the ruled order for a voice with no type, with a type, and with readings', async ({ page }) => {
		await open(page, [{ id: 'v', name: 'Dann' }]);
		expect(await paneOrder(page)).toEqual(ORDER);
		await page.getByRole('button', { name: /^choose a voice type$/i }).click();
		await page.getByRole('radio', { name: 'Bass', exact: true }).check();
		expect(await paneOrder(page)).toEqual(ORDER);
	});
	test('with a type chosen the row names the type, in the same order', async ({ page }) => {
		await open(page, [{ id: 'v', name: 'Dann', voiceType: 'bass' }]);
		expect(await paneOrder(page)).toEqual(ORDER);
		await expect(page.locator('[data-vp-row="voiceType"] .station-name')).toHaveText(/bass/i);
	});
	test('with readings stored the order is the same, and the doors name the state', async ({ page }) => {
		await open(page, [{ id: 'v', name: 'Dann', voiceType: 'bass', formants: NINE }]);
		expect(await paneOrder(page)).toEqual(ORDER);
		await expect(door(page, /^carry on recording$/i)).toBeVisible();
		await expect(door(page, /^your vowel space$/i)).toBeVisible();
	});
	test('the voice type row opens and closes the control in place, closed on arrival', async ({ page }) => {
		await open(page, [{ id: 'v', name: 'Dann' }]);
		const row = page.getByRole('button', { name: /^choose a voice type$/i });
		await expect(row).toHaveAttribute('aria-expanded', 'false');
		await expect(page.locator('#voice-type-body')).toHaveCount(0);
		await row.click();
		await expect(row).toHaveAttribute('aria-expanded', 'true');
		await expect(page.locator('#voice-type-body').getByRole('radio', { name: 'Bass', exact: true })).toBeVisible();
		await row.click();
		await expect(page.locator('#voice-type-body')).toHaveCount(0);
	});
	test('the voice type row is a full-width row like the two station rows', async ({ page }) => {
		await open(page, [{ id: 'v', name: 'Dann' }]);
		const w = (sel: string) => page.locator(`${sel} .station-disclosure`).evaluate((e) => Math.round(e.getBoundingClientRect().width));
		const type = await w('[data-vp-row="voiceType"]');
		expect(type).toBe(await w('[data-station="describeVoice"]'));
		expect(type).toBe(await w('[data-station="insightsShares"]'));
	});

	test('the type control in the pane writes the stored voice type, and the sentence and the doors follow', async ({ page }) => {
		await open(page, [{ id: 'v', name: 'Dann' }]);
		await page.getByRole('button', { name: /^choose a voice type$/i }).click();
		await page.getByRole('radio', { name: 'Bass', exact: true }).check();
		expect((await stored(page)).voices[0].voiceType).toBe('bass');
		await expect(sentence(page)).toHaveText('Ilya is using generic values for a bass voice until you record your own.');
		await expect(door(page, /^your vowel space$/i)).toBeVisible();
		// QUEUE row 167 (ruling of 2026-11-19) and lane 75, item 1: a contralto has generic values now, borrowed from the mezzo-soprano staff, the pane names that staff as it does for the five published types (the reason is the picker's note), and the door opens.
		await page.getByRole('radio', { name: 'Contralto', exact: true }).check();
		await expect(sentence(page)).toHaveText('Ilya is using generic values for a mezzo-soprano voice until you record your own.');
		await expect(door(page, /^your vowel space$/i)).toBeVisible();
		// "Not sure" takes no starting profile: the ratified invitation, and the door stays shut.
		await page.getByRole('radio', { name: 'Not sure', exact: true }).check();
		await expect(sentence(page)).toHaveText(/^Not knowing is a fine answer\./);
		await expect(door(page, /^your vowel space$/i)).toHaveCount(0);
	});

	test('the switcher in the pane changes the page’s voice, and the closed band follows', async ({ page }) => {
		await open(page, [{ id: 'a', name: 'Dann' }, { id: 'b', name: 'Studio' }]);
		await page.getByRole('button', { name: 'Dann, options' }).click();
		await page.locator('.ps-voice', { hasText: 'Studio' }).click();
		expect((await stored(page)).activeId).toBe('b');
		await page.getByRole('button', { name: /^voice$/i }).click(); // close the band: its line names the active voice
		await expect(page.getByText('Voice: Studio')).toBeVisible();
	});

	test('the door to recording is named for the state, and opens Welcome for a voice with nothing recorded', async ({ page }) => {
		await open(page, [{ id: 'v', name: 'Dann', voiceType: 'bass' }]);
		await door(page, /^record your vowels$/i).click();
		await expect(page.getByRole('button', { name: /^begin$/i })).toBeVisible();
		await page.locator('.takeover-back').click();
		await expect(sentence(page)).toBeVisible();
	});

	test('with nine recorded the pane says so and offers to carry on, and the door opens the capture screen', async ({ page }) => {
		await open(page, [{ id: 'v', name: 'Dann', voiceType: 'bass', formants: NINE }]);
		await expect(sentence(page)).toHaveText('You have recorded 9 of the 10 vowels. Ilya fills the last one from what you have recorded so far.');
		await door(page, /^carry on recording$/i).click();
		await expect(page.locator('.capture')).toBeVisible();
	});

	test('with the six anchors stored the pane says Ilya works out the rest (line 5b)', async ({ page }) => {
		const SIX = { i: R(296, 1705), e: R(381, 1532), 'ɛ': R(577, 1311), 'ɑ': R(617, 1013), o: R(489, 826), u: R(346, 804) };
		await open(page, [{ id: 'v', name: 'Dann', voiceType: 'bass', formants: SIX }]);
		await expect(sentence(page)).toHaveText('You have recorded 6 of the 10 vowels. Ilya works out the other 4 from your own vowels.');
	});

	test('with five of the six anchors stored the pane says Ilya fills the rest, not works it out', async ({ page }) => {
		const FIVE = { i: R(296, 1705), e: R(381, 1532), 'ɛ': R(577, 1311), 'ɑ': R(617, 1013), o: R(489, 826) };
		await open(page, [{ id: 'v', name: 'Dann', voiceType: 'bass', formants: FIVE }]);
		await expect(sentence(page)).toHaveText('You have recorded 5 of the 10 vowels. Ilya fills the other 5 from what you have recorded so far.');
	});

	test('Back to the ten vowels clears a pending Start over, so the summary does not come back asking it (review fix 3)', async ({ page }) => {
		const TEN = { ...NINE, u: R(346, 804) };
		await open(page, [{ id: 'v', name: 'Dann', voiceType: 'bass', formants: TEN }]);
		await door(page, /^your vowel space$/i).click();
		await page.getByRole('button', { name: /^start over$/i }).click();
		await expect(page.getByText('This clears every reading saved for this voice.')).toBeVisible();
		await page.getByRole('button', { name: /^back to the ten vowels$/i }).click();
		await expect(page.locator('.capture')).toBeVisible();
		await page.getByRole('button', { name: 'See your vowel space' }).click();
		await expect(page.locator('.vowel-sheet')).toBeVisible();
		await expect(page.getByText('This clears every reading saved for this voice.')).toHaveCount(0);
		await expect(page.getByRole('button', { name: /^start over$/i })).toBeVisible();
	});

	test('a request from rest lands on the asked screen even though the wizard was left stowed on the capture screen; Finish returns to the pane and writes nothing', async ({ page }) => {
		await open(page, [{ id: 'v', name: 'Dann', voiceType: 'bass', formants: NINE }]);
		await door(page, /^carry on recording$/i).click();
		await expect(page.locator('.capture')).toBeVisible();
		await page.locator('.takeover-back').click();
		await expect(sentence(page)).toBeVisible();
		await door(page, /^your vowel space$/i).click();
		await expect(page.locator('.vowel-sheet')).toBeVisible();
		await expect(page.locator('.capture')).toHaveCount(0);
		const before = (await stored(page)).voices[0];
		await page.getByRole('button', { name: /^finish$/i }).click();
		await expect(sentence(page)).toBeVisible();
		const after = (await stored(page)).voices[0];
		expect(after.calibratedAt).toBe(before.calibratedAt);
		expect(after.updatedAt).toBe(before.updatedAt);
	});

	/* N.203 lane 61, Step 1: the two doors that opened the takeover's characteristics screen are two stations that open in place. */
	for (const [label, name, id] of [['Describe your voice', /^describe your voice$/i, 'describe-voice-body'], ['What INSIGHTS shares, and how', /^what insights shares, and how$/i, 'insights-shares-body']] as const) {
		test(`"${label}" opens in place with no microphone and no takeover, and closes again; the voice's date does not move`, async ({ page }) => {
			await open(page, [{ id: 'v', name: 'Dann' }]);
			const header = page.getByRole('button', { name });
			await expect(header).toHaveAttribute('aria-expanded', 'false');
			await header.click();
			await expect(header).toHaveAttribute('aria-expanded', 'true');
			await expect(page.locator(`#${id}`)).toBeVisible();
			await expect(page.locator('.capture')).toHaveCount(0);
			await expect(page.getByRole('heading', { name: 'Voice characteristics' })).toHaveCount(0);
			await expect(sentence(page)).toBeVisible();
			await header.click();
			await expect(page.locator(`#${id}`)).toHaveCount(0);
			expect((await stored(page)).voices[0].calibratedAt).toBe('2026-11-01T10:00:00.000Z');
		});
	}

	test.describe('the test fry (N.203 lane 60, Step 4)', () => {
		const toFry = async (page: Page) => {
			await door(page, /^record your vowels$/i).click();
			await page.getByRole('button', { name: /^begin$/i }).click();
		};
		test('says what is coming before anything runs, and waits for Start', async ({ page }) => {
			await open(page, [{ id: 'v', name: 'Dann', voiceType: 'bass' }]);
			await toFry(page);
			await expect(page.getByText('First, Ilya listens to the room for a moment.')).toBeVisible();
			await page.waitForTimeout(1500);
			await expect(page.locator('[data-part]')).toHaveCount(0); // nothing started by itself
			await page.getByRole('button', { name: /^start$/i }).click();
			await expect(page.locator('[data-part]')).toHaveCount(3);
			await expect(page.locator('[data-part="quiet"] .name')).toHaveText('Quiet');
			await expect(page.getByText('Stay silent.')).toBeVisible();
			await expect(page.getByRole('button', { name: /^continue$/i })).toBeVisible({ timeout: 30_000 });
		});
		test('refuses a sound that is not fry: the line says so, Try again runs it again, Continue goes on, and the rate is not stored', async ({ page }) => {
			await open(page, [{ id: 'v', name: 'Dann', voiceType: 'bass' }], 'no-fry');
			await toFry(page);
			await page.getByRole('button', { name: /^start$/i }).click();
			await expect(page.getByText('Ilya heard the room, but no vocal fry.')).toBeVisible({ timeout: 30_000 });
			const rec = (await stored(page)).voices[0].readiness;
			expect(rec).toMatchObject({ measured: true, fryRateHz: null, fryRange: 'not-measured' });
			await page.getByRole('button', { name: /^try again$/i }).click();
			await expect(page.locator('[data-part]')).toHaveCount(3);
			await expect(page.getByText('Ilya heard the room, but no vocal fry.')).toBeVisible({ timeout: 30_000 });
			await page.getByRole('button', { name: /^continue$/i }).click();
			await expect(page.locator('.capture')).toBeVisible();
		});
		test('refusal, then Try again, then acceptance: the refusal clears, and the accepted rate is stored (amendment 16 in full)', async ({ page }) => {
			await open(page, [{ id: 'v', name: 'Dann', voiceType: 'bass' }], 'no-fry');
			await toFry(page);
			await page.getByRole('button', { name: /^start$/i }).click();
			const refusal = page.getByText('Ilya heard the room, but no vocal fry.');
			await expect(refusal).toBeVisible({ timeout: 30_000 });
			expect((await stored(page)).voices[0].readiness).toMatchObject({ measured: true, fryRateHz: null, fryRange: 'not-measured' });
			// The room changes: the stub switch reads its outcome once, so the test sets it on the session between the runs.
			await page.evaluate(() => { (window as unknown as { __ilyaStubSession: { readiness: string } }).__ilyaStubSession.readiness = 'clear'; });
			await page.getByRole('button', { name: /^try again$/i }).click();
			await expect(refusal).toHaveCount(0); // the refusal clears as the run starts
			await expect(page.getByText('Readiness check complete.')).toBeVisible({ timeout: 30_000 });
			await expect(page.getByRole('button', { name: /^try again$/i })).toHaveCount(0);
			const rec = (await stored(page)).voices[0].readiness;
			expect(rec).toMatchObject({ measured: true, fryRange: 'clear' });
			expect(rec.fryRateHz, 'the accepted rate is stored').toBe(48);
			await page.getByRole('button', { name: /^continue$/i }).click();
			await expect(page.locator('.capture')).toBeVisible();
		});
		test('Back during the run ends it and keeps nothing, and the run does not finish behind the singer’s back', async ({ page }) => {
			await open(page, [{ id: 'v', name: 'Dann', voiceType: 'bass' }]);
			await toFry(page);
			await page.getByRole('button', { name: /^start$/i }).click();
			await expect(page.locator('[data-part]')).toHaveCount(3);
			await page.locator('.takeover-back').click();
			expect((await stored(page)).voices[0].readiness).toBeUndefined();
			await page.waitForTimeout(7000); // longer than the whole run: nothing finishes behind the singer's back
			expect((await stored(page)).voices[0].readiness).toBeUndefined();
			await toFry(page); // a voice with nothing recorded meets Welcome again, then the "before" screen
			await expect(page.getByRole('button', { name: /^start$/i })).toBeVisible();
			await expect(page.locator('[data-part]')).toHaveCount(0);
		});
		test('one microphone visit spans the test fry and the first vowel: closed before Start, open from Start, still open on the capture screen, closed on Back', async ({ page }) => {
			await open(page, [{ id: 'v', name: 'Dann', voiceType: 'bass' }]);
			const visitOpen = () => page.evaluate(() => (window as unknown as { __ilyaStubSession: { visitOpen: boolean } }).__ilyaStubSession.visitOpen);
			await toFry(page);
			expect(await visitOpen(), 'nothing listens before Start').toBe(false);
			await page.getByRole('button', { name: /^start$/i }).click();
			await expect.poll(visitOpen).toBe(true);
			await page.getByRole('button', { name: /^continue$/i }).click({ timeout: 30_000 });
			await expect(page.locator('.capture')).toBeVisible();
			expect(await visitOpen(), 'the visit is not closed and reopened between the fry and the first vowel').toBe(true);
			await page.locator('.takeover-back').click();
			await expect.poll(visitOpen).toBe(false);
		});
	});
});

test.describe('a take is never orphaned by a remount (fix 1 of the review of 38ec37c2)', () => {
	test('four readings stored: door, Back, the door again (the screen remounts), Start, Back mid-take: the take ends, is recorded as cancelled, and nothing runs on behind the Drawer', async ({ page }) => {
		test.setTimeout(90_000);
		const FOUR = { i: R(296, 1705), e: R(381, 1532), u: R(346, 804), a: R(600, 1250) };
		await open(page, [{ id: 'v', name: 'Dann', voiceType: 'bass', formants: FOUR }]);
		const stub = <T,>(fn: (s: { visitOpen: boolean; starts: number }) => T) => page.evaluate(fn as never) as Promise<T>;
		await door(page, /^carry on recording$/i).click();
		await expect(page.locator('.capture')).toBeVisible();
		await page.locator('.takeover-back').click();
		await expect(sentence(page)).toBeVisible();
		await door(page, /^carry on recording$/i).click(); // a request from rest: the capture screen remounts
		await expect(page.locator('.capture')).toBeVisible();
		await page.locator('.main').click(); // Start: the count-in runs
		await expect(page.locator('.main')).toBeDisabled();
		await page.waitForTimeout(800);
		await page.locator('.takeover-back').click(); // Back mid-take
		await expect(sentence(page)).toBeVisible();
		await expect.poll(() => page.evaluate(() => (window as unknown as { __ilyaStubSession: { visitOpen: boolean } }).__ilyaStubSession.visitOpen)).toBe(false);
		const started = await page.evaluate(() => (window as unknown as { __ilyaStubSession: { starts: number } }).__ilyaStubSession.starts);
		await page.waitForTimeout(8000); // longer than the count-in and the sweep: nothing may run on
		expect(await page.evaluate(() => (window as unknown as { __ilyaStubSession: { starts: number } }).__ilyaStubSession.starts), 'no run was started behind the Drawer').toBe(started);
		const v = (await stored(page)).voices[0];
		expect(Object.keys(v.formants), 'no reading was added').toHaveLength(4);
		expect(v.takes.map((t: { outcome: string }) => t.outcome), 'a cancelled take is recorded').toEqual(['cancelled']);
	});
});

/** INSIGHTS' "Add your range" on its two new branches (review fix 5). The offer needs a loaded score and a stored voice with no range. */
test.describe('INSIGHTS "Add your range" and the seam', () => {
	const FIXTURE = path.resolve(process.cwd(), 'src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml');
	const loadScoreAndInsights = async (page: Page) => {
		await page.locator('input[type="file"].hidden-input').setInputFiles(FIXTURE);
		await expect(page.locator('.receipt-score')).toBeVisible({ timeout: 20_000 });
		await page.locator('#tab-insights').click();
	};
	const offer = (page: Page) => page.getByRole('button', { name: 'Add your range' });

	test('refused over the capture screen and dropped: nothing follows when the singer leaves; from rest it opens the Describe station at the Range', async ({ page }) => {
		test.setTimeout(90_000);
		await open(page, [{ id: 'v', name: 'Dann', voiceType: 'bass', formants: { i: R(296, 1705), e: R(381, 1532), u: R(346, 804), a: R(600, 1250) } }]);
		await loadScoreAndInsights(page);
		await expect(offer(page)).toBeVisible({ timeout: 20_000 });
		await page.locator('.vp-door').filter({ hasText: /^carry on recording$/i }).click(); // lane 67: below five core vowels INSIGHTS offers the same words as a link, so the pane's door is named by its class
		await expect(page.locator('.capture')).toBeVisible();
		await offer(page).click(); // INSIGHTS' link, pressed while the capture screen is showing
		await page.waitForTimeout(1500);
		await expect(page.locator('.capture'), 'the capture screen is not broken into').toBeVisible();
		await expect(page.locator('#describe-voice-body')).toHaveCount(0);
		await page.locator('.takeover-back').click();
		await expect(sentence(page)).toBeVisible();
		await page.waitForTimeout(1500);
		await expect(page.locator('#describe-voice-body'), 'a refused request is dropped, never answered later').toHaveCount(0);
		await expect(page.getByRole('button', { name: /^describe your voice$/i })).toHaveAttribute('aria-expanded', 'false');
		// The same link from rest opens the Describe station at the Range, in place: the takeover does not open.
		await offer(page).click();
		await expect(page.getByRole('button', { name: /^describe your voice$/i })).toHaveAttribute('aria-expanded', 'true');
		await expect(page.locator('[data-describe="range"]')).toBeInViewport();
		await expect(page.locator('.takeover-back')).toBeHidden();
	});

	test('with no voice saved INSIGHTS offers no range link, and the takeover never opens onto an empty wizard (the no-voice branch of openVoice is not reachable from this link)', async ({ page }) => {
		await open(page, null);
		await loadScoreAndInsights(page);
		await expect(page.locator('.insights-container')).toContainText('Nothing is claimed about your voice', { timeout: 20_000 });
		await expect(offer(page)).toHaveCount(0);
		await expect(page.locator('.takeover-back')).toBeHidden(); // the takeover stays stowed
	});
});

