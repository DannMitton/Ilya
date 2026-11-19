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
import type { CalibratedFormant, Vowel } from '$lib/voice/engine/types';
import { PERSONAL_CORE_MIN, isPersonal, isSung, stableCore } from '$lib/voice/engine/sung';
import { borrowedStaffLabel, fillVoiceType, isBorrowingType, voiceTypePrint } from '$lib/voice/voiceTypes';

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

/**
 * The sentence for a voice not yet personal (lane 68; Dann 2026-11-18 13:53 to 14:00, `i18n.ts` `placeholder.line.belowCore` and `calib.pane.belowCore`): how many of the six core
 * vowels are sampled and stable, which, and how many more complete the profile. `base` is the key without its "One" form; {m} is 5 minus the stable count, and the "One"
 * form (where {m} is 1) holds "1 more" in its own words. With none stable the list is left out with its parentheses.
 */
export function belowCoreText(base: string, stable: readonly Vowel[], language: Language): string {
	const m = PERSONAL_CORE_MIN - stable.length;
	const text = t(m === 1 ? `${base}One` : base, language).replaceAll('{n}', String(stable.length)).replaceAll('{m}', String(m));
	return stable.length === 0 ? text.replace(' ({vowels})', '') : text.replace('{vowels}', vowelList(stable, language));
}

/**
 * The line at the top of the page, or null when there is none to show. Markup's ends "drawn hollow or dashed".
 *
 * `stored` (lane 68): the voice's stored readings and whether the page has an analysis. When the page has an analysis, something is sampled (`isSung`), and the voice is not
 * yet personal (fewer than five stable core vowels), the below-five sentence replaces the placeholder line, whether or not this song uses a placeholder vowel. With no
 * analysis it shows nothing. Otherwise the line is as before: the placeholder vowels this page rests on.
 */
export function placeholderLine(
	vowels: readonly string[],
	language: Language,
	page: 'insights' | 'markup' = 'insights',
	stored?: { formants: Partial<Record<Vowel, CalibratedFormant>>; analysed: boolean },
): string | null {
	const prefix = `placeholder.line${page === 'markup' ? '.markup' : ''}`;
	if (stored && Object.values(stored.formants).some(isSung) && !isPersonal(stored.formants)) {
		return stored.analysed ? belowCoreText(`${prefix}.belowCore`, stableCore(stored.formants), language) : null;
	}
	if (vowels.length === 0) return null;
	return t(`${prefix}.${vowels.length === 1 ? 'one' : 'many'}`, language).replace('{vowels}', vowelList(vowels, language));
}

/** A comment's own sentences when its vowel is a placeholder: the finding, then the remedy (RATIFIED 19:49). */
export function placeholderCommentSentence(vowel: string, language: Language, generic = false): string {
	return t(generic ? 'placeholder.comment.generic' : 'placeholder.comment', language).replaceAll('{vowel}', `[${vowel}]`);
}

/** The vowel figure's sentence, or null when no row rests on a placeholder (RATIFIED). */
export function placeholderTurnsSentence(vowels: readonly string[], language: Language): string | null {
	if (vowels.length === 0) return null;
	return t(vowels.length === 1 ? 'placeholder.turns.one' : 'placeholder.turns.many', language).replace('{vowels}', vowelList(vowels, language));
}

/**
 * THE BORROWING LINE (QUEUE row 167; Dann's ruling of 2026-11-19, `docs/sessions/ratified-voice-type-stand-ins_2026-11-19.md`, sections 1, 3, and 5; brief r4 section 4.7).
 *
 * A contralto, a countertenor, or a bass-baritone has no published resonance values, so Ilya works from a neighbour's staff and says so ON THE PAGE, in a line of its own,
 * never only behind a link ("transparency is paramount", Dann 09:41). Its words are RATIFIED (`placeholder.borrowing`). It is its own pure function, not a branch of
 * `placeholderLine`, because that function returns nothing when the page has no analysis (`placeholder-line.ts:27`, `:76`), and INSIGHTS with no score must still name the borrowing.
 * It takes the declared Tier 1 id and the sampled formants and does not look at the vowel list.
 *
 * THE DRAW RULE, stated once for MELODY, INSIGHTS, and a page with no score: the declared Tier 1 id is contralto, countertenor, or bass-baritone, AND the voice is not personal
 * (`isPersonal`, `voice/engine/sung.ts`: five stable core vowels). The second half matters: from five stable core vowels the fill is the middle shape times the singer's
 * tract scale (`stand-ins.ts`), so no borrowed value is in use. "The staff differs from the singer's own type" is NOT the test: `standInBucket` sends a tenor and a mezzo-soprano
 * to the same staff too. It does not hang on `AdaptedProfile.generic` either, since a borrowing voice with one to four core vowels sampled is not generic and still needs the line.
 *
 * `{type}` is the Tier 1 name (`voiceTypePrint` on the id alone), never a Tier 2 label or Other's text, so the French stays masculine (un contralto, un contre-ténor, un baryton-basse).
 * `{borrowed}` is `borrowedStaffLabel`. The line carries no remedy beyond its own closing clause, "until you sample your own vowels in VOICE".
 */
export function borrowingLine(
	voiceType: string | undefined,
	formants: Partial<Record<Vowel, CalibratedFormant>>,
	language: Language,
): string | null {
	if (!isBorrowingType(voiceType) || isPersonal(formants)) return null;
	const type = voiceTypePrint({ voiceType }, language);
	const borrowed = borrowedStaffLabel(voiceType, language);
	if (!type || !borrowed) return null;
	return fillVoiceType(fillVoiceType(t('placeholder.borrowing', language), type, language, 'type'), borrowed, language, 'borrowed');
}
