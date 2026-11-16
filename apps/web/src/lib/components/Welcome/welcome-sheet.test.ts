/**
 * THE WELCOME SHEET'S STYLE, held to the design Dann ratified and to the app's own tokens (the desk's amendment of 2026-11-16). Runes are inert under vitest and
 * `apps/web` has no DOM environment, so these read the component's source for the declarations the amendment names; `e2e/welcome-sheet.test.ts` measures the
 * live render.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const sheet = readFileSync(new URL('./WelcomeSheet.svelte', import.meta.url), 'utf8');
const appCss = readFileSync(new URL('../../../app.css', import.meta.url), 'utf8');
const rule = (selector: string): string => sheet.match(new RegExp(`\\n\\t${selector.replace('.', '\\.')} \\{([^}]*)\\}`))![1];

describe('the sheet\'s shadow is the app\'s float shadow', () => {
	it('is `var(--float-shadow)`, the token the ratified design names ("the app\'s float shadow"), and not four literal layers', () => {
		const sheetRule = rule('.sheet');
		expect(sheetRule).toMatch(/box-shadow:\s*var\(--float-shadow\)\s*;/);
		expect(sheetRule).not.toMatch(/rgba\(46, 42, 38/);
	});
	it('names a token that exists in app.css', () => {
		expect(appCss).toMatch(/--float-shadow:\s*\n?\s*0 1px 2px rgba\(46, 42, 38, 0\.2\)/);
	});
});
