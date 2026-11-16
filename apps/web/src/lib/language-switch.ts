import type { Language } from './i18n';

/**
 * THE LANGUAGE PILL'S RULE, in one place (welcome sheet, brief r2 item 3). The app has ONE language control, and it names the language the
 * singer is NOT in: on an English page the pill says "Français", on a French page "English" (Dann 2026-08-20; `HeaderBar.svelte`'s comment).
 * The header's pill and the welcome sheet's pill both read this and both call the page's one `handleLanguageChange`, so the sheet has no
 * second control and no second copy of the rule.
 *
 * The label is an autonym and is deliberately NOT routed through `t()`: on an English page the word is French, on a French page it is
 * English, so a translated string would say the wrong thing in both. The visible word carries its own `lang` (`other`) so a screen reader
 * does not pronounce "Français" with English phonetics.
 */
export interface LanguageSwitch {
	/** The language the pill switches to; also the `lang` of the pill's visible word. */
	other: Language;
	/** The pill's word, an autonym. */
	label: 'Français' | 'English';
}

export function languageSwitch(language: Language): LanguageSwitch {
	const other: Language = language === 'en' ? 'fr' : 'en';
	return { other, label: other === 'fr' ? 'Français' : 'English' };
}
