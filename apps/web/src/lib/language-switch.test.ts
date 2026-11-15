import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { languageSwitch } from './language-switch';

describe('the language pill\'s rule (one control, naming the language the singer is NOT in)', () => {
	it('on an English page the pill says Français and switches to French', () => {
		expect(languageSwitch('en')).toEqual({ other: 'fr', label: 'Français' });
	});
	it('on a French page the pill says English and switches to English', () => {
		expect(languageSwitch('fr')).toEqual({ other: 'en', label: 'English' });
	});
	it('the header and the welcome sheet both read it, so there is no second control or second copy of the rule', () => {
		const header = readFileSync(new URL('./components/HeaderBar.svelte', import.meta.url), 'utf8');
		const sheet = readFileSync(new URL('./components/Welcome/WelcomeSheet.svelte', import.meta.url), 'utf8');
		expect(header).toContain("from '$lib/language-switch'");
		expect(sheet).toContain("from '$lib/language-switch'");
		expect(header).not.toMatch(/'Français' : 'English'/);
		expect(sheet).not.toMatch(/'Français'/);
	});
});
