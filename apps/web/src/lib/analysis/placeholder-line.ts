/**
 * PLACEHOLDER VOWELS, NAMED (QUEUE row 69; Dann 2026-10-11 12:28 to 12:42,
 * `OPEN.md` "STAND-INS ARE LABELLED"): "We must not propose synthetic values
 * as if they were actual readings."
 *
 * A vowel the singer has not sampled carries a stand-in fR1 since row 17, and
 * the overlay engine marks each note that rests on one (`AnalyzedEvent
 * .placeholder`). This module names those vowels in roster order and builds
 * the words: the line at the top of Markup and Insights, and the sentences a
 * comment and the vowel figure carry, all RATIFIED by Dann 2026-10-11 (12:41 to
 * 19:51, `OPEN.md`). Markup's line ends on its own sentence, which names the
 * hollow head (Dann 20:06). A derived vowel,
 * "Estimated" in Voice, is not a placeholder and is not named here.
 *
 * PURE: an analysis and a language in, strings out.
 */
import type { AnalyzedScore } from '@ilya/score-parser';
import { t, type Language } from '$lib/i18n';

/** Grayson's ten, in the roster's order (as `MarkupPane.svelte` lists them). */
const ROSTER_ORDER = ['i', 'e', 'ɛ', 'a', 'ɑ', 'o', 'u', 'ɨ', 'ɪ', 'ʌ'];

/** The vowels the page uses whose fR1 is a placeholder, in roster order. */
export function placeholderVowels(analyzed: AnalyzedScore | null | undefined): string[] {
	if (!analyzed) return [];
	const used = new Set(Object.values(analyzed.events).filter((e) => e.placeholder).map((e) => e.vowel));
	return [...ROSTER_ORDER.filter((v) => used.has(v)), ...[...used].filter((v) => !ROSTER_ORDER.includes(v)).sort()];
}

/** "[ɛ], [o], and [u]"; « [ɛ], [o] et [u] », on the profile's own separators. */
export function vowelList(vowels: readonly string[], language: Language): string {
	return vowels
		.map((v, i) => {
			if (i === 0) return `[${v}]`;
			const sep =
				vowels.length === 2
					? 'profile.provisional.listSepPair'
					: i === vowels.length - 1
						? 'profile.provisional.listSepFinal'
						: 'profile.provisional.listSepMedial';
			return `${t(sep, language)}[${v}]`;
		})
		.join('');
}

/** The line at the top of the page, or null when the page uses no placeholder. Markup's ends "drawn hollow or dashed". */
export function placeholderLine(vowels: readonly string[], language: Language, page: 'insights' | 'markup' = 'insights'): string | null {
	if (vowels.length === 0) return null;
	const key = `placeholder.line${page === 'markup' ? '.markup' : ''}.${vowels.length === 1 ? 'one' : 'many'}`;
	return t(key, language).replace('{vowels}', vowelList(vowels, language));
}

/** A comment's own sentences when its vowel is a placeholder: the finding, then the remedy (RATIFIED 19:49). */
export function placeholderCommentSentence(vowel: string, language: Language): string {
	return t('placeholder.comment', language).replaceAll('{vowel}', `[${vowel}]`);
}

/** The vowel figure's sentence, or null when no row rests on a placeholder (RATIFIED). */
export function placeholderTurnsSentence(vowels: readonly string[], language: Language): string | null {
	if (vowels.length === 0) return null;
	return t(vowels.length === 1 ? 'placeholder.turns.one' : 'placeholder.turns.many', language).replace('{vowels}', vowelList(vowels, language));
}
