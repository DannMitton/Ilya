/**
 * THE WELCOME SHEET'S STYLE, held to the design Dann ratified and to the app's own tokens (the desk's amendment of 2026-11-16). Runes are inert under vitest and
 * `apps/web` has no DOM environment, so these read the component's source for the declarations the amendment names; `e2e/welcome-sheet.test.ts` measures the
 * live render.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { LEAVE_MS, SHEET_LEAVE_MS } from './welcome-motion';

const sheet = readFileSync(new URL('./WelcomeSheet.svelte', import.meta.url), 'utf8');
const proto = readFileSync(new URL('../../../../../../docs/sessions/welcome-sheet/ilya-welcome-draft-17.html', import.meta.url), 'utf8').replace(/base64,[A-Za-z0-9+/=]{200,}/g, 'base64,');
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

describe('the sheet leaves as the prototype has it', () => {
	it('the scrim leaves in 260 ms and the sheet in 180 ms, ease-out (prototype lines 24 and 27)', () => {
		expect(proto).toMatch(/\.scrim\{[^}]*transition:opacity 260ms ease-out\}/);
		expect(proto).toMatch(/\.sheet\{[^}]*transition:opacity 180ms ease-out,transform 180ms ease-out\}/);
		expect(LEAVE_MS).toBe(260);
		expect(SHEET_LEAVE_MS).toBe(180);
	});
	it('spends each in the right place: the scrim fades over LEAVE_MS, the sheet over SHEET_LEAVE_MS', () => {
		expect(sheet).toContain('style:--leave="{LEAVE_MS}ms"');
		expect(sheet).toContain('style:--leave-sheet="{SHEET_LEAVE_MS}ms"');
		expect(rule('.scrim')).toContain('transition: opacity var(--leave) ease-out;');
		expect(rule('.sheet')).toMatch(/opacity var\(--leave-sheet\) ease-out,\s*transform var\(--leave-sheet\) ease-out/);
	});
});
