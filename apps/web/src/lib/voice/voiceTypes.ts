/**
 * The singer's declared voice type, slice A (Dann, 2026-09-30; brief
 * `docs/sessions/brief-code-voice-type-slice-a_r1_2026-09-30.md`, design in
 * `draft-voice-labels_r2_2026-09-30.md`).
 *
 * Two tiers. Tier 1 is the nine broad types, Boldrey's p. 11 parents plus
 * "Not sure" (the desk's, ruled in 00:19). Tier 2 is the 29 finer labels, each
 * under one Tier 1 parent (the shortlist, ruled 00:03; Boldrey, *Guide to
 * Operatic Roles and Arias*, 1994, pp. 15 to 16). Anything else is the
 * singer's own text, shown as typed. The singer owns the label (Boldrey p. 13);
 * the Tier 1 id only routes, through `bucketFor()` in `engine/plausibility.ts`.
 *
 * Ids only. Every display string is in `i18n.ts`, under `voiceType.type.<id>`
 * and `voiceType.specific.<id>`.
 */
import { t, type Language } from '$lib/i18n';
import type { VoiceTypeChoice } from './profileStore';

export const TIER1 = [
	'soprano',
	'mezzo-soprano',
	'contralto',
	'countertenor',
	'tenor',
	'baritone',
	'bass-baritone',
	'bass',
	'not-sure'
] as const;
export type Tier1Id = (typeof TIER1)[number];

/** Tier 2 in the shortlist's order, grouped by parent. "Not sure" has none,
 * but still offers Other (desk default, 2026-09-30 10:46). */
export const TIER2: Record<Tier1Id, readonly string[]> = {
	soprano: ['coloratura-soprano', 'soubrette', 'lyric-soprano', 'spinto-soprano', 'dramatic-soprano'],
	'mezzo-soprano': ['coloratura-mezzo', 'lyric-mezzo', 'dramatic-mezzo'],
	contralto: ['contralto'],
	countertenor: ['countertenor', 'male-alto', 'sopranist', 'haute-contre'],
	tenor: ['tenor-altino', 'light-tenor', 'lyric-tenor', 'spinto-tenor', 'dramatic-tenor', 'heldentenor', 'character-tenor'],
	baritone: ['baryton-martin', 'lyric-baritone', 'dramatic-baritone', 'heldenbariton'],
	'bass-baritone': ['bass-baritone'],
	bass: ['basso-cantante', 'basso-buffo', 'basso-profondo', 'octavist'],
	'not-sure': []
};

/** The Tier 2 value that means the singer typed their own label. */
export const OTHER = 'other';

/**
 * Labels that keep their capital mid-line, because the capital belongs to a
 * name (ruled 00:27): Martin is a singer, and German capitalizes its nouns.
 * English prints "Baryton Martin" whole; French prints « baryton Martin », which
 * lowering the first letter already gives.
 */
const KEEPS_CAPITAL: Record<Language, ReadonlySet<string>> = {
	en: new Set(['baryton-martin', 'heldentenor', 'heldenbariton']),
	fr: new Set(['heldentenor', 'heldenbariton'])
};

export function isTier1(id: string | undefined): id is Tier1Id {
	return !!id && (TIER1 as readonly string[]).includes(id);
}

/**
 * The next stored choice after the singer picks a Tier 1 type. A Tier 2 label
 * that does not belong to the new type is cleared; Other and its text are kept,
 * because Other belongs to every type.
 */
export function withTier1(prev: VoiceTypeChoice, voiceType: Tier1Id | undefined): VoiceTypeChoice {
	const specific = prev.voiceTypeSpecific;
	const keeps = specific === OTHER || (!!voiceType && !!specific && TIER2[voiceType].includes(specific));
	return { voiceType, voiceTypeSpecific: keeps ? specific : undefined, voiceTypeOther: prev.voiceTypeOther };
}

/**
 * The label printed after the voice's name, or `undefined` when nothing
 * prints: no type, "Not sure" without Other's text, or an id this build does
 * not know. Other's text prints exactly as typed (edges trimmed), under "Not
 * sure" too (desk default, 2026-09-30 10:46); a menu label prints in lower
 * case, keeping a name's capital.
 */
export function voiceTypePrint(choice: VoiceTypeChoice | undefined, language: Language): string | undefined {
	const tier1 = choice?.voiceType;
	if (!isTier1(tier1)) return undefined;
	const specific = choice?.voiceTypeSpecific;
	if (specific === OTHER) {
		const own = choice?.voiceTypeOther?.trim();
		if (own) return own;
	}
	if (tier1 === 'not-sure') return undefined;
	const [id, key] =
		specific && TIER2[tier1].includes(specific)
			? [specific, `voiceType.specific.${specific}`]
			: [tier1, `voiceType.type.${tier1}`];
	const label = t(key, language);
	return KEEPS_CAPITAL[language].has(id) ? label : label.charAt(0).toLocaleLowerCase(language) + label.slice(1);
}
