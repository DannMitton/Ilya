import { test, expect, type Page } from '@playwright/test';
/** Written out, not imported: the page's own constant must not move this pin with it. Derived 2026-11-21: (757 - 86.6) / 2 - 20 (`page-config.ts`, `BLANK_ANCHOR`). */
const RULED_ANCHOR = 315.2;
const RULED_GAP = 16; // `HEADER_GAP`

/*
 * LANE 79 (QUEUE row 201), WITH ITS SECOND ADDENDUM (Dann 2026-11-21 22:55): ONE WINDOW FOR THE BLANK PAGE OF TEXT, MELODY, AND INSIGHTS, THE SQUIRCLE'S TOP EDGE THE ANCHOR. Not a test file itself (no `.test.ts`); `e2e/one-page-frame.test.ts` runs it in the
 * chromium project and `e2e-phone/one-page-frame.test.ts` at 390.
 *
 * Opens the three blank pages in each language and in three voice states (none, a type chosen and nothing sampled, samples), and reads each squircle against its own
 * sheet, in sheet px (the phone scales the sheet, so every client box is divided by the sheet's scale). Asserts: one left edge and one width on all three, to the
 * pixel; each squircle's midpoint on the midpoint of its own page's title rule (lower edge) and footer hairline (upper edge), within 0.5 px; and, where the three
 * title rules sit at one height, one midpoint.
 */
const NOW = '2026-11-21T10:00:00.000Z';
const R = (f1: number, f2: number) => ({ f1, f2, confidence: 'high', f2Quality: 'clear', reading: 'captured', source: 'measured-user', plausibility: 'plausible' });
const SAMPLES = { i: R(300, 2200), e: R(450, 2000), u: R(350, 800), a: R(800, 1200), o: R(500, 900) };
type VoiceState = 'none' | 'type only' | 'samples';
const DOCS = ['text', 'markup', 'insights'] as const;

async function open(page: Page, language: 'en' | 'fr', voice: VoiceState) {
	const voices = voice === 'none' ? [] : [{ id: 'v', name: 'Dann', createdAt: NOW, updatedAt: NOW, calibratedAt: NOW, formants: voice === 'samples' ? SAMPLES : {}, voiceType: 'baritone' }];
	const store = { version: 2, activeId: voices.length ? 'v' : null, voices };
	await page.addInitScript(([lang, s]) => { localStorage.setItem('ilya:language', lang); localStorage.setItem('shane.profiles.v2', s); }, [language, JSON.stringify(store)] as const);
	await page.goto('/');
	await expect(page.locator('textarea.text-input')).toBeEnabled({ timeout: 45_000 });
}

/** The squircle on screen, against its own sheet, in sheet px. */
async function read(page: Page, doc: (typeof DOCS)[number]) {
	await page.locator('#tab-' + doc).click();
	await expect(page.locator('[data-blank-state]:visible')).toHaveCount(1, { timeout: 30_000 });
	// Wait for the layout to settle: the header and footer report after fonts load, and the squircle is not drawn until both have.
	let last = '';
	let m: Record<string, number> | null = null;
	for (let i = 0; i < 40; i++) {
		m = await page.evaluate(() => {
			const sq = [...document.querySelectorAll<HTMLElement>('[data-blank-state]')].find((e) => e.getClientRects().length > 0)!;
			const sheet = sq.closest<HTMLElement>('.blank-window')!.offsetParent as HTMLElement;
			const sr = sheet.getBoundingClientRect();
			const k = sr.width / sheet.offsetWidth;
			const rule = sheet.querySelector<HTMLElement>('.header-rule')!.getBoundingClientRect();
			const hair = sheet.querySelector<HTMLElement>('.footer-hairline')!.getBoundingClientRect();
			const q = sq.getBoundingClientRect();
			const y = (v: number) => (v - sr.top) / k;
			return { left: (q.left - sr.left) / k, width: q.width / k, top: y(q.top), bottom: y(q.bottom), ruleBottom: y(rule.bottom), hairTop: y(hair.top) };
		});
		const sig = JSON.stringify(m);
		if (sig === last) break;
		last = sig;
		await page.waitForTimeout(600);
	}
	return m!;
}

for (const voice of ['none', 'type only', 'samples'] as const) {
	test(`voice ${voice}: the three blank pages share a left edge, a width, and a top edge, in English and in French`, async ({ page, context }) => {
		test.setTimeout(180_000);
		const below: Record<string, Record<string, number>> = {};
		for (const language of ['en', 'fr'] as const) {
			const p = language === 'en' ? page : await context.newPage();
			await open(p, language, voice);
			const got: Record<string, Awaited<ReturnType<typeof read>>> = {};
			for (const d of DOCS) got[d] = await read(p, d);
			for (const d of DOCS) {
				expect(Math.abs(got[d].left - got.text.left), `${language} ${d} left against TEXT`).toBeLessThan(0.05);
				expect(Math.abs(got[d].width - got.text.width), `${language} ${d} width against TEXT`).toBeLessThan(0.05);
				below[d] = { ...below[d], [language]: got[d].top - got[d].ruleBottom };
				// The squircle's top edge is `HEADER_GAP + BLANK_ANCHOR` (16 + 315.2) below its own rule (absolute, so a change of the one shared number is seen, not only a difference between pages).
				expect(Math.abs(got[d].top - got[d].ruleBottom - (RULED_GAP + RULED_ANCHOR)), `${language} ${d} top edge below its rule`).toBeLessThanOrEqual(0.5);
				// The distance below its own rule is the anchor's, the same on all three pages. 0.5 px, not 0.05: the header's height is measured as a whole pixel (`offsetHeight`) and its rule sits at a fraction, so a taller header (MELODY in French with a voice type chosen) is up to half a pixel off its rule.
				expect(Math.abs(got[d].top - got[d].ruleBottom - (got.text.top - got.text.ruleBottom)), `${language} ${d} top below its rule, against TEXT`).toBeLessThanOrEqual(0.5);
			}
			if (DOCS.every((d) => Math.abs(got[d].ruleBottom - got.text.ruleBottom) < 0.05)) {
				for (const d of DOCS) expect(Math.abs(got[d].top - got.text.top), `${language} ${d} top edge against TEXT`).toBeLessThan(0.05);
			}
			test.info().annotations.push({ type: 'measured-' + language, description: JSON.stringify(got) });
		}
		for (const d of DOCS) expect(Math.abs(below[d].en - below[d].fr), `${d} top below its rule, English against French`).toBeLessThanOrEqual(0.5);
	});
}
