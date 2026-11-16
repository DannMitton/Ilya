/**
 * FINISH EARLY (N.203 lane 59 Step 6; Dann 2026-11-16 00:42: "there is no option to stop and use what the user has given ... We need to give the use agency
 * over such a choice"). The state of the quiet control at the foot of the capture screen, and its words. Exported so lane 60 imports the same rule.
 *
 * THE STATE comes from the chart's own resolution, `resolveVowelValues(profile, voiceType, { placeholders: 'always' })` (`chart/zones.ts`), never from the
 * count of recorded vowels alone (Fable's review, amendment 10):
 *   - `workOut`: no vowel's fR1 or fR2 rests on a stand-in (`surrogate`), and at least one vowel is not recorded. Every vowel left is then one of [ɪ], [ɨ], [a],
 *     [ʌ], and each is worked out from recorded anchors (`DERIVE_ANCHORS`, `engine/derivations.ts`, whose `usableAnchor` the resolution applies).
 *   - `useRecorded`: every other state. Its caption says Ilya "fills" the rest, and prints only when something was recorded that the resolution can use
 *     (`anySung`): with nothing usable the fill is the voice type's template alone, and the sentence would not be true.
 * It shows from the first recorded vowel, and not at ten (`null`). The control is the screen's; it adds no control and never moves the focus.
 *
 * THE WORDS are the ratified counted forms and consent captions (sheet-english r2 and sheet-french r1, "Counted forms and consent captions", Dann 2026-11-16
 * 01:35): numbers in words from two to nine, "the last one" for one, and the vowels listed in brackets in `VOWELS` order with an Oxford comma in English and
 * none in French. Nothing is composed here beyond filling them.
 */
import { t, tv, type Language } from '$lib/i18n';
import { VOWELS, type CalibratedFormant, type Vowel } from '../engine/types';
import { resolveVowelValues } from '../engine/resolve-values';

export type FinishEarly =
	| { kind: 'workOut'; /** How many vowels are left. */ m: number; /** They are, in `VOWELS` order. */ vowels: readonly Vowel[] }
	| { kind: 'useRecorded'; m: number; anySung: boolean };

/**
 * @param recorded the vowels the screen counts as recorded (`VowelCapture.svelte`'s `sungSet`: a stored reading that is not an estimate, with a positive fR1).
 */
export function finishEarlyState(
	profile: Partial<Record<Vowel, CalibratedFormant>>,
	voiceType: string | undefined,
	recorded: ReadonlySet<Vowel>
): FinishEarly | null {
	if (recorded.size === 0 || recorded.size >= VOWELS.length) return null;
	const r = resolveVowelValues(profile, voiceType, { placeholders: 'always' });
	const standIn = VOWELS.some((v) => r.fR1Source[v] === 'surrogate' || r.fR2Source[v] === 'surrogate');
	const left = VOWELS.filter((v) => !recorded.has(v));
	if (!standIn && left.length > 0) return { kind: 'workOut', m: left.length, vowels: left };
	return { kind: 'useRecorded', m: left.length, anySung: r.anySung };
}

/** The number in a word, two to nine: the counted forms' rule ("words (one to nine)"; one is "the last one"). */
export const numberWord = (n: number, language: Language): string => t(`capture.number.${n}`, language);

/** Vowels in brackets, listed as the language lists: "[ɪ], [ɨ], and [ʌ]" with an Oxford comma, « [ɪ], [ɨ] et [ʌ] » with none. */
export function vowelList(vowels: readonly Vowel[], language: Language): string {
	const items = vowels.map((v) => `[${v}]`);
	if (items.length <= 1) return items.join('');
	const and = t('capture.list.and', language);
	if (items.length === 2) return `${items[0]} ${and} ${items[1]}`;
	const head = items.slice(0, -1).join(', ');
	return language === 'en' ? `${head}, ${and} ${items[items.length - 1]}` : `${head} ${and} ${items[items.length - 1]}`;
}

/** The control's words: the link, and the caption (null where it is not printed). */
export function finishEarlyText(state: FinishEarly, language: Language): { link: string; caption: string | null } {
	if (state.kind === 'workOut') {
		const last = state.m === 1;
		return {
			link: last ? t('capture.finish.workOut.last', language) : tv('capture.finish.workOut.many', language, { m: numberWord(state.m, language) }),
			caption: last
				? tv('capture.finish.workOut.captionLast', language, { vowel: vowelList(state.vowels, language) })
				: tv('capture.finish.workOut.caption', language, { m: numberWord(state.m, language), vowels: vowelList(state.vowels, language) })
		};
	}
	return {
		link: t('capture.finish.useRecorded', language),
		caption: !state.anySung
			? null
			: state.m === 1
				? t('capture.finish.useRecorded.captionLast', language)
				: tv('capture.finish.useRecorded.caption', language, { m: numberWord(state.m, language) })
	};
}
