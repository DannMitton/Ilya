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

/**
 * The three declared types whose placeholder values come from a neighbour's staff (QUEUE row 167, ruling of 2026-11-19, `docs/sessions/ratified-voice-type-stand-ins_2026-11-19.md`),
 * and the key of the staff each one borrows. It mirrors `standInBucket` (`voice/engine/stand-ins.ts`): contralto to the mezzo-soprano staff, bass-baritone to bass, countertenor to
 * Bozeman's shared mezzo and tenor staff.
 */
const BORROWED_STAFF = {
	contralto: 'voiceType.staff.mezzo-soprano',
	'bass-baritone': 'voiceType.staff.bass',
	countertenor: 'voiceType.staff.mezzo-tenor'
} as const satisfies Partial<Record<Tier1Id, string>>;

/** Whether a declared Tier 1 id is one of the three that borrow a neighbour's staff. */
export function isBorrowingType(voiceType: string | undefined): voiceType is keyof typeof BORROWED_STAFF {
	return !!voiceType && Object.prototype.hasOwnProperty.call(BORROWED_STAFF, voiceType);
}

/**
 * The staff a voice's placeholder values came from, as a label, or `undefined` for a voice that has none. Takes the Tier 1 id alone; Tier 2 and Other's text never reach it.
 * One contract, four clauses (brief r4 section 3):
 * 1. Contralto, countertenor, and bass-baritone get the fixed staff label, whatever `voiceTypeSpecific` or `voiceTypeOther` hold: the values came from the staff.
 * 2. The five published types get `voiceTypePrint`'s label on the Tier 1 id, so a bass who chose octavist reads "bass", a staff Ilya has, never "octavist".
 * 3. "Not sure" gets `undefined`, whatever Other's text holds (`voiceTypePrint` would return Other's text before its "Not sure" test).
 * 4. No type, and any id that is not Tier 1, get `undefined`. "Undeclared" means exactly that `undefined`, and every site branches on it, never on `hasDeclaredType`.
 */
export function borrowedStaffLabel(voiceType: string | undefined, language: Language): string | undefined {
	if (!isTier1(voiceType) || voiceType === 'not-sure') return undefined;
	if (isBorrowingType(voiceType)) return t(BORROWED_STAFF[voiceType], language);
	return voiceTypePrint({ voiceType }, language);
}

/**
 * The label that fills `{voiceType}` in the sentences that say whose placeholder values a page is working from (MELODY's subtitle, INSIGHTS' lede, and the vowel chart's caption).
 * The ruling's principle (2026-11-19 10:08, section 6): a sentence never tells a singer the values are their own type's when they are a neighbour's. So the three borrowing types
 * print the staff the values came from (`borrowedStaffLabel`), and every other type prints `voiceTypePrint` on the whole choice as before, Tier 2 label or Other's text included:
 * for the five published types the values are their own, and the lane keeps that behaviour (brief r4 section 9 item 6, `report-code-lane71-step2`, section 3).
 * "Not sure", no type, and an id this build does not know get `undefined`, whatever Other's text holds.
 */
export function placeholderFillLabel(choice: VoiceTypeChoice | undefined, language: Language): string | undefined {
	const id = choice?.voiceType;
	if (isBorrowingType(id)) return borrowedStaffLabel(id, language);
	if (id === 'not-sure') return undefined;
	return voiceTypePrint(choice, language);
}

/** A French label that begins with a vowel letter (a, e, i, o, u, y and their accented forms), never h: « d’octaviste », not « de octaviste ». */
const VOWEL_LETTER = /^[aeiouy]/;
const startsWithVowelLetter = (label: string) => VOWEL_LETTER.test(label.normalize('NFD').toLowerCase());

/**
 * Fills one token of a string with a voice type's label. `token` names it without braces and defaults to `voiceType`; the borrowing strings (QUEUE row 167) carry `{type}` and
 * `{borrowed}`. In French the « de » before the token elides to « d’ » when the label begins with a vowel letter (« d’octaviste », « de basse », « de heldentenor »).
 * One helper for every fill (MELODY's subtitle, INSIGHTS' lede, the vowel chart's caption, the VOICE pane, the sheet's sources note, and the capture hint), so they cannot
 * disagree. Closing polish lane, step 2, desk default 2026-11-11; the token name is lane 71, step 2. The label goes in by function, so a `$` in Other's text is not a pattern.
 */
export function fillVoiceType(template: string, label: string, language: Language, token = 'voiceType'): string {
	const slot = `{${token}}`;
	if (language === 'fr' && startsWithVowelLetter(label)) template = template.replace(`de ${slot}`, `d\u2019${slot}`);
	return template.replace(slot, () => label);
}
