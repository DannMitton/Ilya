/**
 * THE VOICE PANE AT REST, as data (N.203 lane 60, Step 2; plan r4 sections 4.1 and 4.2). The pane's sentence, the name of its door to
 * recording, and whether "Your vowel space" shows. Pure, so the seven sentence states are tested without a browser. The eighth state of the
 * pane, with no voice saved, is the first-launch form (`ProfileSwitcher.svelte`), not a sentence.
 *
 * BELOW FIVE STABLE CORE VOWELS (lanes 67 and 68; Dann 2026-11-18 13:57 and 14:00) one sentence, for every type, says how many of the six core vowels are sampled and stable, which, and how many
 * more complete the singer's own profile (`calib.pane.belowCore`); it is tested before the count of ten, since five stable core vowels, not ten vowels, complete a profile. The count of the other states is
 * every sung vowel. "Recorded" means sung: the count the closed pane's line prints (`usableReadingCount`, `profileStore.ts`; `isSung`, `voice/engine/sung.ts`), so a
 * reading beyond Ilya's reference values counts as a kept one does (lane 66, Step 5), and a stored estimate or a take with no first resonance does not,
 * where the summary's table, which draws every stored reading, draws them.
 */
import { t, type Language } from '$lib/i18n';
import { PERSONAL_CORE_MIN } from '$lib/voice/engine/sung';
import type { Vowel } from '$lib/voice/engine/types';
import { belowCoreText } from '$lib/analysis/placeholder-line';
import { hasPlaceholderProfile } from '$lib/voice/engine/stand-ins';
import { borrowedStaffLabel, fillVoiceType, isTier1, voiceTypePrint } from '$lib/voice/voiceTypes';

export interface PaneSentenceInput {
	/** `usableReadingCount(voiceFormants)`, 0 to 10. */
	usable: number;
	/** `stableCore(voiceFormants)` (`voice/engine/sung.ts`): the core vowels sampled and stable, in roster order, 0 to 6 of them. Under five, the profile is not yet complete (lane 68). */
	core: readonly Vowel[];
	/** The stored Tier 1 id, if any. An id this build does not know counts as none. */
	voiceType?: string;
	/**
	 * True when every vowel left can be worked out from the ones recorded (lane 59's `finishEarlyState(...).kind === 'work-out'`,
	 * `voice/chart/finish-early.ts`). Until that lane is merged the page passes `false`.
	 */
	restWorkedOut: boolean;
}

export type PaneState = 'none' | 'typed-generic' | 'not-sure' | 'below-core' | 'some-fills' | 'some-works-out' | 'all';

export function paneState(i: PaneSentenceInput): PaneState {
	// Anything sung and fewer than five stable core vowels (a voice with only a hard vowel sung has `usable >= 1` and no stable core vowel; so has ten readings with four stable): what is recorded
	// is used and shown, and the sentence says how many more core vowels complete the profile (lane 68; Dann 2026-11-18 13:57 and 14:00). It is tested before ten usable.
	if (i.usable >= 1 && i.core.length < PERSONAL_CORE_MIN) return 'below-core';
	if (i.usable >= 10) return 'all';
	if (i.usable >= 1) return i.restWorkedOut ? 'some-works-out' : 'some-fills';
	if (!isTier1(i.voiceType)) return 'none';
	if (i.voiceType === 'not-sure') return 'not-sure';
	// Every other Tier 1 id has a placeholder profile (eight types, QUEUE row 167), so there is no "typed, none" state any more.
	return 'typed-generic';
}

const KEY: Record<Exclude<PaneState, 'below-core' | 'some-fills' | 'some-works-out'>, string> = {
	none: 'calib.pane.none',
	'typed-generic': 'calib.pane.typedGeneric',
	'not-sure': 'calib.pane.notSure',
	all: 'calib.pane.all'
};

/** The sentence. Numerals in the count; the counted forms for one vowel left are the ratified "last one" forms. */
export function paneSentence(i: PaneSentenceInput, language: Language): string {
	const state = paneState(i);
	if (state === 'below-core') return belowCoreText('calib.pane.belowCore', i.core, language);
	if (state === 'some-fills' || state === 'some-works-out') {
		const m = 10 - i.usable;
		const base = state === 'some-fills' ? 'calib.pane.fills' : 'calib.pane.worksOut';
		return t(m === 1 ? `${base}One` : base, language).replace('{n}', String(i.usable)).replace('{m}', String(m));
	}
	const text = t(KEY[state], language);
	if (state === 'typed-generic') {
		// The Tier 1 id, never a finer label: "a {voiceType} voice" must read with "a" for every type, and a bass who chose octavist reads "a bass voice". A contralto, countertenor, or bass-baritone
		// reads the staff the values came from (`borrowedStaffLabel`; ruling of 2026-11-19, section 6).
		return fillVoiceType(text, borrowedStaffLabel(i.voiceType, language) ?? '', language);
	}
	return text;
}

/** The door to recording, named for the state: 0 usable, 1 to 9, 10. */
export function recordDoorKey(usable: number): string {
	return usable >= 10 ? 'calib.pane.door.again' : usable >= 1 ? 'calib.pane.door.carryOn' : 'calib.pane.door.record';
}

/**
 * "Your vowel space" shows when the voice has a stored reading, or a declared type with placeholder values: the eight types of
 * `PLACEHOLDER_PROFILE_TYPES`, contralto, countertenor, and bass-baritone among them (QUEUE row 167; DESK DEFAULT, brief r4 section 4.6). It does
 * not show for "Not sure" or no type with nothing stored: they take no placeholder profile (ruling of 2026-11-19, section 8).
 */
export function showVowelSpaceDoor(hasStoredReading: boolean, voiceType?: string): boolean {
	return hasStoredReading || hasPlaceholderProfile(voiceType);
}

/** The voice type as the pane's control prints it: the built label, and for "Not sure" (which `voiceTypePrint` leaves empty) its own name. */
export function typeControlLabel(choice: { voiceType?: string; voiceTypeSpecific?: string; voiceTypeOther?: string } | undefined, language: Language): string | undefined {
	const printed = voiceTypePrint(choice, language);
	const label = printed ?? (choice?.voiceType === 'not-sure' ? t('voiceType.type.not-sure', language) : undefined);
	return label ? label.charAt(0).toLocaleUpperCase(language) + label.slice(1) : undefined;
}
