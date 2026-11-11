/**
 * poem-site.ts: the library's site, named in the interface language (step 7, part 4, D3; Dann 2026-11-03 20:01, ratified 20:21).
 *
 * The data's `source.site` is one English string today ("Russian Wikisource"), and the stored record keeps it. What the card and
 * the lines PRINT is looked up by that string, one name per language (`i18n.ts`, `intake.poemLibrary.site.*`): "Russian
 * Wikisource" in English, « Wikisource en russe » in French. A site the table does not list prints as the data has it, so a
 * library that grows to another source is never shown a wrong name or a missing one.
 */
import { hasString, t, type Language } from '$lib/i18n';

/** The data's `source.site` to the key that names it. */
const SITE_KEYS: Readonly<Record<string, string>> = {
	'Russian Wikisource': 'intake.poemLibrary.site.russianWikisource',
	// Row 182: the sites the aria texts come from (the build lists the same three, `LIBRETTO_SITES`).
	'operalib.eu': 'intake.poemLibrary.site.operalib',
	FEB: 'intake.poemLibrary.site.feb',
};

export function siteName(site: string, language: Language): string {
	const key = SITE_KEYS[site];
	return key && hasString(key, language) ? t(key, language) : site;
}
