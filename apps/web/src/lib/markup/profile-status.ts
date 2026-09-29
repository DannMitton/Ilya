/**
 * profile-status.ts — the words of the Markup profile's two status lines.
 *
 * Moved out of `MarkupPane.svelte` unchanged in behaviour (N.94 slice 1, the
 * brief's addendum of 2026-09-28 21:40), so the pane could take the
 * Transposition ruler's wiring and stay at its size ceilings
 * (`ARCHITECTURE.md` invariant 12). PURE: counts and a language in, strings
 * out.
 */
import { t, type Language } from '$lib/i18n';

// Counts are spelled out in the locked copy's register ("Seven vowels
// are captured"), so the words live here; the roster caps at ten.
// N.22 (E.40): `profile.count.0` is deleted. `countWord` has exactly one
// caller (`statusLineFor`, below), and that caller sends a zero count to
// `profile.statusSetPlain` instead, so index 0 could never render in
// either language. The keys start at one.
function countWord(n: number, language: Language): string {
	return n >= 1 && n <= 10 ? t(`profile.count.${n}`, language) : String(n);
}

// Built as an expression so the leading space survives Svelte's
// block-boundary whitespace trimming (the "setwith" bug, caught by
// Dann in live testing, 2026-07-12).
// DRAFT copy, flagged for Dann (§B.2). "measured" replaces "successfully
// captured": the count now spans every reading the forecast reads, which
// includes provisional ones, and "successfully captured" would overclaim
// their quality.
export function statusLineFor(analysedCount: number, language: Language): string {
	const T = (key: string) => t(key, language);
	return analysedCount === 0
		? T('profile.statusSetPlain')
		: (analysedCount === 1
				? T('profile.statusSetMeasuredSingular')
				: T('profile.statusSetMeasuredPlural')
			).replace('{count}', countWord(analysedCount, language).toLowerCase());
}

// N.22: split around {vowels} so the glyph snippet renders in the gap. The
// split point travels with the translation, which is the entire point: the
// fragments this replaced could not be translated, because French needs a
// noun English omits ("Votre voyelle [ɛ]") and the gender then
// propagates through the participle.
export function provisionalPartsFor(provisionalCount: number, language: Language): string[] {
	return t(
		provisionalCount === 1 ? 'profile.provisional.sentenceSingular' : 'profile.provisional.sentencePlural',
		language,
	).split('{vowels}');
}

/**
 * The separator before item `idx` in a natural-language list. N.34: the
 * joins are dictionary keys, because English takes the Oxford comma
 * ("a, b, and c") and French does not ("a, b et c"), which collapses the
 * French pair and final joins onto the same word.
 */
export function listSep(idx: number, len: number, language: Language): string {
	if (idx === 0) return '';
	if (len === 2) return t('profile.provisional.listSepPair', language);
	return idx === len - 1
		? t('profile.provisional.listSepFinal', language)
		: t('profile.provisional.listSepMedial', language);
}
