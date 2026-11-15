/**
 * N.199 Step 6: the new capture screen, in a browser, on `StubCaptureSession` (`?calibrate=new&capture=stub`, development server only).
 * A full tour (ten captures), a manual pick, a cancel in each phase, a rolled-back re-take and an error, Return to summary after one
 * vowel, Start over's two taps, hidden mode, and a soprano's view. Real time: the count-in is 6 s and the stub's sweep 3.5 to 4 s,
 * so these tests are long by design. The stub gives clean readings, so what is asserted is the screen's behaviour and what it keeps,
 * not the extractor's.
 */
import { test, expect, type Page } from '@playwright/test';

const STORE_KEY = 'shane.profiles.v2';
const READING = (f1: number, f2: number) => ({ f1, f2, confidence: 'high', f2Quality: 'clear', reading: 'captured', source: 'measured-user', plausibility: 'plausible' });

async function open(page: Page, opts: { formants?: Record<string, unknown>; voiceType?: string; next?: string[] } = {}) {
	const now = new Date().toISOString();
	const store = { version: 2, activeId: 'v', voices: [{ id: 'v', name: 'Dann', createdAt: now, updatedAt: now, calibratedAt: now, formants: opts.formants ?? {}, voiceType: opts.voiceType ?? 'bass' }] };
	await page.addInitScript(([s, next]) => {
		localStorage.setItem('ilya:language', 'en');
		localStorage.setItem('shane.profiles.v2', s);
		(window as unknown as { __ilyaStubNext?: string[] }).__ilyaStubNext = next;
	}, [JSON.stringify(store), opts.next ?? []] as const);
	await page.goto('/?calibrate=new&capture=stub');
	await expect(page.locator('textarea.text-input')).toBeEnabled({ timeout: 45_000 });
	// Below the desk layout (1400) the Drawer is a bottom sheet, closed until its pull is pressed.
	if ((page.viewportSize()?.width ?? 1440) < 1400) await page.getByRole('button', { name: /drawer/i }).first().click();
	await page.getByRole('button', { name: /^voice$/i }).click();
}
/** From nothing sung: Calibrate, Begin, the readiness wait, Continue. Lands on the capture screen. */
async function toCapture(page: Page) {
	await page.getByRole('button', { name: /^calibrate$/i }).click();
	await page.getByRole('button', { name: /^begin$/i }).click();
	await page.getByRole('button', { name: /^continue$/i }).click({ timeout: 30_000 });
	await expect(page.locator('.capture')).toBeVisible();
}
const stored = (page: Page) => page.evaluate((k) => JSON.parse(localStorage.getItem(k)!).voices[0], STORE_KEY);
const selected = (page: Page) => page.locator('.vowel-btn.selected .btn-glyph').innerText();
const cue = (page: Page) => page.locator('.cue');
const count = (page: Page) => page.locator('.count');
const btn = (page: Page, name: RegExp) => page.getByRole('button', { name });
/** Waits for the take in progress to end and the landing to finish: the main button is enabled again. */
const settled = async (page: Page) => expect(page.locator('.main')).toBeEnabled({ timeout: 40_000 });

test.describe('the new capture screen on the stub', () => {
	test('a full tour: ten captures in Ilya’s order, the hull whole, Done, and every take kept', async ({ page }) => {
		test.setTimeout(300_000);
		// Ten clean takes: the stub's default makes [ɨ] and [ʌ] Provisional, whose notices stay on screen by design.
		await open(page, { next: Array(10).fill('captured') });
		await toCapture(page);
		await expect(cue(page)).toHaveText('Ready for [i].');
		expect(await page.locator('.vowel-btn').count()).toBe(10);
		const order: string[] = [];
		for (let k = 0; k < 10; k++) {
			order.push(await selected(page));
			await page.locator('.main').click();
			await expect(page.locator('.main')).toBeDisabled();
			await expect(count(page)).toHaveText(`${k + 1} of 10`, { timeout: 40_000 });
			await settled(page);
		}
		expect(order).toEqual(['i', 'e', 'ɛ', 'a', 'ɑ', 'o', 'u', 'ɨ', 'ɪ', 'ʌ']);
		await expect(cue(page)).toHaveText('All ten captured. This is your vowel space.');
		await expect(page.locator('.main')).toHaveText('Done');
		await expect(page.locator('polygon.hull')).toBeVisible();
		expect(await page.locator('polygon.hull.dashed').count()).toBe(0);
		expect(await page.locator('[data-placeholder]').count()).toBe(0);
		const v = await stored(page);
		expect(Object.keys(v.formants)).toHaveLength(10);
		for (const f of Object.values(v.formants) as Array<{ visibility?: string }>) expect(f.visibility).toBe('zone');
		expect(v.takes).toHaveLength(10);
		expect(v.takes.every((t: { outcome: string; raw?: unknown; voiceType: string; visible: string }) => ['captured', 'provisional'].includes(t.outcome) && !!t.raw && t.voiceType === 'bass' && t.visible === 'zone')).toBe(true);
		await page.locator('.main').click(); // Done
		await expect(page.getByText('Your vowel space').first()).toBeVisible();
	});

	test('after a cancel the chart moves out, it does not snap, and the hide box is not live during a take (Step 6a)', async ({ page }) => {
		test.setTimeout(60_000);
		await open(page);
		await toCapture(page);
		const rx = async () => +(await page.locator('[data-zone="i"]').getAttribute('rx'));
		const rest = await rx();
		await expect(page.getByLabel('Hide the chart and the readout while I sing')).toBeEnabled();
		await btn(page, /^cardinal-i/).click();
		await expect(page.getByLabel('Hide the chart and the readout while I sing')).toBeDisabled();
		await page.waitForTimeout(2500);
		const zoomed = await rx();
		expect(zoomed).toBeGreaterThan(rest * 1.3);
		await btn(page, /^cardinal-i/).click(); // cancel
		await page.waitForTimeout(100);
		const mid = await rx();
		expect(mid, 'a snap would read the rest radius at once').toBeGreaterThan(rest * 1.05);
		expect(mid).toBeLessThan(zoomed);
		await page.waitForTimeout(700);
		expect(await rx()).toBeCloseTo(rest, 0);
		await expect(page.getByLabel('Hide the chart and the readout while I sing')).toBeEnabled();
	});

	test('a manual pick starts at once and takes precedence; Ilya carries on from the singer’s lead; Return to summary shows after one vowel', async ({ page }) => {
		test.setTimeout(120_000);
		await open(page);
		await toCapture(page);
		await expect(page.getByRole('button', { name: /^Return to summary$/ })).toHaveCount(0);
		await btn(page, /^cardinal-u/).click(); // a tap on a vowel begins its take now
		await expect(cue(page)).toContainText('Sing [u]');
		await btn(page, /^open-e/).click(); // another vowel mid-take: ignored
		expect(await selected(page)).toBe('u');
		await expect(count(page)).toHaveText('1 of 10', { timeout: 40_000 });
		await settled(page);
		expect(await selected(page)).toBe('i'); // round the seven from [u]: wraps to the first unsung
		await expect(cue(page)).toHaveText('Ready for [i].');
		await page.getByRole('button', { name: /^Return to summary$/ }).click();
		await expect(page.getByText('1 of 10 vowels sampled').first()).toBeVisible();
	});

	test('a cancel in each phase ends the take, saves no reading, and records a cancel', async ({ page }) => {
		test.setTimeout(120_000);
		await open(page);
		await toCapture(page);
		// The count-in is 6 s (three beats, a 3 s pause); the stub's stable fry comes 0.5 to 1 s after it, its sweep 3 s after that.
		for (const ms of [500, 4500, 6150, 8200]) {
			await btn(page, /^cardinal-i/).click();
			await expect(page.locator('.main')).toBeDisabled();
			await page.waitForTimeout(ms);
			await btn(page, /^cardinal-i/).click(); // a second tap on the vowel cancels
			await expect(cue(page)).toHaveText('Capture cancelled.');
			await expect(page.locator('.main')).toBeEnabled();
			await expect(count(page)).toHaveText('0 of 10');
		}
		const v = await stored(page);
		expect(Object.keys(v.formants)).toHaveLength(0);
		expect(v.takes.map((t: { outcome: string }) => t.outcome)).toEqual(['cancelled', 'cancelled', 'cancelled', 'cancelled']);
		expect(v.takes.every((t: { raw?: unknown }) => t.raw === undefined)).toBe(true);
		// Stop and Escape cancel too.
		await btn(page, /^cardinal-i/).click();
		await page.waitForTimeout(800);
		await page.getByRole('button', { name: /^Stop$/ }).click();
		await expect(cue(page)).toHaveText('Capture cancelled.');
		await btn(page, /^cardinal-i/).click();
		await page.waitForTimeout(800);
		await page.keyboard.press('Escape');
		await expect(cue(page)).toHaveText('Capture cancelled.');
	});

	test('a rolled-back re-take keeps the reading and says so; an error says what happened; both leave a record', async ({ page }) => {
		test.setTimeout(120_000);
		await open(page, { formants: { i: READING(296, 1705), e: READING(381, 1532), u: READING(346, 804) }, next: ['provisional-low', 'error-no-audio'] });
		await page.getByRole('button', { name: /re-calibrate/i }).click();
		await page.getByRole('button', { name: /^re-take$/i }).first().click(); // [i], a pass of one
		await expect(page.locator('.capture')).toBeVisible();
		await page.locator('.main').click();
		await expect(cue(page)).toContainText('previous one was kept', { timeout: 40_000 });
		await expect(page.locator('.capture')).toBeVisible(); // a notice to read: no automatic return
		let v = await stored(page);
		expect(v.formants.i.f1).toBe(296);
		expect(v.takes.map((t: { outcome: string }) => t.outcome)).toEqual(['rolled-back']);
		await settled(page);
		await page.locator('.main').click(); // the second scripted take: an error
		await expect(cue(page)).toHaveText('No sound came through. Can you check the microphone and try again?', { timeout: 40_000 });
		v = await stored(page);
		expect(v.takes.map((t: { outcome: string; errorCode?: string }) => [t.outcome, t.errorCode])).toEqual([['rolled-back', undefined], ['failed', 'NO_AUDIO_INPUT']]);
		await expect(page.locator('.main')).toBeEnabled(); // a way back in
		await page.getByRole('button', { name: /^Return to summary$/ }).click();
		await expect(page.getByText('3 of 10 vowels sampled').first()).toBeVisible();
	});

	test('a re-take from the summary walks its pass and returns by itself when the take is clean', async ({ page }) => {
		test.setTimeout(120_000);
		await open(page, { formants: { i: READING(296, 1705), u: READING(346, 804) } });
		await page.getByRole('button', { name: /re-calibrate/i }).click();
		await page.getByRole('button', { name: /^re-take$/i }).first().click();
		await page.locator('.main').click();
		await expect(page.getByText('2 of 10 vowels sampled').first()).toBeVisible({ timeout: 40_000 });
	});

	test('Start over takes two taps, then clears the readings and the take record', async ({ page }) => {
		test.setTimeout(120_000);
		await open(page, { formants: { i: READING(296, 1705), e: READING(381, 1532), u: READING(346, 804) } });
		await page.getByRole('button', { name: /re-calibrate/i }).click();
		await page.getByRole('button', { name: /^re-take$/i }).first().click();
		await page.getByRole('button', { name: /^Start over$/ }).click();
		await expect(page.getByRole('button', { name: /^Clear all$/ })).toBeVisible();
		await expect(page.locator('.hint')).toHaveText('Tap Clear all to clear every reading for this voice.');
		expect((await stored(page)).formants.i).toBeTruthy(); // one tap clears nothing
		await page.getByRole('button', { name: /^Clear all$/ }).click();
		await expect(page.getByRole('button', { name: /^begin$/i })).toBeVisible();
		const v = await stored(page);
		expect(Object.keys(v.formants)).toHaveLength(0);
		expect(v.takes).toBeUndefined();
	});

	test('hidden mode replaces the chart from the tap to the reading, returns it at the capture, and marks the reading', async ({ page }) => {
		test.setTimeout(120_000);
		await open(page);
		await toCapture(page);
		await page.getByLabel('Hide the chart and the readout while I sing').check();
		await btn(page, /^cardinal-i/).click();
		await expect(page.locator('.chart-box')).toContainText('The chart and the readout are hidden while you sing.');
		expect(await page.locator('.vowel-chart').count()).toBe(0);
		await expect(count(page)).toHaveText('1 of 10', { timeout: 40_000 });
		await expect(page.locator('.vowel-chart')).toBeVisible();
		const v = await stored(page);
		expect(v.formants.i.visibility).toBe('hidden');
		expect(v.takes[0].visible).toBe('hidden');
	});

	test('a soprano sees ten zones and ten placeholders, and the first-move hint', async ({ page }) => {
		await open(page, { voiceType: 'soprano' });
		await toCapture(page);
		expect(await page.locator('[data-zone]').count()).toBe(10);
		expect(await page.locator('[data-placeholder]').count()).toBe(10);
		await expect(page.locator('.hint')).toHaveText('Start follows Ilya’s order. Or tap any vowel to sing that one now.');
	});
});

/** N.199 readings brief, Step 3: the capture screen has a largest width (the chart's 484 px), so the Drawer as a sheet does not push the buttons off. */
test.describe('the capture screen in the Drawer as a sheet', () => {
	for (const width of [768, 1024, 1244]) {
		test(`at ${width} px wide and 800 high: 484 px wide, centred, and scrolled until the stage sticks the chart, the ten buttons, and both actions are in view`, async ({ page }) => {
			await page.setViewportSize({ width, height: 800 });
			await open(page);
			await toCapture(page);
			const box = async (sel: string) => (await page.locator(sel).first().boundingBox())!;
			const capture = await box('.capture');
			expect(Math.round(capture.width)).toBe(484);
			expect(Math.abs(capture.x + capture.width / 2 - width / 2)).toBeLessThan(2);
			// Scroll the Drawer's takeover to its end: the stage sticks at the top.
			await page.locator('.takeover-body').evaluate((e) => { e.scrollTop = e.scrollHeight; });
			const drawer = await box('.drawer');
			for (const sel of ['.chart-box', '.buttons', '.main', '.stop']) {
				const b = await box(sel);
				expect(b.y, `${sel} above the Drawer`).toBeGreaterThanOrEqual(drawer.y);
				expect(b.y + b.height, `${sel} below the Drawer's end`).toBeLessThanOrEqual(drawer.y + drawer.height);
			}
			expect(await page.locator('.vowel-btn').count()).toBe(10);
		});
	}
});

/** N.199 readings brief, Step 1: the readings list on the capture screen. */
test.describe('the readings list', () => {
	test('is closed by default with a summary at least 44 px tall, opens to ten rows, and never opens by itself', async ({ page }) => {
		await open(page, { next: ['captured'] });
		await toCapture(page);
		const list = page.locator('details.readings');
		await expect(list).toBeVisible();
		expect(await list.evaluate((e) => (e as HTMLDetailsElement).open)).toBe(false);
		const summary = list.locator('summary');
		await expect(summary).toHaveText('Your readings');
		expect((await summary.boundingBox())!.height).toBeGreaterThanOrEqual(44);
		await expect(list.locator('tbody tr')).toHaveCount(10); // in the DOM, folded
		await expect(list.locator('table')).not.toBeVisible();
		await summary.click();
		await expect(list.locator('table')).toBeVisible();
		await expect(list.locator('tbody tr')).toHaveCount(10);
		// A take that ends does not fold it or open anything else; a closed list stays closed through a take.
		await summary.click();
		await btn(page, /^cardinal-i/).click();
		await expect(count(page)).toHaveText('1 of 10', { timeout: 40_000 });
		expect(await list.evaluate((e) => (e as HTMLDetailsElement).open)).toBe(false);
	});

	test('with the chart hidden, a take closes it and keeps its closed line in place, invisible and inert, so the toggle does not move; it returns at the landing, still closed', async ({ page }) => {
		test.setTimeout(120_000);
		await open(page, { next: ['captured'] });
		await toCapture(page);
		const list = page.locator('details.readings');
		const toggle = page.locator('.hide-toggle');
		await page.getByLabel('Hide the chart and the readout while I sing').check();
		// The list's closed line and the toggle below it: its height and the gap between them. (Text above the list changes during a take, so the toggle's
		// distance from the top of the screen is not the measure.)
		const closedLine = async () => {
			const l = (await list.boundingBox())!;
			const t = (await toggle.boundingBox())!;
			return { height: Math.round(l.height), gap: Math.round(t.y - (l.y + l.height)) };
		};
		const closedAtRest = await closedLine();
		expect(closedAtRest.height).toBeGreaterThanOrEqual(44);
		await list.locator('summary').click();
		expect(await list.evaluate((e) => (e as HTMLDetailsElement).open)).toBe(true);
		expect((await closedLine()).height).toBeGreaterThan(closedAtRest.height + 100); // open, the table fills it
		await btn(page, /^cardinal-i/).click();
		await expect(page.locator('.chart-box')).toContainText('The chart and the readout are hidden while you sing.');
		expect(await list.evaluate((e) => (e as HTMLDetailsElement).open)).toBe(false);
		expect(await list.evaluate((e) => getComputedStyle(e).visibility)).toBe('hidden');
		expect(await list.evaluate((e) => (e as HTMLElement).inert)).toBe(true);
		expect(await closedLine()).toEqual(closedAtRest); // the closed line kept its place and size, and the toggle sits as close below it
		await expect(count(page)).toHaveText('1 of 10', { timeout: 40_000 });
		await expect(page.locator('.vowel-chart')).toBeVisible();
		expect(await list.evaluate((e) => getComputedStyle(e).visibility)).toBe('visible');
		expect(await list.evaluate((e) => (e as HTMLElement).inert)).toBe(false);
		expect(await list.evaluate((e) => (e as HTMLDetailsElement).open)).toBe(false);
	});
});
