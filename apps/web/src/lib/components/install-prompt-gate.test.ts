/**
 * The install banner's gate for Chrome on iPhone (QUEUE row 100).
 *
 * A TEXT TEST, NOT A RENDER. It reads `InstallPrompt.svelte` as source, the
 * way `settle-field.test.ts` reads `SavedNote.svelte`, because `apps/web` runs
 * vitest with no DOM. What it pins: the Chrome instruction line is `null` in
 * both languages is the string Dann ratified (2026-11-09 23:14), and the
 * raise is conditioned on it being a string. The Playwright run in the row
 * 100 report is the render.
 */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync(new URL('./InstallPrompt.svelte', import.meta.url), 'utf8');

describe('InstallPrompt: Chrome on iOS', () => {
	it('declares ios_chrome_body as string | null', () => {
		expect(source).toMatch(/ios_chrome_body: string \| null;/);
	});

	it('holds the two ratified lines, English then French', () => {
		const values = [...source.matchAll(/ios_chrome_body: '([^'\n]+)',/g)].map((m) => m[1]);
		expect(values).toEqual([
			'In Chrome, tap the <strong>Share</strong> button at the right inside the address bar, tap <strong>View More</strong>, then choose <strong>Add to Home Screen</strong>.',
			'Dans Chrome, appuyez sur le bouton <strong>Partager</strong>, à droite dans la barre d’adresse, puis sur <strong>Afficher plus</strong>, et choisissez <strong>Sur l’écran d’accueil</strong>.',
		]);
	});

	it('raises the iOS banner for Chrome only where the line is a string', () => {
		expect(source).toMatch(/mayAsk\(\) && \(!isChrome \|\| typeof t\.ios_chrome_body === 'string'\)/);
	});

	it('draws the Safari line for Safari and the Chrome line for Chrome', () => {
		expect(source).toMatch(/isChrome \? \(t\.ios_chrome_body \?\? ''\) : t\.ios_body/);
	});

	/* Closing polish lane, step 3 (Amendment 6): the render expression is kept as written and wrapped, and the glyph is added by the component, not written into
	   the strings (the regex above must still read them). */
	it('wraps the render expression in withGlyph, and draws the glyph aria-hidden, after the first Share', () => {
		expect(source).toMatch(/withGlyph\(isChrome \? \(t\.ios_chrome_body \?\? ''\) : t\.ios_body\)/);
		expect(source).toMatch(/<svg viewBox="0 0 24 24" aria-hidden="true"/);
		expect(source).toContain("html.replace('</strong>', `</strong>${SHARE_GLYPH}`)");
		expect(source).toMatch(/stroke="currentColor"/);
		expect(source).toMatch(/width:1em;height:1em/);
		for (const m of source.matchAll(/ios_(?:chrome_)?body: '([^'\n]+)',/g)) expect(m[1]).not.toContain('<svg');
	});
});
