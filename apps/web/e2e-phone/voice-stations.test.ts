/**
 * N.203 lane 61, Step 1 (phone, 390 by 844): on a phone the VOICE pane's stations are one at a time across the whole station tier, so opening
 * one shuts the other and shuts NOTATION. The ruled behaviour (brief r3, Step 1).
 *
 *     PW_CHROMIUM_PATH=... pnpm --filter @ilya/web exec playwright test --project=phone voice-stations
 */
import { test, expect, type Page } from '@playwright/test';

const NOW = '2026-11-01T10:00:00.000Z';
async function open(page: Page) {
	const store = { version: 2, activeId: 'v', voices: [{ id: 'v', name: 'Dann', createdAt: NOW, updatedAt: NOW, calibratedAt: NOW, formants: {} }] };
	await page.addInitScript(([s]) => { localStorage.setItem('ilya:language', 'en'); localStorage.setItem('shane.profiles.v2', s); }, [JSON.stringify(store)] as const);
	await page.goto('/?capture=stub');
	await expect(page.locator('.drawer-pull')).toBeVisible({ timeout: 45_000 });
	await page.locator('.drawer-pull').click();
	await expect(page.locator('textarea.text-input')).toBeEnabled({ timeout: 45_000 });
	await page.getByRole('button', { name: /^voice$/i }).click();
}
const band = (page: Page, name: RegExp) => page.getByRole('button', { name });

test('opening one VOICE station shuts the other, and shuts NOTATION', async ({ page }) => {
	await open(page);
	// NOTATION first: open ANALYSIS (which shuts the VOICE band), then NOTATION, then back to VOICE.
	await band(page, /^analysis$/i).click();
	await band(page, /^notation$/i).click();
	await expect(band(page, /^notation$/i)).toHaveAttribute('aria-expanded', 'true');
	await band(page, /^voice$/i).click();
	const describe = band(page, /^describe your voice$/i);
	const shares = band(page, /^what insights shares, and how$/i);
	await describe.click();
	await expect(describe).toHaveAttribute('aria-expanded', 'true');
	await shares.scrollIntoViewIfNeeded();
	await shares.click();
	await expect(shares).toHaveAttribute('aria-expanded', 'true');
	await expect(describe).toHaveAttribute('aria-expanded', 'false');
	await describe.click();
	await expect(describe).toHaveAttribute('aria-expanded', 'true');
	await expect(shares).toHaveAttribute('aria-expanded', 'false');
	// Opening a VOICE station shut NOTATION: back in ANALYSIS it is closed.
	await band(page, /^analysis$/i).click();
	await expect(band(page, /^notation$/i)).toHaveAttribute('aria-expanded', 'false');
});
