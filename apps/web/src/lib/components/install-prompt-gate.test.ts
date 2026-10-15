/**
 * The install banner's gate for Chrome on iPhone (QUEUE row 100).
 *
 * A TEXT TEST, NOT A RENDER. It reads `InstallPrompt.svelte` as source, the
 * way `settle-field.test.ts` reads `SavedNote.svelte`, because `apps/web` runs
 * vitest with no DOM. What it pins: the Chrome instruction line is `null` in
 * both languages, and the raise is conditioned on it being a string. The
 * Playwright run in the row 100 report is the render.
 *
 * It fails the day a string lands in `ios_chrome_body` without the follow-up
 * row that Dann's ratification opens, which is the point.
 */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync(new URL('./InstallPrompt.svelte', import.meta.url), 'utf8');

describe('InstallPrompt: Chrome on iOS is held down until its line is ratified', () => {
	it('declares ios_chrome_body as string | null', () => {
		expect(source).toMatch(/ios_chrome_body: string \| null;/);
	});

	it('holds null in both languages', () => {
		const values = [...source.matchAll(/ios_chrome_body: ([^,\n]+),/g)].map((m) => m[1].trim());
		expect(values).toEqual(['null', 'null']);
	});

	it('raises the iOS banner for Chrome only where the line is a string', () => {
		expect(source).toMatch(/mayAsk\(\) && \(!isChrome \|\| typeof t\.ios_chrome_body === 'string'\)/);
	});

	it('draws the Safari line for Safari and the Chrome line for Chrome', () => {
		expect(source).toMatch(/isChrome \? \(t\.ios_chrome_body \?\? ''\) : t\.ios_body/);
	});
});
